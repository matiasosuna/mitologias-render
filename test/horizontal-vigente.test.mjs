import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { horizontalVigente, huella, verificadoVigente } from '../scripts/nube.mjs';

test('horizontal con gancho: sirve solo si su huella es la del guion actual; sin gancho, como siempre', () => {
  const antes = process.cwd(), dir = mkdtempSync(join(tmpdir(), 'hv-'));
  process.chdir(dir);
  try {
    const guion = (id, g) => { mkdirSync(join('src/videos', id), { recursive: true }); writeFileSync(join('src/videos', id, 'guion.json'), JSON.stringify(g)); };
    const meta = (id, h) => { mkdirSync(join('out', id), { recursive: true }); writeFileSync(join('out', id, 'horizontal.json'), JSON.stringify({ huella: h })); };
    guion('sin-gancho', { titulo: 'x' });
    assert.equal(horizontalVigente('sin-gancho'), true);
    guion('con-gancho', { youtube: { gancho: { en: 'Ever wanted…' } } });
    meta('con-gancho', huella('con-gancho'));
    assert.equal(horizontalVigente('con-gancho'), true);
    meta('con-gancho', 'vieja');
    assert.equal(horizontalVigente('con-gancho'), false);
    guion('biblia-genesis-09', { youtube: { gancho: { en: 'Ever wanted…' } } });
    assert.equal(horizontalVigente('biblia-genesis-09'), true);
  } finally { process.chdir(antes); }
});

test('VERIFICADO de la Biblia vale solo con la huella del guion revisado', () => {
  const antes = process.cwd(), dir = mkdtempSync(join(tmpdir(), 'vv-'));
  process.chdir(dir);
  try {
    const d = join('src/videos', 'biblia-genesis-09'); mkdirSync(d, { recursive: true });
    writeFileSync(join(d, 'guion.json'), '{"a":1}');
    assert.equal(verificadoVigente('biblia-genesis-09'), false, 'sin marca');
    writeFileSync(join(d, 'VERIFICADO'), '');
    assert.equal(verificadoVigente('biblia-genesis-09'), false, 'marca vacía (vieja)');
    writeFileSync(join(d, 'VERIFICADO'), huella('biblia-genesis-09') + '\n');
    assert.equal(verificadoVigente('biblia-genesis-09'), true);
    writeFileSync(join(d, 'guion.json'), '{"a":2}');
    assert.equal(verificadoVigente('biblia-genesis-09'), false, 'el guion cambió después de revisar');
  } finally { process.chdir(antes); }
});
