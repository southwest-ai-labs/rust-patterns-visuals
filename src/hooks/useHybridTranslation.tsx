import React, { useState, useEffect } from 'react';
import { useLanguage } from './useLanguage';
import { useChromeTranslation } from './useChromeTranslation';
import { TRANSLATIONS } from '../services/i18nService';

/**
 * Hybrid Translation Hook
 * Prioriza traducciones manuales, usa Chrome Translation API como fallback
 */
export const useHybridTranslation = () => {
  const { language, t: manualT } = useLanguage();
  const { translate: chromeTranslate, status, isAvailable } = useChromeTranslation();

  /**
   * Traduce un string con priorización:
   * 1. Busca en traducciones manuales primero
   * 2. Si no existe y Chrome API está disponible, traduce automáticamente
   * 3. Fallback al texto original
   */
  const translate = async (text: string, forceChrome = false): Promise<string> => {
    if (!text || !text.trim()) return text;

    // Si es inglés, retornar directo
    if (language === 'en') return text;

    // Si no forzamos Chrome, intentar traducciones manuales primero
    if (!forceChrome) {
      // Buscar en traducciones manuales
      const manualKey = Object.keys(TRANSLATIONS.en).find(
        key => TRANSLATIONS.en[key as keyof typeof TRANSLATIONS.en] === text
      );

      if (manualKey) {
        return TRANSLATIONS[language][manualKey as keyof typeof TRANSLATIONS.en] || text;
      }
    }

    // Fallback a Chrome Translation API si está disponible
    if (isAvailable && status === 'ready') {
      try {
        return await chromeTranslate(text);
      } catch (e) {
        console.warn('Chrome translation failed, returning original:', e);
        return text;
      }
    }

    // Último fallback: texto original
    return text;
  };

  return {
    translate,
    language,
    status,
    isAvailable,
    manualT, // Acceso directo a traducciones manuales
  };
};

/**
 * Componente Híbrido de Traducción
 * Usa traducciones manuales si existen, Chrome API si no
 */
export const HT: React.FC<{
  children: string;
  className?: string;
  forceChrome?: boolean; // Forzar uso de Chrome API aunque exista traducción manual
}> = ({ children, className, forceChrome = false }) => {
  const { translate, language, status } = useHybridTranslation();
  const [text, setText] = useState(children);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (language === 'en') {
      setText(children);
      return;
    }

    setIsTranslating(true);
    translate(children, forceChrome).then(result => {
      if (isMounted) {
        setText(result);
        setIsTranslating(false);
      }
    });

    return () => { isMounted = false; };
  }, [children, language, status, forceChrome]);

  return (
    <span className={className} data-translating={isTranslating}>
      {text}
    </span>
  );
};

/**
 * Hook simplificado que retorna solo la función de traducción
 */
export const useT = () => {
  const { translate } = useHybridTranslation();
  return translate;
};
