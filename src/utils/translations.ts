import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { initAndHook } from "./index";

const getTranslationConfig = (resources: any): any => ({
  resources,
  lng: "en",
  keySeparator: false,
  interpolation: {
    escapeValue: false
  },
  fallbackLng: "en",
  ns: ["translations"],
  defaultNS: "translations"
});

export const setLanguage = (language: string): void => {
  i18n.changeLanguage(language ? language : "en");
};

const getLanguageCode = locale => locale.split("_")[0];

export const initI18n = (
  resources: any,
  locale: string,
  hookFunction: Function
): void => {
  i18n.use(initReactI18next).init(getTranslationConfig(resources));
  initAndHook(getLanguageCode(locale), hookFunction, setLanguage);
};
