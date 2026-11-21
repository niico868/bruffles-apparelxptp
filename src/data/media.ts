// Hero media slots. Drop files in /public/media and fill these in.
// poster: still image shown by default · video: plays only while that half is open (70%) · logo: shown above the title when open
export const heroMedia: Record<"bsa" | "ptp", { poster?: string; video?: string; logo?: string }> = {
  bsa: { poster: undefined, video: undefined, logo: undefined },
  ptp: { poster: undefined, video: undefined, logo: undefined },
};
