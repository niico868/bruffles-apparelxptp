// Runs before every build. Like an airline scale: stops the build if a photo or film is too heavy,
// a listed alt text is missing, or a file is in the wrong format. Empty slots are only a warning.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const KB = 1024, MB = 1024 * KB;
const IMG = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const errors = [], warnings = [];
const walk = (d) => existsSync(d) ? readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; }) : [];

for (const f of walk("src/assets/media")) {
  const ext = extname(f).toLowerCase();
  if (ext === ".md" || f.endsWith(".gitkeep")) continue;
  if (!IMG.includes(ext)) { errors.push(`${f}: photos must be JPG, PNG, WebP or AVIF (films go in public/media/)`); continue; }
  const size = statSync(f).size;
  if (size > 600 * KB) errors.push(`${f}: ${(size / KB).toFixed(0)} KB is over the 600 KB limit. Export it smaller (see the README in that folder).`);
}
for (const f of walk("public/media")) {
  const ext = extname(f).toLowerCase();
  if (ext === ".md" || f.endsWith(".gitkeep")) continue;
  if (ext === ".json") continue;   // manifest.json (credits for every asset)
  if (ext === ".avif") { if (statSync(f).size > 200 * KB) errors.push(`${f}: a poster must be under 200 KB.`); continue; }   // film posters
  if (![".mp4", ".webm"].includes(ext)) { errors.push(`${f}: only MP4 or WebM films (and AVIF posters) go in public/media/ (photos go in src/assets/media/)`); continue; }
  // Budgets: phone hero films 1.2 MB, computer hero films 2.5 MB (Passport compilation spec), other hero 4 MB, campaign film 8 MB.
  const cap = f.includes("film.") ? 8 * MB : f.includes("-mobile.") ? 1.2 * MB : f.includes("hero-pp") ? 2.5 * MB : 4 * MB;
  const size = statSync(f).size;
  if (size > cap) errors.push(`${f}: ${(size / MB).toFixed(1)} MB is over the ${cap / MB} MB limit.`);
}

const manifest = JSON.parse(readFileSync("src/data/media.json", "utf8"));
const slots = [];
const visit = (o) => { if (Array.isArray(o)) o.forEach(visit); else if (o && typeof o === "object") { if (typeof o.file === "string") slots.push(o); Object.values(o).forEach(visit); } };
visit(manifest);
let empty = 0;
for (const s of slots) {
  const found = IMG.some((e) => existsSync(`src/assets/media/${s.file}${e}`));
  if (!found) { empty++; continue; }
  if (!s.alt || !s.alt.trim()) errors.push(`media.json: "${s.file}" has a photo but no alt text. Add one plain sentence describing it.`);
}
// Guard (2026-11-25): both hero sides must ship a still AND a film. An empty Passport panel went live
// once without anyone noticing; this makes the build fail instead.
for (const side of ["bf", "pp"]) {
  const h = manifest.hero[side];
  for (const k of ["desktop", "mobile"]) {
    if (!IMG.some((e) => existsSync(`src/assets/media/${h[k].file}${e}`))) errors.push(`hero.${side}.${k}: no still found for "${h[k].file}". Both hero sides need a desktop and a mobile still.`);
  }
  if (!h.video || !existsSync(`public/media/${h.video}`)) errors.push(`hero.${side}.video: no film found at public/media/${h.video}. Both hero sides need a film.`);
}

if (empty) warnings.push(`${empty} of ${slots.length} homepage photo slots are empty (placeholders will show).`);

warnings.forEach((w) => console.warn(`check-media: ${w}`));
if (errors.length) { errors.forEach((e) => console.error(`check-media: ${e}`)); process.exit(1); }
console.log("check-media: all media within limits.");
