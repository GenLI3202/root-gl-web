/**
 * Scroll-driven drawing for ScrollSketch and PaperSketch. Every `[data-scroll-sketch]` element gets
 * a progress `--p` from START (on first sight) to 1 (when its bottom edge reaches 60% of the
 * viewport) and the class `is-armed`; CSS turns that into drawn strokes (`.ink`, see
 * ScrollSketch) or a sweeping reveal (raster drawings, see PaperSketch). Progress only moves
 * forward. Reduced motion leaves everything finished.
 */
/** Share of the ink already drawn when the page opens */
const START = 0.28;
/** Strokes finish at this progress; washes fade in over the rest */
const INK_END = 0.9;
/** How far toward the target the pen moves each frame */
const EASE = 0.12;

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
/** Listeners of the drawings on the current page, released when the client router swaps pages */
const stops = new Set<() => void>();

function arm(el: HTMLElement | SVGElement): void {
  if (el.dataset.armed) return;
  el.dataset.armed = "1";

  const strokes = Array.from(el.querySelectorAll<SVGGeometryElement>(".ink"));
  const lengths = strokes.map((s) => (typeof s.getTotalLength === "function" ? s.getTotalLength() : 0));
  const total = lengths.reduce((sum, n) => sum + n, 0) || 1;
  let done = 0;
  strokes.forEach((stroke, i) => {
    const a = (done / total) * INK_END;
    done += lengths[i];
    const b = (done / total) * INK_END;
    stroke.setAttribute("pathLength", "1");
    stroke.style.setProperty("--a", a.toFixed(4));
    stroke.style.setProperty("--k", (1 / Math.max(b - a, 1e-4)).toFixed(3));
  });

  let p = START;
  let target = START;
  let frame = 0;
  el.style.setProperty("--p", String(START));
  el.classList.add("is-armed");

  // Scroll position as a share of the way from "top edge enters" to "bottom edge at 60% of
  // the viewport". The pen starts from wherever the drawing is first seen, so a drawing that is
  // already on screen when the page opens still starts at START; reaching the end of the page
  // finishes it, in case the page cannot scroll that far.
  let base: number | null = null;
  const measure = (): void => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const raw = (vh - rect.top) / (vh * 0.4 + rect.height);
    if (base === null) base = Math.min(clamp01(raw), 0.9);
    const atEnd = window.scrollY + vh >= document.documentElement.scrollHeight - 2;
    const t = atEnd ? 1 : clamp01((raw - base) / (1 - base));
    target = Math.max(target, START + (1 - START) * t);
  };

  const tick = (): void => {
    p += (target - p) * EASE;
    if (target - p < 0.002) p = target;
    el.style.setProperty("--p", p.toFixed(4));
    if (p >= 1) {
      stop();
      return;
    }
    frame = p < target ? requestAnimationFrame(tick) : 0;
  };

  const onScroll = (): void => {
    measure();
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      onScroll();
    } else {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  });

  function stop(): void {
    observer.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    stops.delete(stop);
  }

  stops.add(stop);
  observer.observe(el);
}

function initScrollSketches(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement | SVGElement>("[data-scroll-sketch]").forEach(arm);
}

initScrollSketches();
document.addEventListener("astro:page-load", initScrollSketches);
document.addEventListener("astro:before-swap", () => stops.forEach((stop) => stop()));
