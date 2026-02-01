# Многоэтапная сборка для оптимизации
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# API URL для продакшена
ARG REACT_APP_API_URL=http://localhost:3001
ENV REACT_APP_API_URL=$REACT_APP_API_URL


# Память для сборки: на Mac 2048, на слабом сервере --build-arg NODE_MEMORY=512
ARG NODE_MEMORY=2048
ENV NODE_OPTIONS="--max-old-space-size=${NODE_MEMORY}"
# Собираем приложение
RUN npm run build

# Продакшн образ с Nginx
FROM nginx:alpine AS production

# Копируем собранное приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"] 