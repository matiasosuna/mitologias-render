// Música de fondo para la mitología maorí, generada por código (sin APIs ni grabaciones), con colores de taonga
// pūoro: flauta de aire con deslizamientos (al estilo del kōauau / pūtōrino), zumbido que sube y baja como un
// pūrerehua, golpes de madera hueca grave (pahū), golpecitos suaves y regulares (como poi o palos), olas que
// rompen despacio y algún pájaro a lo lejos. Las frases se inventan al azar con semilla fija: no imita ningún
// waiata, haka ni pieza ceremonial. Sale con el mismo volumen medio que las otras músicas (≈ −33 dB).
// Uso: node scripts/musica-maori.mjs [seg] [salida]
import { writeFileSync, mkdirSync } from 'node:fs';

const [seg = '320', out = 'public/musica/maori.wav'] = process.argv.slice(2);
const SR = 44100, N = Math.ceil(Number(seg) * SR), DB_OBJETIVO = -33.2;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 1840; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

/** Pahū: madera hueca grave, golpe redondo con un parcial inarmónico. */
function pahu(t0, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 1.6), N - s0);
  let p1 = 0, p2 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    p1 += (2 * Math.PI * 98) / SR; p2 += (2 * Math.PI * 98 * 2.31) / SR;
    const v = (Math.sin(p1) * Math.exp(-t * 3.2) + Math.sin(p2) * 0.3 * Math.exp(-t * 9) + (rnd() * 2 - 1) * 0.06 * Math.exp(-t * 90)) * vol;
    L[s0 + i] += v * 0.52; R[s0 + i] += v * 0.48;
  }
}
/** Golpecito suave y apagado (poi / palos): ruido filtrado con un tono corto. */
function toque(t0, vol, pan = 0.5, agudo = false) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 0.12), N - s0);
  let a = 0, ph = 0;
  const f0 = agudo ? 1450 : 520;
  for (let i = 0; i < len; i++) {
    const t = i / SR; a = a * 0.6 + (rnd() * 2 - 1) * 0.4; ph += (2 * Math.PI * f0) / SR;
    const v = (a * 0.7 + Math.sin(ph) * 0.5) * Math.exp(-t * (agudo ? 60 : 38)) * vol;
    L[s0 + i] += v * (1 - pan); R[s0 + i] += v * pan;
  }
}
/** Zumbido que gira (pūrerehua): tono grave con batido rápido y altura que sube y baja. */
function zumbido(t0, dur, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, k = t / dur;
    const env = Math.sin(Math.PI * k) ** 2;
    const f = 92 + 36 * Math.sin(Math.PI * k * 2 + 0.6) + 6 * Math.sin(t * 1.3);
    ph += (2 * Math.PI * f) / SR;
    const giro = 0.55 + 0.45 * Math.sin(2 * Math.PI * (7 + 3 * k) * t);
    const v = (Math.sin(ph) + 0.35 * Math.sin(2 * ph) + 0.18 * Math.sin(3 * ph)) * giro * env * vol;
    L[s0 + i] += v * (0.5 + 0.3 * Math.sin(t * 0.7)); R[s0 + i] += v * (0.5 - 0.3 * Math.sin(t * 0.7));
  }
}
/** Flauta de aire: tono casi puro con mucho soplo, entrada suave y deslizamiento desde la nota anterior. */
function flauta(t0, dur, desde, hasta, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0);
  let ph = 0, aire = 0, aire2 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, k = t / dur;
    const env = Math.min(1, t / 0.18) * Math.min(1, (dur - t) / 0.5) * (1 - 0.25 * k);
    const desl = Math.min(1, t / 0.35);
    const m = desde + (hasta - desde) * (desl * desl * (3 - 2 * desl)) + 0.1 * Math.sin(2 * Math.PI * 5 * t) * Math.min(1, t / 0.8);
    ph += (2 * Math.PI * hz(m)) / SR;
    aire = aire * 0.88 + (rnd() * 2 - 1) * 0.12; aire2 = aire2 * 0.5 + aire * 0.5;
    const v = (Math.sin(ph) + 0.06 * Math.sin(2 * ph) + aire2 * (1.8 + 1.0 * Math.exp(-t * 6))) * env * vol;
    L[s0 + i] += v * 0.45; R[s0 + i] += v * 0.55;
  }
}
/** Pájaro lejano: dos o tres silbidos cortos que suben o bajan. */
function pajaro(t0, vol) {
  const notas = 2 + Math.floor(rnd() * 3), base = 2200 + rnd() * 1400, pan = 0.2 + rnd() * 0.6;
  for (let n = 0; n < notas; n++) {
    const s0 = Math.floor((t0 + n * 0.16) * SR), len = Math.min(Math.floor(SR * 0.11), N - s0), sube = rnd() < 0.5;
    let ph = 0;
    for (let i = 0; i < len; i++) {
      const t = i / SR, k = t / 0.11, f = base * (sube ? 1 + 0.35 * k : 1.3 - 0.35 * k);
      ph += (2 * Math.PI * f) / SR;
      const v = Math.sin(ph) * Math.sin(Math.PI * k) * vol;
      L[s0 + i] += v * (1 - pan); R[s0 + i] += v * pan;
    }
  }
}

// Pulso lento (≈ 62 por minuto): pahū cada 4 pulsos; golpecitos en un patrón de 3 contra 4 que cambia; respiros.
const pulso = 60 / 62;
const PATRONES = [[1, 0, 1, 0, 1, 1, 0, 0], [1, 0, 0, 1, 0, 0, 1, 0], [1, 1, 0, 1, 0, 1, 0, 0]];
for (let t = 2, n = 0; t < Number(seg) - 2; t += pulso, n++) {
  const bloque = Math.floor(n / 32);
  if (bloque % 3 === 2 && n % 32 > 20) continue; // respiro
  if (n % 4 === 0) pahu(t, n % 16 === 0 ? 0.3 : 0.18);
  const pat = PATRONES[Math.floor(n / 16) % PATRONES.length];
  [0, 0.5].forEach((d, j) => { if (pat[(n * 2 + j) % 8]) toque(t + d * pulso, 0.07, 0.35 + ((n + j) % 3) * 0.15, (n + j) % 5 === 0); });
}
// Zumbidos largos de vez en cuando.
for (let t = 14; t < Number(seg) - 20; t += 38 + rnd() * 20) zumbido(t, 9 + rnd() * 5, 0.05);
// Flauta: notas largas que se deslizan, en una escala de pocos tonos cercanos (registro medio).
const escala = [62, 63, 65, 67, 69, 70, 72];
let nota = 2;
for (let t = 6; t < Number(seg) - 12; ) {
  const notas = 2 + Math.floor(rnd() * 4);
  let tt = t;
  for (let j = 0; j < notas; j++) {
    const antes = escala[nota];
    nota = Math.max(0, Math.min(escala.length - 1, nota + [-2, -1, -1, 0, 1, 1, 2][Math.floor(rnd() * 7)]));
    const larga = j === notas - 1 ? 3.2 + rnd() * 1.8 : 0.9 + rnd() * 1.3;
    flauta(tt, larga + 0.25, j === 0 ? escala[nota] - 0.5 : antes, escala[nota], 0.04);
    tt += larga;
  }
  nota = 1 + Math.floor(rnd() * 3);
  t = tt + 6 + rnd() * 7;
}
// Pájaros lejanos.
for (let t = 9; t < Number(seg) - 4; t += 11 + rnd() * 16) pajaro(t, 0.012);
// Olas: ruido grave que crece y rompe cada ~9 s.
let a = 0, b = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR, ciclo = (t % 9.3) / 9.3, ola = Math.max(0, Math.sin(Math.PI * Math.min(1, ciclo * 1.4))) ** 2;
  a = a * 0.993 + (rnd() * 2 - 1) * 0.007; b = b * 0.99 + (rnd() * 2 - 1) * 0.01;
  L[i] += a * (0.5 + 1.3 * ola); R[i] += b * (0.45 + 1.2 * ola);
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
