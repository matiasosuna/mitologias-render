// Miniatura de cada episodio (1280×720): dos protagonistas + título grande, con la piel de la serie.
// La usan el canal (miniatura.jpg) y la portada de los videos (así "Select from video" sirve de miniatura).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FiguraPortada } from './figuraPortada';
import { C, TITULO, Personaje, Lenguetas, aplicarTema, TEMA, TextoRunico, Bloques, Jeroglificos , FranjaKapa, FranjaCuentas } from './vasija';
import { ELENCO } from '../motor/elenco';
import { FranjaCodice } from './codice';
import { FranjaPahari } from './pahari';
import { FranjaKamasan } from './kamasan';
import { FranjaMaori } from './kowhaiwhai';

/** Un personaje de la miniatura: clave del elenco ("odin") o props sueltas. */
const ficha = (x: unknown): Record<string, unknown> => typeof x === 'string' ? ((ELENCO[x] as { p?: Record<string, unknown> })?.p ?? {}) : (x as Record<string, unknown>);

export const Miniatura: React.FC<{ titulo: string; numero: string; heroe: unknown; rival?: unknown; serie?: string; etiqueta?: string; escalaHeroe?: number }> = ({ titulo, numero, heroe, rival, serie, etiqueta, escalaHeroe = 1 }) => {
  aplicarTema(serie);
  const runas = TEMA.nombre !== 'vasija'; // fondo claro
  const papiro = TEMA.nombre === 'papiro';
  const kapa = TEMA.nombre === 'kapa';
  const pintado = TEMA.nombre === 'pintado';
  const codice = TEMA.nombre === 'codice';
  const pahari = TEMA.nombre === 'pahari';
  const kamasan = TEMA.nombre === 'kamasan';
  const maori = TEMA.nombre === 'kowhaiwhai';
  const h = ficha(heroe), r = rival ? ficha(rival) : null;
  const sh = (o: Record<string, unknown>) => (o.s as number) ?? 1;
  return (
    <AbsoluteFill style={{ backgroundColor: C.barro }}>
      <svg viewBox="0 0 1280 720" width="100%" height="100%">
        <defs><radialGradient id="mn" cx="35%" cy="50%" r="80%"><stop offset="0%" stopColor={kamasan ? '#F6EBCF' : maori ? '#FBEFD6' : pahari ? '#FBF0CF' : codice ? '#FBF2D8' : pintado ? '#FCF3DC' : papiro ? '#FFF6DE' : runas ? '#F2F7FA' : '#F0A060'} /><stop offset="60%" stopColor={C.barro} /><stop offset="100%" stopColor={C.barroOscuro} /></radialGradient></defs>
        <rect width={1280} height={720} fill="url(#mn)" />
        {kamasan ? <><rect width={1280} height={66} fill={C.crema} /><FranjaKamasan y={2} alto={36} desplaz={0} tipo="awan" ancho={1280} /><FranjaKamasan y={40} alto={22} desplaz={0} tipo="api" ancho={1280} arriba={false} /><rect y={62} width={1280} height={4} fill={C.negro} /></> : maori ? <><rect width={1280} height={66} fill={C.negro} /><FranjaMaori y={2} alto={36} desplaz={0} tipo="koru" ancho={1280} /><FranjaMaori y={38} alto={22} desplaz={0} tipo="taniko" ancho={1280} /><rect y={62} width={1280} height={4} fill={C.oro} /></> : pahari ? <><rect width={1280} height={66} fill={C.crema} /><FranjaPahari y={2} alto={36} desplaz={0} tipo="flores" ancho={1280} /><rect y={38} width={1280} height={4} fill={C.oro} /><FranjaPahari y={42} alto={20} desplaz={0} tipo="lotos" ancho={1280} /><rect y={62} width={1280} height={4} fill={C.negro} /></> : codice ? <><rect width={1280} height={66} fill={C.crema} /><FranjaCodice y={4} alto={32} desplaz={0} tipo="xical" ancho={1280} /><FranjaCodice y={38} alto={24} desplaz={0} tipo="jade" ancho={1280} /><rect y={64} width={1280} height={4} fill={C.negro} /></> : pintado ? <><rect width={1280} height={66} fill={C.crema} /><FranjaCuentas y={4} alto={30} desplaz={0} tipo="escalones" /><FranjaCuentas y={38} alto={24} desplaz={0} tipo="rombos" /><rect y={64} width={1280} height={4} fill={C.negro} /></> : kapa ? <><rect width={1280} height={64} fill={C.crema} /><FranjaKapa y={6} alto={24} desplaz={0} tipo="triangulos" /><FranjaKapa y={34} alto={24} desplaz={0} tipo="rombos" /><rect y={62} width={1280} height={4} fill={C.negro} /></> : papiro ? <><Bloques y={0} alto={18} /><Jeroglificos x={16} y={22} n={37} /><rect y={66} width={1280} height={4} fill={C.negro} /></> : runas ? <><rect width={1280} height={46} fill={C.negro} /><TextoRunico texto="ODIN THOR LOKI FRIGG FREYJA TYR BALDR HEIMDALL" x={14} y={9} color={C.crema} /><rect y={46} width={1280} height={5} fill={C.purpura} /></> : <g transform="scale(0.62)"><Lenguetas y={0} desplaz={0} /></g>}
        <rect x={0} y={640} width={1280} height={80} fill={C.negro} />
        <FiguraPortada quien={heroe} props={h} x={r ? 210 : 300} y={660} s={1.45 * Math.min(1.1, sh(h)) * escalaHeroe} />
        {r && <FiguraPortada quien={rival} props={r} x={510} y={660} s={1.15 * Math.min(1.1, sh(r))} voltear />}
      </svg>
      <AbsoluteFill style={{ left: 640, width: 610, justifyContent: 'center', color: runas ? C.negro : C.crema, textShadow: runas ? `0 5px 0 ${C.blanco}` : `0 6px 0 ${C.negro}, 0 0 30px rgba(0,0,0,.5)` }}>
        <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: runas ? C.purpura : C.negro, textShadow: 'none' }}>{etiqueta ?? <>{kamasan ? 'BALINESE · EP ' : maori ? 'MĀORI · EP ' : pahari ? 'HINDU · EP ' : codice ? 'AZTEC · EP ' : pintado ? 'NATIVE AMERICAN · EP ' : <>{kapa ? 'HAWAIIAN · ' : papiro ? 'EGYPTIAN · ' : runas ? 'NORSE · ' : ''}EPISODE </>}{numero}</>}</div>
        <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 92, lineHeight: 1.02, marginTop: 10 }}>{titulo}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
