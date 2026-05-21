import { IncomingMessage, ServerResponse } from "http";
import { isDeepSeekAvailable, deepseekJson } from "../_utils/deepseek";
import { getMockPortfolioFeedback, cache, FALLBACK_COINS } from "../_utils/fallback-data";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.writeHead(405);
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  let body = "";
  for await (const chunk of req) body += chunk;

  let parsed: any;
  try {
    parsed = JSON.parse(body);
  } catch {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: "Invalid JSON" }));
  }

  const { assets } = parsed;
  if (!assets || !Array.isArray(assets) || assets.length === 0) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: "Portfolio assets array required" }));
  }

  const markets = cache.markets.data || FALLBACK_COINS;
  let totalValue = 0;
  const pricedAssets = assets.map((a: any) => {
    const marketInfo = markets.find((m: any) => m.symbol?.toLowerCase() === a.symbol?.toLowerCase() || m.id === a.coinId);
    const price = marketInfo ? (marketInfo.priceUsd ?? marketInfo.price) : 0;
    const value = a.amount * price;
    totalValue += value;
    return { ...a, price, value };
  });

  const pricedAssetsFormatted = pricedAssets.map((a: any) =>
    `${a.amount} ${a.symbol.toUpperCase()} (Value: $${a.value.toFixed(2)})`
  ).join(", ");

  if (!isDeepSeekAvailable()) {
    return res.end(JSON.stringify(getMockPortfolioFeedback(pricedAssets, totalValue)));
  }

  const prompt = `Evaluate this crypto portfolio:
Total Value: $${totalValue.toFixed(2)}
Holdings: ${pricedAssetsFormatted}

Return valid JSON: {
  "diversificationScore": number,
  "riskLevel": "Conservative"|"Moderate"|"Aggressive"|"Highly Speculative",
  "feedbackMarkdown": "...",
  "suggestedRebalance": [{ "symbol": "BTC", "currentPercent": number, "recommendedPercent": number, "action": "Hold"|"Trim Weight"|"Accumulate"|"Complete Reallocate" }]
}`;

  try {
    const data = await deepseekJson<any>(prompt);
    if (data && data.diversificationScore !== undefined) {
      return res.end(JSON.stringify(data));
    }
    throw new Error("Invalid response");
  } catch {
    res.end(JSON.stringify(getMockPortfolioFeedback(pricedAssets, totalValue, true)));
  }
}
