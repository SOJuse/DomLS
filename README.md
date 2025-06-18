# DomLS - Калькулятор стоимости ремонта

Полнофункциональный веб-проект для расчета стоимости ремонта квартир с админ-панелью и аналитикой.

## 🏗️ Архитектура проекта

Проект построен на современном стеке технологий с использованием микросервисной архитектуры:

### Frontend (React + TypeScript)
- **Фреймворк**: React 18 + TypeScript
- **Сборщик**: Vite
- **Стили**: Tailwind CSS
- **Иконки**: Lucide React
- **Функции**: Калькулятор стоимости ремонта с отправкой заявок

### Backend (Node.js + Express + TypeScript)
- **Фреймворк**: Express.js + TypeScript
- **База данных**: PostgreSQL
- **Аутентификация**: JWT + bcrypt
- **Валидация**: Joi
- **Безопасность**: Helmet, CORS, Rate Limiting
- **Логирование**: Morgan + Winston

### База данных (PostgreSQL)
- **Версия**: PostgreSQL 15 Alpine
- **Функции**: Хранение заявок, аналитика, представления
- **Миграции**: Автоматическая инициализация

### Админ-панель (React + Material-UI)
- **Фреймворк**: React + TypeScript
- **UI библиотека**: Material-UI
- **Графики**: Recharts
- **Функции**: Просмотр заявок, аналитика, дашборд

### Инфраструктура (Docker)
- **Контейнеризация**: Docker + Docker Compose
- **Веб-сервер**: Nginx для статических файлов
- **Проксирование**: Nginx для API запросов
- **Сеть**: Изолированная Docker сеть

## 🚀 Быстрый старт

### Предварительные требования

1. **Docker** (версия 20.10+)
2. **Docker Compose** (версия 2.0+)
3. **Git**

### Установка и запуск

1. **Клонирование репозитория**
   ```bash
   git clone <repository-url>
   cd DomLS
   ```

2. **Запуск проекта**
   ```bash
   chmod +x start.sh stop.sh
   ./start.sh
   ```

3. **Доступ к сервисам**
   - 🌐 **Фронтенд**: http://localhost:3000
   - 🔧 **API**: http://localhost:3001/api
   - 📊 **Админ-панель**: http://localhost:3002

4. **Данные для входа в админку**
   - **Логин**: `admin`
   - **Пароль**: `admin123`

### Остановка проекта
```bash
./stop.sh
```

## 📊 Функциональность

### Калькулятор ремонта
- ✅ Расчет стоимости по типу ремонта
- ✅ Учет площади помещения
- ✅ Дополнительные услуги
- ✅ Форма контактов
- ✅ Отправка заявок на сервер

### Админ-панель
- ✅ Аутентификация администраторов
- ✅ Просмотр всех заявок
- ✅ Детальная информация о заявках
- ✅ Аналитика и статистика
- ✅ Графики по дням
- ✅ Экспорт данных

### API
- ✅ RESTful API
- ✅ JWT аутентификация
- ✅ Валидация данных
- ✅ Обработка ошибок
- ✅ Логирование
- ✅ Rate limiting

## 🗄️ Структура базы данных

### Основные таблицы

#### `calculator_requests`
- `id` - Уникальный идентификатор
- `repair_type` - Тип ремонта
- `area` - Площадь помещения
- `extras` - Дополнительные услуги (JSONB)
- `calculated_price` - Рассчитанная стоимость
- `customer_name` - Имя клиента
- `customer_phone` - Телефон клиента
- `customer_email` - Email клиента
- `ip_address` - IP адрес
- `user_agent` - User Agent браузера
- `created_at` - Дата создания
- `updated_at` - Дата обновления

#### `admins`
- `id` - Уникальный идентификатор
- `username` - Имя пользователя
- `email` - Email
- `password_hash` - Хеш пароля
- `role` - Роль пользователя
- `is_active` - Активность аккаунта
- `created_at` - Дата создания
- `last_login` - Последний вход

### Представления (Views)

#### `analytics_summary`
Агрегированная статистика по всем заявкам:
- Общее количество заявок
- Средняя стоимость
- Минимальная/максимальная стоимость
- Общая стоимость
- Средняя площадь
- Статистика по дням

#### `repair_type_stats`
Статистика по типам ремонта:
- Количество заявок по типам
- Средняя стоимость по типам
- Общая стоимость по типам

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# База данных
DB_HOST=postgres
DB_PORT=5432
DB_NAME=domls_db
DB_USER=domls_user
DB_PASSWORD=domls_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Сервер
NODE_ENV=production
PORT=3001
```

### Docker Compose

Основные сервисы в `docker-compose.yml`:

- **postgres**: База данных PostgreSQL
- **backend**: API сервер
- **frontend**: Веб-интерфейс
- **admin**: Админ-панель

## 📈 API Endpoints

### Публичные endpoints

```
GET  /api/                    - Информация об API
POST /api/calculator/request  - Создание заявки калькулятора
POST /api/auth/login          - Вход в систему
POST /api/auth/register       - Регистрация (только для разработки)
```

### Защищенные endpoints (требуют JWT токен)

```
GET  /api/admin/requests      - Список всех заявок
GET  /api/admin/requests/:id  - Детали заявки
GET  /api/admin/analytics     - Аналитика
GET  /api/admin/stats/daily   - Статистика по дням
GET  /api/admin/profile       - Профиль администратора
```

## 🛠️ Разработка

### Локальная разработка

1. **Установка зависимостей**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd frontend
   npm install
   
   # Admin
   cd admin
   npm install
   ```

2. **Запуск в режиме разработки**
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend
   cd frontend
   npm run dev
   
   # Admin
   cd admin
   npm run dev
   ```

### Структура проекта

```
DomLS/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Конфигурация БД
│   │   ├── controllers/    # Контроллеры
│   │   ├── middleware/     # Middleware
│   │   ├── models/         # Модели данных
│   │   └── routes/         # Маршруты API
│   ├── init.sql           # Инициализация БД
│   └── Dockerfile         # Docker образ
├── frontend/              # Frontend приложение
│   ├── src/
│   │   └── components/    # React компоненты
│   ├── nginx.conf        # Конфигурация Nginx
│   └── Dockerfile        # Docker образ
├── admin/                # Админ-панель
│   ├── src/              # React компоненты
│   ├── nginx.conf        # Конфигурация Nginx
│   └── Dockerfile        # Docker образ
├── docker-compose.yml    # Docker Compose конфигурация
├── start.sh             # Скрипт запуска
├── stop.sh              # Скрипт остановки
└── README.md            # Документация
```

## 🔒 Безопасность

### Реализованные меры безопасности

- ✅ **JWT токены** для аутентификации
- ✅ **Хеширование паролей** с bcrypt
- ✅ **CORS** настройки
- ✅ **Rate limiting** для API
- ✅ **Helmet** для HTTP заголовков
- ✅ **Валидация данных** на сервере
- ✅ **SQL инъекции** защита через параметризованные запросы
- ✅ **XSS защита** через CSP заголовки

### Рекомендации для продакшена

1. **Измените JWT_SECRET** на уникальный секретный ключ
2. **Настройте HTTPS** для всех сервисов
3. **Ограничьте CORS** только необходимыми доменами
4. **Настройте брандмауэр** для защиты серверов
5. **Регулярно обновляйте** зависимости
6. **Настройте мониторинг** и логирование
7. **Создайте резервные копии** базы данных

## 📊 Мониторинг и логирование

### Логи

- **Backend**: Morgan + Winston
- **Frontend**: Console logs
- **Database**: PostgreSQL logs
- **Nginx**: Access и error logs

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f admin
docker-compose logs -f postgres
```

## 🚀 Развертывание

### Продакшен развертывание

1. **Настройка сервера**
   ```bash
   # Установка Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Установка Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Клонирование и настройка**
   ```bash
   git clone <repository-url>
   cd DomLS
   
   # Создание .env файла
   cp .env.example .env
   # Редактирование .env с продакшен настройками
   ```

3. **Запуск**
   ```bash
   ./start.sh
   ```

### Обновление

```bash
# Остановка
./stop.sh

# Обновление кода
git pull

# Перезапуск
./start.sh
```

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 📞 Поддержка

Если у вас есть вопросы или проблемы:

1. Создайте Issue в GitHub
2. Опишите проблему подробно
3. Приложите логи и скриншоты при необходимости

---

**DomLS** - Современное решение для расчета стоимости ремонта с полной аналитикой и администрированием.
