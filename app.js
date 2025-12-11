const GOLD_API =
  "https://api.metalpriceapi.com/v1/latest?api_key=demo&base=XAU&currencies=USD,EUR,GBP";
const GOLD_API_FALLBACK = "https://api.frankfurter.app/latest?from=XAU&to=USD";
const BTC_API =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,gbp,egp,sar,aed&include_24hr_change=true&include_market_cap=true";
const EXCHANGE_RATES_API = "https://api.frankfurter.app/latest?from=USD";

// Currency symbols
const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  EGP: "ج.م",
  SAR: "ر.س",
  AED: "د.إ",
};

// Karat percentages
const karatPurity = {
  24: 1.0, // 100% pure (24/24)
  22: 0.9167, // 91.67% (22/24)
  21: 0.875, // 87.5% (21/24)
  18: 0.75, // 75% (18/24)
  14: 0.5833, // 58.33% (14/24)
  12: 0.5, // 50% (12/24)
  10: 0.4167, // 41.67% (10/24)
};

// Store prices globally
let globalPrices = {
  goldOunceUSD: 0,
  goldChange24h: 0,
  goldSource: "loading", // "live" or "fallback"
  btcUSD: 0,
  btcChange24h: 0,
  btcMarketCap: 0,
  exchangeRates: { USD: 1 },
};

// DOM Elements
const elements = {
  updateTime: document.getElementById("updateTime"),
  refreshBtn: document.getElementById("refreshBtn"),
  // Gold table elements
  goldGramSell: document.getElementById("goldGramSell"),
  goldOunceSell: document.getElementById("goldOunceSell"),
  goldKgSell: document.getElementById("goldKgSell"),
  goldGramBuy: document.getElementById("goldGramBuy"),
  goldOunceBuy: document.getElementById("goldOunceBuy"),
  goldKgBuy: document.getElementById("goldKgBuy"),
  goldChange: document.getElementById("goldChange"),
  goldSource: document.getElementById("goldSource"),
  // Egyptian Gold Pound elements
  egyptGoldPoundPrice: document.getElementById("egyptGoldPoundPrice"),
  egyptGoldPoundSell: document.getElementById("egyptGoldPoundSell"),
  egyptGoldPoundBuy: document.getElementById("egyptGoldPoundBuy"),
  btcPrice: document.getElementById("btcPrice"),
  btcSatoshi: document.getElementById("btcSatoshi"),
  btcMarketCap: document.getElementById("btcMarketCap"),
  btcChange: document.getElementById("btcChange"),
  calcWeight: document.getElementById("calcWeight"),
  calcUnit: document.getElementById("calcUnit"),
  calcKarat: document.getElementById("calcKarat"),
  calcResult: document.getElementById("calcResult"),
  weightDecBtn: document.getElementById("weightDecrement"),
  weightIncBtn: document.getElementById("weightIncrement"),
  // Chart price headers
  chartGoldPrice: document.getElementById("chartGoldPrice"),
  chartGoldChange: document.getElementById("chartGoldChange"),
  chartBtcPrice: document.getElementById("chartBtcPrice"),
  chartBtcChange: document.getElementById("chartBtcChange"),
  // Gold Info Section (Arabic) elements - Buy/Sell for all karats
  gold18kBuyInfo: document.getElementById("gold18kBuy"),
  gold18kSellInfo: document.getElementById("gold18kSell"),
  gold21kBuyInfo: document.getElementById("gold21kBuy"),
  gold21kSellInfo: document.getElementById("gold21kSell"),
  gold22kBuyInfo: document.getElementById("gold22kBuy"),
  gold22kSellInfo: document.getElementById("gold22kSell"),
  gold24kBuyInfo: document.getElementById("gold24kBuy"),
  gold24kSellInfo: document.getElementById("gold24kSell"),
  goldPoundEGPInfo: document.getElementById("goldPoundEGP"),
  goldOunceUSDInfo: document.getElementById("goldOunceUSD"),
  usdEGPInfo: document.getElementById("usdEGP"),
};

// Format currency
function formatCurrency(amount, currency = "USD") {
  const symbol = currencySymbols[currency] || "$";
  if (amount >= 1e12) {
    return `${symbol}${(amount / 1e12).toFixed(2)}T`;
  } else if (amount >= 1e9) {
    return `${symbol}${(amount / 1e9).toFixed(2)}B`;
  } else if (amount >= 1e6) {
    return `${symbol}${(amount / 1e6).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `${symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } else if (amount < 0.01) {
    return `${symbol}${amount.toFixed(8)}`;
  } else {
    return `${symbol}${amount.toFixed(2)}`;
  }
}

// Format percentage change
function formatChange(change) {
  const prefix = change >= 0 ? "+" : "";
  return `${prefix}${change.toFixed(2)}%`;
}

// Debounce utility for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Update time display
function updateTimeDisplay() {
  const now = new Date();
  elements.updateTime.textContent = now.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Fetch exchange rates
async function fetchExchangeRates() {
  try {
    const response = await fetch(EXCHANGE_RATES_API);
    const data = await response.json();
    globalPrices.exchangeRates = { USD: 1, ...data.rates };

    // Add EGP, SAR, AED if not available (current rates as of Dec 2, 2025 from goldpricez.com)
    if (!globalPrices.exchangeRates.EGP) {
      globalPrices.exchangeRates.EGP = 50.85; // Current USD/EGP rate
    }
    if (!globalPrices.exchangeRates.SAR) {
      globalPrices.exchangeRates.SAR = 3.75; // Fixed rate
    }
    if (!globalPrices.exchangeRates.AED) {
      globalPrices.exchangeRates.AED = 3.67; // Fixed rate
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // Fallback rates (Dec 2, 2025)
    globalPrices.exchangeRates = {
      USD: 1,
      EUR: 0.95,
      GBP: 0.79,
      EGP: 50.85,
      SAR: 3.75,
      AED: 3.67,
    };
  }

  // Try to fetch live EGP rate from exchangerate-api
  try {
    const egpResponse = await fetch("https://open.er-api.com/v6/latest/USD");
    const egpData = await egpResponse.json();
    if (egpData && egpData.rates && egpData.rates.EGP) {
      globalPrices.exchangeRates.EGP = egpData.rates.EGP;
      console.log("Live EGP rate:", globalPrices.exchangeRates.EGP);
    }
  } catch (error) {
    console.log("Using fallback EGP rate");
  }
}

// Fetch gold price from multiple sources
async function fetchGoldPrice() {
  // Try multiple APIs for real-time gold price

  // API 1: Try CoinGecko for Tether Gold (XAUT) - pegged 1:1 to gold ounce
  // This is more reliable as CoinGecko has good CORS support
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=usd&include_24hr_change=true"
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data["tether-gold"] && data["tether-gold"].usd) {
        globalPrices.goldOunceUSD = data["tether-gold"].usd;
        globalPrices.goldChange24h = data["tether-gold"].usd_24h_change || 0;
        globalPrices.goldSource = "live";
        console.log(
          "Gold price from CoinGecko (XAUT):",
          globalPrices.goldOunceUSD
        );
        return;
      }
    }
  } catch (error) {
    console.error("CoinGecko XAUT API error:", error);
  }

  // API 2: Try PAX Gold (PAXG) - another gold-backed token
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd&include_24hr_change=true"
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data["pax-gold"] && data["pax-gold"].usd) {
        globalPrices.goldOunceUSD = data["pax-gold"].usd;
        globalPrices.goldChange24h = data["pax-gold"].usd_24h_change || 0;
        globalPrices.goldSource = "live";
        console.log(
          "Gold price from CoinGecko (PAXG):",
          globalPrices.goldOunceUSD
        );
        return;
      }
    }
  } catch (error) {
    console.error("CoinGecko PAXG API error:", error);
  }

  // API 3: Try metals.live API
  try {
    const response = await fetch("https://api.metals.live/v1/spot/gold");
    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0 && data[0].price) {
        globalPrices.goldOunceUSD = data[0].price;
        globalPrices.goldChange24h = 0;
        globalPrices.goldSource = "live";
        console.log("Gold price from metals.live:", globalPrices.goldOunceUSD);
        return;
      }
    }
  } catch (error) {
    console.error("Metals.live API error:", error);
  }

  // Fallback: Use current market price (December 2, 2025)
  // Gold spot price around $2,650 per troy ounce
  globalPrices.goldOunceUSD = 2650;
  globalPrices.goldChange24h = 0;
  globalPrices.goldSource = "fallback";
  console.log("Using fallback gold price:", globalPrices.goldOunceUSD);
}

// Fetch BTC price
async function fetchBTCPrice() {
  try {
    const response = await fetch(BTC_API);
    const data = await response.json();

    if (data.bitcoin) {
      globalPrices.btcUSD = data.bitcoin.usd || 0;
      globalPrices.btcChange24h = data.bitcoin.usd_24h_change || 0;
      globalPrices.btcMarketCap = data.bitcoin.usd_market_cap || 0;
    }
  } catch (error) {
    console.error("Error fetching BTC price:", error);
  }
}

// Convert USD to selected currency
function convertCurrency(amountUSD, toCurrency) {
  const rate = globalPrices.exchangeRates[toCurrency] || 1;
  return amountUSD * rate;
}

// Update gold display
function updateGoldDisplay() {
  const currency = "EGP"; // Hardcoded to Egyptian Pound
  const goldOunceUSD = globalPrices.goldOunceUSD;

  // Convert to selected currency
  const goldOunce = convertCurrency(goldOunceUSD, currency);
  const goldGram = goldOunce / 31.1035; // Troy ounce to gram
  const goldKg = goldGram * 1000;

  // Calculate buy/sell prices (sell is slightly higher, buy is slightly lower)
  const spread = 0.01; // 1% spread
  const goldGramSell = goldGram * (1 + spread);
  const goldGramBuy = goldGram * (1 - spread);
  const goldOunceSell = goldOunce * (1 + spread);
  const goldOunceBuy = goldOunce * (1 - spread);
  const goldKgSell = goldKg * (1 + spread);
  const goldKgBuy = goldKg * (1 - spread);

  // Update table cells
  if (elements.goldGramSell)
    elements.goldGramSell.textContent = formatCurrency(goldGramSell, currency);
  if (elements.goldOunceSell)
    elements.goldOunceSell.textContent = formatCurrency(
      goldOunceSell,
      currency
    );
  if (elements.goldKgSell)
    elements.goldKgSell.textContent = formatCurrency(goldKgSell, currency);
  if (elements.goldGramBuy)
    elements.goldGramBuy.textContent = formatCurrency(goldGramBuy, currency);
  if (elements.goldOunceBuy)
    elements.goldOunceBuy.textContent = formatCurrency(goldOunceBuy, currency);
  if (elements.goldKgBuy)
    elements.goldKgBuy.textContent = formatCurrency(goldKgBuy, currency);

  // Update chart price header (always show in USD for gold)
  if (elements.chartGoldPrice) {
    elements.chartGoldPrice.textContent = goldOunceUSD.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }
    );
  }
  if (elements.chartGoldChange) {
    // Use actual gold change from API
    const goldChange = globalPrices.goldChange24h;
    const changeValue = ((goldOunceUSD * Math.abs(goldChange)) / 100).toFixed(
      2
    );
    elements.chartGoldChange.textContent = `${
      goldChange >= 0 ? "+" : ""
    }${goldChange.toFixed(2)}% (${changeValue})`;
    elements.chartGoldChange.className = `chart-price-change ${
      goldChange >= 0 ? "positive" : "negative"
    }`;
  }

  // Update karat prices (using base gold gram price) - skip if elements don't exist
  Object.keys(karatPurity).forEach((karat) => {
    const karatElement = document.getElementById(`gold${karat}k`);
    // Skip if this is the Arabic info section element (handled separately)
    if (
      karatElement &&
      !["gold12k", "gold18k", "gold21k", "gold22k", "gold24k"].includes(
        `gold${karat}k`
      )
    ) {
      const karatPrice = goldGram * karatPurity[karat];
      karatElement.textContent = formatCurrency(karatPrice, currency);
    }
  });

  // Gold change - only update if element exists
  if (elements.goldChange) {
    const changeElement = elements.goldChange.querySelector(".change-value");
    if (changeElement) {
      const goldChangePercent = globalPrices.goldChange24h;
      changeElement.textContent = formatChange(goldChangePercent);
      changeElement.className = `change-value ${
        goldChangePercent >= 0 ? "positive" : "negative"
      }`;
    }
  }

  // Egyptian Gold Pound (جنيه ذهب) - 8 grams of 21K gold
  const egpRate = globalPrices.exchangeRates.EGP || 47.5;
  const goldGramUSD = goldOunceUSD / 31.1035;
  const gold21kGramUSD = goldGramUSD * karatPurity[21]; // 21K purity
  const egyptGoldPoundUSD = gold21kGramUSD * 8; // 8 grams
  const egyptGoldPoundEGP = egyptGoldPoundUSD * egpRate;

  // Apply spread for buy/sell
  const egyptGoldPoundSellEGP = egyptGoldPoundEGP * (1 + spread);
  const egyptGoldPoundBuyEGP = egyptGoldPoundEGP * (1 - spread);

  if (elements.egyptGoldPoundPrice) {
    elements.egyptGoldPoundPrice.textContent = `ج.م ${egyptGoldPoundEGP.toLocaleString(
      undefined,
      { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    )}`;
  }
  if (elements.egyptGoldPoundSell) {
    elements.egyptGoldPoundSell.textContent = `ج.م ${egyptGoldPoundSellEGP.toLocaleString(
      undefined,
      { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    )}`;
  }
  if (elements.egyptGoldPoundBuy) {
    elements.egyptGoldPoundBuy.textContent = `ج.م ${egyptGoldPoundBuyEGP.toLocaleString(
      undefined,
      { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    )}`;
  }

  // Update data source indicator
  if (elements.goldSource) {
    const dot = elements.goldSource.querySelector(".source-dot");
    const text = elements.goldSource.querySelector(".source-text");
    const source = globalPrices.goldSource;

    if (dot) {
      dot.className = `source-dot ${source}`;
    }
    if (text) {
      if (source === "live") {
        text.textContent = "Live data";
        text.className = "source-text live";
      } else if (source === "fallback") {
        text.textContent = "Cached price (APIs unavailable)";
        text.className = "source-text fallback";
      } else {
        text.textContent = "Loading...";
        text.className = "source-text";
      }
    }
  }

  // Update Gold Info Section (Arabic prices in EGP)
  updateGoldInfoSection();
}

// Update Gold Info Section with live Egyptian gold prices
function updateGoldInfoSection() {
  const egpRate = globalPrices.exchangeRates.EGP || 50.85;
  const goldOunceUSD = globalPrices.goldOunceUSD;

  // Skip if gold price not loaded yet
  if (!goldOunceUSD || goldOunceUSD === 0) {
    return;
  }

  const goldGramUSD = goldOunceUSD / 31.1035;

  // Calculate prices for each karat in EGP per gram
  const gold24kEGP = goldGramUSD * karatPurity[24] * egpRate;
  const gold22kEGP = goldGramUSD * karatPurity[22] * egpRate;
  const gold21kEGP = goldGramUSD * karatPurity[21] * egpRate;
  const gold18kEGP = goldGramUSD * karatPurity[18] * egpRate;

  // Sell price is slightly lower (what shops buy from you)
  // Buy price is slightly higher (what you pay to shops)
  const spreadSell = 0.005; // 0.5% spread for sell
  const spreadBuy = 0.005; // 0.5% spread for buy

  // Calculate buy and sell prices for each karat
  const gold18kBuyEGP = gold18kEGP * (1 + spreadBuy);
  const gold18kSellEGP = gold18kEGP * (1 - spreadSell);

  const gold21kBuyEGP = gold21kEGP * (1 + spreadBuy);
  const gold21kSellEGP = gold21kEGP * (1 - spreadSell);

  const gold22kBuyEGP = gold22kEGP * (1 + spreadBuy);
  const gold22kSellEGP = gold22kEGP * (1 - spreadSell);

  const gold24kBuyEGP = gold24kEGP * (1 + spreadBuy);
  const gold24kSellEGP = gold24kEGP * (1 - spreadSell);

  // Egyptian Gold Pound (جنيه ذهب) = 8 grams of 21K gold
  const goldPoundEGP = gold21kEGP * 8;

  // Format number for display (just number, no currency symbol)
  const formatNumber = (num) => {
    return Math.round(num).toLocaleString();
  };

  // Update 18K prices
  if (elements.gold18kBuyInfo) {
    elements.gold18kBuyInfo.textContent = formatNumber(gold18kBuyEGP);
  }
  if (elements.gold18kSellInfo) {
    elements.gold18kSellInfo.textContent = formatNumber(gold18kSellEGP);
  }

  // Update 21K prices
  if (elements.gold21kBuyInfo) {
    elements.gold21kBuyInfo.textContent = formatNumber(gold21kBuyEGP);
  }
  if (elements.gold21kSellInfo) {
    elements.gold21kSellInfo.textContent = formatNumber(gold21kSellEGP);
  }

  // Update 22K prices
  if (elements.gold22kBuyInfo) {
    elements.gold22kBuyInfo.textContent = formatNumber(gold22kBuyEGP);
  }
  if (elements.gold22kSellInfo) {
    elements.gold22kSellInfo.textContent = formatNumber(gold22kSellEGP);
  }

  // Update 24K prices
  if (elements.gold24kBuyInfo) {
    elements.gold24kBuyInfo.textContent = formatNumber(gold24kBuyEGP);
  }
  if (elements.gold24kSellInfo) {
    elements.gold24kSellInfo.textContent = formatNumber(gold24kSellEGP);
  }

  // Update gold pound price
  if (elements.goldPoundEGPInfo) {
    elements.goldPoundEGPInfo.textContent = formatNumber(goldPoundEGP);
  }

  // Update gold ounce in USD
  if (elements.goldOunceUSDInfo) {
    elements.goldOunceUSDInfo.textContent =
      Math.round(goldOunceUSD).toLocaleString();
  }

  // Update USD/EGP rate
  if (elements.usdEGPInfo) {
    elements.usdEGPInfo.textContent = egpRate.toFixed(2);
  }
}

// Update BTC display
function updateBTCDisplay() {
  const currency = "EGP"; // Hardcoded to Egyptian Pound
  const btcUSD = globalPrices.btcUSD;

  // Convert to selected currency
  const btcPrice = convertCurrency(btcUSD, currency);
  const satoshiPrice = btcPrice / 100000000;
  const marketCap = convertCurrency(globalPrices.btcMarketCap, currency);

  if (elements.btcPrice)
    elements.btcPrice.textContent = formatCurrency(btcPrice, currency);
  if (elements.btcSatoshi)
    elements.btcSatoshi.textContent = formatCurrency(satoshiPrice, currency);
  if (elements.btcMarketCap)
    elements.btcMarketCap.textContent = formatCurrency(marketCap, currency);

  // Update chart price header (always show in USD for BTC)
  if (elements.chartBtcPrice) {
    elements.chartBtcPrice.textContent = btcUSD.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  const change = globalPrices.btcChange24h;

  if (elements.chartBtcChange) {
    const changeValue = ((btcUSD * Math.abs(change)) / 100).toFixed(0);
    elements.chartBtcChange.textContent = `${
      change >= 0 ? "+" : ""
    }${change.toFixed(2)}% (${change >= 0 ? "+" : "-"}${changeValue})`;
    elements.chartBtcChange.className = `chart-price-change ${
      change >= 0 ? "positive" : "negative"
    }`;
  }

  // BTC change - only update if element exists
  if (elements.btcChange) {
    const changeElement = elements.btcChange.querySelector(".change-value");
    if (changeElement) {
      changeElement.textContent = formatChange(change);
      changeElement.className = `change-value ${
        change >= 0 ? "positive" : "negative"
      }`;
    }
  }
}

// Calculate gold value
function calculateGoldValue() {
  if (
    !elements.calcWeight ||
    !elements.calcUnit ||
    !elements.calcKarat ||
    !elements.calcResult
  ) {
    return;
  }

  const currency = "EGP"; // Hardcoded to Egyptian Pound
  const weight = parseFloat(elements.calcWeight.value) || 0;
  const unit = elements.calcUnit.value;
  const karat = parseInt(elements.calcKarat.value);

  const goldOunceUSD = globalPrices.goldOunceUSD;
  const goldGramUSD = goldOunceUSD / 31.1035;

  let weightInGrams = weight;
  if (unit === "ounce") {
    weightInGrams = weight * 31.1035;
  } else if (unit === "kg") {
    weightInGrams = weight * 1000;
  }

  const purity = karatPurity[karat] || 1;
  const valueUSD = weightInGrams * goldGramUSD * purity;
  const value = convertCurrency(valueUSD, currency);

  elements.calcResult.textContent = formatCurrency(value, currency);
}

// Initialize TradingView widgets with Symbol Overview (shows live price)
function initTradingViewWidgets() {
  // Gold Symbol Overview Widget (embedded with script)
  const goldWidgetContainer = document.getElementById("tradingview_gold");
  if (goldWidgetContainer) {
    goldWidgetContainer.innerHTML = `
      <iframe 
        scrolling="no" 
        allowtransparency="true" 
        frameborder="0" 
        src="https://www.tradingview.com/widgetembed/?frameElementId=tradingview_gold&symbol=TVC%3AGOLD&interval=D&hidesidetoolbar=0&symboledit=0&saveimage=0&toolbarbg=f1f3f6&details=1&hotlist=0&calendar=0&studies=&theme=dark&style=3&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=&utm_medium=widget_new&utm_campaign=symbol-overview&hidevolume=0" 
        style="width: 100%; height: 100%; margin: 0 !important; padding: 0 !important;">
      </iframe>`;
  }

  // BTC Symbol Overview Widget (embedded with script)
  const btcWidgetContainer = document.getElementById("tradingview_btc");
  if (btcWidgetContainer) {
    btcWidgetContainer.innerHTML = `
      <iframe 
        scrolling="no" 
        allowtransparency="true" 
        frameborder="0" 
        src="https://www.tradingview.com/widgetembed/?frameElementId=tradingview_btc&symbol=BITSTAMP%3ABTCUSD&interval=D&hidesidetoolbar=0&symboledit=0&saveimage=0&toolbarbg=f1f3f6&details=1&hotlist=0&calendar=0&studies=&theme=dark&style=3&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=&utm_medium=widget_new&utm_campaign=symbol-overview&hidevolume=0" 
        style="width: 100%; height: 100%; margin: 0 !important; padding: 0 !important;">
      </iframe>`;
  }

  // Stocks Ticker Widget (20 Popular Stocks - Expanded)
  const stocksWidgetContainer = document.getElementById("tradingview_stocks");
  if (stocksWidgetContainer) {
    stocksWidgetContainer.innerHTML = `
      <iframe 
        scrolling="no" 
        allowtransparency="true" 
        frameborder="0" 
        src="https://www.tradingview.com/embed-widget/symbol-overview/?locale=en#%7B%22symbols%22%3A%5B%5B%22Apple%22%2C%22AAPL%7C1D%22%5D%2C%5B%22Microsoft%22%2C%22MSFT%7C1D%22%5D%2C%5B%22NVIDIA%22%2C%22NVDA%7C1D%22%5D%2C%5B%22Tesla%22%2C%22TSLA%7C1D%22%5D%2C%5B%22Amazon%22%2C%22AMZN%7C1D%22%5D%2C%5B%22Google%22%2C%22GOOGL%7C1D%22%5D%2C%5B%22Meta%22%2C%22META%7C1D%22%5D%2C%5B%22Netflix%22%2C%22NFLX%7C1D%22%5D%2C%5B%22AMD%22%2C%22AMD%7C1D%22%5D%2C%5B%22Intel%22%2C%22INTC%7C1D%22%5D%2C%5B%22Berkshire%22%2C%22BRK.B%7C1D%22%5D%2C%5B%22JPMorgan%22%2C%22JPM%7C1D%22%5D%2C%5B%22Visa%22%2C%22V%7C1D%22%5D%2C%5B%22Walmart%22%2C%22WMT%7C1D%22%5D%2C%5B%22Disney%22%2C%22DIS%7C1D%22%5D%2C%5B%22Coca-Cola%22%2C%22KO%7C1D%22%5D%2C%5B%22Nike%22%2C%22NKE%7C1D%22%5D%2C%5B%22Pfizer%22%2C%22PFE%7C1D%22%5D%2C%5B%22Boeing%22%2C%22BA%7C1D%22%5D%2C%5B%22McDonald's%22%2C%22MCD%7C1D%22%5D%5D%2C%22chartOnly%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22colorTheme%22%3A%22dark%22%2C%22showVolume%22%3Afalse%2C%22showMA%22%3Afalse%2C%22hideDateRanges%22%3Afalse%2C%22hideMarketStatus%22%3Afalse%2C%22hideSymbolLogo%22%3Afalse%2C%22scalePosition%22%3A%22right%22%2C%22scaleMode%22%3A%22Normal%22%2C%22fontFamily%22%3A%22-apple-system%2C%20BlinkMacSystemFont%2C%20Trebuchet%20MS%2C%20Roboto%2C%20Ubuntu%2C%20sans-serif%22%2C%22fontSize%22%3A%2210%22%2C%22noTimeScale%22%3Afalse%2C%22valuesTracking%22%3A%221%22%2C%22changeMode%22%3A%22price-and-percent%22%2C%22chartType%22%3A%22area%22%2C%22lineWidth%22%3A2%2C%22lineType%22%3A0%2C%22dateRanges%22%3A%5B%221d%7C1%22%2C%221m%7C30%22%2C%223m%7C60%22%2C%2212m%7C1D%22%2C%2260m%7C1W%22%2C%22all%7C1M%22%5D%7D" 
        style="width: 100%; height: 100%; margin: 0 !important; padding: 0 !important;">
      </iframe>`;
  }
}

// Load all data
async function loadAllData() {
  // Show loading toast
  const loadingToast = document.getElementById("loadingToast");
  if (loadingToast) {
    loadingToast.classList.add("show");
  }

  // Add loading state to refresh button
  if (elements.refreshBtn) {
    elements.refreshBtn.classList.add("loading");
  }

  // Show loading state on price elements
  document
    .querySelectorAll(".price, .karat-price, .calc-result-value")
    .forEach((el) => {
      el.classList.add("loading");
    });

  // Fetch all data in parallel
  await Promise.all([fetchExchangeRates(), fetchGoldPrice(), fetchBTCPrice()]);

  // Update displays
  updateGoldDisplay();
  updateBTCDisplay();
  calculateGoldValue();
  updateTimeDisplay();

  // Remove loading state
  document
    .querySelectorAll(".price, .karat-price, .calc-result-value")
    .forEach((el) => {
      el.classList.remove("loading");
    });

  // Hide loading toast after a short delay
  setTimeout(() => {
    if (loadingToast) {
      loadingToast.classList.remove("show");
    }
    if (elements.refreshBtn) {
      elements.refreshBtn.classList.remove("loading");
    }
  }, 500);
}

// Event Listeners
if (elements.refreshBtn) {
  elements.refreshBtn.addEventListener("click", loadAllData);
}

if (elements.calcWeight) {
  // Debounce for manual typing, instant for buttons
  elements.calcWeight.addEventListener(
    "input",
    debounce(calculateGoldValue, 300)
  );
}
if (elements.calcUnit) {
  elements.calcUnit.addEventListener("change", calculateGoldValue);
}
if (elements.calcKarat) {
  elements.calcKarat.addEventListener("change", calculateGoldValue);
}

// Stepper controls for weight
function getNumeric(attr) {
  const n = parseFloat(attr);
  return isNaN(n) ? null : n;
}

function adjustWeight(direction) {
  if (!elements.calcWeight) return;
  const input = elements.calcWeight;
  const step = getNumeric(input.step) || 0.25;
  const min = getNumeric(input.min) ?? 0;
  const max = getNumeric(input.max);
  const current = parseFloat(input.value) || 0;
  let next = current + direction * step;
  if (next < min) next = min;
  if (typeof max === "number" && next > max) next = max;
  input.value = Number(next.toFixed(4));
  // Use requestAnimationFrame for smoother DOM updates
  requestAnimationFrame(() => calculateGoldValue());
}

if (elements.weightDecBtn) {
  elements.weightDecBtn.addEventListener("click", () => adjustWeight(-1));
}
if (elements.weightIncBtn) {
  elements.weightIncBtn.addEventListener("click", () => adjustWeight(1));
}

// Optional: support arrow keys on the weight input for consistency
if (elements.calcWeight) {
  elements.calcWeight.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      adjustWeight(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      adjustWeight(-1);
    }
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadAllData();
  initTradingViewWidgets();

  // Auto-refresh every 5 minutes
  setInterval(loadAllData, 5 * 60 * 1000);
});
