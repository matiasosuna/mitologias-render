#!/usr/bin/env bash
# Dependencias del sistema para Remotion (Chrome headless) + ffmpeg en los runners de GitHub.
# Uso: scripts/apt-deps.sh [paquetes...]   (sin argumentos instala la lista de Remotion de abajo)
#
# Por qué existe: un mirror de Ubuntu colgado trababa la cola. Con topes de 5+10 min por intento, un cuelgue costaba
# 10-15 min y tres seguidos tiraban la corrida a los 34 min (publicar, 2026-10-26 22:07 UTC).
# Lo normal es que tarde 15-40 s, así que ahora cada intento tiene tope corto y cada reintento cambia de mirror.
set -u

PAQUETES="${*:-libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2t64 fonts-noto-core ffmpeg}"
MIRRORS="azure.archive.ubuntu.com archive.ubuntu.com us.archive.ubuntu.com mirrors.edge.kernel.org"
APT_OPTS=(-o Acquire::http::Timeout=20 -o Acquire::https::Timeout=20 -o Acquire::Retries=2 -o DPkg::Lock::Timeout=60)

usar_mirror() { # cambia el host de los repos principales (security.ubuntu.com queda igual)
  for f in /etc/apt/sources.list /etc/apt/sources.list.d/ubuntu.sources; do
    [ -f "$f" ] || continue
    sudo sed -i -E "s#//((azure|us)\.)?archive\.ubuntu\.com/#//$1/#g; s#//mirrors\.edge\.kernel\.org/#//$1/#g" "$f"
  done
}

i=0
for m in $MIRRORS; do
  i=$((i + 1))
  [ "$i" -gt 1 ] && usar_mirror "$m"
  echo "apt intento $i ($m)"
  if timeout -k 10 120 sudo apt-get "${APT_OPTS[@]}" update -q &&
     timeout -k 10 240 sudo apt-get "${APT_OPTS[@]}" install -y -q $PAQUETES; then
    exit 0
  fi
  echo "::warning::apt intento $i ($m) falló o se colgó; pruebo otro mirror"
  sudo dpkg --configure -a >/dev/null 2>&1 || true # por si el corte dejó dpkg a medio configurar
done
echo "::error::apt no pudo instalar las dependencias con ningún mirror"
exit 1
