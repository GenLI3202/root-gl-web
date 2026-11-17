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

## Drawings on the paper

Pieces of Gen's life from the "在模型与山野之间" poster are redrawn in the study room's
freehand-ink manner (not the portrait rules) and laid on the page's paper, beside the text
rather than inside it. The drawings live in `src/utils/paper-art.ts`; `PaperSketch.astro`
places one. Current set: Home has the two cities of Gen's life in the hero, Luoyang's White
Horse Temple on the right beside the intro and Munich's Frauenkirche lower on the left beside
the Munich clock; Cycling has Gen's bike beside the distance line and a rider on a
winding road toward the mountains; Reading has a stack of books with a vase; Guitar has the
guitar. Projects has none: a person seen from behind at a desk did not work in this style.

- Landmarks are drawn from photos of the real place, not from memory, so the shape that makes
  them recognisable is right. The White Horse Temple is its Ming gate as photographed (three
  blocks, the middle one taller, each under its own upturned hip-and-gable roof, the name plaque
  over the big arch, its characters written in) with one of the saddled Song stone horses in
  front; an earlier version from memory read as a generic roof over three doors.
- Gen's own bike (a burgundy Lapierre) must look like the real one, which hand-coded strokes
  cannot do. It is the poster's pen-and-colour drawing as an image instead (`raster`), keyed out
  of its paper so the page shows through (`public/images/sketches/bike.webp`, 1000 px wide,
  about 160 KB, lazy-loaded). It sweeps in from the left with the scroll instead of being drawn
  stroke by stroke; on dark paper it is mostly inverted with the hue turned back, so the frame
  stays red. Use this route for anything that has to be recognisable as a specific object.
- Drawn by hand in code with `src/utils/sketch.ts`, using the poster only for composition. No
  tracing: traced lines come out dense and broken, which fights the few-stroke look and makes
  the drawing animation choppy.
- One open stroke per line, in the order a pen would go: silhouette first, then details, then
  the far background. Faces stay blank, on statues too; people are seen from behind.
- Four weights: `ink`, `fine` for windows, folds and texture, `faint` for distant hills and
  water, and `accent`, the red pen, only where the poster is red (the bike frame, the road). A
  pale wash on one or two shapes adds depth and comes in last. Each drawing seeds its own
  jitter, so editing one never moves another.
- Placement: put `<PaperSketch>` between two blocks, before the one it belongs to. It is a
  zero-height anchor, so it does not move the layout. On screens 1200 px and wider the drawing
  sits in the margin, runs off the screen edge and reaches `reach` behind the content in pale
  ink (40% opacity, thinner strokes); places get a hand-written red label in the margin. Keep
  `reach` small on the side where headings or the first words of lines sit, and use `size`
  below 1 on pages with the wide 912 px column, whose margins are narrower. Below 1200 px the
  drawing becomes a band in the flow, 86% of the screen wide, so a phone page does not turn
  into a gallery. `main` clips the drawings at the screen edge
  and above the footer.
- Drawing follows the scroll (`ScrollSketch`): under a third on first sight, the rest at an
  even pen speed, never un-drawn. Reduced motion, no JavaScript and print show it finished.

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
