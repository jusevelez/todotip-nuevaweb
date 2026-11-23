/**
 * Indexing guard.
 *
 * - Production (VERCEL_ENV=production, or SITE_ENV=production outside Vercel):
 *   every URL keeps the robots directive captured from the live site
 *   (index on WP pages, `noindex, follow` on the ads landings, etc.).
 * - Anything else (Vercel preview, local dev, `next start` without SITE_ENV):
 *   the whole site is `noindex, nofollow` (meta + X-Robots-Tag + robots.txt).
 *
 * SITE_FORCE_NOINDEX=1 forces global noindex even in production; the build
 * refuses that combination unless ALLOW_PRODUCTION_NOINDEX=1 is also set
 * (see scripts/check-seo-env.mjs), so production cannot ship all-noindex by accident.
 */
export const SITE_ORIGIN = "https://www.todoip.com";
export const CANONICAL_HOST = "www.todoip.com";

export type SiteMode = "production" | "preview";

export function siteMode(): SiteMode {
  const vercelEnv = process.env.VERCEL_ENV;
  const siteEnv = process.env.SITE_ENV;
  if (siteEnv === "preview") return "preview";
  if (vercelEnv) return vercelEnv === "production" ? "production" : "preview";
  return siteEnv === "production" ? "production" : "preview";
}

export function isIndexingEnabled(): boolean {
  if (process.env.SITE_FORCE_NOINDEX === "1") return false;
  return siteMode() === "production";
}

export const PREVIEW_ROBOTS = "noindex, nofollow";

/** Email-signature assets that must stay out of search indexes. */
export const SIGNATURE_NOINDEX = "noindex, nofollow";
export const SIGNATURE_NOINDEX_IMAGES = [
  "/img/banner-pbx.png",
  "/img/logotodoip.jpg",
  "/img/correo.png",
  "/img/telefono.png",
  "/img/celularfirma.png",
  "/img/web.png",
] as const;

export function isSignatureNoindexPath(pathname: string): boolean {
  if (pathname === "/firmas" || pathname === "/firmas/" || pathname.startsWith("/firmas/")) return true;
  return (SIGNATURE_NOINDEX_IMAGES as readonly string[]).includes(pathname);
}

/** Production robots.txt is the live file plus a Disallow for /firmas/. */
export function withFirmasDisallow(robotsTxt: string): string {
  if (/^Disallow:\s*\/firmas\//m.test(robotsTxt)) return robotsTxt;
  const needle = "Disallow: /imunify-bot-check\n";
  if (robotsTxt.includes(needle)) return robotsTxt.replace(needle, `${needle}Disallow: /firmas/\n`);
  return `User-agent: *\nDisallow: /firmas/\n\n${robotsTxt}`;
}

/** Robots directive to render for a URL whose captured directive is `original`. */
export function robotsFor(original: string | null | undefined): string | null {
  if (!isIndexingEnabled()) return PREVIEW_ROBOTS;
  return original ?? null;
}

/** Analytics/tracking tags (GTM, GA4, Site Kit tag, Hotjar) only run in production. */
export function trackingEnabled(): boolean {
  return siteMode() === "production" && process.env.SITE_DISABLE_TRACKING !== "1";
}
