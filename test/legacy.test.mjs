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

import { viejosDe, viejosDeArchivo } from '../scripts/legacy.mjs';
import { readdirSync, existsSync } from 'node:fs';
test('viejosDe: un guion con clave vieja que tiene oficial/épico se detecta', () => {
  const g = { escenas: [{ id: 'e', actores: [{ id: 'zeus', x: 1 }, { id: 'leon', x: 2 }] }] };
  const v = viejosDe('griegas-99-prueba', g);
  assert.ok(v.some((t) => t.includes('zeus → zeus_oficial')) && v.some((t) => t.includes('leon')), v.join('|'));
  assert.deepEqual(viejosDe('griegas-99-prueba', { escenas: [{ id: 'e', actores: [{ id: 'zeus_oficial', x: 1 }] }] }), []);
});
test('todos los guiones de las 4 mitologías con diseños ya usan los nuevos', () => {
  const malos = readdirSync('src/videos').filter((d) => /^(griegas|nordicas|egipcias|hawaianas)-/.test(d) && existsSync(`src/videos/${d}/guion.json`) && viejosDeArchivo(d).length);
  assert.deepEqual(malos, []);
});
