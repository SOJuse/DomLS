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
  material: string;
  deadline: string;
  stage: string;
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
  const [material, setMaterial] = useState('стандарт');
  const [deadline, setDeadline] = useState('обычный');
  const [stage, setStage] = useState('все');
  // Цены из прайс-листа «Комплексные работы»
  const basePrices = {
    'черновой': 4500,      // оценка (черновой < косметического)
    'косметический': 6000, // от 6000 ₽/м²
    'капитальный': 15000,  // от 15 000 ₽/м²
    'дизайнерский': 25000  // от 25 000 ₽/м²
  };

  // Доп. услуги: демонтаж от 3000 ₽/м² из прайса
  const extraPrices = {
    design: 1000,
    plumbing: 1500,
    appliances: 1200,
    demolition: 3000       // от 3000 ₽/м² — демонтаж с вывозом мусора
  };

  const materialPrices = {
    'стандарт': 0,
    'премиум': 2000,
    'эконом': -1000
  };

  const deadlinePrices = {
    'обычный': 0,
    'ускоренный': 1500
  };

  const stagePrices = {
    'все': 0,
    'черновой': -2000,
    'чистовой': -1000
  };

  const calculatePrice = () => {
    if (!repairType || !area) return;
    const basePrice = basePrices[repairType as keyof typeof basePrices];
    const extrasSum = Object.entries(extras).reduce((sum, [key, value]) => {
      return sum + (value ? extraPrices[key as keyof typeof extraPrices] : 0);
    }, 0);
    const materialPrice = materialPrices[material as keyof typeof materialPrices];
    const deadlinePrice = deadlinePrices[deadline as keyof typeof deadlinePrices];
    const stagePrice = stagePrices[stage as keyof typeof stagePrices];
    const totalPrice = Math.round((basePrice + extrasSum + materialPrice + deadlinePrice + stagePrice) * parseInt(area));
    setResult(totalPrice);
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

    const areaNum = parseFloat(area);
    const priceNum = typeof result === 'number' ? result : parseFloat(String(result));
    if (isNaN(areaNum) || areaNum <= 0) {
      alert('Пожалуйста, укажите корректную площадь квартиры.');
      setIsSubmitting(false);
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Ошибка расчёта стоимости.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    
    try {
      let requestData: any = {
        repair_type: repairType as 'черновой' | 'косметический' | 'капитальный' | 'дизайнерский',
        area: areaNum,
        extras: {
          design: !!extras.design,
          plumbing: !!extras.plumbing,
          appliances: !!extras.appliances,
          demolition: !!extras.demolition
        },
        calculated_price: priceNum,
        customer_name: contactData.customer_name?.trim() || undefined,
        customer_phone: contactData.customer_phone?.trim() || undefined,
        customer_email: contactData.customer_email?.trim() || undefined,
        material: material?.trim() || undefined,
        deadline: deadline?.trim() || undefined,
        stage: stage?.trim() || undefined
      };
      Object.keys(requestData).forEach(key => {
        if (
          requestData[key] === undefined ||
          (typeof requestData[key] === 'string' && requestData[key].trim() === '')
        ) {
          delete requestData[key];
        }
      });

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
        alert(
          `Ошибка: ${errorData.message || 'Не удалось отправить заявку'}\n` +
          (errorData.errors ? errorData.errors.join('\n') : '')
        );
        console.error('Ошибка отправки заявки:', errorData);
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
                    <span className="text-[#1e3a8a] font-medium">+3000₽/м²</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Материалы
                </label>
                <select
                  value={material}
                  onChange={e => setMaterial(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                >
                  <option value="стандарт">Стандарт</option>
                  <option value="премиум">Премиум (+2000₽/м²)</option>
                  <option value="эконом">Эконом (-1000₽/м²)</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Сроки
                </label>
                <select
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                >
                  <option value="обычный">Обычные</option>
                  <option value="ускоренный">Ускоренные (+1500₽/м²)</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Этапы работ
                </label>
                <select
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                >
                  <option value="все">Все этапы</option>
                  <option value="черновой">Только черновой (-2000₽/м²)</option>
                  <option value="чистовой">Только чистовой (-1000₽/м²)</option>
                </select>
              </div>
            </div>

            <div className="space-y-8 flex flex-col justify-center">
              <button
                onClick={calculatePrice}
                type="button"
                className="relative w-full bg-[#1e3a8a] text-white px-10 py-5 text-lg rounded-2xl font-bold hover:bg-blue-800 transition-all duration-300 flex items-center justify-center space-x-2 group shadow-2xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                <span>Рассчитать стоимость</span>
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                  Мгновенный расчет
                </span>
              </button>
              {result !== null && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1e3a8a]">от {result.toLocaleString('ru-RU')} ₽</div>
                  <div className="text-gray-600 mb-4">Примерная стоимость</div>
                  {!showContactForm && !isSubmitted && (
                    <button
                      className="mt-4 bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-300"
                      onClick={() => setShowContactForm(true)}
                    >
                      Оставить заявку
                    </button>
                  )}
                  {showContactForm && !isSubmitted && (
                    <form className="space-y-4 mt-6 max-w-md mx-auto text-left" onSubmit={e => { e.preventDefault(); submitRequest(); }}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя *</label>
                        <input
                          type="text"
                          value={contactData.customer_name}
                          onChange={e => handleContactChange('customer_name', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                          placeholder="Введите ваше имя"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                        <input
                          type="tel"
                          value={contactData.customer_phone}
                          onChange={e => handleContactChange('customer_phone', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                          placeholder="+7 (___) ___-__-__"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email (необязательно)</label>
                        <input
                          type="email"
                          value={contactData.customer_email}
                          onChange={e => handleContactChange('customer_email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowContactForm(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                        >
                          Отмена
                        </button>
                      </div>
                    </form>
                  )}
                  {isSubmitted && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mt-6">
                      Спасибо! Мы свяжемся с вами в ближайшее время.<br />
                      <button
                        className="mt-4 bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300"
                        onClick={resetForm}
                      >
                        Рассчитать ещё раз
                      </button>
                    </div>
                  )}
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