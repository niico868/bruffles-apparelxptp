// Mock catalogue for the client demo. Names, prices and pieces are placeholders, not real stock.
// Replaced by Supabase in Phase 1. Piece ID prefix BA confirmed by Divine 2026-11-24.
export type BrufflesPiece = {
  brand: "bruffles"; id: string; pieceNo: number; name: string; maker: string;
  condition: string; size: string; priceUsd: number; sold: boolean;
  description: string; measurements: Record<string, string>; receiptRef?: string;
};
export type PassportItem = {
  brand: "passport"; id: string; name: string; priceUsd: number;
  qty: number; packOf: number; description: string;
};

export const bruffles: BrufflesPiece[] = [
  { brand: "bruffles", id: "BA-047", pieceNo: 47, name: "Tech Fleece Windrunner", maker: "Nike", condition: "New with tags", size: "M", priceUsd: 18500, sold: false,
    description: "Heather grey tech fleece with a full-length zip and a chevron yoke. Tags intact.",
    measurements: { Chest: "58 cm", Length: "71 cm", Sleeve: "64 cm", Shoulder: "47 cm" }, receiptRef: "Restock 2026-11 · Order #1" },
  { brand: "bruffles", id: "BA-046", pieceNo: 46, name: "Club Fleece Cargo Pant", maker: "Nike", condition: "New with tags", size: "L", priceUsd: 9500, sold: true,
    description: "Washed black cargo jogger in brushed-back fleece.", measurements: { Waist: "84 cm", Inseam: "76 cm" } },
  { brand: "bruffles", id: "BA-045", pieceNo: 45, name: "Oversized Logo Tee", maker: "Stüssy", condition: "New with tags", size: "L", priceUsd: 7000, sold: false,
    description: "Pigment-dyed heavyweight tee.", measurements: { Chest: "60 cm", Length: "74 cm" } },
  { brand: "bruffles", id: "BA-044", pieceNo: 44, name: "Coach Jacket", maker: "Carhartt WIP", condition: "New with tags", size: "M", priceUsd: 16000, sold: false,
    description: "Water-repellent nylon coach jacket.", measurements: { Chest: "59 cm", Length: "70 cm" } },
  { brand: "bruffles", id: "BA-043", pieceNo: 43, name: "Essentials Hoodie", maker: "Fear of God", condition: "New with tags", size: "M", priceUsd: 14000, sold: true,
    description: "Heavyweight fleece hoodie in oatmeal.", measurements: { Chest: "62 cm", Length: "72 cm" } },
  { brand: "bruffles", id: "BA-042", pieceNo: 42, name: "Fitted Cap, Yankees", maker: "New Era", condition: "New with tags", size: "7 3/8", priceUsd: 4500, sold: false,
    description: "59FIFTY fitted cap in black.", measurements: { Size: "7 3/8" } },
  { brand: "bruffles", id: "BA-041", pieceNo: 41, name: "Nuptse Vest", maker: "The North Face", condition: "New with tags", size: "L", priceUsd: 15500, sold: true,
    description: "700-fill down vest in black.", measurements: { Chest: "61 cm", Length: "68 cm" } },
  // Older demo pieces that have already sold (2026-11-25): they fill the archive and the Customer
  // Verified wall. No product photos yet, so they show the labelled placeholder.
  { brand: "bruffles", id: "BA-040", pieceNo: 40, name: "Tech Fleece Full-Zip Hoodie", maker: "Nike", condition: "New with tags", size: "M", priceUsd: 16500, sold: true,
    description: "Dark grey heather tech fleece hoodie.", measurements: { Chest: "57 cm", Length: "70 cm" } },
  { brand: "bruffles", id: "BA-039", pieceNo: 39, name: "Classic Fit Mesh Polo, Navy", maker: "Polo Ralph Lauren", condition: "New with tags", size: "M", priceUsd: 9000, sold: true,
    description: "Cotton piqué polo in navy.", measurements: { Chest: "56 cm", Length: "74 cm" } },
  { brand: "bruffles", id: "BA-038", pieceNo: 38, name: "Reverse Weave Crewneck", maker: "Champion", condition: "New with tags", size: "S", priceUsd: 7500, sold: true,
    description: "Heavyweight crewneck sweatshirt in cream.", measurements: { Chest: "55 cm", Length: "66 cm" } },
  { brand: "bruffles", id: "BA-036", pieceNo: 36, name: "Cyclone Windbreaker", maker: "The North Face", condition: "New with tags", size: "L", priceUsd: 12000, sold: true,
    description: "Packable black wind shell with a stowable hood.", measurements: { Chest: "62 cm", Length: "72 cm" } },
  { brand: "bruffles", id: "BA-035", pieceNo: 35, name: "Custom Slim Fit Polo, Red", maker: "Polo Ralph Lauren", condition: "New with tags", size: "L", priceUsd: 9000, sold: true,
    description: "Cotton piqué polo in a deep red.", measurements: { Chest: "57 cm", Length: "75 cm" } },
];

export const passport: PassportItem[] = [
  { brand: "passport", id: "PTP-12", name: "Brass Grinder, 4-Piece", priceUsd: 2400, qty: 40, packOf: 1, description: "Machined brass, magnetic lid." },
  { brand: "passport", id: "PTP-11", name: "Rolling Papers, King Slim", priceUsd: 3600, qty: 120, packOf: 50, description: "Unbleached. Box of 50 booklets." },
  { brand: "passport", id: "PTP-10", name: "Glass Tips, Clear", priceUsd: 1800, qty: 0, packOf: 25, description: "Borosilicate. Pack of 25." },
  { brand: "passport", id: "PTP-09", name: "Travel Stash Tin", priceUsd: 1500, qty: 64, packOf: 1, description: "Airtight aluminium tin." },
  { brand: "passport", id: "PTP-08", name: "Filter Tips, Slim", priceUsd: 1200, qty: 200, packOf: 50, description: "Unbleached card tips. Pack of 50 booklets." },
  { brand: "passport", id: "PTP-07", name: "Rolling Tray, Medium", priceUsd: 2200, qty: 30, packOf: 1, description: "Metal tray with raised edges." },
];

export const pad = (n: number, w = 3) => String(n).padStart(w, "0");
