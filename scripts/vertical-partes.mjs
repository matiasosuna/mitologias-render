// Episodio vertical partido en Reels de menos de 3 min (Instagram casi no recomienda los más largos a quien no te sigue).
// Corta en el comienzo de una escena (o de una frase) cerca de la mitad; cada parte abre con ~2 s de cartel gancho (el
// título del capítulo, de src/videos/titulos.json), lleva "PART n OF de" y, salvo la última, un cartel final "TO BE CONTINUED · PART n+1".
// Ritmo normal del episodio (timeline.json) por defecto; `--rapido` = ritmo de Short (lib/vertical-rapido.mjs).
// Uso: node scripts/vertical-partes.mjs <id> [<id>…] [--rapido]
// → out/<id>/<id>.parte-1.mp4, .parte-2.mp4 … y out/<id>/partes.json
import { bundle } from '@remotion/bundler';
import { selectComposition, renderStill } from '@remotion/renderer';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import os from 'node:os';
import { ganchoParte, leerTitulos } from './titulos.mjs';
import { prepararRapido } from './vertical-rapido.mjs';
import { huella } from './nube.mjs';
import { renderPartido } from './render-partido.mjs';
import { marcoParte, sobraParte } from '../lib/marco.mjs';

const ENTRADA_PORTADA = 22; // = src/motor/PortadaBiblia.tsx: cuadro en que la portada de pergamino ya está completa

export const MAX_S = 175; // contenido por parte (+2 s de gancho +2,5 s de cartel → < 3 min; el marco de Learn Bible se descuenta)
const CIERRE_VERTICAL = 3;

/** Puntos de corte (cuadros) del vertical completo: comienzos de escena o, si no alcanza, de frase.
 *  `sobra(i)` = cuadros que se le suman a la parte i (marco de Learn Bible: gancho + invitación + final, lib/marco.mjs);
 *  esa parte lleva menos episodio para seguir < 3 min. */
export function cortes(timeline, extra = 0, sobra = null) {
  if (sobra) return cortesConMarco(timeline, sobra);
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

/** Cortes con marco (Learn Bible): cada parte i lleva `sobra(i)` cuadros más (gancho + invitación + final) y reemplaza al
 *  cartel gancho de 2 s. Busca la combinación con menos partes, cortes en comienzo de escena (o, si no entra, de una
 *  frase que empieza oración: la anterior termina en punto) y partes parejas. */
export function cortesConMarco(timeline, sobra) {
  const fps = timeline.fps, total = timeline.total - timeline.outroFrames + CIERRE_VERTICAL * fps;
  const max = (i) => (MAX_S + 2) * fps - sobra(i); // + los 2 s del cartel gancho, que con marco no va
  const cand = new Map(timeline.escenas.map((e) => [e.from, 0]));
  const frases = timeline.escenas.flatMap((e) => e.frases.map((f, j) => ({ x: e.from + f.from, primera: j === 0, texto: f.texto?.en ?? '' })));
  frases.forEach((f, k) => { if (!f.primera && !cand.has(f.x)) cand.set(f.x, /[.!?]["']?\s*$/.test(frases[k - 1].texto) ? 1 : 3); });
  // con marco la parte 1 abre con la portada de pergamino: no lleva la portada vieja del episodio (introFrames)
  const puntos = [timeline.introFrames, ...[...cand.keys()].filter((x) => x > timeline.introFrames && x < total).sort((a, b) => a - b), total];
  const peor = (a, b) => (a[0] !== b[0] ? a[0] > b[0] : a[1] > b[1]);
  let n = 1;
  for (let cabe = max(0); cabe < total; cabe += max(n++));
  for (let m = n; m <= n + 2; m++) {
    // mejor[k][j]: [costo de cortes, suma de largos²] para llegar a puntos[j] con k partes
    const mejor = Array.from({ length: m + 1 }, () => new Array(puntos.length).fill(null)), de = mejor.map(() => new Array(puntos.length).fill(-1));
    mejor[0][0] = [0, 0];
    for (let k = 1; k <= m; k++) for (let j = 1; j < puntos.length; j++) for (let i = 0; i < j; i++) {
      const largo = puntos[j] - puntos[i];
      if (!mejor[k - 1][i] || largo > max(k - 1)) continue;
      const c = [mejor[k - 1][i][0] + (j < puntos.length - 1 ? cand.get(puntos[j]) : 0), mejor[k - 1][i][1] + (largo / fps) ** 2];
      if (!mejor[k][j] || peor(mejor[k][j], c)) { mejor[k][j] = c; de[k][j] = i; }
    }
    if (!mejor[m][puntos.length - 1]) continue;
    const bordes = [puntos.length - 1];
    for (let k = m; k > 0; k--) bordes.unshift(de[k][bordes[0]]);
    const xs = bordes.map((j) => puntos[j]);
    return { total, partes: xs.slice(1).map((b, i) => [xs[i], b]) };
  }
  throw new Error('no hay un corte válido');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ids = process.argv.slice(2).filter((a) => !a.startsWith('--')), lento = !process.argv.includes('--rapido'); // 2026-10-17: Matías prefirió el ritmo de siempre (--rapido = ritmo de Short)
  if (!ids.length) throw new Error('Falta el id');
  mkdirSync('public/portadas', { recursive: true });
  const timelines = {};
  for (const id of ids) {
    // antes del bundle: el audio rápido tiene que estar en public/
    timelines[id] = lento ? JSON.parse(readFileSync(join('src/videos', id, 'timeline.json'), 'utf8')) : prepararRapido(id);
    if (JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8')).reels) continue; // Learn Bible: la tapa es la portada de pergamino (abajo)
    if (!existsSync(join('out', id, 'portada-ig.jpg'))) execFileSync('node', ['scripts/portadas-ig.mjs', id], { stdio: 'ignore' });
    copyFileSync(join('out', id, 'portada-ig.jpg'), join('public/portadas', `${id}.jpg`));
  }
  const serveUrl = await bundle({ entryPoint: resolve('src/motor/entrada.tsx') });
  process.on('exit', () => rmSync(serveUrl, { recursive: true, force: true }));
  const titulos = leerTitulos();
  for (const id of ids) {
    const gancho = ganchoParte(id, titulos);
    const guion = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
    const timeline = timelines[id];
    // marco de Learn Bible (lib/marco.mjs): del timeline.json (el ritmo rápido no lo trae)
    const conMarco = { ...timeline, marco: timeline.marco ?? JSON.parse(readFileSync(join('src/videos', id, 'timeline.json'), 'utf8')).marco };
    const { partes } = cortes(timeline, 0, guion.reels && conMarco.marco ? sobraParte(guion, conMarco) : null); // sin marco: el corte de siempre
    const de = partes.length;
    // Las partes a la vez y cada una en trozos (RENDER_PARALELO Chromes en total; uno solo aprovecha ~2 núcleos).
    const nucleos = Number(process.env.RENDER_CONCURRENCY) || Math.max(2, os.cpus().length - 1);
    const trozos = Math.max(1, Math.ceil((Number(process.env.RENDER_PARALELO) || 1) / de));
    await Promise.all(partes.map(async ([desde, hasta], i) => {
      const marco = marcoParte(guion, conMarco, i);
      const inputProps = { guion, timeline, portada: `portadas/${id}.jpg`, desde, hasta, n: i + 1, de, gancho, ...(marco.apertura || marco.final ? { marco } : {}) };
      const comp = await selectComposition({ serveUrl, id: `${id}-parte`, inputProps });
      const out = join('out', id, `${id}.parte-${i + 1}.mp4`);
      await renderPartido({ serveUrl, composition: comp, inputProps, out, trozos, crf: 21, concurrency: Math.max(1, Math.floor(nucleos / (de * trozos))) });
      console.log(`listo: ${out} (${(comp.durationInFrames / comp.fps).toFixed(0)} s)`);
      // Learn Bible: tapa de IG = la portada de pergamino ya completa (portada-ig-N.jpg; la de la parte 1 también portada-ig.jpg)
      if (marco.apertura) {
        const png = join('out', id, `portada-ig-${i + 1}.png`), jpg = png.replace(/\.png$/, '.jpg');
        await renderStill({ serveUrl, composition: comp, inputProps, frame: ENTRADA_PORTADA, output: png });
        execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-q:v', '2', jpg]); rmSync(png);
        if (i === 0) copyFileSync(jpg, join('out', id, 'portada-ig.jpg'));
      }
    }));
    writeFileSync(join('out', id, 'partes.json'), JSON.stringify({ de, partes, ...(guion.reels ? { portadas: partes.map((_, i) => `portada-ig-${i + 1}.jpg`), portadaCuadro: ENTRADA_PORTADA } : {}), gancho: gancho || false, ritmo: lento ? 'lento' : 'rapido', huella: huella(id) })); // gancho/ritmo/huella del guion: sembrar y la nube no reusan partes viejas, con otro título ni de otro elenco
  }
}
