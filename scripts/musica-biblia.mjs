// Música de fondo para Learn Bible 777 (serie `biblia`), generada por código (sin APIs ni grabaciones):
// un colchón de cuerdas suave (acordes largos que se abren y cierran despacio, sin percusión), arpegios de arpa
// tranquilos y, de vez en cuando, una campana lejana. Progresión inventada en re mayor con semilla fija: no imita
// ningún himno ni pieza conocida. Calma y reverente. Sale con el mismo volumen medio que las otras músicas (≈ −33 dB).
// 480 s para que alcance a los episodios largos (el render la recorta, no la repite).
// Uso: node scripts/musica-biblia.mjs [seg] [salida]
import { writeFileSync, mkdirSync } from 'node:fs';

const [seg = '480', out = 'public/musica/biblia.wav'] = process.argv.slice(2);
const SR = 44100, N = Math.ceil(Number(seg) * SR), DB_OBJETIVO = -33.2;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 777; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const RE = 50; // re grave

/** Voz de cuerda del colchón: pocos armónicos suaves, dos osciladores desafinados apenas, entrada y salida lentas. */
function cuerda(t0, dur, midi, vol, pan) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0);
  if (len <= 0) return;
  const f0 = hz(midi), fa = new Float64Array(5), fb = new Float64Array(5);
  const ataque = Math.min(2.5, dur * 0.35), caida = Math.min(3, dur * 0.4);
  for (let i = 0; i < len; i++) {
    const t = i / SR, env = Math.min(1, t / ataque) * Math.min(1, (dur - t) / caida);
    const vib = 1 + 0.0018 * Math.sin(2 * Math.PI * 4.6 * t + midi);
    let v = 0;
    for (let k = 1; k <= 5; k++) {
      fa[k - 1] += (2 * Math.PI * f0 * k * vib) / SR; fb[k - 1] += (2 * Math.PI * f0 * k * 1.003) / SR;
      v += (Math.sin(fa[k - 1]) + Math.sin(fb[k - 1])) * 0.5 / k ** 1.6;
    }
    v *= env * env * vol;
    L[s0 + i] += v * (1 - pan); R[s0 + i] += v * pan;
  }
}
/** Arpa: cuerda pulsada (seno con armónicos que se apagan rápido) y una cola larga. */
function arpa(t0, midi, vol, pan) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 3.2), N - s0);
  if (len <= 0) return;
  const f0 = hz(midi);
  let p1 = 0, p2 = 0, p3 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    p1 += (2 * Math.PI * f0) / SR; p2 += (2 * Math.PI * f0 * 2) / SR; p3 += (2 * Math.PI * f0 * 3.01) / SR;
    const v = (Math.sin(p1) * Math.exp(-t * 1.4) + Math.sin(p2) * 0.3 * Math.exp(-t * 3.5) + Math.sin(p3) * 0.12 * Math.exp(-t * 7)) * Math.min(1, t / 0.004) * vol;
    L[s0 + i] += v * (1 - pan); R[s0 + i] += v * pan;
  }
}
/** Campana lejana: parciales inarmónicos suaves con decaimiento muy largo. */
function campana(t0, midi, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 7), N - s0);
  if (len <= 0) return;
  const f0 = hz(midi), parc = [[1, 1, 0.5], [2.76, 0.35, 0.9], [5.4, 0.15, 1.6], [0.5, 0.25, 0.4]], ph = [0, 0, 0, 0];
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    let v = 0;
    parc.forEach(([m, a, d], k) => { ph[k] += (2 * Math.PI * f0 * m) / SR; v += Math.sin(ph[k]) * a * Math.exp(-t * d); });
    v *= Math.min(1, t / 0.01) * vol;
    L[s0 + i] += v * 0.45; R[s0 + i] += v * 0.55;
  }
}

// Acordes (en semitonos sobre re): I, vi, IV, V, I, iii, IV, I — y una variante con ii y V sus.
const ACORDES = [
  [[0, 7, 12, 16], [-3, 4, 9, 12], [-5, 2, 7, 11], [-5, 2, 7, 14], [0, 7, 12, 16], [-8, 4, 11, 16], [-5, 2, 9, 12], [0, 7, 12, 19]],
  [[0, 7, 12, 16], [-5, 2, 7, 11], [-10, 5, 9, 14], [-5, 2, 7, 12], [-3, 4, 9, 12], [-5, 2, 9, 14], [-5, 2, 7, 11], [0, 7, 12, 16]],
];
const DUR = 8; // segundos por acorde (≈ muy lento)
let n = 0;
for (let t = 0.2; t < Number(seg) - 2; t += DUR, n++) {
  const ac = ACORDES[Math.floor(n / 8) % ACORDES.length][n % 8];
  ac.forEach((x, j) => cuerda(t, DUR + 2.5, RE + x, j === 0 ? 0.075 : 0.05, 0.25 + j * 0.17));
  // arpa: entra después de la introducción, descansa una vuelta de cada cuatro
  const vuelta = Math.floor(n / 8);
  if (t > 10 && vuelta % 4 !== 3) {
    const notas = [...ac.slice(1), ac[1] + 12, ac[2] + 12].map((x) => RE + 12 + x);
    const paso = 0.5 + (n % 2) * 0.25;
    for (let k = 0; k < 8; k++) {
      if (rnd() < 0.18) continue;
      const i = k < 5 ? k : 8 - k;
      arpa(t + 0.3 + k * paso + (rnd() - 0.5) * 0.03, notas[Math.min(notas.length - 1, i)], 0.05 + rnd() * 0.015, 0.3 + rnd() * 0.4);
    }
  }
  if (n % 6 === 3) campana(t + 1 + rnd() * 3, RE + 24 + [0, 7, 12][Math.floor(rnd() * 3)], 0.035);
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
