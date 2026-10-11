import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TITULO, TEXTO } from '../comun/comun';

// Posiciones reales (J2000) y magnitudes de las estrellas principales de M45.
const ESTRELLAS = [
  { n: 'Alcíone', pt: 'Alcíone', en: 'Alcyone', ra: [3, 47, 29.1], dec: [24, 6, 18], mag: 2.87, hermana: true },
  { n: 'Electra', pt: 'Electra', en: 'Electra', ra: [3, 44, 52.5], dec: [24, 6, 48], mag: 3.7, hermana: true },
  { n: 'Maya', pt: 'Maia', en: 'Maia', ra: [3, 45, 49.6], dec: [24, 22, 4], mag: 3.87, hermana: true },
  { n: 'Mérope', pt: 'Mérope', en: 'Merope', ra: [3, 46, 19.6], dec: [23, 56, 54], mag: 4.18, hermana: true },
  { n: 'Taygete', pt: 'Taígeta', en: 'Taygeta', ra: [3, 45, 12.5], dec: [24, 28, 2], mag: 4.3, hermana: true },
  { n: 'Celeno', pt: 'Celeno', en: 'Celaeno', ra: [3, 44, 48.2], dec: [24, 17, 22], mag: 5.45, hermana: true },
  { n: 'Astérope', pt: 'Astérope', en: 'Asterope', ra: [3, 45, 54.5], dec: [24, 33, 17], mag: 5.76, hermana: true },
  { n: 'Atlas', pt: 'Atlas', en: 'Atlas', ra: [3, 49, 9.7], dec: [24, 3, 12], mag: 3.62, hermana: false },
  { n: 'Pléyone', pt: 'Pleione', en: 'Pleione', ra: [3, 49, 11.2], dec: [24, 8, 12], mag: 5.05, hermana: false },
];
// Ajuste de etiqueta [dx, dy, ancla] para que no se pisen
// Etiquetas en diagonal [dx, dy, ancla] para que no las crucen los destellos
const ETIQ: Record<string, [number, number, 'start' | 'end' | 'middle']> = {
  Alcíone: [50, 115, 'start'], Electra: [-45, 95, 'end'], Maya: [-40, -70, 'end'], Mérope: [45, 100, 'start'],
  Taygete: [40, 95, 'start'], Celeno: [40, 95, 'start'], Astérope: [-40, -66, 'end'], Atlas: [-40, -66, 'end'], Pléyone: [40, -66, 'start'],
};
const W = 3840, H = 2160;
const grados = ([a, b, c]: number[]) => a + b / 60 + c / 3600;
const RA0 = grados([3, 46, 59]) * 15, DEC0 = grados([24, 16, 0]), ESC = 2350; // px por grado
const proy = (ra: number[], dec: number[]) => ({
  x: W / 2 + 120 - (grados(ra) * 15 - RA0) * Math.cos((DEC0 * Math.PI) / 180) * ESC,
  y: H / 2 + 80 - (grados(dec) - DEC0) * ESC,
});

let s = 42;
const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
const FONDO = Array.from({ length: 1400 }, () => ({ x: rnd() * W, y: rnd() * H, r: rnd() ** 4 * 3.2 + 0.4, o: 0.25 + rnd() * 0.6, t: rnd() }));

const Estrella: React.FC<{ x: number; y: number; mag: number; hermana: boolean }> = ({ x, y, mag, hermana }) => {
  const r = 9 * Math.pow(2.2, (5.8 - mag) / 1.6);
  const pico = r * 4.5;
  const col = hermana ? '#CFE0FF' : '#FFE2B8';
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r * 6} fill={`url(#halo-${hermana ? 'h' : 'p'})`} />
      <g stroke={col} strokeLinecap="round" opacity={0.85}>
        <line x1={-pico} x2={pico} y1={0} y2={0} strokeWidth={r * 0.16} />
        <line y1={-pico} y2={pico} x1={0} x2={0} strokeWidth={r * 0.16} />
      </g>
      <circle r={r * 1.6} fill={col} opacity={0.35} filter="url(#suave)" />
      <circle r={r} fill="#fff" />
    </g>
  );
};

export const Pleyades: React.FC = () => {
  const pts = ESTRELLAS.map((e) => ({ ...e, ...proy(e.ra, e.dec) }));
  const p = (n: string) => pts.find((e) => e.n === n)!;
  // Contorno clásico del "carrito" de las Pléyades
  const linea = ['Electra', 'Merope', 'Alcíone', 'Atlas', 'Pléyone', 'Alcíone', 'Maya', 'Taygete', 'Celeno', 'Electra'].map((n) => p(n === 'Merope' ? 'Mérope' : n));
  return (
    <AbsoluteFill style={{ background: '#03050C' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs>
          <radialGradient id="halo-h">
            <stop offset="0%" stopColor="#9CC2FF" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#3A6BD9" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="halo-p">
            <stop offset="0%" stopColor="#FFD39A" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#D9883A" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="neb">
            <stop offset="0%" stopColor="#4F7BFF" stopOpacity={0.5} />
            <stop offset="55%" stopColor="#2846B8" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#0A1240" stopOpacity={0} />
          </radialGradient>
          <filter id="suave"><feGaussianBlur stdDeviation="6" /></filter>
          <filter id="nube" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0022 0.0035" numOctaves="5" seed="11" />
            <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.52  0 0 0 0 1  0 0 0 1.6 -0.55" />
            <feGaussianBlur stdDeviation="14" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id="mascara">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#fff" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* Vía láctea tenue y nebulosa de reflexión */}
        <rect width={W} height={H} fill="url(#neb)" opacity={0.35} />
        {FONDO.map((f, i) => (
          <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={f.t > 0.85 ? '#FFE6C7' : f.t < 0.15 ? '#C9DAFF' : '#fff'} opacity={f.o} />
        ))}
        {pts.filter((e) => e.hermana).map((e) => (
          <g key={`n${e.n}`}>
            <ellipse cx={e.x} cy={e.y} rx={520 - e.mag * 50} ry={420 - e.mag * 40} fill="url(#neb)" opacity={0.9} />
            <ellipse cx={e.x} cy={e.y} rx={600} ry={480} fill="url(#mascara)" filter="url(#nube)" opacity={0.55} />
          </g>
        ))}
        <polyline points={linea.map((e) => `${e.x},${e.y}`).join(' ')} fill="none" stroke="#9FB8E8" strokeOpacity={0.28} strokeWidth={3} strokeDasharray="14 16" />
        {pts.map((e) => <Estrella key={e.n} x={e.x} y={e.y} mag={e.mag} hermana={e.hermana} />)}
        {pts.map((e) => {
          const [dx, dy, a] = ETIQ[e.n];
          return (
            <g key={`t${e.n}`}>
              <text x={e.x + dx} y={e.y + dy} textAnchor={a} fontFamily={TITULO} fontWeight={700} fontSize={e.hermana ? 66 : 54} fill={e.hermana ? '#EAF1FF' : '#FFDCA8'} letterSpacing={4} style={{ paintOrder: 'stroke' }} stroke="#03050C" strokeWidth={10}>
                {e.pt.toUpperCase()}
              </text>
              <text x={e.x + dx} y={e.y + dy + 52} textAnchor={a} fontFamily={TEXTO} fontSize={38} fill={e.hermana ? '#9FB8E8' : '#D9B07A'} opacity={0.9}>
                ({e.en})
              </text>
            </g>
          );
        })}
        {/* Título y leyenda */}
        <text x={150} y={230} fontFamily={TITULO} fontWeight={700} fontSize={150} fill="#F2F5FF" letterSpacing={10}>AS PLÊIADES</text>
        <text x={156} y={300} fontFamily={TEXTO} fontSize={50} fill="#9FB8E8">(The Pleiades)</text>
        <text x={156} y={385} fontFamily={TEXTO} fontSize={56} fill="#C9D6F2">As sete irmãs · M45, na constelação de Touro</text>
        <text x={156} y={440} fontFamily={TEXTO} fontSize={38} fill="#8A9CC4">(The seven sisters · M45, in the constellation Taurus)</text>
        <g transform={`translate(150 ${H - 330})`} fontFamily={TEXTO} fontSize={44}>
          <circle cx={18} cy={-14} r={16} fill="#CFE0FF" />
          <text x={56} y={0} fill="#C9D6F2">As sete irmãs, filhas do titã Atlas e da ninfa Pleione</text>
          <text x={56} y={44} fontSize={32} fill="#8A9CC4">(The seven sisters, daughters of the titan Atlas and the nymph Pleione)</text>
          <circle cx={18} cy={106} r={16} fill="#FFE2B8" />
          <text x={56} y={120} fill="#E8CFA8">Seus pais, que no céu ficaram ao lado delas</text>
          <text x={56} y={164} fontSize={32} fill="#B89A72">(Their parents, who stayed beside them in the sky)</text>
        </g>
        <g textAnchor="end" fontFamily={TEXTO} fill="#6F82AD">
          <text x={W - 150} y={H - 170} fontSize={38}>Posições reais · tamanho segundo o brilho · norte acima</text>
          <text x={W - 150} y={H - 124} fontSize={30}>(Real positions · size by brightness · north up)</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
