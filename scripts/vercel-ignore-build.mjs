// Vercel "Ignored Build Step": exit 0 skips the build, exit 1 builds.
// GitHub previews and Production (branch main) both build. Indexing is not
// gated here: this unofficial clone is globally noindex in every environment.
const env = process.env.VERCEL_ENV;
console.log(`[ignore-build] building (VERCEL_ENV=${env ?? "unset"}).`);
process.exit(1);
