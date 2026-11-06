// HTML (parse5 DOM via cheerio) -> JSX source serializer.
// Supports "parallel variants": the same template rendered on several URLs is
// serialized once; attributes/text that differ per URL become pv(path, …)
// expressions so the shared component stays exact for each URL.

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
]);

const ATTR_MAP = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  srcset: "srcSet",
  crossorigin: "crossOrigin",
  autocomplete: "autoComplete",
  autoplay: "autoPlay",
  autofocus: "autoFocus",
  playsinline: "playsInline",
  frameborder: "frameBorder",
  allowfullscreen: "allowFullScreen",
  allowtransparency: "allowTransparency",
  referrerpolicy: "referrerPolicy",
  fetchpriority: "fetchPriority",
  enctype: "encType",
  novalidate: "noValidate",
  formnovalidate: "formNoValidate",
  formaction: "formAction",
  colspan: "colSpan",
  rowspan: "rowSpan",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  datetime: "dateTime",
  contenteditable: "contentEditable",
  spellcheck: "spellCheck",
  inputmode: "inputMode",
  enterkeyhint: "enterKeyHint",
  accesskey: "accessKey",
  usemap: "useMap",
  itemprop: "itemProp",
  itemscope: "itemScope",
  itemtype: "itemType",
  itemid: "itemID",
  itemref: "itemRef",
  charset: "charSet",
  hreflang: "hrefLang",
  marginwidth: "marginWidth",
  marginheight: "marginHeight",
  srclang: "srcLang",
  srcdoc: "srcDoc",
  "xlink:href": "xlinkHref",
  "xlink:title": "xlinkTitle",
  "xml:space": "xmlSpace",
  "xml:lang": "xmlLang",
  "xmlns:xlink": "xmlnsXlink",
  "xmlns:svg": "xmlnsSvg",
};

const BOOL = new Set([
  "required", "disabled", "checked", "selected", "multiple", "readonly", "autoplay", "muted", "loop",
  "controls", "playsinline", "allowfullscreen", "novalidate", "hidden", "async", "defer", "open",
  "autofocus", "itemscope", "default", "reversed", "formnovalidate", "inert", "nomodule",
]);

const NUMERIC = new Set(["aria-level", "aria-posinset", "aria-setsize", "aria-colcount", "aria-colindex", "aria-rowcount", "aria-rowindex", "tabindex", "colspan", "rowspan", "maxlength", "minlength", "size", "cols", "rows", "span", "start"]);

const NO_WS_CHILDREN = new Set(["table", "thead", "tbody", "tfoot", "tr", "colgroup", "select", "optgroup", "html", "head"]);

export function camel(name) {
  return name.replace(/[-:]([a-z])/g, (_, c) => c.toUpperCase());
}

export function jsxAttrName(name) {
  if (ATTR_MAP[name]) return ATTR_MAP[name];
  if (name.startsWith("data-") || name.startsWith("aria-")) return name;
  if (name.includes("-") || name.includes(":")) return camel(name);
  return name;
}

function splitDecls(style) {
  const out = [];
  let buf = "";
  let depth = 0;
  let quote = null;
  for (const ch of style) {
    if (quote) {
      buf += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === ";" && depth === 0) {
      out.push(buf);
      buf = "";
    } else buf += ch;
  }
  if (buf.trim()) out.push(buf);
  return out;
}

export function styleToObject(style) {
  const obj = {};
  for (const decl of splitDecls(style)) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop) continue;
    let key;
    if (prop.startsWith("--")) key = prop;
    else {
      const p = prop.toLowerCase();
      key = p.startsWith("-ms-") ? camel(p.slice(1)) : camel(p.replace(/^-/, "").replace(/^(webkit|moz|o)-/, (m) => m));
      if (/^-(webkit|moz|o)-/.test(p)) key = key.charAt(0).toUpperCase() + key.slice(1);
    }
    obj[key] = value;
  }
  return obj;
}

const lit = (v) => JSON.stringify(v);
// JSX attribute strings allow no escapes and decode HTML entities, so anything
// beyond plain text goes through an expression container.
const attrLit = (v) => {
  const j = JSON.stringify(v);
  return j === `"${v}"` && !v.includes("&") && !v.includes("{") ? j : `{${j}}`;
};

// Returns { name, value } list of JSX props for an element (value = JS source).
export function elementProps(el, ctx) {
  const tag = el.name;
  const attrs = { ...(el.attribs || {}) };
  const props = [];
  for (const k of Object.keys(attrs)) {
    const custom = k === "oninvalid" && /setCustomValidity\((['"])(.+)\1\)/.exec(attrs[k]);
    if (custom) attrs["data-invalid-message"] = custom[2];
    else if (/setCustomValidity\((['"])\1\)|clearValidity\(this\)/.test(attrs[k] || "")) attrs["data-clear-validity"] = "";
    if (/^on[a-z]+$/i.test(k)) {
      ctx.dropped.push(`${tag}[${k}]`);
      delete attrs[k];
    }
  }
  if (tag === "input" && "value" in attrs && !/^(hidden|submit|button|reset|image|checkbox|radio)$/i.test(attrs.type || "")) {
    attrs.defaultValue = attrs.value;
    delete attrs.value;
  }
  if (tag === "input" && "checked" in attrs) {
    delete attrs.checked;
    props.push({ name: "defaultChecked", value: "{true}" });
  }
  if (tag === "option" && "selected" in attrs) delete attrs.selected;
  if (tag === "a" && /^\s*javascript:/i.test(attrs.href || "")) {
    ctx.dropped.push(`a[href=${attrs.href}]`);
    attrs.href = "#";
  }
  for (const [k, v0] of Object.entries(attrs)) {
    if (k === "defaultValue") {
      props.push({ name: "defaultValue", value: `{${lit(v0)}}` });
      continue;
    }
    const v = ctx.rewrite ? ctx.rewrite(v0, k, tag) : v0;
    if (k === "style") {
      const o = styleToObject(v);
      ctx.usesStyle = true;
      props.push({ name: "style", value: `{${JSON.stringify(o)} as CSSProperties}` });
      continue;
    }
    if (NUMERIC.has(k) && /^-?\d+$/.test(v.trim())) {
      props.push({ name: jsxAttrName(k), value: `{${Number(v)}}` });
      continue;
    }
    if (BOOL.has(k) && (v === "" || v.toLowerCase() === k)) {
      props.push({ name: jsxAttrName(k), value: "{true}" });
      continue;
    }
    const name = jsxAttrName(k);
    props.push({ name, value: attrLit(v) });
  }
  if (tag === "select") {
    const sel = [];
    const walk = (n) => {
      for (const c of n.children || []) {
        if (c.type === "tag" && c.name === "option" && c.attribs && "selected" in c.attribs)
          sel.push(c.attribs.value ?? textOf(c));
        if (c.type === "tag") walk(c);
      }
    };
    walk(el);
    if (sel.length) props.push({ name: "defaultValue", value: `{${lit("multiple" in attrs ? sel : sel[0])}}` });
  }
  return props;
}

export function textOf(n) {
  if (n.type === "text") return n.data;
  return (n.children || []).map(textOf).join("");
}

function propsSource(propsByVariant, paths, ctx) {
  // propsByVariant: array (per variant) of {name -> value}; produce JSX attr string.
  const names = [];
  for (const p of propsByVariant) for (const n of Object.keys(p)) if (!names.includes(n)) names.push(n);
  const parts = [];
  for (const n of names) {
    const vals = propsByVariant.map((p) => (n in p ? p[n] : undefined));
    const same = vals.every((v) => v === vals[0]);
    let src;
    if (same) src = vals[0];
    else {
      // Most common value becomes the default, others keyed by URL path.
      const counts = new Map();
      for (const v of vals) counts.set(v, (counts.get(v) || 0) + 1);
      const def = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
      const map = {};
      vals.forEach((v, i) => {
        if (v !== def) map[paths[i]] = v === undefined ? "__U__" : v;
      });
      const toExpr = (v) => (v === undefined || v === "__U__" ? "undefined" : v.startsWith("{") ? v.slice(1, -1) : v);
      const entries = Object.entries(map).map(([k, v]) => `${lit(k)}: ${toExpr(v)}`);
      ctx.usesPv = true;
      src = `{pv(path, { ${entries.join(", ")} }, ${toExpr(def)})}`;
    }
    if (src === undefined) continue;
    if (/^[A-Za-z_][\w-]*$/.test(n)) parts.push(`${n}=${src}`);
    else parts.push(`{...{ ${lit(n)}: ${src.startsWith("{") ? src.slice(1, -1) : src} }}`);
  }
  return parts.length ? " " + parts.join(" ") : "";
}

export function significantChildren(el, ctx) {
  const out = [];
  for (const c of el.children || []) {
    if (c.type === "comment" || c.type === "directive") continue;
    if (c.type === "script") {
      if (ctx) ctx.droppedScripts.push((c.attribs?.src || textOf(c)).slice(0, 160));
      continue;
    }
    if (c.type === "tag" && c.name === "noscript") {
      if (ctx) ctx.dropped.push("noscript");
      continue;
    }
    if (c.type === "tag" && c.name === "script") {
      if (ctx) ctx.droppedScripts.push((c.attribs?.src || textOf(c)).slice(0, 160));
      continue;
    }
    // Hidden honeypot link injected by the host's Imunify360 WAF, not site content.
    if (c.type === "tag" && c.name === "a" && c.attribs?.href === "/imunify-bot-check") {
      if (ctx) ctx.dropped.push("imunify-bot-check honeypot link");
      continue;
    }
    if (c.type === "text" && NO_WS_CHILDREN.has(el.name) && !c.data.replace(HTML_WS, "")) continue;
    out.push(c);
  }
  return out;
}

export function signature(n) {
  if (n.type === "text") return "t";
  if (n.type === "style" || (n.type === "tag" && n.name === "style")) return "s";
  return `${n.name}(${significantChildren(n).map(signature).join(",")})`;
}

// HTML whitespace only: JS \s would also collapse U+00A0 (&nbsp;), which is content.
const HTML_WS = /[ \t\n\f\r]+/g;

function normText(s, pre) {
  if (pre) return s;
  return s.replace(HTML_WS, " ");
}

// Serialize parallel nodes (one per variant path) to JSX.
export function toJsx(nodes, paths, ctx, indent = "", pre = false) {
  const n = nodes[0];
  if (n.type === "text") {
    const texts = nodes.map((x) => normText(x.data, pre));
    if (texts.every((t) => t === texts[0])) return `{${lit(texts[0])}}`;
    ctx.usesPv = true;
    const map = {};
    texts.forEach((t, i) => {
      if (t !== texts[0]) map[paths[i]] = t;
    });
    return `{pv(path, ${JSON.stringify(map)}, ${lit(texts[0])})}`;
  }
  const tag = n.name;
  if (tag === "style" || n.type === "style") {
    const css = (ctx.rewriteCss ? ctx.rewriteCss(textOf(n)) : textOf(n)).trim();
    const id = ctx.registerStyle(css);
    return `<style href=${lit(id)} precedence="wp-body">{${lit(css)}}</style>`;
  }
  const props = propsSource(
    nodes.map((x) => Object.fromEntries(elementProps(x, ctx).map((p) => [p.name, p.value]))),
    paths,
    ctx,
  );
  if (VOID.has(tag)) return `<${tag}${props} />`;
  if (tag === "textarea") {
    const t = textOf(n);
    return `<textarea${props}${t ? ` defaultValue={${lit(t)}}` : ""} />`;
  }
  const kidsPer = nodes.map((x) => significantChildren(x, x === n ? ctx : null));
  const isPre = pre || tag === "pre";
  const kids = kidsPer[0].map((_, i) => toJsx(kidsPer.map((k) => k[i]), paths, ctx, indent + "  ", isPre));
  if (!kids.length) return `<${tag}${props}></${tag}>`;
  return `<${tag}${props}>\n${indent}  ${kids.join(`\n${indent}  `)}\n${indent}</${tag}>`;
}
