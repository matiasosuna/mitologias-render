// Prueba visual del tema hindú ("pahari"). Solo para mirar stills sueltos (no se renderiza video).
// npx remotion still src/pruebas/hindu.tsx h-fondos /tmp/x.png --frame=60
// npx remotion still src/pruebas/hindu.tsx h-eps-1-4 /tmp/x.png --frame=60
import React from 'react';
import { Composition, registerRoot, useCurrentFrame, Freeze } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C, Guardas } from '../comun/vasija';
import { Fondo, ElementoSVG } from '../motor/fondos';
import { EscenaMotor, momento } from '../motor/Escena';
import { FONDOS_HINDU } from '../motor/fondosHindu';
import type { GuionVisual, Timeline, Escena } from '../motor/tipos';
import { GUIONES_HINDU } from './hinduGuiones';
import { Miniatura } from '../comun/miniatura';
import { PortadaIG } from '../comun/portadaIG';
import { VideoMotor } from '../motor/VideoMotor';
import { VideoShort } from '../motor/Short';

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

const EXTRA: Record<string, [string, number, number, Record<string, unknown>?][]> = {
  oceano_cosmico: [['huevo_oro', 960, 0.8]],
  oceano_leche: [['vishnu_shesha', 1000, 0.9, { loto: true }]],
  svarga: [['kalpavriksha', 1300, 0.8]],
  kailash: [['piel_tigre', 900, 1]],
  palacio_pahari: [['trono_indio', 700, 0.9], ['pilar', 1400, 0.8, { rota: true }]],
  crepusculo: [['puerta_palacio', 960, 0.9]],
  palacio_noche: [['yajna', 900, 1]],
  cielo_cosmico: [['sol_pahari', 700, 1, { eclipse: 0.5 }], ['luna_pahari', 1300, 1, { llena: true }]],
  diluvio: [['barco_manu', 900, 1, { soga: 300 }]],
  campo_pahari: [['cuenco', 900, 1]],
  ashram: [['mandap', 1200, 0.7]],
  orilla_rio: [['loto', 1200, 0.7]],
};
const Fondos: React.FC = () => {
  aplicarTema('hindues');
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs><radialGradient id="halo"><stop offset="0%" stopColor="#FFD27A" stopOpacity={0.85} /><stop offset="100%" stopColor="#FF9A3C" stopOpacity={0} /></radialGradient><radialGradient id="haloBlanco"><stop offset="0%" stopColor="#FFF6DD" stopOpacity={0.9} /><stop offset="100%" stopColor="#FFF6DD" stopOpacity={0} /></radialGradient></defs>
        {FONDOS_HINDU.map((t, i) => (
          <svg key={t} x={(i % 4) * 480} y={Math.floor(i / 4) * 270} width={476} height={266} viewBox="0 0 1920 1080">
            <rect width={1920} height={1080} fill="#EFDDB0" />
            <Fondo tipo={t} f={f} />
            {(EXTRA[t] ?? []).map(([tipo, x, s, props], k) => <ElementoSVG key={k} tipo={tipo} x={x} s={s} f={f} props={props} />)}
            <Guardas desplaz={0} />
            <text x={40} y={1040} fontSize={80} fill="#FFF" stroke="#000" strokeWidth={4}>{t}</text>
          </svg>
        ))}
        <svg x={2 * 480} y={3 * 270} width={476} height={266} viewBox="0 0 1920 1080">
          <rect width={1920} height={1080} fill="#EFDDB0" />
          <Fondo tipo="oceano_leche" f={f} />
          <ElementoSVG tipo="batido" x={960} s={0.8} f={f} props={{ veneno: true }} />
          <Guardas desplaz={0} />
        </svg>
        <svg x={3 * 480} y={3 * 270} width={476} height={266} viewBox="0 0 1920 1080">
          <rect width={1920} height={1080} fill="#EFDDB0" />
          <Fondo tipo="bosque_pahari" f={f} />
          <ElementoSVG tipo="pilar_fuego" x={960} s={1} f={f} />
          {[['estanque', 400], ['mango', 1500], ['vedas', 1750]].map(([t, x], k) => <ElementoSVG key={k} tipo={t as string} x={x as number} s={0.7} f={f} />)}
          <Guardas desplaz={0} />
        </svg>
      </svg>
    </AbsoluteFill>
  );
};

const N = (como: string, x: number, extra: Record<string, unknown> = {}) => ({ id: como + x, como, x, ...extra });
const escDioses: Escena = {
  id: 'dioses', fondo: 'palacio_pahari', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    ...['vishnu', 'lakshmi', 'brahma', 'shiva', 'parvati', 'ganesha', 'indra', 'surya', 'chandra', 'narasimha', 'varaha'].map((c, i) => ({ ...N(c, 120 + i * 168), escala: 0.72 })),
    ...['sati', 'dhanvantari', 'mohini', 'kama', 'rati', 'garuda', 'vamana', 'ganesha_nino', 'prahlada', 'deva', 'apsara', 'parvati_asceta', 'shiva_claro'].map((c, i) => ({ ...N(c, 120 + i * 140), capa: 'fondo' as const, escala: 0.8 })),
  ] as Escena['actores'],
};
const escOtros: Escena = {
  id: 'otros', fondo: 'bosque_pahari', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    ...['hiranyakashipu', 'bali', 'asura', 'asura_rojo', 'rahu', 'durvasa', 'sabio', 'narada', 'shukra', 'manu', 'daksha', 'daksha_cabra'].map((c, i) => ({ ...N(c, 110 + i * 155), escala: 0.7 })),
    ...['virabhadra', 'raja', 'aldeano', 'aldeana', 'anciano_aldea', 'nino_aldea', 'brahman', 'hiranyaksha', 'asura_violeta', 'deva_azafran'].map((c, i) => ({ ...N(c, 140 + i * 175), capa: 'fondo' as const, escala: 0.8 })),
  ] as Escena['actores'],
};
const escBestias: Escena = {
  id: 'bestias', fondo: 'orilla_rio', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    { ...N('airavata', 300), escala: 0.8 }, { ...N('kurma', 900), escala: 0.7 }, { ...N('matsya', 1450), y: 600, escala: 0.8 }, { ...N('shesha', 1780), escala: 0.8 },
    { ...N('vasuki', 200), capa: 'fondo' }, { ...N('nandi', 620), capa: 'fondo' }, { ...N('kamadhenu', 1000), capa: 'fondo', escala: 0.9 }, { ...N('uchchaihshravas', 1350), capa: 'fondo' },
    { ...N('hamsa', 1150) }, { ...N('mushika', 1250) }, { ...N('mayura_abierto', 1650), capa: 'medio' }, { ...N('rahu_cabeza', 700), y: 300 }, { ...N('jabali_varaha', 1600), capa: 'medio', escala: 0.7 }, { ...N('cobra', 520) }, { ...N('elefante', 60), capa: 'medio', escala: 0.6 }, { ...N('pececito', 1820), y: 400 },
  ] as Escena['actores'],
};
const Prueba: React.FC<{ esc: Escena }> = ({ esc }) => {
  aplicarTema('hindues');
  const tl = { id: esc.id, from: 0, durationInFrames: 200, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 200 }] };
  return <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
};

/** Cuadrícula 2×2 de escenas congeladas en un momento (n.º de episodio, escena, frase): 4 cuadros en un solo still. */
type Toma = [number, string, number];
const Cuadricula: React.FC<{ tomas: Toma[] }> = ({ tomas }) => {
  aplicarTema('hindues');
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {tomas.map(([n, escId, t], i) => {
        const g = GUIONES_HINDU.find((x) => Number(x.numero) === n);
        if (!g) return null;
        const tl = timelineEstimado(g), k = g.escenas.findIndex((e) => e.id === escId);
        if (k < 0) return null;
        const etl = { ...tl.escenas[k], from: 0 };
        return (
          <div key={i} style={{ position: 'absolute', left: (i % 2) * 960, top: Math.floor(i / 2) * 540, width: 960, height: 540, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(0.5)', transformOrigin: '0 0' }}>
              <Freeze frame={Math.round(momento(etl, t))}><CalidadHD.Provider value={true}><EscenaMotor esc={g.escenas[k]} tl={etl} /></CalidadHD.Provider></Freeze>
            </div>
            <div style={{ position: 'absolute', left: 8, bottom: 6, color: '#fff', fontSize: 22, textShadow: '0 0 4px #000' }}>{`${n} · ${escId} · ${t}`}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
/** Tomas para revisar: [episodio, escena, frase]. */
export const TOMAS: Record<string, Toma[]> = {
  'h-eps-1-4': [[1, 'sueno', 2.5], [2, 'pilar', 2.5], [3, 'barco', 3.4], [4, 'guirnalda', 2.6]],
  'h-eps-5-8': [[5, 'batido', 3.5], [6, 'bebe', 2.6], [7, 'rahu', 2.6], [8, 'sacrificio', 2.4]],
  'h-eps-9-12': [[9, 'flecha', 3.4], [10, 'elefante', 2.6], [11, 'pilar', 2.6], [12, 'pasos', 3.4]],
};
/** Piezas de la serie con la piel pahari: miniatura, portada del video, Short y portada de Instagram del ep. 1. */
const Piezas: React.FC = () => {
  const g = GUIONES_HINDU[0];
  if (!g) return null;
  const tl = timelineEstimado(g);
  const caja = (left: number, top: number, w: number, h: number, k: number, hijo: React.ReactNode) => <div style={{ position: 'absolute', left, top, width: w * k, height: h * k, overflow: 'hidden' }}><div style={{ width: w, height: h, transform: `scale(${k})`, transformOrigin: '0 0', position: 'relative' }}>{hijo}</div></div>;
  return (
    <AbsoluteFill style={{ backgroundColor: '#222' }}>
      {caja(0, 0, 1280, 720, 0.75, <Miniatura titulo={g.titulo.en ?? g.titulo.es} numero={g.numero} heroe={g.miniatura?.heroe} rival={g.miniatura?.rival} serie={g.serie} />)}
      {caja(960, 0, 1920, 1080, 0.5, <Freeze frame={50}><VideoMotor guion={g} timeline={tl} idioma="en" /></Freeze>)}
      {caja(0, 545, 1080, 1920, 0.28, <Freeze frame={90}><VideoShort guion={g} timeline={tl} n={0} idioma="en" /></Freeze>)}
      {caja(330, 545, 1080, 1350, 0.4, <PortadaIG titulo={g.titulo.en ?? g.titulo.es} numero={g.numero} temporada="SEASON 1" heroe={g.miniatura?.heroe} rival={g.miniatura?.rival} serie={g.serie} />)}
      {caja(780, 545, 1920, 1080, 0.5, <Freeze frame={Math.round(tl.escenas[3].from + tl.escenas[3].durationInFrames * 0.6)}><VideoMotor guion={g} timeline={tl} idioma="en" /></Freeze>)}
    </AbsoluteFill>
  );
};
registerRoot(() => (
  <>
    <Composition id="h-piezas" component={Piezas} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="h-fondos" component={Fondos} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="h-dioses" component={() => <Prueba esc={escDioses} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="h-otros" component={() => <Prueba esc={escOtros} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="h-bestias" component={() => <Prueba esc={escBestias} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    {Object.entries(TOMAS).map(([id, t]) => <Composition key={id} id={id} component={() => <Cuadricula tomas={t} />} durationInFrames={9000} fps={24} width={1920} height={1080} />)}
  </>
));
