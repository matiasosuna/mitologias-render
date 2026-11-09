// Música de fondo para Gnosis (serie `gnosticas`), generada por código (sin APIs ni grabaciones): solemne y misteriosa.
// Un bordón grave (re y la) que respira despacio; un coro sin palabras sintetizado (tablas de onda con formantes de
// vocal "a"/"o"/"u" que se funden, tres voces apenas desafinadas por nota, vibrato lento) que sostiene acordes del modo
// de re eólico elegidos con semilla fija (no imita ninguna pieza); cuencos que suenan cada tanto (parciales inarmónicos
// que laten y se apagan largos), campanitas agudas sueltas y un golpe grave muy suave al empezar cada sección. Cada
// tanto el coro calla y quedan el bordón y los cuencos. Todo pasa por una reverberación larga (combs + allpass).
// Sale con el mismo volumen medio que las otras músicas (≈ −33 dB).
// Uso: node scripts/musica-gnosis.mjs [seg] [salida]   (se corre en la nube; sale public/musica/gnosis.wav)
import { writeFileSync, mkdirSync } from 'node:fs';

const [seg = '320', out = 'public/musica/gnosis.wav'] = process.argv.slice(2);
const SR = 44100, N = Math.ceil(Number(seg) * SR), DB_OBJETIVO = -33.2;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 7741; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const midi = (m) => 440 * 2 ** ((m - 69) / 12);

// ---------- tablas de onda ----------
const TAM = 4096;
/** Un ciclo con armónicos pesados por una respuesta (formantes de vocal o caída suave). */
function tabla(peso, nArm = 40) {
  const t = new Float32Array(TAM + 1);
  for (let h = 1; h <= nArm; h++) { const a = peso(h); if (a < 1e-4) continue; const fase = rnd() * Math.PI * 2; for (let i = 0; i <= TAM; i++) t[i] += a * Math.sin((2 * Math.PI * h * i) / TAM + fase); }
  let m = 0; for (let i = 0; i <= TAM; i++) m = Math.max(m, Math.abs(t[i])); for (let i = 0; i <= TAM; i++) t[i] /= m;
  return t;
}
const VOCALES = { a: [[800, 1, 90], [1150, 0.5, 110], [2900, 0.12, 160]], o: [[450, 1, 80], [800, 0.45, 90], [2830, 0.06, 150]], u: [[325, 1, 70], [700, 0.2, 80], [2530, 0.03, 140]] };
/** Respuesta de formantes de una vocal para una fundamental f0 (más un poco de pecho en los primeros armónicos). */
const formante = (v, f0) => (h) => { const fr = h * f0; if (fr > 5000) return 0; let a = 0.25 / h; for (const [fc, g, bw] of VOCALES[v]) a += g * Math.exp(-(((fr - fc) / bw) ** 2) / 2); return a; };
const cache = new Map();
const tablaVoz = (v, m) => { const k = v + m; if (!cache.has(k)) cache.set(k, tabla(formante(v, midi(m)))); return cache.get(k); };
const TABLA_BORDON = tabla((h) => (h > 24 ? 0 : 1 / h ** 1.6), 24);
const leer = (t, ph) => { const x = ph * TAM, i = x | 0, fr = x - i; return t[i] + (t[i + 1] - t[i]) * fr; };

// ---------- instrumentos ----------
/** Bordón: re2 y la2 que suben y bajan despacio, con un leve batido. */
function bordon(t0, t1, vol) {
  const s0 = Math.floor(t0 * SR), s1 = Math.min(N, Math.floor(t1 * SR));
  const notas = [[38, 1, 0.35], [38.06, 0.6, 0.65], [45, 0.55, 0.5], [50, 0.18, 0.55]];
  const ph = notas.map(() => rnd());
  for (let i = s0; i < s1; i++) {
    const t = i / SR, resp = 0.72 + 0.28 * Math.sin(2 * Math.PI * 0.021 * t) * Math.sin(2 * Math.PI * 0.013 * t + 1);
    for (let k = 0; k < notas.length; k++) {
      const [m, a, pan] = notas[k];
      ph[k] = (ph[k] + midi(m) / SR) % 1;
      const v = leer(TABLA_BORDON, ph[k]) * a * vol * resp;
      L[i] += v * (1 - pan); R[i] += v * pan;
    }
  }
}
/** Una nota del coro: tres voces apenas desafinadas, vocal que se funde de una a otra, ataque y caída lentos. */
function coro(t0, dur, m, vol, pan, v1, v2) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0);
  if (s0 < 0 || len <= 0) return;
  const A = tablaVoz(v1, m), B = tablaVoz(v2, m), f = midi(m);
  const voces = [-0.08, 0.0, 0.07].map((c, j) => ({ f: f * 2 ** (c / 12), ph: rnd(), vib: 4.6 + j * 0.4 + rnd() * 0.3, vf: rnd() * 6, p: Math.min(1, Math.max(0, pan + (j - 1) * 0.18)) }));
  const ata = Math.min(3.5, dur * 0.3), cae = Math.min(4, dur * 0.4);
  for (let i = 0; i < len; i++) {
    const t = i / SR, env = Math.min(1, t / ata) * Math.min(1, (dur - t) / cae), mez = 0.5 - 0.5 * Math.cos((Math.PI * t) / dur);
    const tremolo = 1 + 0.06 * Math.sin(2 * Math.PI * 0.3 * t);
    for (const o of voces) {
      o.ph = (o.ph + (o.f * (1 + 0.0035 * Math.sin(2 * Math.PI * o.vib * t + o.vf) * Math.min(1, t / 2))) / SR) % 1;
      const x = (leer(A, o.ph) * (1 - mez) + leer(B, o.ph) * mez) * env * vol * tremolo;
      L[s0 + i] += x * (1 - o.p); R[s0 + i] += x * o.p;
    }
  }
}
/** Cuenco: parciales inarmónicos, cada uno en pareja desafinada (laten), caída larga. */
function cuenco(t0, f, vol, pan) {
  const dur = 12, s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0);
  if (s0 < 0 || len <= 0) return;
  const parc = [[1, 1, 0.35, 1.2], [2.71, 0.45, 0.6, 2.1], [5.12, 0.18, 1.1, 3.4], [8.2, 0.06, 1.6, 5]];
  const ph = parc.flatMap(() => [0, 0]);
  for (let i = 0; i < len; i++) {
    const t = i / SR; let v = 0;
    for (let k = 0; k < parc.length; k++) {
      const [r, a, d, bat] = parc[k];
      ph[2 * k] += (2 * Math.PI * (f * r - bat / 2)) / SR; ph[2 * k + 1] += (2 * Math.PI * (f * r + bat / 2)) / SR;
      v += (Math.sin(ph[2 * k]) + Math.sin(ph[2 * k + 1])) * 0.5 * a * Math.exp(-t * d);
    }
    v *= Math.min(1, t / 0.02) * Math.min(1, (dur - t) * 2) * vol;
    L[s0 + i] += v * (1 - pan); R[s0 + i] += v * pan;
  }
}
/** Campanita aguda: golpe brillante, parciales de campana y caída mediana. */
function campana(t0, f, vol, pan) {
  const dur = 5, s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0);
  if (s0 < 0 || len <= 0) return;
  const parc = [[1, 1, 1.1], [2.0, 0.4, 1.8], [2.76, 0.32, 2.6], [5.4, 0.12, 5], [8.93, 0.05, 8]];
  const ph = parc.map(() => 0);
  for (let i = 0; i < len; i++) {
    const t = i / SR; let v = 0;
    for (let k = 0; k < parc.length; k++) { ph[k] += (2 * Math.PI * f * parc[k][0]) / SR; v += Math.sin(ph[k]) * parc[k][1] * Math.exp(-t * parc[k][2]); }
    v *= Math.min(1, t / 0.002) * Math.min(1, (dur - t) * 3) * vol;
    L[s0 + i] += v * (1 - pan); R[s0 + i] += v * pan;
  }
}
/** Golpe grave muy suave (como un tambor de marco lejano) al abrir cada sección. */
function golpe(t0, vol) {
  const dur = 3.5, s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0);
  if (s0 < 0 || len <= 0) return;
  let p = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR; p += (2 * Math.PI * (52 + 30 * Math.exp(-t * 9))) / SR;
    const v = (Math.sin(p) * Math.exp(-t * 1.4) + (rnd() * 2 - 1) * 0.04 * Math.exp(-t * 40)) * Math.min(1, t / 0.01) * vol;
    L[s0 + i] += v * 0.5; R[s0 + i] += v * 0.5;
  }
}

// ---------- forma ----------
// Re eólico: acordes (notas MIDI) que el coro sostiene; se eligen con caminata al azar de semilla fija.
const ACORDES = [[50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 64], [53, 57, 60, 65], [43, 50, 55, 58], [45, 52, 57, 60], [50, 57, 60, 65]];
const PENTA = [74, 77, 79, 81, 84, 86, 89];
const total = Number(seg) - 4, SECCION = 16;
bordon(0, Number(seg), 0.11);
let ac = 0;
for (let t = 0, n = 0; t < total; t += SECCION, n++) {
  if (n > 0) golpe(t, 0.12);
  const calla = n === 0 || n % 5 === 4; // al principio y cada tanto, solo bordón y cuencos
  if (!calla) {
    ac = (ac + [1, 2, -1, 3, -2, 1][Math.floor(rnd() * 6)] + ACORDES.length) % ACORDES.length;
    const vs = ['a', 'o', 'u'], v1 = vs[Math.floor(rnd() * 3)], v2 = vs[Math.floor(rnd() * 3)];
    ACORDES[ac].forEach((m, j) => coro(t + j * 0.6, SECCION + 3.5 - j * 0.6, m, j === 0 ? 0.05 : 0.035, 0.2 + j * 0.2, v1, v2));
    // a veces una voz sola arriba, larga, que sube y baja un paso
    if (rnd() < 0.5) { const m = ACORDES[ac][3] + 12, d = SECCION / 2; coro(t + 3, d + 2, m, 0.022, 0.6, 'u', 'o'); coro(t + 3 + d, d, m + (rnd() < 0.5 ? -2 : 2), 0.02, 0.62, 'o', 'u'); }
  }
  // cuencos: uno o dos por sección
  cuenco(t + 1 + rnd() * 4, midi([62, 69, 74][Math.floor(rnd() * 3)]), 0.07, 0.25 + rnd() * 0.5);
  if (rnd() < 0.6) cuenco(t + 8 + rnd() * 5, midi([57, 62, 69][Math.floor(rnd() * 3)]), 0.05, 0.25 + rnd() * 0.5);
  // campanitas sueltas (2 o 3 notas) en la mitad de las secciones
  if (rnd() < 0.5) { let k = Math.floor(rnd() * PENTA.length); const t1 = t + 4 + rnd() * 8; for (let j = 0; j < 2 + Math.floor(rnd() * 2); j++) { campana(t1 + j * (1.1 + rnd() * 0.6), midi(PENTA[k]), 0.025, 0.3 + rnd() * 0.4); k = Math.max(0, Math.min(PENTA.length - 1, k + [-1, 1, -2, 2][Math.floor(rnd() * 4)])); } }
}

// ---------- reverberación (Schroeder: 4 combs en paralelo + 2 allpass, una por canal) ----------
function reverb(x, retardos, mezcla = 0.32) {
  const combs = retardos.map((d) => ({ b: new Float32Array(d), i: 0, g: 0.84, lp: 0 }));
  const aps = [556, 441].map((d) => ({ b: new Float32Array(d), i: 0 }));
  const y = new Float32Array(x.length);
  for (let n = 0; n < x.length; n++) {
    let s = 0;
    for (const c of combs) { const o = c.b[c.i]; c.lp = o * 0.7 + c.lp * 0.3; c.b[c.i] = x[n] + c.lp * c.g; c.i = (c.i + 1) % c.b.length; s += o; }
    s *= 0.25;
    for (const a of aps) { const o = a.b[a.i], v = s + o * 0.5; a.b[a.i] = v; a.i = (a.i + 1) % a.b.length; s = o - v * 0.5; }
    y[n] = x[n] * (1 - mezcla) + s * mezcla * 1.6;
  }
  return y;
}
const LL = reverb(L, [1557, 1617, 1491, 1422]), RR = reverb(R, [1580, 1640, 1514, 1445]);

// Fundido y volumen medio igual al de las otras músicas.
const fade = SR * 3;
let suma = 0;
for (let i = 0; i < N; i++) { const g = Math.min(1, i / fade, (N - i) / fade); LL[i] *= g; RR[i] *= g; suma += LL[i] * LL[i] + RR[i] * RR[i]; }
const rms = Math.sqrt(suma / (2 * N)), k = 10 ** (DB_OBJETIVO / 20) / rms;
const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) { data.writeInt16LE(Math.max(-1, Math.min(1, LL[i] * k)) * 32767 | 0, i * 4); data.writeInt16LE(Math.max(-1, Math.min(1, RR[i] * k)) * 32767 | 0, i * 4 + 2); }
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16);
h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28);
h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true });
writeFileSync(out, Buffer.concat([h, data]));
console.log('ok', out, `(${(20 * Math.log10(rms * k)).toFixed(1)} dB medio)`);
