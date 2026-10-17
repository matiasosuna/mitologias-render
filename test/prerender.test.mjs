import { test } from 'node:test';
import assert from 'node:assert/strict';
import { faltantes, motorElegido, lotes, costoTotal } from '../scripts/prerender.mjs';

const m = (...ids) => new Map(ids.map((i) => [i, 0]));
const cola = ['a', 'b', 'c', 'd'].map((x) => ({ id: `griegas-0${x}`, tipo: 'episodio' })).concat([{ id: 'short-griegas-quien-z', tipo: 'short' }]);
const nada = { youtube: m(), instagram: m(), tiktok: m() };
const base = { cola, tiene: nada, listo: () => true, hayAsset: () => false };

test('faltantes: salta publicados en las tres, no listos y lo que ya está en el release', () => {
  const tiene = { youtube: m('griegas-0a'), instagram: m('griegas-0a'), tiktok: m('griegas-0a') };
  const r = faltantes({ ...base, tiene, listo: (id) => id !== 'griegas-0b', n: 4, hayAsset: (id, c) => id === 'griegas-0c' && c === 'horizontal' });
  assert.deepEqual(r, [{ id: 'griegas-0c', tipo: 'vertical' }, { id: 'griegas-0c', tipo: 'partes' }, { id: 'griegas-0d', tipo: 'horizontal' }, { id: 'griegas-0d', tipo: 'vertical' }]);
});
test('faltantes: un artefacto vigente cuenta como hecho; el short pide solo "short"', () => {
  const r = faltantes({ ...base, cola: [cola[0], cola[4]], n: 9, hayArtefacto: (id, t) => t === 'vertical' || t === 'partes' });
  assert.deepEqual(r, [{ id: 'griegas-0a', tipo: 'horizontal' }, { id: 'short-griegas-quien-z', tipo: 'short' }]);
});
test('faltantes: omite personajes viejos y los lista; forzar los incluye siempre', () => {
  const omitidos = [];
  const r = faltantes({ ...base, n: 9, omitidos, legacy: (id) => (id === 'griegas-0a' ? ['zeus'] : []), forzar: ['griegas-0d'], hayAsset: (id) => id === 'griegas-0d' });
  assert.deepEqual(omitidos, [{ id: 'griegas-0a', viejos: ['zeus'] }]);
  assert.deepEqual(r.slice(0, 3).map((x) => x.tipo), ['horizontal', 'vertical', 'partes']); // forzado, aunque el release lo tenga
  assert.equal(r[0].id, 'griegas-0d');
  assert.ok(!r.some((x, i) => i >= 3 && x.id === 'griegas-0d') && !r.some((x) => x.id === 'griegas-0a'));
});
test('faltantes: respeta presupuesto en USD y máximo de episodios', () => {
  const r = faltantes({ ...base, n: 99, presupuesto: 1, maxEpisodios: 8 });
  assert.ok(costoTotal(r) <= 1);
  assert.deepEqual(r.map((x) => x.tipo), ['horizontal', 'vertical', 'partes', 'short']); // 0,38+0,27+0,30 = 0,95 → el siguiente episodio no entra; el short cuesta 0
  assert.equal(new Set(faltantes({ ...base, n: 99, maxEpisodios: 2 }).map((x) => x.id)).size, 2);
});
test('motor: Modal por defecto para episodios; github solo si se pide, no hay claves o el tipo no está en Modal', () => {
  assert.equal(motorElegido('auto'), 'modal'); assert.equal(motorElegido('github'), 'github');
  const items = [{ id: 'a', tipo: 'horizontal' }, { id: 'b', tipo: 'vertical' }, { id: 'c', tipo: 'partes' }, { id: 'd', tipo: 'short' }];
  assert.deepEqual(lotes(items, 'modal', true).map((l) => [l.tipo, l.motor]), [['horizontal', 'modal'], ['vertical', 'modal'], ['partes', 'modal'], ['short', 'github']]);
  assert.ok(lotes(items, 'modal', false).every((l) => l.motor === 'github')); // sin claves de Modal: respaldo en GitHub
  assert.ok(lotes(items, 'github', true).every((l) => l.motor === 'github'));
});
test('faltantes: permitir filtra por mitología', () => {
  const r = faltantes({ ...base, n: 99, permitir: (id) => id === 'griegas-0c' });
  assert.deepEqual([...new Set(r.map((x) => x.id))], ['griegas-0c']);
});
