# Guion visual — cómo escribir un video

Cada video es **un solo archivo**: `src/videos/<id>/guion.json` (tipos en `src/motor/tipos.ts`; ejemplo completo: `src/videos/griegas-02-prometeo/guion.json`). No se escribe código: el motor anima solo.

## Pasos
1. Escribir `guion.json` (español neutro; `pt` y `en` traducidos en cada frase).
2. `node scripts/motor-narrar.mjs <id> es,pt,en` → voces + `timeline.json`.
3. `node scripts/motor-revisar.mjs <id>` → avisos + `out/<id>/hoja.jpg` (un vistazo).
4. `node scripts/motor-render.mjs <id>` → `out/<id>/<id>.{es,pt,en}.mp4`, `.m4a` y `.srt` (por defecto solo inglés: `--imagen=en --audio=en`; agregar `--audio=en,es,pt` y `.multi.mp4` sale con todas las pistas). Solo re-renderiza las escenas que cambiaron.

## Formato
- Raíz: `id` (`griegas-NN-slug`), `serie`, `numero` ("NN"), `titulo` {es,pt,en}, `tituloGriego` (portada, mayúsculas griegas), `escenas`.
- Escena: `id`, `frases` (3–6, ≤130 caracteres, cada una {es,pt,en}), `fondo`, `camara` {de, a, zoom:[z0,z1]}, `elementos`, `actores`, `efectos`, `rotulos`.
- **Tiempo = número de frase** dentro de la escena (0 = primera; 1.5 = mitad de la segunda).
- **Espacio**: x en píxeles del mundo; la pantalla muestra 1920 px a partir de la cámara (`de` → `a`). El suelo es automático. Si la cámara va de 0 a 900, lo visible al final es x 900–2820.
- Canal en inglés ("Myths on Clay"): la imagen se renderiza con nombres en inglés. Los nombres del elenco aparecen solos al entrar (`"rotulo": ""` para ocultarlo). Los `rotulos` de escena van como {es,pt,en} en mayúsculas.

## Vocabulario
- **fondo**: campo olimpo mar costa inframundo cueva palacio templo monte bosque ciudad noche cielo batalla fragua desierto caos
- **elementos** {tipo, x, s?, capa?, en?, props?}: olivo cipres palmera templo monte columna roca nube luna sol estrellas barco altar fogata trono anfora pithos casa muralla tumba cofre telar estatua puerta cueva rio
- **actores** {id, como?, x, y?, escala?, mira: der|izq, capa: fondo|medio|frente, props?, rotulo?, pasos}
- **elenco** (`como`): zeus hera poseidon hades demeter hestia atenea apolo artemisa ares afrodita hefesto hermes dioniso persefone eros helios selene eos nix cronos rea gea urano metis temis atlas prometeo epimeteo oceano heracles perseo teseo jason aquiles hector agamenon menelao odiseo paris priamo helena penelope andromaca casandra medea ariadna orfeo euridice pandora edipo antigona dedalo icaro minos midas narciso eco psique aracne tiresias caronte hombre joven anciano mujer anciana ninfa guerrero rey reina sacerdotisa pastor nino nina gigante titan ciclope hecatonquiro minotauro medusa gorgona centauro quiron furia musa leon toro buey caballo pegaso perro cerbero lobo jabali ciervo cierva cabra oveja oso esfinge quimera serpiente piton dragon hidra tifon monstruo_marino aguila arpia sirena buho pez delfin 
  - Cualquier otro personaje: usar un genérico (hombre, mujer, rey, guerrero…) + `props` (mujer, barba, canas, ropa corta|larga|armadura|desnudo, capa "#color", tocado cinta|corona|casco|diadema|velo|petaso|laurel, objeto rayo|tridente|lanza|cetro|antorcha|hoz|caduceo|copa|arco|espada|tirso|martillo|lira|cana, escudo, alas, gigante, piel "#color", contorno).
- **pasos** {en, hace, a?, dur?, objeto?, escala?, en_que?}: aparece desaparece entra(a) sale camina(a) corre(a) vuela([x,y]) nada(a) levanta baja senala ofrece lamenta golpea lanza abraza reza cae arrodilla sienta levantarse tiembla habla calla gira crece encoge toma(objeto) suelta brilla transforma(en_que)
- **efectos** {en, tipo, x?, y?, dur?, intensidad?}: rayo destello fuego fogata lluvia nieve humo chispas temblor oscurecer aclarar olas-suben olas-bajan luz niebla estrellas sangre polvo
- **rotulos** {en, texto {es,pt,en}, x, y (160–770), hasta?, estilo?}
  - `estilo: "porque"` = cartel fijo arriba al centro para las explicaciones ("THAT'S WHY THE SEA HAS TIDES" / "POR ESO EL MAR TIENE MAREAS"); x/y se ignoran. Máximo ~45 caracteres.

### Nórdicas (serie `nordicas`, estilo runas)
- `serie: "nordicas"` activa la piel nórdica sola. `tituloGriego` = título en inglés en mayúsculas (se dibuja en runas en la portada).
- `"sinAstros": true` en una escena quita el sol/luna del fondo (para usar los tuyos como elementos).
- **fondos nórdicos**: nieve fiordo asgard salon yggdrasil ginnungagap hel jotunheim aldea bosque_nevado aurora bifrost (los genéricos campo/bosque/monte/costa/ciudad/noche/palacio también se ven nórdicos; evitar olimpo/templo/desierto).
- **elementos nórdicos**: pino yggdrasil casa_larga piedra_runica(props.texto) drakkar monte_nevado (olivo→pino, barco→drakkar, casa→casa_larga solos).
- **elenco nórdico**: odin frigg thor sif loki baldr hodr tyr heimdall freyja freyr njord idun bragi hel mimir ymir buri bor vili ve ask embla jotun gigante_hielo surtr skadi angrboda enano valquiria norna vikingo fenrir lobo_gigante sleipnir audhumla jormungandr nidhogg cuervo huginn muninn
- props extra: tocado yelmo|yelmoAlas|sombrero, objeto mjolnir|hacha|cuerno|manzana, pelo "#color", tuerto, emblema valknut|nudo.
- No usar personajes griegos en videos nórdicos.

## Reglas de calidad
- **"Y por eso…" (solo si sale natural):** contá la historia como se cuenta, sin forzar. Si el mito mismo explica algo del mundo (lo dice la fuente), decilo dentro de la narración con naturalidad. No es obligatorio ni hay cuota; nunca inventar ni estirar una explicación. El cartel `estilo: "porque"` solo para la explicación más fuerte del episodio (0 o 1 por video).
- Cada frase tiene que **verse**: algo entra, se mueve, cambia o aparece en sincronía con lo que se narra.
- 2–5 actores por escena, separados ≥ 150 px; usar `capa: fondo/medio` para profundidad y la cámara para recorrer.
- Primera frase del video conecta con el anterior; la última escena (`cierre`) anuncia el siguiente según `PLAN-GRIEGAS.md`.
- Sin contenido sexual explícito; violencia sin morbo (destello en lugar de sangre).

## Miniatura / portada
- Agregá `"miniatura": {"heroe": "<clave elenco>", "rival": "<clave elenco>"}` al guion: la portada (primeros 4 s) se dibuja igual que la miniatura, así se puede elegir con "Select from video".

## Shorts (verticales)
- En la raíz del guion: `"shorts": [{ "gancho": {es,en}, "escena": "<id>", "desde": 1, "hasta": 3, "foco": 900 }]` — 2–3 por video, 20–50 s cada uno (las frases `desde`…`hasta` de UNA escena), el momento más impactante.
- `gancho`: frase corta e intrigante en mayúsculas iniciales ("The Titan who ate his own children"). `foco`: x de pantalla (0–1920) que queda en el centro del vertical (se ve ~860 px de ancho): poné ahí a los protagonistas de ese tramo.
- Render: `node scripts/motor-short.mjs <id>` → `out/<id>/short-N.mp4` (reusa la narración, no gasta créditos).

## Episodio vertical (Reels: `<id>-vertical`, `<id>-parte`)
- No es un recorte ni un zoom del horizontal: `src/motor/puestaVertical.ts` arma cada escena para 9:16 sola (no hay que tocar el guion). Un encuadre FIJO por escena: la cámara no se mueve, sin cortes ni acercamientos.
- Todos los actores de la escena entran juntos en el cuadro: se acercan entre sí (mismo orden izquierda/derecha y misma mirada, sin encimarse si estaban separados) y la escena tiene una escala única (algo más grandes que en el horizontal si son 1–2, más chicos si son muchos). Entradas, caminatas y salidas pasan por la misma compresión. Los elementos que quedarían afuera entran por el costado sin tapar a nadie. Fondo a escala fija con sol/luna/nubes/estrellas del tema en el cielo alto; carteles de escena arriba, en pantalla.
- Pruebas: `node --test test/puesta-vertical.test.mjs`.

## Egipcias (tema papiro)
- `props.alas: true` en el tema egipcio = alas de diosa en los brazos (Isis, Neftis, Maat); se abren con los brazos (`brazo`/`brazoAtras`). En los otros temas siguen siendo alas en los pies.
- Calidad HD (volumen, contorno, sombra, movimiento secundario) activa por defecto; `"hd": false` en el guion la apaga.
- `arrodilla` dobla las piernas de verdad (rodilla en el piso); `sienta` (muslos al frente, para tronos: poné el elemento `trono` detrás); `levantarse` deshace ambos.
- `olas-suben`/`olas-bajan` aceptan `color: "rojo"` (la cerveza teñida de Sekhmet, ríos de sangre…).
- elemento `nut_arco` (Nut arqueada sobre el mundo, cielo estrellado de punta a punta; poné `capa: "fondo"`).
- elemento `trono` acepta `props: {"oro": true}` (trono dorado).
- `ganso` y `pelicano` (aves de pie, cuello largo; `cae` las tumba). `hipopotamo`, `escorpion`, `horus_nino`, `neit`, `serket` en el elenco.
- HD (por defecto) = contorno + sombra en el piso + movimiento secundario + brazos suaves con mano (palma y pulgar), SIN sombra/luz en los bordes (Matías no la quería; 2026-10-09). `brazoSuave`/`sinSombraBorde` se pueden forzar por personaje.

## Actuación (2026-10-09)
- Caras (usar poco, solo en momentos fuertes): `enoja`, `entristece`, `sorprende` (se echa para atrás), `alegra` duran ~1,5 s (o `dur`) y vuelven solas a la cara normal; solo cejas y ojo, sin boca. Cabeza: `asiente`, `niega`, `mira` (a: x → se da vuelta hacia ahí). `salta`.
- `habla` mueve las manos solo (si no hay otro gesto). Los que escuchan inclinan la cabeza hacia el que habla.
- `golpea` / `lanza` con anticipación (se echan para atrás antes de descargar).
- `aparece` / `desaparece` con `"con": "luz" | "humo" | "polvo" | "fuego" | "agua" | "sombra"` (dioses: luz; magia: humo; llegar corriendo: polvo).
- Siluetas: `props.cuerpo`: `viejo` (encorvado, canoso), `nino` (chico y cabezón), `gordo`, `flaco`; además `gigante`.
- `alae` (gallineta de cuello corto) y `alae_roja` (con la frente roja, después de que Māui se la quema: `transforma` → alae_roja).
- Elementos animados: `hasta` (desaparece en esa frase), `sube` (sube N px desde abajo durante `durSube` frases desde `en`; negativo = baja). Elemento `isla` (roca volcánica con verde y palmeras, `props.verde: false` = roca pelada) para islas que emergen.
- Animales chicos: `honu` (tortuga), `moo` (gecko), `rata`; aves de pie `ganso`, `pelicano`, `alae`.

## Norteamericanas (serie `norteamericanas`, tema "pintado"; plan en PLAN-NORTEAMERICANAS.md)
- `serie: "norteamericanas"` activa la piel sola (cuero pintado, guardas de cuentas, música `norteamericana.wav`). Siempre nombrar la nación de la versión.
- **fondos**: mundo_cielo agua_primordial bajo_agua bosque aldea_casa_larga pradera costa_noroeste rio montanas lago noche.
- **elementos**: arbol_cielo(props.luz) agujero isla_tortuga(props.tierra 0–1, props.arboles; origen = línea del agua, el caparazón queda a ~176·s px; para "crecer" la tierra, varios con en/hasta) casa_comunal tipi casa_tablones totem canoa canoa_cedro maiz tres_hermanas monticulo arce abedul cedro caja(props.luz).
- **elenco**: mujer_cielo jefe_cielo gente_cielo gente_cielo_mujer hija_cielo brote pedernal haudenosaunee(_mujer) cherokee(_mujer) anishinaabe(_mujer) tlingit(_mujer) haida(_mujer) lakota(_mujer) jefe_lakota nimiipuu(_mujer) anciano_nativo anciana_nativa nanabozho · gran_tortuga tortuga rata_almizclera castor nutria colimbo ganso_salvaje cuervo_negro zopilote coyote arana_agua(props.cuenco) abuela_arana escarabajo_agua. A ciervo/oso/lobo/pez darles `props.color` (si no salen negros).
- props: tocado gustoweh (+ `nacion` mohawk|oneida|onondaga|cayuga|seneca|tuscarora) plumaAtras cintaTejida sombreroCesteria roach tocadoPlumas (solo jefes de las Llanuras); `trenzas`, `ropaColor`; objeto semillas maiz palo tambor asta. Las mujeres llevan vestido de cuero entero con flecos y trenzas por defecto.
- Animales nadando: `y` ≈ 800–812 sobre `agua_primordial`. Personas paradas sobre la tortuga: `y` ≈ 790 − 176·s·1.12 y `escala` ≤ 0.85 (si no, la cabeza se sale arriba).
- **T1 5–12** (`src/motor/norteExtra.tsx`): fondos `playa_noroeste` (playa sin casas) `dentro_monstruo`; elementos `sicomoro`(props.isla, fuego) `isla_barro`(props.tierra 0–1, cuerdas, montes 0–1, verde; origen = agua) `boveda`(y = superficie de arriba; animales chicos parados encima) `tronco`(origen = agua; parados en y≈704 con s 1.2) `interior_tablones`(s 0.7 llena la pantalla; agujero del humo en x 960, y≈200; props.luz) `bulto` `almeja`(props.abierta, ojos) `escalera_flechas`(props.n) `constelacion` `monstruo_kamiah`(props.boca, aspira, muerto) `corazon_monstruo`(props.cortado) `corazon_piedra` `casa_cherokee` `soga`(props.ax, ay); elenco `zarigueya`(props.colaPelada) `buho_cornudo` `tecolote`(props.ojosRojos, aros, cuernos) `cangrejo` `cuervo_pie` `cuervo_blanco` (para "se vuelve negro": `transforma` → `cuervo_pie`) `caja_simple`(se mueve como actor) `vison` `somormujo` `zorro` `cardenal` `uktena` `sol_cherokee` `hija_sol` `luna_cherokee`. Cualquier actor acepta `rotulo` propio ("SPREADING ADDER").
- Sin narrar todavía, `motor-revisar` estima los tiempos (≈2,3 palabras/s) y no arma la hoja; stills de prueba con `npx remotion still src/pruebas/norte.tsx <id> out.png --frame=N`.

## Aztecas (serie `aztecas`, tema "codice"; plan en PLAN-AZTECAS.md)
- `serie: "aztecas"` activa la piel sola (pintura de códice, greca escalonada y cuentas de jade, suelo-glifo de tierra, música `azteca.wav`). Decir "mexica" y nombrar la fuente de cada versión. Sacrificio: se dice, nunca se muestra.
- **fondos**: omeyocan aguas_primeras valle encinar selva firmamento mictlan teotihuacan teotihuacan_noche coatepec aztlan lago_texcoco tenochtitlan milpa (lista en `FONDOS_AZTECA`, src/motor/fondosAzteca.tsx; motor-revisar la lee de ahí).
- **elementos**: piramide(props.templos 1|2, sinTemplo) templo_mayor tepetl(props.glifo "serpiente") volcan nopal(props.roca) maguey tule ahuehuete encino ceiba maiz_codice sol_codice(props.medio, cara, luz) luna_codice(props.conejo) estrellas_codice nube_codice hoguera(props.brasas) espejo huesos(props.brillo) caracol acalli chinampa remolino calendario chicomoztoc tetl(props.color) momoztli icpalli jacal casa_mexica cielo_bajo lluvia_fuego tronco(props.flota) pozo cajete(props.brillo) tonacatepetl(props.abierto) pluma_bola via_lactea. Los genéricos sol/luna/nube/monte/arbol/casa/templo/roca/altar/trono/barco/cueva/maiz salen en versión códice.
- **elenco** (src/motor/elencoAzteca.tsx): ometecuhtli omecihuatl tezcatlipoca_joven (dos pies) tezcatlipoca (espejo humeante en el pie) tezcatlipoca_rojo quetzalcoatl huitzilopochtli tlaloc chalchiuhtlicue mictlantecuhtli mictecacihuatl xolotl xochiquetzal coatlicue coyolxauhqui huitznahua nanahuatzin tecciztecatl oxomoco cipactonal quinametzin mexica(_mujer) anciano_mexica anciana_mexica sacerdote_mexica tenoch teomama guerrero_aguila guerrero_jaguar · criaturas (dibujo propio): cipactli tlaltecuhtli(props.parte "cabeza"|"cola") serpiente_emplumada serpiente_negra coatl ocelotl ozomatli cuauhtli(props.alas) huitzitzilin azcatl azcatl_negra tochtli huexolotl zolin axolotl cuauhtli_claro ocelotl_liso(props.manchas) · más: huitzilopochtli_xiuhcoatl cihuacoatl cuahuitlicac tlaloque. Las claves de animales van en náhuatl para no chocar con otras series; en pantalla salen en inglés.
- Personas = muñeco de siempre + `adornos` (tocados, pintura de cara, pectorales, escudos) definidos en el elenco; no se tocan desde el guion. Los voladores dibujados (huitzitzilin, cuauhtli en vuelo) necesitan `y`.
- Stills de prueba: `npx remotion still src/pruebas/azteca.tsx <id> out.png --frame=N` (también `a-fondos`, `a-elenco`, `a-bestias`, `a-nuevos`; y cuadrículas 2×2 de escenas congeladas: `a-arreglos`, `a-eps-5-8`, `a-eps-9-12`, siempre con `--frame=60`).
