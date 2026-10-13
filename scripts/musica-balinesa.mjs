// Música de fondo para la mitología balinesa, generada por código (sin APIs ni grabaciones), con aire de gendér
// wayang (el conjunto que acompaña al teatro de sombras): metalófonos en afinación slendro de cinco notas, tocados en
// pares desafinados unos hercios para que "laten" (ombak), una línea grave lenta, dos partes agudas que se
// entrelazan (kotekan) a partir de caminatas al azar con semilla fija (no imitan ninguna pieza), un gong grave cada
// ciclo y el kempli que marca el pulso muy suave. Cada tanto queda solo la línea grave y el gong.
// Sale con el mismo volumen medio que las otras músicas (≈ −33 dB).
// Uso: node scripts/musica-balinesa.mjs [seg] [salida]
import { writeFileSync, mkdirSync } from 'node:fs';

const [seg = '320', out = 'public/musica/balinesa.wav'] = process.argv.slice(2);
const SR = 44100, N = Math.ceil(Number(seg) * SR), DB_OBJETIVO = -33.2;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 1343; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// Slendro aproximado (cents desde la nota base); dos octavas y media desde ~196 Hz.
const SLENDRO = [0, 231, 474, 717, 955];
const BASE = 196;
const nota = (i) => BASE * 2 ** ((Math.floor(i / 5) * 1200 + SLENDRO[((i % 5) + 5) % 5]) / 1200);

/** Golpe de metalófono: dos lengüetas gemelas desafinadas (ombak), parcial inarmónico y golpe de mazo. */
function gangsa(t0, f, vol, pan = 0.5, dur = 1.8, ombak = 3) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0);
  if (s0 < 0 || len <= 0) return;
  let p1 = 0, p2 = 0, p3 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, k = t / dur;
    p1 += (2 * Math.PI * (f - ombak / 2)) / SR; p2 += (2 * Math.PI * (f + ombak / 2)) / SR; p3 += (2 * Math.PI * f * 2.74) / SR;
    const env = Math.min(1, t / 0.004) * Math.exp(-t * 1.6) * Math.min(1, (1 - k) * 6);
    const v = ((Math.sin(p1) + Math.sin(p2)) * 0.5 * env + Math.sin(p3) * 0.18 * Math.exp(-t * 14) + (rnd() * 2 - 1) * 0.05 * Math.exp(-t * 160)) * vol;
    L[s0 + i] += v * (1 - pan); R[s0 + i] += v * pan;
  }
}
/** Gong grave (kempur): golpe hondo que late despacio y se apaga largo. */
function gong(t0, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 6), N - s0);
  let p1 = 0, p2 = 0, p3 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    p1 += (2 * Math.PI * 88.5) / SR; p2 += (2 * Math.PI * 89.6) / SR; p3 += (2 * Math.PI * 88 * 2.02) / SR;
    const env = Math.min(1, t / 0.03) * Math.exp(-t * 0.55);
    const v = ((Math.sin(p1) + Math.sin(p2)) * 0.5 + Math.sin(p3) * 0.2 * Math.exp(-t * 1.5)) * env * vol;
    L[s0 + i] += v * 0.5; R[s0 + i] += v * 0.5;
  }
}
/** Kempli: gonguito apagado que marca el pulso (golpe corto y sordo). */
function kempli(t0, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 0.25), N - s0);
  let p = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    p += (2 * Math.PI * 520) / SR;
    const v = (Math.sin(p) * Math.exp(-t * 22) + (rnd() * 2 - 1) * 0.15 * Math.exp(-t * 90)) * vol;
    L[s0 + i] += v * 0.45; R[s0 + i] += v * 0.55;
  }
}

// Pulso tranquilo (≈ 66 por minuto). Ciclos de 16 pulsos: gong al final de cada ciclo.
const pulso = 60 / 66, total = Number(seg) - 6;
let grave = 2, aguda = 9;
let motivo = Array.from({ length: 8 }, () => (grave = Math.max(0, Math.min(6, grave + [-1, 0, 1, 2, -2][Math.floor(rnd() * 5)]))));
for (let t = 1.2, n = 0; t < total; t += pulso, n++) {
  const ciclo = Math.floor(n / 16), enCiclo = n % 16;
  if (enCiclo === 0 && ciclo % 2 === 0 && n > 0) motivo = motivo.map((v) => Math.max(0, Math.min(6, v + [-1, 0, 0, 1][Math.floor(rnd() * 4)])));
  if (enCiclo === 15) gong(t + pulso, 0.55);
  kempli(t, 0.035);
  // Línea grave: una nota por pulso, larga.
  if (enCiclo % 2 === 0) gangsa(t, nota(motivo[(enCiclo / 2) % 8]), 0.16, 0.45, 3.2, 2.2);
  // Kotekan: dos partes que se reparten las corcheas (polos en el pulso, sangsih a contratiempo).
  const respiro = ciclo % 4 === 3;
  if (!respiro) {
    for (const [d, lado] of [[0, 0.3], [0.5, 0.7]]) {
      aguda = Math.max(5, Math.min(13, aguda + [-1, -1, 0, 1, 1, 2, -2][Math.floor(rnd() * 7)]));
      if (rnd() < 0.86) gangsa(t + d * pulso, nota(aguda), 0.07, lado, 1.2, 3.4);
    }
  }
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
