// Diseños oficiales egipcios (2026-10-15), para los Shorts "Who is…?" y los episodios nuevos. Misma receta que los
// nórdicos oficiales (elencoNordico.tsx): el muñeco de siempre con piel de color, ropa simple y 2–3 señas que
// cualquiera reconoce, según la iconografía de los templos y papiros (no la de las películas).
// Las cabezas de animal se dibujan aquí enteras (prop cabezaPropia): peluca tripartita, cuello y cabeza de perfil
// con el ojo cerca de (18,-6), igual que la cabeza humana. Los egipcios viejos de elenco.tsx quedan intactos.
import { AguilaEpica, BovinoEpico, CaballoEpico, CanidoEpico } from './bestiasEpicas'; // animales épicos (mismo dibujo que los griegos)
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, miembro, SUELO, type P, type PersonajeProps } from '../comun/vasija';
import type { DibujoProps } from './elencoAzteca';
import type { Ficha } from './elenco';
import { GatoSentado } from './elencoNordico';

const N = '#1D1712'; // contorno (el negro del tema papiro)
const ORO = '#E3B23C', ORO_CLARO = '#F4D27A', ROJO = '#C0402C', AZUL = '#2E5FA8', AZUL_OSC = '#1F2E52', TURQ = '#2E8B8C', VERDE = '#3F8A5C';
const LINO = '#F6F1E4', NEGRO = '#15120F';
const PIEL_H = '#B36A43', PIEL_M = '#DDA672';
const r1 = (v: number) => v.toFixed(1);

// ---------- cabeza: peluca, cuello y cabezas de animal ----------
/** Cuello (la cabeza propia no lo trae). */
const Cuello: React.FC<{ piel: string }> = ({ piel }) => <path d={suave([[-14, 18], [6, 16], [8, 44], [-16, 44]], true, 0.5)} fill={piel} stroke={N} strokeWidth={2} />;
/** Peluca tripartita (azul noche con rayas): masa por la nuca y un mechón por delante del hombro. */
const Tripartita: React.FC<{ c?: string; raya?: string; banda?: string; largo?: number }> = ({ c = AZUL_OSC, raya = '#3B5A94', banda = ORO, largo = 62 }) => (
  <g>
    <path d={suave([[8, -40], [-14, -42], [-34, -28], [-42, -4], [-44, 30], [-40, largo], [-18, largo + 2], [-14, 34], [-10, 12], [-2, -6], [4, -22]], true, 0.8)} fill={c} stroke={N} strokeWidth={2} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-34 + i * 7} ${-22 + i * 2} Q ${-40 + i * 7} 20 ${-36 + i * 6} ${largo - 4}`} stroke={raya} strokeWidth={1.8} fill="none" />)}
    <path d={suave([[-12, 6], [2, 4], [6, largo], [-8, largo + 2]], true, 0.4)} fill={c} stroke={N} strokeWidth={2} />
    {[0, 1].map((i) => <path key={i} d={`M${-6 + i * 5} 10 L ${-2 + i * 5} ${largo - 4}`} stroke={raya} strokeWidth={1.6} />)}
    <path d={`M-9 ${largo - 8} L 6 ${largo - 9}`} stroke={banda} strokeWidth={4} />
    <path d={`M-40 ${largo - 6} L -19 ${largo - 4}`} stroke={banda} strokeWidth={4} />
  </g>
);
/** Ojo de animal (iris de color, pupila y brillo) con raya de kohl. */
const OjoAnimal: React.FC<{ x: number; y: number; iris?: string; r?: number; kohl?: boolean; aro?: string }> = ({ x, y, iris = ORO, r = 5.5, kohl = true, aro = N }) => (
  <g>
    {kohl && <path d={`M${x - r - 4} ${y} L ${x + r + 10} ${y + 2}`} stroke={aro} strokeWidth={2.4} strokeLinecap="round" />}
    <ellipse cx={x} cy={y} rx={r + 1} ry={r} fill={iris} stroke={aro} strokeWidth={1.8} />
    <circle cx={x + 1} cy={y} r={r * 0.55} fill={NEGRO} />
    <circle cx={x + 2.4} cy={y - 1.6} r={1.2} fill="#FFFFFF" />
  </g>
);
type Animal = 'halcon' | 'chacal' | 'set' | 'ibis' | 'leona' | 'gato';
/** Cabeza de animal de perfil (mirando a la derecha), con cuello y peluca. */
const Cabeza: React.FC<{ tipo: Animal; piel: string; peluca?: boolean }> = ({ tipo, piel, peluca = true }) => {
  const fondo = peluca ? <Tripartita /> : null;
  const cara = (() => {
    switch (tipo) {
      case 'halcon': return (
        <g>
          <path d={suave([[-22, -20], [-10, -36], [8, -40], [26, -32], [34, -20], [36, -8], [32, 6], [22, 16], [6, 22], [-10, 22], [-20, 8]], true, 0.85)} fill="#6E4E30" stroke={N} strokeWidth={2} />
          <path d={suave([[4, -2], [22, 0], [32, 4], [24, 14], [8, 22], [-6, 20], [-2, 6]], true, 0.8)} fill="#EADBB8" />
          <path d="M14 -4 C 10 4, 8 14, 12 22 C 17 14, 19 4, 19 -4 Z" fill="#2A1E14" />
          <path d="M6 -20 C 14 -26, 24 -24, 30 -18" stroke="#3A2614" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M32 -18 C 36 -21, 39 -18, 39 -14 L 37 -4 L 32 -4 Z" fill={ORO} stroke={N} strokeWidth={1.4} />
          <path d="M36 -19 C 46 -19, 53 -8, 51 6 C 50 12, 45 12, 45 6 C 45 0, 41 -2, 37 -3 Z" fill="#3A3F48" stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
          <OjoAnimal x={20} y={-11} iris={ORO} r={5.5} kohl={false} />
        </g>
      );
      case 'chacal': return (
        <g>
          <path d="M-6 -28 L -2 -88 L 18 -30 Z" fill={NEGRO} stroke={ORO} strokeWidth={1.8} strokeLinejoin="round" />
          <path d="M0 -36 L 2 -74 L 12 -36 Z" fill="#5A4426" />
          <path d={suave([[-20, -16], [-8, -32], [10, -34], [24, -24], [36, -16], [58, -6], [67, 2], [63, 10], [42, 12], [24, 16], [6, 22], [-12, 20]], true, 0.7)} fill={NEGRO} stroke={ORO} strokeWidth={1.8} />
          <circle cx={65} cy={3} r={3.2} fill="#000" />
          <path d="M60 10 L 38 12" stroke={ORO} strokeWidth={1.2} opacity={0.8} />
          <OjoAnimal x={16} y={-14} iris={ORO_CLARO} r={4.5} aro={ORO} />
        </g>
      );
      case 'set': return (
        <g>
          <path d="M-4 -28 L -8 -76 L 6 -80 L 8 -30 Z M6 -30 L 12 -74 L 24 -72 L 18 -28 Z" fill="#8E3A26" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
          <path d={suave([[-20, -16], [-8, -32], [10, -34], [24, -26], [40, -22], [55, -10], [63, 4], [60, 12], [50, 7], [36, 10], [22, 16], [6, 22], [-12, 20]], true, 0.75)} fill="#9E4430" stroke={N} strokeWidth={2} />
          <path d="M34 -16 C 44 -14, 52 -6, 56 2" stroke="#6E2A1A" strokeWidth={2} fill="none" />
          <OjoAnimal x={16} y={-14} iris="#E9C46A" r={4.5} />
        </g>
      );
      case 'ibis': return (
        <g>
          <path d="M24 -16 C 44 -14, 62 2, 72 32 C 74 39, 69 41, 67 35 C 59 13, 44 1, 24 -2 Z" fill="#2A2420" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
          <path d={suave([[-18, -16], [-4, -32], [14, -32], [26, -22], [28, -8], [22, 2], [8, 10], [-12, 12]], true, 0.85)} fill={NEGRO} stroke={N} strokeWidth={2} />
          <path d="M14 -30 C 20 -28, 26 -22, 27 -12" stroke="#4A4440" strokeWidth={1.6} fill="none" />
          <OjoAnimal x={12} y={-16} iris="#F4EFE2" r={4.5} kohl={false} aro="#6E6A66" />
        </g>
      );
      case 'leona': return (
        <g>
          <path d="M-8 -32 C -10 -50, 8 -52, 8 -36 Z" fill="#B37428" stroke={N} strokeWidth={1.8} />
          <path d={suave([[-24, -14], [-14, -34], [8, -40], [26, -32], [36, -18], [42, -8], [45, 4], [38, 14], [24, 22], [6, 26], [-14, 22], [-24, 6]], true, 0.85)} fill="#C8892E" stroke={N} strokeWidth={2} />
          <path d={suave([[24, -4], [42, -6], [46, 4], [40, 14], [26, 18], [18, 8]], true, 0.8)} fill="#EBC27A" />
          <path d="M40 -8 L 47 -6 L 44 0 Z" fill="#5A3020" />
          <path d="M44 6 Q 36 10 28 8" stroke={N} strokeWidth={1.6} fill="none" />
          <path d="M16 -6 C 14 2, 16 10, 22 14" stroke="#8A5520" strokeWidth={2} fill="none" />
          {[[32, 4], [36, 7], [31, 9]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.1} fill="#6E3A1A" />)}
          <OjoAnimal x={20} y={-14} iris="#D9B23A" r={4.6} />
        </g>
      );
      case 'gato': return (
        <g>
          <path d="M-16 -22 L -20 -58 L -4 -30 Z" fill="#1E1D22" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
          <path d="M-12 22 C 0 26, 12 26, 20 18" stroke={ORO} strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M-8 -26 L -4 -66 L 14 -32 Z" fill="#2B2A30" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
          <path d="M-3 -32 L -2 -56 L 8 -34 Z" fill="#C98A8A" />
          <path d={suave([[-20, -12], [-12, -30], [8, -36], [24, -28], [32, -16], [39, -5], [38, 5], [30, 12], [16, 18], [0, 20], [-14, 16]], true, 0.85)} fill="#2B2A30" stroke={N} strokeWidth={2} />
          <path d="M37 -4 L 41 -2 L 38 2 Z" fill="#C98A8A" />
          <path d="M38 5 Q 32 9 26 7" stroke="#6E6A70" strokeWidth={1.4} fill="none" />
          {[0, 1].map((i) => <path key={i} d={`M30 ${4 + i * 3} L 50 ${1 + i * 6}`} stroke="#9A969E" strokeWidth={0.9} />)}
          <OjoAnimal x={20} y={-12} iris="#7CC46A" r={4.6} kohl={false} aro="#6E6A70" />
        </g>
      );
    }
  })();
  return <g><Cuello piel={piel} />{fondo}{cara}</g>;
};

// ---------- coronas y tocados (coords de cabeza) ----------
/** Ureo: la cobra erguida de la frente. */
const Ureo: React.FC<{ x?: number; y?: number }> = ({ x = 24, y = -40 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-8 8 C 2 10, 6 2, 2 -6" stroke={ORO} strokeWidth={4} fill="none" strokeLinecap="round" />
    <ellipse cx={3} cy={-12} rx={5} ry={8} fill={ORO} stroke={N} strokeWidth={1.4} />
    <circle cx={5} cy={-16} r={1.4} fill={NEGRO} />
  </g>
);
/** Disco solar rojo con ureo (Ra, Sekhmet). */
const DiscoSolar: React.FC<{ r?: number; y?: number }> = ({ r = 28, y = -72 }) => (
  <g>
    <circle cx={0} cy={y} r={r + 7} fill="#FFE7A0" opacity={0.35} />
    <circle cx={0} cy={y} r={r} fill={ROJO} stroke={ORO} strokeWidth={4} />
    <circle cx={-8} cy={y - 8} r={r * 0.3} fill="#E0644A" />
    <path d={`M${r * 0.6} ${y + r * 0.9} C ${r + 8} ${y + r * 0.6}, ${r + 10} ${y + 4}, ${r + 2} ${y - 6}`} stroke={ORO} strokeWidth={4} fill="none" strokeLinecap="round" />
    <ellipse cx={r + 2} cy={y - 10} rx={5} ry={8} fill={ORO} stroke={N} strokeWidth={1.4} />
  </g>
);
/** Doble corona del Alto y Bajo Egipto (Horus): roja por fuera, blanca por dentro. */
const DobleCorona: React.FC = () => (
  <g>
    <path d="M-16 -40 C -18 -66, -10 -96, 2 -110 C 14 -96, 20 -66, 18 -40 Z" fill={LINO} stroke={N} strokeWidth={2.2} />
    <circle cx={2} cy={-110} r={5} fill={LINO} stroke={N} strokeWidth={1.8} />
    <path d="M-30 -22 L -30 -76 L -18 -76 L -16 -44 L 30 -44 L 30 -22 Z" fill={ROJO} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-16 -46 C -6 -60, 4 -60, 6 -50 C 6 -44, 0 -44, 0 -48" stroke={ORO} strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M-30 -24 L 30 -24" stroke={ORO} strokeWidth={3} />
    <Ureo x={30} y={-34} />
  </g>
);
/** Atef (Osiris): corona blanca con dos plumas de avestruz a los lados y cuernos de carnero. */
const Atef: React.FC = () => (
  <g>
    <path d="M-28 -36 C -42 -60, -42 -100, -30 -124 C -22 -100, -20 -60, -18 -36 Z" fill={LINO} stroke={N} strokeWidth={2} />
    <path d="M22 -36 C 34 -60, 36 -100, 26 -124 C 18 -100, 14 -60, 12 -36 Z" fill={LINO} stroke={N} strokeWidth={2} />
    {[-90, -66].map((y) => <path key={y} d={`M-36 ${y} L -21 ${y + 4} M18 ${y + 4} L 31 ${y}`} stroke="#9AA7B2" strokeWidth={1.4} />)}
    <path d="M-16 -36 C -18 -64, -10 -92, 0 -106 C 10 -92, 16 -64, 14 -36 Z" fill="#FBF8EF" stroke={N} strokeWidth={2.2} />
    <circle cx={0} cy={-106} r={5} fill={ORO} stroke={N} strokeWidth={1.6} />
    <path d="M-34 -34 C -50 -36, -52 -26, -40 -22 M14 -34 C 32 -38, 50 -34, 46 -24" stroke="#C9A46A" strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M-30 -30 L 26 -32" stroke={ORO} strokeWidth={5} strokeLinecap="round" />
    <Ureo x={26} y={-40} />
  </g>
);
/** Corona de Amón: gorro ceñido con dos plumas altas, una roja y una azul. */
const PlumasAmon: React.FC = () => (
  <g>
    <path d="M-20 -36 C -26 -70, -24 -120, -14 -150 C -4 -120, -2 -70, 0 -36 Z" fill={ROJO} stroke={N} strokeWidth={2} />
    <path d="M2 -36 C 4 -70, 6 -120, 16 -150 C 26 -120, 28 -70, 22 -36 Z" fill={AZUL} stroke={N} strokeWidth={2} />
    {[-120, -96, -72, -52].map((y) => <path key={y} d={`M-22 ${y} L -3 ${y + 3} M4 ${y + 3} L 24 ${y}`} stroke={ORO} strokeWidth={1.6} />)}
    <Gorro />
    <Ureo x={26} y={-40} />
  </g>
);
/** Trono sobre la cabeza (Isis: su nombre es el jeroglífico del trono). */
const Trono: React.FC = () => (
  <g>
    <path d="M-20 -36 L 20 -38 L 18 -46 L -18 -44 Z" fill={ORO} stroke={N} strokeWidth={1.6} />
    <path d="M-14 -44 L -14 -98 L 2 -98 L 2 -68 L 18 -68 L 18 -44 Z" fill={AZUL} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-10 -94 L -2 -94 M-10 -86 L -2 -86 M-10 -78 L -2 -78 M4 -64 L 14 -64" stroke={ORO} strokeWidth={2.4} />
    <path d="M-14 -50 L 18 -50" stroke={ORO} strokeWidth={3} />
  </g>
);
/** Cuernos de vaca con disco solar (Hathor). */
const CuernosDisco: React.FC = () => (
  <g>
    {['M-4 -38 C -40 -44, -44 -96, -10 -112', 'M8 -38 C 44 -46, 46 -96, 14 -112'].map((d) => <g key={d}><path d={d} stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" /><path d={d} stroke="#D9C9A6" strokeWidth={5} fill="none" strokeLinecap="round" /></g>)}
    <circle cx={2} cy={-78} r={24} fill={ROJO} stroke={ORO} strokeWidth={4} />
    <circle cx={-6} cy={-86} r={7} fill="#E0644A" />
    <path d="M-20 -40 L 24 -42" stroke={ORO} strokeWidth={5} strokeLinecap="round" />
    <Ureo x={26} y={-46} />
  </g>
);
/** Luna creciente con el disco lunar (Thoth). */
const Luna: React.FC = () => (
  <g>
    <circle cx={0} cy={-62} r={18} fill="#EEF0F2" stroke={N} strokeWidth={2} />
    <path d="M-26 -66 C -26 -36, 26 -36, 26 -66 C 18 -46, -18 -46, -26 -66 Z" fill={ORO} stroke={N} strokeWidth={2} />
  </g>
);
/** Ganso sobre la cabeza (Geb: su nombre se escribe con el ganso). */
const Ganso: React.FC = () => (
  <g transform="translate(-6 -40)">
    <path d="M-4 0 L -6 8 M6 0 L 6 8" stroke="#D9762A" strokeWidth={3} strokeLinecap="round" />
    <path d={suave([[-30, -18], [-16, -30], [8, -30], [20, -24], [18, -8], [4, 0], [-16, 0], [-28, -8]], true, 0.8)} fill={LINO} stroke={N} strokeWidth={2} />
    <path d="M-24 -18 C -14 -26, 0 -26, 10 -18" stroke="#B9A98A" strokeWidth={2.4} fill="none" />
    <path d="M14 -26 C 16 -40, 18 -50, 26 -54" stroke={LINO} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M14 -26 C 16 -40, 18 -50, 26 -54" stroke={N} strokeWidth={1.4} fill="none" strokeDasharray="0" opacity={0.0} />
    <circle cx={27} cy={-55} r={7} fill="#4A4440" stroke={N} strokeWidth={1.6} />
    <path d="M32 -57 L 42 -53 L 32 -51 Z" fill="#D9762A" stroke={N} strokeWidth={1.2} />
    <circle cx={28} cy={-57} r={1.4} fill="#FFFFFF" />
  </g>
);
/** Gorro ceñido azul (Ptah). */
const Gorro: React.FC = () => (
  <g>
    <path d={suave([[26, -24], [18, -38], [-2, -43], [-22, -38], [-33, -18], [-33, 6], [-22, 8], [-14, -12], [4, -22], [16, -24]], true, 0.85)} fill={AZUL} stroke={N} strokeWidth={2} />
    <path d="M14 -36 C 0 -40, -18 -36, -28 -22" stroke="#6E94D0" strokeWidth={2} fill="none" />
  </g>
);
/** Peluca larga de diosa (negra, raya al medio, banda de oro). */
const PelucaDiosa: React.FC<{ c?: string; banda?: string }> = ({ c = NEGRO, banda = ORO }) => (
  <g>
    <path d={suave([[22, -28], [6, -42], [-18, -40], [-36, -20], [-42, 20], [-40, 60], [-16, 64], [-14, 30], [-10, 6], [-4, -12], [10, -24]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} />
    <path d={suave([[-12, 4], [0, 4], [4, 62], [-10, 64]], true, 0.4)} fill={c} stroke={N} strokeWidth={2} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${-30 + i * 7} ${-20 + i * 3} Q ${-36 + i * 7} 20 ${-34 + i * 7} 58`} stroke="#3A3640" strokeWidth={1.6} fill="none" />)}
    <path d="M18 -32 C 2 -38, -20 -34, -34 -16" stroke={banda} strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M-10 58 L 4 57 M-38 56 L -18 58" stroke={banda} strokeWidth={4} />
  </g>
);
/** Peluca corta de dios (Geb). */
const PelucaCorta: React.FC = () => (
  <g>
    <path d={suave([[22, -28], [4, -42], [-22, -38], [-36, -14], [-36, 22], [-16, 26], [-12, 6], [-4, -12], [10, -24]], true, 0.85)} fill={NEGRO} stroke={N} strokeWidth={2} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${-30 + i * 8} ${-20 + i * 3} L ${-30 + i * 7} 20`} stroke="#3A3640" strokeWidth={1.4} />)}
  </g>
);
/** Barba postiza trenzada de los dioses (curva en la punta). */
const BarbaDios: React.FC<{ recta?: boolean }> = ({ recta }) => (
  <g>
    <path d={recta ? 'M16 28 L 26 28 L 26 54 L 16 54 Z' : 'M16 28 L 26 28 C 28 40, 30 50, 36 56 C 28 58, 20 52, 16 40 Z'} fill={NEGRO} stroke={N} strokeWidth={1.6} />
    {[34, 40, 46].map((y) => <path key={y} d={`M16 ${y} L ${recta ? 26 : 28} ${y}`} stroke="#4A4440" strokeWidth={1.2} />)}
    <path d="M14 28 L 6 22" stroke="#3A2A20" strokeWidth={1.4} />
  </g>
);

// ---------- cuerpo ----------
/** Usekh: el collar ancho de cuentas (bandas de color y gotas en el borde). */
const Usekh: React.FC<{ a?: number; bandas?: string[] }> = ({ a = 1, bandas = [AZUL, ORO, ROJO, TURQ] }) => {
  const arco = (k: number) => suave([[-26 * a, -300 + k * 2], [4, -286 + k * 9], [33 * a, -294 + k * 4]]);
  return (
    <g>
      <path d={`${suave([[-26 * a, -302], [4, -288], [33 * a, -296]])} L ${r1(33 * a)} -276 ${suave([[33 * a, -276], [4, -256], [-26 * a, -278]]).replace('M', 'L')} Z`} fill={bandas[0]} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      {bandas.slice(1).map((b, i) => <path key={i} d={arco(1.2 + i * 1.1)} stroke={b} strokeWidth={4.5} fill="none" strokeLinecap="round" />)}
      {Array.from({ length: 8 }, (_, i) => { const t = i / 7, x = -24 * a + t * 56 * a, y = -278 + Math.sin(t * Math.PI) * 20 + t * 2; return <ellipse key={i} cx={r1(x)} cy={r1(y + 3)} rx={2.6} ry={4} fill={i % 2 ? ORO : TURQ} stroke={N} strokeWidth={0.9} />; })}
    </g>
  );
};
/** Vestido ceñido de diosa: cubre el torso (va con ropa 'larga' del mismo color). */
const Vestido: React.FC<{ c: string; borde?: string; a?: number }> = ({ c, borde = ORO, a = 0.92 }) => (
  <g>
    <path d={suave([[-20 * a, -300], [18 * a, -304], [34 * a, -282], [30 * a, -248], [22 * a, -212], [-22 * a, -208], [-30 * a, -250], [-30 * a, -284]], true)} fill={c} stroke={N} strokeWidth={2} />
    <path d={suave([[-26 * a, -232], [0, -228], [26 * a, -232]])} stroke={borde} strokeWidth={3} fill="none" />
  </g>
);
/** Faldellín plisado (shendyt) con el delantal de adelante a rayas. */
const Delantal: React.FC<{ c1?: string; c2?: string }> = ({ c1 = ORO, c2 = AZUL }) => (
  <g>
    <path d="M2 -214 L 24 -216 L 30 -150 L 8 -148 Z" fill={c1} stroke={N} strokeWidth={1.8} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${4 + i * 1} ${-200 + i * 14} L ${26 + i * 1} ${-202 + i * 14}`} stroke={c2} strokeWidth={4} />)}
    <path d="M-28 -218 L 26 -220" stroke={c1} strokeWidth={8} strokeLinecap="round" />
    <path d="M-28 -218 L 26 -220" stroke={N} strokeWidth={1.2} strokeDasharray="5 5" />
  </g>
);
/** Faja de momia sobre el vestido largo (Osiris, Ptah): vendas cruzadas. */
const Vendas: React.FC<{ c?: string; linea?: string }> = ({ c = LINO, linea = '#B9AE98' }) => (
  <g>
    <path d="M-30 -214 L 28 -216 L 40 -100 L 50 -10 L -40 -8 L -38 -110 Z" fill={c} stroke={N} strokeWidth={2} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-36 + (i % 2) * 2} ${-196 + i * 21} L ${38 + i * 1.2} ${-206 + i * 21}`} stroke={linea} strokeWidth={1.6} />)}
  </g>
);
/** Estrellas doradas sobre el cuerpo (Nut). */
const Estrellas: React.FC<{ n?: number; area: [number, number, number, number] }> = ({ n = 16, area: [x0, y0, x1, y1] }) => (
  <g>{Array.from({ length: n }, (_, i) => { const x = x0 + ((i * 37) % 100) / 100 * (x1 - x0), y = y0 + ((i * 61) % 100) / 100 * (y1 - y0), s = 4 + (i % 3); return <path key={i} d={`M${r1(x)} ${r1(y - s)} L ${r1(x + s * 0.3)} ${r1(y - s * 0.3)} L ${r1(x + s)} ${r1(y)} L ${r1(x + s * 0.3)} ${r1(y + s * 0.3)} L ${r1(x)} ${r1(y + s)} L ${r1(x - s * 0.3)} ${r1(y + s * 0.3)} L ${r1(x - s)} ${r1(y)} L ${r1(x - s * 0.3)} ${r1(y - s * 0.3)} Z`} fill={ORO_CLARO} />; })}</g>
);

// ---------- objetos en la mano (origen = mano) ----------
/** Cetro was (cabeza del animal de Set arriba, horquilla abajo). abajo = distancia al suelo. */
const Was: React.FC<{ abajo?: number; c?: string }> = ({ abajo = 220, c = ORO }) => (
  <g>
    <path d={`M0 ${abajo - 14} L 0 -150`} stroke={N} strokeWidth={9} strokeLinecap="round" />
    <path d={`M0 ${abajo - 14} L 0 -150`} stroke={c} strokeWidth={5} strokeLinecap="round" />
    <path d="M-1 -150 C 2 -168, 22 -172, 30 -162 L 18 -156 C 12 -160, 6 -158, 4 -148 Z" fill={c} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
    <path d={`M0 ${abajo - 16} l -8 16 M0 ${abajo - 16} l 8 16`} stroke={N} strokeWidth={5} strokeLinecap="round" />
  </g>
);
/** Cetro de Ptah: was + pilar djed + ankh en una sola vara. */
const CetroPtah: React.FC<{ abajo?: number }> = ({ abajo = 200 }) => (
  <g>
    <Was abajo={abajo} c={ORO} />
    <g transform="translate(0 -112)">
      <rect x={-9} y={-12} width={18} height={30} fill={AZUL} stroke={N} strokeWidth={1.6} />
      {[-8, -2, 4].map((y) => <rect key={y} x={-14} y={y} width={28} height={4} fill={ORO} stroke={N} strokeWidth={1} />)}
    </g>
    <g transform="translate(0 -60)"><path d="M0 -6 C -12 -14, -12 -34, 0 -34 C 12 -34, 12 -14, 0 -6 Z M-14 -6 H 14" stroke={ORO} strokeWidth={6} fill="none" /><path d="M0 -6 C -12 -14, -12 -34, 0 -34 C 12 -34, 12 -14, 0 -6 Z M-14 -6 H 14" stroke={N} strokeWidth={1.2} fill="none" /></g>
  </g>
);
/** Lanza larga (Set, que defiende la barca del Sol). */
const Lanza: React.FC<{ abajo?: number }> = ({ abajo = 220 }) => (
  <g>
    <path d={`M0 ${abajo - 8} L 0 -170`} stroke={N} strokeWidth={8} strokeLinecap="round" />
    <path d={`M0 ${abajo - 8} L 0 -170`} stroke="#8A5A30" strokeWidth={4} strokeLinecap="round" />
    <path d="M0 -206 C 8 -192, 8 -178, 0 -166 C -8 -178, -8 -192, 0 -206 Z" fill="#D6DDE3" stroke={N} strokeWidth={1.8} />
    <rect x={-4} y={-170} width={8} height={10} fill={ORO} stroke={N} strokeWidth={1.2} />
  </g>
);
/** Balanza del juicio (Anubis pesa el corazón contra la pluma de Maat). */
const Balanza: React.FC = () => (
  <g>
    <path d="M0 -6 L 0 16" stroke={N} strokeWidth={3} />
    <path d="M-40 16 L 40 16" stroke={ORO} strokeWidth={5} strokeLinecap="round" />
    <path d="M-40 16 L 40 16" stroke={N} strokeWidth={1} />
    {[-40, 40].map((x) => <g key={x}><path d={`M${x} 16 L ${x - 12} 50 M${x} 16 L ${x + 12} 50`} stroke={N} strokeWidth={1.2} /><path d={`M${x - 16} 50 Q ${x} 60 ${x + 16} 50 Z`} fill={ORO} stroke={N} strokeWidth={1.6} /></g>)}
    <path d="M-44 48 C -48 40, -40 36, -40 42 C -40 36, -32 40, -36 48 L -40 50 Z" fill={ROJO} stroke={N} strokeWidth={1} />
    <path d="M40 48 C 44 40, 46 32, 42 26 C 40 34, 38 42, 40 48 Z" fill={LINO} stroke={N} strokeWidth={1} />
  </g>
);
/** Paleta de escriba y cálamo (Thoth). */
const Paleta: React.FC = () => (
  <g transform="rotate(-18)">
    <rect x={-8} y={-96} width={18} height={100} rx={3} fill="#E9D9A6" stroke={N} strokeWidth={2} />
    <circle cx={1} cy={-86} r={4} fill={NEGRO} /><circle cx={1} cy={-74} r={4} fill={ROJO} />
    <rect x={-3} y={-60} width={8} height={50} rx={2} fill="#C9B47A" stroke={N} strokeWidth={1} />
    <path d="M18 -110 L 30 6" stroke="#8A6A3A" strokeWidth={3.4} strokeLinecap="round" />
    <path d="M18 -110 l -1 -8" stroke={NEGRO} strokeWidth={2.4} strokeLinecap="round" />
  </g>
);
/** Sistro (Hathor, Bastet): sonajero sagrado con barras que suenan. */
const Sistro: React.FC = () => {
  const f = useCurrentFrame(), g = Math.sin(f / 5) * 2;
  return (
    <g transform="rotate(10)">
      <rect x={-3} y={-30} width={6} height={44} rx={2} fill={ORO} stroke={N} strokeWidth={1.4} />
      <path d="M-14 -30 C -18 -66, 18 -66, 14 -30" stroke={ORO} strokeWidth={5} fill="none" />
      <path d="M-14 -30 C -18 -66, 18 -66, 14 -30" stroke={N} strokeWidth={1.2} fill="none" />
      {[-52, -44, -36].map((y, i) => <g key={y}><path d={`M-16 ${y} L 16 ${y}`} stroke={N} strokeWidth={1.6} /><circle cx={-8 + g * (i % 2 ? 1 : -1)} cy={y} r={2.4} fill={ORO_CLARO} stroke={N} strokeWidth={0.8} /><circle cx={6 - g * (i % 2 ? 1 : -1)} cy={y} r={2.4} fill={ORO_CLARO} stroke={N} strokeWidth={0.8} /></g>)}
    </g>
  );
};
/** Cayado y mayal cruzados sobre el pecho (Osiris). */
const CayadoMayal: React.FC = () => (
  <g transform="scale(0.85)">
    <path d="M-2 24 L -22 -38" stroke={N} strokeWidth={7} strokeLinecap="round" />
    <path d="M-2 24 L -22 -38" stroke={ORO} strokeWidth={3.5} strokeLinecap="round" />
    {[0, 1, 2].map((i) => <g key={i}><path d={`M-22 -38 C ${-30 - i * 5} -34, ${-36 - i * 6} -22, ${-34 - i * 6} -6`} stroke={N} strokeWidth={3} fill="none" />{[0, 1, 2, 3].map((k) => <circle key={k} cx={-25 - i * 3.5 - k * (2 + i * 1.2)} cy={-33 + k * 8} r={2.6} fill={k % 2 ? AZUL : ROJO} stroke={N} strokeWidth={0.8} />)}</g>)}
    <path d="M2 28 L 8 -46 C 10 -66, 34 -66, 32 -48" stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M2 28 L 8 -46 C 10 -66, 34 -66, 32 -48" stroke={ORO} strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M2 28 L 8 -46" stroke={AZUL} strokeWidth={5} strokeDasharray="5 6" />
  </g>
);

// =====================================================================================================
// SECUNDARIOS (2026-10-17): dioses menores, mortales con nombre, extras de cada día y animales, con la
// misma receta de los dioses de arriba. Gente común: piel natural, lino blanco y una o dos señas claras
// (peluca, pañuelo, cabeza afeitada, mechón de la infancia). Extranjeros con la ropa de su tierra tal como
// la pintaban los egipcios (lana de colores y barba los de Retenu, gorro alto los de Biblos y Hatti).
// =====================================================================================================
const PIEL_H2 = '#9E5A36', PIEL_EXT = '#C08458', PIEL_NUBIA = '#6A3C22', PIEL_CLARA = '#E2B48A';
const OCRE = '#C98A2E', MADERA = '#8A5A30', BLANCO = '#FBF8EF';

// ---------- cabeza (coords de cabeza: cara de perfil a la derecha, ojo en 18,-6) ----------
/** Peluca redonda corta (gente común, escribas, nobles): melena al mentón que tapa la oreja. */
const PelucaRedonda: React.FC<{ c?: string; banda?: string; raya?: string }> = ({ c = NEGRO, banda, raya = '#3A3640' }) => (
  <g>
    <path d={suave([[24, -32], [4, -44], [-22, -42], [-40, -20], [-42, 12], [-34, 30], [-14, 30], [-8, 12], [-4, -6], [6, -16], [18, -20], [29, -20]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-36 + i * 8} ${-18 + i * 2} Q ${-40 + i * 8} 8 ${-34 + i * 7} 26`} stroke={raya} strokeWidth={1.4} fill="none" />)}
    {banda && <path d="M20 -32 C 4 -40, -22 -36, -40 -14" stroke={banda} strokeWidth={4.5} fill="none" strokeLinecap="round" />}
  </g>
);
/** Pañuelo de lino (khat) de campesinos y barqueros: cubre la cabeza y cae en bolsa por la nuca. */
const Panuelo: React.FC<{ c?: string; banda?: string }> = ({ c = LINO, banda = '#B9AE98' }) => (
  <g>
    <path d={suave([[24, -26], [8, -44], [-20, -44], [-40, -24], [-48, 6], [-42, 30], [-24, 32], [-16, 12], [-8, -8], [8, -18]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} />
    <path d="M22 -28 C 6 -34, -12 -30, -26 -14" stroke={banda} strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M-30 -6 C -38 6, -38 20, -32 28" stroke={banda} strokeWidth={1.6} fill="none" />
  </g>
);
/** Cabeza afeitada (sacerdotes, niños): solo la sombra del pelo rapado. Va con pelo = piel. */
const Rapada: React.FC<{ piel: string }> = ({ piel }) => <path d="M18 -32 C 0 -40, -20 -36, -28 -18" stroke={piel === PIEL_H ? '#8E5232' : '#5A3420'} strokeWidth={2} fill="none" opacity={0.5} />;
/** Mechón de la infancia (niños, príncipes y sacerdotes sem): trenza gruesa que cae junto a la oreja. */
const Mechon: React.FC<{ c?: string }> = ({ c = NEGRO }) => (
  <g>
    <path d={suave([[-14, -20], [-24, 0], [-22, 26], [-14, 46]])} stroke={N} strokeWidth={12} fill="none" strokeLinecap="round" />
    <path d={suave([[-14, -20], [-24, 0], [-22, 26], [-14, 46]])} stroke={c} strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d="M-20 4 l 6 4 M-21 18 l 6 4 M-19 32 l 6 4" stroke="#4A4440" strokeWidth={1.4} />
    <circle cx={-14} cy={48} r={4} fill={ORO} stroke={N} strokeWidth={1.2} />
  </g>
);
/** Nemes: el pañuelo real a rayas (oro y azul), con faldones delante del hombro y ureo en la frente. */
const Nemes: React.FC<{ c1?: string; c2?: string; ureo?: boolean }> = ({ c1 = ORO, c2 = AZUL, ureo = true }) => {
  const tela = suave([[24, -26], [10, -46], [-18, -48], [-40, -28], [-46, 0], [-40, 24], [-16, 22], [-8, 4], [0, -12], [12, -22]], true, 0.85);
  return (
    <g>
      <path d="M-30 14 C -38 32, -36 50, -30 62 L -18 60 C -22 46, -22 30, -16 16 Z" fill={c1} stroke={N} strokeWidth={1.8} />
      <path d={tela} fill={c1} stroke={N} strokeWidth={2} />
      {[-34, -24, -14, -4, 6].map((x, i) => <path key={i} d={`M${x + 4} ${-44 + Math.abs(x + 14) * 0.12} C ${x - 4} -20, ${x - 6} 0, ${x - 8} 20`} stroke={c2} strokeWidth={4} fill="none" opacity={x > 0 ? 0 : 1} />)}
      <path d={suave([[-12, 4], [2, 2], [10, 58], [-6, 60]], true, 0.4)} fill={c1} stroke={N} strokeWidth={2} />
      {[14, 26, 38, 50].map((y) => <path key={y} d={`M${-10 + (y - 4) * 0.08} ${y} L ${3 + (y - 4) * 0.13} ${y - 1}`} stroke={c2} strokeWidth={4} />)}
      <path d="M22 -28 C 6 -36, -14 -34, -32 -18" stroke={c1} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M22 -28 C 6 -36, -14 -34, -32 -18" stroke={N} strokeWidth={1} fill="none" strokeDasharray="4 4" />
      {ureo && <Ureo x={24} y={-42} />}
    </g>
  );
};
/** Corona blanca del Alto Egipto (hedjet). */
const CoronaBlanca: React.FC<{ ureo?: boolean }> = ({ ureo = true }) => (
  <g>
    <path d="M-30 18 C -36 -24, -20 -70, -6 -98 C 0 -108, 10 -106, 12 -98 C 24 -72, 30 -44, 26 -18 C 10 -22, -10 -16, -22 18 Z" fill={BLANCO} stroke={N} strokeWidth={2.2} />
    <circle cx={4} cy={-106} r={7} fill={BLANCO} stroke={N} strokeWidth={1.8} />
    <path d="M-16 -40 C -10 -60, -4 -76, 2 -88" stroke="#D9D2C2" strokeWidth={3} fill="none" />
    {ureo && <Ureo x={26} y={-30} />}
  </g>
);
/** Corona roja del Bajo Egipto (deshret), la de Neit. */
const CoronaRoja: React.FC<{ ureo?: boolean }> = ({ ureo = false }) => (
  <g>
    <path d="M-36 20 L -36 -88 L -22 -88 L -20 -50 L 28 -50 L 28 -20 C 10 -20, -12 -12, -24 20 Z" fill={ROJO} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-20 -52 C -10 -70, 4 -72, 8 -60 C 10 -52, 2 -50, 2 -56" stroke={ORO} strokeWidth={3.2} fill="none" strokeLinecap="round" />
    <path d="M-34 -22 L 28 -24" stroke="#8E2A1C" strokeWidth={2} />
    {ureo && <Ureo x={28} y={-30} />}
  </g>
);
/** Corona azul de guerra (khepresh), la de Ramsés: casco con discos de oro. */
const Khepresh: React.FC = () => (
  <g>
    <path d="M28 -16 C 34 -40, 28 -72, 4 -84 C -20 -94, -42 -72, -44 -40 C -46 -14, -38 8, -26 16 C -18 0, -6 -12, 10 -16 Z" fill="#2B5DA8" stroke={N} strokeWidth={2.2} />
    {[[-30, -50], [-16, -62], [-2, -70], [12, -64], [-30, -30], [-16, -42], [-2, -50], [14, -44], [-20, -22], [-4, -30], [14, -26]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} fill={ORO_CLARO} stroke={N} strokeWidth={0.8} />)}
    <path d="M28 -16 C 14 -18, -2 -14, -14 -4" stroke={ORO} strokeWidth={4} fill="none" strokeLinecap="round" />
    <Ureo x={28} y={-30} />
  </g>
);
/** Pluma de avestruz (Shu la lleva en la cabeza, Maat en la vincha). Origen = base de la pluma. */
const Pluma: React.FC<{ alto?: number; c?: string }> = ({ alto = 80, c = BLANCO }) => (
  <g>
    <path d={`M-6 0 C -11 ${-alto * 0.4}, -9 ${-alto * 0.75}, 2 ${-alto} C 12 ${-alto - 6}, 18 ${-alto + 2}, 13 ${-alto + 8} C 9 ${-alto * 0.72}, 9 ${-alto * 0.4}, 6 0 Z`} fill={c} stroke={N} strokeWidth={1.8} />
    <path d={`M0 0 C -1 ${-alto * 0.4}, 0 ${-alto * 0.75}, 4 ${-alto + 4}`} stroke="#B9AE98" strokeWidth={1.4} fill="none" />
    {[0.3, 0.5, 0.7].map((t) => <path key={t} d={`M-6 ${-alto * t} l 5 -4 M6 ${-alto * t} l -5 -4`} stroke="#D9D2C2" strokeWidth={1.2} />)}
  </g>
);
/** Signo de Neftis sobre la cabeza: la casa con la cesta encima (su nombre, "señora de la casa"). */
const CasaNeftis: React.FC = () => (
  <g>
    <path d="M-20 -36 L 20 -38 L 18 -46 L -18 -44 Z" fill={ORO} stroke={N} strokeWidth={1.6} />
    <path d="M-14 -46 L -14 -86 L 16 -86 L 16 -46 L 8 -46 L 8 -78 L -6 -78 L -6 -46 Z" fill={AZUL} stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <path d="M-18 -88 C -18 -104, 20 -104, 20 -88 Z" fill={ORO} stroke={N} strokeWidth={2} />
    <path d="M-12 -94 L 14 -94" stroke="#B8862E" strokeWidth={1.4} />
  </g>
);
/** Escorpión echado sobre la cabeza (Serqet), con la cola alzada hacia adelante. */
const EscorpionCabeza: React.FC = () => (
  <g transform="translate(-4 -44)">
    <path d="M-30 -2 C -42 -18, -40 -40, -24 -48 C -12 -52, -2 -46, 0 -38" stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M-30 -2 C -42 -18, -40 -40, -24 -48 C -12 -52, -2 -46, 0 -38" stroke="#9A5A2A" strokeWidth={5.5} fill="none" strokeLinecap="round" strokeDasharray="7 2" />
    <path d="M0 -38 L 6 -30 L -2 -32 Z" fill={NEGRO} />
    <path d={suave([[-30, 0], [-18, -10], [10, -10], [24, -4], [12, 4], [-18, 6]], true, 0.8)} fill="#9A5A2A" stroke={N} strokeWidth={1.8} />
    {[-14, -4, 6].map((x) => <path key={x} d={`M${x} -9 L ${x} 5`} stroke="#6E3A1A" strokeWidth={1.4} />)}
    <path d="M22 -4 C 32 -12, 40 -10, 42 -4 C 36 -4, 34 0, 38 4 C 30 4, 26 2, 22 0 Z" fill="#9A5A2A" stroke={N} strokeWidth={1.4} />
  </g>
);
/** Gorro ceñido (Imhotep, el de las estatuillas). */
const Casquete: React.FC<{ c?: string }> = ({ c = '#3A2E28' }) => (
  <path d={suave([[24, -24], [16, -38], [-4, -44], [-24, -38], [-35, -18], [-34, 8], [-24, 10], [-16, -10], [4, -20], [16, -24]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} />
);
/** Manto sobre la cabeza (ancianas, Isis disfrazada): cae por la espalda hasta la cintura. */
const MantoCabeza: React.FC<{ c?: string; borde?: string }> = ({ c = '#7A6A58', borde = '#5A4C3E' }) => (
  <g>
    <path d={suave([[26, -22], [12, -44], [-18, -46], [-40, -26], [-50, 10], [-52, 70], [-46, 130], [-24, 128], [-20, 60], [-14, 14], [-4, -8], [10, -18]], true, 0.8)} fill={c} stroke={N} strokeWidth={2} />
    <path d="M24 -24 C 8 -36, -16 -36, -32 -18" stroke={borde} strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M-36 0 C -44 40, -44 80, -40 120" stroke={borde} strokeWidth={1.6} fill="none" />
  </g>
);
/** Corona de buitre de las reinas: el ave sobre la peluca, con el modio y dos plumas altas. */
const CoronaBuitre: React.FC = () => (
  <g>
    <path d={suave([[22, -28], [6, -44], [-20, -42], [-38, -22], [-44, 18], [-42, 60], [-18, 62], [-14, 30], [-10, 6], [-4, -12], [10, -24]], true, 0.85)} fill={NEGRO} stroke={N} strokeWidth={2} />
    <path d="M-12 4 L 0 4 L 4 60 L -10 62 Z" fill={NEGRO} stroke={N} strokeWidth={2} />
    <path d="M24 -28 C 10 -46, -22 -46, -36 -26 C -42 -10, -42 8, -40 22 C -30 4, -20 -10, -4 -16 C 6 -20, 16 -24, 24 -28 Z" fill={ORO} stroke={N} strokeWidth={1.8} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-32 + i * 4} ${-20 + i * 9} C ${-20 + i * 4} ${-30 + i * 6}, ${-4 + i * 2} ${-32 + i * 4}, ${10} ${-30 + i * 2}`} stroke={i % 2 ? AZUL : ROJO} strokeWidth={2.4} fill="none" />)}
    <path d="M24 -30 C 30 -36, 34 -32, 32 -26 L 26 -24 Z" fill={ORO} stroke={N} strokeWidth={1.4} />
    <rect x={-20} y={-58} width={30} height={14} fill={ORO} stroke={N} strokeWidth={1.6} />
    <path d="M-20 -52 L 10 -52" stroke={AZUL} strokeWidth={3} />
    <g transform="translate(-10 -58)"><Pluma alto={78} /></g>
    <g transform="translate(2 -58)"><Pluma alto={78} /></g>
  </g>
);
/** Corona azul de copa plana (la de Nefertiti). */
const CoronaPlana: React.FC = () => (
  <g>
    <path d="M24 -24 C 28 -40, 20 -56, 8 -62 L -40 -84 C -46 -70, -44 -40, -36 -14 C -28 2, -18 -6, -8 -14 C 4 -20, 14 -22, 24 -24 Z" fill="#2B5DA8" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M24 -24 C 8 -26, -10 -18, -22 -6" stroke={ORO} strokeWidth={4.5} fill="none" strokeLinecap="round" />
    <path d="M10 -60 L -40 -82" stroke={ORO} strokeWidth={3} />
    <path d="M-30 -16 C -26 -6, -22 0, -20 6" stroke={ROJO} strokeWidth={3} fill="none" />
    <Ureo x={24} y={-34} />
  </g>
);
/** Casquete de las reinas de Kush (Aso) con dos ureos y dos plumas altas. */
const CasqueteKush: React.FC = () => (
  <g>
    <path d={suave([[24, -24], [14, -40], [-8, -46], [-28, -38], [-36, -16], [-34, 8], [-22, 10], [-14, -10], [6, -20]], true, 0.85)} fill={ORO} stroke={N} strokeWidth={2} />
    {[[-26, -20], [-14, -30], [0, -36], [-24, -4], [-10, -16], [6, -24]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} fill={AZUL} />)}
    <Ureo x={20} y={-40} /><Ureo x={28} y={-34} />
    <g transform="translate(-14 -44)"><Pluma alto={70} /></g>
    <g transform="translate(-2 -44)"><Pluma alto={70} /></g>
  </g>
);
/** Pelo y vincha de los asiáticos (Retenu, Naharin, Bakhtan): melena tupida hasta la nuca y banda de color. */
const PeloRetenu: React.FC<{ banda?: string; c?: string }> = ({ banda = ROJO, c = '#1C1814' }) => (
  <g>
    <path d={suave([[22, -28], [4, -46], [-24, -44], [-44, -22], [-46, 10], [-38, 30], [-20, 28], [-14, 10], [-6, -8], [8, -20]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} />
    <path d="M22 -30 C 6 -38, -20 -36, -42 -18" stroke={banda} strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M-40 -16 C -50 -6, -54 6, -50 16" stroke={banda} strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);
/** Gorro alto de los reyes de Biblos y Hatti. alto/forma cambia: cónico (Biblos) o cilindro con velo (hitita). */
const GorroAlto: React.FC<{ c?: string; banda?: string; velo?: string }> = ({ c = '#E9DFC6', banda = ORO, velo }) => (
  <g>
    {velo && <path d={suave([[-18, -50], [-40, -30], [-50, 20], [-52, 90], [-30, 92], [-24, 30], [-14, -20]], true, 0.8)} fill={velo} stroke={N} strokeWidth={2} />}
    {velo
      ? <path d="M-28 -18 L -26 -78 C -10 -84, 10 -84, 22 -78 L 24 -22 C 8 -26, -12 -24, -28 -18 Z" fill={c} stroke={N} strokeWidth={2} />
      : <path d="M-30 -14 C -30 -50, -16 -86, 0 -100 C 12 -88, 24 -52, 24 -22 C 8 -26, -14 -22, -30 -14 Z" fill={c} stroke={N} strokeWidth={2} />}
    <path d="M24 -24 C 8 -30, -14 -26, -30 -16" stroke={banda} strokeWidth={5} fill="none" strokeLinecap="round" />
    {velo && <path d="M-24 -66 C -8 -72, 8 -72, 22 -66" stroke={banda} strokeWidth={3} fill="none" />}
  </g>
);
/** Cabeza de carnero de cuernos horizontales y ondulados (Khnum), con peluca tripartita. */
const CabezaCarnero: React.FC<{ piel: string }> = ({ piel }) => (
  <g>
    <Cuello piel={piel} />
    <Tripartita />
    {['M-64 -26 C -54 -40, -44 -22, -32 -34 C -20 -46, -10 -28, 0 -36', 'M4 -36 C 16 -46, 26 -28, 38 -40 C 50 -52, 60 -34, 72 -46'].map((d) => <g key={d}><path d={d} stroke={N} strokeWidth={16} fill="none" strokeLinecap="round" /><path d={d} stroke="#E6DCC4" strokeWidth={11} fill="none" strokeLinecap="round" /><path d={d} stroke="#B9A882" strokeWidth={11} fill="none" strokeDasharray="2 7" /></g>)}
    <path d={suave([[-20, -16], [-8, -32], [12, -36], [30, -28], [44, -14], [53, 2], [52, 14], [40, 20], [22, 22], [4, 24], [-12, 20]], true, 0.85)} fill="#D8CBA8" stroke={N} strokeWidth={2} />
    <path d="M30 -26 C 42 -16, 50 -4, 52 8" stroke="#B9A882" strokeWidth={2} fill="none" />
    <ellipse cx={48} cy={5} rx={2.6} ry={1.8} fill={N} />
    <path d="M51 14 Q 44 17 37 14" stroke={N} strokeWidth={1.6} fill="none" />
    <path d="M-2 -20 C -16 -14, -22 -2, -18 6 C -10 2, -4 -8, 2 -16 Z" fill="#C4B48E" stroke={N} strokeWidth={1.6} />
    <OjoAnimal x={16} y={-14} iris={ORO} r={4.5} />
  </g>
);
/** Escarabajo en lugar de cabeza (Khepri, el sol que nace). */
const CabezaEscarabajo: React.FC<{ piel: string }> = ({ piel }) => (
  <g>
    <Cuello piel={piel} />
    <Tripartita />
    {[[-18, -20, -34, -30], [-20, 0, -38, 4], [-16, 18, -30, 32], [14, -22, 30, -34], [16, -2, 34, 2], [12, 16, 26, 30]].map(([a, b, c2, d], i) => <path key={i} d={`M${a} ${b} L ${c2} ${d}`} stroke={N} strokeWidth={3.4} strokeLinecap="round" />)}
    <ellipse cx={-2} cy={2} rx={23} ry={29} fill="#2F6E6A" stroke={N} strokeWidth={2.2} />
    <path d="M-2 -20 L -2 30" stroke="#1C3E3C" strokeWidth={2.4} />
    <path d="M-16 -2 C -14 -12, -10 -16, -6 -16" stroke="#7FD0C0" strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M-22 -22 C -16 -34, 12 -34, 18 -22 C 8 -18, -12 -18, -22 -22 Z" fill="#3E8A84" stroke={N} strokeWidth={1.8} />
    <path d="M-14 -32 L -10 -44 L -4 -36 L 2 -46 L 6 -36 L 12 -42 L 12 -30 Z" fill="#3E8A84" stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
  </g>
);
/** Máscara de oro de momia con nemes (momia): la cara la da la máscara, no hay ojos que se muevan. */
const CabezaMomia: React.FC = () => (
  <g>
    <Cuello piel={LINO} />
    <Nemes ureo={false} />
    <path d={suave([[-8, -30], [12, -30], [26, -18], [30, -4], [34, 6], [30, 14], [30, 22], [20, 30], [4, 32], [-6, 20], [-10, -6]], true, 0.85)} fill={ORO} stroke={N} strokeWidth={2} />
    <path d="M10 -6 Q 18 -12 26 -6 Q 18 -2 10 -6 Z" fill={BLANCO} stroke={N} strokeWidth={1.5} />
    <circle cx={19} cy={-6} r={2.4} fill={NEGRO} />
    <path d="M8 -7 L 31 -3 M9 -14 Q 18 -18 28 -13" stroke={NEGRO} strokeWidth={2.2} strokeLinecap="round" fill="none" />
    <path d="M14 30 L 24 30 L 25 50 L 15 50 Z" fill={AZUL} stroke={N} strokeWidth={1.4} />
  </g>
);

// ---------- cuerpo ----------
/** Piel de leopardo de los sacerdotes sem (Setne, sumo sacerdote): cae del hombro sobre el pecho. */
const PielLeopardo: React.FC = () => (
  <g>
    <path d={suave([[-28, -304], [10, -306], [34, -290], [36, -250], [30, -196], [12, -170], [-16, -172], [-30, -200], [-32, -250]], true, 0.8)} fill="#D9A84E" stroke={N} strokeWidth={2} />
    {[[-18, -286], [0, -280], [18, -284], [-22, -258], [-4, -250], [16, -256], [28, -238], [-20, -226], [0, -222], [20, -214], [-10, -196], [10, -190]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={4.2} fill="none" stroke="#4A2E14" strokeWidth={2} /><circle cx={x} cy={y} r={1.4} fill="#4A2E14" /></g>)}
    <path d="M24 -200 C 32 -186, 34 -170, 28 -156 L 20 -158 C 22 -170, 20 -184, 16 -194 Z" fill="#D9A84E" stroke={N} strokeWidth={1.6} />
    <path d="M22 -300 L 30 -292" stroke={ORO} strokeWidth={6} strokeLinecap="round" />
  </g>
);
/** Banda cruzada de lino (sacerdote lector) o de color (oficiales, soldados). */
const Banda: React.FC<{ c?: string }> = ({ c = BLANCO }) => (
  <g>
    <path d="M-22 -300 L 30 -214" stroke={N} strokeWidth={12} strokeLinecap="round" />
    <path d="M-22 -300 L 30 -214" stroke={c} strokeWidth={8.5} strokeLinecap="round" />
  </g>
);
/** Faja anudada a la cintura con las puntas colgando (color). */
const Faja: React.FC<{ c?: string }> = ({ c = ROJO }) => (
  <g>
    <path d="M-28 -218 L 26 -220" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M-28 -218 L 26 -220" stroke={c} strokeWidth={7} strokeLinecap="round" />
    <path d="M14 -218 L 18 -180 L 24 -182 L 20 -218 Z" fill={c} stroke={N} strokeWidth={1.4} />
  </g>
);
/** Corselete de cuero de soldado y general: tiras cruzadas sobre el pecho. */
const Corselete: React.FC<{ c?: string }> = ({ c = '#A0703A' }) => (
  <g>
    <path d={suave([[-26, -296], [18, -300], [32, -282], [30, -240], [24, -214], [-26, -210], [-30, -250], [-30, -282]], true)} fill={c} stroke={N} strokeWidth={2} />
    {[-276, -258, -240, -224].map((y) => <path key={y} d={`M-28 ${y} L 30 ${y - 2}`} stroke="#6E4A22" strokeWidth={2} />)}
    <path d="M-20 -298 L 6 -214 M20 -300 L -6 -214" stroke="#6E4A22" strokeWidth={3} />
  </g>
);
/** Túnica de lana de colores de Retenu (como en Beni Hasan): franjas en zigzag y flecos. */
const TunicaRetenu: React.FC<{ c1?: string; c2?: string; c3?: string; corta?: boolean }> = ({ c1 = '#E9DFC6', c2 = ROJO, c3 = AZUL, corta }) => {
  const abajo = corta ? -206 : -12;
  return (
    <g>
      <path d={suave([[-24, -304], [18, -306], [34, -284], [32, -240], [32, corta ? -230 : abajo - 80], [corta ? 30 : 38, abajo], [corta ? -32 : -42, abajo + 2], [-38, corta ? -230 : abajo - 80], [-30, -250], [-32, -286]], true, 0.9)} fill={c1} stroke={N} strokeWidth={2} />
      {Array.from({ length: Math.round((abajo + 290) / 26) }, (_, i) => -282 + i * 26).map((y, i) => <path key={y} d={`M-30 ${y} l 10 8 l 10 -8 l 10 8 l 10 -8 l 10 8 l 10 -8`} stroke={i % 2 ? c3 : c2} strokeWidth={4} fill="none" strokeLinejoin="round" />)}
      {!corta && Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${-38 + i * 6} ${abajo + 1} l 0 8`} stroke={c2} strokeWidth={2.2} strokeLinecap="round" />)}
    </g>
  );
};
/** Vestido de mujer extranjera (Bakhtan, Hatti): manga, borde de color y flecos. */
const VestidoExtranjero: React.FC<{ c?: string; borde?: string }> = ({ c = '#2E5FA8', borde = ORO }) => (
  <g>
    <path d={suave([[-22, -304], [18, -306], [34, -284], [32, -240], [28, -150], [36, -14], [-40, -12], [-34, -150], [-30, -250], [-32, -286]], true, 0.9)} fill={c} stroke={N} strokeWidth={2} />
    {[-210, -120, -30].map((y) => <path key={y} d={`M${-36 + (y + 300) * 0.02} ${y} L ${33 + (y + 300) * 0.01} ${y - 2}`} stroke={borde} strokeWidth={5} />)}
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-38 + i * 6.4} -13 l 0 8`} stroke={borde} strokeWidth={2.2} strokeLinecap="round" />)}
  </g>
);
/** Red de cuentas sobre el vestido blanco (damas: Tabubu). */
const RedCuentas: React.FC = () => (
  <g>
    {Array.from({ length: 6 }, (_, i) => -196 + i * 32).flatMap((y, i) => Array.from({ length: 4 }, (_, k) => { const x = -26 + k * 16 + (i % 2) * 8; return <path key={`${i}${k}`} d={`M${x} ${y} l 8 -14 l 8 14 l -8 14 Z`} fill="none" stroke={TURQ} strokeWidth={2} />; }))}
    {Array.from({ length: 6 }, (_, i) => -196 + i * 32).flatMap((y, i) => Array.from({ length: 5 }, (_, k) => <circle key={`c${i}${k}`} cx={-26 + k * 16 + (i % 2) * 8} cy={y} r={2.4} fill={ORO} stroke={N} strokeWidth={0.6} />))}
  </g>
);
/** Manto blanco del jubileo (Djoser, de su estatua): envuelve el cuerpo hasta los tobillos. */
const MantoJubileo: React.FC = () => (
  <g>
    <path d={suave([[-30, -306], [20, -308], [38, -286], [38, -200], [42, -100], [46, -18], [-42, -16], [-40, -110], [-36, -220], [-34, -284]], true, 0.9)} fill={BLANCO} stroke={N} strokeWidth={2} />
    <path d="M-36 -220 C -10 -230, 20 -232, 38 -226" stroke="#D9D2C2" strokeWidth={2} fill="none" />
    <path d="M30 -290 C 34 -240, 38 -160, 40 -60" stroke="#D9D2C2" strokeWidth={2} fill="none" />
  </g>
);
/** Ondas de agua sobre el cuerpo (Nun, las aguas del principio). */
const Ondas: React.FC = () => (
  <g>{Array.from({ length: 3 }, (_, i) => -282 + i * 24).map((y) => <path key={y} d={`M-26 ${y} q 7 -6 14 0 t 14 0 t 14 0 t 14 0`} stroke="#BFE3EE" strokeWidth={2.4} fill="none" opacity={0.8} />)}</g>
);

// ---------- objetos en la mano (origen = mano) ----------
/** Bastón largo de caminar o de mando (madera). */
const Baston: React.FC<{ abajo?: number; c?: string; pomo?: string }> = ({ abajo = 200, c = MADERA, pomo }) => (
  <g>
    <path d={`M0 ${abajo} L 0 -110`} stroke={N} strokeWidth={8} strokeLinecap="round" />
    <path d={`M0 ${abajo} L 0 -110`} stroke={c} strokeWidth={4.5} strokeLinecap="round" />
    {pomo && <ellipse cx={0} cy={-112} rx={6} ry={8} fill={pomo} stroke={N} strokeWidth={1.6} />}
  </g>
);
/** Cayado de pastor (Bata): vara larga con la curva arriba. */
const CayadoPastor: React.FC<{ abajo?: number }> = ({ abajo = 200 }) => (
  <g>
    <path d={`M0 ${abajo} L 0 -120 C 0 -150, 30 -150, 30 -126`} stroke={N} strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d={`M0 ${abajo} L 0 -120 C 0 -150, 30 -150, 30 -126`} stroke={MADERA} strokeWidth={4.5} fill="none" strokeLinecap="round" />
  </g>
);
/** Azada egipcia de madera (Anubis el granjero): mango largo y pala atada en ángulo. */
const Azada: React.FC = () => (
  <g>
    <path d="M0 60 L 0 -96" stroke={N} strokeWidth={9} strokeLinecap="round" />
    <path d="M0 60 L 0 -96" stroke={MADERA} strokeWidth={5} strokeLinecap="round" />
    <path d="M-4 -98 L 4 -104 L 52 -30 L 40 -24 Z" fill="#B07A44" stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <path d="M40 -26 L 56 -10 L 46 -6 Z" fill="#8A5A30" stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M0 -40 L 30 -60" stroke="#D9C9A6" strokeWidth={3} />
    <path d="M0 -40 L 30 -60" stroke={N} strokeWidth={0.8} strokeDasharray="3 3" />
  </g>
);
/** Rollo de papiro cerrado. */
const Rollo: React.FC = () => (
  <g transform="rotate(-10)">
    <rect x={-6} y={-28} width={12} height={40} rx={5} fill="#EADBB0" stroke={N} strokeWidth={1.8} />
    <path d="M-6 -20 L 6 -20 M-6 4 L 6 4" stroke={ROJO} strokeWidth={2} />
  </g>
);
/** Papiro abierto (Imhotep, escribas): hoja clara con renglones. */
const PapiroAbierto: React.FC = () => (
  <g transform="rotate(-8)">
    <path d="M-4 -40 L 40 -40 L 40 6 L -4 6 Z" fill="#F1E3BC" stroke={N} strokeWidth={1.8} />
    <rect x={-10} y={-44} width={10} height={54} rx={4} fill="#E2CF9C" stroke={N} strokeWidth={1.6} />
    <rect x={38} y={-44} width={10} height={54} rx={4} fill="#E2CF9C" stroke={N} strokeWidth={1.6} />
    {[-30, -20, -10, 0].map((y) => <path key={y} d={`M4 ${y} L 32 ${y}`} stroke="#6E5A3A" strokeWidth={1.6} strokeDasharray="5 3" />)}
  </g>
);
/** El Libro de Thoth: una caja de oro que brilla (Naneferkaptah). */
const LibroThoth: React.FC = () => {
  const f = useCurrentFrame(), b = 0.5 + Math.sin(f / 7) * 0.15;
  return (
    <g transform="rotate(-6)">
      <circle cx={12} cy={-16} r={36} fill="#FFE7A0" opacity={b * 0.6} />
      <rect x={-6} y={-36} width={36} height={30} rx={3} fill={ORO} stroke={N} strokeWidth={2} />
      <path d="M-6 -26 L 30 -26" stroke={ORO_CLARO} strokeWidth={3} />
      <path d="M8 -20 C 4 -12, 16 -12, 12 -20 M12 -20 L 12 -32" stroke={AZUL} strokeWidth={2} fill="none" />
    </g>
  );
};
/** Flor de loto. */
const Loto: React.FC = () => (
  <g transform="rotate(-10)">
    <path d="M0 10 C 2 -10, 4 -24, 6 -36" stroke={VERDE} strokeWidth={3.4} fill="none" strokeLinecap="round" />
    <path d="M6 -36 L -6 -58 L 2 -50 L 6 -64 L 10 -50 L 18 -58 Z" fill="#7FA8D8" stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M6 -36 L 0 -44 L 6 -42 L 12 -44 Z" fill={VERDE} stroke={N} strokeWidth={1.2} />
  </g>
);
/** Pértiga de barquero (Nemty). */
const Pertiga: React.FC = () => (
  <g transform="rotate(8)">
    <path d="M0 220 L 0 -170" stroke={N} strokeWidth={8} strokeLinecap="round" />
    <path d="M0 220 L 0 -170" stroke={MADERA} strokeWidth={4.5} strokeLinecap="round" />
    <path d="M-6 200 L 6 200 L 4 226 L -4 226 Z" fill="#6E4A22" stroke={N} strokeWidth={1.4} />
  </g>
);
/** Nervadura de palma con muescas: el signo de los años (Heh). Origen = mano; curva hacia arriba. */
const Palma: React.FC<{ alto?: number }> = ({ alto = 120 }) => (
  <g>
    <path d={`M0 20 C 2 ${-alto * 0.4}, 2 ${-alto * 0.8}, 14 ${-alto}`} stroke={N} strokeWidth={13} fill="none" strokeLinecap="round" />
    <path d={`M0 20 C 2 ${-alto * 0.4}, 2 ${-alto * 0.8}, 14 ${-alto}`} stroke="#5E9A44" strokeWidth={8.5} fill="none" strokeLinecap="round" />
    {Array.from({ length: 6 }, (_, i) => { const y = 4 - i * (alto / 7); return <path key={i} d={`M${-5 + i * 0.6} ${y} l 10 0`} stroke={N} strokeWidth={2} />; })}
  </g>
);
/** Tablero de senet (la Luna lo pierde contra Thoth). */
const Senet: React.FC = () => (
  <g transform="rotate(-4)">
    <rect x={-8} y={-24} width={54} height={20} rx={2} fill="#C9A06A" stroke={N} strokeWidth={1.8} />
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-6 + (i % 5) * 10} y={-22 + Math.floor(i / 5) * 9} width={9} height={8} fill={i % 2 ? '#E9D9A6' : '#B88A4E'} />)}
    <circle cx={6} cy={-18} r={3} fill={AZUL} stroke={N} strokeWidth={0.8} /><circle cx={30} cy={-9} r={3} fill={BLANCO} stroke={N} strokeWidth={0.8} />
  </g>
);
/** Vara de Asclepio: bastón con una serpiente enroscada. */
const VaraAsclepio: React.FC = () => (
  <g>
    <Baston abajo={200} />
    <path d="M0 40 C 14 30, 14 14, 0 6 C -14 -2, -14 -18, 0 -26 C 14 -34, 14 -50, 0 -58 C -10 -64, -6 -78, 6 -82" stroke={N} strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M0 40 C 14 30, 14 14, 0 6 C -14 -2, -14 -18, 0 -26 C 14 -34, 14 -50, 0 -58 C -10 -64, -6 -78, 6 -82" stroke="#5E8A4A" strokeWidth={4} fill="none" strokeLinecap="round" />
    <circle cx={8} cy={-84} r={4.4} fill="#5E8A4A" stroke={N} strokeWidth={1.4} />
  </g>
);
/** Vasija de barro en la palma (Khnum, el alfarero que modela a la gente). */
const Vasija: React.FC<{ c?: string }> = ({ c = '#B5653A' }) => (
  <g>
    <path d={suave([[-12, -6], [-16, -24], [-8, -40], [-8, -48], [8, -48], [8, -40], [16, -24], [12, -6]], true, 0.7)} fill={c} stroke={N} strokeWidth={1.8} />
    <path d="M-14 -26 L 14 -26" stroke="#7A3E1E" strokeWidth={2} />
    <path d="M-11 -50 L 11 -50" stroke={N} strokeWidth={3} strokeLinecap="round" />
  </g>
);
/** Cayado real corto (heqa) azul y oro. */
const Heqa: React.FC = () => (
  <g transform="rotate(-14)">
    <path d="M0 20 L 0 -64 C 0 -84, 24 -84, 24 -66" stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M0 20 L 0 -64 C 0 -84, 24 -84, 24 -66" stroke={ORO} strokeWidth={5.5} fill="none" strokeLinecap="round" />
    <path d="M0 18 L 0 -60" stroke={AZUL} strokeWidth={5.5} strokeDasharray="6 6" />
  </g>
);
/** Mayal real (látigo de tres tiras de cuentas). */
const Mayal: React.FC = () => (
  <g transform="rotate(10)">
    <path d="M0 20 L 0 -54" stroke={N} strokeWidth={8} strokeLinecap="round" />
    <path d="M0 20 L 0 -54" stroke={ORO} strokeWidth={4.5} strokeLinecap="round" />
    {[0, 1, 2].map((i) => <g key={i}>{[0, 1, 2, 3].map((k) => <circle key={k} cx={-4 - i * 5 - k * 3} cy={-52 + k * 9} r={3} fill={k % 2 ? AZUL : ROJO} stroke={N} strokeWidth={0.8} />)}</g>)}
  </g>
);
/** Maza de mando (general Djehuty): cabeza de piedra en forma de pera. */
const Maza: React.FC = () => (
  <g transform="rotate(-24)">
    <path d="M0 20 L 0 -56" stroke={N} strokeWidth={8} strokeLinecap="round" />
    <path d="M0 20 L 0 -56" stroke={MADERA} strokeWidth={4.5} strokeLinecap="round" />
    <path d="M0 -48 C -20 -54, -20 -84, 0 -88 C 20 -84, 20 -54, 0 -48 Z" fill="#8E8A80" stroke={N} strokeWidth={2} /><path d="M-15 -60 L 15 -60" stroke={ORO} strokeWidth={4} />
  </g>
);
/** Hacha de Retenu (el campeón): mango y hoja de bronce en media luna. */
const HachaRetenu: React.FC = () => (
  <g transform="rotate(-20)">
    <path d="M0 24 L 0 -84" stroke={N} strokeWidth={9} strokeLinecap="round" />
    <path d="M0 24 L 0 -84" stroke={MADERA} strokeWidth={5} strokeLinecap="round" />
    <path d="M0 -84 C 24 -112, 58 -100, 60 -70 C 58 -50, 44 -40, 30 -40 C 30 -54, 20 -62, 0 -60 Z" fill="#C07A3A" stroke={N} strokeWidth={2.2} /><path d="M10 -76 C 26 -86, 42 -82, 48 -70" stroke="#E0A060" strokeWidth={3} fill="none" />
  </g>
);
/** Lanza corta de soldado (bronce). */
const LanzaCorta: React.FC = () => (
  <g>
    <path d="M0 150 L 0 -150" stroke={N} strokeWidth={7} strokeLinecap="round" />
    <path d="M0 150 L 0 -150" stroke={MADERA} strokeWidth={4} strokeLinecap="round" />
    <path d="M0 -184 C 7 -170, 7 -158, 0 -148 C -7 -158, -7 -170, 0 -184 Z" fill="#C88A4A" stroke={N} strokeWidth={1.8} />
  </g>
);
/** Escudo de cuero de vaca (soldados egipcios): arriba redondeado, manchas. Va en la mano de atrás. */
const EscudoCuero: React.FC = () => (
  <g transform="translate(-18 -10)">
    <path d="M-28 50 L -28 -30 C -28 -64, 28 -64, 28 -30 L 28 50 Z" fill="#EFE6D2" stroke={N} strokeWidth={2.4} />
    <path d="M-14 -36 C -6 -44, 6 -40, 4 -28 C 0 -18, -16 -20, -14 -36 Z M6 10 C 16 4, 22 16, 14 26 C 6 30, -2 18, 6 10 Z M-20 14 C -14 10, -10 18, -16 24 Z" fill="#4A3020" />
    <path d="M-28 -30 C -28 -64, 28 -64, 28 -30" stroke={MADERA} strokeWidth={3} fill="none" />
  </g>
);
/** Arco (Neit, arquero nubio) con dos flechas cruzadas. */
const ArcoFlechas: React.FC<{ flechas?: boolean }> = ({ flechas = true }) => (
  <g>
    <path d="M6 -90 C 34 -50, 34 30, 6 70" stroke={N} strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M6 -90 C 34 -50, 34 30, 6 70" stroke={MADERA} strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M6 -90 L 6 70" stroke="#E9DFC6" strokeWidth={1.4} />
    {flechas && [[-30, 40, 40, -60], [-30, -60, 40, 40]].map(([a, b, c2, d], i) => <g key={i}><path d={`M${a} ${b} L ${c2} ${d}`} stroke={MADERA} strokeWidth={3} /><path d={`M${c2} ${d} l ${i ? -10 : -2} ${i ? -2 : 10}`} stroke={N} strokeWidth={4} /></g>)}
  </g>
);
/** Antorcha de mano (Inaros baja a la tumba). */
const Antorcha: React.FC = () => {
  const f = useCurrentFrame(), l = Math.sin(f / 3) * 3;
  return (
    <g>
      <path d="M0 24 L 2 -40" stroke={N} strokeWidth={8} strokeLinecap="round" />
      <path d="M0 24 L 2 -40" stroke={MADERA} strokeWidth={4.5} strokeLinecap="round" />
      <path d={`M2 -40 C -12 -52, -6 -70, ${2 + l} -86 C 12 -70, 16 -52, 2 -40 Z`} fill="#F2A23A" stroke="#B4412C" strokeWidth={2} />
      <path d={`M2 -44 C -4 -52, -2 -62, ${2 + l * 0.6} -70 C 8 -60, 8 -52, 2 -44 Z`} fill="#FFE38A" />
    </g>
  );
};
/** Cesta sobre la cabeza (campesinas, sirvientas). Coords de cabeza. */
const CestaCabeza: React.FC = () => (
  <g transform="translate(-4 -42)">
    <path d="M-28 0 L -22 -26 L 26 -26 L 32 0 Z" fill="#C9A06A" stroke={N} strokeWidth={2} />
    {[-14, -2, 10, 22].map((x) => <path key={x} d={`M${x} -24 L ${x + 2} -2`} stroke="#8A6236" strokeWidth={1.6} />)}
    <path d="M-24 -14 L 28 -14" stroke="#8A6236" strokeWidth={1.6} />
    {[[-12, -30], [2, -34], [16, -30]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={['#D9762A', '#8A3A5A', '#E9C46A'][i]} stroke={N} strokeWidth={1.4} />)}
  </g>
);
/** Pluma de un arquero nubio en la vincha. Coords de cabeza. */
const PlumaNubia: React.FC = () => (
  <g>
    <path d="M22 -30 C 6 -38, -18 -36, -36 -16" stroke={ROJO} strokeWidth={5} fill="none" strokeLinecap="round" />
    <g transform="translate(-20 -34) rotate(-18)"><Pluma alto={50} c="#F2E6C8" /></g>
  </g>
);

// ---------- animales y criaturas (dibujo propio; origen = pies, mirando a la derecha) ----------
type DP = DibujoProps;
const caminar = (f: number, moviendo?: boolean, corriendo?: boolean) => ({ fase: moviendo || corriendo ? f * (corriendo ? 0.36 : 0.2) : 0, amp: corriendo ? 30 : moviendo ? 18 : 0 });
/** Pata de cuadrúpedo: cadera en (cx, top), largo l, pezuña o pata. */
const pata = (cx: number, top: number, l: number, ph: number, g: { fase: number; amp: number }, c: string, ancho = 18, pezuna?: string) => {
  const a = Math.sin(g.fase + ph) * g.amp, rd = (a * Math.PI) / 180;
  const k: P = [cx + Math.sin(rd) * l * 0.5, top + l * 0.5], pie: P = [k[0] + Math.sin(rd + 0.2) * l * 0.48, -4];
  return (
    <g>
      <path d={miembro([[cx, top], k, pie], [ancho * 1.6, ancho, ancho * 0.75])} fill={c} stroke={N} strokeWidth={2} />
      {pezuna && <path d={`M${pie[0] - ancho * 0.45} -8 L ${pie[0] + ancho * 0.5} -8 L ${pie[0] + ancho * 0.55} 0 L ${pie[0] - ancho * 0.5} 0 Z`} fill={pezuna} stroke={N} strokeWidth={1.6} />}
    </g>
  );
};
const OjoBestia: React.FC<{ x: number; y: number; r?: number; iris?: string }> = ({ x, y, r = 5, iris = '#6A4A1E' }) => (
  <g><circle cx={x} cy={y} r={r} fill="#FFF8E8" stroke={N} strokeWidth={1.4} /><circle cx={x + r * 0.2} cy={y} r={r * 0.6} fill={iris} /><circle cx={x + r * 0.25} cy={y} r={r * 0.32} fill={NEGRO} /><circle cx={x + r * 0.5} cy={y - r * 0.35} r={r * 0.2} fill="#FFFFFF" /></g>
);
const Bestia: React.FC<{ p: DP; children: React.ReactNode }> = ({ p, children }) => <g transform={`translate(${p.x} ${p.y}) scale(${p.voltear ? -p.s : p.s} ${p.s})`} opacity={p.opacity ?? 1}>{children}</g>;

/** Ave de perfil: posada (en el suelo) o volando (cuando el motor la sube con "vuela"). */
const Pajaro: React.FC<DP> = (p) => {
  const { f, y } = p, especie = (p.especie as 'halcon' | 'milano' | 'golondrina' | undefined) ?? 'halcon';
  const vuela = y < SUELO - 40;
  const col = especie === 'halcon' ? { lomo: '#5E4630', pecho: '#EADBB8', ala: '#4A3624', cola: '#4A3624' } : especie === 'milano' ? { lomo: '#7A4A2A', pecho: '#A8683A', ala: '#4E2E1C', cola: '#8A5A34' } : { lomo: '#1E2A4E', pecho: '#F4EFE2', ala: '#18213E', cola: '#1E2A4E' };
  const k = especie === 'golondrina' ? 0.6 : 1;
  const cabeza = (
    <g>
      <circle cx={0} cy={0} r={18} fill={especie === 'milano' ? '#C9A27A' : col.lomo} stroke={N} strokeWidth={2} />
      {especie === 'halcon' && <path d="M2 2 C -2 10, -2 18, 2 22 C 8 16, 10 8, 9 2 Z" fill="#2A1E14" />}
      {especie === 'golondrina' && <path d="M8 6 C 14 10, 16 14, 12 18 C 6 16, 4 10, 8 6 Z" fill="#B4412C" />}
      <path d="M14 -6 C 22 -8, 30 -2, 28 8 C 26 12, 22 10, 22 6 L 14 4 Z" fill={especie === 'golondrina' ? '#18181A' : '#3A3F48'} stroke={N} strokeWidth={1.4} />
      <path d="M12 -8 L 16 -4 L 12 0 Z" fill={ORO} />
      <OjoBestia x={6} y={-4} r={5} iris={ORO} />
    </g>
  );
  if (vuela) {
    const a = Math.sin(f / 2.6) * 26;
    return (
      <Bestia p={p}><g transform={`scale(${k})`}>
        <path d={especie === 'halcon' ? 'M-50 -4 L -86 -10 L -88 6 Z' : 'M-50 -4 L -94 -22 L -76 -2 L -96 12 Z'} fill={col.cola} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <path d={`M-10 -10 C -12 ${-40 - a * 0.6}, -24 ${-70 - a * 1.4}, -50 ${-96 - a * 2} L -58 ${-88 - a * 1.9} L -66 ${-94 - a * 1.9} L -70 ${-82 - a * 1.7} L -80 ${-84 - a * 1.7} L -78 ${-70 - a * 1.4} C -70 ${-48 - a}, -56 -20, -44 -6 Z`} fill={col.ala} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <path d={suave([[-56, -2], [-30, -18], [10, -20], [36, -8], [30, 8], [-10, 12], [-44, 8]], true, 0.85)} fill={col.lomo} stroke={N} strokeWidth={2} />
        <path d="M-20 4 C 0 10, 18 8, 30 0" stroke={col.pecho} strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d={`M4 -12 C 4 ${-44 + a * 0.6}, -8 ${-76 + a * 1.4}, -34 ${-104 + a * 2} L -40 ${-94 + a * 1.9} L -50 ${-100 + a * 1.9} L -54 ${-88 + a * 1.7} L -64 ${-90 + a * 1.7} L -62 ${-74 + a * 1.4} C -52 ${-50 + a}, -40 -24, -30 -6 Z`} fill={col.ala} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <path d={`M-4 -16 C -8 ${-40 + a * 0.5}, -18 ${-60 + a}, -30 ${-74 + a * 1.4}`} stroke={col.lomo} strokeWidth={2} fill="none" />
        <g transform="translate(38 -14)">{cabeza}</g>
      </g></Bestia>
    );
  }
  return (
    <Bestia p={p}><g transform={`scale(${k})`}>
      <path d="M-4 -12 L -6 0 M8 -12 L 8 0" stroke="#D9A23A" strokeWidth={4} strokeLinecap="round" />
      <path d="M-14 0 L -2 0 M2 0 L 16 0" stroke="#D9A23A" strokeWidth={3} strokeLinecap="round" />
      <path d={especie === 'halcon' ? 'M-24 -44 L -40 -6 L -26 -4 L -14 -34 Z' : 'M-24 -44 L -46 -2 L -32 -14 L -30 2 L -14 -34 Z'} fill={col.cola} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={suave([[-28, -50], [-20, -88], [4, -104], [22, -96], [24, -66], [16, -32], [0, -12], [-18, -18]], true, 0.85)} fill={col.lomo} stroke={N} strokeWidth={2} />
      <path d={suave([[4, -92], [20, -88], [22, -60], [12, -30], [0, -16], [2, -50]], true, 0.8)} fill={col.pecho} />
      {especie === 'halcon' && [[8, -70], [14, -56], [8, -44], [12, -32]].map(([x, yy], i) => <path key={i} d={`M${x - 3} ${yy} l 6 0`} stroke="#8A6A44" strokeWidth={2} />)}
      <path d={suave([[-26, -84], [-6, -92], [6, -70], [0, -36], [-16, -24], [-30, -40]], true, 0.8)} fill={col.ala} stroke={N} strokeWidth={1.8} />
      <path d="M-20 -70 C -14 -60, -12 -48, -16 -36 M-12 -78 C -4 -66, -4 -50, -8 -38" stroke={col.lomo} strokeWidth={1.6} fill="none" />
      <g transform="translate(12 -108)">{cabeza}</g>
    </g></Bestia>
  );
};

/** Garza (Bennu, el alma del sol): patas largas, cuello en S y las dos plumas largas de la nuca. */
const Garza: React.FC<DP> = (p) => {
  const cab = Math.sin(p.f / 20) * 2;
  return (
    <Bestia p={p}>
      <path d="M-6 -90 L -10 0 M10 -90 L 12 0" stroke={N} strokeWidth={6} strokeLinecap="round" />
      <path d="M-6 -90 L -10 0 M10 -90 L 12 0" stroke="#C9A06A" strokeWidth={3.4} strokeLinecap="round" />
      <path d="M-20 0 L 0 0 M2 0 L 26 0" stroke="#C9A06A" strokeWidth={3} strokeLinecap="round" />
      <path d="M-40 -110 L -66 -84 L -48 -88 Z" fill="#7E93A6" stroke={N} strokeWidth={1.6} />
      <path d={suave([[-44, -110], [-20, -138], [14, -140], [30, -120], [20, -96], [-10, -86], [-36, -94]], true, 0.85)} fill="#8FA3B4" stroke={N} strokeWidth={2} />
      <path d="M-30 -118 C -10 -130, 10 -128, 22 -118" stroke="#6E8296" strokeWidth={2} fill="none" />
      <path d={`M20 -126 C 34 -150, 6 -170, 18 -196 C 22 -206, 30 -${210 - cab}, 36 -${210 - cab}`} stroke={N} strokeWidth={15} fill="none" strokeLinecap="round" />
      <path d={`M20 -126 C 34 -150, 6 -170, 18 -196 C 22 -206, 30 -${210 - cab}, 36 -${210 - cab}`} stroke="#F2EEE6" strokeWidth={10} fill="none" strokeLinecap="round" />
      <g transform={`translate(36 ${-212 + cab})`}>
        <path d="M-6 -6 C -30 -16, -50 -10, -60 -4 C -46 -8, -30 -6, -8 2 Z" fill="#5E7286" stroke={N} strokeWidth={1.4} />
        <path d="M-4 -4 C -26 -22, -44 -22, -56 -18 C -40 -16, -26 -10, -6 2 Z" fill="#5E7286" stroke={N} strokeWidth={1.4} />
        <ellipse cx={0} cy={0} rx={12} ry={10} fill="#8FA3B4" stroke={N} strokeWidth={2} />
        <path d="M8 -4 L 52 2 L 8 6 Z" fill="#D9A23A" stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
        <OjoBestia x={2} y={-2} r={3.6} iris={ORO} />
      </g>
    </Bestia>
  );
};

/** Ganso del Nilo de pie (Geb, el gran graznador). */
const GansoNilo: React.FC<DP> = (p) => {
  const pico = Math.sin(p.f / 16) * 2;
  return (
    <Bestia p={p}>
      <path d="M-6 -30 L -8 0 M8 -30 L 10 0" stroke="#D9762A" strokeWidth={5} strokeLinecap="round" />
      <path d="M-18 0 L 0 0 M2 0 L 22 0" stroke="#D9762A" strokeWidth={4} strokeLinecap="round" />
      <path d={suave([[-56, -60], [-36, -84], [6, -88], [30, -74], [30, -48], [10, -30], [-30, -30], [-52, -42]], true, 0.85)} fill="#B49A7A" stroke={N} strokeWidth={2} />
      <path d="M-50 -60 C -30 -74, -4 -76, 14 -64 C 0 -54, -24 -50, -50 -56 Z" fill="#7A5E44" stroke={N} strokeWidth={1.6} />
      <path d="M-30 -60 L -6 -64" stroke={BLANCO} strokeWidth={4} strokeLinecap="round" />
      <path d="M22 -66 C 30 -84, 26 -96, 32 -108" stroke={N} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M22 -66 C 30 -84, 26 -96, 32 -108" stroke="#D9C9A6" strokeWidth={17} fill="none" strokeLinecap="round" />
      <g transform={`translate(36 ${-114 + pico}) scale(1.25)`}>
        <ellipse cx={0} cy={0} rx={13} ry={11} fill="#D9C9A6" stroke={N} strokeWidth={2} />
        <ellipse cx={2} cy={-1} rx={7} ry={6} fill="#8A4A2A" />
        <path d="M10 -4 L 28 2 L 10 6 Z" fill="#E59A6A" stroke={N} strokeWidth={1.4} />
        <OjoBestia x={3} y={-2} r={3.4} iris="#E9A23A" />
      </g>
      <circle cx={0} cy={-56} r={6} fill="#8A4A2A" opacity={0.7} />
    </Bestia>
  );
};

/** Escorpión del desierto (los siete de Isis, los de Serqet). color, banda (collar de oro si es de Isis). */
const EscorpionEg: React.FC<DP> = (p) => {
  const { f, moviendo } = p, banda = !!p.banda;
  const c = (p.color as string | undefined) ?? '#8A5A2A', osc = '#3A2414';
  const g = moviendo ? Math.sin(f / 2) * 4 : 0, cola = Math.sin(p.f / 10) * 3;
  return (
    <Bestia p={p}>
      {[-30, -14, 2, 18].map((x, i) => <path key={i} d={`M${x} -14 L ${x - 8 + (i % 2 ? g : -g)} -2 L ${x - 12 + (i % 2 ? g : -g)} 0`} stroke={osc} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      <path d={`M-40 -18 C -66 -24, -76 -54, -64 -78 C -54 -96, -30 -96, -22 ${-80 + cola}`} stroke={N} strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d={`M-40 -18 C -66 -24, -76 -54, -64 -78 C -54 -96, -30 -96, -22 ${-80 + cola}`} stroke={c} strokeWidth={9.5} fill="none" strokeLinecap="round" strokeDasharray="10 2.5" />
      <path d={`M-22 ${-82 + cola} C -12 ${-82 + cola}, -8 ${-74 + cola}, -12 ${-68 + cola} L -18 ${-74 + cola} Z`} fill={osc} stroke={N} strokeWidth={1.4} />
      <path d={suave([[-46, -20], [-30, -30], [10, -30], [30, -22], [24, -10], [-10, -8], [-40, -10]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} />
      {[-28, -14, 0].map((x) => <path key={x} d={`M${x} -29 L ${x + 2} -9`} stroke={osc} strokeWidth={1.6} />)}
      {banda && <path d="M12 -30 L 14 -10" stroke={ORO} strokeWidth={5} />}
      <path d={`M24 -20 C 36 -28, 44 -30, 50 ${-32 + g}`} stroke={c} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={`M48 ${-30 + g} C 62 ${-46 + g}, 76 ${-40 + g}, 78 ${-30 + g} C 70 ${-32 + g}, 66 ${-28 + g}, 72 ${-20 + g} C 60 ${-18 + g}, 52 ${-22 + g}, 48 ${-30 + g} Z`} fill={c} stroke={N} strokeWidth={1.8} />
      <OjoBestia x={22} y={-24} r={3} iris="#1A1A1A" />
    </Bestia>
  );
};

/** Serpiente egipcia: cuerpo en ondas por el suelo y la cabeza alzada. capucha = cobra; boca = abierta. */
const SerpienteEg: React.FC<DP> = (p) => {
  const { f, moviendo, boca } = p, o = p as { color?: string; largo?: number; grosor?: number; capucha?: boolean; vientre?: string; bandas?: string; alto?: number; anillos?: boolean };
  const color = o.color ?? '#7A6A3A', largo = o.largo ?? 260, grosor = o.grosor ?? 26, capucha = o.capucha, vientre = o.vientre ?? '#E9D9A6', bandas = o.bandas, alto = o.alto ?? 110, anillos = o.anillos;
  const ph = moviendo ? f / 4 : f / 30, n = 16;
  const cuerpo: P[] = anillos
    ? Array.from({ length: 40 }, (_, i) => { const t = i / 39, a = t * Math.PI * 3.4 + 0.6, r = largo * 0.36 * (1 - t * 0.55); return [-largo * 0.25 + Math.cos(a) * r * 1.2, -grosor / 2 - r * 0.42 - Math.sin(a) * r * 0.42] as P; })
    : Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return [-largo + t * largo, -grosor / 2 + Math.sin(t * 9 - ph) * grosor * 0.5 * (1 - t)] as P; });
  const fin = cuerpo[cuerpo.length - 1];
  const cuello: P[] = [fin, [fin[0] + 24, fin[1] - alto * 0.2], [fin[0] + 20 + Math.sin(f / 18) * 3, fin[1] - alto * 0.7], [fin[0] + 34, fin[1] - alto]];
  const todo = [...cuerpo, ...cuello.slice(1)], d = suave(todo), hx = cuello[3][0], hy = cuello[3][1];
  return (
    <Bestia p={p}>
      <path d={d} stroke={N} strokeWidth={grosor + 4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={color} strokeWidth={grosor} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {bandas && <path d={d} stroke={bandas} strokeWidth={grosor} fill="none" strokeDasharray={`${grosor * 0.5} ${grosor * 1.4}`} />}
      <path d={suave(cuello)} stroke={vientre} strokeWidth={grosor * 0.4} fill="none" strokeLinecap="round" transform="translate(5 2)" />
      {capucha && <path d={suave([[hx - 6, hy + 10], [hx - 34, hy + 34], [hx - 30, hy + 76], [hx - 4, hy + 84], [hx + 22, hy + 70], [hx + 22, hy + 34], [hx + 8, hy + 12]], true, 0.8)} fill={color} stroke={N} strokeWidth={2} />}
      {capucha && <path d={`M${hx - 2} ${hy + 26} C ${hx + 4} ${hy + 44}, ${hx + 4} ${hy + 60}, ${hx - 2} ${hy + 76}`} stroke={vientre} strokeWidth={9} fill="none" strokeLinecap="round" />}
      <g transform={`translate(${hx} ${hy})`}>
        <path d={suave([[-grosor * 0.6, 4], [-grosor * 0.4, -grosor * 0.5], [grosor * 0.5, -grosor * 0.55], [grosor * 1.2, -grosor * 0.15], [grosor * 1.2, boca ? -grosor * 0.05 : grosor * 0.2], [grosor * 0.3, grosor * 0.45]], true, 0.85)} fill={color} stroke={N} strokeWidth={2} />
        {boca && <path d={`M${grosor * 0.4} ${grosor * 0.1} L ${grosor * 1.25} ${grosor * 0.05} L ${grosor * 1.1} ${grosor * 0.55} Z`} fill="#8E2A22" stroke={N} strokeWidth={1.6} />}
        <path d={`M${grosor * 1.2} ${grosor * 0.12} l 10 -2 m -10 2 l 10 4`} stroke="#B4412C" strokeWidth={2} strokeLinecap="round" opacity={boca ? 0 : 1} />
        <OjoBestia x={grosor * 0.35} y={-grosor * 0.18} r={Math.max(3.4, grosor * 0.16)} iris={ORO} />
      </g>
    </Bestia>
  );
};

/** Cocodrilo del Nilo (Sobek, los del río): largo, bajo y con crestas en el lomo. */
const CocodriloEg: React.FC<DP> = (p) => {
  const g = caminar(p.f, p.moviendo, p.corriendo), cola = Math.sin(p.f / 10) * 6, c = '#5E7A3A', osc = '#3E5A2A';
  const lomo: P[] = [[-210, -16 + cola], [-150, -30], [-80, -44], [0, -48], [70, -40]];
  return (
    <Bestia p={p}>
      {pata(-60, -30, 34, Math.PI, g, osc, 16)}{pata(50, -30, 34, 0, g, osc, 16)}
      <path d={suave([[-212, -14 + cola], [-150, -34], [-80, -52], [0, -56], [80, -46], [120, -40], [190, -36], [196, -24], [130, -18], [80, -14], [0, -12], [-80, -12], [-150, -12]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.4} />
      <path d={suave([[-150, -14], [-60, -14], [40, -16], [120, -22], [190, -26]])} stroke="#C9C08A" strokeWidth={6} fill="none" strokeLinecap="round" />
      {lomo.slice(0, 4).flatMap((q, i) => [0, 1, 2].map((k) => { const t = k / 3, x = q[0] + (lomo[i + 1][0] - q[0]) * t, y = q[1] + (lomo[i + 1][1] - q[1]) * t; return <path key={`${i}${k}`} d={`M${x - 7} ${y - 4} L ${x} ${y - 14} L ${x + 7} ${y - 4}`} fill={osc} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />; }))}
      <path d="M120 -26 L 190 -28" stroke={N} strokeWidth={1.8} />
      {[136, 150, 164, 178].map((x) => <path key={x} d={`M${x} -27 l 3 5 l 3 -5`} fill="#FBF8EF" stroke={N} strokeWidth={0.8} />)}
      <circle cx={186} cy={-40} r={3} fill={N} />
      <path d="M86 -50 C 92 -62, 106 -62, 110 -50 Z" fill={c} stroke={N} strokeWidth={1.8} />
      <OjoBestia x={98} y={-52} r={4.4} iris="#C9A23A" />
      {pata(-80, -26, 32, 0, g, c, 18)}{pata(30, -26, 32, Math.PI, g, c, 18)}
    </Bestia>
  );
};

/** Hipopótamo del Nilo. */
const HipopotamoEg: React.FC<DP> = (p) => {
  const g = caminar(p.f, p.moviendo, p.corriendo), c = '#7E7078', osc = '#5E5058';
  return (
    <Bestia p={p}>
      {pata(-80, -70, 64, Math.PI, g, osc, 30)}{pata(60, -70, 64, 0, g, osc, 30)}
      <path d={suave([[-128, -90], [-110, -150], [-40, -172], [40, -168], [96, -146], [118, -110], [104, -70], [40, -56], [-60, -56], [-120, -66]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.4} />
      <path d="M-100 -70 C -40 -60, 40 -60, 100 -74" stroke="#C99A9A" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.8} />
      <g transform="translate(110 -128)">
        <path d={suave([[-24, -26], [8, -36], [44, -30], [70, -16], [78, 8], [62, 28], [24, 32], [-14, 22], [-24, 0]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.4} />
        <path d="M30 18 C 46 22, 62 20, 74 12" stroke={N} strokeWidth={1.8} fill="none" />
        <ellipse cx={68} cy={-10} rx={3.4} ry={2.4} fill={N} />
        <path d="M2 -32 L -2 -46 L 10 -36 Z" fill={osc} stroke={N} strokeWidth={1.6} />
        <path d="M60 30 C 50 36, 40 34, 34 30" stroke="#C99A9A" strokeWidth={6} fill="none" strokeLinecap="round" />
        <OjoBestia x={20} y={-22} r={4.6} iris="#5A3A1E" />
      </g>
      <path d="M-126 -96 C -138 -90, -140 -78, -134 -70" stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" />
      {pata(-100, -70, 64, 0, g, c, 32)}{pata(40, -70, 64, Math.PI, g, c, 32)}
    </Bestia>
  );
};

/** Vaca egipcia (manchada, cuernos en lira) o toro negro con la mancha blanca en la frente. */
const Vacuno: React.FC<DP> = (p) => {
  const g = caminar(p.f, p.moviendo, p.corriendo), toro = !!p.toro;
  const c = toro ? '#2A2622' : '#F2ECE0', osc = toro ? '#1A1714' : '#D9D2C2', mancha = toro ? '#F2ECE0' : '#3A2E26';
  const cab = Math.sin(p.f / 22) * 2;
  return (
    <Bestia p={p}>
      {pata(-86, -130, 126, Math.PI, g, osc, 20, '#3A2E26')}{pata(70, -130, 126, 0, g, osc, 20, '#3A2E26')}
      <path d="M-118 -142 C -136 -120, -138 -80, -130 -56" stroke={N} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M-118 -142 C -136 -120, -138 -80, -130 -56" stroke={c} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M-134 -62 C -140 -52, -128 -46, -126 -56 Z" fill="#3A2E26" />
      <path d={suave([[-124, -150], [-90, -178], [20, -182], [90, -168], [112, -140], [96, -110], [40, -106], [-60, -106], [-118, -116]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.4} />
      {toro ? <path d="M-60 -168 C -40 -160, -30 -150, -36 -140" stroke="#4A423A" strokeWidth={3} fill="none" /> : <g><path d={suave([[-90, -168], [-60, -176], [-40, -150], [-70, -128], [-96, -140]], true)} fill={mancha} /><path d={suave([[10, -176], [50, -172], [60, -140], [24, -126], [0, -150]], true)} fill={mancha} /></g>}
      {!toro && <path d="M40 -108 C 46 -96, 54 -94, 60 -104" fill="#E9B4A4" stroke={N} strokeWidth={1.6} />}
      <path d={suave([[70, -176], [104, -186], [126, -160], [120, -126], [96, -112]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.2} />
      <g transform={`translate(118 ${-170 + cab})`}>
        {['M2 -22 C -22 -40, -24 -66, -6 -86 C -8 -66, -4 -46, 12 -30', 'M14 -26 C 30 -44, 46 -60, 40 -86 C 52 -66, 46 -44, 24 -22'].map((d) => <path key={d} d={d} fill="#EFE6D2" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />)}
        <path d={suave([[-14, -14], [10, -28], [30, -20], [48, 8], [62, 40], [60, 56], [44, 60], [28, 46], [2, 20], [-14, 8]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.2} />
        <path d="M-10 -14 L -34 -10 L -14 0 Z" fill={c} stroke={N} strokeWidth={1.6} />
        {toro ? <path d="M22 -16 L 34 -2 L 18 2 Z" fill="#F2ECE0" /> : <path d="M26 -20 C 38 -4, 46 14, 50 34" stroke={mancha} strokeWidth={7} fill="none" opacity={0.55} />}
        <path d="M44 56 C 52 60, 60 58, 62 50" fill={toro ? '#4A3E36' : '#E9B4A4'} stroke={N} strokeWidth={1.6} />
        <ellipse cx={56} cy={46} rx={3.2} ry={2.4} fill={N} />
        <OjoBestia x={22} y={0} r={4.6} iris="#4A2E14" />
      </g>
      {pata(-110, -130, 126, 0, g, c, 22, '#3A2E26')}{pata(50, -130, 126, Math.PI, g, c, 22, '#3A2E26')}
    </Bestia>
  );
};

/** Perro egipcio (tesem): fino como un lebrel, orejas paradas y la cola enroscada. */
const PerroEg: React.FC<DP> = (p) => {
  const g = caminar(p.f, p.moviendo, p.corriendo), c = '#C99A5A', osc = '#A87A44';
  return (
    <Bestia p={p}>
      {pata(-56, -80, 78, Math.PI, g, osc, 13)}{pata(44, -84, 82, 0, g, osc, 13)}
      <path d="M-72 -96 C -100 -110, -104 -140, -84 -146 C -70 -148, -70 -132, -80 -128" stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M-72 -96 C -100 -110, -104 -140, -84 -146 C -70 -148, -70 -132, -80 -128" stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={suave([[-78, -100], [-40, -112], [20, -112], [56, -118], [68, -96], [48, -78], [0, -84], [-50, -80], [-76, -84]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.2} />
      <path d="M52 -122 L 66 -108" stroke={ROJO} strokeWidth={6} />
      <g transform={`translate(64 -132) rotate(${Math.sin(p.f / 20) * 3}) scale(1.25)`}>
        <path d="M-10 -6 L -8 -40 L 6 -12 Z" fill={c} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <path d={suave([[-14, 8], [-8, -12], [12, -16], [30, -6], [48, 0], [48, 8], [24, 12], [0, 16]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} />
        <ellipse cx={47} cy={3} rx={3} ry={2.6} fill={N} />
        <OjoBestia x={12} y={-6} r={3.4} iris="#6A4A1E" />
      </g>
      {pata(-70, -80, 78, 0, g, c, 14)}{pata(30, -84, 82, Math.PI, g, c, 14)}
    </Bestia>
  );
};

/** Caballo de carro (Nuevo Reino): alazán, crin oscura y penacho rojo. */
const CaballoEg: React.FC<DP> = (p) => {
  const g = caminar(p.f, p.moviendo, p.corriendo), c = '#9A5A30', osc = '#7A4422', crin = '#2A1A12';
  return (
    <Bestia p={p}>
      {pata(-80, -140, 136, Math.PI, g, osc, 18, crin)}{pata(64, -140, 136, 0, g, osc, 18, crin)}
      <path d="M-112 -150 C -136 -130, -140 -90, -126 -70 C -118 -90, -114 -116, -106 -134 Z" fill={crin} stroke={N} strokeWidth={1.8} />
      <path d={suave([[-122, -160], [-86, -204], [20, -206], [84, -196], [110, -160], [94, -118], [30, -108], [-60, -110], [-116, -122]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.4} />
      <path d={suave([[50, -190], [80, -230], [112, -250], [148, -236], [140, -196], [112, -146]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.2} />
      <path d="M56 -194 C 76 -224, 98 -244, 124 -252" stroke={crin} strokeWidth={16} fill="none" strokeLinecap="round" />
      <g transform="translate(132 -240) scale(1.35)">
        <path d={suave([[-12, -6], [4, -16], [30, -6], [56, 18], [58, 30], [42, 34], [20, 24], [-6, 14]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.2} />
        <path d="M-2 -12 L 2 -30 L 10 -12 Z" fill={c} stroke={N} strokeWidth={1.6} />
        <path d="M4 -16 C 0 -36, 4 -52, 14 -60 C 16 -46, 14 -32, 10 -16 Z" fill={ROJO} stroke={N} strokeWidth={1.6} />
        <path d="M34 8 C 38 18, 40 26, 38 32" stroke="#5A3A1E" strokeWidth={3} fill="none" />
        <ellipse cx={52} cy={24} rx={2.6} ry={2} fill={N} />
        <OjoBestia x={14} y={0} r={4} iris="#3A2312" />
      </g>
      {pata(-104, -140, 136, 0, g, c, 20, crin)}{pata(44, -140, 136, Math.PI, g, c, 20, crin)}
    </Bestia>
  );
};

/** Gacela dorcas: lomo leonado, panza blanca, raya oscura y cuernos anillados en S. */
const Gacela: React.FC<DP> = (p) => {
  const g = caminar(p.f, p.moviendo, p.corriendo), c = '#C99A5A', osc = '#A87A44';
  return (
    <Bestia p={p}>
      {pata(-50, -96, 94, Math.PI, g, osc, 11, '#3A2A1E')}{pata(46, -98, 96, 0, g, osc, 11, '#3A2A1E')}
      <path d="M-70 -116 L -82 -100 L -74 -96 Z" fill="#3A2A1E" />
      <path d={suave([[-74, -112], [-40, -130], [20, -132], [56, -124], [66, -104], [40, -94], [-20, -94], [-66, -98]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.2} />
      <path d="M-60 -100 C -20 -94, 30 -94, 60 -102" stroke={BLANCO} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M-62 -108 C -20 -106, 30 -106, 58 -112" stroke="#6E4A2A" strokeWidth={3} fill="none" />
      <path d={suave([[44, -124], [58, -150], [70, -162], [84, -154], [74, -132], [64, -110]], true, 0.8)} fill={c} stroke={N} strokeWidth={2} />
      <g transform={`translate(78 -164) rotate(${Math.sin(p.f / 18) * 3}) scale(1.2)`}>
        <path d="M-6 -8 C -16 -40, 0 -60, -6 -78 C 8 -60, 8 -36, 4 -10 Z" fill="#3A2A1E" stroke={N} strokeWidth={1.6} />
        {[-24, -36, -48].map((y) => <path key={y} d={`M-8 ${y} l 10 0`} stroke="#6E5A44" strokeWidth={1.6} />)}
        <path d="M-12 -2 L -22 -18 L -6 -8 Z" fill={c} stroke={N} strokeWidth={1.4} />
        <path d={suave([[-12, 2], [0, -10], [20, -4], [40, 10], [38, 18], [16, 18], [-6, 12]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} />
        <path d="M6 -4 C 18 2, 28 8, 36 14" stroke={BLANCO} strokeWidth={3} fill="none" />
        <path d="M4 -2 C 16 4, 26 10, 36 16" stroke="#6E4A2A" strokeWidth={1.6} fill="none" />
        <OjoBestia x={10} y={-2} r={3.6} iris="#2A1A10" />
      </g>
      {pata(-64, -96, 94, 0, g, c, 12, '#3A2A1E')}{pata(34, -98, 96, Math.PI, g, c, 12, '#3A2A1E')}
    </Bestia>
  );
};

/** Pez del Nilo (tilapia): azul gris con rayas y aletas de borde rojo. Nada a media altura. */
const PezEg: React.FC<DP> = (p) => {
  const c = Math.sin(p.f / 6) * 6;
  return (
    <Bestia p={p}>
      <g transform="translate(0 -60)">
        <path d={`M-46 0 L -74 ${-20 + c} L -70 ${c} L -74 ${20 + c} Z`} fill="#6E8EA0" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M-30 -20 C -10 -46, 20 -40, 30 -22 Z" fill="#6E8EA0" stroke="#B4412C" strokeWidth={2} />
        <path d={suave([[-50, 0], [-24, -26], [16, -28], [46, -10], [50, 4], [20, 22], [-24, 20]], true, 0.85)} fill="#8AA8B8" stroke={N} strokeWidth={2} />
        {[-24, -10, 4, 18].map((x) => <path key={x} d={`M${x} -24 C ${x - 4} -6, ${x - 4} 6, ${x} 18`} stroke="#5E7A8A" strokeWidth={3} fill="none" />)}
        <path d="M-10 18 C 0 30, 14 30, 18 18 Z" fill="#6E8EA0" stroke="#B4412C" strokeWidth={1.6} />
        <path d="M40 8 Q 46 10 50 6" stroke={N} strokeWidth={1.6} fill="none" />
        <OjoBestia x={34} y={-6} r={4.2} iris="#C9A23A" />
      </g>
    </Bestia>
  );
};

/** Ammit, la devoradora: cabeza de cocodrilo, delante de leona (con melena), detrás de hipopótamo. */
const AmmitEg: React.FC<DP> = (p) => {
  const g = caminar(p.f, p.moviendo, p.corriendo), boca = p.boca ? 8 : 0;
  return (
    <Bestia p={p}>
      {pata(-70, -90, 86, Math.PI, g, '#5E5058', 30)}{pata(54, -110, 106, 0, g, '#A8742E', 20)}
      <path d={suave([[-110, -100], [-96, -150], [-40, -166], [10, -164], [30, -110], [-40, -88], [-100, -84]], true, 0.85)} fill="#7E7078" stroke={N} strokeWidth={2.4} />
      <path d={suave([[0, -170], [50, -176], [86, -160], [96, -126], [70, -104], [20, -100], [-4, -120]], true, 0.85)} fill="#C8892E" stroke={N} strokeWidth={2.4} />
      <path d={suave([[50, -186], [90, -196], [118, -176], [120, -130], [96, -104], [70, -120], [56, -150]], true, 0.85)} fill="#7A4A1E" stroke={N} strokeWidth={2.2} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${70 + i * 10} -186 C ${64 + i * 10} -160, ${70 + i * 10} -134, ${76 + i * 8} -114`} stroke="#5A3414" strokeWidth={2} fill="none" />)}
      <g transform="translate(112 -168)">
        <path d={`M-6 -14 C 20 -24, 70 -20, 106 -8 C 110 -2, 106 4, 100 ${4 - boca} C 70 ${2 - boca}, 30 ${4 - boca}, 0 6 Z`} fill="#5E7A3A" stroke={N} strokeWidth={2.2} />
        <path d={`M0 8 C 30 ${8 + boca}, 70 ${10 + boca}, 98 ${8 + boca} C 96 ${16 + boca}, 70 ${22 + boca}, 4 22 Z`} fill="#5E7A3A" stroke={N} strokeWidth={2} />
        {[30, 46, 62, 78].map((x) => <path key={x} d={`M${x} ${4 - boca * 0.5} l 3 6 l 3 -6`} fill="#FBF8EF" stroke={N} strokeWidth={0.8} />)}
        <path d="M10 -18 C 14 -32, 30 -32, 32 -18 Z" fill="#5E7A3A" stroke={N} strokeWidth={1.8} />
        <OjoBestia x={22} y={-20} r={4.6} iris="#D9B23A" />
        <circle cx={100} cy={-6} r={2.6} fill={N} />
      </g>
      {pata(-92, -90, 86, 0, g, '#7E7078', 32)}{pata(34, -110, 106, Math.PI, g, '#C8892E', 22)}
      <path d="M-108 -120 C -122 -112, -124 -96, -118 -88" stroke="#7E7078" strokeWidth={6} fill="none" strokeLinecap="round" />
    </Bestia>
  );
};

/** Ojo de Ra (udyat): el ojo de halcón con la ceja y las dos marcas, flotando y brillando sobre su lugar. */
const OjoUdyat: React.FC<DP> = (p) => {
  const fl = Math.sin(p.f / 12) * 8, b = 0.55 + Math.sin(p.f / 6) * 0.15;
  return (
    <Bestia p={p}>
      <g transform={`translate(0 ${-170 + fl})`}>
        <circle r={130} fill="#FFE7A0" opacity={b * 0.5} />
        <path d="M-100 0 C -50 -56, 56 -56, 104 0 C 56 36, -50 36, -100 0 Z" fill="#FBF8EF" stroke={N} strokeWidth={7} strokeLinejoin="round" />
        <circle r={28} fill="#2E5FA8" stroke={N} strokeWidth={4} /><circle r={14} fill={NEGRO} /><circle cx={-8} cy={-8} r={6} fill="#FFFFFF" />
        <path d="M-110 -48 C -56 -92, 56 -88, 122 -50" stroke={N} strokeWidth={15} fill="none" strokeLinecap="round" />
        <path d="M-110 -48 C -56 -92, 56 -88, 122 -50" stroke={ORO} strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M104 0 L 160 4" stroke={N} strokeWidth={10} strokeLinecap="round" />
        <path d="M-20 32 L -30 104" stroke={N} strokeWidth={11} strokeLinecap="round" />
        <path d="M12 32 C 30 66, 66 76, 76 104 C 84 124, 56 132, 48 114" stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
      </g>
    </Bestia>
  );
};

/** Cerquillo de canas en la nuca de los viejos rapados. Coords de cabeza. */
const CanasNuca: React.FC = () => <path d={suave([[-24, -22], [-32, -4], [-30, 16], [-22, 24], [-20, 10], [-22, -6]], true, 0.85)} fill="#ECE8E0" stroke={N} strokeWidth={1.4} />;
/** Vendas del torso (momia). */
const VendasTorso: React.FC<{ linea?: string }> = ({ linea = '#B9AE98' }) => (
  <g>
    <path d={suave([[-26, -300], [18, -304], [32, -284], [30, -240], [26, -212], [-28, -208], [-30, -250], [-30, -284]], true)} fill="#E9DFC6" stroke={N} strokeWidth={2} />
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M-28 ${-290 + i * 18} L 30 ${-298 + i * 18}`} stroke={linea} strokeWidth={1.6} />)}
  </g>
);

// ---------- fichas ----------
const h = (p: Partial<PersonajeProps>, griego?: string): Ficha => ({ tipo: 'persona', p: { orejaSimple: true, piel: PIEL_H, tocado: null, peloCorto: true, collar: false, ropa: 'corta', ropaColor: LINO, ribete: ORO, ...p }, griego });
const m = (p: Partial<PersonajeProps>, griego?: string): Ficha => ({ tipo: 'persona', p: { mujer: true, orejaSimple: true, piel: PIEL_M, tocado: null, peloCorto: true, collar: false, ropa: 'larga', ribete: ORO, ...p }, griego });
const animal = (tipo: Animal, piel = PIEL_H, peluca = true) => <Cabeza tipo={tipo} piel={piel} peluca={peluca} />;
const D = (Dibujo: React.FC<DibujoProps>, p: Record<string, unknown>, griego?: string): Ficha => ({ tipo: 'dibujo', Dibujo, p, griego });
const BRAZO_VARA: [number, number] = [20, 60]; // mano adelante a media altura, vara vertical hasta el suelo

export const ELENCO_EGIPCIO_OFICIAL: Record<string, Ficha> = {
  ra_oficial: h({ s: 1.04, cabezaPropia: true, brazo: BRAZO_VARA, adornos: { cabeza: <>{animal('halcon')}<DiscoSolar /></>, cuerpo: <><Usekh bandas={[ROJO, ORO, AZUL, ORO]} /><Delantal c1={ORO} c2={ROJO} /></>, mano: <Was /> } }, 'RA'),
  isis_oficial: m({ ropaColor: ROJO, alas: true, brazo: [38, 4], brazoAtras: [48, -8], adornos: { cabeza: <><PelucaDiosa /><Trono /></>, cuerpo: <><Vestido c={ROJO} /><Usekh a={0.92} /></> } }, 'ISIS'),
  amun_oficial: h({ s: 1.04, piel: '#4C86C2', ropa: 'larga', ropaColor: LINO, brazo: [10, 80], adornos: { cabeza: <><PlumasAmon /><BarbaDios recta /></>, cuerpo: <><Vendas c="#E9F0E6" /><Usekh bandas={[ROJO, ORO, AZUL, ORO]} /></>, mano: <Was /> } }, 'AMUN'),
  osiris_oficial: h({ s: 1.04, piel: VERDE, ropa: 'larga', ropaColor: LINO, brazo: [0, 110], brazoAtras: [0, 70], adornos: { cabeza: <><BarbaDios /><Atef /></>, cuerpo: <><Vendas /><Usekh /></>, mano: <CayadoMayal /> } }, 'OSIRIS'),
  set_oficial: h({ s: 1.04, cabezaPropia: true, brazo: BRAZO_VARA, ropaColor: LINO, adornos: { cabeza: animal('set'), cuerpo: <><Usekh bandas={[ROJO, ORO, '#6E2A1A', ORO]} /><Delantal c1={ROJO} c2={ORO} /></>, mano: <Lanza /> } }, 'SET'),
  horus_oficial: h({ s: 1.04, cabezaPropia: true, objeto: 'ankh', brazo: [24, 40], adornos: { cabeza: <>{animal('halcon')}<DobleCorona /></>, cuerpo: <><Usekh /><Delantal c1={AZUL} c2={ORO} /></> } }, 'HORUS'),
  anubis_oficial: h({ s: 1.04, cabezaPropia: true, brazo: [40, 50], adornos: { cabeza: animal('chacal'), cuerpo: <><Usekh bandas={[ORO, NEGRO, ORO, TURQ]} /><Delantal c1={ORO} c2={NEGRO} /></>, mano: <Balanza /> } }, 'ANUBIS'),
  thoth_oficial: h({ s: 1.04, cabezaPropia: true, brazo: [5, 45], adornos: { cabeza: <>{animal('ibis')}<Luna /></>, cuerpo: <><Usekh bandas={[TURQ, ORO, AZUL, ORO]} /><Delantal c1={TURQ} c2={LINO} /></>, mano: <Paleta /> } }, 'THOTH'),
  hathor_oficial: m({ ropaColor: TURQ, brazo: [30, 60], adornos: { cabeza: <><PelucaDiosa /><CuernosDisco /></>, cuerpo: <><Vestido c={TURQ} /><Usekh a={0.92} bandas={[ROJO, ORO, AZUL, ORO]} /></>, mano: <Sistro /> } }, 'HATHOR'),
  sekhmet_oficial: m({ ropaColor: ROJO, cabezaPropia: true, objeto: 'ankh', brazo: [24, 40], adornos: { cabeza: <>{animal('leona', PIEL_M)}<DiscoSolar /></>, cuerpo: <><Vestido c={ROJO} /><Usekh a={0.92} bandas={[ORO, ROJO, ORO, TURQ]} /></> } }, 'SEKHMET'),
  nut_oficial: m({ piel: '#3567B0', ropaColor: '#1E3A6E', brazo: [95, 50], brazoAtras: [105, 30], adornos: { cabeza: <PelucaDiosa c="#14244A" banda={ORO_CLARO} />, cuerpo: <><Vestido c="#1E3A6E" /><Estrellas area={[-28, -296, 30, -16]} n={22} /><Usekh a={0.92} bandas={[ORO, AZUL, ORO, AZUL]} /></> } }, 'NUT'),
  geb_oficial: h({ s: 1.04, piel: '#4E8A4A', brazo: [26, 40], adornos: { cabeza: <><PelucaCorta /><BarbaDios /><Ganso /></>, cuerpo: <><Usekh bandas={[VERDE, ORO, '#8A5A30', ORO]} /><Delantal c1="#8A5A30" c2={ORO} /></> } }, 'GEB'),
  bastet_oficial: m({ ropaColor: VERDE, cabezaPropia: true, brazo: [30, 60], adornos: { detras: <g transform="translate(-92 0)"><GatoSentado c="#2B2A30" raya="#4A484F" s={0.8} ojo="#7CC46A" contorno={N} aro /></g>, cabeza: animal('gato', PIEL_M, false), cuerpo: <><Vestido c={VERDE} /><Usekh a={0.92} bandas={[ORO, TURQ, ORO, ROJO]} /></>, mano: <Sistro /> } }, 'BASTET'),
  ptah_oficial: h({ s: 1.04, ropa: 'larga', ropaColor: LINO, brazo: [10, 80], adornos: { cabeza: <><Gorro /><BarbaDios recta /></>, cuerpo: <><Vendas c="#E9F0E6" /><Usekh bandas={[AZUL, ORO, TURQ, ORO]} /></>, mano: <CetroPtah /> } }, 'PTAH'),
  // ===== Secundarios (2026-10-17): dioses menores =====
  shu_oficial: h({ objeto: 'ankh', brazo: [24, 40], adornos: { cabeza: <><PelucaCorta /><BarbaDios /><g transform="translate(-8 -40)"><Pluma alto={86} /></g></>, cuerpo: <><Usekh bandas={['#7FB8D8', ORO, AZUL, ORO]} /><Delantal c1="#7FB8D8" c2={ORO} /></> } }, 'SHU'),
  tefnut_oficial: m({ ropaColor: AZUL, cabezaPropia: true, brazo: BRAZO_VARA, adornos: { cabeza: <>{animal('leona', PIEL_M)}<DiscoSolar /></>, cuerpo: <><Vestido c={AZUL} /><Usekh a={0.92} bandas={[ORO, AZUL, ORO, TURQ]} /></>, mano: <Was /> } }, 'TEFNUT'),
  atum_oficial: h({ s: 1.04, objeto: 'ankh', brazo: [24, 40], adornos: { cabeza: <><PelucaCorta /><BarbaDios /><DobleCorona /></>, cuerpo: <><Usekh /><Delantal c1={ROJO} c2={ORO} /></> } }, 'ATUM'),
  neftis_oficial: m({ ropaColor: '#2D6A4F', objeto: 'ankh', brazo: [24, 40], adornos: { cabeza: <><PelucaDiosa /><CasaNeftis /></>, cuerpo: <><Vestido c="#2D6A4F" /><Usekh a={0.92} bandas={[ORO, '#2D6A4F', ORO, ROJO]} /></> } }, 'NEPHTHYS'),
  maat_oficial: m({ ropaColor: LINO, objeto: 'ankh', brazo: [24, 40], adornos: { cabeza: <><PelucaDiosa banda={ROJO} /><g transform="translate(-16 -32) rotate(-6)"><Pluma alto={70} /></g></>, cuerpo: <><Vestido c={LINO} borde={ROJO} /><Usekh a={0.92} bandas={[ROJO, ORO, AZUL, ORO]} /></> } }, 'MAAT'),
  khnum_oficial: h({ s: 1.04, cabezaPropia: true, brazo: [40, 50], adornos: { cabeza: <CabezaCarnero piel={PIEL_H} />, cuerpo: <><Usekh bandas={[VERDE, ORO, AZUL, ORO]} /><Delantal c1={VERDE} c2={ORO} /></>, mano: <Vasija /> } }, 'KHNUM'),
  khonsu_oficial: h({ ropa: 'larga', ropaColor: LINO, pelo: PIEL_H, brazo: [0, 110], brazoAtras: [0, 70], adornos: { cabeza: <><Rapada piel={PIEL_H} /><Mechon /><Luna /></>, cuerpo: <><Vendas c="#F2EEE2" /><Usekh bandas={[TURQ, ORO, AZUL, ORO]} /></>, mano: <CayadoMayal /> } }, 'KHONSU'),
  khepri_oficial: h({ s: 1.04, cabezaPropia: true, objeto: 'ankh', brazo: [24, 40], adornos: { cabeza: <CabezaEscarabajo piel={PIEL_H} />, cuerpo: <><Usekh bandas={[TURQ, ORO, ROJO, ORO]} /><Delantal c1={TURQ} c2={ORO} /></> } }, 'KHEPRI'),
  sokar_oficial: h({ s: 1.04, cabezaPropia: true, ropa: 'larga', ropaColor: LINO, brazo: [0, 110], brazoAtras: [0, 70], adornos: { cabeza: <>{animal('halcon')}<Atef /></>, cuerpo: <><Vendas /><Usekh bandas={[VERDE, ORO, AZUL, ORO]} /></>, mano: <CayadoMayal /> } }, 'SOKAR'),
  sia_oficial: h({ brazo: [36, 40], adornos: { cabeza: <><Tripartita /><BarbaDios /></>, cuerpo: <><Usekh bandas={[AZUL, ORO, TURQ, ORO]} /><Delantal c1={AZUL} c2={LINO} /></>, mano: <Rollo /> } }, 'SIA'),
  heh_oficial: h({ arrodillado: 1, brazo: [60, 60], brazoAtras: [70, 50], adornos: { cabeza: <><PelucaCorta /><BarbaDios /><g transform="translate(-10 -38) scale(0.85)"><Palma alto={110} /></g></>, cuerpo: <><Usekh /><Delantal c1={ORO} c2={VERDE} /></>, mano: <Palma />, manoAtras: <Palma /> } }, 'HEH'),
  nun_oficial: h({ s: 1.06, piel: '#3F7FA6', ropaColor: '#2E6E8E', brazo: [120, 30], brazoAtras: [130, 30], adornos: { cabeza: <><Tripartita c="#1F3A5A" raya="#3E6A8E" /><BarbaDios /></>, cuerpo: <><Ondas /><Usekh bandas={['#BFE3EE', AZUL, '#BFE3EE', AZUL]} /></> } }, 'NUN'),
  iah_oficial: h({ ropa: 'larga', ropaColor: '#DDE3EA', brazo: [40, 50], adornos: { cabeza: <><PelucaCorta /><BarbaDios /><Luna /></>, cuerpo: <Usekh bandas={['#9AA7B2', LINO, '#9AA7B2', ORO]} />, mano: <Senet /> } }, 'MOON'),
  neit_oficial: m({ ropaColor: LINO, brazo: [30, 10], adornos: { cabeza: <><PelucaDiosa /><CoronaRoja /></>, cuerpo: <><Vestido c={LINO} borde={VERDE} /><Usekh a={0.92} bandas={[VERDE, ORO, ROJO, ORO]} /></>, mano: <ArcoFlechas /> } }, 'NEITH'),
  serqet_oficial: m({ ropaColor: OCRE, objeto: 'ankh', brazo: [24, 40], adornos: { cabeza: <><PelucaDiosa /><EscorpionCabeza /></>, cuerpo: <><Vestido c={OCRE} /><Usekh a={0.92} bandas={[ROJO, ORO, AZUL, ORO]} /></> } }, 'SERQET'),
  isis_anciana_oficial: m({ cuerpo: 'viejo', canas: true, ropaColor: '#8A7A66', ribete: '#5A4C3E', brazo: BRAZO_VARA, adornos: { cabeza: <MantoCabeza />, cuerpo: <Vestido c="#8A7A66" borde="#5A4C3E" />, mano: <Baston abajo={210} /> } }, 'ISIS IN DISGUISE'),
  nemty_oficial: h({ piel: PIEL_H2, brazo: [20, 60], adornos: { cabeza: <Panuelo />, cuerpo: <Faja c={AZUL} />, mano: <Pertiga /> } }, 'NEMTY'),
  horus_nino_oficial: h({ cuerpo: 'nino', pelo: PIEL_H, brazo: [30, 30], adornos: { cabeza: <><Rapada piel={PIEL_H} /><Mechon /><path d="M22 -30 C 6 -38, -18 -36, -34 -16" stroke={ORO} strokeWidth={4} fill="none" strokeLinecap="round" /><Ureo x={24} y={-38} /></>, cuerpo: <Usekh bandas={[ORO, AZUL, ORO, TURQ]} /> } }, 'HORUS THE CHILD'),
  // criaturas con nombre
  apofis_oficial: D(SerpienteEg, { s: 1.3, largo: 520, grosor: 44, alto: 170, color: '#5A3E5E', vientre: '#C9A27A', bandas: '#3A2440', boca: true }, 'APEP'),
  mehen_oficial: D(SerpienteEg, { largo: 300, grosor: 26, alto: 120, color: '#C9A23A', vientre: '#F4E2A8', bandas: '#8E5A1E', anillos: true }, 'MEHEN'),
  ammit_oficial: D(AmmitEg, {}, 'AMMIT'),
  bennu_oficial: D(Garza, { s: 1.1 }, 'BENNU'),
  tefen_oficial: D(EscorpionEg, { s: 1.25, color: '#5A3A22', banda: true }, 'TEFEN'),
  befen_oficial: D(EscorpionEg, { s: 1.2, color: '#6E4426', banda: true }, 'BEFEN'),
  mestet_oficial: D(EscorpionEg, { s: 1.05, color: '#8A5A2A' }, 'MESTET'),
  mestetef_oficial: D(EscorpionEg, { s: 1.05, color: '#9A6A30' }, 'MESTETEF'),
  petet_oficial: D(EscorpionEg, { color: '#7A4A26' }, 'PETET'),
  thetet_oficial: D(EscorpionEg, { color: '#A0763A' }, 'THETET'),
  matet_oficial: D(EscorpionEg, { s: 0.95, color: '#B08440' }, 'MATET'),
  // mortales con nombre (cuentos: Westcar, Sinuhé, Dos Hermanos, Setne, Bentresh…)
  bata_oficial: h({ brazo: [20, 60], adornos: { cabeza: <PelucaRedonda />, mano: <CayadoPastor abajo={210} /> } }, 'BATA'),
  anubis_hermano_oficial: h({ s: 1.04, piel: PIEL_H2, brazo: [30, 40], adornos: { cabeza: <Panuelo />, cuerpo: <Faja c={ROJO} />, mano: <Azada /> } }, 'ANUBIS THE FARMER'),
  imhotep_oficial: h({ ropa: 'larga', ropaColor: LINO, brazo: [40, 50], adornos: { cabeza: <Casquete />, cuerpo: <Usekh a={0.9} bandas={[AZUL, ORO, LINO, ORO]} />, mano: <PapiroAbierto /> } }, 'IMHOTEP'),
  asclepio_imhotep_oficial: h({ piel: PIEL_EXT, barba: true, pelo: '#4A3A2E', peloCorto: false, ropa: 'larga', ropaColor: '#EDE6D2', ribete: '#8A6A4A', brazo: BRAZO_VARA, adornos: { mano: <VaraAsclepio /> } }, 'ASCLEPIUS'),
  setne_oficial: h({ ropa: 'larga', ropaColor: LINO, pelo: PIEL_H, brazo: [36, 40], adornos: { cabeza: <><Rapada piel={PIEL_H} /><Mechon /></>, cuerpo: <><PielLeopardo /><Usekh a={0.9} bandas={[ORO, AZUL, ORO, ROJO]} /></>, mano: <Rollo /> } }, 'SETNE'),
  inaros_oficial: h({ brazo: [40, 40], adornos: { cabeza: <PelucaRedonda banda={ORO} />, cuerpo: <><Usekh a={0.9} bandas={[ROJO, ORO, AZUL, ORO]} /><Faja c={AZUL} /></>, mano: <Antorcha /> } }, 'INAROS'),
  nanef_oficial: h({ ropa: 'larga', ropaColor: LINO, brazo: [40, 50], adornos: { cabeza: <PelucaRedonda banda={ORO} />, cuerpo: <><Usekh a={0.9} bandas={[AZUL, ORO, TURQ, ORO]} /><Faja c={TURQ} /></>, mano: <LibroThoth /> } }, 'NANEFERKAPTAH'),
  ahwere_oficial: m({ ropaColor: '#C9673A', brazo: [36, 30], adornos: { cabeza: <PelucaDiosa banda={ORO} />, cuerpo: <><Vestido c="#C9673A" /><Usekh a={0.92} bandas={[ORO, TURQ, ORO, AZUL]} /></>, mano: <Loto /> } }, 'AHWERE'),
  merib_oficial: h({ cuerpo: 'nino', pelo: PIEL_H, adornos: { cabeza: <><Rapada piel={PIEL_H} /><Mechon /></>, cuerpo: <Faja c={TURQ} /> } }, 'MERIB'),
  tabubu_oficial: m({ ropaColor: LINO, adornos: { cabeza: <><PelucaDiosa banda={ORO} /><g transform="translate(16 -34) rotate(40) scale(0.5)"><Loto /></g></>, cuerpo: <><Vestido c={LINO} /><RedCuentas /><Usekh a={0.92} bandas={[TURQ, ORO, AZUL, ORO]} /></> } }, 'TABUBU'),
  djedi_oficial: h({ cuerpo: 'viejo', pelo: PIEL_H, ropa: 'larga', ropaColor: LINO, brazo: BRAZO_VARA, adornos: { cabeza: <CanasNuca />, cuerpo: <Banda c={AZUL} />, mano: <Baston abajo={200} /> } }, 'DJEDI'),
  hordedef_oficial: h({ brazo: BRAZO_VARA, adornos: { cabeza: <PelucaRedonda banda={ORO} />, cuerpo: <><Usekh a={0.9} bandas={[ORO, ROJO, ORO, AZUL]} /><Delantal c1={ORO} c2={ROJO} /></>, mano: <Baston abajo={210} pomo={ORO} /> } }, 'HORDEDEF'),
  sinuhe_oficial: h({ ropa: 'larga', ropaColor: LINO, brazo: BRAZO_VARA, adornos: { cabeza: <PelucaRedonda />, cuerpo: <Banda c={ROJO} />, mano: <Baston abajo={210} /> } }, 'SINUHE'),
  sinuhe_viejo_oficial: h({ cuerpo: 'viejo', ropa: 'larga', ropaColor: LINO, brazo: BRAZO_VARA, adornos: { cabeza: <PelucaRedonda />, cuerpo: <Banda c={ROJO} />, mano: <Baston abajo={200} /> } }, 'OLD SINUHE'),
  amunenshi_oficial: h({ piel: PIEL_EXT, barba: true, pelo: '#1C1814', ropa: 'larga', ropaColor: '#E9DFC6', ribete: ROJO, brazo: BRAZO_VARA, adornos: { cabeza: <PeloRetenu banda={AZUL} />, cuerpo: <TunicaRetenu />, mano: <Baston abajo={210} pomo={ORO} /> } }, 'AMMUNENSHI'),
  campeon_retenu_oficial: h({ s: 1.14, ropa: 'tunica', piel: PIEL_EXT, barba: true, pelo: '#1C1814', ropaColor: '#7E2B22', ribete: ORO, brazo: [40, 40], adornos: { cabeza: <PeloRetenu banda={ORO} />, cuerpo: <TunicaRetenu c1="#7E2B22" c2={ORO} c3="#E9DFC6" corta />, mano: <HachaRetenu /> } }, 'THE STRONG MAN'),
  djehuty_oficial: h({ brazo: [40, 40], adornos: { cabeza: <PelucaRedonda banda={ORO} />, cuerpo: <><Corselete /><Usekh a={0.9} bandas={[ORO, ROJO, ORO, AZUL]} /></>, mano: <Maza /> } }, 'DJEHUTY'),
  ramses_oficial: h({ s: 1.04, brazo: [36, 40], adornos: { cabeza: <><Khepresh /><BarbaDios recta /></>, cuerpo: <><Usekh bandas={[AZUL, ORO, ROJO, ORO]} /><Delantal c1={ORO} c2={AZUL} /></>, mano: <Heqa /> } }, 'RAMESSES II'),
  djoser_oficial: h({ s: 1.04, ropa: 'larga', ropaColor: BLANCO, brazo: [0, 110], brazoAtras: [0, 70], adornos: { cabeza: <><Nemes /><BarbaDios recta /></>, cuerpo: <MantoJubileo />, mano: <Mayal /> } }, 'DJOSER'),
  snefru_oficial: h({ s: 1.04, brazo: [30, 40], adornos: { cabeza: <><CoronaBlanca /><BarbaDios recta /></>, cuerpo: <><Usekh bandas={[ROJO, ORO, AZUL, ORO]} /><Delantal c1={ORO} c2={ROJO} /></>, mano: <Mayal /> } }, 'SNEFERU'),
  senusret_oficial: h({ s: 1.04, brazo: BRAZO_VARA, adornos: { cabeza: <><Nemes c2={ROJO} /><BarbaDios recta /></>, cuerpo: <><Usekh bandas={[ORO, ROJO, ORO, AZUL]} /><Delantal c1={ROJO} c2={ORO} /></>, mano: <Lanza /> } }, 'SENUSRET'),
  rey_biblos_oficial: h({ piel: PIEL_EXT, barba: true, pelo: '#1C1814', ropa: 'larga', ropaColor: '#6E2A5E', ribete: ORO, brazo: BRAZO_VARA, adornos: { cabeza: <><PeloRetenu banda={ORO} /><GorroAlto c="#F2E6C8" /></>, cuerpo: <><Vestido c="#6E2A5E" a={1} /><Banda c={ORO} /></>, mano: <Baston abajo={210} pomo={ORO} /> } }, 'KING OF BYBLOS'),
  aso_oficial: m({ piel: PIEL_NUBIA, ropaColor: ROJO, brazo: [30, 40], adornos: { cabeza: <CasqueteKush />, cuerpo: <><Vestido c={ROJO} /><Usekh a={0.92} bandas={[ORO, AZUL, ORO, ROJO]} /></>, mano: <Mayal /> } }, 'ASO'),
  bakhtan_oficial: h({ piel: PIEL_EXT, barba: true, pelo: '#1C1814', ropa: 'larga', ropaColor: '#2E5FA8', ribete: ORO, brazo: BRAZO_VARA, adornos: { cabeza: <PeloRetenu banda={ORO} />, cuerpo: <VestidoExtranjero c="#2E5FA8" />, mano: <Baston abajo={210} pomo={ORO} /> } }, 'PRINCE OF BAKHTAN'),
  bentresh_oficial: m({ piel: PIEL_CLARA, ropaColor: TURQ, ribete: ORO, brazo: [24, 30], adornos: { cabeza: <PelucaDiosa c="#2A1A12" banda={ORO} />, cuerpo: <VestidoExtranjero c={TURQ} borde={ROJO} /> } }, 'BENTRESH'),
  hitita_oficial: m({ piel: PIEL_CLARA, ropaColor: '#8A3A2A', ribete: ORO, brazo: [24, 30], adornos: { cabeza: <><PelucaDiosa c="#2A1A12" banda="#8A3A2A" /><GorroAlto c="#8A3A2A" velo="#E9DFC6" banda={ORO} /></>, cuerpo: <VestidoExtranjero c="#8A3A2A" /> } }, 'HITTITE PRINCESS'),
  // ===== extras de cada día (variantes para que las multitudes no salgan clonadas) =====
  aldeano_egipcio_oficial: h({ adornos: { cabeza: <PelucaRedonda /> } }),
  aldeano_egipcio_b_oficial: h({ piel: PIEL_H2, adornos: { cabeza: <Panuelo />, cuerpo: <Faja c="#B9AE98" /> } }),
  aldeano_egipcio_c_oficial: h({ cuerpo: 'gordo', piel: '#A8643E', pelo: '#A8643E', adornos: { cabeza: <Rapada piel={PIEL_H} />, cuerpo: <Faja c={ROJO} /> } }),
  aldeana_egipcia_oficial: m({ ropaColor: LINO, adornos: { cabeza: <PelucaDiosa banda={ROJO} />, cuerpo: <Vestido c={LINO} borde={ROJO} /> } }),
  aldeana_egipcia_b_oficial: m({ piel: '#C98E5A', ropaColor: '#D9A85A', adornos: { cabeza: <PelucaRedonda />, cuerpo: <Vestido c="#D9A85A" borde={AZUL} /> } }),
  aldeana_egipcia_c_oficial: m({ ropaColor: '#6E9CC0', brazoAtras: [172, 24], adornos: { cabeza: <><Panuelo /><CestaCabeza /></>, cuerpo: <Vestido c="#6E9CC0" borde={LINO} /> } }),
  sacerdote_egipcio_oficial: h({ ropa: 'larga', ropaColor: LINO, pelo: PIEL_H, adornos: { cabeza: <Rapada piel={PIEL_H} />, cuerpo: <Banda /> } }, 'PRIEST'),
  sacerdote_egipcio_b_oficial: h({ s: 1.02, ropa: 'larga', ropaColor: LINO, pelo: PIEL_H, brazo: BRAZO_VARA, adornos: { cabeza: <Rapada piel={PIEL_H} />, cuerpo: <><PielLeopardo /><Usekh a={0.9} bandas={[ORO, AZUL, ORO, TURQ]} /></>, mano: <Baston abajo={210} pomo={ORO} /> } }, 'HIGH PRIEST'),
  faraon_oficial: h({ s: 1.04, brazo: [0, 110], brazoAtras: [0, 70], adornos: { cabeza: <><Nemes /><BarbaDios recta /></>, cuerpo: <><Usekh bandas={[AZUL, ORO, AZUL, ORO]} /><Delantal c1={ORO} c2={AZUL} /></>, mano: <CayadoMayal /> } }, 'PHARAOH'),
  faraon_b_oficial: h({ s: 1.04, objeto: 'ankh', brazo: [24, 40], adornos: { cabeza: <><DobleCorona /><BarbaDios recta /></>, cuerpo: <><Usekh bandas={[ROJO, ORO, AZUL, ORO]} /><Delantal c1={ROJO} c2={ORO} /></> } }, 'PHARAOH'),
  reina_egipcia_oficial: m({ ropaColor: LINO, adornos: { cabeza: <CoronaBuitre />, cuerpo: <><Vestido c={LINO} borde={ROJO} /><Faja c={ROJO} /><Usekh a={0.92} bandas={[ORO, AZUL, ORO, ROJO]} /></> } }, 'QUEEN'),
  reina_egipcia_b_oficial: m({ ropaColor: LINO, adornos: { cabeza: <CoronaPlana />, cuerpo: <><Vestido c={LINO} /><Usekh a={0.92} bandas={[AZUL, ORO, ROJO, TURQ]} /></> } }, 'QUEEN'),
  escriba_oficial: h({ brazo: [40, 40], adornos: { cabeza: <PelucaRedonda />, cuerpo: <Faja c="#B9AE98" />, mano: <g transform="rotate(40)"><Paleta /></g> } }, 'SCRIBE'),
  escriba_b_oficial: h({ cuerpo: 'gordo', pelo: PIEL_H, ropa: 'larga', ropaColor: LINO, brazo: [40, 50], adornos: { cabeza: <Rapada piel={PIEL_H} />, mano: <PapiroAbierto /> } }, 'SCRIBE'),
  nino_egipcio_oficial: h({ cuerpo: 'nino', pelo: PIEL_H, adornos: { cabeza: <><Rapada piel={PIEL_H} /><Mechon /></> } }),
  nina_egipcia_oficial: m({ cuerpo: 'nino', ropaColor: LINO, adornos: { cabeza: <Mechon />, cuerpo: <Vestido c={LINO} borde={ROJO} /> } }),
  momia_oficial: h({ piel: '#E9DFC6', ropa: 'larga', ropaColor: '#E9DFC6', cabezaPropia: true, brazo: [0, 110], brazoAtras: [0, 70], adornos: { cabeza: <CabezaMomia />, cuerpo: <><Vendas c="#E9DFC6" /><VendasTorso /></> } }, 'MUMMY'),
  anciano_egipcio_oficial: h({ cuerpo: 'viejo', ropa: 'larga', ropaColor: '#D9C9A6', brazo: BRAZO_VARA, adornos: { cabeza: <Panuelo />, mano: <Baston abajo={200} /> } }),
  anciana_egipcia_oficial: m({ cuerpo: 'viejo', canas: true, ropaColor: '#B9A98A', ribete: '#7A6A56', adornos: { cabeza: <MantoCabeza c="#9A8A72" borde="#7A6A56" />, cuerpo: <Vestido c="#B9A98A" borde="#7A6A56" /> } }),
  rey_extranjero_oficial: h({ piel: PIEL_EXT, barba: true, pelo: '#1C1814', ropa: 'larga', ropaColor: '#7E2B22', ribete: ORO, brazo: BRAZO_VARA, adornos: { cabeza: <PeloRetenu banda={ORO} />, cuerpo: <TunicaRetenu c1="#7E2B22" c2={ORO} c3="#E9DFC6" />, mano: <Baston abajo={210} pomo={ORO} /> } }),
  soldado_egipcio_oficial: h({ brazo: [20, 40], adornos: { cabeza: <PelucaRedonda />, cuerpo: <Faja c={ROJO} />, mano: <LanzaCorta />, manoAtras: <EscudoCuero /> } }),
  soldado_egipcio_b_oficial: h({ piel: PIEL_NUBIA, brazo: [30, 10], adornos: { cabeza: <><PelucaRedonda /><PlumaNubia /></>, cuerpo: <Faja c={ROJO} />, mano: <ArcoFlechas flechas={false} /> } }),
  // ===== animales =====
  halcon_egipcio_oficial: D(AguilaEpica, { especie: 'aguila', vuela: true, color: '#7A5A3A', cabeza: '#3A2E26', s: 0.6, alto: 360, izq: 380, der: 380 }),
  milano_egipcio_oficial: D(Pajaro, { especie: 'milano' }),
  golondrina_egipcia_oficial: D(Pajaro, { especie: 'golondrina' }),
  cobra_egipcia_oficial: D(SerpienteEg, { capucha: true, color: '#8A6A3A', vientre: '#E9D9A6', bandas: '#5A4426', largo: 200, grosor: 22, alto: 120 }),
  serpiente_egipcia_oficial: D(SerpienteEg, { color: '#9A8A4A', vientre: '#EDE2B8', bandas: '#5E5426', largo: 240, grosor: 20, alto: 70 }),
  cocodrilo_egipcio_oficial: D(CocodriloEg, {}),
  hipopotamo_egipcio_oficial: D(HipopotamoEg, {}, 'HIPPOPOTAMUS'),
  vaca_egipcia_oficial: D(BovinoEpico, { especie: 'vaca', alto: 440, izq: 280, der: 280 }),
  toro_egipcio_oficial: D(BovinoEpico, { especie: 'toro', alto: 470, izq: 300, der: 300 }),
  perro_egipcio_oficial: D(CanidoEpico, { especie: 'perro', color: '#C9A06A', alto: 340, izq: 220, der: 200 }),
  buey_egipcio_oficial: D(BovinoEpico, { especie: 'buey', alto: 600, izq: 290, der: 300 }),
  caballo_egipcio_oficial: D(CaballoEpico, { especie: 'caballo', pose: 'paso', color: '#7A4A2A', alto: 560, izq: 260, der: 260 }),
  gacela_oficial: D(Gacela, {}),
  ganso_egipcio_oficial: D(GansoNilo, {}, 'GOOSE'),
  escorpion_egipcio_oficial: D(EscorpionEg, {}, 'SCORPION'),
  pez_egipcio_oficial: D(PezEg, {}),
  ojo_ra_oficial: D(OjoUdyat, { s: 0.6 }, 'EYE OF RA'),
};
export const NOMBRE_EN_EGIPCIO_OFICIAL: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_EGIPCIO_OFICIAL).filter(([, f]) => f.griego).map(([k, f]) => [k, f.griego as string]));
