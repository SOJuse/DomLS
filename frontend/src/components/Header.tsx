import React from 'react';
import { Phone, Mail } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img 
              src="/ЛОГО.png" 
              alt="Дом ЛС" 
              className="h-10 w-auto"
              loading="eager"
            />
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">О нас</a>
            <a href="#portfolio" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">Портфолио</a>
            <a href="#calculator" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">Калькулятор</a>
            <a href="#contact" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">Контакты</a>
          </nav>

          <div className="flex items-center space-x-4">
            <a href="tel:+79001234567" className="flex items-center space-x-2 text-[#1e3a8a] hover:text-blue-800 transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+7 (900) 123-45-67</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;