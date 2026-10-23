// @ts-check
import { defineConfig } from "astro/config";
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
