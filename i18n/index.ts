import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import RNLanguageDetector from '@os-team/i18next-react-native-language-detector'

import en from './en'
import ja from './ja'

i18n
  .use(RNLanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: en
      },
      ja: {
        translation: ja
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })
export default i18n
