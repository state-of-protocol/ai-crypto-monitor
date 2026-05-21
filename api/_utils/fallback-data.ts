// ── Fallback data generators for offline / simulation mode ──

export const FALLBACK_COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 92450.00, cap: 1810000000000, vol: 24000000000, change: 1.85, supply: 19700000 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3420.50, cap: 410000000000, vol: 12500000000, change: -0.45, supply: 120000000 },
  { id: "binance-coin", symbol: "BNB", name: "BNB Coin", price: 625.20, cap: 91000000000, vol: 1100000000, change: 0.95, supply: 146000000 },
  { id: "solana", symbol: "SOL", name: "Solana", price: 168.45, cap: 78000000000, vol: 3200000000, change: 5.42, supply: 462000000 },
  { id: "ripple", symbol: "XRP", name: "Ripple", price: 1.15, cap: 65000000000, vol: 1500000000, change: -1.20, supply: 55000000000 },
  { id: "cardano", symbol: "ADA", name: "Cardano", price: 0.58, cap: 20000000000, vol: 450000000, change: 2.15, supply: 35600000000 },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", price: 0.22, cap: 32000000000, vol: 1400000000, change: 12.35, supply: 144000000000 },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", price: 32.80, cap: 13000000000, vol: 380000000, change: -2.30, supply: 395000000 },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", price: 17.15, cap: 10800000000, vol: 290000000, change: 1.02, supply: 626000000 },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", price: 6.45, cap: 9200000000, vol: 180000000, change: -0.85, supply: 1430000000 }
];

const REAL_ALTCOINS_SEED = [
  { id: "polygon", symbol: "MATIC", name: "Polygon", price: 0.48 },
  { id: "litecoin", symbol: "LTC", name: "Litecoin", price: 84.15 },
  { id: "uniswap", symbol: "UNI", name: "Uniswap", price: 7.82 },
  { id: "near", symbol: "NEAR", name: "Near Protocol", price: 5.12 },
  { id: "tron", symbol: "TRX", name: "Tron", price: 0.14 },
  { id: "stellar", symbol: "XLM", name: "Stellar", price: 0.12 },
  { id: "vechain", symbol: "VET", name: "VeChain", price: 0.024 },
  { id: "cosmos", symbol: "ATOM", name: "Cosmos", price: 6.85 },
  { id: "aptos", symbol: "APT", name: "Aptos", price: 8.75 },
  { id: "sui", symbol: "SUI", name: "Sui", price: 1.45 },
  { id: "fantom", symbol: "FTM", name: "Fantom", price: 0.72 },
  { id: "optimism", symbol: "OP", name: "Optimism", price: 1.85 },
  { id: "arbitrum", symbol: "ARB", name: "Arbitrum", price: 0.94 },
  { id: "render-token", symbol: "RENDER", name: "Render", price: 7.42 },
  { id: "filecoin", symbol: "FIL", name: "Filecoin", price: 4.88 },
  { id: "kaspa", symbol: "KAS", name: "Kaspa", price: 0.155 },
  { id: "monero", symbol: "XMR", name: "Monero", price: 152.40 },
  { id: "ethereum-classic", symbol: "ETC", name: "Ethereum Classic", price: 23.10 },
  { id: "maker", symbol: "MKR", name: "Maker", price: 2150.00 },
  { id: "aave", symbol: "AAVE", name: "Aave", price: 145.20 },
  { id: "lido-dao", symbol: "LDO", name: "Lido DAO", price: 1.62 },
  { id: "injective-protocol", symbol: "INJ", name: "Injective", price: 21.80 },
  { id: "theta-token", symbol: "THETA", name: "Theta Network", price: 1.48 },
  { id: "gala", symbol: "GALA", name: "Gala", price: 0.031 },
  { id: "hedera-hashgraph", symbol: "HBAR", name: "Hedera", price: 0.078 },
  { id: "algorand", symbol: "ALGO", name: "Algorand", price: 0.132 },
  { id: "flow", symbol: "FLOW", name: "Flow", price: 0.65 },
  { id: "internet-computer", symbol: "ICP", name: "Internet Computer", price: 8.12 },
  { id: "elrond-erd-2", symbol: "EGLD", name: "MultiversX", price: 28.50 },
  { id: "eos", symbol: "EOS", name: "EOS", price: 0.54 }
];

function createSyntheticSparkline(changePercent: number, basePrice: number): number[] {
  const points = 8;
  const history: number[] = [];
  let currentPrice = basePrice * (1 - changePercent / 100);
  for (let i = 0; i < points; i++) {
    const stepRatio = i / (points - 1);
    const wander = (Math.random() - 0.48) * 0.02 * basePrice;
    const trendedPrice = currentPrice + (wander + (basePrice * (changePercent / 100) * stepRatio / points));
    history.push(Number(trendedPrice.toFixed(4)));
  }
  return history;
}

export function getFallbackCoins100(): any[] {
  const list: any[] = [];
  FALLBACK_COINS.forEach((c, idx) => {
    list.push({
      id: c.id, symbol: c.symbol, name: c.name, priceUsd: c.price,
      changePercent24h: c.change + (Math.random() - 0.5) * 0.4,
      marketCapUsd: c.cap, volumeUsd24h: c.vol, supply: c.supply,
      maxSupply: null, history7d: createSyntheticSparkline(c.change, c.price), rank: idx + 1
    });
  });
  REAL_ALTCOINS_SEED.forEach((c, idx) => {
    const rank = 11 + idx;
    const cap = Math.round((5000000000 * Math.pow(0.94, idx)) + (Math.random() * 100000000));
    const vol = Math.round(cap * (0.05 + Math.random() * 0.05));
    const supply = Math.round(cap / c.price);
    const change = (Math.random() - 0.45) * 8;
    list.push({
      id: c.id, symbol: c.symbol, name: c.name, priceUsd: c.price,
      changePercent24h: change, marketCapUsd: cap, volumeUsd24h: vol,
      supply, maxSupply: null, history7d: createSyntheticSparkline(change, c.price), rank
    });
  });
  const firsts = ["Aero", "Alpha", "Apex", "Astra", "Aether", "Chronos", "Cyber", "Delta", "Fluid", "Flux", "Giga", "Helios", "Hyper", "Krypton", "Luna", "Helix", "Matrix", "Neo", "Nexus", "Nova", "Onyx", "Oracle", "Orion", "Prism", "Pulse", "Pyre", "Quantum", "Sovereign", "Spectre", "Stellar", "Sync", "Titan", "Vapor", "Vortex", "Zephyr", "Zenith"];
  const seconds = ["Chain", "DAO", "Finance", "Labs", "Ledger", "Network", "Oracle", "Protocol", "Systems", "Token", "Vault", "Web3"];
  let currentRank = 41;
  while (currentRank <= 100) {
    const p1 = firsts[(currentRank * 7) % firsts.length];
    const p2 = seconds[(currentRank * 13) % seconds.length];
    const name = `${p1} ${p2} v${currentRank}`;
    const symbol = (p1.slice(0, 2) + p2.slice(0, 2) + currentRank).toUpperCase();
    const id = `${p1.toLowerCase()}-${p2.toLowerCase()}-${currentRank}`;
    const scale = currentRank - 40;
    const priceUsd = Number((12.50 * Math.pow(0.88, scale) + 0.015).toFixed(4));
    const cap = Math.round((1200000000 * Math.pow(0.96, scale)) + (Math.random() * 10000000));
    const vol = Math.round(cap * (0.02 + Math.random() * 0.04));
    const supply = Math.round(cap / priceUsd);
    const change = (Math.random() - 0.48) * 12;
    list.push({
      id, symbol, name, priceUsd, changePercent24h: change, marketCapUsd: cap,
      volumeUsd24h: vol, supply, maxSupply: null,
      history7d: createSyntheticSparkline(change, priceUsd), rank: currentRank
    });
    currentRank++;
  }
  return list;
}

export function getMockHistoryPoints(id: string, days: number = 90): any[] {
  let basePrice = 100;
  const fallback = [...FALLBACK_COINS, ...REAL_ALTCOINS_SEED];
  const match = fallback.find(c => c.id === id);
  if (match) basePrice = match.price;

  const points: any[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const randWobble = 1 + (Math.sin(i / 5) * 0.05) + ((Math.random() - 0.5) * 0.035);
    points.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      priceUsd: Number((basePrice * randWobble).toFixed(4))
    });
  }
  return points;
}

export function getMockInsight(lang: string = "MY") {
  const nlang = lang.toUpperCase();
  const base = {
    sentiment: "Bullish" as const,
    score: 74,
  };
  if (nlang === "CN") {
    return {
      ...base,
      headline: "SOLANA 超级周期点燃 LAYER-1 整体流动性激增",
      summary: "加密货币市场正经历由 Solana 两位数增长引领的强劲累积情绪，从而在生态中产生了多链流动性轮动。",
      advisoryFlags: [
        { title: "山寨资本轮动警报", type: "success" as const, reason: "Solana 正触发向二线优质 Layer-1/Layer-2 资产的深度轮动。" },
        { title: "RSI 指标中性巩固", type: "info" as const, reason: "比特币在 4 小时 EMA 均线带附近获得稳健支撑，RSI 处于 58 附近。" },
        { title: "周末高杠杆衍生风险", type: "warning" as const, reason: "周末衍生品市场资金费率显示中等强度杠杆迹象。" }
      ],
      technicalAnalysis: {
        support: "比特币: $90,500 | 以太坊: $3,350 | 索拉纳: $158",
        resistance: "比特币: $94,800 | 以太坊: $3,580 | 索拉纳: $178",
        rsiStatus: "中性偏暖 (58-62)",
        advice: "建议在强结构性支撑位附近定投布局优质公链与生态资产。"
      }
    };
  }
  if (nlang === "ENG") {
    return {
      ...base,
      headline: "Solana Super-Cycle Ignites Layer-1 Liquidity Surge",
      summary: "The crypto markets are reflecting robust accumulation sentiment led by Solana's double-digit gain, generating cross-chain liquidity rotation.",
      advisoryFlags: [
        { title: "Altcoin Rotation Alert", type: "success" as const, reason: "Solana is triggering deep liquidity rotation into secondary Layer-1/Layer-2 assets." },
        { title: "RSI Neutral Consolidation", type: "info" as const, reason: "Bitcoin holding clean 4-hour EMA bands with RSI around 58." },
        { title: "Volatile Leveraged Risk", type: "warning" as const, reason: "Weekend derivatives funding rates are flashing moderate leverage." }
      ],
      technicalAnalysis: {
        support: "Bitcoin: $90,500 | Ethereum: $3,350 | Solana: $158",
        resistance: "Bitcoin: $94,800 | Ethereum: $3,580 | Solana: $178",
        rsiStatus: "Neutral Warm (58-62)",
        advice: "DCA altcoins holding strong structural support levels. Retain 15-20% stablecoin reserves."
      }
    };
  }
  return {
    ...base,
    headline: "KITARAN SUPER SOLANA CETUS LONJAKAN KECAIRAN LAYER-1",
    summary: "Keadaan pasaran kripto mempamerkan sentimen pengumpulan padu diterajui lonjakan dua angka Solana, menggalakkan aliran kecairan merentas rantaian.",
    advisoryFlags: [
      { title: "Sinyal Putaran Modal Altcoin", type: "success" as const, reason: "Solana menjadi pemangkin utama yang mengalirkan semula tunai pasaran ke aset Layer-1 sekunder." },
      { title: "Konsolidasi Neutral RSI", type: "info" as const, reason: "Bitcoin masih bertahan dengan sokongan dinamik EMA 4-jam, RSI stabil pada paras 58." },
      { title: "Beban Leveraj Volatiliti Tinggi", type: "warning" as const, reason: "Kadar pembiayaan pasaran niaga hadapan hujung minggu menunjukkan tanda leverage sederhana." }
    ],
    technicalAnalysis: {
      support: "Bitcoin: $90,500 | Ethereum: $3,350 | Solana: $158",
      resistance: "Bitcoin: $94,800 | Ethereum: $3,580 | Solana: $178",
      rsiStatus: "Neutral Sihat (58-62)",
      advice: "Fokus DCA pada altcoin bertaraf tinggi di paras sokongan. Jauhi FOMO, simpan 15-20% stablecoin."
    }
  };
}

export function getMockPortfolioFeedback(pricedAssets: any[], totalValue: number, isQuotaFallback = false) {
  const breakdown = pricedAssets.map(a => {
    const p = totalValue > 0 ? (a.value / totalValue) * 105 : 0;
    const rounded = Math.min(100, Math.round(p));
    return {
      symbol: a.symbol.toUpperCase(),
      currentPercent: rounded,
      recommendedPercent: a.symbol.toLowerCase() === 'btc' ? 50 : a.symbol.toLowerCase() === 'eth' ? 30 : 20,
      action: rounded > 50 ? "Trim Weight" as const : "Accumulate" as const
    };
  });
  const note = isQuotaFallback ? "[Adaptive Fallback Mode] " : "";
  return {
    diversificationScore: 68,
    riskLevel: "Moderate" as const,
    feedbackMarkdown: `${note}Your portfolio holds **$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}** in total capital.\n\nExposure is moderately concentrated. A minor allocation adjustment is recommended.`,
    suggestedRebalance: breakdown
  };
}

export function getMockForecasts(holdingsSummary: string, isQuotaFallback = false) {
  const note = isQuotaFallback ? " [Adaptive Fallback Mode]" : "";
  return [
    {
      horizon: "Daily", action: "Tactical accumulation on micro dips", sentimentPct: 68,
      sentimentLabel: `Moderately Bullish${note}`, accuracyEstimate: 92, neutralityRating: 95,
      riskFlags: [
        { type: "greenflag", label: "EMA support healthy", description: "Bitcoin maintains 4H EMA support band." },
        { type: "neutral", label: "Derivatives leverage consolidation", description: "Funding rates normalized, flash crash possibility <12%." }
      ],
      logicAnalysis: "Short term price feeds show heavy accumulation around major support grids.",
      recommendation: `For your holdings (${holdingsSummary}), accumulate small fractions on localized tests.`
    },
    {
      horizon: "Weekly", action: "Hedge and swing trading focus", sentimentPct: 54,
      sentimentLabel: `Neutral / Rangebound${note}`, accuracyEstimate: 81, neutralityRating: 90,
      riskFlags: [
        { type: "redflag", label: "Macro interest rate anxieties", description: "Upcoming Fed statements create volatility." },
        { type: "greenflag", label: "Spot ETF inflows consistent", description: "Long-term institutional inflows continue." }
      ],
      logicAnalysis: "Weekly timeframes display rangebound behavior between local support and resistance.",
      recommendation: "Retain 15-20% stablecoin power to buy weekly support points."
    },
    {
      horizon: "Monthly", action: "Constructive asset rotation", sentimentPct: 79,
      sentimentLabel: `Highly Bullish${note}`, accuracyEstimate: 72, neutralityRating: 88,
      riskFlags: [
        { type: "greenflag", label: "Retail capital rotation", description: "Secondary altcoin volume dominance points toward utility rotation." }
      ],
      logicAnalysis: "Monthly charts highlight standard cyclic consolidation with rotation into L1 high speed networks.",
      recommendation: "DCA high-conviction utility alts. Guard profits with trailing stops."
    },
    {
      horizon: "Quarterly", action: "Core long-term consolidation", sentimentPct: 83,
      sentimentLabel: `Highly Bullish${note}`, accuracyEstimate: 62, neutralityRating: 85,
      riskFlags: [
        { type: "greenflag", label: "Halving ecosystem compression", description: "Exchange reserves hit multi-year lows." }
      ],
      logicAnalysis: "Quarterly macro structure shows robust multi-month consolidation pattern.",
      recommendation: "Keep BTC and ETH at 60-70% of total assets. Rebalance speculative altcoin excess."
    },
    {
      horizon: "Yearly", action: "Strategic supply-shock exposure", sentimentPct: 87,
      sentimentLabel: `Extremely Bullish${note}`, accuracyEstimate: 48, neutralityRating: 92,
      riskFlags: [
        { type: "greenflag", label: "Global regulatory clarity", description: "OECD zones developing clear frameworks." }
      ],
      logicAnalysis: "Yearly outlook points to compounding supply scarcity.",
      recommendation: "HODL core spot allocations. Treat 20%+ pullbacks as buying opportunities."
    },
    {
      horizon: "Multi-Year", action: "Global decentralized standard transition", sentimentPct: 94,
      sentimentLabel: `Extremely Bullish${note}`, accuracyEstimate: 35, neutralityRating: 96,
      riskFlags: [
        { type: "greenflag", label: "Hyper-institutional adoption", description: "RWA tokenization settling on public blockchains." }
      ],
      logicAnalysis: "Over 5-10 year horizon, public crypto networks become global settlement hubs.",
      recommendation: "Commit to cold self-custody. Allow secular adoption to compound."
    }
  ];
}

// ── In-memory cache for Vercel serverless (survives warm starts) ──
export const cache: {
  markets: { data: any[] | null; ts: number };
  insights: Record<string, { data: any; ts: number }>;
} = {
  markets: { data: null, ts: 0 },
  insights: {},
};

export const CACHE_TTL_MARKETS = 15000;
export const CACHE_TTL_INSIGHTS = 300000;
