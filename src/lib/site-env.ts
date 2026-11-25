/**
 * Indexing guard.
 *
 * This repository (jusevelez/todotip-nuevaweb) is not the official TodoIP site
 * (that will live at github.com/todoip/website). Every environment — preview,
 * local, and production, including www.todoip.com if DNS still points here —
 * ships global `noindex, nofollow` (meta, X-Robots-Tag, robots.txt Disallow: /).
 *
 * siteMode() still distinguishes production vs preview for tracking and other
 * non-indexing behaviour.
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
  return false;
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

/** Robots directive: this unofficial clone is always noindex, nofollow. */
export function robotsFor(_original?: string | null): string {
  return PREVIEW_ROBOTS;
}

/** Analytics/tracking tags (GTM, GA4, Site Kit tag, Hotjar) only run in production. */
export function trackingEnabled(): boolean {
  return siteMode() === "production" && process.env.SITE_DISABLE_TRACKING !== "1";
}
