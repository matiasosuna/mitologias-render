# Brief: escribir un guion visual (sin código)

Proyecto: `~/Projects/mitologias`. Leé `MOTOR.md` (formato y vocabulario) y el ejemplo `src/videos/griegas-02-prometeo/guion.json`.

## Tarea
1. Crear `src/videos/<id>/guion.json` para el video indicado. Si existe un guion viejo en `src/griegas/<NN-slug>/guion.json`, usá su texto en español como base (revisalo: fiel a las fuentes, español neutro, frases ≤130 caracteres) y traducilo al inglés (`en`, inglés natural de narrador, no literal). Solo `es` y `en` por ahora.
2. Contá la historia de forma natural, con enganche al episodio anterior; los "y por eso…" solo si salen solos de la fuente (ver MOTOR.md). 8–10 escenas, 3–6 frases cada una, 4–5 minutos aprox. (es orientativo: pasarse un poco está bien; NUNCA re-narrar solo para recortar duración). La primera frase engancha con el video anterior; la última escena `cierre` anuncia el siguiente según el plan de la serie (`PLAN-GRIEGAS.md` o `PLAN-NORDICAS.md`). Para nórdicas, el ejemplo es `src/videos/nordicas-01-fuego-y-hielo/guion.json` y la sección Nórdicas de MOTOR.md.
   **Narración fácil de entender (pedido de Matías, 2026-10-08):** inglés simple y claro, como para alguien que no sabe nada del tema. Frases cortas (idealmente ≤ 20 palabras), una idea por frase, palabras comunes; cada nombre raro (dios, lugar, objeto) se explica en pocas palabras la primera vez que aparece ("Thoth, the god of wisdom"). Nada de listas de nombres seguidos. La voz se estira sola al 90 % (`TEMPO_EN` en lib/motor-tiempos.mjs) y hay pausas más largas entre frases.
   **Invitar a comentar (natural):** como máximo UNA pregunta del narrador a mitad del episodio, justo después del momento más fuerte y ligada a la historia ("Would you have forgiven her?"), y una al final antes de anunciar el siguiente. Nunca genérico ni "like and subscribe".
3. Imágenes: cada frase con algo que se vea (entradas, gestos, efectos, cámara). Usá solo el vocabulario de `MOTOR.md`. Rótulos de escena como {es, en} en mayúsculas.
4. `node scripts/motor-narrar.mjs <id> en,es` (voz de Matías en inglés por ElevenLabs; gasta créditos, así que corrélo UNA vez con el guion terminado).
5. `node scripts/motor-revisar.mjs <id>` → corregí todos los avisos y mirá `out/<id>/hoja.jpg` con Read; si algo se ve mal (fuera de cuadro, encimado, escena vacía), ajustá el JSON y volvé a revisar (re-narrar solo regenera frases cuyo texto cambió).
6. Agregá 2–3 `shorts` (ver sección Shorts de MOTOR.md) y mirá un cuadro de cada uno: `npx remotion still src/motor/entrada.tsx <id>-short-N /tmp/s.jpg --frame=120 --scale=0.4`.
7. Creá `src/videos/<id>/youtube.json` con `gancho` (2 frases en inglés), `capitulos` (un título corto en inglés por escena), `siguiente` y `etiquetas` (5–8).
8. **NO renderices** y no toques `src/motor`, `src/comun` ni otros videos.

## Reporte (corto)
Id, duración, escenas y avisos que no pudiste resolver.
