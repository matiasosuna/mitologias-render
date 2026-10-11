// Piezas propias del video 05 (El diluvio de Deucalión) en estilo vasija:
// siluetas negras con curvas suaves, incisiones crema, púrpura y blanco añadidos.
import React from 'react';
import { C, P, SUELO, suave, miembro, desde, lerp, Inc, Borde, azar, Personaje, PersonajeProps } from '../../comun/vasija';

export const MAR = '#2E4A5C';
export const MAR_OSC = '#1E3240';
export const PIEDRA = '#8C8274';
export const MADERA = '#6B3A1E';

/** Posición en el mundo de la mano de adelante de un `Personaje`. */
export function manoDe(p: { x: number; y?: number; s?: number; voltear?: boolean; brazo: [number, number]; inclinar?: number }): P {
  const hD: P = [14, -292];
  const cD = desde(hD, p.brazo[0], 66), mD = desde(cD, p.brazo[0] + p.brazo[1], 60);
  const a = ((p.inclinar ?? 0) * Math.PI) / 180, dx = mD[0], dy = mD[1] + 176;
  const rx = dx * Math.cos(a) - dy * Math.sin(a), ry = dx * Math.sin(a) + dy * Math.cos(a) - 176;
  const s = p.s ?? 1;
  return [p.x + rx * (p.voltear ? -s : s), (p.y ?? SUELO) + ry * s];
}
/** Centro de la cabeza de un Personaje. */
export const cabezaDe = (x: number, s = 1, voltear = false, y = SUELO): P => [x + 20 * s * (voltear ? -1 : 1), y - 334 * s];

// ---------------------------------------------------------------- agua
/** Mar o inundación con oleaje "perro corriendo" sobre cualquier rango de x. `nivel` = y de la superficie. */
export const Agua: React.FC<{ nivel: number; f: number; x0?: number; x1?: number; alto?: number; color?: string; o?: number; vel?: number; fondo?: number }> = ({ nivel, f, x0 = -800, x1 = 5200, alto = 30, color = MAR, o = 0.9, vel = 1.4, fondo = 1200 }) => {
  const w = 130, off = (f * vel) % w;
  let d = `M${x0 - w - off} ${nivel + alto}`;
  for (let x = x0 - w - off; x < x1 + w; x += w) {
    d += ` C ${x + w * 0.3} ${nivel + alto}, ${x + w * 0.35} ${nivel}, ${x + w * 0.6} ${nivel} C ${x + w * 0.85} ${nivel}, ${x + w * 0.85} ${nivel + alto * 0.5}, ${x + w * 0.68} ${nivel + alto * 0.5} C ${x + w * 0.6} ${nivel + alto * 0.5}, ${x + w * 0.62} ${nivel + alto * 0.8}, ${x + w} ${nivel + alto}`;
  }
  d += ` L${x1 + w} ${fondo} L${x0 - w} ${fondo} Z`;
  const n = Math.ceil((x1 - x0) / 260);
  return (
    <g opacity={o}>
      <path d={d} fill={color} stroke={C.negro} strokeWidth={4} />
      {Array.from({ length: n * 3 }, (_, i) => {
        const fila = i % 3, col = Math.floor(i / 3);
        const xx = x0 + col * 260 + fila * 90 + ((f * (0.6 + fila * 0.3)) % 260) - 130, yy = nivel + 70 + fila * 60;
        if (yy > fondo - 10) return null;
        return <path key={i} d={`M${xx} ${yy} q 20 -12 40 0 t 40 0`} stroke={C.crema} strokeWidth={2} fill="none" opacity={0.35} />;
      })}
    </g>
  );
};

/** Lluvia en diagonal sobre un área. */
export const Lluvia: React.FC<{ f: number; o?: number; area?: [number, number, number, number]; n?: number; ang?: number }> = ({ f, o = 1, area = [-400, 100, 3200, 750], n = 160, ang = 0.25 }) => {
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const vel = 26 + azar(i) * 12, x = area[0] + azar(i * 7) * area[2], y0 = area[1] + ((azar(i * 3) * area[3] + f * vel) % area[3]);
        return <path key={i} d={`M${x + (y0 - area[1]) * -ang} ${y0} l ${-ang * 46} 46`} stroke={i % 5 ? C.crema : C.blanco} strokeWidth={i % 3 ? 2 : 3} strokeLinecap="round" opacity={0.55} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- animales
/** Lobo de perfil mirando a la derecha. Origen = patas. */
export const Lobo: React.FC<{ x: number; y?: number; s?: number; voltear?: boolean; fase?: number; corre?: boolean; aullar?: number; contorno?: boolean; o?: number; nada?: boolean }> = ({ x, y = SUELO, s = 1, voltear, fase = 0, corre, aullar = 0, contorno, o = 1, nada }) => {
  const amp = corre ? 38 : 0;
  const pata = (cad: P, ph: number, del: boolean) => {
    const a = amp * Math.sin(fase + ph) + (nada ? 40 * Math.sin(fase * 1.4 + ph) : 0);
    const k = desde(cad, a + (del ? 6 : -10), 46), pie = desde(k, a + (del ? -18 : 26), 44);
    return miembro([cad, k, pie], [26, 14, 9]);
  };
  const bote = corre ? -Math.abs(Math.sin(fase)) * 12 : 0;
  const cab = -aullar * 40; // ángulo de la cabeza hacia arriba
  return (
    <g transform={`translate(${x} ${y + bote * s}) scale(${voltear ? -s : s} ${s})`} opacity={o} filter={contorno ? 'url(#contornoV)' : undefined}>
      {!nada && <ellipse cx={0} cy={2} rx={110} ry={8} fill={C.negro} opacity={0.3} />}
      {/* cola */}
      <path d={suave([[-96, -112], [-140, -100 + Math.sin(fase) * 10], [-170, -70 + Math.sin(fase) * 16], [-150, -84], [-110, -96]], true)} fill={C.negro} />
      <path d={pata([-74, -96], Math.PI, false)} fill={C.negro} />
      <path d={pata([62, -98], 0.6, true)} fill={C.negro} />
      {/* cuerpo */}
      <path d={suave([[-104, -118], [-40, -128], [40, -138], [86, -146], [100, -110], [80, -82], [10, -84], [-60, -78], [-104, -88]], true)} fill={C.negro} />
      {/* pelaje inciso */}
      {Array.from({ length: 7 }, (_, i) => <Inc key={i} d={`M${-80 + i * 22} -116 l 10 14 l 10 -14`} w={1.6} />)}
      <Inc d={suave([[-90, -96], [-20, -92], [60, -98]])} w={1.6} />
      <path d={pata([-60, -94], 0.2, false)} fill={C.negro} />
      <path d={pata([74, -100], Math.PI + 0.6, true)} fill={C.negro} />
      {/* melena púrpura */}
      <path d={suave([[52, -150], [84, -158], [104, -130], [96, -100], [74, -118]], true)} fill={C.purpura} stroke={C.negro} strokeWidth={2} />
      {/* cabeza */}
      <g transform={`translate(96 -146) rotate(${cab})`}>
        <path d={suave([[-22, 6], [-14, -22], [4, -30], [20, -20], [64, -8], [70, 2], [60, 10], [30, 14], [6, 22], [-16, 20]], true)} fill={C.negro} />
        <path d="M-8 -22 L -2 -54 L 12 -26 Z M4 -26 L 14 -52 L 22 -22 Z" fill={C.negro} />
        <Inc d="M-2 -28 L 2 -44" w={1.4} />
        <path d="M14 -10 Q 22 -16 30 -10 Q 22 -6 14 -10 Z" fill={C.crema} />
        <circle cx={22} cy={-10} r={2.4} fill={C.negro} />
        <Inc d="M10 -16 Q 22 -24 34 -14" w={1.6} />
        {aullar > 0.3 ? <path d="M68 4 L 40 14 L 64 18 Z" fill={C.purpura} stroke={C.crema} strokeWidth={1.2} /> : <Inc d="M40 10 L 64 6" w={1.6} />}
        <path d="M64 -6 l 4 4" stroke={C.crema} strokeWidth={3} strokeLinecap="round" />
        {[0, 1, 2].map((i) => <path key={i} d={`M${46 + i * 6} 12 l 2 5`} stroke={C.blanco} strokeWidth={2} />)}
      </g>
    </g>
  );
};

/** Oveja de perfil a la derecha. Origen = patas (o línea del agua si nada). */
export const Oveja: React.FC<{ x: number; y?: number; s?: number; voltear?: boolean; fase?: number; nada?: boolean; o?: number }> = ({ x, y = SUELO, s = 1, voltear, fase = 0, nada, o = 1 }) => (
  <g transform={`translate(${x} ${y + (nada ? Math.sin(fase) * 5 : 0)}) scale(${voltear ? -s : s} ${s})`} opacity={o}>
    {!nada && [-40, -20, 30, 50].map((px, i) => <path key={i} d={miembro([[px, -50], [px + Math.sin(fase + i) * 6, -24], [px + Math.sin(fase + i) * 8, 0]], [14, 9, 7])} fill={C.negro} />)}
    <path d={suave(Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2, r = i % 2 ? 1 : 1.08;
      return [Math.cos(a) * 72 * r, -78 + Math.sin(a) * 40 * r] as P;
    }), true)} fill={C.blanco} stroke={C.negro} strokeWidth={3} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-50 + (i % 5) * 24} ${-94 + Math.floor(i / 5) * 26} a 6 6 0 1 1 6 6`} stroke={C.negro} strokeWidth={1.8} fill="none" />)}
    <g transform="translate(66 -98)">
      <path d={suave([[-12, -4], [8, -16], [34, -6], [40, 8], [26, 16], [0, 12]], true)} fill={C.negro} />
      <path d="M2 -12 C -10 -20, -18 -6, -8 2" stroke={C.negro} strokeWidth={6} fill="none" />
      <circle cx={20} cy={-2} r={2.6} fill={C.crema} />
    </g>
  </g>
);

/** Pez (mira a la derecha). */
export const Pez: React.FC<{ x: number; y: number; s?: number; voltear?: boolean; f: number; color?: string }> = ({ x, y, s = 1, voltear, f, color = C.negro }) => {
  const cola = Math.sin(f / 4 + x) * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`}>
      <path d={suave([[-50, 0], [-10, -22], [30, -16], [52, 0], [30, 14], [-10, 18]], true)} fill={color} />
      <path d={`M-46 0 L -78 ${-22 + cola} L -70 ${2 + cola * 0.5} L -78 ${24 + cola} Z`} fill={color} />
      <path d="M-6 -18 L 6 -32 L 18 -16 Z" fill={C.purpura} />
      <Inc d="M24 -12 Q 18 0 24 12" w={1.6} />
      {[0, 1, 2].map((i) => <Inc key={i} d={`M${-26 + i * 14} -8 q 6 8 0 16`} w={1.3} />)}
      <circle cx={36} cy={-4} r={3} fill={C.crema} />
    </g>
  );
};

/** Delfín de vasija, curvado (mira a la derecha). */
export const Delfin: React.FC<{ x: number; y: number; s?: number; voltear?: boolean; rot?: number; f: number }> = ({ x, y, s = 1, voltear, rot = 0, f }) => {
  const c = Math.sin(f / 5 + x * 0.01) * 6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${voltear ? -s : s} ${s})`}>
      <path d={suave([[-110, 10 + c], [-60, -20], [10, -34], [70, -22], [104, -8], [130, -4], [104, 4], [70, 16], [0, 18], [-70, 18]], true)} fill={C.negro} />
      <path d={`M-104 ${12 + c} L -140 ${-14 + c * 2} L -126 ${12 + c} L -140 ${34 + c * 2} Z`} fill={C.negro} />
      <path d="M-4 -30 C 0 -60, 20 -66, 28 -64 C 16 -50, 18 -40, 24 -28 Z" fill={C.negro} />
      <path d="M10 14 C 4 34, -10 40, -20 40 C -8 30, -6 22, -6 14 Z" fill={C.negro} />
      <Borde d={suave([[-90, 6 + c], [-20, 6], [60, 6], [100, 2]])} w={6} />
      <path d="M78 -10 Q 86 -16 94 -10 Q 86 -6 78 -10 Z" fill={C.crema} />
      <Inc d="M104 2 L 124 -2" w={1.5} />
    </g>
  );
};

/** Ave con alas que baten; `caida` 0→1 la inclina en picada. */
export const Ave: React.FC<{ x: number; y: number; s?: number; voltear?: boolean; f: number; caida?: number }> = ({ x, y, s = 1, voltear, f, caida = 0 }) => {
  const bate = caida > 0.5 ? Math.sin(f * 0.9) * 0.5 : Math.sin(f * 0.45);
  return (
    <g transform={`translate(${x} ${y}) rotate(${caida * 55}) scale(${voltear ? -s : s} ${s})`}>
      <path d={suave([[-40, 0], [-6, -10], [24, -8], [36, -2], [24, 6], [-10, 8]], true)} fill={C.negro} />
      <path d="M-38 0 L -60 -10 L -54 4 L -60 14 Z" fill={C.negro} />
      <path d="M34 -4 L 46 0 L 34 2 Z" fill={C.negro} />
      <circle cx={26} cy={-4} r={2} fill={C.crema} />
      <path d={suave([[-8, -6], [-18, -6 - 40 * bate], [-34, -10 - 52 * bate], [-4, -10 - 20 * bate], [12, -6]], true)} fill={C.negro} />
      <Inc d={suave([[-6, -8], [-18, -8 - 30 * bate]])} w={1.3} />
    </g>
  );
};

// ---------------------------------------------------------------- objetos y lugares
/** El arcón de madera de Deucalión. Origen = base al centro. `armado` 0→1 lo va construyendo. */
export const Arcon: React.FC<{ x: number; y?: number; s?: number; rot?: number; armado?: number; tapa?: number; brillo?: number }> = ({ x, y = SUELO, s = 1, rot = 0, armado = 1, tapa = 0, brillo = 0 }) => {
  const tablas = 6, visibles = Math.ceil(armado * tablas);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {brillo > 0 && <circle cx={0} cy={-100} r={260} fill="url(#halo)" opacity={brillo} style={{ mixBlendMode: 'screen' }} />}
      {/* patas */}
      <path d="M-150 0 L -150 -22 L -120 -22 L -126 0 Z M150 0 L 150 -22 L 120 -22 L 126 0 Z" fill={C.negro} />
      {Array.from({ length: visibles }, (_, i) => (
        <g key={i} opacity={i === visibles - 1 ? Math.min(1, (armado * tablas - i) * 1.2) : 1}>
          <rect x={-160} y={-22 - (i + 1) * 24} width={320} height={24} fill={C.negro} stroke={C.barroOscuro} strokeWidth={1.5} />
          <Inc d={`M${-150 + (i % 2) * 30} ${-10 - (i + 1) * 24} H ${100 + (i % 2) * 30}`} w={1.1} />
        </g>
      ))}
      {armado > 0.99 && (
        <>
          <Borde d="M-160 -100 H 160" w={12} />
          {/* meandro en el frente */}
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-136 + i * 40} -52 v -24 h 24 v 16 h -12 v -8`} stroke={C.crema} strokeWidth={2.4} fill="none" />)}
          <path d="M-164 -166 V -22 M164 -166 V -22" stroke={C.negro} strokeWidth={10} />
          {/* tapa */}
          <g transform={`rotate(${-tapa * 70} -170 -166)`}>
            <path d="M-174 -166 L -150 -196 L 150 -196 L 174 -166 Z" fill={C.negro} />
            <Borde d="M-150 -190 H 150" w={6} color={C.purpura} />
            <circle cx={0} cy={-206} r={10} fill={C.negro} />
          </g>
        </>
      )}
    </g>
  );
};

/** Casa sencilla con techo a dos aguas. Origen = base al centro. */
export const Casa: React.FC<{ x: number; y?: number; s?: number; color?: string }> = ({ x, y = SUELO, s = 1, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-90} y={-130} width={180} height={130} fill={color} />
    <path d="M-110 -128 L 0 -196 L 110 -128 Z" fill={color} />
    <Borde d="M-100 -132 H 100" w={7} />
    <path d="M-20 0 V -70 Q 0 -86 20 -70 V 0 Z" fill={C.barroOscuro} />
    <rect x={44} y={-96} width={24} height={24} fill={C.barroOscuro} />
    {Array.from({ length: 4 }, (_, i) => <Inc key={i} d={`M${-84} ${-104 + i * 24} H ${-36}`} w={1.2} />)}
  </g>
);

/** Ciprés oscuro con incisiones. */
export const Cipres: React.FC<{ x: number; y?: number; s?: number; f: number; color?: string }> = ({ x, y = SUELO, s = 1, f, color = C.negro }) => {
  const m = Math.sin(f / 22 + x) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-7} y={-40} width={14} height={40} fill={color} />
      <path d={suave([[0, -40], [-34, -70], [-38, -160], [-20 + m, -260], [m, -320], [20 + m, -260], [38, -160], [34, -70]], true)} fill={color} />
      {Array.from({ length: 8 }, (_, i) => <Inc key={i} d={`M${-18 + (i % 2) * 8} ${-80 - i * 28} q 14 -10 ${24 - (i % 2) * 8} 0`} w={1.4} />)}
    </g>
  );
};

/** Piedra redondeada con vetas incisas. */
export const Piedra: React.FC<{ x: number; y?: number; s?: number; rot?: number; color?: string; o?: number; brillo?: number }> = ({ x, y = SUELO, s = 1, rot = 0, color = PIEDRA, o = 1, brillo = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    {brillo > 0 && <circle cx={0} cy={-18} r={60} fill="url(#halo)" opacity={brillo} style={{ mixBlendMode: 'screen' }} />}
    <path d={suave([[-30, 0], [-34, -20], [-14, -38], [14, -36], [32, -18], [30, 0]], true)} fill={color} stroke={C.negro} strokeWidth={3} />
    <path d="M-16 -24 q 8 -6 18 -2 M6 -12 q 8 2 14 -6" stroke={C.negro} strokeWidth={2} fill="none" />
  </g>
);

/** Mesa de banquete con vajilla. Origen = base al centro. `tapado` muestra la fuente cubierta con humo oscuro. */
export const Mesa: React.FC<{ x: number; y?: number; s?: number; rot?: number; f: number; humo?: number; fuente?: number }> = ({ x, y = SUELO, s = 1, rot = 0, f, humo = 0, fuente = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot} 0 -120)`}>
    <path d="M-170 -120 L -150 0 M-130 -120 L -140 0 M170 -120 L 150 0 M130 -120 L 140 0" stroke={C.negro} strokeWidth={12} strokeLinecap="round" />
    <path d="M-150 -40 H 150" stroke={C.negro} strokeWidth={6} />
    <rect x={-200} y={-136} width={400} height={18} rx={4} fill={C.negro} />
    <Borde d="M-196 -127 H 196" w={6} />
    {/* pan y frutas */}
    <ellipse cx={-130} cy={-146} rx={26} ry={10} fill={C.negro} />
    {[0, 1, 2].map((i) => <circle key={i} cx={-60 + i * 16} cy={-148 - (i % 2) * 8} r={9} fill={i % 2 ? C.purpura : C.negro} stroke={C.crema} strokeWidth={1.2} />)}
    {/* copa */}
    <path d="M120 -170 Q 140 -144 160 -170 Z M140 -156 V -138 M126 -138 H 154" fill={C.negro} stroke={C.negro} strokeWidth={5} />
    {/* fuente tapada */}
    {fuente > 0 && (
      <g opacity={fuente} transform={`translate(30 ${-138 - (1 - fuente) * 40})`}>
        <ellipse cx={0} cy={0} rx={64} ry={10} fill={C.negro} />
        <path d="M-56 -2 C -50 -60, 50 -60, 56 -2 Z" fill={C.negro} />
        <Borde d="M-50 -10 Q 0 -18 50 -10" w={6} />
        <circle cx={0} cy={-48} r={8} fill={C.negro} />
        <Inc d="M-36 -20 C -30 -42, 30 -42, 36 -20" w={1.4} />
      </g>
    )}
    {humo > 0 && <Humo x={30} y={-190} f={f} o={humo} n={5} color={C.negro} />}
  </g>
);

/** Volutas de humo (o rumores) que suben y se disuelven. */
export const Humo: React.FC<{ x: number; y: number; f: number; o?: number; n?: number; color?: string; alto?: number; s?: number }> = ({ x, y, f, o = 1, n = 6, color = C.negro, alto = 220, s = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const ciclo = 90, edad = (f + i * (ciclo / n)) % ciclo, t = edad / ciclo;
      const yy = y - t * alto, xx = x + Math.sin(t * 6 + i) * 22 * s;
      return <path key={i} d={`M${xx - 16 * s} ${yy} c ${-12 * s} ${-18 * s}, ${12 * s} ${-30 * s}, ${4 * s} ${-44 * s} c ${-6 * s} ${12 * s}, ${18 * s} ${18 * s}, ${12 * s} ${30 * s}`} stroke={color} strokeWidth={(6 - t * 3) * s} fill="none" strokeLinecap="round" opacity={Math.sin(t * Math.PI) * 0.8} />;
    })}
  </g>
);

/** Arcos de sonido (gritos, aullidos, la caracola). */
export const Sonido: React.FC<{ x: number; y: number; f: number; o?: number; ang?: number; color?: string; s?: number }> = ({ x, y, f, o = 1, ang = 0, color = C.crema, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`} opacity={o}>
    {[0, 1, 2].map((i) => {
      const t = ((f / 24 + i / 3) % 1), r = 20 + t * 80;
      return <path key={i} d={`M${r * 0.5} ${-r * 0.8} Q ${r} 0 ${r * 0.5} ${r * 0.8}`} stroke={color} strokeWidth={5 - t * 3} fill="none" strokeLinecap="round" opacity={1 - t} />;
    })}
  </g>
);

/** Cadena entre dos puntos. */
export const Cadena: React.FC<{ a: P; b: P; color?: string }> = ({ a, b, color = C.crema }) => {
  const n = Math.max(3, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 18));
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const p = lerp(a, b, (i + 0.5) / n);
        return <ellipse key={i} cx={p[0]} cy={p[1]} rx={11} ry={i % 2 ? 3 : 6} fill="none" stroke={color} strokeWidth={3} transform={`rotate(${ang} ${p[0]} ${p[1]})`} />;
      })}
    </g>
  );
};

/** Bastón de viajero desde la mano hasta el suelo. */
export const Baston: React.FC<{ mano: P; suelo: number }> = ({ mano, suelo }) => (
  <path d={`M${mano[0]} ${mano[1] - 30} L${mano[0] + 14} ${suelo}`} stroke={C.negro} strokeWidth={8} strokeLinecap="round" />
);

/** Bebé fajado. */
export const Bebe: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-20)`}>
    <path d={suave([[-40, 0], [-30, -16], [20, -18], [40, -6], [36, 10], [-30, 12]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={2.5} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-24 + i * 14} -14 l 8 24`} stroke={C.purpura} strokeWidth={3} />)}
    <circle cx={44} cy={-6} r={14} fill={C.blanco} stroke={C.negro} strokeWidth={2.5} />
    <path d="M36 -16 q 8 -8 18 -2" stroke={C.negro} strokeWidth={4} fill="none" />
    <Inc d="M44 -8 q 4 2 6 0" c={C.negro} w={1.5} />
  </g>
);

/** Balanza de Temis. Origen = mano que la sostiene. */
export const Balanza: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => {
  const a = Math.sin(f / 18) * 6;
  const pl = (sx: number) => {
    const dy = sx * Math.sin((a * Math.PI) / 180) * 60;
    return (
      <g transform={`translate(${sx * 60} ${dy})`}>
        <path d="M0 0 L -22 50 M0 0 L 22 50" stroke={C.negro} strokeWidth={2} />
        <path d="M-28 50 Q 0 70 28 50 Z" fill={C.oro} stroke={C.negro} strokeWidth={2.5} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 V 20" stroke={C.negro} strokeWidth={6} />
      <g transform={`rotate(${a})`}>
        <path d="M-64 0 H 64" stroke={C.negro} strokeWidth={6} strokeLinecap="round" />
      </g>
      {pl(-1)}
      {pl(1)}
    </g>
  );
};

/** Alas grandes de plumas (para Noto, el viento). `bate` en [-1, 1]. */
export const Alas: React.FC<{ x: number; y: number; s?: number; bate?: number; color?: string }> = ({ x, y, s = 1, bate = 0, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${bate * 18})`}>
    <path d={suave([[0, 0], [-40, -60], [-110, -130], [-200, -170], [-170, -120], [-230, -110], [-180, -70], [-220, -40], [-150, -20], [-60, 10]], true)} fill={color} />
    {Array.from({ length: 5 }, (_, i) => <Inc key={i} d={suave([[-20 - i * 8, -10 - i * 6], [-90 - i * 18, -60 - i * 10], [-160 - i * 6, -40 - i * 18]])} w={1.6} />)}
    <Borde d={suave([[-10, -14], [-60, -70], [-120, -120]])} w={8} />
  </g>
);

/** Viento: bocanada de niebla en espiral que sale de un punto hacia la dirección `dir`. */
export const Soplo: React.FC<{ x: number; y: number; f: number; o?: number; dir?: number; largo?: number }> = ({ x, y, f, o = 1, dir = 1, largo = 600 }) => (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${dir} 1)`}>
    {Array.from({ length: 5 }, (_, i) => {
      const t = ((f / 40 + i / 5) % 1), xx = t * largo, r = 18 + t * 40;
      return (
        <g key={i} opacity={Math.sin(t * Math.PI)}>
          <path d={`M${xx} ${(i % 2 ? -1 : 1) * 10 * t} a ${r} ${r * 0.7} 0 1 1 ${r * 0.6} ${r * 0.6}`} stroke={C.crema} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d={`M${xx - 60} ${-20 + i * 10} H ${xx - 10}`} stroke={C.crema} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
        </g>
      );
    })}
  </g>
);

/** Personaje cortado a la altura de la cintura (para Tritón, Gea o figuras que emergen). */
export const MedioCuerpo: React.FC<{ id: string; corte?: number; children: React.ReactNode }> = ({ id, corte = SUELO, children }) => (
  <g>
    <defs>
      <clipPath id={id}>
        <rect x={-2000} y={-2000} width={9000} height={corte + 2000} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>{children}</g>
  </g>
);

/** Tritón: torso humano con cola de pez; sopla la caracola. Origen = cintura en la línea del agua. */
export const Triton: React.FC<{ x: number; y: number; s?: number; voltear?: boolean; f: number; sopla?: boolean; id: string }> = ({ x, y, s = 1, voltear, f, sopla, id }) => {
  const ond = Math.sin(f / 10) * 14;
  const cuerpo: PersonajeProps = { x: 0, y: 176, s: 1, ropa: 'desnudo', barba: true, tocado: 'corona', brazo: sopla ? [140, 40] : [60, 40], brazoAtras: [40, 30], cabeza: sopla ? 6 : 0, boca: sopla };
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`}>
      {/* cola (se ve bajo el agua) */}
      <path d={miembro([[0, -10], [-30, 60], [-100, 110 + ond * 0.4], [-190, 90 + ond], [-240, 40 + ond]], [56, 50, 40, 24, 10])} fill={C.negro} opacity={0.75} />
      <path d={`M-236 ${40 + ond} L -290 ${0 + ond} L -260 ${46 + ond} L -284 ${92 + ond} Z`} fill={C.negro} opacity={0.75} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-20 - i * 34} ${40 + i * 10 + (i > 3 ? ond * 0.6 : 0)} q 10 10 0 20`} stroke={C.crema} strokeWidth={1.6} fill="none" opacity={0.6} />)}
      <MedioCuerpo id={id} corte={4}>
        <Personaje {...cuerpo} />
      </MedioCuerpo>
      {/* caracola */}
      {sopla && (
        <g transform="translate(78 -196) rotate(-30)">
          <path d={suave([[0, 0], [40, -14], [80, -6], [90, 10], [60, 18], [20, 12]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={3} />
          {[0, 1, 2].map((i) => <path key={i} d={`M${24 + i * 18} -10 q 6 12 0 22`} stroke={C.negro} strokeWidth={1.8} fill="none" />)}
          <Sonido x={92} y={2} f={f} s={1.2} />
        </g>
      )}
    </g>
  );
};

/** Charcos de barro brillante tras la inundación. */
export const Barro: React.FC<{ x0: number; x1: number; y?: number; o?: number }> = ({ x0, x1, y = SUELO, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: Math.ceil((x1 - x0) / 160) }, (_, i) => {
      const cx = x0 + i * 160 + azar(i) * 60, w = 40 + azar(i + 9) * 50;
      return <ellipse key={i} cx={cx} cy={y + 8} rx={w} ry={6} fill={MAR} stroke={C.crema} strokeWidth={1.2} opacity={0.8} />;
    })}
  </g>
);

/** Colina con el borde marcado (para paisajes). */
export const Colina: React.FC<{ x: number; ancho: number; alto: number; base?: number; color?: string; o?: number }> = ({ x, ancho, alto, base = SUELO, color = C.barroOscuro, o = 1 }) => (
  <path d={`M${x - ancho} ${base + 2} C ${x - ancho * 0.5} ${base - alto * 0.9}, ${x + ancho * 0.5} ${base - alto * 0.9}, ${x + ancho} ${base + 2} Z`} fill={color} opacity={o} />
);

/** Palacio de Licaón: frontón, columnas a los lados y muro del fondo con friso. Origen = base al centro. */
export const Palacio: React.FC<{ x: number; y?: number; s?: number; ancho?: number; fuego?: number; f: number; children?: React.ReactNode }> = ({ x, y = SUELO, s = 1, ancho = 640, f, children }) => {
  const h = 420;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* muro del fondo */}
      <rect x={-ancho} y={-h} width={ancho * 2} height={h} fill="#3A1A0C" />
      <path d={Array.from({ length: Math.floor((ancho * 2) / 60) }, (_, i) => `M${-ancho + i * 60 + 10} ${-h + 56} v -20 h 30 v 14 h -14 v -6`).join(' ')} stroke={C.barro} strokeWidth={3} fill="none" opacity={0.7} />
      {[-0.55, 0, 0.55].map((k) => (
        <g key={k} transform={`translate(${k * ancho} ${-h + 150})`}>
          <rect x={-60} y={0} width={120} height={170} fill={C.negro} opacity={0.6} />
          <path d="M-60 0 Q 0 -50 60 0" fill={C.negro} opacity={0.6} />
        </g>
      ))}
      {children}
      {/* columnas laterales y frontón */}
      {[-1, 1].map((sg) => [0, 1].map((j) => {
        const cx = sg * (ancho - 40 - j * 90);
        return (
          <g key={`${sg}${j}`}>
            <rect x={cx - 22} y={-h + 20} width={44} height={h - 30} fill={C.negro} />
            <rect x={cx - 32} y={-h + 10} width={64} height={14} fill={C.negro} />
            <rect x={cx - 30} y={-12} width={60} height={12} fill={C.negro} />
            {[-10, 0, 10].map((d) => <path key={d} d={`M${cx + d} ${-h + 30} V -16`} stroke={C.crema} strokeWidth={1.2} opacity={0.5} />)}
          </g>
        );
      }))}
      <rect x={-ancho - 20} y={-h - 30} width={ancho * 2 + 40} height={34} fill={C.negro} />
      <Borde d={`M${-ancho - 10} ${-h - 12} H ${ancho + 10}`} w={8} />
      <path d={`M${-ancho - 30} ${-h - 30} L 0 ${-h - 150} L ${ancho + 30} ${-h - 30} Z`} fill={C.negro} />
      <path d={`M${-ancho * 0.6} ${-h - 46} L 0 ${-h - 120} L ${ancho * 0.6} ${-h - 46}`} stroke={C.crema} strokeWidth={3} fill="none" />
      <rect x={-ancho - 40} y={-6} width={ancho * 2 + 80} height={10} fill={C.negro} />
      {/* antorchas del muro */}
      {[-0.28, 0.28].map((k) => <circle key={k} cx={k * ancho} cy={-h + 120} r={8} fill={C.oro} opacity={0.6 + Math.sin(f / 4 + k) * 0.3} />)}
    </g>
  );
};

/** Trono simple. Origen = base. */
export const Trono: React.FC<{ x: number; y?: number; s?: number; voltear?: boolean }> = ({ x, y = SUELO, s = 1, voltear }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`}>
    <path d="M-60 0 L -56 -150 L -40 -260 L -26 -260 L -30 -150 L 60 -150 L 64 0 L 50 0 L 48 -120 L -40 -120 L -44 0 Z" fill={C.negro} />
    <Borde d="M-56 -150 H 62" w={8} />
    <path d="M60 -150 l 10 -24" stroke={C.negro} strokeWidth={8} />
  </g>
);

/** Rótulo pequeño dentro del cartel: contador de días con marcas. */
export const Marcas: React.FC<{ x: number; y: number; n: number; o?: number }> = ({ x, y, n, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: Math.max(0, Math.min(10, n)) }, (_, i) => (
      <path key={i} d={`M${x + i * 26} ${y} l 6 -40`} stroke={C.crema} strokeWidth={6} strokeLinecap="round" style={{ paintOrder: 'stroke' }} />
    ))}
  </g>
);
