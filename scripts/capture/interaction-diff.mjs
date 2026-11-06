// Records attribute changes Elementor JS makes on the live site during an interaction
// (hover/click), so the clone runtime can reproduce them exactly.
import { chromium } from "playwright-core";

const [url, width, ...steps] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/usr/local/bin/google-chrome" });
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(800);

const snap = () =>
  page.evaluate(() => {
    const out = {};
    document.querySelectorAll("body *").forEach((el, i) => {
      if (el.closest("script,style,svg")) return;
      const key = `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${el.getAttribute("data-id") ? "[" + el.getAttribute("data-id") + "]" : ""}@${i}`;
      const attrs = {};
      for (const a of el.attributes) if (a.name !== "data-settings") attrs[a.name] = a.value;
      out[key] = attrs;
    });
    return out;
  });

let before = await snap();
for (const step of steps) {
  const [action, selector] = step.split("=>");
  if (action === "hover") await page.hover(selector);
  else if (action === "click") await page.click(selector);
  else if (action === "scroll") await page.mouse.wheel(0, Number(selector));
  await page.waitForTimeout(900);
  const after = await snap();
  console.log(`\n### ${step}`);
  for (const k of Object.keys(after)) {
    const a = before[k] || {};
    const b = after[k];
    for (const n of new Set([...Object.keys(a), ...Object.keys(b)]))
      if (a[n] !== b[n]) console.log(k.slice(0, 70), n, JSON.stringify(a[n])?.slice(0, 200), "->", JSON.stringify(b[n])?.slice(0, 300));
  }
  for (const k of Object.keys(before)) if (!after[k]) console.log("REMOVED", k);
  before = after;
}
await browser.close();
