// Diseños oficiales hawaianos y maoríes (elencoHawaianoOficial.tsx, elencoMaoriOficial.tsx): claves, cableado y reglas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const leer = (f) => readFileSync(f, 'utf8');
const claves = (txt, n) => [...txt.split(`export const ELENCO_${n}`)[1].split(`export const NOMBRE_EN_${n}`)[0].matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]);
const haw = leer('src/motor/elencoHawaianoOficial.tsx'), mao = leer('src/motor/elencoMaoriOficial.tsx');
const H = claves(haw, 'HAWAIANO_OFICIAL'), M = claves(mao, 'MAORI_OFICIAL');
const general = leer('src/motor/elenco.tsx');

test('están todos los personajes pedidos', () => {
  for (const k of ['pele', 'hiiaka', 'maui', 'kane', 'kanaloa', 'ku', 'lono', 'hina', 'poliahu', 'kamapuaa']) assert.ok(H.includes(`${k}_oficial`), k);
  for (const k of ['ranginui', 'papatuanuku', 'tane', 'tangaroa', 'tawhirimatea', 'tumatauenga', 'maui_tikitiki', 'hine_nui_te_po', 'rongo', 'kupe']) assert.ok(M.includes(`${k}_oficial`), k);
});

test('cableado: elenco, nombres en inglés y motor-revisar', () => {
  for (const n of ['HAWAIANO_OFICIAL', 'MAORI_OFICIAL']) { assert.match(general, new RegExp(`\\.\\.\\.ELENCO_${n}\\b`)); assert.match(general, new RegExp(`\\.\\.\\.NOMBRE_EN_${n}\\b`)); }
  const rev = leer('scripts/motor-revisar.mjs');
  assert.match(rev, /elencoHawaianoOficial/); assert.match(rev, /elencoMaoriOficial/);
});

test('las claves viejas siguen intactas en sus archivos', () => {
  for (const k of ['pele', 'hiiaka', 'maui', 'kane', 'kanaloa', 'ku', 'lono', 'hina', 'poliahu', 'kamapuaa']) assert.match(general, new RegExp(`^ {2}${k}: [hm]\\(`, 'm'), k);
  const viejo = leer('src/motor/elencoMaori.tsx');
  for (const k of ['ranginui', 'papatuanuku', 'tane', 'tangaroa', 'tawhirimatea', 'tumatauenga', 'maui_tikitiki', 'hine_nui_te_po', 'rongo', 'kupe']) assert.match(viejo, new RegExp(`^ {2}${k}: [HM]\\(`, 'm'), k);
});

test('las claves no chocan con ningún otro elenco', () => {
  const otras = new Set();
  for (const f of readdirSync('src/motor').filter((f) => /^elenco\w*\.tsx$/.test(f) && !/^elenco(Hawaiano|Maori)Oficial\.tsx$/.test(f))) {
    const t = leer(`src/motor/${f}`);
    for (const m of t.matchAll(/^\s{2}(\w+): /gm)) otras.add(m[1]);
  }
  assert.deepEqual([...H, ...M].filter((k) => otras.has(k)), []);
  assert.equal(new Set([...H, ...M]).size, H.length + M.length);
});

test('reglas de estilo: piel natural, sin tā moko, Māui maorí distinto del hawaiano', () => {
  for (const t of [haw, mao]) { assert.doesNotMatch(t, /piel: '#(3E6670|22386A|3E7A86|5A6A80|3A2E3E)'/); assert.doesNotMatch(t, /<Moko|moko=/i); }
  const mauiH = haw.split('maui_oficial:')[1].split('\n  //')[0], mauiM = mao.split('maui_tikitiki_oficial:')[1].split('\n  //')[0];
  assert.match(mauiH, /Manaiakalani/); assert.doesNotMatch(mauiH, /Tikitiki/);
  assert.match(mauiM, /AnzueloQuijada/); assert.match(mauiM, /Tikitiki/); assert.match(mauiM, /Piupiu/);
});
