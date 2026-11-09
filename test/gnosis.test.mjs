// Gnosis (serie `gnosticas`, tema gnosis): los guiones usan solo fondos, elementos y elenco que existen, el Espíritu
// Invisible nunca es una persona, y la piel está cableada donde se elige tema (la música y la publicación las cablea
// la otra parte: scripts/motor-render.mjs, scripts/modal_render.py, cola, títulos…).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const leer = (f) => readFileSync(f, 'utf8');
const lista = (archivo, nombre) => (leer(archivo).match(new RegExp(`export const ${nombre} = \\[([^\\]]*)\\]`))?.[1] ?? '').match(/'(\w+)'/g).map((x) => x.slice(1, -1));
const FONDOS = new Set(lista('src/motor/fondosGnosis.tsx', 'FONDOS_GNOSIS'));
const ELEMS = new Set(lista('src/motor/fondosGnosis.tsx', 'ELEMENTOS_GNOSIS'));
const TXT_ELENCO = leer('src/motor/elencoGnosis.tsx').split('export const ELENCO_GNOSIS')[1].split('export const NOMBRE_EN_GNOSIS')[0];
const ELENCO = new Set([...TXT_ELENCO.matchAll(/^\s{2}(\w+): /gm)].map((m) => m[1]));
const GENERICOS = new Set(['sol', 'luna', 'estrellas', 'nube', 'trono', 'fogata', 'arbol', 'olivo', 'roca', 'casa', 'columna', 'templo', 'monte', 'lluvia', 'arca']);
const guiones = existsSync('src/videos') ? readdirSync('src/videos').filter((d) => d.startsWith('gnosticas-') && existsSync(`src/videos/${d}/guion.json`)).map((d) => JSON.parse(leer(`src/videos/${d}/guion.json`))) : [];
const persona = (k) => new RegExp(`^\\s{2}${k}: (H|M|luz|rey|NOE)\\b`, 'm').test(TXT_ELENCO);

test('la piel de Gnosis tiene los fondos y el elenco del plan', () => {
  for (const f of ['pleroma', 'eones', 'caos', 'nube_luz', 'cielos', 'materia', 'paraiso_falso', 'templo_jerusalen', 'tierra', 'diluvio']) assert.ok(FONDOS.has(f), `fondo ${f}`);
  for (const k of ['espiritu_invisible', 'salvador_oficial', 'aguila_luz', 'barbelo_oficial', 'autogeno_oficial', 'harmozel_oficial', 'oroiael_oficial', 'daveithai_oficial', 'eleleth_oficial',
    'sofia_oficial', 'yaldabaoth_oficial', 'arconte', 'adan_gnosis_oficial', 'eva_gnosis_oficial', 'epinoia_oficial', 'set_gnosis_oficial', 'noe_gnosis', 'juan_apostol_oficial', 'serpiente_paraiso',
    'athoth_oficial', 'eloaiou_oficial', 'astaphaios_oficial', 'yao_oficial', 'sabaoth_oficial', 'adonin_oficial', 'sabbede_oficial']) assert.ok(ELENCO.has(k), `elenco ${k}`);
  // los fondos con nombre propio tienen cielo y están en el tipo de Escena
  const tipos = leer('src/motor/tipos.ts');
  for (const f of FONDOS) assert.match(leer('src/motor/fondosGnosis.tsx'), new RegExp(`case '${f}'`), `fondo ${f} sin dibujo`);
  for (const f of FONDOS) assert.ok(tipos.includes(`'${f}'`), `tipos.ts: falta '${f}'`);
});

test('el Espíritu Invisible es solo luz y el Salvador no tiene rostro', () => {
  assert.match(TXT_ELENCO, /^\s{2}espiritu_invisible: D\(EspirituInvisible/m);
  for (const k of ['salvador_oficial', 'salvador_nino_oficial', 'salvador_anciano_oficial', 'salvador_servidor_oficial']) {
    const linea = TXT_ELENCO.split('\n').find((l) => l.startsWith(`  ${k}: `));
    assert.ok(linea && /\.\.\.SALVADOR/.test(linea) && /<CabezaLuz/.test(linea), `${k}: cabeza de luz`);
  }
  assert.match(leer('src/motor/elencoGnosis.tsx'), /const SALVADOR[^\n]*cabezaPropia: true/);
});

test('las claves del elenco no pisan las de otras series', () => {
  const otras = readdirSync('src/motor').filter((f) => /^elenco.*\.tsx$/.test(f) && f !== 'elencoGnosis.tsx').map((f) => leer(`src/motor/${f}`)).join('\n');
  for (const k of ELENCO) assert.ok(!new RegExp(`^\\s+'?${k}'?: `, 'm').test(otras), `${k} ya existe en otro elenco`);
});

test('cada guion de Gnosis usa fondos, elementos y elenco propios', () => {
  for (const g of guiones) {
    assert.equal(g.serie, 'gnosticas');
    for (const e of g.escenas) {
      assert.ok(FONDOS.has(e.fondo), `${g.id}/${e.id}: fondo ${e.fondo}`);
      for (const el of e.elementos ?? []) assert.ok(ELEMS.has(el.tipo) || GENERICOS.has(el.tipo), `${g.id}/${e.id}: elemento ${el.tipo}`);
      for (const a of e.actores ?? []) {
        assert.ok(ELENCO.has(a.como ?? a.id), `${g.id}/${e.id}: actor ${a.como ?? a.id}`);
        for (const p of a.pasos ?? []) if (p.en_que) assert.ok(ELENCO.has(p.en_que), `${g.id}/${e.id}: transforma en ${p.en_que}`);
      }
    }
    if (g.miniatura) for (const k of [g.miniatura.heroe, g.miniatura.rival].filter(Boolean)) assert.ok(persona(k) || k === 'yaldabaoth_oficial', `${g.id}: la miniatura necesita personas (${k})`);
  }
});

test('la piel está cableada: tema, nombre, música, fondos y elenco', () => {
  const vasija = leer('src/comun/vasija.tsx');
  assert.match(vasija, /serie === 'gnosticas' \? 'gnosis'/);
  assert.match(vasija, /gnosis: \{ en: 'Gnosis', es: 'Gnosis' \}/);
  assert.match(vasija, /musica: 'musica\/gnosis\.wav'/);
  assert.match(vasija, /TEMA\.nombre === 'gnosis' \? <GuardasGnosis/);
  assert.match(leer('src/motor/fondos.tsx'), /=== 'gnosis'\) \{ const n = fondoGnosis/);
  assert.match(leer('src/motor/fondos.tsx'), /=== 'gnosis'\) \{ const n = elementoGnosis/);
  assert.match(leer('src/motor/elenco.tsx'), /\.\.\.ELENCO_GNOSIS/);
  assert.match(leer('src/motor/elenco.tsx'), /\.\.\.NOMBRE_EN_GNOSIS/);
  assert.match(leer('lib/personajes-oficiales.mjs'), /gnosticas: 'elencoGnosis'/);
  assert.match(leer('scripts/motor-revisar.mjs'), /FONDOS_GNOSIS/);
  assert.match(leer('scripts/motor-revisar.mjs'), /g\.serie !== 'gnosticas'/);
  assert.ok(existsSync('scripts/musica-gnosis.mjs'));
  for (const f of ['src/comun/miniatura.tsx', 'src/comun/portadaIG.tsx', 'src/motor/Short.tsx', 'src/motor/ShortNativo.tsx', 'src/motor/VideoVertical.tsx', 'src/motor/VideoMotor.tsx']) assert.match(leer(f), /gnosis/, f);
});
