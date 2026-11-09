import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { pageLoaders } from "@/generated/wp/routes";
import { allPaths, getRoute, pathFromSlug } from "@/lib/wp-data";

// Only the captured URLs exist; anything else falls through to app/global-not-found.tsx.
export const dynamicParams = false;

// These pages ship their own viewport meta on live (width=device-width, initial-scale=1.0, viewport-fit=cover);
// every other URL keeps Next's default, which equals live's "width=device-width, initial-scale=1".
const VIEWPORT_FIT_COVER = new Set(["/reportes-telefonia/", "/registro-exitoso/"]);

export async function generateViewport({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Viewport> {
  const path = pathFromSlug((await params).slug);
  return VIEWPORT_FIT_COVER.has(path) ? { width: "device-width", initialScale: 1, viewportFit: "cover" } : {};
}

export function generateStaticParams() {
  return allPaths().map((p) => ({ slug: p === "/" ? [] : p.slice(1, -1).split("/") }));
}

export default async function WpPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const path = pathFromSlug((await params).slug);
  if (!getRoute(path)) notFound();
  const { default: Content } = await pageLoaders[path]();
  return <Content path={path} />;
}
