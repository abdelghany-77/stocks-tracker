/* ============================================================
 * TradingViewChart / TradingViewWidget
 * High-performance 540px interactive chart embed with clean unmounting.
 * ============================================================ */

import { useEffect, useRef } from 'react';

export const TRADINGVIEW_SYMBOLS = {
  GOLD: 'FX_IDC:XAUUSD',
  NASDAQ: 'NASDAQ:NDX',
  SP500: 'FOREXCOM:SPXUSD',
  EGX30: 'EGX:EGX30',
  BRENT: 'TVC:UKOIL',
  BTC: 'BINANCE:BTCUSDT',
} as const;

interface TradingViewChartProps {
  symbol: string;
  height?: number;
  interval?: 'D' | 'W' | 'M' | '60' | '15' | '5' | '1';
  theme?: 'dark' | 'light';
  title?: string;
}

export function TradingViewChart({
  symbol,
  height = 540,
  interval = 'D',
  theme = 'dark',
  title,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    // Clean DOM completely before injecting new iframe
    currentContainer.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = `${height}px`;
    widgetContainer.style.minHeight = `${height}px`;
    widgetContainer.style.width = '100%';
    currentContainer.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: false,
      width: '100%',
      height: height,
      symbol: symbol,
      interval: interval,
      timezone: 'Africa/Cairo',
      theme: theme,
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

    currentContainer.appendChild(script);

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [symbol, height, interval, theme]);

  return (
    <div
      className="w-full rounded-3xl overflow-hidden border border-slate-800 bg-[#0B0F17] shadow-2xl flex flex-col"
      style={{ height: `${height + (title ? 48 : 0)}px`, minHeight: `${height + (title ? 48 : 0)}px` }}
    >
      {title && (
        <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <span className="text-xs md:text-sm font-bold text-slate-200">{title}</span>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
            {symbol}
          </span>
        </div>
      )}
      <div
        ref={containerRef}
        className="tradingview-widget-container flex-1 w-full"
        style={{ height: `${height}px`, minHeight: `${height}px` }}
      />
    </div>
  );
}

// Export as TradingViewWidget for backward compatibility
export const TradingViewWidget = TradingViewChart;
