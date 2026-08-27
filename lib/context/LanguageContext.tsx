'use client';

import React, { createContext, useContext, useState, useCallback, useSyncExternalStore } from 'react';
import { translations, Language, TranslationKey } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
  isHindi: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'mapporae_lang_v1';

const emptySubscribe = () => () => {};

function getSnapshotLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (stored === 'en' || stored === 'hi') {
      return stored;
    }
    if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('hi')) {
      return 'hi';
    }
  } catch {
    // Ignore
  }
  return 'en';
}

function getServerSnapshotLanguage(): Language {
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const storedLang = useSyncExternalStore(emptySubscribe, getSnapshotLanguage, getServerSnapshotLanguage);
  const [language, setLanguageState] = useState<Language>(storedLang);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Ignore
    }
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
  };

  const t = useCallback(
    (key: TranslationKey | string, fallback?: string): string => {
      const entry = (translations as Record<string, { en: string; hi: string }>)[key];
      if (entry) {
        return entry[language] || entry.en || fallback || key;
      }
      return fallback || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isHindi: language === 'hi',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
