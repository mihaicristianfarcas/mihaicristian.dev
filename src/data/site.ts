/* Site metadata and links. */

/* `newTab` forces target=_blank for same-origin links the http check misses —
   the CV opens in its own tab so it doesn't navigate away from the page. */
type SiteLink = { label: string; href: string; newTab?: boolean };

export const site = {
	name: "Mihai-Cristian Farcaș",
	url: "https://mihaicristian.dev",
	jobTitle: "Systems software engineer",
	description:
		"Mihai-Cristian Farcaș is a systems software engineer in Cluj-Napoca, Romania, building network software, developer tools, and AI products.",
	links: [
		{ label: "X", href: "https://x.com/mihaicristianf" },
		{
			label: "GitHub",
			href: "https://github.com/mihaicristianfarcas",
		},
		{
			label: "LinkedIn",
			href: "https://www.linkedin.com/in/mihai-cristian-farca%C8%99-6660542a6/",
		},
		{
			label: "Email",
			href: "mailto:mihaicristianfarcas@gmail.com",
		},
		{
			label: "CV",
			href: "/Mihai-Cristian-Farcas-CV.pdf",
			newTab: true,
		},
	] satisfies SiteLink[],
};

export const person = {
	"@type": "Person",
	"@id": `${site.url}/#person`,
	name: site.name,
	alternateName: ["Mihai-Cristian Farcas", "Mihai Cristian Farcas"],
	url: `${site.url}/`,
	jobTitle: site.jobTitle,
	sameAs: site.links
		.filter((link) => link.href.startsWith("https://"))
		.map((link) => link.href),
};
