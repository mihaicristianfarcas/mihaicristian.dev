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

/* The posts either side of this one: the newer one first. */
export async function getPostNeighbours(id: string) {
	const posts = await getPosts();
	const i = posts.findIndex((p) => p.id === id);
	const link = (i: number) =>
		posts[i] && { href: postPath(posts[i].id), title: posts[i].data.title };
	return { newer: link(i - 1), older: link(i + 1) };
}
