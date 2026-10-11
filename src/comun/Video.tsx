import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { C, Escena, Fondo, Meandro, TituloEscena, Subtitulo, TITULO, TEXTO, ap } from './comun';

type Frase = { texto: string; audio: string; from: number; dur: number };
type EscenaTL = { id: string; titulo: string; from: number; durationInFrames: number; frases: Frase[] };
export type Timeline = { fps: number; introFrames: number; outroFrames: number; total: number; escenas: EscenaTL[] };
export type Guion = { civilizacion: string; titulo: string; subtitulo: string };

const Portada: React.FC<{ g: Guion; dur: number }> = ({ g, dur }) => {
  const f = useCurrentFrame();
  const o = Math.min(ap(f, 0, 25), interpolate(f, [dur - 15, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Fondo />
        <Meandro y={0} />
        <Meandro y={1020} />
      </svg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: C.crema, textShadow: `0 4px 0 ${C.negro}` }}>
        <div style={{ fontFamily: TITULO, fontSize: 44, letterSpacing: 12, opacity: ap(f, 5, 20) }}>{g.civilizacion.toUpperCase()}</div>
        <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 130, margin: '20px 0', transform: `scale(${0.92 + ap(f, 12, 30) * 0.08})`, opacity: ap(f, 12, 25) }}>{g.titulo}</div>
        <div style={{ fontFamily: TEXTO, fontSize: 50, opacity: ap(f, 30, 25) }}>{g.subtitulo}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Final: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const o = Math.min(ap(f, 0, 20), interpolate(f, [dur - 20, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <AbsoluteFill style={{ backgroundColor: C.noche, justifyContent: 'center', alignItems: 'center', opacity: o }}>
      <div style={{ fontFamily: TITULO, fontSize: 64, color: C.crema, letterSpacing: 10 }}>MITOLOGÍAS DEL MUNDO</div>
    </AbsoluteFill>
  );
};

export const Video: React.FC<{ guion: Guion; timeline: Timeline; escenas: Record<string, React.FC<Escena>>; musica: string }> = ({ guion, timeline, escenas, musica }) => (
  <AbsoluteFill style={{ backgroundColor: C.noche }}>
    <Audio src={staticFile(musica)} volume={(f) => interpolate(f, [0, timeline.introFrames, timeline.total - 60, timeline.total], [0.5, 0.2, 0.2, 0], { extrapolateRight: 'clamp' })} />
    <Sequence durationInFrames={timeline.introFrames}>
      <Portada g={guion} dur={timeline.introFrames} />
    </Sequence>
    {timeline.escenas.map((e) => {
      const Comp = escenas[e.id];
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
