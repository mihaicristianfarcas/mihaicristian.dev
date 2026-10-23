// Draws the clouds in the sky behind the page: a haze of white with no
// shape, center or order to it, in fractal value noise, over most of the
// sky. One image for both themes, at full strength here: CSS shows it
// stronger by day and faint by night. Writes src/assets/mesh.png, small,
// for CSS to stretch over the screen. Seeded, so it comes out the same
// every run: `bun scripts/mesh.mjs`.
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

// Small: the haze is soft, and stretched over the screen a sharper image
// looks no different.
const WIDTH = 160;
const HEIGHT = 100;
const SEED = 7;
// The coarsest grid, cells across and down; each finer one halves them, at
// half the weight.
const BASE = [4, 3];
const OCTAVES = 5;
// Noise below LOW is bare sky; it thickens to full at HIGH.
const LOW = 0.2;
const HIGH = 1;
// The alpha in this many steps, not 256: no one can tell at the strengths
// CSS shows it at, and the image comes out smaller.
const ALPHAS = 64;

// mulberry32: a small seeded generator, so the clouds don't change between
// runs.
function random(seed) {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), seed | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const clamp = (t) => Math.min(1, Math.max(0, t));

function noise(next) {
	const total = new Float64Array(WIDTH * HEIGHT);
	let weight = 1;
	for (let octave = 0; octave < OCTAVES; octave++) {
		const cols = BASE[0] * 2 ** octave;
		const rows = BASE[1] * 2 ** octave;
		const grid = Array.from({ length: (cols + 1) * (rows + 1) }, next);
		const at = (x, y) => grid[y * (cols + 1) + x];
		for (let y = 0; y < HEIGHT; y++) {
			const gy = (y / HEIGHT) * rows;
			const y0 = Math.floor(gy);
			const ty = smooth(gy - y0);
			for (let x = 0; x < WIDTH; x++) {
				const gx = (x / WIDTH) * cols;
				const x0 = Math.floor(gx);
				const tx = smooth(gx - x0);
				const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx;
				const bottom =
					at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx;
				total[y * WIDTH + x] += (top + (bottom - top) * ty) * weight;
			}
		}
		weight /= 2;
	}
	let min = Infinity;
	let max = -Infinity;
	for (const v of total) {
		min = Math.min(min, v);
		max = Math.max(max, v);
	}
	return total.map((v) => (v - min) / (max - min));
}

// A PNG of white with the haze in its alpha: gray and alpha, each row led
// by its filter: 2, the difference from the row above, which shrinks a
// smooth image to a fraction.
function png(alpha) {
	const crcTable = Array.from({ length: 256 }, (_, n) => {
		for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
		return n >>> 0;
	});
	const crc = (bytes) => {
		let c = 0xffffffff;
		for (const b of bytes) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
		return (c ^ 0xffffffff) >>> 0;
	};
	const chunk = (type, data) => {
		const body = Buffer.concat([Buffer.from(type), data]);
		const out = Buffer.alloc(body.length + 8);
		out.writeUInt32BE(data.length, 0);
		body.copy(out, 4);
		out.writeUInt32BE(crc(body), body.length + 4);
		return out;
	};
	const header = Buffer.alloc(13);
	header.writeUInt32BE(WIDTH, 0);
	header.writeUInt32BE(HEIGHT, 4);
	header.set([8, 4, 0, 0, 0], 8);
	const pixels = new Uint8Array(WIDTH * HEIGHT * 2).fill(255);
	alpha.forEach((a, i) => (pixels[i * 2 + 1] = a));
	const stride = WIDTH * 2;
	const rows = Buffer.alloc(HEIGHT * (stride + 1));
	for (let y = 0; y < HEIGHT; y++) {
		const row = y * (stride + 1);
		rows[row] = 2;
		for (let i = 0; i < stride; i++) {
			const up = y ? pixels[(y - 1) * stride + i] : 0;
			rows[row + 1 + i] = (pixels[y * stride + i] - up) & 0xff;
		}
	}
	return Buffer.concat([
		Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		chunk("IHDR", header),
		chunk("IDAT", deflateSync(rows, { level: 9 })),
		chunk("IEND", Buffer.alloc(0)),
	]);
}

const alpha = noise(random(SEED)).map((v) => {
	const t = clamp((v - LOW) / (HIGH - LOW));
	const step = Math.round(t * t * (3 - 2 * t) * (ALPHAS - 1));
	return Math.round((step * 255) / (ALPHAS - 1));
});
const out = new URL("../src/assets/mesh.png", import.meta.url);
writeFileSync(out, png(alpha));
console.log(`wrote ${out.pathname}`);
