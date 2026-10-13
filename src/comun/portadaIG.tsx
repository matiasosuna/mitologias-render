// Portada vertical de Instagram (1080×1350, lo que muestra la grilla): pensada para que en el perfil se lea
// de un vistazo qué mitología es, qué temporada, qué episodio y de qué trata. Mismos colores y guardas que la serie.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, TITULO, Personaje, Lenguetas, Meandro, aplicarTema, TEMA, TextoRunico, Entrelazado, Bloques, Jeroglificos, FranjaKapa, FranjaCuentas } from './vasija';
import { ELENCO } from '../motor/elenco';
import { FranjaCodice } from './codice';
import { FranjaPahari } from './pahari';
import { FranjaKamasan } from './kamasan';
import { FranjaMaori } from './kowhaiwhai';

// ficha: clave del elenco, props sueltas, o { __como: clave, ...props } (base del elenco + ajustes del guion)
const ficha = (x: unknown): Record<string, unknown> => {
  if (typeof x === 'string') return (ELENCO[x] as { p?: Record<string, unknown> })?.p ?? {};
  const o = (x ?? {}) as Record<string, unknown>;
  if (typeof o.__como === 'string') { const { __como, ...resto } = o; return { ...((ELENCO[__como as string] as { p?: Record<string, unknown> })?.p ?? {}), ...resto }; }
  return o;
};
const NOMBRE: Record<string, string> = { vasija: 'GREEK MYTHOLOGY', runas: 'NORSE MYTHOLOGY', papiro: 'EGYPTIAN MYTHOLOGY', kapa: 'HAWAIIAN MYTHOLOGY', pintado: 'NATIVE AMERICAN MYTHOLOGY', codice: 'AZTEC MYTHOLOGY', pahari: 'HINDU MYTHOLOGY', kowhaiwhai: 'MĀORI MYTHOLOGY', kamasan: 'BALINESE MYTHOLOGY' };

export const PortadaIG: React.FC<{ titulo: string; numero: string; temporada: string; heroe: unknown; rival?: unknown; serie?: string; insignia?: string }> = ({ titulo, numero, temporada, heroe, rival, serie, insignia = 'EPISODE' }) => {
  aplicarTema(serie);
  const t = TEMA.nombre, claro = t !== 'vasija';
  const h = ficha(heroe), r = rival ? ficha(rival) : null;
  const sh = (o: Record<string, unknown>) => Math.min(1.1, (o.s as number) ?? 1);
  const tinta = claro ? C.negro : C.crema, acento = t === 'vasija' ? C.negro : C.purpura;
  return (
    <AbsoluteFill style={{ backgroundColor: C.barro }}>
      <svg viewBox="0 0 1080 1350" width="100%" height="100%">
        <defs><radialGradient id="pg" cx="50%" cy="55%" r="75%"><stop offset="0%" stopColor={t === 'kamasan' ? '#F6EBCF' : t === 'papiro' ? '#FFF6DE' : t === 'runas' ? '#F2F7FA' : t === 'kapa' ? '#FCEBC4' : t === 'pintado' ? '#FCF3DC' : t === 'kowhaiwhai' ? '#FBEFD6' : t === 'pahari' ? '#FBF0CF' : t === 'codice' ? '#FBF2D8' : '#F0A060'} /><stop offset="60%" stopColor={C.barro} /><stop offset="100%" stopColor={C.barroOscuro} /></radialGradient></defs>
        <rect width={1080} height={1350} fill="url(#pg)" />
        {/* guarda de la serie, arriba */}
        {t === 'kamasan' ? <><rect width={1080} height={96} fill={C.crema} /><FranjaKamasan y={4} alto={50} desplaz={0} tipo="awan" ancho={1080} /><FranjaKamasan y={56} alto={16} desplaz={0} tipo="poleng" ancho={1080} /><FranjaKamasan y={72} alto={20} desplaz={0} tipo="api" ancho={1080} arriba={false} /><rect y={92} width={1080} height={4} fill={C.negro} /></> : t === 'kowhaiwhai' ? <><rect width={1080} height={96} fill={C.negro} /><FranjaMaori y={4} alto={52} desplaz={0} tipo="koru" ancho={1080} /><FranjaMaori y={58} alto={30} desplaz={0} tipo="taniko" ancho={1080} /><rect y={90} width={1080} height={6} fill={C.oro} /></>
          : t === 'pahari' ? <><rect width={1080} height={96} fill={C.crema} /><FranjaPahari y={4} alto={46} desplaz={0} tipo="flores" ancho={1080} /><rect y={50} width={1080} height={5} fill={C.oro} /><FranjaPahari y={55} alto={35} desplaz={0} tipo="lotos" ancho={1080} /><rect y={90} width={1080} height={6} fill={C.negro} /></>
          : t === 'codice' ? <><rect width={1080} height={96} fill={C.crema} /><FranjaCodice y={6} alto={44} desplaz={0} tipo="xical" ancho={1080} /><FranjaCodice y={52} alto={36} desplaz={0} tipo="jade" ancho={1080} /><rect y={90} width={1080} height={6} fill={C.negro} /></>
          : t === 'pintado' ? <><rect width={1080} height={96} fill={C.crema} /><FranjaCuentas y={6} alto={40} desplaz={0} tipo="escalones" /><FranjaCuentas y={50} alto={38} desplaz={0} tipo="rombos" /><rect y={90} width={1080} height={6} fill={C.negro} /></>
          : t === 'kapa' ? <><rect width={1080} height={96} fill={C.crema} /><FranjaKapa y={8} alto={34} desplaz={0} tipo="triangulos" /><FranjaKapa y={50} alto={38} desplaz={0} tipo="rombos" /><rect y={92} width={1080} height={6} fill={C.negro} /></>
          : t === 'papiro' ? <><Bloques y={0} alto={24} /><rect y={24} width={1080} height={56} fill={C.barroClaro} /><Jeroglificos x={18} y={32} n={31} /><rect y={80} width={1080} height={6} fill={C.negro} /></>
          : t === 'runas' ? <><rect width={1080} height={56} fill={C.negro} /><TextoRunico texto="ODIN THOR LOKI FRIGG FREYJA TYR BALDR" x={22} y={12} color={C.crema} /><Entrelazado y={58} alto={40} desplaz={0} /></>
          : <><Lenguetas y={0} desplaz={0} /><Meandro y={52} desplaz={0} /></>}
        {/* número de episodio */}
        {numero !== '' && <circle cx={540} cy={312} r={84} fill={C.negro} stroke={C.purpura} strokeWidth={10} />}
        {numero !== '' && <circle cx={540} cy={312} r={71} fill="none" stroke={C.crema} strokeWidth={2.5} strokeDasharray="3 9" />}
        {/* suelo y personajes */}
        <rect x={0} y={1000} width={1080} height={70} fill={C.negro} />
        <Personaje {...(h as object)} x={rival ? 360 : 540} y={1010} s={1.38 * sh(h)} accion="parado" />
        {r && <Personaje {...(r as object)} x={740} y={1010} s={1.18 * sh(r)} voltear accion="parado" />}
      </svg>
      {/* textos */}
      <AbsoluteFill style={{ fontFamily: TITULO, textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: 120, left: 0, right: 0, fontWeight: 700, fontSize: 50, letterSpacing: 10, color: acento }}>{NOMBRE[t]}</div>
        <div style={{ position: 'absolute', top: 182, left: 0, right: 0, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: tinta, opacity: 0.85 }}>{temporada}</div>
        <div style={{ position: 'absolute', top: numero === '' ? 300 : 254, left: 0, right: 0, fontWeight: 700, fontSize: numero === '' ? 30 : 22, letterSpacing: 6, color: numero === '' ? tinta : C.crema }}>{insignia}</div>
        <div style={{ position: 'absolute', top: 278, left: 0, right: 0, fontWeight: 700, fontSize: 82, lineHeight: 1, color: C.crema }}>{numero}</div>
        <div style={{ position: 'absolute', top: 1082, left: 50, right: 50, height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: titulo.length > 26 ? 76 : 90, lineHeight: 1.02, color: tinta, textShadow: claro ? `0 4px 0 ${C.blanco}` : `0 6px 0 ${C.negro}` }}>{titulo}</div>
        <div style={{ position: 'absolute', bottom: 22, left: 0, right: 0, fontWeight: 700, fontSize: 24, letterSpacing: 8, color: tinta, opacity: 0.7 }}>MYTHS ON CLAY</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
