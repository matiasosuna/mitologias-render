# Brief: Shorts nativos (YouTube Shorts + Instagram Reels)

Pedido de Matías (2026-10-09): los Shorts **no son recortes** de los episodios. Son mini-historias escritas para el formato vertical, con su propio guion, voz y render. Pueden salir de los mismos mitos, pero se tienen que **entender solas**, sin haber visto nada.

## Fórmula (lo que funcionó: "The baby who tricked a Titan", 500+ vistas)
1. **Gancho** (frase grande arriba, fija todo el video, ≤ 8 palabras): una situación imposible o un truco. "The baby who tricked a Titan".
2. **0–3 s:** la primera frase narrada plantea el conflicto ya, sin contexto previo. Nada de "In Greek mythology…".
3. **Mini-historia completa:** quién, qué quiere, el obstáculo, **el truco o giro**, y el resultado. 6–10 frases cortas, 25–45 s en total.
4. **Remate:** la última frase cierra con algo memorable (una consecuencia, una ironía, "y por eso…" solo si es natural).
5. **Cartel final** (`cierre`): el título del episodio completo, para que vayan a verlo.

## Formato del guion
`src/videos/short-<serie>-<slug>/guion.json` con:
- `"formato": "short"`, `id`, `serie`, `numero: "S"`, `titulo` {es,en}, `tituloGriego` (""),
- `gancho` {es,en} (lo de arriba), `cierre` {es,en} (cartel final, p. ej. "The Origin of the World — Greek Mythology Ep. 1"), `episodio` (id del episodio relacionado, si hay),
- `escenas`: 2–4 escenas, 2–4 frases cada una, mismo vocabulario que `MOTOR.md`.

**Montaje vertical:** solo se ve una franja de ~860 px del mundo, centrada en `foco` (por defecto 960). Poné la acción **entre x≈700 y x≈1220**, personajes grandes (`escala` 1.1–1.4), máximo 2–3 por escena. Nada importante en los bordes. Usá la actuación nueva: `aparece` con `con`, gestos al hablar, golpe con anticipación, `sorprende`, `asiente`…

## Pasos
1. Escribir el guion (inglés simple y claro; frases ≤ 15 palabras).
2. `node scripts/motor-narrar.mjs <id> en,es` (gasta ~500 caracteres de ElevenLabs por short).
3. `node scripts/motor-revisar.mjs <id>` y mirar `out/<id>/hoja.jpg` (las escenas se ven en horizontal; chequeá que todo esté entre x 700 y 1220).
4. Render: `node scripts/short-render.mjs <id>` → `out/<id>/<id>.mp4`.
