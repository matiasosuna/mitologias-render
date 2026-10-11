// Música de fondo generada por código: lira (Karplus-Strong) en modo dórico + bordón grave.
// Uso: node scripts/musica.mjs <segundos> <salida.wav>
import { writeFileSync } from 'node:fs';

const [seg = '260', out = 'public/musica/lira-griega.wav'] = process.argv.slice(2);
const SR = 44100, N = Math.ceil(Number(seg) * SR);
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

function pulsar(t0, midi, vol, pan) {
  const p = Math.round(SR / hz(midi)), buf = Float32Array.from({ length: p }, () => rnd() * 2 - 1);
  const start = Math.floor(t0 * SR), len = Math.min(SR * 3, N - start);
  for (let i = 0, k = 0; i < len; i++, k = (k + 1) % p) {
    const s = buf[k]; buf[k] = 0.4985 * (s + buf[(k + 1) % p]);
    L[start + i] += s * vol * (1 - pan); R[start + i] += s * vol * pan;
  }
}

// Progresión en Re dórico, arpegios lentos.
const acordes = [[50, 57, 62, 65, 69], [48, 55, 60, 64, 67], [46, 53, 58, 62, 65], [48, 55, 60, 64, 69]];
const patron = [0, 2, 4, 3, 1, 3, 4, 2];
const negra = 0.55;
for (let t = 0.5, n = 0; t < Number(seg) - 3; t += negra, n++) {
  const ac = acordes[Math.floor(n / 16) % acordes.length];
  pulsar(t, ac[patron[n % 8]] + (n % 32 > 23 ? 12 : 0), 0.16, 0.3 + rnd() * 0.4);
  if (n % 16 === 0) pulsar(t, ac[0] - 12, 0.22, 0.5);
}
// Bordón suave
for (let i = 0; i < N; i++) {
  const t = i / SR, d = 0.025 * (Math.sin(2 * Math.PI * hz(38) * t) + 0.5 * Math.sin(2 * Math.PI * hz(45) * t)) * (0.7 + 0.3 * Math.sin(t * 0.4));
  L[i] += d; R[i] += d;
}
// Fade in/out + WAV 16 bits
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
import('node:fs').then(({ mkdirSync }) => mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true }));
setTimeout(() => { writeFileSync(out, Buffer.concat([h, data])); console.log('ok', out); }, 10);
