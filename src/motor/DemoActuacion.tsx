// Demo muda: actuación de los muñequitos con el motor real (caras, cabeza, gestos al hablar, anticipación, siluetas, apariciones).
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { aplicarTema, C, TITULO, CalidadHD } from '../comun/vasija';
import { EscenaMotor } from './Escena';
import type { Escena, EscenaTL } from './tipos';

const N = 6, PASO = 50;
const tl: EscenaTL = { id: 'demo', from: 0, durationInFrames: N * PASO + 20, frases: Array.from({ length: N }, (_, i) => ({ from: 10 + i * PASO, dur: PASO - 6, audio: {}, texto: { es: '' } })) };
const esc: Escena = {
  id: 'demo', frases: [], fondo: 'olimpo', sinAstros: true, camara: { zoom: [1, 1] },
  actores: [
    { id: 'gordo', como: 'hombre', x: 230, props: { cuerpo: 'gordo', objeto: 'lanza' }, rotulo: '', pasos: [{ en: 2, hace: 'alegra' }, { en: 4.1, hace: 'lanza' }] },
    { id: 'zeus', x: 560, rotulo: '', pasos: [{ en: 0, hace: 'aparece', con: 'luz' }, { en: 1, hace: 'habla', dur: 1.8 }, { en: 1.3, hace: 'enoja' }, { en: 3.1, hace: 'golpea' }, { en: 4.2, hace: 'alegra' }] },
    { id: 'hermes', x: 1060, mira: 'izq', rotulo: '', pasos: [{ en: 0.4, hace: 'aparece', con: 'polvo' }, { en: 2.2, hace: 'sorprende' }, { en: 2.5, hace: 'niega' }, { en: 3.6, hace: 'habla', dur: 0.9 }, { en: 5.1, hace: 'desaparece', con: 'humo' }] },
    { id: 'viejo', como: 'hombre', x: 1420, mira: 'izq', props: { cuerpo: 'viejo' }, rotulo: '', pasos: [{ en: 1.5, hace: 'asiente' }, { en: 4.3, hace: 'entristece' }] },
    { id: 'nino', como: 'hombre', x: 1660, mira: 'izq', props: { cuerpo: 'nino', barba: false }, rotulo: '', pasos: [{ en: 3.2, hace: 'alegra' }, { en: 3.3, hace: 'salta' }, { en: 4.4, hace: 'salta' }] },
  ],
};
const CARTELES = ['Aparecen: Zeus con luz, Hermes con polvo', 'Zeus habla con las manos y se enoja; el viejo asiente', 'Hermes se sorprende y dice que no', 'Golpe con anticipación · el niño salta', 'Lanza con impulso · alegría y tristeza', 'Hermes desaparece en humo'];

export const DemoActuacion: React.FC = () => {
  const f = useCurrentFrame();
  aplicarTema('griegas');
  const i = Math.min(N - 1, Math.max(0, Math.floor((f - 10) / PASO)));
  const o = interpolate((f - 10) % PASO, [0, 8, PASO - 8, PASO], [0, 1, 1, 0.3]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} idioma="en" /></CalidadHD.Provider>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <text x={960} y={1000} textAnchor="middle" fontFamily={TITULO} fontWeight={700} fontSize={40} fill={C.crema} opacity={o}>{CARTELES[i]}</text>
      </svg>
    </AbsoluteFill>
  );
};
