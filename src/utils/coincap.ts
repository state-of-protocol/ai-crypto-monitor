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

export async function fetchMarkets() {
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
}

export async function fetchHistory(id: string, days: number = 90) {
  const res = await fetch(`${COINCAP_BASE}/assets/${id}/history?interval=d1`);
  if (!res.ok) throw new Error("History fetch error");
  const json = await res.json();
  const data = json.data || [];
  return data.slice(-days).map((pt: any) => ({
    date: new Date(pt.time).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    priceUsd: parseFloat(pt.priceUsd),
  }));
}
