import assert from "node:assert/strict";
import test from "node:test";
import worker from "../worker/index.js";

const fresh = "public, max-age=0, must-revalidate";
const env = (status = 200) => ({
	ASSETS: {
		fetch: async () =>
			new Response("asset", {
				status,
				headers: { "Cache-Control": fresh, "Content-Type": "text/javascript" },
			}),
	},
});

test("fingerprinted assets keep their body and type and can be reused across visits", async () => {
	const response = await worker.fetch(
		new Request("https://mihaicristian.dev/_astro/code.ABC12345.js"),
		env(),
	);
	assert.equal(
		response.headers.get("Cache-Control"),
		"public, max-age=31536000, immutable",
	);
	assert.equal(response.headers.get("Content-Type"), "text/javascript");
	assert.equal(await response.text(), "asset");
});

test("pages, feeds, and missing assets retain their freshness policy", async () => {
	for (const [path, status] of [
		["/", 200],
		["/rss.xml", 200],
		["/_astro/missing.js", 404],
	]) {
		const response = await worker.fetch(
			new Request(`https://mihaicristian.dev${path}`),
			env(status),
		);
		assert.equal(response.status, status);
		assert.equal(response.headers.get("Cache-Control"), fresh);
	}
});

const video = {
	ASSETS: {
		fetch: async () =>
			new Response("0123456789", {
				headers: { "Cache-Control": fresh, "Content-Type": "video/mp4" },
			}),
	},
};
const ranged = (range) =>
	worker.fetch(
		new Request("https://mihaicristian.dev/_astro/demo.ABC12345.mp4", {
			headers: range ? { Range: range } : {},
		}),
		video,
	);

test("videos answer byte ranges, which Safari needs before it will play", async () => {
	for (const [range, body, contentRange] of [
		["bytes=2-5", "2345", "bytes 2-5/10"],
		["bytes=7-", "789", "bytes 7-9/10"],
		["bytes=-3", "789", "bytes 7-9/10"],
		["bytes=8-99", "89", "bytes 8-9/10"],
	]) {
		const response = await ranged(range);
		assert.equal(response.status, 206, range);
		assert.equal(await response.text(), body, range);
		assert.equal(response.headers.get("Content-Range"), contentRange, range);
		assert.equal(response.headers.get("Content-Length"), String(body.length));
		assert.equal(response.headers.get("Content-Type"), "video/mp4");
		assert.equal(
			response.headers.get("Cache-Control"),
			"public, max-age=31536000, immutable",
		);
	}
});

test("videos refuse a range past the end, and send it whole without one", async () => {
	const beyond = await ranged("bytes=20-");
	assert.equal(beyond.status, 416);
	assert.equal(beyond.headers.get("Content-Range"), "bytes */10");

	const whole = await ranged();
	assert.equal(whole.status, 200);
	assert.equal(await whole.text(), "0123456789");
});

test("www redirects preserve the path and query", async () => {
	const response = await worker.fetch(
		new Request("https://www.mihaicristian.dev/writing/?a=b"),
		env(),
	);
	assert.equal(response.status, 301);
	assert.equal(
		response.headers.get("Location"),
		"https://mihaicristian.dev/writing/?a=b",
	);
});
