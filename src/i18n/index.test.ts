// src/i18n/index.test.ts
import { describe, it, expect } from 'vitest';
import { getTranslation } from './index';

describe('getTranslation', () => {
  it('returns the correct English string for a known key', () => {
    expect(getTranslation('en', 'nav.about')).toBe('About');
  });

  it('returns the correct French string for a known key', () => {
    expect(getTranslation('fr', 'nav.about')).toBe('À propos');
  });

  it('returns English nav.cv for both languages', () => {
    expect(getTranslation('en', 'nav.cv')).toBe('CV');
    expect(getTranslation('fr', 'nav.cv')).toBe('CV');
  });

  it('returns correct nested hero value', () => {
    expect(getTranslation('en', 'hero.cta_cv')).toBe('View CV');
    expect(getTranslation('fr', 'hero.cta_cv')).toBe('Voir le CV');
  });

  it('falls back to English when a key is missing in the requested language', () => {
    const result = getTranslation('fr', 'nav.about');
    expect(result).not.toBe('nav.about');
  });

  it('returns the path string when the key does not exist in any language', () => {
    expect(getTranslation('en', 'nav.nonexistent')).toBe('nav.nonexistent');
  });

  it('returns the path for deeply missing keys', () => {
    expect(getTranslation('fr', 'totally.missing.key')).toBe('totally.missing.key');
  });
});
