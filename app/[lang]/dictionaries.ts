import 'server-only'
import { notFound } from 'next/navigation'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  es: () => import('./dictionaries/es.json').then((m) => m.default),
}

export type Locale = keyof typeof dictionaries

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export async function getDictionary(locale: string) {
  if (!hasLocale(locale)) notFound()
  return dictionaries[locale]()
}