import React, { useState } from 'react';
import { Calculator as CalcIcon, CheckCircle, Send, User, Phone, Mail } from 'lucide-react';

interface CalculatorRequest {
  repair_type: string;
  area: number;
  extras: Record<string, boolean>;
  calculated_price: number;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
}

const Calculator: React.FC = () => {
  const [repairType, setRepairType] = useState('');
  const [area, setArea] = useState('');
  const [extras, setExtras] = useState({
    design: false,
    plumbing: false,
    appliances: false,
    demolition: false
  });
  const [result, setResult] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: ''
  });

  const basePrices = {
    'черновой': 5000,
    'косметический': 7000,
    'капитальный': 10000,
    'дизайнерский': 15000
  };

  const extraPrices = {
    design: 1000,
    plumbing: 1500,
    appliances: 1200,
    demolition: 800
  };

  const calculatePrice = () => {
    if (!repairType || !area) return;

    const basePrice = basePrices[repairType as keyof typeof basePrices];
    const extrasSum = Object.entries(extras).reduce((sum, [key, value]) => {
      return sum + (value ? extraPrices[key as keyof typeof extraPrices] : 0);
    }, 0);

    const finalPrice = (basePrice + extrasSum) * parseInt(area);
    setResult(finalPrice);
  };

  const handleExtraChange = (key: string) => {
    setExtras(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitRequest = async () => {
    if (!result) return;

    setIsSubmitting(true);
    
    try {
      const requestData: CalculatorRequest = {
        repair_type: repairType,
        area: parseFloat(area),
        extras,
        calculated_price: result,
        ...contactData
      };

      const response = await fetch('/api/calculator/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setShowContactForm(false);
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.message || 'Не удалось отправить заявку'}`);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Ошибка при отправке заявки. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRepairType('');
    setArea('');
    setExtras({
      design: false,
      plumbing: false,
      appliances: false,
      demolition: false
    });
    setResult(null);
    setIsSubmitted(false);
    setShowContactForm(false);
    setContactData({
      customer_name: '',
      customer_phone: '',
      customer_email: ''
    });
  };

  return (
    <section id="calculator" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Калькулятор стоимости</h2>
          <p className="text-xl text-gray-600">
            Рассчитайте примерную стоимость ремонта вашей квартиры
          </p>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Тип ремонта
                </label>
                <div className="space-y-3">
                  {Object.entries(basePrices).map(([type, price]) => (
                    <label key={type} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="repairType"
                        value={type}
                        checked={repairType === type}
                        onChange={(e) => setRepairType(e.target.value)}
                        className="w-4 h-4 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                      />
                      <span className="text-gray-700 capitalize">{type}</span>
                      <span className="text-[#1e3a8a] font-medium">от {price.toLocaleString()}₽/м²</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Площадь квартиры (м²)
                </label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Введите площадь"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Дополнительные услуги
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extras.design}
                      onChange={() => handleExtraChange('design')}
                      className="w-4 h-4 text-[#1e3a8a] focus:ring-[#1e3a8a] rounded"
                    />
                    <span className="text-gray-700">Дизайн-проект</span>
                    <span className="text-[#1e3a8a] font-medium">+1000₽/м²</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extras.plumbing}
                      onChange={() => handleExtraChange('plumbing')}
                      className="w-4 h-4 text-[#1e3a8a] focus:ring-[#1e3a8a] rounded"
                    />
                    <span className="text-gray-700">Монтаж сантехники</span>
                    <span className="text-[#1e3a8a] font-medium">+1500₽/м²</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extras.appliances}
                      onChange={() => handleExtraChange('appliances')}
                      className="w-4 h-4 text-[#1e3a8a] focus:ring-[#1e3a8a] rounded"
                    />
                    <span className="text-gray-700">Установка техники</span>
                    <span className="text-[#1e3a8a] font-medium">+1200₽/м²</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extras.demolition}
                      onChange={() => handleExtraChange('demolition')}
                      className="w-4 h-4 text-[#1e3a8a] focus:ring-[#1e3a8a] rounded"
                    />
                    <span className="text-gray-700">Демонтажные работы</span>
                    <span className="text-[#1e3a8a] font-medium">+800₽/м²</span>
                  </label>
                </div>
              </div>

              <button
                onClick={calculatePrice}
                disabled={!repairType || !area}
                className="w-full bg-[#1e3a8a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CalcIcon className="h-5 w-5" />
                <span>Рассчитать стоимость</span>
              </button>
            </div>

            <div className="flex items-center justify-center">
              {isSubmitted ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center w-full">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Заявка отправлена!</h3>
                  <p className="text-gray-600 mb-6">
                    Мы получили вашу заявку и свяжемся с вами в ближайшее время
                  </p>
                  <button 
                    onClick={resetForm}
                    className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300"
                  >
                    Рассчитать еще раз
                  </button>
                </div>
              ) : result ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center w-full">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Примерная стоимость</h3>
                  <div className="text-4xl font-bold text-[#1e3a8a] mb-4">
                    {result.toLocaleString()}₽
                  </div>
                  <p className="text-gray-600 mb-6">
                    Окончательная стоимость определяется после осмотра объекта
                  </p>
                  
                  {!showContactForm ? (
                    <button 
                      onClick={() => setShowContactForm(true)}
                      className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300"
                    >
                      Отправить заявку
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <User className="inline h-4 w-4 mr-1" />
                          Ваше имя
                        </label>
                        <input
                          type="text"
                          value={contactData.customer_name}
                          onChange={(e) => handleContactChange('customer_name', e.target.value)}
                          placeholder="Введите ваше имя"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Phone className="inline h-4 w-4 mr-1" />
                          Телефон
                        </label>
                        <input
                          type="tel"
                          value={contactData.customer_phone}
                          onChange={(e) => handleContactChange('customer_phone', e.target.value)}
                          placeholder="+7 926 185 65 08"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Mail className="inline h-4 w-4 mr-1" />
                          Email (необязательно)
                        </label>
                        <input
                          type="email"
                          value={contactData.customer_email}
                          onChange={(e) => handleContactChange('customer_email', e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={submitRequest}
                          disabled={isSubmitting || !contactData.customer_name || !contactData.customer_phone}
                          className="flex-1 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <Send className="h-4 w-4" />
                          <span>{isSubmitting ? 'Отправка...' : 'Отправить'}</span>
                        </button>
                        <button
                          onClick={() => setShowContactForm(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center w-full">
                  <CalcIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">
                    Заполните форму
                  </h3>
                  <p className="text-gray-400">
                    Выберите тип ремонта и укажите площадь для расчета стоимости
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;