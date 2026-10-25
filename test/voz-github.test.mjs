import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';
import { tandas, empaquetar } from '../scripts/voz-github.mjs';

test('voz en GitHub: tandas de 60 frases que entran en un dispatch (≤ 65 kB)', () => {
  const frases = Array.from({ length: 130 }, (_, i) => ({ h: `h${i}`, texto: 'In the beginning God created the heaven and the earth, and the earth was without form. '.repeat(2) }));
  const t = tandas(frases);
  assert.deepEqual(t.map((x) => x.length), [60, 60, 10]);
  for (const x of t) { const p = empaquetar(x); assert.ok(p.length < 60000); assert.deepEqual(JSON.parse(gunzipSync(Buffer.from(p, 'base64'))), x); }
});
