// Turns a media slot into a ready-to-use picture: a small WebP for phones, larger ones for big screens.
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

export type Pic = { src: string; srcset: string; alt: string; focal: string; w: number; h: number };
export async function toPic(s: { image?: ImageMetadata; alt: string; focal?: string } | undefined, widths = [640, 1080, 1600, 2400]): Promise<Pic | undefined> {
  if (!s?.image) return undefined;
  const ws = widths.filter((w) => w <= s.image!.width);
  const list = ws.length ? ws : [s.image.width];
  // width sets the plain src (thumbs, share image, old browsers) to the largest asked-for size, not the original.
  const width = Math.max(...list);
  const r = await getImage({ src: s.image, width, height: Math.round((s.image.height * width) / s.image.width), widths: list, format: "webp" });
  return { src: r.src, srcset: r.srcSet.attribute, alt: s.alt, focal: s.focal ?? "50% 50%", w: s.image.width, h: s.image.height };
}
