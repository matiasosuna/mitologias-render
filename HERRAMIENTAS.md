# Herramientas para mejorar los videos (investigación 2026-10-08)

## TOP 5 (impacto / esfuerzo)
1. **Lip-sync**: ElevenLabs `POST /v1/text-to-speech/{voice}/with-timestamps` (alineación por carácter → 4–6 bocas). Costo extra 0. Plan B gratis para audios ya narrados: Rhubarb Lip Sync (reconocedor fonético para español).
2. **Rig SVG propio más fluido**: pivotes jerárquicos, `spring()` de Remotion con desfasajes (anticipación/seguimiento), parpadeo, cabeceo con la energía del audio, poses "en doses". Gratis, conserva el estilo.
3. **QA en dos capas**: ffmpeg (`blackdetect`, `freezedetect`, `ebur128`, contact sheet 1 fps) + Gemini (video understanding vía File API, Flash-Lite, centavos por video) con lista de problemas y timestamps; verificar cada hallazgo con un cuadro.
4. **Sonido**: ElevenLabs Sound Effects (librería de ~30 SFX reutilizables) y probar ElevenLabs Music (`/v1/music`, 3 s–10 min, instrumental) — confirmar licencia comercial antes.
5. **Criaturas/objetos nuevos**: Recraft vectorial (SVG) o imagen IA + VTracer/Potrace, con limpieza y rig manual. Rive (plan Cadet US$9/mes, `@remotion/rive`) recién si crece mucho el elenco.

## Otras
- `@remotion/motion-blur` (Trail/CameraMotionBlur) para golpes y vuelos; `@remotion/paths` y flubber para morphs; GSAP (gratis) solo para morphs complejos.
- Lottie (`@remotion/lottie`) para efectos sueltos; no para personajes.
- Video IA (Veo 3.1, Kling, Runway): solo planos especiales de 3–8 s; rompe el estilo si se usa en el cuerpo.
- Skills oficiales de Remotion: `npx skills add remotion-dev/skills`. MCP oficial de ElevenLabs: `uvx elevenlabs-mcp`.
- Publicación: Upload-Post (API, YouTube + TikTok + Reels; 10 subidas gratis/mes o US$16–24) o Metricool.
