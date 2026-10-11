// Catálogo visual de la biblioteca vasija (para revisar personajes y piezas).
import React from 'react';
import { registerRoot, Composition, useCurrentFrame } from 'remotion';
import { Escenario, Capa, Personaje, Monte, Olivo, Suelo, Olas, Nube, Luna, Estrellas, Fuego, Chispas, C } from '../../comun/vasija';

const Catalogo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Escenario dur={300} camara={[[0, 0, 1]]}>
      <Estrellas f={f} />
      <Luna x={1750} y={220} />
      <Capa p={0.3}><Monte x={300} templo /></Capa>
      <Capa p={0.6}><Olivo x={1500} f={f} color={C.barroOscuro} /></Capa>
      <Nube x={1000} y={240} s={0.7} f={f} />
      <Suelo />
      <Personaje x={150} accion="parado" objeto="rayo" tocado="corona" capa={C.purpura} />
      <Personaje x={360} accion="caminar" mujer objeto="lanza" escudo tocado="casco" ropa="larga" />
      <Personaje x={580} accion="parado" objeto="tridente" barba canas />
      <Personaje x={800} accion="correr" alas tocado="petaso" objeto="caduceo" barba={false} />
      <Personaje x={1030} accion="parado" mujer tocado="velo" brazo={[60, 40]} />
      <Personaje x={1250} accion="caminar" ropa="armadura" tocado="casco" objeto="espada" escudo emblema="leon" />
      <Personaje x={1480} accion="parado" ropa="desnudo" gigante boca brazo={[150, 20]} />
      <Personaje x={1720} accion="parado" objeto="lira" tocado="laurel" barba={false} ropa="larga" />
      <g transform="translate(1850 780)"><Fuego f={f} s={0.5} /></g>
      <Chispas x={1850} y={720} f={f} />
    </Escenario>
  );
};
registerRoot(() => <Composition id="catalogo" component={Catalogo} durationInFrames={300} fps={30} width={1920} height={1080} />);
