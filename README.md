# DOUBLE HARBOUR — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/wantorieta15/spot-the-difference-six-scenes/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/wantorieta15/spot-the-difference-six-scenes/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two pictures look the same — but the right one has sneaky shifts. Find them all
before the timer runs out. A complete spot-the-difference game that plays
offline in a desktop browser from its own static files, built for the
[Make Fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).

## The game

- **6 scenes, 50 fair differences in all** — Sunny Park Picnic (9), The Cozy
  Library (9), Harbor at Dusk (8), Mountain Cabin Night (8), Lantern Night
  Market (8), Space Station Window (8). Every difference is fair: removed,
  recoloured, moved, resized, flipped or added — nothing hidden in noise.
- **Two pictures side by side** — original on the left, changed on the right.
  Click a difference on either picture: a gold ring and a green check mark it,
  the counter and the dots underneath track what is left.
- **Magnifier on hover** — hold the mouse over a picture to zoom into the spot
  under the cursor.
- **Full keyboard play** — arrow keys move a crosshair, Enter guesses, Tab
  switches pictures, H hints, L levels, N next scene, R restarts, 1–6 jumps
  to a level.
- **Hints, streaks and score** — 3 hints per level, a 2:00 timer with a
  progress bar, score and streak multipliers, and a win screen when a scene
  is cleared.

## Play it

Open `game/index.html` in a desktop browser — no server, no network, no
build step. Or serve the folder with any static server and open
`http://localhost:<port>/index.html`.

`main.ts` (Node 22, standard library only) is the hand-in program: it
gathers `game/`, the four screenshots in `screenshots/` and the dossier
library in `vendor/` into the grader's output directory and writes
`dossier.json`, the summary the judge reads.
