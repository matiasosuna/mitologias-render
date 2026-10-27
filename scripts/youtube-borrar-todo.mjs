// Borra TODOS los videos del canal de YouTube subidos antes de una fecha, para empezar de cero con capítulos largos
// (Matías 2026-10-27, como Instagram el 25/10). El pedido está en src/videos/youtube-borrar.json ({ "antes": fecha ISO }).
// Lo corre "publicar" al empezar el paso de YouTube (nube.mjs turno youtube), así nunca choca con una subida.
// Respaldo (id, título, fecha) en out/youtube-respaldo-<fecha>.json. Cada borrado va a out/borrados.json: estado.mjs saca
// sus registros (youtube-ids, subidas-api) y la cola de YouTube vuelve a arrancar del E1 de cada serie.
// Cuota: 50 unidades por video. Si se acaba, frena y sigue en la próxima corrida; mientras quede algo viejo no se sube nada
// (si no, el chequeo de duplicados por título volvería a anotar un video viejo). Lo subido después del corte no se toca.
// Al terminar anota la marca "youtube-borrado:<fecha>" en borrados.json (no es un id) y no se vuelve a correr.
// A mano: node scripts/youtube-borrar-todo.mjs [--antes=<ISO>] [--listar]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { sinBorrados } from './estado.mjs';

export const PEDIDO = 'src/videos/youtube-borrar.json';
const BORRADOS = 'out/borrados.json', IDS = 'src/videos/youtube-ids.json', API_REG = 'out/subidas-api.json';
const leer = (f, d) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : d);
const marca = (antes) => `youtube-borrado:${antes.toISOString()}`;

/** ¿Hay un borrado pedido que todavía no terminó? Devuelve la fecha de corte o null. */
export function pendiente() {
  const p = leer(PEDIDO, null);
  if (!p?.antes) return null;
  const antes = new Date(p.antes);
  if (Number.isNaN(antes.getTime())) throw new Error(`${PEDIDO}: fecha inválida`);
  return leer(BORRADOS, []).includes(marca(antes)) ? null : antes;
}

/** Borra lo subido antes de `antes`. Devuelve cuántos quedan (0 = terminado). */
export async function borrarCanal(antes, { listar = false } = {}) {
  const { api } = await import('./youtube-api.mjs');
  const subidas = (await api('GET', '/channels', { query: { part: 'contentDetails', mine: 'true' } })).items[0].contentDetails.relatedPlaylists.uploads;
  const canal = [];
  let page;
  do {
    const p = await api('GET', '/playlistItems', { query: { part: 'snippet,status', playlistId: subidas, maxResults: '50', ...(page ? { pageToken: page } : {}) } });
    for (const it of p.items) canal.push({ id: it.snippet.resourceId.videoId, titulo: it.snippet.title, privacidad: it.status?.privacyStatus, subido: it.snippet.publishedAt });
    page = p.nextPageToken;
  } while (page);
  const viejos = canal.filter((v) => new Date(v.subido) < antes);
  console.log(`YouTube borrar todo: canal ${canal.length} videos · a borrar (subidos antes de ${antes.toISOString()}): ${viejos.length}`);

  mkdirSync('out', { recursive: true });
  const respaldo = `out/youtube-respaldo-${antes.toISOString().slice(0, 10)}.json`, previo = leer(respaldo, []);
  writeFileSync(respaldo, JSON.stringify([...previo, ...viejos.filter((v) => !previo.some((p) => p.id === v.id))], null, 1));
  if (listar) { for (const v of viejos) console.log(`${v.id}\t${v.privacidad}\t${v.subido}\t${v.titulo}`); return viejos.length; }

  const borrados = leer(BORRADOS, []);
  const anotar = (id) => { if (!borrados.includes(id)) borrados.push(id); };
  let hechos = 0, cuota = false;
  for (const v of viejos) {
    try {
      await api('DELETE', '/videos', { query: { id: v.id } });
    } catch (e) {
      if (e.razon === 'quotaExceeded' || e.razon === 'dailyLimitExceeded') { cuota = true; break; }
      if (e.status !== 404) { console.log(`${v.id} ERROR ${String(e.message).slice(0, 160)}`); continue; }
    }
    anotar(v.id); hechos++;
    console.log(`borrado ${v.id} · ${v.titulo}`);
  }
  const quedan = viejos.length - hechos;
  if (!quedan) {
    // ids anotados que ya no están en el canal (p. ej. los 5 borrados el 22/10, que quedaron anotados a propósito):
    // también salen, así la cola nueva sube esos episodios en su lugar
    const enCanal = new Set(canal.map((v) => v.id));
    for (const id of new Set([...Object.values(leer(IDS, {})), ...leer(API_REG, []).map((r) => r.video)].filter(Boolean))) if (!enCanal.has(id)) anotar(id);
    anotar(marca(antes));
  }
  writeFileSync(BORRADOS, JSON.stringify(borrados, null, 1));
  // los registros de acá también, ya (el turno de YouTube los lee enseguida)
  for (const [nombre, f] of [['youtube-ids.json', IDS], ['subidas-api.json', API_REG]]) {
    if (existsSync(f)) writeFileSync(f, JSON.stringify(sinBorrados(nombre, leer(f), borrados), null, f === IDS ? 2 : 1));
  }
  console.log(`YouTube borrar todo: ${hechos} borrados en esta corrida · quedan ${quedan}${cuota ? ' (sin cuota por hoy: sigue en la próxima corrida)' : ''}`);
  return quedan;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const a = process.argv.find((x) => x.startsWith('--antes='))?.slice(8);
  const antes = a ? new Date(a) : pendiente();
  if (!antes || Number.isNaN(antes.getTime())) { console.log('no hay borrado pendiente'); process.exit(0); }
  process.exit((await borrarCanal(antes, { listar: process.argv.includes('--listar') })) ? 2 : 0);
}
