/* Every string the site sets outside a content collection, in both languages.

   Add to `en` first: `ro` is typed as `typeof en`, so a key that only exists in
   English is a build error rather than an English sentence quietly appearing on
   the Romanian site. */

export const languages = ["en", "ro"] as const;
export type Lang = (typeof languages)[number];

export const defaultLang: Lang = "en";

/* What the switcher and the <html lang> attribute set. */
export const langNames: Record<Lang, string> = { en: "EN", ro: "RO" };
export const htmlLang: Record<Lang, string> = { en: "en", ro: "ro" };
export const ogLocale: Record<Lang, string> = { en: "en_US", ro: "ro_RO" };

/* Names, orgs, tech stacks and URLs are proper nouns and stay as they are;
   only the prose around them is in here. The γνῶθι σεαυτόν epigraph is Greek
   on both sites, so it lives in the markup rather than here. */
const en = {
	siteDescription:
		"Software engineer in Cluj-Napoca, Romania. Systems, networking, and well-made software.",

	// Homepage
	intro:
		"Software engineer in Cluj-Napoca, Romania. Living life thinking about computers, philosophy, history and legends, with a touch of optimism and introspection.",
	introWelcome: "Welcome to my page.",
	nowHeading: "Now",
	nowDate: "July 2026",
	nowBody:
		"Just finished my BSc thesis at Babeș-Bolyai University, a hybrid post-quantum key exchange for WireGuard. Currently building Supernova and taking on freelance work.",
	experienceHeading: "Experience",
	edu: "BSc in Computer Science, Babeș-Bolyai University, Cluj-Napoca.",
	selectedProjects: "Selected projects",
	allProjects: "All projects",
	writingHeading: "Writing",
	allWriting: "All writing",

	// Writing
	writingTitle: "Writing",
	writingDescription: "Notes on software and life.",
	writingBlurb:
		"This is my blog — notes on software and life. Pick a post from the timeline to start reading.",
	writingRailLabel: "All posts",

	// Projects
	projectsTitle: "Projects",
	projectsDescription: "Things I've built: products, tools, and systems.",
	projectsBlurb:
		"Things I've built, and what each one actually does. Pick one from the rail to read about it.",
	projectsKindsLead: "They fall into three kinds.",
	projectsHire:
		"If you're weighing up working together, the Products are the closest thing to what that looks like.",
	projectsRailLabel: "All projects",
	projectsEmpty: "Nothing here yet.",
	projectYears: "Years",
	projectRole: "Role",
	projectStatus: "Status",
	projectFeatures: "What it does",
	projectBuiltWith: "Built with",

	// Navigation
	backHome: "← home",
	backProjects: "← projects",
	langLabel: "Language",

	// 404
	notFoundTitle: "Not found",
	notFound: "There’s nothing at this address.",
} as const;

type UI = { readonly [K in keyof typeof en]: string };

const ro: UI = {
	siteDescription:
		"Inginer software în Cluj-Napoca, România. Sisteme, rețelistică și software bine făcut.",

	// Homepage
	intro:
		"Inginer software în Cluj-Napoca, România. Îmi trăiesc viața gândindu-mă la calculatoare, filosofie, istorie și legende, cu un strop de optimism și introspecție.",
	introWelcome: "Bine ai venit pe pagina mea.",
	nowHeading: "Acum",
	nowDate: "iulie 2026",
	nowBody:
		"Tocmai mi-am terminat lucrarea de licență la Universitatea Babeș-Bolyai, un schimb de chei hibrid post-cuantic pentru WireGuard. Momentan construiesc Supernova și lucrez ca freelancer.",
	experienceHeading: "Experiență",
	edu: "Licență în Informatică, Universitatea Babeș-Bolyai, Cluj-Napoca.",
	selectedProjects: "Proiecte selectate",
	allProjects: "Toate proiectele",
	writingHeading: "Scrieri",
	allWriting: "Toate scrierile",

	// Writing
	writingTitle: "Scrieri",
	writingDescription: "Note despre software și viață.",
	writingBlurb:
		"Acesta este blogul meu — note despre software și viață. Alege un articol din cronologie ca să începi să citești.",
	writingRailLabel: "Toate articolele",

	// Projects
	projectsTitle: "Proiecte",
	projectsDescription:
		"Lucruri pe care le-am construit: produse, unelte și sisteme.",
	projectsBlurb:
		"Lucruri pe care le-am construit și ce face fiecare, de fapt. Alege unul din listă ca să citești despre el.",
	projectsKindsLead: "Se împart în trei categorii.",
	projectsHire:
		"Dacă te gândești să lucrăm împreună, Produsele sunt cel mai apropiat exemplu de cum arată asta.",
	projectsRailLabel: "Toate proiectele",
	projectsEmpty: "Nimic aici încă.",
	projectYears: "Ani",
	projectRole: "Rol",
	projectStatus: "Stare",
	projectFeatures: "Ce face",
	projectBuiltWith: "Construit cu",

	// Navigation
	backHome: "← acasă",
	backProjects: "← proiecte",
	langLabel: "Limbă",

	// 404
	notFoundTitle: "Pagină inexistentă",
	notFound: "Nu există nimic la această adresă.",
};

export const ui: Record<Lang, UI> = { en, ro };

/* Sentences that wrap a link. Split rather than held as HTML so the pages stay
   free of set:html. */
type LinkedText = { before: string; link: string; after: string };

export const rssPitch: Record<Lang, { home: LinkedText; writing: LinkedText }> =
	{
		en: {
			home: {
				before: "Notes on software and life, coming soon. There’s an ",
				link: "RSS feed",
				after: " for when they do.",
			},
			writing: {
				before: "Nothing here yet. Subscribe to the ",
				link: "RSS feed",
				after: " to catch the first post.",
			},
		},
		ro: {
			home: {
				before: "Note despre software și viață, în curând. Există un ",
				link: "flux RSS",
				after: " pentru când apar.",
			},
			writing: {
				before: "Nimic aici încă. Abonează-te la ",
				link: "fluxul RSS",
				after: " ca să prinzi primul articol.",
			},
		},
	};

/* Orgs and the sites they were built for are proper nouns; only the line moves. */
export const experience: Record<Lang, { org: string; line: string }[]> = {
	en: [
		{
			org: "BluePlan",
			line: "Built and shipped Atlas, a production RAG platform for technical documents, end to end.",
		},
		{
			org: "Baseline Studios",
			line: "Full-stack work across client apps: stratosphere.vip, pursuitofx.org, kabu.xyz.",
		},
		{
			org: "GeoDraw",
			line: "Developed an AI-powered canvas turning natural language into real-time wireframes.",
		},
		{
			org: "Tvarita",
			line: "Rebuilt and redesigned a monitoring site for an optician clinic chain.",
		},
	],
	ro: [
		{
			org: "BluePlan",
			line: "Am construit și lansat Atlas, o platformă RAG de producție pentru documente tehnice, de la cap la coadă.",
		},
		{
			org: "Baseline Studios",
			line: "Lucru full-stack pe aplicații pentru clienți: stratosphere.vip, pursuitofx.org, kabu.xyz.",
		},
		{
			org: "GeoDraw",
			line: "Am dezvoltat o pânză cu AI care transformă limbajul natural în wireframe-uri în timp real.",
		},
		{
			org: "Tvarita",
			line: "Am reconstruit și reproiectat un site de monitorizare pentru un lanț de clinici de optică.",
		},
	],
};

/* The blurb's three-kinds sentence, whose subjects are the rail's group names.
   `name` must stay in step with `projectGroupNames` below. */
export const projectKinds: Record<Lang, { name: string; body: string }[]> = {
	en: [
		{
			name: "Products",
			body: "are things people use: apps built for a client or for a problem I had.",
		},
		{
			name: "Tools",
			body: "are for other developers, and I use them daily myself.",
		},
		{
			name: "Systems",
			body: "are the low-level work where most of my research sits: networking, cryptography, and the kernel.",
		},
	],
	ro: [
		{
			name: "Produsele",
			body: "sunt lucruri pe care oamenii le folosesc: aplicații construite pentru un client sau pentru o problemă pe care am avut-o.",
		},
		{
			name: "Uneltele",
			body: "sunt pentru alți dezvoltatori și le folosesc zilnic eu însumi.",
		},
		{
			name: "Sistemele",
			body: "sunt munca de nivel scăzut unde stă cea mai mare parte din cercetarea mea: rețelistică, criptografie și kernel.",
		},
	],
};

/* `group` in the project schema is a key, not a label: it sets the rail's order
   and is written into every project's front matter. This is what the rail
   actually shows. */
export const projectGroupNames: Record<Lang, Record<string, string>> = {
	en: { Products: "Products", Tools: "Tools", Systems: "Systems" },
	ro: { Products: "Produse", Tools: "Unelte", Systems: "Sisteme" },
};

/* URL helpers. English is unprefixed, so its URLs are the ones the site has
   always had; Romanian sits under /ro. */
export function localePath(lang: Lang, path: string): string {
	return lang === defaultLang ? path : `/${lang}${path}`;
}

/* The language a pathname belongs to, and that path stripped back to its
   language-neutral form. */
export function parsePath(pathname: string): { lang: Lang; path: string } {
	for (const lang of languages) {
		if (lang === defaultLang) continue;
		if (pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)) {
			return { lang, path: pathname.slice(lang.length + 1) || "/" };
		}
	}
	return { lang: defaultLang, path: pathname };
}

/* Both languages' version of the current URL, for the switcher and hreflang. */
export function altPaths(pathname: string): Record<Lang, string> {
	const { path } = parsePath(pathname);
	return { en: localePath("en", path), ro: localePath("ro", path) };
}

/* Content collection ids carry their language: `en/atlas`, `ro/atlas`. The URL
   slug is shared, so both languages' pages differ only by prefix. */
export const slugOf = (id: string): string => id.replace(/^[a-z]{2}\//, "");
