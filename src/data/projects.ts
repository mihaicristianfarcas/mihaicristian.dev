import { getCollection } from "astro:content";
import { projectGroups } from "../content.config";

/* Every project, by group, then by rank within it. */
export async function getProjects() {
	return (
		await getCollection("projects", ({ data }) =>
			import.meta.env.PROD ? data.draft !== true : true,
		)
	).sort(
		(a, b) =>
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

/* The projects in their groups, in order, leaving out a group with none. */
export async function getProjectGroups() {
	const projects = await getProjects();
	return projectGroups
		.map((group) => ({
			group,
			projects: projects.filter((p) => p.data.group === group),
		}))
		.filter(({ projects }) => projects.length);
}
