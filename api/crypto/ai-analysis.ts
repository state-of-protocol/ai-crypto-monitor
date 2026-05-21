import { IncomingMessage, ServerResponse } from "http";
import { isDeepSeekAvailable, deepseekJson } from "../_utils/deepseek";
import { getMockInsight, cache, CACHE_TTL_INSIGHTS, FALLBACK_COINS } from "../_utils/fallback-data";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  const url = new URL(req.url || "", "http://localhost");
  const lang = ((url.searchParams.get("lang") || "MY").toUpperCase());
  const validLangs = ["MY", "ENG", "CN"];
  const targetLang = validLangs.includes(lang) ? lang : "MY";

  const now = Date.now();
  if (cache.insights[targetLang] && now - cache.insights[targetLang].ts < CACHE_TTL_INSIGHTS) {
    res.writeHead(200);
    return res.end(JSON.stringify(cache.insights[targetLang].data));
  }

  let coinContext = "";
  try {
    const m = cache.markets.data || FALLBACK_COINS;
    coinContext = m.slice(0, 8).map((c: any) =>
      `${c.name} (${c.symbol}): $${c.priceUsd?.toFixed(2) || c.price} (${(c.changePercent24h ?? c.change)?.toFixed(2)}% 24h)`
    ).join(", ");
  } catch {
    coinContext = "Bitcoin (BTC): $92,400, Ethereum (ETH): $3,420, Solana (SOL): $168";
  }

  if (!isDeepSeekAvailable()) {
    const mock = getMockInsight(targetLang);
    cache.insights[targetLang] = { data: mock, ts: now };
    res.writeHead(200);
    return res.end(JSON.stringify(mock));
  }

  const langInstruction = targetLang === "MY" ? "You MUST write headline, summary, advisoryFlags, and technicalAnalysis ENTIRELY in Bahasa Malaysia."
    : targetLang === "CN" ? "You MUST write ALL text ENTIRELY in Simplified Chinese."
    : "You MUST write ALL text ENTIRELY in English.";

  const prompt = `You are a world-class crypto analyst. Generate an executive market intelligence report.
Current market snapshot: ${coinContext}
${langInstruction}
Respond with valid JSON only: { "sentiment": "Bullish"|"Bearish"|"Neutral", "score": number, "headline": "...", "summary": "...",
"advisoryFlags": [{ "title": "...", "type": "warning"|"info"|"success", "reason": "..." }],
"technicalAnalysis": { "support": "...", "resistance": "...", "rsiStatus": "...", "advice": "..." } }`;

  try {
    const data = await deepseekJson<any>(prompt);
    if (data && data.sentiment) {
      cache.insights[targetLang] = { data, ts: now };
      res.writeHead(200);
      return res.end(JSON.stringify(data));
    }
    throw new Error("Invalid response");
  } catch {
    const mock = getMockInsight(targetLang);
    mock.headline = targetLang === "MY" ? "[Sandaran] " : targetLang === "CN" ? "[备份] " : "[Fallback] " + mock.headline;
    cache.insights[targetLang] = { data: mock, ts: now };
    res.writeHead(200);
    res.end(JSON.stringify(mock));
  }
}
