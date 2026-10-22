// Formato del "guion visual": cada video es un JSON que el motor anima solo.
// Los tiempos se expresan en frases (0, 1, 2… dentro de la escena; 1.5 = a mitad de la frase 1).

export type Idioma = 'es' | 'pt' | 'en';
export type Texto = Partial<Record<Idioma, string>> & { es: string };

export type Paso = {
  /** Momento (índice de frase; decimales = fracción de esa frase). */
  en: number;
  hace:
    | 'aparece' | 'desaparece' | 'entra' | 'sale'
    | 'camina' | 'corre' | 'vuela' | 'nada'
    | 'levanta' | 'baja' | 'senala' | 'ofrece' | 'lamenta' | 'golpea' | 'lanza' | 'abraza' | 'reza'
    | 'cae' | 'arrodilla' | 'sienta' | 'levantarse' | 'tiembla' | 'habla' | 'calla' | 'gira' | 'crece' | 'encoge'
    | 'toma' | 'suelta' | 'brilla' | 'transforma'
    | 'enoja' | 'entristece' | 'sorprende' | 'alegra' | 'neutral' | 'asiente' | 'niega' | 'mira' | 'salta';
  /** Destino x (camina/corre/nada/entra) o [x, y] (vuela). */
  a?: number | [number, number];
  /** Duración del movimiento en frases (por defecto, hasta el próximo paso o 1 frase). */
  dur?: number;
  objeto?: string; // toma/lanza
  escala?: number; // crece/encoge
  en_que?: string; // transforma: id de elenco en que se convierte
  /** aparece/desaparece con efecto: humo, luz, polvo, fuego, agua, sombra. */
  con?: 'humo' | 'luz' | 'polvo' | 'fuego' | 'agua' | 'sombra';
};

export type Actor = {
  id: string;
  /** Clave del elenco (zeus, atenea, hombre, leon, hidra…). Por defecto = id. */
  como?: string;
  x: number;
  y?: number; // por defecto el suelo; para voladores, altura
  escala?: number;
  mira?: 'der' | 'izq';
  capa?: 'fondo' | 'medio' | 'frente';
  /** Visible desde el principio (por defecto sí, salvo que el primer paso sea aparece/entra). */
  visible?: boolean;
  /** Ajustes libres del personaje (props de Personaje o de la bestia). */
  props?: Record<string, unknown>;
  rotulo?: string; // nombre en letras griegas sobre la cabeza (lo pone solo si el elenco lo trae)
  pasos?: Paso[];
};

export type Efecto = {
  en: number;
  tipo: 'rayo' | 'destello' | 'fuego' | 'fogata' | 'lluvia' | 'nieve' | 'humo' | 'chispas' | 'temblor' | 'oscurecer' | 'aclarar' | 'olas-suben' | 'olas-bajan' | 'luz' | 'niebla' | 'estrellas' | 'sangre' | 'polvo';
  x?: number;
  y?: number;
  dur?: number; // en frases
  intensidad?: number;
  /** Color del agua en olas-suben/olas-bajan: "rojo" o un color. */
  color?: string;
};

export type Elemento = {
  tipo: string; // olivo, templo, monte, columna, roca, nube, luna, sol, barco, altar, fogata, trono, anfora, arbol, casa, muralla, puerta, cueva, rio, palmera, cipres, tumba, estatua…
  x: number;
  y?: number;
  s?: number;
  capa?: 'fondo' | 'medio' | 'frente';
  /** Aparece en esta frase (si no, desde el principio). */
  en?: number;
  /** Desaparece en esta frase. */
  hasta?: number;
  /** Sube desde N px más abajo durante `durSube` frases (1 por defecto) desde `en`: islas que emergen, cielo que se levanta (negativo = baja). */
  sube?: number;
  durSube?: number;
  props?: Record<string, unknown>;
};

export type Escena = {
  id: string;
  frases: Texto[];
  fondo: 'campo' | 'olimpo' | 'mar' | 'costa' | 'inframundo' | 'cueva' | 'palacio' | 'templo' | 'monte' | 'bosque' | 'ciudad' | 'noche' | 'cielo' | 'batalla' | 'fragua' | 'desierto' | 'caos'
    | 'nieve' | 'fiordo' | 'asgard' | 'salon' | 'yggdrasil' | 'ginnungagap' | 'hel' | 'jotunheim' | 'aldea' | 'bosque_nevado' | 'aurora' | 'bifrost'
    | 'nilo' | 'nun' | 'duat' | 'piramides' | 'juncal' | 'sala_juicio' | 'cielo_nut'
    | 'mundo_cielo' | 'agua_primordial' | 'aldea_casa_larga' | 'pradera' | 'costa_noroeste' | 'rio' | 'montanas' | 'lago' | 'bajo_agua' | 'playa_noroeste' | 'dentro_monstruo'
    | 'omeyocan' | 'aguas_primeras' | 'valle' | 'encinar' | 'selva' | 'firmamento' | 'mictlan' | 'teotihuacan' | 'teotihuacan_noche' | 'coatepec' | 'aztlan' | 'lago_texcoco' | 'tenochtitlan' | 'milpa'
    | 'kahyangan' | 'segara' | 'dasar_segara' | 'gunung_agung' | 'danau_batur' | 'sawah' | 'pura' | 'pura_malam' | 'puri' | 'desa' | 'desa_malam' | 'setra' | 'alas' | 'pantai' | 'tanah_lot' | 'tirta_empul' | 'selat'
    | 'te_po' | 'te_ao_marama' | 'ngahere' | 'moana' | 'takutai' | 'kainga' | 'whare_dentro' | 'rarohenga' | 'rangi_tuhaha' | 'maunga' | 'roto' | 'ahi_mahuika' | 'po_whetu' | 'rua_ra' | 'hawaiki' | 'aotearoa'
    | 'oceano_cosmico' | 'oceano_leche' | 'svarga' | 'kailash' | 'bosque_pahari' | 'orilla_rio' | 'palacio_pahari' | 'palacio_noche' | 'crepusculo' | 'patala' | 'cielo_cosmico' | 'diluvio' | 'campo_pahari' | 'ashram'
    | 'abismo' | 'aguas_luz' | 'firmamento_agua' | 'tierra_seca' | 'mar_tierra' | 'jardin' | 'cielo_noche' | 'amanecer' | 'mar_vida' | 'llanura' | 'colinas';
  /** Sin el sol/luna propios del fondo (para animarlos con elementos, p. ej. cuando los tragan los lobos). */
  sinAstros?: boolean;
  /** Cámara: x inicial y final, zoom inicial y final. */
  camara?: { de?: number; a?: number; zoom?: [number, number] };
  elementos?: Elemento[];
  actores?: Actor[];
  efectos?: Efecto[];
  /** Carteles en letras griegas (neutros al idioma). */
  rotulos?: { en: number; texto: string | Texto; x: number; y: number; hasta?: number; estilo?: 'porque' }[];
  /** Short nativo: x del mundo que queda en el centro del vertical (por defecto 960). */
  foco?: number;
};

export type GuionVisual = {
  id: string; // griegas-02-prometeo
  serie: string; // griegas
  numero: string; // "02"
  titulo: Texto;
  tituloGriego: string; // ΠΡΟΜΗΘΕΥΣ — portada neutral al idioma (en nórdicas: el nombre en latín, se dibuja en runas)
  escenas: Escena[];
  /** Protagonistas de la miniatura (clave del elenco o props). Si está, la portada del video ES la miniatura. */
  miniatura?: { heroe: unknown; rival?: unknown };
  /** Calidad mejorada de personajes (volumen, contorno, sombra, movimiento secundario). Por defecto sí. */
  hd?: boolean;
  /** Título del próximo episodio (se ve tenue detrás del elemento de video de la pantalla final). */
  siguiente?: Texto;
  /** Shorts verticales: un tramo de una escena con su gancho. */
  shorts?: Short[];
  /** Especial o saga aparte de las temporadas ("Halloween Special", "The Odyssey"): se muestra en título, portada y lista. */
  especial?: { nombre: Texto; parte?: number };
  /** "short": mini-historia nativa vertical (ShortNativo), con su propio guion y voz. */
  formato?: 'short';
  /** Short nativo: frase grande arriba durante todo el video. */
  gancho?: Texto;
  /** Short nativo: texto del cartel final (p. ej. el título del episodio completo). */
  cierre?: Texto;
  /** Short nativo: episodio relacionado (id), para el link en la descripción. */
  episodio?: string;
  /** Short "Who is…?" (BRIEF-QUIEN.md): cartel de apertura de ~2 s con el muñeco oficial (`como`), el nombre y un subtítulo. */
  quien?: { nombre: Texto; subtitulo: Texto; como: string; fondo?: Escena['fondo']; escala?: number };
  /** Short nativo: cold open de 1–2 frases sobre el momento más fuerte, ANTES del cartel/la historia (lib/short.mjs). */
  coldOpen?: Omit<Escena, 'id'> & { id?: string };
};

export type Short = {
  gancho: Texto; // frase grande arriba ("This Titan ate his own children")
  escena: string; // id de la escena
  desde: number; // primera frase (incluida)
  hasta: number; // última frase (incluida)
  foco?: number; // x de pantalla (0–1920) que queda centrada en el vertical; por defecto 960
};

export type FraseTL = { from: number; dur: number; audio: Partial<Record<Idioma, string>>; texto: Texto };
export type EscenaTL = { id: string; from: number; durationInFrames: number; frases: FraseTL[] };
export type Timeline = { fps: number; introFrames: number; outroFrames: number; total: number; escenas: EscenaTL[]; cartelFrom?: number; cartelFrames?: number };
