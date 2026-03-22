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

### Hobbies page stats (cycling numbers)
`src/pages/hobbies.astro` and `src/pages/[locale]/hobbies.astro` — edit the `stat-num` spans directly.

### Projects
`src/pages/projects.astro` — edit the `projects` array in the frontmatter. To add a screenshot, drop a PNG into `public/images/projects/<id>.png`.

### Navigation links / Footer
`src/components/Nav.astro` and `src/components/Footer.astro`.

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
git push                          # push to GitHub (triggers nothing — deploy is manual via vercel CLI)
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
| Deploy to prod | `vercel deploy --prod` |
| Local dev server | `npm run dev` |
| Verify build before deploy | `npm run build && npm run preview` |
| View Vercel deployments | `vercel ls` |
