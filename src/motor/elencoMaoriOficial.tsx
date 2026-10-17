// Diseños oficiales maoríes (2026-10-15) para los Shorts "Who is…?" y los episodios nuevos (tema kōwhaiwhai).
// Mismo muñeco del canal con piel natural, ropa simple (korowai, piupiu, tāniko, tikitiki con huia, pounamu) y 2–3 señas
// claras por personaje. Cultura viva: sin tā moko (no se copian diseños de personas reales), sin caricatura;
// Hine-nui-te-pō es digna, no villana. Las claves viejas de elencoMaori.tsx quedan intactas; estas son *_oficial.
// Māui maorí se distingue del hawaiano: moño tikitiki con pluma de huia, piupiu y el anzuelo de quijada (no el gran anzuelo blanco).
import { AguilaEpica, CanidoEpico } from './bestiasEpicas'; // animales épicos (mismo dibujo que los griegos)
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, type P, type PersonajeProps } from '../comun/vasija';
import type { DibujoProps } from './elencoAzteca';
import type { Ficha } from './elenco';
import { N, r1, PeloLargo, PeloMedio, Mono, BarbaCorta, CapaEspalda, Aura } from './piezasPolinesias';

const PELO = '#18120F', PELO_LUZ = '#5A4636', CANAS = '#DCD6CC', CANAS_LUZ = '#9A948A';
const PIEL_H = '#8C5535', PIEL_M = '#A46A44';
const ROJO = '#A8251B', BLANCO = '#FAF5EA', HARAKEKE = '#B89A5C', OCRE = '#C8873A', POUNAMU = '#3E7D52', POUNAMU_CLARO = '#7BB487';
const PAUA = '#2E9A92';

// ---------- cabeza ----------
/** Pluma de huia: negra con la punta blanca. */
const Huia: React.FC<{ x?: number; y?: number; ang?: number; l?: number }> = ({ x = -14, y = -52, ang = -55, l = 64 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${r1(ang + Math.sin(f / 15) * 2)})`}>
      <path d={`M-3 0 C -9 ${-l * 0.4}, -6 ${-l * 0.85}, 2 ${-l} C 8 ${-l * 0.8}, 7 ${-l * 0.4}, 3 0 Z`} fill="#141010" stroke={N} strokeWidth={1.2} />
      <path d={`M-5 ${-l * 0.8} C -4 ${-l * 0.93}, 0 ${-l}, 2 ${-l} C 6 ${-l * 0.92}, 6 ${-l * 0.86}, 5 ${-l * 0.78} Z`} fill={BLANCO} />
    </g>
  );
};
/** Tikitiki: moño alto con peineta (heru) y plumas de huia. */
const Tikitiki: React.FC<{ c?: string; luz?: string; plumas?: number }> = ({ c = PELO, luz = PELO_LUZ, plumas = 1 }) => (
  <g>
    {plumas > 0 && <Huia x={-18} y={-50} ang={-62} />}
    {plumas > 1 && <Huia x={-12} y={-54} ang={-40} l={56} />}
    <Mono c={c} luz={luz} x={-12} y={-46} r={14} />
    <path d="M-4 -56 l 3 -14 l 4 0 l 1 14 Z M3 -55 l 4 -13 l 4 1 l -2 13 Z" fill="#F3E7CF" stroke={N} strokeWidth={1.2} />
  </g>
);
/** Corona de hojas (Tāne). */
const CoronaHojas: React.FC<{ c?: string; c2?: string }> = ({ c = '#4E7A3A', c2 = '#6E9A4E' }) => {
  const f = useCurrentFrame();
  return <g>{[-70, -48, -26, -4, 18].map((a, i) => <g key={i} transform={`translate(${-12 + i * 7} ${-34 + Math.abs(i - 2) * 3}) rotate(${r1(a + Math.sin(f / 15 + i) * 3)})`}><path d="M0 0 C -9 -12, -8 -30, 0 -40 C 8 -30, 9 -12, 0 0 Z" fill={i % 2 ? c2 : c} stroke={N} strokeWidth={1.4} /><path d="M0 -4 V -32" stroke="#2F5228" strokeWidth={1} /></g>)}</g>;
};
/** Koru de helecho y flor en el pelo (Papatūānuku). */
const HelechoPelo: React.FC = () => (
  <g>
    <path d="M-20 -30 C -30 -50, -14 -66, -2 -58 C 8 -52, 0 -40, -8 -46" stroke="#4E7A3A" strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M-20 -30 C -30 -50, -14 -66, -2 -58 C 8 -52, 0 -40, -8 -46" stroke="#7BA05A" strokeWidth={2} fill="none" strokeLinecap="round" />
    {Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return <ellipse key={i} cx={r1(-30 + Math.cos(a) * 6)} cy={r1(-22 + Math.sin(a) * 6)} rx={5} ry={3} fill="#E8B83A" stroke={N} strokeWidth={0.9} transform={`rotate(${r1((a * 180) / Math.PI)} ${r1(-30 + Math.cos(a) * 6)} ${r1(-22 + Math.sin(a) * 6)})`} />; })}
    <circle cx={-30} cy={-22} r={3.5} fill={ROJO} />
  </g>
);
/** Pelo de tormenta (Tāwhirimātea): gris, largo y barrido hacia atrás por el viento. */
const PeloViento: React.FC<{ c1?: string; c2?: string; c3?: string; sombra?: string }> = ({ c1 = '#B8C0CC', c2 = '#CDD3DC', c3 = '#C2C9D3', sombra = '#8A94A3' }) => {
  const f = useCurrentFrame();
  const m = (k: number) => Math.sin(f / 5 + k) * 6;
  return (
    <g>
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-10 - i * 6} ${-34 + i * 10} C ${-50 - i * 4} ${-46 + i * 8 + m(i) * 0.4}, ${-80} ${-40 + i * 12 + m(i)}, ${-112 + i * 8} ${-30 + i * 16 + m(i + 1)}`} stroke={N} strokeWidth={13 - i} fill="none" strokeLinecap="round" />)}
      {[0, 1, 2, 3].map((i) => <path key={`c${i}`} d={`M${-10 - i * 6} ${-34 + i * 10} C ${-50 - i * 4} ${-46 + i * 8 + m(i) * 0.4}, ${-80} ${-40 + i * 12 + m(i)}, ${-112 + i * 8} ${-30 + i * 16 + m(i + 1)}`} stroke={i % 2 ? c1 : c2} strokeWidth={10 - i} fill="none" strokeLinecap="round" />)}
      <path d={suave([[22, -27], [14, -38], [-4, -43], [-24, -36], [-34, -18], [-34, 4], [-24, 16], [-14, 8], [-8, 4], [-4, 6], [-2, -8], [6, -20], [16, -25]], true, 0.85)} fill={c3} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M8 -36 C -10 -40, -24 -32, -32 -16 M-4 -30 C -14 -28, -22 -20, -26 -8" stroke={sombra} strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Estrellitas en el pelo (Hine-nui-te-pō, Ranginui). */
const EstrellasPelo: React.FC<{ pts?: [number, number][] }> = ({ pts = [[-22, -30], [-36, 4], [-44, 40], [-40, 80]] }) => (
  <g>{pts.map(([x, y], i) => <path key={i} transform={`translate(${x} ${y})`} d="M0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" fill="#FFF8E6" stroke={N} strokeWidth={0.6} />)}</g>
);
/** Tūī posado en el hombro (Tāne): oscuro con reflejos verdes y el penacho blanco en la garganta. Origen = patas. */
const Tui: React.FC = () => {
  const f = useCurrentFrame(), cab = Math.sin(f / 9) * 4;
  return (
    <g>
      <path d="M-20 -6 L -38 6 L -34 -4 L -40 0 L -26 -14 Z" fill="#1E2A2E" stroke={N} strokeWidth={1.4} />
      <path d={suave([[-22, -8], [-8, -24], [8, -28], [18, -18], [12, -4], [-6, 0]], true, 0.8)} fill="#1E2A2E" stroke={N} strokeWidth={1.5} />
      <path d="M-14 -12 C -6 -20, 4 -22, 10 -18" stroke="#3E6E5A" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <g transform={`rotate(${r1(cab)} 14 -26)`}>
        <circle cx={14} cy={-30} r={9} fill="#1E2A2E" stroke={N} strokeWidth={1.5} />
        <path d="M21 -32 L 33 -29 L 21 -26 Z" fill="#141010" stroke={N} strokeWidth={1} />
        <circle cx={17} cy={-32} r={2.3} fill={BLANCO} /><circle cx={17.5} cy={-32} r={1.1} fill="#141010" />
        <circle cx={18} cy={-20} r={3.2} fill={BLANCO} stroke={N} strokeWidth={0.8} /><circle cx={22} cy={-21} r={2.6} fill={BLANCO} stroke={N} strokeWidth={0.8} />
      </g>
      <path d="M-2 0 L -4 6 M6 -2 L 6 6" stroke="#3A2A20" strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};

// ---------- cuerpo ----------
/** Korowai: capa de lino sobre los hombros con borlas (hukahuka) y ruedo tāniko. Tapa el torso. */
const Korowai: React.FC<{ a: number; c: string; borla?: string; plumas?: string[]; largo?: number; ruedo?: string }> = ({ a, c, borla = '#141010', plumas, largo = 1, ruedo = ROJO }) => {
  const f = useCurrentFrame();
  const fondo = -300 + 104 * largo;
  const pts: [number, number][] = [[-22 * a, -308], [18 * a, -308], [36 * a, -290], [36 * a, -250], [34 * a, fondo], [-38 * a, fondo + 2], [-36 * a, -250], [-34 * a, -290]];
  const id = `kw${Math.round(a * 100)}${c.replace('#', '')}${Math.round(largo * 10)}`;
  return (
    <g>
      <defs><clipPath id={id}><path d={suave(pts, true, 0.5)} /></clipPath></defs>
      <path d={suave(pts, true, 0.5)} fill={c} stroke={N} strokeWidth={2.2} />
      <g clipPath={`url(#${id})`}>
        {plumas && plumas.map((pc, i) => <rect key={i} x={-60} y={r1(-300 + (i * 104 * largo) / plumas.length)} width={120} height={r1((104 * largo) / plumas.length + 1)} fill={pc} />)}
        {Array.from({ length: Math.max(2, Math.round(3 * largo)) }, (_, j) => Array.from({ length: 7 }, (_, i) => { const px = -34 * a + i * 11 * a, py = -290 + j * 30 + (i % 2) * 9; return <path key={`${j}${i}`} d={`M${r1(px)} ${py} q ${r1(Math.sin(f / 10 + i + j) * 2)} 8 0 13`} stroke={borla} strokeWidth={2.6} strokeLinecap="round" fill="none" />; }))}
      </g>
      <path d={`M${r1(-38 * a)} ${fondo} H ${r1(34 * a)}`} stroke={N} strokeWidth={9} />
      <path d={`M${r1(-38 * a)} ${fondo} H ${r1(34 * a)}`} stroke={ruedo} strokeWidth={6} />
      <path d={`M${r1(-38 * a)} ${fondo} H ${r1(34 * a)}`} stroke={BLANCO} strokeWidth={2} strokeDasharray="5 5" />
      {Array.from({ length: 9 }, (_, i) => { const px = -36 * a + i * 8.6 * a; return <path key={`b${i}`} d={`M${r1(px)} ${fondo + 4} q ${r1(Math.sin(f / 9 + i) * 2)} 7 0 12`} stroke={borla} strokeWidth={2.4} strokeLinecap="round" fill="none" />; })}
      <path d={`M${r1(-14 * a)} -306 Q ${r1(6 * a)} -292 ${r1(24 * a)} -304`} stroke={N} strokeWidth={1.4} fill="none" />
    </g>
  );
};
/** Piupiu: falda de tiras de lino con los cilindros negros. largo 1 ≈ hasta la rodilla. */
const Piupiu: React.FC<{ c?: string; largo?: number; a?: number; cinto?: string }> = ({ c = HARAKEKE, largo = 1, a = 1, cinto = ROJO }) => {
  const f = useCurrentFrame();
  const bajo = -214 + 96 * largo, n = Math.round(15 * a);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => { const px = -32 * a + i * (66 * a) / (n - 1), m = Math.sin(f / 9 + i) * 2; return <g key={i}><path d={`M${r1(px)} -212 L ${r1(px + m)} ${bajo}`} stroke={N} strokeWidth={5.4} /><path d={`M${r1(px)} -212 L ${r1(px + m)} ${bajo}`} stroke={c} strokeWidth={3.8} /><path d={`M${r1(px)} -196 L ${r1(px + m * 0.3)} ${bajo}`} stroke="#141010" strokeWidth={3.8} strokeDasharray={`6 9`} /></g>; })}
      <path d={`M${r1(-34 * a)} -216 L ${r1(32 * a)} -218`} stroke={N} strokeWidth={12} />
      <path d={`M${r1(-34 * a)} -216 L ${r1(32 * a)} -218`} stroke={cinto} strokeWidth={9} />
      {Array.from({ length: 8 }, (_, i) => <path key={`t${i}`} d={`M${r1(-32 * a + i * 8 * a)} -212 l 4 -7 l 4 7 Z`} fill="#141010" />)}
      {Array.from({ length: 8 }, (_, i) => <path key={`w${i}`} d={`M${r1(-28 * a + i * 8 * a)} -221 l 2 3 l 2 -3 Z`} fill={BLANCO} />)}
    </g>
  );
};
/** Hei-tiki / colgante de pounamu con cordón (forma de gota simple, sin cara). */
const Pounamu: React.FC<{ y?: number }> = ({ y = 0 }) => (
  <g transform={`translate(0 ${y})`}>
    <path d="M-10 -304 Q 8 -276 28 -300" stroke={N} strokeWidth={1.6} fill="none" />
    <path d="M10 -286 C 2 -272, 4 -256, 12 -250 C 20 -256, 22 -272, 14 -286 Z" fill={POUNAMU} stroke={N} strokeWidth={1.5} />
    <path d="M11 -280 C 8 -272, 9 -262, 12 -257" stroke={POUNAMU_CLARO} strokeWidth={1.8} fill="none" />
  </g>
);
/** Capa con estrellas por la espalda (Ranginui). */
const EstrellasCapa: React.FC = () => (
  <g>{[[-50, -250], [-70, -170], [-44, -120], [-84, -80], [-60, -40], [-30, -200], [-90, -30]].map(([x, y], i) => <path key={i} transform={`translate(${x} ${y})`} d="M0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" fill="#FFF8E6" />)}</g>
);
/** Nubes alrededor de los hombros (Ranginui) o que pasan (Tāwhirimātea). */
const Nubes: React.FC<{ pts: [number, number, number][]; c?: string; rapido?: boolean }> = ({ pts, c = '#E8EEF4', rapido }) => {
  const f = useCurrentFrame();
  return <g>{pts.map(([x, y, s], i) => <g key={i} transform={`translate(${r1(x + Math.sin(f / (rapido ? 6 : 14) + i) * (rapido ? 8 : 4))} ${y}) scale(${s})`}><path d="M-50 10 C -60 -6, -40 -20, -26 -14 C -20 -32, 10 -34, 18 -18 C 34 -24, 54 -8, 44 10 Z" fill={c} stroke={N} strokeWidth={2} /></g>)}</g>;
};
/** Ráfagas de viento (Tāwhirimātea). */
const Rafagas: React.FC = () => {
  const f = useCurrentFrame();
  return <g>{[[-60, -330, 0], [-110, -220, 1], [-80, -120, 2]].map(([x, y, k]) => { const d = (f * 4 + k * 40) % 80; return <path key={k} d={`M${x + 60 - d} ${y} q -30 -8 -60 0 q -12 4 -18 -4`} stroke="#FFFFFF" strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.7} />; })}</g>;
};
/** Pasto que crece en el ruedo de la falda larga (Papatūānuku). */
const PastoRuedo: React.FC = () => {
  const f = useCurrentFrame();
  return <g>{Array.from({ length: 12 }, (_, i) => { const x = -42 + i * 8.6, m = Math.sin(f / 12 + i) * 2; return <path key={i} d={`M${x} -6 q ${r1(m)} -10 ${r1(2 + m)} -${12 + (i % 3) * 5} M${x + 3} -6 q 3 -6 6 -8`} stroke="#4E7A3A" strokeWidth={2.4} fill="none" strokeLinecap="round" />; })}</g>;
};

// ---------- en la mano (origen = la mano) ----------
/** Taiaha: bastón de lucha con lengua tallada arriba, collar de plumas rojas y pelo blanco, y hoja plana abajo. */
const Taiaha: React.FC = () => (
  <g transform="rotate(10)">
    <path d="M-4 170 L -5 -150 L 5 -150 L 4 170 Z" fill="#6A3A22" stroke={N} strokeWidth={2} />
    <path d="M-9 170 C -12 200, 12 200, 9 170 Z" fill="#6A3A22" stroke={N} strokeWidth={2} />
    <path d="M-8 -150 C -10 -172, -6 -192, 0 -204 C 6 -192, 10 -172, 8 -150 Z" fill="#6A3A22" stroke={N} strokeWidth={2} />
    <ellipse cx={-3} cy={-172} rx={3} ry={2} fill={PAUA} /><ellipse cx={3} cy={-172} rx={3} ry={2} fill={PAUA} />
    <path d="M-10 -144 C -16 -130, -14 -118, -8 -110 M10 -144 C 16 -130, 14 -118, 8 -110" stroke={ROJO} strokeWidth={6} fill="none" />
    <path d="M-9 -112 C -14 -96, -10 -86, -6 -80 M9 -112 C 14 -96, 10 -86, 6 -80" stroke={BLANCO} strokeWidth={4} fill="none" />
  </g>
);
/** Anzuelo de quijada (Māui maorí): la quijada encantada de Muri-ranga-whenua hecha anzuelo (matau), con dientes y nácar. */
const AnzueloQuijada: React.FC = () => {
  const f = useCurrentFrame();
  const forma = 'M-6 -84 L -6 -20 C -6 10, 34 10, 34 -20 L 34 -36';
  return (
    <g transform="translate(6 -2) rotate(-8)">
      <circle cy={-36} r={44} fill="url(#haloBlanco)" opacity={0.45 + Math.sin(f / 6) * 0.12} />
      <path d="M-6 -84 C 6 -100, 22 -104, 34 -112" stroke="#8C6B3A" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d={forma} stroke={N} strokeWidth={19} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={forma} stroke="#F3EAD4" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 -32 L 34 -50 L 40 -32 Z" fill="#F3EAD4" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      {[-66, -54, -42, -30].map((y) => <path key={y} d={`M1 ${y} l 6 3 l -6 3 Z`} fill={BLANCO} stroke={N} strokeWidth={1} />)}
      <ellipse cx={-6} cy={-52} rx={3} ry={8} fill={PAUA} stroke={N} strokeWidth={1} />
      {[-82, -76].map((y) => <path key={y} d={`M-14 ${y} l 16 4`} stroke="#5A3A22" strokeWidth={2.6} />)}
    </g>
  );
};
/** Rollo de cuerda de lino colgando de la cintura (Māui, Kupe). */
const RolloCintura: React.FC = () => (
  <g transform="translate(-34 -196)">
    {[0, 1, 2].map((i) => <ellipse key={i} cx={0} cy={6 + i * 4} rx={12} ry={16 - i * 2} fill="none" stroke={N} strokeWidth={5} />)}
    {[0, 1, 2].map((i) => <ellipse key={`c${i}`} cx={0} cy={6 + i * 4} rx={12} ry={16 - i * 2} fill="none" stroke="#B8955A" strokeWidth={3} />)}
  </g>
);
/** Toki: azuela de pounamu con mango (Tāne). */
const Toki: React.FC = () => (
  <g transform="rotate(-6)">
    <path d="M0 36 L 0 -84" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 34 L 0 -82" stroke="#6A3A22" strokeWidth={6} strokeLinecap="round" />
    <path d="M0 -80 C 16 -86, 32 -80, 40 -66 L 34 -56 C 24 -66, 12 -68, 0 -64 Z" fill={POUNAMU} stroke={N} strokeWidth={2} />
    <path d="M-5 -76 h 10 M-5 -70 h 10" stroke={HARAKEKE} strokeWidth={3} />
  </g>
);
/** Pez en la mano (Tangaroa). */
const PezMano: React.FC = () => {
  const f = useCurrentFrame(), c = Math.sin(f / 6) * 6;
  return (
    <g transform="translate(6 12) rotate(80)">
      <path d="M-30 0 C -16 -14, 16 -14, 28 0 C 16 14, -16 14, -30 0 Z" fill="#5E9AAE" stroke={N} strokeWidth={1.8} />
      <path d={`M-28 0 l -14 ${r1(-12 + c * 0.3)} l 0 ${r1(24)} Z`} fill="#5E9AAE" stroke={N} strokeWidth={1.6} />
      <path d="M-8 -8 C 0 -4, 8 -4, 16 -6" stroke="#9FD0DC" strokeWidth={2} fill="none" />
      <circle cx={17} cy={-2} r={2.4} fill="#141010" />
    </g>
  );
};
/** Kete de kūmara colgando de la mano de atrás (Rongo). */
const KeteKumara: React.FC = () => (
  <g transform="translate(0 4) scale(1.4)">
    <path d="M-12 0 C -12 -10, 12 -10, 12 0" stroke="#8A6A3A" strokeWidth={3} fill="none" />
    {[[-12, 8], [0, 2], [12, 8], [-6, 0]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y + 4} rx={9} ry={6} fill="#B0504A" stroke={N} strokeWidth={1.4} transform={`rotate(${i * 25 - 20} ${x} ${y + 4})`} />)}
    <path d="M-24 6 L 24 6 L 18 44 L -18 44 Z" fill={HARAKEKE} stroke={N} strokeWidth={2} strokeLinejoin="round" />
    {[-14, -6, 2, 10].map((x) => <path key={x} d={`M${x} 8 l 6 34 M${x + 8} 8 l -6 34`} stroke="#8A6A3A" strokeWidth={1.4} />)}
  </g>
);
/** Kō: palo de cavar con su apoyapié (Rongo). */
const Ko: React.FC = () => (
  <g transform="rotate(6)">
    <path d="M0 196 L 0 -110" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 194 L 0 -108" stroke="#7A4A28" strokeWidth={6} strokeLinecap="round" />
    <path d="M-2 140 h 24 v 7 h -24 Z" fill="#7A4A28" stroke={N} strokeWidth={1.6} />
    <path d="M-5 -100 h 10 M-5 -92 h 10" stroke={OCRE} strokeWidth={3} />
  </g>
);
/** Hoe de Kupe: remo con pala pintada (kōwhaiwhai rojo y blanco) y plumas atadas como en la proa de un waka. */
const HoeKupe: React.FC = () => {
  const f = useCurrentFrame(), m = Math.sin(f / 10) * 4;
  return (
    <g transform="rotate(8)">
      <path d="M0 -160 L 0 60" stroke={N} strokeWidth={10} strokeLinecap="round" />
      <path d="M0 -158 L 0 60" stroke="#6A3A22" strokeWidth={6} strokeLinecap="round" />
      <path d="M0 56 C -22 80, -20 150, 0 186 C 20 150, 22 80, 0 56 Z" fill={ROJO} stroke={N} strokeWidth={2.5} />
      <path d="M0 70 V 174" stroke={BLANCO} strokeWidth={2.4} />
      {[84, 102, 120, 138, 156].map((y) => <path key={y} d={`M-9 ${y} L 0 ${y - 8} L 9 ${y}`} stroke={BLANCO} strokeWidth={2.4} fill="none" strokeLinejoin="round" />)}
      <path d="M0 -160 C -10 -176, 6 -190, 12 -180 C 16 -172, 6 -168, 4 -174" stroke={N} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M0 -160 C -10 -176, 6 -190, 12 -180 C 16 -172, 6 -168, 4 -174" stroke="#6A3A22" strokeWidth={3} fill="none" strokeLinecap="round" />
      {[0, 1, 2].map((i) => <path key={i} d={`M2 -150 C ${10 + i * 6} ${-140 + i * 4}, ${22 + i * 8 + m} ${-126 + i * 8}, ${30 + i * 10 + m} ${-112 + i * 12}`} stroke={i === 1 ? BLANCO : '#141010'} strokeWidth={4.5} fill="none" strokeLinecap="round" />)}
    </g>
  );
};
/** Fronda de helecho joven en la mano (Papatūānuku). */
const Brote: React.FC = () => (
  <g transform="translate(6 -4)">
    <path d="M0 0 C 2 -20, -4 -40, 6 -56 C 16 -64, 22 -52, 14 -48 C 8 -46, 8 -54, 12 -54" stroke="#4E7A3A" strokeWidth={4.5} fill="none" strokeLinecap="round" />
    {[-12, -24, -36].map((y, i) => <g key={y}><ellipse cx={-8 + i} cy={y} rx={8} ry={3.5} fill="#6E9A4E" stroke={N} strokeWidth={1} transform={`rotate(-30 ${-8 + i} ${y})`} /><ellipse cx={10 - i} cy={y - 4} rx={8} ry={3.5} fill="#6E9A4E" stroke={N} strokeWidth={1} transform={`rotate(30 ${10 - i} ${y - 4})`} /></g>)}
  </g>
);
/** Relámpago chico en la mano (Tāwhirimātea). */
const Rayo: React.FC = () => {
  const f = useCurrentFrame(), on = f % 24 < 14;
  return <g transform="translate(10 -20)" opacity={on ? 1 : 0.5}><circle r={30} fill="url(#haloBlanco)" opacity={0.6} /><path d="M4 -36 L -10 -2 L 2 -2 L -6 30 L 14 -8 L 2 -8 L 12 -36 Z" fill="#F7E27A" stroke={N} strokeWidth={1.8} strokeLinejoin="round" /></g>;
};

// ---------- secundarios (2026-10-17): personajes con nombre, extras de la cultura y animales ----------
const CREMA_K = '#E4D4AE', MARRON_K = '#7A5A3A', GRIS_K = '#9A8A6A', NEGRO_K = '#2A2A2A', AZUL_K = '#9AB8D8', OCRE_K = '#C99A4E';

/** Tīpare: banda de lino tejido en la frente, con plumas blancas (la usan las mujeres y los rangatira). */
const Tipare: React.FC<{ c?: string; plumas?: number }> = ({ c = ROJO, plumas = 0 }) => (
  <g>
    <path d="M21 -26 C 14 -43, -14 -47, -32 -26" stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M21 -26 C 14 -43, -14 -47, -32 -26" stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M18 -30 C 8 -42, -12 -44, -26 -30" stroke={BLANCO} strokeWidth={1.6} fill="none" strokeDasharray="4 4" />
    {plumas > 0 && <Huia x={-8} y={-44} ang={-25} l={38} />}
    {plumas > 1 && <Huia x={-16} y={-42} ang={-50} l={34} />}
  </g>
);
/** Tokotoko: bastón de mano con la cabeza tallada (ancianos, tohunga). */
const TokotokoK: React.FC<{ c?: string }> = ({ c = '#6A3A22' }) => (
  <g transform="rotate(4)">
    <path d="M0 150 L 0 -120" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 148 L 0 -118" stroke={c} strokeWidth={6} strokeLinecap="round" />
    <path d="M0 -120 C -10 -134, 8 -146, 12 -134 C 14 -126, 6 -124, 4 -130" stroke={N} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M0 -120 C -10 -134, 8 -146, 12 -134 C 14 -126, 6 -124, 4 -130" stroke={c} strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M-5 -96 h 10 M-5 -88 h 10" stroke={OCRE} strokeWidth={3} />
  </g>
);
/** Mere: garrote corto de pounamu con cordón. */
const Mere: React.FC = () => (
  <g transform="rotate(-8)">
    <path d="M-6 26 L -6 -4 C -20 -24, -20 -78, 0 -102 C 20 -78, 20 -24, 6 -4 L 6 26 Z" fill={POUNAMU} stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <path d="M0 -92 C -8 -70, -8 -40, -3 -14" stroke={POUNAMU_CLARO} strokeWidth={2} fill="none" />
    <path d="M0 26 C 8 38, -6 46, 2 56" stroke="#8C6B3A" strokeWidth={2.4} fill="none" strokeLinecap="round" />
  </g>
);
/** Huata: lanza larga de madera con la punta tallada. */
const Huata: React.FC = () => (
  <g transform="rotate(6)">
    <path d="M0 150 L 0 -170" stroke={N} strokeWidth={9} strokeLinecap="round" />
    <path d="M0 148 L 0 -168" stroke="#6A3A22" strokeWidth={5} strokeLinecap="round" />
    <path d="M-8 -168 C -8 -184, -2 -198, 0 -210 C 2 -198, 8 -184, 8 -168 Z" fill="#6A3A22" stroke={N} strokeWidth={2} />
    <path d="M-7 -150 h 14 M-7 -142 h 14" stroke={ROJO} strokeWidth={3.2} />
  </g>
);
/** Hoe: remo de waka con la pala de color. */
const Hoe: React.FC<{ pala?: string }> = ({ pala = OCRE }) => (
  <g transform="rotate(8)">
    <path d="M0 -150 L 0 56" stroke={N} strokeWidth={9} strokeLinecap="round" />
    <path d="M0 -148 L 0 56" stroke="#6A3A22" strokeWidth={5} strokeLinecap="round" />
    <path d="M0 52 C -20 76, -18 140, 0 172 C 18 140, 20 76, 0 52 Z" fill={pala} stroke={N} strokeWidth={2.4} />
    <path d="M0 66 V 160" stroke={BLANCO} strokeWidth={2} />
  </g>
);
/** Cuerda de lino (o de enredadera) enrollada con un lazo suelto. */
const Cuerda: React.FC<{ c?: string }> = ({ c = '#B8955A' }) => {
  const f = useCurrentFrame();
  return (
    <g transform="translate(4 0)">
      {[0, 1, 2].map((i) => <ellipse key={i} cx={0} cy={14 + i * 4} rx={20} ry={16 - i * 2} fill="none" stroke={N} strokeWidth={6.4} />)}
      {[0, 1, 2].map((i) => <ellipse key={`c${i}`} cx={0} cy={14 + i * 4} rx={20} ry={16 - i * 2} fill="none" stroke={c} strokeWidth={3.6} />)}
      <path d={`M16 24 C 40 ${40 + Math.sin(f / 12) * 4}, 56 ${70}, 40 ${96} C 30 108, 12 104, 14 90 C 16 80, 30 80, 32 90`} stroke={N} strokeWidth={6.4} fill="none" strokeLinecap="round" />
      <path d={`M16 24 C 40 ${40 + Math.sin(f / 12) * 4}, 56 ${70}, 40 ${96} C 30 108, 12 104, 14 90 C 16 80, 30 80, 32 90`} stroke={c} strokeWidth={3.6} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Mechón largo de pelo atado con un cordón rojo (Taranga). */
const Mechon: React.FC = () => (
  <g transform="translate(2 4)">
    {[-6, -2, 2, 6].map((x, i) => <path key={i} d={`M${x} 0 C ${x - 3} 30, ${x + 4} 58, ${x} 84`} stroke={N} strokeWidth={5.4 - i * 0.2} fill="none" strokeLinecap="round" />)}
    {[-6, -2, 2, 6].map((x, i) => <path key={`c${i}`} d={`M${x} 0 C ${x - 3} 30, ${x + 4} 58, ${x} 84`} stroke={i % 2 ? '#34261E' : PELO} strokeWidth={3.2} fill="none" strokeLinecap="round" />)}
    <path d="M-9 8 H 9 M-9 14 H 9" stroke={ROJO} strokeWidth={3} />
  </g>
);
/** Llama en la palma (Mahuika). */
const Llama: React.FC = () => {
  const f = useCurrentFrame(), a = Math.sin(f / 5) * 3;
  return (
    <g transform="translate(6 -4)">
      <circle cx={0} cy={-24} r={40} fill="url(#haloBlanco)" opacity={0.22} />
      <path d={`M-12 0 C -22 -10, -18 -34, -6 -46 C -4 -34, 0 -32, 0 -50 C ${12 + a} -38, 20 -14, 12 0 Z`} fill="#F2A33D" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M-5 0 C -10 -8, -6 -22, 0 -28 C 4 -20, 8 -12, 5 0 Z" fill="#F7E27A" />
    </g>
  );
};
/** Quijada en la mano (Muri-ranga-whenua): hueso curvo con dientes. */
const Quijada: React.FC = () => (
  <g transform="translate(4 -10) rotate(-14)">
    <path d="M-26 -30 C -28 6, 28 6, 26 -30" stroke={N} strokeWidth={17} fill="none" strokeLinecap="round" />
    <path d="M-26 -30 C -28 6, 28 6, 26 -30" stroke="#F3EAD4" strokeWidth={12} fill="none" strokeLinecap="round" />
    {[-16, -8, 0, 8, 16].map((x) => <path key={x} d={`M${x - 3} ${-12 + Math.abs(x) * 0.18} l 3 -9 l 3 9 Z`} fill={BLANCO} stroke={N} strokeWidth={1} />)}
  </g>
);
/** Kete: canasto tejido de lino. fruto = lo que lleva (kūmara, pescado, nada). */
const Kete: React.FC<{ fruto?: 'kumara' | 'pescado' | 'nada' }> = ({ fruto = 'nada' }) => (
  <g transform="translate(0 6)">
    <path d="M-14 -4 C -14 -26, 14 -26, 14 -4" stroke="#8A6A3A" strokeWidth={3.4} fill="none" />
    {fruto === 'kumara' && [[-10, -6], [0, -10], [10, -6]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={8} ry={5.4} fill="#B0504A" stroke={N} strokeWidth={1.3} transform={`rotate(${i * 22 - 20} ${x} ${y})`} />)}
    {fruto === 'pescado' && <><path d="M-12 -2 C -4 -12, 8 -12, 14 -4 L 22 -12 L 22 4 L 14 -2 C 8 6, -4 6, -12 -2 Z" fill="#6AA6B8" stroke={N} strokeWidth={1.4} strokeLinejoin="round" /></>}
    <path d="M-26 0 L 26 0 L 20 42 L -20 42 Z" fill={HARAKEKE} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    {[-14, -6, 2, 10].map((x) => <path key={x} d={`M${x} 2 l 6 38 M${x + 8} 2 l -6 38`} stroke="#8A6A3A" strokeWidth={1.4} />)}
    <path d="M-24 14 H 24 M-22 28 H 22" stroke={ROJO} strokeWidth={2.4} />
  </g>
);
/** Red de pesca recogida en la mano. */
const RedPesca: React.FC = () => (
  <g transform="translate(6 2)">
    <path d="M-4 0 C -30 10, -34 50, -18 84 L 22 84 C 38 50, 34 10, 8 0 Z" fill="none" stroke={N} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-4 0 C -30 10, -34 50, -18 84 L 22 84 C 38 50, 34 10, 8 0 Z" fill="#CDB98A" fillOpacity={0.35} stroke="#B8955A" strokeWidth={2.4} strokeLinejoin="round" />
    {[16, 34, 52, 70].map((y) => <path key={y} d={`M${-26 + y * 0.12} ${y} H ${30 - y * 0.12}`} stroke="#B8955A" strokeWidth={1.6} />)}
    {[-14, 0, 14].map((x) => <path key={x} d={`M${x} 6 L ${x * 1.1} 82`} stroke="#B8955A" strokeWidth={1.6} />)}
  </g>
);
/** Manojo de hojas de harakeke (lino) para tejer. */
const Harakeke: React.FC = () => (
  <g transform="translate(4 0)">
    {[-14, -6, 2, 10].map((x, i) => <path key={i} d={`M${x * 0.3} 0 C ${x} -30, ${x * 1.6} -60, ${x * 2.4 + 4} ${-96 + i * 6}`} stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" />)}
    {[-14, -6, 2, 10].map((x, i) => <path key={`c${i}`} d={`M${x * 0.3} 0 C ${x} -30, ${x * 1.6} -60, ${x * 2.4 + 4} ${-96 + i * 6}`} stroke={i % 2 ? '#7BA05A' : '#5E8A46'} strokeWidth={5.4} fill="none" strokeLinecap="round" />)}
  </g>
);
/** Piedra caliente que brilla (Rūaumoko). */
const PiedraCaliente: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g transform="translate(6 -8)">
      <circle r={40} fill="url(#halo)" opacity={0.55 + Math.sin(f / 5) * 0.12} />
      <path d={suave([[-16, 6], [-12, -12], [4, -18], [18, -8], [16, 8], [0, 14]], true)} fill="#4A3A34" stroke={N} strokeWidth={2} />
      <path d="M-8 -4 L 0 -2 L 4 -10 M2 6 L 8 0" stroke="#F2A33D" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Hojas verdes de musgo y helecho en el pelo (hakuturi). */
const MusgoPelo: React.FC = () => (
  <g>
    {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={-28 + i * 12} cy={-38 + Math.abs(i - 1.5) * 4} rx={9} ry={5} fill={i % 2 ? '#6E9A4E' : '#5A8444'} stroke={N} strokeWidth={1.3} transform={`rotate(${-40 + i * 24} ${-28 + i * 12} ${-38})`} />)}
  </g>
);
/** Algas colgando del pelo (ponaturi). */
const AlgasPelo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-30 + i * 6} ${-30 + i * 4} C ${-40 + i * 4} ${10 + Math.sin(f / 9 + i) * 3}, ${-30 + i * 6} 40, ${-40 + i * 6 + Math.sin(f / 8 + i) * 4} 70`} stroke={N} strokeWidth={8} fill="none" strokeLinecap="round" />)}
      {[0, 1, 2, 3].map((i) => <path key={`c${i}`} d={`M${-30 + i * 6} ${-30 + i * 4} C ${-40 + i * 4} ${10 + Math.sin(f / 9 + i) * 3}, ${-30 + i * 6} 40, ${-40 + i * 6 + Math.sin(f / 8 + i) * 4} 70`} stroke={i % 2 ? '#2F5A3E' : '#3E7A52'} strokeWidth={5} fill="none" strokeLinecap="round" />)}
    </g>
  );
};

// ---------- animales (origen = las patas en el suelo; peces y aves en vuelo = el centro del cuerpo) ----------
const ojoA = (x: number, y: number, r = 4) => <g><circle cx={x} cy={y} r={r} fill={N} /><circle cx={r1(x + r * 0.35)} cy={r1(y - r * 0.35)} r={r1(r * 0.32)} fill="#FFFFFF" /></g>;
const pataA = (x: number, alto: number, fase: number, amp: number, w: number, c: string, k: number) => {
  const a = (Math.sin(fase + k) * amp * Math.PI) / 180, bx = x + Math.sin(a) * alto, by = -alto + Math.cos(a) * alto;
  return <g key={k}><path d={`M${x} ${-alto} L ${r1(bx)} ${r1(by)}`} stroke={N} strokeWidth={w + 4} strokeLinecap="round" /><path d={`M${x} ${-alto} L ${r1(bx)} ${r1(by)}`} stroke={c} strokeWidth={w} strokeLinecap="round" /></g>;
};
const caminarA = (f: number, moviendo?: boolean, corriendo?: boolean) => ({ fase: moviendo || corriendo ? f * (corriendo ? 0.38 : 0.22) : 0, amp: corriendo ? 30 : moviendo ? 20 : 0 });
const AlaVuelo: React.FC<{ c: string; ang: number; k?: number }> = ({ c, ang, k = 1 }) => (
  <path transform={`rotate(${r1(ang)}) scale(${k})`} d="M0 0 C -10 -26, -36 -50, -66 -56 L -58 -46 L -68 -40 L -56 -34 L -62 -26 L -50 -22 C -34 -14, -18 -4, -8 8 Z" fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
);
/** Ave del bosque de perfil, posada (patas en el origen) o en vuelo (vuela, o y < 690; origen = el cuerpo).
 * cola: abanico (piwakawaka), larga o corta. tufos = los dos penachos blancos del tūī. gordo = paloma redonda (kērerū). */
const Manu: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, vuela, moviendo, risa, color = '#3E6E5A', ala = '#2E5A48', panza = '#F4F2EA', cabezaC, pico = 'corto', picoC = '#2A2220', cola = 'corta', patas = '#C9A060', k = 1, tufos, brillo, gordo, ceja }) => {
  const c = color as string, al = ala as string, cab = (cabezaC ?? color) as string, kk = (k as number) * 1.4;
  const volando = !!vuela || y < 690;
  const pc = pico === 'gancho' ? 'M8 -5 C 22 -7, 27 2, 21 11 C 18 4, 13 2, 8 2 Z' : pico === 'largo' ? 'M8 -4 C 24 -5, 34 0, 40 8 C 30 4, 20 2, 8 2 Z' : 'M8 -4 L 21 -1 L 8 2 Z';
  const cabeza = (tx: number, ty: number) => (
    <g transform={`translate(${tx} ${ty})`}>
      <path d={pc} fill={picoC as string} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />
      {!!risa && <path d="M8 2 L 20 4 L 8 8 Z" fill="#9A2A2A" stroke={N} strokeWidth={1} />}
      <circle r={11} fill={cab} stroke={N} strokeWidth={2} />
      {!!ceja && <path d="M-1 -8 Q 5 -11 10 -6" stroke={ceja as string} strokeWidth={2.4} fill="none" strokeLinecap="round" />}
      {ojoA(4, -3, 2.4)}
    </g>
  );
  const colaP = (px: number, py: number, volar: boolean) => {
    const sw = (risa ? Math.sin(f * 0.8) * 12 : Math.sin(f / 8) * 4);
    if (cola === 'abanico') return <g transform={`translate(${px} ${py})`}>{Array.from({ length: 7 }, (_, i) => { const a = ((volar ? 168 : 150) + i * 10 + sw) * Math.PI / 180; return <path key={i} d={`M0 0 L ${r1(Math.cos(a) * 44)} ${r1(Math.sin(a) * 44)}`} stroke={N} strokeWidth={7} strokeLinecap="round" />; })}{Array.from({ length: 7 }, (_, i) => { const a = ((volar ? 168 : 150) + i * 10 + sw) * Math.PI / 180; return <path key={`c${i}`} d={`M0 0 L ${r1(Math.cos(a) * 42)} ${r1(Math.sin(a) * 42)}`} stroke={i % 2 ? '#F4F2EA' : al} strokeWidth={4.4} strokeLinecap="round" />; })}</g>;
    const L = cola === 'larga' ? 46 : 26;
    return <path d={`M${px} ${py} L ${px - L} ${py - 4} L ${px - L + 2} ${py + 6} Z`} fill={al} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />;
  };
  if (volando) {
    const a = Math.sin(f * 0.45) * 36;
    return (
      <g transform={`translate(${x} ${y}) scale(${voltear ? -s * kk : s * kk} ${s * kk})`} opacity={opacity}>
        <g transform="translate(2 -6)"><AlaVuelo c={al} ang={-a * 0.6 - 8} k={0.9} /></g>
        {colaP(-26, 0, true)}
        <ellipse cx={0} cy={0} rx={gordo ? 32 : 28} ry={gordo ? 15 : 11} fill={c} stroke={N} strokeWidth={2} />
        <path d="M-18 6 Q 0 12 20 5" stroke={panza as string} strokeWidth={gordo ? 7 : 4} fill="none" strokeLinecap="round" />
        {cabeza(28, -4)}
        <g transform="translate(4 -6)"><AlaVuelo c={al} ang={a} /></g>
      </g>
    );
  }
  const salto = moviendo ? -Math.abs(Math.sin(f / 4)) * 8 : 0, tiembla = risa ? Math.sin(f * 1.6) * 2 : 0, g = gordo ? 1.18 : 1;
  return (
    <g transform={`translate(${x + tiembla * s} ${y + salto * s}) scale(${voltear ? -s * kk : s * kk} ${s * kk})`} opacity={opacity}>
      {colaP(-14, -20, false)}
      <path d="M0 -16 L -2 0 M8 -16 L 8 0 M-8 0 H 4 M2 0 H 14" stroke={N} strokeWidth={5} strokeLinecap="round" />
      <path d="M0 -16 L -2 0 M8 -16 L 8 0 M-8 0 H 4 M2 0 H 14" stroke={patas as string} strokeWidth={2.4} strokeLinecap="round" />
      <path d={suave([[-20, -22], [-12, -40 * g], [4, -50 * g], [20, -46 * g], [22, -30], [8, -16], [-12, -14]], true)} fill={c} stroke={N} strokeWidth={2.2} />
      <path d={suave([[19, -33], [10 * g, -20], [-8, -16]])} stroke={panza as string} strokeWidth={gordo ? 9 : 5} fill="none" strokeLinecap="round" />
      {!!brillo && <path d="M-14 -28 C -6 -38, 4 -40, 10 -36" stroke={brillo as string} strokeWidth={2.6} fill="none" strokeLinecap="round" />}
      <path d={suave([[-20, -22], [-10, -40 * g], [6, -44 * g], [4, -30], [-8, -20]], true)} fill={al} stroke={N} strokeWidth={1.8} />
      {!!tufos && <><circle cx={15} cy={-36} r={4} fill={BLANCO} stroke={N} strokeWidth={0.9} /><circle cx={20} cy={-34} r={3.4} fill={BLANCO} stroke={N} strokeWidth={0.9} /></>}
      {cabeza(18, -54 * g)}
    </g>
  );
};
/** Kurī: perro maorí chico de cara de zorro, orejas paradas y cola peluda. */
const Kuri: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, corriendo, f, color = '#C99A5E', boca }) => {
  const { fase, amp } = caminarA(f, moviendo, corriendo), c = color as string, cola = Math.sin(f / 6) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {pataA(-34, 38, fase, amp, 10, '#7A5030', Math.PI)}{pataA(28, 38, fase, amp, 10, '#7A5030', 0)}
      <path d={`M-48 -70 C -72 -74, ${-76 + cola} -100, -58 -112 C -50 -102, -46 -90, -50 -84`} fill={c} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={`M-58 -112 C -64 -106, -66 -100, -62 -96`} stroke="#F4ECD8" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={suave([[-52, -62], [-44, -84], [0, -88], [34, -84], [48, -66], [40, -44], [0, -40], [-40, -42]], true)} fill={c} stroke={N} strokeWidth={2.4} />
      <path d="M-32 -48 Q 0 -42 32 -50" stroke="#F4ECD8" strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M-30 -80 Q -10 -88 10 -82" stroke="#7A5030" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
      {pataA(-26, 38, fase, amp, 10, c, Math.PI * 0.4)}{pataA(36, 38, fase, amp, 10, c, Math.PI * 1.4)}
      <g transform="translate(46 -86)">
        <path d={suave([[-14, 10], [-10, -12], [10, -18], [28, -8], [44, 2], [42, 11], [20, 16], [-6, 20]], true)} fill={c} stroke={N} strokeWidth={2.2} />
        <path d="M22 4 L 42 4 L 42 11 L 20 16 Z" fill="#F4ECD8" stroke="none" />
        <path d="M-6 -12 L -2 -40 L 12 -16 Z" fill="#4A3020" stroke={N} strokeWidth={2} strokeLinejoin="round" />
        <path d="M-2 -16 L 0 -30 L 6 -18 Z" fill="#C88A6A" />
        <ellipse cx={44} cy={3} rx={4.4} ry={3.8} fill={N} />
        {boca && <path d="M26 12 L 42 10 L 30 18 Z" fill="#9A2A2A" stroke={N} strokeWidth={1.2} />}
        {ojoA(18, -4, 3.4)}
      </g>
    </g>
  );
};
/** Tuatara: reptil de lomo con púas, olivo y gris. cresta = tamaño de las púas; ojo ámbar. */
const Tuatara: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#7A8A5A', panza = '#C8CFA0', puas = '#C8D49A', boca }) => {
  const c = color as string, ola = Math.sin(f / 10) * 3;
  const cuerpo: P[] = [[-150, -8 + ola], [-110, -12 - ola * 0.5], [-70, -20], [-30, -28], [10, -30], [42, -26], [62, -20]];
  const pasos = (k: number) => Math.sin(f / 3 + k) * (moviendo ? 8 : 0);
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {[[-40, Math.PI], [26, 0]].map(([lx, k], i) => <path key={i} d={`M${lx} -18 l ${-6 + pasos(k)} 16 l 10 2`} stroke={N} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      <path d={suave(cuerpo)} stroke={N} strokeWidth={38} fill="none" strokeLinecap="round" />
      <path d={suave(cuerpo)} stroke={c} strokeWidth={33} fill="none" strokeLinecap="round" />
      <path d={suave(cuerpo.slice(1).map(([a, b]) => [a, b + 10] as P))} stroke={panza as string} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.9} />
      {[-132, -112, -92, -72, -52, -32, -12, 8, 28].map((a, i) => { const yy = -34 - (a > -70 ? 8 : 4) + (a < -100 ? 6 : 0); return <path key={i} d={`M${a - 7} ${yy + 2} L ${a} ${yy - 14} L ${a + 7} ${yy + 2} Z`} fill={puas as string} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />; })}
      <g transform="translate(66 -26)">
        <path d={suave([[-14, 12], [-10, -12], [12, -16], [34, -6], [40, 6], [28, 14], [0, 16]], true)} fill={c} stroke={N} strokeWidth={2.2} />
        <path d="M6 10 Q 24 14 38 7" stroke={N} strokeWidth={1.4} fill="none" />
        {boca && <path d="M10 10 L 38 8 L 24 18 Z" fill="#9A2A2A" stroke={N} strokeWidth={1.2} />}
        <circle cx={14} cy={-3} r={5.4} fill="#E8B83A" stroke={N} strokeWidth={1.4} /><ellipse cx={14.5} cy={-3} rx={1.4} ry={3.8} fill={N} />
      </g>
      {[[-56, Math.PI * 1.3], [36, Math.PI * 0.3]].map(([lx, k], i) => <path key={`d${i}`} d={`M${lx} -16 l ${8 + pasos(k)} 16 l 10 0`} stroke={N} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      {[[-56, Math.PI * 1.3], [36, Math.PI * 0.3]].map(([lx, k], i) => <path key={`e${i}`} d={`M${lx} -16 l ${8 + pasos(k)} 16 l 10 0`} stroke={c} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
    </g>
  );
};
/** Wētā: saltamontes gigante de cueva, con patas traseras altas y largas antenas. */
const Weta: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#9A6A3A' }) => {
  const c = color as string, m = moviendo ? Math.sin(f / 3) * 6 : 0, an = Math.sin(f / 9) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {/* patas traseras: muslo alto y espinoso */}
      <path d={`M-30 -36 L -52 -76 L -74 ${-4 + m * 0.4}`} stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M-30 -36 L -52 -76 L -74 ${-4 + m * 0.4}`} stroke={c} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${-40 - i * 6} ${-56 + i * 14} l -5 -3`} stroke={N} strokeWidth={1.8} />)}
      {[[-4, 14], [18, -14]].map(([lx, mm], i) => <path key={i} d={`M${lx} -30 L ${lx + 4 + (moviendo ? mm * 0.3 : 0)} -4`} stroke={N} strokeWidth={6} strokeLinecap="round" />)}
      {[[-4, 14], [18, -14]].map(([lx, mm], i) => <path key={`c${i}`} d={`M${lx} -30 L ${lx + 4 + (moviendo ? mm * 0.3 : 0)} -4`} stroke={c} strokeWidth={3} strokeLinecap="round" />)}
      {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={-34 + i * 15} cy={-36 - Math.sin((i / 4) * Math.PI) * 10} rx={13} ry={14 - i * 0.6} fill={i % 2 ? '#B58450' : c} stroke={N} strokeWidth={2} />)}
      <g transform="translate(40 -42)">
        <path d={suave([[-8, 6], [-8, -10], [8, -14], [18, -4], [14, 8]], true)} fill={c} stroke={N} strokeWidth={2} />
        {ojoA(8, -4, 2.8)}
        <path d={`M12 -12 C 30 -30, 56 ${-36 + an}, 84 ${-30 + an}`} stroke={N} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <path d={`M8 -14 C 22 -42, 44 ${-56 + an}, 72 ${-58 + an}`} stroke={N} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};
/** Wheke: pulpo de cabeza grande y ocho tentáculos que ondulan. */
const Wheke: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, color = '#C0553A', boca }) => {
  const c = color as string;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {Array.from({ length: 8 }, (_, i) => {
        const bx = -48 + i * 13.7, d = (i - 3.5) * 10, w = Math.sin(f / 8 + i) * 8;
        const dd = `M${bx} -50 C ${bx + d * 0.5 + w} -30, ${bx + d * 1.4 - w} -14, ${bx + d * 2.2} ${-6 + (i % 2) * 2} C ${bx + d * 2.7} 0, ${bx + d * 3} -8, ${bx + d * 3.1} -14`;
        return <g key={i}><path d={dd} stroke={N} strokeWidth={14} fill="none" strokeLinecap="round" /><path d={dd} stroke={c} strokeWidth={9.6} fill="none" strokeLinecap="round" /></g>;
      })}
      <path d={suave([[-50, -60], [-52, -108], [-24, -142], [14, -144], [46, -116], [50, -66], [30, -46], [-30, -46]], true)} fill={c} stroke={N} strokeWidth={2.6} />
      <path d="M-36 -110 C -30 -128, -14 -134, 0 -132" stroke="#E8967A" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.8} />
      {[[-34, -68], [-14, -64], [8, -66], [28, -70]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={3.4} fill="#E8967A" opacity={0.8} />)}
      {boca && <ellipse cx={0} cy={-52} rx={9} ry={5} fill="#7A2A2A" stroke={N} strokeWidth={1.4} />}
      <ellipse cx={-18} cy={-84} rx={11} ry={13} fill={BLANCO} stroke={N} strokeWidth={2} /><ellipse cx={18} cy={-84} rx={11} ry={13} fill={BLANCO} stroke={N} strokeWidth={2} />
      <ellipse cx={-15} cy={-82} rx={5.6} ry={8} fill={N} /><ellipse cx={21} cy={-82} rx={5.6} ry={8} fill={N} />
    </g>
  );
};
/** Ika: pescado de mar (tāmure, pargo): rosado plateado con puntitos azules y cola en horquilla. */
const Ika: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, color = '#E0A4A0', boca }) => {
  const m = Math.sin(f / 4) * 6, c = color as string;
  const cuerpo = 'M-40 0 C -30 -26, 16 -30, 42 -8 C 48 -2, 48 4, 42 8 C 16 30, -30 26, -40 0 Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-36 0 L -64 ${-18 + m} L -56 0 L -64 ${18 + m} Z`} fill="#D9807A" stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-14 -24 C -4 -42, 14 -40, 22 -22 Z" fill="#D9807A" stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-6 22 L -16 38 L 8 24 Z" fill="#D9807A" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={cuerpo} fill={c} stroke={N} strokeWidth={2.4} />
      <path d="M-34 8 C -10 22, 20 20, 42 8" stroke="#F4DCD8" strokeWidth={5} fill="none" opacity={0.8} />
      {[[-16, -10], [-4, -14], [8, -12], [-8, -2], [4, -4], [16, -6], [-22, 0]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={2.2} fill="#5AA8D8" />)}
      <path d="M26 -20 C 30 -8, 30 6, 26 18" stroke="#B8746E" strokeWidth={2} fill="none" />
      {boca && <path d="M40 -2 L 48 0 L 40 4 Z" fill="#7A2A2A" />}
      {ojoA(32, -6, 3.4)}
    </g>
  );
};
/** Pēpi Tikitiki: Māui recién nacido, envuelto en el mechón de pelo de su madre sobre una cuna de espuma y algas. */
const PepiBulto: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f }) => {
  const b = Math.sin(f / 14) * 2;
  return (
    <g transform={`translate(${x} ${y + b}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d="M-70 -4 C -50 -16, -30 -2, -10 -14 C 10 -2, 30 -16, 50 -4 C 66 -12, 78 -4, 82 0 L -74 0 Z" fill="#EAF2F2" stroke={N} strokeWidth={2} />
      <path d="M-76 -4 C -90 -18, -66 -34, -52 -24 M-80 -2 C -96 -10, -84 -30, -70 -26" stroke="#3E7A52" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={suave([[-56, -20], [-52, -50], [-18, -66], [26, -62], [54, -42], [56, -20], [24, -12], [-26, -12]], true)} fill={PELO} stroke={N} strokeWidth={2.4} />
      {[-40, -24, -8, 8, 24, 40].map((a, i) => <path key={i} d={`M${a - 14} -18 C ${a - 4} -40, ${a + 10} -56, ${a + 22} -60`} stroke={i % 2 ? '#34261E' : PELO_LUZ} strokeWidth={3.4} fill="none" strokeLinecap="round" />)}
      <path d="M-4 -64 L 0 -14 M12 -62 L 14 -14" stroke={ROJO} strokeWidth={3} />
      <g transform="translate(56 -36)">
        <circle r={18} fill="#B87C58" stroke={N} strokeWidth={2.2} />
        <path d="M-14 -8 C -10 -22, 8 -24, 14 -10 C 6 -14, -6 -14, -14 -8 Z" fill={PELO} stroke={N} strokeWidth={1.4} />
        <path d="M-3 -2 q 3 3 6 0 M5 -2 q 3 3 6 0" stroke={N} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <path d="M3 8 q 4 3 8 0" stroke={N} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <circle cx={-6} cy={4} r={3.4} fill="#E09A80" opacity={0.7} /><circle cx={14} cy={4} r={3.4} fill="#E09A80" opacity={0.7} />
      </g>
    </g>
  );
};
/** Garrote de madera gigante con nudos (Matuku-tangotango). */
const GarroteGigante: React.FC = () => (
  <g transform="rotate(8)">
    <path d="M0 40 C -4 -30, 6 -70, 2 -120" stroke={N} strokeWidth={24} fill="none" strokeLinecap="round" />
    <path d="M0 40 C -4 -30, 6 -70, 2 -120" stroke="#6A3A22" strokeWidth={18} fill="none" strokeLinecap="round" />
    <path d="M-6 -100 C -22 -120, -10 -152, 8 -156 C 24 -146, 20 -114, 6 -100 Z" fill="#6A3A22" stroke={N} strokeWidth={2.4} />
    {[-60, -36, -12].map((y) => <path key={y} d={`M-9 ${y} h 18`} stroke="#4A2616" strokeWidth={2.4} />)}
  </g>
);

// ---------- fichas ----------
type PP = Partial<PersonajeProps>;
const H = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: { barba: false, peloCorto: true, tocado: null, collar: false, ropa: 'corta', piel: PIEL_H, pelo: PELO, ropaColor: HARAKEKE, ribete: ROJO, ...p }, griego: nombre });
const M = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: { mujer: true, peloCorto: true, tocado: null, collar: false, ropa: 'larga', piel: PIEL_M, pelo: PELO, ...p }, griego: nombre });
const A_G = 1.35; // ancho de gigante
const D = (Dibujo: React.FC<DibujoProps>, p: Record<string, unknown>, nombre?: string): Ficha => ({ tipo: 'dibujo', Dibujo, p, griego: nombre });

export const ELENCO_MAORI_OFICIAL: Record<string, Ficha> = {
  // Ranginui: el Cielo padre. Alto y mayor, pelo y barba canos, capa azul noche con estrellas, nubes al hombro y lluvia (sus lágrimas).
  ranginui_oficial: H({ s: 1.1, gigante: true, piel: '#86513A', pelo: CANAS, brazo: [62, 30], adornos: {
    detras: <><CapaEspalda c="#1E2F5E" forro="#2E4A86" borde="#9AB8D8" largo={1} ancho={1.1} /><EstrellasCapa /><Nubes pts={[[-96, -300, 0.5], [-118, -150, 0.42]]} /></>,
    cabeza: <><PeloLargo c={CANAS} luz={CANAS_LUZ} largo={0.6} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={1.2} /><EstrellasPelo pts={[[-24, -32], [-38, 6], [-44, 50]]} /></>,
    cuerpo: <><Piupiu a={A_G} c="#8EA6C8" cinto="#1E2F5E" /><Korowai a={A_G} c="#2E4A86" borla="#DCE6F0" ruedo="#9AB8D8" /></>,
  } }, 'RANGINUI'),
  // Papatūānuku: la Tierra madre. Pelo negro largo con koru de helecho y flor de kōwhai, korowai verde, falda tierra con pasto, brote en la mano.
  papatuanuku_oficial: M({ s: 1.06, gigante: true, ropaColor: '#6B3B22', ribete: '#4E7A3A', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1.2} volumen={1.15} /><HelechoPelo /></>,
    cuerpo: <><Korowai a={1.1} c="#4E7A3A" borla="#2F5228" ruedo={OCRE} largo={1.15} /><Pounamu y={4} /><PastoRuedo /></>,
    mano: <Brote />,
  } }, 'PAPATŪĀNUKU'),
  // Tāne: dios del bosque y de las aves. Corona de hojas, tūī en el hombro, korowai verde bosque y toki de pounamu.
  tane_oficial: H({ s: 1.04, adornos: {
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} x={-12} y={-46} r={14} /><CoronaHojas /><g transform="translate(-40 48)"><Tui /></g></>,
    cuerpo: <><Piupiu /><Korowai a={1} c="#3E6E3A" borla="#1E3A1A" ruedo={OCRE} /><Pounamu /></>,
    mano: <Toki />,
  } }, 'TĀNE'),
  // Tangaroa: dios del mar. Pelo largo con algas, korowai verde mar con ruedo de pāua, piupiu azul y un pez en la mano.
  tangaroa_oficial: H({ s: 1.05, gigante: true, ropaColor: '#2E6A78', ribete: PAUA, adornos: {
    detras: <CapaEspalda c="#1F5A66" forro="#2E8A8C" borde={PAUA} largo={0.85} />,
    cabeza: <><PeloLargo c={PELO} luz="#3E7A5A" largo={0.75} volumen={1.1} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.7} /></>,
    cuerpo: <><Piupiu a={A_G} c="#6AA6A8" cinto="#1F5A66" /><Korowai a={A_G} c="#2E8A8C" borla="#123A40" ruedo={PAUA} plumas={['#2E8A8C', '#3E9A9C']} /><Pounamu /></>,
    mano: <PezMano />,
  } }, 'TANGAROA'),
  // Tāwhirimātea: dios de los vientos y las tormentas. Pelo gris barrido por el viento, korowai gris tormenta, nubes y un relámpago.
  tawhirimatea_oficial: H({ s: 1.04, piel: '#80503A', ropaColor: '#6A7488', ribete: '#B8C0CC', brazo: [70, 20], adornos: {
    detras: <><CapaEspalda c="#4A5468" forro="#6A7488" borde="#B8C0CC" largo={0.8} ancho={1.3} /><Nubes pts={[[-80, -400, 0.8], [60, -440, 0.6], [-130, -270, 0.6]]} c="#C9D0DA" rapido /><Rafagas /></>,
    cabeza: <PeloViento />,
    cuerpo: <><Piupiu c="#9AA4B4" cinto="#4A5468" /><Korowai a={1} c="#5A6478" borla="#2A3040" ruedo="#B8C0CC" /></>,
    mano: <Rayo />,
  } }, 'TĀWHIRIMĀTEA'),
  // Tūmatauenga (Tū): dios de la guerra. Fuerte, tikitiki con dos plumas de huia, taiaha, korowai rojo kōkōwai y piupiu.
  tumatauenga_oficial: H({ s: 1.06, gigante: true, brazo: [24, 20], adornos: {
    detras: <CapaEspalda c="#6E1610" forro={ROJO} borde="#141010" largo={0.7} />,
    cabeza: <Tikitiki plumas={2} />,
    cuerpo: <><Piupiu a={A_G} cinto="#141010" /><Korowai a={A_G} c={ROJO} borla="#141010" ruedo="#141010" largo={0.9} /><Pounamu /></>,
    mano: <Taiaha />,
  } }, 'TŪMATAUENGA'),
  // Māui (versión maorí): joven y ágil. Moño tikitiki con pluma de huia, piupiu con cinto tāniko, anzuelo de quijada y rollo de cuerda.
  maui_tikitiki_oficial: H({ s: 0.96, piel: '#94593A', brazo: [40, 40], adornos: {
    cabeza: <Tikitiki />,
    cuerpo: <><RolloCintura /><Piupiu largo={0.9} /><Pounamu /></>,
    mano: <AnzueloQuijada />,
  } }, 'MĀUI'),
  // Hine-nui-te-pō: gran señora de la noche que recibe a los muertos. Digna y serena: muy alta, pelo largo hasta las rodillas
  // con estrellas, vestido y korowai negro con banda roja, colgante de pounamu y un halo violeta.
  hine_nui_te_po_oficial: M({ s: 1.1, piel: '#9A6444', ropaColor: '#241A34', ribete: ROJO, adornos: {
    detras: <><Aura id="auraHine" c="#8A6AC8" y={-300} r={170} fuerza={0.45} /><CapaEspalda c="#141020" forro="#2E2244" borde={ROJO} largo={1} ancho={1.15} /></>,
    cabeza: <><PeloLargo c={PELO} luz="#4A3E5A" largo={1.55} volumen={1.1} /><EstrellasPelo /></>,
    cuerpo: <><Korowai a={0.95} c="#1E1830" borla={BLANCO} ruedo={ROJO} largo={1.1} /><Pounamu y={6} /></>,
  } }, 'HINE-NUI-TE-PŌ'),
  // Rongo: dios de la comida cultivada y de la paz. Korowai ocre, kō (palo de cavar) y una kete llena de kūmara.
  rongo_oficial: H({ s: 1.02, adornos: {
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} x={-12} y={-46} r={14} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.5} /></>,
    cuerpo: <><Piupiu cinto={OCRE} /><Korowai a={1} c={OCRE} borla="#6B3B22" ruedo="#4E7A3A" /></>,
    mano: <Ko />, manoAtras: <KeteKumara />,
  } }, 'RONGO'),
  // Kupe: el gran navegante. Tikitiki con plumas, korowai blanco con franjas de mar, rollo de cuerda y remo con plumas de proa.
  kupe_oficial: H({ s: 1.04, piel: '#86502F', adornos: {
    cabeza: <><Tikitiki plumas={2} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.4} /></>,
    cuerpo: <><RolloCintura /><Piupiu /><Korowai a={1} c={BLANCO} borla="#141010" ruedo={ROJO} plumas={[BLANCO, '#2E8A8C', BLANCO, '#1F5A66']} /><Pounamu /></>,
    mano: <HoeKupe />,
  } }, 'KUPE'),
  // ===== secundarios (2026-10-17): con nombre =====
  // Los hermanos mayores de Māui: jóvenes comunes, piupiu y capa corta de lino; el remo del waka. Sin tikitiki (no son él).
  maui_hermano_oficial: H({ s: 1, piel: '#86502F', adornos: {
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <><Piupiu cinto={OCRE} /><Korowai a={1} c={OCRE_K} borla="#6B3B22" ruedo={HARAKEKE} largo={0.75} /></>,
    mano: <Hoe />,
  } }, 'MĀUI’S BROTHER'),
  // Makeatutara: el padre de Māui junto al árbol de Hawaiki. Mayor, canas, korowai pardo y bastón.
  makeatutara_oficial: H({ s: 1, cuerpo: 'viejo', canas: true, pelo: CANAS, piel: '#8A5A3A', adornos: {
    cabeza: <><Tikitiki c={CANAS} luz={CANAS_LUZ} plumas={0} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={0.8} /></>,
    cuerpo: <><Piupiu c={MARRON_K} cinto="#6B3B22" /><Korowai a={1} c={MARRON_K} borla="#2A1A10" ruedo={OCRE} largo={1.15} /><Pounamu /></>,
    mano: <TokotokoK />,
  } }, 'MAKEATUTARA'),
  // Pēpi Tikitiki: Māui bebé envuelto en el mechón de pelo de su madre, sobre la espuma.
  pepi_tikitiki_oficial: D(PepiBulto, { s: 1.2 }, 'PĒPI'),
  // Taranga: la madre de Māui. Pelo largo con tīpare y pluma, korowai crema, pounamu, y en la mano el mechón que cortó para envolver al bebé.
  taranga_oficial: M({ s: 1.02, ropaColor: '#6B4A32', ribete: ROJO, adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1} /><Tipare plumas={1} /></>,
    cuerpo: <><Korowai a={0.95} c={CREMA_K} borla="#141010" ruedo={ROJO} largo={1.25} /><Pounamu y={4} /></>,
    mano: <Mechon />,
  } }, 'TARANGA'),
  // Tāwhaki: el héroe que sube al cielo. Joven, korowai blanco con plumas verdes, tikitiki con huia y un relámpago en la mano.
  tawhaki_oficial: H({ s: 1.04, piel: '#94593A', adornos: {
    detras: <Aura id="auraTawhaki" c="#FFF0B0" y={-290} r={150} fuerza={0.22} />,
    cabeza: <Tikitiki plumas={1} />,
    cuerpo: <><Piupiu c={BLANCO} cinto={ROJO} /><Korowai a={1} c={BLANCO} borla="#141010" ruedo={ROJO} plumas={[BLANCO, '#3E6E5A', BLANCO]} /><Pounamu /></>,
    mano: <Rayo />,
  } }, 'TĀWHAKI'),
  // Haumia-tiketike: dios de las plantas silvestres y la raíz de helecho. Corona de frondas, korowai verde pardo, fronda joven en la mano.
  haumia_oficial: H({ s: 1.02, adornos: {
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} x={-12} y={-46} r={14} /><CoronaHojas c="#7A8A3A" c2="#9AA85A" /></>,
    cuerpo: <><Piupiu c="#8A7A3A" cinto="#4E7A3A" /><Korowai a={1} c="#7A6A3A" borla="#3A3A1A" ruedo="#6E9A4E" /></>,
    mano: <Brote />,
  } }, 'HAUMIA'),
  // Hine-tītama: la joven del alba, hija de Tāne. Pelo largo con estrellas, korowai rosa dorado, colgante y un halo de amanecer.
  hine_titama_oficial: M({ s: 1.02, piel: '#B07A52', ropaColor: '#E8B08A', ribete: OCRE, adornos: {
    detras: <Aura id="auraAlba" c="#FFC890" y={-290} r={160} fuerza={0.25} />,
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1.15} /><Tipare c={OCRE} /></>,
    cuerpo: <><Korowai a={0.95} c="#F2C9A0" borla={ROJO} ruedo={OCRE} largo={1.15} /><Pounamu y={4} /></>,
  } }, 'HINE-TĪTAMA'),
  // Māui joven: moño tikitiki, piupiu y la soga de lino con la que prepara el lazo para el Sol.
  maui_joven_oficial: H({ s: 0.98, piel: '#94593A', adornos: {
    cabeza: <Tikitiki />,
    cuerpo: <><Piupiu largo={0.9} /><Pounamu /></>,
    mano: <Cuerda />,
  } }, 'MĀUI'),
  // Māui niño: el más chico, moño con una pluma y piupiu corto.
  maui_nino_oficial: H({ cuerpo: 'nino', piel: '#94593A', brazo: [30, 40], adornos: {
    cabeza: <Tikitiki />,
    cuerpo: <Piupiu largo={0.8} />,
  } }, 'MĀUI'),
  // Rātā (adulto): constructor de la canoa. Barba corta, tikitiki, korowai ocre y el toki de pounamu.
  rata_toa_oficial: H({ s: 1.04, adornos: {
    cabeza: <><Tikitiki plumas={1} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.5} /></>,
    cuerpo: <><Piupiu /><Korowai a={1} c={OCRE_K} borla="#6B3B22" ruedo={ROJO} /><Pounamu /></>,
    mano: <Toki />,
  } }, 'RĀTĀ'),
  // Rātā joven: el hijo de Wāhieroa, sin barba, piupiu y capa corta; el toki en la mano.
  rata_oficial: H({ s: 0.98, adornos: {
    cabeza: <Tikitiki plumas={0} />,
    cuerpo: <><Piupiu /><Korowai a={1} c={CREMA_K} borla="#141010" ruedo={OCRE} largo={0.8} /></>,
    mano: <Toki />,
  } }, 'RĀTĀ'),
  rata_nino_oficial: H({ cuerpo: 'nino', brazo: [30, 40], adornos: {
    cabeza: <Mono c={PELO} luz={PELO_LUZ} x={-12} y={-46} r={14} />,
    cuerpo: <Piupiu largo={0.8} />,
    mano: <Toki />,
  } }, 'RĀTĀ'),
  // Hakuturi: espíritus guardianes del bosque. Chicos, corona de hojas y musgo, capa de musgo verde.
  hakuturi_oficial: H({ cuerpo: 'nino', piel: '#9A6A48', adornos: {
    cabeza: <><PeloMedio c="#2A2A1A" luz="#4E5A32" /><MusgoPelo /></>,
    cuerpo: <><Piupiu c="#6E9A4E" cinto="#4E7A3A" largo={0.8} /><Korowai a={1} c="#5A8444" borla="#2F5228" ruedo="#6E9A4E" largo={0.8} /></>,
  } }, 'HAKUTURI'),
  // Hema: el padre de Tāwhaki y Karihi. Hombre maduro, tikitiki, korowai pardo con ruedo rojo y un mere de pounamu.
  hema_oficial: H({ s: 1.04, piel: '#86502F', adornos: {
    cabeza: <><Tikitiki plumas={1} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.5} /></>,
    cuerpo: <><Piupiu cinto="#141010" /><Korowai a={1} c={MARRON_K} borla="#2A1A10" ruedo={ROJO} /><Pounamu /></>,
    mano: <Mere />,
  } }, 'HEMA'),
  // Hine-ahu-one: la primera mujer, hecha de tierra. Piel cálida, pelo largo con helecho, korowai color tierra y brote.
  hine_ahu_one_oficial: M({ s: 1.02, piel: '#A86A48', ropaColor: '#8A4A2E', ribete: '#4E7A3A', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1.1} /><HelechoPelo /></>,
    cuerpo: <><Korowai a={0.95} c="#8A4A2E" borla="#4A2A18" ruedo="#4E7A3A" largo={1.2} /><Pounamu y={4} /></>,
    mano: <Brote />,
  } }, 'HINE-AHU-ONE'),
  // Hoturapa: el primo de Kupe, dueño del waka. Joven jefe, tikitiki, korowai azul mar y el remo.
  hoturapa_oficial: H({ s: 1.02, piel: '#7E4C30', adornos: {
    cabeza: <Tikitiki plumas={1} />,
    cuerpo: <><Piupiu cinto={ROJO} /><Korowai a={1} c="#2E6A78" borla="#123A40" ruedo={BLANCO} /><Pounamu /></>,
    mano: <Hoe pala={ROJO} />,
  } }, 'HOTURAPA'),
  // Karihi: el hermano de Tāwhaki, joven con la enredadera (aka) para trepar.
  karihi_oficial: H({ s: 1, piel: '#7E4C30', adornos: {
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <><Piupiu /><Korowai a={1} c={CREMA_K} borla="#141010" ruedo={OCRE} largo={0.75} /></>,
    mano: <Cuerda c="#6E9A4E" />,
  } }, 'KARIHI'),
  // Kura-marōtini: la esposa de Hoturapa. Pelo largo con tīpare de pāua, korowai crema con ruedo rojo, pounamu.
  kuramarotini_oficial: M({ s: 1.02, ropaColor: '#7A4A32', ribete: ROJO, adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1.05} /><Tipare c={PAUA} plumas={1} /></>,
    cuerpo: <><Korowai a={0.95} c={CREMA_K} borla={ROJO} ruedo={ROJO} largo={1.25} /><Pounamu y={4} /></>,
  } }, 'KURA-MARŌTINI'),
  // Māhuika: la guardiana del fuego. Mayor, pelo gris con puntas de brasa, korowai oscuro con borlas naranja y una llama en la mano.
  mahuika_oficial: M({ s: 1, cuerpo: 'viejo', canas: true, pelo: CANAS, piel: '#9A5A3A', ropaColor: '#3A1A12', ribete: '#F2A33D', adornos: {
    detras: <Aura id="auraMahuika" c="#FFB060" y={-260} r={140} fuerza={0.25} />,
    cabeza: <PeloLargo c={CANAS} luz={CANAS_LUZ} largo={0.9} puntas="#F2803D" />,
    cuerpo: <><Korowai a={0.95} c="#4A241A" borla="#F2A33D" ruedo="#F2803D" largo={1.25} /><Pounamu y={4} /></>,
    mano: <Llama />,
  } }, 'MĀHUIKA'),
  // Matakerepo: la abuela ciega de Māui. Mayor, ojos cerrados, pelo cano, korowai gris y bastón.
  matakerepo_oficial: M({ s: 1, cuerpo: 'viejo', canas: true, ojosCerrados: true, pelo: CANAS, piel: '#9A6A4A', ropaColor: '#5A4A3A', ribete: OCRE, adornos: {
    cabeza: <PeloLargo c={CANAS} luz={CANAS_LUZ} largo={0.6} />,
    cuerpo: <Korowai a={0.95} c={GRIS_K} borla="#2A2A2A" ruedo={OCRE} largo={1.3} />,
    mano: <TokotokoK />,
  } }, 'MATAKEREPO'),
  // Matuku-tangotango: el gigante de la selva que acecha a Wāhieroa. Enorme, pelo oscuro enmarañado y corteza, garrote de madera. Serio, sin sangre.
  matuku_tangotango_oficial: H({ s: 1.14, gigante: true, piel: '#6A4230', expresion: 'enojo', adornos: {
    cabeza: <PeloViento c1="#1E1612" c2="#2E2420" c3="#241A16" sombra="#4A3A30" />,
    cuerpo: <><Piupiu a={A_G} c="#4A3A2A" cinto="#141010" /><Korowai a={A_G} c="#3A2E22" borla="#141010" ruedo="#4A3A2A" largo={0.9} /></>,
    mano: <GarroteGigante />,
  } }, 'MATUKU-TANGOTANGO'),
  // Muri-ranga-whenua: la bisabuela guardiana de la quijada. Mayor, pelo cano, korowai gris verdoso y la quijada en la mano.
  muri_ranga_whenua_oficial: M({ s: 1, cuerpo: 'viejo', canas: true, pelo: CANAS, piel: '#9A6A4A', ropaColor: '#5A5A44', ribete: POUNAMU, adornos: {
    cabeza: <PeloLargo c={CANAS} luz={CANAS_LUZ} largo={0.7} />,
    cuerpo: <><Korowai a={0.95} c="#8A8A6A" borla="#2A2A2A" ruedo={POUNAMU} largo={1.3} /><Pounamu y={4} /></>,
    mano: <Quijada />,
  } }, 'MURI-RANGA-WHENUA'),
  // Mutu-rangi: el tohunga que tenía la gran wheke. Mayor, tikitiki cano con huia, korowai negro con borlas blancas y bastón.
  muturangi_oficial: H({ s: 1.02, cuerpo: 'viejo', canas: true, pelo: CANAS, piel: '#7A4A3A', adornos: {
    cabeza: <><Tikitiki c={CANAS} luz={CANAS_LUZ} plumas={1} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={0.9} /></>,
    cuerpo: <><Piupiu c={NEGRO_K} cinto={BLANCO} /><Korowai a={1} c="#2A2A2A" borla={BLANCO} ruedo={BLANCO} largo={1.1} /><Pounamu /></>,
    mano: <TokotokoK c="#4A2A18" />,
  } }, 'MUTURANGI'),
  // Rūaumoko: el hijo no nacido que hace temblar la tierra. Niño con capa de tierra roja, piedra caliente y un halo cálido.
  ruaumoko_oficial: H({ cuerpo: 'nino', piel: '#A46A44', brazo: [30, 40], adornos: {
    detras: <Aura id="auraRua" c="#FFB060" y={-210} r={110} fuerza={0.25} />,
    cabeza: <Mono c={PELO} luz={PELO_LUZ} x={-12} y={-46} r={14} />,
    cuerpo: <><Piupiu c="#8A4A2E" cinto={ROJO} largo={0.8} /><Korowai a={1} c="#9A4A2E" borla="#4A2418" ruedo="#F2803D" largo={0.8} /></>,
    mano: <PiedraCaliente />,
  } }, 'RŪAUMOKO'),
  // Tama-nui-ki-te-rangi: el anciano del cielo, abuelo de la mujer celeste. Canas, korowai blanco azulado y bastón.
  tama_nui_ki_te_rangi_oficial: H({ s: 1.04, cuerpo: 'viejo', canas: true, pelo: CANAS, piel: '#8A5A3A', adornos: {
    detras: <Aura id="auraTama" c="#BFD6EE" y={-280} r={150} fuerza={0.25} />,
    cabeza: <><Tikitiki c={CANAS} luz={CANAS_LUZ} plumas={1} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={0.9} /></>,
    cuerpo: <><Piupiu c={AZUL_K} cinto="#2E4A86" /><Korowai a={1} c="#DCE6F0" borla="#2E4A86" ruedo={AZUL_K} largo={1.15} /><Pounamu /></>,
    mano: <TokotokoK c="#6A3A22" />,
  } }, 'TAMA-NUI-KI-TE-RANGI'),
  // Tangotango (Hāpai): la mujer celeste. Pelo largo con estrellas, korowai azul noche con estrellitas y un halo suave.
  tangotango_oficial: M({ s: 1.02, piel: '#B88A62', ropaColor: '#DCE6F0', ribete: AZUL_K, adornos: {
    detras: <Aura id="auraTango" c="#E4F0FF" y={-290} r={150} fuerza={0.3} />,
    cabeza: <><PeloLargo c={PELO} luz="#4A4E6A" largo={1.15} /><EstrellasPelo /></>,
    cuerpo: <Korowai a={0.95} c="#3D5FB0" borla="#DCE6F0" ruedo={AZUL_K} largo={1.2} />,
  } }, 'TANGOTANGO'),
  // Tū-te-wehiwehi: el guardián-reptil, un gran tuatara olivo con púas claras.
  tutewehiwehi_oficial: D(Tuatara, { s: 1.5, color: '#6A7A4A', puas: '#E0D8A0' }, 'TŪ-TE-WEHIWEHI'),
  // Urutonga: la madre de Tāwhaki y Karihi. Pelo largo con tīpare, korowai crema, canasto de lino en la mano.
  urutonga_oficial: M({ s: 1, ropaColor: '#7A5A3A', ribete: OCRE, adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.95} /><Tipare c={OCRE} /></>,
    cuerpo: <><Korowai a={0.95} c={CREMA_K} borla="#141010" ruedo={OCRE} largo={1.25} /><Pounamu y={4} /></>,
    mano: <Kete />,
  } }, 'URUTONGA'),
  // Wāhieroa: el padre de Rātā. Jefe maduro, tikitiki con dos plumas, korowai ocre rojizo con ruedo negro y la lanza larga.
  wahieroa_oficial: H({ s: 1.06, piel: '#86502F', adornos: {
    cabeza: <><Tikitiki plumas={2} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.4} /></>,
    cuerpo: <><Piupiu cinto="#141010" /><Korowai a={1} c="#B0603A" borla="#141010" ruedo="#141010" /><Pounamu /></>,
    mano: <Huata />,
  } }, 'WĀHIEROA'),
  // Ika: pescado de mar (los que pesca Māui); rosado plateado con puntitos azules.
  ika_oficial: D(Ika, { s: 1.4, vuela: true }, 'IKA'),
  // ===== extras genéricos de la cultura =====
  tangata_oficial: H({ adornos: {
    cabeza: <Mono c={PELO} luz={PELO_LUZ} x={-12} y={-46} r={14} />,
    cuerpo: <Piupiu />,
  } }, 'VILLAGER'),
  tangata_pescador_oficial: H({ piel: '#86502F', adornos: {
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <><Piupiu c={MARRON_K} largo={0.9} /><Pounamu /></>,
    mano: <RedPesca />,
  } }, 'FISHERMAN'),
  wahine_oficial: M({ ropaColor: '#7A5A3A', ribete: OCRE, adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.9} /><Tipare /></>,
    cuerpo: <Korowai a={0.95} c={CREMA_K} borla="#141010" ruedo={ROJO} largo={1.25} />,
    mano: <Harakeke />,
  } }, 'WEAVER'),
  wahine_kete_oficial: M({ ropaColor: '#4E7A5A', ribete: HARAKEKE, adornos: {
    cabeza: <PeloLargo c={PELO} luz={PELO_LUZ} largo={0.8} />,
    cuerpo: <Korowai a={0.95} c="#C9B88A" borla="#6B3B22" ruedo="#4E7A3A" largo={1.2} />,
    mano: <Kete fruto="kumara" />,
  } }, 'WOMAN'),
  kaumatua_oficial: H({ cuerpo: 'viejo', canas: true, pelo: CANAS, adornos: {
    cabeza: <><Tikitiki c={CANAS} luz={CANAS_LUZ} plumas={0} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={0.8} /></>,
    cuerpo: <><Piupiu c={HARAKEKE} /><Korowai a={1} c={OCRE_K} borla="#6B3B22" ruedo={ROJO} largo={1.2} /></>,
    mano: <TokotokoK />,
  } }, 'ELDER'),
  kuia_oficial: M({ cuerpo: 'viejo', canas: true, pelo: CANAS, ropaColor: '#6A5A44', ribete: OCRE, adornos: {
    cabeza: <PeloLargo c={CANAS} luz={CANAS_LUZ} largo={0.6} />,
    cuerpo: <Korowai a={0.95} c={GRIS_K} borla="#2A2A2A" ruedo={OCRE} largo={1.3} />,
    mano: <Kete />,
  } }, 'GRANDMOTHER'),
  tohunga_oficial: H({ cuerpo: 'viejo', canas: true, pelo: CANAS, piel: '#7A4A3A', adornos: {
    cabeza: <><Tikitiki c={CANAS} luz={CANAS_LUZ} plumas={1} /><BarbaCorta c={CANAS} luz={CANAS_LUZ} larga={0.7} /></>,
    cuerpo: <><Piupiu c={NEGRO_K} cinto={BLANCO} /><Korowai a={1} c="#2A2A2A" borla={BLANCO} ruedo={BLANCO} largo={1.15} /><Pounamu /></>,
    mano: <Brote />,
  } }, 'TOHUNGA'),
  toa_oficial: H({ s: 1.04, adornos: {
    cabeza: <Tikitiki plumas={1} />,
    cuerpo: <><Piupiu c="#6B4A2E" cinto="#141010" /><Korowai a={1} c={ROJO} borla="#141010" ruedo="#141010" largo={0.7} /></>,
    mano: <Taiaha />,
  } }, 'WARRIOR'),
  toa_remero_oficial: H({ adornos: {
    cabeza: <Mono c={PELO} luz={PELO_LUZ} x={-12} y={-46} r={14} />,
    cuerpo: <Piupiu />,
    mano: <Hoe />,
  } }, 'PADDLER'),
  rangatira_oficial: H({ s: 1.06, adornos: {
    cabeza: <><Tikitiki plumas={2} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.4} /></>,
    cuerpo: <><Piupiu cinto={ROJO} /><Korowai a={1} c={BLANCO} borla="#141010" ruedo={ROJO} plumas={['#3E6E5A', BLANCO, ROJO]} /><Pounamu /></>,
    mano: <Mere />,
  } }, 'CHIEF'),
  rangatira_wahine_oficial: M({ s: 1.04, ropaColor: '#7A5A3A', ribete: ROJO, adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={1} /><Tipare plumas={2} /></>,
    cuerpo: <><Korowai a={0.95} c={BLANCO} borla="#141010" ruedo={ROJO} plumas={['#3E6E5A', BLANCO, ROJO]} largo={1.25} /><Pounamu y={4} /></>,
  } }, 'CHIEFTAINESS'),
  tamaiti_oficial: H({ cuerpo: 'nino', brazo: [30, 40], adornos: {
    cabeza: <Mono c={PELO} luz={PELO_LUZ} x={-12} y={-46} r={14} />,
    cuerpo: <Piupiu largo={0.8} />,
  } }, 'CHILD'),
  kotiro_oficial: M({ cuerpo: 'nino', ropaColor: '#7A5A3A', ribete: OCRE, brazo: [30, 40], adornos: {
    cabeza: <PeloLargo c={PELO} luz={PELO_LUZ} largo={0.7} />,
    cuerpo: <Korowai a={1} c={CREMA_K} borla="#141010" ruedo={ROJO} largo={0.9} />,
  } }, 'GIRL'),
  // Ponaturi: el pueblo del mar y de la oscuridad. Piel pálida, algas en el pelo, korowai verde mar y una lanza corta. Serios, no monstruosos.
  ponaturi_oficial: H({ piel: '#B09680', adornos: {
    cabeza: <><PeloMedio c="#1E3A2E" luz="#3E7A52" /><AlgasPelo /></>,
    cuerpo: <><Piupiu c="#3E7A52" cinto="#1F5A66" /><Korowai a={1} c="#2E6A5E" borla="#123A30" ruedo={PAUA} largo={0.8} /></>,
    mano: <Huata />,
  } }, 'PONATURI'),
  ponaturi_mujer_oficial: M({ piel: '#B09680', ropaColor: '#2E6A5E', ribete: PAUA, adornos: {
    cabeza: <><PeloLargo c="#1E3A2E" luz="#3E7A52" largo={1} /><AlgasPelo /></>,
    cuerpo: <Korowai a={0.95} c="#3E7A52" borla="#123A30" ruedo={PAUA} largo={1.25} />,
  } }, 'PONATURI'),
  // ===== animales y criaturas =====
  kereru_oficial: D(Manu, { k: 1.25, color: '#3E6E5A', ala: '#2E5A4E', panza: '#F4F2EA', cabezaC: '#5A4A7A', picoC: ROJO, patas: ROJO, cola: 'larga', gordo: true, brillo: '#7A5A9A' }, 'KERERŪ'),
  kereru_vuela_oficial: D(Manu, { k: 1.25, vuela: true, color: '#3E6E5A', ala: '#2E5A4E', panza: '#F4F2EA', cabezaC: '#5A4A7A', picoC: ROJO, cola: 'larga', gordo: true }, 'KERERŪ'),
  tui_oficial: D(Manu, { k: 0.95, color: '#1E2A2E', ala: '#2A3E3A', panza: '#2A3E3A', picoC: '#141010', patas: '#3A2A20', cola: 'larga', tufos: true, brillo: '#3E8E8A' }, 'TŪĪ'),
  tui_vuela_oficial: D(Manu, { k: 0.95, vuela: true, color: '#1E2A2E', ala: '#2A3E3A', panza: '#2A3E3A', picoC: '#141010', cola: 'larga' }, 'TŪĪ'),
  piwakawaka_oficial: D(Manu, { k: 0.6, color: '#6A5A46', ala: '#4A3E30', panza: '#D9A86A', cabezaC: '#3A3028', picoC: '#141010', patas: '#3A2A20', cola: 'abanico', ceja: '#F4F2EA' }, 'PĪWAKAWAKA'),
  piwakawaka_risa_oficial: D(Manu, { k: 0.6, risa: true, color: '#6A5A46', ala: '#4A3E30', panza: '#D9A86A', cabezaC: '#3A3028', picoC: '#141010', patas: '#3A2A20', cola: 'abanico', ceja: '#F4F2EA' }, 'PĪWAKAWAKA'),
  miromiro_oficial: D(Manu, { k: 0.55, color: '#1E1A1A', ala: '#141010', panza: '#F4F2EA', picoC: '#141010', patas: '#3A2A20', cola: 'corta' }, 'MIROMIRO'),
  riroriro_oficial: D(Manu, { k: 0.48, color: '#8A9068', ala: '#6A7048', panza: '#E4E4CC', picoC: '#3A3028', patas: '#8A7A5A', cola: 'corta', ceja: '#F4F2EA' }, 'RIRORIRO'),
  toutouwai_oficial: D(Manu, { k: 0.62, color: '#5A5A60', ala: '#44444A', panza: '#E8E2D0', picoC: '#141010', patas: '#3A2A20', cola: 'corta' }, 'TOUTOUWAI'),
  kahu_oficial: D(Manu, { k: 1.5, color: '#6A4A2E', ala: '#4A3220', panza: '#C9A87A', cabezaC: '#7A5A3A', pico: 'gancho', picoC: '#E8C24A', patas: '#E8C24A', cola: 'larga' }, 'KAHU'),
  kahu_vuela_oficial: D(AguilaEpica, { especie: 'aguila', vuela: true, color: '#6A4A2E', cabeza: '#7A5A3A', s: 0.7, alto: 360, izq: 380, der: 380 }, 'KAHU'),
  kuri_oficial: D(CanidoEpico, { especie: 'perro', color: '#E4D6B8', alto: 340, izq: 220, der: 200 }, 'KURĪ'),
  tuatara_oficial: D(Tuatara, { s: 1 }, 'TUATARA'),
  weta_oficial: D(Weta, { s: 1.1 }, 'WĒTĀ'),
  wheke_oficial: D(Wheke, { s: 0.9 }, 'TE WHEKE'),
};
export const NOMBRE_EN_MAORI_OFICIAL: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_MAORI_OFICIAL).map(([k, f]) => [k, f.griego as string]));
