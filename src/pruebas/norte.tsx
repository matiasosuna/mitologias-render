// Prueba visual del tema norteamericano ("pintado"). Solo para mirar stills sueltos (no se renderiza video).
// npx remotion still src/pruebas/norte.tsx n-fondos /tmp/x.png --frame=60
// npx remotion still src/pruebas/norte.tsx norteamericanas-01-la-mujer-del-cielo /tmp/x.png --frame=900
import React from 'react';
import { Composition, registerRoot, useCurrentFrame } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C } from '../comun/vasija';
import { Fondo, ElementoSVG } from '../motor/fondos';
import { EscenaMotor } from '../motor/Escena';
import { VideoMotor } from '../motor/VideoMotor';
import type { GuionVisual, Timeline, Escena } from '../motor/tipos';
import g1 from '../videos/norteamericanas-01-la-mujer-del-cielo/guion.json';
import g2 from '../videos/norteamericanas-02-el-lomo-de-la-tortuga/guion.json';
import g3 from '../videos/norteamericanas-03-nacen-los-gemelos/guion.json';
import g4 from '../videos/norteamericanas-04-brote-y-pedernal/guion.json';

/** Timeline estimado (≈2,3 palabras/s en inglés), igual que motor-revisar sin narración. */
export function timelineEstimado(g: GuionVisual, fps = 24): Timeline {
  const fr = (s: number) => Math.round(s * fps);
  let cursor = fr(4);
  const escenas = g.escenas.map((e) => {
    let local = fr(0.7);
    const frases = e.frases.map((t) => { const dur = Math.ceil((0.6 + (t.en ?? t.es).split(/\s+/).length / 2.3) * fps); const it = { texto: t, audio: {}, from: local, dur }; local += dur + fr(0.6); return it; });
    const durationInFrames = local - fr(0.6) + fr(1);
    const r = { id: e.id, from: cursor, durationInFrames, frases };
    cursor += durationInFrames;
    return r;
  });
  return { fps, introFrames: fr(4), outroFrames: fr(12), total: cursor + fr(12), escenas };
}

const FONDOS = ['mundo_cielo', 'agua_primordial', 'bajo_agua', 'bosque', 'aldea_casa_larga', 'pradera', 'costa_noroeste', 'rio', 'noche'];
const Fondos: React.FC = () => {
  aplicarTema('norteamericanas');
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {FONDOS.map((t, i) => (
          <svg key={t} x={(i % 3) * 640} y={Math.floor(i / 3) * 360} width={636} height={356} viewBox="0 0 1920 1080">
            <rect width={1920} height={1080} fill="#E9D4A8" />
            <defs><radialGradient id="halo"><stop offset="0%" stopColor="#FFD27A" stopOpacity={0.85} /><stop offset="100%" stopColor="#FF9A3C" stopOpacity={0} /></radialGradient><radialGradient id="haloBlanco"><stop offset="0%" stopColor="#FFF6DD" stopOpacity={0.9} /><stop offset="100%" stopColor="#FFF6DD" stopOpacity={0} /></radialGradient></defs>
            <Fondo tipo={t} f={f} />
            {t === 'mundo_cielo' && <><ElementoSVG tipo="arbol_cielo" x={960} s={0.9} f={f} /><ElementoSVG tipo="agujero" x={1500} f={f} /></>}
            {t === 'agua_primordial' && <ElementoSVG tipo="isla_tortuga" x={960} s={0.9} f={f} props={{ tierra: 1, arboles: true }} />}
            {t === 'pradera' && <ElementoSVG tipo="tipi" x={1300} s={0.9} f={f} />}
            <text x={40} y={1040} fontSize={70} fill="#FFF" stroke="#000" strokeWidth={3}>{t}</text>
          </svg>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const N = (como: string, x: number, extra: Record<string, unknown> = {}) => ({ id: como + x, como, x, rotulo: '', ...extra });
const escElenco: Escena = {
  id: 'elenco', fondo: 'aldea_casa_larga', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    N('mujer_cielo', 150), N('jefe_cielo', 330), N('hija_cielo', 500), N('brote', 670), N('pedernal', 840),
    N('haudenosaunee', 1010), N('tlingit', 1180), N('jefe_lakota', 1350), N('anciana_nativa', 1500),
    { ...N('gran_tortuga', 1720), escala: 0.5 }, { ...N('rata_almizclera', 200), capa: 'fondo' }, { ...N('castor', 450), capa: 'fondo' }, { ...N('nutria', 700), capa: 'fondo' },
    { ...N('colimbo', 950), capa: 'fondo' }, { ...N('arana_agua', 1150), capa: 'fondo', props: { cuenco: true } }, { ...N('escarabajo_agua', 1330), capa: 'fondo' }, { ...N('coyote', 1600), capa: 'fondo' },
    { ...N('ganso_salvaje', 500), y: 260 }, { ...N('cuervo_negro', 900), y: 260 }, { ...N('zopilote', 1300), y: 260 },
  ] as Escena['actores'],
};
const Elenco: React.FC = () => {
  aplicarTema('norteamericanas');
  const tl = { id: 'elenco', from: 0, durationInFrames: 200, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 200 }] };
  return <CalidadHD.Provider value={true}><EscenaMotor esc={escElenco} tl={tl} /></CalidadHD.Provider>;
};

const GUIONES = [g1, g2, g3, g4] as unknown as GuionVisual[];
registerRoot(() => (
  <>
    <Composition id="n-fondos" component={Fondos} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="n-elenco" component={Elenco} durationInFrames={200} fps={24} width={1920} height={1080} />
    {GUIONES.map((g) => { const tl = timelineEstimado(g); return <Composition key={g.id} id={g.id} component={VideoMotor as unknown as React.FC<Record<string, unknown>>} durationInFrames={tl.total} fps={tl.fps} width={1920} height={1080} defaultProps={{ guion: g, timeline: tl, idioma: null }} />; })}
  </>
));
