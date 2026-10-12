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
import g5 from '../videos/norteamericanas-05-el-escarabajo-de-agua/guion.json';
import g6 from '../videos/norteamericanas-06-el-primer-fuego/guion.json';
import g7 from '../videos/norteamericanas-07-la-hija-del-sol/guion.json';
import g8 from '../videos/norteamericanas-08-nanabozho-y-el-diluvio/guion.json';
import g9 from '../videos/norteamericanas-09-el-cuervo-roba-la-luz/guion.json';
import g10 from '../videos/norteamericanas-10-el-cuervo-y-la-almeja/guion.json';
import g11 from '../videos/norteamericanas-11-coyote-y-las-estrellas/guion.json';
import g12 from '../videos/norteamericanas-12-el-monstruo-de-kamiah/guion.json';

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

// T1 5–12: dibujos nuevos (norteExtra.tsx) en una grilla.
const EXTRA: [string, number, number, number, Record<string, unknown>][] = [
  ['sicomoro', 300, 760, 0.55, { isla: true, fuego: true }], ['isla_barro', 960, 760, 0.45, { tierra: 1, cuerdas: true, montes: 1 }], ['almeja', 1600, 760, 0.8, { abierta: 0.7, ojos: true }],
  ['monstruo_kamiah', 330, 1060, 0.3, { boca: 0.8 }], ['tronco', 960, 1040, 0.6, {}], ['corazon_piedra', 1450, 1060, 0.6, {}], ['escalera_flechas', 1800, 1060, 0.45, { n: 9 }],
  ['constelacion', 1100, 120, 0.5, {}], ['corazon_monstruo', 1700, 100, 0.35, { cortado: 0 }],
];
const escExtra: Escena = {
  id: 'extra', fondo: 'playa_noroeste', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    N('zarigueya', 140, { escala: 0.9 }), { ...N('zarigueya', 380, { escala: 0.9 }), props: { colaPelada: true } }, N('tecolote', 600, { props: { ojosRojos: true } }), { ...N('buho_cornudo', 760), props: { aros: true } },
    N('cangrejo', 940), { ...N('cangrejo', 1080), props: { color: '#C8321E' } }, N('cuervo_pie', 1250), N('cuervo_blanco', 1420), N('caja_simple', 1580), N('vison', 1760),
    { ...N('cuervo_pie', 700), y: 300, pasos: [{ en: 0, hace: 'vuela', a: [700, 300] }] }, { ...N('tecolote', 400), y: 320, pasos: [{ en: 0, hace: 'vuela', a: [400, 320] }] }, N('somormujo', 1880),
  ] as Escena['actores'],
};
const Extra: React.FC = () => {
  aplicarTema('norteamericanas');
  const f = useCurrentFrame();
  const tl = { id: 'extra', from: 0, durationInFrames: 200, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 200 }] };
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="50%">
        <rect width={1920} height={1080} fill="#E9D4A8" />
        <defs><radialGradient id="halo"><stop offset="0%" stopColor="#FFD27A" stopOpacity={0.85} /><stop offset="100%" stopColor="#FF9A3C" stopOpacity={0} /></radialGradient><radialGradient id="haloBlanco"><stop offset="0%" stopColor="#FFF6DD" stopOpacity={0.9} /><stop offset="100%" stopColor="#FFF6DD" stopOpacity={0} /></radialGradient></defs>
        <svg x={0} y={0} width={960} height={540} viewBox="0 0 1920 1080"><Fondo tipo="dentro_monstruo" f={f} /></svg>
        <rect x={960} y={0} width={960} height={540} fill="#141E2E" />
        <svg x={0} y={0} width={1920} height={1080} viewBox="0 0 1920 1080">{EXTRA.map(([t, x, y, s, p]) => <ElementoSVG key={t} tipo={t} x={x} y={y} s={s} f={f} props={p} />)}</svg>
        <svg x={960} y={540} width={960} height={540} viewBox="0 0 1920 1080"><ElementoSVG tipo="interior_tablones" x={960} y={1000} s={0.9} f={f} props={{ luz: true }} /><ElementoSVG tipo="boveda" x={960} y={200} s={0.6} f={f} /></svg>
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '50%' }}><CalidadHD.Provider value={true}><EscenaMotor esc={escExtra} tl={tl} /></CalidadHD.Provider></div>
    </AbsoluteFill>
  );
};

const GUIONES = [g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12] as unknown as GuionVisual[];
registerRoot(() => (
  <>
    <Composition id="n-fondos" component={Fondos} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="n-elenco" component={Elenco} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="n-extra" component={Extra} durationInFrames={200} fps={24} width={1920} height={1080} />
    {GUIONES.map((g) => { const tl = timelineEstimado(g); return <Composition key={g.id} id={g.id} component={VideoMotor as unknown as React.FC<Record<string, unknown>>} durationInFrames={tl.total} fps={tl.fps} width={1920} height={1080} defaultProps={{ guion: g, timeline: tl, idioma: null }} />; })}
  </>
));
