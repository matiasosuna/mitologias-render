// Pasa los guiones NO publicados (cualquier mitología) a los diseños oficiales de personajes con nombre y extras
// de cada cultura: clave vieja → *_oficial (lib/personajes-oficiales.mjs). Publicados = youtube-ids.json + out/subidas-*.json.
// --todos incluye los ya publicados.
// Uso: node scripts/personajes-oficiales.mjs [--aplicar]   (sin --aplicar solo lista; al final, claves sin equivalente)
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdtempSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { serieDe, aOficiales, parchear, publicados, clavesOficiales } from '../lib/personajes-oficiales.mjs';

const aplicar = process.argv.includes('--aplicar');
const out = join(mkdtempSync(join(tmpdir(), 'ofic-')), 'e.mjs');
await build({ entryPoints: [resolve('src/motor/revisarEncuadre.ts')], bundle: true, platform: 'node', format: 'esm', outfile: out, jsx: 'automatic', logLevel: 'error', loader: { '.png': 'empty', '.jpg': 'empty' }, define: { 'process.env.NODE_ENV': '"production"' } });
const { ELENCO, NOMBRE_EN } = await import(pathToFileURL(out).href);
const oficiales = clavesOficiales();
for (const [s, set] of Object.entries(oficiales)) for (const k of set) if (!ELENCO[k]) throw new Error(`${s}: ${k} no está en el elenco`);
const etiqueta = (k) => NOMBRE_EN[k] ?? ELENCO[k]?.griego ?? '';

const pub = process.argv.includes('--todos') ? new Set() : publicados(); // --todos: también los ya publicados (lo subido no se toca; lo que falte en cada red sale con los diseños nuevos)
let n = 0, tocados = 0;
const sin = new Map();
for (const d of readdirSync('src/videos').sort()) {
  const f = join('src/videos', d, 'guion.json');
  if (!existsSync(f) || pub.has(d)) continue;
  const txt = readFileSync(f, 'utf8'), g = JSON.parse(txt), sangria = (txt.match(/^\{\n( +)"/) ?? [, '  '])[1].length;
  const { cambios, sin: s } = aOficiales(g, d, serieDe(d), oficiales, etiqueta);
  for (const x of s) { const k = `${x.serie}|${x.clave}`; sin.set(k, (sin.get(k) ?? new Set()).add(d)); }
  if (!cambios.length) continue;
  n += cambios.length; tocados++;
  console.log(`${d} (${cambios.length})`); cambios.forEach((c) => console.log('   ' + c.texto));
  if (!aplicar) continue;
  const fiel = JSON.stringify(JSON.parse(txt), null, sangria) + (txt.endsWith('\n') ? '\n' : '') === txt;
  const nuevo = fiel ? JSON.stringify(g, null, sangria) + (txt.endsWith('\n') ? '\n' : '') : parchear(txt, cambios);
  let final = nuevo;
  try { if (JSON.stringify(JSON.parse(nuevo)) !== JSON.stringify(g)) throw new Error('parche distinto'); }
  catch { final = JSON.stringify(g, null, sangria) + (txt.endsWith('\n') ? '\n' : ''); console.log(`   (parche de texto no cuadra: ${d} se reescribe entero con su sangría)`); } // guiones ya publicados formateados a mano
  writeFileSync(f, final);
}
console.log('\n== Sin equivalente oficial (clave, guiones) ==');
for (const [k, ds] of [...sin].sort()) console.log(`${k.replace('|', ': ')}  (${ds.size})`);
console.log(`${n} cambios en ${tocados} guiones${aplicar ? ' aplicados' : ' (sin --aplicar: no se escribió nada)'}`);
