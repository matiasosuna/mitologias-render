// Nórdicos secundarios, extras y animales oficiales (elencoNordicoOficial.tsx): claves, cableado y que no choquen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const leer = (f) => readFileSync(f, 'utf8');
const claves = (bloque) => [...bloque.matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]);
const archivo = leer('src/motor/elencoNordicoOficial.tsx');
const ELENCO = claves(archivo.split('export const ELENCO_NORDICO_OFICIAL')[1].split('export const NOMBRE_EN_NORDICO_OFICIAL')[0]);

test('cada personaje con nombre de los videos pendientes tiene su diseño oficial', () => {
  const nombres = ['hervor', 'brynhild', 'fenja', 'grani', 'helgi', 'sigurd', 'fafnir', 'sigrun', 'skadi', 'starkad', 'andvari', 'angantyr', 'arngrim', 'brokkr', 'dag', 'durin', 'dvalin', 'elli', 'eyfura', 'fenrir', 'fjolnir', 'frodi', 'gjuki', 'grimhild', 'gudrun', 'gunnar', 'gunnlod', 'guttorm', 'hather', 'hjalmar', 'hodbrodd', 'hodr', 'hoenir', 'hreidmar', 'hrym', 'hunding', 'menja', 'mimir', 'mysing', 'odd', 'ran', 'regin', 'sigyn', 'suttung', 'svafa', 'svafrlami', 'thjalfi', 'vanir', 'vikar', 'volund'];
  for (const n of nombres) assert.ok(ELENCO.includes(`${n}_oficial`), n);
  for (const k of ['fafnir_hombre_oficial', 'helgi_nino_oficial', 'suttung_aguila_oficial', 'otr_oficial', 'utgarda_loki_oficial', 'hrossharsgrani_oficial']) assert.ok(ELENCO.includes(k), k);
});

test('extras y animales con variantes, con la serie en la clave', () => {
  for (const k of ['vikingo', 'hombre', 'joven', 'anciano', 'rey', 'jotun', 'enano', 'nino']) assert.ok(ELENCO.includes(`${k}_nordico_oficial`), k);
  for (const k of ['mujer', 'anciana', 'reina', 'nina', 'valquiria', 'norna']) assert.ok(ELENCO.includes(`${k}_nordica_oficial`), k);
  assert.ok(ELENCO.filter((k) => k.startsWith('vikingo_nordico')).length >= 4, 'vikingos variados');
  for (const k of ['cuervo_nordico', 'caballo_nordico', 'aguila_nordica', 'cabra_nordica', 'ciervo_nordico', 'lobo_nordico', 'pez_nordico', 'serpiente_nordica']) assert.ok(ELENCO.includes(`${k}_oficial`), k);
});

test('todas las claves terminan en _oficial y las personas usan la oreja simple', () => {
  assert.deepEqual(ELENCO.filter((k) => !k.endsWith('_oficial')), []);
  assert.equal((archivo.match(/orejaSimple: true/g) ?? []).length, 2, 'los dos armadores (H y M) la ponen');
  assert.doesNotMatch(archivo, /orejaSimple: false/);
});

test('cableado: elenco, nombres en inglés y motor-revisar', () => {
  const general = leer('src/motor/elenco.tsx');
  assert.match(general, /\.\.\.ELENCO_NORDICO_OFICIAL/);
  assert.match(general, /\.\.\.NOMBRE_EN_NORDICO_OFICIAL/);
  assert.match(leer('scripts/motor-revisar.mjs'), /'Nordico'/);
});

test('las claves no chocan con otras series', () => {
  const otras = new Map();
  for (const f of readdirSync('src/motor').filter((f) => /^elenco\w*\.tsx$/.test(f) && f !== 'elencoNordicoOficial.tsx')) {
    const t = leer(`src/motor/${f}`);
    const bloques = f === 'elenco.tsx' ? [t.split('export const ELENCO')[1].split('export type Estado')[0]] : [...t.matchAll(/export const ELENCO_\w+[^=]*= \{([\s\S]*?)\n\};/g)].map((m) => m[1]);
    for (const b of bloques) for (const k of claves(b)) otras.set(k, f);
  }
  assert.deepEqual(ELENCO.filter((k) => otras.has(k)).map((k) => `${k} (${otras.get(k)})`), []);
});
