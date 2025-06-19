import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Portfolio: React.FC = () => {
  const projects = [
    {
      id: 1,
      title: 'Современная квартира',
      type: 'Дизайнерский ремонт',
      area: '85 м²',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Минималистичный дизайн с элементами лофта'
    },
    {
      id: 2,
      title: 'Семейная квартира',
      type: 'Капитальный ремонт',
      area: '120 м²',
      image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Уютное пространство для большой семьи'
    },
    {
      id: 3,
      title: 'Студия в центре',
      type: 'Косметический ремонт',
      area: '45 м²',
      image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Максимальное использование пространства'
    },
    {
      id: 4,
      title: 'Элитная квартира',
      type: 'Дизайнерский ремонт',
      area: '200 м²',
      image: 'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Роскошный интерьер с авторской мебелью'
    },
    {
      id: 5,
      title: 'Молодежная квартира',
      type: 'Капитальный ремонт',
      area: '65 м²',
      image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Яркие акценты и современные решения'
    },
    {
      id: 6,
      title: 'Классическая квартира',
      type: 'Дизайнерский ремонт',
      area: '150 м²',
      image: 'https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Элегантность в каждой детали'
    }
  ];

  const [sliderValue, setSliderValue] = useState(50);

  return (
    <section id="portfolio" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Наши работы</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Каждый проект уникален и создан с учетом пожеланий клиента. 
            Посмотрите на результаты нашей работы.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="relative overflow-hidden">
                {idx === 0 ? (
                  <div className="relative w-full h-64">
                    <img
                      src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="До ремонта"
                      className="w-full h-64 object-cover absolute top-0 left-0"
                      style={{ zIndex: 1 }}
                    />
                    <img
                      src="https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="После ремонта"
                      className="w-full h-64 object-cover absolute top-0 left-0"
                      style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)`, zIndex: 2, transition: 'clip-path 0.3s' }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValue}
                      onChange={e => setSliderValue(Number(e.target.value))}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 z-10"
                      style={{ zIndex: 3 }}
                    />
                    <div className="absolute top-2 left-2 bg-[#1e3a8a] text-white px-3 py-1 rounded-full text-sm font-medium z-20">До</div>
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium z-20">После</div>
                  </div>
                ) : (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                )}
                <div className="absolute top-4 left-4 bg-[#1e3a8a] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {project.area}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  <ArrowRight className="h-5 w-5 text-[#1e3a8a] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[#1e3a8a] font-medium mb-2">{project.type}</p>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-[#1e3a8a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300">
            Посмотреть все проекты
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;