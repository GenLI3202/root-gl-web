/**
 * Helpers for build-time SVG that looks drawn by hand: lines bow a little, corners
 * overshoot, and the jitter comes from a seeded generator so every build draws the same.
 */

export type Point = [number, number];

/** Seeded pseudo-random numbers in [0, 1) (mulberry32) */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable numeric seed from a string id */
export function seedOf(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

const round = (n: number): number => Math.round(n * 10) / 10;

/** One stroke from a to b that bows sideways by up to `wobble` units */
export function sketchSegment(a: Point, b: Point, rand: () => number, wobble = 1): string {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const bow = (rand() - 0.5) * 2 * wobble;
  const cx = (x1 + x2) / 2 + nx * bow;
  const cy = (y1 + y2) / 2 + ny * bow;
  return `M${round(x1)} ${round(y1)} Q${round(cx)} ${round(cy)} ${round(x2)} ${round(y2)}`;
}

/** Rectangle whose sides are separate bowed strokes that run slightly past the corners */
export function sketchRect(
  x: number,
  y: number,
  w: number,
  h: number,
  rand: () => number,
  wobble = 1
): string {
  const o = (): number => (rand() - 0.3) * wobble * 1.4;
  return [
    sketchSegment([x - o(), y], [x + w + o(), y], rand, wobble),
    sketchSegment([x + w, y - o()], [x + w, y + h + o()], rand, wobble),
    sketchSegment([x + w + o(), y + h], [x - o(), y + h], rand, wobble),
    sketchSegment([x, y + h + o()], [x, y - o()], rand, wobble),
  ].join(" ");
}

/** Smooth curve through the points (Catmull-Rom as cubic Béziers), with a little hand jitter */
export function sketchCurve(points: Point[], rand: () => number, wobble = 0.6): string {
  if (points.length < 2) return "";
  const j = (): number => (rand() - 0.5) * 2 * wobble;
  let d = `M${round(points[0][0])} ${round(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6 + j(), p1[1] + (p2[1] - p0[1]) / 6 + j()];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6 + j(), p2[1] - (p3[1] - p1[1]) / 6 + j()];
    d += ` C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`;
  }
  return d;
}
