// Títulos de YouTube con curiosidad + temporada/episodio (src/videos/titulos.json).
// Formato: "<título curioso> | Norse Mythology S1E10"; especiales: "<título curioso> | Lords of the Dead Special".
import { readFileSync, existsSync } from 'node:fs';

export const RUTA_TITULOS = 'src/videos/titulos.json';
export const NOMBRES = { griegas: 'Greek', nordicas: 'Norse', egipcias: 'Egyptian', hawaianas: 'Hawaiian', norteamericanas: 'Native American', hindues: 'Hindu', aztecas: 'Aztec', balinesas: 'Balinese', maories: 'Māori' };
export const nombreSerie = (serie) => `${NOMBRES[serie ?? 'griegas']} Mythology`;

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
export const FORMATO = /^(?<curioso>[^|<>]+?) \| (?:(?<serie>[A-Za-zā ]+ Mythology) S(?<t>\d+)E(?<e>\d+)|(?<especial>[^|<>]+) Special(?: · Part \d+)?)$/u;
