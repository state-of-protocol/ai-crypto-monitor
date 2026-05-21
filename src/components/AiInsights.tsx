import { AiMarketInsight } from "../types";
import { Sparkles, HelpCircle, ShieldAlert, AlertCircle, Info, CheckCircle2, ChevronRight } from "lucide-react";

interface AiInsightsProps {
  insight: AiMarketInsight | null;
  loading: boolean;
  onTriggerAnalysis: () => void;
  language: "MY" | "ENG" | "CN";
  onLanguageChange: (lang: "MY" | "ENG" | "CN") => void;
}

const LOCAL_STRINGS = {
  MY: {
    cardTitle: "LAPORAN INTELIGENSI MAKRO",
    cardSubtitle: "Parameter pasaran terkini dikira secara langsung oleh gemini-3.5-flash",
    reAnalyze: "Analisis Semula",
    analyzing: "Menilai...",
    scanning: "Sistem Gemini sedang mengimbas buku pesanan pasaran...",
    headlineTitle: "Berita Utama Inteligensi Pasaran",
    summaryTitle: "Pentafsiran Landskap Pasaran Kualitatif",
    advisoryTitle: "Isyarat Posisi & Amaran Am",
    technicalTitle: "Rujukan Kuantitatif Teknikal AI",
    supportLabel: "Had Sokongan",
    resistanceLabel: "Had Rintangan",
    rsiLabel: "Indeks Kekuatan Relatif (RSI)",
    adviceTitle: "Saranan Kedudukan Strategik AI",
    uninitialized: "Papan pemuka dinamik belum diselaraskan.",
    requestAnalysis: "Permintaan Analisis Pasar",
  },
  ENG: {
    cardTitle: "MACRO INTELLIGENCE REPORT",
    cardSubtitle: "Aggregated market parameters processed by gemini-3.5-flash",
    reAnalyze: "Re-Analyze",
    analyzing: "Analyzing...",
    scanning: "Gemini is scanning market orderbooks...",
    headlineTitle: "Market Intelligence Headline",
    summaryTitle: "Qualitative Market Review",
    advisoryTitle: "Advisory Flags & Warnings",
    technicalTitle: "Quantitative Technical Overlays",
    supportLabel: "Support Bands",
    resistanceLabel: "Resistance Bands",
    rsiLabel: "Relative Strength Index (RSI)",
    adviceTitle: "AI Strategic Positioning Recommendation",
    uninitialized: "Insights dashboard uninitialized.",
    requestAnalysis: "Request AI Analysis",
  },
  CN: {
    cardTitle: "加密宏观智能报告",
    cardSubtitle: "基于 gemini-3.5-flash 引擎实时解析的链上与委托单环境",
    reAnalyze: "深度研判",
    analyzing: "研判中...",
    scanning: "Gemini 正在细化扫描多链市场深度与量能变动...",
    headlineTitle: "全球智能市场头条",
    summaryTitle: "宏观定性逻辑盘整研判",
    advisoryTitle: "战略性机会与防御告警信号",
    technicalTitle: "多空定量技术指标指标参考",
    supportLabel: "多头有力支撑",
    resistanceLabel: "空头复苏阻力",
    rsiLabel: "相对强弱指数 (RSI)",
    adviceTitle: "AI 决策建议与风控对策",
    uninitialized: "AI 宏观分析面板未初始化数据。",
    requestAnalysis: "生成 AI 智能研判报告",
  }
};

export default function AiInsights({
  insight,
  loading,
  onTriggerAnalysis,
  language = "MY",
  onLanguageChange
}: AiInsightsProps) {
  const t = LOCAL_STRINGS[language] || LOCAL_STRINGS.MY;

  const getFlagIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />;
    }
  };

  const getFlagClasses = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-rose-500/5 border-rose-500/10 text-rose-200";
      case "success":
        return "bg-emerald-500/5 border-emerald-500/10 text-emerald-200";
      default:
        return "bg-sky-500/5 border-sky-500/10 text-sky-200";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 shadow-xl flex flex-col h-full" style={{ backgroundColor: 'var(--bg-panel-gradient-from)', borderColor: 'var(--border-primary)' }}>
      {/* Container Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4 mb-4 shrink-0" style={{ borderColor: 'var(--border-primary)' }}>
        <div>
          <div className="flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ color: "var(--accent-color)", animationDuration: "8s" }} />
            <h3 className="text-xs font-black font-mono text-zinc-100 uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {t.cardTitle}
            </h3>
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {t.cardSubtitle}
          </p>
        </div>

        {/* Action controllers bar (tabs + re-analyze button) */}
        <div className="flex items-center gap-2 select-none self-end sm:self-auto">
          {/* Option tab switch bahasa */}
          <div className="flex items-center gap-0.5 bg-zinc-900 border border-zinc-850 p-0.5 rounded-lg shrink-0" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            {(["MY", "ENG", "CN"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                  language === lang
                    ? "bg-emerald-500/20 text-emerald-400 font-extrabold"
                    : "text-zinc-500 hover:text-zinc-350"
                }`}
                style={language === lang ? { backgroundColor: 'rgba(var(--accent-rgb), 0.15)', color: 'var(--accent-color)' } : { color: 'var(--text-secondary)' }}
                title={`Switch Language to ${lang}`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={onTriggerAnalysis}
            disabled={loading}
            className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 px-2.5 py-1 rounded transition-all cursor-pointer disabled:opacity-45 shrink-0"
            style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.11)', borderColor: 'rgba(var(--accent-rgb), 0.25)', color: 'var(--accent-color)' }}
          >
            {loading ? t.analyzing : t.reAnalyze}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm opacity-75 animate-ping" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.2)' }}></div>
            <Sparkles className="w-6 h-6 text-emerald-400 relative animate-pulse" style={{ color: "var(--accent-color)" }} />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono mt-2 animate-pulse" style={{ color: 'var(--text-secondary)' }}>
            {t.scanning}
          </span>
        </div>
      ) : insight ? (
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {/* Headline Banner */}
          <div 
            className="bg-gradient-to-r border-l-2 p-3.5 rounded-r-lg"
            style={{
              borderColor: 'var(--accent-color)',
              backgroundImage: 'linear-gradient(to right, rgba(var(--accent-rgb), 0.08), transparent)'
            }}
          >
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono" style={{ color: 'var(--accent-color)' }}>
              {t.headlineTitle}
            </h4>
            <p className="text-xs font-extrabold text-zinc-100 mt-1 uppercase tracking-tight leading-snug" style={{ color: 'var(--text-primary)' }}>
              {insight.headline}
            </p>
          </div>

          {/* Core Summary Paragraph */}
          <div>
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider font-bold" style={{ color: 'var(--text-secondary)' }}>
              {t.summaryTitle}
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed mt-1" style={{ color: 'var(--text-primary)' }}>
              {insight.summary}
            </p>
          </div>

          <hr className="border-zinc-900" style={{ borderColor: 'var(--border-primary)' }} />

          {/* Advisory Alerts Block */}
          <div>
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block mb-2 font-bold" style={{ color: 'var(--text-secondary)' }}>
              {t.advisoryTitle} ({insight.advisoryFlags?.length || 0})
            </span>
            <div className="space-y-2">
              {insight.advisoryFlags?.map((flag, idx) => (
                <div
                  key={idx}
                  className={`border p-2.5 rounded-lg flex items-start gap-2.5 text-xs transition-colors hover:bg-zinc-900/10 ${getFlagClasses(
                    flag.type
                  )}`}
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  {getFlagIcon(flag.type)}
                  <div>
                    <span className="font-bold block tracking-tight text-zinc-100" style={{ color: 'var(--text-primary)' }}>
                      {flag.title}
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug" style={{ color: 'var(--text-secondary)' }}>
                      {flag.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-zinc-900" style={{ borderColor: 'var(--border-primary)' }} />

          {/* Technical Levels Table */}
          <div>
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block mb-2 font-bold" style={{ color: 'var(--text-secondary)' }}>
              {t.technicalTitle}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-zinc-950 border border-zinc-90 w-full p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                <span className="text-[9px] text-zinc-500 font-mono uppercase block" style={{ color: 'var(--text-tertiary)' }}>
                  {t.supportLabel}
                </span>
                <span className="text-[11px] font-extrabold font-mono text-emerald-400 block mt-1" style={{ color: 'var(--accent-color)' }}>
                  {insight.technicalAnalysis?.support}
                </span>
              </div>
              <div className="bg-zinc-950 border border-zinc-90 w-full p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                <span className="text-[9px] text-zinc-500 font-mono uppercase block" style={{ color: 'var(--text-tertiary)' }}>
                  {t.resistanceLabel}
                </span>
                <span className="text-[11px] font-extrabold font-mono text-rose-400 block mt-1">
                  {insight.technicalAnalysis?.resistance}
                </span>
              </div>
              <div className="bg-zinc-950 border border-zinc-90 w-full p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                <span className="text-[9px] text-zinc-500 font-mono uppercase block" style={{ color: 'var(--text-tertiary)' }}>
                  {t.rsiLabel}
                </span>
                <span className="text-[11px] font-extrabold font-mono text-amber-500 block mt-1">
                  {insight.technicalAnalysis?.rsiStatus}
                </span>
              </div>
            </div>

            {/* Strategic Trading Advice */}
            <div className="mt-3 bg-zinc-950 border border-zinc-900 p-3 rounded-lg text-xs" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider font-bold block mb-1" style={{ color: 'var(--text-secondary)' }}>
                {t.adviceTitle}
              </span>
              <p className="text-[10px] text-zinc-400 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {insight.technicalAnalysis?.advice}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-500">
          <ChevronRight className="w-6 h-6 text-zinc-700 mx-auto" />
          <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-secondary)' }}>{t.uninitialized}</p>
          <button
            onClick={onTriggerAnalysis}
            className="mt-3 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded font-mono font-bold cursor-pointer"
            style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)', borderColor: 'rgba(var(--accent-rgb), 0.2)', color: 'var(--accent-color)' }}
          >
            {t.requestAnalysis}
          </button>
        </div>
      )}
    </div>
  );
}
