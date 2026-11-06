// Vercel "Ignored Build Step": exit 0 skips the build, exit 1 builds.
// Production is not authorized yet (DNS/hosting of todoip.com stay on WordPress), so
// every production build is skipped unless ALLOW_VERCEL_PRODUCTION=1 is set in the
// project. Preview builds always run (and are globally noindex).
const env = process.env.VERCEL_ENV;
if (env === "production" && process.env.ALLOW_VERCEL_PRODUCTION !== "1") {
  console.log("[ignore-build] production deployments are disabled for this project; skipping.");
  process.exit(0);
}
console.log(`[ignore-build] building (VERCEL_ENV=${env ?? "unset"}).`);
process.exit(1);
