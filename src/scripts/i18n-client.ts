// src/scripts/i18n-client.ts
export type Lang = 'en' | 'fr';

function getNestedValue(
  obj: Record<string, unknown>,
  path: string,
): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function applyLanguage(lang: Lang): void {
  const i18n = (window as Record<string, unknown>).__i18n as
    | Record<string, Record<string, unknown>>
    | undefined;

  if (!i18n) {
    console.warn('i18n translations not loaded on window.__i18n');
    return;
  }

  const translations = i18n[lang];
  if (!translations) return;

  // Swap all elements that have a data-i18n attribute
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const value = getNestedValue(translations, key);
    if (value === undefined) return;

    // Handle inputs/textareas: swap placeholder
    if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement
    ) {
      el.placeholder = value;
    } else {
      el.textContent = value;
    }
  });

  // Update the html lang attribute and store preference
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem('lang', lang);
  (window as Record<string, unknown>).__currentLang = lang;
}

export function getCurrentLang(): Lang {
  return ((window as Record<string, unknown>).__currentLang as Lang) || 'en';
}
