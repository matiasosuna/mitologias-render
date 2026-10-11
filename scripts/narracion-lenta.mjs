// Hace más lenta la narración en inglés que ya existe (sin volver a pagar ElevenLabs) y recalcula el timeline.
// Estira el audio con ffmpeg atempo (mantiene el tono). Cada archivo se procesa una sola vez (registro .tempo.json).
// Uso: node scripts/narracion-lenta.mjs <id> [<id>…]
import { readFileSync, writeFileSync, existsSync, readdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { timelineMulti, TEMPO_EN, T_SHORT } from '../lib/motor-tiempos.mjs';

const dur = (wav) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]).toString());

/** Estira los .wav en inglés de un video que todavía no estén al tempo actual. */
export function ralentizar(id, tempo = TEMPO_EN) {
  const dir = join('public/audio', id, 'en');
  if (!existsSync(dir)) return 0;
  const reg = join(dir, '.tempo.json');
  const hechos = existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : {};
  let n = 0;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.wav'))) {
    if (hechos[f] === tempo) continue;
    const wav = join(dir, f), tmp = wav.replace(/\.wav$/, '.tmp.wav');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-af', `atempo=${tempo}`, '-ar', '48000', '-ac', '1', tmp]);
    renameSync(tmp, wav);
    hechos[f] = tempo; n++;
  }
  writeFileSync(reg, JSON.stringify(hechos, null, 1));
  return n;
}

/** Recalcula timeline.json con las duraciones actuales de los audios. */
export function retimear(id) {
  const p = join('src/videos', id, 'timeline.json');
  const tl = JSON.parse(readFileSync(p, 'utf8'));
  const escenas = tl.escenas.map((e) => ({
    id: e.id,
    frases: e.frases.map((fr) => ({ texto: fr.texto, audio: fr.audio, segundos: Object.fromEntries(Object.entries(fr.audio).map(([l, rel]) => [l, dur(join('public', rel))])) })),
  }));
  const g = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
  const nuevo = timelineMulti(escenas, undefined, g.formato === 'short' ? T_SHORT : undefined);
  writeFileSync(p, JSON.stringify(nuevo));
  return { antes: tl.total / tl.fps / 60, ahora: nuevo.total / nuevo.fps / 60 };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const id of process.argv.slice(2)) {
    const n = ralentizar(id);
    const { antes, ahora } = retimear(id);
    console.log(`${id}: ${n} audios estirados · ${antes.toFixed(1)} → ${ahora.toFixed(1)} min`);
  }
}
