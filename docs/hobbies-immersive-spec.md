# Hobbies Page — Horizontal Scroll-Driven Immersive Experience

> **Status**: Design spec only. Not yet implemented. Keep current MVP hobbies page live until this is ready.
> **Priority**: After Phase 6 (About page). Blocked on bicycle SVG + character illustrations.

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
