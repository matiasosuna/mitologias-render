import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { timelineRapido, rutaRapida, filtroRapido, segundosEstimados, T_VERTICAL_RAPIDO } from '../lib/vertical-rapido.mjs';
import { cortes } from '../scripts/vertical-partes.mjs';
import { partesVigentes } from '../scripts/nube.mjs';

const FPS = 24;
const fr = (en, dur) => ({ texto: { es: 'x', en: 'x' }, audio: { en, es: en.replace('/en/', '/es/') }, from: 0, dur });
const lento = {
  fps: FPS, introFrames: 96, outroFrames: 288, total: 2000,
  escenas: [
    { id: 'a', from: 96, durationInFrames: 400, frases: [fr('audio/ep/en/a-0.wav', 100), fr('audio/ep/en/a-1.wav', 50)] },
    { id: 'b', from: 496, durationInFrames: 300, frases: [fr('audio/ep/en/b-0.wav', 80)] },
  ],
};
const medidos = { 'audio/ep/en-rapido/a-0.wav': 3, 'audio/ep/en-rapido/a-1.wav': 1.5, 'audio/ep/en-rapido/b-0.wav': 2.2 };

test('ruta del audio rápido: en/ → en-rapido/', () => {
  assert.equal(rutaRapida('audio/ep/en/a-0-1234abcd.wav'), 'audio/ep/en-rapido/a-0-1234abcd.wav');
});

test('filtro: de 0,9 (o sin registro) a 1,1 = atempo 1,222 y recorte de silencio en las puntas', () => {
  for (const prev of [undefined, 0.9]) {
    const af = filtroRapido(prev);
    assert.match(af, /^atempo=1\.222222,/);
    assert.equal((af.match(/silenceremove/g) ?? []).length, 2);
    assert.equal((af.match(/areverse/g) ?? []).length, 2);
  }
  assert.match(filtroRapido(1), /^atempo=1\.1,/);
  assert.equal(filtroRapido({ tempo: 1.1, recorte: true }), null);
});

test('timeline rápido: duración de cada frase = su audio rápido; 0,12 s entre frases y ~0,35 s entre escenas', () => {
  const r = timelineRapido(lento, (p) => medidos[p]);
  assert.equal(r.ritmo, 'rapido');
  assert.equal(r.introFrames, Math.round(T_VERTICAL_RAPIDO.intro * FPS));
  const [a, b] = r.escenas;
  assert.deepEqual(r.escenas.map((e) => e.id), ['a', 'b']);
  assert.deepEqual(a.frases.map((f) => f.dur), [72, 36]); // ceil(3·24), ceil(1,5·24)
  assert.equal(b.frases[0].dur, Math.ceil(2.2 * FPS));
  assert.equal(a.frases[1].from - (a.frases[0].from + a.frases[0].dur), 3); // 0,12 s
  const entreEscenas = b.from + b.frases[0].from - (a.from + a.frases[1].from + a.frases[1].dur);
  assert.ok(entreEscenas >= 8 && entreEscenas <= 9, `entre escenas ${entreEscenas} cuadros`); // 0,2 + 0,15 s
  assert.equal(a.from, r.introFrames);
  assert.equal(b.from, a.from + a.durationInFrames);
  // solo la voz rápida en inglés; el texto queda
  assert.deepEqual(a.frases[0].audio, { en: 'audio/ep/en-rapido/a-0.wav' });
  assert.deepEqual(a.frases[0].texto, lento.escenas[0].frases[0].texto);
  assert.equal(r.total - r.outroFrames, b.from + b.durationInFrames);
});

test('timeline rápido sin medir: estima desde la frase lenta (0,9 → 1,1)', () => {
  const r = timelineRapido(lento);
  assert.equal(r.escenas[0].frases[0].dur, Math.ceil(segundosEstimados(100 / FPS) * FPS));
  assert.ok(Math.abs(segundosEstimados(11) - 9) < 1e-9);
});

const ids = readdirSync('src/videos').filter((d) => /^[a-z]+-\d\d-/.test(d) && existsSync(`src/videos/${d}/timeline.json`));

test('episodios reales a ritmo rápido: más cortos, partes < 3 min sin huecos, cortes en escena/frase, nunca más partes', () => {
  for (const id of ids) {
    const t = JSON.parse(readFileSync(`src/videos/${id}/timeline.json`, 'utf8'));
    const r = timelineRapido(t); // estimado = cota de arriba (el recorte de silencio solo acorta)
    const vertical = (x) => x.total - x.outroFrames;
    assert.ok(vertical(r) < vertical(t) * 0.9, `${id}: ${vertical(r)} vs ${vertical(t)}`);
    assert.equal(r.escenas.reduce((n, e) => n + e.frases.length, 0), t.escenas.reduce((n, e) => n + e.frases.length, 0), id);
    const { total, partes } = cortes(r);
    assert.equal(partes[0][0], 0, id);
    assert.equal(partes.at(-1)[1], total, id);
    const inicios = new Set(r.escenas.flatMap((e) => [e.from, ...e.frases.map((f) => e.from + f.from)]));
    partes.forEach(([a, b], i) => {
      if (i > 0) { assert.equal(a, partes[i - 1][1], id); assert.ok(inicios.has(a), `${id}: corte en ${a}`); }
      assert.ok((b - a) / r.fps + 2 + 2.5 < 180, `${id} parte ${i + 1}: ${((b - a) / r.fps).toFixed(0)} s`);
    });
    assert.ok(partes.length <= cortes(t).partes.length, id);
  }
});

test('nube: partes viejas (ritmo lento) se rehacen, salvo que el episodio ya haya empezado en Instagram', () => {
  assert.equal(partesVigentes({ de: 2, gancho: true, ritmo: 'rapido' }, false), true);
  assert.equal(partesVigentes({ de: 3, gancho: true }, false), false);
  assert.equal(partesVigentes({ de: 3, gancho: true }, true), true);
  assert.equal(partesVigentes(null, true), false);
  // con el título actual: solo sirven las del mismo cartel (las de antes guardaban gancho: true)
  assert.equal(partesVigentes({ de: 2, gancho: 'The Jaguar Sun', ritmo: 'rapido' }, false, 'The Jaguar Sun'), true);
  assert.equal(partesVigentes({ de: 2, gancho: 'Viejo título', ritmo: 'rapido' }, false, 'The Jaguar Sun'), false);
  assert.equal(partesVigentes({ de: 2, gancho: true, ritmo: 'rapido' }, false, 'The Jaguar Sun'), false);
  assert.equal(partesVigentes({ de: 2, gancho: 'Viejo título', ritmo: 'rapido' }, true, 'The Jaguar Sun'), true);
});
