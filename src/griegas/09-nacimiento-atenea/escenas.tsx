// Escenas del video 09 · El nacimiento de Atenea (estilo vasija detallada).
import React from 'react';
import { useCurrentFrame, Easing } from 'remotion';
import type { EscenaV } from '../../comun/VideoVasija';
import {
  C, P, SUELO, Escenario, Capa, Personaje, Fuego, Chispas, Estrellas, Luna, Sol, Olivo, Monte, Templo, Nube, Relampago, Suelo, Rotulo,
  suave, lerp, Inc, Borde, ap, entre, azar, Accion,
} from '../../comun/vasija';
import {
  PIEDRA, AGUA, manoDe, cabezaDe, coronillaDe, Marco, temblor, Recorte, Agua, Mar, Salpicadura, Caballo, Leon, Buho, Hacha, Copa, Yunque,
  CascoSuelto, Dolor, Sonido, Onda, Balanza, Juncos, Palmera, Pena, Casa, Vasija, Telar, Gea, Urano, Egida, Atenea, PerfilZeus, Brecha,
  LluviaOro, Isla, CarroSol, TridenteClavado,
} from './piezas';

type Cam = [number, number, number][];
const lin = Easing.linear;
/** Desplazamiento a pie entre dos frames: posición y acción (camina mientras se mueve). */
const andar = (f: number, a: number, b: number, x0: number, x1: number, corre = false) => ({
  x: entre(f, a, b, x0, x1, lin),
  accion: (f > a && f < b ? (corre ? 'correr' : 'caminar') : 'parado') as Accion,
});
/** Aparece y se va: 0→1 en `a`, 1→0 en `b`. */
const vida = (f: number, a: number, b: number, d = 15) => Math.min(ap(f, a, d), 1 - ap(f, b, d));
const habla = (f: number, a: number, b: number) => f > a && f < b && Math.floor(f / 5) % 2 === 0;
/** Pulso 1→0 que dura `d` frames desde `a`. */
const pulso = (f: number, a: number, d = 20) => (f >= a && f < a + d ? 1 - (f - a) / d : 0);
/** Velo de color sobre todo lo dibujado antes. */
const Velo: React.FC<{ o: number; color?: string }> = ({ o, color = '#0A0503' }) => (o > 0 ? <rect x={-6000} y={-6000} width={16000} height={12000} fill={color} opacity={o} /> : null);
/** Grupo sacudido por un temblor. */
const Tiembla: React.FC<{ f: number; k: number; children: React.ReactNode }> = ({ f, k, children }) => {
  const [dx, dy] = temblor(f, k);
  return <g transform={`translate(${dx} ${dy})`}>{children}</g>;
};
/** Cumbre del Olimpo: montaña con meseta. */
const Cumbre: React.FC<{ x: number; cima: number; ancho?: number; meseta?: number; templo?: boolean; color?: string; o?: number }> = ({ x, cima, ancho = 1000, meseta = 240, templo = true, color = PIEDRA, o = 1 }) => {
  const w = ancho / 2, b = SUELO + 60, h = b - cima;
  return (
    <g opacity={o}>
      {templo && <Templo x={x + 40} y={cima + 4} s={0.6} />}
      <path d={`M${x - w} ${b} C ${x - w * 0.7} ${b - h * 0.35}, ${x - meseta * 1.4} ${cima + 40}, ${x - meseta} ${cima} L ${x + meseta} ${cima} C ${x + meseta * 1.4} ${cima + 40}, ${x + w * 0.7} ${b - h * 0.35}, ${x + w} ${b} Z`} fill={color} />
      <Borde d={`M${x - meseta} ${cima + 2} L ${x + meseta} ${cima + 2}`} w={7} />
      {Array.from({ length: 5 }, (_, r) => Array.from({ length: 3 + r * 2 }, (_, i) => {
        const yy = cima + 50 + r * (h / 6), ww = meseta + r * ((w - meseta) / 5);
        const cx = x - ww + ((i + 0.5) * (ww * 2)) / (3 + r * 2);
        return <path key={`${r}-${i}`} d={`M${cx - 22} ${yy} a 22 15 0 0 1 44 0`} stroke={C.crema} strokeWidth={2} fill="none" opacity={0.35} />;
      }))}
    </g>
  );
};
/** Fila de tronos dorados sobre la cumbre (n encendidos). */
const Tronos: React.FC<{ x: number; y: number; n: number; f: number; s?: number }> = ({ x, y, n, f, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: 12 }, (_, i) => {
      const tx = -275 + i * 50, on = Math.max(0, Math.min(1, n - i));
      return (
        <g key={i} transform={`translate(${tx} 0)`}>
          {on > 0 && <circle cy={-30} r={40} fill="url(#halo)" opacity={on * (0.6 + Math.sin(f / 6 + i) * 0.15)} style={{ mixBlendMode: 'screen' }} />}
          <path d="M-14 0 V-58 Q 0 -70 14 -58 V-26 H18 V0 H12 V-14 H-10 V0 Z" fill={on > 0.5 ? C.oro : C.negro} stroke={C.negro} strokeWidth={2.5} />
          <Inc d="M-8 -50 V-30" w={1.3} c={C.negro} />
        </g>
      );
    })}
  </g>
);
/** Humanito o figura pequeña que vuela de a → b (u 0→1) dando vueltas. */
const Vuela: React.FC<{ a: P; b: P; u: number; k: number; s?: number; mujer?: boolean }> = ({ a, b, u, k, s = 0.24, mujer }) => {
  if (u <= 0) return null;
  const t = Math.min(1, u), p = lerp(a, b, t);
  return <Personaje x={p[0]} y={p[1] - Math.sin(t * Math.PI) * 120} s={s} mujer={mujer} barba={!mujer} inclinar={t < 1 ? t * 360 * 1.5 : 0} brazo={[150, 20]} brazoAtras={[-150, -20]} contorno />;
};
/** Columna de agua que gira (Metis convertida en agua). */
const ColumnaAgua: React.FC<{ x: number; f: number; o: number }> = ({ x, f, o }) => {
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      <path d={suave([[x - 60, SUELO], [x - 40 + Math.sin(f / 5) * 10, SUELO - 120], [x - 50, SUELO - 240], [x - 20, SUELO - 330], [x + 20, SUELO - 330], [x + 50 + Math.sin(f / 6) * 10, SUELO - 220], [x + 40, SUELO - 110], [x + 70, SUELO]], true)} fill={AGUA} stroke={C.negro} strokeWidth={3} />
      {Array.from({ length: 8 }, (_, i) => {
        const yy = SUELO - 20 - (((f * 3 + i * 40) % 320)), w = 30 + Math.sin(i) * 10;
        return <path key={i} d={`M${x - w} ${yy} q ${w} -16 ${w * 2} 0`} stroke={C.crema} strokeWidth={2.5} fill="none" opacity={0.7} />;
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const a = f * 0.2 + i * 0.63, r = 70 + (i % 3) * 14;
        return <circle key={i} cx={x + Math.cos(a) * r} cy={SUELO - 320 + ((i * 37) % 300) - Math.sin(a) * 10} r={5} fill={C.blanco} opacity={0.8} />;
      })}
    </g>
  );
};
/** Gota de agua brillante (Metis diminuta). */
const GotaMetis: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={50} fill="url(#haloBlanco)" opacity={0.7 + Math.sin(f / 3) * 0.2} />
    <path d="M0 -26 C 8 -12, 16 0, 16 8 C 16 18, 8 24, 0 24 C -8 24, -16 18, -16 8 C -16 0, -8 -12, 0 -26 Z" fill={AGUA} stroke={C.crema} strokeWidth={2.5} />
    <path d="M-7 4 q 0 -8 6 -12" stroke={C.blanco} strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
);
/** Orilla de tierra entre el lago y el suelo. */
const Orilla: React.FC = () => (
  <g>
    <rect x={-1500} y={SUELO - 40} width={6000} height={42} fill={C.barro} stroke={C.negro} strokeWidth={3} />
    {Array.from({ length: 60 }, (_, i) => <path key={i} d={`M${-1400 + i * 100} ${SUELO - 14} q 14 -12 28 0`} stroke={C.negro} strokeWidth={2} fill="none" opacity={0.5} />)}
  </g>
);
/** Destello blanco de pantalla completa (golpes y transformaciones). */
const Destello: React.FC<{ o: number }> = ({ o }) => (o > 0 ? <rect x={-6000} y={-6000} width={16000} height={12000} fill="#FFF6DD" opacity={o} /> : null);

// ---------------------------------------------------------------- 1 · La más sabia
const Metis: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1.15], [t1 - 20, 0, 1.12], [t1 + 50, 150, 1], [t2, 450, 1], [t2 + 100, 900, 1], [t4, 920, 1], [dur, 980, 1.06]];
  const zeus = f < t4 ? andar(f, t1 - 10, t2 + 40, -300, 1250) : andar(f, t4 + 10, t4 + 70, 1250, 1450);
  const sube = ap(f, t2 + 5, 60);
  const metis = andar(f, t2 + 75, t2 + 175, 2350, 1750);
  const metisY = SUELO + (1 - sube) * 380;
  const cabM = cabezaDe({ x: metis.x, y: metisY, s: 0.95, voltear: true });
  const tx = 2470, ty = 420, tondo = vida(f, t3 - 5, t4 + 20, 20);
  const bebe = ap(f, t3 + 50, 15), vomita = f > t3 + 80;
  const une = ap(f, t4 + 60, 30);
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.05}><Sol x={1500} y={250} r={46} f={f} /></Capa>
      <Capa p={0.2}>
        <Nube x={300} y={220} s={0.6} f={f} />
        <Nube x={1700} y={260} s={0.5} f={f + 40} />
      </Capa>
      <Capa p={0.35}>
        <Cumbre x={900} cima={SUELO - 420} ancho={1200} meseta={300} templo={false} color={C.barroOscuro} />
        <Tronos x={900} y={SUELO - 420} n={entre(f, 20, t1 - 20, 0, 12, lin)} f={f} />
        <Rotulo x={900} y={SUELO - 520} texto="DOCE TRONOS" o={vida(f, 40, t1 - 10)} tam={30} />
        <Monte x={2100} alto={300} ancho={600} o={0.45} />
      </Capa>
      <Capa p={0.6}>
        {[500, 1000, 1500].map((x, i) => (
          <g key={x}>
            <path d={`M${x - 90} ${SUELO - 10} C ${x - 60} ${SUELO - 70}, ${x + 50} ${SUELO - 80}, ${x + 90} ${SUELO - 10} Z`} fill={C.barroOscuro} opacity={0.7} />
            {[0, 1, 2].map((j) => {
              const t = ((f / 60 + j / 3 + i * 0.2) % 1);
              return <circle key={j} cx={x + Math.sin(t * 6 + j) * 20} cy={SUELO - 60 - t * 160} r={14 + t * 20} fill={C.barroOscuro} opacity={(1 - t) * 0.35} />;
            })}
          </g>
        ))}
        <g opacity={0.5}><Olivo x={2300} y={SUELO - 30} s={0.8} f={f} color={C.barroOscuro} /></g>
      </Capa>
      <Capa p={1}>
        <Suelo desde={-1200} hasta={2000} />
        <Olivo x={600} f={f} s={0.85} />
        {/* escudos rotos de los titanes vencidos */}
        {[250, 820].map((x, i) => (
          <g key={x} transform={`translate(${x} ${SUELO - 8}) rotate(${i ? 18 : -12})`}>
            <ellipse rx={50} ry={16} fill={C.negro} stroke={C.purpura} strokeWidth={5} />
            <path d="M-20 -6 l 40 10" stroke={C.crema} strokeWidth={2} />
          </g>
        ))}
        <Personaje x={zeus.x} s={1.05} accion={zeus.accion} tocado="corona" capa={C.purpura} objeto={f < t4 ? 'rayo' : null} brazo={f > t4 + 60 ? [entre(f, t4 + 60, t4 + 80, 30, 80), 10] : f > t2 + 60 && f < t3 ? [70, 30] : undefined} cabeza={f > t2 + 60 && f < t3 ? 4 : 0} />
        <Rotulo x={zeus.x + 30} y={SUELO - 440} texto="ZEUS" o={vida(f, t1 + 40, t2 + 20)} />
        {/* Metis sale del mar, hija de Océano */}
        {f > t2 && (
          <g>
            {sube > 0.6 && <Chispas x={cabM[0]} y={cabM[1] - 30} f={f} n={10} viento={0.2} />}
            <circle cx={cabM[0]} cy={cabM[1]} r={70} fill="url(#halo)" opacity={0.35 + Math.sin(f / 8) * 0.1} style={{ mixBlendMode: 'screen' }} />
            <Personaje x={metis.x} y={metisY} s={0.95} voltear mujer tocado="velo" accion={metis.accion} brazo={f > t4 + 60 ? [entre(f, t4 + 60, t4 + 80, 20, 80), 0] : [30, 40]} />
          </g>
        )}
        <Agua nivel={SUELO - 30} f={f} x0={2100} x1={4200} />
        <Rotulo x={cabM[0]} y={cabM[1] - 90} texto="METIS" o={vida(f, t2 + 70, t3 - 10)} />
        <Rotulo x={2800} y={SUELO - 80} texto="OCÉANO" o={vida(f, t2, t2 + 150)} tam={26} />
        {/* unión: Zeus la elige como esposa */}
        {une > 0 && (
          <g>
            <circle cx={1580} cy={SUELO - 300} r={160} fill="url(#halo)" opacity={une * (0.6 + Math.sin(f / 7) * 0.1)} style={{ mixBlendMode: 'screen' }} />
            <Borde d={suave([[1450, SUELO - 380], [1580, SUELO - 420 - une * 20], [1710, SUELO - 380]])} w={9} color={C.oro} />
          </g>
        )}
        {/* visión: la pócima de Metis hace vomitar a Cronos */}
        <Tondo x={tx} y={ty} o={tondo} id="pocima">
          <rect x={tx - 200} y={ty + 130} width={400} height={80} fill={C.negro} />
          <Personaje x={tx - 70} y={ty + 130} s={0.55} canas tocado="corona" contorno inclinar={vomita ? entre(f, t3 + 80, t3 + 95, 0, 22) : 0} boca={vomita} objeto={bebe > 0.5 && !vomita ? 'copa' : 'hoz'} brazo={bebe > 0.5 && !vomita ? [150, 30] : [40, 30]} />
          <Personaje x={tx + 100} y={ty + 130} s={0.5} voltear mujer tocado="velo" objeto={bebe < 0.5 ? 'copa' : null} brazo={bebe < 0.5 ? [80, 0] : [30, 30]} />
          {[0, 1, 2, 3, 4].map((k) => (
            <Vuela key={k} a={[tx - 20, ty]} b={[tx + 20 + k * 30, ty + 130]} u={(f - (t3 + 95 + k * 12)) / 30} k={k} s={0.18} mujer={k % 2 === 0} />
          ))}
        </Tondo>
        <Rotulo x={tx} y={ty - 225} texto="LA PÓCIMA" o={tondo} tam={28} />
      </Capa>
    </Escenario>
  );
};

/** Medallón redondo (como el tondo de una copa) con una visión adentro (06). */
const Tondo: React.FC<{ x: number; y: number; r?: number; o: number; id: string; fondo?: string; children: React.ReactNode }> = ({ x, y, r = 180, o, id, fondo = '#2E140C', children }) => {
  if (o <= 0) return null;
  return (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${0.85 + o * 0.15}) translate(${-x} ${-y})`}>
      <defs><clipPath id={`tondo-${id}`}><circle cx={x} cy={y} r={r} /></clipPath></defs>
      <circle cx={x} cy={y} r={r + 22} fill={C.barro} stroke={C.negro} strokeWidth={5} />
      {Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2, rr = r + 11;
        return <circle key={i} cx={x + Math.cos(a) * rr} cy={y + Math.sin(a) * rr} r={4.5} fill={i % 2 ? C.negro : C.purpura} />;
      })}
      <circle cx={x} cy={y} r={r} fill={fondo} stroke={C.negro} strokeWidth={4} />
      <g clipPath={`url(#tondo-${id})`}>{children}</g>
    </g>
  );
};

// ---------------------------------------------------------------- 2 · La profecía
const Profecia: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, -60, 1], [t1, 0, 1], [t3, 0, 1.02], [t4, 120, 1.14], [dur, 150, 1.18]];
  const gea = ap(f, t0 + 10, 70) * (1 - ap(f, t4 + 20, 60));
  const urano = ap(f, t0 + 60, 50) * (1 - ap(f, t4 + 30, 50));
  const tL = vida(f, t1 + 10, fin(3), 20), tR = vida(f, t2 + 10, fin(3), 20);
  const pasado = ap(f, t3, 20);
  const frio = ap(f, t3 + 20, 40);
  const lx = 560, ly = 325, rx = 1180, ry = 325;
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.05}>
        <Estrellas n={70} f={f} area={[-200, 140, 2400, 420]} />
        <Luna x={240} y={230} r={34} />
      </Capa>
      <Capa p={0.3}>
        <Monte x={300} alto={280} ancho={600} color="#2A120A" o={0.9} />
        <Monte x={1300} alto={340} ancho={700} color="#2A120A" o={0.8} />
      </Capa>
      <Capa p={0.6}>
        <Urano x={1600} y={SUELO + 90} s={1.7} f={f} o={urano} voltear brazo={habla(f, t2, fin(2)) || (f > t2 && f < fin(2)) ? [110 + Math.sin(f / 9) * 8, 20] : [50, 40]} boca={habla(f, t2, fin(2))} id="prof" corte={SUELO - 110} />
        {[1250, 1480, 1720, 1950].map((x, i) => <Nube key={x} x={x} y={SUELO - 120 + (i % 2) * 14} s={0.7} f={f + i * 20} color="#D9C49A" />)}
        <Rotulo x={1560} y={210} texto="URANO · EL CIELO" o={vida(f, t0 + 90, t1 + 40)} tam={28} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-1200} hasta={3200} />
        <Gea x={330} s={1.3} sube={gea} brazo={habla(f, t0 + 40, fin(1)) ? [100 + Math.sin(f / 7) * 8, 10] : [40, 30]} boca={habla(f, t0 + 60, fin(1))} id="prof" />
        <Rotulo x={360} y={SUELO - 330} texto="GEA · LA TIERRA" o={vida(f, t0 + 70, t1 + 20) * gea} tam={28} />
        {habla(f, t0 + 60, fin(1)) && <Sonido x={420} y={SUELO - 210} f={f} s={0.8} o={0.7} />}
        {f > t2 && f < fin(2) && <Sonido x={1480} y={290} f={f} s={1} o={0.7} ang={180} />}
        {/* Metis (que espera un hijo) y Zeus */}
        <circle cx={700} cy={SUELO - 190} r={60} fill="url(#halo)" opacity={0.25 + Math.sin(f / 9) * 0.08} style={{ mixBlendMode: 'screen' }} />
        <Personaje x={700} s={0.95} mujer tocado="velo" brazo={[20, 60]} brazoAtras={[10, 70]} contorno cabeza={f > t4 ? -6 : 0} />
        <Personaje x={900} s={1} tocado="corona" capa={C.purpura} objeto="cetro" contorno voltear={f > t4 - 10} brazo={f > t3 + 10 ? [40, 100] : [40, 30]} cabeza={f > t1 && f < t4 ? 14 : 0} />
        {frio > 0 && f < t4 && Array.from({ length: 6 }, (_, i) => {
          const a = (f / 20 + i / 6) % 1;
          return <path key={i} d={`M${880 + (i - 3) * 22} ${SUELO - 360 - a * 60} l 6 -10 l 6 10`} stroke="#B9D4E6" strokeWidth={3} fill="none" opacity={frio * (1 - a)} />;
        })}
        {f > t4 + 20 && <circle cx={cabezaDe({ x: 900, voltear: true })[0]} cy={cabezaDe({ x: 900, voltear: true })[1] + 6} r={12} fill="url(#haloBlanco)" opacity={pulso(f, t4 + 20, 30)} />}
        <Rotulo x={900} y={SUELO - 430} texto="ZEUS" o={vida(f, t0 + 30, t1)} tam={30} />
        {/* visión izquierda: la hija / Cronos contra Urano */}
        <Tondo x={lx} y={ly} r={125} o={tL} id="hija" fondo="#1E0C06">
          <g opacity={1 - pasado}>
            <Atenea x={lx - 10} y={ly + 120} s={0.6} f={f} brillo={0.6} brazo={[60, 20]} contorno />
          </g>
          <g opacity={pasado}>
            <Personaje x={lx - 40} y={ly + 120} s={0.48} canas={false} tocado="cinta" objeto="hoz" brazo={[entre(f, t3 + 10, t3 + 40, 60, 160), 10]} contorno />
            <Personaje x={lx + 60} y={ly + 120} s={0.48} voltear piel={'#232B4A'} canas ropa="desnudo" tocado={null} inclinar={entre(f, t3 + 40, t3 + 70, 0, -30)} contorno brazo={[150, 20]} />
          </g>
        </Tondo>
        <Rotulo x={lx} y={ly - 157} texto={pasado > 0.5 ? 'URANO CAYÓ' : 'UNA HIJA'} o={tL} tam={26} />
        {/* visión derecha: el hijo / Zeus contra Cronos */}
        <Tondo x={rx} y={ry} r={125} o={tR} id="hijo" fondo="#140A10">
          <g opacity={1 - pasado}>
            <circle cx={rx} cy={ry} r={120} fill="url(#halo)" opacity={0.5 + Math.sin(f / 5) * 0.15} />
            <Personaje x={rx - 10} y={ry + 120} s={0.6} barba={false} tocado="corona" objeto="rayo" brazo={[160, 10]} contorno capa={C.purpura} />
          </g>
          <g opacity={pasado}>
            <Personaje x={rx - 50} y={ry + 120} s={0.48} tocado="corona" objeto="rayo" brazo={[150, 20]} contorno />
            <Personaje x={rx + 60} y={ry + 120} s={0.48} voltear canas tocado="cinta" objeto="hoz" inclinar={entre(f, t3 + 40, t3 + 70, 0, -30)} contorno />
          </g>
        </Tondo>
        <Rotulo x={rx} y={ry - 157} texto={pasado > 0.5 ? 'CRONOS CAYÓ' : 'UN HIJO, REY'} o={tR} tam={26} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 3 · El engaño
const Engano: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, -150, 1], [t1, 0, 1.04], [t3, 80, 1.1], [t3 + 90, 120, 1.2], [t4, 0, 1], [dur, -30, 1.02]];
  const zeus = andar(f, t0, t0 + 90, 450, 820);
  const mx = 1180;
  const forma = f < t1 + 8 ? 0 : f < t1 + 62 ? 1 : f < t1 + 116 ? 2 : f < t2 + 4 ? 3 : 0;
  const flash = Math.max(pulso(f, t1 + 6, 14), pulso(f, t1 + 60, 14), pulso(f, t1 + 114, 14), pulso(f, t2 + 2, 14));
  const encoge = entre(f, t3 + 10, t3 + 50, 0.95, 0.05);
  const traga = (f - (t3 + 80)) / 30;
  const boca = cabezaDe({ x: 820, s: 1.05 });
  const gota: P = traga <= 0 ? [mx - 10, SUELO - 300 + Math.sin(f / 8) * 10] : lerp([mx - 10, SUELO - 300], [boca[0] + 14, boca[1] + 22], Math.min(1, traga));
  const tragada = f > t3 + 110;
  const zeusB: [number, number] = f > t4 ? [20, 90] : f > t2 && f < t3 + 60 ? [70, 40 + Math.sin(f / 9) * 10] : f > t0 + 90 && f < t1 ? [60, 50] : [30, 30];
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.05}><Sol x={400} y={250} r={46} f={f} /></Capa>
      <Velo o={entre(f, t3 + 60, t3 + 110, 0, 0.25)} color="#3A1206" />
      <Capa p={0.25}>
        <Monte x={300} alto={320} ancho={650} />
        <Monte x={1500} alto={260} ancho={560} o={0.45} />
        <Nube x={1100} y={220} s={0.55} f={f} />
      </Capa>
      <Capa p={0.6}>
        <g opacity={0.55}>
          <Olivo x={150} y={SUELO - 30} s={0.9} f={f} color={C.barroOscuro} />
          <Olivo x={1600} y={SUELO - 30} s={1} f={f + 30} color={C.barroOscuro} />
        </g>
      </Capa>
      <Capa p={1}>
        <Suelo desde={-1200} hasta={3200} />
        <Olivo x={1550} f={f} s={0.95} />
        {/* la sombra de Cronos detrás de Zeus */}
        <Personaje x={620} s={1.3} canas tocado="corona" objeto="hoz" brazo={[30, 90]} opacity={vida(f, t4 + 10, dur, 30) * 0.3} contorno />
        <Rotulo x={620} y={SUELO - 520} texto="COMO CRONOS" o={vida(f, t4 + 30, dur, 20)} tam={30} />
        <Personaje x={zeus.x} s={1.05} accion={zeus.accion} tocado="corona" capa={C.purpura} brazo={zeusB} inclinar={f > t2 && f < t3 + 70 ? 8 : 0} boca={habla(f, t0 + 20, t0 + 150) || habla(f, t2, t2 + 150) || (f > t3 + 70 && f < t3 + 112)} cabeza={f > t3 + 40 && f < t3 + 110 ? -10 : 0} />
        {(habla(f, t0 + 20, t0 + 150) || habla(f, t2, t2 + 150)) && <Sonido x={boca[0] + 50} y={boca[1] + 10} f={f} s={0.6} o={0.6} />}
        {/* Metis y sus formas */}
        {forma === 0 && !tragada && traga <= 0 && encoge > 0.06 && <Personaje x={mx} s={encoge} voltear mujer tocado="velo" brazo={f > t2 && f < t3 ? [90, 30] : [30, 40]} boca={habla(f, t3 - 40, t3)} />}
        {forma === 1 && <Leon x={mx} s={1} f={f} voltear piel={C.blanco} />}
        {forma === 2 && <g transform={`translate(${mx} ${SUELO})`}><Fuego f={f} s={2.2} /></g>}
        <ColumnaAgua x={mx} f={f} o={forma === 3 ? 1 : 0} />
        {flash > 0 && <circle cx={mx} cy={SUELO - 160} r={260} fill="url(#haloBlanco)" opacity={flash} />}
        <Rotulo x={mx} y={SUELO - 400} texto={forma === 1 ? 'LEONA' : forma === 2 ? 'FUEGO' : forma === 3 ? 'AGUA' : 'METIS'} o={forma ? 1 : vida(f, t0 + 30, t1)} tam={30} />
        {f > t3 + 40 && !tragada && <GotaMetis x={gota[0]} y={gota[1]} s={traga > 0 ? 1 - Math.min(1, traga) * 0.6 : ap(f, t3 + 40, 10)} f={f} />}
        <Destello o={pulso(f, t3 + 110, 16) * 0.8} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 4 · La voz interior
const Dentro: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 0.92], [t1, 0, 0.96], [t3, 0, 1], [dur, 0, 1.03]];
  const hx = 930, hy = 455, k = 7.3;
  const ojo: P = [hx + 19 * k, hy - 6 * k];
  const mx = 850, my = 650;
  const cabM = cabezaDe({ x: mx, y: my, s: 0.5 });
  const golpe = f > t3 + 10 ? Math.sin((f - t3) / 4) : 0;
  const bebe = ap(f, t2, 40);
  return (
    <Escenario dur={dur} camara={cam} cielo="inframundo">
      <Capa p={0.05}><Estrellas n={40} f={f} area={[0, 140, 1920, 600]} seed={4} /></Capa>
      <Capa p={1}>
        <PerfilZeus x={hx} y={hy} k={k} f={f} luz={0.5 + bebe * 0.4} />
        <Rotulo x={hx} y={175} texto="DENTRO DE ZEUS" o={vida(f, t0 + 10, t1)} tam={30} />
        {/* piso de adentro */}
        <Borde d={suave([[770, my + 2], [900, my + 8], [1060, my - 2]])} w={7} />
        {/* la sabiduría sube de Metis a los ojos de Zeus */}
        {Array.from({ length: 16 }, (_, i) => {
          const t = ((f / 50 + i / 16) % 1), o = vida(f, t0 + 20, t2 + 40, 20);
          const p = lerp(cabM, ojo, t);
          return <circle key={i} cx={p[0] + Math.sin(t * 9 + i) * 14} cy={p[1] - Math.sin(t * Math.PI) * 60} r={3 + azar(i) * 2} fill={i % 3 ? C.oro : C.blanco} opacity={o * Math.sin(t * Math.PI)} />;
        })}
        <circle cx={ojo[0]} cy={ojo[1]} r={34} fill="url(#halo)" opacity={vida(f, t0 + 40, t2 + 40) * (0.5 + Math.sin(f / 5) * 0.2)} style={{ mixBlendMode: 'screen' }} />
        <Balanza x={930} y={300} s={0.75} f={f} o={vida(f, t1 + 20, t2 + 10, 20)} />
        <Rotulo x={930} y={265} texto="BIEN · MAL" o={vida(f, t1 + 40, t2, 20)} tam={22} />
        {habla(f, t1, t2 - 10) && <Sonido x={cabM[0] + 26} y={cabM[1] - 6} f={f} s={0.45} ang={-35} o={0.8} />}
        {/* la hija que crece */}
        {bebe > 0 && (
          <g opacity={bebe}>
            <circle cx={1010} cy={330} r={110 + Math.sin(f / 10) * 8} fill="url(#halo)" opacity={0.95} style={{ mixBlendMode: 'screen' }} />
            <Personaje x={985} y={400 + Math.sin(f / 18) * 6} s={0.3 + ap(f, t2, 200) * 0.1} mujer tocado="diadema" ojosCerrados inclinar={40} brazo={[100, 60]} brazoAtras={[60, 80]} />
          </g>
        )}
        {/* la madre forja el casco y teje la túnica */}
        <Yunque x={960} y={my} s={0.42} brasa={ap(f, t3, 20)} />
        {f > t3 + 20 && <CascoSuelto x={968} y={my - 40} s={0.38} brillo={ap(f, t3 + 60, 40)} f={f} />}
        {f > t3 + 10 && golpe > 0.9 && <Chispas x={965} y={my - 44} f={f} n={12} viento={0.6} />}
        {f > t3 + 60 && (
          <g opacity={ap(f, t3 + 60, 30)}>
            <path d={`M790 ${my} l 10 -26 h 50 l 8 26 Z`} fill={C.purpura} stroke={C.negro} strokeWidth={2} />
            <path d={`M796 ${my - 12} h 56`} stroke={C.blanco} strokeWidth={2} strokeDasharray="1 6" strokeLinecap="round" />
          </g>
        )}
        <circle cx={mx} cy={my - 100} r={80} fill="url(#halo)" opacity={0.3 + Math.sin(f / 7) * 0.1} style={{ mixBlendMode: 'screen' }} />
        <Personaje x={mx} y={my} s={0.5} mujer tocado="velo" contorno objeto={f > t3 ? 'martillo' : null} brazo={f > t3 ? [120 + golpe * 40, 20] : habla(f, t1, t2) ? [70, 40] : [30, 40]} cabeza={f > t2 && f < t3 ? -24 : 0} boca={habla(f, t1, t2 - 10)} />
        <Rotulo x={mx} y={my - 220} texto="METIS" o={vida(f, t0 + 30, t1 + 30)} tam={26} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 5 · El dolor de cabeza
const Dolores: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, -100, 1], [t1, 200, 1.04], [t2, 250, 1.12], [t3, 300, 1], [t3 + 90, 450, 1], [dur, 480, 1.02]];
  const zeus = andar(f, 0, t1, 100, 900);
  const duele = ap(f, t1 + 10, 30);
  const rodilla = entre(f, t2, t2 + 25, 0, 90);
  const tambalea = f > t1 && f < t2 ? Math.sin(f / 6) * 6 * duele : 0;
  const zy = SUELO + rodilla;
  const cab = cabezaDe({ x: zeus.x, y: zy, s: 1.05, inclinar: tambalea + (rodilla > 0 ? 12 : 0) });
  const grita = f > t2 && f < t2 + 90;
  const sacude = f > t2 && f < t2 + 70 ? 0.6 : 0;
  const dioses = [
    { x1: 1300, d: 0, p: { tocado: 'petaso' as const, alas: true, objeto: 'caduceo' as const, barba: false } },
    { x1: 1500, d: 14, p: { mujer: true, tocado: 'corona' as const, objeto: 'cetro' as const } },
    { x1: 1700, d: 26, p: { tocado: 'laurel' as const, objeto: 'lira' as const, barba: false } },
  ];
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.05}><g opacity={1 - ap(f, t2, 30) * 0.7}><Sol x={1500} y={250} r={46} f={f} /></g></Capa>
      <Velo o={ap(f, t2, 30) * 0.35} color="#3A1206" />
      <Capa p={0.25}>
        <Monte x={400} alto={240} ancho={700} o={0.45} />
        <Monte x={1700} alto={200} ancho={600} o={0.4} />
        <Nube x={800} y={230} s={0.55} f={f} color={f > t2 ? '#8C4A30' : C.crema} />
      </Capa>
      <Capa p={0.6}>
        <Agua nivel={SUELO - 135} f={f} x0={-700} x1={3600} alto={22} vel={0.6} />
        {[200, 900, 1700, 2400].map((x, i) => <Palmera key={x} x={x} y={SUELO - 60} s={0.75} f={f + i * 30} color={C.barroOscuro} />)}
        <Juncos x={1300} y={SUELO - 70} s={0.6} f={f} color={C.barroOscuro} seed={3} />
      </Capa>
      <Capa p={1}>
        <Tiembla f={f} k={sacude}>
          <Suelo desde={-1200} hasta={3600} />
          <Orilla />
          <Rotulo x={700} y={250} texto="LAGO TRITÓN" o={vida(f, t0 + 20, t1 - 20)} tam={34} />
          {dioses.map((g, i) => {
            const a = andar(f, t3 + g.d, t3 + g.d + 80, 2500 + i * 120, g.x1, true);
            return <Personaje key={i} x={a.x} s={0.95} voltear accion={a.accion} {...g.p} brazo={a.accion === 'parado' ? [140 + Math.sin(f / 8 + i) * 12, 30] : undefined} />;
          })}
          <Personaje x={zeus.x} y={zy} s={1.05} accion={zeus.accion} tocado="corona" capa={C.purpura} brazo={f > t1 + 5 ? [entre(f, t1 + 5, t1 + 25, 30, 165), entre(f, t1 + 5, t1 + 25, 30, 70)] : undefined} brazoAtras={f > t2 ? [-160, -40] : undefined} inclinar={tambalea + (rodilla > 0 ? 12 : 0)} boca={grita || (f > t1 + 30 && Math.floor(f / 9) % 3 === 0)} ojosCerrados={f > t1 + 30 && !grita} cabeza={grita ? -16 : 0} />
          <Dolor x={cab[0] - 10} y={cab[1] - 6} f={f} k={duele * (grita ? 1.4 : 1)} r={60} />
          {grita && <Sonido x={cab[0] + 30} y={cab[1] + 20} f={f} s={1.6} ang={-20} o={1} />}
          {grita && <Sonido x={cab[0] - 30} y={cab[1] + 20} f={f + 8} s={1.6} ang={200} o={0.8} />}
          <Relampago a={[cab[0] + 300, 140]} b={[cab[0] + 380, SUELO - 120]} f={f} desde={t2 + 10} dur={14} />
          <Relampago a={[cab[0] - 400, 140]} b={[cab[0] - 300, SUELO - 200]} f={f} desde={t2 + 40} dur={14} />
          <Juncos x={zeus.x + 60} y={SUELO + 10} s={0.8} f={f} n={8} ancho={200} seed={7} />
          <Juncos x={2050} y={SUELO + 10} s={0.9} f={f} n={8} seed={2} />
          <Juncos x={-80} y={SUELO + 10} s={0.9} f={f} n={8} seed={5} />
          <Rotulo x={1500} y={SUELO - 420} texto="LOS DIOSES" o={vida(f, t3 + 90, dur, 20)} tam={30} />
        </Tiembla>
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 6 · El hacha de Hefesto
const HachaEsc: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3);
  const golpe = t3 + 40;
  const cam: Cam = [[0, -300, 1], [t1, 0, 1], [t2, 60, 1.04], [golpe - 10, 120, 1.12], [golpe + 30, 60, 1.02], [dur, 40, 1.04]];
  const zx = 1150, zy = SUELO + 90;
  const hef = andar(f, t0, t0 + 180, -250, 846);
  const cojea = hef.accion === 'caminar' ? Math.sin(f * 0.2) * 7 : 0;
  const hy = SUELO + (hef.accion === 'caminar' ? Math.max(0, Math.sin(f * 0.2)) * 8 : 0);
  let brazo: [number, number] = [60, 95], brazoAtras: [number, number] = [-20, -40];
  if (f > t2 + 20) { brazo = [entre(f, t2 + 20, t2 + 60, 60, 176), entre(f, t2 + 20, t2 + 60, 95, 4)]; brazoAtras = [entre(f, t2 + 20, t2 + 60, -20, 170), entre(f, t2 + 20, t2 + 60, -40, -40)]; }
  if (f > golpe - 8) { brazo = [entre(f, golpe - 8, golpe, 176, 88, Easing.in(Easing.quad)), entre(f, golpe - 8, golpe, 4, 0)]; brazoAtras = [entre(f, golpe - 8, golpe, 170, 84), -40]; }
  if (f > golpe + 40) { brazo = [entre(f, golpe + 40, golpe + 70, 88, 60), entre(f, golpe + 40, golpe + 70, 0, 95)]; brazoAtras = [-20, -40]; }
  const ang = brazo[0] + brazo[1] + (f < t2 + 20 || f > golpe + 70 ? 70 : f > golpe + 40 ? entre(f, golpe + 40, golpe + 70, 7, 70) : 7);
  const mano = manoDe({ x: hef.x, y: hy, s: 1, brazo, inclinar: cojea });
  const coro = coronillaDe({ x: zx, y: zy, s: 1.05, voltear: true, inclinar: 8 });
  const prom = vida(f, t1 + 20, t2 - 10, 25);
  const zeusB: [number, number] = f > t2 - 10 && f < t2 + 70 ? [170, 40] : [160, 70];
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.05}><g opacity={0.35}><Sol x={1500} y={250} r={46} f={f} /></g></Capa>
      <Velo o={0.3} color="#3A1206" />
      <Capa p={0.25}>
        <Monte x={400} alto={240} ancho={700} o={0.45} />
        <Monte x={1700} alto={200} ancho={600} o={0.4} />
      </Capa>
      <Capa p={0.6}>
        <Agua nivel={SUELO - 135} f={f} x0={-700} x1={3600} alto={22} vel={0.6} />
        {[300, 1000, 1800].map((x, i) => <Palmera key={x} x={x} y={SUELO - 60} s={0.75} f={f + i * 30} color={C.barroOscuro} />)}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-1200} hasta={3600} />
          <Orilla />
        {/* los dioses miran */}
        {[{ x: 1450, p: { mujer: true, tocado: 'corona' as const, objeto: 'cetro' as const } }, { x: 1620, p: { tocado: 'petaso' as const, alas: true, objeto: 'caduceo' as const, barba: false } }, { x: 1790, p: { tocado: 'laurel' as const, objeto: 'lira' as const, barba: false } }].map((g, i) => (
          <Personaje key={i} x={g.x} s={0.9} voltear {...g.p} brazo={f > golpe ? [150, 20] : [40, 30]} cabeza={f > golpe ? 12 : 0} />
        ))}
        {/* ¿o fue Prometeo? */}
        <Personaje x={520} s={1} opacity={prom * 0.55} contorno objeto="antorcha" brazo={[70, 50]} />
        <Rotulo x={540} y={SUELO - 430} texto="¿O PROMETEO?" o={prom} tam={30} />
        {/* Zeus de rodillas */}
        <Personaje x={zx} y={zy} s={1.05} voltear tocado="corona" capa={C.purpura} inclinar={8} brazo={zeusB} brazoAtras={[-150, -30]} boca={habla(f, t2 - 5, t2 + 40) || (f < t1 && Math.floor(f / 11) % 3 === 0)} ojosCerrados={f < t2 - 10 || (f > t2 + 50 && f < golpe)} />
        <Dolor x={coro[0]} y={coro[1] + 30} f={f} k={(1 - ap(f, golpe, 10)) * 0.8} r={55} />
        {habla(f, t2 - 5, t2 + 40) && <Sonido x={coro[0] - 70} y={coro[1] + 50} f={f} s={1.2} ang={180} />}
        <Rotulo x={coro[0]} y={coro[1] - 110} texto="¡GOLPEA!" o={vida(f, t2, t2 + 60, 8)} tam={40} color={C.oro} />
        {/* Hefesto, cojeando, con el hacha doble */}
        <Personaje x={hef.x} y={hy} s={1} accion={hef.accion} inclinar={cojea} tocado="cinta" ropa="corta" brazo={brazo} brazoAtras={brazoAtras} boca={f > golpe - 8 && f < golpe + 6} />
        <Hacha mano={mano} ang={ang} s={0.95} brillo={f > t2 + 60 && f < golpe ? 0.8 : 0} f={f} />
        <Rotulo x={hef.x + 20} y={SUELO - 440} texto="HEFESTO" o={vida(f, t0 + 80, t1 + 30)} />
        <Brecha x={coro[0]} y={coro[1] + 18} a={ap(f, golpe, 30)} s={0.7} f={f} />
        {f > golpe && f < golpe + 30 && <Chispas x={coro[0]} y={coro[1]} f={f} n={20} viento={-1} />}
        <Destello o={pulso(f, golpe, 18)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 7 · Nace Atenea
const Nace: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 1.06], [t0 + 20, 0, 1], [t1, 120, 1], [t2, 150, 1.08], [t3, 0, 1], [dur, -60, 1]];
  const zx = 760;
  const alza = entre(f, t3 + 10, t3 + 50, 0, 1);
  const zy = SUELO + 90 * (1 - alza);
  const coro = coronillaDe({ x: zx, y: SUELO + 90, s: 1.05, inclinar: 8 });
  const sale = t0 + 20, llega = t0 + 80;
  const u = Math.max(0, Math.min(1, (f - sale) / (llega - sale)));
  const ue = Easing.out(Easing.quad)(u);
  const ax = lerp([coro[0], 0], [1250, 0], ue)[0];
  const ay = coro[1] + (SUELO - coro[1]) * u - Math.sin(u * Math.PI) * 170;
  const as = 0.12 + 0.93 * ue;
  const grito = f > t2 && f < t2 + 90;
  const sacude = f > t2 && f < t2 + 60 ? 0.7 : 0;
  const atB: [number, number] = grito ? [entre(f, t2, t2 + 10, 120, 172), 0] : f > t1 ? [130, 20] : u < 1 ? [150, 20] : [100, 20];
  const retro = (i: number) => entre(f, t3, t3 + 60, 0, -120 - i * 40);
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.05}><Sol x={1450} y={250} r={46} f={f} /></Capa>
      <Velo o={0.25 * (1 - ap(f, t1, 60))} color="#3A1206" />
      <Capa p={0.25}>
        <Monte x={400} alto={240} ancho={700} o={0.45} />
        <Monte x={1700} alto={200} ancho={600} o={0.4} />
      </Capa>
      <Capa p={0.6}>
        <Agua nivel={SUELO - 135} f={f} x0={-700} x1={3600} alto={22} vel={grito ? 3 : 0.6} />
        {[300, 1000, 1800].map((x, i) => <Palmera key={x} x={x} y={SUELO - 60} s={0.75} f={f + i * 30} color={C.barroOscuro} />)}
      </Capa>
      <Capa p={1}>
        <Tiembla f={f} k={sacude}>
          <Suelo desde={-1200} hasta={3600} />
          <Orilla />
          {/* los dioses retroceden asombrados */}
          {[{ x: 200, p: { tocado: 'petaso' as const, alas: true, objeto: 'caduceo' as const, barba: false } }, { x: 340, p: { mujer: true, tocado: 'corona' as const, objeto: 'cetro' as const } }].map((g, i) => (
            <Personaje key={i} x={g.x + retro(i)} s={0.9} accion={f > t3 && f < t3 + 60 ? 'caminar' : 'parado'} {...g.p} brazo={f > sale ? [150 + Math.sin(f / 7 + i) * 10, 20] : [40, 30]} brazoAtras={f > sale ? [-140, -20] : undefined} cabeza={f > sale && f < t3 ? -14 : 0} />
          ))}
          <Personaje x={520 + retro(2)} s={1} accion={f > t3 && f < t3 + 60 ? 'caminar' : 'parado'} tocado="cinta" brazo={f > sale ? [140, 30] : [40, 20]} cabeza={f > sale && f < t3 ? -12 : 0} />
          <Hacha mano={[470 + retro(2), SUELO - 30]} ang={160} s={0.85} />
          <Rotulo x={360} y={SUELO - 420} texto="LOS DIOSES" o={vida(f, t3 + 10, dur, 20)} tam={28} />
          {/* Zeus */}
          <Personaje x={zx} y={zy} s={1.05} tocado="corona" capa={C.purpura} inclinar={8 * (1 - alza)} brazo={f > t3 + 40 ? [entre(f, t3 + 40, t3 + 60, 40, 120), 20] : [40, 40]} brazoAtras={[-30, -30]} boca={f > t3 + 50 && Math.floor(f / 6) % 2 === 0} cabeza={f > sale && f < t3 ? -16 : 0} />
          <Brecha x={coro[0]} y={coro[1] + 18} a={(1 - ap(f, sale + 20, 60)) * 1} s={0.8} f={f} />
          {/* Atenea salta armada */}
          {f > sale && (
            <g>
              {u < 1 && Array.from({ length: 6 }, (_, i) => {
                const uu = Math.max(0, u - i * 0.05);
                const px = lerp([coro[0], 0], [1250, 0], Easing.out(Easing.quad)(uu))[0], py = coro[1] + (SUELO - coro[1]) * uu - Math.sin(uu * Math.PI) * 170 - 150 * (0.12 + 0.93 * uu);
                return <circle key={i} cx={px} cy={py} r={20 - i * 2.5} fill={C.oro} opacity={0.5 - i * 0.07} />;
              })}
              <Atenea x={ax} y={ay} s={as} f={f} voltear={f > t1 + 20} accion={u < 1 ? 'correr' : 'parado'} inclinar={u < 1 ? 18 : 0} brazo={atB} brazoAtras={u < 1 ? [-120, -20] : undefined} boca={grito} brillo={u < 1 ? 0.8 : 0.35 + Math.sin(f / 8) * 0.1} />
            </g>
          )}
          {grito && <Onda x={1250 - 30} y={SUELO - 360} f={f - t2} o={1 - ap(f, t2 + 70, 20)} r={900} />}
          <Rotulo x={1250} y={SUELO - 470} texto="ATENEA" o={vida(f, t1, t3, 20)} tam={40} />
        </Tiembla>
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 8 · El mundo se detiene
const Temblor: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1], [t1, 250, 1], [t1 + 90, 800, 1], [t2, 700, 1], [t2 + 60, 600, 1], [t3, 150, 1.06], [t4, 250, 1.02], [t4 + 80, 2000, 1], [dur, 2060, 1.03]];
  const sacude = f < t1 + 40 ? 0.9 * (1 - ap(f, t1 + 10, 30)) : 0;
  const agita = vida(f, t1 - 20, t3, 30);
  const carroX = f < t3 + 60 ? entre(f, 0, t2 + 50, -700, 1150, Easing.out(Easing.cubic)) : entre(f, t3 + 60, dur, 1150, 3200, Easing.in(Easing.quad));
  const quieto = f > t2 + 40 && f < t3 + 60;
  const sinArmas = f > t3 + 50;
  const rie = f > t3 + 90 && f < t4 + 20;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.15}>
        <Nube x={400} y={220} s={0.6} f={f} />
        <Nube x={1900} y={250} s={0.5} f={f + 50} />
      </Capa>
      <Capa p={0.3}>
        <Tiembla f={f} k={sacude * 1.2}>
          <Cumbre x={700} cima={SUELO - 430} ancho={1150} meseta={130} color={C.barroOscuro} />
          {sacude > 0 && Array.from({ length: 6 }, (_, i) => {
            const t = ((f / 20 + i / 6) % 1);
            return <circle key={i} cx={560 + i * 50} cy={SUELO - 380 + t * 300} r={8 + (i % 3) * 4} fill={C.negro} opacity={sacude * (1 - t)} />;
          })}
          <Rotulo x={740} y={SUELO - 590} texto="OLIMPO" o={vida(f, t0, t1, 20)} tam={30} />
        </Tiembla>
      </Capa>
      {/* Helios detiene su carro */}
      <Capa p={0.5}>
        <Nube x={carroX + 120} y={448} s={0.9} f={f} />
        <CarroSol x={carroX} y={430} f={f} s={0.62} rueda={quieto ? 0 : 1} />
        {[0, 1].map((i) => <Caballo key={i} x={carroX + 230 + i * 70} y={430} s={0.55} f={f + i * 7} anda={!quieto} encabrita={quieto ? ap(f, t2 + 40, 20) * (1 - ap(f, t2 + 120, 30)) : 0} color={i ? C.negro : '#2A1A10'} />)}
        <Rotulo x={carroX + 160} y={200} texto="HELIOS" o={vida(f, t2 + 10, t3 + 60, 20)} tam={30} />
      </Capa>
      <Capa p={1}>
        <Tiembla f={f} k={sacude * 0.6}>
          <Suelo desde={-1200} hasta={1500} />
          {/* grietas del suelo que grita */}
          {[300, 1250].map((x, i) => <path key={x} d={`M${x - 80} ${SUELO + 2} l 30 ${-8 * ap(f, t0 + 30 + i * 20, 20)} l 30 10 l 40 -14 l 40 12`} stroke={C.oro} strokeWidth={4} fill="none" opacity={vida(f, t0 + 30, t1 + 40)} />)}
          <Personaje x={680} s={1.05} tocado="corona" capa={C.purpura} brazo={rie ? [120 + Math.sin(f / 5) * 10, 30] : [40, 30]} inclinar={rie ? -6 + Math.sin(f / 4) * 3 : 0} boca={rie && Math.floor(f / 5) % 2 === 0} cabeza={rie ? -10 : 0} />
          <Rotulo x={700} y={SUELO - 440} texto="ZEUS" o={vida(f, t3 + 90, t4)} tam={30} />
          <Atenea x={1050} s={1.05} f={f} voltear casco={!sinArmas} escudo={!sinArmas} brazo={sinArmas ? [40, 40] : [entre(f, t3, t3 + 20, 150, 60), 20]} brillo={0.3 + Math.sin(f / 8) * 0.1} objeto={sinArmas ? null : 'lanza'} />
          {sinArmas && (
            <g opacity={ap(f, t3 + 50, 15)}>
              <g transform={`translate(1210 ${SUELO - 10}) rotate(-80)`}>
                <circle r={62} fill={C.negro} stroke={C.purpura} strokeWidth={8} />
                <circle r={54} fill="none" stroke={C.blanco} strokeWidth={2} strokeDasharray="2 8" />
              </g>
              <CascoSuelto x={1290} y={SUELO} s={0.5} />
              <path d={`M1180 ${SUELO} L 1236 ${SUELO - 330}`} stroke={C.negro} strokeWidth={7} strokeLinecap="round" />
              <path d={`M1236 ${SUELO - 330} l 4 -40 l 6 38 Z`} fill={C.negro} />
            </g>
          )}
          <Mar desde={1450} hasta={4300} y={SUELO - 40 - agita * 30} f={f * (1 + agita * 1.5)} id="temb" alto={40 + agita * 30} />
          {Array.from({ length: 8 }, (_, i) => {
            const a0 = t1 - 10 + i * 34;
            const x = 1700 + (i % 4) * 330 + (i > 3 ? 160 : 0);
            return <Salpicadura key={i} x={x} y={SUELO - 50} t={(f - a0) / 40} s={1.1} />;
          })}
          {Array.from({ length: 6 }, (_, i) => {
            const a0 = t1 + 150 + i * 60;
            return a0 < t3 ? <Salpicadura key={`b${i}`} x={1650 + (i % 3) * 400} y={SUELO - 50} t={(f - a0) / 40} s={0.8} /> : null;
          })}
          {/* lluvia de oro sobre Rodas */}
          <Isla x={2950} y={SUELO - 30} ancho={620} alto={200} arboles={4} seed={3} />
          <Nube x={2950} y={270} s={1.1} f={f} />
          <LluviaOro x0={2700} x1={3200} y0={300} y1={SUELO - 60} f={f} o={ap(f, t4 + 40, 40)} />
          <circle cx={2950} cy={SUELO - 150} r={240} fill="url(#halo)" opacity={ap(f, t4 + 60, 40) * 0.6} style={{ mixBlendMode: 'screen' }} />
          <Rotulo x={2950} y={SUELO - 280} texto="RODAS" o={vida(f, t4 + 80, dur, 20)} tam={30} />
        </Tiembla>
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 9 · La hija favorita
const Diosa: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1], [t1 - 20, 0, 1], [t1 + 40, 1750, 1], [t2 - 20, 1850, 1], [t2 + 40, 4000, 1], [t3 - 20, 4200, 1], [t3 + 40, 5700, 1], [dur, 5850, 1.04]];
  // B · Ares contra la estrategia
  const aresX = f < t1 + 100 ? entre(f, t1 + 20, t1 + 100, 3700, 2560, lin) : entre(f, t1 + 100, t1 + 120, 2560, 2760, Easing.out(Easing.quad));
  const choca = f > t1 + 100;
  const ateneaB = entre(f, t1 + 80, t1 + 100, 2300, 2330);
  // C · los oficios
  const camina = andar(f, t2 + 10, t3 - 30, 4150, 5350);
  // D · símbolos
  const olivo = ap(f, t3 + 50, 50);
  const bx = entre(f, t3 + 60, t3 + 140, 8000, 7530, Easing.out(Easing.quad)), by = entre(f, t3 + 60, t3 + 140, 260, SUELO - 236);
  const posado = f > t3 + 140;
  const egida = ap(f, t3 + 130, 20);
  const zeus = andar(f, t4 - 20, t4 + 60, 5700, 6260);
  const sombra = vida(f, t4 + 50, dur, 20), deshace = ap(f, t4 + 110, 60);
  const tx = 7120, ty = 345;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.05}><Sol x={1600} y={240} r={44} f={f} /></Capa>
      <Capa p={0.3}>
        {[200, 1100, 2000, 2900].map((x, i) => <Monte key={x} x={x} alto={240 + (i % 2) * 70} ancho={520} o={0.4} />)}
        <Nube x={700} y={220} s={0.5} f={f} />
        <Nube x={2200} y={250} s={0.55} f={f + 40} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-1200} hasta={8800} />
        {/* A · la fuerza del padre y la mente de la madre */}
        <Personaje x={620} s={1.05} tocado="corona" capa={C.purpura} objeto="rayo" brazo={[60, 40]} />
        <Rotulo x={640} y={SUELO - 440} texto="FUERZA DE ZEUS" o={vida(f, 30, t1 - 10)} tam={26} />
        <Atenea x={960} s={1.05} f={f} brazo={[60, 30]} brillo={0.4 + Math.sin(f / 8) * 0.1} />
        <Rotulo x={980} y={SUELO - 470} texto="ATENEA" o={vida(f, 10, t1 - 10)} tam={34} />
        <circle cx={1300} cy={SUELO - 200} r={160} fill="url(#halo)" opacity={0.35} style={{ mixBlendMode: 'screen' }} />
        <Personaje x={1300} s={1} voltear mujer tocado="velo" contorno opacity={0.55 + Math.sin(f / 10) * 0.1} brazo={[70, 40]} />
        <Rotulo x={1300} y={SUELO - 440} texto="MENTE DE METIS" o={vida(f, 60, t1 - 10)} tam={26} />
        {/* B · Ares choca contra el escudo */}
        <Atenea x={ateneaB} s={1.05} f={f} brazo={[40, 30]} brazoAtras={f > t1 + 70 ? [80, -30] : undefined} />
        <Personaje x={aresX} s={1.05} voltear accion={f > t1 + 20 && f < t1 + 100 ? 'correr' : 'parado'} tocado="casco" ropa="armadura" objeto="lanza" escudo emblema="leon" boca={f > t1 + 30 && f < t1 + 110} inclinar={choca ? -entre(f, t1 + 100, t1 + 115, 0, 25) * (1 - ap(f, t1 + 140, 30)) : undefined} brazo={choca ? [150, 30] : [100, 0]} />
        {f > t1 + 98 && f < t1 + 125 && <Chispas x={2440} y={SUELO - 230} f={f} n={16} viento={1} />}
        {f > t1 + 98 && <circle cx={2440} cy={SUELO - 220} r={120} fill="url(#halo)" opacity={pulso(f, t1 + 98, 25)} style={{ mixBlendMode: 'screen' }} />}
        <Rotulo x={3000} y={SUELO - 450} texto="ARES" o={vida(f, t1 + 30, t2, 20)} tam={30} />
        <Rotulo x={2330} y={SUELO - 470} texto="ESTRATEGIA" o={vida(f, t1 + 110, t2, 20)} tam={30} color={C.oro} />
        {/* C · tejer, hacer vasijas, construir barcos, domar caballos */}
        <Telar x={4420} t={entre(f, t2, t3, 0.1, 1, lin)} f={f} s={0.95} />
        <Personaje x={4260} s={0.85} mujer tocado="cinta" brazo={[120 + Math.sin(f / 6) * 20, 30]} brazoAtras={[80 + Math.sin(f / 6 + 2) * 20, -20]} />
        <Vasija x={4740} s={0.7} />
        <Vasija x={4840} s={0.95} />
        <Vasija x={4950} s={0.6} />
        <g transform={`translate(5260 ${SUELO})`}>
          <path d="M-200 0 C -190 -20, -170 -40, -140 -46 L 160 -46 C 190 -60, 200 -80, 210 -100 L 222 -96 C 214 -60, 196 -24, 170 0 Z" fill={C.negro} />
          {[-120, -60, 0, 60, 120].map((x) => <path key={x} d={`M${x} -46 C ${x + 6} -120, ${x + 10} -160, ${x + 4} -200`} stroke={C.negro} strokeWidth={8} fill="none" opacity={0.9} />)}
          <Borde d="M-150 -30 L 160 -30" w={6} />
        </g>
        <Caballo x={5650} s={0.85} f={f} anda={false} />
        <Personaje x={5500} s={0.8} barba tocado="cinta" brazo={[80, 0]} />
        <Atenea x={camina.x} s={1} f={f} accion={camina.accion} brazo={camina.accion === 'parado' ? [80, 20] : undefined} objeto="lanza" />
        <Rotulo x={4420} y={SUELO - 360} texto="TEJER" o={vida(f, t2 + 30, t3, 20)} tam={26} />
        <Rotulo x={4840} y={SUELO - 230} texto="VASIJAS" o={vida(f, t2 + 50, t3, 20)} tam={26} />
        <Rotulo x={5260} y={SUELO - 250} texto="BARCOS" o={vida(f, t2 + 80, t3, 20)} tam={26} />
        <Rotulo x={5650} y={SUELO - 290} texto="CABALLOS" o={vida(f, t2 + 110, t3, 20)} tam={26} />
        {/* D · el búho, el olivo y la égida */}
        <g transform={`translate(7400 ${SUELO}) scale(${0.2 + olivo * 0.8}) translate(-7400 ${-SUELO})`} opacity={olivo}>
          <Olivo x={7400} f={f} s={1} />
        </g>
        <Rotulo x={7400} y={SUELO - 340} texto="OLIVO" o={vida(f, t3 + 70, t4, 20)} tam={28} />
        <Atenea x={6700} s={1.05} f={f} brazo={[50, 30]} brillo={egida * (0.3 + Math.sin(f / 6) * 0.1)} />
        {egida > 0 && <Egida x={6700} s={1.05} f={f} brillo={egida * (0.6 + Math.sin(f / 4) * 0.3)} />}
        <Rotulo x={6720} y={SUELO - 470} texto="ÉGIDA" o={vida(f, t3 + 140, t4, 20)} tam={28} />
        {f > t3 + 60 && <Buho x={posado ? 7530 : bx} y={posado ? SUELO - 236 : by} s={0.75} f={f} vuela={!posado} voltear />}
        <Rotulo x={7540} y={SUELO - 360} texto="BÚHO" o={vida(f, t3 + 100, t4, 20)} tam={26} />
        {/* Zeus y el hijo que nunca nació */}
        <Personaje x={zeus.x} s={1.05} accion={zeus.accion} tocado="corona" capa={C.purpura} objeto="cetro" brazo={zeus.accion === 'parado' ? [80, 20] : undefined} />
        <Tondo x={tx} y={ty} r={120} o={sombra} id="nunca" fondo="#6A3420">
          <g opacity={1 - deshace}>
            <Personaje x={tx - 10} y={ty + 110} s={0.45} barba={false} tocado="corona" objeto="rayo" brazo={[160, 10]} contorno />
          </g>
          {deshace > 0 && Array.from({ length: 30 }, (_, i) => (
            <circle key={i} cx={tx - 40 + azar(i) * 80 + deshace * (azar(i + 3) - 0.5) * 260} cy={ty - 80 + azar(i * 5) * 200 - deshace * azar(i + 7) * 120} r={3 + azar(i) * 3} fill={C.crema} opacity={1 - deshace} />
          ))}
        </Tondo>
        <Rotulo x={tx} y={ty + 168} texto="NUNCA NACIÓ" o={sombra} tam={26} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 10 · Una ciudad para la diosa
const Cierre: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 1], [t1, 450, 1], [t2, 800, 1], [t3, 850, 1.03], [dur, 870, 1.06]];
  const at1 = andar(f, t0, t1 + 80, 150, 1150);
  const top = SUELO + 20 - 300;
  const golpe = t2 + 20;
  const huyen = f > golpe + 10;
  const pos = ap(f, t3 - 40, 70);
  const py = SUELO + 120 + (1 - pos) * 420;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.05}><Sol x={500} y={240} r={44} f={f} /></Capa>
      <Velo o={ap(f, golpe, 20) * 0.25} color="#1A2A3A" />
      <Capa p={0.25}>
        <Monte x={600} alto={260} ancho={650} o={0.45} />
        <Nube x={1500} y={230} s={0.55} f={f} color={f > golpe ? '#9AA6A8' : C.crema} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-1200} hasta={2250} />
        <Pena x={1600} ancho={900} alto={300} />
        <Rotulo x={1600} y={top - 250} texto="ATENAS" o={vida(f, t1 + 30, dur, 20)} tam={34} />
        <Casa x={1340} y={top} s={0.5} />
        <Casa x={1480} y={top} s={0.42} o={ap(f, t1 + 40, 30)} />
        {[0, 1, 2].map((i) => {
          const x0 = 1260 + i * 130;
          const x = huyen ? entre(f, golpe + 10 + i * 4, golpe + 70, x0, 1150 + i * 40, lin) : x0 + Math.sin(f / 30 + i * 2) * 40;
          return <Personaje key={i} x={x} y={top} s={0.38} voltear={huyen || Math.cos(f / 30 + i * 2) < 0} accion={huyen ? 'correr' : 'caminar'} barba={i !== 1} mujer={i === 1} brazo={huyen ? [160, 20] : [150, 40]} />;
        })}
        {/* el tridente de Poseidón */}
        <Relampago a={[1900, 130]} b={[1850, top]} f={f} desde={golpe} dur={12} />
        {f > golpe && <TridenteClavado x={1850} y={top + 6} s={0.75} f={f} brota={ap(f, golpe + 20, 30)} brillo={pulso(f, golpe, 40)} />}
        <Destello o={pulso(f, golpe, 14) * 0.7} />
        {/* Atenea llega con su búho */}
        <Atenea x={at1.x} s={1.05} f={f} accion={at1.accion} brazo={f > t3 ? [entre(f, t3, t3 + 20, 60, 120), 20] : at1.accion === 'parado' ? [70, 20] : undefined} />
        <Buho x={at1.x - 60 + Math.sin(f / 20) * 30} y={300 + Math.sin(f / 15) * 20} s={0.6} f={f} vuela />
        {/* Poseidón sale del mar */}
        <Personaje x={2560} y={py} s={1.3} voltear tocado="corona" barba capa={C.mar} brazo={pos > 0.8 ? [entre(f, t3 + 30, t3 + 50, 40, 120), 10] : [40, 30]} contorno={false} boca={habla(f, t3 + 40, t3 + 90)} />
        <Mar desde={2150} hasta={4300} y={SUELO - 40} f={f * (1 + pos)} id="cierre" alto={40 + pos * 20} />
        <Salpicadura x={2560} y={SUELO - 40} t={(f - (t3 - 40)) / 40} s={1.4} />
        <Rotulo x={2560} y={SUELO - 420} texto="POSEIDÓN" o={vida(f, t3 + 20, dur, 20)} tam={38} />
      </Capa>
    </Escenario>
  );
};

export const ESCENAS: Record<string, React.FC<EscenaV>> = {
  metis: Metis,
  profecia: Profecia,
  engano: Engano,
  dentro: Dentro,
  dolor: Dolores,
  hacha: HachaEsc,
  nacimiento: Nace,
  temblor: Temblor,
  diosa: Diosa,
  cierre: Cierre,
};
