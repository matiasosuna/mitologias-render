// Diseños OFICIALES balineses (2026-10-15), para los Shorts "Who is…?" y los episodios nuevos (tema kamasan).
// Misma línea que la versión "A" nórdica aprobada: piel de color, ropa en capas simple e identidad en silueta, pelo y
// 2–3 atributos que se reconocen (iconografía de templo y de danza, digna, nunca cómica):
//   Barong = protector con forma de león: máscara roja, corona de oro, barba blanca, flecos dorados y espejitos ·
//   Rangda = reina bruja, máscara de ojos saltones, colmillos, lengua de fuego, melena blanca y uñas largas ·
//   Calon Arang = viuda anciana de pelo blanco suelto, paño mágico blanco · Dewi Sri = diosa del arroz, gavilla dorada,
//   verde y oro · Dewi Danu = diosa del lago, azul, loto blanco y cántaro de agua · Mayadenawa = rey demonio rojo
//   con corona y kris · Kebo Iwa = gigante con udeng y bigote · Ratu Gede Mecaling = señor oscuro de Nusa Penida,
//   colmillos enormes y tela poleng. (Sang Hyang Widhi no se dibuja: es anicónico.)
// Las entradas viejas de elencoBalines.tsx quedan intactas.
import React, { useId } from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, miembro, type P, type PersonajeProps } from '../comun/vasija';
import { KM } from '../comun/kamasan';
import { Gelungan, Sumping, Flor, Udeng, Rodete, Badong, Faja, Poleng, Selendang, KrisEspalda, KrisMano, PanoMano, ojoSalton, pata, MonoSacerdote, MonoChino, GorroMajapahit, CabezaCerdo, LontarMano, GentaMano, JoyaMano, CanangMano, Naga, BedawangNala, BarongLandung, UlarPoleng, Celeng, Bojog, Manuk } from './elencoBalines';
import type { Ficha } from './elenco';
import type { DibujoProps } from './elencoAzteca';

const N = KM.negro;
const r1 = (v: number) => v.toFixed(1);

// ---------- cabeza (cara de perfil a la derecha, ojo en 18,-6) ----------
/** Cara de raksasa de máscara balinesa sobre la cara del muñeco: ojo saltón con aro rojo, ceja gruesa con rulo,
 * bigote enrulado y colmillos que suben desde la comisura (`colmillo` = tamaño). */
const CaraRaksasa: React.FC<{ colmillo?: number; bigote?: string }> = ({ colmillo = 1, bigote = N }) => (
  <g>
    <circle cx={18} cy={-6} r={10} fill={KM.blanco} stroke={KM.rojo} strokeWidth={3} />
    <circle cx={20} cy={-6} r={4.4} fill={N} /><circle cx={21.4} cy={-7.6} r={1.2} fill={KM.blanco} />
    <path d="M2 -20 Q 18 -32 34 -20 Q 30 -26 22 -26" stroke={N} strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M22 14 C 30 10, 40 12, 44 20 C 46 26, 40 28, 38 24 C 34 20, 28 18, 22 19 Z" fill={bigote} stroke={N} strokeWidth={1} />
    <path d="M12 22 C 20 20, 28 20, 33 22 C 30 30, 18 32, 12 28 Z" fill={KM.rojoOsc} stroke={N} strokeWidth={1.2} />
    {/* colmillos de arriba que bajan por el mentón (los caling) y uno chico que sube */}
    <g transform={`translate(28 21) scale(${colmillo})`}><path d="M-3 0 L 3 0 C 3 8, 2 14, -1 20 C -3 13, -4 7, -3 0 Z" fill={KM.blanco} stroke={N} strokeWidth={1.2} strokeLinejoin="round" /></g>
    <g transform={`translate(18 23) scale(${colmillo * 0.8})`}><path d="M-3 0 L 3 0 C 3 8, 2 14, -1 20 C -3 13, -4 7, -3 0 Z" fill={KM.blanco} stroke={N} strokeWidth={1.2} strokeLinejoin="round" /></g>
    <path d="M32 27 C 34 22, 36 18, 39 15 C 38 20, 37 24, 35 28 Z" fill={KM.blanco} stroke={N} strokeWidth={1} />
  </g>
);
/** Melena encrespada de raksasa en la nuca (rulos negros que caen a los hombros). */
const MelenaRaksasa: React.FC<{ c?: string }> = ({ c = N }) => {
  const f = useCurrentFrame();
  return <g>{[0, 1, 2, 3, 4].map((i) => { const o = Math.sin(f / 14 + i) * 2; return <path key={i} d={`M${-22 - i * 2} ${-24 + i * 14} C ${-46 - i * 3} ${-30 + i * 14 + o}, ${-62 - i * 2} ${-14 + i * 14 + o}, ${-56 - i * 2} ${2 + i * 14} C ${-52} ${-6 + i * 14}, -44 ${-8 + i * 14}, ${-26 - i} ${-6 + i * 14} Z`} fill={c} stroke={N} strokeWidth={1.2} />; })}</g>;
};
/** Pelo largo, blanco y suelto de la viuda (Calon Arang): de la coronilla hasta la cintura, con mechones. Va en `detras`. */
const PeloLargo: React.FC<{ c?: string }> = ({ c = '#E8E2D4' }) => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f / 16 + k) * 4;
  return <g><path d={suave([[0, -372], [-26, -368], [-40, -340], [-46 + o(1), -296], [-56 + o(2), -250], [-62 + o(3), -206], [-48, -212], [-38 + o(2), -190], [-28, -236], [-18, -290], [-6, -330]], true, 0.8)} fill={c} stroke={N} strokeWidth={1.6} />{[0, 1, 2].map((i) => <path key={i} d={`M${-20 - i * 6} -350 C ${-30 - i * 6} -300, ${-36 - i * 6 + o(i)} -260, ${-42 - i * 5 + o(i + 1)} -220`} stroke="#B8B0A0" strokeWidth={1.6} fill="none" />)}</g>;
};
/** Bigote balinés de hombre (Kebo Iwa). */
const Bigote: React.FC<{ c?: string }> = ({ c = N }) => <path d="M22 14 C 28 10, 38 11, 42 17 C 38 16, 34 17, 31 19 C 28 17, 24 17, 22 18 Z" fill={c} />;

// ---------- cuerpo ----------
/** Tela de pecho (kemben) de las diosas: banda con ribete de oro y un dibujito de flores. */
const Kemben: React.FC<{ c: string; borde?: string }> = ({ c, borde = KM.oro }) => (
  <g>
    <path d={suave([[-24, -298], [2, -302], [22, -300], [35, -284], [34, -262], [28, -248], [-2, -246], [-28, -248], [-31, -276]], true, 0.7)} fill={c} stroke={N} strokeWidth={1.8} />
    <path d={suave([[-26, -250], [-2, -248], [28, -251]])} stroke={borde} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    <path d={suave([[-22, -296], [2, -300], [26, -296]])} stroke={borde} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    {[-14, 2, 18].map((x) => <circle key={x} cx={x} cy={-273} r={2.6} fill={borde} />)}
  </g>
);
/** Olitas del lago bajo los pies (Dewi Danu). Va en `detras`. */
const Olas: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 12) * 3;
  const ola = (y0: number) => `M${-84 + o} ${y0}` + Array.from({ length: 6 }, (_, i) => { const x1 = -84 + (i + 1) * 28 + o; return ` Q ${x1 - 14} ${y0 - 12} ${x1} ${y0}`; }).join('');
  return <g>{[0, 1].map((k) => <path key={k} d={ola(4 - k * 10)} stroke={k ? KM.azul : KM.azulClaro} strokeWidth={5 - k} fill="none" strokeLinecap="round" />)}</g>;
};

// ---------- atributos en la mano ----------
/** Gavilla de arroz dorado (padi) con lazo rojo: los tallos y las espigas que se doblan. */
const Padi: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g transform="translate(0 4) rotate(-6)">
      {[-10, -5, 0, 5, 10].map((dx, i) => <path key={i} d={`M${dx * 0.2} 30 L ${dx} -70`} stroke={i % 2 ? KM.verde : '#7A8A3A'} strokeWidth={2.4} />)}
      {[-10, -5, 0, 5, 10].map((dx, i) => { const o = Math.sin(f / 16 + i) * 2, d = dx < 0 ? -1 : 1; return <g key={`e${i}`}><path d={`M${dx} -70 C ${dx + d * 10} -84, ${dx + d * 22 + o} -78, ${dx + d * 26 + o} -56`} stroke={KM.oro} strokeWidth={2} fill="none" />{[0.2, 0.4, 0.6, 0.8, 1].map((t) => { const px = dx + d * (26 * t) + o * t, py = -70 - Math.sin(t * Math.PI) * 10 + t * 14; return <ellipse key={t} cx={r1(px)} cy={r1(py)} rx={2.6} ry={4} fill={KM.ocreClaro} stroke={KM.tierra} strokeWidth={0.7} transform={`rotate(${r1(d * 30)} ${r1(px)} ${r1(py)})`} />; })}</g>; })}
      <path d="M-8 0 Q 0 4 8 0" stroke={KM.rojo} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Loto blanco en la mano. */
const Teratai: React.FC = () => <g><path d="M0 10 C 2 -6, 0 -16, 2 -24" stroke={KM.verde} strokeWidth={3} fill="none" />{[-50, -25, 0, 25, 50].map((a, i) => <path key={i} transform={`translate(2 -24) rotate(${a})`} d="M0 0 C -8 -8, -6 -22, 0 -28 C 6 -22, 8 -8, 0 0 Z" fill={i === 2 ? KM.blanco : '#F2DDE0'} stroke={N} strokeWidth={1} />)}<circle cx={2} cy={-26} r={3} fill={KM.ocreClaro} /></g>;
/** Cántaro de agua (kendi) que derrama un hilo de agua. */
const Kendi: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g transform="translate(4 14)">
      <path d="M-16 0 C -22 -18, 14 -24, 16 -4 C 18 10, -12 16, -16 0 Z" fill={KM.tierra} stroke={N} strokeWidth={1.6} />
      <path d="M-6 -18 L -6 -30 L 6 -30 L 6 -18" fill={KM.tierra} stroke={N} strokeWidth={1.4} />
      <path d="M12 -8 L 26 -16 L 28 -12 L 15 -2 Z" fill={KM.tierra} stroke={N} strokeWidth={1.3} />
      <path d="M-14 -6 Q 0 -2 14 -6" stroke={KM.oro} strokeWidth={2} fill="none" />
      <path d={`M28 -14 C 34 -6, 32 10, 34 30`} stroke={KM.azulClaro} strokeWidth={3} fill="none" strokeDasharray="6 4" strokeDashoffset={-f * 1.5} strokeLinecap="round" />
    </g>
  );
};

// ---------- criaturas ----------
/** Barong Ket oficial: el protector con forma de león. Máscara roja grande de ojos saltones con aro de oro, corona
 * de cuero dorado en abanico, barba blanca larga, cuerpo de flecos dorados y blancos con espejitos, cola alzada con
 * campanita y cuatro piernas de los danzantes a rayas. Origen = pies, mirando a la derecha. */
const BarongOficial: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, corriendo, f, boca }) => {
  const anda = moviendo || corriendo, fase = anda ? f * (corriendo ? 0.34 : 0.2) : 0, amp = anda ? 22 : 0;
  const bote = anda ? -Math.abs(Math.sin(fase)) * 6 : Math.sin(f / 16) * 2;
  const pierna = (dx: number, ph: number) => pata(fase, amp, [dx, -118], ph, 62, 56, [34, 26, 22]);
  const abre = boca ? 12 + Math.abs(Math.sin(f / 3)) * 8 : 3 + Math.abs(Math.sin(f / 14)) * 2;
  const rayas = (dx: number, k: string) => <path key={k} d={`M${dx - 15} -92 h 30 M${dx - 13} -66 h 27 M${dx - 11} -40 h 24`} stroke={KM.rojo} strokeWidth={5} opacity={0.85} />;
  const cola = Math.sin(f / 10) * 8;
  return (
    <g transform={`translate(${x} ${y + bote}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {[[-150, Math.PI], [70, 0]].map(([dx, ph], i) => <path key={i} d={pierna(dx, ph)} fill={KM.blanco} stroke={N} strokeWidth={2} />)}
      {rayas(-150, 'r1')}{rayas(70, 'r2')}
      <path d={`M-178 -236 C -214 -290, -204 -372, ${-164 + cola * 0.4} ${-404 + cola}`} stroke={N} strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d={`M-178 -236 C -214 -290, -204 -372, ${-164 + cola * 0.4} ${-404 + cola}`} stroke={KM.oro} strokeWidth={20} fill="none" strokeLinecap="round" />
      <path d={`M-178 -236 C -214 -290, -204 -372, ${-164 + cola * 0.4} ${-404 + cola}`} stroke={KM.rojo} strokeWidth={4} fill="none" strokeDasharray="4 12" />
      <g transform={`translate(${r1(-162 + cola * 0.4)} ${r1(-414 + cola)})`}><path d="M-12 8 C -12 -10, 12 -10, 12 8 Z" fill={KM.oro} stroke={N} strokeWidth={1.8} /><circle cy={-12} r={5} fill={KM.rojo} stroke={N} strokeWidth={1.2} /></g>
      <path d={suave([[-196, -226], [-150, -296], [-40, -310], [80, -300], [140, -250], [140, -150], [-190, -138]], true)} fill="#B8862E" stroke={N} strokeWidth={2.8} />
      {Array.from({ length: 4 }, (_, row) => Array.from({ length: 24 }, (_, i) => {
        const px = -190 + i * 13.5 + (row % 2) * 7, top = -296 + row * 40 + Math.abs(px + 30) * 0.06, sw = Math.sin(f / 9 + i * 0.7 + row) * 3;
        return <path key={`${row}-${i}`} d={`M${px} ${r1(top)} q ${r1(sw + 4)} 30 ${r1(sw * 0.4)} 58`} stroke={(i + row) % 4 === 0 ? KM.blanco : (i + row) % 4 === 2 ? KM.oro : KM.ocreClaro} strokeWidth={6} strokeLinecap="round" fill="none" />;
      }))}
      {Array.from({ length: 8 }, (_, i) => { const px = -170 + i * 38; return <path key={`pl${i}`} d={`M${px - 18} ${-292 - Math.sin((i / 7) * Math.PI) * 14} q 18 -26 36 0 Z`} fill={KM.oro} stroke={N} strokeWidth={1.6} />; })}
      {[-150, -90, -30, 30, 90].map((px, i) => <g key={`m${i}`}><circle cx={px} cy={-270 - Math.sin(((px + 150) / 240) * Math.PI) * 10} r={8} fill={KM.azulClaro} stroke={KM.oro} strokeWidth={3} /><circle cx={px - 2} cy={-272 - Math.sin(((px + 150) / 240) * Math.PI) * 10} r={2.6} fill={KM.blanco} /></g>)}
      {[[-124, 0.6], [100, Math.PI + 0.6]].map(([dx, ph], i) => <path key={`d${i}`} d={pierna(dx, ph)} fill={KM.blanco} stroke={N} strokeWidth={2} />)}
      {rayas(-124, 'r3')}{rayas(100, 'r4')}
      <g transform={`translate(176 -258) rotate(${r1(Math.sin(f / 14) * 3)}) scale(1.22)`}>
        {Array.from({ length: 11 }, (_, i) => { const a = ((-178 + i * 17) * Math.PI) / 180, l = i % 2 ? 98 : 112; return <path key={i} d={`M${r1(Math.cos(a - 0.1) * 40)} ${r1(Math.sin(a - 0.1) * 40)} C ${r1(Math.cos(a - 0.1) * 80)} ${r1(Math.sin(a - 0.1) * 80)}, ${r1(Math.cos(a) * (l - 8))} ${r1(Math.sin(a) * (l - 8))}, ${r1(Math.cos(a) * l)} ${r1(Math.sin(a) * l)} C ${r1(Math.cos(a + 0.12) * 80)} ${r1(Math.sin(a + 0.12) * 80)}, ${r1(Math.cos(a + 0.1) * 60)} ${r1(Math.sin(a + 0.1) * 60)}, ${r1(Math.cos(a + 0.1) * 40)} ${r1(Math.sin(a + 0.1) * 40)} Z`} fill={i % 2 ? KM.oro : KM.ocreClaro} stroke={N} strokeWidth={1.6} />; })}
        {Array.from({ length: 9 }, (_, i) => <path key={`b${i}`} d={`M${-14 + i * 9} ${30 + abre} q ${r1(Math.sin(f / 9 + i) * 6)} 64 ${-6 + i * 2} ${118 - Math.abs(i - 4) * 9}`} stroke={i % 2 ? KM.blanco : '#E4DCCC'} strokeWidth={9} strokeLinecap="round" fill="none" />)}
        <path d={`M-30 ${20 + abre} L 70 ${18 + abre} Q 72 ${42 + abre} 34 ${48 + abre} Q -18 ${48 + abre} -30 ${20 + abre} Z`} fill={KM.rojo} stroke={N} strokeWidth={2.2} />
        {[2, 18, 34, 50].map((dx) => <path key={dx} d={`M${dx - 6} ${19 + abre} l 6 -9 l 6 9 Z`} fill={KM.blanco} stroke={N} strokeWidth={1} />)}
        <path d="M-40 -28 C -40 -60, 32 -66, 66 -40 C 84 -24, 86 4, 74 22 L -34 22 C -44 6, -46 -14, -40 -28 Z" fill={KM.rojo} stroke={N} strokeWidth={2.6} />
        <path d="M-40 -28 C -40 -60, 32 -66, 66 -40" stroke={KM.oro} strokeWidth={7} fill="none" />
        {[-24, -2, 20, 42].map((dx, i) => <circle key={i} cx={dx} cy={-50 + Math.abs(dx - 9) * 0.12} r={4} fill={i % 2 ? KM.rojo : KM.azulClaro} stroke={N} strokeWidth={1} />)}
        {[2, 18, 34, 50].map((dx) => <path key={`t${dx}`} d={`M${dx - 6} 20 l 6 10 l 6 -10 Z`} fill={KM.blanco} stroke={N} strokeWidth={1} />)}
        <path d="M60 -6 Q 86 -8 86 10 Q 72 18 58 10 Z" fill={KM.rojoOsc} stroke={N} strokeWidth={1.6} />
        <circle cx={30} cy={-18} r={17} fill={KM.oro} stroke={N} strokeWidth={1.8} />
        <circle cx={30} cy={-18} r={12} fill={KM.blanco} stroke={N} strokeWidth={1.4} /><circle cx={33} cy={-18} r={5.5} fill={N} /><circle cx={34.6} cy={-20} r={1.6} fill={KM.blanco} />
        <path d="M10 -40 Q 30 -50 50 -38" stroke={N} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M-36 -30 C -56 -40, -64 -20, -50 -6 C -44 -16, -40 -20, -32 -16 Z" fill={KM.oro} stroke={N} strokeWidth={1.6} /><circle cx={-48} cy={-20} r={3.4} fill={KM.rojo} />
      </g>
    </g>
  );
};

/** Rangda oficial: reina de los leak, de frente. Melena blanca que la envuelve hasta las rodillas, corona de llamas,
 * máscara pálida de ojos saltones, colmillos que suben, lengua larga de fuego, manos alzadas de uñas largas y el
 * paño mágico blanco. Origen = pies. */
const RangdaOficial: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, boca }) => {
  const fase = moviendo ? f * 0.18 : 0, amp = moviendo ? 16 : 0, m = Math.sin(f / 12);
  const clip = useId().replace(/[^a-zA-Z0-9]/g, '');
  const pierna = (ph: number, dx: number) => pata(fase, amp, [dx, -150], ph, 80, 74, [36, 28, 22]);
  const brazo = (k: 1 | -1): P[] => [[k * 46, -318], [k * 92, -352 + m * 5], [k * 104, -424 + m * 8]];
  const mano = (k: 1 | -1) => { const [hx, hy] = brazo(k)[2]; return (
    <g transform={`translate(${hx} ${hy}) scale(${k} 1)`}>
      {[-30, -10, 10, 30].map((a) => <g key={a} transform={`rotate(${a} 0 -4)`}><rect x={-2.4} y={-18} width={4.8} height={14} rx={2.4} fill="#E8DCC4" stroke={N} strokeWidth={1.4} /><path d="M-2 -17 C -2 -30, 2 -40, 9 -48 C 6 -38, 4 -28, 2 -17 Z" fill="#F4ECD6" stroke={N} strokeWidth={1.3} strokeLinejoin="round" /></g>)}
      <rect x={-11} y={-7} width={22} height={15} rx={5} fill="#E8DCC4" stroke={N} strokeWidth={1.8} />
      <rect x={-12} y={7} width={24} height={6} rx={2} fill={KM.oro} stroke={N} strokeWidth={1.2} />
    </g>
  ); };
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {/* melena blanca por detrás */}
      <path d={suave([[0, -540], [-90, -510], [-128, -420], [-120 + m * 4, -300], [-128 + m * 6, -170], [-96, -110], [0, -150], [96, -110], [128 - m * 6, -170], [120 - m * 4, -300], [128, -420], [90, -510]], true, 0.8)} fill="#E6E0D2" stroke={N} strokeWidth={2.4} />
      {Array.from({ length: 10 }, (_, i) => { const k = i < 5 ? -1 : 1, j = i % 5; return <path key={i} d={`M${k * (40 + j * 16)} -470 C ${k * (70 + j * 12)} -380, ${k * (60 + j * 14) + Math.sin(f / 12 + i) * 5} -260, ${k * (70 + j * 10) + Math.sin(f / 10 + i) * 6} ${-150 - j * 6}`} stroke={j % 2 ? '#B8B0A0' : KM.blanco} strokeWidth={3} fill="none" />; })}
      {[0, Math.PI].map((ph, i) => { const d = pierna(ph, i ? 20 : -20), id = `rgp${i}${clip}`; return <g key={i}><defs><clipPath id={id}><path d={d} /></clipPath></defs><path d={d} fill={KM.blanco} /><g clipPath={`url(#${id})`}>{Array.from({ length: 12 }, (_, j) => <rect key={j} x={-80} y={-150 + j * 14} width={160} height={5} fill={N} opacity={0.75} />)}</g><path d={d} fill="none" stroke={N} strokeWidth={2.2} /></g>; })}
      <path d={suave([[-66, -336], [0, -356], [66, -336], [76, -240], [60, -140], [-60, -140], [-76, -240]], true)} fill="#E2DACA" stroke={N} strokeWidth={2.6} />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-58 + i * 10.5} -340 C ${-62 + i * 10.5 + Math.sin(f / 10 + i) * 4} -270, ${-56 + i * 10.5} -210, ${-62 + i * 11 + Math.sin(f / 9 + i) * 5} -144`} stroke={i % 3 ? '#A8A090' : KM.blanco} strokeWidth={3} fill="none" />)}
      <path d="M-62 -206 Q 0 -192 62 -206" stroke={KM.rojo} strokeWidth={9} fill="none" /><path d="M-62 -206 Q 0 -192 62 -206" stroke={KM.oro} strokeWidth={3} fill="none" strokeDasharray="6 6" />
      {([1, -1] as const).map((k) => <g key={k}><path d={miembro(brazo(k), [26, 20, 16])} fill="#E8DCC4" stroke={N} strokeWidth={2.2} />{mano(k)}</g>)}
      <g transform={`translate(-104 ${-424 + m * 8})`}><PanoMano /></g>
      <g transform={`translate(0 -428) rotate(${r1(m * 2)}) scale(1.15)`}>
        <path d="M-56 -40 L -50 -92 L -34 -64 L -20 -112 L -6 -70 L 0 -128 L 6 -70 L 20 -112 L 34 -64 L 50 -92 L 56 -40 Z" fill={KM.oro} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
        {[-34, 0, 34].map((dx) => <circle key={dx} cx={dx} cy={-58} r={5} fill={KM.rojo} stroke={N} strokeWidth={1} />)}
        <path d="M-58 -38 Q 0 -54 58 -38 L 56 -26 Q 0 -40 -56 -26 Z" fill={KM.oro} stroke={N} strokeWidth={1.8} />
        <path d="M-52 -32 C -58 0, -56 30, -42 48 C -26 62, 26 62, 42 48 C 56 30, 58 0, 52 -32 C 30 -42, -30 -42, -52 -32 Z" fill="#F2E4C6" stroke={N} strokeWidth={2.6} />
        <path d="M0 -36 L 7 -27 L 0 -18 L -7 -27 Z" fill={KM.oro} stroke={N} strokeWidth={1.2} /><circle cx={0} cy={-27} r={2.6} fill={KM.rojo} />
        {[-1, 1].map((k) => <g key={k}>
          <circle cx={k * 25} cy={2} r={15} fill={KM.blanco} stroke={KM.rojo} strokeWidth={2.6} />
          <circle cx={k * 25 + 2} cy={3} r={6.5} fill={N} /><circle cx={k * 25 + 4} cy={1} r={2} fill={KM.blanco} />
          <path d={`M${k * 9} -6 Q ${k * 25} -18 ${k * 41} -6`} stroke={N} strokeWidth={4.5} fill="none" strokeLinecap="round" />
          <path d={`M${k * 5} -14 C ${k * 20} -32, ${k * 42} -34, ${k * 56} -20 L ${k * 52} -13 C ${k * 40} -24, ${k * 22} -22, ${k * 8} -8 Z`} fill={N} />
        </g>)}
        <path d="M-5 0 C -8 10, -16 16, -14 24 C -10 28, -4 24, 0 26 C 4 24, 10 28, 14 24 C 16 16, 8 10, 5 0" fill="#F2E4C6" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        {[-1, 1].map((k) => <ellipse key={k} cx={k * 7} cy={23} rx={3} ry={2} fill={N} />)}
        <path d={`M-36 32 Q 0 ${boca ? 66 : 58} 36 32 Q 0 40 -36 32 Z`} fill={KM.rojoOsc} stroke={N} strokeWidth={2} />
        {[-24, -12, 0, 12].map((dx) => <path key={dx} d={`M${dx} 34 h 12 l -6 8 Z`} fill={KM.blanco} stroke={N} strokeWidth={0.8} />)}
        {[-1, 1].map((k) => <path key={k} d={`M${k * 28} 40 C ${k * 38} 24, ${k * 44} 10, ${k * 54} 0 C ${k * 48} 16, ${k * 42} 28, ${k * 38} 44 Z`} fill={KM.blanco} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />)}
        <path d={`M-12 44 C -16 94, ${-6 + m * 8} 144, ${4 + m * 10} 196 C ${16 + m * 10} 144, 18 94, 12 44 Z`} fill={KM.rojo} stroke={N} strokeWidth={2} />
        {[86, 122, 158].map((yy, i) => <path key={i} d={`M${-7 + m * 6} ${yy} q 8 -12 15 0 q -7 -4 -15 0 Z`} fill={KM.oro} stroke={N} strokeWidth={0.8} />)}
      </g>
    </g>
  );
};

// ---------- fichas ----------
type PP = Partial<PersonajeProps>;
const H = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: { barba: false, tocado: null, collar: false, ...p }, griego: nombre });
const M = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: { mujer: true, tocado: null, collar: false, ...p }, griego: nombre });
const D = (Dibujo: React.FC<DibujoProps>, nombre: string, p: Record<string, unknown> = {}): Ficha => ({ tipo: 'dibujo', Dibujo, p, griego: nombre });

const PIEL_DIOSA = '#F4E4C4';
const coronaDiosa = (flor = true) => <><Gelungan alto={0.72} nuca={false} /><Sumping />{flor && <><Flor x={-28} y={-26} /><Flor x={-38} y={-16} r={4} /></>}</>;
const rodete = <><path d="M-32 6 C -36 -30, 0 -44, 24 -30 C 10 -30, -6 -24, -14 -12 C -20 -2, -24 8, -32 6 Z" fill={N} /><ellipse cx={-38} cy={-14} rx={15} ry={13} fill={N} /></>;


// ---------- segunda tanda: secundarios, extras y animales (cuerpo del muñeco + 2–3 atributos) ----------
/** Cumbre de montaña en la mano (Pasupati trae el Mahameru; Putrajaya y Genijaya, el Agung y el Batur). */
const Cumbre: React.FC<{ c?: string; c2?: string; doble?: boolean }> = ({ c = KM.tierra, c2 = KM.rojo, doble }) => (
  <g transform="translate(0 -8)">
    <path d={doble ? 'M-34 14 L -14 -34 L -2 -14 L 14 -50 L 34 14 Z' : 'M-30 14 L 0 -46 L 30 14 Z'} fill={c} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
    <path d={doble ? 'M-14 -34 L -20 -20 L -8 -22 Z M14 -50 L 6 -30 L 20 -30 Z' : 'M0 -46 L -9 -28 L 9 -28 Z'} fill={KM.blanco} stroke={N} strokeWidth={1.2} strokeLinejoin="round" />
    <path d="M-26 8 Q 0 2 26 8" stroke={c2} strokeWidth={4} fill="none" />
  </g>
);
/** Abanico redondo de seda (Kang Cing Wie). */
const Kipas: React.FC = () => (
  <g transform="translate(0 -8)">
    <path d="M0 16 L 0 -2" stroke={KM.tierra} strokeWidth={4} strokeLinecap="round" />
    <circle cy={-22} r={21} fill={KM.rojo} stroke={N} strokeWidth={1.8} />
    <circle cy={-22} r={14} fill="none" stroke={KM.oro} strokeWidth={2.4} />
    <path d="M0 -36 V -8 M-14 -22 H 14" stroke={KM.oro} strokeWidth={1.6} />
  </g>
);
/** Calabaza de agua (labu) de Nirartha. */
const Calabaza: React.FC = () => (
  <g transform="translate(0 8)">
    <path d="M-8 -28 C -14 -20, -22 -14, -20 0 C -18 14, 20 14, 20 0 C 22 -14, 12 -20, 8 -28 Z" fill="#B88A3E" stroke={N} strokeWidth={1.8} />
    <path d="M-8 -28 C -8 -40, 8 -40, 8 -28" fill="#B88A3E" stroke={N} strokeWidth={1.8} />
    <path d="M-12 -10 Q 0 -4 12 -10" stroke={KM.tierra} strokeWidth={2} fill="none" />
  </g>
);
/** Cuenco grande de arroz (Kebo, el niño que siempre tiene hambre). */
const Cuenco: React.FC = () => (
  <g transform="translate(0 6)">
    <path d="M-28 -16 C -26 8, 26 8, 28 -16 Z" fill={KM.tierra} stroke={N} strokeWidth={2} />
    <path d="M-30 -16 C -22 -44, 22 -44, 30 -16 Z" fill={KM.blanco} stroke={N} strokeWidth={1.8} />
    <path d="M-26 -8 H 26" stroke={KM.oro} strokeWidth={2.4} />
  </g>
);
/** Vajra dorado de Indra en la mano. */
const VajraBali: React.FC = () => (
  <g transform="translate(0 -6)">
    <path d="M0 14 V -46" stroke={N} strokeWidth={7} strokeLinecap="round" /><path d="M0 14 V -46" stroke={KM.oro} strokeWidth={4} strokeLinecap="round" />
    {[-1, 1].map((k) => <path key={k} d={`M0 -46 C ${k * 14} -52, ${k * 18} -66, ${k * 8} -80 C ${k * 6} -70, ${k * 3} -64, 0 -60`} fill={KM.oro} stroke={N} strokeWidth={1.4} />)}
    <path d="M0 -46 L 0 -84" stroke={N} strokeWidth={5} /><path d="M0 -46 L 0 -84" stroke={KM.oro} strokeWidth={2.6} />
    <circle cy={-16} r={5} fill={KM.rojo} stroke={N} strokeWidth={1.2} />
  </g>
);
/** Palo de caminar de ancianos. */
const Baston: React.FC = () => <g><path d="M0 100 L 0 -30 C 0 -44, 14 -44, 14 -32" stroke={N} strokeWidth={8} fill="none" strokeLinecap="round" /><path d="M0 100 L 0 -30 C 0 -44, 14 -44, 14 -32" stroke={KM.tierra} strokeWidth={5} fill="none" strokeLinecap="round" /></g>;
/** Lanza corta de guardia con borla. */
const Lanza: React.FC<{ c?: string }> = ({ c = KM.rojo }) => (
  <g transform="translate(0 -4)">
    <path d="M0 80 L 0 -130" stroke={N} strokeWidth={7} strokeLinecap="round" /><path d="M0 80 L 0 -130" stroke={KM.tierra} strokeWidth={4} strokeLinecap="round" />
    <path d="M0 -130 L -8 -152 L 0 -180 L 8 -152 Z" fill="#B8B4AE" stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M-9 -124 q 9 14 18 0 q -4 22 -9 28 q -5 -6 -9 -28 Z" fill={c} stroke={N} strokeWidth={1.2} />
  </g>
);
const PeloOscuro: React.FC = () => <PeloLargo c="#241A1C" />;
const coronaRey = (alto = 0.9, c = KM.oro, c2 = KM.rojo) => <><Gelungan alto={alto} c={c} c2={c2} /><Sumping c={c} /></>;
const PIEL_N = '#C8955E', PIEL_F = '#E2BB86', PIEL_REY = '#E8C98E', PIEL_ANC = '#BE8C5A', PIEL_DIOS = '#F1E3C2';
type Dib = React.FC<DibujoProps>;

export const ELENCO_BALINES_OFICIAL: Record<string, Ficha> = {
  barong_oficial: D(BarongOficial, 'BARONG'),
  rangda_oficial: D(RangdaOficial, 'RANGDA'),
  calon_arang_oficial: M({ piel: '#D2A878', cuerpo: 'viejo', canas: true, pelo: '#E8E2D4', ropa: 'larga', ropaColor: '#2A2226', capa: null, brazo: [40, 30], adornos: {
    detras: <PeloLargo />,
    cabeza: <path d="M-32 6 C -36 -30, 0 -44, 24 -30 C 8 -30, -10 -24, -20 -12 C -24 -2, -26 8, -32 6 Z" fill="#E8E2D4" />,
    cuerpo: <><Kemben c={KM.rojoOsc} borde={KM.oro} /><Selendang c={KM.rojo} /></>,
    mano: <PanoMano />,
  } }, 'CALON ARANG'),
  dewi_sri_oficial: M({ piel: PIEL_DIOSA, ropa: 'larga', ropaColor: KM.verde, ribete: KM.oro, brazo: [24, 60], adornos: {
    cabeza: <>{rodete}{coronaDiosa()}</>,
    cuerpo: <><Kemben c={KM.ocreClaro} borde={KM.rojo} /><Badong /><Faja c={KM.oro} c2={KM.rojo} /></>,
    mano: <Padi />,
  } }, 'DEWI SRI'),
  dewi_danu_oficial: M({ piel: PIEL_DIOSA, ropa: 'larga', ropaColor: '#4E6EA8', ribete: KM.azulClaro, brazo: [26, 56], adornos: {
    detras: <Olas />,
    cabeza: <>{rodete}{coronaDiosa()}</>,
    cuerpo: <><Kemben c={KM.azulClaro} borde={KM.oro} /><Badong /><Selendang c={KM.blanco} /></>,
    mano: <Teratai />, manoAtras: <Kendi />,
  } }, 'DEWI DANU'),
  mayadenawa_oficial: H({ piel: KM.rojo, s: 1.08, ropa: 'corta', ropaColor: N, capa: KM.oro, brazo: [30, 50], adornos: {
    cabeza: <><MelenaRaksasa /><CaraRaksasa colmillo={1.1} /><Gelungan alto={1} /></>,
    cuerpo: <><Badong /><Faja c={KM.indigo} c2={KM.oro} /></>,
    mano: <KrisMano />,
  } }, 'MAYADENAWA'),
  kebo_iwa_oficial: H({ piel: '#A8703F', gigante: true, s: 1.3, ropa: 'corta', ropaColor: KM.indigo, adornos: {
    detras: <KrisEspalda />,
    cabeza: <><Udeng c={KM.rojo} c2={KM.oro} /><Bigote /><Flor x={-22} y={-10} r={4} /></>,
    cuerpo: <Faja c={KM.rojo} c2={KM.oro} />,
  } }, 'KEBO IWA'),
  ratu_gede_mecaling_oficial: H({ piel: '#3E3442', gigante: true, s: 1.24, ropa: 'corta', ropaColor: N, contorno: true, adornos: {
    cabeza: <><MelenaRaksasa c="#141014" /><CaraRaksasa colmillo={1.7} bigote="#120E10" /><Gelungan alto={0.9} /><Sumping /></>,
    cuerpo: <><Badong /><Poleng /></>,
  } }, 'RATU GEDE MECALING'),

  // ===== segunda tanda =====
  // dioses
  bhatara_pasupati_oficial: H({ piel: PIEL_DIOS, barba: true, canas: true, ropa: 'larga', ropaColor: KM.rojo, capa: KM.oro, brazo: [30, 70], adornos: {
    cabeza: coronaRey(1.2), cuerpo: <><Badong /><Faja c={KM.oro} c2={KM.rojo} /></>, mano: <Cumbre doble />,
  } }, 'PASUPATI'),
  bhatara_putrajaya_oficial: H({ piel: PIEL_DIOS, ropa: 'larga', ropaColor: KM.indigo, capa: KM.rojo, brazo: [30, 70], adornos: {
    cabeza: coronaRey(1), cuerpo: <><Badong /><Faja c={KM.oro} c2={KM.rojo} /></>, mano: <Cumbre c={KM.tierra} c2={KM.rojo} />,
  } }, 'PUTRAJAYA'),
  bhatara_genijaya_oficial: H({ piel: PIEL_DIOS, ropa: 'larga', ropaColor: KM.rojo, capa: KM.azulClaro, brazo: [30, 70], adornos: {
    cabeza: coronaRey(0.85), cuerpo: <><Badong /><Faja c={KM.indigo} c2={KM.oro} /></>, mano: <Cumbre c={KM.indigo} c2={KM.azulClaro} />,
  } }, 'GENIJAYA'),
  bhatara_indra_oficial: H({ piel: PIEL_DIOS, ropa: 'corta', ropaColor: KM.indigo, capa: KM.rojo, brazo: [40, 80], adornos: {
    detras: <KrisEspalda />, cabeza: coronaRey(1.1), cuerpo: <><Badong /><Faja c={KM.oro} c2={KM.rojo} /></>, mano: <VajraBali />,
  } }, 'INDRA'),
  bhatari_durga_oficial: M({ piel: '#9A6A4E', ropa: 'larga', ropaColor: KM.rojoOsc, capa: null, brazo: [24, 60], adornos: {
    detras: <PeloOscuro />, cabeza: <>{coronaRey(0.9)}<path d="M-32 6 C -36 -30, 0 -44, 24 -30 C 8 -30, -10 -24, -20 -12 C -24 -2, -26 8, -32 6 Z" fill="#241A1C" /></>,
    cuerpo: <><Kemben c={N} borde={KM.oro} /><Badong /><Selendang c={KM.rojo} /></>, mano: <KrisMano />,
  } }, 'DURGA'),
  dewa_bali_oficial: H({ piel: PIEL_DIOS, ropa: 'larga', ropaColor: KM.indigo, capa: KM.oro, adornos: { cabeza: coronaRey(0.8), cuerpo: <><Badong /><Faja c={KM.rojo} c2={KM.oro} /></> } }, 'GOD'),
  dewi_bali_oficial: M({ piel: PIEL_DIOS, ropa: 'larga', ropaColor: KM.rojo, brazo: [24, 60], adornos: { cabeza: <>{rodete}{coronaDiosa()}</>, cuerpo: <><Kemben c={KM.oro} borde={KM.rojo} /><Badong /><Selendang c={KM.blanco} /></> } }, 'GODDESS'),
  // reyes y corte
  sri_jaya_pangus_oficial: H({ piel: PIEL_REY, ropa: 'larga', ropaColor: KM.rojo, capa: KM.oro, adornos: { detras: <KrisEspalda />, cabeza: <>{coronaRey(0.85)}<Bigote /></>, cuerpo: <><Badong /><Faja c={KM.indigo} c2={KM.oro} /></> } }, 'SRI JAYA PANGUS'),
  kang_cing_wie_oficial: M({ piel: '#F6EADA', ropa: 'larga', ropaColor: KM.rojo, brazo: [26, 70], adornos: {
    cabeza: <MonoChino />, cuerpo: <Kemben c={KM.rojoOsc} borde={KM.oro} />, mano: <Kipas />,
  } }, 'KANG CING WIE'),
  prabu_airlangga_oficial: H({ piel: PIEL_REY, ropa: 'larga', ropaColor: KM.indigo, capa: KM.oro, objeto: 'cetro', adornos: { detras: <KrisEspalda />, cabeza: <>{coronaRey(1)}<Bigote /></>, cuerpo: <><Badong /><Faja c={KM.oro} c2={KM.rojo} /></> } }, 'KING AIRLANGGA'),
  raja_bedahulu_oficial: H({ piel: PIEL_REY, ropa: 'larga', ropaColor: KM.rojo, capa: KM.indigo, adornos: { detras: <KrisEspalda />, cabeza: <>{coronaRey(0.8, KM.oro, KM.indigo)}<Bigote /></>, cuerpo: <><Badong /><Faja c={KM.oro} c2={KM.indigo} /></> } }, 'KING OF BEDAHULU'),
  raja_bedahulu_babi_oficial: H({ piel: PIEL_REY, ropa: 'larga', ropaColor: KM.rojo, capa: KM.indigo, adornos: { detras: <KrisEspalda />, cabeza: <><CabezaCerdo /><g transform="translate(4 -10) scale(0.9)"><Gelungan alto={0.7} nuca={false} /></g></>, cuerpo: <><Badong /><Faja c={KM.oro} c2={KM.indigo} /></> } }, 'KING OF BEDAHULU'),
  ratna_manggali_oficial: M({ piel: PIEL_F, ropa: 'larga', ropaColor: KM.rosa, brazo: [24, 60], adornos: { cabeza: <>{rodete}<Flor x={-30} y={-28} /></>, cuerpo: <><Kemben c={KM.blanco} borde={KM.rojo} /><Selendang c={KM.oro} /></> } }, 'RATNA MANGGALI'),
  gajah_mada_oficial: H({ piel: '#B8844E', ropa: 'corta', ropaColor: KM.indigo, capa: KM.rojo, adornos: { detras: <KrisEspalda />, cabeza: <><GorroMajapahit /><Bigote /></>, cuerpo: <><Badong c={KM.ocreClaro} /><Faja c={KM.rojo} c2={KM.oro} /></>, mano: <Lanza c={KM.indigo} /> } }, 'GAJAH MADA'),
  bendesa_beraban_oficial: H({ piel: PIEL_ANC, ropa: 'larga', ropaColor: KM.ocre, capa: KM.rojoOsc, adornos: { detras: <KrisEspalda />, cabeza: <><Udeng c={KM.rojo} c2={KM.oro} /><Bigote /></>, cuerpo: <Faja c={KM.rojo} c2={KM.oro} /> } }, 'CHIEF OF BERABAN'),
  // sacerdotes y héroes
  nirartha_oficial: H({ piel: PIEL_N, barba: true, canas: true, ropa: 'larga', ropaColor: KM.blanco, capa: KM.oro, adornos: { cabeza: <MonoSacerdote canas />, cuerpo: <Faja c={KM.ocreClaro} c2={KM.oro} />, mano: <GentaMano />, manoAtras: <Calabaza /> } }, 'NIRARTHA'),
  sidhi_mantra_oficial: H({ piel: PIEL_N, barba: true, canas: true, ropa: 'larga', ropaColor: KM.blanco, capa: KM.ocreClaro, adornos: { cabeza: <MonoSacerdote canas />, mano: <GentaMano /> } }, 'SIDHI MANTRA'),
  mpu_bharadah_oficial: H({ piel: PIEL_N, barba: true, canas: true, ropa: 'larga', ropaColor: KM.blanco, capa: KM.rojo, adornos: { cabeza: <MonoSacerdote canas />, cuerpo: <Faja c={KM.rojo} c2={KM.oro} />, mano: <GentaMano /> } }, 'MPU BHARADAH'),
  mpu_bharadah_libro_oficial: H({ piel: PIEL_N, barba: true, canas: true, ropa: 'larga', ropaColor: KM.blanco, capa: KM.rojo, adornos: { cabeza: <MonoSacerdote canas />, cuerpo: <Faja c={KM.rojo} c2={KM.oro} />, mano: <LontarMano /> } }, 'MPU BHARADAH'),
  mpu_kulputih_oficial: H({ piel: PIEL_ANC, barba: true, canas: true, cuerpo: 'viejo', ropa: 'larga', ropaColor: KM.blanco, capa: KM.crema2, adornos: { cabeza: <MonoSacerdote canas />, mano: <GentaMano /> } }, 'MPU KULPUTIH'),
  mpu_bahula_oficial: H({ piel: PIEL_N, ropa: 'larga', ropaColor: KM.blanco, capa: KM.ocre, adornos: { cabeza: <MonoSacerdote canas={false} />, cuerpo: <Faja c={KM.ocre} c2={KM.oro} /> } }, 'MPU BAHULA'),
  mpu_bahula_libro_oficial: H({ piel: PIEL_N, ropa: 'larga', ropaColor: KM.blanco, capa: KM.ocre, adornos: { cabeza: <MonoSacerdote canas={false} />, cuerpo: <Faja c={KM.ocre} c2={KM.oro} />, mano: <LontarMano /> } }, 'MPU BAHULA'),
  manik_angkeran_oficial: H({ piel: PIEL_N, ropa: 'corta', ropaColor: KM.rojo, adornos: { cabeza: <><Udeng c={KM.ocreClaro} c2={KM.rojo} /><Flor x={-22} y={-10} r={4} /></>, cuerpo: <Faja c={KM.oro} c2={KM.rojo} /> } }, 'MANIK ANGKERAN'),
  manik_angkeran_genta_oficial: H({ piel: PIEL_N, ropa: 'corta', ropaColor: KM.rojo, adornos: { cabeza: <><Udeng c={KM.ocreClaro} c2={KM.rojo} /><Flor x={-22} y={-10} r={4} /></>, cuerpo: <Faja c={KM.oro} c2={KM.rojo} />, mano: <GentaMano /> } }, 'MANIK ANGKERAN'),
  manik_angkeran_joya_oficial: H({ piel: PIEL_N, ropa: 'corta', ropaColor: KM.rojo, adornos: { cabeza: <><Udeng c={KM.ocreClaro} c2={KM.rojo} /><Flor x={-22} y={-10} r={4} /></>, cuerpo: <Faja c={KM.oro} c2={KM.rojo} />, mano: <JoyaMano /> } }, 'MANIK ANGKERAN'),
  kebo_oficial: H({ piel: '#B07A4A', cuerpo: 'nino', gigante: true, ropa: 'corta', ropaColor: KM.indigo, adornos: { cabeza: <Udeng c={KM.rojo} c2={KM.oro} />, cuerpo: <Faja c={KM.rojo} c2={KM.oro} />, mano: <Cuenco /> } }, 'KEBO'),
  calon_arang_libro_oficial: M({ piel: '#D2A878', cuerpo: 'viejo', canas: true, pelo: '#E8E2D4', ropa: 'larga', ropaColor: '#2A2226', capa: null, brazo: [40, 30], adornos: {
    detras: <PeloLargo />, cabeza: <path d="M-32 6 C -36 -30, 0 -44, 24 -30 C 8 -30, -10 -24, -20 -12 C -24 -2, -26 8, -32 6 Z" fill="#E8E2D4" />,
    cuerpo: <><Kemben c={KM.rojoOsc} borde={KM.oro} /><Selendang c={KM.rojo} /></>, mano: <LontarMano />,
  } }, 'CALON ARANG'),
  murid_leak_oficial: M({ piel: PIEL_F, ropa: 'larga', ropaColor: KM.blanco, brazo: [30, 70], adornos: { detras: <PeloOscuro />, cabeza: <path d="M-32 6 C -36 -30, 0 -44, 24 -30 C 8 -30, -10 -24, -20 -12 C -24 -2, -26 8, -32 6 Z" fill="#241A1C" />, cuerpo: <Kemben c={KM.rojoOsc} borde={KM.oro} />, mano: <PanoMano /> } }, 'DISCIPLE'),
  // gente de la isla
  wanita_bali_oficial: M({ piel: PIEL_F, ropa: 'larga', ropaColor: KM.ocre, brazo: [30, 70], adornos: { cabeza: <Rodete />, cuerpo: <><Kemben c={KM.blanco} borde={KM.rojo} /><Selendang c={KM.rojo} /></>, mano: <CanangMano /> } }, 'WOMAN'),
  wanita_bali_2_oficial: M({ piel: '#D9AE78', ropa: 'larga', ropaColor: KM.verde, adornos: { cabeza: <Rodete flores={false} />, cuerpo: <><Kemben c={KM.ocreClaro} borde={KM.indigo} /><Faja c={KM.oro} c2={KM.verde} /></> } }, 'WOMAN'),
  pria_bali_oficial: H({ piel: PIEL_N, ropa: 'corta', ropaColor: KM.ocre, adornos: { cabeza: <><Udeng c={KM.blanco} c2={KM.ocre} /><Flor x={-22} y={-10} r={4} /></>, cuerpo: <Faja c={KM.blanco} c2={KM.ocre} /> } }, 'MAN'),
  pria_bali_2_oficial: H({ piel: '#B8844E', ropa: 'corta', ropaColor: KM.indigo, adornos: { cabeza: <Udeng c={KM.rojo} c2={KM.oro} />, cuerpo: <Faja c={KM.ocreClaro} c2={KM.indigo} /> } }, 'MAN'),
  anak_bali_oficial: H({ piel: PIEL_N, cuerpo: 'nino', ropa: 'corta', ropaColor: KM.rojo, adornos: { cabeza: <Udeng c={KM.blanco} c2={KM.rojo} /> } }, 'CHILD'),
  anak_bali_nina_oficial: M({ piel: PIEL_F, cuerpo: 'nino', ropa: 'larga', ropaColor: KM.rosa, adornos: { cabeza: <Rodete />, cuerpo: <Selendang c={KM.oro} /> } }, 'CHILD'),
  kakek_bali_oficial: H({ piel: PIEL_ANC, cuerpo: 'viejo', canas: true, ropa: 'corta', ropaColor: KM.indigo, adornos: { cabeza: <><Udeng c={KM.blanco} c2={KM.ocre} /><Bigote c="#E8E2D4" /></>, cuerpo: <Faja c={KM.ocreClaro} c2={KM.indigo} />, mano: <Baston /> } }, 'ELDER'),
  nenek_bali_oficial: M({ piel: '#D9AE78', cuerpo: 'viejo', canas: true, ropa: 'larga', ropaColor: KM.tierra, adornos: { cabeza: <Rodete flores={false} c="#E8E2D4" />, cuerpo: <><Kemben c={KM.ocreClaro} borde={KM.rojo} /><Selendang c={KM.rojo} /></>, mano: <Baston /> } }, 'ELDER'),
  pemangku_oficial: H({ piel: PIEL_N, ropa: 'larga', ropaColor: KM.blanco, capa: KM.ocreClaro, adornos: { cabeza: <Udeng c={KM.blanco} c2={KM.crema2} />, cuerpo: <Faja c={KM.ocreClaro} c2={KM.oro} />, mano: <GentaMano /> } }, 'TEMPLE PRIEST'),
  pecalang_oficial: H({ piel: PIEL_N, ropa: 'corta', ropaColor: N, adornos: { detras: <KrisEspalda />, cabeza: <Udeng c={N} c2={KM.oro} />, cuerpo: <Poleng largo /> } }, 'PECALANG'),
  prajurit_bali_oficial: H({ piel: PIEL_N, ropa: 'corta', ropaColor: KM.rojo, adornos: { detras: <KrisEspalda />, cabeza: <Udeng c={KM.rojo} c2={KM.oro} />, cuerpo: <Poleng />, mano: <Lanza /> } }, 'WARRIOR'),
  prajurit_dewa_oficial: H({ piel: PIEL_DIOS, ropa: 'corta', ropaColor: KM.indigo, adornos: { cabeza: <><Gelungan alto={0.6} nuca={false} /><Sumping /></>, cuerpo: <><Badong /><Faja c={KM.oro} c2={KM.rojo} /></>, mano: <Lanza c={KM.oro} /> } }, 'HEAVENLY WARRIOR'),
  prajurit_jawa_oficial: H({ piel: '#B8844E', ropa: 'corta', ropaColor: KM.indigo, adornos: { cabeza: <GorroMajapahit />, cuerpo: <Faja c={KM.rojo} c2={KM.oro} />, mano: <Lanza c={KM.indigo} /> } }, 'JAVANESE SOLDIER'),
  penari_kris_oficial: H({ piel: PIEL_N, ropa: 'corta', ropaColor: KM.blanco, brazo: [60, 100], adornos: { cabeza: <Udeng c={KM.blanco} c2={KM.rojo} />, cuerpo: <Poleng />, mano: <KrisMano /> } }, 'KRIS DANCER'),
  raksasa_bali_oficial: H({ piel: '#4E6A5A', ropa: 'corta', ropaColor: KM.rojo, adornos: { cabeza: <><MelenaRaksasa c="#2A2224" /><CaraRaksasa colmillo={0.9} /></>, cuerpo: <Poleng />, mano: <Lanza /> } }, 'DEMON'),
  // criaturas
  naga_besukih_oficial: D(Naga as Dib, 'NAGA BESUKIH', { color: '#3E6A44', joya: true }),
  naga_besukih_herida_oficial: D(Naga as Dib, 'NAGA BESUKIH', { color: '#3E6A44', sinCola: true }),
  naga_basuki_oficial: D(Naga as Dib, 'NAGA BASUKI', { color: '#4E7A4A' }),
  naga_anantaboga_oficial: D(Naga as Dib, 'NAGA ANANTABOGA', { color: '#8A6428' }),
  bedawang_nala_oficial: D(BedawangNala as Dib, 'BEDAWANG NALA'),
  jero_gede_oficial: D(BarongLandung as Dib, 'JERO GEDE', { cara: 'gede' }),
  jero_luh_oficial: D(BarongLandung as Dib, 'JERO LUH', { cara: 'luh' }),
  bojog_oficial: D(Bojog as Dib, 'MONKEY'),
  celeng_oficial: D(Celeng as Dib, 'PIG'),
  manuk_oficial: D(Manuk as Dib, 'ROOSTER'),
  maya_oficial: D(Manuk as Dib, 'MAYA THE BIRD', { color: KM.indigo }),
  ular_poleng_oficial: D(UlarPoleng as Dib, 'SEA SNAKE'),
};
export const NOMBRE_EN_BALINES_OFICIAL: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_BALINES_OFICIAL).map(([k, f]) => [k, f.griego as string]));
