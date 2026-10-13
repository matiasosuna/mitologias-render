// Música de fondo para la mitología hindú, generada por código (sin APIs ni grabaciones):
// bordón de tanpura (Pa–Sa–Sa–Sa grave, con el zumbido brillante de la "jawari"), tambor de mano de dos parches
// (uno agudo que canta y uno grave que se dobla, al estilo de una tabla) con un ciclo tranquilo, címbalos chicos
// (manjira) a veces y una flauta de bambú (bansuri) con frases inventadas al azar con semilla fija sobre una escala
// de siete notas: no imita ningún raga compuesto, canto ni pieza devocional. Sale con el mismo volumen medio que las
// otras músicas (≈ −33 dB). 480 s para que alcance a los episodios largos (el render la recorta, no la repite).
// Uso: node scripts/musica-hindu.mjs [seg] [salida]
import { writeFileSync, mkdirSync } from 'node:fs';

const [seg = '480', out = 'public/musica/hindu.wav'] = process.argv.slice(2);
const SR = 44100, N = Math.ceil(Number(seg) * SR), DB_OBJETIVO = -33.2;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 108; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const SA = 50; // re grave (Sa)

/** Cuerda de tanpura: muchos armónicos que se abren despacio (jawari) y un decaimiento largo. */
function tanpura(t0, midi, vol, pan) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 4.2), N - s0);
  const f0 = hz(midi), fases = new Float64Array(12);
  for (let i = 0; i < len; i++) {
    const t = i / SR, env = Math.min(1, t / 0.03) * Math.exp(-t * 0.55);
    let v = 0;
    for (let k = 1; k <= 12; k++) {
      fases[k - 1] += (2 * Math.PI * f0 * k * (1 + 0.0004 * k)) / SR;
      // los armónicos altos crecen y se apagan como una ola (el zumbido de la jawari)
      const abre = k < 3 ? 1 : 0.55 * Math.sin(Math.min(Math.PI, t * (1.1 + k * 0.08))) + 0.2;
      v += Math.sin(fases[k - 1]) * abre / k ** 0.9;
    }
    v *= env * vol;
    L[s0 + i] += v * (1 - pan); R[s0 + i] += v * pan;
  }
}
/** Parche agudo (dayan): tono que canta con un parcial alto y ataque seco. */
function dayan(t0, vol, abierto = true) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 0.7), N - s0);
  const f0 = hz(SA + 12);
  let p1 = 0, p2 = 0, p3 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, d = abierto ? 5 : 22;
    p1 += (2 * Math.PI * f0) / SR; p2 += (2 * Math.PI * f0 * 2) / SR; p3 += (2 * Math.PI * f0 * 2.99) / SR;
    const v = (Math.sin(p1) * Math.exp(-t * d) + Math.sin(p2) * 0.45 * Math.exp(-t * d * 1.4) + Math.sin(p3) * 0.25 * Math.exp(-t * d * 2) + (rnd() * 2 - 1) * 0.12 * Math.exp(-t * 160)) * vol;
    L[s0 + i] += v * 0.42; R[s0 + i] += v * 0.58;
  }
}
/** Parche grave (bayan): golpe hondo cuya altura sube un poco y vuelve (la palma lo dobla). */
function bayan(t0, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 1.1), N - s0);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, f = 72 + 18 * Math.sin(Math.min(Math.PI, t * 5)) * Math.exp(-t * 2) + 20 * Math.exp(-t * 30);
    ph += (2 * Math.PI * f) / SR;
    const v = (Math.sin(ph) * Math.exp(-t * 3.2) + (rnd() * 2 - 1) * 0.08 * Math.exp(-t * 90)) * vol;
    L[s0 + i] += v * 0.55; R[s0 + i] += v * 0.45;
  }
}
/** Manjira: dos platillos chicos que chocan, campanita larga. */
function manjira(t0, vol, pan = 0.5) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(SR * 1.6), N - s0);
  const fs = [2630, 3410, 4870, 6120];
  const ph = [0, 0, 0, 0];
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    let v = 0;
    fs.forEach((f, k) => { ph[k] += (2 * Math.PI * f) / SR; v += Math.sin(ph[k]) * Math.exp(-t * (2.2 + k)); });
    v = (v * 0.25 + (rnd() * 2 - 1) * 0.3 * Math.exp(-t * 60)) * vol;
    L[s0 + i] += v * (1 - pan); R[s0 + i] += v * pan;
  }
}
/** Bansuri: tono casi puro con aire, entrada suave, vibrato tardío y un deslizamiento (meend) desde la nota anterior. */
function bansuri(t0, dur, midi, desde, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0);
  let ph = 0, aire = 0, aire2 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, k = t / dur;
    const env = Math.min(1, t / 0.15) * Math.min(1, (dur - t) / 0.5) * (1 - 0.15 * k);
    const desliza = desde !== null ? (desde - midi) * Math.exp(-t * 9) : 0;
    const vib = 0.12 * Math.sin(2 * Math.PI * 5.2 * t) * Math.min(1, Math.max(0, t - 0.5) / 0.8);
    ph += (2 * Math.PI * hz(midi + desliza + vib)) / SR;
    aire = aire * 0.88 + (rnd() * 2 - 1) * 0.12; aire2 = aire2 * 0.5 + aire * 0.5;
    const v = (Math.sin(ph) + 0.18 * Math.sin(2 * ph) + 0.05 * Math.sin(3 * ph) + aire2 * (0.9 + 0.8 * Math.exp(-t * 6))) * env * vol;
    L[s0 + i] += v * 0.48; R[s0 + i] += v * 0.52;
  }
}

// Bordón: el ciclo Pa–Sa–Sa–Sa grave se repite todo el tiempo, con dos tanpuras levemente desfasadas.
const cicloT = 4.8;
for (let t = 0.3, n = 0; t < Number(seg) - 1; t += cicloT, n++) {
  [[SA - 5, 0], [SA + 12, 1.2], [SA + 12, 2.4], [SA, 3.6]].forEach(([m, d], j) => tanpura(t + d + (rnd() - 0.5) * 0.04, m, j === 3 ? 0.07 : 0.05, 0.3 + (n % 2) * 0.4));
}
// Tambor: ciclo de 8 pulsos (≈ 66 por minuto), tranquilo, que entra después de la introducción y descansa a veces.
const pulso = 60 / 66;
const CICLOS = [
  [['g', 'n'], [null, 'n'], ['g', null], [null, 't'], ['g', 'n'], [null, 'n'], [null, 't'], [null, 'n']],
  [['g', 'n'], [null, 't'], [null, 'n'], ['g', null], ['g', 'n'], [null, 't'], [null, 'n'], [null, 't']],
];
for (let t = 14, n = 0; t < Number(seg) - 4; t += pulso, n++) {
  const vuelta = Math.floor(n / 8);
  if (vuelta % 6 === 5) continue; // respiro: queda el bordón y la flauta
  const [grave, agudo] = CICLOS[Math.floor(vuelta / 3) % CICLOS.length][n % 8];
  if (grave) bayan(t, n % 8 === 0 ? 0.3 : 0.2);
  if (agudo) dayan(t, n % 8 === 0 ? 0.1 : 0.075, agudo === 'n');
  if (n % 4 === 2 && rnd() < 0.5) dayan(t + pulso / 2, 0.045, false);
  if (n % 16 === 0) manjira(t, 0.05, 0.3 + rnd() * 0.4);
}
// Flauta: escala de siete notas sobre Sa (Sa Re Ga Ma# Pa Dha Ni), registro medio, frases con caminata al azar.
const escala = [0, 2, 4, 6, 7, 9, 11, 12, 14, 16].map((x) => SA + 12 + x);
let nota = 4, previa = null;
for (let t = 9; t < Number(seg) - 12; ) {
  const notas = 3 + Math.floor(rnd() * 5);
  let tt = t;
  for (let j = 0; j < notas; j++) {
    nota = Math.max(0, Math.min(escala.length - 1, nota + [-2, -1, -1, 0, 1, 1, 2][Math.floor(rnd() * 7)]));
    const larga = j === notas - 1 ? 3 + rnd() * 1.8 : 0.6 + rnd() * 1.2;
    bansuri(tt, larga + 0.25, escala[nota], previa, 0.05);
    previa = escala[nota];
    tt += larga;
  }
  nota = 3 + Math.floor(rnd() * 3); previa = null;
  t = tt + 5 + rnd() * 7;
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
