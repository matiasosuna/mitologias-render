// Muestra: portadas de IG y miniaturas con animales/criaturas (antes salían como muñeco genérico). Solo stills.
import React from 'react';
import { Composition, registerRoot, AbsoluteFill } from 'remotion';
import { PortadaIG } from '../comun/portadaIG';
import { Miniatura } from '../comun/miniatura';

const P = [
  { titulo: 'DIONYSUS AND THE PIRATES', numero: '17', temporada: 'SEASON 2 · THE OLYMPIANS', heroe: 'dioniso_oficial', rival: 'delfin_griego_oficial', serie: 'griegas' },
  { titulo: 'THE REALM OF HADES', numero: '★', temporada: 'LORDS OF THE DEAD', heroe: 'hades_oficial', rival: 'cerbero_oficial', serie: 'griegas' },
  { titulo: 'THE DOOMED PRINCE', numero: '19', temporada: 'SEASON 2', heroe: 'aldeano_egipcio_b_oficial', rival: 'cocodrilo_egipcio_oficial', serie: 'egipcias' },
  { titulo: 'SIGURD AND FAFNIR', numero: '16', temporada: 'SEASON 2', heroe: 'odin_oficial', rival: 'dragon', serie: 'nordicas' },
  { titulo: 'COYOTE AND THE STARS', numero: '11', temporada: 'SEASON 1', heroe: 'coyote_oficial', rival: 'oso_norte_oficial', serie: 'norteamericanas' },
];
const Hoja: React.FC = () => (
  <AbsoluteFill style={{ background: '#222', flexDirection: 'row', flexWrap: 'wrap', gap: 24, padding: 24 }}>
    {P.map((p) => <div key={p.titulo} style={{ position: 'relative', width: 1080, height: 1350, flexShrink: 0 }}><PortadaIG {...p} /></div>)}
    <div style={{ position: 'relative', width: 1280, height: 720, flexShrink: 0 }}><Miniatura titulo={P[0].titulo} numero="17" heroe={P[0].heroe} rival={P[0].rival} serie="griegas" /></div>
  </AbsoluteFill>
);
registerRoot(() => <Composition id="portadas-animales" component={Hoja} durationInFrames={1} fps={24} width={3336} height={2822} />);
