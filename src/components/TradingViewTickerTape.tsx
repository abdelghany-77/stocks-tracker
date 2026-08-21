/* ============================================================
 * TradingViewTickerTape.tsx
 * Official TradingView Ticker Tape Widget (Strict Dark Mode & Resilient Lifecycle)
 * ============================================================ */

import { useEffect, useRef, memo } from 'react';

function TradingViewTickerTapeComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous children
    container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'OANDA:XAUUSD', title: 'الذهب (XAU/USD)' },
        { proName: 'FX_IDC:USDEGP', title: 'الدولار / جنيه' },
        { proName: 'EGX:EGX30', title: 'مؤشر EGX 30' },
        { proName: 'NASDAQ:QQQ', title: 'ناسداك (QQQ)' },
        { proName: 'AMEX:SPY', title: 'S&P 500 (SPY)' },
        { proName: 'TVC:UKOIL', title: 'نفط برنت' },
        { proName: 'BINANCE:BTCUSDT', title: 'بيتكوين BTC' },
        { proName: 'FX_IDC:EUREGP', title: 'اليورو / جنيه' },
        { proName: 'FX_IDC:SAREGP', title: 'الريال السعودي' },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'ar_AE',
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#080C14] border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-xl min-h-[46px]">
      <div ref={containerRef} className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}

export const TradingViewTickerTape = memo(TradingViewTickerTapeComponent);
