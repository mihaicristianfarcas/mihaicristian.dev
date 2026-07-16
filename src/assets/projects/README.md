# Project screenshots

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
loads eagerly. The rest are lazy-loaded further down the page.

These live in `src/` rather than `public/` because only files Astro resolves get
dimensions and optimization; anything in `public/` is copied out verbatim.

Placeholders are sized 16:10. Any ratio works and none of them shift the page,
but frames that all share a ratio look considerably calmer stacked up than ones
that don't.
