// Demo de los diseños oficiales hawaianos y maoríes (elencoHawaianoOficial.tsx, elencoMaoriOficial.tsx). Solo stills.
// npx remotion still src/pruebas/polinesiosOficial.tsx p-grilla out.png --frame=60 --props='{"serie":"hawaianas"}'
// npx remotion still src/pruebas/polinesiosOficial.tsx p-grilla out.png --frame=60 --props='{"serie":"maories"}'
// npx remotion still src/pruebas/polinesiosOficial.tsx p-grilla out.png --frame=60 --props='{"serie":"hawaianas","viejos":true}'
import React from 'react';
import { Composition, registerRoot, AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C, TITULO } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import { ELENCO } from '../motor/elenco';
import type { Escena } from '../motor/tipos';

const tl = { id: 'x', from: 0, durationInFrames: 400, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 400 }] };
const Motor: React.FC<{ esc: Escena }> = ({ esc }) => <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
const solo = (como: string, fondo: string): Escena => ({
  id: 's' + como, fondo, camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
  actores: [{ id: 'a', como, x: 960, rotulo: '' }],
} as Escena);

const SERIES: Record<string, { fondo: string; claves: string[] }> = {
  hawaianas: { fondo: 'valle', claves: ['pele', 'hiiaka', 'maui', 'kane', 'kanaloa', 'ku', 'lono', 'hina', 'poliahu', 'kamapuaa'] },
  maories: { fondo: 'ngahere', claves: ['ranginui', 'papatuanuku', 'tane', 'tangaroa', 'tawhirimatea', 'tumatauenga', 'maui_tikitiki', 'hine_nui_te_po', 'rongo', 'kupe'] },
};
/** Clave oficial (si existe) o la vieja. */
const oficial = (k: string, viejos?: boolean) => (!viejos && ELENCO[`${k}_oficial`] ? `${k}_oficial` : k);

const Celda: React.FC<{ como: string; left: number; top: number; w: number; h: number; k: number; fondo: string }> = ({ como, left, top, w, h, k, fondo }) => {
  const pie = 46; // alto de la franja del nombre
  const yMundo = 790 + 10 - (h - pie) / k;
  const nombre = (ELENCO[como]?.griego as string) ?? como;
  return (
    <div style={{ position: 'absolute', left, top, width: w, height: h, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: w / 2 - 960 * k, top: -yMundo * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <Motor esc={solo(como, fondo)} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, height: pie, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.negro, fontFamily: TITULO, fontWeight: 700, fontSize: nombre.length > 11 ? 21 : 26, letterSpacing: 3, color: C.crema }}>{nombre}</div>
    </div>
  );
};

const Grilla: React.FC<{ serie: string; viejos?: boolean }> = ({ serie, viejos }) => {
  aplicarTema(serie);
  const { fondo, claves } = SERIES[serie];
  const cols = Math.ceil(claves.length / 2), W = 1920 / cols, H = 540, k = 0.9;
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {claves.map((c, i) => <Celda key={c} como={oficial(c, viejos)} left={(i % cols) * W + 2} top={Math.floor(i / cols) * H + 2} w={W - 4} h={H - 4} k={k} fondo={fondo} />)}
    </AbsoluteFill>
  );
};

/** Un personaje grande (para mirar cabeza y manos de cerca). */
const Uno: React.FC<{ serie: string; clave: string; k?: number; y?: number }> = ({ serie, clave, k = 2.4, y = 420 }) => {
  aplicarTema(serie);
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <div style={{ position: 'absolute', left: 960 - 960 * k, top: -y * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <Motor esc={solo(clave, SERIES[serie].fondo)} />
      </div>
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <>
    <Composition id="p-grilla" component={Grilla} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ serie: 'hawaianas', viejos: false }} />
    <Composition id="p-uno" component={Uno} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ serie: 'hawaianas', clave: 'pele', k: 2.4, y: 420 }} />
  </>
));
