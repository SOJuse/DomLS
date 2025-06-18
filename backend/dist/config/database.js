"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.query = exports.testConnection = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let pool;
if (process.env.DATABASE_URL) {
    console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
    pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: false
    });
}
else {
    const dbConfig = {
        user: process.env.DB_USER || 'domls_user',
        host: process.env.DB_HOST || 'postgres',
        database: process.env.DB_NAME || 'domls_db',
        password: process.env.DB_PASSWORD || 'domls_password',
        port: parseInt(process.env.DB_PORT || '5432'),
        max: 20, // максимальное количество клиентов в пуле
        idleTimeoutMillis: 30000, // время неактивности клиента
        connectionTimeoutMillis: 2000, // время ожидания подключения
        ssl: false
    };
    console.log('Using PoolConfig:', dbConfig);
    pool = new pg_1.Pool(dbConfig);
}
// Обработка ошибок пула
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
// Функция для тестирования подключения
const testConnection = async () => {
    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        console.log('✅ Database connection successful');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
};
exports.testConnection = testConnection;
// Функция для выполнения запросов
const query = (text, params) => pool.query(text, params);
exports.query = query;
// Функция для получения клиента для транзакций
const getClient = () => pool.connect();
exports.getClient = getClient;
exports.default = pool;
