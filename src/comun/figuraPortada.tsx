// Figura de portada/miniatura: personas con Personaje; animales y criaturas (delfín, caballo, dragón…) con su propio
// dibujo del elenco (DibujarActor). Antes las portadas pasaban todo por Personaje y un animal salía como muñeco genérico.
import React from 'react';
import { Personaje } from './vasija';
import { ELENCO, DibujarActor, type Ficha, type Estado } from '../motor/elenco';

/** Ficha del elenco detrás de una clave o de { __como: clave, ...ajustes }; null si son props sueltas. */
export const fichaElenco = (x: unknown): Ficha | null => {
  const k = typeof x === 'string' ? x : typeof (x as { __como?: unknown })?.__como === 'string' ? (x as { __como: string }).__como : null;
  return k ? ELENCO[k] ?? null : null;
};
/** ¿Se dibuja como animal/criatura (no como persona)? */
export const esBestia = (x: unknown) => { const f = fichaElenco(x); return !!f && f.tipo !== 'persona'; };

/** props: lo que la portada ya resolvía para Personaje (ficha.p + ajustes del guion). */
/** Lo que ocupa un animal a escala 1, medido desde su x (izq/der sin voltear) y hacia arriba desde el piso. */
// Dibujos cuyo alto de ficha no cuenta los brazos en alto.
const ALTO_REAL: Record<string, number> = { oso_norte_oficial: 780 };
const clave = (x: unknown) => typeof x === 'string' ? x : (x as { __como?: string })?.__como;

const medidas = (fi: Ficha, k0?: string): { alto: number; izq: number; der: number } | null => {
  const p = (fi.p ?? {}) as Record<string, number>;
  const k = p.s ?? 1;
  if (fi.tipo === 'dibujo' && p.alto) return { alto: (k0 && ALTO_REAL[k0]) || p.alto, izq: p.izq ?? p.alto / 2, der: p.der ?? p.alto / 2 };
  if (fi.tipo === 'serpiente' && p.largo) return { alto: (p.alas ? 0.5 : 0.25) * p.largo * k, izq: 1.25 * p.largo * k, der: 0.15 * p.largo * k };
  return null;
};

/** caja: zona libre (sin franja, número ni bordes) donde el animal tiene que entrar entero. */
export const FiguraPortada: React.FC<{ quien: unknown; props: Record<string, unknown>; x: number; y: number; s: number; voltear?: boolean; caja?: { arriba: number; x0: number; x1: number } }> = ({ quien, props, x, y, s, voltear = false, caja }) => {
  const fi = fichaElenco(quien);
  if (!fi || fi.tipo === 'persona') return <Personaje {...(props as object)} x={x} y={y} s={s} voltear={voltear} accion="parado" />;
  const m = medidas(fi, clave(quien));
  if (caja && m) {
    const izq = voltear ? m.der : m.izq, der = voltear ? m.izq : m.der;
    s = Math.min(s, (y - caja.arriba) / m.alto, (caja.x1 - caja.x0) / (izq + der));
    x = Math.min(Math.max(x, caja.x0 + izq * s), caja.x1 - der * s);
  }
  const vuela = fi.tipo === 'ave' || fi.tipo === 'ojo' || (fi.tipo === 'dibujo' && !!fi.p?.vuela);
  const e: Estado = { x, y: vuela ? y - 170 * s : y, s, voltear, opacity: 1, accion: 'parado', volando: vuela, boca: false, rot: 0, brillo: 0, objeto: undefined, temblor: 0 };
  return <DibujarActor ficha={fi} e={e} f={0} />;
};
