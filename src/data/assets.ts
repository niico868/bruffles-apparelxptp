// Stock and sample assets, keyed by slot. Alt text and credits come from public/media/manifest.json,
// so the page, the credits page and the manifest can never disagree.
import manifest from "../../public/media/manifest.json";
import { findImage } from "./media";
export const assets = manifest.assets;
export const asset = (slot: string, file: string) => {
  const row = assets.find((a) => a.slot === slot);
  return { image: findImage(file), alt: row?.alt ?? "", focal: "50% 50%" };
};
