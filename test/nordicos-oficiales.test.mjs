// Diseños oficiales de Thor, Odín y Loki (elencoNordico.tsx): claves, cableado y que no pisen el elenco viejo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const leer = (f) => readFileSync(f, 'utf8');
const claves = (bloque) => [...bloque.matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]);
const nordico = leer('src/motor/elencoNordico.tsx');
const ELENCO = claves(nordico.split('export const ELENCO_NORDICO')[1].split('export const NOMBRE_EN_NORDICO')[0]);
const general = leer('src/motor/elenco.tsx');
const bloqueGeneral = general.split('export const ELENCO')[1].split('export type Estado')[0];

test('existen las dos versiones de los tres', () => {
  for (const n of ['thor', 'odin', 'loki']) for (const v of ['muneco', 'oficial']) assert.ok(ELENCO.includes(`${n}_${v}`), `${n}_${v}`);
});

test('están los demás dioses oficiales nórdicos', () => {
  for (const n of ['freya', 'frigg', 'tyr', 'baldr', 'heimdall', 'hel', 'sif', 'freyr', 'njord']) assert.ok(ELENCO.includes(`${n}_oficial`), n);
  assert.ok(!ELENCO.some((k) => k.endsWith('_nuevo')), 'no quedan claves _nuevo');
});

test('todos los oficiales usan la oreja simple (sin el espiral)', () => {
  for (const k of ELENCO.filter((k) => k.endsWith('_oficial'))) assert.match(nordico, new RegExp(`^ {2}${k}: [hm]\\(\\{ orejaSimple: true`, 'm'), k);
  assert.match(leer('src/comun/vasija.tsx'), /props\.orejaSimple \?/);
});

test('Týr no tiene mano derecha (manoCortada en el motor)', () => {
  assert.match(nordico, /tyr_oficial: h\(\{[^\n]*manoCortada: true/);
  assert.match(leer('src/comun/vasija.tsx'), /props\.manoCortada \?/);
});

test('los thor/odin/loki viejos siguen intactos', () => {
  assert.match(bloqueGeneral, /^ {2}odin: h\(\{ tocado: 'sombrero', tuerto: true, objeto: 'lanza', capa: '#2B4660', barba: true, canas: true \}, 'ODIN'\),$/m);
  assert.match(bloqueGeneral, /^ {2}thor: h\(\{ tocado: 'yelmo', objeto: 'mjolnir', barba: true, pelo: '#B5452A', capa: C\.purpura, gigante: true \}, 'THOR'\),$/m);
  assert.match(bloqueGeneral, /^ {2}loki: h\(\{ barba: false, tocado: null, capa: '#3E6B4E', pelo: '#B5452A' \}, 'LOKI'\),$/m);
});

test('cableado: elenco, nombres en inglés y motor-revisar', () => {
  assert.match(general, /\.\.\.ELENCO_NORDICO/);
  assert.match(general, /\.\.\.NOMBRE_EN_NORDICO/);
  assert.match(leer('scripts/motor-revisar.mjs'), /elencoNordico\.tsx/);
});

test('las claves no chocan con otras series', () => {
  const otras = new Map();
  for (const f of readdirSync('src/motor').filter((f) => /^elenco\w*\.tsx$/.test(f) && f !== 'elencoNordico.tsx')) {
    const t = leer(`src/motor/${f}`);
    const bloques = f === 'elenco.tsx' ? [bloqueGeneral] : [...t.matchAll(/export const ELENCO_\w+[^=]*= \{([\s\S]*?)\n\};/g)].map((m) => m[1]);
    for (const b of bloques) for (const k of claves(b)) otras.set(k, f);
  }
  assert.deepEqual(ELENCO.filter((k) => otras.has(k)), []);
});

test('los objetos que usan existen en el motor', () => {
  const vasija = leer('src/comun/vasija.tsx');
  const tipos = vasija.match(/export type Objeto = ([^;]+);/)[1];
  for (const o of [...nordico.matchAll(/objeto: '(\w+)'/g)].map((m) => m[1])) {
    assert.ok(tipos.includes(`'${o}'`), `Objeto ${o}`);
    assert.ok(vasija.includes(`case '${o}'`), `dibujo de ${o}`);
  }
  assert.match(vasija, /guante\?: string/);
});

test('Mjölnir gira con el antebrazo: abajo cuelga, arriba queda en alto', () => {
  // misma cuenta que ObjetoMano('mjolnir_corto')
  const giro = (ang) => { const t = Math.min(1, Math.max(0, (ang - 20) / 100)); return 175 * (1 - t * t * (3 - 2 * t)); };
  assert.equal(giro(0), 175);
  assert.equal(giro(180), 0);
  assert.ok(giro(75) > 0 && giro(75) < 175);
  assert.match(leer('src/comun/vasija.tsx'), /giro = 175 \* \(1 - t \* t \* \(3 - 2 \* t\)\)/);
});
