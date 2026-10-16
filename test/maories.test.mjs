// Serie maorí (tema kōwhaiwhai): los guiones usan solo fondos, elementos y elenco que existen, escriben los nombres
// con macrones y la serie está cableada en todos los lugares donde se elige tema, música y metadatos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const leer = (f) => readFileSync(f, 'utf8');
const lista = (archivo, nombre) => (leer(archivo).match(new RegExp(`export const ${nombre} = \\[([^\\]]*)\\]`))?.[1] ?? '').match(/'(\w+)'/g).map((x) => x.slice(1, -1));
const FONDOS = new Set(lista('src/motor/fondosMaori.tsx', 'FONDOS_MAORI'));
const ELEMS = new Set(lista('src/motor/fondosMaori.tsx', 'ELEMENTOS_MAORI'));
const ELENCO = new Set([...leer('src/motor/elencoMaori.tsx').split('export const ELENCO_MAORI')[1].split('export const NOMBRE_EN_MAORI')[0].matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]));
// Diseños oficiales (*_oficial) de la serie: también valen en los guiones.
for (const m of leer('src/motor/elencoMaoriOficial.tsx').matchAll(/^\s{2}(\w+_oficial): /gm)) ELENCO.add(m[1]);
// Genéricos que el tema maorí dibuja a su manera (elementoMaori).
const GENERICOS = new Set(['sol', 'luna', 'nube', 'monte', 'arbol', 'olivo', 'palmera', 'pino', 'cipres', 'casa', 'templo', 'roca', 'barco', 'canoa', 'cueva', 'fogata', 'isla', 'muralla', 'estrellas']);
const guiones = readdirSync('src/videos').filter((d) => d.startsWith('maories-')).map((d) => JSON.parse(leer(`src/videos/${d}/guion.json`)));
const texto = (g) => g.escenas.flatMap((e) => e.frases.flatMap((f) => [f.es, f.en])).join(' ');

test('la temporada 1 maorí tiene sus 12 episodios con youtube.json y Shorts', () => {
  assert.equal(guiones.filter((g) => Number(g.numero) <= 12).length, 12);
  for (const g of guiones) {
    assert.ok((g.shorts ?? []).length >= 2 && g.shorts.length <= 3, `${g.id}: shorts`);
    for (const s of g.shorts) assert.ok(g.escenas.some((e) => e.id === s.escena && s.hasta < e.frases.length && s.desde <= s.hasta), `${g.id}: short ${s.escena}`);
    assert.ok(existsSync(`src/videos/${g.id}/youtube.json`), g.id);
    const yt = JSON.parse(leer(`src/videos/${g.id}/youtube.json`));
    assert.equal(yt.capitulos.length, g.escenas.length, `${g.id}: un capítulo por escena`);
  }
});

test('cada guion maorí usa fondos, elementos y elenco conocidos', () => {
  for (const g of guiones) {
    assert.equal(g.serie, 'maories');
    assert.ok(g.miniatura && ELENCO.has(g.miniatura.heroe), `${g.id}: miniatura`);
    for (const e of g.escenas) {
      assert.ok(FONDOS.has(e.fondo), `${g.id}/${e.id}: fondo ${e.fondo}`);
      for (const el of e.elementos ?? []) assert.ok(ELEMS.has(el.tipo) || GENERICOS.has(el.tipo), `${g.id}/${e.id}: elemento ${el.tipo}`);
      for (const a of e.actores ?? []) {
        assert.ok(ELENCO.has(a.como ?? a.id), `${g.id}/${e.id}: actor ${a.como ?? a.id}`);
        for (const p of a.pasos ?? []) if (p.en_que) assert.ok(ELENCO.has(p.en_que), `${g.id}/${e.id}: transforma en ${p.en_que}`);
      }
    }
  }
});

test('frases en español e inglés, de 130 caracteres como mucho, 2 a 6 por escena; carteles con es y en', () => {
  for (const g of guiones) for (const e of g.escenas) {
    assert.ok(e.frases.length >= 2 && e.frases.length <= 6, `${g.id}/${e.id}`);
    for (const f of e.frases) for (const k of ['es', 'en']) assert.ok(f[k] && f[k].length <= 130, `${g.id}/${e.id}: ${f[k]}`);
    for (const r of e.rotulos ?? []) assert.ok(r.texto.es && r.texto.en, `${g.id}/${e.id}: rótulo`);
    assert.ok((e.rotulos ?? []).filter((r) => r.estilo === 'porque').every((r) => r.texto.en.length <= 45), `${g.id}/${e.id}: cartel "porque" largo`);
  }
});

test('nombres maoríes con macrones (nunca sin ellos) y un episodio de 4 a 6 minutos', () => {
  const SIN = [/(?<!of the )\bMaori\b/, /\bTane\b/, /\bMaui\b/, /\bPapatuanuku\b/, /\bTawhirimatea\b/, /\bTumatauenga\b/, /\bTawhaki\b/, /\bRata\b/, /\bRuaumoko\b/, /\bKuramarotini\b/];
  for (const g of guiones) {
    const t = texto(g);
    for (const r of SIN) assert.ok(!r.test(t), `${g.id}: falta macrón (${r})`);
    // Estimación: los aztecas salieron a ≈128 palabras por minuto narradas.
    const palabras = g.escenas.flatMap((e) => e.frases).reduce((n, f) => n + f.en.split(/\s+/).length, 0);
    assert.ok(palabras >= 560 && palabras <= 800, `${g.id}: ${palabras} palabras`);
  }
});

test('la serie está cableada: tema, nombre, música y metadatos', () => {
  const vasija = leer('src/comun/vasija.tsx');
  assert.match(vasija, /serie === 'maories' \? 'kowhaiwhai'/);
  assert.match(vasija, /kowhaiwhai: \{ en: 'Māori Mythology', es: 'Mitología maorí' \}/);
  assert.match(vasija, /musica: 'musica\/maori\.wav'/);
  assert.ok(existsSync('public/musica/maori.wav'));
  assert.match(leer('scripts/motor-render.mjs'), /'maories' \? 'maori'/);
  assert.match(leer('scripts/youtube-meta.mjs'), /meta-youtube-maories\.json/);
  assert.match(leer('scripts/modal_render.py'), /"maories": "maori"/);
  assert.match(leer('scripts/buffer-tiktok.mjs'), /maories: '#maorimythology/);
  assert.match(leer('scripts/motor-revisar.mjs'), /FONDOS_MAORI/);
  for (const f of ['src/motor/Short.tsx', 'src/motor/ShortNativo.tsx', 'src/motor/VideoVertical.tsx', 'src/comun/miniatura.tsx', 'src/comun/portadaIG.tsx']) assert.match(leer(f), /kowhaiwhai/, f);
  const meta = JSON.parse(leer('src/videos/meta-youtube-maories.json'));
  assert.equal(meta.nombre.en, 'Māori Mythology');
});
