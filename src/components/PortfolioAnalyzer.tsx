import { useState, useMemo } from "react";
import { PortfolioItem, CoinData, AiPortfolioFeedback } from "../types";
import { Wallet, Trash2, PieChart, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

interface PortfolioAnalyzerProps {
  coins: CoinData[];
  portfolio: PortfolioItem[];
  onRemovePortfolioItem: (coinId: string) => void;
  onUpdatePortfolioItemAmount: (coinId: string, amount: number) => void;
  onAuditPortfolio: () => Promise<void>;
  auditFeedback: AiPortfolioFeedback | null;
  auditing: boolean;
  fiatCurrency: "MYR" | "USD" | "CNY";
  rateMyr: number;
  rateCny: number;
  portfolioHistory: { date: string; valueDisplay: number }[];
  loadingPortfolioHistory: boolean;
}

export default function PortfolioAnalyzer({
  coins,
  portfolio,
  onRemovePortfolioItem,
  onUpdatePortfolioItemAmount,
  onAuditPortfolio,
  auditFeedback,
  auditing,
  fiatCurrency,
  rateMyr,
  rateCny,
  portfolioHistory,
  loadingPortfolioHistory
}: PortfolioAnalyzerProps) {
  const currencySymbol = fiatCurrency === "MYR" ? "RM" : fiatCurrency === "CNY" ? "¥" : "$";
  const [activeSubTab, setActiveSubTab] = useState<"audit" | "history">("history");

  // Calculate current asset values and total portfolio worth
  const portfolioWithMetrics = portfolio.map((item) => {
    const coinInfo = coins.find((c) => c.id === item.coinId);
    const price = coinInfo ? coinInfo.priceUsd : 0;
    const valueUsd = item.amount * price;
    const valueDisplay = fiatCurrency === "MYR" ? valueUsd * rateMyr : fiatCurrency === "CNY" ? valueUsd * rateCny : valueUsd;
    
    return {
      ...item,
      price: fiatCurrency === "MYR" ? price * rateMyr : fiatCurrency === "CNY" ? price * rateCny : price,
      valueUsd,
      valueDisplay
    };
  });

  // Analyze portfolio dynamics over 30-day timeline
  const portfolioPriceStats = useMemo(() => {
    if (!portfolioHistory || portfolioHistory.length === 0) {
      return { min: 0, max: 0, deltaPercent: 0 };
    }
    const values = portfolioHistory.map((d) => d.valueDisplay);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const start = values[0] || 0;
    const end = values[values.length - 1] || 0;
    const deltaPercent = start > 0 ? ((end - start) / start) * 100 : 0;

    return {
      min,
      max,
      deltaPercent
    };
  }, [portfolioHistory]);

  const portfolioYDomain = useMemo(() => {
    if (!portfolioHistory || portfolioHistory.length === 0) return [0, 100];
    const values = portfolioHistory.map((d) => d.valueDisplay);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.1 || min * 0.05;
    return [Math.max(0, min - pad), max + pad];
  }, [portfolioHistory]);

  const totalValueUsd = portfolioWithMetrics.reduce((sum, item) => sum + item.valueUsd, 0);
  const totalValueDisplay = fiatCurrency === "MYR" ? totalValueUsd * rateMyr : fiatCurrency === "CNY" ? totalValueUsd * rateCny : totalValueUsd;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Conservative":
        return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      case "Moderate":
        return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      case "Aggressive":
        return "text-orange-400 border-orange-500/20 bg-orange-500/5";
      default:
        return "text-rose-400 border-rose-500/20 bg-rose-500/5";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 shadow-xl flex flex-col h-full">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4 shrink-0">
        <div>
          <div className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-tight">
              AI Asset Allocator & Audit
            </h3>
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Evaluate concentration risk, diversification, and rebalance targets
          </p>
        </div>

        {portfolio.length > 0 && (
          <button
            onClick={onAuditPortfolio}
            disabled={auditing || totalValueUsd === 0}
            className="text-[10px] font-mono bg-emerald-500 hover:bg-emerald-600 disabled:opacity-45 text-zinc-950 px-3 py-1.5 rounded font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1 shrink-0"
          >
            {auditing ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" /> Auditing...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" /> Audit Vault
              </>
            )}
          </button>
        )}
      </div>

      {portfolio.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500 my-auto">
          <PieChart className="w-8 h-8 text-zinc-700 mb-3" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
            Empty Portfolio Vault
          </h4>
          <p className="text-[11px] text-zinc-500 max-w-xs mt-1 leading-normal">
            Click the "+" icon on the active asset watchlist table rows to add assets into your experimental portfolio analysis vault.
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {/* Asset holdings editor list */}
          <div>
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2">
              <span>Holding Allocation Vault</span>
              <span className="text-zinc-300 font-semibold">
                Total worth: {currencySymbol}{totalValueDisplay.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {portfolioWithMetrics.map((item) => {
                const weight = totalValueUsd > 0 ? (item.valueUsd / totalValueUsd) * 100 : 0;
                return (
                  <div
                    key={item.coinId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-zinc-950/60 border border-zinc-900 leading-none p-2.5 rounded-lg hover:border-zinc-850"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-center flex items-center justify-center text-zinc-400 font-mono">
                        {item.symbol.toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-zinc-100 block">{item.name}</span>
                        <span className="text-[9px] text-zinc-500 font-mono mt-0.5 block">
                          Weight: {weight.toFixed(1)}% ({currencySymbol}{item.valueDisplay.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.amount || ""}
                        onChange={(e) => {
                          const val = Math.max(0, parseFloat(e.target.value) || 0);
                          onUpdatePortfolioItemAmount(item.coinId, val);
                        }}
                        className="w-20 bg-zinc-900 border border-zinc-800 rounded font-mono text-xs px-2 py-1 focus:outline-none focus:border-emerald-500/40 text-right text-zinc-200"
                        placeholder="Amount"
                      />
                      <button
                        onClick={() => onRemovePortfolioItem(item.coinId)}
                        className="p-1 text-zinc-650 hover:text-rose-400 hover:bg-zinc-900 rounded cursor-pointer transition-all"
                        title="Remove holding"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-zinc-900" />

          {/* Tab Selector for analysis & history */}
          <div className="flex bg-zinc-900/60 p-0.5 border border-zinc-900 rounded-lg gap-1 shadow-inner">
            <button
              onClick={() => setActiveSubTab("history")}
              className={`flex-1 py-1.5 px-3 text-xs rounded font-semibold tracking-tight cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === "history"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Worth Curve (30D)
            </button>
            <button
              onClick={() => setActiveSubTab("audit")}
              className={`flex-1 py-1.5 px-3 text-xs rounded font-semibold tracking-tight cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === "audit"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Strategic Audit
            </button>
          </div>

          {/* Target views based on selected sub-tab */}
          {activeSubTab === "history" ? (
            <div className="space-y-4">
              {/* Highlight summary cards of historical curve */}
              {portfolioHistory && portfolioHistory.length > 0 && (
                <div className="grid grid-cols-3 gap-2 border border-zinc-900 bg-zinc-950/70 p-2 rounded-lg">
                  <div className="text-center font-mono">
                    <span className="text-[8px] text-zinc-650 uppercase tracking-widest block">30D Low</span>
                    <span className="text-[11px] font-bold text-zinc-300 block mt-0.5">
                      {currencySymbol}{portfolioPriceStats.min.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-center font-mono border-x border-zinc-900">
                    <span className="text-[8px] text-zinc-650 uppercase tracking-widest block">30D High</span>
                    <span className="text-[11px] font-bold text-zinc-300 block mt-0.5">
                      {currencySymbol}{portfolioPriceStats.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className={`text-center font-mono ${
                    portfolioPriceStats.deltaPercent >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    <span className="text-[8px] text-zinc-650 uppercase tracking-widest block">30D Returns</span>
                    <span className="text-[11px] font-black block mt-0.5">
                      {portfolioPriceStats.deltaPercent >= 0 ? "↑" : "↓"} {Math.abs(portfolioPriceStats.deltaPercent).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Area chart drawing board */}
              <div className="h-[200px] w-full relative">
                {loadingPortfolioHistory ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-950/20 backdrop-blur-sm z-10">
                    <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin" />
                    <span className="text-[10px] text-zinc-500 font-mono animate-pulse">Syncing assets history...</span>
                  </div>
                ) : portfolioHistory.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-zinc-500 font-mono text-[10px] text-center p-4">
                    <AlertTriangle className="w-6 h-6 text-zinc-700" />
                    <span>Synchronizing historical index database...</span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPortfolioPriceNew" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.16} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        stroke="#52525b"
                        style={{ fontSize: "9px", fontFamily: "monospace" }}
                        tickFormatter={(str) => {
                          return typeof str === "string" ? str.slice(-5) : str;
                        }}
                      />
                      <YAxis
                        domain={portfolioYDomain}
                        tickLine={false}
                        axisLine={false}
                        stroke="#52525b"
                        tickFormatter={(v) => {
                          if (v >= 1000) return `${currencySymbol}${(v / 1000).toFixed(0)}k`;
                          return `${currencySymbol}${v.toFixed(0)}`;
                        }}
                        style={{ fontSize: "9px", fontFamily: "monospace" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#09090b",
                          borderColor: "#27272a",
                          borderRadius: "6px",
                          fontSize: "11px",
                          color: "#f4f4f5"
                        }}
                        labelStyle={{ fontFamily: "monospace", color: "#a1a1aa", marginBottom: "2px" }}
                        itemStyle={{ fontFamily: "monospace" }}
                        formatter={(val: number) => [
                          `${currencySymbol}${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                          "Total Worth"
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="valueDisplay"
                        stroke="#10b981"
                        strokeWidth={1.8}
                        fillOpacity={1}
                        fill="url(#colorPortfolioPriceNew)"
                        id="portfolio-history-filled"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono text-center leading-relaxed">
                indicative evaluation derived dynamically from daily asset prices.
              </p>
            </div>
          ) : (
            // Verification / intelligence results
            auditing ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-center">
                <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
                <span className="text-xs text-zinc-500 font-mono">
                  Gemini is auditing risk distributions...
                </span>
              </div>
            ) : auditFeedback ? (
            <div className="space-y-4">
              {/* Top feedback score row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-lg text-center relative overflow-hidden group">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase block">
                    Diversification Rank
                  </span>
                  <span className="text-2xl font-black font-mono text-emerald-400 block mt-1">
                    {auditFeedback.diversificationScore}/100
                  </span>
                </div>
                <div className={`border p-3 rounded-lg text-center ${getRiskColor(auditFeedback.riskLevel)}`}>
                  <span className="text-[9px] text-zinc-500 font-mono uppercase block">
                    Overall Risk Rating
                  </span>
                  <span className="text-xs font-black block mt-2.5 uppercase tracking-wide">
                    {auditFeedback.riskLevel}
                  </span>
                </div>
              </div>

              {/* Suggestions rebalance board */}
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-2">
                  Gemini Ideal Asset Allocations
                </span>
                <div className="space-y-1.5">
                  <div className="grid grid-cols-4 text-[9px] text-zinc-600 font-mono uppercase px-2 mb-1">
                    <span>Symbol</span>
                    <span className="text-right">Current</span>
                    <span className="text-right">Ideal</span>
                    <span className="text-center">Directive</span>
                  </div>
                  
                  {auditFeedback.suggestedRebalance.map((item, idx) => {
                    const actionColors = 
                      item.action === "Accumulate" ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" :
                      item.action === "Trim Weight" ? "text-rose-400 bg-rose-500/5 border-rose-500/10" :
                      "text-zinc-400 bg-zinc-900/50 border-zinc-900";

                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-4 items-center bg-zinc-950 leading-none p-2 rounded-md border border-zinc-900 text-xs font-mono"
                      >
                        <span className="font-bold text-zinc-300 pl-1">{item.symbol.toUpperCase()}</span>
                        <span className="text-right text-zinc-500">{item.currentPercent.toFixed(0)}%</span>
                        <span className="text-right text-emerald-500 font-semibold">{item.recommendedPercent.toFixed(0)}%</span>
                        <span className={`text-[9px] py-0.5 rounded text-center border font-semibold scale-95 origin-center ${actionColors}`}>
                          {item.action}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* feedback narrative */}
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-1">
                  Strategy Officer Evaluation
                </span>
                <div className="bg-zinc-950/60 border border-zinc-900 p-2.5 rounded-lg text-xs text-zinc-300 leading-relaxed max-h-[140px] overflow-y-auto font-mono">
                  {auditFeedback.feedbackMarkdown}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-zinc-900 bg-zinc-950/50 rounded-lg p-3 text-center text-xs text-zinc-500 font-mono py-8">
              <span className="block mb-1 font-semibold text-zinc-400">Vault audit ready.</span>
              Specify amounts and trigger the asset strategy review process above to evaluate exposure thresholds.
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
