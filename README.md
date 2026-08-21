# Stock Pulse | أسواق اليوم 🇪🇬 🌐

A high-performance, real-time Arabic-first **Financial Market Watch Dashboard** for Egypt and Global Markets. Powered **100% by official TradingView Dark Theme Widgets** with zero local mock data, zero API rate-limits, and ultra-reliable real-time data streaming.

🔗 **Live Demo:** [https://abdelghany-77.github.io/stocks-tracker/](https://abdelghany-77.github.io/stocks-tracker/)

---

## 🌟 Official TradingView Widgets Integrated

### 1. ⚡ Top Real-Time Ticker Tape (`TradingViewTickerTape.tsx`)
- Continuous marquee stream showing live quotes for:
  * **الذهب:** `FX_IDC:XAUUSD`
  * **الدولار / جنيه:** `FX_IDC:USDEGP`
  * **البورصة المصرية:** `EGX:EGX30`
  * **المؤشرات الأمريكية:** `NASDAQ:NDX`, `FOREXCOM:SPXUSD`
  * **السلع والعملات الرقمية:** `TVC:UKOIL`, `BINANCE:BTCUSDT`, `FX_IDC:EUREGP`, `FX_IDC:SAREGP`

### 2. 📊 Hero Real-Time Highlights (`TradingViewMiniWidget.tsx`)
- 4 dedicated mini-chart highlight widgets for key leading indicators:
  * 🪙 **أونصة الذهب (Gold Spot XAU/USD)**
  * 🏛️ **مؤشر البورصة المصرية EGX 30**
  * 💵 **الدولار مقابل الجنيه (USD/EGP)**
  * 🌐 **ناسداك 100 (Nasdaq 100)**

### 3. 📈 Advanced Interactive Real-Time Chart (`TradingViewAdvancedChart.tsx`)
- Official TradingView Advanced Chart with an explicit **560px** fixed height.
- Instant asset switcher tabs:
  * `FX_IDC:XAUUSD` (أونصة الذهب)
  * `EGX:EGX30` (مؤشر EGX 30)
  * `FX_IDC:USDEGP` (الدولار مقابل الجنيه)
  * `NASDAQ:NDX` (ناسداك 100)
  * `FOREXCOM:SPXUSD` (S&P 500)
  * `TVC:UKOIL` (خام برنت)
  * `BINANCE:BTCUSDT` (بيتكوين)
  * `EGX:COMI` (البنك التجاري الدولي)
  * `EGX:TMGH` (طلعت مصطفى)
  * `EGX:FWRY` (فوري)
- Full technical analysis tools, indicators, drawing tools, and Arabic locale (`locale: "ar_AE"`).

### 4. 🗂️ Multi-Market Overview Widget (`TradingViewMarketOverview.tsx`)
- Tabbed multi-asset market overview:
  * **🪙 الذهب والعملات (Forex & Gold)**
  * **🏛️ البورصة المصرية (EGX Stocks)**
  * **🌐 الأسواق العالمية والسلع (Global Markets)**

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 |
| **Language** | TypeScript |
| **Bundler** | Vite 5 |
| **Styling** | Tailwind CSS v3 (Dark Theme `#0B0F17`) |
| **Market Data & Charts** | Official TradingView Embed Widgets |
| **Icons** | Lucide React |
| **Deployment** | GitHub Pages (`gh-pages`) |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/abdelghany-77/stocks-tracker.git
cd stocks-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 📄 License

Open source under the MIT License.
