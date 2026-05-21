import { useState, useMemo } from "react";
import { CoinData } from "../types";
import { Search, TrendingDown, ArrowUpRight, Plus, HelpCircle, ArrowUpDown, ArrowUp, ArrowDown, Star } from "lucide-react";

interface LiveCoinsTableProps {
  coins: CoinData[];
  fiatCurrency: "MYR" | "USD" | "CNY";
  rateMyr: number;
  rateCny: number;
  onSelectCoin: (coinId: string) => void;
  selectedCoinId: string | null;
  onAddToPortfolio: (coin: CoinData) => void;
  watchlist: string[];
  onToggleWatchlist: (coinId: string) => void;
}

export default function LiveCoinsTable({
  coins,
  fiatCurrency,
  rateMyr,
  rateCny,
  onSelectCoin,
  selectedCoinId,
  onAddToPortfolio,
  watchlist,
  onToggleWatchlist
}: LiveCoinsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "altcoins" | "watchlist">("all");

  type SortField = "rank" | "name" | "price" | "change" | "marketCap" | "volume";
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "rank" || field === "name" ? "asc" : "desc");
    }
  };

  const renderSortHeader = (label: string, field: SortField, align: "left" | "right" | "center" = "left", extraClasses: string = "") => {
    const isSorted = sortField === field;
    const isAsc = isSorted && sortDirection === "asc";
    const isDesc = isSorted && sortDirection === "desc";

    const getAlignmentClass = () => {
      if (align === "right") return "justify-end";
      if (align === "center") return "justify-center";
      return "justify-start";
    };

    return (
      <th 
        id={`header-sort-${field}`}
        className={`py-3 px-4 font-semibold select-none cursor-pointer hover:text-zinc-200 hover:bg-zinc-900/40 transition-all ${extraClasses}`}
        onClick={() => handleSort(field)}
      >
        <div className={`flex items-center gap-1.5 ${getAlignmentClass()}`}>
          <span>{label}</span>
          <span className="shrink-0 text-zinc-500">
            {isAsc ? (
              <ArrowUp className="w-3 h-3 text-emerald-400" />
            ) : isDesc ? (
              <ArrowDown className="w-3 h-3 text-emerald-400" />
            ) : (
              <ArrowUpDown className="w-3 h-3 opacity-30 hover:opacity-100" />
            )}
          </span>
        </div>
      </th>
    );
  };

  const displayRate = (priceUsd: number) => {
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

  const formatLargeAmount = (num: number) => {
    const displayNum = fiatCurrency === "MYR" ? num * rateMyr : fiatCurrency === "CNY" ? num * rateCny : num;
    const symbol = fiatCurrency === "MYR" ? "RM" : fiatCurrency === "CNY" ? "¥" : "$";
    
    if (displayNum >= 1e12) return `${symbol}${(displayNum / 1e12).toFixed(2)}T`;
    if (displayNum >= 1e9) return `${symbol}${(displayNum / 1e9).toFixed(2)}B`;
    if (displayNum >= 1e6) return `${symbol}${(displayNum / 1e6).toFixed(2)}M`;
    return `${symbol}${displayNum.toLocaleString()}`;
  };

  // Sparkline generator SVG path
  const renderSparkline = (prices: number[], pctChange: number) => {
    if (!prices || prices.length < 2) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    
    const width = 80;
    const height = 28;
    const points = prices.map((price, idx) => {
      const x = (idx / (prices.length - 1)) * width;
      const y = height - ((price - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");

    const color = pctChange >= 0 ? "#10b981" : "#f43f5e";

    return (
      <svg width={width} height={height} className="overflow-visible" aria-label="7d sparkline">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const categoryCoins = coins.filter(c => {
    if (activeCategory === "altcoins") {
      return c.symbol.toLowerCase() !== "btc" && c.id !== "bitcoin";
    }
    if (activeCategory === "watchlist") {
      return watchlist.includes(c.id);
    }
    return true;
  });

  const filteredCoins = categoryCoins.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCoins = useMemo(() => {
    return [...filteredCoins].sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      switch (sortField) {
        case "rank":
          valA = a.rank ?? 999;
          valB = b.rank ?? 999;
          break;
        case "name":
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case "price":
          valA = a.priceUsd;
          valB = b.priceUsd;
          break;
        case "change":
          valA = a.changePercent24h;
          valB = b.changePercent24h;
          break;
        case "marketCap":
          valA = a.marketCapUsd;
          valB = b.marketCapUsd;
          break;
        case "volume":
          valA = a.volumeUsd24h;
          valB = b.volumeUsd24h;
          break;
        default:
          return 0;
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredCoins, sortField, sortDirection]);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm shadow-xl flex flex-col overflow-hidden w-full">
      {/* Category Tabs Strip */}
      <div className="px-4 pt-3.5 pb-2.5 bg-zinc-950/80 border-b border-zinc-900 flex flex-wrap items-center justify-between gap-3">
        <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1 text-xs rounded-md font-medium tracking-tight cursor-pointer transition-all ${
              activeCategory === "all"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All Top 100 Assets
          </button>
          <button
            onClick={() => setActiveCategory("altcoins")}
            className={`px-3 py-1 text-xs rounded-md font-medium tracking-tight cursor-pointer transition-all ${
              activeCategory === "altcoins"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Altcoin Category
          </button>
          <button
            onClick={() => setActiveCategory("watchlist")}
            className={`px-3 py-1 text-xs rounded-md font-medium tracking-tight cursor-pointer transition-all flex items-center gap-1 ${
              activeCategory === "watchlist"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>My Watchlist ({watchlist.length})</span>
          </button>
        </div>
        <div className="text-[10px] text-zinc-500 font-mono">
          Showing {categoryCoins.length} of 100 cryptos
        </div>
      </div>

      {/* Table search utility */}
      <div className="p-4 border-b border-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/20 shrink-0">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-200 flex items-center gap-2">
          <span>Active Asset Watchlist</span>
          <span className="text-[10px] bg-zinc-900 text-zinc-500 font-normal px-2 py-0.5 rounded border border-zinc-800 font-mono">
            {filteredCoins.length} matching
          </span>
        </h2>
        {/* Search Input Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search coin or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/60 border border-zinc-800 text-xs py-2 pl-9 pr-4 rounded-lg placeholder-zinc-500 text-zinc-200 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 transition-all font-mono"
          />
        </div>
      </div>

      {/* Responsive Table Grid */}
      <div className="flex-1 overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900/80 text-[10px] text-zinc-500 uppercase tracking-wider bg-zinc-950/50">
              {renderSortHeader("#", "rank", "center", "font-mono w-12")}
              {renderSortHeader("Token", "name", "left")}
              {renderSortHeader("Price", "price", "right")}
              {renderSortHeader("24h Change", "change", "center", "w-28")}
              {renderSortHeader("Market Cap", "marketCap", "right", "hidden md:table-cell")}
              {renderSortHeader("Volume (24h)", "volume", "right", "hidden lg:table-cell")}
              <th className="py-3 px-4 font-semibold text-center hidden sm:table-cell w-28 font-mono">Sparkline (7d)</th>
              <th className="py-3 px-4 font-semibold text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50 text-[13px]">
            {sortedCoins.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-zinc-500 font-mono">
                  No matching cryptocurrencies found.
                </td>
              </tr>
            ) : (
              sortedCoins.map((coin) => {
                const isSelected = selectedCoinId === coin.id;
                const changeIsPositive = coin.changePercent24h >= 0;

                return (
                  <tr
                    key={coin.id}
                    id={`coin-row-${coin.id}`}
                    onClick={() => onSelectCoin(coin.id)}
                    className={`hover:bg-zinc-900/20 cursor-pointer transition-all ${
                      isSelected ? "bg-emerald-500/5 border-l-2 border-emerald-500" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono text-xs text-zinc-500 text-center">
                      {coin.rank}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(coin.id);
                          }}
                          className={`p-1 rounded hover:bg-zinc-900 transition-all cursor-pointer shrink-0 ${
                            watchlist.includes(coin.id)
                              ? "text-amber-400"
                              : "text-zinc-600 hover:text-zinc-400"
                          }`}
                          title={watchlist.includes(coin.id) ? "Remove from Watchlist" : "Pin to Watchlist"}
                        >
                          <Star className={`w-3.5 h-3.5 ${watchlist.includes(coin.id) ? "fill-amber-400" : ""}`} />
                        </button>
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 overflow-hidden shrink-0">
                          <img
                            src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                            alt={coin.symbol}
                            className="w-6 h-6 object-contain"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <span className="hidden text-[11px] font-bold text-emerald-400 font-mono">
                            {coin.symbol.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-200 leading-snug">{coin.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono uppercase">{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold font-mono text-zinc-100">
                      {displayRate(coin.priceUsd)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold font-mono px-2 py-0.5 rounded-md border ${
                            changeIsPositive
                              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/15"
                              : "text-rose-400 bg-rose-500/10 border-rose-500/15"
                          }`}
                        >
                          {changeIsPositive ? "+" : ""}
                          {coin.changePercent24h.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right hidden md:table-cell text-zinc-300 font-mono text-xs">
                      {formatLargeAmount(coin.marketCapUsd)}
                    </td>
                    <td className="py-3.5 px-4 text-right hidden lg:table-cell text-zinc-300 font-mono text-xs">
                      {formatLargeAmount(coin.volumeUsd24h)}
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="flex justify-center">
                        {renderSparkline(coin.history7d, coin.changePercent24h)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Selector indicator details */}
                        <button
                          onClick={() => onSelectCoin(coin.id)}
                          className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                          }`}
                          title="View Chart"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        {/* Expand/Contract to active portfolio */}
                        <button
                          onClick={() => onAddToPortfolio(coin)}
                          className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-emerald-500/30 hover:text-emerald-400 rounded-lg text-xs cursor-pointer transition-all"
                          title="Add to AI Portfolio Analyzer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
