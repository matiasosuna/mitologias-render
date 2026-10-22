// Prueba visual de Learn Bible 777 (serie `biblia`, tema "natural"). Solo stills sueltos (no se renderiza video).
// npx remotion still src/pruebas/biblia.tsx b-fondos /tmp/x.png --frame=60
// npx remotion still src/pruebas/biblia.tsx b-luz /tmp/x.png --frame=0   (una toma del ep. 1 a tamaño real)
// npx remotion still src/pruebas/biblia.tsx b-video /tmp/x.png --frame=60  (portada; el final: --frame=TL.total-100)
import React from 'react';
import { Composition, registerRoot, useCurrentFrame, Freeze, AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C, Guardas } from '../comun/vasija';
import { Fondo } from '../motor/fondos';
import { EscenaMotor, momento } from '../motor/Escena';
import { FONDOS_BIBLIA } from '../motor/fondosBiblia';
import type { GuionVisual, Timeline, Escena } from '../motor/tipos';
import { Miniatura } from '../comun/miniatura';
import { PortadaIG } from '../comun/portadaIG';
import { VideoMotor } from '../motor/VideoMotor';
import { VideoVertical } from '../motor/VideoVertical';
import g1 from '../videos/biblia-genesis-01/guion.json';

const G = g1 as unknown as GuionVisual;

/** Timeline estimado (≈2,3 palabras/s en inglés), igual que motor-revisar sin narración. */
function timelineEstimado(g: GuionVisual, fps = 24): Timeline {
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
const TL = timelineEstimado(G);

/** Los 12 fondos del tema en una grilla 4×3. */
const Fondos: React.FC = () => {
  aplicarTema('biblia');
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {FONDOS_BIBLIA.map((t, i) => (
          <svg key={t} x={(i % 4) * 480} y={Math.floor(i / 4) * 360} width={476} height={356} viewBox="0 60 1920 1020" preserveAspectRatio="xMidYMid slice">
            <Fondo tipo={t} f={f} />
            <Guardas desplaz={0} />
            <text x={40} y={1040} fontSize={80} fill="#FFF" stroke="#000" strokeWidth={4}>{t}</text>
          </svg>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Prueba: React.FC<{ esc: Escena }> = ({ esc }) => {
  aplicarTema('biblia');
  const tl = { id: esc.id, from: 0, durationInFrames: 200, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 200 }] };
  return <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
};
const N = (como: string, x: number, extra: Record<string, unknown> = {}) => ({ id: como + x, como, x, rotulo: '', ...extra });
const escElenco: Escena = {
  id: 'elenco', fondo: 'llanura', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    N('hombre_biblia', 160), N('mujer_biblia', 340), { ...N('buey_biblia', 640), escala: 0.5 }, { ...N('leon_biblia', 1050), escala: 0.5 }, { ...N('caballo_biblia', 1450), escala: 0.45 }, { ...N('ciervo_biblia', 1780), escala: 0.45 },
    { ...N('oveja_biblia', 250), capa: 'fondo' }, { ...N('cabra_biblia', 560), capa: 'fondo' }, { ...N('vaca_biblia', 900), capa: 'fondo', escala: 0.6 }, { ...N('tortuga_biblia', 1250), capa: 'fondo' },
    { ...N('aguila_biblia', 500), y: 280, escala: 0.5 }, { ...N('paloma_biblia', 900), y: 260, escala: 0.6 }, { ...N('pajaro_biblia', 1200), y: 240 },
    { ...N('ballena_biblia', 1500), y: 300, escala: 0.4 }, { ...N('delfin_biblia', 1820), y: 300, escala: 0.5 }, { ...N('pez_biblia', 1300), y: 420, escala: 0.5 },
  ] as Escena['actores'],
};

/** Los dos personajes de Génesis 1 lado a lado, grandes (el hombre y la mujer, dibujos propios). */
const escGente: Escena = {
  id: 'gente', fondo: 'llanura', sinAstros: true, camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [{ ...N('hombre_biblia', 760), escala: 1.35 }, { ...N('mujer_biblia', 1160), escala: 1.35, mira: 'izq' }] as Escena['actores'],
};

/** Una escena del ep. 1 congelada en un momento (frase), a tamaño real. */
const Toma: React.FC<{ escId: string; t: number }> = ({ escId, t }) => {
  aplicarTema('biblia');
  const k = G.escenas.findIndex((e) => e.id === escId);
  if (k < 0) return null;
  const etl = { ...TL.escenas[k], from: 0 };
  return <Freeze frame={Math.round(momento(etl, t))}><CalidadHD.Provider value={true}><EscenaMotor esc={G.escenas[k]} tl={etl} idioma="en" /></CalidadHD.Provider></Freeze>;
};
/** Tomas clave del ep. 1: [id de composición, escena, frase]. */
export const TOMAS_BIBLIA: [string, string, number][] = [
  ['b-principio', 'principio', 4.6], ['b-luz', 'luz', 2.5], ['b-firmamento', 'firmamento', 2.8], ['b-tierra', 'tierra', 2.6],
  ['b-plantas', 'plantas', 3.2], ['b-astros', 'astros', 3.6], ['b-mar', 'mar', 3.95], ['b-aves', 'aves', 1.6], ['b-animales', 'animales', 4.2],
  ['b-humanos', 'humanos', 4.6], ['b-alimento', 'alimento', 3.5], ['b-significado', 'significado', 3.6], ['b-significado2', 'significado2', 4.5], ['b-original', 'original', 1.5], ['b-cierre', 'cierre', 1.5],
];
/** Piezas de la serie: miniatura y portada de Instagram (sin "Myths on Clay"); el vertical va en b-vertical. */
const Piezas: React.FC = () => {
  const caja = (left: number, top: number, w: number, h: number, k: number, hijo: React.ReactNode) => <div style={{ position: 'absolute', left, top, width: w * k, height: h * k, overflow: 'hidden' }}><div style={{ width: w, height: h, transform: `scale(${k})`, transformOrigin: '0 0', position: 'relative' }}>{hijo}</div></div>;
  return (
    <AbsoluteFill style={{ backgroundColor: '#222' }}>
      {caja(0, 0, 1280, 720, 0.75, <Miniatura titulo={(G.titulo.en ?? G.titulo.es).toUpperCase()} numero="1" heroe="hombre_biblia" rival="mujer_biblia" serie={G.serie} />)}
      {caja(980, 0, 1080, 1350, 0.4, <PortadaIG titulo={G.titulo.en ?? G.titulo.es} numero="1" temporada="GENESIS" insignia="CHAPTER" heroe="hombre_biblia" rival="mujer_biblia" serie={G.serie} />)}
    </AbsoluteFill>
  );
};
registerRoot(() => (
  <>
    <Composition id="b-fondos" component={Fondos} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="b-elenco" component={() => <Prueba esc={escElenco} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="b-gente" component={() => <Prueba esc={escGente} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="b-video" component={() => <VideoMotor guion={G} timeline={TL} idioma="en" />} durationInFrames={TL.total} fps={24} width={1920} height={1080} />
    <Composition id="b-vertical" component={() => <VideoVertical guion={G} timeline={TL} />} durationInFrames={TL.total} fps={24} width={1080} height={1920} />
    <Composition id="b-piezas" component={Piezas} durationInFrames={10} fps={24} width={1920} height={1080} />
    {TOMAS_BIBLIA.map(([id, e, t]) => <Composition key={id} id={id} component={() => <Toma escId={e} t={t} />} durationInFrames={9000} fps={24} width={1920} height={1080} />)}
  </>
));
