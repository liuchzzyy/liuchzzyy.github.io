'use client';

import { useLanguageStore, Language } from '@/lib/stores/languageStore';
import { translations } from './translations';

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  
  return {
    t: translations[language],
    language,
  };
}

export function getTranslation(language: Language) {
  return translations[language];
}
