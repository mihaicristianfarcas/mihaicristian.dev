import { getCollection } from "astro:content";
import { projectGroups } from "../content.config";
import { type Lang, localePath, projectGroupNames, slugOf } from "./i18n";

/* Projects live under src/content/projects/<lang>/, so their ids carry the
   language: `en/atlas`. Both languages share the slug. */
export async function getProjects(lang: Lang) {
	return (
		await getCollection(
			"projects",
			({ id, data }) =>
				id.startsWith(`${lang}/`) &&
				(import.meta.env.PROD ? data.draft !== true : true),
		)
	).sort(
		(a, b) =>
			projectGroups.indexOf(a.data.group) -
				projectGroups.indexOf(b.data.group) ||
			a.data.order - b.data.order ||
			/* Pass the language: Romanian sorts ș and ț next to s and t, which a
			   default comparison does not. */
			a.data.title.localeCompare(b.data.title, lang),
	);
}

export const projectPath = (lang: Lang, id: string) =>
	localePath(lang, `/projects/${slugOf(id)}/`);

/* The rail's shape: groups in schema order, empty ones dropped. `group` is a
   key, so the name shown comes from the dictionary. */
export async function getProjectRail(lang: Lang) {
	const projects = await getProjects(lang);
	return projectGroups
		.map((group) => ({
			name: projectGroupNames[lang][group] ?? group,
			items: projects
				.filter((p) => p.data.group === group)
				.map((p) => ({
					href: projectPath(lang, p.id),
					title: p.data.title,
				})),
		}))
		.filter((g) => g.items.length > 0);
}
