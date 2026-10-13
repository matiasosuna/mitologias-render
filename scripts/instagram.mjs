// Publica Reels en @mythsonclay con la API oficial de Instagram (app de Meta propia, 100 posts/día, sin intermediarios).
// El video se sube directo desde la Mac (subida reanudable), no hace falta alojarlo en internet.
// Uso:
//   node scripts/instagram.mjs <id> --short=N            → Reel de un Short del episodio (texto en inglés + línea en español)
//   node scripts/instagram.mjs --archivo=x.mp4 --texto="…" → Reel con un archivo y texto propios
//   --probar → muestra el texto sin publicar
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split('=').slice(1).join('=');
const id = args.find((a) => !a.startsWith('--'));
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const TOKEN = env.MOC_PAGE_TOKEN, IG = env.MOC_IG_USER_ID, V = 'v21.0';
if (!TOKEN || !IG) throw new Error('Falta conectar Instagram: node scripts/instagram-auth.mjs');

const SERIE = { nordicas: ['Norse', '#norsemythology #vikings'], egipcias: ['Egyptian', '#egyptianmythology #ancientegypt'], hawaianas: ['Hawaiian', '#hawaiianmythology #polynesian'], norteamericanas: ['Native American', '#nativeamericanmythology #indigenousstories'], aztecas: ['Aztec', '#aztecmythology #mexica'], balinesas: ['Balinese', '#balinesemythology #bali'], hindues: ['Hindu', '#hindumythology #indianmythology'], maories: ['Māori', '#maorimythology #aotearoa'], griegas: ['Greek', '#greekmythology #greekgods'] };
let archivo, texto;
if (id) {
  const g = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
  const n = Number(opt('short') ?? 1), sh = g.shorts[n - 1];
  archivo = join('out', id, `short-${n}.mp4`);
  const [nombre, tags] = SERIE[g.serie ?? 'griegas'] ?? SERIE.griegas;
  texto = `${sh.gancho.en} 🏺\n\n${sh.gancho.es ? `🇪🇸 ${sh.gancho.es}\n\n` : ''}The full story: “${g.titulo.en}” (${nombre} Mythology Ep. ${Number(g.numero)}) — on YouTube, link in bio.\n\n${tags} #mythology #animation #mythsonclay`;
} else {
  archivo = opt('archivo'); texto = opt('texto') ?? '';
}
const carrusel = opt('carrusel')?.split(',');
if (!carrusel && (!archivo || !existsSync(archivo))) throw new Error(`No existe el video: ${archivo}`);
if (args.includes('--probar')) { console.log(texto); process.exit(0); }

const g = async (metodo, ruta, q = {}) => {
  const r = await fetch(`https://graph.facebook.com/${V}${ruta}?${new URLSearchParams({ ...q, access_token: TOKEN })}`, { method: metodo });
  const j = await r.json();
  if (j.error) throw new Error(`${ruta}: ${j.error.message}`);
  return j;
};
/** Sube un video a un contenedor reanudable, en pedazos de 8 MB. */
const subirVideo = async (ruta, extra) => {
  const c = await g('POST', `/${IG}/media`, { upload_type: 'resumable', ...extra });
  const d = readFileSync(ruta), P = 8_000_000; let r = '';
  for (let o = 0; o < d.length; o += P) {
    r = execFileSync('curl', ['-s', '-X', 'POST', c.uri ?? `https://rupload.facebook.com/ig-api-upload/${V}/${c.id}`, '-H', `Authorization: OAuth ${TOKEN}`, '-H', `offset: ${o}`, '-H', `file_size: ${d.length}`, '--data-binary', '@-'], { input: d.subarray(o, Math.min(d.length, o + P)), encoding: 'utf8', maxBuffer: 1 << 24 });
    if (!/"success"\s*:\s*true|PartialRequestError/.test(r)) throw new Error(`subida ${ruta}: ${r.slice(0, 200)}`);
  }
  if (!/"success"\s*:\s*true/.test(r)) throw new Error(`subida incompleta ${ruta}: ${r.slice(0, 200)}`);
  return c.id;
};
const esperar = async (cid) => {
  for (let i = 0; i < 90; i++) {
    const e = (await g('GET', `/${cid}`, { fields: 'status_code' })).status_code;
    if (e === 'FINISHED') return;
    if (e === 'ERROR') throw new Error(`Instagram no pudo procesar ${cid}`);
    await new Promise((r) => setTimeout(r, 15000)); // sin apurar: Meta limita los pedidos por hora
  }
  throw new Error(`${cid} sigue procesando`);
};
if (carrusel) {
  // Carrusel de videos (cada uno < 60 s): para episodios largos, que como Reel la API no acepta.
  const hijos = [];
  for (const parte of carrusel) { const cid = await subirVideo(parte, { media_type: 'VIDEO', is_carousel_item: 'true' }); await esperar(cid); hijos.push(cid); }
  const padre = await g('POST', `/${IG}/media`, { media_type: 'CAROUSEL', children: hijos.join(','), caption: texto });
  await esperar(padre.id);
  const pub = await g('POST', `/${IG}/media_publish`, { creation_id: padre.id });
  const info = await g('GET', `/${pub.id}`, { fields: 'permalink' });
  console.log(`publicado: ${info.permalink}`);
  const reg = 'out/subidas-instagram.json';
  const hist = existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : [];
  hist.push({ id: id ?? null, archivo: carrusel[0], carrusel: carrusel.length, media: pub.id, permalink: info.permalink, fecha: new Date().toISOString() });
  writeFileSync(reg, JSON.stringify(hist, null, 1));
  process.exit(0);
}
// 1) contenedor con subida reanudable
// Los Shorts van solo a la pestaña Reels (share_to_feed=false): la grilla del perfil queda solo con los episodios, en orden.
const cont = await g('POST', `/${IG}/media`, { media_type: 'REELS', upload_type: 'resumable', caption: texto, share_to_feed: args.includes('--grilla') ? 'true' : 'false', thumb_offset: '1500' });
// 2) subir el archivo en pedazos de 8 MB (Instagram rechaza más de ~30 MB de una sola vez)
const datos = readFileSync(archivo), tam = datos.length, PEDAZO = 8_000_000;
let sub = '';
for (let o = 0; o < tam; o += PEDAZO) {
  sub = execFileSync('curl', ['-s', '-X', 'POST', cont.uri ?? `https://rupload.facebook.com/ig-api-upload/${V}/${cont.id}`, '-H', `Authorization: OAuth ${TOKEN}`, '-H', `offset: ${o}`, '-H', `file_size: ${tam}`, '--data-binary', '@-'], { input: datos.subarray(o, Math.min(tam, o + PEDAZO)), encoding: 'utf8', maxBuffer: 1 << 24 });
  if (!/"success"\s*:\s*true|PartialRequestError/.test(sub)) throw new Error(`subida: ${sub.slice(0, 300)}`);
}
if (!/"success"\s*:\s*true/.test(sub)) throw new Error(`subida incompleta: ${sub.slice(0, 300)}`);
// 3) esperar que Instagram procese el video
let estado = '';
for (let i = 0; i < 60; i++) {
  estado = (await g('GET', `/${cont.id}`, { fields: 'status_code,status' })).status_code;
  if (estado === 'FINISHED') break;
  if (estado === 'ERROR') throw new Error('Instagram no pudo procesar el video');
  await new Promise((r) => setTimeout(r, 5000));
}
if (estado !== 'FINISHED') throw new Error(`sigue procesando (${estado}); reintentar publicar con el contenedor ${cont.id}`);
// 4) publicar
const pub = await g('POST', `/${IG}/media_publish`, { creation_id: cont.id });
const info = await g('GET', `/${pub.id}`, { fields: 'permalink' });
console.log(`publicado: ${info.permalink}`);
const reg = 'out/subidas-instagram.json';
const hist = existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : [];
hist.push({ id: id ?? null, short: opt('short') ?? null, archivo, media: pub.id, permalink: info.permalink, fecha: new Date().toISOString() });
writeFileSync(reg, JSON.stringify(hist, null, 1));
