// Diseños oficiales de los personajes secundarios nórdicos (2026-10-17): héroes de las sagas, reyes, enanos,
// gigantes, extras de aldea (con variantes para que los grupos no salgan clonados) y animales.
// Misma receta que los dioses aprobados de elencoNordico.tsx: el muñeco de siempre, piel de color natural, ropa
// simple en capas (túnica + pantalón y botas en los hombres; vestido con delantal y broches en las mujeres) y la
// identidad en la silueta + 2–3 señas clásicas (Sigurd = Gram y escudo con dragón; Sigyn = el cuenco; Rán = la red).
// Las claves viejas (vikingo, enano, jotun, caballo…) de elenco.tsx quedan intactas; estas terminan en _oficial.
// Los extras y animales llevan "_nordico/_nordica" en la clave para no chocar con las otras series.
// Coordenadas: cuerpo con origen en los pies (hombros y≈-300, cintura -210); cabeza con el ojo en (18,-6);
// mano = origen en la mano (el objeto queda derecho). Animales: origen en el piso, mirando a la derecha.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, miembro, type P, type PersonajeProps } from '../comun/vasija';
import type { DibujoProps } from './elencoAzteca';
import type { Ficha } from './elenco';
import {
  BarbaThor, Camisa, CapaLarga, EnCabeza, MelenaLarga, CapPelo, BarbaCorta, Delantal,
  EspadaNordica, YelmoSimple, Pescado, Cuervo,
} from './elencoNordico';

const N = '#132233'; // contorno (el negro del tema runas)
const NEGRO = '#140A04';
const ORO = '#E9C46A', CREMA = '#EAF3F9', BLANCO = '#FFFFFF', HIERRO = '#8D99A6', HIERRO_L = '#C9D2DA';
const CUERO = '#6B4A2E', MADERA = '#7A5232';
const ROJO = '#A8322B', AZUL = '#2F5D80', VERDE = '#4E6E3A';
const r1 = (v: number) => v.toFixed(1);

// Pieles naturales (las mismas de los dioses aprobados) y pelos.
const PIEL = ['#E0A27A', '#D9AE8C', '#E2B48E', '#ECC3A0', '#E8BE9C', '#DDA27C', '#F0CDA8', '#E6B892', '#E4AE86', '#D29A72', '#F0CBA6'];
const RUBIO = ['#E2C27A', '#FFF0B8'] as const, TRIGO = ['#D9A441', '#F2CF7A'] as const, COBRE = ['#B5652A', '#E0904F'] as const;
const ROJIZO = ['#C2462A', '#E0703F'] as const, CASTANO = ['#7A5230', '#B58A5A'] as const, OSCURO = ['#3A2A20', '#7A6450'] as const;
const NEGRO_P = ['#17181C', '#5A626E'] as const, GRIS_P = ['#9EA4AA', '#D5DCE2'] as const, BLANCO_P = ['#E6E8EA', '#FFFFFF'] as const;
type Pelo = readonly [string, string];

// ---------- cabeza (coordenadas de la cabeza) ----------
/** Corona nórdica: aro de oro con tres puntas bajas y piedras. */
const Corona: React.FC<{ c?: string; piedra?: string }> = ({ c = ORO, piedra = ROJO }) => (
  <g>
    <path d="M-35 -20 C -20 -29, 8 -34, 27 -28 L 25 -40 L 18 -54 L 11 -41 L 2 -58 L -7 -40 L -17 -55 L -24 -37 C -30 -35, -34 -33, -36 -31 Z" fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
    {[[-17, -30], [2, -33], [18, -33]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.4} fill={i === 1 ? '#2F6B8A' : piedra} stroke={N} strokeWidth={1} />)}
  </g>
);
/** Diadema fina (princesas y valquirias jóvenes). */
const Diadema: React.FC<{ c?: string }> = ({ c = ORO }) => <path d="M-34 -18 C -20 -28, 8 -34, 26 -28" stroke={c} strokeWidth={5} fill="none" strokeLinecap="round" />;
/** Yelmo de valquiria: el yelmo redondo con dos alas blancas a los costados. */
const YelmoAlado: React.FC<{ c?: string }> = ({ c = BLANCO }) => {
  const f = useCurrentFrame(), a = Math.sin(f / 14) * 2;
  return (
    <g>
      <g transform={`rotate(${a} -10 -34)`}>
        <path d="M-8 -36 C -16 -66, -38 -86, -66 -92 C -58 -78, -60 -70, -64 -62 C -52 -62, -44 -56, -42 -48 C -32 -50, -22 -44, -14 -30 Z" fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
        <path d="M-14 -44 C -26 -60, -40 -72, -56 -80 M-18 -38 C -30 -50, -40 -56, -50 -58" stroke="#B9C4CE" strokeWidth={1.6} fill="none" />
      </g>
      <YelmoSimple />
    </g>
  );
};
/** Capucha de viajero o de enano (punta = la caída larga y en punta de los enanos). Tapa el pelo y la nuca. */
const Capucha: React.FC<{ c: string; luz?: string; punta?: boolean }> = ({ c, luz = '#00000022', punta }) => (
  <g>
    {punta && <path d="M-20 -46 C -44 -56, -64 -52, -80 -34 C -66 -36, -56 -30, -46 -18 Z" fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />}
    <path d={suave([[27, -22], [20, -40], [0, -51], [-24, -47], [-42, -28], [-48, 4], [-46, 36], [-34, 56], [-14, 58], [-18, 40], [-18, 18], [-14, 0], [-8, -16], [8, -28]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <path d="M24 -24 C 6 -34, -10 -28, -15 -2 C -19 18, -20 34, -16 56" stroke={luz} strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M-30 -36 C -40 -10, -40 20, -32 46" stroke="#00000030" strokeWidth={1.6} fill="none" />
  </g>
);
/** Parche del ojo sin la tira larga (va debajo de una capucha). */
const ParcheCorto: React.FC = () => (
  <g>
    <path d="M-6 -15 L 9 -12" stroke={NEGRO} strokeWidth={3} strokeLinecap="round" />
    <path d="M8 -14 Q 18 -19 29 -12 Q 28 1 18 4 Q 8 1 8 -14 Z" fill={NEGRO} stroke={N} strokeWidth={1.2} />
  </g>
);
/** Gorro de lana (pescadores y campesinos). */
const Gorro: React.FC<{ c: string }> = ({ c }) => (
  <g>
    <path d="M-36 -14 C -38 -40, -18 -54, 4 -52 C 22 -50, 30 -38, 28 -24 C 8 -30, -16 -26, -36 -14 Z" fill={c} stroke={N} strokeWidth={2} />
    <path d="M-36 -14 C -16 -26, 8 -30, 28 -24" stroke="#00000040" strokeWidth={6} fill="none" />
    <path d="M-36 -14 C -16 -26, 8 -30, 28 -24" stroke={N} strokeWidth={1.4} fill="none" />
  </g>
);
/** Pañuelo de color (casadas, criadas): como el de Frigg pero del color que se pida. */
const Velo: React.FC<{ c: string; banda?: string; largo?: number }> = ({ c, banda = ORO, largo = 70 }) => (
  <g>
    <path d={suave([[26, -24], [18, -40], [-4, -46], [-28, -38], [-40, -12], [-44, 30], [-42, largo], [-22, largo - 6], [-18, 30], [-14, 6], [-4, -12], [8, -22]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} />
    <path d="M24 -26 C 10 -30, -10 -26, -26 -12" stroke={banda} strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d={`M-30 0 Q -36 30 -34 ${largo - 10}`} stroke="#00000026" strokeWidth={1.6} fill="none" />
  </g>
);
/** Rodete en la nuca (mujeres de aldea, criadas). */
const Rodete: React.FC<{ c: string; luz: string }> = ({ c, luz }) => (
  <g><circle cx={-36} cy={-16} r={14} fill={c} stroke={N} strokeWidth={2} /><path d="M-44 -20 Q -36 -30 -28 -18" stroke={luz} strokeWidth={1.8} fill="none" /></g>
);
/** Barba larga hasta la cintura (enanos, ancianos, reyes viejos). */
const BarbaLarga: React.FC<{ c: string; luz: string; largo?: number }> = ({ c, luz, largo = 1 }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 18) * 2;
  const L = (y: number) => 22 + (y - 22) * largo;
  return (
    <g>
      <path d={suave([[-4, 12], [12, 14], [26, 22], [38, 26], [42, L(52)], [36, L(90)], [24 + o, L(128)], [12, L(108)], [2, L(80)], [-8, L(46)], [-12, 22]], true, 0.75)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M22 18 C 30 15, 38 19, 42 27 C 34 25, 28 25, 22 25 Z" fill={c} stroke={N} strokeWidth={1.6} />
      {[[4, 28, 10, L(70)], [16, 32, 22, L(100)], [28, 34, 30, L(76)]].map(([a, b, c2, d], i) => <path key={i} d={`M${a} ${b} Q ${a + 5} ${(b + d) / 2} ${c2} ${d}`} stroke={luz} strokeWidth={1.8} fill="none" strokeLinecap="round" />)}
    </g>
  );
};
/** Calva con corona de pelo en la nuca (ancianos). */
const Calva: React.FC<{ c: string; luz: string }> = ({ c, luz }) => (
  <g>
    <path d={suave([[-14, -30], [-30, -24], [-37, -2], [-33, 24], [-22, 30], [-17, 12], [-16, -6], [-12, -20]], true, 0.9)} fill={c} stroke={N} strokeWidth={2} />
    <path d="M-28 -16 Q -32 4 -26 22" stroke={luz} strokeWidth={1.6} fill="none" />
  </g>
);
/** Bigote solo (jóvenes con un poco de barba). */
const Bigote: React.FC<{ c: string }> = ({ c }) => <path d="M24 18.5 C 30 15.5, 37 18, 40 24 C 34 22, 28 22.5, 24 23 Z" fill={c} stroke={N} strokeWidth={1.3} />;
/** Trenza larga que cae por la espalda (va en `detras`, con EnCabeza). */
const Trenza: React.FC<{ c: string; luz: string; largo?: number; ata?: string }> = ({ c, luz, largo = 150, ata = ROJO }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 18) * 3;
  const n = Math.round(largo / 16);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const t = i / n, x = -40 - t * 12 + Math.sin(t * 3) * 3 + o * t, y = 14 + t * largo;
        return <ellipse key={i} cx={r1(x)} cy={r1(y)} rx={r1(11 - t * 4)} ry={10} fill={c} stroke={N} strokeWidth={1.6} transform={`rotate(${i % 2 ? 18 : -18} ${r1(x)} ${r1(y)})`} />;
      })}
      {Array.from({ length: n }, (_, i) => { const t = i / n, x = -40 - t * 12 + Math.sin(t * 3) * 3 + o * t, y = 14 + t * largo; return <path key={i} d={`M${r1(x - 4)} ${r1(y - 2)} q 4 -3 8 0`} stroke={luz} strokeWidth={1.4} fill="none" />; })}
      <rect x={r1(-52 + o - 7)} y={r1(14 + largo - 6)} width={14} height={8} rx={2} fill={ata} stroke={N} strokeWidth={1.2} />
      <path d={`M${r1(-52 + o - 4)} ${r1(14 + largo + 2)} l -2 14 M${r1(-52 + o + 3)} ${r1(14 + largo + 2)} l 2 12`} stroke={c} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};
/** Melena corta hasta los hombros (va en `detras`, con EnCabeza). */
const MelenaCorta: React.FC<{ c: string; luz: string }> = ({ c, luz }) => <MelenaLarga c={c} luz={luz} largo={58} ancho={0.85} />;

// ---------- cuerpo (coordenadas del cuerpo) ----------
/** Cinturón de cuero con hebilla. a = ancho del cuerpo. */
const Cinto: React.FC<{ a: number; c?: string; hebilla?: string }> = ({ a, c = '#3A2A20', hebilla = ORO }) => (
  <g>
    <path d={`M${r1(-31 * a)} -219 L ${r1(28 * a)} -221 L ${r1(28 * a)} -208 L ${r1(-31 * a)} -206 Z`} fill={c} stroke={N} strokeWidth={1.6} />
    <rect x={r1(18 * a)} y={-223} width={12} height={16} rx={2} fill={hebilla} stroke={N} strokeWidth={1.4} />
  </g>
);
/** Cota de malla sobre la túnica (guerreros): hasta medio muslo, con anillas y borde. */
const Malla: React.FC<{ a?: number; c?: string }> = ({ a = 1, c = HIERRO }) => {
  const pts: P[] = [[-34 * a, -306], [-8 * a, -309], [22 * a, -308], [39 * a, -300], [37 * a, -278], [31 * a, -240], [33 * a, -170], [-36 * a, -168], [-35 * a, -240], [-37 * a, -282]];
  const id = `malla${Math.round(a * 100)}${c.replace('#', '')}`;
  return (
    <g>
      <defs><clipPath id={id}><path d={suave(pts, true, 0.45)} /></clipPath></defs>
      <path d={suave(pts, true, 0.45)} fill={c} stroke={N} strokeWidth={2} />
      <g clipPath={`url(#${id})`}>{Array.from({ length: 14 }, (_, fila) => Array.from({ length: 11 }, (_, i) => <path key={`${fila}-${i}`} d={`M${r1(-44 * a + i * 9 * a + (fila % 2) * 4.5 * a)} ${-306 + fila * 10} q ${r1(4.5 * a)} 7 ${r1(9 * a)} 0`} stroke="#5E6A76" strokeWidth={1.2} fill="none" />))}</g>
      <path d={`M${r1(-36 * a)} -170 L ${r1(33 * a)} -172`} stroke={HIERRO_L} strokeWidth={4} />
      <path d={suave([[-14 * a, -306], [6 * a, -292], [22 * a, -306]])} stroke={HIERRO_L} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Piel de oso o de lobo sobre los hombros (bersérkers, gigantes, cazadores). */
const Pelliza: React.FC<{ a: number; c?: string; luz?: string }> = ({ a, c = '#6B4A2E', luz = '#9A7450' }) => (
  <g>
    <path d={suave([[-40 * a, -296], [-20 * a, -316], [10 * a, -318], [36 * a, -302], [32 * a, -276], [18 * a, -284], [0, -278], [-20 * a, -280], [-42 * a, -266]], true, 0.6)} fill={c} stroke={N} strokeWidth={2} />
    {Array.from({ length: 7 }, (_, i) => { const x = -36 * a + i * 10 * a; return <path key={i} d={`M${r1(x)} ${r1(-284 + Math.sin(i) * 3)} l 3 ${8 + (i % 2) * 4}`} stroke={luz} strokeWidth={2.2} strokeLinecap="round" />; })}
  </g>
);
/** Delantal de cuero de herrero (Regin, Völund, enanos herreros). */
const DelantalCuero: React.FC<{ a?: number; c?: string }> = ({ a = 1, c = '#5A3A22' }) => (
  <g>
    <path d={suave([[-6 * a, -292], [24 * a, -292], [30 * a, -230], [34 * a, -150], [-24 * a, -146], [-20 * a, -230]], true, 0.5)} fill={c} stroke={N} strokeWidth={2} />
    <path d={`M${r1(-6 * a)} -292 L ${r1(-14 * a)} -306 M${r1(24 * a)} -292 L ${r1(20 * a)} -306`} stroke={c} strokeWidth={4} strokeLinecap="round" />
    <path d={`M${r1(-20 * a)} -222 L ${r1(32 * a)} -222`} stroke="#3A2A20" strokeWidth={4} />
    <path d={`M${r1(0)} -190 q ${r1(10 * a)} 6 ${r1(20 * a)} 0`} stroke="#00000040" strokeWidth={2} fill="none" />
  </g>
);
/** Torques de oro al cuello (reyes y jefes). */
const Torques: React.FC = () => <path d="M-12 -302 C -4 -290, 14 -288, 26 -298" stroke={ORO} strokeWidth={6} fill="none" strokeLinecap="round" />;
/** Collar de cuentas suelto (mujeres sin delantal). */
const Cuentas: React.FC<{ cs?: string[] }> = ({ cs = ['#C9A14A', '#2F6B8A', '#B8452C'] }) => <g>{Array.from({ length: 7 }, (_, i) => { const t = i / 6; return <circle key={i} cx={r1(-12 + t * 34)} cy={r1(-292 + Math.sin(t * Math.PI) * 12)} r={3} fill={cs[i % cs.length]} stroke={N} strokeWidth={1} />; })}</g>;
/** Esquís de madera colgados a la espalda (Skadi). */
const Esquis: React.FC = () => (
  <g transform="translate(-40 -150) rotate(-8)">
    {[0, 12].map((dx) => <g key={dx}><path d={`M${dx} 120 L ${dx} -200 Q ${dx} -222 ${dx + 14} -226`} stroke={N} strokeWidth={11} fill="none" strokeLinecap="round" /><path d={`M${dx} 120 L ${dx} -200 Q ${dx} -222 ${dx + 14} -226`} stroke="#A8784A" strokeWidth={7} fill="none" strokeLinecap="round" /></g>)}
    <path d="M-6 -40 H 20 M-6 40 H 20" stroke={CUERO} strokeWidth={5} />
  </g>
);
/** Carcaj con flechas a la espalda (Orvar-Odd, Skadi). */
const Carcaj: React.FC<{ c?: string; pluma?: string }> = ({ c = CUERO, pluma = ROJO }) => (
  <g transform="translate(-30 -250) rotate(-20)">
    {[-8, 0, 8].map((dx, i) => <g key={i}><path d={`M${dx} -60 V -20`} stroke={MADERA} strokeWidth={2.4} /><path d={`M${dx} -62 l -5 -14 l 5 4 l 5 -4 Z`} fill={pluma} stroke={N} strokeWidth={1.2} /></g>)}
    <rect x={-14} y={-24} width={28} height={92} rx={8} fill={c} stroke={N} strokeWidth={2} />
    <path d="M-14 -10 H 14 M-14 50 H 14" stroke="#3A2A20" strokeWidth={3} />
  </g>
);

// ---------- en la mano (origen = mano; el objeto queda derecho) ----------
/** Hacha de barba (hoja que cae hacia abajo, como las vikingas). */
const Hacha: React.FC<{ hoja?: string }> = ({ hoja = '#D6DDE3' }) => (
  <g>
    <path d="M0 50 L 0 -120" stroke={N} strokeWidth={9} strokeLinecap="round" /><path d="M0 50 L 0 -120" stroke={MADERA} strokeWidth={5.5} strokeLinecap="round" />
    <path d="M2 -118 C 18 -122, 30 -124, 40 -132 C 46 -112, 44 -86, 38 -66 C 30 -80, 18 -94, 2 -96 Z" fill={hoja} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M36 -126 C 41 -110, 40 -90, 36 -74" stroke={BLANCO} strokeWidth={2} fill="none" />
  </g>
);
/** Lanza de fresno con punta de hoja. */
const Lanza: React.FC<{ largo?: number; punta?: string }> = ({ largo = 230, punta = '#D6DDE3' }) => (
  <g>
    <path d={`M0 70 L 0 ${-largo}`} stroke={N} strokeWidth={8} strokeLinecap="round" /><path d={`M0 70 L 0 ${-largo}`} stroke={MADERA} strokeWidth={4.5} strokeLinecap="round" />
    <path d={`M0 ${-largo - 46} C 9 ${-largo - 26}, 9 ${-largo - 10}, 0 ${-largo + 2} C -9 ${-largo - 10}, -9 ${-largo - 26}, 0 ${-largo - 46} Z`} fill={punta} stroke={N} strokeWidth={2} />
    <path d={`M0 ${-largo - 40} V ${-largo - 4}`} stroke="#9AA7B2" strokeWidth={1.4} />
  </g>
);
/** Escudo redondo en la mano de atrás (se mueve con el brazo). Dibujo: cuartos, mitades, cruz o dragón. */
const Escudo: React.FC<{ c1: string; c2: string; dibujo?: 'cuartos' | 'mitad' | 'liso' | 'dragon'; r?: number }> = ({ c1, c2, dibujo = 'cuartos', r = 54 }) => (
  <g transform="translate(-6 -4)">
    <circle r={r} fill={c2} stroke={N} strokeWidth={3} />
    {dibujo === 'cuartos' && [0, 1, 2, 3].map((i) => <path key={i} d={`M0 0 L ${r1(Math.cos((i * Math.PI) / 2) * (r - 2))} ${r1(Math.sin((i * Math.PI) / 2) * (r - 2))} A ${r - 2} ${r - 2} 0 0 1 ${r1(Math.cos(((i + 0.5) * Math.PI) / 2) * (r - 2))} ${r1(Math.sin(((i + 0.5) * Math.PI) / 2) * (r - 2))} Z`} fill={c1} />)}
    {dibujo === 'mitad' && <path d={`M0 ${-r + 2} A ${r - 2} ${r - 2} 0 0 0 0 ${r - 2} Z`} fill={c1} />}
    {dibujo === 'dragon' && <path d="M-30 18 C -20 -10, 0 -30, 22 -28 C 34 -26, 36 -12, 26 -6 C 14 0, 6 -10, 14 -16 M22 -28 l 10 -10 M-30 18 C -24 26, -14 28, -6 22" stroke={c1} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    <circle r={r} fill="none" stroke={HIERRO} strokeWidth={4} /><circle r={r} fill="none" stroke={N} strokeWidth={1.6} />
    <circle r={13} fill={HIERRO} stroke={N} strokeWidth={2} /><circle cx={-3} cy={-4} r={4} fill={HIERRO_L} />
  </g>
);
/** Martillo de herrero. */
const Martillo: React.FC = () => (
  <g>
    <path d="M0 40 L 0 -84" stroke={N} strokeWidth={8} strokeLinecap="round" /><path d="M0 40 L 0 -84" stroke={MADERA} strokeWidth={4.5} strokeLinecap="round" />
    <rect x={-24} y={-104} width={44} height={24} rx={4} fill="#5E6A76" stroke={N} strokeWidth={2} />
    <path d="M-20 -100 H 16" stroke={HIERRO_L} strokeWidth={2} />
  </g>
);
/** Tenazas (mano de atrás de los herreros). */
const Tenazas: React.FC = () => (
  <g>
    <path d="M-3 30 L 4 -60 M4 30 L -2 -60" stroke="#4E5A66" strokeWidth={4.5} strokeLinecap="round" />
    <path d="M4 -60 q 10 -10 2 -22 M-2 -60 q -10 -10 -2 -22" stroke="#4E5A66" strokeWidth={4.5} fill="none" strokeLinecap="round" />
  </g>
);
/** Cuerno de beber con aro de oro (reyes, gigantes y el hidromiel). */
const CuernoBeber: React.FC<{ lleno?: boolean }> = ({ lleno }) => (
  <g transform="rotate(-18)">
    <path d="M-6 6 C -10 -20, 4 -48, 30 -62 L 38 -48 C 20 -38, 10 -18, 8 6 Z" fill="#EFE6CF" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <ellipse cx={34} cy={-55} rx={5} ry={9} transform="rotate(-30 34 -55)" fill={lleno ? '#C98A2E' : '#3A2A20'} stroke={N} strokeWidth={1.6} />
    <path d="M-7 -2 L 9 -2 M 26 -54 L 36 -46" stroke={ORO} strokeWidth={5} strokeLinecap="round" />
    <circle cx={-1} cy={10} r={4} fill={ORO} stroke={N} strokeWidth={1.2} />
  </g>
);
/** Cuenco de madera (Sigyn junta el veneno: se lleva sostenido hacia arriba). */
const Cuenco: React.FC = () => (
  <g transform="translate(6 -10)">
    <path d="M-30 -8 C -28 16, 28 16, 30 -8 Z" fill="#A8784A" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <ellipse cx={0} cy={-8} rx={30} ry={7} fill="#7A5232" stroke={N} strokeWidth={2} />
    <ellipse cx={0} cy={-7} rx={24} ry={4.5} fill="#8FB070" opacity={0.9} />
    <path d="M-18 2 q 18 8 36 0" stroke="#C9A06A" strokeWidth={1.6} fill="none" />
  </g>
);
/** Red de Rán (cuelga de la mano, con flotadores). */
const RedRan: React.FC = () => {
  const f = useCurrentFrame(), g = Math.sin(f / 12) * 4;
  const pts: P[] = [[-4, 0], [28, 4], [44 + g, 70], [40 + g, 130], [-10 + g, 136], [-24, 70]];
  return (
    <g>
      <defs><clipPath id="redRan"><path d={suave(pts, true, 0.6)} /></clipPath></defs>
      <path d={suave(pts, true, 0.6)} fill="#2F7A86" opacity={0.25} stroke="#CDBF9C" strokeWidth={2.4} />
      <g clipPath="url(#redRan)">{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-40 + i * 10} -10 l 50 160 M${30 + i * 10 - 60} -10 l -50 160`} stroke="#CDBF9C" strokeWidth={1.6} />)}</g>
      {[[0, 0], [26, 4]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} fill="#E9D9A6" stroke={N} strokeWidth={1.2} />)}
      {[[-8 + g, 132], [14 + g, 136], [36 + g, 130]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill={ORO} stroke={N} strokeWidth={1} />)}
    </g>
  );
};
/** Anillo de oro en alto (Andvaranaut). */
const Anillo: React.FC = () => {
  const f = useCurrentFrame(), b = 0.35 + Math.sin(f / 8) * 0.15;
  return (
    <g transform="translate(4 -22)">
      <circle r={22} fill="#FFF3C4" opacity={b} />
      <circle r={11} fill="none" stroke={N} strokeWidth={8} /><circle r={11} fill="none" stroke={ORO} strokeWidth={5} />
      <circle cx={-4} cy={-9} r={2} fill={BLANCO} />
    </g>
  );
};
/** Arco largo (sostenido por el medio, cuerda hacia el cuerpo). */
const Arco: React.FC<{ c?: string }> = ({ c = '#8A5A30' }) => (
  <g>
    <path d="M-4 -120 C 40 -70, 40 70, -4 120" stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d="M-4 -120 C 40 -70, 40 70, -4 120" stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M-4 -120 L -4 120" stroke={CREMA} strokeWidth={1.6} />
    <rect x={20} y={-10} width={10} height={20} rx={3} fill={CUERO} stroke={N} strokeWidth={1.2} />
  </g>
);
/** Bastón de caminante. */
const Baston: React.FC<{ alto?: number; c?: string }> = ({ alto = 150, c = MADERA }) => (
  <g>
    <path d={`M0 ${alto * 0.55} L 0 ${-alto * 0.45}`} stroke={N} strokeWidth={9} strokeLinecap="round" />
    <path d={`M0 ${alto * 0.55} L 0 ${-alto * 0.45}`} stroke={c} strokeWidth={5.5} strokeLinecap="round" />
    <path d={`M0 ${-alto * 0.45} q 0 -14 12 -16`} stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d={`M0 ${-alto * 0.45} q 0 -14 12 -16`} stroke={c} strokeWidth={5.5} fill="none" strokeLinecap="round" />
  </g>
);
/** Ramita de muérdago (Höðr): tallo verde, hojas y bayas blancas. */
const Muerdago: React.FC = () => (
  <g transform="rotate(-30)">
    <path d="M0 20 L 0 -86" stroke="#5E7A3A" strokeWidth={4} strokeLinecap="round" />
    {[[-1, -40, -30], [1, -56, 30], [-1, -72, -36], [1, -86, 28]].map(([sx, y, a], i) => <ellipse key={i} cx={sx * 10} cy={y} rx={5} ry={13} transform={`rotate(${a} ${sx * 10} ${y})`} fill="#8DB05A" stroke={N} strokeWidth={1.2} />)}
    {[[4, -48], [-4, -64], [3, -80], [-2, -92]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.6} fill={BLANCO} stroke={N} strokeWidth={1} />)}
  </g>
);
/** Lira de los escaldos (marco redondeado de madera con cuerdas). */
const Lira: React.FC = () => (
  <g transform="translate(10 -46) rotate(10)">
    <path d="M-20 44 L -24 -30 C -24 -50, 24 -50, 24 -30 L 20 44 Z" fill="#A8784A" stroke={N} strokeWidth={2.2} />
    <path d="M-14 -20 C -12 -34, 12 -34, 14 -20 L 12 30 L -12 30 Z" fill="#3A2A20" stroke={N} strokeWidth={1.4} />
    {[-7, -2, 3, 8].map((x) => <path key={x} d={`M${x} -26 V 30`} stroke="#F2E6C8" strokeWidth={1.3} />)}
  </g>
);
/** Horquilla de madera (campesino). */
const Horquilla: React.FC = () => (
  <g>
    <path d="M0 70 L 0 -150" stroke={N} strokeWidth={8} strokeLinecap="round" /><path d="M0 70 L 0 -150" stroke="#A8784A" strokeWidth={4.5} strokeLinecap="round" />
    <path d="M0 -146 C -14 -150, -16 -170, -16 -196 M0 -150 V -200 M0 -146 C 14 -150, 16 -170, 16 -196" stroke={N} strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M0 -146 C -14 -150, -16 -170, -16 -196 M0 -150 V -200 M0 -146 C 14 -150, 16 -170, 16 -196" stroke="#A8784A" strokeWidth={3.5} fill="none" strokeLinecap="round" />
  </g>
);
/** Huso con hilo (las nornas hilan el destino). */
const Hilo: React.FC = () => {
  const f = useCurrentFrame(), g = Math.sin(f / 10) * 4;
  return (
    <g>
      <path d={`M0 -4 Q ${14 + g} 40 ${6 + g} 90`} stroke="#F2E6C8" strokeWidth={1.6} fill="none" />
      <g transform={`translate(${6 + g} 90)`}><path d="M0 -10 L 0 40" stroke={MADERA} strokeWidth={3} /><ellipse cx={0} cy={12} rx={8} ry={12} fill="#F2E6C8" stroke={N} strokeWidth={1.4} /><circle cx={0} cy={36} r={4.5} fill="#5A3A22" /></g>
      <ellipse cx={0} cy={-6} rx={9} ry={7} fill="#F2E6C8" stroke={N} strokeWidth={1.4} />
    </g>
  );
};
/** Tyrfing: la espada maldita que brilla como fuego (hoja dorada con resplandor). */
const Tyrfing: React.FC = () => <EspadaNordica hoja="#F6E2A0" brillo />;
/** Gram: la espada de Sigurd (hoja azulada que brilla). */
const Gram: React.FC = () => <EspadaNordica hoja="#D8E8F4" brillo ang={4} />;

// ---------- armado de fichas ----------
type PP = Partial<PersonajeProps>;
type Nodo = React.ReactNode;
type Base = {
  piel: string; pelo: Pelo; s?: number; gigante?: boolean; cuerpo?: PP['cuerpo']; brazo?: [number, number]; brazoAtras?: [number, number];
  capa?: string; forro?: string; capaCorta?: boolean; capaBorde?: string;
  detras?: Nodo; cabeza?: Nodo; cuerpoX?: Nodo; mano?: Nodo; manoAtras?: Nodo; ojosCerrados?: boolean;
};
type Hombre = Base & {
  barba?: 'no' | 'bigote' | 'corta' | 'media' | 'tupida' | 'larga'; barbaPelo?: Pelo;
  peinado?: 'corto' | 'melena' | 'calvo' | 'nada' | 'flequillo';
  tunica: string; borde?: string; ribete?: string; pantalon?: string; botas?: string; larga?: boolean;
  malla?: boolean; pelliza?: string; cinto?: boolean;
};
type Mujer = Base & { peinado?: 'trenza' | 'suelto' | 'rodete' | 'corto' | 'nada'; vestido: string; pantalon?: string; botas?: string; blusa?: string; borde?: string; ribete?: string; delantal?: string | null; cuentas?: boolean };

/** Ancho del cuerpo (el mismo que usa el muñeco). */
const anchoDe = (b: { gigante?: boolean; cuerpo?: PP['cuerpo'] }, mujer = false) => b.gigante ? 1.35 : b.cuerpo === 'gordo' ? 1.3 : b.cuerpo === 'flaco' ? 0.8 : mujer ? 0.92 : 1;

const H = (b: Hombre, nombre: string): Ficha => {
  const a = anchoDe(b), [pc, pl] = b.pelo, [bc, bl] = b.barbaPelo ?? b.pelo, peinado = b.peinado ?? 'corto';
  const barba = { no: null, bigote: <Bigote c={bc} />, corta: <BarbaCorta c={bc} luz={bl} />, media: <BarbaCorta c={bc} luz={bl} largo={16} />, tupida: <BarbaThor c={bc} luz={bl} />, larga: <BarbaLarga c={bc} luz={bl} /> }[b.barba ?? 'corta'];
  const pelo = peinado === 'calvo' ? <Calva c={pc} luz={pl} /> : peinado === 'nada' ? null : <CapPelo c={pc} luz={pl} flequillo={peinado === 'flequillo'} />;
  const cuadrada = !b.gigante && b.cuerpo !== 'gordo' && b.cuerpo !== 'flaco' && b.cuerpo !== 'viejo';
  return {
    tipo: 'persona', griego: nombre,
    p: {
      orejaSimple: true, peloCorto: true, tocado: null, barba: false, piel: b.piel, pelo: pc, s: b.s, gigante: b.gigante, cuerpo: b.cuerpo,
      ropa: b.larga ? 'larga' : 'tunica', ropaColor: b.tunica, ribete: b.ribete ?? ORO, pantalon: b.larga ? undefined : (b.pantalon ?? '#3A3F48'), botas: b.botas ?? '#3A2A20',
      brazo: b.brazo, brazoAtras: b.brazoAtras, ojosCerrados: b.ojosCerrados,
      adornos: {
        detras: <>{b.capa && <CapaLarga c={b.capa} forro={b.forro} borde={b.capaBorde ?? ORO} corta={b.capaCorta} />}{peinado === 'melena' && <EnCabeza a={a}><MelenaCorta c={pc} luz={pl} /></EnCabeza>}{b.detras}</>,
        cabeza: <>{pelo}{barba}{b.cabeza}</>,
        cuerpo: <><Camisa a={a} c={b.tunica} borde={b.borde ?? b.ribete ?? ORO} cuadrada={cuadrada} />{b.malla && <Malla a={a} />}{(b.cinto ?? !cuadrada) && <Cinto a={a} />}{b.pelliza && <Pelliza a={a} c={b.pelliza} />}{b.cuerpoX}</>,
        mano: b.mano, manoAtras: b.manoAtras,
      },
    },
  };
};
const M = (b: Mujer, nombre: string): Ficha => {
  const a = anchoDe(b, true), [pc, pl] = b.pelo, peinado = b.peinado ?? 'trenza';
  const ea = b.gigante ? 1.35 : 0.92;
  return {
    tipo: 'persona', griego: nombre,
    p: {
      mujer: true, orejaSimple: true, peloCorto: true, tocado: null, piel: b.piel, pelo: pc, s: b.s, gigante: b.gigante, cuerpo: b.cuerpo,
      ropa: b.pantalon ? 'tunica' : 'larga', ropaColor: b.vestido, ribete: b.ribete ?? ORO, pantalon: b.pantalon, botas: b.pantalon ? (b.botas ?? '#3A2A20') : undefined, brazo: b.brazo, brazoAtras: b.brazoAtras, ojosCerrados: b.ojosCerrados,
      adornos: {
        detras: <>{b.capa && <CapaLarga c={b.capa} forro={b.forro} borde={b.capaBorde ?? ORO} corta={b.capaCorta} />}{peinado === 'suelto' && <EnCabeza a={ea}><MelenaLarga c={pc} luz={pl} largo={120} /></EnCabeza>}{b.detras}</>,
        cabeza: <>{peinado === 'trenza' && <Trenza c={pc} luz={pl} largo={b.cuerpo === 'nino' ? 90 : 130} />}{peinado !== 'nada' && <CapPelo c={pc} luz={pl} />}{peinado === 'rodete' && <Rodete c={pc} luz={pl} />}{b.cabeza}</>,
        cuerpo: <><Camisa a={a} c={b.blusa ?? b.vestido} borde={b.borde ?? ORO} />{b.delantal !== null && <Delantal c={b.delantal ?? b.vestido} />}{b.cuentas && b.delantal === null && <Cuentas />}{b.cuerpoX}</>,
        mano: b.mano, manoAtras: b.manoAtras,
      },
    },
  };
};
const D = (Dibujo: React.FC<DibujoProps>, p: Record<string, unknown>, nombre: string): Ficha => ({ tipo: 'dibujo', Dibujo, p, griego: nombre });

// ---------- animales (origen en el piso, mirando a la derecha) ----------
/** Pata de animal: muslo, caña fina y pie (casco, pezuña partida o pata con dedos). lejos = la de atrás, más oscura. */
const Pata: React.FC<{ x: number; y: number; l: number; w: number; ang: number; c: string; lejos?: boolean; pie?: 'casco' | 'pezuna' | 'garra'; pieC?: string; atras?: boolean; unas?: boolean }> = ({ x, y, l, w, ang, c, lejos, pie = 'casco', pieC = '#2A2420', atras, unas }) => {
  const rad = (g: number) => (g * Math.PI) / 180;
  // atras = pata trasera: el corvejón dobla hacia atrás (la caña vuelve hacia adelante).
  const k: P = [x + Math.sin(rad(ang + (atras ? 8 : 0))) * l * 0.48, y + Math.cos(rad(ang)) * l * 0.48];
  const a2 = ang - (atras ? 16 : 0) - Math.max(0, -ang) * 0.5;
  const t: P = [k[0] + Math.sin(rad(a2)) * l * 0.44, k[1] + Math.cos(rad(a2)) * l * 0.44];
  const p: P = [t[0] + 2, t[1] + l * 0.08];
  const d = miembro([[x, y], k, t, p], [w, w * 0.62, w * 0.42, w * 0.4]);
  return (
    <g>
      <path d={d} fill={c} stroke={N} strokeWidth={2} />
      {lejos && <path d={d} fill={NEGRO} opacity={0.2} />}
      {pie === 'casco' && <path d={`M${r1(p[0] - w * 0.3)} ${r1(p[1] - w * 0.25)} L ${r1(p[0] + w * 0.34)} ${r1(p[1] - w * 0.25)} L ${r1(p[0] + w * 0.45)} ${r1(p[1] + 2)} L ${r1(p[0] - w * 0.36)} ${r1(p[1] + 2)} Z`} fill={pieC} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />}
      {pie === 'pezuna' && <path d={`M${r1(p[0] - w * 0.28)} ${r1(p[1] - w * 0.2)} L ${r1(p[0] + w * 0.3)} ${r1(p[1] - w * 0.2)} L ${r1(p[0] + w * 0.4)} ${r1(p[1] + 2)} L ${r1(p[0] - w * 0.3)} ${r1(p[1] + 2)} Z M${r1(p[0] + 0.03 * w)} ${r1(p[1] - w * 0.2)} V ${r1(p[1] + 2)}`} fill={pieC} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />}
      {pie === 'garra' && <g><ellipse cx={r1(p[0] + w * 0.25)} cy={r1(p[1] - 3)} rx={r1(w * 0.5)} ry={r1(w * 0.26)} fill={c} stroke={N} strokeWidth={1.6} />{lejos && <ellipse cx={r1(p[0] + w * 0.25)} cy={r1(p[1] - 3)} rx={r1(w * 0.5)} ry={r1(w * 0.26)} fill={NEGRO} opacity={0.2} />}{unas && [0, 1, 2].map((i) => <path key={i} d={`M${r1(p[0] + w * (0.45 + i * 0.12))} ${r1(p[1] - w * 0.22 + i * 6)} l ${r1(w * 0.2)} 3`} stroke={BLANCO} strokeWidth={3} strokeLinecap="round" />)}</g>}
    </g>
  );
};
const fasePatas = (f: number, moviendo?: boolean, corriendo?: boolean) => {
  const v = corriendo ? 0.38 : moviendo ? 0.2 : 0, amp = corriendo ? 30 : moviendo ? 18 : 0;
  return (ph: number) => Math.sin(f * v + ph) * amp;
};
const Envuelve: React.FC<{ x: number; y: number; s: number; voltear?: boolean; opacity?: number; bote?: number; children: Nodo }> = ({ x, y, s, voltear, opacity = 1, bote = 0, children }) => (
  <g transform={`translate(${x} ${y + bote}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>{children}</g>
);
/** Ojo de animal (blanco chico con pupila). */
const OjoA: React.FC<{ x: number; y: number; r?: number; iris?: string }> = ({ x, y, r = 4.5, iris = NEGRO }) => <g><circle cx={x} cy={y} r={r} fill={BLANCO} stroke={N} strokeWidth={1.2} /><circle cx={x + r * 0.25} cy={y} r={r * 0.55} fill={iris} /></g>;

/** Caballo nórdico (crin y cola largas; montura opcional). */
const Caballo: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity, moviendo, corriendo, f, color = '#8A5A3A', crin = '#3A2A20', montura, manta = ROJO, patasC, hocico }) => {
  const g = fasePatas(f, moviendo, corriendo), bote = corriendo ? -Math.abs(Math.sin(f * 0.38)) * 10 : 0;
  const c = color as string, cr = crin as string, pc = (patasC as string) ?? c;
  const cab = Math.sin(f / 20) * 2;
  return (
    <Envuelve x={x} y={y} s={s} voltear={voltear} opacity={opacity} bote={bote}>
      {/* cola */}
      <path transform="translate(0 22)" d={`M-114 -214 C -142 -196, ${-150 + g(0) * 0.2} -140, ${-136 + g(0) * 0.3} -84 C -124 -120, -118 -160, -104 -194 Z`} fill={cr} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      {/* patas de lejos */}
      <Pata x={-92} y={-150} l={150} w={34} ang={g(Math.PI)} c={pc} lejos atras />
      <Pata x={72} y={-150} l={150} w={28} ang={g(0)} c={pc} lejos />
      {/* cuerpo */}
      <path transform="translate(0 22)" d={suave([[-120, -204], [-92, -242], [0, -238], [70, -244], [112, -226], [122, -184], [94, -152], [0, -148], [-92, -150], [-124, -172]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.2} />
      <path transform="translate(0 22)" d="M-92 -228 C -40 -236, 20 -236, 70 -234" stroke="#FFFFFF33" strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* patas de cerca */}
      <Pata x={-64} y={-150} l={150} w={36} ang={g(0.2)} c={pc} atras />
      <Pata x={98} y={-150} l={150} w={30} ang={g(Math.PI + 0.2)} c={pc} />
      {/* montura */}
      {!!montura && <g transform="translate(0 22)"><path d="M-40 -240 C -40 -202, 30 -202, 30 -240 L 40 -180 L -48 -180 Z" fill={manta as string} stroke={N} strokeWidth={2} /><path d="M-48 -186 H 40" stroke={ORO} strokeWidth={4} /><path d="M-30 -242 C -24 -264, 18 -264, 22 -242 Z" fill={CUERO} stroke={N} strokeWidth={2} /><path d="M-4 -200 V -150" stroke={CUERO} strokeWidth={3} /><rect x={-10} y={-152} width={12} height={8} rx={2} fill={HIERRO} stroke={N} strokeWidth={1.2} /></g>}
      {/* cuello y cabeza */}
      <g transform={`translate(0 22) rotate(${cab} 100 -230)`}>
        <path d={suave([[66, -238], [92, -300], [126, -340], [160, -336], [202, -282], [212, -258], [194, -246], [162, -264], [134, -246], [118, -200]], true, 0.75)} fill={c} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
        {!!hocico && <path d="M194 -248 C 204 -252, 212 -258, 210 -268 L 200 -282 C 198 -266, 190 -256, 184 -254 Z" fill={hocico as string} />}
        <path d="M132 -338 L 138 -366 L 150 -338 Z" fill={c} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <path d={`M72 -240 C 82 -284, 100 -324, 134 -346 C 128 -326, 118 -302, ${106 + cab} -272 C 98 -252, 90 -242, 72 -240 Z`} fill={cr} stroke={N} strokeWidth={1.8} />
        <path d="M126 -346 C 134 -334, 146 -330, 154 -334" stroke={cr} strokeWidth={9} strokeLinecap="round" />
        <OjoA x={166} y={-308} r={5} />
        <ellipse cx={203} cy={-262} rx={3.2} ry={2.4} fill={N} />
        <path d="M196 -250 Q 204 -248 210 -252" stroke={N} strokeWidth={1.4} fill="none" />
        {!!montura && <path d="M152 -322 L 190 -258 M142 -302 C 162 -292, 184 -272, 200 -262 M152 -322 C 140 -300, 120 -262, 40 -240" stroke={manta as string} strokeWidth={3.5} fill="none" />}
      </g>
    </Envuelve>
  );
};
/** Lobo (gris, cola tupida). Fenrir = el mismo, enorme y más oscuro. */
const Lobo: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity, moviendo, corriendo, boca, f, color = '#7E8790', panza = '#C9CED3', ojo = '#E9C46A' }) => {
  const g = fasePatas(f, moviendo, corriendo), bote = corriendo ? -Math.abs(Math.sin(f * 0.38)) * 8 : 0, c = color as string;
  const cola = Math.sin(f / 12) * 6;
  return (
    <Envuelve x={x} y={y} s={s} voltear={voltear} opacity={opacity} bote={bote}>
      <path transform="translate(0 14)" d={`M-88 -132 C -124 -128, -142 ${-100 + cola}, -146 ${-66 + cola} C -128 -78, -112 -96, -88 -108 Z`} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path transform="translate(0 14)" d={`M-140 ${-72 + cola} C -134 -84, -126 -94, -112 -100`} stroke={panza as string} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Pata x={-70} y={-96} l={96} w={26} ang={g(Math.PI)} c={c} lejos atras pie="garra" />
      <Pata x={50} y={-96} l={96} w={22} ang={g(0)} c={c} lejos pie="garra" />
      <path transform="translate(0 14)" d={suave([[-96, -128], [-60, -152], [10, -150], [66, -160], [100, -138], [92, -100], [50, -90], [-20, -94], [-84, -98]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.2} />
      <path transform="translate(0 14)" d={suave([[-60, -98], [0, -92], [52, -94]])} stroke={panza as string} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path transform="translate(0 14)" d="M60 -156 C 74 -150, 90 -132, 92 -110" stroke={panza as string} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} />
      <Pata x={-46} y={-96} l={96} w={28} ang={g(0.3)} c={c} atras pie="garra" />
      <Pata x={72} y={-96} l={96} w={24} ang={g(Math.PI + 0.3)} c={c} pie="garra" />
      {/* cabeza */}
      <g transform="translate(98 -138)">
        <path d="M-14 -16 L -8 -48 L 6 -20 Z M2 -20 L 12 -50 L 20 -18 Z" fill={c} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M-6 -24 L -4 -38 L 2 -24 Z" fill="#D9A3A0" />
        <path d={suave([[-24, 0], [-16, -20], [8, -26], [26, -16], [58, -6], [62, 4], [40, 10], [12, 18], [-12, 16]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} />
        <path d="M12 16 C 26 14, 40 10, 54 6" stroke={panza as string} strokeWidth={6} fill="none" strokeLinecap="round" />
        {!!boca && <path d="M30 8 L 60 4 L 36 22 Z" fill="#8A2A2A" stroke={N} strokeWidth={1.4} />}
        <ellipse cx={60} cy={-2} rx={5} ry={4} fill={N} />
        <path d="M12 -12 Q 20 -17 29 -10 Q 20 -6 12 -12 Z" fill={ojo as string} stroke={N} strokeWidth={1.2} />
        <circle cx={21} cy={-11} r={2.4} fill={N} />
      </g>
    </Envuelve>
  );
};
/** Cabra (las de Thor: grises y blancas, cuernos curvos y barbita). */
const Cabra: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity, moviendo, corriendo, f, color = '#D8D4CC', manchas = '#8A8F96', cuernos = '#E9DCC0' }) => {
  const g = fasePatas(f, moviendo, corriendo), bote = corriendo ? -Math.abs(Math.sin(f * 0.38)) * 8 : 0, c = color as string;
  const cab = Math.sin(f / 16) * 3;
  return (
    <Envuelve x={x} y={y} s={s} voltear={voltear} opacity={opacity} bote={bote}>
      <path d="M-66 -124 l -18 -16 l 4 20 Z" fill={c} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
      <Pata x={-54} y={-92} l={92} w={22} ang={g(Math.PI)} c={c} lejos atras pie="pezuna" />
      <Pata x={34} y={-92} l={92} w={20} ang={g(0)} c={c} lejos pie="pezuna" />
      <path d={suave([[-70, -116], [-40, -138], [20, -136], [60, -128], [70, -98], [40, -82], [-30, -82], [-70, -94]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.2} />
      <path d="M-40 -132 C -30 -114, -10 -116, 0 -134 Z M10 -104 C 20 -94, 34 -96, 40 -108 Z" fill={manchas as string} opacity={0.85} />
      <Pata x={-34} y={-92} l={92} w={22} ang={g(0.3)} c={c} atras pie="pezuna" />
      <Pata x={54} y={-92} l={92} w={20} ang={g(Math.PI + 0.3)} c={c} pie="pezuna" />
      <g transform={`rotate(${cab} 56 -124)`}>
        <path d={suave([[42, -128], [58, -166], [80, -176], [106, -156], [110, -140], [92, -134], [72, -116], [56, -104]], true, 0.8)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
        <path d="M70 -176 C 58 -206, 28 -214, 14 -192 C 34 -196, 48 -188, 60 -170 Z" fill={cuernos as string} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M62 -174 l -6 -8 M50 -188 l -4 -8 M36 -196 l -2 -8" stroke="#B9AE98" strokeWidth={1.4} />
        <path d="M64 -164 L 48 -154 L 62 -152 Z" fill={c} stroke={N} strokeWidth={1.4} />
        <path d="M96 -134 C 96 -118, 92 -106, 86 -98 C 84 -112, 86 -124, 88 -134 Z" fill={manchas as string} stroke={N} strokeWidth={1.4} />
        <OjoA x={84} y={-158} r={4.5} iris="#3A2A20" />
        <ellipse cx={108} cy={-146} rx={2.6} ry={2.2} fill={N} />
      </g>
    </Envuelve>
  );
};
/** Ciervo con cornamenta. */
const Ciervo: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity, moviendo, corriendo, f, color = '#A8683A', panza = '#E6CDA6' }) => {
  const g = fasePatas(f, moviendo, corriendo), bote = corriendo ? -Math.abs(Math.sin(f * 0.38)) * 10 : 0, c = color as string;
  const cab = Math.sin(f / 18) * 2;
  const asta = 'M92 -252 C 90 -290, 74 -324, 46 -352 M84 -296 L 110 -316 M74 -318 L 86 -350 M60 -336 L 64 -366 M50 -346 L 26 -360 M88 -272 L 108 -284';
  return (
    <Envuelve x={x} y={y} s={s} voltear={voltear} opacity={opacity} bote={bote}>
      <path d="M-80 -176 l -14 -6 l 2 16 Z" fill={panza as string} stroke={N} strokeWidth={1.6} />
      <Pata x={-62} y={-140} l={140} w={24} ang={g(Math.PI)} c={c} lejos atras pie="pezuna" />
      <Pata x={46} y={-140} l={140} w={20} ang={g(0)} c={c} lejos pie="pezuna" />
      <path d={suave([[-82, -166], [-50, -192], [20, -190], [72, -184], [86, -152], [52, -130], [-30, -130], [-80, -142]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.2} />
      <path d={suave([[-60, -136], [0, -130], [50, -134]])} stroke={panza as string} strokeWidth={9} fill="none" strokeLinecap="round" />
      <Pata x={-40} y={-140} l={140} w={24} ang={g(0.3)} c={c} atras pie="pezuna" />
      <Pata x={68} y={-140} l={140} w={20} ang={g(Math.PI + 0.3)} c={c} pie="pezuna" />
      <g transform={`rotate(${cab} 72 -184)`}>
        <path d={suave([[56, -182], [76, -238], [96, -258], [124, -244], [132, -228], [108, -224], [94, -202], [86, -164]], true, 0.8)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
        <path d={suave([[60, -176], [76, -226], [84, -170]], true)} fill={panza as string} opacity={0.6} />
        <path d="M82 -252 L 66 -270 L 88 -262 Z" fill={c} stroke={N} strokeWidth={1.6} />
        <path d={asta} stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d={asta} stroke="#E9DCC0" strokeWidth={6} fill="none" strokeLinecap="round" />
        <OjoA x={108} y={-244} r={4.5} iris="#3A2A20" />
        <ellipse cx={130} cy={-232} rx={3} ry={2.4} fill={N} />
      </g>
    </Envuelve>
  );
};
/** Nutria sentada comiendo un salmón (Ótr, el hermano de Fáfnir y Regin). */
const Nutria: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity, f, color = '#6B4A2E', panza = '#B08458', pez = true }) => {
  const c = color as string, cola = Math.sin(f / 12) * 4;
  return (
    <Envuelve x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
      <path d={`M-20 -6 C -50 0, -78 ${-2 + cola}, -96 ${4 + cola} C -76 -12, -52 -18, -24 -22 Z`} fill={c} stroke={N} strokeWidth={2} />
      <path d={suave([[-30, 0], [-36, -40], [-24, -80], [0, -96], [20, -86], [26, -50], [20, 0]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.2} />
      <path d={suave([[-14, -10], [-18, -50], [-4, -78], [12, -70], [14, -30], [8, -8]], true, 0.8)} fill={panza as string} />
      <path d="M-26 0 C -26 -10, -12 -10, -10 0 Z M4 0 C 4 -10, 18 -10, 20 0 Z" fill={c} stroke={N} strokeWidth={1.6} />
      <g transform="translate(6 -104)">
        <path d={suave([[-22, 6], [-18, -12], [0, -20], [20, -14], [34, -4], [32, 6], [14, 14], [-10, 14]], true, 0.9)} fill={c} stroke={N} strokeWidth={2} />
        <circle cx={-12} cy={-14} r={5} fill={c} stroke={N} strokeWidth={1.4} />
        <path d="M14 8 C 22 8, 30 6, 34 2" stroke={panza as string} strokeWidth={4} fill="none" strokeLinecap="round" />
        <ellipse cx={34} cy={-3} rx={3.6} ry={3} fill={N} />
        <circle cx={14} cy={-6} r={3} fill={N} /><circle cx={15} cy={-7} r={1} fill={BLANCO} />
        <path d="M28 4 l 14 -2 M28 6 l 14 4" stroke={N} strokeWidth={0.9} />
      </g>
      {!!pez && <g transform="translate(26 -64) rotate(-8)">
        <path d="M-6 0 C 4 -12, 34 -12, 46 0 C 34 12, 4 12, -6 0 Z" fill="#D98A7A" stroke={N} strokeWidth={1.6} />
        <path d="M46 0 l 14 -10 l -2 20 Z" fill="#B8665A" stroke={N} strokeWidth={1.4} />
        <path d="M8 -4 C 18 -8, 30 -8, 40 -2" stroke="#F2C2B4" strokeWidth={2} fill="none" />
        <circle cx={2} cy={-2} r={1.8} fill={N} />
      </g>}
      <path d="M8 -70 C 18 -72, 26 -66, 30 -60 M10 -58 C 18 -60, 24 -56, 28 -50" stroke={c} strokeWidth={9} strokeLinecap="round" fill="none" />
    </Envuelve>
  );
};
/** Salmón nadando (origen = centro del pez). */
const Salmon: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity, f, moviendo, color = '#9FB4C2', lomo = '#5E7F99', panza = '#E9A08A' }) => {
  const c = color as string, cola = Math.sin(f * (moviendo ? 0.5 : 0.15)) * 10;
  return (
    <Envuelve x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
      <path d={`M-62 0 L -96 ${-22 + cola * 0.4} L -88 0 L -96 ${22 + cola * 0.4} Z`} fill={lomo as string} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d={suave([[-66, 0], [-30, -26], [20, -30], [62, -12], [72, 2], [56, 16], [10, 24], [-36, 18]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.2} />
      <path d="M-40 -14 C -10 -28, 30 -28, 60 -10" stroke={lomo as string} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M-30 10 C 0 18, 30 16, 56 8" stroke={panza as string} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M-8 -28 l 10 -12 l 12 10 Z" fill={lomo as string} stroke={N} strokeWidth={1.4} />
      <path d="M8 18 l 6 12 l 8 -10 Z" fill={lomo as string} stroke={N} strokeWidth={1.4} />
      {[[-24, -6], [-8, -10], [10, -12], [-14, 2], [4, 0]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r={2} fill={N} opacity={0.5} />)}
      <path d="M40 -12 C 36 0, 38 10, 44 16" stroke={N} strokeWidth={1.4} fill="none" />
      <circle cx={56} cy={-4} r={4} fill={BLANCO} stroke={N} strokeWidth={1.2} /><circle cx={57} cy={-4} r={2} fill={N} />
    </Envuelve>
  );
};
/** Víbora: colgada (si está arriba de la escena: Skadi la cuelga sobre Loki) o enroscada en el piso. */
const Vibora: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity, f, color = '#4E6E3A', panza = '#C9C08A', raya = '#2A3A20' }) => {
  const c = color as string, o = Math.sin(f / 14) * 6, lengua = Math.floor(f / 10) % 3 === 0;
  const colgada = y < 640;
  if (colgada) {
    const pts: P[] = [[-30, -420], [-10 + o, -330], [20, -250], [-6 - o, -170], [-20, -100], [4 + o * 0.6, -40], [6, -14]];
    return (
      <Envuelve x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
        <path d={suave(pts)} stroke={N} strokeWidth={30} fill="none" strokeLinecap="round" />
        <path d={suave(pts)} stroke={c} strokeWidth={25} fill="none" strokeLinecap="round" />
        <path d={suave(pts)} stroke={raya as string} strokeWidth={10} fill="none" strokeDasharray="14 10" strokeLinecap="round" />
        <g transform="translate(6 -8) rotate(70)">
          <path d={suave([[-12, -14], [14, -16], [34, -6], [36, 4], [14, 14], [-12, 12]], true, 0.9)} fill={c} stroke={N} strokeWidth={2} />
          <path d="M-6 -10 L 6 -2 L 18 -10" stroke={raya as string} strokeWidth={3} fill="none" />
          <circle cx={20} cy={-6} r={3} fill={ORO} stroke={N} strokeWidth={1} /><ellipse cx={20.5} cy={-6} rx={0.9} ry={2.4} fill={N} />
          {lengua && <path d="M36 2 l 14 2 l 4 -4 M50 4 l 4 4" stroke="#B8323A" strokeWidth={2} fill="none" strokeLinecap="round" />}
        </g>
      </Envuelve>
    );
  }
  return (
    <Envuelve x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
      <ellipse cx={-10} cy={-14} rx={70} ry={16} fill={c} stroke={N} strokeWidth={2.2} />
      <ellipse cx={-6} cy={-34} rx={54} ry={14} fill={c} stroke={N} strokeWidth={2.2} />
      <path d="M-60 -16 C -30 -26, 20 -26, 50 -16 M-48 -36 C -20 -44, 14 -44, 40 -36" stroke={raya as string} strokeWidth={5} strokeDasharray="12 8" fill="none" />
      <path d={`M30 -40 C 50 -60, 46 -90, ${60 + o * 0.3} -110`} stroke={N} strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d={`M30 -40 C 50 -60, 46 -90, ${60 + o * 0.3} -110`} stroke={c} strokeWidth={21} fill="none" strokeLinecap="round" />
      <path d={`M36 -50 C 52 -66, 50 -86, ${60 + o * 0.3} -104`} stroke={panza as string} strokeWidth={6} fill="none" strokeLinecap="round" />
      <g transform={`translate(${62 + o * 0.3} -118)`}>
        <path d={suave([[-12, -12], [14, -14], [32, -4], [34, 4], [14, 12], [-12, 10]], true, 0.9)} fill={c} stroke={N} strokeWidth={2} />
        <circle cx={18} cy={-4} r={3} fill={ORO} stroke={N} strokeWidth={1} /><ellipse cx={18.5} cy={-4} rx={0.9} ry={2.4} fill={N} />
        {lengua && <path d="M34 2 l 14 2 l 4 -4 M48 4 l 4 4" stroke="#B8323A" strokeWidth={2} fill="none" strokeLinecap="round" />}
      </g>
    </Envuelve>
  );
};
/** Fáfnir: el gran dragón (sin alas, como en la saga: se arrastra). Cuerpo grueso, cuello fuerte, cuernos, cresta de
 * púas, panza dorada y cuatro patas cortas con garras. Origen = el piso bajo el pecho. */
const Fafnir: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity, moviendo, f, boca, color = '#4E7A4A', panza = '#D9B45A', puas = '#2F4E2E' }) => {
  const c = color as string, g = fasePatas(f, moviendo, false), o = Math.sin(f / 16) * 6;
  const lomo: P[] = [[-340, -14 + o], [-290, -40 + o * 0.6], [-250, -84], [-160, -140], [-50, -168], [50, -170], [110, -200], [140, -250], [176, -300]];
  const bajo: P[] = [[236, -262], [204, -232], [170, -180], [130, -110], [60, -64], [-60, -54], [-170, -54], [-260, -30], [-300, -14 + o * 0.6], [-344, -6 + o]];
  const banda: P[] = [[222, -250], [190, -220], [156, -170], [118, -108], [56, -74], [-60, -66], [-170, -66], [-260, -42], [-300, -24 + o * 0.6]];
  return (
    <Envuelve x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
      <Pata x={-150} y={-70} l={72} w={42} ang={g(Math.PI)} c={c} lejos atras pie="garra" />
      <Pata x={70} y={-80} l={82} w={40} ang={g(0)} c={c} lejos pie="garra" />
      {lomo.slice(1, -1).map(([px, py], i) => <path key={i} d={`M${px - 18} ${py + 6} L ${px - 2} ${py - 34} L ${px + 18} ${py + 4} Z`} fill={puas as string} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />)}
      <path d={suave([...lomo, ...bajo], true, 0.65)} fill={c} stroke={N} strokeWidth={2.8} strokeLinejoin="round" />
      <path d={suave(banda)} stroke={panza as string} strokeWidth={20} fill="none" strokeLinecap="round" />
      <path d={suave(banda)} stroke="#B08A3A" strokeWidth={20} strokeDasharray="2 16" fill="none" />
      {[[-280, -54], [-190, -96], [-90, -126], [10, -130], [100, -150], [-20, -96]].map(([px, py], i) => <path key={i} d={`M${px} ${py} q 12 -10 24 0 M${px + 16} ${py + 14} q 12 -10 24 0`} stroke="#3A6038" strokeWidth={2.2} fill="none" />)}
      <Pata x={-120} y={-66} l={70} w={44} ang={g(0.4)} c={c} atras pie="garra" unas />
      <Pata x={96} y={-76} l={80} w={42} ang={g(Math.PI + 0.4)} c={c} pie="garra" unas />
      {/* cabeza */}
      <g transform={`translate(204 -290) rotate(${Math.sin(f / 22) * 4})`}>
        <path d="M-26 -22 C -40 -40, -56 -54, -76 -58 C -60 -46, -48 -34, -40 -14 Z M-8 -30 C -18 -50, -30 -64, -48 -72 C -32 -58, -24 -44, -22 -24 Z" fill="#E9DCC0" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <path d={suave([[-36, 14], [-30, -22], [4, -38], [52, -32], [104, -20], [112, -4], [80, 6], boca ? [66, 34] : [58, 22], [14, 36], [-24, 32]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.6} strokeLinejoin="round" />
        {!!boca && <path d="M50 12 L 110 0 L 70 36 Z" fill="#8A2A2A" stroke={N} strokeWidth={1.6} />}
        <path d={`M${boca ? 54 : 44} 16 L 106 2`} stroke={N} strokeWidth={2.2} />
        {[62, 78, 94].map((tx) => <path key={tx} d={`M${tx} ${boca ? 7 : 11} l 3.5 8 l 3.5 -8`} fill={BLANCO} stroke={N} strokeWidth={1} />)}
        <path d="M16 -18 Q 30 -28 44 -16 Q 30 -10 16 -18 Z" fill={ORO} stroke={N} strokeWidth={1.6} />
        <ellipse cx={30} cy={-17} rx={2} ry={5} fill={N} />
        <path d="M10 -30 Q 30 -40 50 -28" stroke={N} strokeWidth={3.4} fill="none" strokeLinecap="round" />
        <circle cx={100} cy={-10} r={3} fill={N} />
        <path d="M-2 24 C 22 32, 46 30, 64 22" stroke={panza as string} strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
    </Envuelve>
  );
};
/** Ave: vuela con las alas abiertas si está en el aire; posada si está en el piso. Sirve para cuervo, cuco y gaviota. */
const Ave: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity, f, boca, color = '#15181E', ala2 = '#2A3440', pico = '#2A3440', brillo = '#5B7A99', panza, rayado }) => {
  const c = color as string, posada = y > 700;
  if (posada) return <Envuelve x={x} y={y} s={s * 2} voltear={voltear} opacity={opacity}><Cuervo s={1} brillo={brillo as string} /></Envuelve>;
  const a = Math.sin(f / 4) * 22;
  return (
    <Envuelve x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
      <path d={`M-12 -6 C -30 ${-50 - a}, -66 ${-74 - a}, -112 ${-70 - a} C -84 ${-50 - a * 0.6}, -66 -24, -38 -6 Z`} fill={ala2 as string} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-56 2 L -92 -12 L -84 4 L -94 18 Z" fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d={suave([[-60, 2], [-20, -18], [24, -20], [46, -8], [26, 10], [-20, 14]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.2} />
      {!!panza && <path d="M-30 10 C -6 14, 14 12, 30 6" stroke={panza as string} strokeWidth={7} fill="none" strokeLinecap="round" />}
      {!!rayado && [-24, -12, 0, 12].map((rx) => <path key={rx} d={`M${rx} 4 l 4 8`} stroke={N} strokeWidth={1.6} opacity={0.6} />)}
      <circle cx={42} cy={-12} r={15} fill={c} stroke={N} strokeWidth={2} />
      <path d={boca ? 'M54 -18 L 78 -14 L 56 -10 M56 -8 L 74 -2 L 54 -4 Z' : 'M54 -18 L 80 -10 L 54 -4 Z'} fill={pico as string} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx={46} cy={-16} r={3.4} fill={BLANCO} /><circle cx={47} cy={-16} r={1.7} fill={NEGRO} />
      <path d={`M2 -8 C -8 ${-50 - a * 0.8}, -36 ${-70 - a * 0.8}, -72 ${-66 - a * 0.8} C -50 ${-46 - a * 0.5}, -30 -24, 8 -4 Z`} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M-16 -24 C -26 ${-44 - a * 0.6}, -40 ${-54 - a * 0.6}, -56 ${-56 - a * 0.7}`} stroke={brillo as string} strokeWidth={2} fill="none" strokeLinecap="round" />
    </Envuelve>
  );
};
/** Águila grande en vuelo (Odín y Suttung se vuelven águila para el hidromiel). */
const Aguila: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity, f, color = '#7A5232', ala2 = '#5A3A22', nuca = '#D9A441', pico = '#E9C46A' }) => {
  const c = color as string, a = Math.sin(f / 5) * 26, posada = y > 700;
  if (posada) {
    return (
      <Envuelve x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
        <path d="M-40 -60 L -70 -10 L -50 -14 L -40 -40 Z" fill={ala2 as string} stroke={N} strokeWidth={2} />
        <path d={suave([[-44, -60], [-20, -110], [10, -120], [30, -100], [26, -50], [0, -20], [-30, -30]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.2} />
        <path d="M-30 -90 C -10 -70, -6 -50, -20 -30" stroke={ala2 as string} strokeWidth={10} fill="none" strokeLinecap="round" />
        <circle cx={22} cy={-126} r={20} fill={nuca as string} stroke={N} strokeWidth={2} />
        <path d="M36 -134 C 52 -134, 58 -120, 50 -110 C 46 -118, 42 -120, 36 -120 Z" fill={pico as string} stroke={N} strokeWidth={1.8} />
        <circle cx={28} cy={-130} r={3} fill={NEGRO} />
        <path d="M-6 -20 V 0 M10 -24 V 0 M-14 0 H 2 M2 0 H 18" stroke={pico as string} strokeWidth={4} strokeLinecap="round" />
      </Envuelve>
    );
  }
  return (
    <Envuelve x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
      <path d={`M-20 -10 C -50 ${-70 - a}, -110 ${-110 - a}, -190 ${-106 - a} L -170 ${-90 - a} L -184 ${-80 - a} L -162 ${-70 - a} L -172 ${-58 - a} L -146 ${-52 - a * 0.7} C -100 -40, -70 -16, -50 -4 Z`} fill={ala2 as string} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-80 4 L -136 -14 L -126 6 L -138 26 Z" fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d={suave([[-90, 4], [-40, -26], [30, -28], [62, -10], [34, 14], [-40, 20]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.2} />
      <circle cx={62} cy={-16} r={20} fill={nuca as string} stroke={N} strokeWidth={2} />
      <path d="M76 -24 C 96 -24, 102 -6, 92 6 C 88 -4, 84 -8, 76 -8 Z" fill={pico as string} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M58 -22 L 74 -20" stroke={N} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={68} cy={-18} r={3} fill={NEGRO} />
      <path d={`M10 -14 C -10 ${-70 - a * 0.85}, -60 ${-104 - a * 0.85}, -130 ${-100 - a * 0.85} L -112 ${-84 - a * 0.85} L -124 ${-72 - a * 0.8} L -100 ${-64 - a * 0.7} L -108 ${-52 - a * 0.6} C -70 -40, -30 -20, 20 -2 Z`} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-10 18 L -4 34 M6 16 L 12 32" stroke={pico as string} strokeWidth={4} strokeLinecap="round" />
    </Envuelve>
  );
};

// ---------- fichas ----------
const pl = (i: number) => PIEL[i % PIEL.length];
const ESC_ROJO = <Escudo c1={ROJO} c2={CREMA} />;

export const ELENCO_NORDICO_OFICIAL: Record<string, Ficha> = {
  // —— Sigurd y los Völsungos / Gjúkungos (eps. 16–17) ——
  sigurd_oficial: H({ piel: pl(6), pelo: TRIGO, peinado: 'melena', barba: 'no', tunica: '#B23A2E', borde: ORO, pantalon: '#3A3F48', capa: '#2F5D80', capaCorta: true, brazo: [40, 60], mano: <Gram />, manoAtras: <Escudo c1="#B8862B" c2={ROJO} dibujo="dragon" /> }, 'SIGURD'),
  regin_oficial: H({ piel: pl(9), pelo: OSCURO, s: 0.72, gigante: true, barba: 'larga', tunica: '#5E6A3A', pantalon: '#3A2A20', cabeza: <Capucha c="#7A3A2A" punta />, cuerpoX: <DelantalCuero a={1.35} />, mano: <Martillo />, manoAtras: <Tenazas /> }, 'REGIN'),
  fafnir_hombre_oficial: H({ piel: pl(5), pelo: NEGRO_P, gigante: true, s: 1.06, barba: 'tupida', tunica: '#4E6E3A', borde: ORO, pantalon: '#2E3A2A', pelliza: '#4A3A2A', cuerpoX: <Torques />, brazo: [30, 50] }, 'FAFNIR'),
  hreidmar_oficial: H({ piel: pl(1), pelo: GRIS_P, cuerpo: 'viejo', barba: 'larga', peinado: 'calvo', larga: true, tunica: '#6E3A5A', ribete: ORO, capa: '#3A2A40', cuerpoX: <Torques />, mano: <Baston alto={170} /> }, 'HREIDMAR'),
  andvari_oficial: H({ piel: pl(9), pelo: CASTANO, s: 0.7, gigante: true, barba: 'larga', barbaPelo: COBRE, tunica: '#2F6B6E', pantalon: '#2E3742', cabeza: <Capucha c="#3E5A6E" punta />, brazo: [70, 50], mano: <Anillo /> }, 'ANDVARI'),
  brynhild_oficial: M({ piel: pl(3), pelo: RUBIO, peinado: 'suelto', vestido: '#3E6F96', blusa: '#8FB3D3', borde: CREMA, ribete: CREMA, delantal: null, capa: '#E9EEF2', forro: '#C9D2DA', capaBorde: ORO, cabeza: <YelmoAlado />, cuerpoX: <Malla a={0.92} />, brazo: [30, 70], mano: <Lanza />, manoAtras: <Escudo c1="#3E6F96" c2={CREMA} dibujo="mitad" /> }, 'BRYNHILD'),
  gudrun_oficial: M({ piel: pl(4), pelo: CASTANO, peinado: 'trenza', vestido: '#9C3B52', blusa: '#E8D9C0', borde: ORO, delantal: '#9C3B52', brazo: [24, 50], cabeza: <Diadema /> }, 'GUDRUN'),
  grimhild_oficial: M({ piel: pl(1), pelo: NEGRO_P, peinado: 'rodete', vestido: '#3A2A4A', blusa: '#5E4A6E', borde: ORO, delantal: '#4A2E5E', capa: '#22182E', capaBorde: ORO, cabeza: <Corona />, brazo: [50, 60], mano: <CuernoBeber lleno /> }, 'GRIMHILD'),
  gjuki_oficial: H({ piel: pl(1), pelo: BLANCO_P, cuerpo: 'viejo', barba: 'larga', larga: true, tunica: '#2F5D80', ribete: ORO, capa: '#7A2A22', cabeza: <Corona />, cuerpoX: <Torques />, mano: <Baston alto={180} /> }, 'GJUKI'),
  gunnar_oficial: H({ piel: pl(7), pelo: CASTANO, peinado: 'melena', barba: 'corta', tunica: '#2F5D80', borde: ORO, pantalon: '#2E3742', capa: '#B23A2E', capaCorta: true, cabeza: <Diadema />, brazo: [20, 40], mano: <EspadaNordica />, manoAtras: <Escudo c1={AZUL} c2={ORO} /> }, 'GUNNAR'),
  guttorm_oficial: H({ piel: pl(0), pelo: OSCURO, barba: 'no', peinado: 'flequillo', tunica: '#6E5A2A', borde: '#3A2A20', pantalon: '#3A3F48', brazo: [60, 40], mano: <Lanza largo={200} /> }, 'GUTTORM'),
  // —— Helgi y Sigrún (ep. 18) ——
  helgi_oficial: H({ piel: pl(2), pelo: COBRE, peinado: 'melena', barba: 'no', tunica: '#2E4A7A', borde: ORO, pantalon: '#3A3F48', malla: true, capa: '#B23A2E', capaCorta: true, cabeza: <YelmoSimple />, brazo: [30, 60], mano: <EspadaNordica />, manoAtras: <Escudo c1={ROJO} c2={ORO} /> }, 'HELGI'),
  helgi_nino_oficial: H({ piel: pl(6), pelo: COBRE, cuerpo: 'nino', barba: 'no', peinado: 'flequillo', tunica: '#2E4A7A', borde: ORO, pantalon: '#4A4F58', brazo: [20, 30] }, 'HELGI'),
  sigrun_oficial: M({ piel: pl(10), pelo: OSCURO, peinado: 'trenza', vestido: '#6E4A8A', blusa: '#B9A6CC', borde: ORO, delantal: null, capa: '#F2EEE6', forro: '#D9D2C4', cabeza: <YelmoAlado />, cuerpoX: <Malla a={0.92} />, brazo: [30, 70], mano: <Lanza />, manoAtras: <Escudo c1="#6E4A8A" c2={CREMA} dibujo="mitad" /> }, 'SIGRUN'),
  hunding_oficial: H({ piel: pl(5), pelo: NEGRO_P, barba: 'tupida', gigante: true, tunica: '#5A2A2A', borde: ORO, pantalon: '#2A2A30', pelliza: '#3A2E26', cabeza: <Corona c="#B9873A" />, brazo: [30, 50], mano: <Hacha /> }, 'HUNDING'),
  hodbrodd_oficial: H({ piel: pl(8), pelo: OSCURO, barba: 'media', tunica: '#3E5A3A', borde: ORO, pantalon: '#2E3742', capa: '#2A2A30', malla: true, cabeza: <Corona />, brazo: [30, 50], mano: <EspadaNordica />, manoAtras: <Escudo c1="#3E5A3A" c2={NEGRO_P[0]} dibujo="mitad" /> }, 'HODBRODD'),
  dag_oficial: H({ piel: pl(2), pelo: RUBIO, barba: 'bigote', tunica: '#4A6F8F', borde: CREMA, pantalon: '#2E3742', capa: '#1F3A55', capaCorta: true, brazo: [60, 40], mano: <Lanza largo={240} punta={ORO} /> }, 'DAG'),
  // —— Hervor y Tyrfing (ep. 19) ——
  hervor_oficial: M({ piel: pl(3), pelo: TRIGO, peinado: 'trenza', vestido: '#7E3A2A', pantalon: '#3A3F48', blusa: '#7E3A2A', borde: ORO, delantal: null, cuerpoX: <><Malla a={0.92} /><Cinto a={0.92} /></>, capa: '#2A3A4A', capaCorta: true, brazo: [40, 60], mano: <Tyrfing />, manoAtras: <Escudo c1="#7E3A2A" c2={ORO} /> }, 'HERVOR'),
  angantyr_oficial: H({ piel: pl(0), pelo: NEGRO_P, peinado: 'melena', barba: 'tupida', gigante: true, tunica: '#5A2A2A', borde: ORO, pantalon: '#2A2A30', pelliza: '#4A3424', malla: true, brazo: [40, 60], mano: <Tyrfing /> }, 'ANGANTYR'),
  arngrim_oficial: H({ piel: pl(9), pelo: GRIS_P, peinado: 'melena', barba: 'tupida', gigante: true, tunica: '#4A3A2A', borde: '#B9873A', pantalon: '#2A2A30', pelliza: '#2E2620', brazo: [30, 50], mano: <Hacha /> }, 'ARNGRIM'),
  svafrlami_oficial: H({ piel: pl(1), pelo: CASTANO, barba: 'media', larga: true, tunica: '#7A2340', ribete: ORO, capa: '#2F5D80', cabeza: <Corona />, cuerpoX: <Torques />, brazo: [40, 60], mano: <Tyrfing /> }, 'SVAFRLAMI'),
  eyfura_oficial: M({ piel: pl(6), pelo: TRIGO, peinado: 'suelto', vestido: '#5C8DB8', blusa: '#DCE6EE', delantal: '#3E6F96', cabeza: <Diadema />, brazo: [20, 40] }, 'EYFURA'),
  svafa_oficial: M({ piel: pl(4), pelo: CASTANO, peinado: 'nada', vestido: '#5E7B3A', blusa: '#E8D9C0', delantal: '#5E7B3A', cabeza: <Velo c="#F4F1EA" banda="#5E7B3A" />, brazo: [40, 70] }, 'SVAFA'),
  durin_oficial: H({ piel: pl(1), pelo: BLANCO_P, s: 0.7, gigante: true, barba: 'larga', tunica: '#4A5A6A', pantalon: '#2E3742', cabeza: <Capucha c="#A8322B" punta />, cuerpoX: <DelantalCuero a={1.35} />, mano: <Martillo /> }, 'DURIN'),
  dvalin_oficial: H({ piel: pl(9), pelo: OSCURO, s: 0.7, gigante: true, barba: 'larga', tunica: '#7A5A2A', pantalon: '#2E3742', cabeza: <Capucha c="#2F5D80" punta />, cuerpoX: <DelantalCuero a={1.35} />, mano: <Tyrfing /> }, 'DVALIN'),
  hjalmar_oficial: H({ piel: pl(7), pelo: RUBIO, barba: 'corta', tunica: '#2F5D80', borde: ORO, pantalon: '#2E3742', malla: true, capa: '#EEF2F5', capaCorta: true, capaBorde: '#2F5D80', cabeza: <YelmoSimple />, brazo: [40, 60], mano: <EspadaNordica />, manoAtras: <Escudo c1={AZUL} c2={CREMA} /> }, 'HJALMAR'),
  odd_oficial: H({ piel: pl(8), pelo: ROJIZO, peinado: 'melena', barba: 'corta', tunica: '#E8E2D2', borde: ROJO, ribete: ROJO, pantalon: '#4E5A3A', detras: <Carcaj pluma={ORO} />, brazo: [30, 20], mano: <Arco /> }, 'ORVAR-ODD'),
  // —— El molino Grotti (ep. 20) ——
  frodi_oficial: H({ piel: pl(2), pelo: CASTANO, barba: 'media', larga: true, tunica: '#B23A2E', ribete: ORO, capa: '#2F5D80', forro: '#E9C46A', cabeza: <Corona />, cuerpoX: <Torques />, brazo: [40, 70] }, 'FRODI'),
  fjolnir_oficial: H({ piel: pl(7), pelo: TRIGO, barba: 'corta', larga: true, tunica: '#3E6F96', ribete: ORO, capa: '#5E4A2A', cabeza: <Corona />, brazo: [50, 60], mano: <CuernoBeber lleno /> }, 'FJOLNIR'),
  fenja_oficial: M({ piel: pl(0), pelo: ROJIZO, peinado: 'trenza', gigante: true, s: 1.18, vestido: '#4E6E3A', blusa: '#C9B48A', delantal: '#4E6E3A', brazo: [60, 50] }, 'FENJA'),
  menja_oficial: M({ piel: pl(5), pelo: OSCURO, peinado: 'trenza', gigante: true, s: 1.18, vestido: '#7A4A2A', blusa: '#C9B48A', delantal: '#7A4A2A', brazo: [60, 50] }, 'MENJA'),
  mysing_oficial: H({ piel: pl(9), pelo: NEGRO_P, peinado: 'melena', barba: 'media', tunica: '#2A2A30', borde: ROJO, ribete: ROJO, pantalon: '#3A3F48', malla: true, capa: '#7A2A22', capaCorta: true, cabeza: <YelmoSimple />, brazo: [30, 50], mano: <EspadaNordica />, manoAtras: <Escudo c1={NEGRO_P[0]} c2={ROJO} /> }, 'MYSING'),
  // —— Starkad (ep. 21) ——
  starkad_oficial: H({ piel: pl(5), pelo: CASTANO, peinado: 'melena', barba: 'tupida', gigante: true, s: 1.12, tunica: '#5A4A3A', borde: '#B9873A', pantalon: '#2A2A30', malla: true, pelliza: '#3A2E26', brazo: [30, 50], mano: <EspadaNordica ang={4} />, manoAtras: <Escudo c1={ROJO} c2="#2A2A30" /> }, 'STARKAD'),
  vikar_oficial: H({ piel: pl(6), pelo: TRIGO, barba: 'no', tunica: '#7A2340', borde: ORO, pantalon: '#3A3F48', capa: '#2F5D80', capaCorta: true, cabeza: <Corona />, brazo: [30, 50] }, 'VIKAR'),
  hather_oficial: H({ piel: pl(2), pelo: RUBIO, barba: 'no', peinado: 'flequillo', tunica: '#B23A2E', borde: CREMA, pantalon: '#3A3F48', brazo: [40, 60], mano: <EspadaNordica /> }, 'HATHER'),
  volund_oficial: H({ piel: pl(5), pelo: OSCURO, barba: 'corta', tunica: '#5E6A76', pantalon: '#3A2A20', cuerpoX: <DelantalCuero />, mano: <Martillo />, manoAtras: <Tenazas /> }, 'VOLUND'),
  hrossharsgrani_oficial: H({ piel: pl(1), pelo: GRIS_P, cuerpo: 'flaco', s: 1.08, barba: 'larga', peinado: 'nada', larga: true, tunica: '#6E6458', ribete: '#4E4438', capa: '#4E5A66', capaBorde: CREMA, cabeza: <><Capucha c="#4E5A66" /><ParcheCorto /></>, mano: <Baston alto={200} /> }, 'HORSEHAIR GRANI'),
  // —— Shorts: dioses, gigantes y enanos ——
  hodr_oficial: H({ piel: pl(7), pelo: OSCURO, barba: 'corta', ojosCerrados: true, tunica: '#5E6A76', borde: CREMA, pantalon: '#3A3F48', capa: '#3A4452', capaCorta: true, brazo: [36, 24], mano: <Muerdago /> }, 'HODR'),
  hoenir_oficial: H({ piel: pl(3), pelo: RUBIO, s: 1.12, barba: 'corta', tunica: '#8FB3D3', borde: ORO, pantalon: '#3E5A73', botas: '#8A6A40', capa: '#2F5D80', forro: '#8FB3D3', brazo: [20, 30] }, 'HOENIR'),
  mimir_oficial: H({ piel: pl(1), pelo: BLANCO_P, s: 1.04, barba: 'larga', peinado: 'calvo', larga: true, tunica: '#2F6B8A', ribete: CREMA, capa: '#1F3A55', capaBorde: CREMA, brazo: [40, 60], mano: <CuernoBeber /> }, 'MIMIR'),
  vanir_oficial: H({ piel: pl(8), pelo: TRIGO, barba: 'corta', tunica: '#4E7A3A', borde: ORO, pantalon: '#4A3A2A', capa: '#B8862B', capaCorta: true, brazo: [40, 40] }, 'VANIR'),
  skadi_oficial: M({ piel: pl(4), pelo: NEGRO_P, peinado: 'trenza', vestido: '#5E7084', pantalon: '#3E4A5A', botas: '#E9E2D2', blusa: '#5E7084', borde: CREMA, ribete: '#5E7084', delantal: null, capa: '#F4F1EA', forro: '#C9D2DA', capaBorde: '#9AA7B2', detras: <Esquis />, cuerpoX: <><Pelliza a={0.92} c="#F4F1EA" luz="#B9C4CE" /><Cinto a={0.92} /></>, brazo: [30, 20], mano: <Arco c="#5A3A22" /> }, 'SKADI'),
  sigyn_oficial: M({ piel: pl(10), pelo: CASTANO, peinado: 'rodete', vestido: '#8A6A3A', blusa: '#E8D9C0', delantal: '#5E7B3A', brazo: [100, 40], mano: <Cuenco /> }, 'SIGYN'),
  ran_oficial: M({ piel: pl(4), pelo: NEGRO_P, peinado: 'suelto', vestido: '#2F7A86', blusa: '#86CFCF', borde: ORO, delantal: '#1E5A66', capa: '#1E4A5A', capaBorde: '#86CFCF', brazo: [20, 30], mano: <RedRan /> }, 'RAN'),
  elli_oficial: M({ piel: pl(1), pelo: BLANCO_P, peinado: 'nada', cuerpo: 'viejo', vestido: '#6E6E78', blusa: '#9EA4AA', borde: CREMA, delantal: '#4E4E58', cabeza: <Velo c="#B9BEC4" banda="#6E6E78" />, brazo: [20, 10], mano: <Baston alto={170} /> }, 'ELLI'),
  thjalfi_oficial: H({ piel: pl(6), pelo: RUBIO, s: 0.86, barba: 'no', peinado: 'flequillo', tunica: '#C9A06A', borde: '#7A3A2A', ribete: '#7A3A2A', pantalon: '#5A4A3A', brazo: [30, 40] }, 'THJALFI'),
  brokkr_oficial: H({ piel: pl(9), pelo: OSCURO, s: 0.7, gigante: true, barba: 'larga', barbaPelo: ROJIZO, tunica: '#5E6A3A', pantalon: '#3A2A20', cabeza: <Capucha c="#5A3A22" punta />, cuerpoX: <DelantalCuero a={1.35} />, mano: <Martillo />, manoAtras: <Tenazas /> }, 'BROKKR'),
  gunnlod_oficial: M({ piel: pl(0), pelo: COBRE, peinado: 'suelto', gigante: true, s: 1.12, vestido: '#6E3A5A', blusa: '#C9A0B4', delantal: '#4A2A40', cabeza: <Diadema />, brazo: [50, 60], mano: <CuernoBeber lleno /> }, 'GUNNLÖD'),
  suttung_oficial: H({ piel: pl(5), pelo: COBRE, gigante: true, s: 1.3, barba: 'tupida', tunica: '#5A4A3A', borde: ORO, pantalon: '#2A2A30', pelliza: '#6B4A2E', cuerpoX: <Torques />, brazo: [30, 50] }, 'SUTTUNG'),
  utgarda_loki_oficial: H({ piel: pl(0), pelo: NEGRO_P, peinado: 'melena', gigante: true, s: 1.36, barba: 'media', larga: true, tunica: '#2F4E5A', ribete: '#9AA7B2', capa: '#1B2A33', capaBorde: '#9AA7B2', cabeza: <Corona c="#C9D2DA" piedra="#2F6B8A" />, cuerpoX: <Torques />, brazo: [40, 70] }, 'UTGARDA-LOKI'),
  hrym_oficial: H({ piel: '#D9C4B8', pelo: BLANCO_P, gigante: true, s: 1.36, barba: 'tupida', barbaPelo: ['#DCE8F0', '#FFFFFF'], tunica: '#5E7F99', borde: '#DCE8F0', pantalon: '#2E4A5C', botas: '#5E6A76', pelliza: '#EEF2F5', brazo: [30, 40], manoAtras: <Escudo c1="#9DBBD1" c2="#EEF2F5" r={62} /> }, 'HRYM'),
  // —— Animales y criaturas con nombre ——
  fafnir_oficial: D(Fafnir, { s: 1 }, 'FAFNIR'),
  fenrir_oficial: D(Lobo, { s: 1.75, color: '#4E5660', panza: '#9EA4AA', ojo: '#F2B33A' }, 'FENRIR'),
  grani_oficial: D(Caballo, { s: 1, color: '#9EA4AA', crin: '#E6E8EA', patasC: '#7E8790', montura: true, manta: ROJO }, 'GRANI'),
  suttung_aguila_oficial: D(Aguila, { s: 1.2, color: '#6B3A22', ala2: '#4A2616', nuca: '#B5652A' }, 'SUTTUNG'),
  otr_oficial: D(Nutria, { s: 1.2 }, 'OTR'),

  // —— Extras de aldea y de guerra (variantes para que los grupos no se vean clonados) ——
  vikingo_nordico_oficial: H({ piel: pl(0), pelo: TRIGO, barba: 'media', tunica: '#B23A2E', pantalon: '#3A3F48', cabeza: <YelmoSimple />, brazo: [30, 50], mano: <Hacha />, manoAtras: ESC_ROJO }, 'VIKING'),
  vikingo_nordico_2_oficial: H({ piel: pl(5), pelo: CASTANO, peinado: 'melena', barba: 'tupida', tunica: '#2F5D80', pantalon: '#4A3A2A', malla: true, brazo: [30, 50], mano: <EspadaNordica />, manoAtras: <Escudo c1={AZUL} c2={ORO} /> }, 'VIKING'),
  vikingo_nordico_3_oficial: H({ piel: pl(8), pelo: ROJIZO, barba: 'corta', tunica: '#4E6E3A', pantalon: '#3A3F48', cabeza: <YelmoSimple />, brazo: [30, 50], mano: <Lanza />, manoAtras: <Escudo c1={VERDE} c2={CREMA} dibujo="mitad" /> }, 'VIKING'),
  vikingo_nordico_4_oficial: H({ piel: pl(9), pelo: GRIS_P, peinado: 'calvo', barba: 'larga', tunica: '#6B4A2E', pantalon: '#2A2A30', pelliza: '#3A2E26', brazo: [30, 50], mano: <Hacha />, manoAtras: <Escudo c1="#2A2A30" c2={ORO} /> }, 'VIKING'),
  vikingo_nordico_5_oficial: H({ piel: pl(2), pelo: NEGRO_P, peinado: 'melena', barba: 'bigote', tunica: '#8A6A3A', pantalon: '#2E3742', capa: '#5A2A2A', capaCorta: true, brazo: [30, 50], mano: <EspadaNordica />, manoAtras: <Escudo c1="#8A6A3A" c2={ROJO} dibujo="mitad" /> }, 'VIKING'),
  hombre_nordico_oficial: H({ piel: pl(1), pelo: CASTANO, barba: 'corta', tunica: '#8A7A5A', borde: '#5A4A3A', ribete: '#5A4A3A', pantalon: '#5A4A3A', brazo: [20, 30], mano: <Horquilla /> }, ''),
  hombre_nordico_2_oficial: H({ piel: pl(9), pelo: OSCURO, barba: 'media', tunica: '#4E6E7A', borde: CREMA, ribete: CREMA, pantalon: '#3A3F48', cabeza: <Gorro c="#A8322B" />, brazo: [10, 20], mano: <Pescado /> }, ''),
  hombre_nordico_3_oficial: H({ piel: pl(7), pelo: RUBIO, peinado: 'melena', barba: 'corta', cuerpo: 'gordo', tunica: '#C9B48A', borde: '#7A5A3A', ribete: '#7A5A3A', pantalon: '#5A4A3A', cuerpoX: <DelantalCuero a={1.3} c="#E8E0CE" />, brazo: [20, 30] }, ''),
  hombre_nordico_4_oficial: H({ piel: pl(5), pelo: COBRE, barba: 'tupida', tunica: '#5E7B3A', borde: '#C9A06A', ribete: '#C9A06A', pantalon: '#4A3A2A', brazo: [20, 30] }, ''),
  joven_nordico_oficial: H({ piel: pl(6), pelo: RUBIO, barba: 'no', peinado: 'flequillo', tunica: '#3E6F96', borde: CREMA, ribete: CREMA, pantalon: '#4A3A2A', brazo: [20, 30] }, ''),
  joven_nordico_2_oficial: H({ piel: pl(2), pelo: CASTANO, peinado: 'melena', barba: 'no', tunica: '#9A3A2A', borde: ORO, pantalon: '#3A3F48', brazo: [20, 30] }, ''),
  anciano_nordico_oficial: H({ piel: pl(1), pelo: BLANCO_P, cuerpo: 'viejo', barba: 'larga', peinado: 'calvo', larga: true, tunica: '#7A6A50', ribete: '#4E4438', capa: '#5A4A3A', capaBorde: '#C9B48A', mano: <Baston alto={170} /> }, ''),
  anciano_nordico_2_oficial: H({ piel: pl(9), pelo: GRIS_P, cuerpo: 'viejo', barba: 'larga', peinado: 'nada', larga: true, tunica: '#5E6A58', ribete: '#3A4438', cabeza: <Capucha c="#6E5A3A" />, mano: <Baston alto={190} /> }, ''),
  mujer_nordica_oficial: M({ piel: pl(3), pelo: TRIGO, peinado: 'trenza', vestido: '#5C8DB8', blusa: '#E8E0CE', delantal: '#3E6F96', brazo: [20, 40] }, ''),
  mujer_nordica_2_oficial: M({ piel: pl(5), pelo: CASTANO, peinado: 'nada', vestido: '#8A3A2A', blusa: '#E8E0CE', delantal: '#A8582A', cabeza: <Velo c="#F4F1EA" banda="#A8582A" largo={50} />, brazo: [20, 40] }, ''),
  mujer_nordica_3_oficial: M({ piel: pl(10), pelo: COBRE, peinado: 'rodete', vestido: '#5E7B3A', blusa: '#E8E0CE', delantal: null, cuentas: true, brazo: [20, 40] }, ''),
  criada_nordica_oficial: M({ piel: pl(2), pelo: OSCURO, peinado: 'nada', vestido: '#8A7A5A', blusa: '#C9B48A', ribete: '#5A4A3A', borde: '#5A4A3A', delantal: null, cuentas: false, cabeza: <Velo c="#D9CFB8" banda="#8A7A5A" largo={44} />, brazo: [40, 40] }, ''),
  princesa_nordica_oficial: M({ piel: pl(6), pelo: RUBIO, peinado: 'suelto', vestido: '#E8E0CE', blusa: '#F7F3EA', borde: ORO, delantal: '#3E6F96', capa: '#3E6F96', capaBorde: ORO, cabeza: <Diadema />, brazo: [24, 40] }, 'PRINCESS'),
  anciana_nordica_oficial: M({ piel: pl(1), pelo: BLANCO_P, peinado: 'nada', cuerpo: 'viejo', vestido: '#5A4A3A', blusa: '#8A7A5A', delantal: '#3A2E26', cabeza: <Velo c="#E8E0CE" banda="#5A4A3A" />, mano: <Baston alto={160} /> }, ''),
  nino_nordico_oficial: H({ piel: pl(6), pelo: RUBIO, cuerpo: 'nino', barba: 'no', peinado: 'flequillo', tunica: '#B23A2E', borde: CREMA, ribete: CREMA, pantalon: '#5A4A3A', brazo: [20, 30] }, ''),
  nina_nordica_oficial: M({ piel: pl(3), pelo: TRIGO, cuerpo: 'nino', peinado: 'trenza', vestido: '#3E6F96', blusa: '#E8E0CE', delantal: null, brazo: [20, 30] }, ''),
  rey_nordico_oficial: H({ piel: pl(2), pelo: CASTANO, barba: 'media', larga: true, tunica: '#7A2340', ribete: ORO, capa: '#2F5D80', forro: '#C9D2DA', cabeza: <Corona />, cuerpoX: <Torques />, brazo: [30, 50], mano: <EspadaNordica ang={0} /> }, 'KING'),
  rey_nordico_2_oficial: H({ piel: pl(1), pelo: BLANCO_P, cuerpo: 'viejo', barba: 'larga', larga: true, tunica: '#2F5D80', ribete: ORO, capa: '#7A2340', cabeza: <Corona />, cuerpoX: <Torques />, mano: <Baston alto={190} c="#5A3A22" /> }, 'KING'),
  reina_nordica_oficial: M({ piel: pl(4), pelo: CASTANO, peinado: 'trenza', vestido: '#7A2340', blusa: '#E8D9C0', delantal: '#5A1E30', capa: '#2F5D80', capaBorde: ORO, cabeza: <Corona />, brazo: [24, 50] }, 'QUEEN'),
  jotun_nordico_oficial: H({ piel: '#C9A086', pelo: OSCURO, gigante: true, s: 1.35, barba: 'tupida', peinado: 'melena', tunica: '#5A4A3A', borde: '#8A7A5A', pantalon: '#3A2E26', pelliza: '#7A6A50', brazo: [30, 40], mano: <Baston alto={220} c="#5A3A22" /> }, 'JOTUN'),
  jotun_nordico_2_oficial: H({ piel: '#D2A880', pelo: GRIS_P, gigante: true, s: 1.35, cuerpo: 'gordo', barba: 'larga', peinado: 'calvo', tunica: '#4E5A3A', borde: '#8A7A5A', pantalon: '#3A2E26', pelliza: '#4A3A2A', brazo: [20, 30] }, 'JOTUN'),
  jotun_mujer_nordica_oficial: M({ piel: '#C9A086', pelo: GRIS_P, gigante: true, s: 1.3, peinado: 'trenza', vestido: '#5A4A3A', blusa: '#8A7A5A', delantal: '#3A2E26', cuerpoX: <Pelliza a={1.35} c="#7A6A50" />, brazo: [20, 30] }, 'JOTUN'),
  enano_nordico_oficial: H({ piel: pl(9), pelo: CASTANO, s: 0.7, gigante: true, barba: 'larga', tunica: '#6E3A2A', pantalon: '#2E3742', cabeza: <Capucha c="#4E6E3A" punta />, cuerpoX: <DelantalCuero a={1.35} />, mano: <Martillo /> }, 'DWARF'),
  enano_nordico_2_oficial: H({ piel: pl(1), pelo: GRIS_P, s: 0.7, gigante: true, barba: 'larga', tunica: '#2F5D80', pantalon: '#3A2A20', cabeza: <Capucha c="#8A5A30" punta />, brazo: [20, 30] }, 'DWARF'),
  valquiria_nordica_oficial: M({ piel: pl(3), pelo: RUBIO, peinado: 'trenza', vestido: '#5E7084', blusa: '#9AA7B2', borde: CREMA, delantal: null, capa: '#E9EEF2', forro: '#C9D2DA', cabeza: <YelmoAlado />, cuerpoX: <Malla a={0.92} />, brazo: [30, 70], mano: <Lanza />, manoAtras: <Escudo c1={ROJO} c2={CREMA} /> }, 'VALKYRIE'),
  valquiria_nordica_2_oficial: M({ piel: pl(0), pelo: COBRE, peinado: 'suelto', vestido: '#7E3A2A', blusa: '#9AA7B2', borde: CREMA, delantal: null, capa: '#E9EEF2', forro: '#C9D2DA', cabeza: <YelmoAlado />, cuerpoX: <Malla a={0.92} />, brazo: [30, 70], mano: <Lanza />, manoAtras: <Escudo c1={AZUL} c2={CREMA} /> }, 'VALKYRIE'),
  valquiria_nordica_3_oficial: M({ piel: pl(10), pelo: NEGRO_P, peinado: 'trenza', vestido: '#2F5D80', blusa: '#9AA7B2', borde: CREMA, delantal: null, capa: '#E9EEF2', forro: '#C9D2DA', cabeza: <YelmoAlado />, cuerpoX: <Malla a={0.92} />, brazo: [20, 40], mano: <EspadaNordica />, manoAtras: <Escudo c1={VERDE} c2={CREMA} dibujo="mitad" /> }, 'VALKYRIE'),
  norna_nordica_oficial: M({ piel: pl(1), pelo: BLANCO_P, peinado: 'nada', cuerpo: 'viejo', vestido: '#3A4A5A', blusa: '#6E7F8E', delantal: null, capa: '#2A3440', capaBorde: '#C9D2DA', cabeza: <Velo c="#C9D2DA" banda="#3A4A5A" largo={90} />, brazo: [30, 50], mano: <Baston alto={170} /> }, 'NORN'),
  norna_nordica_2_oficial: M({ piel: pl(4), pelo: CASTANO, peinado: 'suelto', vestido: '#4E6E5A', blusa: '#8FB0A0', delantal: null, capa: '#2A3A34', capaBorde: '#C9D2DA', brazo: [60, 40], mano: <Hilo /> }, 'NORN'),
  norna_nordica_3_oficial: M({ piel: pl(10), pelo: RUBIO, peinado: 'suelto', vestido: '#E9EEF2', blusa: '#F7F3EA', delantal: null, capa: '#9AA7B2', capaBorde: CREMA, brazo: [40, 30] }, 'NORN'),
  skald_nordico_oficial: H({ piel: pl(7), pelo: CASTANO, peinado: 'melena', barba: 'corta', tunica: '#7A2340', borde: ORO, pantalon: '#3A3F48', capa: '#2F5D80', capaCorta: true, brazo: [40, 80], mano: <Lira /> }, 'SKALD'),
  // —— Animales ——
  caballo_nordico_oficial: D(Caballo, { s: 1, color: '#8A5A3A', crin: '#2A1C14' }, 'HORSE'),
  caballo_nordico_2_oficial: D(Caballo, { s: 1, color: '#D9B98A', crin: '#3A2A20', patasC: '#B9986A', hocico: '#8A6A4A' }, 'HORSE'),
  lobo_nordico_oficial: D(Lobo, { s: 1 }, 'WOLF'),
  cabra_nordica_oficial: D(Cabra, { s: 1 }, 'GOAT'),
  cabra_nordica_2_oficial: D(Cabra, { s: 1, color: '#9EA4AA', manchas: '#5E6670' }, 'GOAT'),
  ciervo_nordico_oficial: D(Ciervo, { s: 1 }, 'DEER'),
  pez_nordico_oficial: D(Salmon, { s: 1.2 }, 'SALMON'),
  serpiente_nordica_oficial: D(Vibora, { s: 1.3 }, 'SNAKE'),
  cuervo_nordico_oficial: D(Ave, { s: 1.3 }, 'RAVEN'),
  cuco_nordico_oficial: D(Ave, { s: 1.05, color: '#8A8F96', ala2: '#6B6F75', pico: '#C9A26B', brillo: '#B9BEC4', panza: '#D5DAE0', rayado: true }, 'CUCKOO'),
  gaviota_nordica_oficial: D(Ave, { s: 1.3, color: '#F2EEE6', ala2: '#9AA7B2', pico: '#E9C46A', brillo: '#C9D2DA' }, 'SEAGULL'),
  aguila_nordica_oficial: D(Aguila, { s: 1 }, 'EAGLE'),
};
export const NOMBRE_EN_NORDICO_OFICIAL: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_NORDICO_OFICIAL).filter(([, f]) => f.griego).map(([k, f]) => [k, f.griego as string]));
