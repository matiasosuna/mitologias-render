// Revisor de encuadre (determinista, corre en CI): para cada escena de los guiones pendientes calcula la caja de
// cada actor con su alto real (animales épicos con `alto`) y avisa: fuera de cuadro (16:9 y 9:16), encimados con
// otro actor, o tapando un cartel. Los animales grandes ya los achica/baja el motor (encuadreHorizontal.ts); acá
// se listan los ajustes y lo que quedó sin resolver.
// Uso: node scripts/revisar-encuadre.mjs [slug…] [--todos] [--detalle] [--epicos] [--json]   (sale con 1 si un animal grande no entra)
import { readFileSync, readdirSync, existsSync, mkdtempSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { escenasDe } from '../lib/short.mjs';
import { tiemposShort } from '../lib/quien.mjs';
import { timelineMulti } from '../lib/motor-tiempos.mjs';
import { publicados } from '../lib/animales-epicos.mjs';

const args = process.argv.slice(2), json = args.includes('--json'), todos = args.includes('--todos'), detalle = args.includes('--detalle'), epicos = args.includes('--epicos'); // --epicos: griegos con los animales épicos
const pedidos = args.filter((a) => !a.startsWith('--'));
const out = join(mkdtempSync(join(tmpdir(), 'encuadre-')), 'revisar.mjs');
await build({ entryPoints: [resolve('src/motor/revisarEncuadre.ts')], bundle: true, platform: 'node', format: 'esm', outfile: out, jsx: 'automatic', logLevel: 'error', loader: { '.png': 'empty', '.jpg': 'empty', '.ttf': 'empty', '.woff2': 'empty' }, define: { 'process.env.NODE_ENV': '"production"' } });
const { revisarEscena, conEpicos } = await import(pathToFileURL(out).href);

// pendientes: lo no publicado (youtube-ids.json + out/subidas-*.json)
const pub = publicados();
const dirs = readdirSync('src/videos').filter((d) => existsSync(join('src/videos', d, 'guion.json')))
  .filter((d) => (pedidos.length ? pedidos.includes(d) : todos || !pub.has(d)));

const res = [];
for (const d of dirs) {
  const g = JSON.parse(readFileSync(join('src/videos', d, 'guion.json'), 'utf8'));
  const short = g.formato === 'short', ESC = escenasDe(g);
  const tlp = join('src/videos', d, 'timeline.json');
  const tl = existsSync(tlp) ? JSON.parse(readFileSync(tlp, 'utf8')) : timelineMulti(ESC.map((e) => ({ id: e.id, frases: e.frases.map((t) => ({ texto: t, audio: {}, segundos: { en: short ? (t.en ?? t.es).split(/\s+/).length / 3.2 : 0.6 + (t.en ?? t.es).split(/\s+/).length / 2.3 } })) })), undefined, short ? tiemposShort(g) : undefined);
  ESC.forEach((esc, i) => {
    const et = tl.escenas.find((e) => e.id === esc.id) ?? tl.escenas[i];
    if (!et) return;
    const { avisos, ajustes, grandes } = revisarEscena(epicos && d.startsWith('griegas-') ? conEpicos(esc) : esc, et);
    if (avisos.length || Object.keys(ajustes).length) res.push({ video: d, escena: esc.id, avisos, ajustes, grandes });
  });
}
const grandes = (r) => r.avisos.filter((a) => a.tipo === 'arriba' && a.ids.some((id) => Object.hasOwn(r.grandes, id)));
const graves = res.flatMap(grandes);
if (json) console.log(JSON.stringify({ revisados: dirs.length, escenas: res, graves: graves.length }, null, 1));
else {
  const n = (t) => res.reduce((s, r) => s + r.avisos.filter((a) => a.tipo === t).length, 0);
  console.log(`Encuadre: ${dirs.length} guiones · ${res.filter((r) => Object.keys(r.ajustes).length).length} escenas con animales ajustados · avisos: arriba ${n('arriba')}, costado ${n('costado')}, encima ${n('encima')}, texto ${n('texto')} · sin resolver ${graves.length}`);
  // por defecto solo las escenas con animales grandes (los avisos de personajes viejos: --detalle)
  for (const r of res.filter((x) => detalle || Object.keys(x.grandes).length)) {
    const aj = Object.entries(r.ajustes).map(([id, a]) => `${id} ×${a.k.toFixed(2)}${a.dy ? ` ↓${Math.round(a.dy)}` : ''}${a.dx ? ` ↔${Math.round(a.dx)}` : ''}`).join(', ');
    console.log(`- ${r.video} / ${r.escena}${aj ? ` [ajuste: ${aj}]` : ''}`);
    for (const a of r.avisos) console.log(`    ${a.formato} ${a.tipo}: ${a.ids.join(' + ')} — ${a.detalle}`);
  }
}
process.exitCode = graves.length ? 1 : 0; // sin process.exit: con un pipe cortaría la salida
