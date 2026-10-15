import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { cortes } from '../scripts/vertical-partes.mjs';

const ids = readdirSync('src/videos').filter((d) => /^[a-z]+-\d\d-/.test(d) && existsSync(`src/videos/${d}/timeline.json`));

test('cada parte dura menos de 3 min (con gancho y cartel) y las partes cubren el episodio sin huecos', () => {
  for (const id of ids) {
    const t = JSON.parse(readFileSync(`src/videos/${id}/timeline.json`, 'utf8'));
    const { total, partes } = cortes(t);
    assert.equal(partes[0][0], 0, id);
    assert.equal(partes.at(-1)[1], total, id);
    partes.forEach(([a, b], i) => {
      assert.ok(b > a, id);
      if (i > 0) assert.equal(a, partes[i - 1][1], id);
      assert.ok((b - a) / t.fps + 2 + 2.5 < 180, `${id} parte ${i + 1}: ${((b - a) / t.fps).toFixed(0)} s`);
    });
  }
});

test('los cortes caen al comienzo de una escena o de una frase', () => {
  for (const id of ids) {
    const t = JSON.parse(readFileSync(`src/videos/${id}/timeline.json`, 'utf8'));
    const inicios = new Set(t.escenas.flatMap((e) => [e.from, ...e.frases.map((f) => e.from + f.from)]));
    cortes(t).partes.slice(1).forEach(([a]) => assert.ok(inicios.has(a), `${id}: corte en ${a}`));
  }
});

test('cada episodio con partes tiene gancho: la parte curiosa de su título', async () => {
  const { ganchoParte } = await import('../scripts/titulos.mjs');
  const T = JSON.parse(readFileSync('src/videos/titulos.json', 'utf8'));
  for (const id of ids) {
    const g = ganchoParte(id, T);
    assert.ok(g.length > 0 && g.length <= 70, `${id}: "${g}"`);
    assert.ok(!g.includes('|') && !/Mythology S\d/.test(g), `${id}: "${g}"`);
  }
});
