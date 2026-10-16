import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hechoPorRegistro, inicioTurno, claveTurno, tocaEspecialYT, proximoEspecialYT, ESPECIALES, turnoUTC, horaHST, tipoIG, tocaShortYT, tocaEpisodioYT, episodiosPendientesYT, proximoEpisodioYT, ORDEN_EPISODIOS, STORIES, STORY_UTC, tocaStoryYT, proximaStoryYT, esStory, miniaturasPendientes, nombreAsset, rutaLocal, urlAsset, proximoShortYT, tituloShortYT, buscarTitulo } from '../scripts/nube.mjs';

const utc = (h, m = 0) => new Date(Date.UTC(2026, 9, 14, h, m));

test('turno: el último cron ya empezado (llegan tarde)', () => {
  assert.equal(turnoUTC(utc(2)), 2);
  assert.equal(turnoUTC(utc(2, 55)), 2);
  assert.equal(turnoUTC(utc(5, 59)), 2);
  assert.equal(turnoUTC(utc(22, 10)), 22);
  assert.equal(turnoUTC(utc(0, 30)), 22); // pasada la medianoche UTC sigue siendo el turno de las 22
  assert.equal(turnoUTC(utc(1, 59)), 22);
});

test('hora HST del turno (UTC−10)', () => {
  assert.deepEqual([2, 6, 10, 14, 18, 22].map(horaHST), [16, 20, 0, 4, 8, 12]);
});

const utcDia = (d, h, m = 0) => new Date(Date.UTC(2026, 9, d, h, m));

test('YouTube Shorts: 4 por día (2, 10, 14 y 22 UTC)', () => {
  assert.deepEqual([2, 6, 10, 14, 18, 22].filter((h) => tocaShortYT(utc(h, 20))), [2, 10, 14, 22]);
  assert.equal(tocaShortYT(utc(0, 30)), true); // el de las 22 que llegó tarde
});

test('YouTube episodio: 3 por día, turnos de las 18, 02 y 10 UTC (08, 16 y 00 HST)', () => {
  assert.deepEqual([2, 6, 10, 14, 18, 22].filter((h) => tocaEpisodioYT(utc(h, 5))), [2, 10, 18]);
  assert.equal(tocaEpisodioYT(utc(21, 59)), true);
});

test('Instagram: 3 por día (00, 08, 16 HST) y nada en los otros turnos', () => {
  for (const h of [6, 14, 22]) assert.equal(tipoIG(utc(h, 10)), null);
  for (const h of [10, 18, 2]) assert.notEqual(tipoIG(utc(h, 10)), null);
});

test('Instagram: alterna episodio y Short sin cortar entre días (mitad y mitad)', () => {
  // turnos IG en orden: 00 HST = 10 UTC, 08 HST = 18 UTC, 16 HST = 02 UTC del día siguiente
  const seq = [];
  for (let d = 13; d < 19; d++) seq.push(tipoIG(utcDia(d, 10, 3)), tipoIG(utcDia(d, 18, 3)), tipoIG(utcDia(d + 1, 2, 3)));
  for (let i = 1; i < seq.length; i++) assert.notEqual(seq[i], seq[i - 1], `turno ${i}`);
  assert.equal(seq.filter((x) => x === 'ep').length, seq.length / 2);
  // un cron atrasado da el mismo tipo que a tiempo
  assert.equal(tipoIG(utcDia(14, 3, 50)), tipoIG(utcDia(14, 2, 0)));
  assert.equal(tipoIG(utcDia(13, 11, 59)), tipoIG(utcDia(13, 10, 0)));
});

test('nombres de assets del release', () => {
  assert.equal(nombreAsset('short-x', 'short'), 'short-x.mp4');
  assert.equal(nombreAsset('griegas-01-a', 'parte', 2), 'griegas-01-a.parte-2.mp4');
  assert.equal(nombreAsset('griegas-01-a', 'partes'), 'griegas-01-a.partes.json');
  assert.equal(nombreAsset('short-x', 'tiktok'), 'short-x.tiktok.mp4');
  assert.equal(nombreAsset('short-x', 'portada-short'), 'short-x.portada-short.jpg');
  assert.equal(nombreAsset('griegas-01-a', 'portada-ig'), 'griegas-01-a.portada-ig.jpg');
  assert.equal(nombreAsset('griegas-01-a', 'tapa-ig'), 'griegas-01-a.tapa-ig.jpg');
  assert.throws(() => nombreAsset('x', 'otra'));
});

test('rutas locales: las mismas que usan los scripts en la Mac', () => {
  assert.equal(rutaLocal('short-x', 'short'), 'out/short-x/short-x.mp4');
  assert.equal(rutaLocal('g-01-a', 'parte', 3), 'out/g-01-a/g-01-a.parte-3.mp4');
  assert.equal(rutaLocal('g-01-a', 'partes'), 'out/g-01-a/partes.json');
  assert.equal(rutaLocal('short-x', 'tiktok'), 'out/short-x/short-x.tiktok.mp4');
  assert.equal(rutaLocal('short-x', 'portada-short'), 'out/short-x/portada-short.jpg');
  assert.equal(rutaLocal('g-01-a', 'portada-ig'), 'out/g-01-a/portada-ig.jpg');
});

test('URL pública del release', () => {
  assert.equal(urlAsset('short-x.mp4'), 'https://github.com/matiasosuna/mitologias-render/releases/download/media/short-x.mp4');
});

test('YouTube: próximo Short en orden estricto, sin repetir', () => {
  const orden = ['a', 'b', 'c'];
  assert.deepEqual(proximoShortYT(orden, [], {}), { id: 'a' });
  assert.deepEqual(proximoShortYT(orden, [{ id: 'a', short: 'nativo' }], {}), { id: 'b' });
  // un registro de otro tipo (episodio, short de episodio) no cuenta
  assert.deepEqual(proximoShortYT(orden, [{ id: 'a', short: null }, { id: 'a', short: '2' }], {}), { id: 'a' });
  assert.deepEqual(proximoShortYT(orden, [{ id: 'b', short: 'nativo' }], {}), { id: 'a' });
  assert.equal(proximoShortYT(orden, orden.map((id) => ({ id, short: 'nativo' })), {}), null);
});

test('YouTube: el de Māui espera al episodio hawaiano 11 (y no se saltea)', () => {
  const orden = ['short-hawaianas-maui-sol', 'z'];
  assert.equal(proximoShortYT(orden, [], {}).espera.length > 0, true);
  assert.equal(proximoShortYT(orden, [], {}).id, 'short-hawaianas-maui-sol');
  assert.deepEqual(proximoShortYT(orden, [], { 'hawaianas-11-el-sol-que-corria': 'abc' }), { id: 'short-hawaianas-maui-sol' });
});

test('YouTube: control de duplicados por título', () => {
  assert.equal(tituloShortYT({ gancho: { en: 'Zeus ate his wife.' } }), 'Zeus ate his wife. #Shorts');
  const listado = 'canal: Myths on Clay\nAAA\tpublic\tOther #Shorts\nBBB\tpublic\tZeus ate his wife. #Shorts\nCCC\tprivate\tWith\ttab';
  assert.equal(buscarTitulo(listado, 'Zeus ate his wife. #Shorts'), 'BBB');
  assert.equal(buscarTitulo(listado, 'With\ttab'), 'CCC');
  assert.equal(buscarTitulo(listado, 'Nope #Shorts'), null);
  assert.equal(buscarTitulo('', 'x'), null);
});

test('episodios largos: T1 en orden de series y de episodio, sin los subidos ni T2', () => {
  const t = {
    'norteamericanas-02-b': { temporada: 1, episodio: 2 }, 'norteamericanas-01-a': { temporada: 1, episodio: 1 },
    'hawaianas-13-x': { temporada: 2, episodio: 1 }, 'hawaianas-05-c': { temporada: 1, episodio: 5 }, 'hawaianas-12-d': { temporada: 1, episodio: 12 },
    'balinesas-01-e': { temporada: 1, episodio: 1 }, 'aztecas-01-f': { temporada: 1, episodio: 1 }, 'griegas-01-g': { temporada: 1, episodio: 1 },
    'griegas-99-esp': { titulo: 'x | Special' },
  };
  assert.deepEqual(episodiosPendientesYT(t, {}), ['hawaianas-05-c', 'hawaianas-12-d', 'norteamericanas-01-a', 'norteamericanas-02-b', 'aztecas-01-f', 'balinesas-01-e']);
  assert.equal(proximoEpisodioYT(t, { 'hawaianas-05-c': 'v', 'hawaianas-12-d': 'v' }), 'norteamericanas-01-a');
  assert.equal(proximoEpisodioYT(t, {}, (id) => id !== 'hawaianas-05-c'), 'hawaianas-12-d');
  assert.equal(proximoEpisodioYT({ 'hawaianas-13-x': { temporada: 2, episodio: 1 } }, {}), null);
});

test('episodios: hindúes y maoríes antes que balinesas', () => {
  const t = { 'balinesas-01-a': { temporada: 1, episodio: 1 }, 'maories-01-b': { temporada: 1, episodio: 1 }, 'hindues-01-c': { temporada: 1, episodio: 1 } };
  assert.deepEqual(episodiosPendientesYT(t, {}), ['hindues-01-c', 'maories-01-b', 'balinesas-01-a']);
});

test('miniaturas pendientes: registro solo-agregar', () => {
  const reg = [{ id: 'a', video: 'A', estado: 'pendiente' }, { id: 'b', video: 'B', estado: 'pendiente' }, { id: 'a', video: 'A', estado: 'ok' }, { id: 'b', video: 'B', estado: 'pendiente' }];
  assert.deepEqual(miniaturasPendientes(reg).map((r) => r.id), ['b']);
  assert.deepEqual(miniaturasPendientes([]), []);
});

test('assets del episodio largo', () => {
  assert.equal(nombreAsset('h-05-c', 'horizontal'), 'h-05-c.horizontal.mp4');
  assert.equal(rutaLocal('h-05-c', 'horizontal'), 'out/h-05-c/h-05-c.en.mp4');
  assert.equal(nombreAsset('h-05-c', 'srt-es'), 'h-05-c.es.srt');
  assert.equal(rutaLocal('h-05-c', 'srt-en'), 'out/h-05-c/h-05-c.en.srt');
  assert.equal(nombreAsset('h-05-c', 'miniatura'), 'h-05-c.miniatura.jpg');
  assert.equal(rutaLocal('h-05-c', 'miniatura'), 'out/h-05-c/miniatura.jpg');
});

test('turno: clave única por turno y paso (el cron de respaldo de :17 cae en el mismo turno)', () => {
  assert.equal(claveTurno(utcDia(14, 18, 0), 'episodio'), '2026-10-14T18Z|episodio');
  assert.equal(claveTurno(utcDia(14, 18, 17), 'episodio'), claveTurno(utcDia(14, 18, 0), 'episodio'));
  assert.equal(claveTurno(utcDia(15, 0, 40), 'shorts'), '2026-10-14T22Z|shorts'); // pasada la medianoche UTC
  assert.notEqual(claveTurno(utcDia(14, 22, 0), 'shorts'), claveTurno(utcDia(15, 2, 0), 'shorts'));
  assert.notEqual(claveTurno(utcDia(14, 22, 0), 'shorts'), claveTurno(utcDia(14, 22, 0), 'especial'));
});

test('especiales: 1 por noche, a las 22 UTC', () => {
  assert.deepEqual([2, 6, 10, 14, 18, 22].filter((h) => tocaEspecialYT(utc(h, 17))), [22]);
});

test('especiales: el próximo que no está en youtube-ids, en orden', () => {
  const ids = { 'griegas-99-reino-de-hades': 'a', 'nordicas-99-hel': 'b' };
  assert.equal(proximoEspecialYT(ids).id, 'egipcias-99-anubis-y-la-duat');
  assert.equal(proximoEspecialYT({ ...ids, 'egipcias-99-anubis-y-la-duat': 'c' }).id, 'hawaianas-99-milu');
  assert.equal(proximoEspecialYT(Object.fromEntries(ESPECIALES.map((e) => [e.id, 'x']))), null);
  assert.deepEqual(ESPECIALES.slice(2).map((e) => [e.fecha, e.lista]), [
    ['2026-10-28T10:00:00', 'Lords of the Dead'], ['2026-10-31T10:00:00', 'Lords of the Dead'],
    ['2026-11-03T10:00:00', 'The Odyssey'], ['2026-11-07T10:00:00', 'The Odyssey']]);
});

test('especiales: cada uno tiene guion, título y lista', async () => {
  const { readFileSync, existsSync } = await import('node:fs');
  const raiz = new URL('../', import.meta.url).pathname;
  const titulos = JSON.parse(readFileSync(raiz + 'src/videos/titulos.json', 'utf8')), listas = JSON.parse(readFileSync(raiz + 'src/videos/listas.json', 'utf8'));
  for (const e of ESPECIALES) {
    assert.ok(existsSync(`${raiz}src/videos/${e.id}/guion.json`), e.id);
    assert.ok(titulos[e.id]?.titulo, e.id);
    assert.ok(listas[e.lista], e.lista);
  }
});

test('turno ya hecho según los registros (corrida manual o anterior a turnos.json)', () => {
  const desde = inicioTurno(utcDia(13, 22, 52));
  assert.equal(desde, Date.parse('2026-10-13T22:00:00Z'));
  const api = [{ id: 's', short: 'nativo', fecha: '2026-10-13T22:58:00Z' }, { id: 'e', short: null, cuando: 'ya', fecha: '2026-10-13T18:30:00Z' }, { id: 'x', short: null, cuando: '2026-10-28T10:00:00', fecha: '2026-10-13T21:00:00Z' }];
  assert.equal(hechoPorRegistro('shorts', desde, { api }), true);
  assert.equal(hechoPorRegistro('episodio', desde, { api }), false); // fue en el turno anterior
  assert.equal(hechoPorRegistro('especial', desde, { api }), false);
  assert.equal(hechoPorRegistro('especial', Date.parse('2026-10-13T18:00:00Z'), { api }), true);
  assert.equal(hechoPorRegistro('episodio', Date.parse('2026-10-13T18:00:00Z'), { api }), true);
  assert.equal(hechoPorRegistro('instagram', desde, { instagram: [{ fecha: '2026-10-13T22:10:00Z' }] }), true);
  assert.equal(hechoPorRegistro('instagram', desde, { instagram: [{ fecha: '2026-10-13T21:59:00Z' }, {}] }), false);
  assert.equal(hechoPorRegistro('otro', desde, { api }), false);
});

test('episodios: primero lo que falta de griegas T2, después T1 como antes', () => {
  const t = {
    'hawaianas-05-c': { temporada: 1, episodio: 5 }, 'griegas-13-b': { temporada: 2, episodio: 6 }, 'griegas-12-a': { temporada: 2, episodio: 5 },
    'griegas-11-z': { temporada: 2, episodio: 4 }, 'griegas-07-t1': { temporada: 1, episodio: 7 }, 'nordicas-16-x': { temporada: 2, episodio: 1 },
    'griegas-80-story': { titulo: 'x | Greek Myth Stories Special', temporada: 0, episodio: 1, especial: 'Greek Myth Stories' },
  };
  const ids = { 'griegas-11-z': 'v' };
  assert.deepEqual(episodiosPendientesYT(t, ids), ['griegas-12-a', 'griegas-13-b', 'hawaianas-05-c']);
  assert.equal(proximoEpisodioYT(t, ids), 'griegas-12-a');
  assert.equal(proximoEpisodioYT(t, { ...ids, 'griegas-12-a': 'v', 'griegas-13-b': 'v' }), 'hawaianas-05-c'); // terminada T2, sigue el orden de antes
  assert.equal(proximoEpisodioYT(t, ids, (id) => id !== 'griegas-12-a'), 'griegas-13-b');
  assert.deepEqual(ORDEN_EPISODIOS[0], ['griegas', 2]);
});

test('episodios con los datos reales: los 6 que faltan de griegas T2 van primero, en orden', async () => {
  const { readFileSync } = await import('node:fs');
  const raiz = new URL('../', import.meta.url).pathname;
  const titulos = JSON.parse(readFileSync(raiz + 'src/videos/titulos.json', 'utf8'));
  const subidos = Object.fromEntries(Object.keys(titulos).filter((id) => /^griegas-(0\d|1[01])-/.test(id)).map((id) => [id, 'v']));
  const pend = episodiosPendientesYT(titulos, subidos);
  assert.deepEqual(pend.slice(0, 6).map((id) => titulos[id].episodio), [5, 6, 7, 8, 9, 10]);
  assert.ok(pend.slice(0, 6).every((id) => id.startsWith('griegas-') && titulos[id].temporada === 2));
  assert.ok(!pend.slice(6).some((id) => id.startsWith('griegas-')));
});

test('Stories griegas: 1 por día en su turno (14 UTC), distinto del episodio y del especial', () => {
  assert.equal(STORY_UTC, 14);
  assert.deepEqual([2, 6, 10, 14, 18, 22].filter((h) => tocaStoryYT(utc(h, 20))), [14]);
  for (const h of [2, 6, 10, 14, 18, 22]) assert.ok(!(tocaStoryYT(utc(h)) && (tocaEpisodioYT(utc(h)) || tocaEspecialYT(utc(h)))), `turno ${h}`);
});

test('Stories griegas: griegas-80…89 a "Greek Myth Stories", la primera lista que falta, sin frenar por las que no están', () => {
  assert.equal(STORIES.lista, 'Greek Myth Stories');
  assert.deepEqual(STORIES.ids.map((id) => Number(id.split('-')[1])), [80, 81, 82, 83, 84, 85, 86, 87, 88, 89]);
  assert.ok(STORIES.ids.every((id) => id.startsWith('griegas-')));
  const [a, b, c] = STORIES.ids;
  assert.equal(proximaStoryYT({}, () => false), null); // ninguna carpeta todavía
  assert.equal(proximaStoryYT({}), a);
  assert.equal(proximaStoryYT({ [a]: 'v' }), b);
  assert.equal(proximaStoryYT({}, (id) => id !== a), b); // la 80 sin terminar no frena a la 81
  assert.equal(proximaStoryYT({ [b]: 'v' }, (id) => id !== a), c);
  assert.equal(proximaStoryYT(Object.fromEntries(STORIES.ids.map((id) => [id, 'v']))), null);
  assert.ok(esStory(a) && !esStory('griegas-12-red-de-hefesto'));
});

test('Stories griegas: la lista está en listas.json y los títulos (si ya existen) dicen "Greek Myth Stories Special"', async () => {
  const { readFileSync } = await import('node:fs');
  const raiz = new URL('../', import.meta.url).pathname;
  const listas = JSON.parse(readFileSync(raiz + 'src/videos/listas.json', 'utf8')), titulos = JSON.parse(readFileSync(raiz + 'src/videos/titulos.json', 'utf8'));
  assert.ok(listas[STORIES.lista]);
  assert.ok(listas['Greek Mythology · Season 2: The Olympians']);
  for (const id of STORIES.ids) if (titulos[id]) assert.match(titulos[id].titulo, / \| Greek Myth Stories Special$/, id);
});

test('turno ya hecho: una Story no cuenta como episodio ni al revés', () => {
  const desde = Date.parse('2026-10-16T14:00:00Z');
  const story = [{ id: STORIES.ids[0], short: null, cuando: 'ya', fecha: '2026-10-16T14:30:00Z' }];
  const ep = [{ id: 'griegas-12-red-de-hefesto', short: null, cuando: 'ya', fecha: '2026-10-16T14:30:00Z' }];
  assert.equal(hechoPorRegistro('story', desde, { api: story }), true);
  assert.equal(hechoPorRegistro('episodio', desde, { api: story }), false);
  assert.equal(hechoPorRegistro('story', desde, { api: ep }), false);
  assert.equal(hechoPorRegistro('episodio', desde, { api: ep }), true);
});
