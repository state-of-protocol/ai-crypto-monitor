import { useState, useEffect } from "react";
import { HorizonForecast, PortfolioItem } from "../types";
import { 
  Calendar, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldAlert, 
  Gauge, 
  Layers, 
  SlidersHorizontal,
  Lightbulb
} from "lucide-react";

interface MultiHorizonForecastProps {
  portfolio: PortfolioItem[];
}

export default function MultiHorizonForecast({ portfolio }: MultiHorizonForecastProps) {
  const [forecasts, setForecasts] = useState<HorizonForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHorizon, setActiveHorizon] = useState<string>("Daily");
  const [errorFlag, setErrorFlag] = useState(false);

  const fetchForecasts = async () => {
    setLoading(true);
    setErrorFlag(false);
    try {
      const res = await fetch("/api/crypto/multi-horizon-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assets: portfolio })
      });
      if (!res.ok) throw new Error("Multi-horizon query failed");
      const data: HorizonForecast[] = await res.json();
      setForecasts(data);
      if (data.length > 0) {
        // Find existing selected or default to first
        const match = data.find(f => f.horizon === activeHorizon);
        if (!match) setActiveHorizon(data[0].horizon);
      }
    } catch (err) {
      console.error("Error fetching multihorizon strategic trends", err);
      setErrorFlag(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecasts();
  }, [portfolio]);

  const activeForecast = forecasts.find(f => f.horizon === activeHorizon);

  // Helper colors based on sentiments
  const getSentimentPillStyle = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("highly bullish") || l.includes("extremely bullish")) {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
    if (l.includes("bearish")) {
      return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    }
    return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  };

  const getSentimentProgressClass = (pct: number) => {
    if (pct >= 75) return "bg-emerald-500";
    if (pct <= 45) return "bg-rose-500";
    return "bg-amber-500";
  };

  return (
    <div className="rounded-xl border border-zinc-805 bg-zinc-950/40 p-4 font-sans text-xs">
      {/* Module Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-zinc-100 font-bold text-sm tracking-tight">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>Multi-Horizon Strategy Forecast</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
            Cohesive tactical &amp; macro planning parameters across 6 execution horizons
          </span>
        </div>
        
        <button
          onClick={fetchForecasts}
          disabled={loading}
          className="self-start sm:self-center py-1.5 px-2.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold text-zinc-300 hover:text-white hover:bg-zinc-850 hover:border-zinc-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Outlook</span>
        </button>
      </div>

      {loading ? (
        <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-16 text-center flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] text-zinc-500 font-mono animate-pulse">
            Configuring temporal market projection grids with Gemini AI...
          </span>
        </div>
      ) : errorFlag || forecasts.length === 0 ? (
        <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-8 text-center text-zinc-500 font-mono">
          <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-zinc-400 font-semibold text-xs mb-1">Grid synchronization hindered</p>
          <p className="text-[10px]">Unable to calculate temporal trends. Verify API server status.</p>
          <button
            onClick={fetchForecasts}
            className="mt-4 py-1.5 px-3 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-emerald-400 hover:bg-zinc-850"
          >
            Retry Analytics Sync
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Timeline Multi-Selector Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-zinc-950/80 border border-zinc-900 rounded-lg">
            {forecasts.map((f) => {
              const isSelected = activeHorizon === f.horizon;
              const levelStyle = getSentimentPillStyle(f.sentimentLabel);
              return (
                <button
                  key={f.horizon}
                  onClick={() => setActiveHorizon(f.horizon)}
                  className={`py-2 px-1 rounded-md text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isSelected 
                      ? "bg-zinc-900 border border-zinc-850 shadow-md text-zinc-100" 
                      : "text-zinc-500 hover:text-zinc-350"
                  }`}
                >
                  <Calendar className={`w-3 h-3 ${isSelected ? "text-emerald-400" : "text-zinc-650"}`} />
                  <span className="text-[10px] font-bold tracking-tight">{f.horizon}</span>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <span className="text-[7px] font-mono scale-90 text-zinc-500">
                      {f.sentimentPct}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Content Board */}
          {activeForecast && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Left Column: Quick Analytics Card (span 5 out of 12) */}
              <div className="md:col-span-5 space-y-3 flex flex-col">
                
                {/* Active Horizon Executive Board */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-lg p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold">
                        {activeForecast.horizon} Directive
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black uppercase ${getSentimentPillStyle(activeForecast.sentimentLabel)}`}>
                        {activeForecast.sentimentLabel}
                      </span>
                    </div>

                    <h4 className="text-zinc-100 font-black text-sm tracking-tight mb-2 uppercase leading-snug">
                      {activeForecast.action}
                    </h4>
                  </div>

                  {/* Meter Metric Stats Container */}
                  <div className="space-y-2 mt-4">
                    {/* Sentiment Possibility Indicator */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                        <span className="text-zinc-500 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-emerald-500/70" /> Positive Trend Possibility
                        </span>
                        <span className="text-zinc-200 font-bold">{activeForecast.sentimentPct}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${getSentimentProgressClass(activeForecast.sentimentPct)}`}
                          style={{ width: `${activeForecast.sentimentPct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Prediction Confidence / Accuracy Meter */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                        <span className="text-zinc-500 flex items-center gap-1">
                          <Gauge className="w-3 h-3 text-sky-500/70" /> Predictive Accuracy Meter
                        </span>
                        <span className="text-zinc-200 font-bold">{activeForecast.accuracyEstimate}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-sky-500/80 transition-all duration-500"
                          style={{ width: `${activeForecast.accuracyEstimate}%` }}
                        ></div>
                      </div>
                      <span className="text-[8px] text-zinc-600 font-mono mt-0.5 block italic leading-none">
                        *Prediction confidences decay over longer horizons due to market complexity.
                      </span>
                    </div>

                    {/* Logical Objectivity / Neutrality Score */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                        <span className="text-zinc-500 flex items-center gap-1">
                          <Compass className="w-3 h-3 text-purple-500/70" /> Logical Neutrality Index
                        </span>
                        <span className="text-zinc-200 font-bold">{activeForecast.neutralityRating}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-purple-500/80 transition-all duration-500"
                          style={{ width: `${activeForecast.neutralityRating}%` }}
                        ></div>
                      </div>
                      <span className="text-[8px] text-zinc-600 font-mono mt-0.5 block leading-none">
                        Ensuring zero emotional bias based purely on objective mathematical market modeling.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Logic Breakdown & Action Directives (span 7 out of 12) */}
              <div className="md:col-span-7 space-y-3">
                
                {/* News & Systematic Logic Analysis */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-lg p-3">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold block mb-1.5">
                    Logical Analytics &amp; News Synthesis
                  </span>
                  <div className="text-zinc-300 leading-relaxed font-mono text-[10px] text-justify bg-zinc-900/30 p-2.5 rounded border border-zinc-950">
                    {activeForecast.logicAnalysis}
                  </div>
                </div>

                {/* Intelligent Dynamic Green / Red Flags */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-lg p-3">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold block mb-2">
                    Systemic Risk Verification Alerts
                  </span>
                  <div className="space-y-2">
                    {activeForecast.riskFlags && activeForecast.riskFlags.map((flag, idx) => {
                      const isRed = flag.type === "redflag";
                      const isGreen = flag.type === "greenflag";
                      return (
                        <div 
                          key={idx} 
                          className={`flex items-start gap-2.5 p-2 rounded border text-[10px] leading-tight font-mono ${
                            isRed ? "bg-rose-950/20 border-rose-900/40 text-rose-300" :
                            isGreen ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300" :
                            "bg-zinc-900/40 border-zinc-850 text-zinc-300"
                          }`}
                        >
                          {isRed ? (
                            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          ) : isGreen ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <SlidersHorizontal className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-bold underline block mb-0.5 text-zinc-100 uppercase tracking-tight">
                              {isRed ? "🔴 REDFLAG: " : isGreen ? "🟢 GREENFLAG: " : "⚪ NEUTRAL: "} {flag.label}
                            </span>
                            <span className="text-[9.5px] font-normal block leading-snug">{flag.description}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Personalized Portfolio Suggestion Box */}
                <div className="bg-emerald-950/10 border border-emerald-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-emerald-400 font-bold mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-wider font-mono">My Portfolio recommendation directive</span>
                  </div>
                  <p className="text-zinc-300 font-mono text-[10px] leading-relaxed">
                    {activeForecast.recommendation}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* Quick Macro Horizon Table Overview */}
          <div className="mt-4 border border-zinc-900 bg-zinc-950/90 rounded-lg p-3 overflow-hidden">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold block mb-2">
              Macro Horizon Spectrum Matrix
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center font-mono text-[9px]">
              {forecasts.map((f) => {
                const labelStyle = getSentimentPillStyle(f.sentimentLabel);
                return (
                  <div key={f.horizon} className="bg-zinc-900/45 border border-zinc-850 py-2 px-1 rounded hover:border-zinc-800 transition-all">
                    <span className="text-zinc-500 block font-bold mb-1">{f.horizon}</span>
                    <span className="text-zinc-200 block font-black leading-tight max-w-[130px] mx-auto truncate" title={f.action}>
                      {f.action}
                    </span>
                    <div className="w-10 h-0.5 bg-zinc-800 mx-auto my-1.5"></div>
                    <span className={`px-1 rounded block w-11/12 mx-auto uppercase text-[7px] font-black tracking-tight ${labelStyle}`}>
                      {f.sentimentPct}% Sentiment
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
