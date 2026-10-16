// Demo de los diseños oficiales de Thor, Odín y Loki (elencoNordico.tsx). Solo stills, nunca video.
// npx remotion still src/pruebas/nordicosOficial.tsx n-comparacion out.png --frame=60
// npx remotion still src/pruebas/nordicosOficial.tsx n-vertical out.png --frame=60 --props='{"clave":"thor_muneco"}'
// npx remotion still src/pruebas/nordicosOficial.tsx n-escena out.png --frame=60 --props='{"v":"muneco"}'
import React from 'react';
import { Composition, registerRoot, useCurrentFrame } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C, TITULO, TEXTO, TextoRunico, Entrelazado } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import type { Escena } from '../motor/tipos';

const tl = { id: 'x', from: 0, durationInFrames: 400, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 400 }] };
const Motor: React.FC<{ esc: Escena }> = ({ esc }) => <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
const solo = (como: string, fondo = 'nieve', extra: Record<string, unknown> = {}): Escena => ({
  id: 's' + como, fondo, camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
  actores: [{ id: como, x: 960, rotulo: '', ...extra }],
} as Escena);

/** Celda: un actor solo en su escena, recortado alrededor de él. */
const Celda: React.FC<{ como: string; left: number; top: number; w: number; h: number; k: number; fondo?: string; yMundo: number; nombre?: string }> = ({ como, left, top, w, h, k, fondo, yMundo, nombre }) => (
  <div style={{ position: 'absolute', left, top, width: w, height: h, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: w / 2 - 960 * k, top: -yMundo * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
      <Motor esc={solo(como, fondo)} />
    </div>
    {nombre && <div style={{ position: 'absolute', bottom: 6, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: C.crema, textShadow: `0 2px 0 ${C.negro}, 0 0 6px ${C.negro}` }}>{nombre}</div>}
  </div>
);

const FILAS: [string, string[]][] = [
  ['Hoy', ['thor', 'odin', 'loki']],
  ['Muñeco mejorado', ['thor_muneco', 'odin_muneco', 'loki_muneco']],
  ['Oficial', ['thor_oficial', 'odin_oficial', 'loki_oficial']],
];
const Comparacion: React.FC = () => {
  aplicarTema('nordicas');
  const LAB = 270, W = (1920 - LAB) / 3, H = 360, k = 0.7;
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {FILAS.map(([etq, claves], r) => (
        <React.Fragment key={etq}>
          <div style={{ position: 'absolute', left: 0, top: r * H, width: LAB, height: H, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 40, lineHeight: 1.15, color: C.crema, borderBottom: `3px solid ${C.purpura}` }}>{etq}</div>
          {claves.map((c, i) => <Celda key={c} como={c} left={LAB + i * W} top={r * H} w={W - 4} h={H - 4} k={k} yMundo={790 + 14 - (H - 4) / k} nombre={r === 0 ? ['THOR', 'ODIN', 'LOKI'][i] : undefined} />)}
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

const EPITETO: Record<string, string> = { thor: 'Defender of Midgard · son of Odin and Earth', odin: 'The All-Father · he gave an eye for wisdom', loki: 'The Trickster · blood-brother of Odin' };
/** Apertura vertical de un Short "Who is…?": cabecera rúnica, el personaje grande y su nombre. */
const Vertical: React.FC<{ clave: string }> = ({ clave }) => {
  aplicarTema('nordicas');
  const f = useCurrentFrame();
  const base = clave.split('_')[0], nombre = base.toUpperCase();
  const K = 1.95, alto = 1160; // zona de escena: 300 → 1460
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <div style={{ position: 'absolute', left: 0, top: 300, width: 1080, height: alto, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 540 - 960 * K, top: -(830 - alto / K) * K, width: 1920, height: 1080, transform: `scale(${K})`, transformOrigin: '0 0' }}>
          <Motor esc={solo(clave, base === 'odin' ? 'asgard' : base === 'loki' ? 'bosque_nevado' : 'nieve', { escala: base === 'odin' ? 0.86 : 1 })} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 320, background: `linear-gradient(${C.negro}, #22384D)` }}>
        <svg width={1080} height={120} viewBox="0 0 1080 120" style={{ position: 'absolute', top: 0 }}><rect width={1080} height={50} fill={C.negro} /><TextoRunico texto="ODIN THOR LOKI FRIGG FREYJA TYR" x={20 - (f % 600)} y={10} /><TextoRunico texto="ODIN THOR LOKI FRIGG FREYJA TYR" x={740 - (f % 600)} y={10} /><Entrelazado y={56} alto={60} desplaz={f} /></svg>
        <div style={{ position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 92, color: C.crema, textShadow: `0 5px 0 ${C.negro}` }}>Who is {nombre[0] + nombre.slice(1).toLowerCase()}?</div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 1440, width: 1080, height: 480, background: `linear-gradient(#22384D, ${C.negro})` }}>
        <svg width={1080} height={110} viewBox="0 0 1080 110" style={{ position: 'absolute', top: 0 }}><Entrelazado y={12} alto={84} desplaz={f} paso={150} /></svg>
        <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 150, letterSpacing: 18, color: C.crema, textShadow: `0 6px 0 ${C.purpura}` }}>{nombre}</div>
        <div style={{ position: 'absolute', top: 310, width: '100%', textAlign: 'center', fontFamily: TEXTO, fontSize: 44, color: '#FFF8EA' }}>{EPITETO[base]}</div>
        <div style={{ position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 36, letterSpacing: 4, color: C.crema }}>MYTHS ON CLAY</div>
      </div>
    </AbsoluteFill>
  );
};

/** Momento de historia: Loki le susurra a Odín mientras Thor sostiene el martillo. */
const escHistoria = (v: string): Escena => ({
  id: 'historia' + v, fondo: 'salon', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    { id: 'odin', como: `odin_${v}`, x: 640, escala: 1.15, mira: 'der', props: { brazoAtras: [10, 10], cabeza: 4 } },
    { id: 'loki', como: `loki_${v}`, x: 450, escala: 1.08, mira: 'der', props: { inclinar: 14, brazo: [40, 130], cabeza: -8 } },
    { id: 'thor', como: `thor_${v}`, x: 1420, escala: 1.12, mira: 'izq', props: { expresion: 'enojo' } },
  ],
} as Escena);
const Historia: React.FC<{ v: string }> = ({ v }) => { aplicarTema('nordicas'); return <Motor esc={escHistoria(v)} />; };

/** Fila grande de los tres de una versión (para mirar detalles). */
const Fila: React.FC<{ v: string }> = ({ v }) => {
  aplicarTema('nordicas');
  const sfx = v === 'hoy' ? '' : '_' + v;
  return <Motor esc={{ id: 'fila' + v, fondo: 'nieve', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true, actores: ['thor', 'odin', 'loki'].map((c, i) => ({ id: c, como: c + sfx, x: 480 + i * 480, escala: 1.25 })) } as Escena} />;
};

registerRoot(() => (
  <>
    <Composition id="n-comparacion" component={Comparacion} durationInFrames={400} fps={24} width={1920} height={1080} />
    <Composition id="n-vertical" component={Vertical} durationInFrames={400} fps={24} width={1080} height={1920} defaultProps={{ clave: 'thor_muneco' }} />
    <Composition id="n-escena" component={Historia} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ v: 'muneco' }} />
    <Composition id="n-fila" component={Fila} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ v: 'muneco' }} />
  </>
));
