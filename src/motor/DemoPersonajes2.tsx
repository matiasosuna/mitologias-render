// Demo muda de 5 s: personajes actuales (izquierda) vs. personajes elaborados (derecha), en una costa hawaiana de prueba.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Personaje, CalidadHD, C, TITULO, FiltrosHD } from '../comun/vasija';
import { Personaje2 } from '../comun/personaje2';

const Fondo: React.FC<{ f: number }> = ({ f }) => (
  <>
    <defs>
      <linearGradient id="cieloH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F3B26B" /><stop offset="0.6" stopColor="#F7D9A3" /><stop offset="1" stopColor="#FBE9C7" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#cieloH)" />
    <circle cx={1500} cy={300} r={70} fill="#FCEFC9" opacity={0.9} />
    <path d="M1100 640 L1380 360 Q1420 330 1460 360 L1760 640 Z" fill="#6E4A3A" />
    <path d="M1380 360 Q1420 330 1460 360 L1440 380 Q1420 370 1400 380 Z" fill="#E8724B" />
    <path d={`M1420 340 q ${10 + Math.sin(f / 15) * 6} -60 -4 -120`} stroke="#9C8A80" strokeWidth={26} fill="none" opacity={0.35} strokeLinecap="round" />
    <rect x={0} y={640} width={1920} height={120} fill="#2E7C8A" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${(i * 180 + f * 2) % 2100 - 100} ${660 + (i % 3) * 30} q 30 -10 60 0`} stroke="#E9F4F0" strokeWidth={3} fill="none" opacity={0.7} />)}
    <rect x={0} y={760} width={1920} height={320} fill="#E6C996" />
    <rect x={0} y={786} width={1920} height={4} fill="#C9A570" />
  </>
);

export const DemoPersonajes2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <FiltrosHD />
        <Fondo f={f} />
        <CalidadHD.Provider value={true}>
          <Personaje x={260} y={790} s={1.05} piel="#9A5A34" ropa="corta" tocado={null} barba={false} accion="caminar" brazo={[100, -40]} />
          <Personaje x={640} y={790} s={1.05} mujer piel="#B9774A" ropa="larga" tocado={null} />
        </CalidadHD.Provider>
        <Personaje2 x={1230} y={790} s={1.05} accion="caminar" tatuaje lei objeto="anzuelo" semilla={2} brazo={[100, -40]} />
        <Personaje2 x={1620} y={790} s={1.05} mujer lei semilla={5} />
        <rect x={957} y={0} width={6} height={1080} fill={C.negro} opacity={0.7} />
        {[['AHORA', 480], ['MÁS ELABORADO', 1440]].map(([t, x]) => (
          <text key={t} x={x} y={120} textAnchor="middle" fontFamily={TITULO} fontWeight={700} fontSize={48} fill={C.crema} stroke={C.negro} strokeWidth={6} paintOrder="stroke" letterSpacing={6}>{t}</text>
        ))}
        <text x={1440} y={980} textAnchor="middle" fontFamily={TITULO} fontSize={30} fill={C.negro}>MAUI · PELE (prueba)</text>
      </svg>
    </AbsoluteFill>
  );
};
