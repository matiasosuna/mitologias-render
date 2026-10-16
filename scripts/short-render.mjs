// Renderiza Shorts nativos (guion con "formato": "short"): node scripts/short-render.mjs <id> [<id>…] → out/<id>/<id>.mp4 (audio masterizado a −14 LUFS)
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { readFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import os from 'node:os';
import { masterizar } from '../lib/master.mjs';

const ids = process.argv.slice(2);
if (!ids.length) throw new Error('Falta el id del short');
const serveUrl = await bundle({ entryPoint: resolve('src/motor/entrada.tsx') });
process.on('exit', () => rmSync(serveUrl, { recursive: true, force: true }));
for (const id of ids) {
  const guion = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
  const timeline = JSON.parse(readFileSync(join('src/videos', id, 'timeline.json'), 'utf8'));
  if (guion.formato !== 'short') throw new Error(`${id} no es un short nativo`);
  const inputProps = { guion, timeline, idioma: 'en' };
  const comp = await selectComposition({ serveUrl, id, inputProps });
  mkdirSync(join('out', id), { recursive: true });
  const out = join('out', id, `${id}.mp4`);
  await renderMedia({ serveUrl, composition: comp, codec: 'h264', outputLocation: out, crf: 20, timeoutInMilliseconds: 180000, concurrency: Math.max(2, os.cpus().length - 3), inputProps });
  masterizar(out); // −14 LUFS / −1 dBTP (lib/master.mjs)
  console.log(`listo: ${out} (${(comp.durationInFrames / comp.fps).toFixed(0)} s)`);
}
