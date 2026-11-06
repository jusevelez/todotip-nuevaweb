// Rewrites absolute https://(www.)todoip.com/... references inside the mirrored
// stylesheets to root-relative paths, so the clone never fetches assets from the
// live WordPress host (and avoids cross-origin mask/font errors). Reports any
// referenced same-host file that is missing from public/.
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const PUBLIC = path.join(ROOT, "public");
const ABS = /https?:(?:\\?\/){2}(?:www\.)?todoip\.com(?=\\?\/)/g;

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith(".css")) yield p;
  }
}

const missing = new Set();
let changed = 0;
for await (const file of walk(PUBLIC)) {
  const src = await fs.readFile(file, "utf8");
  const out = src.replace(ABS, "");
  if (out !== src) {
    await fs.writeFile(file, out);
    changed++;
  }
  for (const m of out.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    const ref = m[1].replace(/\\\//g, "/");
    if (/^(data:|https?:|#)/.test(ref)) continue;
    const abs = ref.startsWith("/") ? path.join(PUBLIC, ref.split(/[?#]/)[0]) : path.resolve(path.dirname(file), ref.split(/[?#]/)[0]);
    await fs.stat(abs).catch(() => missing.add(path.relative(PUBLIC, abs)));
  }
}
console.log(`rewrote ${changed} stylesheet(s)`);
if (missing.size) console.log(`missing referenced files (${missing.size}):\n  ${[...missing].join("\n  ")}`);
