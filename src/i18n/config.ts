export const locales = ['en', 'fr', 'ar', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const rtlLocales: Locale[] = ['ar']
