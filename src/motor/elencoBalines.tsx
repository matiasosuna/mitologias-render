// Elenco balinés para el tema "kamasan": dioses, reyes, sacerdotes y gente con sus atributos de la pintura wayang
// de Kamasan (coronas de llama, adorno de oreja, collar badong, tela poleng, kris), y criaturas propias (Rangda,
// Barong, las naga, Bedawang Nala, los leak, Barong Landung, ogoh-ogoh). Las personas son el muñeco de siempre +
// `adornos`; las criaturas se dibujan acá (tipo "dibujo"). Colores literales: C cambia con el tema.
// Las claves llevan nombres balineses o un sufijo (_bali) para no chocar con otras series (hindú, maorí…).
import React, { useId } from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, miembro, type P, type PersonajeProps } from '../comun/vasija';
import { KM, Espiral, Karang } from '../comun/kamasan';
import type { Ficha } from './elenco';
import type { DibujoProps } from './elencoAzteca';

const r1 = (v: number) => v.toFixed(1);
const NEGRO = KM.negro;

// ---------- piezas de cabeza (cara de perfil a la derecha, ojo en 18,-6, coronilla en y≈-36) ----------
/** Corona de llamas de Kamasan (gelungan): banda dorada, picos de llama y adorno de garuda en la nuca. */
const Gelungan: React.FC<{ c?: string; c2?: string; alto?: number; nuca?: boolean }> = ({ c = KM.oro, c2 = KM.rojo, alto = 1, nuca = true }) => (
  <g>
    {nuca && <><path d="M-28 -22 C -62 -30, -80 -2, -64 22 C -56 34, -40 30, -38 16 C -50 16, -54 2, -46 -6 C -42 -12, -34 -10, -30 -4 Z" fill={c} stroke={NEGRO} strokeWidth={1.8} /><Espiral x={-52} y={8} r={8} c={c2} w={1.8} /></>}
    <path d={`M-22 -26 L -20 ${-56 * alto} L -10 ${-44 * alto} L -4 ${-86 * alto} L 6 ${-48 * alto} L 16 ${-60 * alto} L 22 -30 Z`} fill={c} stroke={NEGRO} strokeWidth={2} />
    <path d={`M-4 ${-80 * alto} L 0 ${-60 * alto} L 4 ${-62 * alto}`} stroke={c2} strokeWidth={2} fill="none" />
    <circle cx={-2} cy={-46 * alto} r={4.5} fill={c2} stroke={NEGRO} strokeWidth={1.2} />
    <path d="M-32 -8 C -26 -32, 8 -42, 30 -26 L 27 -14 C 6 -26, -18 -22, -32 -8 Z" fill={c} stroke={NEGRO} strokeWidth={2} />
    {[-20, -6, 8, 20].map((x, i) => <circle key={i} cx={x} cy={-18 - (i === 1 || i === 2 ? 6 : 2)} r={2.6} fill={c2} />)}
  </g>
);
/** Adorno de oreja (sumping): hoja de llama dorada que cae sobre la oreja. */
const Sumping: React.FC<{ c?: string }> = ({ c = KM.oro }) => <g><path d="M-12 -8 C -2 2, -4 22, -12 36 C -20 24, -24 6, -12 -8 Z" fill={c} stroke={NEGRO} strokeWidth={1.6} /><circle cx={-12} cy={2} r={4} fill={KM.rojo} stroke={NEGRO} strokeWidth={1} /></g>;
/** Flor de frangipani (jepun) detrás de la oreja. */
const Flor: React.FC<{ x?: number; y?: number; r?: number }> = ({ x = -16, y = -14, r = 5 }) => <g>{Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={x} cy={y - r} rx={r * 0.55} ry={r} fill={KM.blanco} stroke={NEGRO} strokeWidth={0.8} transform={`rotate(${i * 72} ${x} ${y})`} />)}<circle cx={x} cy={y} r={r * 0.4} fill={KM.oro} /></g>;
/** Tela de cabeza de hombre (udeng) con el nudo arriba al frente. */
const Udeng: React.FC<{ c?: string; c2?: string }> = ({ c = KM.blanco, c2 = KM.ocre }) => (
  <g>
    <path d="M-33 -2 C -30 -34, 10 -44, 31 -22 L 29 -11 C 8 -26, -16 -22, -33 -2 Z" fill={c} stroke={NEGRO} strokeWidth={2} />
    <path d="M-30 -10 C -22 -26, 6 -34, 28 -18" stroke={c2} strokeWidth={2.4} fill="none" strokeDasharray="4 3" />
    <path d="M14 -30 C 14 -52, 28 -58, 34 -46 C 28 -42, 24 -36, 24 -27 Z" fill={c} stroke={NEGRO} strokeWidth={2} />
  </g>
);
/** Pelo de mujer en rodete (pusung) con flores. */
const Rodete: React.FC<{ flores?: boolean; c?: string }> = ({ flores = true, c = NEGRO }) => (
  <g>
    <path d="M-32 6 C -36 -30, 0 -44, 24 -30 C 10 -30, -6 -24, -14 -12 C -20 -2, -24 8, -32 6 Z" fill={c} />
    <ellipse cx={-38} cy={-14} rx={16} ry={14} fill={c} stroke={NEGRO} strokeWidth={1} />
    {flores && <><Flor x={-38} y={-28} r={5.5} /><Flor x={-26} y={-30} r={4.5} /><Flor x={-48} y={-22} r={4} /></>}
  </g>
);
/** Moño alto de sacerdote (mpu): pelo recogido arriba, envuelto en blanco. */
const MonoSacerdote: React.FC<{ canas?: boolean }> = ({ canas }) => (
  <g>
    <path d="M-32 6 C -36 -30, 0 -44, 24 -30 C 6 -32, -10 -26, -20 -14 C -24 -4, -26 6, -32 6 Z" fill={canas ? '#E8E2D4' : NEGRO} stroke={NEGRO} strokeWidth={1} />
    <ellipse cx={-6} cy={-48} rx={15} ry={16} fill={canas ? '#E8E2D4' : NEGRO} stroke={NEGRO} strokeWidth={1.4} />
    <path d="M-20 -44 Q -6 -36 8 -44" stroke={KM.blanco} strokeWidth={6} fill="none" />
    <path d="M-20 -44 Q -6 -36 8 -44" stroke={NEGRO} strokeWidth={1} fill="none" />
    <Flor x={-4} y={-64} r={5} />
  </g>
);
/** Moño alto de princesa china con horquillas doradas. */
const MonoChino: React.FC = () => (
  <g>
    <path d="M-32 6 C -36 -30, 0 -44, 24 -30 C 8 -30, -10 -24, -20 -12 C -24 -2, -26 8, -32 6 Z" fill={NEGRO} />
    <ellipse cx={-14} cy={-50} rx={24} ry={14} fill={NEGRO} />
    <path d="M-40 -58 L 14 -40 M-36 -44 L 18 -56" stroke={KM.oro} strokeWidth={3} strokeLinecap="round" />
    <circle cx={16} cy={-56} r={4} fill={KM.rojo} stroke={NEGRO} strokeWidth={1} /><circle cx={14} cy={-40} r={3.4} fill={KM.oro} stroke={NEGRO} strokeWidth={1} />
  </g>
);
/** Cara de demonio (raksasa): ojo redondo saltón, ceja gruesa, colmillos y pelo encrespado en la nuca. */
const CaraRaksasa: React.FC<{ pelo?: string; colmillos?: number }> = ({ pelo = NEGRO, colmillos = 1 }) => (
  <g>
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-26 - i * 2} ${-26 + i * 12} q -26 -6 -30 ${-14 + i * 2} q 14 10 26 6`} fill={pelo} stroke={NEGRO} strokeWidth={1} />)}
    <circle cx={18} cy={-6} r={10} fill={KM.blanco} stroke={KM.rojo} strokeWidth={3} />
    <circle cx={21} cy={-5} r={4.6} fill={NEGRO} />
    <path d="M4 -20 Q 18 -30 32 -18" stroke={NEGRO} strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d={`M24 18 C ${26} ${18 - 18 * colmillos}, ${34} ${18 - 22 * colmillos}, ${38} ${18 - 26 * colmillos} C ${34} ${16 - 12 * colmillos}, 32 16, 30 22 Z`} fill={KM.blanco} stroke={NEGRO} strokeWidth={1.4} />
    <path d="M30 22 L 40 20" stroke={NEGRO} strokeWidth={2} />
  </g>
);
/** Pelo largo suelto y canoso (Calon Arang) o negro (discípulas), cae por la espalda. */
const PeloSuelto: React.FC<{ c?: string }> = ({ c = '#E8E2D4' }) => {
  const f = useCurrentFrame();
  return <g>{[0, 1, 2, 3].map((i) => <path key={i} d={`M${-20 - i * 4} -330 C ${-50 - i * 6} ${-280 + Math.sin(f / 16 + i) * 6}, ${-40 - i * 6} -230, ${-56 - i * 5 + Math.sin(f / 12 + i) * 6} -170`} stroke={c} strokeWidth={12 - i} fill="none" strokeLinecap="round" />)}</g>;
};
/** Cabeza de cerdo (el rey de Bedahulu, según la leyenda): tapa toda la cara. */
const CabezaCerdo: React.FC = () => (
  <g>
    <ellipse cx={4} cy={2} rx={44} ry={40} fill="#C9988A" stroke={NEGRO} strokeWidth={2.4} />
    <path d="M30 -6 L 62 -4 Q 70 8 62 22 L 30 26 Z" fill="#D9A89A" stroke={NEGRO} strokeWidth={2.2} />
    <ellipse cx={64} cy={9} rx={5} ry={10} fill="#E4B8AA" stroke={NEGRO} strokeWidth={1.6} />
    <circle cx={63} cy={5} r={1.8} fill={NEGRO} /><circle cx={63} cy={13} r={1.8} fill={NEGRO} />
    <path d="M-14 -28 L -30 -58 L 2 -38 Z" fill="#B88070" stroke={NEGRO} strokeWidth={2} />
    <circle cx={22} cy={-12} r={4.6} fill={KM.blanco} stroke={NEGRO} strokeWidth={1.2} /><circle cx={23} cy={-12} r={2.2} fill={NEGRO} />
    <path d="M34 28 q 10 4 20 -2" stroke={NEGRO} strokeWidth={1.8} fill="none" />
  </g>
);
/** Casco de general de Majapahit: gorro oscuro con banda dorada y adorno atrás. */
const GorroMajapahit: React.FC = () => <g><path d="M-33 -2 C -32 -40, 16 -50, 32 -20 L 28 -10 C 8 -26, -16 -22, -33 -2 Z" fill="#2C2A3A" stroke={NEGRO} strokeWidth={2} /><path d="M-31 -8 C -22 -26, 8 -34, 29 -16" stroke={KM.oro} strokeWidth={5} fill="none" /><path d="M-30 -20 C -50 -30, -60 -14, -56 4" stroke={KM.oro} strokeWidth={4} fill="none" /></g>;

// ---------- piezas de cuerpo (hombros y≈-300, cintura -210, pies 0) ----------
/** Collar ancho de oro (badong) con piedras rojas. */
const Badong: React.FC<{ c?: string }> = ({ c = KM.oro }) => (
  <g>
    <path d="M-26 -304 C -24 -262, 32 -258, 38 -300 L 30 -304 C 24 -276, -12 -276, -18 -304 Z" fill={c} stroke={NEGRO} strokeWidth={1.8} />
    {[-14, 0, 14, 26].map((x, i) => <circle key={i} cx={x} cy={-280 + (i === 0 || i === 3 ? -6 : 0)} r={3.2} fill={KM.rojo} stroke={NEGRO} strokeWidth={0.8} />)}
  </g>
);
/** Faja con un paño que cuelga al frente (kamben de fiesta). */
const Faja: React.FC<{ c?: string; c2?: string }> = ({ c = KM.rojo, c2 = KM.oro }) => <g><path d="M-30 -218 L 34 -220 L 34 -204 L -30 -202 Z" fill={c} stroke={NEGRO} strokeWidth={1.6} /><path d="M18 -206 L 30 -206 L 34 -140 L 20 -150 Z" fill={c} stroke={NEGRO} strokeWidth={1.6} /><path d="M-30 -210 L 34 -212" stroke={c2} strokeWidth={2.4} strokeDasharray="5 4" /></g>;
/** Paño a cuadros poleng sobre la cadera (guardianes, Jero Gede). */
const Poleng: React.FC<{ largo?: boolean }> = ({ largo }) => {
  const id = 'po' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const y1 = largo ? -40 : -150;
  return (
    <g>
      <defs><clipPath id={id}><path d={`M-32 -214 L 36 -216 L ${largo ? 46 : 42} ${y1} L ${largo ? -42 : -38} ${y1 + 4} Z`} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <rect x={-50} y={-220} width={100} height={200} fill={KM.blanco} />
        {Array.from({ length: 8 }, (_, i) => Array.from({ length: 16 }, (_, j) => (i + j) % 2 ? <rect key={`${i}-${j}`} x={-48 + i * 12} y={-218 + j * 12} width={12} height={12} fill={NEGRO} /> : null))}
      </g>
      <path d={`M-32 -214 L 36 -216 L ${largo ? 46 : 42} ${y1} L ${largo ? -42 : -38} ${y1 + 4} Z`} fill="none" stroke={NEGRO} strokeWidth={1.8} />
    </g>
  );
};
/** Banda cruzada sobre el pecho (selendang). */
const Selendang: React.FC<{ c?: string }> = ({ c = KM.oro }) => <path d="M-24 -300 L -12 -300 L 34 -214 L 22 -212 Z" fill={c} stroke={NEGRO} strokeWidth={1.6} />;
/** Kris en la espalda (el mango asoma sobre el hombro). */
const KrisEspalda: React.FC = () => <g transform="translate(-30 -226) rotate(-28)"><path d="M0 0 L 0 -70" stroke="#6E6A66" strokeWidth={6} /><path d="M-8 -70 L 8 -70 L 4 -106 Q 0 -116 -4 -106 Z" fill={KM.tierra} stroke={NEGRO} strokeWidth={1.6} /><rect x={-12} y={-74} width={24} height={8} fill={KM.oro} stroke={NEGRO} strokeWidth={1} /></g>;
/** Kris en la mano (puñal de hoja ondulada). */
const KrisMano: React.FC = () => <g transform="rotate(-10)"><path d="M0 -6 C 6 -30, -6 -50, 2 -74 C 8 -96, -4 -112, 2 -132 L -4 -132 C -10 -112, 2 -96, -4 -74 C -12 -50, 0 -30, -6 -6 Z" fill="#A8A4A0" stroke={NEGRO} strokeWidth={1.4} /><rect x={-14} y={-8} width={24} height={10} fill={KM.oro} stroke={NEGRO} strokeWidth={1} /><path d="M-4 2 L -4 30" stroke={KM.tierra} strokeWidth={9} strokeLinecap="round" /></g>;
/** Libro de hoja de palma en la mano. */
const LontarMano: React.FC = () => <g transform="rotate(-20) scale(0.5) translate(0 20)"><rect x={-60} y={-30} width={120} height={8} fill={KM.tierra} stroke={NEGRO} strokeWidth={2} />{[0, 1, 2, 3].map((k) => <rect key={k} x={-58} y={-22 + k * 5} width={116} height={5} fill={KM.ocreClaro} stroke={KM.tierra} strokeWidth={1} />)}<rect x={-60} y={-2} width={120} height={8} fill={KM.tierra} stroke={NEGRO} strokeWidth={2} /><path d="M-30 -30 V 6 M30 -30 V 6" stroke={KM.rojo} strokeWidth={3} /></g>;
/** Campana de sacerdote (genta) en la mano. */
const GentaMano: React.FC = () => { const f = useCurrentFrame(); return <g transform={`rotate(${r1(Math.sin(f / 3) * 5)}) scale(0.7)`}><path d="M-4 -60 L -8 -76 L 0 -90 L 8 -76 L 4 -60 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={1.6} /><rect x={-4} y={-60} width={8} height={22} fill={KM.oro} stroke={NEGRO} strokeWidth={1.4} /><path d="M-22 0 C -22 -30, -14 -40, 0 -40 C 14 -40, 22 -30, 22 0 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={2} /><circle cx={0} cy={4} r={4} fill={NEGRO} /></g>; };
/** Joya roja que brilla en la mano (la de la cola de la naga). */
const JoyaMano: React.FC = () => { const f = useCurrentFrame(); return <g transform="translate(0 -10)"><circle r={22} fill={KM.ocreClaro} opacity={0.35 + Math.sin(f / 5) * 0.15} /><path d="M0 -12 L 10 0 L 0 12 L -10 0 Z" fill={KM.rojo} stroke={NEGRO} strokeWidth={1.6} /></g>; };
/** Abanico/flor de ofrenda en la mano (mujeres que llevan ofrendas). */
const CanangMano: React.FC = () => <g transform="translate(0 -6)"><path d="M-22 0 L -18 -12 L 18 -12 L 22 0 Z" fill={KM.verdeClaro} stroke={NEGRO} strokeWidth={1.4} />{[[-10, KM.rojo], [0, KM.blanco], [10, KM.ocreClaro]].map(([dx, c], i) => <circle key={i} cx={dx as number} cy={-18} r={5} fill={c as string} stroke={NEGRO} strokeWidth={0.8} />)}</g>;
/** Paño blanco mágico (kain sakti) de Rangda y Calon Arang. */
const PanoMano: React.FC = () => { const f = useCurrentFrame(); return <path d={`M0 0 C 20 20, ${10 + Math.sin(f / 8) * 10} 60, ${30 + Math.sin(f / 6) * 12} 100 L ${48 + Math.sin(f / 6) * 12} 92 C 30 60, 30 20, 12 -4 Z`} fill={KM.blanco} stroke={NEGRO} strokeWidth={1.6} />; };

// ---------- criaturas ----------
const pata = (fase: number, amp: number, cad: P, ph: number, l1: number, l2: number, anchos: number[]) => {
  const a = Math.sin(fase + ph) * amp;
  const rod: P = [cad[0] + Math.sin((a * Math.PI) / 180) * l1, cad[1] + Math.cos((a * Math.PI) / 180) * l1];
  const b = a - 12 - Math.max(0, Math.sin(fase + ph + 1.5)) * 22;
  const pie: P = [rod[0] + Math.sin((b * Math.PI) / 180) * l2, rod[1] + Math.cos((b * Math.PI) / 180) * l2];
  return miembro([cad, rod, pie], anchos);
};
const ojoSalton = (x: number, y: number, r: number) => <g><circle cx={x} cy={y} r={r + 3} fill={KM.rojo} stroke={NEGRO} strokeWidth={1.6} /><circle cx={x} cy={y} r={r} fill={KM.blanco} stroke={NEGRO} strokeWidth={1.4} /><circle cx={x + r * 0.25} cy={y} r={r * 0.45} fill={NEGRO} /></g>;

/** Rangda: reina de los leak — melena blanca hasta el suelo, máscara de ojos saltones, colmillos y lengua de fuego,
 * uñas largas y el cuerpo a rayas de su traje. Origen = pies. */
const Rangda: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, boca }) => {
  const fase = moviendo ? f * 0.18 : 0, amp = moviendo ? 18 : 0, m = Math.sin(f / 12);
  const pierna = (ph: number, dx: number) => pata(fase, amp, [dx, -150], ph, 80, 74, [40, 30, 24]);
  const brazo = (k: 1 | -1) => miembro([[k * 46, -310], [k * 86, -350 + m * 6], [k * 100, -420 + m * 10]], [26, 20, 16]);
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-40 + i * 10} -400 C ${-80 + i * 8} ${-300 + Math.sin(f / 14 + i) * 10}, ${-70 + i * 12} -180, ${-90 + i * 14 + Math.sin(f / 10 + i) * 10} -40`} stroke={i % 2 ? KM.blanco : '#D8D0C0'} strokeWidth={16} fill="none" strokeLinecap="round" />)}
      {[0, Math.PI].map((ph, i) => <g key={i}><path d={pierna(ph, i ? 20 : -20)} fill={KM.blanco} stroke={NEGRO} strokeWidth={2.4} /><path d={pierna(ph, i ? 20 : -20)} fill="none" stroke={NEGRO} strokeWidth={30} strokeDasharray="6 12" opacity={0.6} /></g>)}
      <path d={suave([[-70, -330], [0, -352], [70, -330], [80, -240], [62, -130], [-62, -130], [-80, -240]], true)} fill="#D8D0C0" stroke={NEGRO} strokeWidth={2.6} />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-62 + i * 11} -336 C ${-66 + i * 11 + Math.sin(f / 10 + i) * 5} -270, ${-58 + i * 11} -200, ${-64 + i * 11.5 + Math.sin(f / 9 + i) * 6} -134`} stroke={i % 3 ? '#9A9286' : KM.blanco} strokeWidth={3} fill="none" />)}
      <path d="M-58 -200 Q 0 -186 58 -200" stroke={KM.rojo} strokeWidth={8} fill="none" /><path d="M-58 -200 Q 0 -186 58 -200" stroke={KM.oro} strokeWidth={3} fill="none" strokeDasharray="6 6" />
      {[1, -1].map((k) => <g key={k}><path d={brazo(k as 1 | -1)} fill={KM.blanco} stroke={NEGRO} strokeWidth={2.2} /><path d={brazo(k as 1 | -1)} fill="none" stroke={NEGRO} strokeWidth={22} strokeDasharray="5 10" opacity={0.55} />{[-10, 0, 10].map((d, j) => <path key={j} d={`M${k * 100 + d} ${-420 + m * 10} q ${k * 6} -30 ${k * 22} -42`} stroke={NEGRO} strokeWidth={4} fill="none" strokeLinecap="round" />)}</g>)}
      <g transform={`translate(10 -404) rotate(${r1(m * 3)}) scale(1.22)`}>
        <path d="M-50 -40 L -40 -96 L -24 -70 L -8 -116 L 8 -70 L 26 -100 L 34 -60 L 54 -40 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={2.2} />
        <circle r={56} fill="#F2E6D0" stroke={NEGRO} strokeWidth={2.6} />
        <path d="M-50 -10 Q -30 -34 -6 -14 M6 -14 Q 30 -34 50 -10" stroke={NEGRO} strokeWidth={6} fill="none" strokeLinecap="round" />
        {ojoSalton(-24, -2, 15)}{ojoSalton(24, -2, 15)}
        <path d="M-8 6 Q 0 26 8 6" fill={KM.rojo} stroke={NEGRO} strokeWidth={1.6} />
        <path d={`M-36 30 Q 0 ${boca ? 64 : 52} 36 30 Z`} fill={KM.rojoOsc} stroke={NEGRO} strokeWidth={2} />
        {[-26, 26].map((dx) => <path key={dx} d={`M${dx} 32 C ${dx * 1.3} 10, ${dx * 1.6} -4, ${dx * 1.9} -12 C ${dx * 1.5} 4, ${dx * 1.2} 18, ${dx * 0.8} 36 Z`} fill={KM.blanco} stroke={NEGRO} strokeWidth={1.4} />)}
        <path d={`M-12 40 C -16 90, ${-6 + m * 8} 140, ${4 + m * 10} 190 C ${16 + m * 10} 140, 18 90, 12 40 Z`} fill={KM.rojo} stroke={NEGRO} strokeWidth={2} />
        {[90, 130, 170].map((yy, i) => <path key={i} d={`M${-6 + m * 6} ${yy} q 8 -12 14 0`} stroke={KM.oro} strokeWidth={3} fill="none" />)}
      </g>
    </g>
  );
};

/** Barong Ket: el protector con forma de león — máscara roja de ojos saltones, corona dorada, barba blanca,
 * cuerpo de flecos dorados con espejitos y cuatro piernas a rayas (las de los dos danzantes). Origen = pies. */
const Barong: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, corriendo, f, boca }) => {
  const fase = moviendo || corriendo ? f * (corriendo ? 0.34 : 0.2) : 0, amp = moviendo || corriendo ? 22 : 0;
  const bote = moviendo || corriendo ? -Math.abs(Math.sin(fase)) * 6 : Math.sin(f / 16) * 2;
  const pierna = (dx: number, ph: number) => pata(fase, amp, [dx, -120], ph, 62, 58, [30, 22, 18]);
  const abre = boca ? 14 + Math.abs(Math.sin(f / 3)) * 10 : Math.abs(Math.sin(f / 9)) * 4;
  return (
    <g transform={`translate(${x} ${y + bote}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {[[-150, Math.PI], [70, 0]].map(([dx, ph], i) => <path key={i} d={pierna(dx, ph)} fill={KM.blanco} stroke={NEGRO} strokeWidth={2} />)}
      <path d={`M-176 -230 C -210 -280, -200 -360, -160 ${-390 + Math.sin(f / 10) * 8}`} stroke={NEGRO} strokeWidth={24} fill="none" strokeLinecap="round" />
      <path d={`M-176 -230 C -210 -280, -200 -360, -160 ${-390 + Math.sin(f / 10) * 8}`} stroke={KM.oro} strokeWidth={18} fill="none" strokeLinecap="round" strokeDasharray="10 6" />
      <circle cx={-158} cy={-396 + Math.sin(f / 10) * 8} r={10} fill={KM.oro} stroke={NEGRO} strokeWidth={2} />
      <path d={suave([[-190, -230], [-120, -300], [0, -300], [110, -290], [150, -230], [130, -130], [-180, -130]], true)} fill="#C98F3A" stroke={NEGRO} strokeWidth={2.8} />
      {Array.from({ length: 3 }, (_, row) => Array.from({ length: 16 }, (_, i) => { const px = -180 + i * 20, py = -290 + row * 52 + (row === 0 ? Math.abs(px) * 0.02 : 0); return <path key={`${row}-${i}`} d={`M${px} ${py} q ${Math.sin(f / 8 + i + row) * 3} 28 0 52`} stroke={row % 2 ? KM.blanco : KM.oro} strokeWidth={6} strokeLinecap="round" />; }))}
      {[-140, -80, -20, 40].map((px, i) => <g key={i}><circle cx={px} cy={-280} r={9} fill={KM.azulClaro} stroke={KM.oro} strokeWidth={3} /><circle cx={px - 2} cy={-282} r={3} fill={KM.blanco} /></g>)}
      {[[-120, 0.6], [100, Math.PI + 0.6]].map(([dx, ph], i) => <path key={`d${i}`} d={pierna(dx, ph)} fill={KM.blanco} stroke={NEGRO} strokeWidth={2} />)}
      {[-120, -150, 70, 100].map((dx, i) => <path key={`r${i}`} d={`M${dx - 14} -96 h 28 M${dx - 12} -70 h 26 M${dx - 10} -44 h 22`} stroke={KM.rojo} strokeWidth={5} opacity={0.8} />)}
      <g transform={`translate(160 -250) rotate(${r1(Math.sin(f / 14) * 3)})`}>
        {Array.from({ length: 9 }, (_, i) => { const a = (-160 + i * 22) * Math.PI / 180; return <path key={i} d={`M${r1(Math.cos(a) * 40)} ${r1(Math.sin(a) * 40)} L ${r1(Math.cos(a - 0.12) * 96)} ${r1(Math.sin(a - 0.12) * 96)} L ${r1(Math.cos(a) * 112)} ${r1(Math.sin(a) * 112)} L ${r1(Math.cos(a + 0.12) * 96)} ${r1(Math.sin(a + 0.12) * 96)} Z`} fill={i % 2 ? KM.oro : KM.ocreClaro} stroke={NEGRO} strokeWidth={1.8} />; })}
        {Array.from({ length: 7 }, (_, i) => <path key={`b${i}`} d={`M${-10 + i * 10} ${30 + abre} q ${Math.sin(f / 9 + i) * 6} 60 ${-4 + i * 2} ${110 - Math.abs(i - 3) * 10}`} stroke={i % 2 ? KM.blanco : '#E8E0D0'} strokeWidth={9} strokeLinecap="round" fill="none" />)}
        <path d={`M-30 ${20 + abre} L 70 ${20 + abre} Q 70 ${46 + abre} 30 ${50 + abre} Q -20 ${48 + abre} -30 ${20 + abre} Z`} fill={KM.rojo} stroke={NEGRO} strokeWidth={2.2} />
        {[0, 16, 32, 48].map((dx) => <path key={dx} d={`M${dx - 6} ${20 + abre} l 6 -10 l 6 10 Z`} fill={KM.blanco} stroke={NEGRO} strokeWidth={1} />)}
        <path d="M-40 -30 C -40 -60, 30 -66, 66 -40 C 84 -24, 86 4, 74 22 L -34 22 C -44 6, -44 -16, -40 -30 Z" fill={KM.rojo} stroke={NEGRO} strokeWidth={2.6} />
        {[0, 16, 32, 48].map((dx) => <path key={`t${dx}`} d={`M${dx - 6} 20 l 6 10 l 6 -10 Z`} fill={KM.blanco} stroke={NEGRO} strokeWidth={1} />)}
        <path d="M58 -6 Q 84 -6 84 10 Q 70 18 58 10 Z" fill={KM.rojoOsc} stroke={NEGRO} strokeWidth={1.6} />
        {ojoSalton(10, -22, 13)}{ojoSalton(44, -26, 12)}
        <path d="M-6 -44 Q 10 -54 26 -42 M32 -46 Q 46 -56 60 -44" stroke={NEGRO} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M-36 -40 L -60 -70 L -26 -54 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={1.6} />
      </g>
    </g>
  );
};

/** Naga (Basuki, Anantaboga, Besukih): serpiente enorme con corona de llamas, barba y escamas doradas.
 * Origen = suelo bajo la cabeza, cola a la izquierda. props.joya = joya en la punta de la cola; props.sinCola. */
const Naga: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, boca, f, color = '#4E7A4A', largo = 620, erguida = 1, joya = false, sinCola = false, corona = true }) => {
  const L = largo as number, n = 16, g = 54, E = erguida as number;
  const corte = sinCola ? 2 : 0;
  const cuerpo: P[] = Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return [-L + t * L, -g / 2 - Math.sin(t * Math.PI * 2.4 + f * 0.1) * 24 * (1 - t * 0.6) - (t > 0.72 ? (t - 0.72) * 3.6 * 220 * E : 0)] as P; }).slice(corte);
  const anchos = cuerpo.map((_, i) => { const t = (i + corte) / (n - 1); return Math.max(12, g * Math.max(t > 0.5 ? 0.7 : 0, Math.sin(Math.PI * Math.min(1, t * 1.05 + 0.1)))); });
  const cab = cuerpo[cuerpo.length - 1];
  const cola = cuerpo[0];
  const abre = boca ? 16 + Math.abs(Math.sin(f / 4)) * 8 : 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={miembro(cuerpo, anchos)} fill={color as string} stroke={NEGRO} strokeWidth={2.8} />
      <path d={suave(cuerpo.slice(1, -1).map(([px, py], i) => [px, py + anchos[i + 1] * 0.28] as P))} stroke={KM.ocreClaro} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d={suave(cuerpo.slice(1, -1).map(([px, py], i) => [px, py - anchos[i + 1] * 0.12] as P))} stroke={KM.oro} strokeWidth={8} fill="none" strokeDasharray="7 9" />
      {cuerpo.slice(2, -2).map(([px, py], i) => i % 2 ? <path key={i} d={`M${r1(px - 8)} ${r1(py - anchos[i + 2] * 0.5)} l 8 -16 l 8 16`} fill={KM.rojo} stroke={NEGRO} strokeWidth={1.2} /> : null)}
      {!!joya && !sinCola && <g transform={`translate(${r1(cola[0] - 18)} ${r1(cola[1])})`}><circle r={30} fill={KM.ocreClaro} opacity={0.35 + Math.sin(f / 5) * 0.15} /><path d="M0 -14 L 12 0 L 0 14 L -12 0 Z" fill={KM.rojo} stroke={NEGRO} strokeWidth={1.8} /><path d="M-4 -4 L 0 -10 L 4 -4" stroke={KM.blanco} strokeWidth={1.6} fill="none" /></g>}
      {!!sinCola && <path d={`M${r1(cola[0])} ${r1(cola[1] - anchos[0] / 2)} l -6 ${r1(anchos[0] / 2)} l 6 ${r1(anchos[0] / 2)}`} stroke={KM.rojoOsc} strokeWidth={4} fill="none" />}
      <g transform={`translate(${r1(cab[0])} ${r1(cab[1])}) scale(1.35)`}>
        {!!corona && <g transform="translate(-6 -30)"><path d="M-30 6 L -26 -30 L -14 -14 L -4 -52 L 8 -16 L 20 -34 L 26 4 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={2} /><circle cx={-2} cy={-12} r={5} fill={KM.rojo} stroke={NEGRO} strokeWidth={1} /></g>}
        <path d={`M-30 -18 C -30 -42, 30 -46, 64 -24 L 92 -14 C 80 -4, 70 0, 56 ${-2 + abre * 0.2} L -24 ${10} Z`} fill={color as string} stroke={NEGRO} strokeWidth={2.4} />
        <path d={`M-24 10 L 56 ${2 + abre * 0.2} L 82 ${10 + abre} C 60 ${22 + abre}, 10 ${26 + abre * 0.6}, -26 20 Z`} fill={color as string} stroke={NEGRO} strokeWidth={2.2} />
        {boca && <path d={`M56 ${2 + abre * 0.2} L 88 ${4 + abre * 0.5} L 80 ${10 + abre}`} fill={KM.rojoOsc} />}
        {[20, 36, 52, 68].map((dx) => <path key={dx} d={`M${dx} ${-6 + dx * 0.05} l 4 10 l 4 -10`} fill={KM.blanco} stroke={NEGRO} strokeWidth={0.8} />)}
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-10 + i * 12} ${24 + abre * 0.5} q ${Math.sin(f / 10 + i) * 4} 30 ${-6 + i * 2} ${50 - i * 4}`} stroke={KM.blanco} strokeWidth={5} strokeLinecap="round" fill="none" />)}
        {ojoSalton(22, -22, 9)}
        <path d="M6 -34 Q 22 -44 38 -30" stroke={NEGRO} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d={`M88 -12 q 14 ${-6 + Math.sin(f / 3) * 4} 26 -2 M88 -12 q 14 ${6 + Math.sin(f / 3) * 4} 26 4`} stroke={KM.rojo} strokeWidth={2.5} fill="none" />
      </g>
    </g>
  );
};

/** Bedawang Nala: la tortuga del mundo, con caparazón de escudos, llamas en el lomo y dos naga enroscadas. */
const BedawangNala: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, naga = true, api = true }) => {
  const fase = moviendo ? f * 0.12 : f * 0.03, rema = Math.sin(fase) * 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={miembro([[-180, -60], [-250, -40 + rema], [-300, -20 + rema]], [50, 36, 20])} fill={KM.verde} stroke={NEGRO} strokeWidth={2.4} />
      <path d={miembro([[150, -60], [230, -40 - rema], [280, -10 - rema]], [52, 38, 22])} fill={KM.verde} stroke={NEGRO} strokeWidth={2.4} />
      {!!api && Array.from({ length: 7 }, (_, i) => { const px = -150 + i * 50, top = -250 - Math.sin((i / 6) * Math.PI) * 50; return <path key={i} d={`M${px - 16} ${top + 30} Q ${px + Math.sin(f / 4 + i) * 8} ${top - 40 - (i % 2) * 20} ${px + 16} ${top + 30} Z`} fill={i % 2 ? KM.ocreClaro : KM.rojo} stroke={NEGRO} strokeWidth={1.6} />; })}
      <path d="M-240 -40 C -240 -250, 230 -270, 240 -40 Z" fill="#5E7A5A" stroke={NEGRO} strokeWidth={3.4} />
      {[[-150, -90], [-60, -110], [40, -110], [140, -90], [-100, -180], [0, -200], [100, -180]].map(([cx, cy], i) => <g key={i}><path d={`M${cx - 40} ${cy} L ${cx - 20} ${cy - 34} L ${cx + 20} ${cy - 34} L ${cx + 40} ${cy} L ${cx + 20} ${cy + 30} L ${cx - 20} ${cy + 30} Z`} fill={i % 2 ? KM.verdeClaro : '#7E9A6E'} stroke={NEGRO} strokeWidth={2} /><Espiral x={cx} y={cy} r={10} c={KM.verde} w={2} /></g>)}
      <path d="M-250 -40 L 250 -40 L 240 -14 L -240 -14 Z" fill={KM.ocre} stroke={NEGRO} strokeWidth={2.4} />
      {!!naga && [0, 1].map((k) => <g key={k}><path d={`M-230 ${-30 - k * 30} C -120 ${-230 + k * 60}, 120 ${-60 - k * 60}, 230 ${-170 + k * 40}`} stroke={NEGRO} strokeWidth={30} fill="none" /><path d={`M-230 ${-30 - k * 30} C -120 ${-230 + k * 60}, 120 ${-60 - k * 60}, 230 ${-170 + k * 40}`} stroke={k ? '#3E6A7A' : '#7A6A2A'} strokeWidth={24} fill="none" /><path d={`M-230 ${-30 - k * 30} C -120 ${-230 + k * 60}, 120 ${-60 - k * 60}, 230 ${-170 + k * 40}`} stroke={KM.oro} strokeWidth={6} fill="none" strokeDasharray="6 10" /><g transform={`translate(236 ${-176 + k * 40})`}><path d="M-10 -14 C 10 -26, 34 -20, 44 -8 L 30 4 C 18 10, 0 10, -10 4 Z" fill={k ? '#3E6A7A' : '#7A6A2A'} stroke={NEGRO} strokeWidth={2} /><path d="M-6 -16 L -4 -34 L 6 -22 L 14 -38 L 18 -18 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={1.4} /><circle cx={16} cy={-8} r={3.4} fill={KM.blanco} stroke={NEGRO} strokeWidth={1} /></g></g>)}
      <g transform={`translate(250 -70) rotate(${r1(Math.sin(f / 30) * 4)})`}>
        <path d="M-20 -30 C 20 -60, 90 -50, 110 -20 C 116 0, 100 20, 70 22 L -20 30 Z" fill="#6E8A5E" stroke={NEGRO} strokeWidth={2.6} />
        {ojoSalton(60, -20, 10)}
        <path d="M84 6 L 112 2" stroke={NEGRO} strokeWidth={3} />
        <path d="M40 -46 Q 60 -56 80 -40" stroke={NEGRO} strokeWidth={4} fill="none" />
      </g>
    </g>
  );
};

/** Serpiente de mar a rayas blancas y negras (ular poleng), nadando. Origen = centro del cuerpo. */
const UlarPoleng: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f }) => {
  const pts: P[] = Array.from({ length: 9 }, (_, i) => [-90 + i * 22, Math.sin(i * 0.9 + f * 0.25) * 12] as P);
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={suave(pts)} stroke={NEGRO} strokeWidth={20} fill="none" strokeLinecap="round" />
      <path d={suave(pts)} stroke={KM.blanco} strokeWidth={15} fill="none" strokeLinecap="round" strokeDasharray="10 10" />
      <ellipse cx={pts[8][0] + 10} cy={pts[8][1]} rx={16} ry={10} fill={NEGRO} />
      <circle cx={pts[8][0] + 16} cy={pts[8][1] - 3} r={2.4} fill={KM.blanco} />
      <path d={`M${pts[0][0]} ${pts[0][1]} l -16 -6 l 4 12 Z`} fill={NEGRO} />
    </g>
  );
};

/** Leak en forma de bola de fuego que flota (necesita y). Origen = centro. */
const ApiLeak: React.FC<DibujoProps> = ({ x, y, s, opacity = 1, f, color = '#E25A2A' }) => {
  const fl = Math.sin(f / 6) * 6, n = (k: number) => Math.sin(f * 0.5 + k) * 6;
  return (
    <g transform={`translate(${x} ${y + fl}) scale(${s})`} opacity={opacity}>
      <circle r={60} fill={KM.ocreClaro} opacity={0.25 + Math.sin(f / 4) * 0.08} />
      <path d={`M-26 0 C -30 -30, ${-8 + n(1)} -50, ${4 + n(2)} -90 C 16 -50, 32 -30, 26 0 C 26 20, -26 20, -26 0 Z`} fill={color as string} stroke={NEGRO} strokeWidth={2} />
      <path d={`M-14 2 C -16 -16, ${-4 + n(3)} -30, ${4 + n(4)} -56 C 10 -30, 18 -16, 14 2 C 14 12, -14 12, -14 2 Z`} fill={KM.ocreClaro} />
      <circle cx={-5} cy={-2} r={2.6} fill={NEGRO} /><circle cx={6} cy={-2} r={2.6} fill={NEGRO} />
    </g>
  );
};

/** Cerdo negro balinés (celeng): lomo hundido, panza baja. */
const Celeng: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, corriendo, f, color = '#2E2A2C' }) => {
  const fase = moviendo || corriendo ? f * (corriendo ? 0.4 : 0.22) : 0, amp = moviendo || corriendo ? 22 : 0;
  const p = (dx: number, ph: number) => pata(fase, amp, [dx, -50], ph, 26, 24, [20, 14, 11]);
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {[[-60, Math.PI], [40, 0]].map(([dx, ph], i) => <path key={i} d={p(dx, ph)} fill={color as string} stroke={NEGRO} strokeWidth={1.6} />)}
      <path d="M-90 -70 C -90 -110, -40 -112, -10 -96 C 20 -110, 70 -110, 86 -80 C 96 -50, 60 -26, 0 -24 C -60 -26, -92 -40, -90 -70 Z" fill={color as string} stroke={NEGRO} strokeWidth={2.2} />
      <path d="M-90 -76 q -18 -6 -14 -22 q 6 10 14 6" stroke={NEGRO} strokeWidth={3} fill="none" />
      {[[-40, 0.5], [60, Math.PI + 0.5]].map(([dx, ph], i) => <path key={`b${i}`} d={p(dx, ph)} fill={color as string} stroke={NEGRO} strokeWidth={1.6} />)}
      <g transform="translate(90 -76)">
        <path d="M-14 -20 C 10 -30, 34 -20, 46 -4 L 46 12 C 30 18, 0 16, -14 8 Z" fill={color as string} stroke={NEGRO} strokeWidth={2} />
        <ellipse cx={46} cy={4} rx={6} ry={9} fill="#6A5A5A" stroke={NEGRO} strokeWidth={1.4} />
        <path d="M0 -22 L 8 -42 L 18 -22 Z" fill={color as string} stroke={NEGRO} strokeWidth={1.6} />
        <circle cx={22} cy={-8} r={3.6} fill={KM.ocreClaro} /><circle cx={23} cy={-8} r={1.6} fill={NEGRO} />
      </g>
    </g>
  );
};

/** Mono de cola larga (bojog), el de los templos de Bali. */
const Bojog: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, corriendo, f, color = '#8A7A66' }) => {
  const fase = moviendo || corriendo ? f * 0.3 : 0, sw = Math.sin(fase) * (moviendo || corriendo ? 20 : 0);
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-40 -50 C -90 -40, -110 -90, -90 ${-130 + Math.sin(f / 10) * 8}`} stroke={NEGRO} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={`M-40 -50 C -90 -40, -110 -90, -90 ${-130 + Math.sin(f / 10) * 8}`} stroke={color as string} strokeWidth={5.5} fill="none" strokeLinecap="round" />
      <path d={miembro([[-24, -48], [-34 - sw * 0.3, -24], [-20, 0]], [18, 13, 10])} fill={color as string} stroke={NEGRO} strokeWidth={1.8} />
      <path d={suave([[-50, -50], [-30, -96], [20, -100], [40, -70], [20, -44], [-30, -40]], true)} fill={color as string} stroke={NEGRO} strokeWidth={2.2} />
      <path d={miembro([[14, -48], [24 + sw * 0.3, -24], [14, 0]], [18, 13, 10])} fill={color as string} stroke={NEGRO} strokeWidth={1.8} />
      <path d={miembro([[20, -90], [46 + sw * 0.4, -66], [54, -40]], [14, 10, 9])} fill={color as string} stroke={NEGRO} strokeWidth={1.8} />
      <g transform="translate(34 -112)">
        <circle r={24} fill={color as string} stroke={NEGRO} strokeWidth={2.2} />
        <path d="M2 -12 C 26 -14, 34 2, 24 14 C 14 20, 2 14, 2 -12 Z" fill="#D8B898" stroke={NEGRO} strokeWidth={1.4} />
        <circle cx={14} cy={-4} r={3.6} fill={KM.blanco} stroke={NEGRO} strokeWidth={1} /><circle cx={15} cy={-4} r={1.8} fill={NEGRO} />
        <path d="M-14 -22 L -6 -32 L 2 -22" fill={color as string} stroke={NEGRO} strokeWidth={1.4} />
      </g>
    </g>
  );
};

/** Gallo/ave grande (manuk): cresta roja, cola de plumas índigo y verdes. */
const Manuk: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#A8452A' }) => {
  const paso = moviendo ? Math.sin(f * 0.3) * 14 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M-30 -90 C ${-80 - i * 8} ${-150 - i * 10}, ${-120 - i * 6} ${-120 + i * 12}, ${-104 - i * 4} ${-60 + i * 10 + Math.sin(f / 10 + i) * 4}`} stroke={NEGRO} strokeWidth={14} fill="none" strokeLinecap="round" />)}
      {[0, 1, 2, 3, 4].map((i) => <path key={`c${i}`} d={`M-30 -90 C ${-80 - i * 8} ${-150 - i * 10}, ${-120 - i * 6} ${-120 + i * 12}, ${-104 - i * 4} ${-60 + i * 10 + Math.sin(f / 10 + i) * 4}`} stroke={[KM.indigo, KM.verde, NEGRO, KM.indigo, KM.verdeClaro][i]} strokeWidth={9} fill="none" strokeLinecap="round" />)}
      <path d={`M-4 -50 L ${-10 + paso} 0 M14 -50 L ${20 - paso} 0`} stroke={KM.oro} strokeWidth={6} />
      <path d="M-50 -90 C -40 -130, 20 -134, 40 -110 C 54 -90, 40 -50, 0 -46 C -30 -46, -54 -62, -50 -90 Z" fill={color as string} stroke={NEGRO} strokeWidth={2.4} />
      <path d="M-30 -96 C -10 -80, 10 -80, 24 -96" stroke={KM.oro} strokeWidth={4} fill="none" />
      <g transform="translate(40 -130)">
        <path d="M-16 20 C -20 -6, -4 -24, 14 -20 C 26 -16, 28 0, 24 14 Z" fill={KM.ocre} stroke={NEGRO} strokeWidth={2} />
        <path d="M-4 -22 L -2 -36 L 6 -26 L 12 -38 L 16 -22 Z" fill={KM.rojo} stroke={NEGRO} strokeWidth={1.4} />
        <path d="M24 -6 L 38 0 L 24 4 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={1.2} />
        <path d="M20 6 q 4 14 -4 16 q -4 -8 0 -14" fill={KM.rojo} stroke={NEGRO} strokeWidth={1} />
        <circle cx={12} cy={-8} r={3.4} fill={KM.blanco} stroke={NEGRO} strokeWidth={1} /><circle cx={13} cy={-8} r={1.6} fill={NEGRO} />
      </g>
    </g>
  );
};

/** Piedra con ojos (la última forma de Mayadenawa). props.ojos = false: piedra sola. */
const BatuSakti: React.FC<DibujoProps> = ({ x, y, s, opacity = 1, f, ojos = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <Karang x={-90} y={0} w={180} h={100} c="#8E8272" c2="#4A4038" />
    <Karang x={-50} y={-90} w={100} h={50} c="#9A8E7E" c2="#4A4038" />
    {!!ojos && [-22, 22].map((dx) => <g key={dx}><circle cx={dx} cy={-52} r={9} fill={KM.ocreClaro} opacity={0.6 + Math.sin(f / 5) * 0.3} /><circle cx={dx + 2} cy={-52} r={3.6} fill={NEGRO} /></g>)}
  </g>
);

/** Barong Landung: muñeco gigante de tela con máscara. cara "gede" = negra con dientes grandes; "luh" = blanca. */
const BarongLandung: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, cara = 'gede' }) => {
  const gede = cara === 'gede', bal = moviendo ? Math.sin(f * 0.2) * 4 : Math.sin(f / 20) * 1.5;
  const tela = gede ? '#2C2830' : KM.blanco, borde = gede ? KM.oro : KM.rojo;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s}) rotate(${r1(bal)} 0 0)`} opacity={opacity}>
      <path d="M-70 0 L -60 -360 Q 0 -400 60 -360 L 70 0 Z" fill={tela} stroke={NEGRO} strokeWidth={3} />
      {gede ? <path d="M-64 -150 L 66 -150 L 70 0 L -70 0 Z" fill={KM.blanco} stroke={NEGRO} strokeWidth={2} /> : <path d="M-64 -150 L 66 -150 L 70 0 L -70 0 Z" fill={KM.rojo} stroke={NEGRO} strokeWidth={2} />}
      {gede && Array.from({ length: 6 }, (_, i) => Array.from({ length: 6 }, (_, j) => (i + j) % 2 ? <rect key={`${i}-${j}`} x={-66 + i * 22} y={-148 + j * 24.6} width={22} height={24.6} fill={NEGRO} opacity={0.9} /> : null))}
      <path d="M-62 -160 H 64" stroke={borde} strokeWidth={10} />
      {[-1, 1].map((k) => <path key={k} d={`M${k * 58} -350 Q ${k * (90 + Math.sin(f / 9 + k) * 8)} -250 ${k * 80} ${-160 + Math.sin(f / 8 + k) * 6}`} stroke={tela} strokeWidth={26} fill="none" strokeLinecap="round" />)}
      {[-1, 1].map((k) => <path key={`c${k}`} d={`M${k * 58} -350 Q ${k * (90 + Math.sin(f / 9 + k) * 8)} -250 ${k * 80} ${-160 + Math.sin(f / 8 + k) * 6}`} stroke={NEGRO} strokeWidth={2} fill="none" />)}
      <path d="M-40 -370 Q 0 -340 40 -370" stroke={KM.oro} strokeWidth={10} fill="none" />
      <g transform="translate(0 -430)">
        {gede ? <path d="M-50 -30 L -44 -84 L -26 -60 L -10 -100 L 6 -62 L 26 -90 L 36 -50 L 52 -30 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={2} /> : <><ellipse cx={0} cy={-60} rx={44} ry={26} fill={NEGRO} /><path d="M-40 -66 L 30 -50" stroke={KM.oro} strokeWidth={3} />{[-24, 0, 22].map((dx) => <circle key={dx} cx={dx} cy={-80} r={6} fill={KM.blanco} stroke={NEGRO} strokeWidth={0.8} />)}</>}
        <ellipse rx={48} ry={58} fill={gede ? '#1E1A1E' : '#F6EEDE'} stroke={NEGRO} strokeWidth={2.6} />
        {gede ? <>
          {ojoSalton(-18, -12, 11)}{ojoSalton(20, -12, 11)}
          <path d="M-30 18 Q 0 46 30 18 Z" fill={KM.rojoOsc} stroke={NEGRO} strokeWidth={1.6} />
          {[-20, -8, 4, 16].map((dx) => <rect key={dx} x={dx} y={20} width={10} height={14} fill={KM.blanco} stroke={NEGRO} strokeWidth={1} />)}
          <path d="M-36 -32 Q -18 -42 -4 -30 M4 -30 Q 20 -42 36 -32" stroke={KM.blanco} strokeWidth={4} fill="none" />
        </> : <>
          <path d="M-28 -10 Q -18 -16 -8 -10 M8 -10 Q 18 -16 28 -10" stroke={NEGRO} strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M-14 22 Q 0 30 14 22" stroke={KM.rojo} strokeWidth={4} fill="none" strokeLinecap="round" />
          <circle cx={-26} cy={10} r={7} fill={KM.rosa} opacity={0.6} /><circle cx={26} cy={10} r={7} fill={KM.rosa} opacity={0.6} />
        </>}
        <path d="M0 -4 L 4 10 L -2 12" stroke={gede ? KM.blanco : NEGRO} strokeWidth={2} fill="none" />
      </g>
    </g>
  );
};

/** Ogoh-ogoh: demonio gigante de bambú y papel sobre su parihuela (la noche antes de Nyepi). Origen = pie de la parihuela. */
const OgohOgoh: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#B23A26' }) => {
  const bote = moviendo ? -Math.abs(Math.sin(f * 0.25)) * 10 : 0, bal = moviendo ? Math.sin(f * 0.12) * 4 : Math.sin(f / 24) * 1;
  return (
    <g transform={`translate(${x} ${y + bote}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}><g transform="translate(0 110)">
      {[-260, -130, 0, 130, 260].map((dx) => <path key={dx} d={`M${dx} -150 L ${dx} -130`} stroke={KM.ocre} strokeWidth={8} />)}
      <path d="M-300 -150 H 300 M-300 -130 H 300" stroke={NEGRO} strokeWidth={12} />
      <path d="M-300 -150 H 300 M-300 -130 H 300" stroke={KM.ocreClaro} strokeWidth={8} />
      <rect x={-120} y={-176} width={240} height={30} fill={KM.ocre} stroke={NEGRO} strokeWidth={2} />
      <g transform={`rotate(${r1(bal)} 0 -176)`}>
        {[-1, 1].map((k) => <path key={k} d={miembro([[k * 40, -330], [k * 90, -260], [k * 70, -176]], [56, 46, 40])} fill={color as string} stroke={NEGRO} strokeWidth={2.4} />)}
        <path d={suave([[-90, -560], [0, -590], [90, -560], [110, -420], [80, -320], [-80, -320], [-110, -420]], true)} fill={color as string} stroke={NEGRO} strokeWidth={3} />
        <ellipse cx={0} cy={-400} rx={70} ry={60} fill="#C85A3A" stroke={NEGRO} strokeWidth={2} />
        {[-1, 1].map((k) => <g key={`b${k}`}><path d={miembro([[k * 80, -540], [k * 170, -600 + Math.sin(f / 10) * 10], [k * 200, -700 + Math.sin(f / 8) * 10]], [40, 32, 26])} fill={color as string} stroke={NEGRO} strokeWidth={2.4} />{[-12, 0, 12].map((d, j) => <path key={j} d={`M${k * 200 + d} ${-700 + Math.sin(f / 8) * 10} q ${k * 8} -30 ${k * 24} -40`} stroke={NEGRO} strokeWidth={5} fill="none" strokeLinecap="round" />)}</g>)}
        <g transform="translate(0 -650)">
          {Array.from({ length: 11 }, (_, i) => { const a = (-170 + i * 16) * Math.PI / 180; return <path key={i} d={`M${r1(Math.cos(a) * 60)} ${r1(Math.sin(a) * 60)} L ${r1(Math.cos(a) * (130 + Math.sin(f / 8 + i) * 8))} ${r1(Math.sin(a) * (130 + Math.sin(f / 8 + i) * 8))}`} stroke={NEGRO} strokeWidth={22} strokeLinecap="round" />; })}
          <circle r={74} fill={color as string} stroke={NEGRO} strokeWidth={3} />
          {ojoSalton(-28, -14, 18)}{ojoSalton(28, -14, 18)}
          <path d="M-40 -40 Q -20 -56 -6 -36 M6 -36 Q 20 -56 40 -40" stroke={NEGRO} strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d="M-44 26 Q 0 70 44 26 Z" fill={KM.rojoOsc} stroke={NEGRO} strokeWidth={2} />
          {[-32, 32].map((dx) => <path key={dx} d={`M${dx} 28 C ${dx * 1.3} 4, ${dx * 1.5} -10, ${dx * 1.7} -18 C ${dx * 1.4} -2, ${dx * 1.2} 14, ${dx * 0.8} 32 Z`} fill={KM.blanco} stroke={NEGRO} strokeWidth={1.4} />)}
          <path d={`M-12 40 C -14 90, ${-4 + Math.sin(f / 8) * 8} 120, ${4 + Math.sin(f / 8) * 10} 150 C 18 110, 16 80, 12 40 Z`} fill={KM.rojo} stroke={NEGRO} strokeWidth={2} />
        </g>
      </g>
    </g></g>
  );
};

/** Calabaza gigante (labu) en la que Nirartha cruzó el estrecho. Origen = línea del agua. */
const Labu: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 12) * 5}) scale(${voltear ? -s : s} ${s}) rotate(${r1(Math.sin(f / 16) * 3)})`} opacity={opacity}>
    <path d="M-140 -10 C -150 -80, -60 -96, -20 -60 C 10 -40, 60 -60, 110 -60 C 160 -56, 170 -10, 140 10 C 80 40, -100 40, -140 -10 Z" fill={KM.ocreClaro} stroke={NEGRO} strokeWidth={3} />
    <path d="M-110 -20 C -60 -10, 40 -16, 130 -20" stroke={KM.ocre} strokeWidth={3} fill="none" />
    <path d="M-120 -56 C -100 -70, -70 -70, -50 -56" stroke={KM.blanco} strokeWidth={4} fill="none" opacity={0.7} />
    <path d="M140 -40 q 20 -10 30 -30" stroke={KM.verde} strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);

// ---------- fichas ----------
type PP = Partial<PersonajeProps>;
const H = (p: PP, nombre?: string): Ficha => ({ tipo: 'persona', p: { barba: false, tocado: null, collar: false, ...p }, griego: nombre });
const M = (p: PP, nombre?: string): Ficha => ({ tipo: 'persona', p: { mujer: true, tocado: null, collar: false, ...p }, griego: nombre });
const D = (Dibujo: React.FC<DibujoProps>, p: Record<string, unknown> = {}, nombre?: string): Ficha => ({ tipo: 'dibujo', Dibujo, p, griego: nombre });

const PIEL_H = '#C8955E', PIEL_M = '#E2BB86', PIEL_DIOS = '#F1E3C2', PIEL_REY = '#E8C98E';
const dios = (c: string, alto = 1) => <><Gelungan alto={alto} /><Sumping /></>;
const diosa = <><Rodete flores={false} /><Gelungan alto={0.7} nuca={false} /><Sumping /><Flor x={-30} y={-28} /></>;
const rey = <><Gelungan alto={0.8} /><Sumping /></>;
const sacerdote = (canas = true) => <MonoSacerdote canas={canas} />;
const hombre = (c = KM.blanco) => <><Udeng c={c} /><Flor x={-22} y={-10} r={4} /></>;

export const ELENCO_BALINES: Record<string, Ficha> = {
  // Dioses
  bhatara_pasupati: H({ piel: PIEL_DIOS, ropa: 'larga', ropaColor: KM.rojo, capa: KM.ocre, adornos: { cabeza: dios(KM.oro, 1.15), cuerpo: <><Badong /><Faja c={KM.oro} c2={KM.rojo} /></>, detras: <KrisEspalda /> } }, 'PASUPATI'),
  bhatara_putrajaya: H({ piel: PIEL_DIOS, ropa: 'larga', ropaColor: KM.indigo, capa: KM.rojo, adornos: { cabeza: dios(KM.oro), cuerpo: <><Badong /><Faja /></> } }, 'PUTRAJAYA'),
  bhatara_genijaya: H({ piel: PIEL_DIOS, ropa: 'larga', ropaColor: KM.rojo, capa: KM.ocreClaro, adornos: { cabeza: dios(KM.oro, 0.9), cuerpo: <><Badong /><Faja c={KM.indigo} /></> } }, 'GENIJAYA'),
  bhatara_indra: H({ piel: PIEL_DIOS, ropa: 'corta', ropaColor: KM.indigo, capa: KM.rojo, objeto: 'arco', adornos: { cabeza: dios(KM.oro, 1.1), cuerpo: <><Badong /><Faja c={KM.oro} c2={KM.rojo} /></>, detras: <KrisEspalda /> } }, 'INDRA'),
  dewi_danu: M({ piel: '#F4E6CC', ropa: 'larga', ropaColor: '#5A7AAE', capa: KM.azulClaro, adornos: { cabeza: diosa, cuerpo: <><Badong /><Selendang c={KM.oro} /></> } }, 'DEWI DANU'),
  bhatari_durga: M({ piel: '#5A3A4E', ropa: 'larga', ropaColor: NEGRO, capa: KM.rojo, contorno: true, adornos: { cabeza: <><CaraRaksasa pelo={NEGRO} colmillos={0.7} /><Gelungan alto={0.8} /></>, cuerpo: <Badong /> } }, 'DURGA'),
  dewa_bali: H({ piel: PIEL_DIOS, ropa: 'larga', ropaColor: KM.rojo, adornos: { cabeza: dios(KM.oro), cuerpo: <Badong /> } }, 'GOD'),
  dewi_bali: M({ piel: '#F4E6CC', ropa: 'larga', ropaColor: KM.rojo, adornos: { cabeza: diosa, cuerpo: <><Badong /><Selendang /></> } }, 'GODDESS'),
  // Demonios y reyes demonio
  mayadenawa: H({ piel: KM.rojo, s: 1.08, ropa: 'corta', ropaColor: NEGRO, capa: KM.oro, objeto: 'espada', adornos: { cabeza: <><CaraRaksasa /><Gelungan alto={0.9} /></>, cuerpo: <><Badong /><Faja c={KM.indigo} c2={KM.oro} /></> } }, 'MAYADENAWA'),
  raksasa_bali: H({ piel: '#3E3436', ropa: 'corta', ropaColor: KM.rojo, objeto: 'lanza', adornos: { cabeza: <CaraRaksasa pelo="#5A3A2A" />, cuerpo: <Poleng /> } }),
  ratu_gede_mecaling: H({ piel: '#5A4650', gigante: true, s: 1.22, ropa: 'corta', ropaColor: NEGRO, contorno: true, adornos: { cabeza: <><CaraRaksasa pelo={NEGRO} colmillos={1.4} /><Gelungan alto={0.85} c={KM.oro} /></>, cuerpo: <><Badong /><Poleng /></> } }, 'RATU GEDE MECALING'),
  // Gente de la corte
  sri_jaya_pangus: H({ piel: PIEL_REY, ropa: 'larga', ropaColor: KM.rojo, capa: KM.oro, adornos: { cabeza: rey, cuerpo: <><Badong /><Faja c={KM.indigo} /></>, detras: <KrisEspalda /> } }, 'SRI JAYA PANGUS'),
  kang_cing_wie: M({ piel: '#F6EADA', ropa: 'larga', ropaColor: KM.rojo, capa: KM.oro, adornos: { cabeza: <MonoChino />, cuerpo: <Selendang c={KM.oro} /> } }, 'KANG CING WIE'),
  prabu_airlangga: H({ piel: PIEL_REY, ropa: 'larga', ropaColor: KM.indigo, capa: KM.oro, objeto: 'cetro', adornos: { cabeza: rey, cuerpo: <><Badong /><Faja /></>, detras: <KrisEspalda /> } }, 'KING AIRLANGGA'),
  raja_bedahulu: H({ piel: PIEL_REY, ropa: 'larga', ropaColor: KM.rojo, capa: KM.indigo, adornos: { cabeza: rey, cuerpo: <><Badong /><Faja c={KM.oro} /></>, detras: <KrisEspalda /> } }, 'KING OF BEDAHULU'),
  raja_bedahulu_babi: H({ piel: PIEL_REY, ropa: 'larga', ropaColor: KM.rojo, capa: KM.indigo, adornos: { cabeza: <><CabezaCerdo /><g transform="translate(4 -10) scale(0.9)"><Gelungan alto={0.7} nuca={false} /></g></>, cuerpo: <><Badong /><Faja c={KM.oro} /></>, detras: <KrisEspalda /> } }, 'KING OF BEDAHULU'),
  raja_bali: H({ piel: PIEL_REY, ropa: 'larga', ropaColor: KM.rojo, capa: KM.oro, adornos: { cabeza: rey, cuerpo: <><Badong /><Faja /></>, detras: <KrisEspalda /> } }),
  ratu_bali: M({ piel: '#F0D6A8', ropa: 'larga', ropaColor: KM.indigo, capa: KM.oro, adornos: { cabeza: <><Rodete /><Gelungan alto={0.55} nuca={false} /></>, cuerpo: <><Badong /><Selendang /></> } }),
  gajah_mada: H({ piel: '#B8844E', ropa: 'corta', ropaColor: KM.indigo, capa: KM.rojo, objeto: 'lanza', adornos: { cabeza: <GorroMajapahit />, cuerpo: <><Badong c={KM.ocreClaro} /><Faja c={KM.rojo} /></>, detras: <KrisEspalda /> } }, 'GAJAH MADA'),
  // Sacerdotes y sabios
  mpu_kulputih: H({ piel: PIEL_H, canas: true, barba: true, ropa: 'larga', ropaColor: KM.blanco, capa: KM.crema2, adornos: { cabeza: sacerdote(), mano: <GentaMano /> } }, 'MPU KULPUTIH'),
  sidhi_mantra: H({ piel: PIEL_H, canas: true, barba: true, ropa: 'larga', ropaColor: KM.blanco, capa: KM.ocreClaro, adornos: { cabeza: sacerdote(), mano: <GentaMano /> } }, 'SIDHI MANTRA'),
  mpu_bharadah: H({ piel: PIEL_H, canas: true, barba: true, ropa: 'larga', ropaColor: KM.blanco, capa: KM.rojo, adornos: { cabeza: sacerdote(), mano: <GentaMano /> } }, 'MPU BHARADAH'),
  mpu_bharadah_libro: H({ piel: PIEL_H, canas: true, barba: true, ropa: 'larga', ropaColor: KM.blanco, capa: KM.rojo, adornos: { cabeza: sacerdote(), mano: <LontarMano /> } }, 'MPU BHARADAH'),
  mpu_bahula: H({ piel: PIEL_H, ropa: 'larga', ropaColor: KM.blanco, capa: KM.ocre, adornos: { cabeza: sacerdote(false) } }, 'MPU BAHULA'),
  mpu_bahula_libro: H({ piel: PIEL_H, ropa: 'larga', ropaColor: KM.blanco, capa: KM.ocre, adornos: { cabeza: sacerdote(false), mano: <LontarMano /> } }, 'MPU BAHULA'),
  nirartha: H({ piel: PIEL_H, canas: true, barba: true, ropa: 'larga', ropaColor: KM.blanco, capa: KM.oro, adornos: { cabeza: sacerdote(), mano: <GentaMano /> } }, 'NIRARTHA'),
  pemangku: H({ piel: PIEL_H, ropa: 'larga', ropaColor: KM.blanco, adornos: { cabeza: <Udeng c={KM.blanco} c2={KM.crema2} />, mano: <GentaMano /> } }, 'TEMPLE PRIEST'),
  // Calon Arang
  calon_arang: M({ piel: '#D8B080', cuerpo: 'viejo', canas: true, ropa: 'larga', ropaColor: NEGRO, capa: KM.rojo, adornos: { detras: <PeloSuelto />, cabeza: <path d="M-32 6 C -36 -30, 0 -44, 24 -30 C 8 -30, -10 -24, -20 -12 C -24 -2, -26 8, -32 6 Z" fill="#E8E2D4" />, cuerpo: <Selendang c={KM.rojo} />, mano: <PanoMano /> } }, 'CALON ARANG'),
  calon_arang_libro: M({ piel: '#D8B080', cuerpo: 'viejo', canas: true, ropa: 'larga', ropaColor: NEGRO, capa: KM.rojo, adornos: { detras: <PeloSuelto />, cabeza: <path d="M-32 6 C -36 -30, 0 -44, 24 -30 C 8 -30, -10 -24, -20 -12 C -24 -2, -26 8, -32 6 Z" fill="#E8E2D4" />, cuerpo: <Selendang c={KM.rojo} />, mano: <LontarMano /> } }, 'CALON ARANG'),
  ratna_manggali: M({ piel: PIEL_M, ropa: 'larga', ropaColor: KM.rojo, adornos: { cabeza: <Rodete />, cuerpo: <Selendang c={KM.oro} /> } }, 'RATNA MANGGALI'),
  murid_leak: M({ piel: '#D8B080', ropa: 'larga', ropaColor: KM.blanco, adornos: { detras: <PeloSuelto c={NEGRO} />, cabeza: <path d="M-32 6 C -36 -30, 0 -44, 24 -30 C 8 -30, -10 -24, -20 -12 C -24 -2, -26 8, -32 6 Z" fill={NEGRO} />, cuerpo: <Selendang c={KM.rojoOsc} /> } }),
  // Héroes y gente de la isla
  manik_angkeran_genta: H({ piel: PIEL_H, ropa: 'corta', ropaColor: KM.rojo, adornos: { cabeza: hombre(KM.ocreClaro), cuerpo: <Faja c={KM.oro} c2={KM.rojo} />, mano: <GentaMano /> } }, 'MANIK ANGKERAN'),
  manik_angkeran_joya: H({ piel: PIEL_H, ropa: 'corta', ropaColor: KM.rojo, adornos: { cabeza: hombre(KM.ocreClaro), cuerpo: <Faja c={KM.oro} c2={KM.rojo} />, mano: <JoyaMano /> } }, 'MANIK ANGKERAN'),
  manik_angkeran: H({ piel: PIEL_H, ropa: 'corta', ropaColor: KM.rojo, adornos: { cabeza: hombre(KM.ocreClaro), cuerpo: <Faja c={KM.oro} c2={KM.rojo} /> } }, 'MANIK ANGKERAN'),
  kebo_iwa: H({ piel: '#A87048', gigante: true, s: 1.3, ropa: 'corta', ropaColor: KM.indigo, adornos: { cabeza: <Udeng c={KM.rojo} c2={KM.oro} />, cuerpo: <Faja c={KM.rojo} c2={KM.oro} /> } }, 'KEBO IWA'),
  bendesa_beraban: H({ piel: PIEL_H, ropa: 'larga', ropaColor: KM.ocre, capa: KM.rojoOsc, adornos: { cabeza: <Udeng c={KM.rojo} c2={KM.oro} />, detras: <KrisEspalda /> } }, 'CHIEF OF BERABAN'),
  prajurit_bali: H({ piel: PIEL_H, ropa: 'corta', ropaColor: KM.rojo, objeto: 'lanza', adornos: { cabeza: <Udeng c={KM.rojo} />, cuerpo: <Poleng />, detras: <KrisEspalda /> } }),
  prajurit_jawa: H({ piel: '#B8844E', ropa: 'corta', ropaColor: KM.indigo, objeto: 'lanza', adornos: { cabeza: <GorroMajapahit />, cuerpo: <Faja c={KM.rojo} /> } }),
  prajurit_dewa: H({ piel: PIEL_DIOS, ropa: 'corta', ropaColor: KM.indigo, objeto: 'lanza', adornos: { cabeza: <Gelungan alto={0.6} nuca={false} />, cuerpo: <Faja c={KM.oro} /> } }),
  penari_kris: H({ piel: PIEL_H, ropa: 'corta', ropaColor: KM.blanco, adornos: { cabeza: <Udeng c={KM.blanco} />, cuerpo: <Poleng />, mano: <KrisMano /> } }),
  pecalang: H({ piel: PIEL_H, ropa: 'corta', ropaColor: NEGRO, adornos: { cabeza: <Udeng c={NEGRO} c2={KM.oro} />, cuerpo: <Poleng largo />, detras: <KrisEspalda /> } }, 'PECALANG'),
  pria_bali: H({ piel: PIEL_H, ropa: 'corta', ropaColor: KM.ocre, adornos: { cabeza: hombre(), cuerpo: <Faja c={KM.blanco} c2={KM.ocre} /> } }),
  wanita_bali: M({ piel: PIEL_M, ropa: 'larga', ropaColor: KM.blanco, adornos: { cabeza: <Rodete />, cuerpo: <Selendang c={KM.ocre} />, mano: <CanangMano /> } }),
  kakek_bali: H({ piel: PIEL_H, cuerpo: 'viejo', canas: true, ropa: 'corta', ropaColor: KM.indigo, adornos: { cabeza: <Udeng c={KM.blanco} /> } }),
  nenek_bali: M({ piel: PIEL_M, cuerpo: 'viejo', canas: true, ropa: 'larga', ropaColor: KM.tierra, adornos: { cabeza: <Rodete flores={false} c="#E8E2D4" />, cuerpo: <Selendang c={KM.rojo} /> } }),
  anak_bali: H({ piel: PIEL_H, cuerpo: 'nino', ropa: 'corta', ropaColor: KM.rojo, adornos: { cabeza: <Flor x={-20} y={-16} r={5} /> } }),
  // Criaturas
  rangda: D(Rangda, {}, 'RANGDA'),
  barong: D(Barong, {}, 'BARONG'),
  naga_basuki: D(Naga, { color: '#4E7A4A' }, 'NAGA BASUKI'),
  naga_besukih: D(Naga, { color: '#4E7A4A' }, 'NAGA BESUKIH'),
  naga_besukih_herida: D(Naga, { color: '#4E7A4A', sinCola: true }, 'NAGA BESUKIH'),
  naga_anantaboga: D(Naga, { color: '#7A5A2A' }, 'NAGA ANANTABOGA'),
  bedawang_nala: D(BedawangNala, {}, 'BEDAWANG NALA'),
  ular_poleng: D(UlarPoleng, {}),
  api_leak: D(ApiLeak, {}),
  celeng: D(Celeng, {}),
  bojog: D(Bojog, {}),
  manuk: D(Manuk, {}),
  batu_sakti: D(BatuSakti, {}),
  jero_gede: D(BarongLandung, { cara: 'gede' }, 'JERO GEDE'),
  jero_luh: D(BarongLandung, { cara: 'luh' }, 'JERO LUH'),
  ogoh_ogoh: D(OgohOgoh, {}),
  labu: D(Labu, {}),
};

/** Nombres en pantalla (inglés) cuando difieren de la ficha. */
export const NOMBRE_EN_BALINES: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_BALINES).filter(([, f]) => f.griego).map(([k, f]) => [k, f.griego as string]));
