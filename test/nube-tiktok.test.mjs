// El turno de TikTok se colgaba ("unsettled top-level await", exit 13): buffer-tiktok.mjs hacía import('./nube.mjs') mientras
// nube.mjs (el programa principal) esperaba con un await de nivel superior → import circular que nunca termina.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepararTiktok } from '../scripts/buffer-tiktok.mjs';

test('un import circular del módulo principal cuelga el await (exit 13): por eso hay que pasar `rel`', () => {
  const d = mkdtempSync(join(tmpdir(), 'circ-'));
  writeFileSync(join(d, 'A.mjs'), "export const x = 1; await (await import('./B.mjs')).f();");
  writeFileSync(join(d, 'B.mjs'), "export async function f() { return (await import('./A.mjs')).x; }");
  assert.equal(spawnSync('node', [join(d, 'A.mjs')], { encoding: 'utf8' }).status, 13);
});

test('prepararTiktok usa el módulo `rel` recibido (no importa nube.mjs) y devuelve la URL', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'tk-'));
  const llamadas = [];
  const rel = {
    rutaLocal: (id, c) => join(dir, `${id}.${c}.mp4`),
    nombreAsset: (id, c) => `${id}.${c}.mp4`,
    bajar: (nombre, destino) => { llamadas.push(['bajar', nombre]); writeFileSync(destino, 'x'); return true; },
    publicarUrl: (ruta, nombre) => `https://ejemplo/${nombre}`,
  };
  assert.equal(await prepararTiktok('short-griegas-quien-zeus', rel), 'https://ejemplo/short-griegas-quien-zeus.tiktok.mp4');
  assert.deepEqual(llamadas, [['bajar', 'short-griegas-quien-zeus.tiktok.mp4']]);
});

test('nube.mjs le pasa su propio módulo a buffer-tiktok en el turno y en adelantar', () => {
  const src = readFileSync(new URL('../scripts/nube.mjs', import.meta.url), 'utf8');
  assert.match(src, /publicarTiktok\(id, \{ env, rel: yo \}\)/);
  assert.match(src, /prepararTiktok\(id, yo\)/);
});
