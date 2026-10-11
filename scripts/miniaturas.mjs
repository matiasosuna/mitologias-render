// Miniaturas de YouTube (1280×720) con el estilo de cada serie. Uso: node scripts/miniaturas.mjs [id…]
// Los personajes salen de MINIS (clave del elenco o props); el título, del guion.
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { readFileSync, rmSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const MINIS = {
  'griegas-03-pandora': ['pandora', 'epimeteo'],
  'griegas-04-edades': ['zeus', 'hombre'],
  'griegas-05-diluvio': [{ barba: true, canas: true, ropa: 'larga' }, { mujer: true, tocado: 'velo' }],
  'griegas-06-gigantomaquia': ['heracles', { gigante: true, barba: true, ropa: 'desnudo', boca: true }],
  'griegas-07-tifon': ['zeus', { gigante: true, barba: true, ropa: 'desnudo', boca: true, piel: '#3A1A0C' }],
  'griegas-08-doce-olimpicos': ['zeus', 'hera'],
  'griegas-09-atenea': ['atenea', 'zeus'],
  'griegas-10-atenea-poseidon': ['atenea', 'poseidon'],
  'nordicas-01-fuego-y-hielo': ['odin', 'ymir'],
  'nordicas-02-mundo': ['odin', 'embla'],
  'nordicas-03-yggdrasil': ['heimdall', 'norna'],
  'nordicas-04-guerra-dioses': ['odin', 'freyja'],
  'nordicas-05-sabiduria': ['odin', 'mimir'],
  'nordicas-06-muralla': ['loki', 'jotun'],
  'nordicas-07-tesoros': ['thor', 'enano'],
};
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(MINIS);
// Si el guion trae "miniatura", manda el guion (la portada del video usa lo mismo).
const serveUrl = await bundle({ entryPoint: resolve('src/canal/Canal.tsx') });
process.on('exit', () => rmSync(serveUrl, { recursive: true, force: true }));
for (const id of ids) {
  const g = JSON.parse(readFileSync(`src/videos/${id}/guion.json`, 'utf8'));
  const [heroe, rival] = g.miniatura ? [g.miniatura.heroe, g.miniatura.rival] : MINIS[id];
  const props = { titulo: g.titulo.en.toUpperCase(), numero: String(Number(g.numero)), heroe, rival, serie: g.serie, ...(g.especial ? { etiqueta: `${g.especial.nombre.en}${g.especial.parte ? ` · PART ${g.especial.parte}` : ''}`.toUpperCase() } : {}) };
  const comp = await selectComposition({ serveUrl, id: 'miniatura', inputProps: props });
  mkdirSync(`out/${id}`, { recursive: true });
  await renderStill({ serveUrl, composition: comp, output: `out/${id}/miniatura.jpg`, inputProps: props, imageFormat: 'jpeg', jpegQuality: 90 });
  console.log('ok', id);
}
