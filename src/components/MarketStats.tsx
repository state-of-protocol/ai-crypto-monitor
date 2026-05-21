import { useState } from "react";
import { CoinData, AiMarketInsight } from "../types";
import { TrendingUp, BarChart3, PieChart, ShieldAlert, Sparkles, Globe } from "lucide-react";

interface MarketStatsProps {
  coins: CoinData[];
  fiatCurrency: "MYR" | "USD" | "CNY";
  rateMyr: number;
  rateCny: number;
  aiInsight: AiMarketInsight | null;
  loadingInsight: boolean;
}

const LOCAL_STRINGS = {
  MY: {
    headerTitle: "STATISTIK UTAMA PASARAN",
    headerSubtitle: "Analisis kecairan L1 dan dominasi global secara lancar",
    capLabel: "KAPITALISASI TERCATAT",
    capSub: "↑ 1.2% berbanding 24 jam lalu",
    volLabel: "YANG BERGABUNG 24H VOL",
    volSub: "Pasaran L1 berpusing aktif",
    domLabel: "NISBAH DOMINASI BTC",
    domSub: "Syer Bitcoin berbanding pasaran utama",
    aiLabel: "SENTIMEN AI GEMINI",
    neutral: "Neutral",
    noInsight: "Tiada laporan makro lagi",
  },
  ENG: {
    headerTitle: "MARKET MACRO STATS",
    headerSubtitle: "Seamless tracking of global dominance, capital levels, and volumes",
    capLabel: "LISTED CAPITALIZATION",
    capSub: "↑ 1.2% compared to 24h ago",
    volLabel: "AGGREGATED 24H VOL",
    volSub: "Active rotation across L1 networks",
    domLabel: "BTC DOMINANCE RATIO",
    domSub: "Bitcoin share of top listed assets cap",
    aiLabel: "GEMINI AI SENTIMENT",
    neutral: "Neutral",
    noInsight: "No macro alerts generated yet",
  },
  CN: {
    headerTitle: "全球加密宏观数据统计",
    headerSubtitle: "实时追踪多链市值分布、流动性变化及比特币主导率波动",
    capLabel: "总上市市值",
    capSub: "较 24 小时前 ↑ 1.2%",
    volLabel: "24h 总体合并交易量",
    volSub: "Layer-1 底层网络间的主动资金轮动",
    domLabel: "比特币市值中心度占比",
    domSub: "比特币在主要前列代币市值中的支配份额",
    aiLabel: "GEMINI 智能多空情绪",
    neutral: "中性",
    noInsight: "暂未生成宏观预测数据",
  }
};

export default function MarketStats({
  coins,
  fiatCurrency,
  rateMyr,
  rateCny,
  aiInsight,
  loadingInsight
}: MarketStatsProps) {
  const [language, setLanguage] = useState<"MY" | "ENG" | "CN">("MY");
  const t = LOCAL_STRINGS[language];

  // Calculate dynamic metrics
  const totalCapUsd = coins.reduce((acc, c) => acc + c.marketCapUsd, 0);
  const totalVolUsd = coins.reduce((acc, c) => acc + c.volumeUsd24h, 0);
  
  const btcCoin = coins.find(c => c.symbol.toLowerCase() === "btc");
  const btcDominance = btcCoin && totalCapUsd > 0 
    ? (btcCoin.marketCapUsd / totalCapUsd) * 100 
    : 54.8;

  const displayCap = fiatCurrency === "MYR" ? totalCapUsd * rateMyr : fiatCurrency === "CNY" ? totalCapUsd * rateCny : totalCapUsd;
  const displayVol = fiatCurrency === "MYR" ? totalVolUsd * rateMyr : fiatCurrency === "CNY" ? totalVolUsd * rateCny : totalVolUsd;
  const currencySymbol = fiatCurrency === "MYR" ? "RM" : fiatCurrency === "CNY" ? "¥" : "$";

  const formatLargeAmount = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  const getSentimentColor = (sentiment: string) => {
    const s = sentiment.toUpperCase();
    if (s.includes("BULLISH")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (s.includes("BEARISH")) return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  };

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* Dynamic Header & Switch Language line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h4 className="text-xs font-black font-mono tracking-tight text-zinc-300 flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
            <Globe className="w-3.5 h-3.5 text-zinc-500" />
            <span>{t.headerTitle}</span>
          </h4>
          <span className="text-[10px] text-zinc-500 block mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {t.headerSubtitle}
          </span>
        </div>

        {/* Small Switch Language Tab */}
        <div className="flex items-center gap-0.5 bg-zinc-950 p-0.5 rounded-lg border border-zinc-900 w-fit" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
          {(["MY", "ENG", "CN"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                language === lang
                  ? "bg-emerald-500/20 text-emerald-400 font-extrabold"
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
              style={language === lang ? { backgroundColor: 'rgba(var(--accent-rgb), 0.15)', color: 'var(--accent-color)' } : { color: 'var(--text-secondary)' }}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Stat 1: Total Cap */}
        <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-4 transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-12 h-12 text-emerald-500" />
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold font-mono" style={{ color: "var(--text-tertiary)" }}>{t.capLabel}</div>
          <div className="text-2xl font-bold text-zinc-100 mt-2 font-mono" id="stat-total-cap" style={{ color: "var(--text-primary)" }}>
            {currencySymbol} {formatLargeAmount(displayCap || 1.82e12)}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
            <span className="text-emerald-500 font-semibold font-mono">↑ 1.2%</span> {t.capSub.replace("↑ 1.2% ", "")}
          </div>
        </div>

        {/* Stat 2: Aggregated Volume */}
        <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-4 transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 className="w-12 h-12 text-sky-500" />
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold font-mono" style={{ color: "var(--text-tertiary)" }}>{t.volLabel}</div>
          <div className="text-2xl font-bold text-zinc-100 mt-2 font-mono" id="stat-total-vol" style={{ color: "var(--text-primary)" }}>
            {currencySymbol} {formatLargeAmount(displayVol || 84.5e9)}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
            <span className="text-zinc-450 font-semibold text-sky-400">{t.volSub}</span>
          </div>
        </div>

        {/* Stat 3: BTC Dominance share */}
        <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-4 transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <PieChart className="w-12 h-12 text-amber-500" />
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold font-mono" style={{ color: "var(--text-tertiary)" }}>{t.domLabel}</div>
          <div className="text-2xl font-bold text-amber-400 mt-2 font-mono" id="stat-btc-dominance">
            {btcDominance.toFixed(2)}%
          </div>
          <div className="text-[10px] text-zinc-500 mt-1" style={{ color: "var(--text-secondary)" }}>
            {t.domSub}
          </div>
        </div>

        {/* Stat 4: AI Sentiment Index */}
        <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-4 transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="w-12 h-12 text-emerald-400" />
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold font-mono" style={{ color: "var(--text-tertiary)" }}>{t.aiLabel}</div>
          
          {loadingInsight ? (
            <div className="h-8 flex items-center mt-2.5">
              <div className="w-20 h-4 bg-zinc-800 animate-pulse rounded"></div>
            </div>
          ) : aiInsight ? (
            <div className="flex items-center gap-2 mt-2" id="stat-ai-sentiment">
              <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-md border ${getSentimentColor(aiInsight.sentiment)}`}>
                {aiInsight.sentiment}
              </span>
              <span className="text-xl font-bold text-zinc-100 font-mono" title="Bullish Intensity Score" style={{ color: "var(--text-primary)" }}>
                {aiInsight.score}/100
              </span>
            </div>
          ) : (
            <div className="text-sm font-bold text-zinc-400 mt-2 font-mono">
              {t.neutral} (50/100)
            </div>
          )}

          <div className="text-[10px] text-zinc-500 mt-1.5 flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
            <span className="truncate">
              {aiInsight ? aiInsight.headline : t.noInsight}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
