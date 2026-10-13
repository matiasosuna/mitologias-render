// Cambia el título de los episodios ya subidos a YouTube por el de src/videos/titulos.json.
// Uso:
//   node scripts/youtube-titulos.mjs           → actualiza (50 unidades de cuota por video; lee de a 50 con 1 unidad)
//   node scripts/youtube-titulos.mjs --probar  → muestra viejo → nuevo, sin escribir
// Manda el snippet COMPLETO con solo el título cambiado (videos.update borra lo que no se manda).
// Saltea los que ya tienen el título nuevo; si se acaba la cuota (403 quotaExceeded) para y se puede volver a correr.
import { readFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { leerTitulos } from './titulos.mjs';

/** Snippet para videos.update: el mismo que devolvió videos.list, con solo el título nuevo. */
export function snippetConTitulo(snippet, titulo) {
  if (!snippet?.categoryId) throw new Error('snippet sin categoryId (videos.update lo exige)');
  return { ...snippet, title: titulo };
}

/** Pares { id, video, nuevo } de los episodios subidos que tienen título nuevo (los Shorts no tienen entrada). */
export function pendientes(ids, titulos) {
  return Object.entries(ids).filter(([id]) => titulos[id]).map(([id, video]) => ({ id, video, nuevo: titulos[id].titulo }));
}

export const tandas = (lista, n = 50) => Array.from({ length: Math.ceil(lista.length / n) }, (_, i) => lista.slice(i * n, i * n + n));
export const esCuota = (e) => e?.status === 403 && /quotaExceeded|dailyLimitExceeded|rateLimitExceeded/.test(e.razon ?? e.message ?? '');

async function main() {
  const { api } = await import('./youtube-api.mjs');
  const probar = process.argv.includes('--probar');
  const ids = JSON.parse(readFileSync('src/videos/youtube-ids.json', 'utf8'));
  const lista = pendientes(ids, leerTitulos());
  console.log(`${lista.length} episodios en YouTube con título nuevo${probar ? ' (--probar: no se escribe nada)' : ''}`);

  // 1) leer los snippets actuales, de a 50 ids por llamada
  const actuales = {};
  let sinLeer = false;
  try {
    for (const t of tandas(lista)) {
      const r = await api('GET', '/videos', { query: { part: 'snippet', id: t.map((x) => x.video).join(','), maxResults: '50' } });
      for (const it of r.items ?? []) actuales[it.id] = it.snippet;
    }
  } catch (e) {
    if (!esCuota(e) || !probar) { if (esCuota(e)) { console.log('Cuota de YouTube agotada antes de empezar: volvé a correrlo mañana.'); process.exit(2); } throw e; }
    sinLeer = true;
    console.log('(cuota agotada: no se pudieron leer los títulos actuales; se muestra el último título generado en out/<id>/youtube.json)');
  }

  let hechos = 0, iguales = 0, faltan = 0;
  for (const [i, x] of lista.entries()) {
    const sn = actuales[x.video];
    const local = existsSync(`out/${x.id}/youtube.json`) ? JSON.parse(readFileSync(`out/${x.id}/youtube.json`, 'utf8')).titulo : '?';
    const viejo = sn?.title ?? (sinLeer ? `${local} (local)` : null);
    if (!sinLeer && !sn) { console.log(`✗ ${x.id} (${x.video}): no está en YouTube`); faltan++; continue; }
    if (sn?.title === x.nuevo) { iguales++; continue; }
    console.log(`${x.id}\n  ${viejo}\n→ ${x.nuevo}`);
    if (probar) continue;
    try {
      await api('PUT', '/videos', { query: { part: 'snippet' }, json: { id: x.video, snippet: snippetConTitulo(sn, x.nuevo) } });
      hechos++;
    } catch (e) {
      if (esCuota(e)) {
        console.log(`\nCuota agotada: ${hechos} actualizados, ${lista.length - i} sin hacer. Volvé a correrlo mañana (saltea los ya hechos).`);
        process.exit(2);
      }
      console.log(`  ERROR ${String(e.message).slice(0, 200)}`);
    }
  }
  console.log(`\n${probar ? 'Por cambiar' : 'Actualizados'}: ${probar ? lista.length - iguales - faltan : hechos} · ya estaban: ${iguales}${faltan ? ` · no encontrados: ${faltan}` : ''}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
