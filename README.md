# AI Crypto Monitor

Real-time cryptocurrency monitoring dashboard with AI-powered insights, portfolio analysis, and predictive trend warnings.

**Tech stack**: React 19 + TypeScript + Vite 6 + TailwindCSS 4 (frontend) · DeepSeek AI + Express + CoinCap API (backend) · Vercel (deployment) · PWA (offline-capable)

---

## Features

- Live prices for top 100 cryptocurrencies (via CoinCap API)
- Interactive charts with MA-5 & Bollinger Bands
- AI market analysis & advisor chat (DeepSeek)
- Portfolio builder with AI audit & rebalancing suggestions
- Multi-horizon strategic forecasts (Daily → Multi-Year)
- Customizable watchlist & price alerts
- Drag-and-drop dashboard widgets
- 3 themes (Dark / Light / Beige) + custom accent color
- Multi-language (Malay / English / Chinese)

---

## Run Locally

**Prerequisites**: Node.js >= 18

```bash
npm install
```

Create `.env` in the project root:

```env
DEEPSEEK_API_KEY="your-deepseek-api-key"
```

Run development server:

```bash
npm run dev
```

Open **http://localhost:3000**.

> The app works without an API key — AI features will use simulation mode with realistic fallback data.

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Set environment variable: `DEEPSEEK_API_KEY`
4. Deploy — Vercel auto-detects `vercel.json`

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
| GET | `/api/crypto/ai-analysis` | AI market intelligence report |
| POST | `/api/crypto/ai-chat` | Conversational AI advisor |
| POST | `/api/crypto/portfolio-audit` | Portfolio risk assessment |
| POST | `/api/crypto/multi-horizon-forecast` | Multi-horizon strategy forecast |

All endpoints gracefully fall back to synthetic data when upstream services are unavailable.
