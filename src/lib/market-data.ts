import { MarketData, CandleData, WatchlistItem, NewsItem, OrderBookEntry, EconomicEvent, PortfolioPosition } from "./types";

// Mock market data
export const marketData: MarketData[] = [
  { symbol: "BTC/USD", name: "Bitcoin", price: 97543.21, change: 2341.50, changePercent: 2.46, high24h: 98100, low24h: 94200, volume: 34500000000 },
  { symbol: "ETH/USD", name: "Ethereum", price: 3456.78, change: -45.32, changePercent: -1.29, high24h: 3520, low24h: 3380, volume: 18200000000 },
  { symbol: "SOL/USD", name: "Solana", price: 189.45, change: 12.34, changePercent: 6.97, high24h: 195, low24h: 175, volume: 5600000000 },
  { symbol: "XRP/USD", name: "Ripple", price: 2.18, change: 0.15, changePercent: 7.39, high24h: 2.25, low24h: 1.98, volume: 8900000000 },
  { symbol: "AAPL", name: "Apple Inc", price: 178.52, change: 3.21, changePercent: 1.83, high24h: 180.10, low24h: 175.80, volume: 52000000 },
  { symbol: "TSLA", name: "Tesla Inc", price: 248.30, change: -8.45, changePercent: -3.29, high24h: 258.00, low24h: 245.20, volume: 98000000 },
  { symbol: "EUR/USD", name: "Euro/Dollar", price: 1.0854, change: 0.0021, changePercent: 0.19, high24h: 1.0875, low24h: 1.0820, volume: 156000000000 },
  { symbol: "GOLD", name: "Gold", price: 2048.50, change: 15.30, changePercent: 0.75, high24h: 2055, low24h: 2030, volume: 890000000 },
];

// Generate candles
export function generateCandles(count: number, basePrice: number): CandleData[] {
  const candles: CandleData[] = [];
  let price = basePrice;
  const now = Date.now();

  for (let i = count; i > 0; i--) {
    const volatility = 0.015 + Math.random() * 0.01;
    const trend = Math.sin(i / 20) * 0.3 + (Math.random() - 0.48);
    const change = trend * price * volatility;

    const open = price;
    const close = price + change;
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
    const volume = 1000000 + Math.random() * 5000000 * (1 + Math.abs(change / price) * 10);

    candles.push({
      time: now - i * 60 * 60 * 1000,
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
  }

  return candles;
}

// Watchlist data
export const watchlistData: WatchlistItem[] = [
  { symbol: "BTC/USD", name: "Bitcoin", price: 97543.21, change: 2341.50, changePercent: 2.46 },
  { symbol: "ETH/USD", name: "Ethereum", price: 3456.78, change: -45.32, changePercent: -1.29 },
  { symbol: "SOL/USD", name: "Solana", price: 189.45, change: 12.34, changePercent: 6.97 },
  { symbol: "AVAX/USD", name: "Avalanche", price: 42.15, change: 2.18, changePercent: 5.45 },
  { symbol: "LINK/USD", name: "Chainlink", price: 15.82, change: -0.45, changePercent: -2.77 },
  { symbol: "DOT/USD", name: "Polkadot", price: 7.23, change: 0.34, changePercent: 4.93 },
];

// News data
export const newsData: NewsItem[] = [
  { id: "1", title: "Bitcoin Breaks $97K as Institutional Demand Surges", source: "CryptoNews", time: "5m ago", sentiment: "bullish", impact: "high" },
  { id: "2", title: "Fed Signals Potential Rate Cuts in 2024", source: "Bloomberg", time: "15m ago", sentiment: "bullish", impact: "high" },
  { id: "3", title: "Ethereum ETF Applications Under Review", source: "Reuters", time: "32m ago", sentiment: "bullish", impact: "medium" },
  { id: "4", title: "China Increases Crypto Mining Restrictions", source: "SCMP", time: "1h ago", sentiment: "bearish", impact: "medium" },
  { id: "5", title: "DeFi Total Value Locked Reaches New ATH", source: "DeFi Pulse", time: "2h ago", sentiment: "bullish", impact: "medium" },
  { id: "6", title: "Major Exchange Reports Technical Issues", source: "CoinDesk", time: "3h ago", sentiment: "neutral", impact: "low" },
];

// Order book data generator
export function generateOrderBook(basePrice: number, depth: number = 15): { bids: OrderBookEntry[]; asks: OrderBookEntry[] } {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 0; i < depth; i++) {
    const bidPrice = basePrice * (1 - (i + 1) * 0.001);
    const bidAmount = Math.random() * 10 + 0.5;
    bidTotal += bidAmount;
    bids.push({ price: bidPrice, amount: bidAmount, total: bidTotal });

    const askPrice = basePrice * (1 + (i + 1) * 0.001);
    const askAmount = Math.random() * 10 + 0.5;
    askTotal += askAmount;
    asks.push({ price: askPrice, amount: askAmount, total: askTotal });
  }

  return { bids, asks };
}

// Economic calendar events
export const economicEvents: EconomicEvent[] = [
  { id: "1", title: "US Non-Farm Payrolls", country: "US", time: "Today 14:30", impact: "high", forecast: "175K", previous: "150K" },
  { id: "2", title: "ECB Interest Rate Decision", country: "EU", time: "Tomorrow 13:45", impact: "high", forecast: "4.50%", previous: "4.50%" },
  { id: "3", title: "UK GDP YoY", country: "UK", time: "Tomorrow 08:00", impact: "high", forecast: "0.5%", previous: "0.3%" },
  { id: "4", title: "US CPI MoM", country: "US", time: "Dec 12 14:30", impact: "high", forecast: "0.2%", previous: "0.2%" },
  { id: "5", title: "Japan BOJ Rate Decision", country: "JP", time: "Dec 19 05:00", impact: "high", forecast: "-0.10%", previous: "-0.10%" },
];

// Portfolio positions
export const portfolioPositions: PortfolioPosition[] = [
  { symbol: "BTC/USD", name: "Bitcoin", quantity: 1.5, avgPrice: 65000, currentPrice: 97543.21, value: 146314.82, pnl: 48814.82, pnlPercent: 50.07 },
  { symbol: "ETH/USD", name: "Ethereum", quantity: 15, avgPrice: 3200, currentPrice: 3456.78, value: 51851.70, pnl: 3851.70, pnlPercent: 8.02 },
  { symbol: "SOL/USD", name: "Solana", quantity: 100, avgPrice: 150, currentPrice: 189.45, value: 18945, pnl: 3945, pnlPercent: 26.30 },
  { symbol: "AAPL", name: "Apple Inc", quantity: 50, avgPrice: 165, currentPrice: 178.52, value: 8926, pnl: 676, pnlPercent: 8.19 },
];

// Format price based on asset type
export function formatPrice(price: number, symbol: string): string {
  if (symbol.includes("EUR") || symbol.includes("GBP")) {
    return price.toFixed(5);
  }
  if (price > 1000) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (price > 1) {
    return price.toFixed(2);
  }
  return price.toFixed(4);
}

// Format large numbers
export function formatVolume(volume: number): string {
  if (volume >= 1e12) return (volume / 1e12).toFixed(2) + "T";
  if (volume >= 1e9) return (volume / 1e9).toFixed(2) + "B";
  if (volume >= 1e6) return (volume / 1e6).toFixed(2) + "M";
  if (volume >= 1e3) return (volume / 1e3).toFixed(2) + "K";
  return volume.toString();
}
