// Puesta en escena vertical: encuadre fijo por escena con todos los actores juntos (src/motor/puestaVertical.ts).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PASO, ANCHO, SUELO_V, TECHO, K_MIN, K_MAX, SEPARACION, medidaFicha, encuadreEscena,
  mapear, aPantalla, ubicarElemento, limitarRotulo, partirLineas, fondoX,
} from '../src/motor/puestaVertical.ts';

const PERSONA = medidaFicha({ tipo: 'persona', p: {} });
const LOBO = medidaFicha({ tipo: 'cuadrupedo', animal: 'lobo', p: { s: 1.8 } });
/** Pista sintética: actor parado (o moviéndose con `mover(f)`), visible en [desde, hasta). */
function pista(id, x, dur, o = {}) {
  const { capa = 'frente', medida = PERSONA, s = 1.12, izq = false, desde = 0, hasta = Infinity, mover, y = 790 } = o;
  return {
    id, capa, medida,
    muestras: Array.from({ length: Math.ceil(dur / PASO) }, (_, i) => { const f = i * PASO; return { f, x: mover ? mover(f) : x, y, s, vis: f >= desde && f < hasta, izq }; }),
  };
}
/** Caja en pantalla de un actor en una muestra. */
const caja = (enc, p, m) => {
  const X = aPantalla(mapear(enc, m.x), enc.K);
  return [X - (m.izq ? p.medida.der : p.medida.izq) * m.s * enc.K, X + (m.izq ? p.medida.izq : p.medida.der) * m.s * enc.K];
};
/** Todos los presentes dentro del cuadro en todo momento (ni por los costados ni por arriba). */
function todosAdentro(enc, pistas) {
  for (const p of pistas) for (const m of p.muestras) {
    if (!m.vis) continue;
    assert.ok(enc.ids.includes(p.id), `${p.id} no está en el encuadre`);
    const [a, b] = caja(enc, p, m);
    assert.ok(a >= -1 && b <= ANCHO + 1, `${p.id} afuera en f=${m.f}: ${Math.round(a)}…${Math.round(b)}`);
    assert.ok(SUELO_V - p.medida.alto * m.s * enc.K >= TECHO - 1, `${p.id} se sale por arriba`);
  }
}
/** Los que estaban separados en el guion no se enciman (los que se tocaban a propósito pueden seguir tocándose). */
function sinEncimarse(enc, pistas) {
  const n = pistas[0].muestras.length;
  for (let t = 0; t < n; t++) {
    const vis = pistas.filter((p) => p.muestras[t].vis).sort((a, b) => a.muestras[t].x - b.muestras[t].x);
    for (let k = 0; k + 1 < vis.length; k++) {
      const ma = vis[k].muestras[t], mb = vis[k + 1].muestras[t];
      const nec = (ma.izq ? vis[k].medida.izq : vis[k].medida.der) * ma.s + (mb.izq ? vis[k + 1].medida.der : vis[k + 1].medida.izq) * mb.s;
      const mov = (p) => Math.abs((p.muestras[Math.min(n - 1, t + 1)].x) - p.muestras[Math.max(0, t - 1)].x) >= 2;
      if (mov(vis[k]) || mov(vis[k + 1])) continue; // pasando caminando
      if (mb.x - ma.x < SEPARACION * nec) continue; // en el guion ya se tocaban a propósito (abrazo, mano en la boca…)
      const [, a1] = caja(enc, vis[k], vis[k].muestras[t]), [b0] = caja(enc, vis[k + 1], vis[k + 1].muestras[t]);
      // las cajas incluyen brazos y objetos: se permite que se rocen (1 − SEPARACION), los cuerpos quedan separados
      assert.ok(b0 - a1 >= -(1 - SEPARACION + 0.01) * (a1 - caja(enc, vis[k], ma)[0] + caja(enc, vis[k + 1], mb)[1] - b0) - 2, `${vis[k].id} y ${vis[k + 1].id} encimados (t=${t}): ${Math.round(a1)} > ${Math.round(b0)}`);
    }
  }
}

test('medidas: gigantes más grandes, serpientes largas cuentan solo la cabeza y el primer tramo', () => {
  const g = medidaFicha({ tipo: 'persona', p: { gigante: true } });
  assert.ok(g.alto > PERSONA.alto && g.der > PERSONA.der);
  const jor = medidaFicha({ tipo: 'serpiente', p: { largo: 900, grosor: 80, s: 1.3 } });
  assert.ok(jor.izq < 900 * 1.3 && jor.izq > 400);
  assert.ok(LOBO.izq + LOBO.der > 400);
});

test('dos personajes en los extremos del horizontal: los dos juntos en cuadro, como toma de lejos (más chicos que en el horizontal)', () => {
  const dur = 300, pistas = [pista('a', 250, dur), pista('b', 1650, dur, { izq: true })];
  const enc = encuadreEscena(pistas);
  assert.deepEqual(enc.ids, ['a', 'b']);
  assert.ok(enc.K >= 0.6 && enc.K <= K_MAX, `K=${enc.K}`);
  assert.ok(mapear(enc, 1650) - mapear(enc, 250) < 1400); // se acercaron
  todosAdentro(enc, pistas); sinEncimarse(enc, pistas);
  // mismo orden izquierda/derecha
  assert.ok(caja(enc, pistas[0], pistas[0].muestras[0])[0] < caja(enc, pistas[1], pistas[1].muestras[0])[0]);
});

test('un grupo de 4: todos adentro, cómodos, no más grandes que de a dos y nunca gigantes', () => {
  const dur = 300;
  const dos = encuadreEscena([pista('a', 400, dur), pista('b', 1500, dur, { izq: true })]);
  const pistas = [300, 700, 1150, 1600].map((x, i) => pista(`p${i}`, x, dur, { izq: i > 1 }));
  const enc = encuadreEscena(pistas);
  assert.equal(enc.ids.length, 4);
  assert.ok(enc.K <= dos.K && enc.K >= 0.55 && enc.K <= 0.77, `K=${enc.K}`);
  todosAdentro(enc, pistas); sinEncimarse(enc, pistas);
});

test('alguien que entra caminando y otro que aparece después: todos en el mismo encuadre, sin salirse', () => {
  const dur = 420;
  const pistas = [
    pista('tyr', 650, dur, { mover: (f) => 650 + Math.max(0, Math.min(1, (f - 100) / 200)) * 400 }),
    pista('lobo', 1450, dur, { izq: true, s: 1.23, medida: LOBO, desde: 150 }),
    pista('odin', 200, dur),
  ];
  const enc = encuadreEscena(pistas);
  todosAdentro(enc, pistas); sinEncimarse(enc, pistas);
});

test('quien entra desde fuera del horizontal llega por el borde (no achica a todos por eso)', () => {
  const dur = 300;
  const pistas = [pista('a', 600, dur), pista('b', 1200, dur, { izq: true, mover: (f) => Math.max(1200, 2100 - f * 6) })];
  const enc = encuadreEscena(pistas, [-120, 2040]);
  assert.ok(enc.K >= 0.45, `K=${enc.K}`);
  const [, b1] = caja(enc, pistas[1], pistas[1].muestras.at(-1));
  assert.ok(b1 <= ANCHO);
});

test('la escala respeta la capa de profundidad (los de fondo siguen más chicos)', () => {
  const dur = 120, pistas = [pista('a', 500, dur), pista('b', 1300, dur, { capa: 'fondo', s: 0.7, y: 740 })];
  const enc = encuadreEscena(pistas);
  todosAdentro(enc, pistas);
  const alto = (p) => p.medida.alto * p.muestras[0].s * enc.K;
  assert.ok(alto(pistas[1]) < alto(pistas[0]));
});

test('muchos (6) o muy anchos: se achican hasta entrar, nunca por debajo del mínimo si no hace falta', () => {
  const dur = 90, pistas = [100, 400, 750, 1100, 1450, 1800].map((x, i) => pista(`p${i}`, x, dur, { izq: i % 2 === 1 }));
  const enc = encuadreEscena(pistas);
  assert.ok(enc.K >= K_MIN && enc.K <= 0.72, `K=${enc.K}`);
  todosAdentro(enc, pistas); sinEncimarse(enc, pistas);
});

test('animalitos solos: un poco más grandes que la toma de lejos normal, dentro de los límites', () => {
  const rata = medidaFicha({ tipo: 'bichito', p: {} });
  const pistas = [pista('r', 900, 60, { medida: rata })];
  const enc = encuadreEscena(pistas);
  assert.ok(enc.K > 0.65 && enc.K <= K_MAX);
  todosAdentro(enc, pistas);
});

test('escena sin nadie a la vista: encuadre del lugar', () => {
  const enc = encuadreEscena([pista('a', 900, 120, { desde: 500 })]);
  assert.deepEqual(enc.ids, []);
  assert.ok(enc.K > 0 && Number.isFinite(enc.c));
});

test('cámara quieta: el encuadre es uno solo por escena (no depende del cuadro)', () => {
  const pistas = [pista('a', 300, 300, { mover: (f) => 300 + f }), pista('b', 1500, 300, { izq: true })];
  const e1 = encuadreEscena(pistas), e2 = encuadreEscena(pistas);
  assert.deepEqual(e1, e2);
  for (const k of ['K', 'c', 'pend']) assert.equal(typeof e1[k], 'number');
  // compresión monótona: nadie cambia de lado
  for (let x = -200; x < 2200; x += 50) assert.ok(mapear(e1, x + 50) >= mapear(e1, x));
  assert.equal(fondoX(e1.c), fondoX(e2.c));
});

test('elementos: afuera entran por el costado; adentro quedan donde están; nunca tapan a un actor ni quedan a medias', () => {
  const K = 1.2, borde = (lado) => 960 + lado * 540 / K; // x virtual del borde del cuadro
  const X = aPantalla(ubicarElemento(borde(-1) - 300, 130, K), K);
  assert.ok(X >= 0 && X <= ANCHO / 2, `X=${X}`);
  assert.equal(ubicarElemento(960, 130, K), 960);
  const est = 70, X4 = aPantalla(ubicarElemento(borde(1) - 10, est, K), K);
  assert.ok(X4 + est * K <= ANCHO, `estatua cortada: ${X4 + est * K}`);
  const asoma = aPantalla(ubicarElemento(borde(1), est, K, [[ANCHO - 250, ANCHO - 20]]), K);
  assert.ok(asoma - est * K >= ANCHO, `asoma=${asoma}`);
});

test('caminata larga: la compresión por tramos no achica a todos (los huecos vacíos se comprimen más)', () => {
  const dur = 600;
  const pistas = [
    pista('a', 300, dur), pista('b', 520, dur, { izq: true }),
    pista('c', 900, dur, { mover: (f) => 900 + Math.max(0, Math.min(1, (f - 200) / 300)) * 800 }),
  ];
  const enc = encuadreEscena(pistas);
  assert.ok(enc.K >= 0.45, `K=${enc.K}`);
  todosAdentro(enc, pistas); sinEncimarse(enc, pistas);
});

test('rótulos: el nombre entero dentro del cuadro; carteles en renglones', () => {
  for (const K of [0.7, 1, 1.4]) {
    const ancho = 300;
    assert.ok(aPantalla(limitarRotulo(-500, ancho, K) - ancho / 2, K) >= 0);
    assert.ok(aPantalla(limitarRotulo(5000, ancho, K) + ancho / 2, K) <= ANCHO);
  }
  assert.equal(limitarRotulo(960, 100, 1.5), 960);
  const l = partirLineas('MOUNTAIN ROOTS, BEAR SINEWS, FISH BREATH, BIRD SPITTLE', 22);
  assert.ok(l.length >= 2 && l.every((x) => x.length <= 22));
  assert.ok(Math.abs(fondoX(-3000)) <= 450 && fondoX(960) === 0);
});
