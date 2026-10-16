// Diseños oficiales egipcios (2026-10-15), para los Shorts "Who is…?" y los episodios nuevos. Misma receta que los
// nórdicos oficiales (elencoNordico.tsx): el muñeco de siempre con piel de color, ropa simple y 2–3 señas que
// cualquiera reconoce, según la iconografía de los templos y papiros (no la de las películas).
// Las cabezas de animal se dibujan aquí enteras (prop cabezaPropia): peluca tripartita, cuello y cabeza de perfil
// con el ojo cerca de (18,-6), igual que la cabeza humana. Los egipcios viejos de elenco.tsx quedan intactos.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, type P, type PersonajeProps } from '../comun/vasija';
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

// ---------- fichas ----------
const h = (p: Partial<PersonajeProps>, griego: string): Ficha => ({ tipo: 'persona', p: { orejaSimple: true, piel: PIEL_H, tocado: null, peloCorto: true, collar: false, ropa: 'corta', ropaColor: LINO, ribete: ORO, ...p }, griego });
const m = (p: Partial<PersonajeProps>, griego: string): Ficha => ({ tipo: 'persona', p: { mujer: true, orejaSimple: true, piel: PIEL_M, tocado: null, peloCorto: true, collar: false, ropa: 'larga', ribete: ORO, ...p }, griego });
const animal = (tipo: Animal, piel = PIEL_H, peluca = true) => <Cabeza tipo={tipo} piel={piel} peluca={peluca} />;
const BRAZO_VARA: [number, number] = [20, 60]; // mano adelante a media altura, vara vertical hasta el suelo

export const ELENCO_EGIPCIO_OFICIAL: Record<string, Ficha> = {
  ra_oficial: h({ s: 1.04, cabezaPropia: true, brazo: BRAZO_VARA, adornos: { cabeza: <>{animal('halcon')}<DiscoSolar /></>, cuerpo: <><Usekh bandas={[ROJO, ORO, AZUL, ORO]} /><Delantal c1={ORO} c2={ROJO} /></>, mano: <Was /> } }, 'RA'),
  isis_oficial: m({ ropaColor: ROJO, alas: true, brazo: [38, 4], brazoAtras: [48, -8], adornos: { cabeza: <><PelucaDiosa /><Trono /></>, cuerpo: <><Vestido c={ROJO} /><Usekh a={0.92} /></> } }, 'ISIS'),
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
};
export const NOMBRE_EN_EGIPCIO_OFICIAL: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_EGIPCIO_OFICIAL).map(([k, f]) => [k, f.griego as string]));
