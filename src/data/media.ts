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

export type Slot = { file: string; alt: string; focal?: string; image?: ImageMetadata };
const fill = <T extends { file: string }>(s: T) => ({ focal: "50% 50%", ...s, image: findImage(s.file) });

export const media = {
  hero: {
    bf: { desktop: fill(raw.hero.bf.desktop), mobile: fill(raw.hero.bf.mobile), video: findVideo(raw.hero.bf.video) },
    pp: { desktop: fill(raw.hero.pp.desktop), mobile: fill(raw.hero.pp.mobile), video: findVideo(raw.hero.pp.video) },
  },
  film: { video: findVideo(raw.film.video), poster: fill(raw.film.poster), label: raw.film.label },
  ppTwoUp: raw.ppTwoUp.map(fill),
  wall: raw.wall.map(fill),
};

// Product photos: ONE studio flat lay per piece (Divine, 2026-11-25), named by piece ID:
// src/assets/media/pieces/BA-047.jpg. Used for the shop card, the product page and the share image.
// A missing photo returns no image and the page shows its labelled placeholder.
export function pieceImage(id: string, name: string) {
  return { label: "Flat lay", image: findImage(`pieces/${id}`), alt: `${name}, studio flat lay` };
}
