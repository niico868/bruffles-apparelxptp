// Builds the archive list (every Gone piece) for /bruffles/archive and the strip on /bruffles.
import { bruffles, pad } from "../data/products";
import { pieceImages } from "../data/media";
import { getSignals } from "../data/demo-signals";
import { wallCardFor, signatureFor } from "../data/wall";
import { toPic } from "./pic";
import type { ArchiveItem } from "../components/ArchiveList";

export async function archiveItems(): Promise<ArchiveItem[]> {
  const gone = bruffles.filter((p) => p.sold).sort((a, b) => b.pieceNo - a.pieceNo);
  return Promise.all(gone.map(async (p) => {
    const pic = await toPic(pieceImages(p.id, p.name)[0], [480, 800, 1200]);
    const card = wallCardFor(p.id);
    const s = card && signatureFor(card.signer);
    return {
      id: p.id, pieceNo: p.pieceNo, num: pad(p.pieceNo), name: p.name, maker: p.maker, size: p.size,
      requests: getSignals(p.pieceNo).requests,
      pic: pic && { src: pic.src, srcset: pic.srcset, alt: pic.alt, w: pic.w, h: pic.h },
      sig: s && card ? { ...s, area: card.area } : undefined,
    };
  }));
}
