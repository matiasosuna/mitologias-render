// Versión vertical de los episodios (Reels en partes, `<id>-parte` y `<id>-vertical`) a ritmo de Short nativo:
// misma voz de cada frase pero a 1,1× (≈1,22× la pista de 0,9 del episodio) y sin silencio en las puntas, 0,12 s entre
// frases, ~0,35 s entre escenas y portada de 1 s. El episodio horizontal de YouTube no cambia (timeline.json, 0,9×).
// El audio rápido se deriva en public/audio/<id>/en-rapido/ (no va a git; lo arma scripts/vertical-rapido.mjs).
import { timelineMulti, T, T_SHORT, TEMPO_EN } from './motor-tiempos.mjs';
import { TEMPO_SHORT, pendienteAudio, filtroAudio } from './short.mjs';

/** Tiempos del vertical rápido: huecos de Short; la portada queda 1 s (el cartel gancho de cada parte ya abre). */
export const T_VERTICAL_RAPIDO = { intro: 1, entrada: T_SHORT.entrada, pausa: T_SHORT.pausa, salida: T_SHORT.salida, outro: T.outro };
/** Objetivo del audio rápido (igual que los Shorts). */
export const OBJETIVO_RAPIDO = { tempo: TEMPO_SHORT, recortar: true };
export const DIR_RAPIDO = 'en-rapido';

/** audio/<id>/en/x.wav → audio/<id>/en-rapido/x.wav */
export const rutaRapida = (rel) => rel.replace(/\/en\/([^/]+)$/, `/${DIR_RAPIDO}/$1`);

/** Filtro -af de ffmpeg que lleva un .wav del episodio al ritmo rápido. `prev` = su valor en .tempo.json; sin registro
 *  vale TEMPO_EN (los episodios viejos de ElevenLabs ya salieron a 0,9). null = no hay nada que hacer (copiar). */
export function filtroRapido(prev) {
  const p = pendienteAudio(prev ?? TEMPO_EN, OBJETIVO_RAPIDO);
  return p ? filtroAudio(p) : null;
}

/** Segundos estimados del audio rápido sin medirlo (cota de arriba: el recorte de silencio solo acorta). */
export const segundosEstimados = (segLento, prev = TEMPO_EN) => segLento * ((typeof prev === 'number' ? prev : prev?.tempo ?? TEMPO_EN) / TEMPO_SHORT);

/** Timeline rápido a partir del timeline del episodio: mismas escenas y frases (mismo orden e índices, así el guion
 *  visual sigue valiendo), con el audio de en-rapido y sus segundos. `segundos(rutaRapida)` da la duración medida;
 *  si devuelve undefined se estima desde la frase lenta. */
export function timelineRapido(tl, segundos = () => undefined) {
  const escenas = tl.escenas.map((e) => ({
    id: e.id,
    frases: e.frases.map((fr) => {
      const en = fr.audio?.en ? rutaRapida(fr.audio.en) : null;
      const s = (en && segundos(en)) ?? segundosEstimados(fr.dur / tl.fps);
      return { texto: fr.texto, audio: en ? { en } : {}, segundos: { en: s } };
    }),
  }));
  return { ...timelineMulti(escenas, tl.fps, T_VERTICAL_RAPIDO), ritmo: 'rapido' };
}
