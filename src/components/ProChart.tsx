import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { 
  Settings, 
  Maximize2, 
  Camera, 
  ZoomIn, 
  ZoomOut,
  Activity,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChartAnalysis, CandleData } from "@/lib/types";
import { generateCandles } from "@/lib/market-data";

interface ProChartProps {
  symbol: string;
  className?: string;
  onAnalysisUpdate?: (analysis: ChartAnalysis) => void;
}

const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1H", "4H", "1D", "1W"];
const CHART_TYPES = ["Candles", "Line", "Area", "Heikin-Ashi"];
const INDICATORS = ["MA", "EMA", "BOLL", "RSI", "MACD", "VOL"];

export function ProChart({ symbol, className, onAnalysisUpdate }: ProChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [activeTimeframe, setActiveTimeframe] = useState("4H");
  const [chartType, setChartType] = useState("Candles");
  const [activeIndicators, setActiveIndicators] = useState<string[]>(["VOL", "MA"]);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [zoom, setZoom] = useState(1);

  // Get base price based on symbol
  const getBasePrice = (sym: string) => {
    if (sym.includes("BTC")) return 97500;
    if (sym.includes("ETH")) return 3450;
    if (sym.includes("SOL")) return 189;
    if (sym.includes("EUR")) return 1.085;
    if (sym === "AAPL") return 178.5;
    if (sym === "TSLA") return 248.3;
    return 100;
  };

  // Generate candles on symbol/timeframe change
  useEffect(() => {
    const basePrice = getBasePrice(symbol);
    const newCandles = generateCandles(100, basePrice);
    setCandles(newCandles);
    
    // Update analysis
    if (onAnalysisUpdate) {
      const lastCandle = newCandles[newCandles.length - 1];
      const prevCandle = newCandles[newCandles.length - 2];
      const trend = lastCandle.close > prevCandle.close ? "bullish" : lastCandle.close < prevCandle.close ? "bearish" : "neutral";
      
      onAnalysisUpdate({
        trend,
        strength: Math.floor(Math.random() * 40 + 60),
        signals: trend === "bullish" 
          ? ["RSI bullish divergence", "MACD crossover forming", "Above 50 MA"]
          : ["RSI bearish divergence", "MACD crossover down", "Below 50 MA"],
        support: [basePrice * 0.97, basePrice * 0.94, basePrice * 0.90],
        resistance: [basePrice * 1.03, basePrice * 1.06, basePrice * 1.10],
        patterns: trend === "bullish" 
          ? ["Bull Flag", "Higher Low", "Ascending Triangle"]
          : ["Bear Flag", "Lower High", "Descending Triangle"],
      });
    }
  }, [symbol, activeTimeframe, onAnalysisUpdate]);

  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || candles.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.fillStyle = "hsl(220, 20%, 4%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "hsl(220, 20%, 10%)";
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i < 10; i++) {
      const y = (canvas.height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i < 20; i++) {
      const x = (canvas.width / 20) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Calculate price range
    const prices = candles.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...prices) * 0.998;
    const maxPrice = Math.max(...prices) * 1.002;
    const priceRange = maxPrice - minPrice;

    // Chart area
    const chartHeight = canvas.height * 0.75;
    const volumeHeight = canvas.height * 0.2;
    const candleWidth = (canvas.width - 60) / candles.length * zoom;
    const candleGap = candleWidth * 0.2;

    // Draw candles
    candles.forEach((candle, index) => {
      const x = 30 + index * candleWidth;
      const isGreen = candle.close >= candle.open;
      
      const openY = chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
      const closeY = chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
      const highY = chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
      const lowY = chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;

      // Candle wick
      ctx.strokeStyle = isGreen ? "hsl(150, 100%, 50%)" : "hsl(0, 90%, 55%)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2 - candleGap / 2, highY);
      ctx.lineTo(x + candleWidth / 2 - candleGap / 2, lowY);
      ctx.stroke();

      // Candle body
      ctx.fillStyle = isGreen ? "hsl(150, 100%, 50%)" : "hsl(0, 90%, 55%)";
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(closeY - openY), 1);
      ctx.fillRect(x, bodyTop, candleWidth - candleGap, bodyHeight);

      // Add glow effect for recent candles
      if (index > candles.length - 5) {
        ctx.shadowColor = isGreen ? "hsl(150, 100%, 50%)" : "hsl(0, 90%, 55%)";
        ctx.shadowBlur = 10;
        ctx.fillRect(x, bodyTop, candleWidth - candleGap, bodyHeight);
        ctx.shadowBlur = 0;
      }
    });

    // Draw volume bars
    const maxVolume = Math.max(...candles.map(c => c.volume));
    const volumeStartY = chartHeight + 20;

    candles.forEach((candle, index) => {
      const x = 30 + index * candleWidth;
      const isGreen = candle.close >= candle.open;
      const volumeBarHeight = (candle.volume / maxVolume) * volumeHeight;

      ctx.fillStyle = isGreen 
        ? "hsla(150, 100%, 50%, 0.3)" 
        : "hsla(0, 90%, 55%, 0.3)";
      ctx.fillRect(x, volumeStartY + volumeHeight - volumeBarHeight, candleWidth - candleGap, volumeBarHeight);
    });

    // Draw moving average
    if (activeIndicators.includes("MA")) {
      const ma20: number[] = [];
      for (let i = 0; i < candles.length; i++) {
        if (i < 20) {
          ma20.push(candles.slice(0, i + 1).reduce((sum, c) => sum + c.close, 0) / (i + 1));
        } else {
          ma20.push(candles.slice(i - 19, i + 1).reduce((sum, c) => sum + c.close, 0) / 20);
        }
      }

      ctx.strokeStyle = "hsl(180, 100%, 50%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ma20.forEach((ma, index) => {
        const x = 30 + index * candleWidth + candleWidth / 2;
        const y = chartHeight - ((ma - minPrice) / priceRange) * chartHeight;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Draw price labels on right side
    ctx.fillStyle = "hsl(220, 15%, 50%)";
    ctx.font = "10px JetBrains Mono";
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (priceRange / 5) * i;
      const y = chartHeight - (i / 5) * chartHeight;
      ctx.fillText(price.toFixed(2), canvas.width - 5, y + 3);
    }

    // Current price label
    const currentPrice = candles[candles.length - 1].close;
    const currentY = chartHeight - ((currentPrice - minPrice) / priceRange) * chartHeight;
    const isUp = candles[candles.length - 1].close >= candles[candles.length - 2].close;
    
    ctx.fillStyle = isUp ? "hsl(150, 100%, 50%)" : "hsl(0, 90%, 55%)";
    ctx.fillRect(canvas.width - 80, currentY - 10, 75, 20);
    ctx.fillStyle = "hsl(220, 20%, 4%)";
    ctx.font = "bold 11px JetBrains Mono";
    ctx.textAlign = "right";
    ctx.fillText(currentPrice.toFixed(2), canvas.width - 10, currentY + 4);

  }, [candles, zoom, activeIndicators, chartType]);

  const toggleIndicator = (indicator: string) => {
    setActiveIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const currentPrice = candles.length > 0 ? candles[candles.length - 1].close : 0;
  const priceChange = candles.length > 1 
    ? candles[candles.length - 1].close - candles[candles.length - 2].close 
    : 0;
  const priceChangePercent = candles.length > 1 
    ? (priceChange / candles[candles.length - 2].close) * 100 
    : 0;

  return (
    <div className={cn("flex flex-col bg-card rounded-lg border border-border overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg">{symbol}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono font-semibold">
              {currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <div className={cn(
              "flex items-center gap-1 text-sm",
              priceChange >= 0 ? "text-bull" : "text-bear"
            )}>
              {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Camera className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50">
        {/* Timeframes */}
        <div className="flex items-center gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded transition-all",
                activeTimeframe === tf
                  ? "bg-primary text-primary-foreground shadow-neon"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex items-center gap-1">
          {INDICATORS.map((ind) => (
            <button
              key={ind}
              onClick={() => toggleIndicator(ind)}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded transition-all",
                activeIndicators.includes(ind)
                  ? "bg-secondary/20 text-secondary border border-secondary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div ref={containerRef} className="flex-1 relative min-h-[400px]">
        <canvas ref={canvasRef} className="absolute inset-0" />
        
        {/* Crosshair info (would need mouse tracking) */}
        {hoveredCandle && (
          <div className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-2 text-xs">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-muted-foreground">O:</span>
              <span>{hoveredCandle.open.toFixed(2)}</span>
              <span className="text-muted-foreground">H:</span>
              <span className="text-bull">{hoveredCandle.high.toFixed(2)}</span>
              <span className="text-muted-foreground">L:</span>
              <span className="text-bear">{hoveredCandle.low.toFixed(2)}</span>
              <span className="text-muted-foreground">C:</span>
              <span>{hoveredCandle.close.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
