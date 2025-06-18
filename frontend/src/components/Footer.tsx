import React from 'react';
import { Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/Vector 1 (2).png" 
                alt="Дом ЛС" 
                className="h-8 w-auto filter brightness-0 invert"
                loading="lazy"
              />
              <span className="text-xl font-bold">Дом ЛС</span>
            </div>
            <p className="text-gray-400">
              Премиальный ремонт квартир под ключ. Создаем пространства мечты с безупречным качеством.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Черновой ремонт</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Косметический ремонт</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Капитальный ремонт</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Дизайнерский ремонт</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Дизайн-проект</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Компания</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#about" className="hover:text-white transition-colors">О нас</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">Портфолио</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Отзывы</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Гарантии</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Контакты</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+7 926 185 65 08</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@dom-ls.ru</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Дом ЛС. Все права защищены.
            </div>
            <div className="text-gray-400 text-sm space-x-4">
              <span>ИНН: 7701234567</span>
              <span>ОГРН: 1127746123456</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;