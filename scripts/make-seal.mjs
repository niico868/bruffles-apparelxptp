// Builds the "Authenticated" seal (Divine round 5, 2026-11-26: option B, a Victorian copperplate
// stamp with a thin ring). Output: public/brand/seal-authenticated.svg and -light.svg (for dark grounds).
// Text is turned into outlines with opentype.js, so no font is downloaded by visitors.
// Fonts (OFL): scripts/fonts/PinyonScript.woff (copperplate script), CormorantGaramond-600.woff (ring capitals).
import opentype from "opentype.js";
import { readFileSync, writeFileSync } from "node:fs";
const load = (f) => opentype.parse(readFileSync(`scripts/fonts/${f}`).buffer.slice(0));
const script = load("PinyonScript.woff"), caps = load("CormorantGaramond-600.woff");
const C = 60, f2 = (n) => +n.toFixed(2);

// Capitals around the ring, reading clockwise from the top left.
function ring(text, r, size, track) {
  const glyphs = caps.stringToGlyphs(text), scale = size / caps.unitsPerEm;
  const widths = glyphs.map((g) => g.advanceWidth * scale + track);
  const total = widths.reduce((a, b) => a + b, 0);
  let a = -Math.PI / 2 - total / r / 2, out = "";
  glyphs.forEach((g, i) => {
    const mid = a + widths[i] / 2 / r;
    const x = C + r * Math.cos(mid), y = C + r * Math.sin(mid);
    const d = g.getPath(-g.advanceWidth * scale / 2, 0, size).toPathData(1);
    if (d) out += `<path transform="translate(${f2(x)} ${f2(y)}) rotate(${f2((mid * 180) / Math.PI + 90)})" d="${d}"/>`;
    a += widths[i] / r;
  });
  return out;
}
// Lower arc, reading left to right along the bottom.
function ringBottom(text, r, size, track) {
  const glyphs = caps.stringToGlyphs(text), scale = size / caps.unitsPerEm;
  const widths = glyphs.map((g) => g.advanceWidth * scale + track);
  const total = widths.reduce((a, b) => a + b, 0);
  let a = Math.PI / 2 + total / r / 2, out = "";
  glyphs.forEach((g, i) => {
    const mid = a - widths[i] / 2 / r;
    const x = C + r * Math.cos(mid), y = C + r * Math.sin(mid);
    const d = g.getPath(-g.advanceWidth * scale / 2, size * 0.7, size).toPathData(1);
    if (d) out += `<path transform="translate(${f2(x)} ${f2(y)}) rotate(${f2((mid * 180) / Math.PI - 90)})" d="${d}"/>`;
    a -= widths[i] / r;
  });
  return out;
}
function centred(font, text, size, y, maxW) {
  let p = font.getPath(text, 0, 0, size);
  let b = p.getBoundingBox();
  const k = Math.min(1, maxW / (b.x2 - b.x1));
  p = font.getPath(text, 0, 0, size * k); b = p.getBoundingBox();
  return font.getPath(text, C - (b.x1 + b.x2) / 2, y, size * k).toPathData(1);
}
const star = (x, y, s) => `<path d="M${x} ${y - s}L${x + s * .3} ${y - s * .3}L${x + s} ${y}L${x + s * .3} ${y + s * .3}L${x} ${y + s}L${x - s * .3} ${y + s * .3}L${x - s} ${y}L${x - s * .3} ${y - s * .3}Z"/>`;

function seal(ink) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Authenticated, Bruffles Apparel seal">
<g fill="none" stroke="${ink}"><circle cx="60" cy="60" r="57" stroke-width="1.4"/><circle cx="60" cy="60" r="54.2" stroke-width=".5"/><circle cx="60" cy="60" r="38.5" stroke-width=".6"/></g>
<g fill="${ink}">${ring("BRUFFLES APPAREL", 43, 8.6, 1.5)}${ringBottom("CUSTOMER VERIFIED", 43, 7.6, 1.2)}
${star(19.5, 60, 2.4)}${star(100.5, 60, 2.4)}
<path d="${centred(script, "Authenticated", 23, 63, 70)}"/>
<path d="M44 71.5 Q60 67.5 76 71.5" fill="none" stroke="${ink}" stroke-width=".7" stroke-linecap="round"/>
<path d="${centred(caps, "ONE OF ONE", 6, 81, 34)}"/></g></svg>`;
}
writeFileSync("public/brand/seal-authenticated.svg", seal("#8F6E26"));
writeFileSync("public/brand/seal-authenticated-light.svg", seal("#D9B866"));
console.log("seal: public/brand/seal-authenticated(.svg|-light.svg)");
