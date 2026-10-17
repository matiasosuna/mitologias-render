import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolverLaminas } from '../scripts/laminas.mjs';

const A = { 'src/pruebas/a.tsx': '<Composition id="g-hoja" /><Composition id="g-fila" />', 'src/pruebas/b.tsx': '<Composition id="b-uno" /><Composition id="g-fila" />' };
test('encuentra el archivo de cada id', () => {
  assert.deepEqual(resolverLaminas(['g-hoja', ' b-uno '], A), [{ archivo: 'src/pruebas/a.tsx', id: 'g-hoja' }, { archivo: 'src/pruebas/b.tsx', id: 'b-uno' }]);
});
test('archivo:id explícito y errores claros', () => {
  assert.deepEqual(resolverLaminas(['b.tsx:g-fila'], A), [{ archivo: 'src/pruebas/b.tsx', id: 'g-fila' }]);
  assert.throws(() => resolverLaminas(['g-fila', 'nada'], A), /g-fila \(en 2 archivos.*nada/);
});
