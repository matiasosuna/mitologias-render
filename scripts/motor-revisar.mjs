// Revisión automática de un guion visual: avisa errores y problemas de encuadre sin gastar
// tokens, y arma una hoja de contacto (un cuadro por escena) para echarle un vistazo.
// Uso: node scripts/motor-revisar.mjs griegas-02-prometeo [--sin-hoja]
import { readFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { erroresQuien, tiemposShort } from '../lib/quien.mjs';
import { escenasDe, erroresColdOpen } from '../lib/short.mjs';

const id = process.argv[2];
const dir = join('src/videos', id);
const g = JSON.parse(readFileSync(join(dir, 'guion.json'), 'utf8'));
// Sin narrar todavía: timeline estimado por largo del texto en inglés (≈2,3 palabras/s; Shorts ≈3,2 = 190 por minuto).
const estimado = !existsSync(join(dir, 'timeline.json'));
const short = g.formato === 'short', ESCENAS = escenasDe(g);
const tl = estimado ? (await import('../lib/motor-tiempos.mjs')).timelineMulti(ESCENAS.map((e) => ({ id: e.id, frases: e.frases.map((t) => ({ texto: t, audio: {}, segundos: { en: short ? (t.en ?? t.es).split(/\s+/).length / 3.2 : 0.6 + (t.en ?? t.es).split(/\s+/).length / 2.3 } })) })), undefined, short ? tiemposShort(g) : undefined) : JSON.parse(readFileSync(join(dir, 'timeline.json'), 'utf8'));
if (estimado) console.log('(sin timeline.json: tiempos estimados por largo del texto)');
const elenco = new Set([...readFileSync('src/motor/elenco.tsx', 'utf8').split('export const ELENCO')[1].split('export type Estado')[0].matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]));
const FONDOS = new Set(['campo', 'olimpo', 'mar', 'costa', 'inframundo', 'cueva', 'palacio', 'templo', 'monte', 'bosque', 'ciudad', 'noche', 'cielo', 'batalla', 'fragua', 'desierto', 'caos', 'nieve', 'fiordo', 'asgard', 'salon', 'yggdrasil', 'ginnungagap', 'hel', 'jotunheim', 'aldea', 'bosque_nevado', 'aurora', 'bifrost', 'nilo', 'nun', 'duat', 'piramides', 'juncal', 'sala_juicio', 'cielo_nut', 'po', 'fondo_marino', 'oceano', 'oceano_abierto', 'playa', 'playa_negra', 'aldea_hale', 'loi', 'valle', 'valle_cascada', 'bosque_lehua', 'volcan', 'crater', 'haleakala', 'mauna_kea', 'cielo_navegante', 'heiau', 'mundo_cielo', 'agua_primordial', 'aldea_casa_larga', 'pradera', 'costa_noroeste', 'rio', 'montanas', 'lago', 'bajo_agua', 'playa_noroeste', 'dentro_monstruo']);
const ELEMS = new Set(['olivo', 'arbol', 'cipres', 'palmera', 'templo', 'monte', 'columna', 'roca', 'nube', 'luna', 'sol', 'estrellas', 'barco', 'altar', 'fogata', 'trono', 'anfora', 'pithos', 'casa', 'muralla', 'tumba', 'estela', 'cofre', 'telar', 'estatua', 'puerta', 'cueva', 'rio', 'pino', 'yggdrasil', 'casa_larga', 'piedra_runica', 'drakkar', 'monte_nevado', 'piramide', 'obelisco', 'papiro', 'loto', 'barca_solar', 'pilono', 'columna_papiro', 'balanza', 'sarcofago', 'nut_arco', 'waa', 'hale', 'kii', 'kalo', 'niu', 'ipu', 'lehua', 'petroglifo', 'lago_lava', 'fuente_lava', 'kahili', 'heiau', 'isla', 'arbol_cielo', 'agujero', 'casa_comunal', 'tipi', 'casa_tablones', 'totem', 'canoa', 'canoa_cedro', 'maiz', 'tres_hermanas', 'isla_tortuga', 'arce', 'abedul', 'cedro', 'caja', 'monticulo', 'sicomoro', 'isla_barro', 'boveda', 'tronco', 'interior_tablones', 'almeja', 'escalera_flechas', 'constelacion', 'monstruo_kamiah', 'corazon_monstruo', 'corazon_piedra', 'soga', 'casa_cherokee', 'bulto']);
const HACE = new Set(['aparece', 'desaparece', 'entra', 'sale', 'camina', 'corre', 'vuela', 'nada', 'levanta', 'baja', 'senala', 'ofrece', 'lamenta', 'golpea', 'lanza', 'abraza', 'reza', 'cae', 'arrodilla', 'sienta', 'levantarse', 'tiembla', 'habla', 'calla', 'gira', 'crece', 'encoge', 'toma', 'suelta', 'brilla', 'transforma', 'enoja', 'entristece', 'sorprende', 'alegra', 'neutral', 'asiente', 'niega', 'mira', 'salta']);
const EFECTOS = new Set(['rayo', 'destello', 'fuego', 'fogata', 'lluvia', 'nieve', 'humo', 'chispas', 'temblor', 'oscurecer', 'aclarar', 'olas-suben', 'olas-bajan', 'luz', 'niebla', 'estrellas', 'sangre', 'polvo']);
// Hawaianos y maoríes oficiales (*_oficial): elencoHawaianoOficial.tsx, elencoMaoriOficial.tsx.
for (const [f, n] of [['elencoHawaianoOficial', 'HAWAIANO_OFICIAL'], ['elencoMaoriOficial', 'MAORI_OFICIAL']]) [...readFileSync(`src/motor/${f}.tsx`, 'utf8').split(`export const ELENCO_${n}`)[1].split(`export const NOMBRE_EN_${n}`)[0].matchAll(/^\s{2}(\w+): /gm)].forEach((m) => elenco.add(m[1]));
// Griegos oficiales (*_oficial): elencoGriegoOficial.tsx.
[...readFileSync('src/motor/elencoGriegoOficial.tsx', 'utf8').split('export const ELENCO_GRIEGO_OFICIAL')[1].split('export const NOMBRE_EN_GRIEGO_OFICIAL')[0].matchAll(/^\s{2}(\w+): /gm)].forEach((m) => elenco.add(m[1]));
// Thor, Odín y Loki oficiales (muñeco y nuevo): elencoNordico.tsx.
[...readFileSync('src/motor/elencoNordico.tsx', 'utf8').split('export const ELENCO_NORDICO')[1].split('export const NOMBRE_EN_NORDICO')[0].matchAll(/^\s{2}(\w+): /gm)].forEach((m) => elenco.add(m[1]));
// Egipcios oficiales (*_oficial): elencoEgipcioOficial.tsx.
[...readFileSync('src/motor/elencoEgipcioOficial.tsx', 'utf8').split('export const ELENCO_EGIPCIO_OFICIAL')[1].split('export const NOMBRE_EN_EGIPCIO_OFICIAL')[0].matchAll(/^\s{2}(\w+): /gm)].forEach((m) => elenco.add(m[1]));
// Aztecas, hindúes, balineses y norteamericanos oficiales (*_oficial): elenco<Serie>Oficial.tsx.
for (const n of ['Azteca', 'Hindu', 'Balines', 'Norte']) [...readFileSync(`src/motor/elenco${n}Oficial.tsx`, 'utf8').matchAll(/^\s{2}(\w+_oficial): /gm)].forEach((m) => elenco.add(m[1]));
// Aztecas (tema códice): fondos, elementos y elenco salen de sus propios archivos.
const lista = (archivo, nombre) => ((readFileSync(archivo, 'utf8').match(new RegExp(`export const ${nombre} = \\[([^\\]]*)\\]`)) ?? [])[1] ?? '').match(/'(\w+)'/g)?.map((x) => x.slice(1, -1)) ?? [];
lista('src/motor/fondosAzteca.tsx', 'FONDOS_AZTECA').forEach((x) => FONDOS.add(x));
lista('src/motor/fondosAzteca.tsx', 'ELEMENTOS_AZTECA').forEach((x) => ELEMS.add(x));
[...readFileSync('src/motor/elencoAzteca.tsx', 'utf8').split('export const ELENCO_AZTECA')[1].split('export const NOMBRE_EN_AZTECA')[0].matchAll(/^\s{2}(\w+): /gm)].forEach((m) => elenco.add(m[1]));
// Hindúes (tema pahari): fondos, elementos y elenco salen de sus propios archivos.
lista('src/motor/fondosHindu.tsx', 'FONDOS_HINDU').forEach((x) => FONDOS.add(x));
lista('src/motor/fondosHindu.tsx', 'ELEMENTOS_HINDU').forEach((x) => ELEMS.add(x));
[...readFileSync('src/motor/elencoHindu.tsx', 'utf8').split('export const ELENCO_HINDU')[1].split('export const NOMBRE_EN_HINDU')[0].matchAll(/^\s{2}(\w+): /gm)].forEach((m) => elenco.add(m[1]));
// Balinesas (tema kamasan): igual, de fondosBalines.tsx y elencoBalines.tsx.
lista('src/motor/fondosBalines.tsx', 'FONDOS_BALINES').forEach((x) => FONDOS.add(x));
lista('src/motor/fondosBalines.tsx', 'ELEMENTOS_BALINES').forEach((x) => ELEMS.add(x));
[...readFileSync('src/motor/elencoBalines.tsx', 'utf8').split('export const ELENCO_BALINES')[1].split('export const NOMBRE_EN_BALINES')[0].matchAll(/^\s{2}(\w+): /gm)].forEach((m) => elenco.add(m[1]));
// Maoríes (tema kōwhaiwhai): igual, de fondosMaori.tsx y elencoMaori.tsx.
lista('src/motor/fondosMaori.tsx', 'FONDOS_MAORI').forEach((x) => FONDOS.add(x));
lista('src/motor/fondosMaori.tsx', 'ELEMENTOS_MAORI').forEach((x) => ELEMS.add(x));
[...readFileSync('src/motor/elencoMaori.tsx', 'utf8').split('export const ELENCO_MAORI')[1].split('export const NOMBRE_EN_MAORI')[0].matchAll(/^\s{2}(\w+): /gm)].forEach((m) => elenco.add(m[1]));
const P = { fondo: 0.45, medio: 0.75, frente: 1 };

const avisos = [];
const av = (esc, msg) => avisos.push(`[${esc}] ${msg}`);
// Shorts "Who is…?" (BRIEF-QUIEN.md): personaje oficial, nombre y subtítulo del cartel de apertura.
erroresQuien(g, elenco).forEach((m) => av('quien', m));
if (g.quien?.fondo && !FONDOS.has(g.quien.fondo)) av('quien', `fondo desconocido "${g.quien.fondo}"`);
erroresColdOpen(g).forEach((m) => av('coldopen', m));
if (short) { const s = tl.total / tl.fps, max = g.quien ? 75 : 65; if (s < 45 || s > max) av('short', `dura ${s.toFixed(0)} s (meta 45–${max})`); }
ESCENAS.forEach((esc, i) => {
  const n = esc.frases.length, et = tl.escenas.find((e) => e.id === esc.id) ?? tl.escenas[i];
  if (!et) { av(esc.id, 'no está en timeline.json: volver a narrar'); return; }
  // Shorts: una escena por momento, 2–4 frases y algo nuevo cada ~5–9 s; los brazos arriba no entran con escala > 1.
  if (short && esc.id !== 'coldopen' && n > 4) av(esc.id, `${n} frases: en Shorts, 2–4 por escena (partirla)`);
  if (short && et.durationInFrames / tl.fps > 14) av(esc.id, `escena de ${(et.durationInFrames / tl.fps).toFixed(0)} s: en Shorts, una imagen nueva cada ~5–9 s`);
  if (short) (esc.actores ?? []).forEach((ac) => (ac.escala ?? 1) > 1 && (ac.pasos ?? []).some((p) => ['levanta', 'lanza'].includes(p.hace)) && av(esc.id, `${ac.id}: escala ${ac.escala} con brazo arriba se corta en la guarda de arriba (≤ 1)`));
  if (!FONDOS.has(esc.fondo)) av(esc.id, `fondo desconocido "${esc.fondo}"`);
  (esc.elementos ?? []).forEach((el) => !ELEMS.has(el.tipo) && av(esc.id, `elemento desconocido "${el.tipo}"`));
  (esc.efectos ?? []).forEach((ef) => { if (!EFECTOS.has(ef.tipo)) av(esc.id, `efecto desconocido "${ef.tipo}"`); if (ef.en >= n) av(esc.id, `efecto ${ef.tipo} en frase ${ef.en} (solo hay ${n})`); });
  (esc.rotulos ?? []).forEach((r) => { if (r.y < 160 || r.y > 770) av(esc.id, `rótulo "${r.texto}" fuera de la ventana (y=${r.y})`); if (typeof r.texto === "string" && /[A-Za-z]/.test(r.texto)) av(esc.id, `rótulo "${r.texto}" sin traducir: usar {es,pt,en}`); });
  const cam = esc.camara ?? {}, de = cam.de ?? 0, a = cam.a ?? de;
  const camEn = (frase) => de + (a - de) * Math.min(1, Math.max(0, (frase + 0.5) / n));
  if ((esc.actores ?? []).length === 0) av(esc.id, 'escena sin actores');
  (esc.actores ?? []).forEach((ac) => {
    if (!elenco.has(ac.como ?? ac.id)) av(esc.id, `"${ac.como ?? ac.id}" no está en el elenco (se dibuja un hombre genérico)`);
    let x = ac.x, visible = 0;
    const pasos = [...(ac.pasos ?? [])].sort((p, q) => p.en - q.en);
    pasos.forEach((p) => { if (!HACE.has(p.hace)) av(esc.id, `${ac.id}: acción desconocida "${p.hace}"`); if (p.en >= n) av(esc.id, `${ac.id}: paso "${p.hace}" en frase ${p.en} (solo hay ${n})`); });
    for (let fr = 0; fr < n; fr++) {
      pasos.filter((p) => p.en <= fr && typeof p.a === 'number').forEach((p) => (x = p.a));
      const sx = x - camEn(fr) * P[ac.capa ?? 'frente'];
      if (sx > -60 && sx < 1980) visible++;
    }
    if (!visible && !pasos.some((p) => p.hace === 'entra')) av(esc.id, `${ac.id} nunca queda dentro de cuadro (x=${ac.x}, cámara ${de}→${a})`);
  });
  const frente = (esc.actores ?? []).filter((x) => (x.capa ?? 'frente') === 'frente' && !(x.pasos ?? []).length);
  frente.forEach((p, j) => frente.slice(j + 1).forEach((q) => Math.abs(p.x - q.x) < 110 * Math.min(p.escala ?? 1, q.escala ?? 1) && av(esc.id, `${p.id} y ${q.id} quedan encimados (x ${p.x} / ${q.x})`)));
  if (et.durationInFrames / tl.fps > 50) av(esc.id, `escena larga (${(et.durationInFrames / tl.fps).toFixed(0)} s): conviene más movimiento o partirla`);
});
console.log(avisos.length ? avisos.join('\n') : 'sin avisos');

if (estimado && !process.argv.includes('--sin-hoja')) console.log('hoja: se arma después de narrar (hace falta timeline.json)');
if (!process.argv.includes('--sin-hoja') && !estimado) {
  const { bundle } = await import('@remotion/bundler');
  const { renderStill, selectComposition } = await import('@remotion/renderer');
  const serveUrl = await bundle({ entryPoint: resolve('src/motor/entrada.tsx') });
  process.on('exit', () => rmSync(serveUrl, { recursive: true, force: true })); // los bundles pesan ~600 MB
  const props = { guion: g, timeline: tl, idioma: null };
  const comp = await selectComposition({ serveUrl, id, inputProps: props });
  const tmp = join('out/.hojas', id); mkdirSync(tmp, { recursive: true }); mkdirSync(join('out', id), { recursive: true });
  const cuadros = [];
  for (const [i, e] of tl.escenas.entries()) {
    for (const k of [0.35, 0.8]) {
      const frame = Math.round(e.from + e.durationInFrames * k), file = join(tmp, `${i}-${k}.jpg`);
      await renderStill({ serveUrl, composition: comp, output: file, frame, inputProps: props, imageFormat: 'jpeg', jpegQuality: 70, scale: 0.25 });
      cuadros.push(file);
    }
  }
  const cols = 4, filas = Math.ceil(cuadros.length / cols);
  const layout = cuadros.map((_, i) => `${(i % cols) * 480}_${Math.floor(i / cols) * 270}`).join('|');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...cuadros.flatMap((c) => ['-i', c]), '-filter_complex', `xstack=inputs=${cuadros.length}:layout=${layout}:fill=black`, join('out', id, 'hoja.jpg')]);
  console.log(`hoja: out/${id}/hoja.jpg (${filas} filas)`);
}
