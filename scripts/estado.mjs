// Estado de las colas de publicación (registros + orden de los Shorts), compartido entre la Mac y GitHub Actions
// en la rama "estado" del repo público (publicar-render.sh no la toca). Los registros se FUSIONAN (unión), nunca se
// pisan: un registro de más evita publicar dos veces. Sin claves ni tokens.
// Lo usan scripts/estado-subir.sh y scripts/estado-traer.sh (desde la raíz del proyecto):
//   node scripts/estado.mjs subir <carpeta-estado> [lista]  → fusiona los archivos de acá en la carpeta
//   node scripts/estado.mjs traer <carpeta-estado>          → fusiona la carpeta en los archivos de acá
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

/** archivo en la rama estado → lugar en el proyecto */
export const ARCHIVOS = {
  'subidas-api.json': 'out/subidas-api.json',
  'subidas-instagram.json': 'out/subidas-instagram.json',
  'subidas-buffer.json': 'out/subidas-buffer.json',
  'youtube-ids.json': 'src/videos/youtube-ids.json',
  'miniaturas-youtube.json': 'out/miniaturas-youtube.json', // miniaturas pendientes por el límite de YouTube
  'turnos.json': 'out/turnos.json', // pasos ya hechos en cada turno (un 2.º cron del mismo turno no repite)
};
export const LISTA = 'out/shorts-orden.txt';

/** Unión: listas → base + lo que falte de `otro` (sin repetir); objetos → base con `otro` encima. */
export function fusionar(base, otro) {
  if (Array.isArray(base) || Array.isArray(otro)) {
    const a = base ?? [], vistos = new Set(a.map((x) => JSON.stringify(x)));
    return [...a, ...(otro ?? []).filter((x) => { const k = JSON.stringify(x); if (vistos.has(k)) return false; vistos.add(k); return true; })];
  }
  return { ...(base ?? {}), ...(otro ?? {}) };
}

const leer = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : undefined);
const escribir = (f, datos) => { mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, JSON.stringify(datos, null, f.endsWith('youtube-ids.json') ? 2 : 1)); };

export function subir(carpeta, lista = LISTA) {
  for (const [nombre, local] of Object.entries(ARCHIVOS)) {
    const aca = leer(local);
    if (aca !== undefined) escribir(join(carpeta, nombre), fusionar(leer(join(carpeta, nombre)), aca));
  }
  if (existsSync(lista)) copyFileSync(lista, join(carpeta, 'shorts-orden.txt'));
}

export function traer(carpeta) {
  for (const [nombre, local] of Object.entries(ARCHIVOS)) {
    const alla = leer(join(carpeta, nombre));
    if (alla !== undefined) escribir(local, fusionar(leer(local), alla));
  }
  if (existsSync(join(carpeta, 'shorts-orden.txt'))) { mkdirSync(dirname(LISTA), { recursive: true }); copyFileSync(join(carpeta, 'shorts-orden.txt'), LISTA); }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, carpeta, lista] = process.argv.slice(2);
  if (!carpeta || !existsSync(carpeta)) throw new Error('uso: node scripts/estado.mjs subir|traer <carpeta-estado> [lista]');
  if (cmd === 'subir') subir(carpeta, lista || LISTA);
  else if (cmd === 'traer') traer(carpeta);
  else throw new Error(`comando desconocido: ${cmd}`);
}
