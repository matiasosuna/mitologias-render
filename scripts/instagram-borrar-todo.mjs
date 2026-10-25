// Borra TODAS las publicaciones de @mythsonclay (Matías 2026-10-25: "Borrá todo. Empecemos de cero", con capítulos largos).
// Antes guarda la lista completa en out/ig-respaldo-<fecha>.json y suma cada borrado a out/borrados.json.
//   node scripts/instagram-borrar-todo.mjs --listar     → solo lista
//   node scripts/instagram-borrar-todo.mjs --uno        → borra solo la más vieja (prueba)
//   node scripts/instagram-borrar-todo.mjs --todo       → borra todas
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const TOKEN = env.MOC_PAGE_TOKEN, IG = env.MOC_IG_USER_ID, V = 'v21.0';
if (!TOKEN || !IG) throw new Error('Falta conectar Instagram: node scripts/instagram-auth.mjs');

const g = async (metodo, ruta, q = {}) => {
  const r = await fetch(`https://graph.facebook.com/${V}${ruta}?${new URLSearchParams({ ...q, access_token: TOKEN })}`, { method: metodo });
  const j = await r.json();
  if (j.error) throw new Error(`${ruta}: ${j.error.message}`);
  return j;
};

const todas = [];
let pag = await g('GET', `/${IG}/media`, { fields: 'id,media_type,media_product_type,timestamp,permalink,caption', limit: '100' });
for (;;) {
  todas.push(...pag.data);
  if (!pag.paging?.next) break;
  pag = await (await fetch(pag.paging.next)).json();
}
todas.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
const resp = `out/ig-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
if (!existsSync(resp)) writeFileSync(resp, JSON.stringify(todas, null, 1));
console.log(`${todas.length} publicaciones (respaldo: ${resp})`);
if (args.includes('--listar')) process.exit(0);

const borrados = existsSync('out/borrados.json') ? JSON.parse(readFileSync('out/borrados.json', 'utf8')) : [];
let ok = 0, mal = 0;
for (const m of args.includes('--uno') ? todas.slice(0, 1) : todas) {
  try {
    await g('DELETE', `/${m.id}`);
    if (!borrados.includes(m.id)) borrados.push(m.id); // estado.mjs quita sus registros de subidas-instagram
    ok++;
  } catch (e) { mal++; console.log(`${m.id}: ${e.message}`); }
}
writeFileSync('out/borrados.json', JSON.stringify(borrados, null, 1));
console.log(`borradas ${ok}, fallaron ${mal}`);
