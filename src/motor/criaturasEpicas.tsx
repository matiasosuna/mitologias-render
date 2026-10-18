// Criaturas griegas épicas (2026-10-18): Hidra, dragón, pez y Harpía, en el estilo de bestiasEpicas.tsx
// (masas sin trazo + filtro `barroEpico` del Marco, piezas sueltas con trazo, ojos vivos).
// Origen = suelo bajo la criatura (las que vuelan/nadan: centro del cuerpo), mirando a la derecha.
import React from 'react';
import { suave, miembro, type P } from '../comun/vasija';
import type { DibujoProps } from './elencoAzteca';
import { N, tono, Marco, OjoVivo, Mechon, Pluma, AlaGrande, Tubo, Recorte, Masa, Raya, Pata, CabezaSierpe, cadena } from './bestiasEpicas';

const r1 = (v: number) => v.toFixed(1);

// ---------- Hidra de Lerna ----------
/** Hidra: cuerpo de reptil bajo sobre cuatro patas cortas, cola larga y nueve cuellos con cabezas; la del medio, inmortal, con corona de oro. */
export const HidraEpica: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f } = props;
  const c = (props.color as string | undefined) ?? '#3E6E4E', panza = '#C9D68A', mancha = '#22402A', lej = tono(c, 0.72);
  const cuerpo: P[] = [[-230, -120], [-200, -190], [-110, -236], [0, -246], [100, -230], [170, -190], [190, -130], [150, -90], [40, -78], [-80, -80], [-190, -92]];
  const dC = suave(cuerpo, true, 0.9);
  // cuellos: [raíz x, ángulo final, largo, fase]; los de atrás primero (más oscuros)
  const cuellos: [number, number, number, number][] = [[-120, -40, 300, 0], [-60, -18, 360, 1.3], [0, 4, 400, 2.6], [60, 22, 360, 3.9], [120, 40, 300, 5.2], [-90, -30, 250, 0.7], [90, 30, 260, 4.5], [-30, -8, 300, 1.9], [30, 14, 310, 3.3]];
  const cuello = ([rx, a, L, ph]: [number, number, number, number], i: number, frente: boolean) => {
    const o = Math.sin(f / 12 + ph) * 14, rad = (a * Math.PI) / 180, base: P = [rx, -200];
    const pts: P[] = [0, 0.25, 0.5, 0.75, 1].map((t) => [base[0] + Math.sin(rad) * L * t + Math.sin(t * Math.PI * 1.6 + ph) * 26 * t + o * t, base[1] - Math.cos(rad) * L * t] as P);
    const cab = pts[4], col = frente ? c : lej, inmortal = i === 2;
    return (
      <g key={i}>
        <Tubo pts={pts} w={[52, 44, 38, 34, 32]} c={col} panza={panza} mancha={mancha} />
        <g transform={`translate(${r1(cab[0])} ${r1(cab[1])}) rotate(${r1(-20 + a * 0.6 + Math.sin(f / 15 + ph) * 6)}) scale(${inmortal ? 1.3 : 1.1})`}>
          <CabezaSierpe c={col} panza={panza} mancha={mancha} f={f} fase={ph} abre={inmortal ? 20 : 14 + (i % 3) * 4} cresta={tono(c, 0.6)} oro={inmortal} />
        </g>
      </g>
    );
  };
  const pata = (cx: number, del: boolean, cerca: boolean) => <Pata pts={cadena([cx, -120], del ? [20, -10, 30] : [-20, 10, -10], [50, 44, 10])} anchos={[56, 40, 30, 28]} c={cerca ? c : lej} pie="garraUnas" cPie={c} angPie={0} />;
  return (
    <Marco x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
      <Tubo pts={[[-200, -130], [-290, -110], [-350, -60], [-400, -40 + Math.sin(f / 10) * 8], [-440, -60 + Math.sin(f / 10) * 12]]} w={[70, 54, 40, 26, 10]} c={lej} panza={panza} mancha={mancha} />
      {pata(-150, false, false)}{pata(110, true, false)}
      {cuellos.slice(0, 5).map((q, i) => cuello(q, i, false))}
      {pata(-120, false, true)}{pata(140, true, true)}
      <path d={dC} fill={c} />
      <Recorte d={dC}>
        <ellipse cx={-10} cy={-80} rx={230} ry={34} fill={panza} />
        <Masa pts={[[60, -240], [180, -190], [200, -110], [120, -150]]} c={tono(c, 0.82)} />
        <Raya pts={[[-200, -196], [-100, -236], [40, -244], [140, -214]]} c={tono(c, 1.3)} w={8} op={0.5} />
        {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={-170 + i * 52} cy={-180 + Math.abs(i - 3) * 6} rx={18} ry={11} fill={mancha} opacity={0.75} />)}
      </Recorte>
      {[-150, -90, -30, 30, 90].map((px, i) => <path key={i} d={`M${px - 16} ${-226 - (i === 2 ? 14 : 6)} l 16 -30 l 16 30 Z`} fill={tono(c, 0.6)} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />)}
      {cuellos.slice(5).map((q, i) => cuello(q, i + 5, true))}
    </Marco>
  );
};

// ---------- Dragón (drakon guardián: el del vellocino, Ladón) ----------
/** Ala de membrana: dedos-varillas desde el hombro y la piel entre ellos. Raíz en (0,0), se abre arriba-atrás. */
const AlaMembrana: React.FC<{ L: number; c: string; hueso: string; abre: number }> = ({ L, c, hueso, abre }) => {
  const codo: P = [-L * 0.28, -L * 0.42], dedos = [200, 222, 244, 262].map((a, i) => { const r = ((a + abre * 8) * Math.PI) / 180, l = L * (0.72 - i * 0.1); return [codo[0] + Math.cos(r) * l, codo[1] + Math.sin(r) * l] as P; });
  const borde: P[] = [[0, 0], dedos[0], [dedos[0][0] * 0.82 + dedos[1][0] * 0.18 + 10, (dedos[0][1] + dedos[1][1]) / 2 + 24], dedos[1], [(dedos[1][0] + dedos[2][0]) / 2 + 14, (dedos[1][1] + dedos[2][1]) / 2 + 26], dedos[2], [(dedos[2][0] + dedos[3][0]) / 2 + 16, (dedos[2][1] + dedos[3][1]) / 2 + 22], dedos[3], [-L * 0.06, -L * 0.06]];
  const d = borde.map((p, i) => `${i ? 'L' : 'M'}${r1(p[0])} ${r1(p[1])}`).join(' ') + 'Z';
  return (
    <g>
      <path d={d} fill={c} stroke={N} strokeWidth={2.6} strokeLinejoin="round" />
      <Recorte d={d}>{dedos.map((p, i) => <path key={i} d={`M${r1(codo[0])} ${r1(codo[1])} L ${r1(p[0] * 0.6 + codo[0] * 0.4)} ${r1(p[1] * 0.6 + codo[1] * 0.4 + 20)}`} stroke={tono(c, 0.78)} strokeWidth={18} strokeLinecap="round" opacity={0.6} />)}</Recorte>
      <path d={`M0 0 L ${r1(codo[0])} ${r1(codo[1])}`} stroke={N} strokeWidth={16} strokeLinecap="round" /><path d={`M0 0 L ${r1(codo[0])} ${r1(codo[1])}`} stroke={hueso} strokeWidth={11} strokeLinecap="round" />
      {dedos.map((p, i) => <g key={i}><path d={`M${r1(codo[0])} ${r1(codo[1])} L ${r1(p[0])} ${r1(p[1])}`} stroke={N} strokeWidth={8} strokeLinecap="round" /><path d={`M${r1(codo[0])} ${r1(codo[1])} L ${r1(p[0])} ${r1(p[1])}`} stroke={hueso} strokeWidth={4.5} strokeLinecap="round" /></g>)}
      <path d={`M${r1(codo[0])} ${r1(codo[1])} l -6 -20 l 14 8 Z`} fill="#F6F0E2" stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
    </g>
  );
};
/** Dragón: gran sierpe enroscada que se alza, con alas de membrana, patas delanteras con garras, púas dorsales, cuernos y barba. */
export const DragonEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f } = props;
  const c = (props.color as string | undefined) ?? '#7A2E22', panza = '#E2B05A', mancha = '#4A1A12', ala = '#9A4A2E', hueso = '#5A2416', lej = tono(c, 0.75);
  const o = Math.sin(f / 14) * 8, aleteo = Math.sin(f * 0.12);
  // cuerpo: vuelta en el suelo + cuello que se alza en S
  const vuelta: P[] = [[-360, -30], [-300, -50], [-200, -40], [-80, -50], [40, -70], [110, -120]];
  const cuello: P[] = [[110, -120], [150, -220], [110, -320 + o * 0.5], [130, -420 + o], [200, -480 + o]];
  const cab = cuello[4];
  const atras: P[] = [[-80, -50], [-180, -90], [-260, -80], [-300, -40]];
  const pD = cadena([150, -200], [10 + Math.sin(f / 18) * 4, -20, 40], [70, 64, 12]), pT = cadena([120, -200], [-10, -10, 30], [70, 64, 12]);
  const puas = [...vuelta.slice(1, 5), ...cuello.slice(1, 4)];
  return (
    <Marco x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
      <g transform={`translate(60 -300) rotate(${r1(-10 - aleteo * 6)})`}><AlaMembrana L={420} c={tono(ala, 0.8)} hueso={hueso} abre={aleteo} /></g>
      <Tubo pts={atras} w={[64, 54, 40, 22]} c={lej} panza={panza} mancha={mancha} diamantes />
      <Pata pts={pT} anchos={[44, 32, 26, 22]} c={lej} pie="garraUnas" cPie={c} angPie={0} />
      <Tubo pts={vuelta} w={[16, 40, 60, 70, 76, 76]} c={c} panza={panza} mancha={mancha} diamantes />
      {puas.map((q, i) => <path key={i} d={`M${r1(q[0] - 18)} ${r1(q[1] - 30)} l 16 -34 l 18 32 Z`} fill={tono(c, 0.6)} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />)}
      <Tubo pts={cuello} w={[76, 70, 60, 52, 46]} c={c} panza={panza} mancha={mancha} diamantes />
      <Pata pts={pD} anchos={[48, 36, 28, 24]} c={c} pie="garraUnas" cPie={c} angPie={0} luz={tono(c, 1.3)} />
      <g transform={`translate(${r1(cab[0])} ${r1(cab[1])}) rotate(${r1(14 + Math.sin(f / 18) * 4)}) scale(1.7)`}>
        <CabezaSierpe c={c} panza={panza} mancha={mancha} f={f} abre={18} cuernos="#E9DDBA" barba={tono(c, 0.6)} cresta={tono(c, 0.6)} iris="#F2C14E" />
      </g>
      <g transform={`translate(110 -320) rotate(${r1(-4 - aleteo * 10)})`}><AlaMembrana L={460} c={ala} hueso={hueso} abre={aleteo} /></g>
    </Marco>
  );
};

// ---------- Pez ----------
/** Pez grande de escamas (atún/dorada): aletas con radios, agalla, ojo vivo. Origen = centro del cuerpo. */
export const PezEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f } = props;
  const c = (props.color as string | undefined) ?? '#3E6E8E', panza = '#E6ECEA', aleta = (props.aleta as string | undefined) ?? '#D9A84A';
  const o = Math.sin(f / 6) * 10, giro = Math.sin(f / 18) * 4;
  const cuerpo = suave([[-160, 0], [-110, -46], [-20, -70], [80, -60], [150, -30], [176, 0], [150, 28], [80, 52], [-20, 58], [-110, 40]], true, 0.9);
  const aletaD = (pts: P[], radios: number) => { const d = suave(pts, true, 0.6); return <g><path d={d} fill={aleta} stroke={N} strokeWidth={2.2} strokeLinejoin="round" /><Recorte d={d}>{Array.from({ length: radios }, (_, i) => { const t = (i + 0.5) / radios, a = pts[0], b = pts[pts.length - 1], m = pts[Math.floor(pts.length / 2)]; return <path key={i} d={`M${r1(a[0] + (b[0] - a[0]) * t)} ${r1(a[1] + (b[1] - a[1]) * t)} L ${r1(m[0] + (t - 0.5) * 60)} ${r1(m[1])}`} stroke={tono(aleta, 0.7)} strokeWidth={2} />; })}</Recorte></g>; };
  return (
    <Marco x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
      <g transform={`rotate(${r1(giro)})`}>
        {aletaD([[-150, -6], [-230, -70 + o], [-212, 0], [-232, 70 + o], [-150, 8]], 7)}
        {aletaD([[-60, -60], [-20, -110], [60, -96], [70, -62]], 8)}
        {aletaD([[-40, 50], [-10, 90], [40, 56]], 5)}
        <path d={cuerpo} fill={c} />
        <Recorte d={cuerpo}>
          <path d={suave([[-160, 10], [-60, 14], [60, 10], [176, 4], [150, 40], [-20, 70], [-140, 50]], true)} fill={panza} />
          {Array.from({ length: 5 }, (_, fi) => Array.from({ length: 9 }, (_, ci) => { const cx = -130 + ci * 30 + (fi % 2) * 15, cy = -50 + fi * 22; return <path key={`${fi}-${ci}`} d={`M${cx - 12} ${cy} Q ${cx} ${cy + 14} ${cx + 12} ${cy}`} stroke={fi < 3 ? tono(c, 0.72) : '#C9D2D0'} strokeWidth={2.2} fill="none" strokeLinecap="round" />; }))}
          <path d={suave([[-150, -10], [-40, -50], [80, -48], [160, -16]])} stroke={tono(c, 1.4)} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.5} />
          <path d={suave([[-150, 6], [0, -2], [150, 4]])} stroke={aleta} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
        </Recorte>
        <path d="M84 -40 C 100 -10, 100 20, 84 44" stroke={N} strokeWidth={3} fill="none" strokeLinecap="round" />
        {aletaD([[70, 10], [30, 40], [40, 4]], 4)}
        <path d="M168 4 Q 160 12 150 10" stroke={N} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        <OjoVivo x={128} y={-14} r={10} iris="#E8B93E" />
      </g>
    </Marco>
  );
};

// ---------- Harpía ----------
/** Harpía: cuerpo y alas de ave de presa, garras, y cabeza de mujer de pelo revuelto que chilla. Origen = centro del cuerpo. */
export const ArpiaEpica: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f } = props;
  const ala = { c: '#4A3A40', c2: '#6A5458', c3: '#8A7470', punta: '#221A1E' }, cuerpo = '#5A4648', piel = '#D9A884', pelo = '#2A1C1A';
  const aleteo = Math.sin(f * 0.24), abre = (aleteo + 1) / 2, dy = -aleteo * 10;
  const Ala = ({ der }: { der: boolean }) => (
    <g transform={`translate(${der ? 30 : -30} -40) scale(${der ? -1 : 1} 1) rotate(${r1(10 - aleteo * 12)})`}>
      <AlaGrande largo={400} c={ala.c} c2={ala.c2} c3={ala.c3} punta={ala.punta} abre={abre} raquis="#1A1214" />
    </g>
  );
  const dC = suave([[-50, -50], [-26, -84], [26, -84], [52, -50], [56, 20], [36, 74], [-36, 74], [-56, 20]], true, 0.9);
  const ondea = (i: number) => Math.sin(f / 7 + i) * 8;
  return (
    <Marco x={x} y={y + dy} s={s} voltear={voltear} opacity={opacity}>
      {Array.from({ length: 6 }, (_, i) => <Pluma key={i} x={0} y={56} ang={64 + i * 10} l={140} w={30} c={i % 2 ? ala.c2 : ala.c} punta={ala.punta} raquis="#1A1214" />)}
      <Ala der={false} /><Ala der />
      <path d={dC} fill={cuerpo} />
      <Recorte d={dC}>{Array.from({ length: 10 }, (_, fi) => Array.from({ length: 8 }, (_, ci) => { const cx = -60 + ci * 18 + (fi % 2) * 9, cy = -60 + fi * 14; return <path key={`${fi}-${ci}`} d={`M${cx - 9} ${cy} Q ${cx} ${cy + 12} ${cx + 9} ${cy}`} stroke="#3A2A2C" strokeWidth={2} fill="none" strokeLinecap="round" />; }))}</Recorte>
      {/* patas con garras de rapaz */}
      {[-22, 22].map((lx, j) => <g key={lx}>
        <path d={suave([[lx - 20, 44], [lx + 20, 44], [lx + 16, 92], [lx - 16, 92]], true, 0.7)} fill={tono(cuerpo, 1.15)} stroke={N} strokeWidth={2.2} />
        <path d={`M${lx} 92 L ${lx} 118`} stroke={N} strokeWidth={14} strokeLinecap="round" /><path d={`M${lx} 92 L ${lx} 118`} stroke="#C9A04A" strokeWidth={9} strokeLinecap="round" />
        {[-34, 0, 34].map((a) => <g key={a} transform={`translate(${lx} 118) rotate(${a + Math.sin(f / 8 + j) * 6})`}><path d="M0 0 L 0 24" stroke={N} strokeWidth={10} strokeLinecap="round" /><path d="M0 0 L 0 24" stroke="#C9A04A" strokeWidth={6} strokeLinecap="round" /><path d="M-4 22 Q 0 40 8 34" stroke={N} strokeWidth={5.5} fill="none" strokeLinecap="round" /></g>)}
      </g>)}
      {/* gorguera de plumas al cuello */}
      {Array.from({ length: 7 }, (_, i) => <Pluma key={`g${i}`} x={-36 + i * 12} y={-84} ang={70 + (i - 3) * 14} l={46} w={22} c={i % 2 ? ala.c3 : ala.c2} />)}
      {/* cabeza de mujer de perfil, pelo revuelto al viento */}
      <g transform={`translate(4 -112) rotate(${r1(Math.sin(f / 20) * 4)})`}>
        {Array.from({ length: 8 }, (_, i) => <Mechon key={i} x={-20 + (i % 3) * 4} y={-30 + i * 7} ang={-130 + i * 8 + ondea(i)} l={70 + (i % 3) * 16} w={26} c={i % 2 ? pelo : '#3E2A26'} luz="#6A4E44" curva={0.4} />)}
        <path d="M-2 26 C 2 40, 0 50, -6 58 L 20 58 C 16 48, 18 38, 22 28 Z" fill={piel} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
        <path d={suave([[-30, 2], [-22, -26], [0, -36], [20, -30], [28, -14], [30, -6], [37, 6], [32, 10], [34, 15], [31, 20], [26, 26], [8, 32], [4, 40], [-16, 40], [-24, 22]], true, 0.9)} fill={piel} stroke={N} strokeWidth={2.4} />
        <path d="M23 18 Q 28 16 32 20 Q 28 26 23 22 Z" fill="#6E1E1E" stroke={N} strokeWidth={1.4} />
        <path d="M-3 -9 C -13 -11, -16 6, -6 9 C -2 8, -1 -6, -3 -9 Z" fill={piel} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
        <path d="M8 -6 Q 18 -14 28 -6 Q 18 0 8 -6 Z" fill="#F6EEDC" stroke={N} strokeWidth={1.6} />
        <circle cx={19} cy={-6} r={3.4} fill="#C9502A" /><circle cx={19} cy={-6} r={1.6} fill={N} />
        <path d="M6 -15 L 30 -9" stroke={N} strokeWidth={3.4} strokeLinecap="round" />
        <path d={suave([[24, -27], [10, -38], [-6, -40], [-22, -34], [-32, -20], [-34, 0], [-26, 10], [-18, -4], [-8, -16], [6, -24], [16, -26]], true, 0.8)} fill={pelo} stroke={N} strokeWidth={2.2} />
        {[0, 1, 2].map((i) => <Mechon key={`t${i}`} x={8 - i * 12} y={-34 + i * 2} ang={-150 - i * 12 + ondea(i + 3)} l={40} w={18} c={pelo} curva={-0.3} trazo={1.8} />)}
      </g>
    </Marco>
  );
};
