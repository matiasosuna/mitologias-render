// Learn Bible 777: el texto que se narra, en pantalla, como leyendo la Biblia. Horizontal: arriba a la izquierda,
// "Genesis 1:3" y debajo el texto, misma letra, entrando y saliendo difuminado. Vertical: "1:3" chico antes de la frase, en la franja de subtítulos.
// Los números salen solos de kjv.json (lib/versiculos.mjs); las frases que no son KJV van sin número.
import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { TEXTO, cl } from '../comun/vasija';
import { versiculosDeGuion, referencia, type Ref } from '../../lib/versiculos.mjs';
import { KJV, KJV_LIBRO } from './kjv';
import { palabras, palabraEn } from '../../lib/karaoke.mjs';
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
  return { escena: i, texto: t?.[idioma] ?? t?.es ?? '', ref, desde: esc.from + fr.from, dur: fr.dur, hasta: esc.from + Math.min(fr.from + fr.dur + 8, esc.frases[j + 1]?.from ?? Infinity) };
};

/** Número de versículo estilo Biblia: chico, dorado, un poco arriba de la línea. */
export const NumeroVersiculo: React.FC<{ r: Ref; size: number }> = ({ r, size }) => (r ? <span style={{ fontSize: size * 0.6, fontWeight: 700, color: '#E8C987', letterSpacing: 1, marginRight: size * 0.28, position: 'relative', top: -size * 0.32 }}>{referencia(r)}</span> : null);

const SOMBRA = '0 0 3px rgba(18,12,8,.95), 0 0 10px rgba(18,12,8,.75), 0 0 26px rgba(18,12,8,.55), 0 2px 2px rgba(0,0,0,.6)';

/** Palabras con la que suena resaltada (karaoke, lib/karaoke.mjs). `k` = índice de la palabra que suena (−1: ninguna). */
export const Karaoke: React.FC<{ ws: string[]; k: number; desde?: number; color: string; actual: string }> = ({ ws, k, desde = 0, color, actual }) => (
  <>{ws.map((w, i) => <span key={i} style={{ color: desde + i === k ? actual : color }}>{w}{i < ws.length - 1 ? ' ' : ''}</span>)}</>
);

/** Texto con la letra del versículo (versalitas, sombra), que entra y sale difuminándose entre `desde` y `hasta` (cuadros),
 *  karaoke: crema con la palabra que suena dorada (la voz dura `dur` cuadros desde `desde`).
 *  `cabeza` = la referencia arriba ("Genesis 1:3"); sin ella (marco: gancho, invitación) va solo el texto. */
export const TextoLeyenda: React.FC<{ texto: string; desde: number; hasta: number; dur?: number; cabeza?: string; left?: number; top?: number; width?: number; size?: number }> = ({ texto, desde, hasta, dur, cabeza, left = 64, top = 44, width = 820, size = 42 }) => {
  const f = useCurrentFrame();
  const ent = interpolate(f, [desde, desde + 9], [0, 1], cl), sal = interpolate(f, [hasta - 7, hasta], [1, 0], cl);
  const o = Math.min(ent, sal);
  const k = dur ? palabraEn(texto, dur, f - desde) : -1;
  const estilo: React.CSSProperties = { fontFamily: TEXTO, fontWeight: 700, fontVariant: 'small-caps', color: '#F3DDA6', textShadow: SOMBRA };
  return (
    <div style={{ position: 'absolute', left, top, width, opacity: o, filter: `blur(${(1 - o) * 8}px)`, transform: `translateY(${(1 - ent) * 10 - (1 - sal) * 6}px)` }}>
      {cabeza && <div style={{ ...estilo, fontSize: size * 36 / 42, letterSpacing: 3, marginBottom: 10 }}>{cabeza}</div>}
      <div style={{ ...estilo, fontSize: size, letterSpacing: 1.2, lineHeight: 1.3, color: CREMA, textWrap: 'pretty' } as React.CSSProperties}><Karaoke ws={palabras(texto)} k={k} color={CREMA} actual={DORADO} /></div>
    </div>
  );
};

/** Colores del karaoke en escena (sobre el cielo): crema y la palabra que suena dorada. */
export const CREMA = '#FBF3E2', DORADO = '#E8C987';

/** Arriba a la izquierda, como leyendo: "Genesis 1:3" y debajo el texto, con la misma letra; entra y sale difuminándose. */
export const LeyendaBiblia: React.FC<{ guion: GuionVisual; timeline: Timeline; idioma?: Idioma }> = ({ guion, timeline, idioma = 'en' }) => {
  const fr = useFraseBiblia(guion, timeline, idioma);
  if (!fr || !fr.texto) return null;
  const libro = KJV_LIBRO[guion.id] ?? '';
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <TextoLeyenda texto={fr.texto} desde={fr.desde} hasta={fr.hasta} dur={fr.dur} cabeza={fr.ref ? `${libro} ${referencia(fr.ref)}` : undefined} />
    </AbsoluteFill>
  );
};
