// One-shot: move public WP paths and rewrite identifiers in served source.
import fs from "node:fs/promises";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { debrand } from "./debrand.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const TEXT = new Set([
  ".css",
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".json",
  ".svg",
  ".xml",
  ".txt",
  ".html",
  ".xsl",
  ".md",
  ".map",
]);
const SKIP_DIR = new Set(["node_modules", ".next", "capture", ".git", "terminals"]);
const SKIP_FILE = new Set(["debrand.mjs", "apply-debrand.mjs"]);

function gitMv(from, to) {
  if (!existsSync(from)) return;
  execSync(`git mv "${from}" "${to}"`, { cwd: ROOT, stdio: "inherit" });
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function renameContaining(root, needle, replacement) {
  const dirs = [];
  const files = [];
  for (const full of walk(root)) {
    if (path.basename(full).includes(needle)) files.push(full);
  }
  function collectDirs(dir) {
    for (const name of readdirSync(dir)) {
      if (SKIP_DIR.has(name)) continue;
      const full = path.join(dir, name);
      if (!statSync(full).isDirectory()) continue;
      collectDirs(full);
      if (name.includes(needle)) dirs.push(full);
    }
  }
  collectDirs(root);
  for (const full of [...files, ...dirs]) {
    const dest = path.join(path.dirname(full), path.basename(full).split(needle).join(replacement));
    if (full === dest) continue;
    gitMv(full, dest);
  }
}

if (existsSync(path.join(ROOT, "public/wp-content"))) gitMv(path.join(ROOT, "public/wp-content"), path.join(ROOT, "public/assets"));
if (existsSync(path.join(ROOT, "public/wp-includes"))) gitMv(path.join(ROOT, "public/wp-includes"), path.join(ROOT, "public/lib"));
if (existsSync(path.join(ROOT, "src/components/elementor"))) gitMv(path.join(ROOT, "src/components/elementor"), path.join(ROOT, "src/components/tdp"));

renameContaining(path.join(ROOT, "public"), "elementor", "tdp");
renameContaining(path.join(ROOT, "public"), "Elementor", "Tdp");
renameContaining(path.join(ROOT, "src"), "Elementor", "Tdp");
renameContaining(path.join(ROOT, "src"), "elementor", "tdp");

const roots = ["src", "public", "scripts/test"].map((p) => path.join(ROOT, p));
let changed = 0;
for (const root of roots) {
  if (!existsSync(root)) continue;
  for (const file of walk(root)) {
    if (SKIP_FILE.has(path.basename(file))) continue;
    if (!TEXT.has(path.extname(file))) continue;
    const before = await fs.readFile(file, "utf8");
    const after = debrand(before);
    if (after !== before) {
      await fs.writeFile(file, after);
      changed++;
    }
  }
}

console.log("debranded files:", changed);
