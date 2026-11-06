// Public, read-only capture of www.todoip.com: HTML of every reachable page,
// response status/headers, and every same-host asset referenced by HTML/CSS.
// Only GET requests; never posts forms, never touches /wp-admin or /wp-json writes.
import fs from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const ORIGIN = "https://www.todoip.com";
const ROOT = path.resolve(import.meta.dirname, "../..");
const CAPTURE = path.join(ROOT, "capture");
const PUBLIC = path.join(ROOT, "public");
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const SEEDS = [
  "/",
  "/bots/",
  "/salud/",
  "/cobranzas/",
  "/turismo/",
  "/aviso-de-privacidad/",
  "/registro-exitoso/",
  "/reportes-telefonia/",
  "/blog/",
];

const EXCLUDE = [
  /^\/wp-admin/,
  /^\/wp-json/,
  /^\/wp-login/,
  /^\/xmlrpc/,
  /\/feed\/?$/,
  /^\/wp-content\//,
  /^\/wp-includes\//,
  /^\/imunify/,
  /^\/cdn-cgi\//,
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, opts = {}) {
  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(url, {
        redirect: "manual",
        headers: { "user-agent": UA, ...(opts.headers || {}) },
      });
      return res;
    } catch (e) {
      await sleep(1000 * 2 ** i);
    }
  }
  throw new Error("fetch failed " + url);
}

function slugFor(p) {
  if (p === "/") return "home";
  return p.replace(/^\/|\/$/g, "").replace(/\//g, "__");
}

function normalizePagePath(href, base) {
  let u;
  try {
    u = new URL(href, base);
  } catch {
    return null;
  }
  if (!/^(www\.)?todoip\.com$/.test(u.hostname)) return null;
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  let p = decodeURIComponent(u.pathname);
  if (EXCLUDE.some((r) => r.test(p))) return null;
  if (/\.[a-z0-9]{2,5}$/i.test(p)) return null;
  if (!p.endsWith("/")) p += "/";
  return p;
}

async function sitemapPaths() {
  const out = [];
  for (const sm of ["/page-sitemap.xml", "/post-sitemap.xml"]) {
    const res = await get(ORIGIN + sm);
    const xml = await res.text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) out.push(new URL(m[1]).pathname);
  }
  for (const t of ["pages", "posts"]) {
    const res = await get(`${ORIGIN}/wp-json/wp/v2/${t}?per_page=100&_fields=link`);
    if (res.ok) for (const x of await res.json()) out.push(new URL(x.link).pathname);
  }
  return out;
}

const assetUrls = new Set();

function collectAssetsFromHtml($, base) {
  const add = (v) => {
    if (!v) return;
    try {
      const u = new URL(v.trim(), base);
      if (/^(www\.)?todoip\.com$/.test(u.hostname)) assetUrls.add(u.origin.replace("//todoip", "//www.todoip") + u.pathname);
    } catch {}
  };
  const addSrcset = (v) => v && v.split(",").forEach((part) => add(part.trim().split(/\s+/)[0]));
  $("link[href]").each((_, el) => {
    const rel = ($(el).attr("rel") || "").toLowerCase();
    if (/stylesheet|icon|preload|apple-touch-icon/.test(rel)) add($(el).attr("href"));
  });
  $("img, source, video, audio, iframe, script, input[type=image], embed").each((_, el) => {
    const $el = $(el);
    if (el.tagName !== "script" && el.tagName !== "iframe") add($el.attr("src"));
    if (el.tagName === "script") {
      const s = $el.attr("src");
      if (s && /wp-content\/(plugins\/(egeiro|products-addon))/.test(s)) add(s);
    }
    add($el.attr("data-src"));
    add($el.attr("poster"));
    addSrcset($el.attr("srcset"));
    addSrcset($el.attr("data-srcset"));
  });
  $("[style]").each((_, el) => {
    for (const m of ($(el).attr("style") || "").matchAll(/url\((['"]?)([^'")]+)\1\)/g)) add(m[2]);
  });
  $("[data-settings]").each((_, el) => {
    const s = $(el).attr("data-settings") || "";
    for (const m of s.matchAll(/https?:\\?\/\\?\/(?:www\.)?todoip\.com[^"]+?\.(?:webp|png|jpe?g|svg|gif|mp4|webm)/g))
      add(m[0].replace(/\\\//g, "/"));
  });
  $("meta[property='og:image'], meta[name='twitter:image']").each((_, el) => add($(el).attr("content")));
  $("style").each((_, el) => {
    for (const m of ($(el).html() || "").matchAll(/url\((['"]?)([^'")]+)\1\)/g)) add(m[2]);
  });
}

async function crawlPages() {
  const queue = [...new Set([...SEEDS, ...(await sitemapPaths())])];
  const seen = new Set();
  const manifest = {};
  await fs.mkdir(path.join(CAPTURE, "html"), { recursive: true });
  while (queue.length) {
    const p = queue.shift();
    if (seen.has(p)) continue;
    seen.add(p);
    const res = await get(ORIGIN + encodeURI(p));
    const headers = Object.fromEntries(res.headers.entries());
    const entry = { path: p, status: res.status, headers };
    if (res.status >= 300 && res.status < 400) {
      entry.location = res.headers.get("location");
      const next = normalizePagePath(entry.location, ORIGIN);
      if (next && !seen.has(next)) queue.push(next);
      manifest[p] = entry;
      console.log(res.status, p, "->", entry.location);
      continue;
    }
    const html = await res.text();
    const slug = slugFor(p);
    entry.file = `html/${slug}.html`;
    await fs.writeFile(path.join(CAPTURE, entry.file), html);
    manifest[p] = entry;
    console.log(res.status, p, html.length);
    if (res.status !== 200) continue;
    const $ = cheerio.load(html);
    collectAssetsFromHtml($, ORIGIN + p);
    $("a[href]").each((_, el) => {
      const n = normalizePagePath($(el).attr("href"), ORIGIN + p);
      if (n && !seen.has(n) && !queue.includes(n)) queue.push(n);
    });
    await sleep(250);
  }
  return manifest;
}

async function captureSpecial(manifest) {
  // Redirect + status behaviour samples (no-slash, non-www, 404) for parity tests.
  const samples = {};
  const probe = async (label, url) => {
    const res = await get(url);
    samples[label] = {
      url,
      status: res.status,
      location: res.headers.get("location"),
      xRobotsTag: res.headers.get("x-robots-tag"),
      contentType: res.headers.get("content-type"),
    };
    if (res.status === 404 && label === "404") {
      const html = await res.text();
      await fs.writeFile(path.join(CAPTURE, "html/__404.html"), html);
      collectAssetsFromHtml(cheerio.load(html), url);
    }
  };
  await probe("nonwww_home", "https://todoip.com/");
  await probe("nonwww_path", "https://todoip.com/pbx-movil/");
  await probe("http_home", "http://www.todoip.com/");
  await probe("404", ORIGIN + "/esta-url-no-existe-clon-check/");
  for (const p of Object.keys(manifest)) {
    if (p !== "/" && manifest[p].status === 200) await probe("noslash:" + p, ORIGIN + p.replace(/\/$/, ""));
  }
  for (const f of [
    "/robots.txt",
    "/llms.txt",
    "/sitemap_index.xml",
    "/sitemap.xml",
    "/page-sitemap.xml",
    "/post-sitemap.xml",
    "/category-sitemap.xml",
    "/main-sitemap.xsl",
    "/feed/",
    "/favicon.ico",
    "/wp-sitemap.xml",
    "/author/admin/",
    "/category/uncategorized/",
  ]) {
    const res = await get(ORIGIN + f);
    const body = Buffer.from(await res.arrayBuffer());
    samples["file:" + f] = { url: ORIGIN + f, status: res.status, location: res.headers.get("location"), contentType: res.headers.get("content-type") };
    if (res.status === 200) {
      await fs.mkdir(path.join(CAPTURE, "files"), { recursive: true });
      await fs.writeFile(path.join(CAPTURE, "files", f.replace(/\//g, "_") || "_"), body);
    }
  }
  return samples;
}

async function downloadAssets() {
  const done = new Set();
  const queue = [...assetUrls];
  const failed = [];
  while (queue.length) {
    const batch = queue.splice(0, 8);
    await Promise.all(
      batch.map(async (url) => {
        if (done.has(url)) return;
        done.add(url);
        const u = new URL(url);
        const local = path.join(PUBLIC, decodeURIComponent(u.pathname));
        let buf;
        try {
          buf = await fs.readFile(local);
        } catch {
          const res = await get(url);
          if (res.status !== 200) {
            failed.push({ url, status: res.status });
            return;
          }
          buf = Buffer.from(await res.arrayBuffer());
          await fs.mkdir(path.dirname(local), { recursive: true });
          await fs.writeFile(local, buf);
        }
        if (local.endsWith(".css")) {
          const css = buf.toString("utf8");
          for (const m of css.matchAll(/url\((['"]?)([^'")]+)\1\)|@import\s+(['"])([^'"]+)\3/g)) {
            const ref = m[2] || m[4];
            if (!ref || ref.startsWith("data:")) continue;
            try {
              const r = new URL(ref, url);
              if (/^(www\.)?todoip\.com$/.test(r.hostname)) {
                const abs = "https://www.todoip.com" + r.pathname;
                if (!done.has(abs)) queue.push(abs);
              }
            } catch {}
          }
        }
      }),
    );
  }
  return { count: done.size, failed };
}

const manifest = await crawlPages();
const special = await captureSpecial(manifest);
const assets = await downloadAssets();
await fs.writeFile(
  path.join(CAPTURE, "manifest.json"),
  JSON.stringify({ capturedAt: new Date().toISOString(), origin: ORIGIN, pages: manifest, special, assets }, null, 2),
);
console.log("pages", Object.keys(manifest).length, "assets", assets.count, "failed", assets.failed.length);
