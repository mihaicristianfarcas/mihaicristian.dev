import { getCollection } from "astro:content";

export async function getPosts() {
	return (
		await getCollection("writing", ({ data }) =>
			import.meta.env.PROD ? data.draft !== true : true,
		)
	).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const postPath = (id: string) => `/writing/${id}/`;

export const postDateFmt = new Intl.DateTimeFormat("en", {
	month: "long",
	day: "numeric",
	year: "numeric",
});

/* For a date under its year's heading, where the year would repeat it. */
export const postDayFmt = new Intl.DateTimeFormat("en", {
	month: "long",
	day: "numeric",
});

/* The writing page's sections: posts under the year they were published,
   newest first. Posts are already sorted by date, so the years come out
   ordered too. */
export async function getPostsByYear() {
	const posts = await getPosts();
	const years: { year: string; posts: typeof posts }[] = [];
	for (const post of posts) {
		const year = String(post.data.date.getFullYear());
		if (years.at(-1)?.year !== year) years.push({ year, posts: [] });
		years.at(-1)?.posts.push(post);
	}
	return years;
}

/* The posts either side of this one: the newer one first. */
export async function getPostNeighbours(id: string) {
	const posts = await getPosts();
	const i = posts.findIndex((p) => p.id === id);
	const link = (i: number) =>
		posts[i] && { href: postPath(posts[i].id), title: posts[i].data.title };
	return { newer: link(i - 1), older: link(i + 1) };
}
