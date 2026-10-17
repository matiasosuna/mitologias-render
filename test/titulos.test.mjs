// Títulos de YouTube (src/videos/titulos.json): "<titulo.en del guion> | <Serie> Mythology S<n>E<m>" (o "… | <Nombre> Special"),
// ≤100 caracteres, una entrada por episodio con guion, y temporada/episodio sin repetir ni saltos dentro de cada serie.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { FORMATO, nombreSerie, lineaTemporada, temporadaDe } from '../scripts/titulos.mjs';
import { snippetConTitulo, pendientes, tandas, esCuota } from '../scripts/youtube-titulos.mjs';

const T = JSON.parse(readFileSync('src/videos/titulos.json', 'utf8'));
const episodios = readdirSync('src/videos').filter((d) => !d.startsWith('short-') && existsSync(`src/videos/${d}/guion.json`));
const guion = (id) => JSON.parse(readFileSync(`src/videos/${id}/guion.json`, 'utf8'));

test('cada episodio con guion.json tiene título (y no sobra ninguno)', () => {
  assert.ok(episodios.length > 100);
  for (const id of episodios) assert.ok(T[id], `falta ${id}`);
  for (const id of Object.keys(T)) assert.ok(episodios.includes(id), `sobra ${id}`);
});

test('cada título tiene ≤100 caracteres, el formato y la serie correcta', () => {
  for (const [id, e] of Object.entries(T)) {
    const g = guion(id);
    assert.ok(e.titulo.length <= 100, `${id}: ${e.titulo.length} caracteres`);
    const m = e.titulo.match(FORMATO);
    assert.ok(m, `${id}: formato "${e.titulo}"`);
    const capitulo = m.groups.curioso;
    assert.equal(capitulo, g.titulo.en.trim(), `${id}: el título es el del video (guion titulo.en)`);
    assert.ok(capitulo.length <= 70, `${id}: título de ${capitulo.length} caracteres`);
    if (g.especial) {
      assert.equal(m.groups.especial, g.especial.nombre.en, id);
      assert.equal(e.especial, g.especial.nombre.en, id);
      assert.equal(e.titulo.endsWith(g.especial.parte ? ` Special · Part ${g.especial.parte}` : ' Special'), true, id);
    } else {
      assert.equal(m.groups.serie, nombreSerie(g.serie), id);
      assert.equal(Number(m.groups.t), e.temporada, id);
      assert.equal(Number(m.groups.e), e.episodio, id);
    }
  }
});

test('los títulos no se repiten', () => {
  const vistos = new Map();
  for (const [id, e] of Object.entries(T)) {
    const c = e.titulo.split(' | ')[0].toLowerCase();
    assert.ok(!vistos.has(c), `${id} repite el título de ${vistos.get(c)}`);
    vistos.set(c, id);
  }
});

test('temporada y episodio únicos por serie, seguidos (1..N) y en el orden de las carpetas (salvo temporada 0)', () => {
  const series = {};
  for (const id of episodios) (series[guion(id).serie] ??= []).push(id);
  for (const [serie, ids] of Object.entries(series)) {
    const vistos = new Set();
    const porTemp = {};
    for (const id of ids.sort()) {
      const { temporada, episodio } = T[id];
      assert.ok(Number.isInteger(temporada) && Number.isInteger(episodio) && episodio >= 1, `${id}: ${temporada}/${episodio}`);
      const k = `${temporada}-${episodio}`;
      assert.ok(!vistos.has(k), `${serie}: S${temporada}E${episodio} repetido (${id})`);
      vistos.add(k);
      (porTemp[temporada] ??= []).push(episodio);
    }
    // temporada 0 (especiales y Stories, carpetas 80+ y 97–99): seguidos 1..N, sin importar el orden de las carpetas
    for (const [t, eps] of Object.entries(porTemp)) { const e = t === '0' ? [...eps].sort((a, b) => a - b) : eps; assert.deepEqual(e, e.map((_, i) => i + 1), `${serie} temporada ${t}: episodios seguidos y en orden`); }
  }
});

test('temporadas conocidas: Season 2 empieza donde dicen los planes', () => {
  const st = (id) => `S${T[id].temporada}E${T[id].episodio}`;
  assert.equal(st('griegas-07-tifon'), 'S1E7');
  assert.equal(st('griegas-08-doce-olimpicos'), 'S2E1');
  assert.equal(st('nordicas-13-mundo-renace'), 'S1E13');
  assert.equal(st('nordicas-14-volund'), 'S2E1');
  assert.equal(st('nordicas-15-oro-de-andvari'), 'S2E2');
  assert.equal(st('egipcias-12-keops-y-los-magos'), 'S2E1');
  assert.equal(st('hawaianas-13-pele-deja-kahiki'), 'S2E1');
  assert.equal(st('hawaianas-24-el-beso-en-el-crater'), 'S2E12');
  for (const id of episodios.filter((i) => !guion(i).especial)) {
    const g = guion(id);
    assert.deepEqual({ temporada: T[id].temporada, episodio: T[id].episodio }, temporadaDe(g.serie, g.numero), id);
  }
});

test('primera línea de la descripción', () => {
  assert.equal(lineaTemporada({ temporada: 1, episodio: 10 }, 'nordicas'), 'Norse Mythology · Season 1, Episode 10');
  assert.equal(lineaTemporada({ temporada: 0, episodio: 1, especial: 'The Odyssey', parte: 1 }, 'griegas'), 'The Odyssey · Special, Part 1');
  assert.equal(lineaTemporada(undefined, 'griegas'), '');
});

test('youtube-titulos: manda el snippet entero con solo el título nuevo', () => {
  const sn = { title: 'Viejo', description: 'desc', tags: ['a'], categoryId: '27', defaultLanguage: 'en', defaultAudioLanguage: 'en' };
  assert.deepEqual(snippetConTitulo(sn, 'Nuevo'), { ...sn, title: 'Nuevo' });
  assert.equal(sn.title, 'Viejo');
  assert.throws(() => snippetConTitulo({ title: 'x' }, 'y'), /categoryId/);
});

test('youtube-titulos: solo episodios con título, tandas de 50 y corte por cuota', () => {
  const p = pendientes({ 'griegas-01-origen': 'A', 'short-griegas-nadie': 'B', 'x-99': 'C' }, { 'griegas-01-origen': { titulo: 'T' } });
  assert.deepEqual(p, [{ id: 'griegas-01-origen', video: 'A', nuevo: 'T' }]);
  assert.deepEqual(tandas([...Array(101).keys()]).map((t) => t.length), [50, 50, 1]);
  assert.equal(esCuota(Object.assign(new Error('x'), { status: 403, razon: 'quotaExceeded' })), true);
  assert.equal(esCuota(Object.assign(new Error('x'), { status: 403, razon: 'forbidden' })), false);
});

test('gancho de las partes de Reels y código del episodio', async () => {
  const { parteCuriosa, ganchoParte, codigoEpisodio } = await import('../scripts/titulos.mjs');
  assert.equal(parteCuriosa('Thor Lost His Hammer | Norse Mythology S1E5'), 'Thor Lost His Hammer');
  assert.equal(parteCuriosa('Sin barra'), 'Sin barra');
  assert.equal(parteCuriosa(undefined), '');
  const t = { a: { titulo: 'How Isis Tricked Ra | Egyptian Mythology S1E5' }, e: { titulo: 'The Lord of the Dead | Lords of the Dead Special', especial: 'Lords of the Dead' } };
  assert.equal(ganchoParte('a', t), 'How Isis Tricked Ra');
  assert.equal(ganchoParte('falta', t), '');
  assert.equal(codigoEpisodio('a', t), 'Egyptian Mythology S1E5');
  assert.equal(codigoEpisodio('e', t), '');
  assert.equal(codigoEpisodio('falta', t), '');
  assert.equal(codigoEpisodio('nordicas-14-volund', T), 'Norse Mythology S2E1');
});
