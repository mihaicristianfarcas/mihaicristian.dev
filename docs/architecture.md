# How the site runs

A static Astro site, served by a Cloudflare Worker. This is how a page gets to
the screen and what keeps running once it's there. For how it looks, see
[design.md](design.md).

## Where things are

```
astro.config.mjs        prefetch on hover, Geist through the Fonts API, MDX, sitemap
src/
  layouts/Base.astro    every page's <head>, the side, the field, the load gate, the router hooks
  styles/global.css     the tokens and every component (see docs/design.md)
  scripts/
    field.js            the background field; inlined into <body>, plain JS, no imports
    scroll.ts           Lenis smooth scrolling, and window.glideTo()
    buttons.ts          the buttons' pressed state, and the side's current section
  components/
    ProjectList.astro   the projects page's rows, each with its thumbnail
    PostList.astro      the writing page's rows
    Pager.astro         previous and next, at a project's or post's foot
    Shot.astro          a screenshot or recording, with its caption
    pages/              each page's body: Home, Experience, ProjectsIndex, ProjectPage, ...
  content/              the projects and the writing, as MDX (schema in src/content.config.ts)
  data/                 site metadata, queries and ordering (projects.ts, writing.ts)
  assets/projects/      screenshots and recordings (see the README there)
  pages/                routes: /, /projects/, /projects/[slug]/, /writing/..., /experience/, 404, rss.xml
worker/index.js         www → apex redirect, byte ranges for .mp4, immutable caching of /_astro/
scripts/worker.test.mjs the worker's tests (node --test scripts/)
```

Every push to `main` deploys, through Cloudflare Workers Builds. Nothing in
the repo shows it.

## A page arrives whole

**Nothing loads lazily.** Every page holds its content until its fonts, its
images, its recordings' posters and the recordings themselves have all loaded,
then fades in once. However large the files are, the page waits for them, so
keep media small (see `src/assets/projects/README.md`).

- An inline script at the top of `<head>` in `Base.astro` sets
  `data-loading` on `<html>` before the first paint, and drops it when
  everything is in. `global.css` holds the content's fade-in paused while the
  attribute is there.
- An image is in once it has decoded (or failed). A recording is in at
  `suspend`, which with `preload="auto"` comes after the last byte, or on an
  error. These are events: nothing polls.
- `data-font-loading` hides link underlines until Geist is in, because they would
  otherwise show at the fallback's widths.
- The side and the field don't wait: they show from the first paint.
- With JavaScript off, the attribute is never set, and the page renders as
  normal.

Don't add `loading="lazy"`, `IntersectionObserver`-driven loading, or
skeletons. Images are `loading="eager"`, and recordings are `preload="auto"`.

## Between pages

Astro's `<ClientRouter />` handles navigation, with a link prefetched when the
pointer rests on it.

- **The next page loads whole before it's swapped in.** In
  `astro:before-preparation`, `Base.astro` wraps the router's loader: it
  warms the next page's images (the `<source>` that matches the theme, inside
  a `<picture>`) and copies its videos into this document to load. In
  `astro:before-swap`, the loaded copies replace the incoming videos.
- **Only the content cross-fades.** `<main>` is the `content` view transition.
  Just before the swap, the old one is renamed `content-out`, so the two fade
  where they stand instead of sliding between scroll positions. The root is
  taken out (`view-transition-name: none`), and the incoming page is marked
  `data-navigated` so it skips its own fade-in.
- On narrow screens the side heads the page, and a navigation can move it. It
  then cross-fades too (`side-out` and `side-in`). A page with its own `h1`
  opens just past the side, at its content.

### Persisted elements

These keep their DOM node, and everything in it, across navigations
(`transition:persist`):

| Element                            | Why                                                                         |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `canvas.field`                     | the field never redraws or flickers between pages                           |
| `canvas.edges.top`, `.bottom`      | the edge fades keep their copy of the field                                 |
| `nav.tabs`                         | the clicked section's border draws on while the page changes                |
| `.tint.top`, `.bottom`             | Safari's bar colors never change                                            |

A persisted element is not re-rendered. Anything on it that depends on the
page, like the tabs' `aria-current`, has to be set by script on navigation
(`buttons.ts`). A script that sets up a persisted element must expect to be run
again on the next page and do nothing (`field.js` checks
`canvas.dataset.running`).

## Scripts

| Script                     | Loaded                                         | Runs                                                                 |
| -------------------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| load gate and router hooks | inline in `Base.astro`'s `<head>`              | once per full load; listens to the router's events after that        |
| `field.js`                 | inlined after `canvas.field` (`?raw`, `set:html`) | before the first paint, once per full load                           |
| `scroll.ts`, `buttons.ts`  | bundled module, imported in `Base.astro`       | once per full load; listens to the router's events after that        |

Module scripts don't run again on client-side navigations. Anything that needs
to happen per page listens to `astro:before-preparation`,
`astro:before-swap` or `astro:after-swap`.

**React to events, never poll.** Wait on the event that says the thing has
happened: `load`, `decode()`, `suspend`, `DOMContentLoaded`, the router's
events, `matchMedia` changes, `visibilitychange`. A timer is acceptable only
for a deadline or a cadence that has no event, with a comment saying why. The
site has one: `buttons.ts` holds a pressed border long enough to finish
(800ms).

## Phones

- The side heads the page and scrolls away with it. Back to top (`.to-top`) only
  shows there.
- Tap targets in the side, the pager and the CTA rows grow to about 44px
  without taking more room (`pointer: coarse` in `global.css`).
- A press shows the way a hover does. A passive `touchstart` listener makes
  Safari apply `:active` at all.
- Safari 26 ignores `theme-color` and paints its bars from fixed elements at
  the screen's edges: the `.tint` strips.
- The page runs under the notch in landscape (`viewport-fit=cover`), and
  `.wrap` keeps the text clear of it.
- Touch scrolling is native, with its spring. Don't add
  `overscroll-behavior: none`.
