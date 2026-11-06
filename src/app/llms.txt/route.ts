import { llmsTxt } from "@/generated/seo-files";
import { staticFile } from "@/lib/static-file";

export const dynamic = "force-static";

export function GET() {
  return staticFile(llmsTxt, "text/plain; charset=UTF-8");
}
