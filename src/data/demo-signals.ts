// DEMO DATA. Replace with real counts before launch. Never ship invented numbers.
//
// Every number the demo shows about demand lives in this one file: bags, saves, "Request it back"
// requests, the Customer Verified total and the Drop Log. Components never read this object directly;
// they call getSignals() / getDemo(), so the live version can swap in real counts from the database
// without touching a single component.
//
//   bags      people with this piece in their bag right now (unsold pieces)
//   saves     people who tapped the heart (unsold pieces)
//   requests  people who asked us to find another one (Gone pieces, "Request it back")

export type Signals = { bags: number; saves: number; requests: number };

const signals: Record<number, Signals> = {
  47: { bags: 3, saves: 21, requests: 0 },
  45: { bags: 0, saves: 9, requests: 0 },
  44: { bags: 1, saves: 14, requests: 0 },
  42: { bags: 2, saves: 6, requests: 0 },
  46: { bags: 0, saves: 0, requests: 18 },
  43: { bags: 0, saves: 0, requests: 7 },
  41: { bags: 0, saves: 0, requests: 31 },
  40: { bags: 0, saves: 0, requests: 12 },
  39: { bags: 0, saves: 0, requests: 9 },
  38: { bags: 0, saves: 0, requests: 4 },
  36: { bags: 0, saves: 0, requests: 22 },
  35: { bags: 0, saves: 0, requests: 15 },
};

const ZERO: Signals = { bags: 0, saves: 0, requests: 0 };

/** Demand counts for one piece (by piece number, e.g. 47). Live version: read from the database. */
export function getSignals(piece: number): Signals {
  return signals[piece] ?? ZERO;
}

// Site-wide demo figures.
const demo = {
  // Customer Verified wall header: "147 pieces signed for".
  signedFor: 147,
  // Drop Log on /bruffles.
  currentDrop: { number: 14, pieces: 40, next: "Fri 5 Dec, 7pm" },   // date and time: [CLIENT TO CONFIRM]
  pastDrops: [
    { number: 13, pieces: 40, gone: 36 },
    { number: 12, pieces: 38, gone: 38 },
    { number: 11, pieces: 40, gone: 40 },
  ],
};

/** Site-wide demo figures (Drop Log, signed-for total). Live version: read from the database. */
export function getDemo() {
  return demo;
}
