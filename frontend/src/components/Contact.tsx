import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Clock, X } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Состояние для модального окна консультации
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultationData, setConsultationData] = useState({
    name: '',
    phone: '',
    project_type: '',
    area: '',
    address: ''
  });
  const [isConsultationSubmitting, setIsConsultationSubmitting] = useState(false);
  const [consultationStatus, setConsultationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        console.error('Error submitting form:', errorData);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultationSubmitting(true);
    setConsultationStatus('idle');

    try {
      const response = await fetch('/api/contact/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: consultationData.name,
          phone: consultationData.phone,
          message: `Заявка на бесплатную консультацию:
Тип проекта: ${consultationData.project_type || 'Не указан'}
Площадь: ${consultationData.area ? `${consultationData.area} м²` : 'Не указана'}
Адрес: ${consultationData.address || 'Не указан'}`
        }),
      });

      if (response.ok) {
        setConsultationStatus('success');
        setConsultationData({ name: '', phone: '', project_type: '', area: '', address: '' });
        setTimeout(() => {
          setShowConsultationModal(false);
          setConsultationStatus('idle');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Error submitting consultation:', errorData);
        setConsultationStatus('error');
      }
    } catch (error) {
      console.error('Error submitting consultation:', error);
      setConsultationStatus('error');
    } finally {
      setIsConsultationSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleConsultationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setConsultationData(prev => ({
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
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Комментарий
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent resize-none"
                  placeholder="Расскажите о вашем проекте..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  Спасибо! Мы свяжемся с вами в ближайшее время.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  Произошла ошибка при отправке заявки. Попробуйте позже.
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1e3a8a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
                <span>{isSubmitting ? 'Отправка...' : 'Отправить заявку'}</span>
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
                    <div className="text-gray-600">+7 926 185 65 08</div>
                    <div className="text-gray-600">+7 926 826-12-65</div>
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
              <button 
                onClick={() => setShowConsultationModal(true)}
                className="bg-white text-[#1e3a8a] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Получить консультацию
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для консультации */}
      {showConsultationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Бесплатная консультация</h3>
              <button 
                onClick={() => setShowConsultationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleConsultationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  name="name"
                  value={consultationData.name}
                  onChange={handleConsultationChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
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
                  value={consultationData.phone}
                  onChange={handleConsultationChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип проекта
                </label>
                <select
                  name="project_type"
                  value={consultationData.project_type}
                  onChange={handleConsultationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                >
                  <option value="">Выберите тип проекта</option>
                  <option value="Квартира">Квартира</option>
                  <option value="Дом">Дом</option>
                  <option value="Офис">Офис</option>
                  <option value="Коммерческое помещение">Коммерческое помещение</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Площадь (м²)
                </label>
                <input
                  type="number"
                  name="area"
                  value={consultationData.area}
                  onChange={handleConsultationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="Укажите площадь"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес объекта
                </label>
                <input
                  type="text"
                  name="address"
                  value={consultationData.address}
                  onChange={handleConsultationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="Укажите адрес"
                />
              </div>

              {consultationStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  Спасибо! Мы свяжемся с вами для согласования времени выезда замерщика.
                </div>
              )}

              {consultationStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  Произошла ошибка при отправке заявки. Попробуйте позже.
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isConsultationSubmitting || !consultationData.name || !consultationData.phone}
                  className="flex-1 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConsultationSubmitting ? 'Отправка...' : 'Заказать консультацию'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConsultationModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;