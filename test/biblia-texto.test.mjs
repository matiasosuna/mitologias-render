import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Learn Bible 777: la narración del capítulo es la KJV tal cual, completa, sin saltear nada.
const dir = 'src/videos';
const norm = (s) => s.replace(/\s+/g, ' ').trim();
for (const id of fs.readdirSync(dir).filter((d) => d.startsWith('biblia-'))) {
  const kjvPath = path.join(dir, id, 'kjv.json');
  if (!fs.existsSync(kjvPath)) continue;
  test(`${id}: narra el texto KJV completo y literal`, () => {
    const g = JSON.parse(fs.readFileSync(path.join(dir, id, 'guion.json'), 'utf8'));
    const kjv = norm(JSON.parse(fs.readFileSync(kjvPath, 'utf8')).verses.map((v) => v.text).join(' '));
    const todo = norm(g.escenas.flatMap((e) => e.frases.map((f) => f.en)).join(' '));
    assert.ok(todo.includes(kjv), 'falta texto o hay palabras cambiadas entre los versículos');
  });
}

test('Génesis 1 tiene "In the original" sin pronunciar el nombre YHWH', () => {
  const g = JSON.parse(fs.readFileSync('src/videos/biblia-genesis-01/guion.json', 'utf8'));
  assert.ok(g.escenas.some((e) => e.id === 'original'));
  assert.doesNotMatch(JSON.stringify(g), /jehovah|yahweh|jehová/i);
});

// Números de versículo en pantalla (lib/versiculos.mjs): se calculan solos contra kjv.json.
import { versiculosDeFrases, versiculosDeGuion, referencia } from '../lib/versiculos.mjs';
const VERSOS = [
  { chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.\n' },
  { chapter: 1, verse: 2, text: 'And the earth was without form, and void;\n and darkness was upon the face of the deep.' },
  { chapter: 1, verse: 3, text: 'And God said, Let there be light: and there was light.' },
];

test('versículos: cada frase KJV lleva el versículo donde arranca; lo demás queda sin referencia', () => {
  const r = versiculosDeFrases(['Genesis, chapter one.', 'In the beginning God created the heaven and the earth.', 'And the earth was without form, and void;', 'and darkness was upon the face of the deep. And God said,', 'Let there be light:', 'and there was light.', 'So what does this mean?'], VERSOS);
  assert.deepEqual(r.map(referencia), ['', '1:1', '1:2', '1:2', '1:3', '1:3', '']);
});

test('versículos: una frase que no sigue el texto no avanza el puntero', () => {
  const r = versiculosDeFrases(['And God said, Let there be light:', 'In the beginning God created the heaven and the earth.'], VERSOS);
  assert.deepEqual(r.map(referencia), ['', '1:1']);
});

test('Génesis 1: los 31 versículos aparecen en orden y las frases no KJV quedan sin número', () => {
  const g = JSON.parse(fs.readFileSync('src/videos/biblia-genesis-01/guion.json', 'utf8'));
  const versos = JSON.parse(fs.readFileSync('src/videos/biblia-genesis-01/kjv.json', 'utf8')).verses;
  const refs = versiculosDeGuion(g, versos);
  const planas = refs.flat().filter(Boolean).map((r) => r.versiculo);
  assert.deepEqual([...new Set(planas)], Array.from({ length: 31 }, (_, i) => i + 1));
  for (let i = 1; i < planas.length; i++) assert.ok(planas[i] >= planas[i - 1]);
  assert.equal(refs[0][0], null, 'la intro "Genesis, chapter one." no lleva número');
  for (const id of ['significado', 'significado2', 'original', 'cierre']) assert.ok(refs[g.escenas.findIndex((e) => e.id === id)].every((r) => r === null), id);
});

import { zonaVersiculo } from '../lib/versiculos.mjs';
test('zona del versículo: arriba si el cielo está libre; abajo si hay rótulos altos, voladores o la luz; override del guion', () => {
  assert.equal(zonaVersiculo({}), 'arriba');
  assert.equal(zonaVersiculo({ rotulos: [{ y: 240 }] }), 'abajo');
  assert.equal(zonaVersiculo({ actores: [{ y: 300 }] }), 'abajo');
  assert.equal(zonaVersiculo({ elementos: [{ tipo: 'luz_divina', y: 170 }] }), 'abajo');
  assert.equal(zonaVersiculo({ elementos: [{ tipo: 'nube_natural', y: 250 }] }), 'arriba');
  assert.equal(zonaVersiculo({ versiculo: 'arriba', rotulos: [{ y: 240 }] }), 'arriba');
});
