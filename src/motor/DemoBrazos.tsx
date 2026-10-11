// Demo muda de 5 s: los mismos muñequitos, brazos de hoy (izquierda) vs. brazos mejorados (derecha).
// Mejorados = codo redondeado + músculos, y movimiento con resorte: anticipación, el codo llega después que el hombro y se pasa un poquito.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring } from 'remotion';
import { Escenario, Personaje, Suelo, aplicarTema, C, TITULO, CalidadHD, cl } from '../comun/vasija';

// Poses clave del brazo de adelante [hombro, codo] y del de atrás, por frame.
const POSES: { f: number; d: [number, number]; t: [number, number] }[] = [
  { f: 0, d: [14, 24], t: [-16, 20] },     // reposo
  { f: 12, d: [14, 24], t: [-16, 20] },
  { f: 24, d: [98, -6], t: [-20, 26] },    // señala
  { f: 58, d: [160, 30], t: [-24, 30] },   // saluda (la mano va y viene)
  { f: 96, d: [165, 120], t: [165, 120] }, // lamento: manos a la cabeza
  { f: 124, d: [60, 70], t: [40, 80] },    // ofrece con las dos
  { f: 150, d: [14, 24], t: [-16, 20] },
];
const pose = (f: number, k: 0 | 1, i: 'd' | 't') => interpolate(f, POSES.map((p) => p.f), POSES.map((p) => p[i][k]), { ...cl, easing: Easing.inOut(Easing.cubic) });
const saludo = (f: number) => (f > 58 && f < 92 ? Math.sin((f - 58) / 4) * 22 : 0);

/** Versión de hoy: interpolación directa. */
const actual = (f: number) => ({ brazo: [pose(f, 0, 'd'), pose(f, 1, 'd') + saludo(f)] as [number, number], brazoAtras: [pose(f, 0, 't'), pose(f, 1, 't')] as [number, number] });
/** Versión mejorada: cada articulación sigue a su pose con un resorte; el codo con retraso (sigue al hombro) y un poquito de rebote. */
const mejorada = (f: number, fps: number) => {
  const suav = (k: 0 | 1, i: 'd' | 't', retraso: number, rigidez: number) => {
    let v = pose(0, k, i);
    for (let j = 1; j < POSES.length; j++) {
      const a = POSES[j - 1], b = POSES[j];
      const p = spring({ frame: f - (b.f - 22) - retraso, fps, config: { damping: 11, stiffness: rigidez, mass: 0.9 } });
      v += (b[i][k] - a[i][k]) * p;
    }
    return v;
  };
  return {
    brazo: [suav(0, 'd', -2, 120), suav(1, 'd', 3, 90) + saludo(f - 3)] as [number, number],
    brazoAtras: [suav(0, 't', 0, 110), suav(1, 't', 4, 85)] as [number, number],
  };
};

export const DemoBrazos: React.FC = () => {
  const f = useCurrentFrame();
  aplicarTema('griegas');
  const A = actual(f), B = mejorada(f, 30);
  const props = { tocado: 'corona' as const, capa: C.purpura, barba: true, s: 1.35 };
  return (
    <AbsoluteFill>
      <Escenario dur={9999}>
        <Suelo />
        <CalidadHD.Provider value={true}>
          <Personaje x={460} {...props} brazo={A.brazo} brazoAtras={A.brazoAtras} />
          <Personaje x={1440} {...props} brazo={B.brazo} brazoAtras={B.brazoAtras} brazoSuave sinSombraBorde />
        </CalidadHD.Provider>
      </Escenario>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <rect x={957} y={126} width={6} height={704} fill={C.negro} opacity={0.7} />
        {[['AHORA', 480], ['BRAZOS + SIN SOMBRA', 1440]].map(([t, x]) => (
          <text key={t} x={x} y={190} textAnchor="middle" fontFamily={TITULO} fontWeight={700} fontSize={46} fill={C.crema} stroke={C.negro} strokeWidth={6} paintOrder="stroke" letterSpacing={5}>{t}</text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
