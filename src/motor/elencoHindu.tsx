// Elenco hindú para el tema "pahari" (pintura en miniatura rajput y pahari): dioses con sus atributos de siempre
// (piel azul de Vishnu, cuatro brazos con disco, caracola, maza y loto; Shiva con tridente, luna, Ganges, serpiente y
// tercer ojo; Brahma con dos caras a la vista y los Vedas; Ganesha con cabeza de elefante), asuras, sabios, gente y
// criaturas. Las personas son el muñeco de siempre + `adornos` (coronas, halos, brazos extra, guirnaldas); las
// criaturas propias se dibujan acá (tipo "dibujo"). Colores literales: C cambia con el tema.
// Claves sin prefijo para los dioses (vishnu, shiva…); los animales con nombre sánscrito (airavata, kurma…) para no
// chocar con otras series.
import React, { useId } from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, miembro, type P, type PersonajeProps } from '../comun/vasija';
import { PH, Florcita } from '../comun/pahari';
import type { Ficha } from './elenco';
import type { DibujoProps } from './elencoAzteca';

const r1 = (v: number) => v.toFixed(1);
const N = PH.negro;

// ---------- piezas de cabeza (coordenadas de la cabeza: cara de perfil a la derecha, ojo en 18,-6) ----------
const CARA = suave([[-30, 2], [-22, -26], [0, -36], [20, -30], [28, -14], [30, -6], [41, 6], [32, 10], [34, 15], [31, 20], [26, 26], [8, 32], [4, 46], [-16, 46], [-24, 22]], true, 0.9);
/** Recorta lo de adentro a la forma de la cara (pintura del cuello, marcas). */
const EnCara: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const id = 'phc' + useId().replace(/[^a-zA-Z0-9]/g, '');
  return <g><defs><clipPath id={id}><path d={CARA} /></clipPath></defs><g clipPath={`url(#${id})`}>{children}</g></g>;
};
/** Rabillo de kohl del ojo alargado de las miniaturas. */
const Kohl: React.FC = () => <path d="M26 -6.5 Q 31 -8 35 -11" stroke={N} strokeWidth={1.8} fill="none" strokeLinecap="round" />;
/** Tilak vaishnava (línea roja en la frente). */
const Tilak: React.FC<{ c?: string }> = ({ c = PH.rojo }) => <path d="M24.5 -29 L 27.2 -17" stroke={c} strokeWidth={2.6} strokeLinecap="round" />;
/** Aro de oro con perla (kundala). */
const Kundala: React.FC<{ c?: string }> = ({ c = PH.oro }) => <g><circle cx={-8} cy={12} r={6.5} fill="none" stroke={c} strokeWidth={3} /><circle cx={-8} cy={20} r={3} fill={PH.blanco} stroke={N} strokeWidth={0.8} /></g>;
/** Corona alta de oro (kirita mukuta) con joyas, de Vishnu y los reyes de los dioses. */
const Mukuta: React.FC<{ alto?: number; joya?: string; pluma?: boolean }> = ({ alto = 1, joya = PH.rojo, pluma }) => (
  <g>
    {pluma && <g transform="translate(-14 -52) rotate(-28)"><path d="M0 0 C -10 -30, -6 -60, 4 -78 C 14 -60, 14 -30, 4 0 Z" fill={PH.verde} stroke={N} strokeWidth={1.2} /><circle cx={4} cy={-60} r={7} fill={PH.lapis} stroke={PH.oro} strokeWidth={2} /><circle cx={4} cy={-60} r={3} fill={PH.verdeClaro} /></g>}
    <path d="M-27 -20 C -26 -30, -24 -40, -22 -46 L 22 -48 C 24 -40, 26 -32, 25 -24 C 8 -32, -12 -30, -27 -20 Z" fill={PH.oro} stroke={N} strokeWidth={1.8} />
    <path d={`M-19 -45 L -13 ${-46 - 28 * alto} L 12 ${-48 - 28 * alto} L 18 -47 Z`} fill={PH.oro} stroke={N} strokeWidth={1.6} />
    <path d={`M-11 ${-46 - 28 * alto} L -5 ${-48 - 52 * alto} L 7 ${-49 - 52 * alto} L 11 ${-48 - 28 * alto} Z`} fill={PH.oro} stroke={N} strokeWidth={1.6} />
    <path d={`M-4 ${-48 - 52 * alto} L 1 ${-60 - 60 * alto} L 6 ${-49 - 52 * alto} Z`} fill={PH.amarillo} stroke={N} strokeWidth={1.4} />
    {[[-16, -33], [-2, -36], [12, -37]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.4} fill={i === 1 ? PH.verde : joya} stroke={N} strokeWidth={0.8} />)}
    <circle cx={0} cy={-46 - 28 * alto - 10} r={3.4} fill={joya} stroke={N} strokeWidth={0.8} />
    <path d="M-22 -46 L 22 -48" stroke={PH.blanco} strokeWidth={2} strokeDasharray="1 4" strokeLinecap="round" />
  </g>
);
/** Diadema baja de diosa con joya en la frente. */
const Diadema: React.FC<{ c?: string }> = ({ c = PH.rojo }) => <g><path d="M-26 -18 C -16 -34, 6 -40, 24 -30 L 20 -42 L 12 -38 L 6 -48 L -2 -40 L -10 -46 L -14 -36 Z" fill={PH.oro} stroke={N} strokeWidth={1.5} /><circle cx={6} cy={-38} r={3} fill={c} /><path d="M22 -28 L 26 -20" stroke={PH.oro} strokeWidth={2} /><circle cx={26} cy={-18} r={2.4} fill={c} /></g>;
/** Velo (odhni) que cubre el pelo y cae por la espalda, con borde de oro. */
const Odhni: React.FC<{ c?: string; borde?: string }> = ({ c = PH.rosa, borde = PH.oro }) => {
  const f = useCurrentFrame();
  const o = Math.sin(f / 20) * 3;
  return (
    <g>
      <path d={`M10 -36 C -6 -42, -28 -32, -34 -8 C -40 20, -44 60, ${-50 + o} 110 L ${-30 + o} 116 C -26 70, -20 30, -16 10 C -10 -10, -2 -24, 12 -30 Z`} fill={c} stroke={N} strokeWidth={1.4} opacity={0.94} />
      <path d={`M10 -36 C -6 -42, -28 -32, -34 -8 C -40 20, -44 60, ${-50 + o} 110`} stroke={borde} strokeWidth={4} fill="none" />
      <path d={`M10 -36 C -6 -42, -28 -32, -34 -8 C -40 20, -44 60, ${-50 + o} 110`} stroke={PH.blanco} strokeWidth={1.4} fill="none" strokeDasharray="1 5" strokeLinecap="round" />
    </g>
  );
};
/** Turbante (pagri) con penacho y joya (reyes y gente). */
const Pagri: React.FC<{ c?: string; penacho?: boolean; joya?: boolean }> = ({ c = PH.azafran, penacho, joya }) => (
  <g>
    <path d="M-31 0 C -38 -36, -14 -50, 8 -46 C 24 -44, 30 -34, 28 -22 C 10 -24, -14 -18, -31 0 Z" fill={c} stroke={N} strokeWidth={1.8} />
    {[-1, 0, 1].map((k) => <path key={k} d={`M${-28 + k * 3} ${-8 - k * 10} C -10 ${-30 - k * 8}, 10 ${-38 - k * 4}, 26 ${-28 - k * 4}`} stroke={N} strokeWidth={1} fill="none" opacity={0.5} />)}
    {penacho && <path d="M-6 -46 C -10 -70, 4 -84, 14 -88 C 8 -74, 6 -60, 4 -46 Z" fill={PH.blanco} stroke={N} strokeWidth={1.2} />}
    {joya && <><circle cx={8} cy={-40} r={4.4} fill={PH.rojo} stroke={PH.oro} strokeWidth={2} /><path d="M8 -36 L 8 -28" stroke={PH.blanco} strokeWidth={2} strokeDasharray="1 3" /></>}
  </g>
);
/** Moño de pelo enmarañado (jata) de ascetas y de Shiva. */
const Jata: React.FC<{ c?: string; alto?: number }> = ({ c = '#3A2A20', alto = 1 }) => (
  <g>
    <path d={`M-28 -14 C -32 ${-44 * alto}, -18 ${-78 * alto}, 0 ${-82 * alto} C 18 ${-80 * alto}, 24 ${-56 * alto}, 18 -30 C 4 -36, -14 -32, -28 -14 Z`} fill={c} stroke={N} strokeWidth={1.6} />
    {[0, 1, 2].map((k) => <path key={k} d={`M${-20 + k * 4} ${-30 - k * 14 * alto} C ${-8} ${-38 - k * 14 * alto}, ${6} ${-38 - k * 14 * alto}, ${14 - k * 2} ${-32 - k * 14 * alto}`} stroke="#6A5040" strokeWidth={2} fill="none" />)}
    <path d={`M-26 -14 C -40 10, -42 40, -36 70`} stroke={c} strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);
/** Tres líneas de ceniza (tripundra) y el tercer ojo de Shiva. */
const TercerOjo: React.FC = () => <g><EnCara>{[-25, -21, -17].map((y) => <path key={y} d={`M2 ${y} L 30 ${y - 1}`} stroke={PH.blanco} strokeWidth={1.8} opacity={0.9} />)}</EnCara><ellipse cx={23} cy={-23} rx={2.4} ry={4.8} fill={PH.blanco} stroke={N} strokeWidth={1} /><circle cx={23} cy={-23} r={1.6} fill={PH.rojo} /></g>;
/** Luna creciente en el pelo. */
const Creciente: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 10 }) => <path d={`M${x - r} ${y} A ${r} ${r} 0 1 0 ${x + r} ${y} A ${r * 0.8} ${r * 0.62} 0 1 1 ${x - r} ${y} Z`} fill={PH.blanco} stroke={N} strokeWidth={1.2} />;
/** El Ganges que brota del pelo de Shiva: un chorrito de agua que cae. */
const Ganga: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useCurrentFrame();
  return <g><path d={`M${x} ${y} C ${x + 6} ${y - 30}, ${x + 30} ${y - 30}, ${x + 34} ${y + 6}`} stroke={PH.azulClaro} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray="10 6" strokeDashoffset={-f * 1.2} /><circle cx={x + 34} cy={y + 10} r={2.4} fill={PH.azulClaro} /></g>;
};
/** Pareja de colmillitos (asuras). */
const Colmillos: React.FC = () => <path d="M27 20 l 2 8 l 3 -8 Z M21 24 l 2 7 l 3 -7 Z" fill={PH.blanco} stroke={N} strokeWidth={0.8} />;
/** Cuernitos curvos (asuras). */
const Cuernos: React.FC<{ c?: string }> = ({ c = '#EFE6CC' }) => <path d="M-12 -32 C -24 -54, -14 -70, 0 -72 C -8 -62, -8 -48, -2 -34 Z M8 -34 C 10 -56, 24 -64, 34 -60 C 24 -54, 20 -44, 18 -32 Z" fill={c} stroke={N} strokeWidth={1.4} />;
/** Bigote espeso. */
const Bigote: React.FC<{ c?: string }> = ({ c = N }) => <path d="M22 13 C 28 10, 36 12, 40 18 C 34 16, 28 16, 22 17 Z" fill={c} />;
/** Cara que mira para atrás (Brahma: la segunda de sus caras). */
const CaraAtras: React.FC<{ piel: string; barba?: string }> = ({ piel, barba = PH.blanco }) => (
  <g>
    <path d={suave([[-18, -30], [-30, -16], [-33, -6], [-42, 6], [-34, 10], [-36, 16], [-31, 22], [-20, 30], [-8, 30], [-10, -10]], true, 0.9)} fill={piel} stroke={N} strokeWidth={1.6} />
    <path d="M-34 12 C -38 30, -30 50, -16 58 C -14 44, -12 34, -12 28 Z" fill={barba} stroke={N} strokeWidth={1} />
    <path d="M-28 -6 Q -22 -10 -16 -6 Q -22 -3 -28 -6 Z" fill={PH.blanco} stroke={N} strokeWidth={1} /><circle cx={-23} cy={-6} r={1.8} fill={N} />
    <path d="M-29 -13 Q -22 -17 -15 -12" stroke={N} strokeWidth={1.4} fill="none" />
  </g>
);
/** Cabeza de elefante (Ganesha): cubre la cara del muñeco; trompa que se mece, oreja grande y un colmillo. */
const CabezaElefante: React.FC<{ piel: string; colmillo?: boolean }> = ({ piel, colmillo = true }) => {
  const f = useCurrentFrame();
  const m = Math.sin(f / 18) * 5;
  return (
    <g>
      <path d="M-14 -24 C -64 -34, -78 10, -62 50 C -50 76, -24 70, -14 46 Z" fill={piel} stroke={N} strokeWidth={1.8} />
      <path d="M-20 -14 C -56 -18, -64 14, -54 42 C -46 58, -30 56, -22 40 Z" fill={PH.rosa} opacity={0.75} />
      <path d={suave([[-36, 22], [-40, -18], [-14, -46], [22, -44], [44, -24], [52, 4], [48, 30], [26, 44], [0, 52], [-24, 48]], true)} fill={piel} stroke={N} strokeWidth={2} />
      <path d={`M40 14 C 58 30, ${60 + m} 62, ${48 + m} 92 C ${44 + m} 104, ${56 + m * 1.2} 112, ${64 + m * 1.2} 104`} stroke={N} strokeWidth={24} fill="none" strokeLinecap="round" />
      <path d={`M40 14 C 58 30, ${60 + m} 62, ${48 + m} 92 C ${44 + m} 104, ${56 + m * 1.2} 112, ${64 + m * 1.2} 104`} stroke={piel} strokeWidth={20} fill="none" strokeLinecap="round" />
      {[40, 54, 68, 82].map((y, i) => <path key={i} d={`M${50 + m * (y / 100) - 8} ${y} q 8 3 16 0`} stroke={N} strokeWidth={1} fill="none" opacity={0.5} />)}
      {colmillo && <path d="M30 30 C 42 40, 54 42, 64 38 C 54 34, 44 30, 36 24 Z" fill={PH.blanco} stroke={N} strokeWidth={1.3} />}
      <path d="M14 -12 Q 22 -18 30 -12 Q 22 -7 14 -12 Z" fill={PH.blanco} stroke={N} strokeWidth={1.1} /><circle cx={23} cy={-12} r={2.6} fill={N} />
      <path d="M29 -12 Q 34 -14 38 -17" stroke={N} strokeWidth={1.6} fill="none" />
      <path d="M8 -24 L 34 -26" stroke={PH.rojo} strokeWidth={3} /><circle cx={22} cy={-32} r={3} fill={PH.rojo} />
    </g>
  );
};
/** Cabeza de león (Narasimha): melena en llamas, hocico con colmillos. */
const CabezaLeon: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <path d={Array.from({ length: 13 }, (_, i) => { const a = -2.9 + i * 0.4, r = 64 + (i % 2 ? 0 : 16) + Math.sin(f / 8 + i) * 2; return `${i ? 'L' : 'M'} ${r1(-6 + Math.cos(a) * r)} ${r1(8 + Math.sin(a) * r)}`; }).join(' ') + ' Z'} fill="#B8742A" stroke={N} strokeWidth={1.8} />
      <path d={suave([[-30, 20], [-34, -20], [-10, -42], [20, -38], [38, -22], [56, -8], [60, 8], [52, 20], [56, 30], [40, 38], [10, 46], [-20, 42]], true)} fill="#E8A33A" stroke={N} strokeWidth={2} />
      <path d="M44 22 C 50 24, 56 28, 56 32 L 34 36 Z" fill={PH.rojoOsc} />
      <path d="M40 24 l 3 9 l 4 -9 Z M50 25 l 2 8 l 3 -8 Z" fill={PH.blanco} stroke={N} strokeWidth={0.8} />
      <circle cx={58} cy={4} r={4.4} fill={N} />
      <path d="M14 -14 Q 24 -22 34 -14 Q 24 -8 14 -14 Z" fill={PH.amarillo} stroke={N} strokeWidth={1.2} /><circle cx={25} cy={-14} r={2.8} fill={N} />
      <path d="M12 -22 Q 24 -32 36 -22" stroke={N} strokeWidth={3} fill="none" />
      {[0, 1, 2].map((k) => <path key={k} d={`M${40 - k * 3} ${10 + k * 4} l -14 ${-2 + k * 2}`} stroke={N} strokeWidth={1} opacity={0.6} />)}
    </g>
  );
};
/** Cabeza de jabalí (Varaha). */
const CabezaJabali: React.FC<{ piel: string }> = ({ piel }) => (
  <g>
    <path d={suave([[-30, 30], [-34, -18], [-8, -40], [22, -34], [46, -18], [66, 0], [70, 14], [60, 22], [30, 40], [0, 48]], true)} fill={piel} stroke={N} strokeWidth={2} />
    <path d="M-4 -40 L -12 -58 L 8 -42 Z" fill={piel} stroke={N} strokeWidth={1.6} />
    <ellipse cx={68} cy={10} rx={5} ry={8} fill={PH.rosaOsc} stroke={N} strokeWidth={1.2} />
    <path d="M50 22 C 58 18, 62 6, 58 -6 C 64 6, 66 18, 56 26 Z" fill={PH.blanco} stroke={N} strokeWidth={1.2} />
    <path d="M18 -14 Q 26 -20 34 -14 Q 26 -9 18 -14 Z" fill={PH.blanco} stroke={N} strokeWidth={1.1} /><circle cx={27} cy={-14} r={2.4} fill={N} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-26 + i * 8} ${-30 - (i < 3 ? i * 3 : (5 - i) * 3)} l 2 -12`} stroke={N} strokeWidth={2.4} />)}
  </g>
);
/** Cabeza de cabra (Daksha después del sacrificio). */
const CabezaCabra: React.FC = () => (
  <g>
    <path d={suave([[-28, 28], [-30, -14], [-6, -36], [20, -30], [40, -12], [54, 10], [50, 22], [30, 30], [8, 46], [-14, 46]], true)} fill="#E9DCC4" stroke={N} strokeWidth={2} />
    <path d="M-6 -34 C -20 -60, -40 -60, -48 -40 C -36 -50, -24 -44, -18 -30 Z" fill="#8A7A5A" stroke={N} strokeWidth={1.4} />
    <path d="M-24 -6 C -44 -2, -50 10, -46 20 C -38 10, -30 8, -22 8 Z" fill="#D9C8A8" stroke={N} strokeWidth={1.2} />
    <path d="M36 28 C 34 44, 28 56, 20 62 C 22 48, 24 38, 24 30 Z" fill="#CBB894" stroke={N} strokeWidth={1.1} />
    <path d="M16 -10 Q 24 -15 32 -10 Q 24 -6 16 -10 Z" fill={PH.amarillo} stroke={N} strokeWidth={1} /><path d="M21 -10 h 6" stroke={N} strokeWidth={2} />
    <circle cx={50} cy={10} r={2.2} fill={N} />
  </g>
);
/** Cabeza de águila (Garuda): pico ganchudo rojo y cresta. */
const CabezaGaruda: React.FC = () => (
  <g>
    <path d={suave([[-30, 24], [-32, -20], [-8, -40], [20, -34], [36, -18], [40, -2], [30, 24], [4, 46], [-18, 44]], true)} fill="#E9C77A" stroke={N} strokeWidth={2} />
    <path d="M30 -16 C 52 -18, 66 -4, 64 16 C 60 26, 54 26, 50 18 C 52 10, 46 4, 34 6 Z" fill={PH.rojo} stroke={N} strokeWidth={1.8} />
    <path d="M34 6 C 42 8, 48 12, 50 18" stroke={N} strokeWidth={1.2} fill="none" />
    <path d="M14 -12 Q 22 -18 30 -12 Q 22 -6 14 -12 Z" fill={PH.blanco} stroke={N} strokeWidth={1.1} /><circle cx={23} cy={-12} r={2.6} fill={N} />
    {[0, 1, 2, 3].map((k) => <path key={k} d={`M${-20 + k * 10} -36 C ${-24 + k * 10} -56, ${-14 + k * 10} -66, ${-4 + k * 10} -70 C ${-8 + k * 10} -56, ${-10 + k * 10} -46, ${-8 + k * 10} -36 Z`} fill={k % 2 ? PH.verde : PH.rojo} stroke={N} strokeWidth={1} />)}
  </g>
);

// ---------- piezas de cuerpo (coordenadas del cuerpo: hombros y≈-292, cintura -212, pies 0) ----------
/** Halo dorado de las miniaturas detrás de la cabeza (va en `detras`). */
const Halo: React.FC<{ r?: number; c?: string }> = ({ r = 66, c = PH.amarillo }) => {
  const f = useCurrentFrame();
  return <g><circle cx={22} cy={-344} r={r + Math.sin(f / 24) * 1.5} fill={c} opacity={0.5} /><circle cx={22} cy={-344} r={r} fill="none" stroke={PH.oro} strokeWidth={3} /><circle cx={22} cy={-344} r={r - 6} fill="none" stroke={PH.rojo} strokeWidth={1.2} opacity={0.6} /></g>;
};
/** Halo de rayos (Surya). */
const HaloSol: React.FC = () => {
  const f = useCurrentFrame();
  return <g transform={`translate(22 -344) rotate(${r1(f * 0.3)})`}>{Array.from({ length: 16 }, (_, i) => <path key={i} transform={`rotate(${i * 22.5})`} d="M-9 -60 L 0 -92 L 9 -60 Z" fill={i % 2 ? PH.rojo : PH.azafran} stroke={N} strokeWidth={1} />)}<circle r={62} fill={PH.amarillo} stroke={PH.oro} strokeWidth={3} opacity={0.85} /></g>;
};
/** Media luna grande detrás (Chandra). */
const HaloLuna: React.FC = () => <g transform="translate(22 -344)"><circle r={66} fill="#F2F0E4" opacity={0.35} /><path d="M-64 -10 A 66 66 0 1 0 40 -52 A 54 54 0 1 1 -64 -10 Z" fill="#F2F0E4" stroke={N} strokeWidth={1.4} /></g>;
/** Guirnalda larga de flores (vanamala) que cae por delante. */
const Vanamala: React.FC<{ c?: string }> = ({ c = PH.verde }) => {
  const d = 'M-18 -298 C 10 -250, 40 -190, 36 -130 C 34 -110, 22 -104, 20 -130 C 16 -190, 30 -250, 30 -296';
  return <g><path d={d} stroke={N} strokeWidth={9} fill="none" /><path d={d} stroke={c} strokeWidth={6.5} fill="none" />{[[4, -266], [24, -214], [34, -160], [28, -122], [22, -170], [24, -232]].map(([x, y], i) => <Florcita key={i} x={x} y={y} r={5} c={i % 2 ? PH.blanco : PH.rosa} />)}</g>;
};
/** Collar de oro con perlas y joya al centro (kaustubha en Vishnu). */
const Collar: React.FC<{ joya?: string }> = ({ joya = PH.rojo }) => <g><path d="M-22 -300 Q 6 -276 32 -296" stroke={PH.oro} strokeWidth={5} fill="none" /><path d="M-18 -296 Q 6 -268 30 -290" stroke={PH.blanco} strokeWidth={2.4} strokeDasharray="1 4" strokeLinecap="round" fill="none" /><circle cx={8} cy={-279} r={5} fill={joya} stroke={PH.oro} strokeWidth={2} /></g>;
/** Cordón sagrado (yajnopavita) cruzado, de brahmanes y ascetas. */
const Cordon: React.FC = () => <path d="M-18 -298 C 0 -270, 20 -240, 30 -214" stroke={PH.blanco} strokeWidth={2.4} fill="none" />;
/** Cuentas de rudraksha. */
const Rudraksha: React.FC = () => <g>{Array.from({ length: 9 }, (_, i) => { const t = i / 8, x = -20 + t * 50, y = -298 + Math.sin(t * Math.PI) * 26; return <circle key={i} cx={x} cy={y} r={3.6} fill="#7A3A22" stroke={N} strokeWidth={0.8} />; })}</g>;
/** Faja (patka) que cae por delante de la cintura. */
const Patka: React.FC<{ c?: string }> = ({ c = PH.rojo }) => {
  const f = useCurrentFrame();
  const o = Math.sin(f / 16) * 3;
  return <g><path d="M-28 -220 L 28 -222 L 28 -208 L -28 -206 Z" fill={c} stroke={N} strokeWidth={1.2} /><path d={`M18 -210 C 22 -180, ${24 + o} -150, ${26 + o} -120 L ${36 + o} -122 C ${34 + o} -150, 32 -180, 28 -210 Z`} fill={c} stroke={N} strokeWidth={1.2} /><path d={`M${22 + o} -128 l 12 -1`} stroke={PH.oro} strokeWidth={3} /></g>;
};
/** Piel de tigre (Shiva): rayas sobre la falda corta. */
const RayasTigre: React.FC = () => <g>{[[-20, -208, -24, -170], [-6, -210, -10, -160], [8, -210, 10, -162], [22, -208, 30, -168], [34, -196, 42, -164]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} Q ${(a + c) / 2 + 5} ${(b + d) / 2} ${c} ${d}`} stroke={N} strokeWidth={4} fill="none" strokeLinecap="round" />)}</g>;
/** Cobra enroscada al cuello, con la capucha junto al hombro de atrás (Shiva). */
const CobraCuello: React.FC = () => {
  const f = useCurrentFrame();
  const o = Math.sin(f / 14) * 2;
  return (
    <g>
      <path d="M-26 -292 C -10 -278, 18 -278, 32 -290" stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M-26 -292 C -10 -278, 18 -278, 32 -290" stroke={PH.verde} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={`M-26 -292 C -40 -300, -44 -318, ${-40 + o} -334`} stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d={`M-26 -292 C -40 -300, -44 -318, ${-40 + o} -334`} stroke={PH.verde} strokeWidth={7} fill="none" strokeLinecap="round" />
      <g transform={`translate(${-40 + o} -344)`}><path d="M-12 8 C -16 -8, -8 -18, 0 -18 C 8 -18, 16 -8, 12 8 Z" fill={PH.verde} stroke={N} strokeWidth={1.4} /><path d="M-5 -6 q 5 4 10 0" stroke={PH.amarillo} strokeWidth={1.6} fill="none" /><circle cx={3} cy={-12} r={1.4} fill={N} /></g>
    </g>
  );
};
/** Alas de Garuda detrás de la espalda (se mecen). */
const AlasGaruda: React.FC = () => {
  const f = useCurrentFrame();
  const a = Math.sin(f / 10) * 6;
  return <g transform={`rotate(${r1(a)} -10 -280)`}>{[0, 1].map((k) => <path key={k} transform={`translate(${-k * 14} ${k * 10})`} d="M-10 -280 C -60 -360, -140 -400, -200 -390 C -170 -370, -170 -350, -180 -330 C -150 -340, -140 -320, -150 -300 C -120 -310, -100 -296, -100 -276 C -70 -280, -40 -270, -10 -250 Z" fill={k ? PH.verde : PH.rojo} stroke={N} strokeWidth={2} />)}{[0, 1, 2].map((k) => <path key={k} d={`M-30 ${-282 + k * 8} L ${-150 + k * 20} ${-360 + k * 22}`} stroke={PH.oro} strokeWidth={2} />)}</g>;
};

// ---------- atributos en la mano (origen = la mano) ----------
/** Disco de Vishnu (Sudarshana chakra): gira y brilla. */
export const Chakra: React.FC<{ r?: number }> = ({ r = 20 }) => {
  const f = useCurrentFrame();
  return <g transform={`translate(0 ${-r - 6})`}><circle r={r * 1.7} fill="url(#halo)" opacity={0.6} /><g transform={`rotate(${r1(f * 6)})`}>{Array.from({ length: 12 }, (_, i) => <path key={i} transform={`rotate(${i * 30})`} d={`M${-r * 0.18} ${-r * 0.95} L 0 ${-r * 1.35} L ${r * 0.18} ${-r * 0.95} Z`} fill={PH.azafran} stroke={N} strokeWidth={0.8} />)}<circle r={r} fill={PH.oro} stroke={N} strokeWidth={1.6} /><circle r={r * 0.62} fill="none" stroke={PH.rojo} strokeWidth={2} />{Array.from({ length: 8 }, (_, i) => <path key={i} transform={`rotate(${i * 22.5})`} d={`M0 ${-r * 0.6} V ${r * 0.6}`} stroke={N} strokeWidth={1.2} />)}<circle r={r * 0.2} fill={PH.rojo} stroke={N} strokeWidth={1} /></g></g>;
};
/** Caracola (shankha). */
const Shankha: React.FC = () => <g transform="translate(0 -18) rotate(-20)"><path d="M-16 10 C -22 -8, -8 -26, 8 -24 C 20 -22, 22 -6, 12 6 C 6 14, -6 18, -16 10 Z" fill={PH.blanco} stroke={N} strokeWidth={1.6} /><path d="M8 -24 C 0 -12, 2 0, 12 6 M-4 -22 C -10 -8, -6 8, 4 12" stroke={PH.rosa} strokeWidth={1.8} fill="none" /><path d="M-16 10 L -24 18" stroke={N} strokeWidth={2.4} /></g>;
/** Maza de oro (gada). */
const Gada: React.FC = () => <g><path d="M0 46 L 0 -100" stroke={N} strokeWidth={8} /><path d="M0 46 L 0 -100" stroke={PH.oro} strokeWidth={5} /><circle cx={0} cy={-112} r={17} fill={PH.oro} stroke={N} strokeWidth={1.8} />{[-8, 0, 8].map((x) => <path key={x} d={`M${x} -126 V -98`} stroke={PH.oroOsc} strokeWidth={1.6} />)}<circle cx={0} cy={-132} r={4} fill={PH.rojo} stroke={N} strokeWidth={1} /></g>;
/** Loto rosa en la mano (padma). */
const Padma: React.FC<{ s?: number }> = ({ s = 1 }) => <g transform={`scale(${s})`}><path d="M0 10 C 2 -6, 0 -16, 2 -24" stroke={PH.verde} strokeWidth={3} fill="none" />{[-50, -25, 0, 25, 50].map((a, i) => <path key={i} transform={`translate(2 -24) rotate(${a})`} d="M0 0 C -8 -8, -6 -22, 0 -28 C 6 -22, 8 -8, 0 0 Z" fill={i === 2 ? PH.rosa : '#F2B8C2'} stroke={N} strokeWidth={1} />)}<circle cx={2} cy={-26} r={3} fill={PH.amarillo} /></g>;
/** Tridente de Shiva (trishula) con el tamborcito (damaru) atado. */
const Trishula: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g transform="rotate(-4)">
      <path d="M0 110 L 0 -170" stroke={N} strokeWidth={7} /><path d="M0 110 L 0 -170" stroke="#C9C2B0" strokeWidth={4} />
      <path d="M-26 -166 C -26 -190, -20 -204, -16 -214 C -16 -196, -10 -180, 0 -172 C 10 -180, 16 -196, 16 -214 C 20 -204, 26 -190, 26 -166 C 18 -160, 8 -160, 0 -164 C -8 -160, -18 -160, -26 -166 Z M-5 -172 L 0 -234 L 5 -172 Z" fill="#D8D2C0" stroke={N} strokeWidth={1.8} />
      <g transform={`translate(0 -150) rotate(${r1(Math.sin(f / 9) * 10)})`}><path d="M-12 -12 L 12 -12 L 3 0 L 12 12 L -12 12 L -3 0 Z" fill={PH.azafran} stroke={N} strokeWidth={1.3} /><path d="M12 0 q 14 6 10 22" stroke={PH.rojo} strokeWidth={2} fill="none" /></g>
    </g>
  );
};
/** Manuscrito de hojas de palma atado (los Vedas). */
const Pothi: React.FC = () => <g transform="translate(0 -6) rotate(-10)"><rect x={-26} y={-9} width={52} height={18} rx={3} fill={PH.crema2} stroke={N} strokeWidth={1.4} /><path d="M-26 -3 H 26 M-26 3 H 26" stroke={PH.oroOsc} strokeWidth={0.8} /><rect x={-5} y={-11} width={10} height={22} fill={PH.rojo} stroke={N} strokeWidth={1} /></g>;
/** Vasija de agua del asceta (kamandalu). */
const Kamandalu: React.FC = () => <g transform="translate(0 18)"><path d="M-14 -6 C -20 14, 20 14, 14 -6 C 10 -14, -10 -14, -14 -6 Z" fill="#B8742A" stroke={N} strokeWidth={1.4} /><path d="M14 -2 C 22 -6, 26 -12, 30 -18" stroke={N} strokeWidth={3} fill="none" /><path d="M-8 -12 C -6 -26, 6 -26, 8 -12" stroke={N} strokeWidth={2} fill="none" /></g>;
/** Vasija de oro del néctar (amrita kalasha), con brillo. */
export const Kalasha: React.FC<{ s?: number; brillo?: boolean }> = ({ s = 1, brillo = true }) => {
  const f = useCurrentFrame();
  return <g transform={`scale(${s})`}>{brillo && <circle cx={0} cy={-26} r={46 + Math.sin(f / 6) * 4} fill="url(#halo)" opacity={0.8} />}<path d="M-20 -8 C -28 -30, -14 -44, -8 -46 L -10 -52 L 10 -52 L 8 -46 C 14 -44, 28 -30, 20 -8 C 14 2, -14 2, -20 -8 Z" fill={PH.oro} stroke={N} strokeWidth={1.6} /><path d="M-22 -24 H 22" stroke={PH.rojo} strokeWidth={3} /><path d="M-10 -52 C -14 -64, -4 -70, 0 -60 C 4 -70, 14 -64, 10 -52 Z" fill={PH.verde} stroke={N} strokeWidth={1} /><circle cx={0} cy={-66} r={3.5} fill={PH.blanco} /></g>;
};
/** Arco de caña de azúcar con flecha de flores (Kama). */
const ArcoFlores: React.FC = () => <g><path d="M-6 -110 C 40 -60, 40 50, -6 100" stroke={N} strokeWidth={7} fill="none" /><path d="M-6 -110 C 40 -60, 40 50, -6 100" stroke={PH.verdeClaro} strokeWidth={4} fill="none" strokeDasharray="14 3" /><path d="M-6 -110 L -6 100" stroke={PH.rosa} strokeWidth={1.6} strokeDasharray="2 3" /><path d="M-30 -4 L 44 -4" stroke="#8A6A3A" strokeWidth={2.4} /><Florcita x={48} y={-4} r={8} c={PH.rosa} /></g>;
/** Hacha (parashu). */
const Parashu: React.FC = () => <g><path d="M0 40 L 0 -80" stroke="#7A5030" strokeWidth={5} /><path d="M0 -76 C 18 -86, 30 -76, 30 -60 C 22 -64, 12 -62, 0 -58 Z" fill="#C9C2B0" stroke={N} strokeWidth={1.4} /></g>;
/** Cuenco con dulces (modaka) de Ganesha. */
const Modakas: React.FC = () => <g transform="translate(6 -4)"><path d="M-18 0 C -16 12, 16 12, 18 0 Z" fill={PH.oro} stroke={N} strokeWidth={1.3} />{[-9, 0, 9].map((x, i) => <path key={i} d={`M${x - 6} 0 C ${x - 6} -10, ${x} -16, ${x} -16 C ${x} -16, ${x + 6} -10, ${x + 6} 0 Z`} fill={PH.blanco} stroke={N} strokeWidth={0.9} />)}</g>;
/** Lazo (pasha). */
const Pasha: React.FC = () => <g><path d="M0 0 C -20 -10, -22 -34, 0 -36 C 22 -34, 20 -10, 0 0 C -6 12, -4 24, 2 34" stroke={PH.rojo} strokeWidth={3.4} fill="none" /></g>;
/** Espada curva (khadga) y escudo redondo (dhal). */
const Khadga: React.FC = () => <g transform="rotate(-10)"><path d="M0 14 L 0 -6 M-10 -6 H 10" stroke={PH.oro} strokeWidth={4} /><path d="M-3 -6 C -6 -50, 4 -86, 14 -110 C 10 -80, 6 -44, 4 -6 Z" fill="#D8D2C0" stroke={N} strokeWidth={1.4} /></g>;
const Dhal: React.FC = () => <g transform="translate(-4 4)"><circle r={30} fill="#4A3A2A" stroke={PH.oro} strokeWidth={3} />{[0, 90, 180, 270].map((a) => <circle key={a} transform={`rotate(${a + 45})`} cx={0} cy={-14} r={4} fill={PH.oro} stroke={N} strokeWidth={0.8} />)}<circle r={5} fill={PH.oro} /></g>;
/** Rayo de Indra (vajra): doble punta de oro. */
const Vajra: React.FC = () => {
  const f = useCurrentFrame();
  return <g transform="translate(0 -10)"><circle r={30} fill="url(#halo)" opacity={0.4 + Math.sin(f / 5) * 0.2} />{[1, -1].map((k) => <g key={k} transform={`scale(1 ${k})`}><path d="M-4 -8 C -14 -20, -14 -34, -6 -44 L 0 -56 L 6 -44 C 14 -34, 14 -20, 4 -8 Z" fill={PH.oro} stroke={N} strokeWidth={1.4} /><path d="M0 -8 V -52" stroke={PH.oroOsc} strokeWidth={1.4} /></g>)}<rect x={-7} y={-8} width={14} height={16} rx={4} fill={PH.rojo} stroke={N} strokeWidth={1.2} /></g>;
};
/** Laúd (vina) de Narada / Saraswati. */
const Vina: React.FC = () => <g transform="rotate(-50)"><path d="M-70 0 H 70" stroke="#7A4A2A" strokeWidth={6} /><circle cx={-60} cy={10} r={16} fill="#B8742A" stroke={N} strokeWidth={1.4} /><circle cx={56} cy={10} r={13} fill="#B8742A" stroke={N} strokeWidth={1.4} />{[-1, 1].map((k) => <path key={k} d={`M-70 ${k * 1.5} H 70`} stroke={PH.blanco} strokeWidth={0.7} />)}</g>;
/** Sombrilla (chhatra) del brahmán enano. */
const Chhatra: React.FC = () => <g><path d="M0 40 L 0 -120" stroke="#7A5030" strokeWidth={4} /><path d="M-44 -104 C -40 -140, 40 -140, 44 -104 C 30 -112, 14 -112, 0 -106 C -14 -112, -30 -112, -44 -104 Z" fill={PH.amarillo} stroke={N} strokeWidth={1.6} /><path d="M-44 -104 C -30 -112, -14 -112, 0 -106 C 14 -112, 30 -112, 44 -104" stroke={PH.rojo} strokeWidth={3} fill="none" /></g>;
/** Garras (Narasimha): uñas largas. */
const Garras: React.FC = () => <g>{[-8, -2, 4, 10].map((x, i) => <path key={i} d={`M${x} 4 q 4 10 -2 16`} stroke={PH.blanco} strokeWidth={3} fill="none" strokeLinecap="round" />)}</g>;
/** Cayado del asceta. */
const Danda: React.FC = () => <g><path d="M0 110 L 0 -150" stroke="#7A5030" strokeWidth={6} /><path d="M-4 -150 h 8" stroke={PH.oro} strokeWidth={4} /></g>;
/** Rosario (mala). */
const Mala: React.FC = () => <g>{Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 12} cy={14 + Math.sin(a) * 18} r={3} fill="#7A3A22" stroke={N} strokeWidth={0.6} />; })}</g>;
/** Arco simple. */
const Arco: React.FC = () => <g><path d="M-4 -100 C 34 -60, 34 50, -4 90" stroke="#7A4A2A" strokeWidth={6} fill="none" /><path d="M-4 -100 L -4 90" stroke={PH.blanco} strokeWidth={1.4} /></g>;

/** Dos brazos más detrás de la espalda (dioses de cuatro brazos), cada uno con su atributo; se mecen apenas. */
const BrazosExtra: React.FC<{ piel: string; arriba?: React.ReactNode; atras?: React.ReactNode }> = ({ piel, arriba, atras }) => {
  const f = useCurrentFrame();
  const m = Math.sin(f / 22) * 4;
  const a: P[] = [[-2, -288], [-48, -320 + m], [-54, -380 + m]];
  const b: P[] = [[0, -280], [-64, -262 - m], [-104, -292 - m]];
  const brazo = (pts: P[]) => <><path d={miembro(pts, [22, 17, 13])} fill={piel} stroke={N} strokeWidth={2} /><circle cx={pts[2][0]} cy={pts[2][1]} r={9} fill={piel} stroke={N} strokeWidth={1.6} /><path d={`M${r1(pts[2][0] - 7)} ${r1(pts[2][1] + 10)} q 7 4 14 0`} stroke={PH.oro} strokeWidth={3} fill="none" /></>;
  return (
    <g>
      {brazo(b)}
      <g transform={`translate(${r1(b[2][0])} ${r1(b[2][1])})`}>{atras}</g>
      {brazo(a)}
      <g transform={`translate(${r1(a[2][0])} ${r1(a[2][1])})`}>{arriba}</g>
    </g>
  );
};

// ---------- criaturas (dibujo propio; origen = pies en el suelo, mirando a la derecha) ----------
const ojo = (x: number, y: number, r = 5) => <g><path d={`M${x - r * 1.6} ${y} Q ${x} ${y - r * 1.4} ${x + r * 1.6} ${y} Q ${x} ${y + r} ${x - r * 1.6} ${y} Z`} fill={PH.blanco} stroke={N} strokeWidth={1.2} /><circle cx={x + r * 0.3} cy={y} r={r * 0.55} fill={N} /></g>;

/** Elefante (Airavata blanco con gualdrapa, o elefante común gris). */
const Elefante: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#F1EDE4', ...resto }) => {
  const gualdrapa = resto.gualdrapa !== false, colmillos = (resto.colmillos as number) ?? 2;
  const fase = moviendo ? f * 0.16 : 0, amp = moviendo ? 14 : 0;
  const pata = (cx: number, ph: number) => { const a = Math.sin(fase + ph) * amp; return <path d={miembro([[cx, -150], [cx + Math.sin((a * Math.PI) / 180) * 70, -74], [cx + Math.sin((a * Math.PI) / 180) * 90, 0]], [52, 44, 46])} fill={color} stroke={N} strokeWidth={2.2} />; };
  const tr = Math.sin(f / 16) * 8;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {pata(-110, Math.PI)}{pata(70, 0)}
      <path d={suave([[-170, -140], [-150, -230], [-40, -270], [80, -260], [150, -220], [170, -150], [130, -110], [-130, -104]], true)} fill={color} stroke={N} strokeWidth={2.6} />
      <path d="M-170 -150 C -186 -130, -190 -100, -184 -80" stroke={N} strokeWidth={6} fill="none" />
      {gualdrapa && <g><path d="M-90 -250 L 60 -254 L 70 -150 C 20 -136, -60 -136, -100 -150 Z" fill={PH.rojo} stroke={N} strokeWidth={2} /><path d="M-100 -150 C -60 -136, 20 -136, 70 -150" stroke={PH.oro} strokeWidth={6} fill="none" />{[-70, -30, 10, 50].map((cx) => <Florcita key={cx} x={cx} y={-200} r={8} c={PH.amarillo} centro={PH.verde} />)}<path d="M-90 -250 L 60 -254" stroke={PH.oro} strokeWidth={5} /></g>}
      {pata(-80, 0)}{pata(100, Math.PI)}
      <g transform="translate(150 -210)">
        <path d={suave([[-30, -40], [10, -76], [60, -60], [80, -20], [70, 30], [40, 50], [0, 40], [-30, 10]], true)} fill={color} stroke={N} strokeWidth={2.4} />
        <path d={`M70 20 C 90 60, ${90 + tr} 120, ${76 + tr} 170 C ${72 + tr} 186, ${86 + tr} 192, ${92 + tr} 180`} stroke={N} strokeWidth={30} fill="none" strokeLinecap="round" />
        <path d={`M70 20 C 90 60, ${90 + tr} 120, ${76 + tr} 170 C ${72 + tr} 186, ${86 + tr} 192, ${92 + tr} 180`} stroke={color} strokeWidth={25} fill="none" strokeLinecap="round" />
        {colmillos > 0 && <path d="M56 40 C 76 64, 100 70, 116 60 C 98 56, 80 48, 64 30 Z" fill={PH.blanco} stroke={N} strokeWidth={1.6} />}
        {colmillos > 2 && <path d="M50 46 C 64 80, 88 90, 102 84 C 86 76, 70 64, 58 42 Z" fill={PH.blanco} stroke={N} strokeWidth={1.4} />}
        <path d="M-6 -50 C -60 -60, -70 0, -50 40 C -30 60, 0 40, 6 10 Z" fill={color} stroke={N} strokeWidth={2.2} />
        {gualdrapa && <><path d="M-10 -66 C 20 -84, 54 -76, 70 -54 L 40 -40 C 30 -56, 10 -60, -10 -50 Z" fill={PH.oro} stroke={N} strokeWidth={1.6} /><circle cx={34} cy={-62} r={5} fill={PH.rojo} stroke={N} strokeWidth={1} /></>}
        {ojo(44, -26, 5)}
      </g>
      <path d={`M-170 -130 C -190 -110, ${-196 + tr * 0.3} -80, -192 -60`} stroke={N} strokeWidth={4} fill="none" />
    </g>
  );
};
/** Tortuga gigante (Kurma): caparazón de oro y verde con dibujo de hexágonos. */
const Tortuga: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#5E8C5A' }) => {
  const fase = moviendo ? f * 0.12 : 0;
  const pata = (cx: number, ph: number) => <ellipse cx={cx + Math.sin(fase + ph) * 10} cy={-16} rx={30} ry={18} fill={color} stroke={N} strokeWidth={2} />;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {pata(-120, 0)}{pata(110, Math.PI)}
      <path d="M-200 -30 C -190 -170, 190 -170, 200 -30 Z" fill={PH.oro} stroke={N} strokeWidth={3} />
      <path d="M-176 -36 C -166 -150, 166 -150, 176 -36 Z" fill={color} stroke={N} strokeWidth={2} />
      {[[-110, -70], [-40, -100], [40, -100], [110, -70], [0, -60], [-80, -50], [80, -50]].map(([cx, cy], i) => <path key={i} d={`M${cx - 24} ${cy} l 12 -18 h 24 l 12 18 l -12 18 h -24 Z`} fill="none" stroke={PH.amarillo} strokeWidth={2.4} />)}
      <path d="M-206 -28 H 206" stroke={N} strokeWidth={4} />
      <path d="M-210 -34 C -230 -40, -240 -30, -236 -20" stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" />
      <g transform={`translate(200 -40) rotate(${r1(Math.sin(f / 20) * 4)})`}><path d={suave([[-10, 10], [10, -20], [50, -30], [80, -16], [84, 4], [60, 14], [20, 18]], true)} fill={color} stroke={N} strokeWidth={2.2} />{ojo(56, -12, 4.5)}<path d="M70 6 l 12 0" stroke={N} strokeWidth={1.4} /></g>
      {pata(-60, Math.PI)}{pata(160, 0)}
    </g>
  );
};
/** Pez (Matsya): escamas de oro y un cuerno en la cabeza; de chiquito no tiene cuerno a la vista. */
const PezCuerno: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, color = '#E8A33A', ...resto }) => {
  const cuerno = resto.cuerno !== false;
  const c = Math.sin(f / 7) * 10;
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 14) * 6}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-110 -60 L ${-170} ${-110 + c} L -150 -60 L ${-170} ${-10 + c} Z`} fill={PH.rojo} stroke={N} strokeWidth={2} />
      <path d={suave([[-120, -60], [-60, -104], [40, -110], [110, -80], [134, -60], [110, -36], [40, -14], [-60, -18]], true)} fill={color} stroke={N} strokeWidth={2.6} />
      {Array.from({ length: 14 }, (_, i) => { const cx = -70 + (i % 7) * 24, cy = -84 + Math.floor(i / 7) * 34; return <path key={i} d={`M${cx - 10} ${cy} q 10 12 20 0`} stroke={PH.oroOsc} strokeWidth={2} fill="none" />; })}
      <path d="M-20 -104 C 0 -140, 40 -140, 50 -108 Z" fill={PH.rojo} stroke={N} strokeWidth={1.8} />
      <path d="M-10 -20 C 0 6, 30 6, 40 -18 Z" fill={PH.rojo} stroke={N} strokeWidth={1.4} />
      {ojo(96, -74, 6)}
      <path d="M120 -50 q 8 -2 14 -10" stroke={N} strokeWidth={1.6} fill="none" />
      {cuerno && <path d="M86 -100 C 92 -130, 104 -150, 120 -160 C 116 -140, 108 -120, 100 -96 Z" fill={PH.oro} stroke={N} strokeWidth={1.8} />}
    </g>
  );
};
/** Serpiente naga (cobra con capucha y joya): `cabezas` 1 (Vasuki) o 5/7 (Shesha). Erguida en el suelo. */
const Naga: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, color = '#3E7D4A', ...resto }) => {
  const panza = (resto.panza as string) ?? '#E9C77A', cabezas = (resto.cabezas as number) ?? 1, largo = (resto.largo as number) ?? 1;
  const n = cabezas as number, L = largo as number;
  const o = Math.sin(f / 16) * 6;
  const cuerpo = `M${-200 * L} -10 C ${-140 * L} -50, ${-80 * L} 20, ${-20 * L} -20 C 20 -50, 20 -120, 0 -200`;
  const cap = (dx: number, dy: number, ang: number, k: number) => (
    <g key={k} transform={`translate(${r1(dx)} ${r1(dy)}) rotate(${r1(ang)})`}>
      <path d="M0 40 C -40 30, -44 -20, -20 -44 C -10 -54, 10 -54, 20 -44 C 44 -20, 40 30, 0 40 Z" fill={color} stroke={N} strokeWidth={2} />
      <path d="M0 30 C -22 22, -24 -10, -10 -26 C -4 -32, 4 -32, 10 -26 C 24 -10, 22 22, 0 30 Z" fill={panza} opacity={0.85} />
      <path d="M-10 -8 a 5 5 0 1 0 0.1 0 M10 -8 a 5 5 0 1 0 0.1 0" stroke={N} strokeWidth={1.6} fill="none" />
      <path d="M-12 -46 C -6 -60, 6 -60, 12 -46 C 6 -50, -6 -50, -12 -46 Z" fill={color} stroke={N} strokeWidth={1.4} />
      <circle cx={-5} cy={-48} r={1.8} fill={N} /><circle cx={5} cy={-48} r={1.8} fill={N} />
      <circle cx={0} cy={-60} r={4} fill={PH.rojo} stroke={PH.oro} strokeWidth={1.6} />
      <path d={`M0 -56 l 0 -2`} stroke={PH.rojo} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={cuerpo} stroke={N} strokeWidth={48} fill="none" strokeLinecap="round" />
      <path d={cuerpo} stroke={color} strokeWidth={42} fill="none" strokeLinecap="round" />
      <path d={cuerpo} stroke={panza} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="10 8" transform="translate(4 6)" opacity={0.8} />
      <g transform={`translate(0 -220) rotate(${r1(o * 0.4)})`}>
        {n === 1 ? cap(0, 0, 0, 0) : Array.from({ length: n }, (_, i) => { const a = -75 + (i * 150) / (n - 1); return <g key={i} transform="scale(0.8)">{cap(Math.sin((a * Math.PI) / 180) * 140, -Math.cos((a * Math.PI) / 180) * 90 + 60, a * 0.7, i)}</g>; })}
      </g>
    </g>
  );
};
/** Cabeza de Rahu sola, flotando con una cola de humo: persigue al Sol y a la Luna. */
const CabezaRahu: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, boca }) => {
  const o = Math.sin(f / 10) * 8;
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 12) * 10}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {[0, 1, 2].map((k) => <path key={k} d={`M-30 ${-10 + k * 14} C -90 ${-30 + k * 20 + o}, -150 ${10 + k * 10 - o}, -220 ${-10 + k * 18}`} stroke={['#2A2A4A', '#3E4A7A', '#5A5A8A'][k]} strokeWidth={26 - k * 6} fill="none" strokeLinecap="round" opacity={0.85 - k * 0.2} />)}
      <path d={suave([[-50, 30], [-56, -40], [-20, -90], [40, -86], [80, -50], [96, -10], [86, 20], [90, 40], [60, 56], [10, 66], [-30, 60]], true)} fill="#3E4A7A" stroke={N} strokeWidth={2.4} />
      <path d="M-40 -60 C -30 -100, 40 -110, 70 -70 L 60 -130 L 40 -96 L 24 -140 L 4 -98 L -16 -136 L -24 -92 Z" fill={PH.oro} stroke={N} strokeWidth={2} />
      <path d={boca ? 'M50 24 Q 74 30 90 20 Q 80 60 50 50 Z' : 'M50 26 Q 72 34 90 24 Q 76 40 52 36 Z'} fill={PH.rojoOsc} stroke={N} strokeWidth={1.4} />
      <path d="M60 28 l 4 12 l 4 -11 M76 28 l 3 11 l 4 -12" fill={PH.blanco} stroke={N} strokeWidth={0.8} />
      <path d="M30 -30 Q 50 -44 70 -30 Q 50 -18 30 -30 Z" fill={PH.amarillo} stroke={N} strokeWidth={1.4} /><circle cx={52} cy={-30} r={5} fill={N} />
      <path d="M26 -44 Q 50 -60 74 -40" stroke={N} strokeWidth={4} fill="none" />
      <path d="M50 6 C 64 4, 80 8, 94 14 C 80 14, 64 14, 50 12 Z" fill={N} />
    </g>
  );
};
/** Pavo real (decorado de palacios y jardines). */
const PavoReal: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, abierto: ab }) => {
  const abierto = ab === true;
  const o = Math.sin(f / 14) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {abierto ? <g transform="translate(-10 -70)">{Array.from({ length: 11 }, (_, i) => { const a = -80 + i * 16; return <g key={i} transform={`rotate(${a + o * 0.3})`}><path d="M0 0 C -10 -50, -8 -100, 0 -130 C 8 -100, 10 -50, 0 0 Z" fill={PH.verde} stroke={N} strokeWidth={1} /><circle cx={0} cy={-118} r={8} fill={PH.lapis} stroke={PH.oro} strokeWidth={2} /><circle cx={0} cy={-118} r={3} fill={PH.verdeClaro} /></g>; })}</g>
        : <path d={`M-20 -60 C -80 -50, -150 ${-20 + o}, -190 ${-6 + o} C -150 ${4 + o}, -80 -20, -10 -40 Z`} fill={PH.verde} stroke={N} strokeWidth={1.4} />}
      {!abierto && [-60, -100, -140].map((cx, i) => <circle key={i} cx={cx} cy={-30 + i * 6 + o * 0.5} r={6} fill={PH.lapis} stroke={PH.oro} strokeWidth={1.6} />)}
      <path d="M-6 0 L -4 -30 M8 0 L 6 -30" stroke="#8A6A3A" strokeWidth={3} />
      <path d={suave([[-30, -40], [-10, -70], [20, -66], [34, -46], [14, -30], [-18, -28]], true)} fill={PH.lapis} stroke={N} strokeWidth={1.6} />
      <path d={`M22 -60 C 30 -90, 26 -110, 34 -126`} stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" /><path d="M22 -60 C 30 -90, 26 -110, 34 -126" stroke={PH.azul} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M34 -126 l 12 4 l -10 4 Z" fill={PH.oro} />
      {[0, 1, 2].map((k) => <circle key={k} cx={30 + k * 4} cy={-142 - k * 2} r={2.4} fill={PH.azul} stroke={N} strokeWidth={0.6} />)}
      <circle cx={37} cy={-127} r={1.6} fill={N} />
    </g>
  );
};

// ---------- fichas ----------
type PP = Partial<PersonajeProps>;
const H = (p: PP, nombre?: string): Ficha => ({ tipo: 'persona', p: { barba: false, collar: false, ...p }, griego: nombre });
const M = (p: PP, nombre?: string): Ficha => ({ tipo: 'persona', p: { mujer: true, collar: false, ...p }, griego: nombre });
const D = (Dibujo: React.FC<DibujoProps>, p: Record<string, unknown> = {}, nombre?: string): Ficha => ({ tipo: 'dibujo', Dibujo, p, griego: nombre });

const AZUL = '#3D72C4', PIEL_H = '#C8875A', PIEL_M = '#E0A878', DORADA = '#E6B35A', CENIZA = '#A9BCCB';
const ASURA_V = '#6A4A8A', ASURA_G = '#4E7A5A', ASURA_R = '#8A3A3A';

const cabVishnu = <><Mukuta /><Kohl /><Tilak /><Kundala /></>;
const cuerpoVishnu = <><Patka c={PH.rojo} /><Collar joya={PH.rojo} /><Vanamala /></>;
const cabShiva = (azul: boolean) => <>{azul && <EnCara><ellipse cx={-4} cy={42} rx={14} ry={8} fill="#2E4FA8" opacity={0.9} /></EnCara>}<Jata c="#4A3426" /><Creciente x={10} y={-62} r={9} /><Ganga x={-4} y={-80} /><Kohl /><TercerOjo /><Kundala c="#D8D2C0" /></>;
const cabDiosa = (c: string, borde = PH.oro) => <><Odhni c={c} borde={borde} /><Diadema /><Kohl /><Kundala /></>;
const cabAsura = (corona: boolean) => <><Cuernos />{corona && <Mukuta alto={0.6} joya={PH.verde} />}<Bigote /><Colmillos /><Kohl /></>;
const cabSabio = <><Jata c="#6A6A6A" alto={0.8} /><Kohl /><Tilak c={PH.blanco} /></>;
const halo = <Halo />;

export const ELENCO_HINDU: Record<string, Ficha> = {
  // La trimurti y sus consortes
  vishnu: H({ piel: AZUL, tocado: 'corona', ropa: 'larga', ropaColor: PH.amarillo, capa: PH.rojo, pelo: N, adornos: { detras: <>{halo}<BrazosExtra piel={AZUL} arriba={<Chakra />} atras={<Shankha />} /></>, cabeza: cabVishnu, cuerpo: cuerpoVishnu, mano: <Gada />, manoAtras: <Padma /> } }, 'VISHNU'),
  lakshmi: M({ piel: PIEL_M, tocado: 'corona', ropa: 'larga', ropaColor: PH.rojo, adornos: { detras: <>{halo}<BrazosExtra piel={PIEL_M} arriba={<Padma s={1.2} />} atras={<Padma s={1.1} />} /></>, cabeza: <>{cabDiosa(PH.rosa)}</>, cuerpo: <><Collar joya={PH.verde} /><Patka c={PH.oro} /></>, mano: <Padma /> } }, 'LAKSHMI'),
  brahma: H({ piel: DORADA, tocado: 'corona', barba: true, canas: true, ropa: 'larga', ropaColor: PH.blanco, capa: PH.azafran, adornos: { detras: <>{halo}<BrazosExtra piel={DORADA} arriba={<Mala />} atras={<Padma />} /></>, cabeza: <><CaraAtras piel={DORADA} /><Mukuta alto={0.8} /><Kohl /></>, cuerpo: <><Cordon /><Collar /><Patka c={PH.rojo} /></>, mano: <Kamandalu />, manoAtras: <Pothi /> } }, 'BRAHMA'),
  shiva: H({ piel: CENIZA, ropa: 'corta', ropaColor: PH.azafran, pelo: '#4A3426', adornos: { detras: halo, cabeza: cabShiva(true), cuerpo: <><RayasTigre /><Rudraksha /><CobraCuello /></>, mano: <Trishula /> } }, 'SHIVA'),
  shiva_claro: H({ piel: CENIZA, ropa: 'corta', ropaColor: PH.azafran, pelo: '#4A3426', adornos: { detras: halo, cabeza: cabShiva(false), cuerpo: <><RayasTigre /><Rudraksha /><CobraCuello /></>, mano: <Trishula /> } }, 'SHIVA'),
  sati: M({ piel: PIEL_M, ropa: 'larga', ropaColor: PH.azafran, adornos: { detras: halo, cabeza: cabDiosa(PH.rojo), cuerpo: <Collar joya={PH.rojo} /> } }, 'SATI'),
  parvati: M({ piel: '#E8B07A', ropa: 'larga', ropaColor: PH.verde, adornos: { detras: halo, cabeza: cabDiosa(PH.rojo), cuerpo: <><Collar joya={PH.verde} /><Patka c={PH.rojo} /></>, mano: <Padma /> } }, 'PARVATI'),
  parvati_asceta: M({ piel: '#E8B07A', ropa: 'larga', ropaColor: '#C9A26A', adornos: { detras: halo, cabeza: <><Jata c="#2A1E16" alto={0.7} /><Kohl /><TercerOjo /></>, cuerpo: <Rudraksha /> } }, 'PARVATI'),
  ganesha: H({ piel: '#E8956B', tocado: 'corona', cuerpo: 'gordo', ropa: 'corta', ropaColor: PH.amarillo, pelo: '#E8956B', adornos: { detras: <>{halo}<BrazosExtra piel="#E8956B" arriba={<Parashu />} atras={<Pasha />} /></>, cabeza: <><CabezaElefante piel="#E8956B" /><g transform="translate(-6 -6)"><Mukuta alto={0.7} /></g></>, cuerpo: <><Cordon /><Collar /><Patka c={PH.rojo} /></>, mano: <Modakas />, manoAtras: <Padma /> } }, 'GANESHA'),
  ganesha_nino: H({ piel: '#E2B26A', cuerpo: 'nino', ropa: 'corta', ropaColor: PH.amarillo, objeto: 'palo', adornos: { cabeza: <><Kohl /><Tilak /><Kundala /></>, cuerpo: <Collar /> } }, 'THE BOY'),
  // Otros dioses
  indra: H({ piel: DORADA, tocado: 'corona', ropa: 'corta', ropaColor: PH.blanco, capa: PH.lapis, adornos: { detras: halo, cabeza: <><Mukuta joya={PH.verde} /><Kohl /><Kundala /><Bigote c="#3A2A20" /></>, cuerpo: <><Collar /><Patka c={PH.lapis} /></>, mano: <Vajra /> } }, 'INDRA'),
  surya: H({ piel: '#E8823A', tocado: 'corona', ropa: 'larga', ropaColor: PH.rojo, adornos: { detras: <HaloSol />, cabeza: <><Mukuta joya={PH.amarillo} /><Kohl /><Kundala /></>, cuerpo: <Collar />, mano: <Padma />, manoAtras: <Padma /> } }, 'SURYA'),
  chandra: H({ piel: '#ECE8F0', tocado: 'corona', ropa: 'larga', ropaColor: PH.blanco, capa: PH.azulClaro, adornos: { detras: <HaloLuna />, cabeza: <><Mukuta alto={0.6} joya={PH.azul} /><Kohl /><Kundala /></>, cuerpo: <Collar joya={PH.azul} />, mano: <Padma /> } }, 'CHANDRA'),
  dhanvantari: H({ piel: '#D9A26E', tocado: 'corona', ropa: 'larga', ropaColor: PH.amarillo, adornos: { detras: halo, cabeza: <><Mukuta alto={0.7} /><Kohl /><Tilak /><Kundala /></>, cuerpo: <><Collar /><Vanamala /></>, mano: <Kalasha s={0.8} /> } }, 'DHANVANTARI'),
  mohini: M({ piel: '#F0C29A', ropa: 'larga', ropaColor: PH.rosa, adornos: { detras: halo, cabeza: cabDiosa(PH.lapis), cuerpo: <><Collar joya={PH.azul} /><Patka c={PH.lapis} /></>, mano: <Kalasha s={0.7} brillo={false} /> } }, 'MOHINI'),
  kama: H({ piel: '#7FB069', tocado: 'corona', ropa: 'corta', ropaColor: PH.rosa, adornos: { cabeza: <><Mukuta alto={0.5} joya={PH.rosa} /><Kohl /><Kundala /></>, cuerpo: <><Collar /><Patka c={PH.amarillo} /></>, mano: <ArcoFlores /> } }, 'KAMA'),
  rati: M({ piel: PIEL_M, ropa: 'larga', ropaColor: PH.azafran, adornos: { cabeza: cabDiosa(PH.verde), cuerpo: <Collar joya={PH.rosa} /> } }, 'RATI'),
  garuda: H({ piel: '#D98A4A', ropa: 'corta', ropaColor: PH.rojo, pelo: '#D98A4A', adornos: { detras: <AlasGaruda />, cabeza: <><CabezaGaruda /><Kundala /></>, cuerpo: <Collar /> } }, 'GARUDA'),
  // Avatares de Vishnu
  narasimha: H({ piel: '#E8A33A', tocado: 'corona', ropa: 'corta', ropaColor: PH.amarillo, gigante: true, pelo: '#B8742A', adornos: { detras: <>{halo}<BrazosExtra piel="#E8A33A" arriba={<Chakra />} atras={<Shankha />} /></>, cabeza: <><CabezaLeon /><g transform="translate(-8 -14)"><Mukuta alto={0.7} /></g></>, cuerpo: <><Collar /><Vanamala /></>, mano: <Garras />, manoAtras: <Garras /> } }, 'NARASIMHA'),
  varaha: H({ piel: '#5E7FA8', tocado: 'corona', ropa: 'corta', ropaColor: PH.amarillo, pelo: '#5E7FA8', adornos: { detras: <>{halo}<BrazosExtra piel="#5E7FA8" arriba={<Chakra />} atras={<Shankha />} /></>, cabeza: <><CabezaJabali piel="#5E7FA8" /><g transform="translate(-10 -6)"><Mukuta alto={0.6} /></g></>, cuerpo: <><Collar /><Vanamala /></>, mano: <Gada /> } }, 'VARAHA'),
  vamana: H({ piel: AZUL, cuerpo: 'nino', ropa: 'corta', ropaColor: PH.amarillo, adornos: { cabeza: <><path d="M-20 -30 C -24 -44, -8 -50, -4 -38" stroke={N} strokeWidth={5} fill="none" /><Kohl /><Tilak /><Kundala /></>, cuerpo: <><Cordon /><Collar /></>, mano: <Chhatra />, manoAtras: <Kamandalu /> } }, 'VAMANA'),
  // Asuras (dibujados como seres míticos: cuernos, colmillos y colores que ninguna persona tiene)
  hiranyakashipu: H({ piel: ASURA_V, tocado: 'corona', gigante: true, ropa: 'corta', ropaColor: PH.rojo, capa: PH.oro, adornos: { cabeza: cabAsura(true), cuerpo: <><Collar joya={PH.verde} /><Patka c={PH.oro} /></>, mano: <Khadga /> } }, 'HIRANYAKASHIPU'),
  hiranyaksha: H({ piel: ASURA_G, gigante: true, ropa: 'corta', ropaColor: PH.rojoOsc, adornos: { cabeza: cabAsura(true), cuerpo: <Collar />, mano: <Gada /> } }, 'HIRANYAKSHA'),
  bali: H({ piel: '#9A6A4A', tocado: 'corona', ropa: 'larga', ropaColor: PH.lapis, capa: PH.rojo, adornos: { cabeza: <><Mukuta alto={0.8} joya={PH.verde} /><Bigote /><Kohl /><Kundala /></>, cuerpo: <><Collar joya={PH.verde} /><Patka c={PH.oro} /></> } }, 'KING BALI'),
  asura: H({ piel: ASURA_G, ropa: 'corta', ropaColor: PH.rojoOsc, adornos: { cabeza: cabAsura(false), cuerpo: <Collar /> } }, 'ASURA'),
  asura_rojo: H({ piel: ASURA_R, ropa: 'corta', ropaColor: PH.lapis, adornos: { cabeza: cabAsura(false), cuerpo: <Collar /> } }, 'ASURA'),
  asura_violeta: H({ piel: ASURA_V, ropa: 'corta', ropaColor: PH.verde, adornos: { cabeza: cabAsura(false), cuerpo: <Collar /> } }, 'ASURA'),
  rahu: H({ piel: '#3E4A7A', ropa: 'corta', ropaColor: PH.blanco, adornos: { cabeza: <><Mukuta alto={0.5} joya={PH.verde} /><Bigote /><Kohl /></>, cuerpo: <Collar /> } }, 'RAHU'),
  // Sabios, reyes y gente
  durvasa: H({ piel: '#C9A27A', barba: true, canas: true, cuerpo: 'flaco', ropa: 'corta', ropaColor: '#C98A4A', adornos: { cabeza: cabSabio, cuerpo: <><Cordon /><Rudraksha /></>, mano: <Danda />, manoAtras: <Kamandalu /> } }, 'DURVASA'),
  sabio: H({ piel: '#C9A27A', barba: true, canas: true, ropa: 'corta', ropaColor: '#C98A4A', adornos: { cabeza: cabSabio, cuerpo: <><Cordon /><Rudraksha /></>, mano: <Danda /> } }, 'SAGE'),
  narada: H({ piel: '#E0B88A', ropa: 'corta', ropaColor: PH.blanco, adornos: { cabeza: <><path d="M-20 -30 C -24 -48, -6 -56, -2 -40" stroke={N} strokeWidth={6} fill="none" /><Kohl /><Tilak /></>, cuerpo: <><Cordon /><Mala /></>, mano: <Vina /> } }, 'NARADA'),
  shukra: H({ piel: '#E9DCC4', barba: true, canas: true, ropa: 'larga', ropaColor: PH.blanco, adornos: { cabeza: <><Pagri c={PH.blanco} /><Kohl /><Tilak c={PH.blanco} /></>, cuerpo: <Cordon />, mano: <Kamandalu /> } }, 'SHUKRA'),
  manu: H({ piel: PIEL_H, barba: true, ropa: 'larga', ropaColor: PH.blanco, capa: PH.azafran, adornos: { cabeza: <><Pagri c={PH.azafran} joya /><Kohl /><Tilak /></>, cuerpo: <><Cordon /><Collar /></> } }, 'MANU'),
  daksha: H({ piel: '#D9A06E', tocado: 'corona', ropa: 'larga', ropaColor: PH.amarillo, capa: PH.rojo, adornos: { cabeza: <><Pagri c={PH.rojo} penacho joya /><Bigote /><Kohl /><Kundala /></>, cuerpo: <><Collar /><Patka c={PH.verde} /></> } }, 'DAKSHA'),
  daksha_cabra: H({ piel: '#D9A06E', ropa: 'larga', ropaColor: PH.amarillo, capa: PH.rojo, pelo: '#E9DCC4', adornos: { cabeza: <CabezaCabra />, cuerpo: <><Collar /><Patka c={PH.verde} /></> } }, 'DAKSHA'),
  virabhadra: H({ piel: '#2C2C4A', gigante: true, ropa: 'corta', ropaColor: PH.rojo, expresion: 'enojo', pelo: '#120C0A', contorno: true, adornos: { detras: <BrazosExtra piel="#2C2C4A" arriba={<Khadga />} atras={<Arco />} />, cabeza: <><Jata c="#120C0A" alto={1.1} /><TercerOjo /><Bigote /><Colmillos /></>, cuerpo: <Rudraksha />, mano: <Trishula />, manoAtras: <Dhal /> } }, 'VIRABHADRA'),
  prahlada: H({ piel: '#E2B07A', cuerpo: 'nino', ropa: 'corta', ropaColor: PH.amarillo, adornos: { cabeza: <><Kohl /><Tilak /><Kundala /></>, cuerpo: <><Collar /><Mala /></> } }, 'PRAHLADA'),
  raja: H({ piel: PIEL_H, ropa: 'larga', ropaColor: PH.blanco, capa: PH.rojo, adornos: { cabeza: <><Pagri c={PH.rojo} penacho joya /><Bigote /><Kohl /></>, cuerpo: <><Collar /><Patka c={PH.verde} /></> } }, 'KING'),
  deva: H({ piel: DORADA, tocado: 'corona', ropa: 'corta', ropaColor: PH.blanco, capa: PH.verde, adornos: { detras: <Halo r={58} />, cabeza: <><Mukuta alto={0.6} joya={PH.verde} /><Kohl /><Kundala /></>, cuerpo: <><Collar /><Patka c={PH.verde} /></> } }, 'DEVA'),
  deva_azafran: H({ piel: '#E0A06A', tocado: 'corona', ropa: 'corta', ropaColor: PH.amarillo, capa: PH.azafran, adornos: { detras: <Halo r={58} />, cabeza: <><Mukuta alto={0.6} /><Kohl /><Kundala /></>, cuerpo: <><Collar /><Patka c={PH.azafran} /></> } }, 'DEVA'),
  apsara: M({ piel: PIEL_M, ropa: 'larga', ropaColor: PH.lapis, adornos: { cabeza: cabDiosa(PH.rosa), cuerpo: <><Collar joya={PH.rosa} /><Patka c={PH.rosa} /></> } }, 'APSARA'),
  aldeano: H({ piel: PIEL_H, ropa: 'corta', ropaColor: PH.blanco, adornos: { cabeza: <><Pagri c={PH.azafran} /><Kohl /></> } }),
  aldeana: M({ piel: PIEL_M, ropa: 'larga', ropaColor: PH.rojo, adornos: { cabeza: <><Odhni c={PH.amarillo} borde={PH.rojo} /><Kohl /></> } }),
  anciano_aldea: H({ piel: PIEL_H, cuerpo: 'viejo', barba: true, canas: true, ropa: 'corta', ropaColor: PH.blanco, adornos: { cabeza: <><Pagri c={PH.blanco} /><Kohl /></> } }),
  nino_aldea: H({ piel: PIEL_H, cuerpo: 'nino', ropa: 'corta', ropaColor: PH.amarillo, adornos: { cabeza: <Kohl /> } }),
  brahman: H({ piel: '#D9A06E', ropa: 'corta', ropaColor: PH.blanco, adornos: { cabeza: <><path d="M-20 -30 C -24 -46, -6 -52, -2 -38" stroke={N} strokeWidth={5} fill="none" /><Kohl /><Tilak c={PH.blanco} /></>, cuerpo: <Cordon />, manoAtras: <Pothi /> } }, 'PRIEST'),
  // Criaturas
  airavata: D(Elefante, { s: 0.8, colmillos: 4 }, 'AIRAVATA'),
  elefante: D(Elefante, { s: 0.75, color: '#8C8C94', gualdrapa: false }, 'ELEPHANT'),
  kurma: D(Tortuga, { s: 1 }, 'KURMA'),
  matsya: D(PezCuerno, { s: 1 }, 'MATSYA'),
  pececito: D(PezCuerno, { s: 0.22, cuerno: false, color: '#E8B04A' }, 'A LITTLE FISH'),
  vasuki: D(Naga, { s: 0.9, color: '#3E7D4A' }, 'VASUKI'),
  shesha: D(Naga, { s: 0.9, cabezas: 7, color: '#5A6E9A', panza: '#E9DCC4' }, 'SHESHA'),
  cobra: D(Naga, { s: 0.45, largo: 0.6, color: '#4A6A3A' }, 'COBRA'),
  rahu_cabeza: D(CabezaRahu, { s: 0.9 }, 'RAHU'),
  mayura: D(PavoReal, { s: 0.9 }, 'PEACOCK'),
  mayura_abierto: D(PavoReal, { s: 0.9, abierto: true }, 'PEACOCK'),
  nandi: { tipo: 'cuadrupedo', animal: 'toro', p: { color: '#F2EEE4', contorno: true }, griego: 'NANDI' },
  kamadhenu: { tipo: 'cuadrupedo', animal: 'buey', p: { color: '#F6F0E2', contorno: true }, griego: 'KAMADHENU' },
  uchchaihshravas: { tipo: 'cuadrupedo', animal: 'caballo', p: { color: '#F6F2EA', cabezas: 3, contorno: true }, griego: 'UCHCHAIHSHRAVAS' },
  jabali_varaha: { tipo: 'cuadrupedo', animal: 'jabali', p: { color: '#5E7FA8', s: 1.3 }, griego: 'VISHNU AS A BOAR' },
  hamsa_vuela: { tipo: 'ave', p: { color: '#FBF8F0', ala2: '#E9DCC4', pico: '#E8892B', s: 0.8 }, griego: 'HAMSA' },
  hamsa: { tipo: 'avepie', p: { especie: 'ganso', color: '#FBF8F0', s: 1.3 }, griego: 'HAMSA' },
  mushika: { tipo: 'bichito', p: { especie: 'rata', color: '#8A7A6A', s: 1.2 }, griego: 'MUSHIKA' },
};

/** Nombres en pantalla (inglés) cuando difieren de la ficha. */
export const NOMBRE_EN_HINDU: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_HINDU).filter(([, f]) => f.griego).map(([k, f]) => [k, f.griego as string]));

// Piezas que reusan los diseños oficiales (elencoHinduOficial.tsx).
export { EnCara, Kohl, Tilak, Kundala, Mukuta, Diadema, Odhni, Jata, TercerOjo, Creciente, Halo, Vanamala, Collar, Cordon, Rudraksha, Patka, RayasTigre, CobraCuello, Shankha, Gada, Padma, Trishula, Pothi, Kamandalu, Vajra, Modakas, Pasha, Parashu, Khadga, Mala, Arco, Elefante };
