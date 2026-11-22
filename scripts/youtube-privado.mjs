// Pasa a PRIVADO todos los videos públicos o no listados del canal (Matías 2026-11-21: «archivá todos y arranquemos
// de nuevo»). No borra nada: se pueden volver a hacer públicos desde YouTube Studio.
// Respaldo (id, título, estado anterior) en out/youtube-privado-<fecha>.json.
// Cuota: 1 unidad por lectura de 50 videos + 50 por cada cambio (≈ 200 cambios por día); si se acaba, frena y
// la próxima corrida sigue con los que quedan.
// Uso (con .env y .yt-token.json, como en publicar): node scripts/youtube-privado.mjs [--listar]
import { writeFileSync, mkdirSync } from 'node:fs';
import { api } from './youtube-api.mjs';

const listar = process.argv.includes('--listar');
const ch = (await api('GET', '/channels', { query: { part: 'contentDetails', mine: 'true' } })).items[0];
const ids = [];
let pt;
do {
  const r = await api('GET', '/playlistItems', { query: { part: 'contentDetails', playlistId: ch.contentDetails.relatedPlaylists.uploads, maxResults: 50, ...(pt ? { pageToken: pt } : {}) } });
  ids.push(...r.items.map((i) => i.contentDetails.videoId));
  pt = r.nextPageToken;
} while (pt);

const videos = [];
for (let i = 0; i < ids.length; i += 50) {
  const r = await api('GET', '/videos', { query: { part: 'snippet,status', id: ids.slice(i, i + 50).join(',') } });
  videos.push(...r.items.map((v) => ({ id: v.id, titulo: v.snippet.title, status: v.status })));
}
const visibles = videos.filter((v) => v.status.privacyStatus !== 'private');
console.log(`${videos.length} videos en el canal; ${visibles.length} públicos o no listados`);
mkdirSync('out', { recursive: true });
writeFileSync(`out/youtube-privado-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(visibles.map((v) => ({ id: v.id, titulo: v.titulo, antes: v.status.privacyStatus })), null, 1));
if (listar) { for (const v of visibles) console.log(`  ${v.status.privacyStatus}\t${v.id}\t${v.titulo}`); process.exit(0); }

let hechos = 0;
for (const v of visibles) {
  const { privacyStatus, uploadStatus, failureReason, rejectionReason, publishAt, madeForKids, ...resto } = v.status;
  try {
    await api('PUT', '/videos', { query: { part: 'status' }, json: { id: v.id, status: { ...resto, privacyStatus: 'private' } } });
    hechos++;
  } catch (e) {
    if (e.razon === 'quotaExceeded') { console.log(`::warning::cuota agotada: quedan ${visibles.length - hechos} para mañana`); break; }
    console.log(`::warning::${v.id} ${v.titulo}: ${e.message.slice(0, 200)}`);
  }
}
console.log(`privados: ${hechos} de ${visibles.length}`);
