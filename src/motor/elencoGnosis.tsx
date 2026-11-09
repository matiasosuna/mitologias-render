// Elenco de Gnosis (serie `gnosticas`, tema "gnosis"): diseños OFICIALES (*_oficial) para los episodios y los
// Shorts "Who is…?". Muñecos planos con contorno de tinta, como todo el canal; la luz va en formas nítidas de ícono
// (nimbos de disco, mandorla), sin desenfoques dentro del cuerpo (el filtro HD los ensuciaría).
// Reglas del plan (PLAN-GNOSTICAS.md):
//   · El Espíritu Invisible NUNCA es una persona: `espiritu_invisible` es solo luz (o el elemento `luz_espiritu`).
//   · El Salvador es una figura de luz SIN rostro definido (cabeza luminosa lisa); se le aparece a Juan como niño,
//     como anciano y como servidor (`salvador_nino_oficial`, `salvador_anciano_oficial`, `salvador_servidor_oficial`)
//     y como águila en el árbol (`aguila_luz`).
//   · Yaldabaoth: serpiente con cara de león y ojos de fuego, en su trono (dibujo propio, imponente).
//   · Los gobernantes: cara de animal (`arconte` con props.cara) y los siete reyes con nombre.
//   · Nada de sangre ni desnudos: todos vestidos; la violencia se dice, no se muestra.
// Variantes de un mismo personaje (Sofía apagada, Adán alma / luz / tierra) son claves aparte: se cambia con el paso
// `transforma` (en_que).
import React, { useId } from 'react';
import { useCurrentFrame } from 'remotion';
import { Personaje, suave, type P, type PersonajeProps } from '../comun/vasija';
import { GN, Estrella8 } from '../comun/gnosis';
import { LuzPleroma, TronoLuz } from './fondosGnosis';
import { AguilaEpica, SerpienteEpica } from './bestiasEpicas';
import type { Ficha } from './elenco';
import type { DibujoProps } from './elencoAzteca';

const N = GN.tinta;
const r1 = (v: number) => v.toFixed(1);
const gid = () => 'ge' + useId().replace(/[^a-zA-Z0-9]/g, '');
/** Forma cerrada con contorno de tinta. */
const F = (pts: P[], c: string, t = 0.8, w = 1.8) => <path d={suave(pts, true, t)} fill={c} stroke={N} strokeWidth={w} strokeLinejoin="round" />;
/** Línea suelta (mechones, pliegues). */
const L = (pts: P[], c: string, w = 1.5) => <path d={suave(pts)} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" />;

// ---------- luz (formas nítidas) ----------
/** Nimbo de disco detrás de la cabeza (va en adornos.detras; la cabeza está en 20,-334). rayos = puntas de luz. */
const Nimbo: React.FC<{ c?: string; aro?: string; r?: number; rayos?: number; cx?: number; cy?: number }> = ({ c = GN.oroClaro, aro = GN.oro, r = 62, rayos = 0, cx = 20, cy = -334 }) => {
  const f = useCurrentFrame(), g = (f / 3) % 360;
  return (
    <g>
      {rayos > 0 && <g transform={`rotate(${r1(g * 0.1)} ${cx} ${cy})`}>{Array.from({ length: rayos }, (_, i) => {
        const a = (i / rayos) * Math.PI * 2, L0 = r * 0.9, L1 = r * (i % 2 ? 1.45 : 1.7), w = 0.09;
        return <path key={i} d={`M${r1(cx + Math.cos(a - w) * L0)} ${r1(cy + Math.sin(a - w) * L0)} L ${r1(cx + Math.cos(a) * L1)} ${r1(cy + Math.sin(a) * L1)} L ${r1(cx + Math.cos(a + w) * L0)} ${r1(cy + Math.sin(a + w) * L0)} Z`} fill={c} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />;
      })}</g>}
      <circle cx={cx} cy={cy} r={r} fill={c} stroke={N} strokeWidth={2.4} />
      <circle cx={cx} cy={cy} r={r - 9} fill="none" stroke={aro} strokeWidth={3} />
      <circle cx={cx} cy={cy} r={r - 16} fill="none" stroke={GN.blanco} strokeWidth={1.6} strokeDasharray="2 6" />
    </g>
  );
};
/** Mandorla: almendra de luz alrededor del cuerpo entero (el Salvador). */
const Mandorla: React.FC<{ c?: string; c2?: string; alto?: number; ancho?: number }> = ({ c = '#FBEFC8', c2 = GN.blanco, alto = 470, ancho = 150 }) => {
  const f = useCurrentFrame(), y0 = 20, y1 = -alto, ym = (y0 + y1) / 2;
  const almendra = (k: number) => `M0 ${r1(ym - (ym - y1) * k)} C ${r1(ancho * k * 1.2)} ${r1(ym - (ym - y1) * k * 0.7)}, ${r1(ancho * k * 1.2)} ${r1(ym + (y0 - ym) * k * 0.7)}, 0 ${r1(ym + (y0 - ym) * k)} C ${r1(-ancho * k * 1.2)} ${r1(ym + (y0 - ym) * k * 0.7)}, ${r1(-ancho * k * 1.2)} ${r1(ym - (ym - y1) * k * 0.7)}, 0 ${r1(ym - (ym - y1) * k)} Z`;
  return (
    <g>
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2 + f / 400, R = 1.08 + (i % 2) * 0.1;
        const px = Math.cos(a) * ancho * 1.05, py = ym + Math.sin(a) * (y0 - y1) * 0.55;
        return <path key={i} d={`M${r1(px * 0.86)} ${r1(ym + (py - ym) * 0.86 - 6)} L ${r1(px * R)} ${r1(ym + (py - ym) * R)} L ${r1(px * 0.86)} ${r1(ym + (py - ym) * 0.86 + 6)} Z`} fill={GN.oroClaro} stroke={N} strokeWidth={1.4} />;
      })}
      <path d={almendra(1)} fill={c} stroke={N} strokeWidth={2.6} />
      <path d={almendra(0.86)} fill={c2} stroke={GN.oro} strokeWidth={2.4} />
      <path d={almendra(0.7)} fill="none" stroke={GN.oroClaro} strokeWidth={1.6} strokeDasharray="3 8" />
    </g>
  );
};
/** Cabeza de luz SIN rostro (el Salvador): nimbo, cuello y un óvalo luminoso liso, con un brillo que late. */
const CabezaLuz: React.FC<{ nimbo?: boolean }> = ({ nimbo = true }) => {
  const f = useCurrentFrame(), late = 1 + Math.sin(f / 14) * 0.04;
  return (
    <g>
      {nimbo && <><g transform={`translate(4 2) rotate(${r1(f * 0.2)})`}>{Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <path key={i} d={`M${r1(Math.cos(a - 0.1) * 56)} ${r1(Math.sin(a - 0.1) * 56)} L ${r1(Math.cos(a) * (i % 2 ? 80 : 92))} ${r1(Math.sin(a) * (i % 2 ? 80 : 92))} L ${r1(Math.cos(a + 0.1) * 56)} ${r1(Math.sin(a + 0.1) * 56)} Z`} fill={GN.oroClaro} stroke={N} strokeWidth={1.4} />; })}</g>
        <circle cx={4} cy={2} r={62} fill={GN.oroClaro} stroke={N} strokeWidth={2.4} /><circle cx={4} cy={2} r={53} fill="none" stroke={GN.oro} strokeWidth={3} /></>}
      {F([[-14, 18], [6, 16], [8, 46], [-16, 46]], '#FFF1CF', 0.5, 2)}
      {F([[-30, 4], [-25, -24], [-2, -38], [22, -32], [36, -10], [37, 12], [26, 30], [8, 36], [-12, 34], [-26, 22]], GN.blanco, 0.85, 2.2)}
      <ellipse cx={6} cy={0} rx={r1(19 * late)} ry={r1(24 * late)} fill="#FFFFFF" />
      <ellipse cx={10} cy={-8} rx={6} ry={8} fill={GN.luz} opacity={0.9} />
    </g>
  );
};

// ---------- pelo, barba, tocados (cabeza de perfil a la derecha, ojo en 18,-6) ----------
const PeloCortoG: React.FC<{ c: string; c2?: string }> = ({ c, c2 = '#FFFFFF55' }) => (
  <g>
    {F([[24, -30], [12, -40], [-6, -42], [-22, -36], [-31, -22], [-34, -4], [-30, 14], [-22, 18], [-18, 4], [-12, -10], [-2, -20], [12, -25]], c, 0.75)}
    {L([[14, -33], [-4, -34], [-20, -26]], c2, 1.6)}
    {L([[4, -38], [-14, -34], [-26, -18]], c2, 1.4)}
  </g>
);
const PeloLargo: React.FC<{ c: string; c2?: string; largo?: number }> = ({ c, c2 = '#FFFFFF55', largo = 118 }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 17) * 2;
  return (
    <g>
      {F([[24, -28], [14, -39], [-2, -44], [-20, -40], [-34, -27], [-41, -6], [-43, 28], [-47 + o, largo * 0.62], [-42 + o, largo], [-30 + o, largo - 6], [-22, largo + 2], [-16, largo * 0.7], [-14, 30], [-10, 6], [-3, -12], [8, -22], [17, -25]], c, 0.75)}
      {[[16, -33, -30, -14, -36, 70], [6, -29, -24, 8, -28, 96], [-6, -23, -18, 20, -22, 84]].map(([a, b, cc, d, e, g], i) => <path key={i} d={`M${a} ${b} Q ${cc} ${d} ${e + o} ${g}`} stroke={c2} strokeWidth={1.6} fill="none" strokeLinecap="round" />)}
    </g>
  );
};
const BarbaG: React.FC<{ c: string; c2?: string; larga?: boolean }> = ({ c, c2 = '#FFFFFF44', larga }) => (
  <g>
    {F(larga ? [[-10, 4], [-12, 24], [-6, 50], [6, 80], [16, 92], [24, 76], [34, 46], [38, 24], [32, 25], [24, 26], [14, 22], [4, 14], [-2, 8]] : [[-10, 4], [-12, 20], [-4, 34], [10, 42], [24, 40], [34, 32], [38, 24], [32, 25], [24, 26], [14, 22], [4, 14], [-2, 8]], c, 0.7)}
    <path d="M22 19 C 29 15, 37 18, 41 25 C 34 23, 28 23.5, 22 24 Z" fill={c} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />
    {L(larga ? [[6, 30], [12, 56], [16, 80]] : [[6, 26], [14, 34], [24, 36]], c2, 1.3)}
    {larga && L([[20, 34], [24, 56], [20, 74]], c2, 1.3)}
  </g>
);
/** Manto que cubre la cabeza y cae por la espalda (fariseo, viejo). raya = franjas del manto de oración. */
const MantoCabeza: React.FC<{ c: string; raya?: string }> = ({ c, raya }) => (
  <g>
    {F([[30, -26], [16, -42], [-4, -48], [-26, -40], [-40, -20], [-44, 20], [-48, 74], [-24, 82], [-18, 40], [-16, 6], [-6, -16], [14, -26]], c, 0.75, 2)}
    {raya && [0, 1].map((i) => <path key={i} d={`M${-42 + i * 9} ${56 + i * 2} Q ${-36 + i * 8} 10 ${-22 + i * 8} -34`} stroke={raya} strokeWidth={4} fill="none" />)}
    {L([[22, -34], [0, -40], [-22, -30]], '#FFFFFF66', 1.6)}
  </g>
);
/** Diadema de tres estrellas (Barbelo, la del triple poder). */
const TresEstrellas: React.FC<{ c?: string }> = ({ c = GN.blanco }) => (
  <g>
    <path d="M-26 -26 Q 0 -44 26 -30" stroke={GN.plataOsc} strokeWidth={5} fill="none" strokeLinecap="round" />
    <Estrella8 x={-14} y={-44} r={8} c={c} c2={GN.plata} /><Estrella8 x={4} y={-54} r={11} c={c} c2={GN.plata} /><Estrella8 x={22} y={-44} r={8} c={c} c2={GN.plata} />
  </g>
);
/** Lágrimas que caen del ojo (Sofía apagada). */
const Lagrimas: React.FC = () => {
  const f = useCurrentFrame();
  return <g>{[0, 1].map((i) => { const t = ((f / 40 + i * 0.5) % 1); return <path key={i} d={`M20 ${r1(2 + t * 34)} q -4 8 0 11 q 4 -3 0 -11 Z`} fill="#CFE6FA" stroke={N} strokeWidth={1} opacity={1 - t * 0.6} />; })}</g>;
};

// ---------- cuerpo (torso -30..34 × -304..-208; falda larga hasta -6) ----------
/** Franja vertical de la túnica (clavus), del hombro al ruedo. */
const Clavo: React.FC<{ c: string; dx?: number }> = ({ c, dx = 0 }) => <path d={`M${8 + dx} -300 L ${10 + dx} -214 L ${16 + dx * 1.3} -12`} stroke={c} strokeWidth={7} fill="none" />;
const Cinto: React.FC<{ c: string }> = ({ c }) => <path d="M-28 -214 Q 0 -208 26 -216" stroke={c} strokeWidth={8} fill="none" strokeLinecap="round" />;
/** Manto cruzado del hombro a la cadera (Juan, Sofía). */
const MantoCruzado: React.FC<{ c: string; c2?: string }> = ({ c, c2 }) => (
  <g>
    {F([[-30, -300], [-8, -306], [36, -232], [34, -196], [-30, -128], [-44, -168], [-34, -240]], c, 0.4, 2)}
    {c2 && <path d="M-6 -300 L 34 -228" stroke={c2} strokeWidth={4} />}
    {L([[-20, -270], [0, -220], [-24, -170]], '#00000033', 2)}
  </g>
);
/** Estrellas sueltas sobre el vestido (Barbelo). */
const Estrellado: React.FC<{ c?: string }> = ({ c = GN.blanco }) => (
  <g>{[[-14, -280], [14, -262], [-4, -236], [-20, -180], [20, -170], [0, -130], [-26, -86], [24, -70], [-6, -40], [36, -24]].map(([x, y], i) => <Estrella8 key={i} x={x} y={y} r={i % 3 ? 5 : 7} c={c} c2={GN.plata} />)}</g>
);
/** Emblema en el pecho de las cuatro luces. */
const Emblema: React.FC<{ tipo: 'sol' | 'luna' | 'estrella' | 'llama'; c: string }> = ({ tipo, c }) => (
  <g transform="translate(4 -262)">
    <circle r={17} fill={GN.blanco} stroke={N} strokeWidth={2} />
    {tipo === 'sol' && <><circle r={8} fill={c} stroke={N} strokeWidth={1.4} />{Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <path key={i} d={`M${r1(Math.cos(a) * 10)} ${r1(Math.sin(a) * 10)} L ${r1(Math.cos(a) * 14)} ${r1(Math.sin(a) * 14)}`} stroke={N} strokeWidth={2} />; })}</>}
    {tipo === 'luna' && <path d="M2 -12 a 12 12 0 1 0 8 21 a 9.5 9.5 0 1 1 -8 -21 Z" fill={c} stroke={N} strokeWidth={1.4} />}
    {tipo === 'estrella' && <Estrella8 x={0} y={0} r={12} c={c} c2={GN.blanco} />}
    {tipo === 'llama' && <path d="M0 13 C -10 10, -10 -2, -2 -14 C -1 -6, 4 -6, 4 -12 C 12 -2, 10 10, 0 13 Z" fill={c} stroke={N} strokeWidth={1.4} />}
  </g>
);
/** Códice chico en la mano (Juan). */
const CodiceMano: React.FC = () => (
  <g transform="translate(6 -4) rotate(-10)">
    <rect x={-12} y={-30} width={30} height={38} rx={2} fill={GN.cuero} stroke={N} strokeWidth={1.8} />
    <rect x={-8} y={-26} width={22} height={30} fill={GN.papiro} stroke={N} strokeWidth={1} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M-5 ${-20 + i * 7} H 11`} stroke={N} strokeWidth={1.2} />)}
    <path d="M18 -12 C 26 -12, 28 -4, 30 4" stroke={GN.cueroOsc} strokeWidth={3} fill="none" />
  </g>
);

// ---------- cabezas de los gobernantes (cara de animal) ----------
export type CaraArconte = 'oveja' | 'burro' | 'hiena' | 'mono' | 'dragon' | 'serpiente' | 'siete' | 'fuego' | 'leon' | 'oso' | 'gato';
export const CARAS_ARCONTE: CaraArconte[] = ['oveja', 'burro', 'hiena', 'mono', 'dragon', 'serpiente', 'siete', 'fuego', 'leon', 'oso', 'gato'];
const PIEL_ARC = '#6E6152';
/** Ojo de gobernante: iris de fuego con la pupila en raya. */
const OjoArc: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 5 }) => (
  <g>
    <ellipse cx={x} cy={y} rx={r + 1.5} ry={r} fill={GN.fuegoClaro} stroke={N} strokeWidth={1.8} />
    <ellipse cx={x + 1} cy={y} rx={1.4} ry={r * 0.8} fill={N} />
    <path d={`M${x - r - 5} ${y - r - 2} L ${x + r + 3} ${y - r + 1}`} stroke={N} strokeWidth={2.6} strokeLinecap="round" />
  </g>
);
const CuelloArc: React.FC<{ c: string }> = ({ c }) => F([[-14, 18], [6, 16], [8, 46], [-16, 46]], c, 0.5, 2);
/** Corona de rey oscuro (oro viejo con piedras rojas). y = base de la corona. */
const CoronaArc: React.FC<{ y?: number; x?: number; s?: number }> = ({ y = -34, x = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-24 4 L -26 -22 L -14 -10 L -4 -30 L 6 -10 L 18 -26 L 22 4 Z" fill={GN.oroOsc} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-25 -2 H 23" stroke={N} strokeWidth={1.4} />
    {[-14, 4].map((cx) => <circle key={cx} cx={cx} cy={-4} r={3.2} fill={GN.rojo} stroke={N} strokeWidth={1} />)}
  </g>
);
/** Cabeza entera de un gobernante (va en adornos.cabeza con cabezaPropia). boca = la abre. */
export const CabezaArconte: React.FC<{ cara: CaraArconte; corona?: boolean; boca?: boolean }> = ({ cara, corona = true, boca }) => {
  const f = useCurrentFrame(), ab = boca ? (Math.sin(f / 2.2) > 0 ? 7 : 3) : 0;
  switch (cara) {
    case 'oveja': return (
      <g>
        <CuelloArc c="#3E342C" />
        {F([[-30, 10], [-36, -10], [-26, -32], [-4, -42], [18, -36], [26, -20], [14, -10], [-6, -6], [-18, 14]], '#E2D8C2', 0.9)}
        {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-26 + i * 7} cy={-30 - Math.sin(i / 1.9) * 8} r={6} fill="#EDE5D2" stroke={N} strokeWidth={1.2} />)}
        {F([[-2, -24], [18, -26], [38, -10], [50, 6], [48, 18], [34, 22], [16, 22], [-2, 14], [-8, -4]], '#4A3E36', 0.8)}
        <path d="M46 8 Q 42 14 36 13" stroke="#E2D8C2" strokeWidth={1.6} fill="none" />
        <ellipse cx={46} cy={4} rx={2.2} ry={1.6} fill={N} />
        <path d={`M30 ${18 + ab * 0.4} Q 40 ${22 + ab} 48 ${18 + ab * 0.5}`} stroke={N} strokeWidth={1.8} fill="none" />
        {F([[-14, -14], [-28, -12], [-36, 4], [-28, 18], [-14, 12], [-20, 2], [-12, -4]], '#C9B88E', 0.7, 2)}
        <path d="M-22 4 A 6 6 0 1 1 -16 -2" stroke="#8E7A52" strokeWidth={2} fill="none" />
        {F([[2, -10], [-10, 2], [-6, 14], [4, 6]], '#4A3E36', 0.6, 1.6)}
        <OjoArc x={16} y={-10} r={4.2} />
        {corona && <CoronaArc y={-40} x={-6} />}
      </g>
    );
    case 'burro': return (
      <g>
        <CuelloArc c="#7E786C" />
        {[-4, 8].map((dx, i) => <g key={dx}>{F([[-10 + dx, -26], [-20 + dx, -70], [-12 + dx, -84], [-2 + dx, -66], [2 + dx, -28]], i ? '#8E887C' : '#7E786C', 0.7)}</g>)}
        <path d="M-12 -70 L -6 -36" stroke="#3E3A34" strokeWidth={3} />
        {F([[-26, 10], [-28, -18], [-8, -34], [18, -30], [40, -12], [56, 8], [58, 24], [48, 34], [30, 32], [10, 28], [-12, 26]], '#8E887C', 0.85)}
        {F([[34, 4], [54, 6], [60, 22], [50, 32], [32, 30], [28, 16]], '#D8D0BE', 0.8, 1.6)}
        <ellipse cx={52} cy={14} rx={2.6} ry={1.8} fill={N} />
        <path d={`M36 ${28 + ab * 0.3} Q 46 ${32 + ab} 56 ${27 + ab * 0.5}`} stroke={N} strokeWidth={1.8} fill="none" />
        <path d="M-24 -6 C -30 -20, -22 -32, -10 -34" stroke="#3E3A34" strokeWidth={6} fill="none" strokeLinecap="round" />
        <OjoArc x={14} y={-12} r={4.4} />
        {corona && <CoronaArc y={-30} x={-2} s={0.85} />}
      </g>
    );
    case 'hiena': return (
      <g>
        <CuelloArc c="#8A6E4A" />
        {F([[-26, 6], [-40, -14], [-30, -28], [-34, -46], [-18, -40], [-4, -36]], '#5A4632', 0.6)}
        {F([[-24, 18], [-28, -12], [-12, -32], [10, -34], [28, -22], [46, -4], [58, 10], [54, 24], [36, 26], [14, 30], [-8, 32]], '#B08E5E', 0.85)}
        {F([[-6, -30], [-14, -50], [2, -48], [6, -32]], '#B08E5E', 0.6, 1.6)}
        {F([[38, 2], [58, 8], [56, 22], [40, 24]], '#3A2E22', 0.7, 1.4)}
        {[[-6, -10], [6, 12], [-14, 8], [20, -18], [-2, 22]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.4} fill="#4A3A28" />)}
        <path d={`M30 ${24 + ab * 0.3} Q 44 ${28 + ab} 56 ${22 + ab * 0.4}`} stroke={N} strokeWidth={1.8} fill="none" />
        {ab > 0 && [36, 44, 50].map((x) => <path key={x} d={`M${x} ${25 + ab * 0.6} l 2 4 l 2 -4`} fill={GN.blanco} stroke={N} strokeWidth={0.8} />)}
        <OjoArc x={20} y={-10} r={4.2} />
        {corona && <CoronaArc y={-36} x={-6} s={0.9} />}
      </g>
    );
    case 'mono': return (
      <g>
        <CuelloArc c="#5A3E28" />
        {F([[-30, 10], [-34, -14], [-20, -36], [4, -42], [26, -32], [34, -12], [34, 14], [22, 34], [-4, 38], [-24, 28]], '#5E4430', 0.85)}
        {F([[2, -26], [24, -24], [30, -6], [40, 8], [36, 24], [22, 32], [6, 30], [0, 12], [-2, -10]], '#D6A47C', 0.8, 1.6)}
        {F([[22, 4], [42, 8], [44, 20], [30, 26], [20, 18]], '#C08E66', 0.7, 1.4)}
        <ellipse cx={36} cy={10} rx={1.8} ry={1.4} fill={N} /><ellipse cx={41} cy={11} rx={1.8} ry={1.4} fill={N} />
        <path d={`M26 ${22 + ab * 0.3} Q 34 ${26 + ab} 42 ${21 + ab * 0.4}`} stroke={N} strokeWidth={1.8} fill="none" />
        {F([[-14, -8], [-26, -12], [-30, 4], [-18, 8]], '#C08E66', 0.7, 1.6)}
        <path d="M6 -16 Q 18 -24 30 -16" stroke="#3A2A1C" strokeWidth={4} fill="none" strokeLinecap="round" />
        <OjoArc x={18} y={-8} r={4} />
        {corona && <CoronaArc y={-40} x={2} />}
      </g>
    );
    case 'dragon': return (
      <g>
        <CuelloArc c="#2E5A34" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-28 + i * 4} ${-6 + i * 12} l -16 -6 l 10 14 Z`} fill={GN.rojo} stroke={N} strokeWidth={1.4} />)}
        {F([[-22, -24], [-40, -50], [-48, -66], [-30, -52], [-12, -32]], '#D8C69A', 0.6, 1.6)}
        {F([[-4, -30], [-16, -56], [-18, -76], [-2, -54], [8, -32]], '#D8C69A', 0.6, 1.6)}
        {F([[-26, 20], [-30, -10], [-14, -32], [12, -34], [34, -22], [60, -10], [74, 0], [72, 12], [50, 16], [30, 28], [6, 34], [-12, 32]], '#3E7A44', 0.85)}
        {F([[30, 14], [72, 12], [70, 24 + ab], [44, 30 + ab], [24, 30]], '#2E5A34', 0.6, 1.6)}
        <path d="M30 14 L 34 20 L 38 14 L 42 20 L 46 14 L 50 20 L 54 14 L 58 19 L 62 13" stroke={GN.blanco} strokeWidth={1.6} fill="none" />
        <ellipse cx={68} cy={2} rx={2.6} ry={1.8} fill={N} />
        <path d="M-6 -20 C 8 -14, 20 -14, 34 -18" stroke="#1E3E24" strokeWidth={2} fill="none" />
        <OjoArc x={20} y={-14} r={4.8} />
        {corona && <CoronaArc y={-40} x={20} s={0.75} />}
      </g>
    );
    case 'serpiente': case 'siete': {
      const una = (k = 1, color = '#3E5A2E') => (
        <g transform={`scale(${k})`}>
          {F([[-22, 22], [-26, -6], [-10, -26], [14, -28], [38, -16], [54, 0], [52, 14], [34, 22], [10, 28], [-8, 30]], color, 0.85)}
          {F([[10, 16], [52, 12], [46, 22 + ab * 0.6], [20, 26 + ab * 0.6]], '#C9C27A', 0.6, 1.4)}
          {[[-6, -12], [8, -18], [-12, 6], [22, -6]].map(([x, y], i) => <path key={i} d={`M${x - 5} ${y} l 5 -4 l 5 4 l -5 4 Z`} fill="#2A3E1E" />)}
          <ellipse cx={46} cy={2} rx={2} ry={1.4} fill={N} />
          {ab > 0 && <path d={`M52 ${16 + ab * 0.3} l 12 2 l 4 -4 m -4 4 l 4 4`} stroke={GN.rojo} strokeWidth={1.8} fill="none" />}
          <OjoArc x={20} y={-10} r={4.4} />
        </g>
      );
      return (
        <g>
          <CuelloArc c="#3E5A2E" />
          {cara === 'siete' && [-70, -48, -26, 26, 50, 72].map((a, i) => {
            const rad = (a - 90) * Math.PI / 180, d = 52 + (i % 2) * 6, cx = Math.cos(rad) * d + 4, cy = Math.sin(rad) * d * 0.8 + 6;
            return <g key={i}><path d={`M4 6 Q ${r1(cx * 0.5)} ${r1(cy * 0.4)} ${r1(cx)} ${r1(cy)}`} stroke={N} strokeWidth={11} fill="none" strokeLinecap="round" /><path d={`M4 6 Q ${r1(cx * 0.5)} ${r1(cy * 0.4)} ${r1(cx)} ${r1(cy)}`} stroke="#4E6A3A" strokeWidth={7} fill="none" strokeLinecap="round" /><g transform={`translate(${r1(cx)} ${r1(cy)})`}>{una(0.42, '#4E6A3A')}</g></g>;
          })}
          {una()}
          {corona && <CoronaArc y={-30} x={6} s={0.8} />}
        </g>
      );
    }
    case 'fuego': return (
      <g>
        <CuelloArc c="#8A3A1E" />
        {Array.from({ length: 9 }, (_, i) => { const a = -Math.PI + (i / 8) * Math.PI * 1.2 - 0.1, o = Math.sin(f / 4 + i * 1.3) * 4, R = 40 + (i % 2) * 14; return <path key={i} d={`M${r1(Math.cos(a - 0.3) * 26)} ${r1(Math.sin(a - 0.3) * 26)} Q ${r1(Math.cos(a) * R * 0.9 + o)} ${r1(Math.sin(a) * R * 0.9)} ${r1(Math.cos(a + 0.05) * R + o)} ${r1(Math.sin(a + 0.05) * R - 6)} Q ${r1(Math.cos(a + 0.2) * R * 0.7)} ${r1(Math.sin(a + 0.2) * R * 0.7)} ${r1(Math.cos(a + 0.3) * 26)} ${r1(Math.sin(a + 0.3) * 26)} Z`} fill={i % 2 ? GN.fuego : GN.fuegoClaro} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />; })}
        {F([[-26, 10], [-28, -14], [-12, -32], [12, -32], [30, -18], [38, 4], [32, 22], [14, 32], [-8, 30], [-22, 22]], GN.fuego, 0.85)}
        {F([[-14, 4], [-12, -16], [4, -24], [20, -16], [26, 2], [18, 18], [0, 22], [-10, 16]], GN.fuegoClaro, 0.85, 0)}
        <ellipse cx={14} cy={-6} rx={7} ry={5} fill={GN.blanco} stroke={N} strokeWidth={1.6} /><circle cx={16} cy={-6} r={2.6} fill={N} />
        <path d={`M14 ${16 + ab * 0.3} Q 24 ${20 + ab} 32 ${14 + ab * 0.4}`} stroke={N} strokeWidth={2} fill="none" />
        {corona && <CoronaArc y={-30} x={0} s={0.9} />}
      </g>
    );
    case 'leon': return <g><CuelloArc c="#B0803A" /><CaraLeon ab={ab} />{corona && <CoronaArc y={-44} x={0} />}</g>;
    case 'oso': return (
      <g>
        <CuelloArc c="#4A3220" />
        {[[-16, -34], [12, -36]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={11} fill="#4A3220" stroke={N} strokeWidth={1.8} /><circle cx={x} cy={y} r={5} fill="#8A6A4A" /></g>)}
        {F([[-28, 14], [-32, -14], [-16, -34], [10, -36], [30, -24], [38, -6], [52, 4], [54, 18], [40, 26], [18, 32], [-6, 34], [-20, 28]], '#5A3E28', 0.85)}
        {F([[30, -2], [52, 4], [56, 18], [42, 26], [28, 22], [24, 8]], '#9A7A5A', 0.8, 1.6)}
        <ellipse cx={52} cy={6} rx={4} ry={3} fill={N} />
        <path d={`M34 ${24 + ab * 0.3} Q 44 ${28 + ab} 52 ${21 + ab * 0.4}`} stroke={N} strokeWidth={1.8} fill="none" />
        <OjoArc x={18} y={-10} r={3.8} />
        {corona && <CoronaArc y={-40} x={-2} s={0.9} />}
      </g>
    );
    case 'gato': return (
      <g>
        <CuelloArc c="#3A3A3E" />
        {[[-18, -26], [8, -30]].map(([x, y], i) => <path key={i} d={`M${x - 10} ${y + 6} L ${x - 2} ${y - 26} L ${x + 12} ${y + 4} Z`} fill="#4A4A50" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />)}
        {F([[-26, 14], [-30, -12], [-14, -32], [10, -32], [28, -22], [38, -4], [44, 10], [38, 22], [20, 30], [-4, 32], [-18, 26]], '#4A4A50', 0.85)}
        {F([[24, 4], [44, 10], [40, 22], [26, 24]], '#B8B4AA', 0.7, 1.4)}
        <path d="M44 9 L 41 12 L 38 9 Z" fill="#C88A8A" stroke={N} strokeWidth={1} />
        {[0, 1, 2].map((i) => <path key={i} d={`M38 ${14 + i * 3} L ${60} ${10 + i * 6}`} stroke="#D8D4CA" strokeWidth={1} />)}
        <path d={`M30 ${22 + ab * 0.3} Q 36 ${25 + ab} 42 ${21 + ab * 0.4}`} stroke={N} strokeWidth={1.6} fill="none" />
        <ellipse cx={20} cy={-8} rx={6} ry={5} fill="#C8E06A" stroke={N} strokeWidth={1.8} /><ellipse cx={21} cy={-8} rx={1.4} ry={4} fill={N} />
        {corona && <CoronaArc y={-36} x={-4} s={0.85} />}
      </g>
    );
    default: return null;
  }
};
/** Cara de león de perfil (Yaldabaoth y el gobernante león): melena de llamas, hocico, ojo de fuego. */
const CaraLeon: React.FC<{ ab: number; fuego?: boolean }> = ({ ab, fuego }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: 13 }, (_, i) => {
        const a = Math.PI * 0.45 + (i / 12) * Math.PI * 1.35, o = fuego ? Math.sin(f / 3.5 + i * 1.7) * 5 : 0, R = (fuego ? 60 : 50) + (i % 2) * 10;
        return <path key={i} d={`M${r1(Math.cos(a - 0.26) * 26 - 6)} ${r1(Math.sin(a - 0.26) * 26)} Q ${r1(Math.cos(a) * R * 0.8 - 6 + o)} ${r1(Math.sin(a) * R * 0.8)} ${r1(Math.cos(a + 0.08) * R - 6 + o)} ${r1(Math.sin(a + 0.08) * R)} Q ${r1(Math.cos(a + 0.24) * R * 0.75 - 6)} ${r1(Math.sin(a + 0.24) * R * 0.75)} ${r1(Math.cos(a + 0.3) * 26 - 6)} ${r1(Math.sin(a + 0.3) * 26)} Z`} fill={fuego ? (i % 3 === 0 ? GN.rojo : i % 2 ? GN.fuego : GN.fuegoClaro) : i % 2 ? '#8A5A24' : '#A8702E'} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />;
      })}
      {F([[-22, 16], [-26, -12], [-10, -32], [14, -32], [32, -20], [44, -4], [52, 8], [50, 20], [36, 26 + ab * 0.3], [16, 32], [-6, 32]], '#D8A04A', 0.85)}
      {F([[30, -2], [50, 4], [54, 14], [46, 22], [32, 20]], '#E8C27A', 0.7, 1.4)}
      <path d="M46 2 L 54 6 L 50 12 Z" fill="#5A2E1A" stroke={N} strokeWidth={1.2} />
      {F([[20, 24], [48, 22], [42, 30 + ab], [24, 32 + ab]], '#B8803A', 0.6, 1.6)}
      {ab > 0 && <path d={`M28 ${25} l 3 6 l 3 -6 M38 ${24} l 3 6 l 3 -6`} fill={GN.blanco} stroke={N} strokeWidth={0.9} />}
      <path d="M8 -18 Q 20 -24 32 -16" stroke="#7A4A1E" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      {fuego ? <g><ellipse cx={22} cy={-8} rx={8} ry={6} fill={GN.fuegoClaro} stroke={N} strokeWidth={1.8} /><ellipse cx={23} cy={-8} rx={3.4} ry={3.4} fill="#FFFFFF" opacity={0.6 + 0.4 * Math.sin(f / 2)} /><path d="M23 -14 l -2 4 l 3 0 l -2 4" stroke={GN.rojo} strokeWidth={1.2} fill="none" /></g> : <OjoArc x={22} y={-8} r={4.4} />}
    </g>
  );
};

// ---------- dibujos propios ----------
/** El Espíritu Invisible: SOLO luz (nunca una figura). Vuela: el origen es el centro de la luz. */
const EspirituInvisible: React.FC<DibujoProps> = ({ x, y, s, f, opacity = 1 }) => (
  <g opacity={opacity}><LuzPleroma x={x} y={y} r={190 * s} f={f} intensidad={1.1} /></g>
);
/** El Salvador como águila de luz en el árbol del conocimiento: águila dorada con resplandor. */
const AguilaLuz: React.FC<DibujoProps> = (p) => {
  const id = gid(), { x, y, s, f, opacity = 1 } = p;
  return (
    <g opacity={opacity}>
      <defs><radialGradient id={id}><stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} /><stop offset="40%" stopColor={GN.oroClaro} stopOpacity={0.55} /><stop offset="100%" stopColor={GN.oro} stopOpacity={0} /></radialGradient></defs>
      <circle cx={x} cy={y} r={r1(340 * s * (1 + Math.sin(f / 12) * 0.05))} fill={`url(#${id})`} />
      <AguilaEpica {...p} especie="aguila" color="#F2D27A" opacity={1} />
    </g>
  );
};
/** Yaldabaoth: serpiente enroscada con cara de león y ojos de fuego, en su trono (props.trono = false para sacarlo). */
const Yaldabaoth: React.FC<DibujoProps> = (p) => {
  const { x, y, s, voltear, opacity = 1, f, boca, moviendo } = p;
  const id = gid(), trono = p.trono !== false, o = Math.sin(f / (moviendo ? 7 : 16)) * (moviendo ? 12 : 5), ab = boca ? (Math.sin(f / 2.4) > 0 ? 9 : 4) : 0;
  const C1 = '#2E4022', C2 = '#4E6A34', PANZA = '#C9B46A';
  const tubo = (d: string, w: number, k: string) => <g key={k}><path d={d} stroke={N} strokeWidth={w + 7} fill="none" strokeLinecap="round" /><path d={d} stroke={C2} strokeWidth={w} fill="none" strokeLinecap="round" /><path d={d} stroke={C1} strokeWidth={w * 0.55} fill="none" strokeLinecap="round" strokeDasharray="8 14" /></g>;
  const anillo = (cy: number, rx: number, ry: number, w: number) => <g key={cy}>
    <ellipse cx={0} cy={cy} rx={rx} ry={ry} fill="none" stroke={N} strokeWidth={w + 7} />
    <ellipse cx={0} cy={cy} rx={rx} ry={ry} fill="none" stroke={C2} strokeWidth={w} />
    <path d={`M${-rx} ${cy} A ${rx} ${ry} 0 0 0 ${rx} ${cy}`} stroke={PANZA} strokeWidth={w * 0.32} fill="none" strokeDasharray="10 6" transform={`translate(0 ${w * 0.22})`} />
    <ellipse cx={0} cy={cy} rx={rx} ry={ry} fill="none" stroke={C1} strokeWidth={w * 0.4} strokeDasharray="6 16" />
  </g>;
  const cuello: P[] = [[150, -150], [180, -230], [130, -320], [100 + o * 0.4, -400], [130 + o, -470]];
  const cab = cuello[cuello.length - 1];
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <defs><radialGradient id={id}><stop offset="0%" stopColor={GN.fuegoClaro} stopOpacity={0.75} /><stop offset="55%" stopColor={GN.fuego} stopOpacity={0.25} /><stop offset="100%" stopColor={GN.fuego} stopOpacity={0} /></radialGradient></defs>
      <ellipse cx={0} cy={-260} rx={360} ry={340} fill={`url(#${id})`} opacity={0.75 + Math.sin(f / 9) * 0.15} />
      {trono && <TronoLuz x={-40} y={0} s={0.95} f={f} />}
      <ellipse cx={0} cy={-4} rx={250} ry={22} fill={N} opacity={0.3} />
      {tubo(`M-210 -30 C -270 -30, -300 -12, -330 ${r1(-26 + o * 0.6)}`, 26, 'cola')}
      {anillo(-44, 210, 44, 54)}
      {anillo(-112, 176, 38, 50)}
      {anillo(-172, 140, 32, 46)}
      {tubo(suave(cuello), 44, 'cuello')}
      <path d={suave(cuello.slice(0, 4).map(([a, b]) => [a + 10, b] as P))} stroke={PANZA} strokeWidth={13} fill="none" strokeDasharray="10 6" />
      <g transform={`translate(${r1(cab[0])} ${r1(cab[1])}) scale(2.3)`}><CaraLeon ab={ab} fuego /><CoronaArc y={-44} x={0} s={0.9} /></g>
      {[0, 1, 2].map((i) => { const t = ((f / 26 + i / 3) % 1); return <circle key={i} cx={r1(cab[0] + 60 + t * 40)} cy={r1(cab[1] - 30 - t * 120)} r={r1(6 - t * 4)} fill={GN.fuegoClaro} opacity={1 - t} />; })}
    </g>
  );
};
/** Gobernante genérico: muñeco con túnica oscura y cabeza de animal (props.cara, props.color = túnica, props.corona). */
const Arconte: React.FC<DibujoProps> = (p) => {
  const cara = (CARAS_ARCONTE.includes(p.cara as CaraArconte) ? p.cara : 'leon') as CaraArconte;
  return (
    <Personaje x={p.x} y={p.y} s={p.s} voltear={p.voltear} opacity={p.opacity} accion={p.corriendo ? 'correr' : p.moviendo ? 'caminar' : 'parado'}
      cabezaPropia piel={PIEL_ARC} ropa="larga" lisa ropaColor={(p.color as string) ?? '#3A2A26'} ribete={GN.oroOsc} barba={false} tocado={null} peloCorto collar={false}
      brazo={(p.brazo as [number, number]) ?? [20, 40]}
      adornos={{ cabeza: <CabezaArconte cara={cara} corona={p.corona === true} boca={!!p.boca} />, cuerpo: <><Clavo c={GN.oroOsc} /><Cinto c={GN.cueroOsc} /></> }} />
  );
};

// ---------- fichas ----------
const H = (p: Partial<PersonajeProps>, nombre?: string): Ficha => ({ tipo: 'persona', p: { hd: true, barba: false, tocado: null, peloCorto: true, lisa: true, collar: false, orejaSimple: true, ropa: 'larga', ...p }, griego: nombre });
const M = (p: Partial<PersonajeProps>, nombre?: string): Ficha => H({ mujer: true, ...p }, nombre);
const D = (Dibujo: React.FC<DibujoProps>, nombre?: string, p: Record<string, unknown> = {}): Ficha => ({ tipo: 'dibujo', Dibujo, p, griego: nombre });
/** Ser de luz del Pleroma (eones): piel clara, túnica larga del color, nimbo y emblema. */
const luz = (c: string, piel: string, pelo: string, nombre: string, emblema?: 'sol' | 'luna' | 'estrella' | 'llama', extra: Partial<PersonajeProps> = {}): Ficha =>
  H({ piel, pelo, ropaColor: c, ribete: GN.oro, brazo: [24, 40], ...extra, adornos: { detras: <Nimbo c={c} rayos={emblema ? 16 : 0} />, cabeza: <PeloCortoG c={pelo} />, cuerpo: <><Clavo c={GN.oro} />{emblema && <Emblema tipo={emblema} c={c} />}</> } }, nombre);
/** Uno de los siete reyes (cabeza de animal, túnica oscura, corona). */
const rey = (cara: CaraArconte, color: string, nombre: string): Ficha =>
  H({ cabezaPropia: true, piel: PIEL_ARC, ropaColor: color, ribete: GN.oroOsc, brazo: [20, 40], adornos: { cabeza: <CabezaArconte cara={cara} />, cuerpo: <><Clavo c={GN.oroOsc} /><Cinto c={GN.cueroOsc} /></> } }, nombre);

const SALVADOR: Partial<PersonajeProps> = { cabezaPropia: true, piel: '#FFF1CF', ropaColor: '#FFF4D6', ribete: GN.oro, brazo: [30, 60] };
const PIEL_H = '#C99A72', PIEL_M = '#DDB088', PELO = '#3A2618', PELO_L = '#6A4A30';

const NOE = H({ piel: PIEL_H, pelo: '#EDEAE2', cuerpo: 'viejo', ropaColor: '#8A7A5A', ribete: '#5A4A34', brazo: [30, 50], adornos: { cabeza: <><PeloCortoG c="#EDEAE2" c2="#B8B2A4" /><BarbaG c="#EDEAE2" c2="#B8B2A4" larga /></>, cuerpo: <Cinto c="#5A4A34" /> } }, 'NOAH');

export const ELENCO_GNOSIS: Record<string, Ficha> = {
  // ===== El Pleroma (la Plenitud) =====
  // El Espíritu Invisible: solo luz, nunca una persona.
  espiritu_invisible: D(EspirituInvisible, 'THE INVISIBLE SPIRIT', { vuela: true, alto: 420, izq: 260, der: 260 }),
  // Barbelo, el primer pensamiento, la Madre-Padre: plata y blanco, estrellas en el vestido, diadema de tres estrellas.
  barbelo_oficial: M({ piel: '#EEF0F6', pelo: '#F4F6FA', ropaColor: GN.plata, ribete: GN.plataOsc, brazo: [34, 70], adornos: { detras: <Nimbo c="#F4F6FA" aro={GN.plataOsc} r={66} rayos={12} />, cabeza: <><PeloLargo c="#F4F6FA" c2={GN.plataOsc} largo={130} /><TresEstrellas /></>, cuerpo: <><Estrellado /><Clavo c={GN.plataOsc} /></> } }, 'BARBELO'),
  // El Autógeno (el que se engendra a sí mismo, el Cristo): oro, nimbo con rayos.
  autogeno_oficial: luz(GN.oro, '#F6DFA0', '#B8862E', 'THE SELF-GENERATED', 'sol', { s: 1.04 }),
  // Las cuatro grandes luces (cada una con su color y su emblema).
  harmozel_oficial: luz('#F2C84A', '#FBE6B0', '#C9962E', 'HARMOZEL', 'sol'),
  oroiael_oficial: luz('#BFD4F2', '#E2ECFA', '#7E96C0', 'OROIAEL', 'luna'),
  daveithai_oficial: luz('#F2A88A', '#FBD9C8', '#B8705A', 'DAVEITHAI', 'estrella'),
  eleleth_oficial: luz('#B8A4F0', '#E4DAFA', '#7A64B8', 'ELELETH', 'llama'),
  // Sofía, la Sabiduría: central y expresiva; nimbo de oro y manto violeta. `sofia_apagada_oficial` = sin luz, llorando.
  sofia_oficial: M({ piel: '#F4DCC4', pelo: '#8A5A2E', ropaColor: '#EFE4F6', ribete: GN.violeta, brazo: [30, 60], adornos: { detras: <Nimbo c={GN.oroClaro} />, cabeza: <PeloLargo c="#8A5A2E" c2="#C08A50" />, cuerpo: <MantoCruzado c={GN.violeta} c2={GN.oro} /> } }, 'SOPHIA'),
  sofia_apagada_oficial: M({ piel: '#C9BEC6', pelo: '#5A4A44', ropaColor: '#9A92AA', ribete: '#5E567A', expresion: 'tristeza', inclinar: 6, cabeza: -8, brazo: [10, 70], adornos: { detras: <circle cx={20} cy={-334} r={60} fill="none" stroke="#8A8298" strokeWidth={3} strokeDasharray="6 10" />, cabeza: <><PeloLargo c="#5A4A44" c2="#7A6A62" /><Lagrimas /></>, cuerpo: <MantoCruzado c="#4E4668" /> } }, 'SOPHIA'),
  // El Salvador (Cristo): figura de luz sin rostro definido, en su mandorla. Se aparece como niño, anciano y servidor.
  salvador_oficial: H({ ...SALVADOR, adornos: { detras: <Mandorla />, cabeza: <CabezaLuz />, cuerpo: <><Clavo c={GN.oro} /><Clavo c={GN.oro} dx={-24} /></> } }, 'THE SAVIOR'),
  salvador_nino_oficial: H({ ...SALVADOR, cuerpo: 'nino', ropa: 'tunica', adornos: { detras: <Mandorla alto={500} ancho={170} />, cabeza: <CabezaLuz />, cuerpo: <Clavo c={GN.oro} /> } }, 'THE SAVIOR'),
  salvador_anciano_oficial: H({ ...SALVADOR, cuerpo: 'viejo', brazo: [40, 50], adornos: { detras: <Mandorla />, cabeza: <CabezaLuz />, cuerpo: <><Clavo c={GN.oro} /><Cinto c={GN.oroOsc} /></> } }, 'THE SAVIOR'),
  salvador_servidor_oficial: H({ ...SALVADOR, ropa: 'corta', ropaColor: '#F6EAD0', brazo: [50, 40], adornos: { detras: <Mandorla alto={440} />, cabeza: <CabezaLuz />, cuerpo: <><Cinto c={GN.oro} /><path d="M-24 -212 L -30 -150 L 20 -148 L 24 -214" fill={GN.blanco} stroke={N} strokeWidth={1.8} /></> } }, 'THE SAVIOR'),
  salvador_nino: { tipo: 'persona', p: {} }, salvador_anciano: { tipo: 'persona', p: {} }, salvador_servidor: { tipo: 'persona', p: {} }, // alias (se completan abajo)
  // El Salvador como águila sobre el árbol del conocimiento.
  aguila_luz: D(AguilaLuz, 'THE EAGLE OF LIGHT', { vuela: true, alto: 360, izq: 380, der: 380 }),
  // Epinoia (Zoe, la Vida): luz escondida dentro de Adán; dorada y blanca, con la estrella en el pecho.
  epinoia_oficial: M({ piel: '#FFF0D8', pelo: GN.oro, ropaColor: GN.blanco, ribete: GN.oro, brazo: [40, 50], adornos: { detras: <Nimbo c={GN.oroClaro} rayos={14} />, cabeza: <PeloLargo c={GN.oro} c2={GN.oroOsc} />, cuerpo: <><Clavo c={GN.oro} /><Emblema tipo="estrella" c={GN.oro} /></> } }, 'EPINOIA'),

  // ===== Los gobernantes =====
  // Yaldabaoth (Saklas, Samael): serpiente con cara de león y ojos de fuego, en su trono.
  yaldabaoth_oficial: D(Yaldabaoth, 'YALDABAOTH', { alto: 640, izq: 380, der: 340 }),
  // Gobernante genérico: props.cara = oveja | burro | hiena | mono | dragon | serpiente | siete | fuego | leon | oso | gato;
  // props.color = túnica; props.corona = true para coronarlo.
  arconte: D(Arconte, 'RULER', { alto: 400, izq: 70, der: 80 }),
  // Los siete reyes (uno por cielo), con la cara que les da el libro.
  athoth_oficial: rey('oveja', '#4A2A2A', 'ATHOTH'),
  eloaiou_oficial: rey('burro', '#2E3A2A', 'ELOAIOU'),
  astaphaios_oficial: rey('hiena', '#4A3A22', 'ASTAPHAIOS'),
  yao_oficial: rey('siete', '#22342A', 'YAO'),
  sabaoth_oficial: rey('dragon', '#3A2A3E', 'SABAOTH'),
  adonin_oficial: rey('mono', '#3E2E22', 'ADONIN'),
  sabbede_oficial: rey('fuego', '#5A2418', 'SABBEDE'),

  // ===== Los humanos =====
  // Adán: primero un cuerpo de alma, quieto y sin movimiento; después brilla con la luz; después lo encierran en la tierra.
  adan_gnosis_oficial: H({ piel: '#C6D2E2', pelo: '#8A98B4', ropaColor: '#DCE4EE', ribete: '#9AA8C0', ojosCerrados: true, brazo: [6, 6], adornos: { cabeza: <PeloCortoG c="#8A98B4" />, cuerpo: <Cinto c="#9AA8C0" /> } }, 'ADAM'),
  adan_gnosis_luz_oficial: H({ piel: '#F2D4A8', pelo: PELO_L, ropaColor: '#FFF4D6', ribete: GN.oro, brazo: [40, 50], adornos: { detras: <Nimbo c={GN.oroClaro} rayos={12} />, cabeza: <PeloCortoG c={PELO_L} />, cuerpo: <><Clavo c={GN.oro} /><Cinto c={GN.oro} /></> } }, 'ADAM'),
  adan_gnosis_tierra_oficial: H({ piel: '#9A7452', pelo: PELO, ropa: 'corta', ropaColor: '#7A5A3A', ribete: '#5A4030', brazo: [20, 30], adornos: { cabeza: <PeloCortoG c={PELO} />, cuerpo: <Cinto c="#4A3424" /> } }, 'ADAM'),
  eva_gnosis_oficial: M({ piel: PIEL_M, pelo: PELO, ropaColor: '#D9A070', ribete: '#8A5A34', brazo: [30, 60], adornos: { cabeza: <PeloLargo c={PELO} c2={PELO_L} />, cuerpo: <Cinto c="#8A5A34" /> } }, 'EVE'),
  set_gnosis_oficial: H({ piel: PIEL_H, pelo: PELO, ropa: 'corta', ropaColor: '#8A9A6A', ribete: '#5A6A44', brazo: [24, 40], adornos: { cabeza: <><PeloCortoG c={PELO} /><BarbaG c={PELO} /></>, cuerpo: <Cinto c="#4A3424" /> } }, 'SETH'),
  noe_gnosis_oficial: NOE,
  noe_gnosis: NOE, // alias corto
  // Juan, hijo de Zebedeo: joven, túnica clara con manto rojo y su códice.
  juan_apostol_oficial: H({ piel: PIEL_H, pelo: PELO, ropaColor: GN.papiro, ribete: GN.rojo, brazo: [30, 60], adornos: { cabeza: <PeloCortoG c={PELO} c2={PELO_L} />, cuerpo: <MantoCruzado c={GN.rojo} c2={GN.rojoOsc} />, mano: <CodiceMano /> } }, 'JOHN'),
  // Jacobo (Santiago), el hermano de Juan: barba, túnica ocre y manto marrón.
  jacobo_oficial: H({ piel: PIEL_H, pelo: PELO, ropaColor: '#C9A86A', ribete: '#7A5A34', brazo: [24, 40], adornos: { cabeza: <><PeloCortoG c={PELO} c2={PELO_L} /><BarbaG c={PELO} /></>, cuerpo: <MantoCruzado c="#7A5C3A" c2="#4A3420" /> } }, 'JAMES'),
  // Arimanios, el fariseo que encara a Juan en el templo: barba, manto de oración a rayas sobre la cabeza.
  arimanios_oficial: H({ piel: PIEL_H, pelo: '#2A1A10', ropaColor: '#2E3456', ribete: GN.oroOsc, brazo: [40, 30], adornos: { cabeza: <><BarbaG c="#2A1A10" /><MantoCabeza c="#E8E0CC" raya="#3E4A8A" /></>, cuerpo: <Cinto c={GN.oroOsc} /> } }, 'ARIMANIOS'),
  hombre_gnosis: H({ piel: PIEL_H, pelo: PELO, ropa: 'corta', ropaColor: '#B8A07A', ribete: '#7A6448', brazo: [20, 30], adornos: { cabeza: <><PeloCortoG c={PELO} /><BarbaG c={PELO} /></>, cuerpo: <Cinto c="#5A4030" /> } }, 'MAN'),
  mujer_gnosis: M({ piel: PIEL_M, pelo: PELO, ropaColor: '#A8785A', ribete: '#6A4A34', brazo: [24, 50], adornos: { cabeza: <MantoCabeza c="#C9B48A" />, cuerpo: <Cinto c="#6A4A34" /> } }, 'WOMAN'),
  // La serpiente del paraíso (la que enseña a los gobernantes su deseo).
  serpiente_paraiso: D(SerpienteEpica, 'THE SERPENT', { color: '#3E5A3A', alto: 420, izq: 200, der: 120 }),
};

// alias cortos de las formas del Salvador (los guiones usan en_que: 'salvador_anciano'…)
for (const k of ['nino', 'anciano', 'servidor']) ELENCO_GNOSIS[`salvador_${k}`] = ELENCO_GNOSIS[`salvador_${k}_oficial`];

export const NOMBRE_EN_GNOSIS: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_GNOSIS).filter(([, f]) => !!f.griego).map(([k, f]) => [k, f.griego as string]));
