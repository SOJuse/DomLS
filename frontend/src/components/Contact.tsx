import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Form submitted:', formData);
    alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
    setFormData({ name: '', phone: '', comment: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Свяжитесь с нами</h2>
          <p className="text-xl text-gray-600">
            Готовы обсудить ваш проект? Оставьте заявку и получите бесплатную консультацию
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Оставить заявку</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="Введите ваше имя"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Комментарий
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent resize-none"
                  placeholder="Расскажите о вашем проекте..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#1e3a8a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Отправить заявку</span>
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Контактная информация</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-[#1e3a8a] mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Телефон</div>
                    <div className="text-gray-600">+7 (900) 123-45-67</div>
                    <div className="text-gray-600">+7 (900) 123-45-68</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-[#1e3a8a] mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">info@dom-ls.ru</div>
                    <div className="text-gray-600">zakaz@dom-ls.ru</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-[#1e3a8a] mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Адрес</div>
                    <div className="text-gray-600">г. Москва, ул. Строительная, д. 15</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-[#1e3a8a] mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Режим работы</div>
                    <div className="text-gray-600">Пн-Пт: 9:00 - 18:00</div>
                    <div className="text-gray-600">Сб-Вс: 10:00 - 16:00</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1e3a8a] rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Бесплатная консультация</h3>
              <p className="mb-6">
                Получите профессиональную консультацию по вашему проекту. 
                Выезд замерщика бесплатно!
              </p>
              <button className="bg-white text-[#1e3a8a] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                Получить консультацию
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;