import type { ReactNode } from "react";
import WpDocument from "@/components/wp/WpDocument";
import { pathFromSlug } from "@/lib/wp-data";
import "./clone.css";

// Root layout for every WordPress/Elementor URL. It lives under the catch-all
// segment so each URL gets exactly the <html>/<body> attributes it had live.
export default async function WpRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <WpDocument path={pathFromSlug(slug)}>{children}</WpDocument>;
}
