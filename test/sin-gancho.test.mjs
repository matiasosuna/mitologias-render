import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sinGancho } from '../scripts/sin-gancho.mjs';
import { tieneGancho, horizontalConMarco, verticalConGancho } from '../lib/marco.mjs';

const leer = (id) => ['guion', 'timeline'].map((f) => JSON.parse(readFileSync(`src/videos/${id}/${f}.json`, 'utf8')));

test('sin gancho (2026-10-24): Myths vuelve al formato de antes (sin marco); la Biblia queda como Génesis 1 (solo la pregunta final)', () => {
  const g = { reels: { ganchos: [{ en: 'x' }], pausas: { x: 0.1 }, tempos: { gancho: 1.25 }, final: { en: 'f' } }, youtube: { gancho: { en: 'x' }, final: { en: 'f' } }, escenas: [{}] };
  const tl = { introFrames: 96, escenas: [{ from: 96, durationInFrames: 10, frases: [] }], total: 106, marco: { 'reels-gancho-1': {}, 'youtube-gancho': {}, 'reels-final': {}, 'youtube-final': {} } };
  const m = sinGancho('hawaianas-07-x', g, tl);
  assert.equal(tieneGancho(m.guion), false);
  assert.equal(m.timeline.marco, undefined);
  assert.deepEqual(m.guion.reels, {}); assert.deepEqual(m.guion.youtube, {});
  const b = sinGancho('biblia-genesis-02', g, tl);
  assert.deepEqual(Object.keys(b.timeline.marco), ['reels-final', 'youtube-final']);
  assert.deepEqual(b.guion.reels, { final: { en: 'f' } }); assert.deepEqual(b.guion.youtube, { final: { en: 'f' } });
  assert.ok(g.reels.ganchos && tl.marco['reels-gancho-1'], 'no toca los originales');
});

test('sin gancho: el horizontal y el vertical arrancan con la portada (introFrames) y no traen escena de gancho', () => {
  const [g, tl] = leer('biblia-genesis-01'); // modelo: Génesis 1 nunca tuvo gancho
  for (const id of ['biblia-genesis-01', 'biblia-genesis-02', 'hawaianas-07-el-nino-estrella-y-el-taro']) {
    const [gi, ti] = id === 'biblia-genesis-01' ? [g, tl] : leer(id);
    const s = sinGancho(id, gi, ti);
    const h = horizontalConMarco(s.guion, s.timeline).timeline, v = verticalConGancho(s.guion, s.timeline).timeline;
    for (const t of [h, v]) {
      assert.equal(t.introFrames, ti.introFrames, `${id}: portada al principio`);
      assert.ok(!t.escenas.some((e) => e.gancho || e.id === 'apertura'), `${id}: sin gancho`);
    }
  }
});

test('ningún episodio (Myths ni Biblia) trae gancho: un solo video largo (Matías 2026-10-24)', async () => {
  const { readdirSync, readFileSync, existsSync } = await import('node:fs');
  const conGancho = readdirSync('src/videos').filter((d) => !d.startsWith('short-') && existsSync(`src/videos/${d}/guion.json`))
    .filter((d) => { const g = JSON.parse(readFileSync(`src/videos/${d}/guion.json`, 'utf8')); return g.reels?.ganchos || g.youtube?.gancho; });
  assert.deepEqual(conGancho, []);
});
