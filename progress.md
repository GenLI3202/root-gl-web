# gen-web — Progress

> Single source of truth for project status. Update after every task.

## Project Overview

- **Created**: 2026-03-21
- **Tech Stack**: Astro v5 · TypeScript · Tailwind CSS · CSS Custom Properties
- **Status**: 🟡 Setup

## Current Architecture

| Layer | Responsibility | Key Files |
|-------|---------------|-----------|
| Pages | Route definitions, data fetching | `src/pages/` |
| Layouts | HTML skeleton, Nav, Footer | `src/layouts/BaseLayout.astro` |
| Components | Reusable UI elements | `src/components/` |
| Content | Blog posts (Markdown/MDX) | `src/content/posts/` |
| Styles | Design tokens, global CSS | `src/styles/global.css` |
| i18n | Locale strings | `src/i18n/` |

## Completed Features

<!-- Check off features as they are finished. -->

- [x] Project initialized (AGENTS.md, progress.md, .agent/)

## In Progress

- [ ] **Phase 1**: Astro project scaffold + global layout (Nav, Footer, BaseLayout, global.css)
- [ ] **Phase 2**: Homepage (Hero, featured posts, projects grid)
- [ ] **Phase 3**: Blog system (list + detail pages, Content Collections)
- [ ] **Phase 4**: Projects page
- [ ] **Phase 5**: Hobbies page (cycling, reading, guitar)
- [ ] **Phase 6**: About page
- [ ] **Phase 7**: Dark mode
- [ ] **Phase 8**: Deployment (Vercel)
- [ ] **Phase 9**: i18n (EN/ZH/DE) + auto-translation workflow

## Known Issues

<!-- Track bugs and tech debt as they arise. -->

## Architecture Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Applied `frontend-web` archetype | Static site with component-based Astro architecture | 2026-03-21 |
| Black & white + #E63946 accent | Minimalist, academic/magazine feel; progressive disclosure | 2026-03-21 |
| CSS Custom Properties as design tokens | Single source of truth for colors/spacing; Tailwind for utilities only | 2026-03-21 |
| Trilingual routing `/[locale]/` | EN default, ZH + DE via GitHub Action auto-translation | 2026-03-21 |
| Playfair Display + Inter typography | Serif headings for character; Inter for international readability | 2026-03-21 |
