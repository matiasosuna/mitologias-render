import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clavesLegacy, clavesOficiales } from '../scripts/legacy.mjs';

const of = new Set(['zeus_oficial', 'hera_oficial']);
test('detecta personajes con nombre cuyo oficial existe y no se usa', () => {
  const g = { escenas: [{ actores: [{ id: 'zeus' }, { id: 'hera_oficial' }, { id: 'humano' }, { id: 'leon' }] }, { actores: [{ id: 'zeus' }] }] };
  assert.deepEqual(clavesLegacy(g, of), ['zeus']);
  assert.deepEqual(clavesLegacy({ escenas: [{ actores: [{ id: 'hera_oficial' }] }] }, of), []);
});
test('lee las claves oficiales reales', () => {
  const o = clavesOficiales();
  assert.ok(o.has('zeus_oficial') && o.has('thor_oficial'));
});
