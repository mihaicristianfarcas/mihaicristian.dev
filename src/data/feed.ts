import rss from "@astrojs/rss";
import { site } from "./site";
import { htmlLang, type Lang, ui } from "./i18n";
import { getPosts, postPath } from "./writing";

/* One feed per language, each linking to that language's posts.
   Base.astro points every page at the feed for the language it is in. */
export async function feed(lang: Lang, context: { site?: URL | undefined }) {
	/* getPosts only hides drafts in a production build; a feed should never
	   carry them. */
	const posts = (await getPosts(lang)).filter((post) => !post.data.draft);

	return rss({
		title: site.name,
		description: ui[lang].siteDescription,
		site: context.site!,
		customData: `<language>${htmlLang[lang]}</language>`,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.date,
			link: postPath(lang, post.id),
		})),
	});
}
