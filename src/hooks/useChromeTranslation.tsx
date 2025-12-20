
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

interface TranslationContextType {
  isAvailable: boolean;
  status: 'idle' | 'downloading' | 'ready' | 'error';
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
  downloadProgress: number;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translator, setTranslator] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'downloading' | 'ready' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [targetLanguage, setTargetLanguageState] = useState('en');
  const [isAvailable, setIsAvailable] = useState(false);

  // 1. Detect System Language & API Availability on Mount
  useEffect(() => {
    const checkAvailability = async () => {
      if (!('translation' in window)) {
        console.log("Chrome Translation API not supported in this browser.");
        return;
      }

      setIsAvailable(true);

      // Detect system language (e.g., 'es-ES' -> 'es')
      const sysLang = navigator.language.split('-')[0];
      if (sysLang !== 'en') {
        console.log(`System language detected: ${sysLang}. Initializing translator...`);
        await initTranslator(sysLang);
      }
    };

    checkAvailability();
  }, []);

  const initTranslator = async (targetLang: string) => {
    if (!('translation' in window)) return;
    
    // If target is English, we just reset (source is assumed English)
    if (targetLang === 'en') {
        setTargetLanguageState('en');
        setTranslator(null);
        setStatus('idle');
        return;
    }

    try {
        setTargetLanguageState(targetLang);
        setStatus('downloading');
        
        // Check if we can translate
        const canTranslate = await window.translation!.canTranslate({
            sourceLanguage: 'en',
            targetLanguage: targetLang,
        });

        if (canTranslate === 'no') {
            setStatus('error');
            console.warn(`Translation from 'en' to '${targetLang}' not supported.`);
            return;
        }

        // Create Translator
        const newTranslator = await window.translation!.createTranslator({
            sourceLanguage: 'en',
            targetLanguage: targetLang,
        });

        // Handle Model Download
        if (canTranslate === 'after-download') {
            newTranslator.ondownloadprogress = (e: any) => {
                const percentage = (e.loaded / e.total) * 100;
                setDownloadProgress(percentage);
            };
        }

        await newTranslator.ready;
        setTranslator(newTranslator);
        setStatus('ready');
        console.log(`Translator ready: en -> ${targetLang}`);

    } catch (err) {
        console.error("Failed to initialize translator:", err);
        setStatus('error');
    }
  };

  const translate = useCallback(async (text: string): Promise<string> => {
    if (!text || !text.trim()) return text;
    if (targetLanguage === 'en' || !translator) return text;
    
    try {
        return await translator.translate(text);
    } catch (e) {
        // Fallback to original text if translation fails
        return text;
    }
  }, [translator, targetLanguage]);

  return (
    <TranslationContext.Provider value={{ 
        isAvailable, 
        status, 
        targetLanguage, 
        setTargetLanguage: initTranslator, 
        translate,
        downloadProgress
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useChromeTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("useChromeTranslation must be used within TranslationProvider");
  return context;
};

// --- Helper Component for UI Strings ---
export const T: React.FC<{ children: string; className?: string }> = ({ children, className }) => {
    const { translate, targetLanguage, status } = useChromeTranslation();
    const [text, setText] = useState(children);
    
    useEffect(() => {
        let isMounted = true;
        
        if (targetLanguage === 'en' || status !== 'ready') {
            setText(children);
            return;
        }

        // Small cache/optimization could go here
        translate(children).then(res => {
            if (isMounted) setText(res);
        });

        return () => { isMounted = false; };
    }, [children, translate, targetLanguage, status]);

    return <span className={className}>{text}</span>;
};
