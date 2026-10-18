// Muestra de las portadas de Instagram de un episodio en partes (PART n OF m). Solo stills.
// npx remotion still src/pruebas/partesIG.tsx partes-ig out.png --frame=0
import React from 'react';
import { Composition, registerRoot, AbsoluteFill } from 'remotion';
import { PortadaIG } from '../comun/portadaIG';

const base = { titulo: 'THE TWELVE OLYMPIANS', numero: '8', temporada: 'SEASON 2 · THE OLYMPIANS', heroe: 'zeus_oficial', rival: 'hera_oficial', serie: 'griegas' };
const Hoja: React.FC = () => (
  <AbsoluteFill style={{ background: '#222', flexDirection: 'row', gap: 24, padding: 24 }}>
    {[1, 2, 3].map((n) => (
      <div key={n} style={{ position: 'relative', width: 1080, height: 1350, flexShrink: 0 }}><PortadaIG {...base} parte={n} de={3} /></div>
    ))}
  </AbsoluteFill>
);
registerRoot(() => <Composition id="partes-ig" component={Hoja} durationInFrames={1} fps={24} width={3336} height={1398} />);
