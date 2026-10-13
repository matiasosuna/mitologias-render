// Guiones de la serie maorí para las pruebas visuales (src/pruebas/maori.tsx).
import type { GuionVisual } from '../motor/tipos';
import g1 from '../videos/maories-01-padre-cielo-madre-tierra/guion.json';
import g2 from '../videos/maories-02-la-guerra-del-dios-de-la-tormenta/guion.json';
import g3 from '../videos/maories-03-tu-el-que-no-huyo/guion.json';
import g4 from '../videos/maories-04-la-mujer-hecha-de-tierra/guion.json';
import g5 from '../videos/maories-05-el-bebe-envuelto-en-el-pelo/guion.json';
import g6 from '../videos/maories-06-maui-atrapa-al-sol/guion.json';
import g7 from '../videos/maories-07-el-pez-de-maui/guion.json';
import g8 from '../videos/maories-08-las-unas-de-fuego/guion.json';
import g9 from '../videos/maories-09-maui-y-la-diosa-de-la-muerte/guion.json';
import g10 from '../videos/maories-10-tawhaki-sube-al-cielo/guion.json';
import g11 from '../videos/maories-11-la-canoa-de-rata/guion.json';
import g12 from '../videos/maories-12-kupe-y-la-larga-nube-blanca/guion.json';

export const GUIONES_MAORI = [g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12] as unknown as GuionVisual[];
/** Tomas para las cuadrículas 2×2: [n.º de episodio, id de escena, frase]. */
export const TOMAS_MAORI: [number, string, number][][] = [[[1,'te_kore',4.8],[1,'tane_empuja',4.6],[1,'lagrimas',3.5],[3,'padres',3]],[[2,'bosque',2.6],[3,'venganza',3.5],[4,'aliento',2.6],[4,'hine_nui',3.5]],[[5,'kereru',2.5],[6,'golpe',2.5],[7,'pez',3.5],[8,'incendio',2.5]],[[9,'risa',3],[10,'abuela',3],[10,'revela',2.5],[11,'ejercito',3.5]],[[12,'nube',3],[12,'raukawa',3.4],[10,'enredaderas',2.5],[10,'casa',2.5]]];
