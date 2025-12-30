import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { marketData } from "@/lib/market-data";

interface LivePricesPanelProps {
  onSelectSymbol: (symbol: string) => void;
}

export function LivePricesPanel({ onSelectSymbol }: LivePricesPanelProps) {
  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <div className="live-dot" />
        <DollarSign className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold">Live Prices</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {marketData.map((item) => (
          <button key={item.symbol} onClick={() => onSelectSymbol(item.symbol)}
            className="w-full p-4 flex items-center gap-3 border-b border-border/50 hover:bg-muted/10 transition-colors">
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">{item.symbol}</p>
              <p className="text-xs text-muted-foreground">{item.name}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm">${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              <div className={cn("flex items-center justify-end gap-1 text-xs", item.change >= 0 ? "text-bull" : "text-bear")}>
                {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{item.change >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
