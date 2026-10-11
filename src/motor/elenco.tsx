// Elenco fijo: cada clave es un personaje o criatura listo para usar en el guion visual.
// Si una clave no existe, el motor usa un humano genérico; con `props` se ajusta cualquier detalle.
import React, { useContext } from 'react';
import { C, Personaje, PersonajeProps, Borde, CalidadHD } from '../comun/vasija';
import { Cuadrupedo, Serpiente, Ave, Pez, Escorpion, AvePie, Bichito, TipoCuadrupedo } from './bestias';

type Persona = { tipo: 'persona'; p: Partial<PersonajeProps>; griego?: string; extra?: 'minotauro' | 'medusa' | 'ciclope' | 'centauro' | 'alado' };
type Bestia =
  | { tipo: 'cuadrupedo'; animal: TipoCuadrupedo; p?: Record<string, unknown>; griego?: string }
  | { tipo: 'serpiente'; p?: Record<string, unknown>; griego?: string }
  | { tipo: 'ave'; p?: Record<string, unknown>; griego?: string }
  | { tipo: 'pez'; p?: Record<string, unknown>; griego?: string }
  | { tipo: 'ojo'; p?: Record<string, unknown>; griego?: string }
  | { tipo: 'escorpion'; p?: Record<string, unknown>; griego?: string }
  | { tipo: 'avepie'; p?: Record<string, unknown>; griego?: string }
  | { tipo: 'bichito'; p?: Record<string, unknown>; griego?: string };
export type Ficha = Persona | Bestia;

const h = (p: Partial<PersonajeProps>, griego?: string, extra?: Persona['extra']): Persona => ({ tipo: 'persona', p, griego, extra });
const m = (p: Partial<PersonajeProps>, griego?: string, extra?: Persona['extra']): Persona => ({ tipo: 'persona', p: { mujer: true, ...p }, griego, extra });

export const ELENCO: Record<string, Ficha> = {
  // Olímpicos
  zeus: h({ tocado: 'corona', capa: C.purpura, objeto: 'rayo', barba: true }, 'ΖΕΥΣ'),
  hera: m({ tocado: 'corona', objeto: 'cetro', capa: C.purpura }, 'ΗΡΑ'),
  poseidon: h({ objeto: 'tridente', tocado: 'cinta', barba: true }, 'ΠΟΣΕΙΔΩΝ'),
  hades: h({ tocado: 'corona', objeto: 'cetro', capa: C.negro, barba: true, contorno: true }, 'ΑΙΔΗΣ'),
  demeter: m({ tocado: 'velo', objeto: 'antorcha' }, 'ΔΗΜΗΤΗΡ'),
  hestia: m({ tocado: 'velo' }, 'ΕΣΤΙΑ'),
  atenea: m({ tocado: 'casco', objeto: 'lanza', escudo: true, emblema: 'gorgona' }, 'ΑΘΗΝΑ'),
  apolo: h({ barba: false, tocado: 'laurel', objeto: 'lira', ropa: 'larga' }, 'ΑΠΟΛΛΩΝ'),
  artemisa: m({ ropa: 'corta', objeto: 'arco', tocado: 'diadema' }, 'ΑΡΤΕΜΙΣ'),
  ares: h({ ropa: 'armadura', tocado: 'casco', objeto: 'lanza', escudo: true, emblema: 'leon' }, 'ΑΡΗΣ'),
  afrodita: m({ tocado: 'diadema', capa: C.purpura }, 'ΑΦΡΟΔΙΤΗ'),
  hefesto: h({ objeto: 'martillo', ropa: 'corta', tocado: 'petaso', barba: true }, 'ΗΦΑΙΣΤΟΣ'),
  hermes: h({ barba: false, tocado: 'petaso', objeto: 'caduceo', alas: true, capa: C.purpura }, 'ΕΡΜΗΣ'),
  dioniso: h({ objeto: 'tirso', ropa: 'larga', tocado: 'laurel', barba: true }, 'ΔΙΟΝΥΣΟΣ'),
  persefone: m({ tocado: 'diadema', objeto: 'antorcha' }, 'ΠΕΡΣΕΦΟΝΗ'),
  eros: h({ barba: false, ropa: 'desnudo', objeto: 'arco', tocado: null }, 'ΕΡΩΣ', 'alado'),
  helios: h({ barba: false, tocado: 'corona', ropa: 'larga' }, 'ΗΛΙΟΣ'),
  selene: m({ tocado: 'diadema' }, 'ΣΕΛΗΝΗ'),
  eos: m({ tocado: 'diadema' }, 'ΗΩΣ', 'alado'),
  nix: m({ tocado: 'velo', piel: C.negro, contorno: true }, 'ΝΥΞ', 'alado'),
  // Titanes y primordiales
  cronos: h({ tocado: 'corona', objeto: 'hoz', barba: true, canas: true, gigante: true }, 'ΚΡΟΝΟΣ'),
  rea: m({ tocado: 'velo' }, 'ΡΕΑ'),
  gea: m({ tocado: 'diadema', piel: C.blanco }, 'ΓΑΙΑ'),
  urano: h({ tocado: 'corona', barba: true, gigante: true, contorno: true }, 'ΟΥΡΑΝΟΣ'),
  metis: m({ tocado: 'velo' }, 'ΜΗΤΙΣ'),
  temis: m({ tocado: 'diadema' }, 'ΘΕΜΙΣ'),
  atlas: h({ gigante: true, ropa: 'desnudo', barba: true, brazo: [170, 10], brazoAtras: [170, 10] }, 'ΑΤΛΑΣ'),
  prometeo: h({ barba: true, capa: C.purpura, tocado: 'cinta' }, 'ΠΡΟΜΗΘΕΥΣ'),
  epimeteo: h({ barba: true, tocado: null }, 'ΕΠΙΜΗΘΕΥΣ'),
  oceano: h({ barba: true, canas: true, objeto: 'tridente' }, 'ΩΚΕΑΝΟΣ'),
  // Héroes y mortales famosos
  heracles: h({ barba: true, objeto: 'espada', capa: '#9C6A2E', tocado: 'cinta', ropa: 'corta' }, 'ΗΡΑΚΛΗΣ'),
  perseo: h({ barba: false, tocado: 'petaso', alas: true, objeto: 'espada', escudo: true }, 'ΠΕΡΣΕΥΣ'),
  teseo: h({ barba: false, objeto: 'espada', capa: C.purpura }, 'ΘΗΣΕΥΣ'),
  jason: h({ barba: true, objeto: 'lanza', capa: C.purpura }, 'ΙΑΣΩΝ'),
  aquiles: h({ ropa: 'armadura', tocado: 'casco', objeto: 'lanza', escudo: true, emblema: 'gorgona', barba: false }, 'ΑΧΙΛΛΕΥΣ'),
  hector: h({ ropa: 'armadura', tocado: 'casco', objeto: 'lanza', escudo: true, emblema: 'trisquel' }, 'ΕΚΤΩΡ'),
  agamenon: h({ ropa: 'armadura', tocado: 'corona', objeto: 'cetro', barba: true }, 'ΑΓΑΜΕΜΝΩΝ'),
  menelao: h({ ropa: 'armadura', tocado: 'casco', objeto: 'lanza', escudo: true, barba: true }, 'ΜΕΝΕΛΑΟΣ'),
  odiseo: h({ barba: true, tocado: 'petaso', objeto: 'lanza' }, 'ΟΔΥΣΣΕΥΣ'),
  paris: h({ barba: false, tocado: 'petaso', objeto: 'arco' }, 'ΠΑΡΙΣ'),
  priamo: h({ barba: true, canas: true, tocado: 'corona', ropa: 'larga', objeto: 'cetro' }, 'ΠΡΙΑΜΟΣ'),
  helena: m({ tocado: 'velo' }, 'ΕΛΕΝΗ'),
  penelope: m({ tocado: 'velo' }, 'ΠΗΝΕΛΟΠΗ'),
  andromaca: m({ tocado: 'velo' }, 'ΑΝΔΡΟΜΑΧΗ'),
  casandra: m({ tocado: 'laurel' }, 'ΚΑΣΣΑΝΔΡΑ'),
  medea: m({ tocado: 'diadema', capa: C.purpura }, 'ΜΗΔΕΙΑ'),
  ariadna: m({ tocado: 'diadema' }, 'ΑΡΙΑΔΝΗ'),
  orfeo: h({ barba: false, objeto: 'lira', tocado: 'laurel', ropa: 'larga' }, 'ΟΡΦΕΥΣ'),
  euridice: m({ tocado: 'velo' }, 'ΕΥΡΥΔΙΚΗ'),
  pandora: m({ tocado: 'diadema' }, 'ΠΑΝΔΩΡΑ'),
  edipo: h({ barba: true, objeto: 'lanza', tocado: 'petaso' }, 'ΟΙΔΙΠΟΥΣ'),
  antigona: m({ tocado: 'velo' }, 'ΑΝΤΙΓΟΝΗ'),
  dedalo: h({ barba: true, canas: true, objeto: 'martillo' }, 'ΔΑΙΔΑΛΟΣ'),
  icaro: h({ barba: false, ropa: 'corta' }, 'ΙΚΑΡΟΣ', 'alado'),
  minos: h({ barba: true, tocado: 'corona', objeto: 'cetro', ropa: 'larga' }, 'ΜΙΝΩΣ'),
  midas: h({ barba: true, tocado: 'corona', ropa: 'larga' }, 'ΜΙΔΑΣ'),
  narciso: h({ barba: false, tocado: 'cinta' }, 'ΝΑΡΚΙΣΣΟΣ'),
  eco: m({ tocado: null }, 'ΗΧΩ'),
  psique: m({ tocado: 'diadema' }, 'ΨΥΧΗ'),
  aracne: m({ tocado: null }, 'ΑΡΑΧΝΗ'),
  tiresias: h({ barba: true, canas: true, ropa: 'larga', objeto: 'cetro', ojosCerrados: true }, 'ΤΕΙΡΕΣΙΑΣ'),
  caronte: h({ barba: true, canas: true, tocado: 'petaso', contorno: true, objeto: 'lanza' }, 'ΧΑΡΩΝ'),
  // Genéricos
  // Hawaianos (tema kapa: piel, lei y kapa vienen del tema; colores literales porque C cambia con el tema)
  kane: h({ barba: true, capa: '#E8B81C', objeto: 'cetro' }, 'KĀNE'),
  ku: h({ barba: true, tocado: 'mahiole', capa: '#B2331F', objeto: 'lanza' }, 'KŪ'),
  lono: h({ barba: true, capa: '#F4E6C8', objeto: 'cetro' }, 'LONO'),
  kanaloa: h({ barba: true, piel: '#3E6670', capa: '#1E6E7E' }, 'KANALOA'),
  wakea: h({ barba: true, capa: '#24406A' }, 'WĀKEA'),
  papa: m({ tocado: 'haku', capa: '#6B3F1D' }, 'PAPAHĀNAUMOKU'),
  haumea: m({ tocado: 'haku', objeto: 'batidor' }, 'HAUMEA'),
  hina: m({ tocado: 'haku', objeto: 'batidor' }, 'HINA'),
  hoohokukalani: m({ tocado: 'haku', estrellado: true }, 'HOʻOHŌKŪKALANI'),
  haloa: h({ barba: false, cuerpo: 'nino' }, 'HĀLOA'),
  maui: h({ barba: false, objeto: 'anzuelo', s: 0.95 }, 'MĀUI'),
  akalana: h({ barba: true, cuerpo: 'viejo' }, 'AKALANA'),
  hawaiano: h({ barba: false }),
  hawaiana: m({}),
  pescador: h({ barba: false, objeto: 'hoe' }),
  alii: h({ barba: true, tocado: 'mahiole', capa: '#E8B81C', objeto: 'lanza' }, 'ALIʻI'),
  kahuna: h({ barba: true, cuerpo: 'viejo', ropa: 'larga', capa: '#F4E6C8' }, 'KAHUNA'),
  pele: m({ pelo: '#7A1E10', capa: '#B2331F' }, 'PELE'),
  hiiaka: m({ tocado: 'haku' }, 'HIʻIAKA'),
  namaka: m({ piel: '#2C8C96', capa: '#86CFCF' }, 'NĀMAKA'),
  poliahu: m({ capa: '#FFFFFF', pelo: '#2B3A4A' }, 'POLIʻAHU'),
  kamapuaa: h({ barba: true, piel: '#5A3A2A', cuerpo: 'gordo' }, 'KAMAPUAʻA'),
  alae: { tipo: 'avepie', p: { especie: 'gallineta', color: '#1A1410', s: 0.75 }, griego: 'ʻALAE' },
  alae_roja: { tipo: 'avepie', p: { especie: 'gallineta', color: '#1A1410', s: 0.75, frente: '#C8321E' }, griego: 'ʻALAE' }, // después de que Māui le quema la frente
  puaa: { tipo: 'cuadrupedo', animal: 'jabali', griego: 'PUAʻA' },
  honu: { tipo: 'bichito', p: { especie: 'honu' }, griego: 'HONU' },
  moo: { tipo: 'bichito', p: { especie: 'moo' }, griego: 'MOʻO' },
  rata: { tipo: 'bichito', p: { especie: 'rata' }, griego: 'ʻIOLE' },
  ilio: { tipo: 'cuadrupedo', animal: 'perro', griego: 'ʻĪLIO' },
  // Norteamericanos (tema pintado). Cada pueblo con su ropa: gustoweh haudenosaunee (plumas según la nación),
  // sombrero tejido de la costa noroeste, pluma atrás en las Llanuras y el Plateau; el tocado de plumas solo para
  // jefes de las Llanuras. Piel morena natural del tema (colores literales porque C cambia con el tema).
  mujer_cielo: m({ pelo: '#1A1410', capa: '#7FB0C8' }, 'SKY WOMAN'),
  jefe_cielo: h({ capa: '#2F5D8A', tocado: 'cintaTejida', trenzas: true }, 'SKY CHIEF'),
  gente_cielo: h({ capa: '#7FB0C8', tocado: 'cintaTejida' }),
  gente_cielo_mujer: m({ capa: '#E9D4A8' }),
  hija_cielo: m({ capa: '#D9A23A' }, 'THE DAUGHTER'),
  brote: h({ capa: '#4E7A3A', tocado: 'cintaTejida' }, 'SAPLING'),
  pedernal: h({ capa: '#3A3A44', tocado: 'roach', piel: '#6E5446' }, 'FLINT'),
  haudenosaunee: h({ tocado: 'gustoweh', nacion: 'mohawk' }),
  haudenosaunee_mujer: m({}),
  cherokee: h({ tocado: 'plumaAtras' }),
  cherokee_mujer: m({}),
  anishinaabe: h({ tocado: 'cintaTejida' }),
  anishinaabe_mujer: m({}),
  tlingit: h({ tocado: 'sombreroCesteria', capa: '#7A1E1E' }),
  tlingit_mujer: m({ tocado: 'sombreroCesteria', capa: '#1E2A4A' }),
  haida: h({ tocado: 'sombreroCesteria', capa: '#1E2A4A' }),
  haida_mujer: m({ tocado: 'sombreroCesteria', capa: '#7A1E1E' }),
  lakota: h({ tocado: 'plumaAtras', trenzas: true }),
  lakota_mujer: m({}),
  jefe_lakota: h({ tocado: 'tocadoPlumas', trenzas: true, capa: '#E9D4A8' }),
  nimiipuu: h({ tocado: 'plumaAtras', trenzas: true }),
  nimiipuu_mujer: m({}),
  anciano_nativo: h({ cuerpo: 'viejo', canas: true, capa: '#7A4A28', trenzas: true }),
  anciana_nativa: m({ cuerpo: 'viejo', canas: true }),
  nanabozho: h({ tocado: 'cintaTejida', capa: '#4E7A3A', trenzas: true }, 'NANABOZHO'),
  gran_tortuga: { tipo: 'bichito', p: { especie: 'tortuga', s: 2.6 }, griego: 'GREAT TURTLE' },
  tortuga: { tipo: 'bichito', p: { especie: 'tortuga' }, griego: 'TURTLE' },
  rata_almizclera: { tipo: 'bichito', p: { especie: 'rata', color: '#5A4030', s: 1.3 }, griego: 'MUSKRAT' },
  castor: { tipo: 'bichito', p: { especie: 'castor', s: 1.4 }, griego: 'BEAVER' },
  nutria: { tipo: 'bichito', p: { especie: 'nutria', s: 1.3 }, griego: 'OTTER' },
  colimbo: { tipo: 'avepie', p: { especie: 'colimbo', s: 0.9 }, griego: 'LOON' },
  ganso_salvaje: { tipo: 'ave', p: { color: '#EDE8DC', ala2: '#CFC6B4', pico: '#2A2A2A', s: 0.7 }, griego: 'GOOSE' },
  cuervo_negro: { tipo: 'ave', p: { color: '#15161A', ala2: '#2A2C34', pico: '#15161A', s: 0.75 }, griego: 'RAVEN' },
  zopilote: { tipo: 'ave', p: { color: '#2A2420', ala2: '#3A302A', pico: '#C8321E', s: 1.1 }, griego: 'GREAT BUZZARD' },
  coyote: { tipo: 'cuadrupedo', animal: 'lobo', p: { color: '#B08850' }, griego: 'COYOTE' },
  arana_agua: { tipo: 'bichito', p: { especie: 'arana', s: 1.2 }, griego: 'WATER SPIDER' },
  abuela_arana: { tipo: 'bichito', p: { especie: 'arana', color: '#5A4A3A', s: 1.3 }, griego: 'GRANDMOTHER SPIDER' },
  escarabajo_agua: { tipo: 'bichito', p: { especie: 'escarabajo', s: 1.2 }, griego: 'WATER BEETLE' },
  hombre: h({ barba: true }),
  joven: h({ barba: false }),
  anciano: h({ barba: true, canas: true, ropa: 'larga', objeto: 'cetro' }),
  mujer: m({}),
  anciana: m({ tocado: 'velo', canas: true }),
  ninfa: m({ tocado: 'diadema', ropa: 'larga' }),
  guerrero: h({ ropa: 'armadura', tocado: 'casco', objeto: 'lanza', escudo: true }),
  rey: h({ tocado: 'corona', objeto: 'cetro', ropa: 'larga', barba: true }),
  reina: m({ tocado: 'corona' }),
  sacerdotisa: m({ tocado: 'laurel', ropa: 'larga' }),
  pastor: h({ tocado: 'petaso', objeto: 'cetro' }),
  nino: h({ barba: false, s: 0.6 }),
  nina: m({ s: 0.6 }),
  gigante: h({ gigante: true, ropa: 'desnudo', barba: true, boca: true }),
  titan: h({ gigante: true, barba: true, objeto: 'lanza' }),
  ciclope: h({ gigante: true, ropa: 'desnudo', barba: true }, 'ΚΥΚΛΩΨ', 'ciclope'),
  hecatonquiro: h({ gigante: true, ropa: 'desnudo', barba: true }),
  minotauro: h({ gigante: true, ropa: 'corta', barba: false }, 'ΜΙΝΩΤΑΥΡΟΣ', 'minotauro'),
  medusa: m({ tocado: null, boca: true }, 'ΜΕΔΟΥΣΑ', 'medusa'),
  gorgona: m({ tocado: null, boca: true }, 'ΓΟΡΓΩ', 'medusa'),
  centauro: h({ barba: true, objeto: 'arco' }, 'ΚΕΝΤΑΥΡΟΣ', 'centauro'),
  quiron: h({ barba: true, canas: true, objeto: 'lira' }, 'ΧΕΙΡΩΝ', 'centauro'),
  furia: m({ tocado: null, piel: C.negro, contorno: true }, 'ΕΡΙΝΥΣ', 'alado'),
  musa: m({ objeto: 'lira', tocado: 'laurel' }, 'ΜΟΥΣΑ'),
  // Nórdicos (Æsir, Vanir, gigantes y criaturas)
  odin: h({ tocado: 'sombrero', tuerto: true, objeto: 'lanza', capa: '#2B4660', barba: true, canas: true }, 'ODIN'),
  frigg: m({ tocado: 'velo', objeto: 'cetro' }, 'FRIGG'),
  thor: h({ tocado: 'yelmo', objeto: 'mjolnir', barba: true, pelo: '#B5452A', capa: C.purpura, gigante: true }, 'THOR'),
  sif: m({ tocado: 'diadema', pelo: '#E9C46A' }, 'SIF'),
  loki: h({ barba: false, tocado: null, capa: '#3E6B4E', pelo: '#B5452A' }, 'LOKI'),
  baldr: h({ barba: false, tocado: 'corona', ropa: 'larga', pelo: '#E9C46A' }, 'BALDR'),
  hodr: h({ barba: true, ojosCerrados: true, ropa: 'larga' }, 'HODR'),
  tyr: h({ tocado: 'yelmo', objeto: 'espada', escudo: true, emblema: 'nudo', barba: true }, 'TYR'),
  heimdall: h({ tocado: 'yelmo', objeto: 'cuerno', ropa: 'armadura', barba: false }, 'HEIMDALL'),
  freyja: m({ tocado: 'diadema', capa: '#E9C46A', pelo: '#E9C46A' }, 'FREYJA'),
  freyr: h({ tocado: 'cinta', objeto: 'espada', barba: true, pelo: '#E9C46A' }, 'FREYR'),
  njord: h({ tocado: 'cinta', barba: true, canas: true, objeto: 'lanza' }, 'NJORD'),
  idun: m({ tocado: 'diadema', objeto: 'manzana' }, 'IDUN'),
  bragi: h({ barba: true, canas: true, objeto: 'lira' }, 'BRAGI'),
  hel: m({ tocado: 'velo', piel: '#4E6E8A', contorno: true }, 'HEL'),
  mimir: h({ barba: true, canas: true, ropa: 'larga' }, 'MIMIR'),
  ymir: h({ gigante: true, barba: true, canas: true, ropa: 'desnudo', piel: '#4E6E8A', s: 1.35 }, 'YMIR'),
  buri: h({ barba: true, canas: true, ropa: 'larga' }, 'BURI'),
  bor: h({ barba: true, ropa: 'larga' }, 'BOR'),
  vili: h({ barba: true, objeto: 'lanza' }, 'VILI'),
  ve: h({ barba: true, objeto: 'hacha' }, 'VE'),
  ask: h({ ropa: 'desnudo', barba: false }, 'ASK'),
  embla: m({ tocado: null }, 'EMBLA'),
  jotun: h({ gigante: true, barba: true, ropa: 'corta', objeto: 'hacha', s: 1.5 }, 'JOTUN'),
  gigante_hielo: h({ gigante: true, barba: true, canas: true, piel: '#4E6E8A', ropa: 'desnudo', s: 1.6 }, 'FROST GIANT'),
  surtr: h({ gigante: true, barba: true, objeto: 'espada', piel: '#7A2418', contorno: true, s: 1.7 }, 'SURTR'),
  skadi: m({ ropa: 'corta', objeto: 'arco', tocado: 'cinta' }, 'SKADI'),
  angrboda: m({ tocado: 'velo', piel: '#4E6E8A' }, 'ANGRBODA'),
  enano: h({ barba: true, objeto: 'martillo', s: 0.6, gigante: true }, 'DWARF'),
  valquiria: m({ tocado: 'yelmoAlas', objeto: 'lanza', escudo: true, emblema: 'valknut', ropa: 'armadura' }, 'VALKYRIE'),
  norna: m({ tocado: 'velo', canas: true }, 'NORN'),
  vikingo: h({ tocado: 'yelmo', objeto: 'hacha', escudo: true, emblema: 'nudo', barba: true }, 'VIKING'),
  fenrir: { tipo: 'cuadrupedo', animal: 'lobo', p: { s: 1.8, boca: true }, griego: 'FENRIR' },
  lobo_gigante: { tipo: 'cuadrupedo', animal: 'lobo', p: { s: 1.4 } },
  sleipnir: { tipo: 'cuadrupedo', animal: 'caballo', p: { color: '#5E7F99', ochoPatas: true }, griego: 'SLEIPNIR' },
  audhumla: { tipo: 'cuadrupedo', animal: 'buey', p: { color: '#3E5A73', s: 1.5 }, griego: 'AUDHUMLA' },
  jormungandr: { tipo: 'serpiente', p: { largo: 900, grosor: 80, boca: true, s: 1.3 }, griego: 'JORMUNGANDR' },
  nidhogg: { tipo: 'serpiente', p: { largo: 600, grosor: 60, patas: true, alas: true, dragon: true, boca: true }, griego: 'NIDHOGG' },
  cuervo: { tipo: 'ave', p: { s: 0.6 } },
  huginn: { tipo: 'ave', p: { s: 0.6 }, griego: 'HUGINN' },
  muninn: { tipo: 'ave', p: { s: 0.6 }, griego: 'MUNINN' },
  // Egipcios (enéada, Osiris, Duat). Piel por defecto: hombres ocre rojo, mujeres ocre amarillo.
  ra: h({ cabezaAnimal: 'halcon', tocado: 'disco', objeto: 'was', ropa: 'corta' }, 'RA'),
  atum: h({ tocado: 'doble', objeto: 'ankh', barbaPostiza: true }, 'ATUM'),
  shu: h({ tocado: 'pluma', objeto: 'ankh' }, 'SHU'),
  tefnut: m({ cabezaAnimal: 'leona', tocado: 'disco', objeto: 'was' }, 'TEFNUT'),
  geb: h({ piel: '#3F7A4E', tocado: 'roja', barbaPostiza: true }, 'GEB'),
  nut: m({ piel: '#2D5BA8', estrellado: true, tocado: 'peluca' }, 'NUT'),
  osiris: h({ piel: '#3F8A5C', tocado: 'atef', objeto: 'cayado', ropa: 'larga', barbaPostiza: true }, 'OSIRIS'),
  isis: m({ tocado: 'trono', objeto: 'ankh', alas: false }, 'ISIS'),
  set: h({ cabezaAnimal: 'set', objeto: 'was', ropa: 'corta' }, 'SET'),
  neftis: m({ tocado: 'peluca', objeto: 'ankh' }, 'NEPHTHYS'),
  horus_nino: h({ barba: false, ropa: 'desnudo', tocado: null, collar: true, trenza: true, s: 0.5, brazo: [150, 150] }, 'HORUS'),
  hipopotamo: { tipo: 'cuadrupedo', animal: 'hipopotamo', p: { color: '#6E5A6E' }, griego: 'HIPPOPOTAMUS' },
  escorpion: { tipo: 'escorpion', griego: 'SCORPION' },
  ganso: { tipo: 'avepie', p: { especie: 'ganso' }, griego: 'GOOSE' },
  pelicano: { tipo: 'avepie', p: { especie: 'pelicano' }, griego: 'PELICAN' },
  serket: m({ tocado: 'peluca', objeto: 'ankh', cabezaAnimal: undefined }, 'SERQET'),
  neit: m({ tocado: 'roja', objeto: 'arco' }, 'NEITH'),
  horus: h({ cabezaAnimal: 'halcon', tocado: 'doble', objeto: 'lanza' }, 'HORUS'),
  thoth: h({ cabezaAnimal: 'ibis', objeto: 'cana', ropa: 'corta' }, 'THOTH'),
  anubis: h({ cabezaAnimal: 'chacal', objeto: 'was' }, 'ANUBIS'),
  sekhmet: m({ cabezaAnimal: 'leona', tocado: 'disco', ropa: 'larga', piel: '#C8862E' }, 'SEKHMET'),
  hathor: m({ tocado: 'cuernosDisco', objeto: 'ankh' }, 'HATHOR'),
  maat: m({ tocado: 'pluma', objeto: 'ankh' }, 'MAAT'),
  amon: h({ piel: '#2D5BA8', tocado: 'plumas', objeto: 'was', barbaPostiza: true }, 'AMUN'),
  ptah: h({ piel: '#3F8A5C', tocado: 'peluca', objeto: 'was', ropa: 'larga', barbaPostiza: true }, 'PTAH'),
  khnum: h({ cabezaAnimal: 'carnero', objeto: 'was' }, 'KHNUM'),
  sobek: h({ cabezaAnimal: 'cocodrilo', objeto: 'was' }, 'SOBEK'),
  bastet: m({ cabezaAnimal: 'leona', piel: '#E2AC52', tocado: null }, 'BASTET'),
  faraon: h({ tocado: 'nemes', objeto: 'cayado', barbaPostiza: true }, 'PHARAOH'),
  reina_egipcia: m({ tocado: 'cuernosDisco' }, 'QUEEN'),
  sacerdote_egipcio: h({ tocado: null, ropa: 'larga', objeto: 'ankh' }, 'PRIEST'),
  escriba: h({ objeto: 'cana' }, 'SCRIBE'),
  egipcio: h({}),
  egipcia: m({}),
  momia: h({ piel: '#E9DFC6', ropa: 'larga', tocado: null }, 'MUMMY'),
  apofis: { tipo: 'serpiente', p: { largo: 1000, grosor: 80, boca: true, s: 1.3, color: '#3A2A4E', manchas: true, erguida: 0.9 }, griego: 'APEP' },
  cocodrilo: { tipo: 'serpiente', p: { largo: 360, grosor: 60, patas: true, color: '#4E7A3A' } },
  ammit: { tipo: 'cuadrupedo', animal: 'leon', p: { color: '#7A5A2A', boca: true }, griego: 'AMMIT' },
  ojo_ra: { tipo: 'ojo', p: { s: 0.6 }, griego: 'EYE OF RA' },
  bennu: { tipo: 'ave', p: { s: 0.8, color: '#6E8FA8' }, griego: 'BENNU' },
  halcon: { tipo: 'ave', p: { s: 0.6, color: '#5B4A3A' } },
  vaca_celeste: { tipo: 'cuadrupedo', animal: 'buey', p: { color: '#2D5BA8', s: 1.6 }, griego: 'MEHET-WERET' },
  // Bestias
  leon: { tipo: 'cuadrupedo', animal: 'leon' },
  toro: { tipo: 'cuadrupedo', animal: 'toro' },
  buey: { tipo: 'cuadrupedo', animal: 'buey' },
  caballo: { tipo: 'cuadrupedo', animal: 'caballo' },
  pegaso: { tipo: 'cuadrupedo', animal: 'caballo', p: { alas: true }, griego: 'ΠΗΓΑΣΟΣ' },
  perro: { tipo: 'cuadrupedo', animal: 'perro' },
  cerbero: { tipo: 'cuadrupedo', animal: 'perro', p: { cabezas: 3, s: 1.6, colaSerpiente: true, boca: true }, griego: 'ΚΕΡΒΕΡΟΣ' },
  lobo: { tipo: 'cuadrupedo', animal: 'lobo' },
  jabali: { tipo: 'cuadrupedo', animal: 'jabali' },
  ciervo: { tipo: 'cuadrupedo', animal: 'ciervo' },
  cierva: { tipo: 'cuadrupedo', animal: 'ciervo', p: { color: '#B8862E' } },
  cabra: { tipo: 'cuadrupedo', animal: 'cabra' },
  oveja: { tipo: 'cuadrupedo', animal: 'oveja' },
  oso: { tipo: 'cuadrupedo', animal: 'oso' },
  esfinge: { tipo: 'cuadrupedo', animal: 'leon', p: { alas: true, cabezaHumana: true }, griego: 'ΣΦΙΓΞ' },
  quimera: { tipo: 'cuadrupedo', animal: 'leon', p: { cabezas: 2, colaSerpiente: true, boca: true }, griego: 'ΧΙΜΑΙΡΑ' },
  serpiente: { tipo: 'serpiente' },
  piton: { tipo: 'serpiente', p: { largo: 700, grosor: 56, boca: true }, griego: 'ΠΥΘΩΝ' },
  dragon: { tipo: 'serpiente', p: { largo: 600, grosor: 60, patas: true, alas: true, dragon: true, boca: true }, griego: 'ΔΡΑΚΩΝ' },
  hidra: { tipo: 'serpiente', p: { largo: 360, grosor: 70, cuellos: 7, boca: true }, griego: 'ΥΔΡΑ' },
  tifon: { tipo: 'serpiente', p: { largo: 800, grosor: 90, cuellos: 9, alas: true, dragon: true, boca: true, s: 1.4 }, griego: 'ΤΥΦΩΝ' },
  monstruo_marino: { tipo: 'serpiente', p: { largo: 700, grosor: 70, dragon: true, boca: true }, griego: 'ΚΗΤΟΣ' },
  aguila: { tipo: 'ave' },
  arpia: { tipo: 'ave', p: { cabezaHumana: true }, griego: 'ΑΡΠΥΙΑ' },
  sirena: { tipo: 'ave', p: { cabezaHumana: true }, griego: 'ΣΕΙΡΗΝ' },
  buho: { tipo: 'ave', p: { s: 0.5 } },
  pez: { tipo: 'pez' },
  delfin: { tipo: 'pez', p: { delfin: true } },
};

/** Nombre en pantalla por idioma (por ahora inglés; si falta, el griego). */
export const NOMBRE_EN: Record<string, string> = {"zeus": "ZEUS", "hera": "HERA", "poseidon": "POSEIDON", "hades": "HADES", "demeter": "DEMETER", "hestia": "HESTIA", "atenea": "ATHENA", "apolo": "APOLLO", "artemisa": "ARTEMIS", "ares": "ARES", "afrodita": "APHRODITE", "hefesto": "HEPHAESTUS", "hermes": "HERMES", "dioniso": "DIONYSUS", "persefone": "PERSEPHONE", "eros": "EROS", "helios": "HELIOS", "selene": "SELENE", "eos": "EOS", "nix": "NYX", "cronos": "CRONUS", "rea": "RHEA", "gea": "GAIA", "urano": "URANUS", "metis": "METIS", "temis": "THEMIS", "atlas": "ATLAS", "prometeo": "PROMETHEUS", "epimeteo": "EPIMETHEUS", "oceano": "OCEANUS", "heracles": "HERACLES", "perseo": "PERSEUS", "teseo": "THESEUS", "jason": "JASON", "aquiles": "ACHILLES", "hector": "HECTOR", "agamenon": "AGAMEMNON", "menelao": "MENELAUS", "odiseo": "ODYSSEUS", "paris": "PARIS", "priamo": "PRIAM", "helena": "HELEN", "penelope": "PENELOPE", "andromaca": "ANDROMACHE", "casandra": "CASSANDRA", "medea": "MEDEA", "ariadna": "ARIADNE", "orfeo": "ORPHEUS", "euridice": "EURYDICE", "pandora": "PANDORA", "edipo": "OEDIPUS", "antigona": "ANTIGONE", "dedalo": "DAEDALUS", "icaro": "ICARUS", "minos": "MINOS", "midas": "MIDAS", "narciso": "NARCISSUS", "eco": "ECHO", "psique": "PSYCHE", "aracne": "ARACHNE", "tiresias": "TIRESIAS", "caronte": "CHARON", "ciclope": "CYCLOPS", "minotauro": "MINOTAUR", "medusa": "MEDUSA", "gorgona": "GORGON", "centauro": "CENTAUR", "quiron": "CHIRON", "furia": "FURY", "musa": "MUSE", "pegaso": "PEGASUS", "cerbero": "CERBERUS", "esfinge": "SPHINX", "quimera": "CHIMERA", "piton": "PYTHON", "dragon": "DRAGON", "hidra": "HYDRA", "tifon": "TYPHON", "monstruo_marino": "SEA MONSTER", "arpia": "HARPY", "sirena": "SIREN"};

export type Estado = {
  x: number; y: number; s: number; voltear: boolean; opacity: number;
  accion: 'parado' | 'caminar' | 'correr'; volando: boolean;
  brazo?: [number, number]; brazoAtras?: [number, number];
  boca: boolean; rot: number; brillo: number; objeto?: string | null; temblor: number;
  arrodillado?: number; sentado?: number;
  expresion?: PersonajeProps['expresion']; inclinar?: number; cabeza?: number; cabezaGiro?: number; hablando?: boolean;
  aparicion?: { con: string; t0: number; sale: boolean };
};

/** Dibuja la ficha del elenco con el estado actual del actor. */
export const DibujarActor: React.FC<{ ficha: Ficha; e: Estado; props?: Record<string, unknown>; f: number }> = ({ ficha, e, props = {}, f }) => {
  const hd = useContext(CalidadHD);
  const tx = e.temblor ? Math.sin(f * 1.7) * e.temblor * 4 : 0;
  const base = { x: e.x + tx, y: e.y, voltear: e.voltear, opacity: e.opacity };
  let cuerpo: React.ReactNode;
  if (ficha.tipo === 'persona') {
    const p = { ...ficha.p, ...props } as Partial<PersonajeProps> & { s?: number };
    const s = e.s * (p.s ?? 1);
    const pp: PersonajeProps = { ...p, ...base, s, accion: e.accion, boca: e.boca || p.boca, brazo: e.brazo ?? p.brazo, brazoAtras: e.brazoAtras ?? p.brazoAtras, objeto: (e.objeto === undefined ? p.objeto : e.objeto) as PersonajeProps['objeto'], arrodillado: e.arrodillado ?? p.arrodillado, sentado: e.sentado ?? p.sentado, expresion: e.expresion ?? p.expresion, inclinar: (e.inclinar || p.inclinar !== undefined) ? (p.inclinar ?? 0) + (e.inclinar ?? 0) : undefined, cabeza: (e.cabeza || p.cabeza !== undefined) ? (p.cabeza ?? 0) + (e.cabeza ?? 0) : undefined, cabezaGiro: e.cabezaGiro };
    const cab = { x: base.x + (e.voltear ? -1 : 1) * 20 * s * (p.gigante ? 1.35 : 1), y: base.y - 334 * s };
    const k = (e.voltear ? -1 : 1) * s;
    cuerpo = (
      <g transform={e.rot ? `rotate(${e.rot} ${base.x} ${base.y})` : undefined}>
        {ficha.extra === 'alado' && (
          <g transform={`translate(${base.x} ${base.y - 290 * s}) scale(${k} ${s}) rotate(${Math.sin(f * 0.3) * 12})`} opacity={e.opacity}>
            <path d="M-10 0 C -40 -60, -100 -90, -150 -90 C -126 -70, -122 -58, -130 -44 C -104 -50, -92 -40, -88 -26 C -62 -30, -40 -20, -10 20 Z" fill={C.purpura} stroke={C.negro} strokeWidth={3} />
          </g>
        )}
        {ficha.extra === 'centauro' ? (() => {
          const dir = e.voltear ? -1 : 1, hx = base.x - dir * 50 * s, cad = base.y - 165 * s;
          const id = `cen${Math.round(base.x)}${Math.round(base.y)}`;
          return (
            <>
              <defs><clipPath id={id}><rect x={base.x - 600} y={base.y - 2000} width={1200} height={2000 - 165 * s + 14 * s} /></clipPath></defs>
              <Cuadrupedo tipo="caballo" x={hx} y={base.y} s={s} voltear={e.voltear} moviendo={e.accion !== 'parado'} corriendo={e.accion === 'correr'} opacity={e.opacity} />
              <g clipPath={`url(#${id})`}><Personaje {...pp} x={base.x + dir * 70 * s} y={cad + 176 * s} ropa="desnudo" accion="parado" /></g>
            </>
          );
        })() : (
          <Personaje {...pp} />
        )}
        {ficha.extra === 'ciclope' && (
          <g transform={`translate(${cab.x} ${cab.y}) scale(${k} ${s})`} opacity={e.opacity}>
            <circle cx={14} cy={-8} r={11} fill={C.crema} stroke={C.negro} strokeWidth={2} />
            <circle cx={17} cy={-8} r={5} fill={C.negro} />
          </g>
        )}
        {ficha.extra === 'minotauro' && (
          <g transform={`translate(${cab.x} ${cab.y + 10 * s}) scale(${k * 1.3} ${s * 1.3})`} opacity={e.opacity}>
            <path d="M-30 30 C -34 -20, 0 -40, 30 -30 C 52 -20, 64 0, 60 16 C 40 24, 10 34, -30 30 Z" fill={C.negro} />
            <path d="M-4 -30 C -14 -64, 20 -76, 36 -62 C 18 -60, 12 -50, 12 -30 Z" fill={C.crema} stroke={C.negro} strokeWidth={2} />
            <circle cx={28} cy={-8} r={5} fill={C.crema} /><circle cx={29} cy={-8} r={2.5} fill={C.negro} />
          </g>
        )}
        {ficha.extra === 'medusa' && (
          <g transform={`translate(${cab.x} ${cab.y}) scale(${k} ${s})`} opacity={e.opacity}>
            {Array.from({ length: 9 }, (_, i) => {
              const a = -150 + i * 22 + Math.sin(f / 6 + i) * 8;
              const r = (a * Math.PI) / 180;
              return <path key={i} d={`M0 -10 q ${Math.cos(r) * 30} ${Math.sin(r) * 30 - 10} ${Math.cos(r) * 52} ${Math.sin(r) * 52}`} stroke={C.negro} strokeWidth={6} fill="none" strokeLinecap="round" />;
            })}
          </g>
        )}
      </g>
    );
  } else if (ficha.tipo === 'cuadrupedo') {
    cuerpo = <g transform={e.rot ? `rotate(${e.rot} ${base.x} ${base.y})` : undefined}><Cuadrupedo tipo={ficha.animal} {...(ficha.p as object)} {...props} {...base} s={e.s * (((ficha.p?.s as number) ?? 1))} moviendo={e.accion !== 'parado'} corriendo={e.accion === 'correr'} boca={e.boca || (ficha.p?.boca as boolean)} /></g>;
  } else if (ficha.tipo === 'serpiente') {
    cuerpo = <Serpiente {...(ficha.p as object)} {...props} {...base} s={e.s * (((ficha.p?.s as number) ?? 1))} boca={e.boca || (ficha.p?.boca as boolean)} />;
  } else if (ficha.tipo === 'ojo') {
    // Ojo de Ra (wedjat) que flota y brilla. Origen = centro del ojo.
    const k = e.s * (((ficha.p?.s as number) ?? 1)) * (e.voltear ? -1 : 1), ks = Math.abs(k), fl = Math.sin(f / 12) * 8;
    cuerpo = (
      <g transform={`translate(${base.x} ${base.y + fl}) scale(${k} ${ks})`} opacity={e.opacity}>
        <circle r={150} fill="url(#halo)" opacity={0.55 + Math.sin(f / 6) * 0.15} />
        <path d="M-110 0 C -60 -60, 60 -60, 110 0 C 60 40, -60 40, -110 0 Z" fill={C.blanco} stroke={C.negro} strokeWidth={8} />
        <circle r={30} fill={C.negro} />
        <circle cx={-8} cy={-8} r={8} fill={C.blanco} />
        <path d="M-120 -50 C -60 -100, 60 -96, 128 -54" stroke={C.negro} strokeWidth={16} fill="none" strokeLinecap="round" />
        <path d="M110 0 L 170 4" stroke={C.negro} strokeWidth={10} strokeLinecap="round" />
        <path d="M-20 34 L -30 110" stroke={C.negro} strokeWidth={12} strokeLinecap="round" />
        <path d="M10 34 C 30 70, 70 80, 80 110 C 90 130, 60 140, 50 120" stroke={C.negro} strokeWidth={10} fill="none" strokeLinecap="round" />
      </g>
    );
  } else if (ficha.tipo === 'escorpion') {
    cuerpo = <Escorpion {...(ficha.p as object)} {...props} {...base} s={e.s * (((ficha.p?.s as number) ?? 1))} moviendo={e.accion !== 'parado'} />;
  } else if (ficha.tipo === 'bichito') {
    cuerpo = <Bichito especie="moo" {...(ficha.p as object)} {...props} {...base} s={e.s * (((ficha.p?.s as number) ?? 1))} moviendo={e.accion !== 'parado'} />;
  } else if (ficha.tipo === 'avepie') {
    const ks = e.s * (((ficha.p?.s as number) ?? 1));
    cuerpo = <g transform={e.rot ? `rotate(${e.rot} ${base.x} ${base.y})` : undefined}><AvePie {...(ficha.p as object)} {...props} {...base} s={ks} moviendo={e.accion !== 'parado'} /></g>;
  } else if (ficha.tipo === 'ave') {
    cuerpo = <Ave {...(ficha.p as object)} {...props} {...base} s={e.s * (((ficha.p?.s as number) ?? 1))} />;
  } else {
    cuerpo = <Pez {...(ficha.p as object)} {...props} {...base} s={e.s} />;
  }
  return (
    <g>
      {e.brillo > 0 && <circle cx={e.x} cy={e.y - 180 * e.s} r={260 * e.s} fill="url(#haloBlanco)" opacity={e.brillo} />}
      {hd && ['cuadrupedo', 'serpiente', 'ave', 'escorpion', 'avepie', 'bichito'].includes(ficha.tipo) ? <g filter="url(#volumenHD)">{cuerpo}</g> : cuerpo}
    </g>
  );
};

/** Banda decorativa para coronas de luz (dioses brillando). */
export const Aura: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => <Borde d={`M${x - r} ${y} a ${r} ${r} 0 1 1 ${r * 2} 0`} w={6} color={C.oro} />;
