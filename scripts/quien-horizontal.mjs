// Versión horizontal 16:9 de un Short "Who is…?" (composición `<id>-horizontal`, src/motor/ShortHorizontal.tsx):
// video normal de YouTube en la lista "<Mitología>: Who's Who", publicado el mismo día que su Short (scripts/nube.mjs).
// Deja los archivos donde los dejaría un episodio (así nube.mjs › asegurarEpisodio y render-nube tipo=horizontal sirven
// tal cual): out/<id>/<id>.en.mp4 (voz + música), <id>.en.srt y <id>.es.srt. La miniatura: scripts/miniaturas.mjs <id>.
// Uso: node scripts/quien-horizontal.mjs <id> [<id>…]   (motor-render.mjs <id> también llega acá si el guion es un Short)
import { readFileSync, writeFileSync, mkdirSync, rmSync, renameSync } from 'node:fs';
import { join, resolve } from 'node:path';
import os from 'node:os';
import { srt } from '../lib/motor-tiempos.mjs';
import { timelineHorizontal } from '../lib/quien.mjs';

const leer = (id, f) => JSON.parse(readFileSync(join('src/videos', id, f), 'utf8'));
/** ¿Este id tiene versión horizontal? (Short nativo con `quien`) */
export const tieneHorizontal = (g) => g?.formato === 'short' && Boolean(g.quien);
/** Archivos que deja el render (los mismos nombres que un episodio). */
export const salidas = (id) => ({ mp4: join('out', id, `${id}.en.mp4`), srt: { en: join('out', id, `${id}.en.srt`), es: join('out', id, `${id}.es.srt`) } });

export async function renderHorizontal(ids, { serveUrl } = {}) {
  const { bundle } = await import('@remotion/bundler');
  const { renderMedia, selectComposition } = await import('@remotion/renderer');
  const propio = !serveUrl;
  serveUrl ??= await bundle({ entryPoint: resolve('src/motor/entrada.tsx') });
  try {
    for (const id of ids) {
      const guion = leer(id, 'guion.json'), timeline = leer(id, 'timeline.json');
      if (!tieneHorizontal(guion)) throw new Error(`${id}: solo los Shorts "Who is…?" (formato short + quien) tienen versión horizontal`);
      const inputProps = { guion, timeline, idioma: 'en' };
      const comp = await selectComposition({ serveUrl, id: `${id}-horizontal`, inputProps });
      const s = salidas(id);
      mkdirSync(join('out', id), { recursive: true });
      const tmp = `${s.mp4}.tmp.mp4`;
      await renderMedia({ serveUrl, composition: comp, codec: 'h264', crf: 20, outputLocation: tmp, inputProps, timeoutInMilliseconds: 180000, concurrency: Number(process.env.RENDER_CONCURRENCY) || Math.max(2, os.cpus().length - 2) });
      renameSync(tmp, s.mp4);
      const tl = timelineHorizontal(timeline);
      for (const l of ['en', 'es']) writeFileSync(s.srt[l], srt(tl, l));
      console.log(`listo: ${s.mp4} (${(comp.durationInFrames / comp.fps).toFixed(0)} s, horizontal)`);
    }
  } finally { if (propio) rmSync(serveUrl, { recursive: true, force: true }); }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (!ids.length) throw new Error('uso: node scripts/quien-horizontal.mjs <id> [<id>…]');
  await renderHorizontal(ids);
}
