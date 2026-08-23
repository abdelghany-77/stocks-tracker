/* ============================================================
 * App.tsx — Master Financial Market Watch Dashboard
 * Modern Fintech UI, Dynamic Live Gold Pricing,
 * Unified Interactive Pro Chart & Responsive Architecture
 * ============================================================ */

import { useState, useEffect } from 'react';
import {
  Activity,
  Github,
  ChevronUp,
  Flame,
  Coins,
  Landmark,
  Layers,
  Calculator,
  Clock,
  Radio,
} from 'lucide-react';
import { TradingViewTickerTape } from '@/components/TradingViewTickerTape';
import { TradingViewMiniWidget } from '@/components/TradingViewMiniWidget';
import { EgyptianGoldHub } from '@/components/EgyptianGoldHub';
import { EGXHub } from '@/components/EGXHub';
import { TradingViewProChart } from '@/components/TradingViewProChart';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getEGXMarketStatus } from '@/services/marketData';

export default function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeChartSymbol, setActiveChartSymbol] = useState<string>('OANDA:XAUUSD');
  const [marketStatus, setMarketStatus] = useState(() => getEGXMarketStatus());
  const [currentTime, setCurrentTime] = useState<string>(() =>
    new Date().toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  );

  // Live clock & Market status updater
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setMarketStatus(getEGXMarketStatus());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSymbolForChart = (symbol: string) => {
    setActiveChartSymbol(symbol);
  };

  return (
    <ErrorBoundary fallbackTitle="حدث خطأ في تحميل المنصة">
      <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300 antialiased" dir="rtl">
        {/* 1. Sticky Real-Time Ticker Tape */}
        <header className="sticky top-0 z-50 shadow-md">
          <ErrorBoundary fallbackTitle="شريط الأسعار المباشر">
            <TradingViewTickerTape />
          </ErrorBoundary>
        </header>

        {/* Main Content Container */}
        <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-8 sm:space-y-12 flex-1">
          {/* Header & Market Status Banner */}
          <section className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-[#0B101D] border border-slate-800/90 p-5 sm:p-7 md:p-8 shadow-2xl backdrop-blur-2xl flex items-center justify-between flex-wrap gap-4 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3.5 sm:gap-4 relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner flex-shrink-0">
                <Flame size={28} className="text-emerald-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Stock Pulse</h1>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                    أسواق اليوم 🇪🇬 🌐
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                  المنصة اللحظية لمتابعة أسعار الذهب، البورصة المصرية EGX، العملات بالبنوك، والأسواق العالمية
                </p>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap relative z-10">
              {/* EGX Market Session Status */}
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold font-mono border ${
                  marketStatus.isOpen
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
                title={marketStatus.timeDetails}
              >
                <span className="relative flex h-2 w-2">
                  {marketStatus.isOpen && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      marketStatus.isOpen ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}
                  />
                </span>
                <span>{marketStatus.text}</span>
              </div>

              {/* Live Clock */}
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 font-mono">
                <Clock size={13} className="text-slate-400" />
                <span>{currentTime}</span>
              </div>
            </div>
          </section>

          {/* Quick Jump Navigation Bar */}
          <nav aria-label="أقسام المنصة" className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <a
              href="#market-highlights"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900/90 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
            >
              <Radio size={14} className="text-emerald-400" />
              <span>المؤشرات القيادية</span>
            </a>
            <a
              href="#egyptian-gold"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900/90 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
            >
              <Coins size={14} className="text-amber-400" />
              <span>أسعار الذهب بالصاغة</span>
            </a>
            <a
              href="#calculator"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900/90 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
            >
              <Calculator size={14} className="text-amber-300" />
              <span>حاسبة المصنعية والدمغة</span>
            </a>
            <a
              href="#egx-hub"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900/90 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
            >
              <Landmark size={14} className="text-emerald-400" />
              <span>البورصة المصرية والعملات</span>
            </a>
            <a
              href="#interactive-chart"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900/90 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
            >
              <Layers size={14} className="text-cyan-400" />
              <span>الشارت التفاعلي الموحد</span>
            </a>
          </nav>

          {/* 2. Hero Highlights (Gold, EGX30, USD/EGP, Nasdaq QQQ) */}
          <section id="market-highlights" className="space-y-4 scroll-mt-20">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                المؤشرات القيادية اللحظية (Market Highlights)
              </h2>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">تغذية لحظية مباشرة</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ErrorBoundary fallbackTitle="أونصة الذهب">
                <TradingViewMiniWidget
                  symbol="OANDA:XAUUSD"
                  title="🪙 أونصة الذهب (Gold Spot)"
                  height={200}
                />
              </ErrorBoundary>
              <ErrorBoundary fallbackTitle="مؤشر EGX 30">
                <TradingViewMiniWidget
                  symbol="EGX:EGX30"
                  title="🏛️ مؤشر البورصة المصرية EGX 30"
                  height={200}
                />
              </ErrorBoundary>
              <ErrorBoundary fallbackTitle="الدولار مقابل الجنيه">
                <TradingViewMiniWidget
                  symbol="FX_IDC:USDEGP"
                  title="💵 الدولار مقابل الجنيه (USD/EGP)"
                  height={200}
                />
              </ErrorBoundary>
              <ErrorBoundary fallbackTitle="ناسداك 100">
                <TradingViewMiniWidget
                  symbol="NASDAQ:QQQ"
                  title="🌐 ناسداك 100 (Invesco QQQ)"
                  height={200}
                />
              </ErrorBoundary>
            </div>
          </section>

          {/* 3. Egyptian Gold Market Hub & Live Calculator (Dynamic Real-time) */}
          <ErrorBoundary fallbackTitle="مركز الذهب المصري">
            <EgyptianGoldHub />
          </ErrorBoundary>

          {/* 4. Dedicated Egyptian Stock Exchange (EGX) & Forex Section */}
          <ErrorBoundary fallbackTitle="قسم البورصة المصرية">
            <EGXHub onSelectSymbol={handleSelectSymbolForChart} />
          </ErrorBoundary>

          {/* 5. Unified Multi-Asset Interactive Pro Chart (Responsive, Mobile-First) */}
          <ErrorBoundary fallbackTitle="الشارت التفاعلي">
            <TradingViewProChart
              selectedSymbol={activeChartSymbol}
              onSymbolChange={handleSelectSymbolForChart}
              id="interactive-chart"
            />
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <footer className="w-full bg-[#05080E] border-t border-slate-800/80 py-8 px-4 mt-12 sm:mt-16">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <Activity size={15} className="text-emerald-400" />
              <span className="font-bold text-slate-300">Stock Pulse © 2026</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/abdelghany-77/stocks-tracker"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Github size={15} />
                <span>المشروع على GitHub</span>
              </a>
            </div>
          </div>
        </footer>

        {/* Floating Back to Top Button */}
        {showBackToTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-40 p-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 backdrop-blur-md shadow-2xl transition-all active:scale-95"
            title="العودة لأعلى الصفحة"
          >
            <ChevronUp size={22} />
          </button>
        )}
      </div>
    </ErrorBoundary>
  );
}
