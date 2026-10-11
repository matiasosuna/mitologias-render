// Música de fondo egipcia generada por código: arpa (Karplus-Strong) en modo Hijaz, flauta de caña (ney)
// con vibrato y pandero (tar) con ritmo maqsum lento. Uso: node scripts/musica-egipcia.mjs [seg] [salida]
import { writeFileSync, mkdirSync } from 'node:fs';

const [seg = '320', out = 'public/musica/egipcia.wav'] = process.argv.slice(2);
const SR = 44100, N = Math.ceil(Number(seg) * SR);
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 23; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

function arpa(t0, midi, vol, pan) {
  const p = Math.round(SR / hz(midi)), buf = Float32Array.from({ length: p }, () => rnd() * 2 - 1);
  const s0 = Math.floor(t0 * SR), len = Math.min(SR * 3, N - s0);
  for (let i = 0, k = 0; i < len; i++, k = (k + 1) % p) { const s = buf[k]; buf[k] = 0.4975 * (s + buf[(k + 1) % p]); L[s0 + i] += s * vol * (1 - pan); R[s0 + i] += s * vol * pan; }
}
function ney(t0, dur, midi, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0); let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, env = Math.min(1, t / 0.35) * Math.min(1, (dur - t) / 0.6);
    ph += (2 * Math.PI * hz(midi) * (1 + 0.006 * Math.sin(2 * Math.PI * 5.5 * t))) / SR;
    const v = (Math.sin(ph) + 0.25 * Math.sin(2 * ph) + (rnd() * 2 - 1) * 0.06) * env * vol;
    L[s0 + i] += v * 0.55; R[s0 + i] += v * 0.45;
  }
}
function tar(t0, vol, grave) {
  const s0 = Math.floor(t0 * SR), len = Math.min(SR / 2, N - s0);
  for (let i = 0; i < len; i++) {
    const t = i / SR, f = grave ? 70 + 50 * Math.exp(-t * 30) : 180;
    const v = (Math.sin(2 * Math.PI * f * t) * (grave ? 1 : 0.3) + (rnd() * 2 - 1) * (grave ? 0.15 : 0.6) * Math.exp(-t * 60)) * Math.exp(-t * (grave ? 8 : 25)) * vol;
    L[s0 + i] += v; R[s0 + i] += v;
  }
}
// Hijaz en Re: D Eb F# G A Bb C D
const esc = [50, 51, 54, 55, 57, 58, 60, 62];
const golpe = 0.6; // maqsum lento: D T _ T D _ T _
const patron = ['D', 'T', '', 'T', 'D', '', 'T', ''];
for (let t = 1, n = 0; t < Number(seg) - 2; t += golpe, n++) {
  const g = patron[n % 8];
  if (g === 'D') tar(t, 0.3, true); else if (g === 'T') tar(t, 0.12, false);
  if (n % 2 === 0) arpa(t, esc[[0, 2, 4, 3, 5, 4, 2, 1][(n / 2) % 8]] + 12, 0.12, 0.3 + rnd() * 0.4);
  if (n % 16 === 0) arpa(t, 38, 0.18, 0.5);
}
const frases = [[4, 5, 4, 3, 2], [2, 3, 4, 5, 7], [5, 4, 2, 1, 0], [0, 1, 2, 3, 4]];
for (let t = 6, n = 0; t < Number(seg) - 10; t += 9.6, n++) {
  if (n % 4 === 3) continue;
  frases[n % 4].forEach((k, j) => ney(t + j * 1.2, 1.6 + (j === 4 ? 1.6 : 0), esc[k] + 12, 0.05));
}
for (let i = 0; i < N; i++) { const t = i / SR, d = 0.02 * Math.sin(2 * Math.PI * hz(38) * t) * (0.7 + 0.3 * Math.sin(t * 0.3)); L[i] += d; R[i] += d; }
const fade = SR * 3, data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) { const g = Math.min(1, i / fade, (N - i) / fade); data.writeInt16LE(Math.max(-1, Math.min(1, L[i] * g)) * 32767 | 0, i * 4); data.writeInt16LE(Math.max(-1, Math.min(1, R[i] * g)) * 32767 | 0, i * 4 + 2); }
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16);
h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28);
h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true });
writeFileSync(out, Buffer.concat([h, data]));
console.log('ok', out);
