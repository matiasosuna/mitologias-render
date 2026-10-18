// Puntual (2026-10-18): se recortaron los primeros 2 s (cartel gancho viejo) de 7 videos en Studio; sus capítulos "m:ss Título" estaban +2 s.
// Lee el snippet (videos.list, 1 u) y actualiza SOLO la descripción (videos.update, 50 u), con los capítulos corridos -2 s (0:00 queda).
// Uso: node scripts/yt-quitar-gancho-capitulos.mjs --probar   (solo lee y muestra)   |   sin flag: escribe UNA vez.
import { api } from './youtube-api.mjs';
import { desplazarCapitulos, SEG_GANCHO } from './gancho-horizontal.mjs';

export const VIDEOS = ['v_0_mEqKLFo', 'pNB1WvfaViI', 'rq8rXNz82QM', '78S8YsbcYpE', 'DtjalpWQz0g', 'TnW2UvWFXCY', 'SRzDUafgyYQ'];
/** Inversa de la subida: capítulos -2 s. Devuelve null si algún capítulo (≠ 0:00) quedaría antes de 0:00 o si no hay capítulos. */
export function sinGancho(desc) {
  const tiempos = [...desc.matchAll(/^(\d+):(\d{2}) /gm)].map((m) => Number(m[1]) * 60 + Number(m[2])).filter(Boolean);
  if (!tiempos.length || tiempos.some((t) => t < SEG_GANCHO)) return null;
  return desplazarCapitulos(desc, -SEG_GANCHO);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const probar = process.argv.includes('--probar');
  for (const id of VIDEOS) {
    const v = (await api('GET', '/videos', { query: { part: 'snippet', id } })).items?.[0];
    if (!v) { console.log(`${id}: no existe`); continue; }
    const s = v.snippet, nueva = sinGancho(s.description);
    if (!nueva || nueva === s.description) { console.log(`${id}: sin cambios (${nueva ? 'igual' : 'sin capítulos'})`); continue; }
    if (probar) { console.log(`${id}: ${s.title}`); s.description.split('\n').forEach((l, i) => { const n = nueva.split('\n')[i]; if (n !== l) console.log(`  ${l}  ->  ${n}`); }); continue; }
    const { title, tags, categoryId, defaultLanguage, defaultAudioLanguage } = s;
    await api('PUT', '/videos', { query: { part: 'snippet' }, json: { id, snippet: { title, tags, categoryId, ...(defaultLanguage && { defaultLanguage }), ...(defaultAudioLanguage && { defaultAudioLanguage }), description: nueva } } });
    console.log(`${id}: descripción actualizada`);
  }
}
