# Working on mihaicristian.dev

My personal site: a static Astro site with hand-written CSS, no component
libraries, a field of characters behind the page, and projects and writing in
MDX. Read this before changing anything. Then read, as needed:

- [docs/design.md](docs/design.md): the design system, its tokens and their
  rules, and every component. **Read it before touching anything visual.**
- [docs/architecture.md](docs/architecture.md): how a page loads and changes,
  the persisted elements, and the scripts.
- [src/assets/projects/README.md](src/assets/projects/README.md): screenshots,
  recordings and thumbnails, and how to make them.

## Commands

```sh
bun install
bun dev                 # http://localhost:4321
bun run build           # to dist/
bun run preview         # serve dist/
bun run check           # type-check
node --test scripts/    # the worker's tests
```

If the dev server answers 504 "Outdated Optimize Dep" after a dependency
changes, build and preview instead (`bunx astro preview --port <free port>`).
Port 4400 is often taken by another project on this machine. Pick a free port,
and never stop a server you didn't start.

## Rules

These are rules, not preferences.

1. **Tokens only.** Every color, size and space comes from `:root` in
   `src/styles/global.css`. Don't write a px value, a hex color or a font
   size in a component.
2. **Four text sizes**: `--text-name` (my name in the side, and a
   project's or a post's title), `--text-body`, `--text-small`, and
   `--text-field` for the canvas. Hierarchy comes from `--ink` against
   `--muted` and from space, not from size or weight. The name in the side
   is the only bold, and it and those titles are the only big text.
3. **Five kinds of vertical space, measured as you see them**, from a
   baseline to the capitals below (every box is trimmed to its text):
   `--space-line`, `--space-under` (a title or picture and what's under it,
   half a paragraph), `--space-paragraph` (the items of anything),
   `--space-block` and `--space-section`. The container sets the space with
   `gap`, and children have no margins. Choose by what the two things are to
   each other (see the table in design.md), never by eye.
4. **A link that stands on its own is a `.btn`**: no underline, no color of
   its own, the corner-border animation, and a full border when current
   (`aria-current`). A link inside running text keeps its faint underline.
   Don't add other hover, active or current styles.
5. **The accent is `#d1dff6`**, in both themes: focus rings, selection, button
   borders (the deeper `#92b6f0` by day), the field's glow by day. No other
   hues.
6. **Never load lazily.** A page holds until its fonts, images and fully
   downloaded recordings are in, then fades in whole. No `loading="lazy"`,
   no skeletons, no spinners.
7. **Never poll.** React to the event that says it happened (`decode()`,
   `suspend`, the router's `astro:*` events, `matchMedia` changes). A timer is
   allowed only for a deadline or cadence with no event, and its comment says
   why.
8. **Respect reduced motion.** No fades, no glide and no trail in the field
   under it. A button's border still shows, at once.
9. **Keep the field quiet.** At rest it's plain paper, and under the pointer
   it's a soft glow you discover, never something that competes with the
   text it's behind, in either theme.
10. **Test headless.** Use Playwright with headless Chromium for screenshots,
    recordings and checks. Don't open browser windows or simulators on this
    machine's screen unless asked: the screen may be in use for other work.

## Before you finish

- Build, and look at what you changed in both themes, at desktop width (1440)
  and phone width (390), in headless screenshots.
- Check no page scrolls sideways and the console is clean.
- On any page you changed, run the font-size check from design.md: text set
  in anything but the sizes in its table is a bug.
- If you changed a rule, a token or a component, update docs/design.md in the
  same change, and keep the CSS comments true. Comments in this codebase say
  why, in plain sentences. Match them.

## Git

- Commit straight to `main`, only when asked. Split the work into one commit
  per change, with messages in the repo's style: a plain sentence in the
  imperative that says what changes for someone looking at the site, with no
  prefix and no period (`Space the experience entries a line apart`).
- **Never push unless asked: a push to `main` deploys** (Cloudflare Workers
  Builds).

## Traps

- `--line` is the line height (26px). The hairline color is `--rule`. They
  were once the same name, and dark mode broke.
- The side, the field, the edge bands and the tint strips persist across
  navigations. They aren't re-rendered, so per-page state on them is set by
  script (`buttons.ts` sets the tabs' `aria-current`).
- Module scripts run once per full load, not per navigation. Use the router's
  events for per-page work.
- `field.js` is inlined raw into `<body>` and runs before the first paint. Keep
  it plain JavaScript with no imports.
- The side's height (ten lines and about two capitals) is counted in `--top`.
  If you add or remove a line or a gap in the side, change the count.
- Every box is trimmed to its text (`text-box` on `*`), so two boxes with no
  gap touch, letters to letters. Badges and anything else drawn round its
  text opt out with `text-box: normal`.
- The `theme-color` metas in `Base.astro` repeat `--paper`. Change them
  together.
- `field.js` reads `--page-width`, `--gutter`, `--line` and `--text-field` to
  lay out the field. If you rename or restructure those tokens, update it.
- Don't add `scroll-behavior: smooth` (it fights Lenis) or
  `overscroll-behavior: none` (it removes the native spring on touch).
- A `<Shot video>` is matched by file name in `src/assets/projects/`, and a
  missing file fails the build.
