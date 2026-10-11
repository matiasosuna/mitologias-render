// Demo muda de 5 s: personajes actuales (izquierda) vs. calidad mejorada (derecha), en los tres estilos.
import React from 'react';
import { Sequence, AbsoluteFill } from 'remotion';
import { Escenario, Personaje, Suelo, aplicarTema, C, TITULO, PersonajeProps } from '../comun/vasija';
import { ELENCO } from './elenco';

const TRAMOS: { serie: string; a: string; b: string }[] = [
  { serie: 'griegas', a: 'zeus', b: 'atenea' },
  { serie: 'nordicas', a: 'odin', b: 'thor' },
  { serie: 'egipcias', a: 'isis', b: 'horus' },
];
const props = (k: string) => { const fi = ELENCO[k]; return (fi && fi.tipo === 'persona' ? fi.p : {}) as Partial<PersonajeProps>; };

const Tramo: React.FC<{ serie: string; a: string; b: string }> = ({ serie, a, b }) => {
  aplicarTema(serie);
  const par = (x0: number, hd: boolean) => (
    <>
      <Personaje {...props(a)} x={x0 + 250} s={1.12} hd={hd} />
      <Personaje {...props(b)} x={x0 + 650} s={1.12} accion="caminar" hd={hd} />
    </>
  );
  return (
    <AbsoluteFill>
      <Escenario dur={9999}>
        <Suelo />
        {par(0, false)}
        {par(960, true)}
      </Escenario>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <rect x={957} y={126} width={6} height={704} fill={C.negro} opacity={0.7} />
        {[['AHORA', 480], ['MEJORADO', 1440]].map(([t, x]) => (
          <text key={t} x={x} y={190} textAnchor="middle" fontFamily={TITULO} fontWeight={700} fontSize={46} fill={C.crema} stroke={C.negro} strokeWidth={6} paintOrder="stroke" letterSpacing={6}>{t}</text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const DemoCalidad: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    {TRAMOS.map((t, i) => (
      <Sequence key={t.serie} from={i * 50} durationInFrames={50}><Tramo {...t} /></Sequence>
    ))}
  </AbsoluteFill>
);
