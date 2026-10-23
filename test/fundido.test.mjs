// Fundido de rótulos: el rango de interpolate nunca se cruza (bug de vertical-partes biblia-genesis-02: [488,500,476,488]).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { rangoFundido } from '../lib/fundido.mjs';

const creciente = (r) => r.every((x, i) => i === 0 || x > r[i - 1]);
// = src/motor/Escena.tsx momento()
const momento = (tl, n) => { const i = Math.floor(n), fr = n - i, fs = tl.frases; if (i < 0) return 0; if (i >= fs.length) return tl.durationInFrames; return fs[i].from + fr * fs[i].dur; };

test('rangoFundido: estrictamente creciente o null', () => {
  assert.equal(rangoFundido(488, 488, 12), null);
  assert.equal(rangoFundido(488, 476, 12), null);
  assert.equal(rangoFundido(10, 12, 12), null);
  assert.deepEqual(rangoFundido(0, 100, 12), [0, 12, 88, 100]);
  for (let d = 3; d < 40; d++) assert.ok(creciente(rangoFundido(100, 100 + d, 12)), String(d));
});

test('todos los rótulos de todos los videos dan un rango válido (vertical y horizontal)', () => {
  for (const id of readdirSync('src/videos').filter((d) => existsSync(`src/videos/${d}/timeline.json`))) {
    const g = JSON.parse(readFileSync(`src/videos/${id}/guion.json`, 'utf8')), tl = JSON.parse(readFileSync(`src/videos/${id}/timeline.json`, 'utf8'));
    (g.escenas ?? []).forEach((e, i) => (e.rotulos ?? []).forEach((r) => {
      const t = tl.escenas?.[i]; if (!t) return;
      const t0 = momento(t, r.en), t1 = r.hasta !== undefined ? momento(t, r.hasta) : t.durationInFrames;
      const rango = rangoFundido(t0, t1, 12);
      assert.ok(rango === null || creciente(rango), `${id}/${e.id}: ${rango}`);
    }));
  }
});
