// Piezas propias del video 09 · El nacimiento de Atenea (estilo vasija detallada):
// siluetas negras con `suave`/`miembro`, incisiones crema con `Inc`, púrpura y blanco añadidos con `Borde`.
// Algunas vienen copiadas de los videos 02, 04, 05 y 06 (no se importan para no depender de carpetas ajenas).
import React from 'react';
import { C, P, SUELO, suave, miembro, desde, lerp, Inc, Borde, azar, Olas, Personaje, PersonajeProps } from '../../comun/vasija';

export const TIERRA = '#4A2412';
export const PIEDRA = '#3A1A0C';
export const AGUA = '#2E4A5C';
export const CIELO_NOCHE = '#232B4A';

// ---------- geometría de Personaje (copiado del 06) ----------
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
/** Centro de la cabeza (ojo) de un Personaje. */
export function cabezaDe(p: Pose & { gigante?: boolean }): P {
  const r = rotar([20 * (p.gigante ? 1.35 : 1) + 18, -340], p.inclinar ?? 0), s = p.s ?? 1;
  return [p.x + (p.voltear ? -1 : 1) * s * r[0], (p.y ?? SUELO) + s * r[1]];
}
/** Coronilla (arriba de la cabeza) de un Personaje. */
export function coronillaDe(p: Pose): P {
  const r = rotar([24, -372], p.inclinar ?? 0), s = p.s ?? 1;
  return [p.x + (p.voltear ? -1 : 1) * s * r[0], (p.y ?? SUELO) + s * r[1]];
}
/** Grupo con la misma transformación que un Personaje (para agregarle partes). */
export const Marco: React.FC<Pose & { children: React.ReactNode; opacity?: number }> = ({ x, y = SUELO, s = 1, voltear, inclinar = 0, children, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s}) rotate(${inclinar} 0 -176)`} opacity={opacity}>{children}</g>
);
/** Sacudida para temblores (desplazamiento en px). */
export const temblor = (f: number, k: number): P => (k > 0 ? [Math.sin(f * 1.9) * 9 * k, Math.cos(f * 2.3) * 5 * k] : [0, 0]);
/** Recorta todo lo que quede debajo de `corte` (personajes que salen de la tierra, del agua o de una nube). */
export const Recorte: React.FC<{ id: string; corte?: number; children: React.ReactNode }> = ({ id, corte = SUELO, children }) => (
  <g>
    <defs>
      <clipPath id={id}><rect x={-6000} y={-4000} width={14000} height={corte + 4000} /></clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>{children}</g>
  </g>
);

// ---------- agua (05 y 06) ----------
/** Agua con oleaje "perro corriendo" sobre cualquier rango de x. `nivel` = y de la superficie. */
export const Agua: React.FC<{ nivel: number; f: number; x0?: number; x1?: number; alto?: number; color?: string; o?: number; vel?: number; fondo?: number }> = ({ nivel, f, x0 = -800, x1 = 5200, alto = 30, color = AGUA, o = 0.95, vel = 1.4, fondo = 1200 }) => {
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
/** Mar de `desde` a `hasta` con las Olas de la biblioteca repetidas en tramos. */
export const Mar: React.FC<{ desde: number; hasta: number; y: number; f: number; id: string; alto?: number; color?: string }> = ({ desde: x0, hasta, y, f, id, alto = 40, color = AGUA }) => {
  const tramos = Math.ceil((hasta - x0) / 2200);
  return (
    <g>
      {Array.from({ length: tramos }, (_, i) => {
        const a = x0 + i * 2200, b = Math.min(hasta, a + 2200);
        return (
          <g key={i}>
            <defs><clipPath id={`mar-${id}-${i}`}><rect x={a} y={-2000} width={b - a + 1} height={5000} /></clipPath></defs>
            <g clipPath={`url(#mar-${id}-${i})`}><g transform={`translate(${a} 0)`}><Olas y={y} f={f} alto={alto} color={color} /></g></g>
          </g>
        );
      })}
    </g>
  );
};
/** Salpicadura de espuma (t 0→1). */
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

// ---------- animales (02) ----------
function pata(o: P, fase: number, l: number, w: number, amp: number, trasera: boolean): string {
  const a = amp * Math.sin(fase);
  const k = desde(o, a, l * 0.5);
  const flex = (trasera ? -1 : 1) * (8 + amp * 0.9 * Math.max(0, Math.sin(fase + 1.9)));
  const t = desde(k, a - flex, l * 0.5);
  const casco = desde(t, a - flex + (trasera ? 60 : 70), w * 0.55);
  return miembro([o, lerp(o, k, 0.5), k, lerp(k, t, 0.5), t, casco], [w, w * 0.85, w * 0.55, w * 0.45, w * 0.42, w * 0.3]);
}
export const Caballo: React.FC<{ x: number; y?: number; s?: number; f: number; anda?: boolean; voltear?: boolean; opacity?: number; color?: string; encabrita?: number }> = ({ x, y = SUELO, s = 1, f, anda = true, voltear, opacity = 1, color = C.negro, encabrita = 0 }) => {
  const fa = anda ? f * 0.32 : Math.sin(f / 9) * 0.3, amp = anda ? 34 : 8;
  const crin = (i: number) => Math.sin(f * 0.3 - i) * 5;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s}) rotate(${-encabrita * 22} -90 -20)`} opacity={opacity}>
      <path d={pata([-90, -110], fa + Math.PI, 112, 30, amp, true)} fill={color} />
      <path d={pata([60, -110], fa + 0.5 + encabrita * 1.2, 112, 26, amp + encabrita * 30, false)} fill={color} />
      <path d={miembro([[-120, -160], [-150, -150 + crin(1)], [-176, -120 + crin(2)]], [16, 14, 8])} fill={color} />
      <path d={suave([[-126, -150], [-60, -170], [40, -168], [80, -190], [96, -150], [70, -116], [-40, -114], [-110, -116], [-130, -130]], true)} fill={color} />
      <path d={miembro([[60, -160], [96, -224], [120, -252]], [56, 36, 28])} fill={color} />
      <path d={suave([[108, -268], [140, -262], [176, -230], [170, -216], [140, -222], [110, -240]], true)} fill={color} />
      <path d="M116 -266 l 4 -20 l 10 18 Z" fill={color} />
      <circle cx={140} cy={-246} r={3} fill={C.crema} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${66 + i * 9} ${-196 - i * 11} l ${-18 + crin(i)} ${-6}`} stroke={C.purpura} strokeWidth={7} strokeLinecap="round" />)}
      <path d={pata([-76, -110], fa, 112, 30, amp, true)} fill={color} />
      <path d={pata([74, -110], fa + Math.PI + 0.5 - encabrita * 1.4, 112, 26, amp + encabrita * 30, false)} fill={color} />
      <Inc d={suave([[-100, -156], [-80, -136], [-86, -116]])} />
      <Inc d={suave([[40, -164], [56, -140], [50, -118]])} />
      <Borde d={suave([[90, -210], [110, -206], [128, -222]])} w={6} />
    </g>
  );
};
export const Leon: React.FC<{ x: number; y?: number; s?: number; f: number; anda?: boolean; voltear?: boolean; opacity?: number; piel?: string; melena?: boolean }> = ({ x, y = SUELO, s = 1, f, anda, voltear, opacity = 1, piel = C.blanco, melena = false }) => {
  const fa = anda ? f * 0.18 : 0, amp = anda ? 18 : 3;
  const cola = Math.sin(f / 12) * 10;
  const st = piel === C.negro ? 'none' : C.negro;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={pata([-100, -88], fa + Math.PI, 90, 30, amp, true)} fill={piel} stroke={st} strokeWidth={2} />
      <path d={pata([58, -88], fa, 90, 26, amp, false)} fill={piel} stroke={st} strokeWidth={2} />
      <path d={miembro([[-128, -112], [-160, -96 + cola * 0.3], [-185, -122 + cola], [-196, -148 + cola]], [9, 7, 5, 4])} fill={piel} stroke={st} strokeWidth={2} />
      <path d={suave([[-134, -120], [-70, -130], [10, -128], [70, -142], [96, -112], [84, -78], [40, -70], [-40, -76], [-104, -72], [-138, -92]], true)} fill={piel} stroke={st} strokeWidth={2} />
      <path d={pata([-86, -88], fa, 90, 30, amp, true)} fill={piel} stroke={st} strokeWidth={2} />
      <path d={pata([72, -88], fa + Math.PI, 90, 26, amp, false)} fill={piel} stroke={st} strokeWidth={2} />
      {melena ? <path d={suave([[34, -150], [70, -190], [122, -190], [152, -156], [146, -104], [106, -70], [50, -86]], true)} fill={C.purpura} stroke={C.negro} strokeWidth={3} />
        : <path d={miembro([[40, -128], [80, -150], [104, -150]], [44, 34, 28])} fill={piel} stroke={st} strokeWidth={2} />}
      <Borde d={suave([[52, -146], [74, -120], [92, -104]])} w={6} />
      <path d={suave([[98, -168], [134, -176], [160, -154], [170, -132], [156, -116], [122, -112], [100, -130]], true)} fill={piel} stroke={st} strokeWidth={2} />
      <path d="M134 -152 Q 142 -158 150 -152 Q 142 -148 134 -152 Z" fill={C.crema} stroke={C.negro} strokeWidth={1} />
      <circle cx={143} cy={-152} r={2.2} fill={C.negro} />
      <Inc d="M146 -126 q 10 4 22 -2" w={2} c={C.negro} />
    </g>
  );
};

/** Búho de Atenea: posado (parpadea) o volando (alas que baten). Origen = patas. */
export const Buho: React.FC<{ x: number; y: number; s?: number; f: number; vuela?: boolean; voltear?: boolean; o?: number }> = ({ x, y, s = 1, f, vuela, voltear, o = 1 }) => {
  const bate = Math.sin(f * 0.5);
  const parpadeo = Math.floor(f / 4) % 23 === 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={o}>
      {vuela && (
        <>
          <path d={suave([[-8, -50], [-50, -70 - 50 * bate], [-110, -60 - 70 * bate], [-80, -40 - 20 * bate], [-20, -30]], true)} fill={C.negro} stroke={C.crema} strokeWidth={1.2} />
          <path d={suave([[8, -50], [50, -70 - 50 * bate], [110, -60 - 70 * bate], [80, -40 - 20 * bate], [20, -30]], true)} fill={C.negro} stroke={C.crema} strokeWidth={1.2} opacity={0.85} />
        </>
      )}
      <path d={suave([[-24, -10], [-30, -50], [-22, -76], [0, -84], [22, -76], [30, -50], [24, -10], [0, 0]], true)} fill={C.negro} />
      {/* plumas del pecho */}
      {[0, 1, 2].map((r) => [0, 1, 2].map((i) => <path key={`${r}${i}`} d={`M${-12 + i * 10 + (r % 2) * 5} ${-46 + r * 11} q 4 5 8 0`} stroke={C.crema} strokeWidth={1.4} fill="none" />))}
      {!vuela && <path d={suave([[-26, -56], [-34, -30], [-24, -6], [-14, -30]], true)} fill={C.negro} stroke={C.crema} strokeWidth={1.2} />}
      {/* cabeza y orejas */}
      <path d={suave([[-26, -80], [-20, -104], [0, -110], [20, -104], [26, -80], [0, -72]], true)} fill={C.negro} />
      <path d="M-22 -100 l -6 -16 l 14 8 Z M22 -100 l 6 -16 l -14 8 Z" fill={C.negro} />
      {parpadeo ? <Inc d="M-16 -90 h10 M6 -90 h10" w={2} /> : (
        <>
          <circle cx={-10} cy={-90} r={8} fill={C.oro} stroke={C.negro} strokeWidth={1.5} />
          <circle cx={10} cy={-90} r={8} fill={C.oro} stroke={C.negro} strokeWidth={1.5} />
          <circle cx={-9} cy={-90} r={3.6} fill={C.negro} />
          <circle cx={11} cy={-90} r={3.6} fill={C.negro} />
        </>
      )}
      <path d="M-3 -84 L 0 -76 L 3 -84 Z" fill={C.crema} />
      <path d="M-10 0 l -4 6 M-6 0 l 0 7 M6 0 l 0 7 M10 0 l 4 6" stroke={C.negro} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

// ---------- objetos ----------
/** Hacha de doble filo (labrys). `mano` = donde se agarra; `ang` dirección del mango hacia la hoja (0 = abajo, 180 = arriba). */
export const Hacha: React.FC<{ mano: P; ang: number; s?: number; brillo?: number; f?: number }> = ({ mano, ang, s = 1, brillo = 0, f = 0 }) => (
  <g transform={`translate(${mano[0]} ${mano[1]}) rotate(${-ang}) scale(${s})`}>
    <path d="M0 -40 L0 150" stroke={C.negro} strokeWidth={10} strokeLinecap="round" />
    <Inc d="M-2 -30 V 120" w={1.4} />
    <g transform="translate(0 140)">
      {brillo > 0 && <circle r={110} fill="url(#halo)" opacity={brillo * (0.7 + Math.sin(f / 3) * 0.2)} style={{ mixBlendMode: 'screen' }} />}
      <path d="M-6 -18 C -40 -30, -66 -46, -76 -58 C -90 -20, -90 20, -76 58 C -66 46, -40 30, -6 18 Z" fill="#D9D3C4" stroke={C.negro} strokeWidth={4} />
      <path d="M6 -18 C 40 -30, 66 -46, 76 -58 C 90 -20, 90 20, 76 58 C 66 46, 40 30, 6 18 Z" fill="#D9D3C4" stroke={C.negro} strokeWidth={4} />
      <path d="M-70 -44 C -80 -14, -80 14, -70 44 M70 -44 C 80 -14, 80 14, 70 44" stroke={C.negro} strokeWidth={2} fill="none" opacity={0.6} />
      <rect x={-12} y={-24} width={24} height={48} rx={4} fill={C.negro} />
      <Borde d="M0 -20 V 20" w={6} color={C.oro} />
    </g>
  </g>
);

/** Copa de la pócima (origen = pie). */
export const Copa: React.FC<{ x: number; y: number; s?: number; f: number; humo?: number }> = ({ x, y, s = 1, f, humo = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {humo > 0 && [0, 1, 2].map((i) => {
      const t = ((f / 40 + i / 3) % 1);
      return <path key={i} d={`M${-10 + i * 10} ${-40 - t * 60} q 10 -10 0 -20 q -10 -10 0 -20`} stroke="#6E8A4A" strokeWidth={4 - t * 3} fill="none" opacity={humo * (1 - t)} strokeLinecap="round" />;
    })}
    <path d="M-44 -44 Q 0 6 44 -44 Z" fill={C.negro} />
    <ellipse cx={0} cy={-44} rx={44} ry={7} fill="#6E8A4A" stroke={C.negro} strokeWidth={2} />
    <path d="M-4 -20 V -2 M-20 0 H20" stroke={C.negro} strokeWidth={7} strokeLinecap="round" />
    <path d="M-44 -44 q -18 4 -12 18 M44 -44 q 18 4 12 18" stroke={C.negro} strokeWidth={5} fill="none" />
    <Borde d="M-34 -30 Q 0 -10 34 -30" w={5} />
  </g>
);

/** Yunque (01). `brasa` enciende la pieza de arriba. */
export const Yunque: React.FC<{ x: number; y?: number; s?: number; brasa?: number }> = ({ x, y = SUELO, s = 1, brasa = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-40 0 L-30 -50 L-60 -60 L-110 -64 C -90 -80, -70 -90, -50 -92 L70 -92 L80 -64 L40 -56 L30 0 Z" fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
    <Inc d="M-46 -84 H66" w={2} />
    <Borde d="M-40 -6 H30" w={7} />
    {brasa > 0 && <path d="M-30 -96 h70 l -6 -10 h -58 Z" fill="#EE7A2A" opacity={brasa} />}
  </g>
);

/** Casco corintio suelto (forjado por Metis). Origen = base. */
export const CascoSuelto: React.FC<{ x: number; y: number; s?: number; brillo?: number; f?: number }> = ({ x, y, s = 1, brillo = 0, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {brillo > 0 && <circle cy={-40} r={110} fill="url(#halo)" opacity={brillo * (0.75 + Math.sin(f / 4) * 0.15)} style={{ mixBlendMode: 'screen' }} />}
    <path d="M-40 0 C -54 -70, 40 -92, 46 -20 L 46 0 L 22 0 L 22 -26 L 2 -26 L 2 4 Z" fill={C.oro} stroke={C.negro} strokeWidth={3} />
    <path d="M-30 -60 C -10 -112, 40 -108, 60 -64" stroke={C.purpura} strokeWidth={16} fill="none" strokeLinecap="round" />
    <path d="M-30 -60 C -10 -112, 40 -108, 60 -64" stroke={C.negro} strokeWidth={2} strokeDasharray="3 5" fill="none" />
    <Inc d="M-34 -30 C -10 -40, 20 -40, 44 -30" c={C.negro} w={2} />
  </g>
);

/** Rayos de dolor alrededor de un punto (k 0→1 intensidad). */
export const Dolor: React.FC<{ x: number; y: number; f: number; k: number; r?: number }> = ({ x, y, f, k, r = 70 }) => {
  if (k <= 0) return null;
  return (
    <g transform={`translate(${x} ${y})`} opacity={Math.min(1, k * 1.4)}>
      <circle r={r * 1.8} fill="url(#halo)" opacity={k * (0.5 + Math.sin(f / 2) * 0.25)} style={{ mixBlendMode: 'screen' }} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = i * 36 + Math.sin(f / 6 + i) * 6, pul = 1 + Math.sin(f / 2.2 + i * 1.7) * 0.25;
        const p0 = desde([0, 0], a, r * 0.9), p1 = desde([0, 0], a + 8, r * (1.25 * pul)), p2 = desde([0, 0], a - 6, r * (1.55 * pul)), p3 = desde([0, 0], a + 4, r * 1.9 * pul * k);
        return <path key={i} d={`M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]} L${p2[0]} ${p2[1]} L${p3[0]} ${p3[1]}`} stroke={i % 2 ? C.oro : C.blanco} strokeWidth={5} fill="none" strokeLinejoin="miter" strokeLinecap="round" />;
      })}
    </g>
  );
};

/** Arcos de sonido (gritos, palabras, susurros). */
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

/** Onda expansiva en anillos (el grito de guerra). t avanza sin parar. */
export const Onda: React.FC<{ x: number; y: number; f: number; o: number; r?: number }> = ({ x, y, f, o, r = 700 }) => {
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      {[0, 1, 2, 3].map((i) => {
        const t = (f / 30 + i / 4) % 1;
        return <circle key={i} cx={x} cy={y} r={30 + t * r} fill="none" stroke={i % 2 ? C.oro : C.crema} strokeWidth={10 - t * 8} opacity={1 - t} strokeDasharray={i % 2 ? '24 14' : undefined} />;
      })}
    </g>
  );
};

/** Balanza del bien y el mal (05). */
export const Balanza: React.FC<{ x: number; y: number; s?: number; f: number; o?: number }> = ({ x, y, s = 1, f, o = 1 }) => {
  const a = Math.sin(f / 18) * 9;
  const pl = (sx: number) => {
    const dy = sx * Math.sin((a * Math.PI) / 180) * 64;
    return (
      <g transform={`translate(${sx * 64} ${dy})`}>
        <path d="M0 0 L -22 50 M0 0 L 22 50" stroke={C.crema} strokeWidth={2} />
        <path d="M-28 50 Q 0 70 28 50 Z" fill={sx < 0 ? C.blanco : C.negro} stroke={C.crema} strokeWidth={2.5} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M0 0 V 80 M-24 80 H24" stroke={C.oro} strokeWidth={6} />
      <circle r={8} fill={C.oro} />
      <g transform={`rotate(${a})`}><path d="M-68 0 H 68" stroke={C.oro} strokeWidth={6} strokeLinecap="round" /></g>
      {pl(-1)}
      {pl(1)}
    </g>
  );
};

// ---------- lugares y plantas ----------
/** Matas de juncos y espadañas que se mecen (origen = base). */
export const Juncos: React.FC<{ x: number; y?: number; s?: number; f: number; n?: number; ancho?: number; color?: string; seed?: number }> = ({ x, y = SUELO, s = 1, f, n = 9, ancho = 160, color = C.negro, seed = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: n }, (_, i) => {
      const bx = -ancho / 2 + (i / (n - 1)) * ancho + (azar(i + seed) - 0.5) * 20;
      const h = 150 + azar(i * 3 + seed) * 120, m = Math.sin(f / 22 + i * 0.8 + seed) * 12;
      const top: P = [bx + m + (azar(i + 9) - 0.5) * 40, -h];
      const espiga = i % 3 === 0;
      return (
        <g key={i}>
          <path d={suave([[bx, 10], [bx + m * 0.3, -h * 0.5], top])} stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
          {espiga ? <ellipse cx={top[0]} cy={top[1] + 24} rx={8} ry={26} fill={color} stroke={C.crema} strokeWidth={1.2} transform={`rotate(${m * 0.6} ${top[0]} ${top[1] + 24})`} />
            : <path d={suave([[bx, -20], [bx + 30 + m, -h * 0.45], [bx + 60 + m * 1.4, -h * 0.55]])} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />}
        </g>
      );
    })}
  </g>
);

/** Palmera (orillas del lago Tritón, en Libia). */
export const Palmera: React.FC<{ x: number; y?: number; s?: number; f: number; color?: string }> = ({ x, y = SUELO, s = 1, f, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-12 0 C -6 -120, 10 -240, 30 -340 L 44 -338 C 26 -240, 12 -120, 12 0 Z" fill={color} />
    {Array.from({ length: 9 }, (_, i) => <Inc key={i} d={`M${-6 + i * 3.6} ${-30 - i * 34} q 10 -4 18 2`} w={1.4} />)}
    {Array.from({ length: 7 }, (_, i) => {
      const a = -150 + i * 50 + Math.sin(f / 20 + i) * 5, o: P = [38, -342];
      const m = desde(o, a + 90, 90), p = desde(m, a + 120, 80);
      return <path key={i} d={miembro([o, m, p], [14, 18, 3])} fill={color} />;
    })}
    <circle cx={34} cy={-332} r={9} fill={C.purpura} stroke={C.negro} strokeWidth={2} />
  </g>
);

/** Peña rocosa con meseta (la futura Acrópolis). */
export const Pena: React.FC<{ x: number; ancho?: number; alto?: number; color?: string; o?: number }> = ({ x, ancho = 900, alto = 300, color = PIEDRA, o = 1 }) => {
  const w = ancho / 2, b = SUELO + 20, top = b - alto;
  return (
    <g opacity={o}>
      <path d={`M${x - w} ${b} C ${x - w * 0.9} ${b - alto * 0.5}, ${x - w * 0.72} ${top + 20}, ${x - w * 0.6} ${top} L ${x + w * 0.62} ${top} C ${x + w * 0.74} ${top + 30}, ${x + w * 0.88} ${b - alto * 0.45}, ${x + w} ${b} Z`} fill={color} />
      <Borde d={`M${x - w * 0.6} ${top + 2} L ${x + w * 0.62} ${top + 2}`} w={7} />
      {Array.from({ length: 4 }, (_, r) => Array.from({ length: 5 + r }, (_, i) => {
        const yy = top + 50 + r * (alto / 5), ww = w * (0.6 + r * 0.1);
        const cx = x - ww + ((i + 0.5) * ww * 2) / (5 + r);
        return <path key={`${r}-${i}`} d={`M${cx - 20} ${yy} a 20 13 0 0 1 40 0`} stroke={C.crema} strokeWidth={1.8} fill="none" opacity={0.3} />;
      }))}
    </g>
  );
};

/** Casa sencilla (05). */
export const Casa: React.FC<{ x: number; y?: number; s?: number; color?: string; o?: number }> = ({ x, y = SUELO, s = 1, color = C.negro, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-80} y={-110} width={160} height={110} fill={color} />
    <path d="M-96 -110 L0 -160 L96 -110 Z" fill={color} />
    <Borde d="M-96 -112 L96 -112" w={7} />
    <path d="M-20 0 V-60 Q 0 -74 20 -60 V0 Z" fill="#2A120A" stroke={C.purpura} strokeWidth={4} />
    <Inc d="M-60 -86 h30 M30 -86 h30" w={1.6} />
  </g>
);

/** Barco con vela (04, simplificado). */
export const Barco: React.FC<{ x: number; y: number; s?: number; f: number; voltear?: boolean }> = ({ x, y, s = 1, f, voltear }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 12) * 5}) rotate(${Math.sin(f / 16) * 2.5}) scale(${voltear ? -s : s} ${s})`}>
    <path d="M-260 -60 C -250 -40, -220 -10, -180 0 L 220 0 L 300 6 L 230 -30 L 210 -44 C 230 -70, 250 -90, 260 -120 C 230 -90, 200 -66, 170 -56 L -200 -56 C -220 -70, -240 -100, -250 -130 C -260 -110, -262 -80, -260 -60 Z" fill={C.negro} />
    <Borde d="M-200 -42 L200 -42" w={8} />
    <path d="M216 -36 Q 226 -44 236 -36 Q 226 -28 216 -36 Z" fill={C.blanco} stroke={C.negro} strokeWidth={1.5} />
    <circle cx={226} cy={-36} r={3.5} fill={C.negro} />
    <path d="M0 -56 L0 -330" stroke={C.negro} strokeWidth={8} />
    <path d="M-130 -310 L130 -310" stroke={C.negro} strokeWidth={7} />
    <path d={`M-126 -306 C -120 -230, -126 -160, -120 -110 L 120 -110 C ${126 + Math.sin(f / 10) * 6} -170, ${120 + Math.sin(f / 10) * 8} -240, 126 -306 Z`} fill={C.blanco} stroke={C.negro} strokeWidth={3} />
    <path d="M-120 -170 L 120 -170 M-122 -230 L 122 -230" stroke={C.purpura} strokeWidth={6} />
  </g>
);

/** Vasija de barro (02) con su decoración. */
export const Vasija: React.FC<{ x: number; y?: number; s?: number; o?: number }> = ({ x, y = SUELO, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d={suave([[-26, 0], [-60, -50], [-56, -110], [-26, -144], [-34, -170], [34, -170], [26, -144], [56, -110], [60, -50], [26, 0]], true)} fill={C.barroClaro} stroke={C.negro} strokeWidth={4} />
    <path d="M-58 -90 H58 M-58 -70 H58" stroke={C.negro} strokeWidth={4} />
    {[-40, -20, 0, 20, 40].map((cx) => <circle key={cx} cx={cx} cy={-80} r={4} fill={C.negro} />)}
    <path d="M-56 -110 C -80 -120, -80 -150, -34 -156 M56 -110 C 80 -120, 80 -150, 34 -156" stroke={C.negro} strokeWidth={6} fill="none" />
  </g>
);

/** Telar vertical con pesas; `t` 0→1 cuánto se tejió. Origen = base. */
export const Telar: React.FC<{ x: number; y?: number; s?: number; t: number; f: number }> = ({ x, y = SUELO, s = 1, t, f }) => {
  const alto = 300, tejido = alto * 0.75 * t;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-110 0 L-96 -330 M110 0 L96 -330" stroke={C.negro} strokeWidth={12} strokeLinecap="round" />
      <path d="M-120 -320 H120" stroke={C.negro} strokeWidth={12} strokeLinecap="round" />
      <rect x={-92} y={-316} width={184} height={tejido} fill={C.purpura} stroke={C.negro} strokeWidth={2} />
      {Array.from({ length: Math.floor(tejido / 22) }, (_, i) => (
        <path key={i} d={`M-90 ${-306 + i * 22} ${Array.from({ length: 9 }, (_, j) => `l 10 ${j % 2 ? -8 : 8} l 10 ${j % 2 ? 8 : -8}`).join(' ')}`} stroke={i % 2 ? C.blanco : C.oro} strokeWidth={2.5} fill="none" />
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const hx = -84 + i * 15.3, sw = Math.sin(f / 14 + i) * 3;
        return (
          <g key={i}>
            <path d={`M${hx} ${-316 + tejido} L${hx + sw} -60`} stroke={C.crema} strokeWidth={1.4} opacity={0.8} />
            <path d={`M${hx + sw - 7} -60 h14 l -3 22 h-8 Z`} fill={C.negro} />
          </g>
        );
      })}
    </g>
  );
};

/** Gea saliendo de la tierra (06). sube 0→1. */
export const Gea: React.FC<{ x: number; s?: number; sube: number; brazo?: [number, number]; brazoAtras?: [number, number]; voltear?: boolean; boca?: boolean; cabeza?: number; id: string }> = ({ x, s = 1.4, sube, brazo = [40, 30], brazoAtras = [-20, -30], voltear, boca, cabeza = 0, id }) => {
  const y = SUELO + (400 - 230 * sube) * s;
  return (
    <g>
      <Recorte id={`gea-${id}`} corte={SUELO + 6}>
        <Personaje x={x} y={y} s={s} mujer tocado="velo" voltear={voltear} brazo={brazo} brazoAtras={brazoAtras} boca={boca} cabeza={cabeza} />
        <Marco x={x} y={y} s={s} voltear={voltear}>
          <Borde d={suave([[-26, -296], [0, -268], [28, -282]])} w={7} color="#3E5A2A" />
        </Marco>
      </Recorte>
      <g transform={`translate(${x} ${SUELO + 2}) scale(${s})`} opacity={Math.min(1, sube * 3)}>
        <path d={suave([[-150, 4], [-110, -14], [-50, -26], [10, -28], [70, -22], [140, -10], [170, 4]], true)} fill={TIERRA} stroke={C.negro} strokeWidth={3} />
        {[-100, -40, 20, 90].map((cx, i) => <Inc key={cx} d={`M${cx} -6 q 12 -14 26 -2`} w={1.6} c={i % 2 ? C.crema : C.barroClaro} />)}
        {[-130, 140].map((cx) => (
          <path key={cx} transform={`translate(${cx} -4)`} d="M0 0 C -4 -20, 4 -30, 0 -44 M0 -14 C 8 -20, 14 -22, 18 -30 M0 -24 C -8 -28, -12 -32, -16 -40" stroke="#3E5A2A" strokeWidth={4} fill="none" strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
};

/** Urano, el Cielo estrellado: figura azul noche con estrellas en el cuerpo, que asoma tras las nubes. */
export const Urano: React.FC<{ x: number; y: number; s: number; f: number; o: number; brazo?: [number, number]; boca?: boolean; voltear?: boolean; id: string; corte: number }> = ({ x, y, s, f, o, brazo = [60, 40], boca, voltear, id, corte }) => {
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      <Recorte id={`urano-${id}`} corte={corte}>
        <Personaje x={x} y={y} s={s} piel={CIELO_NOCHE} canas ropa="desnudo" tocado={null} brazo={brazo} brazoAtras={[-30, -20]} boca={boca} voltear={voltear} contorno />
        <Marco x={x} y={y} s={s} voltear={voltear}>
          {Array.from({ length: 22 }, (_, i) => {
            const px = -26 + azar(i * 5) * 56, py = -300 + azar(i * 11) * 120;
            return <circle key={i} cx={px} cy={py} r={1.5 + azar(i) * 2} fill={C.blanco} opacity={0.5 + 0.5 * Math.sin(f / 7 + i)} />;
          })}
        </Marco>
      </Recorte>
    </g>
  );
};

/** Égida: capa de escamas con serpientes en el borde y la cabeza de Gorgona, sobre el pecho de un Personaje. */
export const Egida: React.FC<Pose & { f: number; brillo?: number }> = ({ f, brillo = 0, ...p }) => (
  <Marco {...p}>
    <path d={suave([[-32, -306], [20, -310], [38, -284], [34, -246], [0, -238], [-34, -248]], true)} fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
    {Array.from({ length: 3 }, (_, r) => Array.from({ length: 5 }, (_, i) => <path key={`${r}${i}`} d={`M${-26 + i * 12 + (r % 2) * 6} ${-296 + r * 14} a 6 5 0 0 0 12 0`} stroke={C.crema} strokeWidth={1.2} fill="none" />))}
    {Array.from({ length: 7 }, (_, i) => {
      const bx = -30 + i * 10.5, by = -246 + Math.abs(i - 3) * -2, w = Math.sin(f / 5 + i) * 4;
      return <path key={i} d={`M${bx} ${by} q ${w} 8 ${-w} 14 q ${w} 4 ${w * 1.5} 8`} stroke={C.negro} strokeWidth={3.5} fill="none" strokeLinecap="round" />;
    })}
    <g transform="translate(6 -268)">
      {brillo > 0 && <circle r={30} fill="url(#halo)" opacity={brillo} style={{ mixBlendMode: 'screen' }} />}
      <circle r={11} fill={C.blanco} stroke={C.negro} strokeWidth={1.5} />
      <circle cx={-4} cy={-2} r={1.8} fill={C.negro} />
      <circle cx={4} cy={-2} r={1.8} fill={C.negro} />
      <path d="M-5 5 h10" stroke={C.negro} strokeWidth={1.6} />
      {[-1, 1].map((sg) => <path key={sg} d={`M${sg * 9} -6 q ${sg * 8} -6 ${sg * 6} -12`} stroke={C.negro} strokeWidth={1.8} fill="none" />)}
    </g>
  </Marco>
);

/** Atenea completa: mujer con casco, lanza, escudo con gorgona y égida. */
export const Atenea: React.FC<Omit<PersonajeProps, 'mujer'> & { f: number; casco?: boolean; egida?: boolean; brillo?: number }> = ({ f, casco = true, egida = true, brillo = 0, objeto = 'lanza', escudo = true, ...p }) => (
  <g>
    {brillo > 0 && <circle cx={p.x} cy={(p.y ?? SUELO) - 200 * (p.s ?? 1)} r={260 * (p.s ?? 1)} fill="url(#halo)" opacity={brillo} style={{ mixBlendMode: 'screen' }} />}
    <Personaje {...p} mujer tocado={casco ? 'casco' : 'diadema'} objeto={objeto} escudo={escudo} emblema="gorgona" />
    {egida && <Egida x={p.x} y={p.y} s={p.s} voltear={p.voltear} inclinar={p.inclinar ?? (p.accion === 'correr' ? 6 : 0)} f={f} />}
  </g>
);

/** Perfil gigante de la cabeza de Zeus (para ver lo que pasa adentro). Origen = centro; k = escala. */
export const PerfilZeus: React.FC<{ x: number; y: number; k?: number; f: number; luz?: number }> = ({ x, y, k = 7.5, f, luz = 0 }) => {
  const cabeza = suave([[-30, 2], [-22, -26], [0, -36], [20, -30], [28, -14], [30, -6], [41, 6], [32, 10], [34, 15], [31, 20], [26, 26], [8, 32], [4, 46], [-16, 46], [-24, 22]], true, 0.9);
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d={cabeza} fill="#241008" stroke={C.crema} strokeWidth={0.6} />
      {luz > 0 && <circle cx={-2} cy={6} r={24} fill="url(#halo)" opacity={luz * (0.6 + Math.sin(f / 6) * 0.15)} style={{ mixBlendMode: 'screen' }} />}
      <path d={suave([[4, 14], [26, 22], [36, 44], [30, 62], [12, 40], [0, 30]], true)} fill={C.negro} stroke={C.crema} strokeWidth={0.5} />
      {[0, 1, 2, 3].map((i) => <Inc key={i} d={suave([[8 + i * 5, 24], [16 + i * 5, 40], [22 + i * 3, 54]])} w={0.3} />)}
      <path d={suave([[-31, 4], [-26, -24], [-2, -38], [22, -32], [26, -20], [10, -22], [-8, -16], [-16, 0], [-22, 22]], true)} fill={C.negro} fillOpacity={0.3} stroke={C.crema} strokeWidth={0.5} />
      <path d="M10 -6 Q 18 -12 26 -6 Q 18 -2 10 -6 Z" fill={C.crema} />
      <circle cx={19} cy={-6} r={2.4} fill={C.negro} />
      <Inc d="M8 -14 Q 18 -20 28 -13" w={0.5} />
      <Borde d={suave([[-30, -2], [-16, -22], [8, -30], [26, -24]])} w={2.4} />
    </g>
  );
};

/** Grieta de luz que se abre en la cabeza (a = 0→1). */
export const Brecha: React.FC<{ x: number; y: number; a: number; s?: number; f: number }> = ({ x, y, a, s = 1, f }) => {
  if (a <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={90 + a * 160} fill="url(#halo)" opacity={Math.min(1, a * 1.5) * (0.85 + Math.sin(f / 2) * 0.1)} style={{ mixBlendMode: 'screen' }} />
      <circle r={40 + a * 70} fill="url(#haloBlanco)" opacity={a} />
      {Array.from({ length: 12 }, (_, i) => {
        const ang = i * 30 + f * 0.8, l = 80 + a * 200 + Math.sin(f / 3 + i) * 20;
        const p = desde([0, 0], ang, l);
        return <path key={i} d={`M0 0 L${p[0]} ${p[1]}`} stroke={i % 2 ? C.oro : C.blanco} strokeWidth={i % 2 ? 6 : 3} opacity={a * 0.8} strokeLinecap="round" />;
      })}
    </g>
  );
};

/** Lluvia de oro (gotas y destellos). */
export const LluviaOro: React.FC<{ x0: number; x1: number; y0: number; y1: number; f: number; o: number; n?: number }> = ({ x0, x1, y0, y1, f, o, n = 70 }) => {
  if (o <= 0) return null;
  const h = y1 - y0;
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + azar(i * 7) * (x1 - x0), y = y0 + ((azar(i * 3) * h + f * (9 + azar(i) * 6)) % h);
        return i % 4 ? <path key={i} d={`M${x} ${y} l -4 22`} stroke={C.oro} strokeWidth={4} strokeLinecap="round" /> : <circle key={i} cx={x} cy={y} r={4} fill={C.blanco} />;
      })}
    </g>
  );
};

/** Isla rocosa sobre el mar (06, sin volcán). */
export const Isla: React.FC<{ x: number; y: number; ancho?: number; alto?: number; s?: number; arboles?: number; seed?: number; color?: string }> = ({ x, y, ancho = 500, alto = 220, s = 1, arboles = 3, seed = 1, color = C.negro }) => {
  const w = ancho / 2;
  const cima: P[] = [[-w, 0], [-w * 0.6, -alto * 0.45], [-w * 0.2, -alto * 0.8], [w * 0.15, -alto], [w * 0.5, -alto * 0.6], [w * 0.85, -alto * 0.2], [w, 0]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={suave([...cima, [w, 6], [-w, 6]], true, 0.7)} fill={color} stroke={C.negro} strokeWidth={3} />
      {Array.from({ length: 3 }, (_, r) => Array.from({ length: 2 + r }, (_, i) => {
        const yy = -alto * 0.7 + r * alto * 0.22, ww = w * (0.25 + r * 0.2);
        const cx = -ww + ((i + 0.5) * (ww * 2)) / (2 + r);
        return <path key={`${r}-${i}`} d={`M${cx - 18} ${yy} a 18 12 0 0 1 36 0`} stroke={C.crema} strokeWidth={1.8} fill="none" opacity={0.5} />;
      }))}
      {Array.from({ length: arboles }, (_, i) => {
        const tx = -w * 0.6 + ((i + 0.5) * w * 1.2) / arboles + (azar(i + seed) - 0.5) * 30;
        const ty = -alto * (0.5 + azar(i * 3 + seed) * 0.2);
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

/** Carro del Sol (02): caja, rueda que gira y disco solar; los caballos van aparte. */
export const CarroSol: React.FC<{ x: number; y: number; f: number; s?: number; rueda?: number }> = ({ x, y, f, s = 1, rueda = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={10} cy={-150} r={220} fill="url(#halo)" opacity={0.8} style={{ mixBlendMode: 'screen' }} />
    <path d="M-80 -90 L 70 -90 L 90 -150 L -60 -150 C -90 -130, -90 -110, -80 -90 Z" fill={C.negro} />
    <Borde d="M-74 -120 L 80 -120" w={9} color={C.oro} />
    <path d="M60 -100 L 200 -120" stroke={C.negro} strokeWidth={9} />
    <g transform="translate(0 -50)">
      <circle r={50} fill="none" stroke={C.negro} strokeWidth={10} />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d="M0 0 L0 -46" stroke={C.negro} strokeWidth={5} transform={`rotate(${i * 45 + f * 6 * rueda})`} />)}
      <circle r={10} fill={C.negro} />
    </g>
    <g transform="translate(10 -230)">
      {Array.from({ length: 16 }, (_, i) => <path key={i} d="M0 -76 L8 -104 L-8 -104 Z" fill={C.oro} stroke={C.negro} strokeWidth={2} transform={`rotate(${i * 22.5 + f * 0.6})`} />)}
      <circle r={70} fill={C.oro} stroke={C.negro} strokeWidth={4} />
      <circle r={52} fill="none" stroke={C.negro} strokeWidth={2} strokeDasharray="3 7" />
    </g>
  </g>
);

/** Tridente clavado en la roca, con un manantial de agua salada que brota (o 0→1). */
export const TridenteClavado: React.FC<{ x: number; y: number; s?: number; f: number; brota?: number; brillo?: number }> = ({ x, y, s = 1, f, brota = 0, brillo = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {brillo > 0 && <circle cy={-200} r={170} fill="url(#haloBlanco)" opacity={brillo * 0.6} />}
    {brota > 0 && Array.from({ length: 16 }, (_, i) => {
      const t = ((f / 26 + i / 16) % 1), a = -60 + azar(i) * 120;
      const px = Math.sin((a * Math.PI) / 180) * 160 * t, py = -20 - 220 * t + 300 * t * t;
      return <ellipse key={i} cx={px} cy={py} rx={7} ry={12} fill={i % 3 ? AGUA : C.blanco} stroke={C.negro} strokeWidth={1.5} opacity={brota * (1 - t)} />;
    })}
    <path d="M0 20 L0 -300" stroke={C.negro} strokeWidth={12} strokeLinecap="round" />
    <path d="M-44 -360 C -46 -316, -28 -296, 0 -296 C 28 -296, 46 -316, 44 -360 M0 -376 V-296" stroke={C.negro} strokeWidth={11} fill="none" />
    <path d="M-44 -360 l-10 18 M44 -360 l10 18 M0 -376 l-9 15 M0 -376 l9 15" stroke={C.negro} strokeWidth={8} />
    <Borde d="M-30 -300 H30" w={7} />
    <path d="M-70 10 L -40 -14 L -12 4 L 14 -18 L 40 2 L 70 -8" stroke={C.crema} strokeWidth={3} fill="none" />
  </g>
);
