import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  DollarSign,
  BarChart3,
  Gauge
} from "lucide-react";
import { marketData, formatVolume } from "@/lib/market-data";

export function QuickStats() {
  // Calculate market stats
  const totalMarketCap = marketData.reduce((acc, item) => acc + (item.marketCap || 0), 0);
  const totalVolume = marketData.reduce((acc, item) => acc + item.volume, 0);
  const bullishCount = marketData.filter((item) => item.change > 0).length;
  const bearishCount = marketData.filter((item) => item.change < 0).length;
  const avgChange = marketData.reduce((acc, item) => acc + item.changePercent, 0) / marketData.length;

  const stats = [
    {
      label: "BTC Dominance",
      value: "52.4%",
      change: 0.3,
      icon: Activity,
      color: "text-primary",
    },
    {
      label: "24h Volume",
      value: "$" + formatVolume(totalVolume),
      change: 12.5,
      icon: BarChart3,
      color: "text-secondary",
    },
    {
      label: "Fear & Greed",
      value: "72",
      subLabel: "Greed",
      icon: Gauge,
      color: "text-accent",
    },
    {
      label: "Gainers/Losers",
      value: `${bullishCount}/${bearishCount}`,
      icon: TrendingUp,
      color: bullishCount > bearishCount ? "text-bull" : "text-bear",
    },
  ];

  return (
    <div className="h-12 bg-background/50 border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <span className="text-sm font-semibold font-display">{stat.value}</span>
              {stat.subLabel && (
                <span className="text-xs text-accent">{stat.subLabel}</span>
              )}
              {stat.change !== undefined && (
                <span
                  className={`text-xs ${
                    stat.change >= 0 ? "text-bull" : "text-bear"
                  }`}
                >
                  {stat.change >= 0 ? "+" : ""}
                  {stat.change}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-bull animate-pulse" />
          <span className="text-xs text-muted-foreground">Markets Open</span>
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          {new Date().toLocaleTimeString("en-US", { hour12: false })} UTC
        </div>
      </div>
    </div>
  );
}
