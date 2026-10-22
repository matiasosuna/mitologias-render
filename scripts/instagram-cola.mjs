// Cola de Instagram: publica en orden el próximo episodio (apaisado) que todavía no esté en @mythsonclay.
// La llama launchd varias veces por día (~/Library/LaunchAgents/com.mythsonclay.instagram.plist).
// Saca la pantalla final de YouTube (los últimos 12 s) antes de subir. Uso manual: node scripts/instagram-cola.mjs [--probar]
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

process.chdir(new URL('..', import.meta.url).pathname);
// Una sola cola a la vez (si quedó otra corriendo, esta no hace nada).
const LOCK = 'out/.instagram-cola.lock';
if (existsSync(LOCK)) { const pid = Number(readFileSync(LOCK, 'utf8')); try { process.kill(pid, 0); console.log('ya hay una cola corriendo'); process.exit(0); } catch { /* quedó de antes */ } }
mkdirSync('out', { recursive: true }); writeFileSync(LOCK, String(process.pid));
process.on('exit', () => { try { if (readFileSync(LOCK, 'utf8') === String(process.pid)) execFileSync('rm', ['-f', LOCK]); } catch { /* nada */ } });
const ORDEN = ['griegas', 'nordicas', 'egipcias', 'hawaianas', 'norteamericanas', 'aztecas', 'balinesas', 'hindues', 'maories'];
const SERIE = { griegas: ['Greek', '#greekmythology #greekgods'], nordicas: ['Norse', '#norsemythology #vikings'], egipcias: ['Egyptian', '#egyptianmythology #ancientegypt'], hawaianas: ['Hawaiian', '#hawaiianmythology #polynesian'], norteamericanas: ['Native American', '#nativeamericanmythology #indigenousstories'], aztecas: ['Aztec', '#aztecmythology #mexica'], balinesas: ['Balinese', '#balinesemythology #bali'], hindues: ['Hindu', '#hindumythology #indianmythology'], maories: ['Māori', '#maorimythology #aotearoa'], biblia: ['The Bible', '#bible #kjv #genesis'] };
const ids = JSON.parse(readFileSync('src/videos/youtube-ids.json', 'utf8')); // solo lo que ya está público en YouTube
const reg = 'out/subidas-instagram.json';
const hechos = new Set((existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : []).filter((h) => h.tipo === 'episodio').map((h) => h.id));
const T1 = { griegas: 7, nordicas: 13, egipcias: 11, hawaianas: 12, norteamericanas: 12, aztecas: 12, balinesas: 12, hindues: 12, maories: 12 }; // por ahora solo las primeras temporadas
const episodios = readdirSync('src/videos').filter((d) => /^[a-z]+-\d\d-/.test(d) && ids[d] && Number(d.split('-')[1]) <= (T1[d.split('-')[0]] ?? 0))
  .sort((a, b) => ORDEN.indexOf(a.split('-')[0]) - ORDEN.indexOf(b.split('-')[0]) || a.localeCompare(b));
const id = episodios.find((d) => !hechos.has(d) && existsSync(join('out', d, `${d}.en.mp4`)));
if (!id) { console.log(new Date().toISOString(), 'nada pendiente'); process.exit(0); }

const g = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
const yt = existsSync(join('src/videos', id, 'youtube.json')) ? JSON.parse(readFileSync(join('src/videos', id, 'youtube.json'), 'utf8')) : {};
if (!yt.gancho) { const m = JSON.parse(readFileSync('src/videos/meta-youtube.json', 'utf8')); yt.gancho = m.episodios?.[id]?.gancho; }
const [nombre, tags] = SERIE[g.serie ?? 'griegas'];
const texto = `${g.titulo.en} | ${nombre} Mythology Ep. ${Number(g.numero)} 🏺\n\n${yt.gancho ?? ''}\n\n🇪🇸 ${g.titulo.es}\n\nThe whole season, in order, on YouTube — link in bio.\n\n${tags} #mythology #animation #mythsonclay`;
if (process.argv.includes('--probar')) { console.log(id, '\n', texto); process.exit(0); }

// Control anti-duplicados: si en el perfil ya hay un post con este mismo título, se registra y no se sube de nuevo.
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const yaPublicado = async () => {
  const r = await (await fetch(`https://graph.facebook.com/v21.0/${env.MOC_IG_USER_ID}/media?${new URLSearchParams({ fields: 'id,caption,permalink', limit: '100', access_token: env.MOC_PAGE_TOKEN })}`)).json();
  if (r.error) throw new Error(`no pude revisar el perfil: ${r.error.message}`); // ante la duda, no publicar
  const titulo = texto.split('\n')[0];
  return (r.data ?? []).find((m) => (m.caption ?? '').split('\n')[0] === titulo);
};
const registrar = (m) => {
  const hist = existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : [];
  hist.push({ id, tipo: 'episodio', media: m.id, permalink: m.permalink, fecha: new Date().toISOString(), nota: 'encontrado en el perfil' });
  writeFileSync(reg, JSON.stringify(hist, null, 1));
};
const previo = await yaPublicado();
if (previo) { registrar(previo); console.log(new Date().toISOString(), id, 'ya estaba:', previo.permalink); process.exit(0); }

// Partes de < 58 s cortadas en los cambios de escena (sin la pantalla final de YouTube), a 720p.
const src = join('out', id, `${id}.en.mp4`), tmp = join('out/.instagram', id); mkdirSync(tmp, { recursive: true });
const tl = JSON.parse(readFileSync(join('src/videos', id, 'timeline.json'), 'utf8'));
const fin = (tl.total - tl.outroFrames) / tl.fps;
const cortes = [0, ...tl.escenas.map((e) => e.from / tl.fps).slice(1), fin];
const partes = []; let ini = 0;
for (let i = 1; i < cortes.length; i++) {
  const sig = cortes[i + 1];
  if (sig === undefined || sig - ini > 58) { // cerrar la parte en este corte
    let a = ini, b = cortes[i];
    while (b - a > 58) { partes.push([a, a + 55]); a += 55; } // escena larguísima: partirla
    partes.push([a, b]); ini = b;
  }
}
if (partes.length > 9) throw new Error(`${id}: ${partes.length} partes, Instagram admite 10 con la portada`);
const VERTICAL = '[0:v]scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350,boxblur=28:4,eq=brightness=-0.18[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]';
const archivos = partes.map(([a, b], k) => {
  const out = join(tmp, `parte-${k + 1}.mp4`);
  // Vertical 4:5 (1080×1350), que es lo que muestra la grilla: el video apaisado al centro y el mismo video desenfocado de fondo.
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', a.toFixed(2), '-i', src, '-t', (b - a).toFixed(2), '-filter_complex', VERTICAL, '-map', '[v]', '-map', '0:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-ar', '48000', '-movflags', '+faststart', out]);
  return out;
});
// Portada: un video de 3 s con la miniatura, primero en el carrusel → es lo que se ve en la grilla del perfil.
execFileSync('node', ['scripts/portadas-ig.mjs', id], { stdio: 'ignore' }); // portada vertical diseñada (serie, temporada, episodio)
const mini = join('out', id, 'portada-ig.jpg');
if (existsSync(mini)) {
  const portada = join(tmp, 'portada.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-loop', '1', '-i', mini, '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', '3', '-vf', 'scale=1080:1350,format=yuv420p', '-map', '0:v', '-map', '1:a', '-r', '24', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-c:a', 'aac', '-b:a', '64k', '-shortest', '-movflags', '+faststart', portada]);
  archivos.unshift(portada);
}
let salida;
try {
  salida = execFileSync('node', ['scripts/instagram.mjs', `--carrusel=${archivos.join(',')}`, `--texto=${texto}\n\n👉 Swipe to keep watching (${archivos.length - 1} parts)`], { encoding: 'utf8' });
} catch (e) {
  // A veces Instagram publica igual aunque responda con error: revisar antes de reintentar.
  await new Promise((r) => setTimeout(r, 60000));
  const m = await yaPublicado().catch(() => null);
  if (m) { registrar(m); console.log(new Date().toISOString(), id, 'publicado (con aviso de error):', m.permalink); execFileSync('rm', ['-rf', tmp]); process.exit(0); }
  throw e;
}
console.log(new Date().toISOString(), id, salida.trim());
const hist = existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : [];
const ult = hist[hist.length - 1];
if (ult && ult.archivo === archivos[0]) { ult.id = id; ult.tipo = 'episodio'; writeFileSync(reg, JSON.stringify(hist, null, 1)); }
execFileSync('rm', ['-rf', tmp]);
