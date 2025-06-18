"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.comparePassword = exports.hashPassword = exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
// Middleware для проверки JWT токена
const authenticateToken = async (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Проверяем, что пользователь существует и активен
        const result = await (0, database_1.query)('SELECT id, username, role FROM admins WHERE id = $1 AND is_active = true', [decoded.userId]);
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Пользователь не найден или неактивен'
            });
        }
        req.user = result.rows[0];
        next();
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Недействительный токен'
        });
    }
};
exports.authenticateToken = authenticateToken;
// Middleware для проверки роли администратора
const requireAdmin = (req, res, next) => {
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
exports.requireAdmin = requireAdmin;
// Функция для хеширования пароля
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcryptjs_1.default.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
// Функция для сравнения паролей
const comparePassword = async (password, hash) => {
    return await bcryptjs_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
// Функция для генерации JWT токена
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn: '24h' });
};
exports.generateToken = generateToken;
