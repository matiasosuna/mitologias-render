// Piel hindú (tema "pahari"): guardas, franjas y suelo al estilo de la pintura en miniatura de las cortes rajput y
// pahari (Kangra, Guler, Basohli, Mewar): colores planos de joya, oro, margen rojo con enredadera de flores, filetes
// de oro, pétalos de loto y la pradera verde con matas en flor del suelo de las miniaturas.
// No importa nada de vasija.tsx (vasija lo importa a él): colores literales y medidas del marco copiadas.
import React from 'react';

/** Paleta de miniatura: rojo indio, azafrán, lapislázuli, malaquita, rosa, oro y marfil. */
export const PH = {
  marfil: '#F6ECD2', crema2: '#EADCB4', ocre: '#E9C77A', rojo: '#B3261E', rojoOsc: '#7A1712', azafran: '#E8892B', amarillo: '#F0C24A',
  oro: '#D9A62E', oroOsc: '#9C7416', lapis: '#1F3F8F', azul: '#3D72C4', azulClaro: '#8FB8E8', verde: '#3E7D4A', verdeClaro: '#7FB069',
  pasto: '#5E8C3A', pastoOsc: '#3F6A28', rosa: '#E79AA6', rosaOsc: '#C2566A', blanco: '#FFF9EC', negro: '#1E1410', gris: '#8A8F98',
  ceniza: '#A9BCCB', noche: '#16205A', violeta: '#5A3A78',
};
const ARRIBA = 126, SUELO = 790, ABAJO = SUELO + 40; // iguales a vasija.tsx
const r1 = (v: number) => v.toFixed(1);

export type TipoFranjaPahari = 'flores' | 'lotos' | 'joyas' | 'oro' | 'nubes';

/** Florcita de cinco pétalos (las de los márgenes de las miniaturas). */
export const Florcita: React.FC<{ x: number; y: number; r?: number; c?: string; centro?: string }> = ({ x, y, r = 6, c = PH.blanco, centro = PH.amarillo }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`}>
    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-r * 0.62} rx={r * 0.42} ry={r * 0.62} fill={c} stroke={PH.negro} strokeWidth={0.8} transform={`rotate(${a})`} />)}
    <circle r={r * 0.3} fill={centro} />
  </g>
);

/** Franja decorativa de miniatura que se desliza con la cámara. */
export const FranjaPahari: React.FC<{ y: number; alto: number; desplaz: number; tipo: TipoFranjaPahari; ancho?: number }> = ({ y, alto, desplaz, tipo, ancho = 2000 }) => {
  const paso = tipo === 'flores' ? alto * 2.2 : tipo === 'lotos' ? alto * 0.9 : tipo === 'joyas' ? alto * 1.3 : tipo === 'nubes' ? alto * 2.6 : alto * 1.6;
  const n = Math.ceil(ancho / paso) + 3;
  const fondo = tipo === 'flores' ? PH.rojo : tipo === 'lotos' ? PH.lapis : tipo === 'joyas' ? PH.oro : tipo === 'nubes' ? PH.lapis : PH.oro;
  return (
    <g transform={`translate(${r1(-(desplaz % (paso * 2)))} ${y})`}>
      <rect x={0} y={0} width={n * paso} height={alto} fill={fondo} />
      {tipo === 'flores' && <path d={`M0 ${r1(alto / 2)} ` + Array.from({ length: n }, (_, i) => `q ${r1(paso / 4)} ${r1(i % 2 ? alto * 0.34 : -alto * 0.34)} ${r1(paso / 2)} 0 t ${r1(paso / 2)} 0`).join(' ')} stroke={PH.oro} strokeWidth={Math.max(1.6, alto * 0.06)} fill="none" />}
      {Array.from({ length: n }, (_, i) => {
        const x0 = i * paso, cx = x0 + paso / 2, cy = alto / 2;
        if (tipo === 'flores') {
          // Enredadera: hoja verde arriba y abajo, flor blanca o rosa en el medio.
          const r = alto * 0.26;
          return <g key={i}>
            <path d={`M${r1(x0 + paso * 0.25)} ${r1(cy)} q ${r1(alto * 0.15)} ${r1(-alto * 0.38)} ${r1(alto * 0.42)} ${r1(-alto * 0.3)} q ${r1(-alto * 0.1)} ${r1(alto * 0.3)} ${r1(-alto * 0.42)} ${r1(alto * 0.3)} Z`} fill={PH.verdeClaro} stroke={PH.negro} strokeWidth={0.8} />
            <path d={`M${r1(x0 + paso * 0.75)} ${r1(cy)} q ${r1(alto * 0.15)} ${r1(alto * 0.38)} ${r1(alto * 0.42)} ${r1(alto * 0.3)} q ${r1(-alto * 0.1)} ${r1(-alto * 0.3)} ${r1(-alto * 0.42)} ${r1(-alto * 0.3)} Z`} fill={PH.verdeClaro} stroke={PH.negro} strokeWidth={0.8} />
            <Florcita x={cx} y={cy} r={r} c={i % 2 ? PH.rosa : PH.blanco} />
          </g>;
        }
        if (tipo === 'lotos') {
          // Pétalos de loto apuntando arriba, alternando rosa y blanco, con borde de oro.
          const w = paso * 0.48;
          return <g key={i}>
            <path d={`M${r1(cx - w)} ${r1(alto * 0.92)} C ${r1(cx - w)} ${r1(alto * 0.4)}, ${r1(cx - w * 0.3)} ${r1(alto * 0.14)}, ${r1(cx)} ${r1(alto * 0.06)} C ${r1(cx + w * 0.3)} ${r1(alto * 0.14)}, ${r1(cx + w)} ${r1(alto * 0.4)}, ${r1(cx + w)} ${r1(alto * 0.92)} Z`} fill={i % 2 ? PH.rosa : PH.blanco} stroke={PH.oro} strokeWidth={2} />
            <path d={`M${r1(cx)} ${r1(alto * 0.2)} V ${r1(alto * 0.84)}`} stroke={i % 2 ? PH.rosaOsc : PH.rosa} strokeWidth={1.4} />
          </g>;
        }
        if (tipo === 'joyas') {
          // Engarces de oro con rubí y esmeralda alternados, perlas entre medio.
          const r = alto * 0.3;
          return <g key={i}>
            <rect x={cx - r * 1.1} y={cy - r * 1.1} width={r * 2.2} height={r * 2.2} rx={r * 0.5} fill={PH.oroOsc} transform={`rotate(45 ${r1(cx)} ${r1(cy)})`} />
            <circle cx={cx} cy={cy} r={r} fill={i % 2 ? PH.verde : PH.rojo} stroke={PH.negro} strokeWidth={1.2} />
            <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.25} fill={PH.blanco} opacity={0.7} />
            <circle cx={x0} cy={cy} r={alto * 0.1} fill={PH.blanco} stroke={PH.negro} strokeWidth={0.8} />
          </g>;
        }
        if (tipo === 'nubes') {
          // Nubes rizadas de las miniaturas: rulos blancos sobre lapislázuli con un filete de oro.
          return <g key={i}>
            <path d={`M${r1(x0)} ${r1(alto * 0.75)} c ${r1(paso * 0.05)} ${r1(-alto * 0.45)} ${r1(paso * 0.2)} ${r1(-alto * 0.45)} ${r1(paso * 0.22)} ${r1(-alto * 0.1)} c ${r1(paso * 0.04)} ${r1(-alto * 0.5)} ${r1(paso * 0.26)} ${r1(-alto * 0.5)} ${r1(paso * 0.28)} 0 c ${r1(paso * 0.06)} ${r1(-alto * 0.35)} ${r1(paso * 0.2)} ${r1(-alto * 0.35)} ${r1(paso * 0.22)} 0 c ${r1(paso * 0.1)} ${r1(-alto * 0.2)} ${r1(paso * 0.2)} 0 ${r1(paso * 0.28)} ${r1(alto * 0.1)} Z`} fill={PH.blanco} stroke={PH.oro} strokeWidth={1.6} />
          </g>;
        }
        // oro: filete con rombos oscuros
        return <g key={i}><path d={`M${r1(cx)} ${r1(alto * 0.15)} L ${r1(cx + paso * 0.3)} ${r1(cy)} L ${r1(cx)} ${r1(alto * 0.85)} L ${r1(cx - paso * 0.3)} ${r1(cy)} Z`} fill={PH.rojoOsc} stroke={PH.negro} strokeWidth={0.8} /><circle cx={x0} cy={cy} r={alto * 0.14} fill={PH.blanco} /></g>;
      })}
    </g>
  );
};

/** Guardas fijas del marco en el tema pahari: margen rojo con flores, filetes de oro y pétalos de loto. */
export const GuardasPahari: React.FC<{ desplaz: number }> = ({ desplaz }) => (
  <>
    <rect x={0} y={0} width={1920} height={ARRIBA} fill={PH.marfil} />
    <FranjaPahari y={6} alto={54} desplaz={desplaz} tipo="flores" />
    <rect x={0} y={60} width={1920} height={4} fill={PH.negro} />
    <rect x={0} y={64} width={1920} height={8} fill={PH.oro} />
    <FranjaPahari y={72} alto={42} desplaz={desplaz * 0.7} tipo="lotos" />
    <rect x={0} y={ARRIBA - 12} width={1920} height={6} fill={PH.oro} />
    <rect x={0} y={ARRIBA - 6} width={1920} height={4} fill={PH.rojo} />
    <rect x={0} y={ARRIBA - 3} width={1920} height={4} fill={PH.negro} />
    <rect x={0} y={ABAJO} width={1920} height={130} fill={PH.marfil} />
    <rect x={0} y={ABAJO} width={1920} height={4} fill={PH.negro} />
    <rect x={0} y={ABAJO + 4} width={1920} height={6} fill={PH.oro} />
    <FranjaPahari y={ABAJO + 10} alto={40} desplaz={desplaz * 0.8} tipo="joyas" />
    <rect x={0} y={ABAJO + 50} width={1920} height={4} fill={PH.negro} />
    <FranjaPahari y={ABAJO + 54} alto={62} desplaz={desplaz} tipo="flores" />
    <rect x={0} y={ABAJO + 116} width={1920} height={5} fill={PH.oro} />
    <rect x={0} y={ABAJO + 121} width={1920} height={5} fill={PH.negro} />
    <rect x={0} y={ABAJO + 126} width={1920} height={200} fill={PH.negro} />
  </>
);

/** Mata en flor del suelo (arbusto redondo con florcitas). */
export const Mata: React.FC<{ x: number; y: number; s?: number; c?: string; flor?: string }> = ({ x, y, s = 1, c = PH.pastoOsc, flor = PH.rosa }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-22 0 C -30 -14, -18 -30, -6 -24 C -2 -36, 16 -36, 18 -22 C 30 -24, 32 -6, 22 0 Z" fill={c} stroke={PH.negro} strokeWidth={1.2} />
    {[[-12, -16], [4, -26], [14, -10]].map(([fx, fy], i) => <Florcita key={i} x={fx} y={fy} r={5} c={i % 2 ? PH.blanco : flor} />)}
  </g>
);

/** Suelo de miniatura: pradera verde plana con borde oscuro y matas en flor. */
export const SueloPahari: React.FC<{ desde?: number; hasta?: number; color?: string }> = ({ desde: x0 = -400, hasta = 5000, color }) => {
  const n = Math.ceil((hasta - x0) / 170);
  const c = color && color !== PH.negro && color !== '#1E1410' && color !== '#17110E' ? color : PH.pasto;
  return (
    <g>
      <rect x={x0} y={SUELO} width={hasta - x0} height={220} fill={c} />
      <rect x={x0} y={SUELO} width={hasta - x0} height={5} fill={PH.negro} opacity={0.8} />
      <rect x={x0} y={SUELO + 5} width={hasta - x0} height={4} fill={PH.verdeClaro} opacity={0.6} />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * 170;
        return <g key={i}>
          <Mata x={x + 40} y={SUELO + 30} s={0.7} flor={i % 3 ? PH.rosa : PH.amarillo} />
          {[0, 1, 2].map((k) => <path key={k} d={`M${x + 110 + k * 8} ${SUELO + 26} q ${-4 + k * 4} -10 ${-2 + k * 4} -16`} stroke={PH.verdeClaro} strokeWidth={2} fill="none" />)}
          <circle cx={x + 140} cy={SUELO + 22} r={2.6} fill={PH.blanco} />
        </g>;
      })}
    </g>
  );
};

/** Cabecera de los verticales (Short, Reel): 1080×110 con margen de flores y loto. */
export const CabeceraPahari: React.FC<{ f: number }> = ({ f }) => (
  <>
    <rect width={1080} height={110} fill={PH.marfil} />
    <FranjaPahari y={6} alto={50} desplaz={f} tipo="flores" ancho={1080} />
    <rect y={56} width={1080} height={6} fill={PH.oro} />
    <FranjaPahari y={62} alto={40} desplaz={f * 0.7} tipo="lotos" ancho={1080} />
    <rect y={104} width={1080} height={6} fill={PH.negro} />
  </>
);
/** Fondo oscuro de los marcos de los verticales (degradé lapislázuli → casi negro). */
export const DEGRADE_PAHARI = 'linear-gradient(#16205A, #1E1410)';
export const DEGRADE_PAHARI_ARRIBA = 'linear-gradient(#1E1410, #16205A)';
