import { postSitemap } from "@/generated/seo-files";
import { SITEMAP_HEADERS, staticFile } from "@/lib/static-file";

export const dynamic = "force-static";

export function GET() {
  return staticFile(postSitemap, "text/xml; charset=UTF-8", SITEMAP_HEADERS);
}
