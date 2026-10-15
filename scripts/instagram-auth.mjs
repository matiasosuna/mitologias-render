// Conecta @mythsonclay a la app de Meta "Maybe's Studio" (la misma de los videos de viajes) y guarda en .env:
// IG_APP_ID/IG_APP_SECRET (copiados de ~/Projects/viajes/.env), MOC_PAGE_ID, MOC_PAGE_TOKEN, MOC_IG_USER_ID.
// Nunca imprime claves. Uso: node scripts/instagram-auth.mjs  → abre el enlace, aceptás, y listo.
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { homedir } from 'node:os';

const leer = (p) => Object.fromEntries(readFileSync(p, 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const viajes = leer(`${homedir()}/Projects/viajes/.env`);
const APP = viajes.META_APP_ID, SECRET = viajes.META_APP_SECRET, V = 'v21.0';
const puerto = 8777, redirect = `http://localhost:${puerto}/`;
const scope = 'pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish,instagram_manage_insights,business_management';
const url = `https://www.facebook.com/${V}/dialog/oauth?${new URLSearchParams({ client_id: APP, redirect_uri: redirect, scope, response_type: 'code', auth_type: 'rerequest' })}`;
const g = async (ruta, q) => { const r = await fetch(`https://graph.facebook.com/${V}${ruta}?${new URLSearchParams(q)}`); const j = await r.json(); if (j.error) throw new Error(`${ruta}: ${j.error.message}`); return j; };

const code = await new Promise((ok) => {
  const srv = createServer((req, res) => {
    const u = new URL(req.url, redirect), c = u.searchParams.get('code');
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(c ? '<h2>Listo, Myths on Clay conectado. Podés cerrar esta pestaña.</h2>' : `<h2>Falta el código: ${u.searchParams.get('error_description') ?? ''}</h2>`);
    if (c) { srv.close(); ok(c); }
  }).listen(puerto);
  console.log(`URL ${url}`);
});
const corto = await g('/oauth/access_token', { client_id: APP, client_secret: SECRET, redirect_uri: redirect, code });
const largo = await g('/oauth/access_token', { grant_type: 'fb_exchange_token', client_id: APP, client_secret: SECRET, fb_exchange_token: corto.access_token });
const paginas = await g('/me/accounts', { fields: 'name,id,access_token,instagram_business_account{id,username}', access_token: largo.access_token });
const p = paginas.data.find((x) => x.instagram_business_account?.username?.toLowerCase() === 'mythsonclay') ?? paginas.data.find((x) => /myths on clay/i.test(x.name));
if (!p) { console.log('No veo la página de Myths on Clay. Páginas autorizadas:', paginas.data.map((x) => x.name).join(', ') || 'ninguna'); process.exit(1); }
if (!p.instagram_business_account) { console.log(`La página ${p.name} no tiene Instagram profesional unido todavía.`); process.exit(1); }
const env = readFileSync('.env', 'utf8').split('\n').filter((l) => !/^(IG_APP_ID|IG_APP_SECRET|MOC_PAGE_ID|MOC_PAGE_TOKEN|MOC_IG_USER_ID)=/.test(l));
while (env.length && env[env.length - 1] === '') env.pop();
env.push(`IG_APP_ID=${APP}`, `IG_APP_SECRET=${SECRET}`, `MOC_PAGE_ID=${p.id}`, `MOC_PAGE_TOKEN=${p.access_token}`, `MOC_IG_USER_ID=${p.instagram_business_account.id}`, '');
writeFileSync('.env', env.join('\n'), { mode: 0o600 });
console.log(`OK: página "${p.name}" + Instagram @${p.instagram_business_account.username} guardados en .env`);
