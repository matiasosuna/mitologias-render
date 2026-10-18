# Render de episodios en Modal (CPU, se paga por segundo, sale del crédito gratis). Un contenedor por (episodio, formato), todos a la vez.
# Formatos (modo): horizontal = YouTube (mp4 con pistas, .srt, miniatura) · vertical = TikTok (vertical completo) · partes = Instagram (Reels + partes.json).
# Uso: MOC_ITEMS="<id>:horizontal <id>:vertical <id>:partes" .venv/bin/modal run --detach scripts/modal_render.py
#      (viejo, sigue valiendo: MOC_ID="<id> <id>" MOC_MODO=horizontal|vertical|partes[,…]; por defecto vertical)
#      Todo queda en el Volume "moc-out", carpeta <id>/ → `modal volume get --force moc-out <id> out/` (lo hace el workflow prerender).
# Tope: 8 núcleos + 24 GB ≈ 0,57 USD/h y timeout de 60 min por contenedor. Medido: horizontal ≈ 40 min (≈ 0,38 USD), vertical ≈ 24 min (≈ 0,23 USD).
# Los fallos de un formato no cortan los demás: se listan al final y el proceso sale con error (el workflow los manda a render-nube).
import json
import os
import pathlib
import subprocess

import modal

MODOS = ("horizontal", "vertical", "partes")


def _items():
    crudo = os.environ.get("MOC_ITEMS", "").split()
    if crudo:
        return [tuple(x.split(":", 1)) for x in crudo]
    modos = os.environ.get("MOC_MODO", "vertical").split(",")
    return [(i, m) for i in os.environ.get("MOC_ID", "").split() for m in modos]


ITEMS = _items()
assert all(m in MODOS for _, m in ITEMS), f"modo inválido en {ITEMS}"
IDS = sorted({i for i, _ in ITEMS})
RAIZ = pathlib.Path(__file__).resolve().parent.parent if modal.is_local() else pathlib.Path("/app")
MUSICA = {"griegas": "lira-griega", "nordicas": "nordica", "egipcias": "egipcia", "hawaianas": "hawaiana", "norteamericanas": "norteamericana", "aztecas": "azteca", "balinesas": "balinesa", "hindues": "hindu", "maories": "maori"}

image = (
    modal.Image.from_registry("node:22-bookworm-slim", add_python="3.12")
    .apt_install("libnss3", "libatk1.0-0", "libatk-bridge2.0-0", "libcups2", "libdrm2", "libxkbcommon0", "libxcomposite1",
                 "libxdamage1", "libxfixes3", "libxrandr2", "libgbm1", "libpango-1.0-0", "libcairo2", "libasound2", "fonts-noto-core", "ffmpeg")
    .add_local_file(RAIZ / "package.json", "/app/package.json", copy=True)
    .add_local_file(RAIZ / "package-lock.json", "/app/package-lock.json", copy=True)
    .run_commands("cd /app && npm ci --no-audit --no-fund --loglevel=error", "cd /app && npx remotion browser ensure")
)
if modal.is_local() and IDS:
    image = (
        image.add_local_dir(RAIZ / "src", "/app/src")
        .add_local_dir(RAIZ / "scripts", "/app/scripts")
        .add_local_dir(RAIZ / "lib", "/app/lib")
        .add_local_file(RAIZ / "tsconfig.json", "/app/tsconfig.json")
        .add_local_dir(RAIZ / "public/texturas", "/app/public/texturas")
    )
    series = {json.loads((RAIZ / "src/videos" / i / "guion.json").read_text()).get("serie", "griegas") for i in IDS}
    for serie in series:
        image = image.add_local_file(RAIZ / f"public/musica/{MUSICA[serie]}.wav", f"/app/public/musica/{MUSICA[serie]}.wav")
    for i in IDS:
        image = image.add_local_dir(RAIZ / "public/audio" / i / "en", f"/app/public/audio/{i}/en")
        if (RAIZ / "out" / i / "portada-ig.jpg").exists():  # si no está, vertical-render / vertical-partes la generan
            image = image.add_local_file(RAIZ / "out" / i / "portada-ig.jpg", f"/app/out/{i}/portada-ig.jpg")

app = modal.App("moc-render", image=image)
vol = modal.Volume.from_name("moc-out", create_if_missing=True)


@app.function(cpu=8, memory=24576, timeout=60 * 60, volumes={"/vol": vol}, max_containers=2)
def render(id: str, modo: str = "vertical") -> str:
    import shutil, time
    t = time.time()
    env = {**os.environ, "RENDER_CONCURRENCY": "8", "PARTES": "8"}
    out = pathlib.Path(f"/app/out/{id}")
    destino = pathlib.Path(f"/vol/{id}")
    destino.mkdir(parents=True, exist_ok=True)
    aviso = ""

    def copiar(patrones):
        for patron in patrones:
            for f in out.glob(patron):
                if f.is_file():
                    shutil.copy(f, destino / f.name)

    def limpiar(patrones):  # lo de una corrida anterior de este mismo formato no se mezcla con lo nuevo
        for patron in patrones:
            for f in destino.glob(patron):
                f.unlink()

    if modo == "horizontal":
        limpiar(["*.mp4", "*.m4a", "*.srt", "miniatura.jpg"])
        subprocess.run(["node", "scripts/motor-render.mjs", id, "--imagen=en", "--audio=en"], cwd="/app", check=True, env=env)
        mini = subprocess.run(["node", "scripts/miniaturas.mjs", id], cwd="/app", env=env, capture_output=True, text=True)
        if mini.returncode != 0 or not (out / "miniatura.jpg").exists():  # visible en el log y en el resultado (antes se perdía en silencio)
            aviso = " · ERROR miniatura"
            print(f"ERROR miniatura {id}: {(mini.stdout + mini.stderr)[-1500:]}")
        copiar(["*.mp4", "*.m4a", "*.srt", "miniatura.jpg"])
    elif modo == "vertical":
        limpiar([f"{id}.vertical.mp4", "portada-ig.jpg"])
        subprocess.run(["node", "scripts/vertical-render.mjs", id], cwd="/app", check=True, env=env)
        copiar([f"{id}.vertical.mp4", "portada-ig.jpg"])
    else:  # partes
        limpiar([f"{id}.parte-*.mp4", "partes.json", "portada-ig.jpg"])
        subprocess.run(["node", "scripts/vertical-partes.mjs", id], cwd="/app", check=True, env=env)
        copiar([f"{id}.parte-*.mp4", "partes.json", "portada-ig.jpg"])
    vol.commit()
    msg = f"render {modo} {id}: {time.time() - t:.0f} s{aviso}"
    print(msg)
    return msg


@app.local_entrypoint()
def main():
    assert ITEMS, "Falta MOC_ITEMS (o MOC_ID)"
    fallos = []
    resultados = render.starmap(ITEMS, return_exceptions=True)
    for (i, m), r in zip(ITEMS, resultados):
        if isinstance(r, Exception):
            fallos.append(f"{i}:{m}")
            print(f"FALLÓ {i}:{m}: {str(r)[:300]}")
        else:
            print(r)
    pathlib.Path("out").mkdir(exist_ok=True)
    pathlib.Path("out/modal-fallos.json").write_text(json.dumps(fallos))
    if fallos:
        raise SystemExit(f"fallaron en Modal: {' '.join(fallos)}")
