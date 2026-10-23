// Versión vertical (1080×1920) de un episodio para Reels: misma voz y subtítulos que el horizontal (a ritmo rápido de Short, timeline
// de lib/vertical-rapido.mjs por inputProps), pero
// con una puesta en escena PROPIA del formato alto (no un recorte ni un zoom): cada escena tiene un encuadre fijo con
// todos sus actores juntos dentro del cuadro (ver EscenaVertical.tsx y puestaVertical.ts), subtítulos grandes, la portada vertical al principio y un cierre corto.
// No gasta créditos: reusa el audio de cada frase.
import React from 'react';
import { AbsoluteFill, Audio, Freeze, Img, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { C, TITULO, TEXTO, ap, cl, TEMA, aplicarTema, CalidadHD, ModoVertical, FranjaKapa, FranjaCuentas, Bloques, Entrelazado, FrisoPalmetas, marcaCanal } from '../comun/vasija';
import { FranjaNatural, DEGRADE_NATURAL } from '../comun/natural';
import { EscenaVerticalNativa } from './EscenaVertical';
import { FranjaCodice } from '../comun/codice';
import { FranjaPahari, DEGRADE_PAHARI } from '../comun/pahari';
import { FranjaKamasan } from '../comun/kamasan';
import { FranjaMaori } from '../comun/kowhaiwhai';
import { useFraseBiblia, NumeroVersiculo, TextoLeyenda, Karaoke, CREMA, DORADO } from './Leyenda';
import { palabras, palabraEn } from '../../lib/karaoke.mjs';
import { KJV_LIBRO, capituloDe } from './kjv';
import { TextoGancho, TextoGanchoSeq, ZoomLento, VeloGancho } from './Gancho';
import type { GuionVisual, Timeline, TramoMarco } from './tipos';

const NOMBRE: Record<string, string> = { vasija: 'GREEK MYTHOLOGY', runas: 'NORSE MYTHOLOGY', papiro: 'EGYPTIAN MYTHOLOGY', kapa: 'HAWAIIAN MYTHOLOGY', pintado: 'NATIVE AMERICAN MYTHOLOGY', codice: 'AZTEC MYTHOLOGY', pahari: 'HINDU MYTHOLOGY', kowhaiwhai: 'MĀORI MYTHOLOGY', kamasan: 'BALINESE MYTHOLOGY', natural: 'THE BIBLE' };
/** Guarda decorativa del tema (svg de 1080×80), animada con `f`. */
export const franjaVertical = (t: string, f: number) => t === 'natural' ? <FranjaNatural y={10} alto={30} ancho={1080} /> : t === 'pahari' ? <FranjaPahari y={8} alto={44} desplaz={f} tipo="flores" ancho={1080} /> : t === 'kamasan' ? <FranjaKamasan y={6} alto={52} desplaz={f} tipo="awan" ancho={1080} /> : t === 'kowhaiwhai' ? <FranjaMaori y={6} alto={52} desplaz={f} tipo="koru" ancho={1080} /> : t === 'codice' ? <FranjaCodice y={8} alto={44} desplaz={f} tipo="xical" ancho={1080} /> : t === 'pintado' ? <FranjaCuentas y={10} alto={40} desplaz={f} tipo="escalones" /> : t === 'kapa' ? <FranjaKapa y={10} alto={36} desplaz={f} tipo="rombos" /> : t === 'papiro' ? <Bloques y={10} alto={30} desplaz={f} /> : t === 'runas' ? <Entrelazado y={6} alto={60} desplaz={f} paso={150} /> : <FrisoPalmetas y={6} desplaz={f} />;
export const CIERRE_VERTICAL = 3; // segundos del cierre (en lugar de los 12 s de pantalla final de YouTube)
const SUBS = 1470;
const GANCHO_TOP = 470; // texto del gancho: arriba del medio, debajo de la pastilla de parte
/** Degradé de fondo del formato vertical según el tema. */
export const fondoVertical = (t: string) => t === 'natural' ? DEGRADE_NATURAL : t === 'pahari' ? DEGRADE_PAHARI : t === 'kamasan' ? 'linear-gradient(#7A2418, #1E1612)' : t === 'kowhaiwhai' ? 'linear-gradient(#6E1610, #15100E)' : t === 'codice' ? 'linear-gradient(#6E2A1A, #1A1311)' : t === 'pintado' ? 'linear-gradient(#5A3820, #1C1612)' : t === 'kapa' ? 'linear-gradient(#4A2C16, #1A1410)' : t === 'papiro' ? 'linear-gradient(#3A2A1C, #1D1712)' : t === 'runas' ? `linear-gradient(#22384D, ${C.negro})` : `linear-gradient(${C.barro}, ${C.barroOscuro})`;

export const VideoVertical: React.FC<{ guion: GuionVisual; timeline: Timeline; portada?: string }> = ({ guion, timeline, portada }) => {
  aplicarTema(guion.serie);
  const f = useCurrentFrame();
  const t = TEMA.nombre, fps = timeline.fps;
  const finHistoria = timeline.total - timeline.outroFrames, total = finHistoria + CIERRE_VERTICAL * fps;
  const esc = timeline.escenas.find((e) => f >= e.from && f < e.from + e.durationInFrames);
  // el subtítulo queda 8 cuadros más, salvo que ya arranque la frase siguiente (ritmo rápido: 3 cuadros entre frases)
  const frase = esc?.frases.find((fr, j) => f - esc.from >= fr.from && f - esc.from < Math.min(fr.from + fr.dur + 8, esc.frases[j + 1]?.from ?? Infinity));
  const biblia = useFraseBiblia(guion, timeline); // Learn Bible 777: número de versículo antes de la frase
  const gancho = timeline.escenas[0]?.gancho ? timeline.escenas[0] : null; // gancho en el cuadro 0 (lib/marco.mjs verticalConGancho)
  const enGancho = !!gancho && f < gancho.durationInFrames;
  const enIntro = f < timeline.introFrames || enGancho, enCierre = f >= finHistoria;
  const fondo = fondoVertical(t);
  const franja = franjaVertical(t, f);
  return (
    <CalidadHD.Provider value={guion.hd !== false}>
      <ModoVertical.Provider value={true}>
        <AbsoluteFill style={{ backgroundColor: C.negro }}>
          <Audio src={staticFile(TEMA.musica)} volume={(fr) => (gancho ? interpolate(fr, [0, gancho.durationInFrames, total - 30, total], [0.1, 0.18, 0.18, 0], cl) : interpolate(fr, [0, timeline.introFrames, total - 30, total], [0.45, 0.18, 0.18, 0], cl))} />
          {timeline.escenas.map((e, i) => (
            <Sequence key={e.id} from={e.from} durationInFrames={e.durationInFrames}>
              {e.frases.map((fr, j) => fr.audio.en ? <Sequence key={j} from={fr.from} durationInFrames={fr.dur + 6}><Audio src={staticFile(fr.audio.en!)} /></Sequence> : null)}
              {e.gancho ? <ZoomLento dur={e.durationInFrames}><EscenaVerticalNativa esc={guion.escenas[i]} tl={e} /></ZoomLento> : <EscenaVerticalNativa esc={guion.escenas[i]} tl={e} />}
            </Sequence>
          ))}
          {gancho && (
            <Sequence durationInFrames={gancho.durationInFrames}>
              <VeloGancho vertical />
              <TextoGanchoSeq frases={gancho.frases} top={GANCHO_TOP} ancho={960} size={92} chars={18} renglones={4} fin={gancho.durationInFrames} />
            </Sequence>
          )}
          {/* cabecera chica: mitología y episodio */}
          {!enIntro && !enCierre && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 230, background: 'linear-gradient(rgba(10,7,5,.75), rgba(10,7,5,0))', textAlign: 'center', fontFamily: TITULO, color: '#FFF4E0' }}>
              <div style={{ marginTop: 60, fontSize: 34, fontWeight: 700, letterSpacing: 8, textShadow: '0 2px 6px #000' }}>{t === 'natural' && KJV_LIBRO[guion.id] ? `${KJV_LIBRO[guion.id].toUpperCase()} · CHAPTER ${capituloDe(guion.id)}` : guion.especial ? `${(guion.especial.nombre.en ?? guion.especial.nombre.es).toUpperCase()}${guion.especial.parte ? ` · PART ${guion.especial.parte}` : ''}` : `${NOMBRE[t]} · EP ${Number(guion.numero)}`}</div>
              <div style={{ marginTop: 6, fontSize: 30, letterSpacing: 3, opacity: 0.9, textShadow: '0 2px 6px #000' }}>{(guion.titulo.en ?? guion.titulo.es).toUpperCase()}</div>
            </div>
          )}
          {/* subtítulos grandes */}
          {!enIntro && !enCierre && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: SUBS, bottom: 0, background: fondo }}>
              <svg width={1080} height={80} viewBox="0 0 1080 80" style={{ position: 'absolute', top: 0 }}>{franja}</svg>
              <div style={{ position: 'absolute', top: 100, left: 56, right: 56, textAlign: 'center', fontFamily: TEXTO, fontWeight: 500, fontSize: 56, lineHeight: 1.22, color: '#FFF8EA', textShadow: `0 3px 0 ${C.negro}, 0 0 14px rgba(0,0,0,.6)` }}>{t === 'natural' && <NumeroVersiculo r={biblia?.ref ?? null} size={56} />}{t === 'natural' && biblia ? <Karaoke ws={palabras(biblia.texto)} k={palabraEn(biblia.texto, biblia.dur, f - biblia.desde)} color={CREMA} actual={DORADO} /> : frase?.texto.en ?? ''}</div>
              <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: '#FFF4E0', opacity: 0.7 }}>{marcaCanal()}</div>
            </div>
          )}
          {/* portada al principio */}
          {enIntro && !enGancho && (
            <AbsoluteFill style={{ background: fondo, opacity: interpolate(f, [timeline.introFrames - 10, timeline.introFrames], [1, 0], cl) }}>
              {/* Learn Bible: nunca la portada de Myths; la de pergamino */}
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
// Cada parte abre con ~2 s de cartel GANCHO (el título del capítulo, de titulos.json, por inputProps `gancho`),
// muestra el tramo [desde, hasta) del vertical completo con "PART n OF de" arriba y, si no es la última parte,
// termina con 2,5 s de cartel "TO BE CONTINUED · PART n+1" sobre el último cuadro congelado.
export const CARTEL_PARTE = 2.5;
export const GANCHO_PARTE = 2; // segundos del cartel gancho del principio
/** Cuadros del cartel gancho (0 si la parte no trae gancho). */
export const framesGancho = (fps: number, gancho?: string) => (gancho ? Math.round(GANCHO_PARTE * fps) : 0);
/** Learn Bible 777 (lib/marco.mjs): tramo narrado al principio (gancho + invitación) y al final (invitación final) de la parte. */
export type MarcoParte = { apertura?: TramoMarco | null; final?: TramoMarco | null };
type PropsParte = { guion: GuionVisual; timeline: Timeline; portada?: string; desde: number; hasta: number; n: number; de: number; gancho?: string; marco?: MarcoParte };
/** Cuadros del principio de la parte: el marco narrado si lo hay (reemplaza al cartel gancho); si no, el cartel. */
export const framesApertura = (fps: number, p: { gancho?: string; marco?: MarcoParte }) => p.marco?.apertura?.durationInFrames ?? framesGancho(fps, p.gancho);
/** Duración total de una parte: apertura + tramo + invitación final + cartel "TO BE CONTINUED" (salvo la última). */
export const duracionParte = (fps: number, p: { desde: number; hasta: number; n: number; de: number; gancho?: string; marco?: MarcoParte }) =>
  framesApertura(fps, p) + p.hasta - p.desde + (p.marco?.final?.durationInFrames ?? 0) + (p.n < p.de ? Math.round(CARTEL_PARTE * fps) : 0);

const Pastilla: React.FC<{ n: number; de: number }> = ({ n, de }) => (
  <span style={{ display: 'inline-block', padding: '8px 26px', borderRadius: 40, background: 'rgba(10,7,5,.65)', color: '#FFF4E0', fontSize: 30, fontWeight: 700, letterSpacing: 6, fontFamily: TITULO }}>PART {n} OF {de}</span>
);

/** Cartel gancho: el título del capítulo grande sobre el degradé del tema, con sus guardas. */
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

/** La escena del vertical en el cuadro `cuadro` del episodio completo, quieta y sin subtítulos ni cabecera (fondo del marco). */
const EscenaQuietaVertical: React.FC<{ guion: GuionVisual; timeline: Timeline; cuadro: number }> = ({ guion, timeline, cuadro }) => {
  const c = Math.min(Math.max(cuadro, timeline.introFrames), timeline.total - timeline.outroFrames - 1);
  const i = timeline.escenas.findIndex((e) => c >= e.from && c < e.from + e.durationInFrames);
  if (i < 0) return null;
  const e = timeline.escenas[i], ult = e.frases[e.frases.length - 1];
  const local = Math.min(c - e.from, ult ? ult.from + ult.dur : Infinity); // no en la salida (la escena ya se desvanece)
  return <Freeze frame={local}><EscenaVerticalNativa esc={{ ...guion.escenas[i], rotulos: [] }} tl={e} /></Freeze>;
};

/** Marco de Learn Bible en una parte: la escena quieta, el texto con la letra del versículo arriba a la izquierda (sin referencia),
 *  la voz y la música (siguiendo la pista desde `musicaDesde`). */
const MarcoVertical: React.FC<{ guion: GuionVisual; timeline: Timeline; tramo: TramoMarco; cuadro: number; n: number; de: number; musicaDesde: number; cierra?: boolean }> = ({ guion, timeline, tramo, cuadro, n, de, musicaDesde, cierra }) => {
  const f = useCurrentFrame();
  const dur = tramo.durationInFrames;
  const hasta = (j: number) => Math.min(tramo.frases[j].from + tramo.frases[j].dur + 8, tramo.frases[j + 1]?.from ?? Infinity);
  const j = tramo.frases.findIndex((fr, k) => f >= fr.from && f < hasta(k));
  const fr = tramo.frases[j];
  return (
    <CalidadHD.Provider value={guion.hd !== false}>
      <ModoVertical.Provider value={true}>
        <AbsoluteFill style={{ background: '#0a0705', opacity: cierra ? 1 : interpolate(f, [dur - 6, dur], [1, 0.4], cl) }}>
          <EscenaQuietaVertical guion={guion} timeline={timeline} cuadro={cuadro} />
          <AbsoluteFill style={{ background: 'linear-gradient(rgba(10,7,5,.8), rgba(10,7,5,.45) 40%, rgba(10,7,5,0) 65%)' }} />
          {de > 1 && <div style={{ position: 'absolute', top: 178, left: 0, right: 0, textAlign: 'center' }}><Pastilla n={n} de={de} /></div>}
          {fr && <TextoLeyenda texto={fr.texto.en ?? ''} desde={fr.from} hasta={hasta(j)} left={72} top={300} width={936} size={64} />}
          {tramo.frases.map((x, k) => x.audio.en ? <Sequence key={k} from={x.from} durationInFrames={x.dur + 6}><Audio src={staticFile(x.audio.en)} /></Sequence> : null)}
          <Audio src={staticFile(TEMA.musica)} trimBefore={musicaDesde} volume={(q) => interpolate(q, [0, 8, dur - 8, dur], [cierra ? 0.18 : 0.1, 0.18, 0.18, cierra ? 0 : 0.18], cl)} />
        </AbsoluteFill>
      </ModoVertical.Provider>
    </CalidadHD.Provider>
  );
};

/** Gancho narrado al principio de la parte (lib/marco.mjs): voz desde el cuadro 0, la escena donde arranca la parte con
 *  zoom lento, el texto grande (Gancho.tsx) y la música baja. Reemplaza al cartel gancho; sin pergamino. */
const GanchoParte: React.FC<PropsParte & { tramo: TramoMarco; dur: number }> = ({ guion, timeline, desde, n, de, tramo, dur }) => {
  const f = useCurrentFrame();
  // un cuadro donde la escena ya está armada: el final de su 2.ª frase (o desde, si la parte arranca más adelante)
  const e = timeline.escenas.find((x) => desde >= x.from && desde < x.from + x.durationInFrames);
  const fr2 = e?.frases[Math.min(1, (e?.frases.length ?? 1) - 1)];
  const cuadro = e && fr2 ? Math.max(desde, e.from + fr2.from + fr2.dur) : desde;
  return (
    <CalidadHD.Provider value={guion.hd !== false}>
      <ModoVertical.Provider value={true}>
        <AbsoluteFill style={{ background: '#0a0705', opacity: interpolate(f, [dur - 5, dur], [1, 0.6], cl) }}>
          <ZoomLento dur={dur}><EscenaQuietaVertical guion={guion} timeline={timeline} cuadro={cuadro} /></ZoomLento>
          <VeloGancho vertical />
          {de > 1 && <div style={{ position: 'absolute', top: 178, left: 0, right: 0, textAlign: 'center' }}><Pastilla n={n} de={de} /></div>}
          <TextoGancho frases={tramo.frases} f={f} top={GANCHO_TOP} ancho={960} size={92} chars={18} renglones={4} fin={dur} />
          {tramo.frases.map((x, k) => x.audio.en ? <Sequence key={k} from={x.from} durationInFrames={x.dur + 6}><Audio src={staticFile(x.audio.en)} /></Sequence> : null)}
          <Audio src={staticFile(TEMA.musica)} trimBefore={desde} volume={(q) => interpolate(q, [0, dur], [0.1, 0.18], cl)} />
        </AbsoluteFill>
      </ModoVertical.Provider>
    </CalidadHD.Provider>
  );
};

/** El tramo del episodio (sin el gancho), con la pastilla de parte y el cartel final. */
const TramoParte: React.FC<PropsParte> = ({ guion, timeline, portada, desde, hasta, n, de, marco }) => {
  const f = useCurrentFrame();
  const largo = hasta - desde;
  const fin = marco?.final ?? null, F = fin?.durationInFrames ?? 0; // invitación final (marco), antes del cartel
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
      {fin && f >= largo && f < largo + F && (
        <Sequence from={largo} durationInFrames={F}>
          <MarcoVertical guion={guion} timeline={timeline} tramo={fin} cuadro={hasta - 1} n={n} de={de} musicaDesde={hasta} cierra={n === de} />
        </Sequence>
      )}
      {n < de && f >= largo + F && (
        <AbsoluteFill style={{ background: 'rgba(10,7,5,.8)', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontFamily: TITULO, color: '#FFF4E0', opacity: interpolate(f, [largo + F, largo + F + 8], [0, 1], cl) }}>
          <div style={{ fontSize: 44, letterSpacing: 10, opacity: 0.85 }}>TO BE CONTINUED</div>
          <div style={{ marginTop: 28, fontSize: 104, fontWeight: 700, letterSpacing: 4, transform: `scale(${0.9 + ap(f, largo + F + 2, 10) * 0.1})` }}>PART {n + 1}</div>
          <div style={{ marginTop: 22, fontSize: 40, letterSpacing: 6 }}>IS NEXT ON @MYTHSONCLAY</div>
          <div style={{ marginTop: 60, fontSize: 36, letterSpacing: 4, opacity: 0.85 }}>FOLLOW SO YOU DON&apos;T MISS IT ▶</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const ParteVertical: React.FC<PropsParte> = (props) => {
  aplicarTema(props.guion.serie);
  const ap0 = props.marco?.apertura ?? null;
  const g0 = framesApertura(props.timeline.fps, props);
  return (
    <AbsoluteFill style={{ background: '#0a0705' }}>
      <Sequence from={g0}><TramoParte {...props} /></Sequence>
      {ap0 && (
        <Sequence durationInFrames={g0}>
          <GanchoParte {...props} tramo={ap0} dur={g0} />
        </Sequence>
      )}
      {!ap0 && g0 > 0 && (
        <Sequence durationInFrames={g0}>
          <CartelGancho {...props} dur={g0} />
          <Audio src={staticFile(TEMA.musica)} volume={(fr) => interpolate(fr, [0, 6, g0 - 6, g0], [0, 0.4, 0.4, 0.2], cl)} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
