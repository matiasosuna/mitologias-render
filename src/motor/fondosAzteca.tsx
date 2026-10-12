// Piel azteca (tema "codice"): fondos y elementos al estilo de los códices mexicas — colores planos con contorno
// negro, cerros-glifo (tepetl), agua con remolinos y caracolitos (atl), nubes en voluta, estrellas como ojos,
// pirámides escalonadas y templos con cresta. Lugares de la T1: los trece cielos (Omeyocan), las aguas primeras,
// el valle de México, el encinar de los gigantes, la selva, el firmamento, el Mictlan, Teotihuacan (de día y de
// noche), Coatepec, Aztlán, el lago de Texcoco, Tenochtitlan y la milpa.
import React from 'react';
import { Capa, SUELO, Fuego, suave, azar } from '../comun/vasija';
import { K, SueloCodice, FranjaCodice } from '../comun/codice';
import type { Cielo } from './fondos';

const r1 = (v: number) => v.toFixed(1);
const NEGRO = K.negro;

/** Fondos del tema y su cielo (lo usa Escena para el degradé). */
export const CIELO_AZTECA: Record<string, Cielo> = {
  omeyocan: 'barro', aguas_primeras: 'mar', valle: 'barro', encinar: 'barro', selva: 'barro', firmamento: 'noche', mictlan: 'inframundo',
  teotihuacan: 'barro', teotihuacan_noche: 'noche', coatepec: 'barro', aztlan: 'mar', lago_texcoco: 'mar', tenochtitlan: 'mar', milpa: 'barro',
};
export const FONDOS_AZTECA = ['omeyocan', 'aguas_primeras', 'valle', 'encinar', 'selva', 'firmamento', 'mictlan', 'teotihuacan', 'teotihuacan_noche', 'coatepec', 'aztlan', 'lago_texcoco', 'tenochtitlan', 'milpa'];
export const ELEMENTOS_AZTECA = ['piramide', 'templo_mayor', 'tepetl', 'volcan', 'nopal', 'maguey', 'tule', 'ahuehuete', 'encino', 'ceiba', 'maiz_codice', 'sol_codice', 'luna_codice', 'estrellas_codice', 'nube_codice', 'hoguera', 'espejo', 'huesos', 'caracol', 'acalli', 'chinampa', 'remolino', 'calendario', 'chicomoztoc', 'tetl', 'momoztli', 'icpalli', 'jacal', 'casa_mexica', 'cielo_bajo', 'lluvia_fuego', 'tronco', 'pozo', 'cajete', 'tonacatepetl', 'pluma_bola', 'via_lactea'];

// ---------- piezas ----------
/** Ojo de estrella de los códices (estrella del cielo nocturno). */
export const EstrellaOjo: React.FC<{ x: number; y: number; r?: number; f?: number; i?: number }> = ({ x, y, r = 10, f = 0, i = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${r1(1 + Math.sin(f / 10 + i) * 0.08)})`}>
    <circle r={r * 1.3} fill={K.rojo} stroke={NEGRO} strokeWidth={1.4} />
    <circle r={r} fill={K.blanco} stroke={NEGRO} strokeWidth={1.2} />
    <path d={`M${-r} 0 A ${r} ${r} 0 0 1 ${r} 0 Z`} fill={K.rojo} />
    <circle cy={r * 0.25} r={r * 0.34} fill={NEGRO} />
  </g>
);
const CampoEstrellas: React.FC<{ f: number; n?: number; area?: [number, number, number, number]; seed?: number; r?: number }> = ({ f, n = 26, area = [-200, 150, 2400, 330], seed = 3, r = 8 }) => (
  <g>{Array.from({ length: n }, (_, i) => <EstrellaOjo key={i} x={area[0] + azar(i * 3 + seed) * area[2]} y={area[1] + azar(i * 7 + seed) * area[3]} r={r * (0.6 + azar(i + seed) * 0.6)} f={f} i={i} />)}</g>
);
/** Sol de códice: disco amarillo con aro rojo, rayos en punta y cara opcional. medio = solo medio disco (el "medio sol"). */
export const SolCodice: React.FC<{ x: number; y: number; r?: number; f: number; medio?: boolean; cara?: boolean; luz?: number }> = ({ x, y, r = 60, f, medio, cara = true, luz = 1 }) => {
  const id = `sc${Math.round(x)}${Math.round(y)}`;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)})`}>
      <circle r={r * 3} fill="url(#halo)" opacity={0.5 * luz} />
      {medio && <defs><clipPath id={id}><rect x={-r * 3} y={-r * 3} width={r * 6} height={r * 3} /></clipPath></defs>}
      <g clipPath={medio ? `url(#${id})` : undefined}>
        <g transform={`rotate(${r1(f * 0.2)})`}>
          {Array.from({ length: 8 }, (_, i) => <path key={i} transform={`rotate(${i * 45})`} d={`M${-r * 0.32} ${-r * 0.92} L 0 ${-r * 1.55} L ${r * 0.32} ${-r * 0.92} Z`} fill={i % 2 ? K.rojo : K.amarillo} stroke={NEGRO} strokeWidth={2} />)}
          {Array.from({ length: 8 }, (_, i) => <circle key={`c${i}`} transform={`rotate(${i * 45 + 22.5})`} cx={0} cy={-r * 1.12} r={r * 0.12} fill={K.turquesa} stroke={NEGRO} strokeWidth={1.4} />)}
        </g>
        <circle r={r} fill={K.amarillo} stroke={NEGRO} strokeWidth={3} />
        <circle r={r * 0.82} fill="none" stroke={K.rojo} strokeWidth={r * 0.1} />
        {cara && <g>
          <path d={`M${-r * 0.42} ${-r * 0.12} q ${r * 0.14} ${-r * 0.14} ${r * 0.28} 0 M${r * 0.14} ${-r * 0.12} q ${r * 0.14} ${-r * 0.14} ${r * 0.28} 0`} stroke={NEGRO} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
          <path d={`M${-r * 0.22} ${r * 0.28} q ${r * 0.22} ${r * 0.16} ${r * 0.44} 0`} stroke={NEGRO} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
          <circle cx={-r * 0.46} cy={r * 0.14} r={r * 0.08} fill={K.rojo} opacity={0.6} /><circle cx={r * 0.46} cy={r * 0.14} r={r * 0.08} fill={K.rojo} opacity={0.6} />
        </g>}
      </g>
      {medio && <path d={`M${-r * 1.7} 0 H ${r * 1.7}`} stroke={NEGRO} strokeWidth={3} />}
    </g>
  );
};
/** Luna de códice: media luna de hueso con agua adentro; conejo opcional. */
export const LunaCodice: React.FC<{ x: number; y: number; r?: number; conejo?: boolean; luz?: number }> = ({ x, y, r = 54, conejo, luz = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`}>
    <circle r={r * 2.4} fill="url(#haloBlanco)" opacity={0.45 * luz} />
    <circle r={r} fill="#EEF0E6" stroke={NEGRO} strokeWidth={3} />
    <path d={`M${-r * 0.7} ${r * 0.1} C ${-r * 0.4} ${-r * 0.1}, ${r * 0.4} ${r * 0.3}, ${r * 0.72} ${r * 0.05} L ${r * 0.6} ${r * 0.55} C ${r * 0.3} ${r * 0.85}, ${-r * 0.3} ${r * 0.85}, ${-r * 0.6} ${r * 0.55} Z`} fill={K.azul} opacity={0.75} />
    {conejo && <g transform={`translate(${-r * 0.1} ${-r * 0.05}) scale(${r / 60})`}>
      <path d="M-26 10 C -30 -12, -8 -20, 10 -12 C 18 -24, 14 -46, 22 -48 C 26 -40, 24 -24, 22 -10 C 30 -6, 32 6, 24 12 C 6 20, -16 22, -26 10 Z" fill="#B9B4A4" stroke={NEGRO} strokeWidth={1.6} />
      <circle cx={18} cy={-4} r={2} fill={NEGRO} />
    </g>}
  </g>
);
/** Nube en voluta (mixtli): lóbulos crema con borde azul y espirales. */
export const NubeCodice: React.FC<{ x: number; y: number; s?: number; f?: number; oscura?: boolean }> = ({ x, y, s = 1, f = 0, oscura }) => (
  <g transform={`translate(${r1(x + Math.sin(f / 60 + x) * 10)} ${r1(y)}) scale(${s})`}>
    <path d="M-110 20 C -130 0, -104 -30, -76 -22 C -70 -52, -30 -60, -10 -40 C 4 -66, 52 -62, 58 -30 C 86 -40, 118 -12, 100 14 C 96 26, -100 30, -110 20 Z" fill={oscura ? '#5A6478' : K.blanco} stroke={NEGRO} strokeWidth={2.6} />
    <path d="M-100 18 C -60 10, 60 10, 98 14" stroke={oscura ? '#3A4256' : K.azul} strokeWidth={7} fill="none" />
    {[[-70, -10], [-14, -24], [50, -12]].map(([cx, cy], i) => <path key={i} d={`M${cx} ${cy} a 10 10 0 1 1 10 10 a 5 5 0 1 1 -5 -5`} stroke={oscura ? '#3A4256' : K.azul} strokeWidth={2.4} fill="none" />)}
  </g>
);
/** Cerro-glifo (tepetl): campana verde con curva en la punta y franja roja con círculos en la base. glifo = "serpiente" (Coatepec). */
export const Tepetl: React.FC<{ x: number; y?: number; w?: number; h?: number; color?: string; glifo?: 'serpiente' | null; f?: number }> = ({ x, y = SUELO, w = 260, h = 340, color = '#5E8A4A', glifo, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`}>
    <path d={`M${-w} 0 C ${-w} ${-h * 0.55}, ${-w * 0.72} ${-h}, ${-w * 0.08} ${-h} C ${w * 0.1} ${-h * 1.06}, ${w * 0.32} ${-h * 1.02}, ${w * 0.3} ${-h * 0.9} C ${w * 0.7} ${-h * 0.92}, ${w} ${-h * 0.55}, ${w} 0 Z`} fill={color} stroke={NEGRO} strokeWidth={3} />
    <path d={`M${w * 0.08} ${-h * 0.98} c ${w * 0.12} ${-h * 0.02}, ${w * 0.16} ${h * 0.08}, ${w * 0.06} ${h * 0.1} c ${-w * 0.06} 0, ${-w * 0.06} ${-h * 0.06}, 0 ${-h * 0.05}`} stroke={NEGRO} strokeWidth={2.4} fill="none" />
    {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-w * 0.6 + azar(i * 5 + x) * w * 1.2} cy={-h * 0.2 - azar(i * 3 + x) * h * 0.6} r={4} fill={NEGRO} opacity={0.45} />)}
    <rect x={-w} y={-h * 0.14} width={w * 2} height={h * 0.14} fill={K.rojo} stroke={NEGRO} strokeWidth={2.4} />
    {Array.from({ length: Math.max(3, Math.round(w / 40)) }, (_, i) => <circle key={i} cx={-w + (i + 0.5) * (w * 2) / Math.max(3, Math.round(w / 40))} cy={-h * 0.07} r={h * 0.035} fill={K.amarillo} stroke={NEGRO} strokeWidth={1.4} />)}
    {glifo === 'serpiente' && <g transform={`translate(0 ${-h * 0.5}) scale(${w / 260})`}>
      <path d={`M-120 30 C -80 ${-10 + Math.sin(f / 12) * 4}, -40 50, 0 10 S 80 ${-30 + Math.sin(f / 12) * 4}, 120 0`} stroke={NEGRO} strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d={`M-120 30 C -80 ${-10 + Math.sin(f / 12) * 4}, -40 50, 0 10 S 80 ${-30 + Math.sin(f / 12) * 4}, 120 0`} stroke={K.amarillo} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={`M-120 30 C -80 ${-10 + Math.sin(f / 12) * 4}, -40 50, 0 10 S 80 ${-30 + Math.sin(f / 12) * 4}, 120 0`} stroke={K.rojo} strokeWidth={6} fill="none" strokeDasharray="14 14" />
      <path d="M114 -14 C 140 -22, 156 -6, 144 8 L 116 12 Z" fill={K.amarillo} stroke={NEGRO} strokeWidth={2.4} /><circle cx={132} cy={-6} r={4} fill={NEGRO} />
    </g>}
  </g>
);
/** Volcán humeante (Popocatépetl) con nieve; sinHumo para el Iztaccíhuatl. */
const Volcan: React.FC<{ x: number; y?: number; s?: number; f: number; humo?: boolean }> = ({ x, y = SUELO, s = 1, f, humo = true }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {humo && [0, 1, 2].map((k) => { const t = ((f * 0.4 + k * 40) % 120) / 120; return <circle key={k} cx={Math.sin(t * 3 + k) * 20 + t * 60} cy={-420 - t * 160} r={26 + t * 40} fill="#D8D2C4" stroke={NEGRO} strokeWidth={2} opacity={0.9 - t * 0.7} />; })}
    <path d="M-360 0 L -60 -410 L 60 -410 L 360 0 Z" fill="#6E7A8A" stroke={NEGRO} strokeWidth={3} />
    <path d="M-60 -410 L 60 -410 L 130 -316 L 90 -290 L 50 -326 L 10 -284 L -30 -330 L -70 -296 L -126 -322 Z" fill={K.blanco} stroke={NEGRO} strokeWidth={2.4} />
    <path d="M-60 -410 C -20 -400, 20 -400, 60 -410" stroke={NEGRO} strokeWidth={3} fill="none" />
  </g>
);
/** Sierra lejana de picos planos y pálidos. */
const Sierra: React.FC<{ color?: string; y?: number; seed?: number }> = ({ color = '#B7A88A', y = SUELO, seed = 1 }) => (
  <path d={`M-600 ${y} ` + Array.from({ length: 16 }, (_, i) => `L ${-600 + i * 260 + 130} ${y - 120 - azar(i + seed) * 130} L ${-600 + (i + 1) * 260} ${y - 40 - azar(i * 2 + seed) * 40}`).join(' ') + ` L 3600 ${y} Z`} fill={color} stroke={NEGRO} strokeWidth={2} opacity={0.85} />
);
/** Agua de códice (atl): azul verdoso con olas en voluta que terminan en caracolitos. */
export const AguaCodice: React.FC<{ y: number; f: number; oscura?: boolean; desde?: number; hasta?: number }> = ({ y, f, oscura, desde: x0 = -1800, hasta = 6400 }) => {
  const filas = Math.ceil((1100 - y) / 46);
  const base = oscura ? '#1E4A5E' : '#3A8FA8', claro = oscura ? '#4A7A8E' : '#8FCFD0';
  return (
    <g>
      <rect x={x0} y={y} width={hasta - x0} height={1300 - y} fill={base} />
      <path d={`M${x0} ${y} H ${hasta}`} stroke={NEGRO} strokeWidth={3} />
      {Array.from({ length: filas }, (_, r) => {
        const yy = y + 18 + r * 46, paso = 120 + r * 16, des = (f * (0.5 + r * 0.12)) % paso;
        return <g key={r} transform={`translate(${r1(-des + (r % 2) * paso * 0.5)} 0)`}>
          {Array.from({ length: Math.ceil((hasta - x0) / paso) + 2 }, (_, i) => { const cx = x0 + i * paso; return <g key={i}>
            <path d={`M${cx} ${yy + 8} c 14 -18, 40 -18, 44 -4 c 2 8, -8 12, -14 6`} stroke={claro} strokeWidth={4} fill="none" strokeLinecap="round" />
            {(i + r) % 3 === 0 && <circle cx={cx + 70} cy={yy + 2} r={5} fill={K.blanco} stroke={NEGRO} strokeWidth={1.2} />}
          </g>; })}
        </g>;
      })}
    </g>
  );
};

// ---------- plantas ----------
const Nopal: React.FC<{ x: number; y?: number; s?: number; tunas?: boolean; roca?: boolean }> = ({ x, y = SUELO, s = 1, tunas = true, roca }) => {
  const penca = (cx: number, cy: number, a: number, w = 34, h = 50) => <g key={`${cx}${cy}`} transform={`translate(${cx} ${cy}) rotate(${a})`}>
    <ellipse cx={0} cy={-h} rx={w} ry={h} fill="#4E8A3A" stroke={NEGRO} strokeWidth={2.4} />
    {[[-12, -70], [10, -50], [-6, -30], [14, -84]].map(([px, py], i) => <path key={i} d={`M${px} ${py} l -4 -4 M${px} ${py} l 4 -4`} stroke={K.crema} strokeWidth={1.6} />)}
    {tunas && <><ellipse cx={-18} cy={-2 * h + 4} rx={8} ry={11} fill={K.rojo} stroke={NEGRO} strokeWidth={1.5} /><ellipse cx={14} cy={-2 * h + 2} rx={8} ry={11} fill={K.rojo} stroke={NEGRO} strokeWidth={1.5} /></>}
  </g>;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      {roca && <Tetl x={0} y={0} s={1} />}
      <g transform={roca ? 'translate(0 -60)' : undefined}>
        {penca(0, 0, 0, 36, 56)}
        {penca(-10, -96, -32)}
        {penca(14, -100, 30)}
        {penca(-56, -150, -18, 28, 40)}
        {penca(52, -158, 24, 28, 42)}
        {penca(4, -196, 4, 30, 44)}
      </g>
    </g>
  );
};
/** Piedra-glifo (tetl): piedra con curvas y franjas, base del nopal de Tenochtitlan. */
const Tetl: React.FC<{ x: number; y?: number; s?: number; color?: string }> = ({ x, y = SUELO, s = 1, color = '#9A8A74' }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-90 0 C -100 -40, -80 -66, -40 -70 C -10 -84, 40 -82, 60 -64 C 96 -58, 104 -20, 90 0 Z" fill={color} stroke={NEGRO} strokeWidth={2.6} />
    <path d="M-60 -40 c 10 -10, 30 -10, 34 4 M10 -56 c 14 -8, 30 0, 30 12 M-20 -20 c 8 -6, 20 -4, 22 6" stroke={NEGRO} strokeWidth={2} fill="none" />
    <path d="M-70 -10 h 30 M30 -14 h 40" stroke={K.rojo} strokeWidth={4} />
  </g>
);
const Maguey: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {[-70, -48, -28, -10, 8, 26, 46, 68].map((a, i) => <path key={i} transform={`rotate(${a + Math.sin(f / 40 + i) * 1.5})`} d={`M-12 0 C -16 -60, -8 -130, 0 ${-150 - (i % 3) * 20} C 8 -130, 16 -60, 12 0 Z`} fill={i % 2 ? '#6E9A6A' : '#5A8A5E'} stroke={NEGRO} strokeWidth={2} />)}
    <path d="M-40 0 h 80" stroke={NEGRO} strokeWidth={3} />
  </g>
);
const Tule: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {Array.from({ length: 9 }, (_, i) => { const dx = -40 + i * 10, h = 120 + azar(i + x) * 80, m = Math.sin(f / 18 + i) * 6; return <g key={i}>
      <path d={`M${dx} 0 Q ${dx + m * 0.5} ${-h * 0.5} ${dx + m} ${-h}`} stroke="#5E7A3A" strokeWidth={5} fill="none" />
      {i % 3 === 1 && <ellipse cx={dx + m} cy={-h + 14} rx={5} ry={14} fill="#7A4A2A" stroke={NEGRO} strokeWidth={1.2} />}
    </g>; })}
  </g>
);
const Ahuehuete: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-40 0 C -26 -60, -24 -160, -18 -260 L 18 -260 C 24 -160, 26 -60, 40 0 Z" fill="#6E4A2E" stroke={NEGRO} strokeWidth={2.6} />
    <path d="M-10 -40 C -6 -120, -8 -180, -4 -240 M10 -60 C 12 -130, 10 -190, 12 -240" stroke="#4A3020" strokeWidth={2} fill="none" />
    <g transform={`rotate(${Math.sin(f / 50) * 1.2} 0 -260)`}>
      <path d={suave([[-130, -230], [-150, -300], [-110, -380], [-40, -430], [40, -430], [110, -380], [150, -300], [130, -230], [60, -210], [-60, -210]], true)} fill="#3E6A3A" stroke={NEGRO} strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-110 + (i % 6) * 44} ${-250 - Math.floor(i / 6) * 70} v 34`} stroke="#2A4A2A" strokeWidth={3} />)}
    </g>
  </g>
);
const Encino: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-24 0 C -18 -80, -20 -140, -40 -200 M24 0 C 20 -90, 30 -150, 60 -210 M0 -120 C 0 -170, 6 -220, 0 -260" stroke="#5A3A24" strokeWidth={20} fill="none" strokeLinecap="round" />
    <path d="M-24 0 C -18 -80, -20 -140, -40 -200 M24 0 C 20 -90, 30 -150, 60 -210 M0 -120 C 0 -170, 6 -220, 0 -260" stroke="#7A5A3A" strokeWidth={13} fill="none" strokeLinecap="round" />
    <g transform={`rotate(${Math.sin(f / 60) * 1.4} 0 -240)`}>
      {[[-90, -250, 90], [70, -260, 96], [0, -320, 100], [-40, -200, 70], [60, -200, 70]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? '#4E7A3A' : '#5E8A44'} stroke={NEGRO} strokeWidth={2.6} />)}
      {[[-100, -230], [-60, -300], [30, -330], [80, -250], [10, -220], [-20, -270], [60, -300]].map(([cx, cy], i) => <g key={`b${i}`}><ellipse cx={cx} cy={cy} rx={7} ry={9} fill="#8A5A2A" stroke={NEGRO} strokeWidth={1.4} /><path d={`M${cx - 7} ${cy - 4} h 14`} stroke={K.crema2} strokeWidth={3} /></g>)}
    </g>
  </g>
);
const Ceiba: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-70 0 L -30 -40 L -26 -300 L 26 -300 L 30 -40 L 70 0 Z" fill="#9A8A70" stroke={NEGRO} strokeWidth={2.6} />
    {[-14, 6].map((dx, i) => <path key={i} d={`M${dx} -60 l 6 -8 l 6 8 Z`} fill="#6E6250" />)}
    <path d="M-26 -300 C -80 -320, -140 -330, -200 -320 M26 -300 C 80 -320, 140 -330, 200 -316 M0 -300 V -360" stroke="#6E604A" strokeWidth={14} fill="none" strokeLinecap="round" />
    <g transform={`rotate(${Math.sin(f / 50) * 1} 0 -330)`}>
      {[[-200, -340, 90, 40], [190, -336, 90, 40], [0, -380, 140, 50], [-100, -370, 90, 40], [100, -372, 90, 40]].map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={i % 2 ? '#3E7A44' : '#4E8A4A'} stroke={NEGRO} strokeWidth={2.4} />)}
    </g>
    {[-150, 150].map((vx, i) => <path key={`l${i}`} d={`M${vx} -320 C ${vx + 10} -250, ${vx - 10 + Math.sin(f / 20 + i) * 6} -180, ${vx + 4} -120`} stroke="#4E6A2E" strokeWidth={4} fill="none" />)}
  </g>
);
const MaizCodice: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s}) rotate(${Math.sin(f / 30 + x) * 1.5})`}>
    <path d="M0 0 L 0 -220" stroke="#5E8A3A" strokeWidth={8} />
    {[[-1, -50], [1, -90], [-1, -130], [1, -170]].map(([k, yy], i) => <path key={i} d={`M0 ${yy} C ${k * 40} ${yy - 30}, ${k * 70} ${yy - 20}, ${k * 90} ${yy + 10} C ${k * 60} ${yy - 4}, ${k * 30} ${yy - 4}, 0 ${yy + 8} Z`} fill="#6E9A44" stroke={NEGRO} strokeWidth={1.8} />)}
    <g transform="translate(8 -120) rotate(20)"><path d="M-8 0 C -12 -30, -8 -50, 0 -60 C 8 -50, 12 -30, 8 0 Z" fill={K.amarillo} stroke={NEGRO} strokeWidth={1.8} />{[-44, -32, -20, -8].map((yy) => <path key={yy} d={`M-7 ${yy} h 14`} stroke="#B8862A" strokeWidth={1.4} />)}<path d="M0 -60 c -6 -10, -2 -20, 4 -26 M0 -60 c 6 -8, 12 -12, 14 -20" stroke={K.rojo} strokeWidth={2} fill="none" /></g>
    <path d="M0 -220 l -10 -24 M0 -220 l 0 -28 M0 -220 l 10 -24" stroke="#C9A24A" strokeWidth={4} strokeLinecap="round" />
  </g>
);

// ---------- construcciones ----------
/** Pirámide escalonada con escalinata y templo(s) arriba. templos = 1 (templo con cresta) o 2 (Templo Mayor: Tlaloc azul y Huitzilopochtli rojo). */
const Piramide: React.FC<{ x: number; y?: number; s?: number; templos?: number; color?: string; sinTemplo?: boolean }> = ({ x, y = SUELO, s = 1, templos = 1, color = '#C9B48A', sinTemplo }) => {
  const tiers = [[300, 0], [250, -70], [200, -140], [150, -210]] as const;
  const alto = -280;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      {tiers.map(([w, y0], i) => <g key={i}>
        <path d={`M${-w} ${y0} L ${-w + 18} ${y0 - 70} L ${w - 18} ${y0 - 70} L ${w} ${y0} Z`} fill={color} stroke={NEGRO} strokeWidth={2.6} />
        <path d={`M${-w + 10} ${y0 - 34} H ${w - 10}`} stroke={NEGRO} strokeWidth={1.4} opacity={0.4} />
        <rect x={-w + 18} y={y0 - 70} width={(w - 18) * 2} height={8} fill={K.rojo} stroke={NEGRO} strokeWidth={1.2} />
      </g>)}
      {templos === 2 ? [-1, 1].map((k) => <g key={k}>
        <path d={`M${k * 40 - 30} 0 L ${k * 40 - 30} ${alto} L ${k * 40 + 30} ${alto} L ${k * 40 + 30} 0 Z`} fill={K.crema} stroke={NEGRO} strokeWidth={2.2} />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${k * 40 - 30} ${-i * 23 - 8} H ${k * 40 + 30}`} stroke={NEGRO} strokeWidth={1.4} />)}
      </g>) : <>
        <path d={`M-40 0 L -40 ${alto} L 40 ${alto} L 40 0 Z`} fill={K.crema} stroke={NEGRO} strokeWidth={2.2} />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M-40 ${-i * 23 - 8} H 40`} stroke={NEGRO} strokeWidth={1.4} />)}
        <path d={`M-48 0 V ${alto} M48 0 V ${alto}`} stroke={K.rojo} strokeWidth={10} />
      </>}
      {!sinTemplo && (templos === 2 ? [[-1, K.azul, K.blanco], [1, K.rojo, K.blanco]] as const : [[0, K.rojo, K.crema]] as const).map(([k, c, c2], i) => {
        const cx = (k as number) * 72, w = templos === 2 ? 60 : 80;
        return <g key={i} transform={`translate(${cx} ${alto})`}>
          <rect x={-w} y={-100} width={w * 2} height={100} fill={c2} stroke={NEGRO} strokeWidth={2.4} />
          <path d={`M${-w * 0.35} 0 V -64 H ${w * 0.35} V 0 Z`} fill={NEGRO} />
          <path d={`M${-w - 8} -100 L ${-w * 0.7} -150 L ${w * 0.7} -150 L ${w + 8} -100 Z`} fill={c} stroke={NEGRO} strokeWidth={2.4} />
          {Array.from({ length: 5 }, (_, j) => <rect key={j} x={-w * 0.6 + j * w * 0.3 - 6} y={-176} width={12} height={26} fill={c2} stroke={NEGRO} strokeWidth={1.6} />)}
          {templos === 2 && k === -1 && [-30, 0, 30].map((dx) => <circle key={dx} cx={dx} cy={-125} r={7} fill={K.blanco} stroke={NEGRO} strokeWidth={1.4} />)}
          {templos === 2 && k === 1 && [-30, 0, 30].map((dx) => <path key={dx} d={`M${dx - 7} -118 l 7 -14 l 7 14 Z`} fill={K.blanco} stroke={NEGRO} strokeWidth={1.4} />)}
        </g>;
      })}
    </g>
  );
};
/** Casa mexica: muros blancos de adobe con franja roja y techo plano. */
const CasaMexica: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-110} y={-140} width={220} height={140} fill={K.blanco} stroke={NEGRO} strokeWidth={2.6} />
    <rect x={-120} y={-156} width={240} height={18} fill={K.ocre} stroke={NEGRO} strokeWidth={2.2} />
    <rect x={-110} y={-120} width={220} height={12} fill={K.rojo} />
    <path d="M-24 0 V -80 H 24 V 0 Z" fill={NEGRO} />
    <rect x={50} y={-90} width={34} height={30} fill={NEGRO} />
  </g>
);
/** Choza de techo de zacate (jacal). */
const Jacal: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-80} y={-100} width={160} height={100} fill={K.crema2} stroke={NEGRO} strokeWidth={2.4} />
    {[-60, -30, 0, 30, 60].map((dx) => <path key={dx} d={`M${dx} -96 V -4`} stroke={K.ocre} strokeWidth={2} />)}
    <path d="M-110 -96 L 0 -200 L 110 -96 Z" fill="#C9A24A" stroke={NEGRO} strokeWidth={2.6} />
    {[-70, -40, -10, 20, 50, 80].map((dx) => <path key={dx} d={`M${dx * 0.9} -110 L ${dx * 0.4} -170`} stroke="#8A6A2A" strokeWidth={2} />)}
    <path d="M-18 0 V -64 H 18 V 0 Z" fill={NEGRO} />
  </g>
);
/** Altar escalonado chico (momoztli) con brasero. */
const Momoztli: React.FC<{ x: number; y?: number; s?: number; f: number; fuego?: boolean }> = ({ x, y = SUELO, s = 1, f, fuego = true }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-90 0 L -84 -40 L 84 -40 L 90 0 Z M-66 -40 L -60 -76 L 60 -76 L 66 -40 Z" fill={K.crema2} stroke={NEGRO} strokeWidth={2.4} />
    <rect x={-60} y={-60} width={120} height={8} fill={K.rojo} />
    <path d="M-26 -76 L -20 -108 L 20 -108 L 26 -76 Z" fill={K.ocre} stroke={NEGRO} strokeWidth={2.2} />
    {fuego && <g transform="translate(0 -108)"><Fuego f={f} s={0.4} /></g>}
  </g>
);
/** Asiento de petate con respaldo (icpalli), de señores y dioses. */
const Icpalli: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-80 0 V -100 H 80 V 0 Z" fill="#D9B86A" stroke={NEGRO} strokeWidth={2.4} />
    <path d="M-100 -96 V -230 C -100 -250, -60 -250, -60 -230 V -96 Z" fill="#D9B86A" stroke={NEGRO} strokeWidth={2.4} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-76 + i * 30} -96 l 14 14 l 14 -14`} stroke="#8A6A2A" strokeWidth={2} fill="none" />)}
    {[-200, -160, -120].map((yy) => <path key={yy} d={`M-98 ${yy} h 36`} stroke="#8A6A2A" strokeWidth={2} />)}
    <rect x={-84} y={-108} width={168} height={12} fill={K.rojo} stroke={NEGRO} strokeWidth={1.6} />
  </g>
);
/** Gran hoguera (la de Teotihuacan): troncos cruzados y fuego alto. */
const Hoguera: React.FC<{ x: number; y?: number; s?: number; f: number; brasas?: boolean }> = ({ x, y = SUELO, s = 1, f, brasas }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <circle cx={0} cy={-160} r={260} fill="url(#halo)" opacity={brasas ? 0.3 : 0.75} />
    {[[-110, 20, 60, -40], [-90, -40, 110, 10], [-60, -10, 90, -60]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L ${c} ${d}`} stroke={NEGRO} strokeWidth={30} strokeLinecap="round" />)}
    {[[-110, 20, 60, -40], [-90, -40, 110, 10], [-60, -10, 90, -60]].map(([a, b, c, d], i) => <path key={`t${i}`} d={`M${a} ${b} L ${c} ${d}`} stroke="#7A4A2A" strokeWidth={22} strokeLinecap="round" />)}
    {brasas ? [-50, 0, 50].map((dx, i) => <circle key={i} cx={dx} cy={-20} r={16 + Math.sin(f / 5 + i) * 3} fill={K.rojo} opacity={0.85} />) : <g transform="translate(0 -30)"><Fuego f={f} s={1.6} /></g>}
  </g>
);
/** Espejo humeante grande (de obsidiana, con marco amarillo y humo en volutas). */
const EspejoGrande: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO - 120, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {[0, 1, 2].map((k) => { const t = ((f * 0.5 + k * 26) % 80) / 80; return <path key={k} d={`M${-20 + k * 20} -60 C ${-50 + k * 20} ${-100 - t * 30}, ${20 + k * 10} ${-130 - t * 40}, ${-10 + k * 16} ${-180 - t * 50}`} stroke="#A8A296" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.85 - t * 0.6} />; })}
    <circle r={70} fill={K.amarillo} stroke={NEGRO} strokeWidth={3} />
    {Array.from({ length: 12 }, (_, i) => <circle key={i} transform={`rotate(${i * 30})`} cy={-62} r={5} fill={K.rojo} />)}
    <circle r={54} fill="#1F1C22" stroke={NEGRO} strokeWidth={2} />
    <path d="M-30 -20 Q -6 -44 24 -34" stroke="#C9CDD6" strokeWidth={5} fill="none" strokeLinecap="round" />
  </g>
);
/** Huesos (dibujo amable): un atado de huesos largos blancos. */
const Huesos: React.FC<{ x: number; y?: number; s?: number; brillo?: boolean; f: number }> = ({ x, y = SUELO, s = 1, brillo, f }) => {
  const hueso = (a: number, dx: number, i: number) => <g key={i} transform={`translate(${dx} -14) rotate(${a})`}>
    <path d="M-60 -4 H 60 V 4 H -60 Z" fill={K.blanco} stroke={NEGRO} strokeWidth={2} />
    {[-1, 1].map((k) => <g key={k}><circle cx={k * 62} cy={-6} r={8} fill={K.blanco} stroke={NEGRO} strokeWidth={2} /><circle cx={k * 62} cy={6} r={8} fill={K.blanco} stroke={NEGRO} strokeWidth={2} /></g>)}
  </g>;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      {brillo && <circle cx={0} cy={-20} r={120} fill="url(#haloBlanco)" opacity={0.6 + Math.sin(f / 8) * 0.2} />}
      {hueso(-8, -10, 0)}{hueso(6, 14, 1)}{hueso(-2, 0, 2)}
      <path d="M-12 -30 V 6 M12 -30 V 6" stroke={K.rojo} strokeWidth={6} />
    </g>
  );
};
/** Caracol marino (trompeta de caracol). */
const CaracolEl: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-70 -10 C -80 -50, -40 -80, 10 -76 C 60 -72, 80 -40, 70 -10 C 40 0, -40 4, -70 -10 Z" fill={K.blanco} stroke={NEGRO} strokeWidth={2.6} />
    <path d="M70 -10 L 96 -2 L 70 6 Z" fill={K.blanco} stroke={NEGRO} strokeWidth={2} />
    <path d="M10 -76 C -10 -50, -4 -20, 30 -12 M-30 -66 C -40 -40, -30 -14, 0 -8" stroke={K.rosa} strokeWidth={3.4} fill="none" />
    <path d="M-60 -40 c 10 -10, 24 -10, 30 0" stroke={NEGRO} strokeWidth={2} fill="none" />
  </g>
);
/** Canoa (acalli) vista de costado. */
const Acalli: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO - 20, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y + Math.sin(f / 12 + x) * 4)}) scale(${s})`}>
    <path d="M-160 -30 C -140 10, 140 10, 170 -34 L 150 -20 C 60 -10, -60 -10, -146 -20 Z" fill="#7A4A2A" stroke={NEGRO} strokeWidth={2.6} />
    <path d="M-146 -20 C -60 -10, 60 -10, 150 -20" stroke={K.amarillo} strokeWidth={4} fill="none" />
  </g>
);
/** Chinampa: huerto flotante rectangular con milpa y sauces. */
const Chinampa: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-200} y={-30} width={400} height={44} fill="#6E5030" stroke={NEGRO} strokeWidth={2.4} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-190 + i * 40} -26 v 36`} stroke="#4A3420" strokeWidth={2} />)}
    {[-150, -70, 10, 90].map((dx, i) => <MaizCodice key={i} x={dx} y={-30} s={0.5} f={f + i * 7} />)}
    <g transform="translate(160 -30)"><path d="M0 0 V -130" stroke="#6E4A2E" strokeWidth={8} /><ellipse cx={0} cy={-150} rx={36} ry={56} fill="#7AAA5A" stroke={NEGRO} strokeWidth={2} /></g>
  </g>
);
/** Remolino de viento (el fin del Sol de Viento): espiral que gira y sube. */
const Remolino: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${r1(x + Math.sin(f / 9) * 30)} ${r1(y)}) scale(${s})`}>
    {Array.from({ length: 9 }, (_, i) => { const yy = -i * 52, w = 40 + i * 22, ph = f * 0.4 + i; return <g key={i}>
      <ellipse cx={Math.sin(ph) * 10} cy={yy - 20} rx={w} ry={14 + i * 1.5} fill="none" stroke="#C9D8DC" strokeWidth={10} opacity={0.75} />
      <ellipse cx={Math.sin(ph) * 10} cy={yy - 20} rx={w} ry={14 + i * 1.5} fill="none" stroke={NEGRO} strokeWidth={2} strokeDasharray={`${w} ${w * 0.6}`} strokeDashoffset={-f * 6} />
    </g>; })}
    {Array.from({ length: 6 }, (_, i) => { const t = ((f * 0.02 + i / 6) % 1); return <path key={`h${i}`} d="M0 0 l 10 -6 l 4 10 Z" fill="#5E8A3A" transform={`translate(${Math.cos(t * 20 + i) * (60 + t * 160)} ${-t * 440}) rotate(${t * 720})`} />; })}
  </g>
);
/** Rueda de la cuenta de los días: veinte casillas de colores con signos simples alrededor de un sol. */
const Calendario: React.FC<{ x: number; y?: number; s?: number; f: number; n?: number }> = ({ x, y = SUELO - 220, s = 1, f, n = 20 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <circle r={190} fill={K.crema} stroke={NEGRO} strokeWidth={3} />
    {Array.from({ length: n }, (_, i) => { const a = (i / n) * 360; return <g key={i} transform={`rotate(${a}) translate(0 -150)`}>
      <rect x={-22} y={-22} width={44} height={44} fill={[K.rojo, K.turquesa, K.amarillo, K.blanco][i % 4]} stroke={NEGRO} strokeWidth={2} />
      {i % 5 === 0 ? <circle r={9} fill={NEGRO} /> : i % 5 === 1 ? <path d="M-10 8 L 0 -10 L 10 8 Z" fill={NEGRO} /> : i % 5 === 2 ? <path d="M-10 0 q 5 -10 10 0 t 10 0" stroke={NEGRO} strokeWidth={3} fill="none" /> : i % 5 === 3 ? <rect x={-7} y={-7} width={14} height={14} fill="none" stroke={NEGRO} strokeWidth={3} /> : <path d="M-8 -8 L 8 8 M8 -8 L -8 8" stroke={NEGRO} strokeWidth={3} />}
    </g>; })}
    <circle r={110} fill="none" stroke={K.rojo} strokeWidth={6} />
    <SolCodice x={0} y={0} r={56} f={f} />
  </g>
);
/** Chicomoztoc: el cerro de las siete cuevas. */
const Chicomoztoc: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <Tepetl x={0} y={0} w={320} h={420} color="#7A8A4A" />
    {[[-150, -120], [-50, -110], [50, -112], [150, -124], [-100, -230], [0, -250], [100, -230]].map(([cx, cy], i) => <g key={i}><path d={`M${cx - 40} ${cy + 30} C ${cx - 44} ${cy - 30}, ${cx + 44} ${cy - 30}, ${cx + 40} ${cy + 30} Z`} fill={NEGRO} stroke={K.ocre} strokeWidth={4} /></g>)}
  </g>
);
/** Cielo que baja (Omeyocan y los cielos en capas): franjas de colores en arco. */
const CielosCapas: React.FC<{ f: number }> = ({ f }) => (
  <g>
    {[K.turquesa, K.amarillo, K.rojo].map((c, i) => <path key={i} d={`M-900 ${380 + i * 26} Q 960 ${200 + i * 26} 3100 ${380 + i * 26}`} stroke={c} strokeWidth={14} fill="none" opacity={0.45} />)}
    <path d="M-900 330 Q 960 150 3100 330" stroke="#26385F" strokeWidth={56} fill="none" />
    {Array.from({ length: 22 }, (_, i) => { const t = i / 21, x = -900 + t * 4000, y = (1 - t) * (1 - t) * 330 + 2 * (1 - t) * t * 150 + t * t * 330; return <EstrellaOjo key={i} x={x} y={y} r={11} f={f} i={i} />; })}
  </g>
);

/** Lluvia de fuego (fin del tercer sol): bolas de fuego que caen en diagonal a lo ancho de la escena. */
const LluviaFuego: React.FC<{ x: number; f: number; n?: number }> = ({ x, f, n = 28 }) => (
  <g>{Array.from({ length: n }, (_, i) => {
    const t = ((f * (0.9 + azar(i) * 0.5) + azar(i * 3) * 600) % 600) / 600, px = x - 1300 + azar(i * 7) * 2600 - t * 220, py = 130 + t * 680;
    return <g key={i} transform={`translate(${r1(px)} ${r1(py)}) rotate(-18)`} opacity={t > 0.92 ? (1 - t) * 12 : 1}>
      <path d="M0 0 C -10 -30, -4 -60, 6 -84 C 8 -56, 14 -30, 10 0 Z" fill={K.amarillo} opacity={0.7} />
      <circle r={13} fill={K.rojo} stroke={NEGRO} strokeWidth={2} /><circle r={6} fill={K.amarillo} />
    </g>;
  })}</g>
);
/** Tronco hueco de ahuehuete (el refugio de Tata y Nene); flota si props.flota. */
const Tronco: React.FC<{ x: number; y?: number; s?: number; f: number; flota?: boolean }> = ({ x, y = SUELO, s = 1, f, flota }) => (
  <g transform={`translate(${r1(x)} ${r1(y + (flota ? Math.sin(f / 14) * 6 : 0))}) rotate(${flota ? Math.sin(f / 20) * 2 : 0}) scale(${s})`}>
    <path d="M-220 -10 C -224 -70, -200 -96, -160 -96 L 180 -96 C 214 -96, 230 -60, 226 -10 C 222 10, 200 14, 180 14 L -160 14 C -200 14, -218 6, -220 -10 Z" fill="#6E4A2E" stroke={NEGRO} strokeWidth={3} />
    {[-120, -40, 40, 120].map((dx) => <path key={dx} d={`M${dx - 30} -70 C ${dx} -76, ${dx + 30} -70, ${dx + 50} -74`} stroke="#4A3020" strokeWidth={3} fill="none" />)}
    <ellipse cx={186} cy={-41} rx={34} ry={50} fill="#C9A06A" stroke={NEGRO} strokeWidth={3} />
    <ellipse cx={186} cy={-41} rx={22} ry={34} fill="#2A1A10" />
    {[0, 1, 2].map((k) => <ellipse key={k} cx={186} cy={-41} rx={28 - k * 3} ry={44 - k * 4} fill="none" stroke="#8A6A3A" strokeWidth={1.4} />)}
  </g>
);
/** Pozo / hoyo en el suelo (el del Mictlan). Origen = centro del hoyo. */
const Pozo: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO + 4, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <ellipse rx={170} ry={30} fill="#0E0A0C" stroke={NEGRO} strokeWidth={3} />
    <ellipse rx={150} ry={22} fill="none" stroke="#3A2A30" strokeWidth={4} />
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 176} cy={Math.sin(a) * 34} r={8} fill="#5A4A50" stroke={NEGRO} strokeWidth={1.4} />; })}
  </g>
);
/** Cajete (cuenco) de piedra verde, donde Cihuacóatl muele los huesos. */
const Cajete: React.FC<{ x: number; y?: number; s?: number; f: number; brillo?: boolean }> = ({ x, y = SUELO, s = 1, f, brillo }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {brillo && <circle cy={-60} r={130} fill="url(#haloBlanco)" opacity={0.55 + Math.sin(f / 8) * 0.2} />}
    <path d="M-90 -70 C -86 -10, -50 0, 0 0 C 50 0, 86 -10, 90 -70 Z" fill={K.jade} stroke={NEGRO} strokeWidth={3} />
    <ellipse cy={-70} rx={90} ry={16} fill="#2E6A44" stroke={NEGRO} strokeWidth={3} />
    <ellipse cy={-72} rx={70} ry={10} fill={K.blanco} opacity={0.85} />
    {[-50, 0, 50].map((dx) => <circle key={dx} cx={dx} cy={-34} r={8} fill={K.turquesa} stroke={NEGRO} strokeWidth={1.5} />)}
  </g>
);
/** Tonacatépetl, el Cerro de Nuestro Sustento, lleno de maíz y semillas. props.abierto = partido por el rayo. */
const Tonacatepetl: React.FC<{ x: number; y?: number; s?: number; f: number; abierto?: boolean }> = ({ x, y = SUELO, s = 1, f, abierto }) => {
  const sep = abierto ? 70 : 0;
  const granos = (k: number) => Array.from({ length: 22 }, (_, i) => <circle key={`${k}${i}`} cx={-150 + azar(i * 5 + k) * 300} cy={-40 - azar(i * 3 + k) * 260} r={9} fill={[K.blanco, K.amarillo, '#2A2226', K.rojo][i % 4]} stroke={NEGRO} strokeWidth={1.4} />);
  const mitad = (lado: number) => <g transform={`translate(${lado * sep} 0)`}>
    <defs><clipPath id={`tona${lado}${Math.round(x)}`}><rect x={lado < 0 ? -500 : 0} y={-600} width={500} height={620} /></clipPath></defs>
    <g clipPath={`url(#tona${lado}${Math.round(x)})`}><Tepetl x={0} y={0} w={330} h={420} color="#7A9A4A" />{abierto && granos(lado)}</g>
  </g>;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      {abierto && <path d="M0 -420 V 0" stroke={K.amarillo} strokeWidth={60} opacity={0.5 + Math.sin(f / 5) * 0.2} />}
      {mitad(-1)}{mitad(1)}
      {!abierto && <g opacity={0.9}>{[[-60, -150], [10, -210], [70, -120], [-10, -90]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={8} fill={[K.amarillo, K.blanco, K.rojo, '#2A2226'][i]} stroke={NEGRO} strokeWidth={1.4} />)}</g>}
    </g>
  );
};
/** Bola de plumón blanco (la que guarda Coatlicue); flota y gira si props.cae. */
const PlumaBola: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = 400, s = 1, f }) => (
  <g transform={`translate(${r1(x + Math.sin(f / 12) * 14)} ${r1(y)}) rotate(${Math.sin(f / 10) * 20}) scale(${s})`}>
    <circle r={60} fill="url(#haloBlanco)" opacity={0.6} />
    {Array.from({ length: 14 }, (_, i) => <ellipse key={i} transform={`rotate(${i * 26})`} cx={0} cy={-16} rx={7} ry={18} fill={K.blanco} stroke="#B8B0A0" strokeWidth={1.2} />)}
    <circle r={10} fill={K.blanco} stroke={NEGRO} strokeWidth={1.4} />
  </g>
);
/** Vía Láctea: el camino que dejaron Tezcatlipoca y Quetzalcóatl al subir el cielo. */
const ViaLactea: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = 360, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-1100 180 Q 0 -260 1100 180" stroke="#E9E4F2" strokeWidth={110} fill="none" opacity={0.22} />
    <path d="M-1100 180 Q 0 -260 1100 180" stroke="#FFFFFF" strokeWidth={36} fill="none" opacity={0.2} />
    {Array.from({ length: 60 }, (_, i) => { const t = azar(i * 3), px = -1100 + t * 2200, py = 180 - 4 * t * (1 - t) * 440 + (azar(i * 5) - 0.5) * 90; return <circle key={i} cx={px} cy={py} r={2 + azar(i) * 3} fill={K.blanco} opacity={0.5 + 0.5 * Math.sin(f / 9 + i)} />; })}
  </g>
);

// ---------- suelos especiales ----------
/** Banco de nubes de los cielos (suelo del Omeyocan). */
const SueloNubes: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-1600} y={SUELO + 4} width={8000} height={260} fill={K.blanco} />
    <path d={`M-1600 ${SUELO + 8} ` + Array.from({ length: 140 }, (_, i) => `q 30 ${-20 - azar(i) * 14} 60 0`).join(' ') + ` V ${SUELO + 260} H -1600 Z`} fill={K.blanco} stroke={NEGRO} strokeWidth={3} />
    {Array.from({ length: 140 }, (_, i) => <path key={i} d={`M${-1600 + i * 60 + 14} ${SUELO + 26} a 9 9 0 1 1 9 9`} stroke={K.azul} strokeWidth={2.4} fill="none" opacity={0.7} transform={`translate(${Math.sin(f / 50 + i) * 2} 0)`} />)}
  </g>
);
const SueloOscuro: React.FC = () => (
  <g>
    <rect x={-1600} y={SUELO} width={8000} height={260} fill="#2A1E26" />
    <rect x={-1600} y={SUELO} width={8000} height={5} fill={NEGRO} />
    {Array.from({ length: 140 }, (_, i) => <g key={i}><path d={`M${-1600 + i * 60 + 10} ${SUELO + 22} h 22`} stroke="#E9DFC6" strokeWidth={5} strokeLinecap="round" opacity={0.7} /><circle cx={-1600 + i * 60 + 8} cy={SUELO + 22} r={4} fill="#E9DFC6" opacity={0.7} /><circle cx={-1600 + i * 60 + 34} cy={SUELO + 22} r={4} fill="#E9DFC6" opacity={0.7} /></g>)}
  </g>
);

// ---------- fondos ----------
export function fondoAzteca(tipo: string, f: number, astros = true): React.ReactNode | null {
  switch (tipo) {
    case 'omeyocan': return (
      <>
        <Capa p={0.08}><CielosCapas f={f} /></Capa>
        <Capa p={0.25}>{[[-200, 520], [500, 470], [1300, 540], [2000, 480], [2700, 520]].map(([x, y], i) => <NubeCodice key={i} x={x} y={y} s={1.1} f={f} />)}</Capa>
        <Capa p={0.6}>{[[0, 690], [900, 700], [1800, 680], [2700, 700]].map(([x, y], i) => <NubeCodice key={i} x={x} y={y} s={1.4} f={f} />)}</Capa>
        <Capa p={1}><SueloNubes f={f} /></Capa>
      </>
    );
    case 'aguas_primeras': return (
      <>
        <Capa p={0.06}>{astros && <CampoEstrellas f={f} n={10} area={[-200, 160, 2400, 200]} r={6} />}</Capa>
        <Capa p={0.2}>{[[100, 330], [900, 280], [1700, 340], [2500, 300]].map(([x, y], i) => <NubeCodice key={i} x={x} y={y} s={0.9} f={f} oscura />)}</Capa>
        <Capa p={0.5}><AguaCodice y={SUELO - 150} f={f * 0.6} oscura desde={-1800} hasta={4200} /></Capa>
        <Capa p={1}><AguaCodice y={SUELO - 40} f={f} desde={-1800} hasta={6400} /></Capa>
      </>
    );
    case 'valle': return (
      <>
        <Capa p={0.1}>{astros && <SolCodice x={1620} y={250} r={46} f={f} />}</Capa>
        <Capa p={0.18}><Sierra y={SUELO - 50} seed={4} /><Volcan x={350} y={SUELO - 60} s={0.7} f={f} /><Volcan x={900} y={SUELO - 60} s={0.55} f={f} humo={false} /></Capa>
        <Capa p={0.35}><Tepetl x={1500} y={SUELO - 30} w={220} h={260} /><Tepetl x={2300} y={SUELO - 30} w={180} h={220} color="#6E9A4E" /><Tepetl x={-200} y={SUELO - 30} w={200} h={240} color="#6E9A4E" /></Capa>
        <Capa p={0.55}><AguaCodice y={SUELO - 40} f={f * 0.4} desde={-800} hasta={4400} /></Capa>
        <Capa p={0.8}>{[0, 700, 1500, 2300, 3100].map((x, i) => <g key={i}><Maguey x={x} y={SUELO - 8} s={0.6} f={f} /><Nopal x={x + 320} y={SUELO - 8} s={0.5} /></g>)}</Capa>
        <Capa p={1}><SueloCodice desde={-1600} hasta={6400} /></Capa>
      </>
    );
    case 'encinar': return (
      <>
        <Capa p={0.1}>{astros && <SolCodice x={1500} y={240} r={44} f={f} />}</Capa>
        <Capa p={0.2}><Sierra y={SUELO - 40} seed={9} color="#A8B08A" /></Capa>
        <Capa p={0.4}>{[-200, 300, 800, 1300, 1800, 2300, 2800].map((x, i) => <Encino key={i} x={x} y={SUELO - 30} s={0.7 + azar(i) * 0.15} f={f} />)}</Capa>
        <Capa p={0.75}>{[-100, 700, 1600, 2500, 3400].map((x, i) => <Encino key={i} x={x} y={SUELO} s={1.05} f={f + i * 13} />)}</Capa>
        <Capa p={1}><SueloCodice desde={-1600} hasta={6400} color="#8A6A3A" /></Capa>
      </>
    );
    case 'selva': return (
      <>
        <Capa p={0.1}>{astros && <SolCodice x={1550} y={230} r={40} f={f} />}</Capa>
        <Capa p={0.3}>{[-300, 300, 900, 1500, 2100, 2700].map((x, i) => <Ceiba key={i} x={x} y={SUELO - 30} s={0.75} f={f} />)}</Capa>
        <Capa p={0.7}>{[0, 900, 1800, 2700, 3600].map((x, i) => <g key={i}><Ceiba x={x} y={SUELO} s={1.05} f={f + i * 9} /><Maguey x={x + 400} y={SUELO} s={0.5} f={f} /></g>)}</Capa>
        <Capa p={1}><SueloCodice desde={-1600} hasta={6400} color="#6E5A2E" /></Capa>
      </>
    );
    case 'firmamento': return (
      <>
        <Capa p={0.05}>{astros && <><CampoEstrellas f={f} n={26} area={[-200, 150, 2400, 380]} r={8} /><path d="M-400 520 Q 960 60 2600 520" stroke="#C9D2E6" strokeWidth={70} fill="none" opacity={0.18} /></>}</Capa>
        <Capa p={0.3}><Tepetl x={200} y={SUELO - 20} w={260} h={220} color="#24304E" /><Tepetl x={1300} y={SUELO - 20} w={300} h={260} color="#24304E" /><Tepetl x={2300} y={SUELO - 20} w={240} h={200} color="#24304E" /></Capa>
        <Capa p={1}><SueloCodice desde={-1600} hasta={6400} color="#3A2E3E" /></Capa>
      </>
    );
    case 'mictlan': return (
      <>
        <Capa p={0.06}>{astros && <CampoEstrellas f={f} n={12} area={[-200, 160, 2400, 220]} r={6} />}</Capa>
        <Capa p={0.25}>{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-600 + i * 300} ${SUELO} L ${-520 + i * 300} ${260 + azar(i) * 220} L ${-460 + i * 300} ${330 + azar(i + 4) * 120} L ${-400 + i * 300} ${SUELO} Z`} fill="#3A2434" stroke={NEGRO} strokeWidth={2.4} />)}</Capa>
        <Capa p={0.5}><AguaCodice y={SUELO - 70} f={f * 0.3} oscura desde={-1600} hasta={4400} /></Capa>
        <Capa p={0.8}>{[200, 1100, 2000, 2900].map((x, i) => <g key={i} transform={`translate(${x} ${SUELO - 10})`}><path d="M0 0 C -6 -60, 10 -120, -4 -190 M-2 -110 C -40 -140, -60 -150, -80 -180 M0 -150 C 30 -170, 50 -190, 60 -220" stroke="#120C10" strokeWidth={12} fill="none" strokeLinecap="round" /></g>)}</Capa>
        <Capa p={1}><SueloOscuro /></Capa>
      </>
    );
    case 'teotihuacan': case 'teotihuacan_noche': {
      const noche = tipo === 'teotihuacan_noche';
      return (
        <>
          <Capa p={0.06}>{astros && (noche ? <CampoEstrellas f={f} n={20} area={[-200, 150, 2400, 300]} r={8} /> : <SolCodice x={1650} y={240} r={44} f={f} cara={false} />)}</Capa>
          <Capa p={0.18}><Sierra y={SUELO - 60} seed={2} color={noche ? '#3A4462' : '#B7A88A'} /></Capa>
          <Capa p={0.3}><Piramide x={420} y={SUELO - 40} s={0.6} color={noche ? '#5A5A6E' : '#C9B48A'} sinTemplo /><Piramide x={1350} y={SUELO - 40} s={1} color={noche ? '#5E5A70' : '#C2A87A'} sinTemplo /></Capa>
          <Capa p={0.6}>{[-300, 300, 2200, 2800].map((x, i) => <Piramide key={i} x={x} y={SUELO - 10} s={0.32} color={noche ? '#4A4A5E' : '#B8A47E'} sinTemplo />)}</Capa>
          <Capa p={1}><SueloCodice desde={-1600} hasta={6400} color={noche ? '#4A3A3A' : '#A8784A'} /></Capa>
        </>
      );
    }
    case 'coatepec': return (
      <>
        <Capa p={0.1}>{astros && <SolCodice x={1680} y={230} r={40} f={f} />}</Capa>
        <Capa p={0.2}><Sierra y={SUELO - 40} seed={6} /></Capa>
        <Capa p={0.4}><Tepetl x={1000} y={SUELO - 20} w={420} h={430} glifo="serpiente" f={f} /><Piramide x={1000} y={SUELO - 450} s={0.25} /></Capa>
        <Capa p={0.8}>{[-100, 500, 1500, 2200, 2900].map((x, i) => <Nopal key={i} x={x} y={SUELO - 8} s={0.45} />)}</Capa>
        <Capa p={1}><SueloCodice desde={-1600} hasta={6400} /></Capa>
      </>
    );
    case 'aztlan': return (
      <>
        <Capa p={0.1}>{astros && <SolCodice x={1600} y={240} r={42} f={f} />}</Capa>
        <Capa p={0.2}><Sierra y={SUELO - 140} seed={8} color="#9AB0A0" /></Capa>
        <Capa p={0.35}><AguaCodice y={SUELO - 150} f={f * 0.4} desde={-1200} hasta={4200} />
          <path d={`M520 ${SUELO - 150} C 560 ${SUELO - 230}, 1160 ${SUELO - 240}, 1220 ${SUELO - 150} Z`} fill="#A8946A" stroke={NEGRO} strokeWidth={3} />
          <Piramide x={870} y={SUELO - 210} s={0.28} /><CasaMexica x={660} y={SUELO - 180} s={0.35} /><CasaMexica x={1080} y={SUELO - 182} s={0.35} />
          {[560, 1180].map((x, i) => <Tule key={i} x={x} y={SUELO - 160} s={0.7} f={f} />)}
        </Capa>
        <Capa p={0.7}><AguaCodice y={SUELO - 60} f={f * 0.7} desde={-1600} hasta={5200} />{[-200, 600, 1500, 2400].map((x, i) => <Tule key={i} x={x} y={SUELO - 40} s={1} f={f + i * 5} />)}</Capa>
        <Capa p={1}><SueloCodice desde={-1600} hasta={6400} color="#8A7A4A" /></Capa>
      </>
    );
    case 'lago_texcoco': return (
      <>
        <Capa p={0.1}>{astros && <SolCodice x={1650} y={240} r={42} f={f} />}</Capa>
        <Capa p={0.18}><Sierra y={SUELO - 120} seed={3} color="#9AA89A" /><Volcan x={300} y={SUELO - 120} s={0.5} f={f} /><Volcan x={700} y={SUELO - 120} s={0.42} f={f} humo={false} /></Capa>
        <Capa p={0.4}><AguaCodice y={SUELO - 130} f={f * 0.4} desde={-1200} hasta={4400} />{[200, 1100, 1900, 2700].map((x, i) => <Tule key={i} x={x} y={SUELO - 110} s={0.6} f={f} />)}</Capa>
        <Capa p={1}><AguaCodice y={SUELO - 30} f={f} desde={-1600} hasta={6400} /></Capa>
      </>
    );
    case 'tenochtitlan': return (
      <>
        <Capa p={0.08}>{astros && <SolCodice x={1700} y={230} r={40} f={f} />}</Capa>
        <Capa p={0.15}><Sierra y={SUELO - 140} seed={5} color="#9AA89A" /><Volcan x={250} y={SUELO - 140} s={0.45} f={f} /><Volcan x={600} y={SUELO - 140} s={0.38} f={f} humo={false} /></Capa>
        <Capa p={0.3}><AguaCodice y={SUELO - 150} f={f * 0.3} desde={-1200} hasta={4400} />
          <rect x={300} y={SUELO - 196} width={1700} height={50} fill="#C9B48A" stroke={NEGRO} strokeWidth={2.4} />
          {[380, 520, 1460, 1600, 1760, 1900].map((x, i) => <CasaMexica key={i} x={x} y={SUELO - 192} s={0.28} />)}
          <Piramide x={1000} y={SUELO - 196} s={0.5} templos={2} /><Piramide x={700} y={SUELO - 196} s={0.18} /><Piramide x={1300} y={SUELO - 196} s={0.18} />
        </Capa>
        <Capa p={0.65}><AguaCodice y={SUELO - 70} f={f * 0.6} desde={-1600} hasta={5200} />{[-300, 700, 1700, 2700].map((x, i) => <Chinampa key={i} x={x} y={SUELO - 60} s={0.8} f={f} />)}{[300, 2200].map((x, i) => <Acalli key={i} x={x + Math.sin(f / 60) * 40} y={SUELO - 76} s={0.7} f={f} />)}</Capa>
        <Capa p={1}><SueloCodice desde={-1600} hasta={6400} color="#9A7A4A" /></Capa>
      </>
    );
    case 'milpa': return (
      <>
        <Capa p={0.1}>{astros && <SolCodice x={1620} y={240} r={44} f={f} />}</Capa>
        <Capa p={0.2}><Tepetl x={400} y={SUELO - 40} w={260} h={300} /><Tepetl x={1300} y={SUELO - 40} w={200} h={240} color="#6E9A4E" /><Tepetl x={2200} y={SUELO - 40} w={240} h={280} /></Capa>
        <Capa p={0.5}>{Array.from({ length: 22 }, (_, i) => <MaizCodice key={i} x={-300 + i * 140} y={SUELO - 20} s={0.7} f={f + i * 5} />)}<Jacal x={1500} y={SUELO - 20} s={0.6} /></Capa>
        <Capa p={1}><SueloCodice desde={-1600} hasta={6400} color="#8A5A2A" /></Capa>
      </>
    );
    default: return null;
  }
}

// ---------- elementos ----------
export function elementoAzteca(tipo: string, x: number, y: number | undefined, s: number, f: number, props: Record<string, unknown> = {}): React.ReactNode | null {
  const yy = y ?? SUELO;
  const b = (k: string) => props[k] === true;
  switch (tipo) {
    case 'piramide': case 'templo': return <Piramide x={x} y={yy} s={s * 0.8} templos={(props.templos as number) ?? 1} color={props.color as string} sinTemplo={b('sinTemplo')} />;
    case 'templo_mayor': return <Piramide x={x} y={yy} s={s * 0.8} templos={2} />;
    case 'tepetl': case 'monte': return <Tepetl x={x} y={yy} w={260 * s} h={340 * s} color={props.color as string} glifo={props.glifo === 'serpiente' ? 'serpiente' : null} f={f} />;
    case 'volcan': return <Volcan x={x} y={yy} s={s * 0.8} f={f} humo={props.humo !== false} />;
    case 'nopal': return <Nopal x={x} y={yy} s={s} roca={b('roca')} tunas={props.tunas !== false} />;
    case 'maguey': return <Maguey x={x} y={yy} s={s} f={f} />;
    case 'tule': return <Tule x={x} y={yy} s={s} f={f} />;
    case 'ahuehuete': case 'arbol': case 'olivo': case 'cipres': case 'pino': return <Ahuehuete x={x} y={yy} s={s} f={f} />;
    case 'encino': return <Encino x={x} y={yy} s={s} f={f} />;
    case 'ceiba': case 'palmera': return <Ceiba x={x} y={yy} s={s} f={f} />;
    case 'maiz_codice': case 'maiz': return <MaizCodice x={x} y={yy} s={s} f={f} />;
    case 'sol_codice': case 'sol': return <SolCodice x={x} y={y ?? 240} r={60 * s} f={f} medio={b('medio')} cara={props.cara !== false} luz={(props.luz as number) ?? 1} />;
    case 'luna_codice': case 'luna': return <LunaCodice x={x} y={y ?? 240} r={54 * s} conejo={b('conejo')} luz={(props.luz as number) ?? 1} />;
    case 'estrellas_codice': case 'estrellas': return <CampoEstrellas f={f} n={(props.n as number) ?? 24} area={[x - 900, y ?? 160, 1800, 320]} r={8 * s} />;
    case 'nube_codice': case 'nube': return <NubeCodice x={x} y={y ?? 300} s={s} f={f} oscura={b('oscura')} />;
    case 'hoguera': return <Hoguera x={x} y={yy} s={s} f={f} brasas={b('brasas')} />;
    case 'espejo': return <EspejoGrande x={x} y={y ?? SUELO - 120} s={s} f={f} />;
    case 'huesos': return <Huesos x={x} y={yy} s={s} f={f} brillo={b('brillo')} />;
    case 'caracol': return <CaracolEl x={x} y={yy} s={s} />;
    case 'acalli': case 'barco': case 'canoa': return <Acalli x={x} y={y ?? SUELO - 20} s={s} f={f} />;
    case 'chinampa': return <Chinampa x={x} y={yy} s={s} f={f} />;
    case 'remolino': return <Remolino x={x} y={yy} s={s} f={f} />;
    case 'calendario': return <Calendario x={x} y={y ?? SUELO - 220} s={s} f={f} />;
    case 'chicomoztoc': case 'cueva': return <Chicomoztoc x={x} y={yy} s={s} />;
    case 'tetl': case 'roca': return <Tetl x={x} y={yy} s={s} color={props.color as string} />;
    case 'lluvia_fuego': return <LluviaFuego x={x} f={f} n={(props.n as number) ?? 28} />;
    case 'tronco': return <Tronco x={x} y={yy} s={s} f={f} flota={b('flota')} />;
    case 'pozo': return <Pozo x={x} y={y ?? SUELO + 4} s={s} />;
    case 'cajete': return <Cajete x={x} y={yy} s={s} f={f} brillo={b('brillo')} />;
    case 'tonacatepetl': return <Tonacatepetl x={x} y={yy} s={s} f={f} abierto={b('abierto')} />;
    case 'pluma_bola': return <PlumaBola x={x} y={y ?? 400} s={s} f={f} />;
    case 'via_lactea': return <ViaLactea x={x} y={y ?? 360} s={s} f={f} />;
    case 'momoztli': case 'altar': return <Momoztli x={x} y={yy} s={s} f={f} fuego={props.fuego !== false} />;
    case 'icpalli': case 'trono': return <Icpalli x={x} y={yy} s={s} />;
    case 'jacal': return <Jacal x={x} y={yy} s={s} />;
    case 'casa_mexica': case 'casa': return <CasaMexica x={x} y={yy} s={s} />;
    case 'cielo_bajo': return <g transform={`translate(${r1(x)} ${r1(y ?? 170)}) scale(${s})`}><rect x={-1400} y={-400} width={2800} height={400} fill="#26385F" /><g transform="translate(-1400 0)"><FranjaCodice y={-10} alto={44} desplaz={0} tipo="estrellas" ancho={2800} /></g></g>;
    default: return null;
  }
}
