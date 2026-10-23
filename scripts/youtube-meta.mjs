// Título, descripción (con capítulos) y etiquetas de YouTube para un video del motor.
// Uso: node scripts/youtube-meta.mjs griegas-01-origen  → out/<id>/youtube.json
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { leerTitulos, lineaTemporada, nombreSerie } from './titulos.mjs';
import { horizontalConMarco } from '../lib/marco.mjs';

const id = process.argv[2], idioma = 'en';
const g = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
const tl0 = JSON.parse(readFileSync(join('src/videos', id, 'timeline.json'), 'utf8'));
const tl = horizontalConMarco(g, tl0).timeline; // los tiempos del video que se sube (gancho al principio, etc.)
const nordica = g.serie === 'nordicas', egipcia = g.serie === 'egipcias', hawaiana = g.serie === 'hawaianas', norteamericana = g.serie === 'norteamericanas', azteca = g.serie === 'aztecas', balinesa = g.serie === 'balinesas', maori = g.serie === 'maories', biblia = g.serie === 'biblia';
const hindu = g.serie === 'hindues';
const meta = JSON.parse(readFileSync(nordica ? 'src/videos/meta-youtube-nordicas.json' : egipcia ? 'src/videos/meta-youtube-egipcias.json' : hawaiana ? 'src/videos/meta-youtube-hawaianas.json' : norteamericana ? 'src/videos/meta-youtube-norteamericanas.json' : hindu ? 'src/videos/meta-youtube-hindues.json' : azteca ? 'src/videos/meta-youtube-aztecas.json' : balinesa ? 'src/videos/meta-youtube-balinesas.json' : maori ? 'src/videos/meta-youtube-maories.json' : biblia ? 'src/videos/meta-youtube-biblia.json' : 'src/videos/meta-youtube.json', 'utf8'));
const ep = String(Number(g.numero));
const mmss = (fr) => { const s = Math.floor(fr / tl.fps); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const propio = join('src/videos', id, 'youtube.json');
const extra = existsSync(propio) ? JSON.parse(readFileSync(propio, 'utf8')) : meta.episodios[id] ?? {};
const capitulos = ['0:00 Intro', ...tl.escenas.filter((e) => !['gancho', 'apertura', 'despedida'].includes(e.id)).map((e, i) => `${mmss(e.from)} ${extra.capitulos?.[i] ?? e.id}`)];
const nuevo = leerTitulos()[id]; // título del capítulo + temporada (src/videos/titulos.json) si existe
const viejo = g.especial ? `${g.titulo[idioma]} | ${g.especial.nombre[idioma]}${g.especial.parte ? ` · Part ${g.especial.parte}` : ''}` : `${g.titulo[idioma]} | ${nordica ? 'Norse' : egipcia ? 'Egyptian' : hawaiana ? 'Hawaiian' : norteamericana ? 'Native American' : hindu ? 'Hindu' : azteca ? 'Aztec' : balinesa ? 'Balinese' : maori ? 'Māori' : 'Greek'} Mythology Ep. ${ep}`;
const titulo = nuevo?.titulo ?? viejo;
const linea = lineaTemporada(nuevo, g.serie);
const gancho = [].concat(extra.gancho ?? '').join(' ');
const descripcion = [...(linea && !gancho.includes(linea) ? [linea, ''] : []), gancho, '', '📜 Chapters', ...capitulos, '', extra.siguiente ? `▶ Next episode: ${extra.siguiente}` : '', '', meta.pie, '', meta.hashtags].join('\n').replace(/\n{3,}/g, '\n\n');
// lista de la temporada ("Norse Mythology · Season 2: …") si ya existe en listas.json
function listaDeTemporada() {
  if (!nuevo?.temporada || !existsSync('src/videos/listas.json')) return null;
  return Object.keys(JSON.parse(readFileSync('src/videos/listas.json', 'utf8'))).find((n) => n.startsWith(`${nombreSerie(g.serie)} · Season ${nuevo.temporada}:`)) ?? null;
}
const salida = { titulo, descripcion, etiquetas: [...meta.etiquetas, ...(extra.etiquetas ?? [])], lista: extra.lista ?? (g.especial ? g.especial.nombre[idioma] : listaDeTemporada() ?? meta.listaPorDefecto), miniatura: `out/${id}/miniatura.jpg`, video: `out/${id}/${id}.en.mp4` };
writeFileSync(join('out', id, 'youtube.json'), JSON.stringify(salida, null, 2));
console.log(`${titulo} (${titulo.length} car.)\n\n${descripcion}`);
