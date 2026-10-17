import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inicioTurno, claveTurno, turnoUTC, horaHST, miniaturasPendientes, nombreAsset, rutaLocal, urlAsset, tituloShortYT, buscarTitulo, extraYT, partesVigentes, tiktokFrenado } from '../scripts/nube.mjs';

const utc = (h, m = 0) => new Date(Date.UTC(2026, 9, 14, h, m));
const utcDia = (d, h, m = 0) => new Date(Date.UTC(2026, 9, d, h, m));

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

test('YouTube: control de duplicados por título', () => {
  assert.equal(tituloShortYT({ gancho: { en: 'Zeus ate his wife.' } }), 'Zeus ate his wife. #Shorts');
  const listado = 'canal: Myths on Clay\nAAA\tpublic\tOther #Shorts\nBBB\tpublic\tZeus ate his wife. #Shorts\nCCC\tprivate\tWith\ttab';
  assert.equal(buscarTitulo(listado, 'Zeus ate his wife. #Shorts'), 'BBB');
  assert.equal(buscarTitulo(listado, 'With\ttab'), 'CCC');
  assert.equal(buscarTitulo(listado, 'Nope #Shorts'), null);
  assert.equal(buscarTitulo('', 'x'), null);
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

test('turno: clave única por turno y paso (la corrida de cada hora cae en el mismo turno)', () => {
  assert.equal(claveTurno(utcDia(14, 18, 0), 'youtube'), '2026-10-14T18Z|youtube');
  assert.equal(claveTurno(utcDia(14, 18, 37), 'youtube'), claveTurno(utcDia(14, 18, 0), 'youtube'));
  assert.equal(inicioTurno(utcDia(14, 21, 59)), Date.parse('2026-10-14T18:00:00Z'));
  assert.equal(claveTurno(utcDia(15, 0, 40), 'shorts'), '2026-10-14T22Z|shorts'); // pasada la medianoche UTC
  assert.notEqual(claveTurno(utcDia(14, 22, 0), 'shorts'), claveTurno(utcDia(15, 2, 0), 'shorts'));
  assert.notEqual(claveTurno(utcDia(14, 22, 0), 'shorts'), claveTurno(utcDia(14, 22, 0), 'especial'));
});

test('nombres de assets de TikTok: vertical completo y su huella', () => {
  assert.equal(nombreAsset('g-01-a', 'vertical'), 'g-01-a.vertical.mp4');
  assert.equal(rutaLocal('g-01-a', 'vertical'), 'out/g-01-a/g-01-a.vertical.mp4');
  assert.equal(nombreAsset('g-01-a', 'tiktok'), 'g-01-a.tiktok.mp4');
  assert.equal(nombreAsset('g-01-a', 'tiktok-meta'), 'g-01-a.tiktok.json');
});

test('YouTube: especiales y Stories a su lista; episodios comunes, la de su temporada (la pone subir.mjs)', () => {
  const listas = { 'The Odyssey': 'PLo', 'Greek Myth Stories': 'PLs' };
  assert.deepEqual(extraYT({ especial: 'The Odyssey' }, listas), ['--lista=PLo']);
  assert.deepEqual(extraYT({ especial: 'Greek Myth Stories' }, listas), ['--lista=PLs']);
  assert.deepEqual(extraYT({ temporada: 2, episodio: 10 }, listas), []);
  assert.deepEqual(extraYT(undefined, listas), []);
});

test('partes: se rehacen si cambió el guion (elenco oficial), salvo que el episodio ya haya empezado en Instagram', () => {
  const p = { de: 2, gancho: 'T', ritmo: 'lento', huella: 'abc' };
  assert.equal(partesVigentes(p, false, 'T', 'abc'), true);
  assert.equal(partesVigentes(p, false, 'T', 'otra'), false);
  assert.equal(partesVigentes({ ...p, huella: undefined }, false, 'T', 'abc'), false); // de antes de la huella
  assert.equal(partesVigentes(p, true, 'X', 'otra'), true);
});

test('TikTok frenado por la plataforma: 2 por turno durante 24 h, después vuelve a probar', () => {
  const desde = '2026-10-18T10:00:00Z';
  assert.equal(tiktokFrenado({ max: 2, desde }, Date.parse('2026-10-19T09:00:00Z')), true);
  assert.equal(tiktokFrenado({ max: 2, desde }, Date.parse('2026-10-19T10:30:00Z')), false);
  assert.equal(tiktokFrenado(null), false);
});
