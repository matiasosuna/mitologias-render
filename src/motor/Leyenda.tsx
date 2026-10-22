// Learn Bible 777: el texto que se narra, en pantalla, como leyendo la Biblia. Horizontal: el texto en la zona libre de la
// escena y "Genesis 1:3" fijo arriba a la izquierda. Vertical: "1:3" chico antes de la frase, en la franja de subtítulos.
// Los números salen solos de kjv.json (lib/versiculos.mjs); las frases que no son KJV van sin número.
import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { TEXTO, cl } from '../comun/vasija';
import { versiculosDeGuion, referencia, zonaVersiculo, type Ref } from '../../lib/versiculos.mjs';
import { KJV, KJV_LIBRO } from './kjv';
import type { GuionVisual, Timeline, Idioma } from './tipos';

/** Frase que suena en el cuadro f (queda 8 cuadros más, salvo que ya arranque la siguiente), con su versículo. */
export const useFraseBiblia = (guion: GuionVisual, timeline: Timeline, idioma: Idioma = 'en') => {
  const f = useCurrentFrame();
  const refs = useMemo(() => (KJV[guion.id] ? versiculosDeGuion(guion, KJV[guion.id], idioma) : null), [guion, idioma]);
  const i = timeline.escenas.findIndex((e) => f >= e.from && f < e.from + e.durationInFrames);
  if (i < 0) return null;
  const esc = timeline.escenas[i];
  const j = esc.frases.findIndex((fr, k) => f - esc.from >= fr.from && f - esc.from < Math.min(fr.from + fr.dur + 8, esc.frases[k + 1]?.from ?? Infinity));
  if (j < 0) return null;
  const fr = esc.frases[j], t = guion.escenas[i]?.frases[j];
  const ref: Ref = refs?.[i]?.[j] ?? null;
  return { escena: i, texto: t?.[idioma] ?? t?.es ?? '', ref, desde: esc.from + fr.from, hasta: esc.from + Math.min(fr.from + fr.dur + 8, esc.frases[j + 1]?.from ?? Infinity) };
};

/** Número de versículo estilo Biblia: chico, dorado, un poco arriba de la línea. */
export const NumeroVersiculo: React.FC<{ r: Ref; size: number }> = ({ r, size }) => (r ? <span style={{ fontSize: size * 0.6, fontWeight: 700, color: '#E8C987', letterSpacing: 1, marginRight: size * 0.28, position: 'relative', top: -size * 0.32 }}>{referencia(r)}</span> : null);

const SOMBRA = '0 0 3px rgba(18,12,8,.95), 0 0 10px rgba(18,12,8,.75), 0 0 26px rgba(18,12,8,.55), 0 2px 2px rgba(0,0,0,.6)';

/** Texto del versículo sin franja, en la zona libre de la escena (cielo o suelo), y la referencia fija arriba a la izquierda. */
export const LeyendaBiblia: React.FC<{ guion: GuionVisual; timeline: Timeline; idioma?: Idioma }> = ({ guion, timeline, idioma = 'en' }) => {
  const f = useCurrentFrame();
  const fr = useFraseBiblia(guion, timeline, idioma);
  if (!fr || !fr.texto) return null;
  const o = Math.min(interpolate(f, [fr.desde, fr.desde + 5], [0, 1], cl), interpolate(f, [fr.hasta - 4, fr.hasta], [1, 0], cl));
  const arriba = zonaVersiculo(guion.escenas[fr.escena]) === 'arriba';
  const T = 46;
  const libro = KJV_LIBRO[guion.id] ?? '';
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {fr.ref && (
        <div style={{ position: 'absolute', left: 64, top: 44, fontFamily: TEXTO, fontSize: 34, fontWeight: 700, letterSpacing: 3, fontVariant: 'small-caps', color: '#F3DDA6', textShadow: SOMBRA, opacity: o }}>
          {libro} {referencia(fr.ref)}
        </div>
      )}
      <div style={{ position: 'absolute', left: 200, right: 200, ...(arriba ? { top: 120 } : { bottom: 40 }), textAlign: 'center', fontFamily: TEXTO, fontSize: T, lineHeight: 1.25, color: '#FBF3E2', textShadow: SOMBRA, opacity: o, textWrap: 'balance' } as React.CSSProperties}>
        {fr.texto}
      </div>
    </AbsoluteFill>
  );
};
