// Gancho de la Biblia (aprobado por Matías 2026-10-22, todos los capítulos menos Génesis 1) con el marco de lib/marco.mjs:
// mismo gancho en YouTube (horizontal), la parte 1 de Instagram y TikTok; las partes 2+ solo "Genesis N, part n.".
// Voz desde el cuadro 0 (lib/marco.mjs conGanchoAlPrincipio / src/motor/Gancho.tsx). Solo agrega campos al guion; después:
//   node scripts/marco-biblia.mjs <id> [<id>…] && node scripts/motor-narrar.mjs <id> en
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { partesEstimadas } from './cola.mjs';

export const FRASES_GANCHO_BIBLIA = [
  'Ever wanted to know what the Bible actually says?',
  'Without anyone telling you what to believe?',
  'I tell it as simple stories, with the exact words, as it was written.',
  'No interpretation.',
];
export const GANCHO_BIBLIA = FRASES_GANCHO_BIBLIA.join(' ');
/** Tempo extra del gancho (atempo, mismo tono): con 1,2 dura ~11 s (medido en Génesis 2–4). */
export const TEMPO_GANCHO_BIBLIA = 1.2;
const PAUSA = 0.1; // s entre frases del gancho (cada frase se narra aparte: el texto en pantalla va justo con la voz)

/** "Genesis 2: The Garden of Eden" → { cap: "Genesis 2", corto: "The Garden of Eden" }. */
export function partesTitulo(titulo) {
  const m = String(titulo ?? '').match(/^(.+?\s\d+):\s*(.+)$/);
  if (!m) throw new Error(`título sin "<Libro> <N>: <título corto>": ${titulo}`);
  return { cap: m[1].trim(), corto: m[2].trim() };
}

/** Campos del marco: gancho completo + "Today: Genesis N, <título corto>." (parte 1 y YouTube); "Genesis N, part n." en las demás. */
export function marcoBiblia(g, partes = 3) {
  const { cap, corto } = partesTitulo(g.titulo?.en);
  const gancho = { en: `${GANCHO_BIBLIA} Today: ${cap}, ${corto}.` };
  const ganchos = [gancho];
  for (let n = 2; n <= Math.max(2, partes); n++) ganchos.push({ en: `${cap}, part ${n}.` });
  return {
    reels: { ...g.reels, ganchos, pausas: Object.fromEntries(FRASES_GANCHO_BIBLIA.map((f) => [f, PAUSA])), tempos: { ...g.reels?.tempos, gancho: TEMPO_GANCHO_BIBLIA } },
    youtube: { ...g.youtube, gancho },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const id of process.argv.slice(2)) {
    if (!id.startsWith('biblia-') || id === 'biblia-genesis-01') { console.log(`${id}: se salta`); continue; }
    const dir = join('src/videos', id), g = JSON.parse(readFileSync(join(dir, 'guion.json'), 'utf8'));
    const tl = existsSync(join(dir, 'timeline.json')) ? JSON.parse(readFileSync(join(dir, 'timeline.json'), 'utf8')) : null;
    const m = marcoBiblia(g, partesEstimadas(tl) + 1); // +1: el gancho alarga la parte 1 y puede sumar una parte
    writeFileSync(join(dir, 'guion.json'), JSON.stringify({ ...g, ...m }, null, 2) + '\n');
    console.log(`${id}: gancho + ${m.reels.ganchos.length - 1} línea(s) de parte`);
  }
}
