import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import hi from "./hi.json";

const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("pragatisahayak_lang") || localStorage.getItem("vyaparmitra_lang");
      if (saved === "hi" || saved === "en") {
        return saved;
      }
    } catch {
      // Ignore localStorage access errors
    }
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already safeguards against XSS
  },
});

// Sync language changes with localStorage
i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("pragatisahayak_lang", lng);
    } catch {
      // Ignore
    }
  }
});

export default i18n;
