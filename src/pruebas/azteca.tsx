// Prueba visual del tema azteca ("codice"). Solo para mirar stills sueltos (no se renderiza video).
// npx remotion still src/pruebas/azteca.tsx a-fondos /tmp/x.png --frame=60
// npx remotion still src/pruebas/azteca.tsx aztecas-01-los-hijos-de-ometeotl /tmp/x.png --frame=900
import React from 'react';
import { Composition, registerRoot, useCurrentFrame, Freeze } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C, Guardas } from '../comun/vasija';
import { Fondo, ElementoSVG } from '../motor/fondos';
import { EscenaMotor, momento } from '../motor/Escena';
import { VideoMotor } from '../motor/VideoMotor';
import type { GuionVisual, Timeline, Escena } from '../motor/tipos';
import g1 from '../videos/aztecas-01-los-hijos-de-ometeotl/guion.json';
import g2 from '../videos/aztecas-02-el-monstruo-de-la-tierra/guion.json';
import g3 from '../videos/aztecas-03-el-sol-de-jaguar/guion.json';
import g4 from '../videos/aztecas-04-el-sol-de-viento/guion.json';
import g5 from '../videos/aztecas-05-la-lluvia-de-fuego/guion.json';
import g6 from '../videos/aztecas-06-el-diluvio-y-el-cielo-que-cayo/guion.json';
import g7 from '../videos/aztecas-07-los-huesos-del-mictlan/guion.json';
import g8 from '../videos/aztecas-08-el-maiz-del-cerro/guion.json';
import g9 from '../videos/aztecas-09-la-hoguera-de-teotihuacan/guion.json';
import g10 from '../videos/aztecas-10-el-conejo-en-la-luna/guion.json';
import g11 from '../videos/aztecas-11-la-batalla-de-coatepec/guion.json';
import g12 from '../videos/aztecas-12-el-aguila-sobre-el-nopal/guion.json';

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

const FONDOS = ['omeyocan', 'aguas_primeras', 'valle', 'encinar', 'selva', 'firmamento', 'mictlan', 'teotihuacan', 'teotihuacan_noche', 'coatepec', 'aztlan', 'lago_texcoco', 'tenochtitlan', 'milpa'];
const EXTRA: Record<string, [string, number, number, Record<string, unknown>?][]> = {
  omeyocan: [['calendario', 1300, 0.9], ['icpalli', 500, 1]],
  aguas_primeras: [['huesos', 960, 1, { brillo: true }]],
  valle: [['nopal', 960, 1, { roca: true }]],
  firmamento: [['luna_codice', 700, 1.2, { conejo: true }], ['sol_codice', 1300, 1, { medio: true }]],
  mictlan: [['huesos', 1000, 1, { brillo: true }]],
  teotihuacan_noche: [['hoguera', 960, 1]],
  tenochtitlan: [['acalli', 1300, 1]],
  milpa: [['espejo', 600, 0.8], ['remolino', 1400, 0.8]],
};
const Fondos: React.FC = () => {
  aplicarTema('aztecas');
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs><radialGradient id="halo"><stop offset="0%" stopColor="#FFD27A" stopOpacity={0.85} /><stop offset="100%" stopColor="#FF9A3C" stopOpacity={0} /></radialGradient><radialGradient id="haloBlanco"><stop offset="0%" stopColor="#FFF6DD" stopOpacity={0.9} /><stop offset="100%" stopColor="#FFF6DD" stopOpacity={0} /></radialGradient></defs>
        {FONDOS.map((t, i) => (
          <svg key={t} x={(i % 4) * 480} y={Math.floor(i / 4) * 270} width={476} height={266} viewBox="0 0 1920 1080">
            <rect width={1920} height={1080} fill={t.includes('noche') || t === 'firmamento' ? '#1A2440' : t === 'mictlan' ? '#2A1A24' : '#EFDDB0'} />
            <Fondo tipo={t} f={f} />
            {(EXTRA[t] ?? []).map(([tipo, x, s, props], k) => <ElementoSVG key={k} tipo={tipo} x={x} s={s} f={f} props={props} />)}
            <Guardas desplaz={0} />
            <text x={40} y={1040} fontSize={80} fill="#FFF" stroke="#000" strokeWidth={4}>{t}</text>
          </svg>
        ))}
        <svg x={2 * 480} y={3 * 270} width={476} height={266} viewBox="0 0 1920 1080">
          <rect width={1920} height={1080} fill="#EFDDB0" />
          <ElementoSVG tipo="templo_mayor" x={500} s={1} f={f} />
          <ElementoSVG tipo="chicomoztoc" x={1400} s={0.8} f={f} />
          <ElementoSVG tipo="tepetl" x={1800} s={0.6} f={f} props={{ glifo: 'serpiente' }} />
        </svg>
        <svg x={3 * 480} y={3 * 270} width={476} height={266} viewBox="0 0 1920 1080">
          <rect width={1920} height={1080} fill="#EFDDB0" />
          {[['ahuehuete', 200], ['encino', 560], ['ceiba', 950], ['maguey', 1250], ['tule', 1420], ['maiz', 1580], ['casa_mexica', 1780]].map(([t, x], k) => <ElementoSVG key={k} tipo={t as string} x={x as number} s={0.8} f={f} />)}
          <ElementoSVG tipo="momoztli" x={300} y={1000} s={0.8} f={f} />
          <ElementoSVG tipo="jacal" x={900} y={1000} s={0.6} f={f} />
          <ElementoSVG tipo="caracol" x={1400} y={1000} s={1} f={f} />
        </svg>
      </svg>
    </AbsoluteFill>
  );
};

const N = (como: string, x: number, extra: Record<string, unknown> = {}) => ({ id: como + x, como, x, rotulo: como, ...extra });
const escPersonas: Escena = {
  id: 'elenco', fondo: 'valle', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    ...['ometecuhtli', 'omecihuatl', 'tezcatlipoca', 'tezcatlipoca_rojo', 'quetzalcoatl', 'huitzilopochtli', 'tlaloc', 'mictlantecuhtli', 'oxomoco', 'cipactonal', 'mexica_mujer'].map((c, i) => ({ ...N(c, 110 + i * 172), escala: 0.78 })),
    ...['quinametzin', 'chalchiuhtlicue', 'coatlicue', 'coyolxauhqui', 'nanahuatzin', 'tecciztecatl', 'sacerdote_mexica', 'guerrero_aguila', 'guerrero_jaguar', 'xochiquetzal', 'tenoch', 'teomama', 'mictecacihuatl', 'mexica'].map((c, i) => ({ ...N(c, 140 + i * 150), capa: 'fondo' as const, rotulo: '' })),
  ] as Escena['actores'],
};
const escBestias: Escena = {
  id: 'bestias', fondo: 'selva', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    { ...N('tlaltecuhtli', 780), escala: 0.8, capa: 'fondo' }, { ...N('serpiente_emplumada', 1650), capa: 'medio' }, { ...N('serpiente_negra', 1650), capa: 'fondo', y: 640 },
    { ...N('ocelotl', 260) }, { ...N('ozomatli', 560) }, { ...N('cuauhtli', 760), props: { alas: true } }, { ...N('azcatl', 980) }, { ...N('azcatl_negra', 1110) }, { ...N('tochtli', 1260) }, { ...N('huexolotl', 1420) }, { ...N('coatl', 1800) },
    { ...N('huitzitzilin', 1300), y: 330 }, { ...N('cuauhtli', 400), y: 300, capa: 'fondo', rotulo: '' },
  ] as Escena['actores'],
};
const Prueba: React.FC<{ esc: Escena }> = ({ esc }) => {
  aplicarTema('aztecas');
  const tl = { id: esc.id, from: 0, durationInFrames: 200, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 200 }] };
  return <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
};

const GUIONES = [g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12] as unknown as GuionVisual[];

/** Cuadrícula 2×2 de escenas congeladas en un momento (n.º de episodio, escena, frase): 4 cuadros en un solo still. */
type Toma = [number, string, number];
const Cuadricula: React.FC<{ tomas: Toma[] }> = ({ tomas }) => {
  aplicarTema('aztecas');
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {tomas.map(([n, escId, t], i) => {
        const g = GUIONES[n - 1], tl = timelineEstimado(g), k = g.escenas.findIndex((e) => e.id === escId);
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
const N2 = (como: string, x: number, extra: Record<string, unknown> = {}) => ({ id: como + x, como, x, rotulo: '', ...extra });
const escNuevos: Escena = {
  id: 'nuevos', fondo: 'valle', sinAstros: true, camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  elementos: [
    { tipo: 'lluvia_fuego', x: 960, props: { n: 10 } }, { tipo: 'tonacatepetl', x: 1650, s: 0.7, capa: 'medio', props: { abierto: true } },
    { tipo: 'tronco', x: 300, s: 0.6, capa: 'medio' }, { tipo: 'pozo', x: 760, s: 0.5 }, { tipo: 'cajete', x: 1160, s: 0.6 },
    { tipo: 'pluma_bola', x: 1250, y: 300 }, { tipo: 'via_lactea', x: 700, y: 300, s: 0.6 }, { tipo: 'tetl', x: 1450, s: 0.6, props: { color: '#9E3A2A' } },
  ],
  actores: [
    { ...N2('huitzilopochtli_xiuhcoatl', 220), escala: 0.8 }, { ...N2('cihuacoatl', 420), escala: 0.8 }, { ...N2('tlaloque', 600), props: { piel: '#E6B12E' } },
    { ...N2('zolin', 760) }, { ...N2('axolotl', 960) }, { ...N2('ocelotl_liso', 1350), escala: 0.7 }, { ...N2('cuauhtli_claro', 1800), escala: 0.8 },
  ] as Escena['actores'],
};
registerRoot(() => (
  <>
    <Composition id="a-fondos" component={Fondos} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="a-elenco" component={() => <Prueba esc={escPersonas} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="a-bestias" component={() => <Prueba esc={escBestias} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="a-nuevos" component={() => <Prueba esc={escNuevos} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="a-arreglos" component={() => <Cuadricula tomas={[[2, 'partida', 1.9], [3, 'jaguar', 1.6], [10, 'conejo', 3.3], [12, 'aguila', 2.6]]} />} durationInFrames={9000} fps={24} width={1920} height={1080} />
    <Composition id="a-eps-5-8" component={() => <Cuadricula tomas={[[5, 'fuego', 2.6], [6, 'diluvio', 2.8], [7, 'pozo', 1.8], [8, 'rayo', 2.6]]} />} durationInFrames={9000} fps={24} width={1920} height={1080} />
    <Composition id="a-eps-9-12" component={() => <Cuadricula tomas={[[9, 'aguila_jaguar', 2.4], [10, 'conejo', 3.3], [11, 'nacimiento', 2.4], [12, 'aguila', 2.6]]} />} durationInFrames={9000} fps={24} width={1920} height={1080} />
    {GUIONES.map((g) => { const tl = timelineEstimado(g); return <Composition key={g.id} id={g.id} component={VideoMotor as unknown as React.FC<Record<string, unknown>>} durationInFrames={tl.total} fps={tl.fps} width={1920} height={1080} defaultProps={{ guion: g, timeline: tl, idioma: null }} />; })}
  </>
));
