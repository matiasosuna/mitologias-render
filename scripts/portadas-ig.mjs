// Portadas verticales de Instagram (1080×1350): node scripts/portadas-ig.mjs [id…] → out/<id>/portada-ig.jpg
// Personajes: los de la miniatura del guion (o del mapa de miniaturas.mjs); temporada según el número de episodio.
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { readFileSync, readdirSync, rmSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const TEMPORADAS = {
  griegas: [[7, 'SEASON 1 · ORIGINS'], [17, 'SEASON 2 · THE OLYMPIANS']],
  nordicas: [[13, 'SEASON 1 · THE SAGA'], [99, 'SEASON 2 · HEROES OF THE NORTH']],
  egipcias: [[11, 'SEASON 1 · ORIGINS'], [99, 'SEASON 2 · KINGS, MAGICIANS & TRAVELERS']],
  hawaianas: [[12, 'SEASON 1 · ORIGINS'], [24, 'SEASON 2 · PELE AND HIʻIAKA']],
  norteamericanas: [[12, 'SEASON 1 · THE MAKING OF THE WORLD'], [24, 'SEASON 2 · TRICKSTERS AND HEROES'], [36, 'SEASON 3 · SKY AND STARS'], [99, 'SEASON 4 · GUARDIANS AND GIANTS']],
};
// Personajes de los episodios viejos sin "miniatura" en el guion (los mismos que sus miniaturas de YouTube).
const src = readFileSync('scripts/miniaturas.mjs', 'utf8');
const MINIS = Function(`return ${src.slice(src.indexOf('{', src.indexOf('const MINIS')), src.indexOf('};', src.indexOf('const MINIS')) + 1)}`)();
Object.assign(MINIS, { 'griegas-01-origen': ['zeus', 'cronos'], 'griegas-02-prometeo': ['prometeo', 'zeus'] });

const ids = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync('src/videos').filter((d) => /^[a-z]+-\d\d-/.test(d));
const serveUrl = await bundle({ entryPoint: resolve('src/canal/Canal.tsx') });
process.on('exit', () => rmSync(serveUrl, { recursive: true, force: true }));
for (const id of ids) {
  const g = JSON.parse(readFileSync(`src/videos/${id}/guion.json`, 'utf8'));
  const [heroe, rival] = g.miniatura ? [g.miniatura.heroe, g.miniatura.rival] : MINIS[id] ?? ['hombre'];
  const n = Number(g.numero), temporada = (TEMPORADAS[g.serie] ?? TEMPORADAS.griegas).find(([max]) => n <= max)?.[1] ?? '';
  const esp = g.especial;
  const props = esp
    ? { titulo: g.titulo.en.toUpperCase(), numero: esp.parte ? String(esp.parte) : '★', temporada: (esp.nombre.en ?? esp.nombre.es).toUpperCase(), insignia: esp.parte ? 'PART' : 'SPECIAL', heroe, rival, serie: g.serie }
    : { titulo: g.titulo.en.toUpperCase(), numero: String(n), temporada, heroe, rival, serie: g.serie };
  const comp = await selectComposition({ serveUrl, id: 'portada-ig', inputProps: props });
  mkdirSync(`out/${id}`, { recursive: true });
  await renderStill({ serveUrl, composition: comp, output: `out/${id}/portada-ig.jpg`, inputProps: props, imageFormat: 'jpeg', jpegQuality: 92 });
  console.log('ok', id);
}
