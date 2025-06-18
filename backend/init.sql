-- Инициализация базы данных DomLS

-- Создание таблицы для заявок калькулятора
CREATE TABLE IF NOT EXISTS calculator_requests (
    id SERIAL PRIMARY KEY,
    repair_type VARCHAR(50) NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    extras JSONB NOT NULL DEFAULT '{}',
    calculated_price DECIMAL(12,2) NOT NULL,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для контактов
CREATE TABLE IF NOT EXISTS contact_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    message TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для администраторов
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_calculator_requests_created_at ON calculator_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_calculator_requests_repair_type ON calculator_requests(repair_type);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);

-- Создание функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Создание триггера для автоматического обновления updated_at
CREATE TRIGGER update_calculator_requests_updated_at 
    BEFORE UPDATE ON calculator_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Вставка тестового администратора (пароль: admin123)
INSERT INTO admins (username, email, password_hash, role) 
VALUES ('admin', 'admin@domls.ru', '$2a$12$Z/Zv7Q5ULXYt/SYqxhCjg.E.eTNysdrJ15JQuB1kJNFiUd06ZoYCW', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Создание представления для аналитики
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
    COUNT(*) as total_requests,
    COUNT(DISTINCT DATE(created_at)) as active_days,
    AVG(calculated_price) as avg_price,
    MIN(calculated_price) as min_price,
    MAX(calculated_price) as max_price,
    SUM(calculated_price) as total_value,
    AVG(area) as avg_area,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as requests_last_7_days,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as requests_last_30_days
FROM calculator_requests;

-- Создание представления для статистики по типам ремонта
CREATE OR REPLACE VIEW repair_type_stats AS
SELECT 
    repair_type,
    COUNT(*) as request_count,
    AVG(calculated_price) as avg_price,
    AVG(area) as avg_area,
    SUM(calculated_price) as total_value
FROM calculator_requests
GROUP BY repair_type
ORDER BY request_count DESC; 