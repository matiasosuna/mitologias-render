// Escenas REALES de los guiones griegos con los animales épicos en lugar de los viejos (mismo guion, solo cambia
// `como`), en horizontal y vertical, para ver el encuadre automático (encuadreHorizontal.ts). Solo stills.
// En la nube: gh workflow run laminas -R matiasosuna/mitologias-render -f ids='escenasEpicas.tsx:epica-1-h,escenasEpicas.tsx:epica-1-v,…'
import React from 'react';
import { AbsoluteFill, Composition, Sequence, registerRoot } from 'remotion';
import { aplicarTema, CalidadHD, C, ModoVertical } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import { EscenaVerticalNativa } from '../motor/EscenaVertical';
import { conEpicos } from '../motor/revisarEncuadre';
import type { Escena, EscenaTL } from '../motor/tipos';
import g07 from '../videos/griegas-07-tifon/guion.json';
import t07 from '../videos/griegas-07-tifon/timeline.json';
import g14 from '../videos/griegas-14-apolo-piton/guion.json';
import t14 from '../videos/griegas-14-apolo-piton/timeline.json';
import g99 from '../videos/griegas-99-reino-de-hades/guion.json';
import t99 from '../videos/griegas-99-reino-de-hades/timeline.json';
import g15 from '../videos/griegas-15-hermes-bebe-ladron/guion.json';
import t15 from '../videos/griegas-15-hermes-bebe-ladron/timeline.json';
import g17 from '../videos/griegas-17-dioniso-piratas/guion.json';
import t17 from '../videos/griegas-17-dioniso-piratas/timeline.json';
import g02 from '../videos/griegas-02-prometeo/guion.json';
import t02 from '../videos/griegas-02-prometeo/timeline.json';

type G = { escenas: Escena[] }; type T = { escenas: EscenaTL[] };
/** [guion, timeline, escena, fracción de la escena a mostrar] */
const CASOS: [G, T, string, number][] = [
  [g07 as unknown as G, t07 as unknown as T, 'rescate', 0.6],
  [g14 as unknown as G, t14 as unknown as T, 'monstruo', 0.6],
  [g99 as unknown as G, t99 as unknown as T, 'cerbero', 0.5],
  [g15 as unknown as G, t15 as unknown as T, 'robo', 0.5],
  [g17 as unknown as G, t17 as unknown as T, 'salvado', 0.6],
  [g02 as unknown as G, t02 as unknown as T, 'dones', 0.6],
];
const caso = (n: number) => {
  const [g, t, id, fr] = CASOS[n - 1];
  const i = g.escenas.findIndex((e) => e.id === id), tl = t.escenas.find((e) => e.id === id) ?? t.escenas[i];
  return { esc: conEpicos(g.escenas[i]), tl, f: Math.round(tl.durationInFrames * fr) };
};
const MARCA = 60; // laminas renderiza el cuadro 60

const Horizontal: React.FC<{ n: number }> = ({ n }) => {
  aplicarTema('griegas');
  const { esc, tl, f } = caso(n);
  return <AbsoluteFill style={{ backgroundColor: C.negro }}><Sequence from={MARCA - f}><CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider></Sequence></AbsoluteFill>;
};
const Vertical: React.FC<{ n: number }> = ({ n }) => {
  aplicarTema('griegas');
  const { esc, tl, f } = caso(n);
  return <AbsoluteFill style={{ backgroundColor: C.negro }}><Sequence from={MARCA - f}><CalidadHD.Provider value={true}><ModoVertical.Provider value={true}><EscenaVerticalNativa esc={esc} tl={tl} /></ModoVertical.Provider></CalidadHD.Provider></Sequence></AbsoluteFill>;
};

registerRoot(() => (
  <>
    {CASOS.map((_, i) => <Composition key={`h${i}`} id={`epica-${i + 1}-h`} component={Horizontal} durationInFrames={120} fps={24} width={1920} height={1080} defaultProps={{ n: i + 1 }} />)}
    {CASOS.map((_, i) => <Composition key={`v${i}`} id={`epica-${i + 1}-v`} component={Vertical} durationInFrames={120} fps={24} width={1080} height={1920} defaultProps={{ n: i + 1 }} />)}
  </>
));
