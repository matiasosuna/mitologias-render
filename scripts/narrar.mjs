// Genera la narración (voz de macOS, gratis) y el timeline de un guion.
// Uso: node scripts/narrar.mjs src/griegas/01-origen
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { calcularTimeline } from '../lib/timeline.mjs';

const dir = process.argv[2];
if (!dir) throw new Error('Falta la carpeta del guion');
const FPS = 30;
const guion = JSON.parse(readFileSync(join(dir, 'guion.json'), 'utf8'));
const audioDir = join('public', 'audio', guion.id);
mkdirSync(audioDir, { recursive: true });

const escenas = guion.escenas.map((esc) => ({
  ...esc,
  frases: esc.frases.map((texto, j) => {
    const base = `${esc.id}-${j}`;
    const aiff = join(audioDir, `${base}.aiff`);
    const wav = join(audioDir, `${base}.wav`);
    execFileSync('say', ['-v', guion.voz, '-r', String(guion.velocidad), '-o', aiff, texto]);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', aiff, '-af', 'highpass=f=70,acompressor=threshold=-20dB:ratio=3,volume=1.6', '-ar', '48000', '-ac', '1', wav]);
    rmSync(aiff);
    const segundos = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]).toString().trim());
    process.stdout.write('.');
    return { texto, audio: `audio/${guion.id}/${base}.wav`, segundos };
  }),
}));

const tl = calcularTimeline(escenas, FPS);
writeFileSync(join(dir, 'timeline.json'), JSON.stringify(tl, null, 2));
console.log(`\n${guion.id}: ${(tl.total / FPS / 60).toFixed(1)} min`);
