// Piel maorí (tema "kowhaiwhai"): guardas, franjas y suelo inspirados en los kōwhaiwhai (pinturas de las vigas del
// wharenui: rojo kōkōwai, negro y blanco con volutas koru), en las guardas tejidas tāniko, en los ojos de pāua de la
// talla y en el escalonado poutama de los paneles tukutuku. Son patrones genéricos dibujados por código: no copian
// ninguna pieza, talla ni tā moko de una persona real.
// No importa nada de vasija.tsx (vasija lo importa a él): colores literales y medidas del marco copiadas.
import React from 'react';

/** Paleta: kōkōwai (ocre rojo), negro, blanco y ocre; acentos de pāua (azul verdoso irisado) y pounamu (jade). */
export const W = {
  crema: '#F3E7CF', crema2: '#E4CFA6', rojo: '#A8251B', rojoOsc: '#6E1610', negro: '#15100E', blanco: '#FAF5EA',
  ocre: '#C8873A', ocreClaro: '#E2B46A', tierra: '#6B3B22', tierraOsc: '#3E2214', paua: '#1F8F8A', pauaClaro: '#5CC9B8',
  pauaAzul: '#3D5FB0', pauaVioleta: '#6A4C9C', pounamu: '#3E7D52', pounamuClaro: '#7BB487', harakeke: '#B89A5C',
  helecho: '#4E7A3A', helechoOsc: '#2F5228', noche: '#101A30', gris: '#8A8378', piel: '#8A5434', pielM: '#A36A42',
};
const ARRIBA = 126, SUELO = 790, ABAJO = SUELO + 40; // iguales a vasija.tsx
const r1 = (v: number) => v.toFixed(1);

/** Degradé irisado de pāua (azul verdoso → violeta → verde). Se define una vez por componente con su id. */
export const DegradePaua: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={W.pauaClaro} />
      <stop offset="35%" stopColor={W.paua} />
      <stop offset="65%" stopColor={W.pauaAzul} />
      <stop offset="85%" stopColor={W.pauaVioleta} />
      <stop offset="100%" stopColor="#4FB38A" />
    </linearGradient>
  </defs>
);

export type TipoFranjaMaori = 'koru' | 'mangopare' | 'taniko' | 'paua' | 'poutama';

/** Franja decorativa que se desliza con la cámara. */
export const FranjaMaori: React.FC<{ y: number; alto: number; desplaz: number; tipo: TipoFranjaMaori; ancho?: number }> = ({ y, alto: H, desplaz, tipo, ancho = 2000 }) => {
  const paso = tipo === 'koru' ? H * 2.4 : tipo === 'mangopare' ? H * 2 : tipo === 'taniko' ? H * 1.2 : tipo === 'paua' ? H * 1.9 : H * 1.6;
  const n = Math.ceil(ancho / paso) + 3;
  const fondo = tipo === 'koru' || tipo === 'mangopare' ? W.rojo : tipo === 'taniko' ? W.negro : tipo === 'paua' ? W.negro : W.negro;
  const idP = `pauaF${tipo}${Math.round(H)}`;
  return (
    <g transform={`translate(${r1(-(desplaz % (paso * 2)))} ${y})`}>
      {tipo === 'paua' && <DegradePaua id={idP} />}
      <rect x={0} y={0} width={n * paso} height={H} fill={fondo} />
      {tipo === 'koru' && (
        // Tallo blanco ondulado continuo con bulbos koru alternados arriba (negros) y abajo (blancos con centro rojo).
        <path d={`M0 ${r1(H / 2)} ` + Array.from({ length: n }, (_, i) => `C ${r1(i * paso + paso * 0.25)} ${r1(H * 0.18)}, ${r1(i * paso + paso * 0.25)} ${r1(H * 0.82)}, ${r1(i * paso + paso * 0.5)} ${r1(H / 2)} S ${r1(i * paso + paso * 0.75)} ${r1(H * 0.18)}, ${r1((i + 1) * paso)} ${r1(H / 2)}`).join(' ')} stroke={W.blanco} strokeWidth={H * 0.09} fill="none" />
      )}
      {Array.from({ length: n }, (_, i) => {
        const x0 = i * paso;
        if (tipo === 'koru') {
          const r = H * 0.2;
          const bulbo = (cx: number, cy: number, arriba: boolean) => {
            const k = arriba ? 1 : -1;
            return <g>
              <path d={`M${r1(cx - r * 1.6)} ${r1(H / 2)} C ${r1(cx - r * 1.6)} ${r1(cy + k * r * 0.2)}, ${r1(cx - r)} ${r1(cy - k * r)}, ${r1(cx)} ${r1(cy - k * r)}`} stroke={W.blanco} strokeWidth={H * 0.07} fill="none" />
              <circle cx={cx} cy={cy} r={r} fill={arriba ? W.negro : W.blanco} stroke={arriba ? W.blanco : W.negro} strokeWidth={H * 0.05} />
              <circle cx={cx + r * 0.25} cy={cy + k * r * 0.15} r={r * 0.45} fill={arriba ? W.rojo : W.rojo} stroke={arriba ? W.blanco : W.negro} strokeWidth={H * 0.03} />
              <circle cx={cx + r * 0.32} cy={cy + k * r * 0.2} r={r * 0.15} fill={arriba ? W.blanco : W.negro} />
            </g>;
          };
          return <g key={i}>{bulbo(x0 + paso * 0.32, H * 0.3, true)}{bulbo(x0 + paso * 0.82, H * 0.7, false)}</g>;
        }
        if (tipo === 'mangopare') {
          // "Cabeza de pez martillo": dos koru enfrentados unidos por una barra, alternando arriba/abajo.
          const cy = i % 2 ? H * 0.58 : H * 0.42, r = H * 0.27, cx1 = x0 + paso * 0.24, cx2 = x0 + paso * 0.76;
          return <g key={i}>
            <rect x={cx1} y={cy - r * 0.42} width={cx2 - cx1} height={r * 0.84} fill={W.negro} stroke={W.blanco} strokeWidth={H * 0.04} />
            {[cx1, cx2].map((cx, k) => <g key={k}>
              <circle cx={cx} cy={cy} r={r} fill={W.negro} stroke={W.blanco} strokeWidth={H * 0.05} />
              <path d={`M${r1(cx)} ${r1(cy - r * 0.55)} a ${r1(r * 0.55)} ${r1(r * 0.55)} 0 1 ${k ? 0 : 1} 0.1 0`} stroke={W.blanco} strokeWidth={H * 0.035} fill="none" />
              <circle cx={cx} cy={cy} r={r * 0.22} fill={W.rojo} />
            </g>)}
            <path d={`M${r1(x0)} ${r1(H * 0.06)} H ${r1(x0 + paso)} M${r1(x0)} ${r1(H * 0.94)} H ${r1(x0 + paso)}`} stroke={W.blanco} strokeWidth={H * 0.05} />
          </g>;
        }
        if (tipo === 'taniko') {
          // Guarda tejida: triángulos negros y blancos con rombo rojo en el medio.
          return <g key={i}>
            <path d={`M${r1(x0)} ${r1(H)} L ${r1(x0 + paso / 2)} ${r1(H * 0.12)} L ${r1(x0 + paso)} ${r1(H)} Z`} fill={W.blanco} />
            <path d={`M${r1(x0 + paso / 2)} ${r1(H * 0.42)} L ${r1(x0 + paso * 0.68)} ${r1(H * 0.7)} L ${r1(x0 + paso / 2)} ${r1(H * 0.98)} L ${r1(x0 + paso * 0.32)} ${r1(H * 0.7)} Z`} fill={W.rojo} />
            <path d={`M${r1(x0)} ${r1(H * 0.12)} h ${r1(paso * 0.16)} v ${r1(H * 0.16)} h ${r1(-paso * 0.16)} Z`} fill={W.ocre} />
          </g>;
        }
        if (tipo === 'paua') {
          // Ojos de pāua incrustados (como en la talla): óvalos irisados sobre negro, con puntitos blancos.
          return <g key={i}>
            <ellipse cx={x0 + paso / 2} cy={H / 2} rx={paso * 0.32} ry={H * 0.36} fill={`url(#${idP})`} stroke={W.blanco} strokeWidth={1.4} />
            <ellipse cx={x0 + paso / 2 - paso * 0.08} cy={H / 2 - H * 0.1} rx={paso * 0.08} ry={H * 0.08} fill="#FFFFFF" opacity={0.5} />
            <circle cx={x0 + 3} cy={H / 2} r={H * 0.08} fill={W.blanco} />
          </g>;
        }
        // poutama: escalones que suben (tukutuku), blanco y ocre sobre negro.
        const s = H / 4;
        return <path key={i} d={`M${r1(x0)} ${r1(H)} V ${r1(H - s)} H ${r1(x0 + paso * 0.25)} V ${r1(H - 2 * s)} H ${r1(x0 + paso * 0.5)} V ${r1(H - 3 * s)} H ${r1(x0 + paso * 0.75)} V ${r1(H - 3.6 * s)}`} stroke={i % 2 ? W.ocreClaro : W.blanco} strokeWidth={s * 0.55} fill="none" strokeLinejoin="miter" />;
      })}
    </g>
  );
};

/** Guardas fijas del marco en el tema maorí: kōwhaiwhai arriba, tāniko y pāua; abajo pāua, mangopare y la franja de subtítulos. */
export const GuardasMaori: React.FC<{ desplaz: number }> = ({ desplaz }) => (
  <>
    <rect x={0} y={0} width={1920} height={ARRIBA} fill={W.negro} />
    <FranjaMaori y={6} alto={58} desplaz={desplaz} tipo="koru" />
    <rect x={0} y={64} width={1920} height={4} fill={W.negro} />
    <FranjaMaori y={68} alto={30} desplaz={desplaz * 0.7} tipo="taniko" />
    <FranjaMaori y={98} alto={20} desplaz={desplaz * 0.85} tipo="paua" />
    <rect x={0} y={ARRIBA - 8} width={1920} height={3} fill={W.ocre} />
    <rect x={0} y={ARRIBA - 5} width={1920} height={6} fill={W.negro} />
    <rect x={0} y={ABAJO} width={1920} height={130} fill={W.negro} />
    <rect x={0} y={ABAJO} width={1920} height={4} fill={W.ocre} />
    <FranjaMaori y={ABAJO + 6} alto={22} desplaz={desplaz * 0.85} tipo="paua" />
    <FranjaMaori y={ABAJO + 30} alto={26} desplaz={desplaz * 0.7} tipo="taniko" />
    <FranjaMaori y={ABAJO + 58} alto={58} desplaz={desplaz} tipo="mangopare" />
    <rect x={0} y={ABAJO + 116} width={1920} height={4} fill={W.ocre} />
    <rect x={0} y={ABAJO + 120} width={1920} height={206} fill={W.negro} />
  </>
);

/** Suelo: tierra (whenua) con guarda tāniko arriba y frondas koru de helecho dispersas. */
export const SueloMaori: React.FC<{ desde?: number; hasta?: number; color?: string }> = ({ desde: x0 = -400, hasta = 5000, color }) => {
  const n = Math.ceil((hasta - x0) / 60);
  return (
    <g>
      <rect x={x0} y={SUELO} width={hasta - x0} height={240} fill={color && color !== W.negro && color !== '#15100E' && color !== '#1A1311' ? color : W.tierra} />
      <rect x={x0} y={SUELO} width={hasta - x0} height={6} fill={W.negro} />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * 60;
        return <g key={i}>
          <path d={`M${x} ${SUELO + 6} l 15 13 l 15 -13 Z`} fill={i % 2 ? W.ocre : W.rojoOsc} opacity={0.9} />
          <path d={`M${x + 30} ${SUELO + 6} l 15 13 l 15 -13 Z`} fill={W.negro} opacity={0.55} />
          {i % 3 === 1 && <path d={`M${x + 20} ${SUELO + 52} c 0 -14, 14 -18, 20 -10 c 4 6, -2 12, -7 8 c -3 -3, 0 -6, 2 -4`} stroke={W.ocreClaro} strokeWidth={2.4} fill="none" opacity={0.55} />}
          {i % 4 === 3 && <circle cx={x + 44} cy={SUELO + 34} r={2.2} fill={W.negro} opacity={0.5} />}
        </g>;
      })}
    </g>
  );
};
