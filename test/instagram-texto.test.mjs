// Caption de las partes de episodio en Reels: 1.ª línea nueva (título curioso) solo donde no rompe el anti-duplicados.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { textoReel, primeraLinea, lineaVieja, lineaNueva, esLaMisma, curiosoDe } from '../scripts/instagram-texto.mjs';

const base = { gu: { numero: '13', titulo: { en: 'The World Is Reborn', es: 'El mundo renace' } }, nombre: 'Norse', tags: '#norsemythology #vikings', curioso: 'After Ragnarok, Two Humans Hid in a Tree', codigo: 'Norse Mythology S1E13', gancho: 'The gods fell. Something survived.', de: 2 };

test('episodio sin partes publicadas: título curioso + "· Part n/de"', () => {
  const o = { ...base, parte: 1, yaPublicadas: 0 };
  assert.equal(primeraLinea(o), 'After Ragnarok, Two Humans Hid in a Tree · Part 1/2');
  const t = textoReel(o).split('\n');
  assert.equal(t[0], 'After Ragnarok, Two Humans Hid in a Tree · Part 1/2');
  assert.equal(t[1], 'Norse Mythology S1E13');
  assert.ok(textoReel(o).includes('The gods fell. Something survived.'));
  assert.ok(textoReel(o).includes("Follow so you don't miss Part 2"));
  assert.ok(textoReel(o).includes('🇪🇸 El mundo renace · Parte 1/2'));
});

test('episodio con partes ya publicadas con la línea vieja: no cambia (anti-duplicados)', () => {
  const o = { ...base, parte: 2, yaPublicadas: 1 };
  assert.equal(primeraLinea(o), 'The World Is Reborn | Norse Mythology Ep. 13 · Part 2/2 🏺');
  assert.equal(textoReel(o).split('\n')[1], ''); // sin línea de serie: la vieja ya la nombra
  assert.ok(textoReel(o).includes('Continued from Part 1'));
  assert.ok(!textoReel(o).includes('Follow so you'));
});

test('sin título curioso: línea vieja; una sola parte: sin "Part"', () => {
  assert.equal(primeraLinea({ ...base, curioso: '', parte: 1, yaPublicadas: 0 }), lineaVieja({ ...base, parte: 1 }));
  assert.equal(primeraLinea({ ...base, de: 1, parte: 1, yaPublicadas: 0 }), 'After Ragnarok, Two Humans Hid in a Tree');
});

test('el anti-duplicados reconoce la misma parte en los dos formatos, y no otra parte', () => {
  const o = { ...base, parte: 1 };
  assert.ok(esLaMisma(lineaVieja(o), o));
  assert.ok(esLaMisma(lineaNueva(o), o));
  assert.ok(!esLaMisma(lineaNueva({ ...o, parte: 2 }), o));
  assert.ok(!esLaMisma('', { ...o, curioso: '' }));
});

test('la 1.ª línea de lo ya publicado sigue igual que antes del cambio', () => {
  // formato exacto de instagram-reels.mjs hasta 2026-10-15
  const viejo = (gu, nombre, parte, de) => `${gu.titulo.en} | ${nombre} Mythology Ep. ${Number(gu.numero)}${de > 1 ? ` · Part ${parte}/${de}` : ''} 🏺`;
  for (const parte of [1, 2]) assert.equal(lineaVieja({ ...base, parte }), viejo(base.gu, base.nombre, parte, base.de));
});

test('si ya salió una parte con el formato nuevo, las siguientes repiten ese título aunque titulos.json cambie', () => {
  const previas = [{ tipo: 'reel-parte', id: 'x', parte: 1, formato: 'curioso', curioso: 'Título viejo' }];
  assert.equal(curiosoDe(previas, 'The World Is Reborn'), 'Título viejo');
  assert.equal(curiosoDe([{ tipo: 'reel-parte', id: 'x', parte: 1 }], 'The World Is Reborn'), 'The World Is Reborn');
  assert.equal(curiosoDe([], 'The World Is Reborn'), 'The World Is Reborn');
});
