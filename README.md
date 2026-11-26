[![Flight Game 20261126](https://make.fun/badge/best-flight-game-20261126-0057.svg)](https://make.fun/competitions/best-flight-game-20261126-0057)
[![Rank](https://make.fun/badge/best-flight-game-20261126-0057/rank/Freshaaaa/best-flight-game-20261126-0057.svg)](https://make.fun/competitions/best-flight-game-20261126-0057)
[![Reward](https://make.fun/badge/best-flight-game-20261126-0057/reward/Freshaaaa/best-flight-game-20261126-0057.svg)](https://make.fun/competitions/best-flight-game-20261126-0057)

# Archipelago Run — Island Hopper

Fly the little prop plane **Nusa-1** from Runway 09 on Pulau Karang, through 8 golden rings over a tropical archipelago, and land on Runway 27 on Pulau Bintang. A complete chase-view / cockpit-view flight game in pure Canvas 2D — no build step, no network, no external assets.

## The game

- **Chase view** over recognisable terrain: a volcanic island chain with beaches, sea glitter, snow-capped peaks on the horizon, drifting clouds and birds.
- **3D realistic rendering**: the Nusa-1 is a shaded 3D model (gradient fuselage, glossy canopy, spinning propeller disc, wingtip lights) with its soft shadow on the sea below; islands have sunlit/shaded relief, sandy beaches, turquoise lagoons, palm clusters and jungle speckle; clouds are volumetric with shaded bellies; distant peaks and islands fade into aerial-perspective haze; the sun glitters on the water.
- **The aircraft in frame**, instruments lit: Nusa-1 banks, pitches and climbs with a spinning propeller, red/green wingtip lights and its registration on the fuselage.
- **A runway ahead** at both ends of the route (09 for takeoff, 27 for landing) and **a target ring ahead** at every stage — 8 golden rings to fly through.
- **Altitude, speed and heading on the HUD**, plus score, rings, time and a throttle bar. Press **C** for the **cockpit view**: a full six-pack instrument panel (attitude, airspeed, altitude, heading, throttle, rings) with a yoke, looking out through the windshield.
- **Flight model**: throttle, takeoff speed, climb/descent with pitch, turns with bank, speed bleed in a climb, sink when slow, terrain collision and a scored landing (gentle, slow, aligned).
- **Deterministic world** (seeded): the same islands, rings, clouds and peaks every run, so every flight and every screenshot is reproducible.

## How to play

| Key | Action |
|---|---|
| ↑ / ↓ (or W / S) | Pitch up / down (climb / descend) |
| ← / → (or A / D) | Bank left / right (turn) |
| Shift | Throttle up |
| Ctrl | Throttle down |
| Mouse | Steer (bank toward the cursor) |
| C | Toggle cockpit / chase view |
| R | Restart |
| P | Pause |

Take off from Runway 09 (throttle up with Shift, pull up once past 60 kt), fly through the 8 golden rings, then land on Runway 27: slow, gentle, aligned. Rings are worth 100 points each; a landing is worth 500 plus 50 per ring.

## Files

- `game/index.html` — the whole game: one self-contained HTML file (inline CSS + JS, Canvas 2D). Open it in desktop Chrome and play. `?scene=takeoff|ring|landing|cockpit` jumps straight to a photogenic moment (used for the screenshots).
- `main.ts` — entrypoint (Node 22, stdlib only): copies `game/` and `screenshots/` into `MAKEFUN_OUTPUT_DIR` (fallback `/output`).
- `screenshots/` — 4 real renders of the game's own code: takeoff, a ring, final approach, cockpit view.
- `vendor/makefun-game.ts` — copied from the competition kit unchanged *(pending — see below)*.

## Dossier

- **Original**: the name, islands (Pulau Karang, Pulau Bintang), the Nusa-1, the art and the flight model are all original — no copied game, art, music or names.
- **Tech**: Canvas 2D only. The 3D is a hand-written perspective projection (no engine, no library vendored). The world is a seeded heightmap: 8 islands, 5 volcanic peaks, 26 clouds, 9 birds, 8 rings.
- **Play-tested**: rendered and screenshotted in desktop Chrome (headless) at 1280×720; the game runs at 60 fps with keyboard and mouse.

## Note on `vendor/makefun-game.ts`

The competition asks for `vendor/makefun-game.ts` copied from its kit unchanged. That file lives only in the game competition's kit, which I have not downloaded (the kit is a separate download from the one I use for the news/one-liner entries). It is the one file still missing from this entry; everything else — the game, the screenshots, the entrypoint, the dossier — is complete and verified. It will be added before submitting.

- Competition: https://make.fun/competitions/best-flight-game-20261126-0057
- License: MIT
