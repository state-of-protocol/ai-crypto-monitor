import { useState, useMemo } from "react";
import { CoinHistoryPoint } from "../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line
} from "recharts";
import { LineChart, Calendar, RefreshCw } from "lucide-react";

interface FinancialChartProps {
  coinName: string;
  coinSymbol: string;
  history: CoinHistoryPoint[];
  loading: boolean;
  fiatCurrency: "MYR" | "USD" | "CNY";
  rateMyr: number;
  rateCny: number;
}

export default function FinancialChart({
  coinName,
  coinSymbol,
  history,
  loading,
  fiatCurrency,
  rateMyr,
  rateCny
}: FinancialChartProps) {
  const currencySymbol = fiatCurrency === "MYR" ? "RM" : fiatCurrency === "CNY" ? "¥" : "$";
  const [timeframe, setTimeframe] = useState<30 | 90>(30);
  const [showBollinger, setShowBollinger] = useState<boolean>(true);
  const [language, setLanguage] = useState<"MY" | "ENG" | "CN">("MY");

  const LOCAL_STRINGS = {
    MY: {
      titleSuffix: "Keluk Teknikal",
      trendLabel: "Trend",
      subtitle: `Harga dalam ${fiatCurrency} dilapis dengan indikator teknikal kuantitatif`,
      lowLabel: "RENDAH",
      highLabel: "TINGGI",
      deltaLabel: "PERUBAHAN",
      btn30: "Sejarah 30H",
      btn90: "Sejarah 90H",
      bollingerLabel: "Jalur Bollinger (20, 2)",
      processing: "Memproses reka letak carta teknikal...",
      placeholder: "Pilih cryptocoin dalam senarai pasaran utama di bawah untuk melakar pergerakan harga.",
    },
    ENG: {
      titleSuffix: "Technical Curve",
      trendLabel: "Trend",
      subtitle: `Prices in ${fiatCurrency} overlaid with quantitative tech-indicators`,
      lowLabel: "LOW",
      highLabel: "HIGH",
      deltaLabel: "DELTA",
      btn30: "30D History",
      btn80: "90D History",
      bollingerLabel: "Bollinger Bands (20, 2)",
      processing: "Processing technical chart layout...",
      placeholder: "Select a cryptocurrency in the market overview to map dynamic price movements.",
    },
    CN: {
      titleSuffix: "技术分析曲线",
      trendLabel: "趋势线",
      subtitle: `采用 ${fiatCurrency} 报价，重叠量化计算特征与布林带边界`,
      lowLabel: "最低",
      highLabel: "最高",
      deltaLabel: "震荡变幅",
      btn30: "30日曲线",
      btn90: "90日曲线",
      bollingerLabel: "布林带轨道 (20, 2)",
      processing: "量化指标图表极速装载中...",
      placeholder: "请在下方代币列表选择任意币种以自动映射其高频行情走势。",
    }
  };

  const t = LOCAL_STRINGS[language];

  // Convert prices dynamically and calculate Exponential Moving Average (MA-5) & Bollinger Bands (BB-20)
  const fullChartData = useMemo(() => {
    if (!history || history.length === 0) return [];

    const rawData = history.map((h) => {
      const price = fiatCurrency === "MYR" ? h.priceUsd * rateMyr : fiatCurrency === "CNY" ? h.priceUsd * rateCny : h.priceUsd;
      return {
        date: h.date,
        priceUsd: price
      };
    });

    const maPeriod = 5;
    const bbPeriod = 20;
    const kFactor = 2;

    return rawData.map((d, index) => {
      // 1. Calculate MA-5
      let ma5 = d.priceUsd;
      if (index >= maPeriod - 1) {
        let sum = 0;
        for (let j = 0; j < maPeriod; j++) {
          sum += rawData[index - j].priceUsd;
        }
        ma5 = Number((sum / maPeriod).toFixed(4));
      }

      // 2. Calculate Bollinger Bands (BB-20)
      let bbMiddle = d.priceUsd;
      let bbUpper = d.priceUsd;
      let bbLower = d.priceUsd;

      const actualPeriod = Math.min(index + 1, bbPeriod);
      if (actualPeriod >= 2) {
        let sum = 0;
        for (let j = 0; j < actualPeriod; j++) {
          sum += rawData[index - j].priceUsd;
        }
        const sma = sum / actualPeriod;
        bbMiddle = sma;

        let varianceSum = 0;
        for (let j = 0; j < actualPeriod; j++) {
          varianceSum += Math.pow(rawData[index - j].priceUsd - sma, 2);
        }
        const stdDev = Math.sqrt(varianceSum / actualPeriod);
        bbUpper = sma + kFactor * stdDev;
        bbLower = sma - kFactor * stdDev;
      }

      return {
        ...d,
        ma5,
        bbMiddle: Number(bbMiddle.toFixed(4)),
        bbUpper: Number(bbUpper.toFixed(4)),
        bbLower: Number(bbLower.toFixed(4))
      };
    });
  }, [history, fiatCurrency, rateMyr, rateCny]);

  // Sliced timeframe datasets for plotting
  const chartData = useMemo(() => {
    if (!fullChartData || fullChartData.length === 0) return [];
    return fullChartData.slice(-timeframe);
  }, [fullChartData, timeframe]);

  // Compute price statistics dynamically on the active subset
  const priceStats = useMemo(() => {
    if (chartData.length === 0) return { min: 0, max: 0, deltaPercent: 0 };
    const prices = chartData.map((d) => d.priceUsd);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const start = prices[0];
    const end = prices[prices.length - 1];
    const deltaPercent = start > 0 ? ((end - start) / start) * 100 : 0;

    return {
      min,
      max,
      deltaPercent,
      current: end
    };
  }, [chartData]);

  // Adjust Y axis limits dynamically including Bollinger Band offsets if active
  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100];
    const prices = chartData.map((d) => d.priceUsd);
    let min = Math.min(...prices);
    let max = Math.max(...prices);

    if (showBollinger) {
      const uppers = chartData.map((d) => d.bbUpper).filter((v) => v !== undefined);
      const lowers = chartData.map((d) => d.bbLower).filter((v) => v !== undefined);
      if (uppers.length > 0) {
        max = Math.max(max, ...uppers);
      }
      if (lowers.length > 0) {
        min = Math.min(min, ...lowers);
      }
    }

    const pad = (max - min) * 0.1 || min * 0.05;
    return [Math.max(0, min - pad), max + pad];
  }, [chartData, showBollinger]);

  const displayFormatted = (val: number) => {
    if (val >= 1000) {
      return `${currencySymbol}${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    }
    if (val >= 1) {
      return `${currencySymbol}${val.toLocaleString(undefined, { maximumFractionDigits: 3 })}`;
    }
    return `${currencySymbol}${val.toLocaleString(undefined, { maximumFractionDigits: 5 })}`;
  };

  return (
    <div id="financial-chart-container" className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 shadow-xl flex flex-col h-full min-h-[400px]">
      {/* Chart Header details */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3 mb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-emerald-400 font-bold" />
            <span className="text-sm font-semibold text-zinc-100 uppercase tracking-tight">
              {coinName} {t.titleSuffix}
            </span>
            <span className="text-[10px] bg-zinc-900 border border-zinc-800 rounded px-2 text-zinc-400 font-mono">
              {timeframe}D {t.trendLabel}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">
            {t.subtitle}
          </p>
        </div>

        {/* Statistical Summary pills & LANGUAGE SELECTOR */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Switch Language Tab */}
          <div className="flex items-center gap-0.5 bg-zinc-950 p-0.5 rounded-lg border border-zinc-90 w-fit" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
            {(["MY", "ENG", "CN"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold transition-all cursor-pointer ${
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

          {!loading && chartData.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="bg-zinc-900/50 border border-zinc-850 text-[10px] rounded p-1.5 text-zinc-400 flex flex-col font-mono min-w-[65px] text-center">
                <span className="text-zinc-650 text-[8px] uppercase tracking-wider block">{t.lowLabel}</span>
                <span className="font-semibold text-zinc-300">{displayFormatted(priceStats.min)}</span>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-850 text-[10px] rounded p-1.5 text-zinc-400 flex flex-col font-mono min-w-[65px] text-center">
                <span className="text-zinc-650 text-[8px] uppercase tracking-wider block">{t.highLabel}</span>
                <span className="font-semibold text-zinc-300">{displayFormatted(priceStats.max)}</span>
              </div>
              <div className={`border p-1.5 rounded text-[10px] flex flex-col font-mono min-w-[70px] text-center ${
                priceStats.deltaPercent >= 0 
                  ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" 
                  : "bg-rose-500/5 border-rose-500/10 text-rose-400"
              }`}>
                <span className="text-zinc-650 text-[8px] uppercase tracking-wider block">{timeframe}D {t.deltaLabel}</span>
                <span className="font-bold">
                  {priceStats.deltaPercent >= 0 ? "↑" : "↓"} {Math.abs(priceStats.deltaPercent).toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900/40 pb-3 mb-4 text-xs">
        {/* Timeframe Selector Button Cluster */}
        <div className="flex items-center gap-1 bg-zinc-950 p-0.5 border border-zinc-900 rounded-lg shadow-inner">
          <button
            id="btn-timeframe-30d"
            onClick={() => setTimeframe(30)}
            className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
              timeframe === 30
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10 shadow-sm"
                : "text-zinc-500 hover:text-zinc-350"
            }`}
          >
            {t.btn30}
          </button>
          <button
            id="btn-timeframe-90d"
            onClick={() => setTimeframe(90)}
            className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
              timeframe === 90
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10 shadow-sm"
                : "text-zinc-500 hover:text-zinc-350"
            }`}
          >
            {t.btn90 || "90D History"}
          </button>
        </div>

        {/* Bollinger Overlay Flag Switch */}
        <button
          id="btn-toggle-bollinger"
          onClick={() => setShowBollinger(!showBollinger)}
          className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
            showBollinger
              ? "bg-purple-500/10 text-purple-400 border-purple-500/15"
              : "bg-zinc-900/30 text-zinc-500 border-zinc-850 hover:text-zinc-350"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${showBollinger ? "bg-purple-400 animate-pulse" : "bg-zinc-700"}`}></span>
          <span>{t.bollingerLabel}</span>
        </button>
      </div>

      {/* Actual Area Chart Block */}
      <div className="flex-1 w-full min-h-[250px] relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-950/20 backdrop-blur-sm z-10">
            <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
            <span className="text-xs text-zinc-550 font-mono">{t.processing}</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500 font-mono text-xs text-center p-6">
            <Calendar className="w-8 h-8 text-zinc-605" />
            <span>{t.placeholder}</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -22, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.16} />
                  <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--stroke-grid)" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                stroke="var(--stroke-axis)"
                tickMargin={8}
                style={{ fontSize: "10px", fontFamily: "monospace" }}
              />
              <YAxis
                domain={yDomain}
                tickLine={false}
                axisLine={false}
                stroke="var(--stroke-axis)"
                tickMargin={8}
                tickFormatter={(value) => {
                  if (value >= 1000) return `${currencySymbol}${(value / 1000).toFixed(0)}k`;
                  return `${currencySymbol}${value}`;
                }}
                style={{ fontSize: "10px", fontFamily: "monospace" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-primary)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--text-primary)"
                }}
                labelStyle={{ fontFamily: "monospace", color: "var(--text-secondary)", marginBottom: "4px" }}
                itemStyle={{ fontFamily: "monospace", fontSize: "11px" }}
                formatter={(value: number, name: string) => {
                  let label = name;
                  if (name === "priceUsd") label = `${coinSymbol.toUpperCase()} Price`;
                  else if (name === "ma5") label = "MA (5)";
                  else if (name === "bbUpper") label = "Bollinger Upper (2.0σ)";
                  else if (name === "bbLower") label = "Bollinger Lower (2.0σ)";
                  else if (name === "bbMiddle") label = "Bollinger Basis (20D MA)";
                  return [displayFormatted(value), label];
                }}
              />
              {/* Highlight main historical curve */}
              <Area
                type="monotone"
                dataKey="priceUsd"
                stroke="var(--accent-color)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
                id="chart-price-area"
              />
              {/* Plot Technical MA5 Overlay */}
              <Line
                type="monotone"
                dataKey="ma5"
                stroke="#eab308"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={false}
                id="chart-ma5-line"
              />
              {/* Plot Bollinger Bands Lines */}
              {showBollinger && (
                <Line
                  type="monotone"
                  dataKey="bbUpper"
                  stroke="#c084fc"
                  strokeWidth={1.2}
                  strokeDasharray="3 3"
                  dot={false}
                  activeDot={false}
                  id="chart-bb-upper-line"
                />
              )}
              {showBollinger && (
                <Line
                  type="monotone"
                  dataKey="bbLower"
                  stroke="#c084fc"
                  strokeWidth={1.2}
                  strokeDasharray="3 3"
                  dot={false}
                  activeDot={false}
                  id="chart-bb-lower-line"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between mt-4 border-t border-zinc-900/60 pt-3 text-[10px] text-zinc-500 font-mono gap-y-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span>Price: Live ({fiatCurrency})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block"></span>
          <span>MA-5 Exponential Tracker</span>
        </div>
        {showBollinger && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block animate-pulse"></span>
            <span>Bollinger Bands (20, 2) Overlay</span>
          </div>
        )}
      </div>
    </div>
  );
}
