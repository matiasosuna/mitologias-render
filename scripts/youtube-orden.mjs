// Ordena cada lista de reproducción por número de episodio ("… Ep. N" en el título). Uso: node scripts/youtube-orden.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
execFileSync('node', ['scripts/youtube-api.mjs', 'videos'], { stdio: 'ignore' }); // refresca el token si hace falta
let t = JSON.parse(readFileSync('.yt-token.json', 'utf8'));
if (t.vence < Date.now() + 60000) {
  const r = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: env.YT_CLIENT_ID, client_secret: env.YT_CLIENT_SECRET, refresh_token: t.refresh_token, grant_type: 'refresh_token' }) })).json();
  t = { ...t, ...r, vence: Date.now() + r.expires_in * 1000 }; writeFileSync('.yt-token.json', JSON.stringify(t), { mode: 0o600 });
}
const api = async (m, ruta, q, json) => { const r = await fetch(`https://www.googleapis.com/youtube/v3${ruta}?${new URLSearchParams(q)}`, { method: m, headers: { authorization: `Bearer ${t.access_token}`, ...(json ? { 'content-type': 'application/json' } : {}) }, body: json ? JSON.stringify(json) : undefined }); const j = await r.json(); if (j.error) throw new Error(j.error.message); return j; };
const listas = JSON.parse(readFileSync('src/videos/listas.json', 'utf8'));
for (const [nombre, id] of Object.entries(listas)) {
  const items = (await api('GET', '/playlistItems', { part: 'snippet', playlistId: id, maxResults: '50' })).items;
  const ep = (it) => Number(it.snippet.title.match(/Ep\. (\d+)/)?.[1] ?? 999);
  const orden = [...items].sort((a, b) => ep(a) - ep(b));
  let movidos = 0;
  for (let i = 0; i < orden.length; i++) {
    const actual = (await api('GET', '/playlistItems', { part: 'snippet', playlistId: id, maxResults: '50' })).items.findIndex((x) => x.id === orden[i].id);
    if (actual === i) continue;
    await api('PUT', '/playlistItems', { part: 'snippet' }, { id: orden[i].id, snippet: { playlistId: id, resourceId: orden[i].snippet.resourceId, position: i } });
    movidos++;
  }
  console.log(`${nombre}: ${orden.map(ep).join(', ')} (${movidos} movidos)`);
}
