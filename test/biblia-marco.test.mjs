// La Biblia (serie de Myths on Clay): sin intro; solo la pregunta final narrada (lib/marco.mjs) y karaoke (lib/karaoke.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { piezasMarco, marcoParte, sobraParte, horizontalConMarco, tramoMarco, trozos, tempoExtra, filtroMarco, silenciosDe } from '../lib/marco.mjs';
import { versiculosDeGuion } from '../lib/versiculos.mjs';
import { cortes, MAX_S } from '../scripts/vertical-partes.mjs';
import { paginar, palabraEn, iniciosPalabras, palabras } from '../lib/karaoke.mjs';

const leer = (f) => JSON.parse(readFileSync(f, 'utf8'));
const ID = 'biblia-genesis-01', g = leer(`src/videos/${ID}/guion.json`), tl = leer(`src/videos/${ID}/timeline.json`);
const kjv = leer(`src/videos/${ID}/kjv.json`).verses;
const norm = (s) => s.replace(/\s+/g, ' ').trim();

test('Génesis 1: formato Myths, sin gancho ni invitación; solo la pregunta final', () => {
  const p = Object.fromEntries(piezasMarco(g).map((x) => [x.id, x]));
  assert.deepEqual(Object.keys(p), ['reels-final', 'youtube-final']);
  assert.equal(p['reels-final'].frases[0].en, 'What surprised you most in this chapter? Tell me in the comments.');
  assert.equal(p['youtube-final'].frases[0].en, p['reels-final'].frases[0].en);
  assert.equal(g.titulo.en, 'Genesis 1: The Creation');
  assert.equal(tempoExtra(g, 'reels-final-0-abc.wav'), 1.08);
  assert.equal(tempoExtra({}, 'reels-final-0-abc.wav'), 1);
  assert.deepEqual(marcoParte(g, tl, 0).apertura, null);
});

test('trozos: corta después de cada frase con pausa; al final queda como pausa de la pieza', () => {
  assert.deepEqual(trozos('A b. It isn\'t like that. C d. Tell me.', { "It isn't like that.": 0.7, 'Tell me.': 2 }), [{ en: "A b. It isn't like that.", pausa: 0.7 }, { en: 'C d. Tell me.', pausa: 2 }]);
  assert.deepEqual(trozos('Sin pausas.'), [{ en: 'Sin pausas.', pausa: 0 }]);
});

test('marco narrado: cada trozo tiene su audio en timeline.marco', () => {
  for (const { id, frases } of piezasMarco(g)) {
    const m = tl.marco?.[id];
    assert.ok(m && m.frases.length === frases.length, id);
    for (const fr of m.frases) { assert.ok(fr.dur > 0); assert.ok(existsSync(`public/${fr.audio.en}`), fr.audio.en); }
  }
});

test('pausa del marco: 0,5 s antes de la pregunta final', () => {
  assert.equal(marcoParte(g, tl, 0).final.frases[0].from, Math.round(0.5 * tl.fps));
});

test('horizontal: sin apertura; la pregunta final antes de la pantalla final', () => {
  const { guion: h, timeline: t } = horizontalConMarco(g, tl);
  assert.notEqual(t.escenas[0].id, 'apertura');
  assert.equal(h.escenas[0].frases[0].en, 'Genesis, chapter one.');
  assert.equal(t.escenas.at(-1).id, 'despedida');
  assert.equal(h.escenas.at(-1).frases[0].en, g.youtube.final.en);
  const F = t.escenas.at(-1).durationInFrames;
  assert.equal(t.total, tl.total + F);
  assert.equal(t.escenas.at(-1).from + F, t.total - t.outroFrames);
  // la pregunta no es texto bíblico: sin número de versículo, y la KJV sigue completa y literal
  const refs = versiculosDeGuion(h, kjv);
  assert.ok(refs.at(-1).every((r) => r === null));
  assert.ok(norm(h.escenas.flatMap((e) => e.frases.map((f) => f.en)).join(' ')).includes(norm(kjv.map((v) => v.text).join(' '))));
});

test('sin campos de marco (Myths) nada cambia', () => {
  for (const d of readdirSync('src/videos').filter((x) => !x.startsWith('biblia-') && existsSync(`src/videos/${x}/timeline.json`))) {
    const gg = leer(`src/videos/${d}/guion.json`), tt = leer(`src/videos/${d}/timeline.json`);
    if (gg.reels?.ganchos || gg.youtube?.gancho) continue; // con el gancho de Myths (scripts/marco-myths.mjs)
    assert.equal(piezasMarco(gg).length, 0, d);
    const r = horizontalConMarco(gg, tt);
    assert.equal(r.guion, gg, d); assert.equal(r.timeline, tt, d);
    assert.deepEqual(marcoParte(gg, tt, 0), { apertura: null, final: null }, d);
  }
});

test('partes como Myths (portada + cartel gancho) con la pregunta final: < 3 min; cortes en escena u oración', () => {
  const { total, partes } = cortes(tl, 0, sobraParte(g, tl), true);
  assert.equal(partes[0][0], 0, 'la parte 1 abre con la portada de Myths');
  assert.equal(partes.at(-1)[1], total);
  const escenas = new Set(tl.escenas.map((e) => e.from));
  const frases = tl.escenas.flatMap((e) => e.frases.map((f) => ({ x: e.from + f.from, en: f.texto.en })));
  partes.forEach(([a, b], i) => {
    const m = marcoParte(g, tl, i);
    assert.equal(m.apertura, null);
    const seg = 2 + (b - a + m.final.durationInFrames) / tl.fps + (i < partes.length - 1 ? 2.5 : 0);
    assert.ok(seg < 180, `parte ${i + 1}: ${seg.toFixed(1)} s`);
    if (i > 0) {
      const k = frases.findIndex((f) => f.x === a);
      assert.ok(escenas.has(a) || (k > 0 && /[.!?]$/.test(frases[k - 1].en)), `corte en ${a}`);
    }
  });
  assert.ok(MAX_S > 0);
});

test('sin pergamino: el gancho narrado va adentro del video (Gancho.tsx); la tapa sigue siendo la portada de Myths', () => {
  const vp = readFileSync('scripts/vertical-partes.mjs', 'utf8'), vv = readFileSync('src/motor/VideoVertical.tsx', 'utf8');
  assert.match(vp, /\.reels\?\.ganchos\) continue;/);
  assert.doesNotMatch(vv, /PortadaBiblia/);
  assert.doesNotMatch(vp, /renderStill|portadaCuadro/);
  assert.ok(!/LEARN BIBLE|Learn Bible 777'/.test(readFileSync('src/comun/vasija.tsx', 'utf8')));
});

test('tramoMarco: piezas en orden, sin encimarse', () => {
  const t = tramoMarco(tl, ['reels-final', 'youtube-final']);
  assert.equal(t.frases.length, 2);
  assert.ok(t.frases[1].from > t.frases[0].from + t.frases[0].dur);
  assert.ok(t.durationInFrames > t.frases[1].from + t.frases[1].dur);
  assert.equal(tramoMarco(tl, ['no-existe']), null);
});

test('karaoke: páginas de ≤ 3 renglones sin perder palabras; la palabra que suena avanza con la voz', () => {
  for (const texto of piezasMarco(g).flatMap((p) => p.frases.map((f) => f.en))) {
    const pags = paginar(texto, 22, 3);
    assert.deepEqual(pags.flatMap((p) => p.renglones.flat()), palabras(texto));
    for (const p of pags) { assert.ok(p.renglones.length <= 3); for (const r of p.renglones) assert.ok(r.join(' ').length <= 22 || r.length === 1, r.join(' ')); }
    let i = 0; for (const p of pags) { assert.equal(p.desde, i); i += p.renglones.flat().length; }
    const ini = iniciosPalabras(texto, 200);
    assert.equal(ini[0], 0);
    for (let k = 1; k < ini.length; k++) assert.ok(ini[k] >= ini[k - 1]);
    assert.equal(palabraEn(texto, 200, -1), -1);
    assert.equal(palabraEn(texto, 200, 0), 0);
    assert.equal(palabraEn(texto, 200, 500), palabras(texto).length - 1);
  }
});

test('marco: silencios internos > compactar se recortan con atrim + concat (silenceremove/aselect de ffmpeg 8 no los acortan); atempo solo si cambia', () => {
  const sil = silenciosDe('[silencedetect] silence_start: 1.2\n[silencedetect] silence_end: 1.8 | silence_duration: 0.6\n silence_start: 3\n silence_end: 3.31 | silence_duration: 0.31');
  assert.deepEqual(sil, [[1.2, 1.8], [3, 3.31]]);
  assert.equal(filtroMarco({ tempo: 1.12, compactar: 0.3 }, { tempo: 1.12, compactar: 0.3 }, sil), "[0:a]asplit=2[i0][i1];[i0]atrim=end=1.3500,asetpts=PTS-STARTPTS[a0];[i1]atrim=start=1.6500,asetpts=PTS-STARTPTS[a1];[a0][a1]concat=n=2:v=0:a=1");
  assert.equal(filtroMarco(null, { tempo: 1.08, compactar: 0.3 }, []), '[0:a]atempo=1.08');
  assert.equal(filtroMarco(1.08, { tempo: 1.08, compactar: 0.3 }, [[3, 3.31]]), null);
});
