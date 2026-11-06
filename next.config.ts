import type { NextConfig } from "next";
import { isIndexingEnabled } from "./src/lib/site-env";

const nextConfig: NextConfig = {
  // URLs keep WordPress' trailing slash; the 301 for slash-less URLs lives in
  // src/proxy.ts because Next's built-in redirect would be a 308.
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  // Dev server is opened as http://127.0.0.1:4317; without this Next blocks its dev
  // chunks/HMR and the page never hydrates (the Elementor runtime would not run).
  allowedDevOrigins: ["127.0.0.1"],
  // Several root layouts (WordPress pages + each ads landing) need a global 404.
  experimental: { globalNotFound: true },
  // Lets a production-mode test build live next to the preview one (see README).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    // Static assets bypass the proxy, so the preview noindex header is also set here.
    if (isIndexingEnabled()) return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
