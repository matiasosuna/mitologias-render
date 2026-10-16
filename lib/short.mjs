// Shorts nativos (formato "short"): ritmo rápido y cold open.
// - Voz en inglés a 1,1× (atempo, mantiene el tono) y sin silencio al principio ni al final de cada frase.
// - `coldOpen` en el guion: una escena de 1–2 frases (el momento más fuerte) que va ANTES del cartel/la historia.
// Los episodios no cambian: siguen a TEMPO_EN (0,9) y sin recorte.
import { TEMPO_EN } from './motor-tiempos.mjs';

/** Tempo de la voz en inglés de los Shorts (1 = como sale del motor de voz). */
export const TEMPO_SHORT = 1.1;
/** Segundos extra que queda la escena final si el Short termina en pregunta (para que llegue). */
export const MANTENER_PREGUNTA = 1;
/** Recorte de silencio: umbral y cuánto silencio se deja en cada punta (s). */
export const RECORTE = { umbral: '-40dB', inicio: 0.03, fin: 0.06 };

/** Escenas en el orden en que se ven: el cold open (si hay) y después la historia. */
export const escenasDe = (g) => (g?.coldOpen ? [{ id: 'coldopen', ...g.coldOpen }, ...g.escenas] : g.escenas);

/** ¿La última frase del Short es una pregunta? */
export function preguntaFinal(g) {
  const ult = g?.escenas?.at(-1)?.frases?.at(-1);
  return !!(ult && /\?\s*$/.test(ult.en ?? ult.es ?? ''));
}

/** Cómo se procesa la voz en inglés de un guion: Shorts rápidos y recortados; episodios lentos. */
export const procesoAudio = (g) => (g?.formato === 'short' ? { tempo: TEMPO_SHORT, recortar: true } : { tempo: TEMPO_EN, recortar: false });

/** Lo que ya tiene un .wav según .tempo.json: nada (= crudo), un número (tempo, formato viejo) o { tempo, recorte }. */
const normal = (prev) => (prev == null ? { tempo: 1, recorte: false } : typeof prev === 'number' ? { tempo: prev, recorte: false } : { tempo: prev.tempo ?? 1, recorte: !!prev.recorte });

/** Qué falta hacerle a un .wav para llegar al objetivo: null = nada; si no, { atempo (relativo, o null), recortar }. */
export function pendienteAudio(prev, objetivo) {
  const p = normal(prev);
  const atempo = Math.abs(objetivo.tempo - p.tempo) < 1e-6 ? null : Number((objetivo.tempo / p.tempo).toFixed(6));
  const recortar = !!objetivo.recortar && !p.recorte;
  return atempo || recortar ? { atempo, recortar } : null;
}

/** Valor que queda en .tempo.json (número si no hay recorte, como los episodios de siempre). */
export const registroAudio = (objetivo, prev) => ((objetivo.recortar || normal(prev).recorte) ? { tempo: objetivo.tempo, recorte: true } : objetivo.tempo);

/** Filtro -af de ffmpeg para un pendiente: tempo y recorte de silencio en las dos puntas. */
export function filtroAudio({ atempo, recortar }) {
  const sr = (keep) => `silenceremove=start_periods=1:start_threshold=${RECORTE.umbral}:start_silence=${keep}`;
  return [atempo ? `atempo=${atempo}` : null, ...(recortar ? [sr(RECORTE.inicio), 'areverse', sr(RECORTE.fin), 'areverse'] : [])].filter(Boolean).join(',');
}

/** Errores del campo `coldOpen` (lista vacía = bien). */
export function erroresColdOpen(g) {
  const c = g?.coldOpen;
  if (!c) return [];
  const e = [];
  if (g.formato !== 'short') e.push('coldOpen solo va en Shorts nativos (formato "short")');
  const n = c.frases?.length ?? 0;
  if (n < 1 || n > 2) e.push(`coldOpen lleva 1–2 frases (tiene ${n})`);
  (c.frases ?? []).forEach((t, i) => { if (!t.en || !t.es) e.push(`coldOpen frase ${i} necesita {es, en}`); else if (t.en.split(/\s+/).length > 22) e.push(`coldOpen frase ${i} larga (> 22 palabras)`); });
  if (!c.fondo) e.push('coldOpen necesita fondo');
  if (!(c.actores ?? []).length) e.push('coldOpen sin actores');
  return e;
}
