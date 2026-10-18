// Pasa a *_oficial los personajes de las portadas: guion.miniatura.heroe/rival de TODOS los guiones y el mapa MINIS
// (lib/minis.mjs). Mismo mapeo determinista que los actores. Uso: node scripts/miniaturas-oficiales.mjs [--aplicar]
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { clavesOficiales, serieDe } from '../lib/personajes-oficiales.mjs';
import { parOficial } from '../lib/miniaturas-oficiales.mjs';
import { MINIS, MINIS_IG } from '../lib/minis.mjs';

const aplicar = process.argv.includes('--aplicar'), oficiales = clavesOficiales();
let n = 0, sinMapa = 0;
// 1) guiones: se reemplaza solo el texto de las claves (no se reformatea nada)
for (const d of readdirSync('src/videos').sort()) {
  const f = join('src/videos', d, 'guion.json');
  if (!existsSync(f)) continue;
  let txt = readFileSync(f, 'utf8');
  const g = JSON.parse(txt);
  if (!g.miniatura) continue;
  const { par, cambios } = parOficial([g.miniatura.heroe, g.miniatura.rival], d, g, oficiales);
  for (const v of [g.miniatura.heroe, g.miniatura.rival]) if (v && typeof v === 'object' && !v.__como) sinMapa++;
  if (!cambios.length) continue;
  n += cambios.length; console.log(`${d}: ${cambios.join(' | ')}`);
  if (!aplicar) continue;
  const i = txt.indexOf('"miniatura"'); let j = txt.indexOf('{', i), nivel = 0, k = j;
  do { if (txt[k] === '{') nivel++; else if (txt[k] === '}') nivel--; k++; } while (nivel > 0);
  let blk = txt.slice(j, k);
  const poner = (campo, viejo, nuevo) => { blk = blk.replace(new RegExp(`("${campo}"\\s*:\\s*)"${viejo}"`), `$1"${nuevo}"`); };
  [['heroe', g.miniatura.heroe, par[0]], ['rival', g.miniatura.rival, par[1]]].forEach(([campo, ant, nue]) => {
    if (typeof ant === 'string' && ant !== nue) poner(campo, ant, nue);
    else if (ant?.__como && ant.__como !== nue.__como) blk = blk.replace(new RegExp(`("__como"\\s*:\\s*)"${ant.__como}"`), `$1"${nue.__como}"`);
  });
  txt = txt.slice(0, j) + blk + txt.slice(k);
  const g2 = JSON.parse(txt);
  if (JSON.stringify(g2.miniatura) !== JSON.stringify({ ...g.miniatura, heroe: par[0], ...(g.miniatura.rival !== undefined ? { rival: par[1] } : {}) })) throw new Error(`${d}: el parche de la miniatura no cuadra`);
  writeFileSync(f, txt);
}
// 2) mapa MINIS (texto de lib/minis.mjs)
let src = readFileSync('lib/minis.mjs', 'utf8');
for (const [nombre, mapa] of [['MINIS', MINIS], ['MINIS_IG', MINIS_IG]]) for (const [d, par] of Object.entries(mapa)) {
  const gf = join('src/videos', d, 'guion.json'), g = existsSync(gf) ? JSON.parse(readFileSync(gf, 'utf8')) : {};
  const { par: nuevo, cambios } = parOficial(par, d, g, oficiales, serieDe(d));
  if (!cambios.length) continue;
  n += cambios.length; console.log(`${nombre} ${d}: ${cambios.join(' | ')}`);
  const lin = new RegExp(`('${d}': )\\[[^\\]]*\\]`, 'g'), nueva = nuevo.map((x) => (typeof x === 'string' ? `'${x}'` : x === undefined ? null : JSON.stringify(x))).filter(Boolean).join(', ');
  const ini = src.indexOf(`export const ${nombre} =`), fin = src.indexOf('};', ini);
  src = src.slice(0, ini) + src.slice(ini, fin).replace(lin, `$1[${nueva}]`) + src.slice(fin);
}
if (aplicar) writeFileSync('lib/minis.mjs', src);
console.log(`${n} cambios${aplicar ? ' aplicados' : ' (sin --aplicar)'} · ${sinMapa} personajes de portada son props sueltos (sin clave: no se pueden mapear)`);
