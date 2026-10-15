# Rutina de producción en la nube (Myths on Clay)

Sos una sesión programada de Claude Code en la nube. Cada corrida produce **UN ítem** de `COLA-PRODUCCION.md` y lo deja listo
para que el workflow `publicar` del repo público lo renderice y publique solo. Vos no renderizás videos ni publicás nada.
No hay nadie mirando: no hagas preguntas; si algo no se puede resolver, dejá la nota (paso 6) y terminá.

## Reglas que no se rompen
- **Nunca publicar** en YouTube, Instagram, TikTok, Buffer ni Pinterest (ni scripts `subir*`, `instagram*`, `tiktok*`, `buffer-*`, `youtube-*`, `nube.mjs yt|ig|episodio|especial`). Eso lo hace el workflow `publicar`.
- **Nunca renderizar** videos (`motor-render`, `short-render`, `vertical-*`, `modal_render.py`, `gh workflow run`). Hetzner prohibido.
- **Nunca mostrar secretos**: no `env`, `printenv`, `set`, `cat ~/.modal.toml`, `git remote -v` ni `echo` de URLs de remotes (pueden llevar credenciales). MODAL_TOKEN_ID/SECRET ya están en el entorno: Modal los lee solo.
- **No tocar** `.github/workflows/*`, secretos, ni los registros (`youtube-ids.json`, `subidas-*.json`, `listas.json`, `pinterest-pines.json`, `meta-youtube*.json` existentes, la rama `estado`) salvo **agregar** ids de Shorts con `scripts/estado-agregar-shorts.sh`. No borrar ni reescribir videos/guiones ya existentes.
- La única IA es esta sesión: **no** llamar a la API de Anthropic, Gemini ni ElevenLabs. Voz = Chatterbox en Modal (crédito gratis; cada narración es corta).
- Contenido **solo en inglés** narrado (el `es` del guion se escribe como texto para subtítulos, no se narra).
- Si la validación falla y no la podés arreglar: **no** empujes contenido roto (paso 6).

## 1 · Preparar (cada corrida)
```bash
# repo privado = el clon de matiasosuna/mitologias (el único con lib/voz-matias-ref.wav; el público también tiene RUTINA.md)
for d in "$PWD" $(find / -maxdepth 4 -type d -name mitologias -not -path '*/node_modules/*' 2>/dev/null); do [ -f "$d/lib/voz-matias-ref.wav" ] && cd "$d" && break; done
git checkout -q main && git pull -q --ff-only origin main
scripts/nube-setup.sh                          # ffmpeg, rsync, libs de Chrome, Modal en /opt/moc-venv, npm ci (idempotente)
# repo público = el clon de matiasosuna/mitologias-render (si no está, clonarlo con la misma URL/proxy que el privado)
R=$(find / -maxdepth 4 -type d -name mitologias-render -not -path '*/node_modules/*' 2>/dev/null | head -1)
[ -n "$R" ] || { R=$HOME/Projects/mitologias-render; git clone -q "$(git remote get-url origin | sed -E 's#mitologias(\.git)?$#mitologias-render\1#')" "$R"; }
git -C "$R" checkout -q main && git -C "$R" pull -q --ff-only origin main
# .env local (gitignored, sin secretos) para que cada comando lo cargue: el estado del shell no se guarda entre llamadas
printf 'VOZ_EN=chatterbox\nMODAL_BIN=/opt/moc-venv/bin/modal\nMOC_RENDER_DIR=%s\nESTADO_REPO=%s\n' "$R" "$(git -C "$R" remote get-url origin)" > .env
git config user.email >/dev/null || { git config user.name matiasosuna; git config user.email 62261687+matiasosuna@users.noreply.github.com; }
```
Empezá cada llamada a Bash con `set -a; . ./.env; set +a;` (desde la raíz del repo privado).
Comprobá que todo está verde **antes** de producir: `npx tsc --noEmit -p . && node --test test/*.test.mjs`. Si ya falla sin tus cambios, anotalo (paso 6) y terminá.

## 2 · Elegir el ítem
El primer `- [ ]` de `COLA-PRODUCCION.md`. Si tiene una nota `> BLOQUEADO`, leela y evitá ese problema. Si no queda ninguno, terminá sin cambios.
Leé antes de escribir: `BRIEF-SHORTS.md` (Shorts), `BRIEF-GUION.md` (episodios), `MOTOR.md` (formato + la sección de la serie), el `PLAN-<SERIE>.md` y 1–2 guiones existentes de la misma serie como ejemplo (para Shorts, también `src/videos/short-hawaianas-hiku/guion.json`).

## 3 · Producir
**Reglas de la casa (todo):** inglés simple (frases ≤ 15 palabras en Shorts, ≤ 20 en episodios, una idea por frase, cada nombre raro explicado la primera vez); ganchos de curiosidad; **nada inventado presentado como hecho**: seguí las fuentes del PLAN de la serie y nombrá la versión/pueblo/fuente cuando corresponda ("in one Haudenosaunee telling…"); respetá la sección "Respeto y fidelidad" de cada PLAN (violencia y sacrificio dichos, nunca mostrados; sin contenido sexual). "That's why…" solo si sale de la fuente. Nada de otros proyectos ni datos personales en el contenido.

### Shorts nativos (ítems S…)
Para cada episodio del ítem, **3 Shorts distintos** (momentos o personajes distintos del episodio, no el mismo con otro gancho):
- **Nunca repetir una historia** (pedido de Matías): antes de escribir, leé `gancho.en`, `titulo.en` y el `episodio` de TODOS los `src/videos/short-*/guion.json` existentes. Un Short nuevo no puede contar la misma anécdota, el mismo momento ni el mismo giro que otro ya hecho (aunque cambie el gancho o la mitología), ni resumir el episodio entero: es una mini historia de UN momento puntual. Si un episodio no da 3 momentos nuevos, hacé menos y anotalo en la cola.
- Id `short-<serie>-<slug>` (slug corto en español, sin acentos, que no exista ya en `src/videos/`).
- `guion.json` como `short-hawaianas-hiku`: `formato: "short"`, `serie`, `numero: "S"`, `titulo`/`gancho` {es,en} (gancho ≤ 8 palabras, situación imposible o truco), `tituloGriego: ""`, `episodio: "<id del episodio>"`, `cierre` {es,en} = teaser con suspenso + el episodio: `"<teaser cliffhanger> — <Serie> Mythology S<n>E<m>"` (temporada/episodio de la entrada del `episodio` en `src/videos/titulos.json`, formato `SxEy`; en `es`: `"… — Mitología <serie> T<n>E<m>"`). No copies el formato viejo `Ep. <N>` de los Shorts existentes (y no los reescribas).
- 3–4 escenas, 9–12 frases en total (~45–60 s narrado): primera frase = conflicto ya (nada de "In X mythology…"), quién/qué quiere/obstáculo/giro/resultado.
- **Última frase = final abierto que manda al episodio** (el Short es el gancho, el episodio el producto): "How Isis tricked Ra is only half of it. The full story is Episode 5." (temporada 2+: "…Season 2, Episode 3"). Inglés simple y **nunca falso**: el episodio tiene que seguir de verdad esa historia; si no, elegí otro momento.
- Puesta: acción entre x 700 y 1220, `foco` 960, `escala` 1.1–1.4, 2–3 actores por escena; solo fondos/elementos/elenco que existen para la serie (MOTOR.md y los archivos `src/motor/fondos<Serie>.tsx` / `elenco<Serie>.tsx`).

### Episodios (ítems M/C/Y 02–04)
Según `BRIEF-GUION.md` y el PLAN: `src/videos/<serie>-NN-<slug>/guion.json` (8–10 escenas, 3–6 frases, `miniatura`, 2–3 `shorts` de recorte, enganche con el anterior y anuncio del siguiente; **la escena final siempre le pregunta algo al público ligado a la historia**, p. ej. "Which god would you trust? Tell us in the comments.", antes de anunciar el siguiente), `youtube.json` (gancho, un capítulo por escena, siguiente, etiquetas) y una entrada en **`src/videos/titulos.json`** con el formato de las demás:
`"<serie>-NN-<slug>": { "titulo": "<título curioso, ≤ 70 caracteres, sin MAYÚSCULAS enteras> | <Serie> Mythology S1E<N>", "temporada": 1, "episodio": <N> }` (≤ 100 caracteres en total, sin repetir partes curiosas; lo valida `test/titulos.test.mjs`).

### Serie nueva (ítems M01/C01/Y01)
Hacela igual que `aztecas`/`hindues`/`maories` (commit `259c810` como guía):
- `PLAN-<SERIE>.md` con estilo, fuentes reales y citables, "Respeto y fidelidad", y T1 de 12 episodios con enganches.
- Tema propio: `src/comun/<tema>.tsx` (franjas/guardas) + `aplicarTema` en `src/comun/vasija.tsx`; `src/motor/fondos<Serie>.tsx` (con `FONDOS_X` y `ELEMENTOS_X` exportados) y `src/motor/elenco<Serie>.tsx` (`ELENCO_X`, `NOMBRE_EN_X`); tipos en `src/motor/tipos.ts`.
- Música `scripts/musica-<x>.mjs` → `public/musica/<x>.wav` (generada por código, sin copiar piezas ni cantos ceremoniales).
- Registro: `grep -rln -E "maories|kowhaiwhai" scripts src/motor src/comun` y sumá la serie en cada lugar igual que `maories` (motor-revisar, motor-render, modal_render.py, miniatura, portadaIG, Short/ShortNativo/VideoMotor/VideoVertical, titulos.mjs `NOMBRES`/`TEMPORADAS`, subir, youtube-meta + `src/videos/meta-youtube-<serie>.json`, portadas-ig, buffer-tiktok, instagram*.mjs `SERIE`). **Excepto** las listas que deciden qué se publica (`SERIES_EPISODIOS` y `ORDEN`/`T1` en `nube.mjs` e `instagram-*.mjs`): esas se suman al final recién en el ítem de los episodios 9–12, con la T1 completa.
- Sección en `MOTOR.md` (vocabulario) y `test/<serie>.test.mjs` como `test/maories.test.mjs`, que pase con la temporada a medio hacer (≤ 12 episodios, números seguidos).
- Si `npx remotion still` funciona en la máquina, mirá un cuadro del elenco/fondos con Read; si no, seguí (no es obligatorio).

## 4 · Narrar (solo inglés) y validar
Por cada id nuevo:
```bash
node scripts/motor-narrar.mjs <id> en                 # Chatterbox en Modal; reusa lo ya narrado
find public/audio/<id> -name '*.wav' -size 0          # tiene que salir vacío; si no, volvé a correr motor-narrar (borra y re-narra los vacíos)
node scripts/motor-revisar.mjs <id> --sin-hoja        # tiene que decir exactamente "sin avisos": corregí el guion y re-narrá si cambió texto
```
Al final, todo junto: `npx tsc --noEmit -p . && node --test test/*.test.mjs`. Si Modal falla dos veces seguidas, o algo no queda en verde → paso 6.

## 5 · Guardar y entregar
```bash
git add -A src/videos public/audio src/motor/indice.ts <archivos de código/plan/música que tocaste> && git status --short   # nunca .env ni out/
git commit -m "<ítem>: <qué se hizo>" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin HEAD:main || { git pull --rebase origin main && git push origin HEAD:main; }
scripts/publicar-render.sh                             # copia al repo público (usa MOC_RENDER_DIR)
scripts/estado-agregar-shorts.sh <ids de los Shorts nativos nuevos>   # solo ítems S: suma al final del orden, intercalados
```
Después marcá el ítem en `COLA-PRODUCCION.md` → `- [x] S01 · … — HECHO 2026-10-14: short-…, short-…` (todos los ids), commit y push a `main` igual que arriba.

## 6 · Si algo falla
No empujes contenido roto. Descartá lo producido (`git stash -u` o `git checkout -- . && git clean -fd src/videos public/audio`), agregá debajo del ítem
`> BLOQUEADO <fecha>: <qué falló, en una línea, sin secretos>`, commiteá solo `COLA-PRODUCCION.md`, push a `main` y terminá.

## Tamaño
Un ítem por corrida: 6–9 Shorts o 4 episodios. Si un ítem de serie nueva no entra, terminá lo que se pueda validar en verde, empujalo,
y partí el ítem en la cola (lo hecho `[x]`, lo que falta como ítem nuevo `[ ]` justo debajo).
