import type { Locale } from "@/i18n/routing";

export type Localized<T = string> = Record<Locale, T>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value.en;
}
