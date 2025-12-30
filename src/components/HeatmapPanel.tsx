import { cn } from "@/lib/utils";
import { useRealTimePrices } from "@/lib/useRealTimePrices";
import { TrendingUp, TrendingDown, Grid3X3 } from "lucide-react";

export function HeatmapPanel() {
  const { prices, priceChanges } = useRealTimePrices(8000);

  // Helper to get color intensity based on change percent
  const getHeatColor = (changePercent: number) => {
    const absChange = Math.abs(changePercent);
    const intensity = Math.min(absChange / 10, 1); // Cap at 10%
    
    if (changePercent > 0) {
      return `rgba(0, 255, 136, ${0.2 + intensity * 0.6})`;
    } else if (changePercent < 0) {
      return `rgba(255, 82, 82, ${0.2 + intensity * 0.6})`;
    }
    return "rgba(255, 193, 7, 0.3)";
  };

  const getTextColor = (changePercent: number) => {
    if (changePercent > 0) return "text-bull";
    if (changePercent < 0) return "text-bear";
    return "text-neutral";
  };

  // Calculate grid sizes based on market cap
  const getGridSize = (index: number) => {
    if (index === 0) return "col-span-2 row-span-2"; // BTC
    if (index === 1) return "col-span-2 row-span-1"; // ETH
    if (index < 5) return "col-span-1 row-span-1";
    return "col-span-1 row-span-1";
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Grid3X3 className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold">Market Heatmap</h3>
        <span className="text-xs text-muted-foreground ml-auto">Real-time • 24h Change</span>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-4 gap-2 h-full auto-rows-fr">
          {prices.map((item, index) => (
            <div
              key={item.symbol}
              className={cn(
                "relative rounded-lg p-3 flex flex-col justify-between transition-all duration-500 cursor-pointer hover:scale-[1.02] overflow-hidden group",
                getGridSize(index),
                priceChanges[item.symbol] && "ring-2 ring-white/30"
              )}
              style={{ backgroundColor: getHeatColor(item.changePercent) }}
            >
              {/* Animated pulse on price change */}
              {priceChanges[item.symbol] && (
                <div className="absolute inset-0 animate-ping opacity-30" 
                  style={{ backgroundColor: getHeatColor(item.changePercent) }} 
                />
              )}

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-foreground drop-shadow-md">
                    {item.symbol.replace("/USD", "")}
                  </span>
                  {item.changePercent >= 0 ? (
                    <TrendingUp className={cn("w-4 h-4", getTextColor(item.changePercent))} />
                  ) : (
                    <TrendingDown className={cn("w-4 h-4", getTextColor(item.changePercent))} />
                  )}
                </div>
                <p className="text-xs text-foreground/70 mt-1 truncate">{item.name}</p>
              </div>

              <div className="relative z-10 mt-auto">
                <p className="font-mono text-lg font-bold text-foreground drop-shadow-md">
                  ${item.price < 1 ? item.price.toFixed(6) : item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className={cn(
                  "text-sm font-semibold",
                  getTextColor(item.changePercent)
                )}>
                  {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                </p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-bear/60" />
            <span className="text-muted-foreground">Bearish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neutral/60" />
            <span className="text-muted-foreground">Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-bull/60" />
            <span className="text-muted-foreground">Bullish</span>
          </div>
        </div>
      </div>
    </div>
  );
}
