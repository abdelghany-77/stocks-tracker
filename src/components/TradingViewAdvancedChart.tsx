/* ============================================================
 * TradingViewAdvancedChart.tsx
 * Official TradingView Advanced Real-Time Chart Widget
 * ============================================================ */

import { useState, useEffect, useRef, memo } from 'react';
import { Layers } from 'lucide-react';

export interface ChartAssetOption {
  symbol: string;
  nameAr: string;
  category: string;
}

export const DEFAULT_CHART_ASSETS: ChartAssetOption[] = [
  { symbol: 'OANDA:XAUUSD', nameAr: 'أونصة الذهب (Gold Spot)', category: 'gold' },
  { symbol: 'EGX:EGX30', nameAr: 'مؤشر البورصة المصرية (EGX 30)', category: 'egx' },
  { symbol: 'FX_IDC:USDEGP', nameAr: 'الدولار / جنيه (USD/EGP)', category: 'forex' },
  { symbol: 'NASDAQ:QQQ', nameAr: 'ناسداك 100 (Invesco QQQ)', category: 'us' },
  { symbol: 'AMEX:SPY', nameAr: 'S&P 500 (SPY ETF)', category: 'us' },
  { symbol: 'TVC:UKOIL', nameAr: 'نفط خام برنت (Brent)', category: 'commodity' },
  { symbol: 'BINANCE:BTCUSDT', nameAr: 'بيتكوين (Bitcoin)', category: 'crypto' },
  { symbol: 'EGX:COMI', nameAr: 'البنك التجاري الدولي (CIB)', category: 'egx' },
  { symbol: 'EGX:TMGH', nameAr: 'طلعت مصطفى (TMGH)', category: 'egx' },
  { symbol: 'EGX:FWRY', nameAr: 'فوري للمدفوعات (FWRY)', category: 'egx' },
];

interface TradingViewAdvancedChartProps {
  initialSymbol?: string;
  symbol?: string;
  height?: number;
  title?: string;
}

function TradingViewAdvancedChartComponent({
  initialSymbol,
  symbol,
  height = 540,
}: TradingViewAdvancedChartProps) {
  const activeSymbol = symbol || initialSymbol || 'OANDA:XAUUSD';

  const [selectedAsset, setSelectedAsset] = useState<ChartAssetOption>(() => {
    return (
      DEFAULT_CHART_ASSETS.find((a) => a.symbol === activeSymbol) || {
        symbol: activeSymbol,
        nameAr: activeSymbol,
        category: 'custom',
      }
    );
  });

  useEffect(() => {
    if (activeSymbol) {
      const match = DEFAULT_CHART_ASSETS.find((a) => a.symbol === activeSymbol);
      setSelectedAsset(match || { symbol: activeSymbol, nameAr: activeSymbol, category: 'custom' });
    }
  }, [activeSymbol]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: false,
      width: '100%',
      height: height,
      symbol: selectedAsset.symbol,
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
        container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
      }
    };
  }, [selectedAsset.symbol, height]);

  return (
    <div
      className="w-full rounded-3xl bg-[#0B0F17] border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 flex flex-col"
      style={{ minHeight: `${height + 140}px` }}
    >
      {/* Header & Selected Pill */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2.5">
            <Layers size={22} className="text-emerald-400" />
            الشارت التفاعلي المتقدم متعدد الأصول (TradingView Advanced Live)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            شارت احترافي مباشر بأدوات التحليل الفني، المؤشرات، ومختلف الفترات الزمنية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            {selectedAsset.symbol}
          </span>
        </div>
      </div>

      {/* Asset Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DEFAULT_CHART_ASSETS.map((asset) => {
          const isSelected = selectedAsset.symbol === asset.symbol;
          return (
            <button
              key={asset.symbol}
              type="button"
              onClick={() => setSelectedAsset(asset)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 font-black'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{asset.nameAr}</span>
            </button>
          );
        })}
      </div>

      {/* Fixed 540px Canvas Container */}
      <div
        className="w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-[#080C14]"
        style={{ height: `${height}px`, minHeight: `${height}px` }}
      >
        <div
          ref={containerRef}
          className="tradingview-widget-container w-full"
          style={{ height: `${height}px`, minHeight: `${height}px` }}
        >
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>
    </div>
  );
}

export const TradingViewAdvancedChart = memo(TradingViewAdvancedChartComponent);
export const TradingViewChart = TradingViewAdvancedChart;
