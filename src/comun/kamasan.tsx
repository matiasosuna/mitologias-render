// Piel balinesa (tema "kamasan"): guardas, franjas y suelo al estilo de la pintura wayang de Kamasan (Klungkung,
// techo de la Kerta Gosa): tela crema, colores planos y terrosos (rojo, ocre, índigo, negro de hollín, blanco de
// hueso), nubes en voluta (awan), bordes de llamas (api-api), enredaderas (patra) y la tela poleng a cuadros.
// No importa nada de vasija.tsx (vasija lo importa a él): colores literales y medidas del marco copiadas.
import React from 'react';

/** Paleta de Kamasan: pigmentos de tierra, índigo y hollín sobre tela crema. */
export const KM = {
  crema: '#EFE0BE', crema2: '#E2CC9C', rojo: '#B23A26', rojoOsc: '#7A2418', ocre: '#C98F3A', ocreClaro: '#E2B865',
  indigo: '#2E3F6E', indigoOsc: '#1C2747', azul: '#7F95BC', azulClaro: '#B9C6DE', negro: '#1E1612', blanco: '#F8F1DF',
  rosa: '#D99A82', verde: '#5E7A5A', verdeClaro: '#93A97C', tierra: '#8A5A2E', gris: '#8E8A80', oro: '#D9A63A',
};
const ARRIBA = 126, SUELO = 790, ABAJO = SUELO + 40; // iguales a vasija.tsx
const r1 = (v: number) => v.toFixed(1);

export type TipoFranjaKm = 'awan' | 'api' | 'poleng' | 'patra' | 'tumpal';

/** Espiral chica (remate de nubes, rocas y llamas). */
export const Espiral: React.FC<{ x: number; y: number; r: number; c?: string; w?: number; sentido?: 1 | -1 }> = ({ x, y, r, c = KM.indigo, w = 2, sentido = 1 }) => (
  <path d={`M${r1(x + r * sentido)} ${r1(y)} A ${r1(r)} ${r1(r)} 0 1 ${sentido > 0 ? 0 : 1} ${r1(x - r * sentido)} ${r1(y)} A ${r1(r * 0.66)} ${r1(r * 0.66)} 0 0 ${sentido > 0 ? 0 : 1} ${r1(x + r * 0.33 * sentido)} ${r1(y)} A ${r1(r * 0.33)} ${r1(r * 0.33)} 0 0 ${sentido > 0 ? 0 : 1} ${r1(x)} ${r1(y - r * 0.2)}`} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" />
);

/** Franja decorativa de Kamasan que se desliza con la cámara. */
export const FranjaKamasan: React.FC<{ y: number; alto: number; desplaz: number; tipo: TipoFranjaKm; ancho?: number; arriba?: boolean }> = ({ y, alto, desplaz, tipo, ancho = 2000, arriba = true }) => {
  const paso = tipo === 'awan' ? alto * 1.7 : tipo === 'api' ? alto * 0.9 : tipo === 'poleng' ? alto / 2 : tipo === 'patra' ? alto * 1.8 : alto * 1.1;
  const n = Math.ceil(ancho / paso) + 3;
  const fondo = tipo === 'api' ? KM.crema2 : tipo === 'poleng' ? KM.blanco : KM.crema;
  return (
    <g transform={`translate(${r1(-(desplaz % (paso * 2)))} ${y})`}>
      <rect x={0} y={0} width={n * paso} height={alto} fill={fondo} />
      {Array.from({ length: n }, (_, i) => {
        const x0 = i * paso;
        if (tipo === 'awan') {
          // Nube en voluta: lóbulo grande con espiral + lóbulo chico, borde índigo (o rojo, alternando).
          const b = alto * 0.9, R = paso * 0.3, r = paso * 0.2, c = i % 2 ? KM.rojo : KM.indigo;
          const d = `M${r1(x0 + paso * 0.02)} ${r1(b)} A ${r1(R)} ${r1(R * 1.25)} 0 0 1 ${r1(x0 + paso * 0.02 + R * 2)} ${r1(b)} A ${r1(r)} ${r1(r * 1.2)} 0 0 1 ${r1(x0 + paso * 0.02 + R * 2 + r * 2)} ${r1(b)} Z`;
          return <g key={i}>
            <path d={d} fill={i % 2 ? KM.blanco : KM.azulClaro} stroke={c} strokeWidth={2.4} />
            <Espiral x={x0 + paso * 0.02 + R} y={b - R * 0.62} r={R * 0.48} c={c} w={2} />
            <path d={`M${r1(x0 + paso * 0.02 + R * 2 + r * 0.5)} ${r1(b - r * 0.5)} q ${r1(r * 0.5)} ${r1(-r * 0.6)} ${r1(r)} 0`} stroke={c} strokeWidth={1.6} fill="none" />
          </g>;
        }
        if (tipo === 'api') {
          // Lengua de llama que se curva en la punta; roja con alma ocre. arriba = las puntas hacia arriba.
          const w = paso, h = alto * 0.92, s = arriba ? 1 : -1, base = arriba ? alto : 0;
          const p = (dx: number, dy: number) => `${r1(x0 + dx * w)} ${r1(base - s * dy * h)}`;
          return <g key={i}>
            <path d={`M${p(0, 0)} C ${p(0.05, 0.5)} ${p(0.55, 0.55)} ${p(0.62, 1)} C ${p(0.82, 0.62)} ${p(1.02, 0.4)} ${p(1, 0)} Z`} fill={KM.rojo} stroke={KM.negro} strokeWidth={1.6} />
            <path d={`M${p(0.25, 0)} C ${p(0.3, 0.3)} ${p(0.55, 0.35)} ${p(0.6, 0.62)} C ${p(0.72, 0.4)} ${p(0.82, 0.25)} ${p(0.8, 0)} Z`} fill={KM.ocreClaro} />
          </g>;
        }
        if (tipo === 'poleng') {
          // Tela poleng: cuadros blanco y negro (el equilibrio de los opuestos), dos filas.
          return <g key={i}>
            <rect x={x0} y={0} width={paso} height={alto / 2} fill={i % 2 ? KM.negro : KM.blanco} />
            <rect x={x0} y={alto / 2} width={paso} height={alto / 2} fill={i % 2 ? KM.blanco : KM.negro} />
          </g>;
        }
        if (tipo === 'patra') {
          // Enredadera: tallo ondulado ocre con hojas rojas e índigo y una espiral por tramo.
          const m = alto / 2, a = alto * 0.28;
          return <g key={i}>
            <path d={`M${r1(x0)} ${r1(m)} C ${r1(x0 + paso * 0.25)} ${r1(m - a)}, ${r1(x0 + paso * 0.25)} ${r1(m - a)}, ${r1(x0 + paso * 0.5)} ${r1(m)} S ${r1(x0 + paso * 0.75)} ${r1(m + a)}, ${r1(x0 + paso)} ${r1(m)}`} stroke={KM.ocre} strokeWidth={alto * 0.1} fill="none" />
            <ellipse cx={x0 + paso * 0.25} cy={m - a - alto * 0.12} rx={alto * 0.12} ry={alto * 0.22} fill={KM.rojo} stroke={KM.negro} strokeWidth={1.2} transform={`rotate(-30 ${r1(x0 + paso * 0.25)} ${r1(m - a - alto * 0.12)})`} />
            <ellipse cx={x0 + paso * 0.75} cy={m + a + alto * 0.1} rx={alto * 0.12} ry={alto * 0.2} fill={KM.indigo} stroke={KM.negro} strokeWidth={1.2} transform={`rotate(30 ${r1(x0 + paso * 0.75)} ${r1(m + a + alto * 0.1)})`} />
            <Espiral x={x0 + paso * 0.5} y={m - alto * 0.06} r={alto * 0.14} c={KM.rojoOsc} w={1.6} />
          </g>;
        }
        // tumpal: triángulos rojos e índigo con línea interior.
        const c = i % 2 ? KM.indigo : KM.rojo;
        return <g key={i}>
          <path d={`M${r1(x0)} ${r1(alto)} L ${r1(x0 + paso / 2)} 2 L ${r1(x0 + paso)} ${r1(alto)} Z`} fill={c} stroke={KM.negro} strokeWidth={1.4} />
          <path d={`M${r1(x0 + paso * 0.25)} ${r1(alto - 3)} L ${r1(x0 + paso / 2)} ${r1(alto * 0.35)} L ${r1(x0 + paso * 0.75)} ${r1(alto - 3)}`} stroke={KM.ocreClaro} strokeWidth={1.8} fill="none" />
        </g>;
      })}
    </g>
  );
};

/** Guardas fijas del marco en el tema Kamasan: nubes en voluta, poleng, llamas y franja de subtítulos. */
export const GuardasKamasan: React.FC<{ desplaz: number }> = ({ desplaz }) => (
  <>
    <rect x={0} y={0} width={1920} height={ARRIBA} fill={KM.crema} />
    <rect x={0} y={3} width={1920} height={5} fill={KM.rojo} />
    <FranjaKamasan y={10} alto={58} desplaz={desplaz} tipo="awan" />
    <rect x={0} y={68} width={1920} height={3} fill={KM.negro} />
    <FranjaKamasan y={71} alto={16} desplaz={desplaz * 0.6} tipo="poleng" />
    <rect x={0} y={87} width={1920} height={3} fill={KM.negro} />
    <FranjaKamasan y={90} alto={28} desplaz={desplaz * 0.8} tipo="api" arriba={false} />
    <rect x={0} y={ARRIBA - 8} width={1920} height={4} fill={KM.rojo} />
    <rect x={0} y={ARRIBA - 4} width={1920} height={5} fill={KM.negro} />
    <rect x={0} y={ABAJO} width={1920} height={130} fill={KM.crema} />
    <rect x={0} y={ABAJO} width={1920} height={6} fill={KM.negro} />
    <FranjaKamasan y={ABAJO + 6} alto={30} desplaz={desplaz * 0.8} tipo="api" />
    <rect x={0} y={ABAJO + 36} width={1920} height={3} fill={KM.negro} />
    <FranjaKamasan y={ABAJO + 39} alto={16} desplaz={desplaz * 0.6} tipo="poleng" />
    <rect x={0} y={ABAJO + 55} width={1920} height={3} fill={KM.negro} />
    <FranjaKamasan y={ABAJO + 58} alto={58} desplaz={desplaz} tipo="awan" />
    <rect x={0} y={ABAJO + 116} width={1920} height={4} fill={KM.rojo} />
    <rect x={0} y={ABAJO + 120} width={1920} height={6} fill={KM.negro} />
    <rect x={0} y={ABAJO + 126} width={1920} height={200} fill={KM.negro} />
  </>
);

/** Roca escalonada de Kamasan (karang): bloques en escalón con espirales, como las rocas de las pinturas. */
export const Karang: React.FC<{ x: number; y: number; w?: number; h?: number; c?: string; c2?: string }> = ({ x, y, w = 60, h = 26, c = KM.ocreClaro, c2 = KM.rojoOsc }) => (
  <g>
    <path d={`M${r1(x)} ${r1(y)} V ${r1(y - h * 0.5)} H ${r1(x + w * 0.2)} V ${r1(y - h)} H ${r1(x + w * 0.7)} V ${r1(y - h * 0.6)} H ${r1(x + w)} V ${r1(y)} Z`} fill={c} stroke={KM.negro} strokeWidth={1.8} />
    <Espiral x={x + w * 0.45} y={y - h * 0.5} r={h * 0.25} c={c2} w={1.6} />
  </g>
);

/** Suelo de Kamasan: tierra ocre con rocas escalonadas y matitas en espiral, contorno negro arriba. */
export const SueloKamasan: React.FC<{ desde?: number; hasta?: number; color?: string }> = ({ desde: x0 = -400, hasta = 5000, color }) => {
  const n = Math.ceil((hasta - x0) / 90);
  const fondo = color && color !== KM.negro && color !== '#1E1612' && color !== '#17110E' ? color : KM.ocre;
  return (
    <g>
      <rect x={x0} y={SUELO} width={hasta - x0} height={220} fill={fondo} />
      <rect x={x0} y={SUELO} width={hasta - x0} height={6} fill={KM.negro} />
      <rect x={x0} y={SUELO + 46} width={hasta - x0} height={3} fill={KM.negro} opacity={0.5} />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * 90;
        return <g key={i}>
          <Karang x={x + 10} y={SUELO + 40} w={44} h={22} c={i % 3 === 0 ? KM.crema2 : KM.ocreClaro} />
          <path d={`M${x + 66} ${SUELO + 38} q -2 -12 -8 -16 M${x + 70} ${SUELO + 38} q 0 -14 6 -18 M${x + 74} ${SUELO + 38} q 4 -10 12 -10`} stroke={KM.verde} strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <circle cx={x + 48} cy={SUELO + 22} r={2.4} fill={KM.negro} opacity={0.6} />
        </g>;
      })}
    </g>
  );
};
