// Prueba visual de los fondos y elementos hawaianos (tema kapa). Solo para mirar stills.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Escenario, Capa, SUELO, aplicarTema } from '../comun/vasija';
import { Fondo, ElementoSVG, CIELO } from '../motor/fondos';

aplicarTema('hawaianas');

export const FONDOS_HAWAII = ['po', 'fondo_marino', 'oceano', 'costa', 'playa_negra', 'aldea', 'loi', 'valle', 'bosque', 'volcan', 'haleakala', 'mauna_kea', 'noche', 'cielo_navegante', 'heiau'];

export const PruebaFondo: React.FC<{ tipo: string; cam?: number }> = ({ tipo, cam = 0 }) => {
  const f = useCurrentFrame();
  return (
    <Escenario dur={600} cielo={CIELO[tipo] ?? 'barro'} camara={[[0, cam, 1]]}>
      <Fondo tipo={tipo} f={f} />
    </Escenario>
  );
};

const ELEM: [string, number, number, Record<string, unknown>?][] = [
  ['niu', 120, 0.8], ['hale', 300, 0.7], ['kii', 700, 1], ['kalo', 880, 1], ['ipu', 1040, 0.9], ['lehua', 1260, 0.8], ['kahili', 1480, 0.8], ['petroglifo', 1700, 0.8, { figura: 'canoa' }],
];
const ELEM2: [string, number, number, Record<string, unknown>?][] = [
  ['waa', 360, 0.9], ['lago_lava', 1000, 0.8], ['fuente_lava', 1000, 1], ['petroglifo', 1500, 0.7, { figura: 'persona' }], ['petroglifo', 1780, 0.6, { figura: 'espiral' }],
];
export const PruebaElementos: React.FC<{ fila: number }> = ({ fila }) => {
  const f = useCurrentFrame();
  const lista = fila === 1 ? ELEM : fila === 2 ? ELEM2 : ([['heiau', 700, 1], ['templo', 1500, 0.5], ['barco', 1500, 0.4]] as [string, number, number, Record<string, unknown>?][]);
  return (
    <Escenario dur={600} cielo="barro" camara={[[0, 0, 1]]}>
      <Fondo tipo="campo" f={f} />
      <Capa p={1}>{lista.map(([t, x, s, p], i) => <ElementoSVG key={i} tipo={t} x={x} y={t === 'waa' || t === 'barco' ? SUELO - 30 : SUELO} s={s} f={f} props={p} />)}</Capa>
    </Escenario>
  );
};
