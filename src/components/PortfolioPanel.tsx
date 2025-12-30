import { Briefcase, TrendingUp, TrendingDown, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { portfolioPositions, formatVolume } from "@/lib/market-data";

export function PortfolioPanel() {
  const totalValue = portfolioPositions.reduce((acc, pos) => acc + pos.value, 0);
  const totalPnl = portfolioPositions.reduce((acc, pos) => acc + pos.pnl, 0);
  const totalPnlPercent = (totalPnl / (totalValue - totalPnl)) * 100;

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold">Portfolio</h3>
        </div>

        {/* Total Value */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Total Value</p>
          <p className="font-display text-2xl font-bold">
            ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <div className={cn(
            "flex items-center gap-2 text-sm",
            totalPnl >= 0 ? "text-bull" : "text-bear"
          )}>
            {totalPnl >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>
              {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs">
              ({totalPnlPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Positions ({portfolioPositions.length})</p>
        </div>

        {portfolioPositions.map((position) => (
          <div
            key={position.symbol}
            className="p-4 border-b border-border/50 hover:bg-muted/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-sm">{position.symbol}</p>
                <p className="text-xs text-muted-foreground">{position.name}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm">
                  ${position.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <div className={cn(
                  "flex items-center justify-end gap-1 text-xs",
                  position.pnl >= 0 ? "text-bull" : "text-bear"
                )}>
                  {position.pnl >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {position.pnl >= 0 ? "+" : ""}${position.pnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Qty: {position.quantity}</span>
              <span>Avg: ${position.avgPrice.toLocaleString()}</span>
              <span className={cn(
                position.pnlPercent >= 0 ? "text-bull" : "text-bear"
              )}>
                {position.pnlPercent >= 0 ? "+" : ""}{position.pnlPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Best Performer</p>
            <p className="text-sm font-semibold text-bull">BTC +50.07%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Worst Performer</p>
            <p className="text-sm font-semibold text-muted-foreground">ETH +8.02%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
