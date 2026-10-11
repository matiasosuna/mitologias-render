# Brief: producir un video en estilo "vasija griega detallada"

Proyecto: `~/Projects/mitologias` (Remotion 4 + React 19, SVG, 1920×1080, 30 fps).

## Leé primero (completos)
- `src/comun/vasija.tsx` — la biblioteca del estilo: `Escenario` (cámara + guardas + textura), `Capa` (parallax), `Personaje` (figura de vasija configurable: acción parado/caminar/correr, brazos, mujer, barba, canas, ropa, capa, tocado, objeto, escudo, alas, boca, contorno, gigante…), `Fuego`, `Chispas`, `Estrellas`, `Luna`, `Sol`, `Olivo`, `Monte`, `Templo`, `Olas`, `Nube`, `Relampago`, `Suelo`, `Rotulo`, y utilidades `suave`, `miembro`, `desde`, `lerp`, `Inc`, `Borde`, `ap`, `entre`, `azar`.
- `src/comun/VideoVasija.tsx` — plantilla del video (portada, subtítulos, títulos de escena, cierre).
- `src/pruebas/catalogo/Catalogo.tsx` — ejemplo de uso de personajes.
- `src/pruebas/detalle/Detalle.tsx` — la prueba de 10 s que al usuario le encantó: ese es el nivel de detalle y movimiento buscado.
- `src/griegas/01-origen/guion.json` (formato de guion) y `scripts/narrar.mjs`.
- `PLAN-GRIEGAS.md` — sinopsis de todos los videos y orden.

## Qué entregar (solo dentro de TU carpeta `src/griegas/NN-slug/`)
1. **`guion.json`** (si ya existe, revisalo y mejoralo; si no, escribilo). Formato del 01: `id` = `griegas-NN-slug`, `voz: "Paulina"`, `velocidad: 168`, `civilizacion: "Mitología griega"`, `titulo`, `subtitulo`, 8–10 escenas de 3–6 frases (≤ 130 caracteres cada una). Español neutro (tú, nada de voseo), narración atrapante, fiel a las fuentes clásicas. 4–6 min. La primera frase engancha con el video anterior del plan; la última escena se llama `cierre` y anuncia el siguiente del plan. Sin contenido sexual explícito; violencia sin morbo.
2. `npm run narrar -- src/griegas/NN-slug` → audio + `timeline.json`.
3. **`escenas.tsx`**: exporta `ESCENAS: Record<idEscena, React.FC<EscenaV>>` (tipo de `VideoVasija.tsx`). Cada escena usa `<Escenario dur camara cielo>` y dentro capas con `Capa p=...`, `Suelo`, personajes, etc. Sincronizá lo que pasa con cada frase con `at(i)`/`fin(i)`.
   - **Nivel de detalle alto** (como Detalle.tsx): varios planos de profundidad, movimientos de cámara (`camara={[[0, x0, 1], [dur, x1, 1.1]]}`), personajes que caminan/corren/gesticulan, luz (fuego, halos), partículas, apariciones sincronizadas. Ninguna escena quieta o vacía; cada una distinta.
   - Criaturas, animales, objetos o lugares que no estén en la biblioteca: creálos en `piezas.tsx` dentro de tu carpeta con la misma técnica (siluetas negras con `suave`/`miembro`, incisiones crema con `Inc`, púrpura y blanco añadidos con `Borde`).
   - Mujeres: piel blanca (por defecto en `Personaje`), como en la cerámica real. Personajes negros sobre fondos oscuros (`cielo="noche"`/`"inframundo"`) llevan `contorno`.
   - Legibilidad: la escena visible va de y≈126 (debajo de las guardas) a y≈830 (friso inferior); los pies van en `SUELO` (790). Nada importante fuera de esa ventana. Los subtítulos y títulos de escena los pone la plantilla. Los `Rotulo` (nombres) arriba de los personajes, sin tapar caras.
   - **No edites `src/comun/`, `src/Root.tsx`, `src/pruebas/` ni carpetas de otros videos** (hay otros agentes trabajando en paralelo). Si encontrás un bug en la biblioteca, contornealo en tu carpeta y mencionálo en el reporte.
4. **`entrada.tsx`**:
   ```tsx
   import React from 'react';
   import { Composition, registerRoot } from 'remotion';
   import { VideoVasija } from '../../comun/VideoVasija';
   import guion from './guion.json';
   import tl from './timeline.json';
   import { ESCENAS } from './escenas';
   const Comp = () => <VideoVasija guion={guion} timeline={tl as any} escenas={ESCENAS} numero="NN" />;
   registerRoot(() => <Composition id="griegas-NN-slug" component={Comp} durationInFrames={tl.total} fps={30} width={1920} height={1080} />);
   ```
5. **Verificación**: `npx tsc` sin errores. Stills de cada escena en 2 momentos (`npx remotion still src/griegas/NN-slug/entrada.tsx <id> <scratch>/fN.png --frame=N --log=error`), hoja de contacto con ffmpeg `xstack`, **miralas** con Read y corregí todo lo que se vea mal (superposiciones, cosas invisibles, cortadas, vacías, personajes flotando). Iterá hasta que quede al nivel de Detalle.tsx.
6. **Render final**: `npx remotion render src/griegas/NN-slug/entrada.tsx <id> out/<id>.mp4 --concurrency=2 --crf=20 --log=error` (concurrency 2: hay otros renders en paralelo). Esperá a que termine (puede tardar; corrélo en primer plano con timeout largo o en background y esperá su notificación).

## Reporte final (corto, en español)
Ruta del mp4, duración, escenas, y problemas sin resolver.
