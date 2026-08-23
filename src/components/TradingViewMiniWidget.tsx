/* ============================================================
 * TradingViewMiniWidget.tsx
 * Official TradingView Mini Chart Widget for Hero Highlights
 * ============================================================ */

import { useEffect, useRef, memo } from 'react';

interface TradingViewMiniWidgetProps {
  symbol: string;
  title?: string;
  height?: number;
}

function TradingViewMiniWidgetComponent({
  symbol,
  title,
  height = 200,
}: TradingViewMiniWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '<div class="tradingview-widget-container__widget w-full h-full"></div>';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: '100%',
      height: height,
      locale: 'ar_AE',
      dateRange: '1M',
      colorTheme: 'dark',
      isTransparent: true,
      autosize: false,
      largeChartUrl: '',
      chartOnly: false,
      noTimeScale: false,
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '<div class="tradingview-widget-container__widget w-full h-full"></div>';
      }
    };
  }, [symbol, height]);

  return (
    <div
      className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 shadow-xl backdrop-blur-xl flex flex-col justify-between overflow-hidden hover:border-slate-700 transition-all group"
      style={{ minHeight: `${height + 36}px` }}
    >
      {title && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{title}</span>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {symbol}
          </span>
        </div>
      )}
      <div
        ref={containerRef}
        className="tradingview-widget-container w-full flex-1"
        style={{ height: `${height}px`, minHeight: `${height}px` }}
      >
        <div className="tradingview-widget-container__widget w-full h-full"></div>
      </div>
    </div>
  );
}

export const TradingViewMiniWidget = memo(TradingViewMiniWidgetComponent);
