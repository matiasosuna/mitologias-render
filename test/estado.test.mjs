import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fusionar } from '../scripts/estado.mjs';

const ESTADO = new URL('../scripts/estado.mjs', import.meta.url).pathname;

test('fusionar listas: unión sin repetir, conserva el orden de la base', () => {
  const a = [{ id: 'x', n: 1 }, { id: 'y' }], b = [{ id: 'y' }, { id: 'z' }];
  assert.deepEqual(fusionar(a, b), [{ id: 'x', n: 1 }, { id: 'y' }, { id: 'z' }]);
  assert.deepEqual(fusionar(undefined, b), b);
  assert.deepEqual(fusionar(a, undefined), a);
  assert.deepEqual(fusionar([{ id: 'q' }, { id: 'q' }], [{ id: 'q' }]), [{ id: 'q' }, { id: 'q' }]); // no borra nada de la base
});

test('fusionar objetos: claves de los dos lados, el segundo encima', () => {
  assert.deepEqual(fusionar({ a: '1', b: '2' }, { b: '3', c: '4' }), { a: '1', b: '3', c: '4' });
  assert.deepEqual(fusionar(undefined, { c: '4' }), { c: '4' });
});

test('subir y traer: ida y vuelta sin perder registros de ninguno de los dos lados', () => {
  const mac = mkdtempSync(join(tmpdir(), 'mac-')), nube = mkdtempSync(join(tmpdir(), 'nube-')), est = mkdtempSync(join(tmpdir(), 'est-'));
  for (const d of [mac, nube]) { mkdirSync(join(d, 'out')); mkdirSync(join(d, 'src/videos'), { recursive: true }); }
  writeFileSync(join(mac, 'out/subidas-api.json'), JSON.stringify([{ id: 'a', short: 'nativo' }]));
  writeFileSync(join(mac, 'out/subidas-instagram.json'), JSON.stringify([{ id: 'e1', tipo: 'reel-parte', parte: 1, de: 2 }]));
  writeFileSync(join(mac, 'out/subidas-buffer.json'), JSON.stringify([{ id: 'a', dueAt: 'x' }]));
  writeFileSync(join(mac, 'src/videos/youtube-ids.json'), JSON.stringify({ ep: 'E', especial: 'S' }));
  writeFileSync(join(mac, 'lista.txt'), 'a\nb\n');
  const correr = (cwd, ...a) => execFileSync('node', [ESTADO, ...a], { cwd });
  correr(mac, 'subir', est, 'lista.txt');
  assert.equal(readFileSync(join(est, 'shorts-orden.txt'), 'utf8'), 'a\nb\n');
  assert.equal(existsSync(join(est, '.env')), false);

  // la nube trae, publica algo y sube
  writeFileSync(join(nube, 'src/videos/youtube-ids.json'), JSON.stringify({ ep: 'E' }));
  correr(nube, 'traer', est);
  assert.equal(readFileSync(join(nube, 'out/shorts-orden.txt'), 'utf8'), 'a\nb\n');
  const api = JSON.parse(readFileSync(join(nube, 'out/subidas-api.json'), 'utf8'));
  api.push({ id: 'b', short: 'nativo' }); writeFileSync(join(nube, 'out/subidas-api.json'), JSON.stringify(api));
  writeFileSync(join(nube, 'src/videos/youtube-ids.json'), JSON.stringify({ ep: 'E', b: 'B' }));
  correr(nube, 'subir', est);

  // mientras tanto la Mac subió un especial; al traer quedan los dos
  writeFileSync(join(mac, 'src/videos/youtube-ids.json'), JSON.stringify({ ep: 'E', especial: 'S', especial2: 'S2' }));
  correr(mac, 'traer', est);
  assert.deepEqual(JSON.parse(readFileSync(join(mac, 'out/subidas-api.json'), 'utf8')).map((h) => h.id), ['a', 'b']);
  assert.deepEqual(JSON.parse(readFileSync(join(mac, 'src/videos/youtube-ids.json'), 'utf8')), { ep: 'E', especial: 'S', especial2: 'S2', b: 'B' });
  assert.equal(readFileSync(join(mac, 'out/shorts-orden.txt'), 'utf8'), 'a\nb\n');
});

test('intercalar: ronda por mitología, sin empezar por la última del orden', async () => {
  const { intercalar } = await import('../scripts/estado.mjs');
  const n = ['short-aztecas-a1', 'short-aztecas-a2', 'short-hindues-h1', 'short-hindues-h2', 'short-norteamericanas-n1'];
  assert.deepEqual(intercalar(n), ['short-aztecas-a1', 'short-hindues-h1', 'short-norteamericanas-n1', 'short-aztecas-a2', 'short-hindues-h2']);
  assert.deepEqual(intercalar(n, 'short-aztecas-viejo'), ['short-hindues-h1', 'short-norteamericanas-n1', 'short-aztecas-a1', 'short-hindues-h2', 'short-aztecas-a2']);
  assert.deepEqual(intercalar(['short-maories-x', 'short-maories-y'], 'short-maories-z'), ['short-maories-x', 'short-maories-y']);
});

test('agregarOrden: solo suma al final, sin repetir ni tocar lo que está', async () => {
  const { agregarOrden } = await import('../scripts/estado.mjs');
  const orden = ['short-griegas-a', 'short-nordicas-b'];
  assert.deepEqual(agregarOrden(orden, ['short-nordicas-b', 'short-aztecas-c', 'short-aztecas-c']), [...orden, 'short-aztecas-c']);
  assert.deepEqual(agregarOrden([], ['short-hindues-x']), ['short-hindues-x']);
});

test('subir no borra Shorts que agregó otro mientras tanto (copia vieja del workflow)', () => {
  const est = mkdtempSync(join(tmpdir(), 'est-')), nube = mkdtempSync(join(tmpdir(), 'wf-'));
  mkdirSync(join(nube, 'out'));
  const correr = (cwd, env, ...a) => execFileSync('node', [ESTADO, ...a], { cwd, env: { ...process.env, ...env } });
  writeFileSync(join(est, 'shorts-orden.txt'), 'short-griegas-a\nshort-nordicas-b\n');
  correr(nube, {}, 'traer', est);
  // la rutina agrega mientras el workflow publica
  writeFileSync(join(est, 'shorts-orden.txt'), 'short-griegas-a\nshort-nordicas-b\nshort-aztecas-c\n');
  correr(nube, {}, 'subir', est);
  assert.equal(readFileSync(join(est, 'shorts-orden.txt'), 'utf8'), 'short-griegas-a\nshort-nordicas-b\nshort-aztecas-c\n');
  // reordenar a mano sigue siendo posible, a propósito
  writeFileSync(join(nube, 'out/shorts-orden.txt'), 'short-nordicas-b\nshort-griegas-a\n');
  correr(nube, { ESTADO_REEMPLAZAR_ORDEN: '1' }, 'subir', est);
  assert.equal(readFileSync(join(est, 'shorts-orden.txt'), 'utf8'), 'short-nordicas-b\nshort-griegas-a\n');
});

test('agregar (CLI): rechaza ids sin guion y suma los válidos al final', () => {
  const est = mkdtempSync(join(tmpdir(), 'est-')), raiz = mkdtempSync(join(tmpdir(), 'raiz-'));
  mkdirSync(join(raiz, 'src/videos/short-aztecas-c'), { recursive: true });
  writeFileSync(join(raiz, 'src/videos/short-aztecas-c/guion.json'), '{}');
  writeFileSync(join(est, 'shorts-orden.txt'), 'short-griegas-a\n');
  assert.throws(() => execFileSync('node', [ESTADO, 'agregar', est, 'short-aztecas-c', 'short-aztecas-nada'], { cwd: raiz, stdio: 'pipe' }));
  assert.equal(readFileSync(join(est, 'shorts-orden.txt'), 'utf8'), 'short-griegas-a\n');
  execFileSync('node', [ESTADO, 'agregar', est, 'short-aztecas-c'], { cwd: raiz, stdio: 'pipe' });
  assert.equal(readFileSync(join(est, 'shorts-orden.txt'), 'utf8'), 'short-griegas-a\nshort-aztecas-c\n');
});

test('cola única: la rama manda el orden; lo nuevo de acá va al final (subir y traer)', async () => {
  const { fusionarCola, ARCHIVOS } = await import('../scripts/estado.mjs');
  assert.equal(ARCHIVOS['cola-unificada.json'], 'out/cola-unificada.json');
  const e = (id) => ({ id, tipo: 'episodio' });
  assert.deepEqual(fusionarCola([e('a'), e('b')], [e('b'), e('a'), e('c')]).map((x) => x.id), ['a', 'b', 'c']);
  assert.deepEqual(fusionarCola(undefined, [e('x')]).map((x) => x.id), ['x']);
  assert.deepEqual(fusionarCola([e('a')], undefined).map((x) => x.id), ['a']);
});
