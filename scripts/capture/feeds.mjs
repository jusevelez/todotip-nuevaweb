// Downloads, slowly and with public GETs only, every RSS feed the captured pages
// advertise in <head> (<link rel="alternate" type="application/rss+xml">) that is
// not already captured: per-post comment feeds, category feeds, author feed.
// Saves them in capture/files/feeds/ and lists them in capture/manifest.json (feeds).
import fs from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const ROOT = path.resolve(import.meta.dirname, "../..");
const MANIFEST = path.join(ROOT, "capture/manifest.json");
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ALREADY = new Set(["/feed/", "/comments/feed/"]);

const m = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
const feeds = new Set();
for (const v of Object.values(m.pages)) {
  if (!v.file) continue;
  const $ = cheerio.load(await fs.readFile(path.join(ROOT, "capture", v.file), "utf8"));
  $('head link[rel="alternate"][type="application/rss+xml"]').each((_, e) => {
    const u = new URL($(e).attr("href"), "https://www.todoip.com/");
    if (u.hostname.endsWith("todoip.com") && !ALREADY.has(u.pathname)) feeds.add(u.pathname);
  });
}

await fs.mkdir(path.join(ROOT, "capture/files/feeds"), { recursive: true });
m.feeds ??= {};
for (const p of [...feeds].sort()) {
  if (m.feeds[p]?.status === 200) continue;
  let res;
  for (let i = 0; i < 6; i++) {
    res = await fetch("https://www.todoip.com" + p, { redirect: "manual", headers: { "user-agent": UA } });
    if (res.status !== 429) break;
    await sleep(15000 * (i + 1));
  }
  const file = `feeds/${p.replace(/^\/|\/$/g, "").replace(/\//g, "__")}.xml`;
  const body = await res.text();
  m.feeds[p] = { status: res.status, contentType: res.headers.get("content-type"), file: res.status === 200 ? file : null };
  if (res.status === 200) await fs.writeFile(path.join(ROOT, "capture/files", file), body);
  console.log(res.status, p);
  await fs.writeFile(MANIFEST, JSON.stringify(m, null, 2));
  await sleep(4000);
}
