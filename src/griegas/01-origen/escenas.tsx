// El origen del mundo — escenas en estilo "vasija griega detallada".
import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import {
  C, P, SUELO, cl, ap, entre, azar, lerp, suave, Escenario, Capa, Personaje, PersonajeProps, Fuego, Chispas, Estrellas, Luna, Sol,
  Olivo, Monte, Templo, Olas, Nube, Relampago, Suelo, Rotulo, Inc, Borde,
} from '../../comun/vasija';
import type { EscenaV } from '../../comun/VideoVasija';
import {
  mano, boca, Ciclope, Hecatonquiro, Alas, Bebe, Roca, Onfalo, Cabra, Cueva, Grieta, Remolino, Boveda, Esfera, Yunque, Cadena,
  Puertas, Casco, Ondas, Brote, Lagrimas, Ave, Tajo,
} from './piezas';

// ---------- utilidades ----------
type Cam = [number, number, number][];
/** Visible entre a y b, con fundidos. */
const vis = (f: number, a: number, b: number, d = 15) => Math.min(ap(f, a, d), 1 - ap(f, b, d));
/** Misma x de cámara que calcula Escenario. */
const camX = (f: number, k: Cam) => (k.length > 1 ? interpolate(f, k.map((c) => c[0]), k.map((c) => c[1]), { ...cl, easing: Easing.inOut(Easing.sin) }) : k[0][1]);
/** Parallax dentro de un plano cuyo origen de cámara es x0 (se usa dentro de Capa p=1). */
const Prof: React.FC<{ p: number; cx: number; x0: number; children: React.ReactNode }> = ({ p, cx, x0, children }) => <g transform={`translate(${(1 - p) * (cx - x0)} 0)`}>{children}</g>;
const Plano: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (o <= 0.002 ? null : <g opacity={o}>{children}</g>);
const Oscuro: React.FC<{ o: number; color?: string }> = ({ o, color = '#0F0B09' }) => (o <= 0 ? null : <rect x={-4000} y={-200} width={20000} height={1400} fill={color} opacity={o} />);
/** Recorte que oculta todo lo que está bajo la línea y (para figuras que emergen). */
const Sobre: React.FC<{ id: string; y?: number; children: React.ReactNode }> = ({ id, y = SUELO, children }) => (
  <g>
    <defs><clipPath id={id}><rect x={-4000} y={-400} width={20000} height={y + 400} /></clipPath></defs>
    <g clipPath={`url(#${id})`}>{children}</g>
  </g>
);
/** Halo de luz. */
const Halo: React.FC<{ x: number; y: number; r: number; o: number; blanco?: boolean }> = ({ x, y, r, o, blanco }) => (o <= 0 ? null : <circle cx={x} cy={y} r={r} fill={blanco ? 'url(#haloBlanco)' : 'url(#halo)'} opacity={o} style={{ mixBlendMode: 'screen' }} />);
/** Antorcha en pie. */
const Pebetero: React.FC<{ x: number; f: number; s?: number }> = ({ x, f, s = 1 }) => (
  <g transform={`translate(${x} ${SUELO}) scale(${s})`}>
    <path d="M-30 0 L-8 -40 L-8 -200 L8 -200 L8 -40 L30 0 Z" fill={C.negro} />
    <path d="M-40 -200 Q 0 -170 40 -200 Z" fill={C.negro} />
    <Borde d="M-36 -204 H36" w={7} />
    <g transform="translate(0 -206) scale(0.5)"><Fuego f={f} /></g>
  </g>
);
/** Rayo dorado suelto (objeto que vuela). */
const RayoSuelto: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -10 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle cx={0} cy={-40} r={80} fill="url(#halo)" opacity={0.7} style={{ mixBlendMode: 'screen' }} />
    <path d="M-4 -130 L22 -128 L6 -64 L30 -64 L-6 30 L4 -36 L-22 -36 Z" fill={C.oro} stroke={C.negro} strokeWidth={3} />
  </g>
);
const TridenteSuelto: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle cx={0} cy={-80} r={80} fill="url(#halo)" opacity={0.5} style={{ mixBlendMode: 'screen' }} />
    <path d="M0 110 L0 -150" stroke={C.negro} strokeWidth={9} strokeLinecap="round" />
    <path d="M-32 -194 C -34 -160, -20 -146, 0 -146 C 20 -146, 34 -160, 32 -194 M0 -206 V-146" stroke={C.negro} strokeWidth={8} fill="none" />
    <path d="M-32 -194 l-8 14 M32 -194 l8 14 M0 -206 l-7 12 M0 -206 l7 12" stroke={C.negro} strokeWidth={6} />
  </g>
);
const HozSuelta: React.FC<{ x: number; y: number; s?: number; rot?: number; brillo?: number }> = ({ x, y, s = 1, rot = 0, brillo = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {brillo > 0 && <circle cy={-60} r={140} fill="url(#haloBlanco)" opacity={brillo} />}
    <path d="M0 60 L0 -60" stroke={C.negro} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 -60 C 10 -150, 120 -160, 140 -80 C 110 -120, 40 -115, 6 -50 Z" fill="#DCD6C8" stroke={C.negro} strokeWidth={4} />
    <Inc d="M20 -100 C 50 -130, 100 -130, 124 -96" c={C.negro} w={1.6} />
  </g>
);
const SueloL: React.FC = () => <Suelo desde={-1200} hasta={13200} />;
/** Figura que tiembla levemente (miedo, esfuerzo). */
const temblor = (f: number, k: number) => Math.sin(f * 1.7) * k;

// Dioses recurrentes
const Zeus: React.FC<PersonajeProps> = (p) => <Personaje tocado="corona" objeto="rayo" capa={C.purpura} brazo={[120, 30]} {...p} />;
const Poseidon: React.FC<PersonajeProps> = (p) => <Personaje objeto="tridente" tocado="cinta" brazo={[60, 60]} {...p} />;
const Hades: React.FC<PersonajeProps> = (p) => <Personaje objeto="cetro" tocado="cinta" ropa="larga" capa="#2A1A14" brazo={[50, 50]} {...p} />;
const Cronos: React.FC<PersonajeProps> = (p) => <Personaje gigante tocado="corona" capa={C.purpura} canas={false} {...p} />;
const Rea: React.FC<PersonajeProps> = (p) => <Personaje mujer tocado="velo" {...p} />;
const Titan: React.FC<PersonajeProps & { i?: number }> = ({ i = 0, ...p }) => <Personaje ropa="armadura" tocado="casco" escudo objeto="lanza" emblema={(['gorgona', 'leon', 'pulpo', 'trisquel'] as const)[i % 4]} gigante {...p} />;

// =====================================================================
// 1. El Caos
const CaosE: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const nada = [ap(f, at(0) + 34, 14), ap(f, at(0) + 56, 14), ap(f, at(0) + 78, 14)];
  const disuelve = ap(f, at(0) + 150, 30);
  const caos = ap(f, at(1) - 20, 50);
  const luz = ap(f, at(2) + 10, 70);
  const linea = entre(f, at(2) + 70, dur - 10, 0, 1);
  const cam: Cam = [[0, 0, 1], [at(1), 0, 1.04], [at(2), 0, 1.1], [dur, 0, 1.22]];
  const vineta = (i: number, cx: number, cont: React.ReactNode) => (
    <g key={i} transform={`translate(${cx} 470) scale(${1 + disuelve * 0.4})`} opacity={nada[i] * (1 - disuelve)}>
      <circle r={150} fill="none" stroke={C.crema} strokeWidth={3} strokeDasharray="4 10" />
      {cont}
      <path d="M-110 110 L110 -110" stroke={C.purpura} strokeWidth={10} strokeLinecap="round" opacity={ap(f, at(0) + 50 + i * 22, 10)} />
    </g>
  );
  return (
    <Escenario dur={dur} cielo="inframundo" camara={cam}>
      <Capa p={0.1}><g opacity={0.35 + caos * 0.3}><Estrellas f={f} n={50} area={[-200, 140, 2300, 600]} seed={3} /></g></Capa>
      {/* nada: ni cielo, ni tierra, ni mar */}
      <Capa p={0.4}>
        {vineta(0, 480, (
          <g>
            <path d="M-110 60 C -110 -90, 110 -90, 110 60" stroke={C.crema} strokeWidth={6} fill="none" />
            {[[-50, -10], [0, -40], [50, -10], [-20, 20], [30, 25]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={5} fill={C.blanco} />)}
          </g>
        ))}
        {vineta(1, 960, (
          <g>
            <path d="M-120 70 C -60 -20, 60 -20, 120 70 Z" fill="none" stroke={C.crema} strokeWidth={6} />
            <g transform="translate(0 30) scale(0.32)"><Olivo x={0} y={0} f={f} color={C.crema} /></g>
          </g>
        ))}
        {vineta(2, 1440, (
          <g>
            {[0, 1, 2].map((j) => <path key={j} d={`M-110 ${-20 + j * 36} q 28 -26 55 0 t 55 0 t 55 0 t 55 0`} stroke={C.crema} strokeWidth={6} fill="none" />)}
          </g>
        ))}
        {/* polvo de lo que se disuelve */}
        {disuelve > 0 && disuelve < 1 && Array.from({ length: 60 }, (_, i) => {
          const cx = [480, 960, 1440][i % 3], a = azar(i) * Math.PI * 2, r = disuelve * (80 + azar(i + 4) * 260);
          return <circle key={i} cx={cx + Math.cos(a) * r} cy={470 + Math.sin(a) * r} r={3} fill={C.crema} opacity={1 - disuelve} />;
        })}
      </Capa>
      {/* el Caos */}
      <Capa p={0.25}><Remolino x={960} y={460} r={760} brazos={7} vel={0.35} color={C.barroOscuro} o={caos * 0.55 * (1 - luz * 0.5)} grosor={26} /></Capa>
      <Capa p={0.55}><Remolino x={960} y={460} r={520} brazos={5} vel={-0.7} color={C.negro} o={caos * (1 - luz * 0.6)} grosor={18} /></Capa>
      <Capa p={0.8}>
        <Remolino x={960} y={460} r={300} brazos={4} vel={1.4} color={C.purpura} o={caos * 0.8 * (1 - luz * 0.7)} grosor={9} />
        {Array.from({ length: 70 }, (_, i) => {
          const a = azar(i) * Math.PI * 2 + f * 0.012 * (1 + azar(i + 1)), r = 120 + azar(i + 7) * 640 - luz * 120;
          return <circle key={i} cx={960 + Math.cos(a) * r} cy={460 + Math.sin(a) * r * 0.6} r={2 + azar(i + 2) * 3} fill={i % 4 ? C.crema : C.oro} opacity={caos * (0.3 + 0.4 * Math.sin(f / 7 + i))} />;
        })}
      </Capa>
      <Rotulo x={960} y={250} texto="CAOS" o={vis(f, at(1) + 40, at(2) + 30, 20)} tam={64} />
      {/* nace la luz */}
      <Capa p={1}>
        <Halo x={960} y={460} r={60 + luz * 520} o={luz} blanco />
        <Halo x={960} y={460} r={40 + luz * 260} o={luz * 0.8} />
        {luz > 0 && Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2 + f * 0.004, r0 = 40 + luz * 60, r1 = r0 + luz * (160 + (i % 3) * 90);
          return <path key={i} d={`M${960 + Math.cos(a) * r0} ${460 + Math.sin(a) * r0} L${960 + Math.cos(a) * r1} ${460 + Math.sin(a) * r1}`} stroke={C.oro} strokeWidth={i % 2 ? 3 : 6} strokeLinecap="round" opacity={luz * 0.8} />;
        })}
        <circle cx={960} cy={460} r={8 + luz * 26} fill={C.blanco} opacity={luz} />
        <Chispas x={960} y={500} f={f} n={Math.round(luz * 30)} viento={0} />
        {/* la primera línea del mundo */}
        <path d={`M${960 - linea * 1300} ${SUELO} L${960 + linea * 1300} ${SUELO}`} stroke={C.purpura} strokeWidth={8} />
        <path d={`M${960 - linea * 1300} ${SUELO} L${960 + linea * 1300} ${SUELO}`} stroke={C.blanco} strokeWidth={3} strokeDasharray="1 12" strokeLinecap="round" />
      </Capa>
    </Escenario>
  );
};

// =====================================================================
// 2. Los primeros dioses
const PrimordialesE: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const cam: Cam = [[0, 0, 1.05], [at(1) - 10, 0, 1], [at(1) + 50, 520, 1], [at(3) - 10, 560, 1.02], [at(3) + 50, 0, 1], [dur, 0, 1.06]];
  const suelo = ap(f, 0, 30);
  const sube = entre(f, at(0) + 5, at(0) + 100, 0, 1, Easing.out(Easing.cubic));
  const yG = SUELO + 200 + (1 - sube) * 560;
  const brazos = entre(f, at(0) + 40, at(0) + 120, 0, 1);
  const abre = entre(f, at(1) + 10, at(1) + 70, 0, 1, Easing.out(Easing.back(1.4)));
  // Eros: entra volando en arco y se queda flotando
  const tE = entre(f, at(2) - 10, at(2) + 70, 0, 1, Easing.out(Easing.cubic));
  const sale = entre(f, at(3) + 20, at(3) + 70, 0, 1, Easing.in(Easing.cubic));
  const ex = interpolate(tE, [0, 1], [2500, 1330]) - sale * 1400 + Math.sin(f / 20) * 14;
  const ey = SUELO - 170 - Math.sin(tE * Math.PI) * 120 + Math.sin(f / 13) * 12 - sale * 300;
  const noche = ap(f, at(3) - 5, 40);
  const xN = entre(f, at(3), at(3) + 80, -250, 440, Easing.out(Easing.quad));
  const xEr = entre(f, at(3) + 15, at(3) + 95, 2150, 1250, Easing.out(Easing.quad));
  const andaN = f < at(3) + 78, andaE = f < at(3) + 93;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.15}><g opacity={noche}><Estrellas f={f} n={60} area={[-200, 140, 2600, 420]} seed={8} /><Luna x={260} y={230} /></g></Capa>
      <Capa p={0.3}>
        <Monte x={250} ancho={620} alto={430 * sube} o={0.55} />
        <Monte x={1900} ancho={700} alto={380 * ap(f, at(0) + 30, 60)} o={0.5} />
      </Capa>
      <Capa p={0.6}>
        <g opacity={0.45 * ap(f, at(0) + 50, 40)}>
          <Olivo x={420} y={SUELO - 20} s={0.8} f={f} color={C.barroOscuro} />
          <Olivo x={2100} y={SUELO - 20} s={0.9} f={f + 30} color={C.barroOscuro} />
        </g>
      </Capa>
      <Oscuro o={noche * 0.45} color="#1A0E0A" />
      <Capa p={1}>
        <g opacity={suelo}><SueloL /></g>
        {/* Gea emerge de la tierra */}
        <Halo x={960} y={SUELO - 200} r={420} o={sube * 0.5} />
        <Sobre id="clipGea">
          <Personaje x={960} y={yG} s={1.45} mujer tocado="diadema" capa={C.purpura} brazo={[40 + brazos * 75, 20 + brazos * 20]} brazoAtras={[-30 - brazos * 120, -20]} cabeza={brazos * 8} />
        </Sobre>
        {[640, 720, 820, 1100, 1190, 1290].map((x, i) => <Brote key={x} x={x} c={ap(f, at(0) + 60 + i * 9, 30)} s={0.9 + (i % 2) * 0.3} flor={i % 2 === 0} />)}
        <Rotulo x={700} y={430} texto="GEA" o={vis(f, at(0) + 50, at(1) + 40)} tam={46} />
        {/* el Tártaro se abre */}
        <g opacity={ap(f, at(1) - 10, 20)}>
          <Grieta x={1820} abre={abre} alto={300} />
          <Chispas x={1820} y={SUELO - 60} f={f} n={Math.round(abre * 26)} viento={0.3} />
        </g>
        <Rotulo x={1820} y={380} texto="TÁRTARO" o={vis(f, at(1) + 40, at(2) + 30)} tam={42} />
        {/* Eros */}
        {[1700, 1560, 1450, 1250, 1150].map((x, i) => <Brote key={x} x={x} c={ap(f, at(2) + 20 + i * 8, 25)} s={0.7} flor />)}
        {f > at(2) - 12 && sale < 1 && (
          <g>
            <Chispas x={ex - 30} y={ey - 200} f={f} n={20} viento={2.5} />
            <Alas x={ex} y={ey} s={0.85} voltear inclinar={18} color={C.negro} />
            <Personaje x={ex} y={ey} s={0.85} voltear barba={false} ropa="desnudo" tocado="cinta" accion="correr" fase={f * 0.08} inclinar={18} brazo={[110, 20]} />
          </g>
        )}
        <Rotulo x={1330} y={300} texto="EROS" o={vis(f, at(2) + 50, at(3) + 10)} tam={42} />
        {/* Nix y Érebo */}
        {f > at(3) - 5 && (
          <g>
            <Alas x={xN} s={1.15} color={C.purpura} aleteo={0.3} />
            <Personaje x={xN} s={1.15} mujer tocado="velo" capa="#2A1A2E" accion={andaN ? 'caminar' : 'parado'} brazo={andaN ? undefined : [120, 30]} />
            <Estrellas f={f} n={14} area={[xN - 160, SUELO - 420, 200, 300]} seed={5} />
            <Personaje x={xEr} s={1.2} voltear contorno capa="#1C1420" accion={andaE ? 'caminar' : 'parado'} brazo={andaE ? undefined : [100, 20]} />
          </g>
        )}
        <Rotulo x={440} y={330} texto="NIX" o={vis(f, at(3) + 70, dur)} tam={40} />
        <Rotulo x={1250} y={330} texto="ÉREBO" o={vis(f, at(3) + 85, dur)} tam={40} />
      </Capa>
    </Escenario>
  );
};

// =====================================================================
// 3. Urano, el cielo
const UranoE: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const cam: Cam = [[0, 40, 1], [at(1), 60, 1], [at(2), 250, 1], [at(2) + 40, 430, 1], [at(3) + 20, 150, 1.02], [dur, 140, 1.03]];
  const boveda = entre(f, at(0) + 10, at(0) + 110, 0, 1, Easing.out(Easing.cubic));
  const urano = ap(f, at(0) + 70, 30);
  const miedo = ap(f, at(2), 20);
  const hunde = (i: number) => entre(f, at(3) + 20 + i * 4, at(3) + 90 + i * 4, 0, 1, Easing.in(Easing.quad));
  const empuja = ap(f, at(3), 25);
  const hijos: { x: number; s: number; t: number; tipo: 'titan' | 'ciclope' | 'hecato'; mujer?: boolean }[] = [
    ...Array.from({ length: 12 }, (_, i) => ({ x: 430 + i * 58, s: 0.42, t: at(1) + 5 + i * 7, tipo: 'titan' as const, mujer: i % 2 === 1 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 1140 + i * 90, s: 0.56, t: at(1) + 130 + i * 12, tipo: 'ciclope' as const })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 1420 + i * 110, s: 0.6, t: at(1) + 205 + i * 12, tipo: 'hecato' as const })),
  ];
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.3}><Monte x={-100} ancho={600} alto={360} o={0.45} /><Monte x={2500} ancho={600} alto={420} o={0.45} /></Capa>
      <Capa p={0.7}><Boveda x={1150} ancho={1250} alto={650 * boveda} id="bovUrano" o={boveda} /></Capa>
      <Capa p={1}>
        <SueloL />
        {/* Gea da a luz al cielo */}
        <Halo x={250} y={500} r={300} o={vis(f, at(0), at(0) + 120, 30) * 0.8} />
        <Sobre id="clipGeaU">
          <Personaje x={250} y={SUELO + 180} s={1.05} mujer tocado="diadema" capa={C.purpura} brazo={[160 - miedo * 60, 10]} brazoAtras={[-150 + miedo * 80, -10]} cabeza={10 - empuja * 30} ojosCerrados={empuja > 0.5} />
        </Sobre>
        <Lagrimas x={290} y={460} f={f} o={empuja} />
        {/* Urano */}
        <Halo x={1880} y={420} r={320} o={urano * (0.4 + miedo * 0.3)} blanco />
        <Personaje x={1880} s={1.55} voltear contorno barba tocado="corona" capa="#2A2238" objeto="cetro" opacity={urano}
          brazo={empuja > 0 ? [100 - empuja * 50, -10 - empuja * 30] : miedo > 0 ? [100 * miedo + 20 * (1 - miedo), 0] : [20, 30]} boca={miedo > 0.5 && empuja < 0.5} cabeza={-empuja * 15} />
        <g opacity={urano}><Estrellas f={f} n={16} area={[1760, SUELO - 520, 160, 300]} seed={21} /></g>
        <Rotulo x={1600} y={260} texto="URANO" o={vis(f, at(0) + 90, at(1) + 20)} tam={46} />
        {/* los hijos */}
        <Sobre id="clipHijos">
          {hijos.map((h, i) => {
            const nace = ap(f, h.t, 14);
            if (nace <= 0) return null;
            const y = SUELO + hunde(i % 12) * 380, s = h.s * (0.3 + nace * 0.7);
            const props = { x: h.x + temblor(f, miedo * 1.5), y, s, inclinar: -miedo * 12, cabeza: miedo * 10 - hunde(i % 12) * 20, opacity: nace };
            if (h.tipo === 'ciclope') return <Ciclope key={i} {...props} brazo={[90 - miedo * 60, 40]} />;
            if (h.tipo === 'hecato') return <Hecatonquiro key={i} {...props} brazo={[140, 10]} />;
            return <Personaje key={i} {...props} mujer={h.mujer} tocado={h.mujer ? 'diadema' : 'cinta'} brazo={miedo > 0 ? [150, -40] : undefined} />;
          })}
        </Sobre>
        {/* polvo al hundirse */}
        {f > at(3) + 20 && Array.from({ length: 30 }, (_, i) => {
          const t = ((f - at(3) - 20 + i * 5) % 50) / 50;
          return <circle key={i} cx={430 + azar(i) * 1300} cy={SUELO - t * 60} r={3 + azar(i + 1) * 4} fill={C.barroOscuro} opacity={(1 - t) * (1 - ap(f, at(3) + 140, 30))} />;
        })}
        <Rotulo x={750} y={560} texto="12 TITANES" o={vis(f, at(1) + 50, at(2) + 10)} tam={34} />
        <Rotulo x={1230} y={520} texto="3 CÍCLOPES" o={vis(f, at(1) + 145, at(2) + 10)} tam={34} />
        <Rotulo x={1530} y={470} texto="3 HECATÓNQUIROS" o={vis(f, at(1) + 220, at(2) + 10)} tam={34} />
      </Capa>
    </Escenario>
  );
};

// =====================================================================
// 4. La hoz de Cronos
const HozE: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const corteB = at(3) - 20, corteC = at(5) - 20;
  const cam: Cam = [[0, 0, 1.08], [at(1), 0, 1], [at(2) + 10, 260, 1], [corteB, 300, 1.02], [corteB + 30, 0, 1], [at(3) + 110, 0, 1.06], [at(4), 0, 1.12], [corteC, 0, 1], [corteC + 30, 2600, 1], [dur, 2600, 1.15]];
  const cx = camX(f, cam);
  const oA = 1 - ap(f, corteB, 25), oB = Math.min(ap(f, corteB, 25), 1 - ap(f, corteC, 25)), oC = ap(f, corteC, 25);
  const forja = ap(f, at(1) + 10, 30);
  const hozSube = entre(f, at(1) + 30, at(1) + 110, 0, 1, Easing.out(Easing.cubic));
  const xC = entre(f, at(2) - 10, at(2) + 80, 2350, 1900, Easing.out(Easing.quad));
  const tomada = f > at(2) + 95;
  // plano B: la noche del ataque
  const baja = entre(f, at(3), at(3) + 100, 0, 1, Easing.inOut(Easing.cubic));
  const golpe = at(3) + 150;
  const tajo = interpolate(f, [golpe, golpe + 16], [0, 1], cl);
  const sube = entre(f, golpe + 6, golpe + 70, 0, 1, Easing.out(Easing.cubic));
  const alto = 900 - baja * 330 + sube * 520;
  const xCB = entre(f, golpe - 40, golpe, 560, 900, Easing.in(Easing.quad));
  const flash = interpolate(f, [golpe + 4, golpe + 8, golpe + 30], [0, 0.85, 0], cl);
  const libres = ap(f, at(4) + 20, 40);
  // plano C: Afrodita
  const emerge = entre(f, at(5), at(5) + 110, 0, 1, Easing.out(Easing.cubic));
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={1}>
        {/* --- Plano A: Gea sufre y forja la hoz --- */}
        <Plano o={oA}>
          <Prof p={0.3} cx={cx} x0={0}><Monte x={1700} ancho={600} alto={360} o={0.4} /><Monte x={-80} ancho={500} alto={300} o={0.4} /></Prof>
          <SueloL />
          <Personaje x={750} y={630} s={1.1} mujer tocado="diadema" capa={C.purpura} cabeza={-18 + forja * 18} ojosCerrados={forja < 0.5} brazo={forja > 0 ? [60 + forja * 40, 10] : [30, 60]} brazoAtras={[-30, -60]} />
          <Lagrimas x={790} y={300} f={f} o={1 - forja} />
          {/* el cuerpo de Gea: una colina con sus hijos atrapados dentro */}
          <path d="M-60 790 C 90 560, 390 420, 750 410 C 1110 420, 1360 560, 1510 790 Z" fill={C.negro} />
          {Array.from({ length: 5 }, (_, r) => Array.from({ length: 6 + r * 2 }, (_, i) => {
            const yy = 460 + r * 60, w = 220 + r * 110, x0 = 750 - w + (i + 0.5) * ((w * 2) / (6 + r * 2));
            return <path key={`${r}-${i}`} d={`M${x0 - 16} ${yy} a 16 11 0 0 1 32 0`} stroke={C.crema} strokeWidth={1.6} fill="none" opacity={0.35} />;
          }))}
          <ellipse cx={750} cy={650} rx={400} ry={115} fill="#3A160C" stroke={C.purpura} strokeWidth={6} />
          <defs><clipPath id="cavidad"><ellipse cx={750} cy={650} rx={400} ry={115} /></clipPath></defs>
          <g clipPath="url(#cavidad)">
            {[450, 545, 640, 735, 830, 925, 1020].map((x, i) => (
              <Personaje key={x} x={x + temblor(f + i * 9, 1.5)} y={760} s={0.4} contorno mujer={i % 3 === 1} voltear={i % 2 === 1} brazo={[150 + Math.sin(f / 10 + i) * 15, -30]} brazoAtras={[-140, -20]} cabeza={tomada ? -20 : 10} />
            ))}
            <Ciclope x={380} y={760} s={0.45} contorno brazo={[160, -20]} />
            <Hecatonquiro x={1110} y={760} s={0.45} voltear contorno />
          </g>
          {/* la forja */}
          <g opacity={forja}>
            <Yunque x={1740} s={1} brasa={forja} />
            <g transform={`translate(1620 ${SUELO})`}><Fuego f={f} s={0.9} /></g>
            <Chispas x={1620} y={SUELO - 90} f={f} n={26} />
          </g>
          {!tomada && <HozSuelta x={1740 - hozSube * 60} y={680 - hozSube * 230} s={0.6 + hozSube * 0.6} rot={-20 + hozSube * 20 + Math.sin(f / 12) * 6} brillo={hozSube} />}
          <Rotulo x={1640} y={300} texto="HOZ DE ADAMANTIO" o={vis(f, at(1) + 80, at(2) + 20)} tam={32} />
          {/* Cronos acepta */}
          {f > at(2) - 12 && (
            <Cronos x={xC} s={1.25} voltear accion={f < at(2) + 78 ? 'caminar' : 'parado'} objeto={tomada ? 'hoz' : null} brazo={tomada ? [150, -10] : f > at(2) + 80 ? [120, 0] : undefined} />
          )}
          <Halo x={xC - 110} y={340} r={150} o={tomada ? 0.6 : 0} blanco />
          <Rotulo x={1900} y={240} texto="CRONOS" o={vis(f, at(2) + 60, corteB)} tam={42} />
        </Plano>
        {/* --- Plano B: la noche del corte --- */}
        <Plano o={oB}>
          <Oscuro o={0.55} color="#1A0E0A" />
          <Boveda x={960} base={SUELO + 40} ancho={1400} alto={alto} id="bovNoche" />
          <Personaje x={1600 - sube * 200} y={SUELO - sube * 500 + baja * 40} s={1.7} voltear contorno capa="#2A2238" tocado="corona" inclinar={-28 * baja + 40 * sube} brazo={[60, 30]} opacity={1 - sube} />
          <SueloL />
          <path d="M150 790 C 400 600, 700 560, 960 560 C 1220 560, 1520 600, 1770 790 Z" fill={C.negro} />
          <Olivo x={560} y={SUELO} s={1.2} f={f} />
          <Cronos x={xCB} s={1.2} objeto="hoz" accion={f > golpe - 40 && f < golpe ? 'correr' : 'parado'} inclinar={f > golpe - 2 && f < golpe + 30 ? 14 : 0}
            brazo={f < golpe - 2 ? [40, 30] : f < golpe + 30 ? [200 - tajo * 120, -10] : [120, -20]} contorno />
          <Tajo x={xCB + 150} y={420} t={tajo} r={200} />
          <Halo x={xCB + 160} y={380} r={500} o={flash} blanco />
          {/* los hijos salen libres */}
          {libres > 0 && [300, 380, 1480, 1560, 1640].map((x, i) => <Personaje key={x} x={x} y={SUELO} s={0.55} contorno voltear={i > 1} mujer={i % 2 === 1} opacity={libres} brazo={[160, -10]} brazoAtras={[-160, 10]} />)}
          <Rotulo x={960} y={330} texto="CIELO" o={vis(f, at(4) + 10, corteC)} tam={40} />
          <Rotulo x={1150} y={748} texto="TIERRA" o={vis(f, at(4) + 40, corteC)} tam={40} />
        </Plano>
        <rect x={-4000} y={-200} width={20000} height={1400} fill={C.blanco} opacity={flash * 0.5} />
        {/* --- Plano C: Afrodita nace de la espuma --- */}
        <Plano o={oC}>
          <Prof p={0.2} cx={cx} x0={2600}><Sol x={2600 + 1650} y={260} r={50} f={f} /></Prof>
          <Prof p={0.5} cx={cx} x0={2600}><Monte x={2600 + 200} ancho={400} alto={200} o={0.5} /></Prof>
          <Halo x={2600 + 960} y={520} r={420} o={emerge * 0.8} blanco />
          <Sobre id="clipAfro" y={700}>
            <Personaje x={2600 + 960} y={SUELO + 30 + (1 - emerge) * 420} s={1.2} mujer tocado="diadema" brazo={[120, 40]} brazoAtras={[-120, -40]} cabeza={8} />
          </Sobre>
          <g transform="translate(2600 0)"><Olas y={690} f={f} color={C.mar} alto={40} /></g>
          {Array.from({ length: 40 }, (_, i) => {
            const t = ((f + i * 7) % 60) / 60, x = 2600 + 960 + (azar(i) - 0.5) * 520 * (0.6 + emerge * 0.6);
            return <circle key={i} cx={x} cy={705 - t * 40} r={3 + azar(i + 3) * 5} fill={C.blanco} opacity={(1 - t) * (0.4 + emerge * 0.6)} />;
          })}
          <Ave x={2600 + 700 + Math.sin(f / 30) * 40} y={260} s={1} f={f} />
          <Ave x={2600 + 1250 - Math.sin(f / 26) * 40} y={300} s={0.8} f={f + 9} />
          <Rotulo x={2600 + 1300} y={430} texto="AFRODITA" o={ap(f, at(5) + 90, 20)} tam={44} />
        </Plano>
      </Capa>
    </Escenario>
  );
};

// =====================================================================
// 5. Cronos devora a sus hijos
const CronosE: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const cam: Cam = [[0, 0, 1], [at(1), 0, 1.02], [at(2), 0, 1.06], [at(3), 60, 1.14], [at(4), 60, 1.14], [dur, 0, 1.04]];
  const xR = entre(f, 10, at(0) + 110, 150, 720, Easing.out(Easing.quad));
  const xK = entre(f, 10, at(0) + 110, 1800, 1170, Easing.out(Easing.quad));
  const anda = f < at(0) + 105;
  const sK = 1.35;
  // tragar: ciclos [inicio, duración]
  const ciclos: [number, number][] = [[at(2) + 20, 120], ...[0, 1, 2, 3, 4].map((i) => [at(3) + i * 28, 28] as [number, number])];
  const actual = ciclos.findIndex(([a, d]) => f >= a && f < a + d);
  let brazoK: [number, number] = [20, 30], bocaK = false, cabezaK = 0, bebe: { p: P; s: number } | null = null, brazoR: [number, number] | undefined;
  if (actual >= 0) {
    const [a, d] = ciclos[actual], t = (f - a) / d;
    brazoR = t < 0.5 ? [80, 10] : undefined;
    const pR = mano(xR, SUELO, 1.1, false, [80, 10]);
    const reach = interpolate(t, [0.2, 0.45, 0.7], [0, 1, 0], cl);
    brazoK = [interpolate(t, [0, 0.45, 0.75], [20, 85, 150], cl), interpolate(t, [0, 0.45, 0.75], [30, 5, -110], cl)];
    const pK = mano(xK, SUELO, sK, true, brazoK);
    const pB = boca(xK, SUELO, sK, true, true);
    bocaK = t > 0.55 && t < 0.92;
    cabezaK = interpolate(t, [0.55, 0.8, 1], [0, 16, 0], cl);
    const p = t < 0.45 ? lerp(pR, pK, interpolate(t, [0.25, 0.45], [0, 1], cl)) : t < 0.75 ? pK : lerp(pK, pB, interpolate(t, [0.75, 0.9], [0, 1], cl));
    bebe = { p, s: interpolate(t, [0, 0.1, 0.8, 0.92], [0, 1, 1, 0], cl) };
    void reach;
  }
  const nombres = ['HESTIA', 'DEMÉTER', 'HERA', 'HADES', 'POSEIDÓN'];
  const tragados = (i: number) => f > ciclos[i + 1][0] + ciclos[i + 1][1] * 0.9;
  const llanto = ap(f, at(4), 25);
  const fantasma = vis(f, at(1) - 5, at(2) + 10, 25);
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.25}><Monte x={960} ancho={900} alto={420} o={0.45} /></Capa>
      <Capa p={0.5}>
        <g opacity={0.55}><Templo x={960} y={SUELO - 40} s={1.15} color={C.barroOscuro} /></g>
        {/* Gea y Urano advierten */}
        <g opacity={fantasma * 0.7}>
          <Halo x={260} y={430} r={260} o={1} blanco />
          <Personaje x={260} s={1.15} mujer tocado="diadema" brazo={[110, 0]} boca contorno />
          <Halo x={1680} y={430} r={260} o={1} blanco />
          <Personaje x={1680} s={1.2} voltear contorno capa="#2A2238" tocado="corona" brazo={[110, 0]} boca />
        </g>
      </Capa>
      <Oscuro o={llanto * 0.35} color="#1A0E0A" />
      <Capa p={1}>
        <SueloL />
        <Pebetero x={440} f={f} />
        <Pebetero x={1480} f={f + 7} />
        <Rea x={xR} s={1.1} accion={anda ? 'caminar' : 'parado'} brazo={brazoR ?? (llanto > 0 ? [150, -150] : anda ? undefined : [40, 40])} cabeza={-llanto * 25} ojosCerrados={llanto > 0.5} />
        <Lagrimas x={xR + 60} y={SUELO - 360} f={f} o={llanto} />
        <Cronos x={xK + llanto * 120} s={sK} voltear={llanto < 0.5} objeto={actual >= 0 ? null : 'hoz'} brazo={brazoK} boca={bocaK} cabeza={cabezaK + fantasma * 12} accion={anda || (llanto > 0 && f < at(4) + 60) ? 'caminar' : 'parado'} />
        {bebe && bebe.s > 0 && <Bebe x={bebe.p[0]} y={bebe.p[1]} s={bebe.s * 0.9} rot={-15} />}
        <Rotulo x={xR} y={330} texto="REA" o={vis(f, at(0) + 80, at(1) + 20)} tam={40} />
        <Rotulo x={xK} y={250} texto="CRONOS" o={vis(f, at(0) + 80, at(1) + 20)} tam={40} />
        {/* los cinco hijos tragados */}
        {f > at(3) - 10 && nombres.map((n, i) => {
          const o = ap(f, ciclos[i + 1][0], 8);
          return (
            <g key={n} opacity={o * (1 - llanto * 0.6)}>
              <Bebe x={300 + i * 170} y={360} s={0.8} rot={0} />
              {tragados(i) && <path d={`M${300 + i * 170 - 40} 390 L${300 + i * 170 + 60} 330`} stroke={C.purpura} strokeWidth={8} strokeLinecap="round" />}
              <Rotulo x={315 + i * 170} y={430} texto={n} o={1} tam={24} />
            </g>
          );
        })}
      </Capa>
    </Escenario>
  );
};

// =====================================================================
// 6. La piedra en pañales
const PiedraE: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const B = 2600, Cx = 5200, D = 7800;
  const cam: Cam = [[0, 0, 1], [at(1) - 25, 280, 1], [at(1) + 5, B, 1], [at(2) - 25, B + 320, 1.04], [at(2) + 5, Cx, 1], [at(3) - 25, Cx + 80, 1.1], [at(3) + 5, D, 1.05], [at(4) - 10, D, 1.1], [at(4) + 40, D + 900, 1], [dur, D + 950, 1.04]];
  const cx = camX(f, cam);
  const oA = 1 - ap(f, at(1) - 25, 25), oB = vis(f, at(1) - 25, at(2) - 25, 25), oC = vis(f, at(2) - 25, at(3) - 25, 25), oD = ap(f, at(3) - 25, 25);
  // A: Rea camina decidida
  const xRA = entre(f, 0, at(1), 250, 1250, Easing.linear);
  // B: Creta
  const xRB = entre(f, at(1), at(1) + 90, B + 300, B + 1050, Easing.out(Easing.quad));
  const nace = ap(f, at(1) + 90, 30);
  // C: el engaño
  const envuelve = ap(f, at(2) + 10, 30);
  const tC = interpolate(f, [at(2) + 60, at(2) + 150], [0, 1], cl);
  const brazoK: [number, number] = [interpolate(tC, [0, 0.45, 0.75], [20, 85, 150], cl), interpolate(tC, [0, 0.45, 0.75], [30, 5, -110], cl)];
  const xRC = Cx + 720, xKC = Cx + 1170;
  const pR = mano(xRC, SUELO, 1.1, false, [80, 10]), pK = mano(xKC, SUELO, 1.35, true, brazoK), pBo = boca(xKC, SUELO, 1.35, true, true);
  const pP = tC < 0.45 ? lerp(pR, pK, interpolate(tC, [0.25, 0.45], [0, 1], cl)) : tC < 0.75 ? pK : lerp(pK, pBo, interpolate(tC, [0.75, 0.9], [0, 1], cl));
  const sP = interpolate(tC, [0.8, 0.92], [1, 0], cl);
  // D: Amaltea y los Curetes
  return (
    <Escenario dur={dur} cielo="noche" camara={cam}>
      <Capa p={0.08}><Estrellas f={f} n={70} area={[-400, 140, 3200, 380]} seed={14} /><Luna x={1650} y={230} /></Capa>
      <Capa p={1}>
        {/* A */}
        <Plano o={oA}>
          <Prof p={0.3} cx={cx} x0={0}><Monte x={1500} ancho={500} alto={330} o={0.55} templo /></Prof>
          <Prof p={0.6} cx={cx} x0={0}><g opacity={0.5}><Olivo x={300} f={f} color={C.barroOscuro} /><Olivo x={1900} f={f + 20} s={0.8} color={C.barroOscuro} /></g></Prof>
          <SueloL />
          <Rea x={xRA} s={1.15} accion="caminar" cabeza={Math.sin(f / 30) * 4} />
          <Olivo x={2100} f={f} s={1.1} />
          <Rotulo x={xRA + 20} y={330} texto="REA" o={vis(f, at(0) + 20, at(1) - 30)} tam={38} />
        </Plano>
        {/* B */}
        <Plano o={oB}>
          <Cueva x={B + 1300} luz={nace} />
          <Rea x={xRB} s={1.05} accion={f < at(1) + 88 ? 'caminar' : 'parado'} brazo={f > at(1) + 88 ? [80, 10] : undefined} opacity={1 - ap(f, at(1) + 120, 20)} />
          {nace > 0 && <Bebe x={B + 1300} y={680} s={1.1} rot={0} halo={nace} />}
          <g transform={`translate(${B} 0)`}><Olas y={740} f={f} color={C.mar} alto={30} /></g>
          <g transform={`translate(0 ${-SUELO + 760})`}><Suelo desde={B + 700} hasta={B + 2400} /></g>
          <Rotulo x={B + 500} y={300} texto="CRETA" o={vis(f, at(1) + 10, at(2) - 25)} tam={48} />
          <Rotulo x={B + 1300} y={500} texto="ZEUS" o={vis(f, at(1) + 110, at(2) - 25)} tam={40} />
        </Plano>
        {/* C */}
        <Plano o={oC}>
          <Prof p={0.5} cx={cx} x0={Cx}><g opacity={0.5}><Templo x={Cx + 960} y={SUELO - 40} s={1.15} color={C.barroOscuro} /></g></Prof>
          <SueloL />
          <Pebetero x={Cx + 420} f={f} />
          <Rea x={xRC} s={1.1} brazo={tC < 0.45 ? [80, 10] : [40, 40]} cabeza={tC > 0.5 ? -8 : 0} />
          <Cronos x={xKC} s={1.35} voltear brazo={brazoK} boca={tC > 0.55 && tC < 0.92} cabeza={interpolate(tC, [0.55, 0.8, 1], [0, 16, 0], cl)} />
          {sP > 0 && (
            <g>
              {envuelve < 1 && <Roca x={pR[0] + 20} y={pR[1] - 30} s={0.45 * (1 - envuelve)} seed={3} color="#8E8478" />}
              <g opacity={envuelve}><Bebe x={pP[0]} y={pP[1]} s={0.9 * sP} piedra rot={-15} /></g>
            </g>
          )}
          <Rotulo x={pR[0] + 10} y={pR[1] - 90} texto="UNA PIEDRA" o={vis(f, at(2) + 20, at(2) + 70)} tam={28} />
        </Plano>
        {/* D */}
        <Plano o={oD}>
          <Cueva x={D + 960} s={1.15} luz={0.9} />
          <Bebe x={D + 880} y={700} s={1} rot={0} halo={0.7} />
          <Cabra x={D + 1060} s={1.2} voltear cabeza={Math.sin(f / 12) * 6} />
          {[0, 1, 2].map((i) => <circle key={i} cx={D + 960 - i * 12} cy={700 + ((f + i * 10) % 30)} r={3} fill={C.blanco} opacity={1 - ((f + i * 10) % 30) / 30} />)}
          <Rotulo x={D + 1100} y={480} texto="AMALTEA" o={vis(f, at(3) + 10, at(4) + 30)} tam={36} />
          {/* Curetes */}
          {[D + 1600, D + 1880, D + 2160].map((x, i) => {
            const g = Math.max(0, Math.sin(f / 4 + i));
            return (
              <g key={x}>
                <Personaje x={x} y={SUELO - g * 14} s={1} voltear={i === 1} ropa="armadura" tocado="casco" escudo objeto="espada" emblema={(['leon', 'pulpo', 'trisquel'] as const)[i]} brazo={[100 + g * 40, -20 - g * 30]} brazoAtras={[60 + g * 20, 40]} accion="parado" />
                <Ondas x={x + (i === 1 ? -40 : 40)} y={500} f={f + i * 5} dir={i === 1 ? -1 : 1} />
              </g>
            );
          })}
          <Rotulo x={D + 1880} y={260} texto="CURETES" o={vis(f, at(4) + 30, dur)} tam={36} />
          <g opacity={ap(f, at(4) + 50, 20)}>
            <Ondas x={D + 2400} y={420} f={f} dir={1} n={4} color={C.oro} />
          </g>
          <Olivo x={D + 2500} f={f} s={0.9} />
        </Plano>
      </Capa>
    </Escenario>
  );
};

// =====================================================================
// 7. El regreso de los hermanos
const RegresoE: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const B = 2600, Cx = 5200;
  const pasoDelfos = at(2) + 40, vuelta = at(3) - 10;
  const cam: Cam = [[0, 0, 1], [at(1) - 25, 420, 1.02], [at(1) + 5, B, 1], [pasoDelfos - 15, B + 60, 1.06], [pasoDelfos + 15, Cx, 1], [vuelta - 20, Cx, 1.1], [vuelta + 15, B, 1], [dur, B + 40, 1.04]];
  const cx = camX(f, cam);
  const oA = 1 - ap(f, at(1) - 25, 25), oB = Math.max(vis(f, at(1) - 25, pasoDelfos - 15, 25), ap(f, vuelta - 20, 25)), oC = vis(f, pasoDelfos - 15, vuelta - 20, 25);
  // A: Zeus crece mientras camina
  const crece = entre(f, 0, at(1) - 20, 0, 1, Easing.linear);
  const xZA = 300 + crece * 1100;
  // B: Metis y la bebida
  const xK = B + 1350, sK = 1.35;
  const tM = interpolate(f, [at(1) + 10, at(1) + 130], [0, 1], cl);
  const xM = B + 1020;
  const brazoK: [number, number] = [interpolate(tM, [0.3, 0.5, 0.8], [20, 85, 150], cl), interpolate(tM, [0.3, 0.5, 0.8], [30, 5, -110], cl)];
  const pM = mano(xM, SUELO, 1.05, false, [85, 5]), pK = mano(xK, SUELO, sK, true, brazoK);
  const copa = tM < 0.5 ? lerp(pM, pK, interpolate(tM, [0.3, 0.5], [0, 1], cl)) : pK;
  const vomita = ap(f, at(2) - 5, 15);
  const tPiedra = interpolate(f, [at(2) + 5, at(2) + 40], [0, 1], cl);
  const pBo = boca(xK, SUELO, sK, true, true, -30 * vomita);
  const piedra: P = [lerp(pBo, [B + 600, SUELO - 40], tPiedra)[0], lerp(pBo, [B + 600, SUELO - 40], tPiedra)[1] - Math.sin(tPiedra * Math.PI) * 200];
  // salen los hermanos
  const hermanos: { n: string; x: number; render: (p: PersonajeProps) => React.ReactNode }[] = [
    { n: 'HESTIA', x: B + 330, render: (p) => <Personaje mujer tocado="velo" {...p} /> },
    { n: 'DEMÉTER', x: B + 470, render: (p) => <Personaje mujer tocado="diadema" objeto="antorcha" brazo={[90, 60]} {...p} /> },
    { n: 'HERA', x: B + 610, render: (p) => <Personaje mujer tocado="corona" objeto="cetro" brazo={[60, 30]} {...p} /> },
    { n: 'HADES', x: B + 750, render: (p) => <Hades {...p} /> },
    { n: 'POSEIDÓN', x: B + 890, render: (p) => <Poseidon {...p} /> },
  ];
  const salidaK = (i: number) => at(3) + 10 + i * 24;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={1}>
        {/* A */}
        <Plano o={oA}>
          <Prof p={0.3} cx={cx} x0={0}><Monte x={1700} ancho={600} alto={380} o={0.45} /></Prof>
          <Cueva x={250} s={0.85} luz={0.5} />
          <SueloL />
          <Olivo x={1900} f={f} s={1} />
          <Zeus x={xZA} s={0.45 + crece * 0.8} accion="caminar" objeto={crece > 0.7 ? 'rayo' : null} brazo={crece > 0.7 ? [110, 30] : undefined} capa={crece > 0.4 ? C.purpura : null} />
          <Ave x={xZA + 200 + Math.sin(f / 20) * 30} y={260} s={1.4} f={f} />
          <Rotulo x={xZA + 170} y={430} texto="ZEUS" o={vis(f, at(0) + 40, at(1) - 30)} tam={40} />
        </Plano>
        {/* B */}
        <Plano o={oB}>
          <Prof p={0.5} cx={cx} x0={B}><g opacity={0.5}><Templo x={B + 1200} y={SUELO - 40} s={1.15} color={C.barroOscuro} /></g></Prof>
          <SueloL />
          <Pebetero x={B + 1750} f={f} />
          <Zeus x={B + 190} s={1.15} brazo={[100, 30]} />
          {f < at(3) + 20 && <Personaje x={xM} s={1.05} mujer tocado="velo" brazo={tM < 0.5 ? [85, 5] : [30, 40]} opacity={1 - ap(f, at(3), 20)} />}
          <Rotulo x={xM} y={340} texto="METIS" o={vis(f, at(1) + 10, at(2))} tam={36} />
          <Cronos x={xK} s={sK} voltear brazo={vomita > 0 ? [60, 40] : brazoK} boca={vomita > 0 || (tM > 0.8 && tM < 0.95)} inclinar={-30 * vomita + temblor(f, vomita * 2)} cabeza={vomita * -10} opacity={1 - ap(f, at(3) + 140, 30) * 0.4} />
          {tM > 0 && tM < 0.95 && vomita === 0 && (
            <g transform={`translate(${copa[0]} ${copa[1]})`}><path d="M-34 -26 Q0 10 34 -26 Z M-3 -12 V6 M-16 8 H16" fill={C.negro} stroke={C.negro} strokeWidth={5} /><path d="M-30 -24 Q 0 -18 30 -24" stroke={C.purpura} strokeWidth={4} fill="none" /></g>
          )}
          {f > at(2) + 5 && f < pasoDelfos && <Bebe x={piedra[0]} y={piedra[1]} s={0.9} piedra rot={tPiedra * 400} />}
          {f > at(2) && f < at(2) + 20 && Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2, r = ((f - at(2)) / 20) * 70;
            return <path key={i} d={`M${pBo[0] + Math.cos(a) * r} ${pBo[1] + Math.sin(a) * r} l ${Math.cos(a) * 20} ${Math.sin(a) * 20}`} stroke={C.crema} strokeWidth={4} />;
          })}
          {hermanos.map((h, i) => {
            const t0 = salidaK(i), t = interpolate(f, [t0, t0 + 26], [0, 1], cl);
            if (f < t0) return null;
            const x = interpolate(t, [0, 1], [pBo[0], h.x]), y = interpolate(t, [0, 1], [pBo[1] + 60, SUELO]) - Math.sin(t * Math.PI) * 160;
            return (
              <g key={h.n}>
                {h.render({ x, y, s: 0.2 + t * 0.78, accion: t < 1 ? 'correr' : 'parado' })}
                <Rotulo x={h.x + 10} y={SUELO - 400} texto={h.n} o={ap(f, t0 + 24, 12)} tam={22} />
              </g>
            );
          })}
        </Plano>
        {/* C: Delfos */}
        <Plano o={oC}>
          <Prof p={0.3} cx={cx} x0={Cx}><Monte x={Cx + 1400} ancho={700} alto={430} o={0.5} templo /></Prof>
          <SueloL />
          <Onfalo x={Cx + 900} s={1.2} brillo={ap(f, pasoDelfos + 20, 30) * 0.7} />
          <Zeus x={Cx + 620} s={1.15} brazo={[70, 40]} objeto={null} />
          {[0, 1].map((i) => {
            const t = entre(f, pasoDelfos + 10, vuelta - 30, 0, 1, Easing.out(Easing.quad));
            const x = i === 0 ? Cx - 100 + t * 980 : Cx + 2000 - t * 1020;
            return <Ave key={i} x={x} y={260 + Math.sin(t * Math.PI) * -30 + i * 20} s={1.3} f={f + i * 5} />;
          })}
          <Rotulo x={Cx + 900} y={500} texto="DELFOS" o={ap(f, pasoDelfos + 20, 20)} tam={44} />
          <Rotulo x={Cx + 900} y={550} texto="CENTRO DEL MUNDO" o={ap(f, pasoDelfos + 45, 20)} tam={24} />
        </Plano>
      </Capa>
    </Escenario>
  );
};

// =====================================================================
// 8. La Titanomaquia
const TitanomaquiaE: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const B = 2600, Cx = 5200, D = 7800;
  const cam: Cam = [[0, 0, 1.06], [at(1), 0, 1.05], [at(1) + 50, 0, 1], [at(3) - 25, 0, 1.02], [at(3) + 5, B, 1], [at(4) - 25, B + 150, 1.06], [at(4) + 5, Cx, 1], [at(5) - 25, Cx + 100, 1.04], [at(5) + 5, D, 1], [dur, D + 120, 1.08]];
  const cx = camX(f, cam);
  const oA = 1 - ap(f, at(3) - 25, 25), oB = vis(f, at(3) - 25, at(4) - 25, 25), oC = vis(f, at(4) - 25, at(5) - 25, 25), oD = ap(f, at(5) - 25, 25);
  // A: choque y diez años
  const carga = entre(f, 0, at(0) + 70, 0, 1, Easing.inOut(Easing.quad));
  const anios = f > at(2) ? Math.min(10, 1 + Math.floor((f - at(2)) / 11)) : 0;
  const sacude = f > at(2) && f < at(3) - 20 ? 1 : 0;
  const sx = sacude * Math.sin(f * 2.3) * 7, sy = sacude * Math.cos(f * 3.1) * 5;
  const romanos = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  // B: Tártaro
  const libera = at(3) + 70, rota = ap(f, libera, 20);
  const xZB = entre(f, at(3), at(3) + 60, B + 100, B + 450, Easing.out(Easing.quad));
  // C: forja
  const regalos = [at(4) + 50, at(4) + 110, at(4) + 170];
  const vuela = (i: number) => interpolate(f, [regalos[i] + 20, regalos[i] + 45], [0, 1], cl);
  const recibe = (i: number) => f > regalos[i] + 45;
  const destinos: P[] = [[Cx + 1300, 420], [Cx + 1520, 440], [Cx + 1740, 420]];
  const martillo = Math.sin(f / 4);
  // D: rocas
  const titanes = [D + 1250, D + 1450, D + 1650, D + 1850];
  const cae = (i: number) => entre(f, at(5) + 50 + i * 18, at(5) + 80 + i * 18, 0, 1, Easing.in(Easing.quad));
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={1}>
        <g transform={`translate(${sx} ${sy})`}>
          {/* A */}
          <Plano o={oA}>
            <Prof p={0.35} cx={cx} x0={0}>
              <Monte x={150} ancho={560} alto={480} o={0.6} templo />
              <Monte x={1780} ancho={560} alto={470} o={0.6} color="#5E2A12" />
              <Rotulo x={150} y={260} texto="OLIMPO" o={vis(f, at(1) + 20, at(3) - 25)} tam={36} />
              <Rotulo x={1780} y={270} texto="OTRIS" o={vis(f, at(1) + 40, at(3) - 25)} tam={36} />
            </Prof>
            <SueloL />
            {/* dioses */}
            <Zeus x={interpolate(carga, [0, 1], [-100, 760])} s={1.1} accion={carga < 1 ? 'correr' : 'parado'} brazo={[125 + Math.sin(f / 6) * 8, 30]} />
            <Poseidon x={interpolate(carga, [0, 1], [-260, 600])} s={1} accion={carga < 1 ? 'correr' : 'parado'} brazo={[100, 40]} />
            <Hades x={interpolate(carga, [0, 1], [-420, 440])} s={1} accion={carga < 1 ? 'correr' : 'parado'} />
            <Personaje x={interpolate(carga, [0, 1], [-560, 290])} s={0.95} mujer tocado="corona" objeto="lanza" escudo brazo={[120, 20]} accion={carga < 1 ? 'correr' : 'parado'} />
            {/* titanes */}
            {[1180, 1360, 1540, 1720].map((x, i) => <Titan key={x} i={i} x={interpolate(carga, [0, 1], [x + 900, x])} s={1.1 + (i % 2) * 0.08} voltear accion={carga < 1 ? 'correr' : 'parado'} brazo={[75 + Math.sin(f / 7 + i) * 10, 20]} />)}
            <Relampago a={[860, 160]} b={[1180, 560]} f={f} desde={at(0) + 75} />
            <Relampago a={[860, 160]} b={[1400, 500]} f={f} desde={at(2) + 15} />
            <Relampago a={[900, 140]} b={[1600, 560]} f={f} desde={at(2) + 60} />
            {/* rocas que caen de los montes */}
            {f > at(2) && Array.from({ length: 10 }, (_, i) => {
              const t = ((f - at(2) + i * 13) % 55) / 55, x = (i % 2 ? 1700 : 220) + (azar(i) - 0.5) * 300;
              return <Roca key={i} x={x + (i % 2 ? -1 : 1) * t * 200} y={240 + t * 520} s={0.35 + azar(i + 3) * 0.3} rot={t * 300} seed={i} />;
            })}
            {/* el mar hierve */}
            <g opacity={ap(f, at(2) + 40, 20)}>
              <Olas y={768} f={f * 3} color={C.mar} alto={22} capas={1} />
              {Array.from({ length: 30 }, (_, i) => {
                const t = ((f + i * 9) % 40) / 40;
                return <circle key={i} cx={azar(i) * 1920} cy={790 - t * 70} r={4 + azar(i + 2) * 6} fill="none" stroke={C.blanco} strokeWidth={2} opacity={1 - t} />;
              })}
            </g>
            <Rotulo x={960} y={300} texto={anios ? `AÑO ${romanos[anios]}` : ''} o={vis(f, at(2) + 5, at(3) - 25)} tam={54} />
          </Plano>
          {/* B: Tártaro */}
          <Plano o={oB}>
            <Oscuro o={0.65} color="#120806" />
            <Grieta x={B + 1000} abre={0.6} alto={420} />
            <SueloL />
            <Zeus x={xZB} s={1.1} contorno accion={f < at(3) + 58 ? 'caminar' : 'parado'} brazo={f > libera - 10 ? [135, 20] : [115, 30]} />
            <Halo x={xZB + 60} y={380} r={200} o={0.7} />
            {[B + 850, B + 1020, B + 1190].map((x, i) => (
              <g key={x}>
                <Cadena a={[x + 30, 560]} b={[x + 30, SUELO]} rota={rota} />
                <Ciclope x={x} s={0.85} contorno inclinar={-20 + rota * 20} cabeza={-20 + rota * 30} brazo={rota > 0.5 ? [160, -10] : [10, 20]} />
              </g>
            ))}
            {[B + 1450, B + 1700].map((x, i) => (
              <g key={x}>
                <Cadena a={[x - 40, 520]} b={[x + 60, SUELO]} rota={rota} />
                <Hecatonquiro x={x} s={0.95} voltear contorno inclinar={-25 + rota * 25} />
              </g>
            ))}
            {rota > 0 && rota < 1 && <Halo x={B + 1200} y={600} r={600} o={1 - rota} blanco />}
            <Rotulo x={B + 1300} y={260} texto="TÁRTARO" o={vis(f, at(3) + 10, at(4) - 25)} tam={44} />
          </Plano>
          {/* C: forja de los Cíclopes */}
          <Plano o={oC}>
            <Oscuro o={0.35} color="#1A0E0A" />
            <SueloL />
            <g transform={`translate(${Cx + 520} ${SUELO})`}><Fuego f={f} s={1.4} /></g>
            <Chispas x={Cx + 520} y={SUELO - 150} f={f} n={30} />
            <Yunque x={Cx + 780} s={1.2} brasa={1} />
            <Ciclope x={Cx + 620} s={1.05} contorno objeto="martillo" brazo={[150 - martillo * 50, -20 - martillo * 30]} />
            <Ciclope x={Cx + 960} s={1} voltear contorno objeto="martillo" brazo={[150 + martillo * 50, -20 + martillo * 30]} />
            {martillo < -0.9 && <Chispas x={Cx + 790} y={SUELO - 120} f={f} n={14} viento={0} />}
            {regalos.map((r, i) => {
              const v = vuela(i), sale = ap(f, r, 15);
              if (sale <= 0 || recibe(i)) return null;
              const p0: P = [Cx + 790, 560], p = lerp(p0, destinos[i], v);
              const y = p[1] - Math.sin(v * Math.PI) * 120;
              return <g key={i} opacity={sale}>{i === 0 ? <RayoSuelto x={p[0]} y={y} s={0.9} /> : i === 1 ? <TridenteSuelto x={p[0]} y={y + 60} s={0.7} /> : <Casco x={p[0]} y={y} s={1.2} />}</g>;
            })}
            <Zeus x={Cx + 1330} s={1.1} voltear objeto={recibe(0) ? 'rayo' : null} brazo={recibe(0) ? [120, 30] : [60, 40]} />
            <Poseidon x={Cx + 1560} s={1.05} voltear objeto={recibe(1) ? 'tridente' : null} brazo={recibe(1) ? [100, 40] : [50, 40]} />
            <Hades x={Cx + 1790} s={1.05} voltear objeto={null} tocado={recibe(2) ? 'casco' : 'cinta'} opacity={recibe(2) ? 0.35 + 0.25 * Math.sin(f / 6) : 1} />
            <Rotulo x={Cx + 1330} y={180} texto="RAYO" o={ap(f, regalos[0] + 45, 12)} tam={28} />
            <Rotulo x={Cx + 1560} y={180} texto="TRIDENTE" o={ap(f, regalos[1] + 45, 12)} tam={28} />
            <Rotulo x={Cx + 1790} y={180} texto="CASCO" o={ap(f, regalos[2] + 45, 12)} tam={28} />
          </Plano>
          {/* D: los de cien brazos */}
          <Plano o={oD}>
            <Prof p={0.35} cx={cx} x0={D}><Monte x={D + 1700} ancho={600} alto={440} o={0.55} color="#5E2A12" /></Prof>
            <SueloL />
            <Hecatonquiro x={D + 420} s={1.25} rocas />
            <Hecatonquiro x={D + 700} s={1.15} rocas />
            {Array.from({ length: 16 }, (_, i) => {
              const t0 = at(5) + (i * 7) % 110, t = interpolate(f, [t0, t0 + 40], [0, 1], cl);
              if (t <= 0 || t >= 1) return null;
              const x = interpolate(t, [0, 1], [D + 500 + (i % 3) * 120, D + 1200 + (i % 5) * 170]), y = interpolate(t, [0, 1], [330 - (i % 4) * 30, 700]) - Math.sin(t * Math.PI) * 220;
              return <Roca key={i} x={x} y={y} s={0.55} rot={t * 360} seed={i} />;
            })}
            {titanes.map((x, i) => <Titan key={x} i={i} x={x + cae(i) * 60} y={SUELO + cae(i) * 120} s={1.05} voltear inclinar={cae(i) * 70} opacity={1 - cae(i) * 0.3} brazo={[120 - cae(i) * 80, 20]} />)}
            {/* montón de rocas sobre los vencidos */}
            {Array.from({ length: 14 }, (_, i) => {
              const o = ap(f, at(5) + 90 + i * 8, 10);
              return o > 0 ? <Roca key={i} x={D + 1200 + (i % 7) * 110 + (i > 6 ? 55 : 0)} y={SUELO - 30 - (i > 6 ? 70 : 0)} s={0.8 * o} seed={i + 5} /> : null;
            })}
            <Rotulo x={D + 560} y={240} texto="HECATÓNQUIROS" o={vis(f, at(5) + 10, dur)} tam={34} />
          </Plano>
        </g>
      </Capa>
    </Escenario>
  );
};

// =====================================================================
// 9. El reparto del mundo
const RepartoE: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const B = 2600, Cx = 5200, D = 7800, E = 10400;
  const cam: Cam = [[0, 0, 1.04], [at(1) - 25, 120, 1], [at(1) + 5, B, 1], [at(2) - 25, B, 1.04], [at(2) + 5, Cx, 1.1], [at(3) - 25, Cx, 1.02], [at(3) + 5, D, 1], [at(4) - 25, D, 1], [at(4) + 5, E, 1], [dur, E, 1.06]];
  const cx = camX(f, cam);
  const oA = 1 - ap(f, at(1) - 25, 25), oB = vis(f, at(1) - 25, at(2) - 25, 25), oC = vis(f, at(2) - 25, at(3) - 25, 25), oD = vis(f, at(3) - 25, at(4) - 25, 25), oE = ap(f, at(4) - 25, 25);
  // A: puertas
  const cierra = entre(f, at(0) + 70, at(0) + 110, 0, 1, Easing.in(Easing.quad));
  // C: sorteo
  const lotes = [at(2) + 30, at(2) + 55, at(2) + 80];
  const sacudir = f > at(2) && f < at(2) + 30 ? Math.sin(f * 1.5) * 8 : 0;
  const hermanosC: P[] = [[Cx + 650, 0], [Cx + 1000, 0], [Cx + 1300, 0]];
  // D: dominios
  const dom = [ap(f, at(3) + 5, 20), ap(f, at(3) + 45, 20), ap(f, at(3) + 85, 20)];
  // E: el Olimpo
  const columnas = (i: number) => ap(f, at(4) + 10 + i * 10, 15);
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={1}>
        {/* A: Tártaro */}
        <Plano o={oA}>
          <Oscuro o={0.6} color="#120806" />
          <Halo x={960} y={520} r={420} o={(1 - cierra) * 0.8} />
          <Puertas x={960} cierra={cierra} alto={440} />
          <SueloL />
          {[0, 1, 2, 3].map((i) => {
            const x = entre(f, at(0) + i * 12, at(0) + 70 + i * 12, 200 + i * 120, 860 + i * 40, Easing.linear);
            return <Titan key={i} i={i} x={x} s={0.8} accion="caminar" contorno cabeza={-20} opacity={1 - ap(f, at(0) + 60 + i * 12, 15)} objeto={null} escudo={false} />;
          })}
          <Hecatonquiro x={1460} s={1} voltear contorno />
          <Hecatonquiro x={1700} s={0.95} voltear contorno />
          <Rotulo x={960} y={340} texto="TÁRTARO" o={vis(f, at(0) + 115, at(1) - 25)} tam={44} />
        </Plano>
        {/* B: Atlas */}
        <Plano o={oB}>
          <Prof p={0.2} cx={cx} x0={B}><Sol x={B + 1500} y={640} r={70} f={f} /></Prof>
          <g transform={`translate(${B} 0)`}><Olas y={720} f={f} color={C.mar} alto={34} /></g>
          <g transform={`translate(0 ${-30})`}><Suelo desde={B + 500} hasta={B + 1400} /></g>
          <Esfera x={B + 945} y={292} r={108} />
          <Personaje x={B + 920} y={SUELO - 30} s={1.0} gigante canas ropa="desnudo" tocado={null} brazo={[172 + temblor(f, 1), 10]} brazoAtras={[-172, -10]} inclinar={6 + temblor(f, 0.5)} cabeza={-10} boca />
          <Rotulo x={B + 640} y={330} texto="ATLAS" o={vis(f, at(1) + 20, at(2) - 25)} tam={44} />
        </Plano>
        {/* C: el sorteo */}
        <Plano o={oC}>
          <Prof p={0.5} cx={cx} x0={Cx}><g opacity={0.45}><Templo x={Cx + 1000} y={SUELO - 40} s={1.1} color={C.barroOscuro} /></g></Prof>
          <SueloL />
          <rect x={Cx + 940} y={SUELO - 160} width={120} height={160} fill={C.negro} />
          <Borde d={`M${Cx + 940} ${SUELO - 150} H${Cx + 1060}`} w={8} />
          <g transform={`rotate(${sacudir} ${Cx + 1000} ${SUELO - 200})`}><Casco x={Cx + 1000} y={SUELO - 205} s={1.1} /></g>
          <Poseidon x={hermanosC[0][0]} s={1.05} brazo={[110, 20]} />
          <Zeus x={Cx + 1250} s={1.1} voltear brazo={[110, 20]} objeto={null} />
          <Hades x={Cx + 1480} s={1.05} voltear brazo={[110, 20]} objeto={null} />
          {lotes.map((t0, i) => {
            const t = interpolate(f, [t0, t0 + 30], [0, 1], cl);
            if (t <= 0) return null;
            const destino: P = i === 0 ? mano(Cx + 1250, SUELO, 1.1, true, [110, 20]) : i === 1 ? mano(hermanosC[0][0], SUELO, 1.05, false, [110, 20]) : mano(Cx + 1480, SUELO, 1.05, true, [110, 20]);
            const p = lerp([Cx + 1000, SUELO - 230], destino, t);
            return <circle key={i} cx={p[0]} cy={p[1] - Math.sin(t * Math.PI) * 180} r={14} fill={[C.oro, C.blanco, C.purpura][i]} stroke={C.negro} strokeWidth={3} />;
          })}
          <Rotulo x={Cx + 1000} y={260} texto="EL SORTEO" o={vis(f, at(2) + 10, at(3) - 25)} tam={40} />
        </Plano>
        {/* D: cielo, mar e inframundo */}
        <Plano o={oD}>
          <g opacity={dom[0]}>
            <rect x={D} y={0} width={640} height={SUELO} fill={C.barroClaro} opacity={0.5} />
            <Sol x={D + 470} y={240} r={46} f={f} />
            <Nube x={D + 200} y={300} s={0.6} f={f} />
            <Nube x={D + 330} y={SUELO - 60} s={1.1} f={f + 30} />
            <Zeus x={D + 330} y={SUELO - 90} s={1} brazo={[125, 30]} />
            <Rotulo x={D + 320} y={200} texto="CIELO" o={1} tam={34} />
          </g>
          <g opacity={dom[1]}>
            <rect x={D + 640} y={0} width={640} height={SUELO} fill={C.mar} opacity={0.55} />
            <Poseidon x={D + 960} y={SUELO - 40} s={1} brazo={[100, 40]} />
            <defs><clipPath id="clipMarD"><rect x={D + 640} y={0} width={640} height={SUELO} /></clipPath></defs><g clipPath="url(#clipMarD)"><g transform={`translate(${D} 0)`}><Olas y={700} f={f} color={C.mar} alto={30} /></g></g>
            <Rotulo x={D + 960} y={200} texto="MAR" o={1} tam={34} />
          </g>
          <g opacity={dom[2]}>
            <rect x={D + 1280} y={0} width={640} height={SUELO + 50} fill="#140A08" />
            <Grieta x={D + 1600} abre={0.35} alto={260} />
            <Hades x={D + 1600} s={1} voltear contorno brazo={[60, 40]} />
            {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={D + 1350 + i * 120} cy={300 + Math.sin(f / 15 + i) * 20} r={10} fill={C.crema} opacity={0.25} />)}
            <Rotulo x={D + 1600} y={200} texto="INFRAMUNDO" o={1} tam={34} />
          </g>
          <Suelo desde={D - 200} hasta={D + 2200} />
          {[640, 1280].map((x) => <rect key={x} x={D + x - 6} y={0} width={12} height={SUELO} fill={C.negro} />)}
        </Plano>
        {/* E: el Olimpo */}
        <Plano o={oE}>
          <Prof p={0.2} cx={cx} x0={E}><Sol x={E + 1600} y={260} r={50} f={f} /></Prof>
          <Prof p={0.5} cx={cx} x0={E}>
            <Nube x={E + 300} y={300} s={0.8} f={f} />
            <Nube x={E + 1650} y={420} s={0.7} f={f + 40} />
          </Prof>
          <path d={`M${E - 200} ${SUELO} C ${E + 300} ${SUELO - 120}, ${E + 700} ${500}, ${E + 960} ${470} C ${E + 1220} ${500}, ${E + 1620} ${SUELO - 120}, ${E + 2120} ${SUELO} Z`} fill={C.barroOscuro} />
          {Array.from({ length: 5 }, (_, r) => Array.from({ length: 4 + r * 3 }, (_, i) => {
            const yy = 520 + r * 55, w = 150 + r * 200, x0 = E + 960 - w + (i + 0.5) * ((w * 2) / (4 + r * 3));
            return <path key={`${r}-${i}`} d={`M${x0 - 20} ${yy} a 20 14 0 0 1 40 0`} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.4} />;
          }))}
          {/* el templo se levanta */}
          <g transform={`translate(${E + 960} 474) scale(0.75)`}>
            <rect x={-180} y={-10} width={360} height={10} fill={C.negro} />
            <rect x={-166} y={-20} width={332} height={10} fill={C.negro} />
            {[-125, -75, -25, 25, 75, 125].map((x, i) => <rect key={x} x={x - 11} y={-20 - 122 * columnas(i)} width={22} height={122 * columnas(i)} fill={C.negro} />)}
            <g opacity={columnas(6)} transform={`translate(0 ${(1 - columnas(6)) * -40})`}>
              <path d="M-150 -170 L0 -228 L150 -170 Z" fill={C.negro} />
              <rect x={-156} y={-170} width={312} height={28} fill={C.negro} />
              <path d="M-90 -180 L0 -214 L90 -180" stroke={C.crema} strokeWidth={3} fill="none" />
            </g>
          </g>
          <Zeus x={E + 760} y={482} s={0.32} />
          <Personaje x={E + 1160} y={482} s={0.3} voltear mujer tocado="corona" objeto="cetro" />
          <Halo x={E + 960} y={370} r={300} o={columnas(6) * 0.7} blanco />
          <Nube x={E + 700} y={560} s={1} f={f} />
          <Nube x={E + 1250} y={600} s={0.9} f={f + 20} />
          <Suelo desde={E - 300} hasta={E + 2300} />
          <Rotulo x={E + 960} y={262} texto="OLIMPO" o={ap(f, at(4) + 80, 20)} tam={50} />
        </Plano>
      </Capa>
    </Escenario>
  );
};

// =====================================================================
// 10. Comienza la era olímpica
const CierreE: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const cam: Cam = [[0, 0, 1.06], [at(1) - 10, 0, 1], [at(1) + 70, 1500, 1], [dur, 1650, 1.04]];
  const cx = camX(f, cam);
  const sol = entre(f, 0, at(1), 520, 300, Easing.out(Easing.quad));
  const xP = entre(f, at(2) - 10, at(2) + 90, 3500, 2700, Easing.out(Easing.quad));
  void cx;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.15}><Sol x={960} y={sol} r={60} f={f} /></Capa>
      <Capa p={0.4}>
        <Monte x={700} ancho={700} alto={470} o={0.5} templo />
        <Monte x={2200} ancho={600} alto={300} o={0.4} />
      </Capa>
      <Capa p={0.7}>
        <g opacity={0.45}>
          <Olivo x={2000} f={f} color={C.barroOscuro} />
          <Olivo x={2600} f={f + 20} s={0.8} color={C.barroOscuro} />
          <Olivo x={3100} f={f + 40} s={1.1} color={C.barroOscuro} />
        </g>
      </Capa>
      <Capa p={1}>
        <SueloL />
        <Personaje x={160} s={1} mujer tocado="velo" brazo={[60, 40]} />
        <Personaje x={330} s={1} mujer tocado="diadema" objeto="antorcha" brazo={[90, 60]} />
        <Personaje x={510} s={1.02} mujer tocado="corona" objeto="cetro" brazo={[60, 30]} />
        <Zeus x={760} s={1.15} brazo={[100, 30]} />
        <Poseidon x={1080} s={1.05} voltear />
        <Hades x={1300} s={1.05} voltear />
        <Halo x={760} y={400} r={260} o={0.4} />
        {/* la tierra vacía */}
        {Array.from({ length: 6 }, (_, i) => <Ave key={i} x={2100 + i * 230 + Math.sin(f / 25 + i) * 30} y={260 + (i % 3) * 40} s={0.8} f={f + i * 6} />)}
        <Olivo x={2300} f={f} s={1.1} />
        {[2500, 2700, 2900, 3150].map((x, i) => <Brote key={x} x={x} c={1} s={0.7 + (i % 2) * 0.3} flor={i % 2 === 0} />)}
        <Rotulo x={2950} y={330} texto="NI UN SOLO HUMANO" o={vis(f, at(1) + 70, at(2) + 20)} tam={34} />
        {/* Prometeo se acerca */}
        {f > at(2) - 12 && (
          <g>
            <Personaje x={xP} s={1.15} voltear capa={C.purpura} objeto="cana" accion={f < at(2) + 88 ? 'caminar' : 'parado'} brazo={[100, 20]} />
            <Chispas x={mano(xP, SUELO, 1.15, true, [100, 20])[0] - 60} y={mano(xP, SUELO, 1.15, true, [100, 20])[1] - 110} f={f} n={20} viento={1.5} />
          </g>
        )}
        <Rotulo x={2950} y={240} texto="PRÓXIMO: PROMETEO" o={ap(f, at(2) + 40, 20)} tam={40} color={C.oro} />
      </Capa>
    </Escenario>
  );
};

export const ESCENAS: Record<string, React.FC<EscenaV>> = {
  caos: CaosE,
  primordiales: PrimordialesE,
  urano: UranoE,
  hoz: HozE,
  cronos: CronosE,
  piedra: PiedraE,
  regreso: RegresoE,
  titanomaquia: TitanomaquiaE,
  reparto: RepartoE,
  cierre: CierreE,
};

void suave;
