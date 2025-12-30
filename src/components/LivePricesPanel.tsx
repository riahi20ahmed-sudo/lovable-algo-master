import { TrendingUp, TrendingDown, DollarSign, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealTimePrices } from "@/lib/useRealTimePrices";
import { formatVolume } from "@/lib/market-data";

interface LivePricesPanelProps {
  onSelectSymbol: (symbol: string) => void;
}

export function LivePricesPanel({ onSelectSymbol }: LivePricesPanelProps) {
  const { prices, loading, lastUpdate, priceChanges, refetch } = useRealTimePrices(8000);

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="live-dot" />
            <DollarSign className="w-4 h-4 text-primary" />
            <h3 className="font-display font-semibold">Live Prices</h3>
          </div>
          <button 
            onClick={refetch}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            title="Refresh prices"
          >
            <RefreshCw className={cn("w-4 h-4 text-muted-foreground", loading && "animate-spin")} />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Last updated: {lastUpdate.toLocaleTimeString()} • Auto-refresh every 8s
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && prices.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          prices.map((item, index) => (
            <button 
              key={item.symbol} 
              onClick={() => onSelectSymbol(item.symbol)}
              className={cn(
                "w-full p-4 flex items-center gap-3 border-b border-border/50 hover:bg-muted/10 transition-all duration-300 animate-fade-in",
                priceChanges[item.symbol] === "up" && "bg-bull/10",
                priceChanges[item.symbol] === "down" && "bg-bear/10"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Rank */}
              <div className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                {index + 1}
              </div>

              {/* Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{item.symbol}</p>
                  {priceChanges[item.symbol] && (
                    <Sparkles className={cn(
                      "w-3 h-3 animate-pulse",
                      priceChanges[item.symbol] === "up" ? "text-bull" : "text-bear"
                    )} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{item.name}</p>
              </div>

              {/* Sparkline mini chart */}
              {item.sparkline && item.sparkline.length > 0 && (
                <div className="w-16 h-8">
                  <svg viewBox="0 0 64 32" className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke={item.change >= 0 ? "hsl(var(--bull))" : "hsl(var(--bear))"}
                      strokeWidth="1.5"
                      points={item.sparkline.slice(-20).map((price, i, arr) => {
                        const min = Math.min(...arr);
                        const max = Math.max(...arr);
                        const range = max - min || 1;
                        const x = (i / (arr.length - 1)) * 64;
                        const y = 32 - ((price - min) / range) * 28 - 2;
                        return `${x},${y}`;
                      }).join(" ")}
                    />
                  </svg>
                </div>
              )}

              {/* Price */}
              <div className="text-right">
                <p className={cn(
                  "font-mono text-sm font-semibold transition-all duration-300",
                  priceChanges[item.symbol] === "up" && "text-bull scale-105",
                  priceChanges[item.symbol] === "down" && "text-bear scale-105"
                )}>
                  ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: item.price < 1 ? 6 : 2 })}
                </p>
                <div className={cn(
                  "flex items-center justify-end gap-1 text-xs",
                  item.change >= 0 ? "text-bull" : "text-bear"
                )}>
                  {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>
                    {item.change >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Volume summary */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Volume</p>
            <p className="text-sm font-semibold text-primary">
              ${formatVolume(prices.reduce((acc, p) => acc + p.volume, 0))}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Gainers/Losers</p>
            <p className="text-sm font-semibold">
              <span className="text-bull">{prices.filter(p => p.change > 0).length}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-bear">{prices.filter(p => p.change < 0).length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
