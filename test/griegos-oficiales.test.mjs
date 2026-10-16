// Diseños oficiales griegos (elencoGriegoOficial.tsx): claves, cableado y que no pisen el elenco viejo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const leer = (f) => readFileSync(f, 'utf8');
const claves = (bloque) => [...bloque.matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]);
const griego = leer('src/motor/elencoGriegoOficial.tsx');
const ELENCO = claves(griego.split('export const ELENCO_GRIEGO_OFICIAL')[1].split('export const NOMBRE_EN_GRIEGO_OFICIAL')[0]);
const NOMBRES = claves(griego.split('export const NOMBRE_EN_GRIEGO_OFICIAL')[1].replace(/, /g, ',\n  '));
const general = leer('src/motor/elenco.tsx');
const bloqueGeneral = general.split('export const ELENCO')[1].split('export type Estado')[0];
const DIOSES = ['zeus', 'hera', 'poseidon', 'hades', 'atenea', 'apolo', 'artemisa', 'hermes', 'afrodita', 'ares', 'hefesto', 'dioniso', 'prometeo', 'cronos'];

test('están los 14 oficiales, cada uno con su nombre en inglés', () => {
  for (const d of DIOSES) {
    assert.ok(ELENCO.includes(`${d}_oficial`), `${d}_oficial`);
    assert.ok(NOMBRES.includes(`${d}_oficial`), `nombre de ${d}_oficial`);
  }
});

test('los griegos viejos siguen en el elenco general', () => {
  for (const d of DIOSES) assert.match(bloqueGeneral, new RegExp(`^ {2}${d}: [hm]\\(`, 'm'), d);
});

test('cableado: elenco, nombres en inglés y motor-revisar', () => {
  assert.match(general, /\.\.\.ELENCO_GRIEGO_OFICIAL/);
  assert.match(general, /\.\.\.NOMBRE_EN_GRIEGO_OFICIAL/);
  assert.match(leer('scripts/motor-revisar.mjs'), /elencoGriegoOficial\.tsx/);
});

test('las claves no chocan con otras series', () => {
  const otras = new Map();
  for (const f of readdirSync('src/motor').filter((f) => /^elenco\w*\.tsx$/.test(f) && f !== 'elencoGriegoOficial.tsx')) {
    const t = leer(`src/motor/${f}`);
    const bloques = f === 'elenco.tsx' ? [bloqueGeneral] : [...t.matchAll(/export const ELENCO_\w+[^=]*= \{([\s\S]*?)\n\};/g)].map((m) => m[1]);
    for (const b of bloques) for (const k of claves(b)) otras.set(k, f);
  }
  assert.deepEqual(ELENCO.filter((k) => otras.has(k)), []);
});

test('piel natural (nunca la silueta negra) y atributos dibujados en el propio archivo', () => {
  assert.doesNotMatch(griego, /objeto: '/, 'los atributos van como adornos propios, no como objetos del motor');
  for (const d of DIOSES) {
    const linea = griego.split('\n').find((l) => l.startsWith(`  ${d}_oficial:`));
    assert.ok(linea, d);
    assert.ok(/piel: PIEL_/.test(linea) || /^ {2}\w+: m\(/.test(linea), `${d}: piel natural`);
  }
});
