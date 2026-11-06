import { notFound } from "next/navigation";
import { pageLoaders } from "@/generated/wp/routes";
import { allPaths, getRoute, pathFromSlug } from "@/lib/wp-data";

// Only the captured URLs exist; anything else falls through to app/global-not-found.tsx.
export const dynamicParams = false;

export function generateStaticParams() {
  return allPaths().map((p) => ({ slug: p === "/" ? [] : p.slice(1, -1).split("/") }));
}

export default async function WpPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const path = pathFromSlug((await params).slug);
  if (!getRoute(path)) notFound();
  const { default: Content } = await pageLoaders[path]();
  return <Content path={path} />;
}
