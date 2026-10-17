// Encuadre del horizontal con los tamaños reales (src/motor/encuadreHorizontal.ts) y revisor de guiones pendientes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { ajusteHorizontal, revisarHorizontal, cajaPantalla, tapado, TECHO_H, K_AJ_MIN, K_SOLAPE_MIN } from '../src/motor/encuadreHorizontal.ts';
import { medidaFicha } from '../src/motor/puestaVertical.ts';

const pista = (id, x, o = {}) => {
  const { medida = medidaFicha({ tipo: 'persona', p: {} }), y = 790, s = 1.12, ajustable = false } = o;
  return { id, capa: 'frente', medida, ajustable, muestras: Array.from({ length: 20 }, (_, i) => ({ f: i * 3, x, y, s, vis: true, izq: false })) };
};
const PEGASO = medidaFicha({ tipo: 'dibujo', p: { alto: 820, izq: 330, der: 260 } });

test('medidaFicha: dibujo con alto usa su alto e izq/der; sin alto, la caja chica de siempre', () => {
  assert.deepEqual(PEGASO, { izq: 330, der: 260, alto: 820 });
  assert.deepEqual(medidaFicha({ tipo: 'dibujo', p: {} }), { izq: 100, der: 100, alto: 200 });
  assert.equal(medidaFicha({ tipo: 'dibujo', p: { alto: 400, s: 0.5 } }).alto, 200);
});

test('un animal gigante se achica hasta entrar bajo la franja del rótulo (con el zoom máximo)', () => {
  const ps = [pista('pegaso', 900, { medida: PEGASO, ajustable: true })], cam = { zoom: [1, 1.06] };
  const aj = ajusteHorizontal(ps, cam, 60);
  assert.ok(aj.pegaso.k < 1 && aj.pegaso.k >= K_AJ_MIN);
  const top = Math.min(...ps[0].muestras.map((m) => cajaPantalla(ps[0], m, aj.pegaso, cam, 60)[1]));
  assert.ok(top >= TECHO_H - 1, `top ${top}`);
  assert.equal(revisarHorizontal(ps, cam, 60, aj).filter((a) => a.tipo === 'arriba').length, 0);
});

test('los personajes y animales viejos no se tocan (solo los que tienen alto propio)', () => {
  const ps = [pista('gigante', 900, { medida: { izq: 100, der: 100, alto: 900 } })];
  assert.deepEqual(ajusteHorizontal(ps, {}, 60).gigante, { k: 1, dy: 0 });
});

test('un volador alto se achica y se baja para que la punta del ala no pase el techo', () => {
  const aguila = medidaFicha({ tipo: 'dibujo', p: { alto: 360, izq: 380, der: 380 } });
  const ps = [pista('aguila', 960, { medida: aguila, y: 250, ajustable: true })];
  const aj = ajusteHorizontal(ps, { zoom: [1, 1] }, 60);
  assert.ok(aj.aguila.dy > 0);
  assert.ok(250 + aj.aguila.dy - 360 * 1.12 * aj.aguila.k >= TECHO_H - 1);
});

test('si tapa a otro actor se achica, pero no más que K_SOLAPE_MIN', () => {
  const toro = medidaFicha({ tipo: 'dibujo', p: { alto: 470, izq: 300, der: 300 } });
  const ps = [pista('toro', 900, { medida: toro, ajustable: true }), pista('hombre', 1050)];
  const aj = ajusteHorizontal(ps, { zoom: [1, 1] }, 60);
  assert.ok(aj.toro.k < 1 && aj.toro.k >= K_SOLAPE_MIN - 1e-9);
  assert.equal(aj.hombre.k, 1);
  assert.ok(tapado([0, 0, 10, 10], [5, 5, 20, 20]) === 0.5 && tapado([0, 0, 1, 1], [2, 2, 3, 3]) === 0);
});

test('revisor: los guiones pendientes no dejan ningún animal grande fuera de cuadro', () => {
  const r = spawnSync('node', ['scripts/revisar-encuadre.mjs', '--json'], { encoding: 'utf8', maxBuffer: 64e6 });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(JSON.parse(r.stdout).graves, 0);
});

test('revisor --epicos: con los animales épicos en los guiones griegos, el motor los ajusta', () => {
  const r = spawnSync('node', ['scripts/revisar-encuadre.mjs', '--epicos', '--todos', '--json'], { encoding: 'utf8', maxBuffer: 64e6 });
  const d = JSON.parse(r.stdout);
  assert.ok(d.escenas.filter((e) => Object.keys(e.ajustes).length).length >= 20);
});

test('las constantes copiadas coinciden con puestaVertical.ts', async () => {
  const pv = await import('../src/motor/puestaVertical.ts');
  const { readFileSync } = await import('node:fs');
  const src = readFileSync('src/motor/encuadreHorizontal.ts', 'utf8');
  assert.match(src, new RegExp(`SUELO = ${pv.SUELO_MUNDO}, ARRIBA = ${pv.ARRIBA_MUNDO}, ANCHO = ${pv.ANCHO}, SUELO_V = ${pv.SUELO_V}, TECHO = ${pv.TECHO};`));
});

test('si sigue tapando y está quieto, el animal se corre de costado (como mucho DX_MAX)', async () => {
  const { DX_MAX } = await import('../src/motor/encuadreHorizontal.ts');
  const toro = medidaFicha({ tipo: 'dibujo', p: { alto: 470, izq: 300, der: 300 } });
  const ps = [pista('toro', 1000, { medida: toro, ajustable: true }), pista('hombre', 900)];
  const aj = ajusteHorizontal(ps, { zoom: [1, 1] }, 60);
  assert.ok(aj.toro.dx > 0 && aj.toro.dx <= DX_MAX, `dx ${aj.toro.dx}`);
});

test('animales épicos: mapeo por mitología, el id manda (vaca1 con como toro) y el caballo de Troya no se toca', async () => {
  const { aEpicos, parchear, MAPA } = await import('../lib/animales-epicos.mjs');
  const g = { escenas: [{ id: 'e', actores: [
    { id: 'caballo', x: 1 }, { id: 'vaca1', como: 'toro', x: 2 }, { id: 'troya', como: 'caballo', escala: 1.5, x: 3 },
    { id: 'p', como: 'hombre', x: 4, pasos: [{ en: 1, hace: 'transforma', en_que: 'delfin' }] },
  ] }] };
  const txt = JSON.stringify(g, null, 2);
  const c = aEpicos(g, 'griegas', (k) => (k === 'caballo_griego_oficial' ? 'HORSE' : ''));
  assert.equal(g.escenas[0].actores[0].como, MAPA.griegas.caballo);
  assert.equal(g.escenas[0].actores[0].rotulo, ''); // antes no tenía nombre: sigue sin nombre
  assert.equal(g.escenas[0].actores[1].como, 'vaca_griega_oficial');
  assert.equal(g.escenas[0].actores[2].como, 'caballo');
  assert.equal(g.escenas[0].actores[3].pasos[0].en_que, 'delfin_griego_oficial');
  assert.deepEqual(JSON.parse(parchear(txt, c)), g);
  assert.equal(aEpicos({ escenas: [{ id: 'e', actores: [{ id: 'caballo', x: 1 }] }] }, 'balinesas').length, 0);
});

test('una persona oficial gigante se achica para no tapar el cartel de arriba; una común no', () => {
  const gigante = medidaFicha({ tipo: 'persona', p: { gigante: true } }), cam = { zoom: [1, 1.08] };
  const ps = [{ ...pista('g', 900, { medida: gigante }), oficial: true }, pista('v', 300, { medida: gigante })];
  const aj = ajusteHorizontal(ps, cam, 60);
  const top = Math.min(...ps[0].muestras.map((m) => cajaPantalla(ps[0], m, aj.g, cam, 60)[1]));
  assert.ok(aj.g.k < 1 && aj.g.k >= K_AJ_MIN && top >= 249, `k ${aj.g.k} top ${top}`);
  assert.equal(aj.v.k, 1);
});
