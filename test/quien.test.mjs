// Shorts "Who is…?" (BRIEF-QUIEN.md): campo `quien`, 2 s de apertura y los Shorts de siempre sin cambios.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { INTRO_QUIEN, tiemposShort, textosQuien, tamQueEntra, erroresQuien, FONDO_QUIEN } from '../lib/quien.mjs';
import { T_SHORT, timelineMulti, FPS } from '../lib/motor-tiempos.mjs';

const leer = (f) => readFileSync(f, 'utf8');
const ZEUS = { formato: 'short', serie: 'griegas', quien: { nombre: { es: 'Zeus', en: 'Zeus' }, subtitulo: { es: 'Rey de los dioses', en: 'King of the gods' }, como: 'zeus_oficial' } };
const escenas = [{ id: 'a', frases: [{ texto: { en: 'x' }, audio: {}, segundos: { en: 2 } }] }, { id: 'b', frases: [{ texto: { en: 'y' }, audio: {}, segundos: { en: 3 } }] }];
// Personajes oficiales de las 4 mitologías principales (las mismas claves que lee motor-revisar.mjs).
const oficiales = new Set(['elencoGriegoOficial', 'elencoNordico', 'elencoEgipcioOficial', 'elencoHawaianoOficial']
  .flatMap((f) => [...leer(`src/motor/${f}.tsx`).matchAll(/^\s{2}(\w+_oficial): [hmHM]\(/gm)].map((m) => m[1])));

test('hay 49 personajes oficiales para los "Who is…?" (14 + 12 + 13 + 10)', () => {
  assert.equal(oficiales.size, 49);
  for (const k of ['zeus_oficial', 'odin_oficial', 'ra_oficial', 'pele_oficial', 'kamapuaa_oficial', 'njord_oficial']) assert.ok(oficiales.has(k), k);
});

test('sin `quien` el Short no cambia: mismos tiempos y mismo timeline', () => {
  assert.equal(tiemposShort({ formato: 'short' }), T_SHORT);
  assert.deepEqual(timelineMulti(escenas, FPS, tiemposShort({ formato: 'short' })), timelineMulti(escenas, FPS, T_SHORT));
});

test('con `quien` la historia arranca después de 2 s de apertura y el resto se corre igual', () => {
  assert.equal(INTRO_QUIEN, 2);
  const con = timelineMulti(escenas, FPS, tiemposShort(ZEUS)), sin = timelineMulti(escenas, FPS, T_SHORT);
  assert.equal(con.introFrames, 2 * FPS);
  assert.equal(con.escenas[0].from, 2 * FPS);
  const extra = con.introFrames - sin.introFrames;
  assert.equal(con.total - sin.total, extra);
  assert.deepEqual(con.escenas.map((e) => e.from - extra), sin.escenas.map((e) => e.from));
  assert.equal(con.outroFrames, sin.outroFrames);
});

test('textos del cartel', () => {
  assert.deepEqual(textosQuien(ZEUS.quien, 'en'), { titulo: 'Who is Zeus?', nombre: 'ZEUS', subtitulo: 'King of the gods' });
  assert.equal(textosQuien(ZEUS.quien, 'es').titulo, '¿Quién es Zeus?');
  assert.equal(textosQuien({ nombre: { es: 'Atenea', en: 'Athena' }, subtitulo: { es: 'x', en: 'y' } }, 'en').nombre, 'ATHENA');
  assert.equal(textosQuien({ nombre: { es: 'Hiʻiaka', en: 'Hiʻiaka' }, subtitulo: { es: 'x', en: 'y' } }, 'en').nombre, 'HIʻIAKA');
});

test('el nombre se achica para entrar en el ancho', () => {
  assert.equal(tamQueEntra('ZEUS', 150, 0.8), 150);
  assert.ok(tamQueEntra('HEPHAESTUS', 150, 0.8) * 10 * 0.8 <= 980);
  assert.ok(tamQueEntra('Who is Hephaestus?', 92, 0.56) <= 92);
});

test('validación del campo', () => {
  assert.deepEqual(erroresQuien(ZEUS, oficiales), []);
  assert.deepEqual(erroresQuien({ formato: 'short' }, oficiales), []);
  assert.match(erroresQuien({ ...ZEUS, quien: { ...ZEUS.quien, como: 'zeus' } }, oficiales).join(), /_oficial/);
  assert.match(erroresQuien({ ...ZEUS, quien: { ...ZEUS.quien, como: 'nadie_oficial' } }, oficiales).join(), /no está en el elenco/);
  assert.match(erroresQuien({ ...ZEUS, quien: { ...ZEUS.quien, subtitulo: { es: 'x' } } }, oficiales).join(), /subtitulo/);
  assert.match(erroresQuien({ ...ZEUS, formato: undefined }, oficiales).join(), /formato/);
  for (const s of ['griegas', 'nordicas', 'egipcias', 'hawaianas']) assert.ok(FONDO_QUIEN[s], s);
});

test('los guiones con `quien` son válidos y apuntan a un episodio con título', () => {
  const T = JSON.parse(leer('src/videos/titulos.json'));
  for (const d of readdirSync('src/videos').filter((x) => x.startsWith('short-') && existsSync(`src/videos/${x}/guion.json`))) {
    const g = JSON.parse(leer(`src/videos/${d}/guion.json`));
    if (!g.quien) continue;
    assert.deepEqual(erroresQuien(g, oficiales), [], d);
    assert.ok(T[g.episodio], `${d}: episodio ${g.episodio} sin título`);
  }
});

test('cableado: narrar, retimear, revisar y ShortNativo usan `quien`', () => {
  for (const f of ['scripts/motor-narrar.mjs', 'scripts/narracion-lenta.mjs']) assert.match(leer(f), /tiemposShort\(g\)/, f);
  assert.match(leer('scripts/motor-revisar.mjs'), /erroresQuien\(g, elenco\)/);
  const sn = leer('src/motor/ShortNativo.tsx');
  assert.match(sn, /guion\.quien && f < timeline\.introFrames/);
  assert.match(sn, /<AperturaQuien /);
});
