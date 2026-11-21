# The design system

Everything the site looks like is decided by the tokens at the top of
`src/styles/global.css`, in `:root`. Components use those tokens and nothing
else: no color, font size or space of their own. When something new seems to
need a value that isn't there, it is one of the values that are. Pick the one
whose job it shares, and don't add a token for one case.

The rest of `global.css` is the components, one commented section each. There
are no other stylesheets. `Shot.astro` has the one scoped `<style>`, and it uses
the same tokens.

## Color

| Token           | Light                     | Dark      | For                                                                      |
| --------------- | ------------------------- | --------- | ------------------------------------------------------------------------ |
| `--paper`       | `#ffffff`                 | `#0b0b0c` | the page's background, set on `<html>`                                   |
| `--ink`         | `#0b0b0c`                 | `#ededef` | all text you read                                                        |
| `--muted`       | `#6b6b73`                 | `#8a8a92` | what's about the text: dates, captions, labels, lines under a title     |
| `--rule`        | `#e7e7ea`                 | `#1f1f22` | hairlines, quote bars, badge borders                                     |
| `--wash`        | `#f6f6f7`                 | `#131315` | the faint fill behind frames, thumbnails and code                        |
| `--edge`        | `rgba(0,0,0,.08)`         | `rgba(255,255,255,.07)` | the inset hairline round a screenshot                      |
| `--field-glow`  | `#92b6f0`                 | `#45454d` | the background field's characters at their brightest, under the pointer |
| `--accent`      | `#d1dff6`                 | same      | focus rings and selected text                                            |
| `--accent-line` | `#92b6f0`                 | `#d1dff6` | lines drawn in the accent: the buttons' borders                          |
| `--on-accent`   | `#0b0b0c`                 | same      | text on the accent (selection)                                           |

- **The accent is one soft blue, `#d1dff6`, in both themes.** The palette
  around it, lightest to deepest, is `#d1dff6 #c2d6f6 #b2cbf2 #a0bff0 #92b6f0`.
  On white a one-pixel line in `#d1dff6` disappears, so lines take the
  deepest step by day (`--accent-line`). Fills and the focus ring stay
  `#d1dff6`. Use only steps from this palette.
- Dark mode is a neutral gray close to black, `#0b0b0c` (the light theme's
  ink), not warm and not blue. Each surface is one step up from the one
  behind it: paper, then field, then glow.
- The two `theme-color` metas in `Base.astro` repeat `--paper`. Change them
  together.
- No other colors. In particular, nothing is greyed out to rank it below
  something else, and nothing changes color on hover. Rank comes from
  `--ink` against `--muted` and from space.

## Type

Geist, through Astro's Fonts API (`astro.config.mjs`), as `--sans`. Code is
in the system's monospace, `--mono`. The font has `display: block`: text waits
for Geist rather than showing in a fallback, so nothing changes face.

**Four sizes, and no others. This is a rule.**

| Token          | Size   | Line height          | For                                                                    |
| -------------- | ------ | -------------------- | ---------------------------------------------------------------------- |
| `--text-name`  | 21px   | `--line` (26px)      | my name in the side, and a project's or a post's title (`.headline`)   |
| `--text-body`  | 15.3px | `--line` (26px)      | everything you read: copy, titles, headings, links, buttons            |
| `--text-small` | 13px   | `--line-small` (20px)| what's about the text: dates, captions, detail labels, code, key caps  |
| `--text-field` | 11px   | (canvas)             | the background field's characters, never read                          |

- So three sizes you read, and one you don't.
- The line height is the distance between the lines of one paragraph, and
  nothing else: every box is trimmed to its text (see Space), so a line
  height never adds space above or below a box. Small text runs on its own,
  tighter line, which only shows when it wraps (a caption, code).
- Headings have no size or weight of their own. An `h1`, `h2` or `h3` is body
  text set apart by the space around it. The one exception is a project's or
  a post's title, `.headline`, in the name's size.
- One weight besides regular: the name in the side, at 600. Nothing else is
  bold (`strong` and `b` inherit), not even the titles in the name's size.
- The name and a project's or a post's title are the only text bigger than
  the body.
- Hierarchy comes from color (`--ink` over `--muted`) and from space, never
  from size. The name and those titles are the only exception.

To check a page, paste this in the browser console. It lists every size and
line height that text is set in, and should print at most the rows above:

```js
const seen = new Map();
for (const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); w.nextNode(); ) {
	const el = w.currentNode.parentElement;
	if (!w.currentNode.textContent.trim() || el.closest(".sr-only, .astro-code")) continue;
	const s = getComputedStyle(el);
	const key = `${s.fontSize} / ${s.lineHeight}`;
	seen.set(key, [...(seen.get(key) ?? []), el.localName]);
}
console.table([...seen].map(([k, v]) => ({ size: k, used: [...new Set(v)].join(" ") })));
```

## Space

**Space is measured as you see it**: from the baseline of the text above (or
a picture's bottom edge) to the top of the capitals below (or a picture's top
edge). Every box is trimmed to its text, `text-box: trim-both cap alphabetic`
on `*` in `global.css`, so a gap of 20px is 20px between what's drawn, whatever
the sizes on either side. Measure it that way too: in a screenshot, from a
baseline to the capitals under it.

The exceptions to the trim are boxes drawn round their text: the `kbd` and
inline `code` badges and the placeholder label. A link in running text isn't
trimmed either, so its focus ring clears the letters below the line. A button
is trimmed, and its padding gives it a line's height back (see the button).

**One size for each relation between two things, five in all, and nothing in
between:**

| Kind      | Token               | Size, as you see it          | Between                                                                                         |
| --------- | ------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| Line      | `--space-line`      | a line less a capital, 15px  | the lines of one thing: a paragraph's lines (its line height), and lines set as boxes of their own: what I do and where, a project's details, the pager's label and title, a post's date under its description on phones |
| Under     | `--space-under`     | half a paragraph, 20.5px     | a title or a picture and what's under it: my name and what I do, a page's title and its description or date, a row's title and its summary, an experience entry's name and what it stands for on phones, a picture and its caption |
| Paragraph | `--space-paragraph` | a blank line, 41px           | the items of anything: paragraphs, a list's rows and entries, the side's groups (its two rows of links among them), a heading and its text |
| Block     | `--space-block`     | two blank lines, 67px        | the blocks of an entry: lede, cover, text, details; a heading or picture inside the text        |
| Section   | `--space-section`   | four blank lines, 119px (three, 93px, on phones) | sections: the content under a page's title, the details, the pager, Back to top |

- A blank line leaves the next baseline whole lines below the last, so the
  paragraph, the block and the section keep the text on one grid of 26px
  lines: each is so many lines less a capital (`1cap`, the body's).
- Under is exactly half a paragraph, so a description is plainly closer to its
  title than the next thing is, and plainly not just its next line.

Horizontal space:

| Token            | Size                  | Between                                                         |
| ---------------- | --------------------- | --------------------------------------------------------------- |
| `--space-inline` | 1 line                | things side by side: links in a row, a list's columns           |
| `--space-column` | 2 lines               | either side of the hairline between the side and the page       |
| `--gutter`       | 22px (18px on phones) | the page's margin from the screen's edge                        |

Derived, not chosen: `--col` is a list's first column, a third of the page, so
every two-column list (projects, experience, details) starts its second column
on the same line. `--corner` is the page's margin above its first line and
below its last. `--page-width` is the page's width, margins included (936px,
1134px where the side stands beside the page): `.wrap` is that wide, and the
field reads it to find the text column. `--top`, on wide screens, centers the
side: its height is six lines and about two capitals (the sum is in the CSS).

How to apply it:

- **The container sets the spacing, with `gap`. Children have no margins.**
  `.side`, `.who`, `.title`, `.rows`, `.keys`, `.section`, `.entry`, `.prose`,
  `.shot` and `.pager` are flex or grid columns with one of the five gaps.
  Because boxes are trimmed, two boxes with no gap between them touch, letters
  to letters: lines of one thing set as separate boxes need `--space-line`.
- There is one exception, and it's documented in the CSS. Inside `.prose`, whose
  gap is a paragraph, an `h2` or an inline `.shot` needs a block above it, so
  it takes the difference (`--space-block - --space-paragraph`) as a margin.
- Never a value in px for vertical space, and never a sixth kind. If two
  things look too close or too far apart, they belong to a different kind, so
  change which one they use. Add a kind only when a whole family of things
  fits none of these, and add it here and in `:root` together.

## Shape and motion

- `--radius` (10px, 7px on phones) for frames and code blocks.
  `--radius-small` (5px) for thumbnails, badges and the focus ring.
- One curve, `--ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`), and these
  durations: a button's arms 300ms, its full border 550ms, a page fading in
  400ms, the old page fading out 250ms.
- Reduced motion turns off every fade and the button transitions (the
  borders still show, at once), the field's trail (characters show only
  right under the pointer), and the smooth scrolling.
- Under a finger the button transitions are off too, since there's no hover
  for growing corners to stand for (see the button).

## Components

All in `global.css`, in this order.

### The button: `.btn`

Every link that stands on its own is a `.btn`: the side's sections and
profiles, a project's links, the pager, Back to top, and every row of a list.
A button has no underline and no color, weight or background of its own.

| State                                    | Looks like                                                                                                |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| rest                                     | just its text                                                                                             |
| hover (fine pointers), keyboard focus    | the top-left and bottom-right corners grow `--arm` along both their edges, 300ms ease-out                 |
| pressed (`:active`, then `data-pressed`) | the corners carry on round the box to a full border, 550ms ease-out                                       |
| current (`aria-current`)                 | a full border                                                                                             |
| leaving any of these                     | the corners draw back in, 300ms                                                                           |

- The border is `--accent-line`, one pixel.
- `--arm` grows with the button: 6% of its width, and never under 0.6em. A
  button that's a word or two gets 0.6em (about 9px), and a project's row
  about 44px.
- Each corner is a pseudo-element square with a border on two sides. It
  grows in width, `aspect-ratio: 1` gives it the same height, and the button's
  `overflow: clip` cuts it at the box. So both arms stay the same length
  until the side arm reaches the box's far edge, and from there the top (or
  bottom) arm carries on alone to the far corner. Don't cap the square with
  `max-height` instead: in Safari, for a button that's a flex item (the side's
  sections, the profiles, the pager), that cuts its width to the height too,
  and the border never gets past a corner.
- The box is as big as its text plus `--pad` either side and `--pad-block`
  above and below, and a negative margin takes the padding back, so a
  button's text lines up with the text around it and takes no more room.
  Its text is trimmed to its capitals like everything else, so `--pad-block`
  is half of what's left of a line, which makes the box a line tall and
  centered on the capitals. `.btn.block` (list rows) pads 10px all round
  the same way, round its trimmed picture and text. Under a finger the
  side's, the pager's and Back to top's buttons pad 9px more above and
  below, for a target about 44px tall.
- A click is quicker than the border, so `src/scripts/buttons.ts` keeps
  `data-pressed` on for 800ms.
- **Under a finger (`hover: none`) nothing looks like a hover: the corners
  never grow.** A tap shows the full border at once and drops it at once,
  and only a tap that lands shows it (`data-pressed`, set on the click).
  `:active` comes on as soon as a finger lands, to scroll too, so there it
  shows nothing, or every button the page is scrolled by would flash.
- `aria-current="page"` marks the button for the page you're on, and
  `aria-current="true"` the section the page belongs to (a project lights
  Projects). `Base.astro` renders it. Because the side's sections are
  persisted across navigations, `buttons.ts` sets it again on every
  navigation: as soon as you click, so the new border draws while the page
  changes, and after the swap.
- Links inside running text are not buttons. They keep the text's color and
  a faint underline that comes up to full strength on hover.

### The side

- `.side`: my name, what I do and where (`.who`), then the site's sections
  (`.tabs`) and my profiles (`.cta`), a paragraph apart. It's as wide as its
  widest line, the subtitle (`--side-width`, 18.25em, and never wider than
  the screen), on every screen: beside the page, and over it on narrower
  screens.
- The sections and the profiles are two rows of links, each spread evenly
  across the side's width (`justify-content: space-between`), the first link
  level with its left edge and the last with its right. The sections are a
  row beside the page too, so the two rows match.

### Text groups

- `.title`: a title with what's under it a space under it (`--space-under`),
  as one group. The first child is ink, and the rest are muted. Used for a
  page's title and description, and for each list row.
- `.headline`: a project's or a post's title, in `--text-name` but the
  body's weight.
- `.who`: the side's name, what I do and where, all in ink. The name is a
  space (`--space-under`) above the other two, as a title is above its
  description, so it's half as far from them as they are from the sections.
  The two follow each other a line apart.
- `.meta`: small and muted. Dates and labels.

### Lists

- `.rows`: a list of rows a paragraph apart, each row a `.btn.block`.
- `.parts`: a list in named parts, a block apart, each a label (`h2.meta`)
  a paragraph over its rows: the projects page's groups.
- `.project`: a project row, with its thumbnail (`.thumb`, shaped like an OG
  card, 1200:630) in the first column and its name over its summary in the
  second. The name's capitals line up with the thumbnail's top edge.
- `.post`: a post row, with its title over its description and the date at
  the end (on phones, a line under the description).
- `.keys`: entries in two columns, a name and what it stands for, a
  paragraph apart (experience). On phones the name stacks over what it
  stands for, a space under it, like a title. `.keys.details` is a project's
  details, one table with a fact to a line, a line apart, and the names as
  small labels on the baseline of what they name.

### Pages

- `.section`: a part of a page, a section below what came before.
- `.entry`: a project's or post's content under its title, as a column of
  blocks a block apart.
- `.prose`: running text, a paragraph between each of its blocks. MDX content
  goes in here, and so do inline `<Shot>`s and `## headings`.
- `.shot`, `.frame`, `figcaption`: a screenshot or recording, with its caption
  a space under it (`src/components/Shot.astro`).
- `.cta`: a row of buttons, a line apart when it wraps. `.pager`: previous
  and next, each a label a line over its title. `.to-top`: the way back up
  where the side scrolls away.

## The field

The background is a field of monospace characters on a `<canvas>`, drawn by
`src/scripts/field.js`, that only the pointer shows. At rest it's plain paper.
It must never get in the way of reading.

- **It's a floor of characters round the page.** Every cell holds one,
  except in an ellipse over the middle of the screen, inset from every edge
  by 10% of the screen's shorter side (`PAD`), which holds none. The floor
  comes in over the ellipse's outer quarter (from `EASE` of its radius), so
  the ellipse has no hard edge. On a phone, where the text fills the width,
  the ellipse is never narrower than the text column (`--page-width` less
  `--gutter`).
- **Only the pointer shows it.** At rest every character is the paper's
  color, so nothing is drawn. Under a mouse or a pen, the characters within
  110px come up toward `--field-glow`, fully near the centre, and fade back
  as the pointer moves on, leaving a short trail. The glow is the palette's
  deepest blue by day, so what the pointer uncovers can be read. A finger is
  scrolling, so on a phone the field never shows.
- The characters are symbols, `0` and `1`, `x y z` and brackets, with a
  whole word every 90 cells or so (code words, the names of the projects,
  words from the writing), set off by a space either side.
- **Things are hidden in it**, each in a clearing of its own where the floor
  is whole, so it reads as one when the pointer uncovers it. New ones are
  picked on every load:
  - two of Seneca's lines, from `src/data/quotes.ts` (the ones of 80
    characters or less), which `Base.astro` hands over on the canvas as
    `data-quotes`;
  - three formulas from computer science, from `FORMULA_LIST`;
  - a hunt: a hint somewhere says to go to the top left corner, and each
    corner, once the pointer reaches it, says where to go next, round all
    four (`HUNT`). A corner only answers once the hint that sends you there
    has been found, half its letters lit (`FOUND`, `LIT`), so no step shows
    before the ones before it, however the pointer wanders. The corners are
    kept clear of everything else for it.
- The knobs are the constants at the top of `field.js`: `GLYPHS`,
  `WORD_LIST`, `WORDS`, `PAD`, `EASE`, `QUOTES`, `FORMULAS`,
  `FORMULA_LIST`, `HUNT`, `FOUND`, `LIT`, `REACH` and `COOL`. Keep the colors in the tokens,
  not in the script, which reads them.
- **Keep it quiet.** Before you raise `--field-glow` or the reach, or let
  the floor into the ellipse, move the pointer over a long post in both
  themes.
- It costs nothing at rest. Only the cells the pointer warms are drawn,
  frames run only while their warmth fades, and with nothing moving,
  nothing runs.

## Scrolling

`src/scripts/scroll.ts` gives the wheel and the trackpad Lenis's smooth
scrolling, which eases into the top and bottom of the page instead of stopping
dead. A finger scrolls natively, with the system's momentum and its spring at
the ends. Under reduced motion there's no smoothing at all.

- `window.glideTo(top)` glides the page there (Back to top uses it). Without
  smoothing it doesn't exist, so fall back to `scrollTo`.
- Don't add `scroll-behavior: smooth` (it fights Lenis) or
  `overscroll-behavior: none` (it takes away the native spring at the ends).
