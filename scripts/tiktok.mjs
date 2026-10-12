// TikTok (app propia "Myths on Clay Publisher", Content Posting API → borradores en la app de TikTok).
// Claves en .env (TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET); tokens en .tiktok-token.json (no se imprimen).
// Uso:
//   node scripts/tiktok.mjs auth-url                 → link para autorizar la cuenta
//   node scripts/tiktok.mjs token <code>             → guarda access/refresh token
//   node scripts/tiktok.mjs borrador <archivo.mp4>   → sube el video como borrador (el creador toca Publicar en la app)
//   node scripts/tiktok.mjs estado <publish_id>
import { readFileSync, writeFileSync, existsSync, statSync, openSync, readSync, closeSync } from 'node:fs';

process.chdir(new URL('..', import.meta.url).pathname);
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const KEY = env.TIKTOK_CLIENT_KEY, SECRET = env.TIKTOK_CLIENT_SECRET;
const REDIRECT = 'https://myths-on-clay.osuna-devs.workers.dev/tiktok/callback';
const TOK = '.tiktok-token.json';
const API = 'https://open.tiktokapis.com/v2';

async function tokenPost(params) {
  const r = await fetch(`${API}/oauth/token/`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_key: KEY, client_secret: SECRET, ...params }) });
  const j = await r.json();
  if (!j.access_token) throw new Error(`token: ${j.error ?? ''} ${j.error_description ?? JSON.stringify(j).slice(0, 200)}`);
  const t = { ...j, vence: Date.now() + (j.expires_in - 120) * 1000, vence_refresh: Date.now() + (j.refresh_expires_in - 3600) * 1000 };
  writeFileSync(TOK, JSON.stringify(t), { mode: 0o600 });
  return t;
}
async function acceso() {
  if (!existsSync(TOK)) throw new Error('Falta autorizar: node scripts/tiktok.mjs auth-url');
  let t = JSON.parse(readFileSync(TOK, 'utf8'));
  if (Date.now() > t.vence) t = await tokenPost({ grant_type: 'refresh_token', refresh_token: t.refresh_token });
  return t.access_token;
}
async function api(ruta, cuerpo) {
  const r = await fetch(`${API}${ruta}`, { method: 'POST', headers: { Authorization: `Bearer ${await acceso()}`, 'Content-Type': 'application/json; charset=UTF-8' }, body: JSON.stringify(cuerpo) });
  const j = await r.json();
  if (j.error?.code && j.error.code !== 'ok') throw new Error(`${ruta}: ${j.error.code} ${j.error.message}`);
  return j.data;
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'auth-url') {
  console.log(`https://www.tiktok.com/v2/auth/authorize/?${new URLSearchParams({ client_key: KEY, scope: 'user.info.basic,video.upload', response_type: 'code', redirect_uri: REDIRECT, state: 'moc' })}`);
} else if (cmd === 'token') {
  await tokenPost({ grant_type: 'authorization_code', code: decodeURIComponent(arg), redirect_uri: REDIRECT });
  console.log('tiktok conectado');
} else if (cmd === 'borrador') {
  const tam = statSync(arg).size;
  const CH = 10_000_000, n = Math.max(1, Math.floor(tam / CH)); // TikTok: partes de 5–64 MB; la última junta el resto
  const trozo = n === 1 ? tam : CH;
  const d = await api('/post/publish/inbox/video/init/', { source_info: { source: 'FILE_UPLOAD', video_size: tam, chunk_size: trozo, total_chunk_count: n } });
  const fd = openSync(arg, 'r');
  for (let i = 0; i < n; i++) {
    const desde = i * trozo, hasta = i === n - 1 ? tam - 1 : desde + trozo - 1, buf = Buffer.alloc(hasta - desde + 1);
    readSync(fd, buf, 0, buf.length, desde);
    const r = await fetch(d.upload_url, { method: 'PUT', headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(buf.length), 'Content-Range': `bytes ${desde}-${hasta}/${tam}` }, body: buf });
    if (r.status >= 300 && r.status !== 206) throw new Error(`subida parte ${i + 1}: ${r.status} ${(await r.text()).slice(0, 200)}`);
  }
  closeSync(fd);
  console.log(`borrador enviado: ${d.publish_id}`);
} else if (cmd === 'estado') {
  console.log(JSON.stringify(await api('/post/publish/status/fetch/', { publish_id: arg })));
} else {
  console.log('comandos: auth-url | token <code> | borrador <mp4> | estado <publish_id>');
}
