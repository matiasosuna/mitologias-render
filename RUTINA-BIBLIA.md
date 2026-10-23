# Rutina de producción en la nube: la Biblia (serie `biblia` de Myths on Clay)

Sos una sesión programada de Claude Code en la nube. Cada corrida deja listos los **próximos capítulos** de la Biblia (KJV), en orden,
para que el workflow `publicar` los renderice y publique solo (turnos `biblia` 12/16/20 HST, 1 capítulo por turno).
Vos no renderizás ni publicás. No hay nadie mirando: no hagas preguntas; si algo no se puede resolver, dejá la nota (paso 6) y terminá.

## Reglas que no se rompen
- **Texto bíblico = KJV palabra por palabra, completo, sin saltear ni cambiar nada** (lo verifica `test/biblia-texto.test.mjs` contra `kjv.json`).
  Lo único en palabras propias: escenas `significado`/`significado2` ("What does it mean?", neutral, sin denominación), `original` ("In the original": 1–3 notas del hebreo/griego) y `cierre`.
- **El nombre YHWH no se pronuncia nunca**: nada de "Jehovah"/"Yahweh". Si hace falta: "God's personal name, the four letters YHWH". Nada de hebreo en pantalla.
- **Dios nunca es una persona**: solo luz (`luz_divina`), resplandor o rayos.
- **Gancho de intro SIEMPRE (aprobado por Matías 2026-10-22, todos los capítulos menos Génesis 1)**, texto exacto:
  "Ever wanted to know what the Bible actually says? Without anyone telling you what to believe? I tell it as simple stories, with the exact words, as it was written. No interpretation." + "Today: <Book> <N>, <título corto>." (YouTube, parte 1 de IG y TikTok);
  partes 2+ de IG solo "<Book> <N>, part 2." / "part 3." … Lo arma `node scripts/marco-biblia.mjs <id>` (no escribirlo a mano); voz desde el cuadro 0, ≤ ~11 s (lo verifica `test/biblia-gancho.test.mjs`).
- Sin invitaciones, sin grupo, sin "comment …" fuera del final. Final = una pregunta natural para comentar (`reels.final` y `youtube.final`).
- Violencia y sexo: dichos con el texto KJV, nunca mostrados.
- **Nunca publicar** (subir*, instagram*, tiktok*, buffer-*, youtube-*, nube.mjs turno) ni **renderizar** (motor-render, vertical-*, modal_render.py, gh workflow run).
- **Nunca mostrar secretos** (env, printenv, ~/.modal.toml, URLs de remotes). **No tocar** `.github/workflows/*`, `scripts/cola.mjs`, la rama `estado`, registros (`youtube-ids.json`, `subidas-*.json`, `listas.json`), ni nada de las otras series.
- No reescribir capítulos ya hechos. La única IA es esta sesión; voz = Chatterbox en Modal.

## 1 · Preparar
Igual que el paso 1 de `RUTINA.md` (repo privado, `scripts/nube-setup.sh`, repo público, `.env`). Empezá cada llamada a Bash con `set -a; . ./.env; set +a;`.
Verde antes de producir: `npx tsc --noEmit -p . && node --test test/*.test.mjs`. Si ya falla sin tus cambios → paso 6.

## 2 · Cuántos y cuáles
- Contá los capítulos con `VERIFICADO` que todavía no salieron (no están en `youtube-ids.json`). **Meta: 9 por delante** (3 días). Si ya hay 9 o más, terminá sin cambios.
- Hacé **hasta 3 capítulos por corrida**, en orden: el siguiente al último `src/videos/biblia-<libro>-NN` que exista. Génesis tiene 50; después Exodus (40), Leviticus…
- Id: `biblia-<libro en inglés, minúsculas>-<NN con 2 dígitos>` (`biblia-genesis-02`). Libro nuevo = temporada nueva (Exodus = Season 2).

## 3 · Producir cada capítulo
Leé antes: `MOTOR.md` (sección de la serie `biblia`: fondos, elementos, elenco), `BRIEF-GUION.md`, y **`src/videos/biblia-genesis-01/guion.json` como modelo exacto**.
1. Texto: `curl -s "https://bible-api.com/<Libro>+<N>?translation=kjv" > src/videos/<id>/kjv.json` (verificá que tenga `verses`).
2. `guion.json` con la misma forma que genesis-01: `serie: "biblia"`, `tempo: 1`, `numero: "NN"`, `titulo` {es,en} `"<Book> <N>: <título corto y descriptivo>"`,
   `tituloGriego: "<BOOK> · CHAPTER <N>"`, `siguiente`, `miniatura` (heroe/rival del elenco `_biblia`), `reels.final` + `reels.tempos.final: 1.08`, `youtube.final`.
   - **Escenas del capítulo**: el texto KJV completo partido en frases (cortar solo en puntuación, ≤ 130 caracteres, `en` y `es` iguales = el texto KJV). Una escena por momento (4–6 frases), imagen nueva cada ~5–9 s.
   - Después `significado` (+ `significado2` si hace falta), `original` y `cierre` (anuncia el próximo capítulo + "Thank you for reading the Bible with me, one chapter at a time."). Inglés simple, frases ≤ 20 palabras; `es` = traducción para subtítulos.
   - Puesta: solo fondos/elementos/elenco que existen (MOTOR.md). Si una escena necesita algo que no hay, usá lo más cercano que exista; **si de verdad falta** (p. ej. un personaje con nombre), podés sumar al elenco/fondos de `src/motor/elencoBiblia.tsx`/`fondosBiblia.tsx` siguiendo el estilo existente, con su test, y anotarlo en MOTOR.md.
3. **Gancho**: `node scripts/marco-biblia.mjs <id>` (agrega `reels.ganchos` + `reels.pausas` + `reels.tempos.gancho` y `youtube.gancho`; necesita el `titulo.en` "<Book> <N>: <título corto>").
4. `src/videos/titulos.json`: `"<id>": { "titulo": "<titulo.en tal cual> | The Bible S<temporada>E<N>", "temporada": <libro: Genesis=1, Exodus=2…>, "episodio": <N> }`.

## 4 · Narrar y validar
```bash
node scripts/marco-biblia.mjs <id>                   # de nuevo: con el timeline ya sabe cuántas partes hay
node scripts/motor-narrar.mjs <id> en
find public/audio/<id> -name '*.wav' -size 0          # vacío
node scripts/motor-revisar.mjs <id> --sin-hoja        # exactamente "sin avisos"
npx tsc --noEmit -p . && node --test test/*.test.mjs
```
Solo si TODO está en verde: `node scripts/verificado.mjs <id>` (guarda la huella de guion+timeline; un VERIFICADO vacío o de un guion viejo no sirve; si después tocás guion o timeline, volvé a correrlo). Los capítulos salen estrictamente en orden: uno sin verificar frena a los siguientes.

## 5 · Guardar
```bash
git add -A src/videos public/audio src/motor MOTOR.md test && git status --short   # nunca .env ni out/
git commit -m "biblia: <ids>" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin HEAD:main || { git pull --rebase origin main && git push origin HEAD:main; }
scripts/publicar-render.sh
```

## 6 · Si algo falla
No empujes contenido roto ni `VERIFICADO` de un capítulo en rojo. Descartá ese capítulo, dejá en `NOTAS-BIBLIA.md` una línea
`- <fecha> BLOQUEADO <id>: <qué falló, sin secretos>`, commiteá solo eso (y los capítulos en verde), push y terminá.
