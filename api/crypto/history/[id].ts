import { IncomingMessage, ServerResponse } from "http";
import { getMockHistoryPoints, FALLBACK_COINS } from "../../_utils/fallback-data";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  const url = new URL(req.url || "", "http://localhost");
  const segments = url.pathname.split("/").filter(Boolean);
  const id = segments[segments.length - 1];
  const days = parseInt(url.searchParams.get("days") || "90");

  try {
    const coincapId = id;
    const response = await fetch(`https://api.coincap.io/v2/assets/${coincapId}/history?interval=d1`);
    if (!response.ok) throw new Error("History fetch error");
    const json = await response.json();
    const historyData = json.data || [];
    const formatted = historyData.slice(-days).map((pt: any) => ({
      date: new Date(pt.time).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      priceUsd: parseFloat(pt.priceUsd),
    }));
    res.writeHead(200);
    res.end(JSON.stringify(formatted));
  } catch {
    const mock = getMockHistoryPoints(id, days);
    res.writeHead(200);
    res.end(JSON.stringify(mock));
  }
}
