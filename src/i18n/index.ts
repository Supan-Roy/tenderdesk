import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '@/types';
import { en, TranslationKeys } from './en';
import { bn } from './bn';

const translations: Record<Language, TranslationKeys> = {
  en,
  bn,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return React.createElement(I18nContext.Provider, { value }, children);
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
