// Prueba de manos (2026-10-13): personajes HD de cerca con brazos en varias poses.
import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { Escenario, Personaje, Suelo, CalidadHD, C } from '../comun/vasija';

const Manos: React.FC = () => (
  <CalidadHD.Provider value>
    <Escenario dur={60} camara={[[0, 0, 1]]}>
      <Suelo />
      <g transform="translate(-600 -900) scale(2)">
        <Personaje x={420} accion="parado" brazo={[20, 30]} />
        <Personaje x={600} accion="parado" mujer brazo={[90, 0]} />
        <Personaje x={780} accion="parado" brazo={[150, 20]} piel={C.negro} />
        <Personaje x={960} accion="caminar" mujer ropa="larga" />
      </g>
    </Escenario>
  </CalidadHD.Provider>
);

registerRoot(() => <Composition id="manos" component={Manos} durationInFrames={60} fps={30} width={1920} height={1080} />);
