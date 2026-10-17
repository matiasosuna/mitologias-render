// Pasa los guiones NO publicados (cualquier mitología) a los animales épicos: clave vieja → épica (lib/animales-epicos.mjs).
// Publicados = src/videos/youtube-ids.json + out/subidas-*.json: esos no se tocan.
// --todos incluye los ya publicados.
// Uso: node scripts/animales-epicos.mjs [--aplicar]   (sin --aplicar solo lista los cambios)
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdtempSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { MAPA, POR_ID, serieDe, aEpicos, parchear, publicados } from '../lib/animales-epicos.mjs';


const aplicar = process.argv.includes('--aplicar');
const out = join(mkdtempSync(join(tmpdir(), 'epicos-')), 'e.mjs');
await build({ entryPoints: [resolve('src/motor/revisarEncuadre.ts')], bundle: true, platform: 'node', format: 'esm', outfile: out, jsx: 'automatic', logLevel: 'error', loader: { '.png': 'empty', '.jpg': 'empty' }, define: { 'process.env.NODE_ENV': '"production"' } });
const { ELENCO, NOMBRE_EN } = await import(pathToFileURL(out).href);
for (const [s, m] of [...Object.entries(MAPA), ...Object.entries(POR_ID)]) for (const k of Object.values(m)) if (!ELENCO[k]) throw new Error(`${s}: ${k} no está en el elenco`);
const etiqueta = (k) => NOMBRE_EN[k] ?? ELENCO[k]?.griego ?? '';

const pub = process.argv.includes('--todos') ? new Set() : publicados(); // --todos: también los ya publicados (lo subido no se toca; lo que falte en cada red sale con los diseños nuevos)
let n = 0;
for (const d of readdirSync('src/videos').sort()) {
  const f = join('src/videos', d, 'guion.json');
  if (!existsSync(f) || pub.has(d)) continue;
  const txt = readFileSync(f, 'utf8'), g = JSON.parse(txt), sangria = (txt.match(/^\{\n( +)"/) ?? [, '  '])[1].length;
  const cambios = aEpicos(g, serieDe(d), etiqueta);
  if (!cambios.length) continue;
  n += cambios.length;
  console.log(`${d} (${cambios.length})`); cambios.forEach((c) => console.log('   ' + c.texto));
  if (!aplicar) continue;
  // mismo formato: si el archivo es JSON.stringify con su sangría, se reescribe; si está formateado a mano, se parchea el texto
  const fiel = JSON.stringify(JSON.parse(txt), null, sangria) + (txt.endsWith('\n') ? '\n' : '') === txt;
  const nuevo = fiel ? JSON.stringify(g, null, sangria) + (txt.endsWith('\n') ? '\n' : '') : parchear(txt, cambios);
  let final = nuevo;
  try { if (JSON.stringify(JSON.parse(nuevo)) !== JSON.stringify(g)) throw new Error('parche distinto'); }
  catch { final = JSON.stringify(g, null, sangria) + (txt.endsWith('\n') ? '\n' : ''); console.log(`   (parche de texto no cuadra: ${d} se reescribe entero con su sangría)`); } // guiones ya publicados formateados a mano
  writeFileSync(f, final);
}
console.log(`${n} cambios${aplicar ? ' aplicados' : ' (sin --aplicar: no se escribió nada)'}`);
