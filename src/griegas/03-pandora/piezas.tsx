// Piezas propias del video 03 (Pandora) en estilo vasija: siluetas negras, incisiones crema, púrpura y blanco añadidos.
import React from 'react';
import { C, P, SUELO, suave, miembro, desde, lerp, Inc, Borde, Fuego, azar, entre } from '../../comun/vasija';

export const PLATA = '#D9D3C4';
export const BRONCE = '#B0703C';
export const HIERRO = '#4A4440';

/** Posición en el mundo de la mano de adelante de un `Personaje` (para colocar objetos en su mano). */
export function manoDe(p: { x: number; y?: number; s?: number; voltear?: boolean; brazo: [number, number]; inclinar?: number }): P {
  const hD: P = [14, -292];
  const cD = desde(hD, p.brazo[0], 66), mD = desde(cD, p.brazo[0] + p.brazo[1], 60);
  const a = ((p.inclinar ?? 0) * Math.PI) / 180, dx = mD[0], dy = mD[1] + 176;
  const rx = dx * Math.cos(a) - dy * Math.sin(a), ry = dx * Math.sin(a) + dy * Math.cos(a) - 176;
  const s = p.s ?? 1;
  return [p.x + rx * (p.voltear ? -s : s), (p.y ?? SUELO) + ry * s];
}
/** Punto de la cabeza (centro) y del cuello de un Personaje. */
export const cabezaDe = (x: number, s = 1, voltear = false, y = SUELO, ancho = 1): P => [x + 20 * ancho * s * (voltear ? -1 : 1), y - 334 * s];
export const cuelloDe = (x: number, s = 1, voltear = false, y = SUELO): P => [x + 6 * s * (voltear ? -1 : 1), y - 302 * s];

/** El pithos: gran ánfora de almacenamiento, alta como una persona. Origen = base. */
export const Pithos: React.FC<{ x: number; y?: number; s?: number; tapa?: number; brillo?: number; corte?: number; f: number; children?: React.ReactNode; sacude?: number }> = ({ x, y = SUELO, s = 1, tapa = 0, brillo = 0, corte = 0, f, children, sacude = 0 }) => {
  const der: P[] = [[34, 0], [66, -40], [100, -130], [110, -192], [96, -248], [58, -280], [46, -294], [62, -304], [62, -318]];
  const cuerpo = suave([...der, ...der.slice().reverse().map(([a, b]) => [-a, b] as P)], true, 0.8);
  const dentro: P[] = [[24, -14], [52, -48], [84, -130], [92, -190], [80, -240], [44, -270], [36, -300]];
  const hueco = suave([...dentro, ...dentro.slice().reverse().map(([a, b]) => [-a, b] as P)], true, 0.8);
  const sx = Math.sin(f * 1.7) * sacude * 4;
  return (
    <g transform={`translate(${x + sx} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={70} ry={10} fill={C.negro} opacity={0.4} />
      {/* asas */}
      <path d="M-98 -232 C -136 -236, -136 -186, -108 -176" stroke={C.negro} strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d="M98 -232 C 136 -236, 136 -186, 108 -176" stroke={C.negro} strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d={cuerpo} fill={C.negro} />
      {/* lengüetas del hombro */}
      {Array.from({ length: 9 }, (_, i) => {
        const cx = -64 + i * 16;
        return <path key={i} d={`M${cx - 7} -262 Q ${cx} -238 ${cx + 7} -262`} fill={i % 2 ? C.purpura : 'none'} stroke={C.crema} strokeWidth={1.8} />;
      })}
      <Borde d={suave([[-104, -222], [0, -230], [104, -222]])} w={10} />
      {/* friso del vientre: zigzag y rosetas */}
      <Inc d={suave([[-110, -188], [0, -194], [110, -188]])} w={2} />
      <path d={Array.from({ length: 12 }, (_, i) => `${i ? 'L' : 'M'}${-96 + i * 17.5} ${i % 2 ? -150 : -178}`).join(' ')} stroke={C.crema} strokeWidth={2.4} fill="none" />
      {[-70, -35, 0, 35, 70].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={-163} r={5} fill={C.blanco} />
        </g>
      ))}
      <Inc d={suave([[-106, -140], [0, -144], [106, -140]])} w={2} />
      <Borde d={suave([[-90, -96], [0, -100], [90, -96]])} w={9} />
      {/* rayos de la base */}
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-48 + i * 16} -10 L${-42 + i * 14} -70`} stroke={C.crema} strokeWidth={1.6} />)}
      {/* interior en corte */}
      {corte > 0 && (
        <g opacity={corte}>
          <path d={hueco} fill="#2A120A" stroke={C.crema} strokeWidth={2} />
          <circle cx={0} cy={-90} r={120 * corte} fill="url(#haloBlanco)" opacity={0.5} />
          {children}
        </g>
      )}
      {/* boca y brillo */}
      {brillo > 0 && <circle cx={0} cy={-320} r={90 + brillo * 70} fill="url(#halo)" opacity={brillo} style={{ mixBlendMode: 'screen' }} />}
      <ellipse cx={0} cy={-318} rx={62} ry={9} fill="#2A120A" stroke={C.crema} strokeWidth={1.5} />
      {/* tapa */}
      <g transform={`translate(${tapa * 70} ${-tapa * 110}) rotate(${tapa * 38} 0 -318)`}>
        <path d="M-66 -318 Q 0 -360 66 -318 Z" fill={C.negro} />
        <rect x={-8} y={-358} width={16} height={14} rx={4} fill={C.negro} />
        <Inc d="M-46 -326 Q 0 -350 46 -326" w={1.6} />
        <Borde d="M-66 -319 L66 -319" w={6} />
        {tapa < 0.05 && (
          <>
            <path d="M-56 -322 L-42 -280 M56 -322 L42 -280" stroke={C.purpura} strokeWidth={5} />
            <circle cx={0} cy={-352} r={7} fill={C.purpura} stroke={C.blanco} strokeWidth={2} />
          </>
        )}
      </g>
    </g>
  );
};

/** Ánfora chica de dos asas (grano, aceite, agua). */
export const Anforita: React.FC<{ x: number; y?: number; s?: number; rot?: number; color?: string }> = ({ x, y = SUELO, s = 1, rot = 0, color = C.negro }) => {
  const der: P[] = [[6, 0], [20, -30], [34, -80], [30, -112], [12, -124], [10, -140], [16, -146]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
      <path d="M-14 -138 C -40 -138, -36 -106, -26 -102 M14 -138 C 40 -138, 36 -106, 26 -102" stroke={color} strokeWidth={6} fill="none" />
      <path d={suave([...der, ...der.slice().reverse().map(([a, b]) => [-a, b] as P)], true, 0.8)} fill={color} />
      <Borde d="M-32 -82 Q 0 -88 32 -82" w={6} />
      <Inc d="M-28 -60 Q 0 -64 28 -60" w={1.6} />
    </g>
  );
};

/** Caja pequeña con tapa (la "caja" de las traducciones). */
export const Caja: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-70} width={120} height={70} fill={C.negro} />
    <path d="M-66 -70 L66 -70 L56 -96 L-56 -96 Z" fill={C.negro} stroke={C.crema} strokeWidth={2} />
    <Borde d="M-60 -40 L60 -40" w={7} />
    <rect x={-10} y={-62} width={20} height={16} fill={C.oro} stroke={C.negro} strokeWidth={2} />
    <Inc d="M-52 -8 L52 -8" w={1.5} />
  </g>
);

/** Yunque de herrero. */
export const Yunque: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-40 0 L-26 -60 L26 -60 L40 0 Z" fill={C.negro} />
    <path d="M-90 -60 C -70 -66, -50 -70, -40 -70 L60 -70 L66 -92 L-50 -92 C -70 -86, -90 -74, -90 -60 Z" fill={C.negro} />
    <Inc d="M-40 -82 L58 -82" w={1.6} />
    <Inc d="M-20 -48 L20 -48" w={1.6} />
  </g>
);

/** Horno de la fragua (cúpula de ladrillos con boca de fuego). */
export const Horno: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-170 0 C -170 -200, 170 -200, 170 0 Z" fill={C.negro} />
    {Array.from({ length: 4 }, (_, r) => Array.from({ length: 6 - r }, (_, i) => {
      const yy = -30 - r * 36, w = 150 - r * 28, cx = -w + ((i + 0.5) * (2 * w)) / (6 - r);
      return <rect key={`${r}-${i}`} x={cx - 18} y={yy - 14} width={36} height={22} fill="none" stroke={C.crema} strokeWidth={1.4} opacity={0.7} />;
    }))}
    <path d="M-70 0 C -70 -110, 70 -110, 70 0 Z" fill="#3A1408" stroke={C.purpura} strokeWidth={8} />
    <g transform="translate(0 -6) scale(0.8)"><Fuego f={f} viento={10} /></g>
    <rect x={-40} y={-260} width={80} height={140} fill={C.negro} />
  </g>
);

/** Cántaro de agua (hidria) que se inclina y vierte. */
export const Hidria: React.FC<{ x: number; y: number; s?: number; rot?: number; vierte?: number; f: number }> = ({ x, y, s = 1, rot = 0, vierte = 0, f }) => (
  <g>
    {vierte > 0 && (
      <path d={suave([[x + 62 * s, y - 40 * s], [x + 82 * s, y + 20], [x + 86 * s + Math.sin(f / 3) * 3, y + 140 * vierte]])} stroke={C.mar} strokeWidth={9 * s} fill="none" strokeLinecap="round" opacity={0.9} strokeDasharray="22 8" strokeDashoffset={-f * 4} />
    )}
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
      <path d="M-50 0 C -70 -40, -60 -80, -24 -96 L-18 -116 L18 -116 L24 -96 C 60 -80, 70 -40, 50 0 Z" fill={C.negro} />
      <path d="M-22 -110 C -60 -110, -70 -60, -56 -40" stroke={C.negro} strokeWidth={7} fill="none" />
      <Borde d="M-58 -50 Q 0 -60 58 -50" w={7} />
      <Inc d="M-40 -24 Q 0 -30 40 -24" w={1.5} />
    </g>
  </g>
);

/** Collar de oro (cuentas). Centro = cuello. */
export const Collar: React.FC<{ x: number; y: number; s?: number; o?: number; voltear?: boolean }> = ({ x, y, s = 1, o = 1, voltear }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={o}>
    <path d="M-20 -4 Q 4 22 26 -2" stroke={C.oro} strokeWidth={3} fill="none" />
    {Array.from({ length: 7 }, (_, i) => {
      const t = i / 6, px = -20 + 46 * t, py = -4 + Math.sin(t * Math.PI) * 14;
      return <circle key={i} cx={px} cy={py} r={i === 3 ? 6 : 4} fill={C.oro} stroke={C.negro} strokeWidth={1.2} />;
    })}
  </g>
);

/** Corona de flores de primavera. Centro = cabeza. */
export const CoronaFlores: React.FC<{ x: number; y: number; s?: number; o?: number; voltear?: boolean }> = ({ x, y, s = 1, o = 1, voltear }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s}) rotate(-8)`} opacity={o}>
    <path d="M-32 -6 C -24 -36, 20 -44, 32 -22" stroke={C.negro} strokeWidth={5} fill="none" />
    {Array.from({ length: 7 }, (_, i) => {
      const t = i / 6, px = -32 + 64 * t, py = -6 - Math.sin(t * Math.PI) * 30 + t * -10;
      return (
        <g key={i} transform={`translate(${px} ${py})`}>
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-5} rx={3} ry={5} fill={i % 2 ? C.blanco : C.purpura} transform={`rotate(${a})`} />)}
          <circle r={2.4} fill={C.oro} />
        </g>
      );
    })}
  </g>
);

/** Alas de plumas (para Elpis y figuras aladas), batiendo. Origen = hombros, mira a la derecha. */
export const Alas: React.FC<{ x: number; y: number; s?: number; f: number; vel?: number; color?: string; claro?: boolean }> = ({ x, y, s = 1, f, vel = 0.4, color = C.negro, claro }) => {
  const a = Math.sin(f * vel) * 22;
  const ala = (abre: number, op: number) => {
    const punta = desde([0, 0], 200 + abre, 150);
    const medio = desde([0, 0], 225 + abre, 90);
    return (
      <g opacity={op}>
        <path d={suave([[0, 0], medio, punta, lerp(punta, [-30, 50], 0.4), [-40, 60], [-6, 24]], true)} fill={color} stroke={claro ? C.negro : C.crema} strokeWidth={2} />
        {[0.3, 0.5, 0.7].map((t, i) => <Inc key={i} d={suave([[-8, 12], lerp(medio, punta, t), lerp(punta, [-40, 60], 0.3 + t * 0.4)])} w={1.4} c={claro ? C.negro : C.crema} />)}
        <Borde d={suave([[0, 0], lerp([0, 0], medio, 0.6), lerp(medio, punta, 0.3)])} w={6} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {ala(-a - 12, 0.75)}
      {ala(a, 1)}
    </g>
  );
};

/** Ker: un mal alado, sombra con ojos. Origen = centro del cuerpo. `v` cambia la forma. */
export const Mal: React.FC<{ x: number; y: number; s?: number; f: number; v?: number; dir?: number; o?: number }> = ({ x, y, s = 1, f, v = 0, dir = 1, o = 1 }) => {
  const fl = Math.sin(f * 0.6 + v * 1.7) * 26;
  const larg = 70 + (v % 3) * 14;
  const cola: P[] = Array.from({ length: 6 }, (_, i) => [-20 - i * 16, 10 + Math.sin(f * 0.3 + i * 0.9 + v) * (4 + i * 2)] as P);
  const cuernos = v % 3 === 1, gorro = v % 3 === 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`} opacity={o}>
      {/* ala de atrás */}
      <path d={suave([[0, -6], [-30, -50 - fl], [-70, -60 - fl * 1.2], [-50, -26], [-60, -10], [-20, 0]], true)} fill={C.purpura} stroke={C.crema} strokeWidth={2} />
      {/* cuerpo y cola de humo */}
      <path d={miembro([[30, -4], [0, 4], ...cola], [34, 40, 34, 26, 18, 12, 6, 2])} fill={C.negro} stroke={C.crema} strokeWidth={2} />
      {/* cabeza */}
      <path d={suave([[22, -18], [44, -30], [larg - 14, -18], [larg - 20, -2], [40, 6], [22, 4]], true)} fill={C.negro} stroke={C.crema} strokeWidth={2} />
      {cuernos && <path d="M38 -26 L30 -50 L46 -30 M50 -28 L50 -52 L58 -28" fill={C.negro} stroke={C.crema} strokeWidth={2} />}
      {gorro && <path d={`M30 -24 C 40 -60, ${larg} -50, ${larg - 10} -20`} fill="none" stroke={C.crema} strokeWidth={2} />}
      <circle cx={larg - 30} cy={-14} r={4.5} fill={C.oro} />
      <circle cx={larg - 30} cy={-14} r={1.8} fill={C.negro} />
      {/* boca cerrada: sin voz */}
      <Inc d={`M${larg - 28} -4 L${larg - 18} -6`} w={1.6} />
      {/* garras */}
      <path d="M14 12 l -4 16 M22 12 l 2 16" stroke={C.crema} strokeWidth={2} />
      {/* ala de adelante */}
      <path d={suave([[6, -8], [-10, -60 + fl], [-56, -80 + fl * 1.3], [-36, -36 + fl * 0.3], [-46, -18], [-6, -2]], true)} fill={C.negro} stroke={C.crema} strokeWidth={2} />
      <Inc d={suave([[0, -10], [-20, -50 + fl], [-44, -66 + fl * 1.2]])} w={1.4} />
      {Array.from({ length: 3 }, (_, i) => <circle key={i} cx={-8 - i * 10} cy={-24 + fl * 0.2 * i} r={2} fill={C.blanco} />)}
    </g>
  );
};

/** Elpis: pequeña figura alada de luz, en el fondo del ánfora. Origen = pies. */
export const Elpis: React.FC<{ x: number; y: number; s?: number; f: number; luz?: number }> = ({ x, y, s = 1, f, luz = 1 }) => {
  const flot = Math.sin(f / 12) * 6;
  const tit = 0.8 + Math.sin(f / 5) * 0.1 + Math.sin(f / 2.3) * 0.06;
  return (
    <g transform={`translate(${x} ${y + flot}) scale(${s})`}>
      <circle cx={0} cy={-90} r={140 * luz} fill="url(#halo)" opacity={tit * luz} style={{ mixBlendMode: 'screen' }} />
      <circle cx={0} cy={-90} r={70 * luz} fill="url(#haloBlanco)" opacity={tit * luz} />
      <Alas x={-6} y={-130} s={0.55} f={f} vel={0.25} color={C.blanco} claro />
      {/* cuerpo */}
      <path d={suave([[-14, -128], [12, -130], [20, -96], [26, -20], [30, 0], [-22, 0], [-20, -60], [-18, -110]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={2} />
      <Borde d="M-22 -4 L30 -4" w={6} />
      <Inc d="M-6 -110 L-10 -10 M6 -110 L8 -10" w={1.2} c={C.negro} />
      {/* brazo que sostiene una flor */}
      <path d={miembro([[8, -124], [30, -110], [44, -130]], [10, 7, 6])} fill={C.blanco} stroke={C.negro} strokeWidth={1.5} />
      <path d="M46 -132 L50 -160" stroke={C.negro} strokeWidth={2} />
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={50} cy={-166} rx={3} ry={6} fill={C.purpura} transform={`rotate(${a} 50 -166) translate(0 -3)`} />)}
      {/* cabeza */}
      <circle cx={4} cy={-146} r={16} fill={C.blanco} stroke={C.negro} strokeWidth={2} />
      <path d="M-12 -148 C -12 -168, 14 -170, 18 -156 C 6 -160, -2 -152, -6 -134 Z" fill={C.negro} />
      <path d="M-12 -146 C -18 -130, -14 -118, -20 -108" stroke={C.negro} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M8 -150 Q 13 -153 17 -150" stroke={C.negro} strokeWidth={1.6} fill="none" />
      <Borde d="M-10 -158 Q 4 -168 18 -160" w={4} color={C.oro} />
    </g>
  );
};

/** Roca del Cáucaso con escamas y argollas. Origen = base. */
export const Roca: React.FC<{ x: number; y?: number; s?: number; color?: string }> = ({ x, y = SUELO, s = 1, color = '#3A1A0C' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-220 0 L-200 -150 L-150 -230 L-120 -330 L-60 -420 L-10 -400 L40 -470 L90 -380 L150 -300 L180 -180 L230 0 Z" fill={color} stroke={C.negro} strokeWidth={4} />
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 2 + r }, (_, i) => {
      const yy = -360 + r * 70, w = 50 + r * 34, cx = -w + ((i + 0.5) * 2 * w) / (2 + r);
      return <path key={`${r}-${i}`} d={`M${cx - 22} ${yy} a 22 14 0 0 1 44 0`} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.6} />;
    }))}
    <circle cx={-90} cy={-330} r={9} fill="none" stroke={C.negro} strokeWidth={4} />
    <circle cx={90} cy={-330} r={9} fill="none" stroke={C.negro} strokeWidth={4} />
  </g>
);

/** Cadena de eslabones entre dos puntos. */
export const Cadena: React.FC<{ a: P; b: P; color?: string }> = ({ a, b, color = PLATA }) => {
  const n = Math.max(3, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 14));
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const p = lerp(a, b, i / (n - 1));
        return <ellipse key={i} cx={p[0]} cy={p[1]} rx={9} ry={5} fill="none" stroke={color} strokeWidth={3} transform={`rotate(${ang + (i % 2) * 90} ${p[0]} ${p[1]})`} />;
      })}
    </g>
  );
};

/** Águila que planea batiendo las alas. Origen = cuerpo. */
export const Aguila: React.FC<{ x: number; y: number; s?: number; f: number; dir?: number }> = ({ x, y, s = 1, f, dir = 1 }) => {
  const a = Math.sin(f * 0.25) * 30;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
      <path d={suave([[-10, -4], [-50, -50 - a], [-120, -60 - a * 1.4], [-80, -20], [-30, 6]], true)} fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
      <path d="M-60 0 L-100 14 L-96 -4 Z" fill={C.negro} />
      <path d={suave([[-60, 0], [-20, -10], [30, -8], [50, -16], [64, -10], [52, 0], [20, 10], [-40, 10]], true)} fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
      <path d="M64 -10 L74 -4 L60 -2 Z" fill={C.oro} />
      <circle cx={52} cy={-11} r={2} fill={C.crema} />
      <path d={suave([[0, -6], [-30, -60 + a], [-90, -90 + a * 1.5], [-56, -30], [-14, 4]], true)} fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
      {[0.4, 0.6, 0.8].map((t, i) => <Inc key={i} d={`M${-10 - i * 8} -10 L${-30 - t * 60} ${-40 - t * 40 + a * t}`} w={1.3} />)}
    </g>
  );
};

/** Casa griega sencilla con puerta. Origen = centro de la base. */
export const Casa: React.FC<{ x: number; y?: number; s?: number; luz?: number; f?: number }> = ({ x, y = SUELO, s = 1, luz = 0, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-250} width={400} height={250} fill={C.negro} />
    {Array.from({ length: 6 }, (_, r) => Array.from({ length: 5 }, (_, i) => (
      <rect key={`${r}-${i}`} x={-196 + i * 80 + (r % 2) * 40} y={-246 + r * 40} width={76} height={36} fill="none" stroke={C.crema} strokeWidth={1.2} opacity={0.35} />
    )))}
    <path d="M-230 -250 L0 -350 L230 -250 Z" fill={C.negro} />
    <Borde d="M-230 -252 L230 -252" w={10} />
    <path d="M-150 -262 L0 -330 L150 -262" stroke={C.crema} strokeWidth={2} fill="none" />
    <circle cx={0} cy={-286} r={12} fill={C.purpura} stroke={C.blanco} strokeWidth={2} />
    {/* puerta */}
    <path d="M-50 0 L-50 -170 Q 0 -200 50 -170 L50 0 Z" fill={luz ? '#3A1408' : '#2A120A'} stroke={C.purpura} strokeWidth={6} />
    {luz > 0 && <circle cx={0} cy={-80} r={90} fill="url(#halo)" opacity={luz * (0.7 + Math.sin(f / 4) * 0.1)} style={{ mixBlendMode: 'screen' }} />}
    <rect x={-150} y={-180} width={50} height={50} fill={luz ? C.oro : '#2A120A'} opacity={luz ? 0.4 + luz * 0.5 : 1} stroke={C.purpura} strokeWidth={4} />
    <rect x={100} y={-180} width={50} height={50} fill={luz ? C.oro : '#2A120A'} opacity={luz ? 0.4 + luz * 0.5 : 1} stroke={C.purpura} strokeWidth={4} />
  </g>
);

/** Columna dórica para interiores. Origen = base. */
export const Columna: React.FC<{ x: number; y?: number; alto?: number; color?: string }> = ({ x, y = SUELO, alto = 560, color = C.negro }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-30} y={-alto} width={60} height={alto} fill={color} />
    <rect x={-46} y={-alto - 20} width={92} height={20} fill={color} />
    <path d={`M-40 ${-alto} Q 0 ${-alto + 22} 40 ${-alto}`} fill={color} />
    {[-16, -6, 6, 16].map((dx) => <path key={dx} d={`M${dx} ${-alto + 20} V-8`} stroke={C.crema} strokeWidth={1.3} opacity={0.5} />)}
    <rect x={-40} y={-12} width={80} height={12} fill={color} />
  </g>
);

/** Hoguera chica de los humanos, con leños. */
export const Hoguera: React.FC<{ x: number; y: number; s?: number; f: number; o?: number }> = ({ x, y, s = 1, f, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <g transform="scale(0.55)"><Fuego f={f + x} viento={-10} /></g>
    <path d="M-36 6 L30 -10 M-30 -10 L36 6" stroke={C.negro} strokeWidth={10} strokeLinecap="round" />
  </g>
);

/** Buey caminando (para el arado). Origen = pies, mira a la derecha. */
export const Buey: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => {
  const ph = f * 0.18;
  const pata = (px: number, fase: number) => {
    const a = Math.sin(ph + fase) * 16;
    const k = desde([px, -110], a, 60), t = desde(k, a * 0.3 - 6, 54);
    return <path key={px + fase} d={miembro([[px, -110], k, t], [26, 16, 12])} fill={C.negro} />;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {pata(-90, Math.PI)}
      {pata(60, 0)}
      <path d={suave([[-130, -150], [-60, -176], [40, -178], [100, -170], [120, -130], [90, -96], [-20, -92], [-110, -100], [-140, -120]], true)} fill={C.negro} />
      <path d="M-136 -136 C -160 -120, -160 -80, -150 -60" stroke={C.negro} strokeWidth={6} fill="none" />
      <path d={suave([[96, -170], [140, -184], [176, -160], [180, -130], [160, -120], [124, -126]], true)} fill={C.negro} />
      <path d="M130 -184 C 120 -210, 140 -220, 150 -214 M146 -184 C 156 -206, 176 -210, 182 -198" stroke={C.negro} strokeWidth={6} fill="none" />
      <circle cx={158} cy={-160} r={3.5} fill={C.crema} />
      <Inc d={suave([[-90, -164], [-20, -168], [60, -164]])} w={1.6} />
      <Inc d={suave([[96, -160], [104, -130], [96, -104]])} w={1.6} />
      {[-60, -20, 20].map((dx) => <Inc key={dx} d={`M${dx} -150 q 8 20 0 40`} w={1.3} />)}
      {pata(-70, 0)}
      {pata(80, Math.PI)}
    </g>
  );
};

/** Arado de madera (del buey hacia atrás). Origen = punta de la reja en el suelo. */
export const Arado: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 L60 -16 L230 -130" stroke={C.negro} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M40 -10 L-40 -220 L-64 -230" stroke={C.negro} strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d="M0 0 L40 -4 L30 -18 Z" fill={PLATA} stroke={C.negro} strokeWidth={2} />
  </g>
);

/** Balanza con dos platos; `inc` = inclinación en grados. Origen = punta del fiel. */
export const Balanza: React.FC<{ x: number; y: number; s?: number; inc?: number; izq?: React.ReactNode; der?: React.ReactNode; colgada?: boolean }> = ({ x, y, s = 1, inc = 0, izq, der, colgada }) => {
  const r = (inc * Math.PI) / 180, L = 220;
  const pI: P = [-Math.cos(r) * L, -Math.sin(r) * L], pD: P = [Math.cos(r) * L, Math.sin(r) * L];
  const plato = (p: P, hijo: React.ReactNode, k: string) => (
    <g key={k}>
      <path d={`M${p[0]} ${p[1]} L${p[0] - 60} ${p[1] + 130} M${p[0]} ${p[1]} L${p[0] + 60} ${p[1] + 130}`} stroke={C.negro} strokeWidth={2.5} />
      <g transform={`translate(${p[0]} ${p[1] + 130})`}>{hijo}</g>
      <path d={`M${p[0] - 76} ${p[1] + 130} Q ${p[0]} ${p[1] + 170} ${p[0] + 76} ${p[1] + 130} Z`} fill={C.oro} stroke={C.negro} strokeWidth={3} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {colgada ? (
        <>
          <path d="M0 -400 L0 -20" stroke={C.negro} strokeWidth={5} strokeDasharray="14 6" />
          <path d="M0 -20 L-12 -60 L12 -60 Z" fill={C.negro} />
        </>
      ) : (
        <>
          <path d="M0 -20 L0 380" stroke={C.negro} strokeWidth={12} />
          <path d="M-70 400 L70 400 L40 380 L-40 380 Z" fill={C.negro} />
        </>
      )}
      <path d={`M${pI[0]} ${pI[1]} L${pD[0]} ${pD[1]}`} stroke={C.negro} strokeWidth={10} strokeLinecap="round" />
      <path d={`M${pI[0] * 0.8} ${pI[1] * 0.8} L${pD[0] * 0.8} ${pD[1] * 0.8}`} stroke={C.crema} strokeWidth={1.6} strokeDasharray="6 6" />
      <circle r={14} fill={C.oro} stroke={C.negro} strokeWidth={3} />
      {plato(pI, izq, 'i')}
      {plato(pD, der, 'd')}
    </g>
  );
};

/** Montículo de barro que crece (la tierra mezclada con agua). */
export const Barro: React.FC<{ x: number; y?: number; t: number }> = ({ x, y = SUELO, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M${-110 * t} 0 C ${-90 * t} ${-60 * t}, ${90 * t} ${-60 * t}, ${110 * t} 0 Z`} fill={C.barroOscuro} stroke={C.negro} strokeWidth={3} />
    <Inc d={`M${-60 * t} ${-20 * t} q ${30 * t} ${-10 * t} ${60 * t} 0`} w={1.5} c={C.negro} />
  </g>
);

/** Rayos dorados que convergen hacia un punto (los dones). */
export const Rayos: React.FC<{ desde: P[]; hacia: P; o: number; f: number }> = ({ desde: ds, hacia, o, f }) => (
  <g opacity={o}>
    {ds.map((d, i) => (
      <path key={i} d={`M${d[0]} ${d[1]} L${hacia[0]} ${hacia[1]}`} stroke={C.oro} strokeWidth={4} strokeDasharray="10 14" strokeDashoffset={-f * 3} opacity={0.8} />
    ))}
  </g>
);

/** Polvo dorado que cae (la gracia de Afrodita). */
export const PolvoOro: React.FC<{ x: number; y: number; f: number; o: number; ancho?: number }> = ({ x, y, f, o, ancho = 90 }) => (
  <g opacity={o}>
    {Array.from({ length: 30 }, (_, i) => {
      const e = (f * 1.6 + i * 9) % 140, a = azar(i + 50);
      return <circle key={i} cx={x + (a - 0.5) * ancho + Math.sin(e / 10 + i) * 8} cy={y + e} r={2 + a * 2.5} fill={i % 3 ? C.oro : C.blanco} opacity={1 - e / 140} />;
    })}
  </g>
);

/** Remolino púrpura (la curiosidad de Hermes). */
export const Remolino: React.FC<{ x: number; y: number; f: number; o: number }> = ({ x, y, f, o }) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 4})`} opacity={o}>
    {[0, 120, 240].map((a) => (
      <path key={a} d={suave(Array.from({ length: 10 }, (_, i) => desde([0, 0], a + i * 34, 6 + i * 7)))} stroke={a ? C.purpura : C.oro} strokeWidth={5} fill="none" strokeLinecap="round" />
    ))}
  </g>
);

/** Lámpara de aceite encendida, para los humanos de la noche. */
export const Lampara: React.FC<{ x: number; y: number; s?: number; f: number; o?: number }> = ({ x, y, s = 1, f, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle cy={-30} r={60} fill="url(#halo)" opacity={0.7 + Math.sin(f / 4 + x) * 0.15} style={{ mixBlendMode: 'screen' }} />
    <path d="M-26 0 C -26 -16, 20 -18, 34 -10 L 40 -14 L 38 -4 C 20 6, -16 8, -26 0 Z" fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
    <g transform="translate(38 -14) scale(0.16)"><Fuego f={f + x} viento={-6} /></g>
  </g>
);

/** Túmulo con estela funeraria. */
export const Tumba: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-120 0 C -100 -70, 100 -70, 120 0 Z" fill={C.negro} />
    <path d="M-24 -50 L-20 -200 L20 -200 L24 -50 Z" fill={C.negro} stroke={C.crema} strokeWidth={2} />
    <path d="M-30 -200 Q 0 -240 30 -200 Z" fill={C.negro} />
    <Borde d="M-20 -180 L20 -180" w={6} />
    <Inc d="M-10 -160 L10 -160 M-10 -140 L10 -140" w={1.4} />
  </g>
);

/** Medallón de una edad (oro, plata, bronce…). */
export const Medallon: React.FC<{ x: number; y: number; color: string; o: number; f: number; r?: number }> = ({ x, y, color, o, f, r = 58 }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 14 + x) * 4}) scale(${0.6 + o * 0.4})`} opacity={o}>
    <circle r={r * 1.7} fill="url(#halo)" opacity={0.45} style={{ mixBlendMode: 'screen' }} />
    <circle r={r} fill={color} stroke={C.negro} strokeWidth={5} />
    <circle r={r - 10} fill="none" stroke={C.negro} strokeWidth={2} strokeDasharray="3 6" />
    <path d={`M${-r * 0.4} ${r * 0.3} L0 ${-r * 0.45} L${r * 0.4} ${r * 0.3} Z`} fill="none" stroke={C.negro} strokeWidth={3} />
  </g>
);

/** Brillo intermitente (destello de cuatro puntas). */
export const Destello: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  if (t <= 0 || t >= 1) return null;
  const k = Math.sin(t * Math.PI) * s;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) rotate(${t * 90})`}>
      <path d="M0 -40 L8 -8 L40 0 L8 8 L0 40 L-8 8 L-40 0 L-8 -8 Z" fill={C.blanco} stroke={C.oro} strokeWidth={2} />
    </g>
  );
};

/** Valor de un desplazamiento entre dos frames con movimiento suave (atajo). */
export const mover = (f: number, a: number, b: number, v0: number, v1: number) => entre(f, a, b, v0, v1);
