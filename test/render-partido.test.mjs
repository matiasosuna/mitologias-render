import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rangos } from '../scripts/render-partido.mjs';

test('rangos cubren todos los cuadros sin huecos ni solapes', () => {
  for (const [n, k] of [[100, 3], [3450, 8], [7, 10], [1, 1], [500, 1]]) {
    const r = rangos(n, k);
    assert.equal(r[0][0], 0);
    assert.equal(r.at(-1)[1], n - 1);
    for (let i = 1; i < r.length; i++) assert.equal(r[i][0], r[i - 1][1] + 1);
    assert.ok(r.length <= Math.max(1, k));
  }
});
