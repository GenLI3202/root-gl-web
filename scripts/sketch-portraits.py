"""
Generate the pen-sketch character portraits used on the Hobbies page.

Style rules live in docs/illustration-style.md. Every portrait is built from the same
faceless bust (head, ear, nose hint, neck, sloped shoulders) plus hair, clothing, and one
identifying prop, so new characters stay consistent with the existing ones.

Usage:
    python3 scripts/sketch-portraits.py            # write all portraits
    python3 scripts/sketch-portraits.py luo-ji     # write selected portraits

Output: public/images/hobbies/<slug>.svg
"""

import os
import sys

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "hobbies")

# ── Palette and strokes (keep in sync with docs/illustration-style.md) ──────────────
PAPER = "#F3EFE6"
INK = "#2A2724"
MAIN_STROKE = 1.5
RETRACE_STROKE = 0.8
RETRACE_OPACITY = 0.4

# ── Shared bust, 96 × 120 canvas ──────────────────────────────────────────────────────
HEAD = (
    "M47 26 C56 25.5 61.5 32 61.5 41 C61.5 50 57 57.5 50 59 C47 59.6 44 58.6 41.6 56.4 "
    "C37 52 35 46 35.2 40 C35.5 31.5 40 26.4 47.6 26.2"
)
EAR = "M61.2 40 C63.6 39.6 64.4 43 62 45.4"
NOSE = "M49.5 41.5 C49 45 48.4 47 50.6 47.6"
NECK = "M43 57.5 C43.4 62 43 66 42 69 M55.5 55 C55.6 60 56 64 57 67.5"
SHOULDER_L = "M6 120 C9 104 17 93 32 86.5 C37 84.4 40.6 80 42 69"
SHOULDER_R = "M57 67.5 C58.6 77 63 82.6 70 85.6 C80 90 87 100 90 120"
BUST = [HEAD, EAR, NOSE, NECK, SHOULDER_L, SHOULDER_R]

# Traditional cross collar (交领), left over right
CROSS_COLLAR = [
    "M42 69 C45 78 50 86 58 96",
    "M57 67.5 C55.6 73 53.6 77.6 51 81.4",
]


def star(cx: float, cy: float, r: float) -> str:
    """Five-point star drawn as one slightly open stroke."""
    import math

    points = []
    for i in range(10):
        angle = -math.pi / 2 + i * math.pi / 5
        radius = r if i % 2 == 0 else r * 0.45
        points.append((cx + radius * math.cos(angle), cy + radius * math.sin(angle)))
    d = f"M{points[0][0]:.1f} {points[0][1]:.1f} " + " ".join(
        f"L{x:.1f} {y:.1f}" for x, y in points[1:]
    )
    return d + f" L{points[0][0]:.1f} {points[0][1] + 0.4:.1f}"


PORTRAITS = {
    "guo-jing": {
        "label": "Guo Jing, sketched with a bow",
        "paths": BUST
        + CROSS_COLLAR
        + [
            # hair pulled into a topknot with a band
            "M35.6 38 C34.6 29 40.6 23.4 48.6 23.6 C56.4 23.8 62 28.6 61.6 37",
            "M44.6 23.8 C44 19.6 46 17 48.8 17 C51.6 17 53.4 19.6 52.8 23.6",
            "M44.4 21.4 C47 22.2 50.6 22.2 53 21.2",
            # bow slung behind the left shoulder, with its string
            "M14 32 C2 52 4 80 22 100",
            "M14.4 32.6 L21.6 99.4",
            "M12.6 30.6 L15.6 33.4 M20.6 98 L23.6 101",
        ],
    },
    "linghu-chong": {
        "label": "Linghu Chong, sketched with a wine gourd",
        "paths": BUST
        + CROSS_COLLAR
        + [
            # loose hair tied back, with a stray strand
            "M35.4 39 C34 29 40 22.6 48.4 22.8 C57 23 62.6 28.4 62.2 38",
            "M61.6 33 C66 36 67.6 44 66 52 C65.4 56 66.4 60 68.6 63",
            "M40 27.6 C38.4 33 37.6 37.6 37.8 42.6",
            "M38.6 28 C42 30.6 45.6 30 48.6 27",
            # wine gourd hanging from a cord on the right
            "M73 62 C73.4 66 74 68 74.6 70",
            "M74.4 70 C77.6 70 79 72.6 78.6 75.2 C78.2 77 77 78 75.8 78.4 "
            "C80 79.6 82.4 83.6 81.6 88 C80.8 92.4 77 95 73 94.6 "
            "C69 94.2 66 91 66.2 86.8 C66.4 83 69 80 72.4 78.6 "
            "C71 78 70 76.6 70.2 74.8 C70.4 72 72 70.2 74.8 70.2",
            "M71 72.4 L77.6 72.6",
        ],
    },
    "sinclair": {
        "label": "Sinclair, sketched with a bird breaking out of its egg",
        "paths": BUST
        + [
            # side-parted hair
            "M35.4 38.6 C34.2 29 40.4 22.8 48.6 23 C56.8 23.2 62.4 28.6 61.8 37.4",
            "M43 23.6 C47 28 53 30.4 60.6 31",
            "M43 23.6 C40.4 27.6 37.6 30.6 35.6 34",
            # high collar and tie
            "M42 69 C44 72 46 73.6 48.8 74 C51.6 73.6 54.6 71.6 57 67.5",
            "M48.8 74 L46.6 78 L48.8 96 L51 78 L48.8 74",
            # the egg cracking open, a small bird head breaking through
            "M67.6 24 C67.4 31.4 72 36 78 36 C84 36 88.6 31.4 88.4 23.6",
            "M67.6 24 L70.6 20.6 L73.8 24.2 L77 20 L80.4 23.8 L83.6 20.4 L86.6 23.6 L88.4 22.4",
            "M73.6 19.6 C72.6 13.6 75.6 9 79.6 9.2 C83.4 9.4 85.6 13 84.6 17.4 C84.2 19 83.6 20 82.6 20.8",
            "M84.4 12.6 L89.6 13.8 L84.6 15.6",
            "M80 13 L80.2 13.4",
        ],
    },
    "ye-wenjie": {
        "label": "Ye Wenjie, sketched with the Red Coast dish",
        "paths": BUST
        + [
            # short straight hair to the jaw
            "M48 22.6 C38.6 22.2 33 29.6 33.6 40 C34 48 33.4 54 32 58 C35.6 58.6 38.4 57.4 40 55",
            "M48 22.6 C57.6 22.4 63.4 29.4 63 39.6 C62.8 47 63.6 52.6 65.4 56.4 C62.6 57.4 60 56.6 58.4 54",
            "M48.2 23 C46.4 28 42.4 31.4 36.6 33",
            # round glasses
            "M39.6 40.4 C39.6 37.8 41.6 36.4 43.6 36.6 C45.6 36.8 46.8 38.6 46.6 40.8 "
            "C46.4 42.8 44.6 44 42.8 43.8 C40.8 43.6 39.6 42.2 39.6 40.4",
            "M51.6 40.2 C51.6 37.8 53.6 36.4 55.6 36.6 C57.6 36.8 58.8 38.6 58.6 40.6 "
            "C58.4 42.6 56.6 43.8 54.8 43.6 C52.8 43.4 51.6 42 51.6 40.2",
            "M46.6 39.8 C48.2 39 50 39 51.6 39.6",
            # work jacket collar
            "M42 69 C40 74 38.4 79 37.6 84 M57 67.5 C59 72 60.4 77 61 82",
            "M42.4 70 L49 82 L56.6 68.6",
            # Red Coast radio dish, up right
            "M68.4 31 C71 19 82 11.6 92 13",
            "M68.4 31 C77.4 31.4 89 25 92 13",
            "M80.4 22.4 L73.6 15.6 M72.4 14.6 L74.8 16.8",
            "M80.6 23.4 L82.4 37",
            "M76 37.6 C80 37.2 84.6 37.2 89 37.8",
        ],
    },
    "luo-ji": {
        "label": "Luo Ji, sketched with a sword over his shoulder",
        "paths": BUST
        + [
            # untidy hair
            "M35.6 39 C34 29.5 40.5 22.5 49 22.8 C56.6 23 62.6 28 62 37.5",
            "M39 29 C42 26.6 45 28.4 48 25.6 C50.5 28.6 54.5 27 58.5 30.4",
            "M36.4 34.4 C39.5 31.4 42.6 32.4 45 29.6",
            # shirt collar
            "M42 69 C44.6 74 47 77 49 78.4 C51.5 76.4 54.6 72 57 67.5",
            # the Swordholder's sword: blade, guard, grip, pommel
            "M60 96 L83.4 21",
            "M61.6 88.6 C65.4 90.2 69 91.6 72.4 92.6",
            "M65.8 91.6 L62.2 103",
            "M60.4 104.6 C61 102.8 63.4 103 63.8 104.8 C63.4 106.6 61 106.6 60.4 104.6",
        ],
    },
    "zhang-beihai": {
        "label": "Zhang Beihai, sketched in a naval cap",
        "paths": BUST
        + [
            # peaked cap: crown, band, visor
            "M34 33 C33.4 24 40.6 18.6 49.4 18.8 C58.4 19 64.6 23.6 64 32.4",
            "M34.6 33.4 C44 35 54 35 63.6 32.8",
            "M35 34 C34 37.4 35.6 38.6 38 38.2 C46 36.8 53.6 36.8 60.6 37.8 C63.4 38.2 64.4 36 63.6 33.6",
            star(49.1, 26.8, 3.2),
            # high uniform collar, lapels, buttons
            "M42 69 C43 72 43.4 74 43.6 76 M57 67.5 C56 70.6 55.6 73.4 55.6 76",
            "M38 82 L47.6 101 L52.4 90 L56 80",
            "M47.8 108 L48 109 M48 116 L48.2 117",
            # epaulette hints
            "M18 93.6 L31 87.6 M68 86.4 L81 92.6",
        ],
    },
    "cheng-xin": {
        "label": "Cheng Xin, sketched with a small star",
        "paths": [HEAD, NOSE, NECK, SHOULDER_L, SHOULDER_R]
        + [
            # bob haircut framing the face
            "M48.4 22 C38 21.6 32 29 32.4 40 C32.8 50 31 58 28.6 63.4 C32.6 64 36 62.4 38.4 59",
            "M48.4 22 C58.6 21.8 65 29 64.6 40 C64.2 50 66 58 68.6 63.4 C64.6 64 61 62.4 58.8 58.6",
            "M48.6 22.4 C45 28.4 40 31 34.6 32",
            "M48.6 22.4 C51.6 27.6 56.4 30.2 62.6 31.2",
            # soft neckline
            "M41 74 C44.4 79.6 52.6 79.4 56.6 73.6",
            # the star Yun Tianming gave her, with two specks
            star(80.1, 19.4, 6.2),
            "M87 29 L87.3 30 M73 31 L73.2 32",
        ],
    },
}

TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 120" role="img" aria-label="{label}">
  <!-- Pen sketch portrait. Generated by scripts/sketch-portraits.py; style: docs/illustration-style.md -->
  <defs>
    <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="{seed}"/>
      <feDisplacementMap in="SourceGraphic" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <rect width="96" height="120" fill="{paper}"/>
  <g fill="none" stroke="{ink}" stroke-linecap="round" stroke-linejoin="round" filter="url(#wobble)">
    <g stroke-width="{main}">
{paths}
    </g>
    <g stroke-width="{retrace}" opacity="{retrace_opacity}" transform="rotate(1.4 48 60) translate(0.5 -0.4)">
{paths}
    </g>
  </g>
</svg>
"""


def render(slug: str, portrait: dict, seed: int) -> str:
    paths = "\n".join(f'      <path d="{d}"/>' for d in portrait["paths"])
    return TEMPLATE.format(
        label=portrait["label"],
        seed=seed,
        paper=PAPER,
        ink=INK,
        main=MAIN_STROKE,
        retrace=RETRACE_STROKE,
        retrace_opacity=RETRACE_OPACITY,
        paths=paths,
    )


def main() -> None:
    selected = sys.argv[1:] or list(PORTRAITS)
    for index, slug in enumerate(PORTRAITS):
        if slug not in selected:
            continue
        path = os.path.join(OUT_DIR, f"{slug}.svg")
        with open(path, "w", encoding="utf-8") as f:
            f.write(render(slug, PORTRAITS[slug], seed=5 + index * 3))
        print(f"wrote {os.path.relpath(path)}")


if __name__ == "__main__":
    main()
