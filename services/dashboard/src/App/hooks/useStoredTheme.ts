import { storage } from 'src/utils/general/Storage'

import { THEMES } from '../configs'
import { useStorageValue } from './useStorageValue'

export const useStoredTheme = () => {
  let theme = useStorageValue<string>('theme')
  if (!theme) {
    storage.set('theme', THEMES.LIGHT);
    theme = THEMES.LIGHT
  }
  return theme
}
