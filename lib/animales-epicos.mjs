import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
// Animal viejo (clave genérica del elenco) → animal épico de cada mitología (bestiasEpicas.tsx).
// Lo usa scripts/animales-epicos.mjs para pasar los guiones NO publicados a los animales épicos.
const GRIEGO = {
  caballo: 'caballo_griego_oficial', pegaso: 'pegaso_oficial', piton: 'piton_oficial', cerbero: 'cerbero_oficial', toro: 'toro_griego_oficial',
  buey: 'buey_griego_oficial', vaca: 'vaca_griega_oficial', mula: 'mula_griega_oficial', cabra: 'cabra_griega_oficial', oveja: 'oveja_griega_oficial',
  carnero: 'carnero_griego_oficial', lobo: 'lobo_griego_oficial', perro: 'perro_griego_oficial', leon: 'leon_griego_oficial', oso: 'oso_griego_oficial',
  ciervo: 'ciervo_griego_oficial', tortuga: 'tortuga_griega_oficial', serpiente: 'serpiente_griega_oficial', aguila: 'aguila_griega_oficial',
  paloma: 'paloma_griega_oficial', cisne: 'cisne_griego_oficial', pavo: 'pavo_real_griego_oficial', pavo_real: 'pavo_real_griego_oficial', buho: 'buho_griego_oficial',
  delfin: 'delfin_griego_oficial', cierva: 'ciervo_griego_oficial', pez: 'pez_griego_oficial',
};
export const MAPA = {
  griegas: GRIEGO,
  nordicas: { caballo: 'caballo_nordico_oficial', lobo: 'lobo_nordico_oficial', cabra: 'cabra_nordica_oficial', ciervo: 'ciervo_nordico_oficial', serpiente: 'serpiente_nordica_oficial', cuervo: 'cuervo_nordico_oficial', aguila: 'aguila_nordica_oficial' },
  egipcias: { caballo: 'caballo_egipcio_oficial', toro: 'toro_egipcio_oficial', buey: 'buey_egipcio_oficial', vaca: 'vaca_egipcia_oficial', perro: 'perro_egipcio_oficial', halcon: 'halcon_egipcio_oficial', serpiente: 'serpiente_egipcia_oficial' },
  hawaianas: { perro: 'ilio_oficial', delfin: 'naia_oficial', buho: 'pueo_oficial' },
  maories: { perro: 'kuri_oficial' },
  aztecas: { perro: 'perro_azteca_oficial' },
  norteamericanas: {
    ciervo: 'ciervo_norte_oficial', oso: 'oso_norte_oficial', lobo: 'lobo_norte_oficial', tortuga: 'tortuga_norte_oficial', aguila: 'aguila_norte_oficial',
    serpiente: 'serpiente_norte_oficial', perro: 'perro_norte_oficial', buho_cornudo: 'buho_norte_oficial', cuervo_negro: 'cuervo_oficial', coyote: 'coyote_oficial',
  },
  hindues: {}, balinesas: {},
};
/** Cuando el id del actor dice otra especie que su `como` (vaca1 con como 'toro', gaviota con 'cuervo'), manda el id. */
export const POR_ID = {
  griegas: { vaca: 'vaca_griega_oficial', ternero: 'vaca_griega_oficial', carnero: 'carnero_griego_oficial' },
  egipcias: { vaca: 'vaca_egipcia_oficial', ternero: 'vaca_egipcia_oficial' },
  nordicas: { gaviota: 'gaviota_nordica_oficial', cuco: 'cuco_nordico_oficial' },
};
/** Serie de un guion por su carpeta (griegas-07-…, short-nordicas-…). */
export const serieDe = (dir) => dir.replace(/^short-/, '').split('-')[0];

/**
 * Pasa un guion a los animales épicos (lo modifica). `etiqueta(clave)` = nombre que muestra el motor (o ''), para no
 * cambiar rótulos. Devuelve la lista de cambios en orden ({ texto, tipo, id, viejo, nuevo, teniaComo, rotulo }).
 */
export function aEpicos(g, serie, etiqueta = () => '') {
  const m = MAPA[serie] ?? {};
  const cambios = [];
  for (const esc of g.escenas ?? []) for (const a of esc.actores ?? []) {
    const viejo = a.como ?? a.id, base = a.id.replace(/[_0-9].*$/, '');
    // el caballo gigante (escala ≥ 1,4) es el de madera de Troya: se deja como está; los demás animales grandes (carnero de Odiseo) sí cambian
    const nuevo = m[viejo] && !((a.escala ?? 1) >= 1.4 && viejo === 'caballo') ? (POR_ID[serie]?.[base] ?? m[viejo]) : undefined;
    if (nuevo) {
      const teniaComo = a.como !== undefined;
      a.como = nuevo;
      // mismo rótulo que antes: si el viejo no tenía nombre y el nuevo sí (o al revés), se fija
      const ev = etiqueta(viejo), en = etiqueta(nuevo);
      let rotulo;
      if (a.rotulo === undefined && ev !== en) a.rotulo = rotulo = ev;
      cambios.push({ texto: `${esc.id}: ${a.id} ${viejo} → ${nuevo}`, tipo: 'como', id: a.id, viejo, nuevo, teniaComo, rotulo });
    }
    for (const p of a.pasos ?? []) if (p.en_que && m[p.en_que]) {
      cambios.push({ texto: `${esc.id}: ${a.id} se transforma en ${p.en_que} → ${m[p.en_que]}`, tipo: 'en_que', id: a.id, viejo: p.en_que, nuevo: m[p.en_que] });
      p.en_que = m[p.en_que];
    }
  }
  return cambios;
}

/** Aplica los cambios sobre el TEXTO del guion (para archivos formateados a mano: no se reformatea nada). */
export function parchear(txt, cambios) {
  let pos = 0;
  const q = (x) => JSON.stringify(x);
  for (const c of cambios) {
    const i = txt.indexOf(`"id": ${q(c.id)}`, c.tipo === 'como' ? pos : Math.max(0, pos - 1));
    if (i < 0) throw new Error(`no encuentro el actor ${c.id}`);
    if (c.tipo === 'como') {
      const fin = i + `"id": ${q(c.id)}`.length;
      let extra = c.rotulo !== undefined ? `, "rotulo": ${q(c.rotulo)}` : '';
      if (c.teniaComo) {
        const j = txt.indexOf(`"como": ${q(c.viejo)}`, fin);
        txt = txt.slice(0, j) + `"como": ${q(c.nuevo)}${extra}` + txt.slice(j + `"como": ${q(c.viejo)}`.length);
      } else txt = txt.slice(0, fin) + `, "como": ${q(c.nuevo)}${extra}` + txt.slice(fin);
      pos = fin;
    } else {
      const j = txt.indexOf(`"en_que": ${q(c.viejo)}`, i);
      txt = txt.slice(0, j) + `"en_que": ${q(c.nuevo)}` + txt.slice(j + `"en_que": ${q(c.viejo)}`.length);
    }
  }
  return txt;
}

/** Publicados = src/videos/youtube-ids.json + out/subidas-*.json (out/ solo existe en la Mac). */
export function publicados() {
  const p = new Set(Object.keys(JSON.parse(readFileSync('src/videos/youtube-ids.json', 'utf8'))));
  if (existsSync('out')) for (const f of readdirSync('out').filter((x) => /^subidas-.*\.json$/.test(x))) for (const x of JSON.parse(readFileSync(join('out', f), 'utf8'))) p.add(typeof x === 'string' ? x : x.id);
  return p;
}
