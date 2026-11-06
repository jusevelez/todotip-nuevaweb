// Layout diff by Elementor element: loads one URL on the live site and on the
// clone, and lists the elements ([data-id]) whose height differs, in page order.
//
//   node scripts/test/layout-diff.mjs /aviso-de-privacidad/ [desktop|mobile] [--clone URL]
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const [p = "/", vpName = "desktop"] = args.filter((a) => !a.startsWith("--") && !a.startsWith("http"));
const CLONE = args.includes("--clone") ? args[args.indexOf("--clone") + 1] : "http://127.0.0.1:4318";
const VP = vpName === "mobile" ? { width: 390, height: 844, isMobile: true, hasTouch: true } : { width: 1440, height: 900 };

async function measure(browser, url) {
  const ctx = await browser.newContext({ viewport: { width: VP.width, height: VP.height }, isMobile: !!VP.isMobile, hasTouch: !!VP.hasTouch });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(1200);
  const out = await page.evaluate(() => {
    const m = {};
    for (const el of document.querySelectorAll("[data-id]")) {
      if (el.closest(".elementor-sticky__spacer, .elementor-popup-modal")) continue;
      const r = el.getBoundingClientRect();
      const id = el.getAttribute("data-id");
      if (m[id]) continue;
      m[id] = { top: Math.round(r.top + scrollY), h: Math.round(r.height), w: Math.round(r.width), type: el.getAttribute("data-widget_type") || el.getAttribute("data-element_type") };
    }
    return { m, total: document.documentElement.scrollHeight };
  });
  await ctx.close();
  return out;
}

const browser = await chromium.launch({ executablePath: "/usr/local/bin/google-chrome" });
const live = await measure(browser, "https://www.todoip.com" + p);
const clone = await measure(browser, CLONE + p);
await browser.close();
console.log(`page height live ${live.total} clone ${clone.total}`);
const rows = Object.entries(live.m)
  .filter(([id]) => clone.m[id])
  .map(([id, a]) => ({ id, type: a.type, top: a.top, dh: clone.m[id].h - a.h, dw: clone.m[id].w - a.w, lh: a.h }))
  .filter((r) => r.dh || r.dw)
  .sort((a, b) => a.top - b.top);
const leaves = rows.filter((r) => !/container|section|column/.test(r.type || ""));
console.log("missing in clone:", Object.keys(live.m).filter((id) => !clone.m[id]));
for (const r of (leaves.length ? leaves : rows).slice(0, 25)) console.log(`${r.id} ${r.type} top=${r.top} h=${r.lh} dh=${r.dh} dw=${r.dw}`);
