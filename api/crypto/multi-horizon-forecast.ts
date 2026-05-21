import { IncomingMessage, ServerResponse } from "http";
import { isDeepSeekAvailable, deepseekJson } from "../_utils/deepseek";
import { getMockForecasts, cache } from "../_utils/fallback-data";

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
  const holdingsSummary = assets && Array.isArray(assets) && assets.length > 0
    ? assets.map((a: any) => `${a.amount} ${a.symbol.toUpperCase()}`).join(", ")
    : "No active holdings (market baseline view)";

  if (!isDeepSeekAvailable()) {
    return res.end(JSON.stringify(getMockForecasts(holdingsSummary)));
  }

  const prompt = `You are a chief crypto strategy officer. Build a multi-horizon forecast.
User Portfolio: ${holdingsSummary}
Current markets: ${cache.markets.data ? JSON.stringify(cache.markets.data.slice(0, 15)) : "BTC $92.4k, ETH $3.4k, SOL $168"}

Generate exactly 6 horizon cards: Daily, Weekly, Monthly, Quarterly, Yearly, Multi-Year.
Each card: horizon, action, sentimentPct(0-100), sentimentLabel, accuracyEstimate(%), neutralityRating, riskFlags[{type:"greenflag"|"redflag"|"neutral", label, description}], logicAnalysis, recommendation.

Return a JSON array only.`;

  try {
    const data = await deepseekJson<any[]>(prompt);
    if (data && data.length === 6) {
      return res.end(JSON.stringify(data));
    }
    throw new Error("Invalid response");
  } catch {
    res.end(JSON.stringify(getMockForecasts(holdingsSummary, true)));
  }
}
