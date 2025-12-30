import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { newsData } from "@/lib/market-data";

export function NewsPanel() {
  const sentimentConfig = {
    bullish: { icon: TrendingUp, color: "text-bull", bg: "bg-bull/10" },
    bearish: { icon: TrendingDown, color: "text-bear", bg: "bg-bear/10" },
    neutral: { icon: Minus, color: "text-neutral", bg: "bg-neutral/10" },
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Newspaper className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold">Market News</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {newsData.map((item) => {
          const sentiment = sentimentConfig[item.sentiment];
          const Icon = sentiment.icon;
          return (
            <div key={item.id} className="p-4 border-b border-border/50 hover:bg-muted/10 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", sentiment.bg)}>
                  <Icon className={cn("w-4 h-4", sentiment.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight mb-1 group-hover:text-primary transition-colors">{item.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px]", 
                      item.impact === "high" ? "bg-bear/20 text-bear" : 
                      item.impact === "medium" ? "bg-neutral/20 text-neutral" : "bg-muted text-muted-foreground"
                    )}>{item.impact.toUpperCase()}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
