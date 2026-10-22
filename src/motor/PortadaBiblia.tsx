// Learn Bible 777: portada de pergamino de cada parte de los Reels (diseño aprobado: learn-bible/marca/portada/portada1.html).
// "The First Book of Moses, called" / GENESIS / ❦ / CHAPTER 1 / The Creation / PART n OF 3, animada como la carta de Hermes Tarot:
// la página respira (zoom lento), luz dorada que late detrás del texto, polvo dorado flotando y los textos entran en orden.
// Debajo de "PART n OF 3", el gancho y la invitación narrados en karaoke (tinta oscura, la palabra que suena en rojo).
// Todo entra en ENTRADA_PORTADA cuadros: desde ahí el cuadro es la portada completa (tapa de la grilla de IG).
import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont as cargarCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as cargarCinzelDec } from '@remotion/google-fonts/CinzelDecorative';
import { loadFont as cargarGaramond } from '@remotion/google-fonts/EBGaramond';
import { azar, cl, TEMA } from '../comun/vasija';
import { Karaoke } from './Leyenda';
import { KJV_LIBRO, capituloDe, ENCABEZADO_KJV } from './kjv';
import { palabraEn, paginar, paginaDe } from '../../lib/karaoke.mjs';
import type { GuionVisual, TramoMarco } from './tipos';

const { fontFamily: CINZEL } = cargarCinzel('normal', { weights: ['500', '700', '900'], subsets: ['latin'] });
const { fontFamily: CINZEL_DEC } = cargarCinzelDec('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: GARAMOND } = cargarGaramond('normal', { weights: ['500', '600'], subsets: ['latin'] });
const { fontFamily: GARAMOND_IT } = cargarGaramond('italic', { weights: ['500'], subsets: ['latin'] });

/** Cuadros hasta que todo entró (la tapa de IG con thumbOffset de 1 s ya la ve completa). */
export const ENTRADA_PORTADA = 22;
const TINTA = '#2e1a0c', ROJO = '#8b1a1a', ORO = '#a07a2c';
const sube = (f: number, a: number) => interpolate(f, [a, a + 8], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });

export const PortadaBiblia: React.FC<{ guion: GuionVisual; n: number; de: number; tramo?: TramoMarco | null; dur: number; musica?: boolean }> = ({ guion, n, de, tramo, dur, musica = true }) => {
  const f = useCurrentFrame();
  const libro = KJV_LIBRO[guion.id] ?? guion.titulo.en ?? '';
  const pre = ENCABEZADO_KJV[libro];
  const zoom = interpolate(f, [0, dur], [1, 1.045], { ...cl, easing: Easing.inOut(Easing.sin) });
  const late = 0.5 + 0.5 * Math.sin(f / 22);
  const luz = 0.2 + 0.3 * late; // luz dorada detrás del texto, 0,2–0,5
  const sal = interpolate(f, [dur - 6, dur], [1, 0], cl);
  const el = (a: number): React.CSSProperties => { const o = sube(f, a); return { opacity: o, transform: `translateY(${(1 - o) * 18}px)` }; };
  const resplandor = (a: number) => { const o = sube(f, a); return `0 2px 0 rgba(255,240,200,.5), 0 0 ${(10 + 26 * o * (0.7 + 0.3 * late)).toFixed(1)}px rgba(242,184,75,${(0.25 + 0.35 * o).toFixed(2)})`; };
  // subtítulo karaoke: la frase que suena, en páginas de ≤ 3 renglones
  const j = tramo ? tramo.frases.findIndex((x, k) => f >= x.from && f < Math.min(x.from + x.dur + 8, tramo.frases[k + 1]?.from ?? Infinity)) : -1;
  const fr = j >= 0 ? tramo!.frases[j] : null;
  const texto = fr?.texto.en ?? '';
  const k = fr ? palabraEn(texto, fr.dur, f - fr.from) : -1;
  const pags = paginar(texto, 22, 3), pag = pags[paginaDe(pags, k)];
  const oSub = fr ? Math.min(interpolate(f, [fr.from, fr.from + 6], [0, 1], cl), interpolate(f, [fr.from + fr.dur + 2, fr.from + fr.dur + 8], [1, 0], cl)) : 0;
  return (
    <AbsoluteFill style={{ background: '#1a0f08', opacity: sal }}>
      <AbsoluteFill style={{ transform: `scale(${zoom.toFixed(4)})` }}>
        <Img src={staticFile('biblia/pergamino.jpg')} style={{ width: 1080, height: 1920, objectFit: 'cover' }} />
        {/* luz dorada que late detrás del texto (no detrás del subtítulo) */}
        <div style={{ position: 'absolute', left: 140, top: 300, width: 800, height: 860, background: `radial-gradient(ellipse at 50% 50%, rgba(255,226,150,${luz.toFixed(3)}) 0%, rgba(255,226,150,0) 68%)` }} />
        <div style={{ position: 'absolute', left: 168, top: 214, width: 744, height: 1490, boxShadow: `inset 0 0 ${(50 + 40 * late).toFixed(0)}px rgba(242,184,75,${(0.3 + 0.25 * late).toFixed(3)})` }} />
      </AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 40 }, (_, i) => {
          const x = azar(i) * 1080, y = ((azar(i + 50) * 1920 - f * (0.35 + azar(i + 9) * 0.6)) % 1920 + 1920) % 1920;
          return <circle key={i} cx={x} cy={y} r={1.2 + azar(i + 3) * 2.4} fill="#F2C55C" opacity={0.2 + 0.35 * (0.5 + 0.5 * Math.sin(f / 13 + i))} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: 190, right: 190, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: '#3a2414', fontFamily: CINZEL }}>
        {pre && <div style={{ ...el(0), fontFamily: GARAMOND, fontWeight: 500, fontSize: 40, letterSpacing: 6, lineHeight: 1.35, textTransform: 'uppercase' }}>{pre.replace(/, called$/, ',')}<br />called</div>}
        <div style={{ ...el(3), fontFamily: CINZEL_DEC, fontWeight: 700, fontSize: libro.length > 9 ? 110 : 140, letterSpacing: 4, margin: '18px 0 8px', color: ROJO, textShadow: resplandor(3) }}>{libro}</div>
        <div style={{ ...el(6), fontSize: 56, color: ORO, margin: '6px 0 14px' }}>❦</div>
        <div style={{ ...el(9), fontSize: 92, fontWeight: 900, letterSpacing: 10 }}>CHAPTER {capituloDe(guion.id)}</div>
        <div style={{ ...el(12), fontFamily: GARAMOND_IT, fontStyle: 'italic', fontWeight: 500, fontSize: 72, marginTop: 22 }}>{guion.titulo.en ?? guion.titulo.es}</div>
        {de > 1 && <div style={{ ...el(14), fontSize: 60, fontWeight: 700, letterSpacing: 8, marginTop: 56, color: ROJO, borderTop: `3px solid ${ORO}`, borderBottom: `3px solid ${ORO}`, padding: '14px 26px', textShadow: resplandor(14) }}>PART {n} OF {de}</div>}
      </div>
      {/* gancho + invitación en karaoke: tinta oscura, la palabra que suena en rojo; sin brillo detrás */}
      {pag && (
        <div style={{ position: 'absolute', left: 200, right: 200, top: de > 1 ? 1300 : 1200, textAlign: 'center', fontFamily: GARAMOND, fontWeight: 600, fontSize: 56, lineHeight: 1.22, opacity: oSub }}>
          {pag.renglones.map((r, ri) => <div key={ri}><Karaoke ws={r} k={k} desde={pag.desde + pags[paginaDe(pags, k)].renglones.slice(0, ri).flat().length} color={TINTA} actual={ROJO} /></div>)}
        </div>
      )}
      {tramo?.frases.map((x, q) => x.audio.en ? <Sequence key={q} from={x.from} durationInFrames={x.dur + 6}><Audio src={staticFile(x.audio.en)} /></Sequence> : null)}
      {musica && <Audio src={staticFile(TEMA.musica)} volume={(q) => interpolate(q, [0, 10, dur - 8, dur], [0.12, 0.2, 0.2, 0.18], cl)} />}
    </AbsoluteFill>
  );
};
