import { Request, Response } from 'express';
import { CalculatorRequestModel, CalculatorRequest } from '../models/CalculatorRequest';
import { validateCalculatorRequest } from '../middleware/validation';

export class CalculatorController {
  // Создание новой заявки
  static async createRequest(req: Request, res: Response) {
    try {
      // Валидация входных данных
      const validation = validateCalculatorRequest(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Ошибка валидации',
          errors: validation.errors
        });
      }

      const {
        repair_type,
        area,
        extras,
        calculated_price,
        customer_name,
        customer_phone,
        customer_email
      } = req.body;

      // Получаем IP адрес и User Agent
      const ip_address = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] as string;
      const user_agent = req.headers['user-agent'];

      // Создаем заявку
      const request = await CalculatorRequestModel.create({
        repair_type,
        area: parseFloat(area),
        extras,
        calculated_price: parseFloat(calculated_price),
        customer_name,
        customer_phone,
        customer_email,
        ip_address,
        user_agent
      });

      res.status(201).json({
        success: true,
        message: 'Заявка успешно создана',
        data: request
      });

    } catch (error) {
      console.error('Error creating calculator request:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
      });
    }
  }

  // Получение всех заявок (для админки)
  static async getAllRequests(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await CalculatorRequestModel.findAll(page, limit);

      res.json({
        success: true,
        data: result.requests,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });

    } catch (error) {
      console.error('Error fetching calculator requests:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
      });
    }
  }

  // Получение заявки по ID
  static async getRequestById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Неверный ID заявки'
        });
      }

      const request = await CalculatorRequestModel.findById(id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Заявка не найдена'
        });
      }

      res.json({
        success: true,
        data: request
      });

    } catch (error) {
      console.error('Error fetching calculator request:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
      });
    }
  }

  // Получение аналитики
  static async getAnalytics(req: Request, res: Response) {
    try {
      const [analytics, repairTypeStats, recentRequests, dailyStats] = await Promise.all([
        CalculatorRequestModel.getAnalytics(),
        CalculatorRequestModel.getRepairTypeStats(),
        CalculatorRequestModel.getRecentRequests(7),
        CalculatorRequestModel.getDailyStats(30)
      ]);

      res.json({
        success: true,
        data: {
          analytics,
          repairTypeStats,
          recentRequests,
          dailyStats
        }
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
      });
    }
  }

  // Получение статистики по дням
  static async getDailyStats(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const stats = await CalculatorRequestModel.getDailyStats(days);

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error fetching daily stats:', error);
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
      });
    }
  }
} 