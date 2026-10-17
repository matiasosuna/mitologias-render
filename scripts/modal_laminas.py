# Láminas (stills PNG de src/pruebas) en Modal: una por contenedor, en paralelo (centavos por lámina; sale del crédito gratis).
# Uso: MOC_LAMINAS='[{"archivo":"src/pruebas/x.tsx","id":"g-hoja"}]' MOC_FRAME=60 modal run scripts/modal_laminas.py
#      (la lista la arma node scripts/laminas.mjs resolver); deja los PNG en out/laminas/<id>.png
import json
import os
import pathlib
import subprocess

import modal

LAMINAS = json.loads(os.environ.get("MOC_LAMINAS", "[]"))
FRAME = os.environ.get("MOC_FRAME", "60")
RAIZ = pathlib.Path(__file__).resolve().parent.parent if modal.is_local() else pathlib.Path("/app")

image = (
    modal.Image.from_registry("node:22-bookworm-slim", add_python="3.12")
    .apt_install("libnss3", "libatk1.0-0", "libatk-bridge2.0-0", "libcups2", "libdrm2", "libxkbcommon0", "libxcomposite1",
                 "libxdamage1", "libxfixes3", "libxrandr2", "libgbm1", "libpango-1.0-0", "libcairo2", "libasound2", "fonts-noto-core")
    .add_local_file(RAIZ / "package.json", "/app/package.json", copy=True)
    .add_local_file(RAIZ / "package-lock.json", "/app/package-lock.json", copy=True)
    .run_commands("cd /app && npm ci --no-audit --no-fund --loglevel=error", "cd /app && npx remotion browser ensure")
)
if modal.is_local() and LAMINAS:
    image = (
        image.add_local_dir(RAIZ / "src", "/app/src")
        .add_local_dir(RAIZ / "lib", "/app/lib")
        .add_local_file(RAIZ / "tsconfig.json", "/app/tsconfig.json")
        .add_local_dir(RAIZ / "public/texturas", "/app/public/texturas")
    )
    if (RAIZ / "public/portadas").exists():
        image = image.add_local_dir(RAIZ / "public/portadas", "/app/public/portadas")

app = modal.App("moc-laminas", image=image)


@app.function(cpu=4, memory=8192, timeout=15 * 60)
def lamina(archivo: str, id: str, frame: str = "60") -> bytes:
    subprocess.run(["npx", "remotion", "still", archivo, id, f"/tmp/{id}.png", f"--frame={frame}"], cwd="/app", check=True)
    return pathlib.Path(f"/tmp/{id}.png").read_bytes()


@app.local_entrypoint()
def main():
    assert LAMINAS, "Falta MOC_LAMINAS"
    out = pathlib.Path("out/laminas")
    out.mkdir(parents=True, exist_ok=True)
    for l, png in zip(LAMINAS, lamina.starmap([(l["archivo"], l["id"], FRAME) for l in LAMINAS])):
        (out / f"{l['id']}.png").write_bytes(png)
        print("lámina", l["id"], len(png), "bytes")
