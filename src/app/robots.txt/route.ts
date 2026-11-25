import { staticFile } from "@/lib/static-file";

export const dynamic = "force-static";

// Unofficial clone: block every crawler in every environment.
const ROBOTS = "User-agent: *\nDisallow: /\n";

export function GET() {
  return staticFile(ROBOTS, "text/plain; charset=UTF-8");
}
