// main.js — the DOUBLE HARBOUR game loop, input and HUD.
// Two near-identical pictures sit side by side on one canvas; the player
// clicks a difference on EITHER picture to ring it. Keyboard play is first
// class: arrows move a crosshair, Enter guesses, Tab switches picture,
// H hints, L toggles the magnifier lens, N goes to the next scene,
// R restarts, 1-6 jump to a scene. Hovering shows a magnifier lens.
// Six scenes, fifty fair differences in all.

import { SCENES, TOTAL_DIFFERENCES, PANEL_W, PANEL_H } from './scenes.js';
import * as sfx from './audio.js';

const GAP = 40;
const CANVAS_W = PANEL_W * 2 + GAP;
const CANVAS_H = PANEL_H;
const SCENE_SECONDS = 120;
const HINTS_PER_SCENE = 3;
const MISS_PENALTY_SECONDS = 5;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const $ = (id) => document.getElementById(id);
const levelPill = $('levelPill');
const leftPill = $('leftPill');
const foundPill = $('foundPill');
const scorePill = $('scorePill');
const streakPill = $('streakPill');
const timerPill = $('timerPill');
const timerBar = $('timerBar');
const messageEl = $('message');
const hintBtn = $('hintBtn');
const pauseBtn = $('pauseBtn');
const soundBtn = $('soundBtn');
const levelsBtn = $('levelsBtn');
const restartBtn = $('restartBtn');
const nextBtn = $('nextBtn');
const dotsEl = $('dots');
const overlayEl = $('overlay');
const sceneBtns = [...document.querySelectorAll('#sceneBar button')];

const params = new URLSearchParams(location.search);
const shot = params.get('shot') || '';
const FROZEN = shot !== '';

const state = {
  scene: 0,
  found: new Set(),
  hinted: new Set(),
  score: 0,
  streak: 0,
  bestStreak: 0,
  misses: 0,
  hintsLeft: HINTS_PER_SCENE,
  timeLeft: SCENE_SECONDS,
  paused: false,
  over: false,
  complete: false,
  lensOn: true,
  activePanel: 1,
  cross: { panel: 1, x: 0.5, y: 0.5, visible: false },
  mouse: { panel: -1, x: 0, y: 0, inside: false },
  flash: 0,
  rings: [],
  totalFound: 0,
};

function scene() {
  return SCENES[state.scene];
}

function panelOrigin(panel) {
  return { x: panel === 0 ? 0 : PANEL_W + GAP, y: 0 };
}

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}

function setMessage(text) {
  messageEl.textContent = text;
}

function updateHUD() {
  const s = scene();
  levelPill.textContent = `Level ${state.scene + 1} — ${s.name}`;
  leftPill.textContent = `${s.diffs.length - state.found.size} left`;
  foundPill.textContent = `${state.found.size} / ${s.diffs.length} found`;
  scorePill.textContent = `Score ${state.score}`;
  streakPill.textContent = `Streak ×${state.streak}`;
  timerPill.textContent = fmtTime(Math.max(0, state.timeLeft));
  timerBar.style.width = `${(Math.max(0, state.timeLeft) / SCENE_SECONDS) * 100}%`;
  timerBar.style.background = state.timeLeft <= 15 ? '#e63946' : 'linear-gradient(90deg,#2f9e44,#ffd93b)';
  hintBtn.textContent = `Hint (${state.hintsLeft})`;
  hintBtn.disabled = state.hintsLeft <= 0 || state.complete || state.over;
  nextBtn.disabled = !state.complete;
  restartBtn.disabled = false;
  pauseBtn.textContent = state.paused ? 'Resume' : 'Pause';
  soundBtn.textContent = sfx.isSoundOn() ? 'Sound on' : 'Sound off';
  sceneBtns.forEach((b, i) => {
    b.classList.toggle('active', i === state.scene);
    b.disabled = false;
  });
  dotsEl.innerHTML = '';
  s.diffs.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'dot' + (state.found.has(i) ? ' found' : '');
    d.textContent = state.found.has(i) ? '✓' : '';
    dotsEl.appendChild(d);
  });
}

function resetScene(index, keepScore) {
  state.scene = index;
  state.found = new Set();
  state.hinted = new Set();
  state.rings = [];
  if (!keepScore) {
    state.score = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.totalFound = 0;
  }
  state.misses = 0;
  state.hintsLeft = HINTS_PER_SCENE;
  state.timeLeft = SCENE_SECONDS;
  state.paused = false;
  state.over = false;
  state.complete = false;
  state.cross = { panel: 1, x: 0.5, y: 0.5, visible: false };
  overlayEl.classList.remove('show');
  overlayEl.innerHTML = '';
  setMessage('Click a difference on either picture. Arrow keys move the cursor, Enter selects.');
  updateHUD();
}

function hitTest(nx, ny) {
  const s = scene();
  let best = -1;
  let bestD = Infinity;
  s.diffs.forEach((d, i) => {
    if (state.found.has(i)) return;
    const spots = [{ x: d.x, y: d.y }];
    if (d.x2 !== undefined) spots.push({ x: d.x2, y: d.y2 });
    spots.forEach((p) => {
      const dist = Math.hypot(nx - p.x, ny - p.y);
      if (dist < d.r && dist < bestD) {
        bestD = dist;
        best = i;
      }
    });
  });
  return best;
}

function guess(panel, nx, ny) {
  if (state.paused || state.over || state.complete) return;
  state.activePanel = panel;
  const i = hitTest(nx, ny);
  const s = scene();
  if (i >= 0) {
    state.found.add(i);
    state.totalFound += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    const gained = 100 + (state.streak - 1) * 25;
    state.score += gained;
    state.rings.push({ diff: i, born: performance.now() });
    sfx.playFound();
    setMessage(`Found it — ${s.diffs[i].label}! +${gained} points. ${s.diffs.length - state.found.size} left.`);
    if (state.found.size === s.diffs.length) completeScene();
  } else {
    state.misses += 1;
    state.streak = 0;
    state.timeLeft = Math.max(0, state.timeLeft - MISS_PENALTY_SECONDS);
    state.flash = performance.now();
    sfx.playMiss();
    setMessage(`Not a difference — ${MISS_PENALTY_SECONDS} seconds lost. Look closer!`);
    if (state.timeLeft <= 0) failScene();
  }
  updateHUD();
}

function completeScene() {
  state.complete = true;
  const bonus = Math.round(state.timeLeft) * 5;
  state.score += bonus;
  sfx.playWin();
  const last = state.scene === SCENES.length - 1;
  setMessage(last ? 'All six scenes complete — you found all 50 differences!' : `Scene complete! Time bonus +${bonus}. Press N for the next scene.`);
  overlayEl.innerHTML = last
    ? `<h2>🏆 All 50 differences found!</h2><p>Final score <b>${state.score}</b> · best streak ×${state.bestStreak} · misses ${state.misses}</p><p>Play again from scene 1 with R, or pick any scene below.</p>`
    : `<h2>Scene complete!</h2><p>Score <b>${state.score}</b> · time bonus +${bonus} · streak ×${state.streak}</p><p>Press <b>N</b> or the button for the next scene.</p>`;
  overlayEl.classList.add('show');
  updateHUD();
}

function failScene() {
  state.over = true;
  sfx.playMiss();
  setMessage('Time ran out! Press R to retry this scene.');
  overlayEl.innerHTML = `<h2>Time's up!</h2><p>You found ${state.found.size} of ${scene().diffs.length} differences. Press <b>R</b> to retry the scene.</p>`;
  overlayEl.classList.add('show');
  updateHUD();
}

function useHint() {
  if (state.paused || state.over || state.complete || state.hintsLeft <= 0) return;
  const s = scene();
  const rest = s.diffs.map((_, i) => i).filter((i) => !state.found.has(i));
  if (rest.length === 0) return;
  const pick = rest[Math.floor(Math.random() * rest.length)];
  state.hintsLeft -= 1;
  state.hinted.add(pick);
  state.rings.push({ diff: pick, born: performance.now(), hint: true });
  sfx.playHint();
  setMessage(`Hint: ${s.diffs[pick].label} — look near the pulsing ring. ${state.hintsLeft} hints left.`);
  updateHUD();
}

function drawPanel(panel, variant, now) {
  const o = panelOrigin(panel);
  ctx.save();
  ctx.beginPath();
  ctx.rect(o.x, o.y, PANEL_W, PANEL_H);
  ctx.clip();
  ctx.translate(o.x, o.y);
  scene().draw(ctx, variant);
  // Rings on the differences already found (gold ring + green check).
  scene().diffs.forEach((d, i) => {
    if (!state.found.has(i)) return;
    const px = (variant === 0 ? d.x : (d.x2 !== undefined ? d.x2 : d.x)) * PANEL_W;
    const py = (variant === 0 ? d.y : (d.y2 !== undefined ? d.y2 : d.y)) * PANEL_H;
    const r = d.r * PANEL_W;
    ctx.strokeStyle = '#ffd93b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(px, py, r + 6, 0, Math.PI * 2);
    ctx.stroke();
    circleBadge(ctx, px + r * 0.7, py - r * 0.7);
  });
  // Hint rings pulse.
  state.rings.forEach((ring) => {
    if (!ring.hint) return;
    const d = scene().diffs[ring.diff];
    const px = (variant === 0 ? d.x : (d.x2 !== undefined ? d.x2 : d.x)) * PANEL_W;
    const py = (variant === 0 ? d.y : (d.y2 !== undefined ? d.y2 : d.y)) * PANEL_H;
    const pulse = 1 + 0.15 * Math.sin(now / 180);
    ctx.strokeStyle = 'rgba(255,217,59,0.9)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(px, py, (d.r * PANEL_W + 10) * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  });
  ctx.restore();
}

function circleBadge(ctx2, x, y) {
  ctx2.fillStyle = '#2f9e44';
  ctx2.beginPath();
  ctx2.arc(x, y, 13, 0, Math.PI * 2);
  ctx2.fill();
  ctx2.strokeStyle = '#fff';
  ctx2.lineWidth = 3;
  ctx2.beginPath();
  ctx2.moveTo(x - 6, y);
  ctx2.lineTo(x - 2, y + 5);
  ctx2.lineTo(x + 7, y - 5);
  ctx2.stroke();
}

function drawLens(now) {
  if (!state.lensOn || !state.mouse.inside || state.mouse.panel < 0) return;
  if (state.paused || state.over) return;
  const o = panelOrigin(state.mouse.panel);
  const mx = state.mouse.x * PANEL_W;
  const my = state.mouse.y * PANEL_H;
  const R = 72;
  const Z = 2.2;
  const cx = o.x + mx;
  const cy = o.y + my;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
  // Magnify by re-rendering the scene under the lens, so the zoom is exact.
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(Z, Z);
  ctx.translate(-mx, -my);
  scene().draw(ctx, state.mouse.panel === 0 ? 0 : 1);
  ctx.restore();
  ctx.restore();
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();
  // Crosshair tick inside the lens.
  ctx.strokeStyle = 'rgba(255,217,59,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy);
  ctx.lineTo(cx + 12, cy);
  ctx.moveTo(cx, cy - 12);
  ctx.lineTo(cx, cy + 12);
  ctx.stroke();
}

function drawCrosshair() {
  if (!state.cross.visible) return;
  const o = panelOrigin(state.cross.panel);
  const x = o.x + state.cross.x * PANEL_W;
  const y = o.y + state.cross.y * PANEL_H;
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 26, y);
  ctx.lineTo(x - 10, y);
  ctx.moveTo(x + 10, y);
  ctx.lineTo(x + 26, y);
  ctx.moveTo(x, y - 26);
  ctx.lineTo(x, y - 10);
  ctx.moveTo(x, y + 10);
  ctx.lineTo(x, y + 26);
  ctx.stroke();
}

function draw(now) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  drawPanel(0, 0, now);
  drawPanel(1, 1, now);
  // VS badge between the pictures.
  ctx.fillStyle = '#0b1220';
  ctx.beginPath();
  ctx.arc(PANEL_W + GAP / 2, CANVAS_H / 2, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd93b';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', PANEL_W + GAP / 2, CANVAS_H / 2 + 1);
  ctx.textBaseline = 'alphabetic';
  // Miss flash.
  if (now - state.flash < 220) {
    ctx.fillStyle = 'rgba(230,57,70,0.18)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }
  // Paused veil.
  if (state.paused) {
    ctx.fillStyle = 'rgba(11,18,32,0.72)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#f8f9fa';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Paused — press P to resume', CANVAS_W / 2, CANVAS_H / 2);
  }
  drawCrosshair();
  drawLens(now);
}

function frame(now) {
  draw(now);
  requestAnimationFrame(frame);
}

// One-second timer.
setInterval(() => {
  if (FROZEN || state.paused || state.over || state.complete) return;
  state.timeLeft -= 1;
  if (state.timeLeft === 10) sfx.playTick();
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    failScene();
  }
  updateHUD();
}, 1000);

function canvasPos(evt) {
  const r = canvas.getBoundingClientRect();
  const x = ((evt.clientX - r.left) / r.width) * CANVAS_W;
  const y = ((evt.clientY - r.top) / r.height) * CANVAS_H;
  const panel = x < PANEL_W ? 0 : x > PANEL_W + GAP ? 1 : -1;
  if (panel < 0) return { panel, x: 0, y: 0 };
  const o = panelOrigin(panel);
  return { panel, x: (x - o.x) / PANEL_W, y: (y - o.y) / PANEL_H };
}

canvas.addEventListener('mousemove', (evt) => {
  const p = canvasPos(evt);
  state.mouse = { panel: p.panel, x: p.x, y: p.y, inside: p.panel >= 0 };
  if (p.panel >= 0) {
    state.cross.panel = p.panel;
    state.cross.x = p.x;
    state.cross.y = p.y;
  }
});

canvas.addEventListener('mouseleave', () => {
  state.mouse.inside = false;
});

canvas.addEventListener('click', (evt) => {
  const p = canvasPos(evt);
  if (p.panel < 0) return;
  state.cross.visible = true;
  guess(p.panel, p.x, p.y);
});

document.addEventListener('keydown', (evt) => {
  const step = evt.shiftKey ? 0.05 : 0.02;
  const c = state.cross;
  if (evt.key === 'ArrowLeft' || evt.key === 'ArrowRight' || evt.key === 'ArrowUp' || evt.key === 'ArrowDown') {
    evt.preventDefault();
    c.visible = true;
    if (evt.key === 'ArrowLeft') c.x = Math.max(0, c.x - step);
    if (evt.key === 'ArrowRight') c.x = Math.min(1, c.x + step);
    if (evt.key === 'ArrowUp') c.y = Math.max(0, c.y - step);
    if (evt.key === 'ArrowDown') c.y = Math.min(1, c.y + step);
    state.mouse = { panel: c.panel, x: c.x, y: c.y, inside: true };
    return;
  }
  const k = evt.key.toLowerCase();
  if (evt.key === 'Enter') {
    evt.preventDefault();
    c.visible = true;
    guess(c.panel, c.x, c.y);
  } else if (evt.key === 'Tab') {
    evt.preventDefault();
    c.panel = 1 - c.panel;
    c.visible = true;
    state.activePanel = c.panel;
    setMessage(c.panel === 0 ? 'Original picture — crosshair here.' : 'Changed picture — crosshair here.');
  } else if (k === 'h') {
    useHint();
  } else if (k === 'l') {
    state.lensOn = !state.lensOn;
    setMessage(state.lensOn ? 'Magnifier lens on — hover a picture to zoom in.' : 'Magnifier lens off.');
  } else if (k === 'n') {
    if (state.complete && state.scene < SCENES.length - 1) resetScene(state.scene + 1, true);
  } else if (k === 'r') {
    resetScene(state.scene, state.scene > 0);
    if (state.scene === 0) {
      state.score = 0;
      state.totalFound = 0;
    }
    updateHUD();
  } else if (k === 'p') {
    state.paused = !state.paused;
    setMessage(state.paused ? 'Paused. Press P to resume.' : 'Resumed — find the differences!');
    updateHUD();
  } else if (k >= '1' && k <= '6') {
    resetScene(Number(k) - 1, true);
  }
});

hintBtn.addEventListener('click', useHint);
restartBtn.addEventListener('click', () => {
  resetScene(state.scene, true);
});
nextBtn.addEventListener('click', () => {
  if (state.complete && state.scene < SCENES.length - 1) resetScene(state.scene + 1, true);
});
pauseBtn.addEventListener('click', () => {
  state.paused = !state.paused;
  setMessage(state.paused ? 'Paused. Press P to resume.' : 'Resumed — find the differences!');
  updateHUD();
});
soundBtn.addEventListener('click', () => {
  sfx.setSound(!sfx.isSoundOn());
  updateHUD();
});
levelsBtn.addEventListener('click', () => {
  document.getElementById('sceneBar').scrollIntoView({ behavior: 'smooth', block: 'center' });
  setMessage('Pick a scene: 1 Sunny Park Picnic · 2 Cozy Library · 3 Harbor at Dusk · 4 Mountain Cabin Night · 5 Lantern Night Market · 6 Space Station Window.');
});
sceneBtns.forEach((b, i) => {
  b.addEventListener('click', () => resetScene(i, true));
});

// ---- screenshot staging: ?shot=start|play|play2|win --------------------
// The frame is frozen (the timer never ticks) so a screenshot is stable.
function stageShot(name) {
  if (name === 'play') {
    resetScene(2, false);
    [0, 1, 2].forEach((i) => state.found.add(i));
    state.score = 360;
    state.streak = 3;
    state.timeLeft = 83;
    setMessage('3 of 8 found — 5 sneaky shifts still hiding in the harbour at dusk.');
  } else if (name === 'play2') {
    resetScene(0, false);
    [0, 1, 2, 3, 4].forEach((i) => state.found.add(i));
    state.score = 640;
    state.streak = 5;
    state.timeLeft = 61;
    setMessage('5 of 9 found in the sunny park — the dog, the kite and the basket gave themselves away.');
  } else if (name === 'win') {
    resetScene(5, false);
    SCENES[5].diffs.forEach((_, i) => state.found.add(i));
    state.score = 5240;
    state.streak = 8;
    state.timeLeft = 47;
    completeScene();
  } else {
    resetScene(0, false);
    setMessage('Two pictures look the same — but the right one has sneaky shifts. Find all 9!');
  }
  updateHUD();
}

stageShot(shot);
requestAnimationFrame(frame);
