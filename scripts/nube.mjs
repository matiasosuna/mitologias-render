// Publicación desde GitHub Actions (workflow "publicar" del repo público mitologias-render), sin la Mac.
// Los videos y portadas viven como assets del release "media" del repo público; si falta uno, se renderiza en la misma
// corrida y se sube. Sus URL públicas reemplazan al túnel de cloudflared (Instagram) y a la web de Cloudflare (Buffer).
// Uso (con NUBE=1, en Actions):
//   node scripts/nube.mjs slot [ep|short]          → imprime ep|short según la hora HST del turno
//   node scripts/nube.mjs yt <lista>               → el próximo Short de la lista a YouTube
//   node scripts/nube.mjs ig <lista> [ep|short]    → un Reel: episodio (parte) o Short según el turno
//   node scripts/nube.mjs adelantar <lista>        → deja en el release lo que van a usar los próximos turnos
//   node scripts/nube.mjs sembrar <lista> [--max=4] → (Mac) sube al release lo ya renderizado de lo próximo de cada cola
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, rmSync, copyFileSync, mkdtempSync, readdirSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';

export const REPO = 'matiasosuna/mitologias-render', RELEASE = 'media';
export const urlAsset = (nombre) => `https://github.com/${REPO}/releases/download/${RELEASE}/${nombre}`;

// ── turnos: cron cada 4 h a las 2, 6, 10, 14, 18 y 22 UTC = 16, 20, 00, 04, 08 y 12 HST (UTC−10)
const HORAS_UTC = [2, 6, 10, 14, 18, 22];
/** Hora UTC del turno al que pertenece una fecha: el último ya empezado (los cron de Actions suelen llegar tarde). */
export const turnoUTC = (fecha) => [...HORAS_UTC].reverse().find((h) => h <= fecha.getUTCHours()) ?? 22;
export const horaHST = (horaUTC) => (horaUTC + 14) % 24;
/** Instagram: 00, 08 y 16 HST → episodio; 04, 12 y 20 HST → Short. */
export const tipoTurno = (fecha) => (horaHST(turnoUTC(fecha)) % 8 === 0 ? 'ep' : 'short');

// ── nombres de los assets del release y su lugar en out/
const ASSETS = {
  short: [(id) => `${id}.mp4`, (id) => `${id}.mp4`],
  parte: [(id, n) => `${id}.parte-${n}.mp4`, (id, n) => `${id}.parte-${n}.mp4`],
  partes: [(id) => `${id}.partes.json`, () => 'partes.json'],
  tiktok: [(id) => `${id}.tiktok.mp4`, (id) => `${id}.tiktok.mp4`],
  'portada-short': [(id) => `${id}.portada-short.jpg`, () => 'portada-short.jpg'],
  'portada-ig': [(id) => `${id}.portada-ig.jpg`, () => 'portada-ig.jpg'],
  'tapa-ig': [(id) => `${id}.tapa-ig.jpg`, () => 'tapa-ig.jpg'],
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
  for (let i = 0; i < 10 && !hayAsset(nombre); i++) execFileSync('sleep', ['3']);
  if (!hayAsset(nombre)) throw new Error(`el release no sirve ${nombre}`);
  return urlAsset(nombre);
}

// ── asegurar: dejar el archivo en out/ (bajado del release o renderizado acá y subido)
const correr = (script, id) => execFileSync('node', [script, id], { stdio: ['ignore', 'inherit', 'inherit'] });
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
  const tipo = forzado || tipoTurno(new Date());
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

function adelantar(lista) {
  const p = proximoShortYT(leerLista(lista), leerJSON('out/subidas-api.json', []), leerJSON('src/videos/youtube-ids.json', {}));
  if (p && !p.espera) asegurar(p.id, 'short');
  // --probar elige el próximo y, con NUBE=1, deja sus archivos en el release (no publica nada)
  for (const a of [['scripts/instagram-shorts.mjs', lista, '--probar'], ['scripts/instagram-reels.mjs', '--probar']]) {
    const r = spawnSync('node', a, { encoding: 'utf8', maxBuffer: 1 << 24, stdio: ['ignore', 'pipe', 'inherit'] });
    console.log(`${a[0]}: ${(r.stdout ?? '').split('\n')[0]}`);
  }
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
    const { de } = JSON.parse(readFileSync(rutaLocal(id, 'partes'), 'utf8'));
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
    if (cmd === 'slot') console.log(pos[0] || tipoTurno(new Date()));
    else if (cmd === 'yt') yt(pos[0]);
    else if (cmd === 'ig') await ig(pos[0], pos[1]);
    else if (cmd === 'adelantar') adelantar(pos[0]);
    else if (cmd === 'sembrar') sembrar(pos[0], max);
    else throw new Error('uso: node scripts/nube.mjs slot|yt|ig|adelantar|sembrar <lista>');
  } catch (e) { console.error(String(e.message ?? e).slice(0, 500)); process.exit(1); }
}
