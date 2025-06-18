import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

// Middleware для проверки JWT токена
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Токен доступа не предоставлен'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    const decoded = jwt.verify(token, secret) as any;
    
    // Проверяем, что пользователь существует и активен
    const result = await query(
      'SELECT id, username, role FROM admins WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Пользователь не найден или неактивен'
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Недействительный токен'
    });
  }
};

// Middleware для проверки роли администратора
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Требуется аутентификация'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Недостаточно прав доступа'
    });
  }

  next();
};

// Функция для хеширования пароля
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Функция для сравнения паролей
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Функция для генерации JWT токена
export const generateToken = (userId: number): string => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
  return jwt.sign({ userId }, secret, { expiresIn: '24h' });
}; 