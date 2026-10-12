// Portada de cada Short nativo (mismo diseño que las portadas de episodios): gancho como título, los dos primeros
// personajes del guion y la mitología. → out/<id>/portada-short.jpg (1080×1920, para TikTok/Reels).
// Uso: node scripts/portadas-short.mjs <id> [<id>…]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { readFileSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';

const ids = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: resolve('src/canal/Canal.tsx') });
process.on('exit', () => rmSync(serveUrl, { recursive: true, force: true }));
for (const id of ids) {
  const g = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
  const actores = [];
  for (const e of g.escenas) for (const a of e.actores ?? []) if (!actores.some((x) => x.id === a.id)) actores.push(a);
  const [h, r] = actores.slice(0, 2);
  const props = { titulo: g.gancho.en.toUpperCase(), numero: '', temporada: '', insignia: 'MYTH IN 60 SECONDS', heroe: h ? { __como: h.como, ...(h.props ?? {}) } : 'hombre', rival: r ? { __como: r.como, ...(r.props ?? {}) } : undefined, serie: g.serie };
  const comp = await selectComposition({ serveUrl, id: 'portada-ig', inputProps: props });
  const tmp = join('out', id, 'portada-short-4x5.jpg');
  await renderStill({ serveUrl, composition: comp, output: tmp, inputProps: props, imageFormat: 'jpeg', jpegQuality: 92 });
  // 4:5 → 9:16 con fondo desenfocado de la misma portada (como las tapas de los Reels)
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-filter_complex', '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:4,eq=brightness=-0.25[bg];[bg][0:v]overlay=0:285', '-frames:v', '1', join('out', id, 'portada-short.jpg')]);
  rmSync(tmp, { force: true });
  console.log('ok', id, existsSync(join('out', id, 'portada-short.jpg')));
}
