// Piel de Gnosis (serie `gnosticas`, tema "gnosis"): guardas, franjas y suelo al estilo de los códices de Nag Hammadi —
// tapas de cuero marrón con líneas estampadas en rombo y la tira de cierre, hojas de papiro crema escritas con tinta
// negra y roja (bandas de trenza copta, filas de puntos rojos, la cruz con asa del final del Libro Secreto de Juan) —
// y, en las franjas de cielo, las estrellas de oro del Pleroma sobre índigo.
// No importa nada de vasija.tsx (vasija lo importa a él): colores literales y medidas del marco copiadas.
import React from 'react';

/** Paleta de Gnosis: papiro, cuero y tinta (marcos); oro, blanco e índigo (el Pleroma); verde oscuro, niebla y fuego (abajo). */
export const GN = {
  papiro: '#E8D9B0', papiro2: '#D6C08A', papiroOsc: '#B39762', cuero: '#6B4226', cueroOsc: '#43281A', cueroClaro: '#8E5E3A',
  tinta: '#1B1410', rojo: '#A8321E', rojoOsc: '#6E1E12', oro: '#E8C25A', oroClaro: '#FFE7A0', oroOsc: '#B8862E',
  blanco: '#FFF8E6', luz: '#FFFBEA', plata: '#DCE2EE', plataOsc: '#9AA2B8',
  indigo: '#1E2352', indigoOsc: '#0D1030', noche: '#07081A', violeta: '#3E3278', violetaClaro: '#8E7CC8',
  verde: '#1F3A2C', verdeOsc: '#0F2018', verdeNiebla: '#5E7A66', verdeClaro: '#7E9A6A', fuego: '#E2622A', fuegoClaro: '#F2A23A',
  ceniza: '#4A4A44', piedra: '#CFC2A2', piedraOsc: '#9C8E70', tierra: '#8A6A48', tierraOsc: '#5A4430',
};
const ARRIBA = 126, SUELO = 790, ABAJO = SUELO + 40; // iguales a vasija.tsx
const r1 = (v: number) => v.toFixed(1);

export type TipoFranjaGn = 'cuero' | 'trenza' | 'puntos' | 'estrellas' | 'llamas';

/** Estrella de ocho puntas (las luces del Pleroma). */
export const Estrella8: React.FC<{ x: number; y: number; r: number; c?: string; c2?: string }> = ({ x, y, r, c = GN.oro, c2 = GN.oroClaro }) => {
  const d = Array.from({ length: 16 }, (_, i) => { const a = (i * Math.PI) / 8 - Math.PI / 2, rr = i % 2 ? r * 0.42 : i % 4 ? r * 0.7 : r; return `${i ? 'L' : 'M'}${r1(x + Math.cos(a) * rr)} ${r1(y + Math.sin(a) * rr)}`; }).join(' ') + ' Z';
  return <g><path d={d} fill={c} /><circle cx={x} cy={y} r={r * 0.22} fill={c2} /></g>;
};

/** Cruz con asa (la que cierra el Libro Secreto de Juan en el códice II): tinta negra con relleno rojo. */
export const CruzAsa: React.FC<{ x: number; y: number; h: number; c?: string }> = ({ x, y, h, c = GN.rojo }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${r1(h / 40)})`}>
    <ellipse cx={0} cy={-13} rx={6} ry={7} fill="none" stroke={GN.tinta} strokeWidth={4.4} />
    <ellipse cx={0} cy={-13} rx={6} ry={7} fill="none" stroke={c} strokeWidth={2} />
    <path d="M0 -6 V 20 M-12 -2 H 12" stroke={GN.tinta} strokeWidth={5} strokeLinecap="round" />
    <path d="M0 -6 V 20 M-12 -2 H 12" stroke={c} strokeWidth={2.2} strokeLinecap="round" />
  </g>
);

/** Franja decorativa de códice que se desliza con la cámara. */
export const FranjaGnosis: React.FC<{ y: number; alto: number; desplaz: number; tipo: TipoFranjaGn; ancho?: number; arriba?: boolean }> = ({ y, alto, desplaz, tipo, ancho = 2000, arriba = true }) => {
  const paso = tipo === 'cuero' ? alto * 1.2 : tipo === 'trenza' ? alto * 2 : tipo === 'puntos' ? alto * 1.1 : tipo === 'estrellas' ? alto * 1.5 : alto * 0.9;
  const n = Math.ceil(ancho / paso) + 3;
  const fondo = tipo === 'cuero' ? GN.cuero : tipo === 'estrellas' ? GN.indigo : tipo === 'llamas' ? GN.verdeOsc : GN.papiro;
  return (
    <g transform={`translate(${r1(-(desplaz % (paso * 2)))} ${y})`}>
      <rect x={0} y={0} width={n * paso} height={alto} fill={fondo} />
      {tipo === 'cuero' && <>
        <rect x={0} y={alto * 0.08} width={n * paso} height={1.6} fill={GN.cueroOsc} />
        <rect x={0} y={alto * 0.9} width={n * paso} height={1.6} fill={GN.cueroOsc} />
      </>}
      {Array.from({ length: n }, (_, i) => {
        const x0 = i * paso;
        if (tipo === 'cuero') {
          // Cuero estampado: líneas en X que forman rombos, un circulito en cada cruce (como las tapas de Nag Hammadi).
          const a = alto * 0.16, b = alto * 0.84, m = alto / 2;
          return <g key={i}>
            <path d={`M${r1(x0)} ${r1(a)} L ${r1(x0 + paso)} ${r1(b)} M${r1(x0)} ${r1(b)} L ${r1(x0 + paso)} ${r1(a)}`} stroke={GN.cueroOsc} strokeWidth={2.6} />
            <path d={`M${r1(x0 + 1.5)} ${r1(a + 1.5)} L ${r1(x0 + paso + 1.5)} ${r1(b + 1.5)} M${r1(x0 + 1.5)} ${r1(b + 1.5)} L ${r1(x0 + paso + 1.5)} ${r1(a + 1.5)}`} stroke={GN.cueroClaro} strokeWidth={1.2} opacity={0.7} />
            <circle cx={x0 + paso / 2} cy={m} r={alto * 0.09} fill="none" stroke={GN.cueroOsc} strokeWidth={2} />
            <circle cx={x0 + paso / 2} cy={m} r={alto * 0.03} fill={GN.cueroClaro} />
            <circle cx={x0} cy={a - alto * 0.04} r={1.6} fill={GN.cueroClaro} />
          </g>;
        }
        if (tipo === 'trenza') {
          // Trenza copta: dos cintas (tinta negra con alma roja) que se cruzan dos veces por tramo.
          const m = alto / 2, A = alto * 0.3, q = paso / 4;
          const cinta = (s: number) => `M${r1(x0)} ${r1(m)} C ${r1(x0 + q)} ${r1(m - s * A * 1.3)}, ${r1(x0 + q)} ${r1(m - s * A * 1.3)}, ${r1(x0 + paso / 2)} ${r1(m)} S ${r1(x0 + paso - q)} ${r1(m + s * A * 1.3)}, ${r1(x0 + paso)} ${r1(m)}`;
          return <g key={i}>
            {[1, -1].map((s) => <g key={s}>
              <path d={cinta(s)} stroke={GN.tinta} strokeWidth={alto * 0.22} fill="none" />
              <path d={cinta(s)} stroke={s > 0 ? GN.rojo : GN.papiroOsc} strokeWidth={alto * 0.1} fill="none" />
            </g>)}
            <circle cx={x0 + paso / 4} cy={m} r={alto * 0.06} fill={GN.tinta} />
            <circle cx={x0 + (paso * 3) / 4} cy={m} r={alto * 0.06} fill={GN.tinta} />
          </g>;
        }
        if (tipo === 'puntos') {
          // Renglón de códice: puntos rojos entre rayas de tinta; cada tanto la cruz con asa.
          const m = alto / 2;
          return <g key={i}>
            {i % 6 === 3 ? <CruzAsa x={x0 + paso / 2} y={m + alto * 0.05} h={alto * 0.85} /> : <>
              <path d={`M${r1(x0 + paso * 0.12)} ${r1(m)} H ${r1(x0 + paso * 0.42)}`} stroke={GN.tinta} strokeWidth={alto * 0.12} strokeLinecap="round" />
              <circle cx={x0 + paso * 0.66} cy={m} r={alto * 0.13} fill={GN.rojo} stroke={GN.tinta} strokeWidth={1} />
              <circle cx={x0 + paso * 0.9} cy={m - alto * 0.18} r={alto * 0.05} fill={GN.tinta} />
              <circle cx={x0 + paso * 0.9} cy={m + alto * 0.18} r={alto * 0.05} fill={GN.tinta} />
            </>}
          </g>;
        }
        if (tipo === 'estrellas') {
          // Cielo del Pleroma: estrellas de oro de ocho puntas y puntitos blancos sobre índigo.
          return <g key={i}>
            <Estrella8 x={x0 + paso / 2} y={alto / 2} r={alto * 0.36} c={i % 3 ? GN.oro : GN.blanco} />
            <circle cx={x0 + paso * 0.08} cy={alto * 0.3} r={1.6} fill={GN.blanco} />
            <circle cx={x0 + paso * 0.14} cy={alto * 0.74} r={1.2} fill={GN.oroClaro} />
          </g>;
        }
        // llamas: lenguas de fuego del mundo de abajo (rojo y naranja sobre verde oscuro). arriba = puntas hacia arriba.
        const w = paso, h = alto * 0.9, s = arriba ? 1 : -1, base = arriba ? alto : 0;
        const p = (dx: number, dy: number) => `${r1(x0 + dx * w)} ${r1(base - s * dy * h)}`;
        return <g key={i}>
          <path d={`M${p(0, 0)} C ${p(0.1, 0.45)} ${p(0.45, 0.5)} ${p(0.5, 1)} C ${p(0.6, 0.55)} ${p(0.95, 0.4)} ${p(1, 0)} Z`} fill={GN.fuego} stroke={GN.tinta} strokeWidth={1.4} />
          <path d={`M${p(0.28, 0)} C ${p(0.32, 0.3)} ${p(0.46, 0.34)} ${p(0.5, 0.6)} C ${p(0.56, 0.34)} ${p(0.7, 0.28)} ${p(0.72, 0)} Z`} fill={GN.fuegoClaro} />
        </g>;
      })}
    </g>
  );
};

/** Guardas fijas del marco: arriba la tapa de cuero estampado, la trenza copta y el cielo de estrellas; abajo el renglón de tinta y el cuero. */
export const GuardasGnosis: React.FC<{ desplaz: number }> = ({ desplaz }) => (
  <>
    <rect x={0} y={0} width={1920} height={ARRIBA} fill={GN.papiro} />
    <FranjaGnosis y={0} alto={48} desplaz={desplaz} tipo="cuero" />
    <rect x={0} y={48} width={1920} height={4} fill={GN.tinta} />
    <rect x={0} y={52} width={1920} height={3} fill={GN.rojo} />
    <FranjaGnosis y={55} alto={34} desplaz={desplaz * 0.7} tipo="trenza" />
    <rect x={0} y={89} width={1920} height={3} fill={GN.tinta} />
    <FranjaGnosis y={92} alto={26} desplaz={desplaz * 0.4} tipo="estrellas" />
    <rect x={0} y={ARRIBA - 8} width={1920} height={4} fill={GN.oro} />
    <rect x={0} y={ARRIBA - 4} width={1920} height={5} fill={GN.tinta} />
    <rect x={0} y={ABAJO} width={1920} height={130} fill={GN.papiro} />
    <rect x={0} y={ABAJO} width={1920} height={6} fill={GN.tinta} />
    <rect x={0} y={ABAJO + 6} width={1920} height={3} fill={GN.oro} />
    <FranjaGnosis y={ABAJO + 9} alto={30} desplaz={desplaz * 0.8} tipo="puntos" />
    <rect x={0} y={ABAJO + 39} width={1920} height={3} fill={GN.rojo} />
    <FranjaGnosis y={ABAJO + 42} alto={30} desplaz={desplaz * 0.7} tipo="trenza" />
    <rect x={0} y={ABAJO + 72} width={1920} height={4} fill={GN.tinta} />
    <FranjaGnosis y={ABAJO + 76} alto={44} desplaz={desplaz} tipo="cuero" />
    <rect x={0} y={ABAJO + 120} width={1920} height={6} fill={GN.tinta} />
    <rect x={0} y={ABAJO + 126} width={1920} height={200} fill={GN.tinta} />
  </>
);

/** Cabecera de los formatos verticales y portadas (alto ≈ 110): cuero, trenza y estrellas. */
export const CabeceraGnosis: React.FC<{ f: number; ancho?: number; alto?: number }> = ({ f, ancho = 1080, alto = 110 }) => {
  const k = alto / 110;
  return (
    <g>
      <rect width={ancho} height={alto} fill={GN.papiro} />
      <FranjaGnosis y={0} alto={40 * k} desplaz={f} tipo="cuero" ancho={ancho} />
      <rect y={40 * k} width={ancho} height={4 * k} fill={GN.tinta} />
      <FranjaGnosis y={44 * k} alto={32 * k} desplaz={f * 0.7} tipo="trenza" ancho={ancho} />
      <rect y={76 * k} width={ancho} height={3 * k} fill={GN.tinta} />
      <FranjaGnosis y={79 * k} alto={26 * k} desplaz={f * 0.4} tipo="estrellas" ancho={ancho} />
      <rect y={alto - 5 * k} width={ancho} height={5 * k} fill={GN.oro} />
    </g>
  );
};
/** Degradé de fondo de los formatos verticales: índigo del Pleroma que baja al cuero. */
export const DEGRADE_GNOSIS = 'linear-gradient(#1E2352, #1B1410)';
export const DEGRADE_GNOSIS_ARRIBA = 'linear-gradient(#1B1410, #1E2352)';

/** Suelo de Gnosis: tierra parda con la raya de tinta y una línea roja de renglón, piedritas y matas secas. */
export const SueloGnosis: React.FC<{ desde?: number; hasta?: number; color?: string }> = ({ desde: x0 = -400, hasta = 5000, color }) => {
  const n = Math.ceil((hasta - x0) / 110);
  const fondo = color && color !== GN.tinta && color !== '#17110E' ? color : GN.tierra;
  return (
    <g>
      <rect x={x0} y={SUELO} width={hasta - x0} height={220} fill={fondo} />
      <rect x={x0} y={SUELO + 30} width={hasta - x0} height={190} fill={GN.tinta} opacity={0.14} />
      <rect x={x0} y={SUELO} width={hasta - x0} height={5} fill={GN.tinta} />
      <rect x={x0} y={SUELO + 8} width={hasta - x0} height={2} fill={GN.rojo} opacity={0.7} />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * 110 + ((i * 37) % 50);
        return <g key={i}>
          <path d={`M${x} ${SUELO + 30} q 9 -10 20 0 Z`} fill={GN.tierraOsc} stroke={GN.tinta} strokeWidth={1.2} />
          {i % 2 === 0 && <path d={`M${x + 52} ${SUELO + 26} q -3 -10 -8 -14 M${x + 55} ${SUELO + 26} q 1 -12 5 -15`} stroke={GN.papiroOsc} strokeWidth={2} fill="none" strokeLinecap="round" />}
          <circle cx={x + 80} cy={SUELO + 18} r={2} fill={GN.tinta} opacity={0.5} />
        </g>;
      })}
    </g>
  );
};
