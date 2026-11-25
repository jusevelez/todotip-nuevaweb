// Prebuild note: this unofficial clone always ships global noindex, nofollow.
const vercelEnv = process.env.VERCEL_ENV;
const siteEnv = process.env.SITE_ENV;
const mode =
  siteEnv === "preview" ? "preview" : vercelEnv ? (vercelEnv === "production" ? "production" : "preview") : siteEnv === "production" ? "production" : "preview";
console.log(
  `[seo-guard] mode=${mode} indexing=GLOBAL noindex, nofollow tracking=${mode === "production" && process.env.SITE_DISABLE_TRACKING !== "1" ? "on" : "off"}`,
);
