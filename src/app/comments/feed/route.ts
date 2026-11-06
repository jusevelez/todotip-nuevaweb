import { commentsFeed } from "@/generated/seo-files";
import { staticFile } from "@/lib/static-file";

export const dynamic = "force-static";

export function GET() {
  return staticFile(commentsFeed, "application/rss+xml; charset=UTF-8");
}
