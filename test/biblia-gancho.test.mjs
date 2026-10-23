// Gancho de intro (Matías 2026-10-22): todos los capítulos de la Biblia menos Génesis 1, en YouTube, partes de IG y TikTok.
// Voz desde el cuadro 0, texto en pantalla, ≤ ~11 s; partes 2+ solo "Genesis N, part n.". El mecanismo sirve para cualquier serie.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { GANCHO_BIBLIA, marcoBiblia, partesTitulo } from '../scripts/marco-biblia.mjs';
import { marcoParte, sobraParte, horizontalConMarco, verticalConGancho, conGanchoAlPrincipio, tieneGancho, filtroMarco, procesoMarco, piezasMarco } from '../lib/marco.mjs';
import { cortes } from '../scripts/vertical-partes.mjs';

const leer = (f) => JSON.parse(readFileSync(f, 'utf8'));
const TEXTO = 'Ever wanted to know what the Bible actually says? Without anyone telling you what to believe? I tell it as simple stories, with the exact words, as it was written. No interpretation.';
// Ya estaban hechos y con VERIFICADO antes del gancho (2026-10-22): sumarles el gancho queda pendiente de OK de Matías.
// Cuando lo tengan, sacarlos de acá (el test falla si uno de esta lista ya tiene el gancho).
const PENDIENTES = [];
const todos = readdirSync('src/videos').filter((d) => d.startsWith('biblia-') && d !== 'biblia-genesis-01' && existsSync(`src/videos/${d}/guion.json`));
const capitulos = todos.filter((d) => !PENDIENTES.includes(d));

test('lista de pendientes al día', () => {
  for (const id of PENDIENTES) if (existsSync(`src/videos/${id}/guion.json`)) assert.equal(tieneGancho(leer(`src/videos/${id}/guion.json`)), false, `${id} ya tiene gancho: sacarlo de PENDIENTES`);
});

test('el texto del gancho es el aprobado, palabra por palabra', () => {
  assert.equal(GANCHO_BIBLIA, TEXTO);
  assert.deepEqual(partesTitulo('Genesis 2: The Garden of Eden'), { cap: 'Genesis 2', corto: 'The Garden of Eden' });
  const m = marcoBiblia({ titulo: { en: 'Genesis 2: The Garden of Eden' }, reels: { final: { en: 'Q?' } } }, 3);
  assert.equal(m.reels.ganchos[0].en, `${TEXTO} Today: Genesis 2, The Garden of Eden.`);
  assert.deepEqual(m.reels.ganchos.slice(1).map((x) => x.en), ['Genesis 2, part 2.', 'Genesis 2, part 3.']);
  assert.equal(m.reels.final.en, 'Q?');
});

test('todo capítulo de la Biblia (menos Génesis 1) trae el gancho en todos los formatos', () => {
  assert.ok(capitulos.length >= 3);
  for (const id of capitulos) {
    const g = leer(`src/videos/${id}/guion.json`), { cap, corto } = partesTitulo(g.titulo.en);
    const gancho = `${TEXTO} Today: ${cap}, ${corto}.`;
    assert.equal(g.reels?.ganchos?.[0]?.en, gancho, `${id}: reels.ganchos[0]`);
    assert.equal(g.youtube?.gancho?.en, gancho, `${id}: youtube.gancho`);
    g.reels.ganchos.slice(1).forEach((x, k) => assert.equal(x.en, `${cap}, part ${k + 2}.`, `${id}: parte ${k + 2}`));
    assert.ok(g.reels.ganchos.length >= 2, `${id}: falta la línea de la parte 2`);
  }
  // Génesis 1 ya salió: sin gancho
  assert.equal(tieneGancho(leer('src/videos/biblia-genesis-01/guion.json')), false);
});

test('narrado: voz desde el cuadro 0, ≤ 11,5 s, una línea por cada parte, en YouTube, IG y TikTok', () => {
  for (const id of capitulos.filter((d) => existsSync(`src/videos/${d}/timeline.json`))) {
    const g = leer(`src/videos/${id}/guion.json`), tl = leer(`src/videos/${id}/timeline.json`);
    assert.ok(tl.marco?.['reels-gancho-1'] && tl.marco?.['youtube-gancho'], `${id}: gancho sin narrar`);
    const { partes } = cortes(tl, 0, sobraParte(g, tl), false);
    assert.ok(g.reels.ganchos.length >= partes.length, `${id}: ${partes.length} partes y ${g.reels.ganchos.length} ganchos`);
    partes.forEach(([a, b], i) => {
      const ap = marcoParte(g, tl, i).apertura;
      assert.ok(ap, `${id} parte ${i + 1}: sin gancho`);
      assert.equal(ap.frases[0].from, 0, `${id} parte ${i + 1}: la voz no arranca en el cuadro 0`);
      if (i === 0) assert.ok(ap.durationInFrames / tl.fps <= 11.5, `${id}: gancho de ${(ap.durationInFrames / tl.fps).toFixed(1)} s`);
      assert.ok(2 + (b - a + ap.durationInFrames + marcoParte(g, tl, i).final.durationInFrames) / tl.fps + (i < partes.length - 1 ? 2.5 : 0) < 180, `${id} parte ${i + 1} ≥ 3 min`);
    });
    for (const { timeline: t } of [horizontalConMarco(g, tl), verticalConGancho(g, tl)]) {
      assert.equal(t.introFrames, 0, `${id}: la portada no puede ir antes de la voz`);
      assert.equal(t.escenas[0].id, 'gancho'); assert.equal(t.escenas[0].from, 0); assert.equal(t.escenas[0].frases[0].from, 0);
      assert.equal(t.escenas[1].from, t.escenas[0].durationInFrames);
    }
  }
});

test('cualquier serie: con reels.ganchos el gancho va al cuadro 0; sin ganchos nada cambia', () => {
  const tl = { fps: 24, introFrames: 96, outroFrames: 288, total: 1000, escenas: [{ id: 'a', from: 96, durationInFrames: 616, frases: [] }],
    marco: { 'reels-gancho-1': { pausas: [], frases: [{ texto: { en: 'Hook.' }, audio: { en: 'x.wav' }, dur: 48 }] } } };
  const g = { serie: 'hawaianas', escenas: [{ id: 'a', fondo: 'playa', elementos: [{ tipo: 'sol', en: 2 }, { tipo: 'x', hasta: 1 }], actores: [{ id: 'p' }] }], reels: { ganchos: [{ en: 'Hook.' }] } };
  const r = verticalConGancho(g, tl);
  assert.equal(r.timeline.escenas[0].from, 0);
  assert.equal(r.timeline.total, 1000 - 96 + 48 + Math.round(0.3 * 24));
  assert.equal(r.guion.escenas[0].sinEntrada, true);
  assert.deepEqual(r.guion.escenas[0].elementos, [{ tipo: 'sol' }]);
  assert.equal(r.guion.escenas[0].camara.zoom[1] > r.guion.escenas[0].camara.zoom[0], true);
  assert.equal(conGanchoAlPrincipio(g, { ...tl, marco: {} }, 'reels-gancho-1').timeline.introFrames, 96);
  const sin = { serie: 'griegas', escenas: g.escenas };
  assert.equal(verticalConGancho(sin, tl).guion, sin);
  assert.deepEqual(piezasMarco(sin), []);
});

test('audio del gancho: silencio de las puntas recortado (voz desde el cuadro 0), idempotente', () => {
  const g = { reels: { ganchos: [{ en: 'x' }], tempos: { gancho: 1.25 } } };
  const p = procesoMarco(g, 'reels-gancho-1-0-abc.wav');
  assert.deepEqual(p, { tempo: 1.25, compactar: 0.3, inicio: 0.04, fin: 0.06 });
  assert.equal(procesoMarco(g, 'reels-final-0-abc.wav').inicio, undefined);
  const obj = { tempo: 1.2, compactar: 0.3, inicio: 0.04, fin: 0.06 };
  assert.equal(filtroMarco(null, obj, [[0, 0.2], [2.0, 2.3]], 2.3), '[0:a]atrim=start=0.1600:end=2.0600,asetpts=PTS-STARTPTS,atempo=1.2');
  assert.equal(filtroMarco(obj, obj, [[0, 0.04], [2.0, 2.06]], 2.06), null);
  // sin inicio/fin (preguntas finales, Myths de antes): igual que siempre
  assert.equal(filtroMarco(null, { tempo: 1.08, compactar: 0.3 }, [[0, 0.2], [2.0, 2.3]], 2.3), '[0:a]atempo=1.08');
});
