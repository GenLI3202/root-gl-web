# Maintenance Guide

Quick reference for day-to-day edits, content updates, and deployments.

---

## Local Development

```bash
npm run dev          # start dev server → http://localhost:4321 (hot reload)
npm run build        # production build → dist/
npm run preview      # serve dist/ locally to verify build
```

---

## Publishing a New Blog Post

1. Create a Markdown file in `src/content/posts/`:

```bash
touch src/content/posts/my-new-post.md
```

2. Add frontmatter at the top:

```markdown
---
title: "Your Post Title"
description: "One-sentence summary shown in the posts list."
pubDate: 2026-04-01
tags: ["research", "cycling"]
---

Your content here.
```

3. Post is auto-discovered — no registration needed. Visit `/posts/` to confirm.

**Frontmatter fields:**

| Field | Required | Notes |
|-------|----------|-------|
| `title` | ✅ | Shown in list + post heading |
| `description` | ✅ | Meta description + list subtitle |
| `pubDate` | ✅ | `YYYY-MM-DD` format |
| `tags` | optional | Array of strings, used for filtering (future) |

---

## Editing Page Content

### Homepage tagline
`src/pages/index.astro` — edit the `hero-tagline` paragraph directly.
ZH/DE versions: `src/i18n/zh.json` and `src/i18n/de.json` → key `index.tagline`.

### About page bio
`src/pages/about.astro` — long-form HTML content is inline in the frontmatter as locale-keyed objects (`bioBlocks`).

### Cycling stats and charts
Generated from Strava, nothing to edit by hand. The workflow `.github/workflows/cycling-update.yml`
refreshes `src/data/cycling.json` daily; setup and details are in `docs/strava-sync.md`.

### Projects
`src/pages/projects.astro` — edit the `projects` array in the frontmatter. To add a screenshot, drop a PNG into `public/images/projects/<id>.png`.

### Navigation links / Footer
`src/components/Nav.astro` and `src/components/Footer.astro`.

---

## Reading Page (WeChat Reading Sync)

The Reading page (`/hobbies/reading/`, `/zh/hobbies/reading/`, `/de/hobbies/reading/`) combines two sources:

- **Synced from WeChat Reading (微信读书)** — reading stats and every public shelf book with at least 3 hours of cumulative reading. Stored in `src/data/reading.json`.
- **Hand-written** — about text, notes, epigraph and characters in `src/data/books.ts`.

`src/data/library.ts` merges the two into one library. The page is built from the committed JSON; there are no API calls at runtime and the API key never reaches the site.

### How the sync works

`.github/workflows/reading-update.yml` runs `scripts/update-reading.mjs` every day at 04:17 UTC and on manual dispatch. If `src/data/reading.json` changed, the workflow commits it (`chore(reading): daily WeRead data update`) and the push triggers a Vercel redeploy. If nothing changed, nothing is committed.

The script only re-checks books opened since the last run (`syncedThrough` in the JSON). The 3-hour threshold is `MIN_SECONDS` in the script; after changing it, run with `--full`. Use `--full` (see below) to re-check every book, for example if the data looks wrong.

`src/data/reading.json` is generated — don't hand-edit it; the next run overwrites it.

### One-time setup

1. Get a WeRead agent API key (format `wrk-…`).
2. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**.
3. Name `WEREAD_API_KEY`, value the key.

Until the secret exists the job fails with "WEREAD_API_KEY is not set" and commits nothing. The workflow only runs once it is on the default branch.

### Run it manually

On GitHub: **Actions → Update reading data → Run workflow**. Tick **full** to re-check every book.

Locally:

```bash
export WEREAD_API_KEY=wrk-...          # never commit this
npm run update:reading                 # only books opened since the last run
npm run update:reading -- --full       # re-check reading time for every book
```

Then review `git diff src/data/reading.json` and commit it.

### What is public

| Published | Never published |
|-----------|-----------------|
| Total hours, reading days, books read / finished, note count | Private (secret) shelf books |
| Hours per year, hour-of-day distribution | Text of highlights and thoughts |
| Per book: title, author, WeRead category, hours, progress, finish and last-read dates, link | Books under 3 hours of reading |
| Per book: number of highlights and thoughts (counts only) | The API key |

### Time-of-day chart uses Munich time

WeRead only offers the hour-of-day distribution as an all-time aggregate in Beijing time, so it cannot be converted day by day. The script shifts it to Munich time (`Europe/Berlin`): 6 hours back for summer time (CEST), 7 hours back for winter time (CET), weighted by the share of the year Munich spends on summer time. The result is saved as `stats.hours` with `stats.hoursTimeZone`.

This is an approximation: reading done while travelling or around clock changes is not separated out. The hours-per-year chart still uses Beijing calendar days.

### English titles

EN and DE pages show each book's English title on the spines and the book card (the Chinese original stays as a smaller line on the card; the card's cover art keeps the Chinese title). Chinese pages show the Chinese title.

- **New books:** when a book first enters `reading.json`, the script asks Claude (`claude-opus-5-5`, one request per run, server-side refusal fallback on) for the published English title, or a short faithful translation if there is none, and stores it as `titleEn` in the JSON. Later runs reuse it.
- **Needs** the repository secret `ANTHROPIC_API_KEY` (same place as `WEREAD_API_KEY`). Without it, or if the request fails, the sync still runs and the book shows its Chinese title until a later run succeeds.
- **To correct a title,** set `titleEn` in `WEREAD_OVERRIDES` (below); hand-written titles always win.

### Hide, rename or re-categorise a synced book

Edit `WEREAD_OVERRIDES` in `src/data/library.ts`, keyed by the WeRead `bookId` (the `id` of the book in `reading.json`):

```ts
"35459982": { title: "潮骚", titleEn: "The Sound of Waves" },  // shorter title + English title
"1234567":  { category: "scifi" },                             // move to another bookcase
"7654321":  { hidden: true },                                  // remove from the shelf
```

| Field | Effect |
|-------|--------|
| `title` | Replaces the shortened WeRead title (series and edition suffixes are already trimmed by `shortTitle()`) |
| `titleEn` | English title shown on EN and DE pages; wins over the one the script wrote |
| `category` | One of `literature`, `ideas`, `polecon`, `wuxia`, `scifi` |
| `hidden` | `true` removes the book from the shelf |

Categories come from WeRead's own category via `CATEGORY_RULES` in `library.ts`; anything unmatched goes to literature. A book opened in the last 30 days (`RECENT_DAYS`) gets the red ribbon.

### Add notes or characters to a synced book

Add an entry to `BOOKS` in `src/data/books.ts` and set `wereadId` to the WeRead `bookId`. The synced copy then adds reading stats to your entry instead of appearing as a duplicate. In that entry:

- `about` — one sentence per locale (required)
- `notes` — Gen's own reading notes per locale (optional)
- `epigraph` — a quoted line with source and translations (optional)
- `characters` — ids from `src/data/characters.ts` (optional)

### How the page reads

1. **Room** — one bookcase per category.
2. **Bookcase** — click one to zoom in; each spine's thickness is the hours read.
3. **Book** — click a spine for a dialog with the reading facts and, if the book is in `books.ts`, the hand-written content.

Headline numbers and the two charts (hours per year, time of day) are in `src/components/ReadingStats.astro`. Each chart has a table view and tooltips on hover or focus.

---

## Editing Translated Strings (i18n)

All UI strings live in three JSON files:

```
src/i18n/en.json    ← English (default, at /)
src/i18n/zh.json    ← Chinese (at /zh/)
src/i18n/de.json    ← German (at /de/)
```

Keys are dot-separated: `"hobbies.cycling.lead"`, `"nav.about"`, etc.
After editing, run `npm run build` to verify no missing-key errors.

---

## Changing the Visual Style

### Accent colour / fonts / spacing
All design tokens are in `src/styles/global.css` at the top:

```css
:root {
  --accent: #E63946;        /* change this for a new brand colour */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --container-width: 720px;
  /* ... */
}
```

Dark mode overrides are in the `.theme-dark` block immediately below.

### Page-level styles
Each `.astro` file has a `<style>` block at the bottom — styles are scoped to that page/component automatically.

### Global styles
`src/styles/global.css` — resets, typography defaults, utility classes.

---

## Deployment

### Deploy to production (Vercel)

Vercel's Git integration deploys every push to `main` to production, including the daily
reading-data commit. Other branches get preview deployments. To deploy by hand:

```bash
vercel deploy --prod
```

Live URL: **https://root-ligen.vercel.app**

### Preview deployment (staging URL, doesn't affect production)

```bash
vercel deploy
```

Vercel prints a unique preview URL you can share for review before promoting.

### Check recent deployments

```bash
vercel ls
```

### Rollback to a previous deployment

```bash
vercel rollback
```

---

## Git Workflow

```bash
git status                        # see what's changed
git add <file>                    # stage specific files (avoid git add -A)
git commit -m "type: description" # commit types: feat / fix / chore / docs
git push                          # Vercel deploys main to production; other branches get previews
```

Commit type conventions:
- `feat:` — new feature or page section
- `fix:` — bug fix or copy correction
- `chore:` — dependency updates, config tweaks
- `docs:` — README, progress.md, MAINTENANCE.md

---

## Common Tasks: Quick Reference

| Task | Command / File |
|------|---------------|
| New blog post | Create `src/content/posts/*.md` |
| Change accent colour | `--accent` in `src/styles/global.css` |
| Edit EN homepage intro | `src/pages/index.astro` → `hero-tagline` |
| Edit ZH/DE homepage intro | `src/i18n/zh.json` + `de.json` → `index.tagline` |
| Add project | `projects` array in `src/pages/projects.astro` |
| Add project screenshot | Drop PNG in `public/images/projects/<id>.png` |
| Add / edit a hand-written book | `BOOKS` in `src/data/books.ts` (`wereadId` links it to WeRead) |
| Hide / rename / re-categorise a synced book | `WEREAD_OVERRIDES` in `src/data/library.ts` |
| Refresh reading data now | `npm run update:reading` (add `-- --full` to re-check all) or run the GitHub Action |
| Deploy to prod | `vercel deploy --prod` |
| Local dev server | `npm run dev` |
| Verify build before deploy | `npm run build && npm run preview` |
| View Vercel deployments | `vercel ls` |
