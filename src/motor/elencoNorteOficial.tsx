// Diseños oficiales norteamericanos (2026-10-15) para los Shorts "Who is…?" y los episodios nuevos (tema "pintado").
// Misma receta que los nórdicos aprobados (versión "A"): el muñeco de siempre, piel morena natural (nunca roja),
// ropa simple de cuero o tela de cada nación y la identidad en 2–3 atributos claros. Cada personaje lleva la nación
// de la versión que cuenta la T1 (ver PLAN-NORTEAMERICANAS.md); nada de "indio" genérico, nada de tocado de plumas
// fuera de las Llanuras, nada de crestas de clan copiadas. Los animales protagonistas se dibujan acá como personajes.
// Las claves viejas (mujer_cielo, brote, coyote…) de elenco.tsx quedan intactas; estas terminan en _oficial.
// Coordenadas: cuerpo con origen en los pies (hombros y≈-300, cintura -210); cabeza con el ojo en (18,-6).
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, miembro, type P, type PersonajeProps } from '../comun/vasija';
import type { DibujoProps } from './elencoAzteca';
import type { Ficha } from './elenco';

const N = '#1C1612';
const PIEL_H = '#8E5634', PIEL_M = '#A2673F';
const CUERO = '#B98A55', CUERO_OSC = '#8A6236', OCRE = '#B23A24', AZUL = '#2F5D8A', AMARILLO = '#D9A23A', BLANCO = '#FCF7EC';
const r1 = (v: number) => v.toFixed(1);

// ---------- ropa (coordenadas del cuerpo) ----------
/** Camisa de cuero con flecos en el borde y una banda de cuentas sobre el pecho. */
const Camisa: React.FC<{ c?: string; banda?: string; banda2?: string; a?: number }> = ({ c = CUERO, banda = AZUL, banda2 = BLANCO, a = 1 }) => {
  const f = useCurrentFrame();
  const torso: P[] = [[-22 * a, -304], [18 * a, -306], [36 * a, -284], [32 * a, -246], [28 * a, -200], [-30 * a, -198], [-32 * a, -250], [-32 * a, -286]];
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => { const x = -28 * a + i * 6.2 * a; return <path key={i} d={`M${r1(x)} -201 l ${r1(Math.sin(f / 10 + i) * 1.5)} 12`} stroke={CUERO_OSC} strokeWidth={2.4} strokeLinecap="round" />; })}
      <path d={suave(torso, true)} fill={c} stroke={N} strokeWidth={2} />
      <path d={suave([[-20 * a, -294], [6 * a, -278], [30 * a, -290]])} stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d={suave([[-20 * a, -294], [6 * a, -278], [30 * a, -290]])} stroke={banda} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={suave([[-20 * a, -294], [6 * a, -278], [30 * a, -290]])} stroke={banda2} strokeWidth={2.6} strokeDasharray="1 7" fill="none" strokeLinecap="round" />
      <path d={`M${r1(-30 * a)} -212 L ${r1(28 * a)} -214`} stroke={banda} strokeWidth={6} />
    </g>
  );
};
/** Bandas de cuentas con "domos del cielo" (motivo haudenosaunee): arcos sobre una línea, en blanco. */
const Domos: React.FC<{ x0: number; x1: number; y: number; c?: string; n?: number }> = ({ x0, x1, y, c = BLANCO, n = 5 }) => {
  const w = (x1 - x0) / n;
  return <g>{Array.from({ length: n }, (_, i) => <path key={i} d={`M${r1(x0 + i * w + 2)} ${y} a ${r1(w / 2 - 2)} ${r1(w / 2 - 2)} 0 0 1 ${r1(w - 4)} 0`} stroke={c} strokeWidth={2.4} fill="none" />)}<path d={`M${x0} ${y + 3} H ${x1}`} stroke={c} strokeWidth={2} /></g>;
};
/** Flor de cuentas (estilo floral de los Bosques del norte). */
const Flor: React.FC<{ x: number; y: number; r?: number; c?: string; c2?: string }> = ({ x, y, r = 5, c = OCRE, c2 = AMARILLO }) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={0} cy={-r} rx={r * 0.55} ry={r} fill={i % 2 ? c : '#D96A8A'} stroke={N} strokeWidth={0.9} transform={`rotate(${i * 72})`} />)}
    <circle r={r * 0.5} fill={c2} stroke={N} strokeWidth={0.9} />
  </g>
);
const Hoja: React.FC<{ x: number; y: number; ang: number; l?: number; c?: string }> = ({ x, y, ang, l = 12, c = '#4C8A3E' }) => <path transform={`translate(${x} ${y}) rotate(${ang})`} d={`M0 0 C ${-l * 0.4} ${-l * 0.4}, ${-l * 0.3} ${-l * 0.9}, 0 ${-l} C ${l * 0.3} ${-l * 0.9}, ${l * 0.4} ${-l * 0.4}, 0 0 Z`} fill={c} stroke={N} strokeWidth={1.2} />;

// ---------- Mujer del Cielo ----------
/** Pelo suelto y largo que flota hacia atrás (ella cae del cielo) con dos flores blancas del árbol de la luz. */
const PeloSuelto: React.FC = () => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f / 16 + k) * 3;
  return (
    <g>
      <path d={suave([[-24, -30], [-40, -10], [-48 + o(1), 30], [-50 + o(2), 74], [-40 + o(3), 108], [-28, 90], [-24, 50], [-18, 10]], true, 0.7)} fill={N} />
      <path d="M-36 0 C -42 30, -44 60, -38 90" stroke="#4A3A30" strokeWidth={1.6} fill="none" />
      {[[-26, -30], [-14, -38]].map(([x, y], i) => <g key={i}>{[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={x + Math.cos(k * 1.256) * 4.5} cy={y + Math.sin(k * 1.256) * 4.5} r={3.6} fill={BLANCO} stroke={N} strokeWidth={0.9} />)}<circle cx={x} cy={y} r={2.4} fill={AMARILLO} /></g>)}
    </g>
  );
};
/** Mata de fresa con raíces colgando (lo que arrancó al caer). Va en la mano de atrás. */
const MataRaices: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 12) * 3;
  return (
    <g transform="translate(0 6)">
      {[-8, -2, 4, 9].map((x, i) => <path key={i} d={`M${x * 0.4} 0 C ${x} 16, ${x * 1.6 + o} 30, ${x * 1.4 + o} ${42 + i * 4}`} stroke="#7A5A3A" strokeWidth={2.2} fill="none" strokeLinecap="round" />)}
      <path d="M0 -2 C -2 -20, 2 -34, 6 -44" stroke="#3E6B35" strokeWidth={3} fill="none" />
      <Hoja x={2} y={-28} ang={-50} l={18} /><Hoja x={4} y={-36} ang={30} l={16} /><Hoja x={6} y={-44} ang={-10} l={16} />
      <path d="M6 -24 C 12 -22, 16 -18, 16 -12 C 16 -6, 10 -6, 8 -10 C 6 -14, 4 -20, 6 -24 Z" fill={OCRE} stroke={N} strokeWidth={1.2} />
      {[[10, -16], [13, -12]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={0.9} fill={AMARILLO} />)}
    </g>
  );
};

// ---------- Brote y Pedernal (los gemelos) ----------
/** Arbolito con hojas nuevas (Brote = el que hace crecer las plantas). Va en la mano. */
const Arbolito: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 14) * 2;
  return (
    <g transform="rotate(-6)">
      <path d="M0 40 C -2 0, 2 -50, 0 -96" stroke={N} strokeWidth={8} strokeLinecap="round" fill="none" />
      <path d="M0 40 C -2 0, 2 -50, 0 -96" stroke="#7A5A3A" strokeWidth={4.5} strokeLinecap="round" fill="none" />
      <path d="M0 -50 C 10 -60, 18 -64, 26 -76 M0 -70 C -10 -78, -16 -84, -20 -96" stroke="#7A5A3A" strokeWidth={3} fill="none" strokeLinecap="round" />
      {[[0, -96, 0], [26, -76, 30], [-20, -96, -30], [10, -110, 10], [-12, -80, -60], [16, -62, 70], [-6, -116, -14], [30, -92, 40]].map(([x, y, a], i) => <Hoja key={i} x={x} y={y} ang={a + o * (i % 2 ? 1 : -1)} l={20} c={i % 2 ? '#4C8A3E' : '#7DB85A'} />)}
    </g>
  );
};
/** Banda de hojas en la cabeza (Brote). */
const BandaHojas: React.FC = () => (
  <g>
    <path d="M-31 -2 C -16 -18, 8 -26, 29 -20" stroke={N} strokeWidth={8} fill="none" />
    <path d="M-31 -2 C -16 -18, 8 -26, 29 -20" stroke="#4C8A3E" strokeWidth={5} fill="none" />
    <Hoja x={-24} y={-8} ang={-60} l={18} c="#7DB85A" /><Hoja x={-18} y={-14} ang={-30} l={20} /><Hoja x={-10} y={-18} ang={-6} l={16} c="#7DB85A" />
  </g>
);
/** Cresta de pedernal: lajas grises y filosas sobre la cabeza (Pedernal tiene el cuerpo de piedra). */
const CrestaPedernal: React.FC = () => (
  <g>
    {[[-30, -4, -120], [-28, -20, -100], [-20, -32, -78], [-6, -38, -60], [8, -36, -40]].map(([x, y, a], i) => <path key={i} transform={`translate(${x} ${y}) rotate(${a + 90})`} d={`M-6 0 L 0 ${-22 - (i % 2) * 6} L 7 0 Z`} fill={i % 2 ? '#8C939C' : '#B5BCC4'} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />)}
    <path d="M-31 -2 C -16 -18, 8 -26, 29 -20" stroke={N} strokeWidth={8} fill="none" />
    <path d="M-31 -2 C -16 -18, 8 -26, 29 -20" stroke="#6E747C" strokeWidth={5} fill="none" />
  </g>
);
/** Lanza con punta grande de pedernal. Va en la mano. */
const LanzaPedernal: React.FC = () => (
  <g>
    <path d="M0 80 L 0 -130" stroke={N} strokeWidth={8} strokeLinecap="round" />
    <path d="M0 78 L 0 -128" stroke="#7A5A3A" strokeWidth={4.5} strokeLinecap="round" />
    <path d="M-4 -126 h 8 v 10 h -8 Z" fill={OCRE} stroke={N} strokeWidth={1.4} />
    <path d="M0 -176 L 11 -150 L 6 -140 L 8 -128 L -8 -128 L -6 -140 L -11 -150 Z" fill="#9AA2AC" stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <path d="M0 -168 L 4 -148 M-3 -150 L 2 -136" stroke="#D5DAE0" strokeWidth={1.6} />
  </g>
);
/** Zigzag de pedernal sobre la camisa (Pedernal). */
const ZigzagPecho: React.FC = () => <path d="M-26 -250 l 8 -8 l 8 8 l 8 -8 l 8 8 l 8 -8 l 8 8 l 8 -8" stroke="#D5DAE0" strokeWidth={3} fill="none" strokeLinejoin="round" />;

// ---------- El Sol (cherokee) ----------
/** Disco del Sol detrás de la cabeza: círculo dorado con rayos cortos (sencillo, distinto del azteca). */
const Resplandor: React.FC = () => {
  const f = useCurrentFrame(), b = 1 + Math.sin(f / 10) * 0.03;
  return (
    <g transform={`translate(-6 -342) scale(${b})`}>
      <circle r={96} fill="url(#halo)" opacity={0.7} />
      {Array.from({ length: 16 }, (_, i) => <path key={i} transform={`rotate(${i * 22.5})`} d="M0 -62 L 0 -82" stroke={i % 2 ? OCRE : AMARILLO} strokeWidth={6} strokeLinecap="round" />)}
      <circle r={58} fill="#F2C24A" stroke={N} strokeWidth={2.6} />
      <circle r={46} fill="none" stroke={AMARILLO} strokeWidth={6} />
    </g>
  );
};

// ---------- Nanabozho (anishinaabe) ----------
/** Bolsa bandolera (gashkibidaagan) de terciopelo negro con flores de cuentas, cruzada sobre el pecho. */
const Bandolera: React.FC = () => (
  <g>
    <path d="M-20 -304 L 30 -214" stroke={N} strokeWidth={14} strokeLinecap="round" />
    <path d="M-20 -304 L 30 -214" stroke="#2A2230" strokeWidth={10} strokeLinecap="round" />
    {[0.2, 0.45, 0.7].map((t, i) => <Flor key={i} x={-20 + 50 * t} y={-304 + 90 * t} r={3.4} />)}
    <path d="M14 -232 L 44 -230 L 46 -186 L 12 -188 Z" fill="#2A2230" stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <Flor x={29} y={-210} r={6} />
    <Hoja x={20} y={-200} ang={-50} l={10} /><Hoja x={38} y={-200} ang={50} l={10} />
    {[16, 22, 28, 34, 40].map((x) => <path key={x} d={`M${x} -188 l 0 10`} stroke={OCRE} strokeWidth={2.2} strokeLinecap="round" />)}
  </g>
);
/** Banda floral en la cabeza (Nanabozho). */
const BandaFloral: React.FC = () => (
  <g>
    <path d="M-31 -2 C -16 -18, 8 -26, 29 -20" stroke={N} strokeWidth={9} fill="none" />
    <path d="M-31 -2 C -16 -18, 8 -26, 29 -20" stroke="#2A2230" strokeWidth={6} fill="none" />
    <Flor x={-18} y={-12} r={3.2} /><Flor x={2} y={-20} r={3.2} c={AZUL} /><Flor x={20} y={-22} r={3} />
  </g>
);
/** Puñado de tierra (la que trajo la Rata Almizclera y que él pone sobre la Tortuga). */
const PunadoTierra: React.FC = () => <g transform="translate(6 -8)"><path d={suave([[-12, 4], [-10, -8], [0, -14], [12, -10], [14, 2], [2, 8]], true)} fill="#6A4A2E" stroke={N} strokeWidth={1.6} />{[[-4, -6], [6, -4], [0, 2]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.4} fill="#9A7A52" />)}<Hoja x={2} y={-12} ang={10} l={10} /></g>;

// ---------- animales ----------
const ojo = (x: number, y: number, r = 5, iris = '#3A2312') => <g><ellipse cx={x} cy={y} rx={r} ry={r * 0.9} fill={BLANCO} stroke={N} strokeWidth={1.4} /><circle cx={x + r * 0.2} cy={y} r={r * 0.55} fill={iris} /><circle cx={x + r * 0.25} cy={y} r={r * 0.3} fill={N} /><circle cx={x + r * 0.45} cy={y - r * 0.3} r={r * 0.18} fill={BLANCO} /></g>;

/** Gran Tortuga (haudenosaunee): tortuga mordedora con la Isla Tortuga en el lomo (tierra, pasto y un árbol). */
const GranTortuga: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, isla = true }) => {
  const p = moviendo ? Math.sin(f / 5) * 8 : 0, cab = Math.sin(f / 30) * 2;
  const casco: P[] = [[-170, -46], [-150, -110], [-80, -150], [20, -154], [110, -128], [160, -70], [168, -40]];
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {[[-120, p], [90, -p]].map(([px, d], i) => <path key={i} d={miembro([[px, -44], [px + 6 + d, -20], [px + 14 + d, 0]], [40, 34, 30])} fill="#5E7A4A" stroke={N} strokeWidth={2.4} />)}
      <path d="M-166 -48 L -214 -30 L -170 -28 Z" fill="#5E7A4A" stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <g transform={`translate(${160} ${-62 + cab})`}>
        <path d={suave([[-24, 20], [-10, -18], [24, -28], [58, -18], [70, 0], [56, 16], [20, 24]], true)} fill="#6E8A56" stroke={N} strokeWidth={2.4} />
        <path d="M56 6 C 62 10, 68 8, 70 2" stroke={N} strokeWidth={1.8} fill="none" />
        <path d="M66 -4 L 74 2 L 64 6" fill="#4A6638" stroke={N} strokeWidth={1.4} />
        {ojo(34, -8, 6, '#6A4A1E')}
        <path d="M24 -16 Q 34 -22 44 -16" stroke={N} strokeWidth={2} fill="none" />
      </g>
      <path d={suave(casco, false)} fill="none" />
      <path d={suave([...casco, [120, -34], [0, -30], [-120, -34]], true, 0.8)} fill="#56603A" stroke={N} strokeWidth={3} />
      {[[-110, -96], [-40, -122], [36, -124], [104, -96], [-74, -60], [0, -70], [76, -60]].map(([cx, cy], i) => <path key={i} d={`M${cx - 26} ${cy} l 13 -18 h 26 l 13 18 l -13 18 h -26 Z`} fill={i % 2 ? '#6E7A48' : '#62703F'} stroke="#2E3420" strokeWidth={2} strokeLinejoin="round" />)}
      <path d="M-170 -40 C -100 -24, 100 -24, 168 -38" stroke="#C9B278" strokeWidth={8} fill="none" />
      <path d="M-170 -40 C -100 -24, 100 -24, 168 -38" stroke={N} strokeWidth={2} fill="none" strokeDasharray="10 14" />
      {[[-90, 0], [90, 0]].map(([px, d], i) => <path key={i} d={miembro([[px, -38], [px + 10 + d, -18], [px + 18 + d, 0]], [42, 36, 32])} fill="#6E8A56" stroke={N} strokeWidth={2.4} />)}
      {[-90, 90].map((px) => <path key={px} d={`M${px + 4} 0 l 6 -6 M${px + 14} 0 l 6 -6 M${px + 24} 0 l 4 -6`} stroke={N} strokeWidth={2} />)}
      {isla !== false && (
        <g>
          <path d={suave([[-100, -138], [-60, -170], [0, -186], [60, -176], [100, -146], [60, -150], [0, -152], [-60, -148]], true)} fill="#7A5A3A" stroke={N} strokeWidth={2.4} />
          <path d={suave([[-96, -142], [-60, -172], [0, -188], [60, -178], [98, -148]])} stroke="#5E9A44" strokeWidth={9} fill="none" strokeLinecap="round" />
          {[-70, -40, 30, 70].map((gx, i) => <path key={i} d={`M${gx} ${-170 - (i % 2) * 8} l -3 -10 M${gx + 4} ${-170 - (i % 2) * 8} l 3 -12`} stroke="#3E6B35" strokeWidth={2.4} strokeLinecap="round" />)}
          <path d="M-4 -184 C -6 -214, -2 -240, 0 -262" stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d="M-4 -184 C -6 -214, -2 -240, 0 -262" stroke="#7A5A3A" strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d="M-2 -230 C 10 -240, 18 -246, 26 -258 M-2 -220 C -12 -230, -20 -236, -26 -246" stroke="#7A5A3A" strokeWidth={4} fill="none" strokeLinecap="round" />
          {[[-30, -258, 26], [30, -262, 26], [0, -292, 32], [-18, -284, 24], [20, -286, 24]].map(([cx, cy, rr], i) => <circle key={i} cx={cx} cy={cy} r={rr} fill={i % 2 ? '#5E9A44' : '#4C8A3E'} stroke={N} strokeWidth={2.4} />)}
          {[[-30, -258, 26], [30, -262, 26], [0, -292, 32], [-18, -284, 24], [20, -286, 24]].map(([cx, cy, rr], i) => <circle key={`r${i}`} cx={cx} cy={cy} r={rr - 2.4} fill={i % 2 ? '#5E9A44' : '#4C8A3E'} />)}
          <path d="M-20 -292 C -10 -306, 8 -308, 18 -298 M-40 -264 C -34 -274, -24 -276, -18 -270" stroke="#7DB85A" strokeWidth={3} fill="none" strokeLinecap="round" />
          {[[34, -170], [-30, -176]].map(([sx, sy], i) => <path key={i} d={`M${sx} ${sy} c 4 0, 6 4, 5 8 c -1 4, -6 6, -8 2 c -2 -4, 0 -10, 3 -10 Z`} fill={OCRE} stroke={N} strokeWidth={1.2} />)}
        </g>
      )}
    </g>
  );
};

/** Rata almizclera (Wazhashk): parada sobre las patas de atrás, con el puñado de barro del fondo del agua. */
const RataAlmizclera: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, color = '#6A4A32', barro = true }) => {
  const r = Math.sin(f / 14) * 2, cola = Math.sin(f / 10) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-30 -10 C -70 -6, -100 ${-2 + cola}, -128 ${8 + cola}`} stroke={N} strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d={`M-30 -10 C -70 -6, -100 ${-2 + cola}, -128 ${8 + cola}`} stroke="#3A2E2A" strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={`M-40 -10 C -70 -6, -100 ${-2 + cola}, -124 ${7 + cola}`} stroke="#5A4A42" strokeWidth={1.4} fill="none" strokeDasharray="3 5" />
      <path d="M-26 0 C -30 -8, -12 -12, -2 -4 L 6 0 Z" fill="#3A2E2A" stroke={N} strokeWidth={1.8} />
      <path d={suave([[-44, -10], [-46, -60], [-24, -106], [8, -116], [26, -96], [28, -50], [16, -10], [-16, -2]], true)} fill={color} stroke={N} strokeWidth={2.4} />
      <path d={suave([[-8, -96], [14, -84], [16, -44], [2, -14], [-12, -30]], true)} fill="#9A7652" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${-36 + i * 6} ${-80 + i * 14} q -4 8 0 14`} stroke="#4E3624" strokeWidth={1.8} fill="none" />)}
      <path d="M10 -2 C 6 -10, 22 -14, 30 -6 L 32 0 Z" fill="#3A2E2A" stroke={N} strokeWidth={1.8} />
      <g transform={`translate(10 -124) rotate(${r})`}>
        <path d={suave([[-30, 18], [-28, -10], [-6, -26], [20, -22], [36, -8], [46, 2], [38, 12], [12, 22]], true)} fill={color} stroke={N} strokeWidth={2.4} />
        <circle cx={-14} cy={-20} r={7} fill={color} stroke={N} strokeWidth={1.8} /><circle cx={-14} cy={-20} r={3} fill="#B8857A" />
        <ellipse cx={45} cy={0} rx={4} ry={3.4} fill={N} />
        {ojo(18, -8, 5)}
        <path d="M36 8 l 16 -2 M36 11 l 14 4" stroke={N} strokeWidth={1} />
      </g>
      <g transform="translate(30 -66)">
        {barro !== false && <path d={suave([[-12, 6], [-12, -10], [2, -18], [16, -10], [16, 6], [2, 12]], true)} fill="#5A3E26" stroke={N} strokeWidth={1.8} />}
        {barro !== false && <path d="M-4 -10 q 4 -3 8 0" stroke="#8A6A46" strokeWidth={1.6} fill="none" />}
        <path d="M-22 -2 C -14 4, -8 6, -4 4" stroke={N} strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M-22 -2 C -14 4, -8 6, -4 4" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

/** Escarabajo de agua (Dâyuni'sï, "nieto del castor"): redondo, negro azulado y brillante, con su bola de barro. */
const EscarabajoAgua: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f }) => {
  const p = moviendo ? Math.sin(f / 2.5) * 6 : Math.sin(f / 12) * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <g transform="translate(112 -26) scale(0.8)">
        <path d={suave([[-26, 22], [-28, -6], [-10, -26], [16, -26], [30, -6], [26, 20], [0, 30]], true)} fill="#6A4A2E" stroke={N} strokeWidth={2.4} />
        <path d="M-14 -12 q 8 -6 16 0 M2 6 q 8 -6 14 0" stroke="#9A7A52" strokeWidth={2} fill="none" />
      </g>
      {[-40, -6, 26].map((lx, i) => <g key={i}><path d={`M${lx} -30 l ${-16 + (i % 2 ? p : -p)} 30 l -8 0`} stroke={N} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>)}
      <ellipse cx={-6} cy={-50} rx={64} ry={42} fill="#1E2A3A" stroke={N} strokeWidth={2.6} />
      <path d="M-6 -92 V -10" stroke={N} strokeWidth={2.2} />
      <path d="M-50 -66 C -40 -82, -22 -88, -10 -88" stroke="#6E9CC0" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M8 -84 C 22 -82, 34 -74, 42 -62" stroke="#3E5E80" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={suave([[50, -44], [58, -64], [78, -66], [88, -50], [80, -34], [58, -30]], true)} fill="#26344A" stroke={N} strokeWidth={2.2} />
      {ojo(74, -54, 6, '#8A6A2E')}
      <path d="M86 -60 C 96 -74, 104 -78, 112 -76 M84 -64 C 90 -82, 96 -88, 104 -90" stroke={N} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {[-30, 0, 30].map((lx, i) => <path key={i} d={`M${lx} -26 l ${14 - (i % 2 ? p : -p)} 26 l 8 0`} stroke={N} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
    </g>
  );
};

/** Cuervo (tlingit) parado, negro con brillo azul, que se lleva la luz en el pico. props.luz = false lo saca. */
const Cuervo: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, luz = true, color = '#16171C' }) => {
  const cab = Math.sin(f / 18) * 3, p = moviendo ? Math.sin(f / 3) * 8 : 0, b = 1 + Math.sin(f / 6) * 0.06;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-14 -50 L ${-20 + p} -6 L -34 0 M${-20 + p} -6 L -10 0 M8 -50 L ${12 - p} -6 L 0 0 M${12 - p} -6 L 24 0`} stroke="#2A2420" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(0 22)">
      <path d="M-74 -104 L -150 -72 L -136 -90 L -156 -84 L -96 -126 Z" fill={color} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d={suave([[-90, -110], [-60, -170], [-10, -196], [34, -188], [52, -150], [36, -100], [0, -70], [-50, -76]], true)} fill={color} stroke="#3A3A44" strokeWidth={2.4} />
      <path d={suave([[-70, -116], [-40, -160], [6, -170], [30, -150], [10, -120], [-30, -100]], true)} fill="#22242C" stroke="#3A3A44" strokeWidth={1.6} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-56 + i * 18} ${-132 + i * 4} C ${-46 + i * 18} ${-146 + i * 4}, ${-30 + i * 18} ${-150 + i * 4}, ${-20 + i * 18} ${-144 + i * 4}`} stroke="#4E6A9A" strokeWidth={2.4} fill="none" strokeLinecap="round" />)}
      <g transform={`translate(30 -196) rotate(${cab})`}>
        <path d={suave([[-30, 34], [-28, 0], [-6, -24], [22, -22], [36, -6], [30, 22], [6, 40]], true)} fill={color} stroke="#3A3A44" strokeWidth={2.4} />
        <path d="M28 -10 C 52 -12, 72 -6, 82 4 C 66 6, 50 6, 30 8 Z" fill="#2A2C34" stroke={N} strokeWidth={2} strokeLinejoin="round" />
        <path d="M30 8 C 50 8, 66 8, 78 8 C 66 16, 48 18, 30 16 Z" fill="#2A2C34" stroke={N} strokeWidth={2} strokeLinejoin="round" />
        <path d="M-4 -16 C 6 -22, 16 -20, 22 -14" stroke="#4E6A9A" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <circle cx={12} cy={-4} r={6} fill={BLANCO} stroke={N} strokeWidth={1.4} /><circle cx={13.5} cy={-4} r={3.4} fill={N} /><circle cx={15} cy={-6} r={1.2} fill={BLANCO} />
        {luz !== false && <g transform={`translate(80 10) scale(${b})`}><circle r={40} fill="url(#halo)" /><circle r={15} fill="#FFE38A" stroke="#E0A53A" strokeWidth={3} /><circle r={8} fill="#FFF6D6" /></g>}
      </g>
      </g>
    </g>
  );
};

/** Coyote (wasco / nimiipuu): flaco y orejón, gris leonado con panza clara, cola espesa con punta negra, mirada pícara. */
const Coyote: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, corriendo, boca, f, color = '#B08A5A' }) => {
  const fase = moviendo || corriendo ? f * (corriendo ? 0.36 : 0.2) : 0, amp = corriendo ? 30 : moviendo ? 18 : 0;
  const pata = (cx: number, ph: number, del: boolean, c: string) => {
    const a = Math.sin(fase + ph) * amp;
    const k: P = [cx + Math.sin((a * Math.PI) / 180) * 40, -100 + 44], pie: P = [k[0] + (del ? 6 : -6) + Math.sin(((a + 10) * Math.PI) / 180) * 30, -2];
    return <g><path d={miembro([[cx, -104], k, pie], [30, 17, 13])} fill={c} stroke={N} strokeWidth={2} /><ellipse cx={pie[0] + 5} cy={-5} rx={11} ry={6} fill={c} stroke={N} strokeWidth={2} /></g>;
  };
  const cola = Math.sin(f / 12) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {pata(-66, Math.PI, false, '#8E6E46')}
      {pata(58, 0, true, '#8E6E46')}
      <path d={suave([[-90, -122], [-132, -104 + cola], [-150, -66 + cola], [-126, -70 + cola], [-104, -96]], true)} fill={color} stroke={N} strokeWidth={2.2} />
      <path d={`M-150 ${-66 + cola} C -146 ${-80 + cola}, -138 ${-90 + cola}, -132 ${-96 + cola} L -126 ${-70 + cola} Z`} fill={N} />
      <path d={suave([[-96, -128], [-50, -146], [30, -144], [80, -132], [96, -108], [78, -84], [20, -82], [-60, -86], [-96, -100]], true)} fill={color} stroke={N} strokeWidth={2.4} />
      <path d={suave([[-70, -90], [-10, -84], [60, -88], [86, -100]])} stroke="#E9DCC0" strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M-60 -140 C -30 -150, 20 -150, 60 -140" stroke="#7A6044" strokeWidth={5} fill="none" strokeLinecap="round" />
      {pata(-48, 0, false, color)}
      {pata(74, Math.PI, true, color)}
      <g transform={`translate(96 -136) rotate(${Math.sin(f / 20) * 3})`}>
        <path d="M-12 -18 L -16 -62 L 8 -30 Z" fill={color} stroke={N} strokeWidth={2} strokeLinejoin="round" />
        <path d="M-10 -24 L -12 -52 L 2 -30 Z" fill="#E9DCC0" />
        <path d={suave([[-26, 18], [-26, -14], [-4, -30], [18, -24], [34, -10], [60, -2], [66, 6], boca ? [44, 12] : [58, 14], [24, 22], [0, 26]], true, 0.8)} fill={color} stroke={N} strokeWidth={2.4} />
        <path d="M2 -26 L 6 -66 L 22 -24 Z" fill={color} stroke={N} strokeWidth={2} strokeLinejoin="round" />
        <path d="M6 -28 L 8 -54 L 16 -28 Z" fill="#E9DCC0" />
        <path d={suave([[-18, 12], [10, 20], [40, 16], [58, 12]])} stroke="#E9DCC0" strokeWidth={7} fill="none" strokeLinecap="round" />
        <ellipse cx={64} cy={2} rx={4.4} ry={4} fill={N} />
        {boca && <path d="M40 12 L 62 14 L 44 22 Z" fill="#9A2A2A" stroke={N} strokeWidth={1.4} />}
        <path d="M10 -10 Q 20 -16 30 -10 Q 20 -7 10 -10 Z" fill="#E8B04A" stroke={N} strokeWidth={1.4} />
        <circle cx={22} cy={-10} r={2.6} fill={N} />
        <path d="M8 -15 Q 20 -14 32 -18" stroke={N} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <path d="M44 10 Q 50 13 56 10" stroke={N} strokeWidth={1.6} fill="none" />
      </g>
    </g>
  );
};

// ---------- fichas ----------
type PP = Partial<PersonajeProps>;
/** Mechones largos de la nuca dibujados como adorno: el muñeco va con peloCorto para que no salgan la espiral de la
 * oreja ni las rayas blancas del cuello (Matías las rechazó en Loki) y el pelo largo se repone acá, limpio. */
const PeloNuca: React.FC<{ mujer?: boolean; c?: string }> = ({ mujer, c = N }) => {
  const f = useCurrentFrame(), o = (i: number) => Math.sin(f * 0.3 / 4 - i * 0.9) * (2 + i);
  return <g>{[0, 1, 2].map((i) => <path key={i} d={suave([[-22 + i * 6, 6], [-30 + i * 4, 30 + o(i) * 0.3], [-26 + i * 5, 54 + o(i + 1) * 0.4], [-32 + i * 6, mujer ? 90 : 70]])} stroke={c} strokeWidth={mujer ? 11 : 9} fill="none" strokeLinecap="round" />)}</g>;
};
/** Dos trenzas por delante del hombro, sin las rayitas claras del muñeco (se leían como rayones en el cuello). */
const TrenzasLimpias: React.FC<{ c?: string; ata?: string }> = ({ c = N, ata = '#B23A24' }) => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f * 0.3 / 4 - k * 0.9) * (2 + k);
  return <g>{[0, 1].map((k) => { const pts: P[] = [[-14 - k * 8, 4], [-12 - k * 6, 40 + o(k) * 0.2], [-4 - k * 4, 80], [0 - k * 3, 112]]; return <g key={k} opacity={k ? 0.85 : 1}><path d={suave(pts)} stroke={c} strokeWidth={11} fill="none" strokeLinecap="round" />{[30, 58, 86].map((yy, j) => <path key={j} d={`M${-8 - k * 6} ${yy} l 8 5`} stroke="#4A3A30" strokeWidth={1.4} />)}<rect x={pts[3][0] - 7} y={96} width={14} height={8} rx={2} fill={ata} stroke={N} strokeWidth={1.2} /></g>; })}</g>;
};
/** Cara y cuello limpios: peloCorto siempre; si no lleva trenzas ni pelo corto propio, se le ponen los mechones. */
const limpio = (p: PP, mujerDef: boolean, trenzasDef: boolean): PP => {
  const mujer = p.mujer ?? mujerDef, trenzas = p.trenzas ?? trenzasDef;
  if (p.peloCorto) return p;
  if (trenzas) return { ...p, peloCorto: true, trenzas: false, adornos: { ...p.adornos, cabeza: <><TrenzasLimpias />{p.adornos?.cabeza}</> } };
  return { ...p, peloCorto: true, adornos: { ...p.adornos, cabeza: <><PeloNuca mujer={mujer} />{p.adornos?.cabeza}</> } };
};
const H = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: limpio({ barba: false, tocado: null, collar: false, piel: PIEL_H, ...p }, false, false), griego: nombre });
const M = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: limpio({ mujer: true, tocado: null, piel: PIEL_M, ...p }, true, true), griego: nombre });
const D = (Dibujo: React.FC<DibujoProps>, p: Record<string, unknown>, nombre: string): Ficha => ({ tipo: 'dibujo', Dibujo, p, griego: nombre });

export const ELENCO_NORTE_OFICIAL: Record<string, Ficha> = {
  // Haudenosaunee (T1 eps. 1–4)
  mujer_cielo_oficial: M({ ropaColor: '#6E9CC0', trenzas: false, objeto: 'semillas', adornos: {
    cabeza: <PeloSuelto />,
    cuerpo: <><Domos x0={-24} x1={30} y={-268} n={4} /><Domos x0={-38} x1={50} y={-32} n={6} /><Domos x0={-34} x1={40} y={-136} n={5} c={AZUL} /></>,
    manoAtras: <MataRaices />,
  } }, 'SKY WOMAN'),
  gran_tortuga_oficial: D(GranTortuga, { s: 0.85 }, 'GREAT TURTLE'),
  rata_almizclera_oficial: D(RataAlmizclera, { s: 1.1 }, 'MUSKRAT'),
  brote_oficial: H({ trenzas: false, brazo: [42, 18], ropaColor: CUERO, ribete: '#4C8A3E', adornos: {
    cabeza: <BandaHojas />,
    cuerpo: <Camisa c="#C9A06A" banda="#4C8A3E" banda2={BLANCO} />,
    mano: <Arbolito />,
  } }, 'SAPLING'),
  pedernal_oficial: H({ trenzas: false, ropaColor: '#5A5E66', ribete: '#B5BCC4', adornos: {
    cabeza: <CrestaPedernal />,
    cuerpo: <><Camisa c="#6E727A" banda="#3A3E46" banda2="#D5DAE0" /><ZigzagPecho /></>,
    mano: <LanzaPedernal />,
  } }, 'FLINT'),
  // Cherokee (T1 eps. 5–7)
  escarabajo_agua_oficial: D(EscarabajoAgua, { s: 1.4 }, 'WATER BEETLE'),
  sol_oficial: M({ ropaColor: OCRE, adornos: {
    detras: <Resplandor />,
    cabeza: <path d="M-31 -2 C -16 -18, 8 -26, 29 -20" stroke={AMARILLO} strokeWidth={7} fill="none" />,
    cuerpo: <><Domos x0={-38} x1={50} y={-30} n={6} c={AMARILLO} /><path d="M-26 -286 Q 4 -268 32 -280" stroke={AMARILLO} strokeWidth={5} fill="none" /></>,
  } }, 'THE SUN'),
  // Anishinaabe (T1 ep. 8)
  nanabozho_oficial: H({ trenzas: true, ropaColor: CUERO, ribete: OCRE, adornos: {
    cabeza: <BandaFloral />,
    cuerpo: <><Camisa c="#C9A06A" banda="#2A2230" banda2={AMARILLO} /><Bandolera /></>,
    mano: <PunadoTierra />,
  } }, 'NANABOZHO'),
  // Costa noroeste (T1 eps. 9–10) y Meseta (eps. 11–12)
  cuervo_oficial: D(Cuervo, { s: 1 }, 'RAVEN'),
  coyote_oficial: D(Coyote, { s: 1 }, 'COYOTE'),
};
export const NOMBRE_EN_NORTE_OFICIAL: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_NORTE_OFICIAL).map(([k, f]) => [k, f.griego as string]));
