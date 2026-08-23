/* ============================================================
 * marketData.ts
 * Live Financial & Metals Data Service
 * Fetches real-time Gold Spot (XAU/USD), Silver (XAG/USD),
 * and official Exchange Rates (USD/EGP, EUR/EGP, SAR/EGP, AED/EGP)
 * ============================================================ */

export interface LiveMarketRates {
  goldOunceUSD: number;
  silverOunceUSD: number;
  usdEgp: number;
  eurEgp: number;
  sarEgp: number;
  aedEgp: number;
  gbpEgp: number;
  lastUpdated: Date;
  isLive: boolean;
  source: string;
}

// Resilient default baseline in case network is disconnected
export const DEFAULT_MARKET_RATES: LiveMarketRates = {
  goldOunceUSD: 4605.00,
  silverOunceUSD: 69.10,
  usdEgp: 50.88,
  eurEgp: 54.80,
  sarEgp: 13.56,
  aedEgp: 13.85,
  gbpEgp: 65.20,
  lastUpdated: new Date(),
  isLive: false,
  source: 'القيم الافتراضية المرجعية',
};

export const TROY_OUNCE_GRAMS = 31.1034768;

/**
 * Fetches live gold price and currency exchange rates
 */
export async function fetchLiveMarketData(): Promise<LiveMarketRates> {
  let goldPrice = DEFAULT_MARKET_RATES.goldOunceUSD;
  let silverPrice = DEFAULT_MARKET_RATES.silverOunceUSD;
  let usdEgpRate = DEFAULT_MARKET_RATES.usdEgp;
  let eurEgpRate = DEFAULT_MARKET_RATES.eurEgp;
  let sarEgpRate = DEFAULT_MARKET_RATES.sarEgp;
  let aedEgpRate = DEFAULT_MARKET_RATES.aedEgp;
  let gbpEgpRate = DEFAULT_MARKET_RATES.gbpEgp;
  let isLive = false;
  let source = 'بيانات حية مباشرة';

  // 1. Fetch Exchange Rates (USD -> EGP, EUR, SAR, AED, GBP)
  try {
    const fxRes = await fetch('https://open.er-api.com/v6/latest/USD', {
      headers: { Accept: 'application/json' },
    });
    if (fxRes.ok) {
      const fxData = await fxRes.json();
      if (fxData.rates) {
        const rates = fxData.rates;
        const egp = rates.EGP || DEFAULT_MARKET_RATES.usdEgp;
        usdEgpRate = egp;

        // Cross rates relative to EGP
        if (rates.EUR) eurEgpRate = Number((egp / rates.EUR).toFixed(2));
        if (rates.SAR) sarEgpRate = Number((egp / rates.SAR).toFixed(2));
        if (rates.AED) aedEgpRate = Number((egp / rates.AED).toFixed(2));
        if (rates.GBP) gbpEgpRate = Number((egp / rates.GBP).toFixed(2));
        isLive = true;
      }
    }
  } catch (err) {
    console.warn('FX fetch failed, continuing with fallback:', err);
  }

  // 2. Fetch Gold & Silver Prices (XAU/USD, XAG/USD)
  try {
    const [goldRes, silverRes] = await Promise.allSettled([
      fetch('https://api.gold-api.com/price/XAU'),
      fetch('https://api.gold-api.com/price/XAG'),
    ]);

    if (goldRes.status === 'fulfilled' && goldRes.value.ok) {
      const gData = await goldRes.value.json();
      if (gData.price && typeof gData.price === 'number') {
        goldPrice = gData.price;
        isLive = true;
      }
    } else {
      // Fallback to Binance PAXG (backed 1:1 by gold ounce)
      try {
        const binanceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT');
        if (binanceRes.ok) {
          const bData = await binanceRes.json();
          if (bData.price) {
            goldPrice = parseFloat(bData.price);
            isLive = true;
            source = 'Binance PAXG Spot';
          }
        }
      } catch {
        // Continue with baseline
      }
    }

    if (silverRes.status === 'fulfilled' && silverRes.value.ok) {
      const sData = await silverRes.value.json();
      if (sData.price && typeof sData.price === 'number') {
        silverPrice = sData.price;
      }
    }
  } catch (err) {
    console.warn('Metals fetch failed, continuing with fallback:', err);
  }

  return {
    goldOunceUSD: Number(goldPrice.toFixed(2)),
    silverOunceUSD: Number(silverPrice.toFixed(2)),
    usdEgp: Number(usdEgpRate.toFixed(2)),
    eurEgp: Number(eurEgpRate.toFixed(2)),
    sarEgp: Number(sarEgpRate.toFixed(2)),
    aedEgp: Number(aedEgpRate.toFixed(2)),
    gbpEgp: Number(gbpEgpRate.toFixed(2)),
    lastUpdated: new Date(),
    isLive,
    source,
  };
}

/**
 * Calculates Egyptian Sagha gold prices based on official formulas
 */
export function calculateSaghaPrices(goldOunceUSD: number, usdEgp: number) {
  // Official Gold 24K per gram base formula
  const raw24k = (goldOunceUSD / TROY_OUNCE_GRAMS) * usdEgp;
  const raw21k = raw24k * (21 / 24);
  const raw18k = raw24k * (18 / 24);
  const raw14k = raw24k * (14 / 24);

  // Sagha Buy/Sell spread (فرق سعر الشراء والبيع المعتاد بالصاغة)
  const spread24 = 35;
  const spread21 = 30;
  const spread18 = 25;
  const spread14 = 20;

  // Local market retail buy (سعر شراء المستهلك من المحل) & sell (سعر بيع المستهلك للمحل)
  const p24Buy = Math.round(raw24k + spread24 / 2);
  const p24Sell = Math.round(raw24k - spread24 / 2);

  const p21Buy = Math.round(raw21k + spread21 / 2);
  const p21Sell = Math.round(raw21k - spread21 / 2);

  const p18Buy = Math.round(raw18k + spread18 / 2);
  const p18Sell = Math.round(raw18k - spread18 / 2);

  const p14Buy = Math.round(raw14k + spread14 / 2);
  const p14Sell = Math.round(raw14k - spread14 / 2);

  // Sovereign coin (8 grams 21K)
  const sovereignBuy = p21Buy * 8;
  const sovereignSell = p21Sell * 8;

  // Half Sovereign (4 grams 21K)
  const halfSovereignBuy = p21Buy * 4;
  const halfSovereignSell = p21Sell * 4;

  // Quarter Sovereign (2 grams 21K)
  const quarterSovereignBuy = p21Buy * 2;
  const quarterSovereignSell = p21Sell * 2;

  // Gold Ounce in EGP
  const ounceEgpBuy = Math.round(goldOunceUSD * usdEgp);
  const ounceEgpSell = Math.round(ounceEgpBuy - 300);

  return {
    raw24k: Math.round(raw24k),
    raw21k: Math.round(raw21k),
    raw18k: Math.round(raw18k),
    raw14k: Math.round(raw14k),
    p24Buy,
    p24Sell,
    p21Buy,
    p21Sell,
    p18Buy,
    p18Sell,
    p14Buy,
    p14Sell,
    sovereignBuy,
    sovereignSell,
    halfSovereignBuy,
    halfSovereignSell,
    quarterSovereignBuy,
    quarterSovereignSell,
    ounceEgpBuy,
    ounceEgpSell,
  };
}

/**
 * Checks Egyptian Exchange (EGX) trading session status (Sunday to Thursday, 10:00 to 14:30 Cairo time)
 */
export function getEGXMarketStatus(): { isOpen: boolean; text: string; timeDetails: string } {
  try {
    const cairoDate = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' })
    );
    const day = cairoDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 4 = Thursday, 5 = Friday, 6 = Saturday
    const hours = cairoDate.getHours();
    const minutes = cairoDate.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Working days: Sunday (0) to Thursday (4)
    const isWorkday = day >= 0 && day <= 4;
    // Trading hours: 10:00 AM (600 mins) to 2:30 PM (870 mins)
    const isTradingHours = totalMinutes >= 600 && totalMinutes <= 870;

    if (isWorkday && isTradingHours) {
      return {
        isOpen: true,
        text: 'جلسة التداول مفتوحة (EGX Live)',
        timeDetails: 'جلسة البورصة مستمرة حتى 02:30 م',
      };
    }

    if (isWorkday) {
      if (totalMinutes < 600) {
        return {
          isOpen: false,
          text: 'السوق مغلق (قبل الجلسة)',
          timeDetails: 'تبدأ الجلسة الساعة 10:00 ص بتوقيت القاهرة',
        };
      }
      return {
        isOpen: false,
        text: 'جلسة اليوم منتهية',
        timeDetails: 'أغلقت الجلسة الساعة 02:30 م',
      };
    }

    return {
      isOpen: false,
      text: 'عطلة أسبوعية للبورصة المصرية',
      timeDetails: 'تستأنف الجلسات الأحد 10:00 ص',
    };
  } catch {
    return {
      isOpen: false,
      text: 'البورصة المصرية EGX',
      timeDetails: '10:00 ص - 02:30 م (الأحد - الخميس)',
    };
  }
}
