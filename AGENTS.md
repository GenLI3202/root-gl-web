# AGENTS.md

## Project

gen-web — Personal portfolio website for Gen Li. Astro v5 static site with TypeScript, Tailwind CSS, and CSS Custom Properties. Black-and-white minimalist design, trilingual (EN/ZH/DE), featuring blog, projects, hobbies (cycling, reading, guitar), and about pages.

## Key Decisions

- **Black & white minimalist design** with #E63946 (cycling red) as accent — see `implementation-plan.md`
- **Progressive disclosure principle** — reduce cognitive load, every element earns its place
- **Astro v5 SSG** — static generation, no server-side rendering needed
- **CSS Custom Properties** as design token system, Tailwind only for utility classes
- **Trilingual routing** `/en/` `/zh/` `/de/` — English default, auto-translation via GitHub Action

## Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Build for production
npm run preview   # Preview production build
```

---

# Coding Style

> Rules for AI coding assistants. Follow strictly.

## Naming

| Element        | Style                   | Example               |
| -------------- | ----------------------- | --------------------- |
| Components     | `PascalCase`            | `Nav.astro`           |
| Functions/Vars | `camelCase`             | `getLocalizedUrl`     |
| Constants      | `UPPER_SNAKE`           | `SUPPORTED_LOCALES`   |
| Files (pages)  | `kebab-case`            | `about.astro`         |
| CSS classes    | `kebab-case`            | `.hero-title`         |

## Formatting

- **100 chars** max line length
- **2 spaces** indent (no tabs)
- **Double quotes** `"` for strings in TypeScript/JavaScript
- **Single quotes** in Astro frontmatter where preferred by prettier

## Type Safety

- Type hints on all TypeScript functions (params + return)
- Use `interface` for object shapes, `type` for unions/aliases
- Never use `any` without a justification comment

## Component Architecture

- Co-locate component markup, styles (`<style>`), and logic (`---`) in `.astro` files
- Shared UI components go in `src/components/` — never inline in page files
- Page-specific logic stays in `src/pages/`
- Design tokens defined in `src/styles/global.css` only — no magic hex values inline

## Documentation

- Comments describe **current** functionality only
- No `TODO: future` or phase references in committed code
- Frontmatter (`---`) section at top of every `.astro` page

## Progress Tracking

- Update `progress.md` after completing each task
- `progress.md` is the single source of truth for project status

---

# Git Rules

- 📝 **Commits**: `<type>(scope): <50ch max>` — one logical change per commit
  - Types: `feat` | `fix` | `docs` | `style` | `refactor` | `perf` | `test` | `chore`
  - **Commit after each file/logical unit** — don't batch entire phases

---

# === frontend-web archetype ===

# Frontend Web — Archetype Rules

> Applied when building SPAs, static sites, dashboards, or component libraries.

## Component Organization

- Choose ONE organizational pattern upfront and document it: either **feature-based** (`features/auth/`, `features/dashboard/`) or **atomic design** (`atoms/`, `molecules/`, `organisms/`). Do not mix.
- Each component should be self-contained: its markup, styles, and logic live together (co-located), not scattered across global CSS files and utility folders.
- Shared/reusable components go in a dedicated `components/shared/` or `components/ui/` directory — never inline them in page-level files.

## Styling

- Define design tokens (colors, spacing, typography, shadows) in ONE file/module and reference them everywhere. Never use magic numbers or hex codes inline.
- Every interactive element must have hover/focus/active states defined.
- Use CSS custom properties or a theme object — not hardcoded values scattered across components.

## State Management

- Local state stays in the component that owns it. Only lift state when two or more siblings need the same data.
- Global state (auth, theme, user preferences) must go through a dedicated state management layer — never pass it through more than 2 levels of props.

## Accessibility

- All interactive elements must be keyboard-navigable.
- Images must have `alt` text (decorative images use `alt=""`).
- Form inputs must have associated `<label>` elements.

## Asset Management

- Never commit generated or large binary assets to the repository. Use `.gitignore` for build outputs.
- Icons and small SVGs can be inlined as components. Large images should be in an `assets/` directory with descriptive filenames.
