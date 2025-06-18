"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRequestModel = void 0;
const database_1 = require("../config/database");
class ContactRequestModel {
    // Создание новой контактной заявки
    static async create(data) {
        const { name, phone, email, message, ip_address, user_agent } = data;
        const result = await (0, database_1.query)(`INSERT INTO contact_requests 
       (name, phone, email, message, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`, [name, phone, email, message, ip_address, user_agent]);
        return result.rows[0];
    }
    // Получение всех контактных заявок с пагинацией
    static async findAll(page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const [requestsResult, totalResult] = await Promise.all([
            (0, database_1.query)(`SELECT * FROM contact_requests 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`, [limit, offset]),
            (0, database_1.query)('SELECT COUNT(*) as total FROM contact_requests')
        ]);
        return {
            requests: requestsResult.rows,
            total: parseInt(totalResult.rows[0].total)
        };
    }
    // Получение контактной заявки по ID
    static async findById(id) {
        const result = await (0, database_1.query)('SELECT * FROM contact_requests WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    // Получение контактных заявок за последние N дней
    static async getRecentRequests(days = 7) {
        const result = await (0, database_1.query)(`SELECT * FROM contact_requests 
       WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY created_at DESC`);
        return result.rows;
    }
}
exports.ContactRequestModel = ContactRequestModel;
