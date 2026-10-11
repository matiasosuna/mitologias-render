// Piezas propias del video 07 · Tifón, el último monstruo (estilo vasija detallada):
// siluetas negras con `suave`/`miembro`, incisiones crema con `Inc`, púrpura y blanco añadidos con `Borde`.
// Algunas piezas parten de las de los videos 02, 05 y 06 (copiadas acá para no tocar otras carpetas).
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, P, SUELO, suave, miembro, desde, lerp, Inc, Borde, Fuego, azar, Personaje, PersonajeProps } from '../../comun/vasija';

export const LAVA = '#F08A2C';
export const PIEDRA = '#3A1A0C';
export const TIERRA = '#4A2412';
export const MAR = '#2E4A5C';
export const SANGRE = '#9E2E1F';
export const VERDE = '#3E5A2A';

// ---------------------------------------------------------------- geometría de Personaje
const rotar = (p: P, inclinar: number): P => {
  const r = (inclinar * Math.PI) / 180, dx = p[0], dy = p[1] + 176;
  return [dx * Math.cos(r) - dy * Math.sin(r), dx * Math.sin(r) + dy * Math.cos(r) - 176];
};
export type Pose = { x: number; y?: number; s?: number; voltear?: boolean; inclinar?: number };
/** Posición en el mundo de la mano de adelante de un Personaje. */
export function manoDe(p: Pose & { brazo: [number, number] }): P {
  const hD: P = [14, -292], cD = desde(hD, p.brazo[0], 66), mD = desde(cD, p.brazo[0] + p.brazo[1], 60);
  const r = rotar(mD, p.inclinar ?? 0), s = p.s ?? 1;
  return [p.x + (p.voltear ? -1 : 1) * s * r[0], (p.y ?? SUELO) + s * r[1]];
}
/** Mano de atrás de un Personaje. */
export function manoAtrasDe(p: Pose & { brazo: [number, number] }): P {
  const hT: P = [-4, -292], cT = desde(hT, p.brazo[0], 66), mT = desde(cT, p.brazo[0] + p.brazo[1] + 40, 60);
  const r = rotar(mT, p.inclinar ?? 0), s = p.s ?? 1;
  return [p.x + (p.voltear ? -1 : 1) * s * r[0], (p.y ?? SUELO) + s * r[1]];
}
/** Ojo de un Personaje en el mundo. */
export function cabezaDe(p: Pose & { gigante?: boolean }): P {
  const r = rotar([20 * (p.gigante ? 1.35 : 1) + 18, -340], p.inclinar ?? 0), s = p.s ?? 1;
  return [p.x + (p.voltear ? -1 : 1) * s * r[0], (p.y ?? SUELO) + s * r[1]];
}
/** Grupo con la misma transformación que un Personaje (para agregarle partes). */
export const Marco: React.FC<Pose & { children: React.ReactNode; opacity?: number; girar?: boolean }> = ({ x, y = SUELO, s = 1, voltear, inclinar = 0, children, opacity = 1, girar = true }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})${girar ? ` rotate(${inclinar} 0 -176)` : ''}`} opacity={opacity}>{children}</g>
);
/** Personaje acostado en el suelo (la cabeza hacia la izquierda; con `voltear`, hacia la derecha). `t` 0→1 lo acuesta. */
export const Acostado: React.FC<{ x: number; y?: number; t: number; voltear?: boolean; s?: number; children: React.ReactNode }> = ({ x, y = SUELO, t, voltear, s = 1, children }) => (
  <g transform={`translate(0 ${-40 * s * t}) rotate(${(voltear ? 90 : -90) * t} ${x} ${y})`}>{children}</g>
);

// ---------------------------------------------------------------- serpientes
/** Cabeza de serpiente mirando hacia +x (origen = nuca). Con `fuego`, los ojos arden. */
const CabezaSerpiente: React.FC<{ f: number; k: number; color: string; claro?: boolean; fuego?: number; boca?: number }> = ({ f, k, color, claro, fuego = 0, boca = 0 }) => {
  const ab = boca * (0.5 + 0.5 * Math.sin(f / 3 + k));
  return (
    <g>
      {Math.sin(f / 5 + k) > 0.2 && <path d="M34 2 L 50 0 L 56 -5 M50 0 L 56 5" stroke={C.purpura} strokeWidth={2.5} fill="none" strokeLinecap="round" />}
      <path d={suave([[-8, -11], [12, -13], [30, -7 - ab * 6], [38, -2 - ab * 8], [22, 2], [36, 6 + ab * 8], [22, 9 + ab * 4], [-8, 11]], true)} fill={color} stroke={claro ? C.crema : 'none'} strokeWidth={1.5} />
      {fuego > 0 && <circle cx={18} cy={-5} r={14} fill="url(#halo)" opacity={fuego} style={{ mixBlendMode: 'screen' }} />}
      <circle cx={18} cy={-5} r={3.4} fill={fuego > 0.4 ? C.oro : C.crema} />
      <circle cx={19} cy={-5} r={1.5} fill={fuego > 0.4 ? '#B8331C' : C.negro} />
      <Inc d="M6 4 Q 16 6 24 3" w={1.3} />
    </g>
  );
};

/** Serpiente gruesa por una lista de puntos, con banda decorada y cabeza al final. */
export const Serpiente: React.FC<{ pts: P[]; ancho?: number; f: number; k?: number; color?: string; claro?: boolean; cabeza?: boolean; fuego?: number; boca?: number; banda?: string }> = ({ pts, ancho = 40, f, k = 0, color = C.negro, claro, cabeza = true, fuego = 0, boca = 0, banda = C.purpura }) => {
  const n = pts.length;
  const anchos = pts.map((_, i) => ancho * (1 - (i / (n - 1)) * 0.72));
  const e = pts[n - 1], q = pts[n - 2];
  const ang = (Math.atan2(e[1] - q[1], e[0] - q[0]) * 180) / Math.PI;
  return (
    <g>
      <path d={miembro(pts, anchos)} fill={color} stroke={claro ? C.crema : 'none'} strokeWidth={1.6} />
      <Borde d={suave(pts.slice(0, n - 1))} w={ancho * 0.22} color={banda} />
      {pts.slice(1, n - 1).map((p, i) => {
        const a = pts[i], b = pts[i + 2];
        const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, w = anchos[i + 1] * 0.32;
        return <Inc key={i} d={`M${p[0] + nx * w - dx * 0.08} ${p[1] + ny * w - dy * 0.08} L${p[0] + nx * w * 0.4} ${p[1] + ny * w * 0.4} L${p[0] + nx * w + dx * 0.08} ${p[1] + ny * w + dy * 0.08}`} w={1.4} />;
      })}
      {cabeza && (
        <g transform={`translate(${e[0]} ${e[1]}) rotate(${ang}) scale(${Math.max(0.7, ancho / 40)})`}>
          <CabezaSerpiente f={f} k={k} color={color} claro={claro} fuego={fuego} boca={boca} />
        </g>
      )}
    </g>
  );
};

/** Colas de serpiente en lugar de piernas (coordenadas de Personaje: pies en 0, cadera en -176). */
const Colas: React.FC<{ f: number; color: string; claro?: boolean; seed: number; enrosca?: number; fuego?: number }> = ({ f, color, claro, seed, enrosca = 1, fuego = 0 }) => {
  const ond = (i: number, k: number) => (i > 1 ? Math.sin(f * 0.11 + i * 0.9 + k + seed) * (4 + i * 2.2) * enrosca : 0);
  const atras: P[] = [[-8, -186], [-26, -130], [-16, -74], [-50, -22], [-120, -8], [-190, -24], [-226, -70], [-212, -120]];
  const adel: P[] = [[10, -186], [34, -128], [26, -66], [66, -18], [134, -6], [196, -30], [224, -80], [204, -126]];
  const mov = (pts: P[], k: number) => pts.map(([x, y], i) => [x + ond(i, k + 2) * 0.6, Math.min(-6, y + ond(i, k))] as P);
  return (
    <g>
      <Serpiente pts={mov(atras, 0)} ancho={42} f={f} k={seed} color={color} claro={claro} fuego={fuego} />
      <Serpiente pts={mov(adel, 1.7)} ancho={44} f={f} k={seed + 3} color={color} claro={claro} fuego={fuego} />
    </g>
  );
};

/** Alas grandes en la espalda. `abre` 0→1 las despliega. Coordenadas de Personaje. */
export const AlasGrandes: React.FC<Pose & { f: number; color?: string; claro?: boolean; abre?: number }> = ({ f, color = C.negro, claro, abre = 1, ...p }) => {
  if (abre <= 0) return null;
  const ang = Math.sin(f / 9) * 10 * abre + (1 - abre) * 70;
  const ala: P[] = [[-2, -298], [-60, -380], [-150, -460], [-260, -500], [-230, -450], [-280, -430], [-220, -400], [-250, -370], [-180, -350], [-200, -320], [-110, -290], [-24, -262]];
  return (
    <Marco {...p}>
      <g transform={`rotate(${ang} -6 -290) translate(-6 -290) scale(${0.4 + abre * 0.6}) translate(6 290)`} opacity={Math.min(1, abre * 2)}>
        <path d={suave(ala, true, 0.8)} fill={color} stroke={claro ? C.crema : C.negro} strokeWidth={2} />
        <Borde d={suave([[-14, -300], [-90, -390], [-180, -460]])} w={12} />
        {[0, 1, 2, 3, 4].map((i) => <Inc key={i} d={suave([[-50 - i * 20, -320 + i * 6], [-120 - i * 20, -370 + i * 14], [-200 - i * 8, -420 + i * 18]])} w={1.8} />)}
      </g>
    </Marco>
  );
};

/** Cuellos de serpiente que brotan de los hombros. `largo` 0→1 los hace crecer. */
export const CuellosSerpiente: React.FC<Pose & { f: number; n?: number; color?: string; claro?: boolean; largo?: number; fuego?: number; boca?: number; abanico?: number }> = ({ f, n = 8, color = C.negro, claro, largo = 1, fuego = 0, boca = 0, abanico = 1, ...p }) => {
  if (largo <= 0.02) return null;
  return (
    <Marco {...p}>
      {Array.from({ length: n }, (_, i) => {
        const base: P = [-14 + (i % 3) * 8, -296];
        const a0 = -92 - i * ((120 * abanico) / (n - 1)) + (abanico - 1) * 20;
        const w = Math.sin(f / 8 + i * 1.3) * 14;
        const L = (0.85 + azar(i + 5) * 0.3) * largo;
        const p1 = desde(base, a0 + w, 70 * L), p2 = desde(p1, a0 - w * 1.5 - 25, 70 * L), p3 = desde(p2, a0 + w + 30, 55 * L);
        return <Serpiente key={i} pts={[base, p1, p2, p3]} ancho={22} f={f} k={i} color={color} claro={claro} fuego={fuego} boca={boca} />;
      })}
    </Marco>
  );
};

/** Sacudida (para temblores o golpes). */
export const temblor = (f: number, k: number): P => (k > 0 ? [Math.sin(f * 1.9) * 9 * k, Math.cos(f * 2.3) * 5 * k] : [0, 0]);

// ---------------------------------------------------------------- Tifón
export type TifonProps = PersonajeProps & {
  id: string;
  /** Cantidad de cuellos de serpiente. */
  cuellos?: number;
  /** Crecimiento de los cuellos 0→1. */
  largo?: number;
  /** Alas desplegadas 0→1. */
  ala?: number;
  /** Ojos de fuego 0→1. */
  ojos?: number;
  /** Bocas de serpiente abiertas 0→1. */
  rugido?: number;
  enrosca?: number;
  /** Debilidad 0→1 (los frutos efímeros): se apaga y se encorva. */
  debil?: number;
  /** Abanico de cuellos (1 normal, <1 más juntos). */
  abanico?: number;
};

/** Tifón: gigante con cien cabezas de serpiente en los hombros, alas, ojos de fuego y cuerpo de serpientes. */
export const Tifon: React.FC<TifonProps> = ({ id, cuellos = 10, largo = 1, ala = 1, ojos = 1, rugido = 0, enrosca = 1, debil = 0, abanico = 1, ...p }) => {
  const f = useCurrentFrame();
  const s = p.s ?? 1, y = p.y ?? SUELO;
  const color = p.piel ?? C.negro;
  const pose = { x: p.x, y, s, voltear: p.voltear, inclinar: p.inclinar };
  const fuego = ojos * (1 - debil * 0.8);
  const ojo = cabezaDe({ ...pose, gigante: true });
  return (
    <g opacity={p.opacity ?? 1}>
      <AlasGrandes {...pose} f={f} abre={ala * (1 - debil * 0.5)} claro={p.contorno} color={color} />
      <defs>
        <clipPath id={`cg-${id}`}>
          <rect x={p.x - 3000} y={-6000} width={6000} height={y - 170 * s + 6000} />
        </clipPath>
      </defs>
      {/* melena salvaje */}
      <Marco {...pose}>
        <g transform={`translate(${20 * 1.35} -334) rotate(${-6 - (p.cabeza ?? 0)})`}>
          {[0, 1, 2, 3, 4].map((i) => {
            const d = suave([[-20 + i * 3, -26 + i * 8], [-48 - i * 9, -4 + i * 12 + Math.sin(f / 9 + i) * 7], [-70 - i * 7, 34 + i * 14 + Math.sin(f / 7 + i) * 9], [-62 - i * 10, 78 + i * 10 + Math.sin(f / 8 + i) * 6], [-80 - i * 9, 110 + i * 8]]);
            return (
              <g key={i}>
                {p.contorno && <path d={d} stroke={C.crema} strokeWidth={14 - i} fill="none" strokeLinecap="round" opacity={0.9} />}
                <path d={d} stroke={color} strokeWidth={9 - i} fill="none" strokeLinecap="round" />
              </g>
            );
          })}
        </g>
      </Marco>
      <CuellosSerpiente {...pose} f={f} n={cuellos} largo={largo} claro={p.contorno} color={color} fuego={fuego} boca={rugido} abanico={abanico} />
      <g clipPath={`url(#cg-${id})`}>
        <Marco {...pose}>
          <path d={suave([[-44, -220], [44, -222], [52, -190], [34, -158], [-30, -158], [-50, -188]], true)} fill={color} stroke={p.contorno ? C.crema : 'none'} strokeWidth={3} />
          <Borde d={suave([[-42, -206], [4, -200], [46, -208]])} w={8} />
          {/* escamas en el pecho */}
          {[0, 1, 2].map((r) => [0, 1, 2].map((i) => <path key={`${r}-${i}`} d={`M${-20 + i * 16 + (r % 2) * 8} ${-270 + r * 16} a 7 5 0 0 0 14 0`} stroke={C.crema} strokeWidth={1.4} fill="none" opacity={0.7} />))}
        </Marco>
        <Personaje gigante barba ropa="desnudo" tocado={null} {...p} opacity={1} />
      </g>
      <Marco {...pose} girar={false}>
        <Colas f={f} color={color} claro={p.contorno} seed={id.length * 3.1} enrosca={enrosca * (1 - debil * 0.7)} fuego={fuego * 0.6} />
      </Marco>
      {/* ojos de fuego */}
      {fuego > 0 && (
        <g>
          <circle cx={ojo[0]} cy={ojo[1]} r={60 * s} fill="url(#halo)" opacity={fuego * (0.8 + Math.sin(f / 4) * 0.2)} style={{ mixBlendMode: 'screen' }} />
          <circle cx={ojo[0] - (p.voltear ? -1 : 1) * 2 * s} cy={ojo[1] + 3 * s} r={4.5 * s} fill={C.oro} opacity={fuego} />
          <circle cx={ojo[0] - (p.voltear ? -1 : 1) * 2 * s} cy={ojo[1] + 3 * s} r={2 * s} fill="#B8331C" opacity={fuego} />
        </g>
      )}
    </g>
  );
};

/** Llamarada que sale de una boca en dirección `ang` (grados, 0 = derecha). `o` 0→1. */
export const Llamarada: React.FC<{ x: number; y: number; ang?: number; largo?: number; f: number; o: number }> = ({ x, y, ang = 0, largo = 1, f, o }) => {
  if (o <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang + 90}) scale(${0.6 * o + 0.2} ${largo * (0.4 + o * 1.4)})`} opacity={Math.min(1, o * 2)}>
      <Fuego f={f} viento={Math.sin(f / 3) * 10} />
    </g>
  );
};

// ---------------------------------------------------------------- Gea y criaturas mitad serpiente
/** Gea saliendo de la tierra (sube 0→1). */
export const Gea: React.FC<{ x: number; s?: number; sube: number; brazo?: [number, number]; brazoAtras?: [number, number]; voltear?: boolean; boca?: boolean; cabeza?: number; f: number; enojo?: number; id: string; contorno?: boolean; ojosCerrados?: boolean }> = ({ x, s = 1.4, sube, brazo = [40, 30], brazoAtras = [-20, -30], voltear, boca, cabeza = 0, f, enojo = 0, id, contorno, ojosCerrados }) => {
  const y = SUELO + (400 - 230 * sube) * s;
  if (sube <= 0) return null;
  return (
    <g>
      <defs>
        <clipPath id={`gea-${id}`}>
          <rect x={x - 1500} y={-2000} width={3000} height={SUELO + 6 + 2000} />
        </clipPath>
      </defs>
      {enojo > 0 && <circle cx={x} cy={SUELO - 140 * s} r={260 * s} fill="url(#halo)" opacity={enojo} style={{ mixBlendMode: 'screen' }} />}
      <g clipPath={`url(#gea-${id})`}>
        <Personaje x={x} y={y} s={s} mujer tocado="velo" voltear={voltear} brazo={brazo} brazoAtras={brazoAtras} boca={boca} cabeza={cabeza} contorno={contorno} ojosCerrados={ojosCerrados} />
        <Marco x={x} y={y} s={s} voltear={voltear}>
          <Borde d={suave([[-26, -296], [0, -268], [28, -282]])} w={7} color={VERDE} />
        </Marco>
      </g>
      <g transform={`translate(${x} ${SUELO + 2}) scale(${s})`} opacity={Math.min(1, sube * 3)}>
        <path d={suave([[-150, 4], [-110, -14], [-50, -26], [10, -28], [70, -22], [140, -10], [170, 4]], true)} fill={TIERRA} stroke={C.negro} strokeWidth={3} />
        {[-100, -40, 20, 90].map((cx, i) => <Inc key={cx} d={`M${cx} -6 q 12 -14 26 -2`} w={1.6} c={i % 2 ? C.crema : C.barroClaro} />)}
        {[-130, 140].map((cx) => (
          <g key={cx} transform={`translate(${cx} -4)`}>
            <path d="M0 0 C -4 -20, 4 -30, 0 -44 M0 -14 C 8 -20, 14 -22, 18 -30 M0 -24 C -8 -28, -12 -32, -16 -40" stroke={VERDE} strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
    </g>
  );
};

/** Mujer serpiente (Delfine, Equidna): torso de mujer y cola enroscada. */
export const MujerSerpiente: React.FC<Pose & { id: string; f: number; brazo?: [number, number]; brazoAtras?: [number, number]; cabeza?: number; ojosCerrados?: boolean; boca?: boolean; contorno?: boolean; tocado?: PersonajeProps['tocado']; cola?: string; alza?: number; opacity?: number }> = ({ id, f, brazo, brazoAtras, cabeza, ojosCerrados, boca, contorno, tocado = 'diadema', cola = C.negro, alza = 1, opacity = 1, ...p }) => {
  const s = p.s ?? 1, y0 = p.y ?? SUELO;
  const y = y0 - 60 * s * alza; // el torso se eleva sobre los anillos
  const ond = (i: number) => Math.sin(f * 0.1 + i * 1.1) * (3 + i * 1.6);
  const pts: P[] = ([[0, -196], [6, -140], [-12, -90], [8, -40], [70, -6], [150, 0], [215, -20], [240, -64], [222, -104]] as P[]).map(([a, b], i) => [a + ond(i) * 0.5, Math.min(60 * alza - 6, b + 60 * alza * Math.min(1, i / 3) + (i > 3 ? ond(i) : 0))] as P);
  const atras: P[] = [[-10, 60 * alza - 40], [-80, 60 * alza - 8], [-150, 60 * alza - 12], [-200, 60 * alza - 40]];
  return (
    <g opacity={opacity}>
      <Marco x={p.x} y={y} s={s} voltear={p.voltear} girar={false}>
        <Serpiente pts={atras} ancho={34} f={f} k={2} color={cola} claro={contorno} cabeza={false} />
      </Marco>
      <defs>
        <clipPath id={`ms-${id}`}>
          <rect x={p.x - 3000} y={-6000} width={6000} height={y - 200 * s + 6000} />
        </clipPath>
      </defs>
      <g clipPath={`url(#ms-${id})`}>
        <Personaje x={p.x} y={y} s={s} voltear={p.voltear} mujer ropa="larga" tocado={tocado} brazo={brazo} brazoAtras={brazoAtras} cabeza={cabeza} ojosCerrados={ojosCerrados} boca={boca} contorno={contorno} inclinar={p.inclinar} />
      </g>
      <Marco x={p.x} y={y} s={s} voltear={p.voltear} girar={false}>
        <Serpiente pts={pts} ancho={46} f={f} k={id.length} color={cola} claro={contorno} cabeza={false} />
        <path d={suave([[-30, -214], [26, -216], [30, -190], [-26, -188]], true)} fill={cola} stroke={contorno ? C.crema : 'none'} strokeWidth={2} />
        <Borde d="M-28 -208 L 28 -210" w={8} />
        {/* punta de la cola con cascabel de escamas */}
        <path d={suave([lerp(pts[7], pts[8], 0.5), pts[8], [pts[8][0] - 14, pts[8][1] - 26]])} stroke={cola} strokeWidth={10} fill="none" strokeLinecap="round" />
      </Marco>
    </g>
  );
};

/** Egipán: medio hombre, medio cabra (cuernos, patas de cabra y colita). */
export const Egipan: React.FC<Pose & { id: string; f: number; accion?: 'parado' | 'caminar' | 'correr'; brazo?: [number, number]; brazoAtras?: [number, number]; cabeza?: number; contorno?: boolean; boca?: boolean }> = ({ id, f, accion = 'parado', brazo, brazoAtras, cabeza = 0, contorno, boca, ...p }) => {
  const s = p.s ?? 1, y = p.y ?? SUELO;
  const fase = f * (accion === 'correr' ? 0.34 : accion === 'caminar' ? 0.2 : 0);
  const amp = accion === 'correr' ? 30 : accion === 'caminar' ? 18 : 0;
  const pata = (k: number, adelante: boolean) => {
    const a = amp * Math.sin(fase + k);
    const hip: P = [adelante ? 4 : -6, -166];
    const rod = desde(hip, 26 + a, 60), hock = desde(rod, -40 + a, 62), casco = desde(hock, 8 + a * 0.5, 50);
    return { d: miembro([hip, lerp(hip, rod, 0.5), rod, hock, casco], [40, 30, 20, 12, 10]), casco, rod, hock };
  };
  const pA = pata(Math.PI, false), pD = pata(0, true);
  const lin = contorno ? C.crema : 'none';
  const bote = accion === 'parado' ? 0 : -Math.abs(Math.cos(fase)) * 5;
  return (
    <g>
      <Marco x={p.x} y={y + bote * s} s={s} voltear={p.voltear} girar={false}>
        <path d={pA.d} fill={C.negro} stroke={lin} strokeWidth={2} />
        <path d={`M${pA.casco[0] - 8} ${pA.casco[1] - 4} l 18 -2 l 2 10 l -20 0 Z`} fill={C.negro} stroke={lin} strokeWidth={2} />
        <path d={suave([[-30, -176], [-52, -186], [-60, -170], [-44, -172]], true)} fill={C.negro} stroke={lin} strokeWidth={2} />
      </Marco>
      <defs>
        <clipPath id={`eg-${id}`}>
          <rect x={p.x - 3000} y={-6000} width={6000} height={y + bote * s - 150 * s + 6000} />
        </clipPath>
      </defs>
      <g clipPath={`url(#eg-${id})`}>
        <Personaje x={p.x} y={y + bote * s} s={s} voltear={p.voltear} ropa="corta" tocado={null} barba brazo={brazo} brazoAtras={brazoAtras} cabeza={cabeza} contorno={contorno} boca={boca} accion="parado" />
      </g>
      <Marco x={p.x} y={y + bote * s} s={s} voltear={p.voltear} girar={false}>
        <path d={pD.d} fill={C.negro} stroke={lin} strokeWidth={2} />
        {[0.2, 0.45, 0.7].map((t, i) => <Inc key={i} d={`M${lerp(pD.rod, pD.hock, t)[0] - 6} ${lerp(pD.rod, pD.hock, t)[1]} l 10 4`} w={1.5} />)}
        <path d={`M${pD.casco[0] - 8} ${pD.casco[1] - 4} l 18 -2 l 2 10 l -20 0 Z`} fill={C.negro} stroke={lin} strokeWidth={2} />
        <Inc d={`M${pD.casco[0] + 2} ${pD.casco[1] - 4} v 8`} w={1.5} />
        {/* cuernos */}
        <g transform={`translate(20 -334) rotate(${-6 - cabeza})`}>
          <path d="M-6 -30 C -18 -70, -60 -78, -72 -46 C -60 -62, -34 -58, -20 -26 Z" fill={C.negro} stroke={C.crema} strokeWidth={1.6} />
          {[0, 1, 2].map((i) => <Inc key={i} d={`M${-24 - i * 14} ${-52 - (i === 1 ? 6 : 0)} l 4 10`} w={1.4} />)}
          <path d="M-24 -10 l -16 -18 l 20 6 Z" fill={C.negro} stroke={C.crema} strokeWidth={1.2} />
        </g>
      </Marco>
    </g>
  );
};

// ---------------------------------------------------------------- animales
/** Pata de cuadrúpedo con dos tramos; fase anima el paso. */
function pata(o: P, fase: number, l: number, w: number, amp: number, trasera: boolean): string {
  const a = amp * Math.sin(fase);
  const k = desde(o, a, l * 0.5);
  const flex = (trasera ? -1 : 1) * (8 + amp * 0.9 * Math.max(0, Math.sin(fase + 1.9)));
  const t = desde(k, a - flex, l * 0.5);
  const casco = desde(t, a - flex + (trasera ? 60 : 70), w * 0.55);
  return miembro([o, lerp(o, k, 0.5), k, lerp(k, t, 0.5), t, casco], [w, w * 0.85, w * 0.55, w * 0.45, w * 0.42, w * 0.3]);
}

type Animal = { x: number; y?: number; s?: number; f: number; voltear?: boolean; opacity?: number; color?: string; anda?: boolean };

export const Leon: React.FC<Animal> = ({ x, y = SUELO, s = 1, f, anda, voltear, opacity = 1, color = C.negro }) => {
  const fa = anda ? f * 0.18 : 0, amp = anda ? 18 : 3;
  const bote = anda ? -Math.abs(Math.cos(fa)) * 3 : 0;
  const cola = Math.sin(f / 12) * 10;
  return (
    <g transform={`translate(${x} ${y + bote}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={pata([-100, -88], fa + Math.PI, 90, 30, amp, true)} fill={color} />
      <path d={pata([58, -88], fa, 90, 26, amp, false)} fill={color} />
      <path d={miembro([[-128, -112], [-160, -96 + cola * 0.3], [-185, -122 + cola], [-196, -148 + cola]], [9, 7, 5, 4])} fill={color} />
      <ellipse cx={-198} cy={-156 + cola} rx={9} ry={14} fill={C.purpura} stroke={C.negro} strokeWidth={2} />
      <path d={suave([[-134, -120], [-70, -130], [10, -128], [70, -142], [96, -112], [84, -78], [40, -70], [-40, -76], [-104, -72], [-138, -92]], true)} fill={color} />
      <path d={pata([-86, -88], fa, 90, 30, amp, true)} fill={color} />
      <path d={pata([72, -88], fa + Math.PI, 90, 26, amp, false)} fill={color} />
      <Inc d={suave([[-110, -112], [-90, -94], [-96, -74]])} />
      {[-50, -30, -10].map((xx) => <Inc key={xx} d={suave([[xx, -112], [xx + 10, -96], [xx + 4, -80]])} w={1.6} />)}
      <path d={suave([[34, -150], [70, -190], [122, -190], [152, -156], [146, -104], [106, -70], [50, -86]], true)} fill={C.purpura} stroke={C.negro} strokeWidth={3} />
      {Array.from({ length: 9 }, (_, i) => <Inc key={i} d={suave([desde([108, -134], -60 + i * 22 + 180, 22), desde([108, -134], -60 + i * 22 + 180, 50)])} c={C.negro} w={2} />)}
      <path d={suave([[98, -168], [134, -176], [160, -154], [170, -132], [156, -116], [122, -112], [100, -130]], true)} fill={color} />
      <path d="M112 -170 l 6 -16 l 10 14 Z" fill={color} />
      <path d="M134 -152 Q 142 -158 150 -152 Q 142 -148 134 -152 Z" fill={C.crema} />
      <circle cx={143} cy={-152} r={2.2} fill={C.negro} />
      <Inc d="M146 -126 q 10 4 22 -2" w={2} />
    </g>
  );
};

/** Vaca blanca (Hera) o toro negro (`toro`). */
export const Vaca: React.FC<Animal & { toro?: boolean }> = ({ x, y = SUELO, s = 1, f, anda, voltear, opacity = 1, toro, color }) => {
  const cuerpo = color ?? (toro ? C.negro : C.blanco);
  const borde = cuerpo === C.negro ? 'none' : C.negro;
  const fa = anda ? f * 0.16 : 0, amp = anda ? 16 : 2;
  const cola = Math.sin(f / 10) * 8;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={pata([-84, -96], fa + Math.PI, 96, 30, amp, true)} fill={cuerpo} stroke={borde} strokeWidth={2} />
      <path d={pata([60, -96], fa, 96, 28, amp, false)} fill={cuerpo} stroke={borde} strokeWidth={2} />
      <path d={miembro([[-116, -150], [-128, -110 + cola * 0.3], [-122 + cola, -70]], [8, 6, 5])} fill={cuerpo} stroke={borde} strokeWidth={1.5} />
      <path d={suave([[-120, -150], [-70, -166], [20, -164], [70, -172], [96, -140], [84, -96], [30, -86], [-50, -88], [-110, -92], [-126, -120]], true)} fill={cuerpo} stroke={borde} strokeWidth={2.5} />
      <path d={pata([-70, -96], fa, 96, 30, amp, true)} fill={cuerpo} stroke={borde} strokeWidth={2} />
      <path d={pata([74, -96], fa + Math.PI, 96, 28, amp, false)} fill={cuerpo} stroke={borde} strokeWidth={2} />
      {/* papada y cabeza */}
      <path d={suave([[70, -150], [96, -176], [130, -170], [150, -140], [140, -118], [118, -120], [96, -104]], true)} fill={cuerpo} stroke={borde} strokeWidth={2.5} />
      <path d="M100 -172 C 88 -200, 96 -214, 112 -218 C 104 -204, 104 -192, 112 -176 Z" fill={toro ? C.crema : C.negro} stroke={C.negro} strokeWidth={1.5} />
      <path d="M118 -174 C 124 -204, 140 -210, 152 -206 C 140 -198, 134 -188, 130 -172 Z" fill={toro ? C.crema : C.negro} stroke={C.negro} strokeWidth={1.5} />
      <path d="M124 -154 Q 130 -158 136 -154 Q 130 -151 124 -154 Z" fill={cuerpo === C.negro ? C.crema : C.negro} />
      <path d="M96 -160 l -16 -6 l 10 14 Z" fill={cuerpo} stroke={borde} strokeWidth={1.5} />
      {cuerpo !== C.negro && [[-60, -140], [-10, -120], [30, -146]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={16} ry={10} fill="none" stroke={C.negro} strokeWidth={1.4} opacity={0.5} />)}
      <Borde d={suave([[-100, -94], [-20, -88], [60, -92]])} w={6} />
      <Inc d={suave([[-96, -146], [-84, -122], [-90, -100]])} c={cuerpo === C.negro ? C.crema : C.negro} w={1.6} />
    </g>
  );
};

/** Ibis (Hermes): cuerpo blanco, cuello y pico curvos. */
export const Ibis: React.FC<Animal & { vuela?: number }> = ({ x, y = SUELO, s = 1, f, voltear, opacity = 1, vuela = 0 }) => {
  const al = Math.sin(f * 0.4) * 30 * vuela;
  const pas = Math.sin(f * 0.2) * 6 * (1 - vuela);
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {vuela < 0.5 && <path d={`M-6 -80 L ${-10 + pas} 0 M10 -80 L ${14 - pas} 0 M${-10 + pas} 0 l 16 0 M${14 - pas} 0 l 16 0`} stroke={C.negro} strokeWidth={5} strokeLinecap="round" />}
      <path d={suave([[-56, -104], [-20, -124], [30, -124], [50, -110], [30, -88], [-20, -82], [-60, -92]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={2.5} />
      <path d={suave([[-56, -102], [-80, -96], [-64, -90]], true)} fill={C.negro} />
      <path d={suave([[-30 + al * 0.2, -116], [-50, -150 - al], [-10, -128 - al * 0.6], [20, -116]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={2} />
      <path d={suave([[-50, -150 - al], [-70, -160 - al * 1.2], [-40, -140 - al]], true)} fill={C.negro} />
      <path d={miembro([[40, -116], [60, -150], [56, -176], [70, -190]], [14, 10, 9, 10])} fill={C.negro} />
      <path d="M74 -194 C 100 -192, 116 -172, 120 -146" stroke={C.negro} strokeWidth={6} fill="none" strokeLinecap="round" />
      <circle cx={70} cy={-192} r={2.4} fill={C.crema} />
      {[0, 1, 2].map((i) => <Inc key={i} d={`M${-20 + i * 16} -110 q 6 8 14 6`} c={C.negro} w={1.3} />)}
    </g>
  );
};

/** Gata sentada o caminando (Ártemis). */
export const Gata: React.FC<Animal> = ({ x, y = SUELO, s = 1, f, anda, voltear, opacity = 1, color = C.negro }) => {
  const fa = anda ? f * 0.22 : 0, amp = anda ? 18 : 1;
  const cola = Math.sin(f / 9) * 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={pata([-46, -52], fa + Math.PI, 54, 16, amp, true)} fill={color} />
      <path d={pata([36, -52], fa, 54, 14, amp, false)} fill={color} />
      <path d={suave([[-60, -60], [-78, -90], [-94, -110 + cola], [-86, -132 + cola]])} stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={suave([[-62, -66], [-20, -78], [30, -74], [56, -82], [60, -56], [20, -46], [-40, -46]], true)} fill={color} />
      <path d={pata([-34, -52], fa, 54, 16, amp, true)} fill={color} />
      <path d={pata([48, -52], fa + Math.PI, 54, 14, amp, false)} fill={color} />
      <path d={suave([[48, -84], [62, -104], [86, -104], [96, -88], [86, -72], [62, -70]], true)} fill={color} />
      <path d="M56 -98 l 2 -22 l 14 16 Z M76 -102 l 8 -20 l 8 20 Z" fill={color} />
      <path d="M78 -92 Q 84 -96 90 -92 Q 84 -89 78 -92 Z" fill={C.oro} />
      <Inc d="M90 -80 l 18 -4 M90 -78 l 18 4" w={1.2} />
      <Borde d={suave([[50, -78], [58, -68], [70, -66]])} w={5} />
      {[0, 1, 2].map((i) => <Inc key={i} d={`M${-30 + i * 18} -72 q 4 10 0 18`} w={1.3} />)}
    </g>
  );
};

/** Cabra (Dioniso). */
export const Cabra: React.FC<Animal & { cabeza?: number }> = ({ x, y = SUELO, s = 1, f, anda, voltear, opacity = 1, cabeza = 0 }) => {
  const ph = anda ? f * 0.25 : 0;
  const p2 = (bx: number, k: number) => {
    const a = anda ? Math.sin(ph + k) * 18 : 0;
    const top: P = [bx, -70], rod = desde(top, a, 36), pie = desde(rod, a * 0.4, 34);
    return <path key={bx} d={miembro([top, rod, pie], [16, 9, 6])} fill={C.negro} />;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {p2(-46, Math.PI)}{p2(36, 0)}
      <path d={suave([[-66, -100], [-30, -112], [30, -110], [58, -104], [66, -80], [50, -62], [-40, -60], [-70, -74]], true)} fill={C.negro} />
      <path d="M-66 -96 q -14 -6 -12 -22 q 8 8 14 10" fill={C.negro} />
      {p2(-36, 0)}{p2(46, Math.PI)}
      <g transform={`rotate(${cabeza} 56 -104)`}>
        <path d={suave([[48, -104], [62, -132], [80, -142], [96, -128], [100, -116], [86, -108], [66, -92]], true)} fill={C.negro} />
        <path d="M74 -140 C 60 -176, 30 -180, 20 -160 C 40 -168, 56 -160, 66 -136 Z" fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
        <path d="M90 -112 q 2 18 -8 26 q -2 -14 0 -24" fill={C.negro} />
        <circle cx={84} cy={-128} r={3.2} fill={C.crema} />
      </g>
      <Borde d={suave([[50, -102], [40, -86], [48, -68]])} w={8} />
      <Inc d={suave([[-40, -96], [0, -100], [36, -96]])} w={1.6} />
      <Inc d={suave([[-30, -80], [10, -78], [40, -82]])} w={1.6} />
    </g>
  );
};

/** Pez (Afrodita). */
export const Pez: React.FC<{ x: number; y: number; s?: number; voltear?: boolean; f: number; color?: string; opacity?: number }> = ({ x, y, s = 1, voltear, f, color = C.negro, opacity = 1 }) => {
  const cola = Math.sin(f / 4 + x) * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={suave([[-50, 0], [-10, -22], [30, -16], [52, 0], [30, 14], [-10, 18]], true)} fill={color} stroke={C.crema} strokeWidth={1.5} />
      <path d={`M-46 0 L -78 ${-22 + cola} L -70 ${2 + cola * 0.5} L -78 ${24 + cola} Z`} fill={color} />
      <path d="M-6 -18 L 6 -32 L 18 -16 Z" fill={C.purpura} />
      <Inc d="M24 -12 Q 18 0 24 12" w={1.6} />
      {[0, 1, 2].map((i) => <Inc key={i} d={`M${-26 + i * 14} -8 q 6 8 0 16`} w={1.3} />)}
      <circle cx={36} cy={-4} r={3} fill={C.crema} />
    </g>
  );
};

/** Cuervo en vuelo (Apolo). */
export const Cuervo: React.FC<{ x: number; y: number; s?: number; f: number; voltear?: boolean; opacity?: number }> = ({ x, y, s = 1, f, voltear, opacity = 1 }) => {
  const al = Math.sin(f * 0.35) * 38;
  const ala = (sg: number) => {
    const raiz: P = [0, -4], codo = desde(raiz, 180 + al * sg * 0.6 - 25, 60), punta = desde(codo, 180 + al * sg - 55, 70);
    return { d: suave([raiz, codo, punta, lerp(punta, raiz, 0.3), [20, 4]], true), codo, punta };
  };
  const A = ala(1), B = ala(-1);
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={B.d} fill={C.negro} opacity={0.85} />
      <path d="M-40 0 L -86 -16 L -80 0 L -88 14 Z" fill={C.negro} />
      <path d={suave([[-50, 2], [-10, -14], [30, -14], [52, -8], [42, 8], [0, 12], [-40, 8]], true)} fill={C.negro} />
      <path d="M50 -10 L 70 -4 L 50 2 Z" fill={C.negro} />
      <circle cx={42} cy={-8} r={2.5} fill={C.crema} />
      <path d={A.d} fill={C.negro} />
      <Borde d={suave([[4, -4], A.codo])} w={6} />
      {[0.3, 0.5, 0.7].map((t) => <Inc key={t} d={suave([lerp([0, -4], A.codo, t), lerp([20, 4], A.punta, t)])} w={1.4} />)}
    </g>
  );
};

/** Perro con `n` cabezas (Cerbero 3, Ortro 2). */
export const Perro: React.FC<Animal & { n?: number; ladra?: boolean; colaSerpiente?: boolean }> = ({ x, y = SUELO, s = 1, f, anda, voltear, opacity = 1, n = 1, ladra, color = C.negro, colaSerpiente }) => {
  const fa = anda ? f * 0.24 : 0, amp = anda ? 22 : 3;
  const cola = Math.sin(f / 7) * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={pata([-80, -84], fa + Math.PI, 86, 24, amp, true)} fill={color} />
      <path d={pata([50, -84], fa, 86, 22, amp, false)} fill={color} />
      {colaSerpiente ? (
        <Serpiente pts={[[-100, -110], [-140, -120 + cola], [-170, -150], [-160, -184 + cola]]} ancho={16} f={f} k={4} claro />
      ) : (
        <path d={miembro([[-100, -110], [-130, -130 + cola], [-150, -160 + cola]], [12, 8, 5])} fill={color} />
      )}
      <path d={suave([[-110, -110], [-60, -128], [20, -126], [62, -140], [80, -112], [64, -80], [10, -74], [-60, -76], [-108, -84]], true)} fill={color} />
      <path d={pata([-66, -84], fa, 86, 24, amp, true)} fill={color} />
      <path d={pata([64, -84], fa + Math.PI, 86, 22, amp, false)} fill={color} />
      {[-70, -40, -10].map((xx) => <Inc key={xx} d={`M${xx} -116 q 6 14 0 28`} w={1.5} />)}
      {Array.from({ length: n }, (_, i) => {
        const k = i - (n - 1) / 2, ab = ladra ? Math.max(0, Math.sin(f / 3 + i * 2)) * 10 : 0;
        return (
          <g key={i} transform={`translate(${60 + k * 10} ${-130 + k * (n > 2 ? 34 : 50)}) rotate(${-k * (n > 2 ? 24 : 34) + Math.sin(f / 11 + i) * 4})`}>
            <path d={miembro([[0, 0], [24, -26], [40, -40]], [36, 26, 22])} fill={color} stroke={C.crema} strokeWidth={1} />
            <path d={suave([[30, -56], [62, -56], [88, -44 - ab * 0.3], [86, -36], [60, -34], [84, -28 + ab], [62, -22 + ab * 0.5], [36, -24]], true)} fill={color} stroke={C.crema} strokeWidth={1.2} />
            <path d="M36 -54 l 0 -22 l 14 18 Z" fill={color} stroke={C.crema} strokeWidth={1} />
            <path d="M58 -50 Q 64 -54 70 -50 Q 64 -47 58 -50 Z" fill={C.oro} />
            {ladra && <path d="M70 -36 l 4 6 l 4 -6 l 4 6" stroke={C.blanco} strokeWidth={1.8} fill="none" />}
            <Borde d={suave([[14, -10], [26, -24], [34, -36]])} w={6} />
          </g>
        );
      })}
    </g>
  );
};

/** Hidra de Lerna: cuerpo de serpiente con muchos cuellos. */
export const Hidra: React.FC<{ x: number; y?: number; s?: number; f: number; voltear?: boolean; opacity?: number; n?: number }> = ({ x, y = SUELO, s = 1, f, voltear, opacity = 1, n = 7 }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
    <Serpiente pts={[[-40, -40], [-120, -10], [-200, -20], [-250, -60], [-230, -100]]} ancho={40} f={f} k={1} claro cabeza={false} />
    <path d={suave([[-90, -30], [-40, -120], [40, -130], [100, -60], [80, -10], [-60, -6]], true)} fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
    {[0, 1, 2].map((r) => [0, 1, 2, 3].map((i) => <path key={`${r}-${i}`} d={`M${-40 + i * 26 + (r % 2) * 13} ${-90 + r * 22} a 9 6 0 0 0 18 0`} stroke={C.crema} strokeWidth={1.4} fill="none" opacity={0.7} />))}
    {Array.from({ length: n }, (_, i) => {
      const a0 = 140 + i * (110 / (n - 1)), w = Math.sin(f / 8 + i * 1.7) * 16;
      const b: P = [10 + i * 6, -110], p1 = desde(b, a0 + w, 70), p2 = desde(p1, a0 - w * 1.4 - 20, 60), p3 = desde(p2, a0 + w + 50, 50);
      return <Serpiente key={i} pts={[b, p1, p2, p3]} ancho={24} f={f} k={i * 2} claro fuego={0.5} />;
    })}
  </g>
);

/** Quimera: león con una cabeza de cabra en el lomo y cola de serpiente; escupe fuego. */
export const Quimera: React.FC<{ x: number; y?: number; s?: number; f: number; voltear?: boolean; opacity?: number; fuego?: number }> = ({ x, y = SUELO, s = 1, f, voltear, opacity = 1, fuego = 1 }) => (
  <g opacity={opacity}>
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`}>
      <Serpiente pts={[[-128, -112], [-170, -130], [-200, -170], [-180, -210]]} ancho={18} f={f} k={6} claro />
      <g transform="translate(-30 -40) scale(0.8)">
        <path d={miembro([[0, -100], [10, -140], [28, -160]], [26, 20, 16])} fill={C.negro} stroke={C.crema} strokeWidth={1} />
        <path d={suave([[22, -170], [44, -176], [62, -160], [56, -150], [30, -150]], true)} fill={C.negro} stroke={C.crema} strokeWidth={1} />
        <path d="M30 -172 C 20 -200, -2 -204, -10 -188 C 6 -194, 18 -186, 24 -166 Z" fill={C.negro} stroke={C.crema} strokeWidth={1.4} />
        <circle cx={46} cy={-164} r={2.5} fill={C.crema} />
      </g>
    </g>
    <Leon x={x} y={y} s={s} f={f} voltear={voltear} />
    {fuego > 0 && <Llamarada x={x + (voltear ? -1 : 1) * 172 * s} y={y - 124 * s} ang={voltear ? 180 : 0} f={f} o={fuego * (0.6 + 0.4 * Math.sin(f / 6))} largo={0.8 * s} />}
  </g>
);

/** Caballo con alas (tiran del carro de Zeus). */
export const CaballoAlado: React.FC<Animal> = ({ x, y = SUELO, s = 1, f, voltear, opacity = 1, color = C.negro }) => {
  const fa = f * 0.32, amp = 34;
  const crin = (i: number) => Math.sin(f * 0.3 - i) * 5;
  const al = Math.sin(f * 0.25) * 22;
  const ala = (o: number) => suave([[-10, -168], [-60, -230 - al - o], [-130, -280 - al * 1.4 - o], [-110, -250 - al], [-150, -240 - al], [-100, -214 - al * 0.5], [-120, -196], [-40, -160]], true, 0.8);
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={ala(10)} fill={C.negro} opacity={0.8} />
      <path d={pata([-90, -110], fa + Math.PI, 112, 30, amp, true)} fill={color} />
      <path d={pata([60, -110], fa + 0.5, 112, 26, amp, false)} fill={color} />
      <path d={miembro([[-120, -160], [-150, -150 + crin(1)], [-176, -120 + crin(2)]], [16, 14, 8])} fill={color} />
      <path d={suave([[-126, -150], [-60, -170], [40, -168], [80, -190], [96, -150], [70, -116], [-40, -114], [-110, -116], [-130, -130]], true)} fill={color} />
      <path d={miembro([[60, -160], [96, -224], [120, -252]], [56, 36, 28])} fill={color} />
      <path d={suave([[108, -268], [140, -262], [176, -230], [170, -216], [140, -222], [110, -240]], true)} fill={color} />
      <path d="M116 -266 l 4 -20 l 10 18 Z" fill={color} />
      <circle cx={140} cy={-246} r={3} fill={C.crema} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${66 + i * 9} ${-196 - i * 11} l ${-18 + crin(i)} ${-6}`} stroke={C.purpura} strokeWidth={7} strokeLinecap="round" />)}
      <path d={pata([-76, -110], fa, 112, 30, amp, true)} fill={color} />
      <path d={pata([74, -110], fa + Math.PI + 0.5, 112, 26, amp, false)} fill={color} />
      <Inc d={suave([[-100, -156], [-80, -136], [-86, -116]])} />
      <Inc d={suave([[40, -164], [56, -140], [50, -118]])} />
      <Borde d={suave([[90, -210], [110, -206], [128, -222]])} w={6} />
      <path d={ala(0)} fill={color} stroke={C.crema} strokeWidth={1.5} />
      <Borde d={suave([[-14, -170], [-60, -226 - al], [-120, -270 - al * 1.3]])} w={9} />
      {[0, 1, 2].map((i) => <Inc key={i} d={suave([[-40 - i * 16, -180], [-80 - i * 14, -220 - al * 0.8 + i * 8]])} w={1.4} />)}
    </g>
  );
};

/** Carro de Zeus tirado por dos caballos alados; Zeus de pie adentro. Origen = base de la rueda. */
export const CarroAlado: React.FC<{ x: number; y: number; s?: number; f: number; brazo?: [number, number]; rayo?: boolean; voltear?: boolean; contorno?: boolean }> = ({ x, y, s = 1, f, brazo = [120, 10], rayo = true, voltear, contorno }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`}>
    <CaballoAlado x={250} y={-30} s={0.8} f={f + 7} color="#3A2A22" />
    <path d="M60 -90 L 300 -150" stroke={C.negro} strokeWidth={8} />
    <Personaje x={-10} y={-70} s={0.75} barba capa={C.purpura} objeto={rayo ? 'rayo' : null} brazo={brazo} brazoAtras={[40, 40]} contorno={contorno} />
    <path d={suave([[-70, -170], [60, -170], [80, -150], [70, -80], [-60, -70], [-80, -110]], true)} fill={C.negro} stroke={C.crema} strokeWidth={2} />
    <Borde d={suave([[-70, -150], [0, -146], [72, -150]])} w={9} />
    <path d="M-30 -140 C -10 -110, 20 -110, 40 -140" stroke={C.crema} strokeWidth={2} fill="none" />
    <g transform={`translate(0 -60) rotate(${f * 8})`}>
      <circle r={58} fill="none" stroke={C.negro} strokeWidth={12} />
      <circle r={58} fill="none" stroke={C.crema} strokeWidth={2} strokeDasharray="3 9" />
      {[0, 45, 90, 135].map((a) => <path key={a} d="M-56 0 H56" stroke={C.negro} strokeWidth={6} transform={`rotate(${a})`} />)}
      <circle r={12} fill={C.negro} stroke={C.crema} strokeWidth={2} />
    </g>
    <CaballoAlado x={210} y={-10} s={0.85} f={f} />
  </g>
);

// ---------------------------------------------------------------- lugares
/** Cueva en la ladera (origen = base, centro de la boca). */
export const Cueva: React.FC<{ x: number; y?: number; s?: number; luz?: number; color?: string }> = ({ x, y = SUELO, s = 1, luz = 0, color = C.barroOscuro }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-560 0 C -440 -200, -300 -400, -80 -440 C 100 -470, 280 -370, 380 -220 C 440 -130, 500 -60, 580 0 Z" fill={color} />
      {Array.from({ length: 5 }, (_, r) => Array.from({ length: 4 + r * 2 }, (_, i) => {
        const yy = -390 + r * 72, w = 120 + r * 92, cx = -20 - w + (i + 0.5) * ((w * 2) / (4 + r * 2));
        return <path key={`${r}-${i}`} d={`M${cx - 20} ${yy} a 20 14 0 0 1 40 0`} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.4} />;
      }))}
      <path d="M-180 0 C -180 -160, -100 -262, 0 -262 C 100 -262, 180 -160, 180 0 Z" fill="#0C0705" />
      {luz > 0 && <ellipse cx={0} cy={-100} rx={160} ry={140} fill="url(#halo)" opacity={luz * (0.8 + Math.sin(f / 8) * 0.1)} style={{ mixBlendMode: 'screen' }} />}
      {[-130, -80, -30, 30, 90, 140].map((sx, i) => <path key={sx} d={`M${sx - 10} ${-248 + Math.abs(sx) * 0.5} l 10 ${30 + (i % 2) * 18} l 10 ${-30 - (i % 2) * 18} Z`} fill={color} />)}
      <path d="M-180 0 C -180 -160, -100 -262, 0 -262 C 100 -262, 180 -160, 180 0" stroke={C.purpura} strokeWidth={8} fill="none" />
      <path d="M-180 0 C -180 -160, -100 -262, 0 -262 C 100 -262, 180 -160, 180 0" stroke={C.blanco} strokeWidth={2.5} strokeDasharray="1 9" strokeLinecap="round" fill="none" />
    </g>
  );
};

/** Grieta del Tártaro: se abre en el suelo con luz rojiza (abre 0→1). */
export const Abismo: React.FC<{ x: number; ancho?: number; abre: number; f: number }> = ({ x, ancho = 520, abre, f }) => {
  if (abre <= 0) return null;
  const w = (ancho / 2) * abre;
  const borde = (sg: number): P[] => Array.from({ length: 7 }, (_, i) => [x - w + (i / 6) * w * 2, SUELO + sg * (4 + Math.sin((i / 6) * Math.PI) * 26 * abre) + (azar(i + (sg > 0 ? 9 : 2)) - 0.5) * 8] as P);
  const arriba = borde(-1), abajo = borde(1).reverse();
  return (
    <g>
      <ellipse cx={x} cy={SUELO - 40} rx={w * 1.5} ry={200 * abre} fill="url(#halo)" opacity={0.75 + Math.sin(f / 5) * 0.12} style={{ mixBlendMode: 'screen' }} />
      <path d={suave([...arriba, ...abajo], true)} fill="#120806" stroke={LAVA} strokeWidth={6} />
      <path d={suave(arriba)} stroke={C.oro} strokeWidth={2.5} fill="none" />
      {Array.from({ length: 14 }, (_, i) => {
        const ciclo = 60 + (i % 4) * 12, edad = (f + i * 17) % ciclo, a = azar(i + 31);
        return <circle key={i} cx={x + (a - 0.5) * w * 1.6 + Math.sin(edad / 7 + i) * 10} cy={SUELO - edad * (1.6 + a)} r={Math.max(0.5, 4 - edad * 0.05)} fill={a > 0.5 ? C.oro : LAVA} opacity={1 - edad / ciclo} />;
      })}
    </g>
  );
};

/** Pirámide con hiladas (Egipto). */
export const Piramide: React.FC<{ x: number; y?: number; s?: number; color?: string; o?: number }> = ({ x, y = SUELO, s = 1, color = C.barroOscuro, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M-260 0 L 0 -300 L 260 0 Z" fill={color} />
    <path d="M0 -300 L 90 0 L 260 0 Z" fill={C.negro} opacity={0.25} />
    {Array.from({ length: 9 }, (_, i) => {
      const yy = -30 - i * 30, w = 260 * (1 - (i + 1) / 10);
      return <path key={i} d={`M${-w} ${yy} H ${w}`} stroke={C.negro} strokeWidth={2} opacity={0.35} />;
    })}
  </g>
);

/** Palmera. */
export const Palmera: React.FC<{ x: number; y?: number; s?: number; f: number; color?: string }> = ({ x, y = SUELO, s = 1, f, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 0 C -4 -100, 10 -180, 24 -260 L 36 -258 C 24 -180, 14 -100, 12 0 Z" fill={color} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-6 + i * 0.5} ${-30 - i * 28} l 18 -6`} stroke={C.crema} strokeWidth={1.6} opacity={0.6} />)}
    {Array.from({ length: 7 }, (_, i) => {
      const a = -150 + i * 50 + Math.sin(f / 15 + i) * 4;
      const r = (a * Math.PI) / 180, px = 30 + Math.cos(r) * 120, py = -262 + Math.sin(r) * 50 + 40;
      return <path key={i} d={`M30 -262 Q ${30 + Math.cos(r) * 70} ${-300 + Math.sin(r) * 30} ${px} ${py}`} stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

/** Monte Etna (volcán). Origen = base al centro. */
export const Etna: React.FC<{ x: number; y?: number; s?: number; rot?: number; f: number; humo?: number; lava?: number; color?: string; luz?: number }> = ({ x, y = SUELO, s = 1, rot = 0, f, humo = 0, lava = 0, color = PIEDRA, luz = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {luz > 0 && <circle cy={-520} r={260} fill="url(#halo)" opacity={luz * (0.7 + Math.sin(f / 4) * 0.2)} style={{ mixBlendMode: 'screen' }} />}
    {humo > 0 && <Humo x={10} y={-520} f={f} n={10} s={1.4} o={humo} viento={-0.7} />}
    <path d="M-560 0 C -400 -160, -230 -380, -90 -510 L -40 -490 L 0 -506 L 50 -488 L 90 -512 C 230 -380, 400 -160, 560 0 Z" fill={color} stroke={C.negro} strokeWidth={4} />
    <path d="M-90 -510 Q 0 -470 90 -512" stroke={LAVA} strokeWidth={10} fill="none" opacity={0.4 + lava * 0.6} />
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 3 + r * 2 }, (_, i) => {
      const yy = -440 + r * 86, ww = 110 + r * 90;
      const cx = -ww + ((i + 0.5) * (ww * 2)) / (3 + r * 2);
      return <path key={`${r}-${i}`} d={`M${cx - 22} ${yy} a 22 15 0 0 1 44 0`} stroke={C.crema} strokeWidth={2} fill="none" opacity={0.35} />;
    }))}
    <Borde d="M-420 -110 C -200 -90, 200 -90, 420 -110" w={9} />
    {lava > 0 && [[-30, -500, -120, -300, -160, -120], [40, -500, 110, -330, 200, -150], [0, -498, 10, -360, -30, -240]].map(([a, b, c, d, e, g], i) => (
      <g key={i} opacity={Math.min(1, lava * 2)}>
        <path d={suave([[a, b], [c, d], [e, g]])} stroke={LAVA} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={`${lava * 600} 900`} />
        <path d={suave([[a, b], [c, d], [e, g]])} stroke={C.oro} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={`${lava * 600} 900`} />
      </g>
    ))}
  </g>
);

/** Roca con grietas incisas (origen = centro); con `fuego`, arde. */
export const Roca: React.FC<{ x: number; y: number; s?: number; rot?: number; seed?: number; color?: string; fuego?: boolean; f?: number }> = ({ x, y, s = 1, rot = 0, seed = 1, color = C.negro, fuego, f = 0 }) => {
  const pts: P[] = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2, r = 42 + azar(i + seed * 7) * 20;
    return [Math.cos(a) * r, Math.sin(a) * r * 0.82];
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {fuego && <circle r={120} fill="url(#halo)" opacity={0.8} style={{ mixBlendMode: 'screen' }} />}
      {fuego && <g transform="translate(0 -20) rotate(70)"><Fuego f={f} s={0.75} viento={-10} /></g>}
      <g transform={`rotate(${rot})`}>
        <path d={suave(pts, true)} fill={color} stroke={C.negro} strokeWidth={2} />
        <Inc d={suave([[-22, -16], [-4, -4], [8, -18]])} w={2} />
        <Inc d={suave([[8, 10], [24, 16]])} w={1.8} />
        <Inc d={suave([[-30, 12], [-18, 22]])} w={1.6} />
      </g>
    </g>
  );
};

/** Humo en volutas que sube (origen = boca). */
export const Humo: React.FC<{ x: number; y: number; f: number; n?: number; s?: number; o?: number; viento?: number; color?: string }> = ({ x, y, f, n = 8, s = 1, o = 1, viento = 0.6, color = '#4A3228' }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const ciclo = 120, edad = (f * 1.1 + (i * ciclo) / n) % ciclo, t = edad / ciclo, a = azar(i * 5 + 1);
      const cx = x + (edad * viento + Math.sin(edad / 14 + i) * 14) * s, cy = y - edad * 2.4 * s, r = (18 + t * 70) * s * (0.8 + a * 0.4);
      return (
        <g key={i} opacity={Math.min(1, t * 5) * (1 - t)}>
          <circle cx={cx} cy={cy} r={r} fill={color} stroke={C.negro} strokeWidth={2} />
          <path d={`M${cx - r * 0.4} ${cy + r * 0.1} a ${r * 0.3} ${r * 0.3} 0 1 1 ${r * 0.35} ${r * 0.25}`} stroke={C.crema} strokeWidth={1.6} fill="none" opacity={0.6} />
        </g>
      );
    })}
  </g>
);

/** Mar con oleaje "perro corriendo" para cualquier rango de x. `nivel` = y de la superficie. */
export const Agua: React.FC<{ nivel: number; f: number; x0?: number; x1?: number; alto?: number; color?: string; o?: number; vel?: number; fondo?: number }> = ({ nivel, f, x0 = -800, x1 = 5200, alto = 30, color = MAR, o = 0.9, vel = 1.4, fondo = 1200 }) => {
  const w = 130, off = (f * vel) % w;
  let d = `M${x0 - w - off} ${nivel + alto}`;
  for (let x = x0 - w - off; x < x1 + w; x += w) {
    d += ` C ${x + w * 0.3} ${nivel + alto}, ${x + w * 0.35} ${nivel}, ${x + w * 0.6} ${nivel} C ${x + w * 0.85} ${nivel}, ${x + w * 0.85} ${nivel + alto * 0.5}, ${x + w * 0.68} ${nivel + alto * 0.5} C ${x + w * 0.6} ${nivel + alto * 0.5}, ${x + w * 0.62} ${nivel + alto * 0.8}, ${x + w} ${nivel + alto}`;
  }
  d += ` L${x1 + w} ${fondo} L${x0 - w} ${fondo} Z`;
  const n = Math.ceil((x1 - x0) / 260);
  return (
    <g opacity={o}>
      <path d={d} fill={color} stroke={C.negro} strokeWidth={4} />
      {Array.from({ length: n * 3 }, (_, i) => {
        const fila = i % 3, col = Math.floor(i / 3);
        const xx = x0 + col * 260 + fila * 90 + ((f * (0.6 + fila * 0.3)) % 260) - 130, yy = nivel + 70 + fila * 60;
        if (yy > fondo - 10) return null;
        return <path key={i} d={`M${xx} ${yy} q 20 -12 40 0 t 40 0`} stroke={C.crema} strokeWidth={2} fill="none" opacity={0.35} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- objetos y efectos
/** Arcos de sonido. */
export const Sonido: React.FC<{ x: number; y: number; f: number; o?: number; ang?: number; color?: string; s?: number }> = ({ x, y, f, o = 1, ang = 0, color = C.crema, s = 1 }) => {
  if (o <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`} opacity={o}>
      {[0, 1, 2].map((i) => {
        const t = (f / 24 + i / 3) % 1, r = 20 + t * 80;
        return <path key={i} d={`M${r * 0.5} ${-r * 0.8} Q ${r} 0 ${r * 0.5} ${r * 0.8}`} stroke={color} strokeWidth={5 - t * 3} fill="none" strokeLinecap="round" opacity={1 - t} />;
      })}
    </g>
  );
};

/** Nube de transformación (t 0→1: estalla y se disuelve). */
export const Puf: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={1 - t}>
      <circle r={80 + t * 120} fill="url(#haloBlanco)" />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2, r = 30 + t * 110;
        return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.8} r={22 + t * 16} fill={C.crema} stroke={C.negro} strokeWidth={2} />;
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + 0.3, r = 60 + t * 160;
        return <path key={i} d={`M${Math.cos(a) * r} ${Math.sin(a) * r} l 0 -10 M${Math.cos(a) * r - 5} ${Math.sin(a) * r - 5} l 10 0`} stroke={C.blanco} strokeWidth={3} />;
      })}
    </g>
  );
};

/** Tendones de Zeus: hebras claras que brillan (origen = centro). */
export const Tendones: React.FC<{ x: number; y: number; f: number; s?: number; o?: number; rot?: number }> = ({ x, y, f, s = 1, o = 1, rot = 0 }) => {
  if (o <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      <circle r={60} fill="url(#haloBlanco)" opacity={0.7 + Math.sin(f / 5) * 0.2} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={suave([[-50, -12 + i * 8], [-20, -20 + i * 8 + Math.sin(f / 6 + i) * 6], [20, -6 + i * 8 - Math.sin(f / 6 + i) * 6], [50, -14 + i * 8]])} stroke={i % 2 ? C.blanco : C.crema} strokeWidth={5} fill="none" strokeLinecap="round" />
      ))}
      <path d="M-50 -14 v 30 M50 -16 v 30" stroke={C.purpura} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

/** Bulto de piel de oso atado (donde Tifón esconde los tendones). Origen = base. */
export const Fardo: React.FC<{ x: number; y?: number; s?: number; f: number; brillo?: number; rot?: number }> = ({ x, y = SUELO, s = 1, f, brillo = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {brillo > 0 && <circle cy={-50} r={90} fill="url(#haloBlanco)" opacity={brillo * (0.6 + Math.sin(f / 6) * 0.2)} />}
    <path d={suave([[-70, 0], [-80, -50], [-50, -96], [0, -104], [52, -92], [78, -48], [70, 0]], true)} fill="#2A1C14" stroke={C.crema} strokeWidth={2} />
    {Array.from({ length: 22 }, (_, i) => {
      const px = -60 + azar(i + 4) * 120, py = -90 + azar(i + 40) * 80;
      return <Inc key={i} d={`M${px.toFixed(1)} ${py.toFixed(1)} l 6 8`} w={1.4} />;
    })}
    <path d="M-50 -96 C -70 -120, -60 -134, -40 -128 M52 -92 C 74 -110, 70 -124, 50 -122" stroke="#2A1C14" strokeWidth={14} strokeLinecap="round" fill="none" />
    <Borde d={suave([[-72, -50], [0, -40], [76, -52]])} w={8} />
  </g>
);

/** Huso de hilar que gira (origen = mano). */
export const Huso: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 V 90" stroke={C.negro} strokeWidth={5} />
    <ellipse cx={0} cy={70} rx={16} ry={6} fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
    <path d={`M${-12 * Math.cos(f / 3)} 64 L ${12 * Math.cos(f / 3)} 76`} stroke={C.crema} strokeWidth={2} />
    <ellipse cx={0} cy={20} rx={9} ry={14} fill={C.blanco} stroke={C.negro} strokeWidth={1.5} />
  </g>
);

/** Tijeras de Átropos (origen = mano). */
export const Tijeras: React.FC<{ x: number; y: number; abre?: number; s?: number }> = ({ x, y, abre = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`rotate(${-20 - abre * 14})`}><path d="M0 0 L 50 -4" stroke="#D9D3C4" strokeWidth={5} strokeLinecap="round" /><circle cx={-8} cy={2} r={7} fill="none" stroke={C.negro} strokeWidth={4} /></g>
    <g transform={`rotate(${-20 + abre * 14})`}><path d="M0 0 L 50 4" stroke="#D9D3C4" strokeWidth={5} strokeLinecap="round" /><circle cx={-8} cy={-2} r={7} fill="none" stroke={C.negro} strokeWidth={4} /></g>
  </g>
);

/** Árbol de frutos (los frutos efímeros). */
export const Frutal: React.FC<{ x: number; y?: number; s?: number; f: number; frutos?: number; color?: string; fruta?: string; brillo?: number }> = ({ x, y = SUELO, s = 1, f, frutos = 1, color = C.negro, fruta = C.purpura, brillo = 0 }) => {
  const copas: P[] = [[-120, -300], [-40, -380], [70, -360], [140, -280], [0, -280], [-70, -230], [80, -220]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-22 0 C -14 -80, -30 -140, -10 -220 L 14 -220 C 28 -140, 14 -80, 24 0 Z" fill={color} />
      <path d="M-4 -200 C -40 -240, -90 -260, -120 -300 M6 -210 C 20 -270, 50 -320, 70 -360 M0 -220 C -10 -290, -30 -340, -40 -380 M10 -190 C 60 -210, 110 -240, 140 -280" stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" />
      <Inc d="M0 -20 C 4 -80, -8 -140, 2 -200" w={1.5} />
      {copas.map(([cx, cy], c) =>
        Array.from({ length: 22 }, (_, i) => {
          const u = azar(c * 31 + i), v = azar(c * 17 + i + 100);
          const lx = cx + Math.cos(u * 6.28) * v * 72, ly = cy + Math.sin(u * 6.28) * v * 44;
          return <ellipse key={`${c}-${i}`} cx={lx} cy={ly} rx={6} ry={17} fill={i % 8 === 0 ? C.purpura : color} transform={`rotate(${u * 360 + Math.sin(f / 18 + i + c) * 7} ${lx} ${ly})`} />;
        }))}
      {frutos > 0 && copas.map(([cx, cy], c) => Array.from({ length: 3 }, (_, i) => {
        const k = c * 3 + i, u = azar(k + 7), v = azar(k + 70);
        return (
          <g key={k} transform={`translate(${cx + (u - 0.5) * 100} ${cy + (v - 0.3) * 50}) scale(${Math.min(1, frutos * 1.4 - azar(k + 3) * 0.4)})`}>
            {brillo > 0 && <circle r={26} fill="url(#halo)" opacity={brillo * (0.6 + Math.sin(f / 5 + k) * 0.3)} />}
            <circle r={12} fill={fruta} stroke={C.negro} strokeWidth={2.5} />
            <circle cx={-3} cy={-3} r={3} fill={C.blanco} opacity={0.8} />
          </g>
        );
      }))}
    </g>
  );
};

/** Un fruto suelto (en la mano). */
export const Fruto: React.FC<{ x: number; y: number; f: number; s?: number; o?: number }> = ({ x, y, f, s = 1, o = 1 }) => (
  o > 0 ? (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <circle r={30} fill="url(#halo)" opacity={0.6 + Math.sin(f / 5) * 0.3} />
      <circle r={13} fill={C.purpura} stroke={C.negro} strokeWidth={2.5} />
      <path d="M0 -12 q 4 -10 12 -10" stroke={VERDE} strokeWidth={3} fill="none" />
      <circle cx={-4} cy={-4} r={3} fill={C.blanco} opacity={0.8} />
    </g>
  ) : null
);

/** Hoz de diamante (origen = mango). */
export const Hoz: React.FC<{ x: number; y: number; rot?: number; s?: number; brillo?: number }> = ({ x, y, rot = 0, s = 1, brillo = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {brillo > 0 && <circle cy={-80} r={90} fill="url(#haloBlanco)" opacity={brillo} />}
    <path d="M0 40 L0 -60" stroke={C.negro} strokeWidth={9} strokeLinecap="round" />
    <path d="M0 -60 C 10 -150, 120 -160, 140 -80 C 110 -120, 40 -115, 6 -50 Z" fill="#DCD6C8" stroke={C.negro} strokeWidth={4} />
    <path d="M20 -90 C 50 -125, 100 -125, 124 -96" stroke={C.blanco} strokeWidth={2} fill="none" />
  </g>
);

/** Gotas de sangre que caen desde un punto. */
export const Sangre: React.FC<{ x: number; y: number; f: number; o?: number; n?: number }> = ({ x, y, f, o = 1, n = 6 }) => (
  o > 0 ? (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const ciclo = 40, edad = (f + i * 7) % ciclo, a = azar(i + 3);
        return <ellipse key={i} cx={x + (a - 0.5) * 30} cy={y + edad * edad * 0.12} rx={4} ry={7} fill={SANGRE} stroke={C.negro} strokeWidth={1} opacity={1 - edad / ciclo} />;
      })}
    </g>
  ) : null
);
