// Prints the vertical bands (y ranges) where a pixelmatch diff image has mismatches.
import fs from "node:fs"; import { PNG } from "pngjs";
const d = PNG.sync.read(fs.readFileSync(process.argv[2]));
let bands=[]; let cur=null;
for (let y=0;y<d.height;y++){ let c=0; for(let x=0;x<d.width;x++){const i=(y*d.width+x)*4; if(d.data[i]>200&&d.data[i+1]<80) c++;}
 const bad=c>d.width*0.02; if(bad&&!cur) cur=[y,y]; else if(bad) cur[1]=y; else if(cur){ if(y-cur[1]>20){bands.push(cur);cur=null;} } }
if(cur)bands.push(cur); console.log(bands.slice(0,15).map(b=>b.join("-")).join(" "));
