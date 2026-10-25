// Portadas verticales de Instagram (1080×1350): node scripts/portadas-ig.mjs [id…] → out/<id>/portada-ig.jpg
// Con --parte=n [--de=m]: la de la parte n, con "n/m" debajo del título → out/<id>/portada-ig-<n>.jpg (m sale de out/<id>/partes.json).
// Personajes: los de la miniatura del guion (o del mapa de miniaturas.mjs); temporada según el número de episodio.
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { readFileSync, readdirSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { MINIS, MINIS_IG } from '../lib/minis.mjs';
import { parOficial } from '../lib/miniaturas-oficiales.mjs';
import { clavesOficiales } from '../lib/personajes-oficiales.mjs';

const TEMPORADAS = {
  griegas: [[7, 'SEASON 1 · ORIGINS'], [17, 'SEASON 2 · THE OLYMPIANS'], [23, 'SEASON 3 · PERSEPHONE AND THE UNDERWORLD']],
  nordicas: [[13, 'SEASON 1 · THE SAGA'], [21, 'SEASON 2 · HEROES OF THE NORTH'], [30, 'SEASON 3 · ODIN']],
  egipcias: [[11, 'SEASON 1 · ORIGINS'], [19, 'SEASON 2 · KINGS, MAGICIANS & TRAVELERS'], [30, 'SEASON 3 · THE GODS UP CLOSE']],
  hawaianas: [[12, 'SEASON 1 · ORIGINS'], [24, 'SEASON 2 · PELE AND HIʻIAKA']],
  norteamericanas: [[12, 'SEASON 1 · THE MAKING OF THE WORLD'], [24, 'SEASON 2 · TRICKSTERS AND HEROES'], [36, 'SEASON 3 · SKY AND STARS'], [99, 'SEASON 4 · GUARDIANS AND GIANTS']],
  aztecas: [[12, 'SEASON 1 · THE FIVE SUNS'], [24, 'SEASON 2 · QUETZALCOATL AND TOLLAN'], [36, 'SEASON 3 · GODS, DAYS AND MICTLAN'], [99, 'SEASON 4 · LEGENDS OF TENOCHTITLAN']],
  balinesas: [[12, 'SEASON 1 · GODS, DEMONS AND THE ISLAND'], [24, 'SEASON 2 · PRIESTS, KINGS AND LOVERS'], [99, 'SEASON 3 · SPIRITS OF THE ISLAND']],
  hindues: [[12, 'SEASON 1 · GODS, THE OCEAN AND THE AVATARS'], [24, 'SEASON 2 · THE RAMAYANA'], [99, 'SEASON 3 · KRISHNA AND THE MAHABHARATA']],
  maories: [[12, 'SEASON 1 · FROM THE DARK TO AOTEAROA'], [24, 'SEASON 2 · CANOES FROM HAWAIKI'], [99, 'SEASON 3 · TANIWHA AND TIPUA']],
  biblia: [[5, 'SEASON 1 · GENESIS'], [50, 'SEASON 2 · GENESIS']], // Matías 2026-10-24: Génesis 1–5 = S1
};
const oficiales = clavesOficiales();
const opt = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=')[1];
const parte = Number(opt('parte')) || 0;
const libres = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const ids = libres.length ? libres : readdirSync('src/videos').filter((d) => /^[a-z]+-\d\d-/.test(d));
const serveUrl = await bundle({ entryPoint: resolve('src/canal/Canal.tsx') });
process.on('exit', () => rmSync(serveUrl, { recursive: true, force: true }));
for (const id of ids) {
  const g = JSON.parse(readFileSync(`src/videos/${id}/guion.json`, 'utf8'));
  // red de seguridad: claves viejas con diseño oficial se pasan al oficial (también el 'hombre' genérico de reserva)
  const [heroe, rival] = parOficial(g.miniatura ? [g.miniatura.heroe, g.miniatura.rival] : MINIS_IG[id] ?? MINIS[id] ?? ['hombre'], id, g, oficiales).par;
  const n = Number(g.numero), temporada = (TEMPORADAS[g.serie] ?? TEMPORADAS.griegas).find(([max]) => n <= max)?.[1] ?? '';
  const esp = g.especial;
  const props = esp
    ? { titulo: g.titulo.en.toUpperCase(), numero: esp.parte ? String(esp.parte) : '★', temporada: (esp.nombre.en ?? esp.nombre.es).toUpperCase(), insignia: esp.parte ? 'PART' : 'SPECIAL', heroe, rival, serie: g.serie }
    : { titulo: g.titulo.en.toUpperCase(), numero: String(n), temporada, heroe, rival, serie: g.serie };
  const de = Number(opt('de')) || Number(process.env.PARTES_DE) || (existsSync(`out/${id}/partes.json`) ? JSON.parse(readFileSync(`out/${id}/partes.json`, 'utf8')).de : 0);
  if (parte && de > 1) Object.assign(props, { parte, de });
  const salida = parte ? `out/${id}/portada-ig-${parte}.jpg` : `out/${id}/portada-ig.jpg`;
  const comp = await selectComposition({ serveUrl, id: 'portada-ig', inputProps: props });
  mkdirSync(`out/${id}`, { recursive: true });
  await renderStill({ serveUrl, composition: comp, output: salida, inputProps: props, imageFormat: 'jpeg', jpegQuality: 92 });
  console.log('ok', id);
}
