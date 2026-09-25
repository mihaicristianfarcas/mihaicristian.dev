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
