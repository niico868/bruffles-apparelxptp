# Bruffels Apparel × Passport to Paradise (Nexus Forge client)

One international store for two equal brands. Owner: Nico (Nexus Forge, T&T). Explain work in plain language with analogies, give direct links, ask multiple-choice questions for decisions, update PROGRESS.md each session.

Stack: Astro + React islands, Tailwind v4, Framer Motion, Supabase (Phase 1), Cloudflare Pages. Prices stored in USD cents; TTD shown via `src/lib/price.ts`.
Design rules: read DESIGN.md before touching UI. Mobile-first (check 380px). Free tiers only. Never put Supabase service keys in the frontend.
Payments must stay behind a swappable adapter. Bruffels pieces are qty 1 and must be locked during checkout.
