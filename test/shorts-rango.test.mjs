// Un short que apunta a una frase inexistente rompe el bundle entero (todas las composiciones), no solo su video.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';

test('cada short de cada guion apunta a frases que existen en su timeline', () => {
  const malos = [];
  for (const d of readdirSync('src/videos')) {
    const p = `src/videos/${d}`;
    if (!existsSync(`${p}/guion.json`) || !existsSync(`${p}/timeline.json`)) continue;
    const g = JSON.parse(readFileSync(`${p}/guion.json`, 'utf8'));
    const tl = JSON.parse(readFileSync(`${p}/timeline.json`, 'utf8'));
    (g.shorts ?? []).forEach((sh, n) => {
      const et = tl.escenas?.[g.escenas.findIndex((e) => e.id === sh.escena)];
      if (!et?.frases?.[sh.desde] || !et?.frases?.[sh.hasta]) malos.push(`${d} short ${n + 1}`);
    });
  }
  assert.deepEqual(malos, []);
});
