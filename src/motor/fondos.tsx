// Fondos (lugares) y elementos de escenario para el guion visual.
import React from 'react';
import { fondoNorteamericano, elementoNorteamericano } from './fondosNorte';
import { fondoAzteca, elementoAzteca, CIELO_AZTECA } from './fondosAzteca';
import { C, Capa, SUELO, Suelo, Monte, Olivo, Templo, Olas, Nube, Luna, Sol, Estrellas, Fuego, suave, Inc, Borde, Personaje, azar, TEMA, TextoRunico, Entrelazado, Jeroglificos, Bloques, miembro, Chispas, type P } from '../comun/vasija';

export type Cielo = 'barro' | 'noche' | 'mar' | 'inframundo';
export const CIELO: Record<string, Cielo> = { campo: 'barro', olimpo: 'barro', mar: 'mar', costa: 'mar', inframundo: 'inframundo', cueva: 'noche', palacio: 'barro', templo: 'barro', monte: 'barro', bosque: 'barro', ciudad: 'barro', noche: 'noche', cielo: 'barro', batalla: 'barro', fragua: 'inframundo', desierto: 'barro', caos: 'inframundo',
  // nórdicos
  nieve: 'barro', fiordo: 'mar', asgard: 'barro', salon: 'noche', yggdrasil: 'barro', ginnungagap: 'inframundo', hel: 'inframundo', jotunheim: 'barro', aldea: 'barro', bosque_nevado: 'barro', aurora: 'noche', bifrost: 'barro',
  // egipcios
  nilo: 'barro', nun: 'inframundo', duat: 'inframundo', piramides: 'barro', juncal: 'barro', sala_juicio: 'noche', cielo_nut: 'noche',
  // hawaianos (tema kapa)
  po: 'inframundo', fondo_marino: 'mar', oceano: 'mar', oceano_abierto: 'mar', playa: 'mar', playa_negra: 'mar', aldea_hale: 'barro', loi: 'barro', 'lōʻi': 'barro', valle: 'barro', valle_cascada: 'barro', bosque_lehua: 'barro', volcan: 'inframundo', crater: 'inframundo', haleakala: 'barro', mauna_kea: 'barro', cielo_navegante: 'noche', heiau: 'barro',
  // norteamericanos (tema pintado)
  mundo_cielo: 'barro', agua_primordial: 'mar', aldea_casa_larga: 'barro', pradera: 'barro', costa_noroeste: 'mar', rio: 'barro', montanas: 'barro', lago: 'mar', bajo_agua: 'mar' };
Object.assign(CIELO, CIELO_AZTECA); // aztecas (tema códice): fondosAzteca.tsx

const Mar: React.FC<{ f: number; y?: number; desde?: number }> = ({ f, y = SUELO - 30, desde = -800 }) => (
  <g>
    {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${desde + i * 2400} 0)`}><Olas y={y} f={f} color={C.mar} /></g>)}
  </g>
);

/** Fondo completo de un lugar (capas con parallax incluidas). */
export const Fondo: React.FC<{ tipo: string; f: number; astros?: boolean }> = ({ tipo, f, astros = true }) => {
  if (TEMA.nombre === 'runas') { const n = fondoNordico(tipo, f, astros); if (n) return n; }
  if (TEMA.nombre === 'papiro') { const n = fondoEgipcio(tipo, f, astros); if (n) return n; }
  if ((TEMA.nombre as string) === 'kapa') { const n = fondoHawaiano(tipo, f, astros); if (n) return n; }
  if ((TEMA.nombre as string) === 'pintado') { const n = fondoNorteamericano(tipo, f, astros); if (n) return n; }
  if ((TEMA.nombre as string) === 'codice') { const n = fondoAzteca(tipo, f, astros); if (n) return n; }
  switch (tipo) {
    case 'olimpo':
      return (
        <>
          <Capa p={0.15}><Sol x={1650} y={240} r={46} f={f} /></Capa>
          <Capa p={0.3}><Monte x={500} alto={520} ancho={800} templo /><Monte x={1700} alto={380} ancho={600} /></Capa>
          <Capa p={0.6}><Templo x={1300} y={SUELO} s={1.2} color={C.barroOscuro} /></Capa>
          <Suelo color={C.negro} />
          <Capa p={1}>{Array.from({ length: 16 }, (_, i) => <Nube key={i} x={-600 + i * 380} y={SUELO + 10} s={0.9} f={f + i * 20} />)}</Capa>
        </>
      );
    case 'mar':
      return (
        <>
          <Capa p={0.1}><Sol x={1500} y={260} r={50} f={f} /></Capa>
          <Capa p={0.3}><Monte x={200} alto={200} ancho={500} o={0.4} /></Capa>
          <Capa p={1}><Mar f={f} y={SUELO - 60} /></Capa>
        </>
      );
    case 'costa':
      return (
        <>
          <Capa p={0.3}><Monte x={300} alto={300} ancho={600} /></Capa>
          <Capa p={1}><Mar f={f} y={SUELO - 40} desde={600} /><Suelo desde={-1200} hasta={900} /><path d={`M900 ${SUELO} C 940 ${SUELO + 20}, 960 ${SUELO + 60}, 1000 ${SUELO + 200}`} fill={C.negro} /></Capa>
        </>
      );
    case 'inframundo':
      return (
        <>
          <Capa p={0.3}>{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-400 + i * 320} ${SUELO} L${-340 + i * 320} ${200 + azar(i) * 200} L${-260 + i * 320} ${SUELO} Z`} fill="#2A120A" />)}</Capa>
          <Capa p={0.6}><Mar f={f * 0.4} y={SUELO - 70} desde={-1600} /></Capa>
          <Suelo color="#120806" />
          <Capa p={0.6}>{Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={-500 + i * 300 + Math.sin(f / 30 + i) * 20} cy={SUELO - 160 - azar(i + 9) * 120} rx={14} ry={30} fill={C.blanco} opacity={0.08 + 0.06 * Math.sin(f / 15 + i)} />)}</Capa>
        </>
      );
    case 'cueva':
      return (
        <>
          <Capa p={0.4}><Estrellas f={f} n={20} /><Luna x={1600} y={230} /></Capa>
          <Suelo />
          <Capa p={1}>
            <path d={`M-800 ${SUELO} L-800 0 L800 0 C 500 120, 300 240, 260 ${SUELO} Z`} fill={C.negro} />
            <path d={`M2800 ${SUELO} L2800 0 L1200 0 C 1500 120, 1660 260, 1700 ${SUELO} Z`} fill={C.negro} />
            {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${300 + i * 140} 120 l 14 ${40 + azar(i) * 60} l 14 ${-40 - azar(i) * 60} Z`} fill={C.negro} />)}
          </Capa>
        </>
      );
    case 'palacio':
    case 'templo':
      return (
        <>
          <Capa p={0.5}>
            {Array.from({ length: 14 }, (_, i) => (
              <g key={i} transform={`translate(${-600 + i * 300} 0)`}>
                <rect x={-26} y={220} width={52} height={SUELO - 220} fill={C.barroOscuro} />
                <rect x={-36} y={206} width={72} height={18} fill={C.barroOscuro} />
                <path d={`M-10 230 V${SUELO} M10 230 V${SUELO}`} stroke={C.barro} strokeWidth={3} opacity={0.5} />
              </g>
            ))}
            <rect x={-1000} y={180} width={6000} height={28} fill={C.barroOscuro} />
            {tipo === 'templo' && <Templo x={960} y={SUELO} s={1.6} color={C.barroOscuro} />}
          </Capa>
          <Suelo />
          <Capa p={1}>{Array.from({ length: 60 }, (_, i) => <rect key={i} x={-800 + i * 100} y={SUELO + 30} width={50} height={14} fill={i % 2 ? C.purpura : C.barro} opacity={0.8} />)}</Capa>
        </>
      );
    case 'monte':
      return (
        <>
          <Capa p={0.25}><Monte x={1400} alto={560} ancho={900} templo /></Capa>
          <Capa p={0.6}><Monte x={200} alto={300} ancho={700} color={C.negro} o={0.4} /></Capa>
          <Suelo />
        </>
      );
    case 'bosque':
      return (
        <>
          <Capa p={0.3}>{Array.from({ length: 10 }, (_, i) => <Olivo key={i} x={-300 + i * 340} y={SUELO - 40} s={0.8} f={f + i * 10} color={C.barroOscuro} />)}</Capa>
          <Capa p={0.6}>{Array.from({ length: 8 }, (_, i) => <Cipres key={i} x={-200 + i * 420} s={1.1} color="#5A2810" />)}</Capa>
          <Suelo />
        </>
      );
    case 'ciudad':
      return (
        <>
          <Capa p={0.3}><Monte x={1500} alto={260} ancho={700} /></Capa>
          <Capa p={0.55}>{Array.from({ length: 12 }, (_, i) => <Casa key={i} x={-400 + i * 260} s={0.9 + azar(i) * 0.3} color={C.barroOscuro} />)}<Muralla x={-800} ancho={4400} color={C.barroOscuro} /></Capa>
          <Suelo />
        </>
      );
    case 'noche':
      return (
        <>
          <Capa p={0.1}><Estrellas f={f} n={40} /><Luna x={1600} y={240} /></Capa>
          <Capa p={0.3}><Monte x={500} alto={340} ancho={700} /></Capa>
          <Capa p={0.6}>{[0, 1, 2, 3].map((i) => <Olivo key={i} x={-200 + i * 700} y={SUELO - 30} s={0.9} f={f} color="#3A1A0C" />)}</Capa>
          <Suelo />
        </>
      );
    case 'cielo':
      return (
        <>
          <Capa p={0.1}><Sol x={1600} y={260} r={50} f={f} /></Capa>
          {Array.from({ length: 10 }, (_, i) => <Capa key={i} p={0.3 + (i % 3) * 0.3}><Nube x={-400 + i * 420} y={260 + (i % 3) * 170} s={0.6 + (i % 3) * 0.3} f={f + i * 30} /></Capa>)}
        </>
      );
    case 'batalla':
      return (
        <>
          <Capa p={0.3}><Monte x={400} alto={300} ancho={700} /><Monte x={1600} alto={360} ancho={700} /></Capa>
          <Capa p={0.55}>{Array.from({ length: 40 }, (_, i) => <path key={i} d={`M${-600 + i * 110} ${SUELO - 40} l ${8} -260`} stroke={C.barroOscuro} strokeWidth={5} />)}</Capa>
          <Suelo />
          <Capa p={1}>{Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={-400 + i * 400 + Math.sin(f / 20 + i) * 30} cy={SUELO - 20} rx={160} ry={40} fill={C.barroClaro} opacity={0.25} />)}</Capa>
        </>
      );
    case 'fragua':
      return (
        <>
          <Capa p={0.5}>
            <path d={`M600 ${SUELO} L620 400 C 700 330, 900 330, 980 400 L1000 ${SUELO} Z`} fill="#2A120A" />
            <ellipse cx={800} cy={600} rx={120} ry={90} fill="#FF9A3C" opacity={0.6 + Math.sin(f / 4) * 0.1} />
            <g transform={`translate(800 680)`}><Fuego f={f} s={1.4} /></g>
          </Capa>
          <Suelo color="#120806" />
        </>
      );
    case 'desierto':
      return (
        <>
          <Capa p={0.1}><Sol x={1500} y={240} r={60} f={f} /></Capa>
          <Capa p={0.4}>{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-600 + i * 700} ${SUELO} C ${-400 + i * 700} ${SUELO - 160}, ${-100 + i * 700} ${SUELO - 160}, ${100 + i * 700} ${SUELO} Z`} fill={C.barroOscuro} opacity={0.6} />)}</Capa>
          <Suelo />
        </>
      );
    case 'caos':
      return (
        <>
          {Array.from({ length: 3 }, (_, c) => (
            <Capa key={c} p={0.2 + c * 0.3}>
              {Array.from({ length: 90 }, (_, i) => {
                const a = i * 2.4 + f / (60 + c * 30), r = 40 + ((i * 37) % 600);
                return <circle key={i} cx={960 + Math.cos(a) * r * 1.5} cy={460 + Math.sin(a) * r * 0.6} r={1.5 + (i % 4)} fill={i % 3 ? C.crema : C.barroClaro} opacity={0.2 + c * 0.2} />;
              })}
            </Capa>
          ))}
        </>
      );
    default: // campo
      return (
        <>
          <Capa p={0.15}><Sol x={1600} y={250} r={44} f={f} /></Capa>
          <Capa p={0.3}><Monte x={400} alto={360} ancho={700} /><Monte x={1500} alto={280} ancho={600} /></Capa>
          <Capa p={0.6}>{[0, 1, 2, 3].map((i) => <Olivo key={i} x={-200 + i * 760} y={SUELO - 30} s={0.9} f={f + i * 10} color={C.barroOscuro} />)}</Capa>
          <Suelo />
        </>
      );
  }
};

// ---------- elementos ----------
const Cipres: React.FC<{ x: number; y?: number; s?: number; color?: string }> = ({ x, y = SUELO, s = 1, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-6} y={-40} width={12} height={40} fill={color} />
    <path d="M0 -320 C 30 -250, 44 -120, 30 -40 L -30 -40 C -44 -120, -30 -250, 0 -320 Z" fill={color} />
    {[0, 1, 2, 3].map((i) => <Inc key={i} d={`M-14 ${-80 - i * 55} q 14 -16 28 0`} w={1.5} />)}
  </g>
);
const Palmera: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-8 0 C -4 -120, 10 -200, 4 -300 L 16 -300 C 22 -200, 8 -120, 10 0 Z" fill={C.negro} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M10 -300 q ${Math.cos(i * 0.8) * 60} ${-40 + Math.sin(i * 0.8) * 30} ${Math.cos(i * 0.8) * 130} ${20 + Math.sin(i * 0.8) * 40}`} stroke={C.negro} strokeWidth={10} fill="none" strokeLinecap="round" />)}
  </g>
);
const Casa: React.FC<{ x: number; y?: number; s?: number; color?: string }> = ({ x, y = SUELO, s = 1, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-80} y={-130} width={160} height={130} fill={color} />
    <path d="M-96 -130 L0 -190 L96 -130 Z" fill={color} />
    <rect x={-18} y={-70} width={36} height={70} fill={C.barro} opacity={0.6} />
    <rect x={-60} y={-110} width={24} height={20} fill={C.barro} opacity={0.6} />
  </g>
);
const Muralla: React.FC<{ x: number; y?: number; ancho?: number; alto?: number; color?: string }> = ({ x, y = SUELO, ancho = 1600, alto = 260, color = C.negro }) => (
  <g>
    <rect x={x} y={y - alto} width={ancho} height={alto} fill={color} />
    {Array.from({ length: Math.ceil(ancho / 60) }, (_, i) => <rect key={i} x={x + i * 60} y={y - alto - 30} width={36} height={30} fill={color} />)}
    {Array.from({ length: Math.ceil(ancho / 120) * 3 }, (_, i) => <rect key={`b${i}`} x={x + (i % Math.ceil(ancho / 120)) * 120 + (Math.floor(i / Math.ceil(ancho / 120)) % 2) * 60} y={y - alto + 20 + Math.floor(i / Math.ceil(ancho / 120)) * 70} width={110} height={4} fill={C.barro} opacity={0.4} />)}
  </g>
);
const Barco: React.FC<{ x: number; y?: number; s?: number; f: number; vela?: boolean }> = ({ x, y = SUELO - 40, s = 1, f, vela = true }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 15) * 6}) rotate(${Math.sin(f / 20) * 2}) scale(${s})`}>
    <path d="M-260 -20 C -200 30, 200 30, 240 -20 C 270 -40, 290 -80, 300 -100 L 280 -60 C 260 -30, 230 -10, 200 -10 L -230 -10 C -250 -30, -280 -60, -300 -60 C -290 -40, -276 -30, -260 -20 Z" fill={C.negro} />
    <circle cx={210} cy={-2} r={8} fill={C.crema} /><circle cx={212} cy={-2} r={3.5} fill={C.negro} />
    <Borde d="M-230 -10 L 200 -10" w={6} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-180 + i * 38} 0 l ${-20 + Math.sin(f / 6 + i) * 10} 60`} stroke={C.negro} strokeWidth={4} />)}
    <path d="M0 -10 V -300" stroke={C.negro} strokeWidth={8} />
    {vela && <path d={`M-130 -280 L 130 -280 C ${140 + Math.sin(f / 12) * 10} -200, ${140 + Math.sin(f / 12) * 10} -120, 130 -60 L -130 -60 C ${-120 + Math.sin(f / 12) * 10} -120, ${-120 + Math.sin(f / 12) * 10} -200, -130 -280 Z`} fill={C.crema} stroke={C.negro} strokeWidth={3} />}
    {vela && [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-100 + i * 50} -276 V -64`} stroke={C.negro} strokeWidth={1.5} opacity={0.5} />)}
  </g>
);
const Altar: React.FC<{ x: number; y?: number; s?: number; f: number; fuego?: boolean }> = ({ x, y = SUELO, s = 1, f, fuego }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-110} width={140} height={110} fill={C.negro} />
    <rect x={-84} y={-124} width={168} height={18} fill={C.negro} />
    <Borde d="M-64 -60 L 64 -60" w={8} />
    {fuego && <g transform="translate(0 -124)"><Fuego f={f} s={0.7} /></g>}
  </g>
);
const Trono: React.FC<{ x: number; y?: number; s?: number; oro?: boolean }> = ({ x, y = SUELO, s = 1, oro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-60 0 V -140 L -70 -300 H -40 L -30 -160 H 60 V 0 Z" fill={oro ? C.oro : C.negro} stroke={oro ? C.negro : 'none'} strokeWidth={3} />
    <path d="M-30 -160 H 60 V -130 H -30 Z" fill={C.purpura} />
    <path d="M-56 0 V -40 M50 0 V -40" stroke={C.crema} strokeWidth={2} />
    <Inc d="M-60 -220 L -44 -220" />
  </g>
);
const AnforaGrande: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={suave([[-30, -260], [30, -260], [24, -220], [80, -170], [90, -90], [50, -20], [40, 0], [-40, 0], [-50, -20], [-90, -90], [-80, -170], [-24, -220]], true)} fill={C.negro} />
    <Borde d="M-84 -150 L 84 -150" w={8} />
    <path d="M-70 -110 l 20 24 l 20 -24 l 20 24 l 20 -24 l 20 24 l 20 -24" stroke={C.crema} strokeWidth={3} fill="none" />
  </g>
);
const Columna: React.FC<{ x: number; y?: number; s?: number; rota?: boolean }> = ({ x, y = SUELO, s = 1, rota }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-26} y={rota ? -200 : -420} width={52} height={rota ? 200 : 420} fill={C.negro} />
    {!rota && <rect x={-40} y={-440} width={80} height={22} fill={C.negro} />}
    <path d={`M-10 ${rota ? -196 : -416} V0 M10 ${rota ? -196 : -416} V0`} stroke={C.crema} strokeWidth={1.5} opacity={0.6} />
  </g>
);
const Roca: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-120 0 C -130 -60, -80 -120, -10 -126 C 60 -130, 120 -80, 130 0 Z" fill={TEMA.nombre === 'papiro' ? '#6B4A2A' : C.negro} stroke={TEMA.nombre === 'papiro' ? C.negro : 'none'} strokeWidth={3} />
    <Inc d="M-60 -60 q 20 -20 50 -16 M20 -90 q 30 10 40 40" w={1.8} />
  </g>
);
const Tumba: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-40 0 V -180 C -40 -210, 40 -210, 40 -180 V 0 Z" fill={C.negro} />
    <Borde d="M-30 -150 L 30 -150" w={6} />
  </g>
);
const Cofre: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-120} width={220} height={120} fill={C.negro} />
    <path d="M-110 -120 C -100 -170, 100 -170, 110 -120 Z" fill={C.negro} />
    <Borde d="M-100 -70 L 100 -70" w={8} />
    <rect x={-12} y={-130} width={24} height={30} fill={C.oro} />
  </g>
);
const Telar: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-100 0 V -320 M100 0 V -320 M-110 -310 H 110" stroke={C.negro} strokeWidth={12} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-90 + i * 16} -300 V -120`} stroke={C.negro} strokeWidth={2} />)}
    <rect x={-92} y={-300} width={184} height={120} fill={C.purpura} opacity={0.7} />
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-90 + i * 16} cy={-110} r={7} fill={C.negro} />)}
  </g>
);

/** Elemento suelto del escenario por nombre. */
export const ElementoSVG: React.FC<{ tipo: string; x: number; y?: number; s?: number; f: number; props?: Record<string, unknown> }> = ({ tipo, x, y, s = 1, f, props = {} }) => {
  const yy = y ?? SUELO;
  const runas = TEMA.nombre === 'runas';
  const kapa = (TEMA.nombre as string) === 'kapa';
  if ((TEMA.nombre as string) === 'pintado') { const n = elementoNorteamericano(tipo, x, y, s, f, props); if (n) return n; }
  if ((TEMA.nombre as string) === 'codice') { const n = elementoAzteca(tipo, x, y, s, f, props); if (n) return n; }
  if (kapa) {
    switch (tipo) {
      case 'palmera': case 'olivo': case 'arbol': return <Niu x={x} y={yy} s={s} f={f} inclina={(props.inclina as number) ?? 0.2} espejo={props.espejo === true} />;
      case 'barco': return <Waa x={x} y={y ?? SUELO - 30} s={s} f={f} vela={props.vela !== false} quieta={props.quieta === true} espejo={props.espejo === true} />;
      case 'casa': return <Hale x={x} y={yy} s={s} espejo={props.espejo === true} />;
      case 'templo': return <Heiau x={x} y={yy} s={s} f={f} />;
    }
  }
  switch (tipo) {
    case 'waa': return <Waa x={x} y={y ?? SUELO - 30} s={s} f={f} vela={props.vela !== false} quieta={props.quieta === true} espejo={props.espejo === true} />;
    case 'hale': return <Hale x={x} y={yy} s={s} espejo={props.espejo === true} />;
    case 'kii': return <Kii x={x} y={yy} s={s} />;
    case 'kalo': return <Kalo x={x} y={yy} s={s} f={f} />;
    case 'niu': return <Niu x={x} y={yy} s={s} f={f} inclina={(props.inclina as number) ?? 0.2} espejo={props.espejo === true} />;
    case 'ipu': return <Ipu x={x} y={yy} s={s} />;
    case 'lehua': return <Lehua x={x} y={yy} s={s} f={f} seed={Math.round(x)} />;
    case 'petroglifo': return <Petroglifo x={x} y={yy} s={s} figura={props.figura as string} />;
    case 'lago_lava': return <LagoLava x={x} y={yy} s={s} f={f} ancho={(props.ancho as number) ?? 560} />;
    case 'fuente_lava': return <FuenteLava x={x} y={yy} s={s} f={f} />;
    case 'kahili': return <Kahili x={x} y={yy} s={s} f={f} />;
    case 'heiau': return <Heiau x={x} y={yy} s={s} f={f} />;
    case 'pino': return <Pino x={x} y={yy} s={s} />;
    case 'piramide': return <Piramide x={x} y={yy} s={s} />;
    case 'obelisco': return <Obelisco x={x} y={yy} s={s} />;
    case 'papiro': return <Papiros x={x} y={yy} s={s} f={f} />;
    case 'loto': return <Loto x={x} y={yy} s={s} />;
    case 'barca_solar': return <BarcaSolar x={x} y={y ?? SUELO - 30} s={s} f={f} disco={props.disco !== false} />;
    case 'pilono': return <Pilono x={x} y={yy} s={s} />;
    case 'nut_arco': return <NutArco x={x} s={s} f={f} />;
    case 'isla': return <Isla x={x} y={yy} s={s} f={f} verde={props.verde !== false} />;
    case 'columna_papiro': return <ColumnaPapiro x={x} y={yy} s={s} />;
    case 'balanza': return <Balanza x={x} y={yy} s={s} f={f} />;
    case 'sarcofago': return <Sarcofago x={x} y={yy} s={s} />;
    case 'yggdrasil': return <Yggdrasil x={x} y={yy} s={s} f={f} />;
    case 'casa_larga': return <CasaLarga x={x} y={yy} s={s} />;
    case 'piedra_runica': return <PiedraRunica x={x} y={yy} s={s} texto={props.texto as string} />;
    case 'drakkar': return <Drakkar x={x} y={y ?? SUELO - 40} s={s} f={f} vela={props.vela !== false} />;
    case 'monte_nevado': return <MonteNevado x={x} base={yy} ancho={600 * s} alto={400 * s} o={(props.o as number) ?? 0.8} />;
    case 'olivo': case 'arbol': return runas ? <Pino x={x} y={yy} s={s} /> : TEMA.nombre === 'papiro' ? <Palmera2 x={x} y={yy} s={s} f={f} /> : <Olivo x={x} y={yy} s={s} f={f} />;
    case 'palmera': return TEMA.nombre === 'papiro' ? <Palmera2 x={x} y={yy} s={s} f={f} /> : <Palmera x={x} y={yy} s={s} />;
    case 'cipres': return <Cipres x={x} y={yy} s={s} />;
    case 'palmera': return <Palmera x={x} y={yy} s={s} />;
    case 'templo': return TEMA.nombre === 'papiro' ? <Pilono x={x} y={yy} s={s} /> : <Templo x={x} y={yy} s={s} />;
    case 'monte': return runas ? <MonteNevado x={x} base={yy} ancho={600 * s} alto={400 * s} o={(props.o as number) ?? 0.8} /> : <Monte x={x} base={yy} ancho={600 * s} alto={400 * s} templo={props.templo as boolean} o={(props.o as number) ?? 0.6} />;
    case 'columna': return <Columna x={x} y={yy} s={s} rota={props.rota as boolean} />;
    case 'roca': return <Roca x={x} y={yy} s={s} />;
    case 'nube': return <Nube x={x} y={y ?? 300} s={s} f={f} />;
    case 'luna': return <Luna x={x} y={y ?? 240} r={46 * s} />;
    case 'sol': return <Sol x={x} y={y ?? 240} r={50 * s} f={f} />;
    case 'estrellas': return <Estrellas f={f} />;
    case 'barco': return TEMA.nombre === 'papiro' ? <BarcaSolar x={x} y={y ?? SUELO - 30} s={s} f={f} disco={false} /> : runas ? <Drakkar x={x} y={y ?? SUELO - 40} s={s} f={f} vela={props.vela !== false} /> : <Barco x={x} y={y ?? SUELO - 40} s={s} f={f} vela={props.vela !== false} />;
    case 'altar': return <Altar x={x} y={yy} s={s} f={f} fuego={props.fuego as boolean} />;
    case 'fogata': return <g transform={`translate(${x} ${yy})`}><path d="M-50 0 L 40 -20 M-40 -20 L 50 0" stroke={C.negro} strokeWidth={14} strokeLinecap="round" /><g transform="translate(0 -14)"><Fuego f={f} s={0.8 * s} /></g></g>;
    case 'trono': return <Trono x={x} y={yy} s={s} oro={props.oro === true} />;
    case 'anfora': case 'pithos': return <AnforaGrande x={x} y={yy} s={s} />;
    case 'casa': return runas ? <CasaLarga x={x} y={yy} s={s} /> : <Casa x={x} y={yy} s={s} />;
    case 'muralla': return <Muralla x={x} y={yy} ancho={(props.ancho as number) ?? 1200} alto={(props.alto as number) ?? 300} />;
    case 'tumba': case 'estela': return <Tumba x={x} y={yy} s={s} />;
    case 'cofre': return TEMA.nombre === 'papiro' ? <Sarcofago x={x} y={yy} s={s} /> : <Cofre x={x} y={yy} s={s} />;
    case 'telar': return <Telar x={x} y={yy} s={s} />;
    case 'estatua': return <Personaje x={x} y={yy} s={s} piel="#8F857A" accion="parado" {...(props as object)} />;
    case 'puerta': return <g transform={`translate(${x} ${yy}) scale(${s})`}><rect x={-110} y={-320} width={220} height={320} fill={C.negro} /><rect x={-90} y={-300} width={84} height={300} fill="#5A3A1C" /><rect x={6} y={-300} width={84} height={300} fill="#5A3A1C" />{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-70 + (i % 4) * 46} cy={-260 + Math.floor(i / 4) * 100} r={6} fill={C.oro} />)}</g>;
    case 'cueva': return <g transform={`translate(${x} ${yy}) scale(${s})`}><path d="M-300 0 C -300 -400, 300 -400, 300 0 Z" fill={C.barroOscuro} /><path d="M-170 0 C -170 -250, 170 -250, 170 0 Z" fill={C.noche} /></g>;
    case 'rio': return <g transform={`translate(${x} 0)`}><Olas y={yy - 40} f={f} color={C.mar} alto={24} /></g>;
    default: return null;
  }
};

// ---------- piel nórdica ----------
const Pino: React.FC<{ x: number; y?: number; s?: number; color?: string; nieve?: boolean }> = ({ x, y = SUELO, s = 1, color = C.negro, nieve = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-7} y={-40} width={14} height={40} fill={color} />
    {[0, 1, 2, 3].map((i) => { const w = 90 - i * 18, yy = -40 - i * 62; return (
      <g key={i}>
        <path d={`M${-w} ${yy} L0 ${yy - 110} L${w} ${yy} Z`} fill={color} />
        {nieve && <path d={`M${-w * 0.55} ${yy - 50} L0 ${yy - 110} L${w * 0.55} ${yy - 50} Q ${w * 0.2} ${yy - 40} 0 ${yy - 52} Q ${-w * 0.2} ${yy - 40} ${-w * 0.55} ${yy - 50} Z`} fill={C.blanco} opacity={0.9} />}
      </g>
    ); })}
  </g>
);
/** Montaña con capa de nieve en la cima. */
const MonteNevado: React.FC<{ x: number; base?: number; ancho?: number; alto?: number; color?: string; o?: number }> = ({ x, base = SUELO, ancho = 700, alto = 460, color = C.barroOscuro, o = 0.8 }) => {
  const cima = base - alto, w = ancho * 0.32, h = alto * 0.3;
  return (
    <g opacity={o}>
      <path d={`M${x - ancho} ${base} L${x - ancho * 0.35} ${cima + alto * 0.35} L${x - ancho * 0.18} ${cima + alto * 0.2} L${x} ${cima} L${x + ancho * 0.22} ${cima + alto * 0.28} L${x + ancho * 0.4} ${cima + alto * 0.36} L${x + ancho} ${base} Z`} fill={color} />
      <path d={`M${x - w} ${cima + h * 1.05} L${x - ancho * 0.18} ${cima + alto * 0.2} L${x} ${cima} L${x + ancho * 0.22} ${cima + alto * 0.28} L${x + w} ${cima + h * 1.1} L${x + w * 0.5} ${cima + h * 0.8} L${x + w * 0.15} ${cima + h * 1.15} L${x - w * 0.3} ${cima + h * 0.75} Z`} fill={C.blanco} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${x - ancho * (0.6 - i * 0.25)} ${base - 20} l ${30} ${-alto * 0.25}`} stroke={C.negro} strokeWidth={2.5} opacity={0.3} />)}
    </g>
  );
};
/** Casa larga vikinga (techo curvo con cabezas de dragón). */
const CasaLarga: React.FC<{ x: number; y?: number; s?: number; color?: string }> = ({ x, y = SUELO, s = 1, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-100} width={340} height={100} fill={color} />
    <path d="M-200 -96 C -120 -200, 120 -200, 200 -96 Z" fill={color} />
    <path d="M-190 -100 C -120 -186, 120 -186, 190 -100" stroke={C.blanco} strokeWidth={10} fill="none" opacity={0.9} />
    <path d="M-150 -160 C -170 -200, -200 -210, -214 -196 C -200 -194, -192 -186, -186 -174 Z M150 -160 C 170 -200, 200 -210, 214 -196 C 200 -194, 192 -186, 186 -174 Z" fill={color} />
    <rect x={-24} y={-70} width={48} height={70} fill={C.oro} opacity={0.75} />
    {[-120, -70, 70, 120].map((dx) => <path key={dx} d={`M${dx} -96 V0`} stroke={C.crema} strokeWidth={1.5} opacity={0.4} />)}
  </g>
);
/** Piedra rúnica con serpiente y runas en rojo. */
const PiedraRunica: React.FC<{ x: number; y?: number; s?: number; texto?: string }> = ({ x, y = SUELO, s = 1, texto = 'ODIN' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-80 0 C -90 -120, -70 -250, -10 -280 C 50 -290, 90 -200, 84 0 Z" fill="#B9C6CF" stroke={C.negro} strokeWidth={4} />
    <path d="M-56 -20 C -70 -140, -40 -240, 0 -250 C 50 -250, 66 -150, 60 -20" stroke={C.purpura} strokeWidth={16} fill="none" />
    <TextoRunico texto={texto} x={-26} y={-180} esc={1.1} color={C.negro} w={4} />
    <path d="M-30 -100 C -10 -130, 20 -60, 40 -100" stroke={C.negro} strokeWidth={4} fill="none" />
  </g>
);
/** Drakkar: barco vikingo con proa de dragón, escudos y vela a rayas. */
const Drakkar: React.FC<{ x: number; y?: number; s?: number; f: number; vela?: boolean }> = ({ x, y = SUELO - 40, s = 1, f, vela = true }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 15) * 6}) rotate(${Math.sin(f / 20) * 2}) scale(${s})`}>
    <path d="M-250 -20 C -180 40, 180 40, 250 -20 C 270 -60, 280 -120, 300 -150 C 320 -170, 340 -160, 330 -140 C 316 -150, 300 -140, 296 -120 C 286 -80, 276 -40, 240 -10 L -240 -10 C -280 -40, -290 -90, -300 -140 C -290 -110, -270 -40, -250 -20 Z" fill={C.negro} />
    <circle cx={318} cy={-152} r={4} fill={C.blanco} />
    {Array.from({ length: 9 }, (_, i) => <g key={i}><circle cx={-190 + i * 48} cy={-14} r={20} fill={i % 2 ? C.purpura : C.crema} stroke={C.negro} strokeWidth={3} /><circle cx={-190 + i * 48} cy={-14} r={5} fill={C.negro} /></g>)}
    <path d="M0 -10 V -300" stroke={C.negro} strokeWidth={8} />
    {vela && <path d={`M-140 -290 L 140 -290 C ${150 + Math.sin(f / 12) * 10} -210, ${150 + Math.sin(f / 12) * 10} -130, 140 -60 L -140 -60 C ${-130 + Math.sin(f / 12) * 10} -130, ${-130 + Math.sin(f / 12) * 10} -210, -140 -290 Z`} fill={C.crema} stroke={C.negro} strokeWidth={3} />}
    {vela && [-105, -35, 35, 105].map((xx) => <rect key={xx} x={xx - 18} y={-288} width={36} height={226} fill={C.purpura} opacity={0.85} />)}
  </g>
);
/** Yggdrasil: el fresno del mundo, enorme, con raíces y copa. */
const Yggdrasil: React.FC<{ x: number; y?: number; s?: number; f: number; color?: string }> = ({ x, y = SUELO, s = 1, f, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-60 0 C -50 -150, -40 -300, -30 -420 L 30 -420 C 40 -300, 50 -150, 60 0 Z" fill={color} />
    {[-1, 1].map((k) => <path key={k} d={`M${k * 40} -10 C ${k * 120} 0, ${k * 200} 30, ${k * 300} 60 M${k * 30} -30 C ${k * 90} -10, ${k * 150} 10, ${k * 220} 70`} stroke={color} strokeWidth={22} fill="none" strokeLinecap="round" />)}
    {[[-1, -380, 260], [1, -400, 280], [-1, -300, 200], [1, -320, 210], [0, -430, 120]].map(([k, yy, l], i) => <path key={i} d={`M0 ${yy} C ${k * l * 0.4} ${yy - 60}, ${k * l * 0.8} ${yy - 90}, ${k * l} ${yy - 130}`} stroke={color} strokeWidth={18 - i * 2} fill="none" strokeLinecap="round" />)}
    {Array.from({ length: 220 }, (_, i) => { const a = azar(i) * Math.PI, r = 60 + Math.sqrt(azar(i + 40)) * 300; const cx = Math.cos(a) * r * 1.25, cy = -440 - Math.sin(a) * r * 0.6;
      return <ellipse key={i} cx={cx} cy={cy} rx={5} ry={16} fill={i % 23 === 0 ? C.purpura : color} transform={`rotate(${azar(i + 3) * 360 + Math.sin(f / 30 + i) * 6} ${cx} ${cy})`} />; })}
    <Inc d="M-20 -60 C -10 -160, 10 -260, -6 -400 M18 -40 C 26 -150, 16 -280, 22 -400" w={2} />
  </g>
);

/** Fondos del tema nórdico (null = usar el genérico). */
function fondoNordico(tipo: string, f: number, astros = true): React.ReactNode {
  const pinos = (n: number, sep: number, x0: number, s: number, color: string) => Array.from({ length: n }, (_, i) => <Pino key={i} x={x0 + i * sep + azar(i) * 80} s={s * (0.85 + azar(i + 4) * 0.3)} color={color} />);
  switch (tipo) {
    case 'campo': case 'nieve':
      return (<>
        <Capa p={0.15}>{astros && <Sol x={1600} y={250} r={40} f={f} />}</Capa>
        <Capa p={0.3}><MonteNevado x={400} alto={380} ancho={700} /><MonteNevado x={1500} alto={300} ancho={620} /></Capa>
        <Capa p={0.6}>{pinos(8, 420, -300, 0.8, C.barroOscuro)}</Capa>
        <Suelo />
      </>);
    case 'bosque': case 'bosque_nevado':
      return (<>
        <Capa p={0.3}>{pinos(14, 260, -400, 0.75, C.barroOscuro)}</Capa>
        <Capa p={0.6}>{pinos(9, 400, -300, 1.1, '#2B4660')}</Capa>
        <Suelo />
      </>);
    case 'monte': case 'jotunheim':
      return (<>
        <Capa p={0.2}><MonteNevado x={1300} alto={600} ancho={900} /><MonteNevado x={300} alto={480} ancho={700} /></Capa>
        <Capa p={0.55}><MonteNevado x={800} alto={300} ancho={700} color="#2B4660" o={0.9} /></Capa>
        <Suelo />
      </>);
    case 'costa': case 'fiordo':
      return (<>
        <Capa p={0.2}><MonteNevado x={200} alto={520} ancho={600} /><MonteNevado x={1800} alto={480} ancho={600} /></Capa>
        <Capa p={0.4}><MonteNevado x={-300} alto={380} ancho={520} color="#2B4660" o={0.9} /><MonteNevado x={2300} alto={360} ancho={520} color="#2B4660" o={0.9} /></Capa>
        <Capa p={1}><Mar f={f} y={SUELO - 50} /></Capa>
      </>);
    case 'olimpo': case 'asgard':
      return (<>
        <Capa p={0.15}>{astros && <Sol x={1650} y={240} r={42} f={f} />}</Capa>
        <Capa p={0.3}><MonteNevado x={900} alto={560} ancho={1000} /></Capa>
        <Capa p={0.6}>{[-200, 500, 1300, 2000].map((xx, i) => <CasaLarga key={i} x={xx} s={0.9 + (i % 2) * 0.3} color="#2B4660" />)}</Capa>
        <Suelo />
        <Capa p={1}>{Array.from({ length: 14 }, (_, i) => <Nube key={i} x={-600 + i * 420} y={SUELO + 10} s={0.9} f={f + i * 20} />)}</Capa>
      </>);
    case 'bifrost':
      return (<>
        <Capa p={0.2}><MonteNevado x={300} alto={420} ancho={700} /></Capa>
        <Capa p={0.5}>{['#C9473B', '#E9A23B', '#E9D46A', '#5FAE7A', '#4E8FC9', '#7C5FB8'].map((c, i) => <path key={i} d={`M-200 ${SUELO} C 300 ${120 + i * 22}, 1500 ${120 + i * 22}, 2200 ${SUELO}`} stroke={c} strokeWidth={22} fill="none" opacity={0.85} />)}</Capa>
        <Suelo />
      </>);
    case 'palacio': case 'templo': case 'salon':
      return (<>
        <Capa p={0.5}>
          <rect x={-1000} y={0} width={6000} height={SUELO} fill="#22384D" />
          {Array.from({ length: 14 }, (_, i) => (
            <g key={i} transform={`translate(${-600 + i * 300} 0)`}>
              <rect x={-22} y={150} width={44} height={SUELO - 150} fill={C.negro} />
              <path d={`M-12 170 V${SUELO} M12 170 V${SUELO}`} stroke={C.barroOscuro} strokeWidth={3} opacity={0.6} />
              <circle cx={150} cy={330} r={46} fill={i % 2 ? C.purpura : C.crema} stroke={C.negro} strokeWidth={5} />
              <circle cx={150} cy={330} r={10} fill={C.negro} />
            </g>
          ))}
          <path d="M-1000 150 L 960 40 L 5000 150 Z" fill={C.negro} />
          <g transform="translate(960 640)"><Fuego f={f} s={1.1} /></g>
        </Capa>
        <Suelo />
      </>);
    case 'yggdrasil':
      return (<>
        <Capa p={0.25}><MonteNevado x={300} alto={300} ancho={600} /><MonteNevado x={1700} alto={260} ancho={600} /></Capa>
        <Capa p={0.6}><Yggdrasil x={960} f={f} s={0.95} color="#1E3348" /></Capa>
        <Suelo />
      </>);
    case 'caos': case 'ginnungagap':
      return (<>
        <Capa p={0.3}>
          <path d={`M-800 ${SUELO} L-800 140 L200 140 L360 ${SUELO} Z`} fill={C.barroClaro} />
          {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-700 + i * 80} 140 l 20 ${60 + azar(i) * 140} l 20 ${-60 - azar(i) * 140} Z`} fill={C.blanco} />)}
          <path d={`M2700 ${SUELO} L2700 140 L1700 140 L1560 ${SUELO} Z`} fill="#3A1610" />
          {[1800, 1950, 2100].map((xx, i) => <g key={i} transform={`translate(${xx} ${SUELO - 40})`}><Fuego f={f + i * 7} s={1.3} /></g>)}
        </Capa>
        {Array.from({ length: 3 }, (_, c) => (
          <Capa key={c} p={0.2 + c * 0.3}>
            {Array.from({ length: 60 }, (_, i) => { const a = i * 2.4 + f / (60 + c * 30), r = 40 + ((i * 37) % 500);
              return <circle key={i} cx={960 + Math.cos(a) * r * 1.2} cy={460 + Math.sin(a) * r * 0.5} r={1.5 + (i % 4)} fill={i % 2 ? C.blanco : '#FF9A3C'} opacity={0.2 + c * 0.2} />; })}
          </Capa>
        ))}
      </>);
    case 'inframundo': case 'hel':
      return (<>
        <Capa p={0.3}>{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-400 + i * 320} ${SUELO} L${-340 + i * 320} ${200 + azar(i) * 200} L${-260 + i * 320} ${SUELO} Z`} fill="#1A2229" />)}</Capa>
        <Suelo color="#0E1216" />
        <Capa p={0.6}>{Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={-500 + i * 300 + Math.sin(f / 30 + i) * 20} cy={SUELO - 160 - azar(i + 9) * 120} rx={14} ry={30} fill={C.blanco} opacity={0.08 + 0.06 * Math.sin(f / 15 + i)} />)}</Capa>
      </>);
    case 'noche': case 'aurora':
      return (<>
        <Capa p={0.1}><Estrellas f={f} n={50} />{astros && <Luna x={1600} y={260} />}</Capa>
        <Capa p={0.3}><MonteNevado x={500} alto={340} ancho={700} color="#1E3348" /></Capa>
        <Capa p={0.6}>{pinos(7, 420, -300, 0.9, '#0E1A27')}</Capa>
        <Suelo />
      </>);
    case 'ciudad': case 'aldea':
      return (<>
        <Capa p={0.3}><MonteNevado x={1500} alto={360} ancho={700} /></Capa>
        <Capa p={0.55}>{Array.from({ length: 8 }, (_, i) => <CasaLarga key={i} x={-400 + i * 420} s={0.7 + azar(i) * 0.25} color={C.barroOscuro} />)}</Capa>
        <Suelo />
      </>);
    default: return null;
  }
}

// ---------- piel egipcia ----------
const Piramide: React.FC<{ x: number; y?: number; s?: number; color?: string }> = ({ x, y = SUELO, s = 1, color = C.barroOscuro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-260 0 L 0 -300 L 260 0 Z" fill={color} />
    <path d="M0 -300 L 60 0 L 260 0 Z" fill={C.negro} opacity={0.18} />
    <path d="M-26 -270 L 0 -300 L 26 -270 Z" fill={C.oro} />
    {[1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${-260 + i * 37} ${-i * 43} L ${260 - i * 37} ${-i * 43}`} stroke={C.negro} strokeWidth={1.5} opacity={0.25} />)}
  </g>
);
const Obelisco: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 0 L -22 -400 L 0 -430 L 22 -400 L 30 0 Z" fill={C.barroOscuro} stroke={C.negro} strokeWidth={3} />
    <path d="M-22 -400 L 0 -430 L 22 -400 Z" fill={C.oro} />
    <g transform="translate(-8 -380) scale(0.6)"><Jeroglificos x={0} y={0} n={1} /></g>
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={JER[i % JER.length]} transform={`translate(0 ${-360 + i * 42}) scale(0.7)`} stroke={C.negro} strokeWidth={3} fill="none" />)}
  </g>
);
const JER = ['M0 22 C -9 17, -9 2, 0 2 C 9 2, 9 17, 0 22 Z M-10 22 H 10 M0 22 V 40', 'M-12 20 Q 0 10 12 20 Q 0 28 -12 20 Z', 'M0 38 C -6 20, -2 8, 6 2 C 10 14, 8 26, 0 38 Z', 'M-12 12 l 4 -4 l 4 4 l 4 -4 l 4 4 l 4 -4 l 4 4'];
const Papiros: React.FC<{ x: number; y?: number; s?: number; f: number; n?: number }> = ({ x, y = SUELO, s = 1, f, n = 9 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: n }, (_, i) => { const dx = (i - n / 2) * 26, h = 200 + azar(i) * 90, sw = Math.sin(f / 30 + i) * 4; return (
      <g key={i}>
        <path d={`M${dx} 0 Q ${dx + sw} ${-h / 2} ${dx + sw * 2} ${-h}`} stroke="#2E6B4A" strokeWidth={5} fill="none" />
        <path d={`M${dx + sw * 2} ${-h} l -26 -30 l 52 0 Z`} fill="#3E8A5A" stroke={C.negro} strokeWidth={2} />
      </g>
    ); })}
  </g>
);
const Loto: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 V -120" stroke="#2E6B4A" strokeWidth={5} />
    <path d="M0 -120 C -30 -140, -30 -170, -12 -180 L 0 -150 L 12 -180 C 30 -170, 30 -140, 0 -120 Z" fill="#7FA6D8" stroke={C.negro} strokeWidth={2} />
    <path d="M0 -150 L 0 -196" stroke="#7FA6D8" strokeWidth={10} strokeLinecap="round" />
  </g>
);
const BarcaSolar: React.FC<{ x: number; y?: number; s?: number; f: number; disco?: boolean }> = ({ x, y = SUELO - 30, s = 1, f, disco = true }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 15) * 5}) scale(${s})`}>
    <path d="M-260 -60 C -220 10, 220 10, 260 -60 C 240 -20, -240 -20, -260 -60 Z" fill={C.oro} stroke={C.negro} strokeWidth={4} />
    <path d="M-260 -60 C -270 -80, -250 -100, -236 -96 M260 -60 C 270 -80, 250 -100, 236 -96" stroke={C.negro} strokeWidth={6} fill="none" />
    <path d="M-60 -24 H 60 V -90 H -60 Z" fill={C.purpura} stroke={C.negro} strokeWidth={3} />
    {disco && <circle cx={0} cy={-150} r={44} fill={C.purpura} stroke={C.oro} strokeWidth={6} />}
  </g>
);
const Pilono: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 1].map((k) => <path key={k} d={`M${k * 60} 0 L ${k * 70} -300 L ${k * 230} -300 L ${k * 250} 0 Z`} fill={C.barroOscuro} stroke={C.negro} strokeWidth={3} />)}
    <rect x={-60} y={-220} width={120} height={220} fill={C.negro} />
    <path d="M-80 -220 H 80" stroke={C.oro} strokeWidth={8} />
    <g transform="translate(-200 -260) scale(1)"><Jeroglificos x={0} y={0} n={4} paso={30} /></g>
    <g transform="translate(110 -260) scale(1)"><Jeroglificos x={0} y={0} n={4} paso={30} /></g>
  </g>
);
const ColumnaPapiro: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-28} y={-430} width={56} height={430} fill={C.barroOscuro} stroke={C.negro} strokeWidth={3} />
    <path d="M-28 -430 C -60 -470, -40 -500, 0 -500 C 40 -500, 60 -470, 28 -430 Z" fill={'#2E8B6E'} stroke={C.negro} strokeWidth={3} />
    {[0, 1, 2].map((i) => <path key={i} d={`M-28 ${-120 - i * 14} H 28`} stroke={C.purpura} strokeWidth={6} />)}
    <g transform="translate(-8 -380) scale(0.8)"><Jeroglificos x={0} y={0} n={1} /></g>
  </g>
);
const Balanza: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => { const a = Math.sin(f / 30) * 4; return (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 V -300 M-30 0 H 30" stroke={C.negro} strokeWidth={10} />
    <g transform={`rotate(${a} 0 -300)`}>
      <path d="M-160 -300 H 160" stroke={C.negro} strokeWidth={8} />
      {[-160, 160].map((px) => <g key={px}><path d={`M${px} -300 L ${px - 40} -200 M${px} -300 L ${px + 40} -200`} stroke={C.negro} strokeWidth={2} /><path d={`M${px - 50} -200 Q ${px} -170 ${px + 50} -200 Z`} fill={C.oro} stroke={C.negro} strokeWidth={3} /></g>)}
      {/* corazón (vasija ib) y pluma de Maat */}
      <path d="M-178 -202 C -184 -222, -174 -238, -160 -238 C -146 -238, -136 -222, -142 -202 Z M-168 -238 L -168 -246 L -152 -246 L -152 -238" fill="#A8321F" stroke={C.negro} strokeWidth={2.5} />
      <path d="M160 -202 C 152 -226, 156 -254, 170 -272 C 176 -250, 174 -226, 166 -202 Z" fill={C.blanco} stroke={C.negro} strokeWidth={2.5} />
    </g>
    <circle cx={0} cy={-310} r={14} fill={C.oro} stroke={C.negro} strokeWidth={3} />
  </g>
); };
const Sarcofago: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-60 0 C -70 -120, -60 -300, 0 -320 C 60 -300, 70 -120, 60 0 Z" fill={C.oro} stroke={C.negro} strokeWidth={4} />
    <path d="M-34 -240 C -30 -290, 30 -290, 34 -240 C 30 -220, -30 -220, -34 -240 Z" fill={'#2E5FA8'} stroke={C.negro} strokeWidth={2} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M-50 ${-180 + i * 40} H 50`} stroke={i % 2 ? C.purpura : '#2E8B6E'} strokeWidth={8} />)}
  </g>
);
const Palmera2: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-8 0 C -4 -120, 10 -200, 4 -300 L 16 -300 C 22 -200, 8 -120, 10 0 Z" fill="#7A5230" stroke={C.negro} strokeWidth={2} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M10 -300 q ${Math.cos(i * 0.8) * 60} ${-40 + Math.sin(i * 0.8 + f / 40) * 30} ${Math.cos(i * 0.8) * 130} ${20 + Math.sin(i * 0.8) * 40}`} stroke="#2E6B4A" strokeWidth={12} fill="none" strokeLinecap="round" />)}
  </g>
);
const NiloAgua: React.FC<{ f: number; y?: number }> = ({ f, y = SUELO - 50 }) => (
  <g>
    <rect x={-2000} y={y} width={8000} height={400} fill={'#2E6E8C'} />
    {[0, 1, 2, 3].map((r) => <path key={r} d={Array.from({ length: 160 }, (_, i) => `${i ? 'L' : 'M'}${-2000 + i * 50 - ((f * 1.5) % 50)} ${y + 14 + r * 14 + (i % 2 ? 0 : 8)}`).join(' ')} stroke={'#9FD0E0'} strokeWidth={3} fill="none" opacity={0.7} />)}
  </g>
);

/** Fondos del tema egipcio (null = genérico). */
function fondoEgipcio(tipo: string, f: number, astros = true): React.ReactNode {
  const palmeras = (n: number, sep: number, x0: number, s: number) => Array.from({ length: n }, (_, i) => <Palmera2 key={i} x={x0 + i * sep} s={s * (0.85 + azar(i) * 0.3)} f={f + i * 7} />);
  switch (tipo) {
    case 'campo': case 'nilo': case 'costa': case 'mar':
      return (<>
        <Capa p={0.12}>{astros && <Sol x={1600} y={240} r={46} f={f} />}</Capa>
        <Capa p={0.3}><Piramide x={1500} s={0.7} /><Piramide x={1180} s={0.45} /></Capa>
        <Capa p={0.6}>{palmeras(6, 520, -400, 0.85)}</Capa>
        <Capa p={1}><NiloAgua f={f} y={SUELO - 40} /><Papiros x={300} f={f} s={0.9} /><Papiros x={2100} f={f} s={0.8} /></Capa>
      </>);
    case 'desierto': case 'piramides': case 'monte':
      return (<>
        <Capa p={0.1}>{astros && <Sol x={1600} y={230} r={56} f={f} />}</Capa>
        <Capa p={0.3}><Piramide x={600} s={1.1} /><Piramide x={1150} s={0.8} /><Piramide x={1500} s={0.5} /></Capa>
        <Capa p={0.5}>{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-600 + i * 700} ${SUELO} C ${-400 + i * 700} ${SUELO - 140}, ${-100 + i * 700} ${SUELO - 140}, ${100 + i * 700} ${SUELO} Z`} fill={C.barroOscuro} opacity={0.55} />)}</Capa>
        <Suelo />
      </>);
    case 'bosque': case 'juncal':
      return (<>
        <Capa p={0.3}>{Array.from({ length: 10 }, (_, i) => <Papiros key={i} x={-400 + i * 320} f={f + i * 9} s={0.9} />)}</Capa>
        <Capa p={0.6}>{palmeras(5, 600, -300, 1)}{[200, 900, 1600].map((x) => <Loto key={x} x={x} s={0.8} />)}</Capa>
        <Capa p={1}><NiloAgua f={f} y={SUELO - 10} /></Capa>
      </>);
    case 'palacio': case 'templo': case 'olimpo':
      return (<>
        <Capa p={0.5}>
          <rect x={-1000} y={0} width={6000} height={SUELO} fill={C.barroClaro} />
          {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${-500 + i * 700} 260)`}><Jeroglificos x={0} y={0} n={12} paso={34} /><Jeroglificos x={0} y={60} n={12} paso={34} color={C.purpura} /></g>)}
          {Array.from({ length: 12 }, (_, i) => <ColumnaPapiro key={i} x={-600 + i * 360} />)}
          <Bloques y={150} alto={30} />
        </Capa>
        <Suelo />
      </>);
    case 'ciudad':
      return (<>
        <Capa p={0.15}>{astros && <Sol x={1600} y={240} r={46} f={f} />}</Capa>
        <Capa p={0.4}><Pilono x={960} s={1} />{palmeras(4, 800, -500, 0.8)}</Capa>
        <Capa p={0.6}><Obelisco x={600} s={0.8} /><Obelisco x={1320} s={0.8} /></Capa>
        <Suelo />
      </>);
    case 'noche': case 'cielo_nut': case 'aurora':
      return (<>
        <Capa p={0.1}>{astros && <><Estrellas f={f} n={70} /><Luna x={1600} y={250} /></>}</Capa>
        <Capa p={0.3}><Piramide x={700} s={0.9} color={'#1A2A44'} /><Piramide x={1250} s={0.6} color={'#1A2A44'} /></Capa>
        <Capa p={0.6}>{palmeras(4, 700, -300, 0.9)}</Capa>
        <Suelo color={C.negro} />
      </>);
    case 'caos': case 'nun':
      return (<>
        <Capa p={0.2}>{Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={((i * 400 + f * 0.8) % 2600) - 300} cy={300 + (i % 3) * 120} rx={360} ry={60} fill={'#3A5A7A'} opacity={0.25} />)}</Capa>
        <Capa p={0.6}>{Array.from({ length: 4 }, (_, r) => <path key={r} d={Array.from({ length: 70 }, (_, i) => `${i ? 'L' : 'M'}${-1000 + i * 60 - ((f * (1 + r * 0.3)) % 60)} ${520 + r * 70 + (i % 2 ? 0 : 18)}`).join(' ')} stroke={'#6FA8C8'} strokeWidth={4} fill="none" opacity={0.6} />)}</Capa>
        <Capa p={1}><rect x={-2000} y={SUELO - 20} width={6000} height={400} fill={'#0E2236'} /></Capa>
      </>);
    case 'inframundo': case 'duat': case 'cueva':
      return (<>
        <Capa p={0.15}>{astros && <Estrellas f={f} n={40} />}</Capa>
        <Capa p={0.4}>{Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${-400 + i * 560} ${SUELO})`}><path d="M-90 0 V -340 H 90 V 0" stroke={C.oro} strokeWidth={10} fill="none" opacity={0.7} /><rect x={-70} y={-320} width={140} height={320} fill={'#140E18'} /><path d="M-60 -300 C -20 -330, 20 -330, 60 -300" stroke={C.purpura} strokeWidth={6} fill="none" /></g>)}</Capa>
        <Capa p={1}><NiloAgua f={f * 0.5} y={SUELO - 10} /></Capa>
      </>);
    case 'sala_juicio':
      return (<>
        <Capa p={0.4}>
          <rect x={-1000} y={0} width={6000} height={SUELO} fill={'#2A1E2E'} />
          {Array.from({ length: 10 }, (_, i) => <ColumnaPapiro key={i} x={-500 + i * 420} />)}
          <Bloques y={150} alto={30} />
        </Capa>
        <Suelo />
      </>);
    default: return null;
  }
}

/** Nut, la diosa del cielo, arqueada sobre el mundo: manos y pies en el suelo, cuerpo cubierto de estrellas. */
const NutArco: React.FC<{ x: number; s?: number; f: number }> = ({ x, s = 1, f }) => {
  const w = 760 * s, top = 210, base = SUELO;
  const cuerpo = `M${x - w} ${base} L ${x - w} ${top + 150} Q ${x - w} ${top} ${x - w + 160} ${top} L ${x + w - 160} ${top} Q ${x + w} ${top} ${x + w} ${top + 150} L ${x + w} ${base}`;
  return (
    <g>
      <path d={cuerpo} stroke={C.negro} strokeWidth={76} fill="none" strokeLinejoin="round" />
      <path d={cuerpo} stroke="#2E4E9E" strokeWidth={66} fill="none" strokeLinejoin="round" />
      {Array.from({ length: 34 }, (_, i) => {
        const t = (i + 0.5) / 34, L = 2 * (base - top - 150) + 2 * 160 + (2 * w - 320);
        let d = t * L, px = 0, py = 0;
        const tramo1 = base - top - 150 + 160;
        if (d < tramo1) { px = x - w; py = base - d; } else if (d < tramo1 + 2 * w - 320) { px = x - w + 160 + (d - tramo1); py = top; } else { px = x + w; py = top + (d - tramo1 - (2 * w - 320)); }
        return <path key={i} d={`M${px} ${py - 9} l 3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 Z`} fill={C.oro} opacity={0.75 + 0.25 * Math.sin(f / 10 + i)} />;
      })}
      {/* cabeza colgando del lado izquierdo, mirando hacia abajo */}
      <g transform={`translate(${x - w + 70} ${top + 40}) rotate(90)`}>
        <path d="M-30 2 C -22 -26, 0 -36, 20 -30 C 30 -14, 41 6, 32 10 C 34 15, 26 26, 8 32 C 4 46, -16 46, -24 22 Z" fill="#2E4E9E" stroke={C.negro} strokeWidth={2.5} />
        <path d="M-31 4 C -26 -24, -2 -38, 22 -32 C 10 -22, -8 -16, -16 0 C -22 22, -30 60, -40 90" stroke={C.negro} strokeWidth={10} fill="none" />
        <circle cx={18} cy={-6} r={3} fill={C.blanco} />
      </g>
      {/* manos y pies */}
      <path d={`M${x - w - 40} ${base} h 40 M${x + w} ${base} h 44`} stroke={C.negro} strokeWidth={14} strokeLinecap="round" />
    </g>
  );
};

// ---------- piel hawaiana (tema kapa) ----------
// Figuras planas con contorno oscuro, paleta de kapa (tierra, hollín, rojo ʻalaea, crema) y acentos
// turquesa (mar), naranja (lava), amarillo y rojo (plumas). Todo se mueve apenas con `f`.
const K = {
  tierra: '#6B3F1D', tierraOsc: '#43260F', hollin: '#1A1410', alaea: '#B2331F', crema: '#E8D9B5',
  arena: '#D8BE86', arenaOsc: '#B39462', arenaNegra: '#2B2420',
  verde: '#3E6B35', verdeOsc: '#24452A', verdeClaro: '#7FA04A', hoja: '#4C8A3E',
  turquesa: '#2A9196', turquesaClaro: '#86CFC4', azul: '#1D5272', azulOsc: '#0E2D45',
  lava: '#FF5A14', lavaClara: '#FFC23A', lavaOsc: '#9E1E0C',
  pluma: '#E8B81C', piedra: '#36302C', piedraClara: '#5C524A', madera: '#7A4A26', maderaClara: '#A86E3A',
  paja: '#B58A45', pajaOsc: '#8A6430', lehua: '#D3242A',
};
const n1 = (v: number) => v.toFixed(1);

type MotivoKapa = 'tri' | 'dientes' | 'zig' | 'rombo' | 'lineas' | 'puntos';
/** Banda de motivos de kapa (como los sellos de bambú ʻohe kāpala). */
const BandaKapa: React.FC<{ x0: number; x1: number; y: number; alto: number; tipo: MotivoKapa; color: string; o?: number; paso?: number; w?: number }> = ({ x0, x1, y, alto, tipo, color, o = 1, paso, w = 3 }) => {
  const p = paso ?? alto, n = Math.max(1, Math.ceil((x1 - x0) / p));
  if (tipo === 'lineas') return <path d={[0, 0.5, 1].map((k) => `M${x0} ${y + alto * k}H${x1}`).join('')} stroke={color} strokeWidth={w} opacity={o} />;
  if (tipo === 'puntos') return <g opacity={o}>{Array.from({ length: n }, (_, i) => <circle key={i} cx={x0 + (i + 0.5) * p} cy={y + alto / 2} r={alto * 0.24} fill={color} />)}</g>;
  if (tipo === 'zig') return <path d={`M${x0} ${y + alto}` + Array.from({ length: n }, (_, i) => `L${n1(x0 + (i + 0.5) * p)} ${y}L${n1(x0 + (i + 1) * p)} ${y + alto}`).join('')} stroke={color} strokeWidth={w} fill="none" opacity={o} />;
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * p;
    if (tipo === 'tri') d += `M${n1(x)} ${y + alto}L${n1(x + p / 2)} ${y}L${n1(x + p)} ${y + alto}Z`;
    else if (tipo === 'dientes') d += `M${n1(x)} ${y}L${n1(x + p / 2)} ${y + alto}L${n1(x + p)} ${y}Z`;
    else d += `M${n1(x + p / 2)} ${y}L${n1(x + p)} ${y + alto / 2}L${n1(x + p / 2)} ${y + alto}L${n1(x)} ${y + alto / 2}Z`;
  }
  return <path d={d} fill={color} opacity={o} />;
};

type TipoSuelo = 'arena' | 'arena_negra' | 'lava' | 'hierba' | 'piedra' | 'nieve' | 'oscuro' | 'ceniza' | 'marino';
const SUELOS: Record<TipoSuelo, [string, string]> = {
  arena: [K.arena, K.arenaOsc], arena_negra: [K.arenaNegra, '#4E433B'], lava: ['#1E1915', '#3A302A'], hierba: [K.verde, K.verdeOsc],
  piedra: [K.piedra, K.piedraClara], nieve: ['#F2EFE8', '#B9C6CF'], oscuro: ['#150F0B', '#2C1F16'], ceniza: ['#6E3424', '#8E4A33'], marino: ['#C9B07E', '#A68C5C'],
};
/** Suelo de kapa: franja con motivo estampado (arena, hierba, lava, nieve…). */
const SueloK: React.FC<{ tipo?: TipoSuelo; f?: number; desde?: number; hasta?: number }> = ({ tipo = 'arena', f = 0, desde: x0 = -1600, hasta = 6000 }) => {
  const [base, motivo] = SUELOS[tipo];
  const n = Math.ceil((hasta - x0) / 70);
  return (
    <g>
      <rect x={x0} y={SUELO} width={hasta - x0} height={400} fill={base} />
      <BandaKapa x0={x0} x1={hasta} y={SUELO + 12} alto={14} paso={26} tipo={tipo === 'hierba' ? 'tri' : tipo === 'nieve' ? 'puntos' : 'dientes'} color={motivo} o={0.9} />
      {tipo === 'lava' && Array.from({ length: Math.ceil((hasta - x0) / 160) }, (_, i) => <path key={i} d={`M${x0 + i * 160 + azar(i) * 60} ${SUELO + 4} l 14 10 l -6 12 l 18 10`} stroke={K.lava} strokeWidth={3} fill="none" opacity={0.5 + 0.4 * Math.sin(f / 14 + i)} />)}
      <path d={`M${x0} ${SUELO}H${hasta}`} stroke={C.negro} strokeWidth={5} />
      {tipo === 'hierba' && <path d={Array.from({ length: n }, (_, i) => { const x = x0 + i * 70 + azar(i) * 40, h = 9 + azar(i + 7) * 10; return `M${n1(x)} ${SUELO}l3 ${n1(-h)}l3 ${n1(h)}l4 ${n1(-h * 1.3)}l4 ${n1(h * 1.3)}l3 ${n1(-h * 0.8)}l3 ${n1(h * 0.8)}Z`; }).join('')} fill={K.verdeOsc} stroke={C.negro} strokeWidth={1.5} />}
      {tipo === 'nieve' && <path d={`M${x0} ${SUELO + 2} ` + Array.from({ length: Math.ceil((hasta - x0) / 110) }, (_, i) => `Q ${x0 + i * 110 + 55} ${SUELO - 12 - azar(i) * 8} ${x0 + (i + 1) * 110} ${SUELO + 2}`).join(' ') + ` L${hasta} ${SUELO + 6} L${x0} ${SUELO + 6} Z`} fill="#FFFFFF" stroke={C.negro} strokeWidth={2} />}
    </g>
  );
};

/** Cordillera de pali: acantilados verdes con estrías verticales (las laderas acanaladas de las islas). */
const Pali: React.FC<{ x: number; ancho: number; alto: number; base?: number; color?: string; claro?: string; o?: number; seed?: number; estrias?: number }> = ({ x, ancho, alto, base = SUELO, color = K.verde, claro = K.verdeClaro, o = 1, seed = 1, estrias = 34 }) => {
  const h = (t: number) => alto * Math.pow(Math.sin(Math.PI * t), 0.45) * (0.8 + 0.12 * Math.sin(t * 11 + seed) + 0.08 * Math.sin(t * 27 + seed * 3));
  const X = (t: number) => x - ancho / 2 + ancho * t;
  const top = Array.from({ length: 61 }, (_, i) => { const t = i / 60; return `${n1(X(t))} ${n1(base - h(t))}`; });
  return (
    <g opacity={o}>
      <path d={`M${X(0)} ${base + 200}L${top.join('L')}L${X(1)} ${base + 200}Z`} fill={color} stroke={C.negro} strokeWidth={3} />
      {Array.from({ length: estrias }, (_, i) => {
        const t = (i + 0.5 + (azar(i + seed) - 0.5) * 0.6) / estrias, x0 = X(t), y0 = base - h(t) + 8, dx = (azar(i * 3 + seed) - 0.5) * 30;
        return <g key={i}>
          <path d={`M${n1(x0)} ${n1(y0)}C${n1(x0 + dx * 0.3)} ${n1(y0 + (base - y0) * 0.4)} ${n1(x0 + dx)} ${n1(y0 + (base - y0) * 0.7)} ${n1(x0 + dx)} ${base}`} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.35} />
          <path d={`M${n1(x0 + 7)} ${n1(y0 + 14)}C${n1(x0 + 7 + dx * 0.3)} ${n1(y0 + (base - y0) * 0.4)} ${n1(x0 + 7 + dx)} ${n1(y0 + (base - y0) * 0.6)} ${n1(x0 + 7 + dx)} ${n1(y0 + (base - y0) * 0.8)}`} stroke={claro} strokeWidth={3} fill="none" opacity={0.45} />
        </g>;
      })}
    </g>
  );
};

/** Fronda de palmera o helecho: raquis curvo con folíolos en serrucho (un solo path relleno). */
function fronda(x0: number, y0: number, ang: number, largo: number, caida: number, hoja: number, n = 14): string {
  const ex = x0 + Math.cos(ang) * largo, ey = y0 + Math.sin(ang) * largo + caida;
  const cx = x0 + Math.cos(ang) * largo * 0.55, cy = y0 + Math.sin(ang) * largo * 0.55 - largo * 0.12;
  const pt = (t: number) => [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * ex, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * ey];
  const tg = (t: number) => { const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (ex - cx), dy = 2 * (1 - t) * (cy - y0) + 2 * t * (ey - cy), l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  const lado = (sg: number) => {
    const out: string[] = [];
    for (let i = 1; i < n; i++) {
      const t = i / n, [px, py] = pt(t), [tx, ty] = tg(t), nx = -ty * sg, ny = tx * sg;
      const l = hoja * Math.sin(Math.PI * (0.15 + 0.8 * t));
      const caer = sg > 0 ? 0.5 : 0.15;
      out.push(`${n1(px)} ${n1(py)}`, `${n1(px + nx * l + tx * l * 0.55)} ${n1(py + ny * l + ty * l * 0.55 + l * caer)}`);
    }
    return out;
  };
  const a = lado(1), b = lado(-1);
  const pares: string[] = [];
  for (let i = b.length - 2; i >= 0; i -= 2) pares.push(b[i + 1], b[i]);
  return `M${n1(x0)} ${n1(y0)}L${a.join('L')}L${n1(ex)} ${n1(ey)}L${pares.join('L')}Z`;
}

/** Niu: cocotero de tronco curvo anillado, frondas que se mecen y cocos. */
const Niu: React.FC<{ x: number; y?: number; s?: number; f: number; inclina?: number; hojas?: string; tronco?: string; espejo?: boolean }> = ({ x, y = SUELO, s = 1, f, inclina = 0.2, hojas = K.hoja, tronco = K.madera, espejo }) => {
  const sw = Math.sin(f / 30 + x * 0.013);
  const pts: P[] = [[0, 0], [inclina * 30, -110], [inclina * 110, -230], [inclina * 230, -340], [inclina * 380 + sw * 4, -440]];
  const [tx, ty] = pts[4];
  const angs = [-172, -146, -118, -92, -64, -36, -10, 16, 188, 160];
  return (
    <g transform={`translate(${x} ${y}) scale(${espejo ? -s : s} ${s})`}>
      <path d={miembro(pts, [36, 30, 26, 22, 20])} fill={tronco} stroke={C.negro} strokeWidth={3} />
      {Array.from({ length: 17 }, (_, i) => {
        const t = (i + 0.6) / 18, k = Math.min(3, Math.floor(t * 4)), u = t * 4 - k, a = pts[k], b = pts[k + 1];
        const px = a[0] + (b[0] - a[0]) * u, py = a[1] + (b[1] - a[1]) * u, w = 17 - t * 7;
        return <path key={i} d={`M${n1(px - w)} ${n1(py)}q${n1(w)} 7 ${n1(w * 2)} 0`} stroke={C.negro} strokeWidth={2} fill="none" opacity={0.55} />;
      })}
      {angs.map((g, i) => {
        const a = ((g + Math.sin(f / 26 + i * 1.3) * 4 + sw * 3) * Math.PI) / 180, horiz = Math.abs(Math.cos(a));
        const fondo = i >= 8 || i === 3;
        return <path key={i} d={fronda(tx, ty, a, 190 + horiz * 30, 30 + horiz * 90, 48, 11)} fill={fondo ? K.verdeOsc : hojas} stroke={C.negro} strokeWidth={2.5} strokeLinejoin="round" />;
      })}
      {[[-12, 12], [12, 16], [0, 26], [20, 2], [-22, 0]].map(([dx, dy], i) => <circle key={i} cx={tx + dx} cy={ty + dy} r={14} fill={i % 2 ? '#6E5A22' : '#8A7A2C'} stroke={C.negro} strokeWidth={2.5} />)}
    </g>
  );
};

/** Pompón de lehua (estambres rojos con puntas doradas). */
const Pompon: React.FC<{ x: number; y: number; r?: number; f: number; color?: string }> = ({ x, y, r = 11, f, color = K.lehua }) => {
  const k = 1 + Math.sin(f / 20 + x * 0.1 + y * 0.07) * 0.08;
  return (
    <g transform={`translate(${n1(x)} ${n1(y)}) scale(${n1(k)})`}>
      <circle r={r * 0.55} fill={color} stroke={C.negro} strokeWidth={1.5} />
      {Array.from({ length: 11 }, (_, i) => { const a = (i / 11) * Math.PI * 2 - Math.PI / 2; return <g key={i}><path d={`M0 0L${n1(Math.cos(a) * r)} ${n1(Math.sin(a) * r)}`} stroke={color} strokeWidth={2.4} /><circle cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={1.8} fill={K.pluma} /></g>; })}
    </g>
  );
};

/** Copa abultada (borde irregular, para árboles). */
const copa = (cx: number, cy: number, rx: number, ry: number, seed: number) => suave(Array.from({ length: 11 }, (_, i) => { const a = (i / 11) * Math.PI * 2, r = 0.82 + azar(seed + i) * 0.2; return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r] as P; }), true);

/** ʻŌhiʻa lehua: tronco retorcido, copas redondas y flores rojas. */
const Lehua: React.FC<{ x: number; y?: number; s?: number; f: number; hojas?: string; tronco?: string; flores?: boolean; seed?: number }> = ({ x, y = SUELO, s = 1, f, hojas = '#2F5530', tronco = '#4E3220', flores = true, seed = 0 }) => {
  const rot = Math.sin(f / 42 + x * 0.01) * 0.8;
  const copas: [number, number, number, number][] = [[-150, -300, 88, 58], [150, -315, 88, 56], [-60, -372, 100, 66], [64, -385, 96, 64], [0, -300, 120, 62], [-108, -250, 64, 40], [112, -262, 66, 40]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`rotate(${n1(rot)} 0 -40)`}>
        {[['M-2 -190 C -40 -230, -90 -260, -140 -300', 15], ['M6 -230 C 40 -270, 100 -290, 140 -312', 13], ['M0 -250 C -10 -300, -40 -340, -60 -370', 12], ['M4 -250 C 20 -300, 50 -350, 64 -380', 11], ['M8 -160 C 50 -190, 90 -220, 112 -258', 10]].map(([d, w], i) => (
          <g key={i}><path d={d as string} stroke={C.negro} strokeWidth={(w as number) + 5} fill="none" strokeLinecap="round" /><path d={d as string} stroke={tronco} strokeWidth={w as number} fill="none" strokeLinecap="round" /></g>
        ))}
        <path d={miembro([[0, 0], [-14, -70], [10, -150], [-6, -220], [2, -260]], [44, 32, 28, 22, 16])} fill={tronco} stroke={C.negro} strokeWidth={3} />
        <Inc d="M-6 -20 C -14 -70, 6 -110, -2 -160 M8 -40 C 2 -90, 18 -140, 6 -200" w={1.6} c="#8A6A50" />
        {copas.map(([cx, cy, rx, ry], i) => <path key={i} d={copa(cx, cy, rx, ry, seed + i * 7)} fill={i % 3 === 1 ? K.verdeOsc : hojas} stroke={C.negro} strokeWidth={3} />)}
        {copas.map(([cx, cy, rx, ry], i) => Array.from({ length: 5 }, (_, j) => { const a = azar(seed + i * 9 + j) * 6.28, r = azar(seed + i * 5 + j + 40) * 0.6; const px = cx + Math.cos(a) * rx * r, py = cy + Math.sin(a) * ry * r; return <path key={`${i}-${j}`} d={`M${n1(px - 8)} ${n1(py)}q8 -9 16 0`} stroke={K.verdeClaro} strokeWidth={2} fill="none" opacity={0.7} />; }))}
        {flores && copas.map(([cx, cy, rx, ry], i) => Array.from({ length: 4 }, (_, j) => { const a = azar(seed + i * 13 + j + 3) * 6.28, r = 0.25 + azar(seed + i * 3 + j + 77) * 0.6; return <Pompon key={`f${i}-${j}`} x={cx + Math.cos(a) * rx * r} y={cy + Math.sin(a) * ry * r} f={f} />; }))}
      </g>
    </g>
  );
};

/** Hāpuʻu: helecho arborescente (tronco peludo y frondas finas). */
const Hapuu: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-20 0 C -24 -50, -18 -90, -14 -120 L 14 -120 C 18 -90, 22 -50, 20 0 Z" fill="#5A3A22" stroke={C.negro} strokeWidth={3} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M-16 ${-14 - i * 22} l 8 -6 l 8 6 l 8 -6 l 8 6`} stroke="#8A5A32" strokeWidth={2} fill="none" />)}
    {[-168, -140, -112, -86, -64, -38, -12].map((g, i) => {
      const a = ((g + Math.sin(f / 24 + i) * 3) * Math.PI) / 180;
      return <path key={i} d={fronda(0, -120, a, 150, 20 + Math.abs(Math.cos(a)) * 50, 20, 18)} fill={i % 2 ? '#5E9A3C' : '#4A8034'} stroke={C.negro} strokeWidth={2} strokeLinejoin="round" />;
    })}
    <path d="M-6 -122 c -4 -14, 4 -22, 10 -18 c 6 4, 0 10, -4 6" stroke="#6E9A3E" strokeWidth={4} fill="none" />
  </g>
);

/** Hoja de kalo (corazón con la punta hacia abajo; muesca en el origen). */
const HOJA_KALO = 'M0 0 C -10 -20, -52 -26, -58 4 C -62 46, -26 86, 0 118 C 26 86, 62 46, 58 4 C 52 -26, 10 -20, 0 0 Z';
/** Kalo: planta de taro con hojas grandes de corazón. */
const Kalo: React.FC<{ x: number; y?: number; s?: number; f: number; color?: string }> = ({ x, y = SUELO, s = 1, f, color = '#3F7A3A' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {([[-36, 150], [34, 140], [-12, 190], [12, 175], [0, 120]] as [number, number][]).map(([a, l], i) => {
      const r = (a * Math.PI) / 180, ax = Math.sin(r) * l, ay = -Math.cos(r) * l, rot = -a * 1.35 + 8 + Math.sin(f / 24 + i * 1.7) * 5;
      const d = `M0 0Q${n1(ax * 0.2)} ${n1(ay * 0.6)} ${n1(ax)} ${n1(ay)}`;
      return (
        <g key={i}>
          <path d={d} stroke={C.negro} strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d={d} stroke="#7FA04A" strokeWidth={5.5} fill="none" strokeLinecap="round" />
          <g transform={`translate(${n1(ax)} ${n1(ay)}) rotate(${n1(rot)}) scale(0.85)`}>
            <path d={HOJA_KALO} fill={i % 2 ? color : K.hoja} stroke={C.negro} strokeWidth={3} />
            <path d="M0 2 L0 112 M0 30 L-36 10 M0 30 L36 10 M0 58 L-36 48 M0 58 L36 48 M0 84 L-20 80 M0 84 L20 80" stroke="#A6CC7A" strokeWidth={2} fill="none" opacity={0.75} />
          </g>
        </g>
      );
    })}
  </g>
);

/** Hale pili: casa de paja con frontón al frente y el costado en perspectiva. */
const Hale: React.FC<{ x: number; y?: number; s?: number; f?: number; espejo?: boolean }> = ({ x, y = SUELO, s = 1, espejo }) => (
  <g transform={`translate(${x} ${y}) scale(${espejo ? -s : s} ${s})`}>
    {/* costado: pared y techo */}
    <path d="M100 0 V -96 L 320 -96 V 0 Z" fill={K.pajaOsc} stroke={C.negro} strokeWidth={3} />
    <path d="M0 -312 L 220 -312 L 352 -92 L 136 -92 Z" fill="#9A7236" stroke={C.negro} strokeWidth={3} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => { const t = (i + 1) / 8, yy = -312 + t * 220, x0 = t * 136, x1 = 220 + t * 132; return <path key={i} d={`M${n1(x0 + 4)} ${n1(yy)}L${n1(x1 - 4)} ${n1(yy)}`} stroke={C.negro} strokeWidth={2} strokeDasharray="10 5" opacity={0.5} />; })}
    {[0, 1, 2].map((i) => <path key={i} d={`M104 ${-70 + i * 26} H 316`} stroke={C.negro} strokeWidth={2} strokeDasharray="10 5" opacity={0.45} />)}
    <BandaKapa x0={136} x1={352} y={-96} alto={12} paso={18} tipo="dientes" color={K.pajaOsc} />
    {/* frente: pared y frontón */}
    <path d="M-104 0 V -96 L -140 -96 L 0 -316 L 140 -96 L 104 -96 V 0 Z" fill={K.paja} stroke={C.negro} strokeWidth={3} strokeLinejoin="round" />
    {Array.from({ length: 8 }, (_, i) => { const yy = -110 - i * 25, hw = (140 * (yy + 316)) / 220 - 10; return <path key={i} d={`M${n1(-hw)} ${yy}H${n1(hw)}`} stroke={K.pajaOsc} strokeWidth={2.5} strokeDasharray="12 4" />; })}
    {[0, 1, 2].map((i) => <path key={i} d={`M-100 ${-70 + i * 26} H 100`} stroke={K.pajaOsc} strokeWidth={2.5} strokeDasharray="12 4" />)}
    <BandaKapa x0={-140} x1={140} y={-96} alto={12} paso={20} tipo="dientes" color={K.pajaOsc} />
    <path d="M-28 0 V -66 Q 0 -78 28 -66 V 0 Z" fill={C.negro} />
    {/* cumbrera con los palos cruzados */}
    <path d="M-26 -350 L 22 -296 M26 -350 L -22 -296 M0 -316 L 220 -312" stroke={C.negro} strokeWidth={6} strokeLinecap="round" />
    <path d="M194 -346 L 242 -292 M246 -346 L 198 -292" stroke={C.negro} strokeWidth={5} strokeLinecap="round" />
  </g>
);

/** Waʻa kaulua: canoa de doble casco con vela de pinza de cangrejo. */
const Waa: React.FC<{ x: number; y?: number; s?: number; f: number; vela?: boolean; quieta?: boolean; espejo?: boolean }> = ({ x, y = SUELO - 30, s = 1, f, vela = true, quieta, espejo }) => {
  const bob = quieta ? 0 : Math.sin(f / 15) * 6, rot = quieta ? 0 : Math.sin(f / 20) * 1.8, v = Math.sin(f / 14) * 6;
  const casco = 'M-300 -40 C -270 -20, -240 4, -200 10 C -80 22, 80 22, 200 10 C 240 4, 270 -20, 310 -56 L 290 -30 C 260 -30, 230 -32, 200 -30 L -200 -30 C -240 -30, -270 -30, -300 -40 Z';
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${n1(rot)}) scale(${espejo ? -s : s} ${s})`}>
      {/* casco de atrás */}
      <g transform="translate(36 -26)"><path d={casco} fill={K.tierraOsc} stroke={C.negro} strokeWidth={3} /></g>
      {/* travesaños y plataforma */}
      {[-150, -60, 60, 150].map((xx) => <path key={xx} d={`M${xx} -30 L ${xx + 40} -66`} stroke={C.negro} strokeWidth={8} strokeLinecap="round" />)}
      <path d="M-170 -46 L 190 -46" stroke={K.maderaClara} strokeWidth={10} />
      <path d="M-170 -46 L 190 -46" stroke={C.negro} strokeWidth={2} fill="none" strokeDasharray="20 6" />
      {/* casita del techo de paja sobre la plataforma */}
      <path d="M-170 -50 L -130 -110 L -90 -50 Z" fill={K.paja} stroke={C.negro} strokeWidth={3} />
      {/* mástil y vela */}
      <path d="M40 -46 L 30 -330" stroke={C.negro} strokeWidth={8} strokeLinecap="round" />
      {vela && <g>
        <path d={`M50 -60 C 10 -160, -80 -300, ${-150 + v} -400 C ${-70 + v * 0.5} -250, ${70 + v} -250, ${150 + v} -420 C 140 -300, 100 -160, 50 -60 Z`} fill="#D9B56A" stroke={C.negro} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M50 -60 C 10 -160, -80 -300, ${-150 + v} -400 M50 -60 C 100 -160, 140 -300, ${150 + v} -420`} stroke={C.negro} strokeWidth={7} fill="none" strokeLinecap="round" />
        {[0, 1, 2].map((i) => { const t = 0.3 + i * 0.17; return <path key={i} d={`M${n1(50 - (200 - v) * t * 0.9)} ${n1(-60 - 330 * t)} Q 50 ${n1(-80 - 220 * t)} ${n1(50 + (100 + v) * t * 0.95)} ${n1(-60 - 350 * t)}`} stroke={C.negro} strokeWidth={1.5} fill="none" opacity={0.5} />; })}
        <path d={`M${-128 + v} -370 C ${-60 + v * 0.5} -240, ${60 + v} -240, ${128 + v} -388`} stroke={K.alaea} strokeWidth={12} fill="none" />
        <path d={`M${-128 + v} -370 C ${-60 + v * 0.5} -240, ${60 + v} -240, ${128 + v} -388`} stroke={C.crema} strokeWidth={3} strokeDasharray="2 11" strokeLinecap="round" fill="none" />
      </g>}
      {/* casco de adelante */}
      <path d={casco} fill={K.tierra} stroke={C.negro} strokeWidth={3} />
      <path d="M-270 -26 C -150 -14, 150 -14, 270 -30" stroke={C.crema} strokeWidth={3} fill="none" opacity={0.7} />
      <BandaKapa x0={-190} x1={190} y={-12} alto={10} paso={20} tipo="tri" color={K.alaea} />
      {!quieta && <path d={`M-320 ${8 + v * 0.3} q 20 -12 40 0 M290 ${6 - v * 0.3} q 20 -12 40 0`} stroke={C.crema} strokeWidth={4} fill="none" strokeLinecap="round" />}
    </g>
  );
};

/** Kiʻi: imagen tallada en madera, cabeza enorme con cresta, ojos grandes y boca abierta. */
const Kii: React.FC<{ x: number; y?: number; s?: number; madera?: string }> = ({ x, y = SUELO, s = 1, madera = K.madera }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-26 0 V -40 H 26 V 0 Z" fill={K.tierraOsc} stroke={C.negro} strokeWidth={3} />
    {/* piernas flexionadas */}
    <path d="M-50 -40 L -58 -80 L -30 -110 L -10 -110 L -22 -78 L -20 -40 Z M50 -40 L 58 -80 L 30 -110 L 10 -110 L 22 -78 L 20 -40 Z" fill={madera} stroke={C.negro} strokeWidth={3} strokeLinejoin="round" />
    {/* torso y brazos */}
    <path d="M-44 -104 L -50 -196 L 50 -196 L 44 -104 Z" fill={madera} stroke={C.negro} strokeWidth={3} />
    <path d="M-50 -190 L -70 -150 L -62 -110 L -46 -112 L -52 -150 Z M50 -190 L 70 -150 L 62 -110 L 46 -112 L 52 -150 Z" fill={K.maderaClara} stroke={C.negro} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-30 -176 Q 0 -160 30 -176 M-24 -150 H 24 M-18 -128 H 18" stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.7} />
    {/* cabeza */}
    <path d="M-74 -196 L -82 -270 C -82 -320, 82 -320, 82 -270 L 74 -196 Z" fill={madera} stroke={C.negro} strokeWidth={3} />
    {/* cresta (peinado tallado) */}
    {[-60, -30, 0, 30, 60].map((dx, i) => <path key={i} d={`M${dx - 16} -310 C ${dx - 20} -350, ${dx - 4} ${-380 - (i % 2) * 18}, ${dx + 6} ${-384 - (i % 2) * 18} C ${dx + 18} -360, ${dx + 16} -330, ${dx + 14} -306 Z`} fill={i % 2 ? K.maderaClara : madera} stroke={C.negro} strokeWidth={3} />)}
    {/* ojos grandes alargados */}
    {[-1, 1].map((k) => <g key={k}><path d={`M${k * 12} -272 Q ${k * 42} -300 ${k * 70} -268 Q ${k * 42} -256 ${k * 12} -272 Z`} fill={C.crema} stroke={C.negro} strokeWidth={3} /><circle cx={k * 42} cy={-271} r={7} fill={C.negro} /></g>)}
    <path d="M-8 -270 L -14 -236 L 14 -236 L 8 -270" fill={K.maderaClara} stroke={C.negro} strokeWidth={2.5} />
    {/* boca abierta en ocho, con dientes */}
    <path d="M-62 -226 C -40 -238, 40 -238, 62 -226 C 66 -212, 52 -204, 30 -210 C 14 -214, -14 -214, -30 -210 C -52 -204, -66 -212, -62 -226 Z" fill={C.negro} />
    <path d="M-48 -226 V -220 M-30 -229 V -222 M-12 -230 V -223 M6 -230 V -223 M24 -229 V -222 M42 -227 V -220" stroke={C.crema} strokeWidth={4} />
    <path d="M-66 -228 C -40 -244, 40 -244, 66 -228" stroke={K.maderaClara} strokeWidth={5} fill="none" />
  </g>
);

/** Ipu: calabaza grande con tapa, banda de kapa y red de cuerdas. */
const Ipu: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={suave([[0, 0], [70, -20], [96, -80], [80, -140], [44, -170], [56, -210], [40, -248], [-40, -248], [-56, -210], [-44, -170], [-80, -140], [-96, -80], [-70, -20]], true)} fill="#C99A4A" stroke={C.negro} strokeWidth={3.5} />
    <path d="M-80 -140 C -40 -124, 40 -124, 80 -140" stroke={C.negro} strokeWidth={2} fill="none" opacity={0.5} />
    <g><clipPath id="ipu-banda"><path d={suave([[0, 0], [70, -20], [96, -80], [80, -140], [44, -170], [-44, -170], [-80, -140], [-96, -80], [-70, -20]], true)} /></clipPath>
      <g clipPath="url(#ipu-banda)"><rect x={-100} y={-104} width={200} height={34} fill={K.tierra} /><BandaKapa x0={-100} x1={100} y={-100} alto={26} paso={22} tipo="tri" color={K.hollin} /><path d="M-100 -104 H 100 M-100 -70 H 100" stroke={C.negro} strokeWidth={2.5} /></g>
    </g>
    {/* red de cuerdas (koko) */}
    {[-60, -30, 0, 30, 60].map((dx) => <path key={dx} d={`M${dx * 0.7} -168 Q ${dx * 1.5} -80 ${dx * 0.6} -6`} stroke={K.hollin} strokeWidth={2} fill="none" opacity={0.7} />)}
    {/* tapa */}
    <path d="M-44 -246 C -40 -280, 40 -280, 44 -246 Z" fill="#B4863C" stroke={C.negro} strokeWidth={3} />
    <path d="M-40 -248 H 40" stroke={K.alaea} strokeWidth={5} />
    <circle cx={0} cy={-280} r={9} fill={K.tierraOsc} stroke={C.negro} strokeWidth={2.5} />
  </g>
);

/** Kiʻi pōhaku: petroglifo grabado en una piedra de lava (persona, canoa o espiral). */
const Petroglifo: React.FC<{ x: number; y?: number; s?: number; figura?: string }> = ({ x, y = SUELO, s = 1, figura = 'persona' }) => {
  const g = '#B9A994';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-170 0 C -186 -60, -150 -150, -60 -176 C 30 -196, 140 -170, 172 -96 C 190 -50, 180 -14, 170 0 Z" fill={K.piedra} stroke={C.negro} strokeWidth={4} />
      <path d="M-120 -30 q 20 -10 40 0 M100 -40 q 16 -8 30 4 M-60 -150 q 30 -10 60 -4" stroke={K.piedraClara} strokeWidth={3} fill="none" />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={-130 + azar(i) * 270} cy={-20 - azar(i + 9) * 130} r={1.5 + azar(i + 3) * 2} fill={K.piedraClara} />)}
      <g stroke={g} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {figura === 'canoa' ? (<>
          <path d="M-110 -50 Q 0 -20 110 -50" /><path d="M-100 -62 L 100 -62" strokeWidth={4} />
          <path d="M10 -62 L 0 -150 M0 -150 Q -30 -110 -60 -150 M0 -150 Q 30 -110 60 -156" />
          {[-70, -40, 40, 70].map((px) => <g key={px}><circle cx={px} cy={-82} r={6} /><path d={`M${px} -76 V -64 M${px} -72 l 14 18`} /></g>)}
        </>) : figura === 'espiral' ? (<>
          <path d={Array.from({ length: 60 }, (_, i) => { const a = i * 0.32, r = 4 + i * 1.15; return `${i ? 'L' : 'M'}${n1(Math.cos(a) * r - 30)} ${n1(Math.sin(a) * r * 0.9 - 90)}`; }).join('')} />
          <circle cx={80} cy={-110} r={18} /><circle cx={80} cy={-110} r={4} fill={g} />
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={50 + i * 18} cy={-50} r={4} fill={g} />)}
        </>) : (<>
          <circle cx={0} cy={-142} r={14} />
          <path d="M-36 -122 L 36 -122 L 0 -70 Z" />
          <path d="M-36 -122 L -60 -150 L -70 -132 M36 -122 L 60 -150 L 70 -132" />
          <path d="M0 -70 L -26 -60 L -34 -26 M0 -70 L 26 -60 L 34 -26" />
        </>)}
      </g>
    </g>
  );
};

/** Lago de lava: costra negra que se mueve, grietas brillantes y burbujas que revientan. */
const LagoLava: React.FC<{ x: number; y?: number; s?: number; f: number; ancho?: number; prof?: number }> = ({ x, y = SUELO, s = 1, f, ancho = 560, prof }) => {
  const id = 'lago' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const rx = ancho / 2, ry = prof ?? Math.max(30, ancho * 0.08);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cy={-ry * 2} rx={rx * 1.3} ry={ry * 5} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} opacity={0.65 + Math.sin(f / 12) * 0.1} />
      <ellipse rx={rx + 18} ry={ry + 10} fill={C.negro} />
      <clipPath id={id}><ellipse rx={rx} ry={ry} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={-rx} y={-ry} width={ancho} height={ry * 2} fill={K.lava} />
        <ellipse rx={rx * 0.7} ry={ry * 0.55} fill={K.lavaClara} opacity={0.75 + Math.sin(f / 9) * 0.15} />
        {Array.from({ length: 16 }, (_, i) => {
          const w = ancho * 0.16 + azar(i) * ancho * 0.1, rango = ancho + w * 2, px = (((azar(i + 4) * rango + f * (0.25 + azar(i + 8) * 0.3)) % rango) + rango) % rango - rx - w;
          const py = -ry + ((i % 4) + 0.5) * (ry / 2) + (azar(i + 1) - 0.5) * 8, h = ry * 0.36;
          return <path key={i} d={`M${n1(px)} ${n1(py)}l${n1(w * 0.3)} ${n1(-h * 0.6)}l${n1(w * 0.5)} ${n1(-h * 0.1)}l${n1(w * 0.2)} ${n1(h * 0.7)}l${n1(-w * 0.25)} ${n1(h * 0.5)}l${n1(-w * 0.6)} ${n1(-h * 0.1)}Z`} fill="#2A1A12" stroke={K.lavaClara} strokeWidth={2} />;
        })}
        {Array.from({ length: 7 }, (_, i) => {
          const ciclo = 40 + (i % 3) * 14, t = ((f + i * 23) % ciclo) / ciclo, bx = (azar(i * 5) - 0.5) * ancho * 0.8, by = (azar(i * 7 + 2) - 0.5) * ry;
          return <g key={i} opacity={t < 0.85 ? 1 : (1 - t) / 0.15}><circle cx={bx} cy={by} r={4 + t * 16} fill={K.lavaClara} stroke={K.lavaOsc} strokeWidth={2} />{t > 0.8 && <path d={`M${bx - 14} ${by - 10} l -8 -10 M${bx} ${by - 16} v -12 M${bx + 14} ${by - 10} l 8 -10`} stroke={K.lavaClara} strokeWidth={3} />}</g>;
        })}
      </g>
      <ellipse rx={rx} ry={ry} fill="none" stroke={K.lavaOsc} strokeWidth={4} />
    </g>
  );
};

/** Fuente de lava: chorro que salta en arcos y cae enfriándose. */
const FuenteLava: React.FC<{ x: number; y?: number; s?: number; f: number; alto?: number }> = ({ x, y = SUELO, s = 1, f, alto = 280 }) => {
  const nz = (k: number) => Math.sin(f * 0.45 + k) * 0.5 + Math.sin(f * 0.77 + k * 2) * 0.5;
  const h = alto * (0.62 + nz(1) * 0.08);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cy={-alto * 0.45} rx={alto * 0.75} ry={alto * 0.85} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} opacity={0.85} />
      <path d={suave([[-34, 0], [-22, -h * 0.35], [-10 + nz(2) * 6, -h * 0.75], [nz(3) * 8, -h], [12 + nz(4) * 6, -h * 0.72], [22, -h * 0.3], [34, 0]], true)} fill={K.lava} stroke={C.negro} strokeWidth={3} />
      <path d={suave([[-14, 0], [-8, -h * 0.4], [nz(5) * 4, -h * 0.82], [8, -h * 0.4], [14, 0]], true)} fill={K.lavaClara} />
      {Array.from({ length: 40 }, (_, i) => {
        const ciclo = 34 + (i % 6) * 5, t = ((f + i * 11) % ciclo) / ciclo, H = alto * (0.45 + azar(i + 5) * 0.6), vx = (azar(i) - 0.5) * alto * 1.1;
        const px = vx * t, py = -4 * H * t * (1 - t) - h * 0.15 * (1 - t), col = t < 0.45 ? K.lavaClara : t < 0.8 ? K.lava : K.lavaOsc;
        return <circle key={i} cx={n1(px)} cy={n1(py)} r={n1(3 + (1 - t) * 7 * (0.5 + azar(i + 2)))} fill={col} stroke={C.negro} strokeWidth={1.5} />;
      })}
      <ellipse rx={70} ry={14} fill={K.lava} stroke={C.negro} strokeWidth={3} />
      <ellipse rx={40} ry={7} fill={K.lavaClara} />
    </g>
  );
};

/** Kāhili: estandarte de plumas (cilindro amarillo y rojo sobre un asta con bandas). */
const Kahili: React.FC<{ x: number; y?: number; s?: number; f: number; color?: string; color2?: string }> = ({ x, y = SUELO, s = 1, f, color = K.pluma, color2 = K.alaea }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${n1(Math.sin(f / 35 + x) * 1.2)})`}>
    <rect x={-7} y={-380} width={14} height={380} fill={C.crema} stroke={C.negro} strokeWidth={2.5} />
    {Array.from({ length: 15 }, (_, i) => <rect key={i} x={-7} y={-370 + i * 24} width={14} height={10} fill={i % 2 ? C.negro : K.alaea} />)}
    <path d="M-44 -380 C -52 -460, -50 -560, -30 -600 C -10 -620, 10 -620, 30 -600 C 50 -560, 52 -460, 44 -380 Z" fill={color} stroke={C.negro} strokeWidth={3.5} />
    <path d="M-48 -430 C -16 -420, 16 -420, 48 -430 M-50 -520 C -16 -510, 16 -510, 50 -520" stroke={color2} strokeWidth={22} fill="none" />
    {Array.from({ length: 30 }, (_, i) => { const px = -34 + (i % 6) * 14 + (Math.floor(i / 6) % 2) * 7, py = -400 - Math.floor(i / 6) * 40; return <path key={i} d={`M${px - 5} ${py - 8} L ${px} ${py} L ${px + 5} ${py - 8}`} stroke={C.negro} strokeWidth={1.6} fill="none" opacity={0.45} />; })}
    <path d="M-36 -384 H 36" stroke={C.negro} strokeWidth={6} />
  </g>
);

/** Heiau: plataforma de piedra de lava escalonada, con kiʻi, torre anuʻu y altar lele. */
const Heiau: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => {
  const piedras = (x0: number, x1: number, y0: number, y1: number, seed: number) => {
    const out: React.ReactNode[] = [];
    const filas = Math.round((y0 - y1) / 30);
    for (let r = 0; r < filas; r++) {
      let px = x0 + (r % 2) * 18;
      for (let i = 0; px < x1 - 10; i++) {
        const w = 38 + azar(seed + r * 31 + i) * 26, py = y0 - (r + 1) * 30;
        const tono = ['#3A332E', '#463E37', '#2E2925', '#524840'][Math.floor(azar(seed + i * 7 + r) * 4)];
        out.push(<rect key={`${r}-${i}`} x={n1(px + 2)} y={n1(py + 2)} width={n1(Math.min(w, x1 - px) - 4)} height={26} rx={10} fill={tono} stroke={C.negro} strokeWidth={2} />);
        px += w;
      }
    }
    return out;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-380 0 L -366 -94 L 366 -94 L 380 0 Z" fill={K.piedra} stroke={C.negro} strokeWidth={3} />
      {piedras(-374, 374, 0, -90, 1)}
      <path d="M-290 -94 L -280 -184 L 280 -184 L 290 -94 Z" fill={K.piedra} stroke={C.negro} strokeWidth={3} />
      {piedras(-286, 286, -94, -184, 9)}
      {/* cerca de palos al fondo */}
      <path d={`M-270 -230 H 270 ${Array.from({ length: 28 }, (_, i) => `M${-266 + i * 19.7} -184 V -246`).join(' ')}`} stroke={K.tierraOsc} strokeWidth={5} />
      {/* torre anuʻu cubierta de kapa blanca */}
      <g transform="translate(-190 -184)">
        <path d="M-50 0 L -14 -300 L 14 -300 L 50 0 Z" fill={C.crema} stroke={C.negro} strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-46 + i * 9} ${-36 - i * 70} H ${46 - i * 9}`} stroke={C.negro} strokeWidth={3} />)}
        <BandaKapa x0={-40} x1={40} y={-70} alto={14} paso={14} tipo="tri" color={K.hollin} o={0.8} />
        <BandaKapa x0={-26} x1={26} y={-210} alto={12} paso={13} tipo="rombo" color={K.alaea} />
        <path d="M-14 -300 L 0 -340 L 14 -300" fill={C.crema} stroke={C.negro} strokeWidth={3} />
      </g>
      {/* lele: altar de ofrendas */}
      <g transform="translate(180 -184)">
        <path d="M-50 0 V -150 M50 0 V -150 M-30 0 V -150 M30 0 V -150" stroke={K.tierraOsc} strokeWidth={7} />
        <rect x={-62} y={-160} width={124} height={14} fill={K.madera} stroke={C.negro} strokeWidth={3} />
        <path d="M-44 -160 C -40 -190, -10 -196, 0 -186 C 14 -196, 40 -190, 44 -160 Z" fill="#C9A23A" stroke={C.negro} strokeWidth={2.5} />
        <path d="M-30 -186 q 0 -24 14 -30 M0 -190 q 0 -24 14 -30 M24 -186 q 0 -20 12 -26" stroke={K.verde} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
      {[-70, 0, 70].map((kx, i) => <Kii key={i} x={kx} y={-184} s={0.42 + (i === 1 ? 0.08 : 0)} />)}
      <Kahili x={-292} y={-94} s={0.4} f={f} />
      <Kahili x={292} y={-94} s={0.4} f={f + 30} color={K.alaea} color2={K.pluma} />
    </g>
  );
};

/** Ola de mar en fila: lomo suave, cresta que se enrula y espuma; se desplaza con el tiempo. */
const FilaOlas: React.FC<{ y: number; alto: number; ancho: number; f: number; vel?: number; color: string; linea?: string; fase?: number; x0?: number; x1?: number; espuma?: boolean }> = ({ y, alto, ancho, f, vel = 1, color, linea = K.turquesaClaro, fase = 0, x0 = -1800, x1 = 5400, espuma = true }) => {
  const off = (((f * vel + fase * ancho) % ancho) + ancho) % ancho;
  const yy = y + Math.sin(f / 24 + fase * 5) * alto * 0.1;
  let d = `M${x0 - ancho} ${yy + 900}L${x0 - ancho} ${yy}`, esp = '', lin = '', rizo = '';
  for (let a = x0 - ancho + off; a < x1 + ancho; a += ancho) {
    const c = a + ancho * 0.62, b = a + ancho;
    d += `L${n1(a)} ${n1(yy)}C${n1(a + ancho * 0.3)} ${n1(yy)} ${n1(c - ancho * 0.16)} ${n1(yy - alto)} ${n1(c)} ${n1(yy - alto)}C${n1(c + ancho * 0.12)} ${n1(yy - alto)} ${n1(c + ancho * 0.2)} ${n1(yy - alto * 0.62)} ${n1(c + ancho * 0.12)} ${n1(yy - alto * 0.46)}C${n1(c + ancho * 0.2)} ${n1(yy - alto * 0.2)} ${n1(b - ancho * 0.08)} ${n1(yy)} ${n1(b)} ${n1(yy)}`;
    esp += `M${n1(c - ancho * 0.18)} ${n1(yy - alto * 0.8)}C${n1(c - ancho * 0.08)} ${n1(yy - alto * 1.02)} ${n1(c + ancho * 0.1)} ${n1(yy - alto * 1.02)} ${n1(c + ancho * 0.15)} ${n1(yy - alto * 0.66)}`;
    rizo += `M${n1(c + ancho * 0.1)} ${n1(yy - alto * 0.5)}c${n1(-ancho * 0.05)} ${n1(-alto * 0.05)} ${n1(-ancho * 0.07)} ${n1(-alto * 0.3)} ${n1(-ancho * 0.02)} ${n1(-alto * 0.34)}`;
    lin += `M${n1(a + ancho * 0.1)} ${n1(yy + alto * 0.3)}C${n1(a + ancho * 0.35)} ${n1(yy + alto * 0.3)} ${n1(c - ancho * 0.1)} ${n1(yy - alto * 0.45)} ${n1(c + ancho * 0.05)} ${n1(yy - alto * 0.4)}`;
  }
  d += `L${x1 + ancho} ${yy + 900}Z`;
  return (
    <g>
      <path d={d} fill={color} stroke={C.negro} strokeWidth={Math.min(4, 1.5 + alto * 0.03)} strokeLinejoin="round" />
      <path d={lin} stroke={linea} strokeWidth={Math.max(1.5, alto * 0.05)} fill="none" opacity={0.55} strokeLinecap="round" />
      {espuma && <path d={esp} stroke={C.crema} strokeWidth={Math.max(2, alto * 0.11)} fill="none" strokeLinecap="round" />}
      {espuma && <path d={rizo} stroke={C.crema} strokeWidth={Math.max(1.5, alto * 0.06)} fill="none" strokeLinecap="round" opacity={0.85} />}
    </g>
  );
};

/** Mar abierto hasta el horizonte: varias filas de olas que crecen hacia adelante. */
const MarAbierto: React.FC<{ f: number; horizonte?: number; noche?: boolean; hasta?: number }> = ({ f, horizonte = 470, noche, hasta = 6 }) => {
  const filas: [number, number, number, number, string][] = noche
    ? [[0.15, 0, 14, 110, '#1B3F5C'], [0.25, 50, 22, 170, '#173752'], [0.4, 110, 32, 250, '#132F48'], [0.6, 190, 48, 340, '#10283F'], [0.8, 280, 66, 440, '#0D2236'], [1, 380, 90, 560, '#0A1C2D']]
    : [[0.15, 0, 14, 110, '#7CC4BC'], [0.25, 50, 22, 170, '#4FA9A8'], [0.4, 110, 32, 250, K.turquesa], [0.6, 190, 48, 340, '#237A88'], [0.8, 280, 66, 440, K.azul], [1, 380, 90, 560, '#17456A']];
  return (
    <>
      <Capa p={0.1}><rect x={-2000} y={horizonte} width={8000} height={900} fill={noche ? '#1E4563' : '#8FD0C6'} /><path d={`M-2000 ${horizonte}H6000`} stroke={C.negro} strokeWidth={3} /></Capa>
      {filas.slice(0, hasta).map(([p, dy, alto, ancho, color], i) => <Capa key={i} p={p}><FilaOlas y={horizonte + 14 + dy} alto={alto} ancho={ancho} f={f} vel={0.4 + i * 0.35} color={color} linea={noche ? '#3E6E8E' : K.turquesaClaro} fase={i * 0.37} espuma={!noche || i > 2} /></Capa>)}
    </>
  );
};

/** Humareda volcánica: bocanadas que suben, crecen y se apagan. */
const Humareda: React.FC<{ x: number; y: number; f: number; ancho?: number; alto?: number; color?: string; n?: number }> = ({ x, y, f, ancho = 260, alto = 560, color = '#5E504A', n = 16 }) => {
  const bocanadas = Array.from({ length: n }, (_, i) => { const t = (((f * 0.7 + (i * alto) / n) % alto) + alto) % alto / alto; return { i, t }; }).sort((a, b) => b.t - a.t);
  return (
    <g>
      {bocanadas.map(({ i, t }) => <circle key={i} cx={n1(x + Math.sin(t * 4 + i) * ancho * 0.12 * t + t * ancho * 0.45)} cy={n1(y - t * alto)} r={n1(ancho * 0.22 * (0.45 + t * 0.9))} fill={i % 3 ? color : '#7A6A60'} stroke={C.negro} strokeWidth={2} opacity={Math.min(1, t * 8) * (0.85 - t * 0.55)} />)}
    </g>
  );
};

/** Cascada animada con espuma al pie. */
const Cascada: React.FC<{ x: number; y0: number; y1: number; ancho?: number; f: number }> = ({ x, y0, y1, ancho = 46, f }) => (
  <g>
    <path d={`M${x - ancho / 2} ${y0} L${x + ancho / 2} ${y0} L${x + ancho * 0.75} ${y1} L${x - ancho * 0.75} ${y1} Z`} fill="#D7EEEE" stroke={C.negro} strokeWidth={2.5} />
    {[-0.32, -0.1, 0.12, 0.34].map((k, i) => <path key={i} d={`M${x + k * ancho} ${y0} L${x + k * ancho * 1.5} ${y1}`} stroke="#6FAFC0" strokeWidth={3.5} strokeDasharray="34 22" strokeDashoffset={n1(-f * 9 - i * 19)} />)}
    {[0, 1, 2, 3, 4].map((i) => { const t = ((f / 30 + i / 5) % 1); return <ellipse key={i} cx={x + (i - 2) * ancho * 0.5} cy={y1 - 4 - t * 24} rx={ancho * (0.35 + t * 0.3)} ry={10 + t * 8} fill={C.crema} opacity={0.75 * (1 - t)} />; })}
    <ellipse cx={x} cy={y1} rx={ancho * 1.6} ry={12} fill={C.crema} stroke={C.negro} strokeWidth={2} />
  </g>
);

/** Cono de ceniza (Haleakalā): joroba con cráter arriba y surcos de erosión. */
const Cono: React.FC<{ x: number; base: number; ancho: number; alto: number; color: string; nieve?: boolean }> = ({ x, base, ancho, alto, color, nieve }) => {
  const c = base - alto, w = ancho / 2;
  return (
    <g>
      <path d={`M${x - w} ${base} C ${x - w * 0.6} ${base - alto * 0.3}, ${x - w * 0.45} ${c}, ${x - w * 0.25} ${c} Q ${x} ${c + alto * 0.08} ${x + w * 0.25} ${c} C ${x + w * 0.45} ${c}, ${x + w * 0.6} ${base - alto * 0.3}, ${x + w} ${base} Z`} fill={color} stroke={C.negro} strokeWidth={3} />
      {[-0.6, -0.35, -0.12, 0.12, 0.35, 0.6].map((k, i) => <path key={i} d={`M${n1(x + k * w * 0.45)} ${n1(c + 8)} Q ${n1(x + k * w * 0.8)} ${n1(base - alto * 0.4)} ${n1(x + k * w * 1.05)} ${base}`} stroke={C.negro} strokeWidth={2} fill="none" opacity={0.25} />)}
      {nieve && <path d={`M${x - w * 0.36} ${c + 10} Q ${x - w * 0.3} ${c} ${x - w * 0.25} ${c} Q ${x} ${c + alto * 0.08} ${x + w * 0.25} ${c} Q ${x + w * 0.32} ${c} ${x + w * 0.4} ${c + 14} L ${x + w * 0.3} ${c + alto * 0.28} L ${x + w * 0.18} ${c + alto * 0.16} L ${x + w * 0.05} ${c + alto * 0.3} L ${x - w * 0.1} ${c + alto * 0.14} L ${x - w * 0.24} ${c + alto * 0.26} Z`} fill="#FFFFFF" stroke={C.negro} strokeWidth={2} />}
    </g>
  );
};

/** ʻĀhinahina (planta plateada de Haleakalā). */
const Ahinahina: React.FC<{ x: number; y?: number; s?: number; f: number; flor?: boolean }> = ({ x, y = SUELO, s = 1, f, flor }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {flor && <g><path d="M0 -40 C -4 -120, 4 -200, 0 -260" stroke="#5E6A3A" strokeWidth={10} />{Array.from({ length: 18 }, (_, i) => <circle key={i} cx={(i % 2 ? 1 : -1) * (12 - i * 0.4)} cy={-70 - i * 10} r={9 - i * 0.25} fill={i % 3 ? '#7A2A4A' : '#9A3A5A'} stroke={C.negro} strokeWidth={1.5} />)}</g>}
    {Array.from({ length: 26 }, (_, i) => { const a = -Math.PI * (0.05 + 0.9 * (i / 25)) + Math.sin(f / 40 + i) * 0.02; return <path key={i} d={`M0 -6 Q ${n1(Math.cos(a) * 30)} ${n1(Math.sin(a) * 30 - 10)} ${n1(Math.cos(a) * 54)} ${n1(Math.sin(a) * 50 - 6)}`} stroke={C.negro} strokeWidth={8} fill="none" strokeLinecap="round" />; })}
    {Array.from({ length: 26 }, (_, i) => { const a = -Math.PI * (0.05 + 0.9 * (i / 25)) + Math.sin(f / 40 + i) * 0.02; return <path key={i} d={`M0 -6 Q ${n1(Math.cos(a) * 30)} ${n1(Math.sin(a) * 30 - 10)} ${n1(Math.cos(a) * 54)} ${n1(Math.sin(a) * 50 - 6)}`} stroke={i % 2 ? '#D9E0E2' : '#B4C0C4'} strokeWidth={5} fill="none" strokeLinecap="round" />; })}
  </g>
);

/** Mar de nubes visto desde la cumbre. */
const MarNubes: React.FC<{ y: number; f: number; color?: string; paso?: number; vel?: number; seed?: number }> = ({ y, f, color = '#F5EFE3', paso = 170, vel = 0.25, seed = 0 }) => {
  const off = (f * vel) % paso;
  return (
    <g>
      {(paso > 120 ? [true, false] : [false]).map((borde) => <g key={String(borde)}>{Array.from({ length: Math.ceil(7600 / paso) }, (_, i) => { const r = paso * (0.45 + azar(i + seed) * 0.3); return <circle key={i} cx={n1(-2000 + i * paso + off)} cy={n1(y + paso * 0.2 - r * (0.45 + azar(i + seed + 9) * 0.25))} r={n1(r)} fill={color} stroke={borde ? C.negro : 'none'} strokeWidth={6} />; })}</g>)}
      {paso > 120 && Array.from({ length: Math.ceil(7600 / paso) }, (_, i) => { const r = paso * (0.45 + azar(i + seed) * 0.3), cx = -2000 + i * paso + off, cy = y + paso * 0.2 - r * (0.45 + azar(i + seed + 9) * 0.25); return <path key={i} d={`M${n1(cx - r * 0.5)} ${n1(cy - r * 0.35)} q ${n1(r * 0.3)} ${n1(-r * 0.3)} ${n1(r * 0.6)} ${n1(-r * 0.2)}`} stroke={C.negro} strokeWidth={2} fill="none" opacity={0.25} />; })}
      <rect x={-2200} y={y + paso * 0.2} width={8000} height={900} fill={color} />
      {Array.from({ length: Math.ceil(7600 / (paso * 1.4)) }, (_, i) => <path key={i} d={`M${n1(-2000 + i * paso * 1.4 + off * 1.3)} ${n1(y + paso * 0.5 + azar(i + 3) * 80)} q 40 -16 80 0`} stroke={C.negro} strokeWidth={2} fill="none" opacity={0.2} />)}
    </g>
  );
};

/** Coral ramificado con pólipos en las puntas que se abren y cierran. */
const CoralRama: React.FC<{ x: number; y?: number; s?: number; f: number; color?: string; seed?: number }> = ({ x, y = SUELO, s = 1, f, color = '#E0703A', seed = 1 }) => {
  const segs: { d: string; w: number }[] = [], puntas: [number, number][] = [];
  const rama = (px: number, py: number, ang: number, len: number, prof: number, k: number) => {
    const sw = Math.sin(f / 30 + k + seed) * 0.04 * (4 - prof);
    const ex = px + Math.cos(ang + sw) * len, ey = py + Math.sin(ang + sw) * len;
    segs.push({ d: `M${n1(px)} ${n1(py)}Q${n1((px + ex) / 2 + (azar(k + seed) - 0.5) * len * 0.3)} ${n1((py + ey) / 2)} ${n1(ex)} ${n1(ey)}`, w: 6 + prof * 5 });
    if (prof === 0) { puntas.push([ex, ey]); return; }
    rama(ex, ey, ang - 0.45 - azar(k * 3 + seed) * 0.3, len * 0.75, prof - 1, k * 2 + 1);
    rama(ex, ey, ang + 0.4 + azar(k * 5 + seed) * 0.3, len * 0.72, prof - 1, k * 2 + 2);
  };
  rama(0, 0, -Math.PI / 2, 80, 3, 1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {segs.map((g, i) => <path key={`o${i}`} d={g.d} stroke={C.negro} strokeWidth={g.w + 5} fill="none" strokeLinecap="round" />)}
      {segs.map((g, i) => <path key={i} d={g.d} stroke={color} strokeWidth={g.w} fill="none" strokeLinecap="round" />)}
      {puntas.map(([px, py], i) => { const a = 0.6 + 0.4 * Math.sin(f / 10 + i); return <g key={`p${i}`}>{[-1, 0, 1].map((k) => <path key={k} d={`M${n1(px)} ${n1(py)}l${n1(k * 8 * a)} ${n1(-12 * a)}`} stroke={C.crema} strokeWidth={2.5} strokeLinecap="round" />)}</g>; })}
    </g>
  );
};
/** Coral cerebro: cúpula con surcos que serpentean. */
const CoralCerebro: React.FC<{ x: number; y?: number; s?: number; color?: string }> = ({ x, y = SUELO, s = 1, color = '#C9A050' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-110 0 C -110 -90, 110 -90, 110 0 Z" fill={color} stroke={C.negro} strokeWidth={3} />
    {[0, 1, 2, 3].map((r) => <path key={r} d={`M${-96 + r * 14} ${-8 - r * 16} ` + Array.from({ length: 8 - r }, (_, i) => `q 11 ${i % 2 ? 12 : -12} ${n1((192 - r * 28) / (16 - r * 2))} 0`).join(' ')} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.55} />)}
  </g>
);
/** Abanico de mar que se mece. */
const Abanico: React.FC<{ x: number; y?: number; s?: number; f: number; color?: string }> = ({ x, y = SUELO, s = 1, f, color = '#8A3A6A' }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${n1(Math.sin(f / 28 + x) * 4)})`}>
    <path d="M0 0 L -120 -150 C -80 -230, 80 -230, 120 -150 Z" fill={color} opacity={0.85} stroke={C.negro} strokeWidth={3} strokeLinejoin="round" />
    {Array.from({ length: 9 }, (_, i) => { const a = -Math.PI / 2 + (i - 4) * 0.18; return <path key={i} d={`M0 0 L ${n1(Math.cos(a) * 200)} ${n1(Math.sin(a) * 200)}`} stroke={C.negro} strokeWidth={2} opacity={0.6} />; })}
    {[70, 120, 165].map((r) => <path key={r} d={`M${n1(-r * 0.68)} ${n1(-r * 0.73)} Q 0 ${-r * 1.15} ${n1(r * 0.68)} ${n1(-r * 0.73)}`} stroke={C.negro} strokeWidth={1.5} fill="none" opacity={0.5} />)}
  </g>
);
/** Pólipos: tubitos con coronas de tentáculos que se abren y respiran. */
const Polipos: React.FC<{ x: number; y?: number; s?: number; f: number; color?: string; n?: number; seed?: number }> = ({ x, y = SUELO, s = 1, f, color = '#E8A0B0', n = 7, seed = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: n }, (_, i) => {
      const px = (i - (n - 1) / 2) * 22 + (azar(i + seed) - 0.5) * 10, h = 26 + azar(i + seed + 5) * 34, a = 0.55 + 0.45 * Math.sin(f / 14 + i * 1.3 + seed);
      return (
        <g key={i}>
          <path d={`M${n1(px - 7)} 0 L ${n1(px - 6)} ${n1(-h)} L ${n1(px + 6)} ${n1(-h)} L ${n1(px + 7)} 0 Z`} fill={color} stroke={C.negro} strokeWidth={2} />
          {Array.from({ length: 7 }, (_, k) => { const ang = -Math.PI / 2 + (k - 3) * 0.42 * a; const l = 10 + 10 * a; return <path key={k} d={`M${n1(px)} ${n1(-h)}q${n1(Math.cos(ang) * l * 0.5 + Math.sin(f / 9 + k) * 2)} ${n1(Math.sin(ang) * l * 0.6)} ${n1(Math.cos(ang) * l)} ${n1(Math.sin(ang) * l)}`} stroke={K.crema} strokeWidth={2.5} fill="none" strokeLinecap="round" />; })}
          <circle cx={px} cy={-h} r={4} fill={K.alaea} />
        </g>
      );
    })}
  </g>
);
/** Alga larga que ondula. */
const Alga: React.FC<{ x: number; y?: number; alto?: number; f: number; color?: string }> = ({ x, y = SUELO, alto = 300, f, color = '#5A7A2E' }) => {
  const pts = Array.from({ length: 13 }, (_, i) => { const t = i / 12; return [x + Math.sin(t * 3 + f / 22 + x) * 16 * t, y - alto * t] as P; });
  return (
    <g>
      <path d={suave(pts)} stroke={C.negro} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d={suave(pts)} stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" />
      {pts.slice(2, 12).map(([px, py], i) => <ellipse key={i} cx={px + (i % 2 ? 14 : -14)} cy={py} rx={16} ry={6} fill={color} stroke={C.negro} strokeWidth={2} transform={`rotate(${i % 2 ? -30 : 30} ${px + (i % 2 ? 14 : -14)} ${py})`} />)}
    </g>
  );
};
/** Pececito plano que cruza. */
const Pececito: React.FC<{ x: number; y: number; s?: number; color: string; izq?: boolean }> = ({ x, y, s = 1, color, izq }) => (
  <g transform={`translate(${n1(x)} ${n1(y)}) scale(${izq ? -s : s} ${s})`}>
    <path d="M-30 0 C -16 -18, 18 -18, 30 0 C 18 18, -16 18, -30 0 Z M-28 0 L -48 -14 L -44 0 L -48 14 Z" fill={color} stroke={C.negro} strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M-6 -12 V 12 M6 -13 V 13" stroke={C.negro} strokeWidth={2} opacity={0.5} /><circle cx={18} cy={-3} r={3} fill={C.negro} />
  </g>
);

/** Fondos del tema hawaiano (null = usar el genérico). */
function fondoHawaiano(tipo: string, f: number, astros = true): React.ReactNode {
  const niu = (xs: number[], s: number, extra = 0, y = SUELO) => xs.map((x, i) => <Niu key={i} x={x} y={y} s={s * (0.85 + azar(i + extra) * 0.3)} f={f + i * 13} inclina={(i % 2 ? -1 : 1) * (0.12 + azar(i + 3 + extra) * 0.15)} />);
  switch (tipo) {
    case 'po': case 'caos': case 'inframundo': {
      const motivos: MotivoKapa[] = ['tri', 'zig', 'rombo', 'lineas', 'dientes', 'puntos', 'zig', 'tri'];
      return (<>
        <Capa p={0}><rect x={-2000} y={-500} width={8000} height={2000} fill="#120C08" /></Capa>
        <Capa p={0.15}>
          {motivos.map((m, r) => <BandaKapa key={r} x0={-1200} x1={4400} y={170 + r * 78} alto={30} paso={m === 'lineas' ? 30 : 40 + (r % 3) * 12} tipo={m} color="#5A3A24" w={4} o={0.24 + 0.14 * Math.sin(f / 50 + r * 0.8)} />)}
          {Array.from({ length: 7 }, (_, r) => <path key={`l${r}`} d={`M-1200 ${205 + r * 78}H4400`} stroke="#3A2618" strokeWidth={2} opacity={0.15} />)}
        </Capa>
        <Capa p={0.4}>{Array.from({ length: 56 }, (_, i) => { const t = ((f * 0.3 + i * 37) % 600) / 600; return <circle key={i} cx={-300 + azar(i) * 3800 + Math.sin(f / 40 + i) * 12} cy={760 - t * 600} r={1.5 + azar(i + 2) * 2.5} fill="#C98A4A" opacity={0.35 * Math.sin(Math.PI * t)} />; })}</Capa>
        <SueloK tipo="oscuro" />
      </>);
    }
    case 'fondo_marino': return (<>
      <defs><linearGradient id="kapa-marino" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5FB8B4" /><stop offset="0.5" stopColor="#25808E" /><stop offset="1" stopColor="#0F3F5A" /></linearGradient></defs>
      <Capa p={0}><rect x={-2000} y={-500} width={8000} height={2000} fill="url(#kapa-marino)" />
        {Array.from({ length: 7 }, (_, i) => { const x = 100 + i * 300 + Math.sin(f / 50 + i) * 30; return <path key={i} d={`M${x} 100 L ${x + 70} 100 L ${x + 260} ${SUELO} L ${x + 80} ${SUELO} Z`} fill="#FFFFFF" opacity={0.05 + 0.03 * Math.sin(f / 30 + i)} />; })}
        <path d={Array.from({ length: 40 }, (_, i) => `M${i * 60 - ((f * 0.8) % 60)} 140 q 15 -8 30 0 q 15 8 30 0`).join(' ')} stroke="#BDE8E0" strokeWidth={3} fill="none" opacity={0.4} />
      </Capa>
      <Capa p={0.3}>
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={copa(-500 + i * 420, SUELO - 40, 220 + azar(i) * 80, 110 + azar(i + 3) * 70, i * 5)} fill="#1C6470" stroke="#164F5A" strokeWidth={3} />)}
        {Array.from({ length: 6 }, (_, i) => <Alga key={i} x={-300 + i * 520 + azar(i) * 100} alto={260 + azar(i + 1) * 120} f={f} color="#2E6A5A" />)}
      </Capa>
      <Capa p={0.55}>
        {Array.from({ length: 6 }, (_, i) => { const v = 1 + azar(i) * 1.2, dir = i % 2 ? -1 : 1, rango = 3200, px = (((i * 600 + f * v * dir) % rango) + rango) % rango - 600; return <Pececito key={i} x={px} y={300 + azar(i + 7) * 300 + Math.sin(f / 15 + i) * 8} s={0.7 + azar(i + 1) * 0.4} color={[K.pluma, K.alaea, '#F28A3A', K.turquesaClaro][i % 4]} izq={dir < 0} />; })}
      </Capa>
      <Capa p={0.7}>
        <CoralCerebro x={-120} y={SUELO - 10} s={1.1} />
        <CoralRama x={260} y={SUELO - 6} s={1.2} f={f} seed={2} />
        <Abanico x={620} y={SUELO - 6} s={1.1} f={f} />
        <Alga x={900} alto={360} f={f} />
        <CoralRama x={1200} y={SUELO - 6} s={1} f={f} color="#D9485A" seed={5} />
        <CoralCerebro x={1520} y={SUELO - 6} s={0.8} color="#B8884A" />
        <Abanico x={1820} y={SUELO - 6} s={0.9} f={f} color="#C0603A" />
        <CoralRama x={2150} y={SUELO - 6} s={1.3} f={f} color="#E8A040" seed={8} />
        <Alga x={2450} alto={320} f={f} />
        <CoralRama x={2750} y={SUELO - 6} s={1} f={f} seed={11} />
        <CoralCerebro x={3080} y={SUELO - 6} s={1} />
        <Abanico x={3400} y={SUELO - 6} s={1} f={f} color="#8A3A6A" />
        <CoralRama x={3750} y={SUELO - 6} s={1.2} f={f} color="#D9485A" seed={14} />
      </Capa>
      <SueloK tipo="marino" />
      <Capa p={1}>
        {[-200, 420, 1000, 1640, 2300, 2900, 3500, 4100].map((px, i) => <Polipos key={i} x={px} s={(1 + azar(i) * 0.4) * (0.4 + 0.6 * Math.min(1, f / 240))} f={f} seed={i * 3} color={['#E8A0B0', '#F2C27A', '#B0E0C8'][i % 3]} />)}
        {[60, 760, 1400, 2080, 2700, 3300, 3900].map((px, i) => <path key={i} d={`M${px} ${SUELO} c 6 -14, 22 -14, 28 0 Z M${px + 40} ${SUELO} c 3 -8, 12 -8, 15 0 Z`} fill="#E8D0B0" stroke={C.negro} strokeWidth={2} />)}
      </Capa>
      <Capa p={0.8}>{Array.from({ length: 44 }, (_, i) => { const t = ((f * (0.9 + azar(i) * 0.6) + i * 41) % 700) / 700; return <circle key={i} cx={-200 + azar(i + 3) * 4200 + Math.sin(f / 12 + i) * 6} cy={SUELO - 20 - t * 680} r={3 + azar(i + 5) * 6} fill="none" stroke="#DFF5F0" strokeWidth={2} opacity={0.8 * (1 - t)} />; })}</Capa>
    </>);
    case 'oceano': case 'oceano_abierto': case 'mar': return (<>
      <Capa p={0.05}>{astros && <Sol x={1500} y={300} r={46} f={f} />}</Capa>
      {astros && <Capa p={0.1}>{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${1500 - 60 + i * 20 - (i % 2) * 30} ${490 + i * 14} h ${40 + (i % 3) * 20}`} stroke={K.pluma} strokeWidth={4} opacity={0.5 + 0.4 * Math.sin(f / 8 + i)} strokeLinecap="round" />)}</Capa>}
      <MarAbierto f={f} horizonte={470} />
    </>);
    case 'costa': case 'playa': case 'playa_negra': {
      const negra = tipo === 'playa_negra';
      const ola = Math.sin(f / 32);
      return (<>
        <Capa p={0.05}>{astros && <Sol x={1550} y={270} r={44} f={f} />}</Capa>
        <Capa p={0.12}><Pali x={150} ancho={1100} alto={300} base={530} color="#4F7468" claro="#7FA090" o={0.9} seed={4} estrias={22} /></Capa>
        <Capa p={0.15}><rect x={-2000} y={520} width={8000} height={600} fill="#8FD0C6" /><path d="M-2000 520H6000" stroke={C.negro} strokeWidth={3} /></Capa>
        <Capa p={0.25}><FilaOlas y={548} alto={16} ancho={150} f={f} vel={0.5} color="#5FB0AC" /></Capa>
        <Capa p={0.4}><FilaOlas y={590} alto={26} ancho={230} f={f} vel={0.8} color={K.turquesa} fase={0.4} /></Capa>
        <Capa p={0.6}>
          <FilaOlas y={650} alto={40} ancho={330} f={f} vel={1.1} color="#237A88" fase={0.7} />
          <path d={`M-1600 ${700 + ola * 10} ` + Array.from({ length: 80 }, (_, i) => `q 50 ${i % 2 ? 10 : -10} 100 0`).join(' ') + ` V 1200 H -1600 Z`} fill={negra ? '#3A322C' : '#C9AE78'} />
          <path d={`M-1600 ${690 + ola * 14} ` + Array.from({ length: 80 }, (_, i) => `q 50 ${i % 2 ? 12 : -12} 100 0`).join(' ')} stroke={C.crema} strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d={`M-1600 ${704 + ola * 14} ` + Array.from({ length: 80 }, (_, i) => `q 50 ${i % 2 ? -8 : 8} 100 0`).join(' ')} stroke={C.crema} strokeWidth={3} fill="none" opacity={0.7} strokeDasharray="20 14" />
        </Capa>
        <Capa p={0.8}>
          <path d={`M-1600 730 ` + Array.from({ length: 70 }, (_, i) => `q 60 ${i % 2 ? 8 : -8} 120 0`).join(' ') + ` V 1200 H -1600 Z`} fill={negra ? K.arenaNegra : K.arena} stroke={C.negro} strokeWidth={3} />
          {Array.from({ length: 90 }, (_, i) => <circle key={i} cx={-1200 + azar(i) * 7000} cy={745 + azar(i + 4) * 40} r={2} fill={negra ? '#5A4E46' : K.arenaOsc} />)}
          <Waa x={1260} y={756} s={0.62} f={f} quieta />
          {niu([-260, 330, 1880, 2500, 3300, 3900, 4700], 0.82)}
        </Capa>
        <SueloK tipo={negra ? 'arena_negra' : 'arena'} />
      </>);
    }
    case 'aldea': case 'aldea_hale': return (<>
      <Capa p={0.05}>{astros && <Sol x={1580} y={250} r={40} f={f} />}</Capa>
      <Capa p={0.12}><Pali x={900} ancho={2600} alto={460} base={640} color="#4E7A5A" claro="#86A878" seed={2} o={0.9} estrias={50} /><Pali x={3300} ancho={2400} alto={400} base={640} color="#4E7A5A" claro="#86A878" seed={12} o={0.9} estrias={46} /></Capa>
      <Capa p={0.3}><Pali x={-200} ancho={1400} alto={300} base={700} color={K.verde} seed={7} estrias={26} /><Pali x={2300} ancho={1500} alto={260} base={700} color={K.verde} seed={9} estrias={26} /><Pali x={4200} ancho={1600} alto={300} base={700} color={K.verde} seed={13} estrias={28} /></Capa>
      <Capa p={0.55}>
        <rect x={-1600} y={700} width={7000} height={400} fill="#5E7E3A" />
        <Hale x={-120} y={760} s={0.55} /><Hale x={1660} y={750} s={0.5} espejo /><Hale x={2400} y={760} s={0.6} /><Hale x={3250} y={755} s={0.5} espejo /><Hale x={3950} y={760} s={0.58} />
        {niu([200, 1350, 2050, 2900, 3600, 4400], 0.6, 5)}
      </Capa>
      <Capa p={0.8}>
        <Hale x={760} y={SUELO} s={0.85} />
        {/* kapa tendido entre dos postes */}
        <g>
          <path d="M1180 790 V 520 M1560 790 V 520" stroke={K.tierraOsc} strokeWidth={10} />
          <path d="M1180 530 Q 1370 556 1560 530" stroke={C.negro} strokeWidth={3} fill="none" />
          {[0, 1, 2].map((i) => { const x = 1205 + i * 118, k = Math.sin(f / 20 + i) * 4; return <g key={i} transform={`translate(${x} ${540 + (i === 1 ? 6 : 2)}) skewX(${n1(k)})`}>
            <rect x={0} y={0} width={100} height={150} fill={[C.crema, '#D9B98A', C.crema][i]} stroke={C.negro} strokeWidth={3} />
            <BandaKapa x0={4} x1={96} y={10} alto={16} paso={16} tipo={(['tri', 'rombo', 'zig'] as MotivoKapa[])[i]} color={i === 1 ? K.hollin : K.alaea} w={3} />
            <BandaKapa x0={4} x1={96} y={50} alto={12} tipo="lineas" color={K.tierra} w={2} />
            <BandaKapa x0={4} x1={96} y={80} alto={20} paso={20} tipo={(['dientes', 'tri', 'rombo'] as MotivoKapa[])[i]} color={K.tierra} />
            <BandaKapa x0={4} x1={96} y={118} alto={14} paso={14} tipo="puntos" color={K.hollin} />
          </g>; })}
        </g>
        <Ipu x={1720} y={SUELO} s={0.45} />
        <Kalo x={430} s={0.55} f={f} /><Kalo x={2100} s={0.6} f={f + 20} />
        <Hale x={2700} y={SUELO} s={0.8} espejo /><Kalo x={3250} s={0.55} f={f + 40} /><Hale x={3900} y={SUELO} s={0.85} /><Kalo x={4500} s={0.6} f={f + 60} />
      </Capa>
      <SueloK tipo="hierba" />
    </>);
    case 'loi': case 'lōʻi': {
      const terraza = (y: number, alto: number, k: number) => (<g>
        <rect x={-1600} y={y} width={7000} height={alto} fill="#6FA8A8" />
        {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${-1400 + i * 220 + ((f * 0.6 + k * 50) % 220)} ${y + alto * (0.3 + (i % 3) * 0.2)} h ${30 + (i % 4) * 14}`} stroke="#E6F6F0" strokeWidth={3} strokeLinecap="round" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 10 + i))} />)}
        <path d={`M-1600 ${y + alto}H5400 V ${y + alto + 18} H -1600 Z`} fill={K.tierra} stroke={C.negro} strokeWidth={3} />
        <path d={`M-1600 ${y}H5400`} stroke={C.negro} strokeWidth={3} />
      </g>);
      return (<>
        <Capa p={0.05}>{astros && <Sol x={1500} y={250} r={40} f={f} />}</Capa>
        <Capa p={0.12}><Pali x={900} ancho={2800} alto={470} base={600} color="#4E7A5A" claro="#86A878" seed={5} o={0.95} estrias={52} /><Cascada x={1100} y0={240} y1={600} ancho={24} f={f} /></Capa>
        <Capa p={0.3}><rect x={-1600} y={596} width={7000} height={500} fill="#5E7E3A" /><Hale x={1500} y={600} s={0.3} />{niu([1320, 1760], 0.38, 3, 600)}{terraza(600, 40, 0)}{Array.from({ length: 28 }, (_, i) => <Kalo key={i} x={-600 + i * 170} y={632} s={0.22} f={f + i * 5} />)}</Capa>
        <Capa p={0.55}>{terraza(668, 52, 1)}{Array.from({ length: 22 }, (_, i) => <Kalo key={i} x={-700 + i * 230} y={712} s={0.34} f={f + i * 9} />)}</Capa>
        <Capa p={0.8}>{terraza(735, 50, 2)}{Array.from({ length: 17 }, (_, i) => <Kalo key={i} x={-800 + i * 330 + azar(i) * 60} y={778} s={0.5} f={f + i * 7} />)}</Capa>
        <SueloK tipo="hierba" />
        <Capa p={1}><Kalo x={-40} s={0.8} f={f} /><Kalo x={1980} s={0.75} f={f + 33} /></Capa>
        <Capa p={0.9}>{niu([20, 1960], 0.8, 6)}</Capa>
      </>);
    }
    case 'valle': case 'valle_cascada': case 'campo': {
      const cascada = tipo !== 'campo';
      return (<>
        <Capa p={0.05}>{astros && <Sol x={1500} y={240} r={40} f={f} />}</Capa>
        <Capa p={0.1}><Pali x={960} ancho={1500} alto={500} base={660} color="#5A8668" claro="#8EB088" seed={3} estrias={34} />{cascada && <Cascada x={1000} y0={210} y1={640} ancho={40} f={f} />}</Capa>
        <Capa p={0.3}><Pali x={-150} ancho={1300} alto={620} base={720} color={K.verde} seed={8} estrias={32} /><Pali x={2150} ancho={1300} alto={600} base={720} color={K.verde} seed={11} estrias={32} /><Pali x={3350} ancho={1300} alto={560} base={720} color={K.verde} seed={15} estrias={30} /></Capa>
        <Capa p={0.5}>
          <rect x={-1600} y={690} width={7000} height={400} fill="#5E7E3A" />
          {cascada && <path d={`M960 650 C 900 680, 1100 700, 980 730 C 860 760, 1200 780, 1100 ${SUELO + 50} L 1240 ${SUELO + 50} C 1300 780, 1000 760, 1080 730 C 1180 700, 1000 680, 1040 650 Z`} fill="#6FB0B8" stroke={C.negro} strokeWidth={2.5} />}
          {[-300, 300, 1500, 2200, 3000, 3600].map((x, i) => <Lehua key={i} x={x} y={720} s={0.4} f={f} seed={i * 11} />)}
        </Capa>
        <Capa p={0.8}>{Array.from({ length: 12 }, (_, i) => <Kalo key={i} x={-500 + i * 420} s={0.45} f={f + i * 8} />)}{niu([60, 2020, 3400], 0.75, 2)}</Capa>
        <SueloK tipo="hierba" />
      </>);
    }
    case 'bosque': case 'bosque_lehua': return (<>
      <Capa p={0.08}>{Array.from({ length: 16 }, (_, i) => <path key={i} d={copa(-600 + i * 220, 470 + azar(i) * 50, 150, 90, i * 3)} fill="#7E9484" stroke="#6A8070" strokeWidth={3} />)}<rect x={-2000} y={480} width={8000} height={600} fill="#7E9484" /></Capa>
      <Capa p={0.15}>{Array.from({ length: 9 }, (_, i) => <Lehua key={i} x={-500 + i * 380} y={700} s={0.7} f={f} hojas="#5E7A64" tronco="#4A4A40" flores={false} seed={i * 3} />)}
        {Array.from({ length: 4 }, (_, i) => <ellipse key={i} cx={((i * 700 + f * 0.6) % 3400) - 600} cy={560 + (i % 2) * 70} rx={420} ry={34} fill={C.crema} opacity={0.35} />)}</Capa>
      <Capa p={0.4}>{Array.from({ length: 9 }, (_, i) => <Lehua key={i} x={-400 + i * 470 + azar(i) * 80} y={760} s={0.85} f={f + i * 9} hojas="#3A6038" seed={i * 7 + 2} />)}</Capa>
      <Capa p={0.6}><rect x={-1600} y={770} width={7000} height={300} fill={K.verdeOsc} />{Array.from({ length: 8 }, (_, i) => <Hapuu key={i} x={-300 + i * 560 + azar(i + 2) * 120} y={785} s={0.7} f={f + i * 6} />)}</Capa>
      <Capa p={0.85}><Lehua x={-80} s={1.2} f={f} seed={41} /><Lehua x={2000} s={1.15} f={f + 15} seed={53} /><Lehua x={3700} s={1.2} f={f + 30} seed={61} />{Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={((i * 900 + f * 1.1) % 4000) - 800} cy={720 + (i % 2) * 40} rx={380} ry={26} fill={C.crema} opacity={0.22} />)}</Capa>
      <SueloK tipo="hierba" />
      <Capa p={1}>{Array.from({ length: 44 }, (_, i) => <circle key={i} cx={-600 + azar(i) * 5200} cy={SUELO + 4 + azar(i + 2) * 30} r={4} fill={K.lehua} stroke={C.negro} strokeWidth={1} />)}</Capa>
    </>);
    case 'volcan': case 'crater': return (<>
      <defs>
        <linearGradient id="kapa-pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A1C18" /><stop offset="0.7" stopColor="#4A2016" /><stop offset="1" stopColor="#A0381A" /></linearGradient>
        <radialGradient id="kapa-brillo" cx="50%" cy="100%" r="70%"><stop offset="0" stopColor="#FF7A2A" stopOpacity={0.75} /><stop offset="1" stopColor="#FF7A2A" stopOpacity={0} /></radialGradient>
      </defs>
      <Capa p={0}><rect x={-400} y={200} width={2720} height={700} fill="url(#kapa-brillo)" opacity={0.75 + Math.sin(f / 16) * 0.15} /></Capa>
      <Capa p={0.15}><Humareda x={980} y={600} f={f} ancho={420} alto={520} /><Humareda x={300} y={640} f={f + 200} ancho={200} alto={360} n={10} /><Humareda x={1500} y={640} f={f + 120} ancho={240} alto={420} n={12} /></Capa>
      <Capa p={0.3}>
        <path d={`M-1400 700 L -1400 360 ` + Array.from({ length: 30 }, (_, i) => `L ${-1300 + i * 200} ${380 + (i % 2) * 26 + azar(i) * 30}`).join(' ') + ` L 4600 360 L 4600 700 Z`} fill="url(#kapa-pared)" stroke={C.negro} strokeWidth={3} />
        {[440, 500, 560, 620].map((yy, i) => <path key={i} d={`M-1400 ${yy} ` + Array.from({ length: 60 }, (_, j) => `q 50 ${j % 2 ? 6 : -6} 100 0`).join(' ')} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.4} />)}
      </Capa>
      <Capa p={0.55}>
        <path d="M-1400 690 H 4600 V 760 H -1400 Z" fill="#241815" />
        <LagoLava x={980} y={716} s={1} f={f} ancho={1700} prof={62} />
        <FuenteLava x={700} y={712} s={0.6} f={f} /><FuenteLava x={1340} y={716} s={0.42} f={f + 17} />
        <Chispas x={980} y={680} n={30} f={f} viento={0.4} />
        <LagoLava x={3000} y={722} s={1} f={f + 50} ancho={900} prof={44} />
        <FuenteLava x={3080} y={722} s={0.7} f={f + 9} />
      </Capa>
      <Capa p={0.8}>
        <path d={`M-1600 1100 L -1600 ${770} ` + Array.from({ length: 36 }, (_, i) => `L ${-1500 + i * 180} ${752 + azar(i + 50) * 26}`).join(' ') + ` L 5000 760 L 5000 1100 Z`} fill="#1E1714" stroke={C.negro} strokeWidth={3} />
        {Array.from({ length: 36 }, (_, i) => <path key={i} d={`M${-1500 + i * 180} ${752 + azar(i + 50) * 26} l 40 18`} stroke={K.lava} strokeWidth={2.5} opacity={0.35 + 0.25 * Math.sin(f / 12 + i)} />)}
        <path d="M-1600 1000 L -1600 640 C -1100 640, -500 700, -250 770 L -150 800 Z" fill="#1A1412" stroke={C.negro} strokeWidth={3} />
        <path d="M4600 1000 L 4600 640 C 3700 650, 2700 700, 2250 770 L 2150 800 Z" fill="#1A1412" stroke={C.negro} strokeWidth={3} />
      </Capa>
      <SueloK tipo="lava" f={f} />
    </>);
    case 'haleakala': {
      const conos: [number, number, number, string][] = [[-200, 300, 140, '#A8432A'], [300, 380, 180, '#C8702F'], [760, 260, 110, '#6E3A4A'], [1180, 420, 210, '#B5562E'], [1640, 300, 130, '#D49A4A'], [2050, 360, 160, '#7A3A2A'], [2500, 280, 120, '#9E4A3A'], [2950, 340, 150, '#C8702F'], [3400, 260, 110, '#6E3A4A'], [3800, 380, 190, '#A8432A']];
      return (<>
        <defs><radialGradient id="kapa-alba" cx="50%" cy="100%" r="80%"><stop offset="0" stopColor="#FFD27A" stopOpacity={0.9} /><stop offset="0.5" stopColor="#F28A4A" stopOpacity={0.4} /><stop offset="1" stopColor="#F28A4A" stopOpacity={0} /></radialGradient></defs>
        <Capa p={0}><rect x={-400} y={100} width={2720} height={560} fill="url(#kapa-alba)" /></Capa>
        <Capa p={0.05}>{astros && <g transform="translate(1250 450)">
          {Array.from({ length: 14 }, (_, i) => <path key={i} d="M0 -100 L 16 -330 L -16 -330 Z" fill={K.pluma} opacity={0.55} transform={`rotate(${-78 + i * 12 + Math.sin(f / 30) * 2})`} stroke={C.negro} strokeWidth={2} />)}
          <circle r={96} fill={K.pluma} stroke={C.negro} strokeWidth={4} />
          <circle r={70} fill="#FFE08A" />
        </g>}</Capa>
        <Capa p={0.1}><MarNubes y={548} f={f} paso={170} vel={0.15} color="#F2C2A0" seed={4} /></Capa>
        <Capa p={0.2}>
          <path d={`M-1400 640 L -1400 500 C -800 470, -200 530, 300 500 C 800 470, 1400 530, 2000 490 C 2700 460, 3400 510, 4400 500 L 4400 640 Z`} fill="#7A3E2E" stroke={C.negro} strokeWidth={3} />
          <MarNubes y={470} f={f + 300} paso={90} vel={0.3} color="#F8DCC2" seed={11} />
        </Capa>
        <Capa p={0.4}>
          <rect x={-1600} y={600} width={7000} height={500} fill="#8E4A33" />
          {conos.map(([x, an, al, c], i) => <Cono key={i} x={x} base={680 + (i % 2) * 20} ancho={an} alto={al} color={c} />)}
          <path d={`M-1600 700 ` + Array.from({ length: 40 }, (_, i) => `q 80 ${i % 2 ? 10 : -10} 160 0`).join(' ') + ` V 1100 H -1600 Z`} fill="#8E4A33" stroke={C.negro} strokeWidth={3} />
          <path d="M-400 760 C 200 730, 600 790, 1100 740 S 2000 720, 2600 760" stroke="#C88A5A" strokeWidth={4} fill="none" strokeDasharray="14 10" />
        </Capa>
        <Capa p={0.8}>{[[-120, 1.3, false], [380, 1.1, true], [1640, 1.2, false], [2240, 1.5, true], [880, 0.8, false], [3000, 1.2, false], [3700, 1.4, true]].map(([x, s, fl], i) => <Ahinahina key={i} x={x as number} s={s as number} f={f} flor={fl as boolean} />)}</Capa>
        <SueloK tipo="ceniza" />
      </>);
    }
    case 'mauna_kea': case 'monte': return (<>
      <Capa p={0.05}>{astros && <Sol x={1600} y={240} r={38} f={f} />}</Capa>
      <Capa p={0.12}>
        <path d="M-200 620 C 200 470, 700 430, 1000 430 C 1300 430, 1800 470, 2200 620 Z" fill="#5E6E86" stroke={C.negro} strokeWidth={3} />
        <path d="M760 446 C 880 430, 1120 430, 1240 446 L 1180 470 L 1100 456 L 1000 474 L 900 458 L 820 470 Z" fill="#FFFFFF" stroke={C.negro} strokeWidth={2} />
      </Capa>
      <Capa p={0.2}><MarNubes y={560} f={f} paso={180} vel={0.2} color="#EDE7DD" seed={1} /></Capa>
      <Capa p={0.35}><MarNubes y={630} f={f + 400} paso={230} vel={0.35} color="#FAF6EE" seed={6} /></Capa>
      <Capa p={0.6}>
        <Cono x={200} base={760} ancho={760} alto={300} color="#7A3A28" nieve />
        <Cono x={1500} base={760} ancho={900} alto={380} color="#8A4430" nieve />
        <Cono x={2500} base={760} ancho={640} alto={240} color="#6E3424" nieve />
        <Cono x={3500} base={760} ancho={820} alto={320} color="#7A3A28" nieve />
        {[[0, 0, 34], [-30, -4, 24], [28, -2, 26], [-12, -38, 24], [16, -36, 20], [2, -66, 18]].map(([dx, dy, r], i) => <ellipse key={i} cx={1500 + dx} cy={372 + dy} rx={r} ry={r * 0.7} fill={i % 2 ? '#4A3A34' : '#5C4A42'} stroke={C.negro} strokeWidth={2.5} />)}
        <path d={`M-1600 740 ` + Array.from({ length: 40 }, (_, i) => `q 80 ${i % 2 ? 8 : -8} 160 0`).join(' ') + ` V 1100 H -1600 Z`} fill="#F2EFE8" stroke={C.negro} strokeWidth={3} />
        {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${-1200 + i * 200 + azar(i) * 80} 770 l 16 -10 l 18 10 Z`} fill="#7A3A28" stroke={C.negro} strokeWidth={1.5} />)}
      </Capa>
      <SueloK tipo="nieve" />
      <Capa p={0.9}>{Array.from({ length: 40 }, (_, i) => { const t = ((f * (0.6 + azar(i) * 0.5) + i * 29) % 700) / 700; return <circle key={i} cx={-300 + azar(i + 1) * 2600 + Math.sin(f / 25 + i) * 20} cy={140 + t * 680} r={2 + azar(i + 4) * 2.5} fill="#FFFFFF" stroke={C.negro} strokeWidth={0.8} opacity={0.85} />; })}</Capa>
    </>);
    case 'noche': case 'cielo_navegante': {
      const playa = tipo === 'noche';
      return (<>
        {astros && <Capa p={0.03}>
          <path d="M-200 520 C 300 360, 900 260, 2200 120" stroke="#B9C8E8" strokeWidth={150} fill="none" opacity={0.08} />
          {Array.from({ length: 160 }, (_, i) => { const t = azar(i * 3), px = -200 + t * 2400, py = 520 - t * 400 + (azar(i * 7) - 0.5) * 120 + Math.sin(t * 6) * 30; return <circle key={i} cx={n1(px)} cy={n1(py)} r={0.8 + azar(i) * 1.6} fill="#E8EEFA" opacity={0.25 + 0.35 * azar(i + 9)} />; })}
          <Estrellas f={f} n={110} area={[0, 140, 1920, 400]} seed={7} />
          {/* Makaliʻi (las Pléyades) */}
          {[[0, 0], [16, -8], [30, 2], [22, 14], [8, 18], [40, -12], [-10, 10]].map(([dx, dy], i) => <circle key={i} cx={1420 + dx} cy={250 + dy} r={3.4} fill="#FFFFFF" opacity={0.75 + 0.25 * Math.sin(f / 7 + i)} />)}
          <circle cx={1435} cy={252} r={34} fill="#CFE0FF" opacity={0.08} />
          {/* Hōkūleʻa (Arturo), la estrella guía */}
          <g transform="translate(560 230)"><circle r={22} fill="#FFE6B0" opacity={0.18} /><path d={`M0 -18 L 3 -3 L 18 0 L 3 3 L 0 18 L -3 3 L -18 0 L -3 -3 Z`} fill="#FFF3D0" transform={`rotate(${Math.sin(f / 20) * 8})`} /></g>
          <Luna x={1720} y={330} r={34} />
        </Capa>}
        <MarAbierto f={f} horizonte={560} noche hasta={playa ? 4 : 6} />
        {astros && <Capa p={0.03}><g opacity={0.7}>{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${1700 - 30 + (i % 3) * 16 - i * 3} ${578 + i * 20} h ${24 + (i % 2) * 26 + i * 4}`} stroke="#E8EEFA" strokeWidth={3} opacity={0.35 + 0.5 * Math.abs(Math.sin(f / 9 + i))} strokeLinecap="round" />)}</g></Capa>}
        {playa && <>
          <Capa p={0.8}>
            <path d={`M-1600 ${730 + Math.sin(f / 30) * 6} ` + Array.from({ length: 80 }, (_, i) => `q 50 ${i % 2 ? 8 : -8} 100 0`).join(' ')} stroke="#9AB0C8" strokeWidth={6} fill="none" opacity={0.7} />
            <path d={`M-1600 744 ` + Array.from({ length: 70 }, (_, i) => `q 60 ${i % 2 ? 8 : -8} 120 0`).join(' ') + ` V 1200 H -1600 Z`} fill="#1E1A18" stroke={C.negro} strokeWidth={3} />
            {niu([-200, 2150, 3500], 0.85, 4).map((n, i) => <g key={i} opacity={0.95}>{n}</g>)}
          </Capa>
          <SueloK tipo="arena_negra" />
        </>}
      </>);
    }
    case 'heiau': case 'templo': case 'palacio': return (<>
      <Capa p={0.05}>{astros && <Sol x={1640} y={260} r={40} f={f} />}</Capa>
      <Capa p={0.12}><rect x={-2000} y={540} width={8000} height={600} fill="#7CC4BC" /><path d="M-2000 540H6000" stroke={C.negro} strokeWidth={3} /><FilaOlas y={560} alto={14} ancho={140} f={f} vel={0.4} color="#4FA9A8" /></Capa>
      <Capa p={0.25}><Pali x={-300} ancho={1300} alto={340} base={640} color="#4E7A5A" claro="#86A878" seed={6} estrias={24} /><rect x={-2000} y={630} width={8000} height={500} fill="#3A3430" /></Capa>
      <Capa p={0.55}>
        <path d={`M-1600 680 ` + Array.from({ length: 40 }, (_, i) => `q 80 ${i % 2 ? 6 : -6} 160 0`).join(' ') + ` V 1100 H -1600 Z`} fill="#4A4038" stroke={C.negro} strokeWidth={3} />
        <Heiau x={960} y={740} s={1} f={f} />
        {niu([300, 1650, 2600, 3300], 0.6, 7)}
        <Petroglifo x={2900} s={0.55} figura="canoa" />
      </Capa>
      <Capa p={0.85}>{niu([-150, 2150, 3800], 0.95, 9)}<Petroglifo x={1500} s={0.4} figura="espiral" /><Kahili x={3000} s={0.8} f={f} /><Petroglifo x={3350} s={0.6} figura="persona" /></Capa>
      <SueloK tipo="piedra" />
    </>);
    case 'ciudad': return fondoHawaiano('aldea', f, astros);
    default: return null;
  }
}

/** Isla que asoma del mar (para Māui pescando las islas): roca volcánica con verde arriba y palmeras. Origen = línea del agua. */
const Isla: React.FC<{ x: number; y?: number; s?: number; f: number; verde?: boolean }> = ({ x, y = SUELO, s = 1, f, verde = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-170 30 C -150 -40, -90 -110, -20 -130 C 40 -150, 110 -100, 150 -40 C 165 -10, 170 20, 175 30 Z" fill="#4A3A34" stroke={C.negro} strokeWidth={4} />
    {verde && <path d="M-130 -50 C -90 -105, -30 -128, 10 -132 C 60 -138, 110 -100, 135 -55 C 90 -78, 40 -92, -10 -86 C -60 -80, -100 -66, -130 -50 Z" fill="#3E7A3A" stroke={C.negro} strokeWidth={3} />}
    {verde && [[-40, -118], [40, -128]].map(([px, py], i) => (
      <g key={i} transform={`translate(${px} ${py})`}>
        <path d="M0 0 C 2 -30, -2 -55, 4 -80" stroke="#6B4A2A" strokeWidth={6} fill="none" />
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M4 -80 q ${-40 + k * 20} ${-12 + Math.abs(k - 2) * 6 + Math.sin(f / 20 + k) * 3} ${-60 + k * 30} ${16 + Math.abs(k - 2) * 8}`} stroke="#2E6B30" strokeWidth={5} fill="none" strokeLinecap="round" />)}
      </g>
    ))}
    <path d="M-185 30 Q -120 14 -60 28 T 60 26 T 190 30" stroke="#E9F4F0" strokeWidth={5} fill="none" opacity={0.8} />
  </g>
);
