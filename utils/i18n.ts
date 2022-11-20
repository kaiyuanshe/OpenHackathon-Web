import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en-US.json';
import zh from '../locales/zh-Hans.json';
import zhTW from '../locales/zh-Hant-TW.json';

i18n.use(initReactI18next).init({
  // we init with resources
  resources: {
    'en-US': {
      translations: en,
    },
    'zh-Hans': {
      translations: zh,
    },
    'zh-Hant-TW': {
      translations: zhTW,
    },
  },
  lng: 'zh-Hans',
  fallbackLng: 'en-US',
  debug: true,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false,
  },
});
