// Piel norteamericana, T1 episodios 5–12: dibujos que faltaban (mismo estilo plano de muñeco, contorno oscuro).
// Elementos: sicomoro (con fuego, en una isla), isla_barro (cherokee: crece, cuelga de cuatro cuerdas, montañas),
// boveda (la bóveda de piedra del cielo), tronco (flotando), interior_tablones (casa de la costa noroeste por
// dentro, con el agujero del humo), almeja (Rose Spit), escalera_flechas, constelacion (Osa Mayor),
// monstruo_kamiah, corazon_monstruo (adentro), corazon_piedra (el montículo de Kamiah hoy), soga.
// Fondos: playa_noroeste (sin casas), dentro_monstruo. Animales (ficha `norte`): zarigueya, buho, cangrejo, cuervo, caja.
import React from 'react';
import { C, Capa, SUELO, Nube, Sol, Estrellas, Fuego, suave, azar } from '../comun/vasija';

const K = {
  hollin: '#1C1612', rojo: '#B23A24', ocre: '#C98A3A', azul: '#2F5D8A', agua: '#3F7F9A', aguaClara: '#9CCBD0', aguaOsc: '#1F4A66',
  tierra: '#8A5A34', tierraOsc: '#5A3820', barro: '#6E5034', barroClaro: '#8E6A44', pino: '#2F4A36', pinoClaro: '#4A6A4A', cedro: '#8A3A24',
  roca: '#8A8078', rocaOsc: '#5E5650', arena: '#D2B88A', arenaOsc: '#A88E62', crema: '#F2EEE4', tabla: '#9A7A56', tablaOsc: '#6E5236',
};
const n1 = (v: number) => v.toFixed(1);
const L = C.negro;

// ---------- elementos ----------
/** Sicomoro hueco (cherokee, "El primer fuego"): corteza blanca a manchas; con `fuego`, brasa adentro y humo arriba. Con `isla`, sobre una isla (origen = línea del agua). */
const Sicomoro: React.FC<{ x: number; y: number; s: number; f: number; fuego?: boolean; isla?: boolean }> = ({ x, y, s, f, fuego, isla }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {isla && <path d="M-330 6 C -300 -40, -140 -62, 0 -64 C 140 -62, 300 -40, 330 6 Z" fill="#6E7E3A" stroke={L} strokeWidth={3} />}
    {isla && [-250, -160, 150, 240].map((gx, i) => <path key={i} d={`M${gx} ${-30 - (i % 2) * 8} l 5 -16 M${gx + 9} ${-30 - (i % 2) * 8} l -2 -18 M${gx + 16} ${-30 - (i % 2) * 8} l 7 -14`} stroke="#3E5A2A" strokeWidth={3} strokeLinecap="round" />)}
    <g transform={`translate(0 ${isla ? -50 : 0})`}>
      {fuego && [0, 1, 2, 3, 4].map((k) => { const ed = (f * 0.8 + k * 30) % 150; return <circle key={k} cx={Math.sin(ed / 22 + k) * 18 + ed * 0.25} cy={-470 - ed * 1.6} r={22 + ed * 0.35} fill="#5E5650" opacity={0.55 * (1 - ed / 150)} />; })}
      <path d="M-70 4 C -60 -120, -52 -300, -58 -440 L -40 -470 L -18 -430 L 6 -476 L 26 -432 L 50 -462 L 58 -430 C 56 -300, 62 -120, 76 4 Z" fill="#E4DCC8" stroke={L} strokeWidth={3} strokeLinejoin="round" />
      {[[-40, -90, 26, 18], [20, -170, 30, 20], [-30, -260, 22, 16], [30, -340, 24, 18], [-24, -400, 18, 12], [40, -60, 20, 14]].map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={i % 2 ? '#A89A7A' : '#7E8A6A'} opacity={0.8} />)}
      <path d="M-56 -300 C -120 -340, -170 -360, -210 -420 M54 -260 C 120 -300, 170 -330, 200 -400 M-50 -200 C -100 -210, -140 -230, -160 -260" stroke="#D2C8B0" strokeWidth={18} fill="none" strokeLinecap="round" />
      {[[-210, -420], [200, -400], [-160, -260]].map(([bx, by], i) => <path key={i} d={suave([[bx - 70, by + 10], [bx - 60, by - 50], [bx, by - 70], [bx + 60, by - 50], [bx + 70, by + 10], [bx, by + 30]], true)} fill={i === 1 ? '#5E7E3A' : '#6E8A44'} stroke={L} strokeWidth={2.5} />)}
      {/* el hueco abajo, por donde entra la culebra */}
      <path d="M-22 4 C -22 -40, 22 -40, 22 4 Z" fill={fuego ? '#3A1A10' : '#2A1E14'} stroke={L} strokeWidth={2.5} />
      {fuego && <>
        <circle cx={0} cy={-10} r={60 + Math.sin(f / 4) * 6} fill="url(#halo)" />
        <ellipse cx={0} cy={-6} rx={14} ry={8} fill="#FF7A2A" opacity={0.7 + Math.sin(f / 3) * 0.3} />
        <g transform="translate(0 -446)"><Fuego f={f} s={0.55} viento={-10} /></g>
      </>}
    </g>
  </g>
);

/** Isla de barro cherokee: blanda y mojada; crece con `tierra` (0–1); `cuerdas` = cuelga del cielo de cuatro cuerdas; `montes` = valles y montañas del Zopilote. Origen = línea del agua. */
const IslaBarro: React.FC<{ x: number; y: number; s: number; f: number; tierra?: number; cuerdas?: boolean; montes?: number; verde?: boolean }> = ({ x, y, s, f, tierra = 1, cuerdas, montes = 0, verde }) => {
  const w = 60 + tierra * 640, h = 14 + tierra * 46, res = Math.sin(f / 30) * 3;
  const crestas = montes > 0 ? Array.from({ length: 9 }, (_, i) => { const px = -w * 0.8 + (i / 8) * w * 1.6, alto = (i % 2 ? 110 : 40) * montes * (0.8 + azar(i + 3) * 0.4); return [px, -h - alto] as [number, number]; }) : [];
  return (
    <g transform={`translate(${x} ${y + res}) scale(${s})`}>
      {cuerdas && [-0.85, -0.3, 0.3, 0.85].map((k, i) => <path key={i} d={`M${n1(k * w)} ${-h + 6} L ${n1(k * w * 1.4)} -1300`} stroke="#7A5A34" strokeWidth={5} strokeDasharray="14 6" />)}
      <path d={`M${-w} 8 C ${-w * 0.8} ${-h}, ${-w * 0.3} ${-h - 10}, 0 ${-h - 8} C ${w * 0.3} ${-h - 10}, ${w * 0.8} ${-h}, ${w} 8 Z`} fill={verde ? '#5E7E3A' : K.barro} stroke={L} strokeWidth={3.5} />
      {montes > 0 && <path d={`M${-w * 0.9} ${-h * 0.4} ` + crestas.map(([px, py]) => `L ${n1(px)} ${n1(py)}`).join(' ') + ` L ${w * 0.9} ${-h * 0.4} Z`} fill={verde ? '#4E6E3A' : '#7A5A3A'} stroke={L} strokeWidth={3} strokeLinejoin="round" />}
      {montes > 0.5 && crestas.filter((_, i) => i % 2).map(([px, py], i) => <path key={`n${i}`} d={`M${n1(px - 22)} ${n1(py + 26)} L ${n1(px)} ${n1(py)} L ${n1(px + 22)} ${n1(py + 26)}`} stroke={K.crema} strokeWidth={5} fill="none" opacity={0.6} />)}
      {!verde && Array.from({ length: Math.round(4 + tierra * 8) }, (_, i) => <path key={i} d={`M${n1(-w * 0.7 + azar(i) * w * 1.4)} ${n1(-h * 0.5 + azar(i + 4) * h * 0.4)} q 14 -6 28 0`} stroke={K.barroClaro} strokeWidth={3} fill="none" strokeLinecap="round" />)}
      <ellipse cx={0} cy={30} rx={w * 1.15} ry={26} fill="#2F6A84" opacity={0.9} />
      <path d={`M${-w * 1.05} 6 ` + Array.from({ length: 8 }, (_, i) => `q ${n1(w * 0.13)} ${i % 2 ? 6 : -6} ${n1(w * 0.26)} 0`).join(' ')} stroke={K.aguaClara} strokeWidth={3} fill="none" />
    </g>
  );
};

const ARCO = 'M-1500 280 C -1100 40, -500 0, 0 0 C 500 0, 1100 40, 1500 280 L 1500 160 C 1100 -70, 500 -110, 0 -110 C -500 -110, -1100 -70, -1500 160 Z';
/** La bóveda de piedra del cielo (cherokee): Gălûñ'lătï queda arriba de ella. Origen = superficie de arriba, en el centro. */
const Boveda: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={ARCO} fill={K.roca} stroke={L} strokeWidth={4} transform="translate(0 110)" />
    <defs><clipPath id="boveda-n"><path d={ARCO} transform="translate(0 110)" /></clipPath></defs>
    <g clipPath="url(#boveda-n)">{Array.from({ length: 30 }, (_, i) => { const px = -1450 + i * 100; return <path key={i} d={`M${px} -200 l ${n1(-px * 0.04)} 700`} stroke={K.rocaOsc} strokeWidth={3} />; })}</g>
    <path d="M-1400 30 C -900 -2, -400 -4, 0 -4 C 400 -4, 900 -2, 1400 30" stroke="#B0A89E" strokeWidth={6} fill="none" opacity={0.7} />
  </g>
);

/** Tronco flotando (Nanabozho y el diluvio). Origen = línea del agua. */
const Tronco: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 16) * 5}) rotate(${Math.sin(f / 22) * 1.2}) scale(${s})`}>
    <path d="M-280 -60 H 260 C 290 -60, 300 -10, 260 -10 H -280 Z" fill="#7A5A3A" stroke={L} strokeWidth={3} />
    <ellipse cx={-280} cy={-35} rx={16} ry={25} fill="#C9A270" stroke={L} strokeWidth={3} />
    <ellipse cx={-280} cy={-35} rx={7} ry={12} fill="none" stroke="#8A6A40" strokeWidth={2} />
    {[-200, -110, -20, 70, 160].map((bx, i) => <path key={i} d={`M${bx} -56 q 20 ${i % 2 ? 8 : -2} 46 2`} stroke="#4E3A26" strokeWidth={3} fill="none" />)}
    <path d="M120 -60 L 150 -110 L 166 -104 L 142 -60" fill="#7A5A3A" stroke={L} strokeWidth={2.5} />
    <ellipse cx={0} cy={-4} rx={330} ry={18} fill="#2F6A84" opacity={0.85} />
    <path d={`M-320 -10 ` + Array.from({ length: 8 }, (_, i) => `q 40 ${i % 2 ? 6 : -6} 80 0`).join(' ')} stroke={K.aguaClara} strokeWidth={3} fill="none" />
  </g>
);

/** Casa de tablones por dentro (costa noroeste): pared de tablones, dos postes con óvalos genéricos, fogón en el centro,
 *  bultos colgados y el agujero del humo arriba (con `luz`, un haz que baja). Origen = piso, en el centro (fogón). */
const InteriorTablones: React.FC<{ x: number; y: number; s: number; f: number; luz?: boolean; fuego?: boolean; bultos?: number }> = ({ x, y, s, f, luz, fuego = true, bultos = 3 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-1500} y={-900} width={3000} height={904} fill="#7E6044" />
    {Array.from({ length: 40 }, (_, i) => <path key={i} d={`M${-1500 + i * 76} 0 V -900`} stroke={K.tablaOsc} strokeWidth={3} />)}
    <path d="M-1500 -640 L -60 -820 M60 -820 L 1500 -640" stroke="#4A3420" strokeWidth={40} />
    <path d="M-60 -830 H 60 V -900 H -60 Z" fill={luz ? '#F6E7B8' : '#1A1612'} stroke={L} strokeWidth={3} />
    {luz && <path d="M-60 -830 L 60 -830 L 240 0 L -240 0 Z" fill="#FFF3C4" opacity={0.22} />}
    {fuego && [0, 1, 2].map((k) => { const ed = (f * 0.7 + k * 45) % 135; return <circle key={k} cx={Math.sin(ed / 20 + k) * 14} cy={-120 - ed * 5} r={20 + ed * 0.35} fill="#9A9088" opacity={0.4 * (1 - ed / 135)} />; })}
    {[-900, 900].map((px, i) => <g key={i} transform={`translate(${px} 0)`}>
      <rect x={-50} y={-640} width={100} height={640} fill="#9A6A44" stroke={L} strokeWidth={3} />
      {[-520, -330, -140].map((py, j) => <g key={j} transform={`translate(0 ${py})`}>
        <path d="M-36 0 C -36 -28, 36 -28, 36 0 C 36 20, -36 20, -36 0 Z" fill={j === 1 ? K.rojo : L} stroke={L} strokeWidth={3} />
        <path d="M-16 0 C -16 -10, 16 -10, 16 0 C 16 8, -16 8, -16 0 Z" fill={j === 1 ? L : '#E9DFC6'} />
      </g>)}
    </g>)}
    {Array.from({ length: bultos }, (_, i) => { const bx = -620 + i * 230; return <g key={i}>
      <path d={`M${bx} -700 V -620`} stroke={L} strokeWidth={3} />
      <circle cx={bx} cy={-585} r={40 - (i % 2) * 8} fill={i % 2 ? '#B98A55' : '#A0764A'} stroke={L} strokeWidth={3} />
      <path d={`M${bx - 30} -604 q 30 -14 60 0`} stroke={L} strokeWidth={2.5} fill="none" />
    </g>; })}
    <path d="M-1500 0 V -40 H 1500 V 0 Z" fill="#6E5236" stroke={L} strokeWidth={3} />
    <ellipse cx={0} cy={-4} rx={150} ry={26} fill="#3A2A1C" stroke={L} strokeWidth={3} />
    {[-120, -70, -20, 30, 80, 128].map((px, i) => <ellipse key={i} cx={px} cy={-10 + (i % 2) * 6} rx={22} ry={14} fill={K.roca} stroke={L} strokeWidth={2} />)}
    {fuego && <g transform="translate(0 -14)"><Fuego f={f} s={0.7} viento={-6} /></g>}
  </g>
);

/** Almeja gigante en la playa (haida, Rose Spit): `abierta` 0–1 levanta la valva de arriba; `ojos` = caritas espiando. Origen = arena. */
const Almeja: React.FC<{ x: number; y: number; s: number; f: number; abierta?: number; ojos?: boolean }> = ({ x, y, s, f, abierta = 0, ojos }) => {
  const ang = -abierta * 34;
  const valva = (abajo: boolean) => <g>
    <path d={abajo ? 'M-230 -40 C -220 30, 220 30, 230 -40 C 120 -52, -120 -52, -230 -40 Z' : 'M-230 -40 C -200 -170, 200 -170, 230 -40 C 120 -52, -120 -52, -230 -40 Z'} fill={abajo ? '#D8CCB6' : '#E8DECA'} stroke={L} strokeWidth={4} />
    {(abajo ? [-150, -80, 0, 80, 150] : [-170, -110, -50, 10, 70, 130, 180]).map((px, i) => <path key={i} d={abajo ? `M${px} -44 Q ${px * 0.9} -10 ${px * 0.6} 12` : `M${px * 0.25} -150 Q ${px * 0.7} -110 ${px} -46`} stroke="#A89A80" strokeWidth={3} fill="none" />)}
    {!abajo && [-140, -60, 30, 110].map((px, i) => <path key={`b${i}`} d={`M${px - 20} ${-110 + Math.abs(px) * 0.25} q 20 -10 40 0`} stroke="#8A7A64" strokeWidth={2.5} fill="none" />)}
  </g>;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={270} ry={20} fill={K.arenaOsc} opacity={0.6} />
      {abierta > 0.05 && <path d={`M-220 -40 C -150 ${-40 - abierta * 120}, 150 ${-40 - abierta * 120}, 220 -40 Z`} fill="#2A1E1A" />}
      {ojos && abierta > 0.2 && Array.from({ length: 7 }, (_, i) => { const ex = -150 + i * 50, ey = -50 - abierta * 40 - (i % 2) * 14, parp = (f + i * 17) % 90 < 5; return <g key={i}>
        <ellipse cx={ex - 6} cy={ey} rx={5} ry={parp ? 1 : 6} fill={K.crema} /><ellipse cx={ex + 8} cy={ey} rx={5} ry={parp ? 1 : 6} fill={K.crema} />
        {!parp && <><circle cx={ex - 5} cy={ey + 1} r={2.5} fill={L} /><circle cx={ex + 9} cy={ey + 1} r={2.5} fill={L} /></>}
      </g>; })}
      {valva(true)}
      <g transform={`rotate(${ang} 220 -40)`}>{valva(false)}</g>
    </g>
  );
};

/** Escalera de flechas al cielo (wasco): cada flecha clavada en la anterior, desde el suelo hacia arriba; `n` flechas. Origen = suelo. */
const EscaleraFlechas: React.FC<{ x: number; y: number; s: number; n?: number }> = ({ x, y, s, n = 9 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: n }, (_, i) => { const y0 = -i * 92, dx = (i % 2 ? 6 : -6); return <g key={i} transform={`translate(${dx} ${y0})`}>
      <path d="M0 0 L 0 -100" stroke="#8A6A40" strokeWidth={7} />
      <path d="M0 0 L 0 -100" stroke={L} strokeWidth={9} opacity={0.25} />
      {[-30, -55, -80].map((ry) => <path key={ry} d={`M-5 ${ry} l 10 -6`} stroke={L} strokeWidth={2} />)}
      <path d="M0 -100 L -9 -82 L 9 -82 Z" fill="#3A3A40" stroke={L} strokeWidth={1.5} />
      <path d="M0 -4 L -12 6 M0 -4 L 12 6 M0 -14 L -12 -4 M0 -14 L 12 -4" stroke={i % 2 ? K.rojo : '#F2EEE4'} strokeWidth={4} />
    </g>; })}
  </g>
);

/** Osa Mayor: 7 estrellas (+ Alcor, el perrito) con líneas tenues. Origen = estrella del extremo del mango. */
const Constelacion: React.FC<{ x: number; y: number; s: number; f: number; lineas?: boolean }> = ({ x, y, s, f, lineas = true }) => {
  const pts: [number, number][] = [[0, 0], [130, 30], [230, 70], [330, 110], [350, 230], [530, 250], [560, 120]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {lineas && <path d={`M${pts.map((p) => p.join(' ')).join(' L ')} L 330 110`} stroke="#DDE6FF" strokeWidth={2.5} fill="none" opacity={0.35} strokeDasharray="8 8" />}
      {pts.map(([px, py], i) => { const b = 0.75 + 0.25 * Math.sin(f / 8 + i); return <g key={i} transform={`translate(${px} ${py})`}>
        <circle r={26} fill="url(#haloBlanco)" opacity={0.7 * b} />
        <path d="M0 -16 L 4 -4 L 16 0 L 4 4 L 0 16 L -4 4 L -16 0 L -4 -4 Z" fill="#FFFBEF" stroke={L} strokeWidth={1.5} opacity={b} />
      </g>; })}
      <circle cx={148} cy={8} r={5} fill="#FFFBEF" opacity={0.6 + 0.3 * Math.sin(f / 7)} />
    </g>
  );
};

/** El monstruo de Kamiah (nimiipuu): bestia enorme echada, lomo como una loma; `boca` 0–1; `aspira` = viento que entra; `muerto`. Cabeza a la derecha. Origen = suelo, centro del cuerpo. */
const MonstruoKamiah: React.FC<{ x: number; y: number; s: number; f: number; boca?: number; aspira?: boolean; muerto?: boolean; espejo?: boolean }> = ({ x, y, s, f, boca = 0, aspira, muerto, espejo }) => {
  const resp = muerto ? 0 : Math.sin(f / 20) * 6;
  const b = Math.max(boca, aspira ? 0.8 + Math.sin(f / 6) * 0.1 : 0);
  return (
    <g transform={`translate(${x} ${y}) scale(${espejo ? -s : s} ${s})`}>
      {!muerto && <path d="M-640 -40 C -760 -60, -820 -140, -800 -200 C -790 -150, -740 -110, -640 -100 Z" fill="#4E5A3A" stroke={L} strokeWidth={3} />}
      <path d={`M-660 0 C -680 ${-240 - resp}, -340 ${-430 - resp}, 0 ${-440 - resp} C 300 ${-440 - resp}, 520 ${-330 - resp}, 560 -160 L 560 0 Z`} fill="#5E6A44" stroke={L} strokeWidth={4} />
      {Array.from({ length: 11 }, (_, i) => { const t = i / 10, px = -560 + t * 1080, py = -(Math.sin(t * Math.PI) * 300 + 130) - resp; return <path key={i} d={`M${n1(px - 34)} ${n1(py + 18)} L ${n1(px)} ${n1(py - 44)} L ${n1(px + 34)} ${n1(py + 18)} Z`} fill={K.ocre} stroke={L} strokeWidth={3} />; })}
      {Array.from({ length: 6 }, (_, i) => <path key={`f${i}`} d={`M${-480 + i * 180} -60 C ${-450 + i * 180} -150, ${-380 + i * 180} -170, ${-330 + i * 180} -120`} stroke="#3E4A2E" strokeWidth={5} fill="none" />)}
      {[-460, -200, 200, 420].map((px, i) => <path key={`p${i}`} d={`M${px - 50} 0 C ${px - 50} -60, ${px + 50} -60, ${px + 50} 0 Z`} fill="#4E5A3A" stroke={L} strokeWidth={3} />)}
      <g transform={`translate(560 -170) rotate(${muerto ? 18 : 0})`}>
        <path d={`M-40 -120 C 100 -170, 300 -130, 360 -60 L 360 ${-30 + b * 10} L 40 ${-10 + b * 20} Z`} fill="#6E7A4E" stroke={L} strokeWidth={4} />
        <path d={`M40 ${-10 + b * 20} L 360 ${-30 + b * 10} C 340 ${40 + b * 140}, 120 ${60 + b * 140}, 0 ${70 + b * 60} Z`} fill="#5E6A44" stroke={L} strokeWidth={4} />
        {b > 0.15 && <path d={`M60 ${-6 + b * 20} L 350 ${-24 + b * 10} C 320 ${20 + b * 110}, 140 ${30 + b * 110}, 40 ${40 + b * 40} Z`} fill="#3A1414" />}
        {b > 0.15 && Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${100 + i * 38} ${-14 + b * 16 - i * 1.4} l 10 22 l 10 -22`} fill={K.crema} stroke={L} strokeWidth={1.5} />)}
        <path d="M120 -110 C 120 -140, 180 -140, 180 -110 C 180 -90, 120 -90, 120 -110 Z" fill={muerto ? '#5E6A44' : '#F2E2A0'} stroke={L} strokeWidth={3} />
        {muerto ? <path d="M126 -110 h 48" stroke={L} strokeWidth={5} /> : <circle cx={156} cy={-110} r={10} fill={L} />}
        <path d="M100 -136 C 130 -156, 180 -156, 200 -138" stroke={L} strokeWidth={8} fill="none" />
        <ellipse cx={330} cy={-84} rx={10} ry={6} fill={L} />
        {aspira && Array.from({ length: 9 }, (_, i) => { const ed = (f * 6 + i * 70) % 600; return <path key={`v${i}`} d={`M${n1(1000 - ed)} ${n1(-30 + (i % 3 - 1) * 70 * (1 - ed / 600))} q 40 -10 80 0`} stroke="#F4F0E6" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.75 * (ed / 600)} />; })}
      </g>
    </g>
  );
};

/** El corazón del monstruo, adentro, colgando (late); `cortado` 0–1 lo inclina y lo baja. Origen = punto de donde cuelga. */
const CorazonMonstruo: React.FC<{ x: number; y: number; s: number; f: number; cortado?: number }> = ({ x, y, s, f, cortado = 0 }) => {
  const lat = cortado >= 1 ? 1 : 1 + Math.max(0, Math.sin(f / 4)) * 0.06;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {cortado < 1 && [-50, 0, 50].map((px, i) => <path key={i} d={`M${px * 2} 0 C ${px * 1.4} 60, ${px} 120, ${px * 0.6} 170`} stroke="#7A2A2A" strokeWidth={i === 1 ? 26 * (1 - cortado) + 4 : 18} fill="none" opacity={i === 1 ? 1 : 1 - cortado} />)}
      <g transform={`translate(0 ${190 + cortado * 380}) rotate(${cortado * 30}) scale(${lat})`}>
        <path d="M0 160 C -60 120, -170 40, -170 -40 C -170 -110, -90 -140, -40 -110 C -20 -100, -8 -90, 0 -70 C 8 -90, 20 -100, 40 -110 C 90 -140, 170 -110, 170 -40 C 170 40, 60 120, 0 160 Z" fill="#B8322A" stroke={L} strokeWidth={5} />
        <path d="M-110 -60 C -100 -90, -70 -100, -50 -90" stroke="#E8826A" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M-40 -60 C -30 0, 30 20, 60 70" stroke="#7A1E1A" strokeWidth={5} fill="none" />
      </g>
    </g>
  );
};

/** El Corazón del Monstruo hoy, cerca de Kamiah (Idaho): un montículo de roca con pasto. Origen = suelo. */
const CorazonPiedra: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-230 4 C -240 -60, -200 -150, -120 -190 C -60 -220, 30 -230, 100 -200 C 190 -160, 240 -80, 236 4 Z" fill="#6E665E" stroke={L} strokeWidth={4} />
    {[[-150, -80, 40, 30], [-40, -150, 50, 36], [90, -120, 46, 32], [150, -40, 40, 28], [-20, -50, 54, 34]].map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={i % 2 ? '#7E766C' : '#5E5850'} stroke={L} strokeWidth={2} />)}
    <path d="M-236 4 C -200 -40, -150 -60, -90 -40 C -40 -30, 10 -60, 60 -50 C 120 -40, 180 -30, 240 4 Z" fill="#7E8A4A" stroke={L} strokeWidth={3} />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-200 + i * 30} ${-20 - (i % 3) * 8} l 4 -14 M${-192 + i * 30} ${-20 - (i % 3) * 8} l -3 -12`} stroke="#4E5A2A" strokeWidth={3} strokeLinecap="round" />)}
  </g>
);

/** Casa cherokee: paredes de caña tejida revocadas con barro y techo a dos aguas de corteza. Origen = suelo. */
const CasaCherokee: React.FC<{ x: number; y: number; s: number; abierta?: boolean }> = ({ x, y, s, abierta }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-170} width={400} height={170} fill="#C9A878" stroke={L} strokeWidth={3} />
    {[-150, -90, -30, 30, 90, 150].map((px) => <path key={px} d={`M${px} -166 V -4`} stroke="#A88A5E" strokeWidth={3} />)}
    {[-120, -70].map((py) => <path key={py} d={`M-196 ${py} H 196`} stroke="#A88A5E" strokeWidth={2} strokeDasharray="18 10" />)}
    <path d="M-236 -160 L 0 -300 L 236 -160 Z" fill="#7A5A3A" stroke={L} strokeWidth={3} strokeLinejoin="round" />
    {[-180, -120, -60, 0, 60, 120, 180].map((px) => <path key={px} d={`M${px} ${-164 - (1 - Math.abs(px) / 236) * 4} L ${px * 0.25} ${-290 + Math.abs(px) * 0.05}`} stroke="#5A4028" strokeWidth={2.5} />)}
    <path d="M-250 -156 L 0 -306 L 250 -156" stroke={L} strokeWidth={8} fill="none" strokeLinecap="round" />
    <rect x={-40} y={-110} width={80} height={110} fill={abierta ? '#E8C46A' : '#2A1E14'} stroke={L} strokeWidth={3} />
    {abierta && <circle cx={0} cy={-60} r={90} fill="url(#halo)" opacity={0.6} />}
  </g>
);

/** Soga de (x, y) a (props.ax, props.ay), con panza. */
const Soga: React.FC<{ x: number; y: number; ax: number; ay: number }> = ({ x, y, ax, ay }) => (
  <g>
    <path d={`M${x} ${y} Q ${(x + ax) / 2} ${Math.max(y, ay) + 60} ${ax} ${ay}`} stroke={L} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d={`M${x} ${y} Q ${(x + ax) / 2} ${Math.max(y, ay) + 60} ${ax} ${ay}`} stroke="#C9A270" strokeWidth={5} fill="none" strokeDasharray="10 6" strokeLinecap="round" />
  </g>
);

export function elementoNorteExtra(tipo: string, x: number, y: number | undefined, s: number, f: number, props: Record<string, unknown>): React.ReactNode {
  const yy = y ?? SUELO;
  switch (tipo) {
    case 'sicomoro': return <Sicomoro x={x} y={y ?? (props.isla ? SUELO - 20 : SUELO)} s={s} f={f} fuego={props.fuego === true} isla={props.isla === true} />;
    case 'isla_barro': return <IslaBarro x={x} y={y ?? SUELO - 20} s={s} f={f} tierra={(props.tierra as number) ?? 1} cuerdas={props.cuerdas === true} montes={(props.montes as number) ?? 0} verde={props.verde === true} />;
    case 'boveda': return <Boveda x={x} y={y ?? 300} s={s} />;
    case 'tronco': return <Tronco x={x} y={y ?? SUELO - 20} s={s} f={f} />;
    case 'interior_tablones': return <InteriorTablones x={x} y={yy} s={s} f={f} luz={props.luz === true} fuego={props.fuego !== false} bultos={(props.bultos as number) ?? 3} />;
    case 'almeja': return <Almeja x={x} y={yy} s={s} f={f} abierta={(props.abierta as number) ?? 0} ojos={props.ojos === true} />;
    case 'escalera_flechas': return <EscaleraFlechas x={x} y={yy} s={s} n={(props.n as number) ?? 9} />;
    case 'constelacion': return <Constelacion x={x} y={y ?? 260} s={s} f={f} lineas={props.lineas !== false} />;
    case 'monstruo_kamiah': return <MonstruoKamiah x={x} y={yy} s={s} f={f} boca={(props.boca as number) ?? 0} aspira={props.aspira === true} muerto={props.muerto === true} espejo={props.espejo === true} />;
    case 'corazon_monstruo': return <CorazonMonstruo x={x} y={y ?? 130} s={s} f={f} cortado={(props.cortado as number) ?? 0} />;
    case 'corazon_piedra': return <CorazonPiedra x={x} y={yy} s={s} />;
    case 'casa_cherokee': return <CasaCherokee x={x} y={yy} s={s} abierta={props.abierta === true} />;
    case 'bulto': return <g transform={`translate(${x} ${yy}) scale(${s})`}>{props.luz === true && <circle cy={-40} r={70} fill="url(#haloBlanco)" />}<path d="M-40 -10 C -50 -60, -20 -80, 0 -80 C 20 -80, 50 -60, 40 -10 C 30 4, -30 4, -40 -10 Z" fill="#A0764A" stroke={L} strokeWidth={3} /><path d="M-12 -78 L 0 -96 L 12 -78" stroke={L} strokeWidth={3} fill="#A0764A" /><path d="M-28 -50 q 28 -12 56 0" stroke={L} strokeWidth={2.5} fill="none" /></g>;
    case 'soga': return <Soga x={x} y={yy} ax={(props.ax as number) ?? x + 400} ay={(props.ay as number) ?? yy} />;
    default: return null;
  }
}

// ---------- fondos ----------
export function fondoNorteExtra(tipo: string, f: number, astros = true): React.ReactNode {
  switch (tipo) {
    case 'playa_noroeste': return (<>
      <defs><linearGradient id="n-playa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C8DCE4" /><stop offset="1" stopColor="#F2EAD6" /></linearGradient></defs>
      <Capa p={0}><rect x={-2000} y={-500} width={8000} height={2000} fill="url(#n-playa)" /></Capa>
      <Capa p={0.05}>{astros && <Sol x={1560} y={250} r={36} f={f} />}{Array.from({ length: 4 }, (_, i) => <Nube key={i} x={-100 + i * 620} y={250 + (i % 2) * 60} s={0.7} color="#FFFDF6" f={f + i * 30} />)}</Capa>
      <Capa p={0.12}><path d={`M-1800 600 ` + Array.from({ length: 24 }, (_, i) => `q 170 ${i % 2 ? 30 : -50} 340 0`).join(' ') + ' V 1200 H -1800 Z'} fill="#4A6050" stroke={L} strokeWidth={2.5} />
        {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${-1500 + i * 220 + azar(i) * 60} 600 l 26 -70 l 26 70 Z`} fill={i % 2 ? K.pino : K.pinoClaro} stroke={L} strokeWidth={2} />)}</Capa>
      <Capa p={0.25}><rect x={-2000} y={620} width={8000} height={600} fill={K.agua} />
        {Array.from({ length: 5 }, (_, r) => <path key={r} d={`M-1800 ${645 + r * 22} ` + Array.from({ length: 50 }, (_, i) => `q 60 ${i % 2 ? 4 : -4} 120 0`).join(' ')} stroke={K.aguaClara} strokeWidth={3} fill="none" opacity={0.7} transform={`translate(${(f * (0.4 + r * 0.15)) % 240} 0)`} />)}</Capa>
      <Capa p={0.6}><path d={`M-1800 745 C -600 720, 900 700, 2400 735 C 3400 750, 4600 740, 6000 745 V 1200 H -1800 Z`} fill={K.arena} stroke={L} strokeWidth={3} />
        {[[-300, 770], [1300, 762], [2700, 768]].map(([lx, ly], i) => <g key={i}><path d={`M${lx - 90} ${ly} h 180`} stroke="#B8AE9A" strokeWidth={16} strokeLinecap="round" /><path d={`M${lx - 90} ${ly} h 180`} stroke={L} strokeWidth={20} strokeLinecap="round" opacity={0.25} /></g>)}</Capa>
      <Capa p={1}><rect x={-2000} y={SUELO} width={8000} height={300} fill={K.arena} /><rect x={-2000} y={SUELO} width={8000} height={5} fill={L} />
        {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={-1600 + i * 110 + azar(i) * 40} cy={SUELO + 20 + (i % 3) * 10} r={3} fill={K.arenaOsc} />)}</Capa>
    </>);
    case 'dentro_monstruo': return (<>
      <defs><radialGradient id="n-panza" cx="50%" cy="45%" r="70%"><stop offset="0" stopColor="#7A2E26" /><stop offset="0.6" stopColor="#4A1A16" /><stop offset="1" stopColor="#1E0A08" /></radialGradient></defs>
      <Capa p={0}><rect x={-2000} y={-500} width={8000} height={2000} fill="url(#n-panza)" /></Capa>
      <Capa p={0.3}>{Array.from({ length: 12 }, (_, i) => { const cx = -800 + i * 420; return <path key={i} d={`M${cx - 260} 900 C ${cx - 260} 160, ${cx + 260} 160, ${cx + 260} 900`} stroke="#8A3A30" strokeWidth={34} fill="none" opacity={0.7} />; })}</Capa>
      <Capa p={0.6}>{Array.from({ length: 14 }, (_, i) => { const t = ((f + i * 23) % 80) / 80, cx = -500 + i * 330; return <ellipse key={i} cx={cx} cy={150 + t * 120} rx={6} ry={10} fill="#C86A5A" opacity={0.6 * (1 - t)} />; })}</Capa>
      <Capa p={1}><path d={`M-1800 ${SUELO} ` + Array.from({ length: 40 }, (_, i) => `q 100 ${i % 2 ? 14 : -14} 200 0`).join(' ') + ' V 1200 H -1800 Z'} fill="#6A2620" stroke={L} strokeWidth={4} /></Capa>
    </>);
    default: return null;
  }
}

// ---------- animales y cosas que se mueven (ficha `norte`) ----------
export type EspecieNorte = 'zarigueya' | 'buho' | 'cangrejo' | 'cuervo' | 'caja';
export const AnimalNorte: React.FC<{ especie: EspecieNorte; x: number; y?: number; s?: number; voltear?: boolean; opacity?: number; moviendo?: boolean; volando?: boolean; f: number; color?: string; colaPelada?: boolean; ojosRojos?: boolean; aros?: boolean; cuernos?: boolean; abierta?: boolean }> = ({ especie, x, y = SUELO, s = 1, voltear, opacity = 1, moviendo, volando, f, color, colaPelada, ojosRojos, aros, cuernos, abierta }) => {
  const p = moviendo ? Math.sin(f / 4) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {especie === 'zarigueya' && ( // zarigüeya: gris, cara blanca, orejas negras; cola peluda (antes) o pelada
        <g>
          {colaPelada
            ? <path d={`M-50 -30 C -90 ${-20 + p * 4}, -120 ${-50 + p * 4}, -140 -30 C -150 -16, -136 -6, -126 -14`} stroke="#E8A8A0" strokeWidth={9} fill="none" strokeLinecap="round" />
            : <path d={`M-48 -40 C -90 ${-40 + p * 4}, -130 ${-70 + p * 4}, -150 -44 C -150 -20, -120 -18, -100 -30 C -80 -40, -64 -30, -48 -22 Z`} fill="#C8C2B8" stroke={L} strokeWidth={2.5} />}
          {[-30, -10, 22, 42].map((lx, i) => <path key={i} d={`M${lx} -18 l ${(i % 2 ? 3 : -3) + p * 4 * (i % 2 ? 1 : -1)} 18 h 10`} stroke={L} strokeWidth={6} fill="none" strokeLinecap="round" />)}
          <path d={suave([[-54, -24], [-46, -58], [0, -70], [40, -60], [62, -44], [56, -22], [10, -16]], true)} fill="#A8A29A" stroke={L} strokeWidth={2.5} />
          <path d="M52 -54 C 70 -66, 92 -56, 104 -40 C 96 -34, 76 -30, 56 -32 Z" fill="#F2EEE4" stroke={L} strokeWidth={2.2} />
          <circle cx={104} cy={-40} r={4.5} fill="#E8A8A0" stroke={L} strokeWidth={1.4} />
          <ellipse cx={58} cy={-62} rx={10} ry={12} fill={L} />
          <circle cx={76} cy={-50} r={3} fill={L} />
        </g>
      )}
      {especie === 'buho' && ( // búho/tecolote: `cuernos` (penachos), `aros` blancos, `ojosRojos`
        <g>
          {volando && [-1, 1].map((k) => <path key={k} transform={`rotate(${k * (20 + Math.sin(f * 0.35) * 30)} 0 -60)`} d={`M0 -60 C ${k * 60} -110, ${k * 130} -110, ${k * 150} -80 C ${k * 120} -70, ${k * 100} -60, ${k * 20} -40 Z`} fill={color ?? '#8A6A4A'} stroke={L} strokeWidth={2.5} />)}
          <path d="M-40 -10 C -50 -60, -40 -110, 0 -116 C 40 -110, 50 -60, 40 -10 C 20 0, -20 0, -40 -10 Z" fill={color ?? '#8A6A4A'} stroke={L} strokeWidth={2.5} />
          {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-20 + (i % 3) * 18} ${-60 + Math.floor(i / 3) * 22} q 6 6 12 0`} stroke="#5A4026" strokeWidth={2} fill="none" />)}
          {cuernos && <path d="M-32 -104 L -40 -140 L -14 -112 Z M32 -104 L 40 -140 L 14 -112 Z" fill={color ?? '#8A6A4A'} stroke={L} strokeWidth={2} />}
          {[-15, 15].map((ex) => <g key={ex}>
            {aros && <circle cx={ex} cy={-90} r={17} fill="none" stroke="#FCF7EC" strokeWidth={5} />}
            <circle cx={ex} cy={-90} r={12} fill={ojosRojos ? '#D8442A' : '#F2C94C'} stroke={L} strokeWidth={2} />
            <circle cx={ex} cy={-90} r={5} fill={L} />
          </g>)}
          <path d="M-5 -80 L 0 -68 L 5 -80 Z" fill="#D9A23A" stroke={L} strokeWidth={1.4} />
          {!volando && <path d="M-14 -2 l -4 10 M-10 -2 v 10 M10 -2 v 10 M14 -2 l 4 10" stroke="#D9A23A" strokeWidth={3} strokeLinecap="round" />}
        </g>
      )}
      {especie === 'cangrejo' && ( // cangrejo de río (el Cangrejo Rojo cherokee)
        <g>
          {[-20, -6, 8].map((lx, i) => <path key={i} d={`M${lx} -14 l ${-8 + p * 4} 14 M${lx + 4} -14 l ${8 - p * 4} 14`} stroke={L} strokeWidth={2.5} />)}
          <path d={suave([[-70, -16], [-60, -28], [-30, -32], [10, -32], [30, -26], [34, -14], [10, -8], [-30, -8], [-60, -8]], true)} fill={color ?? '#7A6A4A'} stroke={L} strokeWidth={2.2} />
          {[-50, -38, -26].map((sx) => <path key={sx} d={`M${sx} -30 v 20`} stroke={L} strokeWidth={1.5} />)}
          <path d="M-70 -16 L -92 -26 L -90 -6 Z" fill={color ?? '#7A6A4A'} stroke={L} strokeWidth={2} />
          <path d={`M30 -22 C 50 -40, 60 ${-50 + p * 3}, 74 -54`} stroke={color ?? '#7A6A4A'} strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M70 -58 C 84 -76, 104 -70, 104 -58 L 84 -56 L 102 -48 C 96 -36, 76 -40, 70 -58 Z" fill={color ?? '#7A6A4A'} stroke={L} strokeWidth={2} />
          <circle cx={30} cy={-34} r={3} fill={L} />
          <path d="M34 -30 C 60 -50, 80 -46, 96 -40" stroke={L} strokeWidth={1.2} fill="none" />
        </g>
      )}
      {especie === 'cuervo' && ( // cuervo de pie (salta al moverse); al volar, abre las alas. color blanco = antes del hollín
        <g transform={`translate(0 ${moviendo ? -Math.abs(Math.sin(f / 4)) * 14 : 0})`}>
          {volando
            ? [-1, 1].map((k) => <path key={k} transform={`rotate(${k * Math.sin(f * 0.35) * 30} -6 -70)`} d={`M-6 -70 C -10 -140, ${-30 + k * 20} -190, ${-60 + k * 30} -200 C ${-40 + k * 10} -170, -30 -130, -26 -70 Z`} fill={k > 0 ? (color === '#F4F1E8' ? '#E2DDD0' : '#2A2C34') : (color ?? '#15161A')} stroke={L} strokeWidth={2.5} />)
            : null}
          {!volando && <path d="M-6 -4 v -24 M10 -4 v -24 M-14 0 h 14 M2 0 h 16" stroke={L} strokeWidth={4} strokeLinecap="round" />}
          <path d={suave([[-70, -64], [-40, -90], [10, -96], [44, -84], [48, -56], [20, -32], [-30, -34]], true)} fill={color ?? '#15161A'} stroke={L} strokeWidth={2.5} />
          <path d="M-70 -64 L -104 -50 L -98 -40 L -60 -46 Z" fill={color ?? '#15161A'} stroke={L} strokeWidth={2} />
          <path d={suave([[-40, -70], [-10, -80], [24, -64]])} stroke={color === '#F4F1E8' ? '#C8C2B4' : '#3A3C44'} strokeWidth={2} fill="none" />
          <g transform="translate(40 -96)">
            <circle r={26} fill={color ?? '#15161A'} stroke={L} strokeWidth={2.5} />
            <path d="M16 -12 L 62 2 L 18 12 Z" fill={color === '#F4F1E8' ? '#3A3A40' : '#2A2A2E'} stroke={L} strokeWidth={2} />
            <circle cx={8} cy={-6} r={5} fill={K.crema} /><circle cx={9} cy={-6} r={2.4} fill={L} />
          </g>
        </g>
      )}
      {especie === 'caja' && ( // caja de madera simple con tapa (la que llevan los siete hombres)
        <g>
          <rect x={-60} y={-80} width={120} height={80} rx={4} fill="#9A6A40" stroke={L} strokeWidth={3} />
          {[-30, 0, 30].map((bx) => <path key={bx} d={`M${bx} -76 V -4`} stroke="#6E4A2A" strokeWidth={2} />)}
          <g transform={abierta ? 'rotate(-28 60 -80)' : undefined}><rect x={-66} y={-94} width={132} height={16} rx={3} fill="#7A5230" stroke={L} strokeWidth={3} /></g>
          <path d="M-60 -50 h 120" stroke={K.rojo} strokeWidth={5} />
        </g>
      )}
    </g>
  );
};
