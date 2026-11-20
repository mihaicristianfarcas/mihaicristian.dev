/* Records a page in a headless browser, for a shot's recording (see
   src/assets/projects/README.md). Headless, so it needs no screen, and
   nothing shows while it runs.

   It takes the frames Chromium's DevTools screencast sends, each with the
   time it was drawn, and gives each one the time until the next, so the
   video plays at the page's real speed however unevenly frames came in.
   Then ffmpeg makes a constant 30fps H.264 .mp4 of them, the way the site
   wants recordings, and a .png of its first frame for the poster.

   Use it from a script that drives a Playwright page (Chromium):

     import { chromium } from "playwright";
     import { record } from "./scripts/record.mjs";

     const browser = await chromium.launch();
     const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
     await page.goto("http://localhost:4321/");
     await record(page, "out.mp4", async ({ start, stop }) => {
       start();
       await page.mouse.wheel(0, 600);
       await page.waitForTimeout(1500);
       stop();
     });
     await browser.close();

   start() and stop() trim the video to what's between them; without them it
   runs from the first frame to the end of the drive. Needs ffmpeg on the
   PATH. */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";

export async function record(
	page,
	out,
	drive,
	{ fps = 30, crf = 26, width = 1440, height = 900 } = {},
) {
	const dir = resolve(out + ".frames");
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });

	const cdp = await page.context().newCDPSession(page);
	const frames = [];
	let done = false;
	cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
		if (done) return;
		const file = join(dir, `${String(frames.length).padStart(5, "0")}.jpg`);
		writeFileSync(file, Buffer.from(data, "base64"));
		frames.push({ file, t: metadata.timestamp });
		await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
	});
	await cdp.send("Page.startScreencast", {
		format: "jpeg",
		quality: 95,
		maxWidth: width,
		maxHeight: height,
	});

	let from = null;
	let to = null;
	await drive({
		start: () => (from = Date.now() / 1000),
		stop: () => (to = Date.now() / 1000),
	});
	to ??= Date.now() / 1000;
	/* A frame drawn just before stop() can still be on its way, and nothing
	   says when the last one has arrived: give it a moment. */
	await new Promise((wake) => setTimeout(wake, 200));
	await cdp.send("Page.stopScreencast");
	done = true;
	await cdp.detach();

	/* The frames from start to stop. The screen as it was at start is the
	   last frame drawn before it, since the screencast only sends a frame
	   when something changes. */
	let use = frames.filter(
		(f) => (from == null || f.t >= from - 0.02) && f.t <= to + 0.02,
	);
	const before = from != null && frames.filter((f) => f.t < from - 0.02).at(-1);
	if (before) use = [{ ...before, t: from }, ...use];
	if (!use.length) throw new Error(`record: no frames for ${out}`);

	const list = [];
	for (let i = 0; i < use.length; i++) {
		const next = i + 1 < use.length ? use[i + 1].t : to;
		list.push(`file '${use[i].file}'`, `duration ${Math.max(0.001, next - use[i].t).toFixed(4)}`);
	}
	list.push(`file '${use.at(-1).file}'`);
	writeFileSync(join(dir, "list.txt"), list.join("\n"));

	// prettier-ignore
	execFileSync("ffmpeg", [
		"-y", "-loglevel", "error",
		"-f", "concat", "-safe", "0", "-i", join(dir, "list.txt"),
		"-vf", `fps=${fps},scale=${width}:${height}:flags=lanczos,format=yuv420p`,
		"-c:v", "libx264", "-preset", "veryslow", "-crf", String(crf),
		"-movflags", "+faststart", "-an", out,
	]);
	execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", out, "-frames:v", "1", out.replace(/\.mp4$/, ".png")]);
	rmSync(dir, { recursive: true, force: true });

	const seconds = use.at(-1).t - use[0].t;
	console.log(`${out}: ${use.length} frames over ${seconds.toFixed(2)}s`);
}
