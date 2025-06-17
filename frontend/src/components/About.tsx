import React from 'react';
import { Shield, Users, Award, Clock } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Гарантия качества',
      description: 'Предоставляем гарантию на все виды работ до 3 лет'
    },
    {
      icon: Users,
      title: 'Опытная команда',
      description: 'Мастера с опытом работы более 8 лет'
    },
    {
      icon: Award,
      title: 'Премиальные материалы',
      description: 'Работаем только с проверенными брендами'
    },
    {
      icon: Clock,
      title: 'Соблюдение сроков',
      description: 'Завершаем проекты точно в установленные сроки'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">О компании Дом ЛС</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы создаем уникальные интерьеры, которые отражают индивидуальность наших клиентов. 
            Каждый проект — это история успеха, воплощенная в камне, дереве и металле.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="bg-[#1e3a8a]/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#1e3a8a] transition-colors duration-300">
                <feature.icon className="h-8 w-8 text-[#1e3a8a] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Почему выбирают нас?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#1e3a8a] rounded-full mt-2"></div>
                  <p className="text-gray-700">Индивидуальный подход к каждому проекту</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#1e3a8a] rounded-full mt-2"></div>
                  <p className="text-gray-700">Прозрачное ценообразование без скрытых платежей</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#1e3a8a] rounded-full mt-2"></div>
                  <p className="text-gray-700">Собственная служба контроля качества</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#1e3a8a] rounded-full mt-2"></div>
                  <p className="text-gray-700">Постгарантийное обслуживание</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#1e3a8a] mb-2">200+</div>
                <div className="text-gray-600 mb-6">довольных клиентов</div>
                <div className="text-lg text-gray-700">
                  "Превосходное качество работ и внимание к деталям. Рекомендую!"
                </div>
                <div className="mt-4 text-sm text-gray-500">— Анна Петрова, клиент</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;