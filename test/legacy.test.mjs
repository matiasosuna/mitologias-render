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

import { viejosMini } from '../lib/miniaturas-oficiales.mjs';
import { clavesOficiales as _co } from '../lib/personajes-oficiales.mjs';
import { guardaLegacy } from '../scripts/nube.mjs';
import { MINIS } from '../lib/minis.mjs';
test('viejosDe: la miniatura del guion con claves viejas se detecta (portada, tapa, tarjeta de los verticales)', () => {
  const g = { miniatura: { heroe: 'zeus', rival: { __como: 'hera', barba: false } }, escenas: [] };
  const v = viejosDe('griegas-99-prueba', g);
  assert.ok(v.some((t) => t.includes('miniatura: zeus → zeus_oficial')) && v.some((t) => t.includes('hera → hera_oficial')), v.join('|'));
  assert.deepEqual(viejosDe('griegas-99-prueba', { miniatura: { heroe: 'zeus_oficial' }, escenas: [] }), []);
});
test('viejosDe: sin miniatura en el guion se mira el mapa MINIS (odin/loki nórdicos ya tienen oficial)', () => {
  const o = _co();
  assert.ok(o.nordicas.has('odin_oficial') && o.nordicas.has('loki_oficial'));
  assert.ok(viejosMini('nordicas-xx', { escenas: [] }, o, { 'nordicas-xx': ['odin', 'ymir'] }).some((t) => t.includes('odin → odin_oficial')));
  for (const [id, par] of Object.entries(MINIS)) assert.deepEqual(viejosMini(id, { escenas: [] }, o, { [id]: par }), [], id);
});
test('guardaLegacy: no sube ni baja ningún video/portada de un episodio con claves viejas', () => {
  const malo = () => ['miniatura: odin → odin_oficial'];
  for (const n of ['horizontal.mp4', 'vertical.mp4', 'tiktok.mp4', 'mp4', 'parte-2.mp4', 'portada-ig.jpg', 'tapa-ig.jpg', 'portada-short.jpg', 'miniatura.jpg'])
    assert.throws(() => guardaLegacy(`griegas-08-doce-olimpicos.${n}`, malo), /no se sube/, n);
});
test('guardaLegacy: episodio real limpio pasa; nombres ajenos no se miran', () => {
  guardaLegacy('griegas-08-doce-olimpicos.portada-ig.jpg');
  guardaLegacy('griegas-08-doce-olimpicos.en.srt', () => ['malo']);
});
