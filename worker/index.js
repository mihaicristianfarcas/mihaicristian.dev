// Redirects www.mihaicristian.dev to the apex; everything else is served
// from static assets.
export default {
	fetch(request, env) {
		const url = new URL(request.url);
		if (url.hostname.startsWith("www.")) {
			url.hostname = url.hostname.slice(4);
			return Response.redirect(url.toString(), 301);
		}
		return env.ASSETS.fetch(request);
	},
};
