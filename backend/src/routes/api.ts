import { Router } from 'express';
import { CalculatorController } from '../controllers/calculatorController';
import { ContactController } from '../controllers/contactController';
import { AnalyticsController } from '../controllers/analyticsController';
import { AuthController } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

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
router.post('/calculator/request', CalculatorController.createRequest);

// Маршруты контактов
router.post('/contact/request', ContactController.createRequest);

// Маршруты аутентификации
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register); // Только для разработки
router.post('/auth/logout', AuthController.logout);

// Защищенные маршруты (требуют аутентификации)
router.use('/admin', authenticateToken, requireAdmin);

// Админские маршруты
router.get('/admin/requests', CalculatorController.getAllRequests);
router.get('/admin/requests/:id', CalculatorController.getRequestById);
router.get('/admin/contact-requests', ContactController.getAllRequests);
router.get('/admin/contact-requests/:id', ContactController.getRequestById);

// Аналитика (старая - только калькулятор)
router.get('/admin/analytics', CalculatorController.getAnalytics);
router.get('/admin/stats/daily', CalculatorController.getDailyStats);

// Новая объединенная аналитика
router.get('/admin/analytics/combined', AnalyticsController.getCombinedAnalytics);
router.get('/admin/stats/daily/combined', AnalyticsController.getCombinedDailyStats);

router.get('/admin/profile', AuthController.getProfile);

export default router; 