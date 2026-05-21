import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CoinData, CoinHistoryPoint, PortfolioItem, PriceAlert } from "./types";
import Header from "./components/Header";
import MarketStats from "./components/MarketStats";
import LiveCoinsTable from "./components/LiveCoinsTable";
import FinancialChart from "./components/FinancialChart";
import WatchlistAlerts from "./components/WatchlistAlerts";
import { fetchMarkets, fetchHistory } from "./utils/coincap";
import { BarChart3, Bell, GripVertical, Plus, Trash2, Settings2, X, RotateCcw, LayoutGrid, Settings } from "lucide-react";

export interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  isShown: boolean;
  size: "sm" | "md" | "lg" | "full";
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: "market-stats", title: "Market Stats", description: "Global capitalization statistics and volumes tracker", isShown: true, size: "full" },
  { id: "live-watchlist", title: "Live Watchlist", description: "Real-time crypto asset rates and sparklines", isShown: true, size: "lg" },
  { id: "financial-chart", title: "Technical Charts", description: "Interactive price chart with Bollinger Bands and indicators", isShown: true, size: "md" },
  { id: "watchlist-alerts", title: "Alerts Hub", description: "Custom price alert threshold controller and notifications", isShown: true, size: "md" },
];

const LOCAL_STORAGE_PORTFOLIO_KEY = "ai_crypto_portfolio_assets";
const CONVERSION_RATE_MYR = 4.68; // Standard fallback MYR rate
const CONVERSION_RATE_CNY = 7.24; // Standard fallback CNY rate

export default function App() {
  // Application parameters
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [selectedCoinId, setSelectedCoinId] = useState<string>("bitcoin");
  const [coinHistory, setCoinHistory] = useState<CoinHistoryPoint[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [fiatCurrency, setFiatCurrency] = useState<"MYR" | "USD" | "CNY">("MYR");
  const [rateMyr, setRateMyr] = useState(CONVERSION_RATE_MYR);
  const [rateCny, setRateCny] = useState(CONVERSION_RATE_CNY);

  // Customization Dashboard states
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
  
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    try {
      const stored = localStorage.getItem("ai_crypto_dashboard_widgets");
      if (stored) return JSON.parse(stored);
    } catch (error) {
      console.warn("Failed to parse customized widgets settings", error);
    }
    return DEFAULT_WIDGETS;
  });

  const saveWidgets = (updated: DashboardWidget[]) => {
    setWidgets(updated);
    try {
      localStorage.setItem("ai_crypto_dashboard_widgets", JSON.stringify(updated));
    } catch (error) {
      console.warn("Failed to persist widgets modifications", error);
    }
  };

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedWidgetId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedWidgetId || draggedWidgetId === targetId) return;

    const sourceIndex = widgets.findIndex((w) => w.id === draggedWidgetId);
    const targetIndex = widgets.findIndex((w) => w.id === targetId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const updated = [...widgets];
      const [draggedItem] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, draggedItem);
      saveWidgets(updated);
    }
    setDraggedWidgetId(null);
  };

  const handleDragEnd = () => {
    setDraggedWidgetId(null);
  };

  const handleResize = (id: string, newSize: "sm" | "md" | "lg" | "full") => {
    const updated = widgets.map((w) => (w.id === id ? { ...w, size: newSize } : w));
    saveWidgets(updated);
  };

  const handleToggleWidget = (id: string) => {
    const updated = widgets.map((w) => (w.id === id ? { ...w, isShown: !w.isShown } : w));
    saveWidgets(updated);
  };

  const handleResetWidgets = () => {
    saveWidgets(DEFAULT_WIDGETS);
  };

  const getSizeClass = (size: "sm" | "md" | "lg" | "full") => {
    switch (size) {
      case "sm": return "lg:col-span-4 md:col-span-6 col-span-12";
      case "md": return "lg:col-span-6 col-span-12";
      case "lg": return "lg:col-span-8 col-span-12";
      case "full": return "lg:col-span-12 col-span-12";
      default: return "lg:col-span-6 col-span-12";
    }
  };
  
  // Portfolio Builder state
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [portfolioHistories, setPortfolioHistories] = useState<{[coinId: string]: CoinHistoryPoint[]}>({});
  const [loadingPortfolioHistory, setLoadingPortfolioHistory] = useState(false);

  // Connection metadata
  const [apiConnected, setApiConnected] = useState(true);
  const [marketFreshness, setMarketFreshness] = useState("Just Synced");
  const [refreshing, setRefreshing] = useState(false);

  // Customizable Theme and Accent settings (with 256-bit dynamic palette storage)
  const [accentColor, setAccentColor] = useState<string>(() => {
    return localStorage.getItem("ai_crypto_accent_color") || "#10b981";
  });
  
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "beige">(() => {
    return (localStorage.getItem("ai_crypto_theme_mode") as "light" | "dark" | "beige") || "dark";
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSetAccentColor = (color: string) => {
    setAccentColor(color);
    localStorage.setItem("ai_crypto_accent_color", color);
  };

  const handleSetThemeMode = (mode: "light" | "dark" | "beige") => {
    setThemeMode(mode);
    localStorage.setItem("ai_crypto_theme_mode", mode);
  };

  const accentRgb = useMemo(() => {
    const hex = accentColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) || 16;
    const g = parseInt(hex.substring(2, 4), 16) || 185;
    const b = parseInt(hex.substring(4, 6), 16) || 129;
    return `${r}, ${g}, ${b}`;
  }, [accentColor]);



  // Watchlist & Alerts state
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("ai_crypto_watchlist_keys");
      return stored ? JSON.parse(stored) : ["bitcoin", "ethereum", "solana"];
    } catch {
      return ["bitcoin", "ethereum", "solana"];
    }
  });

  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const stored = localStorage.getItem("ai_crypto_alerts_keys");
      if (stored) return JSON.parse(stored);
      return [
        {
          id: "alert-mock-1",
          coinId: "bitcoin",
          coinSymbol: "btc",
          targetPrice: 95000,
          condition: "above",
          isActive: true,
          createdAt: new Date().toISOString(),
          isTriggered: false
        }
      ];
    } catch {
      return [];
    }
  });

  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Load baseline portfolio from localstorage on initialization
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PORTFOLIO_KEY);
      if (stored) {
        setPortfolio(JSON.parse(stored));
      } else {
        // Initialize with realistic mock assets for immediate value
        const initialMock: PortfolioItem[] = [
          { coinId: "bitcoin", symbol: "btc", name: "Bitcoin", amount: 0.15 },
          { coinId: "ethereum", symbol: "eth", name: "Ethereum", amount: 1.5 },
          { coinId: "solana", symbol: "sol", name: "Solana", amount: 12 }
        ];
        setPortfolio(initialMock);
        localStorage.setItem(LOCAL_STORAGE_PORTFOLIO_KEY, JSON.stringify(initialMock));
      }
    } catch (e) {
      console.warn("Storage fetch failed", e);
    }
  }, []);

  // Save portfolio adjustments locally
  const savePortfolio = (updated: PortfolioItem[]) => {
    setPortfolio(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_PORTFOLIO_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Saving to store failed", e);
    }
  };

  // Core markets tracking fetching loop
  const fetchMarketAssets = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setApiConnected(true);
    
    try {
      const list = await fetchMarkets();
      setCoins(list);
      setLoadingCoins(false);
      setMarketFreshness("Synced Just Now");
    } catch (error) {
      console.error("Failed to sync fresh markets", error);
      setApiConnected(false);
      setMarketFreshness("Offline Fallback");
      setLoadingCoins(false);
    } finally {
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  // Sync historical price curves of prioritized asset
  const fetchPrioritizedAssetHistory = useCallback(async (coinId: string) => {
    setLoadingHistory(true);
    try {
      const historyPoints = await fetchHistory(coinId);
      setCoinHistory(historyPoints);
    } catch (error) {
      console.error(`Historical curves syncing failed for ${coinId}`, error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // Initialize data loaders
  useEffect(() => {
    fetchMarketAssets();
    
    const interval = setInterval(() => {
      fetchMarketAssets();
    }, 20000); // refresh markets every 20 seconds
    
    return () => clearInterval(interval);
  }, [fetchMarketAssets]);

  // Load history whenever selected coin ID evolves
  useEffect(() => {
    if (selectedCoinId) {
      fetchPrioritizedAssetHistory(selectedCoinId);
    }
  }, [selectedCoinId, fetchPrioritizedAssetHistory]);

  const activeSelectedCoin = useMemo(() => {
    return coins.find(c => c.id === selectedCoinId) || null;
  }, [coins, selectedCoinId]);

  // Portfolio items actions
  const handleAddItemToPortfolio = (coin: CoinData) => {
    const existing = portfolio.find(p => p.coinId === coin.id);
    if (existing) return; // Prevent duplicate row adds
    
    const updated = [...portfolio, {
      coinId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      amount: 1.0 // Start with baseline amount
    }];
    savePortfolio(updated);
  };

  const handleRemoveFromPortfolio = (coinId: string) => {
    const updated = portfolio.filter(p => p.coinId !== coinId);
    savePortfolio(updated);
  };

  const handleUpdateAmountInPortfolio = (coinId: string, amount: number) => {
    const updated = portfolio.map(p => p.coinId === coinId ? { ...p, amount } : p);
    savePortfolio(updated);
  };

  // Synchronize history database for all assets in user's portfolio active vault
  useEffect(() => {
    const fetchMissingHistories = async () => {
      const missingIds = portfolio
        .map(p => p.coinId)
        .filter(id => !portfolioHistories[id]);

      if (missingIds.length === 0) return;

      setLoadingPortfolioHistory(true);
      try {
        const results = await Promise.all(
          missingIds.map(async (id) => {
            try {
              const data = await fetchHistory(id);
              return { id, data };
            } catch (err) {
              console.warn(`Failed history sync for ${id}`, err);
              return { id, data: [] };
            }
          })
        );

        setPortfolioHistories(prev => {
          const next = { ...prev };
          results.forEach(r => {
            if (r) {
              next[r.id] = r.data;
            }
          });
          return next;
        });
      } catch (e) {
        console.warn("Portfolio history gathering run error", e);
      } finally {
        setLoadingPortfolioHistory(false);
      }
    };

    fetchMissingHistories();
  }, [portfolio, portfolioHistories]);

  // Aggregate single NAV curve of compiled amounts & quotes
  const combinedPortfolioHistory = useMemo(() => {
    if (portfolio.length === 0) return [];

    // Find the first coin that actually has loaded history to establish dates
    const firstActiveId = portfolio.find(
      p => portfolioHistories[p.coinId] && portfolioHistories[p.coinId].length > 0
    )?.coinId;

    if (!firstActiveId) return [];

    const basePoints = portfolioHistories[firstActiveId];

    return basePoints.map((basePt, index) => {
      let sumUsd = 0;

      portfolio.forEach(item => {
        const historyList = portfolioHistories[item.coinId];
        if (historyList && historyList.length > 0) {
          const matchingPt = historyList.find(pt => pt.date === basePt.date) || historyList[index] || historyList[historyList.length - 1];
          if (matchingPt) {
            sumUsd += item.amount * matchingPt.priceUsd;
          }
        } else {
          // Fallback to active current price
          const cInfo = coins.find(c => c.id === item.coinId);
          if (cInfo) {
            sumUsd += item.amount * cInfo.priceUsd;
          }
        }
      });

      return {
        date: basePt.date,
        valueDisplay: fiatCurrency === "MYR" ? sumUsd * rateMyr : fiatCurrency === "CNY" ? sumUsd * rateCny : sumUsd
      };
    });
  }, [portfolio, portfolioHistories, coins, fiatCurrency, rateMyr, rateCny]);

  // --- WATCHLIST & ALERTS ENGINE HANDLERS ---
  const handleToggleWatchlist = useCallback((coinId: string) => {
    setWatchlist(prev => {
      let updated;
      if (prev.includes(coinId)) {
        updated = prev.filter(id => id !== coinId);
      } else {
        updated = [...prev, coinId];
      }
      localStorage.setItem("ai_crypto_watchlist_keys", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleAddAlert = useCallback((coinId: string, targetPrice: number, condition: "above" | "below") => {
    const coin = coins.find(c => c.id === coinId);
    if (!coin) return;

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      coinId,
      coinSymbol: coin.symbol,
      targetPrice,
      condition,
      isActive: true,
      createdAt: new Date().toISOString(),
      isTriggered: false
    };

    setAlerts(prev => {
      const updated = [newAlert, ...prev];
      localStorage.setItem("ai_crypto_alerts_keys", JSON.stringify(updated));
      return updated;
    });
  }, [coins]);

  const handleRemoveAlert = useCallback((alertId: string) => {
    setAlerts(prev => {
      const updated = prev.filter(a => a.id !== alertId);
      localStorage.setItem("ai_crypto_alerts_keys", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleToggleAlertStatus = useCallback((alertId: string) => {
    setAlerts(prev => {
      const updated = prev.map(a => {
        if (a.id === alertId) {
          return { ...a, isActive: !a.isActive };
        }
        return a;
      });
      localStorage.setItem("ai_crypto_alerts_keys", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Live Alert Trigger Scanner Loop
  useEffect(() => {
    if (coins.length === 0 || alerts.length === 0) return;

    let wasUpdated = false;
    const checkedAlerts = alerts.map(alert => {
      // Monitor only active and untriggered items
      if (!alert.isActive || alert.isTriggered) return alert;

      const liveCoin = coins.find(c => c.id === alert.coinId);
      if (!liveCoin) return alert;

      let triggerHit = false;
      if (alert.condition === "above" && liveCoin.priceUsd >= alert.targetPrice) {
        triggerHit = true;
      } else if (alert.condition === "below" && liveCoin.priceUsd <= alert.targetPrice) {
        triggerHit = true;
      }

      if (triggerHit) {
        wasUpdated = true;
        
        // Show notification toast immediately
        const fiatLabel = fiatCurrency === "MYR" ? "RM" : fiatCurrency === "CNY" ? "¥" : "$";
        const triggerDisplayPrice = fiatCurrency === "MYR" 
          ? alert.targetPrice * rateMyr 
          : fiatCurrency === "CNY"
          ? alert.targetPrice * rateCny
          : alert.targetPrice;
        const liveDisplayPrice = fiatCurrency === "MYR"
          ? liveCoin.priceUsd * rateMyr
          : fiatCurrency === "CNY"
          ? liveCoin.priceUsd * rateCny
          : liveCoin.priceUsd;

        const infoText = `🔔 ALERT TRIGGERED: ${liveCoin.name} (${liveCoin.symbol.toUpperCase()}) went ${
          alert.condition === "above" ? "above" : "below"
        } ${fiatLabel}${triggerDisplayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}! Live value is ${fiatLabel}${liveDisplayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}.`;
        
        setActiveNotification(infoText);

        return {
          ...alert,
          isActive: false,
          isTriggered: true,
          triggeredAt: new Date().toISOString()
        };
      }

      return alert;
    });

    if (wasUpdated) {
      setAlerts(checkedAlerts);
      localStorage.setItem("ai_crypto_alerts_keys", JSON.stringify(checkedAlerts));
    }
  }, [coins, alerts, fiatCurrency, rateMyr, rateCny]);

  return (
    <div className={`theme-${themeMode} theme-custom-active min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500/25 selection:text-emerald-300`}>
      {/* 256-bit Custom Palette and Themes Override Engine stylesheet */}
      <style>{`
        :root {
          --accent-style-raw: ${accentColor};
          --accent-color: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
        
        /* General accent overrides */
        .theme-custom-active .text-emerald-400:not(.price-change-positive):not(.price-change-val),
        .theme-custom-active .text-emerald-500:not(.price-change-positive):not(.price-change-val),
        .theme-custom-active .text-emerald-600:not(.price-change-positive):not(.price-change-val) {
          color: var(--accent-color) !important;
        }
        
        .theme-custom-active .hover\\:text-emerald-400:hover:not(.price-change-positive):not(.price-change-val) {
          color: var(--accent-color) !important;
        }

        .theme-custom-active .hover\\:text-emerald-300:hover:not(.price-change-positive):not(.price-change-val) {
          color: var(--accent-color) !important;
        }
        
        .theme-custom-active .bg-emerald-500,
        .theme-custom-active .bg-emerald-600,
        .theme-custom-active .hover\\:bg-emerald-500:hover,
        .theme-custom-active .hover\\:bg-emerald-600:hover {
          background-color: var(--accent-color) !important;
        }
        
        .theme-custom-active .bg-emerald-500\\/5 {
          background-color: rgba(var(--accent-rgb), 0.05) !important;
        }
        .theme-custom-active .bg-emerald-500\\/10, 
        .theme-custom-active .bg-emerald-555\\/10,
        .theme-custom-active .bg-emerald-500\\/15, 
        .theme-custom-active .bg-emerald-500\\/20, 
        .theme-custom-active .bg-emerald-500\\/25 {
          background-color: rgba(var(--accent-rgb), 0.12) !important;
        }
        .theme-custom-active .bg-emerald-950\\/10, 
        .theme-custom-active .bg-emerald-950\\/20 {
          background-color: rgba(var(--accent-rgb), 0.1) !important;
        }
        
        .theme-custom-active .border-emerald-500, 
        .theme-custom-active .border-emerald-500\\/10, 
        .theme-custom-active .border-emerald-500\\/15, 
        .theme-custom-active .border-emerald-500\\/20, 
        .theme-custom-active .border-emerald-505,
        .theme-custom-active .border-emerald-500\\/30 {
          border-color: rgba(var(--accent-rgb), 0.25) !important;
        }
        .theme-custom-active .border-emerald-500\\/30 {
          border-color: rgba(var(--accent-rgb), 0.35) !important;
        }
        
        .theme-custom-active .focus\\:border-emerald-500\\/40:focus {
          border-color: var(--accent-color) !important;
        }
        .theme-custom-active .focus\\:ring-emerald-500\\/10:focus {
          box-shadow: 0 0 0 1px rgba(var(--accent-rgb), 0.2) !important;
        }
        
        .theme-custom-active .selection\\:bg-emerald-500\\/25::selection {
          background-color: rgba(var(--accent-rgb), 0.25) !important;
        }
        .theme-custom-active .selection\\:text-emerald-300::selection {
          color: var(--accent-color) !important;
        }

        /* Accent glows */
        .theme-custom-active .blur-sm.bg-emerald-500\\/25 {
          background-color: rgba(var(--accent-rgb), 0.25) !important;
          filter: blur(4px) !important;
        }

        /* Scrollbars dynamic adapt */
        ::-webkit-scrollbar-thumb {
          background: var(--bg-tertiary) !important;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--accent-color) !important;
        }

        /* Theme Overrides & Presets Definition */
        .theme-light {
          --bg-primary: #ffffff;
          --bg-secondary: #f4f4f5;
          --bg-tertiary: #e4e4e7;
          --bg-panel-gradient-from: rgba(244, 244, 245, 0.4);
          --bg-panel-gradient-to: rgba(255, 255, 255, 0.6);
          --border-primary: #e4e4e7;
          --border-secondary: #d4d4d8;
          --text-primary: #09090b;
          --text-secondary: #3f3f46;
          --text-tertiary: #71717a;
          --stroke-axis: #a1a1aa;
          --stroke-grid: #e4e4e7;
          color-scheme: light;
        }

        .theme-beige {
          --bg-primary: #fcfbf7;
          --bg-secondary: #f4eee2;
          --bg-tertiary: #eae3d2;
          --bg-panel-gradient-from: rgba(244, 238, 226, 0.4);
          --bg-panel-gradient-to: rgba(252, 251, 247, 0.6);
          --border-primary: #dfd4bf;
          --border-secondary: #d4c7b0;
          --text-primary: #2d241e;
          --text-secondary: #5e5045;
          --text-tertiary: #8f8174;
          --stroke-axis: #b7a999;
          --stroke-grid: #eae3d2;
          color-scheme: light;
        }

        .theme-dark {
          --bg-primary: #09090b;
          --bg-secondary: #0f0f11;
          --bg-tertiary: #18181b;
          --bg-panel-gradient-from: rgba(24, 24, 27, 0.3);
          --bg-panel-gradient-to: rgba(9, 9, 11, 0.25);
          --border-primary: rgba(39, 39, 42, 0.6);
          --border-secondary: rgba(63, 63, 70, 0.4);
          --text-primary: #f4f4f5;
          --text-secondary: #a1a1aa;
          --text-tertiary: #71717a;
          --stroke-axis: #3f3f46;
          --stroke-grid: #18181b;
          color-scheme: dark;
        }

        /* Apply theme styles dynamic overrides to standard Tailwind classes colors */
        .theme-custom-active {
          background-color: var(--bg-primary) !important;
          color: var(--text-primary) !important;
        }
        
        .theme-custom-active .bg-zinc-950,
        .theme-custom-active .bg-zinc-950\\/40,
        .theme-custom-active .bg-zinc-950\\/80,
        .theme-custom-active .bg-zinc-950\\/90,
        .theme-custom-active .bg-zinc-955,
        .theme-custom-active .bg-zinc-905 {
          background-color: var(--bg-primary) !important;
        }

        .theme-custom-active .bg-zinc-900,
        .theme-custom-active .bg-zinc-900\\/20,
        .theme-custom-active .bg-zinc-900\\/30,
        .theme-custom-active .bg-zinc-900\\/40,
        .theme-custom-active .bg-zinc-900\\/50,
        .theme-custom-active .bg-zinc-900\\/60,
        .theme-custom-active .bg-zinc-900\\/80 {
          background-color: var(--bg-secondary) !important;
        }

        .theme-custom-active .bg-zinc-805,
        .theme-custom-active .bg-zinc-800,
        .theme-custom-active .bg-zinc-850,
        .theme-custom-active .hover\\:bg-zinc-800:hover,
        .theme-custom-active .hover\\:bg-zinc-850:hover,
        .theme-custom-active .hover\\:bg-zinc-900\\/40:hover {
          background-color: var(--bg-tertiary) !important;
        }

        .theme-custom-active .border-zinc-800,
        .theme-custom-active .border-zinc-850,
        .theme-custom-active .border-zinc-800\\/80,
        .theme-custom-active .border-zinc-850\\/60,
        .theme-custom-active .border-zinc-805,
        .theme-custom-active .border-zinc-800\\/60,
        .theme-custom-active .border-zinc-100,
        .theme-custom-active .border-zinc-200,
        .theme-custom-active .border-zinc-300,
        .theme-custom-active .border-zinc-800\\/40 {
          border-color: var(--border-primary) !important;
        }

        .theme-custom-active .border-zinc-900,
        .theme-custom-active .border-zinc-900\\/40,
        .theme-custom-active .border-zinc-900\\/60,
        .theme-custom-active .border-zinc-950 {
          border-color: var(--border-secondary) !important;
        }

        .theme-custom-active .text-zinc-100,
        .theme-custom-active .text-zinc-200,
        .theme-custom-active .text-zinc-300,
        .theme-custom-active .hover\\:text-zinc-200:hover,
        .theme-custom-active .group-hover\\:text-zinc-200,
        .theme-custom-active .group-hover\\:text-zinc-100 {
          color: var(--text-primary) !important;
        }

        .theme-custom-active .text-zinc-400,
        .theme-custom-active .hover\\:text-zinc-350:hover,
        .theme-custom-active .hover\\:text-zinc-400:hover {
          color: var(--text-secondary) !important;
        }

        .theme-custom-active .text-zinc-500,
        .theme-custom-active .text-zinc-650,
        .theme-custom-active .text-zinc-600 {
          color: var(--text-tertiary) !important;
        }
      `}</style>

      {/* Top Header Navigation */}
      <Header
        fiatCurrency={fiatCurrency}
        onFiatChange={setFiatCurrency}
        apiConnected={apiConnected}
        marketFreshness={marketFreshness}
        onRefresh={() => fetchMarketAssets(true)}
        refreshing={refreshing}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSettingsOpen={isSettingsOpen}
      />

      {/* Main Board Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col gap-5 min-h-0">
        
        {/* Animated Custom Alert Trigger Banner */}
        {activeNotification && (
          <div className="bg-rose-950/90 border border-rose-500/30 text-rose-100 rounded-xl px-4 py-3 text-xs font-mono flex items-center justify-between gap-3 shadow-xl shadow-rose-950/20 animate-bounce">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <Bell className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
              <span className="font-semibold leading-relaxed text-[11px] sm:text-xs">
                {activeNotification}
              </span>
            </div>
            <button 
              onClick={() => setActiveNotification(null)}
              className="bg-rose-800 hover:bg-rose-700 text-rose-100 font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-wide cursor-pointer select-none transition-all active:scale-95 shrink-0 animate-none"
            >
              Acknowledge
            </button>
          </div>
        )}

        {/* Workspace Canvas Layout Customizer Strip */}
        <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                Workspace Canvas Layout Customizer
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Interactive Bento Grid
                </span>
              </h2>
              <p className="text-xs text-zinc-500 font-sans tracking-normal mt-0.5">
                Sculpt your perfect screen environment. Drag widgets manually by grip handles to reorder, resize individual widths, or toggle visibility.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 border cursor-pointer transition-all active:scale-95 ${
                isCustomizerOpen
                  ? "bg-zinc-800 text-zinc-200 border-zinc-700"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
              }`}
            >
              <Settings2 className="w-4 h-4" />
              {isCustomizerOpen ? "Close Control Console" : "Add/Remove Widgets"}
            </button>
            <button
              onClick={handleResetWidgets}
              className="px-3 py-1.5 bg-zinc-905 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              title="Reset workspace back to optimized layout"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Workspace
            </button>
          </div>
        </div>

        {/* Customization Console Drawer Cabinet */}
        {isCustomizerOpen && (
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest">
                Active & Inactive Widget Managers
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {widgets.filter(w => w.isShown).length} of {widgets.length} Widgets Active
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {widgets.map((widget) => {
                return (
                  <div 
                    key={widget.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                      widget.isShown 
                        ? "bg-zinc-900/30 border-zinc-850 hover:border-zinc-800" 
                        : "bg-zinc-900/10 border-zinc-950 text-zinc-600 opacity-60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-300 font-mono">
                          {widget.title}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${
                          widget.isShown 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : "bg-zinc-800 text-zinc-500"
                        }`}>
                          {widget.isShown ? "active" : "hidden"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-sans mt-1 leading-normal">
                        {widget.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-900/60 pt-2 mt-1 gap-2 shrink-0">
                      {widget.isShown ? (
                        <div className="flex bg-zinc-950 p-0.5 rounded border border-zinc-900/80 text-[9px] font-mono">
                          {(["sm", "md", "lg", "full"] as const).map(sz => (
                            <button
                              key={sz}
                              onClick={() => handleResize(widget.id, sz)}
                              className={`px-1 text-[9px] py-0.5 rounded transition-colors cursor-pointer text-center min-w-[20px] ${
                                widget.size === sz
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold"
                                  : "text-zinc-600 hover:text-zinc-400"
                              }`}
                            >
                              {sz.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[9px] font-mono text-zinc-600 italic">
                          Activate to set size
                        </div>
                      )}

                      <button
                        onClick={() => handleToggleWidget(widget.id)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono transition-colors cursor-pointer uppercase ${
                          widget.isShown
                            ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/30"
                            : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 hover:border-emerald-500/30"
                        }`}
                      >
                        {widget.isShown ? "Hide" : "Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Bento Panel Grid of customizable widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {widgets.filter((w) => w.isShown).map((widget) => {
            return (
              <div
                key={widget.id}
                draggable
                onDragStart={(e) => handleDragStart(e, widget.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, widget.id)}
                onDragEnd={handleDragEnd}
                className={`transition-all duration-300 ${getSizeClass(widget.size)} ${
                  draggedWidgetId === widget.id 
                    ? "opacity-20 border-2 border-dashed border-emerald-500/60 bg-emerald-950/10 scale-[0.98] pointer-events-none" 
                    : ""
                }`}
              >
                {/* Widget Wrapper Card */}
                <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-4 flex flex-col gap-4 relative hover:border-zinc-800 transition-all h-full group bg-gradient-to-b from-zinc-900/30 to-zinc-950/25 shadow-lg">
                  
                  {/* Widget Customization Control strip shown inside the Card */}
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2 select-none">
                    
                    {/* Header left: Title and Drag grip */}
                    <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing text-zinc-400 group-hover:text-zinc-200 transition-colors">
                      <div className="p-1 hover:bg-zinc-805 rounded transition-colors" title="Hold to drag & drop widget to reorder">
                        <GripVertical className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider font-mono">
                        {widget.title}
                      </span>
                    </div>

                    {/* Header right: Size controls & Remove */}
                    <div className="flex items-center gap-2 opacity-10 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      {/* Sizing buttons */}
                      <div className="flex bg-zinc-950 p-0.5 rounded border border-zinc-800 text-[9px] font-mono font-medium">
                        {(["sm", "md", "lg", "full"] as const).map((sz) => (
                          <button
                            key={sz}
                            onClick={() => handleResize(widget.id, sz)}
                            className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                              widget.size === sz
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                            title={`Set width span space to ${sz.toUpperCase()}`}
                          >
                            {sz.toUpperCase()}
                          </button>
                        ))}
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleToggleWidget(widget.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                        title="Hide widget from layout grid"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* Content Section: Render actual component based on matching id */}
                  <div className="flex-1 min-h-0">
                    {widget.id === "market-stats" && (
                      <MarketStats
                        coins={coins}
                        fiatCurrency={fiatCurrency}
                        rateMyr={rateMyr}
                        rateCny={rateCny}
                      />
                    )}

                    {widget.id === "live-watchlist" && (
                      loadingCoins ? (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-12 text-center h-[340px] flex flex-col items-center justify-center gap-2">
                          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs text-zinc-500 font-mono animate-pulse">Syncing macro asset prices...</span>
                        </div>
                      ) : (
                        <LiveCoinsTable
                          coins={coins}
                          fiatCurrency={fiatCurrency}
                          rateMyr={rateMyr}
                          rateCny={rateCny}
                          onSelectCoin={setSelectedCoinId}
                          selectedCoinId={selectedCoinId}
                          onAddToPortfolio={handleAddItemToPortfolio}
                          watchlist={watchlist}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      )
                    )}

                    {widget.id === "watchlist-alerts" && (
                      loadingCoins ? (
                        <div className="rounded-xl border border-zinc-850 bg-zinc-950/20 p-12 text-center h-[300px] flex flex-col items-center justify-center gap-2">
                          <span className="text-xs text-zinc-500 font-mono text-center">Waiting for market assets sync...</span>
                        </div>
                      ) : (
                        <WatchlistAlerts
                          coins={coins}
                          watchlist={watchlist}
                          alerts={alerts}
                          onToggleWatchlist={handleToggleWatchlist}
                          onAddAlert={handleAddAlert}
                          onRemoveAlert={handleRemoveAlert}
                          onToggleAlertStatus={handleToggleAlertStatus}
                          fiatCurrency={fiatCurrency}
                          rateMyr={rateMyr}
                          rateCny={rateCny}
                          onSelectCoin={setSelectedCoinId}
                        />
                      )
                    )}

                    {widget.id === "financial-chart" && (
                      <FinancialChart
                        coinName={activeSelectedCoin ? activeSelectedCoin.name : ""}
                        coinSymbol={activeSelectedCoin ? activeSelectedCoin.symbol : ""}
                        history={coinHistory}
                        loading={loadingHistory}
                        fiatCurrency={fiatCurrency}
                        rateMyr={rateMyr}
                        rateCny={rateCny}
                      />
                    )}


                  </div>

                </div>
              </div>
            );
          })}
          
          {widgets.filter((w) => w.isShown).length === 0 && (
            <div className="col-span-12 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-16 text-center flex flex-col items-center justify-center gap-3">
              <LayoutGrid className="w-10 h-10 text-zinc-650 animate-pulse" />
              <h3 className="text-sm font-semibold text-zinc-300 font-mono">Your Workspace Canvas is Clean</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                You have hidden all widgets from layout view. Tap the "Add/Remove Widgets" console button in layout manager to toggle them on or restore layouts.
              </p>
              <button
                onClick={handleResetWidgets}
                className="mt-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold font-mono flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore Optimal Default Canvas
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Humble footnote */}
      <footer className="py-4 border-t border-zinc-900 bg-zinc-950 text-center text-[10px] text-zinc-600 font-mono tracking-wider shrink-0 mt-8">
        CoinCap Market Data &middot; Data is indicative and strictly for research education purposes.
      </footer>

      {/* Real-time 256-bit personalization drawer cabinet popup portal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsSettingsOpen(false)}>
          <div 
            className="bg-zinc-900/95 border border-zinc-800 rounded-2xl w-full max-w-md p-6 flex flex-col gap-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)"
            }}
          >
            {/* Settings Header */}
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-emerald-400" style={{ color: "var(--accent-color)" }} />
                <div>
                  <h3 className="text-xs font-bold font-mono text-zinc-100" style={{ color: 'var(--text-primary)' }}>WORKSPACE PERSONALIZATION</h3>
                  <p className="text-[10px] text-zinc-500" style={{ color: 'var(--text-tertiary)' }}>Adjust workspace theme and highlight color</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Theme selection section */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold font-mono text-zinc-400 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <span>1. CHOOSE CANVAS THEME</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-zinc-800 text-emerald-400 uppercase font-bold" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--accent-color)' }}>
                  Active: {themeMode}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Option 1: Light Theme */}
                <button
                  onClick={() => handleSetThemeMode("light")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    themeMode === "light"
                      ? "bg-zinc-100 font-bold border-zinc-900"
                      : "bg-zinc-950/20 border-zinc-800 hover:border-zinc-700"
                  }`}
                  style={themeMode === "light" ? { borderColor: 'var(--accent-color)', backgroundColor: 'rgba(var(--accent-rgb), 0.05)' } : {}}
                >
                  <div className="w-5 h-5 rounded-full bg-white border border-zinc-300 shadow-inner"></div>
                  <span className="text-[10px] font-mono" style={{ color: themeMode === "light" ? 'var(--accent-color)' : 'var(--text-primary)' }}>Light</span>
                </button>

                {/* Option 2: Dark Night Theme */}
                <button
                  onClick={() => handleSetThemeMode("dark")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    themeMode === "dark"
                      ? "bg-zinc-900 font-bold"
                      : "bg-zinc-950/20 border-zinc-800 hover:border-zinc-700"
                  }`}
                  style={themeMode === "dark" ? { borderColor: 'var(--accent-color)', backgroundColor: 'rgba(var(--accent-rgb), 0.05)' } : {}}
                >
                  <div className="w-5 h-5 rounded-full bg-zinc-955 border border-zinc-800 shadow-inner"></div>
                  <span className="text-[10px] font-mono" style={{ color: themeMode === "dark" ? 'var(--accent-color)' : 'var(--text-primary)' }}>Dark Night</span>
                </button>

                {/* Option 3: Beige Coffee Theme */}
                <button
                  onClick={() => handleSetThemeMode("beige")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    themeMode === "beige"
                      ? "bg-[#FAF6F0] font-bold"
                      : "bg-zinc-950/20 border-zinc-800 hover:border-zinc-700"
                  }`}
                  style={themeMode === "beige" ? { borderColor: 'var(--accent-color)', backgroundColor: 'rgba(var(--accent-rgb), 0.05)' } : {}}
                >
                  <div className="w-5 h-5 rounded-full bg-[#f4eee2] border border-[#dfd4bf] shadow-inner"></div>
                  <span className="text-[10px] font-mono" style={{ color: themeMode === "beige" ? 'var(--accent-color)' : 'var(--text-primary)' }}>Beige Coffee</span>
                </button>
              </div>
            </div>

            {/* Accent Color Selection section */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold font-mono text-zinc-400 flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>2. SELECT HIGHLIGHT COLOR (256-BIT RGB)</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--accent-color)' }}>{accentColor.toUpperCase()}</span>
              </label>
              
              {/* 256-bit Custom Color Picker */}
              <div className="flex items-center gap-4 bg-zinc-950/40 p-3 rounded-xl border" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border shrink-0 cursor-pointer group" style={{ borderColor: 'var(--border-primary)' }}>
                  <input 
                    type="color" 
                    value={accentColor}
                    onChange={(e) => handleSetAccentColor(e.target.value)}
                    className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-zinc-200 block" style={{ color: 'var(--text-primary)' }}>Custom Dynamic Palette</span>
                  <p className="text-[10px] text-zinc-500 font-sans" style={{ color: 'var(--text-tertiary)' }}>Tap the swatch selector for any 256-bit custom color</p>
                </div>
              </div>

              {/* Preset Fast Selectors */}
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {[
                  { name: "Default Green", hex: "#10b981" },
                  { name: "Cyan Teal", hex: "#06b6d4" },
                  { name: "Noble Purple", hex: "#8b5cf6" },
                  { name: "Amber Gold", hex: "#f59e0b" },
                  { name: "Crimson Red", hex: "#ef4444" },
                ].map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => handleSetAccentColor(preset.hex)}
                    className="px-2.5 py-1 text-[10px] font-mono rounded-md border transition-all cursor-pointer flex items-center gap-1"
                    style={
                      accentColor.toLowerCase() === preset.hex.toLowerCase()
                        ? { borderColor: 'var(--accent-color)', color: 'var(--accent-color)', backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }
                        : { borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }
                    }
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.hex }}></span>
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notice Banner */}
            <div className="bg-zinc-950 text-[10px] text-zinc-500 font-sans p-3 rounded-xl border leading-relaxed" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
              <span className="text-amber-500 font-bold uppercase block mb-0.5">⚠️ DIRECTIONAL COLOUR PROTECTION</span>
              Directional indices (positive/negative price changes, up/down arrows and trendlines) are protected to retain system clarity and prevent color confusion.
            </div>

            {/* Reset to system default */}
            <button
              onClick={() => {
                handleSetAccentColor("#10b981");
                handleSetThemeMode("dark");
              }}
              className="w-full py-2 bg-zinc-955 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Palette & Theme
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
