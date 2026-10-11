#!/bin/bash
# Render en un servidor de Hetzner que se crea y se BORRA solo al terminar (se paga por hora).
# Uso: scripts/hetzner-render.sh <id> [<id>…]   → baja out/<id>/<id>.vertical.mp4
# Opcional: TIPOS="cx53 cpx62 …" y UBICS="fsn1 nbg1 hel1" (prueba en orden hasta que haya lugar) · MODO=vertical|horizontal|short
# Necesita HCLOUD_TOKEN en .env, la clave ~/.ssh/id_ed25519_moc_hetzner (registrada como "moc-render")
# y la deploy key de solo lectura ~/.ssh/id_ed25519_moc_deploy en el repo matiasosuna/mitologias.
set -euo pipefail
cd "$(dirname "$0")/.."
[ $# -gt 0 ] || { echo "Falta al menos un id"; exit 1; }
set -a; . ./.env; set +a
TIPOS=${TIPOS:-cx53 cpx62 ccx43 cpx52 cx43}; UBICS=${UBICS:-fsn1 nbg1 hel1}; MODO=${MODO:-vertical}
API=https://api.hetzner.cloud/v1
H=(-H "Authorization: Bearer $HCLOUD_TOKEN" -H "Content-Type: application/json")
KEY=~/.ssh/id_ed25519_moc_hetzner
SSH=(ssh -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR -o ServerAliveInterval=30)
NOMBRE="moc-render-$(date +%m%d-%H%M%S)"

git push -q 2>/dev/null || true   # el servidor clona lo último de GitHub

SID=""
for TIPO in $(echo $TIPOS); do
  for UBIC in $(echo $UBICS); do
    resp=$(curl -s "${H[@]}" -X POST $API/servers -d "{\"name\":\"$NOMBRE\",\"server_type\":\"$TIPO\",\"location\":\"$UBIC\",\"image\":\"ubuntu-24.04\",\"ssh_keys\":[\"moc-render\"],\"labels\":{\"proyecto\":\"mitologias\"}}")
    SID=$(echo "$resp" | jq -r '.server.id // empty')
    [ -n "$SID" ] && break 2
    echo "sin lugar: $TIPO en $UBIC ($(echo "$resp" | jq -r .error.code))"
  done
done
[ -n "$SID" ] || { echo "No se pudo crear el servidor en ningún lado"; exit 1; }
borrar() { curl -s "${H[@]}" -X DELETE $API/servers/$SID >/dev/null && echo "servidor $NOMBRE borrado"; }
trap borrar EXIT
IP=$(echo "$resp" | jq -r '.server.public_net.ipv4.ip')
echo "servidor $NOMBRE ($TIPO en $UBIC, $IP) creado"

for i in $(seq 1 60); do "${SSH[@]}" -o ConnectTimeout=5 root@$IP true 2>/dev/null && break; sleep 5; done
scp -q -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR ~/.ssh/id_ed25519_moc_deploy root@$IP:/root/.ssh/deploy

"${SSH[@]}" root@$IP "MODO=$MODO bash -s -- $*" <<'REMOTO'
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
chmod 600 /root/.ssh/deploy
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
apt-get install -y -qq nodejs git libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2t64 fonts-noto-core >/dev/null
GIT_SSH_COMMAND="ssh -i /root/.ssh/deploy -o StrictHostKeyChecking=no" git clone -q --depth 1 git@github.com:matiasosuna/mitologias.git /root/m
cd /root/m && npm ci --silent >/dev/null && npx remotion browser ensure >/dev/null
echo "listo para renderizar en $(nproc) núcleos"
case "$MODO" in vertical) node scripts/vertical-render.mjs "$@" ;; short) node scripts/short-render.mjs "$@" ;; *) for id in "$@"; do node scripts/motor-render.mjs "$id" --imagen=en --audio=en; done ;; esac
REMOTO

for id in "$@"; do
  mkdir -p out/$id
  scp -q -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR root@$IP:/root/m/out/$id/'*.mp4' out/$id/ && echo "bajado $id"
done
