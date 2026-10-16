// Shorts nativos como Reels en @mythsonclay, SOLO en la pestaña Reels (share_to_feed=false): la grilla queda con los episodios.
// Publica el próximo de la lista (archivo con un id por línea) que todavía no esté en Instagram.
// Control de duplicados antes y después (por la 1.ª línea del texto), igual que instagram-reels.mjs.
// Con NUBE=1 (GitHub Actions): si el video no está en out/, se baja del release "media" (o se renderiza ahí).
// Desde 2026-10-15 publica por Buffer (scripts/buffer.mjs) si IG_VIA=buffer o si la clave de Meta no sirve (video del
// release "media", tapa = cuadro de 1,5 s como antes, anti-duplicados contra los posts del canal en Buffer).
// Uso: node scripts/instagram-shorts.mjs <lista.txt> [--probar]
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { igPorBuffer, cliente, postsDelCanal, buscarPorPrimeraLinea, crear, esperarEnvio, entradaReel } from './buffer.mjs';

process.chdir(new URL('..', import.meta.url).pathname);
const nube = process.env.NUBE === '1' ? await import('./nube.mjs') : null;
const args = process.argv.slice(2), lista = args.find((a) => !a.startsWith('--'));
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const TOKEN = env.MOC_PAGE_TOKEN, IG = env.MOC_IG_USER_ID, V = 'v21.0';
const g = async (ruta, q = {}) => { const r = await fetch(`https://graph.facebook.com/${V}${ruta}?${new URLSearchParams({ ...q, access_token: TOKEN })}`); const j = await r.json(); if (j.error) throw new Error(j.error.message); return j; };
const SERIE = { griegas: ['Greek', '#greekmythology #greekgods'], nordicas: ['Norse', '#norsemythology #vikings'], egipcias: ['Egyptian', '#egyptianmythology #ancientegypt'], hawaianas: ['Hawaiian', '#hawaiianmythology #polynesian'], norteamericanas: ['Native American', '#nativeamericanmythology'], aztecas: ['Aztec', '#aztecmythology #mexica'], balinesas: ['Balinese', '#balinesemythology #bali'], hindues: ['Hindu', '#hindumythology #indianmythology'], maories: ['Māori', '#maorimythology #aotearoa'] };

const reg = 'out/subidas-instagram.json';
const hechos = new Set((existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : []).map((h) => h.archivo));
const ids = readFileSync(lista, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
const id = ids.find((d) => !hechos.has(join('out', d, `${d}.mp4`)));
if (!id) { console.log('nada pendiente'); process.exit(0); }
const archivo = join('out', id, `${id}.mp4`);
if (nube && !existsSync(archivo)) nube.asegurar(id, 'short');
if (!existsSync(archivo)) { console.log(`esperando render de ${id}`); process.exit(0); }

const gu = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
const [nombre, tags] = SERIE[gu.serie] ?? SERIE.griegas;
const ep = gu.episodio && existsSync(join('src/videos', gu.episodio, 'guion.json')) ? JSON.parse(readFileSync(join('src/videos', gu.episodio, 'guion.json'), 'utf8')) : null;
const primera = `${gu.gancho.en} 🏺`;
const cierre = gu.cierre?.en && !/Ep\. \d|S\d+E\d+/.test(gu.cierre.en) ? `\n\n${gu.cierre.en}` : '';
const texto = `${primera}${cierre}${gu.gancho.es ? `\n\n🇪🇸 ${gu.gancho.es}` : ''}${ep ? `\n\nThe full story: “${ep.titulo.en}” (${nombre} Mythology Ep. ${Number(ep.numero)}), in our Reels and on YouTube (link in bio).` : ''}\n\n${tags} #mythology #mythsonclay #shorts`;
if (args.includes('--probar')) { console.log(id, '\n', texto); process.exit(0); }

const porBuffer = await igPorBuffer(env);
const gql = porBuffer ? cliente(env.BUFFER_API_KEY) : null;
const yaEsta = porBuffer
  ? async () => { const p = buscarPorPrimeraLinea(await postsDelCanal(gql), (l) => l === primera); return p && { id: p.id, permalink: p.externalLink ?? null }; }
  : async () => (await g(`/${IG}/media`, { fields: 'caption,permalink,media_type', limit: '100' })).data.find((m) => m.media_type === 'VIDEO' && (m.caption ?? '').split('\n')[0] === primera);
const previo = await yaEsta();
if (previo) {
  const h = JSON.parse(readFileSync(reg, 'utf8')); h.push({ id, tipo: 'reel-short', archivo, permalink: previo.permalink, fecha: new Date().toISOString() });
  (await import('node:fs')).writeFileSync(reg, JSON.stringify(h, null, 1)); console.log(id, 'ya estaba:', previo.permalink); process.exit(0);
}
if (porBuffer) {
  const rel = nube ?? await import('./nube.mjs');
  const videoUrl = rel.publicarUrl(archivo, rel.nombreAsset(id, 'short'));
  const post = await esperarEnvio(gql, await crear(gql, entradaReel({ texto, videoUrl, thumbOffset: 1500, alFeed: false })));
  const h = existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : [];
  h.push({ id, tipo: 'reel-short', archivo, media: post.id, permalink: post.externalLink ?? null, via: 'buffer', fecha: new Date().toISOString() });
  (await import('node:fs')).writeFileSync(reg, JSON.stringify(h, null, 1));
  console.log(id, 'publicado (Buffer):', post.externalLink ?? `enviándose (${post.id})`);
  process.exit(0);
}
try {
  const s = execFileSync('node', ['scripts/instagram.mjs', `--archivo=${archivo}`, `--texto=${texto}`], { encoding: 'utf8' });
  console.log(id, s.trim().split('\n').pop());
} catch (e) {
  await new Promise((r) => setTimeout(r, 60000));
  const m = await yaEsta().catch(() => null);
  if (!m) throw new Error(`${id}: ${String(e.stderr || e.message).slice(0, 200)}`);
  const h = JSON.parse(readFileSync(reg, 'utf8')); h.push({ id, tipo: 'reel-short', archivo, permalink: m.permalink, fecha: new Date().toISOString() });
  (await import('node:fs')).writeFileSync(reg, JSON.stringify(h, null, 1)); console.log(id, 'publicado (con aviso):', m.permalink);
}
