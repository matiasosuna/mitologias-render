// Hojas de los animales épicos griegos (bestiasEpicas.tsx). Solo stills, nunca video.
// En la nube: gh workflow run laminas -R matiasosuna/mitologias-render -f ids='animalesEpicos.tsx:animales-griegos-epicos-1,…,animalesEpicos.tsx:animales-griegos-escala'
import React from 'react';
import { AbsoluteFill, Composition, registerRoot } from 'remotion';
import { aplicarTema, CalidadHD, C, TITULO } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import type { Escena } from '../motor/tipos';

const tl = { id: 'x', from: 0, durationInFrames: 400, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 400 }] };
type Item = { k: string; n: string; y?: number; e?: number; dx?: number; rotulo?: boolean; props?: Record<string, unknown> };
const it = (k: string, n: string, o: Partial<Item> = {}): Item => ({ k, n, ...o });

/** Hojas: cada una con su grilla (cols × filas) y el zoom de cámara que entra al más alto. */
export const HOJAS: { cols: number; z: number; items: Item[] }[] = [
  { cols: 3, z: 0.62, items: [it('caballo_griego_oficial', 'HORSE'), it('toro_griego_oficial', 'BULL'), it('buey_griego_oficial', 'OX'),
    it('mula_griega_oficial', 'MULE'), it('vaca_griega_oficial', 'COW'), it('ciervo_griego_oficial', 'DEER')] },
  { cols: 4, z: 0.72, items: [it('leon_griego_oficial', 'LION'), it('oso_griego_oficial', 'BEAR'), it('lobo_griego_oficial', 'WOLF'), it('perro_griego_oficial', 'DOG'),
    it('carnero_griego_oficial', 'RAM'), it('oveja_griega_oficial', 'SHEEP'), it('cabra_griega_oficial', 'GOAT'), it('tortuga_griega_oficial', 'TORTOISE')] },
  { cols: 3, z: 0.62, items: [it('aguila_griega_oficial', 'EAGLE'), it('cisne_griego_oficial', 'SWAN'), it('paloma_griega_oficial', 'DOVE'),
    it('pavo_real_griego_oficial', 'PEACOCK'), it('buho_griego_oficial', 'OWL'), it('delfin_griego_oficial', 'DOLPHIN')] },
  { cols: 3, z: 0.62, items: [it('pegaso_oficial', 'PEGASUS', { rotulo: true }), it('cerbero_oficial', 'CERBERUS', { rotulo: true }), it('piton_oficial', 'PYTHON', { rotulo: true }),
    it('licaon_lobo_oficial', 'LYCAON (WOLF)', { rotulo: true }), it('serpiente_griega_oficial', 'SNAKE'), it('delfine_oficial', 'DELPHYNE', { rotulo: true })] },
];

const Motor: React.FC<{ esc: Escena }> = ({ esc }) => <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
const solo = (i: Item, z: number): Escena => ({
  id: 's' + i.k, fondo: 'campo', camara: { de: 0, a: 0, zoom: [z, z] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
  actores: [{ id: i.k, x: 960 + (i.dx ?? 0), ...(i.rotulo ? {} : { rotulo: '' }), ...(i.y !== undefined ? { y: i.y } : {}), ...(i.e !== undefined ? { escala: i.e } : {}), ...(i.props ? { props: i.props } : {}) }],
} as Escena);

/** Celda: el cuadro 1920×1080 entero (con la cámara alejada) recortado a la franja entre guardas, con el nombre abajo. */
const Celda: React.FC<{ i: Item; left: number; top: number; w: number; h: number; z: number }> = ({ i, left, top, w, h, z }) => {
  const y0 = 120, y1 = 846, k = h / (y1 - y0);
  return (
    <div style={{ position: 'absolute', left, top, width: w, height: h, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: w / 2 - 960 * k, top: -y0 * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <Motor esc={solo(i, z)} />
      </div>
      <div style={{ position: 'absolute', bottom: 6, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: C.crema, textShadow: `0 2px 0 ${C.negro}, 0 0 8px ${C.negro}` }}>{i.n}</div>
    </div>
  );
};

const Hoja: React.FC<{ n: number }> = ({ n }) => {
  aplicarTema('griegas');
  const hoja = HOJAS[n - 1] ?? HOJAS[0], cols = hoja.cols, filas = Math.ceil(hoja.items.length / cols), W = 1920 / cols, H = 1080 / filas;
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {hoja.items.map((i, j) => <Celda key={i.k + j} i={i} left={(j % cols) * W + 2} top={Math.floor(j / cols) * H + 2} w={W - 4} h={H - 4} z={hoja.z} />)}
    </AbsoluteFill>
  );
};

/** Uno solo, grande (para hacer zoom y revisar detalles). */
const Uno: React.FC<{ k: string; z?: number; props?: Record<string, unknown> }> = ({ k, z = 0.8, props }) => {
  aplicarTema('griegas');
  return <AbsoluteFill style={{ backgroundColor: C.negro }}><Motor esc={solo({ k, n: '', props }, z)} /></AbsoluteFill>;
};

/** Escala: dos personas junto al caballo, el toro y el águila. */
const Escala: React.FC = () => {
  aplicarTema('griegas');
  const esc = {
    id: 'escala', fondo: 'campo', camara: { de: 0, a: 0, zoom: [0.78, 0.78] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
    actores: [
      { id: 'caballo_griego_oficial', x: 330, props: { pose: 'paso' }, rotulo: '' },
      { id: 'hombre_griego_oficial', x: 640, mira: 'izq', rotulo: '' },
      { id: 'aguila_griega_oficial', x: 980, y: 330, rotulo: '' },
      { id: 'mujer_griega_oficial', x: 1150, rotulo: '' },
      { id: 'toro_griego_oficial', x: 1560, mira: 'izq', rotulo: '' },
    ],
  } as unknown as Escena;
  return <AbsoluteFill style={{ backgroundColor: C.negro }}><Motor esc={esc} /></AbsoluteFill>;
};

registerRoot(() => (
  <>
    {HOJAS.map((_, i) => <Composition key={i} id={`animales-griegos-epicos-${i + 1}`} component={Hoja} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ n: i + 1 }} />)}
    <Composition id="ae-uno" component={Uno} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ k: 'caballo_griego_oficial', z: 0.8 }} />
    <Composition id="animales-griegos-escala" component={Escala} durationInFrames={400} fps={24} width={1920} height={1080} />
  </>
));
