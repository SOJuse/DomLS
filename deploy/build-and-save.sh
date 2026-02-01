#!/bin/bash
# Сборка образов локально и сохранение в tar
# Запуск: ./deploy/build-and-save.sh

set -e
cd "$(dirname "$0")/.."

echo "=== Сборка образов ==="
docker-compose build

echo ""
echo "=== Сохранение в domls-images.tar ==="
docker save \
  postgres:15-alpine \
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
echo "  cd /root/DomLS"
echo "  docker load -i /root/domls-images.tar"
echo "  cp deploy/.env.example .env   # если ещё не создан"
echo "  docker-compose -f deploy/docker-compose.prod.yml up -d"
