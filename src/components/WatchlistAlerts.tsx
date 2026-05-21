import React, { useState, useMemo } from "react";
import { CoinData, PriceAlert } from "../types";
import { 
  Bell, 
  BellOff,
  Star, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  SlidersHorizontal,
  Coins
} from "lucide-react";

interface WatchlistAlertsProps {
  coins: CoinData[];
  watchlist: string[];
  alerts: PriceAlert[];
  onToggleWatchlist: (coinId: string) => void;
  onAddAlert: (coinId: string, targetPrice: number, condition: "above" | "below") => void;
  onRemoveAlert: (alertId: string) => void;
  onToggleAlertStatus: (alertId: string) => void;
  fiatCurrency: "MYR" | "USD" | "CNY";
  rateMyr: number;
  rateCny: number;
  onSelectCoin: (coinId: string) => void;
}

export default function WatchlistAlerts({
  coins,
  watchlist,
  alerts,
  onToggleWatchlist,
  onAddAlert,
  onRemoveAlert,
  onToggleAlertStatus,
  fiatCurrency,
  rateMyr,
  rateCny,
  onSelectCoin
}: WatchlistAlertsProps) {
  const [selectedCoinId, setSelectedCoinId] = useState<string>("");
  const [targetPriceInput, setTargetPriceInput] = useState<string>("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [alertError, setAlertError] = useState<string>("");
  const [language, setLanguage] = useState<"MY" | "ENG" | "CN">("MY");

  const LOCAL_STRINGS = {
    MY: {
      title: "Senarai Pantau & Enjin Harga Pintar",
      desc: "Pantau sasaran aset dan dapatkan notifikasi segera apabila syarat pencetus dipenuhi",
      myPrefsTitle: "Senarai Pilihan Saya",
      pinHint: "*Pin item dari jadual di bawah",
      noPinned: "Tiada token dipin ke dalam senarai pilihan anda.",
      clickStar: "Klik Bintang pada sebarang token dalam senarai pasaran untuk pin di sini.",
      monitorSetup: "Persediaan Amaran Pantauan Dinamik",
      assetSelector: "PEMILIH ASET",
      conditionTrigger: "PENCETUS SYARAT",
      goesAbove: "Melebihi",
      goesBelow: "Di Bawah",
      targetThreshold: "HAD HARGA SASARAN",
      current: "Semasa",
      armTrigger: "Aktifkan Monitor Amaran",
      choiceToken: "-- Pilih Token --",
      selectTokenErr: "Sila pilih token untuk dipantau.",
      positivePriceErr: "Sila masukkan harga sasaran positif yang sah.",
      armedTargets: "Sasaran Amaran Dinamik Aktif",
      noArmed: "Tiada had monitor amaran aktif ditetapkan. Tambah dari borang di atas.",
      goesAboveShort: "📈 >= Atas",
      goesBelowShort: "📉 <= Bawah",
      triggeredAt: "💥 Tercetus pada",
      live: "Semasa:",
    },
    ENG: {
      title: "Watchlist & Smart Price Engine",
      desc: "Monitor asset targets and get notified immediately when trigger conditions are met",
      myPrefsTitle: "My Prefs Watchlist",
      pinHint: "*Pin items from bottom table",
      noPinned: "No pinned tokens in your preferred list.",
      clickStar: "Click the Star on any token in the market list to pin them here separately.",
      monitorSetup: "Dynamic Monitor Alert Setup",
      assetSelector: "ASSET SELECTOR",
      conditionTrigger: "CONDITION TRIGGER",
      goesAbove: "Goes Above",
      goesBelow: "Goes Below",
      targetThreshold: "TARGET THRESHOLD PRICE",
      current: "Current",
      armTrigger: "Arm Trigger Monitor",
      choiceToken: "-- Choose Token --",
      selectTokenErr: "Please select a token to monitor.",
      positivePriceErr: "Please enter a valid positive target price.",
      armedTargets: "Armed Threshold Targets",
      noArmed: "No live active threshold triggers set. Add targets from form above.",
      goesAboveShort: "📈 >= Above",
      goesBelowShort: "📉 <= Below",
      triggeredAt: "💥 Triggered at",
      live: "Live:",
    },
    CN: {
      title: "自选价格监控引擎",
      desc: "在这里固定并追踪您最关注的资产，设定目标价格，突破或跌穿时高频率触发拦截鸣警",
      myPrefsTitle: "自选代币监控池",
      pinHint: "*从底部的代币汇率汇总大表中点亮星标加入",
      noPinned: "自选监视池空荡。您尚未固定/收藏任何代币位置。",
      clickStar: "在下方主大代币列表中，点击任意一栏的星号(Star)即可快捷固定至本卡片。",
      monitorSetup: "多维护价格监测及哨兵警报",
      assetSelector: "代币高频过滤器",
      conditionTrigger: "方向报警阀值",
      goesAbove: "上穿突破",
      goesBelow: "下探跌穿",
      targetThreshold: "监控触发绝对值价格",
      current: "标的现价",
      armTrigger: "一键武装启动高频价格哨兵",
      choiceToken: "-- 请选择代币标的 --",
      selectTokenErr: "您尚未选择任何需要监控报警目标的代币实例。",
      positivePriceErr: "请输入合理的正实数值作为警报触发极限价格。",
      armedTargets: "哨兵高精监听中",
      noArmed: "目前没有设置任何活跃的警报监控器。请在上方输入设定哨兵。",
      goesAboveShort: "📈 >= 突破",
      goesBelowShort: "📉 <= 跌落",
      triggeredAt: "💥 警报触发于",
      live: "现价:",
    }
  };

  const t = LOCAL_STRINGS[language];

  const formatPrice = (priceUsd: number) => {
    const val = fiatCurrency === "MYR" ? priceUsd * rateMyr : fiatCurrency === "CNY" ? priceUsd * rateCny : priceUsd;
    const symbol = fiatCurrency === "MYR" ? "RM" : fiatCurrency === "CNY" ? "¥" : "$";
    if (val >= 1000) {
      return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (val >= 1) {
      return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}`;
    }
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`;
  };

  // Resolve watchlisted coins
  const watchlistedCoins = useMemo(() => {
    return coins.filter(c => watchlist.includes(c.id));
  }, [coins, watchlist]);

  // Autofill target price when user selects a coin
  const handleCoinSelection = (coinId: string) => {
    setSelectedCoinId(coinId);
    const coin = coins.find(c => c.id === coinId);
    if (coin) {
      const currentVal = fiatCurrency === "MYR" ? coin.priceUsd * rateMyr : fiatCurrency === "CNY" ? coin.priceUsd * rateCny : coin.priceUsd;
      setTargetPriceInput(currentVal.toFixed(2));
    } else {
      setTargetPriceInput("");
    }
    setAlertError("");
  };

  // Submit Alert Handler
  const handleSubmitAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoinId) {
      setAlertError("Please select a token to monitor.");
      return;
    }
    const enteredPrice = parseFloat(targetPriceInput);
    if (isNaN(enteredPrice) || enteredPrice <= 0) {
      setAlertError("Please enter a valid positive target price.");
      return;
    }

    // Convert to USD standard for storage (since prices in types are USD)
    const priceInUsd = fiatCurrency === "MYR" ? enteredPrice / rateMyr : fiatCurrency === "CNY" ? enteredPrice / rateCny : enteredPrice;
    
    onAddAlert(selectedCoinId, priceInUsd, condition);
    setTargetPriceInput("");
    setAlertError("");
  };

  return (
    <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 font-sans text-xs flex flex-col gap-4">
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-zinc-100 font-bold text-sm tracking-tight">
            <Bell className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{t.title}</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
            {t.desc}
          </span>
        </div>

        {/* Switch Language Tab */}
        <div className="flex items-center gap-0.5 bg-zinc-955 p-0.5 rounded-lg border border-zinc-90 w-fit" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Sub-column: Pinned Watchlist (6 of 12) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-zinc-300 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{t.myPrefsTitle} ({watchlistedCoins.length})</span>
            </h4>
            <span className="text-[10px] text-zinc-600 font-mono italic">
              {t.pinHint}
            </span>
          </div>

          <div className="border border-zinc-900 bg-zinc-950/80 rounded-lg overflow-hidden max-h-[280px] overflow-y-auto">
            {watchlistedCoins.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono space-y-2">
                <Star className="w-6 h-6 text-zinc-800 mx-auto" />
                <p className="text-[10px] leading-relaxed">{t.noPinned}</p>
                <p className="text-[9px] text-zinc-600">{t.clickStar}</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-900/40">
                {watchlistedCoins.map(coin => {
                  const changeIsPositive = coin.changePercent24h >= 0;
                  return (
                    <div 
                      key={coin.id}
                      onClick={() => onSelectCoin(coin.id)}
                      className="group p-2.5 flex items-center justify-between hover:bg-zinc-900/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(coin.id);
                          }}
                          className="text-amber-500 hover:text-zinc-600 transition-all cursor-pointer p-0.5"
                          title="Unpin"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                        </button>
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-205 group-hover:text-emerald-400 transition-colors">
                            {coin.name}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase">
                            {coin.symbol}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="font-mono font-bold text-zinc-100 block">
                            {formatPrice(coin.priceUsd)}
                          </span>
                          <span className={`inline-flex items-center text-[9px] font-bold font-mono ${
                            changeIsPositive ? "text-emerald-400" : "text-rose-400"
                          }`}>
                            {changeIsPositive ? "↑" : "↓"} {Math.abs(coin.changePercent24h).toFixed(2)}%
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCoinSelection(coin.id);
                          }}
                          className="p-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/20"
                          title="Set Price Alert"
                        >
                          <Bell className="w-3 h-3" />
                        </button>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sub-column: Add & Monitor Alerts (6 of 12) */}
        <div className="lg:col-span-6 space-y-3">
          <h4 className="text-zinc-300 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Bell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dynamic Monitor Alert Setup</span>
          </h4>

          {/* Quick Alert Form */}
          <form onSubmit={handleSubmitAlert} className="bg-zinc-950/80 border border-zinc-900 rounded-lg p-3 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-zinc-500 font-mono block mb-1">ASSET SELECTOR</label>
                <select
                  value={selectedCoinId}
                  onChange={(e) => handleCoinSelection(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 py-1.5 px-2 rounded font-mono outline-none focus:border-emerald-500/30 text-[11px]"
                >
                  <option value="">-- Choose Token --</option>
                  {coins.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 font-mono block mb-1">CONDITION TRIGGER</label>
                <div className="flex rounded bg-zinc-900 p-0.5 border border-zinc-800 gap-1">
                  <button
                    type="button"
                    onClick={() => setCondition("above")}
                    className={`flex-1 text-[10px] py-1 rounded font-bold transition-all cursor-pointer ${
                      condition === "above" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" 
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Goes Above
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition("below")}
                    className={`flex-1 text-[10px] py-1 rounded font-bold transition-all cursor-pointer ${
                      condition === "below" 
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/15" 
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Goes Below
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] text-zinc-500 font-mono block">TARGET THRESHOLD PRICE ({fiatCurrency})</label>
                {selectedCoinId && (
                  <span className="text-[9.5px] text-zinc-500 font-mono">
                    Current: {formatPrice(coins.find(c => c.id === selectedCoinId)?.priceUsd || 0)}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 font-mono text-zinc-500 font-bold">
                  {fiatCurrency === "MYR" ? "RM" : fiatCurrency === "CNY" ? "¥" : "$"}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={targetPriceInput}
                  onChange={(e) => setTargetPriceInput(e.target.value)}
                  placeholder="Target Price Threshold..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200 py-1.5 pl-8 pr-3 rounded font-mono outline-none focus:border-emerald-500/30"
                />
              </div>
            </div>

            {alertError && (
              <p className="text-[10px] text-rose-400 font-mono flex items-center gap-1 leading-snug">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{alertError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-1.5 px-3 rounded text-[10px] bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 text-zinc-950" />
              <span>Arm Trigger Monitor</span>
            </button>
          </form>
        </div>

      </div>

      {/* Grid: Alerts Monitor Deck */}
      <div className="border border-zinc-900 bg-zinc-950/20 rounded-lg p-3">
        <h4 className="text-zinc-300 font-bold text-[11px] uppercase tracking-wider block mb-2 font-mono">
          🚨 Armed Threshold Targets ({alerts.length})
        </h4>

        {alerts.length === 0 ? (
          <div className="py-6 text-center text-zinc-600 font-mono text-[10px]">
            No live active threshold triggers set. Add targets from form above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto">
            {alerts.map(alert => {
              const symbol = fiatCurrency === "MYR" ? "RM" : fiatCurrency === "CNY" ? "¥" : "$";
              const targetDisplay = fiatCurrency === "MYR" 
                ? alert.targetPrice * rateMyr 
                : fiatCurrency === "CNY"
                ? alert.targetPrice * rateCny
                : alert.targetPrice;
              
              // Find live coin details
              const coin = coins.find(c => c.id === alert.coinId);
              const isTriggered = alert.isTriggered;

              return (
                <div 
                  key={alert.id}
                  className={`p-2 rounded border text-[10px] font-mono flex items-center justify-between gap-2 ${
                    isTriggered 
                      ? "bg-rose-950/25 border-rose-900/40 text-rose-300 animate-pulse" 
                      : alert.isActive
                        ? "bg-zinc-900/60 border-zinc-850 text-zinc-300"
                        : "bg-zinc-950/80 border-zinc-900/60 text-zinc-500"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-zinc-100 uppercase bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800">
                        {alert.coinSymbol.toUpperCase()}
                      </span>
                      <span className={`text-[8px] px-1 rounded uppercase font-bold ${
                        alert.condition === "above" 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {alert.condition === "above" ? "📈 >= Above" : "📉 <= Below"}
                      </span>
                    </div>
                    <div className="text-[10px] tracking-tight">
                      Target: <span className="font-bold text-zinc-200">
                        {symbol}{targetDisplay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </span>
                    </div>

                    {isTriggered ? (
                      <span className="text-[8.5px] block font-semibold text-rose-400 italic">
                        💥 Triggered at {new Date(alert.triggeredAt || "").toLocaleTimeString()}
                      </span>
                    ) : (
                      <span className="text-[8px] text-zinc-500 block">
                        Live: {coin ? formatPrice(coin.priceUsd) : "Syncing..."}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleAlertStatus(alert.id)}
                      className={`p-1 rounded cursor-pointer ${
                        alert.isActive 
                          ? "text-emerald-400 hover:text-emerald-300 hover:bg-zinc-850" 
                          : "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-850"
                      }`}
                      title={alert.isActive ? "Deactivate Monitor" : "Activate Monitor"}
                    >
                      {alert.isActive ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onRemoveAlert(alert.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 rounded cursor-pointer"
                      title="Delete Monitor Alert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
