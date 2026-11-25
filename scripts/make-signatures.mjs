// Builds the Customer Verified signatures (runs before every build, and by hand with `node scripts/make-signatures.mjs`).
// Each signer's first name is set in a handwriting font, turned into an SVG outline with opentype.js
// (a dev dependency only: nothing ships to the browser), then roughened so it doesn't look typed:
// every point is nudged a fraction of a pixel, each letter rides a slightly wavy baseline and leans
// a little differently. A seeded random generator keeps the result identical on every build.
// Fonts (Google Fonts, Apache 2.0 / OFL): scripts/fonts/HomemadeApple.ttf, MrsSaintDelafield.ttf.
import opentype from "opentype.js";
import { writeFileSync, readFileSync } from "node:fs";

const SIGNERS = [
  ["Jaden", "MrsSaintDelafield"], ["Darnell", "HomemadeApple"], ["Arjun", "MrsSaintDelafield"], ["Aaliyah", "HomemadeApple"],
  ["Kirk", "MrsSaintDelafield"], ["Malik", "HomemadeApple"], ["Shania", "MrsSaintDelafield"], ["Renee", "HomemadeApple"],
];
const SIZE = { HomemadeApple: 64, MrsSaintDelafield: 96 };   // optical match: Mrs Saint Delafield draws small
const fonts = Object.fromEntries(Object.keys(SIZE).map((f) => [f, opentype.parse(readFileSync(`scripts/fonts/${f}.ttf`).buffer)]));

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
const seedOf = (str) => [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

const out = {};
for (const [name, fontName] of SIGNERS) {
  const font = fonts[fontName], size = SIZE[fontName], r = rng(seedOf(name));
  const glyphs = font.stringToGlyphs(name);
  const scale = size / font.unitsPerEm;
  let x = 0;
  const cmds = [];
  glyphs.forEach((g, i) => {
    const wave = Math.sin(i * 0.9 + r() * 2) * size * 0.035;           // wavy baseline
    const lean = (r() - 0.5) * 0.08;                                     // per-letter slant, about ±2.3°
    const p = g.getPath(x, size + wave, size);
    for (const c of p.commands) {
      const j = (v, ax) => v + (r() - 0.5) * size * 0.012 + (ax === "x" ? lean * (size - (c.y ?? 0)) * 0.25 : 0);
      const n = { ...c };
      for (const [k, ax] of [["x", "x"], ["y", "y"], ["x1", "x"], ["y1", "y"], ["x2", "x"], ["y2", "y"]]) if (n[k] !== undefined) n[k] = j(n[k], ax);
      cmds.push(n);
    }
    x += g.advanceWidth * scale + (i < glyphs.length - 1 ? font.getKerningValue(g, glyphs[i + 1]) * scale : 0);
  });
  const path = new opentype.Path(); path.commands = cmds;
  const b = path.getBoundingBox(), pad = 4;
  // Move to the origin so the viewBox starts at 0,0.
  for (const c of cmds) for (const k of ["x", "x1", "x2"]) if (c[k] !== undefined) c[k] -= b.x1 - pad;
  for (const c of cmds) for (const k of ["y", "y1", "y2"]) if (c[k] !== undefined) c[k] -= b.y1 - pad;
  out[name] = { d: path.toPathData(1), w: Math.ceil(b.x2 - b.x1 + pad * 2), h: Math.ceil(b.y2 - b.y1 + pad * 2) };
}
writeFileSync("src/data/signatures.json", JSON.stringify(out, null, 0) + "\n");
console.log(`make-signatures: ${Object.keys(out).length} signatures written.`);
