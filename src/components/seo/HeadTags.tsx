import type { HeadItem } from "@/lib/wp-data";

const LINK_ATTRS: Record<string, string> = { crossorigin: "crossOrigin", hreflang: "hrefLang", referrerpolicy: "referrerPolicy" };

function linkProps(attrs: Record<string, string>) {
  return Object.fromEntries(Object.entries(attrs).map(([k, v]) => [LINK_ATTRS[k] ?? k, k === "crossorigin" && v === "" ? "anonymous" : v]));
}

/**
 * Server-rendered head tags captured from the live page (Rank Math metas,
 * canonical, Open Graph, Twitter, JSON-LD, icons, feeds) in their original order.
 */
export default function HeadTags({ title, robots, items }: { title: string; robots: string | null; items: HeadItem[] }) {
  return (
    <>
      <title>{title}</title>
      {robots ? <meta name="robots" content={robots} /> : null}
      {items.map((item, i) => {
        if (item.tag === "meta") return <meta key={i} {...item.attrs} />;
        if (item.tag === "link") return <link key={i} {...linkProps(item.attrs)} />;
        return (
          <script
            key={i}
            type="application/ld+json"
            className={item.attrs.class ?? undefined}
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        );
      })}
    </>
  );
}
