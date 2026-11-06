// Builds a downscaled live | clone | diff strip for a slice of a visual capture.
//   node scripts/test/side-by-side.mjs home-desktop [startY] [height] [scale]
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const [name, startY = "0", height = "1800", scale = "0.4"] = process.argv.slice(2);
const dir = path.join(ROOT, "artifacts/visual");
const imgs = ["live", "clone", "diff"].map((k) => PNG.sync.read(fs.readFileSync(path.join(dir, k, `${name}.png`))));
const s = Number(scale);
const y0 = Number(startY);
const H = Number(height);
const colW = Math.max(...imgs.map((i) => i.width));
const out = new PNG({ width: Math.round(colW * 3 * s) + 20, height: Math.round(H * s) });
out.data.fill(255);
imgs.forEach((img, col) => {
  for (let y = 0; y < out.height; y++) {
    for (let x = 0; x < Math.round(colW * s); x++) {
      const sx = Math.floor(x / s);
      const sy = y0 + Math.floor(y / s);
      if (sx >= img.width || sy >= img.height) continue;
      const si = (sy * img.width + sx) * 4;
      const di = (y * out.width + x + col * (Math.round(colW * s) + 10)) * 4;
      img.data.copy(out.data, di, si, si + 4);
    }
  }
});
const file = path.join(dir, `sbs-${name}-${y0}.png`);
fs.writeFileSync(file, PNG.sync.write(out));
console.log(file);
