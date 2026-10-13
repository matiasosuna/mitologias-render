// YouTube Data API (sin dependencias): miniaturas, subtítulos y listas de los videos ya subidos.
// Los videos se siguen subiendo a mano (por API quedarían privados por ser una app sin verificar).
// Uso:
//   node scripts/youtube-api.mjs auth                         → abre el consentimiento una vez y guarda el token
//   node scripts/youtube-api.mjs videos                       → lista los videos del canal (id, título, estado)
//   node scripts/youtube-api.mjs miniatura <videoId> <archivo.jpg>
//   node scripts/youtube-api.mjs subtitulos <videoId> <archivo.srt> <idioma> [nombre]
//   node scripts/youtube-api.mjs lista <título> [descripción]  → crea (o encuentra) una lista pública e imprime su id
//   node scripts/youtube-api.mjs agregar <listaId> <videoId>
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';

const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const CLIENT = { id: env.YT_CLIENT_ID, secret: env.YT_CLIENT_SECRET };
const TOKEN = '.yt-token.json';
const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
const API = 'https://www.googleapis.com/youtube/v3';

async function tokenNuevo(body) {
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: CLIENT.id, client_secret: CLIENT.secret, ...body }) });
  const j = await r.json();
  if (!r.ok) throw new Error(`token: ${JSON.stringify(j)}`);
  return j;
}

async function autorizar() {
  const puerto = 8766, redirect = `http://127.0.0.1:${puerto}`;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({ client_id: CLIENT.id, redirect_uri: redirect, response_type: 'code', scope: SCOPE, access_type: 'offline', prompt: 'consent' })}`;
  const code = await new Promise((ok) => {
    const srv = createServer((req, res) => {
      const c = new URL(req.url, redirect).searchParams.get('code');
      res.end(c ? 'Listo, ya podes cerrar esta pestana.' : 'Falta el codigo.');
      if (c) { srv.close(); ok(c); }
    }).listen(puerto, '127.0.0.1');
    console.log(`Abrí este enlace y aceptá:\n${url}`);
  });
  const t = await tokenNuevo({ code, grant_type: 'authorization_code', redirect_uri: redirect });
  writeFileSync(TOKEN, JSON.stringify({ ...t, vence: Date.now() + t.expires_in * 1000 }), { mode: 0o600 });
  console.log('token guardado');
}

async function acceso() {
  if (!existsSync(TOKEN)) throw new Error('Primero: node scripts/youtube-api.mjs auth');
  const t = JSON.parse(readFileSync(TOKEN, 'utf8'));
  if (t.vence > Date.now() + 60_000) return t.access_token;
  const n = await tokenNuevo({ refresh_token: t.refresh_token, grant_type: 'refresh_token' });
  writeFileSync(TOKEN, JSON.stringify({ ...t, ...n, vence: Date.now() + n.expires_in * 1000 }), { mode: 0o600 });
  return n.access_token;
}

async function api(metodo, ruta, { query = {}, json, cuerpo, tipo } = {}) {
  const r = await fetch(`${ruta.startsWith('http') ? ruta : API + ruta}?${new URLSearchParams(query)}`, {
    method: metodo,
    headers: { authorization: `Bearer ${await acceso()}`, ...(json ? { 'content-type': 'application/json' } : tipo ? { 'content-type': tipo } : {}) },
    body: json ? JSON.stringify(json) : cuerpo,
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`${metodo} ${ruta} → ${r.status} ${txt.slice(0, 400)}`);
  return txt ? JSON.parse(txt) : {};
}

/** Subida multipart (metadatos JSON + archivo) para subtítulos. */
function multipart(meta, datos, tipo) {
  const b = 'mitos' + Date.now();
  const cuerpo = Buffer.concat([
    Buffer.from(`--${b}\r\ncontent-type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${b}\r\ncontent-type: ${tipo}\r\n\r\n`),
    datos, Buffer.from(`\r\n--${b}--`),
  ]);
  return { cuerpo, tipo: `multipart/related; boundary=${b}` };
}

const [cmd, ...a] = process.argv.slice(2);
if (cmd === 'auth') await autorizar();
else if (cmd === 'videos') {
  const canal = await api('GET', '/channels', { query: { part: 'contentDetails,snippet', mine: 'true' } });
  const subidas = canal.items[0].contentDetails.relatedPlaylists.uploads;
  console.log(`canal: ${canal.items[0].snippet.title}`);
  let page;
  do {
    const p = await api('GET', '/playlistItems', { query: { part: 'snippet,status', playlistId: subidas, maxResults: '50', ...(page ? { pageToken: page } : {}) } });
    for (const it of p.items) console.log(`${it.snippet.resourceId.videoId}\t${it.status.privacyStatus}\t${it.snippet.title}`);
    page = p.nextPageToken;
  } while (page);
} else if (cmd === 'sin-ia') {
  // Saca la marca "contenido alterado o sintético" de todos los videos del canal (o de los ids dados), sin tocar el resto del estado.
  let ids = a;
  if (!ids.length) {
    const subidas = (await api('GET', '/channels', { query: { part: 'contentDetails', mine: 'true' } })).items[0].contentDetails.relatedPlaylists.uploads;
    let page; ids = [];
    do { const p = await api('GET', '/playlistItems', { query: { part: 'snippet', playlistId: subidas, maxResults: '50', ...(page ? { pageToken: page } : {}) } }); ids.push(...p.items.map((it) => it.snippet.resourceId.videoId)); page = p.nextPageToken; } while (page);
  }
  for (let i = 0; i < ids.length; i += 50) {
    const v = await api('GET', '/videos', { query: { part: 'status', id: ids.slice(i, i + 50).join(',') } });
    for (const it of v.items) {
      if (it.status.containsSyntheticMedia === false) { console.log(`${it.id} ya estaba`); continue; }
      const { privacyStatus, publishAt, license, embeddable, publicStatsViewable, selfDeclaredMadeForKids } = it.status;
      const status = { privacyStatus, license, embeddable, publicStatsViewable, selfDeclaredMadeForKids: selfDeclaredMadeForKids ?? false, containsSyntheticMedia: false, ...(publishAt && privacyStatus === 'private' && new Date(publishAt) > new Date() ? { publishAt } : {}) };
      try { await api('PUT', '/videos', { query: { part: 'status' }, json: { id: it.id, status } }); } catch (e) { console.log(`${it.id} ERROR ${String(e.message).slice(0, 120)}`); continue; }
      console.log(`${it.id} sin etiqueta (${privacyStatus}${publishAt ? ' ' + publishAt : ''})`);
    }
  }
} else if (cmd === 'canal') {
  const s = (await api('GET', '/channels', { query: { part: 'statistics', mine: 'true' } })).items[0].statistics;
  console.log(`suscriptores ${s.subscriberCount} · vistas ${s.viewCount} · videos ${s.videoCount}`);
} else if (cmd === 'miniatura') {
  const [videoId, archivo] = a;
  await api('POST', 'https://www.googleapis.com/upload/youtube/v3/thumbnails/set', { query: { videoId, uploadType: 'media' }, cuerpo: readFileSync(archivo), tipo: archivo.endsWith('.png') ? 'image/png' : 'image/jpeg' });
  console.log(`miniatura ok: ${videoId}`);
} else if (cmd === 'subtitulos') {
  const [videoId, archivo, idioma, nombre = ''] = a;
  const previos = await api('GET', '/captions', { query: { part: 'snippet', videoId } });
  for (const c of previos.items.filter((c) => c.snippet.language === idioma && c.snippet.trackKind !== 'asr')) await api('DELETE', '/captions', { query: { id: c.id } });
  const { cuerpo, tipo } = multipart({ snippet: { videoId, language: idioma, name: nombre, isDraft: false } }, readFileSync(archivo), 'application/octet-stream');
  await api('POST', 'https://www.googleapis.com/upload/youtube/v3/captions', { query: { part: 'snippet', uploadType: 'multipart' }, cuerpo, tipo });
  console.log(`subtítulos ok: ${videoId} ${idioma}`);
} else if (cmd === 'lista') {
  const [titulo, descripcion = ''] = a;
  const mias = await api('GET', '/playlists', { query: { part: 'snippet', mine: 'true', maxResults: '50' } });
  const ya = mias.items.find((p) => p.snippet.title === titulo);
  if (ya) console.log(ya.id);
  else console.log((await api('POST', '/playlists', { query: { part: 'snippet,status' }, json: { snippet: { title: titulo, description: descripcion, defaultLanguage: 'en' }, status: { privacyStatus: 'public' } } })).id);
} else if (cmd === 'agregar') {
  const [playlistId, videoId] = a;
  await api('POST', '/playlistItems', { query: { part: 'snippet' }, json: { snippet: { playlistId, resourceId: { kind: 'youtube#video', videoId } } } });
  console.log(`agregado ${videoId} → ${playlistId}`);
} else if (cmd === 'listas') {
  const mias = await api('GET', '/playlists', { query: { part: 'snippet', mine: 'true', maxResults: '50' } });
  const mapa = Object.fromEntries(mias.items.map((p) => [p.snippet.title, p.id]));
  writeFileSync('src/videos/listas.json', JSON.stringify(mapa, null, 1));
  console.log(mapa);
} else if (cmd === 'subir') {
  // Subida reanudable directa a YouTube. Hasta que Google apruebe la auditoría, YouTube puede dejarla bloqueada en privado.
  const [archivo, metaJson] = a;
  const m = JSON.parse(readFileSync(metaJson, 'utf8'));
  const datos = { length: statSync(archivo).size };
  const cuerpoMeta = {
    snippet: { title: m.titulo, description: m.descripcion ?? '', tags: m.etiquetas ?? [], categoryId: '27', defaultLanguage: 'en', defaultAudioLanguage: 'en' },
    // Se crea en privado: si la subida del archivo falla (límite diario), no queda un video vacío público.
    status: { privacyStatus: 'private', selfDeclaredMadeForKids: false, containsSyntheticMedia: false, ...(m.publicar ? { publishAt: m.publicar } : {}) },
  };
  const ini = await fetch(`https://www.googleapis.com/upload/youtube/v3/videos?${new URLSearchParams({ uploadType: 'resumable', part: 'snippet,status' })}`, {
    method: 'POST', headers: { authorization: `Bearer ${await acceso()}`, 'content-type': 'application/json; charset=UTF-8', 'x-upload-content-type': 'video/mp4', 'x-upload-content-length': String(datos.length) }, body: JSON.stringify(cuerpoMeta),
  });
  if (!ini.ok) throw new Error(`subir (inicio) → ${ini.status} ${(await ini.text()).slice(0, 400)}`);
  // El PUT va con curl: fetch de Node corta a los 5 min sin respuesta (videos grandes tardan más).
  const salida = execFileSync('curl', ['-s', '-X', 'PUT', '-H', 'content-type: video/mp4', '--upload-file', archivo, '-w', '\n%{http_code}', ini.headers.get('location')], { encoding: 'utf8', maxBuffer: 1 << 26 });
  const codigo = Number(salida.trim().split('\n').pop());
  const j = JSON.parse(salida.trim().split('\n').slice(0, -1).join('\n') || '{}');
  if (codigo >= 300) throw new Error(`subir → ${codigo} ${JSON.stringify(j).slice(0, 400)}`);
  if (!m.publicar && (m.privacidad ?? 'public') !== 'private') {
    const st = { ...j.status, privacyStatus: m.privacidad ?? 'public' };
    delete st.uploadStatus; delete st.failureReason; delete st.rejectionReason; delete st.publishAt;
    j.status = (await api('PUT', '/videos', { query: { part: 'status' }, json: { id: j.id, status: st } })).status;
  }
  console.log(JSON.stringify({ id: j.id, estado: j.status }));
} else if (cmd === 'estado') {
  const v = await api('GET', '/videos', { query: { part: 'status,processingDetails', id: a[0] } });
  console.log(JSON.stringify(v.items[0]?.status ?? 'no existe'));
} else console.log('comandos: auth | videos | miniatura | subtitulos | lista | listas | agregar | subir | estado');
