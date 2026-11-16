# Securing the database — Cloudflare Tunnel explainer

A vertical (1080 × 1920, 30 fps) motion-graphics explainer built with [Remotion](https://www.remotion.dev):
how to keep a database off the public internet with Cloudflare Tunnel and `cloudflared`, and why the tunnel
still needs an access policy.

It follows the 13-scene storyboard: the problem, scanners, the firewall, "no door", the tunnel, the app and
SSH getting in, scanners finding nothing, the weak-policy risk, the three locks, and the outro.

## Commands

```bash
npm install
npm run dev      # open Remotion Studio
npm run lint     # ESLint + TypeScript
npx remotion render SecuringDatabase out/securing-database.mp4
```

If Remotion cannot download its own browser, add `--browser-executable=/path/to/chrome` to the render command.

## Where things are

- `src/videos/securing-database/timeline.ts` — the voiceover script and the length of every scene. This is the
  only file to change when the voiceover is recorded: set each scene's real length in `SECONDS` and every beat
  inside the scene retimes itself.
- `src/videos/securing-database/layout.ts` — the single centre-axis layout (clients, edge, tunnel, cloudflared,
  database).
- `src/videos/securing-database/components/parts.tsx` — the shared diagram parts, including `Stack`, the whole
  centred stack that scenes 5–13 recolour and relabel.
- `src/videos/securing-database/scenes/` — one file per scene. Each scene is also registered as its own
  composition in Studio (folder `SecuringDatabase-Scenes`).
- `src/design-system/` — colours, easing, formats and fonts (shared with the autocannon video).

## Status

The video is silent. Scene lengths are estimated from the script's word count (about 103 seconds in total)
until the voiceover exists.

## Licences

Remotion is free for individuals and companies of up to 3 people; larger companies need a
[company licence](https://www.remotion.dev/docs/license). IBM Plex is bundled under the SIL Open Font License
(`public/fonts/ibm-plex/OFL.txt`).
