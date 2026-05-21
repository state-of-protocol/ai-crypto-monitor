import { useState, useEffect } from "react";
import { Sparkles, Activity, Clock, Wifi, Coins, Settings } from "lucide-react";

interface HeaderProps {
  fiatCurrency: "MYR" | "USD" | "CNY";
  onFiatChange: (currency: "MYR" | "USD" | "CNY") => void;
  apiConnected: boolean;
  marketFreshness: string;
  onRefresh: () => void;
  refreshing: boolean;
  onOpenSettings: () => void;
  isSettingsOpen: boolean;
}

export default function Header({
  fiatCurrency,
  onFiatChange,
  apiConnected,
  marketFreshness,
  onRefresh,
  refreshing,
  onOpenSettings,
  isSettingsOpen
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      const dayOfWeek = days[now.getUTCDay()];
      const dayOfMonth = now.getUTCDate();
      const monthName = months[now.getUTCMonth()];
      const year = now.getUTCFullYear();
      
      const hrs24 = now.getUTCHours();
      const ampm = hrs24 >= 12 ? "PM" : "AM";
      const hrs12 = hrs24 % 12 === 0 ? 12 : hrs24 % 12;
      
      const minute = String(now.getUTCMinutes()).padStart(2, "0");
      const second = String(now.getUTCSeconds()).padStart(2, "0");
      
      const formattedTime = `${dayOfWeek}, ${dayOfMonth} ${monthName} ${year} ${hrs12}:${minute}:${second} ${ampm} UTC`;
      setTimeStr(formattedTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md px-4 py-3 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-emerald-500/25 blur-sm opacity-75 animate-pulse"></div>
            <div className="relative bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-emerald-400">
              <Coins className="w-5 h-5" id="header-logo-icon" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-100 tracking-tight">AI Crypto Monitor</span>
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                <Sparkles className="w-2.5 h-2.5" /> Core Gemini Active
              </span>
            </div>
            <p className="text-[10px] text-zinc-500">Autonomous market intelligence & real-time analytics</p>
          </div>
        </div>

        {/* Real-time Status & Control Panel */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          {/* UTC Clock */}
          <div className="flex items-center gap-1.5 text-zinc-400 bg-zinc-900/40 px-3 py-1.5 rounded-md border border-zinc-800/40">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-mono text-[11px] tracking-wide text-zinc-300">{timeStr || "Loading..."}</span>
          </div>

          {/* Connection Line indicator */}
          <div className="flex items-center gap-1.5 text-zinc-400 bg-zinc-900/40 px-3 py-1.5 rounded-md border border-zinc-800/40">
            <Wifi className={`w-3.5 h-3.5 ${apiConnected ? "text-emerald-500 animate-pulse" : "text-amber-500"}`} />
            <span className="text-[11px] text-zinc-300">
              {apiConnected ? "Pipeline: Connected" : "Pipeline: Fallback Active"}
            </span>
            <span className={`w-2 h-2 rounded-full ${apiConnected ? "bg-emerald-500" : "bg-amber-500"}`}></span>
          </div>

          {/* Refresh Tool */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-emerald-400 px-3 py-1.5 rounded-md border border-zinc-800/60 font-mono transition-all cursor-pointer text-[11px]"
          >
            <Activity className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-emerald-400" : "text-zinc-400"}`} />
            <span>{refreshing ? "Syncing..." : `${marketFreshness}`}</span>
          </button>

          {/* Currency Toggle Switch */}
          <div className="flex items-center bg-zinc-900/80 p-0.5 rounded-md border border-zinc-800/60">
            <button
               onClick={() => onFiatChange("MYR")}
               className={`px-3 py-1 rounded text-[11px] font-mono font-medium transition-all cursor-pointer ${
                 fiatCurrency === "MYR"
                   ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                   : "text-zinc-400 hover:text-zinc-200"
               }`}
             >
               MYR (RM)
             </button>
             <button
               onClick={() => onFiatChange("USD")}
               className={`px-3 py-1 rounded text-[11px] font-mono font-medium transition-all cursor-pointer ${
                 fiatCurrency === "USD"
                   ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                   : "text-zinc-400 hover:text-zinc-200"
               }`}
             >
               USD ($)
             </button>
             <button
               onClick={() => onFiatChange("CNY")}
               className={`px-3 py-1 rounded text-[11px] font-mono font-medium transition-all cursor-pointer ${
                 fiatCurrency === "CNY"
                   ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                   : "text-zinc-400 hover:text-zinc-200"
               }`}
             >
               CNY (¥)
             </button>
          </div>

          {/* Special Settings gear icon */}
          <button
            onClick={onOpenSettings}
            id="btn-header-settings"
            className={`p-1.5 rounded-md border transition-all cursor-pointer flex items-center justify-center ${
              isSettingsOpen
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/35"
                : "bg-zinc-900/80 border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
            }`}
            title="Open Workspace Settings & Canvas Customizer"
          >
            <Settings className={`w-4 h-4 ${isSettingsOpen ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
          </button>
        </div>
      </div>
    </header>
  );
}
