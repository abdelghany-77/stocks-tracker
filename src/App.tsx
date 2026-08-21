/* ============================================================
 * App.tsx — Master Financial Market Watch Dashboard
 * Strict Dark Mode, Official TradingView Integration & Egyptian Gold Hub
 * ============================================================ */

import { useState, useEffect } from 'react';
import { Github, Heart, ChevronUp, Flame, Activity } from 'lucide-react';
import { TradingViewTickerTape } from '@/components/TradingViewTickerTape';
import { TradingViewMiniWidget } from '@/components/TradingViewMiniWidget';
import { EgyptianGoldHub } from '@/components/EgyptianGoldHub';
import { TradingViewMarketOverview } from '@/components/TradingViewMarketOverview';
import { EGXHub } from '@/components/EGXHub';
import { TradingViewAdvancedChart } from '@/components/TradingViewAdvancedChart';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>(() =>
    new Date().toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  );

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
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

  return (
    <ErrorBoundary fallbackTitle="حدث خطأ في تحميل المنصة">
      <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300 antialiased" dir="rtl">
        {/* 1. Sticky Real-Time Ticker Tape (Dark Mode) */}
        <ErrorBoundary fallbackTitle="شريط الأسعار المباشر">
          <TradingViewTickerTape />
        </ErrorBoundary>

        {/* Main Container */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-12 flex-1">
          {/* Header & Market Status */}
          <header className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 shadow-2xl backdrop-blur-2xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <Flame size={26} className="text-emerald-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-black text-white tracking-tight">Stock Pulse</h1>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                    أسواق اليوم 🇪🇬 🌐
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  المنصة اللحظية لمتابعة الذهب، البورصة المصرية EGX، العملات بالبنوك، والأسواق العالمية
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Indicator */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span>مباشر TradingView</span>
              </div>

              {/* Time Clock */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 font-mono">
                <span>{currentTime}</span>
              </div>
            </div>
          </header>

          {/* 2. Hero Highlights (Gold, EGX30, USD/EGP, Nasdaq QQQ) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                المؤشرات القيادية اللحظية (Market Highlights)
              </h2>
              <span className="text-xs text-slate-400 font-mono">تغذية لحظية مباشرة</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ErrorBoundary fallbackTitle="أونصة الذهب">
                <TradingViewMiniWidget
                  symbol="OANDA:XAUUSD"
                  title="🪙 أونصة الذهب (Gold Spot)"
                  height={220}
                />
              </ErrorBoundary>
              <ErrorBoundary fallbackTitle="مؤشر EGX 30">
                <TradingViewMiniWidget
                  symbol="EGX:EGX30"
                  title="🏛️ مؤشر البورصة المصرية EGX 30"
                  height={220}
                />
              </ErrorBoundary>
              <ErrorBoundary fallbackTitle="الدولار مقابل الجنيه">
                <TradingViewMiniWidget
                  symbol="FX_IDC:USDEGP"
                  title="💵 الدولار مقابل الجنيه (USD/EGP)"
                  height={220}
                />
              </ErrorBoundary>
              <ErrorBoundary fallbackTitle="ناسداك 100">
                <TradingViewMiniWidget
                  symbol="NASDAQ:QQQ"
                  title="🌐 ناسداك 100 (Invesco QQQ)"
                  height={220}
                />
              </ErrorBoundary>
            </div>
          </section>

          {/* 3. Egyptian Gold Market Hub & Calculator */}
          <ErrorBoundary fallbackTitle="مركز الذهب المصري">
            <EgyptianGoldHub />
          </ErrorBoundary>

          {/* 4. TradingView Market Overview Tabs (Forex/Gold, EGX, Global) */}
          <ErrorBoundary fallbackTitle="نظرة عامة على الأسواق">
            <TradingViewMarketOverview height={560} />
          </ErrorBoundary>

          {/* 5. Dedicated Egyptian Stock Exchange (EGX) Section */}
          <ErrorBoundary fallbackTitle="قسم البورصة المصرية">
            <EGXHub />
          </ErrorBoundary>

          {/* 6. Main Advanced Multi-Asset Interactive Chart (540px) */}
          <ErrorBoundary fallbackTitle="الشارت التفاعلي">
            <TradingViewAdvancedChart height={540} />
          </ErrorBoundary>
        </div>

        {/* Footer */}
        <footer className="w-full bg-[#080C14] border-t border-slate-800 py-8 px-4 mt-16">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-emerald-400" />
              <span className="font-bold text-slate-300">Stock Pulse © 2026</span>
              <span className="text-slate-700">•</span>
              <span>مدعوم رسمياً بمحركات وبيانات TradingView اللحظية</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/abdelghany-77/stocks-tracker"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
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
