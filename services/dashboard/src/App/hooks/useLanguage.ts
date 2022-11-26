import { storage } from 'src/utils/general/Storage'

import { LANGUAGE } from '../configs'
import { useStorageValue } from './useStorageValue'

export const useStoredLanguage = () => {
  let language = useStorageValue<string>('language')
  if (!language) {
    storage.set('language', LANGUAGE.ENGLISH);
    language = LANGUAGE.ENGLISH
  }
  return language
}
