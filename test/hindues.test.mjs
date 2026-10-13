// Serie hindú (tema pahari): los guiones usan solo fondos, elementos y elenco que existen, el elenco no choca con
// el de otras series, y la serie está cableada en todos los lugares donde se elige tema, música y metadatos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';

const leer = (f) => readFileSync(f, 'utf8');
const lista = (archivo, nombre) => (leer(archivo).match(new RegExp(`export const ${nombre} = \\[([^\\]]*)\\]`))?.[1] ?? '').match(/'(\w+)'/g).map((x) => x.slice(1, -1));
const claves = (texto) => [...texto.matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]);
const FONDOS = new Set(lista('src/motor/fondosHindu.tsx', 'FONDOS_HINDU'));
const ELEMS = new Set(lista('src/motor/fondosHindu.tsx', 'ELEMENTOS_HINDU'));
const cuerpoHindu = leer('src/motor/elencoHindu.tsx').split('export const ELENCO_HINDU')[1].split('export const NOMBRE_EN_HINDU')[0];
const ELENCO = new Set(claves(cuerpoHindu));
// Genéricos que el tema pahari dibuja a su manera (fondosHindu.tsx los atiende).
const GENERICOS = new Set(['sol', 'luna', 'nube', 'estrellas', 'arbol', 'olivo', 'cipres', 'pino', 'palmera', 'monte', 'roca', 'rio', 'templo', 'casa', 'columna', 'puerta', 'trono', 'altar', 'fogata', 'barco']);
const ELENCO_GENERAL = new Set(claves(leer('src/motor/elenco.tsx').split('export const ELENCO')[1].split('export type Estado')[0]));
const existe = (k) => ELENCO.has(k) || ELENCO_GENERAL.has(k);
const guiones = readdirSync('src/videos').filter((d) => d.startsWith('hindues-')).map((d) => JSON.parse(leer(`src/videos/${d}/guion.json`)));

test('la temporada 1 hindú tiene sus 12 episodios con youtube.json y 2–3 Shorts', () => {
  assert.equal(guiones.filter((g) => Number(g.numero) <= 12).length, 12);
  for (const g of guiones) {
    assert.ok((g.shorts ?? []).length >= 2 && g.shorts.length <= 3, `${g.id}: shorts`);
    assert.ok(existsSync(`src/videos/${g.id}/youtube.json`), g.id);
    const yt = JSON.parse(leer(`src/videos/${g.id}/youtube.json`));
    assert.equal(yt.capitulos.length, g.escenas.length, `${g.id}: un capítulo por escena`);
    for (const s of g.shorts) assert.ok(g.escenas.some((e) => e.id === s.escena && s.hasta < e.frases.length), `${g.id}: short en ${s.escena}`);
  }
});

test('cada guion hindú usa fondos, elementos y elenco conocidos', () => {
  for (const g of guiones) {
    assert.equal(g.serie, 'hindues');
    assert.equal(g.escenas.at(-1).id, 'cierre', `${g.id}: la última escena es el cierre`);
    for (const e of g.escenas) {
      assert.ok(FONDOS.has(e.fondo), `${g.id}/${e.id}: fondo ${e.fondo}`);
      for (const el of e.elementos ?? []) assert.ok(ELEMS.has(el.tipo) || GENERICOS.has(el.tipo), `${g.id}/${e.id}: elemento ${el.tipo}`);
      for (const a of e.actores ?? []) {
        assert.ok(existe(a.como ?? a.id), `${g.id}/${e.id}: actor ${a.como ?? a.id}`);
        for (const p of a.pasos ?? []) if (p.en_que) assert.ok(existe(p.en_que), `${g.id}/${e.id}: transforma en ${p.en_que}`);
      }
      for (const ef of e.efectos ?? []) assert.notEqual(ef.tipo, 'sangre', `${g.id}/${e.id}: sin sangre en pantalla`);
    }
    for (const k of [g.miniatura.heroe, g.miniatura.rival]) assert.equal(leer('src/motor/elencoHindu.tsx').includes(`  ${k}: H(`) || leer('src/motor/elencoHindu.tsx').includes(`  ${k}: M(`), true, `${g.id}: miniatura con persona ${k}`);
  }
});

test('frases en español e inglés, de 130 caracteres como mucho, 2 a 6 por escena; un solo "por eso"', () => {
  for (const g of guiones) {
    for (const e of g.escenas) {
      assert.ok(e.frases.length >= 2 && e.frases.length <= 6, `${g.id}/${e.id}`);
      for (const f of e.frases) for (const k of ['es', 'en']) assert.ok(f[k] && f[k].length <= 130, `${g.id}/${e.id}: ${f[k]}`);
    }
    assert.ok(g.escenas.flatMap((e) => e.rotulos ?? []).filter((r) => r.estilo === 'porque').length <= 1, `${g.id}: más de un "por eso"`);
  }
});

test('las claves del elenco hindú no chocan con las de otras series', () => {
  const otras = new Map();
  for (const f of readdirSync('src/motor').filter((f) => /^elenco\w*\.tsx$/.test(f) && f !== 'elencoHindu.tsx')) {
    const t = leer(`src/motor/${f}`);
    const bloques = f === 'elenco.tsx' ? [t.split('export const ELENCO')[1].split('export type Estado')[0]] : [...t.matchAll(/export const ELENCO_\w+[^=]*= \{([\s\S]*?)\n\};/g)].map((m) => m[1]);
    for (const b of bloques) for (const k of claves(b)) otras.set(k, f);
  }
  const choques = [...ELENCO].filter((k) => otras.has(k)).map((k) => `${k} (${otras.get(k)})`);
  assert.deepEqual(choques, []);
});

test('la serie está cableada: tema, nombre, música y metadatos', () => {
  const vasija = leer('src/comun/vasija.tsx');
  assert.match(vasija, /serie === 'hindues' \? 'pahari'/);
  assert.match(vasija, /pahari: \{ en: 'Hindu Mythology', es: 'Mitología Hindú' \}/);
  assert.match(vasija, /musica: 'musica\/hindu\.wav'/);
  assert.match(vasija, /TEMA\.nombre === 'pahari' \? <GuardasPahari/);
  assert.match(leer('src/motor/fondos.tsx'), /fondoHindu\(tipo, f, astros\)/);
  assert.match(leer('src/motor/elenco.tsx'), /\.\.\.ELENCO_HINDU/);
  assert.match(leer('scripts/motor-render.mjs'), /'hindues' \? 'hindu'/);
  assert.match(leer('scripts/youtube-meta.mjs'), /meta-youtube-hindues\.json/);
  assert.match(leer('scripts/modal_render.py'), /"hindues": "hindu"/);
  assert.match(leer('scripts/buffer-tiktok.mjs'), /hindues: '#hindumythology/);
  assert.match(leer('scripts/motor-revisar.mjs'), /fondosHindu\.tsx/);
  for (const f of ['src/motor/Short.tsx', 'src/motor/ShortNativo.tsx', 'src/motor/VideoVertical.tsx', 'src/comun/miniatura.tsx', 'src/comun/portadaIG.tsx', 'src/motor/VideoMotor.tsx']) assert.match(leer(f), /pahari/, f);
  for (const f of ['scripts/instagram.mjs', 'scripts/instagram-cola.mjs', 'scripts/instagram-reels.mjs', 'scripts/instagram-shorts.mjs', 'scripts/subir.mjs', 'scripts/portadas-ig.mjs']) assert.match(leer(f), /hindues/, f);
  const meta = JSON.parse(leer('src/videos/meta-youtube-hindues.json'));
  assert.equal(meta.nombre.en, 'Hindu Mythology');
  assert.ok(statSync('public/musica/hindu.wav').size > 40e6, 'falta public/musica/hindu.wav (node scripts/musica-hindu.mjs)');
});
