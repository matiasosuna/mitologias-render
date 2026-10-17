// Versión horizontal 16:9 de un Short "Who is…?" (`<id>-horizontal`, video normal de YouTube en la lista
// "<Mitología>: Who's Who"). NO es un recorte del vertical: las escenas se ven enteras como en los episodios (fondo
// completo, personajes a su escala, foco del Short en el centro). Misma voz y mismo timeline que el Short
// (lib/quien.mjs › timelineHorizontal): cold open → cartel "Who is Zeus?" de 2 s (estilo del gancho de los episodios,
// con el muñeco oficial) → la historia → pantalla final de 12 s de los episodios. Sin subtítulos quemados (van en .srt).
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { C, TITULO, TEXTO, ap, cl, Guardas, TEMA, aplicarTema, CalidadHD, FiltrosHD, SUELO } from '../comun/vasija';
import { EscenaMotor, estadoActor } from './Escena';
import { ELENCO, DibujarActor } from './elenco';
import { Final } from './VideoMotor';
import { textosQuien, timelineHorizontal, escenaHorizontal, mitologiaEn } from '../../lib/quien.mjs';
import { escenasDe } from '../../lib/short.mjs';
import type { GuionVisual, Timeline, Idioma, Escena, Actor, EscenaTL } from './tipos';

/** Cartel "Who is Zeus?" horizontal: fondo y guardas del gancho de los episodios, el muñeco oficial grande a la
 *  izquierda (parado sobre el friso de abajo) y el título, el subtítulo y la mitología a la derecha. */
export const CartelQuienHorizontal: React.FC<{ guion: GuionVisual; dur: number; idioma?: Idioma }> = ({ guion, dur, idioma = 'en' }) => {
  aplicarTema(guion.serie);
  const f = useCurrentFrame();
  const q = guion.quien!;
  const t = textosQuien(q, idioma);
  const claro = TEMA.nombre !== 'vasija';
  const actor: Actor = { id: 'quien', como: q.como, x: 0, escala: q.escala ?? 1 };
  const tl: EscenaTL = { id: 'quien', from: 0, durationInFrames: dur, frases: [{ texto: { es: '' }, audio: {}, from: 0, dur }] };
  const ficha = ELENCO[q.como] ?? ELENCO.hombre;
  const { e } = estadoActor(actor, tl, f, ficha);
  const K = 1.15 * (0.95 + 0.05 * ap(f, 0, 14)); // muñeco con cetro y águila ~640 px: entra entero entre las guardas (126 → 830)
  const tam = t.titulo.length <= 14 ? 128 : t.titulo.length <= 20 ? 108 : 90;
  const o = Math.min(1, interpolate(f, [dur - 8, dur], [1, 0], cl));
  return (
    <AbsoluteFill style={{ backgroundColor: C.barro, opacity: o }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs><radialGradient id="cieloQ" cx="32%" cy="45%" r="80%"><stop offset="0%" stopColor={C.barroClaro} /><stop offset="100%" stopColor={C.barroOscuro} /></radialGradient></defs>
        <FiltrosHD />
        <rect width={1920} height={1080} fill="url(#cieloQ)" />
        <g opacity={ap(f, 0, 8)} transform={`translate(560 ${SUELO + 40}) scale(${K})`}>
          <ellipse cx={0} cy={0} rx={170} ry={16} fill={C.negro} opacity={0.25} />
          <DibujarActor ficha={ficha} e={{ ...e, x: 0, y: 0 }} f={f} />
        </g>
        <Guardas desplaz={f * 0.6} />
      </svg>
      <AbsoluteFill style={{ left: 950, width: 860, justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingBottom: 120, fontFamily: TITULO, color: claro ? C.negro : C.crema, textShadow: claro ? `0 3px 0 ${C.blanco}` : `0 4px 0 ${C.negro}` }}>
        <div style={{ fontWeight: 700, fontSize: tam, lineHeight: 1.05, opacity: ap(f, 0, 8), transform: `scale(${0.92 + ap(f, 0, 12) * 0.08})` }}>{t.titulo}</div>
        <div style={{ marginTop: 28, fontFamily: TEXTO, fontSize: 46, lineHeight: 1.2, opacity: ap(f, 6, 10) }}>{t.subtitulo}</div>
        <div style={{ marginTop: 40, fontSize: 36, letterSpacing: 8, opacity: ap(f, 10, 10) }}>{`${mitologiaEn(guion.serie)} · Who's Who`.toUpperCase()}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const duracionHorizontal = (timeline: Timeline) => timelineHorizontal(timeline).total;

export const ShortHorizontal: React.FC<{ guion: GuionVisual; timeline: Timeline; idioma?: Idioma }> = ({ guion, timeline, idioma = 'en' }) => {
  aplicarTema(guion.serie);
  const tl = timelineHorizontal(timeline) as Timeline;
  const escenas = (escenasDe(guion) as Escena[]).map((e) => escenaHorizontal(e) as Escena);
  const finHistoria = tl.total - tl.outroFrames;
  const c0 = tl.cartelFrom!, c1 = c0 + tl.cartelFrames!;
  return (
    <CalidadHD.Provider value={guion.hd !== false}>
      <AbsoluteFill style={{ backgroundColor: C.negro }}>
        {/* música: baja con la voz, sube en el cartel (sin voz) y en la pantalla final, y se apaga al terminar */}
        <Audio src={staticFile(TEMA.musica)} volume={(fr) => interpolate(fr, [0, c0 + 1, c0 + 7, c1 - 6, c1, finHistoria, finHistoria + 12, tl.total - 48, tl.total], [0.16, 0.16, 0.32, 0.32, 0.16, 0.16, 0.3, 0.3, 0], cl)} />
        {tl.escenas.map((e, i) => (
          <Sequence key={e.id} from={e.from} durationInFrames={e.durationInFrames}>
            <EscenaMotor esc={escenas[i]} tl={e} idioma={idioma} />
            {e.frases.map((fr, j) => fr.audio[idioma] ? <Sequence key={j} from={fr.from} durationInFrames={fr.dur + 6}><Audio src={staticFile(fr.audio[idioma]!)} /></Sequence> : null)}
          </Sequence>
        ))}
        {guion.quien && <Sequence from={c0} durationInFrames={tl.cartelFrames}><CartelQuienHorizontal guion={guion} dur={tl.cartelFrames!} idioma={idioma} /></Sequence>}
        <Sequence from={finHistoria}><Final dur={tl.outroFrames} siguiente={guion.cierre?.[idioma] ?? guion.cierre?.es} etiqueta="FULL EPISODE" /></Sequence>
      </AbsoluteFill>
    </CalidadHD.Provider>
  );
};
