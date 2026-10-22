// Miniaturas de YouTube (1280×720) con el estilo de cada serie. Uso: node scripts/miniaturas.mjs [id…]
// Los personajes salen de MINIS (clave del elenco o props); el título, del guion.
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { readFileSync, rmSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { miniaturaQuien } from '../lib/quien.mjs';
import { MINIS } from '../lib/minis.mjs';
import { parOficial } from '../lib/miniaturas-oficiales.mjs';
import { clavesOficiales } from '../lib/personajes-oficiales.mjs';


const oficiales = clavesOficiales();
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(MINIS);
// Si el guion trae "miniatura", manda el guion (la portada del video usa lo mismo).
const guiones = Object.fromEntries(ids.map((id) => [id, JSON.parse(readFileSync(`src/videos/${id}/guion.json`, 'utf8'))]));
// Biblia (sin héroe/rival: Dios es solo luz): la miniatura es la portada del propio episodio (título del capítulo), a 1280×720.
const biblia = ids.filter((id) => guiones[id].serie === 'biblia');
if (biblia.length) {
  const url = await bundle({ entryPoint: resolve('src/motor/entrada.tsx') });
  process.on('exit', () => rmSync(url, { recursive: true, force: true }));
  for (const id of biblia) {
    const inputProps = { guion: guiones[id], timeline: JSON.parse(readFileSync(`src/videos/${id}/timeline.json`, 'utf8')), idioma: null, imagen: 'en' };
    const comp = await selectComposition({ serveUrl: url, id, inputProps });
    mkdirSync(`out/${id}`, { recursive: true });
    await renderStill({ serveUrl: url, composition: comp, output: `out/${id}/miniatura.jpg`, inputProps, frame: Math.min(60, inputProps.timeline.introFrames - 1), scale: 1280 / comp.width, imageFormat: 'jpeg', jpegQuality: 90 });
    console.log('ok', id);
  }
}
const resto = ids.filter((id) => !biblia.includes(id));
const serveUrl = resto.length ? await bundle({ entryPoint: resolve('src/canal/Canal.tsx') }) : null;
if (serveUrl) process.on('exit', () => rmSync(serveUrl, { recursive: true, force: true }));
for (const id of resto) {
  const g = guiones[id];
  // "Who is…?" horizontal: el muñeco oficial y el título del cartel ("WHO IS ZEUS?"), etiqueta "GREEK · WHO'S WHO"
  const props = g.quien ? miniaturaQuien(g) : (() => {
    if (!g.miniatura && !MINIS[id]) throw new Error(`miniaturas: ${id} no tiene "miniatura" en el guion ni entrada en MINIS (héroe y rival) en scripts/miniaturas.mjs`);
    // red de seguridad: cualquier clave vieja con diseño oficial se pasa al oficial (guion ya convertido: no cambia nada)
    const [heroe, rival] = parOficial(g.miniatura ? [g.miniatura.heroe, g.miniatura.rival] : MINIS[id], id, g, oficiales).par;
    return { titulo: g.titulo.en.toUpperCase(), numero: String(Number(g.numero)), heroe, rival, serie: g.serie, ...(g.especial ? { etiqueta: `${g.especial.nombre.en}${g.especial.parte ? ` · PART ${g.especial.parte}` : ''}`.toUpperCase() } : {}) };
  })();
  const comp = await selectComposition({ serveUrl, id: 'miniatura', inputProps: props });
  mkdirSync(`out/${id}`, { recursive: true });
  await renderStill({ serveUrl, composition: comp, output: `out/${id}/miniatura.jpg`, inputProps: props, imageFormat: 'jpeg', jpegQuality: 90 });
  console.log('ok', id);
}
