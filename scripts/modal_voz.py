# Voz en inglés con Chatterbox en GPU de Modal (clona la voz de lib/voz-matias-ref.wav, ~20 s de MatiasEN).
# Matías 2026-10-29 ("el narrador es aburrido"): Chatterbox normal con más emoción (EXAGERACION/CFG) en vez de Turbo;
# a 0,9× (TEMPO_EN) queda ≈ 195 palabras/min. Prueba elegida: "E2 más ágil" (exaggeration 0.65, cfg_weight 0.25).
# Lo llama scripts/motor-narrar.mjs cuando .env tiene VOZ_EN=chatterbox. Entrada: JSON [{h, texto}] → wavs en una carpeta.
# Uso manual: VOZ_ENTRADA=x.json VOZ_SALIDA=dir .venv/bin/modal run scripts/modal_voz.py
# Costo: T4 ≈ 0,59 USD/h; un episodio ≈ 5–8 min con el modelo normal → ≈ 0,05–0,08 USD de crédito. Timeout 30 min (máx ≈ 0,30 USD).
# Nube (repo público, sin la muestra de voz): la toma del Volume privado "moc-voz" (ref.wav), subido una vez con
#   modal volume put moc-voz lib/voz-matias-ref.wav ref.wav
# Snapshot de memoria (2026-11-02): el modelo se carga una vez en la GPU y Modal guarda esa memoria; los arranques siguientes
# la restauran en segundos (no se paga la carga cada vez). Modal solo hace snapshots de apps DEPLOYADAS: la app se llama
# moc-voz-<hash de este archivo> y main() la deploya sola si esa versión todavía no está (un cambio acá = una app nueva).
import hashlib
import json
import os
import pathlib
import subprocess

import modal

RAIZ = pathlib.Path(__file__).resolve().parent.parent
REF = RAIZ / "lib/voz-matias-ref.wav"
image = (modal.Image.debian_slim(python_version="3.11").pip_install("chatterbox-tts")
         .run_commands("python -c \"from chatterbox.tts import ChatterboxTTS; ChatterboxTTS.from_pretrained(device='cpu')\""))
EXAGERACION, CFG = 0.65, 0.25  # emoción y ritmo de la voz (más exageración = más emoción; menos cfg = más pausada)
if modal.is_local() and REF.exists():  # Mac: la muestra local; nube: la del Volume
    image = image.add_local_file(REF, "/w/ref.wav")
NOMBRE = "moc-voz-" + hashlib.sha1(pathlib.Path(__file__).read_bytes()).hexdigest()[:8]
app = modal.App(NOMBRE, image=image)
voz = modal.Volume.from_name("moc-voz", create_if_missing=True)


@app.cls(gpu="T4", timeout=30 * 60, volumes={"/voz": voz}, scaledown_window=60,
         enable_memory_snapshot=True, experimental_options={"enable_gpu_snapshot": True})
class Narrador:
    @modal.enter(snap=True)
    def cargar(self):  # esto queda en el snapshot: modelo en la GPU + una frase de calentamiento
        from chatterbox.tts import ChatterboxTTS
        self.ref = "/w/ref.wav" if os.path.exists("/w/ref.wav") else "/voz/ref.wav"
        assert os.path.exists(self.ref), "falta la muestra de voz: modal volume put moc-voz lib/voz-matias-ref.wav ref.wav"
        self.m = ChatterboxTTS.from_pretrained(device="cuda")
        self.m.generate("Hello.", audio_prompt_path=self.ref, exaggeration=EXAGERACION, cfg_weight=CFG)

    @modal.method()
    def narrar(self, frases: list) -> dict:
        import io, torchaudio as ta
        out = {}
        for f in frases:
            w = self.m.generate(f["texto"], audio_prompt_path=self.ref, exaggeration=EXAGERACION, cfg_weight=CFG)
            buf = io.BytesIO(); ta.save(buf, w.cpu(), self.m.sr, format="wav"); out[f["h"]] = buf.getvalue()
        return out


def deployado():
    """La versión deployada de esta app (la deploya si falta: la primera vez tarda, después arranca del snapshot)."""
    c = modal.Cls.from_name(NOMBRE, "Narrador")
    try:
        c.hydrate()
    except modal.exception.NotFoundError:
        print(f"deployando {NOMBRE} (primera vez con esta versión)")
        subprocess.run(["modal", "deploy", __file__], check=True)
        c = modal.Cls.from_name(NOMBRE, "Narrador")
    return c


@app.local_entrypoint()
def main():
    frases = json.loads(pathlib.Path(os.environ["VOZ_ENTRADA"]).read_text())
    salida = pathlib.Path(os.environ["VOZ_SALIDA"]); salida.mkdir(parents=True, exist_ok=True)
    for h, datos in deployado()().narrar.remote(frases).items():
        (salida / f"{h}.wav").write_bytes(datos)
    print(f"chatterbox: {len(frases)} frases")
