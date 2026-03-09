// i18n configuration for AccentCoach
const translations = {
    en: { appName: 'AccentCoach', description: 'Pronunciation feedback and practice exercises' },
    de: { appName: 'AccentCoach', description: 'Pronunciation feedback and practice exercises (DE)' },
} as const

export type Locale = keyof typeof translations
export const defaultLocale: Locale = 'en'
export const supportedLocales = Object.keys(translations) as Locale[]

export function t(key: keyof typeof translations.en, locale: Locale = defaultLocale): string {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
}

export default translations
