# Brief: Shorts nativos (YouTube Shorts + Instagram Reels)

Pedido de Matías (2026-10-09): los Shorts **no son recortes** de los episodios. Son mini-historias escritas para el formato vertical, con su propio guion, voz y render. Pueden salir de los mismos mitos, pero se tienen que **entender solas**, sin haber visto nada.

## Fórmula (lo que funcionó: "The baby who tricked a Titan", 500+ vistas; ritmo desde 2026-10-15)
1. **Cold open (`coldOpen`, todo Short nuevo):** 1–2 frases sobre el momento más fuerte de la historia, ANTES de todo.
   Patrones: el momento más dramático ("He freed monsters no god dared to touch… and won the war of the gods.") o
   "Most people think X. It isn't." Después, la historia (o el cartel "Who is…?" y la historia).
2. **Gancho** (frase grande arriba desde que arranca la historia, ≤ 8 palabras): una situación imposible o un truco.
3. **Picos emocionales:** planteo → tensión que sube → giro o golpe → clímax → remate memorable. Frases cortas, algo
   cambia cada 2–3 s, nada de exposición lenta. Se recorta exposición, nunca pasos de la historia.
4. **Duración:** 45–65 s en total (Who is…?: hasta ~75 s).
5. **Final abierto (desde 2026-10-15):** el Short es el gancho y el episodio el producto. La última frase narrada deja la historia abierta y manda al episodio completo: "How Isis tricked Ra is only half of it. The full story is Episode 5." (temporada 2+: "…is Season 2, Episode 3"). Inglés simple. **Nunca falso:** solo lo que el episodio de verdad sigue contando.
6. **Cartel final** (`cierre`, 1,5 s; +1 s si la última frase es una pregunta): teaser con suspenso + `<Serie> Mythology S<n>E<m>`, p. ej. "What Ra lost next changed Egypt — Egyptian Mythology S1E5". Temporada y episodio salen de `src/videos/titulos.json` (la entrada del `episodio`, formato `SxEy`).
   Los Shorts ya publicados no se tocan.

## Formato del guion
`src/videos/short-<serie>-<slug>/guion.json` con:
- `"formato": "short"`, `id`, `serie`, `numero: "S"`, `titulo` {es,en}, `tituloGriego` (""),
- `gancho` {es,en} (lo de arriba), `cierre` {es,en} (cartel final: "<teaser con suspenso> — <Serie> Mythology S<n>E<m>", p. ej. "Ra was about to lose everything — Egyptian Mythology S1E5"; en `es`: "… — Mitología egipcia T1E5"), `episodio` (id del episodio relacionado, si hay),
- `coldOpen`: una escena sin `id` (fondo, foco, 1–2 frases, actores, efectos), mismo vocabulario que las escenas; copiá la
  puesta del clímax. Va primero; sin el campo, el Short arranca con la historia como antes.
  ```json
  "coldOpen": { "fondo": "batalla", "foco": 960, "frases": [{ "es": "…", "en": "He freed monsters no god dared to touch… and won the war of the gods." }],
                "actores": [{ "id": "zeus", "como": "zeus_oficial", "x": 730, "escala": 0.95, "pasos": [{ "en": 0.3, "hace": "lanza" }] }], "efectos": [{ "en": 0.4, "tipo": "rayo", "x": 1150 }] }
  ```
- `escenas`: un momento por escena, 2–4 frases cortas (una imagen nueva cada ~5–9 s), mismo vocabulario que `MOTOR.md`.

**Ritmo (lo hace el motor, `lib/short.mjs` + `T_SHORT`):** voz en inglés a 1,1× sin silencio en las puntas de cada frase
(~190 palabras/min), 0,12 s entre frases, ~0,35 s entre escenas. Los episodios siguen a 0,9× y con sus pausas. Re-narrar un
Short viejo lo re-estira solo (`.tempo.json` sabe qué tiene cada audio). Las listas de nombres con comas son lentas: agrupalas.

**Montaje vertical:** solo se ve una franja de ~860 px del mundo, centrada en `foco` (por defecto 960). Poné la acción **entre x≈700 y x≈1220**, `escala` 0.85–1 (los oficiales son altos: con escala > 1 el brazo levantado o el rayo se cortan en la guarda de arriba; `motor-revisar` avisa), máximo 2–3 por escena. Nada importante en los bordes. Usá la actuación nueva: `aparece` con `con`, gestos al hablar, golpe con anticipación, `sorprende`, `asiente`…

## Pasos
1. Escribir el guion (inglés simple y claro; frases ≤ 15 palabras).
2. `VOZ_EN=chatterbox node scripts/motor-narrar.mjs <id> en` (Chatterbox en Modal).
3. `node scripts/motor-revisar.mjs <id> --sin-hoja` → "sin avisos" (también mide la duración y las escenas largas).
4. Render solo en la nube: `gh workflow run render-nube -R matiasosuna/mitologias-render -f ids='["<id>"]' -f tipo=short`.
