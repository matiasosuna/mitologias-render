// Piel "natural" (serie `biblia`, canal Learn Bible 777): colores suaves y casi reales — cielos de verdad, desierto,
// colinas de Oriente Medio, olivos —, sin vitral ni guardas pesadas. El marco es una franja de lino lisa con un filete
// fino arriba y abajo; el suelo, tierra arenosa con matas de pasto.
// No importa nada de vasija.tsx (vasija lo importa a él): colores literales y medidas del marco copiadas.
import React from 'react';

/** Paleta natural: arena, lino, olivo, tierra, cielo y mar. */
export const NT = {
  lino: '#F1E9DA', lino2: '#E4D8C2', arena: '#E2CFA4', arenaOsc: '#C8AE7C', tierra: '#A9845A', tierraOsc: '#7A5C3E',
  olivo: '#7E8C55', olivoOsc: '#56643A', olivoPlata: '#A7B08A', pasto: '#8FA25A', pastoOsc: '#64783C', verde: '#5E8A4A',
  piedra: '#C7B79C', piedraOsc: '#9C8A70', cielo: '#9FC4E0', cieloClaro: '#DCEAF2', mar: '#4F86A8', marOsc: '#2E5E7E',
  noche: '#1A2238', oro: '#E3B85C', luz: '#FFF6DC', tinta: '#2A2420', filete: '#B39A70', blanco: '#FFFBF2',
};
const ARRIBA = 126, SUELO = 790, ABAJO = SUELO + 40; // iguales a vasija.tsx

/** Guardas del tema natural: lino liso con un filete fino (casi invisibles) y la franja oscura de subtítulos. */
export const GuardasNatural: React.FC<{ desplaz: number }> = () => (
  <>
    <defs>
      <linearGradient id="ntLinoArriba" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E9DFCC" /><stop offset="100%" stopColor={NT.lino} /></linearGradient>
      <linearGradient id="ntLinoAbajo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={NT.lino} /><stop offset="100%" stopColor="#E3D7C1" /></linearGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={ARRIBA} fill="url(#ntLinoArriba)" />
    <rect x={0} y={ARRIBA - 4} width={1920} height={1.5} fill={NT.filete} />
    <rect x={0} y={ARRIBA - 1.5} width={1920} height={1.5} fill={NT.lino} />
    <rect x={0} y={ABAJO} width={1920} height={126} fill="url(#ntLinoAbajo)" />
    <rect x={0} y={ABAJO} width={1920} height={1.5} fill={NT.lino} />
    <rect x={0} y={ABAJO + 1.5} width={1920} height={1.5} fill={NT.filete} />
    <rect x={0} y={ABAJO + 126} width={1920} height={200} fill={NT.tinta} />
  </>
);

/** Suelo natural: tierra arenosa con borde suave, piedritas y matas de pasto. */
export const SueloNatural: React.FC<{ desde?: number; hasta?: number; color?: string }> = ({ desde: x0 = -400, hasta = 5000, color }) => {
  const c = color && !['#17110E', '#1E1410', '#2A2420'].includes(color) ? color : NT.arena;
  const n = Math.ceil((hasta - x0) / 140);
  return (
    <g>
      <rect x={x0} y={SUELO} width={hasta - x0} height={240} fill={c} />
      <rect x={x0} y={SUELO} width={hasta - x0} height={3} fill={NT.tierraOsc} opacity={0.35} />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * 140;
        return <g key={i}>
          {[0, 1, 2, 3].map((k) => <path key={k} d={`M${x + 30 + k * 6} ${SUELO + 4} q ${-6 + k * 4} -12 ${-3 + k * 5} -20`} stroke={i % 2 ? NT.pastoOsc : NT.pasto} strokeWidth={2.4} fill="none" strokeLinecap="round" />)}
          <ellipse cx={x + 100} cy={SUELO + 14} rx={7} ry={3.5} fill={NT.piedraOsc} opacity={0.6} />
        </g>;
      })}
    </g>
  );
};

/** Franja fina para miniatura, portada de Instagram y verticales: lino con un filete. */
export const FranjaNatural: React.FC<{ y: number; alto: number; ancho?: number }> = ({ y, alto, ancho = 1920 }) => (
  <g>
    <rect x={0} y={y} width={ancho} height={alto} fill={NT.lino} />
    <rect x={0} y={y + alto - 3} width={ancho} height={1.5} fill={NT.filete} />
  </g>
);
/** Cabecera de los verticales (Short, Reel): 1080×110 de lino con filete. */
export const CabeceraNatural: React.FC<{ f: number }> = () => (
  <>
    <rect width={1080} height={110} fill={NT.lino} />
    <rect y={104} width={1080} height={2} fill={NT.filete} />
  </>
);
/** Fondo de los marcos de los verticales (cielo del atardecer → tierra oscura). */
export const DEGRADE_NATURAL = 'linear-gradient(#5A4A3A, #2A2420)';
export const DEGRADE_NATURAL_ARRIBA = 'linear-gradient(#2A2420, #5A4A3A)';
