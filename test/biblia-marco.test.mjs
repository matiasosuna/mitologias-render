// Learn Bible 777: marco narrado (gancho + invitación al principio, invitación final) — lib/marco.mjs — y karaoke (lib/karaoke.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { piezasMarco, marcoParte, sobraParte, horizontalConMarco, tramoMarco } from '../lib/marco.mjs';
import { versiculosDeGuion } from '../lib/versiculos.mjs';
import { cortes, MAX_S } from '../scripts/vertical-partes.mjs';
import { paginar, palabraEn, iniciosPalabras, palabras } from '../lib/karaoke.mjs';

const leer = (f) => JSON.parse(readFileSync(f, 'utf8'));
const ID = 'biblia-genesis-01', g = leer(`src/videos/${ID}/guion.json`), tl = leer(`src/videos/${ID}/timeline.json`);
const kjv = leer(`src/videos/${ID}/kjv.json`).verses;
const norm = (s) => s.replace(/\s+/g, ' ').trim();

test('Génesis 1: piezas del marco con los textos exactos', () => {
  const p = Object.fromEntries(piezasMarco(g).map((x) => [x.id, x.frases[0].en]));
  assert.match(p['reels-gancho-1'], /^Most people think light comes from the sun\./);
  assert.match(p['reels-gancho-2'], /man and woman were made in two separate stories/);
  assert.match(p['reels-gancho-3'], /plants and fruit for food\.$/);
  assert.equal(p['reels-invitacion'], 'Before we read it: join our free Bible debate group. Every Sunday, 7 PM New York time. Link in bio.');
  assert.equal(p['reels-final'], 'Join the free Sunday debate, link in bio. And follow for the next chapter.');
  assert.equal(p['youtube-invitacion'], 'Before we read it: join our free Bible debate group. Every Sunday, 7 PM New York time. Link in the description.');
  assert.equal(p['youtube-final'], 'Join the free Sunday debate, link in the description. And subscribe for the next chapter.');
});

test('marco narrado: cada pieza tiene su audio en timeline.marco', () => {
  for (const { id } of piezasMarco(g)) {
    const m = tl.marco?.[id];
    assert.ok(m && m.dur > 0, id);
    assert.ok(existsSync(`public/${m.audio.en}`), m.audio.en);
  }
});

test('horizontal: gancho 1 + invitación YouTube antes de "Genesis, chapter one."; final antes de la pantalla final', () => {
  const { guion: h, timeline: t } = horizontalConMarco(g, tl);
  assert.equal(t.escenas[0].id, 'apertura');
  assert.equal(t.escenas[0].from, tl.introFrames);
  assert.deepEqual(h.escenas[0].frases.map((f) => f.en), [g.reels.ganchos[0].en, g.youtube.invitacion.en]);
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
    assert.equal(m.apertura.frases[0].texto.en, g.reels.ganchos[i].en);
    assert.equal(m.apertura.frases[1].texto.en, g.reels.invitacion.en);
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
  const t = tramoMarco(tl, ['reels-gancho-2', 'reels-invitacion']);
  assert.equal(t.frases.length, 2);
  assert.ok(t.frases[1].from > t.frases[0].from + t.frases[0].dur);
  assert.ok(t.durationInFrames > t.frases[1].from + t.frases[1].dur);
  assert.equal(tramoMarco(tl, ['no-existe']), null);
});

test('karaoke: páginas de ≤ 3 renglones sin perder palabras; la palabra que suena avanza con la voz', () => {
  for (const { frases } of piezasMarco(g)) {
    const texto = frases[0].en, pags = paginar(texto, 22, 3);
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
