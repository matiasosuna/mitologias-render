// Piel hindú (tema "pahari"): fondos y elementos al estilo de la pintura en miniatura rajput y pahari — cielo en franja
// con nubes rizadas, colinas redondas con árboles en fila, agua en tejido de líneas, palacios blancos con cúpulas,
// pradera verde con matas en flor. Lugares de la T1: el océano de antes del mundo, el océano de leche, el cielo de
// Indra, el Kailash, el bosque, la orilla del río, el palacio (de día, de noche y al atardecer), el Patala, el cielo de
// los astros, el diluvio, el campo y la ermita. Elementos grandes armados de una pieza: Vishnu dormido sobre Shesha
// (`vishnu_shesha`), el pilar de fuego (`pilar_fuego`) y el batido del océano (`batido`).
import React from 'react';
import { Capa, SUELO, Fuego, Personaje, suave, azar, type PersonajeProps } from '../comun/vasija';
import { PH, SueloPahari, Mata, Florcita } from '../comun/pahari';
import { ELENCO_HINDU } from './elencoHindu';
import type { Cielo } from './fondos';

const r1 = (v: number) => v.toFixed(1);
const N = PH.negro;

/** Fondos del tema y su cielo (lo usa Escena para el degradé de base). */
export const CIELO_HINDU: Record<string, Cielo> = {
  oceano_cosmico: 'noche', oceano_leche: 'mar', svarga: 'barro', kailash: 'mar', bosque_pahari: 'barro', orilla_rio: 'barro',
  palacio_pahari: 'barro', palacio_noche: 'noche', crepusculo: 'noche', patala: 'inframundo', cielo_cosmico: 'noche', diluvio: 'mar',
  campo_pahari: 'barro', ashram: 'barro',
};
export const FONDOS_HINDU = ['oceano_cosmico', 'oceano_leche', 'svarga', 'kailash', 'bosque_pahari', 'orilla_rio', 'palacio_pahari', 'palacio_noche', 'crepusculo', 'patala', 'cielo_cosmico', 'diluvio', 'campo_pahari', 'ashram'];
export const ELEMENTOS_HINDU = ['vishnu_shesha', 'pilar_fuego', 'batido', 'halahala', 'kalasha', 'loto', 'kalpavriksha', 'huevo_oro', 'vedas', 'arbol_pahari', 'cipres_pahari', 'banano', 'mango', 'pabellon', 'palacio', 'pilar', 'puerta_palacio', 'trono_indio', 'yajna', 'mandap', 'kailash_pico', 'colina', 'roca_pahari', 'estanque', 'barco_manu', 'cuenco', 'sol_pahari', 'luna_pahari', 'nube_rizada', 'estrellas_pahari', 'joya', 'cabana', 'piel_tigre', 'lluvia_oro'];

// ---------- piezas ----------
/** Degradés del tema (cielos en franja). Se pueden repetir en el documento: son iguales. */
const Degrades: React.FC = () => (
  <defs>
    <linearGradient id="phDia" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B62B0" /><stop offset="45%" stopColor="#9DBCE0" /><stop offset="100%" stopColor="#F6ECD2" /></linearGradient>
    <linearGradient id="phOro" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E8892B" /><stop offset="50%" stopColor="#F0C24A" /><stop offset="100%" stopColor="#FBF0CF" /></linearGradient>
    <linearGradient id="phNoche" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0A0E30" /><stop offset="60%" stopColor="#16205A" /><stop offset="100%" stopColor="#2B3A7A" /></linearGradient>
    <linearGradient id="phOcaso" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3A2A6A" /><stop offset="45%" stopColor="#B8506A" /><stop offset="100%" stopColor="#F0A04A" /></linearGradient>
    <linearGradient id="phTormenta" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1E2440" /><stop offset="100%" stopColor="#5A6A8A" /></linearGradient>
    <linearGradient id="phPatala" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#120818" /><stop offset="100%" stopColor="#4A1E4A" /></linearGradient>
    <linearGradient id="phLeche" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7FA8D8" /><stop offset="55%" stopColor="#D9E6F0" /><stop offset="100%" stopColor="#FFF9EC" /></linearGradient>
    <radialGradient id="phBrillo"><stop offset="0%" stopColor="#FFF6D0" stopOpacity={1} /><stop offset="40%" stopColor="#F0C24A" stopOpacity={0.7} /><stop offset="100%" stopColor="#E8892B" stopOpacity={0} /></radialGradient>
  </defs>
);
/** Cielo en franja: degradé + banda de nubes rizadas arriba (como en las miniaturas). */
const Cielo: React.FC<{ id: string; nubes?: boolean; f: number; rayos?: boolean }> = ({ id, nubes = true, f, rayos }) => (
  <g>
    <rect x={-2400} y={60} width={8000} height={SUELO} fill={`url(#${id})`} />
    {nubes && <path d={`M-2400 120 ` + Array.from({ length: 70 }, (_, i) => `c 14 ${-12 - azar(i) * 10} 50 ${-12 - azar(i) * 10} 60 4 c 8 -10 34 -12 40 -4`).join(' ') + ' V 60 H -2400 Z'} fill={id === 'phNoche' || id === 'phTormenta' ? '#3A4A7A' : PH.blanco} stroke={PH.oro} strokeWidth={1.4} transform={`translate(${r1(-(f * 0.15) % 100)} 50)`} opacity={0.95} />}
    {rayos && [0, 1, 2].map((k) => <path key={k} d={`M${200 + k * 700} 180 l 30 50 l -20 6 l 40 70`} stroke={PH.oro} strokeWidth={4} fill="none" opacity={Math.sin(f / 5 + k * 2) > 0.85 ? 1 : 0.15} />)}
  </g>
);
/** Nube rizada suelta (blanca con filete de oro). */
export const NubeRizada: React.FC<{ x: number; y: number; s?: number; f?: number; oscura?: boolean }> = ({ x, y, s = 1, f = 0, oscura }) => (
  <g transform={`translate(${r1(x + Math.sin(f / 70 + x) * 12)} ${r1(y)}) scale(${s})`}>
    <path d="M-120 20 C -136 2, -114 -18, -92 -10 C -88 -36, -54 -44, -36 -24 C -26 -50, 14 -54, 26 -28 C 42 -46, 82 -40, 84 -12 C 108 -18, 128 4, 112 22 Z" fill={oscura ? '#4A5478' : PH.blanco} stroke={oscura ? '#2A3050' : PH.oro} strokeWidth={2.2} />
    {[[-82, 2], [-30, -8], [30, -4], [80, 6]].map(([cx, cy], i) => <path key={i} d={`M${cx} ${cy} a 9 9 0 1 1 9 9 a 4.5 4.5 0 1 1 -4.5 -4.5`} stroke={oscura ? '#2A3050' : PH.azulClaro} strokeWidth={2} fill="none" />)}
  </g>
);
/** Colina redonda de miniatura con árbolitos en fila sobre la cresta. */
export const Colina: React.FC<{ x: number; y?: number; w?: number; h?: number; c?: string; arboles?: boolean; seed?: number }> = ({ x, y = SUELO, w = 700, h = 260, c = '#7FA05A', arboles = true, seed = 1 }) => {
  const n = Math.floor(w / 70);
  return (
    <g>
      <path d={`M${x - w / 2} ${y} C ${x - w * 0.35} ${y - h}, ${x + w * 0.35} ${y - h}, ${x + w / 2} ${y} Z`} fill={c} stroke={N} strokeWidth={2} />
      {[0.3, 0.6].map((k, i) => <path key={i} d={`M${x - w * 0.42 * (1 - k * 0.3)} ${y - h * 0.25 * k} C ${x - w * 0.2} ${y - h * (0.7 - k * 0.3)}, ${x + w * 0.2} ${y - h * (0.72 - k * 0.3)}, ${x + w * 0.42 * (1 - k * 0.3)} ${y - h * 0.25 * k}`} stroke={N} strokeWidth={1} fill="none" opacity={0.25} />)}
      {arboles && Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n, tx = x - w / 2 + t * w, ty = y - h * 0.75 * Math.sin(t * Math.PI) - 6;
        if (azar(i + seed * 7) < 0.25) return null;
        return azar(i + seed) < 0.5
          ? <path key={i} d={`M${r1(tx)} ${r1(ty)} c -10 -6 -10 -40 0 -58 c 10 18 10 52 0 58 Z`} fill="#2F5A2A" stroke={N} strokeWidth={1} />
          : <g key={i}><path d={`M${r1(tx)} ${r1(ty)} v -14`} stroke="#5A3A20" strokeWidth={3} /><circle cx={tx} cy={ty - 26} r={15} fill="#3F6A28" stroke={N} strokeWidth={1} /><circle cx={tx - 4} cy={ty - 30} r={3} fill={PH.verdeClaro} /></g>;
      })}
    </g>
  );
};
/** Agua de miniatura: azul con tejido de ondas finas y florcitas de loto sueltas. leche = océano de leche. */
export const AguaPahari: React.FC<{ y: number; f: number; leche?: boolean; oscura?: boolean; desde?: number; hasta?: number; lotos?: boolean }> = ({ y, f, leche, oscura, desde: x0 = -2000, hasta = 6400, lotos }) => {
  const filas = Math.ceil((1100 - y) / 26);
  const base = leche ? '#F4F0E4' : oscura ? '#24305A' : '#3D72C4', linea = leche ? '#9DBCE0' : oscura ? '#4A5A8A' : '#9DBCE0';
  return (
    <g>
      <rect x={x0} y={y} width={hasta - x0} height={1300 - y} fill={base} />
      <path d={`M${x0} ${y} H ${hasta}`} stroke={N} strokeWidth={2.6} />
      {Array.from({ length: filas }, (_, r) => {
        const yy = y + 12 + r * 26, paso = 70, des = (f * (0.4 + (r % 3) * 0.15)) % paso;
        return <path key={r} transform={`translate(${r1(-des + (r % 2) * 35)} 0)`} d={`M${x0} ${yy} ` + Array.from({ length: Math.ceil((hasta - x0) / paso) + 2 }, () => `q 17.5 -9 35 0 t 35 0`).join(' ')} stroke={linea} strokeWidth={2} fill="none" opacity={0.85} />;
      })}
      {lotos && Array.from({ length: Math.ceil((hasta - x0) / 420) }, (_, i) => <g key={i} transform={`translate(${x0 + 120 + i * 420 + azar(i) * 160} ${y + 30 + azar(i + 3) * 60})`}><ellipse rx={26} ry={7} fill={PH.verde} stroke={N} strokeWidth={1} /><Florcita x={6} y={-8} r={9} c={PH.rosa} /></g>)}
    </g>
  );
};
/** Piso de terraza de palacio: mármol blanco con dibujo de rombos y borde rojo. */
const Terraza: React.FC<{ noche?: boolean; desde?: number; hasta?: number }> = ({ noche, desde: x0 = -1600, hasta = 6400 }) => (
  <g>
    <rect x={x0} y={SUELO} width={hasta - x0} height={260} fill={noche ? '#9AA0B8' : '#EFE6D2'} />
    <rect x={x0} y={SUELO} width={hasta - x0} height={10} fill={PH.rojo} />
    <rect x={x0} y={SUELO + 10} width={hasta - x0} height={3} fill={N} />
    {Array.from({ length: Math.ceil((hasta - x0) / 60) }, (_, i) => <path key={i} d={`M${x0 + i * 60} ${SUELO + 14} l 30 18 l 30 -18 M${x0 + i * 60} ${SUELO + 50} l 30 -18 l 30 18`} stroke={noche ? '#6A7090' : '#C9B48A'} strokeWidth={1.6} fill="none" />)}
  </g>
);
/** Suelo de nubes (el cielo de Indra). */
const SueloNubes: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-1600} y={SUELO + 6} width={8000} height={260} fill={PH.blanco} />
    <path d={`M-1600 ${SUELO + 10} ` + Array.from({ length: 140 }, (_, i) => `q 30 ${-18 - azar(i) * 14} 60 0`).join(' ') + ` V ${SUELO + 260} H -1600 Z`} fill={PH.blanco} stroke={PH.oro} strokeWidth={2.4} />
    {Array.from({ length: 140 }, (_, i) => <path key={i} d={`M${-1600 + i * 60 + 14} ${SUELO + 26} a 9 9 0 1 1 9 9`} stroke={PH.azulClaro} strokeWidth={2.2} fill="none" opacity={0.7} transform={`translate(${r1(Math.sin(f / 50 + i) * 2)} 0)`} />)}
  </g>
);
/** Nieve del Himalaya. */
const SueloNieve: React.FC = () => (
  <g>
    <rect x={-1600} y={SUELO} width={8000} height={260} fill="#EEF2F6" />
    <rect x={-1600} y={SUELO} width={8000} height={4} fill={N} opacity={0.7} />
    {Array.from({ length: 80 }, (_, i) => <path key={i} d={`M${-1600 + i * 100 + 20} ${SUELO + 24 + (i % 3) * 10} q 20 -8 40 0`} stroke="#9DB0C8" strokeWidth={2} fill="none" />)}
  </g>
);
/** Suelo de cueva del Patala con gemas que brillan. */
const SueloPatala: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-1600} y={SUELO} width={8000} height={260} fill="#2A1630" />
    <rect x={-1600} y={SUELO} width={8000} height={5} fill={N} />
    {Array.from({ length: 70 }, (_, i) => <path key={i} d={`M${-1600 + i * 115 + 30} ${SUELO + 30} l 8 -12 l 8 12 l -8 10 Z`} fill={[PH.rojo, PH.verde, PH.azulClaro][i % 3]} opacity={0.6 + Math.sin(f / 10 + i) * 0.3} />)}
  </g>
);
/** Árbol redondo de miniatura (copa oscura con hojitas claras y flores). */
const ArbolPahari: React.FC<{ x: number; y?: number; s?: number; f?: number; flor?: string }> = ({ x, y = SUELO, s = 1, f = 0, flor = PH.rosa }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s}) rotate(${r1(Math.sin(f / 40 + x) * 0.8)})`}>
    <path d="M-12 0 C -8 -60, -16 -110, -4 -170 L 6 -170 C 14 -110, 8 -60, 14 0 Z" fill="#6A4426" stroke={N} strokeWidth={1.6} />
    <path d="M-2 -120 C -30 -140, -50 -150, -70 -150 M4 -140 C 30 -160, 50 -170, 70 -168" stroke="#6A4426" strokeWidth={6} fill="none" />
    <path d={suave([[-110, -170], [-120, -240], [-70, -300], [0, -320], [80, -300], [120, -240], [110, -170], [50, -140], [-50, -140]], true)} fill="#2F5A2A" stroke={N} strokeWidth={2} />
    {Array.from({ length: 34 }, (_, i) => { const a = azar(i * 3 + x) * Math.PI * 2, rr = azar(i * 7 + x) * 0.9; const cx = Math.cos(a) * 100 * rr, cy = -230 + Math.sin(a) * 70 * rr; return i % 4 === 0 ? <Florcita key={i} x={cx} y={cy} r={6} c={flor} /> : <path key={i} d={`M${r1(cx)} ${r1(cy)} q 5 -8 10 0 q -5 6 -10 0 Z`} fill={PH.verdeClaro} />; })}
  </g>
);
/** Ciprés angosto de las miniaturas. */
const CipresPahari: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-4 0 V -30 M4 0 V -30" stroke="#5A3A20" strokeWidth={4} />
    <path d="M0 -330 C 34 -260, 40 -120, 22 -30 C 10 -20, -10 -20, -22 -30 C -40 -120, -34 -260, 0 -330 Z" fill="#244A24" stroke={N} strokeWidth={1.8} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-14 + (i % 3) * 10} ${-60 - i * 28} q 6 -8 10 0`} stroke={PH.verdeClaro} strokeWidth={2} fill="none" />)}
  </g>
);
/** Banano (hojas largas en abanico). */
const Banano: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-10 0 C -8 -80, -6 -140, -2 -190 L 8 -190 C 10 -140, 10 -80, 10 0 Z" fill="#7A9A4A" stroke={N} strokeWidth={1.4} />
    {[-70, -35, 0, 35, 70].map((a, i) => <path key={i} transform={`translate(3 -190) rotate(${r1(a + Math.sin(f / 25 + i) * 3)})`} d="M0 0 C -20 -40, -16 -110, 0 -150 C 16 -110, 20 -40, 0 0 Z" fill={i % 2 ? '#4E8A3A' : '#5E9A44'} stroke={N} strokeWidth={1.2} />)}
  </g>
);
/** Mango (copa ancha con frutos). */
const Mango: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g>
    <ArbolPahari x={x} y={y} s={s} f={f} flor={PH.blanco} />
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>{Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={-80 + azar(i + 5) * 160} cy={-180 - azar(i + 9) * 110} rx={8} ry={11} fill={PH.amarillo} stroke={N} strokeWidth={1} />)}</g>
  </g>
);
/** Pabellón (chhatri): basamento, columnas finas, arco lobulado y cúpula. */
const Pabellon: React.FC<{ x: number; y?: number; s?: number; noche?: boolean }> = ({ x, y = SUELO, s = 1, noche }) => {
  const blanco = noche ? '#B8BCD0' : '#F4EEDC', sombra = noche ? '#8A90A8' : '#D9CDB0';
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <rect x={-170} y={-40} width={340} height={40} fill={sombra} stroke={N} strokeWidth={2} />
      <rect x={-150} y={-300} width={300} height={260} fill={noche ? '#5A2A3A' : PH.rojo} stroke={N} strokeWidth={2} />
      <path d="M-110 -40 V -220 C -110 -250, -80 -262, -60 -250 C -50 -280, -14 -290, 0 -270 C 14 -290, 50 -280, 60 -250 C 80 -262, 110 -250, 110 -220 V -40 Z" fill={noche ? '#2A1A2A' : '#7A1712'} stroke={N} strokeWidth={1.6} />
      {[-150, -110, 110, 150].map((cx) => <rect key={cx} x={cx - 10} y={-300} width={20} height={260} fill={blanco} stroke={N} strokeWidth={1.6} />)}
      <rect x={-180} y={-322} width={360} height={26} fill={blanco} stroke={N} strokeWidth={2} />
      <path d="M-180 -322 L -200 -310 M180 -322 L 200 -310" stroke={N} strokeWidth={3} />
      <path d="M-130 -322 C -130 -420, 130 -420, 130 -322 Z" fill={blanco} stroke={N} strokeWidth={2} />
      {[-60, 0, 60].map((cx) => <path key={cx} d={`M${cx} -330 C ${cx * 0.6} -380, ${cx * 0.3} -400, 0 -404`} stroke={sombra} strokeWidth={2} fill="none" />)}
      <path d="M0 -404 C -16 -410, -14 -430, 0 -440 C 14 -430, 16 -410, 0 -404 Z M0 -440 V -470" fill={PH.oro} stroke={N} strokeWidth={1.6} />
      <circle cx={0} cy={-472} r={5} fill={PH.oro} stroke={N} strokeWidth={1} />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-176 + i * 40} y={-318} width={10} height={18} fill={PH.verde} opacity={0.6} />)}
    </g>
  );
};
/** Palacio de fondo: muros blancos con ventanas, cúpulas y balcones. */
const Palacio: React.FC<{ x: number; y?: number; s?: number; noche?: boolean; ocaso?: boolean }> = ({ x, y = SUELO, s = 1, noche, ocaso }) => {
  const muro = noche ? '#A8AEC4' : ocaso ? '#E8C8B0' : '#F4EEDC', ventana = noche ? '#F0C24A' : PH.verde;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <rect x={-420} y={-300} width={840} height={300} fill={muro} stroke={N} strokeWidth={2} />
      <rect x={-140} y={-420} width={280} height={140} fill={muro} stroke={N} strokeWidth={2} />
      {[-360, -260, -160, 160, 260, 360].map((cx) => <path key={cx} d={`M${cx - 26} -60 V -180 C ${cx - 26} -210, ${cx + 26} -210, ${cx + 26} -180 V -60 Z`} fill={ventana} stroke={N} strokeWidth={1.4} opacity={noche ? 0.9 : 1} />)}
      {[-80, 0, 80].map((cx) => <path key={cx} d={`M${cx - 22} -300 V -370 C ${cx - 22} -394, ${cx + 22} -394, ${cx + 22} -370 V -300 Z`} fill={ventana} stroke={N} strokeWidth={1.4} />)}
      <path d="M-60 0 V -150 C -60 -200, 60 -200, 60 -150 V 0 Z" fill={noche ? '#2A1A2A' : PH.rojoOsc} stroke={N} strokeWidth={2} />
      {[-300, 300].map((cx) => <g key={cx}><rect x={cx - 60} y={-330} width={120} height={30} fill={muro} stroke={N} strokeWidth={1.6} /><path d={`M${cx - 60} -330 C ${cx - 60} -400, ${cx + 60} -400, ${cx + 60} -330 Z`} fill={muro} stroke={N} strokeWidth={1.8} /><path d={`M${cx} -386 V -410`} stroke={PH.oro} strokeWidth={4} /></g>)}
      <path d="M-120 -420 C -120 -540, 120 -540, 120 -420 Z" fill={muro} stroke={N} strokeWidth={2} />
      <path d="M0 -520 V -560" stroke={PH.oro} strokeWidth={5} /><circle cx={0} cy={-564} r={6} fill={PH.oro} />
      <path d="M-420 -300 H 420" stroke={PH.rojo} strokeWidth={6} />
      {Array.from({ length: 21 }, (_, i) => <rect key={i} x={-416 + i * 40} y={-316} width={8} height={16} fill={muro} stroke={N} strokeWidth={0.8} />)}
    </g>
  );
};
/** Columna de piedra del palacio (de la que sale Narasimha); rota = rajada con luz. */
const Pilar: React.FC<{ x: number; y?: number; s?: number; f: number; rota?: boolean }> = ({ x, y = SUELO, s = 1, f, rota }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {rota && <circle cx={0} cy={-220} r={220 + Math.sin(f / 4) * 10} fill="url(#phBrillo)" opacity={0.8} />}
    <rect x={-50} y={-40} width={100} height={40} fill="#D9CDB0" stroke={N} strokeWidth={2} />
    <path d="M-36 -40 V -420 H 36 V -40 Z" fill="#EFE6D2" stroke={N} strokeWidth={2} />
    {[-18, 0, 18].map((cx) => <path key={cx} d={`M${cx} -46 V -414`} stroke="#C9B48A" strokeWidth={2} />)}
    <path d="M-56 -420 H 56 L 46 -450 H -46 Z" fill="#D9CDB0" stroke={N} strokeWidth={2} />
    <path d="M-40 -110 C -20 -130, 20 -130, 40 -110" stroke={PH.rojo} strokeWidth={4} fill="none" />
    {rota && <path d="M-6 -420 L 8 -340 L -10 -270 L 12 -200 L -6 -120 L 6 -40" stroke={PH.amarillo} strokeWidth={6} fill="none" />}
  </g>
);
/** Puerta del palacio con umbral (arco lobulado). */
const PuertaPalacio: React.FC<{ x: number; y?: number; s?: number; noche?: boolean }> = ({ x, y = SUELO, s = 1, noche }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-170} y={-460} width={340} height={460} fill={noche ? '#A8AEC4' : '#F4EEDC'} stroke={N} strokeWidth={2} />
    <path d="M-110 0 V -280 C -110 -320, -70 -334, -50 -320 C -40 -356, 40 -356, 50 -320 C 70 -334, 110 -320, 110 -280 V 0 Z" fill={noche ? '#1A1030' : '#3A1A12'} stroke={N} strokeWidth={2} />
    <path d="M-110 -280 C -110 -320, -70 -334, -50 -320 C -40 -356, 40 -356, 50 -320 C 70 -334, 110 -320, 110 -280" stroke={PH.oro} strokeWidth={6} fill="none" />
    <rect x={-130} y={-14} width={260} height={14} fill={PH.rojo} stroke={N} strokeWidth={1.6} />
    {[-140, 140].map((cx) => <Florcita key={cx} x={cx} y={-400} r={14} c={PH.rosa} />)}
  </g>
);
/** Trono bajo (gaddi) con almohadón y dosel. */
const TronoIndio: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-100 -380 L 100 -380 L 110 -400 L -110 -400 Z" fill={PH.rojo} stroke={N} strokeWidth={1.6} />
    {[-90, 90].map((cx) => <path key={cx} d={`M${cx} -380 V -100`} stroke={PH.oro} strokeWidth={6} />)}
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-100 + i * 25} -380 l 12 16 l 12 -16`} fill={PH.oro} stroke={N} strokeWidth={0.8} />)}
    <rect x={-110} y={-110} width={220} height={110} rx={6} fill={PH.oro} stroke={N} strokeWidth={2} />
    <rect x={-100} y={-130} width={200} height={26} rx={10} fill={PH.verde} stroke={N} strokeWidth={1.6} />
    <ellipse cx={-80} cy={-160} rx={26} ry={40} fill={PH.rojo} stroke={N} strokeWidth={1.6} />
    {[-70, -20, 30, 80].map((cx) => <Florcita key={cx} x={cx} y={-56} r={9} c={PH.rojo} centro={PH.verde} />)}
  </g>
);
/** Altar de fuego del sacrificio (yajna kund): ladrillos en escalones y llamas. */
const Yajna: React.FC<{ x: number; y?: number; s?: number; f: number; fuego?: boolean }> = ({ x, y = SUELO, s = 1, f, fuego = true }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {fuego && <g transform="translate(0 -70)"><circle r={120} fill="url(#phBrillo)" opacity={0.6} /><Fuego f={f} s={0.9} viento={-8} /></g>}
    <path d="M-110 0 V -40 H -80 V -70 H 80 V -40 H 110 V 0 Z" fill="#B85A3A" stroke={N} strokeWidth={2} />
    {[-90, -50, -10, 30, 70].map((cx) => <path key={cx} d={`M${cx} -40 v -30 M${cx + 20} 0 v -40`} stroke="#7A3A22" strokeWidth={1.6} />)}
    <path d="M-110 -40 H 110 M-80 -70 H 80" stroke={N} strokeWidth={1.6} />
  </g>
);
/** Dosel de boda (mandap): cuatro postes con guirnaldas y techo rojo. */
const Mandap: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-240 -440 C -120 -500, 120 -500, 240 -440 Z" fill={PH.rojo} stroke={N} strokeWidth={2} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-230 + i * 40} -440 l 20 22 l 20 -22`} fill={PH.oro} stroke={N} strokeWidth={0.8} />)}
    {[-220, 220].map((cx) => <g key={cx}><path d={`M${cx} 0 V -440`} stroke="#5A8A3A" strokeWidth={14} /><path d={`M${cx} 0 V -440`} stroke={PH.oro} strokeWidth={4} strokeDasharray="8 14" /></g>)}
    <path d="M-220 -420 C -110 -330, 110 -330, 220 -420" stroke={PH.azafran} strokeWidth={10} fill="none" strokeDasharray="2 10" strokeLinecap="round" />
    <path d="M-220 -400 C -110 -310, 110 -310, 220 -400" stroke={PH.amarillo} strokeWidth={8} fill="none" strokeDasharray="2 10" strokeLinecap="round" />
  </g>
);
/** Pico nevado (Kailash). */
const KailashPico: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-360 0 L -120 -360 L -60 -330 L 0 -460 L 80 -350 L 140 -380 L 360 0 Z" fill="#DCE6F0" stroke={N} strokeWidth={2.4} />
    <path d="M0 -460 L -40 -300 L 10 -220 L -30 -100 L 20 0" stroke="#9DB0C8" strokeWidth={8} fill="none" />
    <path d="M-120 -360 L -170 -200 M140 -380 L 190 -220" stroke="#9DB0C8" strokeWidth={6} fill="none" />
    <path d="M-360 0 L -220 -150 C -150 -120, -100 -60, -60 0 Z M360 0 L 230 -140 C 170 -110, 120 -50, 90 0 Z" fill="#B8C8DA" opacity={0.7} />
  </g>
);
/** Roca de miniatura (gris violácea con borde claro). */
const RocaPahari: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-110 0 C -120 -50, -90 -100, -40 -110 C -10 -150, 50 -140, 70 -100 C 110 -90, 120 -40, 110 0 Z" fill="#9A94A8" stroke={N} strokeWidth={2} />
    <path d="M-80 -40 C -70 -80, -40 -96, -20 -92 M20 -110 C 40 -120, 60 -110, 66 -96 M60 -40 C 70 -60, 90 -66, 100 -50" stroke={PH.blanco} strokeWidth={3} fill="none" opacity={0.8} />
  </g>
);
/** Estanque de lotos. */
const Estanque: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <ellipse cx={0} cy={-10} rx={260} ry={46} fill="#3D72C4" stroke={N} strokeWidth={2} />
    {[0, 1, 2].map((k) => <path key={k} d={`M${-180 + k * 40} ${-14 + k * 10} q 20 -8 40 0 t 40 0`} stroke="#9DBCE0" strokeWidth={2} fill="none" transform={`translate(${r1(Math.sin(f / 30 + k) * 6)} 0)`} />)}
    {[[-150, -20], [-40, -4], [90, -18], [180, -6]].map(([cx, cy], i) => <g key={i}><ellipse cx={cx} cy={cy} rx={24} ry={7} fill={PH.verde} stroke={N} strokeWidth={1} /><Florcita x={cx + 6} y={cy - 9} r={9} c={i % 2 ? PH.blanco : PH.rosa} /></g>)}
  </g>
);
/** Barco de Manu (con la soga que se ata al cuerno del pez). */
const BarcoManu: React.FC<{ x: number; y?: number; s?: number; f: number; soga?: number }> = ({ x, y = SUELO - 30, s = 1, f, soga }) => (
  <g transform={`translate(${r1(x)} ${r1(y + Math.sin(f / 12) * 6)}) scale(${s}) rotate(${r1(Math.sin(f / 15) * 2)})`}>
    {soga !== undefined && <path d={`M150 -100 C ${150 + soga * 0.4} -150, ${150 + soga * 0.7} -150, ${150 + soga} -120`} stroke="#B8945A" strokeWidth={5} fill="none" />}
    <path d="M-220 -60 C -180 10, 180 10, 220 -60 L 170 -40 L -170 -40 Z" fill="#8A5A2E" stroke={N} strokeWidth={2.4} />
    <path d="M-200 -50 C -160 0, 160 0, 200 -50" stroke={PH.amarillo} strokeWidth={4} fill="none" />
    <path d="M220 -60 C 240 -90, 250 -110, 236 -130 C 230 -110, 220 -96, 206 -80" fill="#8A5A2E" stroke={N} strokeWidth={2} />
    <rect x={-110} y={-120} width={170} height={70} fill={PH.rojo} stroke={N} strokeWidth={2} />
    <path d="M-120 -120 C -60 -170, 40 -170, 70 -120 Z" fill={PH.amarillo} stroke={N} strokeWidth={2} />
    <path d="M150 -40 V -100" stroke="#5A3A20" strokeWidth={6} />
  </g>
);
/** Cuenco de agua (vasija de bronce) con un pececito adentro. */
const Cuenco: React.FC<{ x: number; y?: number; s?: number; f: number; pez?: boolean }> = ({ x, y = SUELO, s = 1, f, pez = true }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-60 -70 C -90 -20, -50 0, 0 0 C 50 0, 90 -20, 60 -70 Z" fill="#C9902E" stroke={N} strokeWidth={2} />
    <ellipse cx={0} cy={-70} rx={60} ry={14} fill="#3D72C4" stroke={N} strokeWidth={2} />
    {pez && <g transform={`translate(${r1(Math.sin(f / 10) * 18)} -74)`}><path d="M-12 0 C -6 -8, 8 -8, 14 0 C 8 6, -6 6, -12 0 Z M-12 0 L -20 -6 L -20 6 Z" fill={PH.azafran} stroke={N} strokeWidth={1} /></g>}
    <path d="M-50 -40 C -20 -30, 20 -30, 50 -40" stroke={PH.amarillo} strokeWidth={3} fill="none" />
  </g>
);
/** Sol de miniatura: disco rojo y oro con cara serena; eclipse 0–1 = sombra que lo tapa. */
export const SolPahari: React.FC<{ x: number; y: number; r?: number; f: number; cara?: boolean; eclipse?: number; luz?: number }> = ({ x, y, r = 60, f, cara = true, eclipse = 0, luz = 1 }) => {
  const id = `phe${Math.round(x)}${Math.round(y)}`;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)})`}>
      <circle r={r * 3.2} fill="url(#phBrillo)" opacity={0.55 * luz * (1 - eclipse * 0.8)} />
      <g transform={`rotate(${r1(f * 0.25)})`}>{Array.from({ length: 16 }, (_, i) => <path key={i} transform={`rotate(${i * 22.5})`} d={`M${-r * 0.18} ${-r * 0.95} L 0 ${-r * (i % 2 ? 1.3 : 1.55)} L ${r * 0.18} ${-r * 0.95} Z`} fill={i % 2 ? PH.rojo : PH.azafran} stroke={N} strokeWidth={1.2} />)}</g>
      <circle r={r} fill={PH.amarillo} stroke={N} strokeWidth={2.4} />
      <circle r={r * 0.84} fill="none" stroke={PH.azafran} strokeWidth={r * 0.08} />
      {cara && <g><path d={`M${-r * 0.42} ${-r * 0.1} q ${r * 0.14} ${-r * 0.12} ${r * 0.28} 0 M${r * 0.14} ${-r * 0.1} q ${r * 0.14} ${-r * 0.12} ${r * 0.28} 0`} stroke={N} strokeWidth={r * 0.05} fill="none" strokeLinecap="round" /><path d={`M${-r * 0.18} ${r * 0.3} q ${r * 0.18} ${r * 0.12} ${r * 0.36} 0`} stroke={N} strokeWidth={r * 0.05} fill="none" strokeLinecap="round" /><path d={`M0 ${-r * 0.06} v ${r * 0.2}`} stroke={N} strokeWidth={r * 0.04} /></g>}
      {eclipse > 0 && <><defs><clipPath id={id}><circle r={r + 2} /></clipPath></defs><circle clipPath={`url(#${id})`} cx={r * 2.1 * (1 - eclipse)} cy={0} r={r * 1.02} fill="#141830" /></>}
    </g>
  );
};
/** Luna de miniatura: creciente plateada con halo. */
const LunaPahari: React.FC<{ x: number; y: number; r?: number; llena?: boolean; eclipse?: number }> = ({ x, y, r = 50, llena, eclipse = 0 }) => {
  const id = `phl${Math.round(x)}${Math.round(y)}`;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)})`}>
      <circle r={r * 2.4} fill="url(#haloBlanco)" opacity={0.5 * (1 - eclipse * 0.8)} />
      {llena ? <circle r={r} fill="#F2F0E4" stroke={N} strokeWidth={2} /> : <path d={`M${-r} 0 A ${r} ${r} 0 1 0 ${r * 0.6} ${-r * 0.8} A ${r * 0.82} ${r * 0.82} 0 1 1 ${-r} 0 Z`} fill="#F2F0E4" stroke={N} strokeWidth={2} />}
      {eclipse > 0 && <><defs><clipPath id={id}><circle r={r + 2} /></clipPath></defs><circle clipPath={`url(#${id})`} cx={r * 2.1 * (1 - eclipse)} cy={0} r={r * 1.02} fill="#141830" /></>}
    </g>
  );
};
/** Estrellas de miniatura (puntos de oro de cuatro puntas que titilan). */
const Estrellas: React.FC<{ f: number; n?: number; area?: [number, number, number, number]; seed?: number }> = ({ f, n = 40, area = [-400, 140, 2800, 420], seed = 2 }) => (
  <g>{Array.from({ length: n }, (_, i) => { const x = area[0] + azar(i * 3 + seed) * area[2], y = area[1] + azar(i * 7 + seed) * area[3], k = 3 + azar(i + seed) * 5, o = 0.5 + Math.sin(f / 9 + i) * 0.4; return <path key={i} d={`M${r1(x)} ${r1(y - k)} L ${r1(x + k * 0.3)} ${r1(y)} L ${r1(x)} ${r1(y + k)} L ${r1(x - k * 0.3)} ${r1(y)} Z M${r1(x - k)} ${r1(y)} L ${r1(x + k)} ${r1(y)}`} fill={PH.amarillo} stroke={PH.amarillo} strokeWidth={1} opacity={o} />; })}</g>
);
/** Loto gigante (asiento de dioses); abierto 0–1. */
const Loto: React.FC<{ x: number; y?: number; s?: number; f: number; abierto?: number }> = ({ x, y = SUELO, s = 1, f, abierto = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <circle cx={0} cy={-60} r={170} fill="url(#phBrillo)" opacity={0.35 + Math.sin(f / 12) * 0.1} />
    {[-80, -55, -30, 0, 30, 55, 80].map((a, i) => <path key={i} transform={`rotate(${r1(a * abierto)})`} d="M0 0 C -34 -30, -30 -110, 0 -140 C 30 -110, 34 -30, 0 0 Z" fill={i % 2 ? '#F2B8C2' : PH.rosa} stroke={N} strokeWidth={1.8} />)}
    {[-70, -35, 0, 35, 70].map((a, i) => <path key={`b${i}`} transform={`rotate(${r1(a * abierto * 0.7)}) scale(0.7)`} d="M0 0 C -34 -30, -30 -110, 0 -140 C 30 -110, 34 -30, 0 0 Z" fill={i % 2 ? PH.blanco : '#F8D6DC'} stroke={N} strokeWidth={1.6} />)}
    <ellipse cx={0} cy={-6} rx={60} ry={16} fill={PH.amarillo} stroke={N} strokeWidth={1.6} />
    <path d="M-160 4 C -80 -14, 80 -14, 160 4 C 80 18, -80 18, -160 4 Z" fill={PH.verde} stroke={N} strokeWidth={1.6} />
  </g>
);
/** Árbol de los deseos (kalpavriksha): hojas de oro y frutos de joya. */
const Kalpavriksha: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g>
    <ArbolPahari x={x} y={y} s={s} f={f} flor={PH.amarillo} />
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>{Array.from({ length: 12 }, (_, i) => { const cx = -90 + azar(i + 20) * 180, cy = -170 - azar(i + 30) * 130; return <g key={i}><circle cx={cx} cy={cy} r={16} fill="url(#phBrillo)" opacity={0.5 + Math.sin(f / 7 + i) * 0.3} /><path d={`M${r1(cx)} ${r1(cy - 8)} l 6 8 l -6 8 l -6 -8 Z`} fill={[PH.rojo, PH.verde, PH.azul, PH.blanco][i % 4]} stroke={N} strokeWidth={0.8} /></g>; })}</g>
  </g>
);
/** Huevo de oro (Hiranyagarbha) que flota y brilla. */
const HuevoOro: React.FC<{ x: number; y?: number; s?: number; f: number; abierto?: boolean }> = ({ x, y = 420, s = 1, f, abierto }) => (
  <g transform={`translate(${r1(x)} ${r1(y + Math.sin(f / 20) * 10)}) scale(${s})`}>
    <circle r={260} fill="url(#phBrillo)" opacity={0.5 + Math.sin(f / 10) * 0.15} />
    {abierto ? <><path d="M-90 10 C -90 -100, -40 -150, 0 -150 C 20 -150, 0 -110, 14 -90 C -10 -70, 20 -40, -6 -20 C 14 0, -10 10, -90 10 Z" fill={PH.oro} stroke={N} strokeWidth={2.4} transform="translate(-30 -10) rotate(-14)" /><path d="M90 10 C 90 -100, 40 -150, 0 -150 C 20 -110, 14 -90, 14 -90 C -10 -70, 20 -40, -6 -20 C 14 0, -10 10, 90 10 Z" fill={PH.oro} stroke={N} strokeWidth={2.4} transform="translate(30 -10) rotate(14)" /><circle cy={-60} r={40} fill={PH.blanco} opacity={0.9} /></>
      : <><ellipse cx={0} cy={-70} rx={92} ry={124} fill={PH.oro} stroke={N} strokeWidth={2.6} /><ellipse cx={-28} cy={-120} rx={22} ry={40} fill={PH.amarillo} opacity={0.8} />{[0, 1, 2].map((k) => <path key={k} d={`M${-80 + k * 6} ${-40 - k * 40} C -30 ${-50 - k * 40}, 30 ${-50 - k * 40}, ${80 - k * 6} ${-40 - k * 40}`} stroke={PH.oroOsc} strokeWidth={2} fill="none" />)}</>}
  </g>
);
/** Los Vedas: cuatro manuscritos que brillan. */
const Vedas: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y + Math.sin(f / 16) * 6)}) scale(${s})`}>
    <circle cx={0} cy={-60} r={110} fill="url(#phBrillo)" opacity={0.6} />
    {[0, 1, 2, 3].map((k) => <g key={k} transform={`translate(0 ${-20 - k * 26})`}><rect x={-60} y={-10} width={120} height={20} rx={4} fill={PH.crema2} stroke={N} strokeWidth={1.6} /><rect x={-8} y={-12} width={16} height={24} fill={[PH.rojo, PH.verde, PH.lapis, PH.azafran][k]} stroke={N} strokeWidth={1} /></g>)}
  </g>
);
/** Joya que brilla (Kaustubha). */
const Joya: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO - 200, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y + Math.sin(f / 12) * 8)}) scale(${s})`}>
    <circle r={70} fill="url(#phBrillo)" opacity={0.7} />
    <path d="M0 -40 L 34 -10 L 0 40 L -34 -10 Z" fill={PH.rojo} stroke={N} strokeWidth={2} /><path d="M-34 -10 H 34 M0 -40 L -12 -10 L 0 40 L 12 -10 Z" stroke={PH.blanco} strokeWidth={1.4} fill="none" opacity={0.7} />
  </g>
);
/** Choza de ermita (techo de paja). */
const Cabana: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-120} y={-160} width={240} height={160} fill="#D9B884" stroke={N} strokeWidth={2} />
    <path d="M-40 0 V -110 H 40 V 0 Z" fill="#5A3A20" stroke={N} strokeWidth={1.6} />
    <path d="M-160 -150 L 0 -280 L 160 -150 Z" fill="#C9A24A" stroke={N} strokeWidth={2} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-150 + i * 26} -152 L ${-6 + i * 1} -276`} stroke="#9A7A2A" strokeWidth={1.4} />)}
  </g>
);
/** Piel de tigre en el suelo (asiento de Shiva al meditar). */
const PielTigre: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-120 0 C -130 -14, -100 -26, -60 -24 L 60 -24 C 100 -26, 130 -14, 120 0 Z" fill={PH.azafran} stroke={N} strokeWidth={1.8} />
    {[-80, -40, 0, 40, 80].map((cx) => <path key={cx} d={`M${cx} -22 q 6 10 0 20`} stroke={N} strokeWidth={4} fill="none" />)}
  </g>
);
/** Lluvia de oro / de flores (bendición de los dioses). */
const LluviaOro: React.FC<{ x: number; f: number; n?: number }> = ({ x, f, n = 30 }) => (
  <g>{Array.from({ length: n }, (_, i) => { const xx = x - 900 + azar(i) * 1800, yy = 140 + ((f * (2 + azar(i + 3) * 2) + azar(i + 7) * 700) % 700); return <Florcita key={i} x={xx + Math.sin(f / 10 + i) * 14} y={yy} r={6} c={[PH.rosa, PH.amarillo, PH.blanco][i % 3]} />; })}</g>
);
/** Veneno halahala: humo negro y verde que sube del agua, en remolinos. */
const Halahala: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO - 60, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <ellipse cx={0} cy={-200} rx={260} ry={300} fill="#2A4A2A" opacity={0.25 + Math.sin(f / 8) * 0.08} />
    {Array.from({ length: 9 }, (_, i) => { const t = ((f * 1.2 + i * 50) % 450) / 450, cx = Math.sin(i * 2.1 + f / 30) * (60 + t * 140), cy = -t * 600; return <g key={i} opacity={0.9 - t * 0.5}><circle cx={cx} cy={cy} r={50 + t * 90} fill={i % 2 ? '#1E2A22' : '#2E3A2A'} /><path d={`M${r1(cx - 20)} ${r1(cy)} a 20 20 0 1 1 20 20`} stroke="#7AC05A" strokeWidth={4} fill="none" opacity={0.7} /></g>; })}
    <path d="M-120 0 C -60 -40, 60 -40, 120 0" stroke="#7AC05A" strokeWidth={6} fill="none" opacity={0.6} />
  </g>
);

// ---------- elementos grandes de una pieza ----------
const ficha = (k: string) => ((ELENCO_HINDU[k] as { p?: Partial<PersonajeProps> }).p ?? {});
/** Vishnu dormido sobre la serpiente Shesha en el océano; loto = tallo del ombligo con Brahma; lakshmi = a sus pies. */
const VishnuShesha: React.FC<{ x: number; y?: number; s?: number; f: number; loto?: boolean; lakshmi?: boolean; dormido?: boolean }> = ({ x, y = SUELO - 40, s = 1, f, loto, lakshmi = true, dormido = true }) => {
  const sh = '#5A6E9A', panza = '#E9DCC4';
  const respira = Math.sin(f / 30) * 3;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      {/* capuchas de Shesha en abanico sobre la cabeza */}
      <g transform="translate(-300 -150)">
        {Array.from({ length: 7 }, (_, i) => { const a = -70 + i * (140 / 6), ra = (a * Math.PI) / 180; return <g key={i} transform={`translate(${r1(Math.sin(ra) * 110)} ${r1(-Math.cos(ra) * 110)}) rotate(${r1(a * 0.8)})`}>
          <path d="M0 40 C -34 30, -38 -16, -18 -38 C -8 -48, 8 -48, 18 -38 C 38 -16, 34 30, 0 40 Z" fill={sh} stroke={N} strokeWidth={2} />
          <path d="M0 30 C -18 22, -20 -8, -8 -22 C -3 -27, 3 -27, 8 -22 C 20 -8, 18 22, 0 30 Z" fill={panza} />
          <path d="M-10 -40 C -4 -54, 4 -54, 10 -40" fill={sh} stroke={N} strokeWidth={1.4} /><circle cx={0} cy={-52} r={3.4} fill={PH.rojo} stroke={PH.oro} strokeWidth={1.2} />
        </g>; })}
        <path d="M-10 60 C -10 20, 0 0, 0 -20" stroke={sh} strokeWidth={50} fill="none" />
      </g>
      {/* cuerpo de Shesha enroscado: el lecho */}
      {[0, 1, 2].map((k) => <g key={k}><ellipse cx={-20 + k * 10} cy={-20 - k * 36} rx={330 - k * 20} ry={34} fill={sh} stroke={N} strokeWidth={2.4} /><ellipse cx={-20 + k * 10} cy={-14 - k * 36} rx={300 - k * 20} ry={12} fill="none" stroke={panza} strokeWidth={5} strokeDasharray="12 8" /></g>)}
      <path d="M300 -40 C 360 -40, 380 -10, 420 -20" stroke={sh} strokeWidth={22} fill="none" strokeLinecap="round" />
      {/* Vishnu acostado (el muñeco girado: cabeza a la izquierda, mirando arriba) */}
      <g transform={`translate(110 ${r1(-110 + respira * 0.3)}) rotate(-90) scale(0.85)`}>
        <Personaje {...ficha('vishnu')} x={0} y={0} s={1} accion="parado" ojosCerrados={dormido} brazo={[30, 40]} brazoAtras={[10, 20]} />
      </g>
      {/* tallo del ombligo y loto con Brahma */}
      {loto && <g>
        <path d="M-40 -150 C -30 -260, -90 -330, -60 -440" stroke={PH.verde} strokeWidth={8} fill="none" />
        <g transform="translate(-60 -440) scale(0.5)">{[-70, -35, 0, 35, 70].map((a, i) => <path key={i} transform={`rotate(${a})`} d="M0 0 C -34 -30, -30 -110, 0 -140 C 30 -110, 34 -30, 0 0 Z" fill={i % 2 ? '#F2B8C2' : PH.rosa} stroke={N} strokeWidth={2} />)}</g>
        <g transform="translate(-60 -452)"><Personaje {...ficha('brahma')} x={0} y={0} s={0.34} accion="parado" sentado={1} /></g>
      </g>}
      {lakshmi && <g transform="translate(330 -96)"><Personaje {...ficha('lakshmi')} x={0} y={0} s={0.62} voltear accion="parado" sentado={1} brazo={[70, 40]} /></g>}
    </g>
  );
};
/** Pilar de fuego sin fin (el relato del Shiva Purana): columna de llamas que atraviesa el cielo y la tierra. */
const PilarFuego: React.FC<{ x: number; y?: number; s?: number; f: number; luz?: number }> = ({ x, y = SUELO + 40, s = 1, f, luz = 1 }) => {
  const w = 90;
  const borde = (lado: number) => `M${lado * w} 0 ` + Array.from({ length: 24 }, (_, i) => `L ${r1(lado * (w + 14 + Math.sin(f / 3 + i * 1.7) * 12))} ${-i * 50 - 25} L ${lado * w} ${-i * 50 - 50}`).join(' ');
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <rect x={-w * 3} y={-1300} width={w * 6} height={1400} fill="url(#phBrillo)" opacity={0.45 * luz} />
      <path d={borde(-1) + ` V -1300 H ${w} V 0 Z`} fill={PH.azafran} />
      <path d={borde(1)} fill="none" stroke={PH.azafran} strokeWidth={4} />
      <path d={borde(1) + ` V -1300 H 0 V 0 Z`} fill={PH.azafran} />
      <rect x={-w * 0.7} y={-1300} width={w * 1.4} height={1300} fill={PH.amarillo} />
      <rect x={-w * 0.3} y={-1300} width={w * 0.6} height={1300} fill={PH.blanco} opacity={0.9} />
      {Array.from({ length: 10 }, (_, i) => { const t = ((f * 3 + i * 130) % 1300); return <circle key={i} cx={Math.sin(i * 3 + f / 10) * w * 0.5} cy={-t} r={8} fill={PH.blanco} opacity={0.8} />; })}
    </g>
  );
};
/** El batido del océano: Kurma debajo, el monte Mandara de batidor, Vasuki enroscada con la cabeza a la izquierda
 * (los asuras) y la cola a la derecha (los dioses). hunde 0–1: el monte se hunde y se ladea. veneno: sube humo negro. */
const Batido: React.FC<{ x: number; y?: number; s?: number; f: number; kurma?: boolean; hunde?: number; gira?: boolean; largo?: number; veneno?: boolean }> = ({ x, y = SUELO - 70, s = 1, f, kurma = true, hunde = 0, gira = true, largo = 820, veneno }) => {
  const id = `phm${Math.round(x)}`;
  const rot = gira ? f * 2.2 : 0;
  const tira = gira ? Math.sin(f / 9) * 24 : 0;
  const yS = -230; // altura de la soga (para que la agarren de pie)
  const vas = '#3E7D4A', panza = '#E9C77A';
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      {veneno && <Halahala x={0} y={0} s={1.1} f={f} />}
      {kurma && <g transform="translate(-40 40) scale(0.9)"><g transform="translate(0 0)">{/* caparazón que asoma */}<path d="M-210 0 C -200 -150, 200 -150, 210 0 Z" fill={PH.oro} stroke={N} strokeWidth={3} /><path d="M-186 -6 C -176 -130, 176 -130, 186 -6 Z" fill="#5E8C5A" stroke={N} strokeWidth={2} />{[[-100, -60], [0, -84], [100, -60]].map(([cx, cy], i) => <path key={i} d={`M${cx - 24} ${cy} l 12 -18 h 24 l 12 18 l -12 18 h -24 Z`} fill="none" stroke={PH.amarillo} strokeWidth={2.4} />)}</g></g>}
      <g transform={`translate(0 ${r1(hunde * 120)}) rotate(${r1(hunde * 14)} 0 -60)`}>
        {/* monte Mandara */}
        <defs><clipPath id={id}><path d="M-60 -60 C -150 -200, -200 -420, -150 -620 C -110 -760, 110 -760, 150 -620 C 200 -420, 150 -200, 60 -60 Z" /></clipPath></defs>
        <path d="M-60 -60 C -150 -200, -200 -420, -150 -620 C -110 -760, 110 -760, 150 -620 C 200 -420, 150 -200, 60 -60 Z" fill="#9A94A8" stroke={N} strokeWidth={3} /><path d="M-120 -600 C -90 -720, 60 -740, 110 -640 M-150 -420 C -150 -300, -110 -180, -60 -80" stroke={PH.blanco} strokeWidth={5} fill="none" opacity={0.6} />
        <g clipPath={`url(#${id})`}>
          {Array.from({ length: 8 }, (_, r) => Array.from({ length: 7 }, (_, i) => { const xx = ((i * 90 + rot * (1 + r * 0.05)) % 630) - 315, yy = -110 - r * 80; return <g key={`${r}-${i}`}><path d={`M${r1(xx)} ${yy} c -12 -6 -12 -44 0 -64 c 12 20 12 58 0 64 Z`} fill="#2F5A2A" stroke={N} strokeWidth={1} /><path d={`M${r1(xx + 40)} ${yy - 4} v -14`} stroke="#5A3A20" strokeWidth={3} /><circle cx={xx + 40} cy={yy - 30} r={16} fill="#3F6A28" stroke={N} strokeWidth={1} /><circle cx={xx + 36} cy={yy - 34} r={3} fill={PH.rosa} /></g>; }))}
        </g>
        {/* espiras de Vasuki alrededor del monte */}
        {[-300, -420, -540].map((yy, k) => <g key={k}><path d={`M-170 ${yy + 40} C -60 ${yy + 80}, 60 ${yy}, 170 ${yy - 30}`} stroke={N} strokeWidth={34} fill="none" strokeLinecap="round" /><path d={`M-170 ${yy + 40} C -60 ${yy + 80}, 60 ${yy}, 170 ${yy - 30}`} stroke={vas} strokeWidth={28} fill="none" strokeLinecap="round" /><path d={`M-170 ${yy + 40} C -60 ${yy + 80}, 60 ${yy}, 170 ${yy - 30}`} stroke={panza} strokeWidth={8} fill="none" strokeDasharray="10 10" strokeDashoffset={-rot} /></g>)}
      </g>
      {/* la soga: de la espira de abajo hacia los dos lados */}
      {[-1, 1].map((lado) => { const d = `M${lado * 60} ${yS + 20} C ${lado * 300} ${yS + 40 + tira * lado}, ${lado * (largo - 200)} ${yS - 10 - tira * lado}, ${lado * largo} ${yS}`; return <g key={lado}><path d={d} stroke={N} strokeWidth={34} fill="none" strokeLinecap="round" /><path d={d} stroke={vas} strokeWidth={28} fill="none" strokeLinecap="round" /><path d={d} stroke={panza} strokeWidth={8} fill="none" strokeDasharray="10 10" strokeDashoffset={lado * rot} transform="translate(0 6)" /></g>; })}
      {/* cabeza de Vasuki (izquierda) con su aliento caliente; punta de la cola (derecha) */}
      <g transform={`translate(${-largo - 10} ${yS}) scale(-1 1)`}>
        <path d="M0 22 C -30 16, -40 -20, -20 -36 C -10 -46, 10 -46, 20 -36 C 40 -20, 30 16, 0 22 Z" transform="translate(10 -10)" fill={vas} stroke={N} strokeWidth={2} />
        <path d="M0 -6 C 16 -10, 34 -8, 44 0 C 34 8, 16 8, 0 6 Z" transform="translate(20 -10)" fill={vas} stroke={N} strokeWidth={1.6} />
        <circle cx={40} cy={-16} r={3} fill={PH.amarillo} stroke={N} strokeWidth={1} />
        {gira && [0, 1, 2].map((k) => { const t = ((f * 2 + k * 20) % 60) / 60; return <circle key={k} cx={70 + t * 120} cy={-10 - t * 20} r={10 + t * 20} fill="#5A5048" opacity={0.6 - t * 0.5} />; })}
      </g>
      <path d={`M${largo} ${yS} l 40 -10 l -6 14 Z`} fill={vas} stroke={N} strokeWidth={1.6} />
    </g>
  );
};

// ---------- fondos ----------
export function fondoHindu(tipo: string, f: number, astros = true): React.ReactNode | null {
  switch (tipo) {
    case 'oceano_cosmico': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="phNoche" nubes={false} f={f} /></Capa>
        <Capa p={0.05}>{astros && <Estrellas f={f} n={30} />}</Capa>
        <Capa p={0.4}><AguaPahari y={SUELO - 130} f={f * 0.3} oscura desde={-1800} hasta={4400} /></Capa>
        <Capa p={1}><AguaPahari y={SUELO - 20} f={f * 0.6} oscura desde={-1800} hasta={6400} /></Capa>
      </>
    );
    case 'oceano_leche': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="phLeche" f={f} /></Capa>
        <Capa p={0.1}>{astros && <SolPahari x={1650} y={250} r={42} f={f} />}</Capa>
        <Capa p={0.2}>{[[200, 330], [1000, 300], [1900, 340]].map(([x, y], i) => <NubeRizada key={i} x={x} y={y} s={0.8} f={f} />)}</Capa>
        <Capa p={0.45}><AguaPahari y={SUELO - 160} f={f * 0.35} leche desde={-1800} hasta={4600} /></Capa>
        <Capa p={1}><AguaPahari y={SUELO - 40} f={f * 0.6} leche desde={-1800} hasta={6400} /><rect x={-1800} y={SUELO + 10} width={8200} height={300} fill="#E9DCC4" /><path d={`M-1800 ${SUELO + 10} H 6400`} stroke={N} strokeWidth={3} />{Array.from({ length: 50 }, (_, i) => <circle key={i} cx={-1800 + i * 170 + 40} cy={SUELO + 30 + (i % 3) * 8} r={3} fill="#C9B48A" />)}</Capa>
      </>
    );
    case 'svarga': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="phOro" f={f} /></Capa>
        <Capa p={0.1}>{astros && <SolPahari x={1650} y={240} r={40} f={f} />}</Capa>
        <Capa p={0.25}>{[[-200, 560], [900, 540], [2000, 560]].map(([x, y], i) => <g key={i}><NubeRizada x={x} y={y + 60} s={2.4} f={f} /><Pabellon x={x} y={y} s={0.55} /></g>)}</Capa>
        <Capa p={0.6}>{[[300, 700], [1400, 690], [2500, 700]].map(([x, y], i) => <NubeRizada key={i} x={x} y={y} s={1.6} f={f} />)}</Capa>
        <Capa p={1}><SueloNubes f={f} /></Capa>
      </>
    );
    case 'kailash': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="phDia" f={f} /></Capa>
        <Capa p={0.08}>{astros && <LunaPahari x={1580} y={250} r={34} />}</Capa>
        <Capa p={0.18}><KailashPico x={1050} y={SUELO - 80} s={1.1} /><KailashPico x={200} y={SUELO - 80} s={0.6} /><KailashPico x={2000} y={SUELO - 80} s={0.7} /></Capa>
        <Capa p={0.5}>{[-300, 200, 800, 1500, 2100, 2700].map((x, i) => <CipresPahari key={i} x={x} y={SUELO - 20} s={0.6} />)}{[500, 1800].map((x, i) => <RocaPahari key={i} x={x} y={SUELO - 20} s={0.9} />)}</Capa>
        <Capa p={1}><SueloNieve /></Capa>
      </>
    );
    case 'bosque_pahari': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="phDia" f={f} /></Capa>
        <Capa p={0.1}>{astros && <SolPahari x={1600} y={240} r={38} f={f} cara={false} />}</Capa>
        <Capa p={0.2}><Colina x={300} y={SUELO - 60} w={900} h={300} c="#8FB06A" seed={2} /><Colina x={1400} y={SUELO - 60} w={1100} h={340} c="#7FA05A" seed={3} /><Colina x={2500} y={SUELO - 60} w={900} h={280} c="#8FB06A" seed={4} /></Capa>
        <Capa p={0.45}>{[-200, 300, 900, 1500, 2100, 2700].map((x, i) => i % 2 ? <CipresPahari key={i} x={x} y={SUELO - 30} s={0.7} /> : <ArbolPahari key={i} x={x} y={SUELO - 30} s={0.75} f={f} />)}</Capa>
        <Capa p={0.8}>{[-100, 800, 1700, 2600, 3500].map((x, i) => i % 2 ? <Banano key={i} x={x} y={SUELO} s={1} f={f} /> : <ArbolPahari key={i} x={x} y={SUELO} s={1.05} f={f + i * 10} flor={i % 3 ? PH.rosa : PH.blanco} />)}</Capa>
        <Capa p={1}><SueloPahari desde={-1600} hasta={6400} /></Capa>
      </>
    );
    case 'orilla_rio': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="phDia" f={f} /></Capa>
        <Capa p={0.1}>{astros && <SolPahari x={1620} y={240} r={38} f={f} cara={false} />}</Capa>
        <Capa p={0.2}><Colina x={600} y={SUELO - 160} w={1300} h={260} c="#8FB06A" seed={5} /><Colina x={2100} y={SUELO - 160} w={1100} h={240} c="#9ABA74" seed={6} /></Capa>
        <Capa p={0.4}><AguaPahari y={SUELO - 160} f={f * 0.4} desde={-1600} hasta={4600} lotos /></Capa>
        <Capa p={0.75}>{[-200, 1300, 2600].map((x, i) => <ArbolPahari key={i} x={x} y={SUELO - 20} s={0.9} f={f} />)}{[600, 2000].map((x, i) => <Mata key={i} x={x} y={SUELO - 10} s={2} />)}</Capa>
        <Capa p={1}><SueloPahari desde={-1600} hasta={6400} /></Capa>
      </>
    );
    case 'palacio_pahari': case 'palacio_noche': case 'crepusculo': {
      const noche = tipo === 'palacio_noche', ocaso = tipo === 'crepusculo';
      return (
        <>
          <Degrades />
          <Capa p={0}><Cielo id={noche ? 'phNoche' : ocaso ? 'phOcaso' : 'phDia'} nubes={!noche} f={f} /></Capa>
          <Capa p={0.06}>{astros && (noche ? <><Estrellas f={f} n={24} area={[-200, 140, 2400, 260]} /><LunaPahari x={1580} y={240} r={40} /></> : ocaso ? <SolPahari x={1500} y={560} r={70} f={f} cara={false} luz={0.8} /> : <SolPahari x={1650} y={230} r={38} f={f} cara={false} />)}</Capa>
          <Capa p={0.25}><Palacio x={1000} y={SUELO - 70} s={0.85} noche={noche} ocaso={ocaso} />{[-200, 2200].map((x, i) => <CipresPahari key={i} x={x} y={SUELO - 70} s={0.8} />)}</Capa>
          <Capa p={0.55}>{[-300, 2300].map((x, i) => <Pabellon key={i} x={x} y={SUELO - 20} s={0.7} noche={noche} />)}{[400, 1700].map((x, i) => <CipresPahari key={i} x={x} y={SUELO - 20} s={0.7} />)}</Capa>
          <Capa p={1}><Terraza noche={noche} /></Capa>
        </>
      );
    }
    case 'patala': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="phPatala" nubes={false} f={f} /></Capa>
        <Capa p={0.2}>{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-600 + i * 300} 120 L ${-520 + i * 300} ${340 + azar(i) * 160} L ${-440 + i * 300} 120 Z`} fill="#3A1E40" stroke={N} strokeWidth={2} />)}</Capa>
        <Capa p={0.4}><Palacio x={1000} y={SUELO - 60} s={0.7} noche /></Capa>
        <Capa p={0.7}>{Array.from({ length: 8 }, (_, i) => <g key={i} transform={`translate(${-200 + i * 520} ${SUELO - 30})`}><circle r={30} fill="url(#phBrillo)" opacity={0.5 + Math.sin(f / 8 + i) * 0.2} /><path d="M0 -14 l 10 14 l -10 12 l -10 -12 Z" fill={[PH.rojo, PH.verde, PH.azulClaro][i % 3]} stroke={N} strokeWidth={1} /></g>)}</Capa>
        <Capa p={1}><SueloPatala f={f} /></Capa>
      </>
    );
    case 'cielo_cosmico': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="phNoche" nubes={false} f={f} /></Capa>
        <Capa p={0.05}><Estrellas f={f} n={60} area={[-400, 130, 3000, 680]} /></Capa>
        <Capa p={0.4}>{[[-200, 760], [700, 740], [1600, 770], [2500, 750]].map(([x, y], i) => <NubeRizada key={i} x={x} y={y} s={2} f={f} oscura />)}</Capa>
        <Capa p={1}><SueloNubes f={f} /><rect x={-1600} y={SUELO + 6} width={8000} height={260} fill="#3A4A7A" opacity={0.55} /></Capa>
      </>
    );
    case 'diluvio': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="phTormenta" f={f} rayos /></Capa>
        <Capa p={0.2}>{[[100, 300], [800, 260], [1500, 320], [2200, 280]].map(([x, y], i) => <NubeRizada key={i} x={x} y={y} s={1.3} f={f} oscura />)}</Capa>
        <Capa p={0.45}><AguaPahari y={SUELO - 180} f={f * 0.8} desde={-1800} hasta={4600} /></Capa>
        <Capa p={1}><AguaPahari y={SUELO - 50} f={f * 1.3} desde={-1800} hasta={6400} /></Capa>
      </>
    );
    case 'campo_pahari': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="phDia" f={f} /></Capa>
        <Capa p={0.1}>{astros && <SolPahari x={1620} y={240} r={40} f={f} cara={false} />}</Capa>
        <Capa p={0.2}><Colina x={200} y={SUELO - 70} w={1000} h={320} seed={7} /><Colina x={1300} y={SUELO - 70} w={900} h={260} c="#8FB06A" seed={8} /><Colina x={2400} y={SUELO - 70} w={1100} h={300} seed={9} /></Capa>
        <Capa p={0.5}>{Array.from({ length: 10 }, (_, i) => <rect key={i} x={-600 + i * 400} y={SUELO - 60} width={380} height={40} fill={i % 2 ? '#C9B45A' : '#9ABA5A'} stroke={N} strokeWidth={1.4} />)}<Cabana x={1100} y={SUELO - 40} s={0.5} /><Mango x={700} y={SUELO - 40} s={0.6} f={f} /></Capa>
        <Capa p={0.8}>{[-100, 1600, 3300].map((x, i) => <ArbolPahari key={i} x={x} y={SUELO} s={1} f={f} />)}</Capa>
        <Capa p={1}><SueloPahari desde={-1600} hasta={6400} /></Capa>
      </>
    );
    case 'ashram': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="phDia" f={f} /></Capa>
        <Capa p={0.1}>{astros && <SolPahari x={1620} y={240} r={38} f={f} cara={false} />}</Capa>
        <Capa p={0.2}><KailashPico x={1400} y={SUELO - 110} s={0.7} /><Colina x={300} y={SUELO - 70} w={1000} h={280} c="#8FB06A" seed={11} /></Capa>
        <Capa p={0.5}><Cabana x={300} y={SUELO - 40} s={0.7} />{[900, 1900, 2600].map((x, i) => <ArbolPahari key={i} x={x} y={SUELO - 30} s={0.8} f={f} flor={PH.blanco} />)}</Capa>
        <Capa p={0.85}>{[-200, 1500, 3000].map((x, i) => <Banano key={i} x={x} y={SUELO} s={0.9} f={f} />)}</Capa>
        <Capa p={1}><SueloPahari desde={-1600} hasta={6400} /></Capa>
      </>
    );
    default: return null;
  }
}

// ---------- elementos ----------
export function elementoHindu(tipo: string, x: number, y: number | undefined, s: number, f: number, props: Record<string, unknown> = {}): React.ReactNode | null {
  const yy = y ?? SUELO;
  const b = (k: string) => props[k] === true;
  const n = (k: string, d: number) => (typeof props[k] === 'number' ? (props[k] as number) : d);
  switch (tipo) {
    case 'vishnu_shesha': return <VishnuShesha x={x} y={y ?? SUELO - 40} s={s} f={f} loto={b('loto')} lakshmi={props.lakshmi !== false} dormido={props.dormido !== false} />;
    case 'pilar_fuego': return <PilarFuego x={x} y={y ?? SUELO + 40} s={s} f={f} luz={n('luz', 1)} />;
    case 'batido': return <Batido x={x} y={y ?? SUELO - 70} s={s} f={f} kurma={props.kurma !== false} hunde={n('hunde', 0)} gira={props.gira !== false} largo={n('largo', 820)} veneno={b('veneno')} />;
    case 'halahala': return <Halahala x={x} y={y ?? SUELO - 60} s={s} f={f} />;
    case 'kalasha': return <g transform={`translate(${r1(x)} ${r1(y ?? SUELO)})`}><Kalasha2 s={s * 1.6} f={f} brillo={props.brillo !== false} /></g>;
    case 'loto': return <Loto x={x} y={yy} s={s} f={f} abierto={n('abierto', 1)} />;
    case 'kalpavriksha': return <Kalpavriksha x={x} y={yy} s={s} f={f} />;
    case 'huevo_oro': return <HuevoOro x={x} y={y ?? 420} s={s} f={f} abierto={b('abierto')} />;
    case 'vedas': return <Vedas x={x} y={yy} s={s} f={f} />;
    case 'joya': return <Joya x={x} y={y ?? SUELO - 200} s={s} f={f} />;
    case 'arbol_pahari': case 'arbol': case 'olivo': return <ArbolPahari x={x} y={yy} s={s} f={f} flor={(props.flor as string) ?? PH.rosa} />;
    case 'cipres_pahari': case 'cipres': case 'pino': return <CipresPahari x={x} y={yy} s={s} />;
    case 'banano': case 'palmera': return <Banano x={x} y={yy} s={s} f={f} />;
    case 'mango': return <Mango x={x} y={yy} s={s} f={f} />;
    case 'pabellon': case 'templo': return <Pabellon x={x} y={yy} s={s} noche={b('noche')} />;
    case 'palacio': case 'casa': return <Palacio x={x} y={yy} s={s} noche={b('noche')} />;
    case 'pilar': case 'columna': return <Pilar x={x} y={yy} s={s} f={f} rota={b('rota')} />;
    case 'puerta_palacio': case 'puerta': return <PuertaPalacio x={x} y={yy} s={s} noche={b('noche')} />;
    case 'trono_indio': case 'trono': return <TronoIndio x={x} y={yy} s={s} />;
    case 'yajna': case 'altar': case 'fogata': return <Yajna x={x} y={yy} s={s} f={f} fuego={props.fuego !== false} />;
    case 'mandap': return <Mandap x={x} y={yy} s={s} />;
    case 'kailash_pico': case 'monte': return <KailashPico x={x} y={yy} s={s} />;
    case 'colina': return <Colina x={x} y={yy} w={700 * s} h={260 * s} />;
    case 'roca_pahari': case 'roca': return <RocaPahari x={x} y={yy} s={s} />;
    case 'estanque': case 'rio': return <Estanque x={x} y={yy} s={s} f={f} />;
    case 'barco_manu': case 'barco': return <BarcoManu x={x} y={y ?? SUELO - 30} s={s} f={f} soga={typeof props.soga === 'number' ? (props.soga as number) : undefined} />;
    case 'cuenco': return <Cuenco x={x} y={yy} s={s} f={f} pez={props.pez !== false} />;
    case 'sol_pahari': case 'sol': return <SolPahari x={x} y={y ?? 240} r={60 * s} f={f} cara={props.cara !== false} eclipse={n('eclipse', 0)} luz={n('luz', 1)} />;
    case 'luna_pahari': case 'luna': return <LunaPahari x={x} y={y ?? 240} r={50 * s} llena={b('llena')} eclipse={n('eclipse', 0)} />;
    case 'nube_rizada': case 'nube': return <NubeRizada x={x} y={y ?? 300} s={s} f={f} oscura={b('oscura')} />;
    case 'estrellas_pahari': case 'estrellas': return <Estrellas f={f} n={n('n', 30)} area={[x - 900, y ?? 150, 1800, 340]} />;
    case 'cabana': return <Cabana x={x} y={yy} s={s} />;
    case 'piel_tigre': return <PielTigre x={x} y={yy} s={s} />;
    case 'lluvia_oro': return <LluviaOro x={x} f={f} n={n('n', 30)} />;
    default: return null;
  }
}
/** Vasija del néctar como elemento suelto (en el suelo o flotando). */
const Kalasha2: React.FC<{ s: number; f: number; brillo: boolean }> = ({ s, f, brillo }) => (
  <g transform={`scale(${s})`}>
    {brillo && <circle cx={0} cy={-26} r={50 + Math.sin(f / 6) * 4} fill="url(#phBrillo)" opacity={0.9} />}
    <path d="M-20 -8 C -28 -30, -14 -44, -8 -46 L -10 -52 L 10 -52 L 8 -46 C 14 -44, 28 -30, 20 -8 C 14 2, -14 2, -20 -8 Z" fill={PH.oro} stroke={N} strokeWidth={1.6} />
    <path d="M-22 -24 H 22" stroke={PH.rojo} strokeWidth={3} />
    <path d="M-10 -52 C -14 -64, -4 -70, 0 -60 C 4 -70, 14 -64, 10 -52 Z" fill={PH.verde} stroke={N} strokeWidth={1} />
  </g>
);
