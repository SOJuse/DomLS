"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
class AuthController {
    // Вход в систему
    static async login(req, res) {
        try {
            // Валидация входных данных
            const validation = (0, validation_1.validateLogin)(req.body);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Ошибка валидации',
                    errors: validation.errors
                });
            }
            const { username, password } = req.body;
            // Поиск пользователя в базе данных
            const result = await (0, database_1.query)('SELECT id, username, password_hash, role, is_active FROM admins WHERE username = $1', [username]);
            if (result.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Неверное имя пользователя или пароль'
                });
            }
            const user = result.rows[0];
            // Проверка активности пользователя
            if (!user.is_active) {
                return res.status(401).json({
                    success: false,
                    message: 'Аккаунт заблокирован'
                });
            }
            // Проверка пароля
            const isValidPassword = await (0, auth_1.comparePassword)(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Неверное имя пользователя или пароль'
                });
            }
            // Обновление времени последнего входа
            await (0, database_1.query)('UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
            // Генерация JWT токена
            const token = (0, auth_1.generateToken)(user.id);
            res.json({
                success: true,
                message: 'Успешный вход в систему',
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    }
                }
            });
        }
        catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера'
            });
        }
    }
    // Регистрация нового администратора (только для разработки)
    static async register(req, res) {
        try {
            const { username, email, password, role = 'admin' } = req.body;
            // Проверка обязательных полей
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Все поля обязательны для заполнения'
                });
            }
            // Проверка уникальности username и email
            const existingUser = await (0, database_1.query)('SELECT id FROM admins WHERE username = $1 OR email = $2', [username, email]);
            if (existingUser.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Пользователь с таким именем или email уже существует'
                });
            }
            // Хеширование пароля
            const passwordHash = await (0, auth_1.hashPassword)(password);
            // Создание нового пользователя
            const result = await (0, database_1.query)(`INSERT INTO admins (username, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, role`, [username, email, passwordHash, role]);
            const newUser = result.rows[0];
            res.status(201).json({
                success: true,
                message: 'Администратор успешно создан',
                data: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role
                }
            });
        }
        catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера'
            });
        }
    }
    // Получение профиля текущего пользователя
    static async getProfile(req, res) {
        try {
            // req.user будет установлен middleware authenticateToken
            const user = req.user;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Требуется аутентификация'
                });
            }
            res.json({
                success: true,
                data: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        }
        catch (error) {
            console.error('Error getting profile:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера'
            });
        }
    }
    // Выход из системы (опционально, можно реализовать blacklist токенов)
    static async logout(req, res) {
        try {
            // В простой реализации просто возвращаем успешный ответ
            // В продакшене можно добавить blacklist токенов
            res.json({
                success: true,
                message: 'Успешный выход из системы'
            });
        }
        catch (error) {
            console.error('Error during logout:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера'
            });
        }
    }
}
exports.AuthController = AuthController;
