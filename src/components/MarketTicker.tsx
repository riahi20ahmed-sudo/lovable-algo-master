import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealTimePrices } from "@/lib/useRealTimePrices";

export function MarketTicker() {
  const { prices, loading, priceChanges } = useRealTimePrices(8000);

  // Duplicate for seamless loop
  const tickerItems = prices.length > 0 ? [...prices, ...prices] : [];

  return (
    <div className="h-10 bg-card/50 border-b border-border overflow-hidden relative">
      {/* Live indicator */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10 bg-card/90 pr-4">
        <div className="live-dot" />
        <span className="text-xs font-medium text-primary">LIVE</span>
        {loading && <RefreshCw className="w-3 h-3 text-muted-foreground animate-spin" />}
      </div>

      {/* Scrolling ticker */}
      <div className="flex items-center h-full ticker-scroll pl-24">
        {tickerItems.length > 0 ? (
          tickerItems.map((item, index) => (
            <div
              key={`${item.symbol}-${index}`}
              className={cn(
                "flex items-center gap-3 px-6 border-r border-border/50 whitespace-nowrap transition-colors duration-300",
                priceChanges[item.symbol] === "up" && "bg-bull/20",
                priceChanges[item.symbol] === "down" && "bg-bear/20"
              )}
            >
              <span className="font-display text-xs font-semibold text-foreground">
                {item.symbol}
              </span>
              <span className={cn(
                "text-sm font-mono transition-all duration-300",
                priceChanges[item.symbol] === "up" && "text-bull scale-105",
                priceChanges[item.symbol] === "down" && "text-bear scale-105"
              )}>
                ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs",
                  item.change >= 0 ? "bull-indicator" : "bear-indicator"
                )}
              >
                {item.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {item.change >= 0 ? "+" : ""}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2 px-6 text-muted-foreground">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading market data...</span>
          </div>
        )}
      </div>

      {/* Gradient fade edges */}
      <div className="absolute left-20 top-0 bottom-0 w-8 bg-gradient-to-r from-card/90 to-transparent z-5" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card/90 to-transparent" />
    </div>
  );
}
