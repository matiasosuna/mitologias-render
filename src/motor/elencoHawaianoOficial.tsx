// Diseños oficiales hawaianos (2026-10-15) para los Shorts "Who is…?" y los episodios nuevos (tema kapa).
// Mismo muñeco del canal con piel natural, ropa simple de kapa y 2–3 señas que se reconocen de un vistazo.
// Cultura viva: iconografía tradicional y respetuosa (pāʻū, malo, kīhei, lei, ʻahuʻula, mahiole), sin caricatura.
// Los pele/hiiaka/maui/… de elenco.tsx quedan intactos; estas son las claves *_oficial.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, type PersonajeProps } from '../comun/vasija';
import type { Ficha } from './elenco';
import { N, r1, PeloLargo, PeloMedio, Mono, BarbaCorta, CoronaFlores, Lehua, Kihei, BandaFalda, CapaEspalda, Aura } from './piezasPolinesias';

const PELO = '#1E1611', PELO_LUZ = '#5E4A3A';
const PIEL_H = '#8E5636', PIEL_M = '#A66B43';
const ROJO = '#B2331F', AMARILLO = '#E8B81C', CREMA = '#F4E6C8';

// ---------- collares ----------
/** Lei de flores: la parte que se ve de perfil, del cuello al pecho. */
const LeiFlores: React.FC<{ colores: string[]; lehua?: boolean }> = ({ colores, lehua }) => (
  <g>{Array.from({ length: 6 }, (_, i) => { const t = i / 5, cx = 2 + t * 26 + Math.sin(t * Math.PI) * 4, cy = -300 + t * 40; return lehua ? <Lehua key={i} x={cx} y={cy} r={6.5} c={colores[i % colores.length]} /> : <g key={i}><circle cx={r1(cx)} cy={r1(cy)} r={6.5} fill={colores[i % colores.length]} stroke={N} strokeWidth={1.4} /><circle cx={r1(cx)} cy={r1(cy)} r={2} fill="#F2C94C" /></g>; })}</g>
);
/** Lei maile: guirnalda abierta de hojas que cuelga del cuello por el pecho. */
const LeiMaile: React.FC<{ c?: string }> = ({ c = '#4E7A3A' }) => {
  const f = useCurrentFrame(), m = Math.sin(f / 20) * 1.5;
  const linea: [number, number][] = [[-14, -304], [6, -296], [24, -284], [30, -258], [30 + m, -232]];
  return <g><path d={suave(linea)} stroke={N} strokeWidth={8} fill="none" strokeLinecap="round" /><path d={suave(linea)} stroke={c} strokeWidth={5.5} fill="none" strokeLinecap="round" />{linea.slice(1).map(([x, y], i) => <g key={i}><ellipse cx={x - 4} cy={y} rx={6} ry={3} fill={c} stroke={N} strokeWidth={1} transform={`rotate(${40 + i * 15} ${x - 4} ${y})`} /><ellipse cx={x + 4} cy={y + 3} rx={6} ry={3} fill="#6E9A4E" stroke={N} strokeWidth={1} transform={`rotate(${-30 + i * 10} ${x + 4} ${y + 3})`} /></g>)}</g>;
};
/** Lei niho palaoa: cordón de pelo trenzado con el colgante blanco en forma de gancho (insignia de jefe). */
const LeiNiho: React.FC = () => (
  <g>
    <path d="M-16 -304 Q 6 -268 30 -300" stroke={N} strokeWidth={5} fill="none" />
    <path d="M-16 -304 Q 6 -268 30 -300" stroke="#3A2A20" strokeWidth={3} strokeDasharray="3 2" fill="none" />
    <path d="M4 -284 C 2 -270, 8 -262, 18 -262 C 24 -262, 26 -270, 22 -274 C 20 -268, 12 -268, 12 -284 Z" fill="#F6EEDC" stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
  </g>
);
/** Collar de colmillos de jabalí (Kamapuaʻa). */
const LeiColmillos: React.FC = () => (
  <g>
    <path d="M-18 -304 Q 8 -262 34 -298" stroke={N} strokeWidth={2.4} fill="none" />
    {[0.45, 0.62, 0.79].map((t, i) => { const x = -18 + t * 52, y = -304 + Math.sin(t * Math.PI) * 34; return <path key={i} d={`M${r1(x - 4)} ${r1(y)} C ${r1(x - 6)} ${r1(y + 14)}, ${r1(x + 2)} ${r1(y + 26)}, ${r1(x + 12)} ${r1(y + 28)} C ${r1(x + 6)} ${r1(y + 18)}, ${r1(x + 4)} ${r1(y + 8)}, ${r1(x + 4)} ${r1(y)} Z`} fill="#F4ECD8" stroke={N} strokeWidth={1.3} />; })}
  </g>
);

// ---------- cabeza ----------
/** Mahiole: casco de plumas con cresta (rojo con borde amarillo). */
const Mahiole: React.FC = () => (
  <g>
    <path d="M-34 8 C -40 -30, -18 -46, 8 -44 C 26 -42, 32 -30, 30 -18 L 22 -18 C 10 -26, -10 -24, -22 -4 L -24 14 Z" fill={ROJO} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-30 -6 C -34 -50, -8 -76, 20 -60 C 30 -54, 34 -42, 30 -30 C 24 -44, 4 -50, -10 -40 C -22 -30, -28 -18, -30 -6 Z" fill={AMARILLO} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-24 -30 C -16 -52, 4 -62, 22 -52" stroke={ROJO} strokeWidth={4} fill="none" />
    <path d="M-26 -14 C -18 -24, 0 -30, 22 -24" stroke={AMARILLO} strokeWidth={3} fill="none" />
  </g>
);
/** Pelo de cerdas (Kamapuaʻa): corto, tieso y en punta por todo el borde, con una crin de cerdas que baja por la nuca. */
const CrestaCerdas: React.FC = () => {
  const f = useCurrentFrame(), m = Math.sin(f / 16) * 0.8;
  const filo: [number, number][] = [[18, -30], [8, -38], [-4, -42], [-16, -40], [-26, -33], [-33, -22], [-37, -8], [-38, 6], [-38, 20], [-37, 34], [-35, 48], [-33, 62]];
  const pts: [number, number][] = [];
  filo.forEach(([x, y], i) => {
    if (i === filo.length - 1) return;
    const [x2, y2] = filo[i + 1], nx = (y2 - y), ny = -(x2 - x), n = Math.hypot(nx, ny) || 1, l = (i > 6 ? 11 : 8) + (i % 2) * 2 + m;
    pts.push([x, y], [(x + x2) / 2 + (nx / n) * l, (y + y2) / 2 + (ny / n) * l]);
  });
  pts.push(filo[filo.length - 1]);
  return (
    <g>
      <path d={`M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L ')} L -24 60 L -22 36 L -16 14 L -10 4 L -4 6 L -2 -8 L 6 -20 L 16 -24 Z`} fill="#161110" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      {[[-6, -34, -10, -26], [-20, -30, -22, -20], [-30, -12, -28, -2], [-32, 14, -29, 24], [-31, 38, -28, 48]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L ${c} ${d}`} stroke="#5A4A40" strokeWidth={1.4} strokeLinecap="round" />)}
    </g>
  );
};
/** Cerdas que asoman por la espalda bajo la capa (Kamapuaʻa escondía así su lomo de cerdo). a = ancho. */
const LomoCerdas: React.FC<{ a: number }> = ({ a }) => (
  <g>{Array.from({ length: 7 }, (_, i) => { const y = -298 + i * 12, x = -30 * a + (i < 2 ? 4 - i * 2 : 0) + 2; return <path key={i} d={`M${r1(x + 4)} ${y - 5} L ${r1(x - 13 - (i % 2) * 3)} ${y + 2} L ${r1(x + 4)} ${y + 7} Z`} fill="#161110" stroke={N} strokeWidth={1.2} strokeLinejoin="round" />; })}</g>
);
/** Capucha de kapa blanca (Poliʻahu): cubre la cabeza y cae por la espalda, la cara queda libre. */
const Capucha: React.FC = () => {
  const f = useCurrentFrame(), m = Math.sin(f / 18) * 2;
  return (
    <g>
      <path d={suave([[26, -24], [18, -40], [-4, -50], [-28, -42], [-42, -16], [-48, 30], [-54 + m, 90], [-30 + m, 96], [-20, 60], [-16, 30], [-10, 8], [-4, 2], [0, -12], [8, -24], [18, -30]], true, 0.8)} fill="#FBF8F2" stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M26 -24 C 14 -32, 0 -30, -6 -16 C -10 -4, -8 6, -4 10" stroke="#C9DCE8" strokeWidth={4} fill="none" strokeLinecap="round" />
      {[[-30, -30], [-40, 14], [-42, 60]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l 4 -6 l 4 6 l -4 6 Z`} fill="#9FC3DB" />)}
    </g>
  );
};
/** Luna creciente detrás de la cabeza (Hina). */
const LunaDetras: React.FC = () => (
  <g transform="translate(-30 -372)">
    <circle r={56} fill="url(#haloBlanco)" opacity={0.7} />
    <path d="M10 -40 A 42 42 0 1 0 10 40 A 32 32 0 1 1 10 -40 Z" fill="#F4EEDC" stroke={N} strokeWidth={2} />
  </g>
);
/** Copos de nieve que caen alrededor (Poliʻahu). */
const Copos: React.FC = () => {
  const f = useCurrentFrame();
  return <g>{Array.from({ length: 9 }, (_, i) => { const x = -110 + ((i * 47) % 220), y = -440 + ((f * (0.8 + (i % 3) * 0.3) + i * 53) % 420); return <g key={i} transform={`translate(${r1(x + Math.sin(f / 20 + i) * 8)} ${r1(y)})`} opacity={0.85}><path d="M-5 0 H 5 M0 -5 V 5 M-3.5 -3.5 L 3.5 3.5 M-3.5 3.5 L 3.5 -3.5" stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" /></g>; })}</g>;
};

// ---------- en la mano (origen = la mano) ----------
/** Fuego en la palma (Pele). */
const FuegoMano: React.FC = () => {
  const f = useCurrentFrame(), s = 1 + Math.sin(f / 3) * 0.08, l = Math.sin(f / 5) * 3;
  return (
    <g transform="translate(14 -10)">
      <circle r={44} fill="url(#halo)" opacity={0.85} />
      <g transform={`scale(${r1(s)})`}>
        <path d={`M0 6 C -18 0, -18 -22, -8 -36 C -6 -26, 0 -26, -2 -48 C ${12 + l} -34, 20 -12, 0 6 Z`} fill="#E8521F" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
        <path d={`M0 2 C -9 -2, -10 -14, -4 -22 C -2 -16, 4 -16, 3 -28 C ${10 + l * 0.5} -18, 10 -6, 0 2 Z`} fill="#F7B733" />
      </g>
    </g>
  );
};
/** Rama de ʻōhiʻa lehua (Hiʻiaka). */
const RamaLehua: React.FC = () => (
  <g transform="rotate(-8)">
    <path d="M0 30 C 2 -10, -2 -50, 6 -96" stroke="#5A3A22" strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M2 -40 C 14 -50, 20 -60, 24 -74" stroke="#5A3A22" strokeWidth={3} fill="none" />
    {[[-8, -30, -30], [12, -56, 30], [-6, -72, -20], [18, -88, 40]].map(([x, y, a], i) => <ellipse key={i} cx={x} cy={y} rx={9} ry={4.5} fill="#4E7A3A" stroke={N} strokeWidth={1.2} transform={`rotate(${a} ${x} ${y})`} />)}
    <Lehua x={6} y={-102} r={11} /><Lehua x={26} y={-80} r={9} /><Lehua x={-4} y={-60} r={7} />
  </g>
);
/** Manaiakalani: anzuelo grande de hueso con amarre y la cuerda que sube al hombro (Māui hawaiano). */
const Manaiakalani: React.FC = () => {
  const f = useCurrentFrame(), m = Math.sin(f / 14) * 2;
  const anz = 'M0 -104 L 0 6 C 0 44, 52 44, 52 6 L 52 -12';
  return (
    <g transform="translate(-4 0)">
      <path d={`M0 -104 C -20 -120, -50 ${-100 + m}, -64 -108`} stroke="#8C6B3A" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={anz} stroke={N} strokeWidth={17} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={anz} stroke="#F2E8D2" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M45 -10 L 52 -30 L 59 -10 Z" fill="#F2E8D2" stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-3 -96 C 3 -60, 3 -20, 4 2" stroke="#D8CBB0" strokeWidth={2.4} fill="none" />
      {[-100, -94, -88, -82].map((y) => <path key={y} d={`M-7 ${y} l 14 3`} stroke="#5A3A22" strokeWidth={2.6} />)}
    </g>
  );
};
/** Rollo de cuerda en bandolera (Māui hawaiano). */
const RolloCuerda: React.FC = () => (
  <g>
    <path d="M-30 -296 C -10 -300, 20 -270, 28 -226" stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M-30 -296 C -10 -300, 20 -270, 28 -226" stroke="#A8844E" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray="5 3" />
  </g>
);
/** Ipu de agua dulce colgando de la mano de atrás, con un hilo de agua (Kāne). */
const IpuAgua: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g transform="translate(2 4) rotate(-20)">
      <path d="M-2 0 C -4 8, -6 12, -6 16" stroke="#5A3A22" strokeWidth={2.4} fill="none" />
      <path d="M-6 14 C -26 18, -30 50, -14 62 C 0 72, 22 66, 24 48 C 26 30, 12 16, -6 14 Z" fill="#C99A4E" stroke={N} strokeWidth={2} />
      <path d="M-22 40 C -8 34, 10 34, 22 40" stroke="#7A4A22" strokeWidth={3} fill="none" />
      <path d="M-20 48 l 5 -6 l 5 6 l 5 -6 l 5 6 l 5 -6 l 5 6" stroke="#7A4A22" strokeWidth={1.6} fill="none" />
      <ellipse cx={-6} cy={14} rx={7} ry={3} fill="#3A2416" stroke={N} strokeWidth={1.2} />
      {[0, 1, 2].map((i) => { const y = 20 + ((f * 2 + i * 14) % 42); return <ellipse key={i} cx={-12 - y * 0.1} cy={r1(y + 10)} rx={2.6} ry={3.6} fill="#8FD3E8" stroke="#2C7A96" strokeWidth={1} opacity={0.9} />; })}
    </g>
  );
};
/** Bastón de madera de Kāne (con él abre manantiales en la roca). */
const Baston: React.FC = () => (
  <g transform="rotate(7)">
    <path d="M0 196 L 0 -150" stroke={N} strokeWidth={11} strokeLinecap="round" />
    <path d="M0 194 L 0 -148" stroke="#9A6A3A" strokeWidth={6.5} strokeLinecap="round" />
    <path d="M-6 -136 h 12 M-6 -128 h 12" stroke={AMARILLO} strokeWidth={3} />
  </g>
);
/** Hoe (remo) de Kanaloa. */
const Remo: React.FC = () => (
  <g transform="rotate(8)">
    <path d="M0 -150 L 0 70" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 -148 L 0 70" stroke="#8A5A2E" strokeWidth={5.5} strokeLinecap="round" />
    <path d="M0 64 C -20 84, -18 150, 0 178 C 18 150, 20 84, 0 64 Z" fill="#8A5A2E" stroke={N} strokeWidth={2.5} />
    <path d="M0 80 V 164" stroke="#5E3A1E" strokeWidth={2} />
  </g>
);
/** Ihe: lanza larga de guerra (Kū). */
const Ihe: React.FC = () => (
  <g transform="rotate(4)">
    <path d="M0 196 L 0 -210" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 194 L 0 -208" stroke="#5E3A1E" strokeWidth={5.5} strokeLinecap="round" />
    <path d="M0 -262 C 9 -244, 9 -222, 4 -206 H -4 C -9 -222, -9 -244, 0 -262 Z" fill="#3E2A1A" stroke={N} strokeWidth={2.2} />
    <path d="M-6 -196 h 12 M-6 -188 h 12" stroke={ROJO} strokeWidth={3} />
  </g>
);
/** Akua loa de Lono: pértiga alta con travesaño y kapa blanca colgando, ramilletes de helecho arriba. */
const AkuaLoa: React.FC = () => {
  const f = useCurrentFrame(), m = (k: number) => Math.sin(f / 15 + k) * 3;
  const T = -286; // travesaño
  return (
    <g>
      <path d={`M0 196 L 0 ${T - 22}`} stroke={N} strokeWidth={10} strokeLinecap="round" />
      <path d={`M0 194 L 0 ${T - 20}`} stroke="#9A6A3A" strokeWidth={5.5} strokeLinecap="round" />
      <path d={`M-42 ${T} H 46`} stroke={N} strokeWidth={9} strokeLinecap="round" />
      <path d={`M-41 ${T} H 45`} stroke="#9A6A3A" strokeWidth={5} strokeLinecap="round" />
      <path d={`M-38 ${T + 2} L 42 ${T + 2} L ${42 + m(1)} ${T + 86} L ${22 + m(2)} ${T + 76} L ${2 + m(3)} ${T + 88} L ${-18 + m(2)} ${T + 76} L ${-38 + m(0)} ${T + 86} Z`} fill="#FBF6EA" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      {[T + 28, T + 52].map((y) => <path key={y} d={`M-36 ${y} H 40`} stroke="#C9A06A" strokeWidth={3} strokeDasharray="8 5" />)}
      {[-36, 40].map((x) => <g key={x}>{[0, 1, 2].map((i) => <path key={i} d={`M${x} ${T} C ${x + (i - 1) * 6} ${T + 14}, ${x + (i - 1) * 9 + m(i)} ${T + 34}, ${x + (i - 1) * 11 + m(i)} ${T + 50}`} stroke="#4E7A3A" strokeWidth={3.5} fill="none" strokeLinecap="round" />)}</g>)}
      <path d={`M0 ${T - 20} C -12 ${T - 40}, -9 ${T - 52}, 0 ${T - 58} C 9 ${T - 52}, 12 ${T - 40}, 0 ${T - 20} Z`} fill="#4E7A3A" stroke={N} strokeWidth={1.6} />
    </g>
  );
};
/** ʻIe kuku: batidor de kapa (Hina). */
const Batidor: React.FC = () => (
  <g transform="rotate(10)">
    <path d="M0 22 L 0 -36" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 20 L 0 -34" stroke="#7A4A28" strokeWidth={6} strokeLinecap="round" />
    <rect x={-12} y={-112} width={24} height={78} rx={3} fill="#7A4A28" stroke={N} strokeWidth={2.5} />
    {[-100, -88, -76, -64, -52].map((y) => <path key={y} d={`M-11 ${y} h 22`} stroke="#4A2A14" strokeWidth={1.6} />)}
  </g>
);
/** Lāʻau (garrote corto) de Kamapuaʻa. */
const Laau: React.FC = () => (
  <g transform="rotate(-14)">
    <path d="M0 24 L 0 -20" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 22 L 0 -20" stroke="#5E3A1E" strokeWidth={6} strokeLinecap="round" />
    <path d="M-7 -18 C -14 -50, -12 -84, 0 -100 C 12 -84, 14 -50, 7 -18 Z" fill="#5E3A1E" stroke={N} strokeWidth={2.2} />
    <path d="M-4 -40 C -6 -60, -4 -76, 0 -88" stroke="#8A5A32" strokeWidth={2} fill="none" />
  </g>
);

// ---------- fichas ----------
type PP = Partial<PersonajeProps>;
const H = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: { barba: false, peloCorto: true, tocado: null, collar: false, ropa: 'corta', piel: PIEL_H, pelo: PELO, ...p }, griego: nombre });
const M = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: { mujer: true, peloCorto: true, tocado: null, collar: false, ropa: 'larga', piel: PIEL_M, pelo: PELO, ...p }, griego: nombre });

export const ELENCO_HAWAIANO_OFICIAL: Record<string, Ficha> = {
  // Pele: diosa del volcán. Pelo negro largo con puntas de brasa, pāʻū rojo con banda de lava, fuego en la mano y resplandor.
  pele_oficial: M({ ropaColor: '#B8321E', ribete: '#F28C28', adornos: {
    detras: <Aura id="auraPele" c="#FF6A1F" y={-290} r={190} fuerza={0.55} />,
    cabeza: <PeloLargo c={PELO} luz="#7A3A22" largo={1.2} volumen={1.25} puntas="#F27A2A" />,
    cuerpo: <><Kihei a={0.92} c="#1E1410" borde="#F28C28" motivo="#E8521F" /><BandaFalda larga y={-62} alto={26} c="#F28C28" fondo="#1E1410" /><LeiFlores colores={['#E8521F', '#F7B733']} /></>,
    mano: <FuegoMano />,
  } }, 'PELE'),
  // Hiʻiaka: hermana menor de Pele, joven. Corona y lei de lehua, pāʻū verde del bosque y una rama de ʻōhiʻa lehua.
  hiiaka_oficial: M({ s: 0.93, piel: '#AE7248', ropaColor: '#4E7A3A', ribete: '#D3263A', adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.9} /><CoronaFlores colores={['#D3263A', '#E8403E']} r={6} /></>,
    cuerpo: <><Kihei a={0.92} c="#6E9A4E" borde="#D3263A" /><BandaFalda larga y={-58} alto={20} c="#2F5228" motivo="rombos" /><LeiFlores colores={['#D3263A', '#C21D33']} lehua /></>,
    mano: <RamaLehua />,
  } }, 'HIʻIAKA'),
  // Māui: semidiós joven y pícaro. Gran anzuelo de hueso Manaiakalani con su cuerda, malo rojo y pelo suelto a los hombros.
  maui_oficial: H({ s: 0.97, ropaColor: ROJO, ribete: AMARILLO, brazo: [16, 24], adornos: {
    cabeza: <PeloMedio c={PELO} luz={PELO_LUZ} />,
    cuerpo: <><BandaFalda y={-200} alto={16} c={AMARILLO} motivo="triangulos" /><RolloCuerda /></>,
    mano: <Manaiakalani />,
  } }, 'MĀUI'),
  // Kāne: dios de la vida y el agua dulce. Moño alto y barba, kīhei blanco con borde amarillo, bastón y ipu de agua.
  kane_oficial: H({ s: 1.04, ropaColor: AMARILLO, ribete: '#2C7A96', adornos: {
    cabeza: <><Mono c={PELO} luz={PELO_LUZ} /><BarbaCorta c={PELO} luz={PELO_LUZ} /></>,
    cuerpo: <><BandaFalda y={-200} alto={16} c="#2C7A96" motivo="zigzag" /><LeiMaile /></>,
    mano: <Baston />, manoAtras: <IpuAgua />,
  } }, 'KĀNE'),
  // Kanaloa: dios del océano. Capa verde mar con ruedo de tentáculos de pulpo, malo con olas, remo y pelo suelto.
  kanaloa_oficial: H({ s: 1.04, gigante: true, piel: '#86502F', ropaColor: '#1E6E7E', ribete: '#86CFCF', adornos: {
    detras: <CapaEspalda c="#1E6E7E" forro="#2C8C96" borde="#F2E2C4" ruedo="tentaculos" largo={0.9} />,
    cabeza: <><PeloLargo c={PELO} luz="#2E4A50" largo={0.6} volumen={1.1} /><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.6} /></>,
    cuerpo: <><BandaFalda y={-200} alto={16} c="#86CFCF" motivo="zigzag" /><LeiNiho /></>,
    mano: <Remo />,
  } }, 'KANALOA'),
  // Kū: dios de la guerra. Casco de plumas mahiole, capa de plumas ʻahuʻula roja y amarilla, lanza y lei niho palaoa.
  ku_oficial: H({ s: 1.06, gigante: true, ropaColor: ROJO, ribete: AMARILLO, adornos: {
    detras: <CapaEspalda c={ROJO} borde={AMARILLO} ruedo="plumas" largo={0.62} ancho={0.85} bandas={[AMARILLO]} />,
    cabeza: <><BarbaCorta c={PELO} luz={PELO_LUZ} larga={0.5} /><Mahiole /></>,
    cuerpo: <><BandaFalda y={-200} alto={16} c={AMARILLO} motivo="triangulos" /><Kihei a={1.35} c={ROJO} borde={AMARILLO} nudo={false} /><LeiNiho /></>,
    mano: <Ihe />,
  } }, 'KŪ'),
  // Lono: dios de la cosecha, la lluvia y la paz. Akua loa (pértiga con kapa blanca), kīhei blanco y corona de hojas.
  lono_oficial: H({ s: 1.02, ropaColor: CREMA, ribete: '#4E7A3A', brazo: [10, 40], adornos: {
    cabeza: <><PeloLargo c={PELO} luz={PELO_LUZ} largo={0.45} /><BarbaCorta c={PELO} luz={PELO_LUZ} /><CoronaFlores colores={['#6E9A4E']} r={5} hojas="#4E7A3A" /></>,
    cuerpo: <><BandaFalda y={-200} alto={16} c="#4E7A3A" motivo="rombos" /><Kihei a={1} c="#FBF6EA" borde="#4E7A3A" /></>,
    mano: <AkuaLoa />,
  } }, 'LONO'),
  // Hina: diosa de la luna que batía kapa. Luna creciente detrás, pāʻū añil con lunitas, batidor y kapa doblada.
  hina_oficial: M({ ropaColor: '#2E3F6E', ribete: '#F4EEDC', adornos: {
    detras: <LunaDetras />,
    cabeza: <PeloLargo c={PELO} luz="#6A6E86" largo={1.1} />,
    cuerpo: <><Kihei a={0.92} c={CREMA} borde="#2E3F6E" /><BandaFalda larga y={-60} alto={22} c="#F4EEDC" motivo="triangulos" /><LeiFlores colores={['#F7EEDB', '#C9D3E8']} /></>,
    mano: <Batidor />,
  } }, 'HINA'),
  // Poliʻahu: diosa de la nieve de Mauna Kea. Manto y capucha de kapa blanca con borde celeste, copos que caen.
  poliahu_oficial: M({ piel: '#B07A52', ropaColor: '#F4F1EA', ribete: '#9FC3DB', adornos: {
    detras: <><CapaEspalda c="#FBF8F2" forro="#DDE9F0" borde="#9FC3DB" largo={1} ancho={1.1} /><Copos /></>,
    cabeza: <><PeloLargo c={PELO} largo={0.5} frente={false} /><Capucha /></>,
    cuerpo: <><Kihei a={0.92} c="#FBF8F2" borde="#9FC3DB" nudo={false} /><BandaFalda larga y={-60} alto={18} c="#9FC3DB" motivo="zigzag" /></>,
  } }, 'POLIʻAHU'),
  // Kamapuaʻa: semidiós cerdo. Fuerte y ancho, cresta de cerdas negras, capa corta de cuero oscuro, colmillos y garrote.
  kamapuaa_oficial: H({ s: 1.05, gigante: true, piel: '#7E4A2E', ropaColor: '#4E7A3A', ribete: '#2F5228', adornos: {
    detras: <CapaEspalda c="#3A2A22" forro="#4A382C" borde="#1E1611" largo={0.5} ancho={0.9} />,
    cabeza: <><CrestaCerdas /><BarbaCorta c="#1A1412" luz="#4A3C34" larga={0.3} /></>,
    cuerpo: <><LomoCerdas a={1.35} /><BandaFalda y={-196} alto={14} c="#2F5228" motivo="rayas" /><LeiColmillos /></>,
    mano: <Laau />,
  } }, 'KAMAPUAʻA'),
};
export const NOMBRE_EN_HAWAIANO_OFICIAL: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_HAWAIANO_OFICIAL).map(([k, f]) => [k, f.griego as string]));
