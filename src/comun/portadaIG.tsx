// Portada vertical de Instagram (1080×1350, lo que muestra la grilla): pensada para que en el perfil se lea
// de un vistazo qué mitología es, qué temporada, qué episodio y de qué trata. Mismos colores y guardas que la serie.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, TITULO, Personaje, Lenguetas, Meandro, aplicarTema, TEMA, TextoRunico, Entrelazado, Bloques, Jeroglificos, FranjaKapa, FranjaCuentas } from './vasija';
import { ELENCO } from '../motor/elenco';

const ficha = (x: unknown): Record<string, unknown> => typeof x === 'string' ? ((ELENCO[x] as { p?: Record<string, unknown> })?.p ?? {}) : (x as Record<string, unknown>);
const NOMBRE: Record<string, string> = { vasija: 'GREEK MYTHOLOGY', runas: 'NORSE MYTHOLOGY', papiro: 'EGYPTIAN MYTHOLOGY', kapa: 'HAWAIIAN MYTHOLOGY', pintado: 'NATIVE AMERICAN MYTHOLOGY' };

export const PortadaIG: React.FC<{ titulo: string; numero: string; temporada: string; heroe: unknown; rival?: unknown; serie?: string; insignia?: string }> = ({ titulo, numero, temporada, heroe, rival, serie, insignia = 'EPISODE' }) => {
  aplicarTema(serie);
  const t = TEMA.nombre, claro = t !== 'vasija';
  const h = ficha(heroe), r = rival ? ficha(rival) : null;
  const sh = (o: Record<string, unknown>) => Math.min(1.1, (o.s as number) ?? 1);
  const tinta = claro ? C.negro : C.crema, acento = t === 'vasija' ? C.negro : C.purpura;
  return (
    <AbsoluteFill style={{ backgroundColor: C.barro }}>
      <svg viewBox="0 0 1080 1350" width="100%" height="100%">
        <defs><radialGradient id="pg" cx="50%" cy="55%" r="75%"><stop offset="0%" stopColor={t === 'papiro' ? '#FFF6DE' : t === 'runas' ? '#F2F7FA' : t === 'kapa' ? '#FCEBC4' : t === 'pintado' ? '#FCF3DC' : '#F0A060'} /><stop offset="60%" stopColor={C.barro} /><stop offset="100%" stopColor={C.barroOscuro} /></radialGradient></defs>
        <rect width={1080} height={1350} fill="url(#pg)" />
        {/* guarda de la serie, arriba */}
        {t === 'pintado' ? <><rect width={1080} height={96} fill={C.crema} /><FranjaCuentas y={6} alto={40} desplaz={0} tipo="escalones" /><FranjaCuentas y={50} alto={38} desplaz={0} tipo="rombos" /><rect y={90} width={1080} height={6} fill={C.negro} /></>
          : t === 'kapa' ? <><rect width={1080} height={96} fill={C.crema} /><FranjaKapa y={8} alto={34} desplaz={0} tipo="triangulos" /><FranjaKapa y={50} alto={38} desplaz={0} tipo="rombos" /><rect y={92} width={1080} height={6} fill={C.negro} /></>
          : t === 'papiro' ? <><Bloques y={0} alto={24} /><rect y={24} width={1080} height={56} fill={C.barroClaro} /><Jeroglificos x={18} y={32} n={31} /><rect y={80} width={1080} height={6} fill={C.negro} /></>
          : t === 'runas' ? <><rect width={1080} height={56} fill={C.negro} /><TextoRunico texto="ODIN THOR LOKI FRIGG FREYJA TYR BALDR" x={22} y={12} color={C.crema} /><Entrelazado y={58} alto={40} desplaz={0} /></>
          : <><Lenguetas y={0} desplaz={0} /><Meandro y={52} desplaz={0} /></>}
        {/* número de episodio */}
        <circle cx={540} cy={312} r={84} fill={C.negro} stroke={C.purpura} strokeWidth={10} />
        <circle cx={540} cy={312} r={71} fill="none" stroke={C.crema} strokeWidth={2.5} strokeDasharray="3 9" />
        {/* suelo y personajes */}
        <rect x={0} y={1000} width={1080} height={70} fill={C.negro} />
        <Personaje {...(h as object)} x={rival ? 360 : 540} y={1010} s={1.38 * sh(h)} accion="parado" />
        {r && <Personaje {...(r as object)} x={740} y={1010} s={1.18 * sh(r)} voltear accion="parado" />}
      </svg>
      {/* textos */}
      <AbsoluteFill style={{ fontFamily: TITULO, textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: 120, left: 0, right: 0, fontWeight: 700, fontSize: 50, letterSpacing: 10, color: acento }}>{NOMBRE[t]}</div>
        <div style={{ position: 'absolute', top: 182, left: 0, right: 0, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: tinta, opacity: 0.85 }}>{temporada}</div>
        <div style={{ position: 'absolute', top: 254, left: 0, right: 0, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: C.crema }}>{insignia}</div>
        <div style={{ position: 'absolute', top: 278, left: 0, right: 0, fontWeight: 700, fontSize: 82, lineHeight: 1, color: C.crema }}>{numero}</div>
        <div style={{ position: 'absolute', top: 1082, left: 50, right: 50, height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: titulo.length > 26 ? 76 : 90, lineHeight: 1.02, color: tinta, textShadow: claro ? `0 4px 0 ${C.blanco}` : `0 6px 0 ${C.negro}` }}>{titulo}</div>
        <div style={{ position: 'absolute', bottom: 22, left: 0, right: 0, fontWeight: 700, fontSize: 24, letterSpacing: 8, color: tinta, opacity: 0.7 }}>MYTHS ON CLAY</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
