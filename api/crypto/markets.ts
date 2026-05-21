import { IncomingMessage, ServerResponse } from "http";
import { getFallbackCoins100, cache, CACHE_TTL_MARKETS } from "../_utils/fallback-data";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  const now = Date.now();
  if (cache.markets.data && now - cache.markets.ts < CACHE_TTL_MARKETS) {
    res.writeHead(200);
    return res.end(JSON.stringify(cache.markets.data));
  }

  try {
    const response = await fetch("https://api.coincap.io/v2/assets?limit=100");
    if (!response.ok) throw new Error("CoinCap API failed");
    const json = await response.json();
    const assets = json.data || [];

    const formatted = assets.map((asset: any, index: number) => ({
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      priceUsd: parseFloat(asset.priceUsd) || 0,
      changePercent24h: parseFloat(asset.changePercent24h) || 0,
      marketCapUsd: parseFloat(asset.marketCapUsd) || 0,
      volumeUsd24h: parseFloat(asset.volumeUsd24h) || 0,
      supply: parseFloat(asset.supply) || 0,
      maxSupply: asset.maxSupply ? parseFloat(asset.maxSupply) : null,
      history7d: (() => {
        const price = parseFloat(asset.priceUsd) || 0;
        const change = parseFloat(asset.changePercent24h) || 0;
        const points = 8;
        const arr: number[] = [];
        let currentPrice = price * (1 - change / 100);
        for (let i = 0; i < points; i++) {
          const step = i / (points - 1);
          const w = (Math.random() - 0.48) * 0.02 * price;
          currentPrice += w + (price * (change / 100) * step / points);
          arr.push(Number(currentPrice.toFixed(4)));
        }
        return arr;
      })(),
      rank: parseInt(asset.rank) || index + 1,
    }));

    cache.markets = { data: formatted, ts: now };
    res.writeHead(200);
    res.end(JSON.stringify(formatted));
  } catch {
    const fallback = getFallbackCoins100();
    cache.markets = { data: fallback, ts: now };
    res.writeHead(200);
    res.end(JSON.stringify(fallback));
  }
}
