// Learn Bible 777: número de versículo de cada frase narrada, calculado solo (nada a mano).
// Se recorre el texto KJV palabra por palabra; una frase que coincide entera con el texto que sigue lleva el versículo
// donde arranca (si cruza un límite, el primero). Las frases que no son KJV (intro, comentario, cierre) quedan en null
// y no mueven el puntero.
const palabras = (s) => s.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean);

/** frases: textos narrados en orden; versos: [{ chapter, verse, text }]. Devuelve [{ capitulo, versiculo } | null]. */
export function versiculosDeFrases(frases, versos) {
  const flujo = [];
  for (const v of versos) for (const w of palabras(v.text)) flujo.push({ w, capitulo: v.chapter, versiculo: v.verse });
  let p = 0;
  return frases.map((texto) => {
    const ws = palabras(texto ?? '');
    if (!ws.length || p + ws.length > flujo.length) return null;
    for (let i = 0; i < ws.length; i++) if (flujo[p + i].w !== ws[i]) return null;
    const { capitulo, versiculo } = flujo[p];
    p += ws.length;
    return { capitulo, versiculo };
  });
}

/** Referencia corta para pantalla: "1:3". */
export const referencia = (r) => (r ? `${r.capitulo}:${r.versiculo}` : '');

/** Por escena y frase (misma forma que guion.escenas[].frases), con el idioma de la narración. */
export function versiculosDeGuion(guion, versos, idioma = 'en') {
  const planas = guion.escenas.flatMap((e) => e.frases.map((f) => f[idioma] ?? f.es));
  const refs = versiculosDeFrases(planas, versos);
  let k = 0;
  return guion.escenas.map((e) => e.frases.map(() => refs[k++]));
}

// Zona del texto en el video horizontal: arriba (el cielo) si está libre; si no, abajo (la franja de suelo/agua,
// debajo de los pies de los actores). Ocupan el cielo: rótulos altos, actores que vuelan, la luz de Dios, bandadas,
// tablas y nubes de texto. `esc.versiculo` ("arriba" | "abajo") fuerza la zona.
const ELEMENTOS_CIELO = new Set(['luz_divina', 'bandada', 'tabla_dias', 'ritmo_dias', 'cupula']);
export function zonaVersiculo(esc) {
  if (esc.versiculo === 'arriba' || esc.versiculo === 'abajo') return esc.versiculo;
  const alto = (y) => typeof y === 'number' && y < 480;
  const ocupado = (esc.rotulos ?? []).some((r) => r.y < 480)
    || (esc.actores ?? []).some((a) => alto(a.y))
    || (esc.elementos ?? []).some((e) => ELEMENTOS_CIELO.has(e.tipo) && (e.y ?? 0) < 520);
  return ocupado ? 'abajo' : 'arriba';
}
