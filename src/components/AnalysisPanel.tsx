import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Shield, 
  AlertTriangle, 
  BarChart2,
  Activity,
  Percent,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Analysis } from "@/lib/types";

interface AnalysisPanelProps {
  analysis: Analysis | null;
  isAnalyzing: boolean;
  isVisible: boolean;
}

export function AnalysisPanel({ analysis, isAnalyzing, isVisible }: AnalysisPanelProps) {
  if (!isVisible) return null;

  if (!analysis && !isAnalyzing) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background/50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">
            No Analysis Yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Ask the AI to analyze any market or trading pair to see detailed insights here.
          </p>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background/50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 pulse-glow">
            <Activity className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">
            Analyzing Market...
          </h3>
          <p className="text-sm text-muted-foreground">
            Processing technical indicators and patterns
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const trendConfig = {
    bullish: {
      icon: TrendingUp,
      color: "text-bull",
      bg: "bg-bull",
      bgLight: "bg-bull/10",
      border: "border-bull/30",
      shadow: "shadow-glow-bull",
    },
    bearish: {
      icon: TrendingDown,
      color: "text-bear",
      bg: "bg-bear",
      bgLight: "bg-bear/10",
      border: "border-bear/30",
      shadow: "shadow-glow-bear",
    },
    neutral: {
      icon: Minus,
      color: "text-neutral",
      bg: "bg-neutral",
      bgLight: "bg-neutral/10",
      border: "border-neutral/30",
      shadow: "",
    },
  };

  const trend = trendConfig[analysis.trend];
  const TrendIcon = trend.icon;

  return (
    <div className="flex-1 overflow-y-auto bg-background/50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">{analysis.asset}</h2>
            <p className="text-sm text-muted-foreground">{analysis.timeframe} Analysis</p>
          </div>
          <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-lg border",
            trend.bgLight,
            trend.border,
            trend.shadow
          )}>
            <TrendIcon className={cn("w-6 h-6", trend.color)} />
            <div>
              <p className={cn("font-display font-bold uppercase", trend.color)}>
                {analysis.trend}
              </p>
              <p className="text-xs text-muted-foreground">
                {analysis.riskManagement.confidence}% confidence
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="cyber-border rounded-xl p-4">
          <p className="text-sm leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Trading Signals */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Entry</p>
            <p className="font-mono font-bold text-primary">{analysis.signals.entry}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
            <p className="font-mono font-bold text-bear">{analysis.signals.stopLoss}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Take Profit 1</p>
            <p className="font-mono font-bold text-bull">{analysis.signals.takeProfit1}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Take Profit 2</p>
            <p className="font-mono font-bold text-bull">{analysis.signals.takeProfit2}</p>
          </div>
        </div>

        {/* Technical Analysis & Risk Management */}
        <div className="grid grid-cols-2 gap-6">
          {/* Technical */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              Technical Analysis
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">RSI</span>
                <span className="text-sm">{analysis.technicalAnalysis.rsi}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">MACD</span>
                <span className="text-sm">{analysis.technicalAnalysis.macd}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Trend</span>
                <span className="text-sm">{analysis.technicalAnalysis.trend}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Support Levels</p>
                  {analysis.technicalAnalysis.support.map((level, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs py-1">
                      <Shield className="w-3 h-3 text-bull" />
                      <span className="text-bull font-mono">{level}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Resistance Levels</p>
                  {analysis.technicalAnalysis.resistance.map((level, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs py-1">
                      <Target className="w-3 h-3 text-bear" />
                      <span className="text-bear font-mono">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Risk Management */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              Risk Management
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Risk/Reward</span>
                <span className="text-sm font-semibold text-accent">{analysis.riskManagement.riskReward}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Position Size</span>
                <span className="text-sm">{analysis.riskManagement.positionSize}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <span className={cn(
                  "text-sm font-semibold px-2 py-0.5 rounded",
                  analysis.riskManagement.riskLevel === "Low" && "bg-bull/10 text-bull",
                  analysis.riskManagement.riskLevel === "Medium" && "bg-neutral/10 text-neutral",
                  analysis.riskManagement.riskLevel === "High" && "bg-bear/10 text-bear"
                )}>
                  {analysis.riskManagement.riskLevel}
                </span>
              </div>
              
              {/* Confidence gauge */}
              <div className="pt-2">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-semibold">{analysis.riskManagement.confidence}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${analysis.riskManagement.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scenarios */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-secondary" />
            Possible Scenarios
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            {analysis.scenarios.map((scenario, i) => {
              const scenarioTrend = trendConfig[scenario.type];
              const ScenarioIcon = scenarioTrend.icon;
              
              return (
                <div 
                  key={i} 
                  className={cn(
                    "rounded-lg border p-4",
                    scenarioTrend.bgLight,
                    scenarioTrend.border
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ScenarioIcon className={cn("w-4 h-4", scenarioTrend.color)} />
                      <span className={cn("text-sm font-semibold uppercase", scenarioTrend.color)}>
                        {scenario.type}
                      </span>
                    </div>
                    <span className={cn("text-xs font-bold", scenarioTrend.color)}>
                      {scenario.probability}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {scenario.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Patterns */}
        <div className="flex flex-wrap gap-2">
          {analysis.technicalAnalysis.patterns.map((pattern, i) => (
            <span 
              key={i}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
            >
              {pattern}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
