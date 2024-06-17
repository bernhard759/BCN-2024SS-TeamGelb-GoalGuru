import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './translations/en.json';
import deTranslations from './translations/de.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      de: {
        translation: deTranslations,
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language if translation is missing
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;
