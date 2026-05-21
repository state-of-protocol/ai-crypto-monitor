# AI Crypto Monitor — Complete Skill Reference

> A sleek, minimalist real-time crypto monitoring dashboard with automated AI insights, portfolio analysis, and predictive trend warnings powered by Google Gemini AI.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Backend API](#backend-api)
6. [Frontend Components](#frontend-components)
7. [Data Flow](#data-flow)
8. [Language & Localisation](#language--localisation)
9. [Theming & Customisation](#theming--customisation)
10. [Widget System](#widget-system)
11. [Fallback & Offline Modes](#fallback--offline-modes)
12. [Configuration](#configuration)
13. [Scripts](#scripts)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 5.8, Vite 6, TailwindCSS 4 |
| **Backend** | Node.js, Express 4, tsx (dev runner) |
| **AI** | Google Gemini API (`@google/genai`) |
| **Charts** | Recharts 3 |
| **Icons** | Lucide React |
| **Animations** | Motion 12 |
| **Build** | esbuild (server bundle), Vite (client bundle) |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Browser                           │
│  ┌───────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │  React 19  │ │ Recharts  │ │  TailwindCSS 4    │  │
│  │  (SPA)     │ │ (Charts)  │ │  (Utility-first)  │  │
│  └─────┬─────┘ └──────────┘ └───────────────────┘  │
│        │ fetch /api/*                               │
└────────┼────────────────────────────────────────────┘
         │
┌────────┴────────────────────────────────────────────┐
│              Express Server (server.ts)              │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────┐   │
│  │ CoinCap  │ │  Gemini  │ │  Synthetic Fallback │   │
│  │ API Proxy│ │ AI Proxy │ │  (Offline Mode)     │   │
│  └──────────┘ └──────────┘ └────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

- **Single binary server**: Express serves both API and Vite dev middleware / static files.
- **Coincap.io** provides live market data (no API key required).
- **Gemini API** provides AI analysis, chat, portfolio audit, and forecasts.
- When either upstream is unavailable, synthetic/mock data is used transparently.

---

## Getting Started

### Prerequisites

- Node.js >= 18

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` (or `.env`):

```env
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
```

- `GEMINI_API_KEY` — Required for AI features. Get one at [aistudio.google.com](https://aistudio.google.com/apikey).
- `APP_URL` — Used for self-referential links (optional for local dev).

### Run Development Server

```bash
npm run dev
```

Opens at **http://localhost:3000**.

---

## Project Structure

```
ai-crypto-monitor/
├── .env.example              # Environment variable template
├── .gitignore
├── index.html                # HTML entry (Inter + JetBrains Mono fonts)
├── metadata.json             # AI Studio metadata
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript config (ES2022, react-jsx)
├── vite.config.ts            # Vite: React plugin, TailwindCSS, path aliases
├── server.ts                 # Express backend (904 lines)
├── src/
│   ├── main.tsx              # React DOM root
│   ├── index.css             # TailwindCSS import + custom scrollbar styles
│   ├── types.ts              # All TypeScript interfaces
│   ├── App.tsx               # Main dashboard (1360 lines)
│   └── components/
│       ├── Header.tsx        # Top navigation bar
│       ├── MarketStats.tsx   # Market statistics cards
│       ├── LiveCoinsTable.tsx# Cryptocurrency table with search/sort
│       ├── FinancialChart.tsx# Interactive price chart
│       ├── AiInsights.tsx    # AI market analysis report
│       ├── AiChat.tsx        # Conversational AI advisor
│       ├── PortfolioAnalyzer.tsx # Portfolio builder & AI audit
│       ├── MultiHorizonForecast.tsx # Multi-timeframe forecasts
│       └── WatchlistAlerts.tsx # Watchlist & price alerts
```

---

## Backend API

### `GET /api/crypto/markets`
Returns top 100 cryptocurrencies.

| Query | Type | Default | Description |
|---|---|---|---|
| _(none)_ | | | Returns full 100-coin array |

**Response**: `CoinData[]` — each with `id`, `symbol`, `name`, `priceUsd`, `changePercent24h`, `marketCapUsd`, `volumeUsd24h`, `supply`, `maxSupply`, `history7d` (sparkline), `rank`.

**Data source**: CoinCap API (`api.coincap.io/v2/assets?limit=100`). Falls back to synthetic data generation (`getFallbackCoins100()`) when offline.

---

### `GET /api/crypto/history/:id`
Returns historical daily prices for charting.

| Param | Type | Default | Description |
|---|---|---|---|
| `id` | path | required | Coin ID (e.g. `bitcoin`) |
| `days` | query | `90` | Number of days of history |

**Response**: `{ date: string, priceUsd: number }[]`

**Fallback**: Generates synthetic history with sine-wave wobble when CoinCap unavailable.

---

### `GET /api/crypto/ai-analysis`
Gemini-generated market intelligence report.

| Query | Type | Default | Description |
|---|---|---|---|
| `lang` | string | `"MY"` | Language: `MY`, `ENG`, or `CN` |

**Response**:
```typescript
{
  sentiment: "Bullish" | "Bearish" | "Neutral",
  score: number,        // 0-100 bullish intensity
  headline: string,
  summary: string,
  advisoryFlags: { title: string, type: "warning" | "info" | "success", reason: string }[],
  technicalAnalysis: {
    support: string,
    resistance: string,
    rsiStatus: string,
    advice: string
  }
}
```

**Model**: `gemini-3.5-flash`, temperature 0.25, response MIME `application/json`.

**Fallback**: Static mock insight in 3 languages with realistic technical analysis.

---

### `POST /api/crypto/ai-chat`
Conversational AI trading advisor.

**Body**:
```json
{
  "messages": [{ "role": "user", "text": "..." }],
  "selectedCoinId": "bitcoin"
}
```

**Response**: `{ reply: string }`

**Fallback**: Generates contextual reply using current cached market data.

---

### `POST /api/crypto/portfolio-audit`
AI portfolio risk assessment and rebalancing suggestions.

**Body**:
```json
{
  "assets": [{ "coinId": "bitcoin", "symbol": "btc", "name": "Bitcoin", "amount": 0.15 }]
}
```

**Response**:
```typescript
{
  diversificationScore: number,
  riskLevel: "Conservative" | "Moderate" | "Aggressive" | "Highly Speculative",
  feedbackMarkdown: string,
  suggestedRebalance: { symbol: string, currentPercent: number, recommendedPercent: number, action: string }[]
}
```

---

### `POST /api/crypto/multi-horizon-forecast`
Generates 6 horizon outlook cards (Daily → Multi-Year).

**Body**:
```json
{
  "assets": [{ "symbol": "btc", "amount": 0.15 }]
}
```

**Response**: `HorizonForecast[]` — each with `horizon`, `action`, `sentimentPct`, `sentimentLabel`, `accuracyEstimate`, `neutralityRating`, `riskFlags`, `logicAnalysis`, `recommendation`.

### Rate Limiting & Quota Handling

- When Gemini returns HTTP 429 or `RESOURCE_EXHAUSTED`, the server enters cooldown for **1 hour** (`QUOTA_COOLDOWN_MS`).
- During cooldown, `getAiClient()` returns `null` and all AI endpoints serve mock data with `[Adaptive Rate-Limit Fallback Mode]` annotation.
- CoinCap DNS is pre-resolved at startup (`dns.lookup`) to avoid costly timeouts.

---

## Frontend Components

### `App.tsx` (Main Dashboard)
- **State management**: `useState` + `useEffect` for coins, history, AI insight, portfolio, chat, alerts, watchlist, theme settings.
- **Widget system**: 8 draggable/resizable widgets stored in `localStorage`.
- **Auto-refresh**: Markets poll every **20 seconds**; insights cache **5 minutes**; markets cache **15 seconds**.
- **Data fetching**: All API calls use plain `fetch()` to Express backend.
- **Portfolio sync**: Multi-coin history fetched in parallel with `Promise.all()`; combined NAV curve computed via `useMemo`.

### `Header.tsx`
- Live UTC clock (1s tick)
- Connection status indicator (green = online, amber = fallback)
- Refresh button with freshness label
- Currency toggle: MYR / USD / CNY
- Settings gear icon (opens theme/color palette modal)

### `MarketStats.tsx`
- 4 stat cards: Total Capitalization, Aggregated 24h Volume, BTC Dominance, AI Sentiment Index
- Language toggle (MY/ENG/CN) for labels
- Color-coded sentiment badge (Bullish = green, Bearish = red, Neutral = amber)

### `LiveCoinsTable.tsx`
- 3 category tabs: All Top 100, Altcoin Category, My Watchlist
- Text search (name/symbol)
- 7 sortable columns: Rank, Name, Price, 24h Change, Market Cap, Volume, Sparkline (7d SVG)
- Action buttons per row: View chart, Add to portfolio, Toggle watchlist star
- Responsive design (hides columns on smaller screens)

### `FinancialChart.tsx`
- Interactive Recharts `AreaChart` with CSS variable theming
- Timeframe toggle: 30D / 90D
- Bollinger Bands (20, 2) overlay toggle
- MA-5 (5-period moving average) dashed line
- Dynamic Y-axis domain including Bollinger Bands
- Multi-language labels
- Price stats: Low, High, Delta %

### `AiInsights.tsx`
- Loading state with animated sparkle pulse
- Headline banner with accent gradient
- Summary paragraph
- Advisory flags (warning/info/success) with icons
- Technical levels grid (Support, Resistance, RSI)
- Strategic advice panel
- Language switcher + Re-analyze button

### `AiChat.tsx`
- Chat message feed with auto-scroll
- User and AI message bubbles (different styles)
- 4 preset prompt buttons
- Loading/thinking indicator with bouncing dots
- Clean input form with send button

### `PortfolioAnalyzer.tsx`
- Two sub-tabs: Worth Curve (30D) & AI Strategic Audit
- Asset holding list with editable amounts and remove buttons
- Combined portfolio NAV chart (Recharts AreaChart)
- Audit results: Diversification Score, Risk Level badge, Rebalance grid, Strategy narrative

### `MultiHorizonForecast.tsx`
- 6 horizon buttons (Daily → Multi-Year) with sentiment %
- Detailed view for selected horizon:
  - Directive header + sentiment label pill
  - Sentiment progress bar, Accuracy meter, Neutrality index
  - Logic analysis text
  - Risk flags (greenflag/redflag/neutral)
  - Personalised recommendation
- Horizon Spectrum Matrix at bottom (summary grid)

### `WatchlistAlerts.tsx`
- Two-column layout: Watchlist + Alert Setup
- Watchlist: pinned coins with live price, change %, bell icon for quick alert setup
- Alert form: asset selector, condition toggle (Above/Below), target price input
- Alert cards: symbol badge, target price, live price, active/inactive/triggered states
- Toggle alert on/off, delete alert
- Triggers scanned on every market refresh cycle; toast notification on hit

---

## Data Flow

```
Market Refresh (20s interval)
        │
        ▼
  fetch /api/crypto/markets
        │
        ├── CoinCap online ──► return 100 coins ──► setCoins()
        │
        └── CoinCap offline ──► getFallbackCoins100() ──► setCoins()
                                      │
                                Synthetic data:
                                - 10 curated coins (hardcoded prices)
                                - 30 altcoin seeds
                                - 60 generated projects with deterministic names

User selects coin ──► fetch /api/crypto/history/:id ──► setCoinHistory()
User clicks "Re-Analyze" ──► fetch /api/crypto/ai-analysis?lang= ──► setAiInsight()
User sends chat ──► POST /api/crypto/ai-chat ──► append ChatMessage[]
User clicks "Audit Vault" ──► POST /api/crypto/portfolio-audit ──► setAuditFeedback()
Portfolio change ──► POST /api/crypto/multi-horizon-forecast ──► setForecasts()
Alert trigger scan ──► every coins update, check all active alerts ──► toast notification
```

---

## Language & Localisation

Three languages are supported throughout the UI and AI responses:

| Code | Language | Used In |
|---|---|---|
| `MY` | Bahasa Malaysia | Default. All components with `LOCAL_STRINGS` blocks; AI prompt instructions |
| `ENG` | English | Full UI text; AI prompt instructions |
| `CN` | Simplified Chinese | Full UI text; AI prompt instructions |

Components that implement language switching:
- `MarketStats.tsx` — inline toggle
- `FinancialChart.tsx` — inline toggle
- `AiInsights.tsx` — inline toggle (propagates to API `?lang=`)
- `WatchlistAlerts.tsx` — inline toggle

AI language instruction is passed as a system prompt prefix to Gemini, ensuring generated content matches the selected language.

---

## Theming & Customisation

### Built-in Themes

| Theme | Background | Text | Border | Vibes |
|---|---|---|---|---|
| `dark` | `#09090b` → `#0f0f11` | `#f4f4f5` | `#27272a` | Default dark terminal |
| `light` | `#ffffff` | `#09090b` | `#e4e4e7` | Clean white |
| `beige` | `#fcfbf7` | `#2d241e` | `#dfd4bf` | Warm coffee |

### Accent Color

- Stored in `localStorage` key `ai_crypto_accent_color`
- Replaces all `emerald-*` classes via CSS custom properties (`--accent-color`, `--accent-rgb`)
- Preset swatches: Default Green, Cyan Teal, Noble Purple, Amber Gold, Crimson Red
- Full 256-bit color picker input
- Directional price indicators (green/red for up/down) are **protected** from accent overrides

### Persistence

| Setting | `localStorage` Key |
|---|---|
| Widget visibility & order | `ai_crypto_dashboard_widgets` |
| Accent color | `ai_crypto_accent_color` |
| Theme mode | `ai_crypto_theme_mode` |
| Portfolio assets | `ai_crypto_portfolio_assets` |
| Watchlist pins | `ai_crypto_watchlist_keys` |
| Price alerts | `ai_crypto_alerts_keys` |

---

## Widget System

8 widgets managed via `DashboardWidget[]`:

| ID | Title | Default Size | Description |
|---|---|---|---|
| `market-stats` | Market Stats | `full` (12 cols) | Global stats cards |
| `live-watchlist` | Live Watchlist | `lg` (8 cols) | Coin table |
| `financial-chart` | Technical Charts | `md` (6 cols) | Price chart |
| `watchlist-alerts` | Alerts Hub | `md` (6 cols) | Watchlist + alerts |
| `portfolio-analyzer` | AI Asset Allocator | `lg` (8 cols) | Portfolio + audit |
| `macro-insights` | AI Macro Intelligence | `md` (6 cols) | AI report |
| `multi-horizon-forecast` | Strategic Forecasts | `md` (6 cols) | Forecast cards |
| `ai-chat` | AI Advisor Chat | `md` (6 cols) | Chat terminal |

**Grid system**: 12-column CSS grid (`lg:grid-cols-12`). Sizes:
- `sm` = 4 cols, `md` = 6 cols, `lg` = 8 cols, `full` = 12 cols

**Features**:
- Drag & drop to reorder (native HTML5 DnD)
- Resize per widget (SM / MD / LG / FULL)
- Hide/show via customizer drawer
- Reset to defaults

---

## Fallback & Offline Modes

### Scenario 1: No GEMINI_API_KEY
- `getAiClient()` returns `null`
- All AI endpoints serve pre-defined mock data
- Chat returns contextual replies based on cached prices
- Portfolio audit uses `getMockPortfolioFeedback()`
- Forecasts use `getMockForecasts()`

### Scenario 2: Gemini Quota Exceeded (429)
- Server sets `isQuotaExceeded = true`
- 1-hour cooldown before retrying
- Same mock data as Scenario 1, with `[Adaptive Rate-Limit Fallback Mode]` annotation
- Headline prefixed with language-appropriate rate-limit note

### Scenario 3: CoinCap Offline
- DNS pre-check at startup fails → `isCoincapOnline = false`
- `/api/crypto/markets` serves `getFallbackCoins100()`:
  - 10 hardcoded top coins with realistic prices
  - 30 altcoin seeds with market-cap-weighted synthetic data
  - 60 procedurally generated projects (deterministic names, exponential price decay)
- `/api/crypto/history/:id` serves synthetic sine-wave data

### Synthetic Data Generation
```typescript
getFallbackCoins100()
├── FALLBACK_COINS (10 entries)  # BTC, ETH, BNB, SOL, XRP, ADA, DOGE, AVAX, LINK, DOT
├── REAL_ALTCOINS_SEED (30)     # MATIC, LTC, UNI, NEAR, TRX, XLM, VET, ATOM, APT, SUI, ...
└── Generated (ranks 41-100)     # Deterministic names from 36 prefixes × 12 suffixes
```

---

## Configuration

### `vite.config.ts`
```typescript
plugins: [react(), tailwindcss()]
resolve.alias: { '@': project root }
server.hmr: disabled when DISABLE_HMR=true
server.watch: null when DISABLE_HMR=true (saves CPU during agent edits)
```

### `tsconfig.json` Highlights
- `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`
- `jsx: react-jsx`, `allowImportingTsExtensions: true`, `noEmit: true`
- Path alias `@/*` → `./*`

### Metadata (`metadata.json`)
```json
{
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}
```
This signals to AI Studio that the applet requires server-side Gemini API access.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload (tsx + Vite middleware) |
| `npm run build` | Build client (Vite) + bundle server (esbuild) into `dist/` |
| `npm run start` | Run production server from `dist/server.cjs` |
| `npm run lint` | Type-check without emitting (`tsc --noEmit`) |
| `npm run clean` | Remove `dist/` and `server.js` |
