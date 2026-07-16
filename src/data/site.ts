/* What is the same in every language. The site description lives in
   `siteDescription` in data/i18n.ts; the link labels are proper nouns. */

/* `newTab` forces target=_blank for same-origin links the http check misses —
   the CV opens in its own tab so it doesn't navigate away from the page. */
type SiteLink = { label: string; href: string; newTab?: boolean };

export const site = {
	name: "Mihai-Cristian Farcaș",
	url: "https://mihaicristian.dev",
	links: [
		{
			label: "GitHub",
			href: "https://github.com/mihaicristianfarcas",
		},
		{ label: "X", href: "https://x.com/mihaicristianf" },
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
