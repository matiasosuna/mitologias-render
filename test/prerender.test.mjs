import { test } from 'node:test';
import assert from 'node:assert/strict';
import { faltantes, motorElegido, lotes, costoTotal } from '../scripts/prerender.mjs';

const m = (...ids) => new Map(ids.map((i) => [i, 0]));
const cola = ['a', 'b', 'c', 'd'].map((x) => ({ id: `griegas-0${x}`, tipo: 'episodio' })).concat([{ id: 'short-griegas-quien-z', tipo: 'short' }]);
const nada = { youtube: m(), instagram: m(), tiktok: m() };
const base = { cola, tiene: nada, listo: () => true, hayAsset: () => false };

test('faltantes: salta publicados en las tres, no listos y lo que ya está en el release', () => {
  const tiene = { youtube: m('griegas-0a'), instagram: m('griegas-0a'), tiktok: m('griegas-0a') };
  const r = faltantes({ ...base, tiene, listo: (id) => id !== 'griegas-0b', n: 4, hayAsset: (id, c) => id === 'griegas-0c' && c === 'horizontal' });
  assert.deepEqual(r, [{ id: 'griegas-0c', tipo: 'vertical' }, { id: 'griegas-0c', tipo: 'partes' }, { id: 'griegas-0d', tipo: 'horizontal' }, { id: 'griegas-0d', tipo: 'vertical' }]);
});
test('faltantes: un artefacto vigente cuenta como hecho; el short pide solo "short"', () => {
  const r = faltantes({ ...base, cola: [cola[0], cola[4]], n: 9, hayArtefacto: (id, t) => t === 'vertical' || t === 'partes' });
  assert.deepEqual(r, [{ id: 'griegas-0a', tipo: 'horizontal' }, { id: 'short-griegas-quien-z', tipo: 'short' }]);
});
test('faltantes: omite personajes viejos y los lista; forzar los incluye siempre', () => {
  const omitidos = [];
  const r = faltantes({ ...base, n: 9, omitidos, legacy: (id) => (id === 'griegas-0a' ? ['zeus'] : []), forzar: ['griegas-0d'], hayAsset: (id) => id === 'griegas-0d' });
  assert.deepEqual(omitidos, [{ id: 'griegas-0a', viejos: ['zeus'] }]);
  assert.deepEqual(r.slice(0, 3).map((x) => x.tipo), ['horizontal', 'vertical', 'partes']); // forzado, aunque el release lo tenga
  assert.equal(r[0].id, 'griegas-0d');
  assert.ok(!r.some((x, i) => i >= 3 && x.id === 'griegas-0d') && !r.some((x) => x.id === 'griegas-0a'));
});
test('faltantes: respeta presupuesto en USD y máximo de episodios', () => {
  const r = faltantes({ ...base, n: 99, presupuesto: 0.53, maxEpisodios: 8 });
  assert.ok(costoTotal(r) <= 0.53);
  assert.deepEqual(r.map((x) => x.tipo), ['horizontal', 'vertical', 'partes', 'short']); // 0,25+0,10+0,17 = 0,52 → nada más entra; el short cuesta 0
  assert.equal(new Set(faltantes({ ...base, n: 99, maxEpisodios: 2 }).map((x) => x.id)).size, 2);
});
test('motor: Modal por defecto para episodios; github solo si se pide, no hay claves o el tipo no está en Modal', () => {
  assert.equal(motorElegido('auto'), 'modal'); assert.equal(motorElegido('github'), 'github');
  const items = [{ id: 'a', tipo: 'horizontal' }, { id: 'b', tipo: 'vertical' }, { id: 'c', tipo: 'partes' }, { id: 'd', tipo: 'short' }];
  assert.deepEqual(lotes(items, 'modal', true).map((l) => [l.tipo, l.motor]), [['horizontal', 'modal'], ['vertical', 'modal'], ['partes', 'modal'], ['short', 'github']]);
  assert.ok(lotes(items, 'modal', false).every((l) => l.motor === 'github')); // sin claves de Modal: respaldo en GitHub
  assert.ok(lotes(items, 'github', true).every((l) => l.motor === 'github'));
});
test('faltantes: permitir filtra por mitología', () => {
  const r = faltantes({ ...base, n: 99, permitir: (id) => id === 'griegas-0c' });
  assert.deepEqual([...new Set(r.map((x) => x.id))], ['griegas-0c']);
});
test('faltantes: no renderiza el formato de una red donde ya está publicado', () => {
  const tiene = { youtube: m('griegas-0a'), instagram: m(), tiktok: m('griegas-0a') };
  const r = faltantes({ ...base, cola: [cola[0]], tiene, n: 9 });
  assert.deepEqual(r, [{ id: 'griegas-0a', tipo: 'partes' }]);
});

import { iniciosTurno, slotsProximos, faltantesVentana, repartir } from '../scripts/prerender.mjs';
const T0 = Date.UTC(2026, 9, 17, 22, 30); // 22:30 UTC → el próximo turno es 02:00 UTC
test('iniciosTurno: cada 4 h desde el próximo turno', () => {
  assert.deepEqual(iniciosTurno(T0, 3).map((t) => new Date(t).toISOString().slice(11, 16)), ['02:00', '06:00', '10:00']);
  assert.equal(new Date(iniciosTurno(Date.UTC(2026, 9, 17, 6, 0), 1)[0]).getUTCHours(), 6);
});
test('slotsProximos: lo que publicaría cada red en los próximos turnos, sin repetir', () => {
  const eps = ['a', 'b', 'c', 'd', 'e', 'f'].map((x) => ({ id: `griegas-0${x}`, tipo: 'episodio' }));
  const tiene = { youtube: m('griegas-0a', 'griegas-0b', 'griegas-0c'), instagram: m('griegas-0a'), tiktok: m('griegas-0a') };
  const sl = slotsProximos({ cola: eps, tiene, listo: () => true, ahora: T0, turnos: 6 });
  const ig = sl.filter((s) => s.plataforma === 'instagram').map((s) => s.id);
  assert.equal(new Set(ig).size, ig.length);
  assert.ok(ig.includes('griegas-0b') && !ig.includes('griegas-0a'));
  assert.ok(sl.every((s) => s.en >= T0));
});
test('faltantesVentana: formato por red, lo urgente (< 6 h) y los filtros', () => {
  const slots = [{ id: 'griegas-0a', plataforma: 'instagram', en: T0 + 36e5 }, { id: 'griegas-0a', plataforma: 'tiktok', en: T0 + 20 * 36e5 }, { id: 'griegas-0b', plataforma: 'youtube', en: T0 + 8 * 36e5 }, { id: 'nordicas-0x', plataforma: 'youtube', en: T0 }];
  const omitidos = [];
  const r = faltantesVentana({ slots, ahora: T0, hayAsset: (id, c) => id === 'griegas-0b' && c === 'horizontal', permitir: (id) => id !== 'nordicas-0x', omitidos });
  assert.deepEqual(r.map((x) => [x.id, x.tipo, x.urgente]), [['griegas-0a', 'partes', true], ['griegas-0a', 'vertical', false]]);
  const v = faltantesVentana({ slots, ahora: T0, hayAsset: () => false, legacy: (id) => (id === 'griegas-0a' ? ['zeus'] : []), omitidos });
  assert.deepEqual(omitidos.map((o) => o.id), ['griegas-0a']);
  assert.ok(v.every((x) => x.id !== 'griegas-0a'));
});
test('repartir: GitHub salvo lo urgente o si GitHub viene fallando', () => {
  const it = [{ id: 'a', tipo: 'partes', urgente: true }, { id: 'b', tipo: 'vertical', urgente: false }, { id: 'c', tipo: 'short', urgente: true }];
  assert.deepEqual(repartir(it, { modalOk: true }).map((l) => `${l.tipo}/${l.motor}`), ['partes/modal', 'vertical/github', 'short/github']);
  assert.ok(repartir(it, { modalOk: true, githubFalla: true }).filter((l) => l.tipo !== 'short').every((l) => l.motor === 'modal'));
  assert.ok(repartir(it, { modalOk: false }).every((l) => l.motor === 'github'));
});

import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
test('subir se niega a subir el render de un guion con claves viejas', () => {
  const id = 'griegas-96-prueba-guarda', dir = `src/videos/${id}`;
  mkdirSync(dir, { recursive: true });
  try {
    writeFileSync(`${dir}/guion.json`, JSON.stringify({ id, serie: 'griegas', escenas: [{ id: 'e', actores: [{ id: 'zeus', x: 1 }] }] }));
    const r = spawnSync('node', ['scripts/prerender.mjs', 'subir', `${id}:horizontal`], { encoding: 'utf8' });
    assert.equal(r.status, 1);
    assert.match(r.stdout, /no se sube \(horizontal\).*zeus/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
