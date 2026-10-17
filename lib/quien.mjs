// Shorts "Who is…?": cold open (lib/short.mjs) → cartel de ~1,5 s ("WHO IS ZEUS?") con el muñeco oficial, el nombre y
// un subtítulo → quién es. Lo activa el campo `quien` del guion (ver BRIEF-QUIEN.md); sin él, nada cambia.
import { T_SHORT, T } from './motor-tiempos.mjs';
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

// ── Versión horizontal 16:9 (video normal de YouTube, `<id>-horizontal`, src/motor/ShortHorizontal.tsx): misma voz y
// mismo timeline que el Short, con las escenas enteras en 16:9 (sin recorte), el cartel "Who is…?" de 2 s como el
// gancho de los episodios y la pantalla final de 12 s de los episodios.
/** Segundos del cartel horizontal (= GANCHO_HORIZONTAL de los episodios). */
export const CARTEL_HORIZONTAL = 2;
/** Segundos de la pantalla final (= T.outro de los episodios: los elementos de YouTube piden 5–20 s). */
export const FINAL_HORIZONTAL = T.outro;

/** Timeline horizontal a partir del timeline del Short: el cartel pasa a 2 s (lo que viene después se corre) y el
 *  cartel final de 1,5 s pasa a la pantalla final de 12 s. Frases, voces y escenas, iguales. */
export function timelineHorizontal(tl) {
  const fps = tl.fps, cartelFrames = Math.round(CARTEL_HORIZONTAL * fps), outroFrames = Math.round(FINAL_HORIZONTAL * fps);
  const cartelFrom = tl.cartelFrom ?? tl.introFrames, antes = tl.cartelFrames ?? 0, extra = cartelFrames - antes;
  const escenas = tl.escenas.map((e) => (e.from >= cartelFrom + antes ? { ...e, from: e.from + extra } : e));
  const finHistoria = tl.total - tl.outroFrames + extra;
  return { ...tl, escenas, cartelFrom, cartelFrames, outroFrames, total: finHistoria + outroFrames };
}

/** Escena del Short puesta en 16:9: el `foco` (x de pantalla del centro del vertical) queda en el centro del cuadro
 *  corriendo la cámara; sin foco (o 960) queda tal cual. */
export function escenaHorizontal(esc) {
  const d = (esc.foco ?? 960) - 960;
  if (!d) return esc;
  const c = esc.camara ?? {}, de = (c.de ?? 0) + d;
  return { ...esc, camara: { ...c, de, a: (c.a ?? c.de ?? 0) + d } };
}

/** Nombre de cada mitología en inglés (el mismo de scripts/titulos.mjs › NOMBRES; el test los compara). */
export const MITOLOGIA_EN = { griegas: 'Greek', nordicas: 'Norse', egipcias: 'Egyptian', hawaianas: 'Hawaiian', norteamericanas: 'Native American', hindues: 'Hindu', aztecas: 'Aztec', balinesas: 'Balinese', maories: 'Māori' };
export const mitologiaEn = (serie) => `${MITOLOGIA_EN[serie] ?? MITOLOGIA_EN.griegas} Mythology`;
/** Título de YouTube de la versión horizontal = el del cartel + la mitología: "Who is Zeus? | Greek Mythology". */
export const tituloQuienHorizontal = (g) => `${textosQuien(g.quien, 'en').titulo} | ${mitologiaEn(g.serie)}`;
/** Lista de YouTube de los "Who is…?" horizontales de cada mitología: "Greek Mythology: Who's Who". */
export const listaQuien = (serie) => `${mitologiaEn(serie)}: Who's Who`;
/** Props de la miniatura (src/comun/miniatura.tsx) de la versión horizontal: muñeco oficial solo (entero, con lo que
 *  lleve en alto) + "WHO IS ZEUS?". */
export const miniaturaQuien = (g) => ({ titulo: textosQuien(g.quien, 'en').titulo.toUpperCase(), numero: '', heroe: g.quien.como, rival: null, escalaHeroe: 0.76 * (g.quien.escala ?? 1), serie: g.serie, etiqueta: `${MITOLOGIA_EN[g.serie] ?? MITOLOGIA_EN.griegas} · Who's Who`.toUpperCase() });
