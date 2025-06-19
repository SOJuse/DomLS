"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const ContactRequest_1 = require("../models/ContactRequest");
const validation_1 = require("../middleware/validation");
class ContactController {
    // Создание новой контактной заявки
    static async createRequest(req, res) {
        try {
            console.log('Received contact request data:', req.body);
            // Валидация входных данных
            const validation = (0, validation_1.validateContactRequest)(req.body);
            console.log('Validation result:', validation);
            if (!validation.isValid) {
                console.log('Validation errors:', validation.errors);
                return res.status(400).json({
                    success: false,
                    message: 'Ошибка валидации',
                    errors: validation.errors
                });
            }
            const { name, phone, email, message } = req.body;
            // Получаем IP адрес и User Agent
            const ip_address = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
            const user_agent = req.headers['user-agent'];
            // Создаем заявку
            const request = await ContactRequest_1.ContactRequestModel.create({
                name,
                phone,
                email,
                message,
                ip_address,
                user_agent
            });
            console.log('Contact request created successfully:', request.id);
            res.status(201).json({
                success: true,
                message: 'Заявка успешно создана',
                data: request
            });
        }
        catch (error) {
            console.error('Error creating contact request:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера'
            });
        }
    }
    // Получение всех контактных заявок (для админки)
    static async getAllRequests(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await ContactRequest_1.ContactRequestModel.findAll(page, limit);
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
        }
        catch (error) {
            console.error('Error fetching contact requests:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера'
            });
        }
    }
    // Получение контактной заявки по ID
    static async getRequestById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Неверный ID заявки'
                });
            }
            const request = await ContactRequest_1.ContactRequestModel.findById(id);
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
        }
        catch (error) {
            console.error('Error fetching contact request:', error);
            res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера'
            });
        }
    }
}
exports.ContactController = ContactController;
