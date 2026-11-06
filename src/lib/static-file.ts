/** Response for a file copied verbatim from the live site. */
export function staticFile(body: string, contentType: string, extraHeaders: Record<string, string> = {}) {
  return new Response(body, {
    headers: { "Content-Type": contentType, ...extraHeaders },
  });
}

/** Rank Math serves every XML sitemap with `X-Robots-Tag: noindex`. */
export const SITEMAP_HEADERS = { "X-Robots-Tag": "noindex" };
