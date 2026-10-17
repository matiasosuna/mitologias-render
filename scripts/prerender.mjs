// Pre-render: renderiza (sin publicar nada) los próximos ítems de la cola única a los que les faltan archivos en el release "media".
// Uso (en Actions, con el estado ya traído a out/): node scripts/prerender.mjs plan --n=6 [--motor=auto|github|modal] [--modal=1]
//   opciones: --forzar=id,id (re-render ignorando el release) --presupuesto=USD --episodios=N --legacy=0 (no omitir personajes viejos) --series=griegas,nordicas (solo esas mitologías)
//   imprime y deja en out/lotes.json y $GITHUB_OUTPUT `lotes` = JSON [{tipo, motor, ids}] (los tipos son los de render-nube: horizontal|partes|short)
//   node scripts/prerender.mjs subir <id:modo…>  → sube al release lo que dejó Modal en out/<id>/ (modo: horizontal|partes|vertical)
import { readFileSync, existsSync, appendFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { esShort, PLATAFORMAS, tieneYouTube, tieneInstagram, tieneTiktok } from './cola.mjs';
import { nombreAsset, hayAsset, subirAsset, rutaLocal, REPO } from './nube.mjs';
import { clavesOficiales, clavesLegacy } from './legacy.mjs';
import { publicados } from '../lib/personajes-oficiales.mjs';

/** Qué necesita cada tipo de ítem: [tipo de render-nube, clase de asset que lo prueba]. */
export const NECESITA = {
  episodio: [['horizontal', 'horizontal'], ['vertical', 'tiktok'], ['partes', 'partes']], // YouTube · TikTok (vertical completo) · Instagram (partes)
  short: [['short', 'short']],
};
/** Tipos que Modal sabe renderizar (scripts/modal_render.py): el resto va siempre por GitHub. */
export const TIPOS_MODAL = ['horizontal', 'vertical', 'partes'];
/** Costo estimado en USD de un render en Modal (8 núcleos + 24 GB ≈ 0,57 USD/h): medido en Modal el 2026-10-17. */
export const COSTO = { horizontal: 0.25, vertical: 0.1, partes: 0.17, short: 0 }; // medido el 2026-10-17: vertical 5–11 min, partes 17 min, horizontal 18–40 min

/** Los próximos `n` pares (id, tipo) de la cola cuyo archivo falta en el release y no hay un artefacto vigente.
 *  hayAsset(id, clase) y hayArtefacto(id, tipo) son booleanos. */
export function faltantes({ cola, tiene, listo, hayAsset, hayArtefacto = () => false, n, legacy = () => [], omitidos = [], forzar = [], presupuesto = Infinity, maxEpisodios = Infinity, permitir = () => true }) {
  const out = [], eps = new Set();
  let gasto = 0;
  const poner = (id, tipo) => {
    if (out.length >= n || gasto + (COSTO[tipo] ?? 0) > presupuesto) return false;
    out.push({ id, tipo }); gasto += COSTO[tipo] ?? 0; eps.add(id); return true;
  };
  for (const id of forzar) for (const [tipo] of NECESITA.episodio) poner(id, tipo); // re-render pedido a mano: ignora lo que haya en el release
  for (const e of cola) {
    if (out.length >= n) break;
    if (forzar.includes(e.id) || !permitir(e.id) || !listo(e.id) || PLATAFORMAS.every((p) => tiene[p].has(e.id))) continue;
    const faltan = (NECESITA[e.tipo] ?? []).filter(([tipo, clase]) => !hayAsset(e.id, clase) && !hayArtefacto(e.id, tipo));
    if (!faltan.length) continue;
    const viejos = legacy(e.id);
    if (viejos.length) { omitidos.push({ id: e.id, viejos }); continue; }
    if (!eps.has(e.id) && eps.size >= maxEpisodios) break;
    for (const [tipo] of faltan) poner(e.id, tipo);
  }
  return out;
}
export const costoTotal = (items) => items.reduce((a, { tipo }) => a + (COSTO[tipo] ?? 0), 0);

/** Los episodios van a Modal por defecto (auto = modal); 'github' los manda a render-nube. */
export const motorElegido = (motor) => (motor === 'github' ? 'github' : 'modal');

/** Agrupa por tipo; cada lote va a Modal si el motor lo permite, Modal sabe ese tipo y hay claves (modalOk); si no, GitHub. */
export function lotes(items, motor, modalOk) {
  const m = motorElegido(motor), g = new Map();
  for (const { id, tipo } of items) g.set(tipo, [...(g.get(tipo) ?? []), id]);
  return [...g].map(([tipo, ids]) => ({ tipo, ids, motor: m === 'modal' && modalOk && TIPOS_MODAL.includes(tipo) ? 'modal' : 'github' }));
}

const leerJSON = (f, def) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : def);
function artefactosVigentes() {
  try { return new Set(execFileSync('gh', ['api', '--paginate', `repos/${REPO}/actions/artifacts?per_page=100`, '-q', '.artifacts[] | select(.expired==false) | .name'], { encoding: 'utf8' }).split('\n').filter(Boolean)); } catch { return new Set(); }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, ...a] = process.argv.slice(2);
  const opt = (k, d) => a.find((x) => x.startsWith(`--${k}=`))?.split('=')[1] ?? d;
  if (cmd === 'plan') {
    const titulos = leerJSON('src/videos/titulos.json', {});
    const tiene = { youtube: tieneYouTube(leerJSON('src/videos/youtube-ids.json', {}), leerJSON('out/subidas-api.json', [])), instagram: tieneInstagram(leerJSON('out/subidas-instagram.json', [])), tiktok: tieneTiktok(leerJSON('out/subidas-buffer.json', [])) };
    const listo = (id) => ['guion.json', 'timeline.json'].every((f) => existsSync(join('src/videos', id, f))) && (esShort(id) || Boolean(titulos[id]?.titulo));
    const arte = artefactosVigentes();
    // un episodio ya publicado en alguna red conserva sus personajes (scripts/personajes-oficiales.mjs no lo convierte): se renderiza igual
    // que lo publicado; se omite solo lo NO publicado que todavía tiene claves viejas con diseño oficial
    const oficiales = clavesOficiales(), omitidos = [], pub = publicados();
    const series = opt('series', '').split(',').filter(Boolean); // p. ej. griegas,nordicas: solo esas mitologías
    const forzar = opt('forzar', '').split(',').filter(Boolean);
    const items = faltantes({ cola: leerJSON('out/cola-unificada.json', []), tiene, listo, n: Number(opt('n', 6)), forzar, omitidos,
      permitir: (id) => !series.length || series.some((x) => id.startsWith(`${x}-`) || id.startsWith(`short-${x}-`)), presupuesto: Number(opt('presupuesto', 'Infinity')), maxEpisodios: Number(opt('episodios', 'Infinity')),
      legacy: (id) => (opt('legacy', '1') === '0' || pub.has(id) ? [] : clavesLegacy(JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8')), oficiales)),
      hayAsset: (id, c) => hayAsset(nombreAsset(id, c)), hayArtefacto: (id, t) => arte.has(`${id}-${t}`) });
    console.log(`estimado Modal: USD ${costoTotal(items).toFixed(2)} · episodios: ${new Set(items.map((i) => i.id)).size}`);
    console.log(`omitidos por personajes viejos (${omitidos.length}): ${omitidos.map((o) => `${o.id} [${o.viejos.join(',')}]`).join(' | ').slice(0, 3000)}`);
    const L = lotes(items, opt('motor', 'modal'), opt('modal', '0') === '1');
    console.log(`prerender: ${items.length} ítems → ${L.map((l) => `${l.tipo}/${l.motor}: ${l.ids.join(' ')}`).join(' · ') || 'nada que renderizar'}`);
    mkdirSync('out', { recursive: true }); writeFileSync('out/lotes.json', JSON.stringify(L)); // los pasos siguientes del workflow lo leen
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `lotes=${JSON.stringify(L)}\n`);
  } else if (cmd === 'subir') {
    // lo que dejó Modal en out/<id>/: <id>:horizontal | <id>:partes | <id>:vertical (este último arma el mp4 de TikTok y lo sube)
    for (const spec of a) {
      const [id, modo] = spec.split(':');
      if (modo === 'horizontal') {
        for (const c of ['horizontal', 'srt-en', 'srt-es', 'miniatura']) if (existsSync(rutaLocal(id, c))) subirAsset(rutaLocal(id, c), nombreAsset(id, c));
        if (!existsSync(rutaLocal(id, 'miniatura'))) console.log(`::error::${id}: Modal no dejó miniatura.jpg (revisar "ERROR miniatura" en el log de Modal)`);
      } else if (modo === 'partes') {
        const { de } = JSON.parse(readFileSync(rutaLocal(id, 'partes'), 'utf8'));
        for (let n = 1; n <= de; n++) subirAsset(rutaLocal(id, 'parte', n), nombreAsset(id, 'parte', n));
        subirAsset(rutaLocal(id, 'portada-ig'), nombreAsset(id, 'portada-ig'));
        subirAsset(rutaLocal(id, 'partes'), nombreAsset(id, 'partes')); // al final: marca que el juego de partes está completo
      } else if (modo === 'vertical') {
        process.env.MOC_VERTICAL_LISTO = '1';
        await (await import('./buffer-tiktok.mjs')).prepararTiktok(id);
      } else throw new Error(`subir: modo desconocido en ${spec}`);
    }
  } else throw new Error('uso: node scripts/prerender.mjs plan|subir');
}
