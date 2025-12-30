import { Bot, Bell, Settings, Search, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      {/* Logo & Title */}
      <div className="flex items-center gap-4 z-10">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
            <Bot className="w-6 h-6 text-background" />
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent blur-lg opacity-50" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold gradient-text">
            NEXUS TRADER
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            AI-Powered Analysis Engine
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-8 relative z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search markets, news, signals..."
            className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 z-10">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          <span className="text-xs">AI Analysis</span>
        </Button>
        
        <div className="h-6 w-px bg-border" />
        
        <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
        </Button>
        
        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Button>
        
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-border flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
