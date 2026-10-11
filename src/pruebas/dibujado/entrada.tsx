import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { Dibujado } from './Dibujado';
import tl from './timeline.json';

registerRoot(() => <Composition id="prueba-dibujado" component={Dibujado} durationInFrames={tl.total} fps={30} width={1920} height={1080} />);
