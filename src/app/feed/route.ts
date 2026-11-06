import { feed } from "@/generated/seo-files";
import { staticFile } from "@/lib/static-file";

export const dynamic = "force-static";

export function GET() {
  return staticFile(feed, "application/rss+xml; charset=UTF-8");
}
