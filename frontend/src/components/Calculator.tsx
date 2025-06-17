import React, { useState } from 'react';
import { Calculator as CalcIcon, CheckCircle } from 'lucide-react';

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
                className="w-full bg-[#1e3a8a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <CalcIcon className="h-5 w-5" />
                <span>Рассчитать стоимость</span>
              </button>
            </div>

            <div className="flex items-center justify-center">
              {result ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center w-full">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Примерная стоимость</h3>
                  <div className="text-4xl font-bold text-[#1e3a8a] mb-4">
                    {result.toLocaleString()}₽
                  </div>
                  <p className="text-gray-600 mb-6">
                    Окончательная стоимость определяется после осмотра объекта
                  </p>
                  <button className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300">
                    Заказать консультацию
                  </button>
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