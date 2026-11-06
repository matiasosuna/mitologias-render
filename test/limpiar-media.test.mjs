import { test } from 'node:test';
import assert from 'node:assert/strict';
import { borrables, idDeAsset } from '../scripts/limpiar-media.mjs';

test('limpiar media: solo lo publicado en las 3 redes hace más de N días, y nunca otros releases', () => {
  const dia = 864e5, ahora = 100 * dia, viejo = 90 * dia, reciente = 99 * dia;
  const m = (pares) => new Map(pares);
  const tiene = {
    youtube: m([['a', viejo], ['b', viejo], ['c', reciente], ['d', viejo]]),
    instagram: m([['a', viejo], ['b', viejo], ['c', viejo], ['d', viejo]]),
    tiktok: m([['a', viejo], ['c', viejo], ['d', viejo]]), // b falta en TikTok
  };
  const assets = [
    { release: 'media', nombre: 'a.horizontal.mp4' }, { release: 'media-2', nombre: 'a.tiktok.mp4' },
    { release: 'voz', nombre: 'a.zip' }, { release: 'media', nombre: 'b.horizontal.mp4' },
    { release: 'media', nombre: 'c.horizontal.mp4' }, { release: 'media', nombre: 'd.miniatura.jpg' },
  ];
  const r = borrables({ assets, tiene, guardar: new Set(['d']), ahora, dias: 3 }).map((a) => `${a.release}/${a.nombre}`);
  assert.deepEqual(r, ['media/a.horizontal.mp4', 'media-2/a.tiktok.mp4']);
  assert.equal(idDeAsset('griegas-01-origen.parte-2.mp4'), 'griegas-01-origen');
});
