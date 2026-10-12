// Short nativo vertical (1080×1920): una mini-historia escrita para Shorts/Reels, con su propio guion,
// voz y escenas montadas para el centro. Gancho arriba todo el tiempo, subtítulos grandes abajo y cierre
// con el episodio completo. Guion con "formato": "short" (ver BRIEF-SHORTS.md).
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { C, TITULO, TEXTO, ap, cl, Lenguetas, Meandro, FrisoPalmetas, ARRIBA, TEMA, aplicarTema, TextoRunico, Entrelazado, Bloques, Jeroglificos, CalidadHD, FranjaKapa, FranjaCuentas } from '../comun/vasija';
import { EscenaMotor } from './Escena';
import { FranjaCodice } from '../comun/codice';
import type { GuionVisual, Timeline, Idioma } from './tipos';

export const ShortNativo: React.FC<{ guion: GuionVisual; timeline: Timeline; idioma?: Idioma }> = ({ guion, timeline, idioma = 'en' }) => {
  aplicarTema(guion.serie);
  const f = useCurrentFrame();
  const oscuro = TEMA.nombre !== 'vasija', papiro = TEMA.nombre === 'papiro', kapa = TEMA.nombre === 'kapa', pintado = TEMA.nombre === 'pintado', codice = TEMA.nombre === 'codice', runas = TEMA.nombre === 'runas';
  const K = 1.25;
  const finHistoria = timeline.total - timeline.outroFrames;
  const esc = timeline.escenas.find((e) => f >= e.from && f < e.from + e.durationInFrames);
  const actual = esc?.frases.find((fr) => f - esc.from >= fr.from && f - esc.from < fr.from + fr.dur + 8);
  const cierre = f >= finHistoria;
  const gancho = guion.gancho?.[idioma] ?? guion.gancho?.es ?? guion.titulo[idioma] ?? guion.titulo.es;
  return (
    <CalidadHD.Provider value={guion.hd !== false}>
      <AbsoluteFill style={{ backgroundColor: C.negro }}>
        <Audio src={staticFile(TEMA.musica)} volume={(fr) => interpolate(fr, [0, finHistoria, timeline.total], [0.16, 0.16, 0.3], cl)} />
        {timeline.escenas.map((e, i) => (
          <Sequence key={e.id} from={e.from} durationInFrames={e.durationInFrames + (i === timeline.escenas.length - 1 ? timeline.outroFrames : 0)}>
            {e.frases.map((fr, j) => fr.audio[idioma] ? <Sequence key={j} from={fr.from} durationInFrames={fr.dur + 6}><Audio src={staticFile(fr.audio[idioma]!)} /></Sequence> : null)}
            {/* escena, montada para el centro */}
            <div style={{ position: 'absolute', left: 540 - (guion.escenas[i].foco ?? 960) * K, top: 420 - ARRIBA * K, width: 1920, height: 1080, overflow: 'hidden', transform: `scale(${K})`, transformOrigin: '0 0' }}>
              <EscenaMotor esc={guion.escenas[i]} tl={e} idioma={idioma} />
            </div>
          </Sequence>
        ))}
        {/* gancho arriba, todo el tiempo */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 420, background: codice ? `linear-gradient(#1A1311, #6E2A1A)` : pintado ? `linear-gradient(#1C1612, #5A3820)` : kapa ? `linear-gradient(#1A1410, #4A2C16)` : papiro ? `linear-gradient(#1D1712, #3A2A1C)` : runas ? `linear-gradient(${C.negro}, #22384D)` : `linear-gradient(${C.barroClaro}, ${C.barro})` }}>
          <svg width={1080} height={120} viewBox="0 0 1080 120" style={{ position: 'absolute', top: 0 }}>{codice ? <><rect width={1080} height={110} fill={C.crema} /><FranjaCodice y={8} alto={50} desplaz={f} tipo="xical" ancho={1080} /><FranjaCodice y={62} alto={40} desplaz={f * 0.7} tipo="jade" ancho={1080} /><rect y={106} width={1080} height={5} fill={C.negro} /></> : pintado ? <><rect width={1080} height={110} fill={C.crema} /><FranjaCuentas y={8} alto={34} desplaz={f} tipo="escalones" /><FranjaCuentas y={52} alto={20} desplaz={f * 1.3} tipo="puas" /><FranjaCuentas y={76} alto={28} desplaz={f * 0.7} tipo="rombos" /><rect y={106} width={1080} height={5} fill={C.negro} /></> : kapa ? <><rect width={1080} height={110} fill={C.crema} /><FranjaKapa y={8} alto={30} desplaz={f} tipo="triangulos" /><FranjaKapa y={50} alto={34} desplaz={f * 0.7} tipo="rombos" /><rect y={106} width={1080} height={5} fill={C.negro} /></> : papiro ? <><Bloques y={0} alto={22} desplaz={f} /><rect y={22} width={1080} height={50} fill={C.barroClaro} /><Jeroglificos x={14 - (f % 238)} y={28} n={40} /><rect y={72} width={1080} height={5} fill={C.negro} /></> : runas ? <><rect width={1080} height={50} fill={C.negro} /><TextoRunico texto="ODIN THOR LOKI FRIGG FREYJA TYR" x={20 - (f % 600)} y={10} /><TextoRunico texto="ODIN THOR LOKI FRIGG FREYJA TYR" x={740 - (f % 600)} y={10} /><Entrelazado y={56} alto={60} desplaz={f} /></> : <><Lenguetas y={0} desplaz={f} /><Meandro y={52} desplaz={f} /></>}</svg>
          <div style={{ position: 'absolute', top: 140, left: 50, right: 50, textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 74, lineHeight: 1.05, color: C.crema, textShadow: `0 5px 0 ${C.negro}`, opacity: ap(f, 0, 8), transform: `scale(${0.9 + ap(f, 0, 10) * 0.1})` }}>{gancho}</div>
        </div>
        {/* subtítulos abajo */}
        <div style={{ position: 'absolute', left: 0, top: 1300, width: 1080, height: 620, background: codice ? `linear-gradient(#6E2A1A, #1A1311)` : pintado ? `linear-gradient(#5A3820, #1C1612)` : kapa ? `linear-gradient(#4A2C16, #1A1410)` : papiro ? `linear-gradient(#3A2A1C, #1D1712)` : runas ? `linear-gradient(#22384D, ${C.negro})` : `linear-gradient(${C.barro}, ${C.barroOscuro})` }}>
          <svg width={1080} height={110} viewBox="0 0 1080 110" style={{ position: 'absolute', top: 0 }}>{codice ? <FranjaCodice y={12} alto={44} desplaz={f} tipo="xical" ancho={1080} /> : pintado ? <FranjaCuentas y={12} alto={40} desplaz={f} tipo="escalones" /> : kapa ? <FranjaKapa y={12} alto={40} desplaz={f} tipo="rombos" /> : papiro ? <Bloques y={12} alto={30} desplaz={f} /> : runas ? <Entrelazado y={12} alto={84} desplaz={f} paso={150} /> : <FrisoPalmetas y={10} desplaz={f} />}</svg>
          <div style={{ position: 'absolute', top: 140, left: 60, right: 60, textAlign: 'center', fontFamily: TEXTO, fontWeight: 500, fontSize: 60, lineHeight: 1.2, color: '#FFF8EA', textShadow: `0 3px 0 ${C.negro}, 0 0 14px rgba(0,0,0,.6)` }}>{!cierre && actual ? actual.texto[idioma] ?? actual.texto.es : ''}</div>
          <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: oscuro ? C.crema : C.negro }}>MYTHS ON CLAY</div>
        </div>
        {cierre && (
          <AbsoluteFill style={{ backgroundColor: `rgba(15,11,9,${interpolate(f, [finHistoria, finHistoria + 10], [0, 0.85], cl)})`, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 66, color: C.crema, textAlign: 'center', lineHeight: 1.2, padding: 60, opacity: ap(f, finHistoria + 4, 10) }}>
              {guion.cierre?.[idioma] ?? guion.cierre?.es ?? guion.titulo[idioma] ?? guion.titulo.es}<br /><span style={{ fontSize: 44 }}>Full story on Myths on Clay</span>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </CalidadHD.Provider>
  );
};
