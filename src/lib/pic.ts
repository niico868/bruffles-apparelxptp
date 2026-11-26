// Turns a media slot into a ready-to-use picture: a small WebP for phones, larger ones for big screens,
// plus an AVIF set (about a third smaller again) that Img.astro and the hero offer first (round 5,
// mobile data). Browsers without AVIF fall back to the WebP set.
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

// AVIF switch: off while we find out why the Cloudflare build fails with it on (round 5).
const AVIF = false;
export type Pic = { src: string; srcset: string; avif?: string; alt: string; focal: string; w: number; h: number };
export async function toPic(s: { image?: ImageMetadata; alt: string; focal?: string } | undefined, widths = [640, 1080, 1600, 2400]): Promise<Pic | undefined> {
  if (!s?.image) return undefined;
  const ws = widths.filter((w) => w <= s.image!.width);
  const list = ws.length ? ws : [s.image.width];
  // width sets the plain src (thumbs, share image, old browsers) to the largest asked-for size, not the original.
  const width = Math.max(...list);
  const height = Math.round((s.image.height * width) / s.image.width);
  const r = await getImage({ src: s.image, width, height, widths: list, format: "webp", quality: 74 });
  const a = AVIF ? await getImage({ src: s.image, width, height, widths: list, format: "avif", quality: 52 }) : undefined;
  return { src: r.src, srcset: r.srcSet.attribute, avif: a?.srcSet.attribute, alt: s.alt, focal: s.focal ?? "50% 50%", w: s.image.width, h: s.image.height };
}
