# Brief: Shorts "Who is…?" (un personaje por Short)

Pedido de Matías (2026-10-15). Un Short por personaje con diseño oficial (`*_oficial`) de las 4 mitologías principales:
griegas (14, `src/motor/elencoGriegoOficial.tsx`), nórdicas (12, `elencoNordico.tsx`), egipcias (13, `elencoEgipcioOficial.tsx`),
hawaianas (10, `elencoHawaianoOficial.tsx`). Es un Short nativo (`BRIEF-SHORTS.md` vale entero) con un cartel de apertura.

## Qué es (desde 2026-10-15: presenta QUIÉN es, no una sola historia)
1. **Cold open** (`coldOpen`, 1–2 frases): el dato más impactante del personaje, sobre su imagen más fuerte.
   "The king of the gods started life hiding in a cave. Because his father swallowed his brothers and sisters."
2. **Cartel "WHO IS ZEUS?"** (1,5 s, sin voz).
3. **Quién es**, rápido y vivo, cada punto una imagen concreta (una escena por punto), nunca una lista seca:
   - su rol y dominio (rey de los dioses: cielo, trueno, justicia y juramentos);
   - de dónde viene (hijo menor de Cronos, salvado por Rea, criado en una cueva);
   - cómo llegó a lo que es (liberó a los cíclopes, el rayo, venció a los titanes) en 1–2 frases;
   - sus símbolos (rayo, águila, roble, égida);
   - su familia (pareja, hermanos, el sorteo; hijos más conocidos);
   - su carácter: lo bueno y lo malo (poderoso y justo, pero orgulloso e infiel), siempre apto para todo público.
4. **Remate memorable** sobre el personaje (mejor si cierra el cold open: "…the hidden baby became king of everything.")
   y después el puntero al episodio.
- **Datos esenciales completos y correctos (pedido de Matías: "¿no tenía más hermanos?"):** familia entera (padres,
  TODOS los hermanos con nombre, pareja, hijos más conocidos con nombre), dominio, símbolos y cómo llegó a su rol.
  No se recorta un dato esencial: se agrupan en frases rápidas ("Hestia, Demeter, Hera, Hades and Poseidon.").
- Ritmo y picos emocionales de `BRIEF-SHORTS.md` (voz rápida, una imagen cada ~5–9 s, frases cortas).
- **Nada inventado como hecho.** Anécdota y rasgos salen del PLAN de la serie / fuentes citables; nombrá la fuente o versión
  si hay varias ("Hesiod says…"). Hawaianas: cultura viva → tono cálido y respetuoso, ʻokina y kahakō siempre (sección
  "Respeto y fidelidad" de `PLAN-HAWAIANAS.md`); Kū, Kāne, Lono, Kanaloa y Pele siguen siendo honrados hoy.
- Los datos de su vida pueden coincidir con otros Shorts (es su biografía), pero dichos en 1–2 frases; el gancho y el
  cold open no pueden copiar el de otro Short (`gancho.en`, `titulo.en` de todos los `src/videos/short-*/guion.json`).
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
- `gancho.en` = `"Who is <Name>? <gancho ≤ 6 palabras>"` (p. ej. "Who is Zeus? The baby who became king"): es el título
  del Short en YouTube y queda arriba desde que arranca la historia. `titulo` = lo mismo.
- `coldOpen`: como en `BRIEF-SHORTS.md` (1–2 frases, su propia puesta).
- Duración: 45–65 s; hasta ~75 s si hace falta para que esté completo. ~10–12 escenas de 1–3 frases, ~25 frases cortas
  (~200 palabras). `motor-revisar` avisa si pasa de 75 s.
- El personaje aparece con su `*_oficial` en todas las escenas donde está; los demás también con su oficial si lo tienen
  (`hera_oficial`, `poseidon_oficial`, `hades_oficial`, `cronos_oficial`…). Los oficiales son anchos (brazos y objetos):
  con 2 actores, x ≈ 730 y 1190; con 3, ≈ 690 / 960 / 1230 y `escala` 0.85; `foco` 960. `escala` ≤ 1 siempre (con
  más, el brazo levantado se corta arriba). Para nombrar muchos (hijos), que vayan apareciendo de a 3 con `aparece`/`desaparece`.

## Qué hace el motor
Cold open → cartel de 1,5 s (`lib/quien.mjs`, `INTRO_QUIEN`; `timeline.cartelFrom`/`cartelFrames`) con la guarda de la
serie, el muñeco grande, el nombre y el subtítulo → la historia (gancho arriba, subtítulos abajo, cartel final).
El cartel no lleva voz; no hace falta decir "Who is Zeus?". Ejemplo completo: `src/videos/short-griegas-quien-zeus/guion.json`.

## Pasos
Los de RUTINA.md › 4–5: `motor-narrar <id> en`, `motor-revisar <id> --sin-hoja` ("sin avisos"), tests, commit,
`scripts/estado-agregar-shorts.sh <ids>`.
