// Gancho al principio (lib/marco.mjs, cualquier serie): la voz arranca en el cuadro 0 y lo que dice está en pantalla, grande,
// con la letra de los títulos de Myths (sin pergamino), en páginas de ≤ 3–4 renglones con la palabra que suena resaltada.
// La primera página ya está entera en el cuadro 0 (sin fundido de entrada). ZoomLento = movimiento desde el primer cuadro.
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { C, TITULO, cl } from '../comun/vasija';
import { Karaoke } from './Leyenda';
import { palabraEn, paginar, paginaDe } from '../../lib/karaoke.mjs';

type FraseG = { texto: { en?: string; es?: string }; from: number; dur: number };

/** Texto del gancho. `frases` con `from` relativo al cuadro `f` que se pasa. */
export const TextoGancho: React.FC<{ frases: FraseG[]; f: number; top: number; ancho: number; size: number; chars: number; renglones?: number; fin?: number }> = ({ frases, f, top, ancho, size, chars, renglones = 3, fin = Infinity }) => {
  // la frase se queda hasta que arranca la siguiente (sin parpadeo en las pausas cortas)
  const j = frases.findIndex((x, k) => f >= (k === 0 ? 0 : x.from) && f < (frases[k + 1]?.from ?? fin));
  if (j < 0) return null;
  const fr = frases[j], texto = fr.texto.en ?? fr.texto.es ?? '';
  const k = palabraEn(texto, fr.dur, f - fr.from);
  const pags = paginar(texto, chars, renglones), ip = paginaDe(pags, k), pag = pags[ip];
  const inicioPag = ip === 0 ? fr.from : fr.from + Math.round((pag.desde / Math.max(1, texto.split(/\s+/).length)) * fr.dur);
  const o = j === 0 && ip === 0 ? 1 : interpolate(f, [inicioPag, inicioPag + 4], [0.25, 1], cl);
  const sal = fin === Infinity ? 1 : interpolate(f, [fin - 5, fin], [1, 0], cl);
  return (
    <div style={{ position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ width: ancho, textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: size, lineHeight: 1.12, color: '#FFF4E0', opacity: o * sal,
        textShadow: `0 ${Math.round(size / 18)}px 0 ${C.negro}, 0 0 ${Math.round(size / 3)}px rgba(0,0,0,.75), 0 0 6px rgba(0,0,0,.9)` }}>
        {pag.renglones.map((r, ri) => <div key={ri}><Karaoke ws={r} k={k} desde={pag.desde + pag.renglones.slice(0, ri).flat().length} color="#FFF4E0" actual="#F2C55C" /></div>)}
      </div>
    </div>
  );
};

/** Zoom lento (1 → 1,07) de lo que envuelve, durante `dur` cuadros. */
export const ZoomLento: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, Math.max(1, dur)], [1, 1.07], { ...cl, easing: Easing.inOut(Easing.sin) });
  return <AbsoluteFill style={{ transform: `scale(${z.toFixed(4)})`, transformOrigin: '50% 45%' }}>{children}</AbsoluteFill>;
};

/** Velo oscuro para que el texto se lea sobre cualquier fondo. */
export const VeloGancho: React.FC<{ vertical?: boolean }> = ({ vertical }) => (
  <AbsoluteFill style={{ background: vertical ? 'linear-gradient(rgba(10,7,5,.55), rgba(10,7,5,.35) 45%, rgba(10,7,5,.1) 75%)' : 'radial-gradient(ellipse at 50% 42%, rgba(10,7,5,.55), rgba(10,7,5,.2) 70%)' }} />
);

/** Texto del gancho dentro de una Sequence (cuadro relativo a ella). */
export const TextoGanchoSeq: React.FC<{ frases: FraseG[]; top: number; ancho: number; size: number; chars: number; renglones?: number; fin?: number }> = (p) => {
  const f = useCurrentFrame();
  return <TextoGancho {...p} f={f} />;
};
