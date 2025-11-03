import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Language = "en" | "ur";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  isUrdu: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("tadbeer-language");
    return (saved as Language) || "en";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("tadbeer-language", lang);
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "ur" : "en");
  }, [language, setLanguage]);

  const isUrdu = language === "ur";

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, isUrdu }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
