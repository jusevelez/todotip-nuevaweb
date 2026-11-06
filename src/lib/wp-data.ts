import data from "@/generated/wp/data.json";

export type HeadItem =
  | { tag: "meta"; attrs: Record<string, string> }
  | { tag: "link"; attrs: Record<string, string> }
  | { tag: "jsonld"; attrs: { class: string | null }; text: string };

export type StylesheetRef = { id?: string | null; href?: string; media?: string | null; inline?: string };

export type WpRoute = {
  slug: string;
  title: string;
  robots: string | null;
  htmlAttrs: Record<string, string>;
  bodyClass: string;
  head: HeadItem[];
  stylesheets: string;
};

const routes = data.routes as unknown as Record<string, WpRoute>;
const stylesheetSets = data.stylesheetSets as unknown as Record<string, StylesheetRef[]>;
const inlineStyles = data.inlineStyles as unknown as Record<string, { id: string; css: string }>;

export const NOT_FOUND_KEY = "__404";

export function pathFromSlug(slug: string[] | undefined): string {
  if (!slug || slug.length === 0) return "/";
  return "/" + slug.map((s) => decodeURIComponent(s)).join("/") + "/";
}

export function getRoute(path: string): WpRoute | undefined {
  return Object.prototype.hasOwnProperty.call(routes, path) && path !== NOT_FOUND_KEY ? routes[path] : undefined;
}

export function getRouteOrNotFound(path: string): { route: WpRoute; found: boolean } {
  const r = getRoute(path);
  return r ? { route: r, found: true } : { route: routes[NOT_FOUND_KEY], found: false };
}

export function allPaths(): string[] {
  return Object.keys(routes).filter((p) => p !== NOT_FOUND_KEY);
}

export function stylesheetsFor(route: WpRoute) {
  return stylesheetSets[route.stylesheets].map((s) =>
    s.inline ? { kind: "inline" as const, ...inlineStyles[s.inline], key: s.inline } : { kind: "link" as const, href: s.href!, media: s.media ?? undefined, key: s.href! },
  );
}
