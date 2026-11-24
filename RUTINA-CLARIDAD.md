# Rutina de claridad (Myths on Clay, desde 2026-11-24)

Sos una sesión programada de Claude Code en la nube. Instagram publica 6 episodios por día, uno de cada serie
(gnosticas, biblia, griegas, nordicas, egipcias, hawaianas), en orden desde el E1, en horizontal. Un episodio solo sale si
su guion tiene `"claridad": true`. Tu trabajo: dejar con esa marca los **próximos 2 de cada serie**, reescritos para que
se entiendan. No hay nadie mirando: no hagas preguntas; si algo no se puede resolver, anotalo (paso 5) y terminá.

## Reglas que no se rompen
- Todas las de `RUTINA.md` › «Reglas que no se rompen» (nunca publicar, nunca renderizar, nunca mostrar secretos, no tocar
  workflows ni registros, voz solo con `motor-narrar`). Además: no tocar `COLA-PRODUCCION.md` ni escribir "Who is…?".
- **`CLARIDAD.md` manda** sobre cualquier otra guía. Fiel a la fuente: sacar detalles está bien, agregar interpretación no.
- Gnosis y Biblia se cuentan como verdad (ver `PLAN-GNOSTICAS.md`, `RUTINA-BIBLIA.md`). Biblia: el texto KJV va palabra
  por palabra (lo exige `test/biblia-texto.test.mjs`); lo que se reescribe para que se entienda es `significado`,
  `original` y `cierre`.
- Solo lo que hace falta: como máximo 4 episodios por corrida, y solo los que da `pendientes`.

## 1 · Preparar
Igual que `RUTINA.md` › «1 · Preparar» (clones, `scripts/nube-setup.sh`, `.env`, tests en verde antes de empezar).
Después traé el estado y la cola: `scripts/estado-traer.sh && node scripts/nube.mjs cola`.

## 2 · Elegir
`node scripts/nube.mjs pendientes` → los próximos 2 de cada serie que todavía no tienen la marca, en orden. Si no sale
nada, terminá sin cambios. Tomá los primeros 4 (el primero de cada serie va antes que el segundo de otra).

## 3 · Reescribir cada uno
Leé `CLARIDAD.md`, `MOTOR.md` (formato + sección de la serie) y el `PLAN-<SERIE>.md`. Mirá el E1 de la misma serie como
ejemplo de cómo quedó (ya reescrito). Reescribí las frases `en` y `es` del guion siguiendo CLARIDAD.md:
- arranque que se sostiene solo (nada de «Last time…»), una historia en orden, causa y efecto, máximo 4–5 nombres,
  sin misterio ni ganchos, sin comentarios de estudiosos, frases ≤ 15 palabras, cosas raras explicadas, cierre que resume;
- ajustá los `en` de los `pasos` si cambia el número de frases de una escena; si un personaje queda sin nombre en el texto,
  `"rotulo": ""`; si sale del texto, sacalo de la escena; solo elenco/fondos que ya existen;
- hacé la lectura final de CLARIDAD.md («Antes de dar por terminado») con todas las frases `en` seguidas.

## 4 · Narrar, validar y marcar
```bash
node scripts/motor-narrar.mjs <id> en
find public/audio/<id> -name '*.wav' -size 0            # tiene que salir vacío
node scripts/motor-revisar.mjs <id> --sin-hoja          # exactamente "sin avisos"
npx tsc --noEmit -p . && node --test test/*.test.mjs
```
Solo si TODO está en verde: agregá `"claridad": true` en la raíz del guion y, si la serie usa VERIFICADO (Biblia, Gnosis),
`node scripts/verificado.mjs <id>` (después de marcar). Commit por episodio: `Claridad: <id>`, push a `main` del privado y
`scripts/publicar-render.sh` (sincroniza el público). El workflow `publicar` renderiza el horizontal y lo publica en su turno.

## 5 · Si algo falla
No marques ni empujes un guion a medias (`git checkout -- src/videos/<id>`). Dejá una línea en `NOTAS-CLARIDAD.md`
del privado (fecha, id, qué falló), commit y push, y seguí con el siguiente.
