"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const api_1 = __importDefault(require("./routes/api"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Настройка trust proxy для корректной работы с Docker
app.set('trust proxy', 1);
// Настройка безопасности
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
// Настройка CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['http://localhost:3000', 'http://localhost:3002']
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
// Сжатие ответов
app.use((0, compression_1.default)());
// Логирование
app.use((0, morgan_1.default)('combined'));
// Ограничение скорости запросов (временно отключено для отладки)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 минут
//   max: 100, // максимум 100 запросов с одного IP
//   message: {
//     success: false,
//     message: 'Слишком много запросов с вашего IP, попробуйте позже'
//   }
// });
// app.use('/api/', limiter);
// Парсинг JSON
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Маршруты API
app.use('/api', api_1.default);
// Обработка 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Маршрут не найден'
    });
});
// Глобальная обработка ошибок
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(error.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Внутренняя ошибка сервера'
            : error.message
    });
});
// Функция запуска сервера
const startServer = async () => {
    try {
        // Тестируем подключение к базе данных
        const dbConnected = await (0, database_1.testConnection)();
        if (!dbConnected) {
            console.error('❌ Failed to connect to database. Exiting...');
            process.exit(1);
        }
        // Запускаем сервер
        app.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API Base URL: http://localhost:${port}/api`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Обработка сигналов завершения
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
// Запускаем сервер
startServer();
