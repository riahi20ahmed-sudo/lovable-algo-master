import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, Bot, User, Zap, Clock, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Analysis, Message } from "@/lib/types";
import { extractAsset, generateMockAnalysis } from "@/lib/analysis";

interface ChatPanelProps {
  onAnalysisComplete: (analysis: Analysis) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
  isVisible: boolean;
  pendingPrompt?: string | null;
  clearPendingPrompt?: () => void;
}

const EXAMPLE_PROMPTS = [
  { text: "Analyze BTC/USD on 4H", icon: "₿", color: "from-primary/20 to-primary/5" },
  { text: "ETH technical outlook", icon: "Ξ", color: "from-secondary/20 to-secondary/5" },
  { text: "SOL support & resistance", icon: "◎", color: "from-accent/20 to-accent/5" },
  { text: "Full market analysis", icon: "📊", color: "from-neutral/20 to-neutral/5" },
];

const FEATURES = [
  { icon: Zap, text: "Real-time signals" },
  { icon: BarChart2, text: "Multi-timeframe" },
  { icon: Clock, text: "24/7 analysis" },
];

export function ChatPanel({
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing,
  isVisible,
  pendingPrompt,
  clearPendingPrompt,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (pendingPrompt && clearPendingPrompt) {
      setInput(pendingPrompt);
      handleSubmit(pendingPrompt);
      clearPendingPrompt();
    }
  }, [pendingPrompt, clearPendingPrompt]);

  const handleSubmit = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim() || isAnalyzing) return;

    const userMessage: Message = {
      role: "user",
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsAnalyzing(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const asset = extractAsset(messageText);
    const analysis = generateMockAnalysis(asset, messageText);

    const assistantMessage: Message = {
      role: "assistant",
      content: `Analysis complete for ${asset}. I've detected a ${analysis.trend} trend with ${analysis.riskManagement.confidence}% confidence. Check the analysis panel for detailed insights.`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsAnalyzing(false);
    onAnalysisComplete(analysis);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto">
            {/* Hero */}
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center float">
                <Bot className="w-10 h-10 text-background" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent blur-2xl opacity-30" />
            </div>

            <h2 className="font-display text-2xl font-bold gradient-text mb-3">
              AI Trading Analysis
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-md">
              Get professional-grade market analysis powered by advanced AI. 
              Ask about any asset, timeframe, or trading strategy.
            </p>

            {/* Features */}
            <div className="flex items-center gap-6 mb-8">
              {FEATURES.map((feature) => (
                <div key={feature.text} className="flex items-center gap-2">
                  <feature.icon className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Example prompts */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => {
                    setInput(prompt.text);
                    handleSubmit(prompt.text);
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-gradient-to-r text-left transition-all hover:border-primary/50 hover:shadow-neon",
                    prompt.color
                  )}
                >
                  <span className="text-xl">{prompt.icon}</span>
                  <span className="text-sm">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-4 animate-fade-in",
                  message.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    message.role === "user"
                      ? "bg-primary/20 border border-primary/30"
                      : "bg-gradient-to-br from-primary via-secondary to-accent"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4 text-primary" />
                  ) : (
                    <Bot className="w-4 h-4 text-background" />
                  )}
                </div>
                <div
                  className={cn(
                    "flex-1 rounded-lg p-4 max-w-lg",
                    message.role === "user"
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-card border border-border"
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isAnalyzing && (
              <div className="flex gap-4 animate-fade-in">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                  <Bot className="w-4 h-4 text-background" />
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Analyzing market data...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="max-w-3xl mx-auto relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any market, asset, or trading strategy..."
            className="min-h-[60px] pr-14 bg-background/50 border-border/50 focus:border-primary/50 resize-none"
            disabled={isAnalyzing}
          />
          <Button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isAnalyzing}
            size="icon"
            className="absolute right-2 bottom-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
