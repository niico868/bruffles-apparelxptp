// Media framework for the KOI merge. Slots are listed in media.json (the file Divine fills in).
// Photos live in src/assets/media/ so Astro makes small WebP copies for phones at build time.
// Films live in public/media/ and are served as they are. An empty slot returns no image and the
// page shows its placeholder, so the site always looks finished.
import type { ImageMetadata } from "astro";
import { existsSync } from "node:fs";
import raw from "./media.json";

const files = import.meta.glob<{ default: ImageMetadata }>("../assets/media/**/*.{jpg,jpeg,png,webp,avif}", { eager: true });
const EXT = ["jpg", "jpeg", "png", "webp", "avif"];
export const findImage = (base: string) => {
  for (const e of EXT) { const f = files[`../assets/media/${base}.${e}`]; if (f) return f.default; }
};
// Only used in .astro frontmatter (build time), never in the browser.
export const findVideo = (path?: string) => (path && existsSync(`public/media/${path}`) ? `/media/${path}` : undefined);
// Poster AVIF lives next to the films in public/media/.
const findPoster = (path?: string) => (path && existsSync(`public/media/${path}`) ? `/media/${path}` : undefined);

// A hero film: MP4 (H.264) for every browser plus an optional VP9 WebM, and an optional smaller
// pair for phones. Both hero sides must have one: scripts/check-media.mjs stops the build otherwise.
export type HeroVideo = { mp4: string; webm?: string; mobileMp4?: string; mobileWebm?: string; poster?: string };
type RawSide = { video?: string; videoWebm?: string; videoMobile?: string; videoMobileWebm?: string; poster?: string };
const heroVideo = (r: RawSide): HeroVideo | undefined => {
  const mp4 = findVideo(r.video);
  if (!mp4) return undefined;
  return { mp4, webm: findVideo(r.videoWebm), mobileMp4: findVideo(r.videoMobile), mobileWebm: findVideo(r.videoMobileWebm), poster: findPoster(r.poster) };
};

export type Slot = { file: string; alt: string; focal?: string; image?: ImageMetadata };
const fill = <T extends { file: string }>(s: T) => ({ focal: "50% 50%", ...s, image: findImage(s.file) });

export const media = {
  hero: {
    bf: { desktop: fill(raw.hero.bf.desktop), mobile: fill(raw.hero.bf.mobile), video: heroVideo(raw.hero.bf) },
    pp: { desktop: fill(raw.hero.pp.desktop), mobile: fill(raw.hero.pp.mobile), video: heroVideo(raw.hero.pp as RawSide) },
  },
  film: { video: findVideo(raw.film.video), poster: fill(raw.film.poster), label: raw.film.label },
  ppTwoUp: raw.ppTwoUp.map(fill),
};

// Bruffles product photos (Divine, 2026-11-25): one white-ground studio flat lay per piece, named by
// piece ID: src/assets/media/pieces/BA-047.jpg. It is the shop card, the first gallery photo and the
// share image. Optional detail shots for a piece's page go in a folder of the same name, numbered in
// gallery order with the label after the number: pieces/BA-047/02-back.jpg, 03-zip.jpg ...
// A missing main photo returns no image and the page shows its labelled placeholder.
const label = (slug: string) => slug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
// Demo-only sold pieces (BA-035 to BA-040) have no flat lay yet, so they borrow their sample fit
// photo from the Customer Verified wall. Replace with real flat lays before launch.
const fits = import.meta.glob<{ default: ImageMetadata }>("../assets/wall/fit-*.png", { eager: true });
const FIT_FOR: Record<string, string> = { "BA-040": "01", "BA-039": "02", "BA-038": "03", "BA-036": "04", "BA-035": "05" };
export function pieceImages(id: string, name: string) {
  const flat = findImage(`pieces/${id}`);
  const fit = !flat && FIT_FOR[id] ? fits[`../assets/wall/fit-${FIT_FOR[id]}.png`]?.default : undefined;
  const main = fit
    ? { label: "Fit", image: fit, alt: `${name}, worn by its owner (sample photo)` }
    : { label: "Flat lay", image: flat, alt: `${name}, studio flat lay on white` };
  const prefix = `../assets/media/pieces/${id}/`;
  const details = Object.keys(files).filter((k) => k.startsWith(prefix)).sort().map((k) => {
    const slug = k.slice(prefix.length).replace(/\.\w+$/, "").replace(/^\d+-/, "");
    return { label: label(slug), image: files[k].default, alt: `${name}, ${label(slug).toLowerCase()} detail` };
  });
  return [main, ...details];
}

// Photos for one colourway of a piece. The first colourway is the piece's own photos; others
// live in pieces/<ID>-<key>/, numbered in gallery order with the label after the number.
export function variantImages(id: string, name: string, key: string, first: boolean, colour: string) {
  if (first) return pieceImages(id, name).map((x) => ({ ...x, alt: `${x.alt}, ${colour.toLowerCase()}` }));
  const prefix = `../assets/media/pieces/${id}-${key}/`;
  return Object.keys(files).filter((k) => k.startsWith(prefix)).sort().map((k) => {
    const slug = k.slice(prefix.length).replace(/\.\w+$/, "").replace(/^\d+-/, "");
    return { label: label(slug), image: files[k].default, alt: `${name}, ${colour.toLowerCase()}, ${label(slug).toLowerCase()}` };
  });
}

// Passport product photos: one per item, named by item ID: src/assets/media/passport/PTP-12.jpg.
// Styled on warm wood; flat items shot from above, standing items from the front.
export const passportImage = (id: string, name: string) => ({ image: findImage(`passport/${id}`), alt: `${name}, product photo on wood` });
