// Versión vertical (Reels) de episodios: node scripts/vertical-render.mjs <id> [<id>…] → out/<id>/<id>.vertical.mp4
// Reusa voz, timeline y escenas del horizontal (no gasta créditos). La portada es out/<id>/portada-ig.jpg.
// PARTES=n → parte el video en n tramos con un Chrome propio cada uno, en paralelo (Chrome sólo usa ~2 núcleos
// por navegador), y después los une con el audio. Sirve en máquinas con muchos núcleos (Modal).
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import os from 'node:os';

const ids = process.argv.slice(2);
if (!ids.length) throw new Error('Falta el id');
mkdirSync('public/portadas', { recursive: true });
for (const id of ids) {
  if (!existsSync(join('out', id, 'portada-ig.jpg'))) execFileSync('node', ['scripts/portadas-ig.mjs', id], { stdio: 'ignore' });
  copyFileSync(join('out', id, 'portada-ig.jpg'), join('public/portadas', `${id}.jpg`));
}
const serveUrl = await bundle({ entryPoint: resolve('src/motor/entrada.tsx') });
process.on('exit', () => rmSync(serveUrl, { recursive: true, force: true }));
for (const id of ids) {
  const guion = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
  const timeline = JSON.parse(readFileSync(join('src/videos', id, 'timeline.json'), 'utf8'));
  const inputProps = { guion, timeline, portada: `portadas/${id}.jpg` };
  const comp = await selectComposition({ serveUrl, id: `${id}-vertical`, inputProps });
  const out = join('out', id, `${id}.vertical.mp4`);
  const PARTES = Number(process.env.PARTES) || 1, nucleos = Number(process.env.RENDER_CONCURRENCY) || Math.max(2, os.cpus().length - 3);
  if (PARTES <= 1) {
    await renderMedia({ serveUrl, composition: comp, codec: 'h264', outputLocation: out, crf: 21, timeoutInMilliseconds: 180000, concurrency: nucleos, inputProps });
  } else {
    const dir = join('out', id, '.partes'); rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
    const n = comp.durationInFrames, paso = Math.ceil(n / PARTES), tramos = [];
    for (let a = 0; a < n; a += paso) tramos.push([a, Math.min(n - 1, a + paso - 1)]);
    const cada = Math.max(1, Math.floor(nucleos / tramos.length));
    await Promise.all([
      ...tramos.map(([a, b], i) => renderMedia({ serveUrl, composition: comp, codec: 'h264', outputLocation: join(dir, `p${i}.mp4`), frameRange: [a, b], muted: true, crf: 21, timeoutInMilliseconds: 180000, concurrency: cada, inputProps })),
      renderMedia({ serveUrl, composition: comp, codec: 'aac', outputLocation: join(dir, 'audio.aac'), timeoutInMilliseconds: 180000, concurrency: 1, inputProps }),
    ]);
    writeFileSync(join(dir, 'lista.txt'), tramos.map((_, i) => `file 'p${i}.mp4'`).join('\n'));
    execFileSync('npx', ['remotion', 'ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(dir, 'lista.txt'), '-i', join(dir, 'audio.aac'), '-map', '0:v', '-map', '1:a', '-c', 'copy', '-movflags', '+faststart', out], { stdio: 'inherit' });
    rmSync(dir, { recursive: true, force: true });
  }
  console.log(`listo: ${out} (${(comp.durationInFrames / comp.fps / 60).toFixed(1)} min)`);
}
