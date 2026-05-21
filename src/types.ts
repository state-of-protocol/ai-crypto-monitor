export interface CoinData {
  id: string; // e.g., 'bitcoin'
  symbol: string; // e.g., 'btc'
  name: string; // e.g., 'Bitcoin'
  priceUsd: number;
  changePercent24h: number;
  marketCapUsd: number;
  volumeUsd24h: number;
  supply: number;
  maxSupply: number | null;
  history7d: number[]; // Sparkline elements
  rank: number;
}

export interface CoinHistoryPoint {
  date: string;
  priceUsd: number;
}

export interface PortfolioItem {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
}

export interface PriceAlert {
  id: string;
  coinId: string;
  coinSymbol: string;
  targetPrice: number;
  condition: "above" | "below";
  isActive: boolean;
  createdAt: string;
  isTriggered: boolean;
  triggeredAt?: string;
}

export interface WatchlistItem {
  coinId: string;
  pinnedAt: string;
}


