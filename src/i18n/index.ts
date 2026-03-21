import en from "./en.json";
import zh from "./zh.json";
import de from "./de.json";

export const SUPPORTED_LOCALES = ["en", "zh", "de"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

const translations: Record<Locale, Record<string, string>> = { en, zh, de };

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations[DEFAULT_LOCALE][key] ?? key;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split("/");
  if (SUPPORTED_LOCALES.includes(lang as Locale)) {
    return lang as Locale;
  }
  return DEFAULT_LOCALE;
}

export function localizeUrl(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
