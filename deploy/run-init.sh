#!/bin/bash
# Полный init базы данных
# Запуск на сервере: ./deploy/run-init.sh

cd "$(dirname "$0")/.."
docker exec -i domls_postgres psql -U domls_user -d domls_db < backend/init.sql
echo "Done. Admin: admin / admin123"
