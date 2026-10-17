import { test } from 'node:test';
import assert from 'node:assert/strict';
import { faltantes, motorElegido, lotes } from '../scripts/prerender.mjs';

const m = (...ids) => new Map(ids.map((i) => [i, 0]));
const cola = ['a', 'b', 'c', 'd'].map((x) => ({ id: `griegas-0${x}`, tipo: 'episodio' })).concat([{ id: 'short-griegas-quien-z', tipo: 'short' }]);
const nada = { youtube: m(), instagram: m(), tiktok: m() };

test('faltantes: salta publicados en las tres, no listos y lo que ya está en el release', () => {
  const tiene = { youtube: m('griegas-0a'), instagram: m('griegas-0a'), tiktok: m('griegas-0a') };
  const r = faltantes({ cola, tiene, listo: (id) => id !== 'griegas-0b', n: 3, hayAsset: (id, c) => id === 'griegas-0c' && c === 'horizontal' });
  assert.deepEqual(r, [{ id: 'griegas-0c', tipo: 'partes' }, { id: 'griegas-0d', tipo: 'horizontal' }, { id: 'griegas-0d', tipo: 'partes' }]);
});
test('faltantes: un artefacto vigente cuenta como hecho; el short pide solo "short"', () => {
  const r = faltantes({ cola: [cola[0], cola[4]], tiene: nada, listo: () => true, n: 9, hayAsset: () => false, hayArtefacto: (id, t) => t === 'partes' });
  assert.deepEqual(r, [{ id: 'griegas-0a', tipo: 'horizontal' }, { id: 'short-griegas-quien-z', tipo: 'short' }]);
});
test('motor: auto = Modal si hay más de 3; Modal solo para lo que sabe y con claves', () => {
  assert.equal(motorElegido('auto', 3), 'github'); assert.equal(motorElegido('auto', 4), 'modal'); assert.equal(motorElegido('github', 9), 'github');
  const items = [{ id: 'a', tipo: 'horizontal' }, { id: 'b', tipo: 'horizontal' }, { id: 'c', tipo: 'partes' }, { id: 'd', tipo: 'short' }];
  assert.deepEqual(lotes(items, 'auto', true).map((l) => [l.tipo, l.motor]), [['horizontal', 'modal'], ['partes', 'github'], ['short', 'github']]);
  assert.ok(lotes(items, 'modal', false).every((l) => l.motor === 'github')); // sin claves de Modal: respaldo en GitHub
  assert.ok(lotes(items.slice(0, 2), 'auto', true).every((l) => l.motor === 'github'));
});
