// Learn Bible 777: el texto que se narra, en pantalla, como leyendo la Biblia. Horizontal: arriba a la izquierda,
// "Genesis 1:3" y debajo el texto, misma letra, entrando y saliendo difuminado. Vertical: "1:3" chico antes de la frase, en la franja de subtítulos.
// Los números salen solos de kjv.json (lib/versiculos.mjs); las frases que no son KJV van sin número.
import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { TEXTO, cl } from '../comun/vasija';
import { versiculosDeGuion, referencia, type Ref } from '../../lib/versiculos.mjs';
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

/** Arriba a la izquierda, como leyendo: "Genesis 1:3" y debajo el texto, con la misma letra; entra y sale difuminándose. */
export const LeyendaBiblia: React.FC<{ guion: GuionVisual; timeline: Timeline; idioma?: Idioma }> = ({ guion, timeline, idioma = 'en' }) => {
  const f = useCurrentFrame();
  const fr = useFraseBiblia(guion, timeline, idioma);
  if (!fr || !fr.texto) return null;
  const ent = interpolate(f, [fr.desde, fr.desde + 9], [0, 1], cl), sal = interpolate(f, [fr.hasta - 7, fr.hasta], [1, 0], cl);
  const o = Math.min(ent, sal);
  const libro = KJV_LIBRO[guion.id] ?? '';
  const estilo: React.CSSProperties = { fontFamily: TEXTO, fontWeight: 700, fontVariant: 'small-caps', color: '#F3DDA6', textShadow: SOMBRA };
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 64, top: 44, width: 820, opacity: o, filter: `blur(${(1 - o) * 8}px)`, transform: `translateY(${(1 - ent) * 10 - (1 - sal) * 6}px)` }}>
        {fr.ref && <div style={{ ...estilo, fontSize: 36, letterSpacing: 3, marginBottom: 10 }}>{libro} {referencia(fr.ref)}</div>}
        <div style={{ ...estilo, fontSize: 42, letterSpacing: 1.2, lineHeight: 1.3, color: '#FBF3E2', textWrap: 'pretty' } as React.CSSProperties}>{fr.texto}</div>
      </div>
    </AbsoluteFill>
  );
};
