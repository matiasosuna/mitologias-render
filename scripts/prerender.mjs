// Pre-render: renderiza (sin publicar nada) los próximos ítems de la cola única a los que les faltan archivos en el release "media".
// Uso (en Actions, con el estado ya traído a out/): node scripts/prerender.mjs plan --n=6 [--motor=auto|github|modal] [--modal=1]
//   imprime y deja en $GITHUB_OUTPUT `lotes` = JSON [{tipo, motor, ids}] (los tipos son los de render-nube: horizontal|partes|short)
//   node scripts/prerender.mjs subir <id…>  → sube a mano al release lo que dejó Modal en out/<id>/ (horizontal, srt, miniatura)
import { readFileSync, existsSync, appendFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { esShort, PLATAFORMAS, tieneYouTube, tieneInstagram, tieneTiktok } from './cola.mjs';
import { nombreAsset, hayAsset, subirAsset, rutaLocal, REPO } from './nube.mjs';

/** Qué necesita cada tipo de ítem: [tipo de render-nube, clase de asset que lo prueba]. */
export const NECESITA = {
  episodio: [['horizontal', 'horizontal'], ['partes', 'partes']],
  short: [['short', 'short']],
};
/** Tipos que Modal sabe renderizar (scripts/modal_render.py): el resto va siempre por GitHub. */
export const TIPOS_MODAL = ['horizontal'];

/** Los próximos `n` pares (id, tipo) de la cola cuyo archivo falta en el release y no hay un artefacto vigente.
 *  hayAsset(id, clase) y hayArtefacto(id, tipo) son booleanos. */
export function faltantes({ cola, tiene, listo, hayAsset, hayArtefacto = () => false, n }) {
  const out = [];
  for (const e of cola) {
    if (out.length >= n) break;
    if (!listo(e.id) || PLATAFORMAS.every((p) => tiene[p].has(e.id))) continue;
    for (const [tipo, clase] of NECESITA[e.tipo] ?? []) {
      if (out.length >= n) break;
      if (!hayAsset(e.id, clase) && !hayArtefacto(e.id, tipo)) out.push({ id: e.id, tipo });
    }
  }
  return out;
}

/** 'auto' → Modal si el lote tiene más de 3 ítems, si no GitHub. */
export const motorElegido = (motor, n) => (motor === 'github' || motor === 'modal' ? motor : n > 3 ? 'modal' : 'github');

/** Agrupa por tipo; cada lote va a Modal solo si se pidió/eligió y Modal sabe ese tipo y hay claves (modalOk). */
export function lotes(items, motor, modalOk) {
  const m = motorElegido(motor, items.length), g = new Map();
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
    const items = faltantes({ cola: leerJSON('out/cola-unificada.json', []), tiene, listo, n: Number(opt('n', 6)),
      hayAsset: (id, c) => hayAsset(nombreAsset(id, c)), hayArtefacto: (id, t) => arte.has(`${id}-${t}`) });
    const L = lotes(items, opt('motor', 'auto'), opt('modal', '0') === '1');
    console.log(`prerender: ${items.length} ítems → ${L.map((l) => `${l.tipo}/${l.motor}: ${l.ids.join(' ')}`).join(' · ') || 'nada que renderizar'}`);
    mkdirSync('out', { recursive: true }); writeFileSync('out/lotes.json', JSON.stringify(L)); // los pasos siguientes del workflow lo leen
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `lotes=${JSON.stringify(L)}\n`);
  } else if (cmd === 'subir') {
    for (const id of a) for (const c of ['horizontal', 'srt-en', 'srt-es', 'miniatura']) if (existsSync(rutaLocal(id, c))) subirAsset(rutaLocal(id, c), nombreAsset(id, c));
  } else throw new Error('uso: node scripts/prerender.mjs plan|subir');
}
