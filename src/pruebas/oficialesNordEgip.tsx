// Galería de los diseños oficiales nórdicos y egipcios (elencoNordico.tsx, elencoEgipcioOficial.tsx). Solo stills.
// npx remotion still src/pruebas/oficialesNordEgip.tsx o-nordicas out.png --frame=60
// npx remotion still src/pruebas/oficialesNordEgip.tsx o-egipcias out.png --frame=60
// npx remotion still src/pruebas/oficialesNordEgip.tsx o-cerca out.png --frame=60 --props='{"serie":"egipcias","claves":["ra_oficial"]}'
import React from 'react';
import { AbsoluteFill, Composition, registerRoot } from 'remotion';
import { aplicarTema, CalidadHD, C, TITULO } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import { NOMBRE_EN } from '../motor/elenco';
import type { Escena } from '../motor/tipos';

const tl = { id: 'x', from: 0, durationInFrames: 400, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 400 }] };
const solo = (como: string, fondo: string, x = 960): Escena => ({
  id: 's' + como, fondo, camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
  actores: [{ id: como, x, rotulo: '' }],
} as Escena);

/** Corrimiento horizontal para que entren los que se abren hacia adelante (alas de Isis). */
const CORRER: Record<string, number> = { isis_oficial: -60 };
/** Celda: un personaje solo en el fondo de la serie, recortado alrededor de él, con el nombre abajo. */
const Celda: React.FC<{ como: string; left: number; top: number; w: number; h: number; k: number; fondo: string }> = ({ como, left, top, w, h, k, fondo }) => (
  <div style={{ position: 'absolute', left, top, width: w, height: h, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: w / 2 - 960 * k, top: -(790 + 56 - h / k) * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
      <CalidadHD.Provider value={true}><EscenaMotor esc={solo(como, fondo, 960 + (CORRER[como] ?? 0))} tl={tl} /></CalidadHD.Provider>
    </div>
    <div style={{ position: 'absolute', bottom: 10, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: C.crema, textShadow: `0 2px 0 ${C.negro}, 0 0 8px ${C.negro}, 0 0 3px ${C.negro}` }}>{NOMBRE_EN[como] ?? como}</div>
  </div>
);

const NORDICAS = ['thor', 'odin', 'loki', 'freya', 'frigg', 'tyr', 'baldr', 'heimdall', 'hel', 'sif', 'freyr', 'njord'].map((c) => c + '_oficial');
const EGIPCIAS = ['ra', 'isis', 'osiris', 'set', 'horus', 'anubis', 'thoth', 'hathor', 'sekhmet', 'nut', 'geb', 'bastet', 'ptah'].map((c) => c + '_oficial');

const Galeria: React.FC<{ serie: string; claves: string[]; fondo: string; k?: number }> = ({ serie, claves, fondo, k }) => {
  aplicarTema(serie);
  const filas = claves.length > 7 ? 2 : 1, porFila = Math.ceil(claves.length / filas);
  const W = 1920 / porFila, H = 1080 / filas, kk = k ?? (filas === 2 ? 0.88 : 1.6);
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {claves.map((c, i) => {
        const r = Math.floor(i / porFila), j = i % porFila, n = r === filas - 1 ? claves.length - r * porFila : porFila;
        const x0 = (1920 - n * W) / 2;
        return <Celda key={c} como={c} left={x0 + j * W + 2} top={r * H + 2} w={W - 4} h={H - 4} k={kk} fondo={fondo} />;
      })}
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <>
    <Composition id="o-nordicas" component={Galeria} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ serie: 'nordicas', claves: NORDICAS, fondo: 'nieve' }} />
    <Composition id="o-egipcias" component={Galeria} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ serie: 'egipcias', claves: EGIPCIAS, fondo: 'nilo' }} />
    <Composition id="o-cerca" component={Galeria} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ serie: 'nordicas', claves: ['thor_oficial'], fondo: 'nieve' }} />
  </>
));
