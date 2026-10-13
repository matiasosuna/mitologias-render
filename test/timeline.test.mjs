import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularTimeline } from '../lib/timeline.mjs';

const T = { intro: 2, entrada: 0.5, pausaFrase: 0.5, salida: 1, outro: 2 };
const esc = (id, ...segs) => ({ id, titulo: id, frases: segs.map((s, i) => ({ texto: `${id}${i}`, audio: `${id}${i}.wav`, segundos: s })) });

test('las frases no se pisan y respetan la pausa', () => {
  const tl = calcularTimeline([esc('a', 1.01, 2)], 10, T);
  const [f1, f2] = tl.escenas[0].frases;
  assert.equal(f1.from, 5);
  assert.equal(f1.dur, 11); // redondea hacia arriba para no cortar audio
  assert.equal(f2.from, 5 + 11 + 5);
});

test('las escenas son contiguas y el total incluye intro y outro', () => {
  const tl = calcularTimeline([esc('a', 1), esc('b', 2)], 10, T);
  const [a, b] = tl.escenas;
  assert.equal(a.from, 20);
  assert.equal(b.from, a.from + a.durationInFrames);
  assert.equal(a.durationInFrames, 5 + 10 + 10);
  assert.equal(tl.total, b.from + b.durationInFrames + 20);
});
