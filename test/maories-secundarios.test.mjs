// Secundarios, extras y animales maoríes oficiales (elencoMaoriOficial.tsx): cobertura de la auditoría y reglas de estilo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (f) => readFileSync(f, 'utf8');
const mao = leer('src/motor/elencoMaoriOficial.tsx');
const bloque = mao.split('export const ELENCO_MAORI_OFICIAL')[1].split('export const NOMBRE_EN_MAORI_OFICIAL')[0];
const CLAVES = [...bloque.matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]);

const CON_NOMBRE = ['ika', 'maui_hermano', 'makeatutara', 'pepi_tikitiki', 'taranga', 'tawhaki', 'haumia', 'hine_titama', 'maui_joven', 'rata_toa', 'hakuturi', 'hema', 'hine_ahu_one', 'hoturapa', 'karihi', 'kuramarotini', 'mahuika', 'matakerepo', 'matuku_tangotango', 'maui_nino', 'muri_ranga_whenua', 'muturangi', 'rata', 'rata_nino', 'ruaumoko', 'tama_nui_ki_te_rangi', 'tangotango', 'tutewehiwehi', 'urutonga', 'wahieroa'];
const EXTRAS = ['kaumatua', 'tangata', 'wahine', 'tamaiti', 'kotiro', 'kuia', 'tohunga', 'toa', 'ponaturi', 'rangatira'];
const ANIMALES = ['kereru', 'tui', 'piwakawaka', 'weta', 'kuri', 'miromiro', 'piwakawaka_risa', 'riroriro', 'toutouwai', 'tuatara', 'wheke', 'kahu'];

test('cada personaje, extra y animal de la auditoría maorí tiene su *_oficial', () => {
  for (const k of [...CON_NOMBRE, ...EXTRAS, ...ANIMALES]) assert.ok(CLAVES.includes(`${k}_oficial`), `${k}_oficial`);
  assert.ok(CLAVES.length >= 10 + CON_NOMBRE.length + EXTRAS.length + ANIMALES.length);
});

test('claves únicas, sin pisar las viejas y sin tā moko ni piel de colores', () => {
  assert.equal(new Set(CLAVES).size, CLAVES.length);
  assert.ok(CLAVES.every((k) => k.endsWith('_oficial')));
  assert.doesNotMatch(mao, /<Moko|moko=/i);
  assert.doesNotMatch(mao, /piel: '#(3E6670|22386A|3E7A86|5A6A80|3A2E3E)'/);
});
