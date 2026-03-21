# Hobbies Page — Horizontal Scroll-Driven Immersive Experience

> **Status**: Design spec only. Not yet implemented. Keep current MVP hobbies page live until this is ready.
> **Priority**: After Phase 6 (About page). Blocked on bicycle SVG + character illustrations.

---

## 0. Design Philosophy & Context

### Why this page is different

Every other page on this site — the homepage, the blog, the projects — is calm, structured, academic. They follow the minimalist B&W design system faithfully: generous whitespace, Playfair Display headings, clean content-first layout. That's intentional.

The Hobbies page should break from that rhythm — deliberately. This is where the person behind the PhD comes through: someone who rides 180 times a year, who grew up reading wuxia novels, who plays guitar late at night without any plans to perform. The design should feel like walking into a different room of the same house: the aesthetic language is consistent (same fonts, same red accent, same palette), but the energy is different — playful, kinetic, personal.

The core metaphor is **turning a page**. Each hobby is its own world. You don't browse them as a list — you travel through them. Scroll down and you leave one world, transition through a moment of pure animation, and arrive in the next. Scroll back up and you return. The scroll is the narrative.

### Design principles for this page

1. **Scroll = time.** The user's scroll position is the animation's clock. Nothing plays on a timer. Nothing auto-advances. The user is in full control.
2. **Transitions are earned.** The animation between sections isn't decoration — it *is* the transition. The bicycle pulling content away isn't a cute effect; it's a metaphor for the cyclist leaving the scene.
3. **Each section has one visual metaphor.** Cycling: a figure in motion. Reading: an open book with two pages. Guitar: silence and space. Don't add more.
4. **Warm, not whimsical.** The overall site tone is "academic minimalist with character." This page pushes toward character without tipping into cartoon. Line-art over illustration. Restraint in color (the same `#E63946` accent, not a rainbow).
5. **Mobile is a real use case.** Gen's friends and club members will likely view this on a phone. The experience should degrade gracefully, not break.

### What exists today (MVP)

The current `/hobbies` page is a simple vertical layout: three sections stacked, with an SVG wheel and a book emoji as one-shot dividers. The content (stats, author cards, guitar text) is all correct and should be preserved. This spec describes how to replace the *layout and transitions* — not the content.

### Collaboration model

This redesign requires **two parallel workstreams**:

| Workstream | Owner | Deliverable |
|---|---|---|
| **Design assets** | Design Agent | SVG cyclist, character illustrations, animation specs |
| **Web implementation** | Dev (Claude Code) | GSAP integration, CSS 3D book, scene layout |

The dev workstream is **blocked** until the design assets are ready. This document tells the Design Agent exactly what to produce. Once assets are delivered, implementation can begin immediately.

---

## 0.5. Design Assets Brief (for Design Agent)

This section is a self-contained brief for whoever is producing the visual assets. Read this section independently of the rest of the spec.

### Asset 1 — Animated Cyclist SVG

**What it is**: A simple line-art figure riding a bicycle, used in the Cycling → Reading scene transition. As the user scrolls down, this figure rides across the screen from right to left, and the cycling content appears to get "pulled" behind it.

**Style**:
- Flat, minimal line-art — think editorial illustration, not cartoon
- Stroke weight: 2–3px, monochrome
- Colors: body/frame in `#6B6B6B` (the `--fg-muted` token), wheel rims in `#E63946` (the accent red)
- No fill, no gradients — strokes only
- Proportions: slightly stylized (larger head, cleaner geometry), not anatomically precise

**Format**: SVG file. The bicycle wheels must be **separate `<g>` or `<circle>` elements** so they can be rotated independently by GSAP. The rider body (torso, arms, head) should be one group. Legs/pedals can be a third group if a pedaling motion is desired (optional).

**Dimensions**: Viewbox approximately `0 0 200 120`. The figure should fit comfortably at 150–200px wide on screen.

**Deliverable**: `cyclist.svg` — clean, readable SVG source with named groups:
- `#wheel-front`
- `#wheel-rear`
- `#rider-body`
- `#bike-frame`
- (optional) `#pedals`

**What NOT to do**: No text labels, no drop shadows, no color fills, no gradients, no raster images embedded in the SVG.

---

### Asset 2 — Literary Character Illustrations (×4)

**What they are**: Portrait illustrations of four literary characters. In the Reading scene, as the user scrolls, these characters "pop out" from the sides of the screen one by one, each with a speech bubble containing their iconic quote.

**Style**:
- Grayscale illustration (no color) — except a subtle `#E63946` detail is acceptable (e.g., a small accent on clothing, a red book cover)
- Editorial / graphic novel aesthetic — clean shapes, strong silhouette, expressiveness without realism
- Each portrait shows the character from roughly waist-up, facing slightly toward center (toward their speech bubble)
- Background: fully transparent

**Format**: PNG with transparent background, 400×500px, ≤150KB each. Alternatively, SVG if the style allows it.

**The four characters**:

| # | Character | Source Work | Key Visual Traits | Quote (displayed in speech bubble) |
|---|---|---|---|---|
| 1 | **郭靖 Guo Jing** | 《射雕英雄传》Jin Yong | Stocky, honest face, Song dynasty warrior attire, holds a bow or fist gesture — embodiment of earnest heroism | 侠之大者，为国为民 |
| 2 | **令狐冲 Linghu Chong** | 《笑傲江湖》Jin Yong | Lean and casual, robes slightly disheveled, holds a wine flask or sword loosely — carefree, unconventional | 独孤九剑，无招胜有招 |
| 3 | **Emil Sinclair** | *Demian* — Hermann Hesse | Young European face, introspective expression, a bird or cracked egg motif in the background — Jungian awakening | Der Vogel kämpft sich aus dem Ei heraus. Das Ei ist die Welt. |
| 4 | **叶文洁 Ye Wenjie** | 《三体》Liu Cixin | Middle-aged Chinese woman, calm and profound expression, background suggests radio antenna or stars — civilization-scale thinker | 给岁月以文明，而不是给文明以岁月 |

**Placement context**: Each illustration will appear at the edge of the screen — characters 1 and 3 enter from the left, characters 2 and 4 from the right. The figure should be positioned in the image so that it "faces in" (toward the speech bubble and the center of the screen).

**What NOT to do**: No color backgrounds, no name labels (the UI provides these), no copyright-infringing direct reproductions of existing fan-art — original interpretations only.

---

### Asset 3 — "Suction" Motion Spec

**What it is**: A description (not a file) of how the content suction effect should feel, so the dev can tune the GSAP parameters correctly.

**Reference aesthetic**: Imagine magnetic levitation in reverse — objects that were resting suddenly get pulled toward a moving source. They don't slide uniformly; the closest ones go first, then the next ones, then the farthest. Each object accelerates as it moves (ease-in).

**Desired feel**:
- The stat cards (3 of them) should follow the bicycle at staggered intervals: 0ms, 80ms, 160ms delay
- Each card accelerates as it exits (ease-in, not linear)
- As a card exits, it also slightly scales down (from 1.0 to 0.7) — as if receding into the distance behind the bike
- Opacity fades from 1.0 → 0 in the last 30% of the card's travel distance
- The text blocks (heading, intro paragraph) follow the cards with another 80ms delay each

**Reverse (scroll up)**: The cards spring back. Easing reverses to ease-out. The order also reverses — the last thing to leave is the first thing to return. Like an elastic band snapping back.

**Reference**: GSAP `stagger` with `from: "end"` on reverse. Think: `gsap.to(cards, { x: -1200, stagger: 0.08, ease: "power2.in" })`.

---

## 1. Core UX Model

### Horizontal Paging
- 3 full-screen scenes (`100vw × 100vh` each) arranged horizontally
- User scrolls vertically (mousewheel / touch swipe) → GSAP ScrollTrigger translates the container horizontally
- The actual page is tall enough (`300vh`) to provide scroll distance, but the visual movement is horizontal
- GSAP `snap` config handles section locking

### Idle State
- When user stops scrolling, the current scene is fully visible and static
- All interactive elements (links, hover states) work normally
- No auto-play, no timers — user controls the pace

### Reversibility
- All transitions are **bidirectional** — scroll up reverses scroll down
- Achieved via GSAP `scrub: true` (animation progress = scroll progress)

---

## 2. Scene 1: Cycling 🚴

### Layout
- Full viewport, content centered
- Strava stats grid (distance / elevation / rides) — large red numbers in Playfair Display
- Links: Strava profile, ACC ClubHub
- Background: clean `--bg`

### Exit Transition (scroll down → Reading)
1. **Bicycle enters** from the right edge, pedaling left (SVG cyclist, line-art style)
2. **Content suction**: Each content element gets "pulled" leftward behind the bike
   - GSAP `stagger` with 0.08s delay per element
   - Each element: `translateX(-120vw)` + `scale(0.6)` + `opacity → 0`
   - Easing: `power2.in` (accelerates — like being sucked in)
3. **Bike exits left**, trailing the last content fragment
4. **Reading scene slides in** from the right

### Enter Transition (scroll up from Reading — reverse)
- Cyclist rides back in from left, content elements spring back to position with stagger in reverse order
- Easing: `power2.out` (decelerates — like being released from a spring)

### Bicycle SVG Spec
- Simple silhouette: rider + frame + two wheels
- Wheels rotate independently (linked to scroll progress)
- Rider legs: optional 2-frame pedaling CSS animation
- Color: `var(--fg-muted)` body, `var(--accent)` wheels
- Size: ~200×120px

---

## 3. Scene 2: Reading 📖

### Layout: Open Book
- A CSS 3D book fills ~80% of viewport
- **Left page**: Author list (Jin Yong, Liu Cixin, Hesse) with book recommendations
- **Right page**: Quotes and personal notes, 微信读书 link
- Book spine: thin `--border-dark` strip with subtle box-shadow
- Pages: slight off-white texture via CSS gradient (no image file needed)
- Corner fold on bottom-right of right page (pure CSS triangle)

### Book CSS 3D Structure
```
.book-container  (perspective: 1200px)
├── .book-spine  (narrow center strip, highest z-index)
├── .book-page.left   (transform-origin: right center)
└── .book-page.right  (transform-origin: left center)
```

### Character Pop-ups (Phase E — blocked on illustrations)
Characters slide in from alternating sides as user scrolls within the Reading scene:

| Progress | Character | Direction | Quote |
|---|---|---|---|
| 25% | 郭靖 | Left → | 侠之大者，为国为民 |
| 50% | 令狐冲 | ← Right | 独孤九剑，无招胜有招 |
| 75% | Sinclair (Demian) | Left → | Der Vogel kämpft sich aus dem Ei heraus... |
| 100% | 叶文洁 | ← Right | 给岁月以文明，而不是给文明以岁月 |

Each character card: avatar (grayscale, circular) + speech bubble (Playfair Display italic quote, `--accent` decorative `"`).

### Exit Transition (scroll down → Guitar)
1. Left page rotates `rotateY(0° → 90°)` toward spine, right page mirrors
2. Text on pages fades to 0 as pages approach 45°
3. Closed book scales down and slides left
4. Guitar SVG/icon grows from behind the closed book

### Enter Transition (scroll up from Guitar — reverse)
- Guitar shrinks back → book slides to center → pages open `rotateY(90° → 0°)` → content fades in

---

## 4. Scene 3: Guitar 🎸

### Layout
- Deliberately minimal — the "quiet room" after the animated book
- Large guitar SVG or icon at top, centered
- Personal paragraph (current content)
- Subtle music note / soundwave SVG decorations at edges (`--accent`, 10% opacity)

### No Exit Transition
- Last scene — scrolling further has no effect (or a gentle "you've reached the end" nudge)
- Small `↑ Back to top` link at bottom-right

---

## 5. Technical Stack

### Dependencies
| Package | Size (gzip) | Purpose |
|---|---|---|
| `gsap` | ~25KB | Core animation engine |
| `@gsap/ScrollTrigger` | Included in gsap | Scroll-linked, reversible animation |

Install: `npm install gsap`

### GSAP Core Setup (Pseudocode)
```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const container = document.querySelector('.hobbies-horizontal');

// Step 1: Pin page and scroll horizontally
const horizontalScroll = gsap.to(container, {
  x: () => -(container.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.hobbies-wrapper',
    pin: true,
    scrub: 1,
    snap: 1 / 2,  // 3 scenes → snap at 0, 0.5, 1
    end: () => `+=${container.scrollWidth}`,
  }
});

// Step 2: Cycling exit (bike + suction)
ScrollTrigger.create({
  trigger: '.scene--cycling',
  containerAnimation: horizontalScroll,
  start: 'right 80%',
  end: 'right left',
  scrub: true,
  onUpdate: (self) => animateCyclingExit(self.progress),
});

// Step 3: Book open/close
ScrollTrigger.create({
  trigger: '.scene--reading',
  containerAnimation: horizontalScroll,
  start: 'right 80%',
  end: 'right left',
  scrub: true,
  onUpdate: (self) => animateBookClose(self.progress),
});
```

### Astro Integration
- Option A: `<script>` tag at bottom of `hobbies.astro` (simpler, no framework)
- Option B: Preact island `HobbiesScene.tsx` with `client:only="preact"` (better TypeScript, component isolation)

### Component File Structure
```
src/pages/hobbies.astro
src/components/hobbies/
├── HobbiesScene.tsx        Preact island — GSAP orchestration
├── CyclingScene.tsx        Stats, links, bike trigger zone
├── ReadingScene.tsx        Book layout, character pop-ups
├── GuitarScene.tsx         Guitar content
├── BicycleSVG.tsx          Animated SVG cyclist
└── Book3D.tsx              CSS 3D book with page flip
src/data/hobbiesCharacters.ts   Character data (quotes, avatar paths)
public/images/characters/       Character illustrations (future)
```

---

## 6. Mobile Adaptation

| Feature | Desktop | Mobile |
|---|---|---|
| Scroll input | Mousewheel | Touch swipe |
| Bike crossing distance | ~1200px | ~375px (faster) |
| Book layout | 80% viewport, full 3D | 95% viewport, simplified fade |
| Characters | Left/right alternating | Slide up from bottom |
| 3D perspective | Full `rotateY` flip | Opacity crossfade (avoid GPU issues) |

Touch: add `touch-action: pan-y` on wrapper, `overscroll-behavior: contain` to prevent pull-to-refresh.

---

## 7. Accessibility

- `prefers-reduced-motion: reduce` → fall back to current vertical stacked layout (no GSAP loaded)
- All scenes stay in DOM — use `visibility: hidden` + `aria-hidden` (not `display: none`)
- `aria-live="polite"` on character speech bubbles
- Keyboard: Tab traverses all interactive elements regardless of current visual scene
- Skip links: `Skip to Cycling / Reading / Guitar` at page top

---

## 8. Art Assets Needed

| Asset | Size | Notes |
|---|---|---|
| Bicycle + rider SVG | ~200×120px | Line-art, B&W, can adapt open-source (e.g. Font Awesome, Heroicons) |
| 郭靖 illustration | 400×500px PNG | Transparent bg, grayscale preferred |
| 令狐冲 illustration | 400×500px PNG | Carefree pose, wine flask detail |
| Sinclair / Demian illustration | 400×500px PNG | Young man, bird/egg motif |
| 叶文洁 illustration | 400×500px PNG | Scientist, antenna or stars backdrop |

Character art **blocks Phase E** — all other phases can proceed without it.

---

## 9. Implementation Phases

| Phase | Work | Blocker |
|---|---|---|
| **A — Foundation** | Install GSAP, horizontal scroll container, 3 static scenes with snap | None |
| **B — Cycling transition** | Bicycle SVG + ride animation + content suction stagger | Bicycle SVG |
| **C — Book layout** | CSS 3D book, left/right pages, close/open transition | None |
| **D — Guitar + polish** | Guitar scene entry, mobile adaptation, timing tuning | None |
| **E — Character pop-ups** | 4 characters, speech bubbles, scroll-triggered slide-in | Character illustrations |

**Estimated total**: ~25 hours across all phases (excluding illustration sourcing).

---

## 10. References

- GSAP Horizontal Scroll: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP containerAnimation: for nested scroll triggers within pinned sections
- CSS 3D book techniques: perspective + transform-origin + rotateY
- Current hobbies page MVP: `src/pages/hobbies.astro`
