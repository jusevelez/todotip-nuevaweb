// Slow, rate-limit friendly probes of redirects/status codes/special files.
// Merges results into capture/manifest.json (special) and downloads failed assets.
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const MANIFEST = path.join(ROOT, "capture/manifest.json");
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  for (let i = 0; i < 6; i++) {
    const res = await fetch(url, { redirect: "manual", headers: { "user-agent": UA } });
    if (res.status !== 429) return res;
    await sleep(15000 * (i + 1));
  }
  throw new Error("still 429 " + url);
}

const m = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
const only = process.argv.slice(2);
const todo = Object.entries(m.special).filter(([k, v]) => (only.length ? only.includes(k) : v.status === 429));
const extra = only.length ? [] : ["/author/", "/page/2/", "/blog/page/2/", "/?s=chatbot", "/tag/whatsapp/", "/comments/feed/", "/wp-sitemap.xml"];
for (const p of extra) todo.push(["probe:" + p, { url: "https://www.todoip.com" + p }]);

for (const [label, v] of todo) {
  const res = await get(v.url);
  const body = Buffer.from(await res.arrayBuffer());
  m.special[label] = {
    url: v.url,
    status: res.status,
    location: res.headers.get("location"),
    xRobotsTag: res.headers.get("x-robots-tag"),
    contentType: res.headers.get("content-type"),
  };
  if (label.startsWith("file:") && res.status === 200)
    await fs.writeFile(path.join(ROOT, "capture/files", label.slice(5).replace(/\//g, "_")), body);
  if (label === "404" && res.status === 404) await fs.writeFile(path.join(ROOT, "capture/html/__404.html"), body);
  console.log(label, res.status, res.headers.get("location") || "");
  await sleep(2500);
}

const stillFailed = [];
for (const f of m.assets.failed) {
  const res = await get(f.url);
  if (res.status === 200) {
    const local = path.join(ROOT, "public", decodeURIComponent(new URL(f.url).pathname));
    await fs.mkdir(path.dirname(local), { recursive: true });
    await fs.writeFile(local, Buffer.from(await res.arrayBuffer()));
  } else stillFailed.push({ url: f.url, status: res.status });
  await sleep(2500);
}
m.assets.failed = stillFailed;
await fs.writeFile(MANIFEST, JSON.stringify(m, null, 2));
console.log("asset failures remaining", stillFailed);
