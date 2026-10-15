# Brief: Shorts nativos (YouTube Shorts + Instagram Reels)

Pedido de Matías (2026-10-09): los Shorts **no son recortes** de los episodios. Son mini-historias escritas para el formato vertical, con su propio guion, voz y render. Pueden salir de los mismos mitos, pero se tienen que **entender solas**, sin haber visto nada.

## Fórmula (lo que funcionó: "The baby who tricked a Titan", 500+ vistas)
1. **Gancho** (frase grande arriba, fija todo el video, ≤ 8 palabras): una situación imposible o un truco. "The baby who tricked a Titan".
2. **0–3 s:** la primera frase narrada plantea el conflicto ya, sin contexto previo. Nada de "In Greek mythology…".
3. **Mini-historia completa:** quién, qué quiere, el obstáculo, **el truco o giro**, y el resultado. 6–10 frases cortas, 25–45 s en total.
4. **Final abierto (desde 2026-10-15):** el Short es el gancho y el episodio el producto. La última frase narrada deja la historia abierta y manda al episodio completo: "How Isis tricked Ra is only half of it. The full story is Episode 5." (temporada 2+: "…is Season 2, Episode 3"). Inglés simple. **Nunca falso:** solo lo que el episodio de verdad sigue contando.
5. **Cartel final** (`cierre`): teaser con suspenso + `<Serie> Mythology S<n>E<m>`, p. ej. "What Ra lost next changed Egypt — Egyptian Mythology S1E5". Temporada y episodio salen de `src/videos/titulos.json` (la entrada del `episodio`, formato `SxEy`).
   Los Shorts ya publicados no se tocan.

## Formato del guion
`src/videos/short-<serie>-<slug>/guion.json` con:
- `"formato": "short"`, `id`, `serie`, `numero: "S"`, `titulo` {es,en}, `tituloGriego` (""),
- `gancho` {es,en} (lo de arriba), `cierre` {es,en} (cartel final: "<teaser con suspenso> — <Serie> Mythology S<n>E<m>", p. ej. "Ra was about to lose everything — Egyptian Mythology S1E5"; en `es`: "… — Mitología egipcia T1E5"), `episodio` (id del episodio relacionado, si hay),
- `escenas`: 2–4 escenas, 2–4 frases cada una, mismo vocabulario que `MOTOR.md`.

**Montaje vertical:** solo se ve una franja de ~860 px del mundo, centrada en `foco` (por defecto 960). Poné la acción **entre x≈700 y x≈1220**, personajes grandes (`escala` 1.1–1.4), máximo 2–3 por escena. Nada importante en los bordes. Usá la actuación nueva: `aparece` con `con`, gestos al hablar, golpe con anticipación, `sorprende`, `asiente`…

## Pasos
1. Escribir el guion (inglés simple y claro; frases ≤ 15 palabras).
2. `node scripts/motor-narrar.mjs <id> en,es` (gasta ~500 caracteres de ElevenLabs por short).
3. `node scripts/motor-revisar.mjs <id>` y mirar `out/<id>/hoja.jpg` (las escenas se ven en horizontal; chequeá que todo esté entre x 700 y 1220).
4. Render: `node scripts/short-render.mjs <id>` → `out/<id>/<id>.mp4`.
