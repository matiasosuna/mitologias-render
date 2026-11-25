// Instagram (Matías 2026-11-25: «al final está el next episode y subscribe. mal»): un episodio marcado con
// "claridad" no anuncia el próximo episodio ni pide suscribirse, ni en la voz ni en los rótulos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const ANUNCIO = /\bnext (story|episode|time|chapter)\b|\bin the next\b|\bsubscribe\b|pr[oó]xim[oa] (episodio|historia|vez|cap[ií]tulo)|suscrib/i;
const textos = (x) => (x == null ? [] : typeof x === 'string' ? [x] : typeof x === 'object' ? Object.values(x).flatMap(textos) : []);

test('los episodios con claridad no anuncian el siguiente ni piden suscribirse', () => {
  const malos = [];
  for (const id of readdirSync('src/videos')) {
    const f = `src/videos/${id}/guion.json`;
    if (!existsSync(f)) continue;
    const g = JSON.parse(readFileSync(f, 'utf8'));
    if (g.claridad !== true) continue;
    for (const e of g.escenas ?? []) {
      for (const fr of e.frases ?? []) for (const t of textos(fr)) if (ANUNCIO.test(t)) malos.push(`${id} ${e.id}: ${t}`);
      for (const r of e.rotulos ?? []) for (const t of textos(r.texto)) if (ANUNCIO.test(t)) malos.push(`${id} ${e.id} (rótulo): ${t}`);
    }
  }
  assert.deepEqual(malos, []);
});
