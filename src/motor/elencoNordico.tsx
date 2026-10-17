// Diseños oficiales de Thor, Odín y Loki (2026-10-15), para los Shorts "Who is…?" y los episodios nuevos.
// Anclados en las Eddas, no en Marvel: Thor = barba roja salvaje, Mjölnir de mango corto, cinturón Megingjörð y
// guantes de hierro Járngreipr; Odín = alto, tuerto, sombrero de ala ancha, barba gris larga, capa, Gungnir y los
// cuervos Huginn y Muninn; Loki = hombre flaco, pelo negro peinado hacia atrás, perilla, túnica verde con ribete
// de oro, pantalón oscuro, botas y capa corta verde oscuro (simple, que se reconozca de un vistazo).
// Dos versiones para comparar (los thor/odin/loki de elenco.tsx quedan intactos):
// Loki: cabeza igual a la de Odín (misma construcción), hombros rectos, cadera angosta, túnica recta con pantalón.
//   *_muneco = el muñeco de siempre (silueta oscura de vasija) con la identidad agregada en accesorios.
//   *_oficial = versión aprobada: piel de color, ropa en capas y más detalle (mismo motor y mismas poses).
// Después se sumaron Freya, Frigg, Týr, Baldr, Heimdall, Hel, Sif, Freyr y Njörd (*_oficial) con la misma receta.
// Piezas en coordenadas del Personaje: cuerpo/detras con origen en los pies; cabeza con el ojo en (18,-6).
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, type P, type PersonajeProps } from '../comun/vasija';
import type { Ficha } from './elenco';

const N = '#132233'; // contorno (el negro del tema runas)
const NN = N;
const NEGRO = '#140A04';
const ROJO = '#A8322B', ORO = '#E9C46A', CREMA = '#EAF3F9', BLANCO = '#FFFFFF';
const PELO_THOR = '#C2462A', PELO_THOR_CLARO = '#E0703F';
const GRIS_ODIN = '#D5DCE2';
const HIERRO = '#8D99A6';
const VERDE = '#2F6B45'; // túnica de Loki
const r1 = (v: number) => v.toFixed(1);

// ---------- cabeza ----------
/** Melena salvaje de Thor: rulos redondos y tupidos (nada de puntas: las llamas son de Loki). */
const MelenaThor: React.FC<{ c?: string; luz?: string }> = ({ c = PELO_THOR, luz = PELO_THOR_CLARO }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 14) * 1.5;
  const lobulos: P[] = Array.from({ length: 13 }, (_, i) => {
    const a = ((215 - i * 13.5) * Math.PI) / 180, r = (i % 2 ? 41 : 50) + (i < 3 ? o : 0);
    return [-6 + Math.cos(a) * r, -6 - Math.sin(a) * r] as P;
  });
  const pts: P[] = [[-30, 44 + o], ...lobulos, [24, -34], [2, -36], [-18, -26], [-26, -2], [-24, 30]];
  return (
    <g>
      <path d={suave(pts, true, 1)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      {[[-44, -10], [-36, -34], [-14, -46], [6, -44], [-42, 18]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q 6 -8 12 -2`} stroke={luz} strokeWidth={2.4} fill="none" strokeLinecap="round" />)}
    </g>
  );
};
/** Barba roja tupida de Thor (sale de la mandíbula y baja al pecho), con trenza y aro de hierro opcional. */
const BarbaThor: React.FC<{ c?: string; luz?: string; trenza?: boolean }> = ({ c = PELO_THOR, luz = PELO_THOR_CLARO, trenza }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 16) * 1.5;
  const pts: P[] = [[-6, 12], [10, 14], [24, 22], [36, 24], [46, 40], [44, 60 + o], [34, 78 + o], [24, 70], [14, 86 + o], [4, 70], [-8, 62], [-14, 40], [-16, 22]];
  return (
    <g>
      <path d={suave(pts, true, 0.75)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      {/* bigote */}
      <path d="M22 18 C 30 14, 38 18, 42 26 C 34 24, 28 24, 22 24 Z" fill={c} stroke={N} strokeWidth={1.6} />
      {[[2, 26, 6, 56], [14, 30, 18, 66], [26, 32, 30, 62], [36, 36, 38, 54]].map(([a, b, c2, d], i) => <path key={i} d={`M${a} ${b} Q ${a + 6} ${(b + d) / 2} ${c2} ${d}`} stroke={luz} strokeWidth={2} fill="none" strokeLinecap="round" />)}
      {trenza && <g><path d={`M18 78 L 18 ${102 + o}`} stroke={c} strokeWidth={9} strokeLinecap="round" /><path d={`M18 78 L 18 ${102 + o}`} stroke={N} strokeWidth={1.2} strokeDasharray="3 4" /><rect x={11} y={86} width={14} height={9} rx={2} fill={HIERRO} stroke={N} strokeWidth={1.6} /></g>}
    </g>
  );
};
/** Barba gris larga de Odín (hasta el pecho) y pelo largo por la espalda. */
const BarbaOdin: React.FC<{ c?: string; trenza?: boolean }> = ({ c = GRIS_ODIN, trenza }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 18) * 2;
  return (
    <g>
      <path d={suave([[-28, 0], [-40, 40], [-42 + o, 96], [-26, 100], [-20, 50], [-14, 10]], true, 0.7)} fill={c} stroke={N} strokeWidth={2} />
      <path d={suave([[-4, 12], [12, 14], [26, 22], [38, 26], [40, 52], [34, 88], [24 + o, 120], [14, 100], [4, 72], [-8, 44], [-12, 22]], true, 0.75)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M22 18 C 30 15, 38 19, 42 27 C 34 25, 28 25, 22 25 Z" fill={c} stroke={N} strokeWidth={1.6} />
      {[[4, 28, 10, 70], [16, 32, 22, 96], [28, 34, 30, 74]].map(([a, b, c2, d], i) => <path key={i} d={`M${a} ${b} Q ${a + 5} ${(b + d) / 2} ${c2} ${d}`} stroke="#93A3B2" strokeWidth={1.8} fill="none" strokeLinecap="round" />)}
      {trenza && <rect x={16 + o * 0.5} y={96} width={14} height={8} rx={2} fill={ORO} stroke={N} strokeWidth={1.4} />}
    </g>
  );
};
/** Parche de Odín con su tira (el ojo que dejó en el pozo de Mímir). claro = tira y borde claros (muñeco oscuro). */
const Parche: React.FC<{ claro?: boolean }> = ({ claro }) => (
  <g>
    <path d="M-28 -20 L 9 -12 M27 -12 L 36 -17" stroke={claro ? '#9DBBD1' : NEGRO} strokeWidth={3} strokeLinecap="round" />
    <path d="M8 -14 Q 18 -19 29 -12 Q 28 1 18 4 Q 8 1 8 -14 Z" fill={NEGRO} stroke={claro ? '#9DBBD1' : CREMA} strokeWidth={claro ? 2.2 : 1.2} />
  </g>
);
/** Sombrero de viajero de ala ancha y caída (Odín como Grímnir/Gangleri). */
const Sombrero: React.FC<{ c?: string; banda?: string }> = ({ c = '#33506B', banda = '#1C2E40' }) => (
  <g transform="rotate(-4)">
    <path d="M-32 -22 C -34 -50, -18 -62, 2 -62 C 20 -62, 30 -52, 30 -22 Z" fill={c} stroke={N} strokeWidth={2.5} />
    <path d="M-14 -60 C -6 -52, 6 -52, 14 -60" stroke={N} strokeWidth={2} fill="none" />
    <path d="M-29 -32 C -10 -38, 12 -38, 29 -32 L 29 -24 C 10 -30, -10 -30, -30 -24 Z" fill={banda} stroke={N} strokeWidth={1.5} />
    <path d="M-74 -8 C -56 -30, 56 -34, 80 -12 C 88 -4, 82 4, 70 -2 C 44 -16, -38 -14, -64 2 C -76 8, -82 -2, -74 -8 Z" fill={c} stroke={N} strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M-50 -12 C -20 -22, 30 -24, 60 -12" stroke="#5E7F99" strokeWidth={1.6} fill="none" />
  </g>
);
/** Pelo de Loki: negro, peinado hacia atrás y pegado a la cabeza, hasta la nuca; tapa la oreja con una patilla que
 * baja hasta la perilla (va con peloCorto: sin mechones largos ni rayas en el cuello). Rayas de peine en `luz`. */
const PeloLoki: React.FC<{ c?: string; luz?: string }> = ({ c = '#141518', luz = '#6B7380' }) => {
  const pts: P[] = [[22, -25], [18, -37], [2, -43], [-18, -39], [-32, -26], [-37, -6], [-36, 14], [-31, 30], [-22, 34], [-17, 20], [-15, 6], [-8, 4], [-4, 8], [-1, 4], [-2, -10], [6, -21], [15, -26]];
  return (
    <g>
      <path d={suave(pts, true, 0.9)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      {[[16, -32, -28, -24], [12, -26, -30, -6], [4, -20, -28, 14]].map(([x0, y0, x1, y1], i) => <path key={i} d={`M${x0} ${y0} Q ${(x0 + x1) / 2} ${Math.min(y0, y1) - 12 + i * 4} ${x1} ${y1}`} stroke={luz} strokeWidth={1.6} fill="none" strokeLinecap="round" />)}
    </g>
  );
};
/** Perilla de Loki: chiquita y en punta, solo en el mentón (mejilla y mandíbula limpias), con bigote fino. */
const BarbaLoki: React.FC<{ c?: string; luz?: string }> = ({ c = '#141518', luz = '#6B7380' }) => (
  <g>
    <path d={suave([[14, 29], [22, 27], [28, 25], [29, 31], [25, 38], [20, 46], [16, 38], [13, 33]], true, 0.75)} fill={c} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
    <path d="M24 19.5 C 29 17.5, 35 19, 38 23.5 C 33 22, 28 22, 24 22.5 Z" fill={c} stroke={N} strokeWidth={1.2} />
    <path d="M20 32 Q 21 37 20 41" stroke={luz} strokeWidth={1.3} fill="none" strokeLinecap="round" />
  </g>
);

// ---------- cuerpo ----------
/** Megingjörð: cinturón de fuerza (placas de oro y hebilla redonda con piedra roja). a = ancho del cuerpo. */
const Megingjord: React.FC<{ a: number }> = ({ a }) => (
  <g>
    <path d={`M${r1(-31 * a)} -232 L ${r1(28 * a)} -234 L ${r1(28 * a)} -204 L ${r1(-31 * a)} -202 Z`} fill="#5A3A22" stroke={N} strokeWidth={2.2} />
    {[-0.8, -0.45, -0.1, 0.25, 0.6].map((k) => <rect key={k} x={r1(k * 30 * a - 7)} y={-229} width={14} height={22} rx={2} fill={ORO} stroke={N} strokeWidth={1.4} />)}
    {[-0.8, -0.45, -0.1, 0.25, 0.6].map((k) => <path key={k} d={`M${r1(k * 30 * a - 4)} -224 l 8 12 M${r1(k * 30 * a + 4)} -224 l -8 12`} stroke={N} strokeWidth={1.2} />)}
    <circle cx={r1(28 * a)} cy={-218} r={13} fill={ORO} stroke={N} strokeWidth={2.2} />
    <circle cx={r1(28 * a)} cy={-218} r={5.5} fill={ROJO} stroke={N} strokeWidth={1.2} />
  </g>
);
/** Cuervo posado (origen = patas, mirando a la derecha). */
const Cuervo: React.FC<{ s?: number; brillo?: string; aleteo?: number; claro?: boolean }> = ({ s = 1, brillo = '#5B7A99', aleteo = 0, claro }) => {
  const f = useCurrentFrame(), cab = Math.sin(f / 9 + aleteo) * 4;
  const N = claro ? '#9DBBD1' : NN;
  return (
    <g transform={`scale(${s})`}>
      <path d="M-24 -8 L -44 4 L -40 -6 L -46 -2 L -30 -16 Z" fill="#10161D" stroke={N} strokeWidth={1.5} />
      <path d={suave([[-26, -10], [-10, -28], [10, -32], [22, -22], [14, -6], [-6, -2]], true, 0.8)} fill="#10161D" stroke={N} strokeWidth={1.5} />
      <path d="M-18 -14 C -8 -24, 6 -26, 12 -20" stroke={brillo} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <path d="M-14 -8 C -6 -14, 4 -16, 10 -12" stroke={brillo} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <g transform={`rotate(${cab} 18 -30)`}>
        <circle cx={18} cy={-34} r={10} fill="#10161D" stroke={N} strokeWidth={1.5} />
        <path d="M25 -38 L 40 -32 L 25 -28 Z" fill="#2A3440" stroke={N} strokeWidth={1.3} strokeLinejoin="round" />
        <circle cx={21} cy={-36} r={2.6} fill={BLANCO} /><circle cx={21.6} cy={-36} r={1.2} fill={NEGRO} />
      </g>
      <path d="M-4 -2 L -6 6 M6 -4 L 6 6 M-10 6 H 2 M0 6 H 12" stroke="#3A2A20" strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};
/** Cuervo en vuelo (alas abiertas que aletean). */
const CuervoVuela: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const f = useCurrentFrame(), a = Math.sin(f / 4) * 16;
  return (
    <g transform={`scale(${s})`}>
      <path d={`M-6 -2 C -20 ${-30 - a}, -44 ${-40 - a}, -66 ${-36 - a} C -50 ${-26 - a * 0.6}, -40 -14, -24 -4 Z`} fill="#10161D" stroke={N} strokeWidth={1.5} />
      <path d={suave([[-30, 0], [-10, -10], [14, -10], [26, -4], [14, 4], [-10, 6]], true, 0.8)} fill="#10161D" stroke={N} strokeWidth={1.5} />
      <path d="M-28 0 L -46 -6 L -44 6 Z" fill="#10161D" stroke={N} strokeWidth={1.3} />
      <circle cx={24} cy={-6} r={8} fill="#10161D" stroke={N} strokeWidth={1.4} />
      <path d="M30 -9 L 42 -4 L 30 -1 Z" fill="#2A3440" stroke={N} strokeWidth={1.2} />
      <circle cx={26} cy={-8} r={2.2} fill={BLANCO} />
      <path d={`M2 -4 C -4 ${-26 - a * 0.7}, -18 ${-34 - a * 0.7}, -36 ${-32 - a * 0.7} C -22 ${-20 - a * 0.4}, -12 -10, 4 -2 Z`} fill="#1A222C" stroke={N} strokeWidth={1.3} />
    </g>
  );
};
/** Túnica de arriba (camisa) que tapa el torso desnudo: color y borde de tela. */
const Camisa: React.FC<{ a: number; c: string; borde?: string; mitad?: string; cuadrada?: boolean }> = ({ a, c, borde = ORO, mitad, cuadrada }) => {
  // cuadrada = hombros rectos y anchos que bajan en V hasta una cadera angosta (silueta de hombre flaco)
  const torso: P[] = cuadrada
    ? [[-33 * a, -306], [-8 * a, -309], [22 * a, -308], [39 * a, -300], [37 * a, -278], [29 * a, -244], [27 * a, -203], [-31 * a, -201], [-34 * a, -246], [-37 * a, -282]]
    : [[-20 * a, -300], [18 * a, -304], [34 * a, -282], [30 * a, -248], [22 * a, -212], [-22 * a, -208], [-30 * a, -250], [-30 * a, -284]];
  const id = `cam${Math.round(a * 100)}${c.replace('#', '')}${cuadrada ? 'q' : ''}`;
  return (
    <g>
      <path d={suave(torso, true, cuadrada ? 0.45 : 1)} fill={c} stroke={N} strokeWidth={2} />
      {mitad && <><defs><clipPath id={id}><path d={suave(torso, true, cuadrada ? 0.45 : 1)} /></clipPath></defs><path d={`M${-40 * a} -320 L ${4 * a} -320 L ${-14 * a} -200 L ${-40 * a} -200 Z`} fill={mitad} clipPath={`url(#${id})`} /></>}
      <path d={suave([[-14 * a, -300], [6 * a, -286], [22 * a, -300]])} stroke={borde} strokeWidth={5} fill="none" strokeLinecap="round" />
      {cuadrada && <><path d={`M${r1(-32 * a)} -219 L ${r1(28 * a)} -221 L ${r1(28 * a)} -209 L ${r1(-32 * a)} -207 Z`} fill="#3A2A20" stroke={N} strokeWidth={1.6} /><rect x={r1(18 * a)} y={-222} width={12} height={15} rx={2} fill={ORO} stroke={N} strokeWidth={1.4} /></>}
    </g>
  );
};
/** Manto de piel sobre los hombros (Thor en el invierno de Jötunheim). */
const MantoPiel: React.FC<{ a: number; c?: string }> = ({ a, c = '#E9E2D2' }) => (
  <g>
    <path d={suave([[-38 * a, -296], [-20 * a, -314], [10 * a, -316], [34 * a, -300], [30 * a, -278], [16 * a, -286], [0, -282], [-20 * a, -282], [-40 * a, -270]], true, 0.6)} fill={c} stroke={N} strokeWidth={2} />
    {Array.from({ length: 7 }, (_, i) => { const x = -34 * a + i * 10 * a; return <path key={i} d={`M${r1(x)} ${-286 + Math.sin(i) * 3} l 3 ${8 + (i % 2) * 4}`} stroke="#B9AE98" strokeWidth={2} strokeLinecap="round" />; })}
  </g>
);
/** Capa larga hasta los tobillos que cae por la espalda (detrás del cuerpo). */
const CapaLarga: React.FC<{ c: string; forro?: string; borde?: string; zigzag?: boolean; corta?: boolean; arcoiris?: boolean }> = ({ c, forro, borde = ORO, zigzag, corta, arcoiris }) => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f / 16 + k) * (3 + k * 1.5);
  const ruedo: P[] = zigzag
    ? [[-96 + o(4), -14], [-84, -34], [-74 + o(3), -10], [-62, -32], [-50 + o(2), -8], [-38, -30], [-22, -10]]
    : [[-92 + o(4), -12], [-60 + o(2), -6], [-24, -8]];
  const pts: P[] = [[-14, -304], [-36, -292], [-56 + o(1), -200], [-78 + o(3), -90], ...ruedo, [-8, -150], [4, -286]];
  return (
    <g transform={corta ? 'translate(0 -304) scale(1 0.5) translate(0 304)' : undefined}>
      <path d={suave(pts, true, 0.5)} fill={c} stroke={N} strokeWidth={2.5} strokeLinejoin="round" />
      {forro && <path d={suave([[-36, -292], [-56 + o(1), -200], [-78 + o(3), -90], ruedo[0], [-80 + o(3), -40], [-60, -140], [-40, -240]], true, 0.5)} fill={forro} stroke={N} strokeWidth={1.5} />}
      <path d={suave(ruedo)} stroke={borde} strokeWidth={5} fill="none" strokeLinecap="round" />
      {arcoiris && ['#C8463A', '#E9A23B', '#E9D35B', '#4E9A5A', '#3E78B5', '#7A4E9E'].map((col, i) => <path key={col} d={suave(ruedo)} stroke={col} strokeWidth={4} fill="none" strokeLinecap="round" transform={`translate(${i * 1.2} ${-6 - i * 4})`} />)}
    </g>
  );
};
/** Broche de la capa (nudo de tres puntas) en el hombro. */
const Broche: React.FC<{ x: number; y: number; c?: string }> = ({ x, y, c = ORO }) => (
  <g transform={`translate(${x} ${y})`}><circle r={9} fill={c} stroke={N} strokeWidth={1.8} /><path d="M0 -5 L 4.5 3 L -4.5 3 Z" fill="none" stroke={N} strokeWidth={1.4} /></g>
);

// ---------- piezas de los demás dioses (oficiales) ----------
/** Pone piezas en coordenadas de la cabeza desde `detras` (pelo largo que cae por la espalda, halos). */
const EnCabeza: React.FC<{ a?: number; children: React.ReactNode }> = ({ a = 1, children }) => <g transform={`translate(${r1(20 * a)} -334) rotate(-6)`}>{children}</g>;
/** Melena larga por la espalda (va en `detras`, con EnCabeza). largo = hasta dónde baja (coords de cabeza). */
const MelenaLarga: React.FC<{ c: string; luz: string; largo?: number; ancho?: number }> = ({ c, luz, largo = 120, ancho = 1 }) => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f / 18 + k) * (2 + k);
  const pts: P[] = [[-4, -40], [-32, -32], [-46, -4], [-58 * ancho + o(1), largo * 0.3], [-66 * ancho + o(2), largo * 0.62], [-62 * ancho + o(3), largo * 0.9], [-48 * ancho + o(3), largo], [-38 + o(2), largo - 8], [-32 + o(2), largo * 0.6], [-24, largo * 0.3], [-10, 10]];
  return (
    <g>
      <path d={suave(pts, true, 0.8)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${-40 + i * 7} ${4 + i * 2} Q ${(-60 + i * 8) * ancho + o(i)} ${largo * 0.5} ${(-54 + i * 8) * ancho + o(i + 1)} ${largo * (0.9 - i * 0.12)}`} stroke={luz} strokeWidth={2} fill="none" strokeLinecap="round" />)}
    </g>
  );
};
/** Pelo sobre la cabeza (raya y caída detrás de la oreja): tapa el cuero y deja la cara libre. */
const CapPelo: React.FC<{ c: string; luz: string; flequillo?: boolean }> = ({ c, luz, flequillo }) => (
  <g>
    <path d={suave([[24, -26], [16, -38], [-2, -43], [-22, -38], [-34, -22], [-37, 2], [-33, 26], [-22, 30], [-17, 12], [-12, 0], [-6, -10], [4, -20], [14, flequillo ? -18 : -24]], true, 0.9)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
    {[[14, -34, -28, -18], [6, -28, -30, 2]].map(([x0, y0, x1, y1], i) => <path key={i} d={`M${x0} ${y0} Q ${(x0 + x1) / 2} ${Math.min(y0, y1) - 8} ${x1} ${y1}`} stroke={luz} strokeWidth={1.8} fill="none" strokeLinecap="round" />)}
  </g>
);
/** Barba corta y prolija (Týr, Freyr, Heimdall, Njörd). */
const BarbaCorta: React.FC<{ c: string; luz: string; largo?: number }> = ({ c, luz, largo = 0 }) => (
  <g>
    <path d={suave([[-14, 6], [-10, 22], [0, 32 + largo * 0.4], [14, 40 + largo], [26, 36 + largo * 0.7], [34, 26], [30, 22], [22, 26], [10, 22], [0, 12], [-6, 4]], true, 0.8)} fill={c} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
    <path d="M24 18.5 C 30 15.5, 37 18, 40 24 C 34 22, 28 22.5, 24 23 Z" fill={c} stroke={N} strokeWidth={1.3} />
    {[[2, 20, 8, 32], [12, 26, 16, 36 + largo * 0.6]].map(([a, b, c2, d], i) => <path key={i} d={`M${a} ${b} Q ${a + 4} ${(b + d) / 2} ${c2} ${d}`} stroke={luz} strokeWidth={1.4} fill="none" strokeLinecap="round" />)}
  </g>
);
/** Vestido de mujer nórdica: delantal (hangerock) sobre el torso con broche ovalado de bronce y sarta de cuentas. */
const Delantal: React.FC<{ c: string; borde?: string; cuentas?: string[] }> = ({ c, borde = ORO, cuentas = ['#C9A14A', '#2F6B8A', '#B8452C'] }) => {
  const a = 0.92;
  return (
    <g>
      <path d={suave([[-28 * a, -282], [28 * a, -288], [33 * a, -270], [29 * a, -246], [22 * a, -212], [-22 * a, -208], [-30 * a, -250]], true, 0.6)} fill={c} stroke={N} strokeWidth={2} />
      <path d={`M${r1(22 * a)} -290 L ${r1(18 * a)} -304 M${r1(-20 * a)} -284 L ${r1(-16 * a)} -300`} stroke={c} strokeWidth={6} strokeLinecap="round" />
      <path d={suave([[-28 * a, -282], [0, -284], [28 * a, -288]])} stroke={borde} strokeWidth={4} fill="none" strokeLinecap="round" />
      {Array.from({ length: 7 }, (_, i) => { const t = i / 6; return <circle key={i} cx={r1(-14 + t * 36)} cy={r1(-278 + Math.sin(t * Math.PI) * 14)} r={3.2} fill={cuentas[i % cuentas.length]} stroke={N} strokeWidth={1} />; })}
      <ellipse cx={r1(22 * a)} cy={-284} rx={8} ry={11} fill="#B9873A" stroke={N} strokeWidth={1.6} />
      <ellipse cx={r1(22 * a)} cy={-284} rx={4} ry={6} fill="none" stroke={N} strokeWidth={1} />
    </g>
  );
};
/** Brísingamen: el collar de Freyja (oro y ámbar), grande y bien a la vista sobre el pecho. */
const Brisingamen: React.FC = () => (
  <g>
    <path d={suave([[-14, -302], [0, -278], [14, -268], [30, -284]])} stroke="#B9873A" strokeWidth={3} fill="none" />
    {Array.from({ length: 9 }, (_, i) => { const t = i / 8, x = -12 + t * 42, y = -300 + Math.sin(t * Math.PI) * 34 - t * 6; return <g key={i}><ellipse cx={r1(x)} cy={r1(y)} rx={i === 5 ? 8 : 5.5} ry={i === 5 ? 10 : 6.5} fill={i % 2 ? ORO : '#E08A2A'} stroke={N} strokeWidth={1.4} /><circle cx={r1(x - 1.5)} cy={r1(y - 2)} r={1.6} fill="#FFF4D0" /></g>; })}
  </g>
);
/** Capa de plumas de halcón (la que Freyja le presta a Loki): pardo con hileras de plumas. */
const CapaHalcon: React.FC = () => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f / 16 + k) * (3 + k * 1.5);
  const pts: P[] = [[-12, -306], [-40, -290], [-66 + o(1), -200], [-90 + o(3), -80], [-96 + o(4), -20], [-70, -30], [-50 + o(2), -14], [-30, -30], [-14, -150], [4, -288]];
  return (
    <g>
      <defs><clipPath id="capaHalcon"><path d={suave(pts, true, 0.5)} /></clipPath></defs>
      <path d={suave(pts, true, 0.5)} fill="#8A6440" stroke={N} strokeWidth={2.5} strokeLinejoin="round" />
      <g clipPath="url(#capaHalcon)">{Array.from({ length: 6 }, (_, fila) => Array.from({ length: 3 + Math.floor(fila / 2) }, (_, i) => {
        const y = -270 + fila * 44, x = -34 - fila * 10 - i * 14 + (fila % 2) * 6;
        return <path key={`${fila}-${i}`} d={`M${x - 7} ${y} q 7 18 14 0`} fill="#B08458" stroke={N} strokeWidth={1.3} />;
      }))}</g>
      {[[-96 + o(4), -20], [-70, -30], [-50 + o(2), -14]].map(([x, y], i) => <path key={i} d={`M${r1(x)} ${y} l 4 -16 l 6 14 Z`} fill="#5E4026" stroke={N} strokeWidth={1.3} />)}
    </g>
  );
};
/** Gato sentado de perfil (los gatos del carro de Freyja; el gatito de Bastet). Origen = patas, mira a la derecha. */
export const GatoSentado: React.FC<{ c?: string; raya?: string; s?: number; ojo?: string; contorno?: string; aro?: boolean }> = ({ c = '#8C96A0', raya = '#5F6A75', s = 1, ojo = '#D9B23A', contorno = N, aro }) => {
  const f = useCurrentFrame(), cola = Math.sin(f / 12) * 6;
  return (
    <g transform={`scale(${s})`}>
      <path d={`M-22 -6 C -46 -4, -52 ${-20 + cola}, -40 ${-34 + cola}`} stroke={c} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d={`M-22 -6 C -46 -4, -52 ${-20 + cola}, -40 ${-34 + cola}`} stroke={contorno} strokeWidth={1.2} fill="none" strokeDasharray="0" opacity={0.25} />
      <path d={suave([[-26, 0], [-30, -24], [-18, -50], [0, -58], [14, -52], [16, -30], [12, 0]], true, 0.8)} fill={c} stroke={contorno} strokeWidth={2} />
      {[-44, -34, -24].map((y, i) => <path key={i} d={`M${-22 + i * 2} ${y} q 8 2 14 -2`} stroke={raya} strokeWidth={2.4} fill="none" strokeLinecap="round" />)}
      <path d="M8 -4 L 10 -30 M16 0 L 18 -12" stroke={contorno} strokeWidth={1.4} />
      <g transform="translate(10 -64)">
        <path d="M-8 -10 L -6 -30 L 6 -16 Z M6 -16 L 14 -32 L 18 -12 Z" fill={c} stroke={contorno} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M-5 -14 L -4 -24 L 2 -17 Z" fill="#D9A3A0" />
        <path d={suave([[-14, 4], [-10, -12], [6, -18], [20, -12], [28, 0], [24, 8], [10, 12], [-6, 12]], true, 0.9)} fill={c} stroke={contorno} strokeWidth={2} />
        <ellipse cx={14} cy={-4} rx={4} ry={3.4} fill={ojo} stroke={contorno} strokeWidth={1} /><ellipse cx={15} cy={-4} rx={1.2} ry={3} fill={NEGRO} />
        <path d="M26 2 l 3 1 l -2 2 Z" fill="#C46A6A" />
        <path d="M24 6 l 12 -2 M24 7 l 12 3" stroke={contorno} strokeWidth={0.8} opacity={0.7} />
        {aro && <circle cx={2} cy={4} r={3.4} fill="none" stroke={ORO} strokeWidth={2} />}
      </g>
    </g>
  );
};
/** Rueca (Frigg hila las nubes): vara con el copo de lana arriba y el huso colgando del hilo. Origen = mano. */
const Rueca: React.FC = () => {
  const f = useCurrentFrame(), g = Math.sin(f / 10) * 4;
  return (
    <g>
      <path d="M-2 40 L 4 -120" stroke="#7A5232" strokeWidth={6} strokeLinecap="round" />
      <path d={suave([[4, -120], [-10, -132], [-12, -156], [2, -172], [16, -160], [16, -134]], true, 0.9)} fill="#F2EEE6" stroke={N} strokeWidth={2} />
      {[-150, -140, -130].map((y) => <path key={y} d={`M-8 ${y} q 10 -4 20 0`} stroke="#C9C2B4" strokeWidth={1.4} fill="none" />)}
      <path d={`M14 -138 Q 34 -100 ${30 + g} -40`} stroke="#E8E2D6" strokeWidth={1.4} fill="none" />
      <g transform={`translate(${30 + g} -40)`}><path d="M0 -6 L 0 30" stroke="#7A5232" strokeWidth={3} /><ellipse cx={0} cy={12} rx={6} ry={8} fill="#F2EEE6" stroke={N} strokeWidth={1.2} /><circle cx={0} cy={26} r={4} fill="#5A3A22" /></g>
    </g>
  );
};
/** Llavero de ama de casa colgando del cinturón (Frigg). */
const Llaves: React.FC<{ x?: number }> = ({ x = 16 }) => (
  <g transform={`translate(${x} -212)`}>
    <path d="M0 0 L -2 26 M4 0 L 8 30 M-2 0 L -10 22" stroke="#7A6A50" strokeWidth={1.6} />
    {[[-2, 26], [8, 30], [-10, 22]].map(([kx, ky], i) => <g key={i} transform={`translate(${kx} ${ky})`}><circle r={4} fill="none" stroke="#B9873A" strokeWidth={2.4} /><path d="M0 4 V 16 M0 12 h 4 M0 16 h 5" stroke="#B9873A" strokeWidth={2.4} /></g>)}
    <circle r={4} fill="#B9873A" stroke={N} strokeWidth={1.2} />
  </g>
);
/** Pañuelo de casada (Frigg): blanco, cubre el pelo y cae por la nuca. */
const Panuelo: React.FC = () => (
  <g>
    <path d={suave([[26, -24], [18, -40], [-4, -46], [-28, -38], [-40, -12], [-44, 30], [-40, 70], [-22, 64], [-18, 30], [-14, 6], [-4, -12], [8, -22]], true, 0.85)} fill="#F4F1EA" stroke={N} strokeWidth={2} />
    <path d="M24 -26 C 10 -30, -10 -26, -26 -12" stroke="#5C8DB8" strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M-30 0 Q -36 30 -32 58 M-22 4 Q -26 30 -24 56" stroke="#CFC8BA" strokeWidth={1.4} fill="none" />
  </g>
);
/** Espada nórdica en la mano (hoja hacia arriba, guarda y pomo). Origen = mano. */
const EspadaNordica: React.FC<{ hoja?: string; brillo?: boolean; ang?: number }> = ({ hoja = '#D6DDE3', brillo, ang = 8 }) => (
  <g transform={`rotate(${ang})`}>
    {brillo && <path d="M0 -40 L 0 -170" stroke="#FFF3C4" strokeWidth={22} strokeLinecap="round" opacity={0.35} />}
    <path d="M-6 -16 L -6 -160 L 0 -172 L 6 -160 L 6 -16 Z" fill={hoja} stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <path d="M0 -24 V -156" stroke="#9AA7B2" strokeWidth={2} />
    <rect x={-20} y={-20} width={40} height={7} rx={3} fill={ORO} stroke={N} strokeWidth={1.6} />
    <rect x={-4} y={-13} width={8} height={24} rx={2} fill="#4A3020" stroke={N} strokeWidth={1.4} />
    <ellipse cx={0} cy={14} rx={9} ry={6} fill={ORO} stroke={N} strokeWidth={1.6} />
  </g>
);
/** Espada envainada colgando de la cadera (Týr). */
const Vaina: React.FC = () => (
  <g transform="translate(-6 -212) rotate(18)">
    <rect x={-6} y={0} width={12} height={130} rx={4} fill="#4A3020" stroke={N} strokeWidth={2} />
    <path d="M-6 118 h 12 v 12 h -12 Z" fill={ORO} stroke={N} strokeWidth={1.4} />
    <rect x={-18} y={-8} width={36} height={7} rx={3} fill={ORO} stroke={N} strokeWidth={1.6} />
    <rect x={-4} y={-30} width={8} height={22} rx={2} fill="#2A1C12" stroke={N} strokeWidth={1.4} />
    <ellipse cx={0} cy={-32} rx={8} ry={5} fill={ORO} stroke={N} strokeWidth={1.4} />
  </g>
);
/** Escudo redondo vikingo colgado a la espalda (rojo y blanco, umbo de hierro). */
const EscudoEspalda: React.FC<{ c1?: string; c2?: string }> = ({ c1 = ROJO, c2 = CREMA }) => (
  <g transform="translate(-34 -250)">
    <circle r={58} fill={c2} stroke={N} strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M0 0 L ${r1(Math.cos((i * Math.PI) / 2) * 56)} ${r1(Math.sin((i * Math.PI) / 2) * 56)} A 56 56 0 0 1 ${r1(Math.cos(((i + 0.5) * Math.PI) / 2) * 56)} ${r1(Math.sin(((i + 0.5) * Math.PI) / 2) * 56)} Z`} fill={c1} />)}
    <circle r={58} fill="none" stroke={HIERRO} strokeWidth={5} />
    <circle r={58} fill="none" stroke={N} strokeWidth={2} />
    <circle r={14} fill={HIERRO} stroke={N} strokeWidth={2} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <circle key={i} cx={r1(Math.cos((i * Math.PI) / 4) * 50)} cy={r1(Math.sin((i * Math.PI) / 4) * 50)} r={2} fill={N} />)}
  </g>
);
/** Halo de luz de Baldr (detrás de la cabeza). */
const HaloSol: React.FC = () => {
  const f = useCurrentFrame(), g = Math.sin(f / 20) * 0.04;
  return (
    <g transform={`scale(${1 + g})`}>
      <circle r={78} fill="#FFF3C4" opacity={0.35} />
      {Array.from({ length: 16 }, (_, i) => { const a = (i * Math.PI) / 8; return <path key={i} d={`M${r1(Math.cos(a) * 52)} ${r1(Math.sin(a) * 52)} L ${r1(Math.cos(a + 0.09) * 80)} ${r1(Math.sin(a + 0.09) * 80)} L ${r1(Math.cos(a - 0.09) * 80)} ${r1(Math.sin(a - 0.09) * 80)} Z`} fill="#F2C35B" stroke="#C99A3A" strokeWidth={1} />; })}
      <circle r={56} fill={ORO} stroke="#C99A3A" strokeWidth={2} />
      <circle r={48} fill="#F6DC94" />
    </g>
  );
};
/** Gjallarhorn: el gran cuerno de Heimdall (marfil con anillos de oro). Origen = mano. */
const Gjallarhorn: React.FC = () => (
  <g transform="rotate(-22) scale(0.78)">
    <path d="M-4 6 C -10 -40, 10 -96, 64 -118 L 78 -88 C 36 -70, 16 -36, 8 8 Z" fill="#EFE6CF" stroke={N} strokeWidth={2.5} strokeLinejoin="round" />
    <ellipse cx={71} cy={-103} rx={9} ry={17} transform="rotate(-24 71 -103)" fill="#3A2A20" stroke={N} strokeWidth={2} />
    {[[0.25, 6], [0.55, 7], [0.85, 8]].map(([t, w], i) => { const x = -4 + t * 72, y = 6 - t * 118; return <path key={i} d={`M${r1(x - w)} ${r1(y + 2)} L ${r1(x + w + 6)} ${r1(y + 10)}`} stroke={ORO} strokeWidth={6} strokeLinecap="round" />; })}
    <path d="M2 6 h 6" stroke={ORO} strokeWidth={6} strokeLinecap="round" />
  </g>
);
/** Yelmo redondo sencillo con nasal (Heimdall, el guardián). */
const YelmoSimple: React.FC = () => (
  <g>
    <path d="M-34 -2 C -36 -40, -10 -52, 8 -50 C 26 -48, 34 -32, 33 -14 L 26 -14 C 12 -22, -16 -18, -34 -2 Z" fill={HIERRO} stroke={N} strokeWidth={2.2} />
    <path d="M-30 -10 C -10 -26, 14 -28, 33 -16" stroke="#C9D2DA" strokeWidth={6} fill="none" />
    <path d="M-30 -10 C -10 -26, 14 -28, 33 -16" stroke={N} strokeWidth={1.2} fill="none" strokeDasharray="2 5" />
    <path d="M24 -18 L 30 6 L 35 5 L 32 -18 Z" fill="#C9D2DA" stroke={N} strokeWidth={1.6} />
    <path d="M-2 -48 C 4 -38, 4 -28, 2 -20" stroke="#6E7A86" strokeWidth={1.6} fill="none" />
  </g>
);
/** Gavilla de trigo en el brazo (Sif, la de los campos dorados). Origen = mano. */
const Gavilla: React.FC = () => (
  <g transform="rotate(-10)">
    {Array.from({ length: 9 }, (_, i) => { const t = (i - 4) / 4, x0 = t * 6, x1 = t * 26, y1 = -78 + Math.abs(t) * 10; return <g key={i}>
      <path d={`M${r1(x0 * 0.6)} 46 L ${r1(x0)} -6 Q ${r1(x1 * 0.5)} -40 ${r1(x1)} ${r1(y1)}`} stroke="#B98A2E" strokeWidth={2.2} fill="none" />
      <path d={`M${r1(x1)} ${r1(y1)} q ${r1(t * 4 - 4)} -14 ${r1(t * 8)} -30 q ${r1(t * 2 + 5)} 14 ${r1(-t * 8)} 30 Z`} fill={ORO} stroke="#8A6420" strokeWidth={1.1} />
      {[0, 1, 2].map((k) => <path key={k} d={`M${r1(x1 + t * 2)} ${r1(y1 - 8 - k * 7)} l ${r1(-6 + t * 4)} -7 M${r1(x1 + t * 2)} ${r1(y1 - 8 - k * 7)} l ${r1(6 + t * 4)} -7`} stroke="#C9982E" strokeWidth={1} />)}
    </g>; })}
    <rect x={-11} y={-12} width={22} height={9} rx={3} fill="#8A3A2A" stroke={N} strokeWidth={1.2} />
  </g>
);
/** Gullinbursti, el jabalí de cerdas de oro de Freyr (parado, mira a la derecha). Origen = patas. */
const JabaliOro: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    {[[-30, 0], [-18, 0], [18, 0], [30, 0]].map(([x], i) => <rect key={i} x={x - 4} y={-22} width={8} height={22} rx={3} fill={i % 3 ? '#C99A3A' : '#B07F28'} stroke={N} strokeWidth={1.5} />)}
    <path d={suave([[-46, -36], [-30, -56], [0, -62], [30, -54], [48, -40], [62, -30], [64, -22], [44, -18], [10, -16], [-30, -18], [-46, -24]], true, 0.8)} fill={ORO} stroke={N} strokeWidth={2} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-34 + i * 7} ${-56 - Math.sin((i / 9) * Math.PI) * 6} l 2 -10 l 3 9`} fill="#FFE08A" stroke={N} strokeWidth={1.1} strokeLinejoin="round" />)}
    <path d="M62 -26 l 4 -2 l 0 6 Z" fill="#8A5A30" />
    <path d="M52 -24 C 58 -32, 60 -34, 58 -40" stroke="#FFF4D0" strokeWidth={2.6} fill="none" strokeLinecap="round" />
    <circle cx={44} cy={-40} r={2.6} fill={NEGRO} />
    <path d="M30 -54 L 34 -66 L 40 -52 Z" fill={ORO} stroke={N} strokeWidth={1.4} />
    <path d="M-46 -30 q -10 -2 -8 -12" stroke={N} strokeWidth={2} fill="none" />
  </g>
);
/** Red de pescar al hombro (Njörd): bulto de malla que cuelga por la espalda. */
const RedHombro: React.FC = () => (
  <g>
    <defs><clipPath id="redNjord"><path d={suave([[-10, -306], [-36, -292], [-52, -230], [-46, -170], [-20, -160], [-24, -230], [8, -300]], true, 0.6)} /></clipPath></defs>
    <path d={suave([[-10, -306], [-36, -292], [-52, -230], [-46, -170], [-20, -160], [-24, -230], [8, -300]], true, 0.6)} fill="#CDBF9C" stroke={N} strokeWidth={2} />
    <g clipPath="url(#redNjord)">{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-70 + i * 9} -320 l 60 170 M${-10 + i * 9 - 60} -320 l -60 170`} stroke="#8C7A55" strokeWidth={1.4} />)}</g>
    {[[-46, -176], [-30, -164], [-40, -200]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4.5} fill="#E9D9A6" stroke={N} strokeWidth={1.2} />)}
    <path d="M8 -300 C 0 -270, -6 -240, -8 -214" stroke="#8C7A55" strokeWidth={3} fill="none" />
  </g>
);
/** Pescado colgando de la mano (Njörd). Origen = mano. */
const Pescado: React.FC = () => {
  const f = useCurrentFrame(), g = Math.sin(f / 9) * 5;
  return (
    <g transform={`rotate(${g})`}>
      <path d="M-2 4 L 2 14" stroke="#8C7A55" strokeWidth={2} />
      <path d="M0 14 l -10 -8 l 2 12 Z" fill="#6E8C9E" stroke={N} strokeWidth={1.4} />
      <path d={suave([[0, 16], [10, 30], [12, 60], [4, 84], [-2, 86], [-8, 60], [-8, 30]], true, 0.9)} fill="#8FB0C2" stroke={N} strokeWidth={1.8} />
      <path d="M-6 36 Q 2 44 10 36 M-7 52 Q 2 60 11 52" stroke="#5E7F99" strokeWidth={1.4} fill="none" />
      <circle cx={4} cy={76} r={2.4} fill={NEGRO} />
      <path d="M-8 44 l -8 4 l 8 6" fill="#6E8C9E" stroke={N} strokeWidth={1.2} />
    </g>
  );
};
/** Hel: media cara oscura (la de atrás) y media cara clara. Va en `cabeza`, sobre la cara de mujer. */
const MediaCaraHel: React.FC<{ c?: string }> = ({ c = '#56627C' }) => {
  const cara = suave([[-30, 2], [-22, -26], [0, -36], [20, -30], [28, -14], [30, -6], [37, 6], [32, 10], [34, 15], [31, 20], [26, 26], [8, 32], [4, 46], [-16, 46], [-24, 22]], true, 0.9);
  return (
    <g>
      <defs><clipPath id="caraHel"><path d={cara} /></clipPath></defs>
      <path d="M-40 -40 L 12 -40 Q 6 -10 12 10 Q 16 28 6 50 L -40 50 Z" fill={c} clipPath="url(#caraHel)" />
      <path d="M12 -40 Q 6 -10 12 10 Q 16 28 6 50" stroke={N} strokeWidth={1.4} fill="none" clipPath="url(#caraHel)" />
      <path d={cara} fill="none" stroke={N} strokeWidth={2} />
    </g>
  );
};

// ---------- fichas ----------
const h = (p: Partial<PersonajeProps>, griego: string): Ficha => ({ tipo: 'persona', p, griego });
const m = (p: Partial<PersonajeProps>, griego: string): Ficha => h({ mujer: true, ...p }, griego);
const A_THOR = 1.35, A_FLACO = 0.8;

export const ELENCO_NORDICO: Record<string, Ficha> = {
  // B · muñeco de siempre (silueta oscura) + identidad
  thor_muneco: h({ gigante: true, barba: true, tocado: null, pelo: PELO_THOR, objeto: 'mjolnir_corto', brazo: [6, 4], guante: HIERRO, ropaColor: ROJO, adornos: { cabeza: <><MelenaThor /><BarbaThor /></>, cuerpo: <Megingjord a={A_THOR} /> } }, 'THOR'),
  odin_muneco: h({ s: 1.1, cuerpo: 'flaco', barba: true, canas: true, tocado: null, pelo: GRIS_ODIN, objeto: 'gungnir', ropa: 'larga', ropaColor: '#2F5D80', capa: '#1F3A55', adornos: { cabeza: <><BarbaOdin /><Parche claro /><Sombrero /><g transform="translate(-52 40)"><Cuervo s={0.85} claro /></g></>, detras: <g transform="translate(-104 -344)"><CuervoVuela s={0.7} /></g> } }, 'ODIN'),
  loki_muneco: h({ barba: false, peloCorto: true, brazoAtras: [0, -40], tocado: null, pelo: '#141518', capa: '#1F3A2A', ropa: 'tunica', ropaColor: VERDE, ribete: ORO, pantalon: '#26303A', botas: '#3A2A20', adornos: { cabeza: <><PeloLoki luz="#9DBBD1" /><BarbaLoki luz="#9DBBD1" /></>, cuerpo: <Camisa a={1} c={VERDE} borde={ORO} cuadrada /> } }, 'LOKI'),
  // A · oficial (aprobada 2026-10-15): piel de color, ropa en capas y más detalle
  thor_oficial: h({ orejaSimple: true, gigante: true, s: 1.06, barba: true, tocado: null, piel: '#E0A27A', pelo: PELO_THOR, objeto: 'mjolnir_corto', brazo: [6, 4], guante: HIERRO, ropaColor: '#2F5D80', adornos: { detras: <CapaLarga c="#7A2A22" borde={ORO} />, cabeza: <><MelenaThor /><BarbaThor trenza /></>, cuerpo: <><Camisa a={A_THOR} c="#3E6F96" /><MantoPiel a={A_THOR} /><Megingjord a={A_THOR} /></> } }, 'THOR'),
  odin_oficial: h({ orejaSimple: true, s: 1.12, cuerpo: 'flaco', barba: true, canas: true, tocado: null, piel: '#D9AE8C', pelo: GRIS_ODIN, objeto: 'gungnir', ropa: 'larga', ropaColor: '#5E7F99', adornos: { detras: <><CapaLarga c="#1F3A55" forro="#2F5D80" borde={CREMA} /><g transform="translate(-110 -350)"><CuervoVuela s={0.72} /></g></>, cabeza: <><BarbaOdin trenza /><Parche /><Sombrero c="#2B4660" banda={ROJO} /><g transform="translate(-52 40)"><Cuervo s={0.85} /></g></>, cuerpo: <><Camisa a={A_FLACO} c="#4A6F8F" borde={CREMA} /><Broche x={-4} y={-296} /></> } }, 'ODIN'),
  loki_oficial: h({ orejaSimple: true, barba: false, peloCorto: true, brazoAtras: [0, -40], tocado: null, piel: '#E2B48E', pelo: '#141518', ropa: 'tunica', ropaColor: VERDE, ribete: ORO, pantalon: '#26303A', botas: '#3A2A20', adornos: { detras: <CapaLarga c="#1F3A2A" borde={ORO} corta />, cabeza: <><PeloLoki /><BarbaLoki /></>, cuerpo: <Camisa a={1} c={VERDE} borde={ORO} cuadrada /> } }, 'LOKI'),
  // Los demás dioses oficiales (misma receta: piel de color, ropa simple en capas, 2–3 señas que se reconocen).
  freya_oficial: m({ orejaSimple: true, piel: '#ECC3A0', pelo: '#D9A441', peloCorto: true, tocado: null, ropa: 'larga', ropaColor: '#9C3B52', ribete: ORO, brazo: [62, 40], adornos: { detras: <><CapaHalcon /><EnCabeza a={0.92}><MelenaLarga c="#D9A441" luz="#F2CF7A" largo={110} /></EnCabeza><g transform="translate(-112 0)"><GatoSentado /></g></>, cabeza: <CapPelo c="#D9A441" luz="#F2CF7A" />, cuerpo: <><Camisa a={0.92} c="#9C3B52" borde={ORO} /><Brisingamen /></> } }, 'FREYA'),
  frigg_oficial: m({ orejaSimple: true, s: 1.03, piel: '#E8BE9C', pelo: '#6B4A2E', peloCorto: true, tocado: null, ropa: 'larga', ropaColor: '#5C8DB8', ribete: CREMA, brazo: [30, 50], adornos: { detras: <CapaLarga c="#2F5D80" borde={CREMA} />, cabeza: <Panuelo />, cuerpo: <><Camisa a={0.92} c="#8FB3D3" borde={CREMA} /><Delantal c="#3E6F96" /><Llaves /></>, mano: <Rueca /> } }, 'FRIGG'),
  tyr_oficial: h({ orejaSimple: true, s: 1.04, piel: '#DDA27C', pelo: '#7A5230', barba: false, peloCorto: true, tocado: null, ropa: 'tunica', ropaColor: '#7E3A2A', ribete: ORO, pantalon: '#3A3F48', botas: '#3A2A20', manoCortada: true, brazo: [55, 45], brazoAtras: [0, -30], adornos: { detras: <EscudoEspalda c1="#2F5D80" />, cabeza: <><CapPelo c="#7A5230" luz="#B58A5A" /><BarbaCorta c="#7A5230" luz="#B58A5A" largo={6} /></>, cuerpo: <><Camisa a={1} c="#7E3A2A" borde={ORO} cuadrada /><Vaina /></> } }, 'TYR'),
  baldr_oficial: h({ orejaSimple: true, s: 1.04, piel: '#F0CDA8', pelo: '#F2D27A', barba: false, peloCorto: true, tocado: null, ropa: 'tunica', ropaColor: '#F7F3EA', ribete: ORO, pantalon: '#E3DCCB', botas: '#B98A4A', brazo: [45, 25], adornos: { detras: <><EnCabeza><HaloSol /></EnCabeza><CapaLarga c="#F7F3EA" forro="#EADFC2" borde={ORO} /></>, cabeza: <CapPelo c="#F2D27A" luz="#FFF0B8" />, cuerpo: <Camisa a={1} c="#FBF8F0" borde={ORO} cuadrada /> } }, 'BALDR'),
  heimdall_oficial: h({ orejaSimple: true, s: 1.08, piel: '#E6B892', pelo: '#E2CC92', barba: false, peloCorto: true, tocado: null, ropa: 'tunica', ropaColor: '#5E7084', ribete: ORO, pantalon: '#2E3742', botas: '#3A2A20', brazo: [30, 80], adornos: { detras: <CapaLarga c="#EEF2F5" forro="#C9D2DA" borde={CREMA} arcoiris />, cabeza: <><CapPelo c="#E2CC92" luz="#FFF0B8" /><BarbaCorta c="#E2CC92" luz="#FFF0B8" /><YelmoSimple /></>, cuerpo: <Camisa a={1} c="#5E7084" borde={ORO} cuadrada />, mano: <Gjallarhorn /> } }, 'HEIMDALL'),
  hel_oficial: m({ orejaSimple: true, piel: '#E9E1D8', pelo: '#15171C', peloCorto: true, tocado: null, ropa: 'larga', ropaColor: '#2A2F38', ribete: '#7C9A78', brazo: [20, 20], adornos: { detras: <><CapaLarga c="#1B1F27" forro="#3B4352" borde="#7C9A78" /><EnCabeza a={0.92}><MelenaLarga c="#15171C" luz="#4A5260" largo={130} /></EnCabeza></>, cabeza: <><MediaCaraHel /><CapPelo c="#15171C" luz="#4A5260" /></>, cuerpo: <Camisa a={0.92} c="#2A2F38" borde="#7C9A78" /> } }, 'HEL'),
  sif_oficial: m({ orejaSimple: true, piel: '#F0CBA6', pelo: '#E9B83A', peloCorto: true, tocado: null, ropa: 'larga', ropaColor: '#5E7B3A', ribete: ORO, brazo: [40, 60], adornos: { detras: <EnCabeza a={0.92}><MelenaLarga c="#E9B83A" luz="#FFE08A" largo={230} ancho={1.25} /></EnCabeza>, cabeza: <CapPelo c="#E9B83A" luz="#FFE08A" />, cuerpo: <><Camisa a={0.92} c="#86A35A" borde={ORO} /><Delantal c="#5E7B3A" /></>, mano: <Gavilla /> } }, 'SIF'),
  freyr_oficial: h({ orejaSimple: true, s: 1.05, piel: '#E4AE86', pelo: '#D9A441', barba: false, peloCorto: true, tocado: null, ropa: 'tunica', ropaColor: '#B8862B', ribete: '#6B4A2E', pantalon: '#4A3A2A', botas: '#3A2A20', brazo: [30, 60], adornos: { detras: <><CapaLarga c="#6B4A2E" borde={ORO} corta /><g transform="translate(-96 0)"><JabaliOro s={0.8} /></g></>, cabeza: <><CapPelo c="#D9A441" luz="#F2CF7A" /><BarbaCorta c="#D9A441" luz="#F2CF7A" /></>, cuerpo: <Camisa a={1} c="#B8862B" borde="#6B4A2E" cuadrada />, mano: <EspadaNordica brillo /> } }, 'FREYR'),
  njord_oficial: h({ orejaSimple: true, s: 1.04, piel: '#D29A72', pelo: '#7D7A72', barba: false, peloCorto: true, tocado: null, ropa: 'tunica', ropaColor: '#2F7A86', ribete: CREMA, pantalon: '#2E4A5C', brazo: [10, 20], adornos: { cabeza: <><CapPelo c="#7D7A72" luz="#B9B6AE" /><BarbaCorta c="#7D7A72" luz="#B9B6AE" largo={14} /></>, cuerpo: <><Camisa a={1} c="#2F7A86" borde={CREMA} cuadrada /><RedHombro /></>, mano: <Pescado /> } }, 'NJORD'),
};
export const NOMBRE_EN_NORDICO: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_NORDICO).map(([k, f]) => [k, f.griego as string]));
