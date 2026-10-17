// Diseños oficiales hawaianos (2026-10-15) para los Shorts "Who is…?" y los episodios nuevos (tema kapa).
// Mismo muñeco del canal con piel natural, ropa simple de kapa y 2–3 señas que se reconocen de un vistazo.
// Cultura viva: iconografía tradicional y respetuosa (pāʻū, malo, kīhei, lei, ʻahuʻula, mahiole), sin caricatura.
// Los pele/hiiaka/maui/… de elenco.tsx quedan intactos; estas son las claves *_oficial.
import { CanidoEpico, DelfinEpico } from './bestiasEpicas'; // animales épicos (mismo dibujo que los griegos)
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, type P, type PersonajeProps } from '../comun/vasija';
import type { DibujoProps } from './elencoAzteca';
import type { Ficha } from './elenco';
import { N, r1, PeloLargo, PeloMedio, Mono, BarbaCorta, CoronaFlores, Lehua, Kihei, BandaFalda, CapaEspalda, Aura } from './piezasPolinesias';

const PELO = '#1E1611', PELO_LUZ = '#5E4A3A';
const PIEL_H = '#8E5636', PIEL_M = '#A66B43';
const ROJO = '#B2331F', AMARILLO = '#E8B81C', CREMA = '#F4E6C8';

// ---------- collares ----------
/** Lei de flores: la parte que se ve de perfil, del cuello al pecho. */
const LeiFlores: React.FC<{ colores: string[]; lehua?: boolean }> = ({ colores, lehua }) => (
  <g>{Array.from({ length: 6 }, (_, i) => { const t = i / 5, cx = 2 + t * 26 + Math.sin(t * Math.PI) * 4, cy = -300 + t * 40; return lehua ? <Lehua key={i} x={cx} y={cy} r={6.5} c={colores[i % colores.length]} /> : <g key={i}><circle cx={r1(cx)} cy={r1(cy)} r={6.5} fill={colores[i % colores.length]} stroke={N} strokeWidth={1.4} /><circle cx={r1(cx)} cy={r1(cy)} r={2} fill="#F2C94C" /></g>; })}</g>
);
/** Lei maile: guirnalda abierta de hojas que cuelga del cuello por el pecho. */
const LeiMaile: React.FC<{ c?: string }> = ({ c = '#4E7A3A' }) => {
  const f = useCurrentFrame(), m = Math.sin(f / 20) * 1.5;
  const linea: [number, number][] = [[-14, -304], [6, -296], [24, -284], [30, -258], [30 + m, -232]];
  return <g><path d={suave(linea)} stroke={N} strokeWidth={8} fill="none" strokeLinecap="round" /><path d={suave(linea)} stroke={c} strokeWidth={5.5} fill="none" strokeLinecap="round" />{linea.slice(1).map(([x, y], i) => <g key={i}><ellipse cx={x - 4} cy={y} rx={6} ry={3} fill={c} stroke={N} strokeWidth={1} transform={`rotate(${40 + i * 15} ${x - 4} ${y})`} /><ellipse cx={x + 4} cy={y + 3} rx={6} ry={3} fill="#6E9A4E" stroke={N} strokeWidth={1} transform={`rotate(${-30 + i * 10} ${x + 4} ${y + 3})`} /></g>)}</g>;
};
/** Lei niho palaoa: cordón de pelo trenzado con el colgante blanco en forma de gancho (insignia de jefe). */
const LeiNiho: React.FC = () => (
  <g>
    <path d="M-16 -304 Q 6 -268 30 -300" stroke={N} strokeWidth={5} fill="none" />
    <path d="M-16 -304 Q 6 -268 30 -300" stroke="#3A2A20" strokeWidth={3} strokeDasharray="3 2" fill="none" />
    <path d="M4 -284 C 2 -270, 8 -262, 18 -262 C 24 -262, 26 -270, 22 -274 C 20 -268, 12 -268, 12 -284 Z" fill="#F6EEDC" stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
  </g>
);
/** Collar de colmillos de jabalí (Kamapuaʻa). */
const LeiColmillos: React.FC = () => (
  <g>
    <path d="M-18 -304 Q 8 -262 34 -298" stroke={N} strokeWidth={2.4} fill="none" />
    {[0.45, 0.62, 0.79].map((t, i) => { const x = -18 + t * 52, y = -304 + Math.sin(t * Math.PI) * 34; return <path key={i} d={`M${r1(x - 4)} ${r1(y)} C ${r1(x - 6)} ${r1(y + 14)}, ${r1(x + 2)} ${r1(y + 26)}, ${r1(x + 12)} ${r1(y + 28)} C ${r1(x + 6)} ${r1(y + 18)}, ${r1(x + 4)} ${r1(y + 8)}, ${r1(x + 4)} ${r1(y)} Z`} fill="#F4ECD8" stroke={N} strokeWidth={1.3} />; })}
  </g>
);

// ---------- cabeza ----------
/** Mahiole: casco de plumas con cresta (rojo con borde amarillo). */
const Mahiole: React.FC = () => (
  <g>
    <path d="M-34 8 C -40 -30, -18 -46, 8 -44 C 26 -42, 32 -30, 30 -18 L 22 -18 C 10 -26, -10 -24, -22 -4 L -24 14 Z" fill={ROJO} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-30 -6 C -34 -50, -8 -76, 20 -60 C 30 -54, 34 -42, 30 -30 C 24 -44, 4 -50, -10 -40 C -22 -30, -28 -18, -30 -6 Z" fill={AMARILLO} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-24 -30 C -16 -52, 4 -62, 22 -52" stroke={ROJO} strokeWidth={4} fill="none" />
    <path d="M-26 -14 C -18 -24, 0 -30, 22 -24" stroke={AMARILLO} strokeWidth={3} fill="none" />
  </g>
);
/** Pelo de cerdas (Kamapuaʻa): corto, tieso y en punta por todo el borde, con una crin de cerdas que baja por la nuca. */
const CrestaCerdas: React.FC = () => {
  const f = useCurrentFrame(), m = Math.sin(f / 16) * 0.8;
  const filo: [number, number][] = [[18, -30], [8, -38], [-4, -42], [-16, -40], [-26, -33], [-33, -22], [-37, -8], [-38, 6], [-38, 20], [-37, 34], [-35, 48], [-33, 62]];
  const pts: [number, number][] = [];
  filo.forEach(([x, y], i) => {
    if (i === filo.length - 1) return;
    const [x2, y2] = filo[i + 1], nx = (y2 - y), ny = -(x2 - x), n = Math.hypot(nx, ny) || 1, l = (i > 6 ? 11 : 8) + (i % 2) * 2 + m;
    pts.push([x, y], [(x + x2) / 2 + (nx / n) * l, (y + y2) / 2 + (ny / n) * l]);
  });
  pts.push(filo[filo.length - 1]);
  return (
    <g>
      <path d={`M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L ')} L -24 60 L -22 36 L -16 14 L -10 4 L -4 6 L -2 -8 L 6 -20 L 16 -24 Z`} fill="#161110" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      {[[-6, -34, -10, -26], [-20, -30, -22, -20], [-30, -12, -28, -2], [-32, 14, -29, 24], [-31, 38, -28, 48]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L ${c} ${d}`} stroke="#5A4A40" strokeWidth={1.4} strokeLinecap="round" />)}
    </g>
  );
};
/** Cerdas que asoman por la espalda bajo la capa (Kamapuaʻa escondía así su lomo de cerdo). a = ancho. */
const LomoCerdas: React.FC<{ a: number }> = ({ a }) => (
  <g>{Array.from({ length: 7 }, (_, i) => { const y = -298 + i * 12, x = -30 * a + (i < 2 ? 4 - i * 2 : 0) + 2; return <path key={i} d={`M${r1(x + 4)} ${y - 5} L ${r1(x - 13 - (i % 2) * 3)} ${y + 2} L ${r1(x + 4)} ${y + 7} Z`} fill="#161110" stroke={N} strokeWidth={1.2} strokeLinejoin="round" />; })}</g>
);
/** Capucha de kapa blanca (Poliʻahu): cubre la cabeza y cae por la espalda, la cara queda libre. */
const Capucha: React.FC = () => {
  const f = useCurrentFrame(), m = Math.sin(f / 18) * 2;
  return (
    <g>
      <path d={suave([[26, -24], [18, -40], [-4, -50], [-28, -42], [-42, -16], [-48, 30], [-54 + m, 90], [-30 + m, 96], [-20, 60], [-16, 30], [-10, 8], [-4, 2], [0, -12], [8, -24], [18, -30]], true, 0.8)} fill="#FBF8F2" stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M26 -24 C 14 -32, 0 -30, -6 -16 C -10 -4, -8 6, -4 10" stroke="#C9DCE8" strokeWidth={4} fill="none" strokeLinecap="round" />
      {[[-30, -30], [-40, 14], [-42, 60]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l 4 -6 l 4 6 l -4 6 Z`} fill="#9FC3DB" />)}
    </g>
  );
};
/** Luna creciente detrás de la cabeza (Hina). */
const LunaDetras: React.FC = () => (
  <g transform="translate(-30 -372)">
    <circle r={56} fill="url(#haloBlanco)" opacity={0.7} />
    <path d="M10 -40 A 42 42 0 1 0 10 40 A 32 32 0 1 1 10 -40 Z" fill="#F4EEDC" stroke={N} strokeWidth={2} />
  </g>
);
/** Copos de nieve que caen alrededor (Poliʻahu). */
const Copos: React.FC = () => {
  const f = useCurrentFrame();
  return <g>{Array.from({ length: 9 }, (_, i) => { const x = -110 + ((i * 47) % 220), y = -440 + ((f * (0.8 + (i % 3) * 0.3) + i * 53) % 420); return <g key={i} transform={`translate(${r1(x + Math.sin(f / 20 + i) * 8)} ${r1(y)})`} opacity={0.85}><path d="M-5 0 H 5 M0 -5 V 5 M-3.5 -3.5 L 3.5 3.5 M-3.5 3.5 L 3.5 -3.5" stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" /></g>; })}</g>;
};

// ---------- en la mano (origen = la mano) ----------
/** Fuego en la palma (Pele). */
const FuegoMano: React.FC = () => {
  const f = useCurrentFrame(), s = 1 + Math.sin(f / 3) * 0.08, l = Math.sin(f / 5) * 3;
  return (
    <g transform="translate(14 -10)">
      <circle r={44} fill="url(#halo)" opacity={0.85} />
      <g transform={`scale(${r1(s)})`}>
        <path d={`M0 6 C -18 0, -18 -22, -8 -36 C -6 -26, 0 -26, -2 -48 C ${12 + l} -34, 20 -12, 0 6 Z`} fill="#E8521F" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <path d={`M0 2 C -9 -2, -10 -14, -4 -22 C -2 -16, 4 -16, 3 -28 C ${10 + l * 0.5} -18, 10 -6, 0 2 Z`} fill="#F7B733" />
      </g>
    </g>
  );
};
/** Rama de ʻōhiʻa lehua (Hiʻiaka). */
const RamaLehua: React.FC = () => (
  <g transform="rotate(-8)">
    <path d="M0 30 C 2 -10, -2 -50, 6 -96" stroke="#5A3A22" strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M2 -40 C 14 -50, 20 -60, 24 -74" stroke="#5A3A22" strokeWidth={3} fill="none" />
    {[[-8, -30, -30], [12, -56, 30], [-6, -72, -20], [18, -88, 40]].map(([x, y, a], i) => <ellipse key={i} cx={x} cy={y} rx={9} ry={4.5} fill="#4E7A3A" stroke={N} strokeWidth={1.2} transform={`rotate(${a} ${x} ${y})`} />)}
    <Lehua x={6} y={-102} r={11} /><Lehua x={26} y={-80} r={9} /><Lehua x={-4} y={-60} r={7} />
  </g>
);
/** Manaiakalani: anzuelo grande de hueso con amarre y la cuerda que sube al hombro (Māui hawaiano). */
const Manaiakalani: React.FC = () => {
  const f = useCurrentFrame(), m = Math.sin(f / 14) * 2;
  const anz = 'M0 -104 L 0 6 C 0 44, 52 44, 52 6 L 52 -12';
  return (
    <g transform="translate(-4 0)">
      <path d={`M0 -104 C -20 -120, -50 ${-100 + m}, -64 -108`} stroke="#8C6B3A" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={anz} stroke={N} strokeWidth={17} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={anz} stroke="#F2E8D2" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M45 -10 L 52 -30 L 59 -10 Z" fill="#F2E8D2" stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-3 -96 C 3 -60, 3 -20, 4 2" stroke="#D8CBB0" strokeWidth={2.4} fill="none" />
      {[-100, -94, -88, -82].map((y) => <path key={y} d={`M-7 ${y} l 14 3`} stroke="#5A3A22" strokeWidth={2.6} />)}
    </g>
  );
};
/** Rollo de cuerda en bandolera (Māui hawaiano). */
const RolloCuerda: React.FC = () => (
  <g>
    <path d="M-30 -296 C -10 -300, 20 -270, 28 -226" stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M-30 -296 C -10 -300, 20 -270, 28 -226" stroke="#A8844E" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray="5 3" />
  </g>
);
/** Ipu de agua dulce colgando de la mano de atrás, con un hilo de agua (Kāne). */
const IpuAgua: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g transform="translate(2 4) rotate(-20)">
      <path d="M-2 0 C -4 8, -6 12, -6 16" stroke="#5A3A22" strokeWidth={2.4} fill="none" />
      <path d="M-6 14 C -26 18, -30 50, -14 62 C 0 72, 22 66, 24 48 C 26 30, 12 16, -6 14 Z" fill="#C99A4E" stroke={N} strokeWidth={2} />
      <path d="M-22 40 C -8 34, 10 34, 22 40" stroke="#7A4A22" strokeWidth={3} fill="none" />
      <path d="M-20 48 l 5 -6 l 5 6 l 5 -6 l 5 6 l 5 -6 l 5 6" stroke="#7A4A22" strokeWidth={1.6} fill="none" />
      <ellipse cx={-6} cy={14} rx={7} ry={3} fill="#3A2416" stroke={N} strokeWidth={1.2} />
      {[0, 1, 2].map((i) => { const y = 20 + ((f * 2 + i * 14) % 42); return <ellipse key={i} cx={-12 - y * 0.1} cy={r1(y + 10)} rx={2.6} ry={3.6} fill="#8FD3E8" stroke="#2C7A96" strokeWidth={1} opacity={0.9} />; })}
    </g>
  );
};
/** Bastón de madera de Kāne (con él abre manantiales en la roca). */
const Baston: React.FC = () => (
  <g transform="rotate(7)">
    <path d="M0 196 L 0 -150" stroke={N} strokeWidth={11} strokeLinecap="round" />
    <path d="M0 194 L 0 -148" stroke="#9A6A3A" strokeWidth={6.5} strokeLinecap="round" />
    <path d="M-6 -136 h 12 M-6 -128 h 12" stroke={AMARILLO} strokeWidth={3} />
  </g>
);
/** Hoe (remo) de Kanaloa. */
const Remo: React.FC = () => (
  <g transform="rotate(8)">
    <path d="M0 -150 L 0 70" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 -148 L 0 70" stroke="#8A5A2E" strokeWidth={5.5} strokeLinecap="round" />
    <path d="M0 64 C -20 84, -18 150, 0 178 C 18 150, 20 84, 0 64 Z" fill="#8A5A2E" stroke={N} strokeWidth={2.5} />
    <path d="M0 80 V 164" stroke="#5E3A1E" strokeWidth={2} />
  </g>
);
/** Ihe: lanza larga de guerra (Kū). */
const Ihe: React.FC = () => (
  <g transform="rotate(4)">
    <path d="M0 196 L 0 -210" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 194 L 0 -208" stroke="#5E3A1E" strokeWidth={5.5} strokeLinecap="round" />
    <path d="M0 -262 C 9 -244, 9 -222, 4 -206 H -4 C -9 -222, -9 -244, 0 -262 Z" fill="#3E2A1A" stroke={N} strokeWidth={2.2} />
    <path d="M-6 -196 h 12 M-6 -188 h 12" stroke={ROJO} strokeWidth={3} />
  </g>
);
/** Akua loa de Lono: pértiga alta con travesaño y kapa blanca colgando, ramilletes de helecho arriba. */
const AkuaLoa: React.FC = () => {
  const f = useCurrentFrame(), m = (k: number) => Math.sin(f / 15 + k) * 3;
  const T = -286; // travesaño
  return (
    <g>
      <path d={`M0 196 L 0 ${T - 22}`} stroke={N} strokeWidth={10} strokeLinecap="round" />
      <path d={`M0 194 L 0 ${T - 20}`} stroke="#9A6A3A" strokeWidth={5.5} strokeLinecap="round" />
      <path d={`M-42 ${T} H 46`} stroke={N} strokeWidth={9} strokeLinecap="round" />
      <path d={`M-41 ${T} H 45`} stroke="#9A6A3A" strokeWidth={5} strokeLinecap="round" />
      <path d={`M-38 ${T + 2} L 42 ${T + 2} L ${42 + m(1)} ${T + 86} L ${22 + m(2)} ${T + 76} L ${2 + m(3)} ${T + 88} L ${-18 + m(2)} ${T + 76} L ${-38 + m(0)} ${T + 86} Z`} fill="#FBF6EA" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      {[T + 28, T + 52].map((y) => <path key={y} d={`M-36 ${y} H 40`} stroke="#C9A06A" strokeWidth={3} strokeDasharray="8 5" />)}
      {[-36, 40].map((x) => <g key={x}>{[0, 1, 2].map((i) => <path key={i} d={`M${x} ${T} C ${x + (i - 1) * 6} ${T + 14}, ${x + (i - 1) * 9 + m(i)} ${T + 34}, ${x + (i - 1) * 11 + m(i)} ${T + 50}`} stroke="#4E7A3A" strokeWidth={3.5} fill="none" strokeLinecap="round" />)}</g>)}
      <path d={`M0 ${T - 20} C -12 ${T - 40}, -9 ${T - 52}, 0 ${T - 58} C 9 ${T - 52}, 12 ${T - 40}, 0 ${T - 20} Z`} fill="#4E7A3A" stroke={N} strokeWidth={1.6} />
    </g>
  );
};
/** ʻIe kuku: batidor de kapa (Hina). */
const Batidor: React.FC = () => (
  <g transform="rotate(10)">
    <path d="M0 22 L 0 -36" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 20 L 0 -34" stroke="#7A4A28" strokeWidth={6} strokeLinecap="round" />
    <rect x={-12} y={-112} width={24} height={78} rx={3} fill="#7A4A28" stroke={N} strokeWidth={2.5} />
    {[-100, -88, -76, -64, -52].map((y) => <path key={y} d={`M-11 ${y} h 22`} stroke="#4A2A14" strokeWidth={1.6} />)}
  </g>
);
/** Lāʻau (garrote corto) de Kamapuaʻa. */
const Laau: React.FC = () => (
  <g transform="rotate(-14)">
    <path d="M0 24 L 0 -20" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 22 L 0 -20" stroke="#5E3A1E" strokeWidth={6} strokeLinecap="round" />
    <path d="M-7 -18 C -14 -50, -12 -84, 0 -100 C 12 -84, 14 -50, 7 -18 Z" fill="#5E3A1E" stroke={N} strokeWidth={2.2} />
    <path d="M-4 -40 C -6 -60, -4 -76, 0 -88" stroke="#8A5A32" strokeWidth={2} fill="none" />
  </g>
);

// =====================================================================================================
// ---------- secundarios (2026-10-17): personajes con nombre, extras de la cultura y animales ----------
// =====================================================================================================
const CANAS = '#D8D2C6', CANAS_LUZ = '#F4F0E8', VERDE = '#4E7A3A', VERDE2 = '#6E9A4E', MADERA = '#8A5A32', ILIMA = '#F0A23A';

// ---------- cabeza ----------
/** Patillas unidas al bigote, mentón afeitado (Kalākaua). */
const Patillas: React.FC<{ c?: string }> = ({ c = PELO }) => (
  <g>
    <path d={suave([[-12, -6], [-6, 8], [2, 18], [12, 24], [20, 24], [16, 18], [6, 10], [0, -2], [-4, -10]], true, 0.8)} fill={c} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M22 18.5 C 26 16.5, 33 17, 36 21 C 32 23, 27 22.5, 22 22 Z" fill={c} stroke={N} strokeWidth={1.2} />
  </g>
);
/** Pelo corto prolijo (hombres del siglo XIX): casquete con raya. */
const PeloCorto: React.FC<{ c?: string; luz?: string }> = ({ c = PELO, luz = PELO_LUZ }) => (
  <g>
    <path d={suave([[24, -26], [14, -38], [-6, -42], [-26, -34], [-34, -14], [-33, 6], [-26, 16], [-20, 6], [-14, -4], [-4, -10], [8, -22], [18, -24]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <path d="M-20 -34 Q -2 -40 16 -32" stroke={luz} strokeWidth={1.4} fill="none" opacity={0.8} />
  </g>
);
/** Estrella de cuatro puntas. */
const Estrella: React.FC<{ x: number; y: number; r?: number; c?: string }> = ({ x, y, r = 6, c = '#F4E6A8' }) => (
  <path transform={`translate(${x} ${y})`} d={`M0 ${-r} L ${r1(r * 0.27)} ${r1(-r * 0.27)} L ${r} 0 L ${r1(r * 0.27)} ${r1(r * 0.27)} L 0 ${r} L ${r1(-r * 0.27)} ${r1(r * 0.27)} L ${-r} 0 L ${r1(-r * 0.27)} ${r1(-r * 0.27)} Z`} fill={c} stroke={N} strokeWidth={0.9} strokeLinejoin="round" />
);
/** Flor de hibisco detrás de la oreja. */
const FlorOreja: React.FC<{ c?: string; x?: number; y?: number }> = ({ c = '#E0402E', x = -12, y = -22 }) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={0} cy={-7} rx={5} ry={8} fill={c} stroke={N} strokeWidth={1.1} transform={`rotate(${i * 72})`} />)}
    <circle r={3} fill="#F7D25A" stroke={N} strokeWidth={0.8} />
  </g>
);

// ---------- cuerpo ----------
/** Lei de nueces de kukui (cuentas oscuras y brillantes). */
const LeiKukui: React.FC = () => (
  <g>{Array.from({ length: 7 }, (_, i) => { const t = i / 6, cx = -6 + t * 34 + Math.sin(t * Math.PI) * 4, cy = -301 + t * 36; return <g key={i}><ellipse cx={r1(cx)} cy={r1(cy)} rx={6} ry={5} fill="#3A2A20" stroke={N} strokeWidth={1.2} /><circle cx={r1(cx + 1.6)} cy={r1(cy - 1.6)} r={1.6} fill="#9A8A7A" /></g>; })}</g>
);
/** Lei de conchitas blancas. */
const LeiConchas: React.FC = () => (
  <g>{Array.from({ length: 8 }, (_, i) => { const t = i / 7, cx = -8 + t * 36 + Math.sin(t * Math.PI) * 4, cy = -302 + t * 38; return <ellipse key={i} cx={r1(cx)} cy={r1(cy)} rx={4.2} ry={3} fill="#F6EEDC" stroke={N} strokeWidth={1} transform={`rotate(${30 + i * 8} ${r1(cx)} ${r1(cy)})`} />; })}</g>
);
/** Collar de dientes de tiburón (Nanaue). */
const LeiManoNiho: React.FC = () => (
  <g>
    <path d="M-16 -304 Q 8 -266 32 -300" stroke={N} strokeWidth={2.2} fill="none" />
    {[0.3, 0.45, 0.6, 0.75].map((t, i) => { const x = -16 + t * 48, y = -304 + Math.sin(t * Math.PI) * 30; return <path key={i} d={`M${r1(x - 4)} ${r1(y)} L ${r1(x)} ${r1(y + 11)} L ${r1(x + 4)} ${r1(y)} Z`} fill="#F6F0E2" stroke={N} strokeWidth={1.1} strokeLinejoin="round" />; })}
  </g>
);
/** Malo con el extremo colgando adelante (ropa de trabajo de los hombres). c = color del malo. */
const Malo: React.FC<{ c: string; borde?: string }> = ({ c, borde }) => {
  const f = useCurrentFrame(), m = Math.sin(f / 18) * 2;
  return (
    <g>
      <path d={`M14 -214 L 30 -212 L ${36 + m} -166 L ${22 + m} -164 Z`} fill={c} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      {borde && <path d={`M${23 + m} -170 L ${35 + m} -171`} stroke={borde} strokeWidth={3} />}
    </g>
  );
};
/** Pāʻū de hojas (sobre la falda): hala (tiras de pandano), ti (hojas verdes) o helecho (palaʻe). abajo = alto del ruedo. */
const FaldaHojas: React.FC<{ tipo: 'hala' | 'ti' | 'helecho'; abajo?: number; ancho?: number }> = ({ tipo, abajo = -40, ancho = 1 }) => {
  const f = useCurrentFrame();
  const n = tipo === 'ti' ? 9 : tipo === 'hala' ? 13 : 9;
  const hojas = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1), x0 = (-28 + t * 54) * ancho, x1 = (-44 + t * 96) * ancho + Math.sin(f / 16 + i * 0.7) * 3, y1 = abajo + ((i * 7) % 3) * 6;
    return { i, x0, x1, y1, ym: (-212 + y1) / 2 };
  });
  const orden = [...hojas.filter((h) => h.i % 2 === 0), ...hojas.filter((h) => h.i % 2 === 1)];
  return (
    <g>
      {orden.map(({ i, x0, x1, y1, ym }) => tipo === 'ti' ? (
        <g key={i}>
          <path d={`M${r1(x0 - 7)} -212 C ${r1(x0 - 9)} ${r1(ym)}, ${r1(x1 - 8)} ${r1(y1 - 30)}, ${r1(x1)} ${r1(y1)} C ${r1(x1 + 8)} ${r1(y1 - 30)}, ${r1(x0 + 9)} ${r1(ym)}, ${r1(x0 + 7)} -212 Z`} fill={i % 2 ? '#3F7A32' : '#5E9A42'} stroke={N} strokeWidth={1.5} strokeLinejoin="round" />
          <path d={`M${r1(x0)} -210 Q ${r1((x0 + x1) / 2)} ${r1(ym)} ${r1(x1)} ${r1(y1 - 6)}`} stroke="#9CC27A" strokeWidth={1.2} fill="none" />
        </g>
      ) : tipo === 'hala' ? (
        <g key={i}>
          <path d={`M${r1(x0 - 4.5)} -212 L ${r1(x1 - 4)} ${r1(y1)} L ${r1(x1 + 4)} ${r1(y1)} L ${r1(x0 + 4.5)} -212 Z`} fill={i % 2 ? '#C29A5C' : '#D9B676'} stroke={N} strokeWidth={1.3} strokeLinejoin="round" />
          <path d={`M${r1(x0)} -210 L ${r1(x1)} ${r1(y1 - 3)}`} stroke="#9A7440" strokeWidth={1} />
        </g>
      ) : (
        <g key={i}>
          <path d={`M${r1(x0)} -212 Q ${r1((x0 + x1) / 2 + 3)} ${r1(ym)} ${r1(x1)} ${r1(y1)}`} stroke={N} strokeWidth={4} fill="none" strokeLinecap="round" />
          {Array.from({ length: 9 }, (_, k) => { const t = (k + 1) / 10, px = x0 + (x1 - x0) * t, py = -212 + (y1 + 212) * t, l = 13 * (1 - t * 0.5); return <g key={k}><ellipse cx={r1(px - l * 0.55)} cy={r1(py)} rx={r1(l * 0.55)} ry={3.2} fill={i % 2 ? '#4E8A3A' : '#6AA64A'} stroke={N} strokeWidth={0.9} transform={`rotate(-20 ${r1(px - l * 0.55)} ${r1(py)})`} /><ellipse cx={r1(px + l * 0.55)} cy={r1(py)} rx={r1(l * 0.55)} ry={3.2} fill={i % 2 ? '#4E8A3A' : '#6AA64A'} stroke={N} strokeWidth={0.9} transform={`rotate(20 ${r1(px + l * 0.55)} ${r1(py)})`} /></g>; })}
        </g>
      ))}
      <path d={`M${r1(-30 * ancho)} -214 L ${r1(28 * ancho)} -216`} stroke={N} strokeWidth={9} strokeLinecap="round" />
      <path d={`M${r1(-30 * ancho)} -214 L ${r1(28 * ancho)} -216`} stroke={tipo === 'hala' ? '#8A6236' : '#3E6E30'} strokeWidth={5.5} strokeLinecap="round" />
    </g>
  );
};
/** Estrellitas sobre el pāʻū (Hoʻohōkūkalani). */
const EstrellasFalda: React.FC = () => <g>{[[-22, -184], [14, -170], [32, -126], [-28, -118], [2, -98], [40, -64], [-34, -54], [16, -46], [-8, -22], [46, -22]].map(([x, y], i) => <Estrella key={i} x={x} y={y} r={i % 3 === 0 ? 6 : 4.5} />)}</g>;
/** Escamas de lagarto en la ropa (las moʻo con forma de mujer). */
const Escamas: React.FC<{ c: string }> = ({ c }) => <g>{Array.from({ length: 12 }, (_, i) => { const x = -22 + (i % 4) * 16 + (Math.floor(i / 4) % 2) * 8, y = -170 + Math.floor(i / 4) * 40; return <path key={i} d={`M${x - 6} ${y} Q ${x} ${y + 9} ${x + 6} ${y}`} stroke={c} strokeWidth={2.4} fill="none" />; })}</g>;
/** Saco del siglo XIX con cuello de camisa blanco y botones (Kalākaua, Kamakau). banda = faja diagonal. */
const Saco: React.FC<{ c: string; a?: number; banda?: string; charretera?: boolean }> = ({ c, a = 1, banda, charretera }) => {
  const t: P[] = [[-22 * a, -304], [18 * a, -306], [36 * a, -284], [32 * a, -246], [26 * a, -190], [-28 * a, -186], [-32 * a, -250], [-32 * a, -286]];
  return (
    <g>
      <path d={suave(t, true)} fill={c} stroke={N} strokeWidth={2} />
      <path d="M2 -306 L 16 -276 L 26 -300 Z" fill="#F6F2EA" stroke={N} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M16 -276 L 20 -190" stroke={N} strokeWidth={1.4} />
      {[-262, -242, -222, -202].map((y) => <circle key={y} cx={23} cy={y} r={2.4} fill="#D9B13A" stroke={N} strokeWidth={0.8} />)}
      {banda && <path d="M-26 -296 L 30 -206" stroke={N} strokeWidth={13} strokeLinecap="round" />}
      {banda && <path d="M-26 -296 L 30 -206" stroke={banda} strokeWidth={9.5} strokeLinecap="round" />}
      {charretera && <g><ellipse cx={-6} cy={-302} rx={20} ry={7} fill="#D9B13A" stroke={N} strokeWidth={1.6} />{[-20, -13, -6, 1, 8].map((x) => <path key={x} d={`M${x} -297 v 9`} stroke="#B08A24" strokeWidth={2.4} />)}</g>}
    </g>
  );
};
/** Cuello alto de encaje blanco (holokū de Liliʻuokalani). */
const CuelloEncaje: React.FC = () => <g>{[-14, -6, 2, 10, 18, 26].map((x, i) => <circle key={i} cx={x} cy={-300 + Math.abs(i - 2.5) * 1.6} r={4.6} fill="#FBF8F2" stroke={N} strokeWidth={1.1} />)}</g>;
/** Red de pesca doblada sobre el hombro, colgando por la espalda (Kāneʻapua, pescadores). */
const RedEspalda: React.FC = () => {
  const f = useCurrentFrame(), m = Math.sin(f / 18) * 2;
  const pts: P[] = [[-24, -300], [-6, -302], [-26, -230], [-50 + m, -196], [-66 + m, -214], [-50, -262]];
  const id = 'redEspalda';
  return (
    <g>
      <defs><clipPath id={id}><path d={suave(pts, true, 0.7)} /></clipPath></defs>
      <path d={suave(pts, true, 0.7)} fill="#B89A66" stroke={N} strokeWidth={2} />
      <g clipPath={`url(#${id})`}>{Array.from({ length: 12 }, (_, i) => <g key={i}><path d={`M${-90 + i * 9} -310 l 60 120`} stroke="#5A4426" strokeWidth={1.4} /><path d={`M${-30 + i * 9} -310 l -60 120`} stroke="#5A4426" strokeWidth={1.4} /></g>)}</g>
      {[[-58, -200], [-46, -194], [-64, -214]].map(([x, y], i) => <circle key={i} cx={x + m} cy={y} r={4} fill="#E8D8B0" stroke={N} strokeWidth={1} />)}
    </g>
  );
};
/** Halo nocturno violeta (Kumulipo y Pōʻele: la noche antes de todo). */
const HaloNoche: React.FC<{ id: string }> = ({ id }) => <Aura id={id} c="#7A6AC8" y={-260} r={180} fuerza={0.45} />;

// ---------- en la mano (origen = la mano) ----------
/** Bastón simple de caminar con la punta curva. */
const Cayado: React.FC<{ c?: string }> = ({ c = MADERA }) => (
  <g transform="rotate(4)">
    <path d="M0 200 L 0 -40 C 0 -62, 18 -66, 20 -48" stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d="M0 198 L 0 -40 C 0 -60, 17 -63, 19 -48" stroke={c} strokeWidth={5.5} fill="none" strokeLinecap="round" />
  </g>
);
/** Bastón alto de sacerdote con borla de kapa blanca. */
const BastonKahuna: React.FC = () => (
  <g transform="rotate(5)">
    <path d="M0 200 L 0 -150" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 198 L 0 -148" stroke="#9A6A3A" strokeWidth={5.5} strokeLinecap="round" />
    <path d="M-2 -138 C -16 -120, -14 -96, -6 -84 L 2 -100 L 8 -84 C 14 -98, 12 -120, 2 -138 Z" fill="#FBF6EA" stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M-6 -134 h 12" stroke={ROJO} strokeWidth={3} />
  </g>
);
/** Leiomano: paleta de madera con dientes de tiburón en el borde (Kamohoaliʻi). */
const Leiomano: React.FC = () => {
  const izq: P[] = [[-15, -30], [-18, -44], [-19, -58], [-17, -72], [-12, -86]];
  return (
    <g transform="rotate(-10)">
      <path d="M0 26 L 0 -24" stroke={N} strokeWidth={10} strokeLinecap="round" />
      <path d="M0 24 L 0 -24" stroke="#6A4224" strokeWidth={6} strokeLinecap="round" />
      <path d="M0 26 C -10 30, -10 40, 0 42 C 10 40, 10 30, 0 26 Z" fill="#6A4224" stroke={N} strokeWidth={1.6} />
      {[...izq, ...izq.map(([x, y]) => [-x, y] as P)].map(([x, y], i) => <path key={i} d={`M${x} ${y - 5} L ${x + (x < 0 ? -8 : 8)} ${y} L ${x} ${y + 5} Z`} fill="#F6F0E2" stroke={N} strokeWidth={1.1} strokeLinejoin="round" />)}
      <path d="M-14 -22 C -20 -56, -14 -90, 0 -100 C 14 -90, 20 -56, 14 -22 Z" fill="#7A4C2A" stroke={N} strokeWidth={2.2} />
      <path d="M0 -28 V -90" stroke="#5A3418" strokeWidth={1.6} />
    </g>
  );
};
/** Ola que se enrosca sobre la palma (Nāmaka). */
const OlaMano: React.FC = () => {
  const f = useCurrentFrame(), s = 1 + Math.sin(f / 10) * 0.04;
  return (
    <g transform={`translate(12 -10) scale(${r1(s)})`}>
      <path d="M-34 12 C -34 -22, -12 -50, 16 -50 C 36 -50, 46 -32, 38 -18 C 32 -30, 18 -32, 12 -24 C 6 -14, 12 -2, 24 0 C 8 12, -12 16, -34 12 Z" fill="#2C8C96" stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-28 -2 C -24 -30, -4 -46, 16 -46 C 30 -46, 40 -34, 37 -22" stroke="#F4FBFA" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M-20 4 C -14 -12, -2 -22, 8 -24" stroke="#86CFCF" strokeWidth={3} fill="none" strokeLinecap="round" />
      {[[40, -10], [46, -26], [30, -54]].map(([x, y], i) => <circle key={i} cx={x} cy={y + Math.sin(f / 6 + i) * 2} r={3} fill="#F4FBFA" stroke={N} strokeWidth={0.8} />)}
    </g>
  );
};
/** Rama con hojas y frutitos (Makalei de Haumea). */
const RamaFrutos: React.FC<{ fruto?: string }> = ({ fruto = '#E8B81C' }) => (
  <g transform="rotate(-6)">
    <path d="M0 28 C 2 -10, -2 -50, 4 -92" stroke="#5A3A22" strokeWidth={4.5} fill="none" strokeLinecap="round" />
    <path d="M2 -44 C 14 -54, 22 -62, 28 -76" stroke="#5A3A22" strokeWidth={3} fill="none" />
    <path d="M1 -64 C -10 -72, -18 -80, -22 -92" stroke="#5A3A22" strokeWidth={3} fill="none" />
    {[[-8, -30, -30], [12, -52, 30], [-14, -70, -40], [26, -78, 40], [4, -96, 0], [-22, -94, -20], [30, -64, 60]].map(([x, y, a], i) => <ellipse key={i} cx={x} cy={y} rx={10} ry={5} fill={i % 2 ? VERDE : VERDE2} stroke={N} strokeWidth={1.2} transform={`rotate(${a} ${x} ${y})`} />)}
    {[[18, -66], [-6, -82], [8, -40], [-18, -60]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} fill={fruto} stroke={N} strokeWidth={1.2} />)}
  </g>
);
/** Pū: caracola (trompeta de concha). */
const Pu: React.FC<{ k?: number; c?: string }> = ({ k = 1, c = '#F2DCC2' }) => (
  <g transform={`translate(10 -8) rotate(-28) scale(${k})`}>
    <path d="M-28 6 C -32 -12, -12 -26, 12 -22 L 36 -32 L 32 -16 C 36 -4, 26 12, 4 14 C -10 16, -24 14, -28 6 Z" fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <path d="M-6 8 C -2 -2, 12 -4, 22 -10 C 18 4, 8 10, -6 8 Z" fill="#E8A08A" stroke={N} strokeWidth={1.2} />
    <path d="M-24 -2 C -18 -14, -6 -18, 4 -16 M-20 -10 C -14 -18, -2 -21, 8 -20" stroke="#B8946A" strokeWidth={1.6} fill="none" />
    <circle cx={-26} cy={4} r={3} fill="#C9A47A" stroke={N} strokeWidth={1} />
  </g>
);
/** Ipu con tapa colgando de una red de cuerda (kōkō): Wākea arroja la tapa y se hace el cielo. */
const IpuKoko: React.FC<{ c?: string }> = ({ c = '#C99A4E' }) => (
  <g>
    <path d="M0 -2 L -20 34 M0 -2 L 20 34 M0 -2 L 0 30" stroke="#5A3A22" strokeWidth={2} />
    <ellipse cx={0} cy={56} rx={32} ry={28} fill={c} stroke={N} strokeWidth={2.2} />
    <path d="M-20 34 Q 0 24 20 34 Q 0 40 -20 34 Z" fill="#A87A3A" stroke={N} strokeWidth={1.6} />
    <path d="M-30 50 Q 0 62 30 50 M-28 66 Q 0 78 28 66" stroke="#5A3A22" strokeWidth={1.8} fill="none" />
    <path d="M-26 56 l 6 -6 l 6 6 l 6 -6 l 6 6 l 6 -6 l 6 6 l 6 -6 l 6 6" stroke="#7A4A22" strokeWidth={1.6} fill="none" />
  </g>
);
/** Ipu heke: tambor de doble calabaza del hula (Lohiʻau, cantores). */
const IpuHeke: React.FC = () => (
  <g transform="translate(6 0) rotate(-8) scale(0.78)">
    <ellipse cx={0} cy={36} rx={30} ry={30} fill="#C99A4E" stroke={N} strokeWidth={2.2} />
    <ellipse cx={0} cy={-14} rx={20} ry={17} fill="#D2A65A" stroke={N} strokeWidth={2.2} />
    <ellipse cx={0} cy={-30} rx={9} ry={3.5} fill="#5A3A22" stroke={N} strokeWidth={1.2} />
    <path d="M-18 4 Q 0 12 18 4" stroke="#7A4A22" strokeWidth={3} fill="none" />
    <path d="M-28 40 l 7 -7 l 7 7 l 7 -7 l 7 7 l 7 -7 l 7 7 l 7 -7" stroke="#7A4A22" strokeWidth={1.8} fill="none" />
    <path d="M-12 -16 C -8 -24, 2 -26, 8 -24" stroke="#F0D49A" strokeWidth={2} fill="none" opacity={0.7} />
  </g>
);
/** Palos de hacer fuego (ʻaunaki y ʻaulima) con una brasa que humea (Lonomakua). */
const PalosFuego: React.FC = () => {
  const f = useCurrentFrame(), h = Math.sin(f / 9) * 4;
  return (
    <g transform="rotate(-24)">
      <path d="M0 20 L 0 -70" stroke={N} strokeWidth={9} strokeLinecap="round" />
      <path d="M0 18 L 0 -68" stroke="#9A6A3A" strokeWidth={5} strokeLinecap="round" />
      <path d="M-10 26 L 8 -60" stroke={N} strokeWidth={9} strokeLinecap="round" />
      <path d="M-10 24 L 8 -58" stroke="#B8844E" strokeWidth={5} strokeLinecap="round" />
      <circle cx={4} cy={-72} r={18} fill="url(#halo)" opacity={0.9} />
      <circle cx={4} cy={-72} r={6} fill="#F28C28" stroke={N} strokeWidth={1.4} />
      <path d={`M4 -78 C ${-6 + h} -96, ${12 + h} -108, ${2 + h} -128`} stroke="#B8B0A8" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
    </g>
  );
};
/** Pūʻolo: atado de hojas de ti (ofrenda o comida para el viaje). */
const Puolo: React.FC = () => (
  <g transform="translate(4 2)">
    <path d="M-4 6 L -16 -20 M0 6 L 2 -26 M4 6 L 16 -18" stroke={N} strokeWidth={6} strokeLinecap="round" />
    <path d="M-4 6 L -16 -20 M0 6 L 2 -26 M4 6 L 16 -18" stroke="#5E9A42" strokeWidth={3.5} strokeLinecap="round" />
    <path d="M-22 14 C -28 44, -10 60, 0 60 C 12 60, 30 44, 22 14 C 16 4, -16 4, -22 14 Z" fill="#4E8A3A" stroke={N} strokeWidth={2} />
    <path d="M-12 14 C -16 34, -8 50, -2 58 M10 14 C 14 32, 8 48, 4 58" stroke="#8CBA6A" strokeWidth={1.4} fill="none" />
    <rect x={-9} y={4} width={18} height={8} rx={3} fill="#8A6236" stroke={N} strokeWidth={1.4} />
  </g>
);
/** Isla chiquita en las manos (Papa, madre de las islas). */
const IslaMano: React.FC = () => (
  <g transform="translate(8 -8)">
    <path d="M-44 6 C -36 -18, -12 -30, 6 -28 C 26 -26, 42 -12, 46 6 Z" fill="#7A4A2A" stroke={N} strokeWidth={2} />
    <path d="M-36 -8 C -26 -22, -8 -28, 6 -27 C 22 -26, 34 -16, 40 -6 C 24 -14, -14 -16, -36 -8 Z" fill="#5E9A42" stroke={N} strokeWidth={1.6} />
    <path d="M8 -26 C 10 -44, 6 -58, 12 -70" stroke="#7A5A32" strokeWidth={3} fill="none" />
    {[-60, -20, 20, 60].map((a, i) => <path key={i} d="M12 -70 q 10 -4 20 6" stroke={VERDE} strokeWidth={4} fill="none" strokeLinecap="round" transform={`rotate(${a} 12 -70)`} />)}
    <path d="M-50 6 H 52" stroke="#86CFCF" strokeWidth={4} strokeLinecap="round" />
  </g>
);
/** Planta de kalo (taro): hojas en corazón sobre tallos largos, el cormo en la mano. */
const Kalo: React.FC<{ k?: number }> = ({ k = 1 }) => {
  const f = useCurrentFrame(), m = (i: number) => Math.sin(f / 18 + i) * 2;
  const hoja = (x: number, y: number, a: number, i: number) => <g key={i} transform={`translate(${r1(x + m(i))} ${y}) rotate(${a})`}><path d="M0 0 C -26 -4, -30 -34, -8 -40 L 0 -30 L 8 -40 C 30 -34, 26 -4, 0 0 Z" fill={i % 2 ? '#4E8A3A' : '#5E9A48'} stroke={N} strokeWidth={1.6} strokeLinejoin="round" /><path d="M0 -2 V -30 M0 -14 L -14 -26 M0 -14 L 14 -26" stroke="#9CC27A" strokeWidth={1.2} /></g>;
  return (
    <g transform={`scale(${k})`}>
      {[[-4, -84, -20], [6, -100, 5], [16, -76, 30]].map(([x, y], i) => <path key={i} d={`M0 0 Q ${x * 0.5} ${y * 0.5} ${r1(x + m(i))} ${y}`} stroke="#6E8A3A" strokeWidth={3.4} fill="none" />)}
      {hoja(-4, -84, -24, 0)}{hoja(16, -76, 26, 2)}{hoja(6, -100, 2, 1)}
      <ellipse cx={0} cy={10} rx={12} ry={15} fill="#8A6A5A" stroke={N} strokeWidth={1.8} />
      <path d="M-10 6 q 10 4 20 0 M-10 14 q 10 4 20 0" stroke="#5A4036" strokeWidth={1.2} fill="none" />
      <path d="M-4 24 l -4 8 M2 25 l 0 9 M6 24 l 5 7" stroke="#6A5040" strokeWidth={1.4} />
    </g>
  );
};
/** Ramita de coral (el primer nacido del Kumulipo). */
const Coral: React.FC = () => (
  <g transform="translate(4 -4)">
    {['M0 0 C 0 -20, -4 -34, -12 -50', 'M-2 -18 C 8 -28, 14 -40, 14 -56', 'M-7 -34 C -18 -40, -24 -48, -26 -60', 'M8 -32 C 18 -36, 24 -44, 28 -50', 'M-10 -46 C -6 -54, -4 -62, -4 -70'].map((d, i) => <g key={i}><path d={d} stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" /><path d={d} stroke="#E8846E" strokeWidth={5.5} fill="none" strokeLinecap="round" /></g>)}
    {[[-12, -50], [14, -56], [-26, -60], [28, -50], [-4, -70]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill="#F6C8B8" />)}
  </g>
);
/** Atado de kapa / hoja de ti del kahuna (hoja larga en la mano). */
const HojaTi: React.FC = () => {
  const f = useCurrentFrame(), m = Math.sin(f / 14) * 3;
  return (
    <g transform="rotate(-30)">
      <path d={`M0 6 C -12 -20, -10 -60, ${4 + m} -96 C 16 -60, 14 -20, 0 6 Z`} fill="#4E8A3A" stroke={N} strokeWidth={1.8} />
      <path d={`M0 4 C 1 -30, 2 -60, ${4 + m} -92`} stroke="#9CC27A" strokeWidth={1.4} fill="none" />
    </g>
  );
};
/** Cuerda enrollada (Lonoaohi y sus nudos flojos). */
const RolloMano: React.FC = () => (
  <g transform="translate(4 14)">
    {[0, 1, 2].map((i) => <ellipse key={i} cx={i * 3 - 3} cy={i * 3} rx={18} ry={22} fill="none" stroke={N} strokeWidth={7} />)}
    {[0, 1, 2].map((i) => <ellipse key={i} cx={i * 3 - 3} cy={i * 3} rx={18} ry={22} fill="none" stroke="#B8935A" strokeWidth={4} strokeDasharray="5 3" />)}
    <path d="M14 18 C 22 36, 12 48, 20 62" stroke={N} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M14 18 C 22 36, 12 48, 20 62" stroke="#B8935A" strokeWidth={3.5} fill="none" strokeLinecap="round" />
  </g>
);
/** Kāhili de mano: varita con un cilindro de plumas (insignia de jefe). */
const KahiliMano: React.FC = () => (
  <g transform="rotate(6)">
    <path d="M0 40 L 0 -100" stroke={N} strokeWidth={9} strokeLinecap="round" />
    <path d="M0 38 L 0 -100" stroke="#EDE2CC" strokeWidth={5} strokeLinecap="round" />
    {[-56, -40, -24].map((y) => <path key={y} d={`M-3 ${y} h 6`} stroke={N} strokeWidth={2} />)}
    <rect x={-20} y={-176} width={40} height={84} rx={18} fill={AMARILLO} stroke={N} strokeWidth={2.2} />
    {[-160, -140, -120, -104].map((y, i) => <path key={y} d={`M-18 ${y} Q 0 ${y + 6} 18 ${y}`} stroke={i % 2 ? ROJO : '#C99A14'} strokeWidth={i % 2 ? 6 : 2} fill="none" />)}
  </g>
);
/** Copa de ʻava en media cáscara de coco (Samoa). */
const CopaAva: React.FC = () => (
  <g transform="translate(14 -14)">
    <path d="M-20 0 C -20 22, 20 22, 20 0 Z" fill="#6A4428" stroke={N} strokeWidth={2} />
    <ellipse cx={0} cy={0} rx={20} ry={5} fill="#D9C8A0" stroke={N} strokeWidth={1.6} />
    <path d="M-14 8 q 4 6 10 7" stroke="#8A6040" strokeWidth={1.4} fill="none" />
  </g>
);
/** Pértiga alta sostenida con el brazo arriba (Ru sostiene el cielo). */
const Pertiga: React.FC = () => (
  <g transform="rotate(-6)">
    <path d="M0 80 L 0 -150" stroke={N} strokeWidth={12} strokeLinecap="round" />
    <path d="M0 78 L 0 -148" stroke="#8A5A2E" strokeWidth={7} strokeLinecap="round" />
    <path d="M-34 -150 Q 0 -168 34 -150" stroke="#9FC3DB" strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);
/** Langosta (ula) agarrada del lomo (Punia). */
const Ula: React.FC = () => {
  const f = useCurrentFrame(), m = Math.sin(f / 8) * 4;
  return (
    <g transform="translate(18 -6) rotate(-10)">
      <path d={`M18 -6 C 40 -30, 60 -36, ${80 + m} -50 M18 -2 C 44 -20, 64 -20, ${84 + m} -28`} stroke={N} strokeWidth={2.4} fill="none" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-12 + i * 9} 8 l ${-2 + (i % 2) * 2} 12`} stroke={N} strokeWidth={2.4} strokeLinecap="round" />)}
      <path d="M-40 4 C -40 -6, -24 -12, -10 -10 L 20 -10 C 28 -8, 28 6, 20 8 L -10 10 C -24 12, -40 12, -40 4 Z" fill="#D2552E" stroke={N} strokeWidth={2} />
      {[-30, -22, -14].map((x) => <path key={x} d={`M${x} -9 v 18`} stroke="#9A3A1E" strokeWidth={1.6} />)}
      <path d="M-40 4 L -54 -8 L -56 4 L -54 16 Z" fill="#D2552E" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx={16} cy={-6} r={2.4} fill={N} />
    </g>
  );
};
/** Libro cerrado (Kamakau, el historiador). */
const Libro: React.FC = () => (
  <g transform="translate(6 -14) rotate(-12)">
    <rect x={-18} y={-24} width={36} height={46} rx={2} fill="#5A2A22" stroke={N} strokeWidth={2} />
    <path d="M14 -22 V 20" stroke="#F2E8D2" strokeWidth={4} />
    <path d="M-12 -12 h 18" stroke="#D9B13A" strokeWidth={2} />
  </g>
);
/** Kiʻi de madera chiquito (Kiʻi, «imagen»): figura tallada en la mano. */
const KiiMano: React.FC = () => (
  <g transform="translate(6 -30)">
    <rect x={-10} y={-6} width={20} height={34} rx={4} fill="#8A5A32" stroke={N} strokeWidth={1.8} />
    <path d="M-14 -6 C -16 -30, 16 -30, 14 -6 Z" fill="#9A6A3A" stroke={N} strokeWidth={1.8} />
    <path d="M-12 -24 L -6 -36 L 0 -26 L 6 -36 L 12 -24" stroke={N} strokeWidth={1.6} fill="#9A6A3A" strokeLinejoin="round" />
    <path d="M-7 -14 h 5 M3 -14 h 5 M-6 -8 h 12" stroke={N} strokeWidth={1.8} />
    <path d="M-6 28 v 8 M6 28 v 8" stroke={N} strokeWidth={4} />
  </g>
);
/** Puñado de tierra roja (Honuaʻula: el hombre hecho de tierra roja). */
const TierraRoja: React.FC = () => (
  <g transform="translate(10 -14)">
    <path d="M-16 8 C -18 -6, -6 -14, 4 -12 C 16 -10, 20 2, 16 8 Z" fill="#A8442A" stroke={N} strokeWidth={1.8} />
    {[[-8, -2], [4, -6], [10, 2]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill="#D2754E" />)}
  </g>
);
/** ʻŌʻō: palo de cavar del agricultor. */
const Oo: React.FC = () => (
  <g transform="rotate(10)">
    <path d="M0 -150 L 0 186" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 -148 L 0 184" stroke="#8A5A32" strokeWidth={5.5} strokeLinecap="round" />
    <path d="M0 150 C -8 168, -6 186, 0 200 C 6 186, 8 168, 0 150 Z" fill="#7A4A28" stroke={N} strokeWidth={1.8} />
  </g>
);
/** Canasta con raíces de kalo (agricultoras). */
const CanastaKalo: React.FC = () => (
  <g>
    <path d="M-14 -2 Q 0 -16 14 -2" stroke="#7A5A32" strokeWidth={3} fill="none" />
    {[[-12, 6], [0, 2], [12, 6]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y} rx={8} ry={10} fill="#8A6A5A" stroke={N} strokeWidth={1.4} /><path d={`M${x} ${y - 9} l ${-4 + i * 4} -16`} stroke="#5E9A42" strokeWidth={3} strokeLinecap="round" /></g>)}
    <path d="M-24 6 L 24 6 L 18 40 L -18 40 Z" fill="#C29A5C" stroke={N} strokeWidth={2} strokeLinejoin="round" />
    {[14, 22, 30].map((y) => <path key={y} d={`M-21 ${y} H 21`} stroke="#8A6236" strokeWidth={1.4} />)}
    {[-10, 0, 10].map((x) => <path key={x} d={`M${x} 8 V 38`} stroke="#8A6236" strokeWidth={1.2} />)}
  </g>
);
/** Pez colgando de un cordel (pescador). */
const PezCordel: React.FC = () => (
  <g>
    <path d="M0 0 L 0 26" stroke="#5A3A22" strokeWidth={2} />
    <g transform="translate(0 50) rotate(90)">
      <path d="M-24 0 C -14 -12, 12 -14, 24 0 C 12 14, -14 12, -24 0 Z" fill="#8FB8C8" stroke={N} strokeWidth={1.8} />
      <path d="M-22 0 L -36 -10 L -34 0 L -36 10 Z" fill="#8FB8C8" stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx={14} cy={-3} r={2.4} fill={N} />
    </g>
  </g>
);
/** Hoe uli: remo de timón largo (navegantes). */
const RemoTimon: React.FC = () => (
  <g transform="rotate(12)">
    <path d="M0 -170 L 0 90" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 -168 L 0 90" stroke="#7A4A28" strokeWidth={5.5} strokeLinecap="round" />
    <path d="M0 84 C -16 100, -16 160, 0 196 C 16 160, 16 100, 0 84 Z" fill="#7A4A28" stroke={N} strokeWidth={2.4} />
  </g>
);
/** Lanza corta de guardia (pololū). */
const LanzaGuardia: React.FC = () => (
  <g transform="rotate(3)">
    <path d="M0 196 L 0 -190" stroke={N} strokeWidth={9} strokeLinecap="round" />
    <path d="M0 194 L 0 -188" stroke="#6A4224" strokeWidth={5} strokeLinecap="round" />
    <path d="M0 -226 C 7 -212, 7 -198, 3 -186 H -3 C -7 -198, -7 -212, 0 -226 Z" fill="#4A3020" stroke={N} strokeWidth={2} />
  </g>
);
/** Cuenco de madera (ʻumeke) con agua del lago (Waiau). */
const UmekeAgua: React.FC = () => (
  <g transform="translate(16 -18)">
    <path d="M-26 0 C -26 26, 26 26, 26 0 Z" fill="#7A4A28" stroke={N} strokeWidth={2} />
    <ellipse cx={0} cy={0} rx={26} ry={6} fill="#6EC3D8" stroke={N} strokeWidth={1.6} />
    <path d="M-12 0 q 6 -3 12 0" stroke="#E8F8FB" strokeWidth={1.6} fill="none" />
  </g>
);

// ---------- animales (origen = las patas en el suelo; peces y aves en vuelo = el centro del cuerpo) ----------
const ojoA = (x: number, y: number, r = 4) => <g><circle cx={x} cy={y} r={r} fill={N} /><circle cx={r1(x + r * 0.35)} cy={r1(y - r * 0.35)} r={r1(r * 0.32)} fill="#FFFFFF" /></g>;
/** Pata que se balancea al caminar: de la cadera (x, -alto) al suelo. */
const pata = (x: number, alto: number, fase: number, amp: number, w: number, c: string, k: number) => {
  const a = (Math.sin(fase + k) * amp * Math.PI) / 180, bx = x + Math.sin(a) * alto, by = -alto + Math.cos(a) * alto;
  return <g key={k}><path d={`M${x} ${-alto} L ${r1(bx)} ${r1(by)}`} stroke={N} strokeWidth={w + 4} strokeLinecap="round" /><path d={`M${x} ${-alto} L ${r1(bx)} ${r1(by)}`} stroke={c} strokeWidth={w} strokeLinecap="round" /></g>;
};
const caminar = (f: number, moviendo?: boolean, corriendo?: boolean) => ({ fase: moviendo || corriendo ? f * (corriendo ? 0.38 : 0.22) : 0, amp: corriendo ? 30 : moviendo ? 20 : 0 });

/** Puaʻa: cerdo hawaiano chico y oscuro, hocico largo, cresta de cerdas. cria = cerdito rayado. */
const Puaa: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, corriendo, f, color = '#3A2C26', cria }) => {
  const { fase, amp } = caminar(f, moviendo, corriendo), b = corriendo ? -Math.abs(Math.sin(fase)) * 6 : 0, c = color as string;
  return (
    <g transform={`translate(${x} ${y + b * s}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {pata(-40, 36, fase, amp, 11, '#2A201C', Math.PI)}{pata(34, 36, fase, amp, 11, '#2A201C', 0)}
      <path d={`M-66 -60 C -76 -64, -80 -76, -72 -82`} stroke={N} strokeWidth={3} fill="none" />
      <path d={suave([[-64, -56], [-60, -84], [-30, -100], [16, -100], [48, -88], [60, -66], [52, -40], [20, -34], [-30, -34], [-58, -40]], true)} fill={c} stroke={N} strokeWidth={2.4} />
      <path d={suave([[-50, -44], [-10, -38], [36, -40], [50, -48]])} stroke="#5A463C" strokeWidth={4} fill="none" opacity={0.7} />
      {cria ? [-36, -16, 4, 24].map((xx) => <path key={xx} d={`M${xx} -94 Q ${xx + 4} -70 ${xx} -46`} stroke="#B8946A" strokeWidth={4} fill="none" opacity={0.85} />)
        : Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-40 + i * 9} ${-98 + Math.abs(i - 5) * 0.6} l 3 -10 l 3 10`} stroke={N} strokeWidth={1.6} fill="#1E1612" />)}
      {pata(-30, 36, fase, amp, 11, c, Math.PI * 0.4)}{pata(44, 36, fase, amp, 11, c, Math.PI * 1.4)}
      <g transform="translate(52 -74)">
        <path d={suave([[-8, -16], [16, -20], [38, -6], [52, 0], [50, 10], [30, 16], [4, 18], [-10, 8]], true)} fill={c} stroke={N} strokeWidth={2.2} />
        <ellipse cx={52} cy={5} rx={4} ry={7} fill="#6A4A40" stroke={N} strokeWidth={1.4} />
        <path d="M2 -16 L 10 -34 L 16 -16 Z" fill={c} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        {!cria && <path d="M34 10 C 38 2, 44 0, 46 -6" stroke="#F4ECD8" strokeWidth={3} fill="none" strokeLinecap="round" />}
        {ojoA(24, -6, 3.2)}
      </g>
    </g>
  );
};
/** ʻĪlio: perro hawaiano chico de orejas paradas y cola enrulada. rayas / pelado para el canto del Kumulipo. */
const Ilio: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, corriendo, f, color = '#9A5A32', rayas, boca }) => {
  const { fase, amp } = caminar(f, moviendo, corriendo), c = color as string, cola = Math.sin(f / 6) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {pata(-34, 40, fase, amp, 10, '#6A3A20', Math.PI)}{pata(28, 40, fase, amp, 10, '#6A3A20', 0)}
      <path d={`M-48 -70 C -66 -80, ${-66 + cola} -104, -48 -100 C -42 -98, -44 -90, -50 -88`} stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d={`M-48 -70 C -66 -80, ${-66 + cola} -104, -48 -100 C -42 -98, -44 -90, -50 -88`} stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={suave([[-52, -62], [-44, -84], [0, -88], [34, -84], [48, -66], [40, -44], [0, -40], [-40, -42]], true)} fill={c} stroke={N} strokeWidth={2.4} />
      {!!rayas && [-34, -20, -6, 8, 22].map((xx) => <path key={xx} d={`M${xx} -86 Q ${xx + 4} -68 ${xx} -48`} stroke="#3A2016" strokeWidth={4} fill="none" />)}
      <path d="M-30 -46 Q 0 -42 30 -48" stroke="#E8C8A0" strokeWidth={4} fill="none" opacity={0.7} />
      {pata(-26, 40, fase, amp, 10, c, Math.PI * 0.4)}{pata(36, 40, fase, amp, 10, c, Math.PI * 1.4)}
      <g transform="translate(46 -86)">
        <path d={suave([[-14, 10], [-10, -12], [10, -18], [28, -8], [44, 0], [42, 10], [20, 16], [-6, 20]], true)} fill={c} stroke={N} strokeWidth={2.2} />
        <path d="M-6 -12 L -2 -38 L 10 -16 Z" fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
        <path d="M-2 -16 L 0 -30 L 6 -18 Z" fill="#C88A6A" />
        <ellipse cx={44} cy={3} rx={4} ry={3.6} fill={N} />
        {boca && <path d="M26 12 L 42 10 L 30 18 Z" fill="#9A2A2A" stroke={N} strokeWidth={1.2} />}
        {ojoA(18, -4, 3.4)}
      </g>
    </g>
  );
};
/** ʻIole: rata polinesia chiquita. */
const Iole: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#7A6A5A' }) => {
  const p = moviendo ? Math.sin(f / 2.5) * 4 : 0, cola = Math.sin(f / 8) * 5, c = color as string;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-30 -14 C -50 -10, -66 ${-2 + cola}, -86 ${4 + cola}`} stroke={N} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={`M-30 -14 C -50 -10, -66 ${-2 + cola}, -86 ${4 + cola}`} stroke="#C8A08A" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d={`M-16 -6 l ${-4 + p} 6 M14 -6 l ${4 - p} 6`} stroke={N} strokeWidth={4} strokeLinecap="round" />
      <path d={suave([[-34, -12], [-24, -34], [4, -38], [26, -30], [40, -18], [36, -6], [0, -2], [-28, -4]], true)} fill={c} stroke={N} strokeWidth={2.2} />
      <circle cx={14} cy={-34} r={8} fill={c} stroke={N} strokeWidth={1.8} /><circle cx={14} cy={-34} r={3.6} fill="#D8A8A0" />
      <ellipse cx={41} cy={-16} rx={3} ry={2.6} fill="#D8A8A0" stroke={N} strokeWidth={1} />
      {ojoA(28, -24, 2.8)}
      <path d="M38 -12 l 12 -2 M38 -10 l 11 3" stroke={N} strokeWidth={0.9} />
    </g>
  );
};
/** Moʻo: lagarto de perfil, bajo, con la cola larga. Chico = gecko; grande (s ≈ 2–3) = los moʻo de las historias.
 * cresta = púas en el lomo; lengua = lengua larga afuera (Kikipua); manchas = color de las manchas. */
const Moo: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#6E9A3E', panza = '#C8D88A', manchas = '#E8D85A', cresta, lengua, ojo = '#E8C23A' }) => {
  const c = color as string, p = moviendo ? Math.sin(f / 3) * 8 : 0, ola = Math.sin(f / 10) * 4;
  const cuerpo: P[] = [[-150, -6 + ola], [-110, -10 - ola * 0.5], [-70, -16], [-30, -24], [10, -26], [40, -22], [62, -16]];
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {[[-40, Math.PI], [26, 0]].map(([lx, k], i) => <path key={i} d={`M${lx} -16 l ${-6 + Math.sin(f / 3 + k) * (moviendo ? 8 : 0)} 14 l 10 2`} stroke={N} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      <path d={suave(cuerpo)} stroke={N} strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d={suave(cuerpo)} stroke={c} strokeWidth={29} fill="none" strokeLinecap="round" />
      <path d={suave(cuerpo.slice(1).map(([a, b]) => [a, b + 8] as P))} stroke={panza as string} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.9} />
      {[[-100, -14], [-70, -22], [-40, -30], [-12, -32], [16, -32], [-124, -10]].map(([a, b], i) => <circle key={i} cx={a} cy={b + (i % 2) * 3} r={3.6} fill={manchas as string} />)}
      {!!cresta && [-110, -90, -70, -50, -30, -10, 10, 30].map((a, i) => <path key={i} d={`M${a - 6} ${-28 - (a > -60 ? 4 : 0)} L ${a} ${-44 - (a > -60 ? 4 : 0)} L ${a + 6} ${-28 - (a > -60 ? 4 : 0)} Z`} fill={cresta as string} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />)}
      <g transform="translate(66 -22)">
        {!!lengua && <path d={`M30 8 C 60 10, 90 ${12 + ola}, 120 ${10 + ola}`} stroke="#C8423A" strokeWidth={5} fill="none" strokeLinecap="round" />}
        <path d={suave([[-14, 10], [-8, -10], [12, -14], [32, -6], [38, 4], [26, 12], [0, 14]], true)} fill={c} stroke={N} strokeWidth={2.2} />
        <path d="M6 8 Q 22 12 36 5" stroke={N} strokeWidth={1.4} fill="none" />
        <circle cx={14} cy={-3} r={5} fill={ojo as string} stroke={N} strokeWidth={1.4} /><ellipse cx={14.5} cy={-3} rx={1.4} ry={3.6} fill={N} />
      </g>
      {[[-52, Math.PI * 1.3], [34, Math.PI * 0.3]].map(([lx, k], i) => <path key={`d${i}`} d={`M${lx} -14 l ${8 + Math.sin(f / 3 + k) * (moviendo ? 8 : 0) + p * 0} 14 l 10 0`} stroke={N} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      {[[-52, Math.PI * 1.3], [34, Math.PI * 0.3]].map(([lx, k], i) => <path key={`e${i}`} d={`M${lx} -14 l ${8 + Math.sin(f / 3 + k) * (moviendo ? 8 : 0)} 14 l 10 0`} stroke={c} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
    </g>
  );
};
/** Honu: tortuga verde de mar, con aletas. */
const Honu: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f }) => {
  const a = moviendo ? Math.sin(f / 5) * 14 : Math.sin(f / 20) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d="M-62 -10 L -88 -2 L -66 -2 Z" fill="#7A8A4A" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={`M-30 -12 C -40 0, -50 6, -62 6 C -46 10, -30 4, -20 -6 Z`} fill="#7A8A4A" stroke={N} strokeWidth={1.8} transform={`rotate(${-a} -24 -10)`} />
      <path d="M-70 -8 C -66 -58, 50 -64, 58 -8 Z" fill="#6E5A2E" stroke={N} strokeWidth={2.6} />
      {[[-40, -26], [-10, -38], [20, -30], [-22, -14], [8, -16], [36, -14]].map(([cx, cy], i) => <path key={i} d={`M${cx - 10} ${cy} l 5 -8 h 10 l 5 8 l -5 8 h -10 Z`} fill="#8A7238" stroke="#4A3A1C" strokeWidth={1.4} />)}
      <path d="M-70 -8 Q -6 2 58 -8" stroke="#C9B26A" strokeWidth={5} fill="none" />
      <path d={`M24 -10 C 44 4, 62 12, 80 10 C 62 0, 46 -10, 34 -16 Z`} fill="#7A8A4A" stroke={N} strokeWidth={1.8} transform={`rotate(${a} 30 -12)`} />
      <g transform="translate(60 -18)">
        <path d="M-6 6 C -4 -10, 14 -14, 26 -6 C 32 0, 28 10, 18 10 C 8 10, -2 12, -6 6 Z" fill="#7A8A4A" stroke={N} strokeWidth={2} />
        {[[2, -2], [10, 4], [14, -6]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={2} fill="#5A6A30" />)}
        {ojoA(18, -3, 2.8)}
        <path d="M22 6 l 7 -1" stroke={N} strokeWidth={1.4} />
      </g>
    </g>
  );
};
/** Pez de arrecife. forma: manini (rayas negras), lauipala (amarillo, alto), humuhumu (pez ballesta), uhu (loro azul). */
const PezArrecife: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, forma = 'manini' }) => {
  const m = Math.sin(f / 4) * 6;
  const alto = forma === 'lauipala' ? 30 : forma === 'humuhumu' ? 22 : 18;
  const col = forma === 'lauipala' ? '#F2C81E' : forma === 'humuhumu' ? '#D8CDB0' : forma === 'uhu' ? '#3E9AB0' : '#F2EAD0';
  const cuerpo = `M-34 0 C -24 ${-alto}, 14 ${-alto - 4}, 34 -4 C 38 0, 38 2, 34 4 C 14 ${alto + 4}, -24 ${alto}, -34 0 Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-30 0 L -52 ${-14 + m * 0.5} L -48 0 L -52 ${14 + m * 0.5} Z`} fill={forma === 'humuhumu' ? '#3A3A3A' : col} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={cuerpo} fill={col} stroke={N} strokeWidth={2.2} />
      {forma === 'manini' && [-18, -6, 6, 18].map((xx) => <path key={xx} d={`M${xx} ${-alto + 2} V ${alto - 2}`} stroke={N} strokeWidth={3} />)}
      {forma === 'humuhumu' && <><path d={`M-20 -4 L 18 -12 L 18 8 Z`} fill="#2A2A2A" /><path d="M-6 -6 l 8 -4 M-2 0 l 10 -3 M2 6 l 10 -2" stroke="#4AA8D8" strokeWidth={2.4} /><path d="M22 0 L 34 0" stroke="#E8A02A" strokeWidth={3} /><path d="M-26 -2 L -14 -12 L -14 8 Z" fill="#E8C23A" stroke={N} strokeWidth={1.2} /></>}
      {forma === 'uhu' && <path d="M-20 -8 Q 0 -14 20 -8 M-20 6 Q 0 12 20 6" stroke="#8ADAE0" strokeWidth={2.4} fill="none" />}
      {forma === 'lauipala' && <path d="M24 -6 L 32 -2" stroke="#F8F0D8" strokeWidth={2} />}
      <path d={`M-6 ${-alto + 2} L 4 ${-alto - 10} L 14 ${-alto + 4}`} fill={col} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
      {ojoA(22, -4, 3)}
    </g>
  );
};
/** Manō: tiburón de perfil (gris arriba, panza blanca). rey = más oscuro y con marcas claras (el rey de los tiburones). */
const Mano: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, boca, color = '#6E8494', rey }) => {
  const m = Math.sin(f / 6) * 8, c = color as string;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-96 -4 L -140 ${-40 + m} L -128 -2 L -136 ${26 + m * 0.6} Z`} fill={c} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      <path d={suave([[-110, -2], [-60, -22], [10, -30], [70, -20], [108, -4], [96, 8], [40, 18], [-30, 16], [-90, 8]], true)} fill={c} stroke={N} strokeWidth={2.6} />
      <path d={suave([[-90, 6], [-30, 14], [40, 16], [96, 6]])} stroke="#F2F0EA" strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M-14 -28 L 6 -64 L 26 -28 Z" fill={c} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M8 10 L 30 32 L 36 12 Z" fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      {[48, 56, 64].map((xx) => <path key={xx} d={`M${xx} -10 q -3 8 0 14`} stroke={N} strokeWidth={1.6} fill="none" />)}
      {!!rey && [[-40, -14], [-60, -8], [-20, -18], [-80, -2]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={6} ry={3} fill="#B8C8D4" />)}
      <path d={boca ? 'M80 6 L 104 2 L 86 14 Z' : 'M82 8 Q 92 10 100 6'} stroke={N} strokeWidth={1.8} fill={boca ? '#7A2A2A' : 'none'} />
      {ojoA(86, -8, 3.4)}
    </g>
  );
};
/** Naiʻa: delfín / marsopa. */
const Naia: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f }) => {
  const m = Math.sin(f / 6) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-84 -2 L -118 ${-22 + m} L -108 0 L -118 ${20 + m} Z`} fill="#7A8C9C" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      <path d={suave([[-94, 0], [-50, -24], [10, -30], [62, -18], [86, -8], [104, -4], [86, 4], [40, 14], [-40, 12]], true)} fill="#7A8C9C" stroke={N} strokeWidth={2.6} />
      <path d={suave([[-70, 6], [-10, 12], [50, 10], [84, 2]])} stroke="#E4E8EA" strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M-14 -28 C -6 -50, 6 -58, 12 -60 C 8 -48, 8 -38, 14 -28 Z" fill="#7A8C9C" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M20 8 L 34 30 L 40 10 Z" fill="#7A8C9C" stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M86 -2 Q 94 2 104 -2" stroke={N} strokeWidth={1.6} fill="none" />
      {ojoA(70, -8, 3)}
    </g>
  );
};
/** Puhi: morena larga con manchas. */
const Puhi: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, boca }) => {
  const n = 9, pts: P[] = Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return [-150 + t * 190, Math.sin(t * Math.PI * 2 + f / 6) * 12 * (1 - t * 0.6)] as P; });
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={suave(pts)} stroke={N} strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d={suave(pts)} stroke="#B89A3A" strokeWidth={25} fill="none" strokeLinecap="round" />
      <path d={suave(pts)} stroke="#5A4A1E" strokeWidth={4} strokeDasharray="2 10" fill="none" strokeLinecap="round" />
      <g transform={`translate(${r1(pts[n - 1][0])} ${r1(pts[n - 1][1])})`}>
        <path d={boca ? 'M-6 -14 C 10 -18, 26 -10, 32 -6 L 16 0 L 30 8 C 20 14, 4 14, -6 12 Z' : 'M-6 -14 C 10 -18, 26 -10, 32 -2 C 26 8, 8 12, -6 12 Z'} fill="#B89A3A" stroke={N} strokeWidth={2} strokeLinejoin="round" />
        {ojoA(12, -6, 3)}
      </g>
    </g>
  );
};
/** Gusano / larva (ilo, koʻe): cuerpo segmentado que se arquea. tipo: larva (blanca, gorda) o lombriz (rosada, larga). */
const Gusano: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, tipo = 'larva' }) => {
  const larva = tipo === 'larva', n = larva ? 7 : 11, arco = Math.sin(f / 8) * 6;
  const c = larva ? '#F2E6C8' : '#D88A86', r = larva ? 13 : 8;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {Array.from({ length: n }, (_, i) => { const t = i / (n - 1), cx = -60 + t * 120, cy = -r - Math.sin(t * Math.PI) * (larva ? 14 + arco : 8 + arco); return <circle key={i} cx={r1(cx)} cy={r1(cy)} r={r1(r * (larva ? 0.8 + Math.sin(t * Math.PI) * 0.3 : 1))} fill={c} stroke={N} strokeWidth={1.8} />; })}
      {larva && <circle cx={64} cy={-14} r={9} fill="#C8843A" stroke={N} strokeWidth={1.8} />}
      {!larva && <circle cx={58} cy={-10} r={2} fill={N} />}
    </g>
  );
};
/** Ala abierta en vuelo (se repite atrás y adelante); origen = el hombro. */
const AlaVuelo: React.FC<{ c: string; borde?: string; ang: number; k?: number }> = ({ c, borde, ang, k = 1 }) => (
  <path transform={`rotate(${r1(ang)}) scale(${k})`} d="M0 0 C -10 -26, -36 -50, -66 -56 L -58 -46 L -68 -40 L -56 -34 L -62 -26 L -50 -22 C -34 -14, -18 -4, -8 8 Z" fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
);
/** Pájaro de perfil, posado (patas en el origen, cuerpo inclinado) o en vuelo (vuela = alas abiertas, origen = el cuerpo).
 * pico: corto, curvo, largo (curvo y largo) o recto; cola larga para el ʻōʻō; mechones = plumas amarillas bajo el ala. */
const Pajaro: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, vuela, moviendo, color = '#C8321E', ala = '#2A2220', panza, pico = 'corto', picoC = '#2A2220', cola = 1, mechones, rabadilla, gorro }) => {
  const c = color as string, al = ala as string, lc = cola as number;
  const pc = pico === 'largo' ? 'M8 -4 C 28 -6, 40 4, 46 16 C 38 8, 26 2, 8 2 Z' : pico === 'curvo' ? 'M8 -4 C 20 -6, 26 0, 29 8 C 22 4, 16 2, 8 2 Z' : pico === 'recto' ? 'M8 -4 L 32 -1 L 8 3 Z' : 'M8 -4 L 20 -1 L 8 2 Z';
  const cabeza = (tx: number, ty: number) => <g transform={`translate(${tx} ${ty})`}><path d={pc} fill={picoC as string} stroke={N} strokeWidth={1.4} strokeLinejoin="round" /><circle r={11} fill={c} stroke={N} strokeWidth={2} />{!!gorro && <path d="M-9 -5 C -5 -12, 5 -13, 10 -5 C 3 -8, -3 -8, -9 -5 Z" fill={gorro as string} />}{ojoA(4, -3, 2.4)}</g>;
  if (vuela) {
    const a = Math.sin(f * 0.45) * 36;
    return (
      <g transform={`translate(${x} ${y}) scale(${voltear ? -s * 1.4 : s * 1.4} ${s * 1.4})`} opacity={opacity}>
        <g transform="translate(2 -6)"><AlaVuelo c={al} ang={-a * 0.6 - 8} k={0.9} /></g>
        <path d={`M-26 0 L ${-46 - lc * 10} -8 L ${-42 - lc * 10} 0 L ${-46 - lc * 10} 8 Z`} fill={al} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <ellipse cx={0} cy={0} rx={28} ry={11} fill={c} stroke={N} strokeWidth={2} />
        {!!panza && <path d="M-18 6 Q 0 12 20 5" stroke={panza as string} strokeWidth={4} fill="none" strokeLinecap="round" />}
        {!!rabadilla && <path d="M-24 -2 Q -18 6 -10 8" stroke={rabadilla as string} strokeWidth={6} fill="none" strokeLinecap="round" />}
        {cabeza(28, -4)}
        <g transform="translate(4 -6)"><AlaVuelo c={al} ang={a} /></g>
      </g>
    );
  }
  const salto = moviendo ? -Math.abs(Math.sin(f / 4)) * 8 : 0;
  return (
    <g transform={`translate(${x} ${y + salto * s}) scale(${voltear ? -s * 1.4 : s * 1.4} ${s * 1.4})`} opacity={opacity}>
      <path d={`M-14 -22 L ${-34 - lc * 20} -10 L ${-32 - lc * 20} -2 L -10 -16 Z`} fill={al} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M0 -16 L -2 0 M8 -16 L 8 0 M-8 0 H 4 M2 0 H 14" stroke={N} strokeWidth={2.6} strokeLinecap="round" />
      <path d={suave([[-20, -22], [-12, -40], [4, -50], [20, -46], [22, -30], [8, -16], [-12, -14]], true)} fill={c} stroke={N} strokeWidth={2.2} />
      {!!panza && <path d={suave([[18, -30], [8, -19], [-8, -16]])} stroke={panza as string} strokeWidth={5} fill="none" strokeLinecap="round" />}
      {!!rabadilla && <path d="M-18 -18 Q -12 -12 -4 -12" stroke={rabadilla as string} strokeWidth={7} fill="none" strokeLinecap="round" />}
      <path d={suave([[-20, -22], [-10, -40], [6, -44], [4, -30], [-8, -20]], true)} fill={al} stroke={N} strokeWidth={1.8} />
      {!!mechones && <path d="M4 -24 C 8 -18, 6 -12, 0 -10 C 0 -16, -2 -20, 4 -24 Z" fill={mechones as string} stroke={N} strokeWidth={1} />}
      {cabeza(18, -54)}
    </g>
  );
};
/** Pueo: lechuza hawaiana (de pie, ojos amarillos grandes, cara redonda clara). */
const Pueo: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, vuela }) => {
  const a = Math.sin(f * 0.4) * 30;
  if (vuela) return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <g transform="translate(0 -6)"><AlaVuelo c="#7A5A38" ang={-a * 0.6 - 8} k={1.3} /></g>
      <ellipse cx={0} cy={0} rx={40} ry={18} fill="#C8A878" stroke={N} strokeWidth={2} />
      {[[-20, -4], [-6, 2], [8, -2], [-12, 8]].map(([cx, cy], i) => <path key={i} d={`M${cx} ${cy} l 2 6`} stroke="#6A4A2A" strokeWidth={2} />)}
      <g transform="translate(36 -10)"><circle r={18} fill="#C8A878" stroke={N} strokeWidth={2} /><circle cx={6} cy={-2} r={10} fill="#F2E6CC" stroke={N} strokeWidth={1.2} /><circle cx={8} cy={-3} r={5} fill="#E8C23A" stroke={N} strokeWidth={1} /><circle cx={9} cy={-3} r={2.4} fill={N} /><path d="M15 4 L 19 9 L 13 8 Z" fill="#3A3028" /></g>
      <g transform="translate(4 -8)"><AlaVuelo c="#9A7A50" ang={a} k={1.45} /></g>
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d="M-6 -12 L -8 0 M8 -12 L 8 0 M-16 0 H 0 M2 0 H 16" stroke={N} strokeWidth={3.4} strokeLinecap="round" />
      <path d={suave([[-24, -14], [-30, -50], [-18, -80], [10, -84], [26, -60], [24, -24], [6, -10]], true)} fill="#C8A878" stroke={N} strokeWidth={2.4} />
      {[[-8, -60], [4, -50], [-10, -40], [6, -34], [-6, -24], [10, -22]].map(([cx, cy], i) => <path key={i} d={`M${cx} ${cy} l 2 6`} stroke="#6A4A2A" strokeWidth={2} />)}
      <path d={suave([[-26, -20], [-30, -56], [-16, -70], [-4, -56], [-6, -24]], true)} fill="#8A6A44" stroke={N} strokeWidth={1.8} />
      <g transform="translate(10 -88)">
        <path d={suave([[-24, 8], [-22, -16], [0, -24], [22, -16], [24, 8], [0, 18]], true)} fill="#C8A878" stroke={N} strokeWidth={2.2} />
        <circle cx={8} cy={-2} r={13} fill="#F2E6CC" stroke={N} strokeWidth={1.4} />
        <circle cx={10} cy={-3} r={6.4} fill="#E8C23A" stroke={N} strokeWidth={1.2} /><circle cx={11} cy={-3} r={3} fill={N} />
        <path d="M18 6 L 22 12 L 15 10 Z" fill="#3A3028" />
        <path d="M-14 -18 l -2 -8 l 6 4 M2 -22 l 2 -8 l 3 7" stroke={N} strokeWidth={1.6} fill="#C8A878" />
      </g>
    </g>
  );
};
/** Nēnē: ganso hawaiano (cuello con surcos crema y oscuro, cabeza negra, mejillas crema). */
const Nene: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, moviendo }) => {
  const p = moviendo ? Math.sin(f / 4) * 10 : 0, cab = Math.sin(f / 18) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-4 -50 L ${-8 + p} 0 M12 -50 L ${14 - p} 0`} stroke={N} strokeWidth={7} strokeLinecap="round" />
      <path d={`M-4 -50 L ${-8 + p} 0 M12 -50 L ${14 - p} 0`} stroke="#3A3430" strokeWidth={4} strokeLinecap="round" />
      <path d={`M${-18 + p} 0 H ${2 + p} M${4 - p} 0 H ${24 - p}`} stroke={N} strokeWidth={4} strokeLinecap="round" />
      <path d={suave([[-56, -74], [-40, -100], [0, -106], [34, -96], [44, -76], [30, -52], [-10, -48], [-44, -56]], true)} fill="#9A8466" stroke={N} strokeWidth={2.4} />
      {[-36, -22, -8, 6].map((xx, i) => <path key={i} d={`M${xx} -96 q 8 10 16 0`} stroke="#5A4A38" strokeWidth={2} fill="none" />)}
      <path d={suave([[-40, -88], [-10, -98], [14, -92], [4, -76], [-24, -72]], true)} fill="#6E5A44" stroke={N} strokeWidth={1.8} />
      <path d="M-56 -74 L -70 -78 L -58 -64 Z" fill="#3A3430" stroke={N} strokeWidth={1.6} />
      <path d="M30 -94 C 34 -120, 36 -140, 38 -152" stroke={N} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M30 -94 C 34 -120, 36 -140, 38 -152" stroke="#E2D2A8" strokeWidth={17} fill="none" strokeLinecap="round" />
      {[-104, -114, -124, -134].map((yy) => <path key={yy} d={`M27 ${yy} l 14 -2`} stroke="#5A4A38" strokeWidth={1.8} />)}
      <g transform={`translate(42 -160) rotate(${cab})`}>
        <path d={suave([[-12, 10], [-14, -6], [0, -14], [16, -10], [22, 0], [12, 8]], true)} fill="#1E1A18" stroke={N} strokeWidth={2} />
        <path d="M-8 4 C -6 -2, 4 -2, 8 4 C 2 8, -4 8, -8 4 Z" fill="#E2D2A8" />
        <path d="M20 -4 L 32 0 L 20 4 Z" fill="#1E1A18" stroke={N} strokeWidth={1.4} />
        <circle cx={10} cy={-4} r={2.2} fill="#F2EEE4" />
      </g>
    </g>
  );
};
/** ʻAlae: gallineta hawaiana (gris pizarra, raya blanca al costado, patas verde-amarillas). roja = escudo rojo en la frente. */
const Alae: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, moviendo, roja }) => {
  const p = moviendo ? Math.sin(f / 4) * 8 : 0, cab = moviendo ? Math.sin(f / 4) * 5 : Math.sin(f / 18) * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-4 -30 L ${-8 + p} 0 M10 -30 L ${12 - p} 0`} stroke={N} strokeWidth={6} strokeLinecap="round" />
      <path d={`M-4 -30 L ${-8 + p} 0 M10 -30 L ${12 - p} 0`} stroke="#B8C04A" strokeWidth={3.4} strokeLinecap="round" />
      <path d={`M${-22 + p} 0 H ${4 + p} M${-2 - p} 0 H ${26 - p}`} stroke="#8A9030" strokeWidth={3} strokeLinecap="round" />
      <path d={suave([[-44, -48], [-30, -70], [4, -76], [30, -66], [36, -46], [18, -28], [-20, -28], [-40, -36]], true)} fill="#2E3034" stroke={N} strokeWidth={2.4} />
      <path d="M-34 -42 Q -6 -46 22 -38" stroke="#F2F0EA" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M-44 -48 L -54 -62 L -40 -56 Z" fill="#2E3034" stroke={N} strokeWidth={1.6} />
      <path d="M-46 -46 L -52 -36 L -40 -40 Z" fill="#F2F0EA" stroke={N} strokeWidth={1.2} />
      <g transform={`translate(34 -76) rotate(${cab})`}>
        <circle r={13} fill="#24262A" stroke={N} strokeWidth={2} />
        <path d="M8 -12 C 14 -12, 18 -6, 18 -2 L 26 2 L 12 6 Z" fill={roja ? '#C8321E' : '#E8E0C8'} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />
        <path d="M18 -2 L 26 2 L 18 5 Z" fill="#E8C23A" stroke={N} strokeWidth={1} />
        {ojoA(4, -3, 2.6)}
      </g>
    </g>
  );
};
/** Dragón del mar (Haui): cuerpo largo que ondula, aletas en el lomo y a los costados de la cabeza. */
const DragonMar: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, boca, color = '#2E6E6A', aleta = '#86CFCF' }) => {
  const n = 26, c = color as string, a = aleta as string;
  const pts: P[] = Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return [-420 + t * 420, -40 - Math.sin(t * Math.PI * 2.2 + f / 9) * 34 * (1 - t * 0.4) - (t > 0.75 ? (t - 0.75) * 4 * 120 : 0)] as P; });
  const g = (t: number) => 16 + 36 * Math.sin(Math.PI * (0.1 + 0.55 * t)); // cola fina, cuello grueso
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {pts.slice(1, -3).map(([px, py], i) => { const t = (i + 1) / (n - 1), w = g(t); return i % 2 ? null : <path key={i} d={`M${r1(px - 10)} ${r1(py - w / 2 + 2)} L ${r1(px - 2)} ${r1(py - w / 2 - 22)} L ${r1(px + 10)} ${r1(py - w / 2 + 2)} Z`} fill={a} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />; })}
      <path d={`M${pts[0][0]} ${pts[0][1]} l -40 -26 l 10 26 l -10 24 Z`} fill={a} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      {pts.map(([px, py], i) => { const t = i / (n - 1); return <circle key={`b${i}`} cx={r1(px)} cy={r1(py)} r={r1(g(t) / 2 + 2.4)} fill={N} />; })}
      {pts.map(([px, py], i) => { const t = i / (n - 1); return <circle key={`c${i}`} cx={r1(px)} cy={r1(py)} r={r1(g(t) / 2)} fill={c} />; })}
      {pts.slice(0, -1).map(([px, py], i) => { const t = i / (n - 1); return <ellipse key={`p${i}`} cx={r1(px)} cy={r1(py + g(t) * 0.28)} rx={r1(g(t) * 0.42)} ry={r1(g(t) * 0.16)} fill="#B8E0D8" />; })}
      <g transform={`translate(${r1(pts[n - 1][0])} ${r1(pts[n - 1][1])})`}>
        <path d="M-10 -20 L -34 -52 L -8 -36 L -6 -60 L 8 -30 Z" fill={a} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <path d={suave([[-26, 14], [-24, -20], [6, -30], [40, -18], [62, -6], [58, 10], boca ? [40, 22] : [36, 18], [0, 24]], true)} fill={c} stroke={N} strokeWidth={2.4} />
        {boca && <path d="M34 8 L 60 8 L 40 20 Z" fill="#7A2A2A" stroke={N} strokeWidth={1.4} />}
        <path d="M30 6 Q 46 10 58 6" stroke={N} strokeWidth={1.6} fill="none" />
        <circle cx={14} cy={-8} r={7} fill="#F2E6A8" stroke={N} strokeWidth={1.6} /><circle cx={15.5} cy={-8} r={3.4} fill={N} />
        <path d="M-6 8 L -26 26 L -2 18 Z" fill={a} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
      </g>
    </g>
  );
};
/** Calabaza cerrada con un brillo adentro (Kānemilohai guardó ahí el espíritu de Lohiʻau). */
const IpuEspiritu: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g transform="translate(14 -26)">
      <circle r={40} fill="url(#haloBlanco)" opacity={0.55 + Math.sin(f / 8) * 0.15} />
      <ellipse cx={0} cy={4} rx={24} ry={22} fill="#C99A4E" stroke={N} strokeWidth={2.2} />
      <path d="M-14 -12 Q 0 -20 14 -12 Q 0 -6 -14 -12 Z" fill="#A87A3A" stroke={N} strokeWidth={1.4} />
      <path d="M-22 8 l 6 -6 l 6 6 l 6 -6 l 6 6 l 6 -6 l 6 6 l 6 -6" stroke="#7A4A22" strokeWidth={1.6} fill="none" />
      <path d="M0 -18 v -8" stroke="#5A3A22" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};
/** Estrellas sobre la capa (Wākea, el cielo). */
const EstrellasCapa: React.FC = () => <g>{[[-50, -246], [-66, -176], [-82, -112], [-44, -150], [-60, -96], [-34, -204]].map(([x, y], i) => <Estrella key={i} x={x} y={y} r={i % 2 ? 4.5 : 6} />)}</g>;

// ---------- fichas ----------
type PP = Partial<PersonajeProps>;
const H = (p: PP, nombre?: string): Ficha => ({ tipo: 'persona', p: { barba: false, peloCorto: true, tocado: null, collar: false, ropa: 'corta', piel: PIEL_H, pelo: PELO, ...p }, griego: nombre });
const M = (p: PP, nombre?: string): Ficha => ({ tipo: 'persona', p: { mujer: true, peloCorto: true, tocado: null, collar: false, ropa: 'larga', piel: PIEL_M, pelo: PELO, ...p }, griego: nombre });
/** Animal o criatura con dibujo propio (abajo, en «animales»). */
const D = (Dibujo: React.FC<DibujoProps>, p: Record<string, unknown>, nombre?: string): Ficha => ({ tipo: 'dibujo', Dibujo, p, griego: nombre });

export const ELENCO_HAWAIANO_OFICIAL: Record<string, Ficha> = {
  // Pele: diosa del volcán. Pelo negro largo con puntas de brasa, pāʻū rojo con banda de lava, fuego en la mano y resplandor.
  pele_oficial: M({ ropaColor: '#B8321E', ribete: '#F28C28', adornos: {
    detras: <Aura id="auraPele" c="#FF6A1F" y={-290} r={190} fuerza={0.55} />,
    cabeza: <PeloLargo c={PELO} luz="#7A3A22" largo={1.2} volumen={1.25} puntas="#F27A2A" />,
    cuerpo: <><Kihei a={0.92} c="#1E1410" borde="#F28C28" motivo="#E8521F" /><BandaFalda larga y={-62} alto={26} c="#F28C28" fondo="#1E1410" /><LeiFlores colores={['#E8521F', '#F7B733']} /></>,
    mano: <FuegoMano />,
  } }, 'PELE'),
  // Hiʻiaka: hermana menor de Pele, joven. Corona y lei de lehua, pāʻū verde del bosque y una rama de ʻōhiʻa lehua.
  hiiaka_oficial: M({ s: 0.93, piel: '#AE7248', ropaColor: '#4E7A3A', ribete: '#D3263A', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.9} /><CoronaFlores colores={['#D3263A', '#E8403E']} r={6} /></>,
    cuerpo: <><Kihei a={0.92} c="#6E9A4E" borde="#D3263A" /><BandaFalda larga y={-58} alto={20} c="#2F5228" motivo="rombos" /><LeiFlores colores={['#D3263A', '#C21D33']} lehua /></>,
    mano: <RamaLehua />,
  } }, 'HIʻIAKA'),
  // Māui: semidiós joven y pícaro. Gran anzuelo de hueso Manaiakalani con su cuerda, malo rojo y pelo suelto a los hombros.
  maui_oficial: H({ s: 0.97, ropaColor: ROJO, ribete: AMARILLO, brazo: [16, 24], adornos: {
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <><BandaFalda y={-200} alto={16} c={AMARILLO} motivo="triangulos" /><RolloCuerda /></>,
    mano: <Manaiakalani />,
  } }, 'MĀUI'),
  // Kāne: dios de la vida y el agua dulce. Moño alto y barba, kīhei blanco con borde amarillo, bastón y ipu de agua.
  kane_oficial: H({ s: 1.04, ropaColor: AMARILLO, ribete: '#2C7A96', adornos: {
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} /><BarbaCorta c={PELO} luz={PELO_LUZ} /></>,
    cuerpo: <><BandaFalda y={-200} alto={16} c="#2C7A96" motivo="zigzag" /><LeiMaile /></>,
    mano: <Baston />, manoAtras: <IpuAgua />,
  } }, 'KĀNE'),
  // Kanaloa: dios del océano. Capa verde mar con ruedo de tentáculos de pulpo, malo con olas, remo y pelo suelto.
  kanaloa_oficial: H({ s: 1.04, gigante: true, piel: '#86502F', ropaColor: '#1E6E7E', ribete: '#86CFCF', adornos: {
    detras: <CapaEspalda c="#1E6E7E" forro="#2C8C96" borde="#F2E2C4" ruedo="tentaculos" largo={0.9} />,
    cabeza: <><PeloLargo c={PELO} luz="#2E4A50" largo={0.6} volumen={1.1} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.6} /></>,
    cuerpo: <><BandaFalda y={-200} alto={16} c="#86CFCF" motivo="zigzag" /><LeiNiho /></>,
    mano: <Remo />,
  } }, 'KANALOA'),
  // Kū: dios de la guerra. Casco de plumas mahiole, capa de plumas ʻahuʻula roja y amarilla, lanza y lei niho palaoa.
  ku_oficial: H({ s: 1.06, gigante: true, ropaColor: ROJO, ribete: AMARILLO, adornos: {
    detras: <CapaEspalda c={ROJO} borde={AMARILLO} ruedo="plumas" largo={0.62} ancho={0.85} bandas={[AMARILLO]} />,
    cabeza: <><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.5} /><Mahiole /></>,
    cuerpo: <><BandaFalda y={-200} alto={16} c={AMARILLO} motivo="triangulos" /><Kihei a={1.35} c={ROJO} borde={AMARILLO} nudo={false} /><LeiNiho /></>,
    mano: <Ihe />,
  } }, 'KŪ'),
  // Lono: dios de la cosecha, la lluvia y la paz. Akua loa (pértiga con kapa blanca), kīhei blanco y corona de hojas.
  lono_oficial: H({ s: 1.02, ropaColor: CREMA, ribete: '#4E7A3A', brazo: [10, 40], adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.45} /><BarbaCorta c={PELO} luz={PELO_LUZ} /><CoronaFlores colores={['#6E9A4E']} r={5} hojas="#4E7A3A" /></>,
    cuerpo: <><BandaFalda y={-200} alto={16} c="#4E7A3A" motivo="rombos" /><Kihei a={1} c="#FBF6EA" borde="#4E7A3A" /></>,
    mano: <AkuaLoa />,
  } }, 'LONO'),
  // Hina: diosa de la luna que batía kapa. Luna creciente detrás, pāʻū añil con lunitas, batidor y kapa doblada.
  hina_oficial: M({ ropaColor: '#2E3F6E', ribete: '#F4EEDC', adornos: {
    detras: <LunaDetras />,
    cabeza: <PeloLargo c={PELO} luz="#6A6E86" largo={1.1} />,
    cuerpo: <><Kihei a={0.92} c={CREMA} borde="#2E3F6E" /><BandaFalda larga y={-60} alto={22} c="#F4EEDC" motivo="triangulos" /><LeiFlores colores={['#F7EEDB', '#C9D3E8']} /></>,
    mano: <Batidor />,
  } }, 'HINA'),
  // Poliʻahu: diosa de la nieve de Mauna Kea. Manto y capucha de kapa blanca con borde celeste, copos que caen.
  poliahu_oficial: M({ piel: '#B07A52', ropaColor: '#F4F1EA', ribete: '#9FC3DB', adornos: {
    detras: <><CapaEspalda c="#FBF8F2" forro="#DDE9F0" borde="#9FC3DB" largo={1} ancho={1.1} /><Copos /></>,
    cabeza: <><PeloLargo c={PELO} largo={0.5} frente={false} /><Capucha /></>,
    cuerpo: <><Kihei a={0.92} c="#FBF8F2" borde="#9FC3DB" nudo={false} /><BandaFalda larga y={-60} alto={18} c="#9FC3DB" motivo="zigzag" /></>,
  } }, 'POLIʻAHU'),
  // Kamapuaʻa: semidiós cerdo. Fuerte y ancho, cresta de cerdas negras, capa corta de cuero oscuro, colmillos y garrote.
  kamapuaa_oficial: H({ s: 1.05, gigante: true, piel: '#7E4A2E', ropaColor: '#4E7A3A', ribete: '#2F5228', adornos: {
    detras: <CapaEspalda c="#3A2A22" forro="#4A382C" borde="#1E1611" largo={0.5} ancho={0.9} />,
    cabeza: <><CrestaCerdas /><BarbaCorta c="#1A1412" luz="#4A3C34" larga={0.3} /></>,
    cuerpo: <><LomoCerdas a={1.35} /><BandaFalda y={-196} alto={14} c="#2F5228" motivo="rayas" /><LeiColmillos /></>,
    mano: <Laau />,
  } }, 'KAMAPUAʻA'),
  // =====================================================================================================
  // Secundarios oficiales (2026-10-17): personajes con nombre, extras de la cultura y animales.
  // =====================================================================================================
  // — Familia de Pele —
  // Kamohoaliʻi: hermano mayor de Pele, rey de los tiburones y piloto de la canoa. Capa gris tiburón, lei niho palaoa y leiomano.
  kamohoalii_oficial: H({ s: 1.05, gigante: true, piel: '#86502F', ropaColor: '#3E5666', ribete: '#F2F0EA', adornos: {
    detras: <CapaEspalda c="#5E7484" forro="#3E5666" borde="#F2F0EA" largo={0.75} ancho={0.95} />,
    cabeza: <><PeloMedio c={PELO} luz="#4A5A66" /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.5} /></>,
    cuerpo: <><BandaFalda y={-200} alto={16} c="#F2F0EA" motivo="triangulos" /><LeiNiho /></>,
    mano: <Leiomano />,
  } }, 'KAMOHOALIʻI'),
  // Nāmaka: diosa del mar, hermana mayor y rival de Pele. Pāʻū de olas, lei de conchas y una ola que se enrosca en la mano.
  namaka_oficial: M({ piel: '#9A6444', ropaColor: '#1E6E7E', ribete: '#F4FBFA', brazo: [36, 50], adornos: {
    detras: <Aura id="auraNamaka" c="#3EB0C0" y={-290} r={170} fuerza={0.4} />,
    cabeza: <><PeloLargo c={PELO} luz="#2E6A78" largo={1.15} volumen={1.2} puntas="#3E9AA8" /><CoronaFlores colores={['#F4FBFA', '#86CFCF']} r={5} hojas="#2E6A5A" /></>,
    cuerpo: <><Kihei a={0.92} c="#2C8C96" borde="#F4FBFA" /><BandaFalda larga y={-62} alto={24} c="#F4FBFA" motivo="zigzag" fondo="#165A66" /><LeiConchas /></>,
    mano: <OlaMano />,
  } }, 'NĀMAKA'),
  // Haumea: madre de Pele, diosa de la fertilidad. Moño, lei de ʻilima y kukui, la rama mágica Makalei.
  haumea_oficial: M({ s: 1.02, piel: '#9A6040', ropaColor: '#8A4A22', ribete: AMARILLO, adornos: {
    cabeza: <><Mono c={PELO} luz="#8A8076" /><CoronaFlores colores={[ILIMA, AMARILLO]} r={5.5} /></>,
    cuerpo: <><Kihei a={0.92} c="#C9853E" borde="#5A2E14" motivo="#8A4A22" /><BandaFalda larga y={-60} alto={22} c={AMARILLO} motivo="rombos" /><LeiKukui /></>,
    mano: <RamaFrutos />,
  } }, 'HAUMEA'),
  // Kāneʻapua: hermano menor de Pele, dios de los pescadores. Joven, red al hombro y caracola.
  kaneapua_oficial: H({ s: 0.95, piel: '#94593A', ropaColor: '#2C6A8A', ribete: '#F2E2C4', adornos: {
    detras: <RedEspalda />,
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <BandaFalda y={-200} alto={14} c="#F2E2C4" motivo="zigzag" />,
    mano: <Pu />,
  } }, 'KĀNEʻAPUA'),
  // Kānemilohai: hermano mayor de Pele que se quedó en el mar. Kīhei verde mar y la calabaza donde guarda el espíritu de Lohiʻau.
  kanemilohai_oficial: H({ s: 1.02, piel: '#86502F', ropaColor: '#2E6A5A', ribete: '#B8E0D8', brazo: [36, 52], adornos: {
    cabeza: <><PeloLargo c={PELO} luz="#3E5A50" largo={0.55} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.9} /></>,
    cuerpo: <><Kihei a={1} c="#3E8A76" borde="#B8E0D8" /><BandaFalda y={-200} alto={14} c="#B8E0D8" motivo="zigzag" /></>,
    mano: <IpuEspiritu />,
  } }, 'KĀNEMILOHAI'),
  // Lonomakua: el tío anciano de Pele, guardián del fuego. Canas, kīhei oscuro con borde de brasa y los palos de hacer fuego.
  lonomakua_oficial: H({ cuerpo: 'viejo', pelo: CANAS, ropaColor: '#5A3A2A', ribete: '#F28C28', adornos: {
    cabeza: <><PeloLargo c={CANAS} luz={CANAS_LUZ} largo={0.45} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={0.9} /></>,
    cuerpo: <><Kihei a={1} c="#6A3A26" borde="#F28C28" /><BandaFalda y={-200} alto={14} c="#F28C28" motivo="triangulos" /></>,
    mano: <PalosFuego />,
  } }, 'LONOMAKUA'),
  // Pele disfrazada de anciana: pelo blanco largo, kīhei rojo, pāʻū negro con borde de lava y bastón.
  pele_anciana_oficial: M({ cuerpo: 'viejo', piel: '#A06A46', pelo: CANAS, ropaColor: '#1E1410', ribete: '#E8521F', adornos: {
    cabeza: <PeloLargo c={CANAS} luz={CANAS_LUZ} largo={1} volumen={1.1} puntas="#E8A06A" />,
    cuerpo: <><Kihei a={0.92} c="#9A2C1C" borde="#F28C28" /><BandaFalda larga y={-58} alto={20} c="#E8521F" motivo="triangulos" /></>,
    mano: <Cayado />,
  } }, 'PELE'),
  // Pele disfrazada de forastera hermosa (la carrera de trineos con Poliʻahu): negro y rojo lava, lehua en el pelo, sin fuego.
  pele_forastera_oficial: M({ piel: '#A86C44', ropaColor: '#1E1410', ribete: '#E8521F', adornos: {
    cabeza: <><PeloLargo c={PELO} luz="#7A3A22" largo={1.2} volumen={1.2} puntas="#C8522A" /><FlorOreja c="#D3263A" /></>,
    cuerpo: <><Kihei a={0.92} c="#2A1A14" borde="#E8521F" /><BandaFalda larga y={-60} alto={18} c="#E8521F" motivo="zigzag" /><LeiFlores colores={['#D3263A', '#C21D33']} lehua /></>,
  } }, 'PELE'),
  // — Hiʻiaka y sus compañeras —
  // Hōpoe: la mejor amiga de Hiʻiaka, bailarina de Puna. Falda de hojas de hala, lei y corona de lehua.
  hopoe_oficial: M({ piel: '#A86E46', ropaColor: '#B8955A', ribete: '#D3263A', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1} /><CoronaFlores colores={['#D3263A', '#E8403E']} r={5.5} /></>,
    cuerpo: <><Kihei a={0.92} c="#E8D2A0" borde="#D3263A" /><FaldaHojas tipo="hala" abajo={-26} /><LeiFlores colores={['#D3263A', '#C21D33']} lehua /></>,
  } }, 'HŌPOE'),
  // Haʻena: la amiga que bailaba con Hōpoe. Pāʻū amarillo de ʻilima con dos bandas y lei de ʻilima.
  haena_oficial: M({ piel: '#9E6440', ropaColor: '#E8A23A', ribete: '#F4E6C8', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.85} /><CoronaFlores colores={[ILIMA, '#F7C84A']} r={5.5} /></>,
    cuerpo: <><Kihei a={0.92} c="#F4E6C8" borde={ILIMA} /><BandaFalda larga y={-150} alto={16} c="#8A4A22" motivo="triangulos" /><BandaFalda larga y={-48} alto={20} c="#8A4A22" motivo="triangulos" /><LeiFlores colores={[ILIMA, '#F7C84A']} /></>,
  } }, 'HAʻENA'),
  // Pāʻūopalaʻe: «falda de helecho palaʻe», compañera de viaje de Hiʻiaka.
  pauopalae_oficial: M({ piel: '#A06A46', ropaColor: '#2F5228', ribete: '#6AA64A', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.9} /><CoronaFlores colores={['#6AA64A']} r={4.5} hojas="#3E6E3A" /></>,
    cuerpo: <><Kihei a={0.92} c="#6E9A4E" borde="#2F5228" /><FaldaHojas tipo="helecho" abajo={-22} /></>,
  } }, 'PĀʻŪOPALAʻE'),
  // Wahineʻōmaʻo: «la mujer de verde», la compañera humana de Hiʻiaka. Todo verde, lei maile y el atado de ti con la ofrenda.
  wahineomao_oficial: M({ piel: '#B07A52', ropaColor: '#3E7A3A', ribete: '#A8D07A', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.8} /><CoronaFlores colores={['#F7EEDB', '#A8D07A']} r={5} /></>,
    cuerpo: <><Kihei a={0.92} c="#6E9A4E" borde="#A8D07A" motivo="#3E7A3A" /><BandaFalda larga y={-60} alto={20} c="#A8D07A" motivo="rombos" /><LeiMaile /></>,
    mano: <Puolo />,
  } }, 'WAHINEʻŌMAʻO'),
  // Lohiʻau: el jefe de Kauaʻi que tocaba en el hula. Capita de plumas amarilla, lei maile e ipu heke.
  lohiau_oficial: H({ s: 1.02, piel: '#94593A', ropaColor: AMARILLO, ribete: ROJO, brazo: [30, 40], adornos: {
    detras: <CapaEspalda c={AMARILLO} borde={ROJO} ruedo="plumas" largo={0.45} ancho={0.75} bandas={[ROJO]} />,
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <><BandaFalda y={-200} alto={16} c={ROJO} motivo="triangulos" /><LeiMaile /></>,
    mano: <IpuHeke />,
  } }, 'LOHIʻAU'),
  // — Las doncellas del manto blanco (montañas nevadas) —
  // Lilinoe: la niebla fina. Gris perla, velo largo y un resplandor blanco de niebla.
  lilinoe_oficial: M({ piel: '#B07A52', ropaColor: '#E2E8EC', ribete: '#9AA8B2', adornos: {
    detras: <><Aura id="auraLilinoe" c="#FFFFFF" y={-250} r={190} fuerza={0.55} /><CapaEspalda c="#F2F4F6" forro="#DDE3E8" borde="#9AA8B2" largo={0.95} /></>,
    cabeza: <><PeloLargo c={PELO} luz="#8A96A0" largo={1.1} /><CoronaFlores colores={['#F7F8FA', '#C9D3DC']} r={4.5} hojas="#8A96A0" /></>,
    cuerpo: <><Kihei a={0.92} c="#F4F6F8" borde="#9AA8B2" nudo={false} /><BandaFalda larga y={-60} alto={16} c="#9AA8B2" motivo="rayas" /></>,
  } }, 'LILINOE'),
  // Waiau: el lago de la cumbre de Mauna Kea. Blanco con azul de lago, corona de gotas y un cuenco con agua.
  waiau_oficial: M({ piel: '#A8704A', ropaColor: '#F4F1EA', ribete: '#4AA8C8', brazo: [36, 50], adornos: {
    cabeza: <><PeloLargo c={PELO} luz="#4A6A80" largo={1} /><CoronaFlores colores={['#6EC3D8', '#F4FBFA']} r={5} hojas="#2C7A96" /></>,
    cuerpo: <><Kihei a={0.92} c="#FBF8F2" borde="#4AA8C8" /><BandaFalda larga y={-60} alto={22} c="#4AA8C8" motivo="zigzag" /></>,
    mano: <UmekeAgua />,
  } }, 'WAIAU'),
  // Kahoupokane: las nieves de Hualālai; bate kapa y su golpe es el trueno. Blanco con gris azulado y batidor.
  kahoupokane_oficial: M({ piel: '#A06A46', ropaColor: '#F4F1EA', ribete: '#6A7488', adornos: {
    cabeza: <><PeloLargo c={PELO} luz="#6A6E86" largo={1} /><CoronaFlores colores={['#F7F4EE', '#C9D3E8']} r={5} /></>,
    cuerpo: <><Kihei a={0.92} c="#FBF8F2" borde="#6A7488" motivo="#C9D3E8" /><BandaFalda larga y={-60} alto={20} c="#6A7488" motivo="triangulos" /></>,
    mano: <Batidor />,
  } }, 'KAHOUPOKANE'),
  // Moʻo con forma de mujer (dos variantes): pelo larguísimo, ropa de escamas verdes y flor amarilla.
  moo_mujer_oficial: M({ piel: '#A06A46', ropaColor: '#2F5A3A', ribete: '#C8D88A', adornos: {
    cabeza: <><PeloLargo c={PELO} luz="#3E6A4A" largo={1.25} volumen={1.2} /><FlorOreja c="#E8C23A" /></>,
    cuerpo: <><Kihei a={0.92} c="#4E7A4A" borde="#C8D88A" /><Escamas c="#7AA85A" /><BandaFalda larga y={-46} alto={18} c="#C8D88A" motivo="rombos" /></>,
  } }, 'MOʻO'),
  moo_mujer_b_oficial: M({ piel: '#9A6040', ropaColor: '#5A5A2A', ribete: '#E8D85A', adornos: {
    cabeza: <><PeloLargo c={PELO} luz="#6A6A3A" largo={1.2} volumen={1.15} /><FlorOreja c="#F7EEDB" /></>,
    cuerpo: <><Kihei a={0.92} c="#7A7A3A" borde="#E8D85A" /><Escamas c="#A8A85A" /><BandaFalda larga y={-46} alto={18} c="#E8D85A" motivo="rombos" /></>,
  } }, 'MOʻO'),
  // — Wākea, Papa y su familia —
  // Wākea: el padre cielo. Capa azul noche con estrellas, moño, lei niho palaoa y la calabaza que arrojó para hacer el cielo.
  wakea_oficial: H({ s: 1.04, ropaColor: '#24406A', ribete: '#F4E6A8', adornos: {
    detras: <><CapaEspalda c="#24406A" forro="#1A2E50" borde="#F4E6A8" largo={0.8} /><EstrellasCapa /></>,
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} /><BarbaCorta c={PELO} luz={PELO_LUZ} /></>,
    cuerpo: <><BandaFalda y={-200} alto={16} c="#F4E6A8" motivo="triangulos" /><LeiNiho /></>,
    mano: <IpuKoko />,
  } }, 'WĀKEA'),
  // Papahānaumoku: la madre tierra que dio a luz las islas. Tonos de tierra, corona de helechos, lei de kukui y una isla en las manos.
  papa_oficial: M({ s: 1.03, piel: '#9A6040', ropaColor: '#6B3F1D', ribete: '#5E9A42', brazo: [40, 50], adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1.1} volumen={1.15} /><CoronaFlores colores={['#6AA64A']} r={4.5} hojas="#3E6E3A" /></>,
    cuerpo: <><Kihei a={0.92} c="#8A5A2E" borde="#5E9A42" /><BandaFalda larga y={-60} alto={22} c="#5E9A42" motivo="triangulos" /><LeiKukui /></>,
    mano: <IslaMano />,
  } }, 'PAPA'),
  // Hoʻohōkūkalani: «la que hizo las estrellas». Azul noche con estrellitas y una estrella en el pelo.
  hoohokukalani_oficial: M({ s: 0.95, piel: '#AE7248', ropaColor: '#1E2A50', ribete: '#F4E6A8', adornos: {
    detras: <Aura id="auraHoohoku" c="#C9D3F8" y={-360} r={110} fuerza={0.4} />,
    cabeza: <><PeloLargo c={PELO} luz="#4A5A86" largo={1} /><Estrella x={-12} y={-36} r={10} /><Estrella x={8} y={-42} r={6} /></>,
    cuerpo: <><Kihei a={0.92} c="#2E3F6E" borde="#F4E6A8" /><EstrellasFalda /><LeiFlores colores={['#F7EEDB', '#F4E6A8']} /></>,
  } }, 'HOʻOHŌKŪKALANI'),
  // Hāloa: el primer hawaiano, hermano menor del kalo. Joven con malo verde y una planta de kalo; también de niño.
  haloa_oficial: H({ s: 0.97, piel: '#94593A', ropaColor: '#4E7A3A', ribete: '#A8D07A', brazo: [30, 40], adornos: {
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <><BandaFalda y={-200} alto={14} c="#A8D07A" motivo="rombos" /><LeiMaile /></>,
    mano: <Kalo />,
  } }, 'HĀLOA'),
  haloa_nino_oficial: H({ cuerpo: 'nino', piel: '#A06A46', ropaColor: '#4E7A3A', ribete: '#A8D07A', brazo: [30, 40], adornos: {
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <BandaFalda y={-200} alto={14} c="#A8D07A" motivo="rombos" />,
    mano: <Kalo k={0.9} />,
  } }, 'HĀLOA'),
  // Komoʻawa: el sacerdote sabio de Wākea. Anciano de blanco con el bastón de borla de kapa.
  komoawa_oficial: H({ cuerpo: 'viejo', pelo: CANAS, ropaColor: '#F4F1EA', ribete: '#8A6236', adornos: {
    cabeza: <><Mono c={CANAS} luz={CANAS_LUZ} r={12} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={1.2} /></>,
    cuerpo: <><Kihei a={1} c="#FBF6EA" borde="#8A6236" /><BandaFalda y={-200} alto={14} c="#8A6236" motivo="rayas" /></>,
    mano: <BastonKahuna />,
  } }, 'KOMOʻAWA'),
  // Kaʻula: otra esposa de Wākea, madre de Lānaʻi. Pāʻū granate con ʻilima.
  kaula_oficial: M({ piel: '#A86C44', ropaColor: '#7A2340', ribete: ILIMA, adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.95} /><CoronaFlores colores={[ILIMA, '#F7C84A']} r={5} /></>,
    cuerpo: <><Kihei a={0.92} c="#A83A5A" borde={ILIMA} /><BandaFalda larga y={-60} alto={20} c={ILIMA} motivo="rombos" /><LeiFlores colores={[ILIMA, '#F7C84A']} /></>,
  } }, 'KAʻULA'),
  // Lua: el esposo que tomó Papa, padre de Oʻahu. Kīhei claro, barba corta.
  lua_oficial: H({ piel: '#86502F', ropaColor: '#5A3A22', ribete: '#C9A06A', adornos: {
    cabeza: <><PeloMedio c={PELO} luz={PELO_LUZ} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.4} /></>,
    cuerpo: <><Kihei a={1} c="#C9A06A" borde="#5A3A22" /><BandaFalda y={-200} alto={14} c="#C9A06A" motivo="zigzag" /></>,
  } }, 'LUA'),
  // — El Kumulipo (canto de la creación) —
  // Kumulipo y Pōʻele: la noche profunda, el par del que nace todo. Violeta noche con halo; él con el coral (primer nacido), ella con una concha.
  kumulipo_oficial: H({ piel: '#86502F', ropaColor: '#2A2250', ribete: '#9A8AE0', brazo: [30, 40], adornos: {
    detras: <HaloNoche id="auraKumulipo" />,
    cabeza: <><PeloLargo c={PELO} luz="#4A3E80" largo={0.7} /><BarbaCorta c={PELO} luz="#4A3E80" larga={0.6} /></>,
    cuerpo: <><Kihei a={1} c="#1E1A3A" borde="#9A8AE0" motivo="#3A3270" /><BandaFalda y={-200} alto={14} c="#9A8AE0" motivo="zigzag" /></>,
    mano: <Coral />,
  } }, 'KUMULIPO'),
  poele_oficial: M({ piel: '#9A6444', ropaColor: '#1E1A3A', ribete: '#9A8AE0', brazo: [30, 40], adornos: {
    detras: <HaloNoche id="auraPoele" />,
    cabeza: <PeloLargo c={PELO} luz="#4A3E80" largo={1.2} volumen={1.2} />,
    cuerpo: <><Kihei a={0.92} c="#2A2250" borde="#9A8AE0" /><BandaFalda larga y={-60} alto={20} c="#9A8AE0" motivo="rombos" /></>,
    mano: <Pu k={0.6} c="#F2D8D0" />,
  } }, 'PŌʻELE'),
  // Laʻilaʻi y Kiʻi: la primera mujer («la calma») y el primer hombre («imagen», con un kiʻi tallado en la mano).
  lailai_oficial: M({ piel: '#A86E46', ropaColor: '#E8D8A8', ribete: '#C9A06A', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1.1} /><CoronaFlores colores={['#FBF8F2', '#F7EEDB']} r={5} /></>,
    cuerpo: <><Kihei a={0.92} c="#FBF6E6" borde="#C9A06A" /><BandaFalda larga y={-60} alto={18} c="#C9A06A" motivo="zigzag" /><LeiFlores colores={['#FBF8F2', '#F7EEDB']} /></>,
  } }, 'LAʻILAʻI'),
  kii_oficial: H({ piel: '#94593A', ropaColor: '#C9A06A', ribete: '#5A3A22', brazo: [30, 40], adornos: {
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <BandaFalda y={-200} alto={14} c="#5A3A22" motivo="triangulos" />,
    mano: <KiiMano />,
  } }, 'KIʻI'),
  // Honuaʻula y Keakahulilani: el primer hombre hecho de tierra roja y la primera mujer (Kāne los modeló).
  honuaula_oficial: H({ piel: '#94593A', ropaColor: '#A8442A', ribete: '#E8B08A', brazo: [40, 50], adornos: {
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <BandaFalda y={-200} alto={14} c="#E8B08A" motivo="triangulos" />,
    mano: <TierraRoja />,
  } }, 'HONUAʻULA'),
  keakahulilani_oficial: M({ piel: '#A86E46', ropaColor: '#A8442A', ribete: '#F4E6C8', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1} /><CoronaFlores colores={['#F4E6C8', '#E8B08A']} r={5} /></>,
    cuerpo: <><Kihei a={0.92} c="#C8643A" borde="#F4E6C8" /><BandaFalda larga y={-60} alto={18} c="#F4E6C8" motivo="triangulos" /></>,
  } }, 'KEAKAHULILANI'),
  // — Los que guardaron el canto (siglo XIX) —
  // Kalākaua: el rey que publicó el Kumulipo. Uniforme azul con charretera y banda roja, patillas y bigote.
  kalakaua_oficial: H({ s: 1.03, piel: '#9A6040', ropaColor: '#1E2A44', ribete: '#1E2A44', pantalon: '#F2EEE6', botas: '#1E1A18', adornos: {
    cabeza: <><PeloCorto /><Patillas /></>,
    cuerpo: <Saco c="#1E2A44" banda={ROJO} charretera />,
  } }, 'KALĀKAUA'),
  // Liliʻuokalani: la reina que tradujo el Kumulipo. Holokū negro con cuello de encaje, moño y corona y lei de plumas amarillas.
  liliuokalani_oficial: M({ piel: '#9A6444', ropaColor: '#1E1A22', ribete: '#1E1A22', adornos: {
    cabeza: <><Mono c={PELO} luz="#6A6060" x={-18} y={-40} r={14} /><CoronaFlores colores={[AMARILLO, '#F2C94C']} r={5} hojas="#C99A14" /></>,
    cuerpo: <><Kihei a={0.92} c="#1E1A22" nudo={false} /><CuelloEncaje /><LeiFlores colores={[AMARILLO, '#F2C94C']} /></>,
  } }, 'LILIʻUOKALANI'),
  // Samuel Kamakau: el historiador que escribió las tradiciones. Saco oscuro, barba corta y un libro.
  kamakau_oficial: H({ piel: '#9A6040', ropaColor: '#2A2622', ribete: '#2A2622', pantalon: '#2A2622', botas: '#1E1A18', brazo: [40, 50], adornos: {
    cabeza: <><PeloCorto /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.5} /></>,
    cuerpo: <Saco c="#2A2622" />,
    mano: <Libro />,
  } }, 'KAMAKAU'),
  // — Māui —
  // Akalana: el padre de Māui. Mayor, moño y barba entrecana, kīhei pardo y bastón.
  akalana_oficial: H({ s: 1.02, piel: '#86502F', ropaColor: '#6A4A2A', ribete: AMARILLO, adornos: {
    cabeza: <><Mono c="#4A403A" luz="#9A9088" /><BarbaCorta c="#4A403A" luz="#9A9088" larga={1} /></>,
    cuerpo: <><Kihei a={1} c="#8A6236" borde={AMARILLO} /><BandaFalda y={-200} alto={14} c={AMARILLO} motivo="rombos" /></>,
    mano: <Cayado />,
  } }, 'AKALANA'),
  // Ru (Manihiki): el forzudo que levantó el cielo con un poste.
  ru_oficial: H({ s: 1.05, gigante: true, piel: '#86502F', ropaColor: '#3A5A7A', ribete: '#F2E2C4', brazo: [128, 34], adornos: {
    cabeza: <><PeloMedio c={PELO} luz={PELO_LUZ} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.4} /></>,
    cuerpo: <BandaFalda y={-200} alto={16} c="#F2E2C4" motivo="triangulos" />,
    mano: <Pertiga />,
  } }, 'RU'),
  // Mujer de Samoa (el premio de ʻava al que levanta el cielo): siapo pardo con dibujos negros, flor de hibisco y copa de coco.
  samoana_oficial: M({ piel: '#A86E46', ropaColor: '#B8844E', ribete: '#1E1410', brazo: [40, 50], adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1} /><FlorOreja c="#E0402E" /></>,
    cuerpo: <><Kihei a={0.92} c="#B8844E" borde="#1E1410" motivo="#5A2E14" /><BandaFalda larga y={-120} alto={22} c="#1E1410" motivo="triangulos" /><BandaFalda larga y={-46} alto={18} c="#1E1410" motivo="rombos" /></>,
    mano: <CopaAva />,
  } }, 'SAMOA'),
  // — Kamapuaʻa —
  // Olopana: el jefe de Oʻahu. Capa de plumas amarilla con bandas rojas, lei niho palaoa y kāhili de mano.
  olopana_oficial: H({ s: 1.05, gigante: true, piel: '#86502F', ropaColor: AMARILLO, ribete: ROJO, adornos: {
    detras: <CapaEspalda c={AMARILLO} borde={ROJO} ruedo="plumas" largo={0.75} ancho={0.9} bandas={[ROJO, ROJO]} />,
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.8} /></>,
    cuerpo: <><BandaFalda y={-200} alto={16} c={ROJO} motivo="triangulos" /><Kihei a={1.35} c={AMARILLO} borde={ROJO} nudo={false} /><LeiNiho /></>,
    mano: <KahiliMano />,
  } }, 'OLOPANA'),
  // Lonoaohi: el viejo sacerdote que ató a Kamapuaʻa con nudos flojos. Blanco, canas y un rollo de cuerda.
  lonoaohi_oficial: H({ cuerpo: 'viejo', pelo: CANAS, ropaColor: '#E8DCC4', ribete: '#8A6236', adornos: {
    cabeza: <><PeloLargo c={CANAS} luz={CANAS_LUZ} largo={0.4} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={1} /></>,
    cuerpo: <><Kihei a={1} c="#F4ECD8" borde="#8A6236" /><BandaFalda y={-200} alto={14} c="#8A6236" motivo="zigzag" /></>,
    mano: <RolloMano />,
  } }, 'LONOAOHI'),
  // Kamaunuaniho: la abuela hechicera de Kamapuaʻa. Pelo blanco largo, lei de kukui y hoja de ti.
  kamaunuaniho_oficial: M({ cuerpo: 'viejo', piel: '#9A6444', pelo: CANAS, ropaColor: '#4A3A5A', ribete: '#C9B8E0', adornos: {
    cabeza: <PeloLargo c={CANAS} luz={CANAS_LUZ} largo={1.1} volumen={1.1} />,
    cuerpo: <><Kihei a={0.92} c="#6A5A7A" borde="#C9B8E0" /><BandaFalda larga y={-58} alto={18} c="#C9B8E0" motivo="rombos" /><LeiKukui /></>,
    mano: <HojaTi />,
  } }, 'KAMAUNUANIHO'),
  // Pōhakuokauaʻi: el viejo que es una roca (la que Māui sacó del mar). Manto gris piedra, canas y bastón.
  pohakuokauai_oficial: H({ cuerpo: 'viejo', piel: '#8A5A3E', pelo: CANAS, ropaColor: '#6E6A64', ribete: '#A8A49C', adornos: {
    detras: <CapaEspalda c="#7A766E" forro="#5E5A54" borde="#A8A49C" largo={0.85} />,
    cabeza: <><PeloLargo c={CANAS} luz={CANAS_LUZ} largo={0.5} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={1.3} /></>,
    cuerpo: <><Kihei a={1} c="#8A867E" borde="#5E5A54" motivo="#6E6A64" nudo={false} /><BandaFalda y={-200} alto={14} c="#A8A49C" motivo="rayas" /></>,
    mano: <Cayado c="#6E6A64" />,
  } }, 'PŌHAKUOKAUAʻI'),
  // — Leyendas de tiburones —
  // Nanaue: el hijo del rey de los tiburones. Capa gris que le tapa la espalda (ahí esconde la boca de tiburón) y collar de dientes.
  nanaue_oficial: H({ s: 1.02, piel: '#86502F', ropaColor: '#4E6A7C', ribete: '#F2F0EA', adornos: {
    detras: <><CapaEspalda c="#5E7484" forro="#4E6A7C" borde="#F2F0EA" largo={0.6} ancho={0.85} /></>,
    cabeza: <PeloMedio c={PELO} luz="#4A5A66" />,
    cuerpo: <><BandaFalda y={-200} alto={14} c="#F2F0EA" motivo="triangulos" /><LeiManoNiho /></>,
  } }, 'NANAUE'),
  nanaue_nino_oficial: H({ cuerpo: 'nino', piel: '#94593A', ropaColor: '#4E6A7C', ribete: '#F2F0EA', adornos: {
    detras: <><CapaEspalda c="#5E7484" forro="#4E6A7C" borde="#F2F0EA" largo={0.6} ancho={0.85} /></>,
    cabeza: <PeloMedio c={PELO} luz="#4A5A66" />,
    cuerpo: <BandaFalda y={-200} alto={14} c="#F2F0EA" motivo="triangulos" />,
  } }, 'NANAUE'),
  // Kalei: la madre de Nanaue. Pāʻū azul mar, lei de conchas y flor blanca.
  kalei_oficial: M({ piel: '#A86E46', ropaColor: '#2C6A8A', ribete: '#F4FBFA', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1} /><FlorOreja c="#F7EEDB" /></>,
    cuerpo: <><Kihei a={0.92} c="#86CFCF" borde="#2C6A8A" /><BandaFalda larga y={-60} alto={22} c="#F4FBFA" motivo="zigzag" /><LeiConchas /></>,
  } }, 'KALEI'),
  // Punia: el niño que engañó a los tiburones para sacar langostas. Malo naranja y una langosta en la mano.
  punia_oficial: H({ cuerpo: 'nino', piel: '#94593A', ropaColor: '#C8642A', ribete: '#F2E2C4', brazo: [50, 40], adornos: {
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <BandaFalda y={-200} alto={14} c="#F2E2C4" motivo="zigzag" />,
    mano: <Ula />,
  } }, 'PUNIA'),
  // — Extras de la cultura (varias variantes para que la gente no salga clonada; sin nombre en pantalla) —
  hawaiano_oficial: H({ ropaColor: '#8A4A22', ribete: '#F2E2C4', adornos: {
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <BandaFalda y={-200} alto={14} c="#F2E2C4" motivo="triangulos" />,
  } }),
  hawaiano_b_oficial: H({ piel: '#7E4A2E', ropaColor: '#4E6A3A', ribete: '#C9A06A', adornos: {
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.5} /></>,
    cuerpo: <><Kihei a={1} c="#C9A06A" borde="#5A3A22" /><BandaFalda y={-200} alto={14} c="#C9A06A" motivo="rombos" /></>,
  } }),
  hawaiano_c_oficial: H({ s: 0.96, piel: '#A06A46', ropaColor: '#2C5A7A', ribete: '#F2E2C4', adornos: {
    cabeza: <PeloLargo c={PELO} luz={PELO_LUZ} largo={0.4} />,
    cuerpo: <><BandaFalda y={-200} alto={14} c="#F2E2C4" motivo="zigzag" /><LeiMaile /></>,
  } }),
  hawaiana_oficial: M({ ropaColor: '#B8642E', ribete: '#F4E6C8', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1} /><CoronaFlores colores={['#E8724B', '#F7EEDB']} r={5} /></>,
    cuerpo: <><Kihei a={0.92} c="#F4E6C8" borde="#B8642E" /><BandaFalda larga y={-60} alto={20} c="#F4E6C8" motivo="triangulos" /></>,
  } }),
  hawaiana_b_oficial: M({ piel: '#9A6040', ropaColor: '#3E6A5A', ribete: AMARILLO, adornos: {
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} /><FlorOreja c="#F7EEDB" /></>,
    cuerpo: <><Kihei a={0.92} c="#6E9A7E" borde={AMARILLO} /><BandaFalda larga y={-60} alto={18} c={AMARILLO} motivo="rombos" /><LeiFlores colores={[AMARILLO, '#F2C94C']} /></>,
  } }),
  hawaiana_c_oficial: M({ piel: '#B07A52', ropaColor: '#7A3A4A', ribete: '#F7EEDB', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.6} /><FlorOreja c="#E0402E" /></>,
    cuerpo: <><Kihei a={0.92} c="#C86A6A" borde="#F7EEDB" /><BandaFalda larga y={-60} alto={18} c="#F7EEDB" motivo="zigzag" /></>,
  } }),
  anciano_hawaiano_oficial: H({ cuerpo: 'viejo', pelo: CANAS, ropaColor: '#6A4A2A', ribete: '#C9A06A', adornos: {
    cabeza: <><PeloLargo c={CANAS} luz={CANAS_LUZ} largo={0.45} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={0.8} /></>,
    cuerpo: <><Kihei a={1} c="#C9A06A" borde="#6A4A2A" /><BandaFalda y={-200} alto={14} c="#C9A06A" motivo="rayas" /></>,
    mano: <Cayado />,
  } }),
  anciana_hawaiana_oficial: M({ cuerpo: 'viejo', piel: '#9A6444', pelo: CANAS, ropaColor: '#5A4A6A', ribete: '#E8D8B0', adornos: {
    cabeza: <><Mono c={CANAS} luz={CANAS_LUZ} r={13} /><FlorOreja c="#F7EEDB" /></>,
    cuerpo: <><Kihei a={0.92} c="#8A7A9A" borde="#E8D8B0" /><BandaFalda larga y={-58} alto={18} c="#E8D8B0" motivo="triangulos" /><LeiKukui /></>,
  } }),
  nino_hawaiano_oficial: H({ cuerpo: 'nino', piel: '#9A6040', ropaColor: '#C8642A', ribete: '#F2E2C4', adornos: {
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <BandaFalda y={-200} alto={14} c="#F2E2C4" motivo="triangulos" />,
  } }),
  nino_hawaiano_b_oficial: H({ cuerpo: 'nino', piel: '#86502F', ropaColor: '#2C6A8A', ribete: '#F2E2C4', adornos: {
    cabeza: <PeloCorto />,
    cuerpo: <BandaFalda y={-200} alto={14} c="#F2E2C4" motivo="zigzag" />,
  } }),
  nina_hawaiana_oficial: M({ cuerpo: 'nino', piel: '#A86E46', ropaColor: '#D3263A', ribete: '#F7EEDB', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.8} /><CoronaFlores colores={['#F7EEDB', '#E8724B']} r={5} /></>,
    cuerpo: <><Kihei a={0.92} c="#F7EEDB" borde="#D3263A" /><BandaFalda larga y={-60} alto={20} c="#F7EEDB" motivo="triangulos" /></>,
  } }),
  nina_hawaiana_b_oficial: M({ cuerpo: 'nino', piel: '#9A6040', ropaColor: '#E8A23A', ribete: '#8A4A22', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.6} /><FlorOreja c="#D3263A" /></>,
    cuerpo: <><Kihei a={0.92} c="#F4E6C8" borde="#8A4A22" /><BandaFalda larga y={-60} alto={20} c="#8A4A22" motivo="rombos" /></>,
  } }),
  alii_oficial: H({ s: 1.04, gigante: true, piel: '#86502F', ropaColor: ROJO, ribete: AMARILLO, adornos: {
    detras: <CapaEspalda c={ROJO} borde={AMARILLO} ruedo="plumas" largo={0.65} ancho={0.9} bandas={[AMARILLO]} />,
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.6} /></>,
    cuerpo: <><BandaFalda y={-200} alto={16} c={AMARILLO} motivo="triangulos" /><Kihei a={1.35} c={ROJO} borde={AMARILLO} nudo={false} /><LeiNiho /></>,
  } }),
  alii_wahine_oficial: M({ s: 1.02, piel: '#9A6444', ropaColor: '#7A2340', ribete: AMARILLO, adornos: {
    detras: <CapaEspalda c={AMARILLO} borde={ROJO} ruedo="plumas" largo={0.42} ancho={0.7} />,
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} /><CoronaFlores colores={[AMARILLO, '#F2C94C']} r={5} /></>,
    cuerpo: <><Kihei a={0.92} c="#A83A5A" borde={AMARILLO} /><BandaFalda larga y={-60} alto={20} c={AMARILLO} motivo="triangulos" /><LeiFlores colores={[AMARILLO, '#F2C94C']} /></>,
  } }),
  kahuna_oficial: H({ cuerpo: 'viejo', pelo: CANAS, ropaColor: '#F4F1EA', ribete: '#4E7A3A', adornos: {
    cabeza: <><Mono c={CANAS} luz={CANAS_LUZ} r={12} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={1} /></>,
    cuerpo: <><Kihei a={1} c="#FBF6EA" borde="#4E7A3A" /><BandaFalda y={-200} alto={14} c="#4E7A3A" motivo="rombos" /></>,
    mano: <HojaTi />,
  } }),
  cantor_oficial: H({ cuerpo: 'viejo', pelo: CANAS, ropaColor: '#8A6236', ribete: '#F2E2C4', brazo: [30, 40], adornos: {
    cabeza: <><PeloLargo c={CANAS} luz={CANAS_LUZ} largo={0.5} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={0.7} /></>,
    cuerpo: <><Kihei a={1} c="#C9A06A" borde="#8A6236" /><BandaFalda y={-200} alto={14} c="#F2E2C4" motivo="triangulos" /><LeiMaile /></>,
    mano: <IpuHeke />,
  } }),
  pescador_oficial: H({ piel: '#7E4A2E', ropaColor: '#2C5A7A', ribete: '#F2E2C4', adornos: {
    detras: <RedEspalda />,
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <BandaFalda y={-200} alto={14} c="#F2E2C4" motivo="zigzag" />,
    mano: <PezCordel />,
  } }),
  agricultor_oficial: H({ piel: '#8E5636', ropaColor: '#6A4A2A', ribete: '#A8D07A', adornos: {
    cabeza: <><PeloMedio c={PELO} luz={PELO_LUZ} /><CoronaFlores colores={['#6AA64A']} r={3.5} hojas="#3E6E3A" /></>,
    cuerpo: <BandaFalda y={-200} alto={14} c="#A8D07A" motivo="rayas" />,
    mano: <Oo />,
  } }),
  agricultora_oficial: M({ piel: '#A06A46', ropaColor: '#6A4A2A', ribete: '#A8D07A', adornos: {
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} /><FlorOreja c="#F7EEDB" /></>,
    cuerpo: <><Kihei a={0.92} c="#C9A06A" borde="#6A4A2A" /><BandaFalda larga y={-60} alto={18} c="#A8D07A" motivo="rombos" /></>,
    mano: <CanastaKalo />,
  } }),
  guerrero_hawaiano_oficial: H({ s: 1.03, gigante: true, piel: '#86502F', ropaColor: ROJO, ribete: '#1E1410', adornos: {
    cabeza: <Mono c={PELO} luz={PELO_LUZ} />,
    cuerpo: <BandaFalda y={-200} alto={16} c="#1E1410" motivo="triangulos" />,
    mano: <LanzaGuardia />,
  } }),
  bailarina_hula_oficial: M({ piel: '#A86E46', ropaColor: '#3F7A32', ribete: '#F7EEDB', brazo: [62, 58], adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1.1} /><CoronaFlores colores={['#F7EEDB', '#6AA64A']} r={5} /></>,
    cuerpo: <><Kihei a={0.92} c="#F4E6C8" borde="#3F7A32" /><FaldaHojas tipo="ti" abajo={-50} /><LeiMaile /></>,
  } }),
  navegante_oficial: H({ piel: '#7E4A2E', ropaColor: '#2C4A6A', ribete: '#F2E2C4', adornos: {
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.6} /></>,
    cuerpo: <><Kihei a={1} c="#5A7A9A" borde="#F2E2C4" /><BandaFalda y={-200} alto={14} c="#F2E2C4" motivo="zigzag" /></>,
    mano: <RemoTimon />,
  } }),
  // — Moʻo y criaturas con nombre —
  panaewa_oficial: D(Moo, { s: 2.2, color: '#2F4A2A', panza: '#6E8A4A', manchas: '#8AA85A', cresta: '#4E7A3A' }, 'PANAʻEWA'),
  pili_oficial: D(Moo, { s: 1.8, color: '#2E5A6A', panza: '#8AC0C8', manchas: '#C8E0E0' }, 'PILI'),
  noho_oficial: D(Moo, { s: 1.8, color: '#5A4A2A', panza: '#B8A070', manchas: '#D8C080' }, 'NOHO'),
  kikipua_oficial: D(Moo, { s: 2, color: '#3E5A3A', panza: '#A8B880', manchas: '#C8C060', lengua: true }, 'KIKIPUA'),
  mokolii_oficial: D(Moo, { s: 2, color: '#4A3A30', panza: '#9A8070', manchas: '#C89A6A', cresta: '#2A201C' }, 'MOKOLIʻI'),
  haui_oficial: D(DragonMar, { s: 0.9 }, 'HAUI'),
  // — Animales —
  puaa_oficial: D(Puaa, {}, 'PUAʻA'),
  puaa_cria_oficial: D(Puaa, { s: 0.6, cria: true, color: '#5A4234' }, 'PUAʻA'),
  ilio_oficial: D(CanidoEpico, { especie: 'perro', color: '#8A6A4A', alto: 340, izq: 220, der: 200 }, 'ʻĪLIO'),
  ilio_rayado_oficial: D(CanidoEpico, { especie: 'perro', color: '#B07A44', alto: 340, izq: 220, der: 200 }, 'ʻĪLIO'),
  iole_oficial: D(Iole, { s: 0.9 }, 'ʻIOLE'),
  moo_oficial: D(Moo, { s: 0.55 }, 'MOʻO'),
  honu_oficial: D(Honu, {}, 'HONU'),
  manini_oficial: D(PezArrecife, { forma: 'manini' }, 'MANINI'),
  lauipala_oficial: D(PezArrecife, { forma: 'lauipala' }, 'LAʻIPALA'),
  humuhumu_oficial: D(PezArrecife, { forma: 'humuhumu', s: 1.2 }, 'HUMUHUMU'),
  uhu_oficial: D(PezArrecife, { forma: 'uhu', s: 1.1 }, 'UHU'),
  mano_oficial: D(Mano, {}, 'MANŌ'),
  mano_alii_oficial: D(Mano, { s: 1.5, color: '#4A5E70', rey: true }),
  naia_oficial: D(DelfinEpico, { vuela: true, alto: 160, izq: 260, der: 260 }, 'NAIʻA'),
  puhi_oficial: D(Puhi, {}, 'PUHI'),
  ilo_oficial: D(Gusano, { tipo: 'larva' }),
  koe_oficial: D(Gusano, { tipo: 'lombriz' }),
  alae_oficial: D(Alae, {}, 'ʻALAE'),
  alae_ula_oficial: D(Alae, { roja: true }, 'ʻALAE'),
  pueo_oficial: D(Pueo, {}, 'PUEO'),
  pueo_vuela_oficial: D(Pueo, { vuela: true }, 'PUEO'),
  nene_oficial: D(Nene, {}, 'NĒNĒ'),
  apapane_oficial: D(Pajaro, { color: '#C8321E', ala: '#2A2220', panza: '#F2F0EA', pico: 'curvo' }, 'ʻAPAPANE'),
  apapane_vuela_oficial: D(Pajaro, { vuela: true, color: '#C8321E', ala: '#2A2220', panza: '#F2F0EA', pico: 'curvo' }, 'ʻAPAPANE'),
  mamo_oficial: D(Pajaro, { s: 1.1, color: '#1E1C1C', ala: '#2A2626', rabadilla: '#E8C23A', pico: 'largo' }, 'MAMO'),
  oo_oficial: D(Pajaro, { s: 1.1, color: '#1E1C1C', ala: '#2A2626', mechones: '#E8C23A', pico: 'recto', cola: 1.8 }, 'ʻŌʻŌ'),
  noio_oficial: D(Pajaro, { color: '#3A3430', ala: '#2A2420', gorro: '#D8D8D4', pico: 'recto', picoC: '#1E1A18', cola: 1.2 }, 'NOIO'),
  noio_vuela_oficial: D(Pajaro, { vuela: true, color: '#3A3430', ala: '#2A2420', gorro: '#D8D8D4', pico: 'recto', picoC: '#1E1A18', cola: 1.2 }, 'NOIO'),
};
export const NOMBRE_EN_HAWAIANO_OFICIAL: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_HAWAIANO_OFICIAL).filter(([, f]) => f.griego).map(([k, f]) => [k, f.griego as string]));
