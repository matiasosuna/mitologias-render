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
export const FiguraPortada: React.FC<{ quien: unknown; props: Record<string, unknown>; x: number; y: number; s: number; voltear?: boolean }> = ({ quien, props, x, y, s, voltear = false }) => {
  const fi = fichaElenco(quien);
  if (!fi || fi.tipo === 'persona') return <Personaje {...(props as object)} x={x} y={y} s={s} voltear={voltear} accion="parado" />;
  const vuela = fi.tipo === 'ave' || fi.tipo === 'ojo' || (fi.tipo === 'dibujo' && !!fi.p?.vuela);
  const e: Estado = { x, y: vuela ? y - 170 * s : y, s, voltear, opacity: 1, accion: 'parado', volando: vuela, boca: false, rot: 0, brillo: 0, objeto: undefined, temblor: 0 };
  return <DibujarActor ficha={fi} e={e} f={0} />;
};
