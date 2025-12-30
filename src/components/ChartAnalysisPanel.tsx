import { TrendingUp, TrendingDown, Minus, Target, Shield, AlertTriangle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartAnalysis } from "@/lib/types";
import { formatPrice } from "@/lib/market-data";

interface ChartAnalysisPanelProps {
  analysis: ChartAnalysis | null;
  symbol: string;
  currentPrice: number;
}

export function ChartAnalysisPanel({ analysis, symbol, currentPrice }: ChartAnalysisPanelProps) {
  if (!analysis) {
    return (
      <div className="h-full bg-card border border-border rounded-lg p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Loading analysis...
          </p>
        </div>
      </div>
    );
  }

  const trendConfig = {
    bullish: {
      icon: TrendingUp,
      color: "text-bull",
      bg: "bg-bull/10",
      border: "border-bull/30",
      label: "BULLISH",
    },
    bearish: {
      icon: TrendingDown,
      color: "text-bear",
      bg: "bg-bear/10",
      border: "border-bear/30",
      label: "BEARISH",
    },
    neutral: {
      icon: Minus,
      color: "text-neutral",
      bg: "bg-neutral/10",
      border: "border-neutral/30",
      label: "NEUTRAL",
    },
  };

  const trend = trendConfig[analysis.trend];
  const TrendIcon = trend.icon;

  return (
    <div className="h-full bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-sm">AI ANALYSIS</h3>
          <div className="flex items-center gap-1">
            <div className="live-dot" />
            <span className="text-[10px] text-muted-foreground">LIVE</span>
          </div>
        </div>
        
        {/* Trend Badge */}
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border",
          trend.bg,
          trend.border
        )}>
          <TrendIcon className={cn("w-5 h-5", trend.color)} />
          <div className="flex-1">
            <p className={cn("font-display font-bold text-sm", trend.color)}>
              {trend.label}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Confidence: {analysis.strength}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Strength</p>
            <div className="w-16 h-1.5 bg-muted rounded-full mt-1">
              <div 
                className={cn("h-full rounded-full", trend.bg.replace("/10", ""))}
                style={{ width: `${analysis.strength}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Signals */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            <Zap className="w-3 h-3" />
            SIGNALS
          </h4>
          <div className="space-y-1.5">
            {analysis.signals.map((signal, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 text-xs px-2 py-1.5 rounded bg-muted/30"
              >
                <div className={cn("w-1.5 h-1.5 rounded-full", trend.bg.replace("/10", ""))} />
                <span>{signal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Levels */}
        <div className="grid grid-cols-2 gap-3">
          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <Shield className="w-3 h-3 text-bull" />
              SUPPORT
            </h4>
            <div className="space-y-1">
              {analysis.support.slice(0, 3).map((level, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between text-xs px-2 py-1 rounded bg-bull/5 border border-bull/20"
                >
                  <span className="text-muted-foreground">S{i + 1}</span>
                  <span className="text-bull font-mono">{formatPrice(level, symbol)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resistance */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <Target className="w-3 h-3 text-bear" />
              RESISTANCE
            </h4>
            <div className="space-y-1">
              {analysis.resistance.slice(0, 3).map((level, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between text-xs px-2 py-1 rounded bg-bear/5 border border-bear/20"
                >
                  <span className="text-muted-foreground">R{i + 1}</span>
                  <span className="text-bear font-mono">{formatPrice(level, symbol)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patterns */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            PATTERNS DETECTED
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.patterns.map((pattern, i) => (
              <span 
                key={i}
                className="text-[10px] px-2 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
              >
                {pattern}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
