# Crypto Monitor

Real-time cryptocurrency monitoring dashboard powered by the CoinCap API. No AI features or API keys required.

**Tech stack**: React 19 + TypeScript + Vite 6 + TailwindCSS 4 (frontend) · Express + CoinCap API (backend) · Vercel (deployment) · PWA (offline-capable)

---

## Features

- Live prices for top 100 cryptocurrencies (via CoinCap API)
- Interactive charts with MA-5 & Bollinger Bands
- Customizable watchlist & price alerts
- Portfolio builder with balance tracking
- Drag-and-drop dashboard widgets
- 3 themes (Dark / Light / Beige) + custom accent color
- Multi-language (Malay / English / Chinese)

---

## Run Locally

**Prerequisites**: Node.js >= 18

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Deploy — Vercel auto-detects `vercel.json`

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server (Express + Vite HMR) |
| `npm run build` | Build frontend for production (Vite) |
| `npm run lint` | Type-check with TypeScript |
| `npm run clean` | Remove `dist/` artifacts |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/crypto/markets` | Top 100 cryptocurrencies |
| GET | `/api/crypto/history/:id` | Historical daily prices |
