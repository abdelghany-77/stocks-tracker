/* ============================================================
 * EgyptianGoldHub.tsx
 * Egyptian Gold Market Center & Sagha Live Calculator
 * Real-time Dynamic Gold Price feeds, one-click live refresh,
 * accurate Sagha buy/sell spread calculations, and responsive UI.
 * ============================================================ */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Coins,
  Calculator,
  RotateCw,
  Sparkles,
  ShieldCheck,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import {
  fetchLiveMarketData,
  calculateSaghaPrices,
  DEFAULT_MARKET_RATES,
  TROY_OUNCE_GRAMS,
  LiveMarketRates,
} from '@/services/marketData';

export function EgyptianGoldHub() {
  // Live market state
  const [marketData, setMarketData] = useState<LiveMarketRates>(DEFAULT_MARKET_RATES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Manual calibration overrides
  const [spotOunceUSD, setSpotOunceUSD] = useState<number>(DEFAULT_MARKET_RATES.goldOunceUSD);
  const [usdExchangeRate, setUsdExchangeRate] = useState<number>(DEFAULT_MARKET_RATES.usdEgp);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);

  // Calculator state
  const [calcKarat, setCalcKarat] = useState<string>('21k');
  const [calcWeight, setCalcWeight] = useState<number>(10);
  const [makingFeePerGram, setMakingFeePerGram] = useState<number>(85);
  const [vatTaxPercent, setVatTaxPercent] = useState<number>(2.5);

  // Function to load real-time prices
  const loadMarketData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchLiveMarketData();
      setMarketData(data);
      setSpotOunceUSD(data.goldOunceUSD);
      setUsdExchangeRate(data.usdEgp);
      setLastRefreshedAt(new Date());
    } catch (err) {
      console.error('Failed to refresh gold prices:', err);
      setErrorMessage('تعذر جلب بعض الأسعار، يتم استخدام أحدث بيانات متوفرة.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load + periodic 90s auto-refresh
  useEffect(() => {
    loadMarketData();
    const interval = setInterval(() => {
      loadMarketData();
    }, 90000);
    return () => clearInterval(interval);
  }, [loadMarketData]);

  // Compute Sagha prices dynamically
  const prices = useMemo(() => {
    return calculateSaghaPrices(spotOunceUSD, usdExchangeRate);
  }, [spotOunceUSD, usdExchangeRate]);

  // Calculator computations
  const isCoin = calcKarat === 'pound' || calcKarat === 'half_pound' || calcKarat === 'quarter_pound';
  const coinGramWeight = calcKarat === 'pound' ? 8 : calcKarat === 'half_pound' ? 4 : calcKarat === 'quarter_pound' ? 2 : 1;
  const effectiveGrams = isCoin ? calcWeight * coinGramWeight : calcWeight;

  const baseGramBuy =
    calcKarat === '24k'
      ? prices.p24Buy
      : calcKarat === '18k'
      ? prices.p18Buy
      : calcKarat === '14k'
      ? prices.p14Buy
      : prices.p21Buy;

  const baseGramSell =
    calcKarat === '24k'
      ? prices.p24Sell
      : calcKarat === '18k'
      ? prices.p18Sell
      : calcKarat === '14k'
      ? prices.p14Sell
      : prices.p21Sell;

  const rawGoldCost = effectiveGrams * baseGramBuy;
  const totalMakingFees = effectiveGrams * makingFeePerGram;
  const vatTaxAmount = (rawGoldCost + totalMakingFees) * (vatTaxPercent / 100);
  const totalPurchasePrice = rawGoldCost + totalMakingFees + vatTaxAmount;
  const totalResaleValue = effectiveGrams * baseGramSell;

  // Format relative updated time
  const timeFormatted = lastRefreshedAt.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <section id="egyptian-gold" className="space-y-6 scroll-mt-20">
      {/* Header & Live Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-inner flex-shrink-0">
            <Coins size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                مركز أسعار الذهب في مصر (Sagha Live)
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono">
                <Sparkles size={11} /> تسعير ديناميكي حي
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              الأونصة العالمية: <span className="text-amber-300 font-mono font-bold">${spotOunceUSD.toLocaleString('en-US')}</span> • سعر الصرف: <span className="text-emerald-400 font-mono font-bold">{usdExchangeRate} ج.م</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Refresh + Calibrate */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => loadMarketData()}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            title="تحديث الأسعار الآن من الأسواق العالمية"
          >
            <RotateCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'جاري التحديث...' : 'تحديث الأسعار الآن'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCalibrating(!isCalibrating)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isCalibrating
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Sliders size={14} className="text-amber-400" />
            <span className="hidden sm:inline">{isCalibrating ? 'إغلاق الضبط' : 'ضبط يدوي'}</span>
          </button>
        </div>
      </div>

      {/* Live Badge & Timestamp Banner */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-bold text-emerald-400">تغذية لحظية مباشرة:</span>
          <span className="text-slate-400 hidden sm:inline">آخر تحديث {timeFormatted}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span>1 أونصة = {TROY_OUNCE_GRAMS.toFixed(2)}g</span>
          <span>•</span>
          <span className="text-amber-400">فضة عالمية: ${marketData.silverOunceUSD}</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Manual Calibration Drawer */}
      {isCalibrating && (
        <div className="p-5 rounded-3xl bg-slate-900/95 border border-amber-500/30 shadow-2xl animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              سعر الأونصة العالمية (USD/Ounce)
            </label>
            <input
              type="number"
              step="5"
              value={spotOunceUSD}
              onChange={(e) => setSpotOunceUSD(parseFloat(e.target.value) || DEFAULT_MARKET_RATES.goldOunceUSD)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              سعر صرف الدولار بالصاغة (USD / EGP)
            </label>
            <input
              type="number"
              step="0.05"
              value={usdExchangeRate}
              onChange={(e) => setUsdExchangeRate(parseFloat(e.target.value) || DEFAULT_MARKET_RATES.usdEgp)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSpotOunceUSD(marketData.goldOunceUSD);
                setUsdExchangeRate(marketData.usdEgp);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              استعادة القيم الحية (${marketData.goldOunceUSD} / {marketData.usdEgp})
            </button>
          </div>
        </div>
      )}

      {/* Gold Karats Live Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 21K Spotlight Card */}
        <div className="col-span-2 sm:col-span-1 rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-900/95 to-slate-950 p-4 sm:p-5 border border-amber-500/40 shadow-2xl flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-300 flex items-center gap-1">
              <Sparkles size={13} /> الأكثر تداولاً
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
              عيار 21
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">سعر الشراء من المحل</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-0.5">
              {prices.p21Buy.toLocaleString('ar-EG')} <span className="text-xs font-normal">ج.م</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between pt-2 border-t border-amber-500/20">
              <span>بيع للمحل:</span>
              <span className="font-mono text-slate-200 font-bold">{prices.p21Sell.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </div>
        </div>

        {/* 24K */}
        <div className="rounded-3xl bg-slate-900/80 p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">السبائك النقية</span>
            <span className="text-[10px] font-mono font-bold text-slate-300 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/10">
              عيار 24
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">سعر الشراء</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
              {prices.p24Buy.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-400">ج.م</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between pt-1.5 border-t border-slate-800">
              <span>بيع للمحل:</span>
              <span className="font-mono text-slate-300">{prices.p24Sell.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </div>
        </div>

        {/* 18K */}
        <div className="rounded-3xl bg-slate-900/80 p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">المشغولات العصرية</span>
            <span className="text-[10px] font-mono font-bold text-slate-300 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/10">
              عيار 18
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">سعر الشراء</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
              {prices.p18Buy.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-400">ج.م</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between pt-1.5 border-t border-slate-800">
              <span>بيع للمحل:</span>
              <span className="font-mono text-slate-300">{prices.p18Sell.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </div>
        </div>

        {/* Gold Sovereign (8g 21K) */}
        <div className="rounded-3xl bg-slate-900/80 p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">جنيه الذهب (8g)</span>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              8g عيار 21
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">سعر الشراء</span>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-0.5">
              {prices.sovereignBuy.toLocaleString('ar-EG')} <span className="text-xs font-normal">ج.م</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between pt-1.5 border-t border-slate-800">
              <span>بيع للمحل:</span>
              <span className="font-mono text-slate-300">{prices.sovereignSell.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </div>
        </div>

        {/* Half Sovereign (4g 21K) */}
        <div className="rounded-3xl bg-slate-900/80 p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">نصف جنيه ذهب</span>
            <span className="text-[10px] font-mono font-bold text-slate-300 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/10">
              4g عيار 21
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">سعر الشراء</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
              {prices.halfSovereignBuy.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-400">ج.م</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between pt-1.5 border-t border-slate-800">
              <span>بيع للمحل:</span>
              <span className="font-mono text-slate-300">{prices.halfSovereignSell.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </div>
        </div>

        {/* Silver Ounce / Gram */}
        <div className="rounded-3xl bg-slate-900/80 p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">فضة عيار 925</span>
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              فضة إيطالي
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">سعر الجرام التقريبي</span>
            <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono mt-0.5">
              {Math.round(((marketData.silverOunceUSD / TROY_OUNCE_GRAMS) * usdExchangeRate * 0.925) + 8).toLocaleString('ar-EG')}{' '}
              <span className="text-xs font-normal text-slate-400">ج.م</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between pt-1.5 border-t border-slate-800">
              <span>الأونصة:</span>
              <span className="font-mono text-slate-300">${marketData.silverOunceUSD}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Sagha Calculator */}
      <div id="calculator" className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950 p-5 sm:p-7 md:p-8 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 flex-shrink-0">
            <Calculator size={22} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              حاسبة الذهب والمصنعية والدمغة الرسمية
              <ShieldCheck size={18} className="text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400">
              احسب التكلفة الدقيقة للشراء بالمصنعية والضريبة أو القيمة الصافية للبيع الفوري للصاغة
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Inputs Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">النوع / العيار</label>
                <select
                  value={calcKarat}
                  onChange={(e) => setCalcKarat(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="21k">ذهب عيار 21 (الأكثر انتشاراً)</option>
                  <option value="24k">ذهب عيار 24 (السبائك النقية)</option>
                  <option value="18k">ذهب عيار 18 (المشغولات)</option>
                  <option value="14k">ذهب عيار 14</option>
                  <option value="pound">جنيه ذهب (8 جرام عيار 21)</option>
                  <option value="half_pound">نصف جنيه ذهب (4 جرام)</option>
                  <option value="quarter_pound">ربع جنيه ذهب (2 جرام)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {isCoin ? 'العدد (قطع)' : 'الوزن الإجمالي (جرام)'}
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-base font-bold font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">مصنعية الجرام (ج.م)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={makingFeePerGram}
                  onChange={(e) => setMakingFeePerGram(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-base font-bold font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">الدمغة وضريبة القيمة المضافة (%)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={vatTaxPercent}
                  onChange={(e) => setVatTaxPercent(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-base font-bold font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Quick Weight Presets */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap pt-1">
              <span className="text-xs text-slate-400">أوزان شائعة:</span>
              {[2.5, 5, 10, 20, 31.1, 50, 100].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setCalcWeight(w)}
                  className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border font-mono transition-all active:scale-95 ${
                    calcWeight === w
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {w === 31.1 ? 'أونصة (31.1g)' : `${w}g`}
                </button>
              ))}
            </div>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-950 p-5 sm:p-6 border border-amber-500/30 flex flex-col justify-between space-y-4 shadow-inner">
            <div>
              <span className="text-xs text-slate-400 block mb-1">
                إجمالي تكلفة الشراء (تدفعها للمحل شاملة المصنعية والضريبة):
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                {totalPurchasePrice.toLocaleString('ar-EG', { maximumFractionDigits: 0 })}{' '}
                <span className="text-sm font-normal text-amber-400/80">ج.م</span>
              </div>

              <div className="text-xs text-slate-400 mt-3 space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span>• قيمة الذهب الخالص:</span>
                  <span className="font-mono text-slate-200">{rawGoldCost.toLocaleString('ar-EG')} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>• إجمالي المصنعية:</span>
                  <span className="font-mono text-amber-300">{totalMakingFees.toLocaleString('ar-EG')} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>• الدمغة والضريبة ({vatTaxPercent}%):</span>
                  <span className="font-mono text-slate-200">{vatTaxAmount.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">
                القيمة التقديرية الصافية عند إعادة البيع للمحل:
              </span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {totalResaleValue.toLocaleString('ar-EG', { maximumFractionDigits: 0 })}{' '}
                <span className="text-xs font-normal text-slate-400">ج.م</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                (بدون احتساب المصنعية أو الضريبة — على أساس وزن صافي {effectiveGrams} جرام)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
