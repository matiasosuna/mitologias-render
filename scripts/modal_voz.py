# Voz en inglés con Chatterbox Turbo en GPU de Modal (clona la voz de lib/voz-matias-ref.wav, ~20 s de MatiasEN).
# Lo llama scripts/motor-narrar.mjs cuando .env tiene VOZ_EN=chatterbox. Entrada: JSON [{h, texto}] → wavs en una carpeta.
# Uso manual: VOZ_ENTRADA=x.json VOZ_SALIDA=dir .venv/bin/modal run scripts/modal_voz.py
# Costo: T4 ≈ 0,59 USD/h; un episodio ≈ 3–4 min → ≈ 0,04 USD de crédito. Timeout 30 min (máx ≈ 0,30 USD).
# Nube (repo público, sin la muestra de voz): la toma del Volume privado "moc-voz" (ref.wav), subido una vez con
#   modal volume put moc-voz lib/voz-matias-ref.wav ref.wav
import json
import os
import pathlib

import modal

RAIZ = pathlib.Path(__file__).resolve().parent.parent
REF = RAIZ / "lib/voz-matias-ref.wav"
image = (modal.Image.debian_slim(python_version="3.11").pip_install("chatterbox-tts")
         .run_commands("python -c \"from chatterbox.tts_turbo import ChatterboxTurboTTS; ChatterboxTurboTTS.from_pretrained(device='cpu')\""))
if modal.is_local() and REF.exists():  # Mac: la muestra local; nube: la del Volume
    image = image.add_local_file(REF, "/w/ref.wav")
app = modal.App("moc-voz", image=image)
voz = modal.Volume.from_name("moc-voz", create_if_missing=True)


@app.function(gpu="T4", timeout=30 * 60, volumes={"/voz": voz})
def narrar(frases: list) -> dict:
    import io, torch, torchaudio as ta
    from chatterbox.tts_turbo import ChatterboxTurboTTS
    ref = "/w/ref.wav" if os.path.exists("/w/ref.wav") else "/voz/ref.wav"
    assert os.path.exists(ref), "falta la muestra de voz: modal volume put moc-voz lib/voz-matias-ref.wav ref.wav"
    m = ChatterboxTurboTTS.from_pretrained(device="cuda")
    out = {}
    for f in frases:
        w = m.generate(f["texto"], audio_prompt_path=ref)
        buf = io.BytesIO(); ta.save(buf, w.cpu(), m.sr, format="wav"); out[f["h"]] = buf.getvalue()
    return out


@app.local_entrypoint()
def main():
    frases = json.loads(pathlib.Path(os.environ["VOZ_ENTRADA"]).read_text())
    salida = pathlib.Path(os.environ["VOZ_SALIDA"]); salida.mkdir(parents=True, exist_ok=True)
    for h, datos in narrar.remote(frases).items():
        (salida / f"{h}.wav").write_bytes(datos)
    print(f"chatterbox: {len(frases)} frases")
