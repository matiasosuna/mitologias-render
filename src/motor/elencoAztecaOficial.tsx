// Diseños oficiales aztecas (2026-10-15) para los Shorts "Who is…?" y los episodios nuevos. Misma receta que los
// nórdicos aprobados (versión "A"): el muñeco de siempre con piel natural, ropa simple de códice (maxtlatl, tilma,
// huipil, falda) y la identidad en la silueta + 2–3 atributos que se reconocen de un vistazo, sacados del códice
// (Borgia, Borbónico, Magliabechiano) y de la escultura mexica. Nada de detalles rebuscados ni de sangre.
// Las claves viejas (quetzalcoatl, tlaloc…) de elencoAzteca.tsx quedan intactas; estas terminan en _oficial.
// Coordenadas: cuerpo con origen en los pies (hombros y≈-300, cintura -210); cabeza de perfil con el ojo en (18,-6).
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, type P, type PersonajeProps } from '../comun/vasija';
import { K } from '../comun/codice';
import { Franjas, Orejera, Pluma, Penacho, Espejo, PeloMexica, Chimalli, Dardos, mece } from './elencoAzteca';
import type { Ficha } from './elenco';

const N = K.negro;
const PIEL_H = '#B06A42', PIEL_M = '#C98E5A', PIEL_OSC = '#8E5232';
const HUESO = '#EFE6D0';

// ---------- ropa (coordenadas del cuerpo) ----------
/** Tilma (manta) anudada en el hombro de adelante: cae por la espalda hasta `hasta`, con guarda en el borde. */
const Tilma: React.FC<{ c: string; guarda?: string; puntos?: string; hasta?: number; plumas?: string }> = ({ c, guarda = K.rojo, puntos = K.blanco, hasta = -96, plumas }) => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f / 17 + k) * (2 + k * 1.2);
  const pts: P[] = [[-14, -306], [-40, -296], [-64 + o(1), -220], [-82 + o(2), hasta - 60], [-90 + o(3), hasta], [-50, hasta + 6], [-22, hasta + 4], [-8, -200], [6, -290]];
  const ruedo: P[] = [[-90 + o(3), hasta - 4], [-56, hasta + 2], [-28, hasta + 2]];
  return (
    <g>
      {plumas && Array.from({ length: 6 }, (_, i) => <Pluma key={i} x={-86 + i * 13 + o(3) * (1 - i / 6)} y={hasta - 2} ang={190 - i * 4} l={30} c={i % 2 ? plumas : K.turquesa} />)}
      <path d={suave(pts, true, 0.5)} fill={c} stroke={N} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={suave(ruedo)} stroke={N} strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d={suave(ruedo)} stroke={guarda} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={suave(ruedo)} stroke={puntos} strokeWidth={3} strokeDasharray="1 8" fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Nudo de la tilma en el hombro de adelante (va en `cuerpo`). */
const NudoTilma: React.FC<{ c: string }> = ({ c }) => (
  <g>
    <path d="M-14 -304 C 0 -300, 14 -298, 26 -300" stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M-14 -304 C 0 -300, 14 -298, 26 -300" stroke={c} strokeWidth={5.5} fill="none" strokeLinecap="round" />
    <circle cx={27} cy={-298} r={6.5} fill={c} stroke={N} strokeWidth={1.8} />
    <path d="M28 -292 l 6 16 l -9 -2 Z M24 -292 l -4 15 l 7 -3 Z" fill={c} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />
  </g>
);
/** Maxtlatl (taparrabo): faja en la cintura y la punta que cuelga adelante, con guarda y flecos. */
const Maxtlatl: React.FC<{ c?: string; guarda?: string }> = ({ c = K.blanco, guarda = K.rojo }) => (
  <g>
    <path d="M-29 -218 L 30 -220 L 31 -203 L -29 -201 Z" fill={c} stroke={N} strokeWidth={2} />
    <path d="M14 -206 L 34 -207 L 37 -150 L 15 -148 Z" fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <path d="M15 -160 L 36 -162" stroke={guarda} strokeWidth={8} />
    {[17, 22, 27, 32].map((x) => <path key={x} d={`M${x} -149 l 0.5 9`} stroke={N} strokeWidth={1.6} strokeLinecap="round" />)}
  </g>
);
/** Collar de cuentas de jade (o del color dado) alrededor del cuello. */
const Cuentas: React.FC<{ c?: string; c2?: string }> = ({ c = K.jade, c2 = K.turquesa }) => (
  <g>{Array.from({ length: 8 }, (_, i) => { const t = i / 7, cx = -16 + t * 40, cy = -300 + Math.sin(t * Math.PI) * 14; return <circle key={i} cx={cx} cy={cy} r={4.2} fill={i % 2 ? c2 : c} stroke={N} strokeWidth={1.2} />; })}</g>
);
/** Huipil de mujer con guarda escalonada (xicalcoliuhqui simple) en el borde. */
const Huipil: React.FC<{ c?: string; borde?: string }> = ({ c = K.blanco, borde = K.rojo }) => (
  <g>
    <path d={suave([[-20, -302], [18, -305], [34, -284], [38, -248], [42, -192], [-38, -190], [-32, -250], [-30, -286]], true)} fill={c} stroke={N} strokeWidth={2} />
    <path d="M-36 -200 L 41 -202" stroke={borde} strokeWidth={11} />
    {[-30, -14, 2, 18, 34].map((x) => <path key={x} d={`M${x - 4} -197 v -6 h 6 v -4`} stroke={K.blanco} strokeWidth={2} fill="none" />)}
    <path d="M-8 -302 Q 6 -286 20 -302" stroke={borde} strokeWidth={4} fill="none" />
  </g>
);

// ---------- Quetzalcóatl ----------
/** Joya del viento (ehecailacacozcatl): el corte de caracol en espiral, pectoral de Quetzalcóatl. */
const JoyaViento: React.FC = () => (
  <g transform="translate(10 -262)">
    <path d="M-10 -26 L 0 -18 M30 -26 L 20 -18" stroke={K.amarillo} strokeWidth={3} />
    <circle r={18} fill={K.blanco} stroke={N} strokeWidth={2.2} />
    <path d="M0 -18 C 13 -12, 12 6, 0 6 C -9 6, -9 -6, 0 -6 C 4 -6, 4 -1, 0 -1" stroke={N} strokeWidth={2} fill="none" />
    <path d="M-18 0 C -12 13, 6 12, 7 1" stroke={N} strokeWidth={2} fill="none" />
  </g>
);
/** Tocado de Quetzalcóatl: abanico de plumas de quetzal (verdes, largas) sobre una banda de oro con cuentas de jade. */
const TocadoQuetzal: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      {[-92, -76, -60, -44, -28, -12].map((a, i) => <Pluma key={i} x={-14 + i * 2} y={-30} ang={a + mece(f, i) * 0.7} l={118 - Math.abs(i - 2.5) * 10} c={i % 2 ? '#2E7A4A' : K.jade} c2={K.jadeClaro} />)}
      <path d="M-31 -6 C -20 -32, 6 -40, 28 -30 L 26 -20 C 6 -28, -16 -22, -27 4 Z" fill={K.amarillo} stroke={N} strokeWidth={2} />
      {[-20, -6, 8].map((x, i) => <circle key={i} cx={x} cy={-22 - i * 3} r={3.6} fill={K.jade} stroke={N} strokeWidth={1.1} />)}
      <Orejera c={K.jade} />
    </g>
  );
};
/** Bastón con la serpiente emplumada enroscada: el atributo que dice "Serpiente Emplumada" sin palabras. */
const BastonSerpiente: React.FC = () => {
  const f = useCurrentFrame(), m = Math.sin(f / 14) * 2;
  const vueltas: P[] = Array.from({ length: 9 }, (_, i) => [(i % 2 ? 11 : -11), 80 - i * 24] as P);
  return (
    <g>
      <path d="M0 96 L 0 -150" stroke={N} strokeWidth={9} strokeLinecap="round" />
      <path d="M0 94 L 0 -148" stroke="#8A5A30" strokeWidth={5} strokeLinecap="round" />
      <path d={suave([[0, 88], ...vueltas, [4, -134]])} stroke={N} strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d={suave([[0, 88], ...vueltas, [4, -134]])} stroke={K.jade} strokeWidth={8.5} fill="none" strokeLinecap="round" />
      <path d={suave([[0, 88], ...vueltas, [4, -134]])} stroke={K.amarillo} strokeWidth={2.4} strokeDasharray="4 8" fill="none" />
      {vueltas.slice(2).map(([x, y], i) => <Pluma key={i} x={x * 1.1} y={y} ang={(x > 0 ? 70 : -70) + m * 2} l={22} c={i % 2 ? K.turquesa : K.jade} />)}
      <g transform={`translate(6 -146) rotate(${m})`}>
        <Pluma x={-8} y={-12} ang={-50} l={46} /><Pluma x={-4} y={-14} ang={-24} l={52} c={K.turquesa} /><Pluma x={0} y={-14} ang={2} l={40} c={K.azul} />
        <path d={suave([[-12, 8], [-10, -14], [14, -18], [40, -8], [42, 2], [30, 6], [40, 12], [14, 14]], true)} fill={K.jade} stroke={N} strokeWidth={2} />
        <path d="M30 6 L 40 9" stroke={N} strokeWidth={1.4} />
        <circle cx={14} cy={-6} r={4.4} fill={K.blanco} stroke={N} strokeWidth={1.2} /><circle cx={15} cy={-6} r={2} fill={N} />
        <path d={`M41 8 l ${10 + m} -3 m -2 3 l ${10 + m} 4`} stroke={K.rojo} strokeWidth={2.2} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ---------- Tezcatlipoca ----------
/** Pintura de Tezcatlipoca: bandas negras horizontales con filetes amarillos (el ojo queda libre). */
const caraTezca: [number, number, string][] = [[-44, -17, N], [-17, -14, K.amarillo], [2, 5, K.amarillo], [5, 14, N], [14, 18, K.amarillo], [18, 30, N]];
/** Tocado de plumas blancas de garza con banda roja y orejera amarilla. */
const TocadoGarza: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      {[-80, -62, -44].map((a, i) => <Pluma key={i} x={-18 + i * 3} y={-28} ang={a + mece(f, i) * 0.6} l={80 - i * 8} c={K.blanco} c2="#D8D2C2" />)}
      <path d="M-31 0 C -18 -22, 8 -32, 30 -22" stroke={N} strokeWidth={10} fill="none" />
      <path d="M-31 0 C -18 -22, 8 -32, 30 -22" stroke={K.rojo} strokeWidth={6} fill="none" />
      <Orejera c={K.amarillo} />
    </g>
  );
};
/** Anillo de concha blanca (anahuatl) colgado del cuello. */
const Anahuatl: React.FC = () => (
  <g>
    <path d="M-8 -298 L 4 -276 M26 -298 L 16 -276" stroke={N} strokeWidth={2} />
    <g transform="translate(10 -258)"><circle r={15} fill="none" stroke={N} strokeWidth={10} /><circle r={15} fill="none" stroke={K.blanco} strokeWidth={6.5} /></g>
  </g>
);
/** Espejo humeante en lugar del pie de adelante (va en `pie`, origen en el tobillo). */
const PieEspejo: React.FC = () => (
  <g>
    <rect x={-12} y={-6} width={24} height={10} rx={3} fill={K.amarillo} stroke={N} strokeWidth={1.6} />
    <Espejo x={10} y={12} r={14} />
  </g>
);

// ---------- Huitzilopochtli ----------
/** Yelmo de colibrí: la cabeza del pájaro como casco, pico largo hacia adelante, garganta roja y alitas atrás. */
const YelmoColibri: React.FC = () => {
  const f = useCurrentFrame(), a = Math.sin(f / 6) * 4;
  return (
    <g>
      <Penacho n={5} l={64} x={-20} y={-34} desde={-96} hasta={-50} />
      <path d={`M-30 -30 C -50 -40, -66 -${36 + a}, -78 -${28 + a} C -60 -22, -46 -18, -32 -16 Z`} fill={K.turquesa} stroke={N} strokeWidth={1.8} />
      <path d={`M-28 -18 C -46 -20, -60 -${10 + a}, -70 -${2 + a} C -54 -2, -42 -4, -30 -8 Z`} fill="#BFE3DC" stroke={N} strokeWidth={1.6} />
      <path d="M-33 4 C -40 -38, 0 -62, 30 -40 C 32 -32, 30 -26, 26 -22 C 6 -28, -18 -16, -33 4 Z" fill={K.jade} stroke={N} strokeWidth={2.2} />
      <path d="M-24 -30 C -10 -50, 14 -52, 26 -40" stroke={K.turquesa} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M8 -26 C 14 -22, 22 -20, 27 -22 C 26 -16, 18 -14, 10 -16 Z" fill={K.rojo} stroke={N} strokeWidth={1.4} />
      <path d="M26 -40 L 92 -34 L 26 -30 Z" fill={N} />
      <circle cx={14} cy={-38} r={6} fill={K.blanco} stroke={N} strokeWidth={1.4} /><circle cx={15.5} cy={-38} r={3} fill={N} />
      <Orejera c={K.turquesa} />
    </g>
  );
};
const caraHuitzi: [number, number, string][] = [[2, 9, K.azul], [16, 23, K.azul]];

// ---------- Tláloc ----------
/** Máscara de Tláloc: anteojeras turquesa alrededor del ojo, bigote enroscado y colmillos; corona de garza. */
const MascaraTlaloc: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      {[-84, -66, -48, -30].map((a, i) => <Pluma key={i} x={-16 + i * 3} y={-28} ang={a + mece(f, i) * 0.6} l={70 - i * 6} c={K.blanco} c2="#D8D2C2" />)}
      <path d="M-31 -2 C -20 -24, 6 -34, 28 -26" stroke={N} strokeWidth={12} fill="none" />
      <path d="M-31 -2 C -20 -24, 6 -34, 28 -26" stroke={K.azul} strokeWidth={8} fill="none" />
      {[-22, -8, 6, 18].map((x, i) => <circle key={i} cx={x} cy={-15 - (i < 2 ? i * 6 : 12 - (i - 2) * 3)} r={2.4} fill={K.blanco} />)}
      <circle cx={18} cy={-6} r={12.5} fill="none" stroke={N} strokeWidth={8.5} />
      <circle cx={18} cy={-6} r={12.5} fill="none" stroke={K.turquesa} strokeWidth={5} />
      <path d="M6 -14 C -4 -18, -16 -14, -22 -8" stroke={N} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M14 14 C 22 4, 42 4, 47 14 C 49 22, 42 24, 39 19 C 36 14, 28 14, 20 20 Z" fill={K.azul} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M24 19 l 2 13 l 4 -12 Z M32 17 l 2 14 l 4 -13 Z M40 18 l 1 9 l 3 -9 Z" fill={K.blanco} stroke={N} strokeWidth={1.2} strokeLinejoin="round" />
      <Orejera c={K.jade} />
    </g>
  );
};
/** Bastón del rayo: serpiente-rayo ondulada, amarilla. */
const Rayo: React.FC = () => {
  const d = 'M0 90 L 0 30 L -12 6 L 10 -26 L -10 -58 L 12 -94 L -6 -126 L 8 -152';
  return <g><path d={d} stroke={N} strokeWidth={12} fill="none" strokeLinejoin="round" strokeLinecap="round" /><path d={d} stroke={K.amarillo} strokeWidth={7} fill="none" strokeLinejoin="round" strokeLinecap="round" /><path d="M8 -152 L 2 -168 L 16 -156 Z" fill={K.amarillo} stroke={N} strokeWidth={1.6} /></g>;
};
/** Jarra de lluvia azul que derrama agua. */
const JarraLluvia: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g transform="translate(-4 14) rotate(-18)">
      {[0, 1, 2, 3].map((k) => { const t = ((f * 1.6 + k * 11) % 44) / 44; return <path key={k} d={`M${22 + t * 10} ${-8 + t * 70} q 3 6 0 10 q -3 -4 0 -10 Z`} fill="#7FC4E8" stroke={N} strokeWidth={1} opacity={1 - t * 0.6} />; })}
      <path d="M-18 -14 C -24 12, -14 30, 0 30 C 14 30, 24 12, 18 -14 Z" fill={K.azul} stroke={N} strokeWidth={2} />
      <path d="M-14 -14 L -16 -22 L 16 -22 L 14 -14 Z" fill={K.azulOsc} stroke={N} strokeWidth={1.8} />
      <circle cx={0} cy={8} r={6} fill="none" stroke={K.turquesa} strokeWidth={3} />
      <path d="M16 -18 C 26 -18, 30 -12, 28 -6" stroke="#7FC4E8" strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Falda con olas de agua (guarda de volutas). */
const FaldaAgua: React.FC = () => <g>{[-34, -14, 6, 26].map((x) => <path key={x} d={`M${x} -164 c 4 -8, 12 -8, 12 0 c 0 4, -6 4, -6 0`} stroke={K.blanco} strokeWidth={2.4} fill="none" strokeLinecap="round" />)}</g>;

// ---------- Coatlicue ----------
/** Falda de serpientes entretejidas (la escultura del Templo Mayor): rombos de serpientes verdes con panza amarilla
 * y el cinturón de serpiente anudado adelante, con las dos cabezas. */
const FaldaSerpientes: React.FC = () => {
  const id = 'fsCoatl';
  const falda: P[] = [[-27, -212], [24, -214], [36, -150], [50, -40], [58, -6], [-44, -6], [-46, -60], [-36, -150]];
  const diag = (x0: number, k: number) => `M${x0} -214 L ${x0 + k * 220} -4`;
  return (
    <g>
      <defs><clipPath id={id}><path d={suave(falda, true)} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <rect x={-60} y={-220} width={130} height={220} fill={K.jade} />
        {[-140, -100, -60, -20, 20, 60].map((x) => <g key={`a${x}`}><path d={diag(x, 0.42)} stroke={N} strokeWidth={13} /><path d={diag(x, 0.42)} stroke={K.jadeClaro} strokeWidth={9} /><path d={diag(x, 0.42)} stroke={K.amarillo} strokeWidth={2} strokeDasharray="5 6" /></g>)}
        {[-40, 0, 40, 80, 120, 160].map((x) => <g key={`b${x}`}><path d={diag(x, -0.42)} stroke={N} strokeWidth={13} /><path d={diag(x, -0.42)} stroke="#5FA066" strokeWidth={9} /><path d={diag(x, -0.42)} stroke={K.amarillo} strokeWidth={2} strokeDasharray="5 6" /></g>)}
      </g>
      <path d={suave(falda, true)} fill="none" stroke={N} strokeWidth={2.5} />
      {[-36, -14, 8, 30, 50].map((x, i) => <g key={i} transform={`translate(${x} -10)`}><path d="M-6 -6 C -6 -12, 8 -12, 10 -4 L 14 -2 L 9 0 C 6 4, -6 4, -6 -6 Z" fill="#5FA066" stroke={N} strokeWidth={1.4} /><circle cx={4} cy={-5} r={1.4} fill={N} /></g>)}
      <path d="M-30 -214 L 28 -216" stroke={N} strokeWidth={12} strokeLinecap="round" />
      <path d="M-30 -214 L 28 -216" stroke={K.jadeClaro} strokeWidth={8} strokeLinecap="round" />
      <g transform="translate(26 -214)">
        <path d="M0 0 C 10 4, 14 18, 6 26 M0 0 C 14 -2, 22 8, 18 18" stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d="M0 0 C 10 4, 14 18, 6 26 M0 0 C 14 -2, 22 8, 18 18" stroke={K.jadeClaro} strokeWidth={6} fill="none" strokeLinecap="round" />
        {[[6, 26, 20], [18, 18, 40]].map(([x, y, r], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><path d="M-6 -5 C 2 -9, 12 -5, 14 0 C 12 4, 2 7, -6 4 Z" fill={K.jadeClaro} stroke={N} strokeWidth={1.4} /><circle cx={3} cy={-2} r={1.5} fill={N} /><path d="M14 0 l 6 -2 m -6 2 l 6 2" stroke={K.rojo} strokeWidth={1.4} /></g>)}
      </g>
    </g>
  );
};

// ---------- Coyolxauhqui ----------
/** Cascabel de oro (lo que dice su nombre: "la de los cascabeles en la cara"). */
const Cascabel: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 6 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M0 ${-r - 3} v 3`} stroke={N} strokeWidth={1.6} />
    <path d={`M${-r} ${r * 0.7} C ${-r} ${-r * 1.2}, ${r} ${-r * 1.2}, ${r} ${r * 0.7} Z`} fill={K.amarillo} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
    <path d={`M0 ${r * 0.1} V ${r * 0.7}`} stroke={N} strokeWidth={1.6} strokeLinecap="round" />
    <circle cx={-r * 0.3} cy={-r * 0.35} r={r * 0.2} fill={K.blanco} />
  </g>
);
/** Media luna plateada detrás de la cabeza (va en `detras`). */
const MediaLuna: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(-26 -352) rotate(${-24 + Math.sin(f / 30) * 2})`}>
      <defs><mask id="lunaCoyol"><rect x={-80} y={-80} width={160} height={160} fill="#fff" /><circle cx={26} cy={-4} r={54} fill="#000" /></mask><clipPath id="lunaCoyolC"><circle r={62} /></clipPath></defs>
      <g mask="url(#lunaCoyol)">
        <circle r={62} fill="#F1ECDD" stroke={N} strokeWidth={3} />
        {[[-44, -10, 5], [-36, 26, 4], [-28, -38, 3.5]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#D8D0BA" />)}
      </g>
      <circle cx={26} cy={-4} r={54} fill="none" stroke={N} strokeWidth={3} clipPath="url(#lunaCoyolC)" />
    </g>
  );
};

// ---------- Xólotl ----------
/** Cabeza de perro xoloitzcuintle: oscura y sin pelo, orejas altas (la de adelante mordida, como en el códice). */
const CabezaXolo: React.FC<{ c?: string }> = ({ c = '#7A625A' }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 22) * 2;
  return (
    <g>
      <path d={`M-24 -22 C -36 -34, ${-46 + o} -46, ${-50 + o} -40 C -44 -30, -34 -22, -20 -12 Z`} fill="#5E4A44" stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d={suave([[-32, 10], [-30, -18], [-12, -34], [10, -34], [24, -24], [32, -10], [46, -6], [58, -2], [60, 10], [50, 16], [38, 20], [30, 32], [10, 42], [-14, 46], [-28, 28]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      {[[-18, -2, 5], [-6, 20, 4], [2, -24, 3.5], [-22, 22, 3]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#B9877A" opacity={0.8} />)}
      <path d={`M-8 -30 C -14 -46, ${-12 + o} -62, ${-2 + o} -64 L 2 -54 L 8 -58 C 12 -48, 12 -38, 10 -30 Z`} fill={c} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      <path d={`M-4 -34 C -6 -46, ${-4 + o} -54, ${0 + o} -56 L 5 -36 Z`} fill="#C9938A" />
      <ellipse cx={58} cy={3} rx={4.5} ry={5} fill={N} />
      <path d="M36 14 C 44 18, 52 16, 58 10" stroke={N} strokeWidth={1.8} fill="none" />
      <path d="M44 16 C 46 22, 52 22, 52 16" fill="#C2185B" stroke={N} strokeWidth={1.2} />
      <path d="M10 -12 Q 20 -20 30 -12 Q 20 -6 10 -12 Z" fill="#E8B04A" stroke={N} strokeWidth={1.4} />
      <circle cx={21} cy={-12} r={3} fill={N} /><circle cx={22} cy={-13} r={1} fill={K.blanco} />
      <path d="M8 -20 Q 18 -26 30 -19" stroke="#4A3A36" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M34 2 q 4 -3 8 0 M38 8 q 4 -3 8 0" stroke="#4A3A36" strokeWidth={1.4} fill="none" />
    </g>
  );
};

// ---------- Mictlantecuhtli ----------
/** Cráneo del señor de los muertos (simple, amable): ojo grande con pupila de estrella, dientes, pelo negro rizado. */
const Craneo: React.FC = () => (
  <g>
    {[[-30, -24], [-38, -6], [-36, 14], [-26, -36], [-12, -42]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill={N} />)}
    <path d={suave([[-30, 8], [-28, -22], [-6, -38], [18, -34], [34, -20], [40, -2], [38, 12], [32, 18], [32, 24], [30, 36], [12, 40], [-4, 36], [-8, 24], [-22, 26]], true, 0.85)} fill={HUESO} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-24 -32 C -36 -20, -38 -4, -34 10 C -28 0, -24 -14, -14 -26 Z" fill={N} />
    <ellipse cx={17} cy={-6} rx={10} ry={9.5} fill={N} />
    <path d="M17 -12 l 1.6 4.2 4.4 0.3 -3.4 2.8 1.2 4.3 -3.8 -2.4 -3.8 2.4 1.2 -4.3 -3.4 -2.8 4.4 -0.3 Z" fill={K.amarillo} />
    <path d="M36 2 L 32 12 L 40 11 Z" fill={N} />
    <path d="M12 21 H 36 M14 21 v 9 M20 21 v 10 M26 21 v 10 M32 21 v 8" stroke={N} strokeWidth={1.8} strokeLinecap="round" />
    <path d="M10 30 C 18 34, 28 34, 32 28" stroke={N} strokeWidth={1.6} fill="none" />
    <g transform="translate(-30 -16)">
      <circle r={13} fill={K.blanco} stroke={N} strokeWidth={1.6} />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M0 0 l ${(Math.cos(i * 0.785) * 13).toFixed(1)} ${(Math.sin(i * 0.785) * 13).toFixed(1)}`} stroke={N} strokeWidth={1.2} />)}
      <circle r={3.5} fill={K.rojo} stroke={N} strokeWidth={1} />
    </g>
  </g>
);
/** Huesos simples del torso y vértebras del cuello (sin morbo). */
const Huesos: React.FC = () => (
  <g stroke="#7A705E" strokeWidth={3.4} fill="none" strokeLinecap="round">
    {[0, 1, 2].map((i) => <path key={i} d={`M${-18 + i * 2} ${-282 + i * 18} C -4 ${-276 + i * 18}, 12 ${-276 + i * 18}, ${26 - i * 3} ${-284 + i * 18}`} />)}
    <path d="M4 -296 V -230" strokeWidth={3} />
  </g>
);

// ---------- Tonatiuh ----------
/** Disco solar detrás del dios: rayos rojos y amarillos alternados, anillo con puntos y centro dorado. */
const DiscoSolar: React.FC<{ r?: number }> = ({ r = 92 }) => {
  const f = useCurrentFrame(), g = f * 0.25;
  return (
    <g transform="translate(-14 -322)">
      <circle r={r * 1.45} fill="url(#halo)" opacity={0.6} />
      <g transform={`rotate(${g})`}>{Array.from({ length: 8 }, (_, i) => <path key={i} transform={`rotate(${i * 45})`} d={`M${-r * 0.24} ${-r * 0.88} L 0 ${-r * 1.34} L ${r * 0.24} ${-r * 0.88} Z`} fill={i % 2 ? K.rojo : K.amarillo} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />)}</g>
      <g transform={`rotate(${g + 22.5})`}>{Array.from({ length: 8 }, (_, i) => <path key={i} transform={`rotate(${i * 45})`} d={`M${-r * 0.12} ${-r * 0.9} L 0 ${-r * 1.12} L ${r * 0.12} ${-r * 0.9} Z`} fill={K.amarillo} stroke={N} strokeWidth={1.6} />)}</g>
      <circle r={r * 0.92} fill={K.amarillo} stroke={N} strokeWidth={3} />
      <circle r={r * 0.78} fill="none" stroke={K.rojo} strokeWidth={r * 0.1} />
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={Math.cos(i * 0.3927) * r * 0.78} cy={Math.sin(i * 0.3927) * r * 0.78} r={2.6} fill={K.blanco} />)}
      <circle r={r * 0.62} fill="#F2C94C" stroke={N} strokeWidth={2} />
    </g>
  );
};
/** Tocado de Tonatiuh: diadema dorada con plumas de águila (pardas con punta blanca). */
const TocadoAguila: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      {[-86, -70, -54, -38, -22].map((a, i) => <Pluma key={i} x={-16 + i * 3} y={-28} ang={a + mece(f, i) * 0.5} l={74 - Math.abs(i - 2) * 6} c={i % 2 ? '#6B4426' : '#8A5A30'} c2={K.blanco} />)}
      <path d="M-31 -2 C -18 -26, 8 -36, 30 -26 L 28 -16 C 8 -26, -14 -18, -27 6 Z" fill={K.amarillo} stroke={N} strokeWidth={2} />
      {[-18, -4, 10].map((x, i) => <circle key={i} cx={x} cy={-17 - i * 3.5} r={3.2} fill={K.rojo} stroke={N} strokeWidth={1} />)}
      <Orejera c={K.amarillo} />
    </g>
  );
};

// ---------- Nanahuatzin ----------
/** Llagas: unos pocos granitos (el dios humilde). */
const Llagas: React.FC<{ cuerpo?: boolean }> = ({ cuerpo }) => <g>{(cuerpo ? [[-12, -282], [14, -270], [20, -244], [-6, -240]] : [[2, 4], [22, 14], [-10, 18]]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill="#D9A27A" stroke="#7E4A2A" strokeWidth={1} />)}</g>;
/** Atado de cañas verdes: la ofrenda pobre de Nanahuatzin (los otros traían plumas y oro). */
const Canas: React.FC = () => (
  <g transform="rotate(-4)">
    {[-8, -3, 2, 7].map((dx, i) => <g key={i}><path d={`M${dx} 56 L ${dx + (i - 1.5) * 3} -64`} stroke={N} strokeWidth={6} strokeLinecap="round" /><path d={`M${dx} 56 L ${dx + (i - 1.5) * 3} -64`} stroke={i % 2 ? K.jadeClaro : '#9CC77A'} strokeWidth={3.5} strokeLinecap="round" />{[-36, 26].map((y) => <path key={y} d={`M${dx - 2.5 + (i - 1.5) * 1.2} ${y} h 5`} stroke={N} strokeWidth={1.4} />)}</g>)}
    {[[-10, -64, -30], [8, -66, 24], [0, -68, -4]].map(([x, y, a], i) => <path key={i} transform={`translate(${x} ${y}) rotate(${a})`} d="M0 0 C -6 -10, -4 -24, 0 -30 C 4 -24, 6 -10, 0 0 Z" fill={K.jadeClaro} stroke={N} strokeWidth={1.4} />)}
    <rect x={-12} y={-4} width={24} height={9} rx={2} fill={K.crema2} stroke={N} strokeWidth={1.6} />
  </g>
);

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
const H = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: limpio({ barba: false, tocado: null, collar: false, ...p }, false, false), griego: nombre });
const M = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: limpio({ mujer: true, tocado: null, collar: false, ...p }, true, false), griego: nombre });

export const ELENCO_AZTECA_OFICIAL: Record<string, Ficha> = {
  quetzalcoatl_oficial: H({ piel: PIEL_H, ropaColor: K.blanco, ribete: K.rojo, adornos: {
    detras: <Tilma c={K.jade} guarda={K.amarillo} puntos={K.rojo} hasta={-70} plumas={K.jadeClaro} />,
    cabeza: <TocadoQuetzal />,
    cuerpo: <><Maxtlatl guarda={K.jade} /><NudoTilma c={K.jade} /><JoyaViento /></>,
    mano: <BastonSerpiente />,
  } }, 'QUETZALCOATL'),
  tezcatlipoca_oficial: H({ piel: PIEL_H, ropaColor: '#2A2226', ribete: K.amarillo, adornos: {
    detras: <Tilma c="#2A2226" guarda={K.rojo} puntos={K.blanco} hasta={-80} />,
    cabeza: <><Franjas bandas={caraTezca} /><TocadoGarza /></>,
    cuerpo: <><Maxtlatl c="#2A2226" guarda={K.amarillo} /><NudoTilma c="#2A2226" /><Anahuatl /></>,
    pie: <PieEspejo />,
  } }, 'TEZCATLIPOCA'),
  huitzilopochtli_oficial: H({ piel: PIEL_H, ropaColor: K.azul, ribete: K.amarillo, adornos: {
    detras: <Tilma c={K.azul} guarda={K.amarillo} puntos={K.rojo} hasta={-110} />,
    cabeza: <><Franjas bandas={caraHuitzi} /><YelmoColibri /></>,
    cuerpo: <><Maxtlatl c={K.blanco} guarda={K.azul} /><NudoTilma c={K.azul} /><Cuentas c={K.turquesa} c2={K.amarillo} /></>,
    manoAtras: <Chimalli c={K.azul} c2={K.amarillo} />,
    mano: <Dardos />,
  } }, 'HUITZILOPOCHTLI'),
  tlaloc_oficial: H({ piel: PIEL_H, ropaColor: K.azul, ribete: K.turquesa, adornos: {
    detras: <Tilma c={K.jade} guarda={K.azul} puntos={K.blanco} hasta={-100} />,
    cabeza: <MascaraTlaloc />,
    cuerpo: <><FaldaAgua /><Maxtlatl c={K.azul} guarda={K.turquesa} /><NudoTilma c={K.jade} /><Cuentas /></>,
    mano: <Rayo />,
    manoAtras: <JarraLluvia />,
  } }, 'TLALOC'),
  coatlicue_oficial: M({ piel: PIEL_M, ropaColor: K.jade, adornos: {
    cabeza: <><PeloMexica /><path d="M-31 0 C -18 -20, 8 -28, 30 -20" stroke={K.jade} strokeWidth={7} fill="none" /><Orejera c={K.turquesa} r={6} /></>,
    cuerpo: <><FaldaSerpientes /><Huipil c={K.blanco} borde={K.jade} /><Cuentas /></>,
  } }, 'COATLICUE'),
  coyolxauhqui_oficial: M({ piel: PIEL_M, ropa: 'tunica', ropaColor: '#D7DCE6', ribete: K.amarillo, trenzas: false, adornos: {
    detras: <MediaLuna />,
    cabeza: <><PeloMexica />{[[-24, -24], [-10, -34], [-30, -6], [4, -38]].map(([cx, cy], i) => <g key={i}><circle cx={cx} cy={cy} r={6.5} fill={K.blanco} stroke={N} strokeWidth={1.4} /><path d={`M${cx - 4} ${cy - 5} l -3 -4 M${cx} ${cy - 6.5} v -5 M${cx + 4} ${cy - 5} l 3 -4`} stroke="#B8B0A0" strokeWidth={1.4} /></g>)}<Cascabel x={12} y={16} r={6.5} /><Cascabel x={-8} y={18} r={5} /></>,
    cuerpo: <><Huipil c={K.blanco} borde={K.amarillo} /><Cuentas c={K.amarillo} c2={K.blanco} /></>,
  } }, 'COYOLXAUHQUI'),
  xolotl_oficial: H({ piel: PIEL_OSC, ropaColor: K.rojo, ribete: K.blanco, peloCorto: true, adornos: {
    detras: <Tilma c={K.rojo} guarda={K.blanco} puntos={N} hasta={-70} />,
    cabeza: <CabezaXolo />,
    cuerpo: <><Maxtlatl c={K.blanco} guarda={K.rojo} /><NudoTilma c={K.rojo} /><Cuentas c={K.turquesa} c2={K.blanco} /></>,
  } }, 'XOLOTL'),
  mictlantecuhtli_oficial: H({ piel: HUESO, ropaColor: '#2A2226', ribete: K.blanco, peloCorto: true, adornos: {
    detras: <Tilma c="#2A2226" guarda={K.blanco} puntos={N} hasta={-60} />,
    cabeza: <Craneo />,
    cuerpo: <><Huesos /><Maxtlatl c="#2A2226" guarda={K.blanco} /><NudoTilma c="#2A2226" /></>,
  } }, 'MICTLANTECUHTLI'),
  tonatiuh_oficial: H({ piel: PIEL_H, ropaColor: K.rojo, ribete: K.amarillo, adornos: {
    detras: <DiscoSolar />,
    cabeza: <TocadoAguila />,
    cuerpo: <><Maxtlatl c={K.amarillo} guarda={K.rojo} /><Cuentas c={K.amarillo} c2={K.rojo} /></>,
  } }, 'TONATIUH'),
  nanahuatzin_oficial: H({ piel: PIEL_H, cuerpo: 'flaco', brazo: [8, 8], ropaColor: K.crema2, ribete: K.ocre, adornos: {
    cabeza: <Llagas />,
    cuerpo: <><Llagas cuerpo /><Maxtlatl c={K.crema2} guarda={K.ocre} /></>,
    mano: <Canas />,
  } }, 'NANAHUATZIN'),
};
export const NOMBRE_EN_AZTECA_OFICIAL: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_AZTECA_OFICIAL).map(([k, f]) => [k, f.griego as string]));
