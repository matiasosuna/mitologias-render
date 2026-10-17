// Arma el audio rápido (public/audio/<id>/en-rapido/, 1,1× y sin silencio en las puntas) desde la voz del episodio y
// devuelve el timeline rápido de la versión vertical (lib/vertical-rapido.mjs). Lo usan vertical-partes.mjs y
// vertical-render.mjs ANTES de empaquetar Remotion (el bundle copia public/). Deja una copia en out/<id>/timeline-rapido.json.
// Uso suelto (solo audio + timeline, sin video): node scripts/vertical-rapido.mjs <id> [<id>…]
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, renameSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, basename } from 'node:path';
import { timelineRapido, rutaRapida, filtroRapido } from '../lib/vertical-rapido.mjs';

const dur = (wav) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]).toString());

export function prepararRapido(id) {
  const tl = JSON.parse(readFileSync(join('src/videos', id, 'timeline.json'), 'utf8'));
  const reg = join('public/audio', id, 'en', '.tempo.json');
  const hechos = existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : {};
  const segundos = {};
  for (const rel of new Set(tl.escenas.flatMap((e) => e.frases.map((fr) => fr.audio?.en)).filter(Boolean))) {
    const src = join('public', rel), dst = join('public', rutaRapida(rel));
    if (!existsSync(src)) continue; // sin audio: se estima desde la frase lenta
    if (!existsSync(dst) || statSync(dst).mtimeMs < statSync(src).mtimeMs) {
      mkdirSync(dirname(dst), { recursive: true });
      const af = filtroRapido(hechos[basename(rel)]), tmp = dst.replace(/\.wav$/, '.tmp.wav');
      if (af) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-af', af, '-ar', '48000', '-ac', '1', tmp]);
      else copyFileSync(src, tmp);
      renameSync(tmp, dst);
    }
    segundos[rutaRapida(rel)] = dur(dst);
  }
  const rapido = timelineRapido(tl, (r) => segundos[r]);
  mkdirSync(join('out', id), { recursive: true });
  writeFileSync(join('out', id, 'timeline-rapido.json'), JSON.stringify(rapido));
  return rapido;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ids = process.argv.slice(2);
  if (!ids.length) throw new Error('Falta el id');
  for (const id of ids) {
    const lento = JSON.parse(readFileSync(join('src/videos', id, 'timeline.json'), 'utf8')), r = prepararRapido(id);
    console.log(`${id}: ${(lento.total / lento.fps).toFixed(1)} s → ${(r.total / r.fps).toFixed(1)} s (con pantalla final de YouTube)`);
  }
}
