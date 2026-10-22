// Sube un episodio o un Short a YouTube con Upload-Post (sin arrastrar archivos).
// Uso:
//   node scripts/subir.mjs <id>                      → episodio, público ya
//   node scripts/subir.mjs <id> --programar=2026-10-13T10:00:00 [--tz=America/New_York]
//   node scripts/subir.mjs <id> --short=2 [--programar=…]
//   node scripts/subir.mjs <short-…-quien-…> --horizontal --lista=<id>  → versión 16:9 del "Who is…?" (video normal)
//   --lista=<playlistId>  (si no, la busca por nombre en src/videos/listas.json)
//   --probar              → muestra lo que mandaría, sin subir
// Episodio: título, descripción con capítulos, etiquetas, subtítulos en/es, lista, idioma, categoría Education,
// no apto para niños, contenido sintético = sí. Short: título "<gancho> #Shorts" y link al episodio.
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import { conGancho, desplazarCapitulos, conPregunta, preguntaDe } from './gancho-horizontal.mjs';
import { metaQuienHorizontal } from './quien-meta.mjs';

const [id, ...resto] = process.argv.slice(2);
const opt = (k) => resto.find((a) => a.startsWith(`--${k}=`))?.split('=').slice(1).join('=');
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const KEY = env.UPLOAD_POST_API_KEY, USER = env.UPLOAD_POST_USER || 'default';
const out = join('out', id);
const g = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
const ids = JSON.parse(readFileSync('src/videos/youtube-ids.json', 'utf8'));
const listas = existsSync('src/videos/listas.json') ? JSON.parse(readFileSync('src/videos/listas.json', 'utf8')) : {};
const nShort = opt('short');
let srtDe = (l) => join(out, `${id}.${l}.srt`); // con cartel gancho: los .srt corridos de out/<id>/con-gancho/

const esNativo = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8')).formato === 'short';
// --horizontal: la versión 16:9 de un "Who is…?" (scripts/quien-horizontal.mjs): video normal, con .srt y miniatura
const horizontal = resto.includes('--horizontal');
if (horizontal && !g.quien) throw new Error(`${id}: --horizontal es solo para Shorts "Who is…?"`);
/** Clave en youtube-ids.json (el Short ocupa la del id). */
const claveId = horizontal ? `${id}-horizontal` : id;
if (!nShort && !esNativo) execFileSync('node', ['scripts/youtube-meta.mjs', id], { stdio: 'ignore' });
const meta = nShort || esNativo ? null : JSON.parse(readFileSync(join(out, 'youtube.json'), 'utf8'));
const campos = [];
const add = (k, v) => campos.push(['-F', `${k}=${v}`]);
add('user', USER);
add('platform[]', 'youtube');
let archivo;
const nativo = g.formato === 'short' && !horizontal;
if (horizontal) {
  archivo = join(out, `${id}.en.mp4`);
  const m = metaQuienHorizontal(g, { ids });
  add('title', m.titulo);
  add('description', m.descripcion);
  m.etiquetas.forEach((t) => add('tags[]', t));
  const lista = opt('lista') || listas[m.lista];
  if (lista) add('youtube_playlist_id', lista);
  for (const [n, [l, nombre]] of [['en', 'English'], ['es', 'Español']].entries()) {
    const srt = srtDe(l);
    if (existsSync(srt)) { campos.push(['-F', `youtube_subtitle_file_${n}=@${srt}`]); add(`youtube_subtitle_language_${n}`, l); add(`youtube_subtitle_name_${n}`, nombre); }
  }
  const mini = join(out, 'miniatura.jpg');
  if (existsSync(mini) && !resto.includes('--sin-miniatura')) campos.push(['-F', `thumbnail=@${mini}`]);
} else if (nativo) {
  // Short nativo (historia propia, vertical): link al episodio relacionado y cierre del guion.
  archivo = join(out, `${id}.mp4`);
  const ep = g.episodio, gEp = ep && existsSync(join('src/videos', ep, 'guion.json')) ? JSON.parse(readFileSync(join('src/videos', ep, 'guion.json'), 'utf8')) : null;
  const S = { nordicas: ['Norse', '#NorseMythology #Vikings'], egipcias: ['Egyptian', '#EgyptianMythology #AncientEgypt'], hawaianas: ['Hawaiian', '#HawaiianMythology #Polynesian'], norteamericanas: ['Native American', '#NativeAmericanMythology'], aztecas: ['Aztec', '#AztecMythology #Mexica'], balinesas: ['Balinese', '#BalineseMythology #Bali'], hindues: ['Hindu', '#HinduMythology #IndianMythology'], maories: ['Māori', '#MaoriMythology #Aotearoa'], biblia: ['The Bible', '#Bible #KJV'], griegas: ['Greek', '#GreekMythology #GreekGods'] }[g.serie ?? 'griegas'];
  add('title', `${g.gancho.en} #Shorts`);
  const full = gEp && ids[ep] ? `\n\nThe full story: ${gEp.titulo.en} (${S[0]} Mythology Ep. ${Number(gEp.numero)})\nhttps://youtu.be/${ids[ep]}` : '';
  const cierre = g.cierre?.en && !/Ep\. \d|S\d+E\d+/.test(g.cierre.en) ? `\n${g.cierre.en}` : '';
  add('description', `${g.gancho.en}${cierre}${full}\n\nLearn mythology the easy and fun way: subscribe to Myths on Clay.\n\n${S[1]} #Mythology #Shorts`);
  ['mythology', `${S[0].toLowerCase()} mythology`, 'myths', 'animated mythology', 'myths on clay', 'shorts'].forEach((t) => add('tags[]', t));
} else if (nShort) {
  const sh = g.shorts[Number(nShort) - 1];
  archivo = join(out, `short-${nShort}.mp4`);
  const titulo = `${sh.gancho.en} #Shorts`;
  const serie = g.serie === 'nordicas' ? 'Norse' : g.serie === 'egipcias' ? 'Egyptian' : g.serie === 'hawaianas' ? 'Hawaiian' : g.serie === 'norteamericanas' ? 'Native American' : g.serie === 'hindues' ? 'Hindu' : g.serie === 'aztecas' ? 'Aztec' : g.serie === 'balinesas' ? 'Balinese' : g.serie === 'maories' ? 'Māori' : g.serie === 'biblia' ? 'The Bible' : 'Greek';
  const tag = g.serie === 'nordicas' ? '#NorseMythology #Vikings' : g.serie === 'egipcias' ? '#EgyptianMythology #AncientEgypt' : g.serie === 'hawaianas' ? '#HawaiianMythology #Polynesian' : g.serie === 'norteamericanas' ? '#NativeAmericanMythology #IndigenousStories' : g.serie === 'hindues' ? '#HinduMythology #IndianMythology' : g.serie === 'aztecas' ? '#AztecMythology #Mexica' : g.serie === 'balinesas' ? '#BalineseMythology #Bali' : g.serie === 'maories' ? '#MaoriMythology #Aotearoa' : '#GreekMythology';
  const link = ids[id] ? `\nhttps://youtu.be/${ids[id]}` : '';
  add('title', titulo);
  add('description', `${sh.gancho.en}. The full story: ${g.titulo.en} (${serie} Mythology Ep. ${Number(g.numero)})${link}\n\n${tag} #Mythology #Shorts`);
} else {
  archivo = join(out, `${id}.en.mp4`);
  // cartel gancho de 2 s adelante (scripts/gancho-horizontal.mjs): sin re-renderizar el episodio; si falla, va sin cartel
  const cg = resto.includes('--probar') || resto.includes('--sin-gancho') ? null
    : await conGancho(id).catch((e) => { console.log(`cartel gancho: ${String(e.message).slice(0, 200)} (se sube sin cartel)`); return null; });
  if (cg) { archivo = cg.archivo; srtDe = (l) => cg.srt[l] ?? join(out, `${id}.${l}.srt`); console.log('cartel gancho: ok'); }
  add('title', meta.titulo);
  // "Previous episode" = título del episodio anterior de la misma serie
  const prev = Object.keys(ids).length && (() => { const fs = JSON.parse(execFileSync('ls', ['src/videos']).toString().split('\n').filter(Boolean).map((d) => JSON.stringify(d)).join(',').replace(/^/, '[').replace(/$/, ']')); const d = fs.find((x) => x.startsWith(g.serie + '-' + String(Number(g.numero) - 1).padStart(2, '0'))); return d ? JSON.parse(readFileSync(join('src/videos', d, 'guion.json'), 'utf8')).titulo.en : null; })();
  let desc = meta.descripcion.replace('📜 ', '').replace('▶ ', '');
  if (prev && !g.especial) desc = desc.replace('Next episode:', `Previous episode: ${prev}\nNext episode:`);
  if (cg) desc = desplazarCapitulos(desc, cg.seg);
  desc = conPregunta(desc, preguntaDe(g)); // invitar a comentar, justo después del resumen
  add('description', desc);
  [...new Set(meta.etiquetas)].slice(0, 30).forEach((t) => add('tags[]', t));
  const lista = opt('lista') || listas[meta.lista];
  if (lista) add('youtube_playlist_id', lista);
  for (const [n, [l, nombre]] of [['en', 'English'], ['es', 'Español']].entries()) {
    const srt = srtDe(l);
    if (existsSync(srt)) { campos.push(['-F', `youtube_subtitle_file_${n}=@${srt}`]); add(`youtube_subtitle_language_${n}`, l); add(`youtube_subtitle_name_${n}`, nombre); }
  }
  const mini = join(out, 'miniatura.jpg');
  if (existsSync(mini) && !resto.includes('--sin-miniatura')) campos.push(['-F', `thumbnail=@${mini}`]);
}
if (!existsSync(archivo)) throw new Error(`no existe ${archivo}`);
campos.push(['-F', `video=@${archivo}`]);
add('categoryId', '27'); // Education
add('privacyStatus', 'public');
add('selfDeclaredMadeForKids', 'false');
add('containsSyntheticMedia', 'false'); // animación claramente no realista: sin etiqueta de IA (decisión de Matías 2026-10-13)
add('defaultLanguage', 'en');
add('defaultAudioLanguage', 'en');
add('async_upload', 'true');
const cuando = opt('programar');
if (cuando) { add('scheduled_date', cuando); add('timezone', opt('tz') || 'America/New_York'); }

// --api: directo con nuestra YouTube Data API (cuota 10.000/día: video 1600, subtítulo 400, lista 50).
if (resto.includes('--api')) {
  const val = (k) => campos.filter((c) => c[1].startsWith(`${k}=`)).map((c) => c[1].slice(k.length + 1));
  const meta = { titulo: val('title')[0], descripcion: val('description')[0], etiquetas: val('tags[]'), ...(cuando ? { publicar: new Date(cuando + (opt('tz') ? '' : '-04:00')).toISOString() } : {}) };
  const tmp = join(out, `.meta-api-${nShort ?? (horizontal ? 'horizontal' : nativo ? 'short' : 'ep')}.json`);
  writeFileSync(tmp, JSON.stringify(meta));
  if (resto.includes('--probar')) { console.log(meta); process.exit(0); }
  const yt = (...x) => execFileSync('node', ['scripts/youtube-api.mjs', ...x], { encoding: 'utf8', maxBuffer: 1 << 24 }).trim();
  const vid = JSON.parse(yt('subir', archivo, tmp).split('\n').pop()).id;
  console.log(`subido: https://youtu.be/${vid}`);
  const lista = val('youtube_playlist_id')[0];
  if (lista) console.log(yt('agregar', lista, vid));
  if (!nShort && !nativo) for (const [l, nombre] of [['en', 'English'], ['es', 'Español']]) {
    const srt = srtDe(l);
    if (existsSync(srt)) try { console.log(yt('subtitulos', vid, srt, l, nombre)); } catch (e) { console.log(`subtítulos ${l}: ${String(e.message).slice(0, 200)}`); }
  }
  const miniApi = join(out, 'miniatura.jpg');
  if (!nShort && !nativo && existsSync(miniApi) && !resto.includes('--sin-miniatura')) try { console.log(yt('miniatura', vid, miniApi)); } catch (e) { console.log(`miniatura: ${String(e.message).slice(0, 200)}`); }
  if (!nShort) { ids[claveId] = vid; writeFileSync('src/videos/youtube-ids.json', JSON.stringify(ids, null, 2)); }
  const reg = 'out/subidas-api.json';
  const hist = existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : [];
  hist.push({ id: claveId, short: nShort ?? (horizontal ? 'horizontal' : nativo ? 'nativo' : null), video: vid, cuando: cuando ?? 'ya', fecha: new Date().toISOString() });
  writeFileSync(reg, JSON.stringify(hist, null, 1));
  process.exit(0);
}
const args = ['-s', '-X', 'POST', 'https://api.upload-post.com/api/upload', '-H', `Authorization: Apikey ${KEY}`, '-H', `Idempotency-Key: ${id}-${nShort ?? (horizontal ? "horizontal" : "ep")}-${cuando ?? "ya"}${opt("intento") ? "-" + opt("intento") : ""}`, ...campos.flat()];
if (resto.includes('--probar')) { console.log(campos.map((c) => c[1].replace(/=@.*\//, '=@…/')).join('\n')); process.exit(0); }
const r = JSON.parse(execFileSync('curl', args, { encoding: 'utf8', maxBuffer: 1 << 24 }));
console.log(JSON.stringify(r, null, 1).slice(0, 800));
const reg = 'out/subidas-upload-post.json';
const hist = existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : [];
hist.push({ id, short: nShort ?? null, archivo: basename(archivo), cuando: cuando ?? 'ya', request_id: r.request_id ?? null, job_id: r.job_id ?? null, fecha: new Date().toISOString() });
writeFileSync(reg, JSON.stringify(hist, null, 1));
