// DOUBLE HARBOUR — the hand-in program for the spot-the-difference bounty.
// Node 22, standard library only. It gathers the game (game/), the four
// screenshots (screenshots/) and the dossier library (vendor/makefun-game.ts)
// from beside this file, lays them out in the grader's output directory and
// writes /output/dossier.json — the summary the judge reads — with the
// vendored make.fun library. Outside the grader, MAKEFUN_OUTPUT_DIR stands
// in for /output:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The game itself is plain static files a desktop browser loads offline:
// game/index.html plus its ES modules, no library and no network request.
// Six scenes, fifty fair differences, magnifier and full keyboard play.

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's own caps, mirrored here so a bad hand-in fails loudly at home
// instead of silently on the server: at most 4 screenshots, each at most
// 256 KiB; game/ at most 993 files and 48 MiB in all; no path under game/
// longer than 1000 bytes. The whole of /output shares the platform's own
// cap of 1000 entries and 64 MiB, so the dossier leaves room for itself.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function abort(message) {
  console.error(`double-harbour hand-in: ${message}`);
  process.exit(1);
}

function walk(dir) {
  // Every entry under dir, files and directories alike, with sizes.
  const found = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    found.push({ path: full, bytes: st.isFile() ? st.size : 0, dir: st.isDirectory() });
    if (st.isDirectory()) found.push(...walk(full));
  }
  return found;
}

function checkGame() {
  const gameDir = join(repoRoot, 'game');
  if (!existsSync(join(gameDir, 'index.html'))) abort('game/index.html is missing');
  const entries = walk(gameDir);
  const files = entries.filter((e) => !e.dir);
  if (entries.length > CAPS.game_max_files) {
    abort(`game/ holds ${entries.length} entries, over the 993 cap`);
  }
  const bytes = files.reduce((n, f) => n + f.bytes, 0);
  if (bytes > CAPS.game_max_bytes) abort(`game/ is ${bytes} bytes, over the 48 MiB cap`);
  for (const f of files) {
    if (Buffer.byteLength(f.path) > CAPS.game_path_max_bytes) {
      abort(`path too long under game/: ${f.path}`);
    }
  }
  // No network anywhere in the game: every script, stylesheet and import
  // must be a file inside game/ (checked again by the grader; fail early).
  for (const f of files) {
    if (!/\.(html|js|mjs|css)$/i.test(f.path)) continue;
    const text = readFileText(f.path);
    if (/(src|href)\s*=\s*"https?:|from\s+['"]https?:|import\(['"]https?:/.test(text)) {
      abort(`network reference in ${f.path}`);
    }
  }
  return { files: files.length, bytes };
}

function readFileText(path) {
  return readFileSync(path, 'utf8');
}

function checkShots() {
  const shotsDir = join(repoRoot, 'screenshots');
  if (!existsSync(shotsDir)) abort('screenshots/ is missing');
  const shots = readdirSync(shotsDir)
    .filter((n) => /\.(png|jpe?g)$/i.test(n))
    .sort();
  if (shots.length < 3 || shots.length > CAPS.screenshots.max) {
    abort(`expected 3 or 4 screenshots, found ${shots.length}`);
  }
  for (const shot of shots) {
    const bytes = statSync(join(shotsDir, shot)).size;
    if (bytes > CAPS.screenshots.max_bytes) {
      abort(`screenshot ${shot} is ${bytes} bytes, over the 256 KiB cap`);
    }
  }
  return shots;
}

function handIn() {
  const game = checkGame();
  const shots = checkShots();

  mkdirSync(targetDir, { recursive: true });
  cpSync(join(repoRoot, 'game'), join(targetDir, 'game'), { recursive: true });
  mkdirSync(join(targetDir, 'screenshots'), { recursive: true });
  cpSync(join(repoRoot, 'screenshots'), join(targetDir, 'screenshots'), { recursive: true });

  const dossier = buildDossier(targetDir, CAPS);
  writeFileSync(join(targetDir, 'dossier.json'), dossier);

  console.log(
    `double-harbour hand-in: wrote ${targetDir} (game/ ${game.files} files, ` +
      `${game.bytes} bytes; ${shots.length} screenshots: ${shots.join(', ')})`,
  );
}

handIn();
