// Diseños oficiales egipcios (elencoEgipcioOficial.tsx): claves, cableado y que no pisen el elenco viejo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const leer = (f) => readFileSync(f, 'utf8');
const claves = (bloque) => [...bloque.matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]);
const egipcio = leer('src/motor/elencoEgipcioOficial.tsx');
const ELENCO = claves(egipcio.split('export const ELENCO_EGIPCIO_OFICIAL')[1].split('export const NOMBRE_EN_EGIPCIO_OFICIAL')[0]);
const general = leer('src/motor/elenco.tsx');
const DIOSES = ['ra', 'isis', 'osiris', 'set', 'horus', 'anubis', 'thoth', 'hathor', 'sekhmet', 'nut', 'geb', 'bastet', 'ptah'];

test('están los 13 dioses oficiales', () => {
  assert.deepEqual(ELENCO, DIOSES.map((d) => `${d}_oficial`));
});

test('los de cabeza de animal la dibujan entera (cabezaPropia)', () => {
  for (const d of ['ra', 'set', 'horus', 'anubis', 'thoth', 'sekhmet', 'bastet']) assert.match(egipcio, new RegExp(`^ {2}${d}_oficial: [hm]\\(\\{[^\\n]*cabezaPropia: true`, 'm'), d);
  assert.match(leer('src/comun/vasija.tsx'), /props\.cabezaPropia \? null/);
});

test('cableado: elenco, nombres en inglés y motor-revisar', () => {
  assert.match(general, /\.\.\.ELENCO_EGIPCIO_OFICIAL/);
  assert.match(general, /\.\.\.NOMBRE_EN_EGIPCIO_OFICIAL/);
  assert.match(leer('scripts/motor-revisar.mjs'), /elencoEgipcioOficial\.tsx/);
});

test('los egipcios viejos siguen en elenco.tsx', () => {
  for (const d of ['ra', 'isis', 'osiris', 'anubis', 'thoth']) assert.match(general, new RegExp(`^ {2}${d}: [hm]\\(`, 'm'), d);
});

test('las claves no chocan con otras series', () => {
  const otras = new Set();
  for (const f of readdirSync('src/motor').filter((f) => /^elenco\w*\.tsx$/.test(f) && f !== 'elencoEgipcioOficial.tsx')) {
    const t = leer(`src/motor/${f}`);
    const bloques = f === 'elenco.tsx' ? [t.split('export const ELENCO')[1].split('export type Estado')[0]] : [...t.matchAll(/export const ELENCO_\w+[^=]*= \{([\s\S]*?)\n\};/g)].map((m) => m[1]);
    for (const b of bloques) for (const k of claves(b)) otras.add(k);
  }
  assert.deepEqual(ELENCO.filter((k) => otras.has(k)), []);
});
