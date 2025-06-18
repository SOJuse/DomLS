import { query } from '../config/database';

export interface ContactRequest {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: Date;
}

export class ContactRequestModel {
  // Создание новой контактной заявки
  static async create(data: ContactRequest): Promise<ContactRequest> {
    const {
      name,
      phone,
      email,
      message,
      ip_address,
      user_agent
    } = data;

    const result = await query(
      `INSERT INTO contact_requests 
       (name, phone, email, message, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, phone, email, message, ip_address, user_agent]
    );

    return result.rows[0];
  }

  // Получение всех контактных заявок с пагинацией
  static async findAll(page: number = 1, limit: number = 20): Promise<{ requests: ContactRequest[], total: number }> {
    const offset = (page - 1) * limit;

    const [requestsResult, totalResult] = await Promise.all([
      query(
        `SELECT * FROM contact_requests 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query('SELECT COUNT(*) as total FROM contact_requests')
    ]);

    return {
      requests: requestsResult.rows,
      total: parseInt(totalResult.rows[0].total)
    };
  }

  // Получение контактной заявки по ID
  static async findById(id: number): Promise<ContactRequest | null> {
    const result = await query(
      'SELECT * FROM contact_requests WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  // Получение контактных заявок за последние N дней
  static async getRecentRequests(days: number = 7): Promise<ContactRequest[]> {
    const result = await query(
      `SELECT * FROM contact_requests 
       WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY created_at DESC`
    );

    return result.rows;
  }
} 