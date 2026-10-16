// Episodio vertical partido en Reels de menos de 3 min (Instagram casi no recomienda los más largos a quien no te sigue).
// Corta en el comienzo de una escena (o de una frase) cerca de la mitad; cada parte abre con ~2 s de cartel gancho (el
// título curioso de src/videos/titulos.json), lleva "PART n OF de" y, salvo la última, un cartel final "TO BE CONTINUED · PART n+1". Uso: node scripts/vertical-partes.mjs <id> [<id>…]
// → out/<id>/<id>.parte-1.mp4, .parte-2.mp4 … y out/<id>/partes.json
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import os from 'node:os';
import { ganchoParte, leerTitulos } from './titulos.mjs';

const MAX_S = 175; // contenido por parte (+2 s de gancho +2,5 s de cartel → < 3 min)
const CIERRE_VERTICAL = 3;

/** Puntos de corte (cuadros) del vertical completo: comienzos de escena o, si no alcanza, de frase. */
export function cortes(timeline, extra = 0) {
  const fps = timeline.fps, total = timeline.total - timeline.outroFrames + CIERRE_VERTICAL * fps, max = MAX_S * fps;
  const n = Math.ceil(total / max) + extra;
  if (n <= 1) return { total, partes: [[0, total]] };
  const escenas = timeline.escenas.map((e) => e.from).filter((x) => x > 0);
  const frases = timeline.escenas.flatMap((e) => e.frases.map((f) => e.from + f.from)).filter((x) => x > 0);
  const marcas = [];
  let desde = 0;
  for (let k = 1; k < n; k++) {
    const ideal = desde + (total - desde) / (n - k + 1);
    const validas = (lista) => lista.filter((x) => x > desde && x - desde <= max && total - x <= max * (n - k));
    const cand = validas(escenas).length ? validas(escenas) : validas(frases);
    if (!cand.length) { if (extra > 2) throw new Error('no hay un corte válido'); return cortes(timeline, extra + 1); }
    const corte = cand.reduce((a, b) => (Math.abs(b - ideal) < Math.abs(a - ideal) ? b : a));
    marcas.push(corte); desde = corte;
  }
  const bordes = [0, ...marcas, total];
  return { total, partes: bordes.slice(1).map((b, i) => [bordes[i], b]) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ids = process.argv.slice(2);
  if (!ids.length) throw new Error('Falta el id');
  mkdirSync('public/portadas', { recursive: true });
  for (const id of ids) {
    if (!existsSync(join('out', id, 'portada-ig.jpg'))) execFileSync('node', ['scripts/portadas-ig.mjs', id], { stdio: 'ignore' });
    copyFileSync(join('out', id, 'portada-ig.jpg'), join('public/portadas', `${id}.jpg`));
  }
  const serveUrl = await bundle({ entryPoint: resolve('src/motor/entrada.tsx') });
  process.on('exit', () => rmSync(serveUrl, { recursive: true, force: true }));
  const titulos = leerTitulos();
  for (const id of ids) {
    const gancho = ganchoParte(id, titulos);
    const guion = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
    const timeline = JSON.parse(readFileSync(join('src/videos', id, 'timeline.json'), 'utf8'));
    const { partes } = cortes(timeline);
    const de = partes.length;
    for (const [i, [desde, hasta]] of partes.entries()) {
      const inputProps = { guion, timeline, portada: `portadas/${id}.jpg`, desde, hasta, n: i + 1, de, gancho };
      const comp = await selectComposition({ serveUrl, id: `${id}-parte`, inputProps });
      const out = join('out', id, `${id}.parte-${i + 1}.mp4`);
      await renderMedia({ serveUrl, composition: comp, codec: 'h264', outputLocation: out, crf: 21, timeoutInMilliseconds: 180000, concurrency: Number(process.env.RENDER_CONCURRENCY) || Math.max(2, os.cpus().length - 1), inputProps });
      console.log(`listo: ${out} (${(comp.durationInFrames / comp.fps).toFixed(0)} s)`);
    }
    writeFileSync(join('out', id, 'partes.json'), JSON.stringify({ de, partes, gancho: Boolean(gancho) })); // gancho: con cartel inicial (sembrar no sube partes viejas)
  }
}
