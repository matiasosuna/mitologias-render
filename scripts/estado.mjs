// Estado de las colas de publicación (registros + orden de los Shorts), compartido entre la Mac y GitHub Actions
// en la rama "estado" del repo público (publicar-render.sh no la toca). Los registros se FUSIONAN (unión), nunca se
// pisan: un registro de más evita publicar dos veces. Sin claves ni tokens.
// Lo usan scripts/estado-subir.sh y scripts/estado-traer.sh (desde la raíz del proyecto):
//   node scripts/estado.mjs subir <carpeta-estado> [lista]  → fusiona los archivos de acá en la carpeta
//   node scripts/estado.mjs traer <carpeta-estado>          → fusiona la carpeta en los archivos de acá
//   node scripts/estado.mjs agregar <carpeta-estado> <id…>  → suma Shorts al FINAL del orden (intercalados por mitología)
// El orden de los Shorts también se fusiona: lo de la rama queda tal cual y lo nuevo de acá va al final (así un workflow
// con una copia vieja no borra lo que agregó la rutina). ESTADO_REEMPLAZAR_ORDEN=1 lo pisa entero (reordenar a mano).
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

/** archivo en la rama estado → lugar en el proyecto */
export const ARCHIVOS = {
  'subidas-api.json': 'out/subidas-api.json',
  'subidas-instagram.json': 'out/subidas-instagram.json',
  'subidas-buffer.json': 'out/subidas-buffer.json',
  'youtube-ids.json': 'src/videos/youtube-ids.json',
  'miniaturas-youtube.json': 'out/miniaturas-youtube.json', // miniaturas pendientes por el límite de YouTube
  'turnos.json': 'out/turnos.json', // pasos ya hechos en cada turno (un 2.º cron del mismo turno no repite)
  'cola-unificada.json': 'out/cola-unificada.json', // la cola única de YouTube, Instagram y TikTok (scripts/cola.mjs)
  'tiktok-ritmo.json': 'out/tiktok-ritmo.json', // TikTok frenado por la plataforma (2 por turno durante 24 h)
};
/** Archivos que no se fusionan por unión: la cola única conserva el orden de la rama y suma lo nuevo al final. */
const COLA = 'cola-unificada.json';
export const fusionarCola = (rama, otra) => { if (!rama?.length) return otra ?? rama; const ya = new Set(rama.map((e) => e.id)); return [...rama, ...(otra ?? []).filter((e) => !ya.has(e.id))]; };
export const LISTA = 'out/shorts-orden.txt';

/** Unión: listas → base + lo que falte de `otro` (sin repetir); objetos → base con `otro` encima. */
export function fusionar(base, otro) {
  if (Array.isArray(base) || Array.isArray(otro)) {
    const a = base ?? [], vistos = new Set(a.map((x) => JSON.stringify(x)));
    return [...a, ...(otro ?? []).filter((x) => { const k = JSON.stringify(x); if (vistos.has(k)) return false; vistos.add(k); return true; })];
  }
  return { ...(base ?? {}), ...(otro ?? {}) };
}

/** Mitología de un Short: short-<serie>-<slug>. */
export const serieDe = (id) => id.replace(/^short-/, '').split('-')[0];

/** Ronda por mitología (orden de aparición), sin empezar por la misma mitología que `ultimo` si se puede. */
export function intercalar(ids, ultimo) {
  const grupos = new Map();
  for (const id of ids) (grupos.get(serieDe(id)) ?? grupos.set(serieDe(id), []).get(serieDe(id))).push(id);
  const series = [...grupos.keys()];
  if (ultimo && series.length > 1 && series[0] === serieDe(ultimo)) series.push(series.shift());
  const r = [];
  for (let i = 0; r.length < ids.length; i++) for (const s of series) if (grupos.get(s)[i]) r.push(grupos.get(s)[i]);
  return r;
}

/** Agrega al final sin tocar ni repetir nada de lo que ya está. */
export function agregarOrden(orden, nuevos) {
  const ya = new Set(orden);
  return [...orden, ...intercalar([...new Set(nuevos)].filter((x) => !ya.has(x)), orden.at(-1))];
}

/** Orden de la rama + lo de acá que falte (al final, en el orden de acá). */
export const fusionarOrden = (base, aca) => { const ya = new Set(base); return [...base, ...aca.filter((x) => !ya.has(x))]; };

const leerOrden = (f) => (existsSync(f) ? readFileSync(f, 'utf8').split('\n').map((x) => x.trim()).filter(Boolean) : []);
const escribirOrden = (f, ids) => writeFileSync(f, ids.length ? ids.join('\n') + '\n' : '');

const leer = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : undefined);
const escribir = (f, datos) => { mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, JSON.stringify(datos, null, f.endsWith('youtube-ids.json') ? 2 : 1)); };

export function subir(carpeta, lista = LISTA) {
  for (const [nombre, local] of Object.entries(ARCHIVOS)) {
    const aca = leer(local);
    if (aca !== undefined) escribir(join(carpeta, nombre), (nombre === COLA ? fusionarCola : fusionar)(leer(join(carpeta, nombre)), aca));
  }
  if (!existsSync(lista)) return;
  const destino = join(carpeta, 'shorts-orden.txt');
  if (process.env.ESTADO_REEMPLAZAR_ORDEN === '1') copyFileSync(lista, destino);
  else escribirOrden(destino, fusionarOrden(leerOrden(destino), leerOrden(lista)));
}

export function agregar(carpeta, ids) {
  const destino = join(carpeta, 'shorts-orden.txt'), antes = leerOrden(destino), despues = agregarOrden(antes, ids);
  escribirOrden(destino, despues);
  return despues.slice(antes.length);
}

export function traer(carpeta) {
  for (const [nombre, local] of Object.entries(ARCHIVOS)) {
    const alla = leer(join(carpeta, nombre));
    if (alla !== undefined) escribir(local, nombre === COLA ? fusionarCola(alla, leer(local)) : fusionar(leer(local), alla));
  }
  if (existsSync(join(carpeta, 'shorts-orden.txt'))) { mkdirSync(dirname(LISTA), { recursive: true }); copyFileSync(join(carpeta, 'shorts-orden.txt'), LISTA); }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, carpeta, lista, ...resto] = process.argv.slice(2);
  if (!carpeta || !existsSync(carpeta)) throw new Error('uso: node scripts/estado.mjs subir|traer|agregar <carpeta-estado> [lista | id…]');
  if (cmd === 'subir') subir(carpeta, lista || LISTA);
  else if (cmd === 'agregar') {
    const ids = [lista, ...resto].filter(Boolean);
    const malos = ids.filter((x) => !/^short-[a-z]+-[a-z0-9-]+$/.test(x) || !existsSync(join('src/videos', x, 'guion.json')));
    if (!ids.length || malos.length) throw new Error(`agregar: ids inválidos o sin src/videos/<id>/guion.json: ${malos.join(' ') || '(ninguno)'}`);
    const nuevos = agregar(carpeta, ids);
    console.log(nuevos.length ? `agregados al orden: ${nuevos.join(' ')}` : 'agregar: ya estaban todos');
  }
  else if (cmd === 'traer') traer(carpeta);
  else throw new Error(`comando desconocido: ${cmd}`);
}
