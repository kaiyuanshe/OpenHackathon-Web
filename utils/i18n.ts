import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locale/en-US.json';
import zh from '../locale/zh-Hans.json';

i18n.use(initReactI18next).init({
  // we init with resources
  resources: {
    'en-US': {
      translations: en,
    },
    'zh-Hans': {
      translations: zh,
    },
  },
  lng: 'en-US',
  fallbackLng: 'zh-Hans',
  debug: true,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false,
  },
});
