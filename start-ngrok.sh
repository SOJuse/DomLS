#!/bin/bash

echo "🚀 Запуск ngrok туннелей для DomLS..."

# Проверяем, что Docker Compose запущен
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Docker Compose не запущен. Сначала запустите: docker-compose up -d"
    exit 1
fi

echo "📱 Frontend (порт 3000):"
ngrok http 3000 --log=stdout &

echo "🛠️  Admin Panel (порт 3002):"
ngrok http 3002 --log=stdout &

echo "🔧 Backend API (порт 3001):"
ngrok http 3001 --log=stdout &

echo ""
echo "✅ Ngrok туннели запущены!"
echo "📋 Проверьте URL в терминале выше"
echo ""
echo "💡 Для остановки нажмите Ctrl+C"
echo "💡 Для просмотра статуса: ngrok status"

# Ждем завершения
wait 