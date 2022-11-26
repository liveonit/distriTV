import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Storage service
 * used for persist application data in observable key value pair
 */
export class StorageService {
  private storage: Storage
  private subjects: Map<string, BehaviorSubject<any>>

  /**
   * Constructor with service injection that load the current storage and creates the observers
   * @param storage
   */
  constructor(storage: Storage) {
    this.storage = storage
    this.subjects = new Map<string, BehaviorSubject<any>>()
    if (storage.length > 0) {
      Object.entries(window.localStorage).forEach(([k, v]) => {
        let value
        try {
          const parsed = JSON.parse(v)
          if (parsed) value = parsed
        } catch (err) {
          value = v
        }
        this.set(k, value)
      })
    }
  }

  /**
   * watch data of given key
   * @param key
   * @param defaultValue
   */
  watch<T>(key: string): Observable<T> {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<T | null>(null))
    }
    const sub = this.subjects.get(key)
    return sub!.asObservable()
  }

  /**
   * get data of given key
   * @param key
   */
  get<T>(key: string): T | null {
    const storageValue = this.storage.getItem(key)
    let item = null
    if (storageValue && storageValue !== 'undefined') {
      item = JSON.parse(storageValue) as T
    }
    return item
  }

  /**
   * set value on given key
   * @param key
   * @param value
   */
  set(key: string, value: any) {
    this.storage.setItem(key, JSON.stringify(value))
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<any>(value))
    } else {
      this.subjects.get(key)!.next(value)
    }
  }

  /**
   * remove given key
   * @param key
   */
  remove(key: string) {
    const sub = this.subjects.get(key)
    if (sub) {
      sub.next(null)
      sub.complete()
      this.subjects.delete(key)
    }
    this.storage.removeItem(key)
  }

  /**
   * clear all available keys
   */
  clear() {
    this.subjects.forEach((sub) => {
      sub.next(null)
      sub.complete()
    })
    this.storage.clear()
  }
}

const localStorage = typeof window !== 'undefined' ? window.localStorage : new Storage()
export const storage = new StorageService(localStorage)
