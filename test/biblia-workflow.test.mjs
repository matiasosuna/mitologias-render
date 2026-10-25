// El workflow de Learn Bible solo corre en el repo público, solo renderiza (nunca publica) y sube al release biblia.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const yml = readFileSync('.github/workflows/biblia.yml', 'utf8');

test('biblia.yml: solo en mitologias-render, release biblia, sin publicar en redes', () => {
  assert.match(yml, /if: github\.repository == 'matiasosuna\/mitologias-render'/);
  assert.match(yml, /gh release upload biblia .*--clobber/);
  assert.match(yml, /VOZ_EN: chatterbox/);
  assert.match(yml, /VOZ_TRANSPORTE: gh/); // voz por voz-cpu (que usa Modal familia)
  assert.match(yml, /actions: write/);
  assert.match(yml, /modal run scripts\/modal_render\.py/);
  assert.match(yml, /modal-gasto\.py/); // tope USD 29 (tarjeta de la mamá de Matías)
  assert.doesNotMatch(yml, /publicar|buffer|youtube-subir|instagram|tiktok/i);
});


test('biblia-github.yml: respaldo 100% GitHub, sin Modal', () => {
  const g = readFileSync('.github/workflows/biblia-github.yml', 'utf8');
  assert.match(g, /^name: biblia-github$/m);
  assert.doesNotMatch(g, /modal run|MODAL_TOKEN/);
  assert.doesNotMatch(g, /publicar|buffer|youtube-subir|instagram|tiktok/i);
});

test('voz-cpu.yml: VOZ_MOTOR=modal → Modal (familia) con la muestra descifrada; si no, CPU', () => {
  const v = readFileSync('.github/workflows/voz-cpu.yml', 'utf8');
  assert.match(v, /vars\.VOZ_MOTOR == 'modal'/);
  assert.match(v, /-out lib\/voz-matias-ref\.wav/);
  assert.match(v, /name: voz-\$\{\{ matrix\.clave \}\}-0/); // voz-github.mjs baja voz-<clave>-*
});

test('prerender: tope de gasto de Modal en USD 29', () => {
  const p = readFileSync('.github/workflows/prerender.yml', 'utf8');
  assert.match(p, /modal-gasto\.py/);
  assert.match(p, />= 29/);
});

test('modal_voz.py: muestra local montada si existe; si no, Volume moc-voz', () => {
  const py = readFileSync('scripts/modal_voz.py', 'utf8');
  assert.match(py, /Volume\.from_name\("moc-voz"/);
  assert.match(py, /if modal\.is_local\(\) and REF\.exists\(\)/);
});
