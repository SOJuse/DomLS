#!/bin/bash
# Сборка образов локально (для linux/amd64) и сохранение в tar
# Важно: Mac (ARM) → VPS (x86) требует платформу linux/amd64

set -e
cd "$(dirname "$0")/.."

export DOCKER_DEFAULT_PLATFORM=linux/amd64
echo "=== Сборка образов для linux/amd64 ==="
docker-compose build

echo ""
echo "=== Сохранение в domls-images.tar (только приложения, postgres — на сервере) ==="
docker save \
  domls-backend:latest \
  domls-frontend:latest \
  domls-admin:latest \
  -o domls-images.tar

echo ""
echo "=== Готово ==="
echo "Размер: $(du -h domls-images.tar | cut -f1)"
echo ""
echo "Перенеси на сервер:"
echo "  scp domls-images.tar root@ТВОЙ_IP:/root/"
echo ""
echo "На сервере:"
echo "  docker pull postgres:15-alpine    # сервер сам подтянет amd64"
echo "  cd /root/DomLS"
echo "  docker load -i /root/domls-images.tar"
echo "  cp deploy/.env.example .env   # если ещё не создан"
echo "  docker-compose -f deploy/docker-compose.prod.yml up -d"
