-- Скрипт для создания admin, если не работает логин
-- Выполнить на сервере: docker exec -i domls_postgres psql -U domls_user -d domls_db < deploy/fix-admin.sql

-- Убедимся, что admin есть (пароль: admin123)
INSERT INTO admins (username, email, password_hash, role, is_active) 
VALUES ('admin', 'admin@domls.ru', '$2a$12$Z/Zv7Q5ULXYt/SYqxhCjg.E.eTNysdrJ15JQuB1kJNFiUd06ZoYCW', 'admin', true)
ON CONFLICT (username) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  is_active = true;
