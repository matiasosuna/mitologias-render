import { readFileSync } from 'node:fs';
export { serieDe, publicados } from './animales-epicos.mjs';
// Personaje viejo (clave genérica o con nombre del elenco) → diseño *_oficial de su mitología.
// Lo usa scripts/personajes-oficiales.mjs para pasar los guiones NO publicados a los diseños oficiales.
// Las claves oficiales válidas por mitología salen de los archivos src/motor/elenco*Oficial.tsx (nada se inventa).

export const ARCHIVOS = {
  griegas: 'elencoGriegoOficial', nordicas: 'elencoNordicoOficial', egipcias: 'elencoEgipcioOficial', hawaianas: 'elencoHawaianoOficial',
  maories: 'elencoMaoriOficial', aztecas: 'elencoAztecaOficial', norteamericanas: 'elencoNorteOficial', hindues: 'elencoHinduOficial', balinesas: 'elencoBalinesOficial',
};

/** Claves *_oficial definidas en cada archivo (por mitología). */
export function clavesOficiales(raiz = '.') {
  const out = {};
  for (const [s, f] of Object.entries(ARCHIVOS)) {
    const txt = readFileSync(`${raiz}/src/motor/${f}.tsx`, 'utf8');
    out[s] = new Set([...txt.matchAll(/^\s+'?([a-z0-9_]+_oficial)'?\s*:/gm)].map((m) => m[1]));
  }
  return out;
}

const v = (base, n) => Array.from({ length: n }, (_, i) => (i ? `${base}_${i + 1}` : base));
/** Extras genéricos: clave vieja → variantes oficiales de esa cultura (sin sufijo _oficial). */
export const GENERICOS = {
  griegas: {
    hombre: v('hombre_griego', 3), joven: v('joven_griego', 2), anciano: v('anciano_griego', 2), mujer: v('mujer_griega', 3),
    anciana: ['anciana_griega'], nino: ['nino_griego'], nina: ['nina_griega'], ninfa: v('ninfa', 3), musa: v('musa', 3),
    guerrero: v('guerrero_griego', 2), rey: v('rey_griego', 2), reina: v('reina_griega', 2), sacerdotisa: v('sacerdotisa_griega', 2),
    sacerdote: ['sacerdote_griego'], gigante: v('gigante_griego', 2), pastor: v('pastor_griego', 2), marinero: v('marinero_griego', 2), pirata: v('pirata', 2),
  },
  nordicas: {
    vikingo: v('vikingo_nordico', 5), hombre: v('hombre_nordico', 4), joven: v('joven_nordico', 2), anciano: v('anciano_nordico', 2),
    mujer: v('mujer_nordica', 3), nino: ['nino_nordico'], nina: ['nina_nordica'], rey: v('rey_nordico', 2), reina: ['reina_nordica'],
    jotun: v('jotun_nordico', 2), enano: v('enano_nordico', 2), valquiria: v('valquiria_nordica', 3), norna: v('norna_nordica', 3),
    anciana: ['anciana_nordica'], pez: ['pez_nordico'], skald: ['skald_nordico'], princesa: ['princesa_nordica'], criada: ['criada_nordica'],
  },
  egipcias: {
    egipcio: ['aldeano_egipcio', 'aldeano_egipcio_b', 'aldeano_egipcio_c'],
    egipcia: ['aldeana_egipcia', 'aldeana_egipcia_b', 'aldeana_egipcia_c'], hombre: ['aldeano_egipcio', 'aldeano_egipcio_b', 'aldeano_egipcio_c'],
    faraon: ['faraon', 'faraon_b'], reina_egipcia: ['reina_egipcia', 'reina_egipcia_b'], sacerdote_egipcio: ['sacerdote_egipcio', 'sacerdote_egipcio_b'],
    escriba: ['escriba', 'escriba_b'], rey: ['rey_extranjero'], nino: ['nino_egipcio'], nina: ['nina_egipcia'], anciano: ['anciano_egipcio'], anciana: ['anciana_egipcia'],
    cocodrilo: ['cocodrilo_egipcio'], escorpion: ['escorpion_egipcio'], pez: ['pez_egipcio'], soldado: ['soldado_egipcio', 'soldado_egipcio_b'],
  },
  hawaianas: {
    hawaiano: ['hawaiano', 'hawaiano_b', 'hawaiano_c'], hawaiana: ['hawaiana', 'hawaiana_b', 'hawaiana_c'], nino: ['nino_hawaiano', 'nino_hawaiano_b'],
    nina: ['nina_hawaiana', 'nina_hawaiana_b'], anciano: ['anciano_hawaiano'], anciana: ['anciana_hawaiana'],
  },
  balinesas: {
    wanita_bali: ['wanita_bali', 'wanita_bali_2'], pria_bali: ['pria_bali', 'pria_bali_2'],
  },
};
/** Pistas por id del actor cuando el `como` es un genérico de género/edad ambiguo (egipcio → soldado, viejo, niño…). */
const EDAD = [[/^(guardia|soldado)/, 'soldado'], [/^(viejo|abuelo|anciano)/, 'anciano'], [/^(vieja|abuela|anciana)/, 'anciana'], [/^(bebe|nino)/, 'nino'], [/^nina/, 'nina']];
export const POR_ID_GENERICO = { egipcias: EDAD, griegas: EDAD.slice(1), nordicas: EDAD.slice(1), hawaianas: EDAD.slice(1) };
/** Solo estos genéricos de persona común cambian de rol por la pista del id (un 'viejo' con como faraon sigue siendo faraón). */
const PERSONA = new Set(['hombre', 'mujer', 'joven', 'egipcio', 'egipcia', 'hawaiano', 'hawaiana']);
/** Casos puntuales: `serie|id|como` (como vacío = no tenía) → clave oficial. */
export const ESPECIALES = {
  'nordicas|grani|anciano': 'hrossharsgrani_oficial', 'nordicas|fafnir|hombre': 'fafnir_hombre_oficial', 'nordicas|helgi|nino': 'helgi_nino_oficial',
  'griegas|dioniso|cabra': 'dioniso_cabrito_oficial', 'griegas|dioniso|leon': 'dioniso_leon_oficial', 'griegas|licaon|lobo': 'licaon_lobo_oficial',
  'griegas|bebe|hefesto': 'hefesto_nino_oficial',
};
/** Casos por carpeta del guion: [serie, regex del dir, id, clave oficial]. */
export const POR_DIR = [['egipcias', /dos-hermanos/, 'anubis', 'anubis_hermano_oficial']];
/** Rótulo que delata un tipo concreto (Persian → persa). */
export const POR_ROTULO = { griegas: [[/persian/i, 'guerrero', 'persa_oficial']] };

const ID_MANDA = new Set(['pirata', 'marinero', 'princesa', 'criada', 'skald']);
const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
export const baseId = (id) => id.replace(/\d+$/, '').replace(/_$/, '');

/**
 * Resuelve la clave oficial de un actor o null. `usadas` = estado de variantes del guion (Map) para repartirlas:
 * el mismo actor siempre da la misma variante y actores distintos del mismo tipo reciben variantes distintas.
 */
export function resolver({ serie, dir, id, como, rotulo, oficiales, usadas }) {
  const ok = oficiales[serie] ?? new Set();
  const key = como ?? id;
  if (key.endsWith('_oficial')) return null;
  for (const [s2, re, i2, res] of POR_DIR) if (s2 === serie && re.test(dir) && id === i2 && ok.has(res)) return res;
  const esp = ESPECIALES[`${serie}|${id}|${como ?? ''}`];
  if (esp && ok.has(esp)) return esp;
  for (const [re, k, res] of POR_ROTULO[serie] ?? []) if (key === k && re.test(rotulo ?? '') && ok.has(res)) return res;
  const gen = GENERICOS[serie] ?? {};
  const deVariantes = new Set(Object.values(gen).flat().map((x) => `${x}_oficial`));
  const tiene = (k) => Object.hasOwn(gen, k);
  // el id manda sobre un genérico ajeno (pirata con como hombre) solo para estos roles
  const k0 = como === undefined ? (tiene(baseId(id)) ? baseId(id) : id) : tiene(como) && ID_MANDA.has(baseId(id)) && tiene(baseId(id)) ? baseId(id) : como;
  const esGenerico = tiene(k0);
  // 1) con nombre: el id del actor (leto, sisifo…) o la clave misma si es un diseño propio (aquiles, helios…)
  const cand = como === undefined && esGenerico ? [] : [`${id}_oficial`, `${baseId(id)}_oficial`, ...(esGenerico ? [] : [`${k0}_oficial`])];
  // si la clave vieja ya es un diseño más específico que el id (rata_toa para el id rata), manda la clave
  if (!esGenerico && como !== undefined && ok.has(`${como}_oficial`) && como !== baseId(id) && como.startsWith(baseId(id))) return `${como}_oficial`;
  for (const c of cand) if (ok.has(c) && !deVariantes.has(c)) return c;
  if (!esGenerico) return null;
  // 2) genérico por rol (con pista del id), variante repartida
  let rol = k0;
  if (PERSONA.has(k0)) for (const [re, r] of POR_ID_GENERICO[serie] ?? []) if (re.test(id) && gen[r]) { rol = r; break; }
  const vars = gen[rol].map((x) => `${x}_oficial`).filter((x) => ok.has(x));
  if (!vars.length) return null;
  const clave = `${dir}|${vars[0]}`, est = usadas.get(clave) ?? { n: 0, por: new Map(), off: hash(clave) % vars.length };
  usadas.set(clave, est);
  if (!est.por.has(id)) est.por.set(id, vars[(est.off + est.n++) % vars.length]);
  return est.por.get(id);
}

/** Pasa un guion a los diseños oficiales (lo modifica). Devuelve los cambios + las claves sin equivalente. */
export function aOficiales(g, dir, serie, oficiales, etiqueta = () => '') {
  const cambios = [], sin = [], usadas = new Map();
  for (const esc of g.escenas ?? []) for (const a of esc.actores ?? []) {
    const viejo = a.como ?? a.id;
    if (!viejo.endsWith('_oficial') && (a.escala ?? 1) < 1.4) {
      const nuevo = resolver({ serie, dir, id: a.id, como: a.como, rotulo: a.rotulo, oficiales, usadas });
      if (nuevo) {
        const teniaComo = a.como !== undefined;
        a.como = nuevo;
        const ev = etiqueta(viejo), en = etiqueta(nuevo);
        let rotulo;
        if (a.rotulo === undefined && ev !== en) a.rotulo = rotulo = ev;
        cambios.push({ texto: `${esc.id}: ${a.id} ${viejo} → ${nuevo}`, tipo: 'como', id: a.id, viejo, nuevo, teniaComo, rotulo });
      } else sin.push({ serie, clave: viejo, id: a.id });
    }
    for (const p of a.pasos ?? []) if (p.en_que && !p.en_que.endsWith('_oficial')) {
      const nuevo = resolver({ serie, dir, id: p.en_que, como: undefined, oficiales, usadas });
      if (nuevo) {
        cambios.push({ texto: `${esc.id}: ${a.id} se transforma en ${p.en_que} → ${nuevo}`, tipo: 'en_que', id: a.id, viejo: p.en_que, nuevo });
        p.en_que = nuevo;
      }
    }
  }
  return { cambios, sin };
}

/** Aplica los cambios sobre el TEXTO del guion (archivos formateados a mano: no se reformatea nada). */
export function parchear(txt, cambios) {
  let pos = 0, ultimo = null;
  const q = (x) => JSON.stringify(x), idq = (c) => `"id": ${q(c.id)}`;
  for (const c of cambios) {
    let i = pos;
    if (c.tipo === 'como' || ultimo !== c.id) { i = txt.indexOf(idq(c), pos); if (i < 0) throw new Error(`no encuentro el actor ${c.id}`); }
    ultimo = c.id;
    if (c.tipo === 'como') {
      const fin = i + idq(c).length, extra = c.rotulo !== undefined ? `, "rotulo": ${q(c.rotulo)}` : '';
      if (c.teniaComo) {
        const j = txt.indexOf(`"como": ${q(c.viejo)}`, fin);
        txt = txt.slice(0, j) + `"como": ${q(c.nuevo)}${extra}` + txt.slice(j + `"como": ${q(c.viejo)}`.length);
      } else txt = txt.slice(0, fin) + `, "como": ${q(c.nuevo)}${extra}` + txt.slice(fin);
      pos = fin;
    } else {
      const j = txt.indexOf(`"en_que": ${q(c.viejo)}`, i);
      if (j < 0) throw new Error(`no encuentro en_que ${c.viejo} de ${c.id}`);
      txt = txt.slice(0, j) + `"en_que": ${q(c.nuevo)}` + txt.slice(j + `"en_que": ${q(c.viejo)}`.length);
      pos = j;
    }
  }
  return txt;
}
