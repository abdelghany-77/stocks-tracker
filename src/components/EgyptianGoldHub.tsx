/* ============================================================
 * EgyptianGoldHub.tsx
 * Egyptian Gold Market Center & Sagha Calculator
 * Formula-based live calculations:
 * - 1 Troy Ounce = 31.1035 grams
 * - 24K = (XAUUSD / 31.1035) * USDEGP
 * - 21K = 24K * (21 / 24)
 * - 18K = 24K * (18 / 24)
 * - Sovereign = 21K * 8 (Half = 21K * 4, Quarter = 21K * 2)
 * ============================================================ */

import { useState, useMemo } from 'react';
import {
  Coins,
  Calculator,
  Sliders,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const TROY_OUNCE_GRAMS = 31.1035;
export const DEFAULT_OUNCE_USD = 4610.00;
export const DEFAULT_USD_EGP = 50.83;

export function EgyptianGoldHub() {
  // Calibration parameters
  const [spotOunceUSD, setSpotOunceUSD] = useState<number>(DEFAULT_OUNCE_USD);
  const [usdExchangeRate, setUsdExchangeRate] = useState<number>(DEFAULT_USD_EGP);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Calculator state
  const [calcKarat, setCalcKarat] = useState<'21k' | '24k' | '18k' | 'pound' | 'half_pound' | 'quarter_pound'>('21k');
  const [calcWeight, setCalcWeight] = useState<number>(10);
  const [makingFeePerGram, setMakingFeePerGram] = useState<number>(85); // Sagha craftsmanship fee in EGP
  const [vatTaxPercent, setVatTaxPercent] = useState<number>(2.5); // Stamp duty & VAT %

  // Dynamic mathematical formulas
  const prices = useMemo(() => {
    const raw24k = (spotOunceUSD / TROY_OUNCE_GRAMS) * usdExchangeRate;
    const raw21k = raw24k * (21 / 24);
    const raw18k = raw24k * (18 / 24);

    const spread24 = 35;
    const spread21 = 30;
    const spread18 = 25;

    const p24Buy = Math.round(raw24k + spread24 / 2);
    const p24Sell = Math.round(raw24k - spread24 / 2);

    const p21Buy = Math.round(raw21k + spread21 / 2);
    const p21Sell = Math.round(raw21k - spread21 / 2);

    const p18Buy = Math.round(raw18k + spread18 / 2);
    const p18Sell = Math.round(raw18k - spread18 / 2);

    const sovereignBuy = p21Buy * 8;
    const sovereignSell = p21Sell * 8;

    const halfSovereignBuy = p21Buy * 4;
    const halfSovereignSell = p21Sell * 4;

    const quarterSovereignBuy = p21Buy * 2;
    const quarterSovereignSell = p21Sell * 2;

    return {
      p24Buy,
      p24Sell,
      p21Buy,
      p21Sell,
      p18Buy,
      p18Sell,
      sovereignBuy,
      sovereignSell,
      halfSovereignBuy,
      halfSovereignSell,
      quarterSovereignBuy,
      quarterSovereignSell,
    };
  }, [spotOunceUSD, usdExchangeRate]);

  // Calculator calculations
  const isCoin = calcKarat === 'pound' || calcKarat === 'half_pound' || calcKarat === 'quarter_pound';
  const coinWeight = calcKarat === 'pound' ? 8 : calcKarat === 'half_pound' ? 4 : 2;
  const effectiveGrams = isCoin ? calcWeight * coinWeight : calcWeight;

  const baseGramBuy =
    calcKarat === '24k'
      ? prices.p24Buy
      : calcKarat === '18k'
      ? prices.p18Buy
      : prices.p21Buy;

  const baseGramSell =
    calcKarat === '24k'
      ? prices.p24Sell
      : calcKarat === '18k'
      ? prices.p18Sell
      : prices.p21Sell;

  const rawGoldCost = effectiveGrams * baseGramBuy;
  const totalMakingFees = effectiveGrams * makingFeePerGram;
  const vatTaxAmount = (rawGoldCost + totalMakingFees) * (vatTaxPercent / 100);
  const totalPurchasePrice = rawGoldCost + totalMakingFees + vatTaxAmount;
  const totalResaleValue = effectiveGrams * baseGramSell;

  return (
    <section id="egyptian-gold" className="space-y-8">
      {/* Header & Math Indicator */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-inner">
            <Coins size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              مركز أسعار الذهب في مصر (Sagha Hub)
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                تسعير رياضي دقيق
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              محسوب بالمعادلة الرسمية: (سعر الأونصة ${spotOunceUSD.toLocaleString('en-US')} ÷ {TROY_OUNCE_GRAMS}g) × {usdExchangeRate} ج.م للدولار
            </p>
          </div>
        </div>

        {/* Calibration button */}
        <button
          type="button"
          onClick={() => setIsCalibrating(!isCalibrating)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
            isCalibrating
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/30'
          }`}
        >
          <Sliders size={14} className="text-amber-400" />
          <span>{isCalibrating ? 'إغلاق المعايرة' : 'معايرة الأونصة وسعر الصرف'}</span>
        </button>
      </div>

      {/* Calibration Drawer */}
      {isCalibrating && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-2xl animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              سعر الأونصة العالمية فوري (USD/Ounce)
            </label>
            <input
              type="number"
              step="10"
              value={spotOunceUSD}
              onChange={(e) => setSpotOunceUSD(parseFloat(e.target.value) || DEFAULT_OUNCE_USD)}
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
              onChange={(e) => setUsdExchangeRate(parseFloat(e.target.value) || DEFAULT_USD_EGP)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSpotOunceUSD(DEFAULT_OUNCE_USD);
                setUsdExchangeRate(DEFAULT_USD_EGP);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              استعادة القيم الافتراضية ($4,610 / 50.83)
            </button>
          </div>
        </div>
      )}

      {/* Gold Karats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 21K Spotlight */}
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-900/90 to-slate-950 p-5 border border-amber-500/40 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-300 flex items-center gap-1">
              <Sparkles size={13} /> الأكثر تداولاً
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              عيار 21
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">سعر البيع للصاغة</span>
            <div className="text-3xl font-black text-amber-300 font-mono mt-0.5">
              {prices.p21Sell.toLocaleString('ar-EG')} <span className="text-xs font-normal">ج.م</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">شراء المحل: {prices.p21Buy.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>

        {/* 24K */}
        <div className="rounded-3xl bg-slate-900/90 p-5 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">السبائك النقية</span>
            <span className="text-[10px] font-mono font-bold text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
              عيار 24
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">سعر البيع للصاغة</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {prices.p24Sell.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-500">ج.م</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">شراء المحل: {prices.p24Buy.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>

        {/* 18K */}
        <div className="rounded-3xl bg-slate-900/90 p-5 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">المشغولات العصرية</span>
            <span className="text-[10px] font-mono font-bold text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
              عيار 18
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">سعر البيع للصاغة</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {prices.p18Sell.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-500">ج.م</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">شراء المحل: {prices.p18Buy.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>

        {/* Sovereign (8g) */}
        <div className="rounded-3xl bg-slate-900/90 p-5 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">جنيه الذهب (8g)</span>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              8g عيار 21
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">سعر البيع</span>
            <div className="text-2xl font-black text-amber-300 font-mono mt-0.5">
              {prices.sovereignSell.toLocaleString('ar-EG')} <span className="text-xs font-normal">ج.م</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">شراء: {prices.sovereignBuy.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>

        {/* Half Sovereign (4g) */}
        <div className="rounded-3xl bg-slate-900/90 p-5 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">نصف جنيه ذهب</span>
            <span className="text-[10px] font-mono font-bold text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
              4g عيار 21
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">سعر البيع</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {prices.halfSovereignSell.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-500">ج.م</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">شراء: {prices.halfSovereignBuy.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>

        {/* Quarter Sovereign (2g) */}
        <div className="rounded-3xl bg-slate-900/90 p-5 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">ربع جنيه ذهب</span>
            <span className="text-[10px] font-mono font-bold text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
              2g عيار 21
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">سعر البيع</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {prices.quarterSovereignSell.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-500">ج.م</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">شراء: {prices.quarterSovereignBuy.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>
      </div>

      {/* Comprehensive Sagha Calculator */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 md:p-8 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
            <Calculator size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              حاسبة الذهب والمصنعية والدمغة الرسمية
              <ShieldCheck size={18} className="text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400">احسب التكلفة الإجمالية للشراء بالمصنعية والضريبة أو القيمة الصافية للبيع للصاغة</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">النوع / العيار</label>
                <select
                  value={calcKarat}
                  onChange={(e) => setCalcKarat(e.target.value as any)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="21k">ذهب عيار 21</option>
                  <option value="24k">ذهب عيار 24</option>
                  <option value="18k">ذهب عيار 18</option>
                  <option value="pound">جنيه ذهب (8g)</option>
                  <option value="half_pound">نصف جنيه (4g)</option>
                  <option value="quarter_pound">ربع جنيه (2g)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {isCoin ? 'العدد (قطع)' : 'الوزن بالجرام'}
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
                <label className="block text-xs font-bold text-slate-300 mb-2">الدمغة والضريبة (%)</label>
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

            {/* Quick Weight Chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs text-slate-400">أوزان شائعة:</span>
              {[5, 10, 20, 31.1, 50, 100].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setCalcWeight(w)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-all ${
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

          {/* Results Output */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-950 p-6 border border-amber-500/30 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1">إجمالي سعر الشراء (تدفعه للمحل شامل المصنعية والدمغة):</span>
              <div className="text-3xl font-black text-amber-300 font-mono">
                {totalPurchasePrice.toLocaleString('ar-EG', { maximumFractionDigits: 0 })}{' '}
                <span className="text-sm font-normal text-amber-400/80">ج.م</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
                <div>• قيمة الذهب الخالص: {rawGoldCost.toLocaleString('ar-EG')} ج.م</div>
                <div>• إجمالي المصنعية: {totalMakingFees.toLocaleString('ar-EG')} ج.م</div>
                <div>• الدمغة والضريبة ({vatTaxPercent}%): {vatTaxAmount.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">القيمة التقريبية الصافية عند البيع للصاغة:</span>
              <div className="text-2xl font-black text-white font-mono">
                {totalResaleValue.toLocaleString('ar-EG', { maximumFractionDigits: 0 })}{' '}
                <span className="text-xs font-normal text-slate-400">ج.م</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                (بدون مصنعية أو ضريبة — على أساس وزن صافي {effectiveGrams} جرام)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
