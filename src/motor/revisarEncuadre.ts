// Revisión de encuadre de una escena en los dos formatos (la usa scripts/revisar-encuadre.mjs, empaquetado con esbuild).
import { pistasDeEscena, pistasAjustadas, ajustesEscena, momento } from './Escena';
import { encuadreEscena } from './puestaVertical';
import { revisarHorizontal, revisarVertical, type Aviso, type Ajuste } from './encuadreHorizontal';
import type { Escena as EscenaT, EscenaTL } from './tipos';

export function revisarEscena(esc: EscenaT, tl: EscenaTL, idioma: 'en' | 'es' = 'en'): { avisos: Aviso[]; ajustes: Record<string, Ajuste>; grandes: Record<string, true> } {
  const pistas = pistasDeEscena(esc, tl), aj = ajustesEscena(esc, tl), dur = tl.durationInFrames;
  const rot = (esc.rotulos ?? []).filter((r) => r.estilo !== 'porque').map((r) => ({
    f0: momento(tl, r.en), f1: r.hasta !== undefined ? momento(tl, r.hasta) : dur, x: r.x, y: r.y,
    texto: typeof r.texto === 'string' ? r.texto : r.texto[idioma] ?? r.texto.es,
  }));
  const h = revisarHorizontal(pistas, esc.camara ?? {}, dur, aj, rot);
  const cam = esc.camara ?? {}, de = cam.de ?? 0, a = cam.a ?? de;
  const pa = pistasAjustadas(esc, tl);
  const v = revisarVertical(pa, encuadreEscena(pa, [Math.min(de, a) - 120, Math.max(de, a) + 1920 + 120]));
  const grandes = Object.fromEntries(pistas.filter((p) => p.ajustable).map((p) => [p.id, true as const]));
  return { grandes, avisos: [...h, ...v], ajustes: Object.fromEntries(Object.entries(aj).filter(([, x]) => x.k !== 1 || x.dy || x.dx)) };
}

/** Animales viejos de los guiones griegos → su versión épica (para revisar "qué pasaría" con --epicos y en las pruebas). */
export const EPICO_DE: Record<string, string> = {
  caballo: 'caballo_griego_oficial', pegaso: 'pegaso_oficial', piton: 'piton_oficial', cerbero: 'cerbero_oficial', toro: 'toro_griego_oficial',
  buey: 'buey_griego_oficial', cabra: 'cabra_griega_oficial', lobo: 'lobo_griego_oficial', leon: 'leon_griego_oficial', aguila: 'aguila_griega_oficial',
  delfin: 'delfin_griego_oficial', serpiente: 'serpiente_griega_oficial',
};
export const conEpicos = (esc: EscenaT): EscenaT => ({ ...esc, actores: (esc.actores ?? []).map((a) => (EPICO_DE[a.como ?? a.id] ? { ...a, como: EPICO_DE[a.como ?? a.id] } : a)) });
export { ELENCO, NOMBRE_EN } from './elenco';
