# Brief: Shorts "Who is…?" (un personaje por Short)

Pedido de Matías (2026-10-15). Un Short por personaje con diseño oficial (`*_oficial`) de las 4 mitologías principales:
griegas (14, `src/motor/elencoGriegoOficial.tsx`), nórdicas (12, `elencoNordico.tsx`), egipcias (13, `elencoEgipcioOficial.tsx`),
hawaianas (10, `elencoHawaianoOficial.tsx`). Es un Short nativo (`BRIEF-SHORTS.md` vale entero) con un cartel de apertura.

## Qué es
- **Entretenido, no ficha:** UNA gran anécdota de las fuentes que muestra quién es (truco, pelea, castigo, rescate…),
  y después 2–3 rasgos rápidos que lo definen (qué gobierna, qué lleva, cómo se lo reconoce, qué le importa),
  atados a la anécdota ("That's Zeus: the youngest, and the one who fought back."). Nada de listas secas.
- **Nada inventado como hecho.** Anécdota y rasgos salen del PLAN de la serie / fuentes citables; nombrá la fuente o versión
  si hay varias ("Hesiod says…"). Hawaianas: cultura viva → tono cálido y respetuoso, ʻokina y kahakō siempre (sección
  "Respeto y fidelidad" de `PLAN-HAWAIANAS.md`); Kū, Kāne, Lono, Kanaloa y Pele siguen siendo honrados hoy.
- **Nunca repetir una anécdota** ya contada en otro Short (`gancho.en`, `titulo.en`, escenas de todos los `src/videos/short-*/guion.json`).
  Si la anécdota famosa ya está en un Short, elegí otra del personaje.
- **Termina en su episodio:** la última frase manda al episodio donde el personaje brilla ("To see how he freed his brothers,
  watch Season 1, Episode 1."), y el `cierre` es `"<teaser> — <Serie> Mythology S<n>E<m>"` (de `src/videos/titulos.json`;
  en `es`: `"… — Mitología griega T1E1"`). Solo episodios con `S<n>E<m>` (no especiales). Tiene que ser verdad: el episodio
  de verdad muestra a ese personaje haciendo eso. La cola sugiere uno; si no cierra, elegí otro de la misma serie.
- Inglés simple: frases ≤ 15 palabras, una idea por frase, cada nombre raro explicado la primera vez.

## Guion (`src/videos/short-<serie>-quien-<nombre>/guion.json`)
Igual que un Short nativo (`formato: "short"`, `serie`, `numero: "S"`, `tituloGriego: ""`, `episodio`, `cierre`) más:
```json
"quien": {
  "nombre": { "es": "Zeus", "en": "Zeus" },
  "subtitulo": { "es": "Rey de los dioses · señor del rayo", "en": "King of the gods · lord of thunder" },
  "como": "zeus_oficial"
}
```
- `nombre`: como se dice en cada idioma (Atenea/Athena). El cartel muestra "Who is Zeus?" arriba y "ZEUS" grande abajo.
- `subtitulo`: epíteto corto y real, ≤ 46 caracteres en inglés (el test y `motor-revisar` lo validan).
- `como`: la clave oficial. Opcionales: `fondo` (por defecto griegas `monte`, nórdicas `asgard`, egipcias `piramides`,
  hawaianas `playa`) y `escala` (bajala a ~0.86 si el muñeco es muy alto, p. ej. Odín con sombrero y cuervo).
- `gancho.en` = `"Who is <Name>? <gancho ≤ 6 palabras>"` (p. ej. "Who is Zeus? The baby who tricked a Titan"): es el título
  del Short en YouTube y queda arriba toda la historia. `titulo` = lo mismo.
- Duración: 4–5 escenas, 12–15 frases (~60–75 s narrado). Primera frase = conflicto de la anécdota ya (el cartel ya dijo quién es).
- El personaje aparece con su `*_oficial` en todas las escenas donde está; los demás también con su oficial si lo tienen.
  Los oficiales son anchos (brazos y objetos): con 2 actores, x ≈ 730 y 1190; `foco` 960.

## Qué hace el motor
`quien` agrega 2 s al principio (`lib/quien.mjs`, `INTRO_QUIEN`): el cartel con la guarda de la serie, el muñeco grande,
el nombre y el subtítulo; después corta a la historia de siempre (gancho arriba, subtítulos abajo, cartel final).
La narración arranca después del cartel; no hace falta decir "Who is Zeus?" en voz.
Muestra: `npx remotion still src/pruebas/quien.tsx q-muestra out.png --frame=20` (apertura) / `--frame=130` (historia).

## Pasos
Los de RUTINA.md › 4–5: `motor-narrar <id> en`, `motor-revisar <id> --sin-hoja` ("sin avisos"), tests, commit,
`scripts/estado-agregar-shorts.sh <ids>`.
