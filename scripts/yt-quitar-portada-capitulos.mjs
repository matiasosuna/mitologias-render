// Puntual (2026-10-18): se recortaron en Studio los primeros 4 s (cartel de portada viejo) de 31 videos; sus capítulos "m:ss Título" quedaron +4 s.
// Lee el snippet (videos.list, 1 u) y actualiza SOLO la descripción (videos.update, 50 u), con los capítulos corridos -4 s (0:00 queda).
// Uso: node scripts/yt-quitar-portada-capitulos.mjs --probar   (solo lee y muestra)   |   sin flag: escribe UNA vez.
const api = (...a) => import('./youtube-api.mjs').then((m) => m.api(...a)); // diferido: los tests importan sin .env
import { desplazarCapitulos } from './gancho-horizontal.mjs';

export const SEG_PORTADA = 4;
export const VIDEOS = [
  '0cnUggzRj2g', 'eYXeuUeS2yA', 'cJSEP01jdZY', '7OydHr6BtlY', 'c4cIOSvM9FE', 'ver5PeJ99VQ', '-6SlSjCkT8s', 'dgbzwdiEIug', 'mPVC3n7xFoo', 'YG2ZoizXCDg', 'MAe-9SYJI_0', 'jSsTb00oI2E', 'kqtZmH1l81U', '4MzNbmS3efA', 'KBWKT1D_Pwo', 'gwKBjQZqFLY',
  'fdYJ6WvDLlQ', 'rzq8cNyrWaE', 'jatr1jV8JDE', 'QaP1mpwQkDk', 'hNM95yt8vSA', 's6GuUoA-Gi4', 'SRzDUafgyYQ',
  '554dTYf8_EI', 'awU7FTcqHj0', 'v_0_mEqKLFo',
  'e7weEmADZT0', 'jc6GXod9cuU', 'npEAUOxkB4k', 'q7k_hw9qYrk', 'j73SqU7I1bU',
];
/** Capítulos -4 s; el viejo "0:00 Intro" (la portada recortada) se va si otro capítulo pasa a 0:00. null si no hay capítulos o alguno (≠ 0:00) quedaría antes de 0:00. */
export function sinPortada(desc) {
  const tiempos = [...desc.matchAll(/^(\d+):(\d{2}) /gm)].map((m) => Number(m[1]) * 60 + Number(m[2])).filter(Boolean);
  if (!tiempos.length || tiempos.some((t) => t < SEG_PORTADA)) return null;
  const lineas = desplazarCapitulos(desc, -SEG_PORTADA).split('\n');
  const ceros = lineas.map((l, i) => (/^0:00 /.test(l) ? i : -1)).filter((i) => i >= 0);
  if (ceros.length > 1) lineas.splice(ceros[0], 1);
  return lineas.join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const probar = process.argv.includes('--probar');
  for (const id of VIDEOS) {
    const v = (await api('GET', '/videos', { query: { part: 'snippet', id } })).items?.[0];
    if (!v) { console.log(`${id}: no existe`); continue; }
    const s = v.snippet, nueva = sinPortada(s.description);
    if (!nueva || nueva === s.description) { console.log(`${id}: sin cambios (${nueva ? 'igual' : 'sin capítulos'})`); continue; }
    if (probar) { const a = s.description.split('\n'), b = nueva.split('\n'); const d = a.map((l, i) => l !== b[i] ? `${l} -> ${b[i]}` : null).filter(Boolean); console.log(`${id}: ${d.length} cambios; ${d.slice(0, 2).join(' | ')}`); continue; }
    const { title, tags, categoryId, defaultLanguage, defaultAudioLanguage } = s;
    await api('PUT', '/videos', { query: { part: 'snippet' }, json: { id, snippet: { title, tags, categoryId, ...(defaultLanguage && { defaultLanguage }), ...(defaultAudioLanguage && { defaultAudioLanguage }), description: nueva } } });
    console.log(`${id}: descripción actualizada`);
  }
}
