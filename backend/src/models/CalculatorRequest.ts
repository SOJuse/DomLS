import { query, getClient } from '../config/database';

export interface CalculatorRequest {
  id?: number;
  repair_type: string;
  area: number;
  extras: Record<string, boolean>;
  calculated_price: number;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: Date;
  updated_at?: Date;
  material?: string;
  deadline?: string;
  stage?: string;
}

export interface AnalyticsSummary {
  total_requests: number;
  active_days: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  total_value: number;
  avg_area: number;
  requests_last_7_days: number;
  requests_last_30_days: number;
}

export interface RepairTypeStats {
  repair_type: string;
  request_count: number;
  avg_price: number;
  avg_area: number;
  total_value: number;
}

export class CalculatorRequestModel {
  // Создание новой заявки
  static async create(data: CalculatorRequest): Promise<CalculatorRequest> {
    const {
      repair_type,
      area,
      extras,
      calculated_price,
      customer_name,
      customer_phone,
      customer_email,
      ip_address,
      user_agent,
      material,
      deadline,
      stage
    } = data;

    const result = await query(
      `INSERT INTO calculator_requests 
       (repair_type, area, extras, calculated_price, customer_name, customer_phone, customer_email, ip_address, user_agent, material, deadline, stage)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [repair_type, area, JSON.stringify(extras), calculated_price, customer_name, customer_phone, customer_email, ip_address, user_agent, material, deadline, stage]
    );

    return result.rows[0];
  }

  // Получение всех заявок с пагинацией
  static async findAll(page: number = 1, limit: number = 20): Promise<{ requests: CalculatorRequest[], total: number }> {
    const offset = (page - 1) * limit;

    const [requestsResult, totalResult] = await Promise.all([
      query(
        `SELECT * FROM calculator_requests 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query('SELECT COUNT(*) as total FROM calculator_requests')
    ]);

    return {
      requests: requestsResult.rows,
      total: parseInt(totalResult.rows[0].total)
    };
  }

  // Получение заявки по ID
  static async findById(id: number): Promise<CalculatorRequest | null> {
    const result = await query(
      'SELECT * FROM calculator_requests WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  // Получение аналитики
  static async getAnalytics(): Promise<AnalyticsSummary> {
    const result = await query('SELECT * FROM analytics_summary');
    return result.rows[0];
  }

  // Получение статистики по типам ремонта
  static async getRepairTypeStats(): Promise<RepairTypeStats[]> {
    const result = await query('SELECT * FROM repair_type_stats');
    return result.rows;
  }

  // Получение заявок за последние N дней
  static async getRecentRequests(days: number = 7): Promise<CalculatorRequest[]> {
    const result = await query(
      `SELECT * FROM calculator_requests 
       WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY created_at DESC`
    );

    return result.rows;
  }

  // Получение статистики по дням
  static async getDailyStats(days: number = 30): Promise<Array<{ date: string, count: number, total_value: number }>> {
    const result = await query(
      `SELECT 
         DATE(created_at) as date,
         COUNT(*) as count,
         SUM(calculated_price) as total_value
       FROM calculator_requests 
       WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    );

    return result.rows;
  }
} 