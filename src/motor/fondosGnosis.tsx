// Piel de Gnosis (serie `gnosticas`, tema "gnosis"): fondos y elementos. Figuras planas con contorno de tinta, como
// todo el canal. Arriba, el Pleroma (la Plenitud): luz de oro y blanca sobre índigo y negro, esferas de los eones, el
// agua de luz. Abajo, el mundo de los gobernantes: el caos y sus aguas, la nube luminosa con el trono, los siete
// cielos en anillos, la materia (lo más bajo y pesado), el paraíso falso (hermoso pero inquietante), la tierra de los
// humanos y el diluvio. Y Juan: el templo de Jerusalén y el monte del desierto adonde se va a llorar.
// El Espíritu Invisible NUNCA se dibuja como persona: es luz (`luz_espiritu`, o el actor `espiritu_invisible`).
import React, { useId } from 'react';
import { Capa, SUELO, Fuego, azar, suave, type P } from '../comun/vasija';
import { GN, SueloGnosis, Estrella8, CruzAsa } from '../comun/gnosis';
import type { Cielo } from './fondos';

const r1 = (v: number) => v.toFixed(1);
const T = GN.tinta;
const uid = () => 'gn' + useId().replace(/[^a-zA-Z0-9]/g, '');

/** Fondos del tema y su cielo (lo usa Escena para el degradé de base). */
export const CIELO_GNOSIS: Record<string, Cielo> = {
  pleroma: 'noche', eones: 'noche', agua_luz: 'noche', caos: 'inframundo', nube_luz: 'inframundo', cielos: 'inframundo',
  materia: 'inframundo', paraiso_falso: 'mar', templo_jerusalen: 'barro', tierra: 'barro', diluvio: 'mar', monte_desierto: 'barro',
};
export const FONDOS_GNOSIS = ['pleroma', 'eones', 'agua_luz', 'caos', 'nube_luz', 'cielos', 'materia', 'paraiso_falso', 'templo_jerusalen', 'tierra', 'diluvio', 'monte_desierto'];
export const ELEMENTOS_GNOSIS = ['luz_espiritu', 'luz_divina', 'rayos_luz', 'agua_luz', 'esfera_eon', 'estrellas_oro', 'chispa', 'nube_luz', 'trono_luz', 'anillo_cielo', 'cadena', 'niebla', 'llamas', 'agua_oscura', 'codice', 'arbol_paraiso', 'arbol_conocimiento', 'arbol_vida_falso', 'flores_paraiso', 'arca_gnosis', 'columna_templo', 'casa_gnosis', 'olivo_gnosis', 'roca_gnosis', 'monte_gnosis', 'lluvia_gnosis', 'cuerpo_tierra'];

// ---------- degradés ----------
const Degrades: React.FC = () => (
  <defs>
    <linearGradient id="gnPleroma" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#04050F" /><stop offset="45%" stopColor="#11143A" /><stop offset="80%" stopColor="#262A66" /><stop offset="100%" stopColor="#3E3C7E" /></linearGradient>
    <linearGradient id="gnAbajo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#030604" /><stop offset="55%" stopColor="#0C1A12" /><stop offset="100%" stopColor="#1C3426" /></linearGradient>
    <linearGradient id="gnMateria" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0A0B08" /><stop offset="60%" stopColor="#24241A" /><stop offset="100%" stopColor="#3E3824" /></linearGradient>
    <linearGradient id="gnParaiso" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#123A34" /><stop offset="55%" stopColor="#5E8A5E" /><stop offset="88%" stopColor="#C8C27A" /><stop offset="100%" stopColor="#D9B868" /></linearGradient>
    <linearGradient id="gnTarde" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2E2A4E" /><stop offset="45%" stopColor="#8A5E6A" /><stop offset="80%" stopColor="#D99A6A" /><stop offset="100%" stopColor="#F2CE8A" /></linearGradient>
    <linearGradient id="gnDia" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8FA6B0" /><stop offset="60%" stopColor="#D2D0B4" /><stop offset="100%" stopColor="#EADFC0" /></linearGradient>
    <linearGradient id="gnAlba" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4E5A7E" /><stop offset="50%" stopColor="#C9A486" /><stop offset="100%" stopColor="#F4DCA8" /></linearGradient>
    <linearGradient id="gnTormenta" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#080C0B" /><stop offset="60%" stopColor="#1E2A28" /><stop offset="100%" stopColor="#36463F" /></linearGradient>
    <linearGradient id="gnAguaLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF4CF" /><stop offset="35%" stopColor="#D8C98A" /><stop offset="100%" stopColor="#4A4A82" /></linearGradient>
    <linearGradient id="gnAguaOsc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1E3A30" /><stop offset="100%" stopColor="#050A08" /></linearGradient>
    <linearGradient id="gnSueloLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF6D8" /><stop offset="60%" stopColor="#E8C25A" /><stop offset="100%" stopColor="#8A6A2E" /></linearGradient>
    <radialGradient id="gnBrillo"><stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} /><stop offset="25%" stopColor="#FFF3C4" stopOpacity={0.85} /><stop offset="60%" stopColor="#E8C25A" stopOpacity={0.3} /><stop offset="100%" stopColor="#E8C25A" stopOpacity={0} /></radialGradient>
    <radialGradient id="gnNiebla"><stop offset="0%" stopColor="#9AB4A4" stopOpacity={0.42} /><stop offset="100%" stopColor="#9AB4A4" stopOpacity={0} /></radialGradient>
    <radialGradient id="gnBrasa"><stop offset="0%" stopColor="#F2A23A" stopOpacity={0.7} /><stop offset="45%" stopColor="#E2622A" stopOpacity={0.3} /><stop offset="100%" stopColor="#E2622A" stopOpacity={0} /></radialGradient>
  </defs>
);
const CieloG: React.FC<{ id: string }> = ({ id }) => <rect x={-2400} y={-1400} width={8000} height={SUELO + 2000} fill={`url(#${id})`} />;

// ---------- luz ----------
/**
 * Luz del Pleroma / del Espíritu Invisible: resplandor blanco y oro, rayos finos que giran despacio y anillos que
 * laten. Nunca una figura. intensidad 0–1.5.
 */
export const LuzPleroma: React.FC<{ x: number; y: number; r?: number; f: number; intensidad?: number; rayos?: boolean; anillos?: boolean }> = ({ x, y, r = 420, f, intensidad = 1, rayos = true, anillos = true }) => {
  const id = uid(), k = Math.max(0, intensidad), pul = 1 + Math.sin(f / 22) * 0.035;
  return (
    <g opacity={Math.min(1, 0.3 + k * 0.7)}>
      <defs>
        <radialGradient id={`${id}b`}><stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} /><stop offset="25%" stopColor="#FFF3C4" stopOpacity={0.85} /><stop offset="60%" stopColor="#E8C25A" stopOpacity={0.3} /><stop offset="100%" stopColor="#E8C25A" stopOpacity={0} /></radialGradient>
        <radialGradient id={`${id}r`} gradientUnits="userSpaceOnUse" cx={x} cy={y} r={r * 2.1}><stop offset="0%" stopColor="#FFFBEA" stopOpacity={0.6} /><stop offset="100%" stopColor="#FFE7A0" stopOpacity={0} /></radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 2.2 * pul} fill={`url(#${id}b)`} opacity={0.35} />
      {rayos && <g transform={`rotate(${r1(f * 0.05)} ${x} ${y})`}>{Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2, L = r * (1.5 + azar(i + 2) * 0.9), w = 0.022 + azar(i) * 0.03;
        return <path key={i} d={`M${r1(x)} ${r1(y)} L ${r1(x + Math.cos(a - w) * L)} ${r1(y + Math.sin(a - w) * L)} L ${r1(x + Math.cos(a + w) * L)} ${r1(y + Math.sin(a + w) * L)} Z`} fill={`url(#${id}r)`} opacity={(0.45 + 0.3 * Math.sin(f / 30 + i * 1.7)) * Math.min(1, k)} />;
      })}</g>}
      {anillos && [0.55, 0.85, 1.2].map((q, i) => <circle key={i} cx={x} cy={y} r={r * q * (1 + Math.sin(f / 26 + i) * 0.02)} fill="none" stroke={i === 1 ? GN.oroClaro : GN.blanco} strokeWidth={i === 1 ? 3 : 1.6} opacity={0.22 * Math.min(1, k)} />)}
      <circle cx={x} cy={y} r={r * 0.9 * pul} fill={`url(#${id}b)`} />
      <circle cx={x} cy={y} r={r * 0.32 * pul} fill="#FFFFFF" opacity={0.85} />
      {Array.from({ length: 18 }, (_, i) => { const t = (f / 140 + azar(i)) % 1, a = azar(i + 9) * Math.PI * 2, d = r * (0.3 + t * 1.3); return <circle key={`p${i}`} cx={r1(x + Math.cos(a) * d)} cy={r1(y + Math.sin(a) * d)} r={2.2 + azar(i + 4) * 2} fill={GN.luz} opacity={(1 - t) * 0.8 * Math.min(1, k)} />; })}
    </g>
  );
};
/** Rayos de luz que bajan en abanico desde arriba (x,y = origen arriba). */
const RayosLuz: React.FC<{ x: number; y: number; s?: number; f: number; ancho?: number; largo?: number; color?: string }> = ({ x, y, s = 1, f, ancho = 1, largo = 700, color = GN.oroClaro }) => {
  const id = uid();
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.6} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      {Array.from({ length: 9 }, (_, i) => {
        const a = ((-40 + i * 10) * ancho + Math.sin(f / 60 + i) * 2) * Math.PI / 180, L = largo * s * (0.8 + azar(i) * 0.3), w = (14 + azar(i + 3) * 22) * s;
        return <path key={i} d={`M${r1(x - w * 0.2)} ${y} L ${r1(x + Math.sin(a) * L - w)} ${r1(y + Math.cos(a) * L)} L ${r1(x + Math.sin(a) * L + w)} ${r1(y + Math.cos(a) * L)} L ${r1(x + w * 0.2)} ${y} Z`} fill={`url(#${id})`} opacity={0.5 + 0.3 * Math.sin(f / 22 + i * 2)} />;
      })}
    </g>
  );
};
/** Esfera de un eón: resplandor, disco con aro de oro y anillos de luz adentro. */
export const EsferaEon: React.FC<{ x: number; y: number; r?: number; f: number; c?: string; fase?: number }> = ({ x, y, r = 46, f, c = GN.oroClaro, fase = 0 }) => {
  const late = 1 + Math.sin(f / 18 + fase) * 0.05;
  return (
    <g transform={`translate(${r1(x)} ${r1(y + Math.sin(f / 40 + fase) * 6)})`}>
      <circle r={r * 2.4 * late} fill="url(#gnBrillo)" opacity={0.5} />
      <circle r={r} fill={c} stroke={GN.oroOsc} strokeWidth={3} />
      <circle r={r * 0.72} fill="none" stroke={GN.blanco} strokeWidth={2.4} opacity={0.9} />
      <circle r={r * 0.42} fill={GN.luz} />
      <circle cx={-r * 0.3} cy={-r * 0.32} r={r * 0.14} fill="#FFFFFF" />
    </g>
  );
};
/** Puntitos y estrellas de oro de ocho puntas que titilan. */
const EstrellasOro: React.FC<{ f: number; n?: number; area?: [number, number, number, number]; seed?: number }> = ({ f, n = 34, area = [-300, 140, 2600, 440], seed = 7 }) => (
  <g>{Array.from({ length: n }, (_, i) => {
    const x = area[0] + azar(i * 3 + seed) * area[2], y = area[1] + azar(i * 7 + seed) * area[3], tw = 0.55 + 0.45 * Math.sin(f / 11 + i * 1.3);
    return i % 4 === 0 ? <g key={i} opacity={tw}><Estrella8 x={x} y={y} r={7 + azar(i) * 6} c={i % 8 ? GN.oro : GN.blanco} /></g> : <circle key={i} cx={r1(x)} cy={r1(y)} r={1.2 + azar(i + 1) * 1.8} fill={GN.blanco} opacity={tw * 0.8} />;
  })}</g>
);
/** Chispa de luz (el poder de la Madre, la semilla, la luz escondida). */
const Chispa: React.FC<{ x: number; y: number; s?: number; f: number; c?: string }> = ({ x, y, s = 1, f, c = GN.oroClaro }) => {
  const k = s * (1 + Math.sin(f / 6) * 0.12);
  return (
    <g transform={`translate(${r1(x)} ${r1(y)})`}>
      <circle r={60 * k} fill="url(#gnBrillo)" />
      <path d={`M0 ${r1(-34 * k)} L ${r1(6 * k)} ${r1(-6 * k)} L ${r1(34 * k)} 0 L ${r1(6 * k)} ${r1(6 * k)} L 0 ${r1(34 * k)} L ${r1(-6 * k)} ${r1(6 * k)} L ${r1(-34 * k)} 0 L ${r1(-6 * k)} ${r1(-6 * k)} Z`} fill={c} />
      <circle r={7 * k} fill="#FFFFFF" />
    </g>
  );
};

// ---------- nubes, niebla, agua ----------
/** Bulto de círculos con contorno de tinta por fuera (nube plana como las del canal). */
const Bulto: React.FC<{ circ: [number, number, number][]; fill: string; borde?: string; w?: number; o?: number }> = ({ circ, fill, borde = T, w = 3, o = 1 }) => (
  <g opacity={o}>
    {circ.map(([cx, cy, r], i) => <circle key={`b${i}`} cx={r1(cx)} cy={r1(cy)} r={r1(r + w)} fill={borde} />)}
    {circ.map(([cx, cy, r], i) => <circle key={`c${i}`} cx={r1(cx)} cy={r1(cy)} r={r1(r)} fill={fill} />)}
  </g>
);
/** Nube luminosa: bulto blanco y oro con brillo por dentro (props.trono = con el trono encima). */
export const NubeLuz: React.FC<{ x: number; y: number; s?: number; f: number; ancho?: number }> = ({ x, y, s = 1, f, ancho = 1 }) => {
  const w = 420 * ancho;
  const circ: [number, number, number][] = Array.from({ length: 9 }, (_, i) => { const t = i / 8; return [(-w + t * 2 * w), -Math.sin(t * Math.PI) * 70 - 20 + Math.sin(f / 30 + i) * 4, 70 + Math.sin(t * Math.PI) * 50] as [number, number, number]; });
  const base: [number, number, number][] = Array.from({ length: 7 }, (_, i) => [-w * 0.9 + (i / 6) * w * 1.8, 30, 60] as [number, number, number]);
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <ellipse cx={0} cy={-30} rx={w * 1.4} ry={240} fill="url(#gnBrillo)" opacity={0.55} />
      <Bulto circ={[...circ, ...base]} fill={GN.oroClaro} borde={GN.oroOsc} />
      <Bulto circ={circ.map(([cx, cy, r]) => [cx * 0.92, cy - 6, r * 0.72] as [number, number, number])} fill={GN.blanco} borde={GN.blanco} w={0} />
      {[-0.55, -0.1, 0.4].map((k, i) => <path key={i} d={`M${r1(k * w - 40)} ${r1(-40 - i * 8)} q 30 -26 60 0`} stroke={GN.oro} strokeWidth={3} fill="none" strokeLinecap="round" />)}
    </g>
  );
};
/** Niebla que se arrastra (banda de elipses suaves). */
const Niebla: React.FC<{ x: number; y: number; f: number; ancho?: number; s?: number; c?: string }> = ({ x, y, f, ancho = 2600, s = 1, c }) => (
  <g>{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={r1(x - ancho / 2 + ((i * ancho / 7 + f * (0.5 + (i % 3) * 0.25)) % ancho))} cy={r1(y - (i % 3) * 40 * s)} rx={r1(380 * s)} ry={r1(64 * s)} fill={c ?? 'url(#gnNiebla)'} />)}</g>
);
/** Aguas de abajo: verde oscuro casi negro, crestas con línea clara que se mueven. */
const AguaOscura: React.FC<{ y: number; f: number; desde?: number; hasta?: number; c?: string; cresta?: string; alto?: number }> = ({ y, f, desde: x0 = -2000, hasta = 6400, c = 'url(#gnAguaOsc)', cresta = GN.verdeNiebla, alto = 520 }) => {
  const paso = 150, n = Math.ceil((hasta - x0) / paso);
  return (
    <g>
      <rect x={x0} y={y} width={hasta - x0} height={alto} fill={c} />
      {[0, 1, 2, 3].map((fila) => (
        <g key={fila} transform={`translate(${r1(Math.sin(f / 34 + fila) * 22 + (fila % 2) * paso / 2)} ${y + 6 + fila * 38})`} opacity={1 - fila * 0.2}>
          {Array.from({ length: n }, (_, i) => { const x = x0 + i * paso; return <path key={i} d={`M${x} 10 Q ${x + 40} -14 ${x + 80} 6 Q ${x + 96} 12 ${x + 104} 2`} stroke={cresta} strokeWidth={3} fill="none" strokeLinecap="round" />; })}
        </g>
      ))}
      <rect x={x0} y={y - 3} width={hasta - x0} height={4} fill={T} opacity={0.8} />
    </g>
  );
};
/** Agua de luz que rodea al Espíritu: superficie clara con anillos y el reflejo de la luz (y = superficie). */
const AguaLuz: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g>
    <rect x={-2400} y={y} width={8000} height={700} fill="url(#gnAguaLuz)" />
    {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={x} cy={y + 40 + i * 22} rx={r1(60 + i * 12 + Math.sin(f / 9 + i) * 6)} ry={3 + i * 0.4} fill={GN.luz} opacity={0.75 - i * 0.05} />)}
    {[0, 1, 2, 3].map((i) => { const t = ((f / 70 + i / 4) % 1); return <ellipse key={`o${i}`} cx={x} cy={y + 30} rx={r1(80 + t * 900)} ry={r1(10 + t * 60)} fill="none" stroke={GN.blanco} strokeWidth={2.4} opacity={(1 - t) * 0.6} />; })}
    {Array.from({ length: 30 }, (_, i) => { const px = -1600 + i * 240 + Math.sin(f / 20 + i) * 20; return <path key={`c${i}`} d={`M${r1(px)} ${y + 60 + (i % 4) * 36} q 30 -10 60 0`} stroke={GN.oroClaro} strokeWidth={2.4} fill="none" opacity={0.7} />; })}
    <rect x={-2400} y={y - 2} width={8000} height={3} fill={GN.oroClaro} opacity={0.8} />
  </g>
);
/** Suelo de luz del Pleroma: banda dorada con nubecitas claras en el borde. */
const SueloLuz: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-1800} y={SUELO + 4} width={8400} height={300} fill="url(#gnSueloLuz)" />
    <Bulto circ={Array.from({ length: 46 }, (_, i) => [-1800 + i * 185, SUELO + 22 + Math.sin(i * 1.7) * 6 + Math.sin(f / 30 + i) * 3, 48 + (i % 3) * 10] as [number, number, number])} fill={GN.blanco} borde={GN.oro} w={3} />
    <Bulto circ={Array.from({ length: 46 }, (_, i) => [-1720 + i * 185, SUELO + 58, 40 + (i % 2) * 8] as [number, number, number])} fill={GN.oroClaro} borde={GN.oroOsc} w={2} />
  </g>
);

// ---------- abajo ----------
/** Brasas lejanas (resplandores rojos en la oscuridad). */
const Brasas: React.FC<{ f: number; n?: number; y?: number; seed?: number }> = ({ f, n = 7, y = 560, seed = 3 }) => (
  <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={r1(-600 + azar(i + seed) * 3600)} cy={r1(y + azar(i * 5 + seed) * 180)} r={r1(90 + azar(i + 2) * 140)} fill="url(#gnBrasa)" opacity={0.35 + 0.2 * Math.sin(f / 16 + i)} />)}</g>
);
/** Lengua de fuego suelta (base en x,y). */
const Llamas: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`}><circle cy={-60 * s} r={160 * s} fill="url(#gnBrasa)" /><Fuego f={f + x * 0.01} s={s} /></g>
);
/** Los siete cielos de los gobernantes: anillos concéntricos, oscuros con borde de fuego (centro abajo, fuera de cuadro). */
const AnillosCielos: React.FC<{ x: number; y: number; f: number; n?: number; r0?: number; paso?: number }> = ({ x, y, f, n = 7, r0 = 250, paso = 118 }) => {
  const tonos = ['#2A1E2E', '#1E2A2E', '#2E2A1A', '#1A2E22', '#2E1E1A', '#22223A', '#2A2A26'];
  return (
    <g>
      {Array.from({ length: n }, (_, k) => n - 1 - k).map((i) => {
        const R = r0 + i * paso, rr = R - paso * 0.88;
        return <g key={i}>
          <path d={`M${r1(x - R)} ${y} A ${R} ${R} 0 0 1 ${r1(x + R)} ${y} L ${r1(x + rr)} ${y} A ${r1(rr)} ${r1(rr)} 0 0 0 ${r1(x - rr)} ${y} Z`} fill={tonos[i % tonos.length]} stroke={T} strokeWidth={4} />
          <path d={`M${r1(x - R + 6)} ${y} A ${R - 6} ${R - 6} 0 0 1 ${r1(x + R - 6)} ${y}`} stroke={i % 2 ? GN.fuego : GN.oroOsc} strokeWidth={3} fill="none" strokeDasharray="2 14" opacity={0.85} />
          {Array.from({ length: 5 + i * 2 }, (_, j) => { const a = Math.PI + ((j + 0.5) / (5 + i * 2)) * Math.PI + Math.sin(f / 90 + i) * 0.02, rm = (R + rr) / 2; return <circle key={j} cx={r1(x + Math.cos(a) * rm)} cy={r1(y + Math.sin(a) * rm)} r={3 + (j % 3)} fill={j % 3 ? GN.fuegoClaro : GN.oro} opacity={0.5 + 0.4 * Math.sin(f / 12 + i + j)} />; })}
        </g>;
      })}
    </g>
  );
};
/** Roca pesada de la materia: bloque irregular oscuro con vetas. arriba = cuelga del techo. */
const RocaPesada: React.FC<{ x: number; y: number; w: number; h: number; arriba?: boolean; c?: string; seed?: number }> = ({ x, y, w, h, arriba, c = '#24221A', seed = 1 }) => {
  const s = arriba ? 1 : -1;
  const pts: P[] = Array.from({ length: 9 }, (_, i) => { const t = i / 8; return [x - w / 2 + t * w, y + s * h * (0.35 + Math.sin(t * Math.PI) * 0.65) * (0.8 + azar(i + seed) * 0.4)] as P; });
  const d = `M${r1(x - w / 2 - 20)} ${y} ` + pts.map(([px, py]) => `L ${r1(px)} ${r1(py)}`).join(' ') + ` L ${r1(x + w / 2 + 20)} ${y} Z`;
  return <g><path d={d} fill={c} stroke={T} strokeWidth={3} /><path d={suave(pts.slice(1, -1).map(([px, py]) => [px, y + (py - y) * 0.55] as P))} stroke="#3E3A2A" strokeWidth={3} fill="none" /></g>;
};
/** Cadena (eslabones) que cuelga de y0 a y1. */
const Cadena: React.FC<{ x: number; y: number; largo?: number; s?: number; f: number }> = ({ x, y, largo = 360, s = 1, f }) => {
  const n = Math.floor(largo / (26 * s)), mece = Math.sin(f / 40 + x) * 4;
  return <g>{Array.from({ length: n }, (_, i) => <ellipse key={i} cx={r1(x + mece * (i / n))} cy={r1(y + i * 26 * s)} rx={(i % 2 ? 5 : 9) * s} ry={15 * s} fill="none" stroke={T} strokeWidth={6 * s} />)}{Array.from({ length: n }, (_, i) => <ellipse key={`c${i}`} cx={r1(x + mece * (i / n))} cy={r1(y + i * 26 * s)} rx={(i % 2 ? 5 : 9) * s} ry={15 * s} fill="none" stroke="#6E6A5E" strokeWidth={3 * s} />)}</g>;
};

// ---------- trono, códice ----------
/** Trono de Yaldabaoth: respaldo alto de oro oscuro con borde de fuego, sobre una grada (origen = base al centro). */
export const TronoLuz: React.FC<{ x: number; y: number; s?: number; f: number; fuego?: boolean }> = ({ x, y, s = 1, f, fuego = true }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {fuego && [-1, 1].map((k) => <g key={k} transform={`translate(${k * 150} -40)`}><Fuego f={f + k * 7} s={0.55} /></g>)}
    <path d="M-150 0 L -140 -40 L 140 -40 L 150 0 Z" fill={GN.oroOsc} stroke={T} strokeWidth={3} />
    <path d="M-110 -40 L -120 -470 C -120 -530, -60 -560, 0 -580 C 60 -560, 120 -530, 120 -470 L 110 -40 Z" fill="#5A3A1A" stroke={T} strokeWidth={4} />
    <path d="M-90 -60 L -98 -460 C -96 -506, -50 -530, 0 -546 C 50 -530, 96 -506, 98 -460 L 90 -60 Z" fill={GN.oroOsc} stroke={T} strokeWidth={2} />
    <path d="M-70 -90 L -76 -440 C -70 -478, -36 -496, 0 -506 C 36 -496, 70 -478, 76 -440 L 70 -90 Z" fill="#3A2412" />
    {Array.from({ length: 9 }, (_, i) => { const a = -Math.PI + (i / 8) * Math.PI, R = 150; return <path key={i} d={`M${r1(Math.cos(a) * R * 0.75)} ${r1(-470 + Math.sin(a) * R * 0.75)} L ${r1(Math.cos(a) * R)} ${r1(-470 + Math.sin(a) * R)}`} stroke={GN.fuego} strokeWidth={8} strokeLinecap="round" />; })}
    <path d="M-130 -150 H 130 V -120 H -130 Z" fill={GN.oro} stroke={T} strokeWidth={3} />
    {[-80, 0, 80].map((dx) => <circle key={dx} cx={dx} cy={-135} r={7} fill={GN.rojo} stroke={T} strokeWidth={1.5} />)}
  </g>
);
/** Códice de Nag Hammadi abierto: tapas de cuero con la tira de cierre, hojas de papiro con renglones de tinta. */
const Codice: React.FC<{ x: number; y: number; s?: number; f: number; brillo?: boolean }> = ({ x, y, s = 1, f, brillo }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {brillo && <circle cy={-70} r={180} fill="url(#gnBrillo)" opacity={0.5 + Math.sin(f / 12) * 0.1} />}
    <path d="M-170 0 L -160 -130 L 0 -116 L 160 -130 L 170 0 L 0 14 Z" fill={GN.cuero} stroke={T} strokeWidth={3} />
    <path d="M-150 -6 L -142 -124 L 0 -108 L 142 -124 L 150 -6 L 0 6 Z" fill={GN.papiro} stroke={T} strokeWidth={2} />
    {[0, 1, 2, 3, 4, 5].map((i) => <g key={i}>
      <path d={`M${-130 + i * 2} ${-104 + i * 16} Q -70 ${-96 + i * 16} -16 ${-92 + i * 16}`} stroke={T} strokeWidth={2.6} fill="none" strokeDasharray={i % 2 ? '9 4 3 4' : '5 3 12 3'} />
      <path d={`M16 ${-92 + i * 16} Q 70 ${-96 + i * 16} ${130 - i * 2} ${-104 + i * 16}`} stroke={i === 0 ? GN.rojo : T} strokeWidth={2.6} fill="none" strokeDasharray={i % 2 ? '4 3 10 3' : '8 4 4 4'} />
    </g>)}
    <path d="M0 -112 V 8" stroke={GN.papiroOsc} strokeWidth={3} />
    <path d="M170 -40 C 220 -40, 240 -10, 260 20" stroke={GN.cueroOsc} strokeWidth={8} fill="none" strokeLinecap="round" />
    <CruzAsa x={90} y={-20} h={26} />
  </g>
);

// ---------- paraíso, tierra ----------
/** Árbol del paraíso: copa redonda y espesa, verde muy oscuro con brillo, fruta roja lustrosa; falso = tronco retorcido con una enredadera como serpiente. */
const ArbolParaiso: React.FC<{ x: number; y: number; s?: number; f: number; fruta?: boolean; falso?: boolean; c?: string }> = ({ x, y, s = 1, f, fruta = true, falso, c = '#1E4A32' }) => {
  const m = Math.sin(f / 26 + x) * 3;
  const copa: [number, number, number][] = [[0, -330, 120], [-110, -280, 90], [110, -282, 92], [-60, -390, 86], [64, -392, 84], [0, -230, 90], [-150, -210, 60], [150, -214, 62]];
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <path d={falso ? 'M-26 0 C -10 -60, -40 -110, -8 -170 C 14 -210, -20 -240, 4 -260 L 26 -250 C 6 -220, 34 -190, 18 -150 C -2 -100, 30 -60, 30 0 Z' : 'M-24 0 C -18 -80, -20 -160, -10 -240 L 14 -240 C 20 -160, 22 -80, 30 0 Z'} fill="#3A2818" stroke={T} strokeWidth={3} />
      <g transform={`rotate(${r1(m * 0.4)} 0 -230)`}>
        <Bulto circ={copa} fill={c} />
        <Bulto circ={copa.map(([cx, cy, r]) => [cx - r * 0.18, cy - r * 0.2, r * 0.55] as [number, number, number])} fill={falso ? '#2E6A44' : '#3E7A4E'} borde={falso ? '#2E6A44' : '#3E7A4E'} w={0} />
        {fruta && Array.from({ length: 11 }, (_, i) => { const a = azar(i + 3) * Math.PI * 2, d = 40 + azar(i + 7) * 110; return <g key={i}><circle cx={r1(Math.cos(a) * d * 1.2)} cy={r1(-300 + Math.sin(a) * d * 0.8)} r={13} fill={falso ? '#C21E2A' : '#D8402A'} stroke={T} strokeWidth={2} /><circle cx={r1(Math.cos(a) * d * 1.2 - 4)} cy={r1(-300 + Math.sin(a) * d * 0.8 - 4)} r={3.5} fill="#FFFFFF" opacity={0.8} /></g>; })}
      </g>
      {falso && <path d={suave([[22, -10], [-30, -60], [30, -110], [-24, -160], [20, -210], [-6, -246]])} stroke="#4E6A2A" strokeWidth={10} fill="none" strokeLinecap="round" />}
      {falso && <g transform="translate(-6 -250)"><ellipse rx={14} ry={9} fill="#4E6A2A" stroke={T} strokeWidth={2} /><circle cx={6} cy={-2} r={3} fill={GN.fuegoClaro} /></g>}
    </g>
  );
};
/** Árbol del conocimiento: hojas de luz (la Epinoia escondida); brilla. */
const ArbolConocimiento: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => {
  const copa: [number, number, number][] = [[0, -320, 110], [-100, -270, 84], [100, -270, 84], [-50, -380, 76], [56, -380, 76], [0, -220, 80]];
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <circle cy={-300} r={300} fill="url(#gnBrillo)" opacity={0.45 + Math.sin(f / 16) * 0.1} />
      <path d="M-22 0 C -16 -80, -18 -160, -8 -230 L 12 -230 C 18 -160, 20 -80, 28 0 Z" fill="#5A4026" stroke={T} strokeWidth={3} />
      <path d="M-4 -200 L -60 -260 M6 -210 L 70 -270 M2 -180 L -30 -220" stroke="#5A4026" strokeWidth={9} strokeLinecap="round" />
      <Bulto circ={copa} fill={GN.oroClaro} borde={GN.oroOsc} />
      {Array.from({ length: 22 }, (_, i) => { const a = azar(i + 1) * Math.PI * 2, d = 20 + azar(i + 5) * 120; return <ellipse key={i} cx={r1(Math.cos(a) * d * 1.1)} cy={r1(-300 + Math.sin(a) * d * 0.75)} rx={9} ry={5} fill={i % 3 ? GN.blanco : GN.oro} transform={`rotate(${r1(a * 57)} ${r1(Math.cos(a) * d * 1.1)} ${r1(-300 + Math.sin(a) * d * 0.75)})`} opacity={0.7 + 0.3 * Math.sin(f / 9 + i)} />; })}
    </g>
  );
};
/** Flores del paraíso falso: grandes, de colores fuertes, con el centro oscuro. */
const FloresParaiso: React.FC<{ x: number; y: number; s?: number; f: number; n?: number }> = ({ x, y, s = 1, f, n = 7 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>{Array.from({ length: n }, (_, i) => {
    const px = (i - (n - 1) / 2) * 36, h = 40 + azar(i + 4) * 50, c = ['#C21E5A', '#E8A02A', '#8A3AB8', '#D8402A'][i % 4], m = Math.sin(f / 18 + i) * 4;
    return <g key={i}><path d={`M${px} 0 Q ${px + m} ${-h / 2} ${px + m} ${-h}`} stroke="#2E5A2E" strokeWidth={3} fill="none" />{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={px + m} cy={-h - 9} rx={6} ry={10} fill={c} stroke={T} strokeWidth={1.2} transform={`rotate(${a} ${px + m} ${-h})`} />)}<circle cx={px + m} cy={-h} r={4.5} fill="#1A0E14" /></g>;
  })}</g>
);
/** Olivo de la tierra de los humanos. */
const Olivo: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-16 0 C -26 -50, 6 -80, -6 -140 L 12 -140 C 20 -90, -4 -50, 18 0 Z" fill="#5E4A34" stroke={T} strokeWidth={2.4} />
    <g transform={`rotate(${r1(Math.sin(f / 30 + x) * 1.5)} 0 -140)`}><Bulto circ={[[0, -180, 60], [-62, -150, 44], [62, -152, 46], [-30, -214, 40], [34, -214, 42]]} fill="#6E7E4E" w={2.4} /><Bulto circ={[[-14, -192, 26], [30, -176, 20], [-48, -160, 18]]} fill="#8E9A66" borde="#8E9A66" w={0} /></g>
  </g>
);
/** Casa de adobe chata con puerta y ventanita. */
const Casa: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = GN.piedra }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-90 0 V -120 H 90 V 0 Z" fill={c} stroke={T} strokeWidth={3} />
    <path d="M-98 -120 H 98 V -132 H -98 Z" fill={GN.piedraOsc} stroke={T} strokeWidth={2.4} />
    <path d="M-20 0 V -64 Q 0 -80 20 -64 V 0 Z" fill="#3A2A1C" stroke={T} strokeWidth={2} />
    <rect x={42} y={-96} width={22} height={18} fill="#3A2A1C" stroke={T} strokeWidth={1.6} />
  </g>
);
/** Monte de roca (sin contorno pesado: plano, con una cara en sombra). */
const MonteG: React.FC<{ x: number; y: number; w?: number; h?: number; c?: string; c2?: string }> = ({ x, y, w = 800, h = 380, c = '#B08A5E', c2 = '#8A6A44' }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`}>
    <path d={`M${-w / 2} 0 L ${r1(-w * 0.18)} ${r1(-h * 0.8)} L ${r1(-w * 0.06)} ${-h} L ${r1(w * 0.08)} ${r1(-h * 0.86)} L ${r1(w * 0.24)} ${r1(-h * 0.6)} L ${w / 2} 0 Z`} fill={c} stroke={T} strokeWidth={3} />
    <path d={`M${r1(-w * 0.06)} ${-h} L ${r1(w * 0.08)} ${r1(-h * 0.86)} L ${r1(w * 0.24)} ${r1(-h * 0.6)} L ${w / 2} 0 L ${r1(w * 0.04)} 0 L ${r1(w * 0.02)} ${r1(-h * 0.5)} Z`} fill={c2} />
    <path d={`M${r1(-w * 0.12)} ${r1(-h * 0.6)} L ${r1(-w * 0.2)} ${r1(-h * 0.3)} M${r1(w * 0.14)} ${r1(-h * 0.5)} L ${r1(w * 0.2)} ${r1(-h * 0.2)}`} stroke={T} strokeWidth={2} opacity={0.4} />
  </g>
);
/** Roca suelta. */
const RocaG: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = '#9C8466' }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}><path d="M-80 2 L -70 -40 L -30 -70 L 24 -66 L 70 -36 L 84 2 Z" fill={c} stroke={T} strokeWidth={2.6} /><path d="M-70 -40 L -30 -70 L 24 -66 L 8 -34 L -40 -24 Z" fill="#FFFFFF" opacity={0.14} /></g>
);
/** Columna del pórtico del templo (piedra crema, capitel y base). */
const ColumnaTemplo: React.FC<{ x: number; y: number; s?: number; h?: number }> = ({ x, y, s = 1, h = 420 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-34} y={-24} width={68} height={24} fill={GN.piedraOsc} stroke={T} strokeWidth={2.4} />
    <rect x={-24} y={-h + 30} width={48} height={h - 54} fill={GN.piedra} stroke={T} strokeWidth={2.4} />
    {[-10, 4].map((dx) => <path key={dx} d={`M${dx} ${-h + 36} V -30`} stroke={GN.piedraOsc} strokeWidth={2} />)}
    <path d={`M-40 ${-h + 30} H 40 L 32 ${-h} H -32 Z`} fill={GN.piedraOsc} stroke={T} strokeWidth={2.4} />
  </g>
);
/** El templo de Jerusalén: fachada alta de piedra clara con borde de oro, el gran portal con el velo, gradas. */
const TemploJerusalen: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-330 0 V -40 H 330 V 0 Z" fill={GN.piedraOsc} stroke={T} strokeWidth={3} />
    <path d="M-300 -40 V -70 H 300 V -40 Z" fill={GN.piedra} stroke={T} strokeWidth={2.4} />
    <path d="M-250 -70 V -560 H 250 V -70 Z" fill="#EDE4CC" stroke={T} strokeWidth={4} />
    <path d="M-250 -560 H 250 V -590 H -250 Z" fill={GN.oro} stroke={T} strokeWidth={3} />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-240 + i * 37} -590 l 6 -26 l 6 26`} fill={GN.oro} stroke={T} strokeWidth={1.6} />)}
    <path d="M-110 -70 V -400 H 110 V -70 Z" fill="#2A1E1A" stroke={T} strokeWidth={3} />
    <path d="M-96 -76 V -390 H 96 V -76 Z" fill="#3A2E6A" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-86 + i * 29} -386 C ${-80 + i * 29 + Math.sin(f / 30 + i) * 3} -250, ${-90 + i * 29} -150, ${-84 + i * 29} -80`} stroke={i % 2 ? '#8A2A3A' : '#5A4A8A'} strokeWidth={6} fill="none" />)}
    <path d="M-110 -400 H 110 V -424 H -110 Z" fill={GN.oro} stroke={T} strokeWidth={2.4} />
    {[-180, 180].map((dx) => <g key={dx}><rect x={dx - 26} y={-500} width={52} height={430} fill={GN.piedra} stroke={T} strokeWidth={2.4} /><path d={`M${dx - 34} -500 H ${dx + 34} V -520 H ${dx - 34} Z`} fill={GN.oro} stroke={T} strokeWidth={2} /></g>)}
    <path d="M-240 -470 H -206 M206 -470 H 240" stroke={GN.piedraOsc} strokeWidth={3} />
    <path d="M-60 -460 C -20 -500, 20 -500, 60 -460" stroke={GN.oro} strokeWidth={8} fill="none" />
  </g>
);
/** Muralla con almenas de la ciudad (fondo). */
const Muralla: React.FC<{ x: number; y: number; w?: number; h?: number; c?: string }> = ({ x, y, w = 1400, h = 150, c = '#C9B48A' }) => (
  <g>
    <path d={`M${x - w / 2} ${y} V ${y - h} ` + Array.from({ length: Math.floor(w / 40) }, (_, i) => `h 20 v -18 h 20 v 18`).join(' ') + ` V ${y} Z`} fill={c} stroke={T} strokeWidth={2.4} />
    {Array.from({ length: Math.floor(w / 160) }, (_, i) => <rect key={i} x={x - w / 2 + 60 + i * 160} y={y - h + 40} width={12} height={26} fill="#5A4A34" />)}
  </g>
);
/** Arca (la de Moisés; el libro dice que Noé no se escondió en un arca sino en una nube de luz). */
const Arca: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y + Math.sin(f / 20) * 6)}) rotate(${r1(Math.sin(f / 26) * 2)}) scale(${s})`}>
    <path d="M-300 -60 L 300 -60 L 250 30 L -250 30 Z" fill="#6A4A2E" stroke={T} strokeWidth={3.4} />
    {[-30, 0].map((dy) => <path key={dy} d={`M-284 ${dy - 28} H 284`} stroke={T} strokeWidth={2} opacity={0.5} />)}
    <path d="M-180 -60 V -170 H 180 V -60 Z" fill="#7E5A38" stroke={T} strokeWidth={3} />
    <path d="M-200 -170 L 0 -230 L 200 -170 Z" fill="#5A3E26" stroke={T} strokeWidth={3} />
    <rect x={-20} y={-140} width={40} height={56} fill="#2A1E14" stroke={T} strokeWidth={2} />
  </g>
);
/** Lluvia en rayitas que caen. */
const Lluvia: React.FC<{ x: number; y?: number; f: number; n?: number; ancho?: number; largo?: number }> = ({ x, y = 120, f, n = 80, ancho = 2400, largo = 720 }) => (
  <g>{Array.from({ length: n }, (_, i) => { const px = x - ancho / 2 + azar(i) * ancho, t = ((f * 9 + azar(i + 3) * largo) % largo); return <path key={i} d={`M${r1(px - t * 0.12)} ${r1(y + t)} l -6 34`} stroke="#9AB0A8" strokeWidth={2.2} opacity={0.6} strokeLinecap="round" />; })}</g>
);
/** El cuerpo de tierra, agua, fuego y viento que hacen los gobernantes: un molde de barro tendido, sin vida (origen = centro abajo). */
const CuerpoTierra: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <ellipse cx={0} cy={-6} rx={240} ry={22} fill={T} opacity={0.25} />
    <path d={suave([[-200, -10], [-170, -46], [-90, -50], [0, -56], [90, -48], [150, -40], [176, -62], [214, -60], [226, -30], [200, -8]], true)} fill={GN.tierra} stroke={T} strokeWidth={3} />
    <circle cx={196} cy={-50} r={26} fill={GN.tierra} stroke={T} strokeWidth={3} />
    {[[-120, -40], [-20, -46], [80, -40]].map(([px, py], i) => <path key={i} d={`M${px} ${py} q 20 -6 40 0`} stroke={GN.tierraOsc} strokeWidth={3} fill="none" />)}
    {[0, 1, 2].map((i) => { const t = ((f / 50 + i / 3) % 1); return <path key={`v${i}`} d={`M${-60 + i * 60} ${r1(-70 - t * 60)} q 16 -10 30 0`} stroke="#B8C8C8" strokeWidth={2} fill="none" opacity={(1 - t) * 0.7} />; })}
  </g>
);

// ---------- suelos especiales ----------
const SueloOscuro: React.FC<{ c?: string }> = ({ c = '#1A2018' }) => (
  <g>
    <rect x={-1800} y={SUELO} width={8400} height={300} fill={c} />
    <rect x={-1800} y={SUELO} width={8400} height={5} fill={T} />
    {Array.from({ length: 70 }, (_, i) => <path key={i} d={`M${-1800 + i * 120 + (i * 37) % 60} ${SUELO + 34} l 14 -18 l 24 -4 l 14 22 Z`} fill="#2A3226" stroke={T} strokeWidth={1.4} />)}
  </g>
);
const SueloPiedra: React.FC = () => (
  <g>
    <rect x={-1800} y={SUELO} width={8400} height={300} fill={GN.piedra} />
    <rect x={-1800} y={SUELO} width={8400} height={5} fill={T} />
    {[0, 1, 2].map((fila) => Array.from({ length: 60 }, (_, i) => <rect key={`${fila}-${i}`} x={-1800 + i * 140 + (fila % 2) * 70} y={SUELO + 5 + fila * 34} width={140} height={34} fill="none" stroke={GN.piedraOsc} strokeWidth={2} />))}
  </g>
);
const SueloJardin: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-1800} y={SUELO} width={8400} height={300} fill="#2E5A34" />
    <rect x={-1800} y={SUELO} width={8400} height={5} fill={T} />
    {Array.from({ length: 90 }, (_, i) => { const x = -1800 + i * 94; return <path key={i} d={`M${x} ${SUELO + 30} q -2 -14 -8 -20 M${x + 4} ${SUELO + 30} q 0 -18 6 -22 M${x + 8} ${SUELO + 30} q 4 -12 12 -14`} stroke="#5E8A4E" strokeWidth={2.4} fill="none" strokeLinecap="round" transform={`rotate(${r1(Math.sin(f / 20 + i) * 4)} ${x} ${SUELO + 30})`} />; })}
  </g>
);
const SueloArena: React.FC = () => <SueloGnosis color="#C9A470" />;

// ---------- fondos ----------
export function fondoGnosis(tipo: string, f: number, astros = true): React.ReactNode | null {
  switch (tipo) {
    // La Plenitud: luz infinita sin figura, estrellas de oro y suelo de luz.
    case 'pleroma': return (
      <>
        <Degrades />
        <Capa p={0}><CieloG id="gnPleroma" /></Capa>
        <Capa p={0.04}><EstrellasOro f={f} n={44} area={[-400, 140, 2800, 560]} />{astros && <LuzPleroma x={960} y={380} r={360} f={f} />}</Capa>
        <Capa p={0.3}><Bulto circ={Array.from({ length: 22 }, (_, i) => [-1200 + i * 260, SUELO - 70 + Math.sin(i * 2.1) * 20, 70 + (i % 3) * 18] as [number, number, number])} fill="#2E3270" borde="#4A4C90" w={3} /></Capa>
        <Capa p={1}><SueloLuz f={f} /></Capa>
      </>
    );
    // Los eones: esferas de luz en arcos alrededor de la luz central.
    case 'eones': {
      const cols = [GN.oroClaro, GN.blanco, '#CFE0F6', '#F6D0C0', '#DCCFF6'];
      return (
        <>
          <Degrades />
          <Capa p={0}><CieloG id="gnPleroma" /></Capa>
          <Capa p={0.04}><EstrellasOro f={f} n={30} area={[-400, 140, 2800, 520]} seed={11} />{astros && <LuzPleroma x={960} y={330} r={200} f={f} anillos={false} />}</Capa>
          <Capa p={0.12}>{[[300, 22, 5], [470, 30, 8], [650, 36, 12]].map(([R, r, n], k) => Array.from({ length: n }, (_, i) => { const a = Math.PI + ((i + 0.5) / n) * Math.PI; return <EsferaEon key={`${k}-${i}`} x={960 + Math.cos(a) * R * 1.5} y={330 + Math.sin(a) * R * 0.62 + R * 0.25} r={r} f={f} c={cols[(i + k) % cols.length]} fase={i + k * 3} />; }))}</Capa>
          <Capa p={0.35}>{[-300, 400, 1500, 2300].map((x, i) => <EsferaEon key={i} x={x} y={520 + (i % 2) * 60} r={40} f={f} c={cols[i % cols.length]} fase={i * 2} />)}</Capa>
          <Capa p={1}><SueloLuz f={f} /></Capa>
        </>
      );
    }
    // El agua de luz que rodea al Espíritu, donde él se mira (de ahí sale Barbelo).
    case 'agua_luz': return (
      <>
        <Degrades />
        <Capa p={0}><CieloG id="gnPleroma" /></Capa>
        <Capa p={0.04}><EstrellasOro f={f} n={30} area={[-400, 140, 2800, 300]} seed={5} />{astros && <LuzPleroma x={960} y={300} r={240} f={f} />}</Capa>
        <Capa p={0.15}><AguaLuz x={960} y={SUELO - 150} f={f} /></Capa>
      </>
    );
    // El caos: oscuridad y las aguas de abajo, niebla y brasas lejanas.
    case 'caos': return (
      <>
        <Degrades />
        <Capa p={0}><CieloG id="gnAbajo" /></Capa>
        <Capa p={0.1}><Brasas f={f} n={6} y={420} /></Capa>
        <Capa p={0.3}><AguaOscura y={SUELO - 180} f={f * 0.4} desde={-1800} hasta={4600} cresta="#3E5A4C" /><Niebla x={960} y={SUELO - 190} f={f} /></Capa>
        <Capa p={0.6}><Niebla x={1400} y={SUELO - 90} f={f * 1.3} s={1.2} /></Capa>
        <Capa p={1}><AguaOscura y={SUELO - 50} f={f * 0.7} desde={-1800} hasta={6400} /></Capa>
      </>
    );
    // La nube luminosa con el trono, lejos de los eones (Sofía esconde ahí a Yaldabaoth). El trono va en x 960.
    case 'nube_luz': return (
      <>
        <Degrades />
        <Capa p={0}><CieloG id="gnAbajo" /></Capa>
        <Capa p={0.1}><Brasas f={f} n={5} y={380} seed={8} /></Capa>
        <Capa p={0.3}><AguaOscura y={SUELO - 150} f={f * 0.4} desde={-1800} hasta={4600} cresta="#34503F" /></Capa>
        <Capa p={1}>
          <AguaOscura y={SUELO - 30} f={f * 0.6} desde={-1800} hasta={6400} />
          <TronoLuz x={960} y={SUELO - 30} s={0.9} f={f} />
          <NubeLuz x={960} y={SUELO + 30} f={f} ancho={1.3} />
        </Capa>
      </>
    );
    // Los siete cielos de los gobernantes: anillos oscuros con borde de fuego, niebla y suelo de roca.
    case 'cielos': return (
      <>
        <Degrades />
        <Capa p={0}><CieloG id="gnAbajo" /></Capa>
        <Capa p={0.08}><AnillosCielos x={960} y={SUELO + 40} f={f} />{astros && <circle cx={960} cy={SUELO + 40} r={200} fill="url(#gnBrasa)" opacity={0.8} />}</Capa>
        <Capa p={0.4}><Niebla x={960} y={SUELO - 60} f={f} s={1.2} /></Capa>
        <Capa p={1}><SueloOscuro /></Capa>
      </>
    );
    // La materia: lo más bajo, oscuro y pesado — rocas que cuelgan, cadenas, brasas y niebla espesa.
    case 'materia': return (
      <>
        <Degrades />
        <Capa p={0}><CieloG id="gnMateria" /></Capa>
        <Capa p={0.15}><Brasas f={f} n={5} y={620} seed={2} />{Array.from({ length: 8 }, (_, i) => <RocaPesada key={i} x={-600 + i * 520} y={110} w={460} h={170 + (i % 3) * 50} arriba c="#2A281C" seed={i} />)}</Capa>
        <Capa p={0.4}>{[-200, 700, 1500, 2300].map((x, i) => <Cadena key={i} x={x} y={120} largo={260 + (i % 2) * 120} f={f} />)}{Array.from({ length: 6 }, (_, i) => <RocaPesada key={`b${i}`} x={-400 + i * 700} y={SUELO} w={520} h={160 + (i % 2) * 70} c="#34301F" seed={i + 4} />)}</Capa>
        <Capa p={0.7}><Niebla x={960} y={SUELO - 40} f={f} s={1.3} c="url(#gnNiebla)" /></Capa>
        <Capa p={1}><SueloOscuro c="#262218" /></Capa>
      </>
    );
    // El paraíso de los gobernantes: hermoso pero inquietante — cielo verde enfermo, árboles espesos de fruta roja, niebla.
    case 'paraiso_falso': return (
      <>
        <Degrades />
        <Capa p={0}><CieloG id="gnParaiso" /></Capa>
        <Capa p={0.06}>{astros && <><circle cx={1500} cy={300} r={140} fill="#F2E8A0" opacity={0.25} /><circle cx={1500} cy={300} r={52} fill="#EDE6B0" stroke="#8A8A4A" strokeWidth={3} /></>}</Capa>
        <Capa p={0.25}><path d={`M-1600 ${SUELO} C -1000 ${SUELO - 220}, -300 ${SUELO - 160}, 400 ${SUELO - 240} S 1800 ${SUELO - 140}, 2600 ${SUELO - 230} S 3800 ${SUELO - 160}, 4800 ${SUELO - 200} V ${SUELO + 200} H -1600 Z`} fill="#1E3E2A" stroke={T} strokeWidth={3} />{[-600, 200, 1000, 1800, 2600].map((x, i) => <ArbolParaiso key={i} x={x} y={SUELO - 150} s={0.55} f={f} fruta={i % 2 === 0} c="#163824" />)}</Capa>
        <Capa p={0.55}>{[-300, 500, 1400, 2200].map((x, i) => <ArbolParaiso key={i} x={x} y={SUELO - 30} s={0.8} f={f} falso={i === 1} />)}<Niebla x={960} y={SUELO - 40} f={f} /></Capa>
        <Capa p={1}><SueloJardin f={f} />{[-500, 300, 1100, 1900, 2700].map((x, i) => <FloresParaiso key={i} x={x} y={SUELO + 30} f={f} s={0.9} />)}</Capa>
      </>
    );
    // El templo de Jerusalén al atardecer (Juan, después de la cruz): fachada con el velo, pórticos y la ciudad.
    case 'templo_jerusalen': return (
      <>
        <Degrades />
        <Capa p={0}><CieloG id="gnTarde" /></Capa>
        <Capa p={0.06}>{astros && <circle cx={300} cy={560} r={70} fill="#F8DCA0" opacity={0.85} />}</Capa>
        <Capa p={0.2}><Muralla x={960} y={SUELO - 120} w={4400} h={110} c="#B8A07A" />{[-400, 200, 2100, 2700].map((x, i) => <Casa key={i} x={x} y={SUELO - 120} s={0.6} c="#C9B48A" />)}</Capa>
        <Capa p={0.5}><TemploJerusalen x={1100} y={SUELO - 40} s={0.95} f={f} /></Capa>
        <Capa p={0.8}>{Array.from({ length: 14 }, (_, i) => i < 5 || i > 9 ? <ColumnaTemplo key={i} x={-500 + i * 300} y={SUELO} s={0.9} /> : null)}</Capa>
        <Capa p={1}><SueloPiedra /></Capa>
      </>
    );
    // La tierra de los humanos: llanura con colinas, casas y olivos, bajo un cielo con bruma.
    case 'tierra': return (
      <>
        <Degrades />
        <Capa p={0}><CieloG id="gnDia" /></Capa>
        <Capa p={0.06}>{astros && <circle cx={1550} cy={260} r={50} fill="#F8EAC0" stroke="#C9A86A" strokeWidth={3} />}</Capa>
        <Capa p={0.2}><MonteG x={200} y={SUELO - 100} w={1100} h={300} c="#A89A72" c2="#8E8260" /><MonteG x={1600} y={SUELO - 100} w={1300} h={260} c="#A89A72" c2="#8E8260" /><MonteG x={2900} y={SUELO - 100} w={1000} h={320} c="#A89A72" c2="#8E8260" /></Capa>
        <Capa p={0.5}>{[-200, 400, 1300, 2000, 2600].map((x, i) => <Casa key={i} x={x} y={SUELO - 30} s={0.6 + (i % 2) * 0.1} />)}{[100, 900, 1700, 2300].map((x, i) => <Olivo key={i} x={x} y={SUELO - 20} s={0.8} f={f} />)}<Niebla x={960} y={SUELO - 140} f={f * 0.5} s={0.8} c="#EADFC055" /></Capa>
        <Capa p={1}><SueloGnosis /></Capa>
      </>
    );
    // El diluvio: tormenta, lluvia y aguas que suben; arriba a la derecha, la nube de luz donde se esconde Noé.
    case 'diluvio': return (
      <>
        <Degrades />
        <Capa p={0}><CieloG id="gnTormenta" /></Capa>
        <Capa p={0.06}>{astros && <><circle cx={1400} cy={300} r={360} fill="url(#gnBrillo)" opacity={0.45} /><NubeLuz x={1400} y={330} s={0.5} f={f} /></>}</Capa>
        <Capa p={0.15}><Bulto circ={Array.from({ length: 16 }, (_, i) => [-1200 + i * 320, 170 + Math.sin(i * 1.3) * 30, 110 + (i % 3) * 30] as [number, number, number])} fill="#2A3432" borde={T} o={0.95} /></Capa>
        <Capa p={0.3}><Lluvia x={960} y={140} f={f} n={110} ancho={3200} /><AguaOscura y={SUELO - 200} f={f * 0.8} desde={-1800} hasta={4600} cresta="#7E9A8E" /></Capa>
        <Capa p={1}><Lluvia x={960} y={140} f={f + 13} n={70} ancho={3600} /><AguaOscura y={SUELO - 60} f={f * 1.2} desde={-1800} hasta={6400} cresta="#9AB0A8" /></Capa>
      </>
    );
    // El monte en el desierto adonde Juan se va a llorar (ahí se le abre el cielo).
    case 'monte_desierto': return (
      <>
        <Degrades />
        <Capa p={0}><CieloG id="gnAlba" /></Capa>
        <Capa p={0.08}>{astros && <circle cx={1450} cy={330} r={60} fill="#FBE8B8" opacity={0.9} />}</Capa>
        <Capa p={0.25}><MonteG x={500} y={SUELO - 60} w={1400} h={460} /><MonteG x={2200} y={SUELO - 60} w={1200} h={380} c="#A88058" c2="#7E5E3E" /></Capa>
        <Capa p={0.6}>{[-300, 600, 1400, 2300].map((x, i) => <RocaG key={i} x={x} y={SUELO - 10} s={1 + (i % 2) * 0.4} />)}</Capa>
        <Capa p={1}><SueloArena /></Capa>
      </>
    );
    default: return null;
  }
}

// ---------- elementos ----------
export function elementoGnosis(tipo: string, x: number, y: number | undefined, s: number, f: number, props: Record<string, unknown> = {}): React.ReactNode | null {
  const yy = y ?? SUELO;
  const n = (k: string, d: number) => (typeof props[k] === 'number' ? (props[k] as number) : d);
  const def = <Degrades />;
  switch (tipo) {
    case 'luz_espiritu': return <>{def}<LuzPleroma x={x} y={y ?? 300} r={n('r', 300) * s} f={f} intensidad={n('intensidad', 1)} rayos={props.rayos !== false} anillos={props.anillos !== false} /></>;
    // como en la Biblia: luz arriba (x,y) con rayos que bajan `largo`
    case 'luz_divina': return <>{def}{props.rayos !== false && <g opacity={Math.min(1, n('intensidad', 1))}><RayosLuz x={x} y={y ?? 200} s={s} f={f} ancho={n('ancho', 1)} largo={n('largo', 700)} color={GN.luz} /></g>}<LuzPleroma x={x} y={y ?? 200} r={n('r', 170) * s} f={f} intensidad={n('intensidad', 1)} anillos={props.anillos !== false} /></>;
    case 'agua_luz': return <>{def}<AguaLuz x={x} y={y ?? SUELO - 150} f={f} /></>;
    case 'rayos_luz': return <>{def}<RayosLuz x={x} y={y ?? 130} s={s} f={f} ancho={n('ancho', 1)} largo={n('largo', 700)} color={props.color as string | undefined} /></>;
    case 'esfera_eon': return <>{def}<EsferaEon x={x} y={y ?? 360} r={46 * s} f={f} c={props.color as string | undefined} fase={x * 0.01} /></>;
    case 'estrellas_oro': case 'estrellas': return <EstrellasOro f={f} n={n('n', 34)} area={[x - 1000, y ?? 140, 2000, n('alto', 400)]} seed={n('seed', 7)} />;
    case 'chispa': return <>{def}<Chispa x={x} y={y ?? 400} s={s} f={f} c={props.color as string | undefined} /></>;
    case 'nube_luz': case 'nube': return <>{def}{props.trono === true && <TronoLuz x={x} y={(y ?? SUELO) - 60 * s} s={0.9 * s} f={f} />}<NubeLuz x={x} y={y ?? SUELO} s={s} f={f} ancho={n('ancho', 1)} /></>;
    case 'trono_luz': case 'trono': return <TronoLuz x={x} y={yy} s={s} f={f} fuego={props.fuego !== false} />;
    case 'anillo_cielo': return <>{def}<AnillosCielos x={x} y={yy} f={f} n={n('n', 7)} r0={n('r0', 250) * s} paso={n('paso', 118) * s} /></>;
    case 'cadena': return <Cadena x={x} y={y ?? 120} largo={n('largo', 360)} s={s} f={f} />;
    case 'niebla': return <>{def}<Niebla x={x} y={y ?? SUELO - 60} f={f} ancho={n('ancho', 2600)} s={s} /></>;
    case 'llamas': case 'fogata': return <>{def}<Llamas x={x} y={yy} s={s} f={f} /></>;
    case 'agua_oscura': return <>{def}<AguaOscura y={y ?? SUELO - 50} f={f} desde={x - n('ancho', 2800) / 2} hasta={x + n('ancho', 2800) / 2} /></>;
    case 'codice': return <>{def}<Codice x={x} y={yy} s={s} f={f} brillo={props.brillo === true} /></>;
    case 'arbol_paraiso': case 'arbol': return <ArbolParaiso x={x} y={yy} s={s} f={f} fruta={props.fruta !== false} falso={props.falso === true} />;
    case 'arbol_vida_falso': return <ArbolParaiso x={x} y={yy} s={s} f={f} falso />;
    case 'arbol_conocimiento': return <>{def}<ArbolConocimiento x={x} y={yy} s={s} f={f} /></>;
    case 'flores_paraiso': return <FloresParaiso x={x} y={yy} s={s} f={f} n={n('n', 7)} />;
    case 'arca_gnosis': case 'arca': return <Arca x={x} y={y ?? SUELO - 40} s={s} f={f} />;
    case 'columna_templo': case 'columna': return <ColumnaTemplo x={x} y={yy} s={s} h={n('alto', 420)} />;
    case 'templo': return <TemploJerusalen x={x} y={yy} s={s} f={f} />;
    case 'casa_gnosis': case 'casa': return <Casa x={x} y={yy} s={s} c={props.color as string | undefined} />;
    case 'olivo_gnosis': case 'olivo': return <Olivo x={x} y={yy} s={s} f={f} />;
    case 'roca_gnosis': case 'roca': return <RocaG x={x} y={yy} s={s} c={props.color as string | undefined} />;
    case 'monte_gnosis': case 'monte': return <MonteG x={x} y={yy} w={800 * s} h={380 * s} c={props.color as string | undefined} />;
    case 'lluvia_gnosis': case 'lluvia': return <Lluvia x={x} y={y ?? 120} f={f} n={n('n', 80)} ancho={n('ancho', 2400)} largo={n('largo', 720)} />;
    case 'cuerpo_tierra': return <CuerpoTierra x={x} y={yy} s={s} f={f} />;
    case 'sol': return <circle cx={x} cy={y ?? 260} r={50 * s} fill="#F8EAC0" stroke="#C9A86A" strokeWidth={3} />;
    case 'luna': return <path d={`M${x} ${(y ?? 240) - 44 * s} a ${44 * s} ${44 * s} 0 1 0 ${29 * s} ${77 * s} a ${35 * s} ${35 * s} 0 1 1 ${-29 * s} ${-77 * s} Z`} fill={GN.blanco} stroke={GN.plataOsc} strokeWidth={2} />;
    default: return null;
  }
}
