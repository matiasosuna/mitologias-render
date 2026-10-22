// Render de una composición partida en trozos de cuadros, todos a la vez (un Chrome aprovecha ~2 núcleos),
// más la pista de audio aparte; después se unen sin recodificar. Misma calidad que de una sola pasada.
import { renderMedia } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

/** Rangos [desde, hasta] (inclusivos) que parten n cuadros en `trozos` partes parejas. */
export function rangos(n, trozos) {
  const paso = Math.ceil(n / Math.max(1, trozos)), r = [];
  for (let a = 0; a < n; a += paso) r.push([a, Math.min(n - 1, a + paso - 1)]);
  return r;
}

export async function renderPartido({ serveUrl, composition, inputProps, out, trozos, concurrency, crf }) {
  if (trozos <= 1) return renderMedia({ serveUrl, composition, codec: 'h264', outputLocation: out, crf, timeoutInMilliseconds: 180000, concurrency, inputProps });
  const dir = `${out}.trozos`; rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const r = rangos(composition.durationInFrames, trozos);
  await Promise.all([
    ...r.map(([a, b], i) => renderMedia({ serveUrl, composition, codec: 'h264', outputLocation: join(dir, `p${i}.mp4`), frameRange: [a, b], muted: true, crf, timeoutInMilliseconds: 180000, concurrency, inputProps })),
    renderMedia({ serveUrl, composition, codec: 'aac', outputLocation: join(dir, 'audio.aac'), timeoutInMilliseconds: 180000, concurrency: 1, inputProps }),
  ]);
  writeFileSync(join(dir, 'lista.txt'), r.map((_, i) => `file '${resolve(dir, `p${i}.mp4`)}'`).join('\n'));
  execFileSync('npx', ['remotion', 'ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(dir, 'lista.txt'), '-i', join(dir, 'audio.aac'), '-map', '0:v', '-map', '1:a', '-c', 'copy', '-movflags', '+faststart', out], { stdio: 'inherit' });
  rmSync(dir, { recursive: true, force: true });
}
