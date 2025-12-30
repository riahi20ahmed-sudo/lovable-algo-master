import { Calendar, Clock, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  countryFlag: string;
  time: string;
  impact: "high" | "medium" | "low";
  actual?: string;
  forecast?: string;
  previous?: string;
}

const economicEvents: EconomicEvent[] = [
  { id: "1", title: "US Non-Farm Payrolls", country: "US", countryFlag: "🇺🇸", time: "Today 14:30", impact: "high", forecast: "175K", previous: "150K" },
  { id: "2", title: "ECB Interest Rate Decision", country: "EU", countryFlag: "🇪🇺", time: "Tomorrow 13:45", impact: "high", forecast: "4.50%", previous: "4.50%" },
  { id: "3", title: "UK GDP YoY", country: "UK", countryFlag: "🇬🇧", time: "Tomorrow 08:00", impact: "high", forecast: "0.5%", previous: "0.3%" },
  { id: "4", title: "US CPI MoM", country: "US", countryFlag: "🇺🇸", time: "Jan 12 14:30", impact: "high", forecast: "0.2%", previous: "0.2%" },
  { id: "5", title: "Japan BOJ Rate Decision", country: "JP", countryFlag: "🇯🇵", time: "Jan 19 05:00", impact: "high", forecast: "-0.10%", previous: "-0.10%" },
  { id: "6", title: "China Trade Balance", country: "CN", countryFlag: "🇨🇳", time: "Jan 13 03:00", impact: "medium", forecast: "$75B", previous: "$71B" },
  { id: "7", title: "Australia Employment Change", country: "AU", countryFlag: "🇦🇺", time: "Jan 16 00:30", impact: "medium", forecast: "25K", previous: "15K" },
  { id: "8", title: "Canada CPI MoM", country: "CA", countryFlag: "🇨🇦", time: "Jan 21 14:30", impact: "high", forecast: "0.1%", previous: "0.0%" },
];

export function EconomicCalendar() {
  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold">Economic Calendar</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {economicEvents.map((event, index) => (
          <div
            key={event.id}
            className="p-4 border-b border-border/50 hover:bg-muted/10 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              {/* Flag */}
              <span className="text-xl">{event.countryFlag}</span>

              {/* Info */}
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">{event.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{event.time}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-medium",
                    event.impact === "high" && "bg-bear/20 text-bear",
                    event.impact === "medium" && "bg-neutral/20 text-neutral",
                    event.impact === "low" && "bg-muted text-muted-foreground"
                  )}>
                    {event.impact.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Forecast vs Previous */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <div className="text-center p-2 rounded bg-muted/30">
                <p className="text-muted-foreground mb-1">Previous</p>
                <p className="font-mono font-semibold">{event.previous}</p>
              </div>
              <div className="text-center p-2 rounded bg-primary/10 border border-primary/20">
                <p className="text-muted-foreground mb-1">Forecast</p>
                <p className="font-mono font-semibold text-primary">{event.forecast}</p>
              </div>
              <div className="text-center p-2 rounded bg-muted/30">
                <p className="text-muted-foreground mb-1">Actual</p>
                <p className="font-mono font-semibold text-muted-foreground">--</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Impact legend */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-bear" />
            <span className="text-muted-foreground">High Impact</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neutral" />
            <span className="text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted" />
            <span className="text-muted-foreground">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
