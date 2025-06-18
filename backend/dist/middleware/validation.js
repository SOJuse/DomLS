"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateContactRequest = exports.validateCalculatorRequest = void 0;
const joi_1 = __importDefault(require("joi"));
// Схема валидации для заявки калькулятора
const calculatorRequestSchema = joi_1.default.object({
    repair_type: joi_1.default.string().valid('черновой', 'косметический', 'капитальный', 'дизайнерский').required(),
    area: joi_1.default.number().positive().max(1000).required(),
    extras: joi_1.default.object({
        design: joi_1.default.boolean().default(false),
        plumbing: joi_1.default.boolean().default(false),
        appliances: joi_1.default.boolean().default(false),
        demolition: joi_1.default.boolean().default(false)
    }).default({}),
    calculated_price: joi_1.default.number().positive().required(),
    customer_name: joi_1.default.string().max(100).optional(),
    customer_phone: joi_1.default.string().max(20).optional(),
    customer_email: joi_1.default.string().email().optional()
});
// Функция валидации заявки калькулятора
const validateCalculatorRequest = (data) => {
    const { error } = calculatorRequestSchema.validate(data, { abortEarly: false });
    if (error) {
        return {
            isValid: false,
            errors: error.details.map((detail) => detail.message)
        };
    }
    return { isValid: true };
};
exports.validateCalculatorRequest = validateCalculatorRequest;
// Схема валидации для контактной формы
const contactRequestSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    phone: joi_1.default.string().min(10).max(20).required(),
    email: joi_1.default.string().email().optional(),
    message: joi_1.default.string().max(1000).optional()
});
// Функция валидации контактной формы
const validateContactRequest = (data) => {
    const { error } = contactRequestSchema.validate(data, { abortEarly: false });
    if (error) {
        return {
            isValid: false,
            errors: error.details.map((detail) => detail.message)
        };
    }
    return { isValid: true };
};
exports.validateContactRequest = validateContactRequest;
// Схема валидации для аутентификации
const loginSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(50).required(),
    password: joi_1.default.string().min(6).required()
});
// Функция валидации логина
const validateLogin = (data) => {
    const { error } = loginSchema.validate(data, { abortEarly: false });
    if (error) {
        return {
            isValid: false,
            errors: error.details.map((detail) => detail.message)
        };
    }
    return { isValid: true };
};
exports.validateLogin = validateLogin;
