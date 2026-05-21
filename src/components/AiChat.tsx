import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Sparkles, MessageSquare, RefreshCw, X, HelpCircle, AlertCircle } from "lucide-react";

interface AiChatProps {
  coinName: string | null;
  coinId: string | null;
  onSendMessage: (text: string) => Promise<string>;
  chatHistory: ChatMessage[];
  onClearHistory: () => void;
}

const PRESET_PROMPTS = [
  "Should I invest in SOL or ETH right now?",
  "Explain Exponential Moving Averages (EMA) simply.",
  "Which L1 assets are showing bullish momentum?",
  "Formulate a safe strategy for a highly volatile market."
];

export default function AiChat({
  coinName,
  coinId,
  onSendMessage,
  chatHistory,
  onClearHistory
}: AiChatProps) {
  const [inputText, setInputText] = useState("");
  const [generating, setGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, generating]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || generating) return;

    setInputText("");
    setGenerating(true);
    try {
      await onSendMessage(trimmed);
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 shadow-xl flex flex-col h-full min-h-[450px]">
      {/* Container Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4 shrink-0">
        <div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-tight">
              AI Quantitative Terminal
            </h3>
            {coinName && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Focus: {coinName}
              </span>
            )}
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Grounded by active orderbook caches and historical metrics
          </p>
        </div>

        {chatHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-all cursor-pointer"
            title="Wipe conversation logs"
          >
            <X className="w-3 h-3" /> Reset Session
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 min-h-[220px]"
      >
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 my-auto">
            <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse mb-3" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
              Ask AI Trading Advisor
            </h4>
            <p className="text-[11px] text-zinc-500 max-w-sm mt-1 leading-normal">
              Get detailed, math-grounded technical analysis, risks evaluation, and trends explanations.
            </p>

            {/* Quick Prompts Grid */}
            <div className="mt-5 w-full max-w-md grid grid-cols-1 gap-2">
              <span className="text-[9px] text-zinc-600 font-mono uppercase text-left tracking-wide">
                Suggested quantitative metrics:
              </span>
              {PRESET_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="text-left text-[11px] text-zinc-400 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 p-2.5 rounded-lg hover:border-emerald-500/25 hover:text-emerald-300 transition-all cursor-pointer font-mono leading-normal"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tr-none"
                      : "bg-emerald-500/5 border border-emerald-500/10 text-emerald-100 rounded-tl-none relative"
                  }`}>
                    {/* Character tag */}
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                      {!isUser && <Sparkles className="w-3 h-3 text-emerald-400" />}
                      <span>{isUser ? "Quantitative Query" : "Quantum AI Analytica"}</span>
                    </div>
                    
                    {/* Text block */}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {/* Loading / Generating bubble */}
            {generating && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl rounded-tl-none p-3 text-xs bg-emerald-500/5 border border-emerald-500/10 text-emerald-100">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 animate-pulse">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Gemini is compiling advice...</span>
                  </div>
                  <div className="flex gap-1 py-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Form Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputText);
        }}
        className="mt-auto border-t border-zinc-900/60 pt-3 shrink-0"
      >
        <div className="flex items-center gap-2 bg-zinc-900/40 border border-zinc-800 p-1.5 rounded-lg focus-within:border-emerald-500/40 transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={generating}
            placeholder={
              coinName 
                ? `Inquire about ${coinName} technical target price...` 
                : "Ask about quantitative rules, breakouts..."
            }
            className="flex-1 bg-transparent text-xs text-zinc-200 pl-2 focus:outline-none placeholder-zinc-600 font-mono"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || generating}
            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-30 border border-emerald-500/20 text-emerald-400 rounded-md cursor-pointer transition-all shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {/* Helper footnote warning */}
        <div className="flex items-center justify-between text-[8px] text-zinc-600 uppercase font-mono mt-2 tracking-wide">
          <div className="flex items-center gap-1">
            <AlertCircle className="w-2.5 h-2.5 text-zinc-700" />
            <span>AI intelligence can deviate; do not trade without backup risk caps.</span>
          </div>
        </div>
      </form>
    </div>
  );
}
