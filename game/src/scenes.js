// scenes.js — the six scenes of DOUBLE HARBOUR.
// Every scene is drawn twice from one function: variant 0 is the original,
// variant 1 is the changed picture. The differences between the two are the
// fair shifts the player hunts: removed, recoloured, moved, resized, flipped
// or added. Each scene lists its differences as normalized hotspots
// (x, y in 0..1 across the panel, r the hit radius) so the game logic can
// test clicks on either picture without knowing how the art is drawn.
// Panels are drawn in a fixed 560 x 440 space.

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function tri(ctx, x1, y1, x2, y2, x3, y3, fill) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 440);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 560, 440);
}

function cloud(ctx, x, y, s, fill) {
  circle(ctx, x, y, 18 * s, fill);
  circle(ctx, x + 20 * s, y - 6 * s, 14 * s, fill);
  circle(ctx, x + 40 * s, y, 16 * s, fill);
}

function bird(ctx, x, y, s, stroke) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x - 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

function fish(ctx, x, y, s, body, flip) {
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, 16 * s, 9 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  const d = flip ? -1 : 1;
  tri(ctx, x - 14 * s * d, y, x - 26 * s * d, y - 9 * s, x - 26 * s * d, y + 9 * s, body);
  circle(ctx, x + 7 * s * d, y - 2 * s, 2, '#10233f');
}

function drawDog(ctx, x, y, s, flip) {
  const d = flip ? -1 : 1;
  ctx.fillStyle = '#8a5a2b';
  ctx.beginPath();
  ctx.ellipse(x, y, 26 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, x + 24 * s * d, y - 10 * s, 11 * s, '#8a5a2b');
  tri(ctx, x + 18 * s * d, y - 18 * s, x + 24 * s * d, y - 28 * s, x + 28 * s * d, y - 17 * s, '#8a5a2b');
  circle(ctx, x + 30 * s * d, y - 12 * s, 2.5, '#10233f');
  ctx.fillStyle = '#5d3a17';
  ctx.fillRect(x - 22 * s, y + 8 * s, 8 * s, 12 * s);
  ctx.fillRect(x + 14 * s, y + 8 * s, 8 * s, 12 * s);
}

function drawCat(ctx, x, y, s, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, 20 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, x + 18 * s, y - 8 * s, 9 * s, fill);
  tri(ctx, x + 12 * s, y - 14 * s, x + 15 * s, y - 23 * s, x + 19 * s, y - 14 * s, fill);
  tri(ctx, x + 20 * s, y - 15 * s, x + 25 * s, y - 23 * s, x + 27 * s, y - 14 * s, fill);
  ctx.strokeStyle = fill;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 19 * s, y + 2 * s);
  ctx.quadraticCurveTo(x - 32 * s, y - 6 * s, x - 28 * s, y - 16 * s);
  ctx.stroke();
}

// ---------------------------------------------------------------- scene 1
// Sunny Park Picnic — 9 differences.
function drawPicnic(ctx, v) {
  sky(ctx, '#7ec8f7', '#fdf3c4');
  // Sun: moved in the changed picture.
  if (v === 0) { circle(ctx, 470, 62, 34, '#ffd93b'); } else { circle(ctx, 428, 96, 34, '#ffd93b'); }
  ctx.strokeStyle = '#f5b301';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    const sx = (v === 0 ? 470 : 428) + Math.cos(a) * 44;
    const sy = (v === 0 ? 62 : 96) + Math.sin(a) * 44;
    ctx.beginPath();
    ctx.moveTo((v === 0 ? 470 : 428) + Math.cos(a) * 38, (v === 0 ? 62 : 96) + Math.sin(a) * 38);
    ctx.lineTo(sx, sy);
    ctx.stroke();
  }
  // Clouds: the middle one is removed in the changed picture.
  cloud(ctx, 90, 70, 1, '#ffffff');
  if (v === 0) cloud(ctx, 250, 48, 0.8, '#ffffff');
  cloud(ctx, 380, 90, 0.7, '#ffffff');
  // Birds: one of them moved.
  bird(ctx, 150, 130, 1, '#334155');
  if (v === 0) bird(ctx, 250, 108, 0.9, '#334155'); else bird(ctx, 300, 140, 0.9, '#334155');
  // Kite: recoloured in the changed picture.
  const kiteCol = v === 0 ? '#e63946' : '#2563eb';
  tri(ctx, 350, 120, 385, 150, 350, 180, kiteCol);
  tri(ctx, 350, 120, 315, 150, 350, 180, kiteCol);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(350, 180);
  ctx.lineTo(330, 250);
  ctx.stroke();
  // Grass.
  rect(ctx, 0, 260, 560, 180, '#69b455');
  rect(ctx, 0, 260, 560, 10, '#57a047');
  // Tree, left.
  rect(ctx, 58, 170, 18, 95, '#7a4a21');
  circle(ctx, 67, 150, 48, '#2f9e44');
  circle(ctx, 30, 175, 30, '#37b24d');
  circle(ctx, 105, 175, 30, '#37b24d');
  // Picnic blanket: one stripe recoloured in the changed picture.
  rect(ctx, 180, 300, 180, 70, '#f8f9fa');
  for (let i = 0; i < 6; i += 1) rect(ctx, 180 + i * 30, 300, 15, 70, i % 2 ? '#e63946' : '#f8f9fa');
  rect(ctx, 180, 300, 180, 12, v === 0 ? '#2563eb' : '#2f9e44');
  // Basket: resized (bigger) in the changed picture.
  const bs = v === 0 ? 1 : 1.35;
  ctx.fillStyle = '#b08954';
  ctx.fillRect(255 - 22 * bs, 268 - 20 * bs, 44 * bs, 34 * bs);
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(255, 268 - 20 * bs, 16 * bs, Math.PI, 0);
  ctx.stroke();
  // Flowers: one removed in the changed picture.
  circle(ctx, 90, 360, 7, '#ff6b9d');
  circle(ctx, 130, 385, 7, '#ffd93b');
  if (v === 0) circle(ctx, 60, 395, 7, '#c77dff');
  // Dog: flipped in the changed picture.
  drawDog(ctx, 450, 330, 1, v === 1);
  // Ball: added in the changed picture.
  if (v === 1) {
    circle(ctx, 380, 345, 16, '#ff6b35');
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(380, 345, 16, 0.3, 2.2);
    ctx.stroke();
  }
}

const SCENE_PICNIC = {
  name: 'Sunny Park Picnic',
  sub: 'Scene 1 of 6',
  par: '2:00',
  diffs: [
    { x: 0.84, y: 0.14, r: 0.07, kind: 'moved', label: 'the sun moved', x2: 0.76, y2: 0.22 },
    { x: 0.45, y: 0.11, r: 0.06, kind: 'removed', label: 'a cloud vanished' },
    { x: 0.62, y: 0.34, r: 0.06, kind: 'recoloured', label: 'the kite changed colour' },
    { x: 0.80, y: 0.75, r: 0.07, kind: 'flipped', label: 'the dog turned around' },
    { x: 0.46, y: 0.62, r: 0.06, kind: 'resized', label: 'the basket grew' },
    { x: 0.68, y: 0.78, r: 0.05, kind: 'added', label: 'a ball appeared' },
    { x: 0.11, y: 0.90, r: 0.04, kind: 'removed', label: 'a flower vanished' },
    { x: 0.45, y: 0.25, r: 0.06, kind: 'moved', label: 'a bird moved', x2: 0.54, y2: 0.32 },
    { x: 0.48, y: 0.70, r: 0.06, kind: 'recoloured', label: 'the blanket stripe changed colour' },
  ],
  draw: drawPicnic,
};

// ---------------------------------------------------------------- scene 2
// The Cozy Library — 9 differences.
function drawLibrary(ctx, v) {
  rect(ctx, 0, 0, 560, 440, '#f3e5c8');
  // Window, right, with curtains: curtain recoloured in the changed picture.
  rect(ctx, 420, 40, 110, 150, '#bfe3ff');
  circle(ctx, 500, 80, 22, '#ffe9a8');
  rect(ctx, 408, 30, 22, 170, v === 0 ? '#b23a48' : '#2a9d8f');
  rect(ctx, 520, 30, 22, 170, v === 0 ? '#b23a48' : '#2a9d8f');
  // Bookshelf, left.
  rect(ctx, 30, 10, 220, 320, '#7a4a21');
  const shelfCols = ['#e63946', '#2563eb', '#f4a261', '#2a9d8f', '#9b5de5', '#e9c46a'];
  for (let s = 0; s < 3; s += 1) {
    rect(ctx, 40, 60 + s * 95, 200, 8, '#5d3a17');
    for (let b = 0; b < 6; b += 1) {
      let col = shelfCols[(s * 6 + b) % 6];
      // One spine recoloured in the changed picture.
      if (v === 1 && s === 0 && b === 2) col = '#2f9e44';
      if (v === 1 && s === 1 && b === 4) {
        // One book flipped: leaning the other way.
        ctx.save();
        ctx.translate(46 + b * 32 + 13, 16 + s * 95 + 22);
        ctx.rotate(0.35);
        rect(ctx, -13, -22, 26, 44, col);
        ctx.restore();
      } else {
        rect(ctx, 46 + b * 32, 16 + s * 95, 26, 44, col);
      }
    }
  }
  // Clock: hands moved in the changed picture.
  circle(ctx, 280, 60, 26, '#fffdf5');
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(280, 60, 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(280, 60);
  ctx.lineTo(280, 42);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(280, 60);
  if (v === 0) ctx.lineTo(296, 66); else ctx.lineTo(266, 70);
  ctx.stroke();
  // Armchair + rug.
  rect(ctx, 280, 240, 130, 90, '#b23a48');
  rect(ctx, 295, 200, 100, 45, '#b23a48');
  circle(ctx, 295, 200, 22, '#b23a48');
  circle(ctx, 380, 200, 22, '#b23a48');
  rect(ctx, 60, 360, 440, 55, '#c77dff');
  rect(ctx, 60, 378, 440, 8, '#f8f9fa');
  if (v === 0) rect(ctx, 60, 396, 440, 8, '#f8f9fa');
  // Cat: on the chair in the original, on the rug in the changed picture.
  if (v === 0) drawCat(ctx, 340, 235, 1, '#343a40'); else drawCat(ctx, 300, 372, 0.9, '#343a40');
  // Side table, lamp: shade resized in the changed picture.
  rect(ctx, 440, 260, 70, 10, '#7a4a21');
  rect(ctx, 470, 270, 10, 60, '#7a4a21');
  const lampR = v === 0 ? 26 : 36;
  tri(ctx, 475 - lampR, 260, 475 + lampR, 260, 475 - lampR + 10, 225, '#ffd93b');
  tri(ctx, 475 - lampR, 260, 475 + lampR, 260, 475 + lampR - 10, 225, '#ffd93b');
  circle(ctx, 475, 252, 8, '#ffe9a8');
  // Mug: removed in the changed picture.
  if (v === 0) {
    rect(ctx, 445, 240, 18, 20, '#2563eb');
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(466, 250, 7, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
  // Plant: added in the changed picture.
  if (v === 1) {
    rect(ctx, 55, 380, 34, 26, '#e07a5f');
    circle(ctx, 72, 368, 20, '#2f9e44');
    circle(ctx, 58, 376, 12, '#37b24d');
    circle(ctx, 86, 376, 12, '#37b24d');
  }
}

const SCENE_LIBRARY = {
  name: 'The Cozy Library',
  sub: 'Scene 2 of 6',
  par: '2:00',
  diffs: [
    { x: 0.50, y: 0.14, r: 0.05, kind: 'moved', label: 'the clock hand moved' },
    { x: 0.81, y: 0.57, r: 0.04, kind: 'removed', label: 'the mug vanished' },
    { x: 0.22, y: 0.09, r: 0.06, kind: 'recoloured', label: 'a book spine changed colour' },
    { x: 0.61, y: 0.53, r: 0.07, kind: 'moved', label: 'the cat moved', x2: 0.54, y2: 0.85 },
    { x: 0.85, y: 0.57, r: 0.06, kind: 'resized', label: 'the lamp shade grew' },
    { x: 0.13, y: 0.87, r: 0.05, kind: 'added', label: 'a plant appeared' },
    { x: 0.33, y: 0.30, r: 0.06, kind: 'flipped', label: 'a book tipped over' },
    { x: 0.75, y: 0.26, r: 0.06, kind: 'recoloured', label: 'the curtains changed colour', x2: 0.95, y2: 0.26 },
    { x: 0.50, y: 0.90, r: 0.05, kind: 'removed', label: 'a rug stripe vanished' },
  ],
  draw: drawLibrary,
};

// ---------------------------------------------------------------- scene 3
// Harbor at Dusk — 8 differences. The harbour from the rank 1 and rank 3
// games, drawn again here with eight fair shifts of its own.
function drawHarbour(ctx, v) {
  sky(ctx, '#ff9e5e', '#ffd9a0');
  // Low sun.
  circle(ctx, 440, 110, 38, '#ffe066');
  // Clouds: one removed in the changed picture.
  cloud(ctx, 80, 60, 1, '#fff3e0');
  if (v === 0) cloud(ctx, 250, 45, 0.8, '#fff3e0');
  cloud(ctx, 350, 80, 0.7, '#fff3e0');
  // Gulls: one added in the changed picture.
  bird(ctx, 180, 90, 1, '#5c4a3a');
  bird(ctx, 230, 110, 0.9, '#5c4a3a');
  if (v === 1) bird(ctx, 380, 60, 0.9, '#5c4a3a');
  // Sea.
  rect(ctx, 0, 250, 560, 120, '#2a6f97');
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(20 + i * 110, 280 + (i % 2) * 18);
    ctx.quadraticCurveTo(50 + i * 110, 272 + (i % 2) * 18, 80 + i * 110, 280 + (i % 2) * 18);
    ctx.stroke();
  }
  // Sand.
  rect(ctx, 0, 370, 560, 70, '#f2d8a7');
  // Lighthouse, right: one band recoloured in the changed picture.
  rect(ctx, 480, 110, 40, 160, '#f8f9fa');
  rect(ctx, 480, 140, 40, 26, v === 0 ? '#e63946' : '#2563eb');
  rect(ctx, 480, 196, 40, 26, '#e63946');
  tri(ctx, 474, 110, 526, 110, 500, 84, '#343a40');
  circle(ctx, 500, 96, 8, '#ffe066');
  // Houses along the shore: one roof recoloured in the changed picture.
  const houses = [
    { x: 40, w: 70, roof: '#b23a48', wall: '#fff3e0' },
    { x: 130, w: 70, roof: '#2563eb', wall: '#e0fbfc' },
    { x: 220, w: 70, roof: '#7b2cbf', wall: '#fff3e0' },
  ];
  houses.forEach((h, i) => {
    let roof = h.roof;
    if (v === 1 && i === 2) roof = '#ff6b9d';
    tri(ctx, h.x - 6, 300, h.x + h.w / 2, 268, h.x + h.w + 6, 300, roof);
    rect(ctx, h.x, 300, h.w, 70, h.wall);
    rect(ctx, h.x + h.w / 2 - 10, 330, 20, 40, '#7a4a21');
    rect(ctx, h.x + 10, 312, 14, 14, '#ffe066');
    rect(ctx, h.x + h.w - 24, 312, 14, 14, '#ffe066');
  });
  // Sailboats: the small green one is removed in the changed picture.
  // Big boat, centre: its sail flips side in the changed picture.
  rect(ctx, 300, 300, 90, 16, '#7a4a21');
  rect(ctx, 340, 240, 6, 62, '#5d3a17');
  if (v === 0) tri(ctx, 346, 244, 346, 296, 392, 296, '#f8f9fa');
  else tri(ctx, 340, 244, 340, 296, 294, 296, '#f8f9fa');
  if (v === 0) {
    rect(ctx, 130, 316, 46, 12, '#2a9d8f');
    rect(ctx, 150, 280, 4, 38, '#5d3a17');
    tri(ctx, 154, 282, 154, 314, 180, 314, '#90be6d');
  }
  // Buoy: moved in the changed picture.
  const bx = v === 0 ? 350 : 300;
  const by = v === 0 ? 330 : 348;
  circle(ctx, bx, by, 10, '#ff6b35');
  rect(ctx, bx - 10, by - 4, 20, 8, '#fff');
  // Fish: one added in the changed picture.
  fish(ctx, 120, 400, 1, '#219ebc', false);
  if (v === 1) fish(ctx, 235, 405, 0.9, '#fb8500', true);
  fish(ctx, 170, 415, 0.8, '#ffb703', false);
  // Beach props.
  rect(ctx, 40, 390, 26, 26, '#b08954');
  circle(ctx, 470, 400, 12, '#c77dff');
}

const SCENE_HARBOUR = {
  name: 'Harbor at Dusk',
  sub: 'Scene 3 of 6',
  par: '2:00',
  diffs: [
    { x: 0.89, y: 0.35, r: 0.07, kind: 'recoloured', label: 'a lighthouse band changed colour' },
    { x: 0.28, y: 0.70, r: 0.07, kind: 'removed', label: 'a sailboat vanished' },
    { x: 0.63, y: 0.75, r: 0.07, kind: 'moved', label: 'the buoy drifted', x2: 0.54, y2: 0.79 },
    { x: 0.42, y: 0.92, r: 0.06, kind: 'added', label: 'a fish appeared' },
    { x: 0.45, y: 0.10, r: 0.07, kind: 'removed', label: 'a cloud vanished' },
    { x: 0.46, y: 0.64, r: 0.06, kind: 'recoloured', label: 'a house roof changed colour' },
    { x: 0.68, y: 0.14, r: 0.06, kind: 'added', label: 'a gull appeared' },
    { x: 0.62, y: 0.61, r: 0.07, kind: 'flipped', label: 'the big sail flipped side' },
  ],
  draw: drawHarbour,
};

// ---------------------------------------------------------------- scene 4
// Mountain Cabin Night — 8 differences.
function drawCabin(ctx, v) {
  sky(ctx, '#0b1026', '#274156');
  // Moon: recoloured in the changed picture.
  circle(ctx, 460, 60, 30, v === 0 ? '#fdf6c9' : '#ffb703');
  circle(ctx, 450, 52, 6, 'rgba(0,0,0,0.12)');
  circle(ctx, 468, 68, 4, 'rgba(0,0,0,0.12)');
  // Stars: one removed in the changed picture.
  const stars = [[80, 40], [150, 70], [230, 35], [320, 60], [110, 110], [400, 120], [520, 30]];
  stars.forEach(([x, y], i) => {
    if (v === 1 && i === 2) return;
    circle(ctx, x, y, 3, '#fff');
  });
  // Mountains.
  tri(ctx, -20, 300, 140, 120, 300, 300, '#5a6c7d');
  tri(ctx, 110, 140, 140, 120, 170, 140, '#ffffff');
  tri(ctx, 200, 300, 380, 90, 560, 300, '#415a6b');
  tri(ctx, 350, 118, 380, 90, 410, 118, '#ffffff');
  // Snow ground.
  rect(ctx, 0, 300, 560, 140, '#eef4f7');
  // Pines: the left one is taller in the changed picture.
  function pine(x, y, s) {
    rect(ctx, x - 5, y, 10, 24, '#5d3a17');
    tri(ctx, x - 30 * s, y, x, y - 60 * s, x + 30 * s, y, '#1b4332');
    tri(ctx, x - 24 * s, y - 40 * s, x, y - 95 * s, x + 24 * s, y - 40 * s, '#2d6a4f');
  }
  pine(70, 330, v === 0 ? 1 : 1.45);
  pine(510, 330, 0.9);
  pine(180, 350, 0.7);
  // Cabin.
  rect(ctx, 230, 220, 140, 100, '#8a5a2b');
  tri(ctx, 218, 222, 300, 168, 382, 222, '#5d3a17');
  rect(ctx, 285, 270, 30, 50, '#4a2c0a');
  // Window light: recoloured in the changed picture.
  rect(ctx, 245, 240, 26, 26, v === 0 ? '#ffd93b' : '#7dd3fc');
  rect(ctx, 330, 240, 26, 26, v === 0 ? '#ffd93b' : '#7dd3fc');
  // Chimney + smoke: drifting the other way in the changed picture.
  rect(ctx, 340, 180, 20, 42, '#6c757d');
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  const drift = v === 0 ? 1 : -1;
  circle(ctx, 350 + 14 * drift, 168, 9, 'rgba(255,255,255,0.75)');
  circle(ctx, 350 + 26 * drift, 152, 12, 'rgba(255,255,255,0.6)');
  circle(ctx, 350 + 40 * drift, 134, 15, 'rgba(255,255,255,0.45)');
  // Snowman: hat removed in the changed picture.
  circle(ctx, 400, 350, 22, '#fff');
  circle(ctx, 400, 316, 16, '#fff');
  circle(ctx, 400, 292, 12, '#fff');
  tri(ctx, 400, 292, 424, 296, 400, 300, '#ff6b35');
  if (v === 0) {
    rect(ctx, 388, 272, 24, 10, '#343a40');
    rect(ctx, 392, 258, 16, 14, '#343a40');
  }
  // Lantern: added by the door in the changed picture.
  if (v === 1) {
    rect(ctx, 322, 296, 14, 18, '#ffd93b');
    ctx.strokeStyle = '#343a40';
    ctx.lineWidth = 2;
    ctx.strokeRect(322, 296, 14, 18);
  }
  // Sled: moved in the changed picture.
  const sx = v === 0 ? 120 : 210;
  rect(ctx, sx, 385, 60, 8, '#b23a48');
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(sx + 8, 393);
  ctx.lineTo(sx + 20, 405);
  ctx.moveTo(sx + 52, 393);
  ctx.lineTo(sx + 40, 405);
  ctx.stroke();
}

const SCENE_CABIN = {
  name: 'Mountain Cabin Night',
  sub: 'Scene 4 of 6',
  par: '2:00',
  diffs: [
    { x: 0.41, y: 0.08, r: 0.05, kind: 'removed', label: 'a star vanished' },
    { x: 0.82, y: 0.14, r: 0.07, kind: 'recoloured', label: 'the moon changed colour' },
    { x: 0.63, y: 0.34, r: 0.08, kind: 'moved', label: 'the chimney smoke drifted' },
    { x: 0.13, y: 0.62, r: 0.08, kind: 'resized', label: 'a pine tree grew taller' },
    { x: 0.71, y: 0.62, r: 0.06, kind: 'removed', label: 'the snowman lost its hat' },
    { x: 0.59, y: 0.70, r: 0.05, kind: 'added', label: 'a lantern appeared' },
    { x: 0.27, y: 0.90, r: 0.07, kind: 'moved', label: 'the sled moved', x2: 0.43, y2: 0.90 },
    { x: 0.46, y: 0.57, r: 0.05, kind: 'recoloured', label: 'the window light changed colour' },
  ],
  draw: drawCabin,
};

// ---------------------------------------------------------------- scene 5
// Lantern Night Market — 8 differences.
function drawMarket(ctx, v) {
  sky(ctx, '#1b1040', '#4c1d95');
  // Moon: resized (bigger) in the changed picture.
  circle(ctx, 490, 48, v === 0 ? 22 : 32, '#fdf6c9');
  // String lights: one bulb removed in the changed picture.
  ctx.strokeStyle = '#f8f9fa';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 90);
  ctx.quadraticCurveTo(280, 130, 560, 90);
  ctx.stroke();
  const bulbs = ['#ffd93b', '#ff6b9d', '#7dd3fc', '#90be6d', '#f4a261'];
  for (let i = 0; i < 9; i += 1) {
    if (v === 1 && i === 5) continue;
    const bx = 30 + i * 60;
    const by = 90 + Math.sin((bx / 560) * Math.PI) * 34 + 6;
    circle(ctx, bx, by, 7, bulbs[i % 5]);
  }
  // Stall awnings + counters.
  const stalls = [
    { x: 30, awn: '#e63946', sign: 'FRUIT' },
    { x: 210, awn: '#2a9d8f', sign: 'FISH' },
    { x: 390, awn: '#f4a261', sign: 'TEA' },
  ];
  stalls.forEach((s, i) => {
    rect(ctx, s.x, 200, 140, 26, s.awn);
    for (let k = 0; k < 5; k += 1) rect(ctx, s.x + k * 28, 200, 14, 26, 'rgba(255,255,255,0.35)');
    rect(ctx, s.x + 8, 226, 124, 90, '#6d4c2f');
    rect(ctx, s.x + 8, 226, 124, 10, '#8a5a2b');
    // Stall sign: the middle one is removed in the changed picture.
    if (!(v === 1 && i === 1)) {
      rect(ctx, s.x + 40, 176, 60, 22, '#fffdf5');
      ctx.fillStyle = '#343a40';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.sign, s.x + 70, 191);
    }
  });
  // Hanging lanterns: one recoloured in the changed picture.
  function lantern(x, y, col) {
    ctx.strokeStyle = '#f8f9fa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 34);
    ctx.lineTo(x, y - 12);
    ctx.stroke();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(x, y, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(x - 3, y - 20, 6, 40);
    rect(ctx, x - 6, y - 26, 12, 6, '#ffd93b');
    rect(ctx, x - 6, y + 20, 12, 6, '#ffd93b');
  }
  lantern(120, 150, '#e63946');
  lantern(280, 140, v === 0 ? '#e63946' : '#f4a261');
  lantern(440, 150, '#e63946');
  // Banner: flipped in the changed picture.
  ctx.fillStyle = '#ffd93b';
  ctx.fillRect(460, 240, 70, 34);
  ctx.fillStyle = '#b23a48';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  if (v === 0) ctx.fillText('SALE', 495, 263); else ctx.fillText('ELAS', 495, 263);
  // Crates: one added in the changed picture.
  rect(ctx, 60, 330, 40, 40, '#b08954');
  rect(ctx, 104, 330, 40, 40, '#b08954');
  rect(ctx, 82, 292, 40, 38, '#b08954');
  if (v === 1) rect(ctx, 180, 336, 36, 34, '#b08954');
  // Fish on the middle stall: moved in the changed picture.
  const fx = v === 0 ? 260 : 300;
  fish(ctx, fx, 250, 0.9, '#7dd3fc', v === 1);
  // Cat: on a crate in the original, by the tea stall in the changed picture.
  if (v === 0) drawCat(ctx, 122, 288, 0.9, '#212529'); else drawCat(ctx, 420, 352, 0.9, '#212529');
  // Ground.
  rect(ctx, 0, 370, 560, 70, '#3b2f4a');
}

const SCENE_MARKET = {
  name: 'Lantern Night Market',
  sub: 'Scene 5 of 6',
  par: '2:00',
  diffs: [
    { x: 0.50, y: 0.32, r: 0.06, kind: 'recoloured', label: 'a lantern changed colour' },
    { x: 0.50, y: 0.42, r: 0.06, kind: 'removed', label: 'a stall sign vanished' },
    { x: 0.72, y: 0.80, r: 0.07, kind: 'moved', label: 'the cat moved', x2: 0.22, y2: 0.65 },
    { x: 0.35, y: 0.79, r: 0.06, kind: 'added', label: 'a crate appeared' },
    { x: 0.54, y: 0.26, r: 0.05, kind: 'removed', label: 'a string-light bulb vanished' },
    { x: 0.88, y: 0.58, r: 0.06, kind: 'flipped', label: 'the banner reads backwards' },
    { x: 0.88, y: 0.11, r: 0.07, kind: 'resized', label: 'the moon grew bigger' },
    { x: 0.46, y: 0.57, r: 0.06, kind: 'moved', label: 'the fish moved', x2: 0.54, y2: 0.57 },
  ],
  draw: drawMarket,
};

// ---------------------------------------------------------------- scene 6
// Space Station Window — 8 differences.
function drawStation(ctx, v) {
  rect(ctx, 0, 0, 560, 440, '#0d1b2a');
  // Stars: one removed in the changed picture.
  const stars = [[40, 50], [120, 90], [200, 40], [300, 80], [500, 60], [60, 200], [520, 200]];
  stars.forEach(([x, y], i) => {
    if (v === 1 && i === 3) return;
    circle(ctx, x, y, 3, '#fff');
  });
  // Big window with Earth.
  ctx.strokeStyle = '#8d99ae';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(280, 220, 150, 0, Math.PI * 2);
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.arc(280, 220, 145, 0, Math.PI * 2);
  ctx.clip();
  rect(ctx, 130, 70, 300, 300, '#0b2545');
  circle(ctx, 280, 230, 95, '#219ebc');
  // Continents.
  ctx.fillStyle = '#2f9e44';
  ctx.beginPath();
  ctx.ellipse(250, 200, 34, 20, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(315, 260, 26, 16, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // A cloud over Earth: moved in the changed picture.
  if (v === 0) cloud(ctx, 240, 150, 0.7, 'rgba(255,255,255,0.9)');
  else cloud(ctx, 300, 180, 0.7, 'rgba(255,255,255,0.9)');
  ctx.restore();
  // Control panel, bottom.
  rect(ctx, 0, 380, 560, 60, '#1b263b');
  const btnCols = ['#2f9e44', '#ffd93b', '#e63946'];
  btnCols.forEach((c, i) => {
    let col = c;
    // One button recoloured in the changed picture.
    if (v === 1 && i === 0) col = '#e63946';
    circle(ctx, 380 + i * 50, 410, 12, col);
  });
  rect(ctx, 40, 398, 180, 10, '#415a77');
  rect(ctx, 40, 398, 120, 10, '#90be6d');
  // Astronaut: helmet light recoloured in the changed picture.
  circle(ctx, 150, 300, 34, '#f8f9fa');
  circle(ctx, 150, 300, 24, v === 0 ? '#7dd3fc' : '#ff6b9d');
  circle(ctx, 150, 300, 10, '#0d1b2a');
  rect(ctx, 140, 330, 20, 40, '#e9ecef');
  // Robot arm: moved in the changed picture.
  ctx.strokeStyle = '#adb5bd';
  ctx.lineWidth = 8;
  ctx.beginPath();
  if (v === 0) { ctx.moveTo(430, 380); ctx.lineTo(460, 330); ctx.lineTo(430, 300); }
  else { ctx.moveTo(430, 380); ctx.lineTo(400, 330); ctx.lineTo(430, 300); }
  ctx.stroke();
  circle(ctx, 430, 300, 10, '#e63946');
  // Poster: flipped in the changed picture.
  rect(ctx, 450, 90, 80, 110, '#fffdf5');
  ctx.fillStyle = '#b23a48';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  if (v === 0) ctx.fillText('MARS', 490, 130); else ctx.fillText('SRAM', 490, 130);
  tri(ctx, 490, 145, 470, 180, 510, 180, '#2563eb');
  // Plant: resized (bigger) in the changed picture.
  const ps = v === 0 ? 1 : 1.5;
  rect(ctx, 60 - 12 * ps, 350 - 10 * ps, 24 * ps, 20 * ps, '#e07a5f');
  circle(ctx, 60, 338 - 8 * ps, 14 * ps, '#2f9e44');
  circle(ctx, 48, 346 - 6 * ps, 9 * ps, '#37b24d');
  circle(ctx, 72, 346 - 6 * ps, 9 * ps, '#37b24d');
  // Mug: added, floating, in the changed picture.
  if (v === 1) {
    rect(ctx, 340, 280, 18, 20, '#9b5de5');
    ctx.strokeStyle = '#9b5de5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(361, 290, 7, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
}

const SCENE_STATION = {
  name: 'Space Station Window',
  sub: 'Scene 6 of 6',
  par: '2:00',
  diffs: [
    { x: 0.54, y: 0.18, r: 0.05, kind: 'removed', label: 'a star vanished' },
    { x: 0.43, y: 0.34, r: 0.07, kind: 'moved', label: 'an Earth cloud moved', x2: 0.54, y2: 0.41 },
    { x: 0.27, y: 0.68, r: 0.07, kind: 'recoloured', label: 'the helmet light changed colour' },
    { x: 0.88, y: 0.34, r: 0.06, kind: 'flipped', label: 'the poster reads backwards' },
    { x: 0.62, y: 0.66, r: 0.05, kind: 'added', label: 'a mug appeared, floating' },
    { x: 0.11, y: 0.78, r: 0.06, kind: 'resized', label: 'the plant grew bigger' },
    { x: 0.68, y: 0.93, r: 0.05, kind: 'recoloured', label: 'a panel button changed colour' },
    { x: 0.82, y: 0.75, r: 0.07, kind: 'moved', label: 'the robot arm moved', x2: 0.71, y2: 0.75 },
  ],
  draw: drawStation,
};

export const SCENES = [
  SCENE_PICNIC,
  SCENE_LIBRARY,
  SCENE_HARBOUR,
  SCENE_CABIN,
  SCENE_MARKET,
  SCENE_STATION,
];

export const TOTAL_DIFFERENCES = SCENES.reduce((n, s) => n + s.diffs.length, 0);
export const PANEL_W = 560;
export const PANEL_H = 440;
