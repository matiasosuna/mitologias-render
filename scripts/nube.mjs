// Publicación desde GitHub Actions (workflow "publicar" del repo público mitologias-render), sin la Mac.
// Los videos y portadas viven como assets del release "media" del repo público; si falta uno, se renderiza en la misma
// corrida y se sube. Sus URL públicas reemplazan al túnel de cloudflared (Instagram) y a la web de Cloudflare (Buffer).
// Uso (con NUBE=1, en Actions):
//   node scripts/nube.mjs slot                     → qué toca en este turno (Shorts YT, episodio YT, Instagram)
//   node scripts/nube.mjs yt <lista>               → el próximo Short de la lista a YouTube (si es turno)
//   node scripts/nube.mjs ig <lista> [ep|short]    → un Reel: episodio (parte) o Short según el turno
//   node scripts/nube.mjs episodio                 → el próximo episodio largo a YouTube (griegas T2, después T1; 18 UTC)
//                                                    + reintenta las miniaturas que quedaron pendientes
//   node scripts/nube.mjs especial                 → el próximo especial, PROGRAMADO (turno de las 22 UTC)
//   node scripts/nube.mjs story                    → la próxima Story griega, PÚBLICA (turno de las 14 UTC)
// Cada paso se hace una sola vez por turno (out/turnos.json en el estado): un segundo cron del mismo turno no repite.
//   node scripts/nube.mjs adelantar <lista>        → deja en el release lo que van a usar los próximos turnos
//   node scripts/nube.mjs sembrar <lista> [--max=4] → (Mac) sube al release lo ya renderizado de lo próximo de cada cola
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, rmSync, copyFileSync, mkdtempSync, readdirSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { join, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';

export const REPO = 'matiasosuna/mitologias-render', RELEASE = 'media';
export const urlAsset = (nombre) => `https://github.com/${REPO}/releases/download/${RELEASE}/${nombre}`;

// ── turnos: cron cada 4 h a las 2, 6, 10, 14, 18 y 22 UTC = 16, 20, 00, 04, 08 y 12 HST (UTC−10)
const HORAS_UTC = [2, 6, 10, 14, 18, 22];
export const SHORTS_YT_UTC = [2, 10, 14, 22]; // 4 Shorts por día
export const EPISODIO_UTC = 18; // 1 episodio largo por día (08 HST)
export const IG_HST = [0, 8, 16]; // 3 Reels por día
/** Fecha del turno: la de creación de la corrida (TURNO_FECHA, la pone el workflow) aunque haya esperado en la cola. */
export const fechaTurno = () => new Date(process.env.TURNO_FECHA || Date.now());
/** Hora UTC del turno al que pertenece una fecha: el último ya empezado (los cron de Actions suelen llegar tarde). */
export const turnoUTC = (fecha) => [...HORAS_UTC].reverse().find((h) => h <= fecha.getUTCHours()) ?? 22;
export const horaHST = (horaUTC) => (horaUTC + 14) % 24;
export const tocaShortYT = (fecha) => SHORTS_YT_UTC.includes(turnoUTC(fecha));
export const tocaEpisodioYT = (fecha) => turnoUTC(fecha) === EPISODIO_UTC;
export const ESPECIAL_UTC = 22; // 1 especial programado por noche
export const tocaEspecialYT = (fecha) => turnoUTC(fecha) === ESPECIAL_UTC;
/** Comienzo (ms UTC) del turno al que pertenece una fecha. */
export function inicioTurno(fecha) {
  const t = turnoUTC(fecha);
  return Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate(), t) - (t > fecha.getUTCHours() ? 864e5 : 0);
}
/** Clave de "este paso ya se hizo en este turno", p. ej. 2026-10-14T18Z|episodio. */
export const claveTurno = (fecha, paso) => `${new Date(inicioTurno(fecha)).toISOString().slice(0, 13)}Z|${paso}`;
/** Instagram: 00, 08 y 16 HST, alternando episodio y Short sin cortar entre días (ep short ep · short ep short · …).
 *  null = no es turno de Instagram. */
export function tipoIG(fecha) {
  const i = IG_HST.indexOf(horaHST(turnoUTC(fecha)));
  if (i < 0) return null;
  const diaHST = Math.floor((inicioTurno(fecha) - 10 * 3600e3) / 864e5);
  return (diaHST * 3 + i) % 2 === 0 ? 'ep' : 'short';
}

// ── nombres de los assets del release y su lugar en out/
const ASSETS = {
  short: [(id) => `${id}.mp4`, (id) => `${id}.mp4`],
  parte: [(id, n) => `${id}.parte-${n}.mp4`, (id, n) => `${id}.parte-${n}.mp4`],
  partes: [(id) => `${id}.partes.json`, () => 'partes.json'],
  tiktok: [(id) => `${id}.tiktok.mp4`, (id) => `${id}.tiktok.mp4`],
  'portada-short': [(id) => `${id}.portada-short.jpg`, () => 'portada-short.jpg'],
  'portada-ig': [(id) => `${id}.portada-ig.jpg`, () => 'portada-ig.jpg'],
  'tapa-ig': [(id) => `${id}.tapa-ig.jpg`, () => 'tapa-ig.jpg'],
  horizontal: [(id) => `${id}.horizontal.mp4`, (id) => `${id}.en.mp4`], // el episodio largo que sube subir.mjs
  'srt-en': [(id) => `${id}.en.srt`, (id) => `${id}.en.srt`],
  'srt-es': [(id) => `${id}.es.srt`, (id) => `${id}.es.srt`],
  miniatura: [(id) => `${id}.miniatura.jpg`, () => 'miniatura.jpg'],
};
const clase = (c) => { if (!ASSETS[c]) throw new Error(`clase de asset desconocida: ${c}`); return ASSETS[c]; };
export const nombreAsset = (id, c, n) => clase(c)[0](id, n);
export const rutaLocal = (id, c, n) => join('out', id, clase(c)[1](id, n));

// ── selección
export const leerLista = (archivo) => readFileSync(archivo, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
/** Próximo Short para YouTube, en orden estricto (como shorts-yt.sh). null = nada pendiente; { id, espera } = todavía no. */
export function proximoShortYT(orden, hist, ids) {
  const id = orden.find((x) => !hist.some((h) => h.id === x && h.short === 'nativo'));
  if (!id) return null;
  if (id === 'short-hawaianas-maui-sol' && !ids['hawaianas-11-el-sol-que-corria']) return { id, espera: 'el episodio hawaiano 11 todavía no está en YouTube' };
  return { id };
}
/** Episodios largos para YouTube, públicos al subir (sin estreno): primero lo que falta de griegas T2 (foco griego,
 *  2026-10-15), después T1 completas en este orden de series. La lista de la temporada la pone youtube-meta.mjs. */
export const SERIES_EPISODIOS = ['hawaianas', 'norteamericanas', 'aztecas', 'hindues', 'maories', 'balinesas'];
export const ORDEN_EPISODIOS = [['griegas', 2], ...SERIES_EPISODIOS.map((s) => [s, 1])];
export function episodiosPendientesYT(titulos, ids, existe = () => true) {
  return ORDEN_EPISODIOS.flatMap(([s, t]) => Object.keys(titulos)
    .filter((id) => id.startsWith(`${s}-`) && titulos[id].temporada === t && !ids[id] && existe(id))
    .sort((a, b) => titulos[a].episodio - titulos[b].episodio || a.localeCompare(b)));
}
export const proximoEpisodioYT = (titulos, ids, existe) => episodiosPendientesYT(titulos, ids, existe)[0] ?? null;
/** Especiales que quedan, en orden, PROGRAMADOS (privados hasta la fecha; hora de Nueva York como en subir.mjs). */
export const ESPECIALES = [
  { id: 'griegas-99-reino-de-hades', fecha: '2026-10-24T10:00:00', lista: 'Lords of the Dead' },
  { id: 'nordicas-99-hel', fecha: '2026-10-26T10:00:00', lista: 'Lords of the Dead' },
  { id: 'egipcias-99-anubis-y-la-duat', fecha: '2026-10-28T10:00:00', lista: 'Lords of the Dead' },
  { id: 'hawaianas-99-milu', fecha: '2026-10-31T10:00:00', lista: 'Lords of the Dead' },
  { id: 'griegas-97-odisea-1', fecha: '2026-11-03T10:00:00', lista: 'The Odyssey' },
  { id: 'griegas-98-odisea-2', fecha: '2026-11-07T10:00:00', lista: 'The Odyssey' },
];
export const proximoEspecialYT = (ids, especiales = ESPECIALES) => especiales.find((e) => !ids[e.id]) ?? null;
/** Stories griegas ("… | Greek Myth Stories Special", COLA-PRODUCCION H01–H10): PÚBLICAS al subir, a la lista
 *  "Greek Myth Stories", 1 por día en su propio turno (14 UTC = 10:00 Nueva York), sin tocar el del episodio. */
export const STORY_UTC = 14;
export const tocaStoryYT = (fecha) => turnoUTC(fecha) === STORY_UTC;
export const STORIES = {
  lista: 'Greek Myth Stories',
  ids: ['griegas-80-perseo-y-medusa', 'griegas-81-teseo-y-el-minotauro', 'griegas-82-persefone-y-la-granada', 'griegas-83-heracles-trabajos-1',
    'griegas-84-dedalo-e-icaro', 'griegas-85-el-rey-midas', 'griegas-86-heracles-trabajos-2', 'griegas-87-aracne', 'griegas-88-jason-y-el-vellocino', 'griegas-89-eco-y-narciso'],
};
export const esStory = (id) => STORIES.ids.includes(id);
/** Próxima Story lista (carpeta + narrada + título), en orden; las que todavía no están no frenan a las siguientes. */
export const proximaStoryYT = (ids, lista = () => true, stories = STORIES.ids) => stories.find((id) => !ids[id] && lista(id)) ?? null;
/** Carpeta con guion y timeline (narrada) y título en titulos.json. */
const storyLista = (titulos) => (id) => Boolean(titulos[id]?.titulo) && ['guion.json', 'timeline.json'].every((f) => existsSync(join('src/videos', id, f)));
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

// ── release
/** Baja un asset del release a `destino`. false si no está. */
export function bajar(nombre, destino) {
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
// vertical-partes.mjs le pasa a cada parte su cartel gancho (título curioso de titulos.json) por inputProps
function renderPartes(id) {
  bajar(nombreAsset(id, 'portada-ig'), rutaLocal(id, 'portada-ig')); // misma portada que la Mac, si está
  correr('scripts/vertical-partes.mjs', id);
  const { de } = JSON.parse(readFileSync(rutaLocal(id, 'partes'), 'utf8'));
  for (let n = 1; n <= de; n++) subirAsset(rutaLocal(id, 'parte', n), nombreAsset(id, 'parte', n));
  subirAsset(rutaLocal(id, 'portada-ig'), nombreAsset(id, 'portada-ig'));
  subirAsset(rutaLocal(id, 'partes'), nombreAsset(id, 'partes')); // al final: marca que el juego de partes está completo
}
const RENDER = {
  short: (id) => correr('scripts/short-render.mjs', id),
  partes: renderPartes,
  parte: renderPartes,
  'portada-ig': (id) => correr('scripts/portadas-ig.mjs', id),
  'portada-short': (id) => correr('scripts/portadas-short.mjs', id),
  miniatura: (id) => correr('scripts/miniaturas.mjs', id),
};
/** Devuelve la ruta local del archivo, o null si no se pudo conseguir. */
export function asegurar(id, c, n) {
  const ruta = rutaLocal(id, c, n);
  if (existsSync(ruta) || bajar(nombreAsset(id, c, n), ruta)) return ruta;
  if (!RENDER[c]) return null;
  console.log(`  render en la nube: ${id} (${c})`);
  RENDER[c](id);
  if (c !== 'parte' && c !== 'partes') subirAsset(ruta, nombreAsset(id, c, n));
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
export function asegurarEpisodio(id, { render = true } = {}) {
  const faltan = () => EPISODIO.filter((c) => !existsSync(rutaLocal(id, c)));
  let f = EPISODIO.filter((c) => !existsSync(rutaLocal(id, c)) && !bajar(nombreAsset(id, c), rutaLocal(id, c)));
  const subirNuevos = (antes) => { for (const c of antes) if (existsSync(rutaLocal(id, c))) subirAsset(rutaLocal(id, c), nombreAsset(id, c)); };
  if (f.length && desdeArtefacto(id, f)) { subirNuevos(f); f = faltan(); }
  if (render && (f.includes('horizontal') || f.includes('miniatura'))) {
    console.log(`  render en la nube: ${id} (horizontal)`);
    if (!existsSync(rutaLocal(id, 'horizontal'))) correr('scripts/motor-render.mjs', id, '--imagen=en', '--audio=en');
    if (!existsSync(rutaLocal(id, 'miniatura'))) correr('scripts/miniaturas.mjs', id);
    subirNuevos(f); f = faltan();
  }
  return existsSync(rutaLocal(id, 'horizontal'));
}
/** Para Buffer: el mp4 de TikTok (con tapa) del release, o el Short para armarlo. */
export function asegurarTiktok(id) {
  const tk = rutaLocal(id, 'tiktok');
  if (bajar(nombreAsset(id, 'tiktok'), tk)) { writeFileSync(`${tk}.tapa`, ''); return true; }
  return Boolean(asegurar(id, 'short'));
}

// ── comandos
const leerJSON = (f, def) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : def);
const guion = (id) => JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));

function yt(lista) {
  if (!tocaShortYT(fechaTurno())) return console.log('YouTube Shorts: no es turno');
  const reg = 'out/subidas-api.json', idsF = 'src/videos/youtube-ids.json';
  const hist = leerJSON(reg, []), ids = leerJSON(idsF, {});
  const p = proximoShortYT(leerLista(lista), hist, ids);
  if (!p) return console.log('YouTube: nada pendiente');
  if (p.espera) return console.log(`YouTube: ${p.id} espera (${p.espera})`);
  // control de duplicados contra el canal, por título (como Instagram con la 1.ª línea del texto)
  const listado = execFileSync('node', ['scripts/youtube-api.mjs', 'videos'], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const previo = buscarTitulo(listado, tituloShortYT(guion(p.id)));
  if (previo) {
    hist.push({ id: p.id, short: 'nativo', video: previo, cuando: 'ya', fecha: new Date().toISOString(), nota: 'ya estaba en el canal' });
    writeFileSync(reg, JSON.stringify(hist, null, 1));
    ids[p.id] = previo; writeFileSync(idsF, JSON.stringify(ids, null, 2));
    return console.log(`YouTube: ${p.id} ya estaba: https://youtu.be/${previo}`);
  }
  if (!asegurar(p.id, 'short')) throw new Error(`no hay video de ${p.id}`);
  const r = spawnSync('node', ['scripts/subir.mjs', p.id, '--api'], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const salida = `${r.stdout}\n${r.stderr}`;
  const subido = salida.match(/subido: \S+/)?.[0];
  if (r.status !== 0 || !subido) throw new Error(`YouTube ${p.id}: ${salida.match(/uploadLimitExceeded|quotaExceeded|Error: .{0,160}/)?.[0] ?? salida.trim().slice(-300)}`);
  console.log(`YouTube: ${p.id} ${subido}`);
}

async function ig(lista, forzado) {
  if (forzado && !['ep', 'short'].includes(forzado)) throw new Error(`turno inválido: ${forzado}`);
  const tipo = forzado || tipoIG(fechaTurno());
  if (!tipo) return console.log('Instagram: no es turno');
  const args = tipo === 'ep' ? ['scripts/instagram-reels.mjs'] : ['scripts/instagram-shorts.mjs', lista];
  // 1) --probar sin límite de tiempo: elige el próximo y deja sus archivos (bajados o renderizados acá). No publica.
  const prep = spawnSync('node', [...args, '--probar'], { encoding: 'utf8', maxBuffer: 1 << 24, stdio: ['ignore', 'pipe', 'inherit'] });
  if (prep.status !== 0) throw new Error(`Instagram [${tipo}]: no se pudo preparar el video`);
  // 2) publicar, con el mismo tope de 25 min que la cola de la Mac
  for (let intento = 1; intento <= 3; intento++) {
    const r = spawnSync('node', args, { encoding: 'utf8', timeout: 1500e3, maxBuffer: 1 << 24 });
    const salida = `${r.stdout ?? ''}\n${r.stderr ?? ''}`;
    const linea = salida.split('\n').find((l) => /publicado|ya estaba|esperando|nada pendiente|ya hay una cola/.test(l));
    console.log(`Instagram [${tipo}] intento ${intento}: ${linea ?? salida.trim().slice(-400)}`);
    if (r.status === 0 && linea) return;
    // los dos scripts revisan el perfil antes de publicar: reintentar no duplica
    if (intento < 3) execFileSync('sleep', ['300']);
  }
  throw new Error('Instagram: no se pudo publicar');
}

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

/** Sube un video largo (episodio o especial) con subir.mjs --api: duplicados por título, anota aunque se corte después
 *  de subir, y deja la miniatura pendiente si YouTube no la aceptó. */
function subirLargo(id, titulo, extra = [], cuando = 'ya') {
  const idsF = 'src/videos/youtube-ids.json', reg = 'out/subidas-api.json';
  const anotar = (video, nota) => {
    const ids = leerJSON(idsF, {}), hist = leerJSON(reg, []);
    if (ids[id] !== video) { ids[id] = video; writeFileSync(idsF, JSON.stringify(ids, null, 2)); }
    if (!hist.some((h) => h.id === id && h.video === video)) { hist.push({ id, short: null, video, cuando, fecha: new Date().toISOString(), ...(nota ? { nota } : {}) }); writeFileSync(reg, JSON.stringify(hist, null, 1)); }
  };
  const listado = execFileSync('node', ['scripts/youtube-api.mjs', 'videos'], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const previo = buscarTitulo(listado, titulo);
  if (previo) { anotar(previo, 'ya estaba en el canal'); return console.log(`YouTube: ${id} ya estaba: https://youtu.be/${previo}`); }
  if (!asegurarEpisodio(id)) throw new Error(`no hay video de ${id}`);
  const r = spawnSync('node', ['scripts/subir.mjs', id, '--api', ...extra], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const salida = `${r.stdout}\n${r.stderr}`;
  const video = salida.match(/subido: https:\/\/youtu\.be\/(\S+)/)?.[1];
  if (video) {
    anotar(video); // subir.mjs ya lo anota si terminó bien; si se cortó después de subir, que no se suba de nuevo
    if (!/miniatura ok/.test(salida)) {
      const m = leerJSON(MINIS, []); m.push({ id, video, estado: 'pendiente', fecha: new Date().toISOString() }); writeFileSync(MINIS, JSON.stringify(m, null, 1));
      console.log(`miniatura pendiente: ${id} (se reintenta en las próximas corridas)`);
    }
  }
  if (r.status !== 0 || !video) throw new Error(`YouTube ${id}: ${salida.match(/uploadLimitExceeded|quotaExceeded|Error: .{0,160}/)?.[0] ?? salida.trim().slice(-300)}`);
  console.log(`YouTube: ${id} https://youtu.be/${video}${cuando !== 'ya' ? ` (programado ${cuando})` : ''}`);
}

function episodio(forzar) {
  reintentarMiniaturas();
  if (!forzar && !tocaEpisodioYT(fechaTurno())) return console.log('YouTube episodio: no es turno');
  const titulos = leerJSON('src/videos/titulos.json', {});
  const id = proximoEpisodioYT(titulos, leerJSON('src/videos/youtube-ids.json', {}), (x) => existsSync(join('src/videos', x, 'guion.json')));
  if (!id) return console.log('YouTube episodio: nada pendiente');
  subirLargo(id, titulos[id].titulo);
}

function especial(forzar) {
  if (!forzar && !tocaEspecialYT(fechaTurno())) return console.log('YouTube especial: no es turno');
  const e = proximoEspecialYT(leerJSON('src/videos/youtube-ids.json', {}));
  if (!e) return console.log('YouTube especial: nada pendiente');
  if (new Date(`${e.fecha}-04:00`) < new Date(Date.now() + 3600e3)) throw new Error(`${e.id}: la fecha ${e.fecha} ya pasó; revisar a mano`);
  const lista = leerJSON('src/videos/listas.json', {})[e.lista];
  if (!lista) throw new Error(`no está la lista "${e.lista}" en listas.json`);
  const titulo = leerJSON('src/videos/titulos.json', {})[e.id]?.titulo;
  if (!titulo) throw new Error(`${e.id} no tiene título en titulos.json`);
  subirLargo(e.id, titulo, [`--programar=${e.fecha}`, `--lista=${lista}`], e.fecha);
}

function story(forzar) {
  if (!forzar && !tocaStoryYT(fechaTurno())) return console.log('YouTube Story: no es turno');
  const titulos = leerJSON('src/videos/titulos.json', {});
  const id = proximaStoryYT(leerJSON('src/videos/youtube-ids.json', {}), storyLista(titulos));
  if (!id) return console.log('YouTube Story: nada lista');
  const lista = leerJSON('src/videos/listas.json', {})[STORIES.lista];
  if (!lista) throw new Error(`no está la lista "${STORIES.lista}" en listas.json`);
  subirLargo(id, titulos[id].titulo, [`--lista=${lista}`]);
}

// ── una vez por turno
const TURNOS = 'out/turnos.json';
/** También cuenta como hecho si los registros muestran una publicación de ese paso desde que empezó el turno
 *  (p. ej. una corrida manual o de antes de out/turnos.json). */
export function hechoPorRegistro(paso, desde, { api = [], instagram = [] } = {}) {
  const desdeAhi = (h) => h.fecha && Date.parse(h.fecha) >= desde;
  if (paso === 'shorts') return api.some((h) => h.short === 'nativo' && desdeAhi(h));
  if (paso === 'episodio') return api.some((h) => h.short == null && h.cuando === 'ya' && !esStory(h.id) && desdeAhi(h));
  if (paso === 'story') return api.some((h) => h.short == null && h.cuando === 'ya' && esStory(h.id) && desdeAhi(h));
  if (paso === 'especial') return api.some((h) => h.short == null && h.cuando && h.cuando !== 'ya' && desdeAhi(h));
  if (paso === 'instagram') return instagram.some(desdeAhi);
  return false;
}
async function unaVez(paso, fn, forzado = false) {
  const clave = claveTurno(fechaTurno(), paso), hechos = leerJSON(TURNOS, []);
  const regs = { api: leerJSON('out/subidas-api.json', []), instagram: leerJSON('out/subidas-instagram.json', []) };
  if (!forzado && (hechos.includes(clave) || hechoPorRegistro(paso, inicioTurno(fechaTurno()), regs))) return console.log(`${paso}: ya hecho en este turno (${clave})`);
  await fn();
  const h = leerJSON(TURNOS, []); if (!h.includes(clave)) { h.push(clave); writeFileSync(TURNOS, JSON.stringify(h, null, 1)); }
}

/** Copia al release los episodios pendientes que están en artefactos de render-nube (vencen a los 7 días). Sin render. */
function guardarArtefactos(max) {
  const titulos = leerJSON('src/videos/titulos.json', {}), ids = leerJSON('src/videos/youtube-ids.json', {});
  const pend = [...episodiosPendientesYT(titulos, ids, (x) => existsSync(join('src/videos', x, 'guion.json'))), ...STORIES.ids.filter((x) => !ids[x] && storyLista(titulos)(x))];
  let n = 0;
  for (const id of pend) {
    if (n >= max) break;
    if (hayAsset(nombreAsset(id, 'horizontal'))) continue;
    if (asegurarEpisodio(id, { render: false })) n++;
    rmSync(join('out', id), { recursive: true, force: true }); // disco del runner
  }
  if (n) console.log(`episodios guardados en el release: ${n}`);
}

function adelantar(lista) {
  const p = proximoShortYT(leerLista(lista), leerJSON('out/subidas-api.json', []), leerJSON('src/videos/youtube-ids.json', {}));
  if (p && !p.espera) asegurar(p.id, 'short');
  // --probar elige el próximo y, con NUBE=1, deja sus archivos en el release (no publica nada)
  for (const a of [['scripts/instagram-shorts.mjs', lista, '--probar'], ['scripts/instagram-reels.mjs', '--probar']]) {
    const r = spawnSync('node', a, { encoding: 'utf8', maxBuffer: 1 << 24, stdio: ['ignore', 'pipe', 'inherit'] });
    console.log(`${a[0]}: ${(r.stdout ?? '').split('\n')[0]}`);
  }
  guardarArtefactos(8);
}

/** Mac: sube al release lo ya renderizado de los próximos `max` de cada cola, para que la nube no tenga que renderizarlo. */
function sembrar(lista, max) {
  const orden = leerLista(lista);
  const api = leerJSON('out/subidas-api.json', []), igH = leerJSON('out/subidas-instagram.json', []), buf = leerJSON('out/subidas-buffer.json', []);
  const shorts = new Set([
    ...orden.filter((d) => !api.some((h) => h.id === d && h.short === 'nativo')).slice(0, max),
    ...orden.filter((d) => !igH.some((h) => h.archivo === join('out', d, `${d}.mp4`))).slice(0, max),
    ...orden.filter((d) => !buf.some((h) => h.id === d)).slice(0, max),
  ]);
  const subir = (id, c, n) => { const r = rutaLocal(id, c, n); if (existsSync(r) && !hayAsset(nombreAsset(id, c, n))) subirAsset(r, nombreAsset(id, c, n)); };
  for (const id of shorts) {
    subir(id, 'short'); subir(id, 'portada-short');
    if (existsSync(`${rutaLocal(id, 'tiktok')}.tapa`)) subir(id, 'tiktok');
  }
  // episodios: los próximos sin terminar (mismo criterio que instagram-reels.mjs, sin mirar youtube-ids: sobra uno, no falta)
  const ORDEN = ['griegas', 'nordicas', 'egipcias', 'hawaianas', 'norteamericanas', 'aztecas', 'balinesas', 'hindues', 'maories'];
  const T1 = { griegas: 7, nordicas: 13, egipcias: 11, hawaianas: 12, norteamericanas: 12, aztecas: 12, balinesas: 12, hindues: 12, maories: 12 };
  const ids = leerJSON('src/videos/youtube-ids.json', {});
  const hechas = (d) => new Set(igH.filter((h) => h.tipo === 'reel-parte' && h.id === d).map((h) => h.parte));
  const terminado = (d) => igH.some((h) => h.id === d && ['reel-episodio', 'reel-apaisado-a-archivar'].includes(h.tipo)) || (existsSync(rutaLocal(d, 'partes')) && hechas(d).size >= JSON.parse(readFileSync(rutaLocal(d, 'partes'), 'utf8')).de);
  const eps = readdirSync('src/videos').filter((d) => /^[a-z]+-\d\d-/.test(d) && ids[d] && Number(d.split('-')[1]) <= (T1[d.split('-')[0]] ?? 0) && !terminado(d))
    .sort((a, b) => ORDEN.indexOf(a.split('-')[0]) - ORDEN.indexOf(b.split('-')[0]) || a.localeCompare(b)).slice(0, max);
  for (const id of eps) {
    if (!existsSync(rutaLocal(id, 'partes'))) continue;
    const { de, gancho } = JSON.parse(readFileSync(rutaLocal(id, 'partes'), 'utf8'));
    if (!gancho) continue; // partes renderizadas antes del cartel gancho: que la nube las rehaga
    if (![...Array(de).keys()].every((i) => existsSync(rutaLocal(id, 'parte', i + 1)))) continue;
    for (let n = 1; n <= de; n++) subir(id, 'parte', n);
    subir(id, 'portada-ig'); subir(id, 'partes');
  }
  console.log(`sembrado: ${shorts.size} Shorts, ${eps.length} episodios revisados`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.chdir(new URL('..', import.meta.url).pathname);
  const [cmd, ...a] = process.argv.slice(2);
  const pos = a.filter((x) => !x.startsWith('--')), max = Number(a.find((x) => x.startsWith('--max='))?.split('=')[1] ?? 4);
  try {
    if (cmd === 'slot') { const f = fechaTurno(); console.log(JSON.stringify({ turnoUTC: turnoUTC(f), shortYT: tocaShortYT(f), episodioYT: tocaEpisodioYT(f), especialYT: tocaEspecialYT(f), storyYT: tocaStoryYT(f), instagram: pos[0] || tipoIG(f) })); }
    else if (cmd === 'episodio') await unaVez('episodio', () => episodio(a.includes('--forzar')), a.includes('--forzar'));
    else if (cmd === 'especial') await unaVez('especial', () => especial(a.includes('--forzar')), a.includes('--forzar'));
    else if (cmd === 'story') await unaVez('story', () => story(a.includes('--forzar')), a.includes('--forzar'));
    else if (cmd === 'yt') await unaVez('shorts', () => yt(pos[0]));
    else if (cmd === 'ig') await unaVez('instagram', () => ig(pos[0], pos[1]), Boolean(pos[1]));
    else if (cmd === 'adelantar') adelantar(pos[0]);
    else if (cmd === 'sembrar') sembrar(pos[0], max);
    else throw new Error('uso: node scripts/nube.mjs slot|yt|ig|episodio|especial|story|adelantar|sembrar <lista>');
  } catch (e) {
    const m = String(e.message ?? e);
    // sin cuota diaria de la API de YouTube (se renueva a medianoche del Pacífico ≈ 21:00 HST): no es una falla,
    // el turno queda pendiente y se reintenta en la corrida siguiente (no pone el job en rojo)
    if (/exceeded your[\s\S]{0,80}quota|quotaExceeded/.test(m)) { console.log(`YouTube: sin cuota de la API por hoy (${cmd}); se reintenta en la próxima corrida`); process.exit(0); }
    console.error(m.slice(0, 500)); process.exit(1);
  }
}
