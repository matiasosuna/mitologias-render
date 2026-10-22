// Elenco de la serie `biblia` (Learn Bible 777, tema "natural"). Génesis 1: el primer hombre y la primera mujer, dibujos
// propios (piel oliva, pelo oscuro, lino crudo sin teñir, descalzos; nada de estilo griego), y los animales de la creación (se reusan los dibujos épicos de los griegos, sin nombre → sin rótulo).
// Dios NUNCA es un personaje: es luz (elemento `luz_divina` de fondosBiblia.tsx).
// Claves con sufijo _biblia para no chocar con otras series.
import React from 'react';
import type { Ficha } from './elenco';
import type { DibujoProps } from './elencoAzteca';
import { BovinoEpico, OvinoEpico, CiervoEpico, CaballoEpico, LeonEpico, TortugaEpica, AguilaEpica, DelfinEpico, Marco, Recorte, OjoVivo, tono } from './bestiasEpicas';
import { PezEpico } from './criaturasEpicas';
import { useCurrentFrame } from 'remotion';
import { suave } from '../comun/vasija';

const r1 = (v: number) => v.toFixed(1);
const D = (Dibujo: React.FC<DibujoProps>, p: Record<string, unknown>, griego?: string): Ficha => ({ tipo: 'dibujo', Dibujo, p, griego });

/** Ballena: lomo gris azulado, panza clara con surcos y cola que sube y baja. Nada (origen = centro del cuerpo). */
const BallenaNatural: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f } = props;
  const c = (props.color as string | undefined) ?? '#4E6A80', cola = Math.sin(f / 14) * 18;
  const cuerpo = suave([[-330, 0], [-250, -50], [-100, -86], [80, -92], [240, -70], [330, -24], [350, 10], [300, 50], [140, 74], [-60, 66], [-240, 36]], true, 0.9);
  return (
    <Marco x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
      <path d={`M-320 6 C -380 0, -420 ${r1(-40 + cola)}, -470 ${r1(-70 + cola)} C -450 ${r1(-20 + cola * 0.6)}, -450 ${r1(20 + cola * 0.6)}, -470 ${r1(70 + cola)} C -420 ${r1(50 + cola)}, -380 20, -320 20 Z`} fill={tono(c, 0.85)} />
      <path d={cuerpo} fill={c} />
      <Recorte d={cuerpo}>
        <path d={suave([[-300, 30], [-100, 20], [120, 24], [340, 10], [300, 80], [-260, 70]], true)} fill="#D8DEE2" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${120 - i * 70} ${36 + i} Q ${30 - i * 70} ${46 + i} ${-60 - i * 70} ${40 + i}`} stroke="#AEB8C0" strokeWidth={3} fill="none" />)}
        <path d={suave([[-220, -40], [-60, -76], [120, -80], [260, -52]])} stroke={tono(c, 1.3)} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.4} />
      </Recorte>
      <path d="M40 40 C 20 90, -20 120, -70 130 C -50 96, -20 66, 0 40 Z" fill={tono(c, 0.82)} />
      <OjoVivo x={250} y={-6} r={8} iris="#1E2A30" />
      <path d="M290 26 Q 320 22 345 12" stroke={tono(c, 0.6)} strokeWidth={3} fill="none" strokeLinecap="round" />
    </Marco>
  );
};

// ---------- gente de Génesis 1: dibujos propios (nada de estilo griego) ----------
const N = '#17110E';
const P = (pts: [number, number][], c: string, t = 0.7, w = 2) => <path d={suave(pts, true, t)} fill={c} stroke={N} strokeWidth={w} strokeLinejoin="round" />;
const L = (pts: [number, number][], c: string, w = 1.6) => <path d={suave(pts)} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" />;
const PIEL_HOMBRE = '#A8714A', PIEL_MUJER = '#B47C55', PELO = '#241A14', PELO_L = '#4A3a2E';
const LINO = '#D2C29E', LINO_OSC = '#B4A27C', SOGA = '#8A7452', SOGA_L = '#B49A70';
/** Torso tapado por una tela de lino que cruza en diagonal (sin escote griego ni broches). a = ancho del torso. */
const Envoltura: React.FC<{ a: number }> = ({ a }) => (
  <g>
    {P([[-30 * a, -286], [-20 * a, -302], [0, -306], [16 * a, -300], [30 * a, -282], [28 * a, -246], [22 * a, -212], [-22 * a, -208], [-30 * a, -250]], LINO, 0.6)}
    {L([[-18 * a, -300], [6 * a, -268], [26 * a, -232]], LINO_OSC, 2.2)}
    {L([[-6 * a, -304], [14 * a, -278], [28 * a, -256]], LINO_OSC, 1.4)}
  </g>
);
/** Cordón de soga anudado a la cintura, con las puntas colgando. */
const Cordon: React.FC<{ a: number }> = ({ a }) => (
  <g>
    <path d={`M${-29 * a} -217 Q 0 -213 ${27 * a} -219`} stroke={N} strokeWidth={7.5} fill="none" strokeLinecap="round" />
    <path d={`M${-29 * a} -217 Q 0 -213 ${27 * a} -219`} stroke={SOGA} strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d={`M${-29 * a} -217 Q 0 -213 ${27 * a} -219`} stroke={SOGA_L} strokeWidth={1.6} strokeDasharray="4 5" fill="none" />
    <circle cx={14 * a} cy={-216} r={4.5} fill={SOGA} stroke={N} strokeWidth={1.4} />
    {L([[14 * a, -214], [17 * a, -196], [15 * a, -182]], SOGA, 3)}
    {L([[15 * a, -214], [10 * a, -198], [11 * a, -186]], SOGA, 3)}
  </g>
);
/** Pelo corto oscuro y liso (tapa coronilla y nuca, deja la oreja). */
const PeloCorto: React.FC = () => (
  <g>
    {P([[24, -30], [12, -40], [-6, -42], [-22, -36], [-31, -22], [-34, -4], [-30, 14], [-22, 18], [-18, 4], [-12, -10], [-2, -20], [12, -25]], PELO, 0.75)}
    {L([[14, -33], [-4, -34], [-20, -26]], PELO_L, 1.6)}
    {L([[4, -38], [-14, -34], [-26, -18]], PELO_L, 1.4)}
  </g>
);
/** Barba corta y prolija que sigue la mandíbula, con bigote. */
const BarbaCorta: React.FC = () => (
  <g>
    {P([[-10, 4], [-12, 20], [-4, 34], [10, 42], [24, 40], [34, 32], [38, 24], [32, 25], [24, 26], [14, 22], [4, 14], [-2, 8]], PELO, 0.7)}
    <path d="M22 19 C 29 15, 37 18, 41 25 C 34 23, 28 23.5, 22 24 Z" fill={PELO} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />
    {L([[6, 26], [14, 34], [24, 36]], PELO_L, 1.3)}
  </g>
);
/** Pelo largo, oscuro y suelto hasta media espalda, con una onda que se mueve. */
const PeloSuelto: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 17) * 2, largo = 118;
  return (
    <g>
      {P([[24, -28], [14, -39], [-2, -44], [-20, -40], [-34, -27], [-41, -6], [-43, 28], [-47 + o, largo * 0.62], [-42 + o, largo], [-30 + o, largo - 6], [-22, largo + 2], [-16, largo * 0.7], [-14, 30], [-10, 6], [-3, -12], [8, -22], [17, -25]], PELO, 0.75)}
      {[[16, -33, -30, -14, -36, 70], [6, -29, -24, 8, -28, 96], [-6, -23, -18, 20, -22, 84]].map(([a, b, c, d, e, g], i) => <path key={i} d={`M${a} ${b} Q ${c} ${d} ${e} ${g}`} stroke={PELO_L} strokeWidth={1.6} fill="none" strokeLinecap="round" />)}
    </g>
  );
};
const Oreja: React.FC<{ piel: string }> = ({ piel }) => (
  <path d="M-3 -9 C -13 -11, -16 6, -6 9 C -2 8, -1 -6, -3 -9 Z" fill={piel} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
);
const gente = (p: Record<string, unknown>): Ficha => ({ tipo: 'persona', p: { hd: true, barba: false, peloCorto: true, tocado: null, lisa: true, ...p } });

export const ELENCO_BIBLIA: Record<string, Ficha> = {
  // Gente: el primer hombre y la primera mujer (Génesis 1 no da nombres todavía).
  hombre_biblia: gente({ piel: PIEL_HOMBRE, pelo: PELO, ropa: 'corta', ropaColor: LINO, ribete: LINO_OSC, brazo: [24, 40],
    adornos: { cuerpo: <><Envoltura a={1} /><Cordon a={1} /></>, cabeza: <><PeloCorto /><Oreja piel={PIEL_HOMBRE} /><BarbaCorta /></> } }),
  mujer_biblia: gente({ mujer: true, piel: PIEL_MUJER, pelo: PELO, ropa: 'larga', ropaColor: LINO, ribete: LINO_OSC, brazo: [30, 60],
    adornos: { cuerpo: <><Envoltura a={0.92} /><Cordon a={0.92} /></>, cabeza: <PeloSuelto /> } }),
  // Animales de tierra
  buey_biblia: D(BovinoEpico, { especie: 'buey', alto: 600, izq: 290, der: 300 }),
  vaca_biblia: D(BovinoEpico, { especie: 'vaca', alto: 440, izq: 280, der: 280 }),
  oveja_biblia: D(OvinoEpico, { especie: 'oveja', alto: 340, izq: 230, der: 230 }),
  cabra_biblia: D(OvinoEpico, { especie: 'cabra', alto: 500, izq: 230, der: 260 }),
  ciervo_biblia: D(CiervoEpico, { s: 0.8, alto: 760, izq: 220, der: 240 }),
  caballo_biblia: D(CaballoEpico, { especie: 'caballo', alto: 700, izq: 260, der: 260 }),
  leon_biblia: D(LeonEpico, { alto: 560, izq: 340, der: 300 }),
  tortuga_biblia: D(TortugaEpica, { alto: 240, izq: 200, der: 200 }),
  // Aves y criaturas del mar
  aguila_biblia: D(AguilaEpica, { especie: 'aguila', vuela: true, alto: 360, izq: 380, der: 380 }),
  paloma_biblia: D(AguilaEpica, { especie: 'paloma', vuela: true, alto: 220, izq: 200, der: 200 }),
  delfin_biblia: D(DelfinEpico, { vuela: true, alto: 160, izq: 260, der: 260 }),
  pez_biblia: D(PezEpico, { vuela: true, alto: 200, izq: 240, der: 190 }),
  ballena_biblia: D(BallenaNatural, { vuela: true, alto: 230, izq: 470, der: 350 }),
  serpiente_biblia: { tipo: 'serpiente', p: { largo: 520, grosor: 30, color: '#5E6B3A', manchas: true, erguida: 0.7, s: 0.9 } },
  pajaro_biblia: { tipo: 'ave', p: { color: '#7A6A5A', ala2: '#B8A890', pico: '#D9A040', s: 0.7 } },
};
export const NOMBRE_EN_BIBLIA: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_BIBLIA).filter(([, f]) => f.griego).map(([k, f]) => [k, f.griego as string]));
