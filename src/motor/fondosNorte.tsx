// Piel norteamericana (tema "pintado"): fondos y elementos al estilo de la pintura sobre cuero y el arte
// ledger — figuras planas con contorno oscuro, cielo de cuero claro, ocre, azul de cuentas, verdes de bosque.
// Cada nación tiene sus lugares: mundo del cielo y agua primordial (haudenosaunee), bosque y casas comunales
// (Bosques del Este), praderas con tipis (Llanuras), casas de tablones y postes tallados (costa noroeste).
import React from 'react';
import { C, Capa, SUELO, Nube, Luna, Estrellas, Sol, Fuego, suave, Inc, azar } from '../comun/vasija';

export const N = {
  cuero: '#E9D4A8', ocre: '#C98A3A', rojo: '#B23A24', hollin: '#1C1612', azul: '#2F5D8A', azulClaro: '#7FB0C8',
  turquesa: '#3A9A8C', verde: '#4E7A3A', verdeOsc: '#2E4A2A', verdeClaro: '#8AAA4E', pino: '#2F4A36', pinoClaro: '#4A6A4A',
  tierra: '#8A5A34', tierraOsc: '#5A3820', corteza: '#7A5A3A', cortezaOsc: '#4E3A26', blanco: '#FCF7EC', nube: '#FFFDF6',
  agua: '#3F7F9A', aguaOsc: '#1F4A66', aguaClara: '#9CCBD0', maiz: '#E8B83A', cedro: '#8A3A24', roca: '#6E625A',
};
const n1 = (v: number) => v.toFixed(1);

// ---------- suelos ----------
type TipoSueloN = 'tierra' | 'hierba' | 'nube' | 'arena' | 'oscuro' | 'pradera' | 'lodo';
const SUELOS_N: Record<TipoSueloN, [string, string]> = {
  tierra: [N.tierra, N.tierraOsc], hierba: ['#5E7E3A', '#3E5A2A'], nube: ['#FBF8F0', '#B9D2DC'], arena: ['#C9AE80', '#9A7E54'], oscuro: ['#1A1612', '#3A3028'], pradera: ['#A8A04E', '#6E6A2E'], lodo: ['#2A3430', '#44524A'],
};
/** Suelo pintado: franja con trazos de pincel (pasto, hojas, piedritas) o banco de nubes. */
export const SueloN: React.FC<{ tipo?: TipoSueloN; desde?: number; hasta?: number }> = ({ tipo = 'tierra', desde: x0 = -1600, hasta = 6000 }) => {
  const [base, trazo] = SUELOS_N[tipo];
  const n = Math.ceil((hasta - x0) / 60);
  if (tipo === 'nube') return (
    <g>
      <path d={`M${x0} ${SUELO + 6} ` + Array.from({ length: n }, (_, i) => `q 30 ${-18 - azar(i) * 14} 60 0`).join(' ') + ` V ${SUELO + 260} H ${x0} Z`} fill={base} stroke={C.negro} strokeWidth={3} />
      {Array.from({ length: n }, (_, i) => <path key={i} d={`M${x0 + i * 60 + 12} ${SUELO + 26 + (i % 3) * 14} q 18 -8 36 0`} stroke={trazo} strokeWidth={3} fill="none" strokeLinecap="round" />)}
    </g>
  );
  return (
    <g>
      <rect x={x0} y={SUELO} width={hasta - x0} height={260} fill={base} />
      <rect x={x0} y={SUELO} width={hasta - x0} height={5} fill={C.negro} />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * 60 + azar(i) * 20;
        if (tipo === 'hierba' || tipo === 'pradera') return <path key={i} d={`M${n1(x)} ${SUELO + 26} l 4 -14 M${n1(x + 8)} ${SUELO + 26} l -2 -16 M${n1(x + 14)} ${SUELO + 26} l 6 -12`} stroke={trazo} strokeWidth={3} strokeLinecap="round" />;
        if (tipo === 'arena') return <circle key={i} cx={x} cy={SUELO + 18 + (i % 3) * 8} r={3} fill={trazo} />;
        return <path key={i} d={`M${n1(x)} ${SUELO + 20 + (i % 2) * 10} h 18`} stroke={trazo} strokeWidth={4} strokeLinecap="round" />;
      })}
    </g>
  );
};

/** Agua pintada: líneas paralelas onduladas (como el agua en la pintura sobre cuero). */
export const AguaPintada: React.FC<{ y: number; f: number; oscura?: boolean; desde?: number; hasta?: number }> = ({ y, f, oscura, desde: x0 = -1800, hasta = 6200 }) => {
  const filas = Math.ceil((1200 - y) / 34);
  return (
    <g>
      <rect x={x0} y={y} width={hasta - x0} height={1300 - y} fill={oscura ? N.aguaOsc : N.agua} />
      <path d={`M${x0} ${y}H${hasta}`} stroke={C.negro} strokeWidth={3} />
      {Array.from({ length: filas }, (_, r) => {
        const yy = y + 16 + r * 34, amp = 4 + r * 0.8, paso = 90 + r * 10, des = ((f * (0.6 + r * 0.15)) % (paso * 2));
        return <path key={r} d={`M${x0 - des} ${yy} ` + Array.from({ length: Math.ceil((hasta - x0) / paso) + 3 }, (_, i) => `q ${paso / 2} ${i % 2 ? amp : -amp} ${paso} 0`).join(' ')} stroke={oscura ? '#4F7A96' : N.aguaClara} strokeWidth={3} fill="none" opacity={0.8} strokeDasharray={r % 2 ? '60 30' : undefined} />;
      })}
    </g>
  );
};

// ---------- árboles ----------
export const PinoN: React.FC<{ x: number; y?: number; s?: number; color?: string }> = ({ x, y = SUELO, s = 1, color = N.pino }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-8} y={-50} width={16} height={50} fill={N.cortezaOsc} stroke={C.negro} strokeWidth={2} />
    {[0, 1, 2, 3, 4].map((i) => { const w = 92 - i * 16, yy = -40 - i * 56; return <path key={i} d={`M${-w} ${yy} L ${-w * 0.5} ${yy - 22} L ${-w * 0.62} ${yy - 24} L 0 ${yy - 104} L ${w * 0.62} ${yy - 24} L ${w * 0.5} ${yy - 22} L ${w} ${yy} Z`} fill={color} stroke={C.negro} strokeWidth={2.5} strokeLinejoin="round" />; })}
  </g>
);
export const ArceN: React.FC<{ x: number; y?: number; s?: number; color?: string; f?: number }> = ({ x, y = SUELO, s = 1, color = N.verde, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-14 0 L -10 -170 L -60 -230 M-10 -170 L 0 -260 M8 -150 L 60 -220 M10 0 L 12 -150" stroke={N.cortezaOsc} strokeWidth={16} strokeLinecap="round" fill="none" />
    <path d="M-12 0 C -10 -60, -10 -120, -6 -170 L 10 -170 C 12 -120, 14 -60, 16 0 Z" fill={N.corteza} stroke={C.negro} strokeWidth={2.5} />
    <g transform={`rotate(${Math.sin(f / 50) * 1.5} 0 -200)`}>
      <path d={suave([[-130, -190], [-150, -250], [-110, -310], [-50, -340], [20, -350], [90, -320], [140, -270], [150, -210], [110, -170], [40, -160], [-40, -160], [-100, -165]], true)} fill={color} stroke={C.negro} strokeWidth={3} />
      {[[-80, -260], [-20, -300], [50, -280], [100, -230], [-40, -210], [30, -210]].map(([cx, cy], i) => <path key={i} d={`M${cx - 18} ${cy} q 18 -14 36 0`} stroke={C.negro} strokeWidth={2} fill="none" opacity={0.45} />)}
    </g>
  </g>
);
export const AbedulN: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-9 0 L -6 -300 L 6 -300 L 9 0 Z" fill="#F2EEE4" stroke={C.negro} strokeWidth={2.5} />
    {[-40, -90, -130, -170, -220, -260].map((yy, i) => <path key={i} d={`M${i % 2 ? -8 : -2} ${yy} h ${8 + (i % 3) * 3}`} stroke={C.negro} strokeWidth={3} />)}
    <path d={suave([[-70, -250], [-80, -310], [-30, -360], [30, -362], [76, -316], [66, -256], [10, -236]], true)} fill={N.verdeClaro} stroke={C.negro} strokeWidth={2.5} />
  </g>
);
export const CedroN: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-16 0 L -6 -420 L 6 -420 L 16 0 Z" fill={N.cedro} stroke={C.negro} strokeWidth={2.5} />
    {Array.from({ length: 7 }, (_, i) => { const yy = -110 - i * 46, w = 120 - i * 14, m = Math.sin(f / 40 + i) * 3; return <g key={i}>
      <path d={`M0 ${yy} C ${-w * 0.5} ${yy - 20}, ${-w} ${yy + 10 + m}, ${-w - 10} ${yy + 40 + m} C ${-w * 0.7} ${yy + 26}, ${-w * 0.3} ${yy + 20}, 0 ${yy + 22} Z`} fill={N.pino} stroke={C.negro} strokeWidth={2} />
      <path d={`M0 ${yy} C ${w * 0.5} ${yy - 20}, ${w} ${yy + 10 - m}, ${w + 10} ${yy + 40 - m} C ${w * 0.7} ${yy + 26}, ${w * 0.3} ${yy + 20}, 0 ${yy + 22} Z`} fill={N.pinoClaro} stroke={C.negro} strokeWidth={2} />
    </g>; })}
    <path d="M0 -470 C -20 -440, -30 -420, -24 -400 L 24 -400 C 30 -420, 20 -440, 0 -470 Z" fill={N.pino} stroke={C.negro} strokeWidth={2} />
  </g>
);
/** El gran árbol del Mundo del Cielo: sus flores daban la luz (versión haudenosaunee). luz 0–1. */
export const ArbolCielo: React.FC<{ x: number; y?: number; s?: number; f: number; luz?: number }> = ({ x, y = SUELO, s = 1, f, luz = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-420} r={430} fill="url(#haloBlanco)" opacity={0.55 * luz} />
    {[-1, 1].map((k) => <path key={k} d={`M${k * 30} -6 C ${k * 90} 0, ${k * 150} 10, ${k * 210} 24 M${k * 20} -20 C ${k * 70} -10, ${k * 110} 4, ${k * 150} 30`} stroke={N.cortezaOsc} strokeWidth={20} fill="none" strokeLinecap="round" />)}
    <path d="M-62 0 C -46 -160, -40 -300, -30 -380 L 30 -380 C 40 -300, 46 -160, 62 0 Z" fill={N.corteza} stroke={C.negro} strokeWidth={3} />
    <Inc d="M-20 -40 C -12 -150, -10 -260, -16 -360 M14 -30 C 22 -140, 18 -260, 22 -360" w={2} c={N.cortezaOsc} />
    {[[-1, -360, 220], [1, -370, 240], [-1, -300, 170], [1, -310, 180]].map(([k, yy, l], i) => <path key={i} d={`M0 ${yy} C ${k * l * 0.4} ${yy - 50}, ${k * l * 0.8} ${yy - 80}, ${k * l} ${yy - 110}`} stroke={N.cortezaOsc} strokeWidth={16 - i * 2} fill="none" strokeLinecap="round" />)}
    <path d={suave([[-300, -400], [-320, -480], [-250, -580], [-130, -640], [0, -660], [140, -640], [260, -580], [320, -480], [300, -400], [200, -360], [60, -350], [-60, -350], [-200, -360]], true)} fill={N.verdeOsc} stroke={C.negro} strokeWidth={3.5} />
    {Array.from({ length: 34 }, (_, i) => {
      const a = azar(i * 3) * Math.PI, r = 60 + Math.sqrt(azar(i * 5 + 1)) * 230, cx = Math.cos(a) * r * 1.2, cy = -500 - Math.sin(a) * r * 0.55 + 40;
      const brillo = 0.55 + 0.45 * Math.sin(f / 12 + i);
      return <g key={i} transform={`translate(${n1(cx)} ${n1(cy)})`}>
        <circle r={22} fill="#FFF6D0" opacity={0.35 * luz * brillo} />
        {[0, 1, 2, 3, 4].map((k) => <ellipse key={k} cx={0} cy={-8} rx={5} ry={9} fill={luz > 0.3 ? '#FFFBEF' : '#CFC6B4'} stroke={C.negro} strokeWidth={1} transform={`rotate(${k * 72})`} />)}
        <circle r={4.5} fill={luz > 0.3 ? '#F2C94C' : '#9A8A6A'} />
      </g>;
    })}
  </g>
);
/** Hoyo en el suelo de nubes del Mundo del Cielo, con el agua muy abajo. Origen = centro del hoyo. */
export const Agujero: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO + 8, s = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><radialGradient id="hoyo-n" cx="50%" cy="50%" r="60%"><stop offset="0" stopColor="#6FA8BE" /><stop offset="0.7" stopColor="#2F6A8A" /><stop offset="1" stopColor="#163A52" /></radialGradient></defs>
    <ellipse cx={0} cy={0} rx={210} ry={38} fill="url(#hoyo-n)" stroke={C.negro} strokeWidth={4} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-140 + i * 50} ${(i % 2 ? 6 : -4)} q 20 ${-4 + Math.sin(f / 10 + i) * 2} 40 0`} stroke="#BFE0E6" strokeWidth={2} fill="none" opacity={0.6} />)}
    {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2, px = Math.cos(a) * 205, py = Math.sin(a) * 36; return <path key={`r${i}`} d={`M${n1(px)} ${n1(py)} q ${n1(-Math.cos(a) * 20)} ${10 + (i % 3) * 6} ${n1(-Math.cos(a) * 34)} ${24 + (i % 3) * 8}`} stroke={N.cortezaOsc} strokeWidth={4} fill="none" strokeLinecap="round" />; })}
  </g>
);

// ---------- casas ----------
/** Casa comunal haudenosaunee (ganonhsees): techo en arco cubierto de corteza de olmo. */
export const CasaComunal: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-150, 40, 200].map((hx, i) => <g key={i} opacity={0.5}>{[0, 1, 2].map((k) => { const ed = (f * 0.7 + k * 40 + i * 25) % 120; return <circle key={k} cx={hx + Math.sin(ed / 20 + k) * 10} cy={-190 - ed * 1.4} r={10 + ed * 0.25} fill="#D9D2C6" opacity={1 - ed / 120} />; })}</g>)}
    <path d="M-280 0 V -110 C -280 -186, 280 -186, 280 -110 V 0 Z" fill="#8A6A48" stroke={C.negro} strokeWidth={3} />
    {[-210, -140, -70, 0, 70, 140, 210].map((bx) => <path key={bx} d={`M${bx} -4 V ${-110 - Math.cos((bx / 280) * 1.2) * 52}`} stroke="#5A4228" strokeWidth={3} />)}
    {[-40, -90, -140].map((yy, i) => <path key={i} d={`M-279 ${yy} C -180 ${yy - 6 - i * 10}, 180 ${yy - 6 - i * 10}, 279 ${yy}`} stroke="#4A3420" strokeWidth={4} fill="none" />)}
    {[-150, 40, 200].map((hx, i) => <rect key={i} x={hx - 14} y={-178 + (i === 1 ? -6 : 4)} width={28} height={10} fill={C.negro} />)}
    <path d="M250 0 V -96 H 280 V 0 Z" fill="#2A1E14" />
    <path d="M250 -96 C 262 -70, 262 -40, 256 0" stroke={N.cuero} strokeWidth={6} fill="none" />
  </g>
);
/** Tipi de las Llanuras: cuero pintado con bandas y la puerta. */
export const Tipi: React.FC<{ x: number; y?: number; s?: number; color?: string }> = ({ x, y = SUELO, s = 1, color = N.cuero }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 -300 L -8 -250 M30 -300 L 8 -250 M0 -310 L 0 -250 M-16 -306 L -4 -250" stroke={N.cortezaOsc} strokeWidth={6} strokeLinecap="round" />
    <path d="M-150 0 L -6 -260 L 6 -260 L 150 0 Z" fill={color} stroke={C.negro} strokeWidth={3} />
    <path d="M-118 -56 L 118 -56 L 128 -36 L -128 -36 Z" fill={N.rojo} />
    <path d="M-60 -170 L 60 -170 L 66 -158 L -66 -158 Z" fill={N.azul} />
    <circle cx={0} cy={-110} r={18} fill={N.rojo} stroke={C.negro} strokeWidth={2} />
    {[-90, -50, 50, 90].map((dx) => <circle key={dx} cx={dx} cy={-20} r={7} fill={N.azul} />)}
    <path d="M-26 0 C -26 -60, 26 -60, 26 0 Z" fill="#3A2A1C" stroke={C.negro} strokeWidth={2} />
  </g>
);
/** Casa de tablones de la costa noroeste, con el frente pintado (óvalos genéricos, sin emblemas de clan). */
export const CasaTablones: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-240 0 V -200 L 0 -250 L 240 -200 V 0 Z" fill="#9A7A56" stroke={C.negro} strokeWidth={3} />
    {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${-200 + i * 40} -4 V ${-200 - (1 - Math.abs(-200 + i * 40) / 240) * 50}`} stroke="#6E5236" strokeWidth={2.5} />)}
    <path d="M-250 -196 L 0 -256 L 250 -196" stroke={C.negro} strokeWidth={10} fill="none" strokeLinecap="round" />
    <g transform="translate(0 -120)">
      <path d="M-170 10 C -170 -60, -60 -80, 0 -40 C 60 -80, 170 -60, 170 10 C 120 -10, 60 -10, 0 20 C -60 -10, -120 -10, -170 10 Z" fill={C.negro} />
      {[-1, 1].map((k) => <g key={k} transform={`translate(${k * 80} -28)`}><path d="M-38 0 C -38 -26, 38 -26, 38 0 C 38 18, -38 18, -38 0 Z" fill={N.rojo} stroke={C.negro} strokeWidth={3} /><path d="M-18 0 C -18 -12, 18 -12, 18 0 C 18 9, -18 9, -18 0 Z" fill={C.negro} /><circle r={5} fill="#E9DFC6" /></g>)}
      <path d="M-30 30 C -10 50, 10 50, 30 30" stroke={N.rojo} strokeWidth={8} fill="none" />
    </g>
    <ellipse cx={0} cy={-36} rx={28} ry={36} fill="#2A1E14" stroke={C.negro} strokeWidth={3} />
  </g>
);
/** Poste tallado frente a la casa (figuras genéricas apiladas: oso, rana, ave). */
export const Totem: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => {
  const cara = (cy: number, color: string, k: number) => (
    <g transform={`translate(0 ${cy})`} key={k}>
      <rect x={-42} y={-80} width={84} height={160} rx={12} fill="#9A6A44" stroke={C.negro} strokeWidth={2.5} />
      {[-1, 1].map((sx) => <g key={sx}><path d={`M${sx * 20 - 16} -30 C ${sx * 20 - 16} -46, ${sx * 20 + 16} -46, ${sx * 20 + 16} -30 C ${sx * 20 + 16} -18, ${sx * 20 - 16} -18, ${sx * 20 - 16} -30 Z`} fill={C.negro} /><circle cx={sx * 20} cy={-31} r={5} fill="#E9DFC6" /></g>)}
      <path d="M-26 -52 C -10 -62, 10 -62, 26 -52" stroke={C.negro} strokeWidth={6} fill="none" />
      <path d="M-24 22 C -12 40, 12 40, 24 22 Z" fill={color} stroke={C.negro} strokeWidth={2.5} />
      <path d="M-30 50 h 60" stroke={C.negro} strokeWidth={4} />
      {k === 0 && <path d="M-40 -80 l -10 -24 l 22 10 Z M40 -80 l 10 -24 l -22 10 Z" fill="#9A6A44" stroke={C.negro} strokeWidth={2} />}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {cara(-80, N.rojo, 0)}{cara(-240, N.turquesa, 1)}
      <g transform="translate(0 -390)">
        <path d="M-90 -10 C -60 -40, -40 -40, -36 -10 L 36 -10 C 40 -40, 60 -40, 90 -10 L 60 4 L -60 4 Z" fill={C.negro} />
        <rect x={-36} y={-70} width={72} height={80} rx={14} fill="#9A6A44" stroke={C.negro} strokeWidth={2.5} />
        <path d="M30 -46 L 74 -30 L 30 -18 Z" fill={N.rojo} stroke={C.negro} strokeWidth={2} />
        <path d="M2 -48 C 2 -60, 26 -60, 26 -48 C 26 -38, 2 -38, 2 -48 Z" fill={C.negro} /><circle cx={14} cy={-48} r={4} fill="#E9DFC6" />
      </g>
    </g>
  );
};
/** Canoa de corteza de abedul (Bosques del Este) o de cedro (costa noroeste). Origen = línea del agua. */
export const Canoa: React.FC<{ x: number; y?: number; s?: number; f: number; cedro?: boolean; quieta?: boolean }> = ({ x, y = SUELO - 20, s = 1, f, cedro, quieta }) => (
  <g transform={`translate(${x} ${y + (quieta ? 0 : Math.sin(f / 15) * 5)}) rotate(${quieta ? 0 : Math.sin(f / 20) * 1.5}) scale(${s})`}>
    {cedro ? (<>
      <path d="M-260 -40 C -200 30, 200 30, 240 -30 L 300 -110 C 280 -100, 260 -80, 230 -60 L -230 -60 C -250 -80, -270 -96, -290 -96 Z" fill={C.negro} stroke={C.negro} strokeWidth={2} />
      <path d="M-230 -50 C -120 -40, 120 -40, 230 -50" stroke={N.rojo} strokeWidth={8} fill="none" />
      <path d="M200 -40 C 220 -60, 250 -70, 270 -84" stroke={N.rojo} strokeWidth={5} fill="none" />
    </>) : (<>
      <path d="M-240 -50 C -200 20, 200 20, 240 -50 C 250 -70, 256 -86, 250 -100 C 236 -84, 226 -66, 210 -56 L -210 -56 C -226 -66, -236 -84, -250 -100 C -256 -86, -250 -70, -240 -50 Z" fill="#F2EEE4" stroke={C.negro} strokeWidth={3} />
      {[-160, -80, 0, 80, 160].map((sx) => <path key={sx} d={`M${sx} -54 C ${sx + 4} -30, ${sx + 4} -10, ${sx} 6`} stroke={C.negro} strokeWidth={2.5} />)}
      {[-190, -120, -40, 40, 120, 190].map((sx) => <path key={sx} d={`M${sx} -40 h 14`} stroke={C.negro} strokeWidth={3} />)}
      <path d="M-210 -56 H 210" stroke={N.tierraOsc} strokeWidth={6} />
    </>)}
  </g>
);

// ---------- plantas de cultivo ----------
export const MaizN: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(f / 30 + x) * 1.5})`}>
    <path d="M0 0 L 2 -230" stroke="#6E9A3E" strokeWidth={8} strokeLinecap="round" />
    {[[-1, -60], [1, -100], [-1, -140], [1, -180], [-1, -210]].map(([k, yy], i) => <path key={i} d={`M1 ${yy} C ${k * 30} ${yy - 30}, ${k * 60} ${yy - 20}, ${k * 80} ${yy + 10} C ${k * 50} ${yy - 4}, ${k * 24} ${yy - 4}, 1 ${yy + 8} Z`} fill="#7FA84A" stroke={C.negro} strokeWidth={1.8} />)}
    <path d="M2 -230 l -8 -24 M2 -230 l 2 -28 M2 -230 l 10 -22" stroke="#C9A040" strokeWidth={3} strokeLinecap="round" />
    <g transform="translate(10 -120) rotate(25)"><ellipse cx={0} cy={-20} rx={9} ry={26} fill={N.maiz} stroke={C.negro} strokeWidth={1.8} /><path d="M-8 4 C -14 -16, -10 -36, -2 -44 L 0 -10 Z" fill="#7FA84A" stroke={C.negro} strokeWidth={1.4} /></g>
  </g>
);
/** Las Tres Hermanas: maíz, frijol trepando por el tallo y calabaza al pie, sobre un montículo. */
export const TresHermanas: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-110 0 C -80 -40, 80 -40, 110 0 Z" fill={N.tierra} stroke={C.negro} strokeWidth={2.5} />
    <MaizN x={-10} y={-26} s={0.9} f={f} />
    <path d={suave([[-8, -30], [8, -60], [-10, -90], [10, -120], [-8, -150], [8, -180]])} stroke="#3E7A3A" strokeWidth={3} fill="none" />
    {[[6, -62], [-8, -94], [8, -126], [-6, -158]].map(([px, py], i) => <ellipse key={i} cx={px + (i % 2 ? -8 : 8)} cy={py} rx={9} ry={6} fill="#5E9A4A" stroke={C.negro} strokeWidth={1.2} />)}
    {[[-6, -110], [6, -150]].map(([px, py], i) => <path key={`v${i}`} d={`M${px} ${py} q 4 14 0 22`} stroke="#4A6A2A" strokeWidth={4} strokeLinecap="round" />)}
    <path d="M30 -20 C 50 -50, 90 -46, 96 -20 C 80 -30, 50 -30, 30 -20 Z" fill="#5E8A3A" stroke={C.negro} strokeWidth={1.8} />
    <ellipse cx={62} cy={-16} rx={30} ry={20} fill="#E08A2E" stroke={C.negro} strokeWidth={2.2} />
    <path d="M52 -32 C 48 -16, 48 -4, 52 2 M72 -32 C 76 -16, 76 -4, 72 2" stroke="#A85A1A" strokeWidth={1.6} fill="none" />
    <ellipse cx={-70} cy={-14} rx={22} ry={15} fill="#E8B04A" stroke={C.negro} strokeWidth={2} />
  </g>
);

// ---------- la Gran Tortuga ----------
/** Gran Tortuga flotando; tierra 0–1 = cuánta tierra lleva en el caparazón (con árboles si `arboles`). Origen = línea del agua. */
export const IslaTortuga: React.FC<{ x: number; y?: number; s?: number; f: number; tierra?: number; arboles?: boolean }> = ({ x, y = SUELO - 20, s = 1, f, tierra = 0, arboles }) => {
  const res = Math.sin(f / 28) * 4;
  const tw = 120 + tierra * 260, th = 10 + tierra * 110;
  return (
    <g transform={`translate(${x} ${y + res}) scale(${s})`}>
      <path d={`M240 -10 C 280 -40, 330 -40, 350 -16 C 360 -4, 340 6, 300 4 C 280 2, 260 0, 240 -2 Z`} fill="#6E7A3A" stroke={C.negro} strokeWidth={3} />
      <circle cx={328} cy={-20} r={4} fill={C.negro} />
      <path d="M326 -6 q 10 0 18 -4" stroke={C.negro} strokeWidth={2} fill="none" />
      <path d={`M150 0 C 180 30, 230 ${40 + Math.sin(f / 18) * 8}, 260 30 C 230 20, 200 10, 170 0 Z`} fill="#6E7A3A" stroke={C.negro} strokeWidth={2.5} />
      <path d="M-280 10 C -270 -90, -150 -170, 0 -176 C 150 -170, 270 -90, 280 10 Z" fill="#5E5A2E" stroke={C.negro} strokeWidth={4} />
      {[[-170, -70], [-60, -120], [60, -120], [170, -70], [-110, -20], [0, -50], [110, -20]].map(([cx, cy], i) => <path key={i} d={`M${cx - 44} ${cy} L ${cx - 22} ${cy - 30} L ${cx + 22} ${cy - 30} L ${cx + 44} ${cy} L ${cx + 22} ${cy + 26} L ${cx - 22} ${cy + 26} Z`} fill="#7E7A3E" stroke={C.negro} strokeWidth={2} />)}
      <path d="M-280 10 C -140 24, 140 24, 280 10" stroke={N.ocre} strokeWidth={6} fill="none" />
      {tierra > 0 && <g transform="translate(0 -168)">
        <path d={`M${-tw} 14 C ${-tw * 0.7} ${-th * 0.7}, ${-tw * 0.3} ${-th}, 0 ${-th} C ${tw * 0.3} ${-th}, ${tw * 0.7} ${-th * 0.7}, ${tw} 14 Z`} fill={tierra > 0.6 ? '#5E7E3A' : N.tierra} stroke={C.negro} strokeWidth={3} />
        {tierra > 0.6 && <path d={`M${-tw * 0.8} 6 C ${-tw * 0.5} ${-th * 0.5}, ${tw * 0.5} ${-th * 0.5}, ${tw * 0.8} 6`} stroke={N.tierra} strokeWidth={8} fill="none" opacity={0.6} />}
        {arboles && [[-0.55, 0.5], [-0.2, 0.9], [0.25, 0.85], [0.6, 0.45]].map(([k, h], i) => <PinoN key={i} x={k * tw} y={-th * h + 8} s={0.28 + tierra * 0.1} color={i % 2 ? N.pino : N.pinoClaro} />)}
      </g>}
      <ellipse cx={0} cy={46} rx={430} ry={58} fill="#2F6A84" opacity={0.92} />
      <path d={`M-380 2 ` + Array.from({ length: 10 }, (_, i) => `q 38 ${i % 2 ? 8 : -8} 76 0`).join(' ')} stroke={N.aguaClara} strokeWidth={4} fill="none" />
    </g>
  );
};

/** Caja de madera curvada (costa noroeste), con o sin luz adentro. */
export const Caja: React.FC<{ x: number; y?: number; s?: number; f: number; luz?: boolean }> = ({ x, y = SUELO, s = 1, f, luz }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {luz && <circle cx={0} cy={-80} r={110 + Math.sin(f / 6) * 8} fill="url(#halo)" />}
    <rect x={-70} y={-110} width={140} height={110} rx={6} fill="#8A5A34" stroke={C.negro} strokeWidth={3} />
    <path d="M-76 -118 H 76 V -104 H -76 Z" fill="#6E4428" stroke={C.negro} strokeWidth={2.5} />
    <path d="M-50 -60 C -50 -86, -10 -86, -10 -60 C -10 -44, -50 -44, -50 -60 Z M10 -60 C 10 -86, 50 -86, 50 -60 C 50 -44, 10 -44, 10 -60 Z" fill={C.negro} />
    <circle cx={-30} cy={-62} r={6} fill={N.rojo} /><circle cx={30} cy={-62} r={6} fill={N.rojo} />
    <path d="M-40 -24 C -20 -12, 20 -12, 40 -24" stroke={N.rojo} strokeWidth={6} fill="none" />
  </g>
);

// ---------- montañas y relieves ----------
const Cordillera: React.FC<{ y: number; alto: number; color: string; seed: number; paso?: number; x0?: number; x1?: number; linea?: string }> = ({ y, alto, color, seed, paso = 260, x0 = -1800, x1 = 6200, linea }) => {
  const n = Math.ceil((x1 - x0) / paso);
  const d = `M${x0} ${y + 200} L ${x0} ${y} ` + Array.from({ length: n }, (_, i) => { const xx = x0 + (i + 0.5) * paso, top = y - alto * (0.4 + 0.6 * azar(i + seed)); return `Q ${n1(xx - paso * 0.25)} ${n1(top)} ${n1(xx)} ${n1(top)} Q ${n1(xx + paso * 0.25)} ${n1(top)} ${n1(x0 + (i + 1) * paso)} ${n1(y - alto * 0.25 * azar(i + seed + 7))}`; }).join(' ') + ` L ${x1} ${y + 200} Z`;
  return <path d={d} fill={color} stroke={linea ?? C.negro} strokeWidth={3} />;
};
const Meseta: React.FC<{ x: number; base: number; ancho: number; alto: number; color?: string }> = ({ x, base, ancho, alto, color = '#B0623A' }) => (
  <g>
    <path d={`M${x - ancho / 2} ${base} L ${x - ancho * 0.36} ${base - alto} L ${x + ancho * 0.36} ${base - alto} L ${x + ancho / 2} ${base} Z`} fill={color} stroke={C.negro} strokeWidth={3} />
    {[0.3, 0.55, 0.8].map((k) => <path key={k} d={`M${x - ancho * (0.36 + 0.14 * k)} ${base - alto * (1 - k)} H ${x + ancho * (0.36 + 0.14 * k)}`} stroke="#7A3A22" strokeWidth={3} />)}
  </g>
);

/** Fondos del tema norteamericano (null = usar el genérico). */
export function fondoNorteamericano(tipo: string, f: number, astros = true): React.ReactNode {
  const pinos = (xs: number[], s: number, y = SUELO, extra = 0) => xs.map((x, i) => <PinoN key={`p${i}`} x={x} y={y} s={s * (0.85 + azar(i + extra) * 0.3)} color={i % 2 ? N.pino : N.pinoClaro} />);
  switch (tipo) {
    case 'mundo_cielo': case 'cielo': return (<>
      <defs><linearGradient id="n-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFE3EA" /><stop offset="0.6" stopColor="#F4EEDC" /><stop offset="1" stopColor="#FBF3DE" /></linearGradient></defs>
      <Capa p={0}><rect x={-2000} y={-500} width={8000} height={2000} fill="url(#n-cielo)" /></Capa>
      <Capa p={0.05}>{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-200 + i * 420} ${200 + (i % 2) * 40} h ${120 + (i % 3) * 60}`} stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" opacity={0.7} />)}</Capa>
      <Capa p={0.15}>{Array.from({ length: 12 }, (_, i) => <Nube key={i} x={-600 + i * 380} y={600 + (i % 2) * 30} s={1.1} color="#FFFDF6" f={f + i * 20} />)}<rect x={-2000} y={620} width={8000} height={600} fill="#FFFDF6" /></Capa>
      <Capa p={0.3}>
        <CasaComunal x={300} y={700} s={0.4} f={f} /><CasaComunal x={2400} y={700} s={0.36} f={f + 30} />
        {[900, 1500, 3000, 3600].map((x, i) => <ArbolCielo key={i} x={x} y={705} s={0.18} f={f + i * 7} />)}
        {Array.from({ length: 12 }, (_, i) => <Nube key={i} x={-500 + i * 420} y={720} s={0.9} color="#F8F4EA" f={f + i * 33} />)}
      </Capa>
      <SueloN tipo="nube" />
    </>);
    case 'agua_primordial': case 'mar': case 'oceano': case 'caos': case 'inframundo': {
      const oscura = tipo === 'caos' || tipo === 'inframundo';
      return (<>
        {oscura && <Capa p={0}><rect x={-2000} y={-500} width={8000} height={2000} fill="#1A2236" /></Capa>}
        <Capa p={0.05}>{astros && !oscura && <Sol x={1540} y={260} r={40} f={f} />}{oscura && <Estrellas f={f} n={50} />}</Capa>
        <Capa p={0.1}>{!oscura && Array.from({ length: 5 }, (_, i) => <Nube key={i} x={-200 + i * 520} y={300 + (i % 2) * 70} s={0.7} color="#FFFDF6" f={f + i * 40} />)}</Capa>
        <Capa p={0.2}><AguaPintada y={540} f={f} oscura={oscura} /></Capa>
        <Capa p={0.6}><AguaPintada y={660} f={f * 1.4} oscura={oscura} /></Capa>
        <Capa p={1}><path d={`M-1800 ${SUELO - 4} ` + Array.from({ length: 60 }, (_, i) => `q 60 ${i % 2 ? 10 : -10} 120 0`).join(' ') + ` V 1300 H -1800 Z`} fill={oscura ? '#18384E' : '#2F6A84'} stroke={C.negro} strokeWidth={3} />
          {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${-1600 + i * 220 + ((f * 1.2) % 220)} ${SUELO + 30 + (i % 3) * 18} q 30 -10 60 0`} stroke={N.aguaClara} strokeWidth={3} fill="none" opacity={0.7} />)}
        </Capa>
      </>);
    }
    case 'bajo_agua': case 'fondo_marino': return (<>
      <defs><linearGradient id="n-hondo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5E9AAE" /><stop offset="0.45" stopColor="#2A5E7A" /><stop offset="1" stopColor="#0E2A3E" /></linearGradient></defs>
      <Capa p={0}><rect x={-2000} y={-500} width={8000} height={2000} fill="url(#n-hondo)" />
        {Array.from({ length: 6 }, (_, i) => { const x = 140 + i * 320 + Math.sin(f / 60 + i) * 30; return <path key={i} d={`M${x} 120 L ${x + 60} 120 L ${x + 220} ${SUELO} L ${x + 90} ${SUELO} Z`} fill="#FFFFFF" opacity={0.04 + 0.03 * Math.sin(f / 30 + i)} />; })}
      </Capa>
      <Capa p={0.2}>{Array.from({ length: 9 }, (_, i) => { const yy = 200 + i * 60; return <path key={i} d={`M-1800 ${yy} ` + Array.from({ length: 40 }, (_, j) => `q 80 ${j % 2 ? 6 : -6} 160 0`).join(' ')} stroke="#8FC0CC" strokeWidth={2.5} fill="none" opacity={0.25 - i * 0.02} strokeDasharray="70 40" transform={`translate(${(f * (0.3 + i * 0.05)) % 320} 0)`} />; })}</Capa>
      <Capa p={0.5}>
        <path d={`M-1800 700 ` + Array.from({ length: 30 }, (_, i) => `q 120 ${i % 2 ? 30 : -30} 240 0`).join(' ') + ` V 1200 H -1800 Z`} fill="#1E3A40" stroke={C.negro} strokeWidth={2.5} />
        {Array.from({ length: 14 }, (_, i) => { const x = -600 + i * 360 + azar(i) * 80, h = 140 + azar(i + 4) * 160; return <path key={i} d={`M${x} 720 C ${x - 20 + Math.sin(f / 25 + i) * 14} ${720 - h * 0.4}, ${x + 20 + Math.sin(f / 25 + i) * 20} ${720 - h * 0.7}, ${x + Math.sin(f / 20 + i) * 26} ${720 - h}`} stroke="#3E6A4A" strokeWidth={8} fill="none" strokeLinecap="round" />; })}
      </Capa>
      <Capa p={0.9}>{Array.from({ length: 36 }, (_, i) => { const t = ((f * (0.8 + azar(i) * 0.6) + i * 41) % 700) / 700; return <circle key={i} cx={-200 + azar(i + 3) * 4200 + Math.sin(f / 12 + i) * 6} cy={SUELO - 20 - t * 640} r={3 + azar(i + 5) * 5} fill="none" stroke="#DFF5F0" strokeWidth={2} opacity={0.7 * (1 - t)} />; })}</Capa>
      <SueloN tipo="lodo" />
    </>);
    case 'bosque': return (<>
      <Capa p={0.05}>{astros && <Sol x={1580} y={240} r={38} f={f} />}</Capa>
      <Capa p={0.1}><Cordillera y={560} alto={150} color="#9AB0A0" seed={3} paso={360} /></Capa>
      <Capa p={0.25}><rect x={-2000} y={600} width={8000} height={600} fill="#6E8A62" />{pinos(Array.from({ length: 22 }, (_, i) => -800 + i * 240), 0.55, 650, 1)}</Capa>
      <Capa p={0.45}><rect x={-2000} y={700} width={8000} height={500} fill="#4E6A42" />{Array.from({ length: 12 }, (_, i) => i % 3 === 1 ? <AbedulN key={i} x={-600 + i * 380} y={730} s={0.7} /> : <ArceN key={i} x={-600 + i * 380} y={730} s={0.65} color={i % 4 === 0 ? '#B2541E' : N.verde} f={f + i * 9} />)}</Capa>
      <Capa p={0.75}>{pinos([-300, 500, 1300, 2100, 2900, 3700, 4500], 1.15, SUELO, 4)}</Capa>
      <SueloN tipo="tierra" />
      <Capa p={1}>{Array.from({ length: 40 }, (_, i) => <path key={i} d={`M${-600 + azar(i) * 5200} ${SUELO + 30 + azar(i + 3) * 30} l 8 -8 l 8 8 Z`} fill={i % 3 ? '#B2541E' : N.maiz} opacity={0.8} />)}</Capa>
    </>);
    case 'aldea_casa_larga': case 'aldea': case 'ciudad': case 'palacio': case 'templo': return (<>
      <Capa p={0.05}>{astros && <Sol x={1600} y={240} r={38} f={f} />}</Capa>
      <Capa p={0.1}><Cordillera y={580} alto={140} color="#8AA090" seed={5} paso={400} /></Capa>
      <Capa p={0.25}><rect x={-2000} y={620} width={8000} height={600} fill="#7A9A5A" />{pinos(Array.from({ length: 20 }, (_, i) => -800 + i * 270), 0.45, 660, 2)}</Capa>
      <Capa p={0.45}>
        <rect x={-2000} y={690} width={8000} height={500} fill="#6E8A4A" />
        <CasaComunal x={250} y={720} s={0.55} f={f} /><CasaComunal x={1050} y={715} s={0.6} f={f + 20} /><CasaComunal x={1900} y={720} s={0.55} f={f + 40} /><CasaComunal x={2800} y={718} s={0.6} f={f + 60} />
        <g>{Array.from({ length: 140 }, (_, i) => <path key={i} d={`M${-1200 + i * 40} 740 V ${660 + (i % 3) * 6} l 6 -10 l 6 10 V 740`} fill={N.corteza} stroke={C.negro} strokeWidth={1.2} opacity={i % 23 > 18 ? 0 : 1} />)}</g>
      </Capa>
      <Capa p={0.75}>{Array.from({ length: 16 }, (_, i) => <TresHermanas key={i} x={-700 + i * 330 + azar(i) * 60} y={SUELO - 4} s={0.55} f={f + i * 11} />)}</Capa>
      <SueloN tipo="tierra" />
    </>);
    case 'pradera': case 'campo': return (<>
      <Capa p={0.05}>{astros && <Sol x={1560} y={250} r={44} f={f} />}</Capa>
      <Capa p={0.08}>{Array.from({ length: 4 }, (_, i) => <Nube key={i} x={-100 + i * 640} y={260 + (i % 2) * 60} s={0.8} color="#FFFDF6" f={f + i * 30} />)}</Capa>
      <Capa p={0.15}><Meseta x={300} base={640} ancho={520} alto={150} /><Meseta x={1500} base={640} ancho={360} alto={110} color="#A0563A" /><Meseta x={2700} base={640} ancho={600} alto={170} /><rect x={-2000} y={630} width={8000} height={600} fill="#C8B46A" /></Capa>
      <Capa p={0.3}><path d={`M-1800 690 ` + Array.from({ length: 30 }, (_, i) => `q 120 ${i % 2 ? 26 : -26} 240 0`).join(' ') + ` V 1200 H -1800 Z`} fill="#B4A45A" stroke={C.negro} strokeWidth={2.5} />{[600, 760, 2200, 2360, 3300].map((x, i) => <Tipi key={i} x={x} y={700} s={0.28} color={i % 2 ? '#E2C89A' : N.cuero} />)}</Capa>
      <Capa p={0.6}><path d={`M-1800 750 ` + Array.from({ length: 30 }, (_, i) => `q 140 ${i % 2 ? 18 : -18} 280 0`).join(' ') + ` V 1200 H -1800 Z`} fill="#A8A04E" stroke={C.negro} strokeWidth={2.5} /></Capa>
      <SueloN tipo="pradera" />
    </>);
    case 'costa_noroeste': return (<>
      <Capa p={0.05}>{astros && <Sol x={1600} y={230} r={36} f={f} />}</Capa>
      <Capa p={0.08}><Cordillera y={540} alto={260} color="#7A8AA0" seed={9} paso={420} /><g opacity={0.95}>{Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${-1600 + i * 420 + 150} ${330 + azar(i + 9) * 40} l 60 50 l -120 0 Z`} fill="#F4F2EC" />)}</g></Capa>
      <Capa p={0.15}><AguaPintada y={560} f={f * 0.5} /></Capa>
      <Capa p={0.3}><path d={`M-1800 680 ` + Array.from({ length: 30 }, (_, i) => `q 120 ${i % 2 ? 16 : -16} 240 0`).join(' ') + ` V 1200 H -1800 Z`} fill="#4A5E44" stroke={C.negro} strokeWidth={2.5} />{Array.from({ length: 18 }, (_, i) => <CedroN key={i} x={-700 + i * 300} y={700} s={0.38} f={f + i * 7} />)}</Capa>
      <Capa p={0.55}>
        <rect x={-2000} y={735} width={8000} height={500} fill="#8A7A5E" />
        <CasaTablones x={300} y={760} s={0.6} /><Totem x={520} y={762} s={0.55} /><CasaTablones x={1500} y={758} s={0.65} /><Totem x={1240} y={762} s={0.6} /><CasaTablones x={2700} y={760} s={0.6} /><Totem x={2950} y={762} s={0.55} />
      </Capa>
      <SueloN tipo="arena" />
      <Capa p={1}><Canoa x={-200} y={SUELO + 8} s={0.6} f={f} cedro quieta /></Capa>
    </>);
    case 'rio': return (<>
      <Capa p={0.05}>{astros && <Sol x={1560} y={240} r={38} f={f} />}</Capa>
      <Capa p={0.1}><Cordillera y={580} alto={180} color="#8AA0A8" seed={2} paso={380} /></Capa>
      <Capa p={0.25}><rect x={-2000} y={610} width={8000} height={600} fill="#5E7E4A" />{pinos(Array.from({ length: 22 }, (_, i) => -800 + i * 240), 0.5, 640, 6)}</Capa>
      <Capa p={0.45}><AguaPintada y={660} f={f * 2} /><path d={`M-1800 720 ` + Array.from({ length: 40 }, (_, i) => `q 100 ${i % 2 ? 8 : -8} 200 0`).join(' ') + ` V 1200 H -1800 Z`} fill="#6E8A4A" stroke={C.negro} strokeWidth={3} /></Capa>
      <Capa p={0.75}>{Array.from({ length: 8 }, (_, i) => i % 2 ? <AbedulN key={i} x={-400 + i * 640} s={0.9} /> : <ArceN key={i} x={-400 + i * 640} s={0.85} f={f + i * 13} />)}</Capa>
      <SueloN tipo="hierba" />
    </>);
    case 'montanas': case 'monte': return (<>
      <Capa p={0.05}>{astros && <Sol x={1500} y={230} r={38} f={f} />}</Capa>
      <Capa p={0.08}><Cordillera y={470} alto={170} color="#A8BACB" seed={1} paso={340} linea="#6E8094" /></Capa>
      <Capa p={0.15}><Cordillera y={540} alto={190} color="#7E96AE" seed={4} paso={320} /><g opacity={0.6}>{Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={((i * 700 + f * 0.4) % 4200) - 800} cy={560} rx={360} ry={22} fill="#F4F0E6" />)}</g></Capa>
      <Capa p={0.3}><Cordillera y={630} alto={190} color="#5A7A8E" seed={7} paso={300} /></Capa>
      <Capa p={0.5}><Cordillera y={720} alto={170} color="#3E5E5A" seed={11} paso={280} />{pinos(Array.from({ length: 20 }, (_, i) => -800 + i * 280), 0.4, 730, 3)}</Capa>
      <SueloN tipo="hierba" />
    </>);
    case 'lago': case 'costa': case 'playa': return (<>
      <Capa p={0.05}>{astros && <Sol x={1560} y={250} r={38} f={f} />}</Capa>
      <Capa p={0.1}><Cordillera y={560} alto={110} color="#7E9A88" seed={8} paso={420} /></Capa>
      <Capa p={0.2}><AguaPintada y={590} f={f * 0.6} /></Capa>
      <Capa p={0.5}><path d={`M-1800 735 ` + Array.from({ length: 40 }, (_, i) => `q 100 ${i % 2 ? 6 : -6} 200 0`).join(' ') + ` V 1200 H -1800 Z`} fill="#C9AE80" stroke={C.negro} strokeWidth={3} /><Canoa x={1700} y={738} s={0.5} f={f} quieta /></Capa>
      <Capa p={0.8}>{[-300, 300, 2300, 2900, 3700].map((x, i) => <AbedulN key={i} x={x} s={0.95 + (i % 2) * 0.15} />)}{pinos([2600, 4200], 1.1, SUELO, 5)}</Capa>
      <SueloN tipo="arena" />
    </>);
    case 'noche': return (<>
      {astros && <Capa p={0.03}>
        <path d="M-200 560 C 300 380, 900 260, 2200 140" stroke="#C9D4EE" strokeWidth={130} fill="none" opacity={0.09} />
        <Estrellas f={f} n={110} area={[0, 140, 1920, 420]} seed={11} />
        <Luna x={1620} y={270} r={38} />
      </Capa>}
      <Capa p={0.15}><Cordillera y={640} alto={140} color="#1E2A40" seed={6} paso={380} linea="#0A1020" /></Capa>
      <Capa p={0.4}><rect x={-2000} y={700} width={8000} height={600} fill="#14202E" />{pinos(Array.from({ length: 20 }, (_, i) => -800 + i * 260), 0.6, 720, 8).map((p, i) => <g key={i} opacity={0.9}>{p}</g>)}</Capa>
      <SueloN tipo="oscuro" />
    </>);
    default: return null;
  }
}

/** Elementos del tema norteamericano (null = usar el genérico). */
export function elementoNorteamericano(tipo: string, x: number, y: number | undefined, s: number, f: number, props: Record<string, unknown>): React.ReactNode {
  const yy = y ?? SUELO;
  switch (tipo) {
    case 'arbol_cielo': return <ArbolCielo x={x} y={yy} s={s} f={f} luz={(props.luz as number) ?? 1} />;
    case 'agujero': return <Agujero x={x} y={y ?? SUELO + 8} s={s} f={f} />;
    case 'casa_comunal': case 'casa': case 'casa_larga': case 'templo': return <CasaComunal x={x} y={yy} s={s} f={f} />;
    case 'tipi': return <Tipi x={x} y={yy} s={s} color={props.color as string} />;
    case 'casa_tablones': return <CasaTablones x={x} y={yy} s={s} />;
    case 'totem': return <Totem x={x} y={yy} s={s} />;
    case 'canoa': case 'barco': return <Canoa x={x} y={y ?? SUELO - 20} s={s} f={f} quieta={props.quieta === true} />;
    case 'canoa_cedro': return <Canoa x={x} y={y ?? SUELO - 20} s={s} f={f} cedro quieta={props.quieta === true} />;
    case 'maiz': return <MaizN x={x} y={yy} s={s} f={f} />;
    case 'tres_hermanas': return <TresHermanas x={x} y={yy} s={s} f={f} />;
    case 'isla_tortuga': return <IslaTortuga x={x} y={y ?? SUELO - 20} s={s} f={f} tierra={(props.tierra as number) ?? 0} arboles={props.arboles === true} />;
    case 'arce': case 'arbol': case 'olivo': case 'palmera': return <ArceN x={x} y={yy} s={s} f={f} color={props.color as string} />;
    case 'pino': case 'cipres': return <PinoN x={x} y={yy} s={s} />;
    case 'abedul': return <AbedulN x={x} y={yy} s={s} />;
    case 'cedro': return <CedroN x={x} y={yy} s={s} f={f} />;
    case 'monticulo': return <g transform={`translate(${x} ${yy}) scale(${s})`}><path d="M-130 2 C -100 -60, 100 -60, 130 2 Z" fill={N.tierra} stroke={C.negro} strokeWidth={3} />{[-70, -30, 10, 50, 85].map((dx, i) => <path key={i} d={`M${dx} ${-28 - (i % 2) * 8} l 4 -12 M${dx + 8} ${-28 - (i % 2) * 8} l -2 -14`} stroke="#5E7E3A" strokeWidth={3} strokeLinecap="round" />)}</g>;
    case 'caja': return <Caja x={x} y={yy} s={s} f={f} luz={props.luz === true} />;
    case 'fogata': return <g transform={`translate(${x} ${yy})`}><path d="M-50 0 L 40 -20 M-40 -20 L 50 0" stroke={N.cortezaOsc} strokeWidth={14} strokeLinecap="round" /><g transform="translate(0 -14)"><Fuego f={f} s={0.8 * s} /></g></g>;
    default: return null;
  }
}
