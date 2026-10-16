// Diseños oficiales maoríes (2026-10-15) para los Shorts "Who is…?" y los episodios nuevos (tema kōwhaiwhai).
// Mismo muñeco del canal con piel natural, ropa simple (korowai, piupiu, tāniko, tikitiki con huia, pounamu) y 2–3 señas
// claras por personaje. Cultura viva: sin tā moko (no se copian diseños de personas reales), sin caricatura;
// Hine-nui-te-pō es digna, no villana. Las claves viejas de elencoMaori.tsx quedan intactas; estas son *_oficial.
// Māui maorí se distingue del hawaiano: moño tikitiki con pluma de huia, piupiu y el anzuelo de quijada (no el gran anzuelo blanco).
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, type PersonajeProps } from '../comun/vasija';
import type { Ficha } from './elenco';
import { N, r1, PeloLargo, Mono, BarbaCorta, CapaEspalda, Aura } from './piezasPolinesias';

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
const PeloViento: React.FC = () => {
  const f = useCurrentFrame();
  const m = (k: number) => Math.sin(f / 5 + k) * 6;
  return (
    <g>
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-10 - i * 6} ${-34 + i * 10} C ${-50 - i * 4} ${-46 + i * 8 + m(i) * 0.4}, ${-80} ${-40 + i * 12 + m(i)}, ${-112 + i * 8} ${-30 + i * 16 + m(i + 1)}`} stroke={N} strokeWidth={13 - i} fill="none" strokeLinecap="round" />)}
      {[0, 1, 2, 3].map((i) => <path key={`c${i}`} d={`M${-10 - i * 6} ${-34 + i * 10} C ${-50 - i * 4} ${-46 + i * 8 + m(i) * 0.4}, ${-80} ${-40 + i * 12 + m(i)}, ${-112 + i * 8} ${-30 + i * 16 + m(i + 1)}`} stroke={i % 2 ? '#B8C0CC' : '#CDD3DC'} strokeWidth={10 - i} fill="none" strokeLinecap="round" />)}
      <path d={suave([[22, -27], [14, -38], [-4, -43], [-24, -36], [-34, -18], [-34, 4], [-24, 16], [-14, 8], [-8, 4], [-4, 6], [-2, -8], [6, -20], [16, -25]], true, 0.85)} fill="#C2C9D3" stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M8 -36 C -10 -40, -24 -32, -32 -16 M-4 -30 C -14 -28, -22 -20, -26 -8" stroke="#8A94A3" strokeWidth={1.6} fill="none" strokeLinecap="round" />
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

// ---------- fichas ----------
type PP = Partial<PersonajeProps>;
const H = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: { barba: false, peloCorto: true, tocado: null, collar: false, ropa: 'corta', piel: PIEL_H, pelo: PELO, ropaColor: HARAKEKE, ribete: ROJO, ...p }, griego: nombre });
const M = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: { mujer: true, peloCorto: true, tocado: null, collar: false, ropa: 'larga', piel: PIEL_M, pelo: PELO, ...p }, griego: nombre });
const A_G = 1.35; // ancho de gigante

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
};
export const NOMBRE_EN_MAORI_OFICIAL: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_MAORI_OFICIAL).map(([k, f]) => [k, f.griego as string]));
