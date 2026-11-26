// Passport to Paradise context from the brand's own Instagram (@pass_porttoparadise), viewed through
// Divine's browser on 2026-11-26 (Divine's final pass: "use some of the copy, use some of the images").
// The photos are small screen captures from the client's own posts: STAND-INS until the client sends
// the original files. Our wording is written fresh; no post text is copied. Eco claims seen on the
// account (natural, vegan, biodegradable, additive-free) are left out until the client confirms them.
import type { ImageMetadata } from "astro";
import ashtray from "../assets/media/ig/ig-ashtray-plane.jpg";
import cap from "../assets/media/ig/ig-cap-red.jpg";
import papers from "../assets/media/ig/ig-papers-stack.jpg";

export const IG_URL = "https://www.instagram.com/pass_porttoparadise/";
export const igShots: { image: ImageMetadata; alt: string; title: string; note: string; href: string }[] = [
  { image: papers, alt: "Boxes of Passport to Paradise rolling papers stacked on a wooden tray branded with the Passport to Paradise logo.", title: "Luxury rolling papers", note: "Ultra-thin, slow-burning. By the booklet or the box.", href: "/passport/PTP-11" },
  { image: ashtray, alt: "A hand-painted ceramic ashtray with a white plane flying over a blue sea and palm trees, lettered Passport to Paradise.", title: "Hand-painted ashtrays", note: "Plane, palms and sea, painted by hand.", href: "/passport" },
  { image: cap, alt: "A red snapback cap with the round Passport to Paradise patch, in front of stacked Passport boxes.", title: "Passport caps", note: "The round badge on a structured snapback.", href: "/passport" },
];
// Where Passport has shown up (from the account's posts). Dates only where a post showed one.
export const igEvents = [
  { place: "Berlin, Germany", name: "Mary Jane Berlin", note: "Papers in hand with growers and makers from around the world." },
  { place: "Bilbao, Spain", name: "Secret Garden Bilbao", note: "Passport papers on the counter in Spain." },
  { place: "St Andrew, Barbados", name: "Bush Tea, 1st annual", note: "Sunday 8 November 2026. Community, culture, live music and a rolling competition." },
];
