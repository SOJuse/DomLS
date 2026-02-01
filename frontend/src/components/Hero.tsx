import React from 'react';
import { ArrowRight, Star, CheckCircle, Award } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-16 bg-gradient-to-br from-blue-50 via-white to-gray-50 min-h-screen flex items-center relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-20 right-10 opacity-10">
        <img 
          src="/Vector 1 (2).png" 
          alt="" 
          className="h-32 w-auto transform rotate-12"
          loading="lazy"
        />
      </div>
      <div className="absolute bottom-20 left-10 opacity-5">
        <img 
          src="/Vector 1 (2).png" 
          alt="" 
          className="h-24 w-auto transform -rotate-12"
          loading="lazy"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600 font-medium">4.9 из 5 на основе 127 отзывов</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Премиальный
              <span className="block text-[#1e3a8a] relative">
                ремонт под ключ
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] to-blue-400 rounded-full"></div>
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Создаем пространства мечты с безупречным качеством и вниманием к каждой детали. 
              Индивидуальный подход к каждому проекту.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('contact')}
                className="relative bg-[#1e3a8a] text-white px-8 py-4 text-base rounded-2xl font-semibold hover:bg-blue-800 transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                <span className="inline-block">Получить консультацию</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                  Бесплатно
                </span>
              </button>
              <button 
                onClick={() => scrollToSection('portfolio')}
                className="border-2 border-[#1e3a8a] text-[#1e3a8a] px-8 py-4 rounded-xl font-semibold hover:bg-[#1e3a8a] hover:text-white transition-all duration-300"
              >
                Посмотреть портфолио
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1e3a8a]">8+</div>
                <div className="text-gray-600">лет опыта</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1e3a8a]">200+</div>
                <div className="text-gray-600">проектов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1e3a8a]">100%</div>
                <div className="text-gray-600">гарантия</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            {/* Главная карточка */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl relative z-10">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1e3a8a] rounded-2xl mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Премиальное качество</h3>
                <p className="text-gray-600">Используем только лучшие материалы и технологии</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Гарантия до 3 лет</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Соблюдение сроков</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Фиксированная цена</span>
                </div>
              </div>
            </div>

            {/* Плавающая карточка с ценой */}
            <div className="absolute -top-6 -right-6 bg-[#1e3a8a] rounded-2xl p-6 text-white shadow-xl z-20">
              <div className="text-2xl font-bold">от 6000₽</div>
              <div className="text-blue-200">за м²</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;