import { PREVIEW_ROBOTS } from "@/lib/site-env";

/** Response for a file copied verbatim from the live site. */
export function staticFile(body: string, contentType: string, extraHeaders: Record<string, string> = {}) {
  return new Response(body, {
    headers: { "Content-Type": contentType, "X-Robots-Tag": PREVIEW_ROBOTS, ...extraHeaders },
  });
}

/** Sitemaps stay out of the index even if a caller omits extra headers. */
export const SITEMAP_HEADERS = { "X-Robots-Tag": PREVIEW_ROBOTS };
