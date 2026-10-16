// Elenco azteca (mexica) para el tema "codice": dioses y gente con sus atributos de códice (Borgia, Borbónico,
// Florentino) y criaturas propias. Las personas son el muñeco de siempre + `adornos` (tocados, pintura de cara,
// pectorales, escudos); las criaturas se dibujan acá (tipo "dibujo"). Colores literales: C cambia con el tema.
// Las claves de animales van en náhuatl (ocelotl, ozomatli…) para no chocar con otras series.
import React, { useId } from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, miembro, desde, type P, type PersonajeProps } from '../comun/vasija';
import { K } from '../comun/codice';
import type { Ficha } from './elenco';

const r1 = (v: number) => v.toFixed(1);
const NEGRO = K.negro;

/** Props que reciben las criaturas dibujadas acá. Origen = pies en el suelo, mirando a la derecha. */
export type DibujoProps = {
  x: number; y: number; s: number; voltear?: boolean; opacity?: number; moviendo?: boolean; corriendo?: boolean; boca?: boolean; f: number;
  color?: string; [k: string]: unknown;
};

// ---------- piezas de cabeza (coordenadas de la cabeza: cara de perfil a la derecha, ojo en 18,-6) ----------
const CARA = (mujer: boolean) => suave([[-30, 2], [-22, -26], [0, -36], [20, -30], [28, -14], [30, -6], [mujer ? 37 : 41, 6], [32, 10], [34, 15], [31, 20], [26, 26], [8, 32], [4, 46], [-16, 46], [-24, 22]], true, 0.9);

/** Franjas horizontales de pintura facial recortadas a la cara (y0–y1 de cada franja). */
export const Franjas: React.FC<{ bandas: [number, number, string][]; mujer?: boolean }> = ({ bandas, mujer = false }) => {
  const id = 'cara' + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <g>
      <defs><clipPath id={id}><path d={CARA(mujer)} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>{bandas.map(([a, b, c], i) => <rect key={i} x={-4} y={a} width={60} height={b - a} fill={c} />)}</g>
    </g>
  );
};
/** Orejera redonda de piedra verde (jade/turquesa). */
export const Orejera: React.FC<{ c?: string; r?: number }> = ({ c = K.turquesa, r = 7 }) => <g><circle cx={-8} cy={4} r={r} fill={c} stroke={NEGRO} strokeWidth={1.8} /><circle cx={-8} cy={4} r={r * 0.35} fill={K.blanco} /></g>;
/** Pluma larga de quetzal (verde, curva). Base en (x,y), ángulo en grados (0 = arriba). */
export const Pluma: React.FC<{ x: number; y: number; ang: number; l?: number; c?: string; c2?: string }> = ({ x, y, ang, l = 90, c = K.jade, c2 = K.jadeClaro }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(ang)})`}>
    <path d={`M-3 0 C -12 ${-l * 0.35}, -10 ${-l * 0.8}, 4 ${-l} C 10 ${-l * 0.75}, 8 ${-l * 0.35}, 3 0 Z`} fill={c} stroke={NEGRO} strokeWidth={1.6} />
    <path d={`M0 -4 C -4 ${-l * 0.4}, -2 ${-l * 0.75}, 3 ${-l * 0.92}`} stroke={c2} strokeWidth={2} fill="none" />
  </g>
);
export const mece = (f: number, k = 1) => Math.sin(f / 15 + k) * 3;

/** Abanico de plumas detrás de la cabeza (penacho). */
export const Penacho: React.FC<{ n?: number; l?: number; c?: string; c2?: string; desde?: number; hasta?: number; x?: number; y?: number }> = ({ n = 7, l = 92, c = K.jade, c2 = K.jadeClaro, desde: a0 = -70, hasta: a1 = 10, x = -10, y = -26 }) => {
  const f = useCurrentFrame();
  return <g>{Array.from({ length: n }, (_, i) => <Pluma key={i} x={x} y={y} ang={a0 + (i * (a1 - a0)) / Math.max(1, n - 1) + mece(f, i) * 0.6} l={l - Math.abs(i - (n - 1) / 2) * 6} c={i % 3 === 1 ? K.azul : c} c2={c2} />)}</g>;
};
/** Espejo de obsidiana que humea (Tezcatlipoca): en la sien o en lugar del pie. */
export const Espejo: React.FC<{ x: number; y: number; r?: number; humo?: boolean }> = ({ x, y, r = 11, humo = true }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`}>
      {humo && [0, 1].map((k) => { const t = ((f * 0.6 + k * 30) % 60) / 60; return <path key={k} d={`M${-2 + k * 5} ${-r} C ${-14 + k * 8} ${-r - 16 - t * 10}, ${10 + k * 4} ${-r - 26 - t * 14}, ${-4 + k * 6} ${-r - 40 - t * 18} C ${-12} ${-r - 46 - t * 18}, ${-14} ${-r - 36 - t * 14}, ${-6} ${-r - 32 - t * 12}`} stroke="#9A948A" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85 - t * 0.5} />; })}
      <circle r={r + 3} fill={K.amarillo} stroke={NEGRO} strokeWidth={1.6} />
      <circle r={r} fill="#232026" stroke={NEGRO} strokeWidth={1.4} />
      <path d={`M${-r * 0.5} ${-r * 0.3} q ${r * 0.4} ${-r * 0.4} ${r * 0.8} ${-r * 0.1}`} stroke="#C9CDD6" strokeWidth={2} fill="none" />
    </g>
  );
};
/** Pelo de mujer mexica: dos mechones como cuernitos sobre la frente (axtlacuilli). */
export const PeloMexica: React.FC = () => <path d="M-4 -34 C -2 -52, 10 -56, 12 -46 C 6 -46, 4 -40, 6 -34 Z M8 -32 C 14 -48, 26 -48, 26 -38 C 20 -40, 16 -34, 16 -30 Z" fill={NEGRO} />;
/** Diadema turquesa de punta (xiuhuitzolli), de señores y dioses principales. */
const Xiuhuitzolli: React.FC = () => <g><path d="M-30 -10 C -22 -30, 4 -40, 26 -30 L 20 -60 L 6 -38 C -8 -36, -20 -28, -30 -10 Z" fill={K.turquesa} stroke={NEGRO} strokeWidth={2} />{[-20, -8, 4].map((x, i) => <circle key={i} cx={x} cy={-26 - i * 4} r={2.5} fill={K.blanco} />)}</g>;
/** Banda de tela con borde de puntos (tocado simple). */
export const Banda: React.FC<{ c?: string }> = ({ c = K.rojo }) => <g><path d="M-31 0 C -18 -20, 8 -28, 30 -20" stroke={c} strokeWidth={8} fill="none" /><path d="M-31 0 C -18 -20, 8 -28, 30 -20" stroke={K.blanco} strokeWidth={2.4} strokeDasharray="1 7" strokeLinecap="round" fill="none" /></g>;

// ---------- piezas de cuerpo (coordenadas del cuerpo: hombros y≈-300, cintura -210, pies 0) ----------
/** Huipil (blusa) de mujer con greca en el borde: cubre el torso. */
const Huipil: React.FC<{ c?: string; borde?: string }> = ({ c = K.blanco, borde = K.rojo }) => {
  const a = 0.92;
  return (
    <g>
      <path d={suave([[-20 * a, -300], [18 * a, -304], [34 * a, -282], [36, -246], [40, -196], [-36, -194], [-32 * a, -250], [-30 * a, -284]], true)} fill={c} stroke={NEGRO} strokeWidth={2} />
      <path d="M-34 -204 L 38 -206" stroke={borde} strokeWidth={9} />
      {[-26, -10, 6, 22].map((x) => <path key={x} d={`M${x} -200 v -6 h 6 v -4 h 6`} stroke={K.blanco} strokeWidth={2} fill="none" />)}
      <path d="M-10 -300 Q 6 -284 20 -300" stroke={borde} strokeWidth={4} fill="none" />
    </g>
  );
};
/** Costillas de esqueleto (señores de la muerte): dibujo amable, sin morbo. */
const Costillas: React.FC = () => <g>{[0, 1, 2, 3].map((i) => <path key={i} d={`M${-20 + i} ${-286 + i * 18} C ${-4} ${-280 + i * 18}, ${14} ${-280 + i * 18}, ${26 - i * 2} ${-288 + i * 18}`} stroke="#6E6656" strokeWidth={3.4} fill="none" strokeLinecap="round" />)}<path d="M2 -296 V -214" stroke="#6E6656" strokeWidth={3} /></g>;
/** Joya del viento (ehecailacacozcatl): corte de caracol, pectoral de Quetzalcóatl. */
const JoyaViento: React.FC = () => <g transform="translate(8 -262)"><circle r={17} fill={K.blanco} stroke={NEGRO} strokeWidth={2} /><path d="M0 -17 C 12 -10, 10 4, 0 4 C -8 4, -8 -6, 0 -6" stroke={NEGRO} strokeWidth={2} fill="none" /><path d="M-17 0 C -10 12, 4 10, 4 0" stroke={NEGRO} strokeWidth={2} fill="none" /></g>;
/** Pectoral redondo (anillo blanco de concha) de Tezcatlipoca. */
const Anahuatl: React.FC = () => <g transform="translate(8 -262)"><circle r={15} fill="none" stroke={K.blanco} strokeWidth={7} /><circle r={15} fill="none" stroke={NEGRO} strokeWidth={1.4} /><circle r={19} fill="none" stroke={NEGRO} strokeWidth={1.2} /></g>;
/** Escudo redondo (chimalli) con cinco bolas de plumón y flecos de plumas. */
export const Chimalli: React.FC<{ c?: string; c2?: string }> = ({ c = K.turquesa, c2 = K.amarillo }) => (
  <g transform="translate(-6 6)">
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-30 + i * 10} 40 l -3 26 l 8 0 Z`} fill={i % 2 ? K.rojo : c2} stroke={NEGRO} strokeWidth={1.2} />)}
    <circle r={46} fill={c} stroke={NEGRO} strokeWidth={3} />
    <circle r={40} fill="none" stroke={c2} strokeWidth={4} />
    {[[0, 0], [-18, -18], [18, -18], [-18, 18], [18, 18]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r={7} fill={K.blanco} stroke={NEGRO} strokeWidth={1.5} />)}
  </g>
);
/** Atado de dardos (mitl) en la mano. */
export const Dardos: React.FC = () => <g transform="rotate(-6)">{[-6, 0, 6].map((dx, i) => <g key={i}><path d={`M${dx} 50 L ${dx} -100`} stroke="#6E4A26" strokeWidth={4} /><path d={`M${dx - 4} -100 L ${dx} -116 L ${dx + 4} -100 Z`} fill={K.gris} stroke={NEGRO} strokeWidth={1} /><path d={`M${dx - 4} 44 l 4 -14 l 4 14`} fill={K.rojo} /></g>)}<rect x={-10} y={-8} width={20} height={8} fill={K.rojo} /></g>;
/** Bastón de rayo ondulado (Tlaloc). */
const BastonRayo: React.FC = () => <g><path d="M0 80 L 0 20 L -10 0 L 8 -30 L -8 -60 L 10 -96 L -4 -130 L 8 -150" stroke={NEGRO} strokeWidth={11} fill="none" strokeLinejoin="round" /><path d="M0 80 L 0 20 L -10 0 L 8 -30 L -8 -60 L 10 -96 L -4 -130 L 8 -150" stroke={K.amarillo} strokeWidth={6} fill="none" strokeLinejoin="round" /></g>;
/** Bastón de mando con plumas (señores). */
const BastonPlumas: React.FC = () => <g><path d="M0 90 L 0 -150" stroke={NEGRO} strokeWidth={7} /><circle cx={0} cy={-154} r={8} fill={K.turquesa} stroke={NEGRO} strokeWidth={1.5} /><Pluma x={0} y={-150} ang={-18} l={50} /><Pluma x={0} y={-150} ang={16} l={46} /></g>;
/** Bolsa de copal de los sacerdotes. */
const BolsaCopal: React.FC = () => <g transform="translate(0 14)"><path d="M-12 0 C -16 30, 16 30, 12 0 Z" fill={K.crema} stroke={NEGRO} strokeWidth={1.6} /><path d="M-10 10 h 20" stroke={K.rojo} strokeWidth={3} />{[-6, 0, 6].map((x) => <path key={x} d={`M${x} 24 v 10`} stroke={K.rojo} strokeWidth={2} />)}</g>;
/** Caracol marino grande (Tecciztécatl lo lleva a la espalda). */
const Caracol: React.FC<{ x?: number; y?: number; s?: number }> = ({ x = -40, y = -250, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s}) rotate(-20)`}><path d="M-24 18 C -34 -10, -16 -40, 10 -40 C 30 -38, 36 -14, 22 6 C 12 20, -8 28, -24 18 Z" fill={K.blanco} stroke={NEGRO} strokeWidth={2.2} /><path d="M10 -40 C 0 -20, 4 -2, 22 6 M-6 -36 C -14 -16, -8 10, 8 18" stroke={K.rosa} strokeWidth={2.4} fill="none" /><path d="M-24 18 L -34 28" stroke={NEGRO} strokeWidth={3} /></g>;
/** Granitos (llagas) de Nanahuatzin: puntitos claros. */
const Granos: React.FC<{ cuerpo?: boolean }> = ({ cuerpo }) => <g>{(cuerpo ? [[-14, -280], [10, -268], [22, -240], [-8, -238], [4, -222]] : [[4, 2], [24, 14], [-8, 20], [12, -20]]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.2} fill="#E8C9A0" stroke="#7E4A2A" strokeWidth={1} />)}</g>;
/** Falda de serpientes entretejidas (Coatlicue). */
const FaldaSerpientes: React.FC = () => <g>{[-180, -140, -100, -60, -24].map((y, i) => <g key={i}><path d={`M-40 ${y} q 12 -8 24 0 t 24 0 t 24 0 t 24 0`} stroke={NEGRO} strokeWidth={9} fill="none" /><path d={`M-40 ${y} q 12 -8 24 0 t 24 0 t 24 0 t 24 0`} stroke={K.jadeClaro} strokeWidth={5} fill="none" /><circle cx={56} cy={y} r={4.5} fill={K.jadeClaro} stroke={NEGRO} strokeWidth={1.5} /></g>)}</g>;
/** Fardo sagrado a la espalda (tlaquimilolli) que cargan los teomamas. */
const Fardo: React.FC = () => <g transform="translate(-44 -270)"><rect x={-26} y={-20} width={44} height={86} rx={12} fill={K.crema2} stroke={NEGRO} strokeWidth={2.2} />{[0, 22, 44].map((y) => <path key={y} d={`M-26 ${y - 6} h 44`} stroke={K.rojo} strokeWidth={4} />)}<Pluma x={-6} y={-18} ang={-20} l={44} /><Pluma x={2} y={-18} ang={10} l={40} c={K.azul} /></g>;

// ---------- criaturas ----------
export const ojoCodice = (x: number, y: number, r = 6) => <g><circle cx={x} cy={y} r={r + 2} fill={K.rojo} stroke={NEGRO} strokeWidth={1.4} /><circle cx={x} cy={y} r={r} fill={K.blanco} stroke={NEGRO} strokeWidth={1.2} /><circle cx={x + r * 0.2} cy={y + r * 0.1} r={r * 0.45} fill={NEGRO} /></g>;
const pataAnimada = (fase: number, amp: number, cad: P, ph: number, l1: number, l2: number, del: boolean, anchos: number[]) => {
  const a = Math.sin(fase + ph) * amp;
  const rod = desde(cad, a, l1);
  const pie = desde(rod, a + (del ? -1 : 1) * (10 + Math.max(0, Math.sin(fase + ph + 1.5)) * 26), l2);
  return miembro([cad, rod, pie], anchos);
};

/** Jaguar (ocelotl): amarillo ocre con rosetas negras. */
const Jaguar: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, corriendo, boca, f, color = '#E2A93A', manchas = true }) => {
  const fase = moviendo || corriendo ? f * (corriendo ? 0.38 : 0.2) : 0, amp = corriendo ? 34 : moviendo ? 20 : 0;
  const bote = corriendo ? -Math.abs(Math.sin(fase)) * 10 : 0;
  const pata = (cx: number, ph: number, del: boolean) => pataAnimada(fase, amp, [cx, -92], ph, 48, 44, del, [32, 20, 15]);
  const cuerpo: P[] = [[-124, -128], [-70, -146], [30, -144], [96, -138], [124, -110], [102, -76], [36, -66], [-64, -70], [-122, -90]];
  const rosetas: P[] = [[-96, -112], [-66, -128], [-40, -104], [-12, -126], [16, -100], [40, -124], [66, -102], [88, -124], [-80, -84], [-20, -82], [50, -80]];
  return (
    <g transform={`translate(${x} ${y + bote}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={pata(-92, Math.PI, false)} fill={color} stroke={NEGRO} strokeWidth={2} />
      <path d={pata(74, 0, true)} fill={color} stroke={NEGRO} strokeWidth={2} />
      <path d={suave([[-120, -112], [-158, -104 + Math.sin(f / 10) * 8], [-178, -70], [-170, -36], [-150, -30]])} stroke={NEGRO} strokeWidth={17} fill="none" strokeLinecap="round" />
      <path d={suave([[-120, -112], [-158, -104 + Math.sin(f / 10) * 8], [-178, -70], [-170, -36], [-150, -30]])} stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="16 8" />
      <path d={suave(cuerpo, true)} fill={color} stroke={NEGRO} strokeWidth={2.5} />
      <path d={suave([[-90, -76], [-20, -68], [60, -72], [96, -82]])} stroke={K.crema} strokeWidth={9} fill="none" strokeLinecap="round" />
      {manchas !== false && rosetas.map(([cx, cy], i) => <g key={i}><circle cx={cx} cy={cy} r={8} fill="none" stroke={NEGRO} strokeWidth={3.2} strokeDasharray="9 4" /><circle cx={cx} cy={cy} r={2.4} fill={NEGRO} /></g>)}
      <path d={pata(-70, 0, false)} fill={color} stroke={NEGRO} strokeWidth={2} />
      <path d={pata(96, Math.PI, true)} fill={color} stroke={NEGRO} strokeWidth={2} />
      <g transform={`translate(122 -126) rotate(${Math.sin(f / 16) * 3})`}>
        <path d="M-8 -26 C -12 -44, 6 -46, 8 -30 Z M12 -30 C 14 -46, 30 -44, 26 -26 Z" fill={color} stroke={NEGRO} strokeWidth={2} />
        <path d={suave([[-24, 22], [-28, -12], [-4, -32], [26, -30], [46, -14], [56, 4], boca ? [40, 14] : [44, 18], [16, 26]], true)} fill={color} stroke={NEGRO} strokeWidth={2.5} />
        {boca && <path d="M38 10 L 62 16 L 40 26 Z" fill={K.rojo} stroke={NEGRO} strokeWidth={1.5} />}
        {boca && <path d="M44 12 l 3 6 l 3 -5 M52 15 l 2 5 l 3 -4" stroke={K.blanco} strokeWidth={2} fill="none" />}
        <path d="M50 -2 C 56 -2, 58 2, 56 6 Z" fill={NEGRO} />
        <circle cx={-6} cy={4} r={5} fill="none" stroke={NEGRO} strokeWidth={2.4} strokeDasharray="6 3" />
        <path d="M14 -16 Q 24 -24 34 -16 Q 24 -10 14 -16 Z" fill={K.amarillo} stroke={NEGRO} strokeWidth={1.6} />
        <circle cx={26} cy={-16} r={3} fill={NEGRO} />
        <path d="M36 8 l 18 -2 M36 12 l 16 4" stroke={NEGRO} strokeWidth={1.2} />
      </g>
    </g>
  );
};

/** Mono (ozomatli): los que quedaron del Sol de Viento. Chico, cola en espiral, cara clara. */
const Mono: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, corriendo, f, color = '#9A5A2E' }) => {
  const fase = moviendo || corriendo ? f * 0.3 : 0, sw = Math.sin(fase) * (moviendo || corriendo ? 22 : 0);
  const salto = moviendo || corriendo ? -Math.abs(Math.sin(fase)) * 12 : Math.sin(f / 14) * 1.5;
  return (
    <g transform={`translate(${x} ${y + salto}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-34 -60 C -70 -60, -84 -110, -60 -126 C -40 -138, -24 -114, -40 -104 C -50 -98, -56 -110, -50 -116`} stroke={NEGRO} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={`M-34 -60 C -70 -60, -84 -110, -60 -126 C -40 -138, -24 -114, -40 -104 C -50 -98, -56 -110, -50 -116`} stroke={color} strokeWidth={5.5} fill="none" strokeLinecap="round" />
      <path d={miembro([[-14, -50], [-24 - sw * 0.3, -26], [-10, 0]], [18, 13, 10])} fill={color} stroke={NEGRO} strokeWidth={1.8} />
      <path d={miembro([[-6, -116], [-30 - sw * 0.4, -86], [-26, -56]], [14, 10, 9])} fill={color} stroke={NEGRO} strokeWidth={1.8} />
      <path d={suave([[-32, -60], [-26, -110], [0, -126], [22, -110], [22, -70], [6, -46], [-20, -44]], true)} fill={color} stroke={NEGRO} strokeWidth={2.2} />
      <path d={suave([[-8, -104], [12, -96], [14, -70], [0, -56], [-10, -70]], true)} fill="#D9A26A" />
      <path d={miembro([[10, -50], [24 + sw * 0.3, -26], [16, 0]], [18, 13, 10])} fill={color} stroke={NEGRO} strokeWidth={1.8} />
      <path d={miembro([[10, -116], [40 + sw * 0.5, -96], [52, -70 - sw * 0.6]], [14, 10, 9])} fill={color} stroke={NEGRO} strokeWidth={1.8} />
      <g transform="translate(14 -142)">
        <path d={suave([[-26, 4], [-22, -20], [0, -30], [22, -22], [28, -2], [20, 18], [-4, 22], [-20, 18]], true)} fill={color} stroke={NEGRO} strokeWidth={2.2} />
        <circle cx={-18} cy={-4} r={8} fill="#D9A26A" stroke={NEGRO} strokeWidth={1.6} />
        <path d={suave([[0, -14], [26, -12], [34, 4], [24, 16], [4, 14]], true)} fill="#E7BC8A" stroke={NEGRO} strokeWidth={1.6} />
        <circle cx={14} cy={-6} r={4.2} fill={K.blanco} stroke={NEGRO} strokeWidth={1.2} /><circle cx={15.5} cy={-6} r={2} fill={NEGRO} />
        <path d="M22 8 q 6 4 10 0" stroke={NEGRO} strokeWidth={1.6} fill="none" />
        <path d="M-6 -28 C 0 -38, 10 -36, 12 -28" stroke={K.rojo} strokeWidth={5} fill="none" />
      </g>
    </g>
  );
};

/** Cipactli / Tlaltecuhtli: el gran monstruo-caimán de las aguas primeras. props.ojos = ojos y bocas en las
 * coyunturas (Tlaltecuhtli); props.parte = "cabeza" | "cola" dibuja solo una mitad (cuando lo parten en dos). */
const Cipactli: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, boca, f, color = '#5E8A4A', ojos, parte }) => {
  const id = 'cip' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const ond = (t: number) => Math.sin(t * 5 + f * (moviendo ? 0.18 : 0.06)) * 10;
  const n = 14, largo = 640;
  const lomo: P[] = Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return [-largo + t * (largo + 60), -60 - Math.sin(t * Math.PI) * 50 + ond(t) * (1 - t)] as P; });
  const anchos = lomo.map((_, i) => { const t = i / (n - 1); return 20 + Math.sin(Math.min(1, t * 1.2) * Math.PI * 0.9) * 90; });
  const pata = (px: number, k: number) => { const a = moviendo ? Math.sin(f * 0.2 + k) * 18 : 0; return miembro([[px, -60], [px + 24 + a, -26], [px + 40 + a, 0]], [40, 26, 18]); };
  const clip = parte === 'cabeza' ? <rect x={-330} y={-400} width={1400} height={600} /> : parte === 'cola' ? <rect x={-1000} y={-400} width={670} height={600} /> : null;
  const cab = lomo[n - 1];
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {clip && <defs><clipPath id={id}>{clip}</clipPath></defs>}
      <g clipPath={clip ? `url(#${id})` : undefined}>
        {[-480, -150].map((px, i) => <path key={i} d={pata(px, i)} fill={color} stroke={NEGRO} strokeWidth={2.4} />)}
        <path d={miembro(lomo, anchos)} fill={color} stroke={NEGRO} strokeWidth={3} />
        <path d={suave(lomo.slice(1, -1).map(([px, py], i) => [px, py + anchos[i + 1] * 0.32] as P))} stroke="#E9D08A" strokeWidth={14} fill="none" strokeLinecap="round" />
        {lomo.slice(1, -1).map(([px, py], i) => <path key={i} d={`M${r1(px - 4)} ${r1(py + anchos[i + 1] * 0.22)} v 18`} stroke={NEGRO} strokeWidth={1.6} />)}
        {lomo.slice(1, -2).map(([px, py], i) => { const h = anchos[i + 1] * 0.5; return <path key={`p${i}`} d={`M${r1(px - 16)} ${r1(py - h + 6)} L ${r1(px)} ${r1(py - h - 26)} L ${r1(px + 16)} ${r1(py - h + 6)} Z`} fill={i % 2 ? K.rojo : K.amarillo} stroke={NEGRO} strokeWidth={1.8} />; })}
        {!!ojos && lomo.slice(2, -2).filter((_, i) => i % 2 === 0).map(([px, py], i) => <g key={`o${i}`}>{ojoCodice(px + 6, py - 4, 6)}</g>)}
        {!!ojos && [-480, -150].map((px, i) => <g key={`b${i}`} transform={`translate(${px + 26} -34)`}><path d="M-12 0 C -6 -10, 6 -10, 12 0 C 6 8, -6 8, -12 0 Z" fill={K.rojo} stroke={NEGRO} strokeWidth={1.5} /><path d="M-8 -2 l 3 5 l 3 -5 l 3 5 l 3 -5" stroke={K.blanco} strokeWidth={1.6} fill="none" /></g>)}
        {[-60, 60].map((px, i) => <path key={`q${i}`} d={pata(px, i + 2)} fill={color} stroke={NEGRO} strokeWidth={2.4} />)}
        <g transform={`translate(${r1(cab[0])} ${r1(cab[1])}) rotate(${boca ? -8 : 0})`}>
          <path d={`M-10 -40 C 30 -56, 110 -50, 170 -30 C 176 -22, 172 -14, 160 -12 L 10 -6 Z`} fill={color} stroke={NEGRO} strokeWidth={2.6} />
          <g transform={`rotate(${boca ? 16 + Math.sin(f / 5) * 3 : 0} 0 -4)`}>
            <path d="M-10 -6 L 156 -10 C 160 6, 150 16, 130 18 C 80 22, 30 22, -10 26 Z" fill={color} stroke={NEGRO} strokeWidth={2.6} />
            <path d="M20 -6 l 8 -12 l 8 12 M60 -8 l 8 -12 l 8 12 M100 -9 l 8 -12 l 8 12 M136 -10 l 6 -10 l 6 10" fill={K.blanco} stroke={NEGRO} strokeWidth={1.2} />
          </g>
          <path d="M30 -10 l 8 12 l 8 -12 M70 -11 l 8 12 l 8 -12 M110 -12 l 8 12 l 8 -12" fill={K.blanco} stroke={NEGRO} strokeWidth={1.2} />
          {boca && <path d="M10 -6 L 150 -10 L 120 6 Z" fill={K.rojoOsc} opacity={0.8} />}
          <path d="M14 -46 C 20 -70, 50 -70, 54 -48 Z" fill={color} stroke={NEGRO} strokeWidth={2.2} />
          {ojoCodice(36, -48, 9)}
          <path d="M150 -34 l 10 -6" stroke={NEGRO} strokeWidth={3} />
        </g>
      </g>
    </g>
  );
};

/** Serpiente emplumada (Quetzalcóatl) o serpiente oscura (props.plumas: false). Origen = suelo, cola a la izquierda. */
const SerpienteEmplumada: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, boca, f, color = '#3E8A5A', plumas = true, panza = '#E6B12E', largo = 520, erguida = 0.8 }) => {
  const L = largo as number, n = 14, g = 46;
  const cuerpo: P[] = Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return [-L + t * L, -g / 2 - Math.sin(t * Math.PI * 2.2 + f * 0.12) * 20 * (1 - t * 0.5) - (t > 0.75 ? (t - 0.75) * 4 * 170 * (erguida as number) : 0)] as P; });
  const anchos = cuerpo.map((_, i) => { const t = i / (n - 1); return Math.max(10, g * Math.max(t > 0.5 ? 0.6 : 0, Math.sin(Math.PI * Math.min(1, t * 1.1 + 0.08)))); });
  const cab = cuerpo[n - 1], ant = cuerpo[n - 2];
  const ang = (Math.atan2(cab[1] - ant[1], cab[0] - ant[0]) * 180) / Math.PI;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {!!plumas && cuerpo.slice(2, -1).map(([px, py], i) => <Pluma key={`pl${i}`} x={px} y={py - anchos[i + 2] * 0.35} ang={-30 + Math.sin(f / 9 + i) * 8} l={30 + (i % 3) * 8} c={i % 2 ? K.jade : K.turquesa} />)}
      <path d={miembro(cuerpo, anchos)} fill={color} stroke={NEGRO} strokeWidth={2.6} />
      <path d={suave(cuerpo.slice(1, -1).map(([px, py], i) => [px, py + anchos[i + 1] * 0.25] as P))} stroke={panza as string} strokeWidth={9} fill="none" strokeLinecap="round" />
      {cuerpo.slice(1, -1).map(([px, py], i) => <path key={i} d={`M${r1(px)} ${r1(py - anchos[i + 1] * 0.45)} v ${r1(anchos[i + 1] * 0.5)}`} stroke={NEGRO} strokeWidth={1.4} opacity={0.6} />)}
      {!plumas && cuerpo.slice(1, -1).map(([px, py], i) => i % 2 ? <rect key={`m${i}`} x={px - 6} y={py - anchos[i + 1] * 0.3} width={12} height={anchos[i + 1] * 0.3} fill={K.amarillo} /> : null)}
      <path d={`M${-L} ${-g / 2} l -18 -14 l 4 18 l -10 8 Z`} fill={plumas ? K.jade : color} stroke={NEGRO} strokeWidth={1.6} />
      <g transform={`translate(${r1(cab[0])} ${r1(cab[1])}) rotate(${r1(Math.max(-30, Math.min(20, ang)) * 0.5)})`}>
        {!!plumas && <><Pluma x={-10} y={-18} ang={-60 + mece(f)} l={70} /><Pluma x={-4} y={-22} ang={-35 + mece(f, 2)} l={78} c={K.turquesa} /><Pluma x={4} y={-24} ang={-12 + mece(f, 3)} l={64} c={K.azul} /></>}
        <path d={suave([[-20, 14], [-16, -22], [20, -28], [58, -14], boca ? [40, -2] : [60, 2], [24, 16]], true)} fill={color} stroke={NEGRO} strokeWidth={2.4} />
        {boca && <path d="M36 -2 L 66 8 L 34 16 Z" fill={K.rojo} stroke={NEGRO} strokeWidth={1.5} />}
        <path d="M2 -26 C 10 -40, 30 -38, 36 -24" fill={plumas ? K.rojo : K.amarillo} stroke={NEGRO} strokeWidth={1.6} />
        {ojoCodice(22, -12, 5)}
        <path d={`M58 2 l ${14 + Math.sin(f / 3) * 4} -5 m -2 5 l ${14 + Math.sin(f / 3) * 4} 5`} stroke={K.rojo} strokeWidth={2.5} />
      </g>
    </g>
  );
};

/** Colibrí (huitzitzilin): chiquito, verde turquesa, alas que zumban. Origen = centro del cuerpo. */
const Colibri: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, f, color = K.turquesa }) => {
  const a = Math.sin(f * 2.2) * 50, flota = Math.sin(f / 6) * 4;
  return (
    <g transform={`translate(${x} ${y + flota}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path transform={`rotate(${a} -4 -8)`} d="M-4 -8 C -20 -50, -50 -60, -70 -56 C -50 -40, -30 -24, -8 0 Z" fill="#BFE3DC" stroke={NEGRO} strokeWidth={1.6} opacity={0.9} />
      <path d="M-40 6 L -70 16 L -64 0 L -72 -8 Z" fill={K.jade} stroke={NEGRO} strokeWidth={1.6} />
      <path d={suave([[-44, 4], [-20, -12], [16, -14], [30, -4], [20, 10], [-14, 14]], true)} fill={color} stroke={NEGRO} strokeWidth={2} />
      <path d="M0 8 C 8 14, 18 10, 22 4" stroke={K.rojo} strokeWidth={5} fill="none" />
      <circle cx={28} cy={-10} r={12} fill={color} stroke={NEGRO} strokeWidth={2} />
      <path d="M38 -10 L 78 -6 L 38 -4 Z" fill={NEGRO} />
      <circle cx={31} cy={-13} r={3} fill={K.blanco} /><circle cx={32} cy={-13} r={1.6} fill={NEGRO} />
      <path transform={`rotate(${-a * 0.8} -4 -8)`} d="M-4 -8 C -16 -46, -40 -64, -62 -66 C -46 -46, -28 -26, -6 -2 Z" fill="#DDF2EE" stroke={NEGRO} strokeWidth={1.6} opacity={0.95} />
    </g>
  );
};

/** Hormiga (azcatl): roja por defecto; color negro para la hormiga negra (Quetzalcóatl transformado). */
const Hormiga: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#A8321F' }) => {
  const p = moviendo ? Math.sin(f / 2.5) * 8 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {[-14, 0, 14].map((lx, i) => <path key={i} d={`M${lx} -18 l ${-10 + (i % 2 ? p : -p)} 18 M${lx + 2} -18 l ${10 - (i % 2 ? p : -p)} 18`} stroke={NEGRO} strokeWidth={3} strokeLinecap="round" />)}
      <ellipse cx={-30} cy={-20} rx={20} ry={14} fill={color} stroke={NEGRO} strokeWidth={2} />
      <ellipse cx={0} cy={-22} rx={12} ry={8} fill={color} stroke={NEGRO} strokeWidth={2} />
      <circle cx={22} cy={-26} r={11} fill={color} stroke={NEGRO} strokeWidth={2} />
      <path d={`M26 -36 q 6 -16 ${16 + p * 0.3} -18 M22 -36 q 0 -18 ${10 - p * 0.3} -24`} stroke={NEGRO} strokeWidth={2.2} fill="none" />
      <circle cx={27} cy={-28} r={3} fill={K.blanco} /><circle cx={28} cy={-28} r={1.6} fill={NEGRO} />
      <path d="M32 -20 l 6 4 l -6 2" stroke={NEGRO} strokeWidth={1.6} fill="none" />
    </g>
  );
};

/** Conejo (tochtli): sentado, orejas largas. */
const Conejo: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#E9DCC0' }) => {
  const salto = moviendo ? -Math.abs(Math.sin(f / 4)) * 22 : 0, orej = Math.sin(f / 18) * 4;
  return (
    <g transform={`translate(${x} ${y + salto}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <circle cx={-46} cy={-36} r={12} fill={K.blanco} stroke={NEGRO} strokeWidth={1.8} />
      <path d={suave([[-48, -4], [-50, -48], [-20, -74], [14, -66], [26, -34], [16, -4]], true)} fill={color} stroke={NEGRO} strokeWidth={2.2} />
      <path d="M-30 -2 C -34 -20, -6 -24, 2 -8 L 6 0 Z" fill={color} stroke={NEGRO} strokeWidth={1.8} />
      <path d="M18 -10 l 14 10 l -16 0 Z" fill={color} stroke={NEGRO} strokeWidth={1.6} />
      <g transform="translate(22 -78)">
        <path d={`M-8 -6 C -18 -40, ${-14 + orej} -66, ${-4 + orej} -66 C 4 -60, 4 -30, 4 -6 Z`} fill={color} stroke={NEGRO} strokeWidth={1.8} />
        <path d={`M-6 -14 C -12 -36, ${-10 + orej} -54, ${-4 + orej} -56`} stroke={K.rosa} strokeWidth={3} fill="none" />
        <path d={`M4 -6 C 4 -40, ${14 - orej} -62, ${22 - orej} -60 C 26 -50, 18 -24, 14 -2 Z`} fill={color} stroke={NEGRO} strokeWidth={1.8} />
        <path d={suave([[-16, 6], [-12, -12], [10, -16], [30, -2], [34, 12], [20, 22], [-6, 22]], true)} fill={color} stroke={NEGRO} strokeWidth={2} />
        <circle cx={14} cy={-2} r={3.6} fill={NEGRO} /><circle cx={15} cy={-3.4} r={1.1} fill={K.blanco} />
        <circle cx={33} cy={10} r={3} fill={K.rosa} />
      </g>
    </g>
  );
};

/** Águila real (cuauhtli) parada: marrón, cabeza dorada, pico amarillo; props.alas = alas abiertas. */
const Aguila: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, boca, f, alas = false, color = '#6B4426' }) => {
  const ab = alas ? 1 : 0, al = Math.sin(f / 7) * 6 * ab;
  const ala = (k: number) => <path transform={`rotate(${(k > 0 ? -1 : 1) * al} ${k > 0 ? 8 : -8} -110)`} d={ab ? `M0 -110 C ${k * 40} -150, ${k * 120} -200, ${k * 170} -190 C ${k * 150} -170, ${k * 156} -160, ${k * 140} -150 C ${k * 160} -140, ${k * 150} -126, ${k * 130} -124 C ${k * 140} -108, ${k * 120} -96, ${k * 100} -98 C ${k * 80} -80, ${k * 40} -80, 0 -70 Z` : `M-8 -120 C -40 -110, -60 -70, -66 -30 C -40 -40, -20 -60, 4 -80 Z`} fill={k > 0 ? '#8A5A30' : color} stroke={NEGRO} strokeWidth={2.2} />;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {ab ? ala(-1) : null}
      <path d="M-40 -46 L -78 -6 L -60 -4 L -66 10 L -40 -16 Z" fill={K.blanco} stroke={NEGRO} strokeWidth={2} />
      <path d="M-6 -24 v 20 l -10 6 M-6 -4 l 8 6 M12 -24 v 20 l -10 6 M12 -4 l 8 6" stroke={K.amarillo} strokeWidth={5} strokeLinecap="round" />
      <path d={suave([[-44, -40], [-34, -100], [-6, -132], [22, -128], [34, -96], [26, -46], [0, -24], [-30, -26]], true)} fill={color} stroke={NEGRO} strokeWidth={2.4} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${-20 + i * 12} ${-70 + i * 6} q 6 8 0 16`} stroke="#A07A4A" strokeWidth={2} fill="none" />)}
      {!ab && ala(1)}
      {ab ? ala(1) : null}
      <g transform="translate(10 -138)">
        <path d={suave([[-24, 20], [-20, -12], [6, -24], [28, -16], [36, -2], [24, 12], [0, 24]], true)} fill="#C9923A" stroke={NEGRO} strokeWidth={2.2} />
        <path d={boca ? 'M28 -10 C 52 -12, 60 0, 50 14 L 44 4 L 30 6 Z M30 8 L 46 12 L 30 14 Z' : 'M28 -10 C 52 -12, 60 0, 50 14 C 46 6, 40 4, 30 6 Z'} fill={K.amarillo} stroke={NEGRO} strokeWidth={1.8} />
        <path d="M6 -10 Q 16 -16 26 -10 Q 16 -6 6 -10 Z" fill={K.blanco} stroke={NEGRO} strokeWidth={1.4} />
        <circle cx={17} cy={-10} r={3} fill={NEGRO} />
        <path d="M2 -16 L 26 -18" stroke={NEGRO} strokeWidth={2.4} />
      </g>
    </g>
  );
};

/** Guajolote (huexolotl): los que quedaron del Sol de Lluvia de Fuego. */
const Guajolote: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#3A2E2A' }) => {
  const p = moviendo ? Math.sin(f / 3) * 10 : 0, cab = moviendo ? Math.sin(f / 3) * 6 : Math.sin(f / 20) * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {Array.from({ length: 7 }, (_, i) => { const a = -150 + i * 16; const rr = (a * Math.PI) / 180; return <path key={i} d={`M-20 -70 L ${r1(-20 + Math.cos(rr) * 80)} ${r1(-70 + Math.sin(rr) * 80)} L ${r1(-20 + Math.cos(rr + 0.2) * 80)} ${r1(-70 + Math.sin(rr + 0.2) * 80)} Z`} fill={i % 2 ? '#6E4A2A' : '#4A3420'} stroke={NEGRO} strokeWidth={1.6} />; })}
      <path d={`M-6 -40 l ${-4 + p * 0.4} 40 M10 -40 l ${4 - p * 0.4} 40`} stroke="#C97A4A" strokeWidth={5} strokeLinecap="round" />
      <path d={suave([[-40, -60], [-20, -100], [20, -96], [36, -66], [16, -36], [-24, -38]], true)} fill={color} stroke={NEGRO} strokeWidth={2.2} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${-20 + i * 14} -84 q 6 10 0 20`} stroke={K.crema} strokeWidth={1.6} fill="none" opacity={0.6} />)}
      <g transform={`translate(${26 + cab} -100)`}>
        <path d="M-6 30 C -8 0, 0 -20, 10 -24 C 20 -24, 22 -12, 16 -6 C 12 6, 10 20, 10 30 Z" fill="#7FA7C8" stroke={NEGRO} strokeWidth={1.8} />
        <path d="M18 -14 l 12 4 l -12 4 Z" fill={K.amarillo} stroke={NEGRO} strokeWidth={1.2} />
        <path d="M16 -6 C 22 4, 18 14, 12 12" fill={K.rojo} stroke={NEGRO} strokeWidth={1.4} />
        <circle cx={11} cy={-15} r={2.4} fill={NEGRO} />
      </g>
    </g>
  );
};

/** Codorniz (zolin): ave chiquita de suelo, la que asusta a Quetzalcóatl en el Mictlan. */
const Codorniz: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#8A6A44' }) => {
  const p = moviendo ? Math.sin(f / 2) * 6 : 0, pica = moviendo ? 0 : Math.max(0, Math.sin(f / 9)) * 8;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-6 -14 l ${-4 + p} 14 M6 -14 l ${4 - p} 14`} stroke="#C97A4A" strokeWidth={3} strokeLinecap="round" />
      <path d={suave([[-34, -24], [-20, -46], [10, -48], [26, -34], [18, -16], [-14, -12]], true)} fill={color} stroke={NEGRO} strokeWidth={2} />
      {[-18, -6, 6].map((dx, i) => <circle key={i} cx={dx} cy={-28 + (i % 2) * 6} r={2.4} fill={K.blanco} />)}
      <g transform={`translate(22 ${-44 + pica}) rotate(${pica * 2})`}>
        <circle r={11} fill={color} stroke={NEGRO} strokeWidth={2} />
        <path d="M-2 -10 C 2 -22, 10 -22, 8 -14" stroke={NEGRO} strokeWidth={2.4} fill="none" />
        <path d="M9 -2 L 18 1 L 9 4 Z" fill={NEGRO} />
        <path d="M-6 2 C 0 6, 6 6, 10 4" stroke={K.blanco} strokeWidth={2} fill="none" />
        <circle cx={4} cy={-3} r={2} fill={NEGRO} />
      </g>
    </g>
  );
};

/** Ajolote (axolotl): la última forma de Xólotl, en el agua. Rosa, con branquias en plumero. */
const Ajolote: React.FC<DibujoProps> = ({ x, y, s, voltear, opacity = 1, moviendo, f, color = '#E8A0A0' }) => {
  const c = moviendo ? Math.sin(f / 4) * 10 : Math.sin(f / 14) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={`M-40 -16 C -70 ${-20 + c}, -96 ${-10 - c}, -110 ${-18 + c} C -96 ${-2 - c * 0.5}, -70 ${-2 + c * 0.5}, -40 -6 Z`} fill={color} stroke={NEGRO} strokeWidth={2} />
      {[-24, 14].map((lx, i) => <path key={i} d={`M${lx} -6 l ${-6 + c * 0.3} 12 l -6 0 M${lx + 6} -6 l ${4 - c * 0.3} 12 l 6 0`} stroke={NEGRO} strokeWidth={2.4} fill="none" strokeLinecap="round" />)}
      <path d={suave([[-44, -12], [-30, -28], [10, -30], [30, -24], [28, -6], [-20, -2]], true)} fill={color} stroke={NEGRO} strokeWidth={2} />
      <g transform="translate(36 -20)">
        {[-1, 0, 1].map((k) => <path key={k} d={`M-14 ${k * 8 - 4} C -22 ${k * 14 - 12}, -28 ${k * 18 - 14}, -30 ${k * 20 - 16}`} stroke="#C2185B" strokeWidth={4} strokeLinecap="round" fill="none" />)}
        <path d={suave([[-16, 10], [-14, -12], [8, -14], [22, -4], [18, 10], [0, 14]], true)} fill={color} stroke={NEGRO} strokeWidth={2} />
        <circle cx={8} cy={-4} r={3} fill={NEGRO} />
        <path d="M6 6 q 8 4 14 -1" stroke={NEGRO} strokeWidth={1.6} fill="none" />
      </g>
    </g>
  );
};

/** Xiuhcóatl, la serpiente de fuego de Huitzilopochtli, en la mano (vertical, cabeza arriba). */
const Xiuhcoatl: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g transform="rotate(-8)">
      <circle cx={0} cy={-80} r={70} fill="url(#halo)" opacity={0.5 + Math.sin(f / 4) * 0.15} />
      <path d={`M0 60 ${Array.from({ length: 8 }, (_, i) => `L ${i % 2 ? 12 : -12} ${40 - i * 22}`).join(' ')} L 0 -150`} stroke={NEGRO} strokeWidth={16} fill="none" strokeLinejoin="round" />
      <path d={`M0 60 ${Array.from({ length: 8 }, (_, i) => `L ${i % 2 ? 12 : -12} ${40 - i * 22}`).join(' ')} L 0 -150`} stroke={K.turquesa} strokeWidth={10} fill="none" strokeLinejoin="round" />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${i % 2 ? 10 : -10} ${30 - i * 26} l ${i % 2 ? 14 : -14} ${-8 + Math.sin(f / 3 + i) * 4} l ${i % 2 ? -6 : 6} 10 Z`} fill={i % 2 ? K.amarillo : K.rojo} stroke={NEGRO} strokeWidth={1} />)}
      <path d="M-12 -150 C -14 -176, 18 -184, 26 -164 L 12 -148 Z" fill={K.turquesa} stroke={NEGRO} strokeWidth={2} />
      <path d="M2 -176 l -6 -22 l 10 14 l 6 -18 l 2 22 Z" fill={K.rojo} stroke={NEGRO} strokeWidth={1.4} />
      <circle cx={10} cy={-164} r={3} fill={K.blanco} stroke={NEGRO} strokeWidth={1} />
    </g>
  );
};

// ---------- fichas ----------
type PP = Partial<PersonajeProps>;
const H = (p: PP, nombre?: string): Ficha => ({ tipo: 'persona', p: { barba: false, tocado: null, collar: true, ...p }, griego: nombre });
const M = (p: PP, nombre?: string): Ficha => ({ tipo: 'persona', p: { mujer: true, tocado: null, collar: true, ...p }, griego: nombre });
const D = (Dibujo: React.FC<DibujoProps>, p: Record<string, unknown> = {}, nombre?: string): Ficha => ({ tipo: 'dibujo', Dibujo, p, griego: nombre });

const PIEL_H = '#A8603A', PIEL_M = '#C98E4E';
const pinturaTezca: [number, number, string][] = [[-26, -18, K.amarillo], [4, 12, K.amarillo], [20, 28, K.amarillo]];
const tezcaCabeza = <><Franjas bandas={pinturaTezca} /><Orejera c={K.amarillo} /><Banda c={K.rojo} /><Pluma x={-24} y={-18} ang={-62} l={70} c={K.blanco} c2="#D8D2C2" /><Pluma x={-18} y={-24} ang={-40} l={62} c={K.blanco} c2="#D8D2C2" /><Espejo x={-12} y={-30} r={9} /></>;
const quetzalCabeza = (
  <>
    <Pluma x={-16} y={-30} ang={-78} l={96} /><Pluma x={-12} y={-34} ang={-58} l={104} c={K.turquesa} /><Pluma x={-8} y={-36} ang={-40} l={92} />
    <path d="M-26 -26 L 0 -112 L 24 -28 Z" fill="#D9A23A" stroke={NEGRO} strokeWidth={2.2} />
    {[[-8, -46], [6, -60], [0, -84], [-12, -64], [10, -40]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r={4} fill={NEGRO} />)}
    <path d="M-28 -24 C -10 -36, 10 -36, 26 -28" stroke={K.rojo} strokeWidth={7} fill="none" />
    <path d="M20 4 C 40 0, 62 6, 68 14 C 58 22, 38 24, 20 22 Z" fill={K.rojo} stroke={NEGRO} strokeWidth={2} />
    <path d="M30 13 L 62 14" stroke={NEGRO} strokeWidth={1.6} />
    <Orejera c={K.blanco} />
  </>
);
const huitziCabeza = (
  <>
    <Franjas bandas={[[2, 10, K.amarillo], [18, 26, K.amarillo]]} />
    <Penacho n={5} l={70} x={-18} y={-30} desde={-80} hasta={-30} />
    <path d="M-32 -2 C -38 -40, 4 -58, 30 -36 C 26 -30, 20 -28, 14 -26 C -4 -28, -20 -16, -32 -2 Z" fill={K.turquesa} stroke={NEGRO} strokeWidth={2.2} />
    <path d="M26 -36 L 84 -30 L 24 -26 Z" fill={NEGRO} />
    <circle cx={14} cy={-38} r={6} fill={K.blanco} stroke={NEGRO} strokeWidth={1.4} /><circle cx={15} cy={-38} r={3} fill={NEGRO} />
    <path d="M-10 -46 C -4 -52, 6 -52, 10 -46" stroke={K.rojo} strokeWidth={4} fill="none" />
    <Orejera c={K.turquesa} />
  </>
);
const tlalocCabeza = (
  <>
    <Penacho n={5} l={66} c={K.blanco} c2="#D8D2C2" x={-14} y={-30} desde={-70} hasta={-10} />
    <path d="M-30 -8 C -24 -32, 10 -42, 30 -28" stroke={K.jade} strokeWidth={10} fill="none" />
    <circle cx={18} cy={-6} r={13} fill="none" stroke={NEGRO} strokeWidth={8} />
    <circle cx={18} cy={-6} r={13} fill="none" stroke={K.turquesa} strokeWidth={5} />
    <path d="M18 14 C 28 4, 46 8, 46 20 C 40 16, 32 16, 22 22 Z" fill={K.turquesa} stroke={NEGRO} strokeWidth={1.8} />
    <path d="M28 20 l 3 12 l 4 -12 M37 20 l 3 10 l 3 -10" fill={K.blanco} stroke={NEGRO} strokeWidth={1.2} />
    <Orejera c={K.jade} />
  </>
);
const calaveraCabeza = (plumas: string) => (
  <>
    <Penacho n={5} l={60} c={plumas} c2="#5A5048" x={-16} y={-28} desde={-80} hasta={-20} />
    <circle cx={18} cy={-6} r={11} fill={NEGRO} /><circle cx={20} cy={-6} r={3} fill={K.amarillo} />
    <path d="M36 4 L 30 14 L 40 12 Z" fill={NEGRO} />
    <path d="M14 22 H 36 M18 18 v 8 M24 18 v 8 M30 18 v 8" stroke={NEGRO} strokeWidth={2} />
    <circle cx={-14} cy={-14} r={10} fill={K.blanco} stroke={NEGRO} strokeWidth={1.6} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-14 -14 l ${r1(Math.cos(i * 0.785) * 16)} ${r1(Math.sin(i * 0.785) * 16)}`} stroke={NEGRO} strokeWidth={1.4} />)}
  </>
);
const senorCabeza = (c: string) => <><Penacho n={7} l={86} x={-14} y={-30} desde={-84} hasta={-12} /><Xiuhuitzolli /><Orejera c={c} /></>;
const senoraCabeza = <><Penacho n={6} l={78} x={-14} y={-30} desde={-84} hasta={-20} c={K.jade} /><PeloMexica /><Banda c={K.turquesa} /><Orejera c={K.amarillo} r={6} /></>;
const mexicaCabeza = <Orejera />;
const mexicaMujerCabeza = <><PeloMexica /><Orejera c={K.amarillo} r={5} /></>;

export const ELENCO_AZTECA: Record<string, Ficha> = {
  // Pareja creadora (Ometecuhtli y Omecihuatl = Ometeotl, "Dios Dos"; en la Historia de los mexicanos por sus pinturas, Tonacatecuhtli y Tonacacihuatl)
  ometecuhtli: H({ piel: PIEL_H, canas: true, capa: K.amarillo, ropa: 'larga', ropaColor: K.blanco, adornos: { cabeza: senorCabeza(K.jade), mano: <BastonPlumas /> } }, 'OMETECUHTLI'),
  omecihuatl: M({ piel: PIEL_M, canas: true, capa: K.turquesa, ropaColor: K.blanco, adornos: { cabeza: senoraCabeza, cuerpo: <Huipil c={K.amarillo} borde={K.turquesa} /> } }, 'OMECIHUATL'),
  // Los cuatro hijos
  tezcatlipoca_joven: H({ piel: '#2E2724', capa: '#3A3236', ropaColor: '#3A3236', adornos: { cabeza: tezcaCabeza, cuerpo: <Anahuatl /> } }, 'TEZCATLIPOCA'),
  tezcatlipoca: H({ piel: '#2E2724', capa: '#3A3236', ropaColor: '#3A3236', adornos: { cabeza: tezcaCabeza, cuerpo: <Anahuatl />, pie: <Espejo x={8} y={10} r={13} /> } }, 'TEZCATLIPOCA'),
  tezcatlipoca_rojo: H({ piel: '#B8321F', capa: K.amarillo, ropaColor: K.blanco, objeto: 'arco', adornos: { cabeza: <><Franjas bandas={[[4, 12, K.blanco]]} /><Banda c={K.amarillo} /><Pluma x={-22} y={-20} ang={-50} l={64} c={K.rojo} /><Orejera c={K.amarillo} /></> } }, 'RED TEZCATLIPOCA'),
  quetzalcoatl: H({ piel: PIEL_H, capa: K.jade, ropaColor: K.blanco, adornos: { cabeza: quetzalCabeza, cuerpo: <JoyaViento />, detras: <Penacho n={7} l={110} x={-24} y={-286} desde={-80} hasta={-10} /> } }, 'QUETZALCOATL'),
  huitzilopochtli: H({ piel: '#3B7FB8', capa: K.amarillo, ropaColor: K.blanco, adornos: { cabeza: huitziCabeza, manoAtras: <Chimalli />, mano: <Dardos /> } }, 'HUITZILOPOCHTLI'),
  // Otros dioses de la T1
  tlaloc: H({ piel: '#3E6E9A', capa: K.blanco, ropaColor: K.jade, adornos: { cabeza: tlalocCabeza, mano: <BastonRayo /> } }, 'TLALOC'),
  chalchiuhtlicue: M({ piel: PIEL_M, ropaColor: K.jade, capa: K.turquesa, adornos: { cabeza: <><PeloMexica /><Banda c={K.turquesa} /><circle cx={-24} cy={-6} r={8} fill={K.blanco} stroke={NEGRO} strokeWidth={1.5} /><Orejera c={K.jade} r={6} /></>, cuerpo: <Huipil c={K.turquesa} borde={K.jade} /> } }, 'CHALCHIUHTLICUE'),
  mictlantecuhtli: H({ piel: '#EFE6D0', ropaColor: '#3A3236', contorno: true, adornos: { cabeza: calaveraCabeza('#3A3236'), cuerpo: <Costillas /> } }, 'MICTLANTECUHTLI'),
  mictecacihuatl: M({ piel: '#EFE6D0', ropaColor: '#3A3236', contorno: true, adornos: { cabeza: calaveraCabeza('#5A4A3A'), cuerpo: <Huipil c="#3A3236" borde={K.blanco} /> } }, 'MICTECACIHUATL'),
  xolotl: H({ piel: '#4A3A30', cabezaAnimal: 'chacal', ropaColor: K.rojo, adornos: { cuerpo: <Anahuatl /> } }, 'XOLOTL'),
  xochiquetzal: M({ piel: PIEL_M, ropaColor: K.rojo, capa: K.jade, adornos: { cabeza: <><Penacho n={5} l={70} x={-14} y={-30} desde={-70} hasta={-20} /><PeloMexica />{[[-20, -24], [-4, -34], [12, -36]].map(([cx, cy], i) => <g key={i}><circle cx={cx} cy={cy} r={7} fill={K.amarillo} stroke={NEGRO} strokeWidth={1.4} /><circle cx={cx} cy={cy} r={3} fill={K.rojo} /></g>)}</>, cuerpo: <Huipil c={K.blanco} borde={K.rojo} /> } }, 'XOCHIQUETZAL'),
  coatlicue: M({ piel: PIEL_M, ropaColor: K.jade, adornos: { cabeza: <><PeloMexica /><Banda c={K.jade} /><Orejera c={K.turquesa} r={6} /></>, cuerpo: <><Huipil c={K.blanco} borde={K.jade} /><FaldaSerpientes /></> } }, 'COATLICUE'),
  coyolxauhqui: M({ piel: PIEL_M, ropa: 'corta', ropaColor: K.blanco, adornos: { cabeza: <><PeloMexica />{[[-22, -26], [-8, -36], [-26, -8]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={7} fill={K.blanco} stroke={NEGRO} strokeWidth={1.4} />)}<circle cx={14} cy={16} r={7} fill={K.amarillo} stroke={NEGRO} strokeWidth={1.6} /><path d="M10 16 h 8" stroke={NEGRO} strokeWidth={1.4} /><Orejera c={K.amarillo} r={6} /></>, cuerpo: <Huipil c={K.blanco} borde={K.amarillo} /> } }, 'COYOLXAUHQUI'),
  huitznahua: H({ piel: PIEL_H, ropaColor: K.blanco, objeto: 'lanza', adornos: { cabeza: <><Franjas bandas={[[4, 12, NEGRO]]} /><Banda c={K.blanco} /><Pluma x={-22} y={-20} ang={-50} l={56} c={K.blanco} c2="#D8D2C2" /><Orejera /></> } }, 'CENTZON HUITZNAHUA'),
  nanahuatzin: H({ piel: PIEL_H, cuerpo: 'flaco', ropaColor: K.crema2, adornos: { cabeza: <Granos />, cuerpo: <Granos cuerpo /> } }, 'NANAHUATZIN'),
  tecciztecatl: H({ piel: PIEL_H, capa: K.turquesa, ropaColor: K.blanco, adornos: { cabeza: <><Penacho n={7} l={90} x={-14} y={-30} desde={-86} hasta={-6} /><Banda c={K.amarillo} /><Orejera c={K.amarillo} /></>, detras: <Caracol /> } }, 'TECCIZTECATL'),
  // Primera pareja humana (HMP: él Oxomoco, ella Cipactónal)
  oxomoco: H({ piel: PIEL_H, canas: true, ropaColor: K.blanco, capa: K.crema2, objeto: 'palo', adornos: { cabeza: mexicaCabeza } }, 'OXOMOCO'),
  cipactonal: M({ piel: PIEL_M, canas: true, ropaColor: K.blanco, objeto: 'semillas', adornos: { cabeza: mexicaMujerCabeza, cuerpo: <Huipil c={K.blanco} borde={K.rojo} /> } }, 'CIPACTONAL'),
  // Gigantes del primer sol (quinametzin)
  quinametzin: H({ piel: '#8A5030', gigante: true, s: 1.1, ropa: 'corta', ropaColor: K.crema2, pelo: '#2A1E16', adornos: { cabeza: <Banda c={K.ocre} /> } }, 'GIANT'),
  // Gente mexica
  mexica: H({ piel: PIEL_H, capa: K.crema, ropaColor: K.blanco, adornos: { cabeza: mexicaCabeza } }),
  mexica_mujer: M({ piel: PIEL_M, ropaColor: K.blanco, adornos: { cabeza: mexicaMujerCabeza, cuerpo: <Huipil c={K.blanco} borde={K.rojo} /> } }),
  anciano_mexica: H({ piel: PIEL_H, cuerpo: 'viejo', canas: true, capa: K.crema, ropaColor: K.blanco, adornos: { cabeza: mexicaCabeza } }),
  anciana_mexica: M({ piel: PIEL_M, cuerpo: 'viejo', canas: true, ropaColor: K.blanco, adornos: { cabeza: <Orejera c={K.amarillo} r={5} />, cuerpo: <Huipil c={K.blanco} borde={K.turquesa} /> } }),
  sacerdote_mexica: H({ piel: '#3E3430', ropa: 'larga', ropaColor: '#2A2224', pelo: '#120C0A', adornos: { cabeza: <><Banda c={K.blanco} /><Orejera c={K.blanco} /></>, mano: <BolsaCopal /> } }, 'PRIEST'),
  tenoch: H({ piel: PIEL_H, capa: K.turquesa, ropaColor: K.blanco, canas: true, adornos: { cabeza: <><Banda c={K.rojo} /><Pluma x={-20} y={-22} ang={-46} l={60} /><Orejera c={K.turquesa} /></>, mano: <BastonPlumas /> } }, 'TENOCH'),
  teomama: H({ piel: PIEL_H, ropaColor: K.blanco, adornos: { cabeza: <><Banda c={K.blanco} /><Orejera /></>, detras: <Fardo /> } }, 'TEOMAMA'),
  guerrero_aguila: H({ piel: PIEL_H, ropaColor: K.blanco, capa: '#8A5A30', adornos: { cabeza: <><path d="M-34 6 C -40 -40, 10 -60, 34 -36 L 60 -30 C 50 -20, 40 -18, 30 -18 C 34 -6, 28 -2, 22 -6 C 10 -26, -18 -24, -34 6 Z" fill="#6B4426" stroke={NEGRO} strokeWidth={2} /><path d="M34 -36 L 64 -28 L 32 -18 Z" fill={K.amarillo} stroke={NEGRO} strokeWidth={1.5} /><circle cx={16} cy={-36} r={4} fill={K.blanco} stroke={NEGRO} strokeWidth={1.2} /><Orejera /></>, manoAtras: <Chimalli c={K.blanco} c2={K.rojo} />, mano: <Dardos /> } }, 'EAGLE WARRIOR'),
  guerrero_jaguar: H({ piel: PIEL_H, ropaColor: '#E2A93A', capa: '#E2A93A', adornos: { cabeza: <><path d="M-34 6 C -40 -44, 20 -60, 40 -30 C 44 -20, 40 -14, 30 -14 C 22 -26, -14 -26, -34 6 Z" fill="#E2A93A" stroke={NEGRO} strokeWidth={2} />{[[-18, -30], [0, -40], [-24, -10], [18, -36]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={4} fill="none" stroke={NEGRO} strokeWidth={2.4} />)}<path d="M30 -16 l 4 8 l 4 -8 M18 -18 l 3 8 l 3 -8" fill={K.blanco} stroke={NEGRO} strokeWidth={1} /><Orejera /></>, manoAtras: <Chimalli c={K.rojo} c2={K.amarillo} />, mano: <Dardos /> } }, 'JAGUAR WARRIOR'),
  // Criaturas
  cipactli: D(Cipactli, { s: 0.85 }, 'CIPACTLI'),
  tlaltecuhtli: D(Cipactli, { s: 0.85, ojos: true, color: '#7A8A3A' }, 'TLALTECUHTLI'),
  serpiente_emplumada: D(SerpienteEmplumada, {}, 'FEATHERED SERPENT'),
  serpiente_negra: D(SerpienteEmplumada, { plumas: false, color: '#2E2724', panza: '#E6B12E' }),
  coatl: D(SerpienteEmplumada, { plumas: false, color: K.jade, panza: K.amarillo, largo: 380, s: 0.7 }, 'SERPENT'),
  ocelotl: D(Jaguar, {}, 'JAGUAR'),
  ozomatli: D(Mono, {}, 'MONKEY'),
  cuauhtli: D(Aguila, {}, 'EAGLE'),
  huitzitzilin: D(Colibri, { s: 0.8 }, 'HUMMINGBIRD'),
  azcatl: D(Hormiga, { s: 1.2 }, 'RED ANT'),
  azcatl_negra: D(Hormiga, { s: 1.2, color: '#1E1A1A' }, 'BLACK ANT'),
  tochtli: D(Conejo, {}, 'RABBIT'),
  huexolotl: D(Guajolote, {}, 'TURKEY'),
  zolin: D(Codorniz, { s: 1.3 }, 'QUAIL'),
  cuauhtli_claro: D(Aguila, { color: '#C9A06A' }, 'EAGLE'), // antes de entrar al fuego de Teotihuacan
  ocelotl_liso: D(Jaguar, { manchas: false }, 'JAGUAR'), // antes de entrar al fuego: sin manchas
  axolotl: D(Ajolote, { s: 1.3 }, 'AXOLOTL'),
  // Más personajes de la T1 (eps. 5–12)
  huitzilopochtli_xiuhcoatl: H({ piel: '#3B7FB8', capa: K.amarillo, ropaColor: K.blanco, adornos: { cabeza: huitziCabeza, manoAtras: <Chimalli />, mano: <Xiuhcoatl /> } }, 'HUITZILOPOCHTLI'),
  cihuacoatl: M({ piel: PIEL_M, ropaColor: K.blanco, capa: K.crema2, adornos: { cabeza: <><Penacho n={5} l={66} c={K.blanco} c2="#D8D2C2" x={-14} y={-30} desde={-80} hasta={-24} /><PeloMexica /><Banda c={K.negro} /><Orejera c={K.jade} r={6} /></>, cuerpo: <Huipil c={K.blanco} borde={K.negro} /> } }, 'CIHUACOATL'),
  cuahuitlicac: H({ piel: PIEL_H, ropaColor: K.blanco, adornos: { cabeza: <><Franjas bandas={[[4, 12, NEGRO]]} /><Banda c={K.blanco} /><Orejera /></> } }, 'CUAHUITLICAC'),
  tlaloque: H({ piel: '#5E8EBA', s: 0.7, ropaColor: K.jade, adornos: { cabeza: tlalocCabeza } }, 'TLALOQUE'),

};

/** Nombres en pantalla (inglés) cuando difieren de la ficha. */
export const NOMBRE_EN_AZTECA: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_AZTECA).filter(([, f]) => f.griego).map(([k, f]) => [k, f.griego as string]));
