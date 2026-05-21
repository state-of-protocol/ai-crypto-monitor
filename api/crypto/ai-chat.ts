import { IncomingMessage, ServerResponse } from "http";
import { isDeepSeekAvailable, deepseekChat } from "../_utils/deepseek";
import { cache, FALLBACK_COINS } from "../_utils/fallback-data";

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

  const { messages, selectedCoinId } = parsed;
  if (!messages || !Array.isArray(messages)) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: "Messages array required" }));
  }

  let coinContext = "";
  if (cache.markets.data) {
    coinContext = cache.markets.data.slice(0, 8).map((c: any) =>
      `${c.name} (${c.symbol}): $${c.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 4 })} (Daily: ${c.changePercent24h.toFixed(2)}%)`
    ).join("\n");
  } else {
    coinContext = FALLBACK_COINS.map(c => `${c.name} (${c.symbol}): $${c.price} (${c.change}%)`).join("\n");
  }

  if (!isDeepSeekAvailable()) {
    const lastMsg = messages[messages.length - 1];
    let reply = `I have received your inquiry. AI is in offline simulation mode.\n\n${coinContext}\n\n`;
    if (selectedCoinId) {
      reply += `**${selectedCoinId.toUpperCase()}** shows solid consolidation with defensive support levels. Keep risk under 5% per trade.`;
    } else {
      reply += `Market shows healthy balance between altcoin breakouts and major asset consolidation. What would you like to deep dive?`;
    }
    return res.end(JSON.stringify({ reply }));
  }

  const chatHistoryContext = messages.map((m: any) =>
    `${m.role === "user" ? "User" : "AI Advisor"}: ${m.text}`
  ).join("\n\n");

  const activeCoinInfo = selectedCoinId
    ? `The user is focused on researching ${selectedCoinId.toUpperCase()}.`
    : `The user is viewing the macro market board.`;

  const prompt = `You are a prestigious crypto quantitative consultant.
Current market rates:
${coinContext}

${activeCoinInfo}

Conversation:
${chatHistoryContext}

Generate a data-grounded response. Keep tone sophisticated and informative.`;

  try {
    const reply = await deepseekChat(prompt);
    res.end(JSON.stringify({ reply: reply || "Unable to analyze. Please try again." }));
  } catch {
    let reply = `[Fallback Mode]\n\nLooking at recent prices:\n\n${coinContext}\n\n`;
    if (selectedCoinId) {
      reply += `**${selectedCoinId.toUpperCase()}** shows clean consolidation corridors. Follow programmatic risk allocations.`;
    } else {
      reply += `The asset grid continues rangebound absorption. What tokens are you focused on?`;
    }
    res.end(JSON.stringify({ reply }));
  }
}
