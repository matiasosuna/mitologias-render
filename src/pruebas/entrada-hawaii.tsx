import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { PruebaFondo, PruebaElementos, FONDOS_HAWAII } from './hawaii-fondos';

registerRoot(() => (
  <>
    {FONDOS_HAWAII.map((t) => <Composition key={t} id={`h-${t.replace(/_/g, '-')}`} component={PruebaFondo as unknown as React.FC<Record<string, unknown>>} durationInFrames={600} fps={30} width={1920} height={1080} defaultProps={{ tipo: t, cam: 0 }} />)}
    {['oceano', 'costa', 'aldea', 'volcan', 'mauna_kea', 'heiau'].map((t) => <Composition key={t + 'p'} id={`p-${t.replace(/_/g, '-')}`} component={PruebaFondo as unknown as React.FC<Record<string, unknown>>} durationInFrames={600} fps={30} width={1920} height={1080} defaultProps={{ tipo: t, cam: 2200 }} />)}
    {[1, 2, 3].map((n) => <Composition key={n} id={`h-elem${n}`} component={PruebaElementos as unknown as React.FC<Record<string, unknown>>} durationInFrames={600} fps={30} width={1920} height={1080} defaultProps={{ fila: n }} />)}
  </>
));
