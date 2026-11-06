import { sitemapIndex } from "@/generated/seo-files";
import { SITEMAP_HEADERS, staticFile } from "@/lib/static-file";

export const dynamic = "force-static";

export function GET() {
  return staticFile(sitemapIndex, "text/xml; charset=UTF-8", SITEMAP_HEADERS);
}
