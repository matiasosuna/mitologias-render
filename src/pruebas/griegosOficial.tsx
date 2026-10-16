// Demo de los diseños oficiales griegos (elencoGriegoOficial.tsx). Solo stills, nunca video.
// npx remotion still src/pruebas/griegosOficial.tsx g-hoja out.png --frame=60
// npx remotion still src/pruebas/griegosOficial.tsx g-fila out.png --frame=60 --props='{"claves":["zeus_oficial","hera_oficial"]}'
import React from 'react';
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from 'remotion';
import { aplicarTema, CalidadHD, C, TITULO, TEXTO, Lenguetas, Meandro, FrisoPalmetas } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import type { Escena } from '../motor/tipos';

const tl = { id: 'x', from: 0, durationInFrames: 400, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 400 }] };
const Motor: React.FC<{ esc: Escena }> = ({ esc }) => <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
/** Hermes a la carrera o despegando (paso fijo con `fase`). */
const hermesCorre = (x: number, fase: number, extra: Record<string, unknown> = {}) => ({ id: 'hermes', como: 'hermes_oficial', x, rotulo: '', pasos: [{ en: 0, hace: 'corre', a: x, dur: 0.99 }], props: { fase }, ...extra });
const solo = (como: string, fondo: string, x = 960): Escena => ({
  id: 's' + como, fondo, camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
  actores: [como === 'hermes_oficial' ? hermesCorre(x, 1.6, { escala: 0.9, y: 775 }) : { id: como, x, rotulo: '' }],
} as Escena);

export const GRIEGOS = ['zeus', 'hera', 'poseidon', 'hades', 'atenea', 'apolo', 'artemisa', 'hermes', 'afrodita', 'ares', 'hefesto', 'dioniso', 'prometeo', 'cronos'];
export const GRIEGOS_2 = ['rea', 'hestia', 'demeter', 'persefone', 'zeus_nino', 'amaltea', 'titan', 'ciclope', 'gea', 'urano', 'metis', 'maia', 'heracles', 'perseo', 'medusa', 'teseo', 'minotauro', 'ariadna', 'dedalo', 'icaro', 'midas', 'aracne', 'jason', 'eco', 'narciso', 'odiseo', 'pandora', 'epimeteo', 'hecatonquiro', 'tifon'];
const NOMBRE: Record<string, string> = { rea: 'RHEA', hestia: 'HESTIA', demeter: 'DEMETER', persefone: 'PERSEPHONE', zeus_nino: 'BABY ZEUS', amaltea: 'AMALTHEA', titan: 'TITAN', ciclope: 'CYCLOPS', gea: 'GAIA', urano: 'URANUS', metis: 'METIS', maia: 'MAIA', heracles: 'HERACLES', perseo: 'PERSEUS', medusa: 'MEDUSA', teseo: 'THESEUS', minotauro: 'MINOTAUR', ariadna: 'ARIADNE', dedalo: 'DAEDALUS', icaro: 'ICARUS', midas: 'MIDAS', aracne: 'ARACHNE', jason: 'JASON', eco: 'ECHO', narciso: 'NARCISSUS', odiseo: 'ODYSSEUS', pandora: 'PANDORA', epimeteo: 'EPIMETHEUS', hecatonquiro: 'HUNDRED-HANDED', tifon: 'TYPHON', zeus: 'ZEUS', hera: 'HERA', poseidon: 'POSEIDON', hades: 'HADES', atenea: 'ATHENA', apolo: 'APOLLO', artemisa: 'ARTEMIS', hermes: 'HERMES', afrodita: 'APHRODITE', ares: 'ARES', hefesto: 'HEPHAESTUS', dioniso: 'DIONYSUS', prometeo: 'PROMETHEUS', cronos: 'CRONUS' };

/** Celda: un actor solo en su escena, recortado alrededor de él, con su nombre abajo. */
const Celda: React.FC<{ como: string; left: number; top: number; w: number; h: number; k: number; yMundo: number; nombre?: string; fondo: string; xMundo?: number; dx?: number; letra?: number }> = ({ como, left, top, w, h, k, yMundo, nombre, fondo, xMundo = 960, dx = 0, letra = 25 }) => (
  <div style={{ position: 'absolute', left, top, width: w, height: h, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: w / 2 - xMundo * k, top: -yMundo * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
      <Motor esc={solo(como, fondo, 960 + dx)} />
    </div>
    {nombre && <div style={{ position: 'absolute', bottom: 8, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: letra, letterSpacing: letra > 22 ? 2 : 1, color: C.crema, textShadow: `0 2px 0 ${C.negro}, 0 0 6px ${C.negro}` }}>{nombre}</div>}
  </div>
);

/** Hoja oficial: 2 filas × 7, cuerpo entero y nombre abajo. */
const Hoja: React.FC<{ fondo?: string }> = ({ fondo = 'campo' }) => {
  aplicarTema('griegas');
  const W = 1920 / 7, H = 540, k = 0.76;
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {GRIEGOS.map((g, i) => {
        const r = Math.floor(i / 7), c = i % 7;
        return <Celda key={g} como={`${g}_oficial`} left={c * W + 2} top={r * H + 2} w={W - 4} h={H - 4} k={k} yMundo={830 + 30 - (H - 4) / k} nombre={NOMBRE[g]} fondo={fondo} dx={g === 'cronos' ? -48 : g === 'hermes' ? -12 : -28} />;
      })}
    </AbsoluteFill>
  );
};

/** Hoja de la segunda tanda: 3 filas × 10. */
const Hoja2: React.FC = () => {
  aplicarTema('griegas');
  const cols = 10, W = 1920 / cols, H = 360, k = 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {GRIEGOS_2.map((g, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        return <Celda key={g} como={`${g}_oficial`} left={c * W + 2} top={r * H + 2} w={W - 4} h={H - 4} k={k} yMundo={830 + 40 - (H - 4) / k} nombre={NOMBRE[g]} fondo="campo" letra={20} dx={g === 'hecatonquiro' ? -44 : g === 'tifon' ? -30 : ['icaro', 'dedalo'].includes(g) ? 10 : -20} />;
      })}
    </AbsoluteFill>
  );
};

/** Fila grande de unos pocos (para mirar caras, manos y atributos). */
const Fila: React.FC<{ claves: string[]; escala?: number; fondo?: string }> = ({ claves, escala = 1.3, fondo = 'olimpo' }) => {
  aplicarTema('griegas');
  const paso = 1920 / claves.length;
  return <Motor esc={{ id: 'fila', fondo, camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true, actores: claves.map((c, i) => ({ id: c, x: paso * (i + 0.5) - 20, escala, rotulo: '' })) } as Escena} />;
};

/** Detalle: cabeza, torso y manos de cada uno (2 filas × 7). */
const Cabezas: React.FC<{ claves?: string[]; k?: number; y?: number }> = ({ claves = GRIEGOS, k = 1.3, y = 290 }) => {
  aplicarTema('griegas');
  const cols = Math.min(7, claves.length), W = 1920 / cols, H = claves.length > 7 ? 540 : 1080;
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {claves.map((g, i) => {
        const r = Math.floor(i / 7), c = i % 7;
        return <Celda key={g} como={`${g}_oficial`} left={c * W + 2} top={r * H + 2} w={W - 4} h={H - 4} k={k} xMundo={1000} yMundo={y} fondo="campo" />;
      })}
    </AbsoluteFill>
  );
};


const EPITETO: Record<string, string> = { hermes: 'Messenger of the Gods · son of Zeus and Maia' };
/** Apertura vertical de un Short "Who is…?" (misma puesta que la nórdica, con guardas de vasija). */
const Vertical: React.FC<{ clave: string; fase?: number }> = ({ clave, fase = 1.2 }) => {
  aplicarTema('griegas');
  const f = useCurrentFrame();
  const base = clave.split('_')[0], nombre = NOMBRE[base] ?? base.toUpperCase();
  const K = 1.95, alto = 1160;
  const esc = { id: 'v' + clave, fondo: 'monte', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
    actores: [base === 'hermes' ? hermesCorre(1010, fase, { y: 770 }) : { id: clave, x: 960, rotulo: '' }] } as Escena;
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <div style={{ position: 'absolute', left: 0, top: 300, width: 1080, height: alto, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 540 - 990 * K, top: -(830 - alto / K) * K, width: 1920, height: 1080, transform: `scale(${K})`, transformOrigin: '0 0' }}>
          <Motor esc={esc} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 320, background: `linear-gradient(${C.negro}, #3A1E12)` }}>
        <svg width={1080} height={124} viewBox="0 0 1080 124" style={{ position: 'absolute', top: 0 }}><rect width={1080} height={124} fill={C.barro} /><Lenguetas y={0} desplaz={f} /><Meandro y={56} desplaz={f} /></svg>
        <div style={{ position: 'absolute', top: 160, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 92, color: C.crema, textShadow: `0 5px 0 ${C.negro}` }}>Who is {nombre[0] + nombre.slice(1).toLowerCase()}?</div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 1440, width: 1080, height: 480, background: `linear-gradient(#3A1E12, ${C.negro})` }}>
        <svg width={1080} height={110} viewBox="0 0 1080 110" style={{ position: 'absolute', top: 0 }}><rect width={1080} height={104} fill={C.barro} /><line x1={0} x2={1080} y1={2} y2={2} stroke={C.negro} strokeWidth={5} /><FrisoPalmetas y={10} desplaz={f} /><line x1={0} x2={1080} y1={102} y2={102} stroke={C.negro} strokeWidth={5} /></svg>
        <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 150, letterSpacing: 18, color: C.crema, textShadow: `0 6px 0 ${C.purpura}` }}>{nombre}</div>
        <div style={{ position: 'absolute', top: 310, width: '100%', textAlign: 'center', fontFamily: TEXTO, fontSize: 44, color: '#FFF8EA' }}>{EPITETO[base]}</div>
        <div style={{ position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 36, letterSpacing: 4, color: C.crema }}>MYTHS ON CLAY</div>
      </div>
    </AbsoluteFill>
  );
};

/** Momento de historia: Hermes baja del cielo y aterriza frente a Zeus con el mensaje. */
const HermesZeus: React.FC<{ fase?: number }> = ({ fase = 1.2 }) => {
  aplicarTema('griegas');
  const esc = { id: 'hz', fondo: 'olimpo', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
    actores: [
      { id: 'zeus', como: 'zeus_oficial', x: 600, escala: 1.12, rotulo: '', props: { cabeza: 4 } },
      hermesCorre(1260, fase, { mira: 'izq', y: 700, escala: 1.12 }),
    ] } as Escena;
  return <Motor esc={esc} />;
};

registerRoot(() => (
  <>
    <Composition id="g-hoja" component={Hoja} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ fondo: 'campo' }} />
    <Composition id="g-vertical" component={Vertical} durationInFrames={400} fps={24} width={1080} height={1920} defaultProps={{ clave: 'hermes_oficial', fase: 1.2 }} />
    <Composition id="g-escena" component={HermesZeus} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ fase: 1.2 }} />
    <Composition id="g-hoja2" component={Hoja2} durationInFrames={400} fps={24} width={1920} height={1080} />
    <Composition id="g-cabezas" component={Cabezas} durationInFrames={400} fps={24} width={1920} height={1080} />
    <Composition id="g-fila" component={Fila} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ claves: ['zeus_oficial', 'hera_oficial', 'poseidon_oficial', 'hades_oficial'], escala: 1.3, fondo: 'campo' }} />
  </>
));
