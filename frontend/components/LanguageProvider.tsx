"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Language, translations } from "@/lib/i18n";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("studyai_language");

    if (
      savedLanguage === "en" ||
      savedLanguage === "ru" ||
      savedLanguage === "kz"
    ) {
      setLanguageState(savedLanguage);
    }
  }, []);

  function setLanguage(newLanguage: Language) {
    setLanguageState(newLanguage);
    localStorage.setItem("studyai_language", newLanguage);
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}