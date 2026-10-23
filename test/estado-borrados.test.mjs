import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sinBorrados } from '../scripts/estado.mjs';

test('lo borrado de la plataforma sale de los registros; una resubida (id nuevo) queda', () => {
  const b = ['YT_viejo', '111'];
  assert.deepEqual(sinBorrados('youtube-ids.json', { 'biblia-genesis-05': 'YT_viejo', 'biblia-genesis-01': 'C1' }, b), { 'biblia-genesis-01': 'C1' });
  assert.deepEqual(sinBorrados('youtube-ids.json', { 'biblia-genesis-05': 'YT_nuevo' }, b), { 'biblia-genesis-05': 'YT_nuevo' });
  assert.deepEqual(sinBorrados('subidas-api.json', [{ id: 'biblia-genesis-05', video: 'YT_viejo' }, { id: 'x', video: 'Z' }], b), [{ id: 'x', video: 'Z' }]);
  assert.deepEqual(sinBorrados('subidas-instagram.json', [{ id: 'biblia-genesis-05', media: '111' }, { id: 'biblia-genesis-05', media: '222' }], b), [{ id: 'biblia-genesis-05', media: '222' }]);
  assert.deepEqual(sinBorrados('turnos.json', { a: 1 }, b), { a: 1 });
});
