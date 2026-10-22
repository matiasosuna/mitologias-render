// Texto KJV de cada capítulo de Learn Bible 777 (id del guion → versículos), para poner el número de versículo en pantalla.
// Al sumar un capítulo, importar su kjv.json acá (los números se calculan solos con lib/versiculos.mjs).
import gen01 from '../videos/biblia-genesis-01/kjv.json';
import type { Verso } from '../../lib/versiculos.mjs';

export const KJV: Record<string, Verso[]> = {
  'biblia-genesis-01': gen01.verses,
};
/** Nombre del libro para la referencia en pantalla (sale del mismo kjv.json). */
export const KJV_LIBRO: Record<string, string> = {
  'biblia-genesis-01': gen01.verses[0].book_name,
};
