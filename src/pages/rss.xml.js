import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../data/site";

export async function GET(context) {
	const posts = (
		await getCollection("writing", ({ data }) => data.draft !== true)
	).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

	return rss({
		title: site.name,
		description: site.description,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.date,
			link: `/writing/${post.id}/`,
		})),
	});
}
