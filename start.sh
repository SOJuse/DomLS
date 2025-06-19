#!/bin/bash

echo "🚀 Запуск проекта DomLS..."

# Проверяем наличие Docker и Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Остановка существующих контейнеров..."
docker-compose down

# Удаляем старые образы (опционально)
read -p "Удалить старые образы? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Удаление старых образов..."
    docker-compose down --rmi all
fi

# Обновляем зависимости frontend
cd frontend && npm install && cd ..
# Обновляем зависимости admin
cd admin && npm install && cd ..
# Обновляем зависимости backend
cd backend && npm run build && cd ..

# Собираем и запускаем контейнеры
echo "🔨 Сборка и запуск контейнеров..."
docker-compose up --build -d

# Ждем запуска базы данных
echo "⏳ Ожидание запуска базы данных..."
sleep 10

# Проверяем статус контейнеров
echo "📊 Проверка статуса сервисов..."
docker-compose ps

# Ждем полного запуска всех сервисов
echo "⏳ Ожидание запуска всех сервисов..."
sleep 15

# Проверяем доступность API
echo "🔍 Проверка доступности API..."
for i in {1..30}; do
    if curl -s http://localhost:3001/api > /dev/null; then
        echo "✅ API доступен"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ API недоступен после 30 попыток"
        exit 1
    fi
    echo "⏳ Попытка $i/30..."
    sleep 2
done

# Проверяем доступность фронтенда
echo "🔍 Проверка доступности фронтенда..."
for i in {1..10}; do
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Фронтенд доступен"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Фронтенд недоступен после 10 попыток"
        exit 1
    fi
    echo "⏳ Попытка $i/10..."
    sleep 2
done

# Проверяем доступность админки
echo "🔍 Проверка доступности админ-панели..."
for i in {1..10}; do
    if curl -s http://localhost:3002 > /dev/null; then
        echo "✅ Админ-панель доступна"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Админ-панель недоступна после 10 попыток"
        exit 1
    fi
    echo "⏳ Попытка $i/10..."
    sleep 2
done

echo ""
echo "🎉 Проект успешно запущен!"
echo ""
echo "📱 Доступные сервисы:"
echo "   • Фронтенд: http://localhost:3000"
echo "   • API: http://localhost:3001/api"
echo "   • Админ-панель: http://localhost:3002"
echo ""
echo "🔐 Данные для входа в админку:"
echo "   • Логин: admin"
echo "   • Пароль: admin123"
echo ""
echo "📋 Полезные команды:"
echo "   • Просмотр логов: docker-compose logs -f"
echo "   • Остановка: ./stop.sh"
echo "   • Перезапуск: docker-compose restart"
echo ""
echo "🔧 Для остановки проекта выполните: ./stop.sh" 