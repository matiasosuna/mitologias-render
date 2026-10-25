// Saca el gancho narrado (Matías 2026-10-24: "saquemos el tema del gancho"; un video largo, para él) de guion y timeline.
// Episodios de Myths: vuelven al formato de antes del marco (portada + historia, sin pregunta final).
// Biblia: queda como Génesis 1 (portada + capítulo + la pregunta final). No hace falta narrar nada: solo se borran piezas.
//   node scripts/sin-gancho.mjs <id> [<id>…]   (Biblia: después `node scripts/verificado.mjs <id>`)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const esGancho = (k) => /^(reels-gancho-\d+|youtube-gancho|youtube-invitacion)$/.test(k);

/** Guion y timeline sin gancho (puro). */
export function sinGancho(id, g, tl) {
  const biblia = id.startsWith('biblia-');
  const guion = structuredClone(g), timeline = tl ? structuredClone(tl) : tl;
  if (guion.reels) {
    delete guion.reels.ganchos; delete guion.reels.pausas;
    if (guion.reels.tempos) { delete guion.reels.tempos.gancho; if (!Object.keys(guion.reels.tempos).length) delete guion.reels.tempos; }
    if (!biblia) delete guion.reels.final;
  }
  if (guion.youtube) { delete guion.youtube.gancho; delete guion.youtube.invitacion; if (!biblia) delete guion.youtube.final; }
  if (timeline?.marco) {
    for (const k of Object.keys(timeline.marco)) if (esGancho(k) || (!biblia && /-final$/.test(k))) delete timeline.marco[k];
    if (!Object.keys(timeline.marco).length) delete timeline.marco;
  }
  return { guion, timeline };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const id of process.argv.slice(2)) {
    const dir = join('src/videos', id), fg = join(dir, 'guion.json'), ft = join(dir, 'timeline.json');
    const g = JSON.parse(readFileSync(fg, 'utf8')), tl = existsSync(ft) ? JSON.parse(readFileSync(ft, 'utf8')) : null;
    const r = sinGancho(id, g, tl);
    writeFileSync(fg, JSON.stringify(r.guion, null, 2) + '\n');
    if (tl) writeFileSync(ft, JSON.stringify(r.timeline)); // compacto, como lo deja motor-narrar
    console.log(`${id}: sin gancho${r.timeline?.marco ? ` (queda: ${Object.keys(r.timeline.marco).join(', ')})` : ''}`);
  }
}
