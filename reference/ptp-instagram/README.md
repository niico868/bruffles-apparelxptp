# Passport to Paradise Instagram clips (drop them here)

The Passport hero on the homepage is running a **stock stand-in** (a baggage carousel, CC0) because
@pass_porttoparadise is a private account and no clips were available.

To swap in the real thing, drop **6 to 10 clips** into this folder:

- **Format:** the original MP4/MOV straight from Instagram or the phone (Reels download or camera roll). Vertical is fine.
- **Length:** anything from 2 to 30 seconds each. We only use 1.2 to 1.8 seconds of each.
- **What to film / pick:** motion and texture. Packaging being opened, papers fanned out, a grinder lid turning,
  boxes stacked, the brand logo, travel/beach atmosphere. Steady hands, good light.
- **Avoid:** burned-in captions, stickers, music-lyric text, watermarks, faces of people who haven't agreed,
  and product *in use* (the homepage sits before the 18+ gate).

Then run `python3 scripts/build-pp-hero.py <clip> public/media/home` (edit the `cuts` list for several clips)
and export the stills as described in that script. The build refuses to ship if either hero side is missing
its still or its video. The clips themselves are not committed (they stay out of git).
