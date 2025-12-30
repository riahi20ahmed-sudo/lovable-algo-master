import { useState } from "react";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/lib/types";

const mockAlerts: Alert[] = [
  { id: "1", symbol: "BTC/USD", type: "price", condition: "above", value: 100000, triggered: false, createdAt: new Date() },
  { id: "2", symbol: "ETH/USD", type: "price", condition: "below", value: 3000, triggered: true, createdAt: new Date() },
  { id: "3", symbol: "SOL/USD", type: "percent", condition: "above", value: 10, triggered: false, createdAt: new Date() },
  { id: "4", symbol: "BTC/USD", type: "price", condition: "below", value: 90000, triggered: false, createdAt: new Date() },
  { id: "5", symbol: "AAPL", type: "price", condition: "above", value: 200, triggered: false, createdAt: new Date() },
];

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold">Price Alerts</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Active alerts count */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs text-muted-foreground">
            {alerts.filter(a => !a.triggered).length} Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-muted" />
          <span className="text-xs text-muted-foreground">
            {alerts.filter(a => a.triggered).length} Triggered
          </span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "p-4 border-b border-border/50 transition-colors",
              alert.triggered ? "bg-muted/20 opacity-60" : "hover:bg-muted/10"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{alert.symbol}</span>
                  {alert.triggered && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-bull/20 text-bull">
                      TRIGGERED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {alert.condition === "above" ? (
                    <TrendingUp className="w-3 h-3 text-bull" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-bear" />
                  )}
                  <span>
                    {alert.type === "price" ? "Price" : "Change"} {alert.condition}{" "}
                    {alert.type === "price" ? "$" : ""}{alert.value}
                    {alert.type === "percent" ? "%" : ""}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-bear"
                onClick={() => deleteAlert(alert.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick add */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </div>
    </div>
  );
}
