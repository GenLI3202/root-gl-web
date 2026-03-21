# Plan: Hobbies Page Enhancement — Literary Characters Carousel + Asset Upgrades

## Context

The hobbies page has a `✦ Literary Characters Carousel coming soon — watch this space.` teaser in the Reading section. The 4 character illustrations (guo-jing.png, linghu-chong.png, sinclair.png, ye-wenjie.png) are now in `public/images/hobbies/`. Additionally, decorative SVGs (cyclist-rider.svg, book.svg, guitar-singing.svg, etc.) are available.

The full GSAP horizontal scroll immersive redesign (~25h, spec in `docs/hobbies-immersive-spec.md`) is too large for this step. This plan implements the **Literary Characters Carousel** and replaces emoji transition dividers with the real SVG assets — meaningful visual upgrades that work within the current vertical layout.

---

## Asset Inventory & Readiness

| Asset | Path | Status | Notes |
|-------|------|--------|-------|
| `guo-jing.png` | `/images/hobbies/` | Ready | 52 KB |
| `linghu-chong.png` | `/images/hobbies/` | Ready | 104 KB |
| `sinclair.png` | `/images/hobbies/` | Ready | 112 KB |
| `ye-wenjie.png` | `/images/hobbies/` | Ready | 91 KB |
| `cyclist-rider.svg` | `/images/hobbies/` | Ready | 19 KB, has named groups (`#wheel-front`, `#wheel-rear`, `#rider-body`, `#bike-and-wheels`) with embedded `pedal-bob` CSS animation |
| `cyclist.svg` | `/images/hobbies/` | Skip | 48 KB, raw Storyset scene, no semantic groups |
| `book.svg` | `/images/hobbies/` | Evaluate | 75 KB Storyset dictionary scene — may work as decorative element |
| `guitar-singing.svg` | `/images/hobbies/` | Evaluate | 129 KB Storyset balcony scene — may work as decorative element |
| `reading-glasses-animate.svg` | `/images/hobbies/` | Evaluate | 53 KB Storyset reading scene |
| `music-notes.svg` | `/images/hobbies/` | Evaluate | 47 KB Storyset music scene |

**Key decision**: The Storyset SVGs (book, guitar-singing, music-notes, reading-glasses) are full-color scene illustrations, NOT minimal icons. They could work as section header illustrations but don't match the spec's "editorial line-art" requirements. Need to decide: use them as-is with a grayscale/opacity filter, or skip them.

---

## Implementation Steps

### Step 1: Create `CharacterCarousel.astro` component

**File**: `src/components/CharacterCarousel.astro`

Based on implementation-plan.md §11 spec:
- Character data inline in frontmatter (4 characters with quotes, translations, avatars)
- Avatar paths: `/images/hobbies/<id>.png` (actual location, not the spec's `/images/characters/`)
- Single-card view with prev/next navigation + dot indicators
- Slide animations: `slideFrom` direction per character (left/right alternating)
- Grayscale avatar → color on hover
- Touch swipe + keyboard arrow support
- `prefers-reduced-motion` fallback to simple fade
- Accessibility: `role="region"`, `aria-label`, `aria-hidden` on inactive cards

### Step 2: Replace carousel teaser in `hobbies.astro` (EN)

**File**: `src/pages/hobbies.astro`

- Remove the `<p class="reading-carousel-teaser">` placeholder
- Import and insert `<CharacterCarousel />`
- Position: between `reading-footer` and the end of the reading hobby-body

### Step 3: Add carousel to `[locale]/hobbies.astro` (ZH/DE)

**File**: `src/pages/[locale]/hobbies.astro`

- The carousel quotes are already multilingual (Chinese characters, German Hesse, English translations)
- Import same `<CharacterCarousel />` component — quotes are language-native, not translated
- Remove or update the carousel teaser if it exists in the localized version

### Step 4: Upgrade transition dividers (optional enhancement)

**File**: `src/pages/hobbies.astro`

- Replace the simple SVG wheel divider with `cyclist-rider.svg` inline (or `<img>`) — the named groups allow the existing wheel-spin CSS animation to target `#wheel-front` and `#wheel-rear`
- Evaluate whether the Storyset SVGs add visual value as section decorations or should be skipped

### Step 5: Build & deploy

- `npx astro build` — verify all pages render
- `vercel deploy --prod`
- Update `progress.md`

---

## Files to modify

| File | Change |
|------|--------|
| `src/components/CharacterCarousel.astro` | **New** — carousel component |
| `src/pages/hobbies.astro` | Replace teaser with carousel, optionally upgrade dividers |
| `src/pages/[locale]/hobbies.astro` | Add carousel to ZH/DE versions |
| `progress.md` | Mark carousel as complete |

---

## Verification

1. `npx astro build` passes with 0 errors
2. `npx astro dev` — navigate to `/hobbies/`, `/zh/hobbies/`, `/de/hobbies/`
3. Carousel shows first character (郭靖), prev disabled, next enabled
4. Click through all 4 characters, verify quotes and translations
5. Hover avatar: grayscale → color transition
6. Mobile: swipe left/right navigates
7. Keyboard: arrow keys navigate
8. Dark mode: correct token colors
9. `prefers-reduced-motion`: fade instead of slide
