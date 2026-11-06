// Link/asset checker for the clone: every internal href/src/srcset/stylesheet in
// the server HTML of each URL, plus url() references inside same-host stylesheets,
// must answer 200 (or a 301 to a URL that answers 200). External URLs are only
// listed, never requested.
//
//   node scripts/test/links.mjs --clone http://127.0.0.1:4319
import fs from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const ROOT = path.resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const CLONE = args.includes("--clone") ? args[args.indexOf("--clone") + 1] : "http://127.0.0.1:4318";
const manifest = JSON.parse(await fs.readFile(path.join(ROOT, "capture/manifest.json"), "utf8"));
// Already broken on the live site (404 there too); kept as-is and reported.
const LIVE_BROKEN = new Set(manifest.liveBrokenAssets ?? [
  "/wp-content/uploads/2020/09/tabla-1.png",
  "/wp-content/uploads/2020/09/tabla-2.png",
  "/wp-content/uploads/2020/09/TABLA-4.png",
  "/wp-content/uploads/2020/09/Tabla-3.png",
  // Relative link inside the /salud/ and /turismo/ landings; 404 on the live site.
  "/salud/landing_page_optimizada_todoip_bots.html",
  "/turismo/landing_page_optimizada_todoip_bots.html",
]);
// WordPress login/password recovery for the telephony portal: not migrated (WP auth backend).
const BACKEND = [/^\/wp-login\.php/];

const internal = (u, base) => {
  try {
    const url = new URL(u.trim(), base);
    if (!["www.todoip.com", "todoip.com", new URL(CLONE).hostname].includes(url.hostname) || !/^https?:$/.test(url.protocol)) return null;
    return url.pathname + url.search;
  } catch {
    return null;
  }
};

const refs = new Map(); // path -> Set(source page)
const external = new Map();
const note = (map, key, from) => (map.get(key) ?? map.set(key, new Set()).get(key)).add(from);

const pages = Object.keys(manifest.pages).filter((p) => manifest.pages[p].file);
for (const p of pages) {
  const html = await (await fetch(CLONE + p)).text();
  const $ = cheerio.load(html);
  const urls = [];
  $("a[href], link[href]").each((_, e) => urls.push($(e).attr("href")));
  $("img[src], source[src], script[src], iframe[src], video[src]").each((_, e) => urls.push($(e).attr("src")));
  $("img[srcset], source[srcset]").each((_, e) => $(e).attr("srcset").split(",").forEach((c) => urls.push(c.trim().split(/\s+/)[0])));
  $("[data-bg], [data-src]").each((_, e) => urls.push($(e).attr("data-bg") || $(e).attr("data-src")));
  $("[style*='url(']").each((_, e) => {
    for (const m of ($(e).attr("style") ?? "").matchAll(/url\(\s*['"]?([^'")]+)/g)) urls.push(m[1]);
  });
  for (const u of urls) {
    if (!u || /^(#|mailto:|tel:|javascript:|data:|whatsapp:)/i.test(u)) continue;
    const i = internal(u, CLONE + p);
    if (i) note(refs, i.split("#")[0], p);
    else if (/^https?:/i.test(u) || u.startsWith("//")) note(external, new URL(u, "https://x").host, p);
  }
}

// url() inside same-host stylesheets
for (const href of [...refs.keys()].filter((r) => /\.css(\?|$)/.test(r))) {
  const css = await (await fetch(CLONE + href)).text();
  for (const m of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    if (/^(data:|#)/.test(m[1])) continue;
    const i = internal(m[1], CLONE + href);
    if (i) note(refs, i.split("#")[0], href);
    else note(external, new URL(m[1], "https://x").host, href);
  }
}

const broken = [];
const knownBroken = [];
const queue = [...refs.keys()];
const CONCURRENCY = 16;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const r = queue.shift();
      let res = await fetch(CLONE + r, { redirect: "manual" });
      let status = `${res.status}`;
      if (res.status === 301) {
        const to = new URL(res.headers.get("location"), CLONE).pathname;
        res = await fetch(CLONE + to, { redirect: "manual" });
        status = `301->${res.status}`;
      }
      if (res.status !== 200) (LIVE_BROKEN.has(r) || BACKEND.some((b) => b.test(r)) ? knownBroken : broken).push({ url: r, status, from: [...refs.get(r)].slice(0, 3) });
    }
  }),
);

const out = {
  clone: CLONE,
  checked: refs.size,
  broken,
  knownBroken,
  externalHosts: Object.fromEntries([...external].map(([h, s]) => [h, s.size]).sort((a, b) => b[1] - a[1])),
};
await fs.mkdir(path.join(ROOT, "artifacts/links"), { recursive: true });
await fs.writeFile(path.join(ROOT, "artifacts/links/report.json"), JSON.stringify(out, null, 2));
console.log(`checked ${refs.size} internal URLs/assets across ${pages.length} pages; broken ${broken.length}; known (404 live too, or WP backend) ${knownBroken.length}`);
for (const b of broken) console.log(" x", b.status, b.url, "from", b.from.join(", "));
for (const b of knownBroken) console.log(" ~ known:", b.url);
console.log("external hosts (not requested):", out.externalHosts);
process.exit(broken.length ? 1 : 0);
