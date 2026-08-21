/* ============================================================
 * TradingViewMiniWidget.tsx
 * Official TradingView Mini Chart / Ticker Widget for Hero Cards
 * Enforces strict dark mode (#0B0F17) with zero white artifacts.
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

    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = `${height}px`;
    widgetDiv.style.width = '100%';
    container.appendChild(widgetDiv);

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
        container.innerHTML = '';
      }
    };
  }, [symbol, height]);

  return (
    <div
      className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden hover:border-slate-700 transition-all bg-[#0B0F17]"
      style={{ minHeight: `${height + 30}px` }}
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
        className="tradingview-widget-container w-full bg-[#0B0F17]"
        style={{ height: `${height}px`, minHeight: `${height}px` }}
      />
    </div>
  );
}

export const TradingViewMiniWidget = memo(TradingViewMiniWidgetComponent);
