// Learn Bible 777 (serie `biblia`, tema "natural"): el guion usa solo fondos, elementos y elenco que existen, respeta
// el formato (frases cortas, citas KJV, Dios solo como luz), no dice "Myths on Clay" y la serie está cableada.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';

const leer = (f) => readFileSync(f, 'utf8');
const lista = (archivo, nombre) => (leer(archivo).match(new RegExp(`export const ${nombre} = \\[([^\\]]*)\\]`))?.[1] ?? '').match(/'(\w+)'/g).map((x) => x.slice(1, -1));
const claves = (texto) => [...texto.matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]);
const FONDOS = new Set(lista('src/motor/fondosBiblia.tsx', 'FONDOS_BIBLIA'));
const ELEMS = new Set(lista('src/motor/fondosBiblia.tsx', 'ELEMENTOS_BIBLIA'));
const GENERICOS = new Set(['sol', 'luna', 'estrellas', 'nube', 'olivo', 'arbol', 'palmera', 'roca', 'monte']);
const cuerpo = leer('src/motor/elencoBiblia.tsx').split('export const ELENCO_BIBLIA')[1].split('export const NOMBRE_EN_BIBLIA')[0];
const ELENCO = new Set(claves(cuerpo));
const guiones = readdirSync('src/videos').filter((d) => d.startsWith('biblia-')).map((d) => JSON.parse(leer(`src/videos/${d}/guion.json`)));
const g1 = guiones.find((g) => g.id === 'biblia-genesis-01');

test('Génesis 1 existe y usa fondos, elementos y elenco conocidos', () => {
  assert.ok(g1, 'falta src/videos/biblia-genesis-01/guion.json');
  for (const g of guiones) {
    assert.equal(g.serie, 'biblia');
    assert.equal(g.escenas.at(-1).id, 'cierre', `${g.id}: la última escena es el cierre`);
    for (const e of g.escenas) {
      assert.ok(FONDOS.has(e.fondo), `${g.id}/${e.id}: fondo ${e.fondo}`);
      for (const el of e.elementos ?? []) assert.ok(ELEMS.has(el.tipo) || GENERICOS.has(el.tipo), `${g.id}/${e.id}: elemento ${el.tipo}`);
      for (const a of e.actores ?? []) assert.ok(ELENCO.has(a.como ?? a.id), `${g.id}/${e.id}: actor ${a.como ?? a.id}`);
    }
  }
});

test('frases en inglés de 130 caracteres como mucho, 3 a 10 por escena', () => {
  for (const g of guiones) {
    let palabras = 0;
    for (const e of g.escenas) {
      assert.ok(e.frases.length >= 3 && e.frases.length <= 10, `${g.id}/${e.id}: ${e.frases.length} frases`);
      for (const f of e.frases) { assert.ok(f.en && f.en.length <= 130, `${g.id}/${e.id}: ${f.en}`); palabras += f.en.split(/\s+/).length; }
    }
    // Sin tope de duración: se narra el capítulo entero (ver test/biblia-texto.test.mjs).
    assert.ok(palabras > 0, g.id);
  }
});

test('Génesis 1 cita la KJV textual, cierra con el capítulo 2 y explica qué quiere decir', () => {
  const texto = g1.escenas.flatMap((e) => e.frases.map((f) => f.en)).join(' ');
  for (const cita of ['In the beginning God created the heaven and the earth.', 'Let there be light: and there was light.', 'So God created man in his own image', 'behold, it was very good.']) assert.ok(texto.includes(cita), cita);
  assert.ok(g1.escenas.some((e) => e.id.startsWith('significado')), 'falta la parte "What does it mean?"');
  assert.match(g1.siguiente.en, /Chapter 2/);
  assert.match(g1.escenas.at(-1).frases.map((f) => f.en).join(' '), /chapter 2/i);
});

test('Dios nunca es un personaje y no aparece "Myths on Clay"', () => {
  for (const g of guiones) {
    assert.doesNotMatch(JSON.stringify(g), /myths on clay/i);
    for (const e of g.escenas) for (const a of e.actores ?? []) assert.doesNotMatch(a.como ?? a.id, /dios|god|yahweh|jehova/i);
  }
  assert.doesNotMatch(cuerpo, /dios|god/i);
});

test('las claves del elenco bíblico no chocan con las de otras series', () => {
  const otras = new Map();
  for (const f of readdirSync('src/motor').filter((f) => /^elenco\w*\.tsx$/.test(f) && f !== 'elencoBiblia.tsx')) {
    const t = leer(`src/motor/${f}`);
    const bloques = f === 'elenco.tsx' ? [t.split('export const ELENCO')[1].split('export type Estado')[0]] : [...t.matchAll(/export const ELENCO_\w+[^=]*= \{([\s\S]*?)\n\};/g)].map((m) => m[1]);
    for (const b of bloques) for (const k of claves(b)) otras.set(k, f);
  }
  assert.deepEqual(claves(cuerpo).filter((k) => otras.has(k)).map((k) => `${k} (${otras.get(k)})`), []);
});

test('la serie está cableada: tema, marca, música y render', () => {
  const vasija = leer('src/comun/vasija.tsx');
  assert.match(vasija, /serie === 'biblia' \? 'natural'/);
  assert.match(vasija, /natural: \{ en: 'Learn Bible 777'/);
  assert.match(vasija, /musica: 'musica\/biblia\.wav'/);
  assert.match(vasija, /TEMA\.nombre === 'natural' \? 'LEARN BIBLE 777' : 'MYTHS ON CLAY'/);
  assert.match(leer('src/motor/fondos.tsx'), /fondoBiblia\(/);
  assert.match(leer('src/motor/elenco.tsx'), /\.\.\.ELENCO_BIBLIA/);
  assert.match(leer('scripts/motor-render.mjs'), /'biblia' \? 'biblia'/);
  assert.match(leer('scripts/modal_render.py'), /"biblia": "biblia"/);
  assert.match(leer('scripts/motor-revisar.mjs'), /fondosBiblia\.tsx/);
  for (const f of ['src/motor/VideoMotor.tsx', 'src/motor/Short.tsx', 'src/motor/ShortNativo.tsx', 'src/motor/VideoVertical.tsx', 'src/comun/portadaIG.tsx']) assert.match(leer(f), /marcaCanal\(\)/, f);
  assert.ok(statSync('public/musica/biblia.wav').size > 40e6, 'falta public/musica/biblia.wav (node scripts/musica-biblia.mjs)');
});
