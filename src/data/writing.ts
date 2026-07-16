import { getCollection } from "astro:content";
import { type Lang, localePath, slugOf } from "./i18n";

/* Posts live under src/content/writing/<lang>/, so their ids carry the
   language: `en/be-curious`. Both languages share the slug. */
export async function getPosts(lang: Lang) {
	return (
		await getCollection(
			"writing",
			({ id, data }) =>
				id.startsWith(`${lang}/`) &&
				(import.meta.env.PROD ? data.draft !== true : true),
		)
	).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const postPath = (lang: Lang, id: string) =>
	localePath(lang, `/writing/${slugOf(id)}/`);

export const postDateFmt = (lang: Lang) =>
	new Intl.DateTimeFormat(lang, {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

/* The rail's shape: posts under the year they were published, newest first.
   Posts are already sorted by date, so the years come out ordered too. */
export async function getWritingRail(lang: Lang) {
	const posts = await getPosts(lang);
	const groups: {
		name: string;
		items: { href: string; title: string }[];
	}[] = [];
	for (const post of posts) {
		const name = String(post.data.date.getFullYear());
		if (groups.at(-1)?.name !== name) groups.push({ name, items: [] });
		groups.at(-1)?.items.push({
			href: postPath(lang, post.id),
			title: post.data.title,
		});
	}
	return groups;
}
