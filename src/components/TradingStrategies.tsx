import { Target, Zap, TrendingUp, Shield, Brain, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: "momentum" | "reversal" | "breakout" | "scalping";
  winRate: number;
  riskLevel: "low" | "medium" | "high";
  timeframe: string;
  prompt: string;
}

const strategies: Strategy[] = [
  {
    id: "smart_money",
    name: "Smart Money Concepts",
    description: "Order blocks, liquidity sweeps, and institutional footprints",
    type: "breakout",
    winRate: 68,
    riskLevel: "medium",
    timeframe: "4H - Daily",
    prompt: "Analyze BTC/USD using Smart Money Concepts. Identify order blocks, liquidity zones, and fair value gaps.",
  },
  {
    id: "scalping",
    name: "Crypto Scalping",
    description: "Quick entries on 1-5 minute timeframes using momentum",
    type: "scalping",
    winRate: 55,
    riskLevel: "high",
    timeframe: "1M - 5M",
    prompt: "Give me a quick scalping setup for BTC on the 1-minute chart with entry, stop loss, and take profit.",
  },
  {
    id: "swing_trade",
    name: "Swing Trading",
    description: "Multi-day positions based on trend following",
    type: "momentum",
    winRate: 62,
    riskLevel: "low",
    timeframe: "Daily - Weekly",
    prompt: "Provide a swing trading analysis for ETH/USD on the daily timeframe with key levels and entry zones.",
  },
  {
    id: "reversal",
    name: "Mean Reversion",
    description: "Catch oversold/overbought reversals using RSI and Bollinger",
    type: "reversal",
    winRate: 58,
    riskLevel: "medium",
    timeframe: "1H - 4H",
    prompt: "Find mean reversion opportunities in the crypto market using RSI divergence and Bollinger Bands.",
  },
  {
    id: "breakout",
    name: "Breakout Hunter",
    description: "Trade key level breakouts with volume confirmation",
    type: "breakout",
    winRate: 52,
    riskLevel: "high",
    timeframe: "15M - 1H",
    prompt: "Analyze SOL/USD for potential breakout setups. Identify key resistance levels and volume patterns.",
  },
  {
    id: "dca",
    name: "DCA Strategy",
    description: "Dollar cost averaging zones for long-term accumulation",
    type: "momentum",
    winRate: 75,
    riskLevel: "low",
    timeframe: "Weekly - Monthly",
    prompt: "Identify optimal DCA entry zones for BTC based on historical support levels and market cycles.",
  },
];

interface TradingStrategiesProps {
  onSelectStrategy: (prompt: string) => void;
}

export function TradingStrategies({ onSelectStrategy }: TradingStrategiesProps) {
  const typeConfig = {
    momentum: { color: "text-bull", bg: "bg-bull/10", border: "border-bull/30" },
    reversal: { color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/30" },
    breakout: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" },
    scalping: { color: "text-accent", bg: "bg-accent/10", border: "border-accent/30" },
  };

  const riskConfig = {
    low: { color: "text-bull", label: "Low Risk" },
    medium: { color: "text-neutral", label: "Medium Risk" },
    high: { color: "text-bear", label: "High Risk" },
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold gradient-text mb-2">
            Trading Strategies
          </h2>
          <p className="text-muted-foreground">
            Select a strategy to get AI-powered analysis and trading signals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategies.map((strategy, index) => {
            const type = typeConfig[strategy.type];
            const risk = riskConfig[strategy.riskLevel];

            return (
              <button
                key={strategy.id}
                onClick={() => onSelectStrategy(strategy.prompt)}
                className={cn(
                  "p-5 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02] group animate-fade-in cyber-border",
                  type.border
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("p-2 rounded-lg", type.bg)}>
                    <Brain className={cn("w-5 h-5", type.color)} />
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className={cn("w-3 h-3", risk.color)} />
                    <span className={cn("text-[10px]", risk.color)}>{risk.label}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                  {strategy.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {strategy.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-bull" />
                    <span className="text-bull font-semibold">{strategy.winRate}%</span>
                    <span className="text-muted-foreground">win rate</span>
                  </div>
                  <span className="text-muted-foreground">{strategy.timeframe}</span>
                </div>

                {/* Type badge */}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <span className={cn(
                    "text-[10px] px-2 py-1 rounded-full uppercase font-semibold",
                    type.bg,
                    type.color
                  )}>
                    {strategy.type}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
