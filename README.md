# gen-web — Gen Li's Personal Website

Personal website for Gen Li: PhD researcher at TU Munich (energy systems optimization), Accross Cycling Club manager, reader, and guitarist.

Live: **[gen-web-seven.vercel.app](https://gen-web-seven.vercel.app)** *(custom domain pending)*

---

## Design

- **Style**: Black & white minimalist, academic/magazine feel, generous whitespace
- **Accent**: `#E63946` (cycling red) — links, hovers, CTAs
- **Typography**: Playfair Display (headings) + Inter (body)
- **Principle**: Progressive Disclosure — reduce cognitive load, reward scrolling
- **References**: taniarascia.com (structure) + joshwcomeau.com (warmth)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Astro v5 (SSG) |
| Styling | CSS Custom Properties + Tailwind (utilities) |
| Content | Astro Content Collections (Markdown) |
| Deployment | Vercel |
| Fonts | Google Fonts: Playfair Display, Inter |

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

Deploy:
```bash
vercel --prod
```

---

## Project Structure

```
gen-web/
├── public/
│   ├── fonts/                  # Self-hosted fonts (Noto Sans SC - future)
│   ├── images/projects/        # Project screenshots (drop PNGs here)
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Nav.astro           # Sticky nav, theme toggle, mobile hamburger
│   │   └── Footer.astro        # GitHub · LinkedIn · Email · RSS
│   ├── content/
│   │   └── posts/              # Blog posts as Markdown files
│   ├── i18n/
│   │   └── index.ts            # Locale utilities (EN default, ZH/DE Phase 9)
│   ├── layouts/
│   │   ├── BaseLayout.astro    # HTML shell, SEO meta, OG tags
│   │   └── PostLayout.astro    # Blog post wrapper with reading time
│   ├── pages/
│   │   ├── index.astro         # Homepage: Hero, Recent Posts, Projects
│   │   ├── posts/
│   │   │   ├── index.astro     # Posts list (year-grouped)
│   │   │   └── [...slug].astro # Post detail
│   │   ├── projects.astro      # Bento box project grid
│   │   ├── hobbies.astro       # Cycling, reading, guitar (Phase 5)
│   │   ├── about.astro         # About page (Phase 6)
│   │   └── rss.xml.ts          # RSS feed
│   └── styles/
│       └── global.css          # Design tokens (CSS Custom Properties)
├── implementation-plan.md      # Full design spec + backlog
├── progress.md                 # Phase tracker
└── AGENTS.md                   # Coding rules for AI agents
```

---

## Design Tokens

```css
--bg: #FAFAFA           /* page background */
--fg: #1A1A1A           /* primary text */
--fg-muted: #6B6B6B     /* secondary text, dates */
--accent: #E63946       /* cycling red — links, hovers */
--accent-soft: rgba(230,57,70,0.08)
--border: #E5E5E5
--surface: #F5F5F5
--container-width: 720px
--font-heading: 'Playfair Display', Georgia, serif
--font-body: 'Inter', system-ui, sans-serif
```

Dark mode uses `.theme-dark` on `<html>`, persisted in `localStorage`. No FOUC (inline script in `<head>`).

---

## Adding Content

**New blog post** — create `src/content/posts/my-post.md`:
```markdown
---
title: "Post Title"
description: "Short description"
pubDate: 2026-03-21
tags: ["research", "cycling"]
---

Post body here.
```

**New project image** — drop a PNG into `public/images/projects/<id>.png` and set `image: "/images/projects/<id>.png"` in `projects.astro`.

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| 1 — Foundation | ✅ Done | Astro setup, global layout, design system |
| 2 — Homepage | ✅ Done | Hero, recent posts, selected projects |
| 3 — Blog | ✅ Done | Posts list, post detail, RSS |
| 4 — Projects | ✅ Done | Bento box grid |
| 5 — Hobbies | 🔲 Next | Cycling, reading, guitar |
| 6 — About | 🔲 | Personal narrative, toolbox |
| 7 — Dark mode | 🔲 | Polish toggle, no FOUC |
| 8 — Production | 🔲 | Custom domain, Lighthouse |
| 9 — i18n | 🔲 | EN/ZH/DE routing + GitHub Action auto-translation |

**Backlog**: Posts filter by tag, sort by name/date · Strava API · OG images · View Transitions
