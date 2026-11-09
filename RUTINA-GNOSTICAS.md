# Rutina de producción en la nube: Gnosis (serie `gnosticas` de Myths on Clay)

Sos una sesión programada de Claude Code en la nube. Cada corrida deja listos los **próximos episodios** de Gnosis, en orden,
para que el workflow `publicar` los renderice y publique solo (turno `gnosticas` a las 00 HST = 10 UTC, 1 episodio por día).
Vos no renderizás ni publicás. No hay nadie mirando: no hagas preguntas; si algo no se puede resolver, dejá la nota (paso 6) y terminá.

## Reglas que no se rompen
- **Leé `PLAN-GNOSTICAS.md` entero antes de escribir**: la lista de episodios, las fuentes y las reglas. Lo más importante:
  - **Se cuenta como verdad** (Matías 2026-11-08): con la voz del texto, nunca "the Gnostics believed", "legend", "myth" ni descargos.
  - **Fiel al texto, sin filtro**: no suavizar, no cambiar, no agregar. Lo duro se dice tal cual (dicho, nunca mostrado).
  - Palabras propias, frase por frase siguiendo el texto (las traducciones modernas de Nag Hammadi tienen derechos): seguí el orden y el contenido de cada sección del libro, sin saltear nada importante de lo que cubre el episodio.
  - El Espíritu Invisible es **solo luz** (`luz_divina`), nunca una persona.
- Sin gancho de intro: cada episodio es UN video largo. Final = una pregunta natural para comentar (`reels.final` y `youtube.final`).
- **Nunca publicar** (subir*, instagram*, tiktok*, buffer-*, youtube-*, nube.mjs turno) ni **renderizar** (motor-render, vertical-*, modal_render.py, gh workflow run).
- **Nunca mostrar secretos** (env, printenv, ~/.modal.toml, URLs de remotes). **No tocar** `.github/workflows/*`, `scripts/cola.mjs`, la rama `estado`, registros (`youtube-ids.json`, `subidas-*.json`, `listas.json`), ni nada de las otras series.
- No reescribir episodios ya publicados. La única IA es esta sesión; voz = Chatterbox vía el workflow voz-cpu de GitHub (Modal); `motor-narrar` lo dispara solo. Nunca correr `modal` directo.

## 1 · Preparar
Igual que el paso 1 de `RUTINA.md` (repo privado, `scripts/nube-setup.sh`, repo público, `.env`). Empezá cada llamada a Bash con `set -a; . ./.env; set +a;`.
Verde antes de producir: `npx tsc --noEmit -p . && node --test test/*.test.mjs`. Si ya falla sin tus cambios → paso 6.

## 2 · Cuántos y cuáles
- Primero, cualquier `src/videos/gnosticas-*` que tenga `guion.json` pero no `timeline.json` o no `VERIFICADO` vigente: narrarlo y validarlo (paso 4) antes de escribir nada nuevo.
- Contá los episodios con `VERIFICADO` que todavía no salieron (no están en `youtube-ids.json`). **Meta: 2 por delante** (sale 1 por día; Matías: "solo lo del día, no trabajar al pedo"). Si ya hay 2 o más, terminá sin cambios.
- Hacé **1 episodio por corrida**, el siguiente de la lista del PLAN. Id: `gnosticas-NN-<slug en español>` (NN con 2 dígitos).

## 3 · Producir cada episodio
Leé antes: `MOTOR.md` (formato y la sección **Gnosis**: fondos, elementos, elenco), `BRIEF-GUION.md` y **`src/videos/gnosticas-01-el-espiritu-invisible/guion.json` como modelo**.
- `guion.json` con la misma forma: `serie: "gnosticas"`, `tempo: 1`, `numero: "NN"`, `titulo` {es,en} (el del PLAN), `tituloGriego: "THE SECRET BOOK OF JOHN · <romano>"` (o el libro de la temporada), `siguiente`, `miniatura` (heroe/rival del elenco de Gnosis), `reels.final` + `reels.tempos.final: 1.08`, `youtube.final`.
- 10–14 escenas de 4–6 frases (≤ 130 caracteres, ≤ 20 palabras, inglés simple; `es` = traducción para subtítulos). La primera frase retoma el episodio anterior; la escena `cierre` anuncia el siguiente + "Thank you for listening to the secret book with me." (o el libro de la temporada).
- Puesta: solo fondos/elementos/elenco que existen (MOTOR.md). Si de verdad falta un personaje con nombre, sumalo al elenco de Gnosis siguiendo el estilo existente, con su test, y anotalo en MOTOR.md.
- `src/videos/titulos.json`: `"<id>": { "titulo": "<titulo.en tal cual> | Gnosis S<t>E<e>", "temporada": <t>, "episodio": <e> }` (agregar al final, sin reordenar el archivo). Temporadas en `TEMPORADAS.gnosticas` de `scripts/titulos.mjs`.

## 4 · Narrar y validar
```bash
node scripts/motor-narrar.mjs <id> en
find public/audio/<id> -name '*.wav' -size 0          # vacío
node scripts/motor-revisar.mjs <id> --sin-hoja        # exactamente "sin avisos"
npx tsc --noEmit -p . && node --test test/*.test.mjs
```
Solo si TODO está en verde: `node scripts/verificado.mjs <id>`. Los episodios salen estrictamente en orden: uno sin verificar frena a los siguientes.

## 5 · Guardar
```bash
git add -A src/videos/gnosticas-* src/videos/titulos.json public/audio/gnosticas-* src/motor MOTOR.md test && git status --short   # nunca .env ni out/
git commit -m "gnosis: <ids>" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin HEAD:main || { git pull --rebase origin main && git push origin HEAD:main; }
scripts/publicar-render.sh
```

## 6 · Si algo falla
No empujes contenido roto ni `VERIFICADO` de un episodio en rojo. Dejá en `NOTAS-GNOSIS.md` una línea
`- <fecha> BLOQUEADO <id>: <qué falló, sin secretos>`, commiteá solo eso (y los episodios en verde), push y terminá.
