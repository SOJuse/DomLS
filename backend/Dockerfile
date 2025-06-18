# Многоэтапная сборка для оптимизации
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем все зависимости (включая dev для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Компилируем TypeScript
RUN npm run build

# Продакшн образ
FROM node:18-alpine AS production

WORKDIR /app

# Устанавливаем только необходимые пакеты
RUN apk add --no-cache dumb-init

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Копируем зависимости и собранное приложение
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Переключаемся на пользователя nodejs
USER nodejs

# Открываем порт
EXPOSE 3001

# Используем dumb-init для корректной обработки сигналов
ENTRYPOINT ["dumb-init", "--"]

# Запускаем приложение
CMD ["node", "dist/index.js"] 