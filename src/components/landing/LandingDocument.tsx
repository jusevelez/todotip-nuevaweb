import type { ReactNode } from "react";
import HeadTags from "@/components/seo/HeadTags";
import { GtmNoscript, LandingTrackingHead } from "@/components/seo/Tracking";
import type { HeadItem } from "@/lib/wp-data";
import { robotsFor } from "@/lib/site-env";
import LandingRuntime from "./LandingRuntime";

export type LandingData = {
  path: string;
  title: string;
  robots: string | null;
  htmlAttrs: Record<string, string>;
  bodyAttrs: Record<string, string>;
  head: HeadItem[];
  stylesheets: { href?: string; media?: string | null }[];
};

// Root document for the static ads landings (/bots/, /salud/, /cobranzas/, /turismo/),
// which on the live site are standalone HTML files outside WordPress.
export default function LandingDocument({ data, children }: { data: LandingData; children: ReactNode }) {
  return (
    <html lang={data.htmlAttrs.lang ?? "es"}>
      <head>
        <LandingTrackingHead />
        <HeadTags title={data.title} robots={robotsFor(data.robots)} items={data.head} />
        {data.stylesheets
          .filter((s) => s.href)
          .map((s) => (
            <link key={s.href} rel="stylesheet" href={s.href} media={s.media ?? undefined} precedence="landing" />
          ))}
      </head>
      <body className={data.bodyAttrs.class}>
        <GtmNoscript />
        {children}
        <LandingRuntime />
      </body>
    </html>
  );
}
