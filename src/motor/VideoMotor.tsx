// Video completo desde el guion visual. Las imágenes son neutras al idioma (rótulos en griego);
// la voz y los subtítulos van aparte (pistas de audio y .srt por idioma).
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { C, TITULO, ap, cl, Guardas, TEMA, aplicarTema, TextoRunico, Jeroglificos, CalidadHD, marcaCanal } from '../comun/vasija';
import { Fondo, ElementoSVG } from './fondos';
import { EscenaMotor } from './Escena';
import { Miniatura } from '../comun/miniatura';
import type { GuionVisual, Timeline, Idioma } from './tipos';

const Portada: React.FC<{ g: GuionVisual; dur: number; idioma: Idioma }> = ({ g, dur, idioma }) => {
  const f = useCurrentFrame();
  const o = Math.min(ap(f, 0, 16), interpolate(f, [dur - 12, dur], [1, 0], cl));
  if (g.miniatura) {
    // Portada = miniatura (escalada de 1280×720 a 1920×1080), para poder elegirla con "Select from video".
    return (
      <AbsoluteFill style={{ opacity: Math.min(1, interpolate(f, [dur - 12, dur], [1, 0], cl)) }}>
        <div style={{ width: 1280, height: 720, transform: 'scale(1.5)', transformOrigin: '0 0', position: 'relative' }}>
          <Miniatura titulo={(g.titulo.en ?? g.titulo.es).toUpperCase()} numero={String(Number(g.numero))} heroe={g.miniatura.heroe} rival={g.miniatura.rival} serie={g.serie} etiqueta={g.especial ? `${g.especial.nombre.en ?? g.especial.nombre.es}${g.especial.parte ? ` · PART ${g.especial.parte}` : ''}`.toUpperCase() : undefined} />
        </div>
      </AbsoluteFill>
    );
  }
  if ((TEMA.nombre as string) === 'natural') {
    // Learn Bible 777: paisaje real al amanecer con la luz de Dios arriba (nunca una figura), título claro.
    return (
      <AbsoluteFill style={{ opacity: o, backgroundColor: C.negro }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <Fondo tipo="amanecer" f={f} astros={false} />
          <ElementoSVG tipo="luz_divina" x={960} y={170} s={1.1} f={f} props={{ intensidad: 0.9, largo: 760 }} />
          <rect x={0} y={0} width={1920} height={1080} fill={C.negro} opacity={0.18} />
          <Guardas desplaz={f * 0.6} />
        </svg>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: C.blanco, paddingBottom: 140, textShadow: '0 3px 14px rgba(20,16,12,0.75), 0 2px 0 rgba(20,16,12,0.6)' }}>
          <div style={{ fontFamily: TITULO, fontSize: 44, letterSpacing: 12, opacity: ap(f, 4, 16) }}>{g.tituloGriego}</div>
          <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 124, lineHeight: 1.05, margin: '18px 80px', transform: `scale(${0.94 + ap(f, 8, 24) * 0.06})`, opacity: ap(f, 8, 20) }}>{g.titulo[idioma] ?? g.titulo.es}</div>
        </AbsoluteFill>
        <div style={{ position: 'absolute', top: 985, left: 0, right: 0, textAlign: 'center', fontFamily: TITULO, fontSize: 40, letterSpacing: 12, color: C.crema, opacity: ap(f, 10, 16) }}>{marcaCanal()}</div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ opacity: o, backgroundColor: C.barro }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <radialGradient id="cieloP" cx="50%" cy="45%" r="75%"><stop offset="0%" stopColor={C.barroClaro} /><stop offset="100%" stopColor={C.barroOscuro} /></radialGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#cieloP)" />
        <Guardas desplaz={f * 0.6} />
        {TEMA.nombre === 'papiro' && <g opacity={ap(f, 4, 16)}><Jeroglificos x={960 - 12 * 34 / 2} y={270} n={12} color={C.negro} /></g>}
        {TEMA.nombre === 'runas' && <g opacity={ap(f, 4, 16)}><TextoRunico texto={g.tituloGriego} x={960 - g.tituloGriego.length * 24 * 1.6 / 2} y={300} esc={1.6} color={C.negro} w={5} /></g>}
      </svg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: TEMA.nombre !== 'vasija' ? C.negro : C.crema, paddingBottom: 120, textShadow: TEMA.nombre !== 'vasija' ? `0 3px 0 ${C.blanco}` : `0 4px 0 ${C.negro}` }}>
        <div style={{ fontFamily: TITULO, fontSize: 40, letterSpacing: 12, opacity: ap(f, 4, 16) }}>{TEMA.nombre === 'runas' ? `NORSE MYTHOLOGY · ${g.numero}` : TEMA.nombre === 'papiro' ? `EGYPTIAN MYTHOLOGY · ${g.numero}` : TEMA.nombre === 'kapa' ? `HAWAIIAN MYTHOLOGY · ${g.numero}` : TEMA.nombre === 'pintado' ? `NATIVE AMERICAN MYTHOLOGY · ${g.numero}` : TEMA.nombre === 'kowhaiwhai' ? `MĀORI MYTHOLOGY · ${g.numero}` : TEMA.nombre === 'kamasan' ? `BALINESE MYTHOLOGY · ${g.numero}` : TEMA.nombre === 'pahari' ? `HINDU MYTHOLOGY · ${g.numero}` : TEMA.nombre === 'codice' ? `AZTEC MYTHOLOGY · ${g.numero}` : `${g.tituloGriego} · ${g.numero}`}</div>
        <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 112, lineHeight: 1.05, margin: '16px 80px', transform: `scale(${0.94 + ap(f, 8, 24) * 0.06})`, opacity: ap(f, 8, 20) }}>{g.titulo[idioma] ?? g.titulo.es}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Pantalla final: marcos para los elementos de YouTube (video siguiente a la izquierda, suscribirse a la derecha). */
export const Final: React.FC<{ dur: number; siguiente?: string; etiqueta?: string }> = ({ dur, siguiente, etiqueta = 'NEXT EPISODE' }) => {
  const f = useCurrentFrame();
  const o = Math.min(ap(f, 0, 16), interpolate(f, [dur - 16, dur], [1, 0], cl));
  const runas = TEMA.nombre !== 'vasija'; // fondos claros (runas, papiro)
  return (
    <AbsoluteFill style={{ backgroundColor: C.barro, opacity: o }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs><radialGradient id="fin" cx="50%" cy="45%" r="75%"><stop offset="0%" stopColor={C.barroClaro} /><stop offset="100%" stopColor={C.barroOscuro} /></radialGradient></defs>
        <rect width={1920} height={1080} fill="url(#fin)" />
        <Guardas desplaz={f * 0.6} />
        {/* video siguiente: 16:9 a la izquierda (donde YouTube pone el elemento de video) */}
        <rect x={150} y={262} width={880} height={495} rx={10} fill={C.negro} stroke={C.purpura} strokeWidth={8} />
        <rect x={164} y={276} width={852} height={467} rx={6} fill="none" stroke={C.crema} strokeWidth={2} strokeDasharray="3 8" />
        {/* suscribirse: círculo a la derecha */}
        <circle cx={1450} cy={510} r={190} fill={C.negro} stroke={C.purpura} strokeWidth={8} />
        <circle cx={1450} cy={510} r={176} fill="none" stroke={C.crema} strokeWidth={2} strokeDasharray="3 8" />
      </svg>
      <AbsoluteFill style={{ fontFamily: TITULO, color: runas ? C.negro : C.crema, textShadow: runas ? `0 3px 0 ${C.blanco}` : `0 4px 0 ${C.negro}` }}>
        <div style={{ position: 'absolute', top: 160, left: 150, width: 880, textAlign: 'center', fontSize: 44, fontWeight: 700, letterSpacing: 6 }}>{etiqueta}</div>
        {siguiente && <div style={{ position: 'absolute', top: 480, left: 190, width: 800, textAlign: 'center', fontSize: 50, fontWeight: 700, lineHeight: 1.1, color: C.crema, textShadow: `0 3px 0 ${C.negro}`, opacity: 0.35 }}>{siguiente}</div>}
        <div style={{ position: 'absolute', top: 160, left: 1250, width: 400, textAlign: 'center', fontSize: 44, fontWeight: 700, letterSpacing: 6 }}>SUBSCRIBE</div>
        <div style={{ position: 'absolute', top: 985, left: 0, right: 0, textAlign: 'center', fontSize: 40, letterSpacing: 12, color: C.crema, textShadow: 'none' }}>{marcaCanal()}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const VideoMotor: React.FC<{ guion: GuionVisual; timeline: Timeline; idioma?: Idioma | null; imagen?: Idioma }> = ({ guion, timeline, idioma = null, imagen = 'en' }) => {
  aplicarTema(guion.serie);
  return (
  <CalidadHD.Provider value={guion.hd !== false}>
  <AbsoluteFill style={{ backgroundColor: C.negro }}>
    {idioma && <Audio src={staticFile(TEMA.musica)} volume={(fr) => interpolate(fr, [0, timeline.introFrames, timeline.total - 48, timeline.total], [0.45, 0.18, 0.18, 0], cl)} />}
    <Sequence durationInFrames={timeline.introFrames}><Portada g={guion} dur={timeline.introFrames} idioma={imagen} /></Sequence>
    {timeline.escenas.map((tl, i) => (
      <Sequence key={tl.id} from={tl.from} durationInFrames={tl.durationInFrames}>
        <EscenaMotor esc={guion.escenas[i]} tl={tl} idioma={imagen} />
        {idioma && tl.frases.map((fr, j) => fr.audio[idioma] ? <Sequence key={j} from={fr.from} durationInFrames={fr.dur + 6}><Audio src={staticFile(fr.audio[idioma]!)} /></Sequence> : null)}
      </Sequence>
    ))}
    <Sequence from={timeline.total - timeline.outroFrames}><Final dur={timeline.outroFrames} siguiente={guion.siguiente?.[imagen] ?? guion.siguiente?.es} /></Sequence>
  </AbsoluteFill>
  </CalidadHD.Provider>
  );
};

/** Cartel gancho (~2 s) que va ADELANTE del episodio largo, renderizado aparte y pegado con ffmpeg
 *  (scripts/gancho-horizontal.mjs): título curioso grande + "Norse Mythology · Season 1, Episode 13", estilo de la portada. */
export const GANCHO_HORIZONTAL = 2;
export const GanchoHorizontal: React.FC<{ serie?: string; gancho: string; linea?: string }> = ({ serie, gancho, linea }) => {
  aplicarTema(serie as GuionVisual['serie']);
  const f = useCurrentFrame();
  const claro = TEMA.nombre !== 'vasija';
  const tam = gancho.length <= 30 ? 124 : gancho.length <= 48 ? 108 : 92;
  return (
    <AbsoluteFill style={{ backgroundColor: C.barro }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs><radialGradient id="cieloG" cx="50%" cy="45%" r="75%"><stop offset="0%" stopColor={C.barroClaro} /><stop offset="100%" stopColor={C.barroOscuro} /></radialGradient></defs>
        <rect width={1920} height={1080} fill="url(#cieloG)" />
        <Guardas desplaz={f * 0.6} />
      </svg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingBottom: 120, fontFamily: TITULO, color: claro ? C.negro : C.crema, textShadow: claro ? `0 3px 0 ${C.blanco}` : `0 4px 0 ${C.negro}` }}>
        <div style={{ fontWeight: 700, fontSize: tam, lineHeight: 1.05, margin: '0 170px', opacity: ap(f, 0, 8), transform: `scale(${0.92 + ap(f, 0, 12) * 0.08})` }}>{gancho}</div>
        {linea && <div style={{ marginTop: 40, fontSize: 40, letterSpacing: 8, opacity: ap(f, 6, 10) }}>{linea.toUpperCase()}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
