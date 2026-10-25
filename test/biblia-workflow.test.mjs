// El workflow de Learn Bible solo corre en el repo público, solo renderiza (nunca publica) y sube al release biblia.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const yml = readFileSync('.github/workflows/biblia.yml', 'utf8');

test('biblia.yml: solo en mitologias-render, release biblia, sin publicar en redes', () => {
  assert.match(yml, /if: github\.repository == 'matiasosuna\/mitologias-render'/);
  assert.match(yml, /gh release upload biblia .*--clobber/);
  assert.match(yml, /VOZ_EN: chatterbox/);
  assert.match(yml, /VOZ_TRANSPORTE: gh/); // voz por voz-cpu (GitHub), render en el runner
  assert.match(yml, /actions: write/);
  assert.doesNotMatch(yml, /modal run|MODAL_TOKEN|pip install -q modal/); // sin Modal (2026-10-25)
  assert.doesNotMatch(yml, /publicar|buffer|youtube-subir|instagram|tiktok/i);
});

test('ningún workflow usa Modal', () => {
  for (const w of ['biblia', 'laminas', 'prerender', 'voz-cpu', 'render']) assert.doesNotMatch(readFileSync(`.github/workflows/${w}.yml`, 'utf8'), /MODAL_TOKEN|modal run scripts\/modal_(voz|laminas)/, w);
  assert.match(readFileSync('.github/workflows/prerender.yml', 'utf8'), /^ +MODAL=0 /m);
});
