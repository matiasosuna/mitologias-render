// Música de fondo para la mitología norteamericana, generada por código (sin APIs ni grabaciones):
// tambor de mano de cuero (pulso parejo y suave), sonaja de calabaza a veces, flauta de madera con aire
// (pentatónica menor, frases inventadas al azar con semilla fija: no imita ningún canto ni canción ceremonial)
// y viento de bosque de fondo. Sale con el mismo volumen medio que las otras músicas (≈ −33 dB).
// Uso: node scripts/musica-norteamericana.mjs [seg] [salida]
import { writeFileSync, mkdirSync } from 'node:fs';

const [seg = '320', out = 'public/musica/norteamericana.wav'] = process.argv.slice(2);
const SR = 44100, N = Math.ceil(Number(seg) * SR), DB_OBJETIVO = -33.2;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 1492; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

/** Tambor de mano: golpe grave de cuero con la altura que cae y un poco de "piel". */
function tambor(t0, vol, grave = true) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 0.9), N - s0);
  const f0 = grave ? 62 : 88;
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, f = f0 + 34 * Math.exp(-t * 22);
    ph += (2 * Math.PI * f) / SR;
    const v = (Math.sin(ph) * Math.exp(-t * 5.5) + Math.sin(ph * 1.6) * 0.18 * Math.exp(-t * 12) + (rnd() * 2 - 1) * 0.12 * Math.exp(-t * 60)) * vol;
    L[s0 + i] += v * 0.52; R[s0 + i] += v * 0.48;
  }
}
/** Sonaja de calabaza: ráfaga corta de semillas. */
function sonaja(t0, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 0.12), N - s0);
  let a = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, r = rnd() * 2 - 1; a = r - a * 0.6; // ruido brillante
    const v = a * Math.exp(-t * 38) * vol;
    L[s0 + i] += v * 0.35; R[s0 + i] += v * 0.65;
  }
}
/** Flauta de madera: entra deslizándose desde abajo, aire, vibrato que aparece al final de la nota. */
function flauta(t0, dur, midi, vol, desliza = true) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0);
  let ph = 0, aire = 0, aire2 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, k = t / dur;
    const env = Math.min(1, t / 0.18) * Math.min(1, (dur - t) / 0.5) * (1 - 0.15 * k);
    const subida = desliza ? -0.6 * Math.exp(-t * 9) : 0; // semitonos
    const vib = 0.12 * Math.max(0, k - 0.45) * Math.sin(2 * Math.PI * 5.2 * t);
    ph += (2 * Math.PI * hz(midi + subida + vib)) / SR;
    aire = aire * 0.92 + (rnd() * 2 - 1) * 0.08; aire2 = aire2 * 0.6 + aire * 0.4;
    const v = (Math.sin(ph) + 0.22 * Math.sin(2 * ph) + 0.06 * Math.sin(3 * ph) + aire2 * (0.9 + 0.6 * Math.exp(-t * 6))) * env * vol;
    L[s0 + i] += v * 0.48; R[s0 + i] += v * 0.52;
  }
}

// Pulso: tambor parejo y lento (≈ 66 por minuto), acento suave cada 4; a veces se calla para respirar.
const pulso = 60 / 66;
for (let t = 1.5, n = 0; t < Number(seg) - 2; t += pulso, n++) {
  const bloque = Math.floor(n / 32);
  if (bloque % 4 === 3 && n % 32 > 16) continue; // pausa: solo flauta y viento
  tambor(t, n % 4 === 0 ? 0.3 : 0.2, n % 4 !== 2);
  if (n % 8 === 6) sonaja(t + pulso / 2, 0.05);
}
// Flauta: pentatónica menor (fa# la si do# mi), frases de 4–6 notas con caminata al azar y notas largas.
const escala = [66, 69, 71, 73, 76, 78, 81];
let nota = 2;
for (let t = 6; t < Number(seg) - 12; ) {
  const notas = 4 + Math.floor(rnd() * 3);
  let tt = t;
  for (let j = 0; j < notas; j++) {
    nota = Math.max(0, Math.min(escala.length - 1, nota + [-2, -1, -1, 0, 1, 1, 2][Math.floor(rnd() * 7)]));
    const larga = j === notas - 1 ? 3.2 + rnd() * 1.5 : 0.9 + rnd() * 1.4;
    flauta(tt, larga + 0.25, escala[nota] - 12, 0.05, j === 0 || rnd() < 0.4);
    tt += larga;
  }
  nota = Math.floor(rnd() * 3); // la frase siguiente arranca abajo
  t = tt + 4 + rnd() * 5;
}
// Viento de bosque: ruido filtrado que sube y baja despacio.
let a = 0, b = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR, rafaga = 0.5 + 0.5 * Math.sin(2 * Math.PI * t / 13 + Math.sin(t / 31) * 2);
  a = a * 0.993 + (rnd() * 2 - 1) * 0.007; b = b * 0.99 + (rnd() * 2 - 1) * 0.01;
  L[i] += a * 1.4 * rafaga; R[i] += b * 1.1 * rafaga;
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
