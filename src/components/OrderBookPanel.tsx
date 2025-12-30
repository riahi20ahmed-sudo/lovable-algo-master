import { useState, useEffect } from "react";
import { BookOpen, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealTimePrices, getBasePrice } from "@/lib/useRealTimePrices";

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface OrderBookPanelProps {
  symbol: string;
}

function generateOrderBook(basePrice: number, depth: number = 15): { bids: OrderBookEntry[]; asks: OrderBookEntry[] } {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 0; i < depth; i++) {
    const spread = 0.0005 + Math.random() * 0.001;
    const bidPrice = basePrice * (1 - (i + 1) * spread);
    const bidAmount = Math.random() * 5 + 0.1;
    bidTotal += bidAmount;
    bids.push({ price: bidPrice, amount: bidAmount, total: bidTotal });

    const askPrice = basePrice * (1 + (i + 1) * spread);
    const askAmount = Math.random() * 5 + 0.1;
    askTotal += askAmount;
    asks.push({ price: askPrice, amount: askAmount, total: askTotal });
  }

  return { bids, asks };
}

export function OrderBookPanel({ symbol }: OrderBookPanelProps) {
  const { prices } = useRealTimePrices(8000);
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookEntry[]; asks: OrderBookEntry[] }>({ bids: [], asks: [] });
  const [lastPrice, setLastPrice] = useState<number>(0);
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | null>(null);

  const basePrice = getBasePrice(symbol, prices);

  useEffect(() => {
    // Generate initial order book
    setOrderBook(generateOrderBook(basePrice));

    // Update order book every 2 seconds for realistic movement
    const interval = setInterval(() => {
      setOrderBook(generateOrderBook(basePrice));
      
      // Simulate price movement
      const newPrice = basePrice * (1 + (Math.random() - 0.5) * 0.001);
      setPriceDirection(newPrice > lastPrice ? "up" : newPrice < lastPrice ? "down" : null);
      setLastPrice(newPrice);
    }, 2000);

    return () => clearInterval(interval);
  }, [basePrice, symbol]);

  const maxTotal = Math.max(
    ...orderBook.bids.map((b) => b.total),
    ...orderBook.asks.map((a) => a.total)
  );

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(6);
    if (price > 1000) return price.toFixed(2);
    return price.toFixed(4);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold">Order Book</h3>
        </div>
        <span className="text-xs text-muted-foreground">{symbol}</span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 px-4 py-2 text-xs text-muted-foreground border-b border-border/50">
        <span>Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (sell orders) - reversed so highest is at top */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto flex flex-col-reverse">
          {orderBook.asks.slice().reverse().map((ask, i) => (
            <div
              key={`ask-${i}`}
              className="grid grid-cols-3 px-4 py-1 text-xs relative hover:bg-bear/10 transition-colors"
            >
              {/* Depth visualization */}
              <div
                className="absolute right-0 top-0 bottom-0 bg-bear/20 transition-all duration-300"
                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
              />
              <span className="text-bear font-mono relative z-10">{formatPrice(ask.price)}</span>
              <span className="text-right font-mono relative z-10">{ask.amount.toFixed(4)}</span>
              <span className="text-right font-mono text-muted-foreground relative z-10">{ask.total.toFixed(4)}</span>
            </div>
          ))}
        </div>

        {/* Spread / Current Price */}
        <div className={cn(
          "px-4 py-3 border-y border-border flex items-center justify-between transition-colors duration-300",
          priceDirection === "up" && "bg-bull/10",
          priceDirection === "down" && "bg-bear/10"
        )}>
          <span className="text-xs text-muted-foreground">Spread</span>
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-mono font-bold text-lg transition-all duration-300",
              priceDirection === "up" && "text-bull scale-105",
              priceDirection === "down" && "text-bear scale-105",
              !priceDirection && "text-foreground"
            )}>
              ${formatPrice(basePrice)}
            </span>
            {priceDirection && (
              <span className={cn(
                "text-xs",
                priceDirection === "up" ? "text-bull" : "text-bear"
              )}>
                {priceDirection === "up" ? "▲" : "▼"}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {((orderBook.asks[0]?.price || 0) - (orderBook.bids[0]?.price || 0)).toFixed(2)}
          </span>
        </div>

        {/* Bids (buy orders) */}
        <div className="flex-1 overflow-y-auto">
          {orderBook.bids.map((bid, i) => (
            <div
              key={`bid-${i}`}
              className="grid grid-cols-3 px-4 py-1 text-xs relative hover:bg-bull/10 transition-colors"
            >
              {/* Depth visualization */}
              <div
                className="absolute right-0 top-0 bottom-0 bg-bull/20 transition-all duration-300"
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              />
              <span className="text-bull font-mono relative z-10">{formatPrice(bid.price)}</span>
              <span className="text-right font-mono relative z-10">{bid.amount.toFixed(4)}</span>
              <span className="text-right font-mono text-muted-foreground relative z-10">{bid.total.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Buy Volume</p>
            <p className="text-sm font-semibold text-bull">
              {orderBook.bids.reduce((acc, b) => acc + b.amount, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Sell Volume</p>
            <p className="text-sm font-semibold text-bear">
              {orderBook.asks.reduce((acc, a) => acc + a.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
