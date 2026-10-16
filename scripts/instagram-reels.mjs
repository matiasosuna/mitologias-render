// Episodios completos como REELS en @mythsonclay (uno por episodio, en orden, solo temporadas 1).
// Instagram no acepta Reels largos por subida directa, así que el video se sirve desde la Mac con un túnel
// temporal de Cloudflare (cloudflared) y Instagram lo descarga de ahí.
// Reparto: por tandas — una temporada 1 completa y después la siguiente mitología (griegas → nórdicas → egipcias → hawaianas).
// Desde 2026-10-10 cada episodio va en PARTES de < 3 min (scripts/vertical-partes.mjs → out/<id>/<id>.parte-N.mp4):
// Instagram casi no recomienda Reels más largos a quien no te sigue. Se publican en orden: ep. 8 parte 1, parte 2, ep. 9…
// Portada del Reel (cover_url) = la portada diseñada. Control de duplicados antes y después de publicar.
// Con NUBE=1 (GitHub Actions, scripts/nube.mjs): sin túnel; los archivos salen del release "media" del repo público
// (o se renderizan ahí) y Instagram los baja de sus URL públicas.
// Desde 2026-10-15 publica por Buffer (scripts/buffer.mjs) si IG_VIA=buffer o si la clave de Meta no sirve: el video sale
// del release "media", la tapa es el cuadro de 1 s (Buffer no acepta portada propia) y el anti-duplicados mira los posts
// del canal de Instagram en Buffer (incluye lo publicado antes por la Graph API).
// Uso: node scripts/instagram-reels.mjs [--probar] [--solo=<id>]
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { join } from 'node:path';
import { textoReel, esLaMisma, primeraLinea, lineaVieja, FORMATO_CURIOSO } from './instagram-texto.mjs';
import { ganchoParte, codigoEpisodio, leerTitulos } from './titulos.mjs';
import { igPorBuffer, cliente, postsDelCanal, buscarPorPrimeraLinea, crear, esperarEnvio, entradaReel } from './buffer.mjs';

process.chdir(new URL('..', import.meta.url).pathname);
const nube = process.env.NUBE === '1' ? await import('./nube.mjs') : null;
const args = process.argv.slice(2), opt = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split('=')[1];
const LOCK = 'out/.instagram-cola.lock';
if (existsSync(LOCK)) { try { process.kill(Number(readFileSync(LOCK, 'utf8')), 0); console.log('ya hay una cola corriendo'); process.exit(0); } catch { /* vieja */ } }
writeFileSync(LOCK, String(process.pid));
const hijos = [];
process.on('exit', () => { hijos.forEach((h) => { try { h.kill(); } catch { /* */ } }); try { if (readFileSync(LOCK, 'utf8') === String(process.pid)) execFileSync('rm', ['-f', LOCK]); } catch { /* */ } });

const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const TOKEN = env.MOC_PAGE_TOKEN, IG = env.MOC_IG_USER_ID, V = 'v21.0';
const g = async (m, ruta, q = {}) => { const r = await fetch(`https://graph.facebook.com/${V}${ruta}?${new URLSearchParams({ ...q, access_token: TOKEN })}`, { method: m }); const j = await r.json(); if (j.error) throw new Error(`${ruta}: ${j.error.message}`); return j; };

const ORDEN = ['griegas', 'nordicas', 'egipcias', 'hawaianas', 'norteamericanas', 'aztecas', 'balinesas', 'hindues', 'maories'];
const T1 = { griegas: 7, nordicas: 13, egipcias: 11, hawaianas: 12, norteamericanas: 12, aztecas: 12, balinesas: 12, hindues: 12, maories: 12 };
const SERIE = { griegas: ['Greek', '#greekmythology #greekgods'], nordicas: ['Norse', '#norsemythology #vikings'], egipcias: ['Egyptian', '#egyptianmythology #ancientegypt'], hawaianas: ['Hawaiian', '#hawaiianmythology #polynesian'], norteamericanas: ['Native American', '#nativeamericanmythology #indigenousstories'], aztecas: ['Aztec', '#aztecmythology #mexica'], balinesas: ['Balinese', '#balinesemythology #bali'], hindues: ['Hindu', '#hindumythology #indianmythology'], maories: ['Māori', '#maorimythology #aotearoa'] };
const ids = JSON.parse(readFileSync('src/videos/youtube-ids.json', 'utf8'));
const reg = 'out/subidas-instagram.json';
const hist = () => (existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : []);
// Cuentan como hechos los Reels de episodio ya publicados (también los apaisados del 2026-10-09, que quedan).
const partesDe = (d) => (existsSync(join('out', d, 'partes.json')) ? JSON.parse(readFileSync(join('out', d, 'partes.json'), 'utf8')).de
  : nube ? (hist().find((h) => h.id === d && h.tipo === 'reel-parte' && h.de)?.de ?? null) : null); // en la nube no hay out/: vale el registro
const partesHechas = (d) => new Set(hist().filter((h) => h.tipo === 'reel-parte' && h.id === d).map((h) => h.parte));
const hechos = new Set(hist().filter((h) => ['reel-episodio', 'reel-apaisado-a-archivar'].includes(h.tipo)).map((h) => h.id));
for (const d of new Set(hist().filter((h) => h.tipo === 'reel-parte').map((h) => h.id))) if (partesDe(d) && partesHechas(d).size >= partesDe(d)) hechos.add(d);
const pendientes = readdirSync('src/videos').filter((d) => /^[a-z]+-\d\d-/.test(d) && ids[d] && Number(d.split('-')[1]) <= (T1[d.split('-')[0]] ?? 0) && !hechos.has(d))
  .sort((a, b) => ORDEN.indexOf(a.split('-')[0]) - ORDEN.indexOf(b.split('-')[0]) || a.localeCompare(b));
const id = opt('solo') ?? pendientes[0];
if (!id) { console.log('nada pendiente'); process.exit(0); }
if (nube) nube.asegurar(id, 'partes');
// En orden estricto: si el próximo todavía no tiene su versión vertical, esperar (no saltear).
const de = partesDe(id);
if (!de) { console.log(`esperando render en partes de ${id}`); process.exit(0); }
const parte = [...Array(de).keys()].map((i) => i + 1).find((n) => !partesHechas(id).has(n));
const archivoParte = join('out', id, `${id}.parte-${parte}.mp4`);
if (nube) { nube.asegurar(id, 'parte', parte); nube.asegurar(id, 'portada-ig'); }
if (!existsSync(archivoParte)) { console.log(`esperando render en partes de ${id}`); process.exit(0); }

const gu = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
const yt = existsSync(join('src/videos', id, 'youtube.json')) ? JSON.parse(readFileSync(join('src/videos', id, 'youtube.json'), 'utf8')) : {};
if (!yt.gancho) yt.gancho = JSON.parse(readFileSync('src/videos/meta-youtube.json', 'utf8')).episodios?.[id]?.gancho;
const [nombre, tags] = SERIE[gu.serie];
// 1.ª línea = título curioso + "· Part n/de", salvo en episodios con partes publicadas con la línea vieja (anti-duplicados)
const titulos = leerTitulos();
const viejas = hist().filter((h) => h.tipo === 'reel-parte' && h.id === id && h.formato !== FORMATO_CURIOSO).length;
const datos = { gu, nombre, tags, parte, de, curioso: ganchoParte(id, titulos), codigo: codigoEpisodio(id, titulos), gancho: yt.gancho, yaPublicadas: viejas };
const texto = textoReel(datos);
if (args.includes('--probar')) { console.log(id, '\n', texto); process.exit(0); }

const porBuffer = await igPorBuffer(env);
const gql = porBuffer ? cliente(env.BUFFER_API_KEY) : null;
const yaEsta = porBuffer
  ? async () => { const p = buscarPorPrimeraLinea(await postsDelCanal(gql), (l) => esLaMisma(l, datos)); return p && { id: p.id, permalink: p.externalLink ?? null }; }
  : async () => (await g('GET', `/${IG}/media`, { fields: 'id,caption,permalink,media_type', limit: '100' })).data.find((m) => m.media_type === 'VIDEO' && esLaMisma((m.caption ?? '').split('\n')[0], datos));
const anotar = (m) => { const h = hist(); h.push({ id, tipo: 'reel-parte', parte, de, ...(primeraLinea(datos) === lineaVieja(datos) ? {} : { formato: FORMATO_CURIOSO }), media: m.id, permalink: m.permalink, ...(porBuffer ? { via: 'buffer' } : {}), fecha: new Date().toISOString() }); writeFileSync(reg, JSON.stringify(h, null, 1)); };
const previo = await yaEsta();
if (previo) { anotar(previo); console.log(id, 'ya estaba:', previo.permalink); process.exit(0); }

if (porBuffer) {
  // Buffer baja el video de una URL estable: la del release (también desde la Mac, con gh)
  const rel = nube ?? await import('./nube.mjs');
  const videoUrl = rel.publicarUrl(archivoParte, rel.nombreAsset(id, 'parte', parte));
  const post = await esperarEnvio(gql, await crear(gql, entradaReel({ texto, videoUrl, thumbOffset: 1000, alFeed: true })));
  anotar({ id: post.id, permalink: post.externalLink ?? null });
  console.log(id, 'publicado (Buffer):', post.externalLink ?? `enviándose (${post.id})`);
  process.exit(0);
}

// 1) armar el video 9:16 y la portada 9:16
const dir = 'out/.reels'; mkdirSync(dir, { recursive: true });
if (!nube) execFileSync('node', ['scripts/portadas-ig.mjs', id], { stdio: 'ignore' });
const port = join('out', id, 'portada-ig.jpg');
const video = join(dir, `${id}.mp4`), tapa = join(dir, `${id}.jpg`);
// El video ya es vertical de verdad (scripts/vertical-render.mjs); solo se copia para servirlo.
execFileSync('cp', [archivoParte, video]);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', port, '-filter_complex', '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:4,eq=brightness=-0.25[bg];[bg][0:v]overlay=0:285', '-frames:v', '1', '-q:v', '2', tapa]);

// 2) servir la carpeta con un túnel temporal (en la nube: URL del release)
let videoUrl, coverUrl;
if (nube) {
  videoUrl = nube.publicarUrl(archivoParte, nube.nombreAsset(id, 'parte', parte));
  coverUrl = nube.subirAsset(tapa, nube.nombreAsset(id, 'tapa-ig'));
  for (let i = 0; i < 10 && !nube.hayAsset(nube.nombreAsset(id, 'tapa-ig')); i++) await new Promise((r) => setTimeout(r, 3000));
} else {
const puerto = 8790 + Math.floor(Math.random() * 100);
hijos.push(spawn('python3', ['-m', 'http.server', String(puerto), '--bind', '127.0.0.1', '--directory', dir], { stdio: 'ignore' }));
const tunel = spawn('cloudflared', ['tunnel', '--url', `http://127.0.0.1:${puerto}`, '--no-autoupdate'], { stdio: ['ignore', 'pipe', 'pipe'] });
hijos.push(tunel);
const base = await new Promise((ok, mal) => {
  const t = setTimeout(() => mal(new Error('el túnel no arrancó')), 60000);
  const leer = (b) => { const m = String(b).match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/); if (m) { clearTimeout(t); ok(m[0]); } };
  tunel.stdout.on('data', leer); tunel.stderr.on('data', leer);
});
for (let i = 0; i < 30; i++) { try { const r = await fetch(`${base}/${id}.jpg`, { method: 'HEAD' }); if (r.ok) break; } catch { /* aún no */ } await new Promise((r) => setTimeout(r, 3000)); }
videoUrl = `${base}/${id}.mp4`; coverUrl = `${base}/${id}.jpg`;
}

// 3) contenedor, esperar, publicar
const cont = await g('POST', `/${IG}/media`, { media_type: 'REELS', video_url: videoUrl, cover_url: coverUrl, caption: texto, share_to_feed: 'true' });
let estado = '';
for (let i = 0; i < 60 && estado !== 'FINISHED'; i++) {
  await new Promise((r) => setTimeout(r, 15000));
  estado = (await g('GET', `/${cont.id}`, { fields: 'status_code' })).status_code;
  if (estado === 'ERROR') throw new Error(`${id}: Instagram no pudo procesar el video`);
}
if (estado !== 'FINISHED') throw new Error(`${id}: sigue procesando`);
try {
  const pub = await g('POST', `/${IG}/media_publish`, { creation_id: cont.id });
  const info = await g('GET', `/${pub.id}`, { fields: 'permalink' });
  anotar({ id: pub.id, permalink: info.permalink }); console.log(id, 'publicado:', info.permalink);
} catch (e) {
  await new Promise((r) => setTimeout(r, 60000));
  const m = await yaEsta().catch(() => null);
  if (m) { anotar(m); console.log(id, 'publicado (con aviso):', m.permalink); } else throw e;
}
execFileSync('rm', ['-f', video, tapa]);
process.exit(0);
