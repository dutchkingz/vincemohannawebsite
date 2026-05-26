# Professional Website Design Spec
**Date:** 2026-05-25  
**Owner:** Vince Mohanna  
**Status:** Approved

---

## Overview

A single-page professional website for Vince Mohanna, built with Astro in SSR mode. The site showcases academic credentials, work experience, projects, and provides a contact form. It supports English (default) and French (client-side text swap), multiple visual themes, and is hosted on AWS Amplify.

---

## Goals

- Present a polished, corporate professional identity online
- Bilingual (English primary, French secondary — no French SEO required)
- Multiple visual themes (Light / Dark) switchable by the visitor
- Contact form that sends email via Vince's existing SMTP mail server
- Auto-deploy from GitHub via AWS Amplify
- CV PDF downloadable directly from the site

---

## Tech Stack

| Concern | Decision | Reason |
|---|---|---|
| Framework | Astro (SSR mode) | SSR required for contact form API endpoint |
| Styling | CSS custom properties | Theme switching without JS framework overhead |
| Language switching | Client-side JSON swap | English-only SEO, no URL changes needed |
| Hosting | AWS Amplify | Manages build, deploy, CDN, HTTPS, serverless functions |
| Contact backend | Astro API endpoint (`/api/contact`) | Forwards form submissions via SMTP |
| Assets | `public/` folder | Static files served directly by Amplify CDN |

---

## Folder Structure

```
VinceMohannaWebpage/
├── src/
│   ├── components/
│   │   ├── NavBar.astro           # Logo, nav links, language + theme toggles
│   │   ├── Footer.astro           # Links, copyright
│   │   ├── LanguageToggle.astro   # 🌐 icon — swaps EN/FR content client-side
│   │   ├── ThemeToggle.astro      # 🎨 icon — cycles Light/Dark themes
│   │   └── sections/
│   │       ├── Hero.astro         # Name, title, tagline
│   │       ├── About.astro        # Bio paragraph
│   │       ├── Education.astro    # University logos + degrees
│   │       ├── Experience.astro   # Work history timeline
│   │       ├── Projects.astro     # Project/research cards
│   │       ├── CV.astro           # PDF download button
│   │       ├── Blog.astro         # Latest posts preview (3 most recent)
│   │       └── Contact.astro      # Contact form
│   ├── content/
│   │   ├── en/                    # English text content (JSON)
│   │   │   ├── nav.json
│   │   │   ├── hero.json
│   │   │   ├── about.json
│   │   │   ├── education.json
│   │   │   ├── experience.json
│   │   │   ├── projects.json
│   │   │   ├── cv.json
│   │   │   ├── blog.json
│   │   │   └── contact.json
│   │   ├── fr/                    # French translations (JSON, same keys)
│   │   │   ├── nav.json
│   │   │   ├── hero.json
│   │   │   ├── about.json
│   │   │   ├── education.json
│   │   │   ├── experience.json
│   │   │   ├── projects.json
│   │   │   ├── cv.json
│   │   │   ├── blog.json
│   │   │   └── contact.json
│   │   └── blog/                  # Blog post files (Markdown)
│   │       └── YYYY-MM-DD-post-title.md
│   ├── layouts/
│   │   └── BaseLayout.astro       # HTML shell, meta tags, font imports, theme init
│   ├── pages/
│   │   ├── index.astro            # Single page — all sections composed here
│   │   ├── blog/
│   │   │   ├── index.astro        # Blog listing page (/blog)
│   │   │   └── [slug].astro       # Individual blog post page (/blog/post-title)
│   │   └── api/
│   │       └── contact.ts         # SMTP endpoint — receives form POST, sends email
│   └── styles/
│       ├── global.css             # Base styles, typography, layout
│       └── themes.css             # CSS custom properties for Light / Dark themes
├── public/
│   ├── images/                    # University logos (McGill, TMU, Lund)
│   └── documents/
│       └── cvApr2026_tech.pdf     # Downloadable CV
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-25-professional-website-design.md
├── .env.example                   # SMTP credentials template (never commit .env)
├── astro.config.mjs               # Astro config with AWS Amplify adapter
├── amplify.yml                    # AWS Amplify build config
└── package.json
```

---

## Page Sections (top → bottom)

| Section | Content |
|---|---|
| **NavBar** | Vince's name/logo left · About, Education, Experience, Projects, CV, Contact links center · 🌐 lang toggle + 🎨 theme toggle right |
| **Hero** | Full-width banner · Name, professional title, one-line tagline · CTA buttons (View CV, Contact Me) |
| **About** | 2–3 paragraph bio |
| **Education** | University logo + degree + year for each institution (McGill, TMU/Ryerson, Lund University) |
| **Experience** | Vertical timeline of professional roles |
| **Projects** | Card grid of research/projects with title, description, optional link |
| **CV** | Centered section with download button → `public/documents/cvApr2026_tech.pdf` |
| **Blog** | Preview of 3 most recent posts with title, date, excerpt · "View all posts" link → `/blog` |
| **Contact** | Form: Name, Email, Message · Submit → POST `/api/contact` → SMTP |
| **Footer** | Copyright, LinkedIn, GitHub (or other social links) |

---

## Language Switching

- **Default language:** English (rendered at build time)
- **French:** All French translations are **bundled inline** into the page HTML as a JS object at build time — no network request on toggle, instant swap
- **Trigger:** 🌐 globe icon in NavBar top-right
- **Persistence:** Language preference saved to `localStorage`
- **Scope:** All visible text (nav labels, section headings, body copy, button labels, form placeholders)
- **Not translated:** CV PDF, university logo alt text, Vince's name

---

## Theme Switching

- **Themes:** Light (default), Dark
- **Mechanism:** `data-theme="light|dark"` attribute on `<html>` element
- **CSS:** All colors defined as CSS custom properties in `themes.css`; switching the attribute instantly re-skins the whole page
- **Trigger:** 🎨 icon in NavBar top-right
- **Persistence:** Theme preference saved to `localStorage`; applied before first paint (inline script in `<head>`) to avoid flash of wrong theme

---

## Contact Form & SMTP

- **Form fields:** Name, Email, Message (all required)
- **Submission:** `fetch()` POST to `/api/contact`
- **API endpoint** (`src/pages/api/contact.ts`):
  - Validates fields server-side
  - Connects to Vince's SMTP server using credentials from environment variables
  - Sends email to Vince's inbox
  - Returns JSON `{ success: true }` or error message
- **UX:** Loading state on submit button; success/error message shown inline
- **SMTP credentials** stored as environment variables in AWS Amplify console (never in code):
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `CONTACT_TO_EMAIL`

---

## AWS Amplify Deployment

- **Trigger:** Push to `main` branch on GitHub → Amplify auto-builds and deploys
- **Build command:** `npm run build`
- **Output directory:** `dist/`
- **Astro adapter:** `@astrojs/aws` (Amplify target)
- **Environment variables:** Set in Amplify Console (SMTP credentials, etc.)
- **Custom domain:** Configured in Amplify Console
- **HTTPS:** Managed automatically by Amplify

---

## Existing Assets

These files already exist and will be moved to `public/`:

| Current path | New path |
|---|---|
| `images/mcgill.png` | `public/images/mcgill.png` |
| `images/TMU.avif` | `public/images/TMU.avif` |
| `images/tmu.jpeg` | `public/images/tmu.jpeg` |
| `images/ryerson.jpg` | `public/images/ryerson.jpg` |
| `images/Lunds_universitets.jpg` | `public/images/Lunds_universitets.jpg` |
| `images/Lunds-Universitet.jpg` | `public/images/Lunds-Universitet.jpg` |
| `images/Lund-University.jpg` | `public/images/Lund-University.jpg` |
| `documents/cvApr2026_tech.pdf` | `public/documents/cvApr2026_tech.pdf` |

---

## Blog Details

- Blog posts written in **Markdown** files (`src/content/blog/YYYY-MM-DD-title.md`)
- Main page shows a **preview** of the 3 most recent posts
- Full blog listing at `/blog` — all posts, sorted by date
- Individual post pages at `/blog/[slug]`
- Blog UI labels (headings, "Read more", dates) are translated via EN/FR JSON files
- Post content itself is English only (no translated post bodies required)

---

## Out of Scope

- French SEO / French URL routing
- User authentication
- CMS / admin panel
- Analytics (can be added later via Amplify or a script tag)
