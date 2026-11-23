import data from "@/generated/wp/data.json";
import { condicionesHtml, privacidadHtml } from "@/content/softphone/html";
import type { HeadItem, WpRoute } from "@/lib/wp-data";

/**
 * Public legal pages for the TodoIP Softphone app.
 *
 * They are not part of the TodoIP capture. scripts/generate/generate.mjs
 * wipes src/generated/wp, so the HTML and this registry live outside it and
 * are merged in src/lib/wp-data.ts. The document chrome (stylesheets, body
 * class, header and footer) is the one captured for /aviso-de-privacidad/.
 */

const CHROME_PATH = "/aviso-de-privacidad/";

const INDEX_ROBOTS =
  "follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large";

/** Head tags that belong to the privacy notice and must not be copied. */
const DROP_META = new Set([
  "description",
  "og:locale",
  "og:type",
  "og:title",
  "og:description",
  "og:url",
  "og:site_name",
  "og:updated_time",
  "og:image",
  "og:image:secure_url",
  "og:image:alt",
  "article:published_time",
  "article:modified_time",
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
  "twitter:label1",
  "twitter:data1",
]);

export type SoftphonePage = {
  path: string;
  title: string;
  html: string;
};

export const softphonePages: readonly SoftphonePage[] = [
  {
    path: "/softphone/condiciones/",
    title: "Condiciones de uso – TodoIP Softphone",
    html: condicionesHtml,
  },
  {
    path: "/softphone/privacidad/",
    title: "Política de privacidad – TodoIP Softphone",
    html: privacidadHtml,
  },
];

const byPath = new Map(softphonePages.map((page) => [page.path, page]));

export function isSoftphonePath(path: string): boolean {
  return byPath.has(path);
}

export function softphonePage(path: string): SoftphonePage | undefined {
  return byPath.get(path);
}

function meta(attrs: Record<string, string>): HeadItem {
  return { tag: "meta", attrs };
}

/** Second paragraph: the summary that follows the “última actualización” line. */
function summary(html: string): string {
  const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) =>
    match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );
  return paragraphs[1] || paragraphs[0] || "";
}

export function softphoneRoute(path: string): WpRoute | undefined {
  const page = byPath.get(path);
  if (!page) return undefined;
  const routes = data.routes as unknown as Record<string, WpRoute>;
  const chrome = routes[CHROME_PATH];
  const description = summary(page.html);
  const url = `https://www.todoip.com${page.path}`;
  const shared = chrome.head.filter((item) => {
    if (item.tag === "jsonld") return false;
    if (item.tag !== "meta") return true;
    const key = item.attrs.property || item.attrs.name || "";
    return !DROP_META.has(key);
  });
  const head: HeadItem[] = [
    meta({ name: "description", content: description }),
    meta({ property: "og:locale", content: "es_ES" }),
    meta({ property: "og:type", content: "website" }),
    meta({ property: "og:title", content: page.title }),
    meta({ property: "og:description", content: description }),
    meta({ property: "og:url", content: url }),
    meta({ property: "og:site_name", content: "TodoIP" }),
    meta({ name: "twitter:card", content: "summary" }),
    meta({ name: "twitter:title", content: page.title }),
    meta({ name: "twitter:description", content: description }),
    { tag: "link", attrs: { rel: "canonical", href: url } },
    ...shared,
  ];
  return {
    slug: page.path.replace(/^\/|\/$/g, "").replace(/\//g, "--"),
    title: page.title,
    robots: INDEX_ROBOTS,
    htmlAttrs: chrome.htmlAttrs,
    bodyClass: chrome.bodyClass,
    head,
    stylesheets: chrome.stylesheets,
  };
}
