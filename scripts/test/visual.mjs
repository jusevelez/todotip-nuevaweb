// Visual parity: full-page screenshots of the live site and the clone at desktop
// and mobile widths, plus a pixel diff (pixelmatch) per URL/viewport.
//
//   node scripts/test/visual.mjs --clone http://127.0.0.1:4317 [--live] [--only /,/blog/]
//
// Live screenshots are cached in artifacts/visual/live (re-captured with --live) and
// taken slowly, one URL at a time, to stay under the live server's rate limit.
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUT = path.join(ROOT, "artifacts/visual");
const args = process.argv.slice(2);
const arg = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const CLONE = arg("--clone") ?? "http://127.0.0.1:4317";
const LIVE = "https://www.todoip.com";
const refreshLive = args.includes("--live");
const manifest = JSON.parse(await fs.readFile(path.join(ROOT, "capture/manifest.json"), "utf8"));
let paths = Object.entries(manifest.pages)
  .filter(([, v]) => v.status === 200 && v.file)
  .map(([p]) => p);
if (arg("--only")) paths = arg("--only").split(",");

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
};
const slug = (p) => (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/\//g, "--"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shoot(browser, url, vp, file) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  const res = await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  // Walk the page so lazy backgrounds / entrance animations run, then return to top.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  // Freeze/hide time-dependent parts (slideshow frame, rotating headline word, popups, iframes).
  await page.addStyleTag({
    content: `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important;caret-color:transparent!important}
      .elementor-popup-modal{display:none!important} iframe{visibility:hidden!important}
      .elementor-background-slideshow,.elementor-headline-dynamic-wrapper{visibility:hidden!important}`,
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: file, fullPage: true });
  await ctx.close();
  return { status: res?.status(), consoleErrors };
}

function diff(a, b, out) {
  const A = PNG.sync.read(a);
  const B = PNG.sync.read(b);
  const width = Math.max(A.width, B.width);
  const height = Math.max(A.height, B.height);
  const pad = (img) => {
    const p = new PNG({ width, height });
    p.data.fill(255);
    PNG.bitblt(img, p, 0, 0, img.width, img.height, 0, 0);
    return p;
  };
  const pa = pad(A);
  const pb = pad(B);
  const d = new PNG({ width, height });
  const mismatched = pixelmatch(pa.data, pb.data, d.data, width, height, { threshold: 0.15 });
  return fs.writeFile(out, PNG.sync.write(d)).then(() => ({
    liveSize: `${A.width}x${A.height}`,
    cloneSize: `${B.width}x${B.height}`,
    heightDelta: B.height - A.height,
    mismatchPct: +((mismatched / (width * height)) * 100).toFixed(2),
  }));
}

await fs.mkdir(path.join(OUT, "live"), { recursive: true });
await fs.mkdir(path.join(OUT, "clone"), { recursive: true });
await fs.mkdir(path.join(OUT, "diff"), { recursive: true });
const browser = await chromium.launch({ executablePath: "/usr/local/bin/google-chrome" });
const reportFile = path.join(OUT, "report.json");
const report = JSON.parse(await fs.readFile(reportFile, "utf8").catch(() => "{}"));
for (const p of paths) {
  for (const [name, vp] of Object.entries(VIEWPORTS)) {
    const key = `${slug(p)}-${name}.png`;
    const liveFile = path.join(OUT, "live", key);
    const cloneFile = path.join(OUT, "clone", key);
    let live = report[`${p}|${name}`]?.live;
    const haveLive = await fs.stat(liveFile).then(() => true, () => false);
    if (refreshLive || !haveLive) {
      live = await shoot(browser, LIVE + p, vp, liveFile);
      await sleep(4000);
    }
    const clone = await shoot(browser, CLONE + p, vp, cloneFile);
    const d = await diff(await fs.readFile(liveFile), await fs.readFile(cloneFile), path.join(OUT, "diff", key));
    report[`${p}|${name}`] = { path: p, viewport: name, live, clone, ...d };
    console.log(p, name, `mismatch ${d.mismatchPct}%`, `h live/clone ${d.liveSize} ${d.cloneSize}`, clone.consoleErrors.length ? `clone console errors: ${clone.consoleErrors.length}` : "");
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
  }
}
await browser.close();
