// Learn Bible 777: marco narrado (gancho + invitación al principio, invitación final) — lib/marco.mjs — y karaoke (lib/karaoke.mjs).
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

test('Génesis 1: piezas del marco con los textos exactos (molde de Hermes Tarot)', () => {
  const p = Object.fromEntries(piezasMarco(g).map((x) => [x.id, x]));
  const cola = "I'm going to read you Genesis, chapter one, word for word. But first… pause the video. What do you believe? Tell me in the comments.";
  assert.deepEqual(p['reels-gancho-1'].frases.map((f) => f.en), ['Most people think the Bible says light came from the sun. It isn\'t like that.', cola]);
  assert.match(p['reels-gancho-2'].frases[0].en, /animals were made before the sea creatures\. It isn't like that\.$/);
  assert.match(p['reels-gancho-3'].frases[0].en, /humans were always meant to eat meat\. It isn't like that\.$/);
  for (const n of [1, 2, 3]) { assert.deepEqual(p[`reels-gancho-${n}`].pausas, [0.35]); assert.equal(p[`reels-gancho-${n}`].pausaFinal, 1); }
  assert.equal(p['reels-invitacion'].frases[0].en, "Before we begin: every Sunday at 7 PM, we meet in a free Bible Sharing Group. The link is in my bio. Also, comment BIBLE and receive a Bible passage for you. One per follower per day. Now… let me read you this chapter.");
  assert.equal(p['reels-final'].frases[0].en, 'What did this chapter make you think? Tell me in the comments. And follow for the next chapter.');
  assert.equal(p['reels-final'].pausaFinal, undefined, 'las pausas son solo de los ganchos');
  assert.equal(p['youtube-invitacion'].frases[0].en, p['reels-invitacion'].frases[0].en);
  assert.doesNotMatch(p['reels-invitacion'].frases[0].en, /New York/, 'la hora de NY va en caption/descripción, no en la voz');
  assert.equal(g.reels.caption, 'Free Bible Sharing Group · every Sunday 7 PM (New York) · link in bio');
  assert.equal(g.youtube.descripcion, g.reels.caption);
  assert.match(p['youtube-final'].frases[0].en, /And subscribe for the next chapter\.$/);
  assert.equal(tempoExtra(g, 'reels-invitacion-0-abc.wav'), 1.12);
  assert.equal(tempoExtra(g, 'reels-gancho-1-0-abc.wav'), 1.08);
  assert.equal(tempoExtra(g, 'youtube-final-0-abc.wav'), 1.08);
  assert.equal(tempoExtra({}, 'reels-invitacion-0-abc.wav'), 1);
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

test('pausas del marco: 0,35 s dentro del gancho, 1 s antes de la invitación, 0,3 s antes del capítulo, 0,5 s antes del final', () => {
  const s = (x) => Math.round(x * tl.fps);
  const ap = marcoParte(g, tl, 0).apertura, fin = marcoParte(g, tl, 0).final;
  const [a, b, c] = ap.frases;
  assert.equal(b.from - (a.from + a.dur), s(0.35));
  assert.equal(c.from - (b.from + b.dur), s(1));
  assert.equal(ap.durationInFrames - (c.from + c.dur), s(0.3));
  assert.equal(fin.frases[0].from, s(0.5));
});

test('horizontal: gancho 1 + invitación YouTube antes de "Genesis, chapter one."; final antes de la pantalla final', () => {
  const { guion: h, timeline: t } = horizontalConMarco(g, tl);
  assert.equal(t.escenas[0].id, 'apertura');
  assert.equal(t.escenas[0].from, tl.introFrames);
  assert.equal(h.escenas[0].frases.map((f) => f.en).join(' '), `${g.reels.ganchos[0].en} ${g.youtube.invitacion.en}`);
  assert.equal(h.escenas[1].frases[0].en, 'Genesis, chapter one.');
  assert.equal(t.escenas.at(-1).id, 'despedida');
  assert.equal(h.escenas.at(-1).frases[0].en, g.youtube.final.en);
  const A = t.escenas[0].durationInFrames, F = t.escenas.at(-1).durationInFrames;
  assert.equal(t.escenas[1].from, tl.escenas[0].from + A);
  assert.equal(t.total, tl.total + A + F);
  assert.equal(t.escenas.at(-1).from + F, t.total - t.outroFrames);
  // el marco no es texto bíblico: sin número de versículo, y la KJV sigue completa y literal
  const refs = versiculosDeGuion(h, kjv);
  assert.ok(refs[0].every((r) => r === null) && refs.at(-1).every((r) => r === null));
  assert.ok(norm(h.escenas.flatMap((e) => e.frases.map((f) => f.en)).join(' ')).includes(norm(kjv.map((v) => v.text).join(' '))));
});

test('sin campos de marco (Myths) nada cambia', () => {
  for (const d of readdirSync('src/videos').filter((x) => !x.startsWith('biblia-') && existsSync(`src/videos/${x}/timeline.json`))) {
    const gg = leer(`src/videos/${d}/guion.json`), tt = leer(`src/videos/${d}/timeline.json`);
    assert.equal(piezasMarco(gg).length, 0, d);
    const r = horizontalConMarco(gg, tt);
    assert.equal(r.guion, gg, d); assert.equal(r.timeline, tt, d);
    assert.deepEqual(marcoParte(gg, tt, 0), { apertura: null, final: null }, d);
  }
});

test('partes con marco: < 3 min con gancho, invitación, final y cartel; sin la portada vieja; cortes en escena u oración', () => {
  const { total, partes } = cortes(tl, 0, sobraParte(g, tl));
  assert.equal(partes.length, 3);
  assert.equal(partes[0][0], tl.introFrames, 'la parte 1 no lleva la portada de Myths (abre con la de pergamino)');
  assert.equal(partes.at(-1)[1], total);
  const escenas = new Set(tl.escenas.map((e) => e.from));
  const frases = tl.escenas.flatMap((e) => e.frases.map((f) => ({ x: e.from + f.from, en: f.texto.en })));
  partes.forEach(([a, b], i) => {
    const m = marcoParte(g, tl, i);
    assert.ok(m.apertura && m.final, `parte ${i + 1}`);
    assert.equal(m.apertura.frases.map((f) => f.texto.en).join(' '), `${g.reels.ganchos[i].en} ${g.reels.invitacion.en}`);
    const seg = (m.apertura.durationInFrames + (b - a) + m.final.durationInFrames) / tl.fps + (i < partes.length - 1 ? 2.5 : 0);
    assert.ok(seg < 180, `parte ${i + 1}: ${seg.toFixed(1)} s`);
    if (i > 0) {
      const k = frases.findIndex((f) => f.x === a);
      assert.ok(escenas.has(a) || (k > 0 && /[.!?]$/.test(frases[k - 1].en)), `corte en ${a}`);
    }
  });
  assert.ok(MAX_S > 0);
});

test('biblia nunca usa la portada de Myths (portada-ig de figuras): partes y vertical van con la de pergamino', () => {
  const vp = readFileSync('scripts/vertical-partes.mjs', 'utf8'), vv = readFileSync('src/motor/VideoVertical.tsx', 'utf8');
  assert.match(vp, /\.reels\) continue; \/\/ Learn Bible/);
  assert.match(vv, /t === 'natural' \? <PortadaBiblia/);
  assert.match(vv, /ap0 && \(\s*<Sequence durationInFrames=\{g0\}>\s*<PortadaBiblia/);
  assert.ok(existsSync('public/biblia/pergamino.jpg'));
});

test('tramoMarco: piezas en orden, sin encimarse', () => {
  const t = tramoMarco(tl, ['reels-final', 'reels-invitacion']);
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

test('marco: silencios internos > compactar se recortan con aselect (silenceremove de ffmpeg 8 no los acorta); atempo solo si cambia', () => {
  const sil = silenciosDe('[silencedetect] silence_start: 1.2\n[silencedetect] silence_end: 1.8 | silence_duration: 0.6\n silence_start: 3\n silence_end: 3.31 | silence_duration: 0.31');
  assert.deepEqual(sil, [[1.2, 1.8], [3, 3.31]]);
  assert.equal(filtroMarco({ tempo: 1.12, compactar: 0.3 }, { tempo: 1.12, compactar: 0.3 }, sil), "aselect='not(between(t,1.3500,1.6500))',asetpts=N/SR/TB");
  assert.equal(filtroMarco(null, { tempo: 1.08, compactar: 0.3 }, []), 'atempo=1.08');
  assert.equal(filtroMarco(1.08, { tempo: 1.08, compactar: 0.3 }, [[3, 3.31]]), null);
});
