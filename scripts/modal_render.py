# Render de UN episodio vertical en Modal (CPU, se paga por segundo, sale del crédito gratis).
# Uso: MOC_ID="<id> <id> …" .venv/bin/modal run --detach scripts/modal_render.py   (sigue aunque se corte internet)
#      cada episodio va en su propio contenedor, todos a la vez (≈ 24 min y ≈ 0,23 USD de crédito por episodio)
#      después: .venv/bin/modal volume get moc-out <id>.vertical.mp4 out/<id>/
# Tope: 8 núcleos + 16 GB ≈ 0,50 USD/h y timeout de 45 min → máximo ≈ 0,38 USD por corrida (sale del crédito gratis).
# El contenedor se apaga solo al terminar o al llegar al timeout. El video queda en el Volume "moc-out".
import json
import os
import pathlib
import subprocess

import modal

IDS = os.environ.get("MOC_ID", "").split()
MODO = os.environ.get("MOC_MODO", "vertical")  # vertical | horizontal (YouTube: mp4 con pistas, .srt y miniatura)
RAIZ = pathlib.Path(__file__).resolve().parent.parent
MUSICA = {"griegas": "lira-griega", "nordicas": "nordica", "egipcias": "egipcia", "hawaianas": "hawaiana", "norteamericanas": "norteamericana"}

image = (
    modal.Image.from_registry("node:22-bookworm-slim", add_python="3.12")
    .apt_install("libnss3", "libatk1.0-0", "libatk-bridge2.0-0", "libcups2", "libdrm2", "libxkbcommon0", "libxcomposite1",
                 "libxdamage1", "libxfixes3", "libxrandr2", "libgbm1", "libpango-1.0-0", "libcairo2", "libasound2", "fonts-noto-core", "ffmpeg")
    .add_local_file(RAIZ / "package.json", "/app/package.json", copy=True)
    .add_local_file(RAIZ / "package-lock.json", "/app/package-lock.json", copy=True)
    .run_commands("cd /app && npm ci --no-audit --no-fund --loglevel=error", "cd /app && npx remotion browser ensure")
)
if IDS:
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
        if (RAIZ / "out" / i / "portada-ig.jpg").exists():  # si no está, vertical-render la genera
            image = image.add_local_file(RAIZ / "out" / i / "portada-ig.jpg", f"/app/out/{i}/portada-ig.jpg")

app = modal.App("moc-render", image=image)
vol = modal.Volume.from_name("moc-out", create_if_missing=True)


@app.function(cpu=8, memory=24576, timeout=60 * 60, volumes={"/vol": vol})
def render(id: str, modo: str = "vertical") -> str:
    import shutil, time
    t = time.time()
    env = {**os.environ, "RENDER_CONCURRENCY": "8", "PARTES": "8"}
    if modo == "horizontal":
        subprocess.run(["node", "scripts/motor-render.mjs", id, "--imagen=en", "--audio=en"], cwd="/app", check=True, env=env)
        subprocess.run(["node", "scripts/miniaturas.mjs", id], cwd="/app", check=False, env=env)
        destino = pathlib.Path(f"/vol/{id}"); destino.mkdir(parents=True, exist_ok=True)
        for f in pathlib.Path(f"/app/out/{id}").iterdir():
            if f.is_file() and f.suffix in (".mp4", ".m4a", ".srt", ".jpg") and f.name != "portada-ig.jpg":
                shutil.copy(f, destino / f.name)
    else:
        subprocess.run(["node", "scripts/vertical-render.mjs", id], cwd="/app", check=True, env=env)
        shutil.copy(f"/app/out/{id}/{id}.vertical.mp4", f"/vol/{id}.vertical.mp4")
    vol.commit()
    msg = f"render {modo} {id}: {time.time() - t:.0f} s"
    print(msg)
    return msg


@app.local_entrypoint()
def main():
    assert IDS, "Falta MOC_ID"
    for msg in render.map(IDS, kwargs={"modo": MODO}):
        print(msg)
