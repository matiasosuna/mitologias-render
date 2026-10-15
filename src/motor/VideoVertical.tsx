// Versión vertical (1080×1920) de un episodio para Reels: misma voz, subtítulos y tiempos que el horizontal, pero
// con una puesta en escena PROPIA del formato alto (no un recorte ni un zoom): cada escena tiene un encuadre fijo con
// todos sus actores juntos dentro del cuadro (ver EscenaVertical.tsx y puestaVertical.ts), subtítulos grandes, la portada vertical al principio y un cierre corto.
// No gasta créditos: reusa el audio y el timeline.
import React from 'react';
import { AbsoluteFill, Audio, Freeze, Img, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { C, TITULO, TEXTO, ap, cl, TEMA, aplicarTema, CalidadHD, ModoVertical, FranjaKapa, FranjaCuentas, Bloques, Entrelazado, FrisoPalmetas } from '../comun/vasija';
import { EscenaVerticalNativa } from './EscenaVertical';
import { FranjaCodice } from '../comun/codice';
import { FranjaPahari, DEGRADE_PAHARI } from '../comun/pahari';
import { FranjaKamasan } from '../comun/kamasan';
import { FranjaMaori } from '../comun/kowhaiwhai';
import type { GuionVisual, Timeline } from './tipos';

const NOMBRE: Record<string, string> = { vasija: 'GREEK MYTHOLOGY', runas: 'NORSE MYTHOLOGY', papiro: 'EGYPTIAN MYTHOLOGY', kapa: 'HAWAIIAN MYTHOLOGY', pintado: 'NATIVE AMERICAN MYTHOLOGY', codice: 'AZTEC MYTHOLOGY', pahari: 'HINDU MYTHOLOGY', kowhaiwhai: 'MĀORI MYTHOLOGY', kamasan: 'BALINESE MYTHOLOGY' };
/** Guarda decorativa del tema (svg de 1080×80), animada con `f`. */
export const franjaVertical = (t: string, f: number) => t === 'pahari' ? <FranjaPahari y={8} alto={44} desplaz={f} tipo="flores" ancho={1080} /> : t === 'kamasan' ? <FranjaKamasan y={6} alto={52} desplaz={f} tipo="awan" ancho={1080} /> : t === 'kowhaiwhai' ? <FranjaMaori y={6} alto={52} desplaz={f} tipo="koru" ancho={1080} /> : t === 'codice' ? <FranjaCodice y={8} alto={44} desplaz={f} tipo="xical" ancho={1080} /> : t === 'pintado' ? <FranjaCuentas y={10} alto={40} desplaz={f} tipo="escalones" /> : t === 'kapa' ? <FranjaKapa y={10} alto={36} desplaz={f} tipo="rombos" /> : t === 'papiro' ? <Bloques y={10} alto={30} desplaz={f} /> : t === 'runas' ? <Entrelazado y={6} alto={60} desplaz={f} paso={150} /> : <FrisoPalmetas y={6} desplaz={f} />;
export const CIERRE_VERTICAL = 3; // segundos del cierre (en lugar de los 12 s de pantalla final de YouTube)
const SUBS = 1470;
/** Degradé de fondo del formato vertical según el tema. */
export const fondoVertical = (t: string) => t === 'pahari' ? DEGRADE_PAHARI : t === 'kamasan' ? 'linear-gradient(#7A2418, #1E1612)' : t === 'kowhaiwhai' ? 'linear-gradient(#6E1610, #15100E)' : t === 'codice' ? 'linear-gradient(#6E2A1A, #1A1311)' : t === 'pintado' ? 'linear-gradient(#5A3820, #1C1612)' : t === 'kapa' ? 'linear-gradient(#4A2C16, #1A1410)' : t === 'papiro' ? 'linear-gradient(#3A2A1C, #1D1712)' : t === 'runas' ? `linear-gradient(#22384D, ${C.negro})` : `linear-gradient(${C.barro}, ${C.barroOscuro})`;

export const VideoVertical: React.FC<{ guion: GuionVisual; timeline: Timeline; portada?: string }> = ({ guion, timeline, portada }) => {
  aplicarTema(guion.serie);
  const f = useCurrentFrame();
  const t = TEMA.nombre, fps = timeline.fps;
  const finHistoria = timeline.total - timeline.outroFrames, total = finHistoria + CIERRE_VERTICAL * fps;
  const esc = timeline.escenas.find((e) => f >= e.from && f < e.from + e.durationInFrames);
  const frase = esc?.frases.find((fr) => f - esc.from >= fr.from && f - esc.from < fr.from + fr.dur + 8);
  const enIntro = f < timeline.introFrames, enCierre = f >= finHistoria;
  const fondo = fondoVertical(t);
  const franja = franjaVertical(t, f);
  return (
    <CalidadHD.Provider value={guion.hd !== false}>
      <ModoVertical.Provider value={true}>
        <AbsoluteFill style={{ backgroundColor: C.negro }}>
          <Audio src={staticFile(TEMA.musica)} volume={(fr) => interpolate(fr, [0, timeline.introFrames, total - 30, total], [0.45, 0.18, 0.18, 0], cl)} />
          {timeline.escenas.map((e, i) => (
            <Sequence key={e.id} from={e.from} durationInFrames={e.durationInFrames}>
              {e.frases.map((fr, j) => fr.audio.en ? <Sequence key={j} from={fr.from} durationInFrames={fr.dur + 6}><Audio src={staticFile(fr.audio.en!)} /></Sequence> : null)}
              <EscenaVerticalNativa esc={guion.escenas[i]} tl={e} />
            </Sequence>
          ))}
          {/* cabecera chica: mitología y episodio */}
          {!enIntro && !enCierre && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 230, background: 'linear-gradient(rgba(10,7,5,.75), rgba(10,7,5,0))', textAlign: 'center', fontFamily: TITULO, color: '#FFF4E0' }}>
              <div style={{ marginTop: 60, fontSize: 34, fontWeight: 700, letterSpacing: 8, textShadow: '0 2px 6px #000' }}>{guion.especial ? `${(guion.especial.nombre.en ?? guion.especial.nombre.es).toUpperCase()}${guion.especial.parte ? ` · PART ${guion.especial.parte}` : ''}` : `${NOMBRE[t]} · EP ${Number(guion.numero)}`}</div>
              <div style={{ marginTop: 6, fontSize: 30, letterSpacing: 3, opacity: 0.9, textShadow: '0 2px 6px #000' }}>{(guion.titulo.en ?? guion.titulo.es).toUpperCase()}</div>
            </div>
          )}
          {/* subtítulos grandes */}
          {!enIntro && !enCierre && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: SUBS, bottom: 0, background: fondo }}>
              <svg width={1080} height={80} viewBox="0 0 1080 80" style={{ position: 'absolute', top: 0 }}>{franja}</svg>
              <div style={{ position: 'absolute', top: 100, left: 56, right: 56, textAlign: 'center', fontFamily: TEXTO, fontWeight: 500, fontSize: 56, lineHeight: 1.22, color: '#FFF8EA', textShadow: `0 3px 0 ${C.negro}, 0 0 14px rgba(0,0,0,.6)` }}>{frase?.texto.en ?? ''}</div>
              <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: '#FFF4E0', opacity: 0.7 }}>MYTHS ON CLAY</div>
            </div>
          )}
          {/* portada al principio */}
          {enIntro && (
            <AbsoluteFill style={{ background: fondo, opacity: interpolate(f, [timeline.introFrames - 10, timeline.introFrames], [1, 0], cl) }}>
              {portada && <Img src={staticFile(portada)} style={{ position: 'absolute', top: 285, left: 0, width: 1080, height: 1350 }} />}
            </AbsoluteFill>
          )}
          {/* cierre corto */}
          {enCierre && (
            <AbsoluteFill style={{ background: fondo, justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontFamily: TITULO, color: '#FFF4E0', opacity: ap(f, finHistoria, 10) }}>
              <div style={{ fontSize: 40, letterSpacing: 10, opacity: 0.8 }}>{NOMBRE[t]}</div>
              <div style={{ fontSize: 46, letterSpacing: 6, marginTop: 70 }}>NEXT EPISODE</div>
              <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, margin: '24px 60px 0' }}>{(guion.siguiente?.en ?? guion.siguiente?.es ?? '').toUpperCase()}</div>
              <div style={{ fontSize: 40, marginTop: 90, letterSpacing: 4 }}>Follow @mythsonclay</div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      </ModoVertical.Provider>
    </CalidadHD.Provider>
  );
};

// Episodio vertical en PARTES de menos de 3 min (Instagram casi no recomienda Reels más largos a quien no te sigue).
// Cada parte abre con ~2 s de cartel GANCHO (el título curioso del episodio, de titulos.json, por inputProps `gancho`),
// muestra el tramo [desde, hasta) del vertical completo con "PART n OF de" arriba y, si no es la última parte,
// termina con 2,5 s de cartel "TO BE CONTINUED · PART n+1" sobre el último cuadro congelado.
export const CARTEL_PARTE = 2.5;
export const GANCHO_PARTE = 2; // segundos del cartel gancho del principio
/** Cuadros del cartel gancho (0 si la parte no trae gancho). */
export const framesGancho = (fps: number, gancho?: string) => (gancho ? Math.round(GANCHO_PARTE * fps) : 0);
type PropsParte = { guion: GuionVisual; timeline: Timeline; portada?: string; desde: number; hasta: number; n: number; de: number; gancho?: string };

const Pastilla: React.FC<{ n: number; de: number }> = ({ n, de }) => (
  <span style={{ display: 'inline-block', padding: '8px 26px', borderRadius: 40, background: 'rgba(10,7,5,.65)', color: '#FFF4E0', fontSize: 30, fontWeight: 700, letterSpacing: 6, fontFamily: TITULO }}>PART {n} OF {de}</span>
);

/** Cartel gancho: el título curioso grande sobre el degradé del tema, con sus guardas. */
const CartelGancho: React.FC<PropsParte & { dur: number }> = ({ n, de, gancho = '', dur }) => {
  const f = useCurrentFrame();
  const t = TEMA.nombre;
  const tam = gancho.length <= 28 ? 112 : gancho.length <= 45 ? 96 : 80;
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [dur - 6, dur], [1, 0], cl) }}>
      <AbsoluteFill style={{ background: fondoVertical(t) }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontFamily: TITULO, color: '#FFF4E0' }}>
        <div style={{ fontSize: 38, letterSpacing: 10, opacity: 0.85 * ap(f, 0, 8) }}>{NOMBRE[t]}</div>
        <svg width={1080} height={80} viewBox="0 0 1080 80" style={{ marginTop: 30, opacity: ap(f, 0, 8) }}>{franjaVertical(t, f)}</svg>
        <div style={{ margin: '44px 70px 0', fontSize: tam, fontWeight: 700, lineHeight: 1.08, textShadow: `0 5px 0 ${C.negro}, 0 0 24px rgba(0,0,0,.55)`, opacity: ap(f, 2, 8), transform: `scale(${0.88 + ap(f, 2, 10) * 0.12})` }}>{gancho}</div>
        <svg width={1080} height={80} viewBox="0 0 1080 80" style={{ marginTop: 44, opacity: ap(f, 0, 8) }}>{franjaVertical(t, -f)}</svg>
        {de > 1 && <div style={{ marginTop: 40, opacity: ap(f, 6, 8) }}><Pastilla n={n} de={de} /></div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** El tramo del episodio (sin el gancho), con la pastilla de parte y el cartel final. */
const TramoParte: React.FC<PropsParte> = ({ guion, timeline, portada, desde, hasta, n, de }) => {
  const f = useCurrentFrame();
  const largo = hasta - desde;
  return (
    <AbsoluteFill style={{ background: '#0a0705' }}>
      <Sequence from={-desde} durationInFrames={hasta}>
        <VideoVertical guion={guion} timeline={timeline} portada={portada} />
      </Sequence>
      {f >= largo && (
        <Freeze frame={hasta - 1}>
          <VideoVertical guion={guion} timeline={timeline} portada={portada} />
        </Freeze>
      )}
      {de > 1 && <div style={{ position: 'absolute', top: 178, left: 0, right: 0, textAlign: 'center' }}><Pastilla n={n} de={de} /></div>}
      {n < de && f >= largo && (
        <AbsoluteFill style={{ background: 'rgba(10,7,5,.8)', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontFamily: TITULO, color: '#FFF4E0', opacity: interpolate(f, [largo, largo + 8], [0, 1], cl) }}>
          <div style={{ fontSize: 44, letterSpacing: 10, opacity: 0.85 }}>TO BE CONTINUED</div>
          <div style={{ marginTop: 28, fontSize: 104, fontWeight: 700, letterSpacing: 4, transform: `scale(${0.9 + ap(f, largo + 2, 10) * 0.1})` }}>PART {n + 1}</div>
          <div style={{ marginTop: 22, fontSize: 40, letterSpacing: 6 }}>IS NEXT ON @MYTHSONCLAY</div>
          <div style={{ marginTop: 60, fontSize: 36, letterSpacing: 4, opacity: 0.85 }}>FOLLOW SO YOU DON&apos;T MISS IT ▶</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const ParteVertical: React.FC<PropsParte> = (props) => {
  aplicarTema(props.guion.serie);
  const g0 = framesGancho(props.timeline.fps, props.gancho);
  return (
    <AbsoluteFill style={{ background: '#0a0705' }}>
      <Sequence from={g0}><TramoParte {...props} /></Sequence>
      {g0 > 0 && (
        <Sequence durationInFrames={g0}>
          <CartelGancho {...props} dur={g0} />
          <Audio src={staticFile(TEMA.musica)} volume={(fr) => interpolate(fr, [0, 6, g0 - 6, g0], [0, 0.4, 0.4, 0.2], cl)} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
