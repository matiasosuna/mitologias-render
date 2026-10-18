// Personajes de portadas/miniaturas/tarjetas (guion.miniatura.heroe/rival y el mapa MINIS): clave vieja → *_oficial.
// Misma regla que los actores del guion (lib/personajes-oficiales.mjs + lib/animales-epicos.mjs). Valores posibles:
// clave del elenco ('odin'), { __como: clave, ...props } o props sueltos (sin clave: no hay nada que mapear).
import { resolver, serieDe } from './personajes-oficiales.mjs';
import { MAPA } from './animales-epicos.mjs';

/** Clave oficial para una clave vieja de portada, o null. Primero el actor del guion con ese id (así la portada
 *  muestra el mismo diseño que el video), después animal épico, después el resolvedor de personajes. */
export function claveMini(k, { serie, dir, guion, oficiales, usadas }) {
  if (typeof k !== 'string' || !k || k.endsWith('_oficial')) return null;
  if (oficiales[serie]?.has(`${k}_oficial`)) return `${k}_oficial`; // personaje con nombre: su diseño propio
  for (const e of guion?.escenas ?? []) for (const a of e.actores ?? []) if ((a.id === k || a.como === k) && a.como?.endsWith('_oficial')) return a.como;
  return MAPA[serie]?.[k] ?? resolver({ serie, dir, id: k, como: undefined, oficiales, usadas });
}

/** Convierte un personaje de portada (no modifica el original). Devuelve { valor, cambio } (cambio = 'viejo → nuevo' o null). */
export function fichaOficial(v, ctx) {
  if (typeof v === 'string') { const n = claveMini(v, ctx); return n ? { valor: n, cambio: `${v} → ${n}` } : { valor: v, cambio: null }; }
  if (v && typeof v === 'object' && typeof v.__como === 'string') { const n = claveMini(v.__como, ctx); return n ? { valor: { ...v, __como: n }, cambio: `${v.__como} → ${n}` } : { valor: v, cambio: null }; }
  return { valor: v, cambio: null };
}

/** [heroe, rival] de una portada → { par: [heroe, rival] convertidos, cambios: [...] }. */
export function parOficial([heroe, rival], dir, guion, oficiales, serie = serieDe(dir)) {
  const ctx = { serie, dir, guion, oficiales, usadas: new Map() }, cambios = [];
  const h = fichaOficial(heroe, ctx), r = rival === undefined || rival === null ? { valor: rival, cambio: null } : fichaOficial(rival, ctx);
  for (const x of [h, r]) if (x.cambio) cambios.push(x.cambio);
  return { par: [h.valor, r.valor], cambios };
}

/** Cambios pendientes de la miniatura efectiva de un guion: la suya o, si no tiene, la del mapa MINIS (lo que usan
 *  miniaturas.mjs/portadas-ig.mjs, y con ellas la tarjeta de portada que lleva dentro cada vertical/parte/TikTok). */
export function viejosMini(dir, guion, oficiales, minis = {}) {
  const par = guion.miniatura ? [guion.miniatura.heroe, guion.miniatura.rival] : minis[dir];
  if (!par) return [];
  return parOficial(par, dir, guion, oficiales).cambios.map((c) => `miniatura: ${c}`);
}
