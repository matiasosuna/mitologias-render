// Piezas propias del video 06 · La Gigantomaquia (estilo vasija detallada):
// siluetas negras con `suave`/`miembro`, incisiones crema con `Inc`, púrpura y blanco añadidos con `Borde`.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, P, SUELO, suave, miembro, desde, lerp, Inc, Borde, Fuego, azar, Personaje, PersonajeProps } from '../../comun/vasija';

export const LAVA = '#F08A2C';
export const PIEDRA = '#3A1A0C';
export const TIERRA = '#4A2412';

// ---------- geometría de Personaje ----------
const rotar = (p: P, inclinar: number): P => {
  const r = (inclinar * Math.PI) / 180, dx = p[0], dy = p[1] + 176;
  return [dx * Math.cos(r) - dy * Math.sin(r), dx * Math.sin(r) + dy * Math.cos(r) - 176];
};
type Pose = { x: number; y?: number; s?: number; voltear?: boolean; inclinar?: number };
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
/** Centro de la cabeza (ojo) de un Personaje. */
export function cabezaDe(p: Pose & { gigante?: boolean }): P {
  const r = rotar([20 * (p.gigante ? 1.35 : 1) + 18, -340], p.inclinar ?? 0), s = p.s ?? 1;
  return [p.x + (p.voltear ? -1 : 1) * s * r[0], (p.y ?? SUELO) + s * r[1]];
}

/** Grupo con la misma transformación que un Personaje (para agregarle partes). */
export const Marco: React.FC<Pose & { children: React.ReactNode; opacity?: number; girar?: boolean }> = ({ x, y = SUELO, s = 1, voltear, inclinar = 0, children, opacity = 1, girar = true }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})${girar ? ` rotate(${inclinar} 0 -176)` : ''}`} opacity={opacity}>{children}</g>
);

// ---------- serpientes ----------
/** Cabeza de serpiente mirando hacia +x (origen = nuca). */
const CabezaSerpiente: React.FC<{ f: number; k: number; color: string; claro?: boolean }> = ({ f, k, color, claro }) => (
  <g>
    {Math.sin(f / 5 + k) > 0.2 && <path d="M34 2 L 50 0 L 56 -5 M50 0 L 56 5" stroke={C.purpura} strokeWidth={2.5} fill="none" strokeLinecap="round" />}
    <path d={suave([[-8, -11], [12, -13], [30, -7], [36, 2], [22, 9], [-8, 11]], true)} fill={color} stroke={claro ? C.crema : 'none'} strokeWidth={1.5} />
    <circle cx={18} cy={-4} r={3.4} fill={C.crema} />
    <circle cx={19} cy={-4} r={1.5} fill={C.negro} />
    <Inc d="M6 4 Q 18 8 32 3" w={1.3} />
  </g>
);

/** Serpiente gruesa por una lista de puntos, con banda decorada y cabeza al final. */
export const Serpiente: React.FC<{ pts: P[]; ancho?: number; f: number; k?: number; color?: string; claro?: boolean; cabeza?: boolean }> = ({ pts, ancho = 40, f, k = 0, color = C.negro, claro, cabeza = true }) => {
  const n = pts.length;
  const anchos = pts.map((_, i) => ancho * (1 - (i / (n - 1)) * 0.72));
  const e = pts[n - 1], q = pts[n - 2];
  const ang = (Math.atan2(e[1] - q[1], e[0] - q[0]) * 180) / Math.PI;
  return (
    <g>
      <path d={miembro(pts, anchos)} fill={color} stroke={claro ? C.crema : 'none'} strokeWidth={1.6} />
      <Borde d={suave(pts.slice(0, n - 1))} w={ancho * 0.22} />
      {pts.slice(1, n - 1).map((p, i) => {
        const a = pts[i], b = pts[i + 2];
        const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, w = anchos[i + 1] * 0.32;
        return <Inc key={i} d={`M${p[0] + nx * w - dx * 0.08} ${p[1] + ny * w - dy * 0.08} L${p[0] + nx * w * 0.4} ${p[1] + ny * w * 0.4} L${p[0] + nx * w + dx * 0.08} ${p[1] + ny * w + dy * 0.08}`} w={1.4} />;
      })}
      {cabeza && (
        <g transform={`translate(${e[0]} ${e[1]}) rotate(${ang}) scale(${Math.max(0.7, ancho / 40)})`}>
          <CabezaSerpiente f={f} k={k} color={color} claro={claro} />
        </g>
      )}
    </g>
  );
};

/** Colas de serpiente en lugar de piernas (coordenadas locales de un Personaje: pies en 0, cadera en -176). */
const Colas: React.FC<{ f: number; color: string; claro?: boolean; seed: number; enrosca?: number }> = ({ f, color, claro, seed, enrosca = 1 }) => {
  const ond = (i: number, k: number) => (i > 1 ? Math.sin(f * 0.11 + i * 0.9 + k + seed) * (4 + i * 2.2) * enrosca : 0);
  const atras: P[] = [[-8, -186], [-26, -130], [-16, -74], [-50, -22], [-120, -8], [-190, -24], [-226, -70], [-212, -120]];
  const adel: P[] = [[10, -186], [34, -128], [26, -66], [66, -18], [134, -6], [196, -30], [224, -80], [204, -126]];
  const mov = (pts: P[], k: number) => pts.map(([x, y], i) => [x + ond(i, k + 2) * 0.6, Math.min(-6, y + ond(i, k))] as P);
  return (
    <g>
      <Serpiente pts={mov(atras, 0)} ancho={42} f={f} k={seed} color={color} claro={claro} />
      <Serpiente pts={mov(adel, 1.7)} ancho={44} f={f} k={seed + 3} color={color} claro={claro} />
    </g>
  );
};

// ---------- Gigantes ----------
export type GiganteProps = PersonajeProps & {
  id: string;
  /** Colas de serpiente en lugar de piernas. */
  cola?: boolean;
  /** Melena salvaje extra. */
  melena?: boolean;
  /** Recorta todo lo que quede por debajo de esta altura (para que "salga" del suelo). */
  recorte?: number;
};

/** Gigante: cuerpo enorme y desnudo, barba espesa, melena, y (si `cola`) colas de serpiente. */
export const Gigante: React.FC<GiganteProps> = ({ id, cola = true, melena = true, recorte, ...p }) => {
  const f = useCurrentFrame();
  const s = p.s ?? 1, y = p.y ?? SUELO;
  const color = p.piel ?? C.negro;
  const cuerpo = (
    <g>
      {cola && (
        <defs>
          <clipPath id={`cg-${id}`}>
            <rect x={p.x - 3000} y={-4000} width={6000} height={y - 170 * s + 4000} />
          </clipPath>
        </defs>
      )}
      {melena && (
        <Marco x={p.x} y={y} s={s} voltear={p.voltear} inclinar={p.inclinar}>
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
      )}
      <g clipPath={cola ? `url(#cg-${id})` : undefined}>
        {/* cadera (la biblioteca deja un hueco entre torso y piernas en las figuras desnudas) */}
        <Marco x={p.x} y={y} s={s} voltear={p.voltear} inclinar={p.inclinar}>
          <path d={suave([[-44, -220], [44, -222], [52, -190], [34, -158], [-30, -158], [-50, -188]], true)} fill={color} stroke={p.contorno ? C.crema : 'none'} strokeWidth={3} />
          <Borde d={suave([[-42, -206], [4, -200], [46, -208]])} w={8} />
        </Marco>
        <Personaje gigante barba ropa="desnudo" tocado={null} {...p} opacity={1} />
      </g>
      {cola && (
        <Marco x={p.x} y={y} s={s} voltear={p.voltear} girar={false}>
          <Colas f={f} color={color} claro={p.contorno} seed={id.length * 3.1} />
        </Marco>
      )}
    </g>
  );
  if (recorte === undefined) return <g opacity={p.opacity ?? 1}>{cuerpo}</g>;
  return (
    <g opacity={p.opacity ?? 1}>
      <defs>
        <clipPath id={`rc-${id}`}>
          <rect x={p.x - 3000} y={-4000} width={6000} height={recorte + 4000} />
        </clipPath>
      </defs>
      <g clipPath={`url(#rc-${id})`}>{cuerpo}</g>
    </g>
  );
};

/** Gea saliendo de la tierra (sube 0→1: de oculta a la mitad del cuerpo afuera). */
export const Gea: React.FC<{ x: number; s?: number; sube: number; brazo?: [number, number]; brazoAtras?: [number, number]; voltear?: boolean; boca?: boolean; cabeza?: number; f: number; enojo?: number; id: string; contorno?: boolean }> = ({ x, s = 1.4, sube, brazo = [40, 30], brazoAtras = [-20, -30], voltear, boca, cabeza = 0, f, enojo = 0, id, contorno }) => {
  const y = SUELO + (400 - 230 * sube) * s;
  return (
    <g>
      <defs>
        <clipPath id={`gea-${id}`}>
          <rect x={x - 1500} y={-2000} width={3000} height={SUELO + 6 + 2000} />
        </clipPath>
      </defs>
      {enojo > 0 && <circle cx={x} cy={SUELO - 140 * s} r={260 * s} fill="url(#halo)" opacity={enojo} style={{ mixBlendMode: 'screen' }} />}
      <g clipPath={`url(#gea-${id})`}>
        <Personaje x={x} y={y} s={s} mujer tocado="velo" voltear={voltear} brazo={brazo} brazoAtras={brazoAtras} boca={boca} cabeza={cabeza} contorno={contorno} />
        {/* guirnalda de hojas sobre el pecho */}
        <Marco x={x} y={y} s={s} voltear={voltear}>
          <Borde d={suave([[-26, -296], [0, -268], [28, -282]])} w={7} color="#3E5A2A" />
        </Marco>
      </g>
      {/* montículo de tierra a su alrededor */}
      <g transform={`translate(${x} ${SUELO + 2}) scale(${s})`} opacity={Math.min(1, sube * 3)}>
        <path d={suave([[-150, 4], [-110, -14], [-50, -26], [10, -28], [70, -22], [140, -10], [170, 4]], true)} fill={TIERRA} stroke={C.negro} strokeWidth={3} />
        {[-100, -40, 20, 90].map((cx, i) => <Inc key={cx} d={`M${cx} -6 q 12 -14 26 -2`} w={1.6} c={i % 2 ? C.crema : C.barroClaro} />)}
        {[-130, 140].map((cx) => (
          <g key={cx} transform={`translate(${cx} -4)`}>
            <path d="M0 0 C -4 -20, 4 -30, 0 -44 M0 -14 C 8 -20, 14 -22, 18 -30 M0 -24 C -8 -28, -12 -32, -16 -40" stroke="#3E5A2A" strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
    </g>
  );
};

// ---------- Heracles ----------
/** Piel de león sobre la cabeza y la espalda de un Personaje (mismos x, y, s, voltear, inclinar). */
export const PielLeon: React.FC<Pose & { f: number }> = ({ f, ...p }) => {
  const o = Math.sin(f / 10) * 3;
  return (
    <Marco {...p}>
      <path d={suave([[-10, -362], [-50, -302], [-66, -220], [-58 + o, -150], [-32, -168], [-28, -260], [0, -330]], true)} fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
      {[0, 1, 2].map((i) => <Inc key={i} d={`M${-50 + i * 6} ${-282 + i * 30} l 10 6`} w={1.5} />)}
      <path d={miembro([[-58 + o, -156], [-62 + o, -120], [-52 + o, -96]], [14, 10, 8])} fill={C.negro} stroke={C.crema} strokeWidth={1} />
      {/* patas anudadas sobre el pecho */}
      <path d={miembro([[-6, -300], [16, -286], [30, -272]], [12, 10, 9])} fill={C.negro} stroke={C.crema} strokeWidth={1.2} />
      <path d="M26 -276 l 6 8 l 4 -8 l 4 8" stroke={C.blanco} strokeWidth={1.8} fill="none" />
      <g transform="translate(20 -334) rotate(-6)">
        <path d={suave([[-38, 16], [-36, -30], [-6, -52], [30, -48], [52, -34], [52, -22], [30, -24], [6, -30], [-16, -18], [-24, 18]], true)} fill={C.negro} stroke={C.crema} strokeWidth={2} />
        <path d="M-10 -48 l 4 -14 l 10 12 Z M14 -50 l 6 -12 l 8 14 Z" fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
        <path d="M26 -40 Q 32 -44 38 -40" stroke={C.crema} strokeWidth={2} fill="none" />
        <path d="M30 -24 l 4 6 l 4 -6 l 4 6 l 4 -6" stroke={C.blanco} strokeWidth={2} fill="none" />
        {[0, 1, 2].map((i) => <Inc key={i} d={`M${-30 + i * 6} ${-14 + i * 12} q -6 8 -2 16`} w={1.4} />)}
      </g>
    </Marco>
  );
};

/** Flecha en vuelo de a hacia b (avance t 0→1), con estela. */
export const Flecha: React.FC<{ a: P; b: P; t: number; s?: number; clavada?: boolean }> = ({ a, b, t, s = 1, clavada }) => {
  if (t <= 0 || (t >= 1 && !clavada)) return null;
  const tt = Math.min(1, t);
  const p = lerp(a, b, tt), ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return (
    <g transform={`translate(${p[0]} ${p[1]}) rotate(${ang}) scale(${s})`}>
      {tt < 1 && <path d="M-200 0 H-110" stroke={C.crema} strokeWidth={2.5} strokeDasharray="8 10" opacity={0.75} />}
      <path d="M-90 0 H10" stroke={C.negro} strokeWidth={4.5} />
      {tt < 1 && <path d="M10 -8 L 30 0 L 10 8 Z" fill={C.negro} />}
      <path d="M-90 0 l -12 -11 M-90 0 l -12 11 M-80 0 l -12 -11 M-80 0 l -12 11" stroke={C.purpura} strokeWidth={4} />
    </g>
  );
};

// ---------- rocas, fuego, humo ----------
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

/** Gotas que caen de a a b (sangre de Urano). */
export const Gota: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = C.purpura }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -26 C 6 -12, 14 0, 14 8 C 14 18, -14 18, -14 8 C -14 0, -6 -12, 0 -26 Z" fill={color} stroke={C.negro} strokeWidth={2} />
    <path d="M-5 4 q 0 6 4 8" stroke={C.blanco} strokeWidth={2} fill="none" />
  </g>
);

/** Grieta en el suelo con brasa adentro (abre 0→1). */
export const Grieta: React.FC<{ x: number; ancho?: number; abre: number; f: number; seed?: number }> = ({ x, ancho = 260, abre, f, seed = 1 }) => {
  if (abre <= 0) return null;
  const pts: P[] = Array.from({ length: 9 }, (_, i) => [x - ancho / 2 + (i / 8) * ancho * abre, SUELO + 6 + (azar(i + seed) - 0.5) * 18]);
  const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
  return (
    <g>
      <ellipse cx={x - ancho / 2 + (ancho * abre) / 2} cy={SUELO} rx={(ancho * abre) / 1.6} ry={70} fill="url(#halo)" opacity={0.6 + Math.sin(f / 5 + seed) * 0.15} style={{ mixBlendMode: 'screen' }} />
      <path d={d} stroke={LAVA} strokeWidth={9} fill="none" strokeLinejoin="round" />
      <path d={d} stroke={C.oro} strokeWidth={3} fill="none" strokeLinejoin="round" />
    </g>
  );
};

/** Chorro de metal fundido de a hacia b. */
export const Chorro: React.FC<{ a: P; b: P; f: number; o?: number }> = ({ a, b, f, o = 1 }) => {
  if (o <= 0) return null;
  const m: P = [(a[0] + b[0]) / 2 + 40, Math.min(a[1], b[1]) - 30];
  const d = suave([a, m, b]);
  return (
    <g opacity={o}>
      <path d={d} stroke="url(#halo)" strokeWidth={60} fill="none" opacity={0.5} />
      <path d={d} stroke={LAVA} strokeWidth={18} fill="none" strokeLinecap="round" />
      <path d={d} stroke={C.oro} strokeWidth={7} fill="none" strokeDasharray="30 14" strokeDashoffset={-f * 6} strokeLinecap="round" />
      <circle cx={b[0]} cy={b[1]} r={110} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} />
    </g>
  );
};

/** Crisol de bronce con mango (origen = mango, en la mano). */
export const Crisol: React.FC<{ x: number; y: number; rot?: number; f: number; s?: number }> = ({ x, y, rot = 0, f, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 0 L 70 -6" stroke={C.negro} strokeWidth={9} strokeLinecap="round" />
    <path d={suave([[56, -28], [120, -30], [116, 14], [88, 30], [64, 14]], true)} fill={C.negro} stroke={C.crema} strokeWidth={2} />
    <Borde d={suave([[60, -22], [88, -22], [116, -24]])} w={7} />
    <ellipse cx={88} cy={-30} rx={32} ry={7} fill={LAVA} stroke={C.negro} strokeWidth={2} />
    <ellipse cx={88} cy={-30} rx={16} ry={3} fill={C.oro} opacity={0.6 + Math.sin(f / 4) * 0.3} />
  </g>
);

/** Hierba mágica con flores que brillan; `arranca` 0→1 la saca de la tierra mostrando la raíz. */
export const Hierba: React.FC<{ x: number; y?: number; s?: number; brillo?: number; arranca?: number; f: number }> = ({ x, y = SUELO, s = 1, brillo = 1, arranca = 0, f }) => (
  <g transform={`translate(${x} ${y - arranca * 120 * s}) scale(${s}) rotate(${arranca * -14})`}>
    {brillo > 0 && <circle cy={-70} r={120} fill="url(#haloBlanco)" opacity={brillo * (0.55 + Math.sin(f / 6) * 0.15)} />}
    {arranca > 0 && (
      <g opacity={Math.min(1, arranca * 3)}>
        <path d="M0 0 C -6 20, 4 36, -4 60 M0 6 C 14 20, 22 30, 30 48 M-2 10 C -18 22, -26 30, -30 44 M2 30 C 10 40, 8 50, 14 62" stroke={C.crema} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    )}
    <path d="M0 0 C -4 -40, 6 -70, 0 -110" stroke="#3E5A2A" strokeWidth={5} fill="none" />
    {[[-1, -30, -40], [1, -50, 40], [-1, -72, -50], [1, -88, 30]].map(([sg, yy, a], i) => (
      <ellipse key={i} cx={sg * 16} cy={yy} rx={6} ry={18} fill="#3E5A2A" stroke={C.negro} strokeWidth={1.5} transform={`rotate(${a} ${sg * 16} ${yy})`} />
    ))}
    {[[0, -116], [-16, -100], [16, -96]].map(([cx, cy], i) => (
      <g key={i} transform={`translate(${cx} ${cy}) rotate(${f * 0.6 + i * 30})`}>
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-7} rx={3.5} ry={7} fill={C.blanco} stroke={C.negro} strokeWidth={1} transform={`rotate(${a})`} />)}
        <circle r={3} fill={C.oro} />
      </g>
    ))}
  </g>
);

/** Trípode de Delfos con la cuba humeante (origen = base). */
export const Tripode: React.FC<{ x: number; y?: number; s?: number; f: number; humo?: number }> = ({ x, y = SUELO, s = 1, f, humo = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-60 0 L -30 -150 M60 0 L 30 -150 M0 0 L 0 -150" stroke={C.negro} strokeWidth={9} strokeLinecap="round" />
    <path d="M-66 0 h 16 M50 0 h 16 M-8 0 h 16" stroke={C.negro} strokeWidth={8} />
    <path d={suave([[-70, -160], [70, -160], [56, -120], [0, -104], [-56, -120]], true)} fill={C.negro} />
    <Borde d={suave([[-66, -150], [0, -146], [66, -150]])} w={8} />
    <circle cx={-74} cy={-176} r={16} fill="none" stroke={C.negro} strokeWidth={6} />
    <circle cx={74} cy={-176} r={16} fill="none" stroke={C.negro} strokeWidth={6} />
    {humo > 0 && (
      <g opacity={humo}>
        {Array.from({ length: 6 }, (_, i) => {
          const edad = (f + i * 24) % 144, t = edad / 144;
          return <path key={i} d={suave([[0, -160 - edad * 1.2], [30 * Math.sin(edad / 16 + i), -200 - edad * 1.6], [-20 * Math.sin(edad / 12 + i), -240 - edad * 2]])} stroke={C.crema} strokeWidth={6 - t * 4} fill="none" opacity={(1 - t) * 0.8} strokeLinecap="round" />;
        })}
      </g>
    )}
  </g>
);

/** Mojón de piedra que marca el límite de una tierra (origen = base). */
export const Mojon: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 0 L -24 -150 Q 0 -168 24 -150 L 30 0 Z" fill={C.negro} />
    <Borde d="M-26 -130 Q 0 -142 26 -130" w={7} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M-14 ${-104 + i * 20} h28`} stroke={C.crema} strokeWidth={2} strokeDasharray={i % 2 ? '4 4' : '8 3'} />)}
  </g>
);

/** Isla (origen = centro en la línea del agua). Con `raiz` dibuja la parte sumergida (al arrancarla). */
export const Isla: React.FC<{ x: number; y: number; ancho?: number; alto?: number; s?: number; rot?: number; volcan?: boolean; raiz?: boolean; f: number; humo?: number; arboles?: number; seed?: number; color?: string }> = ({ x, y, ancho = 500, alto = 220, s = 1, rot = 0, volcan, raiz, f, humo = 0, arboles = 3, seed = 1, color = C.negro }) => {
  const w = ancho / 2;
  const cima: P[] = volcan
    ? [[-w, 0], [-w * 0.7, -alto * 0.25], [-w * 0.3, -alto * 0.55], [-w * 0.1, -alto], [w * 0.1, -alto], [w * 0.35, -alto * 0.5], [w * 0.75, -alto * 0.22], [w, 0]]
    : [[-w, 0], [-w * 0.6, -alto * 0.45], [-w * 0.2, -alto * 0.8], [w * 0.15, -alto], [w * 0.5, -alto * 0.6], [w * 0.85, -alto * 0.2], [w, 0]];
  const fondo: P[] = raiz ? [[w * 0.8, alto * 0.4], [w * 0.3, alto * 0.9], [-w * 0.2, alto * 0.75], [-w * 0.7, alto * 0.35]] : [[w, 6], [-w, 6]];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {volcan && humo > 0 && <Humo x={0} y={-alto} f={f} n={9} s={1.2} o={humo} viento={-0.8} />}
      {volcan && humo > 0 && <circle cy={-alto} r={160} fill="url(#halo)" opacity={humo * (0.7 + Math.sin(f / 4) * 0.2)} style={{ mixBlendMode: 'screen' }} />}
      <path d={suave([...cima, ...fondo], true, 0.7)} fill={color} stroke={C.negro} strokeWidth={3} />
      {raiz && <path d={suave([[-w * 0.95, 4], [0, 10], [w * 0.95, 4]])} stroke={C.purpura} strokeWidth={6} fill="none" />}
      {raiz && Array.from({ length: 5 }, (_, i) => <Inc key={i} d={suave([[-w * 0.6 + i * w * 0.3, 30], [-w * 0.5 + i * w * 0.28, alto * 0.3], [-w * 0.4 + i * w * 0.24, alto * 0.5]])} w={1.6} />)}
      {Array.from({ length: 4 }, (_, r) => Array.from({ length: 2 + r }, (_, i) => {
        const yy = -alto * 0.75 + r * alto * 0.2, ww = w * (0.25 + r * 0.18);
        const cx = -ww + ((i + 0.5) * (ww * 2)) / (2 + r);
        return <path key={`${r}-${i}`} d={`M${cx - 18} ${yy} a 18 12 0 0 1 36 0`} stroke={C.crema} strokeWidth={1.8} fill="none" opacity={0.5} />;
      }))}
      {volcan && (
        <>
          <path d={`M${-w * 0.1} ${-alto} Q 0 ${-alto + 14} ${w * 0.1} ${-alto}`} stroke={LAVA} strokeWidth={8} fill="none" />
          {humo > 0.3 && <path d={suave([[w * 0.02, -alto + 6], [w * 0.08, -alto * 0.7], [w * 0.05, -alto * 0.45]])} stroke={LAVA} strokeWidth={6} fill="none" opacity={humo} strokeLinecap="round" />}
        </>
      )}
      {Array.from({ length: arboles }, (_, i) => {
        const tx = -w * 0.7 + ((i + 0.5) * w * 1.4) / arboles + (azar(i + seed) - 0.5) * 30;
        const ty = -alto * (0.18 + azar(i * 3 + seed) * 0.12);
        return (
          <g key={i} transform={`translate(${tx} ${ty})`}>
            <path d="M0 0 V -34" stroke={C.negro} strokeWidth={5} />
            <ellipse cx={0} cy={-44} rx={18} ry={14} fill={C.negro} stroke={C.crema} strokeWidth={1.2} />
          </g>
        );
      })}
    </g>
  );
};

/** Salpicadura de agua (t 0→1). */
export const Salpicadura: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={1 - t}>
      {Array.from({ length: 14 }, (_, i) => {
        const a = -170 + (i / 13) * 160, v = 260 + azar(i) * 160;
        const px = Math.cos((a * Math.PI) / 180) * v * t, py = Math.sin((a * Math.PI) / 180) * v * t + 380 * t * t;
        return <ellipse key={i} cx={px} cy={py} rx={10} ry={16} fill={C.blanco} stroke={C.negro} strokeWidth={2} transform={`rotate(${a + 90} ${px} ${py})`} />;
      })}
      <path d={`M${-200 * t - 60} 0 Q 0 ${-160 * (1 - t)} ${200 * t + 60} 0`} stroke={C.blanco} strokeWidth={8} fill="none" />
    </g>
  );
};

/** Medallón redondo (como el tondo de una copa) con una visión adentro. */
export const Tondo: React.FC<{ x: number; y: number; r?: number; o: number; id: string; fondo?: string; children: React.ReactNode }> = ({ x, y, r = 190, o, id, fondo = '#2E140C', children }) => {
  if (o <= 0) return null;
  return (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${0.85 + o * 0.15}) translate(${-x} ${-y})`}>
      <defs>
        <clipPath id={`tondo-${id}`}><circle cx={x} cy={y} r={r} /></clipPath>
      </defs>
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

/** Alas grandes en la espalda (para Tifón). Coordenadas de Personaje. */
export const AlasGrandes: React.FC<Pose & { f: number; color?: string; claro?: boolean }> = ({ f, color = C.negro, claro, ...p }) => {
  const ang = Math.sin(f / 9) * 10;
  const ala: P[] = [[-2, -298], [-60, -380], [-150, -460], [-260, -500], [-230, -450], [-280, -430], [-220, -400], [-250, -370], [-180, -350], [-200, -320], [-110, -290], [-24, -262]];
  return (
    <Marco {...p}>
      <g transform={`rotate(${ang} -6 -290)`}>
        <path d={suave(ala, true, 0.8)} fill={color} stroke={claro ? C.crema : C.negro} strokeWidth={2} />
        <Borde d={suave([[-14, -300], [-90, -390], [-180, -460]])} w={12} />
        {[0, 1, 2, 3, 4].map((i) => <Inc key={i} d={suave([[-50 - i * 20, -320 + i * 6], [-120 - i * 20, -370 + i * 14], [-200 - i * 8, -420 + i * 18]])} w={1.8} />)}
      </g>
    </Marco>
  );
};

/** Cuellos de serpiente que brotan de los hombros (Tifón). Coordenadas de Personaje. */
export const CuellosSerpiente: React.FC<Pose & { f: number; n?: number; color?: string; claro?: boolean; largo?: number }> = ({ f, n = 8, color = C.negro, claro, largo = 1, ...p }) => (
  <Marco {...p}>
    {Array.from({ length: n }, (_, i) => {
      const base: P = [-14 + (i % 3) * 8, -296];
      const a0 = -92 - i * (86 / (n - 1));
      const w = Math.sin(f / 8 + i * 1.3) * 14;
      const p1 = desde(base, a0 + w, 70 * largo), p2 = desde(p1, a0 - w * 1.5 - 25, 70 * largo), p3 = desde(p2, a0 + w + 30, 55 * largo);
      return <Serpiente key={i} pts={[base, p1, p2, p3]} ancho={22} f={f} k={i} color={color} claro={claro} />;
    })}
  </Marco>
);

/** Sacudida de cámara para temblores (desplazamiento en px). */
export const temblor = (f: number, k: number): P => (k > 0 ? [Math.sin(f * 1.9) * 9 * k, Math.cos(f * 2.3) * 5 * k] : [0, 0]);
