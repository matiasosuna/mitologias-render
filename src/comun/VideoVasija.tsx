import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { C, TEXTO, TITULO, ap, cl, Guardas, ABAJO } from './vasija';
import type { Timeline, Guion } from './Video';

export type EscenaV = { dur: number; at: (i: number) => number; fin: (i: number) => number };

const Portada: React.FC<{ g: Guion; dur: number; numero?: string }> = ({ g, dur, numero }) => {
  const f = useCurrentFrame();
  const o = Math.min(ap(f, 0, 20), interpolate(f, [dur - 15, dur], [1, 0], cl));
  return (
    <AbsoluteFill style={{ opacity: o, backgroundColor: C.barro }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <radialGradient id="cieloP" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor={C.barroClaro} />
            <stop offset="100%" stopColor={C.barroOscuro} />
          </radialGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#cieloP)" />
        <Guardas desplaz={f * 0.6} />
      </svg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: C.crema, paddingBottom: 120, textShadow: `0 4px 0 ${C.negro}` }}>
        <div style={{ fontFamily: TITULO, fontSize: 40, letterSpacing: 12, opacity: ap(f, 5, 20) }}>{g.civilizacion.toUpperCase()}{numero ? ` · ${numero}` : ''}</div>
        <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 118, margin: '18px 60px', lineHeight: 1.05, transform: `scale(${0.94 + ap(f, 10, 30) * 0.06})`, opacity: ap(f, 10, 25) }}>{g.titulo}</div>
        <div style={{ fontFamily: TEXTO, fontSize: 48, opacity: ap(f, 28, 25) }}>{g.subtitulo}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Final: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const o = Math.min(ap(f, 0, 20), interpolate(f, [dur - 20, dur], [1, 0], cl));
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro, justifyContent: 'center', alignItems: 'center', opacity: o }}>
      <div style={{ fontFamily: TITULO, fontSize: 60, color: C.crema, letterSpacing: 10 }}>MITOLOGÍAS DEL MUNDO</div>
    </AbsoluteFill>
  );
};

const TituloEscena: React.FC<{ texto: string }> = ({ texto }) => {
  const f = useCurrentFrame();
  const o = ap(f, 6, 18) * interpolate(f, [100, 125], [1, 0], cl);
  if (!texto) return null;
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 150 }}>
      <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 46, color: C.crema, letterSpacing: 6, opacity: o, textShadow: `0 3px 0 ${C.negro}, 0 0 18px rgba(0,0,0,.5)` }}>{texto.toUpperCase()}</div>
    </AbsoluteFill>
  );
};

const Subtitulo: React.FC<{ texto: string; dur: number }> = ({ texto, dur }) => {
  const f = useCurrentFrame();
  const o = Math.min(ap(f, 0, 6), interpolate(f, [dur + 4, dur + 10], [1, 0], cl));
  return (
    <AbsoluteFill style={{ top: ABAJO + 126, height: 1080 - (ABAJO + 126), justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ maxWidth: 1700, textAlign: 'center', fontFamily: TEXTO, fontWeight: 500, fontSize: texto.length > 95 ? 36 : 40, lineHeight: 1.15, color: C.crema, opacity: o }}>{texto}</div>
    </AbsoluteFill>
  );
};

/** Video completo en estilo vasija: portada, escenas con narración y subtítulos, cierre. */
export const VideoVasija: React.FC<{ guion: Guion; timeline: Timeline; escenas: Record<string, React.FC<EscenaV>>; numero?: string; musica?: string }> = ({ guion, timeline, escenas, numero, musica = 'musica/lira-griega.wav' }) => (
  <AbsoluteFill style={{ backgroundColor: C.negro }}>
    <Audio src={staticFile(musica)} volume={(fr) => interpolate(fr, [0, timeline.introFrames, timeline.total - 60, timeline.total], [0.45, 0.18, 0.18, 0], cl)} />
    <Sequence durationInFrames={timeline.introFrames}>
      <Portada g={guion} dur={timeline.introFrames} numero={numero} />
    </Sequence>
    {timeline.escenas.map((e) => {
      const Comp = escenas[e.id];
      if (!Comp) throw new Error(`Falta la escena "${e.id}"`);
      const at = (i: number) => e.frases[i].from;
      const fin = (i: number) => e.frases[i].from + e.frases[i].dur;
      return (
        <Sequence key={e.id} from={e.from} durationInFrames={e.durationInFrames}>
          <Comp dur={e.durationInFrames} at={at} fin={fin} />
          <TituloEscena texto={e.titulo} />
          {e.frases.map((fr, i) => (
            <Sequence key={i} from={fr.from} durationInFrames={fr.dur + 12}>
              <Audio src={staticFile(fr.audio)} />
              <Subtitulo texto={fr.texto} dur={fr.dur} />
            </Sequence>
          ))}
        </Sequence>
      );
    })}
    <Sequence from={timeline.total - timeline.outroFrames}>
      <Final dur={timeline.outroFrames} />
    </Sequence>
  </AbsoluteFill>
);
