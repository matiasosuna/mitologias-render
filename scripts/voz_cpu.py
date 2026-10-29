# Voz en inglés con Chatterbox (normal, misma emoción que modal_voz.py desde 2026-10-29; más lento que Turbo) en CPU (GitHub Actions del repo público: gratis). Lo mismo que modal_voz.py, sin Modal.
# Lo corre .github/workflows/voz-cpu.yml; cada job hace las frases con índice % PARTES == PARTE.
#   VOZ_ENTRADA=frases.json VOZ_SALIDA=dir VOZ_REF=ref.wav [PARTE=0 PARTES=1] python scripts/voz_cpu.py
import io, json, os, pathlib

import torch
import torchaudio as ta
from chatterbox.tts import ChatterboxTTS

torch.set_num_threads(os.cpu_count() or 4)
frases = json.loads(pathlib.Path(os.environ["VOZ_ENTRADA"]).read_text())
parte, partes = int(os.environ.get("PARTE", "0")), int(os.environ.get("PARTES", "1"))
mias = [f for i, f in enumerate(frases) if i % partes == parte]
salida = pathlib.Path(os.environ["VOZ_SALIDA"]); salida.mkdir(parents=True, exist_ok=True)
m = ChatterboxTTS.from_pretrained(device="cpu")
EXAGERACION, CFG = 0.65, 0.25  # igual que scripts/modal_voz.py
for f in mias:
    w = m.generate(f["texto"], audio_prompt_path=os.environ["VOZ_REF"], exaggeration=EXAGERACION, cfg_weight=CFG)
    ta.save(str(salida / f"{f['h']}.wav"), w.cpu(), m.sr)
print(f"chatterbox cpu: {len(mias)} de {len(frases)} frases (parte {parte + 1}/{partes})")
