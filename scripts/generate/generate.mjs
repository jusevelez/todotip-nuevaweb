// Generates Next.js source from the public capture in /capture:
//  - src/generated/wp/pages/*.tsx      one server component per WordPress URL
//  - src/generated/wp/templates/*.tsx  shared Elementor documents (header/footer/popup…)
//  - src/generated/wp/routes.ts        URL -> head metadata + lazy page component
//  - src/app/(landing-*)/…             the four static ads landings (own root layouts)
//  - capture/report/generate-report.json  what was dropped/rewritten (for review)
import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import * as cheerio from "cheerio";
import { toJsx, significantChildren, signature, textOf } from "./jsx.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const CAP = path.join(ROOT, "capture");
const OUT = path.join(ROOT, "src/generated/wp");
const manifest = JSON.parse(await fs.readFile(path.join(CAP, "manifest.json"), "utf8"));

const LANDINGS = ["/bots/", "/salud/", "/cobranzas/", "/turismo/"];
const ABS_RE = /(?:https?:)?(\\?\/\\?\/)(?:www\.)?todoip\.com(?=[\\/"'?#\s)]|$)/g;

const rewrite = (v) => {
  if (typeof v !== "string") return v;
  const out = v.replace(ABS_RE, "");
  return out === "" && v !== "" ? "/" : out;
};
const rewriteCss = (css) => css.replace(ABS_RE, "");
const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 10);
const pascal = (s) =>
  s
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^./, (c) => c.toUpperCase());

const report = { dropped: {}, droppedScripts: {}, headDropped: {}, pages: {} };
const bodyStyles = new Map();

function makeCtx() {
  return {
    dropped: [],
    droppedScripts: [],
    rewrite,
    rewriteCss,
    usesPv: false,
    registerStyle(css) {
      const id = "wpb-" + hash(css);
      bodyStyles.set(id, css);
      return id;
    },
  };
}

function headData($, pagePath) {
  const head = [];
  const stylesheets = [];
  const inlineStyles = [];
  const dropped = [];
  let title = $("head > title").first().text();
  let robots = null;
  $("head")
    .children()
    .each((_, el) => {
      const $el = $(el);
      const tag = el.name;
      const a = { ...el.attribs };
      if (tag === "title") return;
      if (tag === "meta") {
        if (a.charset || a.name === "viewport") return;
        if (a.name === "generator") return dropped.push(`meta generator=${a.content}`);
        if (a.name === "robots") {
          robots = a.content;
          return;
        }
        head.push({ tag: "meta", attrs: a });
        return;
      }
      if (tag === "link") {
        const rel = (a.rel || "").toLowerCase();
        if (rel === "stylesheet") {
          const href = a.href.startsWith("//") ? "https:" + a.href : a.href;
          const u = new URL(href, "https://www.todoip.com" + pagePath);
          const local = /^(www\.)?todoip\.com$/.test(u.hostname);
          stylesheets.push({ id: a.id || null, href: local ? u.pathname : u.href, media: a.media && a.media !== "all" ? a.media : null });
          return;
        }
        if (rel === "https://api.w.org/" || rel === "edituri" || rel === "shortlink" || rel === "profile")
          return dropped.push(`link rel=${rel} ${a.href}`);
        if (rel === "alternate" && /oembed|application\/json/.test(a.type || ""))
          return dropped.push(`link alternate ${a.type} ${a.href}`);
        head.push({ tag: "link", attrs: a });
        return;
      }
      if (tag === "script") {
        if (a.type === "application/ld+json") head.push({ tag: "jsonld", attrs: { class: a.class || null }, text: $el.html() });
        else dropped.push(`script ${a.id || ""} ${a.src || ($el.html() || "").trim().slice(0, 80)}`);
        return;
      }
      if (tag === "style") {
        const css = rewriteCss($el.html() || "");
        const s = { id: a.id || "wph-" + hash(css), css };
        inlineStyles.push(s);
        stylesheets.push({ inline: s.id + ":" + hash(css) });
        return;
      }
      if (tag === "noscript") return dropped.push("noscript(head)");
      dropped.push(`${tag}`);
    });
  return { title, robots, head, stylesheets, inlineStyles, dropped };
}

function bodyKey(el) {
  const a = el.attribs || {};
  if (a["data-elementor-type"] && ["header", "footer", "popup"].includes(a["data-elementor-type"]))
    return `${a["data-elementor-type"]}-${a["data-elementor-id"]}`;
  if (a.id && !/^(content|main)$/.test(a.id)) return `id-${a.id}`;
  if (el.name === "a" && /skip-link/.test(a.class || "")) return "skip-link";
  return null;
}

// ---------- WordPress pages ----------
const wpPaths = Object.entries(manifest.pages)
  .filter(([p, v]) => v.status === 200 && v.file && !LANDINGS.includes(p))
  .map(([p]) => p);
const pages = [...wpPaths.map((p) => ({ path: p, file: manifest.pages[p].file })), { path: "__404", file: "html/__404.html" }];

const parsed = [];
for (const pg of pages) {
  const html = await fs.readFile(path.join(CAP, pg.file), "utf8");
  const $ = cheerio.load(html);
  const body = $("body")[0];
  const kids = significantChildren(body, null).filter((c) => !(c.type === "text" && !c.data.trim()));
  parsed.push({ ...pg, $, head: headData($, pg.path), body, kids, htmlAttrs: { ...$("html")[0].attribs } });
}

// Group top-level body elements into shared templates by key + structure signature.
const groups = new Map();
for (const pg of parsed) {
  pg.segments = pg.kids.map((el) => {
    const key = el.type === "tag" ? bodyKey(el) : null;
    if (!key) return { local: el };
    const sig = hash(signature(el));
    const gk = `${key}::${sig}`;
    if (!groups.has(gk)) groups.set(gk, { key, sig, items: [] });
    groups.get(gk).items.push({ path: pg.path, el });
    return { group: gk };
  });
}

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(path.join(OUT, "templates"), { recursive: true });
await fs.mkdir(path.join(OUT, "pages"), { recursive: true });

const header = (usesPv, usesStyle = false) =>
  `// AUTO-GENERATED by scripts/generate/generate.mjs from the public capture. Do not edit by hand.\n/* eslint-disable */\n${usesStyle ? 'import type { CSSProperties } from "react";\n' : ""}${usesPv ? 'import { pv } from "@/lib/pv";\n' : ""}`;

const templateNames = new Map();
const keyCounts = {};
for (const [gk, g] of groups) {
  // Single-use groups are emitted inline in the page instead.
  if (g.items.length < 2) continue;
  keyCounts[g.key] = (keyCounts[g.key] || 0) + 1;
  const name = pascal(g.key) + (keyCounts[g.key] > 1 ? `V${keyCounts[g.key]}` : "");
  templateNames.set(gk, name);
  const ctx = makeCtx();
  const jsx = toJsx(
    g.items.map((i) => i.el),
    g.items.map((i) => i.path),
    ctx,
    "    ",
  );
  const src = `${header(ctx.usesPv, ctx.usesStyle)}\nexport default function ${name}({ path }: { path: string }) {\n  ${ctx.usesPv ? "" : "void path;\n  "}return (\n    ${jsx}\n  );\n}\n`;
  await fs.writeFile(path.join(OUT, "templates", `${name}.tsx`), src);
  for (const d of ctx.dropped) report.dropped[d] = (report.dropped[d] || 0) + 1;
  for (const d of ctx.droppedScripts) report.droppedScripts[d] = (report.droppedScripts[d] || 0) + 1;
}

const routes = [];
const stylesheetSets = new Map();
const inlineStyleTable = new Map();
for (const pg of parsed) {
  const slug = pg.path === "/" ? "home" : pg.path === "__404" ? "not-found" : pg.path.replace(/^\/|\/$/g, "").replace(/\//g, "--");
  const comp = "Page" + pascal(slug);
  const ctx = makeCtx();
  const imports = new Set();
  const parts = pg.segments.map((s) => {
    if (s.group && templateNames.has(s.group)) {
      const n = templateNames.get(s.group);
      imports.add(n);
      return `<${n} path={path} />`;
    }
    const el = s.local || groups.get(s.group).items.find((i) => i.path === pg.path).el;
    return toJsx([el], [pg.path], ctx, "      ");
  });
  const src =
    header(ctx.usesPv, ctx.usesStyle) +
    [...imports].map((n) => `import ${n} from "../templates/${n}";\n`).join("") +
    `\nexport default function ${comp}({ path }: { path: string }) {\n  ${ctx.usesPv ? "" : "void path;\n  "}return (\n    <>\n      ${parts.join("\n      ")}\n    </>\n  );\n}\n`;
  await fs.writeFile(path.join(OUT, "pages", `${slug}.tsx`), src);
  for (const d of ctx.dropped) report.dropped[d] = (report.dropped[d] || 0) + 1;
  for (const d of ctx.droppedScripts) report.droppedScripts[d] = (report.droppedScripts[d] || 0) + 1;
  for (const d of pg.head.dropped) report.headDropped[d.replace(/\/\d+$|url=[^&]+/g, "…")] = (report.headDropped[d] || 0) + 1;

  const sheetKey = JSON.stringify(pg.head.stylesheets);
  if (!stylesheetSets.has(sheetKey)) stylesheetSets.set(sheetKey, `s${stylesheetSets.size}`);
  for (const s of pg.head.inlineStyles) inlineStyleTable.set(s.id + ":" + hash(s.css), s);
  routes.push({
    path: pg.path,
    slug,
    comp,
    meta: {
      title: pg.head.title,
      robots: pg.head.robots,
      htmlAttrs: pg.htmlAttrs,
      bodyClass: pg.$("body").attr("class") || "",
      head: pg.head.head,
      stylesheets: stylesheetSets.get(sheetKey),
    },
  });
  report.pages[pg.path] = { slug, title: pg.head.title, robots: pg.head.robots };
}

const data = {
  stylesheetSets: Object.fromEntries([...stylesheetSets].map(([k, v]) => [v, JSON.parse(k)])),
  inlineStyles: Object.fromEntries(inlineStyleTable),
  bodyStyles: Object.fromEntries(bodyStyles),
  routes: Object.fromEntries(routes.map((r) => [r.path, { slug: r.slug, ...r.meta }])),
};
await fs.writeFile(path.join(OUT, "data.json"), JSON.stringify(data));
await fs.writeFile(
  path.join(OUT, "routes.ts"),
  `// AUTO-GENERATED by scripts/generate/generate.mjs. Do not edit by hand.\nimport type { ComponentType } from "react";\n\nexport const pageLoaders: Record<string, () => Promise<{ default: ComponentType<{ path: string }> }>> = {\n${routes
    .map((r) => `  ${JSON.stringify(r.path)}: () => import("./pages/${r.slug}"),`)
    .join("\n")}\n};\n`,
);

// ---------- Static ads landings ----------
for (const p of LANDINGS) {
  const name = p.replace(/\//g, "");
  const html = await fs.readFile(path.join(CAP, manifest.pages[p].file), "utf8");
  const $ = cheerio.load(html);
  const dir = path.join(ROOT, "src/app", `(landing-${name})`, name);
  await fs.mkdir(dir, { recursive: true });
  const css = [];
  $("head style, body style").each((_, el) => css.push(rewriteCss($(el).html() || "")));
  const hd = headData($, p);
  const ctx = makeCtx();
  const body = $("body")[0];
  const kids = significantChildren(body, ctx).filter((c) => !(c.type === "text" && !c.data.trim()) && c.name !== "style");
  const jsx = kids.map((k) => toJsx([k], [p], ctx, "      ")).join("\n      ");
  await fs.writeFile(path.join(dir, "landing.css"), `/* Extracted verbatim from the original ${p} inline <style>. */\n${css.join("\n")}`);
  await fs.writeFile(
    path.join(dir, "LandingBody.tsx"),
    `${header(false, ctx.usesStyle)}\nexport default function LandingBody() {\n  return (\n    <>\n      ${jsx}\n    </>\n  );\n}\n`,
  );
  await fs.writeFile(
    path.join(dir, "landing.json"),
    JSON.stringify(
      {
        path: p,
        title: hd.title,
        robots: hd.robots,
        htmlAttrs: { ...$("html")[0].attribs },
        bodyAttrs: { ...$("body")[0].attribs },
        head: hd.head,
        stylesheets: hd.stylesheets,
      },
      null,
      2,
    ),
  );
  await fs.writeFile(
    path.join(dir, "layout.tsx"),
    `${header(false).replace("/* eslint-disable */\n", "")}import type { ReactNode } from "react";\nimport LandingDocument, { type LandingData } from "@/components/landing/LandingDocument";\nimport data from "./landing.json";\nimport "./landing.css";\n\nexport default function Layout({ children }: { children: ReactNode }) {\n  return <LandingDocument data={data as LandingData}>{children}</LandingDocument>;\n}\n`,
  );
  await fs.writeFile(
    path.join(dir, "page.tsx"),
    `${header(false).replace("/* eslint-disable */\n", "")}import LandingBody from "./LandingBody";\n\nexport default function Page() {\n  return <LandingBody />;\n}\n`,
  );
  report.pages[p] = { slug: name, title: hd.title, robots: hd.robots, landing: true, droppedScripts: ctx.droppedScripts, headDropped: hd.dropped };
  for (const d of ctx.dropped) report.dropped[d] = (report.dropped[d] || 0) + 1;
}

// ---------- Verbatim SEO files (sitemaps, xsl, robots, llms, feeds) ----------
const FILES = {
  robotsTxt: "_robots.txt",
  llmsTxt: "_llms.txt",
  sitemapIndex: "_sitemap_index.xml",
  pageSitemap: "_page-sitemap.xml",
  postSitemap: "_post-sitemap.xml",
  mainSitemapXsl: "_main-sitemap.xsl",
  feed: "_feed_",
  commentsFeed: "_comments_feed_",
};
const filesSrc = Object.entries(FILES)
  .map(([k, f]) => `export const ${k} = ${JSON.stringify(readFileSync(path.join(CAP, "files", f), "utf8"))};`)
  .join("\n");
await fs.writeFile(
  path.join(ROOT, "src/generated/seo-files.ts"),
  `// AUTO-GENERATED by scripts/generate/generate.mjs: verbatim copies of the live files.\n${filesSrc}\n`,
);

// Per-post comment feeds, category feeds and the author feed advertised in <head>.
const feedEntries = Object.entries(manifest.feeds ?? {})
  .filter(([, v]) => v.status === 200 && v.file)
  .map(([p, v]) => [p, readFileSync(path.join(CAP, "files", v.file), "utf8")]);
await fs.writeFile(
  path.join(ROOT, "src/generated/feeds.ts"),
  `// AUTO-GENERATED by scripts/generate/generate.mjs: verbatim copies of the live RSS feeds.\nexport const feeds: Record<string, string> = ${JSON.stringify(Object.fromEntries(feedEntries), null, 1)};\n`,
);

await fs.mkdir(path.join(CAP, "report"), { recursive: true });
await fs.writeFile(path.join(CAP, "report/generate-report.json"), JSON.stringify(report, null, 2));
console.log(
  "templates:",
  [...templateNames.values()].join(", "),
  "\nwp pages:",
  routes.length,
  "stylesheet sets:",
  stylesheetSets.size,
  "inline head styles:",
  inlineStyleTable.size,
  "body styles:",
  bodyStyles.size,
);
