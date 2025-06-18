"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calculatorController_1 = require("../controllers/calculatorController");
const contactController_1 = require("../controllers/contactController");
const analyticsController_1 = require("../controllers/analyticsController");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Публичные маршруты
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to DomLS API',
        version: '1.0.0',
        endpoints: {
            calculator: '/api/calculator',
            contact: '/api/contact',
            auth: '/api/auth'
        }
    });
});
// Маршруты калькулятора
router.post('/calculator/request', calculatorController_1.CalculatorController.createRequest);
// Маршруты контактов
router.post('/contact/request', contactController_1.ContactController.createRequest);
// Маршруты аутентификации
router.post('/auth/login', authController_1.AuthController.login);
router.post('/auth/register', authController_1.AuthController.register); // Только для разработки
router.post('/auth/logout', authController_1.AuthController.logout);
// Защищенные маршруты (требуют аутентификации)
router.use('/admin', auth_1.authenticateToken, auth_1.requireAdmin);
// Админские маршруты
router.get('/admin/requests', calculatorController_1.CalculatorController.getAllRequests);
router.get('/admin/requests/:id', calculatorController_1.CalculatorController.getRequestById);
router.get('/admin/contact-requests', contactController_1.ContactController.getAllRequests);
router.get('/admin/contact-requests/:id', contactController_1.ContactController.getRequestById);
// Аналитика (старая - только калькулятор)
router.get('/admin/analytics', calculatorController_1.CalculatorController.getAnalytics);
router.get('/admin/stats/daily', calculatorController_1.CalculatorController.getDailyStats);
// Новая объединенная аналитика
router.get('/admin/analytics/combined', analyticsController_1.AnalyticsController.getCombinedAnalytics);
router.get('/admin/stats/daily/combined', analyticsController_1.AnalyticsController.getCombinedDailyStats);
router.get('/admin/profile', authController_1.AuthController.getProfile);
exports.default = router;
