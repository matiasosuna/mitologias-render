// Borra del release (media, media-2…) los archivos de los videos que ya salieron en las 3 redes hace más de DIAS días:
// nadie los vuelve a usar (prerender salta lo ya publicado en todas). Se queda lo que tenga miniatura de YouTube pendiente.
// Uso (con el estado en out/, como prerender): node scripts/limpiar-media.mjs [--borrar] [--dias=3]
//   sin --borrar solo lista qué borraría.
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { PLATAFORMAS, tieneYouTube, tieneInstagram, tieneTiktok } from './cola.mjs';
import { REPO, miniaturasPendientes } from './nube.mjs';

export const idDeAsset = (nombre) => nombre.split('.')[0];

/** assets: [{id, nombre, release}]; tiene: {red: Map(id → ms de publicación)}; guardar: ids que no se tocan. */
export function borrables({ assets, tiene, guardar = new Set(), ahora = Date.now(), dias = 3 }) {
  const corte = ahora - dias * 864e5;
  const listo = (id) => !guardar.has(id) && PLATAFORMAS.every((p) => tiene[p].has(id) && tiene[p].get(id) <= corte);
  return assets.filter((a) => /^media(-\d+)?$/.test(a.release) && listo(idDeAsset(a.nombre)));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const leerJSON = (f, def) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : def);
  const opt = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=')[1] ?? d;
  const borrar = process.argv.includes('--borrar');
  if (!existsSync('out/subidas-instagram.json') || !existsSync('out/subidas-buffer.json')) throw new Error('falta el estado en out/ (scripts/estado-traer.sh)');
  const tiene = {
    youtube: tieneYouTube(leerJSON('src/videos/youtube-ids.json', {}), leerJSON('out/subidas-api.json', [])),
    instagram: tieneInstagram(leerJSON('out/subidas-instagram.json', [])),
    tiktok: tieneTiktok(leerJSON('out/subidas-buffer.json', [])),
  };
  const guardar = new Set(miniaturasPendientes(leerJSON('out/miniaturas-youtube.json', [])).map((p) => p.id));
  const assets = execFileSync('gh', ['api', `repos/${REPO}/releases`, '--paginate', '-q', '.[] as $r | $r.assets[] | "\\($r.tag_name)\\t\\(.id)\\t\\(.size)\\t\\(.name)"'], { encoding: 'utf8', maxBuffer: 1 << 26 })
    .trim().split('\n').filter(Boolean).map((l) => { const [release, id, size, nombre] = l.split('\t'); return { release, id, size: Number(size), nombre }; });
  const b = borrables({ assets, tiene, guardar, dias: Number(opt('dias', 3)) });
  const gb = (b.reduce((s, a) => s + a.size, 0) / 1e9).toFixed(1);
  console.log(`${borrar ? 'borrando' : 'borraría'} ${b.length} archivos (${gb} GB) de ${new Set(b.map((a) => idDeAsset(a.nombre))).size} videos ya publicados en las 3 redes`);
  for (const a of b) {
    if (!borrar) { console.log(`  ${a.release}/${a.nombre}`); continue; }
    try { execFileSync('gh', ['api', '-X', 'DELETE', `repos/${REPO}/releases/assets/${a.id}`], { stdio: 'ignore' }); }
    catch { console.log(`::warning::no se pudo borrar ${a.release}/${a.nombre}`); }
  }
}
