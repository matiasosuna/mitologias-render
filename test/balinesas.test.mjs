// Serie balinesa (tema kamasan): los guiones usan solo fondos, elementos y elenco que existen, y la serie está
// cableada en todos los lugares donde se elige tema, música y metadatos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const leer = (f) => readFileSync(f, 'utf8');
const lista = (archivo, nombre) => (leer(archivo).match(new RegExp(`export const ${nombre} = \\[([^\\]]*)\\]`))?.[1] ?? '').match(/'(\w+)'/g).map((x) => x.slice(1, -1));
const FONDOS = new Set(lista('src/motor/fondosBalines.tsx', 'FONDOS_BALINES'));
const ELEMS = new Set(lista('src/motor/fondosBalines.tsx', 'ELEMENTOS_BALINES'));
const ELENCO = new Set([...leer('src/motor/elencoBalines.tsx').split('export const ELENCO_BALINES')[1].split('export const NOMBRE_EN_BALINES')[0].matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]));
const GENERICOS = new Set(['sol', 'luna', 'nube', 'monte', 'arbol', 'casa', 'templo', 'roca', 'altar', 'barco', 'maiz', 'estrellas', 'fogata', 'palmera', 'puerta', 'muralla', 'pozo']);
const guiones = readdirSync('src/videos').filter((d) => d.startsWith('balinesas-')).map((d) => JSON.parse(leer(`src/videos/${d}/guion.json`)));
const persona = (k) => ['elencoBalines', 'elencoBalinesOficial'].some((f) => new RegExp(`^\\s{2}${k}: [HM]\\(`, 'm').test(leer(`src/motor/${f}.tsx`)));
// Diseños oficiales (*_oficial) de la serie: también valen en los guiones.
for (const m of leer('src/motor/elencoBalinesOficial.tsx').matchAll(/^\s{2}(\w+_oficial): /gm)) ELENCO.add(m[1]);

test('la temporada 1 balinesa tiene sus 12 episodios con youtube.json y Shorts', () => {
  assert.equal(guiones.filter((g) => Number(g.numero) <= 12).length, 12);
  for (const g of guiones) {
    assert.ok((g.shorts ?? []).length >= 2 && g.shorts.length <= 3, `${g.id}: shorts`);
    assert.ok(existsSync(`src/videos/${g.id}/youtube.json`), g.id);
    const yt = JSON.parse(leer(`src/videos/${g.id}/youtube.json`));
    assert.equal(yt.capitulos.length, g.escenas.length, `${g.id}: un capítulo por escena`);
  }
});

test('cada guion balinés usa fondos, elementos y elenco propios', () => {
  for (const g of guiones) {
    assert.equal(g.serie, 'balinesas');
    for (const e of g.escenas) {
      assert.ok(FONDOS.has(e.fondo), `${g.id}/${e.id}: fondo ${e.fondo}`);
      for (const el of e.elementos ?? []) assert.ok(ELEMS.has(el.tipo) || GENERICOS.has(el.tipo), `${g.id}/${e.id}: elemento ${el.tipo}`);
      for (const a of e.actores ?? []) {
        assert.ok(ELENCO.has(a.como ?? a.id), `${g.id}/${e.id}: actor ${a.como ?? a.id}`);
        for (const p of a.pasos ?? []) if (p.en_que) assert.ok(ELENCO.has(p.en_que), `${g.id}/${e.id}: transforma en ${p.en_que}`);
      }
    }
    for (const k of [g.miniatura.heroe, g.miniatura.rival]) assert.ok(persona(k), `${g.id}: la miniatura necesita personas (${k})`);
  }
});

test('frases en español e inglés, de 130 caracteres como mucho, 2 a 6 por escena; shorts dentro de su escena', () => {
  for (const g of guiones) {
    for (const e of g.escenas) {
      assert.ok(e.frases.length >= 2 && e.frases.length <= 6, `${g.id}/${e.id}`);
      for (const f of e.frases) for (const k of ['es', 'en']) assert.ok(f[k] && f[k].length <= 130, `${g.id}/${e.id}: ${f[k]}`);
    }
    for (const s of g.shorts) {
      const e = g.escenas.find((x) => x.id === s.escena);
      assert.ok(e && s.desde <= s.hasta && s.hasta < e.frases.length, `${g.id}: short ${s.escena}`);
    }
  }
});

test('episodios de unos 4 a 6 minutos (≈ 500–720 palabras en inglés)', () => {
  for (const g of guiones) {
    const palabras = g.escenas.flatMap((e) => e.frases).reduce((n, f) => n + f.en.split(/\s+/).length, 0);
    assert.ok(palabras >= 500 && palabras <= 720, `${g.id}: ${palabras} palabras`);
  }
});

test('la serie está cableada: tema, nombre, música y metadatos', () => {
  const vasija = leer('src/comun/vasija.tsx');
  assert.match(vasija, /serie === 'balinesas' \? 'kamasan'/);
  assert.match(vasija, /kamasan: \{ en: 'Balinese Mythology', es: 'Mitología Balinesa' \}/);
  assert.match(vasija, /musica: 'musica\/balinesa\.wav'/);
  assert.ok(existsSync('public/musica/balinesa.wav'), 'falta public/musica/balinesa.wav (node scripts/musica-balinesa.mjs)');
  assert.match(leer('scripts/motor-render.mjs'), /'balinesas' \? 'balinesa'/);
  assert.match(leer('scripts/youtube-meta.mjs'), /meta-youtube-balinesas\.json/);
  assert.match(leer('scripts/modal_render.py'), /"balinesas": "balinesa"/);
  assert.match(leer('scripts/buffer-tiktok.mjs'), /balinesas: '#balinesemythology/);
  for (const f of ['scripts/instagram.mjs', 'scripts/instagram-cola.mjs', 'scripts/instagram-reels.mjs', 'scripts/instagram-shorts.mjs', 'scripts/subir.mjs', 'scripts/portadas-ig.mjs']) assert.match(leer(f), /balinesas/, f);
  for (const f of ['src/comun/miniatura.tsx', 'src/comun/portadaIG.tsx', 'src/motor/Short.tsx', 'src/motor/ShortNativo.tsx', 'src/motor/VideoVertical.tsx', 'src/motor/VideoMotor.tsx']) assert.match(leer(f), /kamasan/, f);
  assert.match(leer('scripts/motor-revisar.mjs'), /FONDOS_BALINES/);
  const meta = JSON.parse(leer('src/videos/meta-youtube-balinesas.json'));
  assert.equal(meta.nombre.en, 'Balinese Mythology');
});
