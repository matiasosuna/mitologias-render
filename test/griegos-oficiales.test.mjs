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

const TANDA_2 = ['rea', 'hestia', 'demeter', 'persefone', 'zeus_nino', 'amaltea', 'titan', 'ciclope', 'gea', 'urano', 'metis', 'maia', 'heracles', 'perseo', 'medusa', 'teseo', 'minotauro', 'ariadna', 'dedalo', 'icaro', 'midas', 'aracne', 'jason', 'eco', 'narciso', 'odiseo', 'pandora', 'epimeteo', 'hecatonquiro', 'tifon'];

test('segunda tanda: todos con ficha y nombre en inglés', () => {
  for (const d of TANDA_2) {
    assert.ok(ELENCO.includes(`${d}_oficial`), `${d}_oficial`);
    assert.ok(NOMBRES.includes(`${d}_oficial`), `nombre de ${d}_oficial`);
  }
});

test('el Short "Who is Zeus?" usa solo personajes oficiales (salvo animales)', () => {
  const g = JSON.parse(leer('src/videos/short-griegas-quien-zeus/guion.json'));
  const actores = [...g.escenas, g.coldOpen ?? {}].flatMap((e) => e.actores ?? []);
  const sinOficial = actores.filter((a) => !['aguila'].includes(a.como ?? a.id) && !String(a.como ?? a.id).endsWith('_oficial')).map((a) => a.id);
  assert.deepEqual(sinOficial, []);
  for (const a of actores) if (String(a.como).endsWith('_oficial')) assert.ok(ELENCO.includes(a.como), a.como);
});

// Tercera tanda (2026-10-17): todo personaje griego de los videos por publicar con diseño oficial.
const CON_NOMBRE = ['helios', 'leto', 'temis', 'asteria', 'iris', 'ilitia', 'hebe', 'anfitrite', 'tetis', 'eurinome', 'semele', 'ino', 'beroe', 'muerte', 'hefesto_nino',
  'cadmo', 'cecrope', 'licaon', 'sisifo', 'sisifo_roca', 'merope', 'aquiles', 'penelope', 'medea', 'talos', 'pitia', 'deucalion', 'pirra', 'homero', 'demodoco', 'maron',
  'acetes', 'marsias', 'aegipan', 'delfine', 'piton', 'cerbero', 'pegaso', 'licaon_lobo', 'dioniso_cabrito', 'dioniso_leon'];
const EXTRAS = ['hombre_griego', 'hombre_griego_2', 'hombre_griego_3', 'joven_griego', 'joven_griego_2', 'anciano_griego', 'anciano_griego_2', 'mujer_griega', 'mujer_griega_2', 'mujer_griega_3',
  'anciana_griega', 'nino_griego', 'nina_griega', 'ninfa', 'ninfa_2', 'ninfa_3', 'gracia', 'hora', 'musa', 'musa_2', 'musa_3', 'guerrero_griego', 'guerrero_griego_2', 'persa',
  'rey_griego', 'rey_griego_2', 'reina_griega', 'reina_griega_2', 'sacerdote_griego', 'sacerdotisa_griega', 'sacerdotisa_griega_2', 'gigante_griego', 'gigante_griego_2',
  'pastor_griego', 'pastor_griego_2', 'marinero_griego', 'marinero_griego_2', 'pirata', 'pirata_2', 'doncella_oro', 'lotofago', 'lotofaga'];
const ANIMALES = ['caballo_griego', 'mula_griega', 'buey_griego', 'vaca_griega', 'toro_griego', 'oveja_griega', 'carnero_griego', 'cabra_griega', 'ciervo_griego', 'perro_griego', 'lobo_griego',
  'leon_griego', 'oso_griego', 'tortuga_griega', 'serpiente_griega', 'aguila_griega', 'paloma_griega', 'cisne_griego', 'pavo_real_griego', 'buho_griego', 'delfin_griego'];
const linea = (k) => griego.split('\n').find((l) => l.startsWith(`  ${k}: `)) ?? '';

test('tercera tanda: secundarios con nombre, cada uno con su nombre en inglés', () => {
  for (const d of CON_NOMBRE) {
    assert.ok(ELENCO.includes(`${d}_oficial`), `${d}_oficial`);
    assert.ok(NOMBRES.includes(`${d}_oficial`), `nombre de ${d}_oficial`);
  }
});

test('tercera tanda: extras y animales sin rótulo (no llevan nombre griego ni inglés)', () => {
  for (const d of [...EXTRAS, ...ANIMALES]) {
    assert.ok(ELENCO.includes(`${d}_oficial`), `${d}_oficial`);
    assert.ok(!NOMBRES.includes(`${d}_oficial`), `${d}_oficial no lleva nombre`);
    assert.doesNotMatch(linea(`${d}_oficial`), /, '[^']+'\)/, `${d}_oficial sin nombre griego`);
  }
});

test('tercera tanda: animales y criaturas con dibujo de barro propio', () => {
  for (const d of [...ANIMALES, 'piton', 'cerbero', 'pegaso', 'licaon_lobo', 'dioniso_cabrito', 'dioniso_leon']) assert.match(linea(`${d}_oficial`), /: D\(/, d);
});

// Animales épicos (2026-10-17): dibujos grandes de bestiasEpicas.tsx con alto propio para el rótulo.
test('animales y criaturas épicos: componente de bestiasEpicas y alto propio', () => {
  const epicos = leer('src/motor/bestiasEpicas.tsx');
  for (const d of [...ANIMALES, 'piton', 'cerbero', 'pegaso', 'licaon_lobo']) {
    const l = linea(`${d}_oficial`);
    const comp = l.match(/: D\((\w+),/)?.[1];
    assert.ok(comp && new RegExp(`export const ${comp}\\b`).test(epicos), `${d}: ${comp} en bestiasEpicas.tsx`);
    assert.match(l, /alto: \d+/, `${d}: alto propio`);
  }
});

test('el motor usa p.alto de los dibujos para ubicar el rótulo (sin alto sigue en 200)', () => {
  const esc = leer('src/motor/Escena.tsx');
  assert.match(esc, /ficha\.tipo === 'dibujo' && typeof ficha\.p\?\.alto === 'number'/);
  assert.match(esc, /: 200;/);
});
