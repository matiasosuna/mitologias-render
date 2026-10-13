// Prueba visual del tema maorí ("kowhaiwhai"). Solo para mirar stills sueltos (no se renderiza video).
// npx remotion still src/pruebas/maori.tsx m-fondos /tmp/x.png --frame=60
// npx remotion still src/pruebas/maori.tsx m-cuadricula-1 /tmp/x.png --frame=60   (cuadrículas 2×2 de escenas)
import React from 'react';
import { Composition, registerRoot, useCurrentFrame, Freeze, AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C, Guardas } from '../comun/vasija';
import { Fondo, ElementoSVG } from '../motor/fondos';
import { EscenaMotor, momento } from '../motor/Escena';
import { VideoMotor } from '../motor/VideoMotor';
import { Miniatura } from '../comun/miniatura';
import { VideoShort, tramoShort } from '../motor/Short';
import { VideoVertical } from '../motor/VideoVertical';
import { FONDOS_MAORI } from '../motor/fondosMaori';
import type { GuionVisual, Timeline, Escena } from '../motor/tipos';
import { GUIONES_MAORI } from './maoriGuiones';

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

const DEFS = <defs><radialGradient id="halo"><stop offset="0%" stopColor="#FFD27A" stopOpacity={0.85} /><stop offset="100%" stopColor="#FF9A3C" stopOpacity={0} /></radialGradient><radialGradient id="haloBlanco"><stop offset="0%" stopColor="#FFF6DD" stopOpacity={0.9} /><stop offset="100%" stopColor="#FFF6DD" stopOpacity={0} /></radialGradient></defs>;
const OSCUROS = new Set(['te_po', 'rarohenga', 'ahi_mahuika', 'po_whetu', 'rua_ra', 'whare_dentro']);
const Fondos: React.FC = () => {
  aplicarTema('maories');
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {DEFS}
        {FONDOS_MAORI.map((t, i) => (
          <svg key={t} x={(i % 4) * 480} y={Math.floor(i / 4) * 270} width={476} height={266} viewBox="0 0 1920 1080">
            <rect width={1920} height={1080} fill={OSCUROS.has(t) ? '#1A1A2A' : '#EFDAB0'} />
            <Fondo tipo={t} f={f} />
            <Guardas desplaz={0} />
            <text x={40} y={1040} fontSize={80} fill="#FFF" stroke="#000" strokeWidth={4}>{t}</text>
          </svg>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
const Elementos: React.FC = () => {
  aplicarTema('maories');
  const f = useCurrentFrame();
  const fila = (y: number, items: [string, number, number, Record<string, unknown>?, number?][]) => items.map(([t, x, s, p, yy], k) => <ElementoSVG key={`${y}${k}`} tipo={t} x={x} y={yy ?? y} s={s} f={f} props={p} />);
  return (
    <AbsoluteFill style={{ backgroundColor: '#EFDAB0' }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {DEFS}
        {fila(360, [['kauri', 120, 0.45], ['ponga', 300, 0.6], ['nikau', 450, 0.6], ['pohutukawa', 650, 0.5], ['totara', 850, 0.45], ['rakau', 1000, 0.6], ['harakeke', 1150, 0.7], ['rarauhe', 1300, 0.7], ['mara_kumara', 1600, 0.5], ['poupou', 1820, 0.5]])}
        {fila(700, [['wharenui', 220, 0.6], ['pataka', 520, 0.7], ['whare', 720, 0.7], ['palisada', 1000, 0.5, { ancho: 500 }], ['tukutuku', 1300, 0.6], ['kete', 1450, 1, { brillo: true }], ['ahi', 1600, 0.8], ['ana', 1800, 0.5], ['rua', 1400, 0.8, {}, 720]])}
        {fila(1060, [['waka', 260, 0.6, {}, 1040], ['waka_hourua', 820, 0.55, {}, 1040], ['te_ika', 1500, 0.35, { tierra: 0.5 }, 1050], ['toka', 1850, 0.6]])}
        <ElementoSVG tipo="ra" x={1100} y={160} s={0.8} f={f} props={{ atado: true }} />
        <ElementoSVG tipo="marama" x={1300} y={160} s={0.7} f={f} />
        <ElementoSVG tipo="matariki" x={1500} y={150} s={0.6} f={f} />
        <ElementoSVG tipo="kapua" x={1750} y={170} s={0.6} f={f} props={{ larga: true }} />
        <ElementoSVG tipo="matau" x={1700} y={420} s={0.8} f={f} props={{ brillo: true }} />
        <ElementoSVG tipo="kauae" x={1850} y={520} s={1} f={f} props={{ brillo: true }} />
        <ElementoSVG tipo="korakora" x={1600} y={560} s={1} f={f} />
      </svg>
    </AbsoluteFill>
  );
};

const N = (como: string, x: number, extra: Record<string, unknown> = {}) => ({ id: como + x, como, x, rotulo: como, ...extra });
const escDioses: Escena = {
  id: 'dioses', fondo: 'te_ao_marama', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    ...['ranginui', 'papatuanuku', 'tane', 'tangaroa', 'tawhirimatea', 'tumatauenga', 'rongo', 'haumia', 'hine_ahu_one', 'hine_titama', 'hine_nui_te_po'].map((c, i) => ({ ...N(c, 100 + i * 172), escala: 0.75 })),
    ...['ruaumoko', 'maui_tikitiki', 'maui_nino', 'maui_hermano', 'taranga', 'makeatutara', 'muri_ranga_whenua', 'tama_nui_ki_te_rangi', 'mahuika', 'tawhaki', 'karihi', 'tangotango', 'matakerepo'].map((c, i) => ({ ...N(c, 120 + i * 140), capa: 'fondo' as const, rotulo: '' })),
  ] as Escena['actores'],
};
const escGente: Escena = {
  id: 'gente', fondo: 'kainga', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    ...['ponaturi', 'rata_toa', 'matuku_tangotango', 'hakuturi', 'kupe', 'kuramarotini', 'hoturapa', 'muturangi', 'rangatira', 'tohunga'].map((c, i) => ({ ...N(c, 100 + i * 190), escala: 0.75 })),
    ...['tangata', 'wahine', 'kaumatua', 'kuia', 'toa', 'tamaiti', 'kotiro', 'maui_joven'].map((c, i) => ({ ...N(c, 160 + i * 220), capa: 'fondo' as const, rotulo: '' })),
  ] as Escena['actores'],
};
const escBestias: Escena = {
  id: 'bestias', fondo: 'takutai', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    { ...N('taniwha', 700), escala: 0.7, capa: 'fondo' }, { ...N('wheke', 1650), escala: 0.6, capa: 'medio' },
    { ...N('kereru', 120) }, { ...N('piwakawaka', 260) }, { ...N('tui', 380) }, { ...N('miromiro', 480) }, { ...N('toutouwai', 570) }, { ...N('riroriro', 660) }, { ...N('kahu', 800) },
    { ...N('kuri', 980) }, { ...N('tuatara', 1180) }, { ...N('weta', 1320) },
    { ...N('ika', 300), y: 400 }, { ...N('mango', 700), y: 380 }, { ...N('tohora', 1250), y: 330, escala: 0.6 }, { ...N('kahu', 1600), y: 250, rotulo: '' }, { ...N('kereru', 1800), y: 300, rotulo: '' }, { ...N('pepi_tikitiki', 1450), y: 600, rotulo: 'pepi' },
  ] as Escena['actores'],
};
const Prueba: React.FC<{ esc: Escena }> = ({ esc }) => {
  aplicarTema('maories');
  const tl = { id: esc.id, from: 0, durationInFrames: 200, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 200 }] };
  return <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
};

/** Cuadrícula 2×2 de escenas congeladas en un momento (n.º de episodio, escena, frase). */
type Toma = [number, string, number];
const Cuadricula: React.FC<{ tomas: Toma[] }> = ({ tomas }) => {
  aplicarTema('maories');
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {tomas.map(([n, escId, t], i) => {
        const g = GUIONES_MAORI.find((x) => Number(x.numero) === n);
        if (!g) return null;
        const tl = timelineEstimado(g), k = Math.max(0, g.escenas.findIndex((e) => e.id === escId));
        const etl = { ...tl.escenas[k], from: 0 };
        return (
          <div key={i} style={{ position: 'absolute', left: (i % 2) * 960, top: Math.floor(i / 2) * 540, width: 960, height: 540, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(0.5)', transformOrigin: '0 0' }}>
              <Freeze frame={Math.round(momento(etl, t))}><CalidadHD.Provider value={true}><EscenaMotor esc={g.escenas[k]} tl={etl} /></CalidadHD.Provider></Freeze>
            </div>
            <div style={{ position: 'absolute', left: 8, bottom: 6, color: '#fff', fontSize: 22, textShadow: '0 0 4px #000' }}>{`${n} · ${g.escenas[k].id} · ${t}`}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
/** Cuadrícula de una escena por episodio: [episodio, escena, frase] (se completa en maoriGuiones.ts). */
import { TOMAS_MAORI } from './maoriGuiones';

registerRoot(() => (
  <>
    <Composition id="m-fondos" component={Fondos} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="m-elementos" component={Elementos} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="m-dioses" component={() => <Prueba esc={escDioses} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="m-gente" component={() => <Prueba esc={escGente} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="m-bestias" component={() => <Prueba esc={escBestias} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="m-miniatura" component={() => <Miniatura titulo="Sky Father, Earth Mother" numero="01" heroe="tane" rival="tumatauenga" serie="maories" />} durationInFrames={10} fps={24} width={1280} height={720} />
    {TOMAS_MAORI.map((tomas, i) => <Composition key={i} id={`m-cuadricula-${i + 1}`} component={() => <Cuadricula tomas={tomas} />} durationInFrames={9000} fps={24} width={1920} height={1080} />)}
    {GUIONES_MAORI.slice(0, 1).map((g) => { const tl = timelineEstimado(g); return <Composition key={`${g.id}-short`} id={`${g.id}-short-1`} component={VideoShort as unknown as React.FC<Record<string, unknown>>} durationInFrames={tramoShort(g, tl, 0).dur} fps={tl.fps} width={1080} height={1920} defaultProps={{ guion: g, timeline: tl, n: 0, idioma: 'en' }} />; })}
    {GUIONES_MAORI.slice(0, 1).map((g) => { const tl = timelineEstimado(g); return <Composition key={`${g.id}-vertical`} id={`${g.id}-vertical`} component={VideoVertical as unknown as React.FC<Record<string, unknown>>} durationInFrames={tl.total} fps={tl.fps} width={1080} height={1920} defaultProps={{ guion: g, timeline: tl }} />; })}
    {GUIONES_MAORI.map((g) => { const tl = timelineEstimado(g); return <Composition key={g.id} id={g.id} component={VideoMotor as unknown as React.FC<Record<string, unknown>>} durationInFrames={tl.total} fps={tl.fps} width={1920} height={1080} defaultProps={{ guion: g, timeline: tl, idioma: null }} />; })}
  </>
));
