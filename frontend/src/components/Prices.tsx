import React, { useState } from 'react';
import { ChevronDown, ExternalLink, Wrench, Paintbrush, LayoutGrid, Zap, Droplets, Layers, Ruler } from 'lucide-react';

interface PriceRow {
  work: string;
  unit: string;
  price: string;
}

interface PriceCategory {
  id: string;
  file: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  rows: PriceRow[];
}

const priceData: PriceCategory[] = [
  {
    id: 'complex',
    file: 'Комплексные работы.pdf',
    title: 'Комплексные работы',
    icon: Wrench,
    rows: [
      { work: 'Косметический ремонт', unit: 'кв/м по полу', price: 'от 6 000' },
      { work: 'Ремонт санузлов под ключ', unit: 'шт.', price: 'от 100 000' },
      { work: 'Ремонт комнат', unit: 'шт.', price: 'от 50 000' },
      { work: 'Ремонт кухни', unit: 'шт.', price: 'от 70 000' },
      { work: 'Демонтажные работы с выводом мусора', unit: 'кв/м по полу', price: 'от 3 000' },
      { work: 'Капитальный ремонт', unit: 'кв/м по полу', price: 'от 15 000' },
      { work: 'Дизайнерский ремонт', unit: 'кв/м по полу', price: 'от 25 000' },
    ],
  },
  {
    id: 'painting',
    file: 'Малярные работы.pdf',
    title: 'Малярные работы',
    icon: Paintbrush,
    rows: [
      { work: 'Штукатурка поверхности стен до 3 см под маяк', unit: 'м²', price: '980' },
      { work: 'Грунтовка', unit: 'м²', price: '60' },
      { work: 'Грунтовка бетоноконтактом', unit: 'м²', price: '90' },
      { work: 'Базовая шпаклевка в 1 слой', unit: 'м²', price: '350' },
      { work: 'Финишная шпаклевка под покраску в 2 слоя', unit: 'м²', price: '800' },
      { work: 'Оклеивание стеклохолстом', unit: 'м²', price: '250' },
      { work: 'Ошкуривание стен', unit: 'м²', price: '110' },
      { work: 'Покраска стен в 2 слоя', unit: 'м²', price: '600' },
      { work: 'Оклейка стен обоями', unit: 'м²', price: 'от 400' },
    ],
  },
  {
    id: 'slopes',
    file: 'Откос.pdf',
    title: 'Откосы',
    icon: Ruler,
    rows: [
      { work: 'Штукатурка откосов, углов до 40 см', unit: 'м/п', price: '800' },
      { work: 'Шпаклевка откосов, углов до 40 см', unit: 'м/п', price: '350' },
      { work: 'Финишная шпаклевка откосов под покраску', unit: 'м/п', price: '450' },
      { work: 'Установка штукатурных углов (перфорированных)', unit: 'м/п', price: '150' },
      { work: 'Оклейка стеклохолстом, малярной сеткой', unit: 'м/п', price: '150' },
      { work: 'Окраска в 2 слоя', unit: 'м/п', price: '450' },
    ],
  },
  {
    id: 'tiling',
    file: 'Плиточные работы.pdf',
    title: 'Плиточные работы',
    icon: LayoutGrid,
    rows: [
      { work: 'Облицовка плиткой от 200-600 мм (пол)', unit: 'м²', price: '2 500' },
      { work: 'Облицовка плиткой от 600-1200 мм (пол)', unit: 'м²', price: '3 500' },
      { work: 'Облицовка плиткой от 200-600 мм (стены)', unit: 'м²', price: '2 800' },
      { work: 'Облицовка плиткой от 600-1200 мм (стены)', unit: 'м²', price: '3 800' },
      { work: 'Подрезка прямая', unit: 'м/п', price: '600' },
      { work: 'Подрезка 45 градусов', unit: 'м/п', price: '2 500' },
      { work: 'Высверливание коронкой до 50 мм', unit: 'шт.', price: '500' },
      { work: 'Высверливание коронкой 50-120 мм', unit: 'шт.', price: '1 000' },
      { work: 'Затирка швов (цементная)', unit: 'м/п', price: '300' },
      { work: 'Затирка швов (эпоксидная)', unit: 'м/п', price: 'от 800' },
    ],
  },
  {
    id: 'plumbing',
    file: 'сантехника.pdf',
    title: 'Сантехника',
    icon: Droplets,
    rows: [
      { work: 'Штробление бетонных стен до 7 см', unit: 'м/п', price: '1 500' },
      { work: 'Штробление пеноблочных стен до 7 см', unit: 'м/п', price: '1 000' },
      { work: 'Заделка сантехнических штроб', unit: 'м/п', price: '100' },
      { work: 'Устройство подиума душевой кабины до 1000×1000', unit: 'шт.', price: '10 546' },
      { work: 'Монтаж стеклянных шторок для душа', unit: 'шт.', price: '5 000' },
      { work: 'Установка сливного трапа', unit: 'шт.', price: '2 000' },
      { work: 'Установка раковины', unit: 'шт.', price: '1 500' },
      { work: 'Установка сифона', unit: 'шт.', price: '600' },
      { work: 'Установка смесителей / гигиенического душа', unit: 'шт.', price: '1 000' },
      { work: 'Установка тропического душа', unit: 'шт.', price: '5 000' },
      { work: 'Установка инсталляции', unit: 'шт.', price: '5 000' },
      { work: 'Установка чаши инсталляции и кнопки', unit: 'шт.', price: '3 000' },
      { work: 'Установка сантехнического шкафа (ГКЛ, пеноблок)', unit: 'м/п', price: '2 175' },
      { work: 'Установка коллектора', unit: 'шт.', price: '2 000' },
      { work: 'Установка регулятора давления', unit: 'шт.', price: '800' },
      { work: 'Разводка труб канализации', unit: 'точка', price: '1 846' },
      { work: 'Разводка труб водоснабжения Рехау (1 точка) до 10 м', unit: 'точка', price: '2 000' },
      { work: 'Установка водорозетки Рехау', unit: 'точка', price: '1 000' },
      { work: 'Установка точки канализации', unit: 'точка', price: '500' },
    ],
  },
  {
    id: 'ceilings',
    file: 'Устройство потолков.pdf',
    title: 'Устройство потолков',
    icon: Ruler,
    rows: [
      { work: 'Натяжной потолок', unit: 'м²', price: 'от 600' },
      { work: 'Штукатурный потолок под покраску', unit: 'м²', price: '1 100' },
      { work: 'Штукатурка потолка до 3 см', unit: 'м²', price: '450' },
      { work: 'Базовая шпаклевка потолка в 1 слой', unit: 'м²', price: '350' },
      { work: 'Оклейка стеклохолстом', unit: 'м²', price: '250' },
      { work: 'Финишная шпаклевка в 2 слоя под покраску', unit: 'м²', price: '700' },
      { work: 'Грунтовка', unit: 'м²', price: '90' },
      { work: 'Ошкуривание потолков', unit: 'м²', price: '250' },
      { work: 'Окраска в 2 слоя', unit: 'м²', price: '800' },
      { work: 'Монтаж потолочного плинтуса до 7 см', unit: 'м/п', price: '400' },
      { work: 'Шпаклевка плинтуса', unit: 'м/п', price: '200' },
      { work: 'Окраска плинтуса в 2 слоя', unit: 'м/п', price: '450' },
    ],
  },
  {
    id: 'floor',
    file: 'Устройство чистового  пола.pdf',
    title: 'Устройство чистового пола',
    icon: Layers,
    rows: [
      { work: 'Укладка линолеума', unit: 'м²', price: '600' },
      { work: 'Укладка ламината/кварцвинила палубой', unit: 'м²', price: '1 000' },
      { work: 'Укладка ламината по диагонали', unit: 'м²', price: '1 200' },
      { work: 'Укладка ламината елочкой', unit: 'м²', price: '1 500' },
      { work: 'Инженерная доска', unit: 'м²', price: 'от 2 800' },
      { work: 'Паркет штучный', unit: 'м²', price: 'от 3 500' },
      { work: 'Плинтус пластиковый напольный', unit: 'м/п', price: '200' },
      { work: 'Плинтус МДФ до 7 см', unit: 'м/п', price: '800' },
      { work: 'Плинтус полиуретановый', unit: 'м/п', price: '700' },
    ],
  },
  {
    id: 'rough',
    file: 'Черновые работы.pdf',
    title: 'Черновые работы',
    icon: Layers,
    rows: [
      { work: 'Возведение стен', unit: '—', price: '' },
      { work: 'Кладка из кирпича', unit: 'м²', price: '1 300' },
      { work: 'Кладка из ПГП 80-100 мм', unit: 'м²', price: '1 050' },
      { work: 'Кладка из газобетона до 100 мм', unit: 'м²', price: '900' },
      { work: 'Кладка из газобетона 150-200 мм', unit: 'м²', price: '1 500' },
      { work: 'Перегородки ГКЛ в один слой', unit: 'м²', price: '1 200' },
      { work: 'Перегородки ГКЛ в два слоя', unit: 'м²', price: '1 600' },
      { work: 'Устройство стяжки пола', unit: '—', price: '' },
      { work: 'Монтаж демпферной ленты', unit: 'м²', price: '100' },
      { work: 'Укладка сетки для стяжки', unit: 'м²', price: '150' },
      { work: 'Обмазочная гидроизоляция в 2 слоя', unit: 'м²', price: '350' },
      { work: 'Гидроизоляция рулонными материалами', unit: 'м²', price: '500' },
      { work: 'Грунтовка', unit: 'м²', price: '60' },
      { work: 'Механизированная стяжка до 6 см', unit: 'м²', price: '1 400' },
      { work: 'Мокрая стяжка под маяк до 6 см', unit: 'м²', price: '1 100' },
      { work: 'Наливной пол до 30 мм', unit: 'м²', price: '600' },
    ],
  },
  {
    id: 'electrical',
    file: 'электрика.pdf',
    title: 'Электрика',
    icon: Zap,
    rows: [
      { work: 'Штробление бетонных стен под кабель до 80 мм', unit: 'м/п', price: '500' },
      { work: 'Штробление кирпичных/пеноблочных стен', unit: 'м/п', price: '350' },
      { work: 'Заделка штроб', unit: 'шт.', price: '50' },
      { work: 'Чаша под подрозетник в бетоне', unit: 'шт.', price: '700' },
      { work: 'Чаша под подрозетник в гипсолите/пеноблоке', unit: 'шт.', price: '400' },
      { work: 'Установка подрозетника', unit: 'шт.', price: '100' },
      { work: 'Установка механизма электроточки', unit: 'шт.', price: '350' },
      { work: 'Установка проходного выключателя', unit: 'шт.', price: '500' },
      { work: 'Установка трекового освещения', unit: 'м/п', price: '700' },
      { work: 'Установка точечных светильников', unit: 'шт.', price: '650' },
      { work: 'Прокладка кабеля в гофре', unit: 'м/п', price: '110' },
      { work: 'Прокладка слаботочных кабелей (TV, LAN)', unit: 'м/п', price: '80' },
      { work: 'Установка автоматического выключателя', unit: 'шт.', price: '600' },
      { work: 'Установка дифф. автомата / УЗО', unit: 'шт.', price: '1 000' },
      { work: 'Подключение к вводному щиту', unit: 'шт.', price: '3 032' },
      { work: 'Штробление ниши под щит до 24 модулей', unit: 'шт.', price: 'от 4 021' },
      { work: 'Монтаж щита в подготовленную нишу', unit: 'шт.', price: '2 570' },
      { work: 'Установка вытяжного вентилятора', unit: 'шт.', price: '1 000' },
      { work: 'Прокладка кабеля по потолку в гофре', unit: 'м/п', price: '200' },
      { work: 'Прокладка кабеля по полу в гофре', unit: 'м/п', price: '150' },
    ],
  },
];

const Prices: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>('complex');
  const pdfUrl = (filename: string) => `/price/${encodeURIComponent(filename)}`;

  return (
    <section id="prices" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Прайс-листы</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Актуальные цены на все виды работ
          </p>
        </div>

        <div className="space-y-4">
          {priceData.map((cat) => {
            const Icon = cat.icon;
            const isExpanded = expanded === cat.id;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : cat.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1e3a8a]/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-[#1e3a8a]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{cat.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={pdfUrl(cat.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg hover:bg-[#1e3a8a]/10 text-[#1e3a8a] transition-colors"
                      title="Скачать PDF"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t border-gray-100 overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#1e3a8a]/5">
                          <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Вид работы</th>
                          <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Ед. изм.</th>
                          <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">Цена, ₽</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.rows.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                            <td className={`px-5 py-3 text-gray-800 ${row.unit === '—' ? 'font-semibold text-gray-900' : ''}`} colSpan={row.unit === '—' ? 3 : 1}>
                              {row.work}
                            </td>
                            {row.unit !== '—' && (
                              <>
                                <td className="px-5 py-3 text-gray-500 text-sm whitespace-nowrap">{row.unit}</td>
                                <td className="px-5 py-3 text-right font-medium text-[#1e3a8a] whitespace-nowrap">{row.price}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Для расчёта стоимости ремонта воспользуйтесь{' '}
            <a href="#calculator" className="text-[#1e3a8a] font-medium hover:underline">
              калькулятором
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Prices;
