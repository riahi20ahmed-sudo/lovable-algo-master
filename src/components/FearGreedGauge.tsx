import { Gauge } from "lucide-react";

export function FearGreedGauge() {
  const value = 72;
  const label = value >= 75 ? "Extreme Greed" : value >= 55 ? "Greed" : value >= 45 ? "Neutral" : value >= 25 ? "Fear" : "Extreme Fear";
  const color = value >= 55 ? "text-bull" : value >= 45 ? "text-neutral" : "text-bear";
  
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold text-sm">Fear & Greed Index</h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3"/>
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--bull))" strokeWidth="3" strokeDasharray={`${value}, 100`}/>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-xl">{value}</span>
          </div>
        </div>
        <div>
          <p className={`font-display font-bold ${color}`}>{label}</p>
          <p className="text-xs text-muted-foreground">Updated 1h ago</p>
        </div>
      </div>
    </div>
  );
}
