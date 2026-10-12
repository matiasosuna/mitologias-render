// Música de fondo para la mitología azteca (mexica), generada por código (sin APIs ni grabaciones):
// tambor de madera de dos tonos (teponaztli) con un patrón tranquilo, tambor grave de cuero (huehuetl) que marca
// el pulso, sonajas de semillas (ayoyotl) a veces, flauta de barro con mucho aire (frases inventadas al azar con
// semilla fija sobre una escala pentatónica: no imita ningún canto ni pieza ceremonial) y viento de valle.
// Sale con el mismo volumen medio que las otras músicas (≈ −33 dB).
// Uso: node scripts/musica-azteca.mjs [seg] [salida]
import { writeFileSync, mkdirSync } from 'node:fs';

const [seg = '320', out = 'public/musica/azteca.wav'] = process.argv.slice(2);
const SR = 44100, N = Math.ceil(Number(seg) * SR), DB_OBJETIVO = -33.2;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 1325; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

/** Teponaztli: golpe de madera hueca, tono claro con un parcial inarmónico y ataque seco. */
function teponaztli(t0, vol, agudo) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 0.55), N - s0);
  const f0 = agudo ? 330 : 247; // dos lengüetas, una cuarta de distancia
  let p1 = 0, p2 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    p1 += (2 * Math.PI * f0) / SR; p2 += (2 * Math.PI * f0 * 2.76) / SR;
    const v = (Math.sin(p1) * Math.exp(-t * 9) + Math.sin(p2) * 0.25 * Math.exp(-t * 30) + (rnd() * 2 - 1) * 0.08 * Math.exp(-t * 120)) * vol;
    L[s0 + i] += v * (agudo ? 0.42 : 0.58); R[s0 + i] += v * (agudo ? 0.58 : 0.42);
  }
}
/** Huehuetl: tambor grave de cuero, golpe suave con la altura que cae. */
function huehuetl(t0, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR), N - s0);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, f = 56 + 30 * Math.exp(-t * 20);
    ph += (2 * Math.PI * f) / SR;
    const v = (Math.sin(ph) * Math.exp(-t * 4.5) + Math.sin(ph * 1.5) * 0.15 * Math.exp(-t * 10) + (rnd() * 2 - 1) * 0.1 * Math.exp(-t * 70)) * vol;
    L[s0 + i] += v * 0.5; R[s0 + i] += v * 0.5;
  }
}
/** Sonaja de semillas: ráfaga corta y brillante. */
function sonaja(t0, vol, pan = 0.5) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 0.16), N - s0);
  let a = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, r = rnd() * 2 - 1; a = r - a * 0.7;
    const v = a * Math.exp(-t * 28) * (1 + 0.4 * Math.sin(t * 900)) * vol;
    L[s0 + i] += v * (1 - pan); R[s0 + i] += v * pan;
  }
}
/** Flauta de barro: tono casi puro con mucho aire, entrada suave y un leve temblor. */
function flauta(t0, dur, midi, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0);
  let ph = 0, aire = 0, aire2 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, k = t / dur;
    const env = Math.min(1, t / 0.12) * Math.min(1, (dur - t) / 0.4) * (1 - 0.2 * k);
    const temblor = 0.08 * Math.sin(2 * Math.PI * 4.4 * t) * Math.min(1, t / 0.6);
    ph += (2 * Math.PI * hz(midi + temblor)) / SR;
    aire = aire * 0.9 + (rnd() * 2 - 1) * 0.1; aire2 = aire2 * 0.5 + aire * 0.5;
    const v = (Math.sin(ph) + 0.1 * Math.sin(2 * ph) + aire2 * (1.3 + 0.8 * Math.exp(-t * 8))) * env * vol;
    L[s0 + i] += v * 0.55; R[s0 + i] += v * 0.45;
  }
}

// Pulso: huehuetl lento (≈ 70 por minuto) en el 1 y el 3; teponaztli con un patrón de dos tonos que cambia cada
// 16 pulsos; sonajas a contratiempo de vez en cuando; cada tanto todo se calla y queda la flauta.
const pulso = 60 / 70;
const PATRONES = [[1, 0, 0, 1, 0, 1, 0, 0], [1, 0, 1, 0, 0, 1, 1, 0], [0, 1, 0, 1, 1, 0, 0, 1]];
for (let t = 1.5, n = 0; t < Number(seg) - 2; t += pulso, n++) {
  const bloque = Math.floor(n / 32);
  if (bloque % 4 === 3 && n % 32 > 18) continue; // respiro
  if (n % 2 === 0) huehuetl(t, n % 4 === 0 ? 0.32 : 0.2);
  const pat = PATRONES[Math.floor(n / 16) % PATRONES.length];
  [0, 0.5].forEach((d, j) => { if (pat[(n * 2 + j) % 8]) teponaztli(t + d * pulso, 0.11, ((n + j) % 3) === 0); });
  if (n % 8 === 5) sonaja(t + pulso / 2, 0.05, 0.3 + rnd() * 0.4);
}
// Flauta: pentatónica (re mi sol la si), registro medio, frases cortas con caminata al azar y notas largas.
const escala = [62, 64, 67, 69, 71, 74, 76];
let nota = 2;
for (let t = 8; t < Number(seg) - 12; ) {
  const notas = 3 + Math.floor(rnd() * 4);
  let tt = t;
  for (let j = 0; j < notas; j++) {
    nota = Math.max(0, Math.min(escala.length - 1, nota + [-2, -1, -1, 0, 1, 1, 2][Math.floor(rnd() * 7)]));
    const larga = j === notas - 1 ? 2.8 + rnd() * 1.6 : 0.7 + rnd() * 1.1;
    flauta(tt, larga + 0.2, escala[nota], 0.045);
    tt += larga;
  }
  nota = 1 + Math.floor(rnd() * 3);
  t = tt + 5 + rnd() * 6;
}
// Viento de valle: ruido filtrado que sube y baja despacio.
let a = 0, b = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR, rafaga = 0.5 + 0.5 * Math.sin(2 * Math.PI * t / 17 + Math.sin(t / 29) * 2);
  a = a * 0.994 + (rnd() * 2 - 1) * 0.006; b = b * 0.991 + (rnd() * 2 - 1) * 0.009;
  L[i] += a * 1.2 * rafaga; R[i] += b * 1.0 * rafaga;
}
// Fundido y volumen medio igual al de las otras músicas.
const fade = SR * 3;
let suma = 0;
for (let i = 0; i < N; i++) { const g = Math.min(1, i / fade, (N - i) / fade); L[i] *= g; R[i] *= g; suma += L[i] * L[i] + R[i] * R[i]; }
const rms = Math.sqrt(suma / (2 * N)), k = 10 ** (DB_OBJETIVO / 20) / rms;
const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) { data.writeInt16LE(Math.max(-1, Math.min(1, L[i] * k)) * 32767 | 0, i * 4); data.writeInt16LE(Math.max(-1, Math.min(1, R[i] * k)) * 32767 | 0, i * 4 + 2); }
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16);
h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28);
h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true });
writeFileSync(out, Buffer.concat([h, data]));
console.log('ok', out, `(${(20 * Math.log10(rms * k)).toFixed(1)} dB medio)`);
