// Calcula en qué frame arranca cada escena y cada frase a partir de la duración del audio.
export const TIEMPOS = { intro: 4.5, entrada: 0.6, pausaFrase: 0.35, salida: 1.0, outro: 3 };

export function calcularTimeline(escenas, fps, t = TIEMPOS) {
  const f = (s) => Math.round(s * fps);
  let cursor = f(t.intro);
  const out = escenas.map((esc) => {
    let local = f(t.entrada);
    const frases = esc.frases.map((fr) => {
      const dur = Math.ceil(fr.segundos * fps);
      const item = { texto: fr.texto, audio: fr.audio, from: local, dur };
      local += dur + f(t.pausaFrase);
      return item;
    });
    const durationInFrames = local - f(t.pausaFrase) + f(t.salida);
    const escena = { id: esc.id, titulo: esc.titulo, from: cursor, durationInFrames, frases };
    cursor += durationInFrames;
    return escena;
  });
  return { fps, introFrames: f(t.intro), outroFrames: f(t.outro), total: cursor + f(t.outro), escenas: out };
}
