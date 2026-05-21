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

export interface AiMarketInsight {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  score: number; // 0-100 scale of bullishness
  headline: string;
  summary: string;
  advisoryFlags: {
    title: string;
    type: 'warning' | 'info' | 'success';
    reason: string;
  }[];
  technicalAnalysis: {
    support: string;
    resistance: string;
    rsiStatus: string;
    advice: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface PortfolioItem {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
}

export interface AiPortfolioFeedback {
  diversificationScore: number; // 0-100
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive' | 'Highly Speculative';
  feedbackMarkdown: string;
  suggestedRebalance: {
    symbol: string;
    currentPercent: number;
    recommendedPercent: number;
    action: string;
  }[];
}

export interface HorizonForecast {
  horizon: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly" | "Multi-Year";
  action: string;
  sentimentPct: number;
  sentimentLabel: string;
  accuracyEstimate: number;
  neutralityRating: number;
  riskFlags: {
    type: 'greenflag' | 'redflag' | 'neutral';
    label: string;
    description: string;
  }[];
  logicAnalysis: string;
  recommendation: string;
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


