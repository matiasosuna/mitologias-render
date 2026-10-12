// Piel azteca (tema "codice"): guardas, franjas y suelo al estilo de la pintura de los códices
// (Borgia, Borbónico, Florentino): colores planos con contorno negro, grecas escalonadas (xicalcoliuhqui),
// cuentas de jade (chalchihuitl), "ojos de estrella" de las bandas celestes y el glifo de tierra (tlalli).
// No importa nada de vasija.tsx (vasija lo importa a él): colores literales y medidas del marco copiadas.
import React from 'react';

/** Paleta de códice: ocre rojo, turquesa, azul maya, amarillo, negro y crema (piel de venado con estuco). */
export const K = {
  crema: '#F3E6C4', crema2: '#E9D6A6', rojo: '#B8321F', rojoOsc: '#7E1F14', turquesa: '#2FA39A', turquesaOsc: '#1E6E68',
  azul: '#3B7FB8', azulOsc: '#24527E', jade: '#3E8A5A', jadeClaro: '#7DB87A', amarillo: '#E6B12E', ocre: '#A8642E',
  tierra: '#8A4A22', negro: '#1A1311', blanco: '#FBF5E4', rosa: '#D9826A', gris: '#8C8478', noche: '#16213F',
};
const ARRIBA = 126, SUELO = 790, ABAJO = SUELO + 40; // iguales a vasija.tsx
const r1 = (v: number) => v.toFixed(1);

export type TipoFranja = 'xical' | 'jade' | 'estrellas' | 'dientes' | 'barras';

/** Franja decorativa de códice que se desliza con la cámara. */
export const FranjaCodice: React.FC<{ y: number; alto: number; desplaz: number; tipo: TipoFranja; ancho?: number }> = ({ y, alto, desplaz, tipo, ancho = 2000 }) => {
  const paso = tipo === 'xical' ? alto * 1.3 : tipo === 'jade' ? alto * 1.25 : tipo === 'estrellas' ? alto * 1.6 : tipo === 'dientes' ? alto : alto * 1.4;
  const n = Math.ceil(ancho / paso) + 3;
  const fondo = tipo === 'estrellas' ? K.noche : tipo === 'dientes' ? K.rojo : K.crema;
  return (
    <g transform={`translate(${r1(-(desplaz % (paso * 2)))} ${y})`}>
      <rect x={0} y={0} width={n * paso} height={alto} fill={fondo} />
      {Array.from({ length: n }, (_, i) => {
        const x0 = i * paso;
        if (tipo === 'xical') {
          // Greca escalonada: escalones que suben y terminan en un gancho en espiral cuadrada; alternan rojo y negro.
          const s = alto / 5, c = i % 2 ? K.negro : K.rojo, u = paso / 6.5;
          const d = `M${r1(x0)} ${r1(alto - s * 0.5)} H${r1(x0 + u * 1.2)} V${r1(alto - s * 1.5)} H${r1(x0 + u * 2.4)} V${r1(alto - s * 2.5)} H${r1(x0 + u * 3.5)} V${r1(s * 0.55)} H${r1(x0 + u * 6)} V${r1(s * 3.5)} H${r1(x0 + u * 4.7)} V${r1(s * 1.9)}`;
          return <g key={i}><path d={d} stroke={K.negro} strokeWidth={s * 1.05} fill="none" strokeLinejoin="miter" /><path d={d} stroke={c} strokeWidth={s * 0.7} fill="none" strokeLinejoin="miter" /></g>;
        }
        if (tipo === 'jade') {
          const cx = x0 + paso / 2, r = alto * 0.36;
          return <g key={i}>
            <rect x={x0} y={alto * 0.42} width={paso} height={alto * 0.16} fill={i % 2 ? K.rojo : K.amarillo} />
            <circle cx={cx} cy={alto / 2} r={r} fill={K.turquesa} stroke={K.negro} strokeWidth={2} />
            <circle cx={cx} cy={alto / 2} r={r * 0.55} fill="none" stroke={K.blanco} strokeWidth={2} />
            <circle cx={cx} cy={alto / 2} r={r * 0.18} fill={K.negro} />
          </g>;
        }
        if (tipo === 'estrellas') {
          // "Ojos de estrella" de las bandas celestes: ojo blanco con párpado rojo sobre la noche.
          const cx = x0 + paso / 2, r = alto * 0.28;
          return <g key={i}>
            <circle cx={cx} cy={alto / 2} r={r * 1.35} fill={K.rojo} stroke={K.negro} strokeWidth={1.5} />
            <circle cx={cx} cy={alto / 2} r={r} fill={K.blanco} stroke={K.negro} strokeWidth={1.5} />
            <path d={`M${r1(cx - r)} ${r1(alto / 2)} A ${r1(r)} ${r1(r)} 0 0 1 ${r1(cx + r)} ${r1(alto / 2)} Z`} fill={K.rojo} />
            <circle cx={cx} cy={alto / 2 + r * 0.25} r={r * 0.32} fill={K.negro} />
            {i % 3 === 0 && <circle cx={x0 + 6} cy={alto * 0.25} r={2.5} fill={K.amarillo} />}
          </g>;
        }
        if (tipo === 'dientes') return <path key={i} d={`M${r1(x0)} 0 L ${r1(x0 + paso / 2)} ${r1(alto * 0.8)} L ${r1(x0 + paso)} 0 Z`} fill={K.blanco} stroke={K.negro} strokeWidth={1.5} />;
        return <g key={i}>{[0, 1, 2].map((k) => <rect key={k} x={x0 + k * paso / 3 + 1} y={2} width={paso / 3 - 2} height={alto - 4} fill={[K.rojo, K.turquesa, K.amarillo][(i + k) % 3]} stroke={K.negro} strokeWidth={1.2} />)}</g>;
      })}
    </g>
  );
};

/** Guardas fijas del marco en el tema códice: greca escalonada, cuentas de jade y franja de subtítulos. */
export const GuardasCodice: React.FC<{ desplaz: number }> = ({ desplaz }) => (
  <>
    <rect x={0} y={0} width={1920} height={ARRIBA} fill={K.crema} />
    <rect x={0} y={4} width={1920} height={6} fill={K.rojo} />
    <FranjaCodice y={14} alto={50} desplaz={desplaz} tipo="xical" />
    <rect x={0} y={66} width={1920} height={4} fill={K.negro} />
    <FranjaCodice y={72} alto={44} desplaz={desplaz * 0.7} tipo="jade" />
    <rect x={0} y={ARRIBA - 8} width={1920} height={4} fill={K.rojo} />
    <rect x={0} y={ARRIBA - 4} width={1920} height={5} fill={K.negro} />
    <rect x={0} y={ABAJO} width={1920} height={130} fill={K.crema} />
    <rect x={0} y={ABAJO} width={1920} height={6} fill={K.negro} />
    <FranjaCodice y={ABAJO + 10} alto={38} desplaz={desplaz * 0.8} tipo="jade" />
    <rect x={0} y={ABAJO + 50} width={1920} height={4} fill={K.negro} />
    <FranjaCodice y={ABAJO + 58} alto={56} desplaz={desplaz} tipo="xical" />
    <rect x={0} y={ABAJO + 116} width={1920} height={4} fill={K.rojo} />
    <rect x={0} y={ABAJO + 120} width={1920} height={6} fill={K.negro} />
    <rect x={0} y={ABAJO + 126} width={1920} height={200} fill={K.negro} />
  </>
);

/** Suelo de códice: glifo de tierra (tlalli) — franja ocre con piedritas y círculos, contorno negro arriba. */
export const SueloCodice: React.FC<{ desde?: number; hasta?: number; color?: string }> = ({ desde: x0 = -400, hasta = 5000, color }) => {
  const n = Math.ceil((hasta - x0) / 54);
  return (
    <g>
      <rect x={x0} y={SUELO} width={hasta - x0} height={220} fill={color && color !== K.negro && color !== '#1A1311' ? color : K.ocre} />
      <rect x={x0} y={SUELO} width={hasta - x0} height={6} fill={K.negro} />
      <rect x={x0} y={SUELO + 44} width={hasta - x0} height={4} fill={K.negro} opacity={0.6} />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * 54;
        return <g key={i}>
          <circle cx={x + 14} cy={SUELO + 22} r={7} fill={K.crema2} stroke={K.negro} strokeWidth={1.6} />
          <circle cx={x + 14} cy={SUELO + 22} r={2.2} fill={K.negro} />
          <circle cx={x + 36} cy={SUELO + 16} r={2.6} fill={K.negro} />
          <circle cx={x + 42} cy={SUELO + 30} r={2.2} fill={K.negro} />
          <circle cx={x + 30} cy={SUELO + 34} r={1.8} fill={K.negro} />
        </g>;
      })}
    </g>
  );
};
