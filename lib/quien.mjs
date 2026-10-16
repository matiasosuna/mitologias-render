// Shorts "Who is…?": un cartel de apertura de ~2 s ("WHO IS ZEUS?") con el muñeco oficial, el nombre y un subtítulo,
// y después la mini-historia de siempre. Lo activa el campo `quien` del guion (ver BRIEF-QUIEN.md); sin él, nada cambia.
import { T_SHORT } from './motor-tiempos.mjs';

/** Segundos del cartel de apertura (la historia arranca después). */
export const INTRO_QUIEN = 2;

/** Tiempos del timeline de un Short nativo: los de siempre, o con 2 s de apertura si es "Who is…?". */
export const tiemposShort = (g) => (g?.quien ? { ...T_SHORT, intro: INTRO_QUIEN } : T_SHORT);

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
