import { Plus, Star, TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { watchlistData } from "@/lib/market-data";

interface WatchlistPanelProps {
  onSelectSymbol: (symbol: string) => void;
}

export function WatchlistPanel({ onSelectSymbol }: WatchlistPanelProps) {
  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-display font-semibold">Watchlist</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {watchlistData.map((item) => (
          <button
            key={item.symbol}
            onClick={() => onSelectSymbol(item.symbol)}
            className="w-full p-4 flex items-center gap-3 border-b border-border/50 hover:bg-muted/30 transition-colors group"
          >
            {/* Star */}
            <Star className="w-4 h-4 text-neutral fill-neutral" />
            
            {/* Info */}
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">{item.symbol}</p>
              <p className="text-xs text-muted-foreground">{item.name}</p>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-mono text-sm">
                ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <div className={cn(
                "flex items-center justify-end gap-1 text-xs",
                item.change >= 0 ? "text-bull" : "text-bear"
              )}>
                {item.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {item.change >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Actions */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </button>
        ))}
      </div>

      {/* Add symbol */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Symbol
        </Button>
      </div>
    </div>
  );
}
