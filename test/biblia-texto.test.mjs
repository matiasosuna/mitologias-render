import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Learn Bible 777: la narración del capítulo es la KJV tal cual, completa, sin saltear nada.
const dir = 'src/videos';
const norm = (s) => s.replace(/\s+/g, ' ').trim();
for (const id of fs.readdirSync(dir).filter((d) => d.startsWith('biblia-'))) {
  const kjvPath = path.join(dir, id, 'kjv.json');
  if (!fs.existsSync(kjvPath)) continue;
  test(`${id}: narra el texto KJV completo y literal`, () => {
    const g = JSON.parse(fs.readFileSync(path.join(dir, id, 'guion.json'), 'utf8'));
    const kjv = norm(JSON.parse(fs.readFileSync(kjvPath, 'utf8')).verses.map((v) => v.text).join(' '));
    const todo = norm(g.escenas.flatMap((e) => e.frases.map((f) => f.en)).join(' '));
    assert.ok(todo.includes(kjv), 'falta texto o hay palabras cambiadas entre los versículos');
  });
}

test('Génesis 1 tiene "In the original" sin pronunciar el nombre YHWH', () => {
  const g = JSON.parse(fs.readFileSync('src/videos/biblia-genesis-01/guion.json', 'utf8'));
  assert.ok(g.escenas.some((e) => e.id === 'original'));
  assert.doesNotMatch(JSON.stringify(g), /jehovah|yahweh|jehová/i);
});
