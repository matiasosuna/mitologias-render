// Título, descripción, etiquetas y lista de YouTube de la versión horizontal de un "Who is…?" (subir.mjs --horizontal).
import { leerTitulos } from './titulos.mjs';
import { textosQuien, tituloQuienHorizontal, listaQuien, MITOLOGIA_EN } from '../lib/quien.mjs';

const HASHTAG = { griegas: '#GreekMythology #GreekGods', nordicas: '#NorseMythology #Vikings', egipcias: '#EgyptianMythology #AncientEgypt', hawaianas: '#HawaiianMythology #Polynesian' };

/** { titulo, descripcion, etiquetas, lista } (lista = nombre en listas.json). `ids` = youtube-ids.json. */
export function metaQuienHorizontal(g, { ids = {}, titulos = leerTitulos() } = {}) {
  const t = textosQuien(g.quien, 'en'), nombre = g.quien.nombre.en, mito = MITOLOGIA_EN[g.serie] ?? MITOLOGIA_EN.griegas;
  const frio = (g.coldOpen?.frases ?? []).map((f) => f.en).filter(Boolean).join(' ');
  const ep = g.episodio, tituloEp = titulos[ep]?.titulo;
  const lineas = [
    `${t.titulo} ${t.subtitulo}.`,
    ...(frio ? ['', frio] : []),
    ...(tituloEp ? ['', `The full story: ${tituloEp}`, ...(ids[ep] ? [`https://youtu.be/${ids[ep]}`] : [])] : []),
    '', 'Learn mythology the easy and fun way: subscribe to Myths on Clay.',
    '', `${HASHTAG[g.serie] ?? `#${mito.replace(/\W/g, '')}Mythology`} #${nombre.replace(/[^A-Za-z]/g, '')} #Mythology`,
  ];
  const etiquetas = ['mythology', `${mito.toLowerCase()} mythology`, nombre.toLowerCase(), `who is ${nombre.toLowerCase()}`, `${mito.toLowerCase()} gods`, 'myths', 'animated mythology', 'myths on clay'];
  return { titulo: tituloQuienHorizontal(g), descripcion: lineas.join('\n'), etiquetas: [...new Set(etiquetas)], lista: listaQuien(g.serie) };
}
