// Música de fondo hawaiana generada por código, sin instrumentos posteriores al contacto:
// tambor pahu (grave), calabaza ipu heke (golpe grave + palmada), piedras ʻiliʻili, flauta nasal ʻohe hano ihu
// (pentatónica, con aire) y olas de fondo. Uso: node scripts/musica-hawaiana.mjs [seg] [salida]
import { writeFileSync, mkdirSync } from 'node:fs';

const [seg = '320', out = 'public/musica/hawaiana.wav'] = process.argv.slice(2);
const SR = 44100, N = Math.ceil(Number(seg) * SR);
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 41; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

function pahu(t0, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(SR, N - s0);
  for (let i = 0; i < len; i++) {
    const t = i / SR, f = 55 + 40 * Math.exp(-t * 18);
    const v = (Math.sin(2 * Math.PI * f * t) + (rnd() * 2 - 1) * 0.08 * Math.exp(-t * 40)) * Math.exp(-t * 4.5) * vol;
    L[s0 + i] += v; R[s0 + i] += v;
  }
}
function ipu(t0, vol, grave) {
  const s0 = Math.floor(t0 * SR), len = Math.min(SR / 3, N - s0);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const v = grave
      ? (Math.sin(2 * Math.PI * (120 + 60 * Math.exp(-t * 50)) * t) * Math.exp(-t * 14) + (rnd() * 2 - 1) * 0.2 * Math.exp(-t * 80)) * vol
      : ((rnd() * 2 - 1) * Math.exp(-t * 70) + Math.sin(2 * Math.PI * 340 * t) * 0.3 * Math.exp(-t * 40)) * vol;
    L[s0 + i] += v * 0.55; R[s0 + i] += v * 0.45;
  }
}
function iliili(t0, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(SR / 20, N - s0);
  for (let i = 0; i < len; i++) { const t = i / SR, v = (rnd() * 2 - 1) * Math.exp(-t * 300) * vol; L[s0 + i] += v * 0.4; R[s0 + i] += v * 0.6; }
}
function flauta(t0, dur, midi, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0); let ph = 0, ruido = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, env = Math.min(1, t / 0.4) * Math.min(1, (dur - t) / 0.7);
    ph += (2 * Math.PI * hz(midi) * (1 + 0.004 * Math.sin(2 * Math.PI * 4.5 * t))) / SR;
    ruido = ruido * 0.9 + (rnd() * 2 - 1) * 0.1; // aire suave de la flauta nasal
    const v = (Math.sin(ph) + 0.12 * Math.sin(3 * ph) + ruido * 0.5) * env * vol;
    L[s0 + i] += v * 0.5; R[s0 + i] += v * 0.5;
  }
}
// Pentatónica mayor en Do (la flauta nasal tiene pocas notas): C D E G A
const esc = [72, 74, 76, 79, 81, 84];
const pulso = 0.75; // ritmo lento de hula kahiko: pahu en 1, ipu heke grave/palmada
for (let t = 1, n = 0; t < Number(seg) - 2; t += pulso, n++) {
  if (n % 4 === 0) pahu(t, 0.32);
  ipu(t, n % 2 === 0 ? 0.16 : 0.09, n % 2 === 0);
  if (n % 2 === 1) ipu(t + pulso / 2, 0.06, false);
  if (n % 8 >= 6) iliili(t + pulso * 0.25, 0.08), iliili(t + pulso * 0.75, 0.06);
}
const frases = [[2, 3, 2, 1, 0], [0, 1, 2, 4, 3], [3, 2, 1, 2, 0], [4, 3, 2, 1, 2]];
for (let t = 5, n = 0; t < Number(seg) - 10; t += 10.5, n++) {
  if (n % 3 === 2) continue;
  frases[n % 4].forEach((k, j) => flauta(t + j * 1.5, 1.9 + (j === 4 ? 2 : 0), esc[k] - 12, 0.05));
}
// olas: ruido filtrado con oleaje lento
let a = 0, b = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR, ola = 0.5 + 0.5 * Math.sin(2 * Math.PI * t / 9 + Math.sin(t / 23) * 2);
  a = a * 0.985 + (rnd() * 2 - 1) * 0.015; b = b * 0.97 + (rnd() * 2 - 1) * 0.03;
  L[i] += a * 0.5 * ola * ola; R[i] += b * 0.35 * ola * ola;
}
const fade = SR * 3, data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) { const g = Math.min(1, i / fade, (N - i) / fade); data.writeInt16LE(Math.max(-1, Math.min(1, L[i] * g)) * 32767 | 0, i * 4); data.writeInt16LE(Math.max(-1, Math.min(1, R[i] * g)) * 32767 | 0, i * 4 + 2); }
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16);
h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28);
h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true });
writeFileSync(out, Buffer.concat([h, data]));
console.log('ok', out);
