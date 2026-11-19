import type { ReactNode } from "react";
import { faqByPath, type FaqBlock, type FaqItem } from "@/content/faq";
import { siteMode } from "@/lib/site-env";

// Bloque de preguntas frecuentes por producto, insertado antes del footer de cada página
// que tenga FAQ (ver src/content/faq.ts). Incluye el schema FAQPage para buscadores e IA.
// Las etiquetas «Discrepancia» son notas de revisión: solo se muestran fuera de producción.

const URL_RE = /(https?:\/\/[^\s)]+[^\s).,;])/g;

function withLinks(text: string): ReactNode[] {
  return text.split(URL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noopener">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

// "Etiqueta: texto" → etiqueta en negrita (así vienen los ítems de lista del documento).
function listItem(text: string): ReactNode {
  const m = /^([^:]{2,60}):\s+(.*)$/.exec(text);
  if (!m) return withLinks(text);
  return (
    <>
      <strong>{m[1]}:</strong> {withLinks(m[2])}
    </>
  );
}

function Block({ block }: { block: FaqBlock }) {
  if (typeof block === "string") return <p>{withLinks(block)}</p>;
  if ("ul" in block)
    return (
      <ul>
        {block.ul.map((t, i) => (
          <li key={i}>{listItem(t)}</li>
        ))}
      </ul>
    );
  return (
    <ol>
      {block.ol.map((t, i) => (
        <li key={i}>{listItem(t)}</li>
      ))}
    </ol>
  );
}

function plainText(blocks: FaqBlock[]): string {
  return blocks
    .map((b) => (typeof b === "string" ? b : ("ul" in b ? b.ul : b.ol).join(" ")))
    .join(" ");
}

function Item({ item, review }: { item: FaqItem; review: boolean }) {
  return (
    <div className="tip-faq__item" id={`faq-${item.n}`}>
      <details className="tip-faq__qa">
        <summary>
          {review && <span className="tip-faq__num">{item.n}</span>}
          <h4 className="tip-faq__q">{item.q}</h4>
        </summary>
        <div className="tip-faq__a">
          {item.a.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>
      </details>
      {review && item.discrepancy && (
        <details className="tip-faq__disc">
          <summary>Discrepancia</summary>
          <p>{item.discrepancy}</p>
        </details>
      )}
    </div>
  );
}

export default function ProductFaq({ path }: { path: string }) {
  const faq = faqByPath[path];
  if (!faq) return null;
  const review = siteMode() !== "production";
  const items = faq.groups.flatMap((g) => g.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: plainText(it.a) },
    })),
  };
  return (
    <section className="tip-faq" id="preguntas-frecuentes" aria-labelledby="tip-faq-title">
      <style href="tip-faq" precedence="default">
        {CSS}
      </style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="tip-faq__inner">
        <h2 id="tip-faq-title" className="tip-faq__title">
          Preguntas frecuentes
        </h2>
        <p className="tip-faq__lead">{faq.product}: respuestas directas sobre cómo funciona, integraciones, precio y soporte.</p>
        {faq.groups.map((g, i) => (
          <details key={g.title} className="tip-faq__group" open={i === 0}>
            <summary>
              <h3>{g.title}</h3>
              {review && g.items.some((it) => it.discrepancy) && <span className="tip-faq__flag">Discrepancia</span>}
            </summary>
            {g.items.map((it) => (
              <Item key={it.n} item={it} review={review} />
            ))}
          </details>
        ))}
      </div>
    </section>
  );
}

const CSS = `
.tip-faq{background:#fff;color:#1d1d1b;padding:64px 20px;font-family:"Geologica",Helvetica,Arial,sans-serif}
.tip-faq__inner{max-width:1140px;margin:0 auto}
.tip-faq h2.tip-faq__title{font-family:"Geologica",sans-serif;font-size:36px;line-height:1.2;font-weight:600;margin:0 0 8px;color:#1d1d1b}
.tip-faq__lead{font-size:17px;line-height:1.5;margin:0 0 32px;color:#4a4a48}
.tip-faq details>summary{list-style:none;cursor:pointer}
.tip-faq details>summary::-webkit-details-marker{display:none}
.tip-faq__group{border-top:2px solid #83C140}
.tip-faq__group:last-child{border-bottom:2px solid #83C140}
.tip-faq__group>summary{display:flex;align-items:center;gap:12px;padding:20px 0}
.tip-faq .tip-faq__group>summary h3{font-family:"Geologica",sans-serif;font-size:22px;font-weight:600;margin:0;color:#1d1d1b;flex:1}
.tip-faq__group>summary::after{content:"+";font-size:28px;line-height:1;color:#83C140}
.tip-faq__group[open]>summary::after{content:"−"}
.tip-faq__item{border-top:1px solid #E7E8DB}
.tip-faq__qa>summary{display:flex;align-items:flex-start;gap:12px;padding:16px 0}
.tip-faq__qa>summary::after{content:"+";margin-left:auto;font-size:22px;line-height:1;color:#83C140}
.tip-faq__qa[open]>summary::after{content:"−"}
.tip-faq h4.tip-faq__q{font-family:"Geologica",sans-serif;font-size:17px;line-height:1.4;font-weight:500;letter-spacing:0;text-transform:none;margin:0;color:#1d1d1b}
.tip-faq__num{flex:none;min-width:30px;font-size:13px;line-height:24px;color:#8a8a85}
.tip-faq__a{padding:0 32px 20px 0;font-size:16px;line-height:1.6;color:#3a3a38}
.tip-faq__a p{margin:0 0 12px}
.tip-faq__a ul,.tip-faq__a ol{margin:0 0 12px;padding-left:22px}
.tip-faq__a li{margin:0 0 6px}
.tip-faq__a a{color:#5f9a2a;text-decoration:underline}
.tip-faq__flag,.tip-faq__disc>summary{display:inline-block;font-size:12px;font-weight:600;line-height:1;letter-spacing:.02em;text-transform:uppercase;color:#8a4b00;background:#FFE8C2;border:1px solid #F2B24C;border-radius:999px;padding:5px 10px}
.tip-faq__disc{margin:0 0 16px 42px}
.tip-faq__disc>summary::after{content:" ▾"}
.tip-faq__disc[open]>summary::after{content:" ▴"}
.tip-faq__disc p{margin:10px 0 0;padding:12px 14px;font-size:14px;line-height:1.5;background:#FFF6E6;border-left:3px solid #F2B24C;color:#4a3a20}
@media (max-width:767px){.tip-faq{padding:44px 16px}.tip-faq h2.tip-faq__title{font-size:28px}.tip-faq .tip-faq__group>summary h3{font-size:19px}.tip-faq__a{padding-right:0}.tip-faq__disc{margin-left:0}}
`;
