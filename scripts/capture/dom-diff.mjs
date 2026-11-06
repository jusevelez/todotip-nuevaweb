// Loads a live page in headless Chrome and reports which classes / inline styles /
// attributes Elementor's JS adds compared to the static HTML (to know what the
// clone runtime must reproduce).
import { chromium } from "playwright-core";
import * as cheerio from "cheerio";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const [pagePath = "/", slug = "home", width = "1440"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/usr/local/bin/google-chrome" });
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
await page.goto("https://www.todoip.com" + pagePath, { waitUntil: "networkidle" });
for (let y = 0; y < 30; y++) {
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(120);
}
await page.waitForTimeout(1500);
const live = await page.evaluate(() =>
  [...document.querySelectorAll("[data-id], [class*='e-n-menu'], [class*='elementor-nav-menu'], [class*='elementor-headline']")].map((el, i) => ({
    key: (el.getAttribute("data-id") || "") + "|" + el.tagName + "|" + i,
    id: el.getAttribute("data-id"),
    cls: el.getAttribute("class"),
    style: el.getAttribute("style"),
  })),
);
const bodyCls = await page.evaluate(() => document.body.className);
await browser.close();

const $ = cheerio.load(await fs.readFile(path.join(ROOT, "capture/html", slug + ".html"), "utf8"));
const stat = $("[data-id], [class*='e-n-menu'], [class*='elementor-nav-menu'], [class*='elementor-headline']")
  .toArray()
  .map((el) => ({ id: $(el).attr("data-id"), cls: $(el).attr("class"), style: $(el).attr("style") }));
const added = {};
const styles = {};
const byId = new Map(stat.filter((s) => s.id).map((s) => [s.id, s]));
for (const l of live) {
  const s = l.id ? byId.get(l.id) : null;
  if (!s) continue;
  const a = new Set((s.cls || "").split(/\s+/));
  for (const c of (l.cls || "").split(/\s+/)) if (c && !a.has(c)) added[c] = (added[c] || 0) + 1;
  if ((l.style || "") !== (s.style || "")) styles[l.style?.slice(0, 120)] = (styles[l.style?.slice(0, 120)] || 0) + 1;
}
console.log("BODY live:", bodyCls);
console.log("ADDED CLASSES", added);
console.log("STYLE CHANGES", styles);
