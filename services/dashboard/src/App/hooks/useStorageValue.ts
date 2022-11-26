import React, { useEffect } from 'react'
import { storage } from '@utils/general/Storage'

export const useStorageValue = <T>(key: string) => {
  const [value, setValue] = React.useState<T | null>(storage.get<T>(key))

  useEffect(() => {
    const subscription = storage.watch<T>(key).subscribe((v) => {
      setValue(v)
    })
    return () => subscription.unsubscribe()
  }, [])
  return value
}
