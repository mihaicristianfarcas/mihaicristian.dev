import { getCollection } from "astro:content";
import { projectGroups } from "../content.config";

/* The selected projects first, by rank, then the rest by group. */
const rank = (featured?: number) => featured ?? Number.MAX_SAFE_INTEGER;

export async function getProjects() {
	return (
		await getCollection("projects", ({ data }) =>
			import.meta.env.PROD ? data.draft !== true : true,
		)
	).sort(
		(a, b) =>
			rank(a.data.featured) - rank(b.data.featured) ||
			projectGroups.indexOf(a.data.group) -
				projectGroups.indexOf(b.data.group) ||
			a.data.order - b.data.order ||
			a.data.title.localeCompare(b.data.title, "en"),
	);
}

export const projectPath = (id: string) => `/projects/${id}/`;

/* The projects either side of this one, in the projects page's order. */
export async function getProjectNeighbours(id: string) {
	const projects = await getProjects();
	const i = projects.findIndex((p) => p.id === id);
	const link = (i: number) =>
		projects[i] && {
			href: projectPath(projects[i].id),
			title: projects[i].data.title,
		};
	return { prev: link(i - 1), next: link(i + 1) };
}
