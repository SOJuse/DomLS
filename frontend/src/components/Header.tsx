import React, { useEffect, useState } from 'react';
import { Phone, Mail } from 'lucide-react';

// Хук для определения активной секции
function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState<string>('');
  useEffect(() => {
    const handleScroll = () => {
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            current = id;
            break;
          }
        }
      }
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);
  return active;
}

const Header: React.FC = () => {
  const sectionIds = ['about', 'portfolio', 'prices', 'calculator', 'contact'];
  const active = useActiveSection(sectionIds);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img 
              src="/ЛОГО.png" 
              alt="Дом ЛС" 
              className="h-14 w-auto cursor-pointer transition-transform hover:scale-105"
              loading="eager"
              onClick={scrollToTop}
            />
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className={"transition-colors px-2 py-1 rounded " + (active === 'about' ? 'bg-[#1e3a8a] text-white shadow' : 'text-gray-700 hover:text-[#1e3a8a]')}>О нас</a>
            <a href="#portfolio" className={"transition-colors px-2 py-1 rounded " + (active === 'portfolio' ? 'bg-[#1e3a8a] text-white shadow' : 'text-gray-700 hover:text-[#1e3a8a]')}>Портфолио</a>
            <a href="#prices" className={"transition-colors px-2 py-1 rounded " + (active === 'prices' ? 'bg-[#1e3a8a] text-white shadow' : 'text-gray-700 hover:text-[#1e3a8a]')}>Прайсы</a>
            <a href="#calculator" className={"transition-colors px-2 py-1 rounded " + (active === 'calculator' ? 'bg-[#1e3a8a] text-white shadow' : 'text-gray-700 hover:text-[#1e3a8a]')}>Калькулятор</a>
            <a href="#contact" className={"transition-colors px-2 py-1 rounded " + (active === 'contact' ? 'bg-[#1e3a8a] text-white shadow' : 'text-gray-700 hover:text-[#1e3a8a]')}>Контакты</a>
          </nav>

          <div className="flex items-center space-x-4">
            <a href="tel:+79261856508" className="flex items-center space-x-2 text-[#1e3a8a] hover:text-blue-800 transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+7 926 185 65 08</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;