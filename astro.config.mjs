// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";

/** @type {import('rehype-external-links').Options} */
const externalLinks = { target: "_blank", rel: ["noopener"] };

export default defineConfig({
	site: "https://mihaicristian.dev",
	// Fetch a page when the pointer rests on its link, so the click only
	// swaps it in.
	prefetch: { prefetchAll: true, defaultStrategy: "hover" },
	// Geist, from the fontsource package's files: the Latin set and the
	// extended one, for the ș and ă of Romanian names, each used only for its
	// own characters. `block`: text waits for the font rather than showing in
	// another one first, so the side, which shows at once, never changes face.
	fonts: [
		{
			provider: fontProviders.local(),
			name: "Geist",
			cssVariable: "--font-geist",
			fallbacks: ["sans-serif"],
			options: {
				variants: [
					{
						src: ["./node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2"],
						weight: "100 900",
						style: "normal",
						display: "block",
						unicodeRange: [
							"U+0000-00FF", "U+0131", "U+0152-0153", "U+02BB-02BC", "U+02C6", "U+02DA",
							"U+02DC", "U+0304", "U+0308", "U+0329", "U+2000-206F", "U+20AC", "U+2122",
							"U+2191", "U+2193", "U+2212", "U+2215", "U+FEFF", "U+FFFD",
						],
					},
					{
						src: ["./node_modules/@fontsource-variable/geist/files/geist-latin-ext-wght-normal.woff2"],
						weight: "100 900",
						style: "normal",
						display: "block",
						unicodeRange: [
							"U+0100-02BA", "U+02BD-02C5", "U+02C7-02CC", "U+02CE-02D7", "U+02DD-02FF",
							"U+0304", "U+0308", "U+0329", "U+1D00-1DBF", "U+1E00-1E9F", "U+1EF2-1EFF",
							"U+2020", "U+20A0-20AB", "U+20AD-20C0", "U+2113", "U+2C60-2C7F", "U+A720-A7FF",
						],
					},
				],
			},
		},
	],
	// MDX doesn't inherit markdown.processor, so pass the plugin directly.
	integrations: [
		mdx({ rehypePlugins: [[rehypeExternalLinks, externalLinks]] }),
		sitemap(),
	],
	markdown: {
		processor: unified({
			rehypePlugins: [[rehypeExternalLinks, externalLinks]],
		}),
		shikiConfig: {
			theme: "css-variables",
		},
	},
});
