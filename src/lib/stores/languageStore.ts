import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Language = 'en' | 'zh';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      // Default to English
      language: 'en',
      setLanguage: (language: Language) => {
        set({ language });
      },
      toggleLanguage: () => {
        const current = get().language;
        const newLanguage = current === 'en' ? 'zh' : 'en';
        set({ language: newLanguage });
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => { },
          removeItem: () => { },
        };
      }),
    }
  )
);
