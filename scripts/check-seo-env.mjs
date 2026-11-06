// Prebuild guard: refuses a production build that would ship the whole site as
// noindex (SITE_FORCE_NOINDEX=1) unless ALLOW_PRODUCTION_NOINDEX=1 says it is
// intentional, and prints which indexing mode the build will bake into the HTML.
const vercelEnv = process.env.VERCEL_ENV;
const siteEnv = process.env.SITE_ENV;
const mode =
  siteEnv === "preview" ? "preview" : vercelEnv ? (vercelEnv === "production" ? "production" : "preview") : siteEnv === "production" ? "production" : "preview";
const forced = process.env.SITE_FORCE_NOINDEX === "1";

if (vercelEnv === "production" && siteEnv === "preview" && process.env.ALLOW_PRODUCTION_NOINDEX !== "1") {
  console.error("[seo-guard] VERCEL_ENV=production with SITE_ENV=preview would publish production as noindex. Set ALLOW_PRODUCTION_NOINDEX=1 if intended.");
  process.exit(1);
}
if (mode === "production" && forced && process.env.ALLOW_PRODUCTION_NOINDEX !== "1") {
  console.error("[seo-guard] SITE_FORCE_NOINDEX=1 in a production build would publish the whole site as noindex. Set ALLOW_PRODUCTION_NOINDEX=1 if intended.");
  process.exit(1);
}
const indexing = mode === "production" && !forced;
console.log(
  `[seo-guard] mode=${mode} indexing=${indexing ? "per-page robots from the live baseline (ads landings stay noindex, follow)" : "GLOBAL noindex, nofollow"} tracking=${mode === "production" && process.env.SITE_DISABLE_TRACKING !== "1" ? "on" : "off"}`,
);
