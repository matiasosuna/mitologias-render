// Lleva la narración en inglés que ya existe al tempo de su formato (sin volver a pagar la voz) y recalcula el timeline:
// episodios a 0,9× (más lenta y clara); Shorts a 1,1× y sin silencio en las puntas (lib/short.mjs).
// Estira el audio con ffmpeg atempo (mantiene el tono). .tempo.json guarda qué tiene cada archivo: si el objetivo cambia,
// se aplica solo la diferencia (p. ej. 0,9 → 1,1 = atempo 1,222), nunca dos veces lo mismo.
// Uso: node scripts/narracion-lenta.mjs <id> [<id>…]
import { readFileSync, writeFileSync, existsSync, readdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { timelineMulti } from '../lib/motor-tiempos.mjs';
import { marcoTimeline } from '../lib/marco.mjs';
import { tiemposShort } from '../lib/quien.mjs';
import { procesoAudio, pendienteAudio, filtroAudio, registroAudio } from '../lib/short.mjs';

const dur = (wav) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]).toString());

const guionDe = (id) => { const p = join('src/videos', id, 'guion.json'); return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {}; };

/** Lleva los .wav en inglés de un video a su objetivo ({ tempo, recortar }; por defecto, el de su formato). */
export function ralentizar(id, objetivo = procesoAudio(guionDe(id))) {
  if (typeof objetivo === 'number') objetivo = { tempo: objetivo, recortar: false };
  const dir = join('public/audio', id, 'en');
  if (!existsSync(dir)) return 0;
  const reg = join(dir, '.tempo.json');
  const hechos = existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : {};
  let n = 0;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.wav') && !x.endsWith('.tmp.wav'))) {
    const falta = pendienteAudio(hechos[f], objetivo);
    if (!falta) continue;
    const wav = join(dir, f), tmp = wav.replace(/\.wav$/, '.tmp.wav');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-af', filtroAudio(falta), '-ar', '48000', '-ac', '1', tmp]);
    renameSync(tmp, wav);
    hechos[f] = registroAudio(objetivo, hechos[f]); n++;
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
  const g = guionDe(id);
  const nuevo = timelineMulti(escenas, undefined, g.formato === 'short' ? tiemposShort(g) : undefined);
  // marco de Learn Bible (lib/marco.mjs): las piezas también se re-miden
  if (tl.marco) nuevo.marco = marcoTimeline(Object.entries(tl.marco).map(([id, p]) => ({ id, frases: [{ texto: p.texto, audio: p.audio, segundos: Object.fromEntries(Object.entries(p.audio).map(([l, rel]) => [l, dur(join('public', rel))])) }] })), nuevo.fps);
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
