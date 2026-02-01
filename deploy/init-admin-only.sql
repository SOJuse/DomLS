-- Минимальная инициализация: таблица admins + пользователь
-- Использовать если relation "admins" does not exist

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

CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);

INSERT INTO admins (username, email, password_hash, role, is_active) 
VALUES ('admin', 'admin@domls.ru', '$2a$12$Z/Zv7Q5ULXYt/SYqxhCjg.E.eTNysdrJ15JQuB1kJNFiUd06ZoYCW', 'admin', true)
ON CONFLICT (username) DO NOTHING;
