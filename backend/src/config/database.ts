import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool;

if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });
} else {
  const dbConfig: PoolConfig = {
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
  pool = new Pool(dbConfig);
}

// Обработка ошибок пула
pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Функция для тестирования подключения
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Функция для выполнения запросов
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Функция для получения клиента для транзакций
export const getClient = () => pool.connect();

export default pool; 