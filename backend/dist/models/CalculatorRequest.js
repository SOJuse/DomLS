"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatorRequestModel = void 0;
const database_1 = require("../config/database");
class CalculatorRequestModel {
    // Создание новой заявки
    static async create(data) {
        const { repair_type, area, extras, calculated_price, customer_name, customer_phone, customer_email, ip_address, user_agent } = data;
        const result = await (0, database_1.query)(`INSERT INTO calculator_requests 
       (repair_type, area, extras, calculated_price, customer_name, customer_phone, customer_email, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`, [repair_type, area, JSON.stringify(extras), calculated_price, customer_name, customer_phone, customer_email, ip_address, user_agent]);
        return result.rows[0];
    }
    // Получение всех заявок с пагинацией
    static async findAll(page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const [requestsResult, totalResult] = await Promise.all([
            (0, database_1.query)(`SELECT * FROM calculator_requests 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`, [limit, offset]),
            (0, database_1.query)('SELECT COUNT(*) as total FROM calculator_requests')
        ]);
        return {
            requests: requestsResult.rows,
            total: parseInt(totalResult.rows[0].total)
        };
    }
    // Получение заявки по ID
    static async findById(id) {
        const result = await (0, database_1.query)('SELECT * FROM calculator_requests WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    // Получение аналитики
    static async getAnalytics() {
        const result = await (0, database_1.query)('SELECT * FROM analytics_summary');
        return result.rows[0];
    }
    // Получение статистики по типам ремонта
    static async getRepairTypeStats() {
        const result = await (0, database_1.query)('SELECT * FROM repair_type_stats');
        return result.rows;
    }
    // Получение заявок за последние N дней
    static async getRecentRequests(days = 7) {
        const result = await (0, database_1.query)(`SELECT * FROM calculator_requests 
       WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY created_at DESC`);
        return result.rows;
    }
    // Получение статистики по дням
    static async getDailyStats(days = 30) {
        const result = await (0, database_1.query)(`SELECT 
         DATE(created_at) as date,
         COUNT(*) as count,
         SUM(calculated_price) as total_value
       FROM calculator_requests 
       WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`);
        return result.rows;
    }
}
exports.CalculatorRequestModel = CalculatorRequestModel;
