import { NextResponse, type NextRequest } from "next/server";
import { CANONICAL_HOST, isIndexingEnabled, siteMode } from "@/lib/site-env";
import { feeds } from "@/generated/feeds";

// Same normalisation the live WordPress/LiteSpeed stack applies, with 301s:
//   todoip.com/*            -> https://www.todoip.com/*
//   /path (no slash)        -> /path/
//   /sitemap.xml, /wp-sitemap.xml -> /sitemap_index.xml
// It also serves the per-post/category/author RSS feeds captured from the live site.
const SITEMAP_ALIASES = new Set(["/sitemap.xml", "/wp-sitemap.xml"]);
const FILE_LIKE = /\/[^/]+\.[a-z0-9]{1,6}$/i;

function permanent(url: URL | string) {
  return NextResponse.redirect(url, 301);
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const host = (request.headers.get("host") ?? "").toLowerCase().split(":")[0];

  if (host === "todoip.com") {
    return permanent(`https://${CANONICAL_HOST}${url.pathname}${url.search}`);
  }

  if (SITEMAP_ALIASES.has(url.pathname)) {
    return permanent(new URL("/sitemap_index.xml", url));
  }

  if (!url.pathname.endsWith("/") && !FILE_LIKE.test(url.pathname)) {
    // A plain URL: NextURL re-applies its own trailing-slash formatting on clone().
    return permanent(new URL(`${url.pathname}/${url.search}`, request.url));
  }

  const feed = feeds[url.pathname];
  const response = feed
    ? new NextResponse(feed, { headers: { "Content-Type": "application/rss+xml; charset=UTF-8" } })
    : NextResponse.next();
  // Preview/dev: whole site noindex. Production: only the canonical host is indexable
  // (the *.vercel.app production alias stays noindex).
  if (!isIndexingEnabled() || (siteMode() === "production" && host !== CANONICAL_HOST)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/|wp-content/|wp-includes/).*)"],
};
