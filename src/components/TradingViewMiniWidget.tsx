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
  height = 220,
}: TradingViewMiniWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

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
        container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
      }
    };
  }, [symbol, height]);

  return (
    <div
      className="rounded-3xl bg-[#0B0F17] border border-slate-800 p-4 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden hover:border-slate-700 transition-all"
      style={{ minHeight: `${height + 36}px` }}
    >
      {title && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300">{title}</span>
          <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {symbol}
          </span>
        </div>
      )}
      <div
        ref={containerRef}
        className="tradingview-widget-container w-full"
        style={{ height: `${height}px`, minHeight: `${height}px` }}
      >
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}

export const TradingViewMiniWidget = memo(TradingViewMiniWidgetComponent);
