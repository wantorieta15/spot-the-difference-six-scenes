// audio.js — tiny WebAudio bleeps for DOUBLE HARBOUR. No audio files, no
// network: every sound is synthesized with oscillators at play time.
let ctx = null;
let enabled = true;

export function setSound(on) {
  enabled = on;
}

export function isSoundOn() {
  return enabled;
}

function tone(freq, at, dur, type, vol) {
  if (!enabled) return;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime + at);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + at + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + at);
    osc.stop(ctx.currentTime + at + dur);
  } catch (_e) {
    // Audio is a garnish: a browser without it still plays fine.
  }
}

export function playClick() {
  tone(620, 0, 0.06, 'sine', 0.08);
}

export function playFound() {
  tone(880, 0, 0.12, 'sine', 0.16);
  tone(1318, 0.09, 0.18, 'sine', 0.14);
}

export function playMiss() {
  tone(160, 0, 0.22, 'sawtooth', 0.1);
}

export function playHint() {
  tone(1046, 0, 0.1, 'triangle', 0.12);
  tone(784, 0.08, 0.14, 'triangle', 0.1);
}

export function playWin() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.14));
}

export function playTick() {
  tone(980, 0, 0.04, 'square', 0.04);
}
