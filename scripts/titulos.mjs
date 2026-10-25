// Títulos de YouTube = el título escrito en el video (guion.json titulo.en) + temporada/episodio (src/videos/titulos.json).
// Formato: "<titulo.en> | Norse Mythology S1E10"; especiales: "<titulo.en> | Lords of the Dead Special".
import { readFileSync, existsSync } from 'node:fs';

export const RUTA_TITULOS = 'src/videos/titulos.json';
export const NOMBRES = { griegas: 'Greek', nordicas: 'Norse', egipcias: 'Egyptian', hawaianas: 'Hawaiian', norteamericanas: 'Native American', hindues: 'Hindu', aztecas: 'Aztec', balinesas: 'Balinese', maories: 'Māori', biblia: 'The Bible' };
/** "Norse Mythology"; la Biblia no es mitología: "The Bible". */
export const nombreSerie = (serie) => (serie === 'biblia' ? NOMBRES.biblia : `${NOMBRES[serie ?? 'griegas']} Mythology`);

/** Último número de episodio (el de la carpeta) de cada temporada; lo mismo que usan las portadas de IG y los planes. */
export const TEMPORADAS = {
  griegas: [7, 17],
  nordicas: [13, 96],
  egipcias: [11, 96],
  hawaianas: [12, 24],
  norteamericanas: [12, 24, 36, 96],
  aztecas: [12, 24, 36, 96],
  balinesas: [12, 24, 96],
  hindues: [12, 24, 96],
  maories: [12, 24, 96],
  biblia: [5, 50], // Matías 2026-10-24: Génesis 1–5 fue la temporada 1; desde Génesis 6, temporada 2
};
/** { temporada, episodio } de un episodio de la serie principal según su número de carpeta. */
export function temporadaDe(serie, numero) {
  const lim = TEMPORADAS[serie] ?? TEMPORADAS.griegas, n = Number(numero);
  const i = lim.findIndex((max) => n <= max);
  if (i < 0) throw new Error(`${serie} ${numero}: fuera de las temporadas conocidas`);
  return { temporada: i + 1, episodio: n - (i ? lim[i - 1] : 0) };
}

export const leerTitulos = (ruta = RUTA_TITULOS) => (existsSync(ruta) ? JSON.parse(readFileSync(ruta, 'utf8')) : {});

/** Primera línea de la descripción: "Norse Mythology · Season 1, Episode 10" (especial: "Lords of the Dead · Special"). */
export function lineaTemporada(entrada, serie) {
  if (!entrada) return '';
  if (entrada.especial) return `${entrada.especial} · Special${entrada.parte ? `, Part ${entrada.parte}` : ''}`;
  return `${nombreSerie(serie)} · Season ${entrada.temporada}, Episode ${entrada.episodio}`;
}

/** Formato válido del título completo (≤100 caracteres). */
export const FORMATO = /^(?<curioso>[^|<>]+?) \| (?:(?<serie>[A-Za-zā ]+ Mythology|The Bible) S(?<t>\d+)E(?<e>\d+)|(?<especial>[^|<>]+) Special(?: · Part \d+)?)$/u;

/** Título del capítulo (lo de antes de " | "): "Thor Lost His Hammer | Norse Mythology S1E5" → "Thor Lost His Hammer". */
export const parteCuriosa = (titulo) => (titulo ? String(titulo).split(' | ')[0].trim() : '');
/** Cartel inicial de cada parte vertical (Reels): el título del capítulo, o '' si no tiene. */
export const ganchoParte = (id, titulos = leerTitulos()) => parteCuriosa(titulos[id]?.titulo);
/** "Norse Mythology S1E5" de un episodio con entrada en titulos.json ('' si no hay o es especial). */
export function codigoEpisodio(id, titulos = leerTitulos()) {
  const m = titulos[id]?.titulo?.match(FORMATO);
  return m?.groups.serie ? `${m.groups.serie} S${m.groups.t}E${m.groups.e}` : '';
}
