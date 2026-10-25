# Illustration Style: Pen-Sketch Portraits

Character portraits on this site (Hobbies → Reading carousel, and any future people
drawings) use one style: a quick, faceless pen sketch on warm paper. This file defines
it so new drawings match the existing ones.

Source of truth for the shapes: `scripts/sketch-portraits.py`.
Existing portraits: `public/images/hobbies/{guo-jing,linghu-chong,sinclair,ye-wenjie,luo-ji,zhang-beihai,cheng-xin}.svg`.

## The look in one sentence

A faceless head-and-shoulders figure drawn in a single dark ink line, slightly wobbly and
gone over twice, with exactly one object that tells you who it is.

## Canvas

| Property | Value |
|---|---|
| viewBox | `0 0 96 120` (portrait, 4:5) |
| Background | flat paper `#F3EFE6`, no border |
| Display size | 96 × 120 px in the carousel; scales cleanly to any size |
| Format | inline-path SVG, no raster, no external fonts |

The paper background is baked in so the drawing reads the same in light and dark mode.

## Line

| Property | Value |
|---|---|
| Ink | `#2A2724` (warm near-black, not pure black) |
| Main stroke | 1.5 px, round caps and joins, no fills |
| Retrace | the same paths again at 0.8 px, 40% opacity, rotated 1.4° and shifted (0.5, -0.4) |
| Wobble | `feTurbulence` (fractal noise, base frequency 0.045, 2 octaves) into `feDisplacementMap` (scale 1.8); vary `seed` per portrait |

Draw paths as if by hand:

- Leave closed shapes slightly open: end a stroke 0.3–0.6 px past or short of its start.
- Avoid perfect geometry. Circles are four Béziers with uneven control points; straight
  lines lean by a fraction of a degree.
- Use few strokes. If a detail needs more than 3–4 paths, simplify it.

## Figure

Every portrait starts from the shared bust in the script:

- **Head**: one oval, turned very slightly to the viewer's right (jaw lower on the left).
- **Face**: no eyes, no mouth. Only a short nose hint and, when the hair leaves it visible,
  one ear. Glasses are allowed as an identifying detail.
- **Neck**: two short lines.
- **Shoulders**: two long sloped curves running off the bottom edge. Never a closed
  semicircle.

Then add, in this order:

1. **Hair** in 2–4 strokes: outline plus one or two inner strokes for parting or texture.
2. **Clothing at the collar only**: cross collar (交领) for wuxia characters, shirt collar,
   high collar with tie, uniform lapels, jacket collar.
3. **One identifying prop** taken from the story, placed either beside the figure
   (upper right, x 68–92, y 8–40) or crossing the shoulder line. Examples in use:

| Character | Prop |
|---|---|
| 郭靖 Guo Jing | bow slung behind the shoulder |
| 令狐冲 Linghu Chong | wine gourd on a cord |
| Sinclair | bird breaking out of its egg (Demian) |
| 叶文洁 Ye Wenjie | Red Coast radio dish, round glasses |
| 罗辑 Luo Ji | the Swordholder's sword |
| 章北海 Zhang Beihai | naval cap with star badge, uniform lapels |
| 程心 Cheng Xin | the small star Yun Tianming gave her |

Pick the prop a reader would recognise in under a second. One prop only; the figure
should stay quiet.

## Don'ts

- No faces with eyes or expressions, no shading, no hatching, no colour fills.
- No accent red inside portraits. Red belongs to the page (seal, notes, links).
- No photo tracing of real people. For real people, use the same bust with hair and one
  object from their public work.

## Adding a portrait

1. Add an entry to `PORTRAITS` in `scripts/sketch-portraits.py` (reuse `BUST`,
   `CROSS_COLLAR`, `star()`; write only hair, collar and prop).
2. Run `python3 scripts/sketch-portraits.py <slug>`.
3. Check it next to two existing portraits at 96 × 120 and at 2× before committing.

## Prompt for an image model

If a drawing is made with an image model instead of the script, use this description and
then trace or clean it to the rules above:

> Minimal faceless head-and-shoulders portrait, single warm near-black ink line on flat
> cream paper (#F3EFE6), hand-drawn and slightly wobbly, lines gone over twice, no eyes or
> mouth (nose hint only), sloped shoulders running off the bottom edge, no shading or
> colour, one small identifying object beside the figure: {prop}.

## Influences

No single artist. The style combines common conventions: minimalist faceless line
portraits from editorial illustration, the deliberately shaky line of notebook doodles and
sketchnotes, and the "one object explains the character" idea from icon design.
