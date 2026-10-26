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
| Locale pages | Dynamic `[locale]` routes for ZH/DE (index, about, projects, hobbies/*) | `src/pages/[locale]/` |
| Reading data | WeRead stats + shelf books synced daily into a committed JSON; merged with hand-written books | `scripts/update-reading.mjs`, `.github/workflows/reading-update.yml`, `src/data/reading.json`, `books.ts`, `library.ts` |
| Reading room | Bookcases → zoomed spines → book dialog; stats charts | `ReadingRoom.astro`, `BookcaseSketch.astro`, `BookDialog.astro`, `ReadingStats.astro`, `src/utils/sketch.ts` |

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
- [x] **Hobbies horizontal panel layout** — three sections (Cycling/Reading/Guitar) slide horizontally via tab/arrow/swipe navigation; CSS transform-based, no GSAP dependency
- [x] **Literary Characters Carousel** — 4 character cards (郭靖/令狐冲/Sinclair/叶文洁) with quotes, grayscale→color avatar hover, slide animations, touch swipe + keyboard support; embedded in Reading panel on EN/ZH/DE hobbies pages
- [x] **Hobbies decorative assets** — cyclist-simple-line.svg in Cycling panel, music-notes.svg in Guitar panel (grayscale, low opacity)

## Completed Features (continued)

- [x] **Hobbies dark-mode cyclist fix** — `filter: invert(1)` on cyclist-bg so black-stroke SVG shows on dark background
- [x] **View Transitions** — `<ViewTransitions />` added to `BaseLayout.astro` for smooth page-to-page navigation
- [x] **GitHub repo** — published to `GenLI3202/root-gl-web` with MIT licence; all backlog items tracked as issues
- [x] **Intersolar 2026 blog draft** — added a public-safe EMS/LEMS post with image notes
- [x] **Report-style post template** — default blog posts now use a report header, sticky TOC, and wider analysis layout
- [x] **Intersolar 2026 illustration pass** — replaced available image notes with provided figures, left EV session text-only, and cleaned TOC link styling
- [x] **Localized blog i18n** — posts now support EN/ZH routes, translation links, localized report chrome, and Chinese typography
- [x] **Chinese report title tuning** — reduced oversized ZH hero title and switched report headings from serif to sans-serif typography

- [x] **Humanize pass, step 1 (shell + homepage)** — warm paper palette with grain, Caveat hand font for notes, red 李根 name seal (`Seal.astro`), shared `HomePage.astro` for EN/ZH/DE with greeting, live Munich clock (time, weather, what to wear), "Lately" cards (edit `src/data/now.ts`), `SayHello.astro` contact card, nav seal logo + pen underline, footer sign-off

- [x] **Humanize pass, step 1b** — name seal now uses Gen's own brush-written 李根 (traced from a photo, cinnabar stamp texture, `public/images/seal-ligen.svg`); all emoji replaced by pen-drawn `HandIcon` SVGs (`src/components/hand-icons.ts`)
- [x] **Munich clock: weather + outfit** (2026-10-26) — `MunichClock.astro` reads live Munich weather (Open-Meteo, no key, cached 30 min) and follows the time and weather with clothing advice by felt temperature, plus a note for rain, snow, storms or midday sun; it no longer guesses what Gen is doing
- [x] **Lately without guitar** (2026-10-26) — `now.ts` drops the guitar card (its hobby page is still thin); the homepage grid shows the three remaining cards in one row
- [x] **Cycling links and copy** (2026-10-26) — Lately's Riding card links to the cycling hobby page instead of the ACC site; the "28 km/h" line is gone from the cycling lead and the hobbies-overview teaser (now about ACC group rides)
- [x] **English book titles** (2026-10-26) — EN/DE spines and book cards show `titleEn` (hand overrides for all 40 current books); the sync script asks Claude once per new book for its English title and caches it in `reading.json` (optional `ANTHROPIC_API_KEY` secret; without it the Chinese title stays)
- [x] **Demian removed from the shelf** (2026-10-26) — hand-written entry without reading time dropped from `books.ts`; the Sinclair character and portrait stay in `characters.ts` for a future book
- [x] **Content update (Oct 2026)** — research copy now covers the Huawei PhD internship, local EMS, and AIDC campus EMS (home, Lately, About in EN/ZH/DE); club spelled "Across" everywhere with links to across-cc.de; Three-Body cards for Luo Ji, Zhang Beihai, Cheng Xin with sketch avatars and Gen's notes
- [x] **Reading bookshelf + sketch portraits** — `Bookshelf.astro` (spines by category, filters, detail card — later replaced by the reading room, see below; optional reading notes in `src/data/books.ts`, jumps to carousel characters); all seven carousel portraits redrawn in one pen-sketch style via `scripts/sketch-portraits.py`, rules in `docs/illustration-style.md`
- [x] **Hobbies split into sub-pages** — `/hobbies/` index plus `/hobbies/cycling/`, `/hobbies/reading/`, `/hobbies/guitar/` (EN/ZH/DE) built on `HobbyShell.astro`; horizontal tab panels and the character carousel removed; memorable characters now sit inside their book on the shelf
- [x] **Projects page redesign** — `ProjectsPage.astro` built around "Optimization across the energy storage value chain": stage diagram (Plan / Operate / Trade / Hedge) as research questions, sketch covers (`ProjectSketch.astro`), research vs other builds, researcher invitation; data in `src/data/projects.ts`; LEMS added
- [x] **Agent skills collection** — Projects page section listing public SKILL.md repos (html-presentation-deck, paper-study, acc-content-posting-system) with prompts, install commands and copy buttons; data in `src/data/skills.ts`; GridKey added to the Trade stage
- [x] **WeRead reading sync** (2026-10-25) — `scripts/update-reading.mjs` pulls public stats (total hours, reading days, books read/finished, note count, hours per year, hour-of-day) and every public shelf book with at least 3 hours of reading from the WeChat Reading agent API into `src/data/reading.json`; private books and note text are never stored (only highlight/thought counts); re-checks only books opened since the last run (`--full` re-checks all); skips writing when nothing changed; `npm run update:reading`
- [x] **Daily reading Action** (2026-10-25) — `.github/workflows/reading-update.yml` runs the script at 04:17 UTC and on manual dispatch (`full` checkbox), commits `reading.json` if changed so Vercel redeploys; needs repo secret `WEREAD_API_KEY`; runs only once on the default branch
- [x] **Reading library merge** (2026-10-25) — `src/data/library.ts` merges hand-written books (`books.ts`, linked by `wereadId`) with synced books; `WEREAD_OVERRIDES` (title, English title, category, hidden), `CATEGORY_RULES` map WeRead categories to the five bookcases, red ribbon for books read in the last 30 days
- [x] **Reading room** (2026-10-25) — `ReadingRoom.astro` (+ `BookcaseSketch.astro`, `BookDialog.astro`) replaces the bookshelf: level 1 one bookcase per category, level 2 camera zoom into the picked bookcase with spines (thickness = hours read), level 3 modal dialog per book with reading facts and hand-written content; seeded hand-drawn SVG helpers in `src/utils/sketch.ts`
- [x] **Reading stats** (2026-10-25) — `ReadingStats.astro`: headline numbers plus pen-drawn hours-per-year and time-of-day charts, hover/focus tooltips and a table view for each
- [x] **2.5D new-Chinese study** (2026-10-25) — `StudyScene.astro`, `StudyBookcase.astro`, `Box3d.astro`: CSS 3D room (one vanishing point) with five rosewood bookcases, moon window, ink scroll, tea table; camera dolly to the picked case; night study in dark mode; simplified layout under 560px
- [x] **Design-board review of Reading page** (2026-10-25) — average score 27.2 → 31.3 / 50: bookcase buttons sized to their case, focus ring on the wall (3:1), close-up width matches its case and pans sideways under 760px so it never outgrows the room, spine hours in `--fg`, one tab stop per chart with arrow-key navigation
- [x] **Xieyi study redesign** (2026-10-25) — from the visual designer's mockup, in a freehand ink style: `StudyHeader.astro` (brush-script 书房, seal, Su Shi quote, ink mountains; moonlit water town at night), timber-framed room with moon gate onto a bamboo-and-Taihu-rock garden, lattice sunlight, tea table, desk, lantern; lit walnut bookcases with category line icons; flow hint 选择书架 → 镜头推进 → 查看书籍 → 打开详情
- [x] **Themed close-ups and book card** (2026-10-25) — `ShelfCloseup.astro` + `ShelfDecor.astro`: lit walnut shelves, ivory spines, ink-drawn objects per category, plaque with icon; `BookDialog.astro` as a detail card with a generated cover, reading facts and a red WeRead button; indigo night palette in dark mode
- [x] **Reading page header and phone room** (2026-10-25) — the study header is the page heading (`HobbyShell` header is optional, dropped on Reading; WeRead link moved to the stats sync note); `book.svg` replaced by an ink-line `study.svg` on the hobbies overview; phone room 534 → 421 px with a higher eye, front cabinets moved back and a one-line flow hint
- [x] **Time-of-day chart in Munich time** (2026-10-25) — WeRead only gives an all-time Beijing-time hour distribution; the script shifts it to Munich time (`Europe/Berlin`): 6 h back in summer time, 7 h in winter time, weighted by the share of the year on summer time; the chart is an approximation and the hours-per-year chart stays on Beijing days
- [x] **Maintenance guide: Reading section** (2026-10-25) — `MAINTENANCE.md` documents the sync, `WEREAD_API_KEY` setup, local run, `--full`, the 3-hour rule, public vs never-published data, `WEREAD_OVERRIDES`, and attaching notes via `books.ts`

- [x] **Cycling page from Strava** — daily GitHub Action (`cycling-update.yml`, `scripts/update-cycling.mjs`) writes per-ride totals to `src/data/cycling.json` and privacy-trimmed route tracks to `public/data/cycling-routes.json`; page opens with a one-sentence odometer, a Leaflet/OpenStreetMap route map with handwritten labels and year filter, and postcards for remembered rides (`src/data/cycling-highlights.ts`); year-over-year line, riding-day calendar, ride-length bars and a table sit in a folded "For the number nerds" block; OAuth helper `npm run authorize:strava`; setup and route privacy in `docs/strava-sync.md`. First stats snapshot was loaded from the Strava connector and is replaced by the first workflow run; routes appear after that run

## Remaining Work

- [ ] **Humanize pass, step 2** — carry the new style into About, Projects, Hobbies, and Posts pages
- [ ] **Reading notes** — write notes for 毛泽东传, 邓小平时代, 置身事内 together with Gen (hand-written entries in `src/data/books.ts`)
- [ ] **WEREAD_API_KEY secret** — add it in GitHub → Settings → Secrets and variables → Actions, then run the Action once with `full` ticked
- [ ] **Posters** — add poster content

- [ ] **Lighthouse / performance audit** — run after content stabilises

## Backlog (confirmed, non-urgent)

| Feature | Notes |
|---------|-------|
| Posts: filter by tag | Client-side JS, data attributes on `<li>` elements |
| Posts: sort by name or date | Toggle button, same client-side approach |
| Project screenshots | Drop PNGs in `public/images/projects/<id>.png` |
| OG images | Dynamic Satori generation |
| ~~View Transitions~~ | ~~`<ViewTransitions />` for page-to-page animation~~ — ✅ Done |
| **Hobbies GSAP immersive upgrade** | Full scroll-driven transitions (bike suction, CSS 3D book) — spec in `docs/hobbies-immersive-spec.md`, update plan in `docs/hobbies-update-plan.md`. Assets ready. ~20h remaining. |
| **Post comments** | Comment section at the end of each blog post. Options: Giscus (GitHub Discussions, no backend), Cusdis (lightweight, self-hostable), or custom. Giscus preferred — zero infra, fits dev audience. |

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
| Hobbies horizontal panels via CSS transform (not GSAP) | Delivers the panel-switching UX without a 25KB dependency; GSAP upgrade deferred to immersive spec | 2026-03-22 |
| Notebook look: warm paper, ink, red pen | Humanize the site; red accent doubles as cycling red and correction pen | 2026-10-25 |
| WeRead data synced into a committed JSON by a daily GitHub Action | Keeps the build static: no runtime API calls, no client-side requests, and the API key stays in CI secrets; the commit triggers the Vercel redeploy | 2026-10-25 |
| Reading room with zoom + dialog | Progressive disclosure: bookcases first, spines after zooming in, full book details only on demand | 2026-10-25 |
| Hour-of-day chart converted to Munich time | WeRead only offers an all-time Beijing-time aggregate; shown in Gen's local time with a blended DST shift (approximate) | 2026-10-25 |
| `CharacterCarousel` as a standalone Astro component | Shared between EN and ZH/DE hobbies pages; quotes are language-native, no translation needed | 2026-03-22 |

## Known Issues / Tech Debt

- esbuild parses typographic quotes (`"` U+201C) as string terminators in TS frontmatter — use `「」` or `''` instead
