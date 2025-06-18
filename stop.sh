#!/bin/bash

echo "🛑 Остановка проекта DomLS..."

# Проверяем наличие Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен."
    exit 1
fi

# Останавливаем контейнеры
echo "⏹️ Остановка контейнеров..."
docker-compose down

# Удаляем тома (опционально)
read -p "Удалить данные базы данных? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Удаление данных..."
    docker-compose down -v
fi

echo "✅ Проект остановлен!"
echo ""
echo "📋 Полезные команды:"
echo "   • Запуск: ./start.sh"
echo "   • Просмотр логов: docker-compose logs"
echo "   • Статус: docker-compose ps" 