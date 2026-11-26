// One-off generator for the Passport textures (Divine round 5 final pass). Run by hand:
//   node scripts/make-textures.mjs
// Writes public/brand/torn-edge.svg (mask for torn paper band edges), rustic.svg (button wear)
// and smoke.svg (the footer haze). Not part of the build.
import { writeFileSync } from "node:fs";
let s = 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);

// Torn edge: 480 x 18, opaque below a ragged line. Small teeth plus a slow wander, so it never repeats evenly.
{
  const W = 480, H = 18; let x = 0; const pts = [];
  while (x < W) { const wander = 7 + Math.sin(x / 61) * 3 + Math.sin(x / 23) * 1.5; pts.push([x, Math.max(1, Math.min(H - 3, wander + (rnd() - 0.5) * 7))]); x += 2 + rnd() * 5; }
  pts.push([W, pts[0][1]]);
  const d = `M0 ${H} ` + pts.map(([a, b]) => `L${a.toFixed(1)} ${b.toFixed(1)}`).join(" ") + ` L${W} ${H} Z`;
  writeFileSync("public/brand/torn-edge.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`);
}
// Rustic button wear: fine speckle plus a handful of hairline scratches, dark and light, very faint.
{
  const lines = [];
  for (let i = 0; i < 26; i++) {
    const x = rnd() * 200, y = rnd() * 80, len = 4 + rnd() * 16, a = (rnd() - 0.5) * 0.9 + (rnd() < 0.5 ? 0 : Math.PI);
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len * 0.5;
    const light = rnd() < 0.35;
    lines.push(`<path d="M${x.toFixed(1)} ${y.toFixed(1)} Q${((x + x2) / 2 + (rnd() - .5) * 3).toFixed(1)} ${((y + y2) / 2 + (rnd() - .5) * 2).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${light ? "#fff" : "#3a2a00"}" stroke-opacity="${light ? 0.35 : (0.18 + rnd() * 0.14).toFixed(2)}" stroke-width="${(0.35 + rnd() * 0.4).toFixed(2)}" fill="none" stroke-linecap="round"/>`);
  }
  writeFileSync("public/brand/rustic.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80">
<filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" stitchTiles="stitch"/>
<feColorMatrix values="0 0 0 0 .2  0 0 0 0 .14  0 0 0 0 0  0 0 0 -2.2 1.25"/></filter>
<filter id="b" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".035 .09" numOctaves="3" seed="9" stitchTiles="stitch"/>
<feColorMatrix values="0 0 0 0 .25  0 0 0 0 .17  0 0 0 0 0  0 0 0 -1.6 .78"/></filter>
<rect width="200" height="80" filter="url(#b)" opacity=".5"/><rect width="200" height="80" filter="url(#n)" opacity=".55"/>${lines.join("")}</svg>`);
}
// Smoke: soft white turbulence, tiles left to right without a seam.
for (const [name, seed, f] of [["smoke", 3, ".0035 .011"], ["smoke-2", 11, ".005 .016"]]) {
  writeFileSync(`public/brand/${name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 260" width="1200" height="260" preserveAspectRatio="none">
<filter id="s" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="4" seed="${seed}" stitchTiles="stitch"/>
<feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.9 -.78"/></filter>
<rect width="1200" height="260" filter="url(#s)"/></svg>`);
}
console.log("textures written");
