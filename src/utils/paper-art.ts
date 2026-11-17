/**
 * Ink drawings for the page's paper (see PaperSketch): pieces of Gen's life taken from the
 * "between models and mountains" poster and redrawn in the study room's freehand manner. Each
 * drawing is a list of strokes in the order a pen would go, in four weights, plus pale washes.
 * Every drawing has its own seeded jitter, so changing one never moves the lines of another.
 */
import { seeded, seedOf, sketchCurve, sketchSegment, type Point } from "@/utils/sketch";
import type { Locale } from "@/i18n";

export interface PaperArt {
  viewBox: string;
  /** Main strokes */
  ink: string[];
  /** Details: windows, folds, texture */
  fine: string[];
  /** Far background: hills, water, shadows */
  faint: string[];
  /** Strokes in the red pen (the poster's red bike and road) */
  accent: string[];
  /** Pale ink wash that comes in last */
  wash: string[];
  /** Accessible description */
  label: Record<Locale, string>;
  /** Hand-written place name in the margin, for places only */
  caption?: Record<Locale, { place: string; note?: string }>;
  /** Width relative to a landscape drawing; tall subjects such as the guitar are narrower */
  scale?: number;
  /**
   * A finished pen-and-colour drawing as an image instead of strokes, for subjects that must
   * look like the real thing (Gen's own bike). Transparent where the paper was.
   */
  raster?: { src: string; width: number; height: number };
}

export type PaperArtId =
  | "munich"
  | "baima"
  | "bike"
  | "ride"
  | "books"
  | "guitar";

/* ── Pen helpers; `rand` is reseeded for each drawing ── */

let rand = seeded(1);
const seg = (a: Point, b: Point, wobble = 0.7): string => sketchSegment(a, b, rand, wobble);
const curve = (points: Point[], wobble = 0.8): string => sketchCurve(points, rand, wobble);
const r1 = (n: number): number => Math.round(n * 10) / 10;

/** Ellipse as one open stroke that overshoots its start a little, the way a pen closes a loop */
function loop(cx: number, cy: number, rx: number, ry: number, from = -100, sweep = 372): string {
  const pts: Point[] = [];
  for (let deg = from; deg <= from + sweep; deg += 30) {
    const t = (deg * Math.PI) / 180;
    const wob = 1 + (rand() - 0.5) * 0.06;
    pts.push([cx + Math.cos(t) * rx * wob, cy + Math.sin(t) * ry * wob]);
  }
  return sketchCurve(pts, rand, 0.2);
}

/** Closed ellipse for washes */
function disc(cx: number, cy: number, rx: number, ry = rx): string {
  return `M${r1(cx - rx)} ${r1(cy)} A${r1(rx)} ${r1(ry)} 0 1 1 ${r1(cx + rx)} ${r1(cy)} A${r1(rx)} ${r1(ry)} 0 1 1 ${r1(cx - rx)} ${r1(cy)} Z`;
}

/** Small round-headed opening (cave, gate, window), drawn as one stroke from its foot */
function arch(x: number, y: number, w: number, h: number): string {
  const r = w / 2;
  return `M${r1(x)} ${r1(y)} V${r1(y - h + r)} A${r1(r)} ${r1(r)} 0 0 1 ${r1(x + w)} ${r1(y - h + r)} V${r1(y)}`;
}

/** Pointed Gothic window */
function lancet(x: number, y: number, w: number, h: number): string {
  return `M${r1(x)} ${r1(y)} V${r1(y - h)} Q${r1(x + w * 0.1)} ${r1(y - h - w * 0.9)} ${r1(x + w / 2)} ${r1(
    y - h - w * 1.1
  )} Q${r1(x + w * 0.9)} ${r1(y - h - w * 0.9)} ${r1(x + w)} ${r1(y - h)} V${r1(y)}`;
}

/** Rounded tree crowns along a line, one stroke, left to right */
function treeline(x0: number, x1: number, y: number, size: number): string {
  let x = x0;
  let d = `M${r1(x)} ${r1(y)}`;
  while (x < x1) {
    const w = size * (0.6 + rand() * 0.9);
    const h = size * (0.4 + rand() * 0.8);
    d += ` C${r1(x + w * 0.05)} ${r1(y - h)} ${r1(x + w * 0.95)} ${r1(y - h)} ${r1(x + w)} ${r1(y)}`;
    x += w;
  }
  return d;
}

/** Fir: trunk, then three tiers of branches */
function fir(cx: number, base: number, h: number): string {
  const tier = (y: number, w: number): string =>
    `M${r1(cx - w)} ${r1(y)} L${r1(cx)} ${r1(y - h * 0.32)} L${r1(cx + w)} ${r1(y)}`;
  return [
    seg([cx, base], [cx, base - h], 0.3),
    tier(base - h * 0.12, h * 0.28),
    tier(base - h * 0.38, h * 0.22),
    tier(base - h * 0.64, h * 0.15),
  ].join(" ");
}

/** Short parallel strokes (roof tiles, page edges, frets) between two points */
function hatch(a: Point, b: Point, n: number, dx: number, dy: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const x = a[0] + (b[0] - a[0]) * t;
    const y = a[1] + (b[1] - a[1]) * t;
    return seg([x, y], [x + dx, y + dy], 0.2);
  });
}

function draw(id: PaperArtId, build: () => PaperArt): PaperArt {
  rand = seeded(seedOf(id));
  return build();
}

/* ── Munich: Frauenkirche from the west, Alps behind ── */

/** Onion dome on a tower whose cornice is at `base`, centred on `cx` */
function onion(cx: number, base: number): string {
  return (
    `M${cx - 11} ${base} C${cx - 17} ${base - 8} ${cx - 14} ${base - 20} ${cx - 6} ${base - 26} ` +
    `C${cx - 2} ${base - 29} ${cx - 1} ${base - 32} ${cx} ${base - 37} ` +
    `C${cx + 1} ${base - 32} ${cx + 2} ${base - 29} ${cx + 6} ${base - 26} ` +
    `C${cx + 14} ${base - 20} ${cx + 17} ${base - 8} ${cx + 11} ${base}`
  );
}

const munich = draw("munich", () => {
  const L = { x: 56, w: 26, cx: 69 };
  const R = { x: 96, w: 26, cx: 109 };
  const top = 74;
  const foot = 166;
  return {
    viewBox: "0 -8 220 202",
    ink: [
      seg([L.x, foot], [L.x, top], 0.6),
      seg([L.x + L.w, foot], [L.x + L.w, top], 0.6),
      seg([R.x, foot], [R.x, top], 0.6),
      seg([R.x + R.w, foot], [R.x + R.w, top], 0.6),
      seg([L.x - 2, top], [L.x + L.w + 2, top], 0.4),
      seg([R.x - 2, top], [R.x + R.w + 2, top], 0.4),
      onion(L.cx, top),
      onion(R.cx, top),
      seg([L.cx, top - 37], [L.cx, top - 47], 0.2),
      seg([R.cx, top - 37], [R.cx, top - 47], 0.2),
      seg([L.x + L.w, 116], [R.x, 116], 0.4),
      lancet(84, foot, 10, 10),
      curve([[122, 104], [160, 100], [194, 98]], 0.5),
      seg([194, 98], [206, 128], 0.5),
      seg([122, 130], [206, 130], 0.6),
      seg([206, 130], [206, foot], 0.5),
      treeline(2, 214, 172, 12),
      fir(14, 168, 34),
      fir(212, 168, 30),
    ],
    fine: [
      lancet(66, 100, 6, 10),
      lancet(106, 100, 6, 10),
      lancet(66, 140, 6, 12),
      lancet(106, 140, 6, 12),
      seg([L.x, 112], [L.x + L.w, 112], 0.3),
      seg([R.x, 112], [R.x + R.w, 112], 0.3),
      lancet(136, 162, 6, 16),
      lancet(156, 162, 6, 16),
      lancet(176, 162, 6, 16),
      lancet(194, 162, 6, 16),
      seg([142, 104], [146, 128], 0.4),
      seg([162, 101], [166, 128], 0.4),
      seg([182, 99], [186, 128], 0.4),
      loop(L.cx, top - 49, 2, 2),
      loop(R.cx, top - 49, 2, 2),
    ],
    faint: [
      curve([[0, 66], [16, 50], [30, 58], [46, 44], [54, 50]], 1),
      curve([[126, 74], [146, 54], [162, 64], [182, 40], [198, 56], [220, 46]], 1),
    ],
    accent: [],
    wash: [`${onion(L.cx, top)} Z`, `${onion(R.cx, top)} Z`, "M122 104 L194 98 L206 128 L122 130 Z"],
    label: {
      en: "Pen sketch of the Frauenkirche in Munich, its two domed towers, with the Alps behind",
      zh: "钢笔速写：慕尼黑圣母教堂的双塔圆顶，远处是阿尔卑斯山",
      de: "Federskizze der Frauenkirche in München mit ihren zwei Turmhauben, dahinter die Alpen",
    },
    caption: {
      en: { place: "Munich · Frauenkirche", note: "home now" },
      zh: { place: "慕尼黑 · 圣母教堂", note: "现在住在这里" },
      de: { place: "München · Frauenkirche", note: "heute zu Hause" },
    },
  };
});

/* ── Luoyang: White Horse Temple, drawn from photos of the real gate ──
   The Ming gate is three blocks, the middle one taller, each under its own hip-and-gable roof with
   upturned corners and curled ridge ends; the name plaque hangs over the big middle arch. In front
   stands one of the two saddled Song stone horses, heavy-bodied with its head bowed. */

/** Stone horse with a saddle, side on and facing right, hooves at (x, y), `s` times life size here */
function stoneHorse(x: number, y: number, s: number): { ink: string[]; fine: string[]; wash: string[] } {
  const P = (dx: number, dy: number): string => `${r1(x + dx * s)} ${r1(y + dy * s)}`;
  const Q = (dx: number, dy: number): Point => [x + dx * s, y + dy * s];
  const cloth = `M${P(14, -32)} L${P(13, -17)} Q${P(23, -15)} ${P(33, -17)} L${P(32.5, -33)}`;
  return {
    ink: [
      // Outline: big round rump, short thick legs, broad chest, arched neck, head bowed nearly upright
      `M${P(8, -32)} Q${P(0, -32)} ${P(-1, -24)} Q${P(-1, -17)} ${P(2, -14)} L${P(2.5, 0)} L${P(9.5, 0)} L${P(9.5, -12)} ` +
        `Q${P(22, -10)} ${P(33, -13)} L${P(33.5, 0)} L${P(40.5, 0)} L${P(40.5, -14)} Q${P(45, -17)} ${P(45, -25)} ` +
        `Q${P(46, -31)} ${P(47.5, -33)} Q${P(46.2, -27.5)} ${P(49.6, -25.4)} L${P(51.5, -22.5)} Q${P(53, -20.5)} ${P(55.5, -22)} L${P(53.5, -37)} ` +
        `Q${P(52.5, -41.5)} ${P(49, -42)} Q${P(44, -41)} ${P(36, -34)} L${P(8, -32)}`,
      // Ears
      `M${P(49, -42)} L${P(49.6, -46.2)} L${P(51.4, -42.2)}`,
      // Saddle: cantle, seat, pommel, then the big cloth hanging down the flank
      `M${P(14, -32)} Q${P(13, -39)} ${P(16.5, -38.5)} Q${P(23, -33.5)} ${P(30, -38.5)} Q${P(33.5, -39)} ${P(32.5, -33)}`,
      cloth,
    ],
    fine: [
      // Far legs, tied tail, eye, cropped mane
      `M${P(11.5, -13)} L${P(12.5, 0)} M${P(30.5, -13)} L${P(31.5, 0)}`,
      `M${P(-0.5, -28)} Q${P(-4, -22)} ${P(-2, -13)} M${P(-3.4, -19)} L${P(-0.6, -18.2)}`,
      loop(x + 52.2 * s, y - 36.4 * s, 0.7 * s, 0.6 * s),
      ...hatch(Q(38, -35.5), Q(47, -41.6), 5, -1 * s, -1.8 * s),
      // Bridle and rein, breast strap, crupper, stirrup, folds in the cloth
      `M${P(50, -40)} L${P(52, -27)} M${P(51.6, -27)} L${P(55, -26)} M${P(54, -23)} Q${P(44, -24)} ${P(32.5, -31)}`,
      `M${P(33, -28)} Q${P(40, -24)} ${P(45, -21)}`,
      `M${P(14, -29)} Q${P(6, -31)} ${P(0, -26)}`,
      `M${P(23, -16)} L${P(23, -11.5)} M${P(21.5, -11.5)} L${P(24.5, -11.5)}`,
      `M${P(18.5, -31)} L${P(18, -16.5)} M${P(28, -31)} L${P(28.5, -16)}`,
    ],
    wash: [`${cloth} Z`],
  };
}

/** The plaque's three characters, read right to left: 白 馬 寺. Strokes in an 8 × 9 box. */
const PLAQUE_GLYPHS: Point[][][] = [
  // 寺
  [
    [[1.6, 1.6], [6.4, 1.6]], [[4, 0], [4, 3.4]], [[0.6, 3.4], [7.4, 3.4]],
    [[0.6, 5], [7.4, 5]], [[5.6, 3.9], [5.6, 8.6], [5.2, 9], [4.3, 8.5]], [[2.3, 6.2], [3.2, 7.4]],
  ],
  // 馬
  [
    [[1.2, 0.4], [1.2, 5.6]], [[1.2, 0.4], [6.2, 0.4]], [[1.2, 2], [5.8, 2]], [[1.2, 3.6], [5.8, 3.6]],
    [[3.6, 0.4], [3.6, 5.6]], [[1.2, 5.6], [7.2, 5.6], [7.3, 7.6], [6.8, 8.7], [5.8, 8.6]],
    [[1.6, 7], [1.1, 8.2]], [[2.9, 7], [2.7, 8.2]], [[4.2, 7], [4.2, 8.2]], [[5.4, 7], [5.6, 8]],
  ],
  // 白
  [
    [[4.2, 0], [3.4, 1.4]], [[1.4, 1.8], [1.4, 9]], [[1.4, 1.8], [6.6, 1.8], [6.6, 9]],
    [[1.4, 5.3], [6.6, 5.3]], [[1.4, 8.8], [6.6, 8.8]],
  ],
];

/** One character from PLAQUE_GLYPHS with its box's top left at (x, y), scaled by k */
function glyph(strokes: Point[][], x: number, y: number, k: number): string {
  return strokes
    .map((line) => line.map(([gx, gy], i) => `${i ? "L" : "M"}${r1(x + gx * k)} ${r1(y + gy * k)}`).join(" "))
    .join(" ");
}

/**
 * Hip-and-gable roof seen from the front, on a block from wall `x0` to wall `x1`. `left`/`right`
 * say whether that end overhangs with an upturned corner and a curled ridge end; an end without
 * one runs into the taller middle block.
 */
function gateRoof(
  x0: number, x1: number, eave: number, ridge: number, left: boolean, right: boolean
): { ink: string[]; fine: string[]; wash: string } {
  const over = 10;
  const inset = 6;
  const lx = left ? x0 - over : x0;
  const rx = right ? x1 + over : x1;
  const rl = left ? x0 + inset : x0;
  const rr = right ? x1 - inset : x1;
  const lip = 3;
  const eaveLine =
    `M${r1(lx)} ${r1(left ? eave - lip : eave)} ` +
    (left ? `Q${r1(lx + 6)} ${r1(eave + 3)} ${r1(lx + 16)} ${r1(eave + 3)} ` : "") +
    `Q${r1((lx + rx) / 2)} ${r1(eave + 4.5)} ${r1(right ? rx - 16 : rx)} ${r1(eave + 3)} ` +
    (right ? `Q${r1(rx - 6)} ${r1(eave + 3)} ${r1(rx)} ${r1(eave - lip)}` : "");
  const ink = [eaveLine, seg([rl, ridge], [rr, ridge], 0.3)];
  if (left) {
    ink.push(`M${r1(rl + 1)} ${r1(ridge + 1)} Q${r1(rl - 2)} ${r1(eave - 6)} ${r1(lx + 1)} ${r1(eave - lip + 0.6)}`);
    ink.push(`M${r1(rl + 1)} ${r1(ridge)} Q${r1(rl - 4)} ${r1(ridge - 1)} ${r1(rl - 3)} ${r1(ridge - 7)} Q${r1(rl - 0.5)} ${r1(ridge - 8.5)} ${r1(rl + 1)} ${r1(ridge - 4)}`);
  }
  if (right) {
    ink.push(`M${r1(rr - 1)} ${r1(ridge + 1)} Q${r1(rr + 2)} ${r1(eave - 6)} ${r1(rx - 1)} ${r1(eave - lip + 0.6)}`);
    ink.push(`M${r1(rr - 1)} ${r1(ridge)} Q${r1(rr + 4)} ${r1(ridge - 1)} ${r1(rr + 3)} ${r1(ridge - 7)} Q${r1(rr + 0.5)} ${r1(ridge - 8.5)} ${r1(rr - 1)} ${r1(ridge - 4)}`);
  }
  const tiles = Math.max(4, Math.round((rr - rl) / 3.6));
  const fine = [
    ...hatch([rl + 3, ridge + 2.5], [rr - 3, ridge + 2.5], tiles, 0, eave - ridge - 1),
    // Bracket band under the eave
    seg([x0, eave + 9], [x1, eave + 9], 0.3),
    ...hatch([x0 + 3, eave + 5], [x1 - 3, eave + 5], Math.round((x1 - x0) / 5), 0, 3.5),
  ];
  const wash = `M${r1(lx)} ${r1(left ? eave - lip : eave)} L${r1(rx)} ${r1(right ? eave - lip : eave)} L${r1(rr)} ${r1(ridge)} L${r1(rl)} ${r1(ridge)} Z`;
  return { ink, fine, wash };
}

const baima = draw("baima", () => {
  const ground = 150;
  const mid = gateRoof(122, 178, 70, 50, true, true);
  const west = gateRoof(88, 122, 92, 80, true, false);
  const east = gateRoof(178, 212, 92, 80, false, true);
  const horse = stoneHorse(10, 178, 1.25);
  const k = 0.85;
  return {
    viewBox: "0 34 280 166",
    ink: [
      // Middle block: roof, walls, plaque with the temple's name, the big arch
      ...mid.ink,
      seg([122, 79], [122, ground], 0.4),
      seg([178, 79], [178, ground], 0.4),
      "M131 85 H169 V99 H131 Z",
      ...PLAQUE_GLYPHS.map((g, i) => glyph(g, 138.2 + i * 8.4, 88.2, k)),
      arch(139, ground, 22, 30),
      // Side blocks, lower, each with its own roof and a smaller arch
      ...west.ink,
      ...east.ink,
      seg([88, 101], [88, ground], 0.4),
      seg([212, 101], [212, ground], 0.4),
      arch(97, ground, 16, 22),
      arch(187, ground, 16, 22),
      // Red walls running off either side under tiled copings
      "M16 103 Q52 106 88 103",
      "M212 103 Q246 106 280 103",
      seg([84, ground], [280, ground], 0.6),
      // The stone horse in front, on its plinth
      ...horse.ink,
      "M4 178 H86 M4 178 V184 H86 V178",
    ],
    fine: [
      ...mid.fine,
      ...west.fine,
      ...east.fine,
      "M133 87 H167 V97 H133 Z",
      // Brick rings over the arches, the door's meeting line
      "M134 131 A16 16 0 0 1 166 131",
      "M94 136 A11 11 0 0 1 116 136",
      "M184 136 A11 11 0 0 1 206 136",
      seg([150, 121], [150, ground], 0.2),
      // Coping undersides, the wall end, the grey footing along the walls
      "M16 108 H88 M212 108 H280",
      seg([16, 108], [16, 130], 0.3),
      "M84 143 H97 M113 143 H139 M161 143 H187 M203 143 H280",
      ...horse.fine,
      "M0 184 V189 H90 V184",
    ],
    faint: [
      // Old pines behind the walls, the paved approach
      fir(38, 103, 58),
      fir(250, 103, 62),
      fir(268, 103, 44),
      treeline(16, 70, 103, 12),
      treeline(222, 280, 103, 12),
      seg([132, ground], [120, 196], 0.5),
      seg([168, ground], [180, 196], 0.5),
    ],
    accent: [],
    wash: [
      mid.wash,
      west.wash,
      east.wash,
      "M131 85 H169 V99 H131 Z",
      `${arch(139, ground, 22, 30)} Z`,
      `${arch(97, ground, 16, 22)} Z`,
      `${arch(187, ground, 16, 22)} Z`,
      ...horse.wash,
    ],
    label: {
      en: "Pen sketch of the White Horse Temple in Luoyang: the gate with three arches under stepped roofs and its name plaque, a saddled Song stone horse in front",
      zh: "钢笔速写：洛阳白马寺山门，三座拱门、层叠的飞檐和「白马寺」匾额，门前一匹披鞍的宋代石马",
      de: "Federskizze des Tempels des Weißen Pferdes in Luoyang: das Tor mit drei Bögen unter gestaffelten Dächern und der Namenstafel, davor ein gesatteltes Steinpferd aus der Song-Zeit",
    },
    caption: {
      en: { place: "Luoyang · White Horse Temple", note: "my home town" },
      zh: { place: "洛阳 · 白马寺", note: "老家" },
      de: { place: "Luoyang · Baima-Tempel", note: "meine Heimatstadt" },
    },
  };
});

/* ── Gen's road bike, a Lapierre: the poster's pen-and-colour drawing, keyed out of its paper ── */

const bike: PaperArt = {
  viewBox: "0 0 1000 559",
  ink: [],
  fine: [],
  faint: [],
  accent: [],
  wash: [],
  raster: { src: "/images/sketches/bike.webp", width: 1000, height: 559 },
  label: {
    en: "Pen-and-colour drawing of Gen's Lapierre road bike: burgundy aero frame, deep UP wheels, Ultegra",
    zh: "钢笔淡彩：我的 Lapierre 公路车，酒红色气动车架，UP 高框轮组，Ultegra 套件",
    de: "Feder- und Farbzeichnung von Gens Lapierre-Rennrad: bordeauxroter Aero-Rahmen, hohe UP-Felgen, Ultegra",
  },
};

/* ── A rider from behind on a winding road toward the mountains ── */

const RIDGE: Point[] = [[0, 86], [26, 62], [44, 72], [72, 36], [96, 58], [122, 30], [150, 54], [176, 40], [204, 64], [240, 52]];
const FOOTHILLS: Point[] = [[0, 98], [40, 84], [86, 94], [130, 80], [180, 90], [240, 78]];

const ride = draw("ride", () => ({
  viewBox: "0 0 240 200",
  ink: [
    // Mountains, the rider, then fences and trees along the road
    curve(RIDGE, 1.2),
    loop(132, 104, 3.4, 3.8, -80),
    "M128 103 Q132 97 136 103",
    curve([[127, 110], [126, 116], [128, 124]], 0.2),
    curve([[137, 110], [138, 116], [136, 124]], 0.2),
    "M126 109 Q132 107 138 109",
    "M124 112 L122 118 M140 112 L142 118",
    "M120 118 H144",
    seg([132, 124], [130, 134], 0.2),
    seg([132, 124], [134, 134], 0.2),
    loop(132, 136, 2.2, 7, -90),
    fir(208, 150, 34),
    fir(222, 158, 28),
  ],
  fine: [
    curve([[72, 36], [78, 52], [74, 66]], 0.5),
    curve([[122, 30], [128, 46], [124, 58]], 0.5),
    curve([[176, 40], [182, 52], [178, 62]], 0.5),
    ...[150, 162, 174, 186, 198].map((x, i) => seg([x, 150 + i * 8], [x, 140 + i * 8], 0.2)),
    curve([[150, 144], [174, 160], [198, 176]], 0.4),
    treeline(0, 60, 150, 10),
  ],
  faint: [curve(FOOTHILLS, 1)],
  accent: [
    // The road: from the near corner, winding up past the rider into the hills
    curve([[200, 200], [150, 184], [96, 176], [110, 160], [150, 150], [138, 138], [124, 128], [100, 120], [92, 108]], 0.6),
  ],
  wash: [`${curve(RIDGE, 0)} ${[...FOOTHILLS].reverse().map(([x, y]) => `L${x} ${y}`).join(" ")} Z`],
  label: {
    en: "Pen sketch of a cyclist from behind on a winding red road, riding toward the mountains",
    zh: "钢笔速写：骑手的背影，红色的弯路一直通向远山",
    de: "Federskizze eines Radfahrers von hinten auf einer gewundenen roten Straße in Richtung Berge",
  },
}));

/* ── A stack of books with a vase and a flowering branch ── */

/** One book lying flat: cover outline and the page edges on its open side */
function book(x: number, y: number, w: number, h: number): { ink: string; fine: string[] } {
  return {
    ink: `M${x} ${y} H${x + w} V${y + h} H${x} Z`,
    fine: [
      seg([x + 6, y], [x + 6, y + h], 0.1),
      ...hatch([x + w - 14, y + h * 0.3], [x + w - 14, y + h * 0.75], 2, 12, 0),
    ],
  };
}

const books = draw("books", () => {
  const stack = [book(28, 170, 124, 16), book(36, 154, 110, 16), book(24, 140, 116, 14), book(40, 126, 94, 14)];
  return {
    viewBox: "0 10 200 186",
    ink: [
      ...stack.map((b) => b.ink),
      // Vase on top, a plum branch rising out of it
      "M76 126 Q66 116 72 104 Q76 98 78 92 H90 Q92 98 96 104 Q102 116 92 126",
      curve([[84, 92], [86, 70], [96, 52], [110, 34]], 0.5),
      curve([[90, 66], [104, 60], [118, 62]], 0.4),
      curve([[86, 78], [74, 66], [66, 50]], 0.4),
    ],
    fine: [
      ...stack.flatMap((b) => b.fine),
      loop(110, 34, 3, 3),
      loop(118, 62, 3, 3),
      loop(66, 50, 3, 3),
      loop(98, 48, 2.4, 2.4),
      loop(74, 62, 2.4, 2.4),
      loop(106, 60, 2.2, 2.2),
    ],
    faint: [seg([4, 188], [196, 188], 0.6)],
    accent: [],
    wash: ["M76 126 Q66 116 72 104 Q76 98 78 92 H90 Q92 98 96 104 Q102 116 92 126 Z", "M28 170 H152 V186 H28 Z"],
    label: {
      en: "Pen sketch of a stack of books with a small vase and a flowering branch on top",
      zh: "钢笔速写：一摞书，上面一只小花瓶插着一枝梅",
      de: "Federskizze eines Bücherstapels mit einer kleinen Vase und einem blühenden Zweig",
    },
  };
});

/* ── Acoustic guitar, standing ── */

const guitar = draw("guitar", () => {
  const body: Point[] = [
    [60, 232], [36, 228], [20, 206], [24, 178], [36, 160], [30, 140], [34, 120], [50, 108], [60, 106],
    [70, 108], [86, 120], [90, 140], [84, 160], [96, 178], [100, 206], [84, 228], [60, 232],
  ];
  return {
    viewBox: "0 -4 120 244",
    ink: [
      curve(body, 0.6),
      loop(60, 140, 11, 11),
      seg([55, 106], [56, 26], 0.3),
      seg([65, 106], [64, 26], 0.3),
      "M56 26 L52 4 H68 L64 26",
      "M48 196 H72 V202 H48 Z",
    ],
    fine: [
      loop(60, 140, 14.5, 14.5, 0),
      ...[34, 44, 54, 64, 74, 84, 94].map((y) => seg([55.5, y], [64.5, y], 0.1)),
      ...[10, 16, 22].flatMap((y) => [seg([52, y], [47, y], 0.1), seg([68, y], [73, y], 0.1)]),
      "M70 126 Q82 130 80 146 Q76 152 70 150",
    ],
    faint: [seg([57, 198], [58, 6], 0.2), seg([60, 198], [60, 6], 0.2), seg([63, 198], [62, 6], 0.2)],
    accent: [],
    wash: [`${curve(body, 0)} Z ${disc(60, 140, 11)}`],
    label: {
      en: "Pen sketch of an acoustic guitar standing upright",
      zh: "钢笔速写：一把立着的木吉他",
      de: "Federskizze einer aufrecht stehenden Akustikgitarre",
    },
    scale: 0.42,
  };
});

export const PAPER_ART: Record<PaperArtId, PaperArt> = {
  munich,
  baima,
  bike,
  ride,
  books,
  guitar,
};
