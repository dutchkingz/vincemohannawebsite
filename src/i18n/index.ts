// src/i18n/index.ts
import { en } from './en';
import { fr } from './fr';

export type Lang = 'en' | 'fr';
export { en, fr };
export const translations = { en, fr } as const;

/**
 * Retrieves a translation string by dot-separated path (e.g. "nav.about").
 * Falls back to the English value if the path is missing, or the path string itself
 * if the key doesn't exist in English either.
 */
export function getTranslation(lang: Lang, path: string): string {
  const keys = path.split('.');
  const walk = (obj: Record<string, unknown>): string | undefined => {
    let current: unknown = obj;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }
    return typeof current === 'string' ? current : undefined;
  };

  return walk(translations[lang] as Record<string, unknown>)
    ?? walk(translations['en'] as Record<string, unknown>)
    ?? path;
}
