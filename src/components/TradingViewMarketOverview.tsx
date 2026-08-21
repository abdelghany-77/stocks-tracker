/* ============================================================
 * TradingViewMarketOverview.tsx
 * Official TradingView Market Overview Widget (Strict Dark Mode)
 * Tabbed live price overview for Gold & Forex, EGX, and Global Markets.
 * ============================================================ */

import { useEffect, useRef, memo } from 'react';
import { LayoutGrid } from 'lucide-react';

interface TradingViewMarketOverviewProps {
  height?: number;
}

function TradingViewMarketOverviewComponent({
  height = 560,
}: TradingViewMarketOverviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = `${height}px`;
    widgetDiv.style.minHeight = `${height}px`;
    widgetDiv.style.width = '100%';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: 'dark',
      dateRange: '12M',
      showChart: true,
      locale: 'ar_AE',
      largeChartUrl: '',
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: true,
      width: '100%',
      height: height,
      plotLineColorGrowing: 'rgba(16, 185, 129, 1)',
      plotLineColorFalling: 'rgba(244, 63, 94, 1)',
      gridLineColor: 'rgba(255, 255, 255, 0.04)',
      scaleFontColor: 'rgba(148, 163, 184, 1)',
      belowLineFillColorGrowing: 'rgba(16, 185, 129, 0.12)',
      belowLineFillColorFalling: 'rgba(244, 63, 94, 0.12)',
      symbolActiveColor: 'rgba(16, 185, 129, 0.15)',
      tabs: [
        {
          title: '🪙 الذهب والعملات (Forex & Gold)',
          symbols: [
            { s: 'OANDA:XAUUSD', d: 'أونصة الذهب عالمياً' },
            { s: 'FX_IDC:USDEGP', d: 'دولار أمريكي / جنيه مصري' },
            { s: 'FX_IDC:EUREGP', d: 'يورو / جنيه مصري' },
            { s: 'FX_IDC:SAREGP', d: 'ريال سعودي / جنيه مصري' },
            { s: 'FX_IDC:AEDUSD', d: 'درهم إماراتي / دولار' },
            { s: 'FX_IDC:GBPEGP', d: 'جنيه إسترليني / جنيه مصري' },
          ],
          originalTitle: 'Forex & Gold',
        },
        {
          title: '🏛️ البورصة المصرية (EGX Stocks)',
          symbols: [
            { s: 'EGX:EGX30', d: 'مؤشر EGX 30 الرئيسي' },
            { s: 'EGX:COMI', d: 'البنك التجاري الدولي (CIB)' },
            { s: 'EGX:TMGH', d: 'طلعت مصطفى القابضة' },
            { s: 'EGX:FWRY', d: 'فوري للمدفوعات' },
            { s: 'EGX:SWDY', d: 'السويدي إليكتريك' },
            { s: 'EGX:ETEL', d: 'المصرية للاتصالات (WE)' },
            { s: 'EGX:ABUK', d: 'أبو قير للأسمدة' },
            { s: 'EGX:EAST', d: 'الشرقية للدخان (إيسترن)' },
          ],
          originalTitle: 'EGX Stocks',
        },
        {
          title: '🌐 الأسواق العالمية والسلع (Global)',
          symbols: [
            { s: 'AMEX:SPY', d: 'S&P 500 (SPY ETF)' },
            { s: 'NASDAQ:QQQ', d: 'ناسداك (Invesco QQQ)' },
            { s: 'TVC:UKOIL', d: 'نفط خام برنت' },
            { s: 'TVC:SILVER', d: 'الفضة العالمية (XAG)' },
            { s: 'BINANCE:BTCUSDT', d: 'بيتكوين (Bitcoin)' },
            { s: 'BINANCE:ETHUSDT', d: 'إيثيريوم (Ethereum)' },
          ],
          originalTitle: 'Global Markets',
        },
      ],
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [height]);

  return (
    <div
      className="w-full rounded-3xl bg-[#0B0F17] border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 flex flex-col"
      style={{ minHeight: `${height + 100}px` }}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2.5">
            <LayoutGrid size={22} className="text-blue-400" />
            نظرة شاملة على جميع الأسواق (TradingView Market Overview)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            متابعة لحظية متعددة التبويبات للذهب، العملات، أسهم EGX، والمؤشرات العالمية
          </p>
        </div>
      </div>

      <div
        className="w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-[#080C14]"
        style={{ height: `${height}px`, minHeight: `${height}px` }}
      >
        <div
          ref={containerRef}
          className="tradingview-widget-container w-full"
          style={{ height: `${height}px`, minHeight: `${height}px` }}
        />
      </div>
    </div>
  );
}

export const TradingViewMarketOverview = memo(TradingViewMarketOverviewComponent);
