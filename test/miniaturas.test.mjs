// Todo episodio (no Short) necesita miniatura: "miniatura" en el guion o una entrada en MINIS (si no, Modal/nube la dejaban sin miniatura).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

test('cada episodio tiene héroe y rival para su miniatura', () => {
  const src = readFileSync('scripts/miniaturas.mjs', 'utf8');
  const minis = new Set([...src.matchAll(/^ {2}'([a-z0-9-]+)': \[/gm)].map((m) => m[1]));
  const sin = [];
  for (const d of readdirSync('src/videos')) {
    const f = `src/videos/${d}/guion.json`;
    if (d.startsWith('short-') || !existsSync(f)) continue;
    const g = JSON.parse(readFileSync(f, 'utf8'));
    if (!g.miniatura && !g.quien && !minis.has(d)) sin.push(d);
  }
  assert.deepEqual(sin, []);
});
