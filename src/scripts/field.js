/* The field: a floor of characters round the page that only the pointer
   shows. At rest it's paper. Under a mouse or a pen the characters within
   reach come up out of it toward --field-glow, and fade back into it as the
   pointer moves on, leaving a short trail. Here and there they spell a word,
   and a few things are hidden in it to find: lines of Seneca, formulas
   from computer science, and a hunt round the screen's corners.

   Inlined at the top of <body> by Base.astro, right after its canvas. The
   canvas persists across navigations (transition:persist), and so does this
   script's state; on a later page the script finds it running and stops.

   Only the cells the pointer warmed are drawn, and drawn again only when
   their shade changes. The bands that fade the page out at the screen's
   edges (.edges) are copies of the field over paper, refreshed when a cell
   in them changes. When nothing moves, nothing runs. */
(() => {
	const canvas = document.querySelector("canvas.field");
	if (!canvas || canvas.dataset.running !== undefined) return;
	canvas.dataset.running = "";

	const ctx = canvas.getContext("2d");
	const root = document.documentElement;
	const still = matchMedia("(prefers-reduced-motion: reduce)");
	const dark = matchMedia("(prefers-color-scheme: dark)");

	/* The floor: a character in every cell round the page, and none over
	   the middle of the screen, where the page is read. The middle is an
	   ellipse PAD of the screen's shorter side in from every edge; the floor
	   comes in over its outer part, from EASE of its radius out, so it has
	   no hard edge. On a phone, where the text fills the screen's width, the
	   ellipse is never narrower than the text. Which character is left to
	   chance, so no run of them lines up into a rule; the ones listed twice
	   come up twice as often. */
	const GLYPHS = "..::+*/\\|=-#%<>^~0101xyzxyz{}[]();$@&?!";
	const PAD = 0.1;
	const EASE = 0.75;
	/* Words, one for about every WORDS cells of floor, each with a space
	   either side so it reads as one. */
	const WORDS = 90;
	const WORD_LIST = [
		"hello", "world", "build", "ship", "think", "learn", "paint", "curious",
		"euthymia", "memento", "mori", "true", "false", "null", "void", "async",
		"await", "return", "const", "let", "fn", "loop", "rust", "swift",
		"metal", "quic", "ebpf", "wireguard", "cluj", "atlas", "helio", "asides",
	];

	/* The things hidden in the floor, each in a clearing of its own, where
	   the floor is whole, so it reads as one when it's uncovered: QUOTES of
	   Seneca's lines (src/data/quotes.ts, handed over as the canvas's
	   data-quotes) and FORMULAS of these, new ones on every load. */
	const QUOTES = 2;
	const FORMULAS = 3;
	const FORMULA_LIST = [
		"T(n) = 2T(n/2) + O(n)  =>  T(n) = O(n log n)",
		"gcd(a, b) = gcd(b, a mod b)",
		"c = m^e mod n,  m = c^d mod n",
		"H(X) = -Σ p(x) log2 p(x)",
		"Y = λf.(λx.f (x x)) (λx.f (x x))",
		"F(n) = F(n-1) + F(n-2)",
		"1 + 2 + ... + n = n(n+1)/2",
		"¬(a ∧ b) = ¬a ∨ ¬b",
		"x ⊕ x = 0",
		"P = NP ?",
		"2^10 = 1024",
		"n! ≈ √(2πn) (n/e)^n",
		"P(A|B) = P(B|A) P(A) / P(B)",
		"f(n) = g(n) + h(n)",
		"S = 1 / ((1 - p) + p/s)",
		"L = λW",
		"sorting: Ω(n log n) comparisons",
		"e^(iπ) + 1 = 0",
	];
	/* The hunt: a hint somewhere in the floor sends the pointer to a
	   corner, and each corner, once reached, says where to go next, until
	   the last. Within REACH_CORNER px of a corner counts as there. */
	const HUNT = [
		[null, "psst. go to the top left corner."],
		["top left", "good. now the bottom right."],
		["bottom right", "now the top right."],
		["top right", "last one: the bottom left."],
		["bottom left", "every corner. per aspera ad astra."],
	];
	const REACH_CORNER = 90;

	const MONO = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';
	/* Shades from the paper, where a character can't be seen, to its glow. */
	const LEVELS = 24;
	/* The pointer's reach, in CSS px, and how fast its warmth fades (per ms). */
	const REACH = 110;
	const COOL = 0.003;

	let dpr = 1;
	let cw = 0; // a cell's width and height, in device px
	let ch = 0;
	let base = 0; // the baseline within a cell
	let cols = 0;
	let rows = 0;
	let seen = 0; // rows on screen, the canvas being as tall as the screen at its tallest
	let glyphs = new Uint16Array(0); // per cell: 0 for nothing, else its character's code
	let density = new Float32Array(0); // per cell: how likely the floor is to fill it
	let taken = new Uint8Array(0); // per cell: 1 where something hidden is written
	let drawn = new Uint8Array(0); // the shade each cell was last drawn in, 0 for none
	let heat = new Float32Array(0); // the pointer's warmth, 0–1
	const warm = new Set(); // cells with heat
	let shades = [];

	/* A value from 0 to 1 per pair of numbers, the same every time. */
	const hash = (x, y) => {
		let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
		h = Math.imul(h ^ (h >>> 13), 1274126177);
		return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
	};
	/* The two colors, as the browser resolves them, mixed into the shades. */
	const rgb = (value) => {
		ctx.fillStyle = "#000";
		ctx.fillStyle = value.trim() || "#000";
		const hex = ctx.fillStyle;
		const n = parseInt(hex.slice(1), 16);
		return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
	};
	const readColors = () => {
		const css = getComputedStyle(root);
		const from = rgb(css.getPropertyValue("--paper"));
		const to = rgb(css.getPropertyValue("--field-glow"));
		shades = Array.from({ length: LEVELS }, (_, i) => {
			const t = i / (LEVELS - 1);
			const c = from.map((v, k) => Math.round(v + (to[k] - v) * t));
			return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
		});
	};

	let quotes = [];
	try {
		quotes = JSON.parse(canvas.dataset.quotes || "[]");
	} catch {}

	const edges = () => document.querySelectorAll("canvas.edges");
	const pick = (list, n) => [...list].sort(() => Math.random() - 0.5).slice(0, n);

	/* A cell's character in the floor, the same every time. */
	const floor = (i) => {
		const c = i % cols;
		const r = Math.floor(i / cols);
		return hash(c + 7, r + 13) < density[i]
			? GLYPHS.charCodeAt(Math.floor(hash(c + 101, r + 211) * GLYPHS.length))
			: 0;
	};
	/* Set a cell's character, and have it drawn again if it shows. */
	const set = (i, code) => {
		glyphs[i] = code;
		if (drawn[i]) drawn[i] = 255;
	};

	/* Lines of at most `width` characters, broken between words. */
	const wrap = (text, width) => {
		const lines = [""];
		for (const word of text.split(" ")) {
			const line = lines[lines.length - 1];
			if (line && line.length + 1 + word.length > width) lines.push(word);
			else lines[lines.length - 1] = line ? `${line} ${word}` : word;
		}
		return lines;
	};
	/* Write lines into the floor with their top left at row `r`, column
	   `c`, in a clearing a cell wider all round. Returns the block, to
	   clear it again. */
	const write = (lines, r, c) => {
		const w = Math.max(...lines.map((l) => l.length)) + 2;
		const h = lines.length + 2;
		for (let y = 0; y < h; y++)
			for (let x = 0; x < w; x++) {
				const i = (r + y) * cols + c + x;
				const code = lines[y - 1]?.charCodeAt(x - 1) || 0;
				set(i, code > 32 ? code : 0);
				taken[i] = 1;
			}
		return { r, c, w, h };
	};
	const unwrite = (block) => {
		for (let y = 0; y < block.h; y++)
			for (let x = 0; x < block.w; x++) {
				const i = (block.r + y) * cols + block.c + x;
				taken[i] = 0;
				set(i, floor(i));
			}
	};
	/* Whether a block fits there: on screen, on whole floor, and clear of
	   anything else hidden. */
	const fits = (r, c, w, h) => {
		if (r < 0 || c < 0 || r + h > seen || c + w > cols) return false;
		for (let y = 0; y < h; y++)
			for (let x = 0; x < w; x++) {
				const i = (r + y) * cols + c + x;
				if (taken[i] || density[i] < 0.9) return false;
			}
		return true;
	};
	/* Hide some text somewhere it fits, as wide as it can go. */
	const hide = (text) => {
		for (const width of [48, 34, 24, 16]) {
			const lines = wrap(text, width);
			const w = Math.max(...lines.map((l) => l.length)) + 2;
			const h = lines.length + 2;
			for (let k = 0; k < 300; k++) {
				const r = Math.floor(Math.random() * (seen - h + 1));
				const c = Math.floor(Math.random() * (cols - w + 1));
				if (fits(r, c, w, h)) return write(lines, r, c);
			}
		}
		return null;
	};

	/* The hunt: which step it's on, and where its hint is written. */
	let step = 0;
	let hint = null;
	/* Write the hunt's hint for this step: the first anywhere, the rest in
	   the corner just reached. */
	const writeHint = () => {
		if (hint) unwrite(hint);
		const [corner, text] = HUNT[step];
		if (!corner) {
			hint = hide(text);
			return;
		}
		const lines = wrap(text, 28);
		const w = Math.max(...lines.map((l) => l.length)) + 2;
		const h = lines.length + 2;
		const r = corner.startsWith("top") ? 1 : Math.max(0, seen - h - 1);
		const c = corner.endsWith("left") ? 1 : Math.max(0, cols - w - 1);
		hint = write(lines, r, c);
	};
	const near = (corner, x, y) =>
		(corner.startsWith("top") ? y : innerHeight - y) < REACH_CORNER &&
		(corner.endsWith("left") ? x : innerWidth - x) < REACH_CORNER;

	/* Fit the grid to the screen, lay the floor, and hide things in it. */
	const layout = () => {
		dpr = Math.min(devicePixelRatio || 1, 2);
		const box = canvas.getBoundingClientRect();
		canvas.width = Math.round(box.width * dpr);
		canvas.height = Math.round(box.height * dpr);
		const css = getComputedStyle(root);
		const token = (name, fallback) => parseFloat(css.getPropertyValue(name)) || fallback;
		const px = Math.round(token("--text-field", 11) * dpr);
		ctx.font = `${px}px ${MONO}`;
		ctx.textBaseline = "alphabetic";
		cw = Math.ceil(ctx.measureText("M").width);
		ch = Math.round(px * 1.25);
		base = Math.round(px * 0.95);
		cols = Math.ceil(canvas.width / cw);
		rows = Math.ceil(canvas.height / ch);
		seen = Math.min(rows, Math.floor((innerHeight * dpr) / ch));
		const n = cols * rows;
		glyphs = new Uint16Array(n);
		density = new Float32Array(n);
		taken = new Uint8Array(n);
		drawn = new Uint8Array(n);
		heat = new Float32Array(n);
		warm.clear();

		/* The ellipse, in CSS px from the middle of the screen. The text's
		   column is half the page (--page-width) less its margin (--gutter)
		   either side of the middle. */
		const width = box.width;
		const height = box.height;
		const pad = PAD * Math.min(width, height);
		const text = Math.min(token("--page-width", 936), width) / 2 - token("--gutter", 22);
		const rx = Math.max(width / 2 - pad, text);
		const ry = height / 2 - pad;
		const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
		for (let i = 0; i < n; i++) {
			const x = (((i % cols) + 0.5) * cw) / dpr - width / 2;
			const y = ((Math.floor(i / cols) + 0.5) * ch) / dpr - height / 2;
			density[i] = ease((Math.hypot(x / rx, y / ry) - EASE) / (1 - EASE));
			glyphs[i] = floor(i);
		}

		/* What's hidden first, so it gets the room, clear of the corners,
		   which the hunt keeps for its hints; then the words, where they
		   don't cross it. */
		const corners = [];
		for (const top of [true, false])
			for (const left of [true, false]) {
				const r = top ? 0 : Math.max(0, seen - 6);
				const c = left ? 0 : Math.max(0, cols - 34);
				for (let y = r; y < Math.min(r + 6, rows); y++)
					for (let x = c; x < Math.min(c + 34, cols); x++) corners.push(y * cols + x);
			}
		for (const i of corners) taken[i] = 1;
		for (const quote of pick(quotes, QUOTES)) hide(quote);
		for (const formula of pick(FORMULA_LIST, FORMULAS)) hide(formula);
		for (const i of corners) taken[i] = 0;
		hint = null;
		writeHint();

		const count = Math.round(n / WORDS);
		for (let k = 0; k < count; k++) {
			const word = WORD_LIST[Math.floor(hash(k, 3) * WORD_LIST.length)];
			const r = Math.floor(hash(k, 1) * rows);
			const c = 1 + Math.floor(hash(k, 2) * (cols - word.length - 2));
			const i = r * cols + c;
			if (c < 1 || c + word.length >= cols || hash(k, 4) >= density[i]) continue;
			if (taken.subarray(i - 1, i + word.length + 1).some(Boolean)) continue;
			glyphs[i - 1] = 0;
			glyphs[i + word.length] = 0;
			for (let j = 0; j < word.length; j++) glyphs[i + j] = word.charCodeAt(j);
		}

		sizeEdges();
		paint();
	};

	const sizeEdges = () => {
		for (const edge of edges()) {
			const rect = edge.getBoundingClientRect();
			edge.width = Math.round(rect.width * dpr);
			edge.height = Math.round(rect.height * dpr);
		}
	};

	/* The field at rest: nothing to see. */
	const paint = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawn.fill(0);
		copyEdges(0, canvas.height);
	};

	/* Copy the field into the edge bands that the rows from `top` to
	   `bottom` (device px) reach. */
	const copyEdges = (top, bottom) => {
		for (const edge of edges()) {
			const rect = edge.getBoundingClientRect();
			const y = Math.round(rect.top * dpr);
			if (bottom < y || top > y + edge.height) continue;
			const ectx = edge.getContext("2d");
			ectx.clearRect(0, 0, edge.width, edge.height);
			ectx.drawImage(canvas, 0, y, edge.width, edge.height, 0, 0, edge.width, edge.height);
		}
	};

	/* The pointer, in CSS px, and where it was at the last frame. */
	let pointer = null;
	let trail = null;

	/* Warm the cells within reach of a point: fully near its center, then
	   less and less out to the edge of its reach. */
	const stamp = (x, y) => {
		const reach = REACH * dpr;
		const cx = x * dpr;
		const cy = y * dpr;
		const c0 = Math.max(0, Math.floor((cx - reach) / cw));
		const c1 = Math.min(cols - 1, Math.floor((cx + reach) / cw));
		const r0 = Math.max(0, Math.floor((cy - reach) / ch));
		const r1 = Math.min(rows - 1, Math.floor((cy + reach) / ch));
		for (let r = r0; r <= r1; r++) {
			for (let c = c0; c <= c1; c++) {
				const dx = (c + 0.5) * cw - cx;
				const dy = (r + 0.5) * ch - cy;
				const d2 = (dx * dx + dy * dy) / (reach * reach);
				if (d2 >= 1) continue;
				const f = 1 - d2;
				const i = r * cols + c;
				if (glyphs[i] && f > heat[i]) {
					heat[i] = f;
					warm.add(i);
				}
			}
		}
	};

	let frameId = 0;
	let last = 0;
	const kick = () => {
		if (!frameId) frameId = requestAnimationFrame(frame);
	};

	function frame(now) {
		frameId = 0;
		const dt = last ? Math.min(now - last, 100) : 16;
		last = now;

		/* The pointer warms the cells along its way since the last frame,
		   so a quick sweep leaves no gaps. Under reduced motion only the
		   cells under it light up, and go out as soon as it leaves. */
		if (still.matches) {
			for (const i of warm) heat[i] = 0;
		} else {
			const k = Math.exp(-COOL * dt);
			for (const i of warm) heat[i] *= k;
		}
		if (pointer) {
			const from = trail ?? pointer;
			const steps = Math.max(1, Math.ceil(Math.hypot(pointer.x - from.x, pointer.y - from.y) / (REACH / 3)));
			for (let s = 1; s <= steps; s++)
				stamp(from.x + ((pointer.x - from.x) * s) / steps, from.y + ((pointer.y - from.y) * s) / steps);
			trail = pointer;
		}

		/* Draw the cells whose shade changed, one color at a time; a cell
		   back at the paper's, or emptied, is only cleared. */
		const byShade = new Map();
		for (const i of warm) {
			if (heat[i] < 0.01) {
				heat[i] = 0;
				warm.delete(i);
			}
			const level = Math.round(heat[i] * (LEVELS - 1));
			if (level === drawn[i]) continue;
			drawn[i] = level;
			let list = byShade.get(level);
			if (!list) byShade.set(level, (list = []));
			list.push(i);
		}

		let top = Infinity;
		let bottom = -Infinity;
		for (const [level, list] of byShade) {
			ctx.fillStyle = shades[level];
			for (const i of list) {
				const x = (i % cols) * cw;
				const y = Math.floor(i / cols) * ch;
				ctx.clearRect(x, y, cw, ch);
				if (level && glyphs[i]) ctx.fillText(String.fromCharCode(glyphs[i]), x, y + base);
				if (y < top) top = y;
				if (y + ch > bottom) bottom = y + ch;
			}
		}
		if (bottom > top) copyEdges(top, bottom);

		/* Every frame while the pointer's warmth is fading, and not at all
		   once it's gone. */
		if (warm.size || pointer !== trail) frameId = requestAnimationFrame(frame);
		else last = 0;
	}

	/* Only a mouse or a pen shows the field: a finger is scrolling. */
	addEventListener(
		"pointermove",
		(event) => {
			if (event.pointerType === "touch") return;
			pointer = { x: event.clientX, y: event.clientY };
			/* The hunt goes on when the pointer reaches the corner it's
			   been sent to. */
			const next = HUNT[step + 1];
			if (next && near(next[0], pointer.x, pointer.y)) {
				step++;
				writeHint();
			}
			kick();
		},
		{ passive: true },
	);
	const away = () => {
		pointer = null;
		trail = null;
		kick();
	};
	root.addEventListener("pointerleave", away);
	addEventListener("blur", away);

	/* A new size or theme starts the field over, once, in the next frame. */
	let pending = 0;
	const redo = (colors) => {
		if (colors) readColors();
		if (!pending)
			pending = requestAnimationFrame(() => {
				pending = 0;
				layout();
				kick();
			});
	};
	addEventListener("resize", () => redo(false));
	dark.addEventListener("change", () => redo(true));
	/* The edge bands arrive later in the page than this script: size them
	   once they're in. */
	if (document.readyState === "loading")
		document.addEventListener("DOMContentLoaded", sizeEdges, { once: true });

	readColors();
	layout();
})();
