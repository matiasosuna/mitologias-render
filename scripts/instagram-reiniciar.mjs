// Instagram desde cero (Matías 2026-11-24: solo Instagram, horizontal): los Reels de antes ya no están en @mythsonclay, pero
// out/subidas-instagram.json (rama "estado") los sigue listando y la cola los daría por publicados.
// Usa el mecanismo de siempre para lo borrado (scripts/estado.mjs › sinBorrados): suma el media (o el permalink) de cada
// registro a out/borrados.json, así la fusión por unión con la rama o con una copia vieja (la Mac) no los vuelve a traer.
// Antes deja el respaldo en out/subidas-instagram-<fecha>-borrados.json; el registro queda en [].
// Uso (con el estado traído; lo corre el workflow publicar con el input reiniciar_ig):
//   scripts/estado-traer.sh && node scripts/instagram-reiniciar.mjs [--probar] && scripts/estado-subir.sh
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** Lo que hay que sumar a borrados.json para que sinBorrados saque todo el registro (sin repetir lo que ya está). */
export function clavesBorrar(registro, borrados = []) {
  const ya = new Set(borrados), out = [];
  for (const r of registro) {
    const k = r.media ?? r.permalink;
    if (k && !ya.has(k)) { ya.add(k); out.push(k); }
  }
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.chdir(new URL('..', import.meta.url).pathname);
  const IG = 'out/subidas-instagram.json', BORRADOS = 'out/borrados.json';
  const leer = (f, def) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : def);
  if (!existsSync(IG)) throw new Error(`falta ${IG}: primero scripts/estado-traer.sh`);
  const reg = leer(IG, []), borrados = leer(BORRADOS, []);
  if (!reg.length) { console.log('Instagram: el registro ya está vacío; nada que reiniciar'); process.exit(0); }
  const sinClave = reg.filter((r) => !r.media && !r.permalink);
  if (sinClave.length) throw new Error(`${sinClave.length} registros sin media ni permalink (no se pueden marcar como borrados): ${sinClave.slice(0, 3).map((r) => r.id).join(' ')}`);
  const nuevas = clavesBorrar(reg, borrados);
  const resp = `out/subidas-instagram-${new Date().toISOString().slice(0, 10)}-borrados.json`;
  console.log(`Instagram: ${reg.length} registros → respaldo ${resp}; ${nuevas.length} media nuevos a ${BORRADOS}; registro en []`);
  if (process.argv.includes('--probar')) process.exit(0);
  const previo = leer(resp, []); // si se corre dos veces el mismo día, se suma (no se pisa el respaldo)
  writeFileSync(resp, JSON.stringify([...previo, ...reg.filter((r) => !previo.some((p) => JSON.stringify(p) === JSON.stringify(r)))], null, 1));
  writeFileSync(BORRADOS, JSON.stringify([...borrados, ...nuevas], null, 1));
  writeFileSync(IG, '[]');
}
