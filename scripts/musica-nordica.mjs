// Música de fondo nórdica generada por código: bordón grave (quinta), tambor de marco lento
// y una lira de arco (tagelharpa) con melodía en Re menor pentatónico. Uso: node scripts/musica-nordica.mjs [seg] [salida]
import { writeFileSync, mkdirSync } from 'node:fs';

const [seg = '300', out = 'public/musica/nordica.wav'] = process.argv.slice(2);
const SR = 44100, N = Math.ceil(Number(seg) * SR);
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

// Bordón: Re1 + La1 con armónicos suaves que respiran.
for (let i = 0; i < N; i++) {
  const t = i / SR, resp = 0.6 + 0.4 * Math.sin(t * 0.25);
  let d = 0;
  for (const [m, a] of [[38, 1], [45, 0.6], [50, 0.25]]) for (let h = 1; h <= 4; h++) d += (a / h) * Math.sin(2 * Math.PI * hz(m) * h * t);
  L[i] += d * 0.018 * resp; R[i] += d * 0.018 * resp;
}

// Tambor de marco: golpe grave cada 2 s, eco suave a mitad.
function tambor(t0, vol) {
  const s0 = Math.floor(t0 * SR), len = Math.min(SR, N - s0);
  for (let i = 0; i < len; i++) {
    const t = i / SR, env = Math.exp(-t * 7), f = 55 + 40 * Math.exp(-t * 30);
    const v = (Math.sin(2 * Math.PI * f * t) + (rnd() * 2 - 1) * 0.15 * Math.exp(-t * 40)) * env * vol;
    L[s0 + i] += v; R[s0 + i] += v;
  }
}
for (let t = 1; t < Number(seg) - 2; t += 2) { tambor(t, 0.32); if (Math.floor(t) % 8 === 7) tambor(t + 1, 0.16); }

// Lira de arco: notas largas con ataque lento, vibrato y armónicos de sierra.
function arco(t0, dur, midi, vol, pan) {
  const s0 = Math.floor(t0 * SR), len = Math.min(Math.floor(dur * SR), N - s0);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, env = Math.min(1, t / 0.5) * Math.min(1, (dur - t) / 0.8);
    ph += (2 * Math.PI * hz(midi) * (1 + 0.004 * Math.sin(2 * Math.PI * 5 * t))) / SR;
    let v = 0;
    for (let h = 1; h <= 7; h++) v += Math.sin(ph * h) / (h * h * 0.8);
    v *= env * vol;
    L[s0 + i] += v * (1 - pan); R[s0 + i] += v * pan;
  }
}
const escala = [62, 65, 67, 69, 72, 74, 77]; // Re Fa Sol La Do Re Fa
const frases = [[0, 2, 3, 2], [3, 4, 3, 1], [0, 1, 2, 0], [3, 5, 4, 3]];
for (let t = 4, n = 0; t < Number(seg) - 8; t += 4, n++) {
  if (n % 8 >= 6) continue; // respiros
  const fr = frases[Math.floor(n / 2) % frases.length];
  const nota = escala[fr[n % 4]] - 12;
  arco(t, 3.6, nota, 0.05, 0.35 + rnd() * 0.3);
  if (n % 4 === 0) arco(t, 7.5, 50, 0.025, 0.5);
}

const fade = SR * 3, data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const g = Math.min(1, i / fade, (N - i) / fade);
  data.writeInt16LE(Math.max(-1, Math.min(1, L[i] * g)) * 32767 | 0, i * 4);
  data.writeInt16LE(Math.max(-1, Math.min(1, R[i] * g)) * 32767 | 0, i * 4 + 2);
}
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16);
h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28);
h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true });
writeFileSync(out, Buffer.concat([h, data]));
console.log('ok', out);
