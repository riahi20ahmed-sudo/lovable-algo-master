import { Activity, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { marketData } from "@/lib/market-data";

export function MarketTicker() {
  const tickerItems = [...marketData, ...marketData]; // Duplicate for seamless loop

  return (
    <div className="h-10 bg-card/50 border-b border-border overflow-hidden relative">
      {/* Live indicator */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10 bg-card/90 pr-4">
        <div className="live-dot" />
        <span className="text-xs font-medium text-primary">LIVE</span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex items-center h-full ticker-scroll pl-24">
        {tickerItems.map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-3 px-6 border-r border-border/50 whitespace-nowrap"
          >
            <span className="font-display text-xs font-semibold text-foreground">
              {item.symbol}
            </span>
            <span className="text-sm font-mono">
              ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <div
              className={`flex items-center gap-1 text-xs ${
                item.change >= 0 ? "bull-indicator" : "bear-indicator"
              }`}
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
        ))}
      </div>

      {/* Gradient fade edges */}
      <div className="absolute left-20 top-0 bottom-0 w-8 bg-gradient-to-r from-card/90 to-transparent z-5" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card/90 to-transparent" />
    </div>
  );
}
