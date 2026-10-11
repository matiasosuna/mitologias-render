// Piezas propias del video 02 (Prometeo), en el estilo vasija: siluetas negras con curvas suaves,
// incisiones crema y púrpura/blanco añadidos. Todas miran a la derecha; origen = apoyo en el suelo.
import React from 'react';
import { C, P, suave, miembro, desde, lerp, Inc, Borde, Fuego, azar, SUELO } from '../../comun/vasija';

const HUESO = '#EFE6D2';
const CARNE = '#9E2E1F';

// ---------- utilidades ----------
/** Pata de cuadrúpedo con dos tramos; fase anima el paso. */
function pata(o: P, fase: number, l: number, w: number, amp: number, trasera: boolean): string {
  const a = amp * Math.sin(fase);
  const k = desde(o, a, l * 0.5);
  const flex = (trasera ? -1 : 1) * (8 + amp * 0.9 * Math.max(0, Math.sin(fase + 1.9)));
  const t = desde(k, a - flex, l * 0.5);
  const casco = desde(t, a - flex + (trasera ? 60 : 70), w * 0.55);
  return miembro([o, lerp(o, k, 0.5), k, lerp(k, t, 0.5), t, casco], [w, w * 0.85, w * 0.55, w * 0.45, w * 0.42, w * 0.3]);
}

/** Posición en el mundo de las manos de un Personaje parado y sin inclinar. */
export function manos(x: number, s: number, brazo: [number, number], brazoAtras: [number, number], y = SUELO, voltear = false) {
  const sg = voltear ? -1 : 1;
  const hD: P = [14, -292], cD = desde(hD, brazo[0], 66), mD = desde(cD, brazo[0] + brazo[1], 60);
  const hT: P = [-4, -292], cT = desde(hT, brazoAtras[0], 66), mT = desde(cT, brazoAtras[0] + brazoAtras[1] + 40, 60);
  const w = (p: P): P => [x + sg * p[0] * s, y + p[1] * s];
  return { del: w(mD), atr: w(mT), cabeza: w([20, -334]) };
}

// ---------- animales ----------
export const Leon: React.FC<{ x: number; y?: number; s?: number; f: number; anda?: boolean; voltear?: boolean; opacity?: number }> = ({ x, y = SUELO, s = 1, f, anda, voltear, opacity = 1 }) => {
  const fa = anda ? f * 0.18 : 0, amp = anda ? 18 : 3;
  const bote = anda ? -Math.abs(Math.cos(fa)) * 3 : 0;
  const cola = Math.sin(f / 12) * 10;
  return (
    <g transform={`translate(${x} ${y + bote}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={pata([-100, -88], fa + Math.PI, 90, 30, amp, true)} fill={C.negro} />
      <path d={pata([58, -88], fa, 90, 26, amp, false)} fill={C.negro} />
      <path d={miembro([[-128, -112], [-160, -96 + cola * 0.3], [-185, -122 + cola], [-196, -148 + cola]], [9, 7, 5, 4])} fill={C.negro} />
      <ellipse cx={-198} cy={-156 + cola} rx={9} ry={14} fill={C.purpura} stroke={C.negro} strokeWidth={2} />
      <path d={suave([[-134, -120], [-70, -130], [10, -128], [70, -142], [96, -112], [84, -78], [40, -70], [-40, -76], [-104, -72], [-138, -92]], true)} fill={C.negro} />
      <path d={pata([-86, -88], fa, 90, 30, amp, true)} fill={C.negro} />
      <path d={pata([72, -88], fa + Math.PI, 90, 26, amp, false)} fill={C.negro} />
      <Inc d={suave([[-110, -112], [-90, -94], [-96, -74]])} />
      <Inc d={suave([[-50, -112], [-40, -96], [-46, -80]])} w={1.6} />
      <Inc d={suave([[-30, -112], [-20, -96], [-26, -80]])} w={1.6} />
      <Inc d={suave([[-10, -112], [0, -96], [-6, -80]])} w={1.6} />
      {/* melena */}
      <path d={suave([[34, -150], [70, -190], [122, -190], [152, -156], [146, -104], [106, -70], [50, -86]], true)} fill={C.purpura} stroke={C.negro} strokeWidth={3} />
      {Array.from({ length: 9 }, (_, i) => {
        const a = -60 + i * 22;
        return <Inc key={i} d={suave([desde([108, -134], a + 180, 22), desde([108, -134], a + 180, 50)])} c={C.negro} w={2} />;
      })}
      {/* cabeza */}
      <path d={suave([[98, -168], [134, -176], [160, -154], [170, -132], [156, -116], [122, -112], [100, -130]], true)} fill={C.negro} />
      <path d="M112 -170 l 6 -16 l 10 14 Z" fill={C.negro} />
      <path d="M134 -152 Q 142 -158 150 -152 Q 142 -148 134 -152 Z" fill={C.crema} />
      <circle cx={143} cy={-152} r={2.2} fill={C.negro} />
      <Inc d="M146 -126 q 10 4 22 -2" w={2} />
      <Inc d="M128 -164 q 12 -6 24 0" w={1.6} />
    </g>
  );
};

export const Gacela: React.FC<{ x: number; y?: number; s?: number; f: number; corre?: boolean; voltear?: boolean; opacity?: number }> = ({ x, y = SUELO, s = 1, f, corre, voltear, opacity = 1 }) => {
  const fa = corre ? f * 0.36 : 0, amp = corre ? 38 : 2;
  const bote = corre ? -Math.abs(Math.cos(fa)) * 14 : 0;
  return (
    <g transform={`translate(${x} ${y + bote}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={pata([-62, -112], fa + Math.PI, 112, 18, amp, true)} fill={C.negro} />
      <path d={pata([40, -112], fa + 0.6, 112, 15, amp, false)} fill={C.negro} />
      <path d={suave([[-84, -150], [-30, -160], [30, -158], [62, -170], [70, -140], [46, -116], [-20, -118], [-70, -116], [-88, -130]], true)} fill={C.negro} />
      <path d="M-86 -146 l -14 -8 l 4 14 Z" fill={C.negro} />
      <path d={suave([[-60, -122], [-10, -124], [44, -124]])} stroke={C.blanco} strokeWidth={4} fill="none" />
      <path d={miembro([[52, -150], [74, -196], [90, -222]], [30, 20, 16])} fill={C.negro} />
      <path d={suave([[78, -232], [102, -236], [122, -218], [116, -210], [92, -210], [80, -216]], true)} fill={C.negro} />
      <path d={suave([[86, -232], [70, -270], [84, -300], [96, -306]])} stroke={C.negro} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={suave([[94, -232], [84, -266], [100, -292], [112, -294]])} stroke={C.negro} strokeWidth={5} fill="none" strokeLinecap="round" />
      {[0, 1, 2].map((i) => <Inc key={i} d={`M${78 + i * 3} ${-254 - i * 12} l 8 2`} w={1.5} />)}
      <path d="M80 -236 l -6 -16 l 12 10 Z" fill={C.negro} />
      <path d="M100 -226 Q 106 -230 112 -226 Q 106 -223 100 -226 Z" fill={C.crema} />
      <path d={pata([-48, -112], fa, 112, 18, amp, true)} fill={C.negro} />
      <path d={pata([54, -112], fa + Math.PI + 0.6, 112, 15, amp, false)} fill={C.negro} />
      <Inc d={suave([[-70, -150], [-56, -132], [-62, -116]])} w={1.8} />
      <Inc d={suave([[40, -160], [52, -140], [46, -122]])} w={1.8} />
    </g>
  );
};

export const Ave: React.FC<{ x: number; y: number; s?: number; f: number; voltear?: boolean; opacity?: number }> = ({ x, y, s = 1, f, voltear, opacity = 1 }) => {
  const al = Math.sin(f * 0.35) * 38;
  const ala = (sg: number) => {
    const raiz: P = [0, -4], codo = desde(raiz, 180 + al * sg * 0.6 - 25, 60), punta = desde(codo, 180 + al * sg - 55, 70);
    return suave([raiz, codo, punta, lerp(punta, raiz, 0.3), [20, 4]], true);
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={ala(-1)} fill={C.negro} opacity={0.85} />
      <path d="M-40 0 L -86 -16 L -80 0 L -88 14 Z" fill={C.negro} />
      {[-70, -60].map((xx) => <Inc key={xx} d={`M${xx} -8 L${xx} 8`} w={1.5} />)}
      <path d={suave([[-50, 2], [-10, -14], [30, -14], [52, -8], [42, 8], [0, 12], [-40, 8]], true)} fill={C.negro} />
      <path d="M50 -10 L 66 -4 L 50 0 Z" fill={C.negro} />
      <circle cx={42} cy={-8} r={2.5} fill={C.crema} />
      <path d={ala(1)} fill={C.negro} />
      <Borde d={suave([[4, -4], desde(desde([0, -4], 180 + al * 0.6 - 25, 60), 0, 4)])} w={6} />
      {[0, 1, 2].map((i) => <Inc key={i} d={suave([lerp([0, -4], desde([0, -4], 180 + al * 0.6 - 25, 60), 0.3 + i * 0.2), lerp([20, 4], desde(desde([0, -4], 180 + al * 0.6 - 25, 60), 180 + al - 55, 70), 0.3 + i * 0.2)])} w={1.4} />)}
    </g>
  );
};

export const Oso: React.FC<{ x: number; y?: number; s?: number; f: number; anda?: boolean; voltear?: boolean; opacity?: number }> = ({ x, y = SUELO, s = 1, f, anda, voltear, opacity = 1 }) => {
  const fa = anda ? f * 0.14 : 0, amp = anda ? 14 : 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={pata([-90, -80], fa + Math.PI, 82, 40, amp, true)} fill={C.negro} />
      <path d={pata([60, -80], fa, 82, 38, amp, false)} fill={C.negro} />
      <path d={suave([[-130, -100], [-90, -170], [-10, -186], [60, -160], [100, -120], [86, -70], [20, -62], [-80, -62], [-128, -76]], true)} fill={C.negro} />
      <path d={suave([[84, -150], [120, -150], [150, -128], [148, -112], [116, -104], [90, -110]], true)} fill={C.negro} />
      <circle cx={96} cy={-152} r={9} fill={C.negro} />
      <circle cx={130} cy={-130} r={2.5} fill={C.crema} />
      <path d={pata([-76, -80], fa, 82, 40, amp, true)} fill={C.negro} />
      <path d={pata([74, -80], fa + Math.PI, 82, 38, amp, false)} fill={C.negro} />
      {Array.from({ length: 26 }, (_, i) => {
        const px = -110 + azar(i + 4) * 190, py = -160 + azar(i + 40) * 80;
        return <Inc key={i} d={`M${px.toFixed(1)} ${py.toFixed(1)} l 6 8`} w={1.5} />;
      })}
      <Borde d={suave([[-120, -78], [-20, -66], [80, -74]])} w={6} />
    </g>
  );
};

export const Tortuga: React.FC<{ x: number; y?: number; s?: number; f: number; voltear?: boolean; opacity?: number }> = ({ x, y = SUELO, s = 1, f, voltear, opacity = 1 }) => {
  const cab = Math.sin(f / 15) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      {[-50, -20, 26, 52].map((px, i) => <path key={i} d={miembro([[px, -24], [px + 6, -8], [px + 12, 0]], [18, 14, 12])} fill={C.negro} />)}
      <path d={miembro([[60, -30], [86 + cab, -42], [104 + cab, -40]], [16, 14, 18])} fill={C.negro} />
      <circle cx={100 + cab} cy={-44} r={2.2} fill={C.crema} />
      <path d="M-74 -26 C -70 -100, 70 -100, 76 -26 Z" fill={C.negro} />
      <Borde d="M-74 -26 L 76 -26" w={9} />
      {[[-40, -50], [0, -70], [40, -50], [-20, -36], [20, -36]].map(([cx, cy], i) => (
        <path key={i} d={`M${cx - 14} ${cy} l 7 -12 h 14 l 7 12 l -7 12 h -14 Z`} fill="none" stroke={C.crema} strokeWidth={1.8} />
      ))}
      <path d="M-74 -30 l -12 4 l 12 4" fill={C.negro} />
    </g>
  );
};

export const Buey: React.FC<{ x: number; y?: number; s?: number; f: number; anda?: boolean; voltear?: boolean; opacity?: number }> = ({ x, y = SUELO, s = 1, f, anda, voltear, opacity = 1 }) => {
  const fa = anda ? f * 0.14 : 0, amp = anda ? 14 : 2;
  const cola = Math.sin(f / 10) * 8;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={pata([-110, -100], fa + Math.PI, 100, 34, amp, true)} fill={C.negro} />
      <path d={pata([70, -100], fa, 100, 30, amp, false)} fill={C.negro} />
      <path d={miembro([[-140, -170], [-150 + cola * 0.2, -120], [-148 + cola, -70]], [8, 6, 5])} fill={C.negro} />
      <path d="M-156 -78 l 8 26 l 8 -26 Z" fill={C.negro} transform={`translate(${cola} 0)`} />
      <path d={suave([[-150, -150], [-120, -186], [0, -190], [80, -200], [120, -170], [120, -120], [90, -96], [-20, -92], [-120, -92], [-150, -112]], true)} fill={C.negro} />
      {/* papada */}
      <path d={suave([[96, -130], [110, -90], [126, -76], [140, -110]], true)} fill={C.negro} />
      <path d={suave([[110, -190], [150, -186], [184, -150], [186, -128], [160, -120], [130, -140]], true)} fill={C.negro} />
      <path d={suave([[136, -186], [120, -224], [140, -244], [156, -238]])} stroke={C.negro} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={suave([[126, -178], [98, -200], [96, -228]])} stroke={C.negro} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.9} />
      <path d="M118 -176 l -18 -10 l 10 18 Z" fill={C.negro} />
      <path d="M150 -168 Q 158 -174 166 -168 Q 158 -164 150 -168 Z" fill={C.crema} />
      <circle cx={158} cy={-168} r={2.4} fill={C.negro} />
      <path d={pata([-96, -100], fa, 100, 34, amp, true)} fill={C.negro} />
      <path d={pata([84, -100], fa + Math.PI, 100, 30, amp, false)} fill={C.negro} />
      {/* bandas sacrificiales */}
      <Borde d={suave([[-20, -188], [-26, -140], [-20, -94]])} w={12} />
      <Borde d={suave([[40, -194], [34, -146], [40, -96]])} w={8} color={C.blanco} />
      <Inc d={suave([[-130, -170], [-106, -140], [-114, -104]])} />
      <Inc d={suave([[80, -186], [96, -150], [86, -112]])} />
      <Inc d={suave([[-80, -112], [-20, -104], [50, -110]])} w={1.6} />
    </g>
  );
};

export const Caballo: React.FC<{ x: number; y?: number; s?: number; f: number; anda?: boolean; voltear?: boolean; opacity?: number; color?: string }> = ({ x, y = SUELO, s = 1, f, anda = true, voltear, opacity = 1, color = C.negro }) => {
  const fa = anda ? f * 0.32 : Math.sin(f / 9) * 0.3, amp = anda ? 34 : 8;
  const crin = (i: number) => Math.sin(f * 0.3 - i) * 5;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
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
    </g>
  );
};

/** Águila: volando (alas que baten) o posada (alas a medio abrir). */
export const Aguila: React.FC<{ x: number; y: number; s?: number; f: number; posada?: boolean; voltear?: boolean; opacity?: number; rot?: number }> = ({ x, y, s = 1, f, posada, voltear, opacity = 1, rot = 0 }) => {
  const al = posada ? 20 + Math.sin(f * 0.25) * 12 : Math.sin(f * 0.22) * 40;
  const ala = (sg: number) => {
    const raiz: P = [-6, -10];
    const codo = desde(raiz, 180 + al * sg * 0.5 - (posada ? 70 : 30), 90);
    const punta = desde(codo, 180 + al * sg - (posada ? 110 : 60), 110);
    const plumas: P[] = Array.from({ length: 5 }, (_, i) => desde(punta, 20 + i * 18 + (posada ? 30 : 0), 30 + i * 4));
    return { d: suave([raiz, codo, punta, ...plumas, lerp(codo, [-30, 6], 0.6), [-30, 6]], true), codo, punta };
  };
  const A = ala(1), B = ala(-1);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={B.d} fill={C.negro} opacity={0.9} />
      <path d="M-60 0 L -118 -16 L -110 4 L -122 20 L -70 14 Z" fill={C.negro} />
      {[-104, -92, -80].map((xx) => <Inc key={xx} d={`M${xx} -8 L${xx + 4} 12`} w={1.4} />)}
      <path d={suave([[-70, 8], [-30, -22], [20, -26], [48, -22], [56, -4], [30, 14], [-30, 18]], true)} fill={C.negro} />
      {/* cabeza blanca añadida */}
      <path d={suave([[34, -24], [56, -34], [74, -26], [72, -12], [52, -8]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={2} />
      <path d="M70 -28 C 88 -26, 90 -14, 80 -6 L 76 -16 Z" fill={C.oro} stroke={C.negro} strokeWidth={2} />
      <circle cx={62} cy={-24} r={2.8} fill={C.negro} />
      {posada ? (
        <>
          <path d="M-10 14 L -4 40 M10 14 L 16 40" stroke={C.negro} strokeWidth={7} />
          <path d="M-14 40 l 10 0 l 6 6 M6 40 l 10 0 l 6 6" stroke={C.oro} strokeWidth={4} fill="none" />
        </>
      ) : (
        <path d="M-20 14 L -40 30 M-4 14 L -22 34" stroke={C.oro} strokeWidth={5} strokeLinecap="round" />
      )}
      <path d={A.d} fill={C.negro} />
      <Borde d={suave([[-6, -10], A.codo])} w={8} />
      {[0.25, 0.5, 0.75].map((t) => <Inc key={t} d={suave([lerp([-6, -10], A.codo, t), lerp(A.codo, A.punta, t)])} w={1.5} />)}
      {[0, 1, 2, 3].map((i) => <Inc key={i} d={suave([lerp([-30, 6], A.codo, 0.2 + i * 0.18), lerp([-30, 6], A.punta, 0.3 + i * 0.16)])} w={1.3} />)}
    </g>
  );
};

// ---------- figuras de barro ----------
/** Montículo de barro que se levanta y toma forma humana (t 0→1). */
export const Monticulo: React.FC<{ x: number; t: number; s?: number }> = ({ x, t, s = 1 }) => (
  <g transform={`translate(${x} ${SUELO}) scale(${s})`} opacity={Math.min(1, t * 4)}>
    <path d={suave([[-70, 0], [-50, -20 - t * 10], [-10, -36 - t * 26], [30, -26 - t * 10], [70, 0]], true)} fill={C.barroOscuro} stroke={C.negro} strokeWidth={3} />
    {[0, 1, 2].map((i) => <Inc key={i} d={suave([[-40 + i * 30, -10], [-30 + i * 30, -20 - t * 8], [-20 + i * 30, -12]])} c={C.negro} w={1.4} />)}
  </g>
);

// ---------- Mecone ----------
/** Vientre del buey: bolsa fea; abierto (0→1) muestra la carne escondida. */
export const Vientre: React.FC<{ x: number; abierto: number; f: number }> = ({ x, abierto, f }) => (
  <g transform={`translate(${x} ${SUELO})`}>
    {abierto > 0 && (
      <g opacity={abierto}>
        <circle cy={-90} r={140} fill="url(#halo)" opacity={0.35} style={{ mixBlendMode: 'screen' }} />
        {[[-50, -40], [0, -60], [44, -36], [-20, -96], [26, -100]].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx} ${cy - abierto * 20}) rotate(${i * 40})`}>
            <ellipse rx={34} ry={22} fill={CARNE} stroke={C.negro} strokeWidth={3} />
            <Inc d="M-20 -4 q 20 10 40 0" c={C.blanco} w={2} />
          </g>
        ))}
      </g>
    )}
    <g transform={`translate(0 ${-abierto * 4})`}>
      <path d={suave([[-110, 0], [-120, -60], [-80, -130], [-10, -150], [70, -126], [116, -70], [110, 0]], true)} fill="#5A3A22" stroke={C.negro} strokeWidth={4} opacity={1 - abierto * 0.75} />
      {Array.from({ length: 7 }, (_, i) => <Inc key={i} d={suave([[-90 + i * 28, -20], [-80 + i * 28, -70 + Math.sin(i + f / 30) * 6], [-86 + i * 28, -120]])} c={C.negro} w={2} />)}
      {[[-60, -90], [20, -110], [60, -50], [-30, -40]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={6} fill="none" stroke={C.negro} strokeWidth={2} opacity={1 - abierto} />)}
    </g>
  </g>
);

/** Huesos envueltos en grasa: alzar (0→1) levanta la grasa y deja ver los huesos. */
export const Grasa: React.FC<{ x: number; alzar: number; f: number }> = ({ x, alzar, f }) => {
  const brillo = 0.5 + Math.sin(f / 8) * 0.3;
  return (
    <g transform={`translate(${x} ${SUELO})`}>
      {[[-60, -20, 15], [-10, -34, -10], [40, -18, 20], [-30, -60, 5], [20, -70, -18]].map(([cx, cy, r], i) => (
        <g key={i} transform={`translate(${cx} ${cy}) rotate(${r})`}>
          <path d="M-46 -6 a 9 9 0 1 1 6 -8 L 40 -14 a 9 9 0 1 1 6 8 a 9 9 0 1 1 -6 8 L -40 2 a 9 9 0 1 1 -6 -8 Z" fill={HUESO} stroke={C.negro} strokeWidth={3} />
        </g>
      ))}
      <g transform={`translate(${alzar * 40} ${-alzar * 170}) rotate(${alzar * 18})`} opacity={1 - alzar * 0.3}>
        <path d={suave([[-120, 0], [-110, -70], [-50, -130], [20, -140], [90, -100], [124, -40], [120, 0]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={4} />
        {[0, 1, 2, 3].map((i) => <Inc key={i} d={suave([[-90 + i * 50, -20], [-80 + i * 50, -70], [-70 + i * 50, -110 + i * 6]])} c="#D9C9A8" w={3} />)}
        <ellipse cx={-30} cy={-100} rx={30} ry={12} fill="#FFFFFF" opacity={brillo} transform="rotate(-20 -30 -100)" />
        <ellipse cx={50} cy={-80} rx={14} ry={6} fill="#FFFFFF" opacity={brillo * 0.8} transform="rotate(-30 50 -80)" />
      </g>
    </g>
  );
};

/** Altar de piedra con volutas y fuego encima. */
export const Altar: React.FC<{ x: number; f: number; fuego?: number; s?: number }> = ({ x, f, fuego = 1, s = 1 }) => (
  <g transform={`translate(${x} ${SUELO}) scale(${s})`}>
    <rect x={-80} y={-130} width={160} height={130} fill={C.negro} />
    <rect x={-96} y={-150} width={192} height={22} fill={C.negro} />
    <rect x={-96} y={-12} width={192} height={12} fill={C.negro} />
    <circle cx={-92} cy={-148} r={14} fill={C.negro} stroke={C.crema} strokeWidth={2} />
    <circle cx={92} cy={-148} r={14} fill={C.negro} stroke={C.crema} strokeWidth={2} />
    <path d="M-60 -100 h120 M-60 -40 h120" stroke={C.crema} strokeWidth={2} />
    {[-40, 0, 40].map((cx) => <path key={cx} d={`M${cx - 12} -70 l 12 -16 l 12 16 l -12 16 Z`} fill={C.purpura} stroke={C.crema} strokeWidth={1.5} />)}
    {fuego > 0 && <g transform={`translate(0 -150) scale(${fuego})`}><Fuego f={f} s={0.9} viento={-10} /></g>}
  </g>
);

/** Columna de humo que sube en volutas. */
export const Humo: React.FC<{ x: number; y: number; f: number; alto?: number; o?: number }> = ({ x, y, f, alto = 360, o = 0.7 }) => (
  <g opacity={o}>
    {Array.from({ length: 9 }, (_, i) => {
      const t = ((f * 0.6 + i * (alto / 9)) % alto) / alto;
      const cx = x + Math.sin(t * 6 + i) * 30 * t - t * 60, cy = y - t * alto;
      const r = 14 + t * 40;
      return <path key={i} d={`M${cx - r} ${cy} a ${r} ${r * 0.7} 0 1 1 ${r * 2} 0 a ${r * 0.5} ${r * 0.4} 0 1 1 ${-r} 0`} fill="none" stroke={C.crema} strokeWidth={4} opacity={Math.sin(t * Math.PI)} />;
    })}
  </g>
);

// ---------- noche sin fuego ----------
export const Cueva: React.FC<{ x: number; s?: number }> = ({ x, s = 1 }) => (
  <g transform={`translate(${x} ${SUELO}) scale(${s})`}>
    <path d={suave([[-460, 0], [-420, -220], [-300, -400], [-100, -470], [120, -460], [320, -380], [440, -200], [470, 0]], true)} fill={C.barroOscuro} stroke={C.negro} strokeWidth={5} />
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 4 + r * 2 }, (_, i) => {
      const yy = -420 + r * 70, w = 120 + r * 70;
      const cx = -w + (i + 0.5) * ((w * 2) / (4 + r * 2));
      return <path key={`${r}-${i}`} d={`M${cx - 18} ${yy} a 18 12 0 0 1 36 0`} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.45} />;
    }))}
    <path d={suave([[-300, 0], [-280, -170], [-170, -290], [0, -320], [170, -280], [280, -160], [300, 0]], true)} fill={C.noche} />
  </g>
);

/** Par de ojos que brillan en la oscuridad y parpadean. */
export const Ojos: React.FC<{ x: number; y: number; f: number; o: number; seed?: number }> = ({ x, y, f, o, seed = 1 }) => {
  const parp = (f + seed * 37) % 90 < 5 ? 0.15 : 1;
  return (
    <g opacity={o} transform={`translate(${x} ${y}) scale(1 ${parp})`}>
      <circle cx={-14} r={16} fill="url(#halo)" opacity={0.6} />
      <circle cx={14} r={16} fill="url(#halo)" opacity={0.6} />
      <path d="M-22 0 Q -14 -7 -6 0 Q -14 5 -22 0 Z M6 0 Q 14 -7 22 0 Q 14 5 6 0 Z" fill={C.oro} />
      <path d="M-14 -4 V4 M14 -4 V4" stroke={C.negro} strokeWidth={2.5} />
    </g>
  );
};

/** Fogata: leños cruzados y fuego (escala de fuego 0 = apagada). */
export const Fogata: React.FC<{ x: number; y?: number; f: number; fuego: number; s?: number }> = ({ x, y = SUELO, f, fuego, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {fuego > 0.02 && <g transform={`translate(0 -14) scale(${fuego})`}><Fuego f={f} s={0.7} viento={-14} /></g>}
    <path d="M-60 0 L 50 -26 M-50 -26 L 60 0" stroke={C.negro} strokeWidth={16} strokeLinecap="round" />
    <path d="M-44 -6 l 8 -2 M30 -16 l 8 -2" stroke={C.crema} strokeWidth={2} />
    {fuego <= 0.02 && <circle cx={0} cy={-14} r={8} fill="#6B2A14" />}
    {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-70 + i * 23} cy={4} r={9} fill={C.negro} stroke={C.barroOscuro} strokeWidth={2} />)}
  </g>
);

// ---------- robo ----------
/** Carro del Sol: caja, rueda que gira y disco solar; los caballos van aparte. */
export const CarroSol: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={10} cy={-150} r={220} fill="url(#halo)" opacity={0.8} style={{ mixBlendMode: 'screen' }} />
    <path d="M-80 -90 L 70 -90 L 90 -150 L -60 -150 C -90 -130, -90 -110, -80 -90 Z" fill={C.negro} />
    <Borde d="M-74 -120 L 80 -120" w={9} color={C.oro} />
    <path d="M60 -100 L 200 -120" stroke={C.negro} strokeWidth={9} />
    <g transform="translate(0 -50)">
      <circle r={50} fill="none" stroke={C.negro} strokeWidth={10} />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d="M0 0 L0 -46" stroke={C.negro} strokeWidth={5} transform={`rotate(${i * 45 + f * 6})`} />)}
      <circle r={10} fill={C.negro} />
    </g>
    <g transform={`translate(10 -230)`}>
      {Array.from({ length: 16 }, (_, i) => <path key={i} d="M0 -76 L8 -104 L-8 -104 Z" fill={C.oro} stroke={C.negro} strokeWidth={2} transform={`rotate(${i * 22.5 + f * 0.6})`} />)}
      <circle r={70} fill={C.oro} stroke={C.negro} strokeWidth={4} />
      <circle r={52} fill="none" stroke={C.negro} strokeWidth={2} strokeDasharray="3 7" />
    </g>
  </g>
);

/** Fragua de Hefesto: horno abovedado con boca encendida y yunque. */
export const Fragua: React.FC<{ x: number; f: number; s?: number }> = ({ x, f, s = 1 }) => (
  <g transform={`translate(${x} ${SUELO}) scale(${s})`}>
    <path d={suave([[-150, 0], [-140, -170], [-60, -250], [60, -250], [140, -170], [150, 0]], true)} fill={C.negro} />
    {Array.from({ length: 4 }, (_, r) => Array.from({ length: 5 }, (_, i) => <rect key={`${r}-${i}`} x={-130 + i * 54 + (r % 2) * 27} y={-220 + r * 50} width={44} height={36} fill="none" stroke={C.crema} strokeWidth={1.2} opacity={0.35} />))}
    <path d="M-70 0 L -70 -90 C -70 -140, 70 -140, 70 -90 L 70 0 Z" fill="#3A140A" />
    <circle cy={-60} r={130} fill="url(#halo)" opacity={0.9} style={{ mixBlendMode: 'screen' }} />
    <g transform="translate(0 -6)"><Fuego f={f} s={0.75} viento={0} /></g>
    <path d="M-34 -250 L -34 -320 L 34 -320 L 34 -250" fill={C.negro} />
  </g>
);

export const Yunque: React.FC<{ x: number; s?: number }> = ({ x, s = 1 }) => (
  <g transform={`translate(${x} ${SUELO}) scale(${s})`}>
    <path d="M-30 0 L -20 -50 L 20 -50 L 30 0 Z" fill={C.negro} />
    <path d="M-70 -50 L 60 -50 C 80 -56, 90 -70, 110 -76 L 60 -76 L -70 -76 Z" fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
  </g>
);

/** Caña de hinojo vista de cerca: la brasa brilla adentro, sin llama. */
export const CanaCerca: React.FC<{ x: number; y: number; f: number; brasa: number; ang?: number; s?: number }> = ({ x, y, f, brasa, ang = -20, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`}>
    <rect x={-300} y={-22} width={600} height={44} rx={20} fill={C.negro} />
    {[-200, -60, 80, 220].map((nx) => <path key={nx} d={`M${nx} -24 v48`} stroke={C.crema} strokeWidth={4} />)}
    {[-260, -130, 10, 150].map((nx, i) => <path key={i} d={`M${nx} -14 l 40 0`} stroke={C.barroOscuro} strokeWidth={3} />)}
    <g opacity={brasa}>
      <ellipse cx={260} cy={0} rx={70} ry={60} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} opacity={0.8 + Math.sin(f / 4) * 0.2} />
      <ellipse cx={292} cy={0} rx={10} ry={18} fill="#FF7A2A" />
      <ellipse cx={292} cy={0} rx={5} ry={10} fill={C.oro} />
    </g>
    <ellipse cx={298} cy={0} rx={6} ry={21} fill="none" stroke={C.negro} strokeWidth={4} />
  </g>
);

// ---------- oficios ----------
export const Torno: React.FC<{ x: number; f: number; alto: number; s?: number }> = ({ x, f, alto, s = 1 }) => (
  <g transform={`translate(${x} ${SUELO}) scale(${s})`}>
    <path d="M-10 0 L -10 -60 L 10 -60 L 10 0 Z" fill={C.negro} />
    <ellipse cy={-64} rx={80} ry={14} fill={C.negro} />
    {Array.from({ length: 6 }, (_, i) => {
      const a = ((f * 12 + i * 60) % 360) * (Math.PI / 180);
      return <path key={i} d={`M${Math.cos(a) * 70} ${-64 + Math.sin(a) * 10} l 0 2`} stroke={C.crema} strokeWidth={4} strokeLinecap="round" opacity={Math.sin(a) > 0 ? 1 : 0.3} />;
    })}
    {/* vasija que crece */}
    <g transform={`translate(0 -74) scale(1 ${alto})`}>
      <path d={suave([[-24, 0], [-50, -40], [-46, -90], [-22, -120], [-30, -140], [30, -140], [22, -120], [46, -90], [50, -40], [24, 0]], true)} fill={C.barroClaro} stroke={C.negro} strokeWidth={3} />
      {alto > 0.8 && <path d="M-46 -70 H46" stroke={C.negro} strokeWidth={6} />}
    </g>
  </g>
);

/** Vasija terminada con friso (producto del fuego). */
export const Vasija: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={suave([[-26, 0], [-60, -50], [-56, -110], [-26, -144], [-34, -170], [34, -170], [26, -144], [56, -110], [60, -50], [26, 0]], true)} fill={C.barro} stroke={C.negro} strokeWidth={4} />
    <path d="M-58 -90 H58 M-58 -70 H58" stroke={C.negro} strokeWidth={4} />
    {[-40, -20, 0, 20, 40].map((cx) => <circle key={cx} cx={cx} cy={-80} r={4} fill={C.negro} />)}
    <path d="M-56 -110 C -80 -120, -80 -150, -34 -156 M56 -110 C 80 -120, 80 -150, 34 -156" stroke={C.negro} strokeWidth={6} fill="none" />
  </g>
);

/** Tablilla con letras y números grabados que van apareciendo (n = cuántos). */
export const Tablilla: React.FC<{ x: number; y: number; n: number; s?: number }> = ({ x, y, n, s = 1 }) => {
  const sig = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ι', 'ΙΙ', 'ΙΙΙ', 'Π', 'Δ'];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-110} y={-80} width={220} height={150} rx={6} fill={C.negro} stroke={C.purpura} strokeWidth={6} />
      {sig.map((t, i) => (
        <text key={i} x={-80 + (i % 5) * 40} y={-30 + Math.floor(i / 5) * 60} fill={C.crema} fontSize={36} fontFamily="serif" textAnchor="middle" opacity={Math.max(0, Math.min(1, n - i))}>{t}</text>
      ))}
    </g>
  );
};

/** Constelación que se dibuja (t 0→1). */
export const Constelacion: React.FC<{ pts: P[]; t: number }> = ({ pts, t }) => {
  const k = t * (pts.length - 1);
  return (
    <g>
      {pts.slice(1).map((p, i) => {
        const u = Math.max(0, Math.min(1, k - i));
        if (u <= 0) return null;
        const q = lerp(pts[i], p, u);
        return <path key={i} d={`M${pts[i][0]} ${pts[i][1]} L${q[0]} ${q[1]}`} stroke={C.crema} strokeWidth={2} strokeDasharray="6 6" />;
      })}
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={6} fill={C.blanco} opacity={Math.max(0.2, Math.min(1, k - i + 1))} />)}
    </g>
  );
};

// ---------- castigo ----------
/** Peñasco del Cáucaso: pared de roca con grietas y escamas. Origen = base. */
export const Penasco: React.FC<{ x: number; s?: number; nieve?: number }> = ({ x, s = 1, nieve = 0 }) => (
  <g transform={`translate(${x} ${SUELO}) scale(${s})`}>
    <path d={suave([[-300, 0], [-280, -200], [-230, -380], [-150, -520], [-60, -590], [30, -560], [110, -600], [190, -480], [250, -300], [300, 0]], true, 0.7)} fill={C.barroOscuro} stroke={C.negro} strokeWidth={5} />
    {Array.from({ length: 6 }, (_, r) => Array.from({ length: 3 + r }, (_, i) => {
      const yy = -500 + r * 80, w = 90 + r * 40;
      const cx = -w + (i + 0.5) * ((w * 2) / (3 + r));
      return <path key={`${r}-${i}`} d={`M${cx - 22} ${yy} a 22 15 0 0 1 44 0`} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.5} />;
    }))}
    <path d="M-120 -440 l 30 60 l -20 50 l 30 70 M140 -460 l -24 70 l 26 60" stroke={C.negro} strokeWidth={4} fill="none" />
    {nieve > 0 && <path d={suave([[-150, -520], [-60, -590], [30, -560], [110, -600], [150, -540], [100, -540], [40, -520], [-40, -550], [-110, -500]], true)} fill={C.blanco} opacity={nieve} />}
  </g>
);

/** Cadena entre dos puntos: eslabones alternados. `roto` (0→1) la abre y deja caer los eslabones. */
export const Cadena: React.FC<{ a: P; b: P; n?: number; roto?: number; caida?: number }> = ({ a, b, n = 9, roto = 0, caida = 0 }) => {
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n;
        const p = lerp(a, b, t);
        const comba = Math.sin(t * Math.PI) * 18;
        const caeY = roto * caida * (1 + azar(i) * 0.8), caeX = roto * (azar(i + 9) - 0.5) * 120;
        return (
          <ellipse key={i} cx={p[0] + caeX} cy={p[1] + comba + caeY} rx={i % 2 ? 14 : 16} ry={i % 2 ? 4 : 9} fill="none" stroke={C.negro} strokeWidth={6}
            transform={`rotate(${ang + roto * azar(i + 3) * 200} ${p[0] + caeX} ${p[1] + comba + caeY})`} />
        );
      })}
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n, p = lerp(a, b, t), comba = Math.sin(t * Math.PI) * 18;
        return roto > 0 ? null : <ellipse key={`h${i}`} cx={p[0]} cy={p[1] + comba} rx={i % 2 ? 14 : 16} ry={i % 2 ? 4 : 9} fill="none" stroke="#BDB3A0" strokeWidth={2} transform={`rotate(${ang} ${p[0]} ${p[1] + comba})`} />;
      })}
    </g>
  );
};

/** Grillete en la muñeca. */
export const Grillete: React.FC<{ p: P; abierto?: number }> = ({ p, abierto = 0 }) => (
  <g transform={`translate(${p[0]} ${p[1]})`} opacity={1 - abierto}>
    <rect x={-14} y={-10} width={28} height={20} rx={4} fill={C.negro} stroke="#BDB3A0" strokeWidth={2.5} />
  </g>
);

/** Copos de nieve que caen. */
export const Nieve: React.FC<{ f: number; o: number; n?: number }> = ({ f, o, n = 60 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const y = 120 + ((f * (1.5 + azar(i) * 1.5) + azar(i + 5) * 700) % 720);
      const x = (azar(i + 11) * 2200 - 140 + Math.sin(f / 20 + i) * 30 - f * 0.8) % 2200;
      return <circle key={i} cx={((x + 2200) % 2200) - 140} cy={y} r={2 + azar(i + 2) * 3} fill={C.blanco} />;
    })}
  </g>
);

/** Ráfagas de viento en espiral (como en la cerámica). */
export const Viento: React.FC<{ f: number; o: number; y?: number }> = ({ f, o, y = 300 }) => (
  <g opacity={o}>
    {Array.from({ length: 5 }, (_, i) => {
      const x = ((f * 6 + i * 520) % 2600) - 300, yy = y + (i % 3) * 110;
      return <path key={i} d={`M${x} ${yy} c 60 -10, 120 -10, 160 10 c 30 16, 10 46, -16 36 c -20 -8, -10 -26, 6 -22`} stroke={C.crema} strokeWidth={4} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

/** Piel de león de Heracles, encima de la cabeza de un Personaje (x, s del personaje). */
export const PielLeon: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => {
  const o = Math.sin(f / 10) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* manto por la espalda */}
      <path d={suave([[-10, -360], [-50, -300], [-64, -220], [-56 + o, -150], [-30, -170], [-28, -260], [0, -330]], true)} fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
      {[0, 1, 2].map((i) => <Inc key={i} d={`M${-48 + i * 6} ${-280 + i * 30} l 10 6`} w={1.5} />)}
      <path d={miembro([[-56 + o, -156], [-60 + o, -120], [-50 + o, -96]], [14, 10, 8])} fill={C.negro} />
      {/* capucha con cara de león */}
      <g transform="translate(20 -334) rotate(-6)">
        <path d={suave([[-38, 16], [-36, -30], [-6, -52], [30, -48], [50, -34], [50, -22], [30, -24], [6, -30], [-16, -18], [-24, 18]], true)} fill={C.negro} stroke={C.crema} strokeWidth={2} />
        <path d="M-10 -48 l 4 -14 l 10 12 Z M14 -50 l 6 -12 l 8 14 Z" fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
        <path d="M26 -40 Q 32 -44 38 -40" stroke={C.crema} strokeWidth={2} fill="none" />
        <path d="M30 -24 l 4 6 l 4 -6 l 4 6 l 4 -6" stroke={C.blanco} strokeWidth={2} fill="none" />
      </g>
    </g>
  );
};

/** Flecha en vuelo (de a hacia b, avance t). */
export const Flecha: React.FC<{ a: P; b: P; t: number }> = ({ a, b, t }) => {
  if (t <= 0 || t >= 1) return null;
  const p = lerp(a, b, t), ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return (
    <g transform={`translate(${p[0]} ${p[1]}) rotate(${ang})`}>
      <path d="M-90 0 H10" stroke={C.negro} strokeWidth={4} />
      <path d="M10 -8 L 30 0 L 10 8 Z" fill={C.negro} />
      <path d="M-90 0 l -10 -10 M-90 0 l -10 10 M-80 0 l -10 -10 M-80 0 l -10 10" stroke={C.purpura} strokeWidth={4} />
      <path d="M-160 0 H-110" stroke={C.crema} strokeWidth={2} strokeDasharray="6 8" opacity={0.7} />
    </g>
  );
};

/** Pithos (la “caja” de Pandora): ánfora grande cerrada con tapa y friso. */
export const Pithos: React.FC<{ x: number; y?: number; s?: number; f: number; brillo?: number }> = ({ x, y = SUELO, s = 1, f, brillo = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {brillo > 0 && <circle cy={-130} r={240} fill="url(#halo)" opacity={brillo * (0.7 + Math.sin(f / 6) * 0.2)} style={{ mixBlendMode: 'screen' }} />}
    <path d={suave([[-40, 0], [-100, -60], [-110, -150], [-70, -230], [-46, -250], [-56, -276], [56, -276], [46, -250], [70, -230], [110, -150], [100, -60], [40, 0]], true)} fill={C.negro} />
    <Borde d="M-106 -150 H106" w={14} />
    <path d="M-100 -110 H100 M-100 -190 H100" stroke={C.crema} strokeWidth={3} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-80 + i * 32} -170 l 10 -14 l 10 14 Z`} fill={C.oro} />)}
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-70 + i * 35} -90 c 6 -20, 20 -20, 26 0`} stroke={C.crema} strokeWidth={2.5} fill="none" />)}
    <path d="M-62 -276 C -60 -300, 60 -300, 62 -276 Z" fill={C.purpura} stroke={C.negro} strokeWidth={3} />
    <circle cy={-300} r={10} fill={C.oro} stroke={C.negro} strokeWidth={3} />
  </g>
);

/** Brillos de fuegos lejanos sobre la tierra (n puntos, aparecen según t). */
export const FuegosLejanos: React.FC<{ f: number; t: number; n?: number; y0?: number; y1?: number; x0?: number; x1?: number; s?: number }> = ({ f, t, n = 18, y0 = 640, y1 = 770, x0 = 0, x1 = 1920, s = 0.18 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const u = Math.max(0, Math.min(1, t * n - i));
      if (u <= 0) return null;
      const x = x0 + azar(i * 5 + 1) * (x1 - x0), y = y0 + azar(i * 7 + 2) * (y1 - y0);
      const k = s * (0.6 + (y - y0) / (y1 - y0 || 1) * 0.8) * u;
      return <g key={i} transform={`translate(${x} ${y})`}><Fuego f={f + i * 9} s={k} viento={-10} /></g>;
    })}
  </g>
);
