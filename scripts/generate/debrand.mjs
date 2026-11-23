// Rewrite captured WordPress/Elementor identifiers so the served site does not
// fingerprint as WP. Applied to generated source, public CSS, and a one-shot
// pass over the tree. Capture HTML stays untouched; generate.mjs debrands output.

const REPLACEMENTS = [
  ["\\\\/wp-content\\\\/", "\\\\/assets\\\\/"],
  ["\\\\/wp-includes\\\\/", "\\\\/lib\\\\/"],
  ["\\/wp-content\\/", "\\/assets\\/"],
  ["\\/wp-includes\\/", "\\/lib\\/"],
  ["/wp-content/", "/assets/"],
  ["/wp-includes/", "/lib/"],
  ["wp-content/", "assets/"],
  ["wp-includes/", "lib/"],
  ["https://wordpress.org/?v=7.1.4", "https://www.todoip.com"],
  ["https://wordpress.org/?v=", "https://www.todoip.com/?v="],
  ["wp-image-", "img-"],
  ["wp-img-", "img-"],
  ["wp-emoji", "emoji-fb"],
  ["wp-singular", "singular"],
  ["wp-embed-responsive", "embed-responsive"],
  ["wp-theme-", "theme-"],
  ["wp-exclude-emoji", "exclude-emoji"],
  ["wpEmojiSettingsSupports", "emojiSettingsSupports"],
  ["elementor", "tdp"],
  ["Elementor", "Tdp"],
  ["ELEMENTOR", "TDP"],
  ['data-tdp-type="wp-page"', 'data-tdp-type="page"'],
  ["data-tdp-type=\\\"wp-page\\\"", "data-tdp-type=\\\"page\\\""],
  ["wordpress.org", "todoip.com"],
  ["WordPress", "TodoIP"],
  ["wordpress", "todoip"],
];

export function debrand(input) {
  if (typeof input !== "string" || input.length === 0) return input;
  let out = input;
  for (const [from, to] of REPLACEMENTS) out = out.split(from).join(to);
  return out;
}

export function debrandJson(value) {
  if (typeof value === "string") return debrand(value);
  if (Array.isArray(value)) return value.map(debrandJson);
  if (value && typeof value === "object") {
    const next = {};
    for (const [k, v] of Object.entries(value)) next[debrand(k)] = debrandJson(v);
    return next;
  }
  return value;
}
