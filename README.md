# Crypto Monitor

Real-time cryptocurrency monitoring dashboard powered by the CoinCap API. No API keys required.

**Live demo**: https://state-of-protocol.github.io/ai-crypto-monitor/

**Tech stack**: React 19 + TypeScript + Vite 6 + TailwindCSS 4 (frontend) · CoinCap API (data) · GitHub Pages (deployment) · PWA (offline-capable)

---

## Features

- Live prices for top 100 cryptocurrencies (via CoinCap API)
- Interactive charts with MA-5 & Bollinger Bands
- Customizable watchlist & price alerts
- Portfolio builder with balance tracking
- Drag-and-drop dashboard widgets
- 3 themes (Dark / Light / Beige) + custom accent color
- Multi-language (Malay / English / Chinese)
- Installable PWA with offline support

---

## Run Locally

**Prerequisites**: Node.js >= 18

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

No API keys or configuration required.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Build frontend for production |
| `npm run lint` | Type-check with TypeScript |
| `npm run clean` | Remove `dist/` artifacts |
| `npm run deploy` | Build & deploy to GitHub Pages |


