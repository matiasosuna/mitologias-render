import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sinPortada, VIDEOS } from '../scripts/yt-quitar-portada-capitulos.mjs';

test('corre capítulos -4 s y deja 0:00', () => {
  const r = sinPortada('Intro\n0:00 Start\n0:34 Two\n1:02 Three');
  assert.match(r, /^0:00 Start$/m);
  assert.match(r, /^0:30 Two$/m);
  assert.match(r, /^0:58 Three$/m);
});
test('saca el viejo 0:00 Intro cuando el primer capítulo estaba en 0:04', () => {
  const r = sinPortada('x\n0:00 Intro\n0:04 Real\n0:22 Two');
  assert.doesNotMatch(r, /Intro/);
  assert.match(r, /^0:00 Real$/m);
  assert.match(r, /^0:18 Two$/m);
});
test('sin capítulos o capítulo antes de 4 s -> null', () => {
  assert.equal(sinPortada('sin nada'), null);
  assert.equal(sinPortada('0:00 A\n0:03 B'), null);
});
test('31 videos sin repetir', () => assert.equal(new Set(VIDEOS).size, 31));
