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
			themes: {
				light: "vitesse-light",
				dark: "vitesse-dark",
			},
			defaultColor: false,
		},
	},
});
