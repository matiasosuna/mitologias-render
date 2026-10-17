// TikTok por Buffer (canal mythsonclay; nunca matias.osuna2): publica YA (shareNow) un ítem de la cola única
// (scripts/cola.mjs, la llama scripts/nube.mjs en cada turno):
//   - "Who is…?" → el Short, con la portada diseñada (portadas-short.mjs) como primeros 0,4 s = tapa.
//   - episodio  → UN video vertical completo (composición <id>-vertical, scripts/vertical-render.mjs, ritmo normal),
//                 con la portada de Instagram en 9:16 como primeros 0,4 s = tapa.
// Los dos sin perfil ICC (el lector de TikTok falla con el átomo colr 'prof'); el mp4 queda en el release "media"
// (<id>.tiktok.mp4) y Buffer lo baja de ahí. Anti-duplicados: registro + 1.ª línea de los posts del canal.
// Uso: node scripts/buffer-tiktok.mjs <id> [--probar]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { cliente, postsDelCanal, buscarPorPrimeraLinea, crear, esperarEnvio, entradaTiktok, esLimite, CANAL_TIKTOK } from './buffer.mjs';
import { primeraLinea } from './instagram-texto.mjs';
import { ganchoParte, codigoEpisodio, leerTitulos, NOMBRES } from './titulos.mjs';

export const REG = 'out/subidas-buffer.json';
const T = { griegas: '#greekmythology #greekgods', nordicas: '#norsemythology #vikings', egipcias: '#egyptianmythology #ancientegypt', hawaianas: '#hawaiianmythology #polynesian', norteamericanas: '#nativeamericanmythology', aztecas: '#aztecmythology #mexica', balinesas: '#balinesemythology #bali', hindues: '#hindumythology #indianmythology', maories: '#maorimythology #aotearoa' };
const leerJSON = (f, def) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : def);
const guion = (id) => JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));

/** Texto de un Short (como siempre). */
export function texto(id) {
  const g = guion(id);
  const ep = g.episodio && existsSync(join('src/videos', g.episodio, 'guion.json')) ? guion(g.episodio) : null;
  const cierre = g.cierre?.en && !/Ep\. \d/.test(g.cierre.en) ? ` ${g.cierre.en}` : '';
  return `${g.gancho.en} 🏺${cierre}${ep ? ` Full story: "${ep.titulo.en}" on YouTube, Myths on Clay.` : ''} ${T[g.serie] ?? ''} #mythology #mythsonclay #fyp`;
}
/** Texto de un episodio completo: 1.ª línea = la de los Reels (título del capítulo, o la línea vieja si no tiene). */
export function textoEpisodio(id, { gu = guion(id), titulos = leerTitulos(), gancho } = {}) {
  const nombre = NOMBRES[gu.serie ?? 'griegas'];
  const linea = primeraLinea({ gu, nombre, parte: 1, de: 1, curioso: ganchoParte(id, titulos), yaPublicadas: 0 });
  const codigo = codigoEpisodio(id, titulos) || (titulos[id]?.especial ? `${titulos[id].especial} Special` : '');
  return `${linea.replace(/ 🏺$/, '')} 🏺${codigo ? ` ${codigo}.` : ''}${gancho ? ` ${gancho}` : ''} The whole series, in order, on our profile and on YouTube. ${T[gu.serie] ?? ''} #mythology #animation #mythsonclay #fyp`;
}
const primera = (t) => t.split('\n')[0].split(' 🏺')[0];

const ffmpegTiktok = (tapa, video, salida) => execFileSync('nice', ['-n', '15', 'ffmpeg', '-v', 'error', '-y', '-loop', '1', '-t', '0.4', '-framerate', '30', '-i', tapa, '-f', 'lavfi', '-t', '0.4', '-i', 'anullsrc=r=44100:cl=stereo', '-i', video,
  '-filter_complex', '[0:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p[t];[2:v]sidedata=mode=delete:type=ICC_PROFILE,scale=1080:1920,setsar=1,fps=30,format=yuv420p[v];[2:a]aresample=44100,aformat=channel_layouts=stereo[a];[t][1:a][v][a]concat=n=2:v=1:a=1[ov][oa]',
  '-map', '[ov]', '-map', '[oa]', '-c:v', 'libx264', '-preset', 'medium', '-b:v', '1400k', '-maxrate', '1700k', '-bufsize', '3000k', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', '-map_metadata', '-1', salida]);

/** Deja out/<id>/<id>.tiktok.mp4 listo (del release o armado acá) y devuelve su URL pública en el release. */
export async function prepararTiktok(id) {
  const rel = await import('./nube.mjs');
  const tk = rel.rutaLocal(id, 'tiktok');
  mkdirSync(dirname(tk), { recursive: true });
  if (id.startsWith('short-')) {
    if (!(existsSync(`${tk}.tapa`) && existsSync(tk)) && !rel.bajar(rel.nombreAsset(id, 'tiktok'), tk)) {
      if (!rel.asegurar(id, 'short')) throw new Error(`no hay video de ${id}`);
      const tapa = rel.asegurar(id, 'portada-short');
      if (!tapa) throw new Error(`no hay portada de ${id}`);
      ffmpegTiktok(tapa, rel.rutaLocal(id, 'short'), tk);
    }
    writeFileSync(`${tk}.tapa`, '');
    return rel.publicarUrl(tk, rel.nombreAsset(id, 'tiktok'));
  }
  // episodio: el del release solo si es de este guion (huella): si cambió el elenco o el guion, se rehace
  const huella = rel.huella(id), meta = rel.rutaLocal(id, 'tiktok-meta');
  const vigente = () => existsSync(meta) && leerJSON(meta, {}).huella === huella && existsSync(tk);
  if (!vigente() && !(rel.bajar(rel.nombreAsset(id, 'tiktok-meta'), meta) && leerJSON(meta, {}).huella === huella && rel.bajar(rel.nombreAsset(id, 'tiktok'), tk))) {
    const portada = rel.asegurar(id, 'portada-ig');
    if (!portada) throw new Error(`no hay portada de ${id}`);
    console.log(`  render vertical completo: ${id}`);
    execFileSync('node', ['scripts/vertical-render.mjs', id], { stdio: ['ignore', 'inherit', 'inherit'] }); // ritmo normal (sin --rapido)
    const tapa = join('out', id, 'tapa-tiktok.jpg');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', portada, '-filter_complex', '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:4,eq=brightness=-0.25[bg];[bg][0:v]overlay=0:285', '-frames:v', '1', '-q:v', '2', tapa]);
    ffmpegTiktok(tapa, rel.rutaLocal(id, 'vertical'), tk);
    writeFileSync(meta, JSON.stringify({ huella, ritmo: 'normal', fecha: new Date().toISOString() }));
    rel.subirAsset(tk, rel.nombreAsset(id, 'tiktok'));
    rel.subirAsset(meta, rel.nombreAsset(id, 'tiktok-meta')); // al final: marca que el mp4 es de este guion
  }
  return rel.publicarUrl(tk, rel.nombreAsset(id, 'tiktok'));
}

/** Posts de TikTok en la cola de Buffer (programados). Con 10 Buffer no acepta más. */
export const enCola = async (gql) => (await postsDelCanal(gql, { canal: CANAL_TIKTOK, estados: ['scheduled'] })).length;

/** Publica YA un ítem en TikTok. Devuelve 'ya estaba' | 'publicado'. Error con .limite = true si TikTok/Buffer lo frenó. */
export async function publicarTiktok(id, { env, probar = false } = {}) {
  const hechos = leerJSON(REG, []);
  if (hechos.some((h) => h.id === id)) return 'ya estaba';
  const esEp = !id.startsWith('short-');
  const g0 = esEp ? (leerJSON(join('src/videos', id, 'youtube.json'), {}).gancho ?? leerJSON('src/videos/meta-youtube.json', {}).episodios?.[id]?.gancho) : null;
  const gancho = Array.isArray(g0) ? g0[0] : g0; // especiales: [gancho, fuente]
  const txt = esEp ? textoEpisodio(id, { gancho }) : texto(id);
  if (probar) { console.log(id, '\n ', txt); return 'probar'; }
  const gql = cliente(env.BUFFER_API_KEY);
  const anotar = (post, nota) => { const h = leerJSON(REG, []); h.push({ id, tipo: esEp ? 'episodio' : 'short', post, dueAt: new Date().toISOString(), fecha: new Date().toISOString(), ...(nota ? { nota } : {}) }); writeFileSync(REG, JSON.stringify(h, null, 1)); };
  const previo = buscarPorPrimeraLinea(await postsDelCanal(gql, { canal: CANAL_TIKTOK }), (l) => primera(l) === primera(txt));
  if (previo) { anotar(previo.id, 'ya estaba en Buffer'); return 'ya estaba'; }
  const videoUrl = await prepararTiktok(id);
  let post;
  try { post = await esperarEnvio(gql, await crear(gql, entradaTiktok({ texto: txt, videoUrl }))); }
  catch (e) { if (esLimite(e.message)) e.limite = true; throw e; }
  anotar(post.id);
  console.log(`TikTok: ${id} ${post.status === 'sent' ? 'publicado' : `enviándose (${post.id})`}`);
  return 'publicado';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.chdir(new URL('..', import.meta.url).pathname);
  const args = process.argv.slice(2), id = args.find((a) => !a.startsWith('--'));
  if (!id) throw new Error('uso: node scripts/buffer-tiktok.mjs <id> [--probar]');
  const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
  console.log(await publicarTiktok(id, { env, probar: args.includes('--probar') }));
}
