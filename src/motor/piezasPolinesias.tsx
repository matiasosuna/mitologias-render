// Piezas compartidas de los diseños oficiales hawaianos y maoríes (elencoHawaianoOficial.tsx, elencoMaoriOficial.tsx).
// Coordenadas del Personaje: cuerpo con origen en los pies (hombros y≈-300, cintura -212, cadera -176);
// cabeza de perfil mirando a la derecha con el ojo en (18,-6), la nuca en x≈-30 y el cuello abajo (y≈46).
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, type P } from '../comun/vasija';

export const N = '#17110D'; // contorno
export const r1 = (v: number) => v.toFixed(1);
const ola = (f: number, k: number, a = 1) => Math.sin(f / 18 + k) * a;

// ---------- cabeza ----------
/** Pelo largo suelto: cubre la coronilla y cae por la espalda (no tapa la cara). largo 1 ≈ hasta la cintura.
 * volumen = más ancho atrás; luz = mechones claros; puntas = color de las puntas (brasas de Pele). */
export const PeloLargo: React.FC<{ c: string; luz?: string; largo?: number; volumen?: number; puntas?: string; frente?: boolean }> = ({ c, luz, largo = 1, volumen = 1, puntas, frente = true }) => {
  const f = useCurrentFrame(), m = ola(f, 0, 3), L = 40 + 100 * largo, v = volumen;
  const pts: P[] = [
    [22, -27], [14, -37], [-2, -42], [-22, -36], [-34 * v, -18], [-40 * v, 10], [-46 * v + m * 0.4, L * 0.45], [-50 * v + m, L * 0.8], [-40 * v + m, L],
    [-30 + m, L * 0.92], [-24 + m * 0.6, L * 0.95], [-18, L * 0.6], [-16, 30], [-14, 12], [-8, 4], [-4, 6], [-2, -8], [6, -20], [16, -24],
  ];
  return (
    <g>
      <path d={suave(pts, true, 0.85)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      {puntas && [[-44, 0.6, -46, 0.95], [-36, 0.62, -36, 0.98], [-28, 0.66, -28, 0.92]].map(([x0, t0, x1, t1], i) => <path key={`p${i}`} d={`M${r1(x0 * v + m * 0.5)} ${r1(L * t0)} Q ${r1(x0 * v - 4 + m)} ${r1(L * (t0 + t1) / 2)} ${r1(x1 * v + m)} ${r1(L * t1)}`} stroke={puntas} strokeWidth={2.6} fill="none" strokeLinecap="round" />)}
      {luz && [[-20, -32, -36, 30, -38, L * 0.7], [-6, -36, -26, 20, -30, L * 0.8], [-30, -10, -42, 40, -44 + m, L * 0.85]].map(([x0, y0, x1, y1, x2, y2], i) => <path key={i} d={`M${x0} ${y0} Q ${x1} ${y1} ${r1(x2)} ${r1(y2)}`} stroke={luz} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.8} />)}
      {frente && <path d="M16 -24 C 6 -22, -2 -14, -6 -2" stroke={luz ?? N} strokeWidth={1.4} fill="none" opacity={0.6} />}
    </g>
  );
};
/** Pelo hasta los hombros (hombres jóvenes): tapa la coronilla y la nuca, sin cubrir la cara. */
export const PeloMedio: React.FC<{ c: string; luz?: string }> = ({ c, luz }) => {
  const f = useCurrentFrame(), m = ola(f, 1, 2);
  const pts: P[] = [[22, -27], [14, -38], [-4, -43], [-24, -36], [-36, -16], [-40, 14], [-40 + m, 44], [-30 + m, 52], [-24, 40], [-18, 24], [-12, 10], [-6, 4], [-2, -8], [6, -20], [16, -25]];
  return (
    <g>
      <path d={suave(pts, true, 0.85)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      {luz && [[-8, -38, -30, 0, -34, 40], [-24, -30, -36, 10, -32 + m, 48]].map(([x0, y0, x1, y1, x2, y2], i) => <path key={i} d={`M${x0} ${y0} Q ${x1} ${y1} ${r1(x2)} ${y2}`} stroke={luz} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.8} />)}
    </g>
  );
};
/** Moño alto (pelo recogido arriba y atrás). */
export const Mono: React.FC<{ c: string; luz?: string; x?: number; y?: number; r?: number }> = ({ c, luz, x = -14, y = -44, r = 15 }) => (
  <g>
    <path d={suave([[22, -27], [14, -37], [-4, -42], [-24, -36], [-34, -16], [-36, 8], [-30, 24], [-20, 20], [-14, 8], [-8, 4], [-4, 6], [-2, -8], [6, -20], [16, -24]], true, 0.85)} fill={c} stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.82} fill={c} stroke={N} strokeWidth={2} />
    {luz && <path d={`M${x - r * 0.6} ${y - 2} q ${r * 0.6} ${-r * 0.6} ${r * 1.2} 0 M-26 -26 Q -10 -36 8 -32`} stroke={luz} strokeWidth={1.6} fill="none" strokeLinecap="round" />}
  </g>
);
/** Barba corta y prolija por la mandíbula, con bigote (no tapa la boca ni el ojo). canas = gris. */
export const BarbaCorta: React.FC<{ c: string; luz?: string; larga?: number }> = ({ c, luz, larga = 1 }) => {
  const b = 40 + 12 * larga;
  return (
    <g>
      <path d={suave([[-10, 8], [-2, 16], [10, 22], [24, 26], [29, 27], [32, 32], [29, b - 6], [20, b], [8, b - 3], [0, 38], [-8, 28], [-13, 16]], true, 0.75)} fill={c} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M25 19.5 C 28 18, 32 18.5, 34 21 C 31 21, 28 21.5, 25 22.5 Z" fill={c} stroke={N} strokeWidth={1} />
      {luz && [[4, 24, 6, b - 8], [14, 28, 15, b - 3], [23, 30, 24, b - 8]].map(([a, bb, c2, d], i) => <path key={i} d={`M${a} ${bb} Q ${a + 3} ${(bb + d) / 2} ${c2} ${d}`} stroke={luz} strokeWidth={1.3} fill="none" strokeLinecap="round" opacity={0.8} />)}
    </g>
  );
};
/** Corona de flores (lei poʻo / haku) alrededor de la cabeza. */
export const CoronaFlores: React.FC<{ colores: string[]; r?: number; hojas?: string }> = ({ colores, r = 6.5, hojas = '#3E6E3A' }) => (
  <g>
    {Array.from({ length: 9 }, (_, i) => { const a = -2.75 + i * 0.29, cx = Math.cos(a) * 31 - 3, cy = Math.sin(a) * 30 - 8; return <ellipse key={`h${i}`} cx={r1(cx - 4)} cy={r1(cy + 2)} rx={6} ry={3} fill={hojas} stroke={N} strokeWidth={1} transform={`rotate(${r1((a * 180) / Math.PI + 90)} ${r1(cx - 4)} ${r1(cy + 2)})`} />; })}
    {Array.from({ length: 8 }, (_, i) => { const a = -2.7 + i * 0.32, cx = Math.cos(a) * 31 - 3, cy = Math.sin(a) * 30 - 8; return <g key={i}><circle cx={r1(cx)} cy={r1(cy)} r={r} fill={colores[i % colores.length]} stroke={N} strokeWidth={1.4} /><circle cx={r1(cx)} cy={r1(cy)} r={r * 0.32} fill="#F2C94C" /></g>; })}
  </g>
);
/** Flor de lehua (pompón rojo de estambres). */
export const Lehua: React.FC<{ x: number; y: number; r?: number; c?: string }> = ({ x, y, r = 8, c = '#D3263A' }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <path key={i} d={`M0 0 L ${r1(Math.cos(a) * r)} ${r1(Math.sin(a) * r)}`} stroke={c} strokeWidth={2.2} strokeLinecap="round" />; })}
    {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <circle key={`p${i}`} cx={r1(Math.cos(a) * r)} cy={r1(Math.sin(a) * r)} r={1.3} fill="#F7D25A" />; })}
    <circle r={r * 0.35} fill="#8E1B26" />
  </g>
);

// ---------- cuerpo ----------
export const torso = (a: number): P[] => [[-20 * a, -300], [18 * a, -304], [34 * a, -282], [30 * a, -248], [22 * a, -212], [-22 * a, -208], [-30 * a, -250], [-30 * a, -284]];
/** Prenda sobre el torso (kīhei atado al hombro, o capa corta de lino al frente). Tapa el torso desnudo. */
export const Kihei: React.FC<{ a: number; c: string; borde?: string; motivo?: string; nudo?: boolean }> = ({ a, c, borde, motivo, nudo = true }) => {
  const t = torso(a).map(([x, y]) => [x * 1.05, y] as P);
  const id = `kh${Math.round(a * 100)}${c.replace('#', '')}`;
  return (
    <g>
      <path d={suave(t, true)} fill={c} stroke={N} strokeWidth={2} />
      {motivo && <><defs><clipPath id={id}><path d={suave(t, true)} /></clipPath></defs>
        <g clipPath={`url(#${id})`}>{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-40 + i * 16} -232 l 8 -12 l 8 12 Z`} fill={motivo} />)}<path d="M-40 -228 H 44" stroke={motivo} strokeWidth={2.5} /></g></>}
      {borde && <path d={suave([[-18 * a, -300], [6 * a, -290], [24 * a, -298]])} stroke={borde} strokeWidth={5} fill="none" strokeLinecap="round" />}
      {nudo && <g><path d={`M${r1(10 * a)} -300 l -6 -10 l 12 2 Z M${r1(10 * a)} -300 l 10 14 l -14 -2 Z`} fill={c} stroke={N} strokeWidth={1.5} strokeLinejoin="round" /><circle cx={r1(10 * a)} cy={-300} r={4} fill={c} stroke={N} strokeWidth={1.5} /></g>}
    </g>
  );
};
/** Banda estampada sobre la falda (larga o corta), recortada a su silueta. Triángulos de kapa / tāniko. */
export const BandaFalda: React.FC<{ larga?: boolean; y: number; alto?: number; c: string; fondo?: string; motivo?: 'triangulos' | 'rombos' | 'zigzag' | 'rayas' }> = ({ larga, y, alto = 22, c, fondo, motivo = 'triangulos' }) => {
  const f = useCurrentFrame();
  const vuelo = Math.sin(f / 20) * 2;
  const pts: P[] = larga
    ? [[-27, -214], [24, -216], [36, -150], [50 + vuelo, -40], [58 + vuelo, -6], [-44, -6], [-46 - vuelo, -60], [-36, -150]]
    : [[-27, -214], [24, -216], [38, -184], [52 + vuelo, -148], [16, -142], [-26, -146 - vuelo], [-46 - vuelo, -158]];
  const id = `bf${larga ? 'l' : 'c'}${y}${c.replace('#', '')}${motivo}`;
  const n = 16, paso = 9;
  return (
    <g>
      <defs><clipPath id={id}><path d={suave(pts, true, 1)} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        {fondo && <rect x={-70} y={y} width={140} height={alto} fill={fondo} />}
        {Array.from({ length: n }, (_, i) => {
          const x = -64 + i * paso;
          return motivo === 'triangulos' ? <path key={i} d={`M${x} ${y + alto - 3} l ${paso / 2} ${-(alto - 6)} l ${paso / 2} ${alto - 6} Z`} fill={c} />
            : motivo === 'rombos' ? <path key={i} d={`M${x} ${y + alto / 2} l ${paso / 2} ${-alto / 2 + 3} l ${paso / 2} ${alto / 2 - 3} l ${-paso / 2} ${alto / 2 - 3} Z`} fill={c} />
            : motivo === 'zigzag' ? <path key={i} d={`M${x} ${y + alto - 4} l ${paso / 2} ${-(alto - 8)} l ${paso / 2} ${alto - 8}`} stroke={c} strokeWidth={3} fill="none" />
            : <path key={i} d={`M${x} ${y} v ${alto}`} stroke={c} strokeWidth={3} />;
        })}
        <path d={`M-70 ${y} H 70 M-70 ${y + alto} H 70`} stroke={c} strokeWidth={2.5} />
      </g>
    </g>
  );
};
/** Capa larga que cae por la espalda (detrás del cuerpo). ruedo: recto, tentáculos (Kanaloa) o plumas. capucha = cubre la nuca. */
export const CapaEspalda: React.FC<{ c: string; forro?: string; borde?: string; ruedo?: 'recto' | 'tentaculos' | 'plumas'; largo?: number; ancho?: number; bandas?: string[] }> = ({ c, forro, borde, ruedo = 'recto', largo = 1, ancho = 1, bandas }) => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f / 16 + k) * (3 + k * 1.5);
  const yb = -304 + 296 * largo, w = ancho;
  const ruedoPts: P[] = ruedo === 'tentaculos'
    ? [[-96 * w + o(4), yb - 6], [-84 * w, yb - 2], [-62 * w + o(3), yb - 4], [-40 * w, yb], [-22, yb - 2]]
    : ruedo === 'plumas'
    ? [[-94 * w + o(4), yb - 6], [-80 * w, yb + 2], [-66 * w + o(3), yb - 4], [-52 * w, yb + 2], [-38 * w + o(2), yb - 4], [-24, yb]]
    : [[-92 * w + o(4), yb - 6], [-60 * w + o(2), yb], [-24, yb - 2]];
  const pts: P[] = [[-14, -304], [-36, -292], [-56 * w + o(1), -304 + 104 * largo], [-78 * w + o(3), -304 + 214 * largo], ...ruedoPts, [-8, -304 + 154 * largo], [4, -286]];
  const id = `ce${c.replace('#', '')}${ruedo}${Math.round(largo * 10)}`;
  return (
    <g>
      <path d={suave(pts, true, 0.5)} fill={c} stroke={N} strokeWidth={2.5} strokeLinejoin="round" />
      {bandas && <><defs><clipPath id={id}><path d={suave(pts, true, 0.5)} /></clipPath></defs><g clipPath={`url(#${id})`}>
        {bandas.map((bc, i) => <path key={i} d={`M-140 ${r1(-250 + (i + 1) * (yb + 250) / (bandas.length + 1))} q 70 -24 150 0`} stroke={bc} strokeWidth={14} fill="none" />)}
      </g></>}
      {forro && <path d={suave([[-36, -292], [-56 * w + o(1), -304 + 104 * largo], [-78 * w + o(3), -304 + 214 * largo], ruedoPts[0], [-80 * w + o(3), yb - 40], [-60 * w, -304 + 160 * largo], [-40, -240]], true, 0.5)} fill={forro} stroke={N} strokeWidth={1.5} />}
      {ruedo === 'tentaculos' && [[-84, 0], [-62, 1], [-40, 2]].map(([x0, k]) => { const x = x0 * w + o(3 - k), y = yb - 8, g = Math.sin(f / 12 + k) * 4; const d = `M${r1(x)} ${r1(y)} C ${r1(x - 2)} ${r1(y + 24)}, ${r1(x - 16 + g)} ${r1(y + 34)}, ${r1(x - 8 + g)} ${r1(y + 46)} C ${r1(x)} ${r1(y + 54)}, ${r1(x + 8 + g)} ${r1(y + 44)}, ${r1(x + 1 + g)} ${r1(y + 40)}`; return <g key={x0}><path d={d} stroke={N} strokeWidth={12} fill="none" strokeLinecap="round" /><path d={d} stroke={c} strokeWidth={8.5} fill="none" strokeLinecap="round" />{[0.3, 0.5, 0.7].map((t) => <circle key={t} cx={r1(x + 3 - t * 12 + g * t)} cy={r1(y + t * 40)} r={1.8} fill={borde ?? '#F2E2C4'} />)}</g>; })}
      {borde && ruedo !== 'tentaculos' && <path d={suave(ruedoPts)} stroke={borde} strokeWidth={5} fill="none" strokeLinecap="round" />}
    </g>
  );
};
/** Halo de luz detrás (lava, luna, nieve…): círculo difuso detrás de la cabeza y el pecho. */
export const Aura: React.FC<{ c: string; x?: number; y?: number; r?: number; id: string; fuerza?: number }> = ({ c, x = 10, y = -300, r = 150, id, fuerza = 0.6 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><radialGradient id={id}><stop offset="0%" stopColor={c} stopOpacity={fuerza} /><stop offset="100%" stopColor={c} stopOpacity={0} /></radialGradient></defs>
      <circle cx={x} cy={y} r={r1(r * (1 + Math.sin(f / 14) * 0.04))} fill={`url(#${id})`} />
    </g>
  );
};
