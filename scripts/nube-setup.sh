#!/usr/bin/env bash
# Prepara una máquina de la nube (Ubuntu, root) para la rutina de producción (RUTINA.md). Idempotente.
# Instala ffmpeg + rsync (+ libs de Chrome para `remotion still`), y node_modules. Sin Modal (2026-10-25): la voz va por GitHub (scripts/voz-github.mjs).
# Uso: scripts/nube-setup.sh   (desde cualquier lado; también lo pega el campo "Setup script" del entorno)
set -euo pipefail
command -v ffmpeg >/dev/null && command -v rsync >/dev/null && dpkg -s libgbm1 >/dev/null 2>&1 || { apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq ffmpeg rsync libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2t64 fonts-noto-core >/dev/null; }
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$RAIZ/package-lock.json" ] && { cd "$RAIZ" && npm ci --no-audit --no-fund --loglevel=error; }
echo "nube-setup: ffmpeg $(ffmpeg -version | head -1 | cut -d' ' -f3) · node $(node -v)"
