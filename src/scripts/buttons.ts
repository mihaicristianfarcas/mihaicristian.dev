/* The buttons' borders (see .btn in global.css).

   A click is over long before the border it starts has finished drawing,
   so a pressed button keeps its full border a moment longer
   (data-pressed). Under a finger this is the only press a button shows,
   at once, and the hold is what lets the tap be seen. The section you're going to takes its full border as
   soon as you click, and the one you're leaving gives it up: the side's
   sections are kept through navigations, so both draw while the page
   changes rather than jumping once it's in. */

const HOLD = 800; // the border's 550ms, and a beat to see it whole

document.addEventListener("click", (event) => {
	const button = (event.target as Element).closest?.<HTMLElement>(".btn");
	if (!button) return;
	button.dataset.pressed = "";
	setTimeout(() => delete button.dataset.pressed, HOLD);
});

/* The side's sections, lit for the page at `path`: the one it is, or the
   one it belongs to. Same as Base.astro renders them. */
function light(path: string) {
	for (const tab of document.querySelectorAll<HTMLAnchorElement>(".tabs a")) {
		const href = new URL(tab.href).pathname;
		if (path === href) tab.setAttribute("aria-current", "page");
		else if (path.startsWith(href)) tab.setAttribute("aria-current", "true");
		else tab.removeAttribute("aria-current");
	}
}

document.addEventListener("astro:before-preparation", (event) =>
	light(event.to.pathname),
);
/* And again once the page is in: right whichever way it was reached. */
document.addEventListener("astro:after-swap", () => light(location.pathname));
