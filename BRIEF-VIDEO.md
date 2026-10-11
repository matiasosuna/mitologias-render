# Brief para producir un video de la serie

Proyecto: `~/Projects/mitologias` (Remotion 4 + React 19, SVG, 1920×1080, 30 fps). Ya existe el video 01 como modelo: **leé completos** `src/griegas/01-origen/guion.json`, `src/griegas/01-origen/escenas.tsx`, `src/comun/comun.tsx`, `src/comun/Video.tsx`, `scripts/narrar.mjs` y `PLAN-GRIEGAS.md` antes de empezar.

## Qué entregar (solo dentro de TU carpeta `src/griegas/NN-slug/`)
1. `guion.json` con el mismo formato que el 01 (`id` = `griegas-NN-slug`, `voz: "Paulina"`, `velocidad: 168`, civilización "Mitología griega", `titulo`, `subtitulo`, 8–10 escenas de 3–6 frases).
   - Español neutro (tú, nada de voseo), narración clara y atrapante, fiel a las fuentes clásicas (Hesíodo, Apolodoro, Ovidio, Píndaro…). Frases de ≤ 140 caracteres (son subtítulos).
   - Duración objetivo 4–6 min.
   - La primera escena engancha con lo que pasó en el video anterior en una frase; la última escena se llama "cierre" y anuncia la próxima historia según PLAN-GRIEGAS.md.
   - Nada de contenido sexual explícito; la violencia del mito se cuenta sin morbo.
2. `npm run narrar -- src/griegas/NN-slug` → genera audio en `public/audio/<id>/` y `timeline.json`.
3. `escenas.tsx`: una componente por escena (exporta `ESCENAS: Record<id, React.FC<Escena>>`), animada y sincronizada con las frases usando `at(i)`/`fin(i)` como en el 01. Estilo: cerámica griega de figuras negras (usa `Fondo`, `Meandro`, `Lienzo`, `Figura`, `Etiqueta`, `Estrellas`, `Olas`, `Templo`, etc. de `comun.tsx`).
   - **No edites `src/comun/` ni `src/Root.tsx` ni otros videos.** Si necesitás componentes nuevos (fuego, águila, buey, arca, gigante…), créalos en tu carpeta (`piezas.tsx`).
   - Cada escena tiene que verse distinta y contar visualmente lo que dice la narración (no figuras quietas): movimiento, cambios de plano, revelaciones sincronizadas, cámara.
   - Reglas de legibilidad aprendidas en el 01: nada de etiquetas en la franja de subtítulos (y > ~880) ni tapando figuras; figuras negras sobre fondo oscuro necesitan `contorno`; el título de escena ocupa arriba al centro los primeros ~4 s.
4. `entrada.tsx` en tu carpeta: un entry point propio de Remotion que registra solo tu composición (copiá el patrón de `src/Root.tsx` + `registerRoot`), para que puedas renderizar sin tocar el Root. Música: `musica/lira-griega.wav` (ya existe, 8 min).
5. Verificación: `npx tsc` sin errores; renderizá stills de cada escena (`npx remotion still src/griegas/NN-slug/entrada.tsx <id> /tmp/... --frame=N`), armá una hoja de contacto con ffmpeg `xstack` y **miralas** con Read; corregí lo que se vea mal (superposiciones, cosas invisibles, escenas vacías). Iterá hasta que se vea bien.
6. Render final: `npx remotion render src/griegas/NN-slug/entrada.tsx <id> out/<id>.mp4 --concurrency=3 --crf=20 --log=error`.

## Reporte final (corto)
Ruta del mp4, duración, lista de escenas, y cualquier problema que no hayas podido resolver.
