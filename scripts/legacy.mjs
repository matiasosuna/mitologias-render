// Personajes "viejos" en un guion: actores con nombre propio cuyo diseño oficial (<clave>_oficial) ya existe pero el guion
// sigue usando la clave vieja (conversión de secundarios pendiente de aprobación). Los animales y genéricos no cuentan.
import { readFileSync, readdirSync } from 'node:fs';

/** Claves *_oficial de todos los src/motor/elenco*Oficial.tsx (y elencoNordico/Egipcio). */
export function clavesOficiales(dir = 'src/motor') {
  const s = new Set();
  for (const f of readdirSync(dir).filter((x) => /^elenco\w*\.tsx$/.test(x))) for (const m of readFileSync(`${dir}/${f}`, 'utf8').matchAll(/^\s{2}(\w+_oficial): /gm)) s.add(m[1]);
  return s;
}
/** Ids de actores del guion que son viejos (tienen `<id>_oficial` pero el guion no lo usa). */
export function clavesLegacy(guion, oficiales) {
  const ids = new Set();
  for (const e of guion.escenas ?? []) for (const a of e.actores ?? []) ids.add(a.id);
  return [...ids].filter((id) => id && !id.endsWith('_oficial') && oficiales.has(`${id}_oficial`)).sort();
}

import { readFileSync as _leer } from 'node:fs';
import { aEpicos } from '../lib/animales-epicos.mjs';
import { MINIS, MINIS_IG } from '../lib/minis.mjs';
import { viejosMini } from '../lib/miniaturas-oficiales.mjs';
import { aOficiales, serieDe as _serieDe, clavesOficiales as _clavesPorSerie } from '../lib/personajes-oficiales.mjs';

/** Claves viejas que todavía tienen equivalente oficial/épico (lo que scripts/personajes-oficiales.mjs y animales-epicos.mjs convertirían).
 *  Lista vacía = el guion usa solo diseños nuevos donde existen. Es la guarda de prerender: no sube renders con diseños viejos. */
export function viejosDe(id, guion, oficiales = _clavesPorSerie()) {
  const g = structuredClone(guion), serie = _serieDe(id);
  // también los personajes de la portada/miniatura (guion.miniatura o MINIS/MINIS_IG): son la tarjeta de portada que lleva cada
  // vertical/parte/TikTok, la portada-ig, la tapa-ig, la portada-short y la miniatura de YouTube
  const minis = viejosMini(id, guion, oficiales, MINIS), minisIg = guion.miniatura ? [] : viejosMini(id, guion, oficiales, MINIS_IG).filter((x) => !minis.includes(x));
  return [...aEpicos(g, serie).map((c) => c.texto), ...aOficiales(g, id, serie, oficiales).cambios.map((c) => c.texto), ...minis, ...minisIg];
}
export const viejosDeArchivo = (id, oficiales) => viejosDe(id, JSON.parse(_leer(`src/videos/${id}/guion.json`, 'utf8')), oficiales);
