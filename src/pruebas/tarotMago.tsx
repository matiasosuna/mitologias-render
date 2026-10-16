// Prueba para Hermes Tarot 444 (otro proyecto): El Mago armado con el motor de personajes, como Thor.
// npx remotion still src/pruebas/tarotMago.tsx t-fila out.png --frame=40
// npx remotion still src/pruebas/tarotMago.tsx t-vertical out.png --frame=40
// npx remotion render src/pruebas/tarotMago.tsx t-demo out.mp4
import React from 'react';
import { Composition, registerRoot, useCurrentFrame, interpolate, Easing, AbsoluteFill } from 'remotion';
import { Personaje, FiltrosHD, CalidadHD, aplicarTema, suave, C, TITULO, TEXTO, type P, type PersonajeProps } from '../comun/vasija';

const N = '#1B1210';                      // tinta
const ROJO = '#C8281E', ROJO_LUZ = '#E04A35', ROJO_OSC = '#7E1A14', BLANCO = '#F7F2E6', AZUL = '#2F6FB0', AZUL_LUZ = '#9CC4EA', ORO = '#E9B949', PELO = '#2A1A12', PELO_LUZ = '#6A4632';
const r1 = (v: number) => v.toFixed(1);
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Tema del tarot sobre el motor: tinta marrón oscura y guardas doradas en vez de rojas. */
const temaTarot = () => { aplicarTema('griegas'); Object.assign(C, { negro: N, purpura: '#C99A2E', blanco: '#FFF3D6', crema: '#F6EBD2', oro: ORO }); };

// ---------- cabeza ----------
/** Pelo oscuro a la altura de la mandíbula, con flequillo y patilla (como en la carta Rider). */
const PeloMago: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 15) * 1.2;
  const pts: P[] = [[-28, 22 + o], [-40, 4], [-36, -26], [-18, -44], [6, -46], [26, -38], [34, -22], [24, -21], [12, -27], [-2, -25], [-12, -18], [-16, -2], [-14, 14], [-20, 24 + o]];
  return (
    <g>
      <path d={suave(pts, true, 0.8)} fill={PELO} stroke={N} strokeWidth={2} strokeLinejoin="round" />
      {[[-30, -22, -32, 18], [-20, -36, -26, 8], [-6, -41, -12, -22], [10, -40, 18, -28]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} Q ${a - 5} ${(b + d) / 2} ${c} ${d}`} stroke={PELO_LUZ} strokeWidth={2} fill="none" strokeLinecap="round" />)}
      <path d="M-12 -6 C -10 4, -10 12, -13 18" stroke={PELO} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Vincha blanca con un nudo atrás. */
const Vincha: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 11) * 2;
  const cintas = `M-36 -18 C -44 -12, -50 ${-2 + o}, -52 ${8 + o} M-36 -18 C -46 -18, -54 ${-10 + o}, -58 ${-2 + o}`;
  return (
    <g>
      <path d={cintas} stroke={N} strokeWidth={6.5} fill="none" strokeLinecap="round" />
      <path d={cintas} stroke={BLANCO} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M-36 -18 C -14 -28, 10 -30, 33 -24" stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M-36 -18 C -14 -28, 10 -30, 33 -24" stroke={BLANCO} strokeWidth={6.5} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Mejilla y ceja suaves (sin cambiar la cara del motor). */
const Rostro: React.FC = () => (
  <g>
    <ellipse cx={14} cy={12} rx={8} ry={5} fill="#E07A5F" opacity={0.28} />
    <path d="M10 -16 Q 18 -20 26 -15" stroke={N} strokeWidth={2.4} fill="none" strokeLinecap="round" />
  </g>
);
/** El infinito sobre la cabeza: respira de luz. luz = brillo extra (0–1). */
const Infinito: React.FC<{ luz?: number }> = ({ luz = 0 }) => {
  const f = useCurrentFrame(), b = 0.55 + 0.45 * Math.sin(f / 10);
  const d = 'M0 -92 C -8 -102, -26 -102, -26 -92 C -26 -82, -8 -82, 0 -92 C 8 -102, 26 -102, 26 -92 C 26 -82, 8 -82, 0 -92 Z';
  return (
    <g transform="translate(-2 0)">
      <path d={d} fill="none" stroke={N} strokeWidth={7} />
      <path d={d} fill="none" stroke={ORO} strokeWidth={3.5} />
      <path d={d} fill="none" stroke="#FFF6D0" strokeWidth={2} opacity={(0.3 + 0.6 * luz) * b} />
      <path d="M-20 -96 C -16 -99, -10 -98, -6 -94" stroke="#FFF3C4" strokeWidth={1.4} fill="none" strokeLinecap="round" />
    </g>
  );
};

// ---------- cuerpo ----------
/** Manto rojo largo que cae por la espalda, con forro oscuro, pliegues y guarda dorada (se mece). */
const MantoRojo: React.FC = () => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f / 17 + k) * (2 + k * 1.4);
  const ruedo: P[] = [[-80 + o(4), -4], [-56 + o(2), 2], [-20, -2]];
  const pts: P[] = [[-14, -310], [-44, -296], [-58 + o(1), -200], [-70 + o(3), -90], ...ruedo, [-6, -150], [6, -292]];
  return (
    <g>
      <path d={suave(pts, true, 0.5)} fill={ROJO} stroke={N} strokeWidth={2.8} strokeLinejoin="round" />
      <path d={suave([[-44, -296], [-58 + o(1), -200], [-70 + o(3), -90], ruedo[0], [-66 + o(3), -40], [-50, -150], [-34, -250]], true, 0.5)} fill={ROJO_OSC} stroke={N} strokeWidth={1.4} />
      {[[-30, -282, -46, -30], [-16, -272, -26, -12], [-40, -250, -58, -60]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} Q ${a - 12} ${(b + d) / 2} ${c} ${d}`} stroke={N} strokeWidth={2.2} fill="none" opacity={0.6} />)}
      <path d={suave([[-28, -292], [-36, -200], [-44, -100]])} stroke={ROJO_LUZ} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d={suave(ruedo)} stroke={ORO} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={suave(ruedo)} stroke="#FFF3C4" strokeWidth={1.6} strokeDasharray="1 7" fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Túnica blanca de arriba, esclavina roja sobre los hombros y cinturón de serpiente. a = ancho. */
const Torso: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 13) * 1.5;
  const torso: P[] = [[-22 * a, -302], [20 * a, -306], [34 * a, -284], [30 * a, -248], [24 * a, -212], [-24 * a, -208], [-30 * a, -250], [-30 * a, -286]];
  const capa: P[] = [[-36 * a, -292], [-20 * a, -312], [6 * a, -314], [30 * a, -302], [36 * a, -282], [26 * a, -268 + o], [8 * a, -272], [-12 * a, -270], [-32 * a, -262 + o]];
  return (
    <g>
      <path d={suave(torso, true)} fill={BLANCO} stroke={N} strokeWidth={2} />
      {[[-6, -280, -10, -214], [10, -282, 12, -216]].map(([a1, b, c, d], i) => <path key={i} d={`M${r1(a1 * a)} ${b} Q ${r1(((a1 + c) / 2) * a - 3)} ${(b + d) / 2} ${r1(c * a)} ${d}`} stroke="#CFC6B2" strokeWidth={2} fill="none" />)}
      <path d={suave(capa, true, 0.6)} fill={ROJO} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={suave(capa.slice(4), false, 0.6)} stroke={ORO} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={suave([[-10 * a, -306], [6 * a, -296], [20 * a, -306]])} stroke={N} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <path d={`M${r1(-31 * a)} -236 C ${r1(-8 * a)} -230, ${r1(14 * a)} -232, ${r1(30 * a)} -238 L ${r1(31 * a)} -224 C ${r1(14 * a)} -218, ${r1(-8 * a)} -216, ${r1(-31 * a)} -222 Z`} fill={AZUL} stroke={N} strokeWidth={2} />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${r1(-26 * a + i * 8 * a)} -228 q 4 -4 8 0`} stroke={AZUL_LUZ} strokeWidth={1.5} fill="none" />)}
      <path d={`M${r1(30 * a)} -238 C ${r1(42 * a)} -244, ${r1(48 * a)} -232, ${r1(40 * a)} -226 C ${r1(36 * a)} -222, ${r1(32 * a)} -224, ${r1(30 * a)} -226 Z`} fill={AZUL} stroke={N} strokeWidth={1.8} />
      <circle cx={r1(40 * a)} cy={-235} r={1.7} fill={ORO} />
      <path d={`M${r1(46 * a)} -230 l 5 1 m -5 -1 l 5 -3`} stroke={ROJO} strokeWidth={1.2} strokeLinecap="round" />
    </g>
  );
};
/** Varita blanca de doble punta, con brillo y chispas. luz = intensidad (0–1). */
const Varita: React.FC<{ luz?: number }> = ({ luz = 0 }) => {
  const f = useCurrentFrame(), b = 0.5 + 0.5 * Math.sin(f / 8);
  return (
    <g>
      <ellipse cx={0} cy={-76} rx={18 + 22 * luz} ry={18 + 22 * luz} fill="#FFF8DA" opacity={(0.3 + 0.5 * luz) * b} filter="url(#blurTarot)" />
      <rect x={-4.5} y={-70} width={9} height={110} rx={4} fill={BLANCO} stroke={N} strokeWidth={2} />
      <path d="M-1.5 -64 L -1.5 34" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
      {[-74, 44].map((y) => <path key={y} d={`M0 ${y - 11} L 6.5 ${y} L 0 ${y + 11} L -6.5 ${y} Z`} fill={BLANCO} stroke={N} strokeWidth={2} />)}
      {luz > 0 && Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + f / 20, r = 28 + 10 * Math.sin(f / 6 + i);
        return <path key={i} d={`M${r1(Math.cos(a) * r)} ${r1(-76 + Math.sin(a) * r)} l 0 -6 l 2 6 l 6 0 l -6 2 l 0 6 l -2 -6 l -6 0 Z`} fill="#FFF6D0" opacity={luz * (0.5 + 0.5 * Math.sin(f / 4 + i))} />;
      })}
    </g>
  );
};

const mago = (luz = 0): Partial<PersonajeProps> => ({
  s: 1.06, barba: false, tocado: null, piel: '#E8B88E', pelo: 'none', ropa: 'larga', ropaColor: BLANCO, brazoSuave: true, hd: true,
  adornos: { detras: <MantoRojo />, cabeza: <><PeloMago /><Vincha /><Rostro /><Infinito luz={luz} /></>, cuerpo: <Torso a={1} />, mano: <Varita luz={luz} /> },
});

// ---------- escenario (la carta Rider: cielo amarillo, arco de rosas, mesa con las cuatro herramientas) ----------
const Rosa: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 14 }) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={r1(Math.cos((a * Math.PI) / 180) * r * 0.55)} cy={r1(Math.sin((a * Math.PI) / 180) * r * 0.55)} r={r * 0.62} fill="#C42A2A" stroke={N} strokeWidth={1.6} />)}
    <circle r={r * 0.5} fill="#E0473F" stroke={N} strokeWidth={1.4} />
    <path d={`M${r1(-r * 0.25)} 0 a ${r1(r * 0.25)} ${r1(r * 0.25)} 0 1 1 ${r1(r * 0.3)} ${r1(r * 0.12)}`} stroke={N} strokeWidth={1.2} fill="none" />
  </g>
);
const Hoja: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => <path d="M0 0 C 8 -10, 22 -10, 30 0 C 22 10, 8 10, 0 0 Z" transform={`translate(${x} ${y}) rotate(${rot})`} fill="#4E7F3A" stroke={N} strokeWidth={1.6} />;
const Lirio: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 0 L 0 -40" stroke="#4E7F3A" strokeWidth={4} />
    {[-30, 0, 30].map((a) => <path key={a} d="M0 -40 C -6 -52, -4 -66, 0 -72 C 4 -66, 6 -52, 0 -40 Z" transform={`rotate(${a} 0 -40)`} fill="#FBF7EC" stroke={N} strokeWidth={1.8} />)}
  </g>
);
const Mesa: React.FC = () => (
  <g>
    <path d="M1080 650 L 1320 650 L 1310 670 L 1090 670 Z" fill="#B5643A" stroke={N} strokeWidth={3} />
    <path d="M1090 670 L 1310 670 L 1310 760 L 1090 760 Z" fill="#8E4A2A" stroke={N} strokeWidth={3} />
    <path d="M1100 700 L 1300 700" stroke="#C99A2E" strokeWidth={4} />
    <path d="M1105 760 L 1105 820 M1295 760 L 1295 820" stroke={N} strokeWidth={10} />
    <path d="M1112 600 L 1146 600 L 1138 628 L 1120 628 Z" fill={ORO} stroke={N} strokeWidth={2} /><path d="M1129 628 L 1129 646 M1118 648 L 1140 648" stroke={N} strokeWidth={3} />
    <path d="M1160 642 L 1232 638 L 1234 645 L 1162 649 Z" fill="#D7DCE6" stroke={N} strokeWidth={2} /><path d="M1226 630 L 1228 652" stroke={N} strokeWidth={4} />
    <circle cx={1280} cy={630} r={18} fill={ORO} stroke={N} strokeWidth={2.4} />
    <path d="M1280 617 L 1287 639 L 1268 625 L 1292 625 L 1273 639 Z" fill="none" stroke={N} strokeWidth={1.6} />
  </g>
);
const Escenario: React.FC<{ luz?: number }> = ({ luz = 0 }) => (
  <>
    <defs>
      <radialGradient id="luz" cx=".5" cy=".38" r=".7"><stop offset="0" stopColor="#FFF3B8" stopOpacity={0.75 + 0.2 * luz} /><stop offset="1" stopColor="#E8C14E" stopOpacity={0} /></radialGradient>
      <filter id="blurTarot" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation={10} /></filter>
    </defs>
    <rect width={1920} height={1080} fill="#E8C14E" />
    <rect width={1920} height={1080} fill="url(#luz)" />
    <path d="M440 40 Q 960 -70 1480 40" stroke="#4E7F3A" strokeWidth={14} fill="none" />
    {Array.from({ length: 14 }, (_, i) => { const x = 460 + i * 77, y = 42 - Math.sin((i / 13) * Math.PI) * 54; return <g key={i}><Hoja x={x - 10} y={y + 14} rot={30 + i * 17} /><Rosa x={x} y={y} r={i % 2 ? 12 : 15} /></g>; })}
    <rect y={820} width={1920} height={260} fill="#7FA857" /><rect y={820} width={1920} height={6} fill={N} />
    <Mesa />
    {[560, 650, 1380, 1460].map((x, i) => <Lirio key={x} x={x} y={860 + (i % 2) * 14} />)}
    {[600, 700, 1340, 1430, 1500].map((x, i) => <g key={x}><Hoja x={x - 24} y={880 + (i % 2) * 10} rot={-20} /><Rosa x={x} y={872 + (i % 2) * 10} r={13} /></g>)}
  </>
);

// ---------- composiciones ----------
const POSES: { t: string; p: Partial<PersonajeProps> }[] = [
  { t: 'As above', p: { brazo: [92, 78], brazoAtras: [12, 4], cabeza: -4 } },
  { t: 'Walking', p: { accion: 'caminar' } },
  { t: 'Speaking', p: { brazo: [70, 40], brazoAtras: [20, 10], cabeza: -3, boca: true } },
];
const Fila: React.FC = () => {
  temaTarot();
  return (
    <AbsoluteFill>
      <CalidadHD.Provider value={true}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <FiltrosHD /><Escenario />
          {POSES.map((o, i) => <Personaje key={o.t} {...mago(i === 0 ? 1 : 0)} {...o.p} x={420 + i * 540} y={820} s={1.25} />)}
          {POSES.map((o, i) => <text key={o.t} x={420 + i * 540} y={1000} textAnchor="middle" fontFamily={TITULO} fontWeight={700} fontSize={40} fill={BLANCO} stroke={N} strokeWidth={6} paintOrder="stroke">{o.t}</text>)}
        </svg>
      </CalidadHD.Provider>
    </AbsoluteFill>
  );
};

/** Marco vertical de Hermes Tarot: título arriba, escena en el medio, nombre de la carta abajo. */
const Marco: React.FC<{ children: React.ReactNode; vista: string; sub?: React.ReactNode }> = ({ children, vista, sub }) => (
  <AbsoluteFill style={{ backgroundColor: '#12142E' }}>
    <div style={{ position: 'absolute', top: 110, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 86, color: '#F2B84B' }}>Who is The Magician?</div>
    <div style={{ position: 'absolute', left: 0, top: 300, width: 1080, height: 1160, overflow: 'hidden' }}>
      <CalidadHD.Provider value={true}><svg viewBox={vista} width="1080" height="1160" preserveAspectRatio="xMidYMax slice"><FiltrosHD />{children}</svg></CalidadHD.Provider>
    </div>
    <div style={{ position: 'absolute', top: 1500, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 104, letterSpacing: 10, color: '#ECE7F6' }}>THE MAGICIAN</div>
    {sub}
    <div style={{ position: 'absolute', bottom: 50, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 36, letterSpacing: 4, color: '#F2B84B' }}>☿ HERMES TAROT 444</div>
  </AbsoluteFill>
);
const Vertical: React.FC = () => {
  temaTarot();
  return (
    <Marco vista="520 -40 900 900" sub={<div style={{ position: 'absolute', top: 1680, width: '100%', textAlign: 'center', fontFamily: TEXTO, fontSize: 44, color: '#A9A5C8' }}>As above, so below · Arcana I</div>}>
      <Escenario luz={1} />
      <Personaje {...mago(1)} brazo={[92, 78]} brazoAtras={[12, 4]} cabeza={-4} x={920} y={820} s={1.75} />
    </Marco>
  );
};

/** Demo animada de 7 s: entra caminando hasta la mesa, se para, levanta la varita y señala la tierra. */
const Demo: React.FC = () => {
  temaTarot();
  const f = useCurrentFrame();
  const camina = f < 60;
  const x = interpolate(f, [0, 60], [640, 900], { ...cl, easing: Easing.out(Easing.quad) });
  const sube = interpolate(f, [80, 110], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const luz = interpolate(f, [100, 130], [0, 1], cl);
  const brazo: [number, number] = [10 + 82 * sube, 12 + 66 * sube];
  const brazoAtras: [number, number] = [18 - 6 * sube, 10 - 6 * sube];
  const zoom = interpolate(f, [0, 168], [0, 60], cl);
  const vista = `${560 + zoom} ${-20 + zoom * 0.8} ${880 - zoom * 1.6} ${900 - zoom * 1.6}`;
  const sub = f > 116 ? 'As above… so below.' : f > 66 ? 'Look at this card.' : '';
  const palabras = sub.split(' ');
  const k = f > 116 ? Math.min(palabras.length - 1, Math.floor((f - 116) / 12)) : Math.min(palabras.length - 1, Math.floor((f - 66) / 10));
  return (
    <Marco vista={vista} sub={sub ? (
      <div style={{ position: 'absolute', top: 1660, width: '100%', textAlign: 'center', fontFamily: '"Arial Rounded MT Bold", Arial, sans-serif', fontSize: 62, color: '#FFFFFF', WebkitTextStroke: '10px #000', paintOrder: 'stroke' }}>
        {palabras.map((w, i) => <span key={i} style={{ color: i === k ? '#FFE100' : '#FFFFFF' }}>{w} </span>)}
      </div>
    ) : null}>
      <Escenario luz={luz} />
      <Personaje {...mago(luz)} accion={camina ? 'caminar' : 'parado'} brazo={camina ? undefined : brazo} brazoAtras={camina ? undefined : brazoAtras} cabeza={-4 * sube} x={x} y={820} s={1.75} />
    </Marco>
  );
};

registerRoot(() => (
  <>
    <Composition id="t-fila" component={Fila} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="t-vertical" component={Vertical} durationInFrames={200} fps={24} width={1080} height={1920} />
    <Composition id="t-demo" component={Demo} durationInFrames={168} fps={24} width={1080} height={1920} />
  </>
));
