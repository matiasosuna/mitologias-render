// Short vertical (1080×1920): un tramo de una escena del episodio, con gancho arriba,
// subtítulos grandes quemados abajo y la invitación a ver el episodio completo.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { C, TITULO, TEXTO, ap, cl, Lenguetas, Meandro, FrisoPalmetas, ARRIBA, TEMA, aplicarTema, TextoRunico, Entrelazado, Bloques, Jeroglificos, CalidadHD, FranjaKapa, FranjaCuentas } from '../comun/vasija';
import { EscenaMotor } from './Escena';
import { FranjaCodice } from '../comun/codice';
import { FranjaPahari, CabeceraPahari, DEGRADE_PAHARI, DEGRADE_PAHARI_ARRIBA } from '../comun/pahari';
import { FranjaKamasan } from '../comun/kamasan';
import { FranjaMaori } from '../comun/kowhaiwhai';
import type { GuionVisual, Timeline, Idioma } from './tipos';

export const tramoShort = (g: GuionVisual, tl: Timeline, n: number) => {
  const sh = g.shorts![n];
  const i = g.escenas.findIndex((e) => e.id === sh.escena);
  const et = tl.escenas[i];
  const a = et.frases[sh.desde], b = et.frases[sh.hasta];
  const desde = Math.max(0, a.from - 6), hasta = b.from + b.dur + 10;
  return { sh, i, et, desde, hasta, dur: hasta - desde + Math.round(tl.fps * 1.6) };
};

export const VideoShort: React.FC<{ guion: GuionVisual; timeline: Timeline; n: number; idioma?: Idioma }> = ({ guion, timeline, n, idioma = 'en' }) => {
  aplicarTema(guion.serie);
  const f = useCurrentFrame();
  const runas = TEMA.nombre !== 'vasija'; // bandas oscuras para contraste (runas, papiro)
  const papiro = TEMA.nombre === 'papiro';
  const kapa = TEMA.nombre === 'kapa';
  const pintado = TEMA.nombre === 'pintado';
  const codice = TEMA.nombre === 'codice';
  const pahari = TEMA.nombre === 'pahari';
  const kamasan = TEMA.nombre === 'kamasan';
  const maori = TEMA.nombre === 'kowhaiwhai';
  const { sh, i, et, desde, hasta, dur } = tramoShort(guion, timeline, n);
  const foco = sh.foco ?? 960;
  const K = 1.25; // la escena se agranda para llenar el vertical
  const local = f + desde;
  const actual = et.frases.find((fr) => local >= fr.from && local < fr.from + fr.dur + 8);
  const cierre = f > hasta - desde;
  return (
    <CalidadHD.Provider value={guion.hd !== false}>
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <Audio src={staticFile(TEMA.musica)} volume={0.16} />
      {et.frases.slice(sh.desde, sh.hasta + 1).map((fr, j) => fr.audio[idioma] ? (
        <Sequence key={j} from={fr.from - desde} durationInFrames={fr.dur + 6}><Audio src={staticFile(fr.audio[idioma]!)} /></Sequence>
      ) : null)}
      {/* escena, recortada al centro */}
      <div style={{ position: 'absolute', left: 540 - foco * K, top: 420 - ARRIBA * K, width: 1920, height: 1080, overflow: 'hidden', transform: `scale(${K})`, transformOrigin: '0 0' }}>
        <Sequence from={-desde} durationInFrames={et.durationInFrames}>
          <EscenaMotor esc={guion.escenas[i]} tl={et} idioma={idioma} />
        </Sequence>
      </div>
      {/* marco superior con el gancho */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 420, background: pahari ? DEGRADE_PAHARI_ARRIBA : kamasan ? `linear-gradient(#1E1612, #7A2418)` : maori ? `linear-gradient(#15100E, #6E1610)` : codice ? `linear-gradient(#1A1311, #6E2A1A)` : pintado ? `linear-gradient(#1C1612, #5A3820)` : kapa ? `linear-gradient(#1A1410, #4A2C16)` : papiro ? `linear-gradient(#1D1712, #3A2A1C)` : runas ? `linear-gradient(${C.negro}, #22384D)` : `linear-gradient(${C.barroClaro}, ${C.barro})` }}>
        <svg width={1080} height={120} viewBox="0 0 1080 120" style={{ position: 'absolute', top: 0 }}>{pahari ? <CabeceraPahari f={f} /> : kamasan ? <><rect width={1080} height={110} fill={C.crema} /><FranjaKamasan y={4} alto={56} desplaz={f} tipo="awan" ancho={1080} /><FranjaKamasan y={62} alto={16} desplaz={f * 0.6} tipo="poleng" ancho={1080} /><FranjaKamasan y={78} alto={26} desplaz={f * 0.8} tipo="api" ancho={1080} arriba={false} /><rect y={106} width={1080} height={5} fill={C.negro} /></> : maori ? <><rect width={1080} height={110} fill={C.negro} /><FranjaMaori y={4} alto={58} desplaz={f} tipo="koru" ancho={1080} /><FranjaMaori y={64} alto={26} desplaz={f * 0.7} tipo="taniko" ancho={1080} /><FranjaMaori y={90} alto={16} desplaz={f * 0.85} tipo="paua" ancho={1080} /><rect y={106} width={1080} height={5} fill={C.oro} /></> : codice ? <><rect width={1080} height={110} fill={C.crema} /><FranjaCodice y={8} alto={50} desplaz={f} tipo="xical" ancho={1080} /><FranjaCodice y={62} alto={40} desplaz={f * 0.7} tipo="jade" ancho={1080} /><rect y={106} width={1080} height={5} fill={C.negro} /></> : pintado ? <><rect width={1080} height={110} fill={C.crema} /><FranjaCuentas y={8} alto={34} desplaz={f} tipo="escalones" /><FranjaCuentas y={52} alto={20} desplaz={f * 1.3} tipo="puas" /><FranjaCuentas y={76} alto={28} desplaz={f * 0.7} tipo="rombos" /><rect y={106} width={1080} height={5} fill={C.negro} /></> : kapa ? <><rect width={1080} height={110} fill={C.crema} /><FranjaKapa y={8} alto={30} desplaz={f} tipo="triangulos" /><FranjaKapa y={50} alto={34} desplaz={f * 0.7} tipo="rombos" /><rect y={106} width={1080} height={5} fill={C.negro} /></> : papiro ? <><Bloques y={0} alto={22} desplaz={f} /><rect y={22} width={1080} height={50} fill={C.barroClaro} /><Jeroglificos x={14 - (f % 238)} y={28} n={40} /><rect y={72} width={1080} height={5} fill={C.negro} /></> : runas ? <><rect width={1080} height={50} fill={C.negro} /><TextoRunico texto="ODIN THOR LOKI FRIGG FREYJA TYR" x={20 - (f % 600)} y={10} /><TextoRunico texto="ODIN THOR LOKI FRIGG FREYJA TYR" x={740 - (f % 600)} y={10} /><Entrelazado y={56} alto={60} desplaz={f} /></> : <><Lenguetas y={0} desplaz={f} /><Meandro y={52} desplaz={f} /></>}</svg>
        <div style={{ position: 'absolute', top: 140, left: 50, right: 50, textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 76, lineHeight: 1.05, color: C.crema, textShadow: `0 5px 0 ${C.negro}`, opacity: ap(f, 2, 12), transform: `scale(${0.92 + ap(f, 2, 14) * 0.08})` }}>
          {sh.gancho[idioma] ?? sh.gancho.es}
        </div>
      </div>
      {/* marco inferior con subtítulos */}
      <div style={{ position: 'absolute', left: 0, top: 1300, width: 1080, height: 620, background: pahari ? DEGRADE_PAHARI : kamasan ? `linear-gradient(#7A2418, #1E1612)` : maori ? `linear-gradient(#6E1610, #15100E)` : codice ? `linear-gradient(#6E2A1A, #1A1311)` : pintado ? `linear-gradient(#5A3820, #1C1612)` : kapa ? `linear-gradient(#4A2C16, #1A1410)` : papiro ? `linear-gradient(#3A2A1C, #1D1712)` : runas ? `linear-gradient(#22384D, ${C.negro})` : `linear-gradient(${C.barro}, ${C.barroOscuro})` }}>
        <svg width={1080} height={110} viewBox="0 0 1080 110" style={{ position: 'absolute', top: 0 }}>{pahari ? <FranjaPahari y={12} alto={44} desplaz={f} tipo="flores" ancho={1080} /> : kamasan ? <FranjaKamasan y={12} alto={50} desplaz={f} tipo="awan" ancho={1080} /> : maori ? <FranjaMaori y={12} alto={50} desplaz={f} tipo="mangopare" ancho={1080} /> : codice ? <FranjaCodice y={12} alto={44} desplaz={f} tipo="xical" ancho={1080} /> : pintado ? <FranjaCuentas y={12} alto={40} desplaz={f} tipo="escalones" /> : kapa ? <FranjaKapa y={12} alto={40} desplaz={f} tipo="rombos" /> : papiro ? <Bloques y={12} alto={30} desplaz={f} /> : runas ? <Entrelazado y={12} alto={84} desplaz={f} paso={150} /> : <FrisoPalmetas y={10} desplaz={f} />}</svg>
        <div style={{ position: 'absolute', top: 140, left: 60, right: 60, textAlign: 'center', fontFamily: TEXTO, fontWeight: 500, fontSize: 58, lineHeight: 1.2, color: '#FFF8EA', textShadow: `0 3px 0 ${C.negro}, 0 0 14px rgba(0,0,0,.6)` }}>
          {!cierre && actual ? actual.texto[idioma] : ''}
        </div>
        <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: runas ? C.crema : C.negro, opacity: interpolate(f, [dur - 50, dur - 36], [0.55, 1], cl) }}>
          FULL STORY ▸ MYTHS ON CLAY
        </div>
      </div>
      {cierre && (
        <AbsoluteFill style={{ backgroundColor: `rgba(15,11,9,${interpolate(f, [hasta - desde, hasta - desde + 10], [0, 0.85], cl)})`, justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 70, color: C.crema, textAlign: 'center', lineHeight: 1.2, opacity: ap(f, hasta - desde + 4, 10) }}>
            {guion.titulo[idioma] ?? guion.titulo.es}<br /><span style={{ fontSize: 44 }}>Full episode on the channel</span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
    </CalidadHD.Provider>
  );
};
