// Customer Verified wall: sample cards for the demo (2026-11-25). Each card is a Gone piece that a
// customer "signed for" on delivery. The page shows the area only, never a full name. The first names
// below are only used to draw the handwritten signature at build time (scripts/make-signatures.mjs).
// Fit pics are AI-generated samples (Higgsfield), demo only. See /credits.
import type { ImageMetadata } from "astro";
import fit1 from "../assets/wall/fit-01.png";
import fit2 from "../assets/wall/fit-02.png";
import fit3 from "../assets/wall/fit-03.png";
import fit4 from "../assets/wall/fit-04.png";
import fit5 from "../assets/wall/fit-05.png";
import sigs from "./signatures.json";

export type WallCard = {
  id: string; area: string; signer: string;
  fit?: { image: ImageMetadata; alt: string };
};

export const wall: WallCard[] = [
  { id: "BA-040", area: "Tunapuna", signer: "Jaden", fit: { image: fit1, alt: "Mirror selfie of a customer in a grey tech fleece hoodie and joggers, in his bedroom." } },
  { id: "BA-046", area: "Arima", signer: "Darnell" },
  { id: "BA-039", area: "Chaguanas", signer: "Arjun", fit: { image: fit2, alt: "A customer in a navy polo and jeans standing by a galvanize fence in late sun." } },
  { id: "BA-038", area: "Diego Martin", signer: "Aaliyah", fit: { image: fit3, alt: "A laughing customer in a cream crewneck on a tiled porch with potted plants." } },
  { id: "BA-043", area: "Point Fortin", signer: "Kirk" },
  { id: "BA-036", area: "San Fernando", signer: "Malik", fit: { image: fit4, alt: "A customer in a black windbreaker leaning on a silver car at night, lit by flash." } },
  { id: "BA-041", area: "Port of Spain", signer: "Shania" },
  { id: "BA-035", area: "Couva", signer: "Renee", fit: { image: fit5, alt: "Hands lifting a folded red polo out of a black box lined with tissue paper, a card beside it." } },
];

type Sig = { d: string; w: number; h: number };
/** The signature SVG path for a signer's first name (generated at build time). */
export const signatureFor = (name: string): Sig | undefined => (sigs as Record<string, Sig>)[name];
export const wallCardFor = (id: string) => wall.find((c) => c.id === id);

// Seeded tilt and drop, so the wall looks hand-pinned but identical on every visit.
// Rotation between -2° and +2°, vertical offset 0 to 28px, both from the piece number.
export function pin(pieceNo: number) {
  const r1 = frac(Math.sin(pieceNo * 12.9898) * 43758.5453);
  const r2 = frac(Math.sin(pieceNo * 78.233) * 12543.123);
  return { rot: +(r1 * 4 - 2).toFixed(2), drop: Math.round(r2 * 28) };
}
const frac = (x: number) => x - Math.floor(x);
