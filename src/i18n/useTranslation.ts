import { create } from 'zustand'
import es from './es.json'
import en from './en.json'

type Lang = 'es' | 'en'

const translations: Record<Lang, Record<string, unknown>> = { es, en }

interface LangStore {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLangStore = create<LangStore>((set) => ({
  lang: (localStorage.getItem('lang') as Lang) || 'es',
  setLang: (lang) => {
    localStorage.setItem('lang', lang)
    set({ lang })
  },
}))

export function useTranslation() {
  const { lang, setLang } = useLangStore()

  function t(key: string): string {
    const keys = key.split('.')
    let value: unknown = translations[lang]
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key
      }
    }
    return typeof value === 'string' ? value : key
  }

  return { t, lang, setLang }
}
