// Interaction parity: runs the same scenario (hover/click/scroll) on the live site
// and on the clone, screenshots the viewport and pixel-diffs it; plus clone-only
// checks for the form guard (no network submission, honest notice).
//
//   node scripts/test/interactions.mjs --clone http://127.0.0.1:4318 [--only name | --forms]
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUT = path.join(ROOT, "artifacts/interactions");
const args = process.argv.slice(2);
const arg = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const CLONE = arg("--clone") ?? "http://127.0.0.1:4318";
const LIVE = "https://www.todoip.com";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DESKTOP = { viewport: { width: 1440, height: 900 } };
const MOBILE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const FREEZE = `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important;caret-color:transparent!important}
  .elementor-popup-modal{display:none!important} iframe{visibility:hidden!important} .elementor-background-slideshow{visibility:hidden!important}`;

const scenarios = [
  {
    name: "desktop-mega-menu-hover",
    device: DESKTOP,
    path: "/",
    run: async (page) => {
      await page.hover(".e-n-menu-item:has(.e-n-menu-dropdown-icon) .e-n-menu-title");
      await sleep(800);
    },
  },
  {
    name: "desktop-sticky-header",
    device: DESKTOP,
    path: "/pbx-movil/",
    run: async (page) => {
      await page.mouse.wheel(0, 1400);
      await sleep(1200);
    },
  },
  {
    name: "mobile-menu-open",
    device: MOBILE,
    path: "/",
    run: async (page) => {
      await page.locator(".e-n-menu-toggle:visible").first().click();
      await sleep(800);
    },
  },
  {
    name: "mobile-submenu-open",
    device: MOBILE,
    path: "/",
    run: async (page) => {
      await page.locator(".e-n-menu-toggle:visible").first().click();
      await sleep(600);
      await page.locator(".e-n-menu-item:has(.e-n-menu-dropdown-icon) .e-n-menu-dropdown-icon:visible").first().click();
      await sleep(800);
    },
  },
  {
    name: "desktop-tabs-second",
    device: DESKTOP,
    path: "/lectura-inteligente-de-documentos/",
    run: async (page) => {
      const tab = page.locator(".e-n-tabs .e-n-tab-title:visible").nth(1);
      await tab.scrollIntoViewIfNeeded();
      await sleep(800);
      await tab.click();
      await sleep(800);
    },
  },
  {
    name: "desktop-whatsapp-fab-open",
    device: DESKTOP,
    path: "/chatbots/",
    run: async (page) => {
      await page.click("#egeiro-whfab-button");
      await sleep(800);
    },
  },
];

async function shoot(browser, base, s, file) {
  const ctx = await browser.newContext(s.device);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base + s.path, { waitUntil: "networkidle", timeout: 90000 });
  await sleep(1500);
  await page.addStyleTag({ content: FREEZE });
  await s.run(page);
  await page.addStyleTag({ content: FREEZE });
  await sleep(300);
  await page.screenshot({ path: file });
  await ctx.close();
  return errors;
}

function diff(a, b, out) {
  const A = PNG.sync.read(a);
  const B = PNG.sync.read(b);
  const d = new PNG({ width: A.width, height: A.height });
  const n = pixelmatch(A.data, B.data, d.data, A.width, A.height, { threshold: 0.15 });
  return fs.writeFile(out, PNG.sync.write(d)).then(() => +((n / (A.width * A.height)) * 100).toFixed(2));
}

async function formGuard(browser) {
  const ctx = await browser.newContext(DESKTOP);
  const page = await ctx.newPage();
  const posts = [];
  page.on("request", (r) => r.method() !== "GET" && posts.push(`${r.method()} ${r.url()}`));
  await page.goto(CLONE + "/", { waitUntil: "networkidle" });
  const form = page.locator("form.elementor-form").last();
  await form.scrollIntoViewIfNeeded();
  for (const input of await form.locator("input:visible, textarea:visible").all()) {
    const type = await input.getAttribute("type");
    if (type === "checkbox") await input.check().catch(() => {});
    else if (type === "email") await input.fill("prueba@example.com");
    else if (type === "tel") await input.fill("3000000000");
    else if (type === "number") await input.fill("0");
    else if (!["submit", "hidden", "button"].includes(type ?? "")) await input.fill("Prueba de interfaz");
  }
  for (const select of await form.locator("select:visible").all()) await select.selectOption({ index: 1 }).catch(() => {});
  await form.locator('button[type="submit"]').click();
  await sleep(1500);
  const notice = await page.locator(".clone-form-notice").first().textContent().catch(() => null);
  await ctx.close();
  return { notice, nonGetRequests: posts, pass: !!notice && posts.length === 0 };
}

await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: "/usr/local/bin/google-chrome" });
const results = {};
const selected = args.includes("--forms") ? [] : scenarios.filter((x) => !arg("--only") || x.name === arg("--only"));
for (const s of selected) {
  const live = path.join(OUT, `${s.name}-live.png`);
  const clone = path.join(OUT, `${s.name}-clone.png`);
  const liveErrors = await shoot(browser, LIVE, s, live);
  await sleep(4000);
  const cloneErrors = await shoot(browser, CLONE, s, clone);
  const mismatch = await diff(await fs.readFile(live), await fs.readFile(clone), path.join(OUT, `${s.name}-diff.png`));
  results[s.name] = { mismatchPct: mismatch, liveErrors, cloneErrors };
  console.log(s.name, `mismatch ${mismatch}%`, cloneErrors.length ? `clone errors: ${cloneErrors.join(" | ")}` : "");
}
results.formGuard = await formGuard(browser);
console.log("form guard:", JSON.stringify(results.formGuard));
await browser.close();
await fs.writeFile(path.join(OUT, "report.json"), JSON.stringify(results, null, 2));
