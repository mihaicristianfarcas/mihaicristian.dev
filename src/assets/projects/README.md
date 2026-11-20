# Project screenshots and recordings

Drop screenshots in here, then point the project's frontmatter at them.

Every entry under `shots:` in `src/content/projects/*.mdx` renders a placeholder
frame until it has a `src`. To use a real image, add the file here and fill it
in — the path is relative to the `.mdx` file:

```yaml
shots:
  - src: ../../assets/projects/atlas-search.png
    alt: The answer panel, with a citation open beside the source PDF.
    caption: Asking a question, with the answer cited back to the source page.
```

- `src` is resolved at build time, so a typo fails the build instead of quietly
  serving a 404. Astro reads the real dimensions and writes them onto the tag,
  which is what keeps the page from jumping as each screenshot loads, and it
  re-encodes to webp at a few widths — drop the full-resolution file in and
  don't hand-optimize it.
- `alt` describes the image for screen readers and is worth writing properly.
  Without it the `caption` is used, which is usually the wrong thing to say twice.
- `caption` is always shown under the frame.

The first shot in the list is the cover and sits directly under the title, so it
loads first. It's also the project's thumbnail on the projects page, unless the
project names a `thumb` (see below).

Each project belongs to a `group` (Apps, Tools, Websites, Research, in
`src/content.config.ts`), and `order` ranks it within the group, the most
impressive first. The projects page lists the groups in that order, each under
its name. Nothing is lazy-loaded: the page holds until every image and
poster has decoded and every recording has downloaded, then fades in whole,
however large the files are. Keep that in mind when encoding a recording: its
size is time the whole page waits.

These live in `src/` rather than `public/` because only files Astro resolves get
dimensions and optimization; anything in `public/` is copied out verbatim.

Placeholders are sized 16:10. Any ratio works and none of them shift the page,
but frames that all share a ratio look considerably calmer stacked up than ones
that don't.

## The thumbnail

The projects page shows each project as a row, with a picture in the first
column, in the shape of an OG card (1200:630, cropped to 480×252). By default
that's the cover (the first shot's `src`, which for a recording is its
poster). Give the project its own when it has a social card, which is made to
say what the project is at a glance:

```yaml
thumb: ../../assets/projects/atlas-og.png
thumbDark: ../../assets/projects/atlas-og-dark.png   # optional
```

Use the card from the project's own site (its `og:image`) where it has one.
Where it has none, make one at 1200×630, rendered at 2× in a headless browser:
the project's name, its headline and a line under it in the site's own font
and colors on the left, and the product on the right, the way
`supernova-og.png` and `blueplan-og.png` were made. Any other picture is
cropped from the center to the card's shape.

## Shots inside the text

The frontmatter's shots come after the text. To set a picture or a recording
between paragraphs, as the Tahara page does under its `## headings`, use the
component in the `.mdx`:

```mdx
import Shot from "../../components/Shot.astro";
import heroPoster from "../../assets/projects/tahara-hero.jpg";

## Hero

What the hero does, in a paragraph.

<Shot
  src={heroPoster}
  video="tahara-hero.mp4"
  alt="What happens in the recording."
  caption="What to notice."
/>
```

`src` is an imported image, and `video` is the file's name in this folder. The
spacing around it, a block from the text on either side, comes from `.prose`
in `global.css`. Don't wrap it or give it margins.

## Light and dark

Media with a theme of its own, like a terminal recording or a chart, can come
in both. `src` (and `video`) are the light versions; add the dark ones beside
them:

```yaml
shots:
  - src: ../../assets/projects/pq-boringtun-benchmarks.png
    srcDark: ../../assets/projects/pq-boringtun-benchmarks-dark.png
    caption: What it costs, measured on a laptop and an edge device.
```

The browser picks by `prefers-color-scheme` and downloads only the one it
shows, and switches if the system theme changes. A recording takes `videoDark`
alongside `srcDark`, its dark poster. Screenshots of an app are what they are;
leave those single.

## Recordings

A shot can be a video instead. Put the `.mp4` here next to a still of its first
frame, and give the shot both:

```yaml
shots:
  - src: ../../assets/projects/ukiyo-editing.png
    video: ../../assets/projects/ukiyo-editing.mp4
    alt: What happens in the recording, for screen readers.
    caption: Editing a file, then opening another from the explorer.
```

- `src` becomes the poster, and still supplies the frame's dimensions. A shot
  with a `video` and no `src` fails the build.
- The video is matched by file name and emitted under a content hash in
  `/_astro/`, so it's cached like every other asset. A missing file fails the
  build too.
- It loads in full with the page, then plays muted and looped, with no
  controls, from its first frame as the page fades in, while it's on screen,
  and pauses when it scrolls away. Under reduced motion it stays on its first
  frame.
- Unlike images, videos aren't re-encoded. Encode them before dropping them in:
  H.264 in an `.mp4` (the one format every browser plays), no audio track, and
  the index at the front so playback starts before the download finishes:

  ```sh
  ffmpeg -i in.mov -vf fps=30 -c:v libx264 -preset veryslow -crf 24 \
    -pix_fmt yuv420p -movflags +faststart -an out.mp4
  ```

  Terminal recordings compress to almost nothing; anything photographic wants
  a higher `-crf` (28–30) to stay around a couple of megabytes.

## Making a recording

Record in a headless browser, never on the screen: the machine's display may
be in use, and headless runs are repeatable. `scripts/record.mjs` takes a
Playwright page and a function that drives it, and writes the `.mp4`, encoded
as above, plus a `.png` of its first frame for the poster. Its header has an
example. Playwright isn't a dependency of the site: install it in a scratch
directory (`npm i playwright && npx playwright install chromium`) and run your
driving script from there.

- Record at 1440×900, the size every shot here is. The page shows it at
  about 720px wide, so text in it should be large enough to read at half
  size.
- A headless screencast has no cursor. Where the pointer matters, draw one
  into the page with `context.addInitScript`, an SVG arrow on a fixed element
  that follows `mousemove`. Move the mouse in eased steps, the way a hand
  does, not in one jump.
- Pages drawn with WebGL render in software headless, slowly. On a Mac,
  launch Chromium with `args: ["--use-angle=metal"]` to get the GPU.
- Record an app against a mock of its API, running the app's real UI, so
  the data is chosen and nothing private shows. Start the mock fresh before
  each take, or a previous take's state shows up in this one.
- Check a take as a contact sheet before using it:
  `ffmpeg -i take.mp4 -vf "fps=1,scale=480:-1,tile=4x4" -frames:v 1 sheet.png`.
- Take stills from the same session as the recording, so they match it. Drop
  the drawn cursor from a still unless it shows a hover.
