// Hojas de aprobación de los secundarios hawaianos oficiales (elencoHawaianoOficial.tsx). Solo stills.
// npx remotion still src/pruebas/hawaianasSecundarios.tsx hs-hoja out.png --frame=60 --props='{"claves":["lohiau_oficial"]}'
// npx remotion still src/pruebas/hawaianasSecundarios.tsx hs-uno out.png --frame=60 --props='{"clave":"lohiau_oficial"}'
import React from 'react';
import { Composition, registerRoot, AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C, TITULO } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import { ELENCO } from '../motor/elenco';
import type { Escena } from '../motor/tipos';

const tl = { id: 'x', from: 0, durationInFrames: 400, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 400 }] };
const solo = (como: string, fondo: string, y?: number): Escena => ({
  id: 's' + como, fondo, camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
  actores: [{ id: 'a', como, x: 960, rotulo: '', ...(y ? { y } : {}) }],
} as Escena);
const Motor: React.FC<{ esc: Escena }> = ({ esc }) => <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;

const Celda: React.FC<{ como: string; left: number; top: number; w: number; h: number; k: number; fondo: string; sub?: string; y?: number }> = ({ como, left, top, w, h, k, fondo, sub, y }) => {
  const pie = sub ? 56 : 40;
  const ficha = ELENCO[como];
  const ave = ficha?.tipo === 'ave' || (ficha?.tipo === 'dibujo' && !!ficha.p?.vuela);
  const yMundo = 790 + 10 - (h - pie) / k;
  const nombre = (ficha?.griego as string) ?? como.replace(/_oficial$/, '').replace(/_/g, ' ').toUpperCase();
  return (
    <div style={{ position: 'absolute', left, top, width: w, height: h, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: w / 2 - 960 * k, top: -yMundo * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <Motor esc={solo(como, fondo, y ?? (ave ? 640 : undefined))} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, height: pie, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.negro, fontFamily: TITULO, fontWeight: 700, fontSize: nombre.length > 13 ? 17 : 21, letterSpacing: 2, color: C.crema, flexDirection: 'column', lineHeight: 1.05 }}>{nombre}{sub && <span style={{ fontSize: 14, letterSpacing: 1, color: '#D9A86A', fontWeight: 400 }}>{sub}</span>}</div>
    </div>
  );
};

const Hoja: React.FC<{ claves: string[]; fondo?: string; k?: number; subs?: Record<string, string>; ys?: Record<string, number> }> = ({ claves, fondo = 'valle', k = 0.72, subs = {}, ys = {} }) => {
  aplicarTema('hawaianas');
  const cols = 5, filas = Math.max(1, Math.ceil(claves.length / cols)), W = 1920 / cols, H = 1080 / filas;
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {claves.map((c, i) => <Celda key={c + i} como={c} left={(i % cols) * W + 2} top={Math.floor(i / cols) * H + 2} w={W - 4} h={H - 4} k={k * (filas === 2 ? 1.25 : 1)} fondo={fondo} sub={subs[c]} y={ys[c]} />)}
    </AbsoluteFill>
  );
};

/** Un personaje grande (cabeza y manos de cerca). */
const Uno: React.FC<{ clave: string; k?: number; y?: number; fondo?: string }> = ({ clave, k = 2.4, y = 420, fondo = 'valle' }) => {
  aplicarTema('hawaianas');
  const fi = ELENCO[clave], ave = fi?.tipo === 'ave' || (fi?.tipo === 'dibujo' && !!fi.p?.vuela);
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <div style={{ position: 'absolute', left: 960 - 960 * k, top: -y * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <Motor esc={solo(clave, fondo, ave ? 600 : undefined)} />
      </div>
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <>
    <Composition id="hs-hoja" component={Hoja} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ claves: ['pele_oficial'], fondo: 'valle', k: 0.62 }} />
    <Composition id="hs-uno" component={Uno} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ clave: 'pele_oficial', k: 2.4, y: 420, fondo: 'valle' }} />
  </>
));
