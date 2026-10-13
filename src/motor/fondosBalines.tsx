// Piel balinesa (tema "kamasan"): fondos y elementos al estilo de la pintura wayang de Kamasan — colores planos de
// tierra e índigo con contorno negro, nubes en voluta (awan), montes de roca escalonada, agua con espirales, meru de
// techos de paja negra, portales partidos (candi bentar), banyan envueltos en tela poleng y penjor de bambú.
// Lugares de la T1: el cielo de los dioses (kahyangan), el mar, el fondo del mar, el monte Agung, el lago Batur, los
// arrozales, el templo (de día y de noche), el palacio, la aldea (de día y de noche), el cementerio (setra), el bosque,
// la playa con Nusa Penida enfrente, Tanah Lot, el manantial de Tirta Empul y el estrecho entre Java y Bali.
import React from 'react';
import { Capa, SUELO, Fuego, suave, azar } from '../comun/vasija';
import { KM, SueloKamasan, Espiral, Karang } from '../comun/kamasan';
import type { Cielo } from './fondos';

const r1 = (v: number) => v.toFixed(1);
const NEGRO = KM.negro;

/** Fondos del tema y su cielo (lo usa Escena para el degradé). */
export const CIELO_BALINES: Record<string, Cielo> = {
  kahyangan: 'barro', segara: 'mar', dasar_segara: 'noche', gunung_agung: 'barro', danau_batur: 'mar', sawah: 'barro', pura: 'barro', pura_malam: 'noche',
  puri: 'barro', desa: 'barro', desa_malam: 'noche', setra: 'noche', alas: 'barro', pantai: 'mar', tanah_lot: 'barro', tirta_empul: 'barro', selat: 'mar',
};
export const FONDOS_BALINES = ['kahyangan', 'segara', 'dasar_segara', 'gunung_agung', 'danau_batur', 'sawah', 'pura', 'pura_malam', 'puri', 'desa', 'desa_malam', 'setra', 'alas', 'pantai', 'tanah_lot', 'tirta_empul', 'selat'];
export const ELEMENTOS_BALINES = ['awan', 'surya', 'bulan', 'bintang', 'gunung', 'meru', 'candi_bentar', 'bale', 'kulkul', 'padmasana', 'penjor', 'gebogan', 'canang', 'lontar', 'genta', 'sumur', 'pancuran', 'jukung', 'batu_pura', 'kayonan', 'tedung', 'abu', 'api', 'batu', 'beringin', 'kelapa', 'jepun', 'bambu', 'padi', 'sawah_teras', 'tembok', 'kolam', 'garis_air', 'pulau', 'tanah_genting', 'menara'];

// ---------- piezas ----------
/** Nube en voluta de Kamasan: lóbulos crema con borde índigo, línea interior y espirales. */
export const Awan: React.FC<{ x: number; y: number; s?: number; f?: number; oscura?: boolean }> = ({ x, y, s = 1, f = 0, oscura }) => {
  const d = 'M-130 0 A 44 50 0 0 1 -44 0 A 54 70 0 0 1 64 0 A 34 40 0 0 1 132 0 Z';
  const c = oscura ? KM.azulClaro : KM.indigo;
  return (
    <g transform={`translate(${r1(x + Math.sin(f / 90 + x) * 8)} ${r1(y)}) scale(${s})`}>
      <path d={d} fill={oscura ? '#47557F' : KM.blanco} stroke={c} strokeWidth={3} />
      <path d={d} transform="translate(4 -6) scale(0.82)" fill="none" stroke={oscura ? '#8FA0C8' : KM.azul} strokeWidth={1.6} />
      <Espiral x={-88} y={-24} r={15} c={c} w={2.2} />
      <Espiral x={10} y={-36} r={22} c={c} w={2.4} sentido={-1} />
      <Espiral x={98} y={-16} r={10} c={c} w={2} />
    </g>
  );
};
/** Sol de Kamasan (Surya): disco dorado con ocho rayos de llama grandes y ocho chicos, y loto al centro. */
export const Surya: React.FC<{ x: number; y: number; r?: number; f: number; luz?: number }> = ({ x, y, r = 56, f, luz = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`} opacity={luz}>
    <circle r={r * 2} fill={KM.ocreClaro} opacity={0.18 + Math.sin(f / 20) * 0.04} />
    <g transform={`rotate(${r1(f * 0.15)})`}>
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i * Math.PI) / 8, l = i % 2 ? r * 1.4 : r * 1.78, an = i % 2 ? 0.16 : 0.22;
        const p = (rr: number, da: number) => `${r1(Math.cos(a + da) * rr)} ${r1(Math.sin(a + da) * rr)}`;
        return <path key={i} d={`M${p(r * 0.9, -an)} Q ${p(l * 0.8, an * 0.6)} ${p(l, 0)} Q ${p(l * 0.75, -an * 0.2)} ${p(r * 0.9, an)} Z`} fill={i % 2 ? KM.ocre : KM.rojo} stroke={NEGRO} strokeWidth={1.8} />;
      })}
    </g>
    <circle r={r} fill={KM.oro} stroke={NEGRO} strokeWidth={2.6} />
    <circle r={r * 0.78} fill="none" stroke={KM.rojo} strokeWidth={3} />
    {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={0} cy={-r * 0.38} rx={r * 0.13} ry={r * 0.3} fill={KM.ocreClaro} stroke={KM.rojoOsc} strokeWidth={1.4} transform={`rotate(${i * 45})`} />)}
    <circle r={r * 0.14} fill={KM.rojo} stroke={NEGRO} strokeWidth={1.2} />
  </g>
);
/** Luna (bulan): disco de hueso con borde índigo; sabit = media luna. */
export const Bulan: React.FC<{ x: number; y: number; r?: number; sabit?: boolean; luz?: number }> = ({ x, y, r = 48, sabit, luz = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`} opacity={luz}>
    <circle r={r * 1.8} fill={KM.blanco} opacity={0.12} />
    {sabit
      ? <path d={`M${r1(-r * 0.2)} ${r1(-r)} A ${r1(r)} ${r1(r)} 0 1 0 ${r1(-r * 0.2)} ${r1(r)} A ${r1(r * 0.78)} ${r1(r)} 0 1 1 ${r1(-r * 0.2)} ${r1(-r)} Z`} fill={KM.blanco} stroke={KM.azul} strokeWidth={3} />
      : <><circle r={r} fill={KM.blanco} stroke={KM.azul} strokeWidth={3} /><circle cx={-r * 0.3} cy={-r * 0.2} r={r * 0.18} fill={KM.azulClaro} opacity={0.6} /><circle cx={r * 0.25} cy={r * 0.3} r={r * 0.12} fill={KM.azulClaro} opacity={0.6} /></>}
  </g>
);
/** Estrellas de cuatro puntas, como florcitas. */
const Bintang: React.FC<{ f: number; n?: number; area?: [number, number, number, number]; seed?: number; r?: number }> = ({ f, n = 26, area = [-200, 150, 2400, 330], seed = 5, r = 9 }) => (
  <g>{Array.from({ length: n }, (_, i) => {
    const x = area[0] + azar(i * 3 + seed) * area[2], y = area[1] + azar(i * 7 + seed) * area[3], k = r * (0.5 + azar(i + seed) * 0.7) * (1 + Math.sin(f / 9 + i) * 0.12);
    return <path key={i} d={`M${r1(x)} ${r1(y - k)} Q ${r1(x + k * 0.2)} ${r1(y - k * 0.2)} ${r1(x + k)} ${r1(y)} Q ${r1(x + k * 0.2)} ${r1(y + k * 0.2)} ${r1(x)} ${r1(y + k)} Q ${r1(x - k * 0.2)} ${r1(y + k * 0.2)} ${r1(x - k)} ${r1(y)} Q ${r1(x - k * 0.2)} ${r1(y - k * 0.2)} ${r1(x)} ${r1(y - k)} Z`} fill={i % 4 ? KM.blanco : KM.ocreClaro} />;
  })}</g>
);
/** Monte de Kamasan: cono de roca con faldas verdes, crestas y espirales; humo o fuego en el cráter. */
export const Gunung: React.FC<{ x: number; y?: number; w?: number; h?: number; c?: string; c2?: string; f?: number; humo?: boolean; api?: boolean }> = ({ x, y = SUELO, w = 700, h = 520, c = '#7686A6', c2 = KM.verde, f = 0, humo, api }) => {
  const cima = `M${r1(-w / 2)} 0 L ${r1(-w * 0.13)} ${r1(-h * 0.95)} L ${r1(-w * 0.06)} ${r1(-h)} L ${r1(w * 0.06)} ${r1(-h)} L ${r1(w * 0.13)} ${r1(-h * 0.95)} L ${r1(w / 2)} 0 Z`;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)})`}>
      {humo && [0, 1, 2].map((k) => { const t = ((f * 0.5 + k * 40) % 120) / 120; return <g key={k} opacity={1 - t} transform={`translate(${r1(Math.sin(t * 3 + k) * 20 + t * 60)} ${r1(-h - 30 - t * 160)}) scale(${r1(0.25 + t * 0.35)})`}><Awan x={0} y={0} f={0} /></g>; })}
      {api && [-1, 0, 1].map((k) => <path key={k} d={`M${k * w * 0.04 - 14} ${r1(-h + 4)} Q ${k * w * 0.04} ${r1(-h - 50 - Math.sin(f / 4 + k) * 14)} ${k * w * 0.04 + 14} ${r1(-h + 4)} Z`} fill={k ? KM.rojo : KM.ocreClaro} stroke={NEGRO} strokeWidth={1.6} />)}
      <path d={cima} fill={c} stroke={NEGRO} strokeWidth={3} />
      <path d={`M${r1(-w / 2)} 0 L ${r1(-w * 0.3)} ${r1(-h * 0.42)} Q 0 ${r1(-h * 0.34)} ${r1(w * 0.3)} ${r1(-h * 0.42)} L ${r1(w / 2)} 0 Z`} fill={c2} stroke={NEGRO} strokeWidth={2.4} />
      {[-0.08, 0.02, 0.1].map((k, i) => <path key={i} d={`M${r1(w * k)} ${r1(-h * 0.97)} L ${r1(w * k * 2.6 + (i - 1) * 30)} ${r1(-h * 0.45)}`} stroke={NEGRO} strokeWidth={2} opacity={0.35} />)}
      {[[-0.22, 0.2], [0.18, 0.16], [-0.05, 0.25], [0.32, 0.08], [-0.34, 0.1]].map(([kx, ky], i) => <Espiral key={i} x={w * kx} y={-h * ky} r={Math.min(w, h) * 0.035} c={KM.verdeClaro} w={2} />)}
      {[[-0.1, 0.62], [0.06, 0.74]].map(([kx, ky], i) => <Espiral key={`e${i}`} x={w * kx} y={-h * ky} r={Math.min(w, h) * 0.03} c={KM.azulClaro} w={1.8} />)}
    </g>
  );
};
/** Agua de Kamasan: azul pálido con filas de crestas que terminan en espiral. */
export const AguaKm: React.FC<{ y: number; f: number; oscura?: boolean; desde?: number; hasta?: number }> = ({ y, f, oscura, desde: x0 = -1800, hasta = 6400 }) => {
  const paso = 110, n = Math.ceil((hasta - x0) / paso);
  const fondo = oscura ? '#2E3F6E' : '#9DB0CF', linea = oscura ? '#8FA0C8' : KM.indigo;
  return (
    <g>
      <rect x={x0} y={y} width={hasta - x0} height={420} fill={fondo} />
      <rect x={x0} y={y + 120} width={hasta - x0} height={300} fill={oscura ? '#24335C' : '#8399BF'} />
      {[0, 1, 2, 3].map((fila) => (
        <g key={fila} transform={`translate(${r1(Math.sin(f / 30 + fila) * 14 + (fila % 2) * paso / 2)} ${y + fila * 34})`}>
          {Array.from({ length: n }, (_, i) => {
            const x = x0 + i * paso;
            return <g key={i}>
              <path d={`M${x} 10 Q ${x + 30} -12 ${x + 62} 6`} stroke={linea} strokeWidth={2.6} fill="none" strokeLinecap="round" />
              <Espiral x={x + 70} y={8} r={7} c={linea} w={2} />
              {fila === 0 && <path d={`M${x + 8} 4 Q ${x + 30} -10 ${x + 52} 2`} stroke={KM.blanco} strokeWidth={2} fill="none" opacity={0.8} />}
            </g>;
          })}
        </g>
      ))}
      <rect x={x0} y={y - 3} width={hasta - x0} height={4} fill={NEGRO} opacity={0.7} />
    </g>
  );
};
/** Terrazas de arroz (sawah): bandas onduladas verdes con agua y matas. */
const SawahTeras: React.FC<{ x: number; y?: number; w?: number; n?: number; f?: number }> = ({ x, y = SUELO, w = 1200, n = 5, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`}>
    {Array.from({ length: n }, (_, k) => {
      const yy = -k * 40 - 10, ww = w * (1 - k * 0.1);
      return <g key={k}>
        <path d={`M${r1(-ww / 2)} ${yy + 40} L ${r1(-ww / 2)} ${yy} Q ${r1(-ww / 4)} ${yy - 14} 0 ${yy} T ${r1(ww / 2)} ${yy} L ${r1(ww / 2)} ${yy + 40} Z`} fill={k % 2 ? KM.verdeClaro : KM.verde} stroke={NEGRO} strokeWidth={2} />
        <path d={`M${r1(-ww / 2 + 10)} ${yy + 8} Q ${r1(-ww / 4)} ${yy - 4} 0 ${yy + 8} T ${r1(ww / 2 - 10)} ${yy + 8}`} stroke={KM.azulClaro} strokeWidth={3} fill="none" opacity={0.8} />
        {Array.from({ length: Math.floor(ww / 46) }, (_, i) => <path key={i} d={`M${r1(-ww / 2 + 20 + i * 46)} ${yy + 34} l -4 -16 M${r1(-ww / 2 + 24 + i * 46)} ${yy + 34} l 0 -18 M${r1(-ww / 2 + 28 + i * 46)} ${yy + 34} l 5 -15`} stroke={k % 2 ? KM.verde : KM.verdeClaro} strokeWidth={2} transform={`rotate(${r1(Math.sin(f / 20 + i) * 3)} ${r1(-ww / 2 + 24 + i * 46)} ${yy + 34})`} />)}
      </g>;
    }).reverse()}
  </g>
);
/** Mata de arroz con espigas doradas. */
const Padi: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {[-14, -6, 2, 10, 16].map((dx, i) => { const m = Math.sin(f / 16 + i) * 4; return <g key={i}><path d={`M${dx * 0.3} 0 Q ${dx} -50 ${dx * 2 + m} -100`} stroke={KM.verde} strokeWidth={3} fill="none" /><path d={`M${dx * 2 + m} -100 q 10 6 14 26`} stroke={KM.oro} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray="5 3" /></g>; })}
  </g>
);
/** Palmera de coco (kelapa): tronco curvo anillado, hojas en abanico y cocos. */
const Kelapa: React.FC<{ x: number; y?: number; s?: number; f?: number; inclina?: number }> = ({ x, y = SUELO, s = 1, f = 0, inclina = 0.2 }) => {
  const top: [number, number] = [inclina * 160, -330];
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <path d={`M0 0 Q ${r1(top[0] * 0.2)} -170 ${r1(top[0])} ${top[1]}`} stroke={NEGRO} strokeWidth={22} fill="none" />
      <path d={`M0 0 Q ${r1(top[0] * 0.2)} -170 ${r1(top[0])} ${top[1]}`} stroke={KM.tierra} strokeWidth={16} fill="none" strokeDasharray="10 4" />
      {Array.from({ length: 7 }, (_, i) => {
        const a = -170 + i * 28 + Math.sin(f / 22 + i) * 4, rad = (a * Math.PI) / 180, l = 120 + (i % 2) * 20;
        const ex = top[0] + Math.cos(rad) * l, ey = top[1] + Math.sin(rad) * l * 0.6 + 40;
        const mx = top[0] + Math.cos(rad) * l * 0.5, my = top[1] + Math.sin(rad) * l * 0.5 - 24;
        return <g key={i}><path d={`M${r1(top[0])} ${top[1]} Q ${r1(mx)} ${r1(my)} ${r1(ex)} ${r1(ey)}`} stroke={NEGRO} strokeWidth={14} fill="none" strokeLinecap="round" /><path d={`M${r1(top[0])} ${top[1]} Q ${r1(mx)} ${r1(my)} ${r1(ex)} ${r1(ey)}`} stroke={i % 2 ? KM.verde : KM.verdeClaro} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="3 2" /></g>;
      })}
      {[[-12, 14], [10, 18], [0, 26]].map(([dx, dy], i) => <circle key={i} cx={top[0] + dx} cy={top[1] + dy} r={10} fill={KM.tierra} stroke={NEGRO} strokeWidth={2} />)}
    </g>
  );
};
/** Banyan (beringin): copa de lóbulos verdes, raíces aéreas y, si es sagrado, tela poleng en el tronco. */
const Beringin: React.FC<{ x: number; y?: number; s?: number; f?: number; poleng?: boolean; noche?: boolean }> = ({ x, y = SUELO, s = 1, f = 0, poleng = true, noche }) => {
  const v1 = noche ? '#33463F' : KM.verde, v2 = noche ? '#4A5E52' : KM.verdeClaro;
  const lob: [number, number, number][] = [[-170, -330, 90], [-60, -400, 110], [80, -390, 105], [180, -320, 85], [-110, -260, 80], [20, -290, 95], [140, -250, 75]];
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      {[-150, -110, 110, 160, -60, 70].map((rx, i) => <path key={i} d={`M${rx} -260 Q ${rx + Math.sin(f / 30 + i) * 5} -130 ${rx + 4} 0`} stroke={KM.tierra} strokeWidth={4} fill="none" opacity={0.85} />)}
      <path d="M-46 0 C -40 -90, -50 -180, -30 -260 L 30 -260 C 46 -180, 40 -90, 52 0 Z" fill={KM.tierra} stroke={NEGRO} strokeWidth={3} />
      <path d="M-10 -40 Q -16 -140 -6 -240 M14 -20 Q 20 -130 12 -240" stroke={NEGRO} strokeWidth={2} opacity={0.4} fill="none" />
      {poleng && <g><path d="M-48 -150 L 46 -150 L 48 -96 L -50 -96 Z" fill={KM.blanco} stroke={NEGRO} strokeWidth={2} />{Array.from({ length: 6 }, (_, i) => Array.from({ length: 3 }, (_, j) => (i + j) % 2 ? null : <rect key={`${i}-${j}`} x={-48 + i * 16} y={-150 + j * 18} width={16} height={18} fill={NEGRO} />))}</g>}
      {lob.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy + Math.sin(f / 40 + i) * 2} r={r} fill={i % 2 ? v2 : v1} stroke={NEGRO} strokeWidth={3} />)}
      {lob.map(([cx, cy, r], i) => <Espiral key={`e${i}`} x={cx} y={cy} r={r * 0.32} c={i % 2 ? v1 : v2} w={2.4} />)}
    </g>
  );
};
/** Frangipani (jepun): árbol chico de ramas grises con flores blancas de cinco pétalos. */
const Jepun: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M0 0 Q -6 -80 -40 -140 M-4 -70 Q 20 -110 50 -150 M-22 -110 Q -60 -130 -80 -160" stroke={KM.gris} strokeWidth={12} fill="none" strokeLinecap="round" />
    {[[-40, -150], [50, -160], [-80, -170], [6, -190], [-20, -200], [30, -205]].map(([cx, cy], i) => <g key={i}>
      <ellipse cx={cx} cy={cy} rx={42} ry={22} fill={KM.verde} stroke={NEGRO} strokeWidth={2} transform={`rotate(${(i % 3 - 1) * 20} ${cx} ${cy})`} />
      {Array.from({ length: 5 }, (_, k) => <ellipse key={k} cx={cx + 8} cy={cy - 12 - 7} rx={4} ry={8} fill={KM.blanco} stroke={NEGRO} strokeWidth={1} transform={`rotate(${k * 72 + Math.sin(f / 30) * 4} ${cx + 8} ${cy - 12})`} />)}
      <circle cx={cx + 8} cy={cy - 12} r={3} fill={KM.oro} />
    </g>)}
  </g>
);
/** Mata de bambú: cañas segmentadas con hojas finas. */
const Bambu: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {[-30, -12, 6, 24].map((dx, i) => { const t = -360 - (i % 2) * 60, m = Math.sin(f / 26 + i) * 8; return <g key={i}>
      <path d={`M${dx} 0 Q ${dx + m * 0.5} ${t / 2} ${dx + m + (i - 1.5) * 20} ${t}`} stroke={NEGRO} strokeWidth={12} fill="none" />
      <path d={`M${dx} 0 Q ${dx + m * 0.5} ${t / 2} ${dx + m + (i - 1.5) * 20} ${t}`} stroke={i % 2 ? KM.ocre : KM.verdeClaro} strokeWidth={8} fill="none" strokeDasharray="40 3" />
      {[0.4, 0.6, 0.8].map((k, j) => <path key={j} d={`M${r1(dx + m * k)} ${r1(t * k)} q ${(j % 2 ? 1 : -1) * 34} 6 ${(j % 2 ? 1 : -1) * 54} 24`} stroke={KM.verde} strokeWidth={5} fill="none" strokeLinecap="round" />)}
    </g>; })}
  </g>
);
/** Meru: santuario de techos de paja negra superpuestos (impares) sobre base de piedra. */
export const Meru: React.FC<{ x: number; y?: number; s?: number; n?: number }> = ({ x, y = SUELO, s = 1, n = 5 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-90 0 V -30 H -76 V -60 H 76 V -30 H 90 V 0 Z" fill={KM.crema2} stroke={NEGRO} strokeWidth={2.5} />
    <path d="M-80 -30 H 80" stroke={KM.rojo} strokeWidth={4} />
    <rect x={-50} y={-130} width={100} height={70} fill={KM.rojo} stroke={NEGRO} strokeWidth={2.5} />
    <rect x={-16} y={-116} width={32} height={56} fill={KM.oro} stroke={NEGRO} strokeWidth={2} />
    {Array.from({ length: n }, (_, k) => {
      const yb = -130 - k * 52, w = 150 - k * (100 / n);
      return <g key={k}>
        {k > 0 && <rect x={-w * 0.22} y={yb - 2} width={w * 0.44} height={14} fill={KM.tierra} stroke={NEGRO} strokeWidth={1.6} />}
        <path d={`M${r1(-w)} ${yb} L ${r1(-w * 0.62)} ${yb - 40} L ${r1(w * 0.62)} ${yb - 40} L ${r1(w)} ${yb} Z`} fill="#2C2420" stroke={NEGRO} strokeWidth={2.4} />
        <path d={`M${r1(-w * 0.9)} ${yb - 6} L ${r1(w * 0.9)} ${yb - 6}`} stroke="#5A4A40" strokeWidth={2} />
      </g>;
    })}
    <path d={`M-8 ${-130 - n * 52 + 12} L 0 ${-130 - n * 52 - 30} L 8 ${-130 - n * 52 + 12} Z`} fill={KM.oro} stroke={NEGRO} strokeWidth={1.8} />
  </g>
);
/** Portal partido (candi bentar): dos torres escalonadas de ladrillo rojo con piedra gris, espejadas. */
export const CandiBentar: React.FC<{ x: number; y?: number; s?: number; hueco?: number; noche?: boolean }> = ({ x, y = SUELO, s = 1, hueco = 120, noche }) => {
  const mitad = (k: 1 | -1) => {
    const g = hueco / 2;
    const pts = [[g, 0], [g, -360], [g + 14, -380], [g + 14, -420], [g + 30, -440], [g + 40, -470], [g + 60, -470], [g + 70, -420], [g + 100, -400], [g + 110, -340], [g + 140, -320], [g + 150, -200], [g + 170, -180], [g + 170, 0]];
    const d = 'M' + pts.map(([px, py]) => `${px * k} ${py}`).join(' L ') + ' Z';
    return <g key={k}>
      <path d={d} fill={noche ? '#6A2A22' : KM.rojo} stroke={NEGRO} strokeWidth={3} />
      {[-60, -140, -220, -300].map((yy) => <path key={yy} d={`M${(g) * k} ${yy} L ${(g + 150) * k} ${yy}`} stroke={noche ? '#7E7466' : KM.crema2} strokeWidth={6} />)}
      {[-60, -140, -220, -300].map((yy) => <path key={`l${yy}`} d={`M${(g) * k} ${yy + 4} L ${(g + 150) * k} ${yy + 4}`} stroke={NEGRO} strokeWidth={1} opacity={0.5} />)}
      <circle cx={(g + 60) * k} cy={-260} r={16} fill={KM.crema2} stroke={NEGRO} strokeWidth={2} />
      <Espiral x={(g + 60) * k} y={-258} r={9} c={KM.rojoOsc} w={1.6} />
    </g>;
  };
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      {mitad(-1)}{mitad(1)}
      {[0, 1, 2].map((k) => <rect key={k} x={-hueco / 2 - 10 + k * 6} y={-14 - k * 14} width={hueco + 20 - k * 12} height={14} fill={KM.gris} stroke={NEGRO} strokeWidth={1.6} />)}
    </g>
  );
};
/** Pabellón abierto (bale): plataforma, postes y techo de paja. */
const Bale: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-130} y={-60} width={260} height={60} fill={KM.crema2} stroke={NEGRO} strokeWidth={2.5} />
    <path d="M-130 -30 H 130" stroke={KM.rojo} strokeWidth={4} />
    {[-110, -40, 40, 110].map((px) => <rect key={px} x={px - 7} y={-220} width={14} height={160} fill={KM.tierra} stroke={NEGRO} strokeWidth={2} />)}
    <path d="M-180 -200 L -90 -290 L 90 -290 L 180 -200 Z" fill={KM.ocre} stroke={NEGRO} strokeWidth={3} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-170 + i * 30} -204 L ${-86 + i * 15} -286`} stroke={KM.tierra} strokeWidth={1.6} opacity={0.6} />)}
  </g>
);
/** Torre del tambor de madera (kulkul). */
const Kulkul: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-70 0 V -60 H -60 V -260 H 60 V -60 H 70 V 0 Z" fill={KM.rojo} stroke={NEGRO} strokeWidth={3} />
    {[-100, -160, -220].map((yy) => <path key={yy} d={`M-60 ${yy} H 60`} stroke={KM.crema2} strokeWidth={6} />)}
    {[-48, 48].map((px) => <rect key={px} x={px - 6} y={-380} width={12} height={120} fill={KM.tierra} stroke={NEGRO} strokeWidth={2} />)}
    <g transform={`rotate(${r1(Math.sin(f / 18) * 2)} 0 -360)`}><rect x={-12} y={-360} width={24} height={86} rx={10} fill={KM.tierra} stroke={NEGRO} strokeWidth={2} /><path d="M0 -350 V -284" stroke={NEGRO} strokeWidth={3} /></g>
    <path d="M-100 -370 L -40 -440 L 40 -440 L 100 -370 Z" fill="#2C2420" stroke={NEGRO} strokeWidth={2.5} />
  </g>
);
/** Tortuga del mundo (Bedawang Nala) dibujada como base de piedra, con dos naga enroscadas. */
const TortugaBase: React.FC<{ w?: number }> = ({ w = 140 }) => (
  <g>
    <path d={`M${-w} 0 C ${-w} ${-w * 0.7}, ${w} ${-w * 0.7}, ${w} 0 Z`} fill={KM.verde} stroke={NEGRO} strokeWidth={2.5} />
    {[-0.5, 0, 0.5].map((k, i) => <path key={i} d={`M${w * k - w * 0.2} ${-w * 0.08} L ${w * k} ${-w * 0.36} L ${w * k + w * 0.2} ${-w * 0.08} Z`} fill="none" stroke={KM.verdeClaro} strokeWidth={2} />)}
    <path d={`M${w} -20 Q ${w + 40} -40 ${w + 50} -10 Q ${w + 40} 4 ${w} -4 Z`} fill={KM.verde} stroke={NEGRO} strokeWidth={2} />
    <circle cx={w + 36} cy={-18} r={3} fill={NEGRO} />
    {[1, -1].map((k) => <path key={k} d={`M${-w * 0.9} ${-w * 0.2 * (k > 0 ? 1 : 2)} C ${-w * 0.3} ${-w * (k > 0 ? 0.7 : 0.1)}, ${w * 0.3} ${-w * (k > 0 ? 0.1 : 0.7)}, ${w * 0.9} ${-w * 0.2 * (k > 0 ? 2 : 1)}`} stroke={NEGRO} strokeWidth={13} fill="none" />)}
    {[1, -1].map((k) => <path key={`n${k}`} d={`M${-w * 0.9} ${-w * 0.2 * (k > 0 ? 1 : 2)} C ${-w * 0.3} ${-w * (k > 0 ? 0.7 : 0.1)}, ${w * 0.3} ${-w * (k > 0 ? 0.1 : 0.7)}, ${w * 0.9} ${-w * 0.2 * (k > 0 ? 2 : 1)}`} stroke={k > 0 ? KM.oro : KM.ocreClaro} strokeWidth={8} fill="none" strokeDasharray="6 3" />)}
  </g>
);
/** Padmasana: trono de piedra escalonado y vacío para el Dios supremo, sobre la tortuga y las naga. */
const Padmasana: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => {
  const pisos: [number, number, number][] = [[-40, -110, 110], [-110, -170, 96], [-170, -230, 88], [-230, -280, 78], [-280, -320, 70]];
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      {pisos.map(([y0, y1, w], i) => <g key={i}>
        <path d={`M${-w} ${y0} L ${-w + 8} ${y1 + 10} L ${-w - 6} ${y1} L ${w + 6} ${y1} L ${w - 8} ${y1 + 10} L ${w} ${y0} Z`} fill={i % 2 ? KM.crema2 : '#D8C49A'} stroke={NEGRO} strokeWidth={2.4} />
        <path d={`M${-w + 10} ${y1 + 14} H ${w - 10}`} stroke={KM.rojo} strokeWidth={3} />
        {[-0.5, 0, 0.5].map((k) => <Espiral key={k} x={w * k} y={(y0 + y1) / 2 + 4} r={8} c={KM.rojoOsc} w={1.6} />)}
      </g>)}
      <path d="M-60 -320 L -60 -340 L 60 -340 L 60 -320 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={2} />
      <path d="M-44 -340 L -48 -440 C -60 -450, -70 -470, -56 -482 C -40 -470, -34 -460, -30 -448 L 30 -448 C 34 -460, 40 -470, 56 -482 C 70 -470, 60 -450, 48 -440 L 44 -340 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={2.4} />
      <path d="M-30 -350 L -30 -430 L 30 -430 L 30 -350 Z" fill={KM.crema} stroke={NEGRO} strokeWidth={1.8} />
      <circle cx={0} cy={-392} r={12} fill={KM.rojo} stroke={NEGRO} strokeWidth={1.6} />
      <TortugaBase w={130} />
    </g>
  );
};
/** Penjor: caña de bambú alta que se curva arriba, con adornos de hoja de palma (Galungan). */
const Penjor: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => {
  const m = Math.sin(f / 24) * 10;
  const pts: [number, number][] = [[0, 0], [6, -200], [20, -400], [80 + m * 0.5, -540], [180 + m, -560], [240 + m, -500]];
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <path d={suave(pts)} stroke={NEGRO} strokeWidth={12} fill="none" />
      <path d={suave(pts)} stroke={KM.ocreClaro} strokeWidth={8} fill="none" />
      {[0.25, 0.4, 0.55, 0.7, 0.82].map((k, i) => { const p = pts[Math.floor(k * 5)]; return <path key={i} d={`M${p[0]} ${p[1]} q -20 20 -14 46 M${p[0]} ${p[1]} q 20 18 16 44`} stroke={KM.ocreClaro} strokeWidth={4} fill="none" />; })}
      <g transform={`translate(${240 + m} -500) rotate(${r1(Math.sin(f / 18) * 6)})`}>
        <path d="M0 0 L -14 60 L 0 110 L 14 60 Z" fill={KM.ocreClaro} stroke={NEGRO} strokeWidth={2} />
        <path d="M-10 40 H 10 M-12 70 H 12" stroke={KM.rojo} strokeWidth={3} />
        {[-6, 0, 6].map((dx) => <path key={dx} d={`M${dx} 110 v 30`} stroke={KM.ocreClaro} strokeWidth={2} />)}
      </g>
      <rect x={-22} y={-150} width={44} height={36} fill={KM.tierra} stroke={NEGRO} strokeWidth={2} />
      <path d="M-30 -150 L 0 -176 L 30 -150 Z" fill={KM.ocre} stroke={NEGRO} strokeWidth={2} />
      <path d="M-8 -60 L 0 -40 L 8 -60 L 8 -110 L -8 -110 Z" fill={KM.blanco} stroke={NEGRO} strokeWidth={1.4} />
    </g>
  );
};
/** Ofrenda alta de frutas (gebogan). */
const Gebogan: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-26 0 L -18 -24 L 18 -24 L 26 0 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={2} />
    {Array.from({ length: 5 }, (_, k) => Array.from({ length: 4 - Math.floor(k / 2) }, (_, i) => { const n = 4 - Math.floor(k / 2); return <circle key={`${k}-${i}`} cx={(i - (n - 1) / 2) * 16} cy={-34 - k * 15} r={9} fill={[KM.rojo, KM.ocreClaro, KM.verdeClaro, KM.rosa][(i + k) % 4]} stroke={NEGRO} strokeWidth={1.4} />; }))}
    <path d="M0 -110 L -14 -140 M0 -110 L 0 -150 M0 -110 L 14 -140" stroke={KM.ocreClaro} strokeWidth={4} />
  </g>
);
/** Ofrenda chica (canang): bandejita de hoja de palma con flores de colores. */
const Canang: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-26 0 L -22 -14 L 22 -14 L 26 0 Z" fill={KM.verdeClaro} stroke={NEGRO} strokeWidth={1.6} />
    {[[-12, KM.rojo], [0, KM.blanco], [12, KM.ocreClaro], [-5, KM.azul], [6, KM.rosa]].map(([dx, c], i) => <circle key={i} cx={dx as number} cy={i > 2 ? -26 : -20} r={6} fill={c as string} stroke={NEGRO} strokeWidth={1} />)}
  </g>
);
/** Libro de hoja de palma (lontar): tiras atadas con un cordón, entre dos tapas de madera. */
export const Lontar: React.FC<{ x?: number; y?: number; s?: number; brillo?: boolean; f?: number }> = ({ x = 0, y = 0, s = 1, brillo, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {brillo && <circle r={70} cy={-16} fill={KM.ocreClaro} opacity={0.3 + Math.sin(f / 6) * 0.1} />}
    <rect x={-60} y={-30} width={120} height={8} fill={KM.tierra} stroke={NEGRO} strokeWidth={1.6} />
    {[0, 1, 2, 3].map((k) => <rect key={k} x={-58} y={-22 + k * 5} width={116} height={5} fill={KM.ocreClaro} stroke={KM.tierra} strokeWidth={0.8} />)}
    <rect x={-60} y={-2} width={120} height={8} fill={KM.tierra} stroke={NEGRO} strokeWidth={1.6} />
    <path d="M-30 -30 V 6 M30 -30 V 6" stroke={KM.rojo} strokeWidth={2.4} />
    <path d="M-30 6 q -6 14 -16 16" stroke={KM.rojo} strokeWidth={2} fill="none" />
  </g>
);
/** Campana de sacerdote (genta) con mango de vajra. */
export const Genta: React.FC<{ x?: number; y?: number; s?: number; f?: number }> = ({ x = 0, y = 0, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s}) rotate(${r1(Math.sin(f / 3) * 4)})`}>
    <path d="M-4 -60 L -8 -76 L 0 -90 L 8 -76 L 4 -60 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={1.6} />
    <rect x={-4} y={-60} width={8} height={22} fill={KM.oro} stroke={NEGRO} strokeWidth={1.4} />
    <path d="M-22 0 C -22 -30, -14 -40, 0 -40 C 14 -40, 22 -30, 22 0 Z" fill={KM.oro} stroke={NEGRO} strokeWidth={2} />
    <path d="M-20 -8 H 20" stroke={KM.rojoOsc} strokeWidth={2} />
    <circle cx={0} cy={4} r={4} fill={NEGRO} />
  </g>
);
/** Pozo de piedra (sumur); props.hondo = se ve el hueco profundo (Kebo Iwa). */
const Sumur: React.FC<{ x: number; y?: number; s?: number; hondo?: boolean }> = ({ x, y = SUELO, s = 1, hondo }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {hondo && <path d="M-70 0 L -60 160 L 60 160 L 70 0 Z" fill="#2A1E18" />}
    <ellipse cx={0} cy={-6} rx={90} ry={22} fill={hondo ? '#1A120E' : '#2A3550'} stroke={NEGRO} strokeWidth={2} />
    <path d="M-96 -6 V -60 Q 0 -86 96 -60 V -6 Q 0 26 -96 -6 Z" fill={KM.crema2} stroke={NEGRO} strokeWidth={2.5} />
    <ellipse cx={0} cy={-60} rx={96} ry={24} fill="#2A2420" stroke={NEGRO} strokeWidth={2.5} />
    {[-60, -20, 20, 60].map((px) => <path key={px} d={`M${px} -50 V -4`} stroke={NEGRO} strokeWidth={1.4} opacity={0.4} />)}
  </g>
);
/** Fuente de caños (pancuran) de Tirta Empul: muro de piedra con caños que vierten agua a la pileta. */
const Pancuran: React.FC<{ x: number; y?: number; s?: number; f: number; n?: number }> = ({ x, y = SUELO, s = 1, f, n = 6 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-n * 50} y={-150} width={n * 100} height={150} fill={KM.gris} stroke={NEGRO} strokeWidth={3} />
    <rect x={-n * 50} y={-150} width={n * 100} height={22} fill={KM.crema2} stroke={NEGRO} strokeWidth={2} />
    {Array.from({ length: n }, (_, i) => {
      const px = -n * 50 + 50 + i * 100;
      return <g key={i}>
        <path d={`M${px - 16} -112 Q ${px} -134 ${px + 16} -112 L ${px + 10} -96 L ${px - 10} -96 Z`} fill={KM.crema2} stroke={NEGRO} strokeWidth={1.6} />
        {Array.from({ length: 3 }, (_, k) => <path key={k} d={`M${px + 4} -98 Q ${px + 22} -60 ${px + 20} -4`} stroke={KM.blanco} strokeWidth={4 - k} fill="none" strokeDasharray="12 10" strokeDashoffset={-(f * 3 + k * 7)} opacity={0.9} />)}
      </g>;
    })}
    <rect x={-n * 50 - 20} y={-8} width={n * 100 + 40} height={20} fill="#9DB0CF" stroke={NEGRO} strokeWidth={2} />
  </g>
);
/** Pileta (kolam): agua quieta con bordes de piedra. */
const Kolam: React.FC<{ x: number; y?: number; s?: number; f: number; w?: number }> = ({ x, y = SUELO, s = 1, f, w = 900 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-w / 2} y={-30} width={w} height={44} fill="#9DB0CF" stroke={NEGRO} strokeWidth={2.4} />
    {Array.from({ length: Math.floor(w / 80) }, (_, i) => <path key={i} d={`M${-w / 2 + 20 + i * 80 + Math.sin(f / 20 + i) * 6} -16 q 14 -6 28 0`} stroke={KM.blanco} strokeWidth={2} fill="none" />)}
    <rect x={-w / 2 - 14} y={-40} width={14} height={54} fill={KM.gris} stroke={NEGRO} strokeWidth={2} />
    <rect x={w / 2} y={-40} width={14} height={54} fill={KM.gris} stroke={NEGRO} strokeWidth={2} />
  </g>
);
/** Bote balinés (jukung): casco fino con proa de pico y ojo, balancines y vela opcional. */
const Jukung: React.FC<{ x: number; y?: number; s?: number; f: number; layar?: boolean }> = ({ x, y = SUELO - 20, s = 1, f, layar = true }) => (
  <g transform={`translate(${r1(x)} ${r1(y + Math.sin(f / 14) * 4)}) scale(${s}) rotate(${r1(Math.sin(f / 18) * 1.5)})`}>
    {layar && <><path d="M-10 -24 L -10 -230" stroke={KM.tierra} strokeWidth={6} /><path d="M-6 -226 Q 90 -150 70 -40 L -6 -40 Z" fill={KM.blanco} stroke={NEGRO} strokeWidth={2.4} />{[0, 1, 2].map((k) => <path key={k} d={`M-6 ${-190 + k * 50} L ${44 + k * 10} ${-160 + k * 46}`} stroke={KM.rojo} strokeWidth={6} />)}</>}
    <path d="M-60 -50 L 60 -50 M-30 -50 L -40 -10 M30 -50 L 40 -10" stroke={KM.tierra} strokeWidth={5} fill="none" />
    <path d="M-150 -10 L 150 -10" stroke={KM.tierra} strokeWidth={8} />
    <path d="M-170 -36 C -120 -10, 120 -10, 180 -40 L 220 -70 L 196 -36 C 150 0, -120 4, -170 -36 Z" fill={KM.blanco} stroke={NEGRO} strokeWidth={2.6} />
    <path d="M-160 -28 C -110 -8, 120 -8, 170 -30" stroke={KM.indigo} strokeWidth={5} fill="none" />
    <path d="M-150 -20 C -100 -4, 110 -4, 160 -22" stroke={KM.rojo} strokeWidth={4} fill="none" />
    <circle cx={158} cy={-40} r={7} fill={KM.blanco} stroke={NEGRO} strokeWidth={2} /><circle cx={160} cy={-40} r={3} fill={NEGRO} />
  </g>
);
/** Roca en el mar con templo arriba (Tanah Lot). */
const BatuPura: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-230 0 L -210 -110 L -170 -130 L -150 -220 L -90 -250 L -40 -300 L 60 -290 L 110 -240 L 160 -230 L 190 -130 L 230 -100 L 250 0 Z" fill="#6E5E4A" stroke={NEGRO} strokeWidth={3} />
    {[[-150, -90], [-60, -180], [40, -120], [130, -150], [-10, -240], [160, -60]].map(([px, py], i) => <Karang key={i} x={px} y={py} w={70} h={30} c="#8A7A62" c2="#4A3E30" />)}
    <path d="M-110 -250 Q -60 -300 0 -296 Q 70 -300 120 -246" stroke={KM.verde} strokeWidth={14} fill="none" />
    <Meru x={-10} y={-292} s={0.42} n={3} />
    <Meru x={90} y={-276} s={0.32} n={3} />
    <Jepun x={-110} y={-250} s={0.45} />
  </g>
);
/** Kayonan: la hoja-montaña del teatro de sombras, con el árbol de la vida y borde de llamas. */
const Kayonan: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s}) rotate(${r1(Math.sin(f / 30) * 2)} 0 0)`}>
    <path d="M0 -420 C 120 -300, 150 -130, 110 0 L -110 0 C -150 -130, -120 -300, 0 -420 Z" fill={KM.rojo} stroke={NEGRO} strokeWidth={4} />
    <path d="M0 -390 C 104 -286, 128 -130, 92 -14 L -92 -14 C -128 -130, -104 -286, 0 -390 Z" fill={KM.crema} stroke={KM.ocre} strokeWidth={3} />
    <path d="M0 -20 V -330" stroke={KM.tierra} strokeWidth={10} />
    {[-300, -250, -200, -150, -100].map((yy, i) => [-1, 1].map((k) => <g key={`${i}${k}`}><path d={`M0 ${yy} Q ${k * 50} ${yy - 30} ${k * (70 - i * 4 + Math.abs(yy) * 0.05)} ${yy + 10}`} stroke={KM.tierra} strokeWidth={4} fill="none" /><Espiral x={k * (70 - i * 4 + Math.abs(yy) * 0.05)} y={yy + 4} r={10} c={KM.verde} w={2.4} /></g>))}
    <path d="M-40 -20 L -40 -70 L 0 -96 L 40 -70 L 40 -20 Z" fill={KM.indigo} stroke={NEGRO} strokeWidth={2} />
    <rect x={-12} y={-60} width={24} height={40} fill={KM.oro} stroke={NEGRO} strokeWidth={1.6} />
  </g>
);
/** Sombrilla ceremonial (tedung) con fleco. */
const Tedung: React.FC<{ x: number; y?: number; s?: number; c?: string }> = ({ x, y = SUELO, s = 1, c = KM.rojo }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M0 0 V -300" stroke={KM.tierra} strokeWidth={8} />
    <path d="M-80 -270 Q 0 -340 80 -270 Z" fill={c} stroke={NEGRO} strokeWidth={2.6} />
    <path d="M-80 -270 H 80" stroke={KM.oro} strokeWidth={8} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-76 + i * 19} -266 v 26`} stroke={KM.oro} strokeWidth={4} />)}
    <circle cx={0} cy={-320} r={7} fill={KM.oro} stroke={NEGRO} strokeWidth={1.6} />
  </g>
);
/** Montoncito de ceniza con un hilo de humo. */
const Abu: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d={`M-10 -30 Q ${-20 + Math.sin(f / 10) * 8} -80 ${Math.sin(f / 8) * 10} -130`} stroke={KM.gris} strokeWidth={5} fill="none" opacity={0.6} strokeLinecap="round" />
    <path d="M-80 0 C -60 -30, -20 -44, 0 -44 C 30 -44, 60 -26, 80 0 Z" fill="#8E8A80" stroke={NEGRO} strokeWidth={2} />
    {[-40, -10, 24, 50].map((px, i) => <circle key={i} cx={px} cy={-12 - (i % 2) * 10} r={3} fill="#5A5650" />)}
  </g>
);
/** Muro de piedra y ladrillo de aldea o templo, con remates. */
const Tembok: React.FC<{ x: number; y?: number; w?: number; h?: number; noche?: boolean }> = ({ x, y = SUELO, w = 900, h = 150, noche }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} fill={noche ? '#5A2A26' : '#A8503A'} stroke={NEGRO} strokeWidth={2.5} />
    {Array.from({ length: Math.floor(h / 22) }, (_, k) => <path key={k} d={`M${-w / 2} ${-h + 22 + k * 22} H ${w / 2}`} stroke={noche ? '#3A1A16' : KM.rojoOsc} strokeWidth={1.4} />)}
    <rect x={-w / 2 - 6} y={-h - 16} width={w + 12} height={18} fill={noche ? '#7E7466' : KM.crema2} stroke={NEGRO} strokeWidth={2} />
    {Array.from({ length: Math.floor(w / 120) + 1 }, (_, i) => <path key={i} d={`M${-w / 2 + i * 120 - 14} ${-h - 16} L ${-w / 2 + i * 120} ${-h - 40} L ${-w / 2 + i * 120 + 14} ${-h - 16} Z`} fill={noche ? '#7E7466' : KM.crema2} stroke={NEGRO} strokeWidth={1.6} />)}
  </g>
);
/** Isla lejana con acantilados (Nusa Penida) o costa. */
const Pulau: React.FC<{ x: number; y?: number; w?: number; h?: number; c?: string }> = ({ x, y = SUELO, w = 900, h = 160, c = '#6F7F9C' }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`}>
    <path d={`M${-w / 2} 0 L ${-w * 0.42} ${-h * 0.8} L ${-w * 0.2} ${-h} L ${w * 0.1} ${-h * 0.9} L ${w * 0.3} ${-h} L ${w * 0.44} ${-h * 0.7} L ${w / 2} 0 Z`} fill={c} stroke={NEGRO} strokeWidth={2.4} />
    <path d={`M${-w * 0.44} ${-h * 0.75} L ${-w * 0.2} ${-h * 0.94} L ${w * 0.1} ${-h * 0.84} L ${w * 0.3} ${-h * 0.94} L ${w * 0.42} ${-h * 0.68}`} stroke={KM.verde} strokeWidth={10} fill="none" />
  </g>
);

/** Nubes en voluta repartidas por el cielo (relleno de Kamasan). */
const NubesCielo: React.FC<{ f: number; oscura?: boolean }> = ({ f, oscura }) => (
  <g>{[[-300, 300, 0.6], [350, 220, 0.5], [900, 330, 0.7], [1450, 250, 0.55], [2100, 310, 0.65], [2700, 230, 0.5]].map(([x, y, s], i) => <Awan key={i} x={x} y={y} s={s} f={f + i * 40} oscura={oscura} />)}</g>
);

// ---------- suelos especiales ----------
const SueloNubes: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-1600} y={SUELO + 4} width={8000} height={260} fill={KM.blanco} />
    {Array.from({ length: 34 }, (_, i) => <Awan key={i} x={-1600 + i * 240} y={SUELO + 30} s={0.9} f={f + i * 30} />)}
  </g>
);
const SueloOscuro: React.FC = () => (
  <g>
    <rect x={-1600} y={SUELO} width={8000} height={260} fill="#2A2228" />
    <rect x={-1600} y={SUELO} width={8000} height={5} fill={NEGRO} />
    {Array.from({ length: 90 }, (_, i) => <Karang key={i} x={-1600 + i * 90 + 14} y={SUELO + 40} w={46} h={20} c="#3E3438" c2="#6A5A60" />)}
  </g>
);

// ---------- fondos ----------
export function fondoBalines(tipo: string, f: number, astros = true): React.ReactNode | null {
  switch (tipo) {
    case 'kahyangan': return (
      <>
        <Capa p={0.08}>{astros && <Surya x={1600} y={250} r={46} f={f} />}</Capa>
        <Capa p={0.2}>{[[-200, 330], [600, 290], [1300, 350], [2100, 300], [2800, 330]].map(([x, y], i) => <Awan key={i} x={x} y={y} s={1} f={f} />)}</Capa>
        <Capa p={0.4}><Meru x={300} y={SUELO - 150} s={0.55} n={9} /><Meru x={1500} y={SUELO - 150} s={0.5} n={7} /><Meru x={2400} y={SUELO - 150} s={0.45} n={5} />{[[0, 650], [900, 640], [1800, 660], [2700, 640]].map(([x, y], i) => <Awan key={i} x={x} y={y} s={1.5} f={f} />)}</Capa>
        <Capa p={1}><SueloNubes f={f} /></Capa>
      </>
    );
    case 'segara': return (
      <>
        <Capa p={0.06}>{astros && <Surya x={1650} y={240} r={40} f={f} />}</Capa>
        <Capa p={0.2}>{[[100, 300], [900, 260], [1700, 320], [2500, 280]].map(([x, y], i) => <Awan key={i} x={x} y={y} s={0.8} f={f} />)}</Capa>
        <Capa p={0.5}><AguaKm y={SUELO - 160} f={f * 0.6} desde={-1800} hasta={4200} /></Capa>
        <Capa p={1}><AguaKm y={SUELO - 40} f={f} desde={-1800} hasta={6400} /></Capa>
      </>
    );
    case 'dasar_segara': return (
      <>
        <Capa p={0.1}>{Array.from({ length: 16 }, (_, i) => <circle key={i} cx={-200 + azar(i) * 2400} cy={200 + ((azar(i + 3) * 500 - f * (0.6 + azar(i))) % 520 + 520) % 520} r={4 + azar(i + 1) * 6} fill="none" stroke={KM.azulClaro} strokeWidth={2} opacity={0.6} />)}</Capa>
        <Capa p={0.25}>{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-400 + i * 500} ${SUELO} Q ${-380 + i * 500 + Math.sin(f / 30 + i) * 20} ${SUELO - 200} ${-360 + i * 500} ${SUELO - 330}`} stroke="#3F6A6A" strokeWidth={14} fill="none" strokeLinecap="round" />)}</Capa>
        <Capa p={0.5}>{Array.from({ length: 10 }, (_, i) => <Karang key={i} x={-600 + i * 360} y={SUELO - 10} w={180} h={70 + (i % 3) * 30} c="#3A4466" c2="#7F95BC" />)}</Capa>
        <Capa p={1}><SueloOscuro /></Capa>
      </>
    );
    case 'gunung_agung': return (
      <>
        <Capa p={0.06}>{astros && <Surya x={1650} y={230} r={40} f={f} />}</Capa>
        <Capa p={0.15}><NubesCielo f={f} /></Capa>
        <Capa p={0.15}><Gunung x={1000} y={SUELO - 70} w={1300} h={560} f={f} humo /></Capa>
        <Capa p={0.3}><Meru x={760} y={SUELO - 160} s={0.3} n={11} /><Meru x={900} y={SUELO - 150} s={0.26} n={9} /><Meru x={1040} y={SUELO - 150} s={0.24} n={7} /></Capa>
        <Capa p={0.45}><SawahTeras x={300} y={SUELO - 40} w={1200} n={4} f={f} /><SawahTeras x={1800} y={SUELO - 40} w={1300} n={4} f={f} /></Capa>
        <Capa p={0.8}>{[-200, 600, 1500, 2400, 3200].map((x, i) => <Kelapa key={i} x={x} y={SUELO} s={0.9} f={f + i * 10} inclina={i % 2 ? -0.2 : 0.25} />)}</Capa>
        <Capa p={1}><SueloKamasan desde={-1600} hasta={6400} /></Capa>
      </>
    );
    case 'danau_batur': return (
      <>
        <Capa p={0.06}>{astros && <Surya x={1650} y={240} r={40} f={f} />}</Capa>
        <Capa p={0.15}><NubesCielo f={f} /></Capa>
        <Capa p={0.12}><Pulau x={600} y={SUELO - 180} w={2400} h={120} c="#8794B0" /></Capa>
        <Capa p={0.2}><Gunung x={1300} y={SUELO - 180} w={760} h={300} c="#6E6A7E" c2="#5A6A50" f={f} humo /></Capa>
        <Capa p={0.4}><AguaKm y={SUELO - 190} f={f * 0.4} desde={-1200} hasta={4400} /><Meru x={400} y={SUELO - 150} s={0.35} n={11} /><Meru x={560} y={SUELO - 150} s={0.3} n={7} /></Capa>
        <Capa p={0.8}>{[-100, 1900, 2800].map((x, i) => <Beringin key={i} x={x} y={SUELO - 20} s={0.7} f={f} poleng={false} />)}</Capa>
        <Capa p={1}><SueloKamasan desde={-1600} hasta={6400} color="#A88A5A" /></Capa>
      </>
    );
    case 'sawah': return (
      <>
        <Capa p={0.06}>{astros && <Surya x={1600} y={240} r={42} f={f} />}</Capa>
        <Capa p={0.15}><NubesCielo f={f} /></Capa>
        <Capa p={0.15}><Gunung x={500} y={SUELO - 150} w={900} h={360} f={f} /><Gunung x={1700} y={SUELO - 150} w={600} h={240} c="#8794B0" f={f} /></Capa>
        <Capa p={0.35}><SawahTeras x={200} y={SUELO - 60} w={1400} n={5} f={f} /><SawahTeras x={1800} y={SUELO - 60} w={1400} n={5} f={f} /><Bale x={1100} y={SUELO - 260} s={0.35} /></Capa>
        <Capa p={0.7}>{[-300, 700, 1700, 2700].map((x, i) => <Kelapa key={i} x={x} y={SUELO - 10} s={0.8} f={f + i * 7} inclina={i % 2 ? -0.25 : 0.2} />)}{Array.from({ length: 30 }, (_, i) => <Padi key={`p${i}`} x={-400 + i * 120} y={SUELO - 6} s={0.6} f={f + i * 3} />)}</Capa>
        <Capa p={1}><SueloKamasan desde={-1600} hasta={6400} color="#7E8A4E" /></Capa>
      </>
    );
    case 'pura': case 'pura_malam': {
      const noche = tipo === 'pura_malam';
      return (
        <>
          <Capa p={0.06}>{astros && (noche ? <><Bintang f={f} n={22} area={[-200, 150, 2400, 260]} /><Bulan x={1600} y={240} r={40} /></> : <Surya x={1650} y={230} r={38} f={f} />)}</Capa>
          <Capa p={0.2}>{noche ? null : [[200, 300], [1200, 270], [2200, 310]].map(([x, y], i) => <Awan key={i} x={x} y={y} s={0.7} f={f} />)}</Capa>
          <Capa p={0.35}><Tembok x={1000} y={SUELO - 70} w={3600} h={110} noche={noche} /><Meru x={300} y={SUELO - 70} s={0.6} n={7} /><Meru x={1700} y={SUELO - 70} s={0.5} n={5} /><Padmasana x={2300} y={SUELO - 70} s={0.55} /></Capa>
          <Capa p={0.6}><CandiBentar x={1000} y={SUELO - 30} s={0.8} hueco={140} noche={noche} />{[-200, 2200, 3000].map((x, i) => <Jepun key={i} x={x} y={SUELO - 30} s={0.9} f={f} />)}</Capa>
          <Capa p={1}><SueloKamasan desde={-1600} hasta={6400} color={noche ? '#5A4A44' : '#B89A6A'} /></Capa>
          {noche && <rect x={-2000} y={0} width={8000} height={1200} fill="#1C2747" opacity={0.28} />}
        </>
      );
    }
    case 'puri': return (
      <>
        <Capa p={0.06}>{astros && <Surya x={1650} y={230} r={38} f={f} />}</Capa>
        <Capa p={0.15}><NubesCielo f={f} /></Capa>
        <Capa p={0.3}><Tembok x={1000} y={SUELO - 60} w={3600} h={160} /><Bale x={500} y={SUELO - 60} s={0.8} /><Bale x={1600} y={SUELO - 60} s={0.7} /><Kulkul x={2400} y={SUELO - 60} s={0.7} f={f} /></Capa>
        <Capa p={0.65}>{[100, 1100, 2100].map((x, i) => <Tedung key={i} x={x} y={SUELO - 20} s={0.9} c={i % 2 ? KM.oro : KM.rojo} />)}{[-200, 2700].map((x, i) => <Jepun key={i} x={x} y={SUELO - 20} f={f} />)}</Capa>
        <Capa p={1}><SueloKamasan desde={-1600} hasta={6400} color="#C2A27A" /></Capa>
      </>
    );
    case 'desa': case 'desa_malam': {
      const noche = tipo === 'desa_malam';
      return (
        <>
          <Capa p={0.06}>{astros && (noche ? <><Bintang f={f} n={20} area={[-200, 150, 2400, 260]} /><Bulan x={1600} y={240} r={38} sabit /></> : <Surya x={1650} y={230} r={38} f={f} />)}</Capa>
          <Capa p={0.15}>{[-100, 800, 1700, 2600].map((x, i) => <Kelapa key={i} x={x} y={SUELO - 150} s={0.7} f={f} inclina={i % 2 ? -0.2 : 0.2} />)}</Capa>
          <Capa p={0.35}><Tembok x={1000} y={SUELO - 50} w={3800} h={120} noche={noche} />{[200, 1300, 2400].map((x, i) => <g key={i}><CandiBentar x={x} y={SUELO - 50} s={0.36} hueco={120} noche={noche} /></g>)}<Kulkul x={1850} y={SUELO - 50} s={0.6} f={f} /><Bale x={750} y={SUELO - 50} s={0.55} /></Capa>
          <Capa p={0.7}>{[0, 1000, 2000, 3000].map((x, i) => <Penjor key={i} x={x} y={SUELO - 10} s={0.8} f={f + i * 9} />)}</Capa>
          <Capa p={1}><SueloKamasan desde={-1600} hasta={6400} color={noche ? '#5A4A44' : '#B89A6A'} /></Capa>
          {noche && <rect x={-2000} y={0} width={8000} height={1200} fill="#1C2747" opacity={0.3} />}
        </>
      );
    }
    case 'setra': return (
      <>
        <Capa p={0.05}>{astros && <><Bintang f={f} n={18} area={[-200, 150, 2400, 240]} /><Bulan x={1550} y={240} r={44} /></>}</Capa>
        <Capa p={0.2}>{[[300, 330], [1300, 300], [2300, 340]].map(([x, y], i) => <Awan key={i} x={x} y={y} s={0.7} f={f} oscura />)}</Capa>
        <Capa p={0.35}><Tembok x={1000} y={SUELO - 60} w={3600} h={100} noche /><CandiBentar x={1700} y={SUELO - 60} s={0.5} hueco={110} noche /></Capa>
        <Capa p={0.65}><Beringin x={400} y={SUELO - 10} s={1.05} f={f} noche /><Beringin x={2300} y={SUELO - 10} s={0.9} f={f} noche />{[1100, 1400, 2900].map((x, i) => <Karang key={i} x={x} y={SUELO - 10} w={60} h={50} c="#4A4448" c2="#8E8A80" />)}</Capa>
        <Capa p={1}><SueloOscuro /></Capa>
        <rect x={-2000} y={SUELO - 120} width={8000} height={130} fill={KM.azulClaro} opacity={0.12 + Math.sin(f / 40) * 0.04} />
      </>
    );
    case 'alas': return (
      <>
        <Capa p={0.06}>{astros && <Surya x={1550} y={230} r={36} f={f} />}</Capa>
        <Capa p={0.15}><NubesCielo f={f} /></Capa>
        <Capa p={0.25}>{[-300, 300, 900, 1500, 2100, 2700].map((x, i) => <Beringin key={i} x={x} y={SUELO - 40} s={0.65} f={f} poleng={false} />)}</Capa>
        <Capa p={0.6}>{[0, 900, 1800, 2700].map((x, i) => <g key={i}><Bambu x={x} y={SUELO - 10} s={0.9} f={f + i * 7} /><Beringin x={x + 450} y={SUELO} s={0.85} f={f + i * 11} poleng={i === 1} /></g>)}</Capa>
        <Capa p={1}><SueloKamasan desde={-1600} hasta={6400} color="#7A6A3A" /></Capa>
      </>
    );
    case 'pantai': return (
      <>
        <Capa p={0.06}>{astros && <Surya x={1650} y={230} r={38} f={f} />}</Capa>
        <Capa p={0.15}><NubesCielo f={f} /></Capa>
        <Capa p={0.15}><Pulau x={1350} y={SUELO - 160} w={1100} h={170} /></Capa>
        <Capa p={0.35}><AguaKm y={SUELO - 170} f={f * 0.4} desde={-1200} hasta={4400} /></Capa>
        <Capa p={0.7}>{[-300, 2300, 3100].map((x, i) => <Kelapa key={i} x={x} y={SUELO - 10} s={1} f={f + i * 13} inclina={i === 0 ? 0.35 : -0.35} />)}<Jukung x={500} y={SUELO - 14} s={0.8} f={f} layar={false} /><Jukung x={1100} y={SUELO - 10} s={0.7} f={f + 20} /></Capa>
        <Capa p={1}><SueloKamasan desde={-1600} hasta={6400} color="#D8C08A" /></Capa>
      </>
    );
    case 'tanah_lot': return (
      <>
        <Capa p={0.06}>{astros && <Surya x={1700} y={300} r={50} f={f} />}</Capa>
        <Capa p={0.2}>{[[200, 280], [1100, 250], [2100, 290]].map(([x, y], i) => <Awan key={i} x={x} y={y} s={0.75} f={f} />)}</Capa>
        <Capa p={0.4}><AguaKm y={SUELO - 140} f={f * 0.5} desde={-1200} hasta={4400} /><BatuPura x={1250} y={SUELO - 90} s={0.95} /></Capa>
        <Capa p={1}><AguaKm y={SUELO - 30} f={f} desde={420} hasta={6400} /><SueloKamasan desde={-1600} hasta={460} color="#D8C08A" /><path d={`M460 ${SUELO} Q 500 ${SUELO + 30} 470 ${SUELO + 230} L 420 ${SUELO + 230} Z`} fill="#D8C08A" /></Capa>
      </>
    );
    case 'tirta_empul': return (
      <>
        <Capa p={0.06}>{astros && <Surya x={1650} y={230} r={38} f={f} />}</Capa>
        <Capa p={0.15}><NubesCielo f={f} /></Capa>
        <Capa p={0.2}>{[-200, 600, 2400].map((x, i) => <Beringin key={i} x={x} y={SUELO - 140} s={0.7} f={f} poleng={false} />)}<Meru x={1500} y={SUELO - 140} s={0.4} n={5} /><Meru x={1800} y={SUELO - 140} s={0.35} n={3} /></Capa>
        <Capa p={0.45}><Tembok x={1000} y={SUELO - 90} w={3600} h={70} /><Pancuran x={900} y={SUELO - 60} s={0.8} f={f} n={8} /></Capa>
        <Capa p={0.75}><Kolam x={900} y={SUELO - 10} f={f} w={2600} /></Capa>
        <Capa p={1}><SueloKamasan desde={-1600} hasta={6400} color="#A8987A" /></Capa>
      </>
    );
    case 'selat': return (
      <>
        <Capa p={0.06}>{astros && <Surya x={960} y={230} r={38} f={f} />}</Capa>
        <Capa p={0.15}><NubesCielo f={f} /></Capa>
        <Capa p={0.18}><Gunung x={150} y={SUELO - 150} w={700} h={300} c="#8794B0" f={f} /><Gunung x={1850} y={SUELO - 150} w={800} h={420} f={f} humo /></Capa>
        <Capa p={0.4}><AguaKm y={SUELO - 160} f={f * 0.4} desde={-1200} hasta={4400} /><Pulau x={-200} y={SUELO - 150} w={1100} h={60} c="#8A9A70" /><Pulau x={2200} y={SUELO - 150} w={1200} h={70} c="#7E9A60" /></Capa>
        <Capa p={1}><AguaKm y={SUELO - 30} f={f} desde={-1600} hasta={6400} /></Capa>
      </>
    );
    default: return null;
  }
}

// ---------- elementos ----------
export function elementoBalines(tipo: string, x: number, y: number | undefined, s: number, f: number, props: Record<string, unknown> = {}): React.ReactNode | null {
  const yy = y ?? SUELO;
  const b = (k: string) => props[k] === true;
  switch (tipo) {
    case 'awan': case 'nube': return <Awan x={x} y={y ?? 300} s={s} f={f} oscura={b('oscura')} />;
    case 'surya': case 'sol': return <Surya x={x} y={y ?? 240} r={56 * s} f={f} luz={(props.luz as number) ?? 1} />;
    case 'bulan': case 'luna': return <Bulan x={x} y={y ?? 240} r={48 * s} sabit={b('sabit')} luz={(props.luz as number) ?? 1} />;
    case 'bintang': case 'estrellas': return <Bintang f={f} n={(props.n as number) ?? 24} area={[x - 900, y ?? 160, 1800, 320]} r={9 * s} />;
    case 'gunung': case 'monte': case 'volcan': return <Gunung x={x} y={yy} w={700 * s} h={520 * s} f={f} humo={b('humo')} api={b('api')} c={props.color as string} />;
    case 'meru': case 'templo': return <Meru x={x} y={yy} s={s} n={(props.n as number) ?? 5} />;
    case 'candi_bentar': case 'puerta': return <CandiBentar x={x} y={yy} s={s} hueco={(props.hueco as number) ?? 120} />;
    case 'bale': case 'casa': return <Bale x={x} y={yy} s={s} />;
    case 'kulkul': return <Kulkul x={x} y={yy} s={s} f={f} />;
    case 'padmasana': case 'altar': return <Padmasana x={x} y={yy} s={s} />;
    case 'penjor': return <Penjor x={x} y={yy} s={s} f={f} />;
    case 'gebogan': return <Gebogan x={x} y={yy} s={s} />;
    case 'canang': return <Canang x={x} y={yy} s={s} />;
    case 'lontar': return <Lontar x={x} y={yy} s={s} brillo={b('brillo')} f={f} />;
    case 'genta': return <Genta x={x} y={yy} s={s} f={f} />;
    case 'sumur': case 'pozo': return <Sumur x={x} y={yy} s={s} hondo={b('hondo')} />;
    case 'pancuran': return <Pancuran x={x} y={yy} s={s} f={f} n={(props.n as number) ?? 6} />;
    case 'kolam': return <Kolam x={x} y={yy} s={s} f={f} w={(props.w as number) ?? 900} />;
    case 'jukung': case 'barco': case 'canoa': return <Jukung x={x} y={y ?? SUELO - 20} s={s} f={f} layar={props.layar !== false} />;
    case 'batu_pura': return <BatuPura x={x} y={yy} s={s} />;
    case 'kayonan': return <Kayonan x={x} y={yy} s={s} f={f} />;
    case 'tedung': return <Tedung x={x} y={yy} s={s} c={props.color as string} />;
    case 'abu': return <Abu x={x} y={yy} s={s} f={f} />;
    case 'api': case 'fogata': return <g transform={`translate(${r1(x)} ${r1(yy)})`}><path d="M-50 0 L 40 -20 M-40 -20 L 50 0" stroke={KM.tierra} strokeWidth={14} strokeLinecap="round" /><path d="M-50 0 L 40 -20 M-40 -20 L 50 0" stroke={NEGRO} strokeWidth={2} /><g transform="translate(0 -14)"><Fuego f={f} s={0.8 * s} /></g></g>;
    case 'batu': case 'roca': return <g transform={`translate(${r1(x)} ${r1(yy)}) scale(${s})`}><Karang x={-80} y={0} w={160} h={90} c={(props.color as string) ?? '#9A8A72'} c2="#5A4E40" /><Karang x={-40} y={-80} w={80} h={40} c={(props.color as string) ?? '#9A8A72'} c2="#5A4E40" /></g>;
    case 'beringin': case 'arbol': case 'olivo': return <Beringin x={x} y={yy} s={s} f={f} poleng={props.poleng !== false} noche={b('noche')} />;
    case 'kelapa': case 'palmera': return <Kelapa x={x} y={yy} s={s} f={f} inclina={(props.inclina as number) ?? 0.2} />;
    case 'jepun': return <Jepun x={x} y={yy} s={s} f={f} />;
    case 'bambu': return <Bambu x={x} y={yy} s={s} f={f} />;
    case 'padi': case 'maiz': return <Padi x={x} y={yy} s={s} f={f} />;
    case 'sawah_teras': return <SawahTeras x={x} y={yy} w={1200 * s} n={(props.n as number) ?? 4} f={f} />;
    case 'tembok': case 'muralla': return <Tembok x={x} y={yy} w={(props.w as number) ?? 900 * s} h={150 * s} />;
    case 'garis_air': return <AguaKm y={y ?? SUELO - 40} f={f} oscura={b('oscura')} desde={x - 1400} hasta={x + 1400} />;
    case 'menara': return <g transform={`translate(${r1(x)} ${r1(yy)}) scale(${s})`}><path d="M-80 0 V -60 H -70 V -360 H 70 V -60 H 80 V 0 Z" fill="#A8503A" stroke={NEGRO} strokeWidth={3} />{[-110, -190, -270].map((h) => <path key={h} d={`M-70 ${h} H 70`} stroke={KM.crema2} strokeWidth={6} />)}<rect x={-96} y={-376} width={192} height={18} fill={KM.crema2} stroke={NEGRO} strokeWidth={2} /><Tedung x={60} y={-376} s={0.8} /></g>;
    case 'tanah_genting': { const w = (props.w as number) ?? 1400; return <g transform={`translate(${r1(x)} ${r1(yy)}) scale(${s} 1)`}><path d={`M${-w / 2} 0 C ${-w / 4} -46, ${w / 4} -40, ${w / 2} 0 L ${w / 2} 40 L ${-w / 2} 40 Z`} fill="#B8A06A" stroke={NEGRO} strokeWidth={2.4} /><path d={`M${-w / 2 + 20} -6 C ${-w / 4} -40, ${w / 4} -34, ${w / 2 - 20} -6`} stroke={KM.verde} strokeWidth={10} fill="none" /></g>; }
    case 'pulau': return <Pulau x={x} y={yy} w={900 * s} h={160 * s} c={props.color as string} />;
    default: return null;
  }
}
