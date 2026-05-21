import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
app.use(express.json());
const PORT = 3000;

// ── API Routes (reuse Vercel-compatible handlers) ──
import marketsHandler from "./api/crypto/markets";
import historyHandler from "./api/crypto/history/[id]";

function adaptHandler(fn: (req: any, res: any) => Promise<any>) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    fn(req, res).catch(next);
  };
}

app.get("/api/crypto/markets", adaptHandler(marketsHandler));
app.get("/api/crypto/history/:id", adaptHandler(historyHandler));

// ── Vite dev middleware (local only) ──
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 [Crypto Monitor] Dev server at http://localhost:${PORT}`);
    console.log("   (Powered by CoinCap market data)");
  });
};

startServer();
