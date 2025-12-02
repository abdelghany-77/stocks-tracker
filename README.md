# Gold & BTC Price Tracker 💰

A simple, elegant web application to track Gold and Bitcoin prices in real-time. Built with pure HTML, CSS, and JavaScript - no backend required!

## 🌟 Features

- **Real-time Gold Prices**: Track gold prices per ounce, gram, and kilogram
- **Bitcoin Tracking**: Live BTC price with 24h change and market cap
- **Multiple Currencies**: Support for USD, EUR, GBP, EGP, SAR, and AED
- **Gold Karat Calculator**: View prices for different gold purities (24K, 22K, 21K, 18K, 14K, 10K)
- **Gold Value Calculator**: Calculate the value of your gold based on weight and karat
- **Live Charts**: Interactive TradingView charts for both Gold and Bitcoin
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes with a modern dark interface
- **Auto-refresh**: Prices update automatically every 5 minutes

## 🚀 Live Demo

Deploy to GitHub Pages and your app will be live at:
`https://[abdelghany-77].github.io/[repository-name]/`

## 📦 Installation

No installation required! Simply:

1. Clone or download this repository
2. Open `index.html` in your browser

## 🌐 Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Push this code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[your-username]/[repository-name].git
   git push -u origin main
   ```
3. Go to repository Settings → Pages
4. Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click Save
7. Your site will be live in a few minutes!

## 🔧 Technologies Used

- HTML5
- CSS3 (with CSS Variables for theming)
- Vanilla JavaScript (ES6+)
- [TradingView Widgets](https://www.tradingview.com/widget/) for charts
- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [Frankfurter API](https://www.frankfurter.app/) for exchange rates

## 📊 API Information

This app uses free public APIs:

- **CoinGecko**: Free API for Bitcoin prices (no API key required)
- **Frankfurter**: Free API for currency exchange rates
- **TradingView**: Free widgets for live charts

> Note: Gold prices use a fallback value as most gold APIs require paid subscriptions. For production use, consider integrating with [GoldAPI](https://www.goldapi.io/) or similar services.

## 🎨 Customization

### Change Colors

Edit the CSS variables in `styles.css`:

```css
:root {
  --gold-primary: #ffd700;
  --btc-primary: #f7931a;
  --bg-primary: #0f1419;
  /* ... */
}
```

### Add More Currencies

Add to the `currencySymbols` object in `app.js`:

```javascript
const currencySymbols = {
  USD: "$",
  // Add more currencies here
};
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

If you have any questions, feel free to open an issue.

---

