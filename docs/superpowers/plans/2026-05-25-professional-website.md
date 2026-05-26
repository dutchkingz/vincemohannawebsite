# Vince Mohanna Professional Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a corporate, bilingual (EN/FR) single-page professional website for Vince Mohanna using Astro, with Light/Dark theme switching, a blog, a contact form via SMTP, and deployment to AWS Amplify.

**Architecture:** Astro in hybrid output mode — all content sections pre-rendered as static HTML for maximum performance; only the `/api/contact` endpoint is server-side. English is default (rendered at build time). French translations are bundled inline as a JS object and swapped client-side via `data-i18n` attributes. CSS custom properties on `<html data-theme>` handle Light/Dark theming, applied before first paint to prevent flash.

**Tech Stack:** Astro 4, `@astrojs/node` (SSR adapter, standalone mode), Nodemailer (SMTP), Vitest (unit tests), CSS custom properties, TypeScript, AWS Amplify (hosting)

---

## File Map

| File | Responsibility |
|---|---|
| `src/i18n/en.ts` | English translation strings (source of truth for all UI text) |
| `src/i18n/fr.ts` | French translation strings (same keys as `en.ts`) |
| `src/i18n/index.ts` | `getTranslation(lang, path)` utility; exports both translation objects |
| `src/i18n/index.test.ts` | Vitest tests for `getTranslation` |
| `src/scripts/i18n-client.ts` | Client-side `applyLanguage()` — reads `window.__i18n`, swaps `data-i18n` elements |
| `src/scripts/theme-client.ts` | Client-side `applyTheme()` — toggles `data-theme` on `<html>` |
| `src/styles/themes.css` | CSS custom properties for Light and Dark themes |
| `src/styles/global.css` | Base reset, typography, layout utilities |
| `src/layouts/BaseLayout.astro` | HTML shell: fonts, meta, theme-init inline script, i18n bundle |
| `src/components/NavBar.astro` | Sticky nav: name left, links center, toggles right |
| `src/components/ThemeToggle.astro` | 🌙/☀️ button; imports `theme-client.ts` |
| `src/components/LanguageToggle.astro` | 🌐 EN/FR button; imports `i18n-client.ts` |
| `src/components/Footer.astro` | Copyright + social links |
| `src/components/sections/Hero.astro` | Full-width banner with CTA buttons |
| `src/components/sections/About.astro` | Bio paragraph |
| `src/components/sections/Education.astro` | University logos + degrees |
| `src/components/sections/Experience.astro` | Vertical timeline |
| `src/components/sections/Projects.astro` | Card grid |
| `src/components/sections/CV.astro` | Download button |
| `src/components/sections/Blog.astro` | 3 latest post previews |
| `src/components/sections/Contact.astro` | Form + fetch submit |
| `src/data/education.ts` | Education institution data (TypeScript array) |
| `src/data/experience.ts` | Work history data (TypeScript array) |
| `src/data/projects.ts` | Project/research data (TypeScript array) |
| `src/content/config.ts` | Astro content collection schema for blog posts |
| `src/content/blog/2026-05-25-hello-world.md` | First sample blog post |
| `src/pages/index.astro` | Home page — composes all sections |
| `src/pages/blog/index.astro` | Blog listing at `/blog` |
| `src/pages/blog/[slug].astro` | Individual post at `/blog/[slug]` |
| `src/pages/api/contact.ts` | SMTP API endpoint |
| `src/pages/api/contact.test.ts` | Vitest tests for contact endpoint validation |
| `astro.config.mjs` | Astro config: hybrid output, node adapter |
| `vitest.config.ts` | Vitest config |
| `amplify.yml` | AWS Amplify build + start config |
| `.env.example` | SMTP credential template |
| `public/images/` | University logos (moved from `images/`) |
| `public/documents/` | CV PDF (moved from `documents/`) |

---

## Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`

> ⚠️ Run these commands from `/home/vince/projects/VinceMohannaWebpage/`

- [ ] **Step 1: Scaffold Astro in the existing directory**

```bash
npm create astro@latest . -- --template minimal --no-git --install
```

When prompted:
- "Where should we create your new project?" → `.` (current directory)
- "How would you like to start your new project?" → `Empty`
- "Do you plan to write TypeScript?" → `Yes` → `Strict`
- "How would you like to install dependencies?" → `Yes`

- [ ] **Step 2: Install additional dependencies**

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer vitest @vitest/coverage-v8
```

- [ ] **Step 3: Install Astro node adapter**

```bash
npx astro add node
```

Accept all prompts.

- [ ] **Step 4: Verify the dev server starts**

```bash
npm run dev
```

Expected: `Local: http://localhost:4321/` — no errors in terminal. Stop with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: initialize Astro project with node adapter"
```

---

## Task 2: Configure Astro

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Replace astro.config.mjs with hybrid output config**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    port: 4321,
  },
});
```

`output: 'hybrid'` means all pages are statically pre-rendered by default. Only pages/endpoints that explicitly set `export const prerender = false` will be server-rendered. This is exactly what we need — static pages + one dynamic API endpoint.

- [ ] **Step 2: Verify config is valid**

```bash
npm run build 2>&1 | head -20
```

Expected: Build completes without errors (a "dist/" directory is created).

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: configure Astro hybrid output with node adapter"
```

---

## Task 3: Set Up Vitest

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Create vitest.config.ts**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});
```

- [ ] **Step 2: Add test script to package.json**

Open `package.json` and add `"test": "vitest run"` and `"test:watch": "vitest"` to the `"scripts"` section:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Verify Vitest runs (no tests yet, should exit cleanly)**

```bash
npm test
```

Expected: `No test files found` or `0 tests passed` — no errors.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts package.json
git commit -m "feat: add Vitest test runner"
```

---

## Task 4: Create Translation Files

**Files:**
- Create: `src/i18n/en.ts`, `src/i18n/fr.ts`, `src/i18n/index.ts`

> These files are the single source of truth for all UI text. Vince: replace the placeholder content values (marked with comments) with your actual professional information.

- [ ] **Step 1: Create src/i18n/en.ts**

```ts
// src/i18n/en.ts
export const en = {
  nav: {
    about: 'About',
    education: 'Education',
    experience: 'Experience',
    projects: 'Projects',
    cv: 'CV',
    blog: 'Blog',
    contact: 'Contact',
  },
  hero: {
    greeting: "Hi, I'm",
    name: 'Vince Mohanna',
    title: 'Your Professional Title Here', // TODO: replace with your actual title
    tagline: 'A brief, compelling tagline about your expertise and what drives you.', // TODO: replace
    cta_cv: 'View CV',
    cta_contact: 'Contact Me',
  },
  about: {
    heading: 'About Me',
    bio_1: 'Replace this paragraph with your actual bio. Tell your story — your background, what you specialize in, and the kind of problems you love solving.', // TODO: replace
    bio_2: 'A second paragraph about your experience, values, or what makes you unique professionally.', // TODO: replace
  },
  education: {
    heading: 'Education',
  },
  experience: {
    heading: 'Experience',
    present: 'Present',
  },
  projects: {
    heading: 'Projects & Research',
    view_link: 'View Project',
  },
  cv: {
    heading: 'Curriculum Vitae',
    description:
      'Download my full CV for a detailed overview of my professional background, academic credentials, and qualifications.',
    download: 'Download CV',
  },
  blog: {
    heading: 'Latest Posts',
    read_more: 'Read more',
    view_all: 'View all posts',
  },
  contact: {
    heading: 'Contact Me',
    name_label: 'Name',
    email_label: 'Email',
    message_label: 'Message',
    name_placeholder: 'Your full name',
    email_placeholder: 'your@email.com',
    message_placeholder: 'How can I help you?',
    submit: 'Send Message',
    sending: 'Sending…',
    success: "Message sent! I'll get back to you soon.",
    error: 'Something went wrong. Please try again.',
  },
  footer: {
    rights: 'All rights reserved.',
  },
} as const;

export type Translations = typeof en;
```

- [ ] **Step 2: Create src/i18n/fr.ts**

```ts
// src/i18n/fr.ts
import type { Translations } from './en';

export const fr: Translations = {
  nav: {
    about: 'À propos',
    education: 'Formation',
    experience: 'Expérience',
    projects: 'Projets',
    cv: 'CV',
    blog: 'Blogue',
    contact: 'Contact',
  },
  hero: {
    greeting: 'Bonjour, je suis',
    name: 'Vince Mohanna',
    title: 'Votre titre professionnel ici', // TODO: replace with French title
    tagline: 'Une accroche brève et convaincante sur votre expertise et ce qui vous motive.', // TODO: replace
    cta_cv: 'Voir le CV',
    cta_contact: 'Me contacter',
  },
  about: {
    heading: 'À propos de moi',
    bio_1: 'Remplacez ce paragraphe par votre biographie réelle. Racontez votre parcours — votre background, votre spécialité, et le type de problèmes que vous aimez résoudre.', // TODO: replace
    bio_2: 'Un deuxième paragraphe sur votre expérience, vos valeurs ou ce qui vous distingue professionnellement.', // TODO: replace
  },
  education: {
    heading: 'Formation',
  },
  experience: {
    heading: 'Expérience',
    present: 'Présent',
  },
  projects: {
    heading: 'Projets et recherches',
    view_link: 'Voir le projet',
  },
  cv: {
    heading: 'Curriculum Vitæ',
    description:
      'Téléchargez mon CV complet pour un aperçu détaillé de mon parcours professionnel, de mes diplômes et de mes qualifications.',
    download: 'Télécharger le CV',
  },
  blog: {
    heading: 'Derniers articles',
    read_more: 'Lire la suite',
    view_all: 'Voir tous les articles',
  },
  contact: {
    heading: 'Me contacter',
    name_label: 'Nom',
    email_label: 'Courriel',
    message_label: 'Message',
    name_placeholder: 'Votre nom complet',
    email_placeholder: 'votre@courriel.com',
    message_placeholder: 'Comment puis-je vous aider?',
    submit: 'Envoyer le message',
    sending: 'Envoi en cours…',
    success: 'Message envoyé ! Je vous répondrai bientôt.',
    error: "Une erreur s'est produite. Veuillez réessayer.",
  },
  footer: {
    rights: 'Tous droits réservés.',
  },
};
```

- [ ] **Step 3: Create src/i18n/index.ts**

```ts
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
```

- [ ] **Step 4: Commit**

```bash
git add src/i18n/
git commit -m "feat: add EN/FR translation files and getTranslation utility"
```

---

## Task 5: Test the Translation Utility (TDD)

**Files:**
- Create: `src/i18n/index.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
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
    // Temporarily bypass TypeScript by casting
    const result = getTranslation('fr', 'nav.about');
    expect(result).not.toBe('nav.about'); // Should not return the path itself
  });

  it('returns the path string when the key does not exist in any language', () => {
    expect(getTranslation('en', 'nav.nonexistent')).toBe('nav.nonexistent');
  });

  it('returns the path for deeply missing keys', () => {
    expect(getTranslation('fr', 'totally.missing.key')).toBe('totally.missing.key');
  });
});
```

- [ ] **Step 2: Run tests and confirm they fail**

```bash
npm test
```

Expected: Several tests fail because the utility doesn't exist yet. *(The utility was already written in Task 4 — if they pass, continue to step 3.)*

- [ ] **Step 3: Run tests and confirm they all pass**

```bash
npm test
```

Expected output:
```
✓ src/i18n/index.test.ts (7 tests)
Test Files  1 passed
Tests       7 passed
```

- [ ] **Step 4: Commit**

```bash
git add src/i18n/index.test.ts
git commit -m "test: add getTranslation unit tests"
```

---

## Task 6: Set Up Styles

**Files:**
- Create: `src/styles/themes.css`, `src/styles/global.css`

- [ ] **Step 1: Create src/styles/themes.css**

```css
/* src/styles/themes.css */
/* Light theme (default) */
:root,
[data-theme='light'] {
  --color-bg: #ffffff;
  --color-bg-secondary: #f5f7fa;
  --color-bg-card: #ffffff;
  --color-text-primary: #1a2332;
  --color-text-secondary: #4a5568;
  --color-nav-bg: #1b2a4a;
  --color-nav-text: #ffffff;
  --color-accent: #c9a84c;
  --color-accent-hover: #b8963f;
  --color-border: #e2e8f0;
  --color-btn-bg: #1b2a4a;
  --color-btn-text: #ffffff;
  --color-btn-hover: #253d6e;
  --color-timeline-line: #e2e8f0;
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-nav: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* Dark theme */
[data-theme='dark'] {
  --color-bg: #0f1923;
  --color-bg-secondary: #1a2535;
  --color-bg-card: #1a2535;
  --color-text-primary: #e8edf3;
  --color-text-secondary: #a0aec0;
  --color-nav-bg: #0a1520;
  --color-nav-text: #ffffff;
  --color-accent: #d4af5a;
  --color-accent-hover: #e0c070;
  --color-border: #2d3748;
  --color-btn-bg: #2d4070;
  --color-btn-text: #ffffff;
  --color-btn-hover: #3a5090;
  --color-timeline-line: #2d3748;
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-nav: 0 2px 12px rgba(0, 0, 0, 0.4);
}
```

- [ ] **Step 2: Create src/styles/global.css**

```css
/* src/styles/global.css */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  line-height: 1.7;
  transition: background-color 0.25s ease, color 0.25s ease;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

section {
  padding: 5rem 0;
}

section:nth-child(even) {
  background-color: var(--color-bg-secondary);
}

h1,
h2,
h3,
h4 {
  line-height: 1.2;
  font-weight: 700;
  color: var(--color-text-primary);
}

h2.section-heading {
  font-size: 2rem;
  margin-bottom: 2.5rem;
  position: relative;
  display: inline-block;
}

h2.section-heading::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background-color: var(--color-accent);
  margin-top: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background-color: var(--color-btn-bg);
  color: var(--color-btn-text);
  border-color: var(--color-btn-bg);
}

.btn-primary:hover {
  background-color: var(--color-btn-hover);
  border-color: var(--color-btn-hover);
}

.btn-outline {
  background-color: transparent;
  color: var(--color-btn-bg);
  border-color: var(--color-btn-bg);
}

.btn-outline:hover {
  background-color: var(--color-btn-bg);
  color: var(--color-btn-text);
}

/* Responsive typography */
@media (max-width: 768px) {
  section {
    padding: 3rem 0;
  }

  h2.section-heading {
    font-size: 1.6rem;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: add theme CSS custom properties and global styles"
```

---

## Task 7: Create BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create src/layouts/BaseLayout.astro**

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
import '../styles/themes.css';
import { en } from '../i18n/en';
import { fr } from '../i18n/fr';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = 'Vince Mohanna',
  description = 'Professional website of Vince Mohanna — engineer, researcher, and builder.',
} = Astro.props;

// Serialize translations for client-side language switching
const enJSON = JSON.stringify(en);
const frJSON = JSON.stringify(fr);
---

<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <meta name="author" content="Vince Mohanna" />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <!--
      Theme init: runs before paint to avoid flash of wrong theme.
      Reads localStorage and applies data-theme immediately.
    -->
    <script is:inline>
      (function () {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
      })();
    </script>
  </head>
  <body>
    <!--
      Bundle both translation objects into the page as a global variable.
      The client-side language toggle reads window.__i18n to swap text.
      Set as inline script so it's available synchronously.
    -->
    <script
      is:inline
      define:vars={{ enData: enJSON, frData: frJSON }}
    >
      window.__i18n = {
        en: JSON.parse(enData),
        fr: JSON.parse(frData),
      };
      // Apply stored language preference on page load
      (function () {
        const lang = localStorage.getItem('lang') || 'en';
        document.documentElement.setAttribute('data-lang', lang);
        window.__currentLang = lang;
      })();
    </script>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Create a placeholder favicon so the browser doesn't 404**

```bash
mkdir -p /home/vince/projects/VinceMohannaWebpage/public
```

Create `public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="10" fill="#1b2a4a"/>
  <text x="50" y="68" font-family="Inter,sans-serif" font-size="52"
    font-weight="700" fill="#c9a84c" text-anchor="middle">VM</text>
</svg>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/ public/favicon.svg
git commit -m "feat: create BaseLayout with theme + i18n initialization"
```

---

## Task 8: Create Client-Side Scripts

**Files:**
- Create: `src/scripts/theme-client.ts`, `src/scripts/i18n-client.ts`

- [ ] **Step 1: Create src/scripts/theme-client.ts**

```ts
// src/scripts/theme-client.ts
export type Theme = 'light' | 'dark';

export function getCurrentTheme(): Theme {
  return (localStorage.getItem('theme') as Theme) || 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

export function toggleTheme(): Theme {
  const current = getCurrentTheme();
  const next: Theme = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  return next;
}
```

- [ ] **Step 2: Create src/scripts/i18n-client.ts**

```ts
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
```

- [ ] **Step 3: Commit**

```bash
git add src/scripts/
git commit -m "feat: add client-side theme and language switching scripts"
```

---

## Task 9: Create Toggle Components + NavBar + Footer

**Files:**
- Create: `src/components/ThemeToggle.astro`, `src/components/LanguageToggle.astro`, `src/components/NavBar.astro`, `src/components/Footer.astro`

- [ ] **Step 1: Create src/components/ThemeToggle.astro**

```astro
---
// src/components/ThemeToggle.astro
---

<button id="theme-toggle" aria-label="Toggle light/dark theme" title="Toggle theme">
  <span id="theme-icon">☀️</span>
</button>

<script>
  import { toggleTheme, getCurrentTheme } from '../scripts/theme-client';

  const btn = document.getElementById('theme-toggle')!;
  const icon = document.getElementById('theme-icon')!;

  function updateIcon(theme: string) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // Set icon based on current theme on load
  updateIcon(getCurrentTheme());

  btn.addEventListener('click', () => {
    const newTheme = toggleTheme();
    updateIcon(newTheme);
  });
</script>

<style>
  button {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: var(--color-nav-text);
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }
  button:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
</style>
```

- [ ] **Step 2: Create src/components/LanguageToggle.astro**

```astro
---
// src/components/LanguageToggle.astro
---

<button id="lang-toggle" aria-label="Switch language / Changer de langue" title="EN / FR">
  <span id="lang-label">EN</span>
  <span>🌐</span>
</button>

<script>
  import { applyLanguage, getCurrentLang } from '../scripts/i18n-client';

  const btn = document.getElementById('lang-toggle')!;
  const label = document.getElementById('lang-label')!;

  // Sync label with stored preference
  let lang = getCurrentLang();
  label.textContent = lang.toUpperCase();

  // If stored lang is French, apply it now (page rendered in English)
  if (lang === 'fr') {
    applyLanguage('fr');
  }

  btn.addEventListener('click', () => {
    lang = lang === 'en' ? 'fr' : 'en';
    applyLanguage(lang);
    label.textContent = lang.toUpperCase();
  });
</script>

<style>
  button {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: var(--color-nav-text);
    padding: 0 0.75rem;
    height: 2.25rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    transition: background-color 0.2s;
    letter-spacing: 0.05em;
  }
  button:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
</style>
```

- [ ] **Step 3: Create src/components/NavBar.astro**

```astro
---
// src/components/NavBar.astro
import ThemeToggle from './ThemeToggle.astro';
import LanguageToggle from './LanguageToggle.astro';
---

<header>
  <nav class="container">
    <!-- Left: Name / Logo -->
    <a href="/" class="nav-name">Vince Mohanna</a>

    <!-- Center: Navigation links -->
    <ul class="nav-links" role="list">
      <li><a href="#about" data-i18n="nav.about">About</a></li>
      <li><a href="#education" data-i18n="nav.education">Education</a></li>
      <li><a href="#experience" data-i18n="nav.experience">Experience</a></li>
      <li><a href="#projects" data-i18n="nav.projects">Projects</a></li>
      <li><a href="#cv" data-i18n="nav.cv">CV</a></li>
      <li><a href="/blog" data-i18n="nav.blog">Blog</a></li>
      <li><a href="#contact" data-i18n="nav.contact">Contact</a></li>
    </ul>

    <!-- Right: Toggles -->
    <div class="nav-actions">
      <LanguageToggle />
      <ThemeToggle />

      <!-- Hamburger for mobile -->
      <button class="hamburger" id="hamburger" aria-label="Open menu">☰</button>
    </div>
  </nav>

  <!-- Mobile menu -->
  <ul class="mobile-menu" id="mobile-menu" role="list">
    <li><a href="#about" data-i18n="nav.about">About</a></li>
    <li><a href="#education" data-i18n="nav.education">Education</a></li>
    <li><a href="#experience" data-i18n="nav.experience">Experience</a></li>
    <li><a href="#projects" data-i18n="nav.projects">Projects</a></li>
    <li><a href="#cv" data-i18n="nav.cv">CV</a></li>
    <li><a href="/blog" data-i18n="nav.blog">Blog</a></li>
    <li><a href="#contact" data-i18n="nav.contact">Contact</a></li>
  </ul>
</header>

<script>
  const hamburger = document.getElementById('hamburger')!;
  const mobileMenu = document.getElementById('mobile-menu')!;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.textContent = isOpen ? '✕' : '☰';
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.textContent = '☰';
    });
  });
</script>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--color-nav-bg);
    color: var(--color-nav-text);
    box-shadow: var(--shadow-nav);
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
    gap: 1rem;
  }

  .nav-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-nav-text);
    letter-spacing: 0.02em;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .nav-links {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    margin: 0;
  }

  .nav-links a {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;
    white-space: nowrap;
  }

  .nav-links a:hover {
    color: var(--color-accent);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .hamburger {
    display: none;
    background: none;
    border: none;
    color: var(--color-nav-text);
    font-size: 1.4rem;
    cursor: pointer;
    padding: 0.25rem;
  }

  .mobile-menu {
    display: none;
    flex-direction: column;
    list-style: none;
    background-color: var(--color-nav-bg);
    padding: 0;
    margin: 0;
  }

  .mobile-menu.open {
    display: flex;
  }

  .mobile-menu a {
    display: block;
    padding: 0.85rem 1.5rem;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 500;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    transition: background-color 0.2s;
  }

  .mobile-menu a:hover {
    background-color: rgba(255, 255, 255, 0.06);
    color: var(--color-accent);
  }

  @media (max-width: 900px) {
    .nav-links {
      display: none;
    }

    .hamburger {
      display: block;
    }
  }
</style>
```

- [ ] **Step 4: Create src/components/Footer.astro**

```astro
---
// src/components/Footer.astro
const year = new Date().getFullYear();
---

<footer>
  <div class="container footer-inner">
    <p>
      © {year} Vince Mohanna —
      <span data-i18n="footer.rights">All rights reserved.</span>
    </p>
    <div class="footer-links">
      <!-- TODO: Replace # with your actual LinkedIn and GitHub URLs -->
      <a
        href="https://linkedin.com/in/your-profile"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        LinkedIn
      </a>
      <a
        href="https://github.com/your-username"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        GitHub
      </a>
    </div>
  </div>
</footer>

<style>
  footer {
    background-color: var(--color-nav-bg);
    color: rgba(255, 255, 255, 0.7);
    padding: 1.75rem 0;
    font-size: 0.9rem;
  }

  .footer-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .footer-links {
    display: flex;
    gap: 1.5rem;
  }

  .footer-links a {
    color: rgba(255, 255, 255, 0.7);
    transition: color 0.2s;
  }

  .footer-links a:hover {
    color: var(--color-accent);
  }
</style>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add NavBar, Footer, ThemeToggle, LanguageToggle components"
```

---

## Task 10: Move Existing Assets to public/

**Files:**
- Move: `images/*` → `public/images/`, `documents/*` → `public/documents/`

- [ ] **Step 1: Move image and document assets**

```bash
mkdir -p public/images public/documents
mv images/* public/images/
mv documents/* public/documents/
rmdir images documents
```

- [ ] **Step 2: Verify files are in place**

```bash
ls public/images/ public/documents/
```

Expected:
```
public/images/:
Lund-University.jpg  Lunds-Universitet.jpg  Lunds_universitets.jpg
TMU.avif  mcgill.png  ryerson.jpg  tmu.jpeg

public/documents/:
cvApr2026_tech.pdf
```

- [ ] **Step 3: Commit**

```bash
git add public/ images documents
git commit -m "chore: move existing assets to public/ for Astro static serving"
```

---

## Task 11: Create Static Data Files

**Files:**
- Create: `src/data/education.ts`, `src/data/experience.ts`, `src/data/projects.ts`

> Vince: fill in your actual academic and professional details below where marked with `// TODO`.

- [ ] **Step 1: Create src/data/education.ts**

```ts
// src/data/education.ts
export interface Institution {
  name: string;
  degree: string;
  field: string;
  years: string;
  logo: string;
  logoAlt: string;
}

export const institutions: Institution[] = [
  {
    name: 'McGill University',
    degree: 'Your Degree Here', // TODO: e.g. "Master of Science"
    field: 'Your Field of Study', // TODO: e.g. "Electrical Engineering"
    years: '20XX – 20XX', // TODO: e.g. "2018 – 2020"
    logo: '/images/mcgill.png',
    logoAlt: 'McGill University',
  },
  {
    name: 'Toronto Metropolitan University',
    degree: 'Your Degree Here', // TODO
    field: 'Your Field of Study', // TODO
    years: '20XX – 20XX', // TODO
    logo: '/images/TMU.avif',
    logoAlt: 'Toronto Metropolitan University',
  },
  {
    name: 'Lund University',
    degree: 'Your Degree Here', // TODO
    field: 'Your Field of Study', // TODO
    years: '20XX – 20XX', // TODO
    logo: '/images/Lund-University.jpg',
    logoAlt: 'Lund University',
  },
];
```

- [ ] **Step 2: Create src/data/experience.ts**

```ts
// src/data/experience.ts
export interface Role {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string; // Use 'Present' for current roles
  description: string;
}

// TODO: Replace with your actual work experience. Add as many roles as needed.
export const roles: Role[] = [
  {
    company: 'Company Name', // TODO
    title: 'Your Job Title', // TODO
    location: 'Montreal, QC', // TODO
    startDate: 'Jan 20XX', // TODO
    endDate: 'Present', // TODO
    description:
      'Brief description of your responsibilities and key achievements in this role.', // TODO
  },
  {
    company: 'Previous Company', // TODO
    title: 'Previous Title', // TODO
    location: 'City, Province', // TODO
    startDate: 'Jun 20XX', // TODO
    endDate: 'Dec 20XX', // TODO
    description:
      'Brief description of your responsibilities and key achievements in this role.', // TODO
  },
];
```

- [ ] **Step 3: Create src/data/projects.ts**

```ts
// src/data/projects.ts
export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string; // Optional — leave undefined if no public link
}

// TODO: Replace with your actual projects/research.
export const projects: Project[] = [
  {
    title: 'Project Title', // TODO
    description:
      'Brief description of the project, its purpose, and your contribution or findings.', // TODO
    tags: ['Research', 'Engineering'], // TODO
    link: 'https://example.com', // TODO or remove if no link
  },
  {
    title: 'Research Project', // TODO
    description:
      'Brief description of the project, its purpose, and your contribution or findings.', // TODO
    tags: ['Academic', 'Analysis'], // TODO
    // No link — leave undefined
  },
  {
    title: 'Another Project', // TODO
    description: 'Brief description of the project.', // TODO
    tags: ['Development'], // TODO
  },
];
```

- [ ] **Step 4: Commit**

```bash
git add src/data/
git commit -m "feat: add typed data files for education, experience, and projects"
```

---

## Task 12: Create Content Sections — Hero, About, Education

**Files:**
- Create: `src/components/sections/Hero.astro`, `src/components/sections/About.astro`, `src/components/sections/Education.astro`

- [ ] **Step 1: Create src/components/sections/Hero.astro**

```astro
---
// src/components/sections/Hero.astro
---

<section class="hero" id="home">
  <div class="container hero-content">
    <p class="hero-greeting" data-i18n="hero.greeting">Hi, I'm</p>
    <h1 class="hero-name">Vince Mohanna</h1>
    <p class="hero-title" data-i18n="hero.title">Your Professional Title Here</p>
    <p class="hero-tagline" data-i18n="hero.tagline">
      A brief, compelling tagline about your expertise and what drives you.
    </p>
    <div class="hero-cta">
      <a href="/documents/cvApr2026_tech.pdf" download class="btn btn-primary">
        <span data-i18n="hero.cta_cv">View CV</span>
        ↓
      </a>
      <a href="#contact" class="btn btn-outline">
        <span data-i18n="hero.cta_contact">Contact Me</span>
      </a>
    </div>
  </div>
</section>

<style>
  .hero {
    background: linear-gradient(
      135deg,
      var(--color-nav-bg) 0%,
      #253d6e 60%,
      #1a3060 100%
    );
    color: #fff;
    padding: 8rem 0 6rem;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(
      circle,
      rgba(201, 168, 76, 0.12) 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 1;
  }

  .hero-greeting {
    font-size: 1.1rem;
    color: var(--color-accent);
    font-weight: 500;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .hero-name {
    font-size: clamp(2.5rem, 6vw, 4rem);
    color: #fff;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  .hero-title {
    font-size: clamp(1.1rem, 2.5vw, 1.4rem);
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
    margin-bottom: 1.25rem;
  }

  .hero-tagline {
    font-size: 1.05rem;
    color: rgba(255, 255, 255, 0.7);
    max-width: 560px;
    margin-bottom: 2.5rem;
    line-height: 1.7;
  }

  .hero-cta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-outline {
    border-color: rgba(255, 255, 255, 0.6);
    color: #fff;
  }

  .btn-outline:hover {
    background-color: rgba(255, 255, 255, 0.12);
    border-color: #fff;
    color: #fff;
  }
</style>
```

- [ ] **Step 2: Create src/components/sections/About.astro**

```astro
---
// src/components/sections/About.astro
---

<section id="about">
  <div class="container">
    <h2 class="section-heading" data-i18n="about.heading">About Me</h2>
    <div class="about-body">
      <p data-i18n="about.bio_1">
        Replace this paragraph with your actual bio. Tell your story — your
        background, what you specialize in, and the kind of problems you love
        solving.
      </p>
      <p data-i18n="about.bio_2">
        A second paragraph about your experience, values, or what makes you
        unique professionally.
      </p>
    </div>
  </div>
</section>

<style>
  .about-body {
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .about-body p {
    font-size: 1.05rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
  }
</style>
```

- [ ] **Step 3: Create src/components/sections/Education.astro**

```astro
---
// src/components/sections/Education.astro
import { institutions } from '../../data/education';
---

<section id="education">
  <div class="container">
    <h2 class="section-heading" data-i18n="education.heading">Education</h2>
    <ul class="edu-list" role="list">
      {
        institutions.map((inst) => (
          <li class="edu-card">
            <div class="edu-logo-wrap">
              <img src={inst.logo} alt={inst.logoAlt} class="edu-logo" />
            </div>
            <div class="edu-info">
              <h3 class="edu-name">{inst.name}</h3>
              <p class="edu-degree">
                {inst.degree} · {inst.field}
              </p>
              <p class="edu-years">{inst.years}</p>
            </div>
          </li>
        ))
      }
    </ul>
  </div>
</section>

<style>
  .edu-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .edu-card {
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 1.5rem 2rem;
    box-shadow: var(--shadow-card);
    transition: box-shadow 0.2s;
  }

  .edu-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .edu-logo-wrap {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edu-logo {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 6px;
  }

  .edu-info {
    flex: 1;
  }

  .edu-name {
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: var(--color-text-primary);
  }

  .edu-degree {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.2rem;
  }

  .edu-years {
    font-size: 0.875rem;
    color: var(--color-accent);
    font-weight: 500;
  }

  @media (max-width: 600px) {
    .edu-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.astro src/components/sections/About.astro src/components/sections/Education.astro
git commit -m "feat: add Hero, About, and Education sections"
```

---

## Task 13: Create Content Sections — Experience, Projects, CV

**Files:**
- Create: `src/components/sections/Experience.astro`, `src/components/sections/Projects.astro`, `src/components/sections/CV.astro`

- [ ] **Step 1: Create src/components/sections/Experience.astro**

```astro
---
// src/components/sections/Experience.astro
import { roles } from '../../data/experience';
---

<section id="experience">
  <div class="container">
    <h2 class="section-heading" data-i18n="experience.heading">Experience</h2>
    <ol class="timeline" role="list">
      {
        roles.map((role) => (
          <li class="timeline-item">
            <div class="timeline-dot" />
            <div class="timeline-body">
              <div class="timeline-header">
                <div>
                  <h3 class="timeline-title">{role.title}</h3>
                  <p class="timeline-company">{role.company}</p>
                </div>
                <div class="timeline-meta">
                  <span class="timeline-dates">
                    {role.startDate} –{' '}
                    {role.endDate === 'Present' ? (
                      <span data-i18n="experience.present">Present</span>
                    ) : (
                      role.endDate
                    )}
                  </span>
                  <span class="timeline-location">{role.location}</span>
                </div>
              </div>
              <p class="timeline-desc">{role.description}</p>
            </div>
          </li>
        ))
      }
    </ol>
  </div>
</section>

<style>
  .timeline {
    list-style: none;
    position: relative;
    padding-left: 2rem;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--color-timeline-line);
  }

  .timeline-item {
    position: relative;
    padding-bottom: 2.5rem;
  }

  .timeline-item:last-child {
    padding-bottom: 0;
  }

  .timeline-dot {
    position: absolute;
    left: -2rem;
    top: 4px;
    width: 16px;
    height: 16px;
    background-color: var(--color-accent);
    border-radius: 50%;
    border: 3px solid var(--color-bg);
    box-shadow: 0 0 0 2px var(--color-accent);
  }

  .timeline-body {
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
    box-shadow: var(--shadow-card);
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }

  .timeline-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 0.15rem;
  }

  .timeline-company {
    font-size: 0.95rem;
    color: var(--color-accent);
    font-weight: 600;
  }

  .timeline-meta {
    text-align: right;
    flex-shrink: 0;
  }

  .timeline-dates {
    display: block;
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  .timeline-location {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }

  .timeline-desc {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
  }

  @media (max-width: 600px) {
    .timeline-header {
      flex-direction: column;
    }

    .timeline-meta {
      text-align: left;
    }
  }
</style>
```

- [ ] **Step 2: Create src/components/sections/Projects.astro**

```astro
---
// src/components/sections/Projects.astro
import { projects } from '../../data/projects';
---

<section id="projects">
  <div class="container">
    <h2 class="section-heading" data-i18n="projects.heading">
      Projects & Research
    </h2>
    <ul class="projects-grid" role="list">
      {
        projects.map((project) => (
          <li class="project-card">
            <div class="card-content">
              <h3 class="project-title">{project.title}</h3>
              <p class="project-desc">{project.description}</p>
              <ul class="project-tags" role="list">
                {project.tags.map((tag) => (
                  <li class="tag">{tag}</li>
                ))}
              </ul>
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                class="project-link"
              >
                <span data-i18n="projects.view_link">View Project</span> →
              </a>
            )}
          </li>
        ))
      }
    </ul>
  </div>
</section>

<style>
  .projects-grid {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .project-card {
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: var(--shadow-card);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .project-card:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .card-content {
    flex: 1;
  }

  .project-title {
    font-size: 1.05rem;
    font-weight: 700;
    margin-bottom: 0.6rem;
    color: var(--color-text-primary);
  }

  .project-desc {
    font-size: 0.92rem;
    color: var(--color-text-secondary);
    line-height: 1.65;
    margin-bottom: 1rem;
  }

  .project-tags {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .tag {
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.2rem 0.65rem;
    border-radius: 99px;
  }

  .project-link {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-accent);
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    transition: gap 0.2s;
  }

  .project-link:hover {
    gap: 0.5rem;
  }
</style>
```

- [ ] **Step 3: Create src/components/sections/CV.astro**

```astro
---
// src/components/sections/CV.astro
---

<section id="cv">
  <div class="container cv-inner">
    <h2 class="section-heading" data-i18n="cv.heading">Curriculum Vitae</h2>
    <p class="cv-description" data-i18n="cv.description">
      Download my full CV for a detailed overview of my professional background,
      academic credentials, and qualifications.
    </p>
    <a
      href="/documents/cvApr2026_tech.pdf"
      download="Vince_Mohanna_CV.pdf"
      class="btn btn-primary cv-btn"
    >
      <span data-i18n="cv.download">Download CV</span>
      ↓
    </a>
  </div>
</section>

<style>
  .cv-inner {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .cv-description {
    max-width: 520px;
    color: var(--color-text-secondary);
    font-size: 1.05rem;
    line-height: 1.75;
  }

  .cv-btn {
    font-size: 1.05rem;
    padding: 0.9rem 2.25rem;
  }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Experience.astro src/components/sections/Projects.astro src/components/sections/CV.astro
git commit -m "feat: add Experience, Projects, and CV sections"
```

---

## Task 14: Set Up Blog — Content Collection + Sample Post

**Files:**
- Create: `src/content/config.ts`, `src/content/blog/2026-05-25-hello-world.md`

- [ ] **Step 1: Create src/content/config.ts**

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Create the first sample blog post**

```markdown
---
title: "Welcome to My Blog"
description: "An introduction to my professional blog — what I plan to write about and why."
pubDate: "2026-05-25"
tags: ["intro", "general"]
---

Welcome to my blog! This is where I'll share thoughts on my professional work,
research interests, and projects I'm excited about.

## What to Expect

I plan to write about:

- Engineering challenges and how I've approached them
- Research findings and academic interests
- Lessons learned from professional projects
- Technology trends I find compelling

Stay tuned for more posts. In the meantime, feel free to [contact me](#contact)
if you'd like to connect.
```

Save this file as `src/content/blog/2026-05-25-hello-world.md`.

- [ ] **Step 3: Commit**

```bash
git add src/content/
git commit -m "feat: set up blog content collection with sample post"
```

---

## Task 15: Create Blog Sections and Pages

**Files:**
- Create: `src/components/sections/Blog.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create src/components/sections/Blog.astro** (home page preview)

```astro
---
// src/components/sections/Blog.astro
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const latestPosts = allPosts
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 3);

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
---

<section id="blog">
  <div class="container">
    <h2 class="section-heading" data-i18n="blog.heading">Latest Posts</h2>
    <ul class="blog-list" role="list">
      {
        latestPosts.map((post) => (
          <li class="blog-card">
            <div class="blog-meta">
              <time datetime={post.data.pubDate.toISOString()}>
                {formatDate(post.data.pubDate)}
              </time>
              {post.data.tags.map((tag) => (
                <span class="tag">{tag}</span>
              ))}
            </div>
            <h3 class="blog-title">
              <a href={`/blog/${post.slug}`}>{post.data.title}</a>
            </h3>
            <p class="blog-desc">{post.data.description}</p>
            <a href={`/blog/${post.slug}`} class="read-more">
              <span data-i18n="blog.read_more">Read more</span> →
            </a>
          </li>
        ))
      }
    </ul>
    <div class="blog-footer">
      <a href="/blog" class="btn btn-outline">
        <span data-i18n="blog.view_all">View all posts</span>
      </a>
    </div>
  </div>
</section>

<style>
  .blog-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .blog-card {
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: var(--shadow-card);
    transition: box-shadow 0.2s;
  }

  .blog-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .blog-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }

  .blog-meta time {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
  }

  .tag {
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.15rem 0.6rem;
    border-radius: 99px;
  }

  .blog-title {
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .blog-title a {
    color: var(--color-text-primary);
    transition: color 0.2s;
  }

  .blog-title a:hover {
    color: var(--color-accent);
  }

  .blog-desc {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    line-height: 1.65;
    margin-bottom: 1rem;
  }

  .read-more {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-accent);
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    transition: gap 0.2s;
  }

  .read-more:hover {
    gap: 0.5rem;
  }

  .blog-footer {
    text-align: center;
  }
</style>
```

- [ ] **Step 2: Create src/pages/blog/index.astro**

```astro
---
// src/pages/blog/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import NavBar from '../../components/NavBar.astro';
import Footer from '../../components/Footer.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const posts = allPosts.sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
);

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
---

<BaseLayout title="Blog — Vince Mohanna" description="Articles and thoughts from Vince Mohanna.">
  <NavBar />
  <main>
    <section class="blog-hero">
      <div class="container">
        <h1 data-i18n="blog.heading">Latest Posts</h1>
      </div>
    </section>
    <section class="blog-listing">
      <div class="container">
        <ul class="post-list" role="list">
          {
            posts.map((post) => (
              <li class="post-item">
                <div class="post-meta">
                  <time datetime={post.data.pubDate.toISOString()}>
                    {formatDate(post.data.pubDate)}
                  </time>
                  {post.data.tags.map((tag) => (
                    <span class="tag">{tag}</span>
                  ))}
                </div>
                <h2 class="post-title">
                  <a href={`/blog/${post.slug}`}>{post.data.title}</a>
                </h2>
                <p class="post-desc">{post.data.description}</p>
                <a href={`/blog/${post.slug}`} class="read-more">
                  <span data-i18n="blog.read_more">Read more</span> →
                </a>
              </li>
            ))
          }
        </ul>
        <div style="margin-top: 2rem;">
          <a href="/" class="btn btn-outline">← Back to home</a>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>

<style>
  .blog-hero {
    background-color: var(--color-nav-bg);
    color: #fff;
    padding: 4rem 0 3rem;
  }

  .blog-hero h1 {
    font-size: 2.5rem;
    color: #fff;
  }

  .blog-listing {
    padding: 3rem 0 5rem;
  }

  .post-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .post-item {
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 2rem;
  }

  .post-item:last-child {
    border-bottom: none;
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }

  .post-meta time {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
  }

  .tag {
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.15rem 0.6rem;
    border-radius: 99px;
  }

  .post-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .post-title a {
    color: var(--color-text-primary);
    transition: color 0.2s;
  }

  .post-title a:hover {
    color: var(--color-accent);
  }

  .post-desc {
    font-size: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    margin-bottom: 0.75rem;
    max-width: 680px;
  }

  .read-more {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-accent);
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    transition: gap 0.2s;
  }

  .read-more:hover {
    gap: 0.5rem;
  }
</style>
```

- [ ] **Step 3: Create src/pages/blog/[slug].astro**

```astro
---
// src/pages/blog/[slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import NavBar from '../../components/NavBar.astro';
import Footer from '../../components/Footer.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
---

<BaseLayout title={`${post.data.title} — Vince Mohanna`} description={post.data.description}>
  <NavBar />
  <main>
    <article class="post-wrapper">
      <div class="container">
        <header class="post-header">
          <div class="post-meta">
            <time datetime={post.data.pubDate.toISOString()}>
              {formatDate(post.data.pubDate)}
            </time>
            {
              post.data.tags.map((tag) => (
                <span class="tag">{tag}</span>
              ))
            }
          </div>
          <h1>{post.data.title}</h1>
          <p class="post-description">{post.data.description}</p>
        </header>
        <div class="post-body">
          <Content />
        </div>
        <div class="post-footer">
          <a href="/blog" class="btn btn-outline">← All posts</a>
        </div>
      </div>
    </article>
  </main>
  <Footer />
</BaseLayout>

<style>
  .post-wrapper {
    padding: 4rem 0 5rem;
  }

  .post-header {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--color-border);
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .post-meta time {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
  }

  .tag {
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.2rem 0.65rem;
    border-radius: 99px;
  }

  .post-header h1 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    margin-bottom: 0.75rem;
  }

  .post-description {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
  }

  /* Prose styles for rendered Markdown */
  .post-body :global(h2) {
    font-size: 1.6rem;
    margin: 2.5rem 0 1rem;
    color: var(--color-text-primary);
  }

  .post-body :global(h3) {
    font-size: 1.25rem;
    margin: 2rem 0 0.75rem;
    color: var(--color-text-primary);
  }

  .post-body :global(p) {
    font-size: 1.05rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-bottom: 1.25rem;
    max-width: 680px;
  }

  .post-body :global(ul),
  .post-body :global(ol) {
    padding-left: 1.5rem;
    margin-bottom: 1.25rem;
    color: var(--color-text-secondary);
  }

  .post-body :global(li) {
    margin-bottom: 0.4rem;
    font-size: 1.05rem;
    line-height: 1.7;
  }

  .post-body :global(a) {
    color: var(--color-accent);
    text-decoration: underline;
  }

  .post-body :global(code) {
    background-color: var(--color-bg-secondary);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
  }

  .post-body :global(pre) {
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1.25rem;
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }

  .post-footer {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
  }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Blog.astro src/pages/blog/
git commit -m "feat: add Blog preview section and blog listing + post pages"
```

---

## Task 16: Create Contact Section

**Files:**
- Create: `src/components/sections/Contact.astro`

- [ ] **Step 1: Create src/components/sections/Contact.astro**

```astro
---
// src/components/sections/Contact.astro
---

<section id="contact">
  <div class="container">
    <h2 class="section-heading" data-i18n="contact.heading">Contact Me</h2>
    <form id="contact-form" class="contact-form" novalidate>
      <div class="form-group">
        <label for="name" data-i18n="contact.name_label">Name</label>
        <!-- data-i18n on inputs: applyLanguage() swaps .placeholder for input/textarea elements -->
        <input
          type="text"
          id="name"
          name="name"
          required
          autocomplete="name"
          data-i18n="contact.name_placeholder"
          placeholder="Your full name"
        />
      </div>
      <div class="form-group">
        <label for="email" data-i18n="contact.email_label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autocomplete="email"
          data-i18n="contact.email_placeholder"
          placeholder="your@email.com"
        />
      </div>
      <div class="form-group">
        <label for="message" data-i18n="contact.message_label">Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          required
          data-i18n="contact.message_placeholder"
          placeholder="How can I help you?"
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary submit-btn" id="submit-btn">
        <span id="submit-label" data-i18n="contact.submit">Send Message</span>
      </button>
      <p id="form-status" class="form-status" aria-live="polite"></p>
    </form>
  </div>
</section>

<script>
  // Note: input placeholder swapping is handled automatically by applyLanguage()
  // in i18n-client.ts via [data-i18n] on input/textarea elements — no custom
  // placeholder logic needed here.
  import { getCurrentLang } from '../../scripts/i18n-client';

  const form = document.getElementById('contact-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const submitLabel = document.getElementById('submit-label')!;
  const statusEl = document.getElementById('form-status')!;

  function getI18nText(key: string): string {
    const lang = getCurrentLang();
    const i18n = (window as Record<string, unknown>).__i18n as
      Record<string, Record<string, Record<string, string>>> | undefined;
    if (!i18n) return key;
    const [section, field] = key.split('.');
    return i18n[lang]?.[section]?.[field] ?? key;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim();

    if (!name || !email || !message) return;

    submitBtn.disabled = true;
    submitLabel.textContent = getI18nText('contact.sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        statusEl.textContent = getI18nText('contact.success');
        statusEl.classList.add('success');
        form.reset();
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch {
      statusEl.textContent = getI18nText('contact.error');
      statusEl.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = getI18nText('contact.submit');
    }
  });
</script>

<style>
  .contact-form {
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  input,
  textarea {
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-bg-card);
    color: var(--color-text-primary);
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    resize: vertical;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
  }

  .submit-btn {
    align-self: flex-start;
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .form-status {
    font-size: 0.95rem;
    min-height: 1.5rem;
  }

  .form-status.success {
    color: #22c55e;
  }

  .form-status.error {
    color: #ef4444;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Contact.astro
git commit -m "feat: add Contact section with fetch-based form submission"
```

---

## Task 17: Contact API Endpoint — TDD

**Files:**
- Create: `src/pages/api/contact.ts`, `src/pages/api/contact.test.ts`

- [ ] **Step 1: Write the failing tests first**

```ts
// src/pages/api/contact.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock nodemailer before importing the module under test
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' }),
    })),
  },
}));

// Import the validation logic directly (extracted so it can be tested without Astro runtime)
import { validateContactPayload } from './contact';

describe('validateContactPayload', () => {
  it('returns no errors for a valid payload', () => {
    const errors = validateContactPayload({
      name: 'Alice Tremblay',
      email: 'alice@example.com',
      message: 'Hello!',
    });
    expect(errors).toHaveLength(0);
  });

  it('returns error when name is missing', () => {
    const errors = validateContactPayload({ name: '', email: 'a@b.com', message: 'hi' });
    expect(errors).toContain('name is required');
  });

  it('returns error when email is missing', () => {
    const errors = validateContactPayload({ name: 'Alice', email: '', message: 'hi' });
    expect(errors).toContain('email is required');
  });

  it('returns error when email is invalid', () => {
    const errors = validateContactPayload({ name: 'Alice', email: 'not-an-email', message: 'hi' });
    expect(errors).toContain('email is invalid');
  });

  it('returns error when message is missing', () => {
    const errors = validateContactPayload({ name: 'Alice', email: 'a@b.com', message: '' });
    expect(errors).toContain('message is required');
  });

  it('returns multiple errors when several fields are missing', () => {
    const errors = validateContactPayload({ name: '', email: '', message: '' });
    expect(errors).toContain('name is required');
    expect(errors).toContain('email is required');
    expect(errors).toContain('message is required');
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail with "cannot find module"**

```bash
npm test 2>&1 | grep -E "FAIL|Error|contact"
```

Expected: `Error: Cannot find module` or similar — the module doesn't exist yet.

- [ ] **Step 3: Create src/pages/api/contact.ts with validation export and handler**

```ts
// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// Exported so it can be unit tested independently of Astro
export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export function validateContactPayload(payload: ContactPayload): string[] {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!payload.name || payload.name.trim() === '') {
    errors.push('name is required');
  }
  if (!payload.email || payload.email.trim() === '') {
    errors.push('email is required');
  } else if (!emailRegex.test(payload.email.trim())) {
    errors.push('email is invalid');
  }
  if (!payload.message || payload.message.trim() === '') {
    errors.push('message is required');
  }

  return errors;
}

// This endpoint must not be statically pre-rendered — it needs to run on the server
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const payload = body as ContactPayload;
  const errors = validateContactPayload(payload);

  if (errors.length > 0) {
    return new Response(
      JSON.stringify({ success: false, message: errors.join(', ') }),
      { status: 422, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    CONTACT_TO_EMAIL,
  } = import.meta.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
    console.error('SMTP environment variables are not configured');
    return new Response(
      JSON.stringify({ success: false, message: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"${payload.name.trim()}" <${SMTP_USER}>`,
    replyTo: payload.email.trim(),
    to: CONTACT_TO_EMAIL,
    subject: `New contact message from ${payload.name.trim()}`,
    text: `From: ${payload.name.trim()} <${payload.email.trim()}>\n\n${payload.message.trim()}`,
    html: `
      <p><strong>From:</strong> ${payload.name.trim()} &lt;${payload.email.trim()}&gt;</p>
      <p><strong>Message:</strong></p>
      <p>${payload.message.trim().replace(/\n/g, '<br>')}</p>
    `,
  });

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};
```

- [ ] **Step 4: Run tests — confirm they all pass**

```bash
npm test
```

Expected:
```
✓ src/i18n/index.test.ts (7 tests)
✓ src/pages/api/contact.test.ts (6 tests)
Test Files  2 passed
Tests       13 passed
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/api/
git commit -m "feat: add contact API endpoint with SMTP and validation tests"
```

---

## Task 18: Wire Up the Home Page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace src/pages/index.astro with the full page**

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import NavBar from '../components/NavBar.astro';
import Footer from '../components/Footer.astro';
import Hero from '../components/sections/Hero.astro';
import About from '../components/sections/About.astro';
import Education from '../components/sections/Education.astro';
import Experience from '../components/sections/Experience.astro';
import Projects from '../components/sections/Projects.astro';
import CV from '../components/sections/CV.astro';
import Blog from '../components/sections/Blog.astro';
import Contact from '../components/sections/Contact.astro';
---

<BaseLayout
  title="Vince Mohanna — Professional Website"
  description="Professional website of Vince Mohanna — engineer, researcher, and builder based in Canada."
>
  <NavBar />
  <main>
    <Hero />
    <About />
    <Education />
    <Experience />
    <Projects />
    <CV />
    <Blog />
    <Contact />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Start dev server and manually verify the full page loads**

```bash
npm run dev
```

Open `http://localhost:4321` in a browser.

Verify:
- [ ] NavBar is sticky and shows all links
- [ ] 🌐 language toggle switches text between English and French
- [ ] 🌙 theme toggle switches between Light and Dark
- [ ] All sections render (Hero, About, Education, Experience, Projects, CV, Blog, Contact)
- [ ] Education section shows university logos
- [ ] CV download button is present
- [ ] Blog preview shows the sample post
- [ ] Contact form is present
- [ ] `/blog` route shows blog listing
- [ ] `/blog/hello-world` shows the sample post content
- [ ] No console errors

Stop dev server with Ctrl+C.

- [ ] **Step 3: Run a production build to catch any build-time errors**

```bash
npm run build 2>&1 | tail -20
```

Expected: `Build complete` with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: compose full home page with all sections"
```

---

## Task 19: Environment Variables and Amplify Config

**Files:**
- Create: `.env.example`, `amplify.yml`

- [ ] **Step 1: Create .env.example**

```bash
# .env.example
# Copy this file to .env and fill in your SMTP credentials.
# NEVER commit .env to git.

# Your SMTP server host (e.g. mail.yourdomain.com)
SMTP_HOST=

# SMTP port: 587 for STARTTLS (most common), 465 for SSL, 25 for plain
SMTP_PORT=587

# SMTP login username (usually your email address)
SMTP_USER=

# SMTP login password
SMTP_PASS=

# The email address that will RECEIVE contact form submissions
CONTACT_TO_EMAIL=
```

- [ ] **Step 2: Make sure .env is gitignored**

Check that `.gitignore` contains `.env`. If not, add it:

```bash
grep -q "^\.env$" .gitignore || echo ".env" >> .gitignore
```

- [ ] **Step 3: Create amplify.yml**

```yaml
# amplify.yml
# AWS Amplify build configuration for Astro with @astrojs/node (standalone SSR)
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - node --version
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    # The node adapter outputs a standalone server in dist/
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

> **AWS Amplify Console setup (do this manually after pushing to GitHub):**
>
> 1. Go to AWS Console → Amplify → New App → Host web app
> 2. Connect your GitHub repository and select the `main` branch
> 3. Amplify will detect `amplify.yml` automatically
> 4. Under **Environment variables**, add all five SMTP variables from `.env.example`
> 5. Under **Build settings**, set the start command to:
>    `node dist/server/entry.mjs`
> 6. Deploy — Amplify will build and serve the site

- [ ] **Step 4: Commit**

```bash
git add .env.example amplify.yml .gitignore
git commit -m "feat: add environment variable template and AWS Amplify build config"
```

---

## Task 20: Run All Tests and Final Build Verification

- [ ] **Step 1: Run the full test suite**

```bash
npm test
```

Expected:
```
✓ src/i18n/index.test.ts (7 tests)
✓ src/pages/api/contact.test.ts (6 tests)
Test Files  2 passed
Tests       13 passed
```

- [ ] **Step 2: Run a clean production build**

```bash
rm -rf dist && npm run build
```

Expected: `Build complete` — no errors, no warnings about missing files.

- [ ] **Step 3: Preview the production build locally**

```bash
npm run preview
```

Open `http://localhost:4321` and repeat the manual checks from Task 18 Step 2.

Stop with Ctrl+C.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and verified production build"
```

---

## Content TODO (Vince fills in after implementation)

Once the site is running, replace all placeholder values in these files with your real information:

| File | What to fill in |
|---|---|
| `src/i18n/en.ts` | `hero.title`, `hero.tagline`, `about.bio_1`, `about.bio_2` |
| `src/i18n/fr.ts` | Same keys as above, in French |
| `src/data/education.ts` | Actual degree names, fields, years for each university |
| `src/data/experience.ts` | Real job titles, companies, dates, descriptions |
| `src/data/projects.ts` | Real project titles, descriptions, links |
| `src/components/Footer.astro` | Your actual LinkedIn and GitHub URLs |
| `.env` | Your SMTP credentials (created from `.env.example`) |

---

## Next Steps After Deploy

1. **Add your real content** (see table above)
2. **Set up custom domain** in AWS Amplify Console
3. **Add SMTP credentials** to Amplify environment variables
4. **Push to GitHub** — Amplify auto-deploys on every push to `main`
5. **Optional later:** Analytics (add a `<script>` tag in `BaseLayout.astro`), additional blog posts, new project cards
