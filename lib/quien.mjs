// Shorts "Who is…?": cold open (lib/short.mjs) → cartel de ~1,5 s ("WHO IS ZEUS?") con el muñeco oficial, el nombre y
// un subtítulo → quién es. Lo activa el campo `quien` del guion (ver BRIEF-QUIEN.md); sin él, nada cambia.
import { T_SHORT } from './motor-tiempos.mjs';
import { preguntaFinal, MANTENER_PREGUNTA } from './short.mjs';

/** Segundos del cartel "Who is…?" (la historia arranca después). */
export const INTRO_QUIEN = 1.5;

/** Tiempos del timeline de un Short nativo: los de siempre; con `quien`, hueco para el cartel (después del cold open
 *  si hay); si termina en pregunta, la última escena queda +1 s. */
export function tiemposShort(g) {
  if (!g?.quien && !preguntaFinal(g)) return T_SHORT;
  const t = { ...T_SHORT };
  if (g.quien) Object.assign(t, { intro: g.coldOpen ? T_SHORT.intro : 0, cartel: INTRO_QUIEN, cartelTras: g.coldOpen ? 1 : 0 });
  if (preguntaFinal(g)) t.salidaFinal = MANTENER_PREGUNTA;
  return t;
}

/** Fondo de la apertura por serie (si el guion no trae `quien.fondo`). */
export const FONDO_QUIEN = { griegas: 'monte', nordicas: 'asgard', egipcias: 'piramides', hawaianas: 'playa' };

/** Textos del cartel en un idioma: título de arriba, nombre grande y subtítulo. */
export function textosQuien(quien, idioma = 'en') {
  const nombre = quien.nombre?.[idioma] ?? quien.nombre?.en ?? quien.nombre?.es ?? '';
  return {
    titulo: idioma === 'es' ? `¿Quién es ${nombre}?` : `Who is ${nombre}?`,
    nombre: nombre.toUpperCase(),
    subtitulo: quien.subtitulo?.[idioma] ?? quien.subtitulo?.en ?? quien.subtitulo?.es ?? '',
  };
}

/** Tamaño de letra que entra en el ancho (1080 menos márgenes): `porLetra` = ancho de cada letra en "em". */
export const tamQueEntra = (texto, max, porLetra, ancho = 980) => Math.min(max, Math.floor(ancho / (Math.max(1, [...texto].length) * porLetra)));

/** Errores del campo `quien` de un guion (lista vacía = bien). `elenco` = claves que existen. */
export function erroresQuien(g, elenco) {
  const q = g.quien;
  if (!q) return [];
  const e = [];
  if (g.formato !== 'short') e.push('quien solo va en Shorts nativos (formato "short")');
  if (!q.nombre?.en || !q.nombre?.es) e.push('quien.nombre necesita {es, en}');
  if (!q.subtitulo?.en || !q.subtitulo?.es) e.push('quien.subtitulo necesita {es, en}');
  else if (q.subtitulo.en.length > 46) e.push(`quien.subtitulo.en largo (${q.subtitulo.en.length} > 46)`);
  if (!/_oficial$/.test(q.como ?? '')) e.push(`quien.como tiene que ser un personaje *_oficial ("${q.como}")`);
  else if (elenco && !elenco.has(q.como)) e.push(`quien.como "${q.como}" no está en el elenco`);
  return e;
}
