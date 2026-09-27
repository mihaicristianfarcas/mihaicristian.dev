// Redirects www.mihaicristian.dev to the apex; everything else is served
// from static assets.
export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		if (url.hostname.startsWith("www.")) {
			url.hostname = url.hostname.slice(4);
			return Response.redirect(url.toString(), 301);
		}
		let response = await env.ASSETS.fetch(request);
		// Safari won't play a video unless its range requests are honoured. If
		// the asset service sent the whole file anyway, cut out the range asked for.
		if (url.pathname.endsWith(".mp4")) {
			response = await withRange(request, response);
		}
		// Astro's asset URLs include a content hash. Keep them in the browser
		// cache across visits; HTML and errors keep the asset service's defaults.
		if (
			(response.status === 200 || response.status === 206) &&
			url.pathname.startsWith("/_astro/")
		) {
			const cached = new Response(response.body, response);
			cached.headers.set(
				"Cache-Control",
				"public, max-age=31536000, immutable",
			);
			return cached;
		}
		return response;
	},
};

/* Answers a single `Range: bytes=…` request from a full 200 response. Anything
   else (no range, several ranges, a 206 already) passes through untouched. */
async function withRange(request, response) {
	const match = /^bytes=(\d*)-(\d*)$/.exec(
		request.headers.get("Range")?.trim() ?? "",
	);
	if (!match || response.status !== 200 || (!match[1] && !match[2])) {
		return response;
	}
	const body = await response.arrayBuffer();
	const size = body.byteLength;
	const [start, end] = match[1]
		? [Number(match[1]), Math.min(Number(match[2] || size - 1), size - 1)]
		: [Math.max(0, size - Number(match[2])), size - 1];
	const headers = new Headers(response.headers);
	headers.set("Accept-Ranges", "bytes");
	if (start >= size || start > end) {
		headers.set("Content-Range", `bytes */${size}`);
		headers.delete("Content-Length");
		return new Response(null, { status: 416, headers });
	}
	headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
	headers.set("Content-Length", String(end - start + 1));
	return new Response(body.slice(start, end + 1), { status: 206, headers });
}
