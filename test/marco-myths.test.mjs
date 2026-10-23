import { test } from 'node:test';
import assert from 'node:assert/strict';
import { marcoMyths, tituloCorto, GANCHO_MYTHS, FINAL_MYTHS } from '../scripts/marco-myths.mjs';
import { piezasMarco } from '../lib/marco.mjs';

test('marco de Myths: gancho fijo + "Today" en YouTube y en todas las partes (las 2+ con ", part n."); final con follow', () => {
  const m = marcoMyths('The Mother of the Islands | Hawaiian Mythology S1E6', 3);
  assert.equal(tituloCorto('The Mother of the Islands | Hawaiian Mythology S1E6'), 'The Mother of the Islands');
  assert.equal(m.reels.ganchos[0].en, `${GANCHO_MYTHS} Today: The Mother of the Islands.`);
  assert.deepEqual(m.reels.ganchos.slice(1).map((g) => g.en), [`${GANCHO_MYTHS} Today: The Mother of the Islands, part 2.`, `${GANCHO_MYTHS} Today: The Mother of the Islands, part 3.`]);
  assert.equal(m.youtube.gancho.en, m.reels.ganchos[0].en);
  assert.equal(m.reels.final.en, FINAL_MYTHS);
  assert.ok(GANCHO_MYTHS.startsWith('Ever wanted to know the myths of the ancient world?'));
  // lo toma el marco narrable de siempre
  assert.deepEqual(piezasMarco(m).map((p) => p.id), ['reels-gancho-1', 'reels-gancho-2', 'reels-gancho-3', 'reels-final', 'youtube-gancho', 'youtube-final']);
});
