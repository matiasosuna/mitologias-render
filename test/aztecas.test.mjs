// Serie azteca (tema códice): los guiones usan solo fondos, elementos y elenco que existen, y la serie está
// cableada en todos los lugares donde se elige tema, música y metadatos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const leer = (f) => readFileSync(f, 'utf8');
const lista = (archivo, nombre) => (leer(archivo).match(new RegExp(`export const ${nombre} = \\[([^\\]]*)\\]`))?.[1] ?? '').match(/'(\w+)'/g).map((x) => x.slice(1, -1));
const FONDOS = new Set(lista('src/motor/fondosAzteca.tsx', 'FONDOS_AZTECA'));
const ELEMS = new Set(lista('src/motor/fondosAzteca.tsx', 'ELEMENTOS_AZTECA'));
const ELENCO = new Set([...leer('src/motor/elencoAzteca.tsx').split('export const ELENCO_AZTECA')[1].split('export const NOMBRE_EN_AZTECA')[0].matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]));
const GENERICOS = new Set(['sol', 'luna', 'nube', 'monte', 'arbol', 'casa', 'templo', 'roca', 'altar', 'trono', 'barco', 'cueva', 'maiz', 'estrellas', 'fogata']);
// Animales comunes del elenco general (pez, perro…) también valen.
const ELENCO_GENERAL = new Set([...leer('src/motor/elenco.tsx').split('export const ELENCO')[1].split('export type Estado')[0].matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]));
const existe = (k) => ELENCO.has(k) || ELENCO_GENERAL.has(k);
const guiones = readdirSync('src/videos').filter((d) => d.startsWith('aztecas-')).map((d) => JSON.parse(leer(`src/videos/${d}/guion.json`)));

test('la temporada 1 azteca tiene sus 12 episodios con youtube.json y Shorts', () => {
  assert.equal(guiones.filter((g) => Number(g.numero) <= 12).length, 12);
  for (const g of guiones) assert.ok((g.shorts ?? []).length >= 2, `${g.id}: shorts`);
  for (const g of guiones) assert.ok(existsSync(`src/videos/${g.id}/youtube.json`), g.id);
});

test('cada guion azteca usa fondos, elementos y elenco conocidos', () => {
  for (const g of guiones) {
    assert.equal(g.serie, 'aztecas');
    for (const e of g.escenas) {
      assert.ok(FONDOS.has(e.fondo), `${g.id}/${e.id}: fondo ${e.fondo}`);
      for (const el of e.elementos ?? []) assert.ok(ELEMS.has(el.tipo) || GENERICOS.has(el.tipo), `${g.id}/${e.id}: elemento ${el.tipo}`);
      for (const a of e.actores ?? []) {
        assert.ok(existe(a.como ?? a.id), `${g.id}/${e.id}: actor ${a.como ?? a.id}`);
        for (const p of a.pasos ?? []) if (p.en_que) assert.ok(existe(p.en_que), `${g.id}/${e.id}: transforma en ${p.en_que}`);
      }
    }
  }
});

test('frases en español e inglés, de 130 caracteres como mucho, 2 a 6 por escena', () => {
  for (const g of guiones) for (const e of g.escenas) {
    assert.ok(e.frases.length >= 2 && e.frases.length <= 6, `${g.id}/${e.id}`);
    for (const f of e.frases) for (const k of ['es', 'en']) assert.ok(f[k] && f[k].length <= 130, `${g.id}/${e.id}: ${f[k]}`);
  }
});

test('la serie está cableada: tema, nombre, música y metadatos', () => {
  const vasija = leer('src/comun/vasija.tsx');
  assert.match(vasija, /serie === 'aztecas' \? 'codice'/);
  assert.match(vasija, /codice: \{ en: 'Aztec Mythology', es: 'Mitología Azteca' \}/);
  assert.match(vasija, /musica: 'musica\/azteca\.wav'/);
  assert.match(leer('scripts/motor-render.mjs'), /'aztecas' \? 'azteca'/);
  assert.match(leer('scripts/youtube-meta.mjs'), /meta-youtube-aztecas\.json/);
  assert.match(leer('scripts/modal_render.py'), /"aztecas": "azteca"/);
  const meta = JSON.parse(leer('src/videos/meta-youtube-aztecas.json'));
  assert.equal(meta.nombre.en, 'Aztec Mythology');
});
