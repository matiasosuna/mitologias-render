// Gancho fijo de Myths on Clay (Matías 2026-10-22) con el marco de lib/marco.mjs: lo mismo en YouTube (horizontal),
// las partes de Instagram y TikTok. Solo agrega campos al guion (reels/youtube); después: node scripts/motor-narrar.mjs <id> en
//   node scripts/marco-myths.mjs <id> [<id>…]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { partesEstimadas } from './cola.mjs';

export const FRASES_GANCHO_MYTHS = [
  'Ever wanted to know the myths of the ancient world?',
  'I tell them as simple stories, so you can remember them without having to study books.',
  'Follow for a new myth every day.',
];
export const GANCHO_MYTHS = FRASES_GANCHO_MYTHS.join(' ');
/** Como la Biblia (scripts/marco-biblia.mjs): cada frase narrada aparte (el texto en pantalla va con la voz), tempo 1,25. */
export const TEMPO_GANCHO_MYTHS = 1.25;
const PAUSA = 0.1;
export const FINAL_MYTHS = 'Follow for a new myth every day.';
/** "The Mother of the Islands | Hawaiian Mythology S1E6" → "The Mother of the Islands". */
export const tituloCorto = (t) => String(t ?? '').split(' | ')[0].trim();

/** Campos del marco para un episodio: YouTube y TODAS las partes con el gancho completo (Matías 2026-10-23); de la 2 en adelante "…, part n.". */
export function marcoMyths(titulo, partes) {
  const hoy = `Today: ${tituloCorto(titulo)}.`;
  const ganchos = [{ en: `${GANCHO_MYTHS} ${hoy}` }];
  for (let n = 2; n <= partes; n++) ganchos.push({ en: `${GANCHO_MYTHS} Today: ${tituloCorto(titulo)}, part ${n}.` });
  return {
    reels: { ganchos, pausas: Object.fromEntries(FRASES_GANCHO_MYTHS.map((f) => [f, PAUSA])), tempos: { gancho: TEMPO_GANCHO_MYTHS }, final: { en: FINAL_MYTHS } },
    youtube: { gancho: { en: `${GANCHO_MYTHS} ${hoy}` }, final: { en: FINAL_MYTHS } },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const titulos = JSON.parse(readFileSync('src/videos/titulos.json', 'utf8'));
  for (const id of process.argv.slice(2)) {
    const dir = join('src/videos', id), g = JSON.parse(readFileSync(join(dir, 'guion.json'), 'utf8'));
    if (id.startsWith('biblia-') || id.startsWith('short-')) { console.log(`${id}: no es un episodio de Myths, se salta`); continue; }
    if (!titulos[id]?.titulo) { console.log(`${id}: sin título en titulos.json, se salta`); continue; }
    const tl = existsSync(join(dir, 'timeline.json')) ? JSON.parse(readFileSync(join(dir, 'timeline.json'), 'utf8')) : null;
    const m = marcoMyths(titulos[id].titulo, partesEstimadas(tl) + 2); // +2: el gancho alarga cada parte y puede sumar partes
    writeFileSync(join(dir, 'guion.json'), JSON.stringify({ ...g, reels: { ...g.reels, ...m.reels, tempos: { ...g.reels?.tempos, ...m.reels.tempos } }, youtube: { ...g.youtube, ...m.youtube } }, null, 2) + '\n');
    console.log(`${id}: marco con ${m.reels.ganchos.length} parte(s)`);
  }
}
