// Demo de los diseños oficiales hindúes y balineses (elencoHinduOficial.tsx, elencoBalinesOficial.tsx). Solo stills.
// npx remotion still src/pruebas/hinduBalinesOficial.tsx h-oficial out.png --frame=60
// npx remotion still src/pruebas/hinduBalinesOficial.tsx b-oficial out.png --frame=60
// npx remotion still src/pruebas/hinduBalinesOficial.tsx hb-grilla out.png --frame=60 --props='{"serie":"hindues","fondo":"palacio_pahari","claves":["vishnu"],"cols":1}'
import React from 'react';
import { Composition, registerRoot, AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C, TITULO } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import { NOMBRE_EN } from '../motor/elenco';
import type { Escena } from '../motor/tipos';

const tl = { id: 'x', from: 0, durationInFrames: 400, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 400 }] };
const Motor: React.FC<{ esc: Escena }> = ({ esc }) => <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
const solo = (como: string, fondo: string, escala = 1): Escena => ({
  id: 's' + como, fondo, camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
  actores: [{ id: como, x: 960, rotulo: '', escala }],
} as Escena);

type Grilla = { serie: string; fondo: string; claves: string[]; cols: number; k?: number; zoom?: number; y0?: number; dx?: Record<string, number> };
/** Cuadrícula de personajes de cuerpo entero, cada uno en su escena, con el nombre debajo. */
const Cuadricula: React.FC<Grilla> = ({ serie, fondo, claves, cols, k: k0, zoom = 1, y0, dx = {} }) => {
  aplicarTema(serie);
  const filas = Math.ceil(claves.length / cols), W = 1920 / cols, H = 1080 / filas, ET = 46;
  const k = (k0 ?? Math.min(0.78, (H - ET) / 640)) * zoom;
  const yMundo = y0 ?? 790 + 22 - (H - ET) / k;
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {claves.map((c, i) => {
        const left = (i % cols) * W, top = Math.floor(i / cols) * H;
        return (
          <div key={c + i} style={{ position: 'absolute', left: left + 2, top: top + 2, width: W - 4, height: H - 4, overflow: 'hidden', background: C.negro }}>
            <div style={{ position: 'absolute', left: (W - 4) / 2 - (960 + (dx[c] ?? 0)) * k, top: -yMundo * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
              <Motor esc={solo(c, fondo)} />
            </div>
            <div style={{ position: 'absolute', bottom: 0, height: ET, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.negro, fontFamily: TITULO, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: C.crema }}>{(NOMBRE_EN[c] ?? c).replace(/_/g, ' ')}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const HINDUES_OFICIALES = ['vishnu', 'shiva', 'brahma', 'parvati', 'ganesha', 'lakshmi', 'saraswati', 'durga', 'kali', 'indra', 'garuda', 'narasimha'].map((c) => c + '_oficial');
export const BALINESES_OFICIALES = ['barong', 'rangda', 'calon_arang', 'dewi_sri', 'dewi_danu', 'mayadenawa', 'kebo_iwa', 'ratu_gede_mecaling'].map((c) => c + '_oficial');

const comp = (id: string, g: Grilla) => <Composition key={id} id={id} component={Cuadricula as unknown as React.FC<Record<string, unknown>>} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={g} />;

registerRoot(() => (
  <>
    {comp('h-oficial', { serie: 'hindues', fondo: 'palacio_pahari', claves: HINDUES_OFICIALES, cols: 6, dx: { durga_oficial: -36 } })}
    {comp('b-oficial', { serie: 'balinesas', fondo: 'pura', claves: BALINESES_OFICIALES, cols: 4 })}
    {comp('h-hoy', { serie: 'hindues', fondo: 'palacio_pahari', claves: ['vishnu', 'shiva', 'brahma', 'parvati', 'ganesha', 'lakshmi', 'narada', 'mohini', 'virabhadra', 'indra', 'garuda', 'narasimha'], cols: 6 })}
    {comp('b-hoy', { serie: 'balinesas', fondo: 'pura', claves: ['barong', 'rangda', 'calon_arang', 'ratna_manggali', 'dewi_danu', 'mayadenawa', 'kebo_iwa', 'ratu_gede_mecaling'], cols: 4 })}
    {comp('hb-grilla', { serie: 'hindues', fondo: 'palacio_pahari', claves: ['vishnu'], cols: 1 })}
  </>
));
