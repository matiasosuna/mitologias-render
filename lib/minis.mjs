// Personajes (héroe, rival) de las portadas de los episodios viejos que no traen `miniatura` en el guion.
// Los usan scripts/miniaturas.mjs (YouTube) y scripts/portadas-ig.mjs (Instagram, y con ella la tarjeta de portada de
// cada vertical/parte/TikTok). Solo claves *_oficial donde existe el diseño (lib/miniaturas-oficiales.mjs lo vigila).
export const MINIS = {
  'griegas-01-origen': ['cronos_oficial', 'urano_oficial'],
  'griegas-02-prometeo': ['prometeo_oficial', 'zeus_oficial'],
  'griegas-03-pandora': ['pandora_oficial', 'epimeteo_oficial'],
  'griegas-04-edades': ['zeus_oficial', 'hombre_griego_oficial'],
  'griegas-05-diluvio': [{ barba: true, canas: true, ropa: 'larga' }, { mujer: true, tocado: 'velo' }],
  'griegas-06-gigantomaquia': ['heracles_oficial', {"gigante":true,"barba":true,"ropa":"desnudo","boca":true}],
  'griegas-07-tifon': ['zeus_oficial', {"gigante":true,"barba":true,"ropa":"desnudo","boca":true,"piel":"#3A1A0C"}],
  'griegas-08-doce-olimpicos': ['zeus_oficial', 'hera_oficial'],
  'griegas-09-atenea': ['atenea_oficial', 'zeus_oficial'],
  'griegas-10-atenea-poseidon': ['atenea_oficial', 'poseidon_oficial'],
  'nordicas-01-fuego-y-hielo': ['odin_oficial', 'ymir'],
  'nordicas-02-mundo': ['odin_oficial', 'embla'],
  'nordicas-03-yggdrasil': ['heimdall_oficial', 'norna_nordica_oficial'],
  'nordicas-04-guerra-dioses': ['odin_oficial', 'freyja'],
  'nordicas-05-sabiduria': ['odin_oficial', 'mimir_oficial'],
  'nordicas-06-muralla': ['loki_oficial', 'jotun_nordico_2_oficial'],
  'nordicas-07-tesoros': ['thor_oficial', 'enano_nordico_oficial'],
};
/** Cambios de la portada de Instagram respecto de la de YouTube. */
export const MINIS_IG = { 'griegas-01-origen': ['zeus_oficial', 'cronos_oficial'], 'griegas-02-prometeo': ['prometeo_oficial', 'zeus_oficial'] };
