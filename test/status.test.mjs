import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tablaMitologias, resumenCola, tablaEstado, tablaMetricas, armarStatus } from '../scripts/status.mjs';

const titulos = { 'griegas-01-a': { titulo: 'A', temporada: 1, episodio: 1 }, 'griegas-02-b': { titulo: 'B', temporada: 1, episodio: 2 }, 'griegas-99-o': { titulo: 'O', especial: 'The Odyssey', temporada: 0, episodio: 1 }, 'nordicas-01-c': { titulo: 'C', temporada: 1, episodio: 1 } };
const m = (...ids) => new Map(ids.map((i) => [i, 0]));
const tiene = { youtube: m('griegas-01-a', 'griegas-02-b'), instagram: m('griegas-01-a'), tiktok: m() };

test('tablaMitologias cuenta por mitología y temporada, sin Shorts', () => {
  const t = tablaMitologias({ ids: [...Object.keys(titulos), 'short-griegas-quien-zeus'], titulos, tiene });
  assert.match(t, /\| Griegas \| T1 \| 2 \| 2 \| 1 \|/);
  assert.match(t, /\| Griegas \| Especial The Odyssey \| 1 \| 0 \| 0 \|/);
  assert.match(t, /\| Nórdicas \| T1 \| 1 \| 0 \| 0 \|/);
  assert.ok(!t.includes('short-'));
});

test('resumenCola: próximos y "Who is…?" listos', () => {
  const cola = [{ id: 'griegas-01-a', tipo: 'episodio' }, { id: 'nordicas-01-c', tipo: 'episodio' }, { id: 'short-griegas-quien-zeus', tipo: 'short' }, { id: 'short-griegas-quien-hera', tipo: 'short' }];
  const r = resumenCola({ cola, tiene, listo: (id) => id !== 'short-griegas-quien-hera', n: 2 });
  assert.deepEqual(r.proximos.map((e) => e.id), ['griegas-01-a', 'nordicas-01-c']);
  assert.equal(r.quienListos, 1);
  assert.equal(r.quienPendientes, 1);
});

test('tablas de estado y métricas, con datos y sin datos', () => {
  const e = tablaEstado({ publicar: false, ultimaCorrida: null, proximos: [], quienListos: 3, quienPendientes: 2 });
  assert.match(e, /desactivado/); assert.match(e, /nada pendiente/); assert.match(e, /3 \(2 sin publicar/);
  assert.match(tablaMetricas({ yt: { suscriptores: '10', vistas: '2000', videos: '5' }, ig: null }), /10 suscriptores/);
  assert.match(tablaMetricas({ yt: null, ig: null }), /TikTok \| sin API/);
  assert.match(armarStatus({ fecha: 'x', publicar: true, proximos: [], quienListos: 0, quienPendientes: 0, mitologias: 'TABLA', yt: null, ig: null }), /## Temporadas\nTABLA/);
});
