import { useState } from "react";
import { History, Play, BarChart2, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BacktestResult {
  trades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  netProfit: number;
  netProfitPercent: number;
  sharpeRatio: number;
}

const STRATEGIES = [
  { id: "ma_cross", name: "MA Crossover", description: "SMA 20/50 crossover strategy" },
  { id: "rsi_reversal", name: "RSI Reversal", description: "RSI oversold/overbought reversals" },
  { id: "breakout", name: "Breakout", description: "Support/resistance breakout strategy" },
  { id: "mean_reversion", name: "Mean Reversion", description: "Bollinger Bands mean reversion" },
];

export function BacktestPanel() {
  const [selectedStrategy, setSelectedStrategy] = useState(STRATEGIES[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);

  const runBacktest = async () => {
    setIsRunning(true);
    setResults(null);

    // Simulate backtest running
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock results
    const mockResults: BacktestResult = {
      trades: Math.floor(Math.random() * 100 + 50),
      winRate: Math.random() * 30 + 50,
      profitFactor: Math.random() * 2 + 1,
      maxDrawdown: Math.random() * 20 + 5,
      netProfit: Math.random() * 50000 - 10000,
      netProfitPercent: Math.random() * 100 - 20,
      sharpeRatio: Math.random() * 2 + 0.5,
    };

    setResults(mockResults);
    setIsRunning(false);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <History className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold">Strategy Backtest</h3>
      </div>

      {/* Strategy Selection */}
      <div className="p-4 border-b border-border/50">
        <p className="text-xs text-muted-foreground mb-3">Select Strategy</p>
        <div className="space-y-2">
          {STRATEGIES.map((strategy) => (
            <button
              key={strategy.id}
              onClick={() => setSelectedStrategy(strategy.id)}
              className={cn(
                "w-full p-3 rounded-lg border text-left transition-all",
                selectedStrategy === strategy.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              )}
            >
              <p className="text-sm font-medium">{strategy.name}</p>
              <p className="text-xs text-muted-foreground">{strategy.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Run Button */}
      <div className="p-4 border-b border-border/50">
        <Button
          onClick={runBacktest}
          disabled={isRunning}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          {isRunning ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
              Running Backtest...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Backtest
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {results ? (
          <div className="space-y-4 animate-fade-in">
            {/* Net Profit */}
            <div className={cn(
              "p-4 rounded-lg border",
              results.netProfit >= 0 ? "border-bull/30 bg-bull/10" : "border-bear/30 bg-bear/10"
            )}>
              <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
              <div className="flex items-center gap-2">
                {results.netProfit >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-bull" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-bear" />
                )}
                <span className={cn(
                  "font-display text-2xl font-bold",
                  results.netProfit >= 0 ? "text-bull" : "text-bear"
                )}>
                  {results.netProfit >= 0 ? "+" : ""}${results.netProfit.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({results.netProfitPercent.toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Total Trades</p>
                <p className="font-mono font-bold">{results.trades}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                <p className={cn(
                  "font-mono font-bold",
                  results.winRate >= 50 ? "text-bull" : "text-bear"
                )}>
                  {results.winRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Profit Factor</p>
                <p className={cn(
                  "font-mono font-bold",
                  results.profitFactor >= 1.5 ? "text-bull" : results.profitFactor >= 1 ? "text-neutral" : "text-bear"
                )}>
                  {results.profitFactor.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Max Drawdown</p>
                <p className="font-mono font-bold text-bear">-{results.maxDrawdown.toFixed(1)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Sharpe Ratio</p>
                <p className={cn(
                  "font-mono font-bold",
                  results.sharpeRatio >= 1.5 ? "text-bull" : results.sharpeRatio >= 1 ? "text-neutral" : "text-bear"
                )}>
                  {results.sharpeRatio.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <BarChart2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Select a strategy and run a backtest to see results
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
