// Redirects www.mihaicristian.dev to the apex; everything else is served
// from static assets.
export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		if (url.hostname.startsWith("www.")) {
			url.hostname = url.hostname.slice(4);
			return Response.redirect(url.toString(), 301);
		}
		const response = await env.ASSETS.fetch(request);
		// Astro's asset URLs include a content hash. Keep them in the browser
		// cache across visits; HTML and errors keep the asset service's defaults.
		if (response.status === 200 && url.pathname.startsWith("/_astro/")) {
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
