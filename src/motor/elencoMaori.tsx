// Elenco maorí para el tema "kowhaiwhai": atua (dioses), héroes y gente de las tradiciones registradas por Grey,
// White, Best y Te Rangi Hīroa, con su ropa genérica (korowai, kahu huruhuru, piupiu, tīpare, moño con peineta y pluma
// de huia, colgante de pounamu) y criaturas propias (aves del bosque, kurī, ika, taniwha, la gran wheke…).
// Las personas son el muñeco de siempre + `adornos`; las criaturas se dibujan acá (tipo "dibujo").
// Respeto: ningún personaje lleva tā moko (no se copian diseños sagrados de personas reales); colores literales.
// Claves en minúscula sin macrones; en pantalla el nombre va con macrones (NOMBRE_EN_MAORI).
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, miembro, type PersonajeProps } from '../comun/vasija';
import { W, DegradePaua } from '../comun/kowhaiwhai';
import type { Ficha } from './elenco';
import type { DibujoProps } from './elencoAzteca';

const r1 = (v: number) => v.toFixed(1);
const NEGRO = W.negro;
const mece = (f: number, k = 1) => Math.sin(f / 15 + k) * 3;

// ---------- piezas de cabeza (coordenadas de la cabeza: cara de perfil a la derecha, ojo en 18,-6) ----------
/** Pluma de huia: negra con la punta blanca. */
const Huia: React.FC<{ x?: number; y?: number; ang?: number; l?: number }> = ({ x = -14, y = -44, ang = -50, l = 70 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${r1(ang + mece(f) * 0.5)})`}>
      <path d={`M-3 0 C -9 ${-l * 0.4}, -6 ${-l * 0.85}, 2 ${-l} C 8 ${-l * 0.8}, 7 ${-l * 0.4}, 3 0 Z`} fill={NEGRO} stroke={NEGRO} strokeWidth={1} />
      <path d={`M-5 ${-l * 0.82} C -4 ${-l * 0.93}, 0 ${-l}, 2 ${-l} C 6 ${-l * 0.92}, 6 ${-l * 0.86}, 5 ${-l * 0.8} Z`} fill={W.blanco} />
    </g>
  );
};
/** Moño (tikitiki) con peineta (heru) y pluma de huia. */
const Tikitiki: React.FC<{ pluma?: boolean; pelo?: string }> = ({ pluma = true, pelo = NEGRO }) => (
  <g>
    <path d="M-30 4 C -36 -26, -14 -42, 10 -38 C 22 -36, 28 -30, 30 -22 C 10 -30, -14 -26, -30 4 Z" fill={pelo} />
    <ellipse cx={-10} cy={-44} rx={15} ry={12} fill={pelo} />
    <path d="M-2 -52 l 4 -14 l 4 0 l 2 14 Z M4 -54 l 5 -12 l 4 1 l -2 13 Z" fill={W.crema} stroke={NEGRO} strokeWidth={1.2} />
    {pluma && <Huia x={-16} y={-48} ang={-60} l={66} />}
  </g>
);
/** Pelo suelto (mujeres): melena negra que cae por la espalda. */
const PeloSuelto: React.FC<{ c?: string; largo?: number }> = ({ c = NEGRO, largo = 1 }) => {
  const f = useCurrentFrame();
  const m = Math.sin(f / 20) * 3;
  return <path d={`M-30 6 C -36 -26, -14 -42, 10 -38 C 24 -36, 30 -28, 30 -18 C 14 -28, -6 -26, -16 -12 C -20 ${20 * largo}, ${-30 + m} ${50 * largo}, ${-42 + m} ${80 * largo} C ${-50 + m} ${60 * largo}, -48 ${30 * largo}, -30 6 Z`} fill={c} />;
};
/** Tīpare: vincha tejida con triángulos tāniko. */
const Tipare: React.FC<{ c?: string }> = ({ c = W.rojo }) => (
  <g>
    <path d="M-31 -4 C -18 -24, 8 -32, 31 -22" stroke={NEGRO} strokeWidth={11} fill="none" />
    <path d="M-31 -4 C -18 -24, 8 -32, 31 -22" stroke={c} strokeWidth={8} fill="none" />
    <path d="M-31 -4 C -18 -24, 8 -32, 31 -22" stroke={W.blanco} strokeWidth={3} strokeDasharray="4 6" fill="none" />
  </g>
);
/** Corona de hojas (Tāne, Haumia). helecho = frondas de helecho. */
const CoronaHojas: React.FC<{ helecho?: boolean }> = ({ helecho }) => {
  const f = useCurrentFrame();
  return <g>{[-60, -35, -10, 15].map((a, i) => <g key={i} transform={`translate(${-8 + i * 6} -30) rotate(${a + mece(f, i)})`}>
    {helecho ? <><path d="M0 0 C -4 -20, 4 -40, 0 -56 c 8 -4, 12 4, 6 8" stroke={W.helecho} strokeWidth={4} fill="none" />{[0.3, 0.5, 0.7].map((t) => <path key={t} d={`M0 ${-56 * t} l -10 -4 M0 ${-56 * t} l 10 -6`} stroke={W.helecho} strokeWidth={4} strokeLinecap="round" />)}</>
      : <path d="M0 0 C -12 -16, -10 -40, 0 -52 C 10 -40, 12 -16, 0 0 Z" fill={i % 2 ? W.helecho : '#5E8E46'} stroke={NEGRO} strokeWidth={1.4} />}
  </g>)}</g>;
};
/** Pelo de algas (Tangaroa, Hine-nui-te-pō). */
const PeloAlgas: React.FC<{ c?: string; largo?: number }> = ({ c = '#2F5A3A', largo = 1 }) => {
  const f = useCurrentFrame();
  return <g>{[0, 1, 2, 3, 4].map((i) => { const m = Math.sin(f / 14 + i) * 6; return <path key={i} d={`M${-26 + i * 9} -30 C ${-40 + i * 4} ${-10}, ${-50 + m} ${40 * largo}, ${-44 - i * 4 + m} ${(90 + i * 10) * largo}`} stroke={c} strokeWidth={7 - i * 0.6} fill="none" strokeLinecap="round" />; })}<path d="M-30 6 C -36 -26, -14 -42, 10 -38 C 24 -36, 30 -28, 30 -18 C 14 -28, -6 -26, -30 6 Z" fill={c} /></g>;
};
/** Pelo de tormenta (Tāwhirimātea): mechones grises revueltos con volutas de nube. */
const PeloTormenta: React.FC = () => {
  const f = useCurrentFrame();
  return <g>{[0, 1, 2, 3, 4, 5].map((i) => { const m = Math.sin(f / 6 + i) * 8; return <path key={i} d={`M${-20 + i * 6} -30 C ${-40 + i * 2} ${-60 + m}, ${-70 + m} ${-50 - i * 6}, ${-90 + m} ${-30 - i * 10}`} stroke="#C9D0DA" strokeWidth={8} fill="none" strokeLinecap="round" />; })}<path d="M-30 6 C -36 -26, -14 -42, 10 -38 C 24 -36, 30 -28, 30 -18 C 14 -28, -6 -26, -30 6 Z" fill="#B8C0CC" /></g>;
};
/** Pelo de fuego (Mahuika). */
const PeloFuego: React.FC = () => {
  const f = useCurrentFrame();
  return <g>{[0, 1, 2, 3, 4].map((i) => { const m = Math.sin(f / 3 + i) * 6; return <path key={i} d={`M${-26 + i * 10} -28 C ${-30 + i * 8} ${-60}, ${-20 + i * 6 + m} ${-80 - i * 4}, ${-10 + i * 8 + m} ${-100 - (i % 2) * 20} C ${-4 + i * 8} ${-70}, ${-6 + i * 8} ${-50}, ${-14 + i * 10} -28 Z`} fill={i % 2 ? '#F2A33D' : W.rojo} stroke={NEGRO} strokeWidth={1.2} />; })}<path d="M-30 6 C -36 -26, -14 -42, 10 -38 C 24 -36, 30 -28, 30 -18 C 14 -28, -6 -26, -30 6 Z" fill="#E8E2D6" /></g>;
};
/** Ojos de pounamu que brillan (Hine-nui-te-pō). */
const OjoPounamu: React.FC = () => {
  const f = useCurrentFrame();
  return <g><circle cx={18} cy={-6} r={16} fill={W.pounamuClaro} opacity={0.3 + Math.sin(f / 8) * 0.15} /><ellipse cx={18} cy={-6} rx={7} ry={5} fill={W.pounamuClaro} stroke={NEGRO} strokeWidth={1.4} /><circle cx={19} cy={-6} r={2} fill={NEGRO} /></g>;
};
/** Estrellas en el pelo (Tangotango, Ranginui). */
const EstrellasPelo: React.FC = () => <g>{[[-20, -30], [-6, -40], [-32, -6], [-38, 24]].map(([x, y], i) => <path key={i} transform={`translate(${x} ${y})`} d="M0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" fill="#FFF8E6" />)}</g>;
const FlorPelo: React.FC<{ c?: string }> = ({ c = W.rojo }) => <g transform="translate(-22 -26)">{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M0 0 L ${r1(Math.cos(i * 0.785) * 10)} ${r1(Math.sin(i * 0.785) * 10)}`} stroke={c} strokeWidth={3} />)}<circle r={3} fill={W.ocreClaro} /></g>;

// ---------- piezas de cuerpo (coordenadas del cuerpo: hombros y≈-300, cintura -210, pies 0) ----------
/** Colgante de pounamu (gota verde) con cordón. */
const Pounamu: React.FC = () => <g><path d="M-14 -300 Q 4 -270 26 -298" stroke={NEGRO} strokeWidth={1.6} fill="none" /><path d="M6 -282 C 0 -270, 2 -256, 8 -250 C 14 -256, 16 -270, 10 -282 Z" fill={W.pounamu} stroke={NEGRO} strokeWidth={1.4} /><path d="M7 -278 C 5 -270, 6 -262, 8 -258" stroke={W.pounamuClaro} strokeWidth={1.6} fill="none" /></g>;
/** Korowai: capa de lino sobre los hombros con borlas negras (hukahuka). */
const Korowai: React.FC<{ c?: string; borla?: string; plumas?: string[]; largo?: number }> = ({ c = '#D9C9A0', borla = NEGRO, plumas, largo = 1 }) => {
  const f = useCurrentFrame();
  const fondo = -300 + 120 * largo;
  return (
    <g>
      <path d={`M-30 -306 C -10 -314, 20 -314, 36 -302 C 44 -260, 42 ${fondo - 20}, 40 ${fondo} L -40 ${fondo} C -42 ${fondo - 30}, -40 -270, -30 -306 Z`} fill={c} stroke={NEGRO} strokeWidth={2.2} />
      {plumas && plumas.map((pc, i) => <path key={i} d={`M-38 ${-290 + i * (120 * largo) / plumas.length} H 40 V ${-290 + (i + 1) * (120 * largo) / plumas.length} H -38 Z`} fill={pc} opacity={0.9} />)}
      {Array.from({ length: Math.round(3 * largo) }, (_, j) => Array.from({ length: 6 }, (_, i) => { const px = -32 + i * 13, py = -282 + j * 34 + (i % 2) * 8; return <path key={`${j}${i}`} d={`M${px} ${py} q ${Math.sin(f / 10 + i + j) * 2} 8 0 14`} stroke={borla} strokeWidth={3} strokeLinecap="round" fill="none" />; }))}
      <path d={`M-40 ${fondo} H 40`} stroke={W.rojo} strokeWidth={5} />
      <path d={`M-40 ${fondo} H 40`} stroke={NEGRO} strokeWidth={2} strokeDasharray="6 6" />
    </g>
  );
};
/** Piupiu: falda de tiras de lino con franjas negras. */
const Piupiu: React.FC<{ c?: string; largo?: number }> = ({ c = W.harakeke, largo = 1 }) => {
  const f = useCurrentFrame();
  const bajo = -210 + 100 * largo;
  return <g><path d="M-36 -214 H 40" stroke="#5A3A22" strokeWidth={8} />{Array.from({ length: 14 }, (_, i) => { const px = -34 + i * 5.6, m = Math.sin(f / 9 + i) * 2; return <g key={i}><path d={`M${px} -210 L ${px + m} ${bajo}`} stroke={NEGRO} strokeWidth={5.6} /><path d={`M${px} -210 L ${px + m} ${bajo}`} stroke={c} strokeWidth={4} strokeDasharray={`14 6 8 6`} /></g>; })}</g>;
};
/** Taiaha: bastón de lucha con lengua tallada arriba, collar de plumas rojas y pelo blanco, y hoja plana abajo. */
const Taiaha: React.FC = () => {
  const idP = 'pauaTaiaha';
  return (
    <g transform="rotate(-4)">
      <DegradePaua id={idP} />
      <path d="M-4 150 L -5 -150 L 5 -150 L 4 150 Z" fill="#6A3A22" stroke={NEGRO} strokeWidth={2} />
      <path d="M-8 150 C -10 180, 10 180, 8 150 Z" fill="#6A3A22" stroke={NEGRO} strokeWidth={2} />
      <path d="M-8 -150 C -10 -170, -6 -190, 0 -200 C 6 -190, 10 -170, 8 -150 Z" fill="#6A3A22" stroke={NEGRO} strokeWidth={2} />
      <ellipse cx={-3} cy={-170} rx={3} ry={2} fill={`url(#${idP})`} /><ellipse cx={3} cy={-170} rx={3} ry={2} fill={`url(#${idP})`} />
      <path d="M-10 -142 C -16 -130, -14 -118, -8 -110 M10 -142 C 16 -130, 14 -118, 8 -110" stroke={W.rojo} strokeWidth={6} fill="none" />
      <path d="M-9 -112 C -14 -96, -10 -86, -6 -80 M9 -112 C 14 -96, 10 -86, 6 -80" stroke={W.blanco} strokeWidth={4} fill="none" />
    </g>
  );
};
/** Patu / mere de pounamu (garrote corto). */
const Patu: React.FC = () => <g transform="rotate(-10)"><path d="M-5 20 L -5 -10 C -16 -30, -18 -80, 0 -104 C 18 -80, 16 -30, 5 -10 L 5 20 Z" fill={W.pounamu} stroke={NEGRO} strokeWidth={2} /><path d="M0 -96 C -8 -70, -8 -40, -2 -16" stroke={W.pounamuClaro} strokeWidth={2.4} fill="none" /><circle cx={0} cy={14} r={3} fill={NEGRO} /></g>;
/** Toki (azuela de piedra) con mango. */
const Toki: React.FC = () => <g transform="rotate(-6)"><path d="M0 40 L 0 -90" stroke="#6A3A22" strokeWidth={8} strokeLinecap="round" /><path d="M0 -84 C 16 -90, 30 -84, 40 -70 L 34 -60 C 24 -70, 12 -72, 0 -68 Z" fill={W.pounamu} stroke={NEGRO} strokeWidth={2} /><path d="M-4 -80 h 10 M-4 -74 h 10" stroke={W.harakeke} strokeWidth={3} /></g>;
/** Hoe (remo). */
const Hoe: React.FC = () => <g transform="rotate(-8)"><path d="M0 -150 L 0 60" stroke="#6A3A22" strokeWidth={7} /><path d="M0 60 C -18 80, -16 140, 0 170 C 16 140, 18 80, 0 60 Z" fill={W.rojo} stroke={NEGRO} strokeWidth={2} /></g>;
/** Ko (palo de cavar). */
const Ko: React.FC = () => <g transform="rotate(-8)"><path d="M0 -130 L 0 120" stroke="#6A3A22" strokeWidth={7} /><path d="M-4 80 h 22 v 6 h -22 Z" fill="#6A3A22" stroke={NEGRO} strokeWidth={1.4} /><path d="M-3 120 L 0 150 L 3 120 Z" fill="#4A2A18" /></g>;
/** Quijada encantada en la mano (Māui). */
const KauaeMano: React.FC = () => {
  const f = useCurrentFrame();
  return <g transform="translate(6 -22) rotate(-20)"><circle r={34} fill="url(#haloBlanco)" opacity={0.5 + Math.sin(f / 6) * 0.15} /><path d="M-24 -10 C -26 16, 26 16, 24 -10 L 16 -10 C 14 6, -14 6, -16 -10 Z" fill={W.crema} stroke={NEGRO} strokeWidth={1.8} />{[-10, 0, 10].map((tx) => <path key={tx} d={`M${tx - 3} 2 l 3 -7 l 3 7`} fill={W.blanco} stroke={NEGRO} strokeWidth={1} />)}</g>;
};
/** Kūmara en la mano (Rongo). */
const KumaraMano: React.FC = () => <g transform="translate(6 -8) rotate(20)"><path d="M-10 -14 C 6 -24, 26 -10, 22 8 C 16 22, -10 18, -14 4 C -16 -4, -14 -10, -10 -14 Z" fill="#B0504A" stroke={NEGRO} strokeWidth={1.6} /><path d="M-6 -16 c -4 -10, 6 -14, 8 -6" stroke={W.helecho} strokeWidth={3} fill="none" /></g>;
/** Fronda de helecho en la mano (Haumia). */
const FrondaMano: React.FC = () => <g transform="rotate(-12)"><path d="M0 20 L 0 -110 c 10 -6, 16 4, 8 10" stroke={W.helecho} strokeWidth={4} fill="none" />{Array.from({ length: 7 }, (_, i) => <path key={i} d={`M0 ${-10 - i * 14} l ${-18 + i} -6 M0 ${-10 - i * 14} l ${18 - i} -8`} stroke={W.helecho} strokeWidth={5} strokeLinecap="round" />)}</g>;
/** Llama en los dedos (Mahuika). */
const LlamaMano: React.FC = () => {
  const f = useCurrentFrame();
  return <g transform="translate(4 -6)"><circle r={36} fill="url(#halo)" opacity={0.7} /><path d={`M0 0 C -12 -6, -14 -24, -4 -36 C -2 -26, 4 -24, 2 -42 C 14 -30, 16 -10, 0 0 Z`} fill="#F2A33D" stroke={W.rojo} strokeWidth={2} transform={`scale(${r1(1 + Math.sin(f / 3) * 0.1)})`} /></g>;
};
/** Pez en la mano (Tangaroa). */
const PezMano: React.FC = () => <g transform="translate(4 10) rotate(80)"><path d="M-26 0 C -14 -12, 14 -12, 24 0 C 14 12, -14 12, -26 0 Z" fill="#6A9AA8" stroke={NEGRO} strokeWidth={1.6} /><path d="M-24 0 l -12 -10 l 0 20 Z" fill="#6A9AA8" stroke={NEGRO} strokeWidth={1.4} /><circle cx={14} cy={-2} r={2.4} fill={NEGRO} /></g>;
/** Nubecitas alrededor (Tāwhirimātea). */
const NubesDetras: React.FC = () => {
  const f = useCurrentFrame();
  return <g>{[[-70, -380, 1], [60, -420, 0.8], [-110, -260, 0.7]].map(([x, y, s], i) => <g key={i} transform={`translate(${r1(x + Math.sin(f / 12 + i) * 10)} ${y}) scale(${s})`}><path d="M-50 10 C -60 -6, -40 -20, -26 -14 C -20 -32, 10 -34, 18 -18 C 34 -24, 54 -8, 44 10 Z" fill="#C9D0DA" stroke={NEGRO} strokeWidth={1.8} /></g>)}</g>;
};
/** Capa de estrellas (Tangotango, Hine-nui-te-pō, Ranginui). */
const CapaEstrellas: React.FC<{ c?: string }> = ({ c = '#1B2A55' }) => (
  <g>
    <path d="M-30 -306 C -10 -314, 20 -314, 36 -302 C 44 -240, 46 -120, 44 -40 L -46 -40 C -50 -120, -42 -250, -30 -306 Z" fill={c} stroke={NEGRO} strokeWidth={2.2} />
    {[[-20, -280], [10, -250], [-28, -200], [20, -170], [-10, -130], [26, -90], [-30, -70], [4, -60]].map(([x, y], i) => <path key={i} transform={`translate(${x} ${y})`} d="M0 -5 L 1.2 -1.2 L 5 0 L 1.2 1.2 L 0 5 L -1.2 1.2 L -5 0 L -1.2 -1.2 Z" fill="#FFF8E6" />)}
  </g>
);

// ---------- criaturas ----------
type Especie = 'kereru' | 'piwakawaka' | 'tui' | 'miromiro' | 'toutouwai' | 'riroriro' | 'kahu';
const AVES: Record<Especie, { t: number; cuerpo: string; pecho: string; cabeza: string; pico: string; cola: 'abanico' | 'larga' | 'corta' }> = {
  kereru: { t: 1.25, cuerpo: '#3E6E5A', pecho: '#F4F2EA', cabeza: '#5A4A7A', pico: W.rojo, cola: 'larga' },
  piwakawaka: { t: 0.6, cuerpo: '#6A5A46', pecho: '#D9A86A', cabeza: '#3A3028', pico: NEGRO, cola: 'abanico' },
  tui: { t: 0.95, cuerpo: '#1E2A2E', pecho: '#2A3E3A', cabeza: '#1E2A2E', pico: NEGRO, cola: 'larga' },
  miromiro: { t: 0.55, cuerpo: '#1E1A1A', pecho: '#F4F2EA', cabeza: '#1E1A1A', pico: NEGRO, cola: 'corta' },
  toutouwai: { t: 0.62, cuerpo: '#4A4A50', pecho: '#E8E2D0', cabeza: '#4A4A50', pico: NEGRO, cola: 'corta' },
  riroriro: { t: 0.48, cuerpo: '#7A8068', pecho: '#D8D8C4', cabeza: '#7A8068', pico: NEGRO, cola: 'corta' },
  kahu: { t: 1.5, cuerpo: '#6A4A2E', pecho: '#C9A87A', cabeza: '#7A5A3A', pico: '#E8C24A', cola: 'larga' },
};
/** Ave del bosque (de pie, o volando si está alta: y < 690). Origen = pies (o centro del cuerpo en vuelo). */
const Manu: React.FC<DibujoProps & { especie?: Especie; risa?: boolean }> = ({ x, y, s, voltear, opacity = 1, moviendo, f, especie = 'kereru', risa }) => {
  const a = AVES[especie], k = a.t;
  const volando = y < 690;
  const al = Math.sin(f * 0.55) * 1;
  const salto = !volando && moviendo ? -Math.abs(Math.sin(f / 4)) * 10 : 0;
  const tiembla = risa ? Math.sin(f * 1.6) * 3 : 0;
  const cola = a.cola === 'abanico'
    ? <g transform="translate(-30 -26)">{Array.from({ length: 7 }, (_, i) => { const ang = 150 + i * 14 + (risa ? Math.sin(f * 0.8) * 10 : Math.sin(f / 8) * 4); const rr = (ang * Math.PI) / 180; return <path key={i} d={`M0 0 L ${r1(Math.cos(rr) * 44)} ${r1(Math.sin(rr) * 44 - 10)}`} stroke={i % 2 ? NEGRO : W.blanco} strokeWidth={7} strokeLinecap="round" />; })}</g>
    : a.cola === 'larga' ? <path d="M-28 -30 L -62 -30 L -60 -20 L -26 -18 Z" fill={a.cuerpo} stroke={NEGRO} strokeWidth={1.6} />
      : <path d="M-28 -30 L -48 -34 L -48 -26 L -26 -20 Z" fill={a.cuerpo} stroke={NEGRO} strokeWidth={1.6} />;
  if (volando) {
    const ala = (sgn: number) => <path d={`M-6 -6 C ${-20} ${-30 * sgn * al - 10}, ${-50} ${-60 * sgn * al - 20}, ${-70} ${-50 * sgn * al - 30} C ${-40} ${-26 * sgn * al - 10}, ${-20} ${-10}, 6 -2 Z`} fill={a.cuerpo} stroke={NEGRO} strokeWidth={1.8} />;
    return (
      <g transform={`translate(${x} ${y}) scale(${voltear ? -s * k : s * k} ${s * k})`} opacity={opacity}>
        {ala(-1)}
        <path d="M-40 0 L -70 -10 L -66 10 Z" fill={a.cuerpo} stroke={NEGRO} strokeWidth={1.4} />
        <ellipse cx={0} cy={0} rx={38} ry={14} fill={a.cuerpo} stroke={NEGRO} strokeWidth={2} />
        <path d="M-20 6 C 0 14, 20 12, 30 4" stroke={a.pecho} strokeWidth={6} fill="none" />
        <circle cx={34} cy={-6} r={12} fill={a.cabeza} stroke={NEGRO} strokeWidth={2} />
        <path d={especie === 'kahu' ? 'M44 -8 C 54 -8, 56 0, 50 6 L 44 0 Z' : 'M44 -8 L 56 -4 L 44 0 Z'} fill={a.pico} stroke={NEGRO} strokeWidth={1} />
        <circle cx={38} cy={-9} r={2.4} fill={especie === 'kahu' ? '#E8C24A' : W.blanco} /><circle cx={38.6} cy={-9} r={1.3} fill={NEGRO} />
        {ala(1)}
      </g>
    );
  }
  return (
    <g transform={`translate(${x + tiembla} ${y + salto}) scale(${voltear ? -s * k : s * k} ${s * k})`} opacity={opacity}>
      {cola}
      <path d="M-4 -14 l -4 14 M8 -14 l 4 14" stroke={especie === 'kahu' ? '#E8C24A' : '#C9A060'} strokeWidth={3.4} strokeLinecap="round" />
      <path d={suave([[-34, -24], [-18, -50], [12, -54], [30, -40], [24, -16], [-6, -10]], true)} fill={a.cuerpo} stroke={NEGRO} strokeWidth={2} />
      <path d={suave([[4, -46], [24, -40], [22, -18], [2, -14], [-4, -28]], true)} fill={a.pecho} />
      {especie === 'tui' && <><circle cx={28} cy={-44} r={5} fill={W.blanco} stroke={NEGRO} strokeWidth={1} /><circle cx={23} cy={-40} r={4} fill={W.blanco} stroke={NEGRO} strokeWidth={1} /></>}
      <path d="M-24 -38 C -10 -48, 6 -46, 14 -36" stroke={NEGRO} strokeWidth={1.4} fill="none" opacity={0.5} />
      <g transform={`translate(24 ${-58 + (risa ? Math.sin(f * 1.6) * 2 : 0)})`}>
        <circle r={13} fill={a.cabeza} stroke={NEGRO} strokeWidth={2} />
        <path d={especie === 'kahu' ? 'M11 -4 C 22 -4, 24 6, 18 12 L 12 4 Z' : risa ? 'M11 -4 L 24 -6 L 13 0 L 24 6 L 11 3 Z' : 'M11 -4 L 22 -1 L 11 2 Z'} fill={a.pico} stroke={NEGRO} strokeWidth={1} />
        {especie === 'piwakawaka' && <path d="M-2 -8 L 12 -9" stroke={W.blanco} strokeWidth={2.4} />}
        <circle cx={5} cy={-3} r={2.8} fill={especie === 'kahu' ? '#E8C24A' : W.blanco} /><circle cx={5.6} cy={-3} r={1.5} fill={NEGRO} />
      </g>
    </g>
  );
};
const ave = (especie: Especie) => (p: DibujoProps) => <Manu {...p} especie={especie} />;

/** Kurī (el perro polinesio): pelo claro, cola tupida, orejas paradas. */
const Kuri: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, corriendo, f, color = '#E8DCC4', boca }) => {
  const fase = moviendo || corriendo ? f * (corriendo ? 0.4 : 0.22) : 0, amp = corriendo ? 30 : moviendo ? 18 : 0;
  const pata = (cx: number, ph: number) => { const a = Math.sin(fase + ph) * amp; return miembro([[cx, -60], [cx + Math.sin((a * Math.PI) / 180) * 30, -30], [cx + Math.sin((a * Math.PI) / 180) * 36, 0]], [18, 12, 10]); };
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={pata(-50, Math.PI)} fill={color} stroke={NEGRO} strokeWidth={1.8} />
      <path d={pata(40, 0)} fill={color} stroke={NEGRO} strokeWidth={1.8} />
      <path d={`M-70 -80 C -100 ${-110 + Math.sin(f / 6) * 10}, -110 -130, -96 -140 C -90 -120, -80 -100, -60 -86 Z`} fill={color} stroke={NEGRO} strokeWidth={1.8} />
      <path d={suave([[-74, -60], [-70, -92], [-20, -100], [40, -96], [64, -76], [50, -54], [-10, -50]], true)} fill={color} stroke={NEGRO} strokeWidth={2} />
      <path d={pata(-30, 0)} fill={color} stroke={NEGRO} strokeWidth={1.8} />
      <path d={pata(56, Math.PI)} fill={color} stroke={NEGRO} strokeWidth={1.8} />
      <g transform="translate(64 -100)">
        <path d="M-10 -14 L -4 -40 L 6 -16 Z M4 -16 L 14 -38 L 18 -12 Z" fill={color} stroke={NEGRO} strokeWidth={1.6} />
        <path d={suave([[-18, 10], [-14, -14], [10, -18], [30, -6], boca ? [44, 0] : [46, 4], [30, 14], [0, 18]], true)} fill={color} stroke={NEGRO} strokeWidth={2} />
        <circle cx={44} cy={2} r={4} fill={NEGRO} />
        <circle cx={14} cy={-6} r={3} fill={NEGRO} />
        {boca && <path d="M30 10 L 44 8 L 34 18 Z" fill={W.rojo} />}
      </g>
    </g>
  );
};
/** Ika (pez). Nada si se mueve; origen = centro. */
const Ika: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, color = '#6A9AA8' }) => {
  const c = Math.sin(f / 4) * 8;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-40 0 L -70 ${-20 + c} L -66 ${20 + c} Z`} fill={color} stroke={NEGRO} strokeWidth={1.8} />
      <path d="M-46 0 C -30 -26, 30 -28, 50 0 C 30 24, -30 24, -46 0 Z" fill={color} stroke={NEGRO} strokeWidth={2} />
      <path d="M-30 6 C 0 14, 30 12, 46 2" stroke={W.blanco} strokeWidth={4} fill="none" opacity={0.6} />
      <path d="M-6 -20 C 4 -32, 14 -30, 20 -20" fill={color} stroke={NEGRO} strokeWidth={1.4} />
      <circle cx={32} cy={-4} r={4} fill={W.blanco} stroke={NEGRO} strokeWidth={1} /><circle cx={33} cy={-4} r={2} fill={NEGRO} />
    </g>
  );
};
/** Mangō (tiburón). Origen = centro. */
const Mango: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, color = '#7A8A96' }) => {
  const c = Math.sin(f / 6) * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-110 0 L -160 ${-40 + c} L -150 0 L -160 ${30 + c} Z`} fill={color} stroke={NEGRO} strokeWidth={2} />
      <path d="M-120 0 C -80 -40, 80 -44, 140 -4 C 100 20, -60 26, -120 0 Z" fill={color} stroke={NEGRO} strokeWidth={2.4} />
      <path d="M-100 6 C -40 20, 60 18, 136 0" fill={W.blanco} opacity={0.7} />
      <path d="M-10 -32 L 10 -80 L 30 -36 Z" fill={color} stroke={NEGRO} strokeWidth={2} />
      <path d="M60 -14 v 16 M70 -14 v 16 M80 -14 v 14" stroke={NEGRO} strokeWidth={1.4} />
      <circle cx={104} cy={-10} r={4} fill={NEGRO} />
    </g>
  );
};
/** Tohorā (ballena). Origen = centro. */
const Tohora: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, color = '#3A4E6A' }) => {
  const c = Math.sin(f / 10) * 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-220 -10 C -260 ${-40 + c}, -300 ${-70 + c}, -320 ${-60 + c} C -290 ${-30 + c}, -290 ${0 + c}, -310 ${30 + c} C -270 ${20 + c}, -250 0, -220 10 Z`} fill={color} stroke={NEGRO} strokeWidth={2.4} />
      <path d="M-230 0 C -180 -90, 120 -110, 230 -30 C 250 -10, 240 30, 200 40 C 40 70, -160 60, -230 0 Z" fill={color} stroke={NEGRO} strokeWidth={3} />
      <path d="M-180 20 C -40 60, 120 56, 220 20" stroke="#C9D2DA" strokeWidth={14} fill="none" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-100 + i * 70} 34 q 30 6 60 0`} stroke={NEGRO} strokeWidth={1.6} fill="none" opacity={0.5} />)}
      <circle cx={160} cy={-20} r={6} fill={NEGRO} />
      <path d="M40 30 C 60 70, 30 90, 0 80 C 20 60, 20 44, 20 30 Z" fill={color} stroke={NEGRO} strokeWidth={2} />
    </g>
  );
};
/** Te Wheke-a-Muturangi: el gran pulpo. Origen = base de los tentáculos (en el agua). */
const Wheke: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, color = '#A8452E', boca }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
    {Array.from({ length: 8 }, (_, i) => {
      const base = -140 + i * 40, m = Math.sin(f / 9 + i) * 30;
      const pts: [number, number][] = [[base * 0.4, -60], [base * 0.8 + m * 0.3, -20], [base + m * 0.6, 20], [base * 1.3 + m, 0], [base * 1.6 + m * 0.6, -60 + Math.cos(f / 7 + i) * 20]];
      return <g key={i}>
        <path d={miembro(pts, [34, 28, 20, 12, 5])} fill={color} stroke={NEGRO} strokeWidth={2.2} />
        {pts.slice(1, 4).map(([px, py], j) => <circle key={j} cx={px} cy={py + 8} r={4} fill="#F2C8B0" stroke={NEGRO} strokeWidth={1} />)}
      </g>;
    })}
    <path d="M-110 -60 C -130 -200, -60 -300, 20 -300 C 110 -300, 150 -200, 110 -60 Z" fill={color} stroke={NEGRO} strokeWidth={3} />
    {[[-40, -200], [30, -240], [60, -160], [-60, -130]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={10} fill="#7A2A1E" opacity={0.6} />)}
    {[-30, 50].map((cx, i) => <g key={i}><ellipse cx={cx} cy={-100} rx={18} ry={14} fill="#F2E2A0" stroke={NEGRO} strokeWidth={2} /><rect x={cx - 3} y={-110} width={6} height={20} fill={NEGRO} /></g>)}
    {boca && <ellipse cx={10} cy={-64} rx={20} ry={10} fill={NEGRO} />}
  </g>
);
/** Taniwha: guardián del agua, largo como lagarto-dragón, con lomo de crestas y espirales; ojos de pāua. Origen = suelo, cola a la izquierda. */
const Taniwha: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, boca, f, color = '#2E5A5A' }) => {
  const n = 14, L = 620;
  const lomo: [number, number][] = Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return [-L + t * (L + 40), -50 - Math.sin(t * Math.PI) * 40 - Math.sin(t * 9 + f * (moviendo ? 0.25 : 0.08)) * 14 * (1 - t)]; });
  const anchos = lomo.map((_, i) => { const t = i / (n - 1); return 14 + Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.92) * 76; });
  const cab = lomo[n - 1];
  const idP = `pauaT${Math.round(x)}`;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <DegradePaua id={idP} />
      {[-430, -150].map((px, i) => <path key={i} d={miembro([[px, -50], [px + 24 + (moviendo ? Math.sin(f * 0.2 + i) * 16 : 0), -24], [px + 40, 0]], [34, 22, 16])} fill={color} stroke={NEGRO} strokeWidth={2.2} />)}
      <path d={miembro(lomo, anchos)} fill={color} stroke={NEGRO} strokeWidth={3} />
      {lomo.slice(1, -2).map(([px, py], i) => { const h = anchos[i + 1] * 0.5; return <path key={`c${i}`} d={`M${r1(px - 14)} ${r1(py - h + 6)} C ${r1(px - 8)} ${r1(py - h - 24)}, ${r1(px + 14)} ${r1(py - h - 24)}, ${r1(px + 12)} ${r1(py - h - 8)} c -4 6, -10 2, -6 -4`} fill={W.rojo} stroke={NEGRO} strokeWidth={1.6} />; })}
      {lomo.slice(2, -2).filter((_, i) => i % 2 === 0).map(([px, py], i) => <path key={`e${i}`} d={`M${r1(px - 10)} ${r1(py + 6)} c 0 -14, 18 -16, 20 -4 c 1 8, -8 10, -10 4`} stroke={W.pauaClaro} strokeWidth={2.4} fill="none" />)}
      {[-40, 60].map((px, i) => <path key={`q${i}`} d={miembro([[px, -50], [px + 24, -24], [px + 40, 0]], [34, 22, 16])} fill={color} stroke={NEGRO} strokeWidth={2.2} />)}
      <g transform={`translate(${r1(cab[0])} ${r1(cab[1])}) rotate(${boca ? -10 : 0})`}>
        <path d="M-10 -36 C 30 -54, 100 -46, 150 -24 C 154 -16, 150 -10, 140 -8 L 10 -4 Z" fill={color} stroke={NEGRO} strokeWidth={2.6} />
        <g transform={`rotate(${boca ? 16 : 0} 0 -4)`}><path d="M-10 -4 L 138 -8 C 140 6, 130 14, 112 16 C 70 20, 30 20, -10 22 Z" fill={color} stroke={NEGRO} strokeWidth={2.6} /></g>
        <path d="M24 -8 l 6 10 l 6 -10 M58 -9 l 6 10 l 6 -10 M92 -10 l 6 10 l 6 -10" fill={W.blanco} stroke={NEGRO} strokeWidth={1.2} />
        <ellipse cx={40} cy={-34} rx={13} ry={9} fill={`url(#${idP})`} stroke={W.blanco} strokeWidth={2.4} />
        <path d="M0 -40 c 10 -30, 40 -30, 40 -6" stroke={W.rojo} strokeWidth={5} fill="none" />
      </g>
    </g>
  );
};
/** Tuatara: reptil con cresta de púas blancas. */
const Tuatara: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#6A7A4A' }) => {
  const p = moviendo ? Math.sin(f / 3) * 10 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d="M-40 -14 C -80 -10, -110 -4, -130 4 C -100 -2, -70 -2, -40 -4 Z" fill={color} stroke={NEGRO} strokeWidth={1.6} />
      {[-20, 24].map((px, i) => <path key={i} d={`M${px} -12 l ${-10 + (i ? p : -p)} 12 l -6 0 M${px + 6} -12 l ${8 - (i ? p : -p)} 12 l 6 0`} stroke={NEGRO} strokeWidth={4} fill="none" strokeLinecap="round" />)}
      <path d={suave([[-44, -10], [-30, -30], [20, -32], [44, -24], [40, -6], [-20, -2]], true)} fill={color} stroke={NEGRO} strokeWidth={2} />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-36 + i * 9} ${-29 - Math.sin(i / 9 * Math.PI) * 3} l 3 -9 l 3 9`} fill={W.blanco} stroke={NEGRO} strokeWidth={0.8} />)}
      <g transform="translate(46 -22)"><path d={suave([[-10, 8], [-8, -10], [14, -12], [28, -2], [20, 8]], true)} fill={color} stroke={NEGRO} strokeWidth={2} /><circle cx={8} cy={-4} r={3} fill={NEGRO} /></g>
    </g>
  );
};
/** Wētā: insecto grande del bosque. */
const Weta: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#7A4A2A' }) => {
  const p = moviendo ? Math.sin(f / 2.5) * 6 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-20 -14 L -50 -40 L -60 0 M0 -14 l ${-8 + p} 14 M14 -14 l ${8 - p} 14`} stroke={NEGRO} strokeWidth={3} fill="none" strokeLinecap="round" />
      <ellipse cx={-6} cy={-20} rx={30} ry={12} fill={color} stroke={NEGRO} strokeWidth={2} />
      {[-24, -12, 0, 12].map((px) => <path key={px} d={`M${px} -30 v 18`} stroke={NEGRO} strokeWidth={1.2} opacity={0.6} />)}
      <circle cx={28} cy={-22} r={9} fill={color} stroke={NEGRO} strokeWidth={2} />
      <path d={`M32 -30 C 50 -60, 70 ${-70 + p}, 90 -60 M30 -30 C 40 -70, 60 ${-90 - p}, 76 -84`} stroke={NEGRO} strokeWidth={1.6} fill="none" />
    </g>
  );
};
/** Bebé envuelto en el moño de su madre y en algas (Māui recién nacido). Origen = centro. */
const PepiTikitiki: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 10) * 4}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
    <circle r={60} fill="url(#haloBlanco)" opacity={0.35} />
    <ellipse cx={0} cy={0} rx={42} ry={22} fill={NEGRO} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-40 + i * 24} -6 C ${-30 + i * 24} ${-30 + Math.sin(f / 9 + i) * 6}, ${-14 + i * 24} -20, ${-10 + i * 24} -36`} stroke="#4E7A3A" strokeWidth={5} fill="none" strokeLinecap="round" />)}
    <circle cx={28} cy={-10} r={13} fill="#A36A42" stroke={NEGRO} strokeWidth={1.6} />
    <path d="M30 -12 q 4 -2 8 0" stroke={NEGRO} strokeWidth={1.4} fill="none" />
  </g>
);

// ---------- fichas ----------
type PP = Partial<PersonajeProps>;
const H = (p: PP, nombre?: string): Ficha => ({ tipo: 'persona', p: { barba: false, tocado: null, collar: false, ropa: 'corta', ...p }, griego: nombre });
const M = (p: PP, nombre?: string): Ficha => ({ tipo: 'persona', p: { mujer: true, tocado: null, collar: false, ...p }, griego: nombre });
const D = (Dibujo: React.FC<DibujoProps>, p: Record<string, unknown> = {}, nombre?: string): Ficha => ({ tipo: 'dibujo', Dibujo, p, griego: nombre });

const PIEL_H = W.piel, PIEL_M = W.pielM;
const varon = (extra?: React.ReactNode, pluma = true) => <><Tikitiki pluma={pluma} />{extra}</>;

export const ELENCO_MAORI: Record<string, Ficha> = {
  // Los padres primordiales y sus hijos (atua)
  ranginui: H({ piel: '#22386A', gigante: true, s: 1.15, estrellado: true, ropa: 'desnudo', capa: '#101A3A', adornos: { cabeza: <><PeloSuelto c="#0E1630" /><EstrellasPelo /></>, cuerpo: <CapaEstrellas c="#14204A" /> } }, 'RANGINUI'),
  papatuanuku: M({ piel: '#7A4A2A', gigante: true, s: 1.1, ropaColor: W.helechoOsc, capa: '#4E7A3A', adornos: { cabeza: <><PeloSuelto c="#2A1A10" /><FlorPelo /><FlorPelo c={W.ocreClaro} /></>, cuerpo: <><Korowai c="#5E8A46" borla={W.helechoOsc} largo={1.6} /><Pounamu /></> } }, 'PAPATŪĀNUKU'),
  tane: H({ piel: PIEL_H, capa: '#3E6E3A', ropaColor: W.harakeke, adornos: { cabeza: <><Tikitiki pluma={false} /><CoronaHojas /></>, cuerpo: <><Piupiu /><Korowai c="#4E7A3A" borla={W.helechoOsc} /><Pounamu /></>, mano: <Toki /> } }, 'TĀNE'),
  tangaroa: H({ piel: '#3E7A86', capa: '#1F5A66', ropaColor: '#2F5A3A', adornos: { cabeza: <PeloAlgas />, cuerpo: <><Piupiu c="#4E8A6A" /><Pounamu /></>, mano: <PezMano /> } }, 'TANGAROA'),
  tawhirimatea: H({ piel: '#5A6A80', capa: '#8A96A8', ropaColor: '#6A7488', adornos: { cabeza: <PeloTormenta />, detras: <NubesDetras />, cuerpo: <Piupiu c="#9AA4B4" /> } }, 'TĀWHIRIMĀTEA'),
  tumatauenga: H({ piel: '#7A3A22', capa: W.rojo, ropaColor: W.harakeke, adornos: { cabeza: varon(), cuerpo: <><Piupiu /><Pounamu /></>, mano: <Taiaha /> } }, 'TŪMATAUENGA'),
  rongo: H({ piel: PIEL_H, capa: W.ocre, ropaColor: W.harakeke, adornos: { cabeza: <Tikitiki pluma={false} />, cuerpo: <><Piupiu /><Korowai c={W.ocreClaro} /></>, mano: <KumaraMano /> } }, 'RONGO'),
  haumia: H({ piel: PIEL_H, capa: '#6A7A3A', ropaColor: W.harakeke, adornos: { cabeza: <><Tikitiki pluma={false} /><CoronaHojas helecho /></>, cuerpo: <Piupiu />, mano: <FrondaMano /> } }, 'HAUMIA'),
  ruaumoko: H({ piel: '#B8461F', cuerpo: 'nino', ropa: 'desnudo', contorno: true, adornos: { cabeza: <Tikitiki pluma={false} /> } }, 'RŪAUMOKO'),
  // Las primeras mujeres
  hine_ahu_one: M({ piel: '#A8452E', ropaColor: W.harakeke, adornos: { cabeza: <PeloSuelto />, cuerpo: <Piupiu largo={1.3} /> } }, 'HINE-AHU-ONE'),
  hine_titama: M({ piel: '#B07A52', ropaColor: '#E8B08A', capa: '#F2C9A0', adornos: { cabeza: <><PeloSuelto /><FlorPelo c={W.blanco} /></>, cuerpo: <><Korowai c="#F4D9B8" borla={W.rojo} /><Pounamu /></> } }, 'HINE-TĪTAMA'),
  hine_nui_te_po: M({ piel: '#3A2E3E', gigante: true, s: 1.25, ropaColor: '#1A1424', capa: '#0E0A16', contorno: true, adornos: { cabeza: <><PeloAlgas c="#1E3A2A" largo={1.4} /><OjoPounamu /></>, cuerpo: <CapaEstrellas c="#1A1424" /> } }, 'HINE-NUI-TE-PŌ'),
  // Māui y su familia
  maui_tikitiki: H({ piel: PIEL_H, ropaColor: W.harakeke, adornos: { cabeza: varon(), cuerpo: <><Piupiu /><Pounamu /></>, mano: <KauaeMano /> } }, 'MĀUI'),
  maui_joven: H({ piel: PIEL_H, ropaColor: W.harakeke, adornos: { cabeza: varon(), cuerpo: <><Piupiu /><Pounamu /></> } }, 'MĀUI'),
  maui_nino: H({ piel: PIEL_H, cuerpo: 'nino', ropaColor: W.harakeke, adornos: { cabeza: varon(undefined, false), cuerpo: <Piupiu largo={0.8} /> } }, 'MĀUI'),
  maui_hermano: H({ piel: '#7E4C30', ropaColor: W.harakeke, capa: W.ocre, adornos: { cabeza: varon(undefined, false), cuerpo: <><Piupiu /><Korowai c="#CDBB90" /></>, mano: <Hoe /> } }, 'BROTHER'),
  taranga: M({ piel: PIEL_M, ropaColor: W.harakeke, adornos: { cabeza: <><PeloSuelto /><Tipare /></>, cuerpo: <><Korowai c="#E4D4AE" borla={NEGRO} largo={1.4} /><Pounamu /></> } }, 'TARANGA'),
  makeatutara: H({ piel: '#6E4A3A', canas: true, ropaColor: W.harakeke, capa: '#3A2A22', adornos: { cabeza: varon(), cuerpo: <><Korowai c="#BFAE86" borla={NEGRO} largo={1.4} /><Pounamu /></> } }, 'MAKEATUTARA'),
  muri_ranga_whenua: M({ piel: '#7A5A44', cuerpo: 'viejo', canas: true, ropaColor: W.harakeke, adornos: { cabeza: <PeloSuelto c="#E8E2D6" />, cuerpo: <Korowai c="#9A8A6A" borla={NEGRO} largo={1.4} /> } }, 'MURI-RANGA-WHENUA'),
  tama_nui_ki_te_rangi: H({ piel: PIEL_H, cuerpo: 'viejo', canas: true, ropaColor: W.harakeke, capa: '#9AB8D8', adornos: { cabeza: <Tikitiki pelo="#E8E2D6" />, cuerpo: <Korowai c="#DCE6F0" borla={W.pauaAzul} largo={1.4} /> } }, 'TAMA-NUI-KI-TE-RANGI'),
  mahuika: M({ piel: '#7A3A22', cuerpo: 'viejo', ropaColor: '#3A1A12', capa: W.rojoOsc, contorno: true, adornos: { cabeza: <PeloFuego />, cuerpo: <Korowai c="#5A2A1A" borla="#F2A33D" largo={1.4} />, mano: <LlamaMano />, manoAtras: <LlamaMano /> } }, 'MAHUIKA'),
  // Tāwhaki, Rātā y sus historias
  tawhaki: H({ piel: '#9A5A36', ropaColor: W.harakeke, capa: W.rojo, adornos: { cabeza: varon(), cuerpo: <><Piupiu /><Korowai c={W.blanco} plumas={['#3E6E5A', W.blanco, W.rojo]} /><Pounamu /></>, mano: <Taiaha /> } }, 'TĀWHAKI'),
  karihi: H({ piel: '#7E4C30', ropaColor: W.harakeke, adornos: { cabeza: varon(undefined, false), cuerpo: <><Piupiu /><Korowai c="#CDBB90" /></> } }, 'KARIHI'),
  tangotango: M({ piel: '#B88A62', ropaColor: '#DCE6F0', capa: '#9AB8D8', adornos: { cabeza: <><PeloSuelto /><EstrellasPelo /></>, cuerpo: <CapaEstrellas c="#3D5FB0" /> } }, 'TANGOTANGO'),
  matakerepo: M({ piel: '#7A5A44', cuerpo: 'viejo', canas: true, ojosCerrados: true, ropaColor: W.harakeke, adornos: { cabeza: <PeloSuelto c="#E8E2D6" />, cuerpo: <Korowai c="#9A8A6A" borla={NEGRO} largo={1.4} /> } }, 'MATAKEREPO'),
  ponaturi: H({ piel: '#7A9A8A', ropa: 'desnudo', contorno: true, adornos: { cabeza: <g><path d="M-30 -10 C -40 -40, -10 -60, 10 -40 L 16 -60 L 22 -36 L 34 -50 L 30 -24" fill="#4E7A6A" stroke={NEGRO} strokeWidth={1.6} /></g> } }, 'PONATURI'),
  rata_toa: H({ piel: PIEL_H, ropaColor: W.harakeke, capa: W.ocre, adornos: { cabeza: varon(), cuerpo: <><Piupiu /><Korowai c="#E4D4AE" /><Pounamu /></>, mano: <Toki /> } }, 'RĀTĀ'),
  matuku_tangotango: H({ piel: '#3A2A2A', gigante: true, s: 1.2, ropa: 'corta', ropaColor: '#2A1A1A', pelo: '#120C0A', adornos: { cabeza: <PeloTormenta /> } }, 'MATUKU-TANGOTANGO'),
  hakuturi: H({ piel: '#5E8A4A', cuerpo: 'nino', ropa: 'desnudo', contorno: true, adornos: { cabeza: <CoronaHojas /> } }, 'HAKUTURI'),
  // Kupe y su viaje
  kupe: H({ piel: '#8A5434', ropaColor: W.harakeke, capa: W.rojoOsc, adornos: { cabeza: varon(), cuerpo: <><Piupiu /><Korowai c={W.blanco} plumas={[W.rojo, W.blanco, '#3E6E5A']} largo={1.2} /><Pounamu /></>, mano: <Taiaha /> } }, 'KUPE'),
  kuramarotini: M({ piel: PIEL_M, ropaColor: W.harakeke, adornos: { cabeza: <><PeloSuelto /><Tipare c={W.pauaAzul} /></>, cuerpo: <><Korowai c="#E4D4AE" borla={W.rojo} largo={1.4} /><Pounamu /></> } }, 'KURAMĀRŌTINI'),
  hoturapa: H({ piel: '#7E4C30', ropaColor: W.harakeke, adornos: { cabeza: varon(undefined, false), cuerpo: <><Piupiu /><Pounamu /></>, mano: <Hoe /> } }, 'HOTURAPA'),
  muturangi: H({ piel: '#6E4A3A', cuerpo: 'viejo', canas: true, ropaColor: W.harakeke, capa: '#3A2A22', adornos: { cabeza: <Tikitiki pelo="#E8E2D6" />, cuerpo: <Korowai c="#2A2A2A" borla={W.blanco} largo={1.4} /> } }, 'MUTURANGI'),
  // Gente
  tangata: H({ piel: PIEL_H, ropaColor: W.harakeke, adornos: { cabeza: varon(undefined, false), cuerpo: <Piupiu /> } }),
  wahine: M({ piel: PIEL_M, ropaColor: W.harakeke, adornos: { cabeza: <><PeloSuelto /><Tipare /></>, cuerpo: <Korowai c="#E4D4AE" largo={1.4} /> } }),
  kaumatua: H({ piel: PIEL_H, cuerpo: 'viejo', canas: true, ropaColor: W.harakeke, adornos: { cabeza: <Tikitiki pelo="#E8E2D6" pluma={false} />, cuerpo: <Korowai c="#CDBB90" largo={1.4} /> } }, 'ELDER'),
  kuia: M({ piel: PIEL_M, cuerpo: 'viejo', canas: true, ropaColor: W.harakeke, adornos: { cabeza: <PeloSuelto c="#E8E2D6" />, cuerpo: <Korowai c="#9A8A6A" largo={1.4} /> } }, 'GRANDMOTHER'),
  rangatira: H({ piel: PIEL_H, ropaColor: W.harakeke, capa: W.rojoOsc, adornos: { cabeza: varon(), cuerpo: <><Piupiu /><Korowai c={W.blanco} plumas={['#3E6E5A', W.blanco]} /><Pounamu /></>, mano: <Patu /> } }, 'CHIEF'),
  tohunga: H({ piel: '#6E4A3A', cuerpo: 'viejo', canas: true, ropaColor: W.harakeke, capa: '#2A2A2A', adornos: { cabeza: <Tikitiki pelo="#E8E2D6" />, cuerpo: <Korowai c="#2A2A2A" borla={W.blanco} largo={1.4} /> } }, 'TOHUNGA'),
  toa: H({ piel: PIEL_H, ropaColor: W.harakeke, adornos: { cabeza: varon(), cuerpo: <Piupiu />, mano: <Patu /> } }, 'WARRIOR'),
  tamaiti: H({ piel: PIEL_H, cuerpo: 'nino', ropaColor: W.harakeke, adornos: { cabeza: varon(undefined, false), cuerpo: <Piupiu largo={0.8} /> } }),
  kotiro: M({ piel: PIEL_M, cuerpo: 'nino', ropaColor: W.harakeke, adornos: { cabeza: <PeloSuelto largo={0.7} /> } }),
  // Criaturas
  kereru: D(ave('kereru'), {}, 'KERERŪ'),
  piwakawaka: D(ave('piwakawaka'), {}, 'FANTAIL'),
  piwakawaka_risa: D((p) => <Manu {...p} especie="piwakawaka" risa />, {}, 'FANTAIL'),
  tui: D(ave('tui'), {}, 'TŪĪ'),
  miromiro: D(ave('miromiro'), {}, 'TOMTIT'),
  toutouwai: D(ave('toutouwai'), {}, 'ROBIN'),
  riroriro: D(ave('riroriro'), {}, 'WARBLER'),
  kahu: D(ave('kahu'), {}, 'HAWK'),
  kuri: D(Kuri, {}, 'KURĪ'),
  ika: D(Ika, {}, 'FISH'),
  mango: D(Mango, {}, 'SHARK'),
  tohora: D(Tohora, {}, 'WHALE'),
  wheke: D(Wheke, { s: 0.9 }, 'TE WHEKE'),
  taniwha: D(Taniwha, {}, 'TANIWHA'),
  tuatara: D(Tuatara, { s: 1.3 }, 'TUATARA'),
  weta: D(Weta, { s: 1.1 }, 'WĒTĀ'),
  pepi_tikitiki: D(PepiTikitiki, {}, ''),
};

/** Nombres en pantalla (inglés, con macrones) cuando difieren de la ficha. */
export const NOMBRE_EN_MAORI: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_MAORI).filter(([, f]) => f.griego).map(([k, f]) => [k, f.griego as string]));
