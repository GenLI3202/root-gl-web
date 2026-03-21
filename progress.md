# gen-web — Progress

> Single source of truth for project status. Update after every task.

## Project Overview

- **Created**: 2026-03-21
- **Tech Stack**: Astro v5 · TypeScript · Tailwind CSS · CSS Custom Properties
- **Live URL**: https://root-ligen.vercel.app
- **Status**: 🟢 Active

## Current Architecture

| Layer | Responsibility | Key Files |
|-------|---------------|-----------|
| Pages | Route definitions, data fetching | `src/pages/` |
| Layouts | HTML skeleton, Nav, Footer | `src/layouts/BaseLayout.astro`, `PostLayout.astro` |
| Components | Reusable UI elements | `src/components/Nav.astro`, `Footer.astro` |
| Content | Blog posts (Markdown) | `src/content/posts/` |
| Styles | Design tokens, global CSS | `src/styles/global.css` |
| i18n | Locale utilities + JSON translations, `localeSwitchUrl()` | `src/i18n/index.ts`, `en/zh/de.json` |
| Locale pages | Dynamic `[locale]` routes for ZH/DE (index, about, projects, hobbies) | `src/pages/[locale]/` |

## Completed Features

- [x] **Phase 1** — Astro v5 project scaffold + global layout
  - Nav (sticky, theme toggle, mobile hamburger), Footer, BaseLayout with full SEO meta
  - Design token system: `--accent: #E63946`, Playfair Display + Inter, dark mode via `.theme-dark`
  - CSS Custom Properties + Tailwind setup, Google Fonts
  - Content Collections schema (`src/content.config.ts`)
  - i18n deferred to Phase 9; lang switcher shows EN-only for now

- [x] **Phase 2** — Homepage
  - Hero: Playfair Display "Gen Li", tagline, 4 identity pill tags (⚡🚴📖🎸)
  - Recent Writing: taniarascia-style row list, fetched from Content Collections
  - Selected Projects: 3-card list with tags, hover arrow

- [x] **Phase 3** — Blog system
  - `/posts/` — year-grouped list, title + date, hover-red
  - `/posts/[slug]/` — PostLayout with reading time, tags, prose styles, "← All posts"
  - 3 sample posts: optimization/research, Munich cycling, wuxia/reading
  - `rss.xml` — fully functional RSS feed

- [x] **Phase 4** — Projects page (Bento Box)
  - Bento grid layout: large (MAMODA, 2-col), tall (EV Optimizer, 2-row), small (ACC ClubHub, This Website)
  - Gradient color backgrounds (images drop-in ready: `public/images/projects/`)
  - Cover-link pattern (no nested `<a>`), "Live ↗" badge for ACC ClubHub
  - Patent badge for EV Optimizer
  - Projects: MAMODA Dashboard, EV Charging Optimizer (PCT WO2025026594), ACC ClubHub, This Website

## Completed Features (continued)

- [x] **Phase 5** — Hobbies page (cycling stats + Strava/ACC links, reading author cards + 微信读书, guitar text; scroll-triggered wheel/book animations)
- [x] **Phase 6** — About page (narrative bio, research section, toolbox grid, contact links)
- [x] **Phase 7** — Dark mode polish (added missing `--radius-*` tokens, `color-scheme` hints, `::selection` highlight, no FOUC confirmed)

## Completed Features (continued)

- [x] **Vercel domain rename** — project renamed from `gen-web` → `root-ligen`; live at `root-ligen.vercel.app`
- [x] **i18n: EN/ZH/DE trilingual routing** — Astro i18n config, `[locale]` dynamic routes, language switcher in Nav, `localeSwitchUrl()` with fallback logic, all page content translated

## Remaining Work

- [ ] **Lighthouse / performance audit** — run after content stabilises

## Backlog (confirmed, non-urgent)

| Feature | Notes |
|---------|-------|
| Posts: filter by tag | Client-side JS, data attributes on `<li>` elements |
| Posts: sort by name or date | Toggle button, same client-side approach |
| Project screenshots | Drop PNGs in `public/images/projects/<id>.png` |
| Strava API | Auto-fetch cycling stats for Hobbies page |
| OG images | Dynamic Satori generation |
| View Transitions | `<ViewTransitions />` for page-to-page animation |
| **Hobbies immersive redesign** | Horizontal scroll-driven, GSAP ScrollTrigger — full spec in `docs/hobbies-immersive-spec.md`. Blocked on: bicycle SVG + 4 character illustrations. ~25h work. |

## Architecture Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| `frontend-web` archetype | Static site, component-based Astro | 2026-03-21 |
| Black & white + `#E63946` accent | Minimalist academic/magazine feel; progressive disclosure | 2026-03-21 |
| CSS Custom Properties as design tokens | Single source of truth; Tailwind for utilities only | 2026-03-21 |
| i18n deferred to Phase 9 | Avoid 404s from missing `/zh/`, `/de/` routes; ship MVP first | 2026-03-21 |
| Playfair Display + Inter | Serif headings for character; Inter for international readability | 2026-03-21 |
| Bento Box for Projects | Projects are not a time-series list; visual grid suits diverse project types | 2026-03-21 |
| Cover-link pattern (no nested `<a>`) | Avoids invalid HTML and browser rendering inconsistencies | 2026-03-21 |

## Architecture Decisions (continued)

| Decision | Rationale | Date |
|----------|-----------|------|
| `prefixDefaultLocale: false` for i18n | EN stays at `/`, ZH/DE get `/zh/`, `/de/` prefix — cleaner URLs for primary audience | 2026-03-21 |
| Long content in page frontmatter (not JSON) | Bio paragraphs contain HTML links and are too long for JSON; locale-keyed objects in `.astro` frontmatter | 2026-03-21 |

## Known Issues / Tech Debt

- Project bento cards use CSS gradients as image placeholders (no real screenshots yet)
- esbuild parses typographic quotes (`"` U+201C) as string terminators in TS frontmatter — use `「」` or `''` instead
