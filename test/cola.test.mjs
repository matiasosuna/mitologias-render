// Cola única de YouTube, Instagram y TikTok (scripts/cola.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  construirCola, actualizarCola, entrada, esQuien, clase, horaHST, HORAS_UTC, tieneYouTube, tieneInstagram, tieneTiktok, partesHechasIG,
  partesEstimadas, planTurno, estadoCola, limitar, usadas24h, MAX_ALCANZAR, TOPE_24H, FORMATOS, STORIES_GRIEGAS,
} from '../scripts/cola.mjs';

const raiz = new URL('../', import.meta.url).pathname;
const J = (f) => JSON.parse(readFileSync(raiz + f, 'utf8'));

// ── lista
const T = {
  'griegas-01-a': { titulo: 'A | Greek Mythology S1E1', temporada: 1, episodio: 1 },
  'griegas-02-b': { titulo: 'B | Greek Mythology S1E2', temporada: 1, episodio: 2 },
  'griegas-08-c': { titulo: 'C | Greek Mythology S2E1', temporada: 2, episodio: 1 },
  'griegas-09-d': { titulo: 'D | Greek Mythology S2E2', temporada: 2, episodio: 2 },
  'nordicas-01-e': { titulo: 'E | Norse Mythology S1E1', temporada: 1, episodio: 1 },
  'egipcias-01-f': { titulo: 'F | Egyptian Mythology S1E1', temporada: 1, episodio: 1 },
  'griegas-99-hades': { titulo: 'H | Lords of the Dead Special', temporada: 0, episodio: 3, especial: 'Lords of the Dead' },
  'nordicas-99-hel': { titulo: 'Hel | Lords of the Dead Special', temporada: 0, episodio: 1, especial: 'Lords of the Dead' },
  'griegas-97-odisea-1': { titulo: 'O1 | The Odyssey Special · Part 1', temporada: 0, episodio: 1, especial: 'The Odyssey', parte: 1 },
  'hawaianas-01-g': { titulo: 'G | Hawaiian Mythology S1E1', temporada: 1, episodio: 1 },
  'hawaianas-02-h': { titulo: 'H2 | Hawaiian Mythology S1E2', temporada: 1, episodio: 2 },
  'aztecas-01-i': { titulo: 'I | Aztec Mythology S1E1', temporada: 1, episodio: 1 },
  'nordicas-16-x': { titulo: 'X | Norse Mythology S2E3', temporada: 2, episodio: 3 },
};
// subidas a YouTube en este orden (como youtube-ids.json): mezcladas, con Shorts viejos
const YT = { 'griegas-01-a': 'v', 'nordicas-01-e': 'v', 'griegas-08-c': 'v', 'short-griegas-viejo': 'v', 'egipcias-01-f': 'v', 'griegas-02-b': 'v', 'nordicas-99-hel': 'v', 'griegas-99-hades': 'v', 'hawaianas-01-g': 'v' };

test('lista: lo publicado en el orden de YouTube por grupos (T1 griega, nórdica, egipcia, especiales, hawaiana, T2 griega)', () => {
  const ids = construirCola({ titulos: T, ytIds: YT, stories: [] }).map((e) => e.id);
  assert.deepEqual(ids.slice(0, 7), ['griegas-01-a', 'griegas-02-b', 'nordicas-01-e', 'egipcias-01-f', 'nordicas-99-hel', 'griegas-99-hades', 'hawaianas-01-g']);
  assert.equal(ids[7], 'griegas-08-c');
});

test('lista: después lo que falta, griego primero (T2, Odisea, Stories), luego el resto de las T1; sin T2 pausadas', () => {
  const ids = construirCola({ titulos: T, ytIds: YT, stories: ['griegas-80-s'] }).map((e) => e.id);
  assert.deepEqual(ids.slice(8), ['griegas-09-d', 'griegas-97-odisea-1', 'griegas-80-s', 'hawaianas-02-h', 'aztecas-01-i']);
  assert.ok(!ids.includes('nordicas-16-x'));
});

test('lista: un "Who is…?" detrás de cada episodio que falta; mini historias viejas afuera', () => {
  const quien = ['short-griegas-quien-zeus', 'short-griegas-nadie', 'short-griegas-dioses-60s', 'short-griegas-quien-hermes'];
  const cola = construirCola({ titulos: T, ytIds: YT, quien, stories: [] });
  const ids = cola.map((e) => e.id);
  assert.ok(!ids.includes('short-griegas-nadie') && !ids.includes('short-griegas-viejo'));
  assert.deepEqual(ids.slice(8, 14), ['griegas-09-d', 'short-griegas-quien-zeus', 'griegas-97-odisea-1', 'short-griegas-dioses-60s', 'hawaianas-02-h', 'short-griegas-quien-hermes']);
  assert.ok(esQuien('short-griegas-quien-zeus') && esQuien('short-griegas-dioses-60s') && !esQuien('short-griegas-cerbero'));
});

test('lista: sobran "Who is…?" → van al final; formato por plataforma', () => {
  const cola = construirCola({ titulos: { 'griegas-01-a': T['griegas-01-a'] }, ytIds: { 'griegas-01-a': 'v' }, quien: ['short-griegas-quien-a', 'short-griegas-quien-b'], stories: [] });
  assert.deepEqual(cola.map((e) => e.id), ['griegas-01-a', 'short-griegas-quien-a', 'short-griegas-quien-b']);
  assert.deepEqual(cola[0].formato, { youtube: 'horizontal', instagram: 'partes', tiktok: 'vertical' });
  assert.deepEqual(cola[1].formato, { youtube: 'short', instagram: 'short', tiktok: 'short' });
  assert.deepEqual(entrada('short-x-quien-y').formato, FORMATOS.short);
});

test('lista guardada: no se reordena; lo nuevo va al final', () => {
  const g = ['a', 'b', 'c'].map((id) => ({ id, tipo: 'episodio' }));
  const n = ['c', 'x', 'a', 'y'].map((id) => ({ id, tipo: 'episodio' }));
  assert.deepEqual(actualizarCola(g, n).map((e) => e.id), ['a', 'b', 'c', 'x', 'y']);
  assert.deepEqual(actualizarCola(null, n), n);
});

test('lista con los datos reales: empieza por la T1 griega y trae la T2 griega 10 y los "Who is…?"', () => {
  const titulos = J('src/videos/titulos.json');
  const ytIds = Object.fromEntries(Object.keys(titulos).filter((id) => /^(griegas-(0\d|1[0-6])|nordicas-(0\d|1[0-5])|egipcias-(0\d|1[0-3])|hawaianas-0[1-5])-|-99-/.test(id)).map((id) => [id, 'v']));
  const cola = construirCola({ titulos, ytIds, quien: ['short-griegas-quien-zeus'] });
  assert.equal(cola[0].id, 'griegas-01-origen');
  const i = cola.findIndex((e) => e.id === 'griegas-17-dioniso-piratas');
  assert.equal(cola[i + 1].id, 'short-griegas-quien-zeus');
  assert.ok(cola.slice(0, i).every((e) => ytIds[e.id]));
  assert.ok(STORIES_GRIEGAS.every((id) => cola.some((e) => e.id === id)));
});

// ── turnos
test('turnos: 08 HST episodio, 12 y 20 HST "Who is…?", el resto solo para alcanzar', () => {
  assert.deepEqual(HORAS_UTC.map(horaHST), [16, 20, 0, 4, 8, 12]);
  assert.deepEqual(Object.fromEntries(HORAS_UTC.map((h) => [horaHST(h), clase(h)])), { 16: 'alcanzar', 20: 'quien', 0: 'alcanzar', 4: 'alcanzar', 8: 'episodio', 12: 'quien' });
});

// ── qué tiene cada plataforma
test('YouTube: lo de youtube-ids, con la fecha de subida del registro', () => {
  const m = tieneYouTube({ a: 'v', b: 'w' }, [{ id: 'b', fecha: '2026-10-17T10:00:00Z' }, { id: 'c', video: 'z', fecha: '2026-10-17T11:00:00Z' }]);
  assert.deepEqual([...m.keys()].sort(), ['a', 'b', 'c']);
  assert.equal(m.get('a'), 0);
  assert.equal(m.get('b'), Date.parse('2026-10-17T10:00:00Z'));
});

test('Instagram: episodio = todas sus partes (o Reel entero/apaisado de antes); Short por archivo', () => {
  const h = [
    { tipo: 'reel-apaisado-a-archivar', id: 'g1', fecha: '2026-10-10T00:00:00Z' },
    { tipo: 'reel-parte', id: 'n8', parte: 1, de: 2, fecha: '2026-10-11T00:00:00Z' }, { tipo: 'reel-parte', id: 'n8', parte: 2, de: 2, fecha: '2026-10-12T00:00:00Z' },
    { tipo: 'reel-parte', id: 'n9', parte: 1, de: 2, fecha: '2026-10-12T00:00:00Z' },
    { id: null, archivo: 'out/short-x/short-x.mp4', fecha: '2026-10-13T00:00:00Z' }, { tipo: 'episodio-borrado', id: 'g2', archivo: 'out/.instagram/g2/parte-1.mp4' },
  ];
  const m = tieneInstagram(h);
  assert.deepEqual([...m.keys()].sort(), ['g1', 'n8', 'short-x']);
  assert.equal(m.get('n8'), Date.parse('2026-10-12T00:00:00Z')); // cuando salió la última parte
  assert.deepEqual([...partesHechasIG(h, 'n9')], [1]);
});

test('TikTok: lo anotado en subidas-buffer (fecha o dueAt)', () => {
  const m = tieneTiktok([{ id: 'short-a', dueAt: '2026-10-12T14:00:00Z' }, { id: 'g1', tipo: 'episodio', fecha: '2026-10-18T00:00:00Z' }]);
  assert.equal(m.get('short-a'), Date.parse('2026-10-12T14:00:00Z'));
  assert.ok(m.has('g1'));
});

test('partes estimadas: < 175 s de contenido por parte (como vertical-partes.mjs)', () => {
  assert.equal(partesEstimadas({ fps: 30, total: 30 * 170, outroFrames: 0 }), 1);
  assert.equal(partesEstimadas({ fps: 30, total: 30 * 300, outroFrames: 30 * 10 }), 2);
  assert.equal(partesEstimadas({ fps: 30, total: 30 * 530, outroFrames: 0 }), 4);
  assert.equal(partesEstimadas(null), 3); // sin datos: el peor caso
});

// ── plan del turno
const ep = (id) => ({ id, tipo: 'episodio' }), sh = (id) => ({ id, tipo: 'short' });
const COLA = [ep('e1'), ep('e2'), ep('e3'), ep('e4'), ep('e5'), ep('e6'), ep('e7'), sh('short-q1'), ep('e8'), sh('short-q2')];
const mapa = (ids, f = 0) => new Map(ids.map((id) => [id, f]));
const INICIO = Date.parse('2026-10-18T18:00:00Z');
const plan = (tiene, plataforma, c, extra = {}) => planTurno({ cola: COLA, tiene, plataforma, clase: c, inicio: INICIO, ...extra }).ids;

test('puntero por plataforma y la que va adelante', () => {
  const tiene = { youtube: mapa(['e1', 'e2', 'e3', 'e4', 'e5', 'e6']), instagram: mapa(['e1', 'e2']), tiktok: mapa([]) };
  const s = estadoCola({ cola: COLA, tiene, inicio: INICIO });
  assert.deepEqual(s.punteros, { youtube: 6, instagram: 2, tiktok: 0 });
  assert.equal(s.lider, 6);
  assert.equal(s.parejo, false);
  // un hueco cuenta: el puntero es el primero que falta
  assert.equal(estadoCola({ cola: COLA, tiene: { ...tiene, instagram: mapa(['e1', 'e3']) }, inicio: INICIO }).punteros.instagram, 1);
});

test('alcanzar: YouTube (adelante) NO publica episodios; IG y TikTok hasta 4 por turno, en orden, sin pasarse', () => {
  const tiene = { youtube: mapa(['e1', 'e2', 'e3', 'e4', 'e5', 'e6']), instagram: mapa(['e1', 'e2', 'e3']), tiktok: mapa([]) };
  for (const c of ['alcanzar', 'episodio']) {
    assert.deepEqual(plan(tiene, 'youtube', c), []);
    assert.deepEqual(plan(tiene, 'instagram', c), ['e4', 'e5', 'e6']); // le faltan 3: no se adelanta a YouTube
    assert.deepEqual(plan(tiene, 'tiktok', c), ['e1', 'e2', 'e3', 'e4']);
  }
  assert.deepEqual(plan(tiene, 'tiktok', 'alcanzar', { max: 2 }), ['e1', 'e2']); // TikTok frenado
  assert.equal(MAX_ALCANZAR.instagram, 4);
  assert.equal(MAX_ALCANZAR.tiktok, 4);
});

test('alcanzar: los "Who is…?" salen igual, a las tres juntas, antes que los episodios', () => {
  const tiene = { youtube: mapa(['e1', 'e2', 'e3', 'e4', 'e5', 'e6']), instagram: mapa(['e1']), tiktok: mapa([]) };
  assert.deepEqual(plan(tiene, 'youtube', 'quien'), ['short-q1']);
  assert.deepEqual(plan(tiene, 'instagram', 'quien'), ['short-q1', 'e2', 'e3', 'e4', 'e5']);
  assert.deepEqual(plan(tiene, 'tiktok', 'quien'), ['short-q1', 'e1', 'e2', 'e3', 'e4']);
});

test('parejo: 1 episodio el mismo a las tres en el turno de las 08; "Who is…?" a las 12 y 20; nada en los demás', () => {
  const todos = ['e1', 'e2', 'e3'];
  const tiene = { youtube: mapa(todos), instagram: mapa(todos), tiktok: mapa(todos) };
  for (const p of ['youtube', 'instagram', 'tiktok']) {
    assert.deepEqual(plan(tiene, p, 'episodio'), ['e4']);
    assert.deepEqual(plan(tiene, p, 'quien'), ['short-q1']);
    assert.deepEqual(plan(tiene, p, 'alcanzar'), []);
  }
});

test('parejo: por día 1 episodio + 2 "Who is…?" en las tres', () => {
  const tiene = { youtube: mapa([]), instagram: mapa([]), tiktok: mapa([]) };
  const dia = ['alcanzar', 'quien', 'alcanzar', 'alcanzar', 'episodio', 'quien']; // 16, 20, 00, 04, 08, 12 HST
  let t = INICIO;
  for (const c of dia) {
    const planes = Object.fromEntries(['youtube', 'instagram', 'tiktok'].map((p) => [p, planTurno({ cola: COLA, tiene, plataforma: p, clase: c, inicio: t }).ids]));
    for (const [p, ids] of Object.entries(planes)) for (const id of ids) tiene[p].set(id, t + 1);
    t += 4 * 3600e3;
  }
  for (const p of ['youtube', 'instagram', 'tiktok']) assert.deepEqual([...tiene[p].keys()], ['short-q1', 'e1', 'short-q2']);
});

test('el plan sale de lo que había al EMPEZAR el turno: el orden en que corren las plataformas no lo cambia', () => {
  const todos = ['e1', 'e2', 'e3'];
  const tiene = { youtube: mapa(todos), instagram: mapa(todos), tiktok: mapa(todos) };
  tiene.youtube.set('e4', INICIO + 60e3); // YouTube ya publicó el de este turno
  assert.deepEqual(plan(tiene, 'youtube', 'episodio'), []);
  assert.deepEqual(plan(tiene, 'instagram', 'episodio'), ['e4']); // no se cree atrasada ni publica de más
  tiene.instagram.set('e4', INICIO + 120e3);
  assert.deepEqual(plan(tiene, 'instagram', 'episodio'), []); // un 2.º intento del mismo turno no repite
});

test('lo que no está listo no frena: se salta', () => {
  const tiene = { youtube: mapa(['e1']), instagram: mapa(['e1']), tiktok: mapa(['e1']) };
  assert.deepEqual(planTurno({ cola: COLA, tiene, plataforma: 'tiktok', clase: 'episodio', inicio: INICIO, listo: (id) => id !== 'e2' }).ids, ['e3']);
  assert.deepEqual(planTurno({ cola: COLA, tiene, plataforma: 'tiktok', clase: 'quien', inicio: INICIO, listo: (id) => id !== 'short-q1' }).ids, ['short-q2']);
});

test('una plataforma que falló un turno queda atrás y alcanza; las demás esperan', () => {
  const tiene = { youtube: mapa(['e1', 'e2']), instagram: mapa(['e1', 'e2']), tiktok: mapa(['e1']) };
  assert.deepEqual(plan(tiene, 'youtube', 'episodio'), []);
  assert.deepEqual(plan(tiene, 'instagram', 'episodio'), []);
  assert.deepEqual(plan(tiene, 'tiktok', 'alcanzar'), ['e2']);
});

// ── topes
test('topes de 24 h: Instagram cuenta cada parte; si no entra, menos episodios en el turno', () => {
  const partes = { e1: 2, e2: 3, e3: 2 };
  assert.deepEqual(limitar(['e1', 'e2', 'e3'], (id) => partes[id], 84, TOPE_24H.instagram), ['e1', 'e2']);
  assert.deepEqual(limitar(['e1', 'e2', 'e3'], (id) => partes[id], 89, TOPE_24H.instagram), []);
  assert.deepEqual(limitar(['a', 'b'], () => 1, 8, TOPE_24H.youtube), ['a']);
  assert.equal(TOPE_24H.instagram, 90);
  assert.equal(TOPE_24H.youtube, 9);
});

test('publicaciones en las últimas 24 h', () => {
  const ahora = Date.parse('2026-10-18T12:00:00Z');
  const reg = [{ fecha: '2026-10-18T11:00:00Z' }, { fecha: '2026-10-17T11:00:00Z' }, { dueAt: '2026-10-18T02:00:00Z' }, { dueAt: '2026-10-19T02:00:00Z' }, {}];
  assert.equal(usadas24h(reg, ahora), 2);
});

test('datos reales: la cola guardada tiene sus carpetas (salvo Stories que todavía no se hicieron)', () => {
  if (!existsSync(raiz + 'out/cola-unificada.json')) return;
  for (const e of J('out/cola-unificada.json')) if (!STORIES_GRIEGAS.includes(e.id)) assert.ok(existsSync(`${raiz}src/videos/${e.id}/guion.json`), e.id);
});

test('datos reales: cada especial de la lista tiene su lista de YouTube (Odisea, Stories, Lords of the Dead)', () => {
  const titulos = J('src/videos/titulos.json'), listas = J('src/videos/listas.json');
  const cola = construirCola({ titulos, ytIds: {} });
  for (const e of cola) if (titulos[e.id]?.especial) assert.ok(listas[titulos[e.id].especial], e.id);
});
