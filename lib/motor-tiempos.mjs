// Tiempos del motor: cada frase dura lo que la más larga de sus idiomas, así las imágenes son
// las mismas para todas las voces.
export const FPS = 24;
/** Tempo de la narración en inglés (1 = como sale de ElevenLabs; menos = más lenta y clara). */
export const TEMPO_EN = 0.9;
/** Shorts nativos: arrancan de una (sin portada), ritmo rápido (0,12 s entre frases, ~0,35 s entre escenas) y
 *  cartel final de 1,5 s. Voz a 1,1× y sin silencios en las puntas (lib/short.mjs). */
export const T_SHORT = { intro: 0.1, entrada: 0.15, pausa: 0.12, salida: 0.2, outro: 1.5 };
export const T = { intro: 4, entrada: 0.7, pausa: 0.6, salida: 1.0, outro: 12 } // outro = pantalla final de YouTube (5–20 s);

/** escenas: [{ id, frases: [{ texto, audio: {es: ruta}, segundos: {es: 3.2, pt: 3.5} }] }]
 *  Opcionales de `t`: `cartel` (s) = hueco para el cartel "Who is…?" antes de la escena `cartelTras` (0 = al principio),
 *  `salidaFinal` (s) = la última escena queda un poco más (Short que termina en pregunta). */
export function timelineMulti(escenas, fps = FPS, t = T) {
  const f = (s) => Math.round(s * fps);
  let cursor = f(t.intro), cartelFrom;
  const cartel = () => { cartelFrom = cursor; cursor += f(t.cartel); };
  const out = escenas.map((esc, i) => {
    if (t.cartel && i === (t.cartelTras ?? 0)) cartel();
    let local = f(t.entrada);
    const frases = esc.frases.map((fr) => {
      // Manda la voz en inglés (la que va en el video); los otros idiomas son solo subtítulos.
      const seg = fr.segundos.en ?? Math.max(...Object.values(fr.segundos));
      const dur = Math.ceil(seg * fps);
      const item = { texto: fr.texto, audio: fr.audio, from: local, dur };
      local += dur + f(t.pausa);
      return item;
    });
    const durationInFrames = local - f(t.pausa) + f(t.salida) + (i === escenas.length - 1 ? f(t.salidaFinal ?? 0) : 0);
    const r = { id: esc.id, from: cursor, durationInFrames, frases };
    cursor += durationInFrames;
    return r;
  });
  if (t.cartel && cartelFrom === undefined) cartel();
  return { fps, introFrames: f(t.intro), outroFrames: f(t.outro), total: cursor + f(t.outro), escenas: out, ...(t.cartel ? { cartelFrom, cartelFrames: f(t.cartel) } : {}) };
}

/** Subtítulos .srt de un idioma. */
export function srt(tl, idioma) {
  const ts = (fr) => {
    const ms = Math.round((fr / tl.fps) * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
  };
  let n = 0;
  return tl.escenas.flatMap((e) => e.frases.filter((fr) => fr.texto[idioma]).map((fr) => `${++n}\n${ts(e.from + fr.from)} --> ${ts(e.from + fr.from + fr.dur)}\n${fr.texto[idioma]}\n`)).join('\n');
}
