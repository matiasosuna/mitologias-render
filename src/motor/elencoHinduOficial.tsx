// Diseños OFICIALES hindúes (2026-10-15), para los Shorts "Who is…?" y los episodios nuevos (tema pahari).
// Misma línea que la versión "A" nórdica aprobada: el muñeco de siempre con piel de color, ropa en capas simple y la
// identidad en silueta, pelo y 2–3 atributos que cualquiera reconoce (iconografía devocional clásica, nunca cómica):
//   Vishnu = azul, corona alta, amarillo, 4 brazos con disco, caracola, maza y loto · Shiva = moño de rastas con luna
//   y el Ganges, garganta azul, tridente con tamborcito, cobra, piel de tigre · Brahma = tres caras a la vista (de
//   cuatro), barba blanca, libro y vasija · Parvati = verde y rojo, loto · Ganesha = cabeza de elefante con un solo
//   colmillo, modak, ratón · Lakshmi = rojo y oro, lotos y monedas sobre un loto · Saraswati = blanco, vina, libro,
//   cisne · Durga = ocho brazos con armas y el león · Kali = piel oscura, melena suelta, espada, guirnalda de hibiscos
//   (sin nada sangriento) · Indra = vajra y el elefante blanco · Garuda = hombre-águila con alas rojas, manos juntas ·
//   Narasimha = cabeza de león con corona, 4 brazos.
// Brazos de más con forma suave y mano abierta (nunca tubos). Las entradas viejas de elencoHindu.tsx quedan intactas.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, miembro, desde, lerp, type P, type PersonajeProps } from '../comun/vasija';
import { PH, Florcita } from '../comun/pahari';
import {
  EnCara, Kohl, Tilak, Kundala, Mukuta, Halo, Vanamala, Collar, Cordon, Rudraksha, Patka, RayasTigre,
  Chakra, Shankha, Gada, Padma, Trishula, Pothi, Kamandalu, Vajra, Modakas, Pasha, Parashu, Khadga, Mala, Arco, Elefante, Creciente,
} from './elencoHindu';
import type { Ficha } from './elenco';

const N = PH.negro;
const r1 = (v: number) => v.toFixed(1);

// ---------- manos y brazos de más ----------
const DEDOS: [number, number][] = [[-6.2, -12], [-2.2, -4], [1.8, 4], [5.8, 12]];
/** Mano abierta (la misma del muñeco HD: cuatro dedos cortos y pulgar), con pulsera de oro. Origen = muñeca. */
const ManoAbierta: React.FC<{ ang: number; piel: string; k?: number; pulsera?: string }> = ({ ang, piel, k = 0.95, pulsera = PH.oro }) => (
  <g transform={`rotate(${r1(-ang)}) scale(${k})`}>
    {DEDOS.map(([x, g]) => <rect key={x} x={x - 1.7} y={4} width={3.4} height={12} rx={1.7} fill={piel} stroke={N} strokeWidth={1.4} transform={`rotate(${g} ${x} 6)`} />)}
    <path d="M7 1 L 15 4 C 17 5, 16 8, 14 8 L 7 6 Z" fill={piel} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />
    <rect x={-8.5} y={-3} width={17} height={11} rx={4} fill={piel} stroke={N} strokeWidth={1.8} />
    <rect x={-9.5} y={-8} width={19} height={6} rx={2.5} fill={pulsera} stroke={N} strokeWidth={1.4} />
  </g>
);
type BrazoX = { h: number; c: number; tiene?: React.ReactNode; dy?: number };
/** Brazos de más que salen del hombro de atrás (van en `detras`): curva suave, codo, pulsera y mano abierta;
 * cada uno con su atributo. h = ángulo del hombro, c = codo (0 abajo, 90 adelante, 180 arriba, negativos atrás). */
const BrazosMas: React.FC<{ piel: string; brazos: BrazoX[]; ancho?: number }> = ({ piel, brazos, ancho = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {brazos.map((b, i) => {
        const m = Math.sin(f / 24 + i * 1.3) * 3;
        const S: P = [-4 * ancho, -290 + (b.dy ?? 0)], E = desde(S, b.h + m, 58), W = desde(E, b.h + b.c + m, 54);
        const w = 21 * ancho;
        return (
          <g key={i}>
            <path d={miembro([S, lerp(S, E, 0.5), lerp(S, E, 0.9), lerp(E, W, 0.12), lerp(E, W, 0.6), W], [w, w * 0.8, w * 0.64, w * 0.62, w * 0.5, w * 0.38])} fill={piel} stroke={N} strokeWidth={2} />
            <path d={suave([lerp(S, E, 0.35), lerp(S, E, 0.5)])} stroke={PH.oro} strokeWidth={5} strokeLinecap="round" />
            <g transform={`translate(${r1(W[0])} ${r1(W[1])})`}>{b.tiene}<ManoAbierta ang={b.h + b.c + m} piel={piel} /></g>
          </g>
        );
      })}
    </g>
  );
};

// ---------- ropa ----------
/** Chal (uttariya) que cruza el pecho y cae flameando por la espalda. `detras` = la cola; si no, la banda del pecho. */
const Uttariya: React.FC<{ c: string; borde?: string; detras?: boolean }> = ({ c, borde = PH.oro, detras }) => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f / 18 + k) * (2 + k * 1.5);
  if (!detras) return <g><path d="M-24 -300 L -8 -303 L 32 -224 L 17 -219 Z" fill={c} stroke={N} strokeWidth={1.6} /><path d="M-8 -303 L 32 -224" stroke={borde} strokeWidth={2.6} /></g>;
  const cola: P[] = [[-16, -302], [-34, -284], [-44 + o(1), -250], [-48 + o(2), -214], [-60 + o(3), -182], [-72 + o(4), -164]];
  return <g><path d={miembro(cola, [14, 13, 12, 11, 9, 3])} fill={c} stroke={N} strokeWidth={1.6} /><path d={suave(cola.slice(0, 5).map(([x, y]) => [x - 5, y] as P))} stroke={borde} strokeWidth={2} fill="none" /></g>;
};
/** Blusa corta (choli) de las diosas, con ribete de oro: tapa el pecho y deja la cintura al aire, como en las miniaturas. */
const Choli: React.FC<{ c: string; borde?: string }> = ({ c, borde = PH.oro }) => (
  <g>
    <path d={suave([[-22, -302], [0, -306], [20, -305], [35, -286], [34, -264], [28, -250], [-2, -247], [-27, -249], [-31, -276]], true, 0.7)} fill={c} stroke={N} strokeWidth={1.8} />
    <path d={suave([[-26, -251], [-2, -249], [28, -252]])} stroke={borde} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    <path d={suave([[-14, -302], [6, -290], [22, -302]])} stroke={borde} strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
);
/** Loto grande bajo los pies (Lakshmi, Saraswati). Va en `detras`. */
const LotoPie: React.FC<{ c?: string; c2?: string }> = ({ c = PH.rosa, c2 = '#F6C8D0' }) => (
  <g>
    {[-62, -40, 40, 62].map((dx, i) => <path key={i} transform={`translate(${dx} 6) rotate(${dx * 0.9})`} d="M0 0 C -14 -10, -12 -34, 0 -44 C 12 -34, 14 -10, 0 0 Z" fill={c2} stroke={N} strokeWidth={1.4} />)}
    {[-24, 0, 24].map((dx, i) => <path key={i} transform={`translate(${dx} 6) rotate(${dx * 0.6})`} d="M0 0 C -16 -12, -14 -40, 0 -52 C 14 -40, 16 -12, 0 0 Z" fill={c} stroke={N} strokeWidth={1.4} />)}
    <path d="M-86 6 Q 0 18 86 6" stroke={PH.verde} strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);
/** Guirnalda de flores rojas de hibisco (la flor que se le ofrece a Kali). */
const GuirnaldaHibisco: React.FC = () => (
  <g>
    <path d="M-20 -298 C 0 -250, 24 -200, 30 -166 C 34 -150, 26 -150, 24 -170 C 18 -220, 26 -262, 30 -294" stroke={PH.verde} strokeWidth={4} fill="none" />
    {[[-12, -278], [0, -248], [14, -216], [26, -186], [27, -160], [24, -200], [26, -240], [28, -274]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-4.5} rx={3.6} ry={5.2} fill={PH.rojo} stroke={N} strokeWidth={0.8} transform={`rotate(${a + i * 20})`} />)}<circle r={1.8} fill={PH.amarillo} /></g>
    ))}
  </g>
);
/** Cinturón de cobra (Ganesha). */
const CinturonNaga: React.FC = () => <g><path d="M-30 -226 Q 6 -212 38 -228" stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" /><path d="M-30 -226 Q 6 -212 38 -228" stroke={PH.verde} strokeWidth={6} fill="none" strokeLinecap="round" /><path d="M34 -236 C 40 -248, 52 -246, 52 -236 C 52 -228, 44 -224, 38 -228 Z" fill={PH.verde} stroke={N} strokeWidth={1.4} /><circle cx={47} cy={-238} r={1.4} fill={N} /></g>;

// ---------- cabezas propias (coordenadas de la cabeza: perfil a la derecha, ojo en 18,-6) ----------
const CARA: P[] = [[-30, 2], [-22, -26], [0, -36], [20, -30], [28, -14], [30, -6], [41, 6], [32, 10], [34, 15], [31, 20], [26, 26], [8, 32], [4, 46], [-16, 46], [-24, 22]];
/** Ojo almendrado de las miniaturas con rabillo de kohl (sin parpadeo: para las cabezas propias). */
const OjoMini: React.FC<{ x?: number; y?: number; iris?: string }> = ({ x = 18, y = -6, iris = '#3A2312' }) => (
  <g transform={`translate(${x - 18} ${y + 6})`}>
    <path d="M9 -6 Q 18 -14 27 -6 Q 18 0 9 -6 Z" fill={PH.blanco} stroke={N} strokeWidth={1.6} />
    <circle cx={20} cy={-6} r={3.4} fill={iris} /><circle cx={20.4} cy={-6} r={1.9} fill={N} /><circle cx={21.5} cy={-7.4} r={0.8} fill={PH.blanco} />
    <path d="M8 -6 Q 18 -15 28 -6" stroke={N} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    <path d="M26 -6.5 Q 31 -8 35 -11" stroke={N} strokeWidth={1.8} fill="none" strokeLinecap="round" />
  </g>
);
/** Cara humana de perfil (para Brahma), con ojo, ceja, boca y barba blanca larga. */
const CaraBrahma: React.FC<{ piel: string }> = ({ piel }) => (
  <g>
    <path d={suave(CARA, true, 0.9)} fill={piel} stroke={N} strokeWidth={2} />
    <path d={suave([[2, 14], [16, 18], [28, 24], [36, 30], [36, 50], [30, 72], [22, 86], [12, 70], [2, 52], [-6, 34]], true, 0.8)} fill={PH.blanco} stroke={N} strokeWidth={1.6} />
    <path d="M22 17 C 28 14, 36 16, 40 22 C 34 21, 28 21, 22 22 Z" fill={PH.blanco} stroke={N} strokeWidth={1.2} />
    {[[8, 30, 12, 62], [18, 32, 22, 74], [28, 34, 30, 60]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} Q ${a + 5} ${(b + d) / 2} ${c} ${d}`} stroke="#C9C2B0" strokeWidth={1.4} fill="none" />)}
    <OjoMini />
    <path d="M8 -17 Q 18 -22 28 -16" stroke={N} strokeWidth={2} fill="none" strokeLinecap="round" />
  </g>
);
/** Tres caras de Brahma (la cuarta mira atrás): de perfil adelante, de frente al medio y de perfil hacia atrás. */
const CabezaBrahma: React.FC<{ piel: string }> = ({ piel }) => (
  <g>
    {/* pelo largo por la espalda */}
    {[0, 1, 2].map((i) => <path key={i} d={suave([[-30 + i * 6, 6], [-40 + i * 4, 34], [-36 + i * 5, 62], [-42 + i * 6, 80]])} stroke="#E8E2D4" strokeWidth={9} fill="none" strokeLinecap="round" />)}
    <g transform="translate(-30 2) scale(-0.86 0.86)"><CaraBrahma piel={piel} /></g>
    <CaraBrahma piel={piel} />
    {/* cara de frente, entre las dos */}
    <g transform="translate(-9 2)">
      <path d="M-17 -26 C -20 -6, -18 18, 0 26 C 18 18, 20 -6, 17 -26 C 10 -32, -10 -32, -17 -26 Z" fill={piel} stroke={N} strokeWidth={1.8} />
      <path d="M-14 12 C -16 34, -8 58, 0 66 C 8 58, 16 34, 14 12 C 8 18, -8 18, -14 12 Z" fill={PH.blanco} stroke={N} strokeWidth={1.4} />
      <path d="M-9 13 C -4 10, 4 10, 9 13 C 4 15, -4 15, -9 13 Z" fill={PH.blanco} stroke={N} strokeWidth={1} />
      {[-7, 7].map((x) => <g key={x}><path d={`M${x - 5} -8 Q ${x} -12 ${x + 5} -8 Q ${x} -5 ${x - 5} -8 Z`} fill={PH.blanco} stroke={N} strokeWidth={1.1} /><circle cx={x} cy={-8} r={1.8} fill={N} /><path d={`M${x - 5} -14 Q ${x} -17 ${x + 5} -14`} stroke={N} strokeWidth={1.4} fill="none" /></g>)}
      <path d="M0 -6 L -2 6 L 2 7" stroke={N} strokeWidth={1.2} fill="none" />
      <path d="M0 -26 L 0 -16" stroke={PH.rojo} strokeWidth={2.4} strokeLinecap="round" />
    </g>
    <g transform="translate(-9 -2) scale(1.35 1)"><Mukuta alto={0.85} /></g>
    <Kundala />
  </g>
);
/** Cabeza de elefante de Ganesha: frente con dos bultos, oreja grande, trompa que se curva hacia el modak, un solo
 * colmillo (el otro lo rompió para escribir el Mahabharata) y corona. */
const CabezaGanesha: React.FC<{ piel: string; oreja?: string }> = ({ piel, oreja = '#F2B8A8' }) => {
  const f = useCurrentFrame(), m = Math.sin(f / 18) * 4;
  const trompa: P[] = [[34, 6], [48, 30], [54 + m * 0.3, 58], [48 + m, 84], [56 + m, 100], [70 + m, 98]];
  return (
    <g>
      <path d={suave([[-12, -26], [-48, -40], [-74, -12], [-76, 30], [-58, 64], [-30, 70], [-16, 44]], true, 0.9)} fill={piel} stroke={N} strokeWidth={2} />
      <path d={suave([[-18, -16], [-46, -26], [-64, -6], [-64, 26], [-50, 52], [-28, 54], [-20, 34]], true, 0.9)} fill={oreja} opacity={0.8} />
      {[-20, 6, 30].map((y, i) => <circle key={i} cx={-70 + Math.abs(y - 6) * 0.12} cy={y} r={2.6} fill={PH.oro} stroke={N} strokeWidth={0.6} />)}
      <path d={suave([[-30, 34], [-36, -10], [-20, -40], [4, -48], [24, -42], [42, -24], [48, -2], [44, 22], [26, 40], [2, 50], [-20, 50]], true)} fill={piel} stroke={N} strokeWidth={2} />
      <path d={miembro(trompa, [30, 26, 22, 18, 14, 11])} fill={piel} stroke={N} strokeWidth={2} />
      {[30, 46, 62, 78].map((y, i) => <path key={i} d={`M${46 + (i * m) / 4 - 9} ${y} q 9 4 18 0`} stroke={N} strokeWidth={1.1} fill="none" opacity={0.45} />)}
      <path d="M30 28 C 44 40, 58 44, 70 38 C 60 32, 48 28, 38 20 Z" fill={PH.blanco} stroke={N} strokeWidth={1.4} />
      <OjoMini x={16} y={-10} />
      <path d="M2 -30 L 30 -30" stroke={PH.rojo} strokeWidth={3} strokeLinecap="round" /><path d="M6 -24 L 28 -24" stroke={PH.blanco} strokeWidth={2} strokeLinecap="round" />
      <g transform="translate(-8 -14) scale(1.05)"><Mukuta alto={0.75} /></g>
    </g>
  );
};
/** Cabeza de león de Narasimha: melena de rulos redondos, hocico, colmillos chiquitos y corona. */
const CabezaNarasimha: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 14) * 1.5;
  const lob: P[] = Array.from({ length: 15 }, (_, i) => { const a = ((250 - i * 19) * Math.PI) / 180, r = (i % 2 ? 54 : 64) + (i % 3 ? o : 0); return [-8 + Math.cos(a) * r, 8 - Math.sin(a) * r] as P; });
  return (
    <g>
      <path d={suave(lob, true, 1)} fill="#B8632A" stroke={N} strokeWidth={2} />
      {lob.filter((_, i) => i % 2 === 0).map(([x, y], i) => <path key={i} d={`M${r1(x * 0.8 - 6)} ${r1(y * 0.8 + 2)} q 6 -8 12 -2`} stroke="#E08A3A" strokeWidth={2.4} fill="none" strokeLinecap="round" />)}
      <path d={suave([[-26, 22], [-30, -16], [-8, -38], [22, -34], [40, -18], [58, -6], [62, 8], [54, 18], [52, 30], [34, 38], [8, 44], [-16, 40]], true)} fill="#E9A84A" stroke={N} strokeWidth={2} />
      <path d="M48 -8 C 58 -10, 64 -2, 62 6 C 56 8, 50 4, 48 -8 Z" fill={N} />
      <path d="M38 22 C 46 26, 52 24, 56 20 M44 22 l 2 7 l 3 -6" stroke={N} strokeWidth={1.6} fill={PH.blanco} strokeLinejoin="round" />
      {[0, 1, 2].map((k) => <circle key={k} cx={36 + k * 6} cy={10 + (k % 2) * 4} r={1.3} fill={N} />)}
      <OjoMini x={20} y={-12} iris="#8A5A12" />
      <path d="M6 -26 Q 20 -32 34 -22" stroke={N} strokeWidth={3} fill="none" strokeLinecap="round" />
      <g transform="translate(-6 -18) scale(1.05)"><Mukuta alto={0.75} /></g>
      <Kundala />
    </g>
  );
};
/** Cabeza de águila de Garuda: plumas doradas, cara clara, pico ganchudo y corona. */
const CabezaGaruda: React.FC = () => (
  <g>
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-26 + i * 3} ${-6 + i * 12} C ${-50 - i * 4} ${-8 + i * 14}, ${-58 - i * 4} ${6 + i * 14}, ${-62 - i * 3} ${18 + i * 14} C ${-46} ${12 + i * 12}, -36 ${8 + i * 12}, -24 ${10 + i * 12} Z`} fill={i % 2 ? '#C98A2E' : '#E0A848'} stroke={N} strokeWidth={1.2} />)}
    <path d={suave([[-28, 30], [-32, -12], [-10, -36], [16, -34], [32, -20], [38, -4], [34, 18], [14, 40], [-10, 46]], true)} fill="#E8C27A" stroke={N} strokeWidth={2} />
    <path d={suave([[-4, 2], [12, 4], [30, 2], [34, 18], [18, 38], [0, 40], [-10, 24]], true, 0.8)} fill={PH.blanco} opacity={0.85} />
    <path d="M28 -14 C 52 -18, 70 -2, 66 20 C 64 30, 56 32, 52 24 C 54 14, 48 8, 34 10 Z" fill={PH.amarillo} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
    <path d="M52 24 C 56 30, 62 30, 66 20" fill={PH.oroOsc} stroke={N} strokeWidth={1.2} />
    <path d="M34 10 C 42 12, 48 16, 52 24" stroke={N} strokeWidth={1.2} fill="none" />
    <circle cx={42} cy={0} r={1.6} fill={N} />
    <OjoMini x={16} y={-10} iris="#B5651D" />
    <path d="M4 -24 Q 16 -30 30 -22" stroke={N} strokeWidth={2.6} fill="none" strokeLinecap="round" />
    <g transform="translate(-6 -6) scale(0.95)"><Mukuta alto={0.6} /></g>
    <Kundala />
  </g>
);
/** Alas de Garuda: borde de oro, plumas largas verdes, medianas rojas y chicas doradas, redondeadas; se mecen. */
const AlasGaruda: React.FC = () => {
  const f = useCurrentFrame(), a = Math.sin(f / 12) * 4;
  const S: P = [-12, -286], M: P = [-112, -356];
  const pluma = (b: P, ang: number, l: number, w: number, c: string, k: string) => { const t = desde(b, ang, l); return <path key={k} d={miembro([b, desde(b, ang, l * 0.55), t], [w * 0.5, w, w * 0.35])} fill={c} stroke={N} strokeWidth={1.5} />; };
  return (
    <g transform={`rotate(${r1(a)} -12 -286)`}>
      {Array.from({ length: 6 }, (_, i) => pluma(lerp(M, S, i * 0.05), -128 + i * 12, 150 - i * 10, 26, i % 2 ? '#2F6B3E' : PH.verde, 'p' + i))}
      {Array.from({ length: 6 }, (_, i) => pluma(lerp(M, S, 0.2 + i * 0.13), -62 + i * 6, 104 - i * 8, 26, i % 2 ? PH.rojoOsc : PH.rojo, 's' + i))}
      {Array.from({ length: 7 }, (_, i) => pluma(lerp(M, S, i * 0.14), -70 + i * 4, 46, 20, i % 2 ? PH.oroOsc : PH.oro, 'c' + i))}
      <path d={miembro([S, lerp(S, M, 0.5), M, desde(M, -150, 18)], [24, 22, 18, 8])} fill={PH.oro} stroke={N} strokeWidth={1.8} />
      <path d={suave([lerp(S, M, 0.08), lerp(S, M, 0.9)])} stroke={PH.rojo} strokeWidth={3} strokeDasharray="2 6" strokeLinecap="round" />
    </g>
  );
};
/** Melena larga y suelta de Kali, que le cae por la espalda hasta la cintura. Va en `detras`. */
const MelenaKali: React.FC = () => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f / 16 + k) * 4;
  return <path d={suave([[0, -372], [-30, -366], [-52, -330], [-64 + o(1), -280], [-74 + o(2), -230], [-66 + o(3), -196], [-76 + o(4), -168], [-52, -176], [-40 + o(2), -150], [-26, -200], [-16, -260], [-4, -310]], true, 0.8)} fill="#120C10" stroke={N} strokeWidth={1.6} />;
};
/** Moño de rastas de Shiva (jata) con la luna creciente y el Ganges que brota arriba. */
const JataShiva: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <path d="M-28 -14 C -32 -40, -20 -56, -4 -58 C 12 -58, 22 -46, 22 -30 C 8 -36, -14 -32, -28 -14 Z" fill="#3A2A20" stroke={N} strokeWidth={1.6} />
      {[[-4, -66, 20, 13], [-4, -86, 16, 11], [-3, -102, 12, 9]].map(([cx, cy, rx, ry], i) => <g key={i}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#3A2A20" stroke={N} strokeWidth={1.6} /><path d={`M${cx - rx * 0.7} ${cy} Q ${cx} ${cy - ry * 0.8} ${cx + rx * 0.7} ${cy}`} stroke="#6A5040" strokeWidth={2} fill="none" /></g>)}
      <path d="M-26 -14 C -40 10, -42 40, -36 70" stroke="#3A2A20" strokeWidth={9} fill="none" strokeLinecap="round" />
      <Creciente x={18} y={-70} r={13} />
      {[-1, 1].map((k) => <g key={k}><path d={`M-3 -110 C ${-3 + k * 4} -126, ${-3 + k * 18} -128, ${-3 + k * 24} -114`} stroke={PH.azulClaro} strokeWidth={5} fill="none" strokeLinecap="round" /><path d={`M-3 -110 C ${-3 + k * 4} -126, ${-3 + k * 18} -128, ${-3 + k * 24} -114`} stroke={PH.blanco} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeDasharray="4 6" strokeDashoffset={-f * 1.2} /><circle cx={-3 + k * 25} cy={-110 + ((f * 1.2 + (k + 1) * 6) % 12)} r={2} fill={PH.azulClaro} /></g>)}
      <path d="M2 -28 L 30 -29 M2 -24 L 30 -25 M2 -20 L 30 -21" stroke={PH.blanco} strokeWidth={1.6} opacity={0.9} />
      <ellipse cx={23} cy={-24} rx={2.2} ry={4.4} fill={PH.blanco} stroke={N} strokeWidth={1} /><circle cx={23} cy={-24} r={1.5} fill={PH.rojo} />
    </g>
  );
};
/** Cobra de Shiva: vuelta sobre los hombros y la capucha alzada detrás de la cabeza (va en `cuerpo`). */
const CobraShiva: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 14) * 2;
  const cuerpo = `M34 -292 C 18 -280, -8 -280, -24 -294 C -36 -306, -38 -326, ${-30 + o} -346`;
  return (
    <g>
      <path d={cuerpo} stroke={N} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d={cuerpo} stroke={PH.verde} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d={cuerpo} stroke={PH.amarillo} strokeWidth={2} fill="none" strokeDasharray="3 7" />
      <g transform={`translate(${-30 + o} -360)`}>
        <path d="M0 18 C -18 14, -22 -6, -12 -20 C -6 -28, 6 -28, 12 -20 C 22 -6, 18 14, 0 18 Z" fill={PH.verde} stroke={N} strokeWidth={1.6} />
        <path d="M0 12 C -10 8, -12 -4, -6 -12 C -2 -16, 2 -16, 6 -12 C 12 -4, 10 8, 0 12 Z" fill="#B8D08A" />
        {[-6, 0, 6].map((y) => <path key={y} d={`M-6 ${y} Q 0 ${y + 3} 6 ${y}`} stroke="#7FA05A" strokeWidth={1.2} fill="none" />)}
        <path d="M-6 -24 C -4 -32, 4 -32, 6 -24 Z" fill={PH.verde} stroke={N} strokeWidth={1.2} />
        <circle cx={-2} cy={-27} r={1.2} fill={N} /><circle cx={2} cy={-27} r={1.2} fill={N} />
      </g>
    </g>
  );
};
/** Garganta azul de Shiva (Nilakantha: guardó el veneno del océano en la garganta). */
const GargantaAzul: React.FC = () => <EnCara><path d="M-20 28 C -6 30, 6 30, 14 28 L 14 50 L -20 50 Z" fill="#2E4FA8" opacity={0.92} /></EnCara>;
/** Bindi rojo en la frente. */
const Bindi: React.FC<{ c?: string }> = ({ c = PH.rojo }) => <circle cx={26} cy={-20} r={2.6} fill={c} stroke={N} strokeWidth={0.6} />;
/** Pelo de diosa en rodete con flores (va debajo de la corona chica). */
const RodeteDiosa: React.FC<{ flor?: string }> = ({ flor = PH.blanco }) => (
  <g>
    <ellipse cx={-34} cy={-10} rx={15} ry={13} fill={N} />
    {[[-40, -20], [-28, -22], [-44, -6]].map(([x, y], i) => <Florcita key={i} x={x} y={y} r={4.5} c={flor} />)}
  </g>
);
/** Corona chica de diosa (mukuta baja). */
const CoronaDiosa: React.FC<{ joya?: string }> = ({ joya = PH.rojo }) => <g transform="translate(0 6) scale(0.92)"><Mukuta alto={0.5} joya={joya} /></g>;

// ---------- atributos nuevos en la mano ----------
/** Monedas de oro que caen de la mano abierta de Lakshmi. */
const Monedas: React.FC = () => {
  const f = useCurrentFrame();
  return <g>{Array.from({ length: 6 }, (_, i) => { const t = ((f * 2.4 + i * 22) % 130) / 130; return <ellipse key={i} cx={4 + (i % 2 ? 5 : -4) + t * 6} cy={18 + t * 130} rx={6} ry={4.4} fill={PH.amarillo} stroke={PH.oroOsc} strokeWidth={1.4} opacity={1 - t * 0.6} />; })}</g>;
};
/** Vina de Saraswati, cruzada sobre el cuerpo (va en `cuerpo`): caja grande adelante abajo, calabaza chica atrás arriba. */
const VinaCruzada: React.FC = () => (
  <g>
    <path d="M58 -186 L -44 -330" stroke={N} strokeWidth={10} strokeLinecap="round" />
    <path d="M58 -186 L -44 -330" stroke="#9A5A2A" strokeWidth={7} strokeLinecap="round" />
    {[0.2, 0.32, 0.44, 0.56, 0.68].map((t) => { const x = 58 - 102 * t, y = -186 - 144 * t; return <path key={t} d={`M${r1(x - 4)} ${r1(y + 3)} l 8 -6`} stroke={PH.oro} strokeWidth={2} />; })}
    <path d="M60 -188 L -42 -332" stroke={PH.blanco} strokeWidth={0.9} transform="translate(3 -2)" />
    <circle cx={-46} cy={-326} r={17} fill="#B8742A" stroke={N} strokeWidth={1.6} />
    <path d="M-58 -318 Q -46 -308 -34 -318" stroke={PH.oro} strokeWidth={2} fill="none" />
    <ellipse cx={62} cy={-176} rx={30} ry={24} fill="#B8742A" stroke={N} strokeWidth={1.8} transform="rotate(-35 62 -176)" />
    <path d="M44 -168 Q 62 -150 84 -170" stroke={PH.oro} strokeWidth={3} fill="none" />
    <path d="M-56 -340 C -62 -350, -54 -358, -48 -352" stroke={N} strokeWidth={3} fill="none" />
  </g>
);
/** Campanita (ghanta) de Durga. */
const Ghanta: React.FC = () => { const f = useCurrentFrame(); return <g transform={`rotate(${r1(Math.sin(f / 4) * 6)}) translate(0 -6)`}><path d="M-2 -6 V -20" stroke={PH.oro} strokeWidth={4} /><path d="M-14 12 C -14 -6, -8 -10, 0 -10 C 8 -10, 14 -6, 14 12 Z" fill={PH.oro} stroke={N} strokeWidth={1.4} /><circle cx={0} cy={14} r={3} fill={N} /></g>; };

// ---------- vahanas (van en `detras`, coordenadas del cuerpo, pies en 0) ----------
/** León de Durga, parado detrás de ella mirando adelante: la cabeza asoma por delante de su falda. */
const LeonDurga: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 14) * 2, cola = Math.sin(f / 10) * 8;
  const pata = (x: number, d = 0) => <path d={miembro([[x, -96], [x + 4 + d, -50], [x + 2 + d, -2]], [30, 22, 20])} fill="#E2A64A" stroke={N} strokeWidth={2} />;
  const mel: P[] = Array.from({ length: 13 }, (_, i) => { const a = ((235 - i * 22) * Math.PI) / 180, r = (i % 2 ? 44 : 54) + (i % 3 ? o : 0); return [100 + Math.cos(a) * r, -160 - Math.sin(a) * r] as P; });
  return (
    <g>
      <path d={`M-200 -120 C -240 -140, -250 -190, ${-236 + cola} -214`} stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d={`M-200 -120 C -240 -140, -250 -190, ${-236 + cola} -214`} stroke="#E2A64A" strokeWidth={7} fill="none" strokeLinecap="round" />
      <ellipse cx={-236 + cola} cy={-220} rx={9} ry={12} fill="#8A4A1E" stroke={N} strokeWidth={1.4} />
      {pata(-170, -6)}{pata(40, 6)}
      <path d={suave([[-206, -110], [-190, -150], [-100, -166], [0, -170], [70, -156], [90, -112], [60, -86], [-160, -84]], true)} fill="#E9B04E" stroke={N} strokeWidth={2.4} />
      {pata(-140, 4)}{pata(70, -4)}
      <path d={suave(mel, true)} fill="#A8521E" stroke={N} strokeWidth={2} />
      {mel.filter((_, i) => i % 2 === 0).map(([x, y], i) => <path key={i} d={`M${r1(100 + (x - 100) * 0.75 - 5)} ${r1(-160 + (y + 160) * 0.75)} q 5 -7 10 -2`} stroke="#D97A2E" strokeWidth={2.2} fill="none" strokeLinecap="round" />)}
      <path d={suave([[78, -150], [96, -186], [126, -184], [146, -168], [150, -146], [140, -132], [112, -126], [84, -132]], true)} fill="#ECB45A" stroke={N} strokeWidth={2} />
      <path d="M140 -168 C 150 -170, 154 -162, 150 -156 C 146 -156, 142 -160, 140 -168 Z" fill={N} />
      <path d="M128 -138 Q 138 -134 146 -138" stroke={N} strokeWidth={1.6} fill="none" />
      <path d="M118 -176 Q 126 -182 134 -176 Q 126 -171 118 -176 Z" fill={PH.amarillo} stroke={N} strokeWidth={1.2} /><circle cx={127} cy={-176} r={2} fill={N} />
      <path d="M86 -100 Q 100 -92 112 -102" stroke={PH.rojo} strokeWidth={5} fill="none" />
    </g>
  );
};
/** Ratón de Ganesha (Mushika), sentado a sus pies con un modak. Va en `cuerpo` (adelante de los pies). */
const Raton: React.FC<{ x?: number }> = ({ x = 92 }) => {
  const f = useCurrentFrame(), n = Math.sin(f / 6) * 1.2;
  return (
    <g transform={`translate(${x} 0)`}>
      <path d="M-20 -10 C -40 -6, -52 -14, -58 -26" stroke="#7A6A5A" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d={suave([[-24, -2], [-26, -22], [-10, -36], [8, -34], [16, -20], [12, -2]], true)} fill="#9A8A7A" stroke={N} strokeWidth={1.8} />
      <path d={suave([[6, -30], [16, -42], [30, -40], [36 + n, -32], [26, -24], [12, -22]], true)} fill="#9A8A7A" stroke={N} strokeWidth={1.6} />
      <circle cx={14} cy={-44} r={7} fill="#9A8A7A" stroke={N} strokeWidth={1.4} /><circle cx={14} cy={-44} r={4} fill="#E9A8A8" />
      <circle cx={26} cy={-36} r={1.8} fill={N} /><circle cx={37 + n} cy={-32} r={1.8} fill={PH.rosaOsc} />
      <path d="M18 -14 C 22 -20, 30 -20, 32 -12 C 30 -4, 20 -4, 18 -14 Z" fill={PH.blanco} stroke={N} strokeWidth={1} />
      <path d="M-14 0 h 8 M4 0 h 8" stroke="#7A6A5A" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};
/** Cisne blanco de Saraswati (hamsa) a sus pies. Va en `cuerpo`. */
const Cisne: React.FC<{ x?: number }> = ({ x = 96 }) => {
  const f = useCurrentFrame(), c = Math.sin(f / 16) * 2;
  return (
    <g transform={`translate(${x} 0)`}>
      <path d="M-34 -6 C -40 -30, -20 -40, 0 -34 C 18 -30, 30 -24, 26 -8 C 18 0, -20 2, -34 -6 Z" fill={PH.blanco} stroke={N} strokeWidth={1.8} />
      <path d="M-28 -18 C -14 -30, 4 -28, 14 -20" stroke="#D8D0C0" strokeWidth={2} fill="none" />
      <path d={`M16 -18 C 30 -30, 18 -50, 22 ${-66 + c} C 26 ${-74 + c}, 36 ${-74 + c}, 38 ${-66 + c}`} stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={`M16 -18 C 30 -30, 18 -50, 22 ${-66 + c} C 26 ${-74 + c}, 36 ${-74 + c}, 38 ${-66 + c}`} stroke={PH.blanco} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={`M37 ${-68 + c} L 48 ${-63 + c} L 37 ${-61 + c} Z`} fill={PH.azafran} stroke={N} strokeWidth={1} />
      <circle cx={31} cy={-68 + c} r={1.5} fill={N} />
    </g>
  );
};
/** Airavata, el elefante blanco de Indra, detrás de él (asoma la cabeza con la trompa en alto). */
const ElefanteIndra: React.FC = () => { const f = useCurrentFrame(); return <Elefante x={-30} y={0} s={0.7} f={f} colmillos={2} />; };

// ---------- fichas ----------
type PP = Partial<PersonajeProps>;
const H = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: { barba: false, collar: false, tocado: null, ...p }, griego: nombre });
const M = (p: PP, nombre: string): Ficha => ({ tipo: 'persona', p: { mujer: true, collar: false, tocado: null, ...p }, griego: nombre });

const AZUL = '#3D72C4', CENIZA = '#C3CFDA', BRAHMA = '#E2A866', DORADA = '#E6B35A', PIEL_DIOSA = '#EDB98A', GANESHA = '#E8956B', KALI = '#2C3352';
const halo = <Halo />;

export const ELENCO_HINDU_OFICIAL: Record<string, Ficha> = {
  vishnu_oficial: H({ piel: AZUL, pelo: N, ropa: 'larga', ropaColor: PH.amarillo, brazo: [14, 24], adornos: {
    detras: <>{halo}<Uttariya c={PH.rojo} detras /><BrazosMas piel={AZUL} brazos={[{ h: -168, c: 4, tiene: <Chakra r={17} /> }, { h: -78, c: -64, dy: 8, tiene: <Shankha /> }]} /></>,
    cabeza: <><Mukuta /><Kohl /><Tilak /><Kundala /></>,
    cuerpo: <><Uttariya c={PH.rojo} /><Patka c={PH.rojo} /><Collar joya={PH.rojo} /><Vanamala /></>,
    mano: <Gada />, manoAtras: <Padma />,
  } }, 'VISHNU'),
  shiva_oficial: H({ piel: CENIZA, pelo: '#3A2A20', ropa: 'corta', ropaColor: '#D98A2B', brazo: [52, 8], adornos: {
    detras: halo,
    cabeza: <><GargantaAzul /><JataShiva /><Kohl /><Kundala c="#D8D2C0" /></>,
    cuerpo: <><RayasTigre /><Rudraksha /><CobraShiva /></>,
    mano: <Trishula />,
  } }, 'SHIVA'),
  brahma_oficial: H({ piel: BRAHMA, cabezaPropia: true, ropa: 'larga', ropaColor: PH.blanco, brazo: [12, 30], adornos: {
    detras: <>{halo}<Uttariya c={PH.azafran} detras /><BrazosMas piel={BRAHMA} brazos={[{ h: -170, c: 0, tiene: <Mala /> }, { h: -80, c: -60, dy: 8, tiene: <Kamandalu /> }]} /></>,
    cabeza: <CabezaBrahma piel={BRAHMA} />,
    cuerpo: <><Uttariya c={PH.azafran} /><Cordon /><Patka c={PH.rojo} /></>,
    mano: <Pothi />, manoAtras: <Padma />,
  } }, 'BRAHMA'),
  parvati_oficial: M({ piel: PIEL_DIOSA, ropa: 'larga', ropaColor: PH.verde, brazo: [30, 60], adornos: {
    detras: <>{halo}<Uttariya c={PH.rojo} detras /></>,
    cabeza: <><RodeteDiosa flor={PH.blanco} /><CoronaDiosa joya={PH.verde} /><Kohl /><Bindi /><Kundala /></>,
    cuerpo: <><Choli c={PH.rojo} /><Uttariya c={PH.rojo} /><Collar joya={PH.verde} /><Patka c={PH.rojo} /></>,
    mano: <Padma s={1.1} />,
  } }, 'PARVATI'),
  ganesha_oficial: H({ piel: GANESHA, cabezaPropia: true, cuerpo: 'gordo', ropa: 'corta', ropaColor: PH.amarillo, brazo: [40, 40], adornos: {
    detras: <>{halo}<Uttariya c={PH.rojo} detras /><BrazosMas piel={GANESHA} ancho={1.15} brazos={[{ h: -170, c: 4, tiene: <Parashu /> }, { h: -84, c: -60, dy: 8, tiene: <Pasha /> }]} /></>,
    cabeza: <CabezaGanesha piel={GANESHA} />,
    cuerpo: <><Uttariya c={PH.rojo} /><Cordon /><CinturonNaga /><Raton /></>,
    mano: <Modakas />, manoAtras: <Padma />,
  } }, 'GANESHA'),
  lakshmi_oficial: M({ piel: '#F0C08E', ropa: 'larga', ropaColor: PH.rojo, brazo: [44, 10], adornos: {
    detras: <>{halo}<LotoPie /><Uttariya c={PH.oro} borde={PH.rojo} detras /><BrazosMas piel="#F0C08E" brazos={[{ h: -168, c: 4, tiene: <Padma s={1.2} /> }, { h: -96, c: -50, dy: 8, tiene: <Padma s={1.1} /> }]} /></>,
    cabeza: <><RodeteDiosa flor={PH.rosa} /><CoronaDiosa /><Kohl /><Bindi /><Kundala /></>,
    cuerpo: <><Choli c={PH.rojo} /><Uttariya c={PH.oro} borde={PH.rojo} /><Collar joya={PH.verde} /><Patka c={PH.oro} /></>,
    mano: <Monedas />,
  } }, 'LAKSHMI'),
  saraswati_oficial: M({ piel: '#F4D2AE', ropa: 'larga', ropaColor: PH.blanco, brazo: [-6, 96], adornos: {
    detras: <>{halo}<LotoPie c={PH.blanco} c2="#F3EBD8" /><Uttariya c={PH.amarillo} borde={PH.oro} detras /><BrazosMas piel="#F4D2AE" brazos={[{ h: -168, c: 4, tiene: <Mala /> }, { h: -92, c: -54, dy: 8, tiene: <Pothi /> }]} /></>,
    cabeza: <><RodeteDiosa /><CoronaDiosa joya={PH.blanco} /><Kohl /><Bindi /><Kundala c={PH.blanco} /></>,
    cuerpo: <><Choli c={PH.blanco} /><Uttariya c={PH.amarillo} borde={PH.oro} /><Collar joya={PH.blanco} /><VinaCruzada /><Cisne /></>,
  } }, 'SARASWATI'),
  durga_oficial: M({ piel: '#F0B880', ropa: 'larga', ropaColor: PH.rojo, brazo: [14, 20], adornos: {
    detras: <><g transform="scale(0.84)"><LeonDurga /></g>{halo}<BrazosMas piel="#F0B880" brazos={[
      { h: -176, c: 6, tiene: <Chakra r={15} /> }, { h: -150, c: -10, dy: 2, tiene: <Khadga /> }, { h: -124, c: -14, dy: 4, tiene: <Shankha /> },
      { h: -98, c: -30, dy: 6, tiene: <Ghanta /> }, { h: -70, c: -40, dy: 8, tiene: <Arco /> }, { h: -44, c: -36, dy: 10, tiene: <Padma /> },
    ]} /></>,
    cabeza: <><Mukuta alto={0.8} /><Kohl /><Bindi /><Kundala /></>,
    cuerpo: <><Choli c={PH.rojo} /><Uttariya c={PH.amarillo} borde={PH.oro} /><Collar joya={PH.verde} /><Patka c={PH.oro} /></>,
    mano: <Trishula />, manoAtras: <Gada />,
  } }, 'DURGA'),
  kali_oficial: M({ piel: KALI, pelo: '#120C10', ropa: 'larga', ropaColor: PH.rojoOsc, brazo: [60, 96], adornos: {
    detras: <><MelenaKali />{halo}<BrazosMas piel={KALI} brazos={[{ h: -172, c: 4, tiene: <Khadga /> }, { h: -70, c: -30, dy: 8, tiene: <g transform="scale(0.75)"><Trishula /></g> }]} /></>,
    cabeza: <><path d="M-31 4 C -34 -28, -4 -40, 22 -32 C 6 -30, -14 -20, -22 0 Z" fill="#120C10" /><Mukuta alto={0.7} /><Kohl /><ellipse cx={23} cy={-22} rx={2.2} ry={4.2} fill={PH.blanco} stroke={N} strokeWidth={1} /><circle cx={23} cy={-22} r={1.4} fill={PH.rojo} /><Kundala /></>,
    cuerpo: <><Choli c={PH.rojoOsc} /><GuirnaldaHibisco /><Patka c={PH.oro} /></>,
  } }, 'KALI'),
  indra_oficial: H({ piel: DORADA, pelo: N, ropa: 'corta', ropaColor: PH.blanco, brazo: [40, 70], adornos: {
    detras: <><ElefanteIndra />{halo}<Uttariya c={PH.lapis} detras /></>,
    cabeza: <><Mukuta joya={PH.verde} /><Kohl /><Kundala /><path d="M22 13 C 28 10, 36 12, 40 18 C 34 16, 28 16, 22 17 Z" fill="#3A2A20" /></>,
    cuerpo: <><Uttariya c={PH.lapis} /><Collar /><Patka c={PH.lapis} /></>,
    mano: <Vajra />,
  } }, 'INDRA'),
  garuda_oficial: H({ piel: '#E0A050', cabezaPropia: true, ropa: 'corta', ropaColor: PH.rojo, brazo: [10, 136], brazoAtras: [10, 136], adornos: {
    detras: <AlasGaruda />,
    cabeza: <CabezaGaruda />,
    cuerpo: <><Collar /><Patka c={PH.verde} /></>,
  } }, 'GARUDA'),
  narasimha_oficial: H({ piel: '#E9A84A', cabezaPropia: true, gigante: true, ropa: 'corta', ropaColor: PH.amarillo, brazo: [30, 40], adornos: {
    detras: <>{halo}<Uttariya c={PH.rojo} detras /><BrazosMas piel="#E9A84A" ancho={1.2} brazos={[{ h: -168, c: 4, tiene: <Chakra r={17} /> }, { h: -80, c: -60, dy: 8, tiene: <Shankha /> }]} /></>,
    cabeza: <CabezaNarasimha />,
    cuerpo: <><Uttariya c={PH.rojo} /><Collar /><Vanamala /></>,
  } }, 'NARASIMHA'),
};
export const NOMBRE_EN_HINDU_OFICIAL: Record<string, string> = Object.fromEntries(Object.entries(ELENCO_HINDU_OFICIAL).map(([k, f]) => [k, f.griego as string]));
