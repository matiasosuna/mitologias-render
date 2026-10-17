// "Who is…?" horizontal (16:9, video normal de YouTube): timeline, puesta, título/lista/miniatura y su lugar en la cola.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { timelineHorizontal, escenaHorizontal, CARTEL_HORIZONTAL, FINAL_HORIZONTAL, tituloQuienHorizontal, listaQuien, MITOLOGIA_EN, miniaturaQuien } from '../lib/quien.mjs';
import { T } from '../lib/motor-tiempos.mjs';
import { NOMBRES } from '../scripts/titulos.mjs';
import { metaQuienHorizontal } from '../scripts/quien-meta.mjs';
import { horizontalTurno, claveHorizontal, entrada } from '../scripts/cola.mjs';
import { ARCHIVOS } from '../scripts/estado.mjs';

const J = (f) => JSON.parse(readFileSync(f, 'utf8'));
const ZEUS = 'short-griegas-quien-zeus';
const g = J(`src/videos/${ZEUS}/guion.json`), tl = J(`src/videos/${ZEUS}/timeline.json`);

test('timeline horizontal: misma voz, cartel de 2 s y pantalla final de 12 s', () => {
  const h = timelineHorizontal(tl), fps = tl.fps, extra = CARTEL_HORIZONTAL * fps - tl.cartelFrames;
  assert.equal(CARTEL_HORIZONTAL, 2);
  assert.equal(FINAL_HORIZONTAL, T.outro);
  assert.equal(h.cartelFrom, tl.cartelFrom);
  assert.equal(h.cartelFrames, 2 * fps);
  assert.equal(h.outroFrames, 12 * fps);
  assert.equal(h.total, tl.total - tl.outroFrames + extra + 12 * fps);
  assert.equal(h.escenas[0].from, tl.escenas[0].from, 'el cold open no se mueve');
  h.escenas.slice(1).forEach((e, i) => { assert.equal(e.from, tl.escenas[i + 1].from + extra); assert.deepEqual(e.frases, tl.escenas[i + 1].frases); });
  assert.ok(h.escenas[1].from >= h.cartelFrom + h.cartelFrames, 'la historia arranca después del cartel');
  assert.equal(h.escenas.at(-1).from + h.escenas.at(-1).durationInFrames, h.total - h.outroFrames);
});

test('puesta 16:9: el foco del Short queda en el centro, sin tocar el zoom', () => {
  const e = { id: 'x', fondo: 'monte', frases: [] };
  const e960 = { ...e, foco: 960 };
  assert.equal(escenaHorizontal(e960), e960);
  assert.deepEqual(escenaHorizontal({ ...e }), { ...e });
  assert.deepEqual(escenaHorizontal({ ...e, foco: 1200 }).camara, { de: 240, a: 240 });
  assert.deepEqual(escenaHorizontal({ ...e, foco: 860, camara: { de: 100, a: 500, zoom: [1, 1.1] } }).camara, { de: 0, a: 400, zoom: [1, 1.1] });
});

test('título, lista y miniatura', () => {
  assert.equal(tituloQuienHorizontal(g), 'Who is Zeus? | Greek Mythology');
  assert.equal(listaQuien('griegas'), "Greek Mythology: Who's Who");
  assert.equal(listaQuien('nordicas'), "Norse Mythology: Who's Who");
  assert.deepEqual(MITOLOGIA_EN, NOMBRES);
  const m = miniaturaQuien(g);
  assert.equal(m.titulo, 'WHO IS ZEUS?');
  assert.equal(m.heroe, 'zeus_oficial');
  assert.equal(m.rival, null);
  assert.equal(m.etiqueta, "GREEK · WHO'S WHO");
});

test('meta de YouTube: título del cartel, lista de la mitología y link al episodio', () => {
  const m = metaQuienHorizontal(g, { ids: { 'griegas-01-origen': 'abc123' }, titulos: { 'griegas-01-origen': { titulo: 'The Origin of the World | Greek Mythology S1E1' } } });
  assert.equal(m.titulo, 'Who is Zeus? | Greek Mythology');
  assert.equal(m.lista, "Greek Mythology: Who's Who");
  assert.match(m.descripcion, /^Who is Zeus\? King of the gods/);
  assert.match(m.descripcion, /The full story: The Origin of the World \| Greek Mythology S1E1\nhttps:\/\/youtu\.be\/abc123/);
  assert.ok(m.titulo.length <= 100 && m.descripcion.length < 5000);
  assert.ok(m.etiquetas.includes('who is zeus'));
});

test('todos los "Who is…?" tienen composición horizontal y un título que entra en YouTube', () => {
  const entrada = readFileSync('src/motor/entrada.tsx', 'utf8');
  assert.match(entrada, /formato === 'short' && \(guion as GuionVisual\)\.quien\)[\s\S]*-horizontal/);
  const quien = readdirSync('src/videos').filter((d) => /^short-[a-z]+-quien-/.test(d) && existsSync(`src/videos/${d}/timeline.json`));
  assert.ok(quien.length >= 4);
  for (const d of quien) {
    const gd = J(`src/videos/${d}/guion.json`), h = timelineHorizontal(J(`src/videos/${d}/timeline.json`));
    assert.ok(gd.quien, d);
    assert.ok(tituloQuienHorizontal(gd).length <= 100, d);
    assert.ok(h.escenas.every((e, i) => i === 0 || e.from >= h.escenas[i - 1].from + h.escenas[i - 1].durationInFrames), `${d}: escenas en orden`);
  }
});

test('cola: el horizontal sale en el turno de su Short (solo turnos "Who is…?"), y si no, el pendiente más viejo', () => {
  const cola = ['griegas-08-doce-olimpicos', 'short-griegas-quien-zeus', 'griegas-09-atenea', 'short-griegas-quien-hermes', 'short-griegas-dioses-60s'].map(entrada);
  const conHorizontal = (id) => /-quien-/.test(id);
  const base = { cola, conHorizontal, ytIds: {}, tieneYT: new Map() };
  assert.equal(horizontalTurno({ ...base, ids: ['short-griegas-quien-zeus'], clase: 'quien' }), 'short-griegas-quien-zeus');
  assert.equal(horizontalTurno({ ...base, ids: ['short-griegas-quien-zeus'], clase: 'episodio' }), null);
  assert.equal(horizontalTurno({ ...base, ids: ['short-griegas-dioses-60s'], clase: 'quien' }), null, 'sin `quien` no hay horizontal');
  // reintento: el Short ya está en YouTube y su horizontal no
  const tieneYT = new Map([['short-griegas-quien-zeus', 1], ['short-griegas-quien-hermes', 2]]);
  assert.equal(horizontalTurno({ ...base, tieneYT, ids: [], clase: 'quien' }), 'short-griegas-quien-zeus');
  assert.equal(horizontalTurno({ ...base, tieneYT, ytIds: { [claveHorizontal('short-griegas-quien-zeus')]: 'v1' }, ids: [], clase: 'quien' }), 'short-griegas-quien-hermes');
  assert.equal(horizontalTurno({ ...base, tieneYT, ytIds: { 'short-griegas-quien-zeus-horizontal': 'v1', 'short-griegas-quien-hermes-horizontal': 'v2' }, ids: [], clase: 'quien' }), null);
});

test('las listas de YouTube viajan en la rama estado (las "Who\'s Who" se crean en la nube)', () => {
  assert.equal(ARCHIVOS['listas.json'], 'src/videos/listas.json');
});
