// TikTok por Buffer (plan gratis: hasta 10 publicaciones en cola): programa los próximos Shorts propios con texto y
// hashtags, cada 4 h (00, 04, 08, 12, 16, 20 HST). Los videos se sirven desde la web del canal (sitio/tk/<id>.mp4, Cloudflare).
// Con NUBE=1 (GitHub Actions, scripts/nube.mjs): sin wrangler; los videos se bajan/suben al release "media" del repo
// público y Buffer los toma de ahí (o se renderizan en la misma corrida si faltan).
// Uso: node scripts/buffer-tiktok.mjs <lista.txt> [--probar]   (llamar 1 vez por día: rellena la cola hasta 10)
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

process.chdir(new URL('..', import.meta.url).pathname);
const nube = process.env.NUBE === '1' ? await import('./nube.mjs') : null;
const args = process.argv.slice(2), lista = args.find((a) => !a.startsWith('--')), probar = args.includes('--probar'), ya = args.includes('--ya'); // --ya: el primero sale ahora
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const CANAL = '6acc93d8778b240e2fe40471', WEB = 'https://myths-on-clay.osuna-devs.workers.dev';
const HORAS_UTC = [10, 14, 18, 22, 2, 6]; // cada 4 h: 00, 04, 08, 12, 16 y 20 HST
const REG = 'out/subidas-buffer.json';
const hechos = existsSync(REG) ? JSON.parse(readFileSync(REG, 'utf8')) : [];
const yaPorBorrador = ['short-griegas-cerbero', 'short-nordicas-hel', 'short-egipcias-corazon']; // se publicaron a mano desde la bandeja

const gql = async (query) => {
  const r = await fetch('https://api.buffer.com', { method: 'POST', headers: { Authorization: `Bearer ${env.BUFFER_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) });
  const j = await r.json(); if (j.errors) throw new Error(JSON.stringify(j.errors).slice(0, 300)); return j.data;
};
const T = { griegas: '#greekmythology #greekgods', nordicas: '#norsemythology #vikings', egipcias: '#egyptianmythology #ancientegypt', hawaianas: '#hawaiianmythology #polynesian', norteamericanas: '#nativeamericanmythology', aztecas: '#aztecmythology #mexica', balinesas: '#balinesemythology #bali', hindues: '#hindumythology #indianmythology', maories: '#maorimythology #aotearoa' };
export function texto(id) {
  const g = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
  const ep = g.episodio && existsSync(join('src/videos', g.episodio, 'guion.json')) ? JSON.parse(readFileSync(join('src/videos', g.episodio, 'guion.json'), 'utf8')) : null;
  const cierre = g.cierre?.en && !/Ep\. \d/.test(g.cierre.en) ? ` ${g.cierre.en}` : '';
  return `${g.gancho.en} 🏺${cierre}${ep ? ` Full story: "${ep.titulo.en}" on YouTube, Myths on Clay.` : ''} ${T[g.serie] ?? ''} #mythology #mythsonclay #fyp`;
}

// Turnos ocupados = posts ya en cola de Buffer
const cola = probar ? [] : hechos.filter((h) => new Date(h.dueAt) > new Date());
const libres = Math.max(0, 10 - cola.length);
const candidatos = readFileSync(lista, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean)
  .filter((id) => !yaPorBorrador.includes(id) && !hechos.some((h) => h.id === id));
const pendientes = [];
for (const id of candidatos) {
  if (pendientes.length >= libres) break;
  if (existsSync(join('out', id, `${id}.mp4`)) || (nube && nube.asegurarTiktok(id))) pendientes.push(id);
}
if (!pendientes.length) { console.log(`nada para programar (en cola: ${cola.length})`); process.exit(0); }

// próximos turnos libres
const ocupados = new Set(hechos.map((h) => h.dueAt));
const turnos = [];
for (let d = new Date(); turnos.length < pendientes.length; d = new Date(d.getTime() + 3600e3)) {
  if (!HORAS_UTC.includes(d.getUTCHours())) continue;
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours())).toISOString();
  if (new Date(t) - Date.now() > 20 * 60e3 && !ocupados.has(t)) { turnos.push(t); ocupados.add(t); }
}

// videos para TikTok (sin perfil ICC: el lector de TikTok falla con el átomo colr 'prof') servidos desde la web
mkdirSync('sitio/tk', { recursive: true });
for (const id of pendientes) {
  const tk = join('out', id, `${id}.tiktok.mp4`);
  // portada diseñada (scripts/portadas-short.mjs) como primer 0,4 s → es la tapa en TikTok (thumbnailOffset 100 ms)
  const tapa = join('out', id, 'portada-short.jpg');
  if (!nube && !existsSync(tapa)) execFileSync('node', ['scripts/portadas-short.mjs', id], { stdio: 'ignore' });
  if (!existsSync(tk) || !existsSync(tk + '.tapa')) {
    if (nube) nube.asegurar(id, 'portada-short');
    execFileSync('nice', ['-n', '15', 'ffmpeg', '-v', 'error', '-y', '-loop', '1', '-t', '0.4', '-framerate', '30', '-i', tapa, '-f', 'lavfi', '-t', '0.4', '-i', 'anullsrc=r=44100:cl=stereo', '-i', join('out', id, `${id}.mp4`),
      '-filter_complex', '[0:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p[t];[2:v]sidedata=mode=delete:type=ICC_PROFILE,scale=1080:1920,setsar=1,fps=30,format=yuv420p[v];[2:a]aresample=44100,aformat=channel_layouts=stereo[a];[t][1:a][v][a]concat=n=2:v=1:a=1[ov][oa]',
      '-map', '[ov]', '-map', '[oa]', '-c:v', 'libx264', '-preset', 'medium', '-b:v', '1400k', '-maxrate', '1700k', '-bufsize', '3000k', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', '-map_metadata', '-1', tk]);
    writeFileSync(tk + '.tapa', '');
  }
  if (nube) nube.publicarUrl(tk, nube.nombreAsset(id, 'tiktok'));
  else copyFileSync(tk, join('sitio/tk', `${id}.mp4`));
}
if (probar) { pendientes.forEach((id, i) => console.log(turnos[i], id, '\n ', texto(id))); process.exit(0); }
if (!nube) { execFileSync('npx', ['wrangler', 'deploy'], { stdio: 'ignore' }); await new Promise((r) => setTimeout(r, 8000)); }

for (const [i, id] of pendientes.entries()) {
  const url = nube ? nube.urlAsset(nube.nombreAsset(id, 'tiktok')) : `${WEB}/tk/${id}.mp4`;
  const head = await fetch(url, { method: 'HEAD' });
  if (!head.ok) { console.log(`${id}: el video no está publicado (${head.status})`); continue; }
  const ahora = ya && i === 0;
  const d = await gql(`mutation { createPost(input: { text: ${JSON.stringify(texto(id))}, channelId: "${CANAL}", schedulingType: automatic, mode: ${ahora ? 'shareNow' : `customScheduled, dueAt: "${turnos[i - (ya ? 1 : 0)]}"`}, assets: [{ video: { url: "${url}", metadata: { thumbnailOffset: 100 } } }] }) { ... on PostActionSuccess { post { id } } ... on MutationError { message } } }`);
  const p = d.createPost;
  if (p.post) { hechos.push({ id, post: p.post.id, dueAt: ahora ? new Date().toISOString() : turnos[i - (ya ? 1 : 0)] }); writeFileSync(REG, JSON.stringify(hechos, null, 1)); console.log(`${id} ${ahora ? 'publicándose ya' : 'programado para ' + turnos[i - (ya ? 1 : 0)]}`); }
  else console.log(`${id}: ${p.message}`);
}
