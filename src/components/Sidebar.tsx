import { 
  MessageSquare, 
  BarChart3, 
  LineChart, 
  ListPlus, 
  Bell, 
  Briefcase,
  History,
  Newspaper,
  BookOpen,
  Grid3X3,
  Calendar,
  DollarSign,
  Brain,
  Zap,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewType =
  | "chat"
  | "analysis"
  | "strategies"
  | "chart"
  | "watchlist"
  | "alerts"
  | "portfolio"
  | "backtest"
  | "news"
  | "orderbook"
  | "heatmap"
  | "calendar"
  | "prices";

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const menuItems = [
  { 
    section: "Trading",
    items: [
      { id: "chart", icon: LineChart, label: "Pro Chart", badge: null },
      { id: "chat", icon: Brain, label: "AI Analysis", badge: "AI" },
      { id: "strategies", icon: Target, label: "Strategies", badge: null },
    ]
  },
  {
    section: "Markets",
    items: [
      { id: "prices", icon: DollarSign, label: "Live Prices", badge: "LIVE" },
      { id: "watchlist", icon: ListPlus, label: "Watchlist", badge: null },
      { id: "orderbook", icon: BookOpen, label: "Order Book", badge: null },
      { id: "heatmap", icon: Grid3X3, label: "Heatmap", badge: null },
    ]
  },
  {
    section: "Research",
    items: [
      { id: "news", icon: Newspaper, label: "News Feed", badge: "3" },
      { id: "calendar", icon: Calendar, label: "Calendar", badge: null },
      { id: "backtest", icon: History, label: "Backtest", badge: null },
    ]
  },
  {
    section: "Portfolio",
    items: [
      { id: "portfolio", icon: Briefcase, label: "Portfolio", badge: null },
      { id: "alerts", icon: Bell, label: "Alerts", badge: "5" },
    ]
  }
];

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((section) => (
          <div key={section.section} className="mb-6">
            <div className="px-4 mb-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {section.section}
              </span>
            </div>
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 relative group",
                  activeView === item.id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                )}
              >
                {/* Active indicator */}
                {activeView === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-neon" />
                )}
                
                <item.icon className={cn(
                  "w-4 h-4 transition-all",
                  activeView === item.id && "drop-shadow-[0_0_8px_hsl(var(--primary))]"
                )} />
                
                <span className="flex-1 text-left">{item.label}</span>
                
                {item.badge && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium",
                    item.badge === "AI" 
                      ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30"
                      : item.badge === "LIVE"
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : "bg-muted text-muted-foreground"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="cyber-border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-foreground">Pro Mode</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Unlock advanced AI analysis, custom indicators & real-time signals
          </p>
          <button className="mt-3 w-full py-1.5 text-xs font-medium rounded bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-opacity">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
