
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '../services/i18nService';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved === 'en' || saved === 'es') return saved;

    // Detectar idioma del navegador
    const browserLang = navigator.language.toLowerCase();
    console.log('🌍 Browser language detected:', browserLang);

    // Detectar español (es, es-ES, es-MX, es-AR, etc.)
    if (browserLang.startsWith('es')) {
      console.log('✅ Spanish detected, setting language to ES');
      return 'es';
    }

    console.log('✅ Default language set to EN');
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
    console.log('🔄 Language changed to:', lang);
  };

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
