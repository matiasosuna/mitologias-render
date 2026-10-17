// Láminas (stills PNG) de composiciones de src/pruebas, para revisar sin la Mac. Lo usa el workflow "laminas".
// Uso: node scripts/laminas.mjs resolver "g-hoja,n-comparacion"         → JSON [{archivo,id}] (busca id="…" en src/pruebas)
//      node scripts/laminas.mjs render "g-hoja,otro.tsx:id" [--frame=60] → out/laminas/<id>.png con `npx remotion still`
//      (también vale "src/pruebas/archivo.tsx:id" para ids armados dinámicamente)
import { readdirSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

/** archivos: { 'src/pruebas/x.tsx': contenido }. Devuelve [{archivo,id}] o tira error con lo que no encontró. */
export function resolverLaminas(ids, archivos) {
  const out = [], faltan = [];
  for (const raw of ids.map((s) => s.trim()).filter(Boolean)) {
    const [a, b] = raw.includes(':') ? raw.split(':') : [null, raw];
    if (a) { out.push({ archivo: a.includes('/') ? a : `src/pruebas/${a}`, id: b }); continue; }
    const hallados = Object.entries(archivos).filter(([, src]) => src.includes(`id="${b}"`) || src.includes(`id='${b}'`)).map(([f]) => f);
    if (hallados.length === 1) out.push({ archivo: hallados[0], id: b });
    else faltan.push(hallados.length ? `${b} (en ${hallados.length} archivos: usa archivo:id)` : b);
  }
  if (faltan.length) throw new Error(`láminas sin archivo: ${faltan.join(', ')}`);
  return out;
}

export function leerPruebas(dir = 'src/pruebas') {
  const r = {};
  for (const f of readdirSync(dir, { recursive: true }).map(String).filter((x) => /\.tsx$/.test(x))) r[join(dir, f)] = readFileSync(join(dir, f), 'utf8');
  return r;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, lista = '', ...resto] = process.argv.slice(2);
  const frame = resto.find((x) => x.startsWith('--frame='))?.split('=')[1] ?? '60';
  const todo = resolverLaminas(lista.split(','), leerPruebas());
  if (cmd === 'resolver') console.log(JSON.stringify(todo));
  else if (cmd === 'render') {
    mkdirSync('out/laminas', { recursive: true });
    for (const { archivo, id } of todo) {
      execFileSync('npx', ['remotion', 'still', archivo, id, `out/laminas/${id}.png`, `--frame=${frame}`], { stdio: 'inherit' });
    }
  } else throw new Error('uso: node scripts/laminas.mjs resolver|render "id1,id2" [--frame=60]');
}
