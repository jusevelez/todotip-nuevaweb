// Vercel "Ignored Build Step": exit 0 skips the build, exit 1 builds.
// GitHub previews and Production (branch main) both build. Indexing is not
// gated here: preview is globally noindex, and a *.vercel.app production
// alias stays noindex until the host is www.todoip.com (see src/proxy.ts).
const env = process.env.VERCEL_ENV;
console.log(`[ignore-build] building (VERCEL_ENV=${env ?? "unset"}).`);
process.exit(1);
