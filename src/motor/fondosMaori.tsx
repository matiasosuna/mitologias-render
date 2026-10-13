// Piel maorí (tema "kowhaiwhai"): fondos y elementos de Aotearoa y de las tradiciones maoríes — colores planos de
// kōwhaiwhai (rojo kōkōwai, negro, blanco, ocre) con acentos de pāua y pounamu; agua con crestas koru, bosque de
// kauri, ponga y nīkau, pōhutukawa en la costa, wharenui y pātaka en el kāinga, waka y waka hourua. Lugares de la T1:
// Te Pō (la oscuridad entre Rangi y Papa), Te Ao Mārama (el mundo de luz), el bosque, el mar, la costa, la aldea,
// el interior de la casa, Rarohenga (el mundo de abajo), los cielos altos, las montañas, el lago, el mundo de fuego
// de Mahuika, la noche estrellada, el pozo del sol, Hawaiki y Aotearoa.
// Todo es genérico y dibujado por código: los paneles tallados no copian ninguna talla real ni ningún tā moko.
import React from 'react';
import { Capa, SUELO, Fuego, suave, azar, miembro } from '../comun/vasija';
import { W, SueloMaori, FranjaMaori, DegradePaua } from '../comun/kowhaiwhai';
import type { Cielo } from './fondos';

const r1 = (v: number) => v.toFixed(1);
const NEGRO = W.negro;

/** Fondos del tema y su cielo (lo usa Escena para el degradé). */
export const CIELO_MAORI: Record<string, Cielo> = {
  te_po: 'inframundo', te_ao_marama: 'barro', ngahere: 'barro', moana: 'mar', takutai: 'mar', kainga: 'barro', whare_dentro: 'noche',
  rarohenga: 'inframundo', rangi_tuhaha: 'barro', maunga: 'barro', roto: 'mar', ahi_mahuika: 'inframundo', po_whetu: 'noche', rua_ra: 'noche',
  hawaiki: 'mar', aotearoa: 'mar',
};
export const FONDOS_MAORI = ['te_po', 'te_ao_marama', 'ngahere', 'moana', 'takutai', 'kainga', 'whare_dentro', 'rarohenga', 'rangi_tuhaha', 'maunga', 'roto', 'ahi_mahuika', 'po_whetu', 'rua_ra', 'hawaiki', 'aotearoa'];
export const ELEMENTOS_MAORI = ['ra', 'marama', 'whetu', 'matariki', 'kapua', 'maunga_el', 'kauri', 'ponga', 'nikau', 'pohutukawa', 'totara', 'rakau', 'harakeke', 'wharenui', 'pataka', 'whare', 'palisada', 'waka', 'waka_hourua', 'matau', 'kauae', 'te_ika', 'toko', 'ranginui_cielo', 'papatuanuku_tierra', 'aka', 'kete', 'mara_kumara', 'rarauhe', 'poupou', 'tukutuku', 'puna', 'rua', 'ahi', 'korakora', 'toka', 'motu', 'rua_ra_el', 'ngawha', 'ana', 'taura'];

// ---------- cielo ----------
/** Sol (Tama-nui-te-rā): disco ocre con aro rojo y rayos que terminan en koru; cara opcional; atado = sogas de lino hacia el suelo. */
export const Ra: React.FC<{ x: number; y: number; r?: number; f: number; cara?: boolean; luz?: number; atado?: boolean; enojado?: boolean }> = ({ x, y, r = 60, f, cara = true, luz = 1, atado, enojado }) => {
  const sogas: [number, number][] = [[-520, SUELO - y], [-200, SUELO - y + 10], [240, SUELO - y + 10], [560, SUELO - y]];
  return (
    <g transform={`translate(${r1(x)} ${r1(y)})`}>
      <circle r={r * 3.2} fill="url(#halo)" opacity={0.55 * luz} />
      {atado && sogas.map(([dx, dy], i) => <g key={i}>
        <path d={`M0 0 Q ${r1(dx * 0.5)} ${r1(dy * 0.45 + Math.sin(f / 4 + i) * 6)} ${dx} ${dy}`} stroke={NEGRO} strokeWidth={9} fill="none" />
        <path d={`M0 0 Q ${r1(dx * 0.5)} ${r1(dy * 0.45 + Math.sin(f / 4 + i) * 6)} ${dx} ${dy}`} stroke={W.harakeke} strokeWidth={6} fill="none" strokeDasharray="7 4" />
      </g>)}
      <g transform={`rotate(${r1(f * 0.15)})`}>
        {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30})`}>
          <path d={`M0 ${-r * 1.02} L 0 ${-r * 1.42} c 0 ${-r * 0.2}, ${r * 0.24} ${-r * 0.24}, ${r * 0.24} ${-r * 0.06} c 0 ${r * 0.1}, ${-r * 0.12} ${r * 0.1}, ${-r * 0.1} 0`} stroke={NEGRO} strokeWidth={r * 0.13} fill="none" strokeLinecap="round" />
          <path d={`M0 ${-r * 1.02} L 0 ${-r * 1.42} c 0 ${-r * 0.2}, ${r * 0.24} ${-r * 0.24}, ${r * 0.24} ${-r * 0.06} c 0 ${r * 0.1}, ${-r * 0.12} ${r * 0.1}, ${-r * 0.1} 0`} stroke={i % 2 ? W.rojo : '#F2B33D'} strokeWidth={r * 0.08} fill="none" strokeLinecap="round" />
        </g>)}
      </g>
      <circle r={r} fill="#F2B33D" stroke={NEGRO} strokeWidth={3} />
      <circle r={r * 0.82} fill="none" stroke={W.rojo} strokeWidth={r * 0.09} />
      {cara && <g>
        <path d={enojado ? `M${-r * 0.44} ${-r * 0.24} l ${r * 0.28} ${r * 0.1} M${r * 0.44} ${-r * 0.24} l ${-r * 0.28} ${r * 0.1}` : `M${-r * 0.42} ${-r * 0.12} q ${r * 0.14} ${-r * 0.14} ${r * 0.28} 0 M${r * 0.14} ${-r * 0.12} q ${r * 0.14} ${-r * 0.14} ${r * 0.28} 0`} stroke={NEGRO} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
        {enojado && <><circle cx={-r * 0.28} cy={-r * 0.02} r={r * 0.07} fill={NEGRO} /><circle cx={r * 0.28} cy={-r * 0.02} r={r * 0.07} fill={NEGRO} /></>}
        <path d={enojado ? `M${-r * 0.2} ${r * 0.36} q ${r * 0.2} ${-r * 0.14} ${r * 0.4} 0` : `M${-r * 0.22} ${r * 0.28} q ${r * 0.22} ${r * 0.16} ${r * 0.44} 0`} stroke={NEGRO} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
      </g>}
    </g>
  );
};
/** Luna (Marama): disco pálido con manchas suaves. */
const Marama: React.FC<{ x: number; y: number; r?: number; luz?: number }> = ({ x, y, r = 50, luz = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`}>
    <circle r={r * 2.4} fill="url(#haloBlanco)" opacity={0.45 * luz} />
    <circle r={r} fill="#EEF0E4" stroke={NEGRO} strokeWidth={3} />
    {[[-0.3, -0.2, 0.22], [0.25, 0.1, 0.16], [-0.05, 0.4, 0.12]].map(([a, b, c], i) => <circle key={i} cx={a * r} cy={b * r} r={c * r} fill="#C9CCC0" />)}
  </g>
);
/** Estrella de cuatro puntas que titila. */
const Estrella: React.FC<{ x: number; y: number; r: number; f: number; i: number }> = ({ x, y, r, f, i }) => (
  <path transform={`translate(${r1(x)} ${r1(y)}) scale(${r1(0.8 + Math.sin(f / 9 + i) * 0.2)})`} d={`M0 ${-r} Q ${r * 0.18} ${-r * 0.18} ${r} 0 Q ${r * 0.18} ${r * 0.18} 0 ${r} Q ${-r * 0.18} ${r * 0.18} ${-r} 0 Q ${-r * 0.18} ${-r * 0.18} 0 ${-r} Z`} fill="#FFF8E6" opacity={0.9} />
);
const CampoWhetu: React.FC<{ f: number; n?: number; area?: [number, number, number, number]; seed?: number; r?: number }> = ({ f, n = 40, area = [-200, 140, 2400, 360], seed = 5, r = 7 }) => (
  <g>{Array.from({ length: n }, (_, i) => <Estrella key={i} x={area[0] + azar(i * 3 + seed) * area[2]} y={area[1] + azar(i * 7 + seed) * area[3]} r={r * (0.5 + azar(i + seed) * 0.8)} f={f} i={i} />)}</g>
);
/** Matariki: el cúmulo de estrellas (las Pléyades). */
const Matariki: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <circle r={90} fill="url(#haloBlanco)" opacity={0.35} />
    {[[0, 0, 11], [-34, 14, 8], [30, 18, 9], [-12, -30, 7], [20, -22, 7], [-46, -12, 6], [44, -6, 6], [8, 38, 6], [-24, 40, 5]].map(([a, b, c], i) => <Estrella key={i} x={a} y={b} r={c} f={f} i={i} />)}
  </g>
);
/** Nube con volutas koru; larga = la "larga nube blanca" (Aotearoa). */
export const Kapua: React.FC<{ x: number; y: number; s?: number; f?: number; oscura?: boolean; larga?: boolean }> = ({ x, y, s = 1, f = 0, oscura, larga }) => (
  <g transform={`translate(${r1(x + Math.sin(f / 70 + x) * 12)} ${r1(y)}) scale(${r1(s * (larga ? 3.2 : 1))} ${r1(s * (larga ? 0.8 : 1))})`}>
    <path d="M-120 18 C -136 -4, -110 -30, -82 -22 C -76 -50, -36 -58, -14 -38 C 0 -62, 48 -60, 56 -30 C 84 -40, 122 -16, 104 14 C 98 26, -112 30, -120 18 Z" fill={oscura ? '#56607A' : W.blanco} stroke={NEGRO} strokeWidth={larga ? 1.4 : 2.4} />
    {[[-70, -6], [-10, -22], [52, -8]].map(([cx, cy], i) => <path key={i} d={`M${cx} ${cy} c 0 -10, 14 -12, 16 -2 c 1 6, -6 8, -8 4`} stroke={oscura ? '#3A4256' : W.pauaClaro} strokeWidth={larga ? 1.4 : 2.4} fill="none" />)}
  </g>
);

// ---------- tierra y agua ----------
/** Agua: azul verdoso con crestas en voluta koru blancas y destellos de pāua. */
export const Wai: React.FC<{ y: number; f: number; oscura?: boolean; desde?: number; hasta?: number }> = ({ y, f, oscura, desde: x0 = -1800, hasta = 6400 }) => {
  const filas = Math.ceil((1100 - y) / 44);
  const base = oscura ? '#174656' : '#2A8590', claro = oscura ? '#4F8A96' : '#CFEDE6';
  return (
    <g>
      <rect x={x0} y={y} width={hasta - x0} height={1300 - y} fill={base} />
      <path d={`M${x0} ${y} H ${hasta}`} stroke={NEGRO} strokeWidth={3} />
      {Array.from({ length: filas }, (_, r) => {
        const yy = y + 16 + r * 44, paso = 130 + r * 18, des = (f * (0.45 + r * 0.12)) % paso;
        return <g key={r} transform={`translate(${r1(-des + (r % 2) * paso * 0.5)} 0)`}>
          {Array.from({ length: Math.ceil((hasta - x0) / paso) + 2 }, (_, i) => { const cx = x0 + i * paso; return <g key={i}>
            <path d={`M${cx - 20} ${yy + 10} C ${cx - 6} ${yy - 6}, ${cx + 26} ${yy - 12}, ${cx + 34} ${yy + 2} c 3 8, -8 12, -13 5 c -3 -4, 1 -8, 5 -5`} stroke={claro} strokeWidth={3.6} fill="none" strokeLinecap="round" />
            {(i + r) % 4 === 0 && <ellipse cx={cx + 70} cy={yy + 4} rx={8} ry={4} fill={W.pauaClaro} opacity={0.7} />}
          </g>; })}
        </g>;
      })}
    </g>
  );
};
/** Montaña volcánica (cono con nieve), humo opcional. */
const Maunga: React.FC<{ x: number; y?: number; s?: number; f: number; humo?: boolean; color?: string; nieve?: boolean }> = ({ x, y = SUELO, s = 1, f, humo, color = '#5E6676', nieve = true }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {humo && [0, 1, 2].map((k) => { const t = ((f * 0.35 + k * 40) % 120) / 120; return <circle key={k} cx={Math.sin(t * 3 + k) * 20 + t * 70} cy={-430 - t * 170} r={24 + t * 42} fill="#D9D4CB" stroke={NEGRO} strokeWidth={2} opacity={0.85 - t * 0.7} />; })}
    <path d="M-400 0 L -50 -420 L 40 -424 L 400 0 Z" fill={color} stroke={NEGRO} strokeWidth={3} />
    <path d="M-280 0 L -50 -420 L -20 -300 L -120 0 Z" fill="#000" opacity={0.12} />
    {nieve && <path d="M-50 -420 L 40 -424 L 120 -330 L 80 -300 L 44 -336 L 4 -292 L -36 -338 L -76 -302 L -128 -326 Z" fill={W.blanco} stroke={NEGRO} strokeWidth={2.4} />}
  </g>
);
/** Cordillera lejana. */
const Cordillera: React.FC<{ color?: string; y?: number; seed?: number; nieve?: boolean }> = ({ color = '#8E9AA8', y = SUELO, seed = 1, nieve = true }) => (
  <g>
    <path d={`M-700 ${y} ` + Array.from({ length: 18 }, (_, i) => `L ${-700 + i * 240 + 120} ${r1(y - 150 - azar(i + seed) * 160)} L ${-700 + (i + 1) * 240} ${r1(y - 60 - azar(i * 2 + seed) * 50)}`).join(' ') + ` L 3700 ${y} Z`} fill={color} stroke={NEGRO} strokeWidth={2} opacity={0.9} />
    {nieve && Array.from({ length: 18 }, (_, i) => { const px = -700 + i * 240 + 120, py = y - 150 - azar(i + seed) * 160; return <path key={i} d={`M${r1(px)} ${r1(py)} l -34 40 l 14 -4 l 20 14 l 18 -16 l 16 6 Z`} fill={W.blanco} opacity={0.9} />; })}
  </g>
);
/** Lomas verdes. */
const Puke: React.FC<{ y?: number; color?: string; seed?: number; alto?: number }> = ({ y = SUELO, color = '#6E9A4E', seed = 2, alto = 120 }) => (
  <path d={`M-900 ${y} ` + Array.from({ length: 14 }, (_, i) => `Q ${-900 + i * 360 + 180} ${r1(y - alto - azar(i + seed) * alto)} ${-900 + (i + 1) * 360} ${r1(y - 10)}`).join(' ') + ` L 4200 ${y + 20} L -900 ${y + 20} Z`} fill={color} stroke={NEGRO} strokeWidth={2.4} />
);

// ---------- plantas ----------
const Kauri: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s}) rotate(${r1(Math.sin(f / 50 + x) * 0.6)})`}>
    <path d="M-34 0 C -30 -200, -26 -380, -22 -520 L 22 -520 C 26 -380, 30 -200, 34 0 Z" fill="#8C8A80" stroke={NEGRO} strokeWidth={2.6} />
    {[-140, -300, -440].map((py, i) => <path key={i} d={`M-26 ${py} q 8 6 0 12 M14 ${py - 40} q 8 6 0 12`} stroke="#5E5C54" strokeWidth={2} fill="none" />)}
    <path d="M-20 -500 C -80 -540, -130 -560, -170 -600 M20 -500 C 80 -560, 140 -570, 180 -610 M0 -520 L 0 -640" stroke="#6E6A60" strokeWidth={12} fill="none" strokeLinecap="round" />
    {[[-170, -620, 70], [-90, -660, 80], [0, -690, 86], [90, -660, 80], [180, -630, 70], [-30, -610, 60], [60, -605, 60]].map(([cx, cy, r], i) => <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.62} fill={i % 2 ? '#2F5A34' : '#3A6E3E'} stroke={NEGRO} strokeWidth={2.4} />)}
  </g>
);
const Ponga: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => {
  const m = Math.sin(f / 30 + x) * 3;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <path d="M-12 0 C -10 -100, -14 -200, -8 -300 L 8 -300 C 12 -200, 10 -100, 12 0 Z" fill="#4A3324" stroke={NEGRO} strokeWidth={2.2} />
      {[-60, -130, -200, -260].map((py) => <path key={py} d={`M-10 ${py} h 20`} stroke="#2A1A12" strokeWidth={3} />)}
      {Array.from({ length: 9 }, (_, i) => {
        const a = -160 + i * 40 + m, rr = (a * Math.PI) / 180, l = 170 - Math.abs(i - 4) * 10;
        const ex = Math.cos(rr) * l, ey = -300 + Math.sin(rr) * l * 0.5 + (Math.abs(Math.cos(rr)) * 60);
        return <g key={i}>
          <path d={`M0 -300 Q ${r1(ex * 0.5)} ${r1(-300 - 70 + Math.abs(ex) * 0.05)} ${r1(ex)} ${r1(ey)}`} stroke={NEGRO} strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d={`M0 -300 Q ${r1(ex * 0.5)} ${r1(-300 - 70 + Math.abs(ex) * 0.05)} ${r1(ex)} ${r1(ey)}`} stroke={i % 2 ? W.helecho : '#5E8E46'} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray="3 2" />
        </g>;
      })}
      <path d="M0 -300 c 0 -30, 22 -36, 26 -20 c 2 10, -10 14, -12 6" stroke={W.helechoOsc} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );
};
const Nikau: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => {
  const m = Math.sin(f / 26 + x) * 4;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <path d="M-10 0 C -12 -120, -6 -240, -6 -320 L 6 -320 C 6 -240, 12 -120, 10 0 Z" fill="#8A8C70" stroke={NEGRO} strokeWidth={2} />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M-8 ${-30 - i * 29} h 16`} stroke="#5E604A" strokeWidth={2} />)}
      <path d="M-14 -320 C -16 -360, 16 -360, 14 -320 Z" fill="#7BA05A" stroke={NEGRO} strokeWidth={2} />
      {[-1, 1].flatMap((k) => [0, 1, 2].map((j) => <path key={`${k}${j}`} d={`M0 -358 C ${k * (40 + j * 20)} ${-430 + j * 30 + m}, ${k * (100 + j * 40)} ${-400 + j * 50 + m}, ${k * (130 + j * 40)} ${-330 + j * 60}`} stroke={j === 1 ? '#3E6E3A' : W.helecho} strokeWidth={14 - j * 2} fill="none" strokeLinecap="round" strokeDasharray="5 2" />))}
      <path d={`M0 -358 L ${m} -470`} stroke={W.helecho} strokeWidth={12} strokeLinecap="round" strokeDasharray="5 2" />
    </g>
  );
};
const Pohutukawa: React.FC<{ x: number; y?: number; s?: number; f?: number; flores?: boolean }> = ({ x, y = SUELO, s = 1, f = 0, flores = true }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-30 0 C -40 -60, -10 -100, -40 -170 M10 0 C 20 -70, 0 -110, 40 -180 M-20 -90 C 30 -120, 60 -150, 110 -170 M-30 -120 C -80 -140, -110 -160, -140 -160" stroke="#5A3A2A" strokeWidth={22} fill="none" strokeLinecap="round" />
    {[[-150, -190, 70], [-60, -230, 90], [40, -240, 90], [130, -200, 70], [-10, -180, 70]].map(([cx, cy, r], i) => <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.7} fill={i % 2 ? '#2E5A36' : '#3A6A40'} stroke={NEGRO} strokeWidth={2.4} />)}
    {flores && Array.from({ length: 26 }, (_, i) => <circle key={i} cx={-200 + azar(i * 3 + 1) * 380} cy={-290 + azar(i * 5 + 2) * 150} r={7 + azar(i) * 4} fill={W.rojo} stroke={NEGRO} strokeWidth={1} />)}
  </g>
);
const Totara: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s}) rotate(${r1(Math.sin(f / 45 + x) * 0.6)})`}>
    <path d="M-28 0 C -24 -150, -20 -300, -14 -420 L 14 -420 C 20 -300, 24 -150, 28 0 Z" fill="#7A4A30" stroke={NEGRO} strokeWidth={2.4} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-16 + (i % 3) * 12} ${-30 - i * 48} l 4 -30`} stroke="#4A2A18" strokeWidth={2} />)}
    <path d="M0 -620 C 50 -560, 110 -460, 120 -330 C 60 -300, -60 -300, -120 -330 C -110 -460, -50 -560, 0 -620 Z" fill="#2F5432" stroke={NEGRO} strokeWidth={2.6} />
    {[-480, -420, -370].map((py, i) => <path key={i} d={`M${-60 + i * 10} ${py} q 60 18 ${120 - i * 20} 0`} stroke="#1F3A22" strokeWidth={3} fill="none" />)}
  </g>
);
const Rakau: React.FC<{ x: number; y?: number; s?: number; f?: number; color?: string }> = ({ x, y = SUELO, s = 1, f = 0, color = '#3E6E3E' }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s}) rotate(${r1(Math.sin(f / 40 + x) * 1)})`}>
    <path d="M-16 0 C -14 -80, -20 -140, -30 -200 M14 0 C 12 -80, 20 -140, 34 -200 M0 -120 L 0 -230" stroke="#5A3A26" strokeWidth={20} fill="none" strokeLinecap="round" />
    {[[-70, -230, 70], [10, -280, 84], [80, -230, 66], [0, -210, 60]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? color : '#4E7E46'} stroke={NEGRO} strokeWidth={2.4} />)}
  </g>
);
const Harakeke: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => {
  const m = Math.sin(f / 24 + x) * 3;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      {[-1, 1].map((k) => <g key={k}><path d={`M${k * 10} 0 C ${k * 14} -100, ${k * 20 + m} -180, ${k * 26 + m} -250`} stroke="#5A3A26" strokeWidth={4} fill="none" />{[0, 1, 2].map((j) => <ellipse key={j} cx={k * 22 + m} cy={-190 - j * 22} rx={6} ry={10} fill={W.rojoOsc} stroke={NEGRO} strokeWidth={1} />)}</g>)}
      {Array.from({ length: 9 }, (_, i) => { const a = -60 + i * 15; const rr = (a * Math.PI) / 180; return <path key={i} d={`M${(i - 4) * 4} 0 Q ${r1(Math.sin(rr) * 70)} ${r1(-80)} ${r1(Math.sin(rr) * 120 + m)} ${r1(-150 + Math.abs(i - 4) * 10)} L ${r1(Math.sin(rr) * 120 + m + 4)} ${r1(-146 + Math.abs(i - 4) * 10)} Q ${r1(Math.sin(rr) * 70 + 8)} ${r1(-78)} ${(i - 4) * 4 + 8} 0 Z`} fill={i % 2 ? W.helecho : '#3E6A34'} stroke={NEGRO} strokeWidth={1.4} />; })}
    </g>
  );
};
const Rarauhe: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {Array.from({ length: 6 }, (_, i) => { const dx = -90 + i * 36, h = 90 + (i % 3) * 20, m = Math.sin(f / 20 + i) * 4; return <g key={i}><path d={`M${dx} 0 Q ${dx + 6} ${-h * 0.6} ${dx + 30 + m} ${-h}`} stroke="#6A5A2A" strokeWidth={3} fill="none" />{[0.35, 0.55, 0.75].map((t, j) => <path key={j} d={`M${r1(dx + 6 + t * 24)} ${r1(-h * t)} l -24 6 M${r1(dx + 6 + t * 24)} ${r1(-h * t)} l 18 -16`} stroke="#7A8A3A" strokeWidth={5} strokeLinecap="round" />)}</g>; })}
  </g>
);
const MaraKumara: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${-250 + i * 100} 0)`}>
      <path d="M-40 0 C -36 -34, 36 -34, 40 0 Z" fill="#7A4A2A" stroke={NEGRO} strokeWidth={2} />
      {[[-14, -30], [8, -36], [24, -24]].map(([lx, ly], j) => <path key={j} d={`M0 -24 L ${lx} ${ly} c -10 -10, 4 -24, 12 -12 c 6 8, -4 14, -12 12`} fill={W.helecho} stroke={NEGRO} strokeWidth={1.2} />)}
    </g>)}
  </g>
);

// ---------- edificios y objetos ----------
/** Wharenui (casa de reunión): fachada con maihi rojos, amo, ventana y puerta; máscara del gablete genérica. */
const Wharenui: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => {
  const idP = `pauaW${Math.round(x)}`;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <DegradePaua id={idP} />
      <path d="M-240 0 L -240 -200 L 0 -320 L 240 -200 L 240 0 Z" fill="#4A2A1A" stroke={NEGRO} strokeWidth={3} />
      <path d="M-200 0 L -200 -190 L 0 -290 L 200 -190 L 200 0 Z" fill="#2A1810" />
      <rect x={-150} y={-150} width={66} height={150} fill={NEGRO} stroke={W.rojo} strokeWidth={6} />
      <rect x={50} y={-160} width={90} height={62} fill={NEGRO} stroke={W.rojo} strokeWidth={6} />
      {[-40, 0, 40].map((dx) => <rect key={dx} x={dx - 12} y={-250 + Math.abs(dx) * 0.4} width={24} height={250 - Math.abs(dx) * 0.4} fill="none" />)}
      <g>{[-1, 1].map((k) => <g key={k}>
        <path d={`M0 -352 L ${k * 290} -186 L ${k * 290} -150 L 0 -316 Z`} fill={W.rojo} stroke={NEGRO} strokeWidth={3} />
        <path d={`M0 -334 L ${k * 284} -170`} stroke={W.blanco} strokeWidth={2.5} strokeDasharray="14 8" />
        <path d={`M${k * 290} -186 c ${k * 20} 0, ${k * 30} 20, ${k * 18} 34 c ${-k * 10} 10, ${-k * 22} 0, ${-k * 14} -12`} stroke={W.rojo} strokeWidth={8} fill="none" />
        <rect x={k * 250 - 20} y={-200} width={40} height={200} fill={W.rojo} stroke={NEGRO} strokeWidth={3} />
        {[-160, -110, -60].map((py) => <path key={py} d={`M${k * 250 - 12} ${py} c 6 -16, 24 -16, 24 0 c 0 10, -14 12, -14 4`} stroke={W.blanco} strokeWidth={2.2} fill="none" />)}
        <ellipse cx={k * 250} cy={-186} rx={8} ry={5} fill={`url(#${idP})`} stroke={NEGRO} strokeWidth={1.2} />
      </g>)}</g>
      <g transform="translate(0 -350)">
        <path d="M-34 6 C -40 -40, 40 -40, 34 6 C 24 30, -24 30, -34 6 Z" fill={W.rojo} stroke={NEGRO} strokeWidth={3} />
        <ellipse cx={-14} cy={-6} rx={9} ry={6} fill={`url(#${idP})`} stroke={W.blanco} strokeWidth={2} />
        <ellipse cx={14} cy={-6} rx={9} ry={6} fill={`url(#${idP})`} stroke={W.blanco} strokeWidth={2} />
        <path d="M-12 14 q 12 8 24 0" stroke={W.blanco} strokeWidth={2.4} fill="none" />
      </g>
      <rect x={-250} y={-10} width={500} height={14} fill={W.rojoOsc} stroke={NEGRO} strokeWidth={2} />
    </g>
  );
};
const Pataka: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-14} y={-130} width={28} height={130} fill={W.rojo} stroke={NEGRO} strokeWidth={2.4} />
    <path d="M-90 -130 L -90 -230 L 0 -290 L 90 -230 L 90 -130 Z" fill="#5A3420" stroke={NEGRO} strokeWidth={2.6} />
    {[-1, 1].map((k) => <path key={k} d={`M0 -306 L ${k * 108} -228 L ${k * 108} -210 L 0 -288 Z`} fill={W.rojo} stroke={NEGRO} strokeWidth={2.4} />)}
    <rect x={-24} y={-200} width={48} height={50} fill={NEGRO} stroke={W.rojo} strokeWidth={4} />
    <path d="M-90 -130 H 90" stroke={W.rojoOsc} strokeWidth={8} />
  </g>
);
const Whare: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-110 0 L -110 -90 L 110 -90 L 110 0 Z" fill="#B89A5C" stroke={NEGRO} strokeWidth={2.4} />
    {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${-100 + i * 20} -4 V -86`} stroke="#8A7240" strokeWidth={2} />)}
    <path d="M-140 -80 L 0 -190 L 140 -80 Z" fill="#7A6438" stroke={NEGRO} strokeWidth={2.6} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-120 + i * 34} -86 L ${-10 + i * 4} -180`} stroke="#5A4A28" strokeWidth={1.6} />)}
    <rect x={-26} y={-70} width={46} height={70} fill="#2A1810" stroke={NEGRO} strokeWidth={2} />
  </g>
);
const Palisada: React.FC<{ x: number; y?: number; s?: number; ancho?: number }> = ({ x, y = SUELO, s = 1, ancho = 900 }) => {
  const n = Math.round(ancho / 34);
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <path d={`M${-ancho / 2} -150 H ${ancho / 2} M${-ancho / 2} -60 H ${ancho / 2}`} stroke="#5A3A22" strokeWidth={8} />
      {Array.from({ length: n }, (_, i) => { const px = -ancho / 2 + i * 34, alto = i % 6 === 0 ? 300 : 200 + azar(i) * 30; return <g key={i}>
        <path d={`M${px - 10} 0 V ${-alto + 14} L ${px} ${-alto} L ${px + 10} ${-alto + 14} V 0 Z`} fill={i % 6 === 0 ? W.rojo : '#7A5636'} stroke={NEGRO} strokeWidth={2} />
        {i % 6 === 0 && <circle cx={px} cy={-alto - 12} r={14} fill={W.rojo} stroke={NEGRO} strokeWidth={2} />}
      </g>; })}
    </g>
  );
};
/** Waka (canoa de guerra): casco rojo con franja negra y blanca, proa tallada (tauihu) y popa alta (taurapa). Origen = línea del agua. */
export const Waka: React.FC<{ x: number; y?: number; s?: number; f: number; espejo?: boolean; quieta?: boolean }> = ({ x, y = SUELO - 20, s = 1, f, espejo, quieta }) => {
  const b = quieta ? 0 : Math.sin(f / 14) * 3;
  return (
    <g transform={`translate(${r1(x)} ${r1(y + b)}) scale(${espejo ? -s : s} ${s}) rotate(${r1(quieta ? 0 : Math.sin(f / 18) * 1.2)})`}>
      <path d="M-330 -34 L 300 -34 C 330 -30, 344 -14, 340 6 C 200 30, -200 30, -320 8 C -334 -6, -336 -24, -330 -34 Z" fill={W.rojo} stroke={NEGRO} strokeWidth={3} />
      <path d="M-320 -16 L 330 -16" stroke={NEGRO} strokeWidth={8} />
      <path d="M-316 -16 L 326 -16" stroke={W.blanco} strokeWidth={2.4} strokeDasharray="10 8" />
      <path d="M-300 -34 L 290 -34" stroke={NEGRO} strokeWidth={5} />
      {/* proa (tauihu) */}
      <g transform="translate(330 -30)">
        <path d="M0 0 C 30 -6, 60 -30, 62 -60 C 66 -80, 44 -86, 36 -72 C 28 -58, 44 -48, 50 -58" stroke={NEGRO} strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d="M0 0 C 30 -6, 60 -30, 62 -60 C 66 -80, 44 -86, 36 -72 C 28 -58, 44 -48, 50 -58" stroke={W.rojo} strokeWidth={9} fill="none" strokeLinecap="round" />
        <circle cx={22} cy={-18} r={6} fill={W.paua} stroke={W.blanco} strokeWidth={1.6} />
      </g>
      {/* popa (taurapa) */}
      <g transform="translate(-322 -30)">
        <path d="M0 0 C -20 -40, -24 -110, -8 -170 C 0 -190, 18 -186, 14 -168 C 4 -120, 8 -60, 22 -20 Z" fill={W.rojo} stroke={NEGRO} strokeWidth={3} />
        {[-50, -90, -130].map((py) => <path key={py} d={`M-8 ${py} c 6 -12, 20 -10, 18 2 c -2 8, -12 6, -10 -1`} stroke={W.blanco} strokeWidth={2} fill="none" />)}
        <path d={`M2 -176 C -20 -200, -40 ${-190 + Math.sin(f / 8) * 8}, -60 ${-176 + Math.sin(f / 8) * 10}`} stroke={NEGRO} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};
/** Waka hourua (canoa doble de viaje) con vela de pinza de cangrejo. */
const WakaHourua: React.FC<{ x: number; y?: number; s?: number; f: number; espejo?: boolean }> = ({ x, y = SUELO - 20, s = 1, f, espejo }) => {
  const b = Math.sin(f / 16) * 3, v = Math.sin(f / 20) * 4;
  return (
    <g transform={`translate(${r1(x)} ${r1(y + b)}) scale(${espejo ? -s : s} ${s})`}>
      <g transform="translate(-30 -18) scale(0.92)" opacity={0.85}><path d="M-300 -30 L 290 -30 C 320 -24, 330 -8, 320 8 C 180 24, -200 24, -300 6 Z" fill={W.rojoOsc} stroke={NEGRO} strokeWidth={3} /></g>
      <rect x={-250} y={-74} width={480} height={14} fill="#8A6A3A" stroke={NEGRO} strokeWidth={2} />
      {[-200, -60, 80, 200].map((px) => <path key={px} d={`M${px} -60 V -30`} stroke="#5A3A22" strokeWidth={6} />)}
      <path d="M-300 -30 L 290 -30 C 320 -24, 330 -8, 320 8 C 180 24, -200 24, -300 6 Z" fill={W.rojo} stroke={NEGRO} strokeWidth={3} />
      <path d="M-290 -12 L 316 -12" stroke={W.blanco} strokeWidth={2.4} strokeDasharray="10 8" />
      <path d="M-120 -74 L -100 -88 L -60 -88 L -40 -74 Z" fill="#B89A5C" stroke={NEGRO} strokeWidth={2} />
      <path d="M20 -74 L 40 -400" stroke="#5A3A22" strokeWidth={8} />
      <path d={`M24 -110 C ${80 + v} -200, ${150 + v} -330, ${160 + v} -440 C ${110 + v} -390, ${70} -350, 40 -400 Z`} fill="#D9B46A" stroke={NEGRO} strokeWidth={3} />
      <path d={`M24 -110 C ${-40 + v} -220, ${-60 + v} -340, ${-50 + v} -430 C ${-10} -390, 20 -380, 40 -400 Z`} fill="#C99A4A" stroke={NEGRO} strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${30 + i * 2} ${-150 - i * 60} q ${50 + v} ${-20} ${100 + i * 6} ${-60 - i * 10}`} stroke="#8A6A3A" strokeWidth={2} fill="none" />)}
      <path d="M38 -400 l 10 -30" stroke={NEGRO} strokeWidth={4} />
    </g>
  );
};
/** Anzuelo mágico de Māui (de la quijada de su abuela): hueso con incrustación de pāua y un mechón. Origen = arriba (donde ata la línea). */
const Matau: React.FC<{ x: number; y?: number; s?: number; f: number; brillo?: boolean; linea?: boolean }> = ({ x, y = 400, s = 1, f, brillo, linea }) => {
  const idP = `pauaM${Math.round(x)}`;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <DegradePaua id={idP} />
      {linea && <path d={`M0 0 L ${r1(Math.sin(f / 20) * 6)} -700`} stroke={W.crema} strokeWidth={2.4} />}
      {brillo && <circle cx={0} cy={70} r={130} fill="url(#halo)" opacity={0.55 + Math.sin(f / 6) * 0.15} />}
      <path d="M-8 0 L 8 0 L 10 110 C 12 150, 60 160, 64 110 L 54 96 L 74 84 C 84 170, -10 190, -12 110 Z" fill={W.crema} stroke={NEGRO} strokeWidth={3} />
      <path d="M-2 20 L 0 100 C 4 136, 46 140, 54 112" stroke={`url(#${idP})`} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M-10 4 h 20 M-10 12 h 20" stroke={W.rojo} strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M-10 ${8 + i * 2} q ${-14 - i * 4} ${12 + Math.sin(f / 7 + i) * 3} ${-10 - i * 6} ${28}`} stroke={W.blanco} strokeWidth={2.4} fill="none" />)}
    </g>
  );
};
/** Quijada encantada de Muri-ranga-whenua. Origen = centro. */
const Kauae: React.FC<{ x: number; y?: number; s?: number; f: number; brillo?: boolean }> = ({ x, y = SUELO - 40, s = 1, f, brillo }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {brillo && <circle r={90} fill="url(#haloBlanco)" opacity={0.6 + Math.sin(f / 5) * 0.2} />}
    <path d="M-44 -16 C -46 26, 46 26, 44 -16 L 32 -16 C 30 12, -30 12, -32 -16 Z" fill={W.crema} stroke={NEGRO} strokeWidth={2.6} />
    {[-24, -12, 0, 12, 24].map((tx) => <path key={tx} d={`M${tx - 4} ${4 + Math.abs(tx) * -0.3} l 4 -10 l 4 10`} fill={W.blanco} stroke={NEGRO} strokeWidth={1.2} />)}
    <path d="M-44 -16 l -6 -18 M44 -16 l 6 -18" stroke={NEGRO} strokeWidth={6} strokeLinecap="round" />
    <path d="M-44 -16 l -6 -18 M44 -16 l 6 -18" stroke={W.crema} strokeWidth={3.4} strokeLinecap="round" />
  </g>
);
/** Te Ika-a-Māui: el pez enorme que sube del mar; tierra (0–1) lo vuelve isla con montes y bosque. Origen = línea del agua, centro. */
const TeIka: React.FC<{ x: number; y?: number; s?: number; f: number; tierra?: number }> = ({ x, y = SUELO - 40, s = 1, f, tierra = 0 }) => {
  const t = Math.max(0, Math.min(1, tierra)), cola = Math.sin(f / 10) * 10 * (1 - t);
  const cuerpo = `M-760 0 C -720 -120, -500 -230, -200 -260 C 120 -280, 420 -230, 600 -140 C 680 -100, 720 -50, 740 0 Z`;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <path d={`M-740 0 L -860 ${-110 + cola} L -830 0 Z`} fill="#4E7A8A" stroke={NEGRO} strokeWidth={3} opacity={1 - t} />
      <path d={cuerpo} fill="#4E7A8A" stroke={NEGRO} strokeWidth={3.4} />
      <path d={cuerpo} fill="#5E8A46" opacity={t} />
      <path d="M-500 -80 C -300 -150, 200 -170, 560 -80" stroke="#8FB8C4" strokeWidth={10} fill="none" opacity={(1 - t) * 0.8} strokeDasharray="30 18" />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-560 + i * 120} ${-120 - Math.sin(i / 9 * Math.PI) * 110} q 30 -20 60 0`} stroke="#2E5A6A" strokeWidth={3} fill="none" opacity={1 - t} />)}
      {t < 0.7 && <g opacity={1 - t / 0.7}><circle cx={560} cy={-120} r={18} fill={W.blanco} stroke={NEGRO} strokeWidth={2.4} /><circle cx={566} cy={-120} r={8} fill={NEGRO} /><path d="M690 -40 C 660 -36, 640 -24, 650 -10" stroke={NEGRO} strokeWidth={4} fill="none" /></g>}
      {t > 0 && <g opacity={t}>
        {[[-420, 120, 150], [-120, 200, 210], [180, 150, 180], [420, 100, 120]].map(([mx, mw, mh], i) => <g key={i}>
          <path d={`M${mx - mw} ${-180 - (i === 1 ? 70 : 20)} L ${mx} ${-180 - mh * t - (i === 1 ? 70 : 20)} L ${mx + mw} ${-180 - (i === 1 ? 70 : 20)} Z`} fill="#6A7280" stroke={NEGRO} strokeWidth={2.4} />
          <path d={`M${mx - mw * 0.28} ${-180 - mh * t * 0.72 - (i === 1 ? 70 : 20)} L ${mx} ${-180 - mh * t - (i === 1 ? 70 : 20)} L ${mx + mw * 0.28} ${-180 - mh * t * 0.72 - (i === 1 ? 70 : 20)} Z`} fill={W.blanco} />
        </g>)}
        {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={-640 + azar(i * 3) * 1240} cy={-40 - azar(i * 7) * 120} r={14 + azar(i) * 10} fill={i % 2 ? '#2F5A34' : '#3A6E3E'} stroke={NEGRO} strokeWidth={1.4} />)}
      </g>}
    </g>
  );
};
/** Ranginui como cielo: cuerpo enorme acostado boca abajo (cabeza a la izquierda, cara hacia abajo), azul noche con
 * estrellas. Origen = centro; y = borde de abajo del cuerpo. brazos = brazos que bajan hacia la Tierra. */
const RanginuiCielo: React.FC<{ x: number; y?: number; s?: number; f: number; lagrimas?: boolean; brazos?: boolean }> = ({ x, y = 300, s = 1, f, lagrimas, brazos }) => {
  const id = `rangi${Math.round(x)}`;
  // Silueta de abajo: pelo, cabeza de perfil mirando hacia abajo (frente, nariz, labios, mentón), pecho, panza, piernas y pies.
  const borde = 'M-1500 10 C -1400 24, -1300 -4, -1200 12 C -1150 20, -1110 0, -1080 -20 C -940 -50, -780 40, -660 70 C -560 92, -470 92, -360 96 C -250 86, -120 76, 0 92 C 140 90, 300 86, 440 100 C 600 96, 760 92, 900 84 C 1040 88, 1140 92, 1200 104 C 1250 100, 1290 96, 1320 70 C 1360 52, 1420 30, 1460 0 C 1480 -14, 1490 -24, 1500 -30';
  // Cara grande de perfil mirando hacia abajo (frente, nariz, labios, mentón), con cuello que entra al cuerpo.
  const cara = 'M-1150 -60 C -1150 -10, -1120 40, -1100 70 C -1090 86, -1076 96, -1062 100 C -1052 104, -1044 106, -1036 108 C -1024 120, -1012 150, -996 186 C -990 196, -978 194, -970 180 C -966 174, -960 174, -954 178 C -948 176, -944 172, -938 170 C -932 176, -928 182, -922 184 C -906 192, -892 196, -880 192 C -860 186, -844 170, -830 150 C -812 126, -790 104, -760 92 C -720 80, -690 74, -660 70 C -700 40, -760 14, -840 0 C -940 -16, -1060 -40, -1150 -60 Z';
  const brazo = (ax: number, k: number) => {
    const l = Math.max(80, Math.min(300, (SUELO - y) / s - 40)), m = Math.sin(f / 18 + k) * 8;
    return <g key={k}>
      <path d={miembro([[ax, 30], [ax + 30 + m, 30 + l * 0.5], [ax + 10 + m, 30 + l]], [54, 40, 30])} fill="#1A2A56" stroke={NEGRO} strokeWidth={3} />
      <ellipse cx={ax + 10 + m} cy={30 + l + 14} rx={20} ry={24} fill="#1A2A56" stroke={NEGRO} strokeWidth={3} />
    </g>;
  };
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0A1228" /><stop offset="100%" stopColor="#2A4280" /></linearGradient></defs>
      {brazos && [brazo(-520, 0), brazo(-300, 1)]}
      <path d={`${borde} L 1500 -1200 L -1500 -1200 Z`} fill={`url(#${id})`} stroke={NEGRO} strokeWidth={4} />
      <path d={borde} stroke={W.pauaClaro} strokeWidth={3} fill="none" opacity={0.45} transform="translate(0 -9)" />
      {/* pelo largo con estrellas, hacia la izquierda */}
      {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={-1450 + azar(i * 3 + 7) * 2900} cy={-24 - azar(i * 5 + 3) * 600} r={1.5 + azar(i) * 3} fill="#FFF8E6" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 12 + i))} />)}
      {/* cabeza: pelo plateado con estrellas, cara más clara, ceja, ojo cerrado, oreja, labios */}
      {[0, 1, 2, 3, 4].map((i) => <path key={`h${i}`} d={`M-1140 ${-40 + i * 14} C -1220 ${-20 + i * 18 + Math.sin(f / 16 + i) * 6}, -1320 ${20 + i * 16}, -1480 ${30 + i * 18 + Math.sin(f / 14 + i) * 8}`} stroke={i % 2 ? '#C9D4F0' : '#8FA4D8'} strokeWidth={14 - i} fill="none" strokeLinecap="round" />)}
      <path d={cara} fill="#3E5FB0" stroke={NEGRO} strokeWidth={4} />
      <path d="M-1090 64 C -1074 76, -1056 82, -1040 84" stroke="#FFF8E6" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M-1072 98 C -1062 110, -1048 112, -1038 106" stroke="#FFF8E6" strokeWidth={4.5} fill="none" strokeLinecap="round" />
      {[0, 1, 2].map((k) => <path key={`c${k}`} d={`M${-1068 + k * 12} ${106 + k * 2} l -2 9`} stroke="#FFF8E6" strokeWidth={2.4} strokeLinecap="round" />)}
      <path d="M-930 178 C -922 170, -914 170, -908 176" stroke={NEGRO} strokeWidth={3} fill="none" />
      <path d="M-860 40 C -880 30, -890 60, -872 70 C -862 74, -856 64, -862 58" stroke={NEGRO} strokeWidth={3} fill="#5A78C0" />
      {[[-1120, -20], [-1180, 10], [-1260, 40], [-1360, 54], [-1420, 70]].map(([cx, cy], i) => <path key={`e${i}`} transform={`translate(${cx} ${cy})`} d="M0 -7 L 1.8 -1.8 L 7 0 L 1.8 1.8 L 0 7 L -1.8 1.8 L -7 0 L -1.8 -1.8 Z" fill="#FFF8E6" />)}
      {lagrimas && Array.from({ length: 18 }, (_, i) => { const t = ((f * 0.9 + i * 23) % 120) / 120, px = i < 4 ? -1050 + i * 8 : -1100 + azar(i * 11) * 2400; return <path key={`l${i}`} d={`M${r1(px)} ${r1(30 + t * 700)} q 5 10 0 16 q -5 -6 0 -16 Z`} fill={W.pauaClaro} opacity={0.85 - t * 0.5} />; })}
    </g>
  );
};
/** Papatūānuku como tierra: cuerpo enorme acostado boca arriba (cabeza a la izquierda, cara hacia arriba), hecho de
 * lomas; verde (0–1) = cuánto bosque la cubre. Origen = centro, en el suelo. */
const PapatuanukuTierra: React.FC<{ x: number; y?: number; s?: number; f: number; verde?: number }> = ({ x, y = SUELO, s = 1, f, verde = 1 }) => {
  const cabeza = 'C -1130 -50, -1115 -80, -1100 -100 C -1092 -120, -1086 -132, -1080 -140 C -1072 -152, -1066 -158, -1060 -160 C -1052 -163, -1046 -163, -1040 -162 C -1032 -166, -1026 -172, -1020 -178 C -1008 -200, -998 -230, -990 -250 C -984 -256, -974 -244, -968 -228 C -962 -230, -956 -234, -950 -234 C -946 -230, -942 -226, -938 -226 C -934 -230, -930 -236, -926 -238 C -914 -244, -900 -252, -890 -248 C -870 -240, -852 -228, -840 -214 C -826 -196, -812 -176, -800 -160 C -780 -142, -760 -132, -740 -130 C -710 -130, -690 -140, -660 -150 C -600 -190, -540 -210, -480 -196';
  const perfil = `M-1500 0 C -1350 -4, -1200 -8, -1140 -10 ${cabeza} C -440 -186, -400 -176, -340 -144 C -260 -110, -160 -130, -60 -150 C 40 -168, 140 -140, 220 -120 C 360 -100, 500 -150, 620 -230 C 680 -262, 740 -250, 790 -200 C 860 -130, 940 -90, 1040 -80 C 1080 -100, 1100 -130, 1120 -120 C 1140 -100, 1140 -60, 1180 -40 C 1300 -20, 1400 -6, 1500 0 Z`;
  const piel = `M-1140 -10 ${cabeza} L -480 0 L -1140 0 Z`;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <path d={perfil} fill="#6B4A2A" stroke={NEGRO} strokeWidth={3.4} />
      <path d={perfil} fill="#4E7A3A" opacity={verde} />
      {/* pelo extendido sobre el suelo, con flores */}
      {/* cabeza, cuello y hombros con piel; el bosque la cubre como una capa desde el pecho */}
      <path d={piel} fill="#8A5434" stroke={NEGRO} strokeWidth={3.4} />
      <path d="M-480 -196 C -470 -130, -490 -60, -480 0" stroke={W.rojo} strokeWidth={6} fill="none" />
      {Array.from({ length: 6 }, (_, k) => <path key={`b${k}`} d={`M-482 ${-180 + k * 30} l -14 10`} stroke={NEGRO} strokeWidth={3} strokeLinecap="round" />)}
      <path d={`M-1140 -10 C -1200 -70, -1320 -60, -1480 -8 L -1480 0 L -1140 0 Z`} fill="#1E140C" stroke={NEGRO} strokeWidth={2} />
      {[0, 1, 2].map((i) => <path key={`p${i}`} d={`M-1150 ${-14 - i * 12} C -1240 ${-30 - i * 8}, -1340 ${-14 - i * 6 + Math.sin(f / 20 + i) * 3}, -1460 ${-6 - i * 2}`} stroke="#5A3A22" strokeWidth={3} fill="none" strokeLinecap="round" />)}
      {[-1200, -1290, -1390].map((px, i) => <circle key={`f${i}`} cx={px} cy={-34 + i * 8} r={12} fill={i % 2 ? W.ocreClaro : W.rojo} stroke={NEGRO} strokeWidth={1.4} />)}
      <path d="M-1086 -124 C -1072 -136, -1056 -142, -1042 -142" stroke={NEGRO} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M-1072 -110 C -1062 -120, -1048 -122, -1038 -118" stroke={NEGRO} strokeWidth={4.5} fill="none" strokeLinecap="round" />
      {[0, 1, 2].map((k) => <path key={`c${k}`} d={`M${-1068 + k * 12} ${-114 - k} l -2 9`} stroke={NEGRO} strokeWidth={2.4} strokeLinecap="round" />)}
      <path d="M-940 -222 C -932 -214, -922 -214, -916 -220" stroke={NEGRO} strokeWidth={3} fill="none" />
      <path d="M-860 -90 C -880 -80, -890 -110, -872 -120 C -862 -124, -856 -114, -862 -108" stroke={NEGRO} strokeWidth={3} fill="#9A6440" />
      {verde > 0 && Array.from({ length: 26 }, (_, i) => { const px = -420 + azar(i * 3 + 1) * 1800; return <circle key={i} cx={px} cy={-40 - azar(i * 9) * 50} r={10 + azar(i) * 12} fill={i % 2 ? '#2F5A34' : '#3A6E3E'} stroke={NEGRO} strokeWidth={1.2} opacity={verde} />; })}
      {Array.from({ length: 5 }, (_, i) => { const t = ((f * 0.5 + i * 40) % 160) / 160, px = -400 + i * 380; return <ellipse key={`n${i}`} cx={px + t * 40} cy={-150 - t * 120} rx={50 + t * 40} ry={10 + t * 6} fill={W.blanco} opacity={(0.3 - t * 0.28) * Math.max(0.3, verde)} />; })}
    </g>
  );
};
/** Enredadera (aka) que cuelga del cielo hasta el suelo. */
const Aka: React.FC<{ x: number; y?: number; s?: number; f: number; desde?: number }> = ({ x, y = SUELO, s = 1, f, desde = -40 }) => {
  const alto = y - desde, n = 16;
  const pts = Array.from({ length: n + 1 }, (_, i) => [Math.sin(i * 0.8 + f / 20) * 12 * (1 - i / n), -(i * alto) / n] as [number, number]);
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s} 1)`}>
      <path d={suave(pts)} stroke={NEGRO} strokeWidth={11} fill="none" />
      <path d={suave(pts)} stroke="#6A5A2A" strokeWidth={7} fill="none" />
      {pts.slice(1, -1).map(([px, py], i) => <path key={i} d={`M${px} ${py} q ${i % 2 ? 24 : -24} -8 ${i % 2 ? 30 : -30} 10 q ${i % 2 ? -16 : 16} 2 ${i % 2 ? -30 : 30} -10`} fill={W.helecho} stroke={NEGRO} strokeWidth={1.2} />)}
    </g>
  );
};
const Kete: React.FC<{ x: number; y?: number; s?: number; f: number; brillo?: boolean }> = ({ x, y = SUELO, s = 1, f, brillo }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {brillo && <circle cy={-40} r={110} fill="url(#halo)" opacity={0.6 + Math.sin(f / 6) * 0.15} />}
    <path d="M-40 -60 C -46 -100, 46 -100, 40 -60" stroke="#8A6A3A" strokeWidth={6} fill="none" />
    <path d="M-50 -64 L 50 -64 L 40 0 L -40 0 Z" fill={W.harakeke} stroke={NEGRO} strokeWidth={2.4} />
    {[-50, -36, -22, -8].map((py) => <path key={py} d={`M-46 ${py} H 46`} stroke="#8A6A3A" strokeWidth={2} />)}
    {[-30, -10, 10, 30].map((px) => <path key={px} d={`M${px} -62 l -4 60`} stroke="#8A6A3A" strokeWidth={2} />)}
    <path d="M-48 -54 H 48" stroke={W.rojo} strokeWidth={4} />
  </g>
);
/** Panel tallado genérico (poupou): espirales y ojos de pāua, sin figura ni moko. Origen = pie. */
const Poupou: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => {
  const idP = `pauaP${Math.round(x)}`;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <DegradePaua id={idP} />
      <rect x={-60} y={-380} width={120} height={380} fill={W.rojo} stroke={NEGRO} strokeWidth={3} />
      {[-300, -200, -100].map((py, i) => <g key={i}>
        <path d={`M-40 ${py} c 0 -40, 50 -44, 54 -10 c 3 24, -26 30, -30 12 c -2 -10, 10 -14, 14 -6`} stroke={NEGRO} strokeWidth={8} fill="none" />
        <path d={`M40 ${py + 50} c 0 -40, -50 -44, -54 -10 c -3 24, 26 30, 30 12 c 2 -10, -10 -14, -14 -6`} stroke={W.blanco} strokeWidth={5} fill="none" />
      </g>)}
      <ellipse cx={-22} cy={-350} rx={13} ry={8} fill={`url(#${idP})`} stroke={W.blanco} strokeWidth={2} />
      <ellipse cx={22} cy={-350} rx={13} ry={8} fill={`url(#${idP})`} stroke={W.blanco} strokeWidth={2} />
    </g>
  );
};
const Tukutuku: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-60} y={-320} width={120} height={320} fill={NEGRO} stroke="#5A3A22" strokeWidth={6} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-54 ${-10 - i * 40} h 24 v -20 h 24 v -20`} stroke={i % 2 ? W.blanco : W.ocreClaro} strokeWidth={6} fill="none" />)}
    {Array.from({ length: 8 }, (_, i) => <path key={`b${i}`} d={`M6 ${-10 - i * 40} h 24 v -20 h 24 v -20`} stroke={i % 2 ? W.ocreClaro : W.blanco} strokeWidth={6} fill="none" />)}
  </g>
);
const Puna: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={170} ry={30} fill="#7A7468" stroke={NEGRO} strokeWidth={2.4} />
    <ellipse cx={0} cy={6} rx={150} ry={22} fill="#2A8590" stroke={NEGRO} strokeWidth={2} />
    {[0, 1, 2].map((i) => { const t = ((f * 0.6 + i * 30) % 90) / 90; return <ellipse key={i} cx={20 - i * 30} cy={6} rx={20 + t * 80} ry={4 + t * 10} fill="none" stroke={W.blanco} strokeWidth={2} opacity={0.7 - t * 0.6} />; })}
  </g>
);
const Rua: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <ellipse cx={0} cy={8} rx={90} ry={22} fill={NEGRO} />
    <ellipse cx={0} cy={10} rx={70} ry={14} fill="#2A1810" />
    {Array.from({ length: 14 }, (_, i) => { const a = -1 + (i / 13) * 2, px = a * 100, m = Math.sin(f / 18 + i) * 3; return <path key={i} d={`M${px} 6 q ${a * 10 + m} -50 ${a * 30 + m} -80`} stroke={i % 2 ? '#A89A5A' : '#7A8A3A'} strokeWidth={4} fill="none" strokeLinecap="round" />; })}
  </g>
);
/** Fogón con piedras. */
const Ahi: React.FC<{ x: number; y?: number; s?: number; f: number; brasas?: boolean }> = ({ x, y = SUELO, s = 1, f, brasas }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <circle cy={-120} r={220} fill="url(#halo)" opacity={brasas ? 0.3 : 0.7} />
    {[-70, -35, 0, 35, 70].map((px, i) => <ellipse key={i} cx={px} cy={-6} rx={22} ry={14} fill="#6E6A62" stroke={NEGRO} strokeWidth={2} />)}
    {[[-60, 0, 50, -40], [-50, -30, 60, 0]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L ${c} ${d}`} stroke="#5A3420" strokeWidth={18} strokeLinecap="round" />)}
    {brasas ? [-30, 0, 30].map((dx, i) => <circle key={i} cx={dx} cy={-20} r={12 + Math.sin(f / 5 + i) * 3} fill={W.rojo} opacity={0.85} />) : <g transform="translate(0 -24)"><Fuego f={f} s={1.2} /></g>}
  </g>
);
/** Llamita suelta que flota (la uña de fuego de Mahuika). Origen = base de la llama. */
const Korakora: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = 500, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y + Math.sin(f / 8) * 6)}) scale(${s})`}>
    <circle cy={-20} r={70} fill="url(#halo)" opacity={0.8} />
    <path d={`M0 0 C -22 -10, -24 -40, -6 -60 C -4 -44, 6 -40, 4 -70 C 24 -50, 26 -16, 0 0 Z`} fill="#F2A33D" stroke={W.rojo} strokeWidth={3} transform={`scale(${r1(1 + Math.sin(f / 3) * 0.08)})`} />
    <path d="M0 -6 C -8 -14, -8 -30, 0 -40 C 6 -28, 8 -14, 0 -6 Z" fill="#FFE9A0" />
  </g>
);
const Toka: React.FC<{ x: number; y?: number; s?: number; color?: string }> = ({ x, y = SUELO, s = 1, color = '#7E7A70' }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-110 0 L -96 -70 L -40 -120 L 30 -112 L 90 -70 L 110 0 Z" fill={color} stroke={NEGRO} strokeWidth={2.6} />
    <path d="M-40 -120 L -20 -60 L 30 -112 M-20 -60 L 90 -70" stroke={NEGRO} strokeWidth={1.6} opacity={0.4} fill="none" />
  </g>
);
/** Isla que sale del agua (origen = línea del agua). */
const Motu: React.FC<{ x: number; y?: number; s?: number; verde?: boolean; ancho?: number }> = ({ x, y = SUELO - 40, s = 1, verde = true, ancho = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${r1(s * ancho)} ${s})`}>
    <path d="M-300 10 C -260 -60, -160 -140, -40 -150 C 80 -160, 200 -100, 300 10 Z" fill="#6B5A44" stroke={NEGRO} strokeWidth={3} />
    {verde && <path d="M-260 -40 C -200 -110, -100 -150, -40 -150 C 80 -160, 180 -110, 250 -40 C 120 -70, -120 -70, -260 -40 Z" fill="#4E7A3A" stroke={NEGRO} strokeWidth={2} />}
    {verde && [-150, -60, 40, 130].map((px, i) => <circle key={i} cx={px} cy={-130 + Math.abs(px) * 0.25} r={26} fill={i % 2 ? '#2F5A34' : '#3A6E3E'} stroke={NEGRO} strokeWidth={1.6} />)}
  </g>
);
/** El pozo por donde sale el sol, en el borde del mundo. Origen = suelo. */
const RuaRa: React.FC<{ x: number; y?: number; s?: number; f: number; luz?: number }> = ({ x, y = SUELO, s = 1, f, luz = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <ellipse cy={-30} rx={420} ry={200} fill="url(#halo)" opacity={0.7 * luz} />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-90 + i * 30} -10 L ${-300 + i * 100 + Math.sin(f / 20 + i) * 10} -460`} stroke="#FFD27A" strokeWidth={14} opacity={0.18 * luz} />)}
    <ellipse cx={0} cy={0} rx={200} ry={34} fill="#3A1E10" stroke={NEGRO} strokeWidth={3} />
    <ellipse cx={0} cy={2} rx={170} ry={24} fill="#F2A33D" opacity={0.6 + 0.3 * luz} />
  </g>
);
const Ngawha: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={160} ry={26} fill="#C9C2AE" stroke={NEGRO} strokeWidth={2.4} />
    <ellipse cx={0} cy={6} rx={136} ry={18} fill="#5EB8B0" />
    {[0, 1, 2, 3].map((i) => { const t = ((f * 0.5 + i * 25) % 100) / 100; return <ellipse key={i} cx={-60 + i * 40 + Math.sin(t * 4 + i) * 20} cy={-10 - t * 220} rx={30 + t * 50} ry={18 + t * 20} fill={W.blanco} opacity={0.55 - t * 0.5} />; })}
  </g>
);
/** Boca de cueva en un acantilado. Origen = suelo. */
const Ana: React.FC<{ x: number; y?: number; s?: number; color?: string }> = ({ x, y = SUELO, s = 1, color = '#6E6458' }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-300 0 L -280 -260 L -160 -360 L 40 -380 L 220 -320 L 300 0 Z" fill={color} stroke={NEGRO} strokeWidth={3} />
    <path d="M-110 0 C -120 -150, -60 -220, 0 -222 C 70 -220, 120 -150, 110 0 Z" fill="#140C08" stroke={NEGRO} strokeWidth={3} />
    <path d="M-160 -360 L -120 -260 M40 -380 L 60 -290 M220 -320 L 170 -240" stroke={NEGRO} strokeWidth={2} opacity={0.4} />
  </g>
);
/** Soga de lino suelta entre dos puntos (props.ax, props.ay = el otro extremo, relativo). */
const Taura: React.FC<{ x: number; y?: number; ax?: number; ay?: number }> = ({ x, y = SUELO - 10, ax = 300, ay = -300 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`}>
    <path d={`M0 0 Q ${r1(ax * 0.5)} ${r1(ay * 0.5 + 40)} ${ax} ${ay}`} stroke={NEGRO} strokeWidth={9} fill="none" />
    <path d={`M0 0 Q ${r1(ax * 0.5)} ${r1(ay * 0.5 + 40)} ${ax} ${ay}`} stroke={W.harakeke} strokeWidth={6} fill="none" strokeDasharray="7 4" />
  </g>
);
const Toko: React.FC<{ x: number; y?: number; s?: number; alto?: number }> = ({ x, y = SUELO, s = 1, alto = 500 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d={`M-9 0 L -7 ${-alto} L 7 ${-alto} L 9 0 Z`} fill="#7A5636" stroke={NEGRO} strokeWidth={2.4} />
    {[0.25, 0.5, 0.75].map((t) => <path key={t} d={`M-8 ${-alto * t} h 16`} stroke={W.rojo} strokeWidth={5} />)}
  </g>
);

// ---------- suelos especiales ----------
const SueloNubes: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-1600} y={SUELO + 4} width={8000} height={260} fill={W.blanco} />
    <path d={`M-1600 ${SUELO + 8} ` + Array.from({ length: 140 }, (_, i) => `q 30 ${r1(-20 - azar(i) * 14)} 60 0`).join(' ') + ` V ${SUELO + 260} H -1600 Z`} fill={W.blanco} stroke={NEGRO} strokeWidth={3} />
    {Array.from({ length: 140 }, (_, i) => <path key={i} d={`M${-1600 + i * 60 + 14} ${SUELO + 30} c 0 -9, 12 -11, 14 -2 c 1 5, -5 7, -7 3`} stroke={W.pauaClaro} strokeWidth={2.4} fill="none" opacity={0.75} transform={`translate(${r1(Math.sin(f / 50 + i) * 2)} 0)`} />)}
  </g>
);
const SueloOscuro: React.FC<{ color?: string; grietas?: boolean; f?: number }> = ({ color = '#2A1A1E', grietas, f = 0 }) => (
  <g>
    <rect x={-1600} y={SUELO} width={8000} height={260} fill={color} />
    <rect x={-1600} y={SUELO} width={8000} height={5} fill={NEGRO} />
    {Array.from({ length: 70 }, (_, i) => grietas
      ? <path key={i} d={`M${-1600 + i * 120 + 10} ${SUELO + 10} l 20 22 l -10 18 l 26 24`} stroke="#F26A2A" strokeWidth={3} fill="none" opacity={0.5 + 0.4 * Math.sin(f / 10 + i)} />
      : <path key={i} d={`M${-1600 + i * 120 + 20} ${SUELO + 40} c 0 -12, 16 -14, 18 -2 c 1 6, -6 8, -8 4`} stroke="#6A5A6E" strokeWidth={2.4} fill="none" opacity={0.6} />)}
  </g>
);
const Arena: React.FC = () => (
  <g>
    <rect x={-1600} y={SUELO} width={8000} height={260} fill="#D9C08A" />
    <rect x={-1600} y={SUELO} width={8000} height={5} fill={NEGRO} />
    {Array.from({ length: 160 }, (_, i) => <circle key={i} cx={-1600 + i * 50 + azar(i) * 30} cy={SUELO + 20 + azar(i * 3) * 50} r={2 + azar(i * 7) * 2} fill="#A8905A" />)}
  </g>
);
const Whariki: React.FC = () => (
  <g>
    <rect x={-1600} y={SUELO} width={8000} height={260} fill="#B89A5C" />
    <rect x={-1600} y={SUELO} width={8000} height={5} fill={NEGRO} />
    {Array.from({ length: 200 }, (_, i) => <path key={i} d={`M${-1600 + i * 40} ${SUELO + 6} l 20 20 l -20 20 M${-1580 + i * 40} ${SUELO + 6} l -20 20 l 20 20`} stroke="#8A6A3A" strokeWidth={2} fill="none" />)}
    <FranjaMaori y={SUELO + 50} alto={20} desplaz={0} tipo="taniko" ancho={6000} />
  </g>
);

// ---------- fondos ----------
export function fondoMaori(tipo: string, f: number, astros = true): React.ReactNode | null {
  switch (tipo) {
    case 'te_po': return (
      <>
        <Capa p={0.05}><rect x={-1600} y={0} width={8000} height={1100} fill="#0C0A10" opacity={0.55} /></Capa>
        <Capa p={0.2}>{Array.from({ length: 8 }, (_, i) => { const t = ((f * 0.2 + i * 30) % 240) / 240; return <ellipse key={i} cx={-300 + i * 420 + t * 80} cy={520 + Math.sin(i) * 80} rx={220} ry={30} fill="#5A4A6A" opacity={0.18} />; })}</Capa>
        <Capa p={0.4}>{[-200, 500, 1200, 1900, 2600].map((x, i) => <g key={i} opacity={0.5}><Rakau x={x} y={SUELO - 20} s={0.55} f={f} color="#2A3A2E" /></g>)}</Capa>
        <Capa p={1}><SueloOscuro color="#24181A" /></Capa>
      </>
    );
    case 'te_ao_marama': return (
      <>
        <Capa p={0.08}>{astros && <Ra x={1620} y={240} r={50} f={f} />}</Capa>
        <Capa p={0.15}>{[[100, 300], [900, 250], [2200, 290]].map(([x, y], i) => <Kapua key={i} x={x} y={y} s={0.8} f={f} />)}</Capa>
        <Capa p={0.2}><Cordillera y={SUELO - 60} seed={4} /></Capa>
        <Capa p={0.4}><Puke y={SUELO - 20} seed={3} alto={110} /></Capa>
        <Capa p={0.7}>{[-200, 500, 1300, 2100, 2900].map((x, i) => <g key={i}><Rakau x={x} y={SUELO - 6} s={0.7} f={f} /><Harakeke x={x + 300} y={SUELO - 4} s={0.6} f={f} /></g>)}</Capa>
        <Capa p={1}><SueloMaori desde={-1600} hasta={6400} /></Capa>
      </>
    );
    case 'ngahere': return (
      <>
        <Capa p={0.06}>{astros && Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${200 + i * 300} 126 L ${120 + i * 300} 790 L ${170 + i * 300} 790 Z`} fill="#FFF3C8" opacity={0.12} />)}</Capa>
        <Capa p={0.25}>{[-300, 200, 700, 1200, 1700, 2200, 2700].map((x, i) => <g key={i} opacity={0.75}><Kauri x={x} y={SUELO - 40} s={0.75} f={f} /></g>)}</Capa>
        <Capa p={0.5}>{[-100, 600, 1300, 2000, 2700].map((x, i) => <g key={i}><Ponga x={x} y={SUELO - 10} s={0.9} f={f} /><Nikau x={x + 360} y={SUELO - 10} s={0.8} f={f} /></g>)}</Capa>
        <Capa p={0.85}>{[0, 900, 1800, 2700, 3600].map((x, i) => <Rarauhe key={i} x={x} y={SUELO} s={1} f={f} />)}</Capa>
        <Capa p={1}><SueloMaori desde={-1600} hasta={6400} color="#4A3020" /></Capa>
      </>
    );
    case 'moana': return (
      <>
        <Capa p={0.06}>{astros && <Ra x={1650} y={230} r={44} f={f} />}</Capa>
        <Capa p={0.15}>{[[0, 280], [800, 240], [1700, 300], [2500, 260]].map(([x, y], i) => <Kapua key={i} x={x} y={y} s={0.75} f={f} />)}</Capa>
        <Capa p={0.4}><Wai y={SUELO - 170} f={f * 0.5} desde={-1200} hasta={4400} /></Capa>
        <Capa p={1}><Wai y={SUELO - 40} f={f} desde={-1800} hasta={6400} /></Capa>
      </>
    );
    case 'takutai': return (
      <>
        <Capa p={0.06}>{astros && <Ra x={1600} y={230} r={44} f={f} />}</Capa>
        <Capa p={0.15}>{[[200, 270], [1300, 240], [2300, 280]].map(([x, y], i) => <Kapua key={i} x={x} y={y} s={0.7} f={f} />)}</Capa>
        <Capa p={0.3}><Wai y={SUELO - 160} f={f * 0.4} desde={-1200} hasta={4400} /><Motu x={1900} y={SUELO - 160} s={0.5} /></Capa>
        <Capa p={0.6}><Wai y={SUELO - 70} f={f * 0.7} desde={-1600} hasta={5200} />{[-250, 2300].map((x, i) => <g key={i}><Toka x={x} y={SUELO - 50} s={1.2} /></g>)}</Capa>
        <Capa p={0.8}>{[-100, 1500, 3000].map((x, i) => <Pohutukawa key={i} x={x} y={SUELO - 10} s={0.95} f={f} />)}</Capa>
        <Capa p={1}><Arena /></Capa>
      </>
    );
    case 'kainga': return (
      <>
        <Capa p={0.08}>{astros && <Ra x={1650} y={230} r={44} f={f} />}</Capa>
        <Capa p={0.15}><Cordillera y={SUELO - 90} seed={7} color="#9AA4AE" /></Capa>
        <Capa p={0.3}><Puke y={SUELO - 50} seed={5} color="#7AA058" alto={90} /></Capa>
        <Capa p={0.5}><Palisada x={900} y={SUELO - 30} s={0.5} ancho={4600} /><Whare x={-150} y={SUELO - 30} s={0.6} /><Pataka x={2050} y={SUELO - 30} s={0.6} /><Whare x={2500} y={SUELO - 30} s={0.6} /></Capa>
        <Capa p={0.8}>{[-200, 700, 1700, 2600].map((x, i) => <Harakeke key={i} x={x} y={SUELO - 4} s={0.7} f={f} />)}</Capa>
        <Capa p={1}><SueloMaori desde={-1600} hasta={6400} /></Capa>
      </>
    );
    case 'whare_dentro': return (
      <>
        <Capa p={0.5}>
          <rect x={-1600} y={0} width={8000} height={SUELO} fill="#2E1A10" />
          {Array.from({ length: 30 }, (_, i) => { const px = -1300 + i * 200; return i % 2 ? <Poupou key={i} x={px} y={SUELO - 10} s={1} /> : <Tukutuku key={i} x={px} y={SUELO - 40} s={1} />; })}
          <rect x={-1600} y={126} width={8000} height={84} fill={NEGRO} />
          <FranjaMaori y={136} alto={64} desplaz={0} tipo="koru" ancho={7000} />
          {Array.from({ length: 15 }, (_, i) => <rect key={i} x={-1240 + i * 400} y={210} width={16} height={190} fill="#5A3420" stroke={NEGRO} strokeWidth={2} />)}
        </Capa>
        <Capa p={1}><Whariki /></Capa>
      </>
    );
    case 'rarohenga': return (
      <>
        <Capa p={0.06}>{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={-200 + azar(i * 3) * 2400} cy={160 + azar(i * 5) * 260} r={2 + azar(i) * 3} fill="#9AE0C8" opacity={0.3 + 0.4 * Math.abs(Math.sin(f / 15 + i))} />)}</Capa>
        <Capa p={0.25}>{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-600 + i * 300} 120 L ${-540 + i * 300} ${280 + azar(i) * 160} L ${-480 + i * 300} 120 Z`} fill="#2A1A2A" stroke={NEGRO} strokeWidth={2} />)}</Capa>
        <Capa p={0.4}>{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-600 + i * 360} ${SUELO} L ${-520 + i * 360} ${380 + azar(i + 3) * 200} L ${-440 + i * 360} ${SUELO} Z`} fill="#3A2434" stroke={NEGRO} strokeWidth={2.4} />)}</Capa>
        <Capa p={0.6}>{Array.from({ length: 6 }, (_, i) => { const t = ((f * 0.3 + i * 40) % 200) / 200; return <ellipse key={i} cx={-200 + i * 600 + t * 100} cy={SUELO - 40 - t * 60} rx={200} ry={24} fill="#8A7A9A" opacity={0.2 - t * 0.15} />; })}</Capa>
        <Capa p={1}><SueloOscuro /></Capa>
      </>
    );
    case 'rangi_tuhaha': return (
      <>
        <Capa p={0.05}>{astros && <CampoWhetu f={f} n={22} area={[-200, 140, 2400, 200]} r={6} />}</Capa>
        <Capa p={0.2}>{[[-100, 420], [700, 380], [1500, 440], [2300, 400]].map(([x, y], i) => <Kapua key={i} x={x} y={y} s={1.2} f={f} />)}</Capa>
        <Capa p={0.6}>{[[100, 680], [1000, 700], [1900, 670], [2800, 690]].map(([x, y], i) => <Kapua key={i} x={x} y={y} s={1.5} f={f} />)}</Capa>
        <Capa p={1}><SueloNubes f={f} /></Capa>
      </>
    );
    case 'maunga': return (
      <>
        <Capa p={0.08}>{astros && <Ra x={1650} y={230} r={42} f={f} />}</Capa>
        <Capa p={0.15}><Cordillera y={SUELO - 80} seed={11} color="#8090A0" /></Capa>
        <Capa p={0.3}><Maunga x={700} y={SUELO - 40} s={0.9} f={f} humo /><Maunga x={1500} y={SUELO - 40} s={0.6} f={f} color="#6E6670" /></Capa>
        <Capa p={0.6}>{Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${-400 + i * 240} ${SUELO - 10} q 10 -40 0 -70 M${-390 + i * 240} ${SUELO - 10} q 20 -30 30 -60 M${-410 + i * 240} ${SUELO - 10} q -16 -30 -30 -54`} stroke="#B8A05A" strokeWidth={4} fill="none" />)}</Capa>
        <Capa p={1}><SueloMaori desde={-1600} hasta={6400} color="#7A6440" /></Capa>
      </>
    );
    case 'roto': return (
      <>
        <Capa p={0.08}>{astros && <Ra x={1650} y={230} r={42} f={f} />}</Capa>
        <Capa p={0.15}><Puke y={SUELO - 140} seed={9} color="#6E8E58" alto={120} /></Capa>
        <Capa p={0.3}><Wai y={SUELO - 150} f={f * 0.3} desde={-1200} hasta={4400} /><Motu x={1100} y={SUELO - 150} s={0.6} ancho={1.4} />{[0, 1, 2].map((i) => { const t = ((f * 0.4 + i * 50) % 150) / 150; return <ellipse key={i} cx={1700 + i * 60} cy={SUELO - 170 - t * 200} rx={40 + t * 50} ry={20 + t * 20} fill={W.blanco} opacity={0.5 - t * 0.45} />; })}</Capa>
        <Capa p={0.6}><Wai y={SUELO - 60} f={f * 0.6} desde={-1600} hasta={5200} />{[-300, 800, 2400].map((x, i) => <g key={i}><Harakeke x={x} y={SUELO - 50} s={0.6} f={f} /></g>)}</Capa>
        <Capa p={1}><SueloMaori desde={-1600} hasta={6400} color="#6E5A3A" /></Capa>
      </>
    );
    case 'ahi_mahuika': return (
      <>
        <Capa p={0.05}><rect x={-1600} y={0} width={8000} height={1100} fill="#5A1A0E" opacity={0.45} /></Capa>
        <Capa p={0.2}><Maunga x={500} y={SUELO - 60} s={0.8} f={f} humo color="#3A2A2A" nieve={false} /><Maunga x={1600} y={SUELO - 60} s={0.65} f={f} humo color="#3A2A2A" nieve={false} /></Capa>
        <Capa p={0.4}>{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-400 + i * 400} ${SUELO} L ${-330 + i * 400} ${520 + azar(i) * 120} L ${-250 + i * 400} ${SUELO} Z`} fill="#2A1A18" stroke={NEGRO} strokeWidth={2.4} />)}</Capa>
        <Capa p={0.7}>{[-200, 700, 1600, 2500].map((x, i) => <g key={i} transform={`translate(${x} ${SUELO - 10})`}><Fuego f={f + i * 7} s={0.9} /></g>)}</Capa>
        <Capa p={1}><SueloOscuro color="#1E1412" grietas f={f} /></Capa>
      </>
    );
    case 'po_whetu': return (
      <>
        <Capa p={0.04}>{astros && <><CampoWhetu f={f} n={60} area={[-200, 140, 2400, 420]} r={7} /><path d="M-400 560 Q 960 40 2600 560" stroke="#C9D2E6" strokeWidth={80} fill="none" opacity={0.14} /><Matariki x={1450} y={250} s={0.8} f={f} /></>}</Capa>
        <Capa p={0.25}><Puke y={SUELO - 30} seed={8} color="#1E2A3A" alto={120} /></Capa>
        <Capa p={0.6}>{[-100, 800, 1700, 2600].map((x, i) => <g key={i} opacity={0.9}><Ponga x={x} y={SUELO - 10} s={0.8} f={f} /></g>)}</Capa>
        <Capa p={1}><SueloMaori desde={-1600} hasta={6400} color="#2A2020" /></Capa>
      </>
    );
    case 'rua_ra': return (
      <>
        <Capa p={0.04}>{astros && <CampoWhetu f={f} n={30} area={[-200, 140, 2400, 260]} r={6} />}</Capa>
        <Capa p={0.15}><rect x={-1600} y={SUELO - 260} width={8000} height={260} fill="#E8955A" opacity={0.25} /><Cordillera y={SUELO - 40} seed={13} color="#3A2E3A" nieve={false} /></Capa>
        <Capa p={0.6}>{[-300, 2300].map((x, i) => <Toka key={i} x={x} y={SUELO - 10} s={1.4} color="#4A3A3A" />)}</Capa>
        <Capa p={1}><SueloMaori desde={-1600} hasta={6400} color="#3A2A22" /></Capa>
      </>
    );
    case 'hawaiki': return (
      <>
        <Capa p={0.06}>{astros && <Ra x={1650} y={230} r={44} f={f} />}</Capa>
        <Capa p={0.15}>{[[200, 260], [1300, 230]].map(([x, y], i) => <Kapua key={i} x={x} y={y} s={0.7} f={f} />)}</Capa>
        <Capa p={0.25}><Wai y={SUELO - 160} f={f * 0.35} desde={-1200} hasta={4400} /><Maunga x={500} y={SUELO - 150} s={0.5} f={f} color="#4E6A4A" nieve={false} /><Motu x={2100} y={SUELO - 160} s={0.45} /></Capa>
        <Capa p={0.6}>{[-300, 300, 1500, 2200, 2900].map((x, i) => <Nikau key={i} x={x} y={SUELO - 10} s={0.85} f={f} />)}<Whare x={900} y={SUELO - 20} s={0.55} /></Capa>
        <Capa p={1}><Arena /></Capa>
      </>
    );
    case 'aotearoa': return (
      <>
        <Capa p={0.06}>{astros && <Ra x={1700} y={220} r={40} f={f} />}</Capa>
        <Capa p={0.12}><Kapua x={900} y={330} s={1} f={f} larga /></Capa>
        <Capa p={0.2}><Wai y={SUELO - 180} f={f * 0.3} desde={-1200} hasta={4400} /><path d={`M300 ${SUELO - 180} C 400 ${SUELO - 260}, 700 ${SUELO - 300}, 900 ${SUELO - 280} C 1100 ${SUELO - 320}, 1400 ${SUELO - 260}, 1600 ${SUELO - 180} Z`} fill="#4E7A3A" stroke={NEGRO} strokeWidth={2.4} /><Maunga x={950} y={SUELO - 270} s={0.25} f={f} /></Capa>
        <Capa p={1}><Wai y={SUELO - 40} f={f} desde={-1800} hasta={6400} /></Capa>
      </>
    );
    default: return null;
  }
}

// ---------- elementos ----------
export function elementoMaori(tipo: string, x: number, y: number | undefined, s: number, f: number, props: Record<string, unknown> = {}): React.ReactNode | null {
  const yy = y ?? SUELO;
  const b = (k: string) => props[k] === true;
  const n = (k: string, d: number) => (typeof props[k] === 'number' ? (props[k] as number) : d);
  switch (tipo) {
    case 'ra': case 'sol': return <Ra x={x} y={y ?? 240} r={60 * s} f={f} cara={props.cara !== false} luz={n('luz', 1)} atado={b('atado')} enojado={b('enojado')} />;
    case 'marama': case 'luna': return <Marama x={x} y={y ?? 240} r={50 * s} luz={n('luz', 1)} />;
    case 'whetu': case 'estrellas': return <CampoWhetu f={f} n={n('n', 30)} area={[x - 900, y ?? 150, 1800, 320]} r={7 * s} />;
    case 'matariki': return <Matariki x={x} y={y ?? 260} s={s} f={f} />;
    case 'kapua': case 'nube': return <Kapua x={x} y={y ?? 300} s={s} f={f} oscura={b('oscura')} larga={b('larga')} />;
    case 'maunga_el': case 'monte': return <Maunga x={x} y={yy} s={s * 0.8} f={f} humo={b('humo')} nieve={props.nieve !== false} />;
    case 'kauri': return <Kauri x={x} y={yy} s={s} f={f} />;
    case 'ponga': return <Ponga x={x} y={yy} s={s} f={f} />;
    case 'nikau': case 'palmera': return <Nikau x={x} y={yy} s={s} f={f} />;
    case 'pohutukawa': return <Pohutukawa x={x} y={yy} s={s} f={f} flores={props.flores !== false} />;
    case 'totara': case 'pino': case 'cipres': return <Totara x={x} y={yy} s={s} f={f} />;
    case 'rakau': case 'arbol': case 'olivo': return <Rakau x={x} y={yy} s={s} f={f} color={props.color as string | undefined} />;
    case 'harakeke': return <Harakeke x={x} y={yy} s={s} f={f} />;
    case 'rarauhe': return <Rarauhe x={x} y={yy} s={s} f={f} />;
    case 'mara_kumara': return <MaraKumara x={x} y={yy} s={s} />;
    case 'wharenui': case 'templo': return <Wharenui x={x} y={yy} s={s} />;
    case 'pataka': return <Pataka x={x} y={yy} s={s} />;
    case 'whare': case 'casa': return <Whare x={x} y={yy} s={s} />;
    case 'palisada': case 'muralla': return <Palisada x={x} y={yy} s={s} ancho={n('ancho', 900)} />;
    case 'waka': case 'barco': case 'canoa': return <Waka x={x} y={y ?? SUELO - 20} s={s} f={f} espejo={b('espejo')} quieta={b('quieta')} />;
    case 'waka_hourua': return <WakaHourua x={x} y={y ?? SUELO - 20} s={s} f={f} espejo={b('espejo')} />;
    case 'matau': return <Matau x={x} y={y ?? 400} s={s} f={f} brillo={b('brillo')} linea={b('linea')} />;
    case 'kauae': return <Kauae x={x} y={y ?? SUELO - 40} s={s} f={f} brillo={b('brillo')} />;
    case 'te_ika': return <TeIka x={x} y={y ?? SUELO - 40} s={s} f={f} tierra={n('tierra', 0)} />;
    case 'toko': return <Toko x={x} y={yy} s={s} alto={n('alto', 500)} />;
    case 'ranginui_cielo': return <RanginuiCielo x={x} y={y ?? 300} s={s} f={f} lagrimas={b('lagrimas')} brazos={b('brazos')} />;
    case 'papatuanuku_tierra': return <PapatuanukuTierra x={x} y={yy} s={s} f={f} verde={n('verde', 1)} />;
    case 'aka': return <Aka x={x} y={yy} s={s} f={f} desde={n('desde', -40)} />;
    case 'kete': return <Kete x={x} y={yy} s={s} f={f} brillo={b('brillo')} />;
    case 'poupou': return <Poupou x={x} y={yy} s={s} />;
    case 'tukutuku': return <Tukutuku x={x} y={yy} s={s} />;
    case 'puna': return <Puna x={x} y={yy} s={s} f={f} />;
    case 'rua': return <Rua x={x} y={yy} s={s} f={f} />;
    case 'ahi': case 'fogata': return <Ahi x={x} y={yy} s={s} f={f} brasas={b('brasas')} />;
    case 'korakora': return <Korakora x={x} y={y ?? 500} s={s} f={f} />;
    case 'toka': case 'roca': return <Toka x={x} y={yy} s={s} color={props.color as string | undefined} />;
    case 'motu': case 'isla': return <Motu x={x} y={y ?? SUELO - 40} s={s} verde={props.verde !== false} ancho={n('ancho', 1)} />;
    case 'rua_ra_el': return <RuaRa x={x} y={yy} s={s} f={f} luz={n('luz', 1)} />;
    case 'ngawha': return <Ngawha x={x} y={yy} s={s} f={f} />;
    case 'ana': case 'cueva': return <Ana x={x} y={yy} s={s} color={props.color as string | undefined} />;
    case 'taura': return <Taura x={x} y={y ?? SUELO - 10} ax={n('ax', 300)} ay={n('ay', -300)} />;
    default: return null;
  }
}
