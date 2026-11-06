// SEO parity snapshot: compares, per URL, the HTML captured from the live site
// (capture/html) with the server-rendered HTML of the clone, plus status codes,
// redirects, X-Robots-Tag and the special files (robots, sitemaps, feeds, llms).
//
//   node scripts/test/seo.mjs --clone http://127.0.0.1:4319 --mode production
//   node scripts/test/seo.mjs --clone http://127.0.0.1:4318 --mode preview
//
// Writes artifacts/seo/<mode>.json and prints a summary. Exit code 1 on any
// unexpected difference.
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import * as cheerio from "cheerio";

const ROOT = path.resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const arg = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const CLONE = arg("--clone") ?? "http://127.0.0.1:4318";
const MODE = arg("--mode") ?? "preview";
const ORIGIN = "https://www.todoip.com";
const PREVIEW_ROBOTS = "noindex, nofollow";
const manifest = JSON.parse(await fs.readFile(path.join(ROOT, "capture/manifest.json"), "utf8"));

const abs = (u) => {
  if (!u) return u;
  try {
    const url = new URL(u.trim(), ORIGIN + "/");
    if (url.hostname === "todoip.com") url.hostname = "www.todoip.com";
    return url.href;
  } catch {
    return u.trim();
  }
};
const norm = (s) => (s ?? "").replace(/\s+/g, " ").trim();

function snapshot(html) {
  const $ = cheerio.load(html);
  const meta = (sel) => $(sel).map((_, e) => norm($(e).attr("content"))).get();
  const metaMap = {};
  $("head meta[property], head meta[name]").each((_, e) => {
    const k = $(e).attr("property") || $(e).attr("name");
    if (/^(og:|twitter:|description$|article:|author$)/.test(k)) (metaMap[k] ??= []).push(norm($(e).attr("content")));
  });
  const jsonld = $('script[type="application/ld+json"]')
    .map((_, e) => {
      try {
        return JSON.stringify(JSON.parse($(e).html()));
      } catch {
        return "INVALID";
      }
    })
    .get();
  return {
    title: norm($("head title").first().text()),
    robots: meta('head meta[name="robots"]'),
    canonical: $('head link[rel="canonical"]').map((_, e) => $(e).attr("href")).get(),
    alternates: $('head link[rel="alternate"][hreflang]').map((_, e) => `${$(e).attr("hreflang")} ${$(e).attr("href")}`).get(),
    meta: metaMap,
    jsonld,
    lang: $("html").attr("lang"),
    h1: $("body h1").map((_, e) => norm($(e).text())).get(),
    links: [...new Set($("body a[href]").map((_, e) => abs($(e).attr("href"))).get())].sort(),
    // Fragment targets only: script/style/link ids are WordPress asset handles, _R_ is React's.
    anchors: [...new Set($("body [id]").not("script, style, link, noscript, template, #_R_").map((_, e) => $(e).attr("id")).get())].sort(),
    images: [...new Set($("body img[src]").map((_, e) => abs($(e).attr("src"))).get())].sort(),
  };
}

const diffs = [];
const known = [];
const add = (url, field, expected, actual, note) => diffs.push({ url, field, expected, actual, ...(note ? { note } : {}) });
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const setDiff = (a, b) => ({ missing: a.filter((x) => !b.includes(x)), extra: b.filter((x) => !a.includes(x)) });

// fetch() cannot override Host; production mode is checked as www.todoip.com because
// any other host is deliberately served with X-Robots-Tag: noindex.
const HOST = arg("--host") ?? (MODE === "production" ? "www.todoip.com" : null);
function fetchClone(p, host = HOST) {
  const target = new URL(CLONE + p);
  return new Promise((resolve, reject) => {
    const req = http.request(target, { headers: host ? { host } : {} }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf8");
        resolve({ status: res.statusCode, headers: { get: (k) => res.headers[k.toLowerCase()] ?? null }, text: async () => body });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

const pages = Object.entries(manifest.pages).filter(([, v]) => v.file);
pages.push(["/esta-url-no-existe-clon-check/", { file: "html/__404.html", status: 404 }]);
const perUrl = {};
for (const [p, v] of pages) {
  const live = snapshot(await fs.readFile(path.join(ROOT, "capture", v.file), "utf8"));
  const res = await fetchClone(p);
  const body = await res.text();
  const clone = snapshot(body);
  const xrt = res.headers.get("x-robots-tag");
  const expectedStatus = p === "__404" ? 404 : v.status;
  perUrl[p] = { status: res.status, xRobotsTag: xrt, title: clone.title, robots: clone.robots, canonical: clone.canonical };
  if (res.status !== expectedStatus) add(p, "status", expectedStatus, res.status);

  if (MODE === "preview") {
    if (expectedStatus === 404 && same(clone.robots, ["noindex", PREVIEW_ROBOTS]))
      known.push({ url: p, field: "robots", note: "Next.js always injects <meta name=robots content=noindex> on 404 responses (alongside the preview directive)." });
    else if (!same(clone.robots, [PREVIEW_ROBOTS])) add(p, "robots(preview)", [PREVIEW_ROBOTS], clone.robots);
    if (xrt !== PREVIEW_ROBOTS) add(p, "x-robots-tag(preview)", PREVIEW_ROBOTS, xrt);
  } else {
    if (expectedStatus === 404 && same(clone.robots, ["noindex", ...live.robots]))
      known.push({ url: p, field: "robots", note: "Next.js always injects <meta name=robots content=noindex> on 404 responses; the original 'follow, noindex' is kept. Same effective directive." });
    else if (!same(live.robots, clone.robots)) add(p, "robots", live.robots, clone.robots);
    if (xrt) add(p, "x-robots-tag", null, xrt);
  }
  for (const f of ["title", "canonical", "alternates", "meta", "jsonld", "lang", "h1"]) {
    if (!same(live[f], clone[f])) add(p, f, live[f], clone[f]);
  }
  const honeypot = "https://www.todoip.com/imunify-bot-check";
  if (live.links.includes(honeypot) && !clone.links.includes(honeypot)) {
    known.push({ url: p, field: "links", note: "Hidden /imunify-bot-check honeypot injected by the live host's WAF is not reproduced." });
    live.links = live.links.filter((l) => l !== honeypot);
  }
  for (const f of ["links", "anchors", "images"]) {
    const d = setDiff(live[f], clone[f]);
    if (d.missing.length || d.extra.length) add(p, f, d.missing, d.extra, "expected=missing in clone, actual=extra in clone");
  }
}

// Redirects and status codes (paths only: the clone redirects within its own host).
const loc = (r) => {
  const l = r.headers.get("location");
  return l ? new URL(l, CLONE).pathname : null;
};
for (const [k, v] of Object.entries(manifest.special)) {
  if (k.startsWith("noslash:")) {
    const p = k.slice(8).replace(/\/$/, "");
    const r = await fetchClone(p);
    if (r.status !== 301 || loc(r) !== new URL(v.location).pathname) add(p, "redirect", `301 ${new URL(v.location).pathname}`, `${r.status} ${loc(r)}`);
  }
}
for (const [p, status, to] of [
  ["/sitemap.xml", 301, "/sitemap_index.xml"],
  ["/wp-sitemap.xml", 301, "/sitemap_index.xml"],
  ["/category-sitemap.xml", 404],
  ["/favicon.ico", 404],
  ["/author/", 404],
  ["/tag/whatsapp/", 404],
  ["/esta-url-no-existe/", 404],
]) {
  const r = await fetchClone(p);
  if (r.status !== status || (to && loc(r) !== to)) add(p, "status/redirect", `${status}${to ? " " + to : ""}`, `${r.status} ${loc(r) ?? ""}`.trim());
}

for (const p of ["/", "/pbx-movil/"]) {
  const r = await fetchClone(p, "todoip.com");
  const l = r.headers.get("location");
  if (r.status !== 301 || l !== `https://www.todoip.com${p}`) add(`todoip.com${p}`, "redirect(non-www)", `301 https://www.todoip.com${p}`, `${r.status} ${l}`);
}

// Special files: byte equality with the capture (robots.txt differs on purpose in preview).
const files = {
  "/robots.txt": "_robots.txt",
  "/llms.txt": "_llms.txt",
  "/sitemap_index.xml": "_sitemap_index.xml",
  "/page-sitemap.xml": "_page-sitemap.xml",
  "/post-sitemap.xml": "_post-sitemap.xml",
  "/main-sitemap.xsl": "_main-sitemap.xsl",
  "/feed/": "_feed_",
  "/comments/feed/": "_comments_feed_",
};
for (const [p, v] of Object.entries(manifest.feeds ?? {})) if (v.file) files[p] = v.file;
for (const [p, f] of Object.entries(files)) {
  const expected = await fs.readFile(path.join(ROOT, "capture/files", f), "utf8");
  const r = await fetchClone(p);
  const body = await r.text();
  if (r.status !== 200) add(p, "status", 200, r.status);
  if (p === "/robots.txt" && MODE === "preview") {
    if (!/Disallow: \/\s*$/m.test(body)) add(p, "robots.txt(preview)", "Disallow: /", body);
  } else if (body !== expected) add(p, "body", `${expected.length} bytes`, `${body.length} bytes`);
  if (/sitemap|xsl/.test(p) && !/noindex/.test(r.headers.get("x-robots-tag") ?? "")) add(p, "x-robots-tag", "noindex", r.headers.get("x-robots-tag"));
}

await fs.mkdir(path.join(ROOT, "artifacts/seo"), { recursive: true });
await fs.writeFile(path.join(ROOT, `artifacts/seo/${MODE}.json`), JSON.stringify({ clone: CLONE, mode: MODE, perUrl, diffs, known }, null, 2));
const byField = diffs.reduce((m, d) => ((m[d.field] = (m[d.field] ?? 0) + 1), m), {});
console.log(`mode=${MODE} urls=${pages.length} diffs=${diffs.length} known=${known.length}`, byField);
const knownNotes = known.reduce((m, k) => ((m[k.note] = (m[k.note] ?? 0) + 1), m), {});
for (const [n, c] of Object.entries(knownNotes)) console.log(` ~ known (${c} URL${c > 1 ? "s" : ""}): ${n}`);
for (const d of diffs.slice(0, 40)) console.log(" -", d.url, d.field, String(JSON.stringify(d.expected)).slice(0, 160), "=>", String(JSON.stringify(d.actual)).slice(0, 160));
process.exit(diffs.length ? 1 : 0);
