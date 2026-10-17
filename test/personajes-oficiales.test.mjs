// Pasaje de personajes viejos a los *_oficial (lib/personajes-oficiales.mjs): mapeo determinista, variantes repartidas, sin tocar publicados.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { clavesOficiales, resolver, aOficiales, parchear, publicados, GENERICOS, serieDe } from '../lib/personajes-oficiales.mjs';

const of = clavesOficiales();
const R = (serie, id, como, extra = {}) => resolver({ serie, dir: `${serie}-01-x`, id, como, oficiales: of, usadas: new Map(), ...extra });

test('todas las claves de GENERICOS existen como oficiales de su mitología', () => {
  for (const [s, m] of Object.entries(GENERICOS)) for (const vs of Object.values(m)) for (const x of vs) assert.ok(of[s].has(`${x}_oficial`), `${s}: ${x}`);
});

test('con nombre: por id, por clave propia y especiales', () => {
  assert.equal(R('griegas', 'leto', 'mujer'), 'leto_oficial');
  assert.equal(R('griegas', 'helios', undefined), 'helios_oficial');
  assert.equal(R('griegas', 'bebe', 'hefesto'), 'hefesto_nino_oficial');
  assert.equal(R('nordicas', 'grani', 'anciano'), 'hrossharsgrani_oficial');
  assert.equal(R('maories', 'rata', 'rata_toa'), 'rata_toa_oficial');
  assert.equal(R('egipcias', 'khonsu', 'ra'), 'khonsu_oficial');
  assert.equal(R('egipcias', 'anubis', 'egipcio', { dir: 'egipcias-15-dos-hermanos' }), 'anubis_hermano_oficial');
  assert.equal(R('egipcias', 'anubis', 'egipcio'), 'anubis_oficial');
});

test('genéricos por rol y cultura, con pistas de id', () => {
  assert.match(R('griegas', 'x', 'mujer'), /^mujer_griega/);
  assert.match(R('nordicas', 'x', 'vikingo'), /^vikingo_nordico/);
  assert.equal(R('egipcias', 'guardia1', 'egipcio').slice(0, 7), 'soldado');
  assert.equal(R('egipcias', 'viejo', 'faraon'), 'faraon_oficial'); // un faraón viejo sigue siendo faraón
  assert.equal(R('egipcias', 'rey', 'rey'), 'rey_extranjero_oficial');
  assert.equal(R('griegas', 'guerrero', 'guerrero', { rotulo: 'Persian' }), 'persa_oficial');
  assert.match(R('griegas', 'pirata', 'hombre'), /^pirata(_2)?_oficial$/);
});

test('sin equivalente: devuelve null y no inventa', () => {
  assert.equal(R('hindues', 'sabio', 'sabio'), null);
  assert.equal(R('aztecas', 'mexica', 'mexica'), null);
  assert.equal(R('nordicas', 'x', 'dragon'), null);
});

test('un grupo no sale clonado y es determinista', () => {
  const g = () => ({ escenas: [{ id: 'a', actores: ['h1', 'h2', 'h3'].map((id) => ({ id, como: 'hombre' })) }, { id: 'b', actores: [{ id: 'h1', como: 'hombre' }] }] });
  const a = g(), b = g();
  aOficiales(a, 'griegas-01-x', 'griegas', of); aOficiales(b, 'griegas-01-x', 'griegas', of);
  const k = a.escenas[0].actores.map((x) => x.como);
  assert.equal(new Set(k).size, 3);
  assert.deepEqual(a, b);
  assert.equal(a.escenas[1].actores[0].como, k[0]); // el mismo actor, la misma variante en toda la escena
});

test('es idempotente y respeta los gigantes (escala ≥ 1,4) y los ya oficiales', () => {
  const g = { escenas: [{ id: 'a', actores: [{ id: 'm', como: 'mujer', escala: 1.5 }, { id: 'n', como: 'mujer_griega_oficial' }, { id: 'o', como: 'mujer' }] }] };
  aOficiales(g, 'griegas-01-x', 'griegas', of);
  assert.equal(g.escenas[0].actores[0].como, 'mujer');
  assert.equal(g.escenas[0].actores[1].como, 'mujer_griega_oficial');
  assert.match(g.escenas[0].actores[2].como, /_oficial$/);
  assert.equal(aOficiales(g, 'griegas-01-x', 'griegas', of).cambios.length, 0);
});

test('parchear: edita el texto y encuentra también la transformación del mismo actor', () => {
  const txt = '{"escenas":[{"id":"a","actores":[{ "id": "hija", "como": "egipcia", "pasos": [{ "en_que": "reina_egipcia" }] },{ "id": "z", "x": 1 }]}]}';
  const cambios = [
    { tipo: 'como', id: 'hija', viejo: 'egipcia', nuevo: 'aldeana_egipcia_oficial', teniaComo: true },
    { tipo: 'en_que', id: 'hija', viejo: 'reina_egipcia', nuevo: 'reina_egipcia_oficial' },
    { tipo: 'como', id: 'z', viejo: 'z', nuevo: 'zeus_oficial', teniaComo: false },
  ];
  const g = JSON.parse(parchear(txt, cambios));
  assert.equal(g.escenas[0].actores[0].como, 'aldeana_egipcia_oficial');
  assert.equal(g.escenas[0].actores[0].pasos[0].en_que, 'reina_egipcia_oficial');
  assert.equal(g.escenas[0].actores[1].como, 'zeus_oficial');
});

test('guiones no publicados: ningún personaje queda con clave vieja que tenga equivalente; publicados intactos', () => {
  const pub = publicados();
  for (const d of readdirSync('src/videos')) {
    const f = `src/videos/${d}/guion.json`;
    if (!existsSync(f) || pub.has(d)) continue;
    const g = JSON.parse(readFileSync(f, 'utf8'));
    const { cambios } = aOficiales(g, d, serieDe(d), of);
    assert.equal(cambios.length, 0, `${d}: faltan ${cambios.length} cambios (correr scripts/personajes-oficiales.mjs --aplicar)`);
  }
  // los publicados no se tocan: sus claves vienen de antes (git no los modificó)
});
