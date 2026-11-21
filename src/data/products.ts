// Mock catalogue for the Phase 0 demo. Replaced by Supabase in Phase 1.
export type BruffelsPiece = {
  brand: "brussels"; id: string; pieceNo: number; name: string; maker: string;
  source: string; condition: string; size: string; priceUsd: number; sold: boolean;
  description: string; measurements: Record<string, string>; receiptRef?: string;
  favorites: number; carts: number; // demand signals; mock until Phase 1 tracks them
};
export type PassportItem = {
  brand: "passport"; id: string; itemNo: number; name: string; priceUsd: number;
  qty: number; packOf: number; description: string;
};

export const brussels: BruffelsPiece[] = [
  { brand: "brussels", id: "BSA-047", favorites: 42, carts: 11, pieceNo: 47, name: "Tech Fleece Windrunner", maker: "Nike", source: "nike.com", condition: "New with tags", size: "M", priceUsd: 18500, sold: false,
    description: "Heather grey tech fleece with a full-length zip and a chevron yoke. Bought new from Nike's official store; tags intact.",
    measurements: { Chest: "58 cm", Length: "71 cm", Sleeve: "64 cm", Shoulder: "47 cm" }, receiptRef: "Restock 2026-11 · Order #1" },
  { brand: "brussels", id: "BSA-046", favorites: 67, carts: 19, pieceNo: 46, name: "Club Fleece Cargo Pant", maker: "Nike", source: "nike.com", condition: "New with tags", size: "L", priceUsd: 9500, sold: true,
    description: "Washed black cargo jogger in brushed-back fleece.", measurements: { Waist: "84 cm", Inseam: "76 cm" } },
  { brand: "brussels", id: "BSA-045", favorites: 23, carts: 6, pieceNo: 45, name: "Oversized Logo Tee", maker: "Stüssy", source: "stussy.com", condition: "New with tags", size: "L", priceUsd: 7000, sold: false,
    description: "Pigment-dyed heavyweight tee.", measurements: { Chest: "60 cm", Length: "74 cm" } },
  { brand: "brussels", id: "BSA-044", favorites: 31, carts: 8, pieceNo: 44, name: "Coach Jacket", maker: "Carhartt WIP", source: "carhartt-wip.com", condition: "New with tags", size: "M", priceUsd: 16000, sold: false,
    description: "Water-repellent nylon coach jacket.", measurements: { Chest: "59 cm", Length: "70 cm" } },
];

export const passport: PassportItem[] = [
  { brand: "passport", id: "PTP-12", itemNo: 12, name: "Brass Grinder, 4-Piece", priceUsd: 2400, qty: 40, packOf: 1, description: "Machined brass, magnetic lid." },
  { brand: "passport", id: "PTP-11", itemNo: 11, name: "Rolling Papers, King Slim", priceUsd: 3600, qty: 120, packOf: 50, description: "Unbleached. Box of 50 booklets." },
  { brand: "passport", id: "PTP-10", itemNo: 10, name: "Glass Tips, Clear", priceUsd: 1800, qty: 0, packOf: 25, description: "Borosilicate. Pack of 25." },
  { brand: "passport", id: "PTP-09", itemNo: 9, name: "Travel Stash Tin", priceUsd: 1500, qty: 64, packOf: 1, description: "Airtight aluminium tin." },
];

export const pad = (n: number, w = 3) => String(n).padStart(w, "0");
