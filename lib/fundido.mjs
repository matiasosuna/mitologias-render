// Fundido entrada/salida de un cartel entre t0 y t1 (cuadros): rango para interpolate siempre estrictamente creciente.
// Si el tramo es corto el fundido se achica; si dura < 3 cuadros (o t1 <= t0, p. ej. un rótulo con `en`/`hasta` más allá
// de la última frase de la escena), null = no se muestra. Antes: [488, 500, 476, 488] y Remotion cortaba el render.
/** [t0, t0 + fd, t1 - fd, t1] con fd ≤ e, o null si no entra. */
export function rangoFundido(t0, t1, e = 12) {
  if (!(t1 - t0 >= 3)) return null;
  const fd = Math.max(1, Math.min(e, (t1 - t0) / 2 - 0.5));
  return [t0, t0 + fd, t1 - fd, t1];
}
