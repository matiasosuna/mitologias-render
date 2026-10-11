// Renderiza los Shorts de un video: node scripts/motor-short.mjs griegas-01-origen [n]
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { readFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import os from 'node:os';

const [id, solo] = process.argv.slice(2);
const g = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
const tl = JSON.parse(readFileSync(join('src/videos', id, 'timeline.json'), 'utf8'));
const ns = (g.shorts ?? []).map((_, i) => i).filter((i) => solo === undefined || i + 1 === Number(solo));
if (!ns.length) throw new Error('El guion no tiene shorts');
mkdirSync(join('out', id), { recursive: true });
const serveUrl = await bundle({ entryPoint: resolve('src/motor/entrada.tsx') });
  process.on('exit', () => rmSync(serveUrl, { recursive: true, force: true })); // los bundles pesan ~600 MB
for (const n of ns) {
  const cid = `${id}-short-${n + 1}`, inputProps = { guion: g, timeline: tl, n, idioma: 'en' };
  const comp = await selectComposition({ serveUrl, id: cid, inputProps });
  const out = join('out', id, `short-${n + 1}.mp4`);
  await renderMedia({ serveUrl, composition: comp, codec: 'h264', outputLocation: out, crf: 20, timeoutInMilliseconds: 180000, concurrency: Math.max(2, os.cpus().length - 3), inputProps });
  console.log(`listo: ${out} (${(comp.durationInFrames / comp.fps).toFixed(0)} s)`);
}
