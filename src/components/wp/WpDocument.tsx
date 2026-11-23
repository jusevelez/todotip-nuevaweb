import type { ReactNode } from "react";
import HeadTags from "@/components/seo/HeadTags";
import { GtmNoscript, WpTrackingHead } from "@/components/seo/Tracking";
import TdpRuntime from "@/components/tdp/TdpRuntime";
import { getRouteOrNotFound, stylesheetsFor } from "@/lib/wp-data";
import { robotsFor } from "@/lib/site-env";

// Full <html> document for a cloned URL: <html>/<body> attributes
// (body classes drive the kit CSS), head tags and stylesheets in the live order.
export default function WpDocument({ path, children }: { path: string; children: ReactNode }) {
  const { route } = getRouteOrNotFound(path);
  return (
    <html lang={route.htmlAttrs.lang ?? "es"}>
      <head>
        <HeadTags title={route.title} robots={robotsFor(route.robots)} items={route.head} />
        {stylesheetsFor(route).map((s) =>
          s.kind === "link" ? (
            <link key={s.key} rel="stylesheet" href={s.href} media={s.media} precedence="site" />
          ) : (
            <style key={s.key} href={s.key} precedence="site">
              {s.css}
            </style>
          ),
        )}
        <WpTrackingHead />
      </head>
      <body className={route.bodyClass}>
        <GtmNoscript />
        {children}
        <TdpRuntime />
      </body>
    </html>
  );
}
