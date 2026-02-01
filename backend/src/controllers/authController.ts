import { Request, Response } from 'express';
import { query } from '../config/database';
import { comparePassword, generateToken, hashPassword } from '../middleware/auth';
import { validateLogin } from '../middleware/validation';

export class AuthController {
  // Вход в систему
  static async login(req: Request, res: Response) {
    try {
      // Валидация входных данных
      const validation = validateLogin(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Ошибка валидации',
          errors: validation.errors
        });
      }

      const { username, password } = req.body;

      // Поиск пользователя в базе данных
      const result = await query(
        'SELECT id, username, password_hash, role, is_active FROM admins WHERE username = $1',
        [username]
      );

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
      const isValidPassword = await comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Неверное имя пользователя или пароль'
        });
      }

      // Обновление времени последнего входа
      await query(
        'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Генерация JWT токена
      const token = generateToken(user.id);

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

    } catch (error) {
      const err = error as Error;
      console.error('Error during login:', err.message, err.stack);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        ...(process.env.NODE_ENV !== 'production' && { debug: err.message })
      });
    }
  }

  // Регистрация нового администратора (только для разработки)
  static async register(req: Request, res: Response) {
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
      const existingUser = await query(
        'SELECT id FROM admins WHERE username = $1 OR email = $2',
        [username, email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Пользователь с таким именем или email уже существует'
        });
      }

      // Хеширование пароля
      const passwordHash = await hashPassword(password);

      // Создание нового пользователя
      const result = await query(
        `INSERT INTO admins (username, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, role`,
        [username, email, passwordHash, role]
      );

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

    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
      });
    }
  }

  // Получение профиля текущего пользователя
  static async getProfile(req: Request, res: Response) {
    try {
      // req.user будет установлен middleware authenticateToken
      const user = (req as any).user;

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

    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
      });
    }
  }

  // Выход из системы (опционально, можно реализовать blacklist токенов)
  static async logout(req: Request, res: Response) {
    try {
      // В простой реализации просто возвращаем успешный ответ
      // В продакшене можно добавить blacklist токенов
      res.json({
        success: true,
        message: 'Успешный выход из системы'
      });

    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
      });
    }
  }
} 