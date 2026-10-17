// Texto (caption) de cada parte de episodio en Reels (lo usa scripts/instagram-reels.mjs). La 1.ª línea es la clave
// anti-duplicados (se compara con la 1.ª línea de lo ya publicado), así que:
//  - episodios con alguna parte publicada con la línea vieja la mantienen: "<titulo.en> | Norse Mythology Ep. 12 · Part 2/2 🏺"
//  - el resto usa el título del capítulo: "<título de titulos.json> · Part 1/2" (en el registro: formato: 'curioso' + el texto
//    usado en `curioso`, para que las partes siguientes repitan esa línea aunque el título cambie)

/** Marca en out/subidas-instagram.json de las partes publicadas con la 1.ª línea nueva. */
export const FORMATO_CURIOSO = 'curioso';

/** Título para la 1.ª línea nueva: el ya usado en alguna parte publicada de este episodio (registro), o el actual. */
export const curiosoDe = (previas, actual) => previas.find((h) => h.formato === FORMATO_CURIOSO && h.curioso)?.curioso ?? actual;
/** 1.ª línea con el formato de antes (2026-10-10 → 2026-10-15). */
export const lineaVieja = ({ gu, nombre, parte, de }) => `${gu.titulo.en} | ${nombre} Mythology Ep. ${Number(gu.numero)}${de > 1 ? ` · Part ${parte}/${de}` : ''} 🏺`;
/** 1.ª línea nueva: el título del capítulo + "· Part n/de". */
export const lineaNueva = ({ curioso, parte, de }) => `${curioso}${de > 1 ? ` · Part ${parte}/${de}` : ''}`;
/** La 1.ª línea que corresponde: la vieja si el episodio tiene partes publicadas con la línea vieja (o no tiene título). */
export const primeraLinea = (o) => (o.yaPublicadas > 0 || !o.curioso ? lineaVieja(o) : lineaNueva(o));
/** ¿Esta 1.ª línea de un post ya publicado es esta misma parte (en cualquiera de los dos formatos)? */
export const esLaMisma = (linea, o) => linea === lineaVieja(o) || (Boolean(o.curioso) && linea === lineaNueva(o));

/** Caption completo. o = { gu, nombre, tags, parte, de, curioso, codigo, gancho, yaPublicadas } */
export function textoReel(o) {
  const { gu, tags, parte, de, codigo, gancho } = o;
  const titulo = primeraLinea(o);
  const serie = titulo !== lineaVieja(o) && codigo ? `\n${codigo}` : ''; // la línea vieja ya nombra la serie
  const intro = parte > 1 ? `Continued from Part ${parte - 1}: watch it first in our Reels.` : (gancho ?? '');
  const sigue = parte < de ? `\n\nFollow so you don't miss Part ${parte + 1} 👀` : '';
  return `${titulo}${serie}\n\n${intro}${sigue}\n\n🇪🇸 ${gu.titulo.es}${de > 1 ? ` · Parte ${parte}/${de}` : ''}\n\nThe whole season, in order, in our Reels and on YouTube (link in bio).\n\n${tags} #mythology #animation #mythsonclay`;
}
