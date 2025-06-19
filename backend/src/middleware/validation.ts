import Joi from 'joi';

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

// Схема валидации для заявки калькулятора
const calculatorRequestSchema = Joi.object({
  repair_type: Joi.string().valid('черновой', 'косметический', 'капитальный', 'дизайнерский').required(),
  area: Joi.number().positive().max(1000).required(),
  extras: Joi.object({
    design: Joi.boolean().default(false),
    plumbing: Joi.boolean().default(false),
    appliances: Joi.boolean().default(false),
    demolition: Joi.boolean().default(false)
  }).default({}),
  calculated_price: Joi.number().positive().required(),
  customer_name: Joi.string().max(100).optional(),
  customer_phone: Joi.string().max(20).optional(),
  customer_email: Joi.string().email().optional(),
  material: Joi.string().max(32).optional(),
  deadline: Joi.string().max(32).optional(),
  stage: Joi.string().max(32).optional()
});

// Функция валидации заявки калькулятора
export const validateCalculatorRequest = (data: any): ValidationResult => {
  const { error } = calculatorRequestSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map((detail: Joi.ValidationErrorItem) => detail.message)
    };
  }

  return { isValid: true };
};

// Схема валидации для контактной формы
const contactRequestSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().min(10).max(20).required(),
  email: Joi.string().email().allow('').optional(),
  message: Joi.string().max(1000).optional()
});

// Функция валидации контактной формы
export const validateContactRequest = (data: any): ValidationResult => {
  const { error } = contactRequestSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map((detail: Joi.ValidationErrorItem) => detail.message)
    };
  }

  return { isValid: true };
};

// Схема валидации для аутентификации
const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required()
});

// Функция валидации логина
export const validateLogin = (data: any): ValidationResult => {
  const { error } = loginSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map((detail: Joi.ValidationErrorItem) => detail.message)
    };
  }

  return { isValid: true };
}; 