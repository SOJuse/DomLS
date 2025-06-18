"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const database_1 = require("../config/database");
class AnalyticsController {
    // Получение общей аналитики
    static async getCombinedAnalytics(req, res) {
        try {
            // Получаем общую статистику
            const analyticsResult = await (0, database_1.query)(`
        SELECT 
          (SELECT COUNT(*) FROM calculator_requests) as calculator_requests,
          (SELECT COUNT(*) FROM contact_requests) as contact_requests,
          (SELECT COUNT(*) FROM calculator_requests) + (SELECT COUNT(*) FROM contact_requests) as total_requests,
          (SELECT COUNT(DISTINCT DATE(created_at)) FROM calculator_requests) + 
          (SELECT COUNT(DISTINCT DATE(created_at)) FROM contact_requests) as active_days,
          (SELECT AVG(calculated_price) FROM calculator_requests) as avg_price,
          (SELECT MIN(calculated_price) FROM calculator_requests) as min_price,
          (SELECT MAX(calculated_price) FROM calculator_requests) as max_price,
          (SELECT SUM(calculated_price) FROM calculator_requests) as total_value,
          (SELECT AVG(area) FROM calculator_requests) as avg_area,
          (SELECT COUNT(*) FROM calculator_requests WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as calculator_requests_last_7_days,
          (SELECT COUNT(*) FROM contact_requests WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as contact_requests_last_7_days,
          (SELECT COUNT(*) FROM calculator_requests WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as calculator_requests_last_30_days,
          (SELECT COUNT(*) FROM contact_requests WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as contact_requests_last_30_days
      `);
            const analytics = analyticsResult.rows[0];
            // Вычисляем общие значения для последних дней
            const requests_last_7_days = parseInt(analytics.calculator_requests_last_7_days || 0) +
                parseInt(analytics.contact_requests_last_7_days || 0);
            const requests_last_30_days = parseInt(analytics.calculator_requests_last_30_days || 0) +
                parseInt(analytics.contact_requests_last_30_days || 0);
            const combinedAnalytics = {
                total_requests: parseInt(analytics.total_requests || 0),
                calculator_requests: parseInt(analytics.calculator_requests || 0),
                contact_requests: parseInt(analytics.contact_requests || 0),
                active_days: parseInt(analytics.active_days || 0),
                avg_price: parseFloat(analytics.avg_price || 0),
                min_price: parseFloat(analytics.min_price || 0),
                max_price: parseFloat(analytics.max_price || 0),
                total_value: parseFloat(analytics.total_value || 0),
                avg_area: parseFloat(analytics.avg_area || 0),
                requests_last_7_days,
                requests_last_30_days,
                calculator_requests_last_7_days: parseInt(analytics.calculator_requests_last_7_days || 0),
                contact_requests_last_7_days: parseInt(analytics.contact_requests_last_7_days || 0),
                calculator_requests_last_30_days: parseInt(analytics.calculator_requests_last_30_days || 0),
                contact_requests_last_30_days: parseInt(analytics.contact_requests_last_30_days || 0)
            };
            res.json({
                success: true,
                data: {
                    analytics: combinedAnalytics
                }
            });
        }
        catch (error) {
            console.error('Error fetching combined analytics:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера'
            });
        }
    }
    // Получение статистики по дням (объединенной)
    static async getCombinedDailyStats(req, res) {
        try {
            const days = parseInt(req.query.days) || 30;
            const result = await (0, database_1.query)(`
        SELECT 
          date,
          calculator_count,
          contact_count,
          calculator_count + contact_count as total_count,
          calculator_value,
          contact_value,
          calculator_value + contact_value as total_value
        FROM (
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as calculator_count,
            SUM(calculated_price) as calculator_value
          FROM calculator_requests 
          WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
          GROUP BY DATE(created_at)
        ) calc_stats
        FULL OUTER JOIN (
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as contact_count,
            0 as contact_value
          FROM contact_requests 
          WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
          GROUP BY DATE(created_at)
        ) contact_stats USING (date)
        ORDER BY date DESC
      `);
            // Обрабатываем NULL значения
            const stats = result.rows.map(row => ({
                date: row.date,
                count: (parseInt(row.calculator_count || 0) + parseInt(row.contact_count || 0)),
                total_value: parseFloat(row.calculator_value || 0) + parseFloat(row.contact_value || 0),
                calculator_count: parseInt(row.calculator_count || 0),
                contact_count: parseInt(row.contact_count || 0)
            }));
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            console.error('Error fetching combined daily stats:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера'
            });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
