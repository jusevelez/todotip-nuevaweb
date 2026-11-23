import type { NextConfig } from "next";
import { isIndexingEnabled, SIGNATURE_NOINDEX, SIGNATURE_NOINDEX_IMAGES } from "./src/lib/site-env";

const NOINDEX_HEADER = [{ key: "X-Robots-Tag", value: SIGNATURE_NOINDEX }];

const nextConfig: NextConfig = {
  // URLs keep the live site's trailing slash; the 301 for slash-less URLs lives in
  // src/proxy.ts because Next's built-in redirect would be a 308.
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  // Dev server is opened as http://127.0.0.1:4317; without this Next blocks its dev
  // chunks/HMR and the page never hydrates (the Elementor runtime would not run).
  allowedDevOrigins: ["127.0.0.1"],
  // Several root layouts (cloned pages + each ads landing) need a global 404.
  experimental: { globalNotFound: true },
  // Lets a production-mode test build live next to the preview one (see README).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    // Email signatures and their /img assets stay noindex even in production.
    // /firmas/:path* matches /firmas, nested folders, and files (Next path-to-regexp).
    const signatureHeaders = [
      { source: "/firmas/:path*", headers: NOINDEX_HEADER },
      ...SIGNATURE_NOINDEX_IMAGES.map((source) => ({ source, headers: NOINDEX_HEADER })),
    ];
    // Static assets under /assets and /lib bypass the proxy, so preview noindex
    // is also set here for the rest of the site.
    if (!isIndexingEnabled()) {
      return [{ source: "/:path*", headers: NOINDEX_HEADER }, ...signatureHeaders];
    }
    return signatureHeaders;
  },
  async rewrites() {
    // Directory URLs like /firmas/2026/cristina/ must serve that folder's index.html
    // so relative assets (fb.png, Nuestra IA.svg) resolve. :path+ skips /firmas/
    // itself, which has no index on purpose (no directory listing).
    return {
      beforeFiles: [
        {
          source: "/firmas/:path+/",
          destination: "/firmas/:path+/index.html",
        },
      ],
    };
  },
};

export default nextConfig;
