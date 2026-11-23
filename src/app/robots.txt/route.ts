import { robotsTxt } from "@/generated/seo-files";
import { isIndexingEnabled, withFirmasDisallow } from "@/lib/site-env";
import { staticFile } from "@/lib/static-file";

export const dynamic = "force-static";

// Production serves the live robots.txt plus Disallow: /firmas/. Previews block every crawler.
const PREVIEW_ROBOTS = "User-agent: *\nDisallow: /\n";

export function GET() {
  return staticFile(isIndexingEnabled() ? withFirmasDisallow(robotsTxt) : PREVIEW_ROBOTS, "text/plain; charset=UTF-8");
}
