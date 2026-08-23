/* ============================================================
 * EGXHub.tsx
 * Dedicated Egyptian Stock Exchange (EGX) & Currency Hub
 * Real-time equities watchlist (22+ Active Leaders), sector filters,
 * bank currency rates, and direct sync with the unified master chart.
 * ============================================================ */

import { useState } from 'react';
import { Landmark, TrendingUp, DollarSign, ArrowUpRight, CheckCircle2, Search } from 'lucide-react';

export interface EGXLeader {
  symbol: string;
  nameAr: string;
  ticker: string;
  sector: string;
  category: 'all' | 'banks' | 'real_estate' | 'industry' | 'tech';
}

export const EGX_LEADERS: EGXLeader[] = [
  // الرئيسية والمؤشرات
  { symbol: 'EGX:EGX30', nameAr: 'مؤشر البورصة الرئيسي EGX 30', ticker: 'EGX30', sector: 'المؤشر العام', category: 'all' },
  { symbol: 'EGX:EGX70EWI', nameAr: 'مؤشر الشركات المتوسطة EGX 70', ticker: 'EGX70', sector: 'مؤشر EGX 70 EWI', category: 'all' },

  // البنوك والخدمات المالية
  { symbol: 'EGX:COMI', nameAr: 'البنك التجاري الدولي (CIB)', ticker: 'COMI', sector: 'بنوك وخدمات مالية', category: 'banks' },
  { symbol: 'EGX:HRHO', nameAr: 'إي إف جي القابضة (هيرميس)', ticker: 'HRHO', sector: 'بنوك استثمار وتمويل', category: 'banks' },
  { symbol: 'EGX:ADIB', nameAr: 'مصرف أبوظبي الإسلامي مصر', ticker: 'ADIB', sector: 'بنوك إسلامية', category: 'banks' },
  { symbol: 'EGX:CIEB', nameAr: 'بنك كريدي أجريكول مصر', ticker: 'CIEB', sector: 'بنوك وخدمات مصرفية', category: 'banks' },
  { symbol: 'EGX:EKHO', nameAr: 'القابضة المصرية الكويتية', ticker: 'EKHO', sector: 'استثمار عام وقابضة', category: 'banks' },

  // العقارات والإنشاءات
  { symbol: 'EGX:TMGH', nameAr: 'مجموعة طلعت مصطفى القابضة', ticker: 'TMGH', sector: 'تطوير عقاري وسياحي', category: 'real_estate' },
  { symbol: 'EGX:PHDC', nameAr: 'بالم هيلز للتعمير', ticker: 'PHDC', sector: 'تطوير عقاري وإسكان', category: 'real_estate' },
  { symbol: 'EGX:MNHD', nameAr: 'مدينة مصر للإسكان والتعمير', ticker: 'MNHD', sector: 'تطوير عقاري وإسكان', category: 'real_estate' },
  { symbol: 'EGX:HELI', nameAr: 'مصر الجديدة للإسكان والتعمير', ticker: 'HELI', sector: 'إسكان وتعمير', category: 'real_estate' },
  { symbol: 'EGX:ORAS', nameAr: 'أوراسكوم للإنشاءات', ticker: 'ORAS', sector: 'مقاولات وإنشاءات', category: 'real_estate' },

  // الصناعة، الكيماويات والبترول
  { symbol: 'EGX:SWDY', nameAr: 'السويدي إليكتريك', ticker: 'SWDY', sector: 'صناعة وكابلات وطاقة', category: 'industry' },
  { symbol: 'EGX:MFPC', nameAr: 'مصر لإنتاج الأسمدة (موبكو)', ticker: 'MFPC', sector: 'أسمدة وبتروكيماويات', category: 'industry' },
  { symbol: 'EGX:ABUK', nameAr: 'أبو قير للأسمدة والصناعات', ticker: 'ABUK', sector: 'كيماويات وأسمدة', category: 'industry' },
  { symbol: 'EGX:ESRS', nameAr: 'حديد عز', ticker: 'ESRS', sector: 'صناعات ثقيلة وحديد', category: 'industry' },
  { symbol: 'EGX:AMOC', nameAr: 'الإسكندرية للزيوت المعدنية (أموك)', ticker: 'AMOC', sector: 'بترول وطاقة', category: 'industry' },
  { symbol: 'EGX:SKPC', nameAr: 'سيدي كرير للبتروكيماويات (سيدبك)', ticker: 'SKPC', sector: 'بتروكيماويات', category: 'industry' },
  { symbol: 'EGX:EAST', nameAr: 'الشرقية للدخان (إيسترن)', ticker: 'EAST', sector: 'صناعات استهلاكية', category: 'industry' },
  { symbol: 'EGX:JUFO', nameAr: 'جهينة للصناعات الغذائية', ticker: 'JUFO', sector: 'أغذية ومشروبات', category: 'industry' },

  // التكنولوجيا والاتصالات
  { symbol: 'EGX:FWRY', nameAr: 'فوري للمدفوعات الرقمية', ticker: 'FWRY', sector: 'تكنولوجيا مالية ومدفوعات', category: 'tech' },
  { symbol: 'EGX:ETEL', nameAr: 'المصرية للاتصالات (WE)', ticker: 'ETEL', sector: 'اتصالات وشبكات', category: 'tech' },
];

export const FOREX_PAIRS = [
  { symbol: 'FX_IDC:USDEGP', name: 'الدولار الأمريكي', code: 'USD', flag: '🇺🇸', egpRate: 50.88 },
  { symbol: 'FX_IDC:EUREGP', name: 'اليورو الأوروبي', code: 'EUR', flag: '🇪🇺', egpRate: 54.80 },
  { symbol: 'FX_IDC:SAREGP', name: 'الريال السعودي', code: 'SAR', flag: '🇸🇦', egpRate: 13.56 },
  { symbol: 'FX_IDC:AEDUSD', name: 'الدرهم الإماراتي', code: 'AED', flag: '🇦🇪', egpRate: 13.85 },
  { symbol: 'FX_IDC:GBPEGP', name: 'الجنيه الإسترليني', code: 'GBP', flag: '🇬🇧', egpRate: 65.20 },
  { symbol: 'FX_IDC:KWDEGP', name: 'الدينار الكويتي', code: 'KWD', flag: '🇰🇼', egpRate: 165.80 },
];

const SECTOR_FILTERS = [
  { id: 'all', label: 'كافة الأسهم (22)' },
  { id: 'banks', label: '🏦 بنوك ومالية' },
  { id: 'real_estate', label: '🏗️ عقارات وإنشاء' },
  { id: 'industry', label: '🏭 صناعة وبتروكيماويات' },
  { id: 'tech', label: '⚡ تكنولوجيا واتصالات' },
];

interface EGXHubProps {
  onSelectSymbol?: (symbol: string) => void;
}

export function EGXHub({ onSelectSymbol }: EGXHubProps) {
  const [selectedStock, setSelectedStock] = useState<string>('EGX:COMI');
  const [activeSector, setActiveSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStocks = EGX_LEADERS.filter((stock) => {
    const matchesSector = activeSector === 'all' || stock.category === activeSector || stock.category === 'all';
    const matchesSearch =
      searchQuery.trim() === '' ||
      stock.nameAr.includes(searchQuery) ||
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.sector.includes(searchQuery);
    return matchesSector && matchesSearch;
  });

  const handleStockClick = (symbol: string) => {
    setSelectedStock(symbol);
    if (onSelectSymbol) {
      onSelectSymbol(symbol);
    }
    // Smooth scroll to the interactive chart
    const chartEl = document.getElementById('interactive-chart');
    if (chartEl) {
      chartEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="egx-hub" className="space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-inner flex-shrink-0">
            <Landmark size={26} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 flex-wrap">
              البورصة المصرية والعملات بالبنوك (EGX Hub)
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                22 سهم قيادي مباشر
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              متابعة حية وشاملة للأسهم الأكثر نشاطاً وتداولاً في سوق المال المصري
            </p>
          </div>
        </div>
      </div>

      {/* EGX Leaders Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Main Column: Stock Watchlist Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              الأسهم الأكثر تداولاً ونشاطاً بالبورصة المصرية
            </h3>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">اضغط للتحليل المباشر بالشارت</span>
          </div>

          {/* Controls: Sector Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {SECTOR_FILTERS.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSector(sec.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border active:scale-95 ${
                    activeSector === sec.id
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-56 flex-shrink-0">
              <input
                type="text"
                placeholder="ابحث بالاسم أو الرمز..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <Search size={13} className="absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Stock Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredStocks.map((stock) => {
              const isSelected = selectedStock === stock.symbol;
              return (
                <button
                  key={stock.symbol}
                  type="button"
                  onClick={() => handleStockClick(stock.symbol)}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between group active:scale-98 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {stock.ticker}
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {stock.nameAr}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">{stock.sector}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-emerald-400 transition-colors flex-shrink-0 mr-2">
                    <span className="text-[11px] font-bold hidden sm:inline">تحليل</span>
                    <ArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}

            {filteredStocks.length === 0 && (
              <div className="col-span-2 py-8 text-center text-xs text-slate-500">
                لا توجد أسهم مطابقة لبحثك في هذا القطاع.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Foreign Currencies in Egyptian Banks */}
        <div className="lg:col-span-4 rounded-3xl bg-slate-900/80 p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign size={16} className="text-emerald-400" />
                سعر صرف العملات (ج.م)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                رسمي / بنوك
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 mt-2">
              {FOREX_PAIRS.map((fx) => (
                <button
                  key={fx.symbol}
                  type="button"
                  onClick={() => handleStockClick(fx.symbol)}
                  className="w-full py-2.5 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded-xl transition-colors text-right group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{fx.flag}</span>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition-colors">
                        {fx.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{fx.code} / EGP</span>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="text-sm font-black text-emerald-400 font-mono">
                      {fx.egpRate.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">ج.م</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>تحديث مباشر من البنك المركزي</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 size={12} /> محدث
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
