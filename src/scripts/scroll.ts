/* Smooth scrolling for the wheel and the trackpad, with Lenis: each turn of
   the wheel sets where the page is heading, and it glides there, easing
   into the top and the bottom instead of stopping dead. A finger scrolls
   natively, with the system's own momentum and its spring at the ends.
   Under reduced motion there's no glide at all.

   Lenis is driven only while it's gliding: a turn of the wheel or a
   glideTo() starts the frames, and they stop once the page has arrived. */
import Lenis from "lenis";

declare global {
	interface Window {
		/* Glides the page to `top`, or jumps there where there's no glide. */
		glideTo?: (top: number) => void;
	}
}

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
	const lenis = new Lenis({ stopInertiaOnNavigate: true });

	let frameId = 0;
	const frame = (time: number) => {
		lenis.raf(time);
		frameId =
			lenis.isScrolling === "smooth" ? requestAnimationFrame(frame) : 0;
	};
	/* Lenis times each step from the last one, so after a rest the clock
	   starts over, or the first step would cover the whole rest and jump. */
	const glide = () => {
		if (frameId) return;
		lenis.time = performance.now();
		frameId = requestAnimationFrame(frame);
	};

	lenis.on("virtual-scroll", glide);
	window.glideTo = (top) => {
		lenis.scrollTo(top);
		glide();
	};

	/* A navigation drops any glide under way, so it can't carry the next
	   page on from where this one was, and picks up from wherever the
	   router puts the page. */
	document.addEventListener("astro:before-swap", () => lenis.stop());
	document.addEventListener("astro:after-swap", () => {
		lenis.start();
		lenis.resize();
	});
}
