/* ============================================================
 * TradingViewProChart.tsx
 * Unified Official TradingView Pro Real-Time Interactive Chart Widget
 * Responsive mobile-first design, comprehensive asset categorization,
 * and zero-duplication architecture.
 * ============================================================ */

import { useState, useEffect, useRef, memo } from 'react';
import {
  Layers,
  Sparkles,
  TrendingUp,
  Landmark,
  Coins,
  DollarSign,
  Globe,
  Zap,
} from 'lucide-react';

export interface ChartAssetOption {
  symbol: string;
  nameAr: string;
  category: 'egx' | 'gold' | 'forex' | 'global' | 'crypto';
  icon?: string;
}

export const ALL_CHART_ASSETS: ChartAssetOption[] = [
  // 1. Egyptian Stock Exchange (EGX)
  { symbol: 'EGX:EGX30', nameAr: 'مؤشر EGX 30 الرئيسي', category: 'egx' },
  { symbol: 'EGX:EGX70EWI', nameAr: 'مؤشر الشركات المتوسطة EGX 70', category: 'egx' },
  { symbol: 'EGX:COMI', nameAr: 'البنك التجاري الدولي (CIB)', category: 'egx' },
  { symbol: 'EGX:HRHO', nameAr: 'إي إف جي القابضة (هيرميس)', category: 'egx' },
  { symbol: 'EGX:TMGH', nameAr: 'طلعت مصطفى القابضة (TMGH)', category: 'egx' },
  { symbol: 'EGX:FWRY', nameAr: 'فوري للمدفوعات الرقمية (FWRY)', category: 'egx' },
  { symbol: 'EGX:SWDY', nameAr: 'السويدي إليكتريك (SWDY)', category: 'egx' },
  { symbol: 'EGX:MFPC', nameAr: 'مصر لإنتاج الأسمدة (موبكو)', category: 'egx' },
  { symbol: 'EGX:ESRS', nameAr: 'حديد عز (ESRS)', category: 'egx' },
  { symbol: 'EGX:ABUK', nameAr: 'أبو قير للأسمدة (ABUK)', category: 'egx' },
  { symbol: 'EGX:AMOC', nameAr: 'الإسكندرية للزيوت (أموك)', category: 'egx' },
  { symbol: 'EGX:SKPC', nameAr: 'سيدي كرير للبتروكيماويات (سيدبك)', category: 'egx' },
  { symbol: 'EGX:ETEL', nameAr: 'المصرية للاتصالات (WE)', category: 'egx' },
  { symbol: 'EGX:PHDC', nameAr: 'بالم هيلز للتعمير (PHDC)', category: 'egx' },
  { symbol: 'EGX:MNHD', nameAr: 'مدينة مصر للإسكان (MNHD)', category: 'egx' },
  { symbol: 'EGX:HELI', nameAr: 'مصر الجديدة للإسكان (HELI)', category: 'egx' },
  { symbol: 'EGX:ORAS', nameAr: 'أوراسكوم للإنشاءات (ORAS)', category: 'egx' },
  { symbol: 'EGX:ADIB', nameAr: 'مصرف أبوظبي الإسلامي (ADIB)', category: 'egx' },
  { symbol: 'EGX:CIEB', nameAr: 'بنك كريدي أجريكول (CIEB)', category: 'egx' },
  { symbol: 'EGX:EKHO', nameAr: 'القابضة المصرية الكويتية (EKHO)', category: 'egx' },
  { symbol: 'EGX:EAST', nameAr: 'الشرقية للدخان (EAST)', category: 'egx' },
  { symbol: 'EGX:JUFO', nameAr: 'جهينة للصناعات الغذائية (JUFO)', category: 'egx' },

  // 2. Gold & Commodities
  { symbol: 'OANDA:XAUUSD', nameAr: '🪙 أونصة الذهب (Gold Spot)', category: 'gold' },
  { symbol: 'TVC:SILVER', nameAr: '🥈 الفضة العالمية (Silver Spot)', category: 'gold' },
  { symbol: 'TVC:UKOIL', nameAr: '🛢️ نفط برنت (Brent Crude)', category: 'gold' },

  // 3. Forex & Currency Rates
  { symbol: 'FX_IDC:USDEGP', nameAr: '💵 الدولار / جنيه (USD/EGP)', category: 'forex' },
  { symbol: 'FX_IDC:EUREGP', nameAr: '💶 اليورو / جنيه (EUR/EGP)', category: 'forex' },
  { symbol: 'FX_IDC:SAREGP', nameAr: '🇸🇦 الريال السعودي / جنيه', category: 'forex' },
  { symbol: 'FX_IDC:GBPEGP', nameAr: '💷 الجنيه الإسترليني / جنيه', category: 'forex' },

  // 4. Global Market Indices & ETFs
  { symbol: 'NASDAQ:QQQ', nameAr: '🌐 ناسداك 100 (Invesco QQQ)', category: 'global' },
  { symbol: 'AMEX:SPY', nameAr: '🇺🇸 S&P 500 (SPY ETF)', category: 'global' },

  // 5. Cryptocurrencies
  { symbol: 'BINANCE:BTCUSDT', nameAr: '⚡ بيتكوين (Bitcoin / USDT)', category: 'crypto' },
  { symbol: 'BINANCE:ETHUSDT', nameAr: '💎 إيثيريوم (Ethereum / USDT)', category: 'crypto' },
];

export const CATEGORIES = [
  { id: 'all', label: 'كافة الأصول', icon: Sparkles },
  { id: 'egx', label: 'البورصة المصرية 🇪🇬', icon: Landmark },
  { id: 'gold', label: 'الذهب والسلع 🪙', icon: Coins },
  { id: 'forex', label: 'العملات والصرف 💱', icon: DollarSign },
  { id: 'global', label: 'الأسواق العالمية 🌐', icon: Globe },
  { id: 'crypto', label: 'العملات الرقمية ⚡', icon: Zap },
] as const;

interface TradingViewProChartProps {
  selectedSymbol?: string;
  onSymbolChange?: (symbol: string) => void;
  id?: string;
}

function TradingViewProChartComponent({
  selectedSymbol,
  onSymbolChange,
  id = 'interactive-chart',
}: TradingViewProChartProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentSymbol, setCurrentSymbol] = useState<string>(selectedSymbol || 'OANDA:XAUUSD');
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize when parent passes a new selectedSymbol
  useEffect(() => {
    if (selectedSymbol && selectedSymbol !== currentSymbol) {
      setCurrentSymbol(selectedSymbol);
    }
  }, [selectedSymbol]);

  const activeAsset =
    ALL_CHART_ASSETS.find((a) => a.symbol === currentSymbol) || {
      symbol: currentSymbol,
      nameAr: currentSymbol,
      category: 'egx' as const,
    };

  const filteredAssets =
    activeCategory === 'all'
      ? ALL_CHART_ASSETS
      : ALL_CHART_ASSETS.filter((a) => a.category === activeCategory);

  const handleSelectSymbol = (sym: string) => {
    setCurrentSymbol(sym);
    if (onSymbolChange) {
      onSymbolChange(sym);
    }
  };

  // Embed official TradingView Advanced Chart script with dynamic lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '<div class="tradingview-widget-container__widget w-full h-full"></div>';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: currentSymbol,
      interval: 'D',
      timezone: 'Africa/Cairo',
      theme: 'dark',
      style: '1',
      locale: 'ar_AE',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      hide_side_toolbar: false,
      hide_top_toolbar: false,
      support_host: 'https://www.tradingview.com',
      backgroundColor: '#0B0F17',
      gridColor: 'rgba(255, 255, 255, 0.04)',
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '<div class="tradingview-widget-container__widget w-full h-full"></div>';
      }
    };
  }, [currentSymbol]);

  return (
    <section id={id} className="space-y-6 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-inner">
            <Layers size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              الشارت التفاعلي المباشر
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                TradingView Live Pro
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              تحليل فني لحظي ومؤشرات متقدمة لمختلف الأسواق في شارت واحد موحد
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 font-bold">
            <TrendingUp size={14} />
            <span>{activeAsset.symbol}</span>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-2xl space-y-5">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isCatActive = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 active:scale-95 ${
                  isCatActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 font-black'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon size={14} className={isCatActive ? 'text-slate-950' : 'text-slate-400'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Asset Quick Switcher: Mobile Select + Desktop Pills */}
        <div className="block sm:hidden">
          <label className="block text-xs font-bold text-slate-400 mb-1.5">اختر الأصل المالي للعرض:</label>
          <select
            value={currentSymbol}
            onChange={(e) => handleSelectSymbol(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
          >
            {filteredAssets.map((asset) => (
              <option key={asset.symbol} value={asset.symbol}>
                {asset.nameAr} ({asset.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Desktop / Tablet Scrollable Pills */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filteredAssets.map((asset) => {
            const isSelected = currentSymbol === asset.symbol;
            return (
              <button
                key={asset.symbol}
                type="button"
                onClick={() => handleSelectSymbol(asset.symbol)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1 active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-inner'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{asset.nameAr}</span>
              </button>
            );
          })}
        </div>

        {/* Responsive Chart Canvas */}
        <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#080C14] relative shadow-inner h-[380px] sm:h-[480px] md:h-[540px] lg:h-[580px]">
          <div ref={containerRef} className="tradingview-widget-container w-full h-full">
            <div className="tradingview-widget-container__widget w-full h-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const TradingViewProChart = memo(TradingViewProChartComponent);
export const TradingViewAdvancedChart = TradingViewProChart;
export const TradingViewChart = TradingViewProChart;
