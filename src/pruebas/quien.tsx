// Demo del Short "Who is…?" (campo `quien` de ShortNativo, BRIEF-QUIEN.md) con un guion de muestra. Solo stills, nunca video.
// npx remotion still src/pruebas/quien.tsx q-muestra out.png --frame=20    (apertura)
// npx remotion still src/pruebas/quien.tsx q-muestra out.png --frame=120   (historia)
import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { ShortNativo } from '../motor/ShortNativo';
import type { GuionVisual, Timeline } from '../motor/tipos';

const guion = {
  id: 'short-griegas-quien-zeus', formato: 'short', serie: 'griegas', numero: 'S', tituloGriego: '',
  titulo: { es: '¿Quién es Zeus?', en: 'Who is Zeus?' },
  gancho: { es: 'El bebé que engañó a un titán', en: 'The baby who tricked a Titan' },
  cierre: { es: 'Y Cronos todavía tenía a sus hijos adentro — Mitología griega T1E1', en: 'And Cronus still had his children inside — Greek Mythology S1E1' },
  episodio: 'griegas-01-origen',
  quien: { nombre: { es: 'Zeus', en: 'Zeus' }, subtitulo: { es: 'Rey de los dioses · señor del rayo', en: 'King of the gods · lord of thunder' }, como: 'zeus_oficial' },
  escenas: [{
    id: 'piedra', fondo: 'monte', foco: 960,
    frases: [
      { es: 'Cronos se tragaba a cada hijo apenas nacía.', en: 'Cronus swallowed every child the moment it was born.' },
      { es: 'Rea le dio una piedra envuelta en pañales.', en: 'Rhea handed him a stone wrapped in a blanket.' },
    ],
    actores: [
      { id: 'cronos', como: 'cronos_oficial', x: 730, escala: 1.15, mira: 'der', rotulo: '' },
      { id: 'zeus', como: 'zeus_oficial', x: 1190, escala: 1.15, mira: 'izq', rotulo: '' },
    ],
  }],
} as unknown as GuionVisual;

const timeline: Timeline = {
  fps: 24, introFrames: 48, outroFrames: 60, total: 48 + 200 + 60,
  escenas: [{ id: 'piedra', from: 48, durationInFrames: 200, frases: [
    { texto: guion.escenas[0].frases[0], audio: {}, from: 7, dur: 80 },
    { texto: guion.escenas[0].frases[1], audio: {}, from: 97, dur: 80 },
  ] }],
} as unknown as Timeline;

registerRoot(() => (
  <Composition id="q-muestra" component={ShortNativo as unknown as React.FC<Record<string, unknown>>} durationInFrames={timeline.total} fps={24} width={1080} height={1920} defaultProps={{ guion, timeline, idioma: 'en' }} />
));
