/* ============================================================
 * EGXHub.tsx
 * Dedicated Egyptian Stock Exchange (EGX) Hub
 * EGX 30 index overview, top equities watchlist, and 520px TradingView chart.
 * ============================================================ */

import { useState } from 'react';
import { Landmark, Layers } from 'lucide-react';
import { TradingViewChart } from './TradingViewChart';
import { TradingViewMiniWidget } from './TradingViewMiniWidget';

export const EGX_LEADERS = [
  { symbol: 'EGX:EGX30', nameAr: 'مؤشر EGX 30 الرئيسي' },
  { symbol: 'EGX:COMI', nameAr: 'البنك التجاري الدولي (CIB)' },
  { symbol: 'EGX:TMGH', nameAr: 'مجموعة طلعت مصطفى' },
  { symbol: 'EGX:FWRY', nameAr: 'فوري لتكنولوجيا المدفوعات' },
  { symbol: 'EGX:ETEL', nameAr: 'المصرية للاتصالات (WE)' },
  { symbol: 'EGX:SWDY', nameAr: 'السويدي إليكتريك' },
  { symbol: 'EGX:ABUK', nameAr: 'أبو قير للأسمدة' },
  { symbol: 'EGX:EAST', nameAr: 'الشرقية للدخان (إيسترن)' },
];

export function EGXHub() {
  const [selectedStock, setSelectedStock] = useState<string>('EGX:EGX30');
  const [selectedStockName, setSelectedStockName] = useState<string>('مؤشر EGX 30 الرئيسي');

  return (
    <section id="egx-hub" className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-inner">
            <Landmark size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              البورصة المصرية وأشهر الأسهم (EGX 30)
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                تداول حي ومباشر
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              متابعة حية للأسهم القيادية والشركات الأكثر نشاطاً في السوق المصري
            </p>
          </div>
        </div>
      </div>

      {/* EGX Leaders Live Mini Charts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">الأسهم القيادية الأكثر تداولاً بالبورصة المصرية</h3>
          <span className="text-xs text-slate-400 font-mono">بيانات TradingView الرسمية</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TradingViewMiniWidget
            symbol="EGX:COMI"
            title="البنك التجاري الدولي (CIB)"
            height={200}
          />
          <TradingViewMiniWidget
            symbol="EGX:TMGH"
            title="طلعت مصطفى (TMGH)"
            height={200}
          />
          <TradingViewMiniWidget
            symbol="EGX:FWRY"
            title="فوري للمدفوعات (FWRY)"
            height={200}
          />
          <TradingViewMiniWidget
            symbol="EGX:SWDY"
            title="السويدي إليكتريك (SWDY)"
            height={200}
          />
        </div>
      </div>

      {/* Main EGX 520px Advanced Chart Canvas */}
      <div className="rounded-3xl bg-[#0B0F17] border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 flex flex-col">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2.5">
              <Layers size={22} className="text-emerald-400" />
              الشارت التفاعلي المباشر للأسهم المصرية ({selectedStockName})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              رسم بياني لحظي بأدوات التحليل الفني ومؤشرات التداول لسوق المال المصري
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
              {selectedStock}
            </span>
          </div>
        </div>

        {/* Quick Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {EGX_LEADERS.map((stock) => {
            const isSelected = selectedStock === stock.symbol;
            return (
              <button
                key={stock.symbol}
                type="button"
                onClick={() => {
                  setSelectedStock(stock.symbol);
                  setSelectedStockName(stock.nameAr);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 font-black'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{stock.nameAr}</span>
              </button>
            );
          })}
        </div>

        {/* 520px Fixed Height TradingView Chart */}
        <div
          className="w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-[#080C14]"
          style={{ height: '520px', minHeight: '520px' }}
        >
          <TradingViewChart
            symbol={selectedStock}
            height={520}
            title={`${selectedStockName} (${selectedStock})`}
          />
        </div>
      </div>
    </section>
  );
}
