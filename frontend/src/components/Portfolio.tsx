import React, { useState, useEffect } from 'react';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjectImageUrls, projectTitles, projectIds } from '../projectsData';

const Portfolio: React.FC = () => {
  const [modalProject, setModalProject] = useState<string | null>(null);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!modalProject) return;
      const imgs = getProjectImageUrls(modalProject);
      if (e.key === 'Escape') setModalProject(null);
      if (e.key === 'ArrowLeft') setModalIndex(i => (i > 0 ? i - 1 : imgs.length - 1));
      if (e.key === 'ArrowRight') setModalIndex(i => (i < imgs.length - 1 ? i + 1 : 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modalProject]);

  useEffect(() => {
    if (modalProject) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [modalProject]);

  return (
    <section id="portfolio" className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Наши работы</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Реальные проекты Дом ЛС. Каждый — с учётом пожеланий клиента.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projectIds.map((id, idx) => {
            const imgs = getProjectImageUrls(id);
            const meta = projectTitles[id] || { title: `Проект ${id}`, type: 'Ремонт', description: '' };
            const thumb = imgs[0];
            if (!thumb) return null;
            return (
              <motion.div
                key={id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer min-h-0"
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.01, margin: '0px 0px 120px 0px' }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.3) }}
                onClick={() => { setModalProject(id); setModalIndex(0); }}
              >
                <div className="relative overflow-hidden aspect-[4/3] min-h-[200px]">
                  <img
                    src={thumb}
                    alt={meta.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">{imgs.length} фото</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <div className="absolute top-4 left-4 bg-[#1e3a8a] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {meta.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#1e3a8a] transition-colors">{meta.title}</h3>
                  <p className="text-gray-600 mt-1">{meta.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {modalProject && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalProject(null)}
            >
              <button
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                onClick={() => setModalProject(null)}
              >
                <X className="h-6 w-6" />
              </button>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-center z-10">
                <h3 className="text-lg font-semibold">{projectTitles[modalProject]?.title || `Проект ${modalProject}`}</h3>
                <p className="text-sm text-gray-300">{modalIndex + 1} / {getProjectImageUrls(modalProject).length}</p>
              </div>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30"
                onClick={e => { e.stopPropagation(); setModalIndex(i => Math.max(0, i - 1)); }}
                disabled={modalIndex === 0}
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <motion.img
                key={modalIndex}
                src={getProjectImageUrls(modalProject)[modalIndex]}
                alt=""
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={e => e.stopPropagation()}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30"
                onClick={e => { e.stopPropagation(); const imgs = getProjectImageUrls(modalProject); setModalIndex(i => Math.min(imgs.length - 1, i + 1)); }}
                disabled={modalIndex === getProjectImageUrls(modalProject).length - 1}
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Portfolio;
