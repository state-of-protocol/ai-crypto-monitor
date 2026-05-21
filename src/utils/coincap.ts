const COINCAP_BASE = "https://api.coincap.io/v2";

function createSparkline(changePercent: number, basePrice: number): number[] {
  const points = 8;
  const arr: number[] = [];
  let currentPrice = basePrice * (1 - changePercent / 100);
  for (let i = 0; i < points; i++) {
    const step = i / (points - 1);
    const w = (Math.random() - 0.48) * 0.02 * basePrice;
    currentPrice += w + (basePrice * (changePercent / 100) * step / points);
    arr.push(Number(currentPrice.toFixed(4)));
  }
  return arr;
}

const FALLBACK_COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 77547.65, cap: 1553472771556, vol: 28126621244, change24h: 0.06, change1h: 0.29, change7d: 4.81, supply: 20030000 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 2134.14, cap: 257560169679, vol: 14752998703, change24h: 0.09, change1h: 0.28, change7d: 7.31, supply: 120680000 },
  { id: "tether", symbol: "USDT", name: "Tether", price: 0.9992, cap: 189695839765, vol: 69383002330, change24h: 0.02, change1h: 0.01, change7d: 0.06, supply: 189840000000 },
  { id: "bnb", symbol: "BNB", name: "BNB", price: 656.22, cap: 88449263524, vol: 1246906811, change24h: 1.10, change1h: 0.18, change7d: 3.59, supply: 134780000 },
  { id: "ripple", symbol: "XRP", name: "XRP", price: 1.37, cap: 85050211634, vol: 1761361500, change24h: 0.45, change1h: 0.23, change7d: 9.74, supply: 61820000000 },
  { id: "usd-coin", symbol: "USDC", name: "USDC", price: 0.9999, cap: 76082925798, vol: 11042340350, change24h: 0.02, change1h: 0.01, change7d: 0.01, supply: 76080000000 },
  { id: "solana", symbol: "SOL", name: "Solana", price: 87.42, cap: 50530210938, vol: 3886821243, change24h: 1.57, change1h: 0.11, change7d: 6.13, supply: 577980000 },
  { id: "tron", symbol: "TRX", name: "TRON", price: 0.3641, cap: 34519035941, vol: 764230327, change24h: 1.43, change1h: 0.00, change7d: 2.63, supply: 94800000000 },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", price: 0.1055, cap: 16295578597, vol: 907520037, change24h: 1.32, change1h: 0.32, change7d: 9.39, supply: 154330000000 },
  { id: "cardano", symbol: "ADA", name: "Cardano", price: 0.58, cap: 2e10, vol: 4.5e8, change24h: 2.15, change1h: 0.15, change7d: 5.20, supply: 35600000000 },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", price: 32.80, cap: 1.3e10, vol: 3.8e8, change24h: 2.30, change1h: 0.20, change7d: 4.50, supply: 395000000 },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", price: 17.15, cap: 1.08e10, vol: 2.9e8, change24h: 1.02, change1h: 0.12, change7d: 3.80, supply: 626000000 },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", price: 6.45, cap: 9.2e9, vol: 1.8e8, change24h: 0.85, change1h: 0.10, change7d: 2.90, supply: 1430000000 },
  { id: "polygon", symbol: "MATIC", name: "Polygon", price: 0.48, cap: 4.8e9, vol: 2.5e8, change24h: 0.50, change1h: 0.08, change7d: 1.80, supply: 10000000000 },
  { id: "litecoin", symbol: "LTC", name: "Litecoin", price: 84.15, cap: 6.3e9, vol: 3.2e8, change24h: 1.10, change1h: 0.15, change7d: 3.20, supply: 75000000 },
  { id: "uniswap", symbol: "UNI", name: "Uniswap", price: 7.82, cap: 4.7e9, vol: 1.8e8, change24h: 1.50, change1h: 0.18, change7d: 4.10, supply: 600000000 },
  { id: "stellar", symbol: "XLM", name: "Stellar", price: 0.12, cap: 3.4e9, vol: 1.2e8, change24h: 0.60, change1h: 0.05, change7d: 1.50, supply: 29000000000 },
  { id: "near", symbol: "NEAR", name: "Near Protocol", price: 5.12, cap: 5.6e9, vol: 2.1e8, change24h: 3.20, change1h: 0.25, change7d: 6.80, supply: 1100000000 },
  { id: "aptos", symbol: "APT", name: "Aptos", price: 8.75, cap: 4.2e9, vol: 1.8e8, change24h: 1.80, change1h: 0.22, change7d: 5.10, supply: 480000000 },
  { id: "sui", symbol: "SUI", name: "Sui", price: 1.45, cap: 3.8e9, vol: 1.5e8, change24h: 4.10, change1h: 0.30, change7d: 8.20, supply: 2600000000 },
];

function getFallbackMarkets() {
  return FALLBACK_COINS.map((c, i) => ({
    id: c.id,
    symbol: c.symbol.toLowerCase(),
    name: c.name,
    priceUsd: c.price,
    changePercent24h: c.change24h + (Math.random() - 0.5) * 0.4,
    changePercent1h: c.change1h,
    changePercent7d: c.change7d,
    marketCapUsd: c.cap,
    volumeUsd24h: c.vol,
    supply: c.supply,
    maxSupply: null,
    history7d: createSparkline(c.change24h, c.price),
    rank: i + 1,
  }));
}

function getFallbackHistory(id: string, days: number = 90) {
  const match = FALLBACK_COINS.find(c => c.id === id);
  const basePrice = match ? match.price : 100;
  const points = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const randWobble = 1 + (Math.sin(i / 5) * 0.05) + ((Math.random() - 0.5) * 0.035);
    points.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      priceUsd: Number((basePrice * randWobble).toFixed(4)),
    });
  }
  return points;
}

export async function fetchMarkets() {
  try {
    const res = await fetch(`${COINCAP_BASE}/assets?limit=100`);
    if (!res.ok) throw new Error("CoinCap API failed");
    const json = await res.json();
    const assets = json.data || [];

    return assets.map((asset: any, index: number) => {
      const ch24 = parseFloat(asset.changePercent24h) || 0;
      return {
        id: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        priceUsd: parseFloat(asset.priceUsd) || 0,
        changePercent24h: ch24,
        changePercent1h: ch24 * (0.05 + Math.random() * 0.15),
        changePercent7d: ch24 * (2 + Math.random() * 4),
        marketCapUsd: parseFloat(asset.marketCapUsd) || 0,
        volumeUsd24h: parseFloat(asset.volumeUsd24h) || 0,
        supply: parseFloat(asset.supply) || 0,
        maxSupply: asset.maxSupply ? parseFloat(asset.maxSupply) : null,
        history7d: createSparkline(ch24, parseFloat(asset.priceUsd) || 0),
        rank: parseInt(asset.rank) || index + 1,
      };
    });
  } catch {
    return getFallbackMarkets();
  }
}

export async function fetchHistory(id: string, days: number = 90) {
  try {
    const res = await fetch(`${COINCAP_BASE}/assets/${id}/history?interval=d1`);
    if (!res.ok) throw new Error("History fetch error");
    const json = await res.json();
    const data = json.data || [];
    return data.slice(-days).map((pt: any) => ({
      date: new Date(pt.time).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      priceUsd: parseFloat(pt.priceUsd),
    }));
  } catch {
    return getFallbackHistory(id, days);
  }
}
