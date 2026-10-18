# Cola de producción (la sigue la rutina de la nube: RUTINA.md)

Cada corrida toma el PRIMER ítem `- [ ]` (de arriba hacia abajo), lo hace entero y lo marca:
`- [x] … — HECHO AAAA-MM-DD: <ids>`. Si se traba: el ítem queda `- [ ]` con una línea `> BLOQUEADO AAAA-MM-DD: <qué falló>` debajo
(la próxima corrida lo retoma leyendo la nota). No reordenar ni borrar ítems; Matías puede editar esta lista.

**Foco (2026-10-15): solo mitología GRIEGA.** Todo lo demás (nórdicas, egipcias y hawaianas incluidas) está en **PAUSADO** (al final):
la rutina no toma nada de esa sección.

## Hecho (historial)
- [x] S01 · Shorts nativos (9): `norteamericanas-01-la-mujer-del-cielo`, `aztecas-01-los-hijos-de-ometeotl`, `hindues-01-el-dios-que-suena-el-mundo` — HECHO 2026-10-14: short-norteamericanas-arbol-luz, short-norteamericanas-resbalo-empujo, short-norteamericanas-gansos-tortuga, short-aztecas-dios-huesos, short-aztecas-medio-sol, short-aztecas-granos-maiz, short-hindues-himno-creacion, short-hindues-loto-brahma, short-hindues-dia-brahma
- [x] S02 · Shorts nativos (9): `norteamericanas-02-el-lomo-de-la-tortuga`, `aztecas-02-el-monstruo-de-la-tierra`, `hindues-02-el-pilar-sin-fin` — HECHO 2026-10-14: short-norteamericanas-rata-pequena, short-norteamericanas-tres-nadadores, short-norteamericanas-danza-tierra, short-aztecas-serpientes-monstruo, short-aztecas-cuerpo-tierra, short-aztecas-pie-espejo, short-hindues-pilar-fuego, short-hindues-flor-mentira, short-hindues-jabali-honesto
- [x] S03 · Shorts nativos (9): `norteamericanas-03-nacen-los-gemelos`, `aztecas-03-el-sol-de-jaguar`, `hindues-03-el-pez-y-el-diluvio` — HECHO 2026-10-15: short-norteamericanas-dos-flechas, short-norteamericanas-bebe-mentira, short-norteamericanas-tres-hermanas, short-aztecas-sol-derribado, short-aztecas-gigantes-jaguares, short-aztecas-jaguar-estrellas, short-hindues-pez-cuenco, short-hindues-cuerno-barco, short-hindues-ida-mantequilla

## Griegas · "Who is…?", Stories y Shorts que faltan
- **Q** = Shorts "Who is…?" (`BRIEF-QUIEN.md`), id `short-griegas-quien-<clave>`; la flecha es el episodio sugerido para el cierre (si no cierra de verdad, otro con `S<n>E<m>`).
- **H** = Story: episodio suelto de 4–6 min que se entiende sin nada previo (RUTINA.md › "Stories"), especial `"Greek Myth Stories"`, temporada 0.
  Orfeo y Eurídice no va: ya está entero en el especial `griegas-99-reino-de-hades`. Pandora tampoco (S1E3).
- **R** = mini-historias nativas (`BRIEF-SHORTS.md`) hasta 3 Shorts por episodio. Entre paréntesis, cuántos faltaban al armar la cola
  (contando los "Who is…?"); al producir, recontá: 3 − Shorts que ya tienen ese `episodio`. **Solo anécdotas nuevas**: si no hay, hacé menos y anotalo.

- [x] D01 · Short "Meet the Greek Gods in 60 seconds" → `short-griegas-dioses-60s` (pedido de Matías 2026-10-15). Abre con la pregunta ANTES de todos: "Which one is your favorite? Tell us 👇" (sobre los dioses juntos), y después pasa uno por uno, ~4 s cada uno, con su diseño oficial, el nombre grande en pantalla y una línea: "ZEUS · god of the sky and thunder". Orden: Zeus, Hera, Poseidon, Hades, Demeter, Hestia, Athena, Apollo, Artemis, Ares, Aphrodite, Hephaestus, Hermes, Dionysus, Persephone. Ritmo rápido de Shorts, música que sube; sin cierre largo (cartel final 1,5 s). Personajes `*_oficial` (si alguno todavía no tiene oficial, esperar a que exista: está en diseño). Sin `quien`; usar `coldOpen` para la pregunta inicial. — HECHO 2026-10-16: short-griegas-dioses-60s (cierra en griegas-08-doce-olimpicos, S2E1)
- [x] Q01 · "Who is…?" (3; Zeus ya HECHO 2026-10-15: `short-griegas-quien-zeus`, no rehacer): Hermes `hermes_oficial` → `griegas-15-hermes-bebe-ladron` (Greek S2E8) · Athena `atenea_oficial` → `griegas-09-atenea` (Greek S2E2) · Poseidon `poseidon_oficial` → `griegas-10-atenea-poseidon` (Greek S2E3) — HECHO 2026-10-17: short-griegas-quien-hermes, short-griegas-quien-atenea, short-griegas-quien-poseidon
- [ ] Q02 · "Who is…?" (4): Hades `hades_oficial` → `griegas-01-origen` (Greek S1E1) · Aphrodite `afrodita_oficial` → `griegas-12-red-de-hefesto` (Greek S2E5) · Apollo `apolo_oficial` → `griegas-14-apolo-piton` (Greek S2E7) · Ares `ares_oficial` → `griegas-12-red-de-hefesto` (Greek S2E5)
> BLOQUEADO 2026-10-18: la suite ya falla sin cambios: test/personajes-oficiales.test.mjs "guiones no publicados…" (short-egipcias-cabeza-ganso: faltan 7 cambios; correr scripts/personajes-oficiales.mjs --aplicar).
- [ ] H01 · Story (Greek): Perseo y Medusa → `griegas-80-perseo-y-medusa` · especial "Greek Myth Stories". Fuentes: Apolodoro, Biblioteca 2.4; Ovidio, Metamorfosis 4–5; Hesíodo, Teogonía
- [ ] Q03 · "Who is…?" (3): Artemis `artemisa_oficial` → `griegas-13-leto-y-los-gemelos` (Greek S2E6) · Hera `hera_oficial` → `griegas-11-hefesto` (Greek S2E4) · Prometheus `prometeo_oficial` → `griegas-02-prometeo` (Greek S1E2)
- [ ] Q04 · "Who is…?" (3): Dionysus `dioniso_oficial` → `griegas-16-dioniso-dos-veces` (Greek S2E9) · Hephaestus `hefesto_oficial` → `griegas-11-hefesto` (Greek S2E4) · Cronus `cronos_oficial` → `griegas-01-origen` (Greek S1E1)
- [ ] H02 · Story (Greek): Teseo y el Minotauro → `griegas-81-teseo-y-el-minotauro` · especial "Greek Myth Stories". Fuentes: Plutarco, Vida de Teseo; Apolodoro, Epítome 1; Catulo 64
- [ ] H03 · Story (Greek): Perséfone y la granada (el rapto, Deméter y el invierno) → `griegas-82-persefone-y-la-granada` · especial "Greek Myth Stories". Fuentes: Himno homérico a Deméter; Ovidio, Metamorfosis 5. Hades y Perséfone ya salen en el especial griegas-99: acá el rapto y la granada, no el reino
- [ ] H04 · Story (Greek): Los trabajos de Heracles, parte I (león de Nemea, Hidra, cierva, jabalí, establos de Augías, aves del Estínfalo) → `griegas-83-heracles-trabajos-1` · especial "Greek Myth Stories". Fuentes: Apolodoro, Biblioteca 2.4–2.5; se entiende solo, sin la parte II
- [ ] H05 · Story (Greek): Dédalo e Ícaro → `griegas-84-dedalo-e-icaro` · especial "Greek Myth Stories". Fuentes: Ovidio, Metamorfosis 8; Apolodoro, Epítome 1. Si va después de Teseo, el laberinto en 1–2 frases
- [ ] H06 · Story (Greek): El rey Midas → `griegas-85-el-rey-midas` · especial "Greek Myth Stories". Fuentes: Ovidio, Metamorfosis 11 (el toque de oro y las orejas de burro)
- [ ] H07 · Story (Greek): Los trabajos de Heracles, parte II (toro de Creta, yeguas de Diomedes, cinturón de Hipólita, bueyes de Gerión, manzanas de las Hespérides, Cerbero) → `griegas-86-heracles-trabajos-2` · especial "Greek Myth Stories". Fuentes: Apolodoro, Biblioteca 2.5; se entiende solo, sin la parte I; Cerbero en 1–2 frases (ya está en el especial y en un Short)
- [ ] H08 · Story (Greek): Aracne → `griegas-87-aracne` · especial "Greek Myth Stories". Fuentes: Ovidio, Metamorfosis 6
- [ ] H09 · Story (Greek): Jasón y el vellocino de oro → `griegas-88-jason-y-el-vellocino` · especial "Greek Myth Stories". Fuentes: Apolonio de Rodas, Argonáuticas; Apolodoro, Biblioteca 1.9; Píndaro, Pítica 4
- [ ] H10 · Story (Greek): Eco y Narciso → `griegas-89-eco-y-narciso` · especial "Greek Myth Stories". Fuentes: Ovidio, Metamorfosis 3

## PAUSADO (la rutina NO toma nada de acá; solo Matías lo reactiva subiéndolo de sección)

> 2026-10-17 Matías: los Shorts son SOLO "Who is…?"; no más mini historias sacadas de episodios. Ítems R cancelados:
- [ ] R01 · Shorts que faltan (7): `griegas-02-prometeo` (1), `griegas-03-pandora` (3), `griegas-04-edades` (2), `griegas-05-diluvio` (1)
- [ ] R02 · Shorts que faltan (6): `griegas-06-gigantomaquia` (2), `griegas-07-tifon` (1), `griegas-08-doce-olimpicos` (2), `griegas-12-red-de-hefesto` (1)
- [ ] R03 · Shorts que faltan (8): `griegas-13-leto-y-los-gemelos` (2), `griegas-14-apolo-piton` (2), `griegas-15-hermes-bebe-ladron` (2), `griegas-16-dioniso-dos-veces` (2)
- [ ] R04 · Shorts que faltan (3): `griegas-17-dioniso-piratas` (3)

Nórdicas, egipcias y hawaianas ("Who is…?", Stories y Shorts que faltan, con las mismas reglas que arriba):

- [ ] P-Q01 · "Who is…?" (3): Odin `odin_oficial` → `nordicas-05-sabiduria` (Norse S1E5) · Ra `ra_oficial` → `egipcias-10-viaje-nocturno` (Egyptian S1E10) · Pele `pele_oficial` → `hawaianas-13-pele-deja-kahiki` (Hawaiian S2E1)
- [ ] P-Q02 · "Who is…?" (3): Thor `thor_oficial` → `nordicas-09-thor-gigantes` (Norse S1E9) · Anubis `anubis_oficial` → `egipcias-07-catorce-pedazos` (Egyptian S1E7) · Māui `maui_oficial` → `hawaianas-09-maui-y-el-gran-anzuelo` (Hawaiian S1E9)
- [ ] P-Q03 · "Who is…?" (3): Loki `loki_oficial` → `nordicas-11-loki-atado` (Norse S1E11) · Osiris `osiris_oficial` → `egipcias-06-muerte-de-osiris` (Egyptian S1E6) · Hiʻiaka `hiiaka_oficial` → `hawaianas-21-hiiaka-sale-al-camino` (Hawaiian S2E9)
- [ ] P-Q04 · "Who is…?" (3): Freyja `freya_oficial` → `nordicas-06-muralla` (Norse S1E6) · Isis `isis_oficial` → `egipcias-05-nombre-secreto` (Egyptian S1E5) · Kamapuaʻa `kamapuaa_oficial` → `hawaianas-17-el-nino-cerdo` (Hawaiian S2E5)
- [ ] P-Q05 · "Who is…?" (3): Hel `hel_oficial` → `nordicas-08-hijos-loki` (Norse S1E8) · Horus `horus_oficial` → `egipcias-09-horus-contra-set` (Egyptian S1E9) · Kāne `kane_oficial` → `hawaianas-08-el-agua-de-kane` (Hawaiian S1E8)
- [ ] P-Q06 · "Who is…?" (3): Tyr `tyr_oficial` → `nordicas-08-hijos-loki` (Norse S1E8) · Set `set_oficial` → `egipcias-06-muerte-de-osiris` (Egyptian S1E6) · Kanaloa `kanaloa_oficial` → `hawaianas-08-el-agua-de-kane` (Hawaiian S1E8)
- [ ] P-Q07 · "Who is…?" (3): Baldr `baldr_oficial` → `nordicas-10-muerte-baldr` (Norse S1E10) · Thoth `thoth_oficial` → `egipcias-02-cielo-y-tierra` (Egyptian S1E2) · Kū `ku_oficial` → `hawaianas-04-hechos-de-tierra-roja` (Hawaiian S1E4)
- [ ] P-Q08 · "Who is…?" (3): Heimdall `heimdall_oficial` → `nordicas-12-ragnarok` (Norse S1E12) · Bastet `bastet_oficial` → `egipcias-04-ojo-de-ra` (Egyptian S1E4) (no sale en ningún episodio: el cierre va a su otra cara, la leona Sekhmet) · Lono `lono_oficial` → `hawaianas-04-hechos-de-tierra-roja` (Hawaiian S1E4)
- [ ] P-Q09 · "Who is…?" (3): Frigg `frigg_oficial` → `nordicas-10-muerte-baldr` (Norse S1E10) · Sekhmet `sekhmet_oficial` → `egipcias-04-ojo-de-ra` (Egyptian S1E4) · Hina `hina_oficial` → `hawaianas-11-el-sol-que-corria` (Hawaiian S1E11)
- [ ] P-Q10 · "Who is…?" (3): Freyr `freyr_oficial` → `nordicas-07-tesoros` (Norse S1E7) · Hathor `hathor_oficial` → `egipcias-09-horus-contra-set` (Egyptian S1E9) · Poliʻahu `poliahu_oficial` → `hawaianas-19-la-nieve-y-el-fuego` (Hawaiian S2E7)
- [ ] P-Q11 · "Who is…?" (2): Sif `sif_oficial` → `nordicas-07-tesoros` (Norse S1E7) · Nut `nut_oficial` → `egipcias-02-cielo-y-tierra` (Egyptian S1E2)
- [ ] P-Q12 · "Who is…?" (2): Njord `njord_oficial` → `nordicas-04-guerra-dioses` (Norse S1E4) · Geb `geb_oficial` → `egipcias-02-cielo-y-tierra` (Egyptian S1E2)
- [ ] P-Q13 · "Who is…?" (1): Ptah `ptah_oficial` → `egipcias-17-imhotep` (Egyptian S2E6) (Imhotep, "hijo de Ptah")
- [ ] P-H01 · Story (Norse): Thor pesca a la Serpiente del Mundo (con el gigante Hymir) → `nordicas-80-thor-pesca-la-serpiente` · especial "Norse Myth Stories". Fuentes: Hymiskviða; Snorri, Gylfaginning
- [ ] P-H02 · Story (Egyptian): El campesino elocuente → `egipcias-80-el-campesino-elocuente` · especial "Egyptian Myth Stories". Fuentes: Reino Medio, papiros de Berlín; Lichtheim, Ancient Egyptian Literature I
- [ ] P-H03 · Story (Hawaiian): Kana, el héroe que se estiraba hasta el cielo → `hawaianas-80-kana-el-heroe-que-se-estira` · especial "Hawaiian Myth Stories". Fuentes: Fornander, Hawaiian Antiquities and Folk-Lore; Beckwith, Hawaiian Mythology
- [ ] P-H04 · Story (Norse): Las manzanas de Iðunn → `nordicas-81-las-manzanas-de-idun` · especial "Norse Myth Stories". Fuentes: Snorri, Skáldskaparmál; Haustlöng
- [ ] P-H05 · Story (Egyptian): La toma de Jope (soldados escondidos en canastas) → `egipcias-81-la-toma-de-jope` · especial "Egyptian Myth Stories". Fuentes: Papiro Harris 500; Simpson, The Literature of Ancient Egypt
- [ ] P-H06 · Story (Hawaiian): Los Menehune, los constructores de una sola noche → `hawaianas-81-los-menehune` · especial "Hawaiian Myth Stories". Fuentes: Beckwith, Hawaiian Mythology; Thrum, Hawaiian Folk Tales (estanque de Alekoko). Sin burla (PLAN-HAWAIANAS T3 63)
- [ ] P-H07 · Story (Norse): Thor contra Hrungnir, el gigante de corazón de piedra → `nordicas-82-thor-contra-hrungnir` · especial "Norse Myth Stories". Fuentes: Snorri, Skáldskaparmál; Haustlöng
- [ ] P-H08 · Story (Egyptian): La Verdad y la Mentira (dos hermanos y un cuchillo enorme) → `egipcias-82-la-verdad-y-la-mentira` · especial "Egyptian Myth Stories". Fuentes: Papiro Chester Beatty II; Lichtheim, Ancient Egyptian Literature II
- [ ] P-R01 · Shorts que faltan (9): `nordicas-01-fuego-y-hielo` (3), `egipcias-01-primer-monticulo` (2), `nordicas-02-mundo` (3), `hawaianas-02-nacidos-del-mar` (1)
- [ ] P-R02 · Shorts que faltan (8): `nordicas-03-yggdrasil` (3), `egipcias-03-cinco-hijos` (3), `nordicas-05-sabiduria` (1), `egipcias-05-nombre-secreto` (1)
- [ ] P-R03 · Shorts que faltan (9): `hawaianas-05-la-calabaza-de-wakea` (3), `nordicas-06-muralla` (1), `hawaianas-06-la-madre-de-las-islas` (3), `egipcias-07-catorce-pedazos` (2)
- [ ] P-R04 · Shorts que faltan (8): `hawaianas-07-el-nino-estrella-y-el-taro` (3), `egipcias-08-horus-en-los-juncos` (2), `hawaianas-08-el-agua-de-kane` (1), `hawaianas-09-maui-y-el-gran-anzuelo` (2)
- [ ] P-R05 · Shorts que faltan (7): `egipcias-10-viaje-nocturno` (1), `hawaianas-10-maui-empuja-el-cielo` (3), `nordicas-11-loki-atado` (1), `egipcias-11-pesada-del-corazon` (2)
- [ ] P-R06 · Shorts que faltan (6): `hawaianas-11-el-sol-que-corria` (1), `nordicas-12-ragnarok` (1), `egipcias-12-keops-y-los-magos` (1), `hawaianas-12-maui-roba-el-fuego` (3)
- [ ] P-R07 · Shorts que faltan (7): `nordicas-13-mundo-renace` (3), `egipcias-13-naufrago` (2), `hawaianas-13-pele-deja-kahiki` (2)
- [ ] P-R08 · Shorts que faltan (9): `nordicas-14-volund` (3), `egipcias-14-sinuhe` (3), `hawaianas-14-cavando-el-fuego` (3)
- [ ] P-R09 · Shorts que faltan (8): `nordicas-15-oro-de-andvari` (2), `egipcias-15-dos-hermanos` (3), `hawaianas-15-los-huesos-de-pele` (3)
- [ ] P-R10 · Shorts que faltan (9): `nordicas-16-sigurd-y-fafnir` (3), `egipcias-16-setne-libro-de-thoth` (3), `hawaianas-16-nace-hiiaka` (3)
- [ ] P-R11 · Shorts que faltan (7): `nordicas-17-brynhild` (3), `egipcias-17-imhotep` (2), `hawaianas-17-el-nino-cerdo` (2)
- [ ] P-R12 · Shorts que faltan (9): `nordicas-18-helgi-y-sigrun` (3), `egipcias-18-princesa-de-bakhtan` (3), `hawaianas-18-pele-y-kamapuaa` (3)
- [ ] P-R13 · Shorts que faltan (8): `nordicas-19-hervor-y-tyrfing` (3), `egipcias-19-principe-predestinado` (3), `hawaianas-19-la-nieve-y-el-fuego` (2)
- [ ] P-R14 · Shorts que faltan (9): `nordicas-20-molino-grotti` (3), `hawaianas-20-el-sueno-de-lohiau` (3), `nordicas-21-starkad` (3)
- [ ] P-R15 · Shorts que faltan (8): `hawaianas-21-hiiaka-sale-al-camino` (2), `hawaianas-22-los-moo-del-camino` (3), `hawaianas-23-el-bosque-quemado` (3)
- [ ] P-R16 · Shorts que faltan (3): `hawaianas-24-el-beso-en-el-crater` (3)

Series nuevas y Shorts de norteamericanas, aztecas, hindúes, maoríes y balinesas:

- [ ] S04 · Shorts nativos (9): `norteamericanas-04-brote-y-pedernal`, `aztecas-04-el-sol-de-viento`, `hindues-04-la-guirnalda-maldita`
- [ ] S05 · Shorts nativos (9): `norteamericanas-05-el-escarabajo-de-agua`, `aztecas-05-la-lluvia-de-fuego`, `hindues-05-el-oceano-de-leche`
- [ ] S06 · Shorts nativos (9): `norteamericanas-06-el-primer-fuego`, `aztecas-06-el-diluvio-y-el-cielo-que-cayo`, `hindues-06-la-garganta-azul`
- [ ] S07 · Shorts nativos (9): `norteamericanas-07-la-hija-del-sol`, `aztecas-07-los-huesos-del-mictlan`, `hindues-07-mohini-y-el-eclipse`
- [ ] S08 · Shorts nativos (9): `norteamericanas-08-nanabozho-y-el-diluvio`, `aztecas-08-el-maiz-del-cerro`, `hindues-08-el-fuego-de-sati`
- [ ] S09 · Shorts nativos (9): `norteamericanas-09-el-cuervo-roba-la-luz`, `aztecas-09-la-hoguera-de-teotihuacan`, `hindues-09-las-cenizas-de-kama`
- [ ] S10 · Shorts nativos (9): `norteamericanas-10-el-cuervo-y-la-almeja`, `aztecas-10-el-conejo-en-la-luna`, `hindues-10-el-nino-de-barro`
- [ ] S11 · Shorts nativos (9): `norteamericanas-11-coyote-y-las-estrellas`, `aztecas-11-la-batalla-de-coatepec`, `hindues-11-el-hombre-leon`
- [ ] S12 · Shorts nativos (9): `norteamericanas-12-el-monstruo-de-kamiah`, `aztecas-12-el-aguila-sobre-el-nopal`, `hindues-12-tres-pasos`
- [ ] S13 · Shorts nativos (6): `maories-01-padre-cielo-madre-tierra`, `balinesas-01-la-isla-que-se-mecia`
- [ ] S14 · Shorts nativos (6): `maories-02-la-guerra-del-dios-de-la-tormenta`, `balinesas-02-la-joya-del-dragon`
- [ ] S15 · Shorts nativos (6): `maories-03-tu-el-que-no-huyo`, `balinesas-03-el-rey-que-prohibio-a-los-dioses`
- [ ] S16 · Shorts nativos (6): `maories-04-la-mujer-hecha-de-tierra`, `balinesas-04-el-manantial-envenenado`
- [ ] S17 · Shorts nativos (6): `maories-05-el-bebe-envuelto-en-el-pelo`, `balinesas-05-el-rey-la-diosa-y-la-princesa`
- [ ] S18 · Shorts nativos (6): `maories-06-maui-atrapa-al-sol`, `balinesas-06-el-senor-de-los-colmillos`
- [ ] S19 · Shorts nativos (6): `maories-07-el-pez-de-maui`, `balinesas-07-la-viuda-de-girah`
- [ ] S20 · Shorts nativos (6): `maories-08-las-unas-de-fuego`, `balinesas-08-el-libro-robado`
- [ ] S21 · Shorts nativos (6): `maories-09-maui-y-la-diosa-de-la-muerte`, `balinesas-09-barong-y-rangda`
- [ ] S22 · Shorts nativos (6): `maories-10-tawhaki-sube-al-cielo`, `balinesas-10-el-gigante-kebo-iwa`
- [ ] S23 · Shorts nativos (6): `maories-11-la-canoa-de-rata`, `balinesas-11-las-serpientes-de-tanah-lot`
- [ ] S24 · Shorts nativos (6): `maories-12-kupe-y-la-larga-nube-blanca`, `balinesas-12-el-dia-en-que-la-isla-calla`
- [ ] M01 · Mesopotámica (`mesopotamicas`, tema "relieve asirio"): tema + fondos + elementos + elenco + música + `PLAN-MESOPOTAMICAS.md` (T1 de 12) + sección en MOTOR.md + test de la serie + registro en todos los lugares de una serie
- [ ] M02 · Mesopotámica T1 episodios 1–4 (guion + youtube.json + `titulos.json` + narración en inglés)
- [ ] M03 · Mesopotámica T1 episodios 5–8
- [ ] M04 · Mesopotámica T1 episodios 9–12
- [ ] C01 · Celta/irlandesa (`celtas`, tema "manuscrito iluminado, nudos celtas"): tema + fondos + elementos + elenco + música + `PLAN-CELTAS.md` + MOTOR.md + test + registro
- [ ] C02 · Celta T1 episodios 1–4
- [ ] C03 · Celta T1 episodios 5–8
- [ ] C04 · Celta T1 episodios 9–12
- [ ] Y01 · Maya (`mayas`, tema "cerámica/estela maya"): tema + fondos + elementos + elenco + música + `PLAN-MAYAS.md` + MOTOR.md + test + registro
- [ ] Y02 · Maya T1 episodios 1–4
- [ ] Y03 · Maya T1 episodios 5–8
- [ ] Y04 · Maya T1 episodios 9–12
