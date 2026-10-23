// Publicación desde GitHub Actions (workflow "publicar" del repo público mitologias-render), sin la Mac.
// UNA sola cola para YouTube, Instagram y TikTok (scripts/cola.mjs; guardada en la rama "estado" como cola-unificada.json):
// cada turno (cada 4 h) cada plataforma publica lo que le toca según esa lista, con el mismo calendario para las tres.
// Los videos y portadas viven como assets del release "media" del repo público; si falta uno, se renderiza en la misma
// corrida y se sube. Sus URL públicas las bajan Instagram y Buffer.
// Uso (con NUBE=1, en Actions):
//   node scripts/nube.mjs cola                         → arma/actualiza out/cola-unificada.json (lo nuevo va al final)
//   node scripts/nube.mjs plan                         → qué publicaría cada plataforma en este turno (no publica)
//   node scripts/nube.mjs turno youtube|instagram|tiktok → publica lo de este turno en esa plataforma (una vez por turno)
//   node scripts/nube.mjs adelantar                    → deja en el release lo que van a usar los próximos turnos
//   node scripts/nube.mjs sembrar [--max=4]            → (Mac) sube al release lo ya renderizado de lo próximo
// Cada plataforma se hace una sola vez por turno (out/turnos.json en el estado): otra corrida del mismo turno no repite.
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, rmSync, copyFileSync, mkdtempSync, readdirSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { ganchoParte } from './titulos.mjs';
import { viejosDeArchivo } from './legacy.mjs';
import {
  HORAS_UTC, clase, construirCola, actualizarCola, tieneYouTube, tieneInstagram, tieneTiktok, partesHechasIG, partesEstimadas,
  planTurno, estadoCola, limitar, usadas24h, esQuien, esShort, PLATAFORMAS, MAX_ALCANZAR, MAX_TIKTOK_FRENADO, TOPE_24H, TOPE_COLA_BUFFER,
  horizontalTurno, claveHorizontal, esBiblia,
} from './cola.mjs';
import { tituloQuienHorizontal, listaQuien, mitologiaEn } from '../lib/quien.mjs';
import * as yo from './nube.mjs'; // este mismo módulo, para pasárselo a buffer-tiktok (ver prepararTiktok)

export const REPO = 'matiasosuna/mitologias-render', RELEASE = 'media';
export const urlAsset = (nombre) => `https://github.com/${REPO}/releases/download/${RELEASE}/${nombre}`;

// ── turnos: cron cada 4 h a las 2, 6, 10, 14, 18 y 22 UTC = 16, 20, 00, 04, 08 y 12 HST (UTC−10)
/** Fecha del turno: la de creación de la corrida (TURNO_FECHA, la pone el workflow) aunque haya esperado en la cola. */
export const fechaTurno = () => new Date(process.env.TURNO_FECHA || Date.now());
/** Hora UTC del turno al que pertenece una fecha: el último ya empezado (los cron de Actions suelen llegar tarde). */
export const turnoUTC = (fecha) => [...HORAS_UTC].reverse().find((h) => h <= fecha.getUTCHours()) ?? 22;
export { horaHST } from './cola.mjs';
/** Comienzo (ms UTC) del turno al que pertenece una fecha. */
export function inicioTurno(fecha) {
  const t = turnoUTC(fecha);
  return Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate(), t) - (t > fecha.getUTCHours() ? 864e5 : 0);
}
/** Clave de "este paso ya se hizo en este turno", p. ej. 2026-10-14T18Z|cola-youtube. */
export const claveTurno = (fecha, paso) => `${new Date(inicioTurno(fecha)).toISOString().slice(0, 13)}Z|${paso}`;

// ── nombres de los assets del release y su lugar en out/
const ASSETS = {
  short: [(id) => `${id}.mp4`, (id) => `${id}.mp4`],
  parte: [(id, n) => `${id}.parte-${n}.mp4`, (id, n) => `${id}.parte-${n}.mp4`],
  partes: [(id) => `${id}.partes.json`, () => 'partes.json'],
  tiktok: [(id) => `${id}.tiktok.mp4`, (id) => `${id}.tiktok.mp4`],
  'tiktok-meta': [(id) => `${id}.tiktok.json`, () => 'tiktok.json'], // huella del guion del mp4 de TikTok de un episodio
  vertical: [(id) => `${id}.vertical.mp4`, (id) => `${id}.vertical.mp4`],
  'portada-short': [(id) => `${id}.portada-short.jpg`, () => 'portada-short.jpg'],
  'portada-ig': [(id) => `${id}.portada-ig.jpg`, () => 'portada-ig.jpg'],
  'portada-ig-parte': [(id, n) => `${id}.portada-ig-${n}.jpg`, (id, n) => `portada-ig-${n}.jpg`], // con su "n/m" debajo del título
  'tapa-ig': [(id, n) => (n ? `${id}.tapa-ig-${n}.jpg` : `${id}.tapa-ig.jpg`), (id, n) => (n ? `tapa-ig-${n}.jpg` : 'tapa-ig.jpg')],
  horizontal: [(id) => `${id}.horizontal.mp4`, (id) => `${id}.en.mp4`], // el episodio largo que sube subir.mjs
  'horizontal-meta': [(id) => `${id}.horizontal.json`, () => 'horizontal.json'], // huella del guion del horizontal (episodios con gancho)
  'srt-en': [(id) => `${id}.en.srt`, (id) => `${id}.en.srt`],
  'srt-es': [(id) => `${id}.es.srt`, (id) => `${id}.es.srt`],
  miniatura: [(id) => `${id}.miniatura.jpg`, () => 'miniatura.jpg'],
};
const claseAsset = (c) => { if (!ASSETS[c]) throw new Error(`clase de asset desconocida: ${c}`); return ASSETS[c]; };
export const nombreAsset = (id, c, n) => claseAsset(c)[0](id, n);
export const rutaLocal = (id, c, n) => join('out', id, claseAsset(c)[1](id, n));

/** Huella del guion + timeline: si cambia (p. ej. elenco oficial nuevo), los verticales viejos no se reusan. */
export function huella(id) {
  const h = createHash('sha1');
  for (const f of ['guion.json', 'timeline.json']) { const r = join('src/videos', id, f); if (existsSync(r)) h.update(readFileSync(r)); }
  return h.digest('hex').slice(0, 12);
}

export const leerLista = (archivo) => (existsSync(archivo) ? readFileSync(archivo, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean) : []);
/** Miniaturas que YouTube rechazó (límite): registro solo-agregar con estado pendiente | ok, por video. */
export function miniaturasPendientes(reg) {
  const ok = new Set(reg.filter((r) => r.estado === 'ok').map((r) => r.video));
  return [...new Map(reg.filter((r) => r.estado === 'pendiente' && !ok.has(r.video)).map((r) => [r.video, r])).values()];
}
/** Título con el que subir.mjs sube un Short nativo (sirve para no subirlo dos veces). */
export const tituloShortYT = (guion) => `${guion.gancho.en} #Shorts`;
/** Busca un título en la salida de `youtube-api.mjs videos` (id \t estado \t título). */
export function buscarTitulo(listado, titulo) {
  const fila = listado.split('\n').map((l) => l.split('\t')).find((c) => c.length >= 3 && c.slice(2).join('\t').trim() === titulo.trim());
  return fila ? fila[0] : null;
}
/** Argumentos extra de subir.mjs para un episodio: especiales y Stories a su lista (Odisea, Greek Myth Stories…). */
export function extraYT(entradaTitulos, listas) {
  const l = entradaTitulos?.especial && listas[entradaTitulos.especial];
  return l ? [`--lista=${l}`] : [];
}

// ── release
/** Guarda: ningún video ni portada (video, partes, tiktok, portada-ig/short, tapa-ig, miniatura) se sube ni se baja para publicar
 *  si el guion de su episodio todavía tiene una clave vieja con diseño oficial (personajes, animales o los de la portada). */
export function guardaLegacy(nombre, viejos = viejosDeArchivo) {
  const m = /^([^.]+)\.(?:horizontal\.mp4|vertical\.mp4|tiktok\.mp4|mp4|parte-\d+\.mp4|portada-ig(?:-\d+)?\.jpg|portada-short\.jpg|tapa-ig(?:-\d+)?\.jpg|miniatura\.jpg)$/.exec(basename(nombre));
  if (!m || !existsSync(join('src/videos', m[1], 'guion.json'))) return;
  const v = viejos(m[1]);
  if (v.length) throw new Error(`${nombre}: no se sube/publica; el guion de ${m[1]} tiene ${v.length} claves viejas con diseño nuevo, p. ej. ${v[0]}`);
}
/** Baja un asset del release a `destino`. false si no está. */
export function bajar(nombre, destino) {
  guardaLegacy(nombre);
  mkdirSync(dirname(destino), { recursive: true });
  const tmp = `${destino}.bajando`;
  try { execFileSync('curl', ['-fsSL', '--retry', '3', '-o', tmp, urlAsset(nombre)], { stdio: 'ignore' }); renameSync(tmp, destino); return true; }
  catch { rmSync(tmp, { force: true }); return false; }
}
export function hayAsset(nombre) {
  try { execFileSync('curl', ['-fsIL', '--retry', '2', '-o', '/dev/null', urlAsset(nombre)], { stdio: 'ignore' }); return true; } catch { return false; }
}
/** Sube (o reemplaza) un archivo como asset del release y devuelve su URL pública. */
export function subirAsset(ruta, nombre) {
  guardaLegacy(nombre);
  const dir = mkdtempSync(join(tmpdir(), 'media-')), f = join(dir, nombre);
  copyFileSync(ruta, f);
  try { execFileSync('gh', ['release', 'upload', RELEASE, f, '--clobber', '-R', REPO], { stdio: ['ignore', 'ignore', 'inherit'] }); }
  finally { rmSync(dir, { recursive: true, force: true }); }
  console.log(`  ↑ release: ${nombre}`);
  return urlAsset(nombre);
}
/** URL pública de un archivo: si el release ya lo tiene se usa ese; si no, se sube. Espera a que responda. */
export function publicarUrl(ruta, nombre) {
  if (!hayAsset(nombre)) subirAsset(ruta, nombre);
  for (let i = 0; i < 40 && !hayAsset(nombre); i++) execFileSync('sleep', ['5']); // un asset recién subido puede tardar ~1–3 min en servirse
  if (!hayAsset(nombre)) throw new Error(`el release no sirve ${nombre}`);
  return urlAsset(nombre);
}

// ── asegurar: dejar el archivo en out/ (bajado del release o renderizado acá y subido)
const correr = (script, id, ...extra) => execFileSync('node', [script, id, ...extra], { stdio: ['ignore', 'inherit', 'inherit'] });
/** ¿Ya hay partes de este episodio publicadas en Instagram? (entonces se termina con las mismas partes) */
const empezadoIG = (id) => leerJSON('out/subidas-instagram.json', []).some((h) => h.tipo === 'reel-parte' && h.id === id);
/** Partes que sirven: ritmo normal, el cartel del título actual y la huella del guion actual (elenco oficial), o
 *  cualquiera si el episodio ya empezó a publicarse con ellas. Sin huella (partes de antes) vale lo demás. */
export const partesVigentes = (partes, empezado, gancho, h) => Boolean(partes) && (empezado || (partes.ritmo !== 'rapido'
  && (gancho === undefined || partes.gancho === gancho) && (h === undefined || partes.huella === h)));
// vertical-partes.mjs le pasa a cada parte su cartel gancho (título del capítulo, de titulos.json) por inputProps
function renderPartes(id) {
  bajar(nombreAsset(id, 'portada-ig'), rutaLocal(id, 'portada-ig')); // misma portada que la Mac, si está
  correr('scripts/vertical-partes.mjs', id); // ritmo normal (--rapido apagado por defecto)
  const { de } = JSON.parse(readFileSync(rutaLocal(id, 'partes'), 'utf8'));
  for (let n = 1; n <= de; n++) subirAsset(rutaLocal(id, 'parte', n), nombreAsset(id, 'parte', n));
  subirAsset(rutaLocal(id, 'portada-ig'), nombreAsset(id, 'portada-ig'));
  subirAsset(rutaLocal(id, 'partes'), nombreAsset(id, 'partes')); // al final: marca que el juego de partes está completo
}
const RENDER = {
  short: (id) => correr('scripts/short-render.mjs', id),
  partes: renderPartes,
  parte: renderPartes,
  vertical: (id) => correr('scripts/vertical-render.mjs', id),
  'portada-ig': (id) => correr('scripts/portadas-ig.mjs', id),
  'portada-ig-parte': (id, n) => correr('scripts/portadas-ig.mjs', id, `--parte=${n}`),
  'portada-short': (id) => correr('scripts/portadas-short.mjs', id),
  miniatura: (id) => correr('scripts/miniaturas.mjs', id),
};
/** Devuelve la ruta local del archivo, o null si no se pudo conseguir. */
export function asegurar(id, c, n) {
  const ruta = rutaLocal(id, c, n);
  if (existsSync(ruta) || bajar(nombreAsset(id, c, n), ruta)) {
    // partes con otro ritmo, título o guion (y episodio sin empezar en Instagram): se rehacen y reemplazan en el release
    if (c !== 'partes' || partesVigentes(leerJSON(ruta, null), empezadoIG(id), ganchoParte(id), huella(id))) return ruta;
    console.log(`  partes viejas (otro ritmo, título o guion) de ${id}: se rehacen`);
    rmSync(ruta, { force: true });
    for (let k = 1; k <= 12; k++) rmSync(rutaLocal(id, 'parte', k), { force: true });
  }
  if (!RENDER[c]) return null;
  console.log(`  render en la nube: ${id} (${c})`);
  RENDER[c](id, n);
  if (c !== 'parte' && c !== 'partes' && c !== 'vertical') subirAsset(ruta, nombreAsset(id, c, n));
  return existsSync(ruta) ? ruta : null;
}
const EPISODIO = ['horizontal', 'srt-en', 'srt-es', 'miniatura'];
/** Trae del último artefacto vigente de render-nube (`<id>-horizontal`) los archivos que falten. */
function desdeArtefacto(id, clases) {
  const nombre = `${id}-horizontal`;
  let a;
  try {
    a = JSON.parse(execFileSync('gh', ['api', `repos/${REPO}/actions/artifacts?name=${nombre}&per_page=30`], { encoding: 'utf8' })).artifacts
      .filter((x) => !x.expired).sort((x, y) => y.created_at.localeCompare(x.created_at))[0];
  } catch { return false; }
  if (!a) return false;
  const dir = mkdtempSync(join(tmpdir(), 'art-'));
  try {
    execFileSync('gh', ['run', 'download', String(a.workflow_run.id), '-n', nombre, '-D', dir, '-R', REPO], { stdio: ['ignore', 'ignore', 'inherit'] });
    const archivos = readdirSync(dir, { recursive: true }).map(String);
    for (const c of clases) {
      const f = archivos.find((x) => basename(x) === basename(rutaLocal(id, c)));
      if (f) { mkdirSync(dirname(rutaLocal(id, c)), { recursive: true }); copyFileSync(join(dir, f), rutaLocal(id, c)); }
    }
    console.log(`  artefacto ${nombre} (corrida ${a.workflow_run.id})`);
    return true;
  } catch { return false; } finally { rmSync(dir, { recursive: true, force: true }); }
}
/** Episodio largo en out/: release → artefacto de render-nube → render acá (si `render`). Lo nuevo se sube al release. */
/** Con gancho (guion.youtube.gancho): el horizontal y sus subtítulos sirven solo si son de la huella actual del guion; si no,
 *  se tiran y se renderizan de nuevo (los pre-renders de antes del gancho no lo tienen). Sin gancho: como siempre. */
// La Biblia no: sus horizontales los hace su sesión ya con gancho.
const conGancho = (id) => !esBiblia(id) && Boolean(existsSync(join('src/videos', id, 'guion.json')) && guion(id).youtube?.gancho);
export function horizontalVigente(id) {
  if (!conGancho(id)) return true;
  const meta = rutaLocal(id, 'horizontal-meta');
  if (!existsSync(meta)) bajar(nombreAsset(id, 'horizontal-meta'), meta);
  return leerJSON(meta, {}).huella === huella(id);
}
export function asegurarEpisodio(id, { render = true } = {}) {
  if (!horizontalVigente(id)) {
    console.log(`  ${id}: horizontal de un guion viejo (sin gancho): se renderiza de nuevo`);
    for (const c of ['horizontal', 'srt-en', 'srt-es', 'horizontal-meta']) rmSync(rutaLocal(id, c), { force: true });
    if (!render) return false;
    mkdirSync(join('out', id), { recursive: true });
    correr('scripts/motor-render.mjs', id, '--imagen=en', '--audio=en');
    if (!existsSync(rutaLocal(id, 'miniatura'))) correr('scripts/miniaturas.mjs', id);
    writeFileSync(rutaLocal(id, 'horizontal-meta'), JSON.stringify({ huella: huella(id) }));
    for (const c of [...EPISODIO, 'horizontal-meta']) if (existsSync(rutaLocal(id, c))) subirAsset(rutaLocal(id, c), nombreAsset(id, c));
    return existsSync(rutaLocal(id, 'horizontal'));
  }
  const faltan = () => EPISODIO.filter((c) => !existsSync(rutaLocal(id, c)));
  let f = EPISODIO.filter((c) => !existsSync(rutaLocal(id, c)) && !bajar(nombreAsset(id, c), rutaLocal(id, c)));
  const subirNuevos = (antes) => { for (const c of antes) if (existsSync(rutaLocal(id, c))) subirAsset(rutaLocal(id, c), nombreAsset(id, c)); };
  if (f.length && desdeArtefacto(id, f)) { subirNuevos(f); f = faltan(); }
  if (render && (f.includes('horizontal') || f.includes('miniatura'))) {
    console.log(`  render en la nube: ${id} (horizontal)`);
    if (!existsSync(rutaLocal(id, 'horizontal'))) correr('scripts/motor-render.mjs', id, '--imagen=en', '--audio=en');
    if (!existsSync(rutaLocal(id, 'miniatura'))) correr('scripts/miniaturas.mjs', id);
    if (conGancho(id)) { writeFileSync(rutaLocal(id, 'horizontal-meta'), JSON.stringify({ huella: huella(id) })); f.push('horizontal-meta'); }
    subirNuevos(f); f = faltan();
  }
  return existsSync(rutaLocal(id, 'horizontal'));
}

// ── datos de la cola
const leerJSON = (f, def) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : def);
const guion = (id) => JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
/** ¿Tiene versión horizontal 16:9? (Short "Who is…?" con `quien`: scripts/quien-horizontal.mjs) */
const conHorizontal = (id) => esShort(id) && existsSync(join('src/videos', id, 'guion.json')) && guion(id).formato === 'short' && Boolean(guion(id).quien);
export const COLA = 'out/cola-unificada.json', SHORTS_ORDEN = 'out/shorts-orden.txt', RITMO_TK = 'out/tiktok-ritmo.json';
const IDS = 'src/videos/youtube-ids.json', API = 'out/subidas-api.json', IG = 'out/subidas-instagram.json', BUF = 'out/subidas-buffer.json';
/** Listo para publicar: narrado (guion + timeline) y, si es episodio, con título en titulos.json. */
/** Biblia: además, la marca VERIFICADO que deja su sesión cuando el capítulo está revisado (no sale nada a medio hacer). */
const listoCon = (titulos) => (id) => ['guion.json', 'timeline.json'].every((f) => existsSync(join('src/videos', id, f))) && (!esBiblia(id) || verificadoVigente(id)) && (esShort(id) || Boolean(titulos[id]?.titulo));
/** VERIFICADO guarda la huella del guion+timeline revisados (scripts/verificado.mjs): si el guion cambió después, no vale. */
export const verificadoVigente = (id) => { const f = join('src/videos', id, 'VERIFICADO'); return existsSync(f) && readFileSync(f, 'utf8').trim() === huella(id); };
/** "Who is…?" en orden: los del orden de Shorts de la rama estado, después las carpetas nuevas. */
const quienes = () => [...leerLista(SHORTS_ORDEN), ...readdirSync('src/videos').sort()].filter(esQuien);
function datos() {
  const titulos = leerJSON('src/videos/titulos.json', {}), ytIds = leerJSON(IDS, {});
  const api = leerJSON(API, []), igH = leerJSON(IG, []), buf = leerJSON(BUF, []);
  const cola = leerJSON(COLA, null) ?? construirCola({ titulos, ytIds, quien: quienes() });
  const tiene = { youtube: tieneYouTube(ytIds, api), instagram: tieneInstagram(igH), tiktok: tieneTiktok(buf) };
  return { titulos, ytIds, api, igH, buf, cola, tiene, listo: listoCon(titulos) };
}
function actualizar() {
  const titulos = leerJSON('src/videos/titulos.json', {}), ytIds = leerJSON(IDS, {});
  const antes = leerJSON(COLA, []), cola = actualizarCola(antes, construirCola({ titulos, ytIds, quien: quienes() }));
  mkdirSync('out', { recursive: true }); writeFileSync(COLA, JSON.stringify(cola, null, 1));
  console.log(`cola única: ${cola.length} ítems (${cola.length - antes.length} nuevos)`);
}
/** Partes que le faltan a un episodio en Instagram (registro → partes.json local → estimado por la duración). */
function partesFaltanIG(id, igH) {
  const de = igH.find((h) => h.tipo === 'reel-parte' && h.id === id && h.de)?.de ?? leerJSON(rutaLocal(id, 'partes'), null)?.de
    ?? partesEstimadas(leerJSON(join('src/videos', id, 'timeline.json'), null));
  return Math.max(0, de - partesHechasIG(igH, id).size);
}
/** TikTok frenado (rechazó por límite): 2 por turno durante 24 h; después se vuelve a probar con 4. */
export const tiktokFrenado = (ritmo, ahora = Date.now()) => Boolean(ritmo?.max && ritmo.desde && ahora - Date.parse(ritmo.desde) < 864e5);
/** TikTok pidió esperar 24 h: en ese lapso no se intenta nada (reintentar alarga el bloqueo y el turno falla). */
export const tiktokEnPausa = (ritmo, ahora = Date.now()) => Boolean(ritmo?.pausa && ritmo.desde && ahora - Date.parse(ritmo.desde) < 864e5);
const envF = () => Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));

/** Plan de una plataforma en este turno, ya recortado por sus topes (24 h y, en TikTok, la cola de Buffer). */
function planDe(p, d, f = fechaTurno()) {
  const c = clase(turnoUTC(f)), ahora = Date.now();
  const max = p === 'tiktok' && tiktokFrenado(leerJSON(RITMO_TK, null), ahora) ? MAX_TIKTOK_FRENADO : MAX_ALCANZAR[p];
  const plan = planTurno({ cola: d.cola, tiene: d.tiene, plataforma: p, clase: c, listo: d.listo, inicio: inicioTurno(f), max });
  // YouTube: un "Who is…?" cuesta 2 (su Short + su horizontal, en el mismo turno)
  const [reg, costo] = { youtube: [d.api, (id) => (conHorizontal(id) ? 2 : 1)], instagram: [d.igH, (id) => (esShort(id) ? 1 : partesFaltanIG(id, d.igH))], tiktok: [d.buf, () => 1] }[p];
  const ids = limitar(plan.ids, costo, usadas24h(reg, ahora), TOPE_24H[p]);
  if (ids.length < plan.ids.length) console.log(`${p}: tope de ${TOPE_24H[p]} en 24 h → ${ids.length} de ${plan.ids.length}`);
  return { ...plan, clase: c, max, ids };
}

// ── publicar un ítem
const MINIS = 'out/miniaturas-youtube.json';
function reintentarMiniaturas() {
  const reg = leerJSON(MINIS, []);
  for (const p of miniaturasPendientes(reg)) {
    const ruta = asegurar(p.id, 'miniatura');
    const r = ruta ? spawnSync('node', ['scripts/youtube-api.mjs', 'miniatura', p.video, ruta], { encoding: 'utf8' }) : { status: 1, stderr: 'sin miniatura' };
    if (r.status === 0) { reg.push({ id: p.id, video: p.video, estado: 'ok', fecha: new Date().toISOString() }); writeFileSync(MINIS, JSON.stringify(reg, null, 1)); console.log(`miniatura puesta: ${p.id}`); }
    else console.log(`miniatura de ${p.id} sigue pendiente: ${String(r.stderr).match(/\d{3} .{0,160}|sin miniatura/)?.[0] ?? 'error'}`);
  }
}
const errorYT = (id, salida) => new Error(`YouTube ${id}: ${salida.match(/uploadLimitExceeded|quotaExceeded|Error: .{0,160}/)?.[0] ?? salida.trim().slice(-300)}`);
/** "Who is…?" a YouTube como Short (duplicados por título contra el canal). */
function shortYT(id) {
  const hist = leerJSON(API, []), ids = leerJSON(IDS, {});
  const listado = execFileSync('node', ['scripts/youtube-api.mjs', 'videos'], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const previo = buscarTitulo(listado, tituloShortYT(guion(id)));
  if (previo) {
    hist.push({ id, short: 'nativo', video: previo, cuando: 'ya', fecha: new Date().toISOString(), nota: 'ya estaba en el canal' });
    writeFileSync(API, JSON.stringify(hist, null, 1)); ids[id] = previo; writeFileSync(IDS, JSON.stringify(ids, null, 2));
    return console.log(`YouTube: ${id} ya estaba: https://youtu.be/${previo}`);
  }
  if (!asegurar(id, 'short')) throw new Error(`no hay video de ${id}`);
  const r = spawnSync('node', ['scripts/subir.mjs', id, '--api'], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const salida = `${r.stdout}\n${r.stderr}`, subido = salida.match(/subido: \S+/)?.[0];
  if (r.status !== 0 || !subido) throw errorYT(id, salida);
  console.log(`YouTube: ${id} ${subido}`);
}
/** Episodio largo con subir.mjs --api: duplicados por título, anota aunque se corte después de subir, y deja la
 *  miniatura pendiente si YouTube no la aceptó. Título = el de titulos.json (el escrito en el video). */
function episodioYT(id, titulo, extra = []) {
  const anotar = (video, nota) => {
    const ids = leerJSON(IDS, {}), hist = leerJSON(API, []);
    if (ids[id] !== video) { ids[id] = video; writeFileSync(IDS, JSON.stringify(ids, null, 2)); }
    if (!hist.some((h) => h.id === id && h.video === video)) { hist.push({ id, short: null, video, cuando: 'ya', fecha: new Date().toISOString(), ...(nota ? { nota } : {}) }); writeFileSync(API, JSON.stringify(hist, null, 1)); }
  };
  const listado = execFileSync('node', ['scripts/youtube-api.mjs', 'videos'], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const previo = buscarTitulo(listado, titulo);
  if (previo) { anotar(previo, 'ya estaba en el canal'); return console.log(`YouTube: ${id} ya estaba: https://youtu.be/${previo}`); }
  if (!asegurarEpisodio(id)) throw new Error(`no hay video de ${id}`);
  const r = spawnSync('node', ['scripts/subir.mjs', id, '--api', ...extra], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const salida = `${r.stdout}\n${r.stderr}`;
  const video = salida.match(/subido: https:\/\/youtu\.be\/(\S+)/)?.[1];
  if (video) {
    anotar(video);
    if (!/miniatura ok/.test(salida)) {
      const m = leerJSON(MINIS, []); m.push({ id, video, estado: 'pendiente', fecha: new Date().toISOString() }); writeFileSync(MINIS, JSON.stringify(m, null, 1));
      console.log(`miniatura pendiente: ${id} (se reintenta en las próximas corridas)`);
    }
  }
  if (r.status !== 0 || !video) throw errorYT(id, salida);
  console.log(`YouTube: ${id} https://youtu.be/${video}`);
}
/** Id de la lista "<Mitología>: Who's Who": la de listas.json o, la primera vez (justo antes de subir el primer video),
 *  la crea en YouTube (youtube-api.mjs lista crea o encuentra por título) y la guarda en listas.json (rama estado). */
function listaQuienId(serie) {
  const f = 'src/videos/listas.json', listas = leerJSON(f, {}), nombre = listaQuien(serie);
  if (listas[nombre]) return listas[nombre];
  const desc = `Who's who in ${mitologiaEn(serie)}: one god or hero per video, explained simply. By Myths on Clay.`;
  const id = execFileSync('node', ['scripts/youtube-api.mjs', 'lista', nombre, desc], { encoding: 'utf8' }).trim().split('\n').pop().trim();
  if (!/^PL[\w-]+$/.test(id)) throw new Error(`no se pudo crear la lista "${nombre}": ${id.slice(0, 200)}`);
  writeFileSync(f, JSON.stringify({ ...leerJSON(f, {}), [nombre]: id }, null, 1));
  console.log(`lista nueva: ${nombre} → ${id}`);
  return id;
}
/** Versión horizontal de un "Who is…?" (video normal, a su lista), mismo turno que su Short: duplicados por título,
 *  anota aunque se corte después de subir y deja la miniatura pendiente si YouTube no la aceptó. */
function horizontalYT(id) {
  const g = guion(id), clave = claveHorizontal(id), titulo = tituloQuienHorizontal(g);
  const anotar = (video, nota) => {
    const ids = leerJSON(IDS, {}), hist = leerJSON(API, []);
    if (ids[clave] !== video) { ids[clave] = video; writeFileSync(IDS, JSON.stringify(ids, null, 2)); }
    if (!hist.some((h) => h.id === clave && h.video === video)) { hist.push({ id: clave, short: 'horizontal', video, cuando: 'ya', fecha: new Date().toISOString(), ...(nota ? { nota } : {}) }); writeFileSync(API, JSON.stringify(hist, null, 1)); }
  };
  const listado = execFileSync('node', ['scripts/youtube-api.mjs', 'videos'], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const previo = buscarTitulo(listado, titulo);
  if (previo) { anotar(previo, 'ya estaba en el canal'); return console.log(`YouTube: ${clave} ya estaba: https://youtu.be/${previo}`); }
  if (!asegurarEpisodio(id)) throw new Error(`no hay video horizontal de ${id}`);
  const lista = listaQuienId(g.serie);
  const r = spawnSync('node', ['scripts/subir.mjs', id, '--api', '--horizontal', `--lista=${lista}`], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const salida = `${r.stdout}\n${r.stderr}`, video = salida.match(/subido: https:\/\/youtu\.be\/(\S+)/)?.[1];
  if (video) {
    anotar(video);
    if (!/miniatura ok/.test(salida)) {
      const m = leerJSON(MINIS, []); m.push({ id, video, estado: 'pendiente', fecha: new Date().toISOString() }); writeFileSync(MINIS, JSON.stringify(m, null, 1));
      console.log(`miniatura pendiente: ${clave} (se reintenta en las próximas corridas)`);
    }
  }
  if (r.status !== 0 || !video) throw errorYT(clave, salida);
  console.log(`YouTube: ${clave} https://youtu.be/${video}`);
}
/** Corre un script de Instagram: primero --probar (prepara los archivos), después publica con 3 intentos (no duplica). */
function correrIG(args, etiqueta) {
  const prep = spawnSync('node', [...args, '--probar'], { encoding: 'utf8', maxBuffer: 1 << 24, stdio: ['ignore', 'pipe', 'inherit'] });
  if (prep.status !== 0) throw new Error(`Instagram ${etiqueta}: no se pudo preparar el video`);
  for (let intento = 1; intento <= 3; intento++) {
    const r = spawnSync('node', args, { encoding: 'utf8', timeout: 1500e3, maxBuffer: 1 << 24 });
    const salida = `${r.stdout ?? ''}\n${r.stderr ?? ''}`;
    const linea = salida.split('\n').find((l) => /publicado|ya estaba|esperando|nada pendiente|ya hay una cola/.test(l));
    console.log(`Instagram ${etiqueta} intento ${intento}: ${linea ?? (salida.split('\n').filter((l) => /Error|error:/.test(l)).slice(0, 3).join(' | ') || salida.trim().slice(-400))}`);
    if (r.status === 0 && linea && !/esperando|ya hay una cola/.test(linea)) return;
    if (intento < 3) execFileSync('sleep', ['300']);
  }
  throw new Error(`Instagram ${etiqueta}: no se pudo publicar`);
}
function itemIG(id) {
  if (esShort(id)) {
    const lista = join('out', `.lista-${id}.txt`); mkdirSync('out', { recursive: true }); writeFileSync(lista, `${id}\n`);
    try { correrIG(['scripts/instagram-shorts.mjs', lista], id); } finally { rmSync(lista, { force: true }); }
    return;
  }
  // episodio: TODAS sus partes en este turno, en orden (instagram-reels.mjs publica la próxima que falta)
  for (let i = 0; i < 12 && partesFaltanIG(id, leerJSON(IG, [])) > 0; i++) {
    const antes = partesHechasIG(leerJSON(IG, []), id).size;
    correrIG(['scripts/instagram-reels.mjs', `--solo=${id}`], `${id}`);
    if (partesHechasIG(leerJSON(IG, []), id).size <= antes) throw new Error(`Instagram ${id}: la parte no quedó anotada`);
  }
}

/** "Who is…?" horizontal de este turno de YouTube (o null). Si no viene con su Short en el plan, es un reintento y tiene
 *  que entrar en el tope de 24 h además de lo del plan. */
function horizontalDe(d, plan) {
  const id = horizontalTurno({ cola: d.cola, tieneYT: d.tiene.youtube, ytIds: d.ytIds, ids: plan.ids, clase: plan.clase, conHorizontal });
  if (!id || plan.ids.includes(id)) return id;
  const usados = usadas24h(d.api, Date.now()) + plan.ids.reduce((n, x) => n + (conHorizontal(x) ? 2 : 1), 0);
  return usados + 1 <= TOPE_24H.youtube ? id : null;
}

// ── un turno de una plataforma
async function turno(p, probar = false) {
  if (!PLATAFORMAS.includes(p)) throw new Error(`plataforma desconocida: ${p}`);
  if (p === 'youtube' && !probar) reintentarMiniaturas();
  await unaVez(`cola-${p}`, async () => { // clave propia: no choca con los pasos del calendario viejo
    const d = datos(), plan = planDe(p, d);
    const hz = p === 'youtube' ? horizontalDe(d, plan) : null;
    console.log(`${p} · turno ${plan.clase} · ${plan.parejo ? 'parejo' : `alcanzando (punteros ${JSON.stringify(plan.punteros)}, va adelante: ${plan.lider})`} · toca: ${plan.ids.join(' ') || 'nada'}${hz ? ` · horizontal: ${hz}` : ''}`);
    if (probar || (!plan.ids.length && !hz)) return;
    if (p === 'youtube') {
      const listas = leerJSON('src/videos/listas.json', {});
      for (const id of plan.ids) esShort(id) ? shortYT(id) : episodioYT(id, d.titulos[id].titulo, extraYT(d.titulos[id], listas));
      if (hz) horizontalYT(hz); // el mismo turno (y día) que su Short
    } else if (p === 'instagram') for (const id of plan.ids) itemIG(id);
    else {
      if (tiktokEnPausa(leerJSON(RITMO_TK, null))) return console.log('TikTok: en pausa 24 h (lo pidió TikTok); no se publica en este turno');
      const { publicarTiktok, enCola } = await import('./buffer-tiktok.mjs');
      const { cliente, esEspera } = await import('./buffer.mjs');
      const env = envF(), n = await enCola(cliente(env.BUFFER_API_KEY));
      if (n >= TOPE_COLA_BUFFER) return console.log(`TikTok: la cola de Buffer está llena (${n}); no se publica en este turno`);
      for (const id of plan.ids) {
        try { await publicarTiktok(id, { env, rel: yo }); }
        catch (e) {
          if (!e.limite) throw e;
          writeFileSync(RITMO_TK, JSON.stringify({ max: MAX_TIKTOK_FRENADO, ...(esEspera(e.message) ? { pausa: true } : {}), desde: new Date().toISOString(), motivo: String(e.message).slice(0, 300) }));
          return console.log(`TikTok: frenado por la plataforma (${String(e.message).slice(0, 160)}): ${MAX_TIKTOK_FRENADO} por turno durante 24 h`);
        }
      }
    }
  }, probar);
}

// ── una vez por turno
const TURNOS = 'out/turnos.json';
async function unaVez(paso, fn, probar = false) {
  const clave = claveTurno(fechaTurno(), paso);
  if (!probar && leerJSON(TURNOS, []).includes(clave)) return console.log(`${paso}: ya hecho en este turno (${clave})`);
  await fn();
  if (probar) return;
  const h = leerJSON(TURNOS, []); if (!h.includes(clave)) { h.push(clave); writeFileSync(TURNOS, JSON.stringify(h, null, 1)); }
}

/** Lo que le falta a cada plataforma, en el orden en que lo va a publicar (para adelantar renders). */
function proximos(d, p, n) {
  const { eps } = estadoCola({ cola: d.cola, tiene: d.tiene, listo: d.listo });
  const q = d.cola.filter((e) => e.tipo === 'short' && d.listo(e.id) && !d.tiene[p].has(e.id)).slice(0, 2).map((e) => e.id);
  return [...q, ...eps.filter((e) => !d.tiene[p].has(e.id)).slice(0, n).map((e) => e.id)];
}
/** Deja en el release lo que van a usar los próximos turnos (Shorts, partes de IG, verticales de TikTok, horizontales). */
async function adelantar(minutos = 150) {
  const d = datos(), hasta = Date.now() + minutos * 60e3;
  const { prepararTiktok } = await import('./buffer-tiktok.mjs');
  const tareas = [
    ...proximos(d, 'instagram', 4).map((id) => () => (esShort(id) ? asegurar(id, 'short') : asegurar(id, 'partes'))),
    ...proximos(d, 'tiktok', 4).map((id) => () => prepararTiktok(id, yo)),
    ...proximos(d, 'youtube', 2).map((id) => () => (esShort(id) ? asegurar(id, 'short') : asegurarEpisodio(id, { render: false }))),
    // "Who is…?" horizontal (~1 min de video): se renderiza acá si no está, así el turno solo sube
    ...proximos(d, 'youtube', 0).filter((id) => conHorizontal(id) && !d.ytIds[claveHorizontal(id)]).map((id) => () => asegurarEpisodio(id)),
  ];
  for (const t of tareas) {
    if (Date.now() > hasta) { console.log('adelantar: se acabó el tiempo; sigue en la próxima corrida'); break; }
    try { await t(); } catch (e) { console.log(`adelantar: ${String(e.message).slice(0, 200)}`); }
  }
}

/** Mac: sube al release lo ya renderizado de lo próximo de cada plataforma, para que la nube no lo tenga que renderizar. */
function sembrar(max) {
  const d = datos();
  const subir = (id, c, n) => { const r = rutaLocal(id, c, n); if (existsSync(r) && !hayAsset(nombreAsset(id, c, n))) subirAsset(r, nombreAsset(id, c, n)); };
  const ids = new Set(PLATAFORMAS.flatMap((p) => proximos(d, p, max)));
  for (const id of ids) {
    if (esShort(id)) {
      subir(id, 'short'); subir(id, 'portada-short'); if (existsSync(`${rutaLocal(id, 'tiktok')}.tapa`)) subir(id, 'tiktok');
      if (conHorizontal(id)) for (const c of ['horizontal', 'srt-en', 'srt-es', 'miniatura']) subir(id, c);
      continue;
    }
    if (leerJSON(rutaLocal(id, 'tiktok-meta'), {}).huella === huella(id)) { subir(id, 'tiktok'); subir(id, 'tiktok-meta'); }
    const partes = leerJSON(rutaLocal(id, 'partes'), null);
    if (!partesVigentes(partes, empezadoIG(id), ganchoParte(id), huella(id))) continue; // que la nube las rehaga
    if (![...Array(partes.de).keys()].every((i) => existsSync(rutaLocal(id, 'parte', i + 1)))) continue;
    for (let n = 1; n <= partes.de; n++) subir(id, 'parte', n);
    subir(id, 'portada-ig'); subir(id, 'partes');
  }
  console.log(`sembrado: ${ids.size} ítems revisados`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.chdir(new URL('..', import.meta.url).pathname);
  const [cmd, ...a] = process.argv.slice(2);
  const pos = a.filter((x) => !x.startsWith('--')), max = Number(a.find((x) => x.startsWith('--max='))?.split('=')[1] ?? 4);
  try {
    if (cmd === 'cola') actualizar();
    else if (cmd === 'plan' || cmd === 'slot') { const d = datos(); for (const p of PLATAFORMAS) { const x = planDe(p, d); console.log(JSON.stringify({ plataforma: p, turno: x.clase, parejo: x.parejo, punteros: x.punteros, toca: x.ids })); } }
    else if (cmd === 'turno') await turno(pos[0], a.includes('--probar'));
    else if (cmd === 'adelantar') await adelantar();
    else if (cmd === 'sembrar') sembrar(max);
    else throw new Error('uso: node scripts/nube.mjs cola|plan|turno <youtube|instagram|tiktok>|adelantar|sembrar');
  } catch (e) {
    const m = String(e.message ?? e);
    // sin cuota diaria de la API de YouTube (se renueva a medianoche del Pacífico ≈ 21:00 HST): no es una falla,
    // el turno queda pendiente y se reintenta en la corrida siguiente (no pone el job en rojo)
    if (/exceeded your[\s\S]{0,80}quota|quotaExceeded/.test(m)) { console.log(`YouTube: sin cuota de la API por hoy (${cmd}); se reintenta en la próxima corrida`); process.exit(0); }
    console.error(m.slice(0, 500)); process.exit(1);
  }
}
