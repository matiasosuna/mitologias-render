// Solo Instagram, horizontal (Matías 2026-11-24): formato, compuerta "claridad", arranque desde cero (E1 de cada serie),
// huella que no cambia al marcar, reinicio del registro con borrados.json y limpieza del release.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { FORMATOS, ACTIVAS, SERIE_HST, construirCola, planTurno, proximosSerie, entrada, esQuien } from '../scripts/cola.mjs';
import { listoPara, rotaCon, huella, sinClaridad, claro } from '../scripts/nube.mjs';
import { sinBorrados, fusionar } from '../scripts/estado.mjs';
import { clavesBorrar } from '../scripts/instagram-reiniciar.mjs';
import { borrables } from '../scripts/limpiar-media.mjs';

const raiz = new URL('../', import.meta.url).pathname;
const J = (f) => JSON.parse(readFileSync(raiz + f, 'utf8'));
const vacio = () => ({ youtube: new Map(), instagram: new Map(), tiktok: new Map() });
const E1 = { gnosticas: 'gnosticas-01-el-espiritu-invisible', biblia: 'biblia-genesis-01', griegas: 'griegas-01-origen', nordicas: 'nordicas-01-fuego-y-hielo', egipcias: 'egipcias-01-primer-monticulo', hawaianas: 'hawaianas-01-canto-de-la-noche' };

test('Instagram publica el episodio horizontal; es la única red activa', () => {
  assert.equal(FORMATOS.episodio.instagram, 'horizontal');
  assert.deepEqual(ACTIVAS, ['instagram']);
  assert.deepEqual(entrada('griegas-01-origen').formato.instagram, 'horizontal');
});

test('compuerta claridad: sin la marca el turno de la serie espera (no publica, no saltea, avisa cuál)', () => {
  const cola = ['griegas-01', 'griegas-02', 'nordicas-01'].map(entrada);
  const marcados = new Set(['griegas-02', 'nordicas-01']);
  const listo = listoPara('instagram', () => true, (id) => marcados.has(id));
  const p = (s, tiene = vacio()) => planTurno({ cola, tiene, plataforma: 'instagram', clase: `serie:${s}`, listo });
  assert.deepEqual(p('griegas').ids, [], 'griegas-01 sin claridad: nada, aunque griegas-02 esté marcado');
  assert.equal(p('griegas').espera, 'griegas-01');
  assert.deepEqual(p('nordicas').ids, ['nordicas-01']);
  assert.equal(p('nordicas').espera, null);
  marcados.add('griegas-01');
  assert.deepEqual(p('griegas').ids, ['griegas-01']);
  // los Shorts no llevan la marca; las otras redes no usan la compuerta
  assert.equal(listoPara('instagram', () => true, () => false)('short-griegas-quien-zeus'), true);
  assert.equal(listoPara('youtube', () => true, () => false)('griegas-01'), true);
});

test('claro(): solo con "claridad": true en el guion', () => {
  const antes = process.cwd(), dir = mkdtempSync(join(tmpdir(), 'cl-'));
  process.chdir(dir);
  try {
    const g = (id, o) => { mkdirSync(join('src/videos', id), { recursive: true }); writeFileSync(join('src/videos', id, 'guion.json'), JSON.stringify(o)); };
    g('a', { claridad: true }); g('b', { claridad: 'sí' }); g('c', {});
    assert.deepEqual(['a', 'b', 'c', 'no-existe'].map(claro), [true, false, false, false]);
  } finally { process.chdir(antes); }
});

test('marcar "claridad" no cambia la huella (no se re-renderiza el horizontal revisado ni cae el VERIFICADO)', () => {
  const guion = { id: 'x', serie: 'griegas', titulo: { en: 'A', es: 'B' }, escenas: [{ id: 'e', frases: [] }] };
  const conMarca = (o, donde) => { const e = Object.entries(o); e.splice(donde === 'primera' ? 0 : donde === 'medio' ? 2 : e.length, 0, ['claridad', true]); return Object.fromEntries(e); };
  for (const fmt of [(o) => JSON.stringify(o, null, 1), (o) => JSON.stringify(o, null, 2) + '\n', (o) => JSON.stringify(o)]) {
    for (const donde of ['primera', 'medio', 'ultima']) assert.equal(sinClaridad(fmt(conMarca(guion, donde))), fmt(guion), `${donde}: ${fmt(conMarca(guion, donde)).slice(0, 60)}`);
  }
  const antes = process.cwd(), dir = mkdtempSync(join(tmpdir(), 'hu-'));
  process.chdir(dir);
  try {
    const d = join('src/videos', 'griegas-01-x'); mkdirSync(d, { recursive: true });
    writeFileSync(join(d, 'guion.json'), JSON.stringify(guion, null, 1)); writeFileSync(join(d, 'timeline.json'), '{"total":1}');
    const h = huella('griegas-01-x');
    writeFileSync(join(d, 'guion.json'), JSON.stringify(conMarca(guion, 'ultima'), null, 1));
    assert.equal(huella('griegas-01-x'), h);
    writeFileSync(join(d, 'guion.json'), JSON.stringify({ ...conMarca(guion, 'ultima'), titulo: { en: 'Otro', es: 'B' } }, null, 1));
    assert.notEqual(huella('griegas-01-x'), h, 'cualquier otro cambio sí cambia la huella');
  } finally { process.chdir(antes); }
});

/** Cola como la real: T1 griega/nórdica/egipcia/hawaiana y especiales ya "subidos", el resto por CONTINUACION, con "Who is…?". */
function colaReal() {
  const titulos = J('src/videos/titulos.json');
  const ytIds = Object.fromEntries(Object.keys(titulos).filter((id) => titulos[id].especial || (titulos[id].temporada === 1 && /^(griegas|nordicas|egipcias|hawaianas)-/.test(id))).map((id) => [id, 'v']));
  return { titulos, cola: construirCola({ titulos, ytIds, quien: ['short-griegas-quien-zeus', 'short-nordicas-quien-odin', 'short-hawaianas-quien-pele'] }) };
}

test('registro de Instagram vacío: el turno de cada serie da su E1 (sin especiales ni "Who is…?")', () => {
  const { titulos, cola } = colaReal();
  const guardada = existsSync(raiz + 'out/cola-unificada.json') ? J('out/cola-unificada.json') : null;
  for (const c of [cola, guardada].filter(Boolean)) {
    const rota = rotaCon(titulos);
    const deTurno = Object.fromEntries(Object.values(SERIE_HST).map((s) => [s, planTurno({ cola: c, tiene: vacio(), plataforma: 'instagram', clase: `serie:${s}`, rota }).ids]));
    assert.deepEqual(deTurno, Object.fromEntries(Object.entries(E1).map(([s, id]) => [s, [id]])));
    const prox = proximosSerie({ cola: c, tiene: new Map(), rota, n: 2 });
    assert.deepEqual(prox.slice(0, 6).sort(), Object.values(E1).sort(), 'adelantar: primero el E1 de cada serie');
    assert.ok(prox.every((id) => !esQuien(id) && !titulos[id]?.especial), prox.join(' '));
    assert.ok(c.some((e) => e.id === 'hawaianas-99-milu'), 'el especial está en la cola, pero no entra en la rotación');
  }
});

test('adelantar: los próximos de cada serie que le faltan a Instagram, en orden', () => {
  const cola = ['griegas-01', 'griegas-02', 'griegas-03', 'nordicas-01', 'short-griegas-quien-zeus', 'nordicas-02'].map(entrada);
  const tiene = new Map([['griegas-01', 0]]);
  assert.deepEqual(proximosSerie({ cola, tiene, n: 2 }), ['griegas-02', 'nordicas-01', 'griegas-03', 'nordicas-02']);
  assert.deepEqual(proximosSerie({ cola, tiene, n: 1, listo: (id) => id !== 'griegas-02' }), ['nordicas-01']);
});

test('reiniciar Instagram: con borrados.json el registro queda vacío aunque una copia vieja lo vuelva a traer', () => {
  const reg = [{ id: 'griegas-01-origen', tipo: 'reel-episodio', media: '111', permalink: 'p1' }, { id: 'nordicas-01-fuego-y-hielo', tipo: 'reel-episodio', permalink: 'p2' }, { id: 'x', media: '111' }];
  const nuevas = clavesBorrar(reg, ['999']);
  assert.deepEqual(nuevas, ['111', 'p2']);
  const borrados = ['999', ...nuevas];
  // la rama tiene el registro viejo y acá quedó []: la unión lo vuelve a traer, sinBorrados lo saca
  assert.deepEqual(sinBorrados('subidas-instagram.json', fusionar(reg, []), borrados), []);
  assert.deepEqual(sinBorrados('subidas-instagram.json', fusionar(reg, [{ id: 'griegas-01-origen', media: '222' }]), borrados), [{ id: 'griegas-01-origen', media: '222' }], 'el Reel nuevo (otro media) queda');
});

test('limpiar-media: con YouTube y TikTok parados no borra lo que Instagram todavía necesita', () => {
  const viejo = Date.parse('2026-11-01T00:00:00Z'), ahora = Date.parse('2026-11-24T00:00:00Z');
  const assets = [{ id: 1, nombre: 'griegas-01-origen.horizontal.mp4', release: 'media' }, { id: 2, nombre: 'griegas-02-prometeo.horizontal.mp4', release: 'media' }];
  const tiene = { youtube: new Map([['griegas-01-origen', viejo], ['griegas-02-prometeo', viejo]]), instagram: new Map([['griegas-02-prometeo', viejo]]), tiktok: new Map([['griegas-02-prometeo', viejo]]) };
  assert.deepEqual(borrables({ assets, tiene, ahora }).map((a) => a.id), [2], 'solo lo que ya tienen las 3 (Instagram incluida)');
  assert.deepEqual(borrables({ assets, tiene: { ...tiene, instagram: new Map() }, ahora }), [], 'registro de Instagram vacío: no se borra nada');
});
