// El workflow de Learn Bible solo corre en el repo público, solo renderiza (nunca publica) y sube al release biblia.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const yml = readFileSync('.github/workflows/biblia.yml', 'utf8');

test('biblia.yml: solo en mitologias-render, release biblia, sin publicar en redes', () => {
  assert.match(yml, /if: github\.repository == 'matiasosuna\/mitologias-render'/);
  assert.match(yml, /gh release upload biblia .*--clobber/);
  assert.match(yml, /VOZ_EN: chatterbox/);
  assert.match(yml, /modal run scripts\/modal_render\.py/);
  assert.doesNotMatch(yml, /publicar|buffer|youtube-subir|instagram|tiktok/i);
});

test('modal_voz.py: en la nube la muestra de voz sale del Volume privado moc-voz', () => {
  const py = readFileSync('scripts/modal_voz.py', 'utf8');
  assert.match(py, /Volume\.from_name\("moc-voz"/);
  assert.match(py, /if modal\.is_local\(\) and REF\.exists\(\)/);
});
