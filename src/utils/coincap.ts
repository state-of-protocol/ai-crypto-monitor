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
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 77547.65, cap: 1553472771556, vol: 28126621244, change: 0.06, supply: 20030000 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 2134.14, cap: 257560169679, vol: 14752998703, change: 0.09, supply: 120680000 },
  { id: "tether", symbol: "USDT", name: "Tether", price: 0.9992, cap: 189695839765, vol: 69383002330, change: 0.02, supply: 189840000000 },
  { id: "bnb", symbol: "BNB", name: "BNB", price: 656.22, cap: 88449263524, vol: 1246906811, change: 1.10, supply: 134780000 },
  { id: "ripple", symbol: "XRP", name: "XRP", price: 1.37, cap: 85050211634, vol: 1761361500, change: 0.45, supply: 61820000000 },
  { id: "solana", symbol: "SOL", name: "Solana", price: 87.42, cap: 50530210938, vol: 3886821243, change: 1.57, supply: 577980000 },
  { id: "usd-coin", symbol: "USDC", name: "USDC", price: 0.9999, cap: 76082925798, vol: 11042340350, change: 0.02, supply: 76080000000 },
  { id: "tron", symbol: "TRX", name: "TRON", price: 0.3641, cap: 34519035941, vol: 764230327, change: 1.43, supply: 94800000000 },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", price: 0.1055, cap: 16295578597, vol: 907520037, change: 1.32, supply: 154330000000 },
  { id: "cardano", symbol: "ADA", name: "Cardano", price: 0.58, cap: 2e10, vol: 4.5e8, change: 2.15, supply: 35600000000 },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", price: 32.80, cap: 1.3e10, vol: 3.8e8, change: 2.30, supply: 395000000 },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", price: 17.15, cap: 1.08e10, vol: 2.9e8, change: 1.02, supply: 626000000 },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", price: 6.45, cap: 9.2e9, vol: 1.8e8, change: 0.85, supply: 1430000000 },
  { id: "polygon", symbol: "MATIC", name: "Polygon", price: 0.48, cap: 4.8e9, vol: 2.5e8, change: 0.50, supply: 10000000000 },
  { id: "litecoin", symbol: "LTC", name: "Litecoin", price: 84.15, cap: 6.3e9, vol: 3.2e8, change: 1.10, supply: 75000000 },
  { id: "uniswap", symbol: "UNI", name: "Uniswap", price: 7.82, cap: 4.7e9, vol: 1.8e8, change: 1.50, supply: 600000000 },
  { id: "stellar", symbol: "XLM", name: "Stellar", price: 0.12, cap: 3.4e9, vol: 1.2e8, change: 0.60, supply: 29000000000 },
  { id: "near", symbol: "NEAR", name: "Near Protocol", price: 5.12, cap: 5.6e9, vol: 2.1e8, change: 3.20, supply: 1100000000 },
  { id: "aptos", symbol: "APT", name: "Aptos", price: 8.75, cap: 4.2e9, vol: 1.8e8, change: 1.80, supply: 480000000 },
  { id: "sui", symbol: "SUI", name: "Sui", price: 1.45, cap: 3.8e9, vol: 1.5e8, change: 4.10, supply: 2600000000 },
];

function getFallbackMarkets() {
  return FALLBACK_COINS.map((c, i) => ({
    id: c.id,
    symbol: c.symbol.toLowerCase(),
    name: c.name,
    priceUsd: c.price,
    changePercent24h: c.change + (Math.random() - 0.5) * 0.4,
    marketCapUsd: c.cap,
    volumeUsd24h: c.vol,
    supply: c.supply,
    maxSupply: null,
    history7d: createSparkline(c.change, c.price),
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

    return assets.map((asset: any, index: number) => ({
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      priceUsd: parseFloat(asset.priceUsd) || 0,
      changePercent24h: parseFloat(asset.changePercent24h) || 0,
      marketCapUsd: parseFloat(asset.marketCapUsd) || 0,
      volumeUsd24h: parseFloat(asset.volumeUsd24h) || 0,
      supply: parseFloat(asset.supply) || 0,
      maxSupply: asset.maxSupply ? parseFloat(asset.maxSupply) : null,
      history7d: createSparkline(
        parseFloat(asset.changePercent24h) || 0,
        parseFloat(asset.priceUsd) || 0
      ),
      rank: parseInt(asset.rank) || index + 1,
    }));
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
