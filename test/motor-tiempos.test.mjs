import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timelineMulti, srt } from '../lib/motor-tiempos.mjs';

const T = { intro: 1, entrada: 0.5, pausa: 0.5, salida: 1, outro: 1 };
const fr = (es, pt) => ({ texto: { es: 'hola', pt: 'olá' }, audio: {}, segundos: { es, pt } });

test('cada frase dura lo que el idioma más largo', () => {
  const tl = timelineMulti([{ id: 'a', frases: [fr(1, 2.01), fr(3, 1)] }], 10, T);
  const [a, b] = tl.escenas[0].frases;
  assert.equal(a.dur, 21);
  assert.equal(b.from, 5 + 21 + 5);
  assert.equal(b.dur, 30);
});

test('srt con tiempos absolutos por idioma', () => {
  const tl = timelineMulti([{ id: 'a', frases: [fr(1, 1)] }], 10, T);
  assert.match(srt(tl, 'pt'), /^1\n00:00:01,500 --> 00:00:02,500\nolá/);
});
